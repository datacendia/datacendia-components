// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA ORACLEÃ¢â€žÂ¢ - Truth Arbiter Service
// "The silent judge of disputed facts."
// Sovereign Organ Layer - Integrity
// =============================================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// =============================================================================
// TYPES
// =============================================================================

export interface TruthClaim {
  id: string;
  organizationId: string;
  category: 'data' | 'metric' | 'event' | 'statement' | 'forecast';
  subject: string;
  claim: string;
  claimant: string;
  evidence: Evidence[];
  verification: VerificationResult | null;
  status: 'pending' | 'verified' | 'disputed' | 'false' | 'inconclusive';
  createdAt: Date;
  resolvedAt: Date | null;
  metadata: Record<string, unknown>;
}

export interface Evidence {
  id: string;
  claimId: string;
  type: 'data_source' | 'document' | 'witness' | 'audit_log' | 'calculation';
  source: string;
  content: Record<string, unknown>;
  reliability: number; // 0-100
  submittedBy: string;
  submittedAt: Date;
}

export interface VerificationResult {
  verdict: 'true' | 'false' | 'partially_true' | 'inconclusive';
  confidence: number; // 0-100
  reasoning: string[];
  supportingEvidence: string[];
  contradictingEvidence: string[];
  verifiedAt: Date;
  verifiedBy: string;
}

export interface Dispute {
  id: string;
  organizationId: string;
  claimId: string;
  disputant: string;
  counterClaim: string;
  counterEvidence: Evidence[];
  status: 'open' | 'under_review' | 'resolved';
  resolution: string | null;
  createdAt: Date;
  resolvedAt: Date | null;
}

export interface ConsensusVote {
  claimId: string;
  voterId: string;
  voterRole: string;
  vote: 'support' | 'oppose' | 'abstain';
  rationale: string;
  votedAt: Date;
}

export interface SourceReliability {
  sourceId: string;
  sourceName: string;
  sourceType: string;
  reliabilityScore: number;
  totalClaims: number;
  verifiedTrue: number;
  verifiedFalse: number;
  lastUpdated: Date;
}

// =============================================================================
// CENDIA ORACLE SERVICE
// =============================================================================

export class CendiaOracleService {
  private claims: Map<string, TruthClaim> = new Map();
  private disputes: Map<string, Dispute> = new Map();
  private votes: Map<string, ConsensusVote[]> = new Map();
  private sourceReliability: Map<string, SourceReliability> = new Map();

  constructor() {
    console.log('[CendiaOracle] Truth Arbiter service initialized');
  }

  // ===========================================================================
  // TRUTH CLAIMS
  // ===========================================================================

