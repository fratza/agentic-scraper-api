import { Request, Response } from "express";
import { default as urlListService } from "./url-list.service";
import { URLListController as URLListControllerType } from "./url-list.types";

/**
 * URLListController
 * Handles fetching URLs from the raw table
 */
export class URLListController implements URLListControllerType {
  /**
   * Get all origin URLs from the raw table
   */
  async getUrlList(req: Request, res: Response) {
    try {
      const urls = await urlListService.getAllUrls();
      return res.status(200).json({
        status: "success",
        data: urls,
      });
    } catch (error: any) {
      console.error("Error fetching URLs:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Failed to fetch URLs",
        error: error.message,
      });
    }
  }
}

export default new URLListController();
