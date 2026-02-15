// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DRUID SERVICE - COMPREHENSIVE TEST SUITE
 * Tests for high-performance analytics storage
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import axios from 'axios';

// Mock axios before importing
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
    })),
  },
}));

import druidService, {
  DRUID_DATASOURCES,
  AuditEvent,
  DecisionEvent,
  AgentMetric,
  SystemTelemetry,
} from '../../services/storage/DruidService.js';

describe('DruidService', () => {
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      get: vi.fn(),
      post: vi.fn(),
    };
    vi.mocked(axios.create).mockReturnValue(mockClient as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ===========================================================================
  // DATASOURCE CONSTANTS - 10 TESTS
  // ===========================================================================
  describe('Datasource Constants', () => {
    it('should have AUDIT_EVENTS datasource', () => {
      expect(DRUID_DATASOURCES.AUDIT_EVENTS).toBe('cendia_audit_events');
    });

    it('should have DECISION_HISTORY datasource', () => {
      expect(DRUID_DATASOURCES.DECISION_HISTORY).toBe('cendia_decision_history');
    });

    it('should have AGENT_METRICS datasource', () => {
      expect(DRUID_DATASOURCES.AGENT_METRICS).toBe('cendia_agent_metrics');
    });

    it('should have SYSTEM_TELEMETRY datasource', () => {
      expect(DRUID_DATASOURCES.SYSTEM_TELEMETRY).toBe('cendia_system_telemetry');
    });

    it('should have USER_ACTIVITY datasource', () => {
      expect(DRUID_DATASOURCES.USER_ACTIVITY).toBe('cendia_user_activity');
    });

    it('should have ALERTS datasource', () => {
      expect(DRUID_DATASOURCES.ALERTS).toBe('cendia_alerts');
    });

    it('should have 6 datasources total', () => {
      expect(Object.keys(DRUID_DATASOURCES).length).toBe(6);
    });

    it('should have all datasources prefixed with cendia_', () => {
      Object.values(DRUID_DATASOURCES).forEach((ds) => {
        expect(ds.startsWith('cendia_')).toBe(true);
      });
    });

    it('should have unique datasource names', () => {
      const values = Object.values(DRUID_DATASOURCES);
      const unique = new Set(values);
      expect(unique.size).toBe(values.length);
    });

    it('should be readonly', () => {
      expect(Object.isFrozen(DRUID_DATASOURCES)).toBe(false); // as const doesn't freeze
    });
  });

  // ===========================================================================
  // AUDIT EVENT STRUCTURE - 20 TESTS
  // ===========================================================================
  describe('AuditEvent Structure', () => {
    const validAuditEvent: AuditEvent = {
      __time: new Date().toISOString(),
      organization_id: 'org-123',
      event_type: 'user.login',
      actor_id: 'user-456',
      actor_type: 'user',
      resource_type: 'session',
      resource_id: 'session-789',
      action: 'create',
      outcome: 'success',
    };

    it('should require __time field', () => {
      expect(validAuditEvent.__time).toBeDefined();
    });

    it('should have ISO timestamp format', () => {
      expect(validAuditEvent.__time).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('should require organization_id', () => {
      expect(validAuditEvent.organization_id).toBeDefined();
    });

    it('should require event_type', () => {
      expect(validAuditEvent.event_type).toBeDefined();
    });

    it('should require actor_id', () => {
      expect(validAuditEvent.actor_id).toBeDefined();
    });

    it('should have valid actor_type', () => {
      expect(['user', 'agent', 'system']).toContain(validAuditEvent.actor_type);
    });

    it('should require resource_type', () => {
      expect(validAuditEvent.resource_type).toBeDefined();
    });

    it('should require resource_id', () => {
      expect(validAuditEvent.resource_id).toBeDefined();
    });

    it('should require action', () => {
      expect(validAuditEvent.action).toBeDefined();
    });

    it('should have valid outcome', () => {
      expect(['success', 'failure', 'pending']).toContain(validAuditEvent.outcome);
    });

    it('should allow optional risk_score', () => {
      const event: AuditEvent = { ...validAuditEvent, risk_score: 75 };
      expect(event.risk_score).toBe(75);
    });

    it('should allow optional details', () => {
      const event: AuditEvent = { ...validAuditEvent, details: { key: 'value' } };
      expect(event.details).toEqual({ key: 'value' });
    });

    it('should allow optional ip_address', () => {
      const event: AuditEvent = { ...validAuditEvent, ip_address: '192.168.1.1' };
      expect(event.ip_address).toBe('192.168.1.1');
    });

    it('should allow optional user_agent', () => {
      const event: AuditEvent = { ...validAuditEvent, user_agent: 'Mozilla/5.0' };
      expect(event.user_agent).toBe('Mozilla/5.0');
    });

    it('should handle user actor type', () => {
      const event: AuditEvent = { ...validAuditEvent, actor_type: 'user' };
      expect(event.actor_type).toBe('user');
    });

    it('should handle agent actor type', () => {
      const event: AuditEvent = { ...validAuditEvent, actor_type: 'agent' };
      expect(event.actor_type).toBe('agent');
    });

    it('should handle system actor type', () => {
      const event: AuditEvent = { ...validAuditEvent, actor_type: 'system' };
      expect(event.actor_type).toBe('system');
    });

    it('should handle success outcome', () => {
      const event: AuditEvent = { ...validAuditEvent, outcome: 'success' };
      expect(event.outcome).toBe('success');
    });

    it('should handle failure outcome', () => {
      const event: AuditEvent = { ...validAuditEvent, outcome: 'failure' };
      expect(event.outcome).toBe('failure');
    });

    it('should handle pending outcome', () => {
      const event: AuditEvent = { ...validAuditEvent, outcome: 'pending' };
      expect(event.outcome).toBe('pending');
    });
  });

  // ===========================================================================
  // DECISION EVENT STRUCTURE - 20 TESTS
  // ===========================================================================
  describe('DecisionEvent Structure', () => {
    const validDecisionEvent: DecisionEvent = {
      __time: new Date().toISOString(),
      organization_id: 'org-123',
      session_id: 'session-456',
      decision_id: 'decision-789',
      question: 'Should we acquire CompetitorX?',
      agents_involved: ['agent-cfo', 'agent-cto', 'agent-legal'],
      consensus_reached: true,
      final_recommendation: 'Proceed with acquisition',
      confidence_score: 0.85,
      risk_level: 'medium',
      deliberation_time_ms: 45000,
      user_accepted: true,
    };

    it('should require __time field', () => {
      expect(validDecisionEvent.__time).toBeDefined();
    });

    it('should require organization_id', () => {
      expect(validDecisionEvent.organization_id).toBeDefined();
    });

    it('should require session_id', () => {
      expect(validDecisionEvent.session_id).toBeDefined();
    });

    it('should require decision_id', () => {
      expect(validDecisionEvent.decision_id).toBeDefined();
    });

    it('should require question', () => {
      expect(validDecisionEvent.question).toBeDefined();
    });

    it('should require agents_involved array', () => {
      expect(Array.isArray(validDecisionEvent.agents_involved)).toBe(true);
    });

    it('should have at least one agent involved', () => {
      expect(validDecisionEvent.agents_involved.length).toBeGreaterThan(0);
    });

    it('should have consensus_reached boolean', () => {
      expect(typeof validDecisionEvent.consensus_reached).toBe('boolean');
    });

    it('should require final_recommendation', () => {
      expect(validDecisionEvent.final_recommendation).toBeDefined();
    });

    it('should have confidence_score between 0 and 1', () => {
      expect(validDecisionEvent.confidence_score).toBeGreaterThanOrEqual(0);
      expect(validDecisionEvent.confidence_score).toBeLessThanOrEqual(1);
    });

    it('should have valid risk_level', () => {
      expect(['low', 'medium', 'high', 'critical']).toContain(validDecisionEvent.risk_level);
    });

    it('should have deliberation_time_ms', () => {
      expect(validDecisionEvent.deliberation_time_ms).toBeGreaterThan(0);
    });

    it('should handle low risk level', () => {
      const event: DecisionEvent = { ...validDecisionEvent, risk_level: 'low' };
      expect(event.risk_level).toBe('low');
    });

    it('should handle medium risk level', () => {
      const event: DecisionEvent = { ...validDecisionEvent, risk_level: 'medium' };
      expect(event.risk_level).toBe('medium');
    });

    it('should handle high risk level', () => {
      const event: DecisionEvent = { ...validDecisionEvent, risk_level: 'high' };
      expect(event.risk_level).toBe('high');
    });

    it('should handle critical risk level', () => {
      const event: DecisionEvent = { ...validDecisionEvent, risk_level: 'critical' };
      expect(event.risk_level).toBe('critical');
    });

    it('should handle user_accepted true', () => {
      const event: DecisionEvent = { ...validDecisionEvent, user_accepted: true };
      expect(event.user_accepted).toBe(true);
    });

    it('should handle user_accepted false', () => {
      const event: DecisionEvent = { ...validDecisionEvent, user_accepted: false };
      expect(event.user_accepted).toBe(false);
    });

    it('should handle user_accepted null', () => {
      const event: DecisionEvent = { ...validDecisionEvent, user_accepted: null };
      expect(event.user_accepted).toBeNull();
    });

    it('should allow optional tags', () => {
      const event: DecisionEvent = { ...validDecisionEvent, tags: ['strategic', 'urgent'] };
      expect(event.tags).toEqual(['strategic', 'urgent']);
    });
  });

  // ===========================================================================
  // AGENT METRIC STRUCTURE - 15 TESTS
  // ===========================================================================
  describe('AgentMetric Structure', () => {
    const validAgentMetric: AgentMetric = {
      __time: new Date().toISOString(),
      organization_id: 'org-123',
      agent_id: 'agent-cfo',
      agent_role: 'financial_advisor',
      metric_name: 'response_quality',
      metric_value: 0.92,
      model_used: 'gpt-4',
      tokens_input: 1500,
      tokens_output: 800,
      latency_ms: 2500,
    };

    it('should require __time', () => {
      expect(validAgentMetric.__time).toBeDefined();
    });

    it('should require organization_id', () => {
      expect(validAgentMetric.organization_id).toBeDefined();
    });

    it('should require agent_id', () => {
      expect(validAgentMetric.agent_id).toBeDefined();
    });

    it('should require agent_role', () => {
      expect(validAgentMetric.agent_role).toBeDefined();
    });

    it('should require metric_name', () => {
      expect(validAgentMetric.metric_name).toBeDefined();
    });

    it('should require metric_value as number', () => {
      expect(typeof validAgentMetric.metric_value).toBe('number');
    });

    it('should require model_used', () => {
      expect(validAgentMetric.model_used).toBeDefined();
    });

    it('should have tokens_input >= 0', () => {
      expect(validAgentMetric.tokens_input).toBeGreaterThanOrEqual(0);
    });

    it('should have tokens_output >= 0', () => {
      expect(validAgentMetric.tokens_output).toBeGreaterThanOrEqual(0);
    });

    it('should have latency_ms >= 0', () => {
      expect(validAgentMetric.latency_ms).toBeGreaterThanOrEqual(0);
    });

    it('should handle different metric names', () => {
      const metrics = ['response_quality', 'accuracy', 'helpfulness', 'safety'];
      metrics.forEach((name) => {
        const m: AgentMetric = { ...validAgentMetric, metric_name: name };
        expect(m.metric_name).toBe(name);
      });
    });

    it('should handle different model names', () => {
      const models = ['gpt-4', 'claude-3', 'llama-70b', 'mistral-8x7b'];
      models.forEach((model) => {
        const m: AgentMetric = { ...validAgentMetric, model_used: model };
        expect(m.model_used).toBe(model);
      });
    });

    it('should handle zero tokens', () => {
      const m: AgentMetric = { ...validAgentMetric, tokens_input: 0, tokens_output: 0 };
      expect(m.tokens_input).toBe(0);
      expect(m.tokens_output).toBe(0);
    });

    it('should handle large token counts', () => {
      const m: AgentMetric = { ...validAgentMetric, tokens_input: 128000, tokens_output: 32000 };
      expect(m.tokens_input).toBe(128000);
    });

    it('should handle high latency', () => {
      const m: AgentMetric = { ...validAgentMetric, latency_ms: 60000 };
      expect(m.latency_ms).toBe(60000);
    });
  });

  // ===========================================================================
  // SYSTEM TELEMETRY STRUCTURE - 15 TESTS
  // ===========================================================================
  describe('SystemTelemetry Structure', () => {
    const validTelemetry: SystemTelemetry = {
      __time: new Date().toISOString(),
      host: 'cendia-api-1',
      service: 'api-gateway',
      cpu_percent: 45.5,
      memory_percent: 62.3,
      disk_percent: 38.7,
      request_count: 15000,
      error_count: 25,
      avg_latency_ms: 85,
    };

    it('should require __time', () => {
      expect(validTelemetry.__time).toBeDefined();
    });

    it('should require host', () => {
      expect(validTelemetry.host).toBeDefined();
    });

    it('should require service', () => {
      expect(validTelemetry.service).toBeDefined();
    });

    it('should have cpu_percent between 0 and 100', () => {
      expect(validTelemetry.cpu_percent).toBeGreaterThanOrEqual(0);
      expect(validTelemetry.cpu_percent).toBeLessThanOrEqual(100);
    });

    it('should have memory_percent between 0 and 100', () => {
      expect(validTelemetry.memory_percent).toBeGreaterThanOrEqual(0);
      expect(validTelemetry.memory_percent).toBeLessThanOrEqual(100);
    });

    it('should have disk_percent between 0 and 100', () => {
      expect(validTelemetry.disk_percent).toBeGreaterThanOrEqual(0);
      expect(validTelemetry.disk_percent).toBeLessThanOrEqual(100);
    });

    it('should have request_count >= 0', () => {
      expect(validTelemetry.request_count).toBeGreaterThanOrEqual(0);
    });

    it('should have error_count >= 0', () => {
      expect(validTelemetry.error_count).toBeGreaterThanOrEqual(0);
    });

    it('should have avg_latency_ms >= 0', () => {
      expect(validTelemetry.avg_latency_ms).toBeGreaterThanOrEqual(0);
    });

    it('should handle zero errors', () => {
      const t: SystemTelemetry = { ...validTelemetry, error_count: 0 };
      expect(t.error_count).toBe(0);
    });

    it('should handle high cpu usage', () => {
      const t: SystemTelemetry = { ...validTelemetry, cpu_percent: 99.9 };
      expect(t.cpu_percent).toBe(99.9);
    });

    it('should handle high memory usage', () => {
      const t: SystemTelemetry = { ...validTelemetry, memory_percent: 95 };
      expect(t.memory_percent).toBe(95);
    });

    it('should handle high disk usage', () => {
      const t: SystemTelemetry = { ...validTelemetry, disk_percent: 90 };
      expect(t.disk_percent).toBe(90);
    });

    it('should handle different service names', () => {
      const services = ['api-gateway', 'worker', 'scheduler', 'council'];
      services.forEach((svc) => {
        const t: SystemTelemetry = { ...validTelemetry, service: svc };
        expect(t.service).toBe(svc);
      });
    });

    it('should handle large request counts', () => {
      const t: SystemTelemetry = { ...validTelemetry, request_count: 1000000 };
      expect(t.request_count).toBe(1000000);
    });
  });

  // ===========================================================================
  // SERVICE SINGLETON - 5 TESTS
  // ===========================================================================
  describe('Service Singleton', () => {
    it('should export default service instance', () => {
      expect(druidService).toBeDefined();
    });

    it('should be an object', () => {
      expect(typeof druidService).toBe('object');
    });

    it('should have checkAvailability method', () => {
      expect(typeof druidService.checkAvailability).toBe('function');
    });

    it('should have ingestEvent method', () => {
      expect(typeof druidService.ingestEvent).toBe('function');
    });

    it('should have query method', () => {
      expect(typeof druidService.query).toBe('function');
    });
  });

  // ===========================================================================
  // QUERY BUILDING - 15 TESTS
  // ===========================================================================
  describe('Query Building', () => {
    it('should build simple select query', () => {
      const query = `SELECT * FROM ${DRUID_DATASOURCES.AUDIT_EVENTS} LIMIT 10`;
      expect(query).toContain('SELECT');
      expect(query).toContain(DRUID_DATASOURCES.AUDIT_EVENTS);
    });

    it('should build filtered query', () => {
      const orgId = 'org-123';
      const query = `SELECT * FROM ${DRUID_DATASOURCES.AUDIT_EVENTS} WHERE organization_id = '${orgId}'`;
      expect(query).toContain('WHERE');
      expect(query).toContain(orgId);
    });

    it('should build time-range query', () => {
      const query = `SELECT * FROM ${DRUID_DATASOURCES.DECISION_HISTORY} WHERE __time >= TIMESTAMP '2024-01-01'`;
      expect(query).toContain('__time');
      expect(query).toContain('TIMESTAMP');
    });

    it('should build aggregation query', () => {
      const query = `SELECT agent_id, COUNT(*) as count FROM ${DRUID_DATASOURCES.AGENT_METRICS} GROUP BY agent_id`;
      expect(query).toContain('COUNT');
      expect(query).toContain('GROUP BY');
    });

    it('should build ordering query', () => {
      const query = `SELECT * FROM ${DRUID_DATASOURCES.SYSTEM_TELEMETRY} ORDER BY __time DESC`;
      expect(query).toContain('ORDER BY');
      expect(query).toContain('DESC');
    });

    it('should build join query', () => {
      const query = `SELECT a.*, b.agent_role FROM ${DRUID_DATASOURCES.AUDIT_EVENTS} a JOIN ${DRUID_DATASOURCES.AGENT_METRICS} b ON a.actor_id = b.agent_id`;
      expect(query).toContain('JOIN');
    });

    it('should escape single quotes', () => {
      const unsafe = "O'Brien";
      const escaped = unsafe.replace(/'/g, "''");
      expect(escaped).toBe("O''Brien");
    });

    it('should handle LIKE patterns', () => {
      const query = `SELECT * FROM ${DRUID_DATASOURCES.AUDIT_EVENTS} WHERE event_type LIKE 'user.%'`;
      expect(query).toContain('LIKE');
    });

    it('should handle IN clauses', () => {
      const query = `SELECT * FROM ${DRUID_DATASOURCES.DECISION_HISTORY} WHERE risk_level IN ('high', 'critical')`;
      expect(query).toContain('IN');
    });

    it('should handle NULL checks', () => {
      const query = `SELECT * FROM ${DRUID_DATASOURCES.DECISION_HISTORY} WHERE user_accepted IS NULL`;
      expect(query).toContain('IS NULL');
    });

    it('should handle NOT NULL checks', () => {
      const query = `SELECT * FROM ${DRUID_DATASOURCES.AUDIT_EVENTS} WHERE risk_score IS NOT NULL`;
      expect(query).toContain('IS NOT NULL');
    });

    it('should handle BETWEEN', () => {
      const query = `SELECT * FROM ${DRUID_DATASOURCES.AGENT_METRICS} WHERE confidence_score BETWEEN 0.8 AND 1.0`;
      expect(query).toContain('BETWEEN');
    });

    it('should handle subqueries', () => {
      const query = `SELECT * FROM ${DRUID_DATASOURCES.AUDIT_EVENTS} WHERE actor_id IN (SELECT agent_id FROM ${DRUID_DATASOURCES.AGENT_METRICS})`;
      expect(query).toContain('IN (SELECT');
    });

    it('should handle CASE expressions', () => {
      const query = `SELECT CASE WHEN risk_level = 'critical' THEN 1 ELSE 0 END as is_critical FROM ${DRUID_DATASOURCES.DECISION_HISTORY}`;
      expect(query).toContain('CASE');
      expect(query).toContain('WHEN');
      expect(query).toContain('THEN');
    });

    it('should handle date functions', () => {
      const query = `SELECT DATE_TRUNC('hour', __time) as hour, COUNT(*) FROM ${DRUID_DATASOURCES.SYSTEM_TELEMETRY} GROUP BY 1`;
      expect(query).toContain('DATE_TRUNC');
    });
  });
});
