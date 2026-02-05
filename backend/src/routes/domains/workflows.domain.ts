// =============================================================================
// WORKFLOWS DOMAIN ROUTER - Workflows, Integrations & Scheduling
// =============================================================================

import { Router } from 'express';
import workflowRoutes from '../workflows.js';
import integrationsRoutes from '../integrations.js';
import schedulerRoutes from '../scheduler.js';

const router = Router();

router.use('/workflows', workflowRoutes);
router.use('/integrations', integrationsRoutes);
router.use('/scheduler', schedulerRoutes);

export default router;
