import { Request, Response } from 'express';
import n8nService from './n8n.service';
import { WebhookData, WorkflowExecutionData } from './n8n.schema';

export class N8nController {
  async processWebhookResult(req: Request, res: Response) {
    try {
      // This endpoint receives data from n8n after processing
      const { data, metadata } = req.body as WebhookData;
      
      // In a production environment, validate the request with an API key
      // const apiKey = req.headers['x-api-key'];
      // if (!apiKey || apiKey !== process.env.API_KEY) {
      //   return res.status(401).json({ status: 'error', message: 'Unauthorized' });
      // }
      
      await n8nService.processWebhookResult({ data, metadata });
      
      return res.status(200).json({
        status: 'success',
        message: 'Webhook data received successfully'
      });
      
    } catch (error: any) {
      console.error('Error in webhook-result endpoint:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to process webhook data',
        error: error.message
      });
    }
  }
  
  async getWorkflows(req: Request, res: Response) {
    try {
      const workflows = await n8nService.getWorkflows();
      
      return res.status(200).json({
        status: 'success',
        data: workflows
      });
      
    } catch (error: any) {
      console.error('Error fetching n8n workflows:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch n8n workflows',
        error: error.message
      });
    }
  }
  
  async executeWorkflow(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body as WorkflowExecutionData;
      
      const result = await n8nService.executeWorkflow(id, data);
      
      return res.status(200).json({
        status: 'success',
        data: result
      });
      
    } catch (error: any) {
      console.error(`Error executing n8n workflow ${req.params.id}:`, error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to execute n8n workflow',
        error: error.message
      });
    }
  }
}

export default new N8nController();
