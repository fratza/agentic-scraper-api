import { Request, Response } from "express";
import axios from "axios";

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
      // Extract these at the top level so they're available in all catch blocks
      const { action, resume_link } = req.body;

      if (!action || !resume_link) {
        return res.status(400).json({
          status: "error",
          message: "Missing required fields: action and resume_link are required",
        });
      }

      let response;
      
      // Check if the resource exists before posting (to avoid 409 Conflict)
      try {
        // First try to get the resource status
        const checkResponse = await axios.get(resume_link);
        
        // If we get here, the resource exists, so we need to use PUT instead of POST
        // or include a special header to indicate we're aware of the resource
        response = await axios.post(resume_link, { 
          action,
          update: true // Signal that we're aware this might be an update operation
        }, {
          headers: {
            'If-Match': checkResponse.headers.etag || '*', // Use ETag if available for concurrency control
            'X-Update-Operation': 'true' // Custom header to indicate update operation
          }
        });
      } catch (checkError) {
        // If the GET request fails with 404, the resource doesn't exist yet, so proceed with normal POST
        // Otherwise, something else is wrong, so just try the normal POST
        
        // Forward the action to the resume_link
        response = await axios.post(resume_link, { action });
      }

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
        
        // Special handling for 409 Conflict - try a PUT request instead
        if (statusCode === 409) {
          try {
            console.log('Received 409 Conflict, attempting PUT request instead...');
            // Try a PUT request as a fallback
            // We need to access req.body again since the original variables might be out of scope
            const { action, resume_link: resumeLink } = req.body;
            const putResponse = await axios.put(resumeLink, { action });
            
            return res.status(200).json({
              status: "success",
              message: "Scrape proceeding (via PUT fallback)",
              data: putResponse.data,
            });
          } catch (putError: any) {
            console.error("PUT fallback also failed:", putError.message);
            // Continue to the error response below
          }
        }
        
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
