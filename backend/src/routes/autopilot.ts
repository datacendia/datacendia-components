// =============================================================================
// CENDIA AUTOPILOT™ API ROUTES
// Automation Rules Management
// =============================================================================

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /autopilot/rules - List automation rules
router.get('/rules', async (req: Request, res: Response) => {
  try {
    const { organization_id, enabled } = req.query;
    const where: any = {};
    if (organization_id) where.organization_id = organization_id;
    if (enabled !== undefined) where.enabled = enabled === 'true';

    const rules = await prisma.autopilot_rules.findMany({
      where,
      include: { executions: { take: 5, orderBy: { executed_at: 'desc' } } },
      orderBy: { created_at: 'desc' }
    });
    res.json({ success: true, data: rules });
  } catch (error) {
    console.error('[Autopilot] Rules error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch rules' });
  }
});

// POST /autopilot/rules - Create rule
router.post('/rules', async (req: Request, res: Response) => {
  try {
    const rule = await prisma.autopilot_rules.create({
      data: {
        organization_id: req.body.organization_id,
        name: req.body.name,
        trigger_type: req.body.trigger_type,
        trigger_config: req.body.trigger_config || {},
        action_type: req.body.action_type,
        action_config: req.body.action_config || {}
      }
    });
    res.json({ success: true, data: rule });
  } catch (error) {
    console.error('[Autopilot] Rule create error:', error);
    res.status(500).json({ success: false, error: 'Failed to create rule' });
  }
});

// POST /autopilot/rules/:id/execute - Execute rule
router.post('/rules/:id/execute', async (req: Request, res: Response) => {
  try {
    const execution = await prisma.autopilot_executions.create({
      data: {
        rule_id: req.params.id,
        status: 'completed',
        duration_ms: req.body.duration_ms || 0
      }
    });
    
    await prisma.autopilot_rules.update({
      where: { id: req.params.id },
      data: { trigger_count: { increment: 1 } }
    });
    
    res.json({ success: true, data: execution });
  } catch (error) {
    console.error('[Autopilot] Execute error:', error);
    res.status(500).json({ success: false, error: 'Failed to execute rule' });
  }
});

// GET /autopilot/executions - List executions
router.get('/executions', async (req: Request, res: Response) => {
  try {
    const { rule_id, status } = req.query;
    const where: any = {};
    if (rule_id) where.rule_id = rule_id;
    if (status) where.status = status;

    const executions = await prisma.autopilot_executions.findMany({
      where,
      include: { rule: true },
      orderBy: { executed_at: 'desc' },
      take: 100
    });
    res.json({ success: true, data: executions });
  } catch (error) {
    console.error('[Autopilot] Executions error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch executions' });
  }
});

export default router;
