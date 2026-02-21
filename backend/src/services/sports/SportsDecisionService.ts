// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA PLATFORM - SPORTS VERTICAL
 * Sports Decision Service
 * 
 * Extends the core DecisionService with football/sports-specific functionality
 * 
 * Copyright (c) 2024-2026 Datacendia, Inc. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL
 */

import { BaseService } from '../../core/services/BaseService.js';
import { 
  DecisionTemplate, 
  SPORTS_DECISION_TEMPLATES,
  getTemplateById,
  DecisionCategory 
} from '../../config/sports/decision-templates.js';
import { 
  ComplianceFramework,
  SPORTS_COMPLIANCE_FRAMEWORKS,
  getFrameworkById 
} from '../../config/sports/compliance-frameworks.js';
import { cendiaAuditService, AuditEventType } from '../CendiaAuditService.js';
import crypto from 'crypto';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';

// =============================================================================
// TYPES
// =============================================================================

export interface Player {
  id: string;
  name: string;
  dateOfBirth: Date;
  nationality: string;
  position: string;
  currentClub?: string;
  contractExpiry?: Date;
  marketValue?: number;
}

export interface Club {
  id: string;
  name: string;
  country: string;
  league: string;
  tier: number;
}

export interface Agent {
  id: string;
  name: string;
  agency?: string;
  fifaLicense: string;
  licenseVerified: boolean;
}

export interface TransferDecision {
  id: string;
  organizationId: string;
  templateId: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'completed' | 'withdrawn';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  
  // Transaction details
  transactionType: 'inbound' | 'outbound' | 'loan_out' | 'loan_in';
  player: Player;
  counterpartyClub: Club;
  
  // Financial
  transferFee: number;
  addOns: number;
  agentFee: number;
  wages?: {
    weekly: number;
    contractLength: number;
    totalValue: number;
  };
  sellOnClause?: number;
  buybackClause?: number;
  
  // Scouting & Assessment
  scoutingAssessment: {
    matchesObserved: number;
    videoAnalysisComplete: boolean;
    dataProfile: string;
    characterReferences: number;
    recommendation: 'strong_buy' | 'buy' | 'conditional' | 'pass';
  };
  
  // Valuation
  valuation: {
    methodology: string;
    marketComparables: string;
    internalValuation: number;
    dataValuation?: number;
    negotiatedFee: number;
    premium: number; // percentage over/under valuation
  };
  
  // Alternatives
  alternativesConsidered: Array<{
    playerName: string;
    reason: string;
    whyNotSelected: string;
  }>;
  
  // Approvals
  approvals: Array<{
    role: string;
    userId: string;
    userName: string;
    decision: 'approved' | 'rejected' | 'pending';
    timestamp?: Date;
    comments?: string;
  }>;
  
  // Compliance
  complianceChecks: Array<{
    framework: string;
    status: 'passed' | 'failed' | 'pending' | 'not_applicable';
    notes?: string;
  }>;
  
  // Evidence
  evidenceAttachments: Array<{
    id: string;
    type: string;
    filename: string;
    uploadedAt: Date;
    uploadedBy: string;
    hash: string;
  }>;
  
  // Audit
  timeline: Array<{
    timestamp: Date;
    action: string;
    actor: string;
    details: Record<string, any>;
  }>;
  
  // Integrity
  auditHash?: string;
  lockedAt?: Date;
}

export interface ContractDecision {
  id: string;
  organizationId: string;
  templateId: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  
  contractType: 'new' | 'renewal' | 'termination';
  player: Player;
  
  // Current contract (for renewals)
  currentContract?: {
    weeklyWage: number;
    expiryDate: Date;
    remainingValue: number;
  };
  
  // Proposed contract
  proposedContract: {
    weeklyWage: number;
    lengthYears: number;
    signingBonus?: number;
    loyaltyBonus?: number;
    performanceBonuses?: string;
    releaseClause?: number;
    totalValue: number;
  };
  
  // Justification
  justification: {
    performanceAssessment: string;
    marketBenchmarking: string;
    strategicRationale: string;
  };
  
  // Approvals & Evidence (similar to TransferDecision)
  approvals: Array<{
    role: string;
    userId: string;
    userName: string;
    decision: 'approved' | 'rejected' | 'pending';
    timestamp?: Date;
    comments?: string;
  }>;
  
