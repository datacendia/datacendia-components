/**
 * Domain Router — Simulation Domain
 *
 * Aggregated route group that mounts related API endpoints under a single domain prefix.
 * @module routes/domains/simulation.domain
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// SIMULATION DOMAIN ROUTER - Governance Simulation & Stress Testing
// =============================================================================

import { Router } from 'express';
import { mountEnterpriseRoutes } from './_enterprise.js';

const router = Router();

// Strategic tier routes (license-gated by pillar)
mountEnterpriseRoutes(router, [
  ['/sgas', () => import('../sgas.js'), 'sgas'],
  ['/scge', () => import('../scge.js'), 'sgas'],
  ['/collapse', () => import('../collapse.js'), 'collapse'],
]);

export default router;
