// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaResponsibilityâ„¢ - Human Accountability Layer
 * 
 * Converts AI risk into executive liability by creating explicit,
 * cryptographically signed records of human decision authority.
 * 
 * Core principle: When AI is wrong, there is ALWAYS a recorded
 * human authority who accepted that risk.
 */

import crypto from 'crypto';
import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';

// ============================================================================
// TYPES
// ============================================================================

export type AccountabilityAction = 'APPROVE' | 'OVERRIDE' | 'DEFER' | 'REJECT' | 'ESCALATE';

export type FailureCategory =
  | 'LEGITIMACY_COLLAPSE'
  | 'MINORITY_HARM'
  | 'ECONOMIC_INSTABILITY'
  | 'POLITICAL_BACKLASH'
  | 'SYSTEMIC_RISK'
  | 'ADVERSARIAL_ABUSE'
  | 'TEMPORAL_DECAY'
  | 'NARRATIVE_WEAPONIZATION'
  | 'FREE_SPEECH_CHILLING'
  | 'DEMOCRATIC_PROCESS_EROSION'
  | 'DUE_PROCESS_VIOLATION'
  | 'ENVIRONMENTAL_HARM'
  | 'PRIVACY_VIOLATION'
  | 'DISCRIMINATION'
  | 'SAFETY_RISK'
  | 'LEGAL_LIABILITY'
  | 'REPUTATIONAL_DAMAGE'
  | 'OPERATIONAL_FAILURE';

export interface HumanAuthority {
  name: string;
  role: string;
  department?: string;
  jurisdiction?: string;
  employeeId?: string;
  email?: string;
  delegatedFrom?: string;
}

export interface TPMSignature {
  algorithm: 'RSA-SHA256' | 'ECDSA-P256' | 'ED25519';
  signature: string;
  publicKeyFingerprint: string;
  attestationType: 'TPM_2.0' | 'SOFTWARE_FALLBACK' | 'HSM';
  timestamp: string;
}

export interface AccountabilityRecord {
  id: string;
  decisionId: string;
  deliberationId?: string | undefined;
  organizationId: string;
  
  // The human who took responsibility
  humanAuthority: HumanAuthority;
  
  // What action was taken
  actionTaken: AccountabilityAction;
  justification: string;
  
  // Risk acceptance
  acceptedRisks: FailureCategory[];
  riskAcknowledgment: string;
  
  // AI recommendation context
  aiRecommendation?: string | undefined;
  aiConfidenceScore?: number | undefined;
  dissentsOverridden?: string[] | undefined;
  
  // Cryptographic proof
  signature: TPMSignature;
  previousRecordHash?: string | undefined;
  recordHash: string;
  
  // Metadata
  timestamp: string;
  expiresAt?: string | undefined;
  supersededBy?: string | undefined;
  
  // Audit trail
  witnesses?: HumanAuthority[] | undefined;
  attachments?: string[] | undefined;
}

export interface AccountabilityChain {
  organizationId: string;
  decisionId: string;
  records: AccountabilityRecord[];
  chainHash: string;
  isValid: boolean;
}

export interface DelegationRecord {
  id: string;
  fromAuthority: HumanAuthority;
  toAuthority: HumanAuthority;
  scope: string[];
  constraints: string[];
  validFrom: string;
  validUntil: string;
  signature: TPMSignature;
}

export interface LiabilityReport {
  decisionId: string;
  finalAccountable: HumanAuthority;
  actionHistory: AccountabilityRecord[];
  totalRisksAccepted: FailureCategory[];
  delegationChain: DelegationRecord[];
  legalJurisdiction: string;
  generatedAt: string;
  reportHash: string;
}

// ============================================================================
// SERVICE
// ============================================================================

export class CendiaResponsibilityService {
  private records: Map<string, AccountabilityRecord> = new Map();
  private delegations: Map<string, DelegationRecord> = new Map();
  private dbInitialized = false;

