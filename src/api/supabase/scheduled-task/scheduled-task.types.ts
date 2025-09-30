import { Request, Response } from 'express';

export interface ScheduledTaskItem {
  task_name: string;
  frequency: string;
  run_at: string;
  last_run_at: string;
  origin_url: string;
}

export interface ScheduledTaskController {
  getScheduledTasks(req: Request, res: Response): Promise<Response>;
}

export interface ScheduledTaskService {
  getAllScheduledTasks(): Promise<ScheduledTaskItem[]>;
}
