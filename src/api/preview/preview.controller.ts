import { Request, Response } from "express";

/**
 * PreviewController
 * Handles preview sample data from n8n
 */
export class PreviewController {
  /**
   * Receive and process sample data from n8n
   * No storage - just passes the data back to the client
   */
  async previewSampleData(req: Request, res: Response) {
    try {
      // Log the received data
      console.log("Received preview sample data:");
      console.log(JSON.stringify(req.body, null, 2));

      // Return the data directly without storing
      return res.status(200).json({
        status: "success",
        message: "Sample data received successfully",
        data: req.body,
        timestamp: new Date().toISOString(),
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
   * Get the latest preview data for the frontend
   * This endpoint is no longer needed as we don't store data anymore
   */
  async getPreviewData(req: Request, res: Response) {
    return res.status(404).json({
      status: "error",
      message: "Preview data is not stored. Use the POST endpoint directly.",
    });
  }
}

export default new PreviewController();
