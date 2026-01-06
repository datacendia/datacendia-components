/**
 * CendiaLens™ API Routes
 * AI Interpretability & Latent Mapping
 */

import { Router, Request, Response } from 'express';
import { cendiaLensService, LensRequest } from '../services/CendiaLensService';

const router = Router();

/**
 * POST /api/v1/lens/analyze
 * Run interpretability analysis on a prompt
 */
router.post('/analyze', async (req: Request, res: Response): Promise<void> => {
  try {
    const request: LensRequest = {
      prompt: req.body.prompt,
      model: req.body.model,
      depth: req.body.depth || 'standard',
      visualizations: req.body.visualizations || ['attention', 'latent', 'circuit', 'confidence'],
      compareWithPrevious: req.body.compareWithPrevious
    };

    if (!request.prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    const analysis = await cendiaLensService.analyze(request);
    
    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Lens analysis failed:', error);
    res.status(500).json({ 
      error: 'Analysis failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/v1/lens/analysis/:id
 * Get a specific analysis by ID
 */
router.get('/analysis/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params['id'];
    if (!id) {
      res.status(400).json({ error: 'Analysis ID is required' });
      return;
    }
    
    const analysis = cendiaLensService.getAnalysis(id);
    
    if (!analysis) {
      res.status(404).json({ error: 'Analysis not found' });
      return;
    }
    
    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Failed to get analysis:', error);
    res.status(500).json({ error: 'Failed to retrieve analysis' });
  }
});

/**
 * GET /api/v1/lens/analyses
 * List recent analyses
 */
router.get('/analyses', async (req: Request, res: Response): Promise<void> => {
  try {
    const limitParam = req.query['limit'];
    const limit = limitParam ? parseInt(limitParam as string) : 10;
    const analyses = cendiaLensService.listAnalyses(limit);
    
    res.json({
      success: true,
      analyses,
      count: analyses.length
    });
  } catch (error) {
    console.error('Failed to list analyses:', error);
    res.status(500).json({ error: 'Failed to list analyses' });
  }
});

/**
 * GET /api/v1/lens/analysis/:id/visualization
 * Get analysis formatted for visualization
 */
router.get('/analysis/:id/visualization', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params['id'];
    if (!id) {
      res.status(400).json({ error: 'Analysis ID is required' });
      return;
    }
    
    const vizData = cendiaLensService.exportForVisualization(id);
    
    if (!vizData) {
      res.status(404).json({ error: 'Analysis not found' });
      return;
    }
    
    res.json({
      success: true,
      visualization: vizData
    });
  } catch (error) {
    console.error('Failed to export visualization:', error);
    res.status(500).json({ error: 'Failed to export visualization' });
  }
});

/**
 * POST /api/v1/lens/compare
 * Compare two analyses
 */
router.post('/compare', async (req: Request, res: Response): Promise<void> => {
  try {
    const { analysisId1, analysisId2 } = req.body;
    
    if (!analysisId1 || !analysisId2) {
      res.status(400).json({ error: 'Both analysis IDs are required' });
      return;
    }
    
    const comparison = cendiaLensService.compareAnalyses(analysisId1, analysisId2);
    
    if (!comparison) {
      res.status(404).json({ error: 'One or both analyses not found' });
      return;
    }
    
    res.json({
      success: true,
      comparison
    });
  } catch (error) {
    console.error('Failed to compare analyses:', error);
    res.status(500).json({ error: 'Failed to compare analyses' });
  }
});

/**
 * GET /api/v1/lens/health
 * Health check
 */
router.get('/health', async (_req: Request, res: Response) => {
  res.json({
    success: true,
    service: 'CendiaLens',
    status: 'operational',
    features: [
      'Token confidence analysis',
      'Attention pattern visualization',
      'Latent space mapping',
      'Circuit tracing',
      'Symbolic residue detection',
      'Bias detection'
    ]
  });
});

export default router;
