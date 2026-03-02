/**
 * Service — Druid Event Stream
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports druidEventStream, logDecision, logAudit, logAgentMetric, logAlert, DecisionEvent, AuditEvent, AgentMetricEvent
 * @module services/DruidEventStream
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DRUID EVENT STREAM - Real-time Event Ingestion for Analytics
// =============================================================================
// Automatically streams events to Apache Druid for:
// - CendiaChronosÃ¢â€žÂ¢ (decision timeline)
// - CendiaWitnessÃ¢â€žÂ¢ (audit trail)
// - CendiaPulseÃ¢â€žÂ¢ (agent metrics)
// =============================================================================

import { druidService, DRUID_DATASOURCES } from './storage/DruidService';
import { EventEmitter } from 'events';
import { persistServiceRecord, loadServiceRecords } from '../utils/servicePersistence.js';
import { logger } from '../utils/logger.js';

// Event types
export interface DecisionEvent {
  organizationId: string;
  sessionId: string;
  decisionId: string;
  question: string;
  agentsInvolved: string[];
  consensusReached: boolean;
  finalRecommendation: string;
  confidenceScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  deliberationTimeMs: number;
  userAccepted?: boolean | undefined;
  department?: string | undefined;
  tags?: string[] | undefined;
}

export interface AuditEvent {
  organizationId: string;
  eventType: string;
  actorId: string;
  actorType: 'user' | 'agent' | 'system';
  resourceType: string;
  resourceId: string;
  action: string;
  outcome: 'success' | 'failure' | 'pending';
  riskScore?: number;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export interface AgentMetricEvent {
  organizationId: string;
  agentId: string;
  agentRole: string;
  metricName: string;
  metricValue: number;
  modelUsed: string;
  tokensInput: number;
  tokensOutput: number;
  latencyMs: number;
}

export interface AlertEvent {
  organizationId: string;
  alertType: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  description: string;
  source: string;
  metadata?: Record<string, any>;
}

// Singleton event stream
class DruidEventStream extends EventEmitter {
  private isEnabled: boolean = true;
  private batchQueue: Map<string, any[]> = new Map();
  private batchInterval: NodeJS.Timeout | null = null;
  private readonly BATCH_SIZE = 100;
  private readonly BATCH_INTERVAL_MS = 5000; // Flush every 5 seconds

  constructor() {
    super();
    this.initBatching();
    this.setupEventHandlers();

    this.loadFromDB().catch(() => {});
  }

  private initBatching() {
    // Initialize queues for each datasource
    Object.values(DRUID_DATASOURCES).forEach(ds => {
      this.batchQueue.set(ds, []);
    });

    // Start batch flush interval
    this.batchInterval = setInterval(() => {
      this.flushAllBatches();
    }, this.BATCH_INTERVAL_MS);
  }

  private setupEventHandlers() {
    // Listen for events and queue them
    this.on('decision', (event: DecisionEvent) => this.queueDecision(event));
    this.on('audit', (event: AuditEvent) => this.queueAudit(event));
    this.on('metric', (event: AgentMetricEvent) => this.queueMetric(event));
    this.on('alert', (event: AlertEvent) => this.queueAlert(event));
  }

  // ==========================================================================
  // PUBLIC API - Emit events
  // ==========================================================================

  /**
   * Log a decision event (called when deliberation completes)
   */
  logDecision(event: DecisionEvent): void {
    if (!this.isEnabled) return;
    this.emit('decision', event);
  }

  /**
   * Log an audit event (called on user/system actions)
   */
  logAudit(event: AuditEvent): void {
    if (!this.isEnabled) return;
    this.emit('audit', event);
  }

  /**
   * Log an agent metric (called after each agent response)
   */
  logAgentMetric(event: AgentMetricEvent): void {
    if (!this.isEnabled) return;
    this.emit('metric', event);
  }

  /**
   * Log an alert (called when alerts are triggered)
   */
  logAlert(event: AlertEvent): void {
    if (!this.isEnabled) return;
    this.emit('alert', event);
  }

  // ==========================================================================
  // QUEUE MANAGEMENT
  // ==========================================================================

  private queueDecision(event: DecisionEvent) {
    const druidEvent = {
      __time: new Date().toISOString(),
      organization_id: event.organizationId,
      session_id: event.sessionId,
      decision_id: event.decisionId,
      question: event.question,
      agents_involved: event.agentsInvolved.join(','),
      consensus_reached: event.consensusReached,
      final_recommendation: event.finalRecommendation,
      confidence_score: event.confidenceScore,
      risk_level: event.riskLevel,
      deliberation_time_ms: event.deliberationTimeMs,
      user_accepted: event.userAccepted ?? null,
      department: event.department || 'General',
      tags: event.tags?.join(',') || '',
    };

    this.addToQueue(DRUID_DATASOURCES.DECISION_HISTORY, druidEvent);
  }

  private queueAudit(event: AuditEvent) {
    const druidEvent = {
      __time: new Date().toISOString(),
      organization_id: event.organizationId,
      event_type: event.eventType,
      actor_id: event.actorId,
      actor_type: event.actorType,
      resource_type: event.resourceType,
      resource_id: event.resourceId,
      action: event.action,
      outcome: event.outcome,
      risk_score: event.riskScore ?? 0,
      ip_address: event.ipAddress || '',
      user_agent: event.userAgent || '',
      metadata: JSON.stringify(event.metadata || {}),
    };

    this.addToQueue(DRUID_DATASOURCES.AUDIT_EVENTS, druidEvent);
  }

  private queueMetric(event: AgentMetricEvent) {
    const druidEvent = {
      __time: new Date().toISOString(),
      organization_id: event.organizationId,
      agent_id: event.agentId,
      agent_role: event.agentRole,
      metric_name: event.metricName,
      metric_value: event.metricValue,
      model_used: event.modelUsed,
      tokens_input: event.tokensInput,
      tokens_output: event.tokensOutput,
      latency_ms: event.latencyMs,
    };

    this.addToQueue(DRUID_DATASOURCES.AGENT_METRICS, druidEvent);
  }

  private queueAlert(event: AlertEvent) {
    const druidEvent = {
      __time: new Date().toISOString(),
      organization_id: event.organizationId,
      alert_id: `alert_${Date.now()}_${crypto.randomUUID().slice(0, 9)}`,
      alert_type: event.alertType,
      severity: event.severity,
      title: event.title,
      description: event.description,
      source: event.source,
      acknowledged: false,
      resolved: false,
      metadata: JSON.stringify(event.metadata || {}),
    };

    this.addToQueue(DRUID_DATASOURCES.ALERTS, druidEvent);
  }

  private addToQueue(datasource: string, event: any) {
    const queue = this.batchQueue.get(datasource);
    if (queue) {
      queue.push(event);
      
      // Flush if batch size reached
      if (queue.length >= this.BATCH_SIZE) {
        this.flushBatch(datasource);
      }
    }
  }

  private async flushBatch(datasource: string) {
    const queue = this.batchQueue.get(datasource);
    if (!queue || queue.length === 0) return;

    const events = [...queue];
    this.batchQueue.set(datasource, []); // Clear queue

    try {
      const result = await druidService.ingestBatch(datasource, events);
      if (result.failed > 0) {
        console.warn(`[DruidEventStream] ${result.failed}/${events.length} events failed to ingest to ${datasource}`);
      }
    } catch (error) {
      console.error(`[DruidEventStream] Failed to flush batch to ${datasource}:`, error);
      // Re-queue failed events (with limit to prevent infinite growth)
      const currentQueue = this.batchQueue.get(datasource) || [];
      if (currentQueue.length < this.BATCH_SIZE * 5) {
        this.batchQueue.set(datasource, [...events, ...currentQueue]);
      }
    }
  }

  private async flushAllBatches() {
    const datasources = Array.from(this.batchQueue.keys());
    await Promise.all(datasources.map(ds => this.flushBatch(ds)));
  }

  // ==========================================================================
  // LIFECYCLE
  // ==========================================================================

  /**
   * Enable/disable event streaming
   */
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    logger.info(`[DruidEventStream] Event streaming ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Flush all pending events and stop batching
   */
  async shutdown() {
    if (this.batchInterval) {
      clearInterval(this.batchInterval);
      this.batchInterval = null;
    }
    await this.flushAllBatches();
    logger.info('[DruidEventStream] Shutdown complete');
  }

  /**
   * Get queue stats for monitoring
   */
  getStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    this.batchQueue.forEach((queue, datasource) => {
      stats[datasource] = queue.length;
    });
    return stats;
  }


  async loadFromDB(): Promise<void> {

    try {

      let restored = 0;

      const recs = await loadServiceRecords({ serviceName: 'DruidEventStream', recordType: 'record', limit: 1000 });

      for (const rec of recs) {

        const d = rec.data as any;

        if (d?.id && !this.batchQueue.has(d.id)) this.batchQueue.set(d.id, d);

      }

      restored += recs.length;

      if (restored > 0) logger.info(`[DruidEventStream] Restored ${restored} records from database`);

    } catch (err) {

      logger.warn(`[DruidEventStream] DB reload skipped: ${(err as Error).message}`);

    }

  }
}

// Singleton instance
export const druidEventStream = new DruidEventStream();

// Convenience functions for common use cases
export const logDecision = (event: DecisionEvent) => druidEventStream.logDecision(event);
export const logAudit = (event: AuditEvent) => druidEventStream.logAudit(event);
export const logAgentMetric = (event: AgentMetricEvent) => druidEventStream.logAgentMetric(event);
export const logAlert = (event: AlertEvent) => druidEventStream.logAlert(event);

export default druidEventStream;
