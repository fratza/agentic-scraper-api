import { Request, Response } from "express";

export interface ScheduledTaskItem {
  task_name: string;
  frequency: string;
  run_at: string;
  last_run_at: string | null;
  status: string;
  origin_url: string;
}

export interface GetScheduledTasksControllerType {
  getScheduledTasks(req: Request, res: Response): Promise<Response>;
}
