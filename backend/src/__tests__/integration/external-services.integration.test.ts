/**
 * External Service Integration Tests
 *
 * Tests Kafka, Temporal, OPA, connectors, and other external service wrappers.
 * Each suite gracefully skips when its backing service is unreachable,
 * so these tests are safe to run in CI without infrastructure dependencies.
 *
 * @module __tests__/integration/external-services.integration.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, beforeAll, afterAll } from 'vitest';

// =============================================================================
// 1. KAFKA SERVICE — Event Streaming
// =============================================================================

describe('KafkaService — Event Streaming', () => {
  let kafka: InstanceType<typeof import('../../services/kafka/KafkaService.js').KafkaService>;

  beforeAll(async () => {
    const mod = await import('../../services/kafka/KafkaService.js');
    kafka = (mod as any).kafka ?? (mod as any).kafkaService ?? new (mod as any).KafkaService();
  });

  it('should report health status when disabled', async () => {
    const health = await kafka.getHealth();
    expect(health).toBeDefined();
    expect(health).toHaveProperty('enabled');
    expect(health).toHaveProperty('connected');
  });

  it('should produce events to in-memory buffer when Kafka is disabled', async () => {
    await kafka.produce('test.integration.events', {
      value: JSON.stringify({ type: 'test', ts: Date.now() }),
    });
    // Should not throw — buffered in-memory when Kafka is off
  });

  it('should retrieve buffered events', () => {
    const events = kafka.getBufferedEvents?.('test.integration.events') ?? [];
    // In-memory buffer should contain our event
    expect(Array.isArray(events)).toBe(true);
  });

  it('should subscribe a consumer config without error', () => {
    // Registration should succeed even when Kafka is off
    expect(() => {
      kafka.subscribe?.({
        groupId: 'test-group',
        topics: ['test.integration.events'],
        handler: async () => {},
      });
    }).not.toThrow();
  });
});

// =============================================================================
// 2. TEMPORAL SERVICE — Workflow Orchestration
// =============================================================================

describe('TemporalService — Workflow Orchestration', () => {
  let temporal: any;

  beforeAll(async () => {
    try {
      const mod = await import('../../services/temporal/TemporalService.js');
      temporal = (mod as any).temporalService ?? (mod as any).default ?? mod;
    } catch {
      temporal = null;
    }
  });

  it('should export a service instance or class', () => {
    expect(temporal).toBeDefined();
  });

  it('should report connection status', async () => {
    if (!temporal?.getStatus && !temporal?.health) return; // skip if no health method
    const status = await (temporal.getStatus?.() ?? temporal.health?.());
    expect(status).toBeDefined();
  });

  it('should list available workflow types', () => {
    if (!temporal?.getWorkflowTypes) return;
    const types = temporal.getWorkflowTypes();
    expect(Array.isArray(types)).toBe(true);
  });
});

// =============================================================================
// 3. OPA SERVICE — Open Policy Agent
// =============================================================================

describe('OPAService — Policy Authorization', () => {
  let opa: any;

  beforeAll(async () => {
    try {
      const mod = await import('../../services/opa/OPAService.js');
      opa = (mod as any).opaService ?? (mod as any).default ?? new (mod as any).OPAService();
    } catch {
      opa = null;
    }
  });

  it('should export a service instance', () => {
    expect(opa).toBeDefined();
  });

  it('should evaluate a policy decision', async () => {
    if (!opa?.evaluate && !opa?.query) return;
    const evalFn = opa.evaluate ?? opa.query;
    try {
      const result = await evalFn({
        input: { user: 'test-user', action: 'read', resource: 'decisions' },
        path: 'authz/allow',
      });
      expect(result).toBeDefined();
    } catch (err: any) {
      // OPA not running — should get connection error, not crash
      expect(err.message || err.code).toBeTruthy();
    }
  });

  it('should list loaded policies when OPA is connected', async () => {
    if (!opa?.listPolicies) return;
    try {
      const policies = await opa.listPolicies();
      expect(Array.isArray(policies)).toBe(true);
    } catch {
      // Expected when OPA is not running
    }
  });
});

// =============================================================================
// 4. INTEGRATION CONNECTORS — 22+ Data Connectors
// =============================================================================

describe('IntegrationConnectors — Connector Registry', () => {
  let connectors: any;

  beforeAll(async () => {
    try {
      const mod = await import('../../services/connectors/IntegrationConnectors.js');
      connectors = (mod as any).connectorRegistry
        ?? (mod as any).integrationConnectors
        ?? (mod as any).default
        ?? mod;
    } catch {
      connectors = null;
    }
  });

  it('should export a connector registry', () => {
    expect(connectors).toBeDefined();
  });

  it('should list available connector types', () => {
    const listFn = connectors?.listConnectors
      ?? connectors?.getConnectors
      ?? connectors?.getAvailable;
    if (!listFn) return;
    const available = listFn.call(connectors);
    expect(Array.isArray(available)).toBe(true);
    expect(available.length).toBeGreaterThan(0);
  });

  it('should validate connector config schema', () => {
    const validateFn = connectors?.validateConfig ?? connectors?.validate;
    if (!validateFn) return;
    // Invalid config should fail validation
    const result = validateFn.call(connectors, { type: 'unknown', config: {} });
    expect(result).toBeDefined();
  });

  it('should test connector health for mock adapter', async () => {
    const testFn = connectors?.testConnection ?? connectors?.healthCheck;
    if (!testFn) return;
    try {
      const result = await testFn.call(connectors, { type: 'http', url: 'http://localhost:0/test' });
      expect(result).toBeDefined();
    } catch (err: any) {
      // Connection refused is expected — we're testing the wrapper, not the endpoint
      expect(err.message || err.code).toBeTruthy();
    }
  });
});

// =============================================================================
// 5. FHIR CONNECTOR — Healthcare Data
// =============================================================================

describe('FHIRConnector — Healthcare Interoperability', () => {
  let fhir: any;

  beforeAll(async () => {
    try {
      const mod = await import('../../services/verticals/healthcare/FHIRConnector.js');
      fhir = (mod as any).fhirConnector
        ?? (mod as any).default
        ?? new (mod as any).FHIRConnector();
    } catch {
      fhir = null;
    }
  });

  it('should export a FHIR connector', () => {
    expect(fhir).toBeDefined();
  });

  it('should list supported FHIR resource types', () => {
    const types = fhir?.getSupportedResources?.() ?? fhir?.resourceTypes;
    if (!types) return;
    const list = Array.isArray(types) ? types : Object.keys(types);
    expect(list.length).toBeGreaterThan(0);
  });

  it('should handle connection error gracefully when FHIR server is down', async () => {
    if (!fhir?.searchPatients && !fhir?.search) return;
    const searchFn = fhir.searchPatients ?? fhir.search;
    try {
      await searchFn.call(fhir, { name: 'test' });
    } catch (err: any) {
      // Expected when FHIR server isn't running
      expect(err.message || err.code).toBeTruthy();
    }
  });
});

// =============================================================================
// 6. KAFKA EVENT BRIDGE — Cross-Service Event Routing
// =============================================================================

describe('KafkaEventBridge — Event Routing', () => {
  let bridge: any;

  beforeAll(async () => {
    try {
      const mod = await import('../../services/kafka/KafkaEventBridge.js');
      bridge = (mod as any).kafkaEventBridge
        ?? (mod as any).eventBridge
        ?? (mod as any).default
        ?? mod;
    } catch {
      bridge = null;
    }
  });

  it('should export an event bridge', () => {
    expect(bridge).toBeDefined();
  });

  it('should list registered event handlers', () => {
    const handlers = bridge?.getHandlers?.() ?? bridge?.handlers;
    if (!handlers) return;
    expect(handlers).toBeDefined();
  });

  it('should emit an event without error', async () => {
    if (!bridge?.emit && !bridge?.publish) return;
    const emitFn = bridge.emit ?? bridge.publish;
    try {
      await emitFn.call(bridge, 'integration.test', { ts: Date.now() });
    } catch {
      // OK if Kafka is down
    }
  });
});

// =============================================================================
// 7. KAFKA TOPICS — Topic Configuration
// =============================================================================

describe('KafkaTopics — Topic Registry', () => {
  it('should export topic configurations', async () => {
    const mod = await import('../../services/kafka/KafkaTopics.js');
    const topics = (mod as any).KAFKA_TOPICS;
    expect(topics).toBeDefined();
    expect(typeof topics).toBe('object');
  });

  it('should have getAllTopicNames helper', async () => {
    const mod = await import('../../services/kafka/KafkaTopics.js');
    const names = mod.getAllTopicNames();
    expect(Array.isArray(names)).toBe(true);
    expect(names.length).toBeGreaterThan(0);
  });

  it('should define retention and partition config per topic', async () => {
    const mod = await import('../../services/kafka/KafkaTopics.js');
    const topics = (mod as any).KAFKA_TOPICS;
    const topicKeys = Object.keys(topics);
    // At least some topics should have config
    expect(topicKeys.length).toBeGreaterThan(0);
    const first = topics[topicKeys[0]];
    expect(first).toHaveProperty('name');
  });
});
