import { Request, Response } from 'express';

export interface UpdateMonitoringRequest {
  id: string;
  is_monitored: boolean;
}

export interface MonitoringController {
  updateMonitoring(req: Request, res: Response): Promise<Response>;
}
