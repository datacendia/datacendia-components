/**
 * API Routes — Sentry
 *
 * Express route handler defining REST endpoints.
 * @module routes/sentry
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA SENTRY ROUTES - AI Guardrails & Content Safety
// =============================================================================

import { Router, Request, Response } from 'express';
import { cendiaSentryService } from '../services/CendiaSentryService.js';

import { z } from 'zod';
const router = Router();

// ===========================================================================
// CORE GUARDRAIL ENDPOINTS
// ===========================================================================

/**
 * POST /sentry/check
 * Run standard guardrail check on content
 */
router.post('/check', async (req: Request, res: Response) => {
  try {
    const orgId = req.organizationId;
    const { userId, inputType, input, output, agentId, modelUsed, context } = z.object({}).passthrough().parse(req.body);
    const result = await cendiaSentryService.checkContent({
      organizationId: orgId,
      userId: userId || 'anonymous',
      inputType: inputType || 'agent_output',
      input,
      output,
      agentId,
      modelUsed,
      context,
    });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

/**
 * GET /sentry/check/:id
 * Get a specific check result
 */
router.get('/check/:id', async (req: Request, res: Response) => {
  try {
    const check = await cendiaSentryService.getCheck(req.params.id);
    if (!check) {
      return res.status(404).json({ success: false, error: { message: 'Check not found' } });
    }
    res.json({ success: true, data: check });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

/**
 * GET /sentry/statistics
 * Get guardrail statistics for the organization
 */
router.get('/statistics', async (req: Request, res: Response) => {
  try {
    const orgId = req.organizationId;
    const stats = await cendiaSentryService.getStatistics(orgId);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

/**
 * PUT /sentry/config
 * Set guardrail configuration for the organization
 */
router.put('/config', async (req: Request, res: Response) => {
  try {
    const orgId = req.organizationId;
    const { configs } = z.object({}).passthrough().parse(req.body);
    cendiaSentryService.setGuardrailConfig(orgId, configs);
    res.json({ success: true, message: 'Guardrail configuration updated' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// 10/10 ENHANCEMENTS — Advanced AI Guardrails Intelligence
// ===========================================================================

/**
 * POST /sentry/check-context
 * Context-aware checking — domain-adjusted guardrail sensitivity
 */
router.post('/check-context', async (req: Request, res: Response) => {
  try {
    const orgId = req.organizationId;
    const { userId, inputType, input, output, agentId, modelUsed, domain, context } = z.object({}).passthrough().parse(req.body);
    if (!domain) {
      return res.status(400).json({ success: false, error: { message: 'domain is required (general|medical|financial|legal|technical|hr)' } });
    }
    const result = await cendiaSentryService.checkContentWithContext({
      organizationId: orgId,
      userId: userId || 'anonymous',
      inputType: inputType || 'agent_output',
      input,
      output,
      agentId,
      modelUsed,
      domain,
      context,
    });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

/**
 * GET /sentry/explain/:checkId
 * Explainable decisions — human-readable breakdown of guardrail verdicts
 */
router.get('/explain/:checkId', async (req: Request, res: Response) => {
  try {
    const result = await cendiaSentryService.explainDecision(req.params.checkId);
    if (!result) {
      return res.status(404).json({ success: false, error: { message: 'Check not found' } });
    }
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

/**
 * POST /sentry/correct
 * Submit a correction when a guardrail decision was wrong
 */
router.post('/correct', async (req: Request, res: Response) => {
  try {
    const orgId = req.organizationId;
    const { checkId, guardrailType, correctedDecision, reason, correctedBy } = z.object({}).passthrough().parse(req.body);
    if (!checkId || !guardrailType || !correctedDecision) {
      return res.status(400).json({ success: false, error: { message: 'checkId, guardrailType, and correctedDecision are required' } });
    }
    const result = await cendiaSentryService.submitCorrection({
      organizationId: orgId,
      checkId,
      guardrailType,
      correctedDecision,
      reason: reason || '',
      correctedBy: correctedBy || 'anonymous',
    });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

/**
 * GET /sentry/corrections
 * Get correction analytics — false positive/negative rates and threshold recommendations
 */
router.get('/corrections', async (req: Request, res: Response) => {
  try {
    const orgId = req.organizationId;
    const result = await cendiaSentryService.getCorrectionAnalytics(orgId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

/**
 * POST /sentry/check-tiered
 * Tiered checking — quick scan first, deep scan only if needed
 */
router.post('/check-tiered', async (req: Request, res: Response) => {
  try {
    const orgId = req.organizationId;
    const { userId, inputType, input, output, agentId, modelUsed, context } = z.object({}).passthrough().parse(req.body);
    const result = await cendiaSentryService.checkContentTiered({
      organizationId: orgId,
      userId: userId || 'anonymous',
      inputType: inputType || 'agent_output',
      input,
      output,
      agentId,
      modelUsed,
      context,
    });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

export default router;
