/**
 * Domain Router — Demo Domain
 *
 * Aggregated route group that mounts related API endpoints under a single domain prefix.
 * @module routes/domains/demo.domain
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DEMO DOMAIN ROUTER - Demo, Premium & Consolidated Services
// =============================================================================

import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import premiumFeatureRoutes from '../premium-features.js';
import demoSeedRoutes from '../demo-seed.js';
import consolidatedRoutes from '../consolidated.js';

const router = Router();

// /leads (public demo requests) is mounted in startup/routes.ts, ahead of the
// domains: an earlier domain's router.use(authenticate) blocked it here.

// All other sub-routes require authentication.
router.use('/premium', authenticate, premiumFeatureRoutes);
router.use('/demo', authenticate, demoSeedRoutes);
router.use('/consolidated', authenticate, consolidatedRoutes);

export default router;
