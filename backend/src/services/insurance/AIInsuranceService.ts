// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaInsure™ - AI Insurance Integration API
 * 
 * Enterprise Platinum Feature: Direct liability coverage per decision
 * 
 * Features:
 * - Policy generation per AI decision
 * - Risk scoring for premium calculation
 * - Claims management integration
 * - Coverage certificate generation
 * - Lloyd's/AIG API simulation
 */

import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { logger } from '../../utils/logger.js';
import { prisma } from '../../config/database.js';
import { persistServiceRecord } from '../../utils/servicePersistence.js';

// ============================================================================
// TYPES
// ============================================================================

export type CoverageType = 
  | 'errors_omissions'     // E&O for incorrect AI advice
  | 'cyber_liability'      // Data breach from AI
  | 'product_liability'    // AI product defects
  | 'professional'         // Professional indemnity
  | 'general_liability'    // General business liability
  | 'directors_officers';  // D&O for AI governance

export type PolicyStatus = 'quoted' | 'bound' | 'active' | 'expired' | 'cancelled' | 'claimed';

export type RiskTier = 'low' | 'medium' | 'high' | 'critical';

export interface InsurancePolicy {
  id: string;
  policyNumber: string;
  
  // Coverage
  coverageType: CoverageType;
  coverageLimit: number;
  deductible: number;
  premium: number;
  
  // Scope
  organizationId: string;
  verticalId?: string;
  coveredSystems: string[];
  coveredDecisionTypes: string[];
  
  // Terms
  effectiveDate: Date;
  expirationDate: Date;
  status: PolicyStatus;
  
  // Underwriting
  riskScore: number;
  riskTier: RiskTier;
  underwritingNotes: string[];
  
  // Documents
  certificateUrl?: string;
  policyDocumentUrl?: string;
  
  // Audit
  createdAt: Date;
  createdBy: string;
  lastModified: Date;
}

export interface DecisionCoverage {
  id: string;
  policyId: string;
  policyNumber: string;
  
  // Decision
  decisionId: string;
  deliberationId?: string;
  decisionType: string;
  decisionValue: number;
  
  // Coverage
  coverageAmount: number;
  deductible: number;
  premiumAllocation: number;
  
  // Risk
  riskScore: number;
  riskFactors: RiskFactor[];
  
  // Certificate
  certificateId: string;
  certificateUrl: string;
  
  // Status
  coveredAt: Date;
  expiresAt: Date;
  status: 'active' | 'expired' | 'claimed';
}

export interface RiskFactor {
  name: string;
  score: number;
  weight: number;
  description: string;
}

export interface InsuranceQuote {
  id: string;
  
  // Request
  organizationId: string;
  coverageType: CoverageType;
  requestedLimit: number;
  
  // Quote
  premium: number;
  deductible: number;
  riskScore: number;
  riskTier: RiskTier;
  
  // Terms
  termMonths: number;
  exclusions: string[];
  conditions: string[];
  
  // Validity
  quotedAt: Date;
  validUntil: Date;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
}

export interface Claim {
  id: string;
  claimNumber: string;
  policyId: string;
  policyNumber: string;
  
  // Incident
  incidentDate: Date;
  incidentDescription: string;
  decisionId?: string;
  
  // Claim
  claimAmount: number;
  claimType: string;
  
  // Status
  status: 'filed' | 'under_review' | 'approved' | 'denied' | 'paid' | 'closed';
  filedAt: Date;
  resolvedAt?: Date;
  
  // Settlement
  approvedAmount?: number;
  denialReason?: string;
  
  // Documents
  supportingDocuments: string[];
}

export interface CoverageCertificate {
  id: string;
  policyId: string;
  policyNumber: string;
  decisionId?: string;
  
  // Details
  insured: string;
  coverageType: CoverageType;
  coverageLimit: number;
  deductible: number;
  
  // Validity
  effectiveDate: Date;
  expirationDate: Date;
  
  // Verification
  verificationCode: string;
  verificationUrl: string;
  qrCode: string;
  
  // Integrity
  hash: string;
  signature: string;
  issuedAt: Date;
}

// ============================================================================
// RISK SCORING
// ============================================================================

const VERTICAL_RISK_MODIFIERS: Record<string, number> = {
  financial: 1.4,
  healthcare: 1.5,
  legal: 1.3,
  defense: 1.6,
  government: 1.2,
  insurance: 1.3,
  pharma: 1.5,
  aerospace: 1.6,
  energy: 1.4,
  manufacturing: 1.1,
  retail: 0.9,
  education: 0.8,
  media: 0.9,
  realestate: 1.0,
  telecom: 1.1,
};