  evidenceAttachments: Array<{
    id: string;
    type: string;
    filename: string;
    uploadedAt: Date;
    uploadedBy: string;
    hash: string;
  }>;
  
  timeline: Array<{
    timestamp: Date;
    action: string;
    actor: string;
    details: Record<string, any>;
  }>;
  
  auditHash?: string;
  lockedAt?: Date;
}

export interface FFPImpactAssessment {
  decisionId: string;
  assessedAt: Date;
  
  // Current position
  currentBreakEvenPosition: number;
  currentSquadCostRatio: number;
  
  // Impact of this decision
  immediateImpact: {
    cashOutflow: number;
    annualWageCost: number;
    amortizationPerYear: number;
    ffpChargeYear1: number;
  };
  
  // Projected position
  projectedBreakEvenPosition: number;
  projectedSquadCostRatio: number;
  
  // Headroom
  remainingHeadroom: number;
  
  // Risk assessment
  risk: 'low' | 'medium' | 'high' | 'critical';
  notes: string;
}

// =============================================================================
// SERVICE
// =============================================================================

export class SportsDecisionService extends BaseService {
  private transferDecisions: Map<string, TransferDecision> = new Map();
  private contractDecisions: Map<string, ContractDecision> = new Map();
  private orgIndex: Map<string, { transfers: string[]; contracts: string[] }> = new Map();

  constructor() {
    super({
      name: 'SportsDecisionService',
      version: '1.0.0',
      dependencies: ['DecisionService', 'EvidenceVaultService'],
    });


    this.loadFromDB().catch(() => {});
  }

  async initialize(): Promise<void> {
    this.logger.info('[CendiaSports] Sports Decision ServiceÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ initialized');
    this.logger.info(`Loaded ${SPORTS_DECISION_TEMPLATES.length} decision templates`);
    this.logger.info(`Loaded ${SPORTS_COMPLIANCE_FRAMEWORKS.length} compliance frameworks`);
  }

  async shutdown(): Promise<void> {
    this.logger.info('Sports Decision Service shutting down');
  }

  async healthCheck(): Promise<{ status: 'healthy' | 'degraded' | 'unhealthy'; lastCheck: Date; details?: Record<string, any> }> {
    return {
      status: 'healthy',
      lastCheck: new Date(),
      details: {
        transferDecisions: this.transferDecisions.size,
        contractDecisions: this.contractDecisions.size,
        organizations: this.orgIndex.size,
        templates: SPORTS_DECISION_TEMPLATES.length,
        frameworks: SPORTS_COMPLIANCE_FRAMEWORKS.length,
      },
    };
  }

  // ---------------------------------------------------------------------------
  // TEMPLATE METHODS
  // ---------------------------------------------------------------------------

  getAvailableTemplates(): DecisionTemplate[] {
    return SPORTS_DECISION_TEMPLATES;
  }

  getTemplatesByCategory(category: DecisionCategory): DecisionTemplate[] {
    return SPORTS_DECISION_TEMPLATES.filter(t => t.category === category);
  }

  getTemplate(templateId: string): DecisionTemplate | undefined {
    return getTemplateById(templateId);
  }

  // ---------------------------------------------------------------------------
  // COMPLIANCE METHODS
  // ---------------------------------------------------------------------------

  getComplianceFrameworks(): ComplianceFramework[] {
    return SPORTS_COMPLIANCE_FRAMEWORKS;
  }

  getFramework(frameworkId: string): ComplianceFramework | undefined {
    return getFrameworkById(frameworkId);
  }

  // ---------------------------------------------------------------------------
  // TRANSFER DECISION METHODS
  // ---------------------------------------------------------------------------

