import { Request, Response } from "express";

/**
 * ScrapedDataService
 * Handles business logic for scraped data and SSE events
 */

// In-memory storage for scraped data (replace with database in production)
interface ScrapedDataItem {
  data: any;
  timestamp: Date;
  runId?: string;
  isMonitor?: boolean;
}

interface SSEClient {
  response: Response;
  run_id?: string;
}

export class ScrapedDataService {
  private scrapedDataStore: ScrapedDataItem[] = [];
  private clients: SSEClient[] = [];

  /**
   * Save scraped data
   */
  async saveScrapedData(data: any): Promise<any> {
    const newItem: ScrapedDataItem = {
      data: data,
      timestamp: data.timestamp,
      runId: data.run_id,
      isMonitor: data.isMonitor,
    };

    this.scrapedDataStore.push(newItem);

    // Send event to SSE clients
    this.sendToAllClients(newItem);

    return {
      status: "success",
      message: "Scraped data received successfully",
      data: newItem.data,
    };
  }

  /**
   * Get all scraped data
   */
  async getAllScrapedData(): Promise<ScrapedDataItem[]> {
    return this.scrapedDataStore;
  }

  /**
   * Get scraped data by runId
   */
  async getScrapedDataById(id: string): Promise<ScrapedDataItem | undefined> {
    return this.scrapedDataStore.find((item) => item.runId === id);
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
  addClient(response: Response, req?: Request): void {
    // Extract run_id from query parameters
    let run_id: string | undefined;
    if (req && req.query) {
      // Support multiple parameter names for backward compatibility
      run_id = (req.query.run_id || req.query.runId) as string;
    }

    // Set headers for SSE with CORS support for all origins
    const corsHeaders: Record<string, string> = {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // Disable proxy buffering
      "Access-Control-Allow-Origin": "*", // Allow all origins
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    response.writeHead(200, corsHeaders);

    // Send initial connection message
    const connectEvent = JSON.stringify({
      type: "connection",
      message: "Connected to scraped-data SSE stream",
      run_id: run_id || "all",
    });
    response.write(
      `event: connect\nid: ${Date.now()}\ndata: ${connectEvent}\n\n`
    );

    // Keep connection alive with heartbeat
    const heartbeatInterval = setInterval(() => {
      if (response.writableEnded) {
        clearInterval(heartbeatInterval);
        return;
      }
      response.write(`:heartbeat\n\n`);
    }, 30000); // Send heartbeat every 30 seconds

    // Add client to the list with run_id if available
    const client = { response, run_id };
    this.clients.push(client);

    // Client connected with optional run_id filter

    // Handle client disconnect
    response.on("close", () => {
      clearInterval(heartbeatInterval);
      this.removeClient(client);
    });
  }

  /**
   * Remove a client connection
   * @param client Express response object
   */
  removeClient(client: SSEClient): void {
    this.clients = this.clients.filter((c) => c !== client);
    // Client disconnected
  }

  /**
   * Send data to all connected clients
   * @param data Data to send
   */
  sendToAllClients(data: ScrapedDataItem): void {
    // Format the data to be more directly usable by clients
    const eventData = JSON.stringify({
      timestamp: new Date().toISOString(),
      run_id: data.runId,
      data: data.data, // Send the actual scraped data content
      timestamp_received: data.timestamp,
    });

    const eventId = Date.now().toString();
    let clientCount = 0;
    const run_id = data.runId;

    this.clients.forEach((client) => {
      const response = client.response;

      // Only send to clients with matching run_id or clients subscribed to all events
      if (
        !response.writableEnded &&
        (run_id === undefined ||
          client.run_id === undefined ||
          client.run_id === run_id)
      ) {
        // Format properly with event type, id and data
        response.write(
          `event: scrapedData\nid: ${eventId}\ndata: ${eventData}\n\n`
        );
        clientCount++;
      } else if (response.writableEnded) {
        // Remove stale clients
        this.removeClient(client);
      }
    });

    // Data sent to clients
  }

  /**
   * Get the current number of connected clients
   */
  getClientCount(): number {
    return this.clients.length;
  }

  /**
   * Get client count for a specific run_id
   * @param run_id The run_id to count clients for
   */
  getClientCountForRunId(run_id: string): number {
    return this.clients.filter((client) => client.run_id === run_id).length;
  }
}

export default new ScrapedDataService();
