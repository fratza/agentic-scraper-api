import { Request, Response } from "express";
import monitoringService from "./monitoring.service";

/**
 * MonitoringController
 * Handles updating monitoring status
 */
export class MonitoringController {
  /**
   * Update monitoring status for a record
   */
  async updateMonitoring(req: Request, res: Response): Promise<Response> {
    try {
      const { id, is_monitored } = req.body;

      if (!id || typeof is_monitored !== 'boolean') {
        return res.status(400).json({
          status: "error",
          message: "Invalid request body. Must include id and is_monitored (boolean)"
        });
      }

      const result = await monitoringService.updateMonitoringStatus(id, is_monitored);

      return res.status(200).json({
        status: "success",
        message: "Monitoring status updated successfully",
        data: result
      });
    } catch (error: any) {
      console.error("Error updating monitoring status:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Failed to update monitoring status",
        error: error.message
      });
    }
  }
}

export default new MonitoringController();
