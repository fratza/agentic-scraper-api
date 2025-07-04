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
      // Check if n8n API URL and key are configured
      if (!config.n8n.apiUrl || !config.n8n.apiKey) {
        throw new Error('n8n API configuration missing');
      }
      
      // Make request to n8n API to get workflows
      const response = await axios.get(`${config.n8n.apiUrl}/workflows`, {
        headers: {
          'X-N8N-API-KEY': config.n8n.apiKey
        }
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  async executeWorkflow(workflowId: string, data: WorkflowExecutionData) {
    try {
      // Check if n8n API URL and key are configured
      if (!config.n8n.apiUrl || !config.n8n.apiKey) {
        throw new Error('n8n API configuration missing');
      }
      
      // Execute workflow in n8n
      const response = await axios.post(`${config.n8n.apiUrl}/workflows/${workflowId}/execute`, data, {
        headers: {
          'X-N8N-API-KEY': config.n8n.apiKey
        }
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new N8nService();
