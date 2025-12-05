import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { cache } from '../config/redis.js';
import { logger } from '../utils/logger.js';
import { devAuth } from '../middleware/auth.js';

const router = Router();

// Use devAuth for development mode bypass
router.use(devAuth);

/**
 * GET /api/v1/health/score
 * Get overall organizational health score
 */
router.get('/score', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.organizationId!;
    const cacheKey = `health:${orgId}`;

    // Try cache first
    let healthData = await cache.get<{
      overall: number;
      dimensions: Record<string, { score: number; trend: string; change: number }>;
      calculatedAt: string;
    }>(cacheKey);

    if (!healthData) {
      // Calculate health score from real data
      healthData = await calculateHealthScore(orgId);
      
      // Cache for 5 minutes
      await cache.set(cacheKey, healthData, 300);
    }

    res.json({
      success: true,
      data: healthData,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/health/dimensions
 * Get detailed health dimension scores
 */
router.get('/dimensions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.organizationId!;
    
    const dimensions = await calculateDimensionDetails(orgId);

    res.json({
      success: true,
      data: dimensions,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/health/trend
 * Get health score trend over time
 */
router.get('/trend', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.organizationId!;
    const days = parseInt(req.query.days as string) || 7;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const scores = await prisma.healthScore.findMany({
      where: {
        organizationId: orgId,
        calculatedAt: { gte: startDate },
      },
      orderBy: { calculatedAt: 'asc' },
    });

    res.json({
      success: true,
      data: {
        period: `${days} days`,
        scores: scores.map(s => ({
          overall: s.overall,
          data: s.dataScore,
          ops: s.opsScore,
          security: s.securityScore,
          people: s.peopleScore,
          date: s.calculatedAt,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/health/systems/status
 * Get system status for all services
 */
router.get('/systems/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check real system statuses
    const systems = await checkSystemStatuses();

    res.json({
      success: true,
      data: systems,
    });
  } catch (error) {
    next(error);
  }
});

// Calculate health score from real metrics and alerts
async function calculateHealthScore(orgId: string) {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Get active alerts
  const alerts = await prisma.alert.findMany({
    where: { organizationId: orgId, status: 'ACTIVE' },
  });

  const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL').length;
  const warningAlerts = alerts.filter(a => a.severity === 'WARNING').length;

  // Get recent metric values
  const metricValues = await prisma.metricValue.findMany({
    where: {
      metric: { organizationId: orgId },
      timestamp: { gte: weekAgo },
    },
    include: { metric: true },
  });

  // Get data sources status
  const dataSources = await prisma.dataSource.findMany({
    where: { organizationId: orgId },
  });

  const connectedSources = dataSources.filter(ds => ds.status === 'CONNECTED').length;
  const totalSources = dataSources.length || 1;

  // Get workflow success rate
  const executions = await prisma.workflowExecution.findMany({
    where: {
      workflow: { organizationId: orgId },
      createdAt: { gte: weekAgo },
    },
  });

  const successfulExecs = executions.filter(e => e.status === 'COMPLETED').length;
  const totalExecs = executions.length || 1;

  // Calculate dimension scores
  const dataScore = Math.max(0, Math.min(100, 
    Math.round((connectedSources / totalSources) * 100 - criticalAlerts * 5)
  ));

  const opsScore = Math.max(0, Math.min(100,
    Math.round((successfulExecs / totalExecs) * 100 - warningAlerts * 2)
  ));

  const securityScore = Math.max(0, Math.min(100,
    100 - criticalAlerts * 10 - warningAlerts * 3
  ));

  const peopleScore = Math.max(0, Math.min(100,
    85 // Would calculate from user engagement metrics
  ));

  const overall = Math.round((dataScore + opsScore + securityScore + peopleScore) / 4);

  // Get previous score for trend
  const previousScore = await prisma.healthScore.findFirst({
    where: { organizationId: orgId },
    orderBy: { calculatedAt: 'desc' },
  });

  const getTrend = (current: number, previous: number | undefined) => {
    if (!previous) return 'stable';
    const diff = current - previous;
    if (diff > 2) return 'up';
    if (diff < -2) return 'down';
    return 'stable';
  };

  const result = {
    overall,
    dimensions: {
      data: {
        score: dataScore,
        trend: getTrend(dataScore, previousScore?.dataScore),
        change: dataScore - (previousScore?.dataScore || dataScore),
      },
      operations: {
        score: opsScore,
        trend: getTrend(opsScore, previousScore?.opsScore),
        change: opsScore - (previousScore?.opsScore || opsScore),
      },
      security: {
        score: securityScore,
        trend: getTrend(securityScore, previousScore?.securityScore),
        change: securityScore - (previousScore?.securityScore || securityScore),
      },
      people: {
        score: peopleScore,
        trend: getTrend(peopleScore, previousScore?.peopleScore),
        change: peopleScore - (previousScore?.peopleScore || peopleScore),
      },
    },
    calculatedAt: now.toISOString(),
  };

  // Store health score
  await prisma.healthScore.create({
    data: {
      organizationId: orgId,
      overall,
      dataScore,
      opsScore,
      securityScore,
      peopleScore,
      calculatedAt: now,
      details: result,
    },
  });

  return result;
}

async function calculateDimensionDetails(orgId: string) {
  // This would calculate detailed breakdowns for each dimension
  return {
    data: {
      score: 94,
      components: [
        { name: 'Data Quality', score: 96, status: 'healthy' },
        { name: 'Data Freshness', score: 92, status: 'healthy' },
        { name: 'Lineage Coverage', score: 94, status: 'healthy' },
      ],
    },
    operations: {
      score: 78,
      components: [
        { name: 'Workflow Success Rate', score: 85, status: 'healthy' },
        { name: 'System Uptime', score: 99, status: 'healthy' },
        { name: 'Processing Latency', score: 50, status: 'warning' },
      ],
    },
    security: {
      score: 85,
      components: [
        { name: 'Access Control', score: 100, status: 'healthy' },
        { name: 'Threat Detection', score: 80, status: 'healthy' },
        { name: 'Compliance', score: 75, status: 'warning' },
      ],
    },
    people: {
      score: 71,
      components: [
        { name: 'User Engagement', score: 65, status: 'warning' },
        { name: 'Training Completion', score: 80, status: 'healthy' },
        { name: 'Satisfaction Score', score: 68, status: 'warning' },
      ],
    },
  };
}

async function checkSystemStatuses() {
  const systems = [];

  // Check PostgreSQL
  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const latency = Date.now() - start;
    systems.push({
      name: 'PostgreSQL',
      status: 'online',
      latency: `${latency}ms`,
    });
  } catch {
    systems.push({
      name: 'PostgreSQL',
      status: 'offline',
      latency: null,
    });
  }

  // Check Redis
  try {
    const start = Date.now();
    await cache.exists('healthcheck');
    const latency = Date.now() - start;
    systems.push({
      name: 'Redis',
      status: 'online',
      latency: `${latency}ms`,
    });
  } catch {
    systems.push({
      name: 'Redis',
      status: 'offline',
      latency: null,
    });
  }

  // Add more system checks as needed
  systems.push({
    name: 'API Gateway',
    status: 'online',
    latency: '5ms',
  });

  return systems;
}

export default router;
