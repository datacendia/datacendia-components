/**
 * Middleware — Zod Validation
 *
 * Reusable request validation middleware using Zod schemas.
 * Validates body, query, and/or params against provided schemas
 * and returns structured error responses on failure.
 *
 * @exports validate, validateBody, validateQuery, validateParams
 * @module middleware/validate
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { logger } from '../utils/logger.js';

interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

/**
 * Generic validation middleware factory.
 * Validates request body, query, and/or params against Zod schemas.
 *
 * @example
 * router.post('/users', validate({ body: createUserSchema }), createUser);
 * router.get('/users/:id', validate({ params: z.object({ id: z.string().uuid() }) }), getUser);
 */
export function validate(schemas: ValidationSchemas) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: Record<string, unknown> = {};

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        errors['body'] = formatZodError(result.error);
      } else {
        req.body = result.data;
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        errors['query'] = formatZodError(result.error);
      } else {
        (req as any).query = result.data;
      }
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        errors['params'] = formatZodError(result.error);
      } else {
        (req as any).params = result.data;
      }
    }

    if (Object.keys(errors).length > 0) {
      logger.warn('Request validation failed', { path: req.path, errors });
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed',
          details: errors,
        },
      });
      return;
    }

    next();
  };
}

/**
 * Shorthand: validate request body only
 *
 * @example
 * router.post('/decisions', validateBody(createDecisionSchema), createDecision);
 */
export function validateBody(schema: ZodSchema) {
  return validate({ body: schema });
}

/**
 * Shorthand: validate query parameters only
 *
 * @example
 * router.get('/decisions', validateQuery(listDecisionsSchema), listDecisions);
 */
export function validateQuery(schema: ZodSchema) {
  return validate({ query: schema });
}

/**
 * Shorthand: validate route parameters only
 *
 * @example
 * router.get('/decisions/:id', validateParams(z.object({ id: z.string().uuid() })), getDecision);
 */
export function validateParams(schema: ZodSchema) {
  return validate({ params: schema });
}

/**
 * Format ZodError into a clean field → messages map
 */
function formatZodError(error: ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const path = issue.path.length > 0 ? issue.path.join('.') : '_root';
    if (!fieldErrors[path]) {
      fieldErrors[path] = [];
    }
    fieldErrors[path].push(issue.message);
  }

  return fieldErrors;
}

export default validate;
