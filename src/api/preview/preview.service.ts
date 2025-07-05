import { Response } from "express";

/**
 * Service to manage SSE connections for preview data
 */
export class PreviewService {
  private clients: Response[] = [];

  /**
   * Add a new client connection
   * @param client Express response object
   */
  addClient(client: Response): void {
    // Set headers for SSE
    client.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    });

    // Send initial connection message
    client.write(`data: ${JSON.stringify({ type: "connection", message: "Connected to SSE stream" })}\n\n`);

    // Add client to the list
    this.clients.push(client);

    // Handle client disconnect
    client.on("close", () => {
      this.removeClient(client);
    });
  }

  /**
   * Remove a client connection
   * @param client Express response object
   */
  removeClient(client: Response): void {
    this.clients = this.clients.filter(c => c !== client);
    console.log(`Client disconnected. Total connected clients: ${this.clients.length}`);
  }

  /**
   * Send data to all connected clients
   * @param data Data to send
   */
  sendToAllClients(data: any): void {
    const eventData = JSON.stringify({
      timestamp: new Date().toISOString(),
      data
    });

    this.clients.forEach(client => {
      client.write(`data: ${eventData}\n\n`);
    });

    console.log(`Data sent to ${this.clients.length} clients`);
  }

  /**
   * Get the current number of connected clients
   */
  getClientCount(): number {
    return this.clients.length;
  }
}

export default new PreviewService();
