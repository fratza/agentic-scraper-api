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
      const { action, resume_link } = req.body;

      if (!action || !resume_link) {
        return res.status(400).json({
          status: "error",
          message: "Missing required fields: action and resume_link are required",
        });
      }

      // Forward the action to the resume_link
      const response = await axios.post(resume_link, { action });

      return res.status(200).json({
        status: "success",
        message: "Scrape proceeding",
        data: response.data,
      });
    } catch (error: any) {
      console.error("Error proceeding with scrape:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Failed to proceed with scrape",
        error: error.message,
      });
    }
  }
}

export default new ProceedScrapeController();
