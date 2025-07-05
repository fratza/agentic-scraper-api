/**
 * ScrapedDataService
 * Handles business logic for scraped data
 */

// In-memory storage for scraped data (replace with database in production)
interface ScrapedDataItem {
  id: string;
  data: any;
  timestamp: Date;
}

export class ScrapedDataService {
  private scrapedDataStore: ScrapedDataItem[] = [];

  /**
   * Save scraped data
   */
  async saveScrapedData(data: any): Promise<ScrapedDataItem> {
    const newItem: ScrapedDataItem = {
      id: this.generateId(),
      data,
      timestamp: new Date(),
    };

    this.scrapedDataStore.push(newItem);
    return newItem;
  }

  /**
   * Get all scraped data
   */
  async getAllScrapedData(): Promise<ScrapedDataItem[]> {
    return this.scrapedDataStore;
  }

  /**
   * Get scraped data by ID
   */
  async getScrapedDataById(id: string): Promise<ScrapedDataItem | undefined> {
    return this.scrapedDataStore.find(item => item.id === id);
  }

  /**
   * Generate a simple ID
   * Note: In production, use a more robust ID generation method
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  }
}

export default new ScrapedDataService();