  async createTransferDecision(params: {
    organizationId: string;
    userId: string;
    templateId: string;
    transactionType: TransferDecision['transactionType'];
    player: Player;
    counterpartyClub: Club;
    transferFee: number;
    addOns?: number;
    agentFee?: number;
  }): Promise<TransferDecision> {
    const id = `trf-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`;
    const now = new Date();

    const template = getTemplateById(params.templateId);
    if (!template) {
      throw new Error(`Template not found: ${params.templateId}`);
    }

    // Determine required approvers based on thresholds
    const totalValue = params.transferFee + (params.addOns || 0) + (params.agentFee || 0);
    const requiredApprovers = this.determineApprovers(template, totalValue);

    const decision: TransferDecision = {
      id,
      organizationId: params.organizationId,
      templateId: params.templateId,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      createdBy: params.userId,
      
      transactionType: params.transactionType,
      player: params.player,
      counterpartyClub: params.counterpartyClub,
      
      transferFee: params.transferFee,
      addOns: params.addOns || 0,
      agentFee: params.agentFee || 0,
      
      scoutingAssessment: {
        matchesObserved: 0,
        videoAnalysisComplete: false,
        dataProfile: '',
        characterReferences: 0,
        recommendation: 'conditional',
      },
      
      valuation: {
        methodology: '',
        marketComparables: '',
        internalValuation: 0,
        negotiatedFee: params.transferFee,
        premium: 0,
      },
      
      alternativesConsidered: [],
      
      approvals: requiredApprovers.map(role => ({
        role,
        userId: '',
        userName: '',
        decision: 'pending' as const,
      })),
      
      complianceChecks: template.complianceFrameworks.map(fw => ({
        framework: fw,
        status: 'pending' as const,
      })),
      
      evidenceAttachments: [],
      
      timeline: [{
        timestamp: now,
        action: 'created',
        actor: params.userId,
        details: {
          player: params.player.name,
          counterparty: params.counterpartyClub.name,
          fee: params.transferFee,
        },
      }],
    };

    this.transferDecisions.set(id, decision);
    this.updateOrgIndex(params.organizationId, 'transfers', id);
    persistServiceRecord({ serviceName: 'SportsDecision', recordType: 'transfer_decision', organizationId: params.organizationId, referenceId: id, data: { id, player: params.player.name, type: 'transfer', createdAt: new Date() } });

    this.logger.info(`Created transfer decision: ${id} for ${params.player.name}`);
    this.incrementCounter('sports_transfer_decisions_created', 1);

    // Log to CendiaAuditService for enterprise compliance
    await cendiaAuditService.logEvent({
      organizationId: params.organizationId,
      userId: params.userId,
      eventType: 'decision.created' as AuditEventType,
      action: 'sports_transfer_decision_created',
      resourceType: 'sports_transfer_decision',
      resourceId: id,
      resourceName: `Transfer: ${params.player.name}`,
      summary: `Created ${params.transactionType} transfer decision for ${params.player.name}`,
      details: {
        player: params.player.name,
        counterpartyClub: params.counterpartyClub.name,
        transferFee: params.transferFee,
        transactionType: params.transactionType,
      },
      complianceFrameworks: ['UEFA_FFP', 'FIFA_AGENT_REGS'],
      sensitivityLevel: 'confidential',
    });

    return decision;
  }

  async getTransferDecision(decisionId: string): Promise<TransferDecision | null> {
    return this.transferDecisions.get(decisionId) || null;
  }

  async updateTransferDecision(
    decisionId: string,
    userId: string,
    updates: Partial<Omit<TransferDecision, 'id' | 'organizationId' | 'createdAt' | 'createdBy'>>
  ): Promise<TransferDecision> {
    const decision = this.transferDecisions.get(decisionId);
    if (!decision) {
      throw new Error('Transfer decision not found');
    }

    if (decision.status === 'completed' || decision.lockedAt) {
      throw new Error('Cannot update locked or completed decision');
    }

    const now = new Date();
    
    Object.assign(decision, updates, { updatedAt: now });
    
    decision.timeline.push({
      timestamp: now,
      action: 'updated',
      actor: userId,
      details: { fields: Object.keys(updates) },
    });

    // Recalculate audit hash
    decision.auditHash = this.calculateAuditHash(decision);

    return decision;
  }

  async addScoutingAssessment(
    decisionId: string,
    userId: string,
    assessment: TransferDecision['scoutingAssessment']
  ): Promise<TransferDecision> {
    const decision = this.transferDecisions.get(decisionId);
    if (!decision) {
      throw new Error('Transfer decision not found');
    }

    decision.scoutingAssessment = assessment;
    decision.updatedAt = new Date();
    
    decision.timeline.push({
      timestamp: new Date(),
      action: 'scouting_assessment_added',
      actor: userId,
      details: { recommendation: assessment.recommendation },
    });

    return decision;
  }

