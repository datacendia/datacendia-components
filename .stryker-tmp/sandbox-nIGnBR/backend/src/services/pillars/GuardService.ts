// @ts-nocheck
// =============================================================================
// DATACENDIA PLATFORM - THE GUARD SERVICE
// Security Posture - Security controls and compliance monitoring
// Enterprise Platinum Intelligence - PostgreSQL Persistent Storage
// =============================================================================

import { PrismaClient, Prisma } from '@prisma/client';
import { BaseService, ServiceConfig, ServiceHealth } from '../../core/services/BaseService.js';

const prisma = new PrismaClient();

// =============================================================================
// TYPES
// =============================================================================

export type ComplianceStatus = 'compliant' | 'in_progress' | 'non_compliant' | 'not_applicable';
export type ThreatSeverity = 'critical' | 'high' | 'medium' | 'low';
export type ThreatStatus = 'active' | 'investigating' | 'mitigated' | 'resolved';

export interface SecurityPosture {
  organizationId: string;
  securityScore: number;
  openVulnerabilities: number;
  complianceScore: number;
  daysSinceIncident: number;
  frameworks: ComplianceFramework[];
  threats: ThreatEvent[];
  lastAssessment: Date;
}

export interface ComplianceFramework {
  id: string;
  name: string;
  status: ComplianceStatus;
  totalControls: number;
  implementedControls: number;
  lastAudit?: Date;
  nextAudit?: Date;
}

export interface ThreatEvent {
  id: string;
  organizationId: string;
  type: string;
  severity: ThreatSeverity;
  status: ThreatStatus;
  source: string;
  description: string;
  detectedAt: Date;
  resolvedAt?: Date;
  affectedAssets?: string[];
  mitigationSteps?: string[];
}

export interface SecurityPolicy {
  id: string;
  organizationId: string;
  name: string;
  category: string;
  enabled: boolean;
  lastUpdated: Date;
  violations: number;
}

export interface AuditLogEntry {
  id: string;
  organizationId: string;
  userId: string;
  action: string;
  resource: string;
  result: 'success' | 'failure' | 'denied';
  ipAddress: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

// Type mappings
const threatTypeMap: Record<string, string> = {
  'Anomalous Login': 'INSIDER_THREAT', 'Unusual Data Access': 'DATA_EXFILTRATION',
  'Intrusion': 'INTRUSION', 'Malware': 'MALWARE', 'Policy Violation': 'POLICY_VIOLATION'
};
const severityMap: Record<ThreatSeverity, string> = { critical: 'CRITICAL', high: 'HIGH', medium: 'MEDIUM', low: 'LOW' };
const reverseSeverityMap: Record<string, ThreatSeverity> = { CRITICAL: 'critical', HIGH: 'high', MEDIUM: 'medium', LOW: 'low', INFO: 'low' };
const statusMap: Record<ThreatStatus, string> = { active: 'ACTIVE', investigating: 'INVESTIGATING', mitigated: 'MITIGATED', resolved: 'RESOLVED' };
const reverseStatusMap: Record<string, ThreatStatus> = { ACTIVE: 'active', INVESTIGATING: 'investigating', CONTAINED: 'mitigated', MITIGATED: 'mitigated', RESOLVED: 'resolved', FALSE_POSITIVE: 'resolved' };

// =============================================================================
// THE GUARD SERVICE - PRISMA BACKED
// =============================================================================

export class GuardService extends BaseService {
  constructor(config?: Partial<ServiceConfig>) {
    super({
      name: 'guard-service',
      version: '2.0.0',
      dependencies: ['prisma'],
      ...config,
    });
  }

  async initialize(): Promise<void> {
    this.logger.info('The Guard service initializing with PostgreSQL...');
  }

  async shutdown(): Promise<void> {
    this.logger.info('The Guard service shutting down...');
  }

  async healthCheck(): Promise<ServiceHealth> {
    const activeThreats = await prisma.security_threats.count({ where: { status: 'ACTIVE' } });
    const activePolicies = await prisma.security_policies.count({ where: { enabled: true } });
    return {
      status: 'healthy',
      lastCheck: new Date(),
      details: { activeThreats, activePolicies },
    };
  }

  // ===========================================================================
  // SECURITY POSTURE - PRISMA BACKED
  // ===========================================================================

  async getSecurityPosture(organizationId: string): Promise<SecurityPosture> {
    const threats = await this.getThreats(organizationId, false);
    const policies = await this.getPolicies(organizationId);
    
    // Calculate scores from real data
    const enabledPolicies = policies.filter(p => p.enabled).length;
    const complianceScore = policies.length > 0 ? Math.round((enabledPolicies / policies.length) * 100) : 0;
    const securityScore = Math.max(0, 100 - (threats.length * 10));

    // Get last resolved threat for days since incident
    const lastIncident = await prisma.security_threats.findFirst({
      where: { organization_id: organizationId, status: 'RESOLVED' },
      orderBy: { resolved_at: 'desc' },
    });
    const daysSinceIncident = lastIncident?.resolved_at
      ? Math.floor((Date.now() - lastIncident.resolved_at.getTime()) / (24 * 60 * 60 * 1000))
      : 365;

    return {
      organizationId,
      securityScore,
      openVulnerabilities: threats.filter(t => t.severity === 'critical' || t.severity === 'high').length,
      complianceScore,
      daysSinceIncident,
      frameworks: [], // Frameworks would come from separate compliance service
      threats,
      lastAssessment: new Date(),
    };
  }

  // ===========================================================================
  // THREAT MANAGEMENT - PRISMA BACKED
  // ===========================================================================