  async submitClaim(data: Omit<TruthClaim, 'id' | 'evidence' | 'verification' | 'status' | 'createdAt' | 'resolvedAt'>): Promise<TruthClaim> {
    const claim: TruthClaim = {
      ...data,
      id: `claim-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
      evidence: [],
      verification: null,
      status: 'pending',
      createdAt: new Date(),
      resolvedAt: null,
    };
    
    this.claims.set(claim.id, claim);
    this.votes.set(claim.id, []);
    
    return claim;
  }

  async getClaim(claimId: string): Promise<TruthClaim | null> {
    return this.claims.get(claimId) || null;
  }

  async getClaimsForOrg(organizationId: string, filters?: {
    status?: string;
    category?: string;
  }): Promise<TruthClaim[]> {
    let claims = Array.from(this.claims.values())
      .filter(c => c.organizationId === organizationId);
    
    if (filters?.status) {
      claims = claims.filter(c => c.status === filters.status);
    }
    if (filters?.category) {
      claims = claims.filter(c => c.category === filters.category);
    }
    
    return claims.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // ===========================================================================
  // EVIDENCE MANAGEMENT
  // ===========================================================================

  async submitEvidence(claimId: string, evidence: Omit<Evidence, 'id' | 'claimId' | 'submittedAt'>): Promise<Evidence | null> {
    const claim = this.claims.get(claimId);
    if (!claim) return null;
    
    const newEvidence: Evidence = {
      ...evidence,
      id: `evidence-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`,
      claimId,
      submittedAt: new Date(),
    };
    
    // Update source reliability based on past performance
    const sourceReliability = await this.getSourceReliability(evidence.source);
    if (sourceReliability) {
      newEvidence.reliability = sourceReliability.reliabilityScore;
    }
    
    claim.evidence.push(newEvidence);
    this.claims.set(claimId, claim);
    
    return newEvidence;
  }

  async getEvidenceForClaim(claimId: string): Promise<Evidence[]> {
    const claim = this.claims.get(claimId);
    return claim?.evidence || [];
  }

  // ===========================================================================
  // VERIFICATION
  // ===========================================================================

  async verifyClaim(claimId: string, verifiedBy: string): Promise<VerificationResult | null> {
    const claim = this.claims.get(claimId);
    if (!claim) return null;
    
    // Analyze evidence
    const supportingEvidence: string[] = [];
    const contradictingEvidence: string[] = [];
    let totalReliability = 0;
    let supportScore = 0;
    
    for (const ev of claim.evidence) {
      totalReliability += ev.reliability;
      // Simple heuristic: high reliability evidence supports, low contradicts
      if (ev.reliability >= 70) {
        supportingEvidence.push(ev.id);
        supportScore += ev.reliability;
      } else if (ev.reliability < 40) {
        contradictingEvidence.push(ev.id);
        supportScore -= (100 - ev.reliability);
      }
    }
    
    // Consider consensus votes
    const votes = this.votes.get(claimId) || [];
    const supportVotes = votes.filter(v => v.vote === 'support').length;
    const opposeVotes = votes.filter(v => v.vote === 'oppose').length;
    supportScore += (supportVotes - opposeVotes) * 10;
    
    // Determine verdict
    let verdict: VerificationResult['verdict'];
    let confidence: number;
    const reasoning: string[] = [];
    
    if (claim.evidence.length === 0) {
      verdict = 'inconclusive';
      confidence = 0;
      reasoning.push('No evidence submitted');
    } else if (supportScore > 100) {
      verdict = 'true';
      confidence = Math.min(95, 50 + supportScore / 5);
      reasoning.push(`Strong supporting evidence (${supportingEvidence.length} sources)`);
    } else if (supportScore < -50) {
      verdict = 'false';
      confidence = Math.min(95, 50 + Math.abs(supportScore) / 5);
      reasoning.push(`Evidence contradicts claim (${contradictingEvidence.length} sources)`);
    } else if (supportScore > 0) {
      verdict = 'partially_true';
      confidence = 50 + supportScore / 3;
      reasoning.push('Mixed evidence with slight support');
    } else {
      verdict = 'inconclusive';
      confidence = 40;
      reasoning.push('Evidence is inconclusive or conflicting');
    }
    
    const verification: VerificationResult = {
      verdict,
      confidence,
      reasoning,
      supportingEvidence,
      contradictingEvidence,
      verifiedAt: new Date(),
      verifiedBy,
    };
    
    claim.verification = verification;
    claim.status = verdict === 'true' ? 'verified' : 
                   verdict === 'false' ? 'false' :
                   verdict === 'partially_true' ? 'verified' : 'inconclusive';
    claim.resolvedAt = new Date();
    this.claims.set(claimId, claim);
    
    // Update source reliability
    await this.updateSourceReliabilities(claim);
    
    return verification;
  }

  // ===========================================================================
  // DISPUTES
  // ===========================================================================

  async fileDispute(data: Omit<Dispute, 'id' | 'counterEvidence' | 'status' | 'resolution' | 'createdAt' | 'resolvedAt'>): Promise<Dispute> {
    const dispute: Dispute = {
      ...data,
      id: `dispute-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`,
      counterEvidence: [],
      status: 'open',
      resolution: null,
      createdAt: new Date(),
      resolvedAt: null,
    };
    
    // Mark the claim as disputed
    const claim = this.claims.get(data.claimId);
    if (claim) {
      claim.status = 'disputed';
      this.claims.set(claim.id, claim);
    }
    
    this.disputes.set(dispute.id, dispute);
    return dispute;
  }

  async resolveDispute(disputeId: string, resolution: string): Promise<Dispute | null> {
    const dispute = this.disputes.get(disputeId);
    if (!dispute) return null;
    
    dispute.status = 'resolved';
    dispute.resolution = resolution;
    dispute.resolvedAt = new Date();
    this.disputes.set(disputeId, dispute);
    
    return dispute;
  }

  async getDisputesForOrg(organizationId: string): Promise<Dispute[]> {
    return Array.from(this.disputes.values())
      .filter(d => d.organizationId === organizationId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // ===========================================================================
  // CONSENSUS VOTING
  // ===========================================================================

  async castVote(claimId: string, vote: Omit<ConsensusVote, 'claimId' | 'votedAt'>): Promise<ConsensusVote | null> {
    const claim = this.claims.get(claimId);
    if (!claim || claim.status !== 'pending') return null;
    
    const votes = this.votes.get(claimId) || [];
    
    // Check if already voted
    const existingVote = votes.find(v => v.voterId === vote.voterId);
    if (existingVote) {
      // Update existing vote
      existingVote.vote = vote.vote;
      existingVote.rationale = vote.rationale;
      existingVote.votedAt = new Date();
      this.votes.set(claimId, votes);
      return existingVote;
    }
    
    const newVote: ConsensusVote = {
      ...vote,
      claimId,
      votedAt: new Date(),
    };
    
    votes.push(newVote);
    this.votes.set(claimId, votes);
    
    return newVote;
  }

  async getVotesForClaim(claimId: string): Promise<{
    votes: ConsensusVote[];
    summary: { support: number; oppose: number; abstain: number };
  }> {
    const votes = this.votes.get(claimId) || [];
    
    return {
      votes,
      summary: {
        support: votes.filter(v => v.vote === 'support').length,
        oppose: votes.filter(v => v.vote === 'oppose').length,
        abstain: votes.filter(v => v.vote === 'abstain').length,
      },
    };
  }

  // ===========================================================================
  // SOURCE RELIABILITY
  // ===========================================================================

  async getSourceReliability(sourceId: string): Promise<SourceReliability | null> {
    return this.sourceReliability.get(sourceId) || null;
  }

  async getAllSourceReliabilities(organizationId: string): Promise<SourceReliability[]> {
    return Array.from(this.sourceReliability.values())
      .sort((a, b) => b.reliabilityScore - a.reliabilityScore);
  }

  private async updateSourceReliabilities(claim: TruthClaim): Promise<void> {
    for (const evidence of claim.evidence) {
      let reliability = this.sourceReliability.get(evidence.source);
      
      if (!reliability) {
        reliability = {
          sourceId: evidence.source,
          sourceName: evidence.source,
          sourceType: evidence.type,
          reliabilityScore: 50,
          totalClaims: 0,
          verifiedTrue: 0,
          verifiedFalse: 0,
          lastUpdated: new Date(),
        };
      }
      
      reliability.totalClaims++;
      if (claim.verification?.verdict === 'true' || claim.verification?.verdict === 'partially_true') {
        reliability.verifiedTrue++;
      } else if (claim.verification?.verdict === 'false') {
        reliability.verifiedFalse++;
      }
      
      // Recalculate reliability score
      if (reliability.totalClaims > 0) {
        reliability.reliabilityScore = Math.round(
          (reliability.verifiedTrue / reliability.totalClaims) * 100
        );
      }
      reliability.lastUpdated = new Date();
      
      this.sourceReliability.set(evidence.source, reliability);
    }
  }

  // ===========================================================================
  // DASHBOARD
  // ===========================================================================

  async getDashboard(organizationId: string): Promise<{
    totalClaims: number;
    verified: number;
    disputed: number;
    pending: number;
    avgConfidence: number;
    topSources: SourceReliability[];
    recentClaims: TruthClaim[];
    claimsByCategory: Record<string, number>;
  }> {
    const claims = await this.getClaimsForOrg(organizationId);
    const disputes = await this.getDisputesForOrg(organizationId);
    const sources = await this.getAllSourceReliabilities(organizationId);
    
    const verifiedClaims = claims.filter(c => c.status === 'verified');
    const avgConfidence = verifiedClaims.length > 0
      ? verifiedClaims.reduce((sum, c) => sum + (c.verification?.confidence || 0), 0) / verifiedClaims.length
      : 0;
    
    const claimsByCategory: Record<string, number> = {};
    for (const c of claims) {
      claimsByCategory[c.category] = (claimsByCategory[c.category] || 0) + 1;
    }
    
    return {
      totalClaims: claims.length,
      verified: claims.filter(c => c.status === 'verified').length,
      disputed: claims.filter(c => c.status === 'disputed').length,
      pending: claims.filter(c => c.status === 'pending').length,
      avgConfidence,
      topSources: sources.slice(0, 5),
      recentClaims: claims.slice(0, 10),
      claimsByCategory,
    };
  }

  // No seed method - Enterprise Platinum standard
}

export const cendiaOracleService = new CendiaOracleService();
