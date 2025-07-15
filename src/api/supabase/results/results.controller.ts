import { Request, Response } from "express";
import resultsService from "./results.service";

/**
 * ResultsController
 * Handles retrieving data by ID
 */
export class ResultsController {
  /**
   * Get data by ID
   */
  async getData(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.query;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({
          status: "error",
          message: "Invalid request. ID is required"
        });
      }

      const data = await resultsService.getDataById(id);

      if (!data) {
        return res.status(404).json({
          status: "error",
          message: "No data found for the specified ID"
        });
      }

      return res.status(200).json({
        status: "success",
        data
      });
    } catch (error: any) {
      console.error("Error retrieving data:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Failed to retrieve data",
        error: error.message
      });
    }
  }
}

export default new ResultsController();
