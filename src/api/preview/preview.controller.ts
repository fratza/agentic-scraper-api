import { Request, Response } from 'express';

/**
 * PreviewController
 * Handles preview sample data from n8n
 */
export class PreviewController {
  /**
   * Receive and process sample data from n8n
   */
  async previewSampleData(req: Request, res: Response) {
    try {
      // Log the received data
      console.log('Received preview sample data:');
      console.log(JSON.stringify(req.body, null, 2));
      
      // Store the data in memory or database if needed
      // This is just a simple implementation that returns the data back
      
      return res.status(200).json({
        status: 'success',
        message: 'Sample data received successfully',
        data: req.body
      });
    } catch (error: any) {
      console.error('Error processing preview sample data:', error.message);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to process sample data',
        error: error.message
      });
    }
  }
}

export default new PreviewController();
