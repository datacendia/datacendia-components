/**
 * Middleware — Endpoint-Specific Rate Limits
 *
 * Stricter per-route rate limiting for sensitive endpoints.
 * Applied on top of the global limiter in middleware.ts.
 *
 * @exports authLimiter, billingLimiter, webhookLimiter, adminLimiter, uploadLimiter
 * @module middleware/rateLimits
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

import { rateLimit } from 'express-rate-limit';
import { config } from '../config/index.js';

const isTest = config.nodeEnv === 'test';

/**
 * Auth endpoints: 10 req/min per IP in production (brute-force protection)
 * Covers: /auth/login, /auth/register, /auth/forgot-password
 */
export const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: config.nodeEnv === 'production' ? 10 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 'AUTH_RATE_LIMITED', message: 'Too many authentication attempts. Please try again later.' },
  },
  skip: () => isTest,
  keyGenerator: (req) => req.ip || 'unknown',
});

/**
 * Billing endpoints: 20 req/min per IP
 * Covers: /billing/create-checkout-session, /billing/portal-session
 */
export const billingLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: config.nodeEnv === 'production' ? 20 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 'BILLING_RATE_LIMITED', message: 'Too many billing requests. Please try again later.' },
  },
  skip: () => isTest,
});

/**
 * Webhook endpoints: 200 req/min per IP (Stripe sends bursts)
 * Covers: /billing/webhook, /integrations/webhook
 */
export const webhookLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: config.nodeEnv === 'production' ? 200 : 2000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 'WEBHOOK_RATE_LIMITED', message: 'Too many webhook events.' },
  },
  skip: () => isTest,
});

/**
 * Admin endpoints: 30 req/min per IP
 * Covers: /admin/*, /tenants/*
 */
export const adminLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: config.nodeEnv === 'production' ? 30 : 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 'ADMIN_RATE_LIMITED', message: 'Too many admin requests.' },
  },
  skip: () => isTest,
});

/**
 * Upload/heavy endpoints: 10 req/min per IP
 * Covers: file uploads, document extraction, bulk operations
 */
export const uploadLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: config.nodeEnv === 'production' ? 10 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 'UPLOAD_RATE_LIMITED', message: 'Too many upload requests.' },
  },
  skip: () => isTest,
});

/**
 * Council deliberation: 5 req/min per IP (expensive LLM calls)
 */
export const councilLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: config.nodeEnv === 'production' ? 5 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 'COUNCIL_RATE_LIMITED', message: 'Too many deliberation requests. Each deliberation uses significant compute resources.' },
  },
  skip: () => isTest,
});
