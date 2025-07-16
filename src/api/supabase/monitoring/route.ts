import express from "express";
import monitoringController from "./monitoring.controller";

const router = express.Router();

/**
 * @route   POST /api/supabase/submit-monitor-task
 * @desc    Submit a new monitoring task
 * @access  Public
 */
router.post("/", monitoringController.submitMonitorTask);

export default router;
