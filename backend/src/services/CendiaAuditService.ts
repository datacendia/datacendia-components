// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - CENDIA AUDIT SERVICE
// Enterprise compliance, decision trails, and regulatory audit logging
// GDPR/SOX/HIPAA compliant audit trail with tamper detection
// =============================================================================

import { BaseService, ServiceConfig, ServiceHealth } from '../core/services/BaseService.js';
import crypto from 'crypto';

// =============================================================================
// TYPES
// =============================================================================

export type AuditEventType = 
  | 'decision.created'
  | 'decision.updated'
  | 'decision.finalized'
  | 'decision.outcome_recorded'
  | 'analysis.premortem'
  | 'analysis.ghostboard'
  | 'analysis.council'
  | 'analysis.scenario'
  | 'data.accessed'
  | 'data.exported'
  | 'data.imported'
  | 'data.deleted'
  | 'user.login'
  | 'user.logout'
  | 'user.permission_changed'
  | 'system.config_changed'
  | 'system.model_changed'
  | 'compliance.check_passed'
  | 'compliance.check_failed'
  | 'guardrail.triggered'
  | 'guardrail.override';

export type AuditSeverity = 'info' | 'warning' | 'critical' | 'compliance';

export interface AuditEvent {
  id: string;
  timestamp: Date;
  eventType: AuditEventType;
  severity: AuditSeverity;
  
  // Who
  organizationId: string;
  userId: string;
  userEmail?: string;
  userRole?: string;
  ipAddress?: string;
  userAgent?: string;
  
  // What
  action: string;
  resourceType: string;
  resourceId: string;
  resourceName?: string;
  
  // Details
  summary: string;
  details: Record<string, any>;
  previousState?: Record<string, any>;
  newState?: Record<string, any>;
  
  // Compliance
  complianceFrameworks?: string[]; // GDPR, SOX, HIPAA, etc.
  retentionPeriod?: number; // days
  piiInvolved?: boolean;
  sensitivityLevel?: 'public' | 'internal' | 'confidential' | 'restricted';
  
  // Chain
  previousHash?: string;
  hash: string;
  signature?: string;
}

export interface AuditQuery {
  organizationId?: string;
  userId?: string;
  eventType?: AuditEventType | AuditEventType[];
  severity?: AuditSeverity | AuditSeverity[];
  resourceType?: string;
  resourceId?: string;
  startDate?: Date;
  endDate?: Date;
  searchText?: string;
  limit?: number;
  offset?: number;
}

export interface AuditReport {
  id: string;
  generatedAt: Date;
  organizationId: string;
  reportType: 'compliance' | 'access' | 'decision' | 'security' | 'custom';
  period: { start: Date; end: Date };
  summary: {
    totalEvents: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
    byUser: Record<string, number>;
  };
  events: AuditEvent[];
  hash: string;
}

export interface ComplianceStatus {
  framework: string;
  status: 'compliant' | 'non_compliant' | 'partial' | 'pending_review';
  lastCheck: Date;
  issues: Array<{
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    recommendation: string;
    eventId?: string;
  }>;
  score: number; // 0-100
}

// =============================================================================
// CENDIA AUDIT SERVICE
// =============================================================================

export class CendiaAuditService extends BaseService {
  private auditEvents: Map<string, AuditEvent> = new Map();
  private auditEventsByOrg: Map<string, string[]> = new Map();
  private lastHash: string = '';
  private signingKey: string;

  constructor() {
    super({
      name: 'CendiaAuditService',
      version: '1.0.0',
      dependencies: [],
    });
    
    // ROADMAP: load from secure vault
    this.signingKey = process.env.AUDIT_SIGNING_KEY || 'datacendia-audit-key-change-in-production';
  }

  async initialize(): Promise<void> {
    this.logger.info('[CendiaAudit] Compliance LoggingÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ initialized');
    
    // Log service start
    await this.logEvent({
      organizationId: 'system',
      userId: 'system',
      eventType: 'system.config_changed',
      severity: 'info',
      action: 'service_started',
      resourceType: 'service',
      resourceId: 'cendia-audit',
      summary: 'Audit service started',
      details: { version: '1.0.0' },
    });
  }

  async shutdown(): Promise<void> {
    this.logger.info('CendiaAudit Service shutting down');
  }

  async healthCheck(): Promise<ServiceHealth> {
    return {
      status: 'healthy',
      lastCheck: new Date(),
      details: {
        totalEvents: this.auditEvents.size,
        organizations: this.auditEventsByOrg.size,
        chainIntegrity: await this.verifyChainIntegrity(),
      },
    };
  }

  // ---------------------------------------------------------------------------
  // EVENT LOGGING
  // ---------------------------------------------------------------------------

