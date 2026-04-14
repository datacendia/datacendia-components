/**
 * Utility — Resolve Organization ID
 *
 * Securely resolves the organization ID from the authenticated JWT context.
 * NEVER trusts organizationId from request body — always uses req.organizationId
 * set by the auth middleware from the verified JWT.
 *
 * @module utils/resolveOrganizationId
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

import { Request } from 'express';
import { logger } from './logger.js';

/**
 * Resolve the organization ID from the authenticated request context.
 *
 * Priority: req.organizationId (from JWT via auth middleware)
 *
 * If organizationId is also present in req.body, it is IGNORED and a warning
 * is logged (potential injection attempt or legacy client behavior).
 *
 * @throws {Error} If no organization context is available
 */
export function resolveOrganizationId(req: Request): string {
  const jwtOrgId = req.organizationId;
  const bodyOrgId = req.body?.organizationId || req.body?.organization_id;

  if (bodyOrgId && jwtOrgId && bodyOrgId !== jwtOrgId) {
    logger.warn('SECURITY: organizationId in request body differs from JWT — body value ignored', {
      path: req.path,
      method: req.method,
      jwtOrgId,
      bodyOrgId,
      userId: req.user?.id,
    });
  }

  if (jwtOrgId) {
    return jwtOrgId;
  }

  // No JWT org context available
  throw new Error('Organization context required — authenticate with a valid JWT');
}

/**
 * Resolve org ID with a fallback for unauthenticated/dev contexts.
 * Uses JWT first, falls back to provided default. NEVER uses request body.
 */
export function resolveOrganizationIdOrDefault(req: Request, defaultOrgId: string): string {
  const jwtOrgId = req.organizationId;
  const bodyOrgId = req.body?.organizationId || req.body?.organization_id;

  if (bodyOrgId && jwtOrgId && bodyOrgId !== jwtOrgId) {
    logger.warn('SECURITY: organizationId in request body differs from JWT — body value ignored', {
      path: req.path,
      method: req.method,
      jwtOrgId,
      bodyOrgId,
    });
  }

  return jwtOrgId || defaultOrgId;
}
