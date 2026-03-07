/**
 * Library — Prisma
 *
 * Shared library module.
 *
 * @exports prisma
 * @module lib/prisma
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Prisma Client Instance
 */

// Re-export the shared Prisma instance from config/database.ts
// which is configured with the Prisma v7 driver adapter
export { prisma, prisma as default } from '../config/database.js';
