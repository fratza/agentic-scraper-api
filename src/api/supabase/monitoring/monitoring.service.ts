import { config } from "../../../config";
import { createClient } from "@supabase/supabase-js";
import { SubmitMonitorTaskRequest } from "./monitoring.types";

/**
 * MonitoringService
 * Service for monitoring tasks and status updates
 */

interface MonitorTask {
  taskName: string;
  url: string;
  frequency_value: number;
  frequency_unit: string;
  next_runAt: string;
}
export class MonitoringService {
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
   * Update the runAt field in the scheduled_jobs table
   */
  async updateScheduledJobRunAt(runId: string, runAt: string) {
    try {
      const { data, error } = await this.supabase
        .from("scheduled_jobs")
        .update({ run_at: runAt })
        .eq("runId", runId)
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
            taskName: task.taskName,
            url: task.url,
            frequency_value: task.frequency_value,
            frequency_unit: task.frequency_unit,
            next_runAt: task.next_runAt,
          },
        ])
        .select();

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error("Error creating monitor task:", error.message);
      throw error;
    }
  }

  /**
   * Submit a monitoring task
   * 1. Set is_monitor column on table raw to true
   * 2. Insert or update the scheduled_jobs table
   */
  async submitMonitorTask(taskData: SubmitMonitorTaskRequest) {
    try {
      // Step 1: Update is_monitored column in raw table to true
      const { data: rawData, error: rawError } = await this.supabase
        .from("raw")
        .update({ is_monitored: true })
        .eq("url_id", taskData.urlId)
        .select();

      if (rawError) throw rawError;

      // Step 2: Insert or update the scheduled_jobs table
      const { data: jobData, error: jobError } = await this.supabase
        .from("scheduled_jobs")
        .upsert(
          {
            id: taskData.urlId,
            task_name: taskData.taskName,
            frequency: `${taskData.frequency.value} ${taskData.frequency.unit}`,
            run_at: taskData.runAt,
            last_run_at: null,
            status: "active",
          },
          { onConflict: "id" },
        )
        .select();

      if (jobError) throw jobError;

      return {
        raw: rawData,
        scheduledJob: jobData,
      };
    } catch (error: any) {
      console.error("Error submitting monitor task:", error.message);
      throw error;
    }
  }
}

export default new MonitoringService();
