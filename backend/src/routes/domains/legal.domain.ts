// =============================================================================
// LEGAL DOMAIN ROUTER - Legal Services & Research
// =============================================================================

import { Router } from 'express';
import legalRoutes from '../legal.js';
import legalResearchRoutes from '../legal-research.js';
import legalServicesRoutes from '../legal-services.js';

const router = Router();

router.use('/legal', legalRoutes);
router.use('/legal-research', legalResearchRoutes);
router.use('/legal-services', legalServicesRoutes);

export default router;
