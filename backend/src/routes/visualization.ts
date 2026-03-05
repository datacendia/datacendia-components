/**
 * API Routes — Visualization
 *
 * Express route handler defining REST endpoints.
 * @module routes/visualization
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA VISUALIZATION ROUTES
 * 
 * API endpoints for:
 * - Real-Time Deliberation Visualization
 * - CendiaReplay™
 */

import { Router, Request, Response } from 'express';
import { deliberationVisualizationService } from '../services/visualization/DeliberationVisualizationService.js';
import { decisionReplayTheaterService } from '../services/visualization/DecisionReplayTheaterService.js';

import { z } from 'zod';

const debateStartSchema = z.object({
  deliberationId: z.string().min(1),
  topic: z.string().min(1),
  agents: z.array(z.string()).optional(),
  maxRounds: z.number().int().positive().optional(),
});
const agentStatusSchema = z.object({ agentId: z.string().min(1), status: z.string().min(1), statement: z.string().optional() });
const agentConfidenceSchema = z.object({ agentId: z.string().min(1), confidence: z.number().min(0).max(1) });
const agentCitationSchema = z.object({ agentId: z.string().min(1), citation: z.record(z.unknown()) });
const agentObjectionSchema = z.object({ agentId: z.string().min(1), reason: z.string().min(1), severity: z.string().optional() });
const decisionSchema = z.object({ decision: z.record(z.unknown()) });
const deliberationIdSchema = z.object({ deliberationId: z.string().min(1) });
const speedSchema = z.object({ speed: z.number().positive() });
const frameSchema = z.object({ frameIndex: z.number().int().min(0), timeMs: z.number().min(0), session: z.record(z.unknown()).optional() });
const sessionOptionsSchema = z.object({ session: z.record(z.unknown()).optional(), options: z.record(z.unknown()).optional() });
const router = Router();

// =============================================================================
// REAL-TIME DELIBERATION VISUALIZATION
// =============================================================================

/**
 * POST /api/v1/visualization/deliberation/init
 * Initialize visualization for a new deliberation
 */
router.post('/deliberation/init', (req: Request, res: Response) => {
  const { deliberationId, topic, agents, maxRounds } = debateStartSchema.parse(req.body);
  
  if (!deliberationId || !topic || !agents) {
    return res.status(400).json({ error: 'deliberationId, topic, and agents are required' });
  }
  
  const state = deliberationVisualizationService.initializeVisualization(
    deliberationId,
    topic,
    agents,
    maxRounds
  );
  
  res.json({ success: true, state });
});

/**
 * GET /api/v1/visualization/deliberation/:id
 * Get current visualization state
 */
router.get('/deliberation/:id', (req: Request, res: Response) => {
  const state = deliberationVisualizationService.getVisualizationState(req.params.id);
  
  if (!state) {
    return res.status(404).json({ error: 'Visualization not found' });
  }
  
  res.json(state);
});

/**
 * POST /api/v1/visualization/deliberation/:id/agent-status
 * Update agent status
 */
router.post('/deliberation/:id/agent-status', (req: Request, res: Response) => {
  const { agentId, status, statement } = agentStatusSchema.parse(req.body);
  
  deliberationVisualizationService.updateAgentStatus(
    req.params.id,
    agentId,
    status,
    statement
  );
  
  res.json({ success: true });
});

/**
 * POST /api/v1/visualization/deliberation/:id/confidence
 * Update agent confidence
 */
router.post('/deliberation/:id/confidence', (req: Request, res: Response) => {
  const { agentId, confidence } = agentConfidenceSchema.parse(req.body);
  
  deliberationVisualizationService.updateConfidence(req.params.id, agentId, confidence);
  
  res.json({ success: true });
});

/**
 * POST /api/v1/visualization/deliberation/:id/citation
 * Add a citation
 */
router.post('/deliberation/:id/citation', (req: Request, res: Response) => {
  const { agentId, citation } = agentCitationSchema.parse(req.body);
  
  deliberationVisualizationService.addCitation(req.params.id, agentId, citation);
  
  res.json({ success: true });
});

/**
 * POST /api/v1/visualization/deliberation/:id/dissent
 * Register a dissent
 */
router.post('/deliberation/:id/dissent', (req: Request, res: Response) => {
  const { agentId, reason, severity } = agentObjectionSchema.parse(req.body);
  
  deliberationVisualizationService.registerDissent(req.params.id, agentId, reason, severity);
  
  res.json({ success: true });
});

/**
 * POST /api/v1/visualization/deliberation/:id/advance-round
 * Advance to next round
 */
