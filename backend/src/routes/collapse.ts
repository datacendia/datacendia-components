/**
 * Policy Collapse Mode - API Routes
 * 
 * Adversarial Policy Stress-Testing System
 * "Under what conditions would this decision fail, harm people, or collapse legitimacy?"
 */

import { Router, Request, Response } from 'express';
import { collapseOrchestrator } from '../services/collapse/index.js';
import { PolicyContext } from '../services/collapse/agents/BaseCollapseAgent.js';

const router = Router();

/**
 * Health check
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'collapse-mode',
    description: 'Adversarial Policy Collapse Simulator',
    agents: collapseOrchestrator.getAgentDescriptions().length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Get agent descriptions
 */
router.get('/agents', (_req: Request, res: Response) => {
  try {
    const agents = collapseOrchestrator.getAgentDescriptions();
    res.json({
      success: true,
      agents,
      count: agents.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get agents',
    });
  }
});

/**
 * Get current configuration
 */
router.get('/config', (_req: Request, res: Response) => {
  try {
    const config = collapseOrchestrator.getConfig();
    res.json({
      success: true,
      config,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get config',
    });
  }
});

/**
 * Update configuration
 */
router.put('/config', (req: Request, res: Response) => {
  try {
    const updates = req.body;
    collapseOrchestrator.updateConfig(updates);
    res.json({
      success: true,
      config: collapseOrchestrator.getConfig(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update config',
    });
  }
});

/**
 * Run dual-track deliberation
 * POST /deliberation
 * Body: { decisionId, decisionText, context, consensusConfidence?, seed? }
 */
router.post('/deliberation', async (req: Request, res: Response) => {
  try {
    const {
      decisionId,
      decisionText,
      context,
      consensusConfidence = 0.85,
      seed,
    } = req.body;

    if (!decisionId || !decisionText || !context) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: decisionId, decisionText, context',
      });
    }

    // Build policy context
    const policyContext: PolicyContext = {
      decisionId,
      decisionText,
      policyDomain: context.policyDomain || 'General Policy',
      targetPopulation: context.targetPopulation || 100000,
      geographicScope: context.geographicScope || 'Municipal',
      budgetImpact: context.budgetImpact || 0,
      timelineMonths: context.timelineMonths || 24,
      existingConditions: context.existingConditions || {},
      stakeholders: context.stakeholders || [],
      historicalAnalogues: context.historicalAnalogues,
    };

    const deliberation = await collapseOrchestrator.runDualTrackDeliberation(
      decisionId,
      decisionText,
      policyContext,
      consensusConfidence,
      seed
    );

    res.json({
      success: true,
      deliberation,
    });
  } catch (error) {
    console.error('Deliberation failed:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Deliberation failed',
    });
  }
});

/**
 * Get deliberation by ID
 */
router.get('/deliberation/:id', (req: Request, res: Response) => {
  try {
    const id = req.params['id']!;
    const deliberation = collapseOrchestrator.getDeliberation(id);

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
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get deliberation',
    });
  }
});

/**
 * List all deliberations
 */
router.get('/deliberations', (_req: Request, res: Response) => {
  try {
    const deliberations = collapseOrchestrator.listDeliberations();
    res.json({
      success: true,
      deliberations,
      count: deliberations.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list deliberations',
    });
  }
});

/**
 * Get failure envelope by ID
 */
router.get('/envelope/:id', (req: Request, res: Response) => {
  try {
    const id = req.params['id']!;
    const envelope = collapseOrchestrator.getFailureEnvelope(id);

    if (!envelope) {
      return res.status(404).json({
        success: false,
        error: 'Failure envelope not found',
      });
    }

    res.json({
      success: true,
      envelope,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get envelope',
    });
  }
});

/**
 * Verify failure envelope integrity
 */
router.post('/envelope/:id/verify', (req: Request, res: Response) => {
  try {
    const id = req.params['id']!;
    const envelope = collapseOrchestrator.getFailureEnvelope(id);

    if (!envelope) {
      return res.status(404).json({
        success: false,
        error: 'Failure envelope not found',
      });
    }

    const verification = collapseOrchestrator.verifyEnvelopeIntegrity(envelope);

    res.json({
      success: true,
      envelopeId: id,
      verification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Verification failed',
    });
  }
});

