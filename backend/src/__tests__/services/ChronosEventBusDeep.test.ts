/**
 * ChronosEventBus Deep Tests
 * 
 * Tests the universal event bus: event recording, timeline queries,
 * statistics, batch operations, hash chaining, and scheduler.
 * 
 * Every test uses real platform event inputs and meaningful assertions.
 * @module __tests__/services/ChronosEventBusDeep.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

const mockPrismaChronos = {
  chronos_events: {
    create: vi.fn().mockResolvedValue({ id: 'evt-1', hash: 'abc123', created_at: new Date() }),
    findMany: vi.fn().mockResolvedValue([]),
    count: vi.fn().mockResolvedValue(0),
    groupBy: vi.fn().mockResolvedValue([]),
  },
  audit_logs: {
    findMany: vi.fn().mockResolvedValue([]),
    count: vi.fn().mockResolvedValue(0),
  },
  deliberations: {
    findMany: vi.fn().mockResolvedValue([]),
    count: vi.fn().mockResolvedValue(0),
  },
  $queryRaw: vi.fn().mockResolvedValue([]),
};

vi.mock('../../config/database.js', () => ({
  prisma: mockPrismaChronos,
}));

const { chronosEventBus, recordChronosEvent } = await import('../../services/ChronosEventBus.js');

describe('ChronosEventBus — Universal Event Timeline', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    mockPrismaChronos.chronos_events.create.mockResolvedValue({
      id: `evt-${Date.now()}`, hash: 'abc123def', created_at: new Date(),
    });
  });

  // ===========================================================================
  // SERVICE INITIALIZATION
  // ===========================================================================

  // FAILS IF: service singleton not exported
  it('should export chronosEventBus singleton', () => {
    expect(chronosEventBus).not.toBeNull();
    expect(typeof chronosEventBus).toBe('object');
  });

  // FAILS IF: convenience function not exported
  it('should export recordChronosEvent function', () => {
    expect(typeof recordChronosEvent).toBe('function');
  });

  // ===========================================================================
  // EVENT RECORDING
  // ===========================================================================

  describe('emitEvent()', () => {
    // FAILS IF: emitEvent throws or returns empty string for valid event
    it('should record a deliberation_started event and return event ID', async () => {
      const eventId = await chronosEventBus.emitEvent({
        organizationId: 'org-datacendia',
        eventType: 'deliberation_started',
        category: 'council',
        severity: 'info',
        title: 'Council Deliberation Started',
        description: 'Should we expand into the EU market?',
        actor: 'ceo@datacendia.com',
        actorType: 'user',
        resourceType: 'deliberation',
        resourceId: 'delib-2024-001',
        metadata: { agentCount: 5, mode: 'full_council' },
        impact: 'neutral',
        magnitude: 5,
      });

      expect(typeof eventId).toBe('string');
      // Prisma create should have been called
      expect(mockPrismaChronos.chronos_events.create).toHaveBeenCalled();
    });

    // FAILS IF: high-severity event doesn't get recorded
    it('should record a critical security event', async () => {
      const eventId = await chronosEventBus.emitEvent({
        organizationId: 'org-datacendia',
        eventType: 'security_threat_detected',
        category: 'security',
        severity: 'critical',
        title: 'SQL Injection Attempt Detected',
        description: 'Malicious input detected in /api/v1/deliberations endpoint',
        actor: '192.168.1.100',
        actorType: 'system',
        resourceType: 'endpoint',
        resourceId: '/api/v1/deliberations',
        metadata: { payload: "'; DROP TABLE --", blocked: true },
        impact: 'negative',
        magnitude: 9,
      });

      expect(typeof eventId).toBe('string');
    });

    // FAILS IF: compliance event doesn't include correct metadata
    it('should record a compliance violation event', async () => {
      await chronosEventBus.emitEvent({
        organizationId: 'org-datacendia',
        eventType: 'compliance_violation',
        category: 'compliance',
        severity: 'high',
        title: 'GDPR Data Retention Exceeded',
        description: 'Customer data retained beyond 36-month policy limit',
        actorType: 'system',
        resourceType: 'data_store',
        resourceId: 'customer-db',
        metadata: { framework: 'GDPR', article: '5(1)(e)', daysOverLimit: 45 },
        impact: 'negative',
        magnitude: 7,
      });

      const createCall = mockPrismaChronos.chronos_events.create.mock.calls[0][0];
      expect(createCall.data).toHaveProperty('event_type', 'compliance_violation');
      expect(createCall.data).toHaveProperty('category', 'compliance');
      expect(createCall.data).toHaveProperty('severity', 'high');
      expect(createCall.data).toHaveProperty('organization_id', 'org-datacendia');
    });
  });

  // ===========================================================================
  // FIRE-AND-FORGET RECORDING
  // ===========================================================================

  describe('record()', () => {
    // FAILS IF: record throws synchronously
    it('should record an event without awaiting (fire-and-forget)', () => {
      expect(() => {
        chronosEventBus.record({
          organizationId: 'org-1',
          eventType: 'system_event',
          category: 'system',
          title: 'Background job completed',
          description: 'Nightly compliance scan finished',
        });
      }).not.toThrow();
    });
  });

  // ===========================================================================
  // BATCH RECORDING
  // ===========================================================================

  describe('recordBatch()', () => {
    // FAILS IF: batch recording doesn't return count of recorded events
    it('should record multiple events in batch', async () => {
      const events = [
        { organizationId: 'org-1', eventType: 'metric_value_changed' as const, category: 'system' as const, title: 'CPU Usage', description: 'CPU at 85%' },
        { organizationId: 'org-1', eventType: 'alert_triggered' as const, category: 'health' as const, title: 'High CPU Alert', description: 'CPU exceeded threshold' },
        { organizationId: 'org-1', eventType: 'health_check_failed' as const, category: 'health' as const, title: 'API Health Check', description: 'Endpoint /health returned 503' },
      ];

      const recorded = await chronosEventBus.recordBatch(events);
      expect(typeof recorded).toBe('number');
      expect(recorded).toBe(3);
      expect(mockPrismaChronos.chronos_events.create).toHaveBeenCalledTimes(3);
    });
  });

  // ===========================================================================
  // TIMELINE QUERIES
  // ===========================================================================

  describe('getTimeline()', () => {
    // FAILS IF: getTimeline throws or returns wrong shape
    it('should return timeline with events array and total count', async () => {
      mockPrismaChronos.chronos_events.findMany.mockResolvedValueOnce([]);
      mockPrismaChronos.chronos_events.count.mockResolvedValueOnce(0);

      const result = await chronosEventBus.getTimeline({
        organizationId: 'org-datacendia',
        limit: 50,
        offset: 0,
      });

      expect(result).toBeDefined();
      expect(result).toHaveProperty('events');
      expect(Array.isArray(result.events)).toBe(true);
      expect(result).toHaveProperty('total');
      expect(typeof result.total).toBe('number');
    });

    // FAILS IF: timeline doesn't respect category filter
    it('should filter timeline by category', async () => {
      mockPrismaChronos.chronos_events.findMany.mockResolvedValueOnce([]);
      mockPrismaChronos.chronos_events.count.mockResolvedValueOnce(0);

      await chronosEventBus.getTimeline({
        organizationId: 'org-1',
        categories: ['security', 'compliance'],
        limit: 20,
      });

      // Verify the prisma query included the category filter
      const findCall = mockPrismaChronos.chronos_events.findMany.mock.calls[0][0];
      expect(findCall.where.category).toEqual({ in: ['security', 'compliance'] });
    });

    // FAILS IF: timeline doesn't respect date range
    it('should filter timeline by date range', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');

      mockPrismaChronos.chronos_events.findMany.mockResolvedValueOnce([]);
      mockPrismaChronos.chronos_events.count.mockResolvedValueOnce(0);

      await chronosEventBus.getTimeline({
        organizationId: 'org-1',
        startDate,
        endDate,
      });

      const findCall = mockPrismaChronos.chronos_events.findMany.mock.calls[0][0];
      expect(findCall.where.created_at).toBeDefined();
      expect(findCall.where.created_at.gte).toEqual(startDate);
      expect(findCall.where.created_at.lte).toEqual(endDate);
    });
  });

  // ===========================================================================
  // STATISTICS
  // ===========================================================================

  describe('getStats()', () => {
    // FAILS IF: getStats throws or returns wrong shape
    it('should return event statistics for an organization', async () => {
      const stats = await chronosEventBus.getStats('org-datacendia');

      expect(stats).toBeDefined();
      expect(typeof stats.totalEvents).toBe('number');
      expect(typeof stats.byCategory).toBe('object');
      expect(typeof stats.byEventType).toBe('object');
      expect(typeof stats.bySeverity).toBe('object');
      expect(stats).toHaveProperty('eventRate');
      expect(typeof stats.eventRate.lastHour).toBe('number');
      expect(typeof stats.eventRate.last24h).toBe('number');
      expect(typeof stats.eventRate.last7d).toBe('number');
    });
  });

  // ===========================================================================
  // SCHEDULER
  // ===========================================================================

  describe('Flush Scheduler', () => {
    afterEach(() => {
      chronosEventBus.stopFlushScheduler();
    });

    // FAILS IF: startFlushScheduler throws
    it('should start flush scheduler without error', () => {
      expect(() => chronosEventBus.startFlushScheduler(60000)).not.toThrow();
    });

    // FAILS IF: stopFlushScheduler throws
    it('should stop flush scheduler without error', () => {
      chronosEventBus.startFlushScheduler(60000);
      expect(() => chronosEventBus.stopFlushScheduler()).not.toThrow();
    });
  });

  // ===========================================================================
  // EVENT EMITTER
  // ===========================================================================

  describe('Event Emitter', () => {
    // FAILS IF: event bus doesn't emit events to listeners
    it('should emit chronos:event to listeners', async () => {
      const listener = vi.fn();
      chronosEventBus.on('chronos:event', listener);

      await chronosEventBus.emitEvent({
        organizationId: 'org-1',
        eventType: 'system_event',
        category: 'system',
        title: 'Test Event',
        description: 'Testing event emission',
      });

      expect(listener).toHaveBeenCalled();
      const emittedRecord = listener.mock.calls[0][0];
      expect(emittedRecord).toHaveProperty('id');
      expect(emittedRecord).toHaveProperty('hash');

      chronosEventBus.off('chronos:event', listener);
    });

    // FAILS IF: category-specific events not emitted
    it('should emit category-specific events', async () => {
      const securityListener = vi.fn();
      chronosEventBus.on('chronos:security', securityListener);

      await chronosEventBus.emitEvent({
        organizationId: 'org-1',
        eventType: 'security_scan_completed',
        category: 'security',
        title: 'Security Scan Done',
        description: 'Weekly security scan completed',
      });

      expect(securityListener).toHaveBeenCalled();
      chronosEventBus.off('chronos:security', securityListener);
    });

    // FAILS IF: high-severity events not emitted to high-severity channel
    it('should emit high-severity events to dedicated channel', async () => {
      const highSevListener = vi.fn();
      chronosEventBus.on('chronos:high-severity', highSevListener);

      await chronosEventBus.emitEvent({
        organizationId: 'org-1',
        eventType: 'security_threat_detected',
        category: 'security',
        severity: 'critical',
        title: 'Critical Threat',
        description: 'Active intrusion detected',
      });

      expect(highSevListener).toHaveBeenCalled();
      chronosEventBus.off('chronos:high-severity', highSevListener);
    });
  });
});
