import { Express } from "express";
import scrapeRoutes from "../api/scrape/scrape.routes";
import n8nRoutes from "../api/n8n/n8n.routes";
import previewRoutes from "../api/preview/preview.routes";
import scrapedDataRoutes from "../api/scraped-data/scraped-data.routes";
import proceedScrapeRoutes from "../api/proceed-scrape/proceed-scrape.routes";

export const routes = (app: Express): void => {
  app.use("/api/scrape", scrapeRoutes);
  app.use("/api/n8n", n8nRoutes);
  app.use("/api/preview", previewRoutes);
  app.use("/api/scraped-data", scrapedDataRoutes);
  app.use("/api/proceed-scrape", proceedScrapeRoutes);
};
