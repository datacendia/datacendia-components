// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// SOVEREIGN DOMAIN ROUTER - Sovereign Stack Infrastructure
// =============================================================================

import { Router } from 'express';
import sovereignOrgansRoutes from '../sovereign-organs.js';
import sovereignRoutes from '../sovereign.js';
import sovereignArchRoutes from '../sovereign-arch.js';
import vaultRoutes from '../vault.js';
import evidenceRoutes from '../evidence.js';
import meshRoutes from '../mesh.js';
import eternalRoutes from '../eternal.js';
import symbiontRoutes from '../symbiont.js';
import evidenceVaultRoutes from '../evidence-vault.js';
import clamavRoutes from '../clamav.js';

const router = Router();

router.use('/sovereign', sovereignOrgansRoutes);
router.use('/sovereign-infra', sovereignRoutes);
router.use('/sovereign-arch', sovereignArchRoutes);
router.use('/vault', vaultRoutes);
router.use('/evidence', evidenceRoutes);
router.use('/mesh', meshRoutes);
router.use('/eternal', eternalRoutes);
router.use('/symbiont', symbiontRoutes);
router.use('/evidence-vault', evidenceVaultRoutes);
router.use('/clamav', clamavRoutes);

export default router;
