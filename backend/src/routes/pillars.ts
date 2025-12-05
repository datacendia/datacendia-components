// =============================================================================
// DATACENDIA PLATFORM - PILLAR API ROUTES
// RESTful endpoints for the 8 Foundational Data Layers
// =============================================================================

import { Router, Request, Response } from 'express';
import { devAuth } from '../middleware/auth.js';
import {
  helmService,
  lineageService,
  predictService,
  flowService,
  healthService,
  guardService,
  ethicsService,
  agentsService,
  initializePillarsForOrg,
} from '../services/pillars/index.js';

const router = Router();

// Use devAuth so requests have req.organizationId in development
router.use(devAuth);

// =============================================================================
// INITIALIZATION
// =============================================================================

router.post('/initialize', async (req: Request, res: Response) => {
  try {
    const { organizationId = 'demo' } = req.body;
    await initializePillarsForOrg(organizationId);
    res.json({ success: true, message: 'Pillars initialized' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// THE HELM - Metrics & KPIs
// =============================================================================

router.get('/helm/dashboard', async (req: Request, res: Response) => {
  try {
    const organizationId = req.organizationId || (req.query.organizationId as string) || 'demo';
    // Enterprise Platinum: No auto-seeding - data comes only from real operations
    const dashboard = await helmService.getKPIDashboard(organizationId);
    res.json({ success: true, data: dashboard });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/helm/metrics', async (req: Request, res: Response) => {
  try {
    const organizationId = req.organizationId || (req.query.organizationId as string) || 'demo';
    const category = req.query.category as string | undefined;
    const metrics = await helmService.getOrgMetrics(organizationId, category as any);
    res.json({ success: true, data: metrics });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/helm/metrics/:id', async (req: Request, res: Response) => {
  try {
    const metric = await helmService.getMetric(req.params.id);
    if (!metric) {
      return res.status(404).json({ success: false, error: 'Metric not found' });
    }
    res.json({ success: true, data: metric });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/helm/metrics/:id/history', async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const history = await helmService.getMetricHistory(req.params.id, days);
    res.json({ success: true, data: history });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.patch('/helm/metrics/:id', async (req: Request, res: Response) => {
  try {
    const { value } = req.body;
    const metric = await helmService.updateMetricValue(req.params.id, value);
    if (!metric) {
      return res.status(404).json({ success: false, error: 'Metric not found' });
    }
    res.json({ success: true, data: metric });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/helm/alerts', async (req: Request, res: Response) => {
  try {
    const organizationId = req.organizationId || (req.query.organizationId as string) || 'demo';
    const alerts = await helmService.getActiveAlerts(organizationId);
    res.json({ success: true, data: alerts });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/helm/alerts/:id/acknowledge', async (req: Request, res: Response) => {
  try {
    await helmService.acknowledgeAlert(req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// THE LINEAGE - Data Provenance
// =============================================================================

router.get('/lineage/graph', async (req: Request, res: Response) => {
  try {
    const organizationId = req.organizationId || (req.query.organizationId as string) || 'demo';
    // Enterprise Platinum: No auto-seeding
    const graph = await lineageService.getLineageGraph(organizationId);
    res.json({ success: true, data: graph });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/lineage/entities', async (req: Request, res: Response) => {
  try {
    const organizationId = req.organizationId || (req.query.organizationId as string) || 'demo';
    const type = req.query.type as string | undefined;
    const entities = await lineageService.getEntities(organizationId, type as any);
    res.json({ success: true, data: entities });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/lineage/entities/:id/trace', async (req: Request, res: Response) => {
  try {
    const direction = (req.query.direction as string) || 'both';
    const graph = await lineageService.traceLineage(req.params.id, direction as any);
    res.json({ success: true, data: graph });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/lineage/quality', async (req: Request, res: Response) => {
  try {
    const organizationId = req.organizationId || (req.query.organizationId as string) || 'demo';
    const overview = await lineageService.getQualityOverview(organizationId);
    res.json({ success: true, data: overview });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/lineage/entities/:id/quality-check', async (req: Request, res: Response) => {
  try {
    const report = await lineageService.checkDataQuality(req.params.id);
    res.json({ success: true, data: report });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// THE PREDICT - Forecasting
// =============================================================================

router.get('/predict/models', async (req: Request, res: Response) => {
  try {
    const organizationId = req.organizationId || (req.query.organizationId as string) || 'demo';
    // Enterprise Platinum: No auto-seeding
    const models = await predictService.getModels(organizationId);
    res.json({ success: true, data: models });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/predict/models/:id', async (req: Request, res: Response) => {
  try {
    const model = await predictService.getModel(req.params.id);
    if (!model) {
      return res.status(404).json({ success: false, error: 'Model not found' });
    }
    res.json({ success: true, data: model });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/predict/models/:id/features', async (req: Request, res: Response) => {
  try {
    const features = await predictService.getFeatureImportance(req.params.id);
    res.json({ success: true, data: features });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/predict/models/:id/predict', async (req: Request, res: Response) => {
  try {
    const prediction = await predictService.predict(req.params.id, req.body.input || {});
    res.json({ success: true, data: prediction });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/predict/models/:id/train', async (req: Request, res: Response) => {
  try {
    const model = await predictService.trainModel(req.params.id);
    res.json({ success: true, data: model });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/predict/forecasts', async (req: Request, res: Response) => {
  try {
    const organizationId = req.organizationId || (req.query.organizationId as string) || 'demo';
    const forecasts = await predictService.getForecasts(organizationId);
    res.json({ success: true, data: forecasts });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/predict/insights', async (req: Request, res: Response) => {
  try {
    const organizationId = req.organizationId || (req.query.organizationId as string) || 'demo';
    const insights = await predictService.generateInsights(organizationId);
    res.json({ success: true, data: insights });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// THE FLOW - Workflow Automation
// =============================================================================

router.get('/flow/stats', async (req: Request, res: Response) => {
  try {
    const organizationId = req.organizationId || (req.query.organizationId as string) || 'demo';
    // Enterprise Platinum: No auto-seeding
    const stats = await flowService.getFlowStats(organizationId);
    res.json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/flow/workflows', async (req: Request, res: Response) => {
  try {
    const organizationId = req.organizationId || (req.query.organizationId as string) || 'demo';
    const status = req.query.status as string | undefined;
    const workflows = await flowService.getWorkflows(organizationId, status as any);
    res.json({ success: true, data: workflows });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/flow/workflows/:id', async (req: Request, res: Response) => {
  try {
    const workflow = await flowService.getWorkflow(req.params.id);
    if (!workflow) {
      return res.status(404).json({ success: false, error: 'Workflow not found' });
    }
    res.json({ success: true, data: workflow });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/flow/workflows/:id/execute', async (req: Request, res: Response) => {
  try {
    const { triggeredBy = 'api', input } = req.body;
    const execution = await flowService.executeWorkflow(req.params.id, triggeredBy, input);
    res.json({ success: true, data: execution });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/flow/executions', async (req: Request, res: Response) => {
  try {
    const organizationId = req.organizationId || (req.query.organizationId as string) || 'demo';
    const limit = parseInt(req.query.limit as string) || 50;
    const executions = await flowService.getExecutions(organizationId, limit);
    res.json({ success: true, data: executions });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/flow/approvals', async (req: Request, res: Response) => {
  try {
    const organizationId = req.organizationId || (req.query.organizationId as string) || 'demo';
    const approvals = await flowService.getPendingApprovals(organizationId);
    res.json({ success: true, data: approvals });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/flow/approvals/:id', async (req: Request, res: Response) => {
  try {
    const { approved, decidedBy, reason } = req.body;
    const approval = await flowService.processApproval(req.params.id, approved, decidedBy, reason);
    res.json({ success: true, data: approval });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// THE HEALTH - System Health
// =============================================================================

router.get('/health/status', async (req: Request, res: Response) => {
  try {
    const organizationId = req.organizationId || (req.query.organizationId as string) || 'demo';
    const health = await healthService.getSystemHealth(organizationId);
    res.json({ success: true, data: health });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/health/alerts', async (req: Request, res: Response) => {
  try {
    const organizationId = req.organizationId || (req.query.organizationId as string) || 'demo';
    const includeResolved = req.query.includeResolved === 'true';
    const alerts = await healthService.getAlerts(organizationId, includeResolved);
    res.json({ success: true, data: alerts });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/health/alerts/:id/acknowledge', async (req: Request, res: Response) => {
  try {
    const alert = await healthService.acknowledgeAlert(req.params.id);
    res.json({ success: true, data: alert });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/health/alerts/:id/resolve', async (req: Request, res: Response) => {
  try {
    const alert = await healthService.resolveAlert(req.params.id);
    res.json({ success: true, data: alert });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/health/trends', async (req: Request, res: Response) => {
  try {
    const organizationId = req.organizationId || (req.query.organizationId as string) || 'demo';
    const hours = parseInt(req.query.hours as string) || 24;
    const trends = await healthService.getHealthTrends(organizationId, hours);
    res.json({ success: true, data: trends });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// THE GUARD - Security Posture
// =============================================================================

router.get('/guard/posture', async (req: Request, res: Response) => {
  try {
    const organizationId = req.organizationId || (req.query.organizationId as string) || 'demo';
    const posture = await guardService.getSecurityPosture(organizationId);
    res.json({ success: true, data: posture });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/guard/threats', async (req: Request, res: Response) => {
  try {
    const organizationId = req.organizationId || (req.query.organizationId as string) || 'demo';
    const includeResolved = req.query.includeResolved === 'true';
    // Enterprise Platinum: No auto-seeding
    const threats = await guardService.getThreats(organizationId, includeResolved);
    res.json({ success: true, data: threats });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.patch('/guard/threats/:id', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const threat = await guardService.updateThreatStatus(req.params.id, status);
    res.json({ success: true, data: threat });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/guard/policies', async (req: Request, res: Response) => {
  try {
    const organizationId = req.organizationId || (req.query.organizationId as string) || 'demo';
    const policies = await guardService.getPolicies(organizationId);
    res.json({ success: true, data: policies });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.patch('/guard/policies/:id', async (req: Request, res: Response) => {
  try {
    const { enabled } = req.body;
    const policy = await guardService.togglePolicy(req.params.id, enabled);
    res.json({ success: true, data: policy });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/guard/audit', async (req: Request, res: Response) => {
  try {
    const organizationId = req.organizationId || (req.query.organizationId as string) || 'demo';
    const limit = parseInt(req.query.limit as string) || 100;
    const logs = await guardService.getAuditLogs(organizationId, limit);
    res.json({ success: true, data: logs });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// THE ETHICS - AI Governance
// =============================================================================

router.get('/ethics/stats', async (req: Request, res: Response) => {
  try {
    const organizationId = req.organizationId || (req.query.organizationId as string) || 'demo';
    // Enterprise Platinum: No auto-seeding
    const stats = await ethicsService.getEthicsStats(organizationId);
    res.json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/ethics/principles', async (req: Request, res: Response) => {
  try {
    const organizationId = req.organizationId || (req.query.organizationId as string) || 'demo';
    const status = req.query.status as string | undefined;
    const principles = await ethicsService.getPrinciples(organizationId, status as any);
    res.json({ success: true, data: principles });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/ethics/reviews', async (req: Request, res: Response) => {
  try {
    const organizationId = req.organizationId || (req.query.organizationId as string) || 'demo';
    const result = req.query.result as string | undefined;
    const reviews = await ethicsService.getReviews(organizationId, result as any);
    res.json({ success: true, data: reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/ethics/reviews', async (req: Request, res: Response) => {
  try {
    const review = await ethicsService.requestReview(req.body);
    res.json({ success: true, data: review });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/ethics/reviews/:id/decide', async (req: Request, res: Response) => {
  try {
    const { result, notes, violations } = req.body;
    const review = await ethicsService.submitReviewDecision(req.params.id, result, notes, violations);
    res.json({ success: true, data: review });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/ethics/bias-checks', async (req: Request, res: Response) => {
  try {
    const organizationId = req.organizationId || (req.query.organizationId as string) || 'demo';
    const checks = await ethicsService.getBiasChecks(organizationId);
    res.json({ success: true, data: checks });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/ethics/bias-check', async (req: Request, res: Response) => {
  try {
    const { organizationId = 'demo', modelId, modelName } = req.body;
    const orgId = req.organizationId || organizationId || 'demo';
    const check = await ethicsService.performBiasCheck(orgId, modelId, modelName);
    res.json({ success: true, data: check });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// THE AGENTS - AI Agent Management
// =============================================================================

router.get('/agents/stats', async (req: Request, res: Response) => {
  try {
    const organizationId = req.organizationId || (req.query.organizationId as string) || 'demo';
    // Enterprise Platinum: No auto-seeding
    const stats = await agentsService.getAgentStats(organizationId);
    res.json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/agents', async (req: Request, res: Response) => {
  try {
    const organizationId = req.organizationId || (req.query.organizationId as string) || 'demo';
    // Enterprise Platinum: No auto-seeding
    const agents = await agentsService.getAgents(organizationId);
    res.json({ success: true, data: agents });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/agents/:id', async (req: Request, res: Response) => {
  try {
    const agent = await agentsService.getAgent(req.params.id);
    if (!agent) {
      return res.status(404).json({ success: false, error: 'Agent not found' });
    }
    res.json({ success: true, data: agent });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.patch('/agents/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const agent = await agentsService.updateAgentStatus(req.params.id, status);
    res.json({ success: true, data: agent });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.patch('/agents/:id/config', async (req: Request, res: Response) => {
  try {
    const agent = await agentsService.updateAgentConfig(req.params.id, req.body);
    res.json({ success: true, data: agent });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/agents/:id/interactions', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const interactions = await agentsService.getInteractions(req.params.id, limit);
    res.json({ success: true, data: interactions });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/agents/:id/interactions', async (req: Request, res: Response) => {
  try {
    const interaction = await agentsService.recordInteraction({
      ...req.body,
      agentId: req.params.id,
    });
    res.json({ success: true, data: interaction });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/agents/interactions/:id/rate', async (req: Request, res: Response) => {
  try {
    const { rating, feedback } = req.body;
    const interaction = await agentsService.rateInteraction(req.params.id, rating, feedback);
    res.json({ success: true, data: interaction });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