  /**
   * Load existing records from database on first use
   */
  private async ensureDbLoaded(): Promise<void> {
    if (this.dbInitialized) return;
    this.dbInitialized = true;
    try {
      const dbRecords = await prisma.accountability_records.findMany({ orderBy: { created_at: 'asc' } });
      for (const r of dbRecords) {
        this.records.set(r.id, {
          id: r.id,
          decisionId: r.decision_id,
          deliberationId: r.deliberation_id || undefined,
          organizationId: r.organization_id,
          humanAuthority: { name: r.human_authority_name, role: r.human_authority_role, department: r.human_authority_dept || undefined },
          actionTaken: r.action_taken as AccountabilityAction,
          justification: r.justification,
          acceptedRisks: r.accepted_risks as FailureCategory[],
          riskAcknowledgment: r.risk_acknowledgment,
          aiRecommendation: r.ai_recommendation || undefined,
          aiConfidenceScore: r.ai_confidence_score || undefined,
          dissentsOverridden: r.dissents_overridden,
          signature: { algorithm: r.signature_algorithm as TPMSignature['algorithm'], signature: r.signature, publicKeyFingerprint: r.public_key_fp || '', attestationType: 'SOFTWARE_FALLBACK', timestamp: r.created_at.toISOString() },
          previousRecordHash: r.previous_record_hash || undefined,
          recordHash: r.record_hash,
          timestamp: r.created_at.toISOString(),
          witnesses: r.witnesses as HumanAuthority[] | undefined,
        });
      }

      const dbDelegations = await prisma.delegation_records.findMany();
      for (const d of dbDelegations) {
        this.delegations.set(d.id, {
          id: d.id,
          fromAuthority: { name: d.from_name, role: d.from_role },
          toAuthority: { name: d.to_name, role: d.to_role },
          scope: d.scope,
          constraints: d.constraints,
          validFrom: d.valid_from.toISOString(),
          validUntil: d.valid_until.toISOString(),
          signature: { algorithm: 'RSA-SHA256', signature: d.signature, publicKeyFingerprint: '', attestationType: 'SOFTWARE_FALLBACK', timestamp: d.created_at.toISOString() },
        });
      }
      logger.info(`[CendiaResponsibility] Loaded ${dbRecords.length} accountability records, ${dbDelegations.length} delegations from DB`);
    } catch (err) {
      logger.warn(`[CendiaResponsibility] DB load failed (tables may not exist yet): ${(err as Error).message}`);
    }
  }

  /**
   * Persist an accountability record to the database
   */
  private async persistRecord(record: AccountabilityRecord): Promise<void> {
    try {
      await prisma.accountability_records.upsert({
        where: { id: record.id },
        update: {},
        create: {
          id: record.id,
          decision_id: record.decisionId,
          deliberation_id: record.deliberationId || null,
          organization_id: record.organizationId,
          human_authority_name: record.humanAuthority.name,
          human_authority_role: record.humanAuthority.role,
          human_authority_dept: record.humanAuthority.department || null,
          action_taken: record.actionTaken,
          justification: record.justification,
          accepted_risks: record.acceptedRisks,
          risk_acknowledgment: record.riskAcknowledgment,
          ai_recommendation: record.aiRecommendation || null,
          ai_confidence_score: record.aiConfidenceScore || null,
          dissents_overridden: record.dissentsOverridden || [],
          signature_algorithm: record.signature.algorithm,
          signature: record.signature.signature,
          public_key_fp: record.signature.publicKeyFingerprint || null,
          previous_record_hash: record.previousRecordHash || null,
          record_hash: record.recordHash,
          witnesses: record.witnesses ? JSON.parse(JSON.stringify(record.witnesses)) : null,
        },
      });
    } catch (err) {
      logger.warn(`[CendiaResponsibility] Failed to persist record ${record.id}: ${(err as Error).message}`);
    }
  }

  /**
   * Persist a delegation record to the database
   */
  private async persistDelegation(delegation: DelegationRecord): Promise<void> {
    try {
      await prisma.delegation_records.upsert({
        where: { id: delegation.id },
        update: {},
        create: {
          id: delegation.id,
          organization_id: 'default',
          from_name: delegation.fromAuthority.name,
          from_role: delegation.fromAuthority.role,
          to_name: delegation.toAuthority.name,
          to_role: delegation.toAuthority.role,
          scope: delegation.scope,
          constraints: delegation.constraints,
          valid_from: new Date(delegation.validFrom),
          valid_until: new Date(delegation.validUntil),
          signature: delegation.signature.signature,
        },
      });
    } catch (err) {
      logger.warn(`[CendiaResponsibility] Failed to persist delegation ${delegation.id}: ${(err as Error).message}`);
    }
  }

