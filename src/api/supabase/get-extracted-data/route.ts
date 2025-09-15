import { Router } from "express";
import getExtractedDataController from "./get-extracted-data.controller";

const router = Router();

/**
 * GET /api/supabase/get-extracted-data/:id
 * Fetch data from raw table by ID
 */
router.get("/:id", getExtractedDataController.getExtractedData);

export default router;
