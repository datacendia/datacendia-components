// =============================================================================
// DECISION INTELLIGENCE API ROUTES
// Chronos, Ghost Board, Pre-Mortem, Regulatory
// With AI-Powered Analysis via Ollama
// =============================================================================

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { chronosAIService } from '../services/ChronosAIService.js';

const router = Router();
const prisma = new PrismaClient();

// =============================================================================
// CHRONOS - Time Machine Snapshots
// =============================================================================

router.get('/chronos/snapshots', async (req: Request, res: Response) => {
  try {
    const { organization_id, snapshot_type } = req.query;
    const where: any = {};
    if (organization_id) where.organization_id = organization_id;
    if (snapshot_type) where.snapshot_type = snapshot_type;

    const snapshots = await prisma.chronos_snapshots.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take: 100
    });
    res.json({ success: true, data: snapshots });
  } catch (error) {
    console.error('[Chronos] Snapshots error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch snapshots' });
  }
});

router.post('/chronos/snapshots', async (req: Request, res: Response) => {
  try {
    const snapshot = await prisma.chronos_snapshots.create({
      data: {
        organization_id: req.body.organization_id,
        snapshot_type: req.body.snapshot_type,
        name: req.body.name,
        data: req.body.data || {},
        metrics: req.body.metrics || {},
        created_by: req.body.created_by
      }
    });
    res.json({ success: true, data: snapshot });
  } catch (error) {
    console.error('[Chronos] Snapshot create error:', error);
    res.status(500).json({ success: false, error: 'Failed to create snapshot' });
  }
});

// =============================================================================
// CHRONOS AI - AI-Powered Analysis via Ollama
// =============================================================================

// AI Pivotal Moment Detection
router.post('/chronos/ai/pivotal-moments', async (req: Request, res: Response) => {
  try {
    const { organization_id, events, limit } = req.body;
    
    if (!events || !Array.isArray(events)) {
      return res.status(400).json({ success: false, error: 'Events array required' });
    }

    const pivotalMoments = await chronosAIService.detectPivotalMoments(
      organization_id || 'default',
      events.map((e: any) => ({
        ...e,
        timestamp: new Date(e.timestamp)
      })),
      limit || 5
    );

    res.json({ success: true, data: pivotalMoments });
  } catch (error) {
    console.error('[ChronosAI] Pivotal moments error:', error);
    res.status(500).json({ success: false, error: 'AI analysis failed' });
  }
});

// AI Causal Chain Analysis
router.post('/chronos/ai/causal-chain', async (req: Request, res: Response) => {
  try {
    const { organization_id, root_event, all_events } = req.body;
    
    if (!root_event) {
      return res.status(400).json({ success: false, error: 'Root event required' });
    }

    const causalLinks = await chronosAIService.analyzeCausalChain(
      organization_id || 'default',
      { ...root_event, timestamp: new Date(root_event.timestamp) },
      (all_events || []).map((e: any) => ({
        ...e,
        timestamp: new Date(e.timestamp)
      }))
    );

    res.json({ success: true, data: causalLinks });
  } catch (error) {
    console.error('[ChronosAI] Causal chain error:', error);
    res.status(500).json({ success: false, error: 'AI analysis failed' });
  }
});

// AI Future Scenario Generation
router.post('/chronos/ai/future-scenarios', async (req: Request, res: Response) => {
  try {
    const { organization_id, current_metrics, recent_events, time_horizon } = req.body;

    const scenarios = await chronosAIService.generateFutureScenarios(
      organization_id || 'default',
      current_metrics || {},
      (recent_events || []).map((e: any) => ({
        ...e,
        timestamp: new Date(e.timestamp)
      })),
      time_horizon || '12 months'
    );

    res.json({ success: true, data: scenarios });
  } catch (error) {
    console.error('[ChronosAI] Scenario generation error:', error);
    res.status(500).json({ success: false, error: 'AI analysis failed' });
  }
});

// AI Timeline Insight
router.post('/chronos/ai/timeline-insight', async (req: Request, res: Response) => {
  try {
    const { organization_id, start_date, end_date, events, metrics } = req.body;
    
    if (!start_date || !end_date) {
      return res.status(400).json({ success: false, error: 'Start and end dates required' });
    }

    const insight = await chronosAIService.getTimelineInsight(
      organization_id || 'default',
      new Date(start_date),
      new Date(end_date),
      (events || []).map((e: any) => ({
        ...e,
        timestamp: new Date(e.timestamp)
      })),
      metrics
    );

    res.json({ success: true, data: insight });
  } catch (error) {
    console.error('[ChronosAI] Timeline insight error:', error);
    res.status(500).json({ success: false, error: 'AI analysis failed' });
  }
});

