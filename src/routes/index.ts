import { Express } from "express";
import scrapeRoutes from "../api/scrape/scrape.routes";
import n8nRoutes from "../api/n8n/n8n.routes";
import previewRoutes from "../api/preview/preview.routes";
import scrapedDataRoutes from "../api/scraped-data/scraped-data.routes";

export const routes = (app: Express): void => {
  app.use("/api/scrape", scrapeRoutes);
  app.use("/api/n8n", n8nRoutes);
  app.use("/api/preview", previewRoutes);
  app.use("/api/scraped-data", scrapedDataRoutes);
};