const BASE_PREMIUMS: Record<CoverageType, number> = {
  errors_omissions: 5000,
  cyber_liability: 8000,
  product_liability: 10000,
  professional: 6000,
  general_liability: 3000,
  directors_officers: 15000,
};

// ============================================================================
// SERVICE CLASS
// ============================================================================

export class AIInsuranceService {
  private policies: Map<string, InsurancePolicy> = new Map();
  private quotes: Map<string, InsuranceQuote> = new Map();
  private claims: Map<string, Claim> = new Map();
  private decisionCoverages: Map<string, DecisionCoverage> = new Map();
  private certificates: Map<string, CoverageCertificate> = new Map();
  private policyCounter = 100000;

  constructor() {
    this.initFromDb().catch(() => {
      logger.warn('[CendiaInsure] DB not available, using in-memory only');
    });
    logger.info('[CendiaInsure] AI Insurance initialized with Prisma persistence');
  }

  private async initFromDb(): Promise<void> {
    try {
      const dbPolicies = await prisma.insurance_policies.findMany();
      for (const row of dbPolicies) {
        this.policies.set(row.id, row.data as unknown as InsurancePolicy);
        const num = parseInt(row.policy_number.replace(/\D/g, '') || '0');
        if (num > this.policyCounter) this.policyCounter = num;
      }
      const dbQuotes = await prisma.insurance_quotes.findMany();
      for (const row of dbQuotes) {
        this.quotes.set(row.id, row.data as unknown as InsuranceQuote);
      }
      const dbClaims = await prisma.insurance_claims.findMany();
      for (const row of dbClaims) {
        this.claims.set(row.id, row.data as unknown as Claim);
      }
      if (dbPolicies.length > 0) {
        logger.info(`[CendiaInsure] Loaded ${dbPolicies.length} policies, ${dbQuotes.length} quotes, ${dbClaims.length} claims from DB`);
      }
    } catch { /* DB not available */ }
  }

  private async persistPolicy(policy: InsurancePolicy): Promise<void> {
    try {
      await prisma.insurance_policies.upsert({
        where: { id: policy.id },
        update: { status: policy.status, data: policy as any },
        create: {
          id: policy.id, policy_number: policy.policyNumber, organization_id: policy.organizationId,
          coverage_type: policy.coverageType, coverage_limit: policy.coverageLimit,
          deductible: policy.deductible, premium: policy.premium, risk_score: policy.riskScore,
          risk_tier: policy.riskTier, status: policy.status, effective_date: policy.effectiveDate,
          expiration_date: policy.expirationDate, data: policy as any, created_by: policy.createdBy,
        },
      });
    } catch { /* non-fatal */ }
  }

  private async persistQuote(quote: InsuranceQuote): Promise<void> {
    try {
      await prisma.insurance_quotes.upsert({
        where: { id: quote.id },
        update: { status: quote.status, data: quote as any },
        create: {
          id: quote.id, organization_id: quote.organizationId, coverage_type: quote.coverageType,
          requested_limit: quote.requestedLimit, premium: quote.premium, risk_score: quote.riskScore,
          risk_tier: quote.riskTier, status: quote.status, data: quote as any,
          quoted_at: quote.quotedAt, valid_until: quote.validUntil,
        },
      });
    } catch { /* non-fatal */ }
  }

  private async persistClaim(claim: Claim): Promise<void> {
    try {
      await prisma.insurance_claims.upsert({
        where: { id: claim.id },
        update: { status: claim.status, data: claim as any, resolved_at: claim.resolvedAt },
        create: {
          id: claim.id, claim_number: claim.claimNumber, policy_id: claim.policyId,
          policy_number: claim.policyNumber, claim_amount: claim.claimAmount,
          claim_type: claim.claimType, status: claim.status, decision_id: claim.decisionId,
          data: claim as any, filed_at: claim.filedAt,
        },
      });
    } catch { /* non-fatal */ }
  }

