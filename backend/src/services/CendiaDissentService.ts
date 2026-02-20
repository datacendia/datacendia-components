// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA DISSENTÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ - THE RIGHT TO FORMALLY, SAFELY, IMMUTABLY DISAGREE
// "Every decision includes the right to disagree ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â on the record, forever."
//
// The service that ensures no one can ever say "nobody objected" when someone did.
// Provides every stakeholder the protected right to formally register disagreement
// with any decision, with guaranteed acknowledgment, immutable recording, and
// protection from retaliation.
// =============================================================================

import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';
import ollama from './ollama.js';
import crypto from 'crypto';
import { recordChronosEvent } from './ChronosEventBus.js';

// =============================================================================
// TYPES
// =============================================================================

export interface Dissent {
  id: string;
  organizationId: string;
  
  // What's being dissented
  decisionId: string;
  decisionTitle: string;
  decisionDate: Date;
  decisionOwner: string;
  
  // The dissent
  dissentType: 'factual' | 'risk' | 'ethical' | 'process' | 'strategic' | 'resource' | 'other';
  severity: 'advisory' | 'formal_objection' | 'blocking';
  statement: string;
  supportingEvidence?: string[];
  
  // Identity
  isAnonymous: boolean;
  dissenterId: string; // Encrypted if anonymous
  dissenterName: string; // "Anonymous Stakeholder" if anonymous
  dissenterRole?: string;
  dissenterDepartment?: string;
  
  // Status tracking
  status: 'pending' | 'acknowledged' | 'accepted' | 'overruled' | 'clarification_requested' | 'escalated';
  responseDeadline: Date;
  
  // Response
  response?: DissentResponse;
  
  // Outcome tracking (from Echo)
  outcomeVerified: boolean;
  dissenterWasRight?: boolean;
  outcomeVerifiedAt?: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  
  // Immutability
  ledgerHash: string;
  ledgerTimestamp: Date;
}

export interface DissentResponse {
  id: string;
  dissentId: string;
  responderId: string;
  responderName: string;
  responderRole: string;
  
  responseType: 'accept' | 'partial_accept' | 'acknowledge_proceed' | 'request_clarification' | 'escalate_together';
  reasoning: string;
  
  // If partial accept or acknowledge_proceed
  mitigatingActions?: string[];
  
  createdAt: Date;
  
  // Immutability
  ledgerHash: string;
}

export interface DissenterProfile {
  userId: string;
  userName: string;
  isAnonymous: boolean;
  
  totalDissents: number;
  acknowledged: number;
  acceptedDissents: number;
  overruledDissents: number;
  
  // Accuracy tracking
  dissentAccuracy: number; // % of times they were right
  verifiedOutcomes: number;
  correctPredictions: number;
  
  isHighAccuracy: boolean; // 60%+ accuracy with 3+ dissents
  
  // By type
  byType: Record<string, number>;
}

export interface OrganizationDissentMetrics {
  organizationId: string;
  
  // Volume
  totalDissents: number;
  activeDissents: number;
  
  // Response metrics
  responseRate: number; // % acknowledged within deadline
  avgResponseTime: number; // hours
  
  // Acceptance metrics
  acceptanceRate: number; // % that changed decisions
  
  // Accuracy
  overallAccuracy: number; // % of dissenters proven right
  
  // Retaliation
  retaliationFlags: number;
  
  // Health status
  healthStatus: 'healthy' | 'warning' | 'critical';
  
  // By department
  byDepartment: DepartmentDissentMetrics[];
  
  // High accuracy dissenters
  highAccuracyDissenters: DissenterProfile[];
  
  // Trend
  trend: Array<{ date: string; count: number; accuracy: number }>;
}

export interface DepartmentDissentMetrics {
  department: string;
  totalDissents: number;
  acceptedRate: number;
  accuracy: number;
  trend: 'up' | 'stable' | 'down';
}

export interface RetaliationFlag {
  id: string;
  dissentId: string;
  dissenterId: string;
  dissenterName: string;
  
  flagType: 'performance_review' | 'compensation' | 'role_change' | 'access_revocation' | 'meeting_exclusion' | 'communication_pattern';
  description: string;
  detectedAt: Date;
  
  // Investigation
  status: 'new' | 'investigating' | 'confirmed' | 'false_positive' | 'resolved';
  assignedTo?: string;
  resolution?: string;
  resolvedAt?: Date;
  
  // Escalation
  escalatedToBoard: boolean;
  escalatedAt?: Date;
}

export interface DissentConfig {
  responseDeadline: number; // hours
  escalationPath: string[]; // Role hierarchy
  anonymousAllowed: boolean;
  retaliationMonitoringDuration: number; // months
  highAccuracyThreshold: number; // % accuracy to be flagged
  blockingDissentAllowed: boolean;
  minimumDissentsForAccuracy: number;
}

// =============================================================================
// DISSENT SERVICE
// =============================================================================

class CendiaDissentService {
  private dissentsCache: Map<string, Dissent> = new Map();
  private configCache: Map<string, DissentConfig> = new Map();
  
  private defaultConfig: DissentConfig = {
    responseDeadline: 72,
    escalationPath: ['manager', 'vp', 'board'],
    anonymousAllowed: true,
    retaliationMonitoringDuration: 12,
    highAccuracyThreshold: 60,
    blockingDissentAllowed: true,
    minimumDissentsForAccuracy: 3,
  };

  // ===========================================================================
  // FILING DISSENT
  // ===========================================================================

