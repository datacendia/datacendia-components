/**
 * Domain Router — Workflows Domain
 *
 * Aggregated route group that mounts related API endpoints under a single domain prefix.
 * @module routes/domains/workflows.domain
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// WORKFLOWS DOMAIN ROUTER - Workflows, Integrations & Scheduling
// =============================================================================

import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import workflowRoutes from '../workflows.js';
import integrationsRoutes from '../integrations.js';
import schedulerRoutes from '../scheduler.js';

const router = Router();

// Apply authentication at domain level for defense-in-depth.
router.use(authenticate);

router.use('/workflows', workflowRoutes);
router.use('/integrations', integrationsRoutes);
router.use('/scheduler', schedulerRoutes);

export default router;
