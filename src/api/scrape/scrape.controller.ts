import { Request, Response } from 'express';
import axios from 'axios';
import scrapeService from './scrape.service';
import { ScrapeRequest } from './scrape.schema';
import { config } from '../../config';

export class ScrapeController {
  async startScrape(req: Request, res: Response) {
    try {
      const { url, prompt } = req.body;
      
      if (!url || !prompt) {
        return res.status(400).json({
          status: 'error',
          message: 'URL and prompt are required',
        });
      }
      
      // Format payload for n8n webhook
      const payload = {
        "URL": url,
        "What do you want to scrape?": prompt
      };
      
      console.log(`Starting scrape for URL: ${url}`);
      console.log(`Scrape prompt: ${prompt}`);
      
      // Check if n8n is enabled and webhook URL is configured
      const n8nEnabled = config.n8n.enabled;
      const n8nWebhookUrl = config.n8n.scrapeWebhookUrl;
      
      if (n8nEnabled && n8nWebhookUrl) {
        // Send to n8n webhook if properly configured
        try {
          const response = await axios.post(n8nWebhookUrl, payload);
          
          // Return the data from n8n
          return res.status(200).json({
            status: 'success',
            message: 'Scrape job started successfully',
            data: response.data,
            jobId: `job-${Date.now()}`,
          });
        } catch (webhookError: any) {
          console.error('Error calling n8n webhook:', webhookError.message);
          // Fall through to mock response
        }
      }
      
      // If n8n is not configured or webhook call failed, return a mock response
      console.log('n8n webhook not configured or unavailable, returning mock response');
      return res.status(200).json({
        status: 'success',
        message: 'Scrape job started successfully (mock response)',
        data: {
          received: true,
          timestamp: new Date().toISOString(),
          payload: payload
        },
        jobId: `mock-job-${Date.now()}`,
      });
    } catch (error: any) {
      console.error('Error starting scrape job:', error.message);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to start scrape',
        error: error.message
      });
    }
  }
  async processScrapeRequest(req: Request, res: Response) {
    try {
      const { url, scrapeTarget } = req.body as ScrapeRequest;
      
      // Validate input
      if (!url) {
        return res.status(400).json({ 
          status: 'error', 
          message: 'URL is required' 
        });
      }
      
      if (!scrapeTarget) {
        return res.status(400).json({ 
          status: 'error', 
          message: 'Scrape target is required' 
        });
      }
      
      // Log the request
      console.log(`Scrape request received for URL: ${url}`);
      console.log(`Scrape target: ${scrapeTarget}`);
      
      // Check if n8n is enabled
      if (!config.n8n.enabled) {
        console.log('n8n is not enabled, returning mock response');
        return res.status(200).json({
          status: 'success',
          message: 'Scrape request processed successfully (mock response)',
          data: {
            received: true,
            timestamp: new Date().toISOString(),
            url,
            scrapeTarget,
            jobId: `mock-job-${Date.now()}`
          }
        });
      }
      
      // Process the request
      const result = await scrapeService.processScrapeRequest({ url, scrapeTarget });
      
      // Return the data
      return res.status(200).json({
        status: 'success',
        data: result
      });
      
    } catch (error: any) {
      console.error('Error in scrape endpoint:', error);
      
      // Check if error is from n8n response
      if (error.response) {
        return res.status(error.response.status).json({
          status: 'error',
          message: 'Error from n8n service',
          error: error.response.data
        });
      }
      
      return res.status(500).json({
        status: 'error',
        message: 'Failed to process scrape request',
        error: error.message
      });
    }
  }
  
  async getJobStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      // Check if n8n is enabled
      if (!config.n8n.enabled) {
        console.log('n8n is not enabled, returning mock job status');
        return res.status(200).json({
          status: 'success',
          data: {
            id,
            status: id.startsWith('mock-job') ? 'completed' : 'not_found',
            result: id.startsWith('mock-job') ? {
              url: 'https://example.com',
              content: 'This is mock content for the requested URL',
              timestamp: new Date().toISOString()
            } : null,
            timestamp: new Date().toISOString()
          }
        });
      }
      
      const jobStatus = await scrapeService.getJobStatus(id);
      
      return res.status(200).json({
        status: 'success',
        data: jobStatus
      });
      
    } catch (error: any) {
      console.error('Error in status endpoint:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to get job status',
        error: error.message
      });
    }
  }
}

export default new ScrapeController();
