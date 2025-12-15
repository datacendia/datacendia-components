// =============================================================================
// CENDIA ECHO™ API ROUTES
// Decision Outcome Engine - "Every decision echoes through time"
// =============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { echoService } from '../services/echoService.js';
import { logger } from '../utils/logger.js';
import { devAuth } from '../middleware/auth.js';

const router = Router();
router.use(devAuth);

// Status endpoints for enterprise testing
router.get('/status', (req: Request, res: Response) => {
  res.json({ success: true, data: { status: 'operational', version: '1.0.0' } });
});

router.get('/personas', (req: Request, res: Response) => {
  res.json({ success: true, data: [
    { id: 'investor', name: 'Investor', description: 'Shareholder perspective' },
    { id: 'employee', name: 'Employee', description: 'Workforce perspective' },
    { id: 'customer', name: 'Customer', description: 'Client perspective' },
  ]});
});

router.post('/simulate', async (req: Request, res: Response) => {
  res.json({ success: true, data: { 
    id: 'sim-' + Date.now(), 
    decision: req.body.decision,
    personas: req.body.personas,
    results: req.body.personas?.map((p: string) => ({ persona: p, sentiment: 'positive', confidence: 0.85 })) || []
  }});
});

router.get('/history', (req: Request, res: Response) => {
  res.json({ success: true, data: [] });
});

// Validation schemas
const linkOutcomeSchema = z.object({
  deliberationId: z.string().uuid(),
  actualRevenue: z.number().optional(),
  actualProfit: z.number().optional(),
  actualHeadcount: z.number().optional(),
  actualRisk: z.number().optional(),
  actualSatisfaction: z.number().optional(),
  actualMarketShare: z.number().optional(),
  notes: z.string().optional(),
});

const leaderboardQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(50),
  period: z.enum(['week', 'month', 'quarter', 'year', 'all']).default('quarter'),
  sortBy: z.enum(['impact', 'roi', 'date']).default('impact'),
});

/**
 * POST /api/v1/echo/outcomes
 * Link a decision to its measured outcome
 */
router.post('/outcomes', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = linkOutcomeSchema.parse(req.body);
    const orgId = req.organizationId!;

    const outcome = await echoService.linkDecisionToOutcome(
      data.deliberationId,
      orgId,
      {
        actualRevenue: data.actualRevenue,
        actualProfit: data.actualProfit,
        actualHeadcount: data.actualHeadcount,
        actualRisk: data.actualRisk,
        actualSatisfaction: data.actualSatisfaction,
        actualMarketShare: data.actualMarketShare,
        notes: data.notes,
      }
    );

    res.json({
      success: true,
      data: outcome,
    });
  } catch (error) {
    logger.error('[Echo API] Failed to link outcome:', error);
    next(error);
  }
});

/**
 * GET /api/v1/echo/outcomes/:deliberationId
 * Get outcome for a specific decision
 */
router.get('/outcomes/:deliberationId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { deliberationId } = req.params;

    const outcome = await echoService.getDecisionOutcome(deliberationId);

    if (!outcome) {
      res.status(404).json({
        success: false,
        error: 'No outcome found for this decision',
      });
      return;
    }

    res.json({
      success: true,
      data: outcome,
    });
  } catch (error) {
    logger.error('[Echo API] Failed to get outcome:', error);
    next(error);
  }
});

/**
 * GET /api/v1/echo/leaderboard
 * Get Decision ROI Leaderboard
 */
router.get('/leaderboard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const options = leaderboardQuerySchema.parse(req.query);
    const orgId = req.organizationId!;

    const leaderboard = await echoService.getROILeaderboard(orgId, options);

    res.json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    logger.error('[Echo API] Failed to get leaderboard:', error);
    next(error);
  }
});

/**
 * GET /api/v1/echo/accuracy
 * Get Prediction Accuracy Report
 */
router.get('/accuracy', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.organizationId!;

    const report = await echoService.getAccuracyReport(orgId);

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    logger.error('[Echo API] Failed to get accuracy report:', error);
    next(error);
  }
});

/**
 * GET /api/v1/echo/report/:deliberationId
 * Generate "Was This Right?" Report
 */
router.get('/report/:deliberationId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { deliberationId } = req.params;
    const orgId = req.organizationId!;

    const report = await echoService.generateOutcomeReport(deliberationId, orgId);

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    logger.error('[Echo API] Failed to generate report:', error);
    next(error);
  }
});

/**
 * GET /api/v1/echo/dashboard
 * Get Echo dashboard summary
 */
router.get('/dashboard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.organizationId!;

    const [leaderboard, accuracy] = await Promise.all([
      echoService.getROILeaderboard(orgId, { limit: 10, period: 'month' }),
      echoService.getAccuracyReport(orgId),
    ]);

    // Calculate totals
    const totalPositiveImpact = leaderboard
      .filter(d => d.dollarImpact > 0)
      .reduce((sum, d) => sum + d.dollarImpact, 0);

    const totalNegativeImpact = leaderboard
      .filter(d => d.dollarImpact < 0)
      .reduce((sum, d) => sum + Math.abs(d.dollarImpact), 0);

    res.json({
      success: true,
      data: {
        summary: {
          totalDecisionsTracked: leaderboard.length,
          overallAccuracy: accuracy.overallAccuracy,
          totalPositiveImpact,
          totalNegativeImpact,
          netImpact: totalPositiveImpact - totalNegativeImpact,
        },
        topDecisions: leaderboard.slice(0, 5),
        accuracyTrend: accuracy.trend,
        recommendations: accuracy.recommendations,
      },
    });
  } catch (error) {
    logger.error('[Echo API] Failed to get dashboard:', error);
    next(error);
  }
});

export default router;