// AI "What If" Analysis
router.post('/chronos/ai/what-if', async (req: Request, res: Response) => {
  try {
    const { organization_id, event, alternative_action } = req.body;
    
    if (!event || !alternative_action) {
      return res.status(400).json({ success: false, error: 'Event and alternative action required' });
    }

    const analysis = await chronosAIService.analyzeWhatIf(
      organization_id || 'default',
      { ...event, timestamp: new Date(event.timestamp) },
      alternative_action
    );

    res.json({ success: true, data: analysis });
  } catch (error) {
    console.error('[ChronosAI] What-if analysis error:', error);
    res.status(500).json({ success: false, error: 'AI analysis failed' });
  }
});

// =============================================================================
// GHOST BOARD - Board Rehearsal Sessions
// =============================================================================

router.get('/ghost-board/sessions', async (req: Request, res: Response) => {
  try {
    const { organization_id, status } = req.query;
    const where: any = {};
    if (organization_id) where.organization_id = organization_id;
    if (status) where.status = status;

    const sessions = await prisma.ghost_board_sessions.findMany({
      where,
      orderBy: { created_at: 'desc' }
    });
    res.json({ success: true, data: sessions });
  } catch (error) {
    console.error('[GhostBoard] Sessions error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch sessions' });
  }
});

router.post('/ghost-board/sessions', async (req: Request, res: Response) => {
  try {
    const session = await prisma.ghost_board_sessions.create({
      data: {
        organization_id: req.body.organization_id,
        title: req.body.title,
        scenario: req.body.scenario,
        board_composition: req.body.board_composition || [],
        created_by: req.body.created_by
      }
    });
    res.json({ success: true, data: session });
  } catch (error) {
    console.error('[GhostBoard] Session create error:', error);
    res.status(500).json({ success: false, error: 'Failed to create session' });
  }
});

// =============================================================================
// PRE-MORTEM - Failure Analysis
// =============================================================================

router.get('/pre-mortem/analyses', async (req: Request, res: Response) => {
  try {
    const { organization_id, decision_id, status } = req.query;
    const where: any = {};
    if (organization_id) where.organization_id = organization_id;
    if (decision_id) where.decision_id = decision_id;
    if (status) where.status = status;

    const analyses = await prisma.pre_mortem_analyses.findMany({
      where,
      orderBy: { created_at: 'desc' }
    });
    res.json({ success: true, data: analyses });
  } catch (error) {
    console.error('[PreMortem] Analyses error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch analyses' });
  }
});

router.post('/pre-mortem/analyses', async (req: Request, res: Response) => {
  try {
    const analysis = await prisma.pre_mortem_analyses.create({
      data: {
        organization_id: req.body.organization_id,
        decision_id: req.body.decision_id,
        title: req.body.title,
        failure_modes: req.body.failure_modes || [],
        risk_factors: req.body.risk_factors || [],
        mitigations: req.body.mitigations || [],
        overall_risk: req.body.overall_risk,
        created_by: req.body.created_by
      }
    });
    res.json({ success: true, data: analysis });
  } catch (error) {
    console.error('[PreMortem] Analysis create error:', error);
    res.status(500).json({ success: false, error: 'Failed to create analysis' });
  }
});

// =============================================================================
// REGULATORY ABSORB
// =============================================================================

router.get('/regulatory/items', async (req: Request, res: Response) => {
  try {
    const { organization_id, jurisdiction, status } = req.query;
    const where: any = {};
    if (organization_id) where.organization_id = organization_id;
    if (jurisdiction) where.jurisdiction = jurisdiction;
    if (status) where.compliance_status = status;

    const items = await prisma.regulatory_items.findMany({
      where,
      orderBy: { created_at: 'desc' }
    });
    res.json({ success: true, data: items });
  } catch (error) {
    console.error('[Regulatory] Items error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch items' });
  }
});

router.post('/regulatory/items', async (req: Request, res: Response) => {
  try {
    const item = await prisma.regulatory_items.create({
      data: {
        organization_id: req.body.organization_id,
        regulation_id: req.body.regulation_id,
        title: req.body.title,
        description: req.body.description,
        jurisdiction: req.body.jurisdiction,
        category: req.body.category,
        impact_level: req.body.impact_level || 'medium',
        required_actions: req.body.required_actions || []
      }
    });
    res.json({ success: true, data: item });
  } catch (error) {
    console.error('[Regulatory] Item create error:', error);
    res.status(500).json({ success: false, error: 'Failed to create item' });
  }
});

export default router;
