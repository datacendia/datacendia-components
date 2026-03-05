/**
 * Middleware — Correlation ID
 *
 * Attaches a unique correlation ID to every request for distributed tracing.
 * If the client sends X-Correlation-ID, it is reused; otherwise a new UUID is generated.
 * The ID is available on `req.correlationId` and echoed back in the response header.
 *
 * @exports correlationId
 * @module middleware/correlationId
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

declare global {
  namespace Express {
    interface Request {
      correlationId?: string;
    }
  }
}

const HEADER = 'X-Correlation-ID';

export function correlationId(req: Request, res: Response, next: NextFunction): void {
  const id = (req.headers[HEADER.toLowerCase()] as string) || crypto.randomUUID();
  req.correlationId = id;
  res.setHeader(HEADER, id);
  next();
}

export default correlationId;
