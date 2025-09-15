import { Request, Response } from "express";
import { default as getScheduledTasksService } from "./get-scheduled-tasks.service";
import { GetScheduledTasksControllerType as GetScheduledTasksControllerType } from "./get-scheduled-tasks.types";

/**
 * GetScheduledTasksController
 * Handles fetching scheduled tasks with related URL information
 */
export class GetScheduledTasksController
  implements GetScheduledTasksControllerType
{
  /**
   * Get all scheduled tasks with task_name, frequency, run_at, last_run_at, status and origin_url
   */
  async getScheduledTasks(req: Request, res: Response) {
    try {
      const tasks = await getScheduledTasksService.getAllScheduledTasks();
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

export default new GetScheduledTasksController();
