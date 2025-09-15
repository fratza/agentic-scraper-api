import express from "express";
import urlListRoutes from "./url-list/route";
import monitoringRoutes from "./monitoring/route";
import resultsRoutes from "./results/route";
import getScheduledTasksRoutes from "./get-scheduled-tasks/route";
import getExtractedDataRoutes from "./get-extracted-data/route";

const router = express.Router();

// Mount url-list routes
router.use("/url-list", urlListRoutes);

// Mount monitoring routes
router.use("/submit-monitor-task", monitoringRoutes);

// Mount results routes
router.use("/getresults", resultsRoutes);

// Mount get scheduled tasks routes
router.use("/get-scheduled-tasks", getScheduledTasksRoutes);

// Mount get extracted data routes
router.use("/get-extracted-data", getExtractedDataRoutes);

export default router;
