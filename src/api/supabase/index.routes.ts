import express from "express";
import urlListRoutes from "./url-list/route";
import monitoringRoutes from "./monitoring/route";
import resultsRoutes from "./results/route";
import scheduledTaskRoutes from "./scheduled-task/route";

const router = express.Router();

// Mount url-list routes
router.use("/url-list", urlListRoutes);

// Mount monitoring routes
router.use("/submit-monitor-task", monitoringRoutes);

// Mount results routes
router.use("/getresults", resultsRoutes);

// Mount scheduled task routes
router.use("/scheduled-task", scheduledTaskRoutes);

export default router;
