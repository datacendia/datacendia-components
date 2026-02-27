// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * KAFKA SERVICE — UNIT TESTS
 * =============================================================================
 * Tests the KafkaService in disabled/in-memory mode (KAFKA_ENABLED=false).
 * Validates: produce, consume, buffering, emit, stats, health, DLQ behavior.
 * =============================================================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Reset env before importing
vi.stubEnv('KAFKA_ENABLED', 'false');

describe('KafkaService (in-memory mode)', () => {
  let kafka: any;

  beforeEach(async () => {
    // Dynamic import to pick up env stub
    const mod = await import('../../services/kafka/KafkaService.js');
    kafka = mod.kafka;
  });

  it('should report as disabled', () => {
    expect(kafka.isEnabled()).toBe(false);
    expect(kafka.isReady()).toBe(false);
  });

  it('should return disabled health status', async () => {
    const health = await kafka.getHealth();
    expect(health.enabled).toBe(false);
    expect(health.connected).toBe(false);
    expect(health.brokerCount).toBe(0);
    expect(health.producerReady).toBe(false);
  });

  it('should produce messages to in-memory buffer', async () => {
    await kafka.produce('test-topic', {
      key: 'key-1',
      value: JSON.stringify({ hello: 'world' }),
    });

    const events = kafka.getBufferedEvents('test-topic');
    expect(events.length).toBeGreaterThanOrEqual(1);
    const last = events[events.length - 1];
    expect(last.topic).toBe('test-topic');
    expect(last.key).toBe('key-1');
    expect(JSON.parse(last.value)).toEqual({ hello: 'world' });
  });

  it('should emit typed JSON events with headers', async () => {
    await kafka.emit('audit-topic', 'decision-123', { action: 'approve' }, { 'x-org': 'test' });

    const events = kafka.getBufferedEvents('audit-topic');
    expect(events.length).toBeGreaterThanOrEqual(1);
    const last = events[events.length - 1];
    expect(JSON.parse(last.value)).toEqual({ action: 'approve' });
    expect(last.headers?.['x-org']).toBe('test');
    expect(last.headers?.['x-source']).toBe('datacendia-platform');
  });

  it('should subscribe to in-memory buffer and receive messages', async () => {
    const received: any[] = [];

    await kafka.subscribe({
      groupId: 'test-group',
      topics: ['sub-topic'],
      handler: async (msg: any) => { received.push(msg); },
    });

    await kafka.produce('sub-topic', { value: 'msg-1' });
    await kafka.produce('sub-topic', { value: 'msg-2' });

    // In-memory consumers are synchronous on produce
    expect(received.length).toBe(2);
    expect(received[0].value).toBe('msg-1');
    expect(received[1].value).toBe('msg-2');
  });

  it('should produce batch messages', async () => {
    await kafka.produceBatch([
      { topic: 'batch-topic', messages: [{ value: 'a' }, { value: 'b' }] },
      { topic: 'batch-topic', messages: [{ value: 'c' }] },
    ]);

    const events = kafka.getBufferedEvents('batch-topic');
    expect(events.length).toBeGreaterThanOrEqual(3);
  });

  it('should track stats correctly', async () => {
    const stats = kafka.getStats();
    expect(stats.enabled).toBe(false);
    expect(stats.connected).toBe(false);
    expect(typeof stats.messagesSent).toBe('number');
    expect(typeof stats.messagesReceived).toBe('number');
    expect(typeof stats.bufferSize).toBe('number');
  });
});
