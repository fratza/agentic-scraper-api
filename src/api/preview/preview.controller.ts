import { Request, Response } from "express";

// Simple in-memory storage for the latest preview data
interface PreviewData {
  timestamp: string;
  data: any;
}

/**
 * PreviewController
 * Handles preview sample data from n8n
 */
export class PreviewController {
  // Store the latest preview data in memory
  private latestPreviewData: PreviewData | null = null;

  /**
   * Receive and process sample data from n8n
   */
  async previewSampleData(req: Request, res: Response) {
    try {
      // Log the received data
      console.log("Received preview sample data:");
      console.log(JSON.stringify(req.body, null, 2));

      // Store the data in memory
      this.latestPreviewData = {
        timestamp: new Date().toISOString(),
        data: req.body,
      };

      return res.status(200).json({
        status: "success",
        message: "Sample data received successfully",
        data: req.body,
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
   */
  async getLatestPreviewData(req: Request, res: Response) {
    if (!this.latestPreviewData) {
      return res.status(404).json({
        status: "error",
        message: "No preview data available yet",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Preview data retrieved successfully",
      ...this.latestPreviewData,
    });
  }
}

export default new PreviewController();
