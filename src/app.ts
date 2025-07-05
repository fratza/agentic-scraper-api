import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import { routes } from "./routes/";

// Initialize express app
const app = express();

// CORS configuration - allow all origins with SSE support
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Type"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));
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
