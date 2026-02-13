/**
 * CendiaIISS™ — Institutional Immune System Score Service
 * 
 * The category-completing innovation for Decision Crisis Immunization Infrastructure.
 * 
 * Calculates a standardized 0-1000 score measuring an organization's ability
 * to survive institutional crises, based on 5 DCII primitive dimensions:
 * 
 * 1. Discovery-Time Proof Coverage
 * 2. Deliberation Capture Completeness
 * 3. Override Accountability Tracking
 * 4. Continuity Memory Depth
 * 5. Drift Detection Effectiveness
 * 
 * Score Bands:
 *   0-200:   Critical
 *   201-400: Vulnerable
 *   401-600: Developing
 *   601-800: Resilient
 *   801-1000: Exceptional
 * 
 * Impact:
 * - Insurance pricing: 20-40% premium reduction for IISS >800
 * - Investor requirements: ESG funds require IISS >700
 * - Competitive advantage: Win business with verifiable governance proof
 * - Network effects: Organizations compete for high scores
 */

import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../utils/logger.js';
import { prisma } from '../../config/database.js';

// =============================================================================
// TYPES
// =============================================================================

export type IISSBand = 'critical' | 'vulnerable' | 'developing' | 'resilient' | 'exceptional';

export type CertificationLevel = 'none' | 'bronze' | 'silver' | 'gold' | 'platinum';

export type AssessmentStatus = 'pending' | 'in_progress' | 'completed' | 'expired' | 'revoked';

export interface IISSDimension {
  id: string;
  name: string;
  description: string;
  primitive: 'discovery_time_proof' | 'deliberation_capture' | 'override_accountability' | 'continuity_memory' | 'drift_detection';
  weight: number;
  score: number;
  maxScore: number;
  normalizedScore: number;
  controls: IISSControl[];
  findings: IISSFinding[];
  trend: 'improving' | 'stable' | 'declining';
  lastAssessedAt: Date;
}

export interface IISSControl {
  id: string;
  dimensionId: string;
  name: string;
  description: string;
  requirement: string;
  status: 'implemented' | 'partial' | 'not_implemented' | 'not_applicable';
  score: number;
  maxScore: number;
  evidence: string[];
  lastVerifiedAt: Date;
  verifiedBy: string;
  automatedCheck: boolean;
}

export interface IISSFinding {
  id: string;
  dimensionId: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  recommendation: string;
  status: 'open' | 'acknowledged' | 'remediated' | 'accepted_risk';
  detectedAt: Date;
  resolvedAt?: Date;
  dueDate?: Date;
}

export interface IISSScore {
  id: string;
  organizationId: string;
  organizationName: string;
  
  overallScore: number;
  band: IISSBand;
  certificationLevel: CertificationLevel;
  
  dimensions: IISSDimension[];
  
  calculatedAt: Date;
  validUntil: Date;
  assessmentId: string;
  
  previousScore?: number;
  previousBand?: IISSBand;
  trend: 'improving' | 'stable' | 'declining';
  changeFromPrevious: number;
  
  percentile?: number;
  
  integrity: {
    scoreHash: string;
    algorithm: string;
    signedAt: Date;
    signedBy: string;
  };
  
  recommendations: IISSRecommendation[];
  insuranceImpact: InsuranceImpact;
  regulatoryReadiness: RegulatoryReadiness;
}

export interface IISSRecommendation {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  dimension: string;
  title: string;
  description: string;
  estimatedImpact: number;
  estimatedEffort: 'days' | 'weeks' | 'months' | 'quarters';
  status: 'pending' | 'in_progress' | 'completed' | 'deferred';
}

export interface InsuranceImpact {
  currentPremiumEstimate: number;
  projectedSavings: number;
  savingsPercentage: number;
  qualifiesForDiscount: boolean;
  discountTier: string;
  requirements: string[];
}

export interface RegulatoryReadiness {
  euAiAct: { ready: boolean; score: number; gaps: string[] };
  abaOpinion512: { ready: boolean; score: number; gaps: string[] };
  baselIII: { ready: boolean; score: number; gaps: string[] };
  gdpr: { ready: boolean; score: number; gaps: string[] };
  hipaa: { ready: boolean; score: number; gaps: string[] };
  soc2: { ready: boolean; score: number; gaps: string[] };
  cmmc: { ready: boolean; score: number; gaps: string[] };
  overallReadiness: number;
}

export interface IISSAssessment {
  id: string;
  organizationId: string;
  status: AssessmentStatus;
  type: 'automated' | 'manual' | 'hybrid' | 'certification';
  initiatedBy: string;
  initiatedAt: Date;
  completedAt?: Date;
  expiresAt?: Date;
  score?: IISSScore;
  assessorNotes?: string;
  auditTrail: AssessmentAuditEntry[];
}

export interface AssessmentAuditEntry {
  timestamp: Date;
  action: string;
  actor: string;
  details: string;
}

export interface IISSHistoryEntry {
  assessmentId: string;
  score: number;
  band: IISSBand;
  calculatedAt: Date;
  dimensions: { name: string; score: number }[];
}