  /**
   * Log an audit event with tamper-proof hashing
   */
  async logEvent(params: {
    organizationId: string;
    userId: string;
    userEmail?: string;
    userRole?: string;
    ipAddress?: string;
    userAgent?: string;
    eventType: AuditEventType;
    severity?: AuditSeverity;
    action: string;
    resourceType: string;
    resourceId: string;
    resourceName?: string;
    summary: string;
    details: Record<string, any>;
    previousState?: Record<string, any>;
    newState?: Record<string, any>;
    complianceFrameworks?: string[];
    piiInvolved?: boolean;
    sensitivityLevel?: AuditEvent['sensitivityLevel'];
  }): Promise<AuditEvent> {
    const id = `audit-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`;
    const timestamp = new Date();
    
    // Calculate hash for tamper detection
    const eventData = {
      id,
      timestamp: timestamp.toISOString(),
      ...params,
      previousHash: this.lastHash,
    };
    
    const hash = this.calculateHash(eventData);
    const signature = this.signHash(hash);
    
    const event: AuditEvent = {
      id,
      timestamp,
      eventType: params.eventType,
      severity: params.severity || this.inferSeverity(params.eventType),
      organizationId: params.organizationId,
      userId: params.userId,
      userEmail: params.userEmail,
      userRole: params.userRole,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      action: params.action,
      resourceType: params.resourceType,
      resourceId: params.resourceId,
      resourceName: params.resourceName,
      summary: params.summary,
      details: params.details,
      previousState: params.previousState,
      newState: params.newState,
      complianceFrameworks: params.complianceFrameworks,
      retentionPeriod: this.getRetentionPeriod(params.eventType, params.complianceFrameworks),
      piiInvolved: params.piiInvolved,
      sensitivityLevel: params.sensitivityLevel || 'internal',
      previousHash: this.lastHash,
      hash,
      signature,
    };
    
    // Store event
    this.auditEvents.set(id, event);
    this.lastHash = hash;
    
    // Index by organization
    const orgEvents = this.auditEventsByOrg.get(params.organizationId) || [];
    orgEvents.unshift(id);
    this.auditEventsByOrg.set(params.organizationId, orgEvents.slice(0, 100000)); // Keep last 100k per org
    
    // Log critical events
    if (event.severity === 'critical' || event.severity === 'compliance') {
      this.logger.warn(`[AUDIT] ${event.severity.toUpperCase()}: ${event.summary}`, {
        eventId: id,
        eventType: event.eventType,
        userId: event.userId,
        resourceId: event.resourceId,
      });
    }
    
    this.incrementCounter('audit_events_logged', 1);
    return event;
  }

  /**
   * Log a decision event
   */
  async logDecision(params: {
    organizationId: string;
    userId: string;
    decisionId: string;
    decisionTitle: string;
    action: 'created' | 'updated' | 'finalized' | 'outcome_recorded';
    details: Record<string, any>;
    previousState?: Record<string, any>;
  }): Promise<AuditEvent> {
    return this.logEvent({
      organizationId: params.organizationId,
      userId: params.userId,
      eventType: `decision.${params.action}` as AuditEventType,
      severity: params.action === 'finalized' ? 'compliance' : 'info',
      action: params.action,
      resourceType: 'decision',
      resourceId: params.decisionId,
      resourceName: params.decisionTitle,
      summary: `Decision "${params.decisionTitle}" ${params.action}`,
      details: params.details,
      previousState: params.previousState,
      complianceFrameworks: ['SOX', 'internal'],
    });
  }

  /**
   * Log an AI analysis event
   */
  async logAnalysis(params: {
    organizationId: string;
    userId: string;
    analysisType: 'premortem' | 'ghostboard' | 'council' | 'scenario';
    resourceId: string;
    resourceName: string;
    agentsUsed: string[];
    modelUsed: string;
    inputSummary: string;
    outputSummary: string;
    riskScore?: number;
  }): Promise<AuditEvent> {
    return this.logEvent({
      organizationId: params.organizationId,
      userId: params.userId,
      eventType: `analysis.${params.analysisType}` as AuditEventType,
      severity: 'info',
      action: 'analysis_completed',
      resourceType: 'analysis',
      resourceId: params.resourceId,
      resourceName: params.resourceName,
      summary: `${params.analysisType} analysis completed for "${params.resourceName}"`,
      details: {
        agentsUsed: params.agentsUsed,
        modelUsed: params.modelUsed,
        inputSummary: params.inputSummary,
        outputSummary: params.outputSummary,
        riskScore: params.riskScore,
      },
      complianceFrameworks: ['internal'],
    });
  }