  async reportThreat(threat: Omit<ThreatEvent, 'id' | 'detectedAt'>): Promise<ThreatEvent> {
    const created = await prisma.security_threats.create({
      data: {
        organization_id: threat.organizationId,
        threat_type: (threatTypeMap[threat.type] || 'POLICY_VIOLATION') as any,
        severity: severityMap[threat.severity] as any,
        status: statusMap[threat.status] as any,
        title: threat.type,
        description: threat.description,
        source: threat.source,
        indicators: threat.affectedAssets || [],
        mitigations: threat.mitigationSteps || [],
      },
    });

    return this.mapThreat(created);
  }

  async getThreats(organizationId: string, includeResolved: boolean = false): Promise<ThreatEvent[]> {
    const where: any = { organization_id: organizationId };
    if (!includeResolved) {
      where.status = { notIn: ['RESOLVED', 'FALSE_POSITIVE'] };
    }

    const threats = await prisma.security_threats.findMany({
      where,
      orderBy: { detected_at: 'desc' },
    });

    return threats.map((t: any) => this.mapThreat(t));
  }

  async updateThreatStatus(threatId: string, status: ThreatStatus): Promise<ThreatEvent | null> {
    const data: any = { status: statusMap[status] as any };
    if (status === 'resolved') data.resolved_at = new Date();

    const updated = await prisma.security_threats.update({
      where: { id: threatId },
      data,
    });

    return this.mapThreat(updated);
  }

  // ===========================================================================
  // POLICIES - PRISMA BACKED
  // ===========================================================================

  async createPolicy(policy: Omit<SecurityPolicy, 'id' | 'lastUpdated' | 'violations'>): Promise<SecurityPolicy> {
    const created = await prisma.security_policies.create({
      data: {
        organization_id: policy.organizationId,
        name: policy.name,
        policy_type: 'OPERATIONAL' as any,
        description: policy.category,
        enabled: policy.enabled,
      },
    });

    return this.mapPolicy(created);
  }

  async getPolicies(organizationId: string): Promise<SecurityPolicy[]> {
    const policies = await prisma.security_policies.findMany({
      where: { organization_id: organizationId },
    });

    return policies.map((p: any) => this.mapPolicy(p));
  }

  async togglePolicy(policyId: string, enabled: boolean): Promise<SecurityPolicy | null> {
    const updated = await prisma.security_policies.update({
      where: { id: policyId },
      data: { enabled },
    });

    return this.mapPolicy(updated);
  }

  // ===========================================================================
  // AUDIT LOGGING - PRISMA BACKED
  // ===========================================================================

  async logAuditEvent(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<AuditLogEntry> {
    const riskMap: Record<string, string> = { success: 'LOW', failure: 'MEDIUM', denied: 'HIGH' };
    
    const created = await prisma.security_audit_logs.create({
      data: {
        organization_id: entry.organizationId,
        action: entry.action,
        actor: entry.userId,
        resource_type: entry.resource,
        ip_address: entry.ipAddress,
        details: (entry.metadata as unknown as Prisma.InputJsonValue) || {},
        risk_level: riskMap[entry.result] as any,
      },
    });

    return {
      id: created.id,
      organizationId: created.organization_id,
      userId: created.actor,
      action: created.action,
      resource: created.resource_type,
      result: entry.result,
      ipAddress: created.ip_address || '',
      timestamp: created.created_at,
      metadata: created.details as unknown as Record<string, unknown>,
    };
  }

  async getAuditLogs(organizationId: string, limit: number = 100): Promise<AuditLogEntry[]> {
    const logs = await prisma.security_audit_logs.findMany({
      where: { organization_id: organizationId },
      orderBy: { created_at: 'desc' },
      take: limit,
    });

    return logs.map((l: any) => ({
      id: l.id,
      organizationId: l.organization_id,
      userId: l.actor,
      action: l.action,
      resource: l.resource_type,
      result: l.risk_level === 'HIGH' ? 'denied' : 'success' as any,
      ipAddress: l.ip_address || '',
      timestamp: l.created_at,
      metadata: l.details as unknown as Record<string, unknown>,
    }));
  }

  // ===========================================================================
  // HELPERS
  // ===========================================================================

  private mapThreat(t: any): ThreatEvent {
    return {
      id: t.id,
      organizationId: t.organization_id,
      type: t.title || t.threat_type,
      severity: reverseSeverityMap[t.severity] || 'medium',
      status: reverseStatusMap[t.status] || 'active',
      source: t.source || 'unknown',
      description: t.description,
      detectedAt: t.detected_at,
      resolvedAt: t.resolved_at || undefined,
      affectedAssets: t.indicators as string[],
      mitigationSteps: t.mitigations as string[],
    };
  }

  private mapPolicy(p: any): SecurityPolicy {
    return {
      id: p.id,
      organizationId: p.organization_id,
      name: p.name,
      category: p.description || p.policy_type,
      enabled: p.enabled,
      lastUpdated: p.updated_at,
      violations: 0,
    };
  }

  // No seed method - Enterprise Platinum standard

  // ===========================================================================
  // CLIENT API METHODS
  // ===========================================================================

  async getSecurityDashboard(organizationId: string): Promise<any> {
    const posture = await this.getSecurityPosture(organizationId);
    const threats = await this.getThreats(organizationId);
    const policies = await this.getPolicies(organizationId);
    
    return {
      securityScore: posture.securityScore,
      vulnerabilities: posture.openVulnerabilities,
      activeThreats: threats.filter(t => t.status === 'active' || t.status === 'investigating').length,
      totalPolicies: policies.length,
      enabledPolicies: policies.filter(p => p.enabled).length,
    };
  }

  async getAccessPolicies(organizationId: string): Promise<any[]> {
    const policies = await this.getPolicies(organizationId);
    return policies.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      enabled: p.enabled,
    }));
  }
}

export const guardService = new GuardService();
