import express from "express";
import getScheduledTasksController from "./get-scheduled-tasks.controller";

const router = express.Router();

/**
 * @route   GET /api/supabase/get-scheduled-tasks
 * @desc    Get scheduled tasks with task_name, frequency, run_at, last_run_at, status from scheduled_jobs and origin_url from raw
 * @access  Public
 */
router.get("/", getScheduledTasksController.getScheduledTasks);

export default router;
