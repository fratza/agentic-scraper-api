import { config } from "../../../config";
import { createClient } from "@supabase/supabase-js";
import { ExtractedDataItem } from "./get-extracted-data.types";

/**
 * GetExtractedDataService
 * Service for fetching data from raw table by ID
 */
export class GetExtractedDataService {
  private supabase;

  constructor() {
    if (!config.supabase.url || !config.supabase.anonKey) {
      throw new Error(
        "Supabase configuration is missing. Please check your environment variables.",
      );
    }

    this.supabase = createClient(config.supabase.url, config.supabase.anonKey);
  }

  /**
   * Get data from raw table by ID
   */
  async getExtractedDataById(id: string): Promise<ExtractedDataItem | null> {
    try {
      const { data, error } = await this.supabase
        .from("raw")
        .select("data")
        .eq("url_id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return null; // No data found
        }
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error("Error fetching extracted data:", error.message);
      throw error;
    }
  }
}

const service = new GetExtractedDataService();
export default service;
