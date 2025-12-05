// =============================================================================
// DATACENDIA PLATFORM - HOLY SHIT FEATURES API ROUTES
// Enterprise-grade API for premium decision intelligence features
// =============================================================================

import { Router, Request, Response } from 'express';
import { 
  preMortemService,
  ghostBoardService,
  decisionDebtService,
  liveDemoModeService,
  regulatoryAbsorbService,
  HOLY_SHIT_FEATURES,
} from '../features/holy-shit/index.js';
import { PREMORTEM_AGENTS } from '../features/holy-shit/PreMortem.js';
import { 
  featureGating, 
  SUBSCRIPTION_TIERS,
  FEATURE_DEFINITIONS,
  SubscriptionTier,
} from '../core/subscriptions/SubscriptionTiers.js';

const router = Router();

// =============================================================================
// FEATURE DISCOVERY
// =============================================================================

/**
 * GET /api/v1/premium/features
 * Get all Holy Shit features with availability based on subscription tier
 */
router.get('/features', (req: Request, res: Response) => {
  const tier = (req.query.tier as SubscriptionTier) || 'free';
  const holyShitAccess = featureGating.getHolyShitFeatures(tier);

  const features = Object.entries(HOLY_SHIT_FEATURES).map(([key, feature]) => ({
    ...feature,
    available: holyShitAccess[key as keyof typeof holyShitAccess] || false,
    upgradeRequired: !holyShitAccess[key as keyof typeof holyShitAccess],
    minimumTier: feature.minimumTier,
  }));

  res.json({
    tier,
    features,
    totalAvailable: features.filter(f => f.available).length,
    totalFeatures: features.length,
  });
});

/**
 * GET /api/v1/premium/tiers
 * Get all subscription tiers and their features
 */
router.get('/tiers', (_req: Request, res: Response) => {
  const tiers = Object.entries(SUBSCRIPTION_TIERS).map(([key, config]) => ({
    id: key,
    name: config.displayName,
    price: config.price,
    holyShitFeatures: {
      preMortem: config.features.preMortem,
      ghostBoard: config.features.ghostBoard,
      decisionDebtDashboard: config.features.decisionDebtDashboard,
      liveDemoMode: config.features.liveDemoMode,
      regulatoryInstantAbsorb: config.features.regulatoryInstantAbsorb,
    },
    limits: config.limits,
    support: config.support,
  }));

  res.json({ tiers });
});

// =============================================================================
// PRE-MORTEM ENDPOINTS
// =============================================================================

/**
 * GET /api/v1/premium/pre-mortem/agents
 * Get all available Pre-Mortem agents for selection
 */
router.get('/pre-mortem/agents', (_req: Request, res: Response) => {
  const agents = Object.values(PREMORTEM_AGENTS).map(agent => ({
    id: agent.id,
    name: agent.name,
    role: agent.role,
    icon: agent.icon,
    color: agent.color,
    description: agent.description,
  }));

  res.json({
    success: true,
    agents,
    defaultAgents: ['cfo', 'ciso', 'pessimist'],
    count: agents.length,
  });
});

/**
 * POST /api/v1/premium/pre-mortem/analyze
 * Run a Pre-Mortem analysis on a decision
 */
router.post('/pre-mortem/analyze', async (req: Request, res: Response) => {
  try {
    const { 
      organizationId, 
      userId, 
      decision, 
      context, 
      timeframe, 
      budget,
      stakeholders,
      selectedAgents,
      tier = 'enterprise',
    } = req.body;

    if (!decision) {
      return res.status(400).json({ 
        error: 'Decision is required',
        code: 'MISSING_DECISION',
      });
    }

    const result = await preMortemService.analyze({
      organizationId: organizationId || 'demo',
      userId: userId || 'demo-user',
      decision,
      context,
      timeframe,
      budget,
      stakeholders,
      selectedAgents,
      tier: tier as SubscriptionTier,
    });

    res.json({
      success: true,
      result,
    });
  } catch (error: any) {
    res.status(error.message.includes('requires') ? 403 : 500).json({
      success: false,
      error: error.message,
      code: error.message.includes('requires') ? 'UPGRADE_REQUIRED' : 'ANALYSIS_FAILED',
    });
  }
});

/**
 * GET /api/v1/premium/pre-mortem/history
 * Get Pre-Mortem analysis history for an organization
 */
