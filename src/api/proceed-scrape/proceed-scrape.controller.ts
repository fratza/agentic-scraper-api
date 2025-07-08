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
      // Extract action from request body
      const { action } = req.body;
      
      // Use resume_link from request or fall back to stored URL
      const resume_link = req.body.resume_link || resumeUrlService.getResumeUrl();

      if (!action) {
        return res.status(400).json({
          status: "error",
          message: "Missing required field: action is required",
        });
      }
      
      if (!resume_link) {
        return res.status(400).json({
          status: "error",
          message: "No resume URL available. Please provide resume_link or ensure it was stored from a previous request.",
        });
      }

      // 3. Make a simple POST request to the resume URL with action as body
      console.log(`Making POST request to ${resume_link} with action:`, action);
      console.log('Request payload:', { action });
      
      try {
        const response = await axios.post(resume_link, { action });
        console.log('Response received:', response.data);
        return res.status(200).json({
          status: "success",
          message: "Scrape proceeding",
          data: response.data,
        });
      } catch (requestError: any) {
        console.error('POST request failed with error:', requestError.message);
        if (requestError.response) {
          console.error('Error response status:', requestError.response.status);
          console.error('Error response data:', requestError.response.data);
          
          // Return the error from the upstream service
          return res.status(requestError.response.status).json({
            status: "error",
            message: `Failed to proceed with scrape: ${requestError.message}`,
            error: requestError.message,
            responseData: requestError.response.data,
            originalStatus: requestError.response.status
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
