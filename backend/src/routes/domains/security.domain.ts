// =============================================================================
// SECURITY DOMAIN ROUTER - Security & Adversarial Defense
// =============================================================================

import { Router } from 'express';
import crucibleRoutes from '../crucible.js';
import crucibleEnterpriseRoutes from '../crucible-enterprise.js';
import aegisRoutes from '../aegis.js';
import sovereignSecurityRoutes from '../sovereign-security.js';
import kmsRoutes from '../kms.js';
import postQuantumRoutes from '../post-quantum.js';
import zkpRoutes from '../zkp.js';
import adversarialRedteamRoutes from '../adversarial-redteam.js';
import redteamRoutes from '../redteam.js';

const router = Router();

router.use('/crucible', crucibleRoutes);
router.use('/crucible-enterprise', crucibleEnterpriseRoutes);
router.use('/aegis', aegisRoutes);
router.use('/security', sovereignSecurityRoutes);
router.use('/kms', kmsRoutes);
router.use('/post-quantum', postQuantumRoutes);
router.use('/zkp', zkpRoutes);
router.use('/adversarial-redteam', adversarialRedteamRoutes);
router.use('/redteam', redteamRoutes);

export default router;
