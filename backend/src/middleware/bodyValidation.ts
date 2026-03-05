/**
 * Middleware — Global Body Validation
 *
 * Ensures all POST/PUT/PATCH requests have a valid JSON object body.
 * This is a baseline safety net — route-specific Zod schemas provide
 * deeper field-level validation on top of this.
 *
 * @exports requireJsonBody
 * @module middleware/bodyValidation
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

import { Request, Response, NextFunction } from 'express';

const MUTATION_METHODS = new Set(['POST', 'PUT', 'PATCH']);

const EXEMPT_PATHS = new Set([
  '/api/v1/auth/logout',
  '/api/v1/csrf-token',
  '/health',
  '/liveness',
  '/readiness',
]);

export function requireJsonBody(req: Request, res: Response, next: NextFunction): void {
  if (!MUTATION_METHODS.has(req.method)) {
    next();
    return;
  }

  if (EXEMPT_PATHS.has(req.path)) {
    next();
    return;
  }

  if (req.body === undefined || req.body === null) {
    res.status(400).json({
      success: false,
      error: {
        code: 'MISSING_BODY',
        message: 'Request body is required for this endpoint',
      },
    });
    return;
  }

  if (typeof req.body !== 'object' || Array.isArray(req.body)) {
    res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_BODY',
        message: 'Request body must be a JSON object',
      },
    });
    return;
  }

  next();
}

export default requireJsonBody;
