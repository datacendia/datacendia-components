// =============================================================================
// PLATFORM DOMAIN ROUTER - Platform, Admin & Core Services
// =============================================================================

import { Router } from 'express';
import platformRoutes from '../platform.js';
import coreRoutes from '../core.js';
import cortexCoreRoutes from '../cortex-core.js';
import adminSettingsRoutes from '../admin-settings.js';
import adminRoutes from '../admin.js';
import settingsRoutes from '../settings.js';
import healthRoutes from '../health.js';
import i18nRoutes from '../i18n.js';
import notificationsRoutes from '../notifications.js';
import errorRoutes from '../errors.js';
import contactRoutes from '../contact.js';
import uploadRoutes from '../upload.js';
import schemaRoutes from '../schema.js';
import commandRoutes from '../command.js';
import omnitranslateRoutes from '../omnitranslate.js';
import envConfigRoutes from '../env-config.js';

const router = Router();

router.use('/platform', platformRoutes);
router.use('/core', coreRoutes);
router.use('/cortex', cortexCoreRoutes);
router.use('/admin/settings', adminSettingsRoutes); // Must come BEFORE /admin
router.use('/admin', adminRoutes);
router.use('/settings', settingsRoutes);
router.use('/health', healthRoutes);
router.use('/i18n', i18nRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/errors', errorRoutes);
router.use('/contact', contactRoutes);
router.use('/upload', uploadRoutes);
router.use('/schema', schemaRoutes);
router.use('/command', commandRoutes);
router.use('/omnitranslate', omnitranslateRoutes);
router.use('/admin/env-config', envConfigRoutes);

export default router;
