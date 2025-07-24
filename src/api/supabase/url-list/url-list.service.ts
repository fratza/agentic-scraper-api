import { config } from "../../../config";
import { createClient } from "@supabase/supabase-js";
import { UrlItem } from "./url-list.types";

/**
 * URLListService
 * Service for fetching URLs from the raw table
 */
export class URLListService {
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
   * Get all origin URLs from the raw table with their IDs
   */
  async getAllUrls(): Promise<UrlItem[]> {
    try {
      const { data, error } = await this.supabase
        .from("raw")
        .select("id, origin_url");

      if (error) throw error;

      // Extract id and origin_url values
      return data?.map((item: { id: number; origin_url: string }) => ({
        id: item.id,
        url: item.origin_url
      })) || [];
    } catch (error: any) {
      console.error("Error fetching URLs:", error.message);
      throw error;
    }
  }
}

const service = new URLListService();
export default service;
