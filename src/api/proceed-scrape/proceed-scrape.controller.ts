import { Request, Response } from "express";
import axios from "axios";
import resumeUrlService from "../../services/resume-url.service";

/**
 * ProceedScrapeController
 * Handles requests to proceed with scraping operations
 */
export class ProceedScrapeController {
  /**
   * Process a request to proceed with scraping
   */
  async proceedWithScrape(req: Request, res: Response) {
    try {
      // Extract action from request body with fallback to 'process'
      const action = req.body.action;

      // Get the stored resume URL
      const resume_link = resumeUrlService.getResumeUrl();

      // Extract fieldMappings from request body if available
      const fieldMappings = req.body.fieldMappings || null;

      // Log the received request and stored values
      console.log("Proceed-scrape received request with action:", action);
      console.log("Stored resume URL:", resume_link);

      if (!resume_link) {
        return res.status(400).json({
          status: "error",
          message:
            "No resume URL available. Please provide a resume_link to the preview endpoint first.",
        });
      }

      console.log(
        `Proceeding with scrape using stored resume URL: ${resume_link}`
      );

      // Make a POST request to the resume URL with action and fieldMappings (if available) as body
      console.log(`Making POST request to ${resume_link} with action:`, action);

      // Prepare the request payload
      const payload = { action };

      // Add fieldMappings to payload if available
      if (fieldMappings) {
        Object.assign(payload, { fieldMappings });
      }

      console.log("Request payload:", payload);

      try {
        const response = await axios.post(resume_link, payload);
        console.log("Response received:", response.data);
        return res.status(200).json({
          status: "success",
          message: "Scrape proceeding",
          data: response.data,
        });
      } catch (requestError: any) {
        console.error("POST request failed with error:", requestError.message);
        if (requestError.response) {
          console.error("Error response status:", requestError.response.status);
          console.error("Error response data:", requestError.response.data);

          // Return the error from the upstream service
          return res.status(requestError.response.status).json({
            status: "error",
            message: `Failed to proceed with scrape: ${requestError.message}`,
            error: requestError.message,
            responseData: requestError.response.data,
            originalStatus: requestError.response.status,
          });
        }

        // If there's no response object, it's a network error
        return res.status(500).json({
          status: "error",
          message: "Failed to connect to resume URL",
          error: requestError.message,
        });
      }
    } catch (error: any) {
      console.error("Error in proceedWithScrape controller:", error.message);

      // This catch block now only handles errors in the controller itself,
      // not errors from the axios request which are handled in the nested try-catch

      return res.status(500).json({
        status: "error",
        message: "Failed to proceed with scrape",
        error: error.message,
      });
    }
  }
}

export default new ProceedScrapeController();
