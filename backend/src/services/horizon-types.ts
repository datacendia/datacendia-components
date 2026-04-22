// CendiaHorizon Types - extracted for maintainability
import { NodeType, EdgeType, OrbitNode, OrbitEdge } from './CendiaOrbitService.js';

export interface OracleQuery {
  id: string;
  question: string;
  context?: string;
  timeHorizon: TimeHorizon;
  branchCount: number;
  organizationId?: string;
  userId?: string;
  createdAt: Date;
}

export type TimeHorizon = '30d' | '60d' | '90d' | '180d' | '1y' | '3y' | '5y';

export interface OracleSimulation {
  id: string;
  queryId: string;
  question: string;
  status: 'initializing' | 'simulating' | 'complete' | 'failed';
  universes: Universe[];
  historicalEchoes: HistoricalEcho[];
  pivotalMoments: PivotalMoment[];
  recommendation: OracleRecommendation;
  metadata: SimulationMetadata;
  createdAt: Date;
  completedAt?: Date;
}

export interface Universe {
  id: string;
  name: string;
  description: string;
  decision: string;
  color: string;
  icon: string;
  probability: number; // 0-100 likelihood this path is chosen
  timeline: TimelineEvent[];
  outcomes: UniverseOutcome;
  riskProfile: RiskProfile;
  reversibilityScore: number; // 0-100, how easy to reverse course
  pointOfNoReturn?: TimelineEvent | undefined; // When you can't go back
}

export interface TimelineEvent {
  id: string;
  timestamp: Date;
  dayOffset: number; // Days from decision
  title: string;
  description: string;
  type: 'milestone' | 'risk' | 'opportunity' | 'pivot' | 'cascade' | 'external' | 'checkpoint';
  impact: 'positive' | 'negative' | 'neutral' | 'critical';
  confidence: number; // 0-100, decays over time
  cascadeEffects?: CascadeEffect[];
  agentInsights?: AgentInsight[];
}

export interface CascadeEffect {
  id: string;
  domain: string;
  effect: string;
  magnitude: 'minor' | 'moderate' | 'major' | 'transformative';
  delay: number; // Days after parent event
}

export interface AgentInsight {
  agentCode: string;
  agentName: string;
  agentAvatar: string;
  perspective: string;
  sentiment: 'bullish' | 'bearish' | 'cautious' | 'neutral';
}

export interface UniverseOutcome {
  revenue: OutcomeMetric;
  marketShare: OutcomeMetric;
  teamMorale: OutcomeMetric;
  customerSatisfaction: OutcomeMetric;
  competitivePosition: OutcomeMetric;
  riskExposure: OutcomeMetric;
  innovationCapacity: OutcomeMetric;
  overallScore: number; // 0-100
}

export interface OutcomeMetric {
  current: number;
  projected: number;
  change: number; // Percentage change
  confidence: number;
  trend: 'up' | 'down' | 'stable';
}

export interface RiskProfile {
  overall: 'low' | 'moderate' | 'high' | 'critical';
  score: number; // 0-100
  factors: RiskFactor[];
}

export interface RiskFactor {
  name: string;
  category: 'financial' | 'operational' | 'strategic' | 'regulatory' | 'reputational' | 'competitive';
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  mitigation?: string;
}

export interface HistoricalEcho {
  id: string;
  company: string;
  year: number;
  situation: string;
  decision: string;
  outcome: string;
  similarity: number; // 0-100
  lessonsLearned: string[];
  source?: string;
}

export interface PivotalMoment {
  id: string;
  universeId: string;
  dayOffset: number;
  title: string;
  description: string;
  forkOptions: ForkOption[];
  criticalityScore: number; // 0-100
}

export interface ForkOption {
  id: string;
  action: string;
  consequence: string;
  probability: number;
}

export interface OracleRecommendation {
  primaryChoice: string;
  universeId: string;
  confidence: number;
  reasoning: string;
  keyFactors: string[];
  warnings: string[];
  alternativeConsiderations: string[];
}

