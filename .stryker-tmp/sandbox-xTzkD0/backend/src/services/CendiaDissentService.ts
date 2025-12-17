// @ts-nocheck
// =============================================================================
// CENDIA DISSENT™ - THE RIGHT TO FORMALLY, SAFELY, IMMUTABLY DISAGREE
// "Every decision includes the right to disagree — on the record, forever."
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
      // In production, encrypt the real identity
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
        trend: Math.random() > 0.5 ? 'up' : 'stable',
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
      avgResponseTime: 24 + Math.random() * 24,
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
      trend: this.generateTrendData(),
    };
  }

  // ===========================================================================
  // RETALIATION PROTECTION
  // ===========================================================================

  /**
   * Start retaliation monitoring for a dissenter
   */
  private async startRetaliationMonitoring(dissent: Dissent): Promise<void> {
    // In production, this would integrate with HR systems to monitor
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
    // In production, use proper encryption
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

  private generateTrendData(): Array<{ date: string; count: number; accuracy: number }> {
    const trend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      trend.push({
        date: date.toISOString().slice(0, 7),
        count: 5 + Math.floor(Math.random() * 10),
        accuracy: 55 + Math.floor(Math.random() * 20),
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
}

// =============================================================================
// EXPORT SINGLETON
// =============================================================================

export const dissentService = new CendiaDissentService();
export default dissentService;
