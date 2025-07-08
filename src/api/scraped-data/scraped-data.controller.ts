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

      // Extract run_id from request body or query parameters
      const run_id =
        req.body.run_id ||
        req.body.runId ||
        req.query.run_id ||
        req.query.runId;

      // If run_id is provided in the query but not in the body, add it to the body
      if (
        run_id &&
        !req.body.run_id &&
        !req.body.runId
      ) {
        req.body.run_id = run_id;
      }

      // Store the data using the service
      const savedData = await scrapedDataService.saveScrapedData(req.body);
      
      // Trigger SSE event for the saved data

      return res.status(200).json({
        status: "success",
        message: "Scraped data received successfully",
        data: savedData,
        run_id: savedData.run_id,
        sseClients: savedData.run_id
          ? scrapedDataService.getClientCountForRunId(savedData.run_id)
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
      // Check if we should filter by run_id
      const run_id =
        req.query.run_id ||
        req.query.runId;

      let data = await scrapedDataService.getAllScrapedData();

      // Filter by run_id if provided
      if (run_id) {
        data = data.filter(
          (item) =>
            item.run_id === run_id ||
            item.data?.run_id === run_id ||
            item.data?.runId === run_id
        );
      }
      
      // Unwrap the data by removing the outer "data" and "id" wrapper
      const unwrappedData = data.map(item => {
        // Preserve the run_id at the top level if it exists
        const run_id = item.run_id || item.data?.run_id || item.data?.runId;
        
        // If item.data exists and is an object, return it directly with run_id
        if (item.data && typeof item.data === 'object') {
          return { ...item.data, run_id };
        }
        
        // Otherwise return the item without the id field
        const { id, ...rest } = item;
        return rest;
      });

      return res.status(200).json({
        status: "success",
        message: "Scraped data retrieved successfully",
        count: unwrappedData.length,
        run_id: run_id || undefined,
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
      
      // Preserve the run_id at the top level if it exists
      const run_id = data.run_id || data.data?.run_id || data.data?.runId;
      
      // If data.data exists and is an object, return it directly with run_id
      if (data.data && typeof data.data === 'object') {
        unwrappedData = { ...data.data, run_id };
      } else {
        // Otherwise return the data without the id field
        const { id: itemId, ...rest } = data;
        unwrappedData = rest;
      }

      return res.status(200).json({
        status: "success",
        message: "Scraped data retrieved successfully",
        run_id,
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
      // Extract run_id from query parameters
      const run_id =
        req.query.run_id ||
        req.query.runId;

      // Client subscribing to events with optional run_id filter

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
