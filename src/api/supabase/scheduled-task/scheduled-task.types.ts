import { Request, Response } from "express";

export interface ScheduledTaskItem {
  taskName: string;
  frequency: string;
  runAt: string;
  lastRunAt: string;
  origin_url: string;
}

export interface ScheduledTaskController {
  getScheduledTasks(req: Request, res: Response): Promise<Response>;
}

export interface ScheduledTaskService {
  getAllScheduledTasks(): Promise<ScheduledTaskItem[]>;
}
