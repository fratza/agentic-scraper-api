import express from "express";
import monitoringController from "./monitoring.controller";

const router = express.Router();

/**
 * @route   POST /api/supabase/submit-monitor-task
 * @desc    Update monitoring status for a record
 * @access  Public
 */
router.post("/", monitoringController.updateMonitoring);

export default router;
