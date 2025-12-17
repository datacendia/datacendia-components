// @ts-nocheck
// =============================================================================
// DATACENDIA PLATFORM - PLATFORM API ROUTES
// Health, metrics, and system information endpoints
// =============================================================================

import { Router, Request, Response } from 'express';
import { serviceRegistry } from '../core/services/ServiceRegistry.js';
import { moduleRegistry } from '../core/modules/ModuleRegistry.js';
import { eventBus } from '../core/events/EventBus.js';

const router = Router();

// =============================================================================
// HEALTH ENDPOINTS
// =============================================================================

/**
 * GET /api/v1/platform/health
 * Overall platform health check
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    const [serviceHealth, moduleHealth] = await Promise.all([
      serviceRegistry.healthCheckAll(),
      moduleRegistry.healthCheckAll(),
    ]);

    const overall = 
      serviceHealth.status === 'healthy' && 
      Object.values(moduleHealth).every(h => h.status === 'healthy')
        ? 'healthy'
        : serviceHealth.status === 'unhealthy' || 
          Object.values(moduleHealth).some(h => h.status === 'unhealthy')
          ? 'unhealthy'
          : 'degraded';

    res.json({
      status: overall,
      timestamp: new Date().toISOString(),
      services: serviceHealth,
      modules: moduleHealth,
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * GET /api/v1/platform/health/live
 * Kubernetes liveness probe
 */
router.get('/health/live', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * GET /api/v1/platform/health/ready
 * Kubernetes readiness probe
 */
router.get('/health/ready', async (req: Request, res: Response) => {
  try {
    const serviceHealth = await serviceRegistry.healthCheckAll();
    
    if (serviceHealth.status === 'unhealthy') {
      return res.status(503).json({
        status: 'not_ready',
        reason: 'One or more services are unhealthy',
        services: serviceHealth.services,
      });
    }

    res.json({
      status: 'ready',
      timestamp: new Date().toISOString(),
      services: serviceHealth.healthyServices,
    });
  } catch (error: any) {
    res.status(503).json({
      status: 'not_ready',
      error: error.message,
    });
  }
});

// =============================================================================
// METRICS ENDPOINTS
// =============================================================================

/**
 * GET /api/v1/platform/metrics
 * Platform metrics in JSON format
 */
router.get('/metrics', (req: Request, res: Response) => {
  try {
    const serviceMetrics = serviceRegistry.getMetricsAll();
    const eventStats = eventBus.getStats();

    res.json({
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      services: serviceMetrics,
      events: eventStats,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/v1/platform/metrics/prometheus
 * Prometheus format metrics
 */
router.get('/metrics/prometheus', (req: Request, res: Response) => {
  try {
    const serviceMetrics = serviceRegistry.getMetricsAll();
    const eventStats = eventBus.getStats();
    const mem = process.memoryUsage();

    let output = '';
    
    // Process metrics
    output += `# HELP process_uptime_seconds Process uptime in seconds\n`;
    output += `# TYPE process_uptime_seconds gauge\n`;
    output += `process_uptime_seconds ${process.uptime()}\n\n`;

    output += `# HELP process_memory_heap_bytes Process heap memory in bytes\n`;
    output += `# TYPE process_memory_heap_bytes gauge\n`;
    output += `process_memory_heap_bytes ${mem.heapUsed}\n\n`;

    // Service metrics
    output += `# HELP service_requests_total Total service requests\n`;
    output += `# TYPE service_requests_total counter\n`;
    for (const [name, metrics] of Object.entries(serviceMetrics.services)) {
      output += `service_requests_total{service="${name}"} ${metrics.requestCount}\n`;
    }
    output += '\n';

    output += `# HELP service_errors_total Total service errors\n`;
    output += `# TYPE service_errors_total counter\n`;
    for (const [name, metrics] of Object.entries(serviceMetrics.services)) {
      output += `service_errors_total{service="${name}"} ${metrics.errorCount}\n`;
    }
    output += '\n';

    output += `# HELP service_latency_avg_ms Average service latency in ms\n`;
    output += `# TYPE service_latency_avg_ms gauge\n`;
    for (const [name, metrics] of Object.entries(serviceMetrics.services)) {
      output += `service_latency_avg_ms{service="${name}"} ${metrics.avgLatency.toFixed(2)}\n`;
    }
    output += '\n';

    // Event metrics
    output += `# HELP events_published_total Total events published\n`;
    output += `# TYPE events_published_total counter\n`;
    output += `events_published_total ${eventStats.totalPublished}\n\n`;

    output += `# HELP events_delivered_total Total events delivered\n`;
    output += `# TYPE events_delivered_total counter\n`;
    output += `events_delivered_total ${eventStats.totalDelivered}\n\n`;

    res.set('Content-Type', 'text/plain');
    res.send(output);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// =============================================================================
// SYSTEM INFO ENDPOINTS
// =============================================================================

/**
 * GET /api/v1/platform/info
 * Platform information
 */
router.get('/info', (req: Request, res: Response) => {
  res.json({
    name: 'Datacendia Platform',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    uptime: process.uptime(),
    pid: process.pid,
  });
});

/**
 * GET /api/v1/platform/services
 * List registered services
 */
router.get('/services', (req: Request, res: Response) => {
  const states = serviceRegistry.getStateAll();
  const services = serviceRegistry.getServiceNames().map(name => ({
    name,
    ...states[name],
  }));
  
  res.json({
    count: services.length,
    services,
  });
});

/**
 * GET /api/v1/platform/modules
 * List registered modules
 */
router.get('/modules', (req: Request, res: Response) => {
  const modules = moduleRegistry.getLoadedModules().map(m => ({
    id: m.definition.id,
    name: m.definition.name,
    version: m.definition.version,
    status: m.state.status,
    loadedAt: m.state.loadedAt,
  }));

  res.json({
    count: modules.length,
    modules,
  });
});

/**
 * GET /api/v1/platform/events
 * Event bus information
 */
router.get('/events', (req: Request, res: Response) => {
  const stats = eventBus.getStats();
  const subscriptions = eventBus.getSubscriptions();
  
  const subscriptionsSummary: Record<string, number> = {};
  for (const [eventType, subs] of subscriptions) {
    subscriptionsSummary[eventType] = subs.length;
  }

  res.json({
    stats,
    subscriptions: subscriptionsSummary,
    deadLetterQueueSize: eventBus.getDeadLetterQueue().length,
  });
});

/**
 * GET /api/v1/platform/events/history
 * Recent event history
 */
router.get('/events/history', (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 50;
  const type = req.query.type as string | undefined;
  
  const events = eventBus.getHistory({ type, limit });
  
  res.json({
    count: events.length,
    events: events.map(e => ({
      id: e.id,
      type: e.type,
      source: e.source,
      timestamp: e.timestamp,
      correlationId: e.correlationId,
    })),
  });
});

export default router;
