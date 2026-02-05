// =============================================================================
// DATA DOMAIN ROUTER - Data Intelligence & Analytics
// =============================================================================

import { Router } from 'express';
import metricsRoutes from '../metrics.js';
import alertsRoutes from '../alerts.js';
import forecastRoutes from '../forecasts.js';
import dataSourceRoutes from '../dataSources.js';
import lineageRoutes from '../lineage.js';
import druidRoutes from '../druid.js';
import summaryRoutes from '../summaries.js';
import modelRoutes from '../models.js';
import forecastingRoutes from '../forecasting.js';
import roiMetricsRoutes from '../roi-metrics.js';
import ragRoutes from '../rag.js';
import graphRoutes from '../graph.js';
import horizonRoutes from '../horizon.js';
import sampleDataRoutes from '../sample-data.js';

const router = Router();

router.use('/metrics', metricsRoutes);
router.use('/alerts', alertsRoutes);
router.use('/predict', forecastRoutes);
router.use('/data-sources', dataSourceRoutes);
router.use('/lineage', lineageRoutes);
router.use('/druid', druidRoutes);
router.use('/summaries', summaryRoutes);
router.use('/models', modelRoutes);
router.use('/forecasting', forecastingRoutes);
router.use('/roi-metrics', roiMetricsRoutes);
router.use('/rag', ragRoutes);
router.use('/graph', graphRoutes);
router.use('/horizon', horizonRoutes);
router.use('/sample-data', sampleDataRoutes);

export default router;
