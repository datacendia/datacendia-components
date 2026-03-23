/**
 * API Routes — Prometheus
 *
 * Express route handler defining REST endpoints.
 *
 * @exports trackRequest
 * @module routes/prometheus
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Prometheus Metrics Endpoint
 * Exports system metrics in Prometheus format for monitoring
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../config/database.js';
import os from 'os';
import { sovereignMode } from '../services/sovereign/SovereignModeService.js';

const router = Router();

// Track request counts and latencies
const metrics = {
  httpRequestsTotal: new Map<string, number>(),
  httpRequestDurationSeconds: new Map<string, number[]>(),
  activeConnections: 0,
  startTime: Date.now(),
};

// Middleware to track requests (can be used in main app)
export function trackRequest(method: string, path: string, statusCode: number, durationMs: number) {
  const key = `${method}_${path}_${statusCode}`;
  metrics.httpRequestsTotal.set(key, (metrics.httpRequestsTotal.get(key) || 0) + 1);
  
  const durations = metrics.httpRequestDurationSeconds.get(key) || [];
  durations.push(durationMs / 1000);
  if (durations.length > 1000) durations.shift(); // Keep last 1000
  metrics.httpRequestDurationSeconds.set(key, durations);
}

/**
 * GET /metrics
 * Prometheus-compatible metrics endpoint
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const lines: string[] = [];
    const now = Date.now();

    // System metrics
    lines.push('# HELP process_cpu_user_seconds_total Total user CPU time spent in seconds');
    lines.push('# TYPE process_cpu_user_seconds_total counter');
    lines.push(`process_cpu_user_seconds_total ${process.cpuUsage().user / 1e6}`);

    lines.push('# HELP process_cpu_system_seconds_total Total system CPU time spent in seconds');
    lines.push('# TYPE process_cpu_system_seconds_total counter');
    lines.push(`process_cpu_system_seconds_total ${process.cpuUsage().system / 1e6}`);

    lines.push('# HELP process_resident_memory_bytes Resident memory size in bytes');
    lines.push('# TYPE process_resident_memory_bytes gauge');
    lines.push(`process_resident_memory_bytes ${process.memoryUsage().rss}`);

    lines.push('# HELP process_heap_bytes Process heap size in bytes');
    lines.push('# TYPE process_heap_bytes gauge');
    lines.push(`process_heap_bytes ${process.memoryUsage().heapUsed}`);

    lines.push('# HELP process_uptime_seconds Process uptime in seconds');
    lines.push('# TYPE process_uptime_seconds gauge');
    lines.push(`process_uptime_seconds ${(now - metrics.startTime) / 1000}`);

    lines.push('# HELP nodejs_version_info Node.js version info');
    lines.push('# TYPE nodejs_version_info gauge');
    lines.push(`nodejs_version_info{version="${process.version}"} 1`);

    // OS metrics
    lines.push('# HELP os_cpu_count Number of CPUs');
    lines.push('# TYPE os_cpu_count gauge');
    lines.push(`os_cpu_count ${os.cpus().length}`);

    lines.push('# HELP os_memory_total_bytes Total system memory in bytes');
    lines.push('# TYPE os_memory_total_bytes gauge');
    lines.push(`os_memory_total_bytes ${os.totalmem()}`);

    lines.push('# HELP os_memory_free_bytes Free system memory in bytes');
    lines.push('# TYPE os_memory_free_bytes gauge');
    lines.push(`os_memory_free_bytes ${os.freemem()}`);

    lines.push('# HELP os_load_average System load average');
    lines.push('# TYPE os_load_average gauge');
    const loadAvg = os.loadavg();
    lines.push(`os_load_average{period="1m"} ${loadAvg[0]}`);
    lines.push(`os_load_average{period="5m"} ${loadAvg[1]}`);
    lines.push(`os_load_average{period="15m"} ${loadAvg[2]}`);

    // Database metrics (with timeout)
    lines.push('# HELP datacendia_database_connected Database connection status');
    lines.push('# TYPE datacendia_database_connected gauge');
    try {
      await Promise.race([
        prisma.$queryRaw`SELECT 1`,
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1000))
      ]);
      lines.push('datacendia_database_connected 1');
    } catch {
      lines.push('datacendia_database_connected 0');
    }

    // HTTP request metrics
    lines.push('# HELP http_requests_total Total HTTP requests');
    lines.push('# TYPE http_requests_total counter');
    for (const [key, count] of metrics.httpRequestsTotal) {
      const [method, path, status] = key.split('_');
      lines.push(`http_requests_total{method="${method}",path="${path}",status="${status}"} ${count}`);
    }

    // Service health
    lines.push('# HELP datacendia_service_up Service health status (1=up, 0=down)');
    lines.push('# TYPE datacendia_service_up gauge');
    lines.push('datacendia_service_up{service="api"} 1');
    lines.push('datacendia_service_up{service="database"} 1');

    // Sovereign mode metrics
    const sovStatus = sovereignMode.getStatus();
    lines.push('# HELP datacendia_sovereign_online_mode Sovereign online mode (1=online, 0=offline/sovereign)');
    lines.push('# TYPE datacendia_sovereign_online_mode gauge');
    lines.push(`datacendia_sovereign_online_mode ${sovStatus.onlineMode ? 1 : 0}`);
    lines.push('# HELP datacendia_sovereign_cloud_ai Cloud AI enabled (1=yes, 0=no)');
    lines.push('# TYPE datacendia_sovereign_cloud_ai gauge');
    lines.push(`datacendia_sovereign_cloud_ai ${sovStatus.cloudAI ? 1 : 0}`);
    lines.push('# HELP datacendia_sovereign_external_data External data feeds enabled');
    lines.push('# TYPE datacendia_sovereign_external_data gauge');
    lines.push(`datacendia_sovereign_external_data ${sovStatus.externalData ? 1 : 0}`);
    lines.push('# HELP datacendia_sovereign_external_notify External notifications enabled');
    lines.push('# TYPE datacendia_sovereign_external_notify gauge');
    lines.push(`datacendia_sovereign_external_notify ${sovStatus.externalNotify ? 1 : 0}`);

    // Business metrics (best-effort from database)
    try {
      const [tenantCount, userCount, deliberationCount, activeFlags] = await Promise.all([
        prisma.tenants.count().catch(() => 0),
        prisma.users.count().catch(() => 0),
        prisma.deliberations.count().catch(() => 0),
        prisma.feature_flags.count({ where: { enabled: true } }).catch(() => 0),
      ]);
      lines.push('# HELP datacendia_tenants_total Total number of tenants');
      lines.push('# TYPE datacendia_tenants_total gauge');
      lines.push(`datacendia_tenants_total ${tenantCount}`);
      lines.push('# HELP datacendia_users_total Total number of users');
      lines.push('# TYPE datacendia_users_total gauge');
      lines.push(`datacendia_users_total ${userCount}`);
      lines.push('# HELP datacendia_deliberations_total Total deliberations');
      lines.push('# TYPE datacendia_deliberations_total gauge');
      lines.push(`datacendia_deliberations_total ${deliberationCount}`);
      lines.push('# HELP datacendia_feature_flags_active Active feature flags');
      lines.push('# TYPE datacendia_feature_flags_active gauge');
      lines.push(`datacendia_feature_flags_active ${activeFlags}`);
    } catch {
      // Business metrics are best-effort
    }

    res.set('Content-Type', 'text/plain; version=0.0.4');
    res.send(lines.join('\n'));
  } catch (error) {
    res.status(500).send(`# Error generating metrics: ${error}`);
  }
});

/**
 * GET /metrics/health
 * Simple health check for load balancers
 */
router.get('/health', async (_req: Request, res: Response) => {
  try {
    // Quick database check
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: String(error),
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
