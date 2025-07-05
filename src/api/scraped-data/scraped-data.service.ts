import { Request, Response } from "express";

/**
 * ScrapedDataService
 * Handles business logic for scraped data and SSE events
 */

// In-memory storage for scraped data (replace with database in production)
interface ScrapedDataItem {
  id: string;
  data: any;
  timestamp: Date;
}

export class ScrapedDataService {
  private scrapedDataStore: ScrapedDataItem[] = [];
  private clients: Response[] = [];

  /**
   * Save scraped data
   */
  async saveScrapedData(data: any): Promise<ScrapedDataItem> {
    const newItem: ScrapedDataItem = {
      id: this.generateId(),
      data,
      timestamp: new Date(),
    };

    this.scrapedDataStore.push(newItem);
    
    // Send event to all connected clients
    this.sendToAllClients(newItem);
    
    return newItem;
  }

  /**
   * Get all scraped data
   */
  async getAllScrapedData(): Promise<ScrapedDataItem[]> {
    return this.scrapedDataStore;
  }

  /**
   * Get scraped data by ID
   */
  async getScrapedDataById(id: string): Promise<ScrapedDataItem | undefined> {
    return this.scrapedDataStore.find(item => item.id === id);
  }

  /**
   * Generate a simple ID
   * Note: In production, use a more robust ID generation method
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  }
  
  /**
   * Add a new client connection
   * @param client Express response object
   * @param req Express request object (optional)
   */
  addClient(client: Response, req?: Request): void {
    // Set headers for SSE with CORS support for all origins
    const corsHeaders: Record<string, string> = {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // Disable proxy buffering
      "Access-Control-Allow-Origin": "*", // Allow all origins
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };
  
    client.writeHead(200, corsHeaders);

    // Send initial connection message
    const connectEvent = JSON.stringify({
      type: "connection",
      message: "Connected to scraped-data SSE stream",
    });
    client.write(
      `event: connect\nid: ${Date.now()}\ndata: ${connectEvent}\n\n`
    );

    // Keep connection alive with heartbeat
    const heartbeatInterval = setInterval(() => {
      if (client.writableEnded) {
        clearInterval(heartbeatInterval);
        return;
      }
      client.write(`:heartbeat\n\n`);
    }, 30000); // Send heartbeat every 30 seconds

    // Add client to the list
    this.clients.push(client);

    // Handle client disconnect
    client.on("close", () => {
      clearInterval(heartbeatInterval);
      this.removeClient(client);
    });
  }

  /**
   * Remove a client connection
   * @param client Express response object
   */
  removeClient(client: Response): void {
    this.clients = this.clients.filter((c) => c !== client);
    console.log(
      `Client disconnected. Total connected clients: ${this.clients.length}`
    );
  }

  /**
   * Send data to all connected clients
   * @param data Data to send
   */
  sendToAllClients(data: any): void {
    const eventData = JSON.stringify({
      timestamp: new Date().toISOString(),
      data,
    });

    const eventId = Date.now().toString();
    let clientCount = 0;

    this.clients.forEach((client) => {
      if (!client.writableEnded) {
        // Format properly with event type, id and data
        client.write(`event: scrapeData\nid: ${eventId}\ndata: ${eventData}\n\n`);
        clientCount++;
      } else {
        // Remove stale clients
        this.removeClient(client);
      }
    });

    console.log(`Scraped data event sent to ${clientCount} clients`);
    // Log the actual data being sent for debugging
    console.log(`Event data: ${eventData}`);
  }

  /**
   * Get the current number of connected clients
   */
  getClientCount(): number {
    return this.clients.length;
  }
}

export default new ScrapedDataService();
