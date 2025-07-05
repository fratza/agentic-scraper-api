import express from "express";
import previewController from "./preview.controller";

const router = express.Router();

/**
 * @route   POST /api/preview/sample_data
 * @desc    Receive sample data from n8n for preview and return it directly (no storage)
 * @access  Public (but can be secured with API key)
 */
router.post("/sample_data", previewController.previewSampleData);

/**
 * @route   GET /api/preview/sample_data
 * @desc    [DEPRECATED] - Preview data is no longer stored
 * @access  Public
 */
router.get("/sample_data", previewController.getPreviewData);

export default router;
