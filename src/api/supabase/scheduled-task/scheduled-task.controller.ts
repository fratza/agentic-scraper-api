import { Request, Response } from "express";
import { default as scheduledTaskService } from "./scheduled-task.service";
import { ScheduledTaskController as ScheduledTaskControllerType } from "./scheduled-task.types";

/**
 * ScheduledTaskController
 * Handles fetching scheduled tasks with related URL information
 */
export class ScheduledTaskController implements ScheduledTaskControllerType {
  /**
   * Get all scheduled tasks with related URL information
   */
  async getScheduledTasks(req: Request, res: Response) {
    try {
      const tasks = await scheduledTaskService.getAllScheduledTasks();
      return res.status(200).json({
        status: "success",
        data: tasks,
      });
    } catch (error: any) {
      console.error("Error fetching scheduled tasks:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Failed to fetch scheduled tasks",
        error: error.message,
      });
    }
  }
}

export default new ScheduledTaskController();