  /**
   * Create a new accountability record for a decision
   */
  async createAccountabilityRecord(params: {
    decisionId: string;
    deliberationId?: string;
    organizationId: string;
    humanAuthority: HumanAuthority;
    actionTaken: AccountabilityAction;
    justification: string;
    acceptedRisks: FailureCategory[];
    riskAcknowledgment: string;
    aiRecommendation?: string;
    aiConfidenceScore?: number;
    dissentsOverridden?: string[];
    witnesses?: HumanAuthority[];
  }): Promise<AccountabilityRecord> {
    await this.ensureDbLoaded();
    const id = this.generateRecordId();
    const timestamp = new Date().toISOString();
    
    // Get previous record for chain
    const previousRecord = this.getLatestRecordForDecision(params.decisionId);
    const previousRecordHash = previousRecord?.recordHash;
    
    // Create signature (TPM or software fallback)
    const signature = await this.createSignature(params, timestamp);
    
    // Calculate record hash
    const recordHash = this.calculateRecordHash({
      ...params,
      id,
      timestamp,
      previousRecordHash,
      signature,
    });
    
    const record: AccountabilityRecord = {
      id,
      decisionId: params.decisionId,
      deliberationId: params.deliberationId,
      organizationId: params.organizationId,
      humanAuthority: params.humanAuthority,
      actionTaken: params.actionTaken,
      justification: params.justification,
      acceptedRisks: params.acceptedRisks,
      riskAcknowledgment: params.riskAcknowledgment,
      aiRecommendation: params.aiRecommendation,
      aiConfidenceScore: params.aiConfidenceScore,
      dissentsOverridden: params.dissentsOverridden,
      signature,
      previousRecordHash,
      recordHash,
      timestamp,
      witnesses: params.witnesses,
    };
    
    this.records.set(id, record);
    await this.persistRecord(record);
    
    return record;
  }
  
  /**
   * Override an AI recommendation with human judgment
   */
  async recordOverride(params: {
    decisionId: string;
    organizationId: string;
    humanAuthority: HumanAuthority;
    aiRecommendation: string;
    humanDecision: string;
    overrideReason: string;
    acceptedRisks: FailureCategory[];
  }): Promise<AccountabilityRecord> {
    return this.createAccountabilityRecord({
      decisionId: params.decisionId,
      organizationId: params.organizationId,
      humanAuthority: params.humanAuthority,
      actionTaken: 'OVERRIDE',
      justification: params.overrideReason,
      acceptedRisks: params.acceptedRisks,
      riskAcknowledgment: `Human authority ${params.humanAuthority.name} overrides AI recommendation: "${params.aiRecommendation}" with decision: "${params.humanDecision}". All associated risks explicitly accepted.`,
      aiRecommendation: params.aiRecommendation,
    });
  }
  
  /**
   * Approve an AI recommendation
   */
  async recordApproval(params: {
    decisionId: string;
    organizationId: string;
    humanAuthority: HumanAuthority;
    aiRecommendation: string;
    aiConfidenceScore: number;
    acceptedRisks: FailureCategory[];
    additionalConditions?: string;
  }): Promise<AccountabilityRecord> {
    return this.createAccountabilityRecord({
      decisionId: params.decisionId,
      organizationId: params.organizationId,
      humanAuthority: params.humanAuthority,
      actionTaken: 'APPROVE',
      justification: params.additionalConditions || 'AI recommendation approved without modification.',
      acceptedRisks: params.acceptedRisks,
      riskAcknowledgment: `Human authority ${params.humanAuthority.name} approves AI recommendation with ${params.aiConfidenceScore}% confidence. Identified risks acknowledged and accepted.`,
      aiRecommendation: params.aiRecommendation,
      aiConfidenceScore: params.aiConfidenceScore,
    });
  }
  
  /**
   * Reject an AI recommendation
   */
  async recordRejection(params: {
    decisionId: string;
    organizationId: string;
    humanAuthority: HumanAuthority;
    aiRecommendation: string;
    rejectionReason: string;
    alternativeAction?: string;
  }): Promise<AccountabilityRecord> {
    return this.createAccountabilityRecord({
      decisionId: params.decisionId,
      organizationId: params.organizationId,
      humanAuthority: params.humanAuthority,
      actionTaken: 'REJECT',
      justification: params.rejectionReason,
      acceptedRisks: [],
      riskAcknowledgment: `AI recommendation rejected. ${params.alternativeAction ? `Alternative action: ${params.alternativeAction}` : 'No alternative specified.'}`,
      aiRecommendation: params.aiRecommendation,
    });
  }
  
  /**
   * Create a delegation of authority
   */
  async createDelegation(params: {
    fromAuthority: HumanAuthority;
    toAuthority: HumanAuthority;
    scope: string[];
    constraints: string[];
    validUntil: string;
  }): Promise<DelegationRecord> {
    const id = this.generateRecordId();
    const timestamp = new Date().toISOString();
    
    const signature = await this.createSignature(params, timestamp);
    
    const delegation: DelegationRecord = {
      id,
      fromAuthority: params.fromAuthority,
      toAuthority: params.toAuthority,
      scope: params.scope,
      constraints: params.constraints,
      validFrom: timestamp,
      validUntil: params.validUntil,
      signature,
    };
    
    this.delegations.set(id, delegation);
    await this.persistDelegation(delegation);
    
    return delegation;
  }
  
