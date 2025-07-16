import { config } from "../../../config";
import { createClient } from "@supabase/supabase-js";

/**
 * MonitoringService
 * Service for monitoring tasks and status updates
 */

interface MonitorTask {
  task_name: string;
  url: string;
  frequency_value: number;
  frequency_unit: string;
  next_run_at: string;
}
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

  /**
   * Update the run_at field in the scheduled_jobs table
   */
  async updateScheduledJobRunAt(run_id: string, run_at: string) {
    try {
      const { data, error } = await this.supabase
        .from("scheduled_jobs")
        .update({ run_at })
        .eq("run_id", run_id)
        .select();

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error("Error updating scheduled job run_at:", error.message);
      throw error;
    }
  }

  /**
   * Create a new monitoring task
   */
  async createMonitorTask(task: MonitorTask) {
    try {
      const { data, error } = await this.supabase
        .from("monitor_tasks")
        .insert([
          {
            task_name: task.task_name,
            url: task.url,
            frequency_value: task.frequency_value,
            frequency_unit: task.frequency_unit,
            next_run_at: task.next_run_at
          }
        ])
        .select();

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error("Error creating monitor task:", error.message);
      throw error;
    }
  }
}

export default new MonitoringService();