router.get('/pre-mortem/history', (req: Request, res: Response) => {
  const organizationId = (req.query.organizationId as string) || 'demo';
  const history = preMortemService.getAnalysisHistory(organizationId);
  
  res.json({
    organizationId,
    count: history.length,
    analyses: history,
  });
});

// =============================================================================
// GHOST BOARD ENDPOINTS
// =============================================================================

/**
 * POST /api/v1/premium/ghost-board/session
 * Start a Ghost Board session
 */
router.post('/ghost-board/session', async (req: Request, res: Response) => {
  try {
    const {
      organizationId,
      userId,
      proposalTitle,
      proposalContent,
      boardType,
      difficulty,
      focusAreas,
      existingAnswers,
      tier = 'enterprise',
    } = req.body;

    if (!proposalTitle || !proposalContent) {
      return res.status(400).json({
        error: 'Proposal title and content are required',
        code: 'MISSING_PROPOSAL',
      });
    }

    const result = await ghostBoardService.runSession({
      organizationId: organizationId || 'demo',
      userId: userId || 'demo-user',
      proposalTitle,
      proposalContent,
      boardType,
      difficulty,
      focusAreas,
      existingAnswers,
      tier: tier as SubscriptionTier,
    });

    res.json({
      success: true,
      session: result,
    });
  } catch (error: any) {
    res.status(error.message.includes('requires') ? 403 : 500).json({
      success: false,
      error: error.message,
      code: error.message.includes('requires') ? 'UPGRADE_REQUIRED' : 'SESSION_FAILED',
    });
  }
});

/**
 * GET /api/v1/premium/ghost-board/members
 * Get available board member personas
 */
router.get('/ghost-board/members', (_req: Request, res: Response) => {
  const members = ghostBoardService.getBoardMembers();
  res.json({ members });
});

/**
 * GET /api/v1/premium/ghost-board/history
 * Get Ghost Board session history
 */
router.get('/ghost-board/history', (req: Request, res: Response) => {
  const organizationId = (req.query.organizationId as string) || 'demo';
  const history = ghostBoardService.getSessionHistory(organizationId);
  
  res.json({
    organizationId,
    count: history.length,
    sessions: history,
  });
});

// =============================================================================
// DECISION DEBT DASHBOARD ENDPOINTS
// =============================================================================

/**
 * GET /api/v1/premium/decision-debt/dashboard
 * Get the Decision Debt Dashboard for an organization
 */
router.get('/decision-debt/dashboard', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo';
    const tier = (req.query.tier as SubscriptionTier) || 'enterprise';

    const dashboard = await decisionDebtService.generateDashboard({
      organizationId,
      userId: 'demo-user',
      tier,
      filters: req.query.filters as any,
    });

    res.json({
      success: true,
      dashboard,
    });
  } catch (error: any) {
    res.status(error.message.includes('requires') ? 403 : 500).json({
      success: false,
      error: error.message,
      code: error.message.includes('requires') ? 'UPGRADE_REQUIRED' : 'DASHBOARD_FAILED',
    });
  }
});

/**
 * POST /api/v1/premium/decision-debt/decision
 * Create a new pending decision
 */
