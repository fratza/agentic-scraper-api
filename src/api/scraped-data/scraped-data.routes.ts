import express from "express";
import scrapedDataController from "./scraped-data.controller";

const router = express.Router();

/**
 * @route   POST /api/scraped-data
 * @desc    Receive scraped JSON data
 * @access  Public (but can be secured with API key)
 */
router.post("/", scrapedDataController.receiveScrapedData);

/**
 * @route   GET /api/scraped-data
 * @desc    Get all scraped data
 * @access  Public
 */
router.get("/", scrapedDataController.getAllScrapedData);

/**
 * @route   GET /api/scraped-data/events
 * @desc    Subscribe to SSE events for real-time scraped data
 * @access  Public
 */
router.get("/events", scrapedDataController.subscribeToEvents);

/**
 * @route   GET /api/scraped-data/:id
 * @desc    Get scraped data by ID
 * @access  Public
 */
router.get("/:id", scrapedDataController.getScrapedDataById);

export default router;
