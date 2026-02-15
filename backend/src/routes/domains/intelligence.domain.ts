// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// INTELLIGENCE DOMAIN ROUTER - AI Intelligence & Visualization
// =============================================================================

import { Router } from 'express';
import personaRoutes from '../persona.js';
import autopilotRoutes from '../autopilot.js';
import decisionIntelRoutes from '../decision-intel.js';
import gnosisRoutes from '../gnosis.js';
import apotheosisRoutes from '../apotheosis.js';
import visualizationRoutes from '../visualization.js';

const router = Router();

router.use('/persona', personaRoutes);
router.use('/autopilot', autopilotRoutes);
router.use('/decision-intel', decisionIntelRoutes);
router.use('/gnosis', gnosisRoutes);
router.use('/apotheosis', apotheosisRoutes);
router.use('/visualization', visualizationRoutes);

export default router;