  async addValuation(
    decisionId: string,
    userId: string,
    valuation: TransferDecision['valuation']
  ): Promise<TransferDecision> {
    const decision = this.transferDecisions.get(decisionId);
    if (!decision) {
      throw new Error('Transfer decision not found');
    }

    decision.valuation = valuation;
    decision.updatedAt = new Date();
    
    decision.timeline.push({
      timestamp: new Date(),
      action: 'valuation_added',
      actor: userId,
      details: { 
        internalValuation: valuation.internalValuation,
        negotiatedFee: valuation.negotiatedFee,
        premium: valuation.premium,
      },
    });

    return decision;
  }

  async addAlternative(
    decisionId: string,
    userId: string,
    alternative: TransferDecision['alternativesConsidered'][0]
  ): Promise<TransferDecision> {
    const decision = this.transferDecisions.get(decisionId);
    if (!decision) {
      throw new Error('Transfer decision not found');
    }

    decision.alternativesConsidered.push(alternative);
    decision.updatedAt = new Date();
    
    decision.timeline.push({
      timestamp: new Date(),
      action: 'alternative_added',
      actor: userId,
      details: { player: alternative.playerName },
    });

    return decision;
  }

  async attachEvidence(
    decisionId: string,
    userId: string,
    evidence: {
      type: string;
      filename: string;
      mimeType?: string;
      sizeBytes?: number;
      content?: Buffer;
      description?: string;
    }
  ): Promise<TransferDecision> {
    const decision = this.transferDecisions.get(decisionId);
    if (!decision) {
      throw new Error('Transfer decision not found');
    }

    if (decision.lockedAt) {
      throw new Error('Cannot attach evidence to locked decision');
    }

    // Generate hash for integrity verification
    const contentHash = evidence.content 
      ? crypto.createHash('sha256').update(evidence.content).digest('hex')
      : crypto.createHash('sha256').update(evidence.filename + Date.now()).digest('hex');

    const attachment: TransferDecision['evidenceAttachments'][0] = {
      id: `evd-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`,
      type: evidence.type,
      filename: evidence.filename,
      uploadedAt: new Date(),
      uploadedBy: userId,
      hash: contentHash,
    };

    decision.evidenceAttachments.push(attachment);
    decision.updatedAt = new Date();

    decision.timeline.push({
      timestamp: new Date(),
      action: 'evidence_attached',
      actor: userId,
      details: {
        evidenceType: evidence.type,
        filename: evidence.filename,
        hash: contentHash.substring(0, 16) + '...',
      },
    });

    this.logger.info(`Attached evidence ${attachment.id} (${evidence.type}) to decision ${decisionId}`);

    return decision;
  }

  async submitForApproval(decisionId: string, userId: string): Promise<TransferDecision> {
    const decision = this.transferDecisions.get(decisionId);
    if (!decision) {
      throw new Error('Transfer decision not found');
    }

    // Validate required fields
    const template = getTemplateById(decision.templateId);
    if (template) {
      const missingEvidence = template.evidenceRequirements
        .filter(e => e.mandatory)
        .filter(e => !decision.evidenceAttachments.some(a => a.type === e.type));
      
      if (missingEvidence.length > 0) {
        this.logger.warn(`Missing evidence for decision ${decisionId}: ${missingEvidence.map(e => e.type).join(', ')}`);
        // Allow submission but log warning; ROADMAP: enforce validation
      }
    }

    decision.status = 'pending_approval';
    decision.updatedAt = new Date();
    
    decision.timeline.push({
      timestamp: new Date(),
      action: 'submitted_for_approval',
      actor: userId,
      details: { requiredApprovers: decision.approvals.map(a => a.role) },
    });

    this.logger.info(`Transfer decision ${decisionId} submitted for approval`);

    return decision;
  }

  async recordApproval(
    decisionId: string,
    userId: string,
    userName: string,
    role: string,
    approved: boolean,
    comments?: string
  ): Promise<TransferDecision> {
    const decision = this.transferDecisions.get(decisionId);
    if (!decision) {
      throw new Error('Transfer decision not found');
    }

    const approval = decision.approvals.find(a => a.role === role && a.decision === 'pending');
    if (!approval) {
      throw new Error(`No pending approval found for role: ${role}`);
    }

    approval.userId = userId;
    approval.userName = userName;
    approval.decision = approved ? 'approved' : 'rejected';
    approval.timestamp = new Date();
    if (comments) {
      approval.comments = comments;
    }

    decision.updatedAt = new Date();
    
    decision.timeline.push({
      timestamp: new Date(),
      action: approved ? 'approved' : 'rejected',
      actor: userId,
      details: { role, comments },
    });

    // Check if all approvals are complete
    const allApproved = decision.approvals.every(a => a.decision === 'approved');
    const anyRejected = decision.approvals.some(a => a.decision === 'rejected');

    if (anyRejected) {
      decision.status = 'rejected';
    } else if (allApproved) {
      decision.status = 'approved';
    }

    return decision;
  }

