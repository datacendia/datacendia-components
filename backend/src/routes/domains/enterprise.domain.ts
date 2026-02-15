// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// ENTERPRISE DOMAIN ROUTER - Enterprise Services
// =============================================================================

import { Router } from 'express';
import enterpriseSecurityRoutes from '../enterprise.security.js';
import enterpriseRoutes from '../enterprise.js';
import ledgerRoutes from '../ledger.js';
import auditPackagesRoutes from '../audit-packages.js';
import aiInsuranceRoutes from '../ai-insurance.js';
import cascadeRoutes from '../cascade.js';
import adaptersRoutes from '../adapters.js';
import strategicRoutes from '../strategic.js';
import connectorsRoutes from '../connectors.js';
import carbonAwareRoutes from '../carbon-aware.js';
import hrRoutes from '../hr.js';
import enterpriseConnectorsRoutes from '../enterprise-connectors.js';
import salaryRoutes from '../salary.js';

const router = Router();

router.use('/enterprise/security', enterpriseSecurityRoutes); // Must come BEFORE /enterprise
router.use('/enterprise', enterpriseRoutes);
router.use('/ledger', ledgerRoutes);
router.use('/audit-packages', auditPackagesRoutes);
router.use('/ai-insurance', aiInsuranceRoutes);
router.use('/cascade', cascadeRoutes);
router.use('/adapters', adaptersRoutes);
router.use('/strategic', strategicRoutes);
router.use('/connectors', connectorsRoutes);
router.use('/carbon-aware', carbonAwareRoutes);
router.use('/hr', hrRoutes);
router.use('/salary', salaryRoutes);
router.use('/enterprise-connectors', enterpriseConnectorsRoutes);

export default router;
