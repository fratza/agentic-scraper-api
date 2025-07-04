import axios from 'axios';
import { ScrapeRequest, JobStatus } from './scrape.schema';
import { config } from '../../config';

export class ScrapeService {
  async processScrapeRequest(scrapeData: ScrapeRequest) {
    try {
      // Check if n8n is enabled and webhook URL is available
      if (!config.n8n.enabled || !config.n8n.webhookUrl) {
        console.log('n8n webhook URL not available, returning mock response');
        return {
          received: true,
          timestamp: new Date().toISOString(),
          mockData: true,
          url: scrapeData.url,
          scrapeTarget: scrapeData.scrapeTarget
        };
      }

      // Forward to n8n webhook
      const n8nResponse = await axios.post(config.n8n.webhookUrl, {
        url: scrapeData.url,
        scrapeTarget: scrapeData.scrapeTarget,
        timestamp: new Date().toISOString()
      });
      
      return n8nResponse.data;
    } catch (error: any) {
      console.error('Error in processScrapeRequest:', error.message);
      // Return a mock response instead of throwing the error
      return {
        received: false,
        error: error.message,
        timestamp: new Date().toISOString(),
        mockData: true
      };
    }
  }
  
  async getJobStatus(jobId: string): Promise<JobStatus> {
    // Check if n8n is enabled
    if (!config.n8n.enabled) {
      console.log('n8n is not enabled, returning mock job status');
      return {
        jobId,
        status: jobId.startsWith('mock-job') ? 'completed' : 'not_found',
        progress: jobId.startsWith('mock-job') ? '100%' : '0%',
        completedAt: jobId.startsWith('mock-job') ? new Date().toISOString() : undefined,
        result: jobId.startsWith('mock-job') ? {
          url: 'https://example.com',
          content: 'This is mock content for the requested URL',
          timestamp: new Date().toISOString()
        } : undefined
      };
    }
    
    // In a real implementation, you would check the status in a database or n8n API
    // For now, we'll simulate a response
    return {
      jobId,
      status: 'completed',
      progress: '100%',
      completedAt: new Date().toISOString()
    };
  }
}

export default new ScrapeService();
