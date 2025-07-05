import { Request, Response } from "express";
import scrapedDataService from "./scraped-data.service";

/**
 * ScrapedDataController
 * Handles scraped data operations
 */
export class ScrapedDataController {
  /**
   * Receive and process scraped data
   */
  async receiveScrapedData(req: Request, res: Response) {
    try {
      // Log the received data
      console.log("Received scraped data:");
      console.log(JSON.stringify(req.body, null, 2));

      // Store the data using the service
      const savedData = await scrapedDataService.saveScrapedData(req.body);

      return res.status(200).json({
        status: "success",
        message: "Scraped data received successfully",
        data: savedData,
      });
    } catch (error: any) {
      console.error("Error processing scraped data:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Failed to process scraped data",
        error: error.message,
      });
    }
  }

  /**
   * Get all scraped data
   */
  async getAllScrapedData(req: Request, res: Response) {
    try {
      const data = await scrapedDataService.getAllScrapedData();

      return res.status(200).json({
        status: "success",
        message: "Scraped data retrieved successfully",
        data,
      });
    } catch (error: any) {
      console.error("Error retrieving scraped data:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Failed to retrieve scraped data",
        error: error.message,
      });
    }
  }

  /**
   * Get scraped data by ID
   */
  async getScrapedDataById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await scrapedDataService.getScrapedDataById(id);

      if (!data) {
        return res.status(404).json({
          status: "error",
          message: "Scraped data not found",
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Scraped data retrieved successfully",
        data,
      });
    } catch (error: any) {
      console.error("Error retrieving scraped data:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Failed to retrieve scraped data",
        error: error.message,
      });
    }
  }
}

export default new ScrapedDataController();
