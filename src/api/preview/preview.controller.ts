import { Request, Response } from "express";
import previewService from "./preview.service";

/**
 * PreviewController
 * Handles preview sample data from n8n
 */
export class PreviewController {
  /**
   * Receive and process sample data from n8n
   */
  async previewSampleData(req: Request, res: Response) {
    try {
      // Log the received data
      console.log("Received preview sample data:");
      console.log(JSON.stringify(req.body, null, 2));

      // Send data to all connected SSE clients
      previewService.sendToAllClients(req.body);

      return res.status(200).json({
        status: "success",
        message: "Sample data received successfully",
        data: req.body,
        sseClients: previewService.getClientCount(),
      });
    } catch (error: any) {
      console.error("Error processing preview sample data:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Failed to process sample data",
        error: error.message,
      });
    }
  }

  /**
   * Subscribe to SSE events for real-time preview data
   */
  async subscribeToEvents(req: Request, res: Response) {
    try {
      // Set up SSE connection
      previewService.addClient(res, req);

      console.log(
        `New client connected. Total connected clients: ${previewService.getClientCount()}`
      );

      // The connection will remain open until the client disconnects
      req.on("close", () => {
        // Client disconnection is handled in the service
      });
    } catch (error: any) {
      console.error("Error setting up SSE connection:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Failed to set up SSE connection",
        error: error.message,
      });
    }
  }
}

export default new PreviewController();
