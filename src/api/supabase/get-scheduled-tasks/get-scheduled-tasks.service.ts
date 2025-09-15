import { config } from "../../../config";
import { createClient } from "@supabase/supabase-js";
import { ScheduledTaskItem } from "./get-scheduled-tasks.types";

/**
 * GetScheduledTasksService
 * Service for fetching scheduled tasks with related URL information
 */
export class GetScheduledTasksService {
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
   * Get all scheduled tasks with task_name, frequency, run_at, last_run_at, status and origin_url
   */
  async getAllScheduledTasks(): Promise<ScheduledTaskItem[]> {
    try {
      const { data, error } = await this.supabase.from("scheduled_jobs")
        .select(`
          task_name,
          frequency,
          run_at,
          last_run_at,
          status,
          raw!id (origin_url)
        `);

      if (error) throw error;

      // Transform the data to match the expected format
      return (
        data?.map((item: any) => ({
          task_name: item.task_name,
          frequency: item.frequency,
          run_at: item.run_at,
          last_run_at: item.last_run_at,
          status: item.status,
          origin_url: item.raw?.origin_url || "",
        })) || []
      );
    } catch (error: any) {
      console.error("Error fetching scheduled tasks:", error.message);
      throw error;
    }
  }
}

const service = new GetScheduledTasksService();
export default service;