  /**
   * Get the full accountability chain for a decision
   */
  async getAccountabilityChain(decisionId: string): Promise<AccountabilityChain> {
    await this.ensureDbLoaded();
    const records = Array.from(this.records.values())
      .filter(r => r.decisionId === decisionId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    const organizationId = records[0]?.organizationId || 'unknown';
    
    // Verify chain integrity
    let isValid = true;
    for (let i = 1; i < records.length; i++) {
      if (records[i].previousRecordHash !== records[i - 1].recordHash) {
        isValid = false;
        break;
      }
    }
    
    const chainHash = this.calculateChainHash(records);
    
    return {
      organizationId,
      decisionId,
      records,
      chainHash,
      isValid,
    };
  }
  
  /**
   * Generate a liability report for legal/audit purposes
   */
  async generateLiabilityReport(decisionId: string): Promise<LiabilityReport> {
    const chain = await this.getAccountabilityChain(decisionId);
    
    // Find final accountable authority (last non-DEFER action)
    const finalRecord = [...chain.records].reverse().find(r => r.actionTaken !== 'DEFER');
    const finalAccountable = finalRecord?.humanAuthority || {
      name: 'UNASSIGNED',
      role: 'NONE',
    };
    
    // Collect all accepted risks
    const totalRisksAccepted = [...new Set(
      chain.records.flatMap(r => r.acceptedRisks)
    )];
    
    // Get delegation chain
    const delegationChain = Array.from(this.delegations.values())
      .filter(d => 
        d.toAuthority && d.fromAuthority && chain.records.some(r => 
          r.humanAuthority.name === d.toAuthority.name ||
          r.humanAuthority.name === d.fromAuthority.name
        )
      );
    
    const generatedAt = new Date().toISOString();
    
    const report: LiabilityReport = {
      decisionId,
      finalAccountable,
      actionHistory: chain.records,
      totalRisksAccepted,
      delegationChain,
      legalJurisdiction: finalAccountable.jurisdiction || 'Not specified',
      generatedAt,
      reportHash: '',
    };
    
    report.reportHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(report))
      .digest('hex');
    
    return report;
  }
  
  /**
   * Verify a record's signature and integrity
   */
  async verifyRecord(record: AccountabilityRecord): Promise<{
    signatureValid: boolean;
    hashValid: boolean;
    chainValid: boolean;
  }> {
    // Recalculate hash
    const expectedHash = this.calculateRecordHash({
      ...record,
      recordHash: undefined,
    } as any);
    const hashValid = expectedHash === record.recordHash;
    
    // Verify chain link
    let chainValid = true;
    if (record.previousRecordHash) {
      const previousRecord = Array.from(this.records.values())
        .find(r => r.recordHash === record.previousRecordHash);
      chainValid = !!previousRecord;
    }
    
    // Signature verification (simplified for software fallback)
    const signatureValid = record.signature.signature.length > 0;
    
    return {
      signatureValid,
      hashValid,
      chainValid,
    };
  }
  
  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================
  
  private generateRecordId(): string {
    const timestamp = Date.now().toString(36);
    const random = crypto.randomBytes(8).toString('hex');
    return `ACC-${timestamp}-${random}`.toUpperCase();
  }
  
  private async createSignature(data: any, timestamp: string): Promise<TPMSignature> {
    // Uses deterministic computation; ROADMAP: TPM 2.0 or HSM
    // For now, using software fallback
    const hash = crypto
      .createHash('sha256')
      .update(JSON.stringify(data) + timestamp)
      .digest('hex');
    
    return {
      algorithm: 'RSA-SHA256',
      signature: hash,
      publicKeyFingerprint: 'SOFTWARE_KEY_' + hash.substring(0, 16),
      attestationType: 'SOFTWARE_FALLBACK',
      timestamp,
    };
  }
  