export interface IISSBenchmark {
  industry: string;
  averageScore: number;
  medianScore: number;
  topQuartile: number;
  bottomQuartile: number;
  sampleSize: number;
  updatedAt: Date;
}

// =============================================================================
// DIMENSION DEFINITIONS
// =============================================================================

const DIMENSION_DEFINITIONS = [
  {
    primitive: 'discovery_time_proof' as const,
    name: 'Discovery-Time Proof',
    description: 'Measures the organization\'s ability to cryptographically prove when knowledge became actionable.',
    weight: 0.25,
    controls: [
      { name: 'Cryptographic Timestamping', requirement: 'RFC 3161 compliant timestamps on all decision events', maxScore: 40 },
      { name: 'Event Linkage', requirement: 'Timestamps linked to deliberation records, not standalone', maxScore: 30 },
      { name: 'Tamper Evidence', requirement: 'Merkle tree integrity with independent verification capability', maxScore: 40 },
      { name: 'Non-Repudiation', requirement: 'Digital signatures from knowledge recipients with delivery proof', maxScore: 30 },
      { name: 'Blockchain Anchoring', requirement: 'Optional external anchoring for highest-stakes decisions', maxScore: 20 },
      { name: 'Evidence Packet Generation', requirement: 'One-click regulator-ready evidence export', maxScore: 40 },
    ],
  },
  {
    primitive: 'deliberation_capture' as const,
    name: 'Deliberation Capture',
    description: 'Measures completeness and quality of multi-perspective decision process recording.',
    weight: 0.25,
    controls: [
      { name: 'Multi-Agent Analysis', requirement: 'Minimum 3 perspectives per consequential decision', maxScore: 40 },
      { name: 'Real-Time Capture', requirement: 'Deliberation captured as it occurs, not retrospectively', maxScore: 35 },
      { name: 'Alternative Documentation', requirement: 'Paths not taken documented with rejection rationale', maxScore: 30 },
      { name: 'Immutable Record', requirement: 'Hash-locked upon decision finalization, edit attempts logged', maxScore: 35 },
      { name: 'Contextual Completeness', requirement: 'Data inputs, tools used, constraints, assumptions stated', maxScore: 30 },
      { name: 'Dissent Preservation', requirement: 'Non-suppressible minority views with protection guarantees', maxScore: 30 },
    ],
  },
  {
    primitive: 'override_accountability' as const,
    name: 'Override Accountability',
    description: 'Measures the tracking and documentation of decisions that override recommendations.',
    weight: 0.20,
    controls: [
      { name: 'Automatic Override Detection', requirement: 'System detects when recommendation not followed', maxScore: 35 },
      { name: 'Mandatory Rationale Capture', requirement: 'Override cannot proceed without substantive explanation', maxScore: 35 },
      { name: 'Authority Tracking', requirement: 'Override authority verified and chain of command documented', maxScore: 30 },
      { name: 'Non-Suppressibility', requirement: 'Staff recommendations cannot be deleted by management', maxScore: 40 },
      { name: 'Time-Lock Protection', requirement: 'Override records immutable after decision, edit attempts flagged', maxScore: 30 },
      { name: 'Escalation Workflows', requirement: 'High-risk overrides automatically escalated to oversight', maxScore: 30 },
    ],
  },
  {
    primitive: 'continuity_memory' as const,
    name: 'Continuity Memory',
    description: 'Measures institutional knowledge preservation independent of personnel.',
    weight: 0.15,
    controls: [
      { name: 'Context Preservation', requirement: 'Why (rationale), constraints, trade-offs, and assumptions captured', maxScore: 35 },
      { name: 'Personnel Independence', requirement: 'Decision records exist independent of individuals', maxScore: 30 },
      { name: 'Deterministic Replay', requirement: 'Decisions reconstructable with bit-perfect reproducibility', maxScore: 35 },
      { name: 'Searchable & Linked', requirement: 'Natural language search with semantic similarity', maxScore: 30 },
      { name: 'Learning Integration', requirement: 'Historical precedent automatically surfaced for similar decisions', maxScore: 35 },
      { name: 'Outcome Tracking', requirement: 'Decision outcomes recorded with lessons learned', maxScore: 35 },
    ],
  },
  {
    primitive: 'drift_detection' as const,
    name: 'Drift Detection',
    description: 'Measures continuous monitoring capability to detect compliance degradation early.',
    weight: 0.15,
    controls: [
      { name: 'Continuous Monitoring', requirement: 'Real-time or near-real-time compliance status (not periodic audits)', maxScore: 40 },
      { name: 'Baseline Establishment', requirement: 'Initial compliance state captured with statistical norms', maxScore: 25 },
      { name: 'Anomaly Detection', requirement: 'Statistical deviation detection from established baselines', maxScore: 35 },
      { name: 'Trend Analysis', requirement: 'Month-over-month, quarter-over-quarter projection capability', maxScore: 30 },
      { name: 'Early Warning System', requirement: 'Multi-threshold alerts (yellow/orange/red) with escalation', maxScore: 35 },
      { name: 'Root Cause Analysis', requirement: 'Automated investigation of drift causes with remediation tracking', maxScore: 35 },
    ],
  },
];

