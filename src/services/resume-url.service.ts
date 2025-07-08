/**
 * Service to store and retrieve the resume URL across controllers
 */
export class ResumeUrlService {
  private resumeUrl: string | null = null;

  /**
   * Store a resume URL
   * @param url The resume URL to store
   */
  setResumeUrl(url: string): void {
    this.resumeUrl = url;
    console.log('Stored resume URL:', this.resumeUrl);
  }

  /**
   * Get the stored resume URL
   * @returns The stored resume URL or null if not set
   */
  getResumeUrl(): string | null {
    return this.resumeUrl;
  }

  /**
   * Clear the stored resume URL
   */
  clearResumeUrl(): void {
    this.resumeUrl = null;
  }
}

// Export a singleton instance
export default new ResumeUrlService();
