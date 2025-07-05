import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Helper to check if n8n is enabled
const isN8nEnabled = () => {
  return process.env.N8N_WEBHOOK_URL && 
         !process.env.N8N_WEBHOOK_URL.startsWith('#');
};

export const config = {
  server: {
    port: process.env.PORT || 3000,
  },
  n8n: {
    enabled: isN8nEnabled(),
    webhookUrl: process.env.N8N_WEBHOOK_URL || null,
    scrapeWebhookUrl: process.env.N8N_SCRAPE_WEBHOOK_URL || null,
    apiUrl: process.env.N8N_API_URL || null,
    apiKey: process.env.N8N_API_KEY || null,
  },
  security: {
    apiKey: process.env.API_KEY,
  }
};

export default config;
