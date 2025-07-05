import express from "express";
import previewController from "./preview.controller";

const router = express.Router();

/**
 * @route   POST /api/preview/sample_data
 * @desc    Receive sample data from n8n for preview
 * @access  Public (but can be secured with API key)
 */
router.post("/sample_data", previewController.previewSampleData);

/**
 * @route   GET /api/preview/events
 * @desc    Subscribe to SSE events for real-time preview data
 * @access  Public
 */
router.get("/events", previewController.subscribeToEvents);

export default router;
