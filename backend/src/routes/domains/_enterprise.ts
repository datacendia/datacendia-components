// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Domain Router — Enterprise
 *
 * Aggregated route group that mounts related API endpoints under a single domain prefix.
 *
 * @exports mountEnterpriseRoutes
 * @module routes/domains/_enterprise
 */

// =============================================================================
// ENTERPRISE ROUTE MOUNTING UTILITY
// Conditionally loads enterprise route modules via dynamic import.
// In Community Edition builds, enterprise route files are excluded,
// so the imports fail silently and those endpoints simply don't exist.
//
// License enforcement: When a pillar is specified, the requireLicense
// middleware gates access based on the org's active license tier.
// =============================================================================

import { Router } from 'express';
import { requireLicense } from '../../middleware/requireLicense.js';

/**
 * Enterprise route definition.
 * - [0] path: URL prefix to mount under
 * - [1] loader: dynamic import function for the route module
 * - [2] pillar (optional): license pillar required to access this route
 *        e.g. 'stress_test', 'comply', 'govern', 'sovereign', 'operate',
 *             'collapse', 'sgas', 'verticals', 'frontier'
 */
type EnterpriseRoute = [string, () => Promise<any>, string?];

/**
 * Mount multiple enterprise routes on a router.
 * Each route is loaded via dynamic import — if the module doesn't exist
 * (community build), it is silently skipped.
 *
 * When a pillar is specified, requireLicense middleware is applied before
 * the route handler, gating access based on the org's license tier.
 */
export function mountEnterpriseRoutes(
  router: Router,
  routes: EnterpriseRoute[]
): void {
  (async () => {
    for (const [path, loader, pillar] of routes) {
      try {
        const mod = await loader();
        if (pillar) {
          router.use(path, requireLicense(pillar), mod.default);
        } else {
          router.use(path, mod.default);
        }
      } catch {
        // Enterprise module not available — Community Edition
      }
    }
  })();
}
