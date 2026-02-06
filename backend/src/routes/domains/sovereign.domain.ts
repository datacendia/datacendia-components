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

const router = Router();

router.use('/sovereign', sovereignOrgansRoutes);
router.use('/sovereign-infra', sovereignRoutes);
router.use('/sovereign-arch', sovereignArchRoutes);
router.use('/vault', vaultRoutes);
router.use('/evidence', evidenceRoutes);
router.use('/mesh', meshRoutes);
router.use('/eternal', eternalRoutes);
router.use('/symbiont', symbiontRoutes);

export default router;
