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
      console.log(`Making POST request to ${resume_link} with action: ${action}`);
      const response = await axios.post(resume_link, { action });

      return res.status(200).json({
        status: "success",
        message: "Scrape proceeding",
        data: response.data,
      });
    } catch (error: any) {
      console.error("Error proceeding with scrape:", error);
      
      // If it's an axios error with a response, extract more details
      if (error.response) {
        const statusCode = error.response.status;
        const responseData = error.response.data;
        
        console.log(`Response status: ${statusCode}`);
        console.log('Response data:', responseData);
        
        // Return the actual status code from the upstream service
        return res.status(statusCode).json({
          status: "error",
          message: `Failed to proceed with scrape: ${error.message}`,
          error: error.message,
          responseData,
          originalStatus: statusCode
        });
      }
      
      return res.status(500).json({
        status: "error",
        message: "Failed to proceed with scrape",
        error: error.message,
      });
    }
  }
}

export default new ProceedScrapeController();