router.post('/deliberation/:id/advance-round', (req: Request, res: Response) => {
  deliberationVisualizationService.advanceRound(req.params.id);
  
  res.json({ success: true });
});

/**
 * POST /api/v1/visualization/deliberation/:id/conclude
 * Conclude deliberation
 */
router.post('/deliberation/:id/conclude', (req: Request, res: Response) => {
  const { decision } = decisionSchema.parse(req.body);
  
  if (decision) {
    deliberationVisualizationService.concludeWithConsensus(req.params.id, decision);
  } else {
    deliberationVisualizationService.concludeDeliberation(req.params.id);
  }
  
  res.json({ success: true });
});

/**
 * GET /api/v1/visualization/deliberation/:id/timeline
 * Get deliberation timeline
 */
router.get('/deliberation/:id/timeline', (req: Request, res: Response) => {
  const timeline = deliberationVisualizationService.getTimeline(req.params.id);
  
  res.json({ timeline });
});

/**
 * GET /api/v1/visualization/active
 * Get all active visualizations
 */
router.get('/active', (_req: Request, res: Response) => {
  const active = deliberationVisualizationService.getActiveVisualizations();
  
  res.json({ count: active.length, visualizations: active });
});

// =============================================================================
// CendiaReplay™
// =============================================================================

/**
 * POST /api/v1/visualization/replay/create
 * Create a replay session from a deliberation
 */
router.post('/replay/create', async (req: Request, res: Response) => {
  try {
    const { deliberationId } = deliberationIdSchema.parse(req.body);
    
    if (!deliberationId) {
      return res.status(400).json({ error: 'deliberationId is required' });
    }
    
    const session = await decisionReplayTheaterService.createReplaySession(deliberationId);
    
    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

/**
 * POST /api/v1/visualization/replay/:sessionId/play
 * Start playback
 */
router.post('/replay/:sessionId/play', (req: Request, res: Response) => {
  const { speed } = speedSchema.parse(req.body);
  
  const state = decisionReplayTheaterService.startPlayback(req.params.sessionId, speed);
  
  res.json({ success: true, state });
});

/**
 * POST /api/v1/visualization/replay/:sessionId/pause
 * Pause playback
 */
router.post('/replay/:sessionId/pause', (req: Request, res: Response) => {
  const state = decisionReplayTheaterService.pausePlayback(req.params.sessionId);
  
  res.json({ success: true, state });
});

/**
 * POST /api/v1/visualization/replay/:sessionId/seek
 * Seek to frame or time
 */
router.post('/replay/:sessionId/seek', (req: Request, res: Response) => {
  const { frameIndex, timeMs, session } = frameSchema.parse(req.body);
  
  let state;
  if (frameIndex !== undefined) {
    state = decisionReplayTheaterService.seekToFrame(req.params.sessionId, frameIndex, session);
  } else if (timeMs !== undefined) {
    state = decisionReplayTheaterService.seekToTime(req.params.sessionId, timeMs, session);
  }
  
  res.json({ success: true, state });
});

/**
 * POST /api/v1/visualization/replay/:sessionId/speed
 * Set playback speed
 */
router.post('/replay/:sessionId/speed', (req: Request, res: Response) => {
  const { speed } = speedSchema.parse(req.body);
  
  const state = decisionReplayTheaterService.setPlaybackSpeed(req.params.sessionId, speed);
  
  res.json({ success: true, state });
});

/**
 * GET /api/v1/visualization/replay/:sessionId/state
 * Get playback state
 */
router.get('/replay/:sessionId/state', (req: Request, res: Response) => {
  const state = decisionReplayTheaterService.getPlaybackState(req.params.sessionId);
  
  if (!state) {
    return res.status(404).json({ error: 'Replay session not found' });
  }
  
  res.json(state);
});

/**
 * POST /api/v1/visualization/replay/:sessionId/export
 * Export replay session
 */
router.post('/replay/:sessionId/export', (req: Request, res: Response) => {
  const { session, options } = sessionOptionsSchema.parse(req.body);
  
  if (!session) {
    return res.status(400).json({ error: 'session data is required' });
  }
  
  const exported = decisionReplayTheaterService.exportSession(session, options || {
    format: 'json',
    includeTimestamps: true,
    includeConfidenceLevels: true,
    includeCitations: true,
    includeMetadata: true,
  });
  
  res.json({ success: true, exported });
});

/**
 * DELETE /api/v1/visualization/replay/:sessionId
 * End replay session
 */
router.delete('/replay/:sessionId', (req: Request, res: Response) => {
  decisionReplayTheaterService.endSession(req.params.sessionId);
  
  res.json({ success: true });
});

export default router;