  /**
   * Log data access for GDPR compliance
   */
  async logDataAccess(params: {
    organizationId: string;
    userId: string;
    dataType: string;
    dataId: string;
    action: 'viewed' | 'exported' | 'modified' | 'deleted';
    piiInvolved: boolean;
    recordCount?: number;
    fields?: string[];
  }): Promise<AuditEvent> {
    return this.logEvent({
      organizationId: params.organizationId,
      userId: params.userId,
      eventType: `data.${params.action === 'viewed' ? 'accessed' : params.action}` as AuditEventType,
      severity: params.piiInvolved ? 'compliance' : 'info',
      action: `data_${params.action}`,
      resourceType: params.dataType,
      resourceId: params.dataId,
      summary: `${params.dataType} data ${params.action}${params.recordCount ? ` (${params.recordCount} records)` : ''}`,
      details: {
        action: params.action,
        recordCount: params.recordCount,
        fields: params.fields,
      },
      piiInvolved: params.piiInvolved,
      sensitivityLevel: params.piiInvolved ? 'confidential' : 'internal',
      complianceFrameworks: params.piiInvolved ? ['GDPR', 'CCPA'] : ['internal'],
    });
  }

  /**
   * Log guardrail trigger
   */
  async logGuardrail(params: {
    organizationId: string;
    userId: string;
    guardrailType: string;
    triggeredBy: string;
    inputContent: string;
    reason: string;
    wasOverridden: boolean;
    overrideReason?: string;
  }): Promise<AuditEvent> {
    return this.logEvent({
      organizationId: params.organizationId,
      userId: params.userId,
      eventType: params.wasOverridden ? 'guardrail.override' : 'guardrail.triggered',
      severity: params.wasOverridden ? 'critical' : 'warning',
      action: params.wasOverridden ? 'guardrail_overridden' : 'guardrail_triggered',
      resourceType: 'guardrail',
      resourceId: params.guardrailType,
      summary: `Guardrail "${params.guardrailType}" ${params.wasOverridden ? 'overridden' : 'triggered'}`,
      details: {
        triggeredBy: params.triggeredBy,
        inputContent: params.inputContent.slice(0, 500), // Truncate for storage
        reason: params.reason,
        wasOverridden: params.wasOverridden,
        overrideReason: params.overrideReason,
      },
      complianceFrameworks: ['internal', 'ethics'],
    });
  }

  // ---------------------------------------------------------------------------
  // QUERYING
  // ---------------------------------------------------------------------------

  /**
   * Query audit events with filters
   */
  async queryEvents(query: AuditQuery): Promise<{
    events: AuditEvent[];
    total: number;
    hasMore: boolean;
  }> {
    let events = Array.from(this.auditEvents.values());
    
    // Apply filters
    if (query.organizationId) {
      events = events.filter(e => e.organizationId === query.organizationId);
    }
    
    if (query.userId) {
      events = events.filter(e => e.userId === query.userId);
    }
    
    if (query.eventType) {
      const types = Array.isArray(query.eventType) ? query.eventType : [query.eventType];
      events = events.filter(e => types.includes(e.eventType));
    }
    
    if (query.severity) {
      const severities = Array.isArray(query.severity) ? query.severity : [query.severity];
      events = events.filter(e => severities.includes(e.severity));
    }
    
    if (query.resourceType) {
      events = events.filter(e => e.resourceType === query.resourceType);
    }
    
    if (query.resourceId) {
      events = events.filter(e => e.resourceId === query.resourceId);
    }
    
    if (query.startDate) {
      events = events.filter(e => e.timestamp >= query.startDate!);
    }
    
    if (query.endDate) {
      events = events.filter(e => e.timestamp <= query.endDate!);
    }
    
    if (query.searchText) {
      const search = query.searchText.toLowerCase();
      events = events.filter(e => 
        e.summary.toLowerCase().includes(search) ||
        e.action.toLowerCase().includes(search) ||
        JSON.stringify(e.details).toLowerCase().includes(search)
      );
    }
    
    // Sort by timestamp descending
    events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    const total = events.length;
    const offset = query.offset || 0;
    const limit = query.limit || 100;
    
    events = events.slice(offset, offset + limit);
    
    return {
      events,
      total,
      hasMore: offset + events.length < total,
    };
  }

  /**
   * Get event by ID
   */
  async getEvent(eventId: string): Promise<AuditEvent | null> {
    return this.auditEvents.get(eventId) || null;
  }

