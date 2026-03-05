/**
 * API Routes — Deliberations
 *
 * Express route handler defining REST endpoints.
 * @module routes/deliberations
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - DELIBERATIONS API ROUTES
// Save, retrieve, and generate reports for Council deliberations
// =============================================================================

import { Router, Request, Response } from 'express';
import { deliberationService } from '../services/DeliberationService.js';
import { statementOfFactsService } from '../services/StatementOfFactsService.js';
import { postDeliberationService } from '../services/PostDeliberationService.js';
import { getErrorMessage } from '../utils/errors.js';

import { z } from 'zod';

const saveDeliberationSchema = z.object({
  organizationId: z.string().default('demo'),
  userId: z.string().default('demo-user'),
  question: z.string().min(1, 'Question is required'),
  mode: z.string().optional(),
  councilMode: z.string().optional(),
  agentResponses: z.array(z.record(z.unknown())).optional(),
  crossExaminations: z.array(z.record(z.unknown())).optional(),
  synthesis: z.string().min(1, 'Synthesis is required'),
  confidence: z.number().min(0).max(1).optional(),
  status: z.string().default('completed'),
});

const claimVerificationSchema = z.object({
  userVerified: z.boolean(),
  userNotes: z.string().optional(),
});

const addEvidenceSchema = z.object({
  type: z.string().min(1),
  description: z.string().min(1),
  source: z.string().optional(),
  calculation: z.string().optional(),
  strength: z.number().min(0).max(1).optional(),
});

const postDelibSessionSchema = z.object({
  deliberationId: z.string().min(1, 'deliberationId is required'),
  userId: z.string().default('demo-user'),
  organizationId: z.string().default('demo'),
  userPlan: z.string().default('foundation'),
});

const selectActionsSchema = z.object({
  sessionId: z.string().min(1, 'sessionId is required'),
  actionIds: z.array(z.string()).min(1, 'actionIds required'),
  priorities: z.record(z.string()).optional(),
  notes: z.record(z.string()).optional(),
});

const toggleActionSchema = z.object({
  sessionId: z.string().min(1),
  actionId: z.string().min(1),
  selected: z.boolean(),
  priority: z.string().optional(),
});

const executeActionsSchema = z.object({
  sessionId: z.string().min(1, 'sessionId is required'),
  actionIds: z.array(z.string()).optional(),
  priorities: z.record(z.string()).optional(),
});

const router = Router();

// =============================================================================
// SAVE DELIBERATION
// =============================================================================

/**
 * POST /api/v1/council/deliberations
 * Save a completed deliberation
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      organizationId,
      userId,
      question,
      mode,
      councilMode,
      agentResponses,
      crossExaminations,
      synthesis,
      confidence,
      status,
    } = saveDeliberationSchema.parse(req.body);

    const deliberation = await deliberationService.saveDeliberation({
      organizationId,
      userId,
      question,
      mode: mode || 'deliberation',
      councilMode: councilMode || 'war-room',
      agentResponses: agentResponses || [],
      crossExaminations: crossExaminations || [],
      synthesis,
      confidence: confidence || 0,
      status,
    });

    res.json({
      success: true,
      deliberation,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

// =============================================================================
// GET DELIBERATIONS
// =============================================================================

/**
 * GET /api/v1/council/deliberations
 * Get deliberations for an organization
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    // Don't filter by org - return all deliberations for Chronos visibility
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const status = req.query.status as string;

    const deliberations = await deliberationService.getDeliberations(undefined, {
      limit,
      offset,
      status,
    });

    res.json({
      success: true,
      count: deliberations.length,
      deliberations,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

/**
 * GET /api/v1/council/deliberations/:id
 * Get a specific deliberation
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const deliberation = await deliberationService.getDeliberation(req.params.id);

    if (!deliberation) {
      return res.status(404).json({
        success: false,
        error: 'Deliberation not found',
      });
    }

    res.json({
      success: true,
      deliberation,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

// =============================================================================
// EXECUTIVE SUMMARY
// =============================================================================

/**
 * POST /api/v1/council/deliberations/:id/summary
 * Generate executive summary for a deliberation
 */
