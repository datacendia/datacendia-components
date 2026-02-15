// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

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