  async completeDecision(decisionId: string, userId: string): Promise<TransferDecision> {
    const decision = this.transferDecisions.get(decisionId);
    if (!decision) {
      throw new Error('Transfer decision not found');
    }

    if (decision.status !== 'approved') {
      throw new Error('Can only complete approved decisions');
    }

    decision.status = 'completed';
    decision.lockedAt = new Date();
    decision.updatedAt = new Date();
    decision.auditHash = this.calculateAuditHash(decision);
    
    decision.timeline.push({
      timestamp: new Date(),
      action: 'completed_and_locked',
      actor: userId,
      details: { auditHash: decision.auditHash },
    });

    this.logger.info(`Transfer decision ${decisionId} completed and locked`);

    // Log finalization to audit trail
    await cendiaAuditService.logEvent({
      organizationId: decision.organizationId,
      userId,
      eventType: 'decision.finalized' as AuditEventType,
      severity: 'compliance',
      action: 'sports_transfer_decision_completed',
      resourceType: 'sports_transfer_decision',
      resourceId: decisionId,
      resourceName: `Transfer: ${decision.player.name}`,
      summary: `Finalized and locked ${decision.transactionType} transfer decision for ${decision.player.name}`,
      details: {
        player: decision.player.name,
        counterpartyClub: decision.counterpartyClub.name,
        transferFee: decision.transferFee,
        addOns: decision.addOns,
        agentFee: decision.agentFee,
        auditHash: decision.auditHash,
        approvals: decision.approvals.filter(a => a.decision === 'approved').map(a => ({
          role: a.role,
          userName: a.userName,
          timestamp: a.timestamp,
        })),
      },
      complianceFrameworks: ['UEFA_FFP', 'FIFA_AGENT_REGS', 'DOMESTIC_PSR'],
      sensitivityLevel: 'confidential',
    });

    return decision;
  }

  // ---------------------------------------------------------------------------
  // FFP IMPACT ASSESSMENT
  // ---------------------------------------------------------------------------

  async assessFFPImpact(
    decisionId: string,
    currentPosition: {
      breakEvenPosition: number;
      squadCostRatio: number;
    }
  ): Promise<FFPImpactAssessment> {
    const decision = this.transferDecisions.get(decisionId);
    if (!decision) {
      throw new Error('Transfer decision not found');
    }

    const contractYears = decision.wages?.contractLength || 4;
    const annualAmortization = decision.transferFee / contractYears;
    const annualWageCost = (decision.wages?.weekly || 0) * 52;
    const ffpChargeYear1 = annualAmortization + annualWageCost + decision.agentFee;

    const projectedBreakEven = currentPosition.breakEvenPosition - ffpChargeYear1;
    
    let risk: FFPImpactAssessment['risk'] = 'low';
    if (projectedBreakEven < 0) {
      risk = 'critical';
    } else if (projectedBreakEven < 10000000) {
      risk = 'high';
    } else if (projectedBreakEven < 30000000) {
      risk = 'medium';
    }

    return {
      decisionId,
      assessedAt: new Date(),
      currentBreakEvenPosition: currentPosition.breakEvenPosition,
      currentSquadCostRatio: currentPosition.squadCostRatio,
      immediateImpact: {
        cashOutflow: decision.transferFee + decision.agentFee,
        annualWageCost,
        amortizationPerYear: annualAmortization,
        ffpChargeYear1,
      },
      projectedBreakEvenPosition: projectedBreakEven,
      projectedSquadCostRatio: currentPosition.squadCostRatio, // Would need more data to calculate
      remainingHeadroom: projectedBreakEven,
      risk,
      notes: risk === 'critical' 
        ? 'This transaction would breach FFP limits' 
        : risk === 'high'
        ? 'Limited headroom remaining after this transaction'
        : 'Transaction within comfortable FFP limits',
    };
  }

  // ---------------------------------------------------------------------------
  // EXPORT & REPORTING
  // ---------------------------------------------------------------------------