router.post('/:id/summary', async (req: Request, res: Response) => {
  try {
    const summary = await deliberationService.generateExecutiveSummary(req.params.id);

    res.json({
      success: true,
      summary,
    });
  } catch (error: unknown) {
    res.status(getErrorMessage(error).includes('not found') ? 404 : 500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

// =============================================================================
// MINUTES
// =============================================================================

/**
 * POST /api/v1/council/deliberations/:id/minutes
 * Generate minutes for a deliberation
 */
router.post('/:id/minutes', async (req: Request, res: Response) => {
  try {
    const minutes = await deliberationService.generateMinutes(req.params.id);

    res.json({
      success: true,
      minutes,
    });
  } catch (error: unknown) {
    res.status(getErrorMessage(error).includes('not found') ? 404 : 500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

// =============================================================================
// EXPORT REPORT
// =============================================================================

/**
 * GET /api/v1/council/deliberations/:id/report
 * Generate printable report for a deliberation
 */
router.get('/:id/report', async (req: Request, res: Response) => {
  try {
    const deliberation = await deliberationService.getDeliberation(req.params.id);
    
    if (!deliberation) {
      return res.status(404).json({
        success: false,
        error: 'Deliberation not found',
      });
    }

    const summary = await deliberationService.generateExecutiveSummary(req.params.id);
    const html = deliberationService.generatePDFReport(deliberation, summary);

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

// =============================================================================
// STATEMENT OF FACTS
// =============================================================================

/**
 * GET /api/v1/council/deliberations/:id/facts
 * Get statement of facts for a deliberation
 */
router.get('/:id/facts', async (req: Request, res: Response) => {
  try {
    const statement = await statementOfFactsService.getStatementOfFacts(req.params.id);

    if (!statement) {
      // Generate if doesn't exist
      const deliberation = await deliberationService.getDeliberation(req.params.id);
      if (!deliberation) {
        return res.status(404).json({ success: false, error: 'Deliberation not found' });
      }

      const newStatement = await statementOfFactsService.generateStatementOfFacts(
        req.params.id,
        deliberation.agentResponses.map((r: any) => ({
          agentId: r.agentId,
          agentName: r.agentName,
          agentRole: r.agentRole,
          response: r.response,
        }))
      );

      return res.json({ success: true, statement: newStatement });
    }

    res.json({ success: true, statement });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * GET /api/v1/council/deliberations/:id/facts/claims
 * Get all claims for a deliberation
 */
router.get('/:id/facts/claims', async (req: Request, res: Response) => {
  try {
    const claims = await statementOfFactsService.getClaims(req.params.id);
    res.json({ success: true, claims });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * PATCH /api/v1/council/deliberations/:id/facts/claims/:claimId
 * Update claim verification
 */
router.patch('/:id/facts/claims/:claimId', async (req: Request, res: Response) => {
  try {
    const { userVerified, userNotes } = claimVerificationSchema.parse(req.body);
    const claim = await statementOfFactsService.updateClaimVerification(
      req.params.id,
      req.params.claimId,
      userVerified,
      userNotes
    );

    if (!claim) {
      return res.status(404).json({ success: false, error: 'Claim not found' });
    }

    res.json({ success: true, claim });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * POST /api/v1/council/deliberations/:id/facts/claims/:claimId/evidence
 * Add evidence to a claim
 */
router.post('/:id/facts/claims/:claimId/evidence', async (req: Request, res: Response) => {
  try {
    const { type, description, source, calculation, strength } = addEvidenceSchema.parse(req.body);
    const claim = await statementOfFactsService.addEvidence(
      req.params.id,
      req.params.claimId,
      { type, description, source, calculation, strength }
    );

    if (!claim) {
      return res.status(404).json({ success: false, error: 'Claim not found' });
    }

    res.json({ success: true, claim });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

// =============================================================================
// POST-DELIBERATION WORKFLOW
// =============================================================================

/**
 * POST /api/v1/council/deliberations/post-deliberation/session
 * Create a post-deliberation session
 */
router.post('/post-deliberation/session', async (req: Request, res: Response) => {
  try {
    const { 
      deliberationId, 
      userId, 
      organizationId,
      userPlan 
    } = postDelibSessionSchema.parse(req.body);

    const session = await postDeliberationService.createSession(
      deliberationId,
      userId,
      organizationId,
      userPlan
    );

    res.json(session);
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * GET /api/v1/council/deliberations/post-deliberation/session/:sessionId
 * Get a post-deliberation session
 */
router.get('/post-deliberation/session/:sessionId', async (req: Request, res: Response) => {
  try {
    const session = await postDeliberationService.getSession(req.params.sessionId);

    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }

    res.json(session);
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * POST /api/v1/council/deliberations/post-deliberation/select
 * Select actions for a session
 */
router.post('/post-deliberation/select', async (req: Request, res: Response) => {
  try {
    const { sessionId, actionIds, priorities, notes } = selectActionsSchema.parse(req.body);

    const session = await postDeliberationService.selectActions(
      sessionId,
      actionIds,
      priorities,
      notes
    );

    res.json(session);
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * POST /api/v1/council/deliberations/post-deliberation/toggle
 * Toggle a single action
 */
router.post('/post-deliberation/toggle', async (req: Request, res: Response) => {
  try {
    const { sessionId, actionId, selected, priority } = toggleActionSchema.parse(req.body);

    const session = await postDeliberationService.toggleAction(
      sessionId,
      actionId,
      selected,
      priority
    );

    res.json(session);
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * POST /api/v1/council/deliberations/post-deliberation/execute
 * Execute selected actions
 */
router.post('/post-deliberation/execute', async (req: Request, res: Response) => {
  try {
    const { sessionId, actionIds, priorities } = executeActionsSchema.parse(req.body);

    // If actionIds provided, select them first
    if (actionIds && actionIds.length > 0) {
      await postDeliberationService.selectActions(sessionId, actionIds, priorities);
    }

    const session = await postDeliberationService.executeSelectedActions(sessionId);
    res.json(session);
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

/**
 * GET /api/v1/council/deliberations/post-deliberation/actions
 * Get available actions list
 */
router.get('/post-deliberation/actions', async (_req: Request, res: Response) => {
  try {
    // Return the available actions template (without session-specific status)
    const actions = [
      { id: 'accept-execute', name: 'Accept & Execute', category: 'immediate', icon: '?' },
      { id: 'pre-mortem', name: 'Pre-Mortem Analysis', category: 'analyze', icon: '??' },
      { id: 'ghost-board', name: 'Ghost Board', category: 'analyze', icon: '??' },
      { id: 'decision-dna', name: 'Decision DNA', category: 'analyze', icon: '??' },
      { id: 'chronos-rewind', name: 'Rewind & Replay', category: 'iterate', icon: '?' },
      { id: 'policy-mapping', name: 'Policy Mapping', category: 'govern', icon: '??' },
      { id: 'voice-briefing', name: 'Voice Briefing', category: 'communicate', icon: '???' },
      { id: 'pulse-monitor', name: 'Add to Pulse', category: 'monitor', icon: '??' },
      { id: 'autopilot-setup', name: 'Setup Autopilot', category: 'automate', icon: '??' },
    ];
    res.json({ success: true, actions });
  } catch (error: unknown) {
    res.status(500).json({ success: false, error: getErrorMessage(error) });
  }
});

export default router;
