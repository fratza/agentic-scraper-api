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
      const { resume_link, action, sample, content_type } = req.body;

      // 1. Extract and store the resume URL if provided
      if (resume_link) {
        resumeUrlService.setResumeUrl(resume_link);
      }

      // 2. Send Sample and content_type to SSE clients
      if (sample && typeof sample === "object") {
        // Send the sample data and content_type to SSE clients
        previewService.sendToAllClients({ sample, content_type });
      } else {
        console.warn("No valid sample data found in the request");
      }

      // 3. If resume_link is provided, proceed with scrape
      let proceedResponse = null;
      if (resume_link) {
        try {
          // Call the proceed-scrape endpoint internally
          const proceedUrl = `${req.protocol}://${req.get(
            "host"
          )}/api/proceed-scrape`;

          // Ensure action is always provided, default to 'process' if not specified
          const actionToUse = action || "process";

          console.log("Calling proceed-scrape with:", {
            resume_link,
            action: actionToUse,
          });
          proceedResponse = await axios.post(proceedUrl, {
            resume_link,
            action: actionToUse, // Ensure action is always provided
          });

          console.log("Proceeded with scrape:", proceedResponse.data);
        } catch (proceedError: any) {
          console.error("Error proceeding with scrape:", proceedError.message);

          // Log more details about the error
          if (proceedError.response) {
            console.error(
              "Error response status:",
              proceedError.response.status
            );
            console.error("Error response data:", proceedError.response.data);

            // Store the error response for the client
            proceedResponse = {
              data: {
                status: "error",
                message: proceedError.message,
                details: proceedError.response.data,
              },
            };
          } else {
            console.error("No response from proceed-scrape endpoint");
          }

          // Continue execution even if proceed-scrape fails
        }
      }

      return res.status(200).json({
        status: "success",
        message: "Sample data received successfully",
        resumeUrlStored: !!resumeUrlService.getResumeUrl(),
        sampleDataSent: !!(sample && typeof sample === "object"),
        sseClients: previewService.getClientCount(),
        proceedWithScrape: proceedResponse ? proceedResponse.data : null,
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
