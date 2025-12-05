// =============================================================================
// DATACENDIA ENTERPRISE API ROUTES
// Full-Stack Corporation Services
// =============================================================================

import express, { Request, Response, Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

// Enterprise Services
import { cendiaProcureService } from '../services/enterprise/CendiaProcureService.js';
import { cendiaScoutService } from '../services/enterprise/CendiaScoutService.js';
import { cendiaRainmakerService } from '../services/enterprise/CendiaRainmakerService.js';
import { cendiaRegentService } from '../services/enterprise/CendiaRegentService.js';
import { getEnterpriseDashboard } from '../services/enterprise/index.js';

const router: Router = express.Router();

// =============================================================================
// DASHBOARD
// =============================================================================

router.get('/dashboard', authenticate, async (_req: Request, res: Response) => {
  try {
    const dashboard = await getEnterpriseDashboard();
    res.json({ dashboard });
  } catch (error) {
    logger.error('Failed to get enterprise dashboard:', error);
    res.status(500).json({ error: 'Failed to get dashboard' });
  }
});

// =============================================================================
// CENDIAPROCURE ROUTES
// =============================================================================

// Get expiring contracts
router.get('/procure/contracts/expiring', authenticate, async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 90;
    const contracts = cendiaProcureService.getExpiringContracts(days);
    res.json({ contracts });
  } catch (error) {
    logger.error('Failed to get expiring contracts:', error);
    res.status(500).json({ error: 'Failed to get contracts' });
  }
});

// Add contract
router.post('/procure/contracts', authenticate, async (req: Request, res: Response) => {
  try {
    const contract = cendiaProcureService.addContract(req.body);
    res.json({ contract });
  } catch (error) {
    logger.error('Failed to add contract:', error);
    res.status(500).json({ error: 'Failed to add contract' });
  }
});

// Execute The Squeeze
router.post('/procure/squeeze', authenticate, async (_req: Request, res: Response) => {
  try {
    const result = await cendiaProcureService.executeTheSqueeze();
    logger.info(`CendiaProcure: The Squeeze executed - ${result.negotiationsInitiated} negotiations, $${result.totalPotentialSavings} potential savings`);
    res.json({ result });
  } catch (error) {
    logger.error('Failed to execute The Squeeze:', error);
    res.status(500).json({ error: 'Failed to execute' });
  }
});

// Record negotiation result
router.post('/procure/contracts/:id/result', authenticate, async (req: Request, res: Response) => {
  try {
    const { negotiatedPrice } = req.body;
    const result = cendiaProcureService.recordNegotiationResult(req.params.id, negotiatedPrice);
    res.json({ result });
  } catch (error) {
    logger.error('Failed to record result:', error);
    res.status(500).json({ error: 'Failed to record' });
  }
});

// Get procurement metrics
router.get('/procure/metrics', authenticate, async (_req: Request, res: Response) => {
  try {
    const metrics = cendiaProcureService.getMetrics();
    res.json({ metrics });
  } catch (error) {
    logger.error('Failed to get procurement metrics:', error);
    res.status(500).json({ error: 'Failed to get metrics' });
  }
});

// =============================================================================
// CENDIASCOUT ROUTES
// =============================================================================

// Map top performer genome
router.post('/scout/performers', authenticate, async (req: Request, res: Response) => {
  try {
    const performer = await cendiaScoutService.mapTopPerformerGenome(req.body);
    res.json({ performer });
  } catch (error) {
    logger.error('Failed to map performer genome:', error);
    res.status(500).json({ error: 'Failed to map genome' });
  }
});

