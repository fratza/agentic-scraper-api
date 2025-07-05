import axios from "axios";
import { ScrapeRequest, JobStatus } from "./scrape.schema";
import { config } from "../../config";

export class ScrapeService {
  async processScrapeRequest(scrapeData: ScrapeRequest) {
    try {
      // Check if n8n is enabled and webhook URL is available
      if (!config.n8n.enabled || !config.n8n.webhookUrl) {
        console.log("n8n webhook URL not available, returning mock response");
        return {
          received: true,
          timestamp: new Date().toISOString(),
          mockData: true,
          url: scrapeData.url,
          scrapeTarget: scrapeData.scrapeTarget,
        };
      }

      // Forward to n8n webhook
      console.log(`Sending request to n8n webhook: ${config.n8n.webhookUrl}`);

      // Format payload to match what n8n expects (same as startScrape method)
      const payload = {
        URL: scrapeData.url,
        "What do you want to scrape?": scrapeData.scrapeTarget,
        timestamp: new Date().toISOString(),
      };

      console.log(`Payload:`, payload);

      try {
        // Log the full request details for debugging
        console.log("===== DEBUG REQUEST DETAILS =====");
        console.log(`URL: ${config.n8n.webhookUrl}`);
        console.log("Headers:", { "Content-Type": "application/json" });
        console.log("Payload:", JSON.stringify(payload, null, 2));
        console.log("================================");

        // Try with different content type to match what might be working in Postman
        const n8nResponse = await axios.post(config.n8n.webhookUrl, payload, {
          headers: {
            "Content-Type": "application/json",
            // Add any other headers that might be needed
            Accept: "application/json",
          },
        });

        console.log(`n8n response status: ${n8nResponse.status}`);
        console.log(`n8n response data:`, n8nResponse.data);

        return n8nResponse.data;
      } catch (axiosError: any) {
        // More detailed error handling for Axios errors
        if (axiosError.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error(
            `n8n webhook error: ${axiosError.response.status} - ${axiosError.response.statusText}`
          );

          if (axiosError.response.status === 404) {
            console.error(
              `The webhook URL (${config.n8n.webhookUrl}) was not found. Please verify the URL is correct.`
            );
            throw new Error(
              `Webhook URL not found (404). Please verify the URL: ${config.n8n.webhookUrl}. You may need to update your .env file with the correct webhook URL.`
            );
          }

          throw axiosError;
        } else if (axiosError.request) {
          // The request was made but no response was received
          console.error("No response received from n8n webhook");
          throw new Error(
            "No response received from n8n webhook. Please check your network connection and webhook URL."
          );
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error(
            "Error setting up webhook request:",
            axiosError.message
          );
          throw axiosError;
        }
      }
    } catch (error: any) {
      console.error("Error in processScrapeRequest:", error.message);
      // Re-throw the error so it can be handled by the controller
      throw error;
    }
  }

  async getJobStatus(jobId: string): Promise<JobStatus> {
    // Check if n8n is enabled
    if (!config.n8n.enabled) {
      console.log("n8n is not enabled, returning mock job status");
      return {
        jobId,
        status: jobId.startsWith("mock-job") ? "completed" : "not_found",
        progress: jobId.startsWith("mock-job") ? "100%" : "0%",
        completedAt: jobId.startsWith("mock-job")
          ? new Date().toISOString()
          : undefined,
        result: jobId.startsWith("mock-job")
          ? {
              url: "https://example.com",
              content: "This is mock content for the requested URL",
              timestamp: new Date().toISOString(),
            }
          : undefined,
      };
    }

    // In a real implementation, you would check the status in a database or n8n API
    // For now, we'll simulate a response
    return {
      jobId,
      status: "completed",
      progress: "100%",
      completedAt: new Date().toISOString(),
    };
  }
}

export default new ScrapeService();