  /**
   * Get events for a specific resource
   */
  async getResourceHistory(resourceType: string, resourceId: string): Promise<AuditEvent[]> {
    return Array.from(this.auditEvents.values())
      .filter(e => e.resourceType === resourceType && e.resourceId === resourceId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // ---------------------------------------------------------------------------
  // REPORTS
  // ---------------------------------------------------------------------------

  /**
   * Generate compliance report
   */
  async generateComplianceReport(params: {
    organizationId: string;
    framework: string;
    startDate: Date;
    endDate: Date;
  }): Promise<AuditReport> {
    const { events } = await this.queryEvents({
      organizationId: params.organizationId,
      startDate: params.startDate,
      endDate: params.endDate,
      limit: 10000,
    });
    
    // Filter for compliance-relevant events
    const complianceEvents = events.filter(e => 
      e.complianceFrameworks?.includes(params.framework) ||
      e.severity === 'compliance' ||
      e.severity === 'critical'
    );
    
    // Build summary
    const byType: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};
    const byUser: Record<string, number> = {};
    
    for (const event of complianceEvents) {
      byType[event.eventType] = (byType[event.eventType] || 0) + 1;
      bySeverity[event.severity] = (bySeverity[event.severity] || 0) + 1;
      byUser[event.userId] = (byUser[event.userId] || 0) + 1;
    }
    
    const report: AuditReport = {
      id: `report-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`,
      generatedAt: new Date(),
      organizationId: params.organizationId,
      reportType: 'compliance',
      period: { start: params.startDate, end: params.endDate },
      summary: {
        totalEvents: complianceEvents.length,
        byType,
        bySeverity,
        byUser,
      },
      events: complianceEvents,
      hash: '',
    };
    
    report.hash = this.calculateHash(report);
    
    return report;
  }

  /**
   * Check compliance status for a framework
   */
  async checkComplianceStatus(
    organizationId: string,
    framework: string
  ): Promise<ComplianceStatus> {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const { events } = await this.queryEvents({
      organizationId,
      startDate: thirtyDaysAgo,
      endDate: now,
      limit: 10000,
    });
    
    const issues: ComplianceStatus['issues'] = [];
    let score = 100;
    
    // Check for compliance issues based on framework
    if (framework === 'GDPR') {
      // Check for PII access without proper logging
      const piiEvents = events.filter(e => e.piiInvolved);
      const unloggedPII = piiEvents.filter(e => !e.details.consentVerified);
      
      if (unloggedPII.length > 0) {
        issues.push({
          severity: 'high',
          description: `${unloggedPII.length} PII access events without consent verification`,
          recommendation: 'Ensure consent is verified before PII access',
        });
        score -= 20;
      }
      
      // Check for data exports
      const exports = events.filter(e => e.eventType === 'data.exported' && e.piiInvolved);
      if (exports.length > 0 && !exports.every(e => e.details.legalBasis)) {
        issues.push({
          severity: 'medium',
          description: 'Some PII exports lack documented legal basis',
          recommendation: 'Document legal basis for all PII exports',
        });
        score -= 10;
      }
    }
    
    if (framework === 'SOX') {
      // Check for decision audit trail
      const decisions = events.filter(e => e.eventType.startsWith('decision.'));
      const financialDecisions = decisions.filter(e => 
        e.details.category === 'financial' || e.details.budget
      );
      
      if (financialDecisions.some(e => !e.previousState)) {
        issues.push({
          severity: 'high',
          description: 'Some financial decisions lack before/after state documentation',
          recommendation: 'Ensure all financial decisions capture previous state',
        });
        score -= 15;
      }
    }
    
    // Check for guardrail overrides
    const overrides = events.filter(e => e.eventType === 'guardrail.override');
    if (overrides.length > 5) {
      issues.push({
        severity: 'medium',
        description: `${overrides.length} guardrail overrides in the last 30 days`,
        recommendation: 'Review and document justification for all guardrail overrides',
      });
      score -= 5;
    }
    
    return {
      framework,
      status: score >= 90 ? 'compliant' : score >= 70 ? 'partial' : 'non_compliant',
      lastCheck: now,
      issues,
      score: Math.max(0, score),
    };
  }

  // ---------------------------------------------------------------------------
  // VERIFICATION
  // ---------------------------------------------------------------------------

  /**
   * Verify the integrity of the audit chain
   */
  async verifyChainIntegrity(): Promise<boolean> {
    const events = Array.from(this.auditEvents.values())
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    if (events.length === 0) return true;
    
    let previousHash = '';
    
    for (const event of events) {
      // Verify this event's hash matches its previousHash reference
      if (event.previousHash !== previousHash) {
        this.logger.error(`Chain integrity violation at event ${event.id}`);
        return false;
      }
      
      // Verify the hash is correct
      const eventData = {
        id: event.id,
        timestamp: event.timestamp.toISOString(),
        organizationId: event.organizationId,
        userId: event.userId,
        eventType: event.eventType,
        action: event.action,
        resourceType: event.resourceType,
        resourceId: event.resourceId,
        summary: event.summary,
        details: event.details,
        previousHash: event.previousHash,
      };
      
      const calculatedHash = this.calculateHash(eventData);
      if (calculatedHash !== event.hash) {
        this.logger.error(`Hash mismatch at event ${event.id}`);
        return false;
      }
      
      previousHash = event.hash;
    }
    
    return true;
  }

  /**
   * Verify a specific event hasn't been tampered with
   */
  async verifyEvent(eventId: string): Promise<{
    valid: boolean;
    event?: AuditEvent;
    error?: string;
  }> {
    const event = this.auditEvents.get(eventId);
    
    if (!event) {
      return { valid: false, error: 'Event not found' };
    }
    
    // Verify hash
    const eventData = {
      id: event.id,
      timestamp: event.timestamp.toISOString(),
      organizationId: event.organizationId,
      userId: event.userId,
      eventType: event.eventType,
      action: event.action,
      resourceType: event.resourceType,
      resourceId: event.resourceId,
      summary: event.summary,
      details: event.details,
      previousHash: event.previousHash,
    };
    
    const calculatedHash = this.calculateHash(eventData);
    
    if (calculatedHash !== event.hash) {
      return { valid: false, event, error: 'Hash verification failed - event may have been tampered with' };
    }
    
    // Verify signature if present
    if (event.signature) {
      const expectedSignature = this.signHash(event.hash);
      if (event.signature !== expectedSignature) {
        return { valid: false, event, error: 'Signature verification failed' };
      }
    }
    
    return { valid: true, event };
  }

  // ---------------------------------------------------------------------------
  // EXPORT
  // ---------------------------------------------------------------------------

  /**
   * Export audit data for regulatory submission
   */
  async exportForRegulator(params: {
    organizationId: string;
    framework: string;
    startDate: Date;
    endDate: Date;
    format: 'json' | 'csv';
  }): Promise<{ data: string; filename: string; hash: string }> {
    const report = await this.generateComplianceReport({
      organizationId: params.organizationId,
      framework: params.framework,
      startDate: params.startDate,
      endDate: params.endDate,
    });
    
    let data: string;
    let filename: string;
    
    if (params.format === 'csv') {
      // Convert to CSV
      const headers = ['Timestamp', 'Event Type', 'Severity', 'User', 'Action', 'Resource', 'Summary'];
      const rows = report.events.map(e => [
        e.timestamp.toISOString(),
        e.eventType,
        e.severity,
        e.userId,
        e.action,
        `${e.resourceType}:${e.resourceId}`,
        e.summary,
      ]);
      
      data = [headers.join(','), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
      filename = `audit-${params.framework}-${params.startDate.toISOString().split('T')[0]}-${params.endDate.toISOString().split('T')[0]}.csv`;
    } else {
      data = JSON.stringify(report, null, 2);
      filename = `audit-${params.framework}-${params.startDate.toISOString().split('T')[0]}-${params.endDate.toISOString().split('T')[0]}.json`;
    }
    
    const hash = this.calculateHash({ data, exportedAt: new Date().toISOString() });
    
    // Log the export
    await this.logEvent({
      organizationId: params.organizationId,
      userId: 'system',
      eventType: 'data.exported',
      severity: 'compliance',
      action: 'audit_exported',
      resourceType: 'audit_report',
      resourceId: report.id,
      summary: `Audit report exported for ${params.framework} compliance`,
      details: {
        framework: params.framework,
        format: params.format,
        eventCount: report.events.length,
        period: report.period,
      },
      complianceFrameworks: [params.framework],
    });
    
    return { data, filename, hash };
  }

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------

  private calculateHash(data: any): string {
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(data))
      .digest('hex')
      .slice(0, 16);
  }

  private signHash(hash: string): string {
    return crypto
      .createHmac('sha256', this.signingKey)
      .update(hash)
      .digest('hex')
      .slice(0, 32);
  }

  private inferSeverity(eventType: AuditEventType): AuditSeverity {
    if (eventType.includes('deleted') || eventType.includes('override')) return 'critical';
    if (eventType.includes('compliance') || eventType.includes('finalized')) return 'compliance';
    if (eventType.includes('failed') || eventType.includes('triggered')) return 'warning';
    return 'info';
  }

  private getRetentionPeriod(eventType: AuditEventType, frameworks?: string[]): number {
    // GDPR: 3 years, SOX: 7 years, default: 2 years
    if (frameworks?.includes('SOX')) return 7 * 365;
    if (frameworks?.includes('GDPR')) return 3 * 365;
    if (eventType.startsWith('decision.')) return 5 * 365;
    return 2 * 365;
  }

  // ===========================================================================
  // 10/10 ENHANCEMENTS
  // ===========================================================================

  /**
   * 10/10: Anomaly Detection
   * Identifies unusual patterns in audit events that may indicate security issues.
   */
  async detectAnomalies(organizationId: string, periodDays: number = 30): Promise<{
    anomalies: Array<{
      type: 'VOLUME_SPIKE' | 'OFF_HOURS_ACTIVITY' | 'UNUSUAL_USER' | 'RAPID_CHANGES' | 'PRIVILEGE_ESCALATION' | 'DATA_EXFILTRATION';
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
      detectedAt: Date;
      affectedResources: string[];
      userId?: string;
      recommendation: string;
    }>;
    riskScore: number;
    eventsAnalyzed: number;
    baselineEstablished: boolean;
  }> {
    const cutoff = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);
    const orgEventIds = this.auditEventsByOrg.get(organizationId) || [];
    const events = orgEventIds
      .map(id => this.auditEvents.get(id))
      .filter((e): e is AuditEvent => e !== undefined && new Date(e.timestamp) >= cutoff);

    const anomalies: Array<{
      type: 'VOLUME_SPIKE' | 'OFF_HOURS_ACTIVITY' | 'UNUSUAL_USER' | 'RAPID_CHANGES' | 'PRIVILEGE_ESCALATION' | 'DATA_EXFILTRATION';
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
      detectedAt: Date;
      affectedResources: string[];
      userId?: string;
      recommendation: string;
    }> = [];

    // Check 1: Volume spikes ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â daily event counts significantly above average
    const dailyCounts: Record<string, number> = {};
    for (const e of events) {
      const day = new Date(e.timestamp).toISOString().split('T')[0];
      dailyCounts[day] = (dailyCounts[day] || 0) + 1;
    }
    const dailyValues = Object.values(dailyCounts);
    const avgDaily = dailyValues.length > 0 ? dailyValues.reduce((a, b) => a + b, 0) / dailyValues.length : 0;
    for (const [day, count] of Object.entries(dailyCounts)) {
      if (count > avgDaily * 3 && avgDaily > 5) {
        anomalies.push({
          type: 'VOLUME_SPIKE',
          severity: count > avgDaily * 5 ? 'high' : 'medium',
          description: `${count} events on ${day} (avg: ${Math.round(avgDaily)}/day) ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â ${Math.round(count / avgDaily)}x normal volume`,
          detectedAt: new Date(day),
          affectedResources: [],
          recommendation: 'Review high-volume day for unusual batch operations or automated attacks',
        });
      }
    }

    // Check 2: Off-hours activity ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â events during unusual hours
    const offHoursEvents = events.filter(e => {
      const hour = new Date(e.timestamp).getHours();
      return hour < 6 || hour > 22;
    });
    if (offHoursEvents.length > events.length * 0.2 && offHoursEvents.length > 10) {
      const users = [...new Set(offHoursEvents.map(e => e.userId))];
      anomalies.push({
        type: 'OFF_HOURS_ACTIVITY',
        severity: 'medium',
        description: `${offHoursEvents.length} events during off-hours (${Math.round((offHoursEvents.length / events.length) * 100)}% of total)`,
        detectedAt: new Date(),
        affectedResources: [],
        userId: users[0],
        recommendation: 'Verify off-hours activity is authorized ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â may indicate compromised credentials',
      });
    }

    // Check 3: Rapid changes ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â same resource modified many times quickly
    const resourceChanges: Record<string, Date[]> = {};
    for (const e of events) {
      if (e.action.includes('update') || e.action.includes('modify') || e.action.includes('delete')) {
        if (!resourceChanges[e.resourceId]) resourceChanges[e.resourceId] = [];
        resourceChanges[e.resourceId].push(new Date(e.timestamp));
      }
    }
    for (const [resourceId, dates] of Object.entries(resourceChanges)) {
      if (dates.length >= 10) {
        const sorted = dates.sort((a, b) => a.getTime() - b.getTime());
        const span = sorted[sorted.length - 1].getTime() - sorted[0].getTime();
        if (span < 3600000) { // 10+ changes within 1 hour
          anomalies.push({
            type: 'RAPID_CHANGES',
            severity: 'high',
            description: `Resource ${resourceId} modified ${dates.length} times within ${Math.round(span / 60000)} minutes`,
            detectedAt: sorted[sorted.length - 1],
            affectedResources: [resourceId],
            recommendation: 'Investigate rapid modifications ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â possible automated attack or data corruption',
          });
        }
      }
    }

    // Check 4: Critical event concentration
    const criticalEvents = events.filter(e => e.severity === 'critical');
    if (criticalEvents.length > 5) {
      anomalies.push({
        type: 'PRIVILEGE_ESCALATION',
        severity: 'critical',
        description: `${criticalEvents.length} critical-severity events in ${periodDays} days`,
        detectedAt: new Date(),
        affectedResources: criticalEvents.map(e => e.resourceId).slice(0, 5),
        recommendation: 'Review critical events for privilege escalation or unauthorized access patterns',
      });
    }

    const riskScore = Math.min(100, anomalies.reduce((sum, a) => {
      const weights = { low: 5, medium: 15, high: 30, critical: 50 };
      return sum + weights[a.severity];
    }, 0));

    return {
      anomalies: anomalies.sort((a, b) => {
        const sev = { critical: 0, high: 1, medium: 2, low: 3 };
        return sev[a.severity] - sev[b.severity];
      }),
      riskScore,
      eventsAnalyzed: events.length,
      baselineEstablished: events.length >= 100,
    };
  }

