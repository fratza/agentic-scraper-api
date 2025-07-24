import { Request, Response } from 'express';

export interface UpdateMonitoringRequest {
  id: string;
  is_monitored: boolean;
  run_id?: string;
  run_at?: string;
}

export interface SubmitMonitorTaskRequest {
  task_name: string;
  url: string;
  url_id: string;
  run_at: string;
  frequency: {
    value: number;
    unit: string;
  };
}

export interface MonitoringController {
  updateMonitoring(req: Request, res: Response): Promise<Response>;
  submitMonitorTask(req: Request, res: Response): Promise<Response>;
}
