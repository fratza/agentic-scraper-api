import express from "express";
import monitoringController from "./monitoring.controller";

const router = express.Router();

/**
 * @route   POST /api/monitoring/is-monitored
 * @desc    Update monitoring status for a record
 * @access  Public
 */
router.post("/is-monitored", monitoringController.updateMonitoring);

export default router;
