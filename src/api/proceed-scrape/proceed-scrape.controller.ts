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
      // Validate request body
      if (!req.body) {
        return res.status(400).json({
          status: "error",
          message: "Request body is required",
        });
      }

      // Extract action from request body with validation
      const action = req.body.action;
      if (
        typeof action !== "string" ||
        !["approve", "cancel", "retry"].includes(action)
      ) {
        return res.status(400).json({
          status: "error",
          message: "Invalid action",
        });
      }

      // Use resume_link from request or fall back to stored URL
      const resume_link =
        req.body.resume_link || resumeUrlService.getResumeUrl();

      // Validate resume URL format if provided
      if (resume_link) {
        try {
          new URL(resume_link);
        } catch (e) {
          return res.status(400).json({
            status: "error",
            message: "Invalid resume URL format",
          });
        }
      }

      // Check if we have a resume URL to work with
      if (!resume_link) {
        return res.status(400).json({
          status: "error",
          message:
            "No resume URL available. Please provide a 'resume_link' in the request body or ensure it was stored from a previous request.",
          code: "MISSING_RESUME_URL",
        });
      }

      // Store the resume URL if it was provided in the request
      if (req.body.resume_link) {
        resumeUrlService.setResumeUrl(resume_link);
      }

      console.log(`Proceeding with action '${action}' for URL:`, resume_link);

      // Prepare the request payload
      const payload: any = { action };

      // Add fieldMappings to payload if available and valid
      if (
        req.body.fieldMappings &&
        typeof req.body.fieldMappings === "object"
      ) {
        payload.fieldMappings = req.body.fieldMappings;
      }

      try {
        // Make the request to the resume URL
        const response = await axios.post(resume_link, payload, {
          timeout: 30000, // 30 second timeout
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          validateStatus: () => true, // Don't throw on HTTP error status codes
        });

        console.log(
          `Received response with status ${response.status} from resume URL`
        );

        // Forward the response from the resume URL
        return res.status(response.status).json({
          status: response.status < 400 ? "success" : "error",
          message:
            response.statusText ||
            (response.status < 400 ? "Scrape proceeding" : "Scrape failed"),
          data: response.data,
        });
      } catch (requestError: any) {
        console.error(
          "Error making request to resume URL:",
          requestError.message
        );

        // Handle different types of errors
        if (requestError.code === "ECONNABORTED") {
          return res.status(504).json({
            status: "error",
            message: "Request to resume URL timed out",
            code: "RESUME_URL_TIMEOUT",
          });
        }

        if (
          requestError.code === "ENOTFOUND" ||
          requestError.code === "ECONNREFUSED"
        ) {
          return res.status(502).json({
            status: "error",
            message: `Could not connect to resume URL: ${resume_link}`,
            code: "RESUME_URL_UNREACHABLE",
          });
        }

        // For other errors, return a 500 with the error details
        return res.status(500).json({
          status: "error",
          message: "An unexpected error occurred while processing your request",
          error: requestError.message,
          code: "INTERNAL_SERVER_ERROR",
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
