// =============================================================================
// DRUID API ROUTES - Analytics Data for CendiaChronos™, CendiaWitness™, CendiaPulse™
// =============================================================================

import { Router, Request, Response } from 'express';
import { druidService, DRUID_DATASOURCES } from '../services/storage/DruidService';

const router = Router();

// =============================================================================
// HEALTH & STATUS
// =============================================================================

router.get('/health', async (_req: Request, res: Response) => {
  try {
    const available = await druidService.checkAvailability();
    res.json({
      success: true,
      available,
      datasources: Object.values(DRUID_DATASOURCES),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// CHRONOS - Decision History & Timeline
// =============================================================================

router.get('/chronos/decisions', async (req: Request, res: Response) => {
  try {
    const { 
      startTime, 
      endTime, 
      limit = '500', 
      riskLevel,
    } = req.query;

    const orgId = (req as any).organizationId || 'org_demo_001';

    const options: { startTime?: Date; endTime?: Date; limit?: number; riskLevel?: string } = {
      limit: parseInt(limit as string),
    };
    if (startTime) options.startTime = new Date(startTime as string);
    if (endTime) options.endTime = new Date(endTime as string);
    if (riskLevel) options.riskLevel = riskLevel as string;

    const result = await druidService.getDecisionHistory(orgId, options);

    // Transform for frontend
    const events = result.data.map((d: any) => ({
      id: d.decision_id,
      timestamp: new Date(d.__time),
      type: 'decision',
      title: d.question,
      description: `${d.final_recommendation} - ${d.confidence_score}% confidence`,
      impact: d.risk_level === 'critical' || d.risk_level === 'high' ? 'negative' : 
              d.final_recommendation === 'approve' ? 'positive' : 'neutral',
      magnitude: Math.ceil(d.confidence_score / 10),
      department: d.department,
      actors: d.agents_involved?.split(',') || [],
      deliberationId: d.session_id,
      riskLevel: d.risk_level,
      consensusReached: d.consensus_reached,
      userAccepted: d.user_accepted,
      deliberationTimeMs: d.deliberation_time_ms,
    }));

    res.json({
      success: true,
      data: events,
      totalRows: result.totalRows,
      queryTime: result.queryTime,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/chronos/timeline', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, granularity = 'day' } = req.query;
    const orgId = (req as any).organizationId || 'org_demo_001';

    const timeFloor = granularity === 'hour' ? 'PT1H' : granularity === 'week' ? 'P7D' : 'P1D';

    const sql = `
      SELECT 
        TIME_FLOOR(__time, '${timeFloor}') as time_bucket,
        COUNT(*) as decision_count,
        SUM(CASE WHEN risk_level = 'critical' THEN 1 ELSE 0 END) as critical_count,
        SUM(CASE WHEN risk_level = 'high' THEN 1 ELSE 0 END) as high_count,
        SUM(CASE WHEN consensus_reached = 'true' THEN 1 ELSE 0 END) as consensus_count,
        AVG(confidence_score) as avg_confidence,
        AVG(deliberation_time_ms) as avg_deliberation_time
      FROM "${DRUID_DATASOURCES.DECISION_HISTORY}"
      WHERE organization_id = '${orgId}'
      ${startDate ? `AND __time >= TIMESTAMP '${new Date(startDate as string).toISOString()}'` : ''}
      ${endDate ? `AND __time <= TIMESTAMP '${new Date(endDate as string).toISOString()}'` : ''}
      GROUP BY 1
      ORDER BY time_bucket ASC
    `;

    const result = await druidService.query(sql);

    res.json({
      success: true,
      data: result.data,
      queryTime: result.queryTime,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/chronos/risk-trend', async (req: Request, res: Response) => {
  try {
    const { days = '30' } = req.query;
    const orgId = (req as any).organizationId || 'org_demo_001';

    const result = await druidService.getRiskTrend(orgId, parseInt(days as string));

    res.json({
      success: true,
      data: result.data,
      queryTime: result.queryTime,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/chronos/departments', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId || 'org_demo_001';

    const sql = `
      SELECT 
        department,
        COUNT(*) as decision_count,
        AVG(confidence_score) as avg_confidence,
        SUM(CASE WHEN risk_level IN ('high', 'critical') THEN 1 ELSE 0 END) as high_risk_count
      FROM "${DRUID_DATASOURCES.DECISION_HISTORY}"
      WHERE organization_id = '${orgId}'
        AND __time >= CURRENT_TIMESTAMP - INTERVAL '90' DAY
      GROUP BY department
      ORDER BY decision_count DESC
    `;

    const result = await druidService.query(sql);

    res.json({
      success: true,
      data: result.data,
      queryTime: result.queryTime,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// WITNESS - Audit Trail
// =============================================================================

router.get('/witness/audit', async (req: Request, res: Response) => {
  try {
    const { resourceType, resourceId, actorId, startTime, endTime, limit = '100' } = req.query;
    const orgId = (req as any).organizationId || 'org_demo_001';

    const options: { resourceType?: string; resourceId?: string; actorId?: string; startTime?: Date; endTime?: Date; limit?: number } = {
      limit: parseInt(limit as string),
    };
    if (resourceType) options.resourceType = resourceType as string;
    if (resourceId) options.resourceId = resourceId as string;
    if (actorId) options.actorId = actorId as string;
    if (startTime) options.startTime = new Date(startTime as string);
    if (endTime) options.endTime = new Date(endTime as string);

    const result = await druidService.getAuditTrail(orgId, options);

    res.json({
      success: true,
      data: result.data,
      totalRows: result.totalRows,
      queryTime: result.queryTime,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/witness/activity-summary', async (req: Request, res: Response) => {
  try {
    const orgId = (req as any).organizationId || 'org_demo_001';

    const sql = `
      SELECT 
        TIME_FLOOR(__time, 'PT1H') as hour,
        action,
        COUNT(*) as count,
        COUNT(DISTINCT actor_id) as unique_actors
      FROM "${DRUID_DATASOURCES.AUDIT_EVENTS}"
      WHERE organization_id = '${orgId}'
        AND __time >= CURRENT_TIMESTAMP - INTERVAL '24' HOUR
      GROUP BY 1, 2
      ORDER BY hour DESC
    `;

    const result = await druidService.query(sql);

    res.json({
      success: true,
      data: result.data,
      queryTime: result.queryTime,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// PULSE - Agent & System Metrics
// =============================================================================

router.get('/pulse/agents', async (req: Request, res: Response) => {
  try {
    const { agentId, granularity = 'hour', startTime, endTime } = req.query;
    const orgId = (req as any).organizationId || 'org_demo_001';

    const options: { agentId?: string; granularity?: 'minute' | 'hour' | 'day'; startTime?: Date; endTime?: Date } = {
      granularity: granularity as 'minute' | 'hour' | 'day',
    };
    if (agentId) options.agentId = agentId as string;
    if (startTime) options.startTime = new Date(startTime as string);
    if (endTime) options.endTime = new Date(endTime as string);

    const result = await druidService.getAgentMetrics(orgId, options);

    res.json({
      success: true,
      data: result.data,
      queryTime: result.queryTime,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/pulse/system', async (_req: Request, res: Response) => {
  try {
    const result = await druidService.getSystemHealth();

    res.json({
      success: true,
      data: result.data,
      queryTime: result.queryTime,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/pulse/alerts', async (req: Request, res: Response) => {
  try {
    const { severity, resolved, limit = '50' } = req.query;
    const orgId = (req as any).organizationId || 'org_demo_001';

    let sql = `
      SELECT *
      FROM "${DRUID_DATASOURCES.ALERTS}"
      WHERE organization_id = '${orgId}'
    `;

    if (severity) sql += ` AND severity = '${severity}'`;
    if (resolved !== undefined) sql += ` AND resolved = '${resolved}'`;

    sql += ` ORDER BY __time DESC LIMIT ${limit}`;

    const result = await druidService.query(sql);

    res.json({
      success: true,
      data: result.data,
      queryTime: result.queryTime,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// SEEDING - Demo Data
// =============================================================================

router.post('/seed', async (_req: Request, res: Response) => {
  try {
    // This triggers the seeding process
    // In production, this would be protected by admin auth
    const { spawn } = require('child_process');
    const path = require('path');
    
    const scriptPath = path.join(__dirname, '../../scripts/seed-druid.ts');
    
    // Run the seeder in background
    const child = spawn('npx', ['ts-node', scriptPath], {
      detached: true,
      stdio: 'ignore',
    });
    child.unref();

    res.json({
      success: true,
      message: 'Druid seeding started in background. This may take a few minutes.',
      scriptPath,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// RAW SQL QUERY (Admin only)
// =============================================================================

router.post('/query', async (req: Request, res: Response): Promise<void> => {
  try {
    const { sql } = req.body;
    
    if (!sql) {
      res.status(400).json({ success: false, error: 'SQL query required' });
      return;
    }

    // Basic SQL injection prevention (in production, use parameterized queries)
    const forbidden = ['DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'CREATE'];
    const upperSql = sql.toUpperCase();
    for (const word of forbidden) {
      if (upperSql.includes(word)) {
        res.status(403).json({ success: false, error: `Forbidden operation: ${word}` });
        return;
      }
    }

    const result = await druidService.query(sql);

    res.json({
      success: result.success,
      data: result.data,
      totalRows: result.totalRows,
      queryTime: result.queryTime,
      error: result.error,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
