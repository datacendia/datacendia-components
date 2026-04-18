/**
 * Service — Cendia Oracle Service
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports CendiaOracleService, cendiaOracleService, TruthClaim, Evidence, VerificationResult, Dispute, ConsensusVote, SourceReliability
 * @module services/sovereign/CendiaOracleService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA ORACLE™ - Truth Arbiter Service
// "The silent judge of disputed facts."
// Sovereign Organ Layer - Integrity
// =============================================================================

import { PrismaClient } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

import { loadServiceRecords } from '../../utils/servicePersistence.js';
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
// ENUM MAPPERS (Prisma enums —†” service string literals)
// =============================================================================

const CATEGORY_TO_ENUM: Record<string, string> = {
  data: 'DATA', metric: 'METRIC', event: 'EVENT', statement: 'STATEMENT', forecast: 'FORECAST',
};
const ENUM_TO_CATEGORY: Record<string, TruthClaim['category']> = {
  DATA: 'data', METRIC: 'metric', EVENT: 'event', STATEMENT: 'statement', FORECAST: 'forecast',
};
const STATUS_TO_ENUM: Record<string, string> = {
  pending: 'PENDING', verified: 'VERIFIED', disputed: 'DISPUTED', false: 'FALSE', inconclusive: 'INCONCLUSIVE',
};
const ENUM_TO_STATUS: Record<string, TruthClaim['status']> = {
  PENDING: 'pending', VERIFIED: 'verified', DISPUTED: 'disputed', FALSE: 'false', INCONCLUSIVE: 'inconclusive',
};
const EVIDENCE_TYPE_TO_ENUM: Record<string, string> = {
  data_source: 'DATA_SOURCE', document: 'DOCUMENT', witness: 'WITNESS', audit_log: 'AUDIT_LOG', calculation: 'CALCULATION',
};
const ENUM_TO_EVIDENCE_TYPE: Record<string, Evidence['type']> = {
  DATA_SOURCE: 'data_source', DOCUMENT: 'document', WITNESS: 'witness', AUDIT_LOG: 'audit_log', CALCULATION: 'calculation',
};
const VOTE_TO_ENUM: Record<string, string> = {
  support: 'SUPPORT', oppose: 'OPPOSE', abstain: 'ABSTAIN',
};
const ENUM_TO_VOTE: Record<string, ConsensusVote['vote']> = {
  SUPPORT: 'support', OPPOSE: 'oppose', ABSTAIN: 'abstain',
};

// =============================================================================
// CENDIA ORACLE SERVICE — Prisma-backed with Map fallback for tests
// =============================================================================

export class CendiaOracleService {
  // In-memory fallback (used when no Prisma client is provided, e.g. tests)
  private _claims: Map<string, TruthClaim> = new Map();
  private _disputes: Map<string, Dispute> = new Map();
  private _votes: Map<string, ConsensusVote[]> = new Map();
  private _sourceReliability: Map<string, SourceReliability> = new Map();

  private db: PrismaClient | null;

  constructor(prisma?: PrismaClient) {
    this.db = prisma || null;
    logger.info(`[CendiaOracle] Truth Arbiter service initialized (persistence: ${this.db ? 'PostgreSQL' : 'in-memory'})`);


    this.loadFromDB().catch(() => {});
  }

  // ===========================================================================
  // TRUTH CLAIMS
  // ===========================================================================

  async submitClaim(data: Omit<TruthClaim, 'id' | 'evidence' | 'verification' | 'status' | 'createdAt' | 'resolvedAt'>): Promise<TruthClaim> {
    const id = crypto.randomUUID();
    const now = new Date();

    if (this.db) {
      const row = await this.db.truth_claims.create({
        data: {
          id,
          organization_id: data.organizationId,
          category: CATEGORY_TO_ENUM[data.category] as any,
          subject: data.subject,
          claim: data.claim,
          claimant: data.claimant,
          metadata: (data.metadata ?? {}) as any,
        },
        include: { evidence: true, votes: true },
      });
      return this.rowToClaim(row);
    }

    // Fallback: in-memory
    const claim: TruthClaim = {
      ...data,
      id: `claim-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
      evidence: [],
      verification: null,
      status: 'pending',
      createdAt: now,
      resolvedAt: null,
    };
    this._claims.set(claim.id, claim);
    this._votes.set(claim.id, []);
    return claim;
  }

  async getClaim(claimId: string): Promise<TruthClaim | null> {
    if (this.db) {
      const row = await this.db.truth_claims.findUnique({
        where: { id: claimId },
        include: { evidence: true, votes: true },
      });
      return row ? this.rowToClaim(row) : null;
    }
    return this._claims.get(claimId) || null;
  }

  async getClaimsForOrg(organizationId: string, filters?: {
    status?: string;
    category?: string;
  }): Promise<TruthClaim[]> {
    if (this.db) {
      const where: any = { organization_id: organizationId };
      if (filters?.status) where.status = STATUS_TO_ENUM[filters.status];
      if (filters?.category) where.category = CATEGORY_TO_ENUM[filters.category];

      const rows = await this.db.truth_claims.findMany({
        where,
        include: { evidence: true, votes: true },
        orderBy: { created_at: 'desc' },
      });
      return rows.map((r: any) => this.rowToClaim(r));
    }

    let claims = Array.from(this._claims.values())
      .filter(c => c.organizationId === organizationId);
    if (filters?.status) claims = claims.filter(c => c.status === filters.status);
    if (filters?.category) claims = claims.filter(c => c.category === filters.category);
    return claims.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // ===========================================================================
  // EVIDENCE MANAGEMENT
  // ===========================================================================

  async submitEvidence(claimId: string, evidence: Omit<Evidence, 'id' | 'claimId' | 'submittedAt'>): Promise<Evidence | null> {
    const claim = await this.getClaim(claimId);
    if (!claim) return null;

    const sourceRel = await this.getSourceReliability(evidence.source);
    const reliability = sourceRel ? sourceRel.reliabilityScore : evidence.reliability;

    if (this.db) {
      const row = await this.db.claim_evidence.create({
        data: {
          claim_id: claimId,
          evidence_type: EVIDENCE_TYPE_TO_ENUM[evidence.type] as any,
          source: evidence.source,
          content: evidence.content as any,
          reliability,
          submitted_by: evidence.submittedBy,
        },
      });
      return this.rowToEvidence(row);
    }

    // Fallback: in-memory
    const newEvidence: Evidence = {
      ...evidence,
      id: `evidence-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`,
      claimId,
      reliability,
      submittedAt: new Date(),
    };
    claim.evidence.push(newEvidence);
    this._claims.set(claimId, claim);
    return newEvidence;
  }

  async getEvidenceForClaim(claimId: string): Promise<Evidence[]> {
    if (this.db) {
      const rows = await this.db.claim_evidence.findMany({
        where: { claim_id: claimId },
        orderBy: { created_at: 'desc' },
      });
      return rows.map((r: any) => this.rowToEvidence(r));
    }
    const claim = this._claims.get(claimId);
    return claim?.evidence || [];
  }

  // ===========================================================================
  // VERIFICATION
  // ===========================================================================

  async verifyClaim(claimId: string, verifiedBy: string): Promise<VerificationResult | null> {
    const claim = await this.getClaim(claimId);
    if (!claim) return null;

    const supportingEvidence: string[] = [];
    const contradictingEvidence: string[] = [];
    let supportScore = 0;

    for (const ev of claim.evidence) {
      if (ev.reliability >= 70) {
        supportingEvidence.push(ev.id);
        supportScore += ev.reliability;
      } else if (ev.reliability < 40) {
        contradictingEvidence.push(ev.id);
        supportScore -= (100 - ev.reliability);
      }
    }

    const { summary } = await this.getVotesForClaim(claimId);
    supportScore += (summary.support - summary.oppose) * 10;

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
      verdict, confidence, reasoning,
      supportingEvidence, contradictingEvidence,
      verifiedAt: new Date(), verifiedBy,
    };

    const newStatus = verdict === 'true' ? 'verified' :
                      verdict === 'false' ? 'false' :
                      verdict === 'partially_true' ? 'verified' : 'inconclusive';

    if (this.db) {
      await this.db.truth_claims.update({
        where: { id: claimId },
        data: {
          verification: verification as any,
          status: STATUS_TO_ENUM[newStatus] as any,
          resolved_at: new Date(),
        },
      });
    } else {
      claim.verification = verification;
      claim.status = newStatus;
      claim.resolvedAt = new Date();
      this._claims.set(claimId, claim);
    }

    await this.updateSourceReliabilities(claim, verification);
    return verification;
  }

  // ===========================================================================
  // DISPUTES
  // ===========================================================================

  async fileDispute(data: Omit<Dispute, 'id' | 'counterEvidence' | 'status' | 'resolution' | 'createdAt' | 'resolvedAt'>): Promise<Dispute> {
    if (this.db) {
      const row = await this.db.claim_disputes.create({
        data: {
          claim_id: data.claimId,
          organization_id: data.organizationId,
          disputant: data.disputant,
          reason: data.counterClaim,
        },
      });
      // Mark claim as disputed
      await this.db.truth_claims.update({
        where: { id: data.claimId },
        data: { status: 'DISPUTED' as any },
      });
      return this.rowToDispute(row);
    }

    // Fallback: in-memory
    const dispute: Dispute = {
      ...data,
      id: `dispute-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`,
      counterEvidence: [],
      status: 'open',
      resolution: null,
      createdAt: new Date(),
      resolvedAt: null,
    };
    const claim = this._claims.get(data.claimId);
    if (claim) {
      claim.status = 'disputed';
      this._claims.set(claim.id, claim);
    }
    this._disputes.set(dispute.id, dispute);
    return dispute;
  }

  async resolveDispute(disputeId: string, resolution: string): Promise<Dispute | null> {
    if (this.db) {
      const row = await this.db.claim_disputes.update({
        where: { id: disputeId },
        data: { status: 'RESOLVED' as any, resolution, resolved_at: new Date() },
      });
      return this.rowToDispute(row);
    }
    const dispute = this._disputes.get(disputeId);
    if (!dispute) return null;
    dispute.status = 'resolved';
    dispute.resolution = resolution;
    dispute.resolvedAt = new Date();
    this._disputes.set(disputeId, dispute);
    return dispute;
  }

  async getDisputesForOrg(organizationId: string): Promise<Dispute[]> {
    if (this.db) {
      const rows = await this.db.claim_disputes.findMany({
        where: { organization_id: organizationId },
        orderBy: { created_at: 'desc' },
      });
      return rows.map((r: any) => this.rowToDispute(r));
    }
    return Array.from(this._disputes.values())
      .filter(d => d.organizationId === organizationId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // ===========================================================================
  // CONSENSUS VOTING
  // ===========================================================================

  async castVote(claimId: string, vote: Omit<ConsensusVote, 'claimId' | 'votedAt'>): Promise<ConsensusVote | null> {
    const claim = await this.getClaim(claimId);
    if (!claim || claim.status !== 'pending') return null;

    if (this.db) {
      const row = await this.db.claim_votes.upsert({
        where: { claim_id_voter_id: { claim_id: claimId, voter_id: vote.voterId } },
        update: {
          vote: VOTE_TO_ENUM[vote.vote] as any,
          rationale: vote.rationale,
        },
        create: {
          claim_id: claimId,
          voter_id: vote.voterId,
          voter_role: vote.voterRole,
          vote: VOTE_TO_ENUM[vote.vote] as any,
          rationale: vote.rationale,
        },
      });
      return this.rowToVote(row);
    }

    // Fallback: in-memory
    const votes = this._votes.get(claimId) || [];
    const existingVote = votes.find(v => v.voterId === vote.voterId);
    if (existingVote) {
      existingVote.vote = vote.vote;
      existingVote.rationale = vote.rationale;
      existingVote.votedAt = new Date();
      this._votes.set(claimId, votes);
      return existingVote;
    }
    const newVote: ConsensusVote = { ...vote, claimId, votedAt: new Date() };
    votes.push(newVote);
    this._votes.set(claimId, votes);
    return newVote;
  }

  async getVotesForClaim(claimId: string): Promise<{
    votes: ConsensusVote[];
    summary: { support: number; oppose: number; abstain: number };
  }> {
    let votes: ConsensusVote[];

    if (this.db) {
      const rows = await this.db.claim_votes.findMany({ where: { claim_id: claimId } });
      votes = rows.map((r: any) => this.rowToVote(r));
    } else {
      votes = this._votes.get(claimId) || [];
    }

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
    if (this.db) {
      const rows = await this.db.source_reliability.findMany({
        where: { source_name: sourceId },
        take: 1,
      });
      return rows.length > 0 ? this.rowToSourceReliability(rows[0]) : null;
    }
    return this._sourceReliability.get(sourceId) || null;
  }

  async getAllSourceReliabilities(organizationId: string): Promise<SourceReliability[]> {
    if (this.db) {
      const rows = await this.db.source_reliability.findMany({
        where: { organization_id: organizationId },
        orderBy: { reliability_score: 'desc' },
      });
      return rows.map((r: any) => this.rowToSourceReliability(r));
    }
    return Array.from(this._sourceReliability.values())
      .sort((a, b) => b.reliabilityScore - a.reliabilityScore);
  }

  private async updateSourceReliabilities(claim: TruthClaim, verification?: VerificationResult): Promise<void> {
    const v = verification || claim.verification;
    for (const evidence of claim.evidence) {
      if (this.db) {
        const existing = await this.db.source_reliability.findUnique({
          where: { organization_id_source_name: { organization_id: claim.organizationId, source_name: evidence.source } },
        });
        const totalClaims = (existing?.total_claims ?? 0) + 1;
        const accurateClaims = (existing?.accurate_claims ?? 0) +
          ((v?.verdict === 'true' || v?.verdict === 'partially_true') ? 1 : 0);
        const score = totalClaims > 0 ? Math.round((accurateClaims / totalClaims) * 100) : 50;

        await this.db.source_reliability.upsert({
          where: { organization_id_source_name: { organization_id: claim.organizationId, source_name: evidence.source } },
          update: { total_claims: totalClaims, accurate_claims: accurateClaims, reliability_score: score, last_evaluated: new Date() },
          create: { organization_id: claim.organizationId, source_name: evidence.source, total_claims: totalClaims, accurate_claims: accurateClaims, reliability_score: score },
        });
      } else {
        let reliability = this._sourceReliability.get(evidence.source);
        if (!reliability) {
          reliability = {
            sourceId: evidence.source, sourceName: evidence.source, sourceType: evidence.type,
            reliabilityScore: 50, totalClaims: 0, verifiedTrue: 0, verifiedFalse: 0, lastUpdated: new Date(),
          };
        }
        reliability.totalClaims++;
        if (v?.verdict === 'true' || v?.verdict === 'partially_true') reliability.verifiedTrue++;
        else if (v?.verdict === 'false') reliability.verifiedFalse++;
        if (reliability.totalClaims > 0) {
          reliability.reliabilityScore = Math.round((reliability.verifiedTrue / reliability.totalClaims) * 100);
        }
        reliability.lastUpdated = new Date();
        this._sourceReliability.set(evidence.source, reliability);
      }
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
      verified: verifiedClaims.length,
      disputed: claims.filter(c => c.status === 'disputed').length,
      pending: claims.filter(c => c.status === 'pending').length,
      avgConfidence,
      topSources: sources.slice(0, 5),
      recentClaims: claims.slice(0, 10),
      claimsByCategory,
    };
  }

  // ===========================================================================
  // ROW MAPPERS (Prisma row —†” service interface)
  // ===========================================================================

  private rowToClaim(row: any): TruthClaim {
    return {
      id: row.id,
      organizationId: row.organization_id,
      category: ENUM_TO_CATEGORY[row.category] || 'data',
      subject: row.subject,
      claim: row.claim,
      claimant: row.claimant,
      evidence: (row.evidence || []).map((e: any) => this.rowToEvidence(e)),
      verification: row.verification as VerificationResult | null,
      status: ENUM_TO_STATUS[row.status] || 'pending',
      createdAt: row.created_at,
      resolvedAt: row.resolved_at,
      metadata: (row.metadata as Record<string, unknown>) ?? {},
    };
  }

  private rowToEvidence(row: any): Evidence {
    return {
      id: row.id,
      claimId: row.claim_id,
      type: ENUM_TO_EVIDENCE_TYPE[row.evidence_type] || 'data_source',
      source: row.source,
      content: (row.content as Record<string, unknown>) ?? {},
      reliability: row.reliability,
      submittedBy: row.submitted_by,
      submittedAt: row.created_at,
    };
  }

  private rowToVote(row: any): ConsensusVote {
    return {
      claimId: row.claim_id,
      voterId: row.voter_id,
      voterRole: row.voter_role,
      vote: ENUM_TO_VOTE[row.vote] || 'abstain',
      rationale: row.rationale || '',
      votedAt: row.created_at,
    };
  }

  private rowToDispute(row: any): Dispute {
    return {
      id: row.id,
      organizationId: row.organization_id,
      claimId: row.claim_id,
      disputant: row.disputant,
      counterClaim: row.reason || '',
      counterEvidence: [],
      status: row.status === 'OPEN' ? 'open' : row.status === 'UNDER_REVIEW' ? 'under_review' : 'resolved',
      resolution: row.resolution,
      createdAt: row.created_at,
      resolvedAt: row.resolved_at,
    };
  }

  private rowToSourceReliability(row: any): SourceReliability {
    return {
      sourceId: row.source_name,
      sourceName: row.source_name,
      sourceType: 'data_source',
      reliabilityScore: row.reliability_score,
      totalClaims: row.total_claims,
      verifiedTrue: row.accurate_claims,
      verifiedFalse: row.total_claims - row.accurate_claims,
      lastUpdated: row.last_evaluated,
    };
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'CendiaOracle', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this._claims.has(d.id)) this._claims.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'CendiaOracle', recordType: 'record', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this._disputes.has(d.id)) this._disputes.set(d.id, d);


      }


      restored += recs_1.length;


      const recs_2 = await loadServiceRecords({ serviceName: 'CendiaOracle', recordType: 'record', limit: 1000 });


      for (const rec of recs_2) {


        const d = rec.data as any;


        if (d?.id && !this._votes.has(d.id)) this._votes.set(d.id, d);


      }


      restored += recs_2.length;


      const recs_3 = await loadServiceRecords({ serviceName: 'CendiaOracle', recordType: 'record', limit: 1000 });


      for (const rec of recs_3) {


        const d = rec.data as any;


        if (d?.id && !this._sourceReliability.has(d.id)) this._sourceReliability.set(d.id, d);


      }


      restored += recs_3.length;


      if (restored > 0) logger.info(`[CendiaOracleService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[CendiaOracleService] DB reload skipped: ${(err as Error).message}`);


    }


  }

  // ===========================================================================
  // HEALTH CHECK
  // ===========================================================================

  async getHealth(): Promise<{ healthy: boolean; service: string; timestamp: Date; details: Record<string, unknown> }> {
    return {
      healthy: true,
      service: 'CendiaOracle',
      timestamp: new Date(),
      details: { uptime: process.uptime(), memoryMB: Math.round(process.memoryUsage().heapUsed / 1048576) },
    };
  }
}

export const cendiaOracleService = new CendiaOracleService(prisma as unknown as PrismaClient);