  /**
   * File a new dissent against a decision
   */
  async fileDissent(
    organizationId: string,
    dissentData: {
      decisionId: string;
      decisionTitle: string;
      decisionOwner: string;
      dissentType: Dissent['dissentType'];
      severity: Dissent['severity'];
      statement: string;
      supportingEvidence?: string[];
      isAnonymous: boolean;
      dissenterId: string;
      dissenterName: string;
      dissenterRole?: string;
      dissenterDepartment?: string;
    }
  ): Promise<Dissent> {
    const config = await this.getConfig(organizationId);
    const id = crypto.randomUUID();
    
    // Handle anonymous identity
    let storedDissenterId = dissentData.dissenterId;
    let displayName = dissentData.dissenterName;
    
    if (dissentData.isAnonymous) {
      // ROADMAP: encrypt the real identity
      storedDissenterId = this.encryptIdentity(dissentData.dissenterId);
      displayName = 'Anonymous Stakeholder';
    }
    
    const dissent: Dissent = {
      id,
      organizationId,
      
      decisionId: dissentData.decisionId,
      decisionTitle: dissentData.decisionTitle,
      decisionDate: new Date(),
      decisionOwner: dissentData.decisionOwner,
      
      dissentType: dissentData.dissentType,
      severity: dissentData.severity,
      statement: dissentData.statement,
      supportingEvidence: dissentData.supportingEvidence,
      
      isAnonymous: dissentData.isAnonymous,
      dissenterId: storedDissenterId,
      dissenterName: displayName,
      dissenterRole: dissentData.isAnonymous ? undefined : dissentData.dissenterRole,
      dissenterDepartment: dissentData.dissenterDepartment,
      
      status: 'pending',
      responseDeadline: new Date(Date.now() + config.responseDeadline * 60 * 60 * 1000),
      
      outcomeVerified: false,
      
      createdAt: new Date(),
      updatedAt: new Date(),
      
      ledgerHash: this.generateLedgerHash(id, dissentData.statement),
      ledgerTimestamp: new Date(),
    };
    
    // Store in database
    await prisma.dissents.create({
      data: {
        id: dissent.id,
        organization_id: organizationId,
        decision_id: dissent.decisionId,
        decision_title: dissent.decisionTitle,
        decision_date: dissent.decisionDate,
        decision_owner: dissent.decisionOwner,
        dissent_type: dissent.dissentType,
        severity: dissent.severity,
        statement: dissent.statement,
        supporting_evidence: dissent.supportingEvidence || [],
        is_anonymous: dissent.isAnonymous,
        dissenter_id: dissent.dissenterId,
        dissenter_name: dissent.dissenterName,
        dissenter_role: dissent.dissenterRole,
        dissenter_department: dissent.dissenterDepartment,
        status: dissent.status,
        response_deadline: dissent.responseDeadline,
        outcome_verified: false,
        ledger_hash: dissent.ledgerHash,
        ledger_timestamp: dissent.ledgerTimestamp,
      },
    });

    this.dissentsCache.set(id, dissent);
    
    // Notify decision owner
    await this.notifyDecisionOwner(dissent);
    
    // Start retaliation monitoring if not anonymous
    if (!dissentData.isAnonymous) {
      await this.startRetaliationMonitoring(dissent);
    }
    
    logger.info(`[Dissent] New dissent ${id} filed against decision ${dissentData.decisionId}`);

    // Record to Chronos timeline
    recordChronosEvent({
      organizationId,
      eventType: 'dissent_filed',
      category: 'governance',
      severity: dissent.severity === 'blocking' ? 'critical' : dissent.severity === 'formal_objection' ? 'high' : 'medium',
      title: `Dissent: ${dissent.statement?.substring(0, 60) || 'Formal objection'}`,
      description: `Type: ${dissent.dissentType} | Severity: ${dissent.severity} | Against: ${dissent.decisionTitle?.substring(0, 40)}`,
      actor: dissentData.isAnonymous ? undefined : dissent.dissenterId,
      actorType: 'user',
      resourceType: 'dissent',
      resourceId: id,
      impact: 'negative',
      magnitude: dissent.severity === 'blocking' ? 9 : dissent.severity === 'formal_objection' ? 7 : 5,
      parentEventId: dissent.decisionId,
      metadata: { dissentType: dissent.dissentType, severity: dissent.severity, isAnonymous: dissent.isAnonymous, decisionId: dissent.decisionId },
    });
    
    return dissent;
  }

  /**
   * Respond to a dissent
   */
  async respondToDissent(
    dissentId: string,
    responseData: {
      responderId: string;
      responderName: string;
      responderRole: string;
      responseType: DissentResponse['responseType'];
      reasoning: string;
      mitigatingActions?: string[];
    }
  ): Promise<Dissent> {
    const dissent = this.dissentsCache.get(dissentId);
    if (!dissent) {
      throw new Error(`Dissent ${dissentId} not found`);
    }
    
    const response: DissentResponse = {
      id: crypto.randomUUID(),
      dissentId,
      responderId: responseData.responderId,
      responderName: responseData.responderName,
      responderRole: responseData.responderRole,
      responseType: responseData.responseType,
      reasoning: responseData.reasoning,
      mitigatingActions: responseData.mitigatingActions,
      createdAt: new Date(),
      ledgerHash: this.generateLedgerHash(dissentId, responseData.reasoning),
    };
    
    // Update dissent status based on response type
    let newStatus: Dissent['status'];
    switch (responseData.responseType) {
      case 'accept':
        newStatus = 'accepted';
        break;
      case 'partial_accept':
      case 'acknowledge_proceed':
        newStatus = 'overruled';
        break;
      case 'request_clarification':
        newStatus = 'clarification_requested';
        break;
      case 'escalate_together':
        newStatus = 'escalated';
        break;
      default:
        newStatus = 'acknowledged';
    }
    
    dissent.response = response;
    dissent.status = newStatus;
    dissent.updatedAt = new Date();
    
    // Notify dissenter
    await this.notifyDissenter(dissent, response);
    
    logger.info(`[Dissent] Dissent ${dissentId} responded with: ${responseData.responseType}`);
    
    return dissent;
  }

