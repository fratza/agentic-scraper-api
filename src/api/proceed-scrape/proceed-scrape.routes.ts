import { Router } from "express";
import proceedScrapeController from "./proceed-scrape.controller";

const router = Router();

/**
 * @route   POST /api/proceed-scrape
 * @desc    Process a request to proceed with scraping
 * @access  Public
 */
router.post("/", proceedScrapeController.proceedWithScrape);

export default router;