  /**
   * Request a quote
   */
  async requestQuote(params: {
    organizationId: string;
    coverageType: CoverageType;
    requestedLimit: number;
    verticalId?: string;
    coveredSystems?: string[];
    termMonths?: number;
  }): Promise<InsuranceQuote> {
    const id = uuidv4();
    const termMonths = params.termMonths || 12;
    
    // Calculate risk and premium
    const riskScore = this.calculateRiskScore(params.verticalId, params.coveredSystems || []);
    const riskTier = this.getRiskTier(riskScore);
    const premium = this.calculatePremium(
      params.coverageType,
      params.requestedLimit,
      riskScore,
      termMonths
    );
    const deductible = this.calculateDeductible(params.requestedLimit, riskTier);

    const quote: InsuranceQuote = {
      id,
      organizationId: params.organizationId,
      coverageType: params.coverageType,
      requestedLimit: params.requestedLimit,
      premium,
      deductible,
      riskScore,
      riskTier,
      termMonths,
      exclusions: this.getExclusions(params.coverageType),
      conditions: this.getConditions(params.coverageType),
      quotedAt: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      status: 'pending',
    };

    this.quotes.set(id, quote);
    this.persistQuote(quote).catch(() => {});
    logger.info(`Insurance quote generated: ${id} - $${premium}/year`);
    
    return quote;
  }

  /**
   * Accept a quote and bind policy
   */
  async bindPolicy(quoteId: string, params: {
    coveredSystems: string[];
    coveredDecisionTypes: string[];
    createdBy: string;
  }): Promise<InsurancePolicy> {
    const quote = this.quotes.get(quoteId);
    if (!quote) throw new Error('Quote not found');
    if (quote.status !== 'pending') throw new Error('Quote is no longer valid');
    if (quote.validUntil < new Date()) throw new Error('Quote has expired');

    const id = uuidv4();
    const policyNumber = this.generatePolicyNumber();
    const now = new Date();

    const policy: InsurancePolicy = {
      id,
      policyNumber,
      coverageType: quote.coverageType,
      coverageLimit: quote.requestedLimit,
      deductible: quote.deductible,
      premium: quote.premium,
      organizationId: quote.organizationId,
      coveredSystems: params.coveredSystems,
      coveredDecisionTypes: params.coveredDecisionTypes,
      effectiveDate: now,
      expirationDate: new Date(now.getTime() + quote.termMonths * 30 * 24 * 60 * 60 * 1000),
      status: 'active',
      riskScore: quote.riskScore,
      riskTier: quote.riskTier,
      underwritingNotes: [`Bound from quote ${quoteId}`],
      createdAt: now,
      createdBy: params.createdBy,
      lastModified: now,
    };

    // Generate certificate
    const certificate = await this.generateCertificate(policy);
    policy.certificateUrl = certificate.verificationUrl;

    this.policies.set(id, policy);
    quote.status = 'accepted';
    this.persistPolicy(policy).catch(() => {});
    this.persistQuote(quote).catch(() => {});

    logger.info(`Policy bound: ${policyNumber}`);
    return policy;
  }

  /**
   * Cover a specific decision
   */
  async coverDecision(params: {
    policyId: string;
    decisionId: string;
    deliberationId?: string;
    decisionType: string;
    decisionValue: number;
    riskFactors?: RiskFactor[];
  }): Promise<DecisionCoverage> {
    const policy = this.policies.get(params.policyId);
    if (!policy) throw new Error('Policy not found');
    if (policy.status !== 'active') throw new Error('Policy is not active');

    const id = uuidv4();
    
    // Calculate decision-specific risk
    const riskFactors = params.riskFactors || this.assessDecisionRisk(params.decisionType, params.decisionValue);
    const riskScore = riskFactors.reduce((sum, f) => sum + f.score * f.weight, 0) / 
                      riskFactors.reduce((sum, f) => sum + f.weight, 0);

    // Calculate coverage allocation
    const coverageAmount = Math.min(params.decisionValue * 1.5, policy.coverageLimit * 0.1);
    const premiumAllocation = (coverageAmount / policy.coverageLimit) * policy.premium;

    // Generate certificate
    const certificate = await this.generateCertificate(policy, params.decisionId);

    const coverage: DecisionCoverage = {
      id,
      policyId: params.policyId,
      policyNumber: policy.policyNumber,
      decisionId: params.decisionId,
      deliberationId: params.deliberationId,
      decisionType: params.decisionType,
      decisionValue: params.decisionValue,
      coverageAmount,
      deductible: policy.deductible,
      premiumAllocation,
      riskScore,
      riskFactors,
      certificateId: certificate.id,
      certificateUrl: certificate.verificationUrl,
      coveredAt: new Date(),
      expiresAt: policy.expirationDate,
      status: 'active',
    };

    this.decisionCoverages.set(id, coverage);
    this.persistPolicy(policy).catch(() => {});
    logger.info(`Decision covered: ${params.decisionId} under policy ${policy.policyNumber}`);
    
    return coverage;
  }