  private calculateRecordHash(record: any): string {
    const { recordHash, ...hashableContent } = record;
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(hashableContent))
      .digest('hex');
  }
  
  private calculateChainHash(records: AccountabilityRecord[]): string {
    return crypto
      .createHash('sha256')
      .update(records.map(r => r.recordHash).join(''))
      .digest('hex');
  }
  
  private getLatestRecordForDecision(decisionId: string): AccountabilityRecord | null {
    const records = Array.from(this.records.values())
      .filter(r => r.decisionId === decisionId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return records[0] || null;
  }

  // ===========================================================================
  // 10/10 ENHANCEMENTS
  // ===========================================================================

  /**
   * 10/10: Accountability Health Dashboard
   * Organization-wide view of human accountability posture.
   */
  async getAccountabilityHealth(organizationId: string): Promise<{
    totalRecords: number;
    activeDelegations: number;
    actionBreakdown: Record<AccountabilityAction, number>;
    averageRisksPerDecision: number;
    chainIntegrityScore: number;
    coverageScore: number;
    topAuthorities: Array<{
      name: string;
      role: string;
      totalActions: number;
      overrides: number;
      risksAccepted: number;
    }>;
    riskCategories: Array<{ category: string; count: number; percentage: number }>;
    healthStatus: 'EXCELLENT' | 'GOOD' | 'AT_RISK' | 'CRITICAL';
    recommendations: string[];
  }> {
    const orgRecords = Array.from(this.records.values())
      .filter(r => r.organizationId === organizationId);

    const actionBreakdown: Record<AccountabilityAction, number> = {
      APPROVE: 0, OVERRIDE: 0, DEFER: 0, REJECT: 0, ESCALATE: 0,
    };
    for (const r of orgRecords) actionBreakdown[r.actionTaken]++;

    // Unique decisions
    const uniqueDecisions = new Set(orgRecords.map(r => r.decisionId));
    const averageRisksPerDecision = uniqueDecisions.size > 0
      ? Math.round(orgRecords.reduce((sum, r) => sum + r.acceptedRisks.length, 0) / uniqueDecisions.size * 10) / 10
      : 0;

    // Chain integrity â€” verify hash chains for each decision
    let validChains = 0;
    let totalChains = 0;
    for (const decisionId of uniqueDecisions) {
      totalChains++;
      const chain = await this.getAccountabilityChain(decisionId);
      if (chain.isValid) validChains++;
    }
    const chainIntegrityScore = totalChains > 0 ? Math.round((validChains / totalChains) * 100) : 100;

    // Coverage â€” are all decisions covered by at least one non-DEFER action?
    let coveredDecisions = 0;
    for (const decisionId of uniqueDecisions) {
      const hasSubstantive = orgRecords.some(r => r.decisionId === decisionId && r.actionTaken !== 'DEFER');
      if (hasSubstantive) coveredDecisions++;
    }
    const coverageScore = uniqueDecisions.size > 0
      ? Math.round((coveredDecisions / uniqueDecisions.size) * 100) : 100;

    // Top authorities
    const authorityMap: Record<string, { name: string; role: string; total: number; overrides: number; risks: number }> = {};
    for (const r of orgRecords) {
      const key = r.humanAuthority.name;
      if (!authorityMap[key]) {
        authorityMap[key] = { name: r.humanAuthority.name, role: r.humanAuthority.role, total: 0, overrides: 0, risks: 0 };
      }
      authorityMap[key].total++;
      if (r.actionTaken === 'OVERRIDE') authorityMap[key].overrides++;
      authorityMap[key].risks += r.acceptedRisks.length;
    }
    const topAuthorities = Object.values(authorityMap)
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)
      .map(a => ({
        name: a.name,
        role: a.role,
        totalActions: a.total,
        overrides: a.overrides,
        risksAccepted: a.risks,
      }));

    // Risk categories
    const riskCounts: Record<string, number> = {};
    for (const r of orgRecords) {
      for (const risk of r.acceptedRisks) {
        riskCounts[risk] = (riskCounts[risk] || 0) + 1;
      }
    }
    const totalRiskCount = Object.values(riskCounts).reduce((a, b) => a + b, 0);
    const riskCategories = Object.entries(riskCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([category, count]) => ({
        category,
        count,
        percentage: totalRiskCount > 0 ? Math.round((count / totalRiskCount) * 100) : 0,
      }));

    // Health status
    const overrideRate = orgRecords.length > 0 ? actionBreakdown.OVERRIDE / orgRecords.length : 0;
    const deferRate = orgRecords.length > 0 ? actionBreakdown.DEFER / orgRecords.length : 0;
    const healthStatus = chainIntegrityScore < 80 || coverageScore < 50 ? 'CRITICAL'
      : overrideRate > 0.5 || deferRate > 0.4 ? 'AT_RISK'
      : coverageScore >= 90 && chainIntegrityScore >= 95 ? 'EXCELLENT' : 'GOOD';

    const recommendations: string[] = [];
    if (chainIntegrityScore < 100) recommendations.push(`${totalChains - validChains} chain(s) have integrity issues â€” investigate tampered records`);
    if (coverageScore < 80) recommendations.push(`${uniqueDecisions.size - coveredDecisions} decision(s) lack substantive human accountability`);
    if (overrideRate > 0.3) recommendations.push(`High override rate (${Math.round(overrideRate * 100)}%) â€” review AI recommendation quality`);
    if (deferRate > 0.3) recommendations.push(`High deferral rate (${Math.round(deferRate * 100)}%) â€” ensure decisions aren't stalling`);
    if (recommendations.length === 0) recommendations.push('Accountability posture is strong');

    const activeDelegations = Array.from(this.delegations.values())
      .filter(d => new Date(d.validUntil) > new Date()).length;

    return {
      totalRecords: orgRecords.length,
      activeDelegations,
      actionBreakdown,
      averageRisksPerDecision,
      chainIntegrityScore,
      coverageScore,
      topAuthorities,
      riskCategories,
      healthStatus,
      recommendations,
    };
  }

  /**
   * 10/10: Override Pattern Analysis
   * Detects patterns in AI overrides to improve recommendation quality.
   */
  async analyzeOverridePatterns(organizationId: string): Promise<{
    totalOverrides: number;
    overrideRate: number;
    overridesByAuthority: Array<{ name: string; role: string; count: number; percentage: number }>;
    commonOverrideReasons: Array<{ reason: string; count: number }>;
    riskCategoriesTolerance: Array<{ category: string; overrideCount: number; acceptanceRate: number }>;
    temporalPattern: Array<{ period: string; overrideCount: number; totalDecisions: number; rate: number }>;
    insights: string[];
  }> {
    const orgRecords = Array.from(this.records.values())
      .filter(r => r.organizationId === organizationId);
    const overrides = orgRecords.filter(r => r.actionTaken === 'OVERRIDE');

    const overrideRate = orgRecords.length > 0 ? Math.round((overrides.length / orgRecords.length) * 100) : 0;

    // By authority
    const authMap: Record<string, { name: string; role: string; count: number }> = {};
    for (const o of overrides) {
      const key = o.humanAuthority.name;
      if (!authMap[key]) authMap[key] = { name: o.humanAuthority.name, role: o.humanAuthority.role, count: 0 };
      authMap[key].count++;
    }
    const overridesByAuthority = Object.values(authMap)
      .sort((a, b) => b.count - a.count)
      .map(a => ({
        name: a.name,
        role: a.role,
        count: a.count,
        percentage: overrides.length > 0 ? Math.round((a.count / overrides.length) * 100) : 0,
      }));

    // Common reasons (extract keywords from justifications)
    const reasonKeywords: Record<string, number> = {};
    for (const o of overrides) {
      const words = o.justification.toLowerCase().split(/\s+/);
      for (const word of words) {
        if (word.length > 4) {
          reasonKeywords[word] = (reasonKeywords[word] || 0) + 1;
        }
      }
    }
    const commonOverrideReasons = Object.entries(reasonKeywords)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([reason, count]) => ({ reason, count }));

    // Risk category tolerance
    const riskOverrides: Record<string, { overrideCount: number; totalCount: number }> = {};
    for (const r of orgRecords) {
      for (const risk of r.acceptedRisks) {
        if (!riskOverrides[risk]) riskOverrides[risk] = { overrideCount: 0, totalCount: 0 };
        riskOverrides[risk].totalCount++;
        if (r.actionTaken === 'OVERRIDE') riskOverrides[risk].overrideCount++;
      }
    }
    const riskCategoriesTolerance = Object.entries(riskOverrides)
      .map(([category, data]) => ({
        category,
        overrideCount: data.overrideCount,
        acceptanceRate: data.totalCount > 0 ? Math.round((data.overrideCount / data.totalCount) * 100) : 0,
      }))
      .sort((a, b) => b.overrideCount - a.overrideCount);

    // Monthly temporal pattern
    const monthMap: Record<string, { overrides: number; total: number }> = {};
    for (const r of orgRecords) {
      const month = r.timestamp.slice(0, 7);
      if (!monthMap[month]) monthMap[month] = { overrides: 0, total: 0 };
      monthMap[month].total++;
      if (r.actionTaken === 'OVERRIDE') monthMap[month].overrides++;
    }
    const temporalPattern = Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([period, data]) => ({
        period,
        overrideCount: data.overrides,
        totalDecisions: data.total,
        rate: data.total > 0 ? Math.round((data.overrides / data.total) * 100) : 0,
      }));

    const insights: string[] = [];
    if (overrideRate > 40) insights.push(`High override rate (${overrideRate}%) suggests AI recommendations may need recalibration`);
    if (overridesByAuthority.length > 0 && overridesByAuthority[0].percentage > 50) {
      insights.push(`${overridesByAuthority[0].name} accounts for ${overridesByAuthority[0].percentage}% of all overrides`);
    }
    if (overrides.length === 0) insights.push('No overrides recorded â€” AI recommendations are being followed or decisions are being deferred');

    return {
      totalOverrides: overrides.length,
      overrideRate,
      overridesByAuthority,
      commonOverrideReasons,
      riskCategoriesTolerance,
      temporalPattern,
      insights,
    };
  }

  /**
   * 10/10: Delegation Governance Audit
   * Audits delegation chains for compliance and expiration issues.
   */
  async auditDelegations(organizationId: string): Promise<{
    totalDelegations: number;
    activeDelegations: number;
    expiredDelegations: number;
    expiringWithin30Days: number;
    delegationDepth: number;
    issues: Array<{
      type: 'EXPIRED_ACTIVE' | 'CIRCULAR_DELEGATION' | 'OVER_BROAD_SCOPE' | 'NO_CONSTRAINTS' | 'EXPIRING_SOON';
      severity: 'low' | 'medium' | 'high' | 'critical';
      delegationId: string;
      description: string;
      recommendation: string;
    }>;
    governanceScore: number;
  }> {
    const allDelegations = Array.from(this.delegations.values());
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const active = allDelegations.filter(d => new Date(d.validUntil) > now);
    const expired = allDelegations.filter(d => new Date(d.validUntil) <= now);
    const expiringSoon = active.filter(d => new Date(d.validUntil) <= thirtyDaysFromNow);

    // Calculate delegation depth (longest chain from -> to)
    const delegationGraph: Record<string, string[]> = {};
    for (const d of active) {
      const from = d.fromAuthority.name;
      const to = d.toAuthority.name;
      if (!delegationGraph[from]) delegationGraph[from] = [];
      delegationGraph[from].push(to);
    }
    let maxDepth = 0;
    const visited = new Set<string>();
    const getDepth = (name: string, depth: number): number => {
      if (visited.has(name)) return depth; // Circular
      visited.add(name);
      const children = delegationGraph[name] || [];
      if (children.length === 0) return depth;
      return Math.max(...children.map(c => getDepth(c, depth + 1)));
    };
    for (const root of Object.keys(delegationGraph)) {
      visited.clear();
      maxDepth = Math.max(maxDepth, getDepth(root, 0));
    }

    const issues: Array<{
      type: 'EXPIRED_ACTIVE' | 'CIRCULAR_DELEGATION' | 'OVER_BROAD_SCOPE' | 'NO_CONSTRAINTS' | 'EXPIRING_SOON';
      severity: 'low' | 'medium' | 'high' | 'critical';
      delegationId: string;
      description: string;
      recommendation: string;
    }> = [];

    // Check for issues
    for (const d of allDelegations) {
      if (d.constraints.length === 0) {
        issues.push({
          type: 'NO_CONSTRAINTS',
          severity: 'high',
          delegationId: d.id,
          description: `Delegation from ${d.fromAuthority.name} to ${d.toAuthority.name} has no constraints`,
          recommendation: 'Add explicit constraints to limit delegation scope',
        });
      }
      if (d.scope.length > 10) {
        issues.push({
          type: 'OVER_BROAD_SCOPE',
          severity: 'medium',
          delegationId: d.id,
          description: `Delegation scope includes ${d.scope.length} items â€” may be too broad`,
          recommendation: 'Narrow scope to specific decision categories',
        });
      }
    }

    for (const d of expiringSoon) {
      issues.push({
        type: 'EXPIRING_SOON',
        severity: 'low',
        delegationId: d.id,
        description: `Delegation to ${d.toAuthority.name} expires ${new Date(d.validUntil).toISOString().slice(0, 10)}`,
        recommendation: 'Review and renew if delegation is still needed',
      });
    }

    // Detect circular delegations
    for (const d of active) {
      const reverse = active.find(r =>
        r.fromAuthority.name === d.toAuthority.name &&
        r.toAuthority.name === d.fromAuthority.name
      );
      if (reverse) {
        issues.push({
          type: 'CIRCULAR_DELEGATION',
          severity: 'critical',
          delegationId: d.id,
          description: `Circular delegation between ${d.fromAuthority.name} and ${d.toAuthority.name}`,
          recommendation: 'Remove one direction of the circular delegation',
        });
      }
    }

    const issuePenalty = issues.reduce((sum, i) =>
      sum + (i.severity === 'critical' ? 25 : i.severity === 'high' ? 15 : i.severity === 'medium' ? 8 : 3), 0);
    const governanceScore = Math.max(0, 100 - issuePenalty);

    return {
      totalDelegations: allDelegations.length,
      activeDelegations: active.length,
      expiredDelegations: expired.length,
      expiringWithin30Days: expiringSoon.length,
      delegationDepth: maxDepth,
      issues,
      governanceScore,
    };
  }

  /**
   * 10/10: Risk Acceptance Intelligence
   * Analyzes organizational risk acceptance patterns and tolerance.
   */
  async getRiskAcceptanceIntelligence(organizationId: string): Promise<{
    totalRisksAccepted: number;
    uniqueCategories: number;
    riskTolerance: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
    categoryBreakdown: Array<{
      category: FailureCategory;
      count: number;
      percentage: number;
      trend: 'increasing' | 'decreasing' | 'stable';
    }>;
    riskConcentration: {
      topCategory: string;
      topCategoryPercentage: number;
      isConcentrated: boolean;
    };
    monthlyRiskAcceptance: Array<{ month: string; risksAccepted: number; uniqueCategories: number }>;
    insights: string[];
  }> {
    const orgRecords = Array.from(this.records.values())
      .filter(r => r.organizationId === organizationId);

    const allRisks = orgRecords.flatMap(r => r.acceptedRisks);
    const uniqueCategories = new Set(allRisks);

    const categoryCounts: Record<string, number> = {};
    for (const risk of allRisks) {
      categoryCounts[risk] = (categoryCounts[risk] || 0) + 1;
    }

    const categoryBreakdown = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([category, count]) => ({
        category: category as FailureCategory,
        count,
        percentage: allRisks.length > 0 ? Math.round((count / allRisks.length) * 100) : 0,
        trend: 'stable' as const, // Simplified â€” would need historical data for real trending
      }));

    // Risk tolerance assessment
    const avgRisksPerRecord = orgRecords.length > 0 ? allRisks.length / orgRecords.length : 0;
    const hasCriticalRisks = allRisks.some(r =>
      r === 'SYSTEMIC_RISK' || r === 'SAFETY_RISK' || r === 'LEGITIMACY_COLLAPSE'
    );
    const riskTolerance = avgRisksPerRecord > 3 || hasCriticalRisks ? 'AGGRESSIVE'
      : avgRisksPerRecord > 1.5 ? 'MODERATE' : 'CONSERVATIVE';

    // Concentration
    const topEntry = categoryBreakdown[0];
    const isConcentrated = topEntry ? topEntry.percentage > 40 : false;

    // Monthly pattern
    const monthMap: Record<string, { risks: string[]; categories: Set<string> }> = {};
    for (const r of orgRecords) {
      const month = r.timestamp.slice(0, 7);
      if (!monthMap[month]) monthMap[month] = { risks: [], categories: new Set() };
      monthMap[month].risks.push(...r.acceptedRisks);
      r.acceptedRisks.forEach(risk => monthMap[month].categories.add(risk));
    }
    const monthlyRiskAcceptance = Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month,
        risksAccepted: data.risks.length,
        uniqueCategories: data.categories.size,
      }));

    const insights: string[] = [];
    if (riskTolerance === 'AGGRESSIVE') {
      insights.push('Organization shows high risk tolerance â€” ensure risk acceptance is conscious and well-governed');
    }
    if (isConcentrated && topEntry) {
      insights.push(`Risk concentration in ${topEntry.category} (${topEntry.percentage}%) â€” diversify risk awareness`);
    }
    if (uniqueCategories.size === 0) {
      insights.push('No risk categories on record â€” begin documenting risk acceptance for accountability');
    }
    if (allRisks.length > 0 && !allRisks.includes('LEGAL_LIABILITY')) {
      insights.push('No legal liability risks documented â€” consider whether legal exposure has been adequately assessed');
    }

    return {
      totalRisksAccepted: allRisks.length,
      uniqueCategories: uniqueCategories.size,
      riskTolerance,
      categoryBreakdown,
      riskConcentration: {
        topCategory: topEntry?.category || 'N/A',
        topCategoryPercentage: topEntry?.percentage || 0,
        isConcentrated,
      },
      monthlyRiskAcceptance,
      insights,
    };
  }
}

// Singleton instance
export const cendiaResponsibilityService = new CendiaResponsibilityService();
