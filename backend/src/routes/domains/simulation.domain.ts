// =============================================================================
// SIMULATION DOMAIN ROUTER - Governance Simulation & Stress Testing
// =============================================================================

import { Router } from 'express';
import sgasRoutes from '../sgas.js';
import scgeRoutes from '../scge.js';
import collapseRoutes from '../collapse.js';

const router = Router();

router.use('/sgas', sgasRoutes);
router.use('/scge', scgeRoutes);
router.use('/collapse', collapseRoutes);

export default router;