  /**
   * File a claim
   */
  async fileClaim(params: {
    policyId: string;
    incidentDate: Date;
    incidentDescription: string;
    decisionId?: string;
    claimAmount: number;
    claimType: string;
    supportingDocuments?: string[];
  }): Promise<Claim> {
    const policy = this.policies.get(params.policyId);
    if (!policy) throw new Error('Policy not found');

    const id = uuidv4();
    const claimNumber = `CLM-${Date.now().toString(36).toUpperCase()}`;

    const claim: Claim = {
      id,
      claimNumber,
      policyId: params.policyId,
      policyNumber: policy.policyNumber,
      incidentDate: params.incidentDate,
      incidentDescription: params.incidentDescription,
      decisionId: params.decisionId,
      claimAmount: params.claimAmount,
      claimType: params.claimType,
      status: 'filed',
      filedAt: new Date(),
      supportingDocuments: params.supportingDocuments || [],
    };

    this.claims.set(id, claim);
    policy.status = 'claimed';
    this.persistClaim(claim).catch(() => {});
    this.persistPolicy(policy).catch(() => {});

    logger.info(`Claim filed: ${claimNumber} for $${params.claimAmount}`);
    return claim;
  }

  /**
   * Generate coverage certificate
   */
  async generateCertificate(policy: InsurancePolicy, decisionId?: string): Promise<CoverageCertificate> {
    const id = uuidv4();
    const verificationCode = crypto.randomBytes(8).toString('hex').toUpperCase();

    const certData = {
      id,
      policyNumber: policy.policyNumber,
      decisionId,
      coverageLimit: policy.coverageLimit,
      effectiveDate: policy.effectiveDate.toISOString(),
    };

    const hash = crypto.createHash('sha256').update(JSON.stringify(certData)).digest('hex');
    const signature = crypto.createHash('sha256').update(hash + 'datacendia-insure').digest('hex');

    const certificate: CoverageCertificate = {
      id,
      policyId: policy.id,
      policyNumber: policy.policyNumber,
      decisionId,
      insured: policy.organizationId,
      coverageType: policy.coverageType,
      coverageLimit: policy.coverageLimit,
      deductible: policy.deductible,
      effectiveDate: policy.effectiveDate,
      expirationDate: policy.expirationDate,
      verificationCode,
      verificationUrl: `https://verify.datacendia.com/insurance/${id}`,
      qrCode: `data:image/png;base64,${Buffer.from(verificationCode).toString('base64')}`,
      hash,
      signature,
      issuedAt: new Date(),
    };

    this.certificates.set(id, certificate);
    return certificate;
  }

  /**
   * Verify certificate
   */
  verifyCertificate(certificateId: string): { valid: boolean; certificate?: CoverageCertificate; reason?: string } {
    const certificate = this.certificates.get(certificateId);
    if (!certificate) {
      return { valid: false, reason: 'Certificate not found' };
    }

    const policy = this.policies.get(certificate.policyId);
    if (!policy) {
      return { valid: false, reason: 'Policy not found' };
    }

    if (policy.status !== 'active') {
      return { valid: false, certificate, reason: `Policy status: ${policy.status}` };
    }

    if (certificate.expirationDate < new Date()) {
      return { valid: false, certificate, reason: 'Certificate expired' };
    }

    return { valid: true, certificate };
  }

  /**
   * Get policy by ID
   */
  getPolicy(id: string): InsurancePolicy | undefined {
    return this.policies.get(id);
  }

  /**
   * Get policies by organization
   */
  getPoliciesByOrganization(organizationId: string): InsurancePolicy[] {
    return Array.from(this.policies.values())
      .filter(p => p.organizationId === organizationId);
  }

  /**
   * Get coverage for a decision
   */
  getCoverageByDecision(decisionId: string): DecisionCoverage | undefined {
    return Array.from(this.decisionCoverages.values())
      .find(c => c.decisionId === decisionId);
  }

