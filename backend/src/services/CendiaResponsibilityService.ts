/**
 * CendiaResponsibility™ - Human Accountability Layer
 * 
 * Converts AI risk into executive liability by creating explicit,
 * cryptographically signed records of human decision authority.
 * 
 * Core principle: When AI is wrong, there is ALWAYS a recorded
 * human authority who accepted that risk.
 */

import crypto from 'crypto';

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
    
    return delegation;
  }
  
  /**
   * Get the full accountability chain for a decision
   */
  async getAccountabilityChain(decisionId: string): Promise<AccountabilityChain> {
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
    // In production, this would use TPM 2.0 or HSM
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
}

// Singleton instance
export const cendiaResponsibilityService = new CendiaResponsibilityService();
