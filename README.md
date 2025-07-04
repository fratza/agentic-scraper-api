# Agentic Scraper API

Backend API service for the Agentic Web Scraper UI, providing integration with n8n for web scraping functionality.

## Features

- RESTful API endpoints for web scraping requests
- Integration with n8n workflows
- Status checking for scraping jobs
- Webhook receiver for n8n results

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- n8n instance (local or hosted)

## Project Structure

```
/agentic-scraper-api
│
├── src/                           # All source code
│   ├── api/                       # Grouped by domain
│   │   ├── scrape/
│   │   │   ├── scrape.controller.ts
│   │   │   ├── scrape.service.ts
│   │   │   ├── scrape.routes.ts
│   │   │   └── scrape.schema.ts   # Type definitions
│   │   └── n8n/
│   │       ├── n8n.controller.ts
│   │       ├── n8n.service.ts
│   │       ├── n8n.routes.ts
│   │       └── n8n.schema.ts
│   ├── config/                    # App config, env loaders
│   │   └── index.ts
│   ├── routes/                    # Central route aggregator
│   │   └── index.ts
│   ├── app.ts                     # Express app config
│   └── server.ts                  # Entry point
│
├── .env                           # Environment variables
├── tsconfig.json                  # TypeScript config
└── package.json
```

## Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:

```bash
npm install
```

3. Configure environment variables by editing the `.env` file:

```
PORT=3000
N8N_WEBHOOK_URL=http://localhost:5678/webhook/scraper
N8N_API_URL=http://localhost:5678/api/v1
N8N_API_KEY=your_n8n_api_key_here
API_KEY=your_api_key_here
```

## Usage

### Starting the server

Development mode with auto-restart:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

### API Endpoints

#### Scraping Endpoints

- `POST /api/scrape` - Submit a new scraping request
  - Request body: `{ "url": "https://example.com", "scrapeTarget": "product prices" }`
  
- `GET /api/scrape/status/:id` - Check status of a scraping job
  - Response: `{ "status": "success", "data": { "jobId": "123", "status": "completed", "progress": "100%" } }`

#### n8n Integration Endpoints

- `POST /api/n8n/webhook-result` - Receive webhook results from n8n
  - Request body: `{ "data": [...], "metadata": { ... } }`
  
- `GET /api/n8n/workflows` - Get available n8n workflows
  - Response: `{ "status": "success", "data": [...] }`
  
- `POST /api/n8n/execute-workflow/:id` - Execute a specific n8n workflow
  - Request body: `{ "data": { ... } }`

## n8n Setup

1. Install and set up n8n (https://n8n.io/docs/getting-started/installation/)
2. Create a new workflow in n8n
3. Add a webhook node as the trigger
4. Set the webhook path to `/scraper`
5. Add HTTP Request nodes to perform the actual scraping
6. Add any processing nodes needed (like HTML Extract, JSON Parse, etc.)
7. Return the processed data through the webhook response

## Integration with UI

Update the frontend code to call this API instead of simulating scraping:

```javascript
async function performScraping() {
  try {
    const url = urlInput.value;
    const scrapeTarget = scrapeTargetInput.value;
    
    // Show progress
    progressContainer.style.display = 'block';
    
    // Make the API call to your backend
    const response = await fetch('http://localhost:3000/api/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, scrapeTarget }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to scrape data');
    }
    
    // Get the scraped data
    const result = await response.json();
    const scrapedData = result.data;
    
    // Hide progress and display the data table
    progressContainer.style.display = 'none';
    displayDataTable(scrapedData);
    
  } catch (error) {
    console.error('Error:', error);
    // Show error message to user
    alert('Failed to scrape data: ' + error.message);
  }
}
```

## License

ISC