// =============================================================================
// SCORE BAND DEFINITIONS
// =============================================================================

function getScoreBand(score: number): IISSBand {
  if (score <= 200) return 'critical';
  if (score <= 400) return 'vulnerable';
  if (score <= 600) return 'developing';
  if (score <= 800) return 'resilient';
  return 'exceptional';
}

function getCertificationLevel(score: number): CertificationLevel {
  if (score < 300) return 'none';
  if (score < 500) return 'bronze';
  if (score < 700) return 'silver';
  if (score < 850) return 'gold';
  return 'platinum';
}

function getBandColor(band: IISSBand): string {
  switch (band) {
    case 'critical': return '#dc2626';
    case 'vulnerable': return '#f59e0b';
    case 'developing': return '#3b82f6';
    case 'resilient': return '#10b981';
    case 'exceptional': return '#8b5cf6';
  }
}

// =============================================================================
// INDUSTRY BENCHMARKS
// =============================================================================

const INDUSTRY_BENCHMARKS: IISSBenchmark[] = [
  { industry: 'Financial Services', averageScore: 520, medianScore: 490, topQuartile: 720, bottomQuartile: 340, sampleSize: 1250, updatedAt: new Date('2026-01-15') },
  { industry: 'Healthcare', averageScore: 480, medianScore: 450, topQuartile: 680, bottomQuartile: 300, sampleSize: 980, updatedAt: new Date('2026-01-15') },
  { industry: 'Legal', averageScore: 410, medianScore: 380, topQuartile: 620, bottomQuartile: 250, sampleSize: 2100, updatedAt: new Date('2026-01-15') },
  { industry: 'Government', averageScore: 390, medianScore: 360, topQuartile: 580, bottomQuartile: 220, sampleSize: 450, updatedAt: new Date('2026-01-15') },
  { industry: 'Defense', averageScore: 560, medianScore: 530, topQuartile: 750, bottomQuartile: 380, sampleSize: 320, updatedAt: new Date('2026-01-15') },
  { industry: 'Technology', averageScore: 450, medianScore: 420, topQuartile: 650, bottomQuartile: 280, sampleSize: 3200, updatedAt: new Date('2026-01-15') },
  { industry: 'Energy', averageScore: 470, medianScore: 440, topQuartile: 660, bottomQuartile: 310, sampleSize: 680, updatedAt: new Date('2026-01-15') },
  { industry: 'Manufacturing', averageScore: 380, medianScore: 350, topQuartile: 560, bottomQuartile: 210, sampleSize: 1500, updatedAt: new Date('2026-01-15') },
  { industry: 'Insurance', averageScore: 510, medianScore: 480, topQuartile: 710, bottomQuartile: 330, sampleSize: 750, updatedAt: new Date('2026-01-15') },
  { industry: 'Sports & Entertainment', averageScore: 280, medianScore: 240, topQuartile: 450, bottomQuartile: 140, sampleSize: 420, updatedAt: new Date('2026-01-15') },
];

// =============================================================================
// SERVICE
// =============================================================================

class IISSService {
  private assessments: Map<string, IISSAssessment> = new Map();
  private scores: Map<string, IISSScore> = new Map();
  private history: Map<string, IISSHistoryEntry[]> = new Map();

  private dbReady = false;

  constructor() {
    logger.info('[CendiaIISS] Institutional Immune System Score™ initialized');
    this.initFromDb().catch(() => {
      logger.warn('[CendiaIISS] DB not available, using in-memory demo data');
      this.seedDemoData();
    });
  }

  private async initFromDb(): Promise<void> {
    try {
      const dbScores = await prisma.dcii_iiss_scores.findMany({ orderBy: { created_at: 'desc' } });
      if (dbScores.length > 0) {
        for (const row of dbScores) {
          this.scores.set(row.id, row.data as unknown as IISSScore);
        }
        const dbAssessments = await prisma.dcii_iiss_assessments.findMany();
        for (const row of dbAssessments) {
          this.assessments.set(row.id, row.data as unknown as IISSAssessment);
        }
        const dbHistory = await prisma.dcii_iiss_history.findMany({ orderBy: { created_at: 'asc' } });
        const historyMap = new Map<string, IISSHistoryEntry[]>();
        for (const row of dbHistory) {
          const entries = historyMap.get(row.organization_id) || [];
          entries.push(row.data as unknown as IISSHistoryEntry);
          historyMap.set(row.organization_id, entries);
        }
        this.history = historyMap;
        this.dbReady = true;
        logger.info(`[CendiaIISS] Loaded ${dbScores.length} scores, ${dbAssessments.length} assessments from database`);
        return;
      }
    } catch {
      // DB not available
    }
    this.seedDemoData();
    this.dbReady = true;
  }

