import { Request, Response } from "express";
import monitoringService from "./monitoring.service";

/**
 * MonitoringController
 * Handles monitoring tasks and status updates
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

  /**
   * Submit a new monitoring task
   */
  async submitMonitorTask(req: Request, res: Response): Promise<Response> {
    try {
      const { task_name, url, frequency } = req.body;

      // Validate required fields
      if (!task_name || !url || !frequency || !frequency.value || !frequency.unit) {
        return res.status(400).json({
          status: "error",
          message: "Invalid request body. Must include task_name, url, and frequency (with value and unit)"
        });
      }

      // Validate frequency unit
      const validUnits = ["minutes", "hours", "days"];
      if (!validUnits.includes(frequency.unit)) {
        return res.status(400).json({
          status: "error",
          message: `Invalid frequency unit. Must be one of: ${validUnits.join(', ')}`
        });
      }

      // Compute next run time based on frequency
      const now = new Date();
      let nextRunAt: Date;

      switch (frequency.unit) {
        case "minutes":
          nextRunAt = new Date(now.getTime() + frequency.value * 60 * 1000);
          break;
        case "hours":
          nextRunAt = new Date(now.getTime() + frequency.value * 60 * 60 * 1000);
          break;
        case "days":
          nextRunAt = new Date(now.getTime() + frequency.value * 24 * 60 * 60 * 1000);
          break;
        default:
          nextRunAt = new Date(now.getTime() + frequency.value * 60 * 60 * 1000); // Default to hours
      }

      // Insert task into database
      const result = await monitoringService.createMonitorTask({
        task_name,
        url,
        frequency_value: frequency.value,
        frequency_unit: frequency.unit,
        next_run_at: nextRunAt.toISOString()
      });

      return res.status(201).json({
        status: "success",
        data: result
      });
    } catch (error: any) {
      console.error("Error submitting monitor task:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Failed to submit monitor task",
        error: error.message
      });
    }
  }
}

export default new MonitoringController();
