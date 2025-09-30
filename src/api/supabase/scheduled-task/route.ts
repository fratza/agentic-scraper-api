import express from "express";
import scheduledTaskController from "./scheduled-task.controller";

const router = express.Router();

/**
 * @route   GET /api/supabase/scheduled-task
 * @desc    Get all scheduled tasks with related URL information
 * @access  Public
 */
router.get("/", scheduledTaskController.getScheduledTasks);

export default router;
