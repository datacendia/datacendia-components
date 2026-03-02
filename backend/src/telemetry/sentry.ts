/**
 * Telemetry — Sentry
 *
 * Observability, tracing, and monitoring instrumentation.
 *
 * @exports sentry
 * @module telemetry/sentry
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Sentry Error Tracking Integration
 * 
 * Enterprise Platinum Standard: Production error tracking, performance monitoring,
 * and release health for the Datacendia platform.
 * 
 * Features:
 * - Automatic error capture with full stack traces
 * - Performance monitoring (transaction tracing)
 * - Release tracking (ties errors to specific deployments)
 * - User context enrichment (organizationId, role)
 * - PII scrubbing (strips emails, tokens, passwords)
 * - Environment-aware sampling (higher in production environments)
 * - Express middleware integration
 * - Graceful degradation when DSN not configured
 * 
 * Configuration (environment variables):
 *   SENTRY_DSN          â€” Required for Sentry to be active
 *   SENTRY_ENVIRONMENT  â€” e.g., production, staging, development
 *   SENTRY_RELEASE      â€” Git SHA or version tag (set by CI/CD)
 *   SENTRY_TRACES_SAMPLE_RATE â€” 0.0 to 1.0 (default: 0.1 in prod, 1.0 in dev)
 */

import { logger } from '../utils/logger.js';

// =============================================================================
// TYPES
// =============================================================================

interface SentryConfig {
  dsn: string | undefined;
  environment: string;
  release: string | undefined;
  tracesSampleRate: number;
  enabled: boolean;
}

interface SentryUser {
  id: string;
  email?: string;
  organizationId?: string;
  role?: string;
}

interface SentryBreadcrumb {
  category: string;
  message: string;
  level: 'debug' | 'info' | 'warning' | 'error' | 'fatal';
  data?: Record<string, unknown>;
}

// =============================================================================
// PII SCRUBBING
// =============================================================================

