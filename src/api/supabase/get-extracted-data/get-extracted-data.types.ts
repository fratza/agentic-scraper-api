import { Request, Response } from "express";

export interface ExtractedDataItem {
  data: any;
}

export interface GetExtractedDataControllerType {
  getExtractedData(req: Request, res: Response): Promise<Response>;
}
