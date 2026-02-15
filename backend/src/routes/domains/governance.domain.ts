// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// GOVERNANCE DOMAIN ROUTER - Governance & Compliance
// =============================================================================

import { Router } from 'express';
import complianceRoutes from '../compliance.js';
import governRoutes from '../govern.js';
import panopticonRoutes from '../panopticon.js';
import pillarsRoutes from '../pillars.js';
import responsibilityRoutes from '../responsibility.js';
import constitutionalCourtRoutes from '../constitutional-court.js';
import regulatorySandboxRoutes from '../regulatory-sandbox.js';
import complianceMonitorRoutes from '../compliance-monitor.js';
import crossJurisdictionRoutes from '../cross-jurisdiction.js';
import regulatorsReceiptRoutes from '../regulators-receipt.js';
import dciiRoutes from '../dcii.js';

const router = Router();

router.use('/compliance', complianceRoutes);
router.use('/govern', governRoutes);
router.use('/panopticon', panopticonRoutes);
router.use('/pillars', pillarsRoutes);
router.use('/responsibility', responsibilityRoutes);
router.use('/constitutional-court', constitutionalCourtRoutes);
router.use('/regulatory-sandbox', regulatorySandboxRoutes);
router.use('/compliance-monitor', complianceMonitorRoutes);
router.use('/cross-jurisdiction', crossJurisdictionRoutes);
router.use('/regulators-receipt', regulatorsReceiptRoutes);
router.use('/dcii', dciiRoutes);

export default router;
