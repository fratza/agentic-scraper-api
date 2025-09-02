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
        "Supabase configuration is missing. Please check your environment variables.",
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
        .select("url_id, origin_url, name");

      if (error) throw error;

      // Extract id and origin_url values
      return (
        data?.map(
          (item: { url_id: number; origin_url: string; name: string }) => ({
            id: item.url_id,
            url: item.origin_url,
            name: item.name,
          }),
        ) || []
      );
    } catch (error: any) {
      console.error("Error fetching URLs:", error.message);
      throw error;
    }
  }
}

const service = new URLListService();
export default service;
