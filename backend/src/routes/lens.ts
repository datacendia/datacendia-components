/**
 * CendiaLens™ API Routes
 * AI Interpretability Service
 */

import { Router, Request, Response } from 'express';
import { devAuth } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = Router();

router.use(devAuth);

// ===========================================================================
// STATUS / HEALTH
// ===========================================================================

/**
 * GET /lens/status (alias: /lens/health)
 * Service health and status
 */
router.get('/status', async (_req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: {
        service: 'CendiaLens',
        status: 'operational',
        version: '1.0.0',
        description: 'AI Interpretability Service',
        capabilities: [
          'Token confidence analysis',
          'Attention pattern visualization',
          'Latent space mapping',
          'Circuit tracing',
          'Symbolic residue detection',
          'Analysis comparison',
        ],
        analysisDepths: ['surface', 'standard', 'deep'],
        insightTypes: [
          'Low confidence regions',
          'Reasoning patterns',
          'Potential bias markers',
          'Semantic attention patterns',
        ],
        lastCheck: new Date().toISOString(),
      }
    });
  } catch (error) {
    logger.error('[Lens] Status error:', error);
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// Alias for health
router.get('/health', async (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      service: 'CendiaLens',
      status: 'operational',
      version: '1.0.0',
      lastCheck: new Date().toISOString(),
    }
  });
});

export default router;
