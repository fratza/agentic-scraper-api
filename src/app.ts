import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import { routes } from "./routes/";

// Initialize express app
const app = express();

// CORS configuration - allow all origins with SSE support
const corsOptions = {
  origin: true, // Allow any origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "X-Update-Operation",
    "If-Match",
  ],
  exposedHeaders: ["Content-Type", "Access-Control-Allow-Origin"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400, // Cache preflight response for 24 hours
};

// Middleware
app.use(cors(corsOptions));

// Additional middleware to ensure CORS headers are set
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Update-Operation, If-Match"
  );

  // Handle OPTIONS method
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});
app.use(express.json());
app.use(morgan("dev")); // Logging

// Apply routes
routes(app);

// Root route
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Agentic Scraper API",
    status: "running",
    endpoints: {
      scrape: "/api/scrape",
      n8n: "/api/n8n",
      preview: "/api/preview",
      scrapedData: "/api/scraped-data",
      supabase: {
        urlList: "/api/supabase/url-list",
        submitMonitorTask: "/api/supabase/submit-monitor-task",
        getResults: "/api/supabase/getresults",
        scheduledTask: "/api/supabase/scheduled-task",
      },
    },
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: err.message || "Internal Server Error",
    status: "error",
  });
});

export default app;
