/**
 * Domain Router — Platform Domain
 *
 * Aggregated route group that mounts related API endpoints under a single domain prefix.
 * @module routes/domains/platform.domain
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// PLATFORM DOMAIN ROUTER - Platform, Admin & Core Services
// =============================================================================

import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { mountEnterpriseRoutes } from './_enterprise.js';
import platformRoutes from '../platform.js';
import coreRoutes from '../core.js';
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
import envConfigRoutes from '../env-config.js';
import marketingStudioRoutes from '../marketing-studio.js';
import platformAssistantRoutes from '../platform-assistant.js';
import marketingLeadsRoutes from '../marketing-leads.js';
import autoHealRoutes from '../auto-heal.js';

const router = Router();

// =========================================================================
// PUBLIC ROUTES — No authentication required.
// These accept input from the marketing site / browsers pre-auth and must
// handle their own admin-only sub-routes internally (e.g. requireRole).
// =========================================================================
router.use('/contact', contactRoutes);               // POST / (public lead capture)
router.use('/marketing-leads', marketingLeadsRoutes); // POST / + /newsletter (public)
router.use('/errors', errorRoutes);                   // POST /report (browser error reporting)
router.use('/i18n', i18nRoutes);                      // GET /languages, /translations (public UI)

// =========================================================================
// AUTHENTICATED ROUTES — Require a valid JWT.
// =========================================================================
router.use('/platform', authenticate, platformRoutes);
router.use('/core', authenticate, coreRoutes);
router.use('/admin/settings', authenticate, adminSettingsRoutes); // Must come BEFORE /admin
router.use('/admin', authenticate, adminRoutes);
router.use('/settings', authenticate, settingsRoutes);
router.use('/health', authenticate, healthRoutes);
router.use('/notifications', authenticate, notificationsRoutes);
router.use('/upload', authenticate, uploadRoutes);
router.use('/schema', authenticate, schemaRoutes);
router.use('/command', authenticate, commandRoutes);
router.use('/admin/env-config', authenticate, envConfigRoutes);
router.use('/marketing-studio', authenticate, marketingStudioRoutes);
router.use('/platform-assistant', authenticate, platformAssistantRoutes);
router.use('/auto-heal', authenticate, autoHealRoutes);

// Enterprise routes (license-gated by pillar)
mountEnterpriseRoutes(router, [
  ['/cortex', () => import('../cortex-core.js'), 'operate'],
  ['/omnitranslate', () => import('../omnitranslate.js'), 'operate'],
]);

export default router;