  async exportDecisionRecord(decisionId: string): Promise<{
    decision: TransferDecision | ContractDecision;
    complianceMapping: Record<string, ComplianceFramework>;
    integrityVerified: boolean;
  }> {
    let decision: TransferDecision | ContractDecision | undefined = 
      this.transferDecisions.get(decisionId);
    
    if (!decision) {
      decision = this.contractDecisions.get(decisionId);
    }
    
    if (!decision) {
      throw new Error('Decision not found');
    }

    // Verify integrity
    const currentHash = this.calculateAuditHash(decision);
    const integrityVerified = decision.auditHash === currentHash;

    // Get compliance framework details
    const complianceMapping: Record<string, ComplianceFramework> = {};
    const checks = 'complianceChecks' in decision ? decision.complianceChecks : [];
    for (const check of checks) {
      const framework = getFrameworkById(check.framework);
      if (framework) {
        complianceMapping[check.framework] = framework;
      }
    }

    return {
      decision,
      complianceMapping,
      integrityVerified,
    };
  }

  async getOrganizationDecisions(
    organizationId: string,
    options?: {
      type?: 'transfer' | 'contract';
      status?: string;
      limit?: number;
    }
  ): Promise<Array<TransferDecision | ContractDecision>> {
    const orgData = this.orgIndex.get(organizationId);
    if (!orgData) {
      return [];
    }

    const decisions: Array<TransferDecision | ContractDecision> = [];

    if (!options?.type || options.type === 'transfer') {
      for (const id of orgData.transfers) {
        const decision = this.transferDecisions.get(id);
        if (decision && (!options?.status || decision.status === options.status)) {
          decisions.push(decision);
        }
      }
    }

    if (!options?.type || options.type === 'contract') {
      for (const id of orgData.contracts) {
        const decision = this.contractDecisions.get(id);
        if (decision && (!options?.status || decision.status === options.status)) {
          decisions.push(decision);
        }
      }
    }

    return decisions.slice(0, options?.limit || 50);
  }

  // ---------------------------------------------------------------------------
  // PRIVATE HELPERS
  // ---------------------------------------------------------------------------

  private determineApprovers(template: DecisionTemplate, totalValue: number): string[] {
    for (const threshold of template.approvalThresholds) {
      if (threshold.condition === 'default') {
        return threshold.approvers;
      }
      
      // Simplified implementation; ROADMAP: would use proper expression parser
      if (threshold.condition.includes('>')) {
        const parts = threshold.condition.split('>');
        const valueStr = parts[1];
        if (valueStr) {
          const thresholdValue = parseInt(valueStr.trim(), 10);
          if (!isNaN(thresholdValue) && totalValue > thresholdValue) {
            return threshold.approvers;
          }
        }
      }
    }
    
    return ['sporting_director'];
  }

  private updateOrgIndex(organizationId: string, type: 'transfers' | 'contracts', id: string): void {
    let orgData = this.orgIndex.get(organizationId);
    if (!orgData) {
      orgData = { transfers: [], contracts: [] };
      this.orgIndex.set(organizationId, orgData);
    }
    
    orgData[type].unshift(id);
    if (orgData[type].length > 500) {
      orgData[type] = orgData[type].slice(0, 500);
    }
  }

  private calculateAuditHash(decision: TransferDecision | ContractDecision): string {
    const data = JSON.stringify({
      id: decision.id,
      organizationId: decision.organizationId,
      templateId: decision.templateId,
      status: decision.status,
      createdAt: decision.createdAt,
      timeline: decision.timeline,
      approvals: decision.approvals,
      evidenceAttachments: decision.evidenceAttachments.map(e => e.hash),
    });
    
    return crypto.createHash('sha256').update(data).digest('hex');
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'SportsDecision', recordType: 'transfer_decision', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.transferDecisions.has(d.id)) this.transferDecisions.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'SportsDecision', recordType: 'transfer_decision', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.contractDecisions.has(d.id)) this.contractDecisions.set(d.id, d);


      }


      restored += recs_1.length;


      const recs_2 = await loadServiceRecords({ serviceName: 'SportsDecision', recordType: 'transfer_decision', limit: 1000 });


      for (const rec of recs_2) {


        const d = rec.data as any;


        if (d?.id && !this.orgIndex.has(d.id)) this.orgIndex.set(d.id, d);


      }


      restored += recs_2.length;


      if (restored > 0) logger.info(`[SportsDecisionService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[SportsDecisionService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

export const sportsDecisionService = new SportsDecisionService();
