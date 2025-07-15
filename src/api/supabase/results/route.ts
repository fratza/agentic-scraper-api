import express from "express";
import resultsController from "./results.controller";

const router = express.Router();

/**
 * @route   GET /api/supabase/getresults
 * @desc    Get data from raw table by ID
 * @access  Public
 */
router.get("/", resultsController.getData);

export default router;