/**
 * Replay deliberation
 */
router.post('/deliberation/:id/replay', async (req: Request, res: Response) => {
  try {
    const id = req.params['id']!;
    const result = await collapseOrchestrator.replayDeliberation(id);

    res.json({
      success: true,
      result,
      deterministic: result.match,
      message: result.match
        ? 'Replay matches original - deterministic verification passed'
        : 'Replay does not match - possible non-determinism detected',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Replay failed',
    });
  }
});

/**
 * Export failure envelope as JSON (for download)
 */
router.get('/envelope/:id/export', (req: Request, res: Response) => {
  try {
    const id = req.params['id']!;
    const envelope = collapseOrchestrator.getFailureEnvelope(id);

    if (!envelope) {
      return res.status(404).json({
        success: false,
        error: 'Failure envelope not found',
      });
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="failure-envelope-${id}.json"`
    );
    res.send(JSON.stringify(envelope, null, 2));
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Export failed',
    });
  }
});

/**
 * Quick analysis - run collapse analysis only (no consensus track)
 */
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const {
      decisionId,
      decisionText,
      context,
      seed,
    } = req.body;

    if (!decisionId || !decisionText) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: decisionId, decisionText',
      });
    }

    const policyContext: PolicyContext = {
      decisionId,
      decisionText,
      policyDomain: context?.policyDomain || 'General Policy',
      targetPopulation: context?.targetPopulation || 100000,
      geographicScope: context?.geographicScope || 'Municipal',
      budgetImpact: context?.budgetImpact || 0,
      timelineMonths: context?.timelineMonths || 24,
      existingConditions: context?.existingConditions || {},
      stakeholders: context?.stakeholders || [],
      historicalAnalogues: context?.historicalAnalogues,
    };

    const actualSeed = seed ?? Math.floor(Math.random() * 1000000);

    const collapseTrack = await collapseOrchestrator.runCollapseTrack(
      decisionId,
      decisionText,
      policyContext,
      actualSeed
    );

    res.json({
      success: true,
      analysis: {
        totalRisk: collapseTrack.totalRisk,
        criticalFindings: collapseTrack.criticalFindings,
        failureConditionsCount: collapseTrack.failureEnvelope.failureConditions.length,
        seed: actualSeed,
      },
      failureEnvelope: collapseTrack.failureEnvelope,
    });
  } catch (error) {
    console.error('Analysis failed:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Analysis failed',
    });
  }
});

/**
 * Get trust delta interpretation
 */
router.get('/trust-delta/interpret', (req: Request, res: Response) => {
  const { consensusConfidence, collapseRisk } = req.query;

  if (!consensusConfidence || !collapseRisk) {
    return res.status(400).json({
      success: false,
      error: 'Missing required query params: consensusConfidence, collapseRisk',
    });
  }

  const cc = parseFloat(consensusConfidence as string);
  const cr = parseFloat(collapseRisk as string);

  if (isNaN(cc) || isNaN(cr)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid numeric values',
    });
  }

  const delta = cc - cr;
  let recommendation: string;
  let riskLevel: string;

  if (delta > 0.3) {
    recommendation = 'SAFE_TO_DEPLOY';
    riskLevel = 'LOW';
  } else if (delta > 0.1) {
    recommendation = 'DEPLOY_WITH_GUARDRAILS';
    riskLevel = 'MODERATE';
  } else if (delta > 0) {
    recommendation = 'HIGH_RISK';
    riskLevel = 'HIGH';
  } else {
    recommendation = 'DO_NOT_DEPLOY';
    riskLevel = 'CRITICAL';
  }

  res.json({
    success: true,
    trustDelta: {
      consensusConfidence: cc,
      collapseRisk: cr,
      delta,
      recommendation,
      riskLevel,
    },
  });
});

export default router;