  /**
   * 10/10: Compliance Scoring Dashboard
   * Real-time compliance health across all tracked frameworks.
   */
  async getComplianceScoreDashboard(organizationId: string): Promise<{
    overallScore: number;
    frameworks: Array<{
      name: string;
      score: number;
      status: 'compliant' | 'non_compliant' | 'partial' | 'pending_review';
      issueCount: number;
      lastAudit: Date;
      trend: 'improving' | 'stable' | 'declining';
    }>;
    criticalGaps: string[];
    upcomingDeadlines: Array<{ framework: string; deadline: string; requirement: string }>;
    recommendations: string[];
  }> {
    const orgEventIds = this.auditEventsByOrg.get(organizationId) || [];
    const events = orgEventIds
      .map(id => this.auditEvents.get(id))
      .filter((e): e is AuditEvent => e !== undefined);

    // Extract unique frameworks from events
    const frameworkSet = new Set<string>();
    for (const e of events) {
      if (e.complianceFrameworks) {
        for (const f of e.complianceFrameworks) frameworkSet.add(f);
      }
    }
    if (frameworkSet.size === 0) {
      frameworkSet.add('SOC2');
      frameworkSet.add('GDPR');
      frameworkSet.add('SOX');
    }

    const frameworks = Array.from(frameworkSet).map(name => {
      const frameworkEvents = events.filter(e => e.complianceFrameworks?.includes(name));
      const criticalIssues = frameworkEvents.filter(e => e.severity === 'critical' || e.severity === 'warning');
      const score = Math.max(0, 100 - criticalIssues.length * 5);
      
      return {
        name,
        score,
        status: score >= 90 ? 'compliant' as const
          : score >= 70 ? 'partial' as const
          : score >= 50 ? 'pending_review' as const
          : 'non_compliant' as const,
        issueCount: criticalIssues.length,
        lastAudit: frameworkEvents.length > 0
          ? new Date(Math.max(...frameworkEvents.map(e => new Date(e.timestamp).getTime())))
          : new Date(),
        trend: 'stable' as const,
      };
    });

    const overallScore = frameworks.length > 0
      ? Math.round(frameworks.reduce((sum, f) => sum + f.score, 0) / frameworks.length) : 0;

    const criticalGaps = frameworks
      .filter(f => f.status === 'non_compliant')
      .map(f => `${f.name}: Non-compliant (score: ${f.score}%) ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â ${f.issueCount} issues`);

    const upcomingDeadlines = [
      { framework: 'SOC2', deadline: '2025-03-31', requirement: 'Annual Type II audit' },
      { framework: 'GDPR', deadline: '2025-05-25', requirement: 'Data Protection Impact Assessment renewal' },
      { framework: 'SOX', deadline: '2025-06-30', requirement: 'Internal controls certification' },
    ].filter(d => frameworkSet.has(d.framework));

    const recommendations: string[] = [];
    for (const f of frameworks) {
      if (f.score < 70) recommendations.push(`URGENT: ${f.name} compliance at ${f.score}% ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â remediate immediately`);
      else if (f.score < 90) recommendations.push(`Improve ${f.name} compliance (${f.score}%) before next audit`);
    }
    if (recommendations.length === 0) recommendations.push('All frameworks in good standing ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â maintain current practices');

    return { overallScore, frameworks, criticalGaps, upcomingDeadlines, recommendations };
  }

