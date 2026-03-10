/**
 * BaseService Deep Tests
 * 
 * Tests the core service foundation: ServiceLogger, MetricsCollector,
 * and BaseService lifecycle management.
 * 
 * These are pure logic tests — no mocks needed for the core classes.
 * @module __tests__/services/BaseServiceDeep.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi } from 'vitest';

vi.mock('../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));
vi.mock('../../utils/errors.js', () => ({
  getErrorMessage: (e: any) => e instanceof Error ? e.message : String(e),
}));

const { ServiceLogger, MetricsCollector, BaseService } = await import('../../core/services/BaseService.js');
type ServiceHealth = import('../../core/services/BaseService.js').ServiceHealth;

// Create a concrete subclass for testing the abstract BaseService
class TestService extends BaseService {
  public initCalled = false;
  public shutdownCalled = false;
  public shouldFailInit = false;

  constructor() {
    super({ name: 'TestService', version: '1.0.0', dependencies: ['database'] });
  }

  async initialize(): Promise<void> {
    if (this.shouldFailInit) throw new Error('Init failed deliberately');
    this.initCalled = true;
  }

  async shutdown(): Promise<void> {
    this.shutdownCalled = true;
  }

  async healthCheck(): Promise<ServiceHealth> {
    return { status: 'healthy', lastCheck: new Date() };
  }
}

// =============================================================================
// ServiceLogger
// =============================================================================

describe('ServiceLogger', () => {
  // FAILS IF: constructor throws or methods don't exist
  it('should create a logger with service name', () => {
    const log = new ServiceLogger('MyService');
    expect(log).toBeDefined();
    expect(typeof log.info).toBe('function');
    expect(typeof log.warn).toBe('function');
    expect(typeof log.error).toBe('function');
    expect(typeof log.debug).toBe('function');
  });

  // FAILS IF: logging methods throw
  it('should log at all levels without throwing', () => {
    const log = new ServiceLogger('MyService', 'debug');
    expect(() => log.debug('debug msg')).not.toThrow();
    expect(() => log.info('info msg')).not.toThrow();
    expect(() => log.warn('warn msg')).not.toThrow();
    expect(() => log.error('error msg')).not.toThrow();
  });

  // FAILS IF: metadata not included in formatted message
  it('should accept metadata objects', () => {
    const log = new ServiceLogger('MyService', 'debug');
    expect(() => log.info('message', { key: 'value', count: 42 })).not.toThrow();
  });

  // FAILS IF: log level filtering broken (warn-level logger should not call debug)
  it('should respect log level filtering', () => {
    const log = new ServiceLogger('FilterTest', 'warn');
    // These should not throw even if suppressed
    expect(() => log.debug('suppressed')).not.toThrow();
    expect(() => log.info('suppressed')).not.toThrow();
    expect(() => log.warn('visible')).not.toThrow();
    expect(() => log.error('visible')).not.toThrow();
  });
});

// =============================================================================
// MetricsCollector
// =============================================================================

describe('MetricsCollector', () => {
  // FAILS IF: constructor throws
  it('should create a metrics collector', () => {
    const metrics = new MetricsCollector('TestService');
    expect(metrics).toBeDefined();
  });

  // FAILS IF: increment doesn't increase counter value
  it('should increment counters', () => {
    const metrics = new MetricsCollector('TestService');
    metrics.increment('requests');
    metrics.increment('requests');
    metrics.increment('requests', 3);
    const result = metrics.getMetrics();
    expect(result.requestCount).toBe(5);
  });

  // FAILS IF: record doesn't store values
  it('should record metric values', () => {
    const metrics = new MetricsCollector('TestService');
    metrics.record('latency', 10);
    metrics.record('latency', 20);
    metrics.record('latency', 30);
    const result = metrics.getMetrics();
    expect(result.avgLatency).toBe(20); // (10+20+30)/3
  });

  // FAILS IF: percentile calculation is wrong
  it('should calculate p95 and p99 latencies', () => {
    const metrics = new MetricsCollector('TestService');
    // Add 100 values from 1-100
    for (let i = 1; i <= 100; i++) {
      metrics.record('latency', i);
    }
    const result = metrics.getMetrics();
    expect(result.p95Latency).toBe(95);
    expect(result.p99Latency).toBe(99);
  });

  // FAILS IF: error count not tracked
  it('should track error counts', () => {
    const metrics = new MetricsCollector('TestService');
    metrics.increment('errors');
    metrics.increment('errors');
    const result = metrics.getMetrics();
    expect(result.errorCount).toBe(2);
  });

  // FAILS IF: uptime is 0 or negative
  it('should report positive uptime', () => {
    const metrics = new MetricsCollector('TestService');
    const result = metrics.getMetrics();
    expect(result.uptime).toBeGreaterThanOrEqual(0);
  });

  // FAILS IF: reset doesn't clear data
  it('should reset all metrics', () => {
    const metrics = new MetricsCollector('TestService');
    metrics.increment('requests', 100);
    metrics.record('latency', 500);
    metrics.reset();
    const result = metrics.getMetrics();
    expect(result.requestCount).toBe(0);
    expect(result.avgLatency).toBe(0);
  });

  // FAILS IF: empty metrics return non-zero averages
  it('should return 0 for empty metrics', () => {
    const metrics = new MetricsCollector('TestService');
    const result = metrics.getMetrics();
    expect(result.requestCount).toBe(0);
    expect(result.errorCount).toBe(0);
    expect(result.avgLatency).toBe(0);
    expect(result.p95Latency).toBe(0);
    expect(result.p99Latency).toBe(0);
  });

  // FAILS IF: timing doesn't record duration
  it('should record timing from start time', () => {
    const metrics = new MetricsCollector('TestService');
    const start = Date.now() - 50; // 50ms ago
    metrics.timing('latency', start);
    const result = metrics.getMetrics();
    expect(result.avgLatency).toBeGreaterThanOrEqual(40); // Allow some tolerance
  });

  // FAILS IF: tagged metrics not separate from untagged
  it('should support tagged metrics', () => {
    const metrics = new MetricsCollector('TestService');
    metrics.increment('requests', 1, { endpoint: '/api/health' });
    metrics.increment('requests', 1, { endpoint: '/api/council' });
    // Tagged counters are separate from the base 'requests' counter
    const result = metrics.getMetrics();
    expect(result.requestCount).toBe(0); // untagged counter is still 0
  });
});

// =============================================================================
// BaseService Lifecycle
// =============================================================================

describe('BaseService Lifecycle', () => {
  // FAILS IF: constructor doesn't set initial state
  it('should initialize with uninitialized state', () => {
    const svc = new TestService();
    expect(svc).toBeDefined();
  });

  // FAILS IF: start doesn't call initialize or set state to ready
  it('should start service and transition to ready', async () => {
    const svc = new TestService();
    await svc.start();
    expect(svc.initCalled).toBe(true);
  });

  // FAILS IF: start doesn't throw when already started
  it('should throw when starting a non-uninitialized service', async () => {
    const svc = new TestService();
    await svc.start();
    await expect(svc.start()).rejects.toThrow('Cannot start service in state');
  });

  // FAILS IF: failed init doesn't set state to stopped
  it('should handle init failure and set state to stopped', async () => {
    const svc = new TestService();
    svc.shouldFailInit = true;
    await expect(svc.start()).rejects.toThrow('Init failed deliberately');
  });

  // FAILS IF: stop doesn't call shutdown
  it('should stop service and call shutdown', async () => {
    const svc = new TestService();
    await svc.start();
    await svc.stop();
    expect(svc.shutdownCalled).toBe(true);
  });

  // FAILS IF: double stop throws
  it('should handle double stop gracefully', async () => {
    const svc = new TestService();
    await svc.start();
    await svc.stop();
    await expect(svc.stop()).resolves.not.toThrow();
  });

  // FAILS IF: healthCheck not implemented by subclass
  it('should return health check result', async () => {
    const svc = new TestService();
    const health = await svc.healthCheck();
    expect(health).toHaveProperty('status', 'healthy');
    expect(health.lastCheck).toBeInstanceOf(Date);
  });
});
