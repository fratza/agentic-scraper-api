import { Request, Response } from "express";
import { default as getExtractedDataService } from "./get-extracted-data.service";
import { GetExtractedDataControllerType } from "./get-extracted-data.types";

/**
 * GetExtractedDataController
 * Handles fetching data from raw table by ID
 */
export class GetExtractedDataController
  implements GetExtractedDataControllerType
{
  /**
   * Get data from raw table by ID
   */
  async getExtractedData(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          status: "error",
          message: "ID parameter is required",
        });
      }

      const extractedData =
        await getExtractedDataService.getExtractedDataById(id);

      if (!extractedData) {
        return res.status(404).json({
          status: "error",
          message: "Extracted data not found",
        });
      }

      return res.status(200).json({
        status: "success",
        data: extractedData.data,
      });
    } catch (error: any) {
      console.error("Error fetching extracted data:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Failed to fetch extracted data",
        error: error.message,
      });
    }
  }
}

export default new GetExtractedDataController();
