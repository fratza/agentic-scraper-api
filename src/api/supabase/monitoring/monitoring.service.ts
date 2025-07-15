import { config } from "../../../config";
import { createClient } from "@supabase/supabase-js";

/**
 * MonitoringService
 * Service for updating monitoring status in the raw table
 */
export class MonitoringService {
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
   * Update the is_monitored status for a record
   */
  async updateMonitoringStatus(id: string, is_monitored: boolean) {
    try {
      const { data, error } = await this.supabase
        .from("raw")
        .update({ is_monitored })
        .eq("id", id)
        .select();

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error("Error updating monitoring status:", error.message);
      throw error;
    }
  }
}

export default new MonitoringService();
