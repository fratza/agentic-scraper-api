import express from 'express';
import scrapeController from './scrape.controller';

const router = express.Router();

/**
 * @route   POST /api/scrape/start-scrape
 * @desc    Start a scraping job with URL and prompt
 * @access  Public
 */
router.post('/start-scrape', scrapeController.startScrape);

/**
 * @route   POST /api/scrape
 * @desc    Process scraping request and forward to n8n
 * @access  Public
 */
router.post('/', scrapeController.processScrapeRequest);

/**
 * @route   GET /api/scrape/status/:id
 * @desc    Get status of a scraping job
 * @access  Public
 */
router.get('/status/:id', scrapeController.getJobStatus);

export default router;
