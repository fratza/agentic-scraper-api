import { Request, Response } from "express";
import scrapedDataService from "./scraped-data.service";

/**
 * ScrapedDataController
 * Handles scraped data operations and SSE events
 */
export class ScrapedDataController {
  /**
   * Receive and process scraped data
   */
  async receiveScrapedData(req: Request, res: Response) {
    try {
      // Process the received data

      // Extract runId from request body or query parameters
      const runId = req.body.runId;

      // If runId is provided in the query but not in the body, add it to the body
      if (runId && !req.body.runId && !req.body.runId) {
        req.body.runId = runId;
      }

      // Store the data using the service
      await scrapedDataService.saveScrapedData(req.body);

      // Return a clean response without nested data
      return res.status(200).json({
        status: "success",
        message: "Scraped data received successfully",
        data: req.body,
        runId: req.body.runId,
        sseClients: req.body.runId
          ? scrapedDataService.getClientCountForRunId(req.body.runId)
          : scrapedDataService.getClientCount(),
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
      const runId = req.query.runId as string | undefined;

      let data = await scrapedDataService.getAllScrapedData();

      if (runId) {
        data = data.filter(
          (item) => item.runId === runId || item.data?.runId === runId,
        );
      }

      const unwrappedData = data.map((item) => {
        const runId = item.runId || item.data?.runId;
        return item.data && typeof item.data === "object"
          ? { ...item.data, runId }
          : { ...item, runId };
      });

      return res.status(200).json({
        status: "success",
        message: "Scraped data retrieved successfully",
        count: unwrappedData.length,
        runId,
        data: unwrappedData,
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

      // Unwrap the data by removing the outer "data" and "id" wrapper
      let unwrappedData;

      // Preserve the runId at the top level if it exists
      const runId = data.runId;

      // If data.data exists and is an object, return it directly with runId
      if (data.data && typeof data.data === "object") {
        unwrappedData = { ...data.data, runId };
      } else {
        // Otherwise return the data without the id field
        const { runId: itemId, ...rest } = data;
        unwrappedData = rest;
      }

      return res.status(200).json({
        status: "success",
        message: "Scraped data retrieved successfully",
        runId,
        data: unwrappedData,
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
   * Subscribe to SSE events for real-time scraped data
   */
  async subscribeToEvents(req: Request, res: Response) {
    try {
      // Extract runId from query parameters
      const runId = req.query.runId || req.query.runId;

      // Client subscribing to events with optional runId filter

      // Set up SSE connection
      scrapedDataService.addClient(res, req);

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

export default new ScrapedDataController();
