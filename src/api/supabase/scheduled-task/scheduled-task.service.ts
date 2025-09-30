import { config } from "../../../config";
import { createClient } from "@supabase/supabase-js";
import { ScheduledTaskItem } from "./scheduled-task.types";

/**
 * ScheduledTaskService
 * Service for fetching scheduled tasks with related URL information
 */
export class ScheduledTaskService {
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
   * Get all scheduled tasks with related URL information
   * Fetches task_name, frequency, run_at, last_run_at from scheduled_jobs table
   * and origin_url from raw table using the task_id foreign key
   */
  async getAllScheduledTasks(): Promise<ScheduledTaskItem[]> {
    try {
      const { data, error } = await this.supabase
        .from("scheduled_jobs")
        .select(`
          task_name,
          frequency,
          run_at,
          last_run_at,
          raw:task_id (origin_url)
        `);

      if (error) throw error;

      // Transform the data to match the expected format
      return data?.map((item: any) => ({
        task_name: item.task_name,
        frequency: item.frequency,
        run_at: item.run_at,
        last_run_at: item.last_run_at,
        origin_url: item.raw?.origin_url || ''
      })) || [];
    } catch (error: any) {
      console.error("Error fetching scheduled tasks:", error.message);
      throw error;
    }
  }
}

const service = new ScheduledTaskService();
export default service;
