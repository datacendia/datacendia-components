// Types extracted for maintainability

export type IISSBand = 'critical' | 'vulnerable' | 'developing' | 'resilient' | 'exceptional';

export type CertificationLevel = 'none' | 'bronze' | 'silver' | 'gold' | 'platinum';

export type AssessmentStatus = 'pending' | 'in_progress' | 'completed' | 'expired' | 'revoked';

export interface IISSDimension {
  id: string;
  name: string;
  description: string;
  primitive: 'discovery_time_proof' | 'deliberation_capture' | 'override_accountability' | 'continuity_memory' | 'drift_detection' | 'cognitive_bias_mitigation' | 'quantum_resistant_integrity' | 'synthetic_media_authentication' | 'cross_jurisdiction_compliance';
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

export const DIMENSION_DEFINITIONS = [
  {
    primitive: 'discovery_time_proof' as const,
    name: 'Discovery-Time Proof',
    description: 'Measures the organization\'s ability to cryptographically prove when knowledge became actionable.',
    weight: 0.15,
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
    weight: 0.15,
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
    weight: 0.12,
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
    weight: 0.10,
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
    weight: 0.10,
    controls: [
      { name: 'Continuous Monitoring', requirement: 'Real-time or near-real-time compliance status (not periodic audits)', maxScore: 40 },
      { name: 'Baseline Establishment', requirement: 'Initial compliance state captured with statistical norms', maxScore: 25 },
      { name: 'Anomaly Detection', requirement: 'Statistical deviation detection from established baselines', maxScore: 35 },
      { name: 'Trend Analysis', requirement: 'Month-over-month, quarter-over-quarter projection capability', maxScore: 30 },
      { name: 'Early Warning System', requirement: 'Multi-threshold alerts (yellow/orange/red) with escalation', maxScore: 35 },
      { name: 'Root Cause Analysis', requirement: 'Automated investigation of drift causes with remediation tracking', maxScore: 35 },
    ],
  },
  {
    primitive: 'cognitive_bias_mitigation' as const,
    name: 'Cognitive Bias Mitigation',
    description: 'Measures the organization\'s ability to detect and challenge human cognitive biases in decision-making.',
    weight: 0.10,
    controls: [
      { name: 'Bias Detection Library', requirement: 'Minimum 12 cognitive biases tested per consequential decision', maxScore: 35 },
      { name: 'Devil\'s Advocate Enforcement', requirement: 'Adversarial perspective required before decision finalization', maxScore: 30 },
      { name: 'Anchoring Detection', requirement: 'First-number anchoring detected and flagged in deliberations', maxScore: 25 },
      { name: 'Groupthink Prevention', requirement: 'Unanimous decisions flagged for additional scrutiny', maxScore: 30 },
      { name: 'Rubber-Stamp Detection', requirement: 'Decisions approved faster than analysis threshold flagged', maxScore: 25 },
      { name: 'Bias Audit Trail', requirement: 'Bias detection results preserved in decision packet', maxScore: 30 },
    ],
  },
  {
    primitive: 'quantum_resistant_integrity' as const,
    name: 'Quantum-Resistant Integrity',
    description: 'Measures cryptographic future-proofing ensuring decision proof survives quantum computing advances.',
    weight: 0.10,
    controls: [
      { name: 'Post-Quantum Signatures', requirement: 'CRYSTALS-Dilithium or SPHINCS+ on all decision packets', maxScore: 40 },
      { name: 'NIST Compliance', requirement: 'Algorithms comply with NIST FIPS 204/205 standards', maxScore: 35 },
      { name: 'Hybrid Mode', requirement: 'Classical + PQ dual signatures during transition period', maxScore: 25 },
      { name: 'Key Rotation', requirement: 'Automated PQ key rotation with forward secrecy', maxScore: 30 },
      { name: 'Algorithm Agility', requirement: 'Hot-swap cryptographic algorithms without data migration', maxScore: 25 },
      { name: 'Long-Term Verification', requirement: 'Signatures verifiable 50+ years without infrastructure dependency', maxScore: 30 },
    ],
  },
  {
    primitive: 'synthetic_media_authentication' as const,
    name: 'Synthetic Media Authentication',
    description: 'Measures the organization\'s ability to verify authenticity of digital evidence and detect deepfakes.',
    weight: 0.08,
    controls: [
      { name: 'C2PA Provenance', requirement: 'Content Credentials standard (C2PA) on all media evidence', maxScore: 35 },
      { name: 'Deepfake Detection', requirement: 'Pixel-level and audio waveform manipulation analysis', maxScore: 30 },
      { name: 'Chain of Custody', requirement: 'Complete custody chain from original device to evidence vault', maxScore: 30 },
      { name: 'Metadata Integrity', requirement: 'EXIF/metadata preservation with tamper detection', maxScore: 25 },
      { name: 'Multi-Modal Verification', requirement: 'Cross-reference video, audio, and text for consistency', maxScore: 25 },
      { name: 'Court Admissibility', requirement: 'Evidence format meets FRE 901(b)(9) authentication standards', maxScore: 30 },
    ],
  },
  {
    primitive: 'cross_jurisdiction_compliance' as const,
    name: 'Cross-Jurisdiction Compliance',
    description: 'Measures the organization\'s ability to identify and manage conflicting regulatory requirements across jurisdictions.',
    weight: 0.10,
    controls: [
      { name: 'Jurisdiction Coverage', requirement: 'Minimum 17 jurisdictions monitored simultaneously', maxScore: 35 },
      { name: 'Conflict Detection', requirement: 'Automatic identification of contradictory regulatory requirements', maxScore: 35 },
      { name: 'Good-Faith Documentation', requirement: 'Impossible compliance situations documented with maximum-compliance strategy', maxScore: 30 },
      { name: 'Regulatory Update Tracking', requirement: 'Real-time monitoring of regulatory changes across jurisdictions', maxScore: 25 },
      { name: 'Evidence Packet per Jurisdiction', requirement: 'Jurisdiction-specific compliance evidence exportable', maxScore: 30 },
      { name: 'Proactive Disclosure', requirement: 'Conflict analysis shared with regulators before enforcement action', maxScore: 20 },
    ],
  },
];

// =============================================================================
// SCORE BAND DEFINITIONS
// =============================================================================

export function getScoreBand(score: number): IISSBand {
  if (score <= 200) return 'critical';
  if (score <= 400) return 'vulnerable';
  if (score <= 600) return 'developing';
  if (score <= 800) return 'resilient';
  return 'exceptional';
}

export function getCertificationLevel(score: number): CertificationLevel {
  if (score < 300) return 'none';
  if (score < 500) return 'bronze';
  if (score < 700) return 'silver';
  if (score < 850) return 'gold';
  return 'platinum';
}

export function getBandColor(band: IISSBand): string {
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

export const INDUSTRY_BENCHMARKS: IISSBenchmark[] = [
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