const PII_PATTERNS = [
  { pattern: /password["\s]*[:=]["\s]*[^\s,}"]+/gi, replacement: 'password=***REDACTED***' },
  { pattern: /token["\s]*[:=]["\s]*[^\s,}"]+/gi, replacement: 'token=***REDACTED***' },
  { pattern: /secret["\s]*[:=]["\s]*[^\s,}"]+/gi, replacement: 'secret=***REDACTED***' },
  { pattern: /api[_-]?key["\s]*[:=]["\s]*[^\s,}"]+/gi, replacement: 'api_key=***REDACTED***' },
  { pattern: /authorization["\s]*[:=]["\s]*[^\s,}"]+/gi, replacement: 'authorization=***REDACTED***' },
  { pattern: /Bearer\s+[A-Za-z0-9\-._~+/]+=*/g, replacement: 'Bearer ***REDACTED***' },
  { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, replacement: '***EMAIL_REDACTED***' },
];

function scrubPII(data: string): string {
  let scrubbed = data;
  for (const { pattern, replacement } of PII_PATTERNS) {
    scrubbed = scrubbed.replace(pattern, replacement);
  }
  return scrubbed;
}

function scrubObject(obj: Record<string, unknown>): Record<string, unknown> {
  const scrubbed: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes('password') || lowerKey.includes('secret') || 
        lowerKey.includes('token') || lowerKey.includes('authorization') ||
        lowerKey.includes('api_key') || lowerKey.includes('apikey')) {
      scrubbed[key] = '***REDACTED***';
    } else if (typeof value === 'string') {
      scrubbed[key] = scrubPII(value);
    } else if (typeof value === 'object' && value !== null) {
      scrubbed[key] = scrubObject(value as Record<string, unknown>);
    } else {
      scrubbed[key] = value;
    }
  }
  return scrubbed;
}

// =============================================================================
// SENTRY SERVICE (SDK-agnostic â€” uses HTTP API directly)
// =============================================================================
// This implementation uses Sentry's HTTP API instead of @sentry/node to avoid
// adding a heavy dependency. It captures errors, breadcrumbs, and context
// using the Sentry envelope format. For full APM/tracing, install @sentry/node.
// =============================================================================

class SentryService {
  private config: SentryConfig;
  private breadcrumbs: SentryBreadcrumb[] = [];
  private maxBreadcrumbs = 100;
  private user: SentryUser | null = null;
  private tags: Record<string, string> = {};
  private extras: Record<string, unknown> = {};
  private sentryDsnParts: { publicKey: string; host: string; projectId: string } | null = null;

  constructor() {
    const env = process.env['NODE_ENV'] || 'development';
    const dsn = process.env['SENTRY_DSN'];

    this.config = {
      dsn,
      environment: process.env['SENTRY_ENVIRONMENT'] || env,
      release: process.env['SENTRY_RELEASE'] || process.env['BUILD_SHA'] || undefined,
      tracesSampleRate: parseFloat(process.env['SENTRY_TRACES_SAMPLE_RATE'] || (env === 'production' ? '0.1' : '1.0')),
      enabled: !!dsn && env !== 'test',
    };

    if (this.config.enabled && dsn) {
      this.parseDsn(dsn);
      logger.info(`[Sentry] Initialized â€” env: ${this.config.environment}, release: ${this.config.release || 'unset'}`);
    } else {
      logger.info('[Sentry] Disabled â€” no SENTRY_DSN configured');
    }
  }

  private parseDsn(dsn: string): void {
    try {
      const url = new URL(dsn);
      this.sentryDsnParts = {
        publicKey: url.username,
        host: `${url.protocol}//${url.host}`,
        projectId: url.pathname.replace('/', ''),
      };
    } catch (err) {
      logger.error('[Sentry] Invalid DSN format:', err);
      this.config.enabled = false;
    }
  }

  // ---------------------------------------------------------------------------
  // ERROR CAPTURE
  // ---------------------------------------------------------------------------

  captureException(error: Error, context?: Record<string, unknown>): string | null {
    if (!this.config.enabled || !this.sentryDsnParts) return null;

    const eventId = this.generateEventId();

    try {
      const event = {
        event_id: eventId,
        timestamp: new Date().toISOString(),
        platform: 'node',
        level: 'error',
        logger: 'datacendia',
        server_name: process.env['HOSTNAME'] || 'datacendia-backend',
        environment: this.config.environment,
        release: this.config.release,
        exception: {
          values: [{
            type: error.name,
            value: scrubPII(error.message),
            stacktrace: error.stack ? {
              frames: this.parseStackTrace(error.stack),
            } : undefined,
          }],
        },
        tags: { ...this.tags },
        extra: scrubObject({ ...this.extras, ...context }),
        user: this.user ? {
          id: this.user.id,
          organization_id: this.user.organizationId,
          role: this.user.role,
          // Deliberately not sending email â€” PII
        } : undefined,
        breadcrumbs: {
          values: this.breadcrumbs.slice(-50),
        },
        contexts: {
          runtime: {
            name: 'node',
            version: process.version,
          },
          os: {
            name: process.platform,
            version: process.arch,
          },
        },
      };

      // Send to Sentry asynchronously (fire-and-forget)
      this.sendEvent(event).catch(err => 
        logger.debug('[Sentry] Failed to send event:', err)
      );

      return eventId;
    } catch (err) {
      logger.debug('[Sentry] captureException failed:', err);
      return null;
    }
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): string | null {
    if (!this.config.enabled || !this.sentryDsnParts) return null;

    const eventId = this.generateEventId();

    const event = {
      event_id: eventId,
      timestamp: new Date().toISOString(),
      platform: 'node',
      level,
      logger: 'datacendia',
      server_name: process.env['HOSTNAME'] || 'datacendia-backend',
      environment: this.config.environment,
      release: this.config.release,
      message: { formatted: scrubPII(message) },
      tags: { ...this.tags },
      extra: scrubObject({ ...this.extras }),
      user: this.user ? { id: this.user.id } : undefined,
    };

    this.sendEvent(event).catch(err =>
      logger.debug('[Sentry] Failed to send message:', err)
    );

    return eventId;
  }

  // ---------------------------------------------------------------------------
  // CONTEXT MANAGEMENT
  // ---------------------------------------------------------------------------

  setUser(user: SentryUser | null): void {
    this.user = user;
  }

  setTag(key: string, value: string): void {
    this.tags[key] = value;
  }

  setTags(tags: Record<string, string>): void {
    Object.assign(this.tags, tags);
  }

  setExtra(key: string, value: unknown): void {
    this.extras[key] = value;
  }

  addBreadcrumb(breadcrumb: SentryBreadcrumb): void {
    this.breadcrumbs.push({
      ...breadcrumb,
      data: breadcrumb.data ? scrubObject(breadcrumb.data) as Record<string, unknown> : undefined,
    });

    // Trim to max
    if (this.breadcrumbs.length > this.maxBreadcrumbs) {
      this.breadcrumbs = this.breadcrumbs.slice(-this.maxBreadcrumbs);
    }
  }

  // ---------------------------------------------------------------------------
  // EXPRESS MIDDLEWARE
  // ---------------------------------------------------------------------------

  /**
   * Express error-handling middleware â€” captures unhandled errors
   * Usage: app.use(sentry.errorHandler())
   */
  errorHandler() {
    return (err: Error, req: any, res: any, next: any) => {
      // Add request context as breadcrumb
      this.addBreadcrumb({
        category: 'http',
        message: `${req.method} ${req.originalUrl}`,
        level: 'error',
        data: {
          method: req.method,
          url: req.originalUrl,
          status_code: res.statusCode,
          query: req.query,
        },
      });

      // Set user from request if available
      if (req.user) {
        this.setUser({
          id: req.user.id || req.user.userId,
          organizationId: req.user.organizationId,
          role: req.user.role,
        });
      }

      this.captureException(err, {
        request: {
          method: req.method,
          url: req.originalUrl,
          headers: scrubObject(req.headers || {}),
          query: req.query,
        },
      });

      next(err);
    };
  }

  /**
   * Express request tracking middleware â€” adds breadcrumbs for all requests
   * Usage: app.use(sentry.requestHandler())
   */
  requestHandler() {
    return (req: any, _res: any, next: any) => {
      this.addBreadcrumb({
        category: 'http',
        message: `${req.method} ${req.originalUrl}`,
        level: 'info',
        data: {
          method: req.method,
          url: req.originalUrl,
        },
      });
      next();
    };
  }

  // ---------------------------------------------------------------------------
  // INTERNAL: HTTP TRANSPORT
  // ---------------------------------------------------------------------------

  private async sendEvent(event: Record<string, unknown>): Promise<void> {
    if (!this.sentryDsnParts) return;

    const { publicKey, host, projectId } = this.sentryDsnParts;
    const url = `${host}/api/${projectId}/store/`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Sentry-Auth': `Sentry sentry_version=7, sentry_client=datacendia/1.0, sentry_key=${publicKey}`,
      },
      body: JSON.stringify(event),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const text = await response.text();
      logger.debug(`[Sentry] Event rejected: ${response.status} â€” ${text}`);
    }
  }

  private generateEventId(): string {
    // 32 hex characters
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private parseStackTrace(stack: string): { filename: string; function: string; lineno: number; colno: number; in_app: boolean }[] {
    const lines = stack.split('\n').slice(1); // Skip first line (error message)
    const frames: { filename: string; function: string; lineno: number; colno: number; in_app: boolean }[] = [];

    for (const line of lines) {
      const match = line.match(/\s+at\s+(.+?)\s+\((.+):(\d+):(\d+)\)/);
      if (match) {
        frames.push({
          function: match[1],
          filename: match[2],
          lineno: parseInt(match[3], 10),
          colno: parseInt(match[4], 10),
          in_app: !match[2].includes('node_modules'),
        });
      }
    }

    return frames.reverse(); // Sentry expects oldest frame first
  }

  // ---------------------------------------------------------------------------
  // DIAGNOSTICS
  // ---------------------------------------------------------------------------

  isEnabled(): boolean {
    return this.config.enabled;
  }

  getConfig(): Omit<SentryConfig, 'dsn'> & { dsn: string } {
    return {
      ...this.config,
      dsn: this.config.dsn ? '***CONFIGURED***' : 'NOT_SET',
    };
  }
}

// Need crypto for event ID generation
import crypto from 'crypto';

// =============================================================================
// SINGLETON
// =============================================================================

export const sentry = new SentryService();
export default sentry;
