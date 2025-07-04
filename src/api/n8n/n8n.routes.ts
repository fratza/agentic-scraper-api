import express from 'express';
import n8nController from './n8n.controller';

const router = express.Router();

/**
 * @route   POST /api/n8n/webhook-result
 * @desc    Receive webhook results from n8n
 * @access  Public (but can be secured with API key)
 */
router.post('/webhook-result', n8nController.processWebhookResult);

/**
 * @route   GET /api/n8n/workflows
 * @desc    Get available n8n workflows
 * @access  Private
 */
router.get('/workflows', n8nController.getWorkflows);

/**
 * @route   POST /api/n8n/execute-workflow/:id
 * @desc    Execute a specific n8n workflow
 * @access  Private
 */
router.post('/execute-workflow/:id', n8nController.executeWorkflow);

export default router;
