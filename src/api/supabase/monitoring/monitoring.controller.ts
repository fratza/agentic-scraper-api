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
      const { id, is_monitored, run_id, run_at } = req.body;

      if (!id || typeof is_monitored !== 'boolean') {
        return res.status(400).json({
          status: "error",
          message: "Invalid request body. Must include id and is_monitored (boolean)"
        });
      }

      // Step 1: Update is_monitored column in raw table
      const rawResult = await monitoringService.updateMonitoringStatus(id, is_monitored);

      // Step 2: If run_id and run_at are provided, update the scheduled_jobs table
      let scheduledJobResult = null;
      if (run_id && run_at) {
        scheduledJobResult = await monitoringService.updateScheduledJobRunAt(run_id, run_at);
      }

      return res.status(200).json({
        status: "success",
        message: "Monitoring status updated successfully",
        data: {
          raw: rawResult,
          scheduledJob: scheduledJobResult
        }
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