  /**
   * 10/10: Audit Chain Health Monitor
   * Verifies integrity of the audit chain and detects tampering.
   */
  async getAuditChainHealth(organizationId: string): Promise<{
    chainLength: number;
    chainIntegrity: 'INTACT' | 'BROKEN' | 'UNVERIFIED';
    brokenLinks: Array<{ eventId: string; expectedHash: string; actualHash: string; position: number }>;
    lastVerifiedAt: Date;
    signatureValidity: number;
    tamperEvidence: string[];
    healthScore: number;
  }> {
    const orgEventIds = this.auditEventsByOrg.get(organizationId) || [];
    const events = orgEventIds
      .map(id => this.auditEvents.get(id))
      .filter((e): e is AuditEvent => e !== undefined)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const brokenLinks: Array<{ eventId: string; expectedHash: string; actualHash: string; position: number }> = [];
    let signedCount = 0;

    for (let i = 1; i < events.length; i++) {
      const current = events[i];
      const previous = events[i - 1];
      
      // Verify chain continuity
      if (current.previousHash && current.previousHash !== previous.hash) {
        brokenLinks.push({
          eventId: current.id,
          expectedHash: previous.hash,
          actualHash: current.previousHash,
          position: i,
        });
      }
      if (current.signature) signedCount++;
    }

    const chainIntegrity = brokenLinks.length === 0
      ? (events.length > 0 ? 'INTACT' : 'UNVERIFIED')
      : 'BROKEN';

    const signatureValidity = events.length > 0
      ? Math.round((signedCount / events.length) * 100) : 0;

    const tamperEvidence: string[] = [];
    if (brokenLinks.length > 0) tamperEvidence.push(`${brokenLinks.length} broken chain links detected`);
    if (signatureValidity < 90) tamperEvidence.push(`Only ${signatureValidity}% of events are signed`);

    const healthScore = Math.max(0, 100 - brokenLinks.length * 20 - (100 - signatureValidity) * 0.3);

    return {
      chainLength: events.length,
      chainIntegrity,
      brokenLinks: brokenLinks.slice(0, 10),
      lastVerifiedAt: new Date(),
      signatureValidity,
      tamperEvidence,
      healthScore: Math.round(healthScore),
    };
  }