export interface SimulationMetadata {
  totalEvents: number;
  timeHorizon: TimeHorizon;
  agentsConsulted: string[];
  dataSourcesUsed: string[];
  computeTime: number;
  modelVersion: string;
}

// =============================================================================
// CASCADE TYPES (Merged from CendiaCascade - The Butterfly Effect)
// =============================================================================

export enum ChangeType {
  POLICY = 'policy',
  PRICING = 'pricing',
  STAFFING = 'staffing',
  VENDOR = 'vendor',
  TECHNOLOGY = 'technology',
  PROCESS = 'process',
  PRODUCT = 'product',
  MARKET = 'market',
  REGULATORY = 'regulatory',
  SECURITY = 'security',
  DATA = 'data',
}

export enum ImpactCategory {
  FINANCIAL = 'financial',
  OPERATIONAL = 'operational',
  REPUTATIONAL = 'reputational',
  COMPLIANCE = 'compliance',
  SECURITY = 'security',
  HUMAN = 'human',
  STRATEGIC = 'strategic',
}

export enum Severity {
  MINIMAL = 'minimal',
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum Likelihood {
  RARE = 'rare',
  UNLIKELY = 'unlikely',
  POSSIBLE = 'possible',
  LIKELY = 'likely',
  ALMOST_CERTAIN = 'almost_certain',
}

export interface ChangeSpec {
  id?: string;
  type: ChangeType;
  title: string;
  description: string;
  affectedAssets: string[];
  expectedBenefit: string;
  constraints?: {
    budgetCeiling?: number;
    timelineDays?: number;
    complianceRequirements?: string[];
    noGoLines?: string[];
  };
  proposedBy?: string;
  proposedAt?: Date;
}

export interface ConsequenceAssessment {
  nodeId: string;
  nodeName: string;
  nodeType: NodeType;
  category: ImpactCategory;
  description: string;
  severity: Severity;
  likelihood: Likelihood;
  riskScore: number;
  latencyDays: number;
  order: number;
  confidence: number;
  evidenceBasis: 'measured' | 'derived' | 'inferred' | 'assumed';
  pathDescription: string;
}

export interface Mitigation {
  id: string;
  targetConsequence: string;
  type: 'prevent' | 'detect' | 'respond' | 'transfer';
  description: string;
  implementation: string;
  cost?: number;
  effectivenessScore: number;
  owner?: string;
  deadline?: Date;
}

export interface Guardrail {
  id: string;
  type: 'canary' | 'tripwire' | 'circuit_breaker' | 'rollback_trigger';
  condition: string;
  action: string;
  threshold?: number;
  monitoringFrequency?: string;
}

export interface CascadeTimeline {
  tZero: { date: Date; event: string; directEffects: string[] };
  tShort: { date: Date; effects: ConsequenceAssessment[] };
  tMedium: { date: Date; effects: ConsequenceAssessment[] };
  tLong: { date: Date; effects: ConsequenceAssessment[] };
}

export interface CascadeReport {
  id: string;
  changeSpec: ChangeSpec;
  timestamp: Date;
  status: 'draft' | 'in_review' | 'approved' | 'rejected' | 'executed';
  orbitRunId: string;
  timeline: CascadeTimeline;
  consequences: ConsequenceAssessment[];
  totalRiskScore: number;
  highestRiskConsequence?: ConsequenceAssessment;
  butterflyEffect?: ConsequenceAssessment;
  feedbackLoops: string[][];
  mitigations: Mitigation[];
  guardrails: Guardrail[];
  alternatives?: { description: string; riskDelta: number; tradeoffs: string[] }[];
  recommendation: 'proceed' | 'proceed_with_caution' | 'reconsider' | 'reject';
  rationale: string;
  requiredApprovals?: string[];
  evidenceHash: string;
  signedBy?: string;
  signedAt?: Date;
}

// Re-export Orbit types for convenience
export { NodeType, EdgeType, OrbitNode, OrbitEdge };

// =============================================================================
// CENDIA HORIZON SERVICE (Merged Oracle + Cascade)
// =============================================================================