router.post('/decision-debt/decision', async (req: Request, res: Response) => {
  try {
    const { organizationId = 'demo', ...data } = req.body;
    const decision = await decisionDebtService.createDecision(organizationId, data);
    
    res.json({
      success: true,
      decision,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * DELETE /api/v1/premium/decision-debt/decision/:id
 * Resolve/remove a pending decision
 */
router.delete('/decision-debt/decision/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organizationId = 'demo', resolution } = req.body;
    
    await decisionDebtService.resolveDecision(organizationId, id, resolution);
    
    res.json({
      success: true,
      message: 'Decision resolved',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// =============================================================================
// LIVE DEMO MODE ENDPOINTS
// =============================================================================

/**
 * GET /api/v1/premium/live-demo/connectors
 * Get available connectors for live demo
 */
router.get('/live-demo/connectors', (_req: Request, res: Response) => {
  const connectors = liveDemoModeService.getAvailableConnectors();
  res.json({ connectors });
});

/**
 * POST /api/v1/premium/live-demo/session
 * Create a new live demo session
 */
router.post('/live-demo/session', async (req: Request, res: Response) => {
  try {
    const { userId, connector, tier = 'enterprise' } = req.body;

    if (!connector) {
      return res.status(400).json({
        error: 'Connector is required',
        code: 'MISSING_CONNECTOR',
      });
    }

    const session = await liveDemoModeService.createSession(
      userId || 'demo-user',
      connector,
      tier as SubscriptionTier
    );

    // Generate OAuth URL
    const authUrl = liveDemoModeService.generateAuthUrl(connector, session.id);

    res.json({
      success: true,
      session,
      authUrl,
    });
  } catch (error: any) {
    res.status(error.message.includes('requires') ? 403 : 500).json({
      success: false,
      error: error.message,
      code: error.message.includes('requires') ? 'UPGRADE_REQUIRED' : 'SESSION_FAILED',
    });
  }
});

/**
 * POST /api/v1/premium/live-demo/connect
 * Complete OAuth connection for a session
 */
router.post('/live-demo/connect', async (req: Request, res: Response) => {
  try {
    const { sessionId, authCode } = req.body;

    if (!sessionId || !authCode) {
      return res.status(400).json({
        error: 'Session ID and auth code are required',
      });
    }

    const session = await liveDemoModeService.connectSession(sessionId, authCode);

    res.json({
      success: true,
      session,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/v1/premium/live-demo/session/:id
 * Get session status
 */
router.get('/live-demo/session/:id', async (req: Request, res: Response) => {
  const session = await liveDemoModeService.getSession(req.params.id);
  
  if (!session) {
    return res.status(404).json({
      error: 'Session not found',
    });
  }

  res.json({ session });
});

/**
 * POST /api/v1/premium/live-demo/deliberate
 * Run a live deliberation with connected data
 */
router.post('/live-demo/deliberate', async (req: Request, res: Response) => {
  try {
    const { organizationId, userId, connector, question, tier = 'enterprise' } = req.body;

    if (!connector || !question) {
      return res.status(400).json({
        error: 'Connector and question are required',
      });
    }

    const result = await liveDemoModeService.runLiveDeliberation({
      organizationId: organizationId || 'demo',
      userId: userId || 'demo-user',
      tier: tier as SubscriptionTier,
      connector,
      question,
    });

    res.json({
      success: true,
      result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// =============================================================================
// REGULATORY INSTANT-ABSORB ENDPOINTS
// =============================================================================

/**
 * POST /api/v1/premium/regulatory/absorb
 * Upload and absorb a regulatory document
 */
router.post('/regulatory/absorb', async (req: Request, res: Response) => {
  try {
    const { organizationId, userId, document, customMapping, tier = 'enterprise' } = req.body;

    if (!document || !document.content) {
      return res.status(400).json({
        error: 'Document with content is required',
        code: 'MISSING_DOCUMENT',
      });
    }

    const result = await regulatoryAbsorbService.absorbDocument({
      organizationId: organizationId || 'demo',
      userId: userId || 'demo-user',
      tier: tier as SubscriptionTier,
      document,
      customMapping,
    });

    res.json({
      success: true,
      result,
    });
  } catch (error: any) {
    res.status(error.message.includes('requires') ? 403 : 500).json({
      success: false,
      error: error.message,
      code: error.message.includes('requires') ? 'UPGRADE_REQUIRED' : 'ABSORPTION_FAILED',
    });
  }
});

/**
 * GET /api/v1/premium/regulatory/history
 * Get absorption history for an organization
 */
router.get('/regulatory/history', (req: Request, res: Response) => {
  const organizationId = (req.query.organizationId as string) || 'demo';
  const history = regulatoryAbsorbService.getAbsorptionHistory(organizationId);
  
  res.json({
    organizationId,
    count: history.length,
    documents: history,
  });
});

/**
 * GET /api/v1/premium/regulatory/knowledge
 * Get the regulatory knowledge base
 */
router.get('/regulatory/knowledge', (req: Request, res: Response) => {
  const organizationId = (req.query.organizationId as string) || 'demo';
  const knowledge = regulatoryAbsorbService.getKnowledgeBase(organizationId);
  
  res.json({
    organizationId,
    requirementsCount: knowledge.length,
    requirements: knowledge,
  });
});

/**
 * GET /api/v1/premium/regulatory/query
 * Query the regulatory knowledge base
 */
router.get('/regulatory/query', (req: Request, res: Response) => {
  const organizationId = (req.query.organizationId as string) || 'demo';
  const query = (req.query.q as string) || '';
  
  const results = regulatoryAbsorbService.queryKnowledge(organizationId, query);
  
  res.json({
    organizationId,
    query,
    matchCount: results.length,
    results,
  });
});

export default router;
