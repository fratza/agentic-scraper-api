import express from "express";
import urlListController from "./url-list.controller";

const router = express.Router();

/**
 * @route   GET /api/supabase/url-list
 * @desc    Get all origin URLs from the raw table
 * @access  Public
 */
router.get("/", urlListController.getUrlList);

export default router;
