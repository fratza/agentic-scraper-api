import { Request, Response } from 'express';

export interface UpdateMonitoringRequest {
  id: string;
  is_monitored: boolean;
  run_id?: string;
  run_at?: string;
}

export interface MonitoringController {
  updateMonitoring(req: Request, res: Response): Promise<Response>;
}
