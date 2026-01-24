/**
 * CendiaLens™ API Routes
 * AI Interpretability Service
 */

import { Router, Request, Response } from 'express';
import { devAuth } from '../middleware/auth.js';
import { cendiaLensService, AnalysisDepth } from '../services/CendiaLensService.js';
import { logger } from '../utils/logger.js';

const router = Router();

router.use(devAuth);

// ===========================================================================
// STATUS / HEALTH
// ===========================================================================

/**
 * GET /lens/status
 * Service health and status
 */
router.get('/status', async (_req: Request, res: Response) => {
  try {
    const health = await cendiaLensService.health();
    res.json({
      success: true,
      data: {
        service: 'CendiaLens',
        version: '1.0.0',
        description: 'AI Interpretability Service',
        ...health,
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
  try {
    const health = await cendiaLensService.health();
    res.json({ success: true, data: health });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// ANALYSIS ENDPOINTS
// ===========================================================================

/**
 * POST /lens/analyze
 * Run interpretability analysis on AI output
 */
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { inputText, outputText, model, depth } = req.body;
    
    if (!inputText || !outputText || !model) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: inputText, outputText, model'
      });
      return;
    }
    
    const analysis = await cendiaLensService.analyze({
      inputText,
      outputText,
      model,
      depth: depth as AnalysisDepth,
    });
    
    res.json({ success: true, data: analysis });
  } catch (error) {
    logger.error('[Lens] Analyze error:', error);
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

/**
 * GET /lens/analysis/:id
 * Get a specific analysis by ID
 */
router.get('/analysis/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] || '';
    const analysis = await cendiaLensService.getAnalysis(id);
    
    if (!analysis) {
      res.status(404).json({ success: false, error: 'Analysis not found' });
      return;
    }
    
    res.json({ success: true, data: analysis });
  } catch (error) {
    logger.error('[Lens] Get analysis error:', error);
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

/**
 * GET /lens/analyses
 * List recent analyses
 */
router.get('/analyses', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query['limit'] as string) || 20;
    const analyses = await cendiaLensService.listAnalyses(limit);
    res.json({ success: true, data: analyses });
  } catch (error) {
    logger.error('[Lens] List analyses error:', error);
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

/**
 * GET /lens/analysis/:id/visualization
 * Export analysis for visualization
 */
router.get('/analysis/:id/visualization', async (req: Request, res: Response) => {
  try {
    const id = req.params['id'] || '';
    const visualization = await cendiaLensService.exportForVisualization(id);
    
    if (!visualization) {
      res.status(404).json({ success: false, error: 'Analysis not found' });
      return;
    }
    
    res.json({ success: true, data: visualization });
  } catch (error) {
    logger.error('[Lens] Export visualization error:', error);
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

/**
 * POST /lens/compare
 * Compare two analyses
 */
router.post('/compare', async (req: Request, res: Response) => {
  try {
    const { analysisIdA, analysisIdB } = req.body;
    
    if (!analysisIdA || !analysisIdB) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: analysisIdA, analysisIdB'
      });
      return;
    }
    
    const comparison = await cendiaLensService.compareAnalyses(analysisIdA, analysisIdB);
    
    if (!comparison) {
      res.status(404).json({ success: false, error: 'One or both analyses not found' });
      return;
    }
    
    res.json({ success: true, data: comparison });
  } catch (error) {
    logger.error('[Lens] Compare error:', error);
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

export default router;
