import axios from 'axios';
import { WebhookData, WorkflowExecutionData } from './n8n.schema';
import { config } from '../../config';

export class N8nService {
  async processWebhookResult(webhookData: WebhookData) {
    // In a production environment, you would store this data in a database
    console.log('Processing webhook data:', webhookData.metadata);
    return { message: 'Webhook data received successfully' };
  }
  
  async getWorkflows() {
    try {
      // Since we're only using N8N_WEBHOOK_URL now, this method is not supported
      throw new Error('n8n API access is not configured - only webhook functionality is available');
    } catch (error) {
      throw error;
    }
  }
  
  async executeWorkflow(workflowId: string, data: WorkflowExecutionData) {
    try {
      // Since we're only using N8N_WEBHOOK_URL now, this method is not supported
      throw new Error('n8n API access is not configured - only webhook functionality is available');
    } catch (error) {
      throw error;
    }
  }
}

export default new N8nService();