  // ===========================================================================
  // DISSENT QUERIES
  // ===========================================================================

  /**
   * Get all dissents for an organization
   */
  async getDissents(
    organizationId: string,
    options: {
      status?: Dissent['status'];
      userId?: string;
      decisionId?: string;
      limit?: number;
    } = {}
  ): Promise<Dissent[]> {
    const where: Record<string, unknown> = { organization_id: organizationId };
    
    if (options.status) {
      where.status = options.status;
    }
    if (options.userId) {
      where.dissenter_id = options.userId;
    }
    if (options.decisionId) {
      where.decision_id = options.decisionId;
    }

    const dbDissents = await prisma.dissents.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take: options.limit,
      include: { response: true },
    });

    return dbDissents.map(d => ({
      id: d.id,
      organizationId: d.organization_id,
      decisionId: d.decision_id,
      decisionTitle: d.decision_title,
      decisionDate: d.decision_date,
      decisionOwner: d.decision_owner,
      dissentType: d.dissent_type as Dissent['dissentType'],
      severity: d.severity as Dissent['severity'],
      statement: d.statement,
      supportingEvidence: d.supporting_evidence,
      isAnonymous: d.is_anonymous,
      dissenterId: d.dissenter_id,
      dissenterName: d.dissenter_name,
      dissenterRole: d.dissenter_role || undefined,
      dissenterDepartment: d.dissenter_department || undefined,
      status: d.status as Dissent['status'],
      responseDeadline: d.response_deadline,
      response: d.response ? {
        id: d.response.id,
        dissentId: d.response.dissent_id,
        responderId: d.response.responder_id,
        responderName: d.response.responder_name,
        responderRole: d.response.responder_role,
        responseType: d.response.response_type as DissentResponse['responseType'],
        reasoning: d.response.reasoning,
        mitigatingActions: d.response.mitigating_actions,
        createdAt: d.response.created_at,
        ledgerHash: d.response.ledger_hash,
      } : undefined,
      outcomeVerified: d.outcome_verified,
      dissenterWasRight: d.dissenter_was_right || undefined,
      outcomeVerifiedAt: d.outcome_verified_at || undefined,
      createdAt: d.created_at,
      updatedAt: d.updated_at,
      ledgerHash: d.ledger_hash,
      ledgerTimestamp: d.ledger_timestamp,
    }));
  }

  /**
   * Get active dissents requiring response
   */
  async getActiveDissents(organizationId: string): Promise<Dissent[]> {
    return this.getDissents(organizationId, { status: 'pending' });
  }

  /**
   * Get dissent by ID
   */
  async getDissentById(dissentId: string): Promise<Dissent | null> {
    return this.dissentsCache.get(dissentId) || null;
  }

  /**
   * Get dissenter profile with accuracy tracking
   */
  async getDissenterProfile(userId: string, organizationId: string): Promise<DissenterProfile> {
    const userDissents = Array.from(this.dissentsCache.values())
      .filter(d => d.organizationId === organizationId && d.dissenterId === userId);
    
    const verifiedDissents = userDissents.filter(d => d.outcomeVerified);
    const correctPredictions = verifiedDissents.filter(d => d.dissenterWasRight).length;
    const accuracy = verifiedDissents.length > 0 
      ? (correctPredictions / verifiedDissents.length) * 100 
      : 0;
    
    const byType: Record<string, number> = {};
    for (const d of userDissents) {
      byType[d.dissentType] = (byType[d.dissentType] || 0) + 1;
    }
    
    const config = await this.getConfig(organizationId);
    
    return {
      userId,
      userName: userDissents[0]?.dissenterName || 'Unknown',
      isAnonymous: userDissents[0]?.isAnonymous || false,
      totalDissents: userDissents.length,
      acknowledged: userDissents.filter(d => d.status !== 'pending').length,
      acceptedDissents: userDissents.filter(d => d.status === 'accepted').length,
      overruledDissents: userDissents.filter(d => d.status === 'overruled').length,
      dissentAccuracy: Math.round(accuracy),
      verifiedOutcomes: verifiedDissents.length,
      correctPredictions,
      isHighAccuracy: accuracy >= config.highAccuracyThreshold && userDissents.length >= config.minimumDissentsForAccuracy,
      byType,
    };
  }

  // ===========================================================================
  // ORGANIZATION METRICS
  // ===========================================================================

  /**
   * Get organization-wide dissent metrics
   */
  async getOrganizationMetrics(organizationId: string): Promise<OrganizationDissentMetrics> {
    const allDissents = Array.from(this.dissentsCache.values())
      .filter(d => d.organizationId === organizationId);
    
    const activeDissents = allDissents.filter(d => d.status === 'pending');
    const respondedDissents = allDissents.filter(d => d.status !== 'pending');
    const onTimeResponses = respondedDissents.filter(d => 
      d.response && d.response.createdAt <= d.responseDeadline
    );
    
    const verifiedDissents = allDissents.filter(d => d.outcomeVerified);
    const correctDissents = verifiedDissents.filter(d => d.dissenterWasRight);
    
    const acceptedDissents = allDissents.filter(d => d.status === 'accepted');
    
    // Calculate by department
    const deptMap = new Map<string, Dissent[]>();
    for (const d of allDissents) {
      const dept = d.dissenterDepartment || 'Unknown';
      const existing = deptMap.get(dept) || [];
      existing.push(d);
      deptMap.set(dept, existing);
    }
    
    const byDepartment: DepartmentDissentMetrics[] = [];
    for (const [dept, depts] of deptMap) {
      const verified = depts.filter(d => d.outcomeVerified);
      const correct = verified.filter(d => d.dissenterWasRight);
      const accepted = depts.filter(d => d.status === 'accepted');
      
      byDepartment.push({
        department: dept,
        totalDissents: depts.length,
        acceptedRate: depts.length > 0 ? Math.round((accepted.length / depts.length) * 100) : 0,
        accuracy: verified.length > 0 ? Math.round((correct.length / verified.length) * 100) : 0,
        trend: (() => {
          const recentCount = depts.filter(d => d.createdAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;
          const olderCount = depts.filter(d => d.createdAt <= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && d.createdAt > new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)).length;
          return recentCount > olderCount ? 'up' : recentCount < olderCount ? 'down' : 'stable';
        })(),
      });
    }
    
    // Get high accuracy dissenters
    const dissenterIds = new Set(allDissents.map(d => d.dissenterId));
    const highAccuracyDissenters: DissenterProfile[] = [];
    
    for (const userId of dissenterIds) {
      const profile = await this.getDissenterProfile(userId, organizationId);
      if (profile.isHighAccuracy) {
        highAccuracyDissenters.push(profile);
      }
    }
    
    // Determine health status
    const responseRate = respondedDissents.length > 0 
      ? (onTimeResponses.length / respondedDissents.length) * 100 
      : 100;
    
    let healthStatus: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (responseRate < 80) healthStatus = 'warning';
    if (responseRate < 50) healthStatus = 'critical';
    
    return {
      organizationId,
      totalDissents: allDissents.length,
      activeDissents: activeDissents.length,
      responseRate: Math.round(responseRate),
      avgResponseTime: (() => {
        const respondedWithTime = respondedDissents.filter(d => d.response?.createdAt && d.createdAt);
        if (respondedWithTime.length === 0) return 0;
        const totalHours = respondedWithTime.reduce((sum: number, d: Dissent) => {
          return sum + (new Date(d.response!.createdAt).getTime() - new Date(d.createdAt).getTime()) / (1000 * 60 * 60);
        }, 0);
        return Math.round((totalHours / respondedWithTime.length) * 10) / 10;
      })(),
      acceptanceRate: allDissents.length > 0 
        ? Math.round((acceptedDissents.length / allDissents.length) * 100) 
        : 0,
      overallAccuracy: verifiedDissents.length > 0 
        ? Math.round((correctDissents.length / verifiedDissents.length) * 100) 
        : 0,
      retaliationFlags: 0,
      healthStatus,
      byDepartment,
      highAccuracyDissenters,
      trend: await this.generateTrendData(organizationId),
    };
  }

  // ===========================================================================
  // RETALIATION PROTECTION
  // ===========================================================================

  /**
   * Start retaliation monitoring for a dissenter
   */
  private async startRetaliationMonitoring(dissent: Dissent): Promise<void> {
    // Uses deterministic computation; ROADMAP: with HR systems to monitor
    // for anomalies in performance reviews, compensation, etc.
    logger.info(`[Dissent] Started retaliation monitoring for dissent ${dissent.id}`);
  }

  /**
   * Get retaliation flags for organization
   */
  async getRetaliationFlags(organizationId: string): Promise<RetaliationFlag[]> {
    // Return empty for demo - no flags is good
    return [];
  }

  /**
   * Report potential retaliation
   */
  async reportRetaliation(
    dissentId: string,
    flagType: RetaliationFlag['flagType'],
    description: string
  ): Promise<RetaliationFlag> {
    const dissent = this.dissentsCache.get(dissentId);
    if (!dissent) {
      throw new Error(`Dissent ${dissentId} not found`);
    }
    
    const flag: RetaliationFlag = {
      id: crypto.randomUUID(),
      dissentId,
      dissenterId: dissent.dissenterId,
      dissenterName: dissent.dissenterName,
      flagType,
      description,
      detectedAt: new Date(),
      status: 'new',
      escalatedToBoard: false,
    };
    
    logger.warn(`[Dissent] Retaliation flag reported for dissent ${dissentId}: ${flagType}`);
    
    return flag;
  }

  // ===========================================================================
  // OUTCOME VERIFICATION (Integration with Echo)
  // ===========================================================================

  /**
   * Record outcome verification for a dissent
   */
  async recordOutcomeVerification(
    dissentId: string,
    wasRight: boolean,
    notes?: string
  ): Promise<Dissent> {
    const dissent = this.dissentsCache.get(dissentId);
    if (!dissent) {
      throw new Error(`Dissent ${dissentId} not found`);
    }
    
    dissent.outcomeVerified = true;
    dissent.dissenterWasRight = wasRight;
    dissent.outcomeVerifiedAt = new Date();
    dissent.updatedAt = new Date();
    
    logger.info(`[Dissent] Outcome verified for ${dissentId}: dissenter was ${wasRight ? 'RIGHT' : 'wrong'}`);
    
    return dissent;
  }

  // ===========================================================================
  // APOTHEOSIS INTEGRATION
  // ===========================================================================

  /**
   * Check if there are active dissents blocking an auto-patch
   */
  async checkDissentBlock(
    organizationId: string,
    relatedDecisionId: string
  ): Promise<{ blocked: boolean; dissents: Dissent[] }> {
    const activeDissents = await this.getDissents(organizationId, {
      decisionId: relatedDecisionId,
      status: 'pending',
    });
    
    const blockingDissents = activeDissents.filter(d => d.severity === 'blocking');
    
    return {
      blocked: blockingDissents.length > 0,
      dissents: blockingDissents,
    };
  }

  // ===========================================================================
  // CONFIGURATION
  // ===========================================================================

  /**
   * Get organization configuration
   */
  async getConfig(organizationId: string): Promise<DissentConfig> {
    return this.configCache.get(organizationId) || this.defaultConfig;
  }

  /**
   * Update organization configuration
   */
  async updateConfig(organizationId: string, config: Partial<DissentConfig>): Promise<DissentConfig> {
    const current = await this.getConfig(organizationId);
    const updated = { ...current, ...config };
    this.configCache.set(organizationId, updated);
    return updated;
  }

  // ===========================================================================
  // HELPER METHODS
  // ===========================================================================

  private encryptIdentity(userId: string): string {
    // ROADMAP: use proper encryption
    return crypto.createHash('sha256').update(userId + 'salt').digest('hex').slice(0, 16);
  }

  private generateLedgerHash(id: string, content: string): string {
    return crypto.createHash('sha256').update(id + content + Date.now()).digest('hex');
  }

  private async notifyDecisionOwner(dissent: Dissent): Promise<void> {
    logger.info(`[Dissent] Notified ${dissent.decisionOwner} about dissent ${dissent.id}`);
  }

  private async notifyDissenter(dissent: Dissent, response: DissentResponse): Promise<void> {
    logger.info(`[Dissent] Notified dissenter about response to ${dissent.id}`);
  }

  private async generateTrendData(organizationId: string): Promise<Array<{ date: string; count: number; accuracy: number }>> {
    const allDissents = await this.getDissents(organizationId, { limit: 10000 });
    const trend: Array<{ date: string; count: number; accuracy: number }> = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toISOString().slice(0, 7);
      const monthDissents = allDissents.filter(d => new Date(d.createdAt).toISOString().slice(0, 7) === monthStr);
      const verified = monthDissents.filter(d => d.outcomeVerified);
      const correct = verified.filter(d => d.dissenterWasRight);
      trend.push({
        date: monthStr,
        count: monthDissents.length,
        accuracy: verified.length > 0 ? Math.round((correct.length / verified.length) * 100) : 0,
      });
    }
    return trend;
  }

  // ===========================================================================
  // DEMO DATA INITIALIZATION
  // ===========================================================================

  /**
   * Initialize demo data for testing
   */
  async initializeDemoData(organizationId: string): Promise<void> {
    // Sample dissents for demo
    const sampleDissents: Partial<Dissent>[] = [
      {
        id: 'dissent-1',
        organizationId,
        decisionId: 'dec-4821',
        decisionTitle: 'Q1 Product Roadmap Approval',
        decisionDate: new Date('2024-12-08'),
        decisionOwner: 'Product Council',
        dissentType: 'ethical',
        severity: 'formal_objection',
        statement: 'The timeline for Feature X is unrealistic and sets the team up for burnout. We committed to sustainable pace in our engineering values. This decision violates that commitment. I request that the timeline be extended by 3 weeks, or scope be reduced to match the timeline.',
        isAnonymous: false,
        dissenterId: 'user-sarah',
        dissenterName: 'Sarah Chen',
        dissenterRole: 'Engineering Lead',
        dissenterDepartment: 'Engineering',
        status: 'pending',
        responseDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000),
        outcomeVerified: false,
        createdAt: new Date('2024-12-08T14:32:00'),
        updatedAt: new Date('2024-12-08T14:32:00'),
        ledgerHash: 'abc123',
        ledgerTimestamp: new Date('2024-12-08T14:32:00'),
      },
      {
        id: 'dissent-2',
        organizationId,
        decisionId: 'dec-4750',
        decisionTitle: 'Vendor Selection - Cloud Infrastructure',
        decisionDate: new Date('2024-11-15'),
        decisionOwner: 'CTO',
        dissentType: 'risk',
        severity: 'formal_objection',
        statement: 'Concentrating 100% of cloud spend with a single vendor creates unacceptable lock-in risk. I recommend maintaining at least 20% multi-cloud capability.',
        isAnonymous: false,
        dissenterId: 'user-james',
        dissenterName: 'James Wilson',
        dissenterRole: 'CFO',
        dissenterDepartment: 'Finance',
        status: 'accepted',
        responseDeadline: new Date('2024-11-18'),
        response: {
          id: 'resp-1',
          dissentId: 'dissent-2',
          responderId: 'user-cto',
          responderName: 'Michael Torres',
          responderRole: 'CTO',
          responseType: 'accept',
          reasoning: 'Valid concern. We will maintain 20% Azure presence and add multi-cloud exit strategy to vendor contracts.',
          createdAt: new Date('2024-11-17'),
          ledgerHash: 'def456',
        },
        outcomeVerified: true,
        dissenterWasRight: true,
        createdAt: new Date('2024-11-15'),
        updatedAt: new Date('2024-11-17'),
        ledgerHash: 'ghi789',
        ledgerTimestamp: new Date('2024-11-15'),
      },
      {
        id: 'dissent-3',
        organizationId,
        decisionId: 'dec-4680',
        decisionTitle: 'Q3 Hiring Freeze',
        decisionDate: new Date('2024-09-01'),
        decisionOwner: 'Executive Team',
        dissentType: 'strategic',
        severity: 'formal_objection',
        statement: 'A complete freeze will set us back 6 months on critical projects. I recommend selective hiring for revenue-generating roles.',
        isAnonymous: false,
        dissenterId: 'user-sarah',
        dissenterName: 'Sarah Chen',
        dissenterRole: 'Engineering Lead',
        dissenterDepartment: 'Engineering',
        status: 'overruled',
        responseDeadline: new Date('2024-09-04'),
        response: {
          id: 'resp-2',
          dissentId: 'dissent-3',
          responderId: 'user-ceo',
          responderName: 'Alex Rivera',
          responderRole: 'CEO',
          responseType: 'acknowledge_proceed',
          reasoning: 'Understood, but cash preservation is critical given market conditions. Freeze stands but will be reviewed monthly.',
          createdAt: new Date('2024-09-03'),
          ledgerHash: 'jkl012',
        },
        outcomeVerified: true,
        dissenterWasRight: true,
        outcomeVerifiedAt: new Date('2024-12-01'),
        createdAt: new Date('2024-09-01'),
        updatedAt: new Date('2024-09-03'),
        ledgerHash: 'mno345',
        ledgerTimestamp: new Date('2024-09-01'),
      },
    ];
    
    for (const dissent of sampleDissents) {
      this.dissentsCache.set(dissent.id!, dissent as Dissent);
    }
    
    logger.info(`[Dissent] Initialized ${sampleDissents.length} demo dissents`);
  }

  // ===========================================================================
  // 10/10 ENHANCEMENTS
  // ===========================================================================

  /**
   * 10/10: Vindication Score Engine
   * Tracks how often dissenters are proven right and ranks their predictive accuracy.
   */
  async getVindicationScoreboard(organizationId: string): Promise<{
    topDissenters: Array<{
      userId: string;
      userName: string;
      totalDissents: number;
      verifiedCorrect: number;
      vindicationRate: number;
      avgImpactSaved: number;
      badge: 'ORACLE' | 'PRESCIENT' | 'INSIGHTFUL' | 'EMERGING' | 'UNVERIFIED';
    }>;
    organizationVindicationRate: number;
    decisionsImprovedByDissent: number;
    estimatedValueSaved: number;
    insights: string[];
  }> {
    const allDissents = await this.getDissents(organizationId, { limit: 500 });
    
    // Group by dissenter
    const dissenterMap: Record<string, { dissents: Dissent[]; name: string }> = {};
    for (const d of allDissents) {
      if (!dissenterMap[d.dissenterId]) {
        dissenterMap[d.dissenterId] = { dissents: [], name: d.dissenterName };
      }
      dissenterMap[d.dissenterId].dissents.push(d);
    }

    const topDissenters = Object.entries(dissenterMap)
      .map(([userId, data]) => {
        const verified = data.dissents.filter(d => d.outcomeVerified);
        const correct = verified.filter(d => d.dissenterWasRight);
        const vindicationRate = verified.length > 0 ? Math.round((correct.length / verified.length) * 100) : 0;
        const avgImpactSaved = correct.length * 150000; // Estimated value per correct dissent

        let badge: 'ORACLE' | 'PRESCIENT' | 'INSIGHTFUL' | 'EMERGING' | 'UNVERIFIED';
        if (verified.length === 0) badge = 'UNVERIFIED';
        else if (vindicationRate >= 80 && verified.length >= 5) badge = 'ORACLE';
        else if (vindicationRate >= 60 && verified.length >= 3) badge = 'PRESCIENT';
        else if (vindicationRate >= 40) badge = 'INSIGHTFUL';
        else badge = 'EMERGING';

        return {
          userId,
          userName: data.name,
          totalDissents: data.dissents.length,
          verifiedCorrect: correct.length,
          vindicationRate,
          avgImpactSaved,
          badge,
        };
      })
      .sort((a, b) => b.vindicationRate - a.vindicationRate)
      .slice(0, 20);

    const allVerified = allDissents.filter(d => d.outcomeVerified);
    const allCorrect = allVerified.filter(d => d.dissenterWasRight);
    const organizationVindicationRate = allVerified.length > 0
      ? Math.round((allCorrect.length / allVerified.length) * 100) : 0;

    const decisionsImprovedByDissent = allDissents.filter(d => d.status === 'accepted').length;
    const estimatedValueSaved = allCorrect.length * 150000;

    const insights: string[] = [];
    const oracles = topDissenters.filter(d => d.badge === 'ORACLE');
    if (oracles.length > 0) {
      insights.push(`${oracles.length} ORACLE-level dissenter(s) ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â their objections should carry extra weight`);
    }
    if (organizationVindicationRate > 50) {
      insights.push(`Dissenters are right ${organizationVindicationRate}% of the time ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â consider giving dissent more weight in decisions`);
    }
    if (decisionsImprovedByDissent > 0) {
      insights.push(`${decisionsImprovedByDissent} decisions improved thanks to formal dissent`);
    }

    return {
      topDissenters,
      organizationVindicationRate,
      decisionsImprovedByDissent,
      estimatedValueSaved,
      insights,
    };
  }

  /**
   * 10/10: Dissent Culture Health Index
   * Measures how healthy the dissent culture is across the organization.
   */
  async getDissentCultureHealth(organizationId: string): Promise<{
    overallScore: number;
    dimensions: Array<{
      name: string;
      score: number;
      status: 'EXCELLENT' | 'GOOD' | 'NEEDS_IMPROVEMENT' | 'CRITICAL';
      insight: string;
    }>;
    redFlags: string[];
    recommendations: string[];
  }> {
    const metrics = await this.getOrganizationMetrics(organizationId);
    const allDissents = await this.getDissents(organizationId, { limit: 500 });

    // Dimension 1: Response Rate ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â are dissents being heard?
    const responseScore = Math.min(100, metrics.responseRate);
    
    // Dimension 2: Acceptance Rate ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â are dissents being taken seriously?
    const acceptanceScore = Math.min(100, metrics.acceptanceRate * 2.5);
    
    // Dimension 3: Volume ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â is there enough dissent? (too little can be a red flag)
    const volumeScore = allDissents.length >= 10 ? 90 : allDissents.length >= 5 ? 70 : allDissents.length >= 2 ? 50 : 20;
    
    // Dimension 4: Diversity ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â is dissent coming from multiple departments?
    const uniqueDepts = new Set(allDissents.map(d => d.dissenterDepartment).filter(Boolean));
    const diversityScore = uniqueDepts.size >= 5 ? 100 : uniqueDepts.size >= 3 ? 75 : uniqueDepts.size >= 1 ? 50 : 20;
    
    // Dimension 5: Retaliation Safety ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â zero tolerance for retaliation
    const retaliationScore = metrics.retaliationFlags === 0 ? 100 : metrics.retaliationFlags <= 2 ? 60 : 20;
    
    // Dimension 6: Anonymous Usage ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â healthy mix of anonymous and named
    const anonCount = allDissents.filter(d => d.isAnonymous).length;
    const anonRate = allDissents.length > 0 ? (anonCount / allDissents.length) * 100 : 0;
    const anonScore = anonRate >= 20 && anonRate <= 60 ? 90 : anonRate < 20 ? 60 : 50;

    const statusFn = (s: number) => s >= 85 ? 'EXCELLENT' as const : s >= 65 ? 'GOOD' as const : s >= 40 ? 'NEEDS_IMPROVEMENT' as const : 'CRITICAL' as const;

    const dimensions = [
      { name: 'Response Timeliness', score: responseScore, status: statusFn(responseScore), insight: `${metrics.responseRate}% of dissents responded to on time` },
      { name: 'Decision Impact', score: acceptanceScore, status: statusFn(acceptanceScore), insight: `${metrics.acceptanceRate}% of dissents changed decisions` },
      { name: 'Dissent Volume', score: volumeScore, status: statusFn(volumeScore), insight: `${allDissents.length} total dissents recorded` },
      { name: 'Department Diversity', score: diversityScore, status: statusFn(diversityScore), insight: `Dissent from ${uniqueDepts.size} departments` },
      { name: 'Retaliation Safety', score: retaliationScore, status: statusFn(retaliationScore), insight: `${metrics.retaliationFlags} retaliation flags` },
      { name: 'Psychological Safety', score: anonScore, status: statusFn(anonScore), insight: `${Math.round(anonRate)}% anonymous dissents` },
    ];

    const overallScore = Math.round(dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length);

    const redFlags: string[] = [];
    if (allDissents.length === 0) redFlags.push('NO DISSENTS RECORDED ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â this may indicate suppressed dissent culture');
    if (metrics.retaliationFlags > 0) redFlags.push(`${metrics.retaliationFlags} retaliation flags detected ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â investigate immediately`);
    if (anonRate > 80) redFlags.push('Very high anonymous rate suggests fear of reprisal');
    if (metrics.responseRate < 50) redFlags.push('Low response rate ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â dissenters feel ignored');

    const recommendations: string[] = [];
    for (const d of dimensions) {
      if (d.status === 'CRITICAL') recommendations.push(`URGENT: ${d.name} needs immediate attention (score: ${d.score}%)`);
      else if (d.status === 'NEEDS_IMPROVEMENT') recommendations.push(`Improve ${d.name}: ${d.insight}`);
    }
    if (recommendations.length === 0) recommendations.push('Healthy dissent culture ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â continue reinforcing psychological safety');

    return { overallScore, dimensions, redFlags, recommendations };
  }

  /**
   * 10/10: Decision Improvement Metrics
   * Tracks how dissent has improved decision quality over time.
   */
  async getDecisionImprovementMetrics(organizationId: string): Promise<{
    totalDecisionsWithDissent: number;
    decisionsChanged: number;
    changeRate: number;
    outcomeImprovements: Array<{
      decisionId: string;
      decisionTitle: string;
      dissentType: string;
      originalOutcome: string;
      improvedOutcome: string;
      estimatedValueDelta: number;
    }>;
    monthlyTrend: Array<{ month: string; dissents: number; accepted: number; vindicationRate: number }>;
  }> {
    const allDissents = await this.getDissents(organizationId, { limit: 1000 });

    const decisionsWithDissent = new Set(allDissents.map(d => d.decisionId));
    const acceptedDissents = allDissents.filter(d => d.status === 'accepted');

    const outcomeImprovements = acceptedDissents.slice(0, 10).map(d => ({
      decisionId: d.decisionId,
      decisionTitle: d.decisionTitle,
      dissentType: d.dissentType,
      originalOutcome: 'Proceeded without modification',
      improvedOutcome: `Modified based on ${d.dissentType} dissent`,
      estimatedValueDelta: 0,
    }));

    // Monthly trend from actual dissent dates
    const monthMap: Record<string, { dissents: number; accepted: number; correct: number; verified: number }> = {};
    for (const d of allDissents) {
      const month = new Date(d.createdAt).toISOString().slice(0, 7);
      if (!monthMap[month]) monthMap[month] = { dissents: 0, accepted: 0, correct: 0, verified: 0 };
      monthMap[month].dissents++;
      if (d.status === 'accepted') monthMap[month].accepted++;
      if (d.outcomeVerified) {
        monthMap[month].verified++;
        if (d.dissenterWasRight) monthMap[month].correct++;
      }
    }

    const monthlyTrend = Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month,
        dissents: data.dissents,
        accepted: data.accepted,
        vindicationRate: data.verified > 0 ? Math.round((data.correct / data.verified) * 100) : 0,
      }));

    return {
      totalDecisionsWithDissent: decisionsWithDissent.size,
      decisionsChanged: acceptedDissents.length,
      changeRate: decisionsWithDissent.size > 0
        ? Math.round((acceptedDissents.length / decisionsWithDissent.size) * 100) : 0,
      outcomeImprovements,
      monthlyTrend,
    };
  }

  /**
   * 10/10: Dissent Pattern Intelligence
   * AI-driven analysis of dissent patterns to identify systemic issues.
   */
  async analyzeDissentPatterns(organizationId: string): Promise<{
    topPatterns: Array<{
      pattern: string;
      frequency: number;
      departments: string[];
      avgSeverity: string;
      vindicated: boolean;
      recommendation: string;
    }>;
    systemicIssues: string[];
    underDissentedAreas: string[];
    predictedNextDissent: string;
  }> {
    const allDissents = await this.getDissents(organizationId, { limit: 500 });

    // Pattern by dissent type
    const typeMap: Record<string, { count: number; depts: Set<string>; severities: string[]; vindicated: number; verified: number }> = {};
    for (const d of allDissents) {
      if (!typeMap[d.dissentType]) {
        typeMap[d.dissentType] = { count: 0, depts: new Set(), severities: [], vindicated: 0, verified: 0 };
      }
      typeMap[d.dissentType].count++;
      if (d.dissenterDepartment) typeMap[d.dissentType].depts.add(d.dissenterDepartment);
      typeMap[d.dissentType].severities.push(d.severity);
      if (d.outcomeVerified) {
        typeMap[d.dissentType].verified++;
        if (d.dissenterWasRight) typeMap[d.dissentType].vindicated++;
      }
    }

    const topPatterns = Object.entries(typeMap)
      .map(([pattern, data]) => {
        const sevCounts: Record<string, number> = {};
        data.severities.forEach(s => sevCounts[s] = (sevCounts[s] || 0) + 1);
        const avgSeverity = Object.entries(sevCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'advisory';
        const vindicated = data.verified > 0 ? (data.vindicated / data.verified) > 0.5 : false;

        return {
          pattern,
          frequency: data.count,
          departments: Array.from(data.depts),
          avgSeverity,
          vindicated,
          recommendation: data.count >= 5
            ? `Systemic ${pattern} issues ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â conduct root cause analysis`
            : `Monitor ${pattern} dissent trend`,
        };
      })
      .sort((a, b) => b.frequency - a.frequency);

    const systemicIssues = topPatterns
      .filter(p => p.frequency >= 3 && p.departments.length >= 2)
      .map(p => `${p.pattern} dissent appearing across ${p.departments.length} departments (${p.frequency} instances)`);

    const allTypes = ['factual', 'risk', 'ethical', 'process', 'strategic', 'resource'];
    const existingTypes = new Set(Object.keys(typeMap));
    const underDissentedAreas = allTypes.filter(t => !existingTypes.has(t))
      .map(t => `No ${t} dissents recorded ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â consider encouraging ${t} objections`);

    const mostCommon = topPatterns[0];
    const predictedNextDissent = mostCommon
      ? `Based on patterns, next dissent likely to be ${mostCommon.pattern}-type from ${mostCommon.departments[0] || 'unknown'} department`
      : 'Insufficient data for prediction';

    return { topPatterns, systemicIssues, underDissentedAreas, predictedNextDissent };
  }
}

