/**
 * Domain Router — Security Domain
 *
 * Aggregated route group that mounts related API endpoints under a single domain prefix.
 * @module routes/domains/security.domain
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// SECURITY DOMAIN ROUTER - Security & Adversarial Defense
// =============================================================================

import { Router } from 'express';
import { mountEnterpriseRoutes } from './_enterprise.js';
import kmsRoutes from '../kms.js';
import postQuantumRoutes from '../post-quantum.js';
import zkpRoutes from '../zkp.js';
import adversarialRedteamRoutes from '../adversarial-redteam.js';
import redteamRoutes from '../redteam.js';
import securityServicesRoutes from '../security-services.js';
import mfaRoutes from '../mfa.js';
import sentryRoutes from '../sentry.js';
import hsmRoutes from '../hsm.js';
import credentialEvidenceRoutes from '../credential-evidence.js';

const router = Router();

// Community routes
router.use('/sentry', sentryRoutes);
router.use('/kms', kmsRoutes);
router.use('/post-quantum', postQuantumRoutes);
router.use('/zkp', zkpRoutes);
router.use('/adversarial-redteam', adversarialRedteamRoutes);
router.use('/redteam', redteamRoutes);
router.use('/security-services', securityServicesRoutes);
router.use('/mfa', mfaRoutes);
router.use('/hsm', hsmRoutes);
router.use('/credential-evidence', credentialEvidenceRoutes);

// Enterprise routes (license-gated by pillar)
mountEnterpriseRoutes(router, [
  ['/crucible', () => import('../crucible.js'), 'stress_test'],
  ['/crucible-enterprise', () => import('../crucible-enterprise.js'), 'stress_test'],
  ['/aegis', () => import('../aegis.js'), 'sovereign'],
  ['/security', () => import('../sovereign-security.js'), 'sovereign'],
]);

export default router;
