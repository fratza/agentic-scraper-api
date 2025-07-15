import express from "express";
import urlListRoutes from "./url-list/route";
import monitoringRoutes from "./monitoring/route";
import resultsRoutes from "./results/route";

const router = express.Router();

// Mount url-list routes
router.use("/url-list", urlListRoutes);

// Mount monitoring routes
router.use("/is-monitored", monitoringRoutes);

// Mount results routes
router.use("/getresults", resultsRoutes);

export default router;
