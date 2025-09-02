import { Request, Response } from "express";

export interface UpdateMonitoringRequest {
  id: string;
  is_monitored: boolean;
  runId?: string;
  runAt?: string;
}

export interface SubmitMonitorTaskRequest {
  taskName: string;
  url: string;
  urlId: string;
  runAt: string;
  lastRunAt?: string;
  frequency: {
    value: number;
    unit: string;
  };
}

export interface MonitoringController {
  updateMonitoring(req: Request, res: Response): Promise<Response>;
  submitMonitorTask(req: Request, res: Response): Promise<Response>;
}
