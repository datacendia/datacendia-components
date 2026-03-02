/**
 * Service — Chronos Event Bus
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports recordChronosEvent, chronosEventBus, ChronosEvent, ChronosEventRecord, ChronosTimelineQuery, ChronosTimelineResult, ChronosStats, ChronosEventType
 * @module services/ChronosEventBus
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA CHRONOS™ - UNIVERSAL EVENT BUS
// "Every action leaves a trace. Every trace tells a story."
//
// Central event recording service that all platform services emit to.
// Provides a single, unified, tamper-evident timeline of everything
// that happens on the platform.
// =============================================================================

import { EventEmitter } from 'events';
import crypto from 'crypto';
import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';

// =============================================================================
// TYPES
// =============================================================================

export type ChronosEventType =
  | 'deliberation_started'
  | 'deliberation_completed'
  | 'deliberation_cancelled'
  | 'agent_response'
  | 'decision_outcome_linked'
  | 'decision_outcome_success'
  | 'decision_outcome_failure'
  | 'echo_collection_scheduled'
  | 'echo_collection_completed'
  | 'echo_collection_failed'
  | 'agent_weight_adjusted'
  | 'veto_triggered'
  | 'veto_override'
  | 'dissent_filed'
  | 'dissent_resolved'
  | 'alert_triggered'
  | 'alert_resolved'
  | 'compliance_violation'
  | 'compliance_check_passed'
  | 'health_incident_started'
  | 'health_incident_resolved'
  | 'health_check_failed'
  | 'security_threat_detected'
  | 'security_scan_completed'
  | 'collapse_test_started'
  | 'collapse_test_completed'
  | 'ghost_board_session'
  | 'pre_mortem_analysis'
  | 'metric_threshold_breach'
  | 'metric_value_changed'
  | 'data_source_connected'
  | 'data_source_sync_failed'
  | 'agent_config_changed'
  | 'user_login'
  | 'snapshot_created'
  | 'report_generated'
  | 'system_event';

export type ChronosCategory =
  | 'council'
  | 'echo'
  | 'governance'
  | 'security'
  | 'data'
  | 'system'
  | 'compliance'
  | 'health';

export type ChronosSeverity = 'info' | 'low' | 'medium' | 'high' | 'critical';
export type ChronosImpact = 'positive' | 'negative' | 'neutral' | 'critical';

export interface ChronosEvent {
  organizationId: string;
  eventType: ChronosEventType;
  category: ChronosCategory;
  severity?: ChronosSeverity;
  title: string;
  description: string;
  actor?: string;
  actorType?: 'user' | 'agent' | 'system' | 'scheduler';
  resourceType?: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  impact?: ChronosImpact;
  magnitude?: number; // 0-10
  parentEventId?: string;
}

export interface ChronosEventRecord extends ChronosEvent {
  id: string;
  hash: string;
  createdAt: Date;
}

export interface ChronosTimelineQuery {
  organizationId: string;
  startDate?: Date;
  endDate?: Date;
  eventTypes?: ChronosEventType[];
  categories?: ChronosCategory[];
  severities?: ChronosSeverity[];
  resourceType?: string;
  resourceId?: string;
  actor?: string;
  minMagnitude?: number;
  limit?: number;
  offset?: number;
  includeHistorical?: boolean; // Also query legacy tables
}

export interface ChronosTimelineResult {
  events: ChronosEventRecord[];
  total: number;
  query: {
    startDate?: Date;
    endDate?: Date;
    filters: string[];
  };
}

export interface ChronosStats {
  totalEvents: number;
  byCategory: Record<string, number>;
  byEventType: Record<string, number>;
  bySeverity: Record<string, number>;
  recentHighSeverity: ChronosEventRecord[];
  eventRate: {
    lastHour: number;
    last24h: number;
    last7d: number;
  };
}

// =============================================================================
// CHRONOS EVENT BUS
// =============================================================================

class ChronosEventBus extends EventEmitter {
  private lastEventHash: string = 'GENESIS';
  private writeQueue: ChronosEvent[] = [];
  private flushInterval: ReturnType<typeof setInterval> | null = null;
  private isProcessing = false;

  constructor() {
    super();
    this.setMaxListeners(100); // Many services will subscribe
  }

  // =========================================================================
  // EVENT RECORDING
  // =========================================================================

  /**
   * Record a platform event to the Chronos timeline.
   * This is the primary method all services should call.
   */
  async emitEvent(event: ChronosEvent): Promise<string> {
    try {
      const record = await this.persistEvent(event);
      // Emit to any real-time listeners (WebSocket, dashboards, etc.)
      this.emit('chronos:event', record);
      this.emit(`chronos:${event.category}`, record);
      this.emit(`chronos:${event.eventType}`, record);

      if (event.severity === 'critical' || event.severity === 'high') {
        this.emit('chronos:high-severity', record);
      }

      return record.id;
    } catch (error) {
      logger.error('[Chronos] Failed to record event:', { error, event: event.title });
      // Queue for retry
      this.writeQueue.push(event);
      return '';
    }
  }

  /**
   * Record an event — fire and forget (non-blocking).
   * Use this when you don't need to await the result.
   */
  record(event: ChronosEvent): void {
    this.persistEvent(event).catch(err =>
      logger.error('[Chronos] Background record failed:', err)
    );
  }

  /**
   * Batch record multiple events at once.
   */
  async recordBatch(events: ChronosEvent[]): Promise<number> {
    let recorded = 0;
    for (const event of events) {
      try {
        await this.persistEvent(event);
        recorded++;
      } catch (error) {
        logger.error('[Chronos] Batch record failed for event:', { title: event.title });
      }
    }
    return recorded;
  }

  // =========================================================================
  // TIMELINE QUERIES
  // =========================================================================

  /**
   * Query the full platform timeline with comprehensive filtering.
   */
  async getTimeline(query: ChronosTimelineQuery): Promise<ChronosTimelineResult> {
    const {
      organizationId,
      startDate,
      endDate,
      eventTypes,
      categories,
      severities,
      resourceType,
      resourceId,
      actor,
      minMagnitude,
      limit = 100,
      offset = 0,
      includeHistorical = true,
    } = query;

    // Build Prisma where clause
    const where: any = { organization_id: organizationId };

    if (startDate) where.created_at = { ...(where.created_at || {}), gte: startDate };
    if (endDate) where.created_at = { ...(where.created_at || {}), lte: endDate };
    if (eventTypes && eventTypes.length > 0) where.event_type = { in: eventTypes };
    if (categories && categories.length > 0) where.category = { in: categories };
    if (severities && severities.length > 0) where.severity = { in: severities };
    if (resourceType) where.resource_type = resourceType;
    if (resourceId) where.resource_id = resourceId;
    if (actor) where.actor = actor;
    if (minMagnitude !== undefined) where.magnitude = { gte: minMagnitude };

    const [events, total] = await Promise.all([
      prisma.chronos_events.findMany({
        where,
        orderBy: { created_at: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.chronos_events.count({ where }),
    ]);

    let allEvents: ChronosEventRecord[] = events.map((e: any) => ({
      id: e.id,
      organizationId: e.organization_id,
      eventType: e.event_type as ChronosEventType,
      category: e.category as ChronosCategory,
      severity: e.severity as ChronosSeverity,
      title: e.title,
      description: e.description,
      actor: e.actor || undefined,
      actorType: e.actor_type as any || undefined,
      resourceType: e.resource_type || undefined,
      resourceId: e.resource_id || undefined,
      metadata: e.metadata as Record<string, unknown>,
      impact: e.impact as ChronosImpact || undefined,
      magnitude: e.magnitude,
      parentEventId: e.parent_event_id || undefined,
      hash: e.hash || '',
      createdAt: e.created_at,
    }));

    // If includeHistorical, also pull from legacy tables (for events before the bus was active)
    if (includeHistorical && offset === 0) {
      const historical = await this.aggregateHistoricalEvents(organizationId, startDate, endDate, limit);
      // Merge and deduplicate by resource_id
      const existingResourceIds = new Set(allEvents.map(e => e.resourceId).filter(Boolean));
      let newHistorical = historical.filter(h => !existingResourceIds.has(h.resourceId));
      // Apply query filters to historical events
      if (eventTypes && eventTypes.length > 0) newHistorical = newHistorical.filter(h => eventTypes.includes(h.eventType));
      if (categories && categories.length > 0) newHistorical = newHistorical.filter(h => categories.includes(h.category));
      if (severities && severities.length > 0) newHistorical = newHistorical.filter(h => severities.includes(h.severity || 'info'));
      if (resourceType) newHistorical = newHistorical.filter(h => h.resourceType === resourceType);
      if (resourceId) newHistorical = newHistorical.filter(h => h.resourceId === resourceId);
      if (actor) newHistorical = newHistorical.filter(h => h.actor === actor);
      if (minMagnitude !== undefined) newHistorical = newHistorical.filter(h => (h.magnitude || 0) >= minMagnitude);
      allEvents = [...allEvents, ...newHistorical]
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, limit);
    }

    const filters: string[] = [];
    if (eventTypes) filters.push(`types: ${eventTypes.join(',')}`);
    if (categories) filters.push(`categories: ${categories.join(',')}`);
    if (severities) filters.push(`severities: ${severities.join(',')}`);
    if (resourceType) filters.push(`resource: ${resourceType}`);
    if (actor) filters.push(`actor: ${actor}`);

    return {
      events: allEvents,
      total: total + (includeHistorical ? allEvents.length - events.length : 0),
      query: { startDate, endDate, filters },
    };
  }

  /**
   * Get platform-wide timeline stats.
   */
  async getStats(organizationId: string): Promise<ChronosStats> {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const baseWhere = { organization_id: organizationId };

    const [
      totalEvents,
      lastHourCount,
      last24hCount,
      last7dCount,
      categoryGroups,
      typeGroups,
      severityGroups,
      recentHigh,
    ] = await Promise.all([
      prisma.chronos_events.count({ where: baseWhere }),
      prisma.chronos_events.count({ where: { ...baseWhere, created_at: { gte: oneHourAgo } } }),
      prisma.chronos_events.count({ where: { ...baseWhere, created_at: { gte: oneDayAgo } } }),
      prisma.chronos_events.count({ where: { ...baseWhere, created_at: { gte: oneWeekAgo } } }),
      prisma.chronos_events.groupBy({ by: ['category'], where: baseWhere, _count: true }),
      prisma.chronos_events.groupBy({ by: ['event_type'], where: baseWhere, _count: true }),
      prisma.chronos_events.groupBy({ by: ['severity'], where: baseWhere, _count: true }),
      prisma.chronos_events.findMany({
        where: { ...baseWhere, severity: { in: ['high', 'critical'] } },
        orderBy: { created_at: 'desc' },
        take: 10,
      }),
    ]);

    return {
      totalEvents,
      byCategory: Object.fromEntries(categoryGroups.map((g: any) => [g.category, g._count])),
      byEventType: Object.fromEntries(typeGroups.map((g: any) => [g.event_type, g._count])),
      bySeverity: Object.fromEntries(severityGroups.map((g: any) => [g.severity, g._count])),
      recentHighSeverity: recentHigh.map((e: any) => ({
        id: e.id,
        organizationId: e.organization_id,
        eventType: e.event_type as ChronosEventType,
        category: e.category as ChronosCategory,
        severity: e.severity as ChronosSeverity,
        title: e.title,
        description: e.description,
        actor: e.actor || undefined,
        actorType: e.actor_type as any || undefined,
        resourceType: e.resource_type || undefined,
        resourceId: e.resource_id || undefined,
        metadata: e.metadata as Record<string, unknown>,
        impact: e.impact as ChronosImpact || undefined,
        magnitude: e.magnitude,
        parentEventId: e.parent_event_id || undefined,
        hash: e.hash || '',
        createdAt: e.created_at,
      })),
      eventRate: {
        lastHour: lastHourCount,
        last24h: last24hCount,
        last7d: last7dCount,
      },
    };
  }

  // =========================================================================
  // HISTORICAL AGGREGATION — Pull from all legacy tables
  // =========================================================================

  private async aggregateHistoricalEvents(
    organizationId: string,
    startDate?: Date,
    endDate?: Date,
    limit: number = 50,
  ): Promise<ChronosEventRecord[]> {
    const events: ChronosEventRecord[] = [];
    const dateFilter: any = {};
    if (startDate) dateFilter.gte = startDate;
    if (endDate) dateFilter.lte = endDate;
    const dateWhere = Object.keys(dateFilter).length > 0 ? dateFilter : undefined;
    const perTableLimit = Math.ceil(limit / 10); // Distribute across tables

    // 1. DELIBERATIONS (council decisions)
    try {
      const deliberations = await prisma.deliberations.findMany({
        where: {
          organization_id: organizationId,
          ...(dateWhere ? { created_at: dateWhere } : {}),
        },
        orderBy: { created_at: 'desc' },
        take: perTableLimit,
      });
      for (const d of deliberations) {
        events.push(this.toRecord({
          organizationId,
          eventType: d.status === 'COMPLETED' ? 'deliberation_completed' : 'deliberation_started',
          category: 'council',
          severity: 'info',
          title: `Council Deliberation: ${d.question?.substring(0, 60) || 'Unknown'}`,
          description: `Mode: ${d.mode || 'standard'} | Status: ${d.status}`,
          resourceType: 'deliberation',
          resourceId: d.id,
          impact: 'neutral',
          magnitude: 6,
          metadata: { status: d.status, mode: d.mode },
        }, d.created_at));
      }
    } catch (e) { logger.debug('[Chronos] Historical: deliberations query skipped'); }

    // 2. DECISION OUTCOMES (Echo)
    try {
      const outcomes = await prisma.decision_outcomes.findMany({
        where: {
          organization_id: organizationId,
          ...(dateWhere ? { created_at: dateWhere } : {}),
        },
        orderBy: { created_at: 'desc' },
        take: perTableLimit,
      });
      for (const o of outcomes) {
        const dollarImpact = o.dollar_impact?.toNumber() || 0;
        events.push(this.toRecord({
          organizationId,
          eventType: o.status === 'success' ? 'decision_outcome_success' : o.status === 'failure' ? 'decision_outcome_failure' : 'decision_outcome_linked',
          category: 'echo',
          severity: o.status === 'failure' ? 'high' : 'info',
          title: `Echo Outcome: ${o.decision_title?.substring(0, 60) || 'Unknown'}`,
          description: `Status: ${o.status} | Dollar Impact: $${dollarImpact.toLocaleString()} | ROI: ${o.roi?.toNumber()?.toFixed(2) || 'N/A'}`,
          resourceType: 'decision_outcome',
          resourceId: o.id,
          impact: dollarImpact > 0 ? 'positive' : dollarImpact < 0 ? 'negative' : 'neutral',
          magnitude: Math.min(10, Math.ceil(Math.abs(dollarImpact) / 100000)),
          metadata: { status: o.status, dollarImpact, deliberationId: o.deliberation_id },
        }, o.created_at));
      }
    } catch (e) { logger.debug('[Chronos] Historical: decision_outcomes query skipped'); }

    // 3. AGENT WEIGHT ADJUSTMENTS
    try {
      const weights = await prisma.agent_weight_history.findMany({
        where: {
          organization_id: organizationId,
          ...(dateWhere ? { created_at: dateWhere } : {}),
        },
        orderBy: { created_at: 'desc' },
        take: perTableLimit,
      });
      for (const w of weights) {
        const adj = w.adjustment.toNumber();
        events.push(this.toRecord({
          organizationId,
          eventType: 'agent_weight_adjusted',
          category: 'echo',
          severity: Math.abs(adj) > 0.03 ? 'medium' : 'low',
          title: `Agent Weight: ${w.agent_role} ${adj > 0 ? '↑' : '↓'} ${Math.abs(adj).toFixed(4)}`,
          description: `${w.previous_weight.toNumber().toFixed(4)} → ${w.new_weight.toNumber().toFixed(4)} | ${w.reason}`,
          actorType: 'system',
          resourceType: 'agent',
          resourceId: w.agent_id,
          impact: adj > 0 ? 'positive' : 'negative',
          magnitude: Math.min(10, Math.ceil(Math.abs(adj) * 100)),
          metadata: { previousWeight: w.previous_weight.toNumber(), newWeight: w.new_weight.toNumber(), adjustment: adj },
        }, w.created_at));
      }
    } catch (e) { logger.debug('[Chronos] Historical: agent_weight_history query skipped'); }

    // 4. VETO EVENTS
    try {
      const vetos = await prisma.veto_events.findMany({
        where: {
          organization_id: organizationId,
          ...(dateWhere ? { created_at: dateWhere } : {}),
        },
        orderBy: { created_at: 'desc' },
        take: perTableLimit,
      });
      for (const v of vetos) {
        events.push(this.toRecord({
          organizationId,
          eventType: 'veto_triggered',
          category: 'governance',
          severity: 'high',
          title: `Veto Triggered: ${v.reason?.substring(0, 60) || 'Rule violation'}`,
          description: `Rule: ${v.rule_id} | Target: ${v.target_type} (${v.target_id})`,
          resourceType: 'veto',
          resourceId: v.id,
          impact: 'critical',
          magnitude: 8,
          metadata: { ruleId: v.rule_id, targetType: v.target_type, targetId: v.target_id },
        }, v.created_at));
      }
    } catch (e) { logger.debug('[Chronos] Historical: veto_events query skipped'); }

    // 5. DISSENTS
    try {
      const dissents = await prisma.dissents.findMany({
        where: {
          organization_id: organizationId,
          ...(dateWhere ? { created_at: dateWhere } : {}),
        },
        orderBy: { created_at: 'desc' },
        take: perTableLimit,
      });
      for (const d of dissents) {
        events.push(this.toRecord({
          organizationId,
          eventType: d.status === 'accepted' || d.status === 'overruled' ? 'dissent_resolved' : 'dissent_filed',
          category: 'governance',
          severity: d.severity === 'blocking' ? 'critical' : d.severity === 'formal_objection' ? 'high' : 'medium',
          title: `Dissent: ${d.statement?.substring(0, 60) || 'Formal objection'}`,
          description: `Type: ${d.dissent_type} | Severity: ${d.severity} | Status: ${d.status} | Decision: ${d.decision_title?.substring(0, 40)}`,
          actor: d.dissenter_id,
          actorType: 'user',
          resourceType: 'dissent',
          resourceId: d.id,
          impact: 'negative',
          magnitude: d.severity === 'blocking' ? 9 : d.severity === 'formal_objection' ? 7 : 5,
          metadata: { dissentType: d.dissent_type, severity: d.severity, status: d.status, decisionId: d.decision_id },
        }, d.created_at));
      }
    } catch (e) { logger.debug('[Chronos] Historical: dissents query skipped'); }

    // 6. ALERTS
    try {
      const alerts = await prisma.alerts.findMany({
        where: {
          organization_id: organizationId,
          ...(dateWhere ? { created_at: dateWhere } : {}),
        },
        orderBy: { created_at: 'desc' },
        take: perTableLimit,
      });
      for (const a of alerts) {
        events.push(this.toRecord({
          organizationId,
          eventType: a.status === 'RESOLVED' ? 'alert_resolved' : 'alert_triggered',
          category: 'data',
          severity: a.severity === 'CRITICAL' ? 'critical' : a.severity === 'WARNING' ? 'medium' : 'low',
          title: `Alert: ${a.title || a.message?.substring(0, 60) || 'System alert'}`,
          description: a.message || '',
          resourceType: 'alert',
          resourceId: a.id,
          impact: a.severity === 'CRITICAL' ? 'critical' : 'negative',
          magnitude: a.severity === 'CRITICAL' ? 9 : a.severity === 'WARNING' ? 6 : 3,
          metadata: { severity: a.severity, status: a.status, metricId: a.metric_id },
        }, a.created_at));
      }
    } catch (e) { logger.debug('[Chronos] Historical: alerts query skipped'); }

    // 7. GHOST BOARD SESSIONS
    try {
      const sessions = await prisma.ghost_board_sessions.findMany({
        where: {
          organization_id: organizationId,
          ...(dateWhere ? { created_at: dateWhere } : {}),
        },
        orderBy: { created_at: 'desc' },
        take: perTableLimit,
      });
      for (const s of sessions) {
        events.push(this.toRecord({
          organizationId,
          eventType: 'ghost_board_session',
          category: 'council',
          severity: 'info',
          title: `Ghost Board: ${s.title?.substring(0, 60) || 'Board rehearsal'}`,
          description: `Scenario: ${s.scenario?.substring(0, 100) || 'N/A'}`,
          resourceType: 'ghost_board',
          resourceId: s.id,
          impact: 'neutral',
          magnitude: 5,
        }, s.created_at));
      }
    } catch (e) { logger.debug('[Chronos] Historical: ghost_board_sessions query skipped'); }

    // 8. PRE-MORTEM ANALYSES
    try {
      const analyses = await prisma.pre_mortem_analyses.findMany({
        where: {
          organization_id: organizationId,
          ...(dateWhere ? { created_at: dateWhere } : {}),
        },
        orderBy: { created_at: 'desc' },
        take: perTableLimit,
      });
      for (const a of analyses) {
        events.push(this.toRecord({
          organizationId,
          eventType: 'pre_mortem_analysis',
          category: 'council',
          severity: 'medium',
          title: `Pre-Mortem: ${a.title?.substring(0, 60) || 'Risk analysis'}`,
          description: `Failure modes identified for decision analysis`,
          resourceType: 'pre_mortem',
          resourceId: a.id,
          impact: 'neutral',
          magnitude: 6,
        }, a.created_at));
      }
    } catch (e) { logger.debug('[Chronos] Historical: pre_mortem_analyses query skipped'); }

    // 9. HEALTH INCIDENTS
    try {
      const incidents = await prisma.health_incidents.findMany({
        where: {
          organization_id: organizationId,
          ...(dateWhere ? { started_at: dateWhere } : {}),
        },
        orderBy: { started_at: 'desc' },
        take: perTableLimit,
      });
      for (const i of incidents) {
        events.push(this.toRecord({
          organizationId,
          eventType: i.resolved_at ? 'health_incident_resolved' : 'health_incident_started',
          category: 'health',
          severity: i.severity === 'CRITICAL' ? 'critical' : i.severity === 'HIGH' ? 'high' : 'medium',
          title: `Incident: ${i.title?.substring(0, 60) || 'System incident'}`,
          description: i.description || '',
          resourceType: 'health_incident',
          resourceId: i.id,
          impact: 'negative',
          magnitude: i.severity === 'CRITICAL' ? 10 : i.severity === 'HIGH' ? 8 : 5,
          metadata: { severity: i.severity, status: i.status, affectedComponents: i.affected_components },
        }, i.started_at));
      }
    } catch (e) { logger.debug('[Chronos] Historical: health_incidents query skipped'); }

    // 10. CHRONOS SNAPSHOTS
    try {
      const snapshots = await prisma.chronos_snapshots.findMany({
        where: {
          organization_id: organizationId,
          ...(dateWhere ? { created_at: dateWhere } : {}),
        },
        orderBy: { created_at: 'desc' },
        take: perTableLimit,
      });
      for (const s of snapshots) {
        events.push(this.toRecord({
          organizationId,
          eventType: 'snapshot_created',
          category: 'system',
          severity: 'info',
          title: `Snapshot: ${s.name}`,
          description: `Type: ${s.snapshot_type}`,
          actor: s.created_by,
          actorType: 'user',
          resourceType: 'snapshot',
          resourceId: s.id,
          impact: 'neutral',
          magnitude: 3,
        }, s.created_at));
      }
    } catch (e) { logger.debug('[Chronos] Historical: chronos_snapshots query skipped'); }

    // 11. AUDIT LOGS
    try {
      const auditLogs = await prisma.audit_logs.findMany({
        where: {
          organization_id: organizationId,
          ...(dateWhere ? { created_at: dateWhere } : {}),
        },
        orderBy: { created_at: 'desc' },
        take: perTableLimit,
      });
      for (const log of auditLogs) {
        events.push(this.toRecord({
          organizationId,
          eventType: 'system_event',
          category: 'system',
          severity: 'info',
          title: `Audit: ${log.action}`,
          description: `Resource: ${log.resource_type}${log.resource_id ? ` (${log.resource_id})` : ''}`,
          actor: log.user_id || undefined,
          actorType: log.user_id ? 'user' : 'system',
          resourceType: log.resource_type,
          resourceId: log.resource_id || undefined,
          impact: 'neutral',
          magnitude: 2,
          metadata: log.details as Record<string, unknown>,
        }, log.created_at));
      }
    } catch (e) { logger.debug('[Chronos] Historical: audit_logs query skipped'); }

    // 12. ECHO COLLECTION JOBS
    try {
      const jobs = await prisma.echo_collection_jobs.findMany({
        where: {
          organization_id: organizationId,
          ...(dateWhere ? { created_at: dateWhere } : {}),
        },
        orderBy: { created_at: 'desc' },
        take: perTableLimit,
      });
      for (const j of jobs) {
        events.push(this.toRecord({
          organizationId,
          eventType: j.status === 'completed' ? 'echo_collection_completed' : j.status === 'failed' ? 'echo_collection_failed' : 'echo_collection_scheduled',
          category: 'echo',
          severity: j.status === 'failed' ? 'high' : 'info',
          title: `Echo Collection: ${j.decision_title?.substring(0, 50) || 'Outcome collection'}`,
          description: `Status: ${j.status} | Scheduled: ${j.scheduled_collection_date.toISOString().split('T')[0]}`,
          actorType: 'scheduler',
          resourceType: 'collection_job',
          resourceId: j.id,
          impact: j.status === 'failed' ? 'negative' : 'neutral',
          magnitude: j.status === 'failed' ? 6 : 3,
          metadata: { status: j.status, deliberationId: j.deliberation_id },
        }, j.created_at));
      }
    } catch (e) { logger.debug('[Chronos] Historical: echo_collection_jobs query skipped'); }

    return events.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // =========================================================================
  // BACKFILL — One-time migration of historical data into chronos_events
  // =========================================================================

  /**
   * Backfill chronos_events from all historical tables.
   * Safe to run multiple times — deduplicates by resource_type + resource_id.
   */
  async backfill(organizationId: string): Promise<{ total: number; inserted: number; skipped: number }> {
    logger.info('[Chronos] Starting historical backfill for org:', organizationId);
    const historical = await this.aggregateHistoricalEvents(organizationId, undefined, undefined, 10000);

    let inserted = 0;
    let skipped = 0;

    for (const event of historical) {
      // Check if already exists
      const existing = await prisma.chronos_events.findFirst({
        where: {
          organization_id: organizationId,
          resource_type: event.resourceType || '',
          resource_id: event.resourceId || '',
        },
      });

      if (existing) {
        skipped++;
        continue;
      }

      await prisma.chronos_events.create({
        data: {
          id: event.id,
          organization_id: organizationId,
          event_type: event.eventType,
          category: event.category,
          severity: event.severity || 'info',
          title: event.title,
          description: event.description,
          actor: event.actor,
          actor_type: event.actorType,
          resource_type: event.resourceType,
          resource_id: event.resourceId,
          metadata: event.metadata as any || {},
          impact: event.impact,
          magnitude: event.magnitude || 0,
          parent_event_id: event.parentEventId,
          hash: event.hash,
          created_at: event.createdAt,
        },
      });
      inserted++;
    }

    logger.info('[Chronos] Backfill complete:', { total: historical.length, inserted, skipped });
    return { total: historical.length, inserted, skipped };
  }

  // =========================================================================
  // FLUSH QUEUE — Process any events that failed initial write
  // =========================================================================

  startFlushScheduler(intervalMs: number = 30000): void {
    if (this.flushInterval) return;
    this.flushInterval = setInterval(() => this.flushQueue(), intervalMs);
    logger.info('[Chronos] Flush scheduler started');
  }

  stopFlushScheduler(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
  }

  private async flushQueue(): Promise<void> {
    if (this.isProcessing || this.writeQueue.length === 0) return;
    this.isProcessing = true;

    const batch = this.writeQueue.splice(0, 50);
    let retryQueue: ChronosEvent[] = [];

    for (const event of batch) {
      try {
        await this.persistEvent(event);
      } catch {
        retryQueue.push(event);
      }
    }

    this.writeQueue.unshift(...retryQueue);
    this.isProcessing = false;
  }

  // =========================================================================
  // PRIVATE — Event persistence and hashing
  // =========================================================================

  private async persistEvent(event: ChronosEvent): Promise<ChronosEventRecord> {
    const id = crypto.randomUUID();
    const timestamp = new Date();

    // Build tamper-evident hash chain
    const hashPayload = JSON.stringify({
      id,
      previousHash: this.lastEventHash,
      eventType: event.eventType,
      title: event.title,
      organizationId: event.organizationId,
      timestamp: timestamp.toISOString(),
    });
    const hash = crypto.createHash('sha256').update(hashPayload).digest('hex');
    this.lastEventHash = hash;

    const record = await prisma.chronos_events.create({
      data: {
        id,
        organization_id: event.organizationId,
        event_type: event.eventType,
        category: event.category,
        severity: event.severity || 'info',
        title: event.title,
        description: event.description,
        actor: event.actor,
        actor_type: event.actorType,
        resource_type: event.resourceType,
        resource_id: event.resourceId,
        metadata: event.metadata as any || {},
        impact: event.impact,
        magnitude: event.magnitude || 0,
        parent_event_id: event.parentEventId,
        hash,
        created_at: timestamp,
      },
    });

    return {
      id: record.id,
      organizationId: record.organization_id,
      eventType: record.event_type as ChronosEventType,
      category: record.category as ChronosCategory,
      severity: record.severity as ChronosSeverity,
      title: record.title,
      description: record.description,
      actor: record.actor || undefined,
      actorType: record.actor_type as any || undefined,
      resourceType: record.resource_type || undefined,
      resourceId: record.resource_id || undefined,
      metadata: record.metadata as Record<string, unknown>,
      impact: record.impact as ChronosImpact || undefined,
      magnitude: record.magnitude,
      parentEventId: record.parent_event_id || undefined,
      hash,
      createdAt: record.created_at,
    };
  }

  /**
   * Convert a ChronosEvent into a ChronosEventRecord with a given timestamp.
   * Used by historical aggregation (no DB write).
   */
  private toRecord(event: ChronosEvent, createdAt: Date): ChronosEventRecord {
    const id = crypto.randomUUID();
    const hash = crypto.createHash('sha256').update(
      JSON.stringify({ id, eventType: event.eventType, title: event.title, createdAt: createdAt.toISOString() })
    ).digest('hex');

    return {
      ...event,
      id,
      severity: event.severity || 'info',
      magnitude: event.magnitude || 0,
      hash,
      createdAt,
    };
  }
}

// =============================================================================
// SINGLETON + CONVENIENCE HELPERS
// =============================================================================

export const chronosEventBus = new ChronosEventBus();

/**
 * Convenience function for services to record a Chronos event.
 * Fire-and-forget — does not block the calling service.
 */
export function recordChronosEvent(event: ChronosEvent): void {
  chronosEventBus.record(event);
}

export { ChronosEventBus };