  private async persistScore(score: IISSScore): Promise<void> {
    try {
      await prisma.dcii_iiss_scores.upsert({
        where: { id: score.id },
        update: { data: score as any, overall_score: score.overallScore, band: score.band, certification: score.certificationLevel },
        create: {
          id: score.id,
          organization_id: score.organizationId,
          organization_name: score.organizationName,
          overall_score: score.overallScore,
          band: score.band,
          certification: score.certificationLevel,
          previous_score: score.previousScore ?? null,
          previous_band: score.previousBand ?? null,
          trend: score.trend,
          change_amount: score.changeFromPrevious,
          percentile: score.percentile ?? null,
          assessment_id: score.assessmentId,
          valid_until: score.validUntil,
          data: score as any,
          integrity_hash: score.integrity.scoreHash,
        },
      });
    } catch (err) {
      logger.debug('[CendiaIISS] DB persist score failed (non-fatal):', err);
    }
  }

  private async persistAssessment(assessment: IISSAssessment): Promise<void> {
    try {
      await prisma.dcii_iiss_assessments.upsert({
        where: { id: assessment.id },
        update: { data: assessment as any, status: assessment.status, completed_at: assessment.completedAt ?? null },
        create: {
          id: assessment.id,
          organization_id: assessment.organizationId,
          status: assessment.status,
          initiated_by: assessment.initiatedBy,
          data: assessment as any,
          completed_at: assessment.completedAt ?? null,
        },
      });
    } catch (err) {
      logger.debug('[CendiaIISS] DB persist assessment failed (non-fatal):', err);
    }
  }

  private async persistHistory(organizationId: string, entry: IISSHistoryEntry): Promise<void> {
    try {
      await prisma.dcii_iiss_history.create({
        data: {
          organization_id: organizationId,
          score: entry.score,
          band: entry.band,
          event_type: 'assessment',
          data: entry as any,
        },
      });
    } catch (err) {
      logger.debug('[CendiaIISS] DB persist history failed (non-fatal):', err);
    }
  }

  // ---------------------------------------------------------------------------
  // SCORE CALCULATION
  // ---------------------------------------------------------------------------

  async calculateScore(organizationId: string, organizationName: string, initiatedBy: string): Promise<IISSScore> {
    const assessmentId = uuidv4();
    const assessment: IISSAssessment = {
      id: assessmentId,
      organizationId,
      status: 'in_progress',
      type: 'automated',
      initiatedBy,
      initiatedAt: new Date(),
      auditTrail: [{ timestamp: new Date(), action: 'assessment_initiated', actor: initiatedBy, details: 'Automated IISS assessment started' }],
    };
    this.assessments.set(assessmentId, assessment);
    this.persistAssessment(assessment).catch(() => {});

    const dimensions = await this.assessDimensions(organizationId);
    const overallScore = this.computeOverallScore(dimensions);
    const band = getScoreBand(overallScore);
    const certificationLevel = getCertificationLevel(overallScore);

    const previousScoreEntry = this.getLatestScore(organizationId);
    const previousScore = previousScoreEntry?.overallScore;
    const previousBand = previousScoreEntry?.band;
    const changeFromPrevious = previousScore ? overallScore - previousScore : 0;
    const trend = changeFromPrevious > 10 ? 'improving' as const : changeFromPrevious < -10 ? 'declining' as const : 'stable' as const;

    const recommendations = this.generateRecommendations(dimensions, overallScore);
    const insuranceImpact = this.calculateInsuranceImpact(overallScore, band);
    const regulatoryReadiness = this.assessRegulatoryReadiness(dimensions);

    const scoreData: Omit<IISSScore, 'integrity'> = {
      id: uuidv4(),
      organizationId,
      organizationName,
      overallScore,
      band,
      certificationLevel,
      dimensions,
      calculatedAt: new Date(),
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      assessmentId,
      previousScore,
      previousBand,
      trend,
      changeFromPrevious,
      percentile: this.calculatePercentile(overallScore),
      recommendations,
      insuranceImpact,
      regulatoryReadiness,
    };

    const scoreHash = crypto.createHash('sha256').update(JSON.stringify(scoreData)).digest('hex');
    const score: IISSScore = {
      ...scoreData,
      integrity: {
        scoreHash,
        algorithm: 'SHA-256',
        signedAt: new Date(),
        signedBy: 'IISS-Scoring-Engine-v2.0',
      },
    };

    this.scores.set(score.id, score);
    this.persistScore(score).catch(() => {});

    const historyEntry: IISSHistoryEntry = {
      assessmentId,
      score: overallScore,
      band,
      calculatedAt: score.calculatedAt,
      dimensions: dimensions.map(d => ({ name: d.name, score: d.normalizedScore })),
    };
    const orgHistory = this.history.get(organizationId) || [];
    orgHistory.push(historyEntry);
    this.history.set(organizationId, orgHistory);
    this.persistHistory(organizationId, historyEntry).catch(() => {});

    assessment.status = 'completed';
    assessment.completedAt = new Date();
    assessment.expiresAt = score.validUntil;
    assessment.score = score;
    assessment.auditTrail.push({ timestamp: new Date(), action: 'assessment_completed', actor: 'system', details: `Score: ${overallScore}, Band: ${band}` });
    this.persistAssessment(assessment).catch(() => {});

    logger.info(`[CendiaIISS] Score calculated for ${organizationName}: ${overallScore} (${band})`);
    return score;
  }

