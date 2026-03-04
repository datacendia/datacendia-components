/**
 * Middleware — Standardized Health Check Factory
 *
 * Provides a reusable health check endpoint factory for all route modules.
 * Ensures consistent response shape and optional dependency checks.
 *
 * @exports createHealthCheck, HealthCheckResult, ServiceHealth
 * @module middleware/healthCheck
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

import { Request, Response } from 'express';
import { API_VERSION } from './apiVersion.js';

export interface DependencyCheck {
  name: string;
  check: () => Promise<boolean>;
}

export interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  service: string;
  version: string;
  timestamp: string;
  uptime: number;
  dependencies?: Record<string, 'up' | 'down'>;
}

const startTime = Date.now();

/**
 * Factory that creates a standardized health check handler.
 *
 * @param serviceName - Name of the service (e.g., 'ledger', 'council', 'gateway')
 * @param dependencies - Optional async dependency checks (DB, Redis, external APIs)
 *
 * @example
 * // Simple health check
 * router.get('/health', createHealthCheck('ledger'));
 *
 * // With dependency checks
 * router.get('/health', createHealthCheck('council', [
 *   { name: 'database', check: async () => { await prisma.$queryRaw`SELECT 1`; return true; } },
 *   { name: 'redis', check: async () => cache.isReady() },
 * ]));
 */
export function createHealthCheck(serviceName: string, dependencies?: DependencyCheck[]) {
  return async (_req: Request, res: Response): Promise<void> => {
    const health: ServiceHealth = {
      status: 'healthy',
      service: serviceName,
      version: API_VERSION,
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - startTime) / 1000),
    };

    if (dependencies && dependencies.length > 0) {
      health.dependencies = {};
      let allUp = true;

      await Promise.all(
        dependencies.map(async (dep) => {
          try {
            const ok = await dep.check();
            health.dependencies![dep.name] = ok ? 'up' : 'down';
            if (!ok) allUp = false;
          } catch {
            health.dependencies![dep.name] = 'down';
            allUp = false;
          }
        })
      );

      if (!allUp) {
        health.status = 'degraded';
      }
    }

    const statusCode = health.status === 'unhealthy' ? 503 : 200;
    res.status(statusCode).json({ success: true, data: health });
  };
}

export default createHealthCheck;