// Get ideal profile for role
router.get('/scout/profiles/:role', authenticate, async (req: Request, res: Response) => {
  try {
    const profile = cendiaScoutService.getIdealProfile(req.params.role);
    res.json({ profile });
  } catch (error) {
    logger.error('Failed to get ideal profile:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Match candidate
router.post('/scout/candidates/match', authenticate, async (req: Request, res: Response) => {
  try {
    const { candidate, targetRole } = req.body;
    const matched = await cendiaScoutService.matchCandidate(candidate, targetRole);
    res.json({ candidate: matched });
  } catch (error) {
    logger.error('Failed to match candidate:', error);
    res.status(500).json({ error: 'Failed to match' });
  }
});

// Build shadow pipeline
router.post('/scout/pipelines', authenticate, async (req: Request, res: Response) => {
  try {
    const { roleId, roleName, department, targetCount } = req.body;
    const pipeline = await cendiaScoutService.buildShadowPipeline(roleId, roleName, department, targetCount);
    res.json({ pipeline });
  } catch (error) {
    logger.error('Failed to build pipeline:', error);
    res.status(500).json({ error: 'Failed to build pipeline' });
  }
});

// Activate emergency search
router.post('/scout/pipelines/:id/emergency', authenticate, async (req: Request, res: Response) => {
  try {
    const result = await cendiaScoutService.activateEmergencySearch(req.params.id);
    res.json({ result });
  } catch (error) {
    logger.error('Failed to activate emergency search:', error);
    res.status(500).json({ error: 'Failed to activate' });
  }
});

// Get pipeline health
router.get('/scout/pipelines/health', authenticate, async (_req: Request, res: Response) => {
  try {
    const health = cendiaScoutService.getPipelineHealth();
    res.json({ health });
  } catch (error) {
    logger.error('Failed to get pipeline health:', error);
    res.status(500).json({ error: 'Failed to get health' });
  }
});

// Get talent alerts
router.get('/scout/alerts', authenticate, async (_req: Request, res: Response) => {
  try {
    const alerts = cendiaScoutService.getAlerts();
    res.json({ alerts });
  } catch (error) {
    logger.error('Failed to get talent alerts:', error);
    res.status(500).json({ error: 'Failed to get alerts' });
  }
});

// =============================================================================
// CENDIARAINMAKER ROUTES
// =============================================================================

// Add deal
router.post('/rainmaker/deals', authenticate, async (req: Request, res: Response) => {
  try {
    const deal = cendiaRainmakerService.addDeal(req.body);
    res.json({ deal });
  } catch (error) {
    logger.error('Failed to add deal:', error);
    res.status(500).json({ error: 'Failed to add deal' });
  }
});

// Predict deal outcome
router.get('/rainmaker/deals/:id/predict', authenticate, async (req: Request, res: Response) => {
  try {
    const prediction = await cendiaRainmakerService.predictDealOutcome(req.params.id);
    res.json({ prediction });
  } catch (error) {
    logger.error('Failed to predict deal:', error);
    res.status(500).json({ error: 'Failed to predict' });
  }
});

// Get slipping deals
router.get('/rainmaker/deals/slipping', authenticate, async (_req: Request, res: Response) => {
  try {
    const deals = await cendiaRainmakerService.getSlippingDeals();
    res.json({ deals });
  } catch (error) {
    logger.error('Failed to get slipping deals:', error);
    res.status(500).json({ error: 'Failed to get deals' });
  }
});

// Generate executive letter
router.post('/rainmaker/deals/:id/letter', authenticate, async (req: Request, res: Response) => {
  try {
    const { purpose } = req.body;
    const letter = await cendiaRainmakerService.generateExecutiveLetter(req.params.id, purpose);
    res.json({ letter });
  } catch (error) {
    logger.error('Failed to generate letter:', error);
    res.status(500).json({ error: 'Failed to generate' });
  }
});

// Analyze call
router.post('/rainmaker/calls/analyze', authenticate, async (req: Request, res: Response) => {
  try {
    const { dealId, transcript, participants } = req.body;
    const analysis = await cendiaRainmakerService.analyzeCall(dealId, transcript, participants);
    res.json({ analysis });
  } catch (error) {
    logger.error('Failed to analyze call:', error);
    res.status(500).json({ error: 'Failed to analyze' });
  }
});

// Get whisper coaching
router.post('/rainmaker/deals/:id/whisper', authenticate, async (req: Request, res: Response) => {
  try {
    const { context } = req.body;
    const tips = await cendiaRainmakerService.getWhisperCoaching(req.params.id, context);
    res.json({ tips });
  } catch (error) {
    logger.error('Failed to get whisper coaching:', error);
    res.status(500).json({ error: 'Failed to get coaching' });
  }
});

// Get pipeline metrics
router.get('/rainmaker/metrics', authenticate, async (_req: Request, res: Response) => {
  try {
    const metrics = cendiaRainmakerService.getPipelineMetrics();
    res.json({ metrics });
  } catch (error) {
    logger.error('Failed to get pipeline metrics:', error);
    res.status(500).json({ error: 'Failed to get metrics' });
  }
});

// =============================================================================
// CENDIAREGENT ROUTES
// =============================================================================

// Get advisors
router.get('/regent/advisors', authenticate, async (_req: Request, res: Response) => {
  try {
    const advisors = cendiaRegentService.getAdvisors();
    res.json({ advisors });
  } catch (error) {
    logger.error('Failed to get advisors:', error);
    res.status(500).json({ error: 'Failed to get advisors' });
  }
});

// Consult council
router.post('/regent/consult', authenticate, async (req: Request, res: Response) => {
  try {
    const { question, context, advisorIds } = req.body;
    const session = await cendiaRegentService.consultCouncil(question, context, advisorIds);
    res.json({ session });
  } catch (error) {
    logger.error('Failed to consult council:', error);
    res.status(500).json({ error: 'Failed to consult' });
  }
});

// The Mirror - reveal uncomfortable truths
router.post('/regent/mirror', authenticate, async (req: Request, res: Response) => {
  try {
    const { topic, ceoBeliefs, data } = req.body;
    const analysis = await cendiaRegentService.revealMirrorTruth(topic, ceoBeliefs, data);
    res.json({ analysis });
  } catch (error) {
    logger.error('Failed to get mirror truth:', error);
    res.status(500).json({ error: 'Failed to analyze' });
  }
});

// Daily mirror
router.post('/regent/mirror/daily', authenticate, async (req: Request, res: Response) => {
  try {
    const { recentDecisions, metrics } = req.body;
    const truth = await cendiaRegentService.getDailyMirror(recentDecisions, metrics);
    res.json({ truth });
  } catch (error) {
    logger.error('Failed to get daily mirror:', error);
    res.status(500).json({ error: 'Failed to get truth' });
  }
});

// Add custom advisor
router.post('/regent/advisors', authenticate, async (req: Request, res: Response) => {
  try {
    const advisor = cendiaRegentService.addCustomAdvisor(req.body);
    res.json({ advisor });
  } catch (error) {
    logger.error('Failed to add advisor:', error);
    res.status(500).json({ error: 'Failed to add advisor' });
  }
});

// Get sessions
router.get('/regent/sessions', authenticate, async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const sessions = cendiaRegentService.getSessions(limit);
    res.json({ sessions });
  } catch (error) {
    logger.error('Failed to get sessions:', error);
    res.status(500).json({ error: 'Failed to get sessions' });
  }
});

export default router;