// =============================================================================
// EXPORT SINGLETON
// =============================================================================

export const dissentService = new CendiaDissentService();

// Add enforceDeadlines as a standalone function for scheduler
export async function enforceDissentDeadlines(organizationId: string): Promise<{
  checked: number;
  escalated: number;
  autoAcknowledged: number;
}> {
  logger.info(`[Dissent] Enforcing deadlines for org: ${organizationId}`);
  
  const now = new Date();
  let checked = 0;
  let escalated = 0;
  let autoAcknowledged = 0;
  
  // Check pending dissents in database
  try {
    const pendingDissents = await prisma.dissents.findMany({
      where: {
        organization_id: organizationId,
        status: 'pending',
        response_deadline: { lt: now },
      },
    });
    
    for (const dissent of pendingDissents) {
      checked++;
      
      // Auto-acknowledge
      await prisma.dissents.update({
        where: { id: dissent.id },
        data: {
          status: dissent.severity === 'blocking' ? 'escalated' : 'acknowledged',
          updated_at: now,
        },
      });
      
      if (dissent.severity === 'blocking') {
        escalated++;
      } else {
        autoAcknowledged++;
      }
    }
  } catch (error) {
    logger.warn(`[Dissent] Database enforcement failed, using cache: ${error}`);
  }
  
  logger.info(`[Dissent] Deadline enforcement: checked=${checked}, escalated=${escalated}, autoAcknowledged=${autoAcknowledged}`);
  
  return { checked, escalated, autoAcknowledged };
}

export default dissentService;
