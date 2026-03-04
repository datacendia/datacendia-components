// Copyright (c) 2024-2026 Datacendia, Inc. All Rights Reserved.
// See LICENSE file for details.

/**
 * @module startup/middleware
 * @description Express middleware pipeline — security, CORS, rate limiting, CSRF, caching.
 * Extracted from index.ts for modularity (F21 audit item).
 */

import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
import { swaggerSpec } from '../config/swagger.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { requestLogger } from '../middleware/requestLogger.js';
import { csrfProtection, csrfTokenHandler, ensureCsrfToken } from '../middleware/csrf.js';
import { customSecurityHeaders } from '../security/headers.js';
import {
  masterSecurityMiddleware,
  preventDataExfiltration,
  preventReplayAttack,
} from '../security/DefenseInDepth.js';
import {
  threatDetectionMiddleware,
} from '../security/SecurityHardening.js';
import { honeypotMiddleware } from '../security/Honeypot.js';
import {
  inputSanitizationMiddleware,
  pathTraversalMiddleware,
  sqlInjectionMiddleware,
} from '../middleware/SecurityMiddleware.js';
import { sentry } from '../telemetry/sentry.js';
import { apiCache, CACHE_TTLS } from '../middleware/cacheMiddleware.js';
import {
  authLimiter,
  billingLimiter,
  webhookLimiter,
  adminLimiter,
  uploadLimiter,
  councilLimiter,
} from '../middleware/rateLimits.js';
import { apiVersionHeaders } from '../middleware/apiVersion.js';
import { createHealthCheck } from '../middleware/healthCheck.js';

/**
 * Configure all Express middleware in the correct order.
 * Order matters — health probes and metrics come first,
 * then security, then body parsing, then route-level middleware.
 */
export function setupMiddleware(app: Express): void {
  // =========================================================================
  // LIVENESS PROBES — Must be before ALL middleware for K8s/Docker health checks
  // =========================================================================
  app.get('/health', createHealthCheck('platform'));
  app.get('/liveness', (_req, res) => {
    res.status(200).send('OK');
  });
  app.get('/readiness', async (_req, res) => {
    res.status(200).send('OK');
  });

  // =========================================================================
  // API VERSIONING + REQUEST TRACING
  // =========================================================================
  app.use(apiVersionHeaders);

  // =========================================================================
  // SECURITY HEADERS
  // =========================================================================
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  }));

  // =========================================================================
  // CORS
  // =========================================================================
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (config.nodeEnv === 'development') {
        if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
          return callback(null, true);
        }
      }
      if (config.corsOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID', 'X-Data-Source-Id', 'x-data-source-id'],
  }));

  // =========================================================================
  // RATE LIMITING + BODY PARSING + COMPRESSION
  // =========================================================================
  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: config.nodeEnv === 'production' ? 100 : 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: { code: 'RATE_LIMITED', message: 'Too many requests' } },
    skip: () => config.nodeEnv === 'test',
  });
  app.use('/api/', limiter);

  // =========================================================================
  // ENDPOINT-SPECIFIC RATE LIMITS (stricter than global)
  // =========================================================================
  app.use('/api/v1/auth', authLimiter);
  app.use('/api/v1/billing/webhook', webhookLimiter);
  app.use('/api/v1/billing', billingLimiter);
  app.use('/api/v1/admin', adminLimiter);
  app.use('/api/v1/tenants', adminLimiter);
  app.use('/api/v1/enterprise/documents', uploadLimiter);
  app.use('/api/v1/council/query', councilLimiter);

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());
  app.use(compression());
  app.use(requestLogger);

  // =========================================================================
  // SECURITY MIDDLEWARE
  // =========================================================================
  app.use(pathTraversalMiddleware);
  app.use(sqlInjectionMiddleware);
  app.use('/api/v1/council', inputSanitizationMiddleware);
  app.use(customSecurityHeaders);
  app.use(honeypotMiddleware);

  if (config.nodeEnv === 'production') {
    app.use(masterSecurityMiddleware);
    app.use(preventReplayAttack);
    app.use(preventDataExfiltration);
    app.use(threatDetectionMiddleware);
  }

  // =========================================================================
  // LEGAL RESEARCH (dynamic enterprise module, before CSRF)
  // =========================================================================
  if (config.nodeEnv === 'development') {
    import('../routes/legal-research.js').then(mod => {
      app.use('/api/v1/legal-research', mod.default as any);
      logger.info('📚 Legal Research API available at /api/v1/legal-research (no auth in dev)');
    }).catch(() => { /* Enterprise module not available */ });
  }

  // =========================================================================
  // CSRF PROTECTION
  // =========================================================================
  app.get('/api/v1/csrf-token', csrfTokenHandler);
  app.use('/api/', ensureCsrfToken);
  if (config.nodeEnv === 'production') {
    app.use('/api/', csrfProtection);
  }

  // =========================================================================
  // SWAGGER (dev only)
  // =========================================================================
  if (config.nodeEnv === 'development') {
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Datacendia API Documentation',
    }));
    app.get('/api/docs.json', (_req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });
    logger.info('📚 API Documentation available at /api/docs');
  }

  // =========================================================================
  // REDIS CACHE
  // =========================================================================
  app.use('/api/v1', apiCache({
    ttl: CACHE_TTLS.DECISIONS,
    varyByOrg: true,
    excludePaths: [
      /\/auth\//,
      /\/csrf-token/,
      /\/upload/,
      /\/ws/,
      /\/stream/,
      /\/council\/query/,
      /\/marketing-studio/,
      /\/platform-assistant/,
    ],
  }));
}

/**
 * Configure error handling middleware (must be AFTER routes).
 */
export function setupErrorHandling(app: Express): void {
  // 404 handler
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Resource not found' },
    });
  });

  // Sentry error tracking (must be BEFORE errorHandler)
  if (sentry.isEnabled()) {
    app.use(sentry.errorHandler());
  }

  // Global error handler
  app.use(errorHandler);
}