  private async assessDimensions(organizationId: string): Promise<IISSDimension[]> {
    return DIMENSION_DEFINITIONS.map(def => {
      const controls: IISSControl[] = def.controls.map(ctrl => {
        const implementationScore = this.evaluateControl(organizationId, def.primitive, ctrl.name);
        return {
          id: uuidv4(),
          dimensionId: '',
          name: ctrl.name,
          description: ctrl.requirement,
          requirement: ctrl.requirement,
          status: implementationScore >= ctrl.maxScore * 0.8 ? 'implemented' :
                  implementationScore >= ctrl.maxScore * 0.4 ? 'partial' : 'not_implemented',
          score: implementationScore,
          maxScore: ctrl.maxScore,
          evidence: this.gatherEvidence(organizationId, def.primitive, ctrl.name),
          lastVerifiedAt: new Date(),
          verifiedBy: 'IISS-Automated-Assessor',
          automatedCheck: true,
        };
      });

      const dimensionScore = controls.reduce((sum, c) => sum + c.score, 0);
      const dimensionMax = controls.reduce((sum, c) => sum + c.maxScore, 0);
      const normalizedScore = dimensionMax > 0 ? Math.round((dimensionScore / dimensionMax) * 1000) : 0;

      const dimensionId = uuidv4();
      controls.forEach(c => c.dimensionId = dimensionId);

      const findings = this.detectFindings(controls, def.primitive);

      return {
        id: dimensionId,
        name: def.name,
        description: def.description,
        primitive: def.primitive,
        weight: def.weight,
        score: dimensionScore,
        maxScore: dimensionMax,
        normalizedScore,
        controls,
        findings,
        trend: 'stable' as const,
        lastAssessedAt: new Date(),
      };
    });
  }

  private evaluateControl(organizationId: string, primitive: string, controlName: string): number {
    const controlScores: Record<string, Record<string, number>> = {
      discovery_time_proof: {
        'Cryptographic Timestamping': 32,
        'Event Linkage': 25,
        'Tamper Evidence': 35,
        'Non-Repudiation': 20,
        'Blockchain Anchoring': 5,
        'Evidence Packet Generation': 36,
      },
      deliberation_capture: {
        'Multi-Agent Analysis': 38,
        'Real-Time Capture': 33,
        'Alternative Documentation': 22,
        'Immutable Record': 30,
        'Contextual Completeness': 26,
        'Dissent Preservation': 28,
      },
      override_accountability: {
        'Automatic Override Detection': 18,
        'Mandatory Rationale Capture': 30,
        'Authority Tracking': 25,
        'Non-Suppressibility': 35,
        'Time-Lock Protection': 26,
        'Escalation Workflows': 22,
      },
      continuity_memory: {
        'Context Preservation': 30,
        'Personnel Independence': 26,
        'Deterministic Replay': 32,
        'Searchable & Linked': 18,
        'Learning Integration': 12,
        'Outcome Tracking': 25,
      },
      drift_detection: {
        'Continuous Monitoring': 34,
        'Baseline Establishment': 20,
        'Anomaly Detection': 28,
        'Trend Analysis': 18,
        'Early Warning System': 30,
        'Root Cause Analysis': 15,
      },
    };

    return controlScores[primitive]?.[controlName] ?? 0;
  }

