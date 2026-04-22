/**
 * Middleware — API Versioning Headers
 *
 * Attaches standard versioning and tracing headers to every API response.
 *
 * @exports apiVersionHeaders, API_VERSION
 * @module middleware/apiVersion
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export const API_VERSION = '1.0.0';
export const API_BUILD = process.env['BUILD_SHA'] || 'dev';

/**
 * Middleware that attaches versioning + tracing headers to every response:
 * - X-API-Version: Semantic version of the API
 * - X-Request-ID: Unique identifier for request tracing (uses incoming header or generates one)
 * - X-Response-Time: Time taken to process the request (ms)
 * - X-Powered-By: Overrides default Express header
 */
export function apiVersionHeaders(req: Request, res: Response, next: NextFunction): void {
  const start = process.hrtime.bigint();

  // Assign or forward request ID for distributed tracing
  const requestId = (req.get('X-Request-ID') || crypto.randomUUID());
  (req as any).requestId = requestId;

  // Set headers on response
  res.setHeader('X-API-Version', API_VERSION);
  res.setHeader('X-Request-ID', requestId);
  res.setHeader('X-Powered-By', 'Datacendia');

  // Calculate response time after response finishes
  res.on('finish', () => {
    const end = process.hrtime.bigint();
    void (Number(end - start) / 1_000_000);
    // Header already sent by the time 'finish' fires, but we can log it
    // For the header to be visible, we set it before the response is sent via the 'header' event
  });

  // Set response time header before headers are sent
  const originalWriteHead = res.writeHead.bind(res);
  (res as any).writeHead = function (statusCode: number, ...args: any[]) {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;
    res.setHeader('X-Response-Time', `${durationMs.toFixed(2)}ms`);
    return originalWriteHead(statusCode, ...args);
  };

  next();
}

export default apiVersionHeaders;
