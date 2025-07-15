import { config } from "../../../config";
import { createClient } from "@supabase/supabase-js";

/**
 * ResultsService
 * Service for retrieving data from the raw table
 */
export class ResultsService {
  private supabase;

  constructor() {
    if (!config.supabase.url || !config.supabase.anonKey) {
      throw new Error(
        "Supabase configuration is missing. Please check your environment variables."
      );
    }

    this.supabase = createClient(config.supabase.url, config.supabase.anonKey);
  }

  /**
   * Get data for a specific record by ID
   */
  async getDataById(id: string) {
    try {
      const { data, error } = await this.supabase
        .from("raw")
        .select("data")
        .eq("id", id)
        .single();

      if (error) throw error;

      return data?.data;
    } catch (error: any) {
      console.error("Error retrieving data:", error.message);
      throw error;
    }
  }
}

export default new ResultsService();
