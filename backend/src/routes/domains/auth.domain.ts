/**
 * Domain Router — Auth Domain
 *
 * Aggregated route group that mounts related API endpoints under a single domain prefix.
 * @module routes/domains/auth.domain
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// AUTH DOMAIN ROUTER - Authentication & User Management
// =============================================================================

import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import authRoutes from '../auth.js';
import userRoutes from '../users.js';
import organizationRoutes from '../organizations.js';

const router = Router();

// /auth has mixed public (login, register, forgot-password) and private (logout, me) endpoints;
// those routes handle their own authentication per-endpoint.
router.use('/auth', authRoutes);

// /users and /organizations are always authenticated.
router.use('/users', authenticate, userRoutes);
router.use('/organizations', authenticate, organizationRoutes);

export default router;
