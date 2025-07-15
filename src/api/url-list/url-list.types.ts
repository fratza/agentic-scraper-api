import { Request, Response } from 'express';

export interface URLListController {
  getUrlList(req: Request, res: Response): Promise<Response>;
}

export interface URLListService {
  getAllUrls(): Promise<string[]>;
}