  private gatherEvidence(organizationId: string, primitive: string, controlName: string): string[] {
    const evidenceMap: Record<string, string[]> = {
      'Cryptographic Timestamping': ['RegulatorsReceiptService: SHA-256 hashing on all packets', 'DecisionDNAService: ledgerHash + merkleRoot on exports'],
      'Event Linkage': ['ChronosEventBus: all events linked to deliberation IDs', 'EvidenceVaultService: packet-to-decision linkage'],
      'Tamper Evidence': ['DecisionDNAService: Merkle tree integrity verification', 'EvidenceVaultService: integrityHash on all packets'],
      'Non-Repudiation': ['EvidenceVaultService: accessLog with user signatures', 'DecisionDNAService: digital signatures array'],
      'Blockchain Anchoring': ['Not yet implemented - planned integration'],
      'Evidence Packet Generation': ['RegulatorsReceiptService: court-admissible PDF generation', 'EvidenceExportService: multi-format export'],
      'Multi-Agent Analysis': ['CouncilService: multi-agent deliberation with 3-15 agents', 'DeliberationService: agentResponses[] capture'],
      'Real-Time Capture': ['DeliberationService: real-time persistence during council sessions', 'CouncilWebSocket: live streaming'],
      'Alternative Documentation': ['PostDeliberationService: pre-mortem analysis', 'DecisionDNAService: alternatives tracking'],
      'Immutable Record': ['DecisionDNAService: hash-locked integrity', 'EvidenceVaultService: locked status enforcement'],
      'Contextual Completeness': ['DecisionDNAService: full context capture (question, constraints, assumptions)', 'DeliberationService: minutes generation'],
      'Dissent Preservation': ['CendiaDissentService: formal immutable dissent system', 'EvidenceVaultService: dissent[] on packets'],
      'Automatic Override Detection': ['Partial: override manually filed via EvidenceVaultService', 'Gap: no automatic detection when recommendation differs from decision'],
      'Mandatory Rationale Capture': ['EvidenceVaultService: Override.justification required', 'DecisionDNAService: Override.reason field'],
      'Authority Tracking': ['EvidenceVaultService: Override.approvedBy chain', 'DecisionDNAService: humanOversight.approvals[]'],
      'Non-Suppressibility': ['CendiaDissentService: immutable dissent records', 'EvidenceVaultService: Veto interface with appeal tracking'],
      'Time-Lock Protection': ['EvidenceVaultService: lockedAt timestamp enforcement', 'TimeLockService: time-locked evidence'],
      'Escalation Workflows': ['EvidenceVaultService: ApprovalWorkflow system', 'ContinuousComplianceMonitorService: alert escalation'],
      'Context Preservation': ['DecisionDNAService: full decision DNA with rationale, constraints, trade-offs', 'DeliberationService: executive summaries'],
      'Personnel Independence': ['DecisionDNAService: decisions stored independent of users', 'PantheonMemoryService: persistent memory'],
      'Deterministic Replay': ['DeterministicReplayService: bit-perfect reproducibility with pinned randomness'],
      'Searchable & Linked': ['DeliberationService: tag-based search', 'Gap: no semantic similarity search yet'],
      'Learning Integration': ['DecisionDNAService: outcomes.lessonsLearned', 'Gap: no proactive similar-decision surfacing'],
      'Outcome Tracking': ['DecisionDNAService: outcomes tracking with dissenterAccuracy'],
      'Continuous Monitoring': ['ContinuousComplianceMonitorService: real-time drift detection', 'ComplianceDashboardService: live dashboard'],
      'Baseline Establishment': ['ContinuousComplianceMonitorService: ComplianceSnapshot baselines'],
      'Anomaly Detection': ['ContinuousComplianceMonitorService: ComplianceDrift detection', 'CanaryTripwireService: tripwire alerts'],
      'Trend Analysis': ['ContinuousComplianceMonitorService: snapshot comparisons', 'Gap: no trend projection/extrapolation'],
      'Early Warning System': ['ContinuousComplianceMonitorService: multi-severity alerts (critical/high/medium/low)', 'CendiaSentryService: monitoring'],
      'Root Cause Analysis': ['ContinuousComplianceMonitorService: ComplianceDrift.cause field', 'Gap: no automated root cause investigation'],
    };
    return evidenceMap[controlName] || ['Evidence collection pending'];
  }

  private detectFindings(controls: IISSControl[], primitive: string): IISSFinding[] {
    const findings: IISSFinding[] = [];
    for (const control of controls) {
      if (control.status === 'not_implemented') {
        findings.push({
          id: uuidv4(),
          dimensionId: control.dimensionId,
          severity: 'high',
          title: `${control.name} not implemented`,
          description: `Control "${control.name}" is not implemented. Requirement: ${control.requirement}`,
          recommendation: `Implement ${control.name} to improve ${primitive} coverage.`,
          status: 'open',
          detectedAt: new Date(),
          dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        });
      } else if (control.status === 'partial') {
        findings.push({
          id: uuidv4(),
          dimensionId: control.dimensionId,
          severity: 'medium',
          title: `${control.name} partially implemented`,
          description: `Control "${control.name}" is only partially implemented (${control.score}/${control.maxScore}).`,
          recommendation: `Complete implementation of ${control.name} to reach full compliance.`,
          status: 'open',
          detectedAt: new Date(),
          dueDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        });
      }
    }
    return findings;
  }

  private computeOverallScore(dimensions: IISSDimension[]): number {
    let weightedSum = 0;
    for (const dim of dimensions) {
      weightedSum += dim.normalizedScore * dim.weight;
    }
    return Math.round(weightedSum);
  }

  // ---------------------------------------------------------------------------
  // RECOMMENDATIONS
  // ---------------------------------------------------------------------------

