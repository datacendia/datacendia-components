/**
 * CendiaVox™ API Routes
 * Stakeholder Voice Assembly
 */
// @ts-nocheck


import { Router, Request, Response } from 'express';
import { cendiaVoxService } from '../services/CendiaVoxService.js';
import { devAuth } from '../middleware/auth.js';

const router = Router();

// Apply devAuth to all routes to get organizationId from seeded user
router.use(devAuth);

// ===========================================================================
// STAKEHOLDERS
// ===========================================================================

router.post('/stakeholders/initialize', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const stakeholders = await cendiaVoxService.initializeStakeholders(orgId);
    res.json({ success: true, data: stakeholders });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

router.get('/stakeholders', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const stakeholders = await cendiaVoxService.getStakeholders(orgId);
    res.json({ success: true, data: stakeholders });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

router.patch('/stakeholders/:id', async (req: Request, res: Response) => {
  try {
    const stakeholder = await cendiaVoxService.updateStakeholder(req.params.id, req.body);
    res.json({ success: true, data: stakeholder });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// SIGNALS
// ===========================================================================

router.post('/stakeholders/:id/signals', async (req: Request, res: Response) => {
  try {
    const signal = await cendiaVoxService.ingestSignal(req.params.id, req.body);
    res.json({ success: true, data: signal });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

router.get('/stakeholders/:id/signals', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const signals = await cendiaVoxService.getSignals(req.params.id, limit);
    res.json({ success: true, data: signals });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// IMPACTS
// ===========================================================================

router.post('/impacts/assess', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const { decisionId, decisionContext } = req.body;
    const impacts = await cendiaVoxService.assessImpact(orgId, decisionId, decisionContext);
    res.json({ success: true, data: impacts });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

router.get('/decisions/:id/impacts', async (req: Request, res: Response) => {
  try {
    const impacts = await cendiaVoxService.getDecisionImpacts(req.params.id);
    res.json({ success: true, data: impacts });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// VOTING
// ===========================================================================

router.post('/votes', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const { decisionId, decisionContext } = req.body;
    const votes = await cendiaVoxService.conductVote(orgId, decisionId, decisionContext);
    res.json({ success: true, data: votes });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

router.get('/decisions/:id/votes', async (req: Request, res: Response) => {
  try {
    const votes = await cendiaVoxService.getDecisionVotes(req.params.id);
    res.json({ success: true, data: votes });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// ASSEMBLIES
// ===========================================================================

router.post('/assemblies', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const { decisionId, title, assemblyType } = req.body;
    const assembly = await cendiaVoxService.conductAssembly(orgId, decisionId, title, assemblyType);
    res.json({ success: true, data: assembly });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

router.get('/assemblies', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const assemblies = await cendiaVoxService.getAssemblies(orgId, limit);
    res.json({ success: true, data: assemblies });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// ===========================================================================
// DASHBOARD
// ===========================================================================

router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId;
    const dashboard = await cendiaVoxService.getDashboard(orgId);
    res.json({ success: true, data: dashboard });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

export default router;