  /**
   * Get available coverage types
   */
  getCoverageTypes(): { type: CoverageType; name: string; description: string; basePremium: number }[] {
    return [
      {
        type: 'errors_omissions',
        name: 'Errors & Omissions',
        description: 'Coverage for losses due to incorrect AI recommendations or analysis',
        basePremium: BASE_PREMIUMS.errors_omissions,
      },
      {
        type: 'cyber_liability',
        name: 'Cyber Liability',
        description: 'Coverage for data breaches and cyber incidents involving AI systems',
        basePremium: BASE_PREMIUMS.cyber_liability,
      },
      {
        type: 'product_liability',
        name: 'Product Liability',
        description: 'Coverage for defects in AI products and systems',
        basePremium: BASE_PREMIUMS.product_liability,
      },
      {
        type: 'professional',
        name: 'Professional Indemnity',
        description: 'Coverage for professional negligence in AI-assisted services',
        basePremium: BASE_PREMIUMS.professional,
      },
      {
        type: 'general_liability',
        name: 'General Liability',
        description: 'General business liability for AI operations',
        basePremium: BASE_PREMIUMS.general_liability,
      },
      {
        type: 'directors_officers',
        name: 'Directors & Officers',
        description: 'D&O coverage for AI governance decisions',
        basePremium: BASE_PREMIUMS.directors_officers,
      },
    ];
  }

  // Private methods

  private calculateRiskScore(verticalId?: string, coveredSystems: string[] = []): number {
    let baseScore = 50;
    
    // Vertical modifier
    if (verticalId && VERTICAL_RISK_MODIFIERS[verticalId]) {
      baseScore *= VERTICAL_RISK_MODIFIERS[verticalId];
    }

    // More systems = more risk
    baseScore += coveredSystems.length * 2;

    return Math.min(Math.max(baseScore, 0), 100);
  }

  private getRiskTier(score: number): RiskTier {
    if (score < 30) return 'low';
    if (score < 50) return 'medium';
    if (score < 75) return 'high';
    return 'critical';
  }

  private calculatePremium(
    coverageType: CoverageType, 
    limit: number, 
    riskScore: number,
    termMonths: number
  ): number {
    const basePremium = BASE_PREMIUMS[coverageType];
    const limitMultiplier = limit / 1000000; // Per million
    const riskMultiplier = 1 + (riskScore / 100);
    const termMultiplier = termMonths / 12;

    return Math.round(basePremium * limitMultiplier * riskMultiplier * termMultiplier);
  }

  private calculateDeductible(limit: number, riskTier: RiskTier): number {
    const tierMultipliers: Record<RiskTier, number> = {
      low: 0.01,
      medium: 0.02,
      high: 0.05,
      critical: 0.10,
    };

    return Math.round(limit * tierMultipliers[riskTier]);
  }

  private getExclusions(coverageType: CoverageType): string[] {
    const commonExclusions = [
      'Intentional misconduct',
      'Criminal acts',
      'War and terrorism',
      'Nuclear hazards',
    ];

    const typeSpecific: Record<CoverageType, string[]> = {
      errors_omissions: ['Known defects at policy inception', 'Contractual liability'],
      cyber_liability: ['Infrastructure failures', 'Unsupported software'],
      product_liability: ['Design defects known prior to sale', 'Recall costs'],
      professional: ['Dishonest acts', 'Bodily injury'],
      general_liability: ['Professional services', 'Employment practices'],
      directors_officers: ['Fraud', 'Personal profit'],
    };

    return [...commonExclusions, ...typeSpecific[coverageType]];
  }

  private getConditions(coverageType: CoverageType): string[] {
    return [
      'Timely notification of claims (within 30 days)',
      'Cooperation with investigation',
      'Maintenance of audit trails',
      'Human oversight requirements',
      'Regular security assessments',
    ];
  }

  private assessDecisionRisk(decisionType: string, decisionValue: number): RiskFactor[] {
    return [
      {
        name: 'Decision Value',
        score: Math.min(decisionValue / 100000, 100),
        weight: 0.3,
        description: 'Risk based on monetary value of decision',
      },
      {
        name: 'Decision Type',
        score: this.getDecisionTypeRisk(decisionType),
        weight: 0.3,
        description: 'Inherent risk of decision category',
      },
      {
        name: 'Automation Level',
        score: 60,
        weight: 0.2,
        description: 'Degree of AI autonomy in decision',
      },
      {
        name: 'Reversibility',
        score: 40,
        weight: 0.2,
        description: 'Ease of reversing the decision',
      },
    ];
  }

  private getDecisionTypeRisk(decisionType: string): number {
    const riskMap: Record<string, number> = {
      approval: 70,
      rejection: 80,
      recommendation: 50,
      analysis: 30,
      classification: 40,
      prediction: 60,
    };

    return riskMap[decisionType.toLowerCase()] || 50;
  }

  private generatePolicyNumber(): string {
    const year = new Date().getFullYear();
    const number = ++this.policyCounter;
    return `AI-${year}-${number}`;
  }
}

export const aiInsuranceService = new AIInsuranceService();
