import { Request, Response } from "express";
import previewService from "./preview.service";
import axios from "axios";
import resumeUrlService from "../../services/resume-url.service";

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
      // Process the received data
      const { resume_link, action, sample } = req.body;

      // 1. Extract and store the resume URL if provided
      if (resume_link) {
        resumeUrlService.setResumeUrl(resume_link);
      }

      // 2. Only send the arrays inside "sample" field to SSE clients
      if (sample && typeof sample === 'object') {
        // Send only the sample data to SSE clients
        previewService.sendToAllClients({ sample });
      } else {
        console.warn('No valid sample data found in the request');
      }

      // 3. If resume_link is provided, proceed with scrape
      let proceedResponse = null;
      if (resume_link) {
        try {
          // Call the proceed-scrape endpoint internally
          const proceedUrl = `${req.protocol}://${req.get('host')}/api/proceed-scrape`;
          proceedResponse = await axios.post(proceedUrl, { 
            resume_link,
            action // Only pass the action to be posted to resume_link
          });
          
          console.log('Proceeded with scrape:', proceedResponse.data);
        } catch (proceedError: any) {
          console.error('Error proceeding with scrape:', proceedError.message);
          // Continue execution even if proceed-scrape fails
        }
      }

      return res.status(200).json({
        status: "success",
        message: "Sample data received successfully",
        resumeUrlStored: !!resumeUrlService.getResumeUrl(),
        sampleDataSent: !!(sample && typeof sample === 'object'),
        sseClients: previewService.getClientCount(),
        proceedWithScrape: proceedResponse ? proceedResponse.data : null
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

      // Client connected successfully

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
