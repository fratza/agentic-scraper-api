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
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // Disable proxy buffering
    });

    // Send initial connection message
    const connectEvent = JSON.stringify({
      type: "connection",
      message: "Connected to SSE stream",
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
    console.log("THIS IS DATA", eventData);

    const eventId = Date.now().toString();
    let clientCount = 0;

    this.clients.forEach((client) => {
      if (!client.writableEnded) {
        // Format properly with event type, id and data
        client.write(`event: preview\nid: ${eventId}\ndata: ${eventData}\n\n`);
        clientCount++;
      } else {
        // Remove stale clients
        this.removeClient(client);
      }
    });

    console.log(`Data sent to ${clientCount} clients`);
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

export default new PreviewService();