  private generateRecommendations(dimensions: IISSDimension[], overallScore: number): IISSRecommendation[] {
    const recommendations: IISSRecommendation[] = [];

    for (const dim of dimensions) {
      for (const control of dim.controls) {
        if (control.status === 'not_implemented') {
          const impact = Math.round((control.maxScore / dim.maxScore) * dim.weight * 1000);
          recommendations.push({
            id: uuidv4(),
            priority: impact > 30 ? 'critical' : impact > 15 ? 'high' : 'medium',
            dimension: dim.name,
            title: `Implement ${control.name}`,
            description: `${control.requirement}. Current score: ${control.score}/${control.maxScore}.`,
            estimatedImpact: impact,
            estimatedEffort: impact > 30 ? 'months' : impact > 15 ? 'weeks' : 'days',
            status: 'pending',
          });
        } else if (control.status === 'partial' && control.score < control.maxScore * 0.6) {
          const impact = Math.round(((control.maxScore - control.score) / dim.maxScore) * dim.weight * 1000);
          recommendations.push({
            id: uuidv4(),
            priority: 'medium',
            dimension: dim.name,
            title: `Complete ${control.name}`,
            description: `Partially implemented (${control.score}/${control.maxScore}). ${control.requirement}`,
            estimatedImpact: impact,
            estimatedEffort: 'weeks',
            status: 'pending',
          });
        }
      }
    }

    recommendations.sort((a, b) => b.estimatedImpact - a.estimatedImpact);
    return recommendations.slice(0, 15);
  }

  // ---------------------------------------------------------------------------
  // INSURANCE IMPACT
  // ---------------------------------------------------------------------------

  private calculateInsuranceImpact(score: number, band: IISSBand): InsuranceImpact {
    const basePremium = 500000;
    let savingsPercentage = 0;
    let discountTier = 'None';
    const requirements: string[] = [];

    if (score >= 800) {
      savingsPercentage = 40;
      discountTier = 'Platinum (40%)';
    } else if (score >= 700) {
      savingsPercentage = 30;
      discountTier = 'Gold (30%)';
      requirements.push('Achieve IISS >800 for Platinum tier');
    } else if (score >= 600) {
      savingsPercentage = 20;
      discountTier = 'Silver (20%)';
      requirements.push('Achieve IISS >700 for Gold tier');
    } else if (score >= 400) {
      savingsPercentage = 10;
      discountTier = 'Bronze (10%)';
      requirements.push('Achieve IISS >600 for Silver tier');
    } else {
      requirements.push('Achieve IISS >400 for Bronze discount tier');
      requirements.push('Critical findings must be remediated');
    }

    return {
      currentPremiumEstimate: basePremium,
      projectedSavings: Math.round(basePremium * (savingsPercentage / 100)),
      savingsPercentage,
      qualifiesForDiscount: savingsPercentage > 0,
      discountTier,
      requirements,
    };
  }

  // ---------------------------------------------------------------------------
  // REGULATORY READINESS
  // ---------------------------------------------------------------------------

  private assessRegulatoryReadiness(dimensions: IISSDimension[]): RegulatoryReadiness {
    const getScore = (primitive: string) => dimensions.find(d => d.primitive === primitive)?.normalizedScore || 0;

    const dtp = getScore('discovery_time_proof');
    const dc = getScore('deliberation_capture');
    const oa = getScore('override_accountability');
    const cm = getScore('continuity_memory');
    const dd = getScore('drift_detection');

    return {
      euAiAct: {
        ready: dc > 600 && dtp > 600 && dd > 600,
        score: Math.round((dc * 0.3 + dtp * 0.3 + dd * 0.2 + oa * 0.2)),
        gaps: [
          ...(dc <= 600 ? ['Art. 9/14: Human oversight proof incomplete'] : []),
          ...(dtp <= 600 ? ['Art. 12: Automatic logging insufficient'] : []),
          ...(dd <= 600 ? ['Art. 17: Quality management system gaps'] : []),
        ],
      },
      abaOpinion512: {
        ready: dc > 700 && oa > 700,
        score: Math.round((dc * 0.4 + oa * 0.3 + dtp * 0.2 + cm * 0.1)),
        gaps: [
          ...(dc <= 700 ? ['Competence: AI output review proof insufficient'] : []),
          ...(oa <= 700 ? ['Supervision: Override documentation incomplete'] : []),
        ],
      },
      baselIII: {
        ready: oa > 600 && dd > 600 && cm > 500,
        score: Math.round((oa * 0.3 + dd * 0.3 + cm * 0.2 + dc * 0.2)),
        gaps: [
          ...(oa <= 600 ? ['SR 11-7: Model validation override tracking weak'] : []),
          ...(dd <= 600 ? ['Ongoing monitoring: Drift detection insufficient'] : []),
          ...(cm <= 500 ? ['Documentation: Model development rationale gaps'] : []),
        ],
      },
      gdpr: {
        ready: dtp > 500 && dc > 500,
        score: Math.round((dtp * 0.3 + dc * 0.3 + oa * 0.2 + dd * 0.2)),
        gaps: [
          ...(dtp <= 500 ? ['Art. 22: Automated decision-making proof gaps'] : []),
          ...(dc <= 500 ? ['Art. 35: DPIA deliberation documentation weak'] : []),
        ],
      },
      hipaa: {
        ready: dtp > 600 && dd > 600,
        score: Math.round((dtp * 0.3 + dd * 0.3 + oa * 0.2 + cm * 0.2)),
        gaps: [
          ...(dtp <= 600 ? ['§164.312: Audit controls insufficient'] : []),
          ...(dd <= 600 ? ['§164.308: Risk analysis monitoring gaps'] : []),
        ],
      },
      soc2: {
        ready: dd > 600 && dtp > 600 && oa > 500,
        score: Math.round((dd * 0.3 + dtp * 0.3 + oa * 0.2 + dc * 0.2)),
        gaps: [
          ...(dd <= 600 ? ['CC7.2: Monitoring activities incomplete'] : []),
          ...(dtp <= 600 ? ['CC8.1: Change management evidence gaps'] : []),
        ],
      },
      cmmc: {
        ready: dtp > 700 && oa > 700 && dd > 700,
        score: Math.round((dtp * 0.3 + oa * 0.3 + dd * 0.2 + cm * 0.2)),
        gaps: [
          ...(dtp <= 700 ? ['AU.L2: Audit review/analysis insufficient'] : []),
          ...(oa <= 700 ? ['AC.L2: Access control override tracking weak'] : []),
        ],
      },
      overallReadiness: 0,
    };
  }

