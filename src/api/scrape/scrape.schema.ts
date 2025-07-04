export interface ScrapeRequest {
  url: string;
  scrapeTarget: string;
}

export interface JobStatus {
  jobId: string;
  status: string;
  progress: string;
  completedAt?: string;
  result?: any; // Adding result field for job output data
}
