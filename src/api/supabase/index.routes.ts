import express from "express";
import urlListRoutes from "./url-list/route";
import monitoringRoutes from "./monitoring/route";

const router = express.Router();

// Mount url-list routes
router.use("/url-list", urlListRoutes);

// Mount monitoring routes
router.use("/is-monitored", monitoringRoutes);

export default router;