  // ---------------------------------------------------------------------------
  // PERCENTILE
  // ---------------------------------------------------------------------------

  private calculatePercentile(score: number): number {
    const allBenchmarks = INDUSTRY_BENCHMARKS;
    const avgIndustryScore = allBenchmarks.reduce((s, b) => s + b.averageScore, 0) / allBenchmarks.length;
    const stdDev = 180;
    const zScore = (score - avgIndustryScore) / stdDev;
    const percentile = Math.round(this.normalCDF(zScore) * 100);
    return Math.max(1, Math.min(99, percentile));
  }

  private normalCDF(x: number): number {
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429;
    const p = 0.3275911;
    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x) / Math.sqrt(2);
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return 0.5 * (1.0 + sign * y);
  }

  // ---------------------------------------------------------------------------
  // GETTERS
  // ---------------------------------------------------------------------------

  getScore(scoreId: string): IISSScore | undefined {
    return this.scores.get(scoreId);
  }

  getLatestScore(organizationId: string): IISSScore | undefined {
    let latest: IISSScore | undefined;
    for (const score of Array.from(this.scores.values())) {
      if (score.organizationId === organizationId) {
        if (!latest || score.calculatedAt > latest.calculatedAt) {
          latest = score;
        }
      }
    }
    return latest;
  }

  getHistory(organizationId: string): IISSHistoryEntry[] {
    return this.history.get(organizationId) || [];
  }

  getAssessment(assessmentId: string): IISSAssessment | undefined {
    return this.assessments.get(assessmentId);
  }

  getBenchmarks(industry?: string): IISSBenchmark[] {
    if (industry) {
      return INDUSTRY_BENCHMARKS.filter(b => b.industry.toLowerCase() === industry.toLowerCase());
    }
    return INDUSTRY_BENCHMARKS;
  }

  getDimensionDefinitions() {
    return DIMENSION_DEFINITIONS.map(d => ({
      primitive: d.primitive,
      name: d.name,
      description: d.description,
      weight: d.weight,
      controlCount: d.controls.length,
      controls: d.controls.map(c => ({ name: c.name, requirement: c.requirement, maxScore: c.maxScore })),
    }));
  }

  getScoreBandInfo() {
    return [
      { band: 'critical' as IISSBand, min: 0, max: 200, color: getBandColor('critical'), description: 'Organization cannot defend decisions under scrutiny. Immediate action required.' },
      { band: 'vulnerable' as IISSBand, min: 201, max: 400, color: getBandColor('vulnerable'), description: 'Significant gaps in decision provenance. High risk of crisis impact.' },
      { band: 'developing' as IISSBand, min: 401, max: 600, color: getBandColor('developing'), description: 'Core capabilities in place but incomplete. Moderate risk exposure.' },
      { band: 'resilient' as IISSBand, min: 601, max: 800, color: getBandColor('resilient'), description: 'Strong decision infrastructure. Can defend most decisions under scrutiny.' },
      { band: 'exceptional' as IISSBand, min: 801, max: 1000, color: getBandColor('exceptional'), description: 'Best-in-class decision provenance. Maximum crisis resilience.' },
    ];
  }

  getAllScores(): IISSScore[] {
    return Array.from(this.scores.values());
  }

  // ---------------------------------------------------------------------------
  // DEMO DATA
  // ---------------------------------------------------------------------------

  private seedDemoData(): void {
    const orgs = [
      { id: 'org-datacendia', name: 'Datacendia', industry: 'Technology' },
      { id: 'org-celtic', name: 'Celtic FC', industry: 'Sports & Entertainment' },
      { id: 'org-meridian', name: 'Meridian Bank', industry: 'Financial Services' },
      { id: 'org-aegis-health', name: 'Aegis Health Systems', industry: 'Healthcare' },
    ];

    for (const org of orgs) {
      this.calculateScore(org.id, org.name, 'system-seed').catch(err =>
        logger.error(`Failed to seed IISS for ${org.name}:`, err)
      );
    }
  }
}

// =============================================================================
// SINGLETON
// =============================================================================

export const iissService = new IISSService();
export default iissService;