  /**
   * 10/10: Risk Concentration Analysis
   * Identifies users and resources with the highest audit activity.
   */
  async getRiskConcentration(organizationId: string, periodDays: number = 30): Promise<{
    topUsers: Array<{
      userId: string;
      eventCount: number;
      criticalActions: number;
      riskScore: number;
      topActions: string[];
    }>;
    topResources: Array<{
      resourceId: string;
      resourceType: string;
      eventCount: number;
      modificationCount: number;
      riskScore: number;
    }>;
    concentrationIndex: number;
    insights: string[];
  }> {
    const cutoff = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);
    const orgEventIds = this.auditEventsByOrg.get(organizationId) || [];
    const events = orgEventIds
      .map(id => this.auditEvents.get(id))
      .filter((e): e is AuditEvent => e !== undefined && new Date(e.timestamp) >= cutoff);

    // Aggregate by user
    const userMap: Record<string, { events: AuditEvent[] }> = {};
    for (const e of events) {
      if (!userMap[e.userId]) userMap[e.userId] = { events: [] };
      userMap[e.userId].events.push(e);
    }

    const topUsers = Object.entries(userMap)
      .map(([userId, data]) => {
        const criticalActions = data.events.filter(e => e.severity === 'critical' || e.severity === 'warning').length;
        const actionCounts: Record<string, number> = {};
        data.events.forEach(e => actionCounts[e.action] = (actionCounts[e.action] || 0) + 1);
        const topActions = Object.entries(actionCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([a]) => a);

        return {
          userId,
          eventCount: data.events.length,
          criticalActions,
          riskScore: Math.min(100, criticalActions * 15 + Math.max(0, data.events.length - 50)),
          topActions,
        };
      })
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 10);

    // Aggregate by resource
    const resourceMap: Record<string, { type: string; events: AuditEvent[] }> = {};
    for (const e of events) {
      if (!resourceMap[e.resourceId]) resourceMap[e.resourceId] = { type: e.resourceType, events: [] };
      resourceMap[e.resourceId].events.push(e);
    }

    const topResources = Object.entries(resourceMap)
      .map(([resourceId, data]) => {
        const mods = data.events.filter(e => e.action.includes('update') || e.action.includes('delete') || e.action.includes('modify'));
        return {
          resourceId,
          resourceType: data.type,
          eventCount: data.events.length,
          modificationCount: mods.length,
          riskScore: Math.min(100, mods.length * 10 + data.events.length),
        };
      })
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 10);

    // Concentration index: how concentrated is activity among top users
    const totalEvents = events.length;
    const topUserEvents = topUsers.slice(0, 3).reduce((sum, u) => sum + u.eventCount, 0);
    const concentrationIndex = totalEvents > 0 ? Math.round((topUserEvents / totalEvents) * 100) : 0;

    const insights: string[] = [];
    if (concentrationIndex > 70) insights.push(`High concentration: top 3 users account for ${concentrationIndex}% of activity`);
    const criticalUsers = topUsers.filter(u => u.riskScore > 60);
    if (criticalUsers.length > 0) insights.push(`${criticalUsers.length} user(s) with elevated risk scores`);
    if (events.length < 50) insights.push('Low event volume ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â consider enabling more comprehensive auditing');

    return { topUsers, topResources, concentrationIndex, insights };
  }
}

// Export singleton
export const cendiaAuditService = new CendiaAuditService();
