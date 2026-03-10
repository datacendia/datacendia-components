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
// HISTORICAL ECHOES DATABASE
// Real-world decision patterns for pattern matching
// =============================================================================

const HISTORICAL_ECHOES: HistoricalEcho[] = [
  {
    id: 'echo-1',
    company: 'Netflix',
    year: 2011,
    situation: 'Considering splitting DVD and streaming businesses',
    decision: 'Announced Qwikster spin-off',
    outcome: 'Customer backlash, stock dropped 77%, reversed decision within weeks',
    similarity: 0,
    lessonsLearned: [
      'Test major changes with customers before announcing',
      'Brand equity matters more than operational efficiency',
      'Speed of reversal can limit damage',
    ],
  },
  {
    id: 'echo-2',
    company: 'Microsoft',
    year: 2014,
    situation: 'Considering major acquisition to enter mobile/enterprise',
    decision: 'Acquired Nokia for $7.2B',
    outcome: 'Wrote off $7.6B, laid off 18,000 employees, exited mobile hardware',
    similarity: 0,
    lessonsLearned: [
      'Acquisition cannot fix fundamental strategic misalignment',
      'Culture integration is harder than technology integration',
      'Sunk cost fallacy can compound losses',
    ],
  },
  {
    id: 'echo-3',
    company: 'Amazon',
    year: 2005,
    situation: 'Considering launching cloud computing services',
    decision: 'Launched AWS despite skepticism',
    outcome: 'Created $80B+ annual revenue business, transformed industry',
    similarity: 0,
    lessonsLearned: [
      'Internal capabilities can become external products',
      'First-mover advantage in platforms is massive',
      'Cannibalization fears often overblown',
    ],
  },
  {
    id: 'echo-4',
    company: 'Kodak',
    year: 1975,
    situation: 'Invented digital camera, considering commercialization',
    decision: 'Suppressed technology to protect film business',
    outcome: 'Bankruptcy in 2012, missed entire digital revolution',
    similarity: 0,
    lessonsLearned: [
      'Disrupting yourself is better than being disrupted',
      'Protecting legacy revenue can destroy future revenue',
      'Technology transitions are faster than expected',
    ],
  },
  {
    id: 'echo-5',
    company: 'Apple',
    year: 2007,
    situation: 'Considering entering smartphone market',
    decision: 'Launched iPhone despite no telecom experience',
    outcome: 'Created $200B+ annual revenue, redefined mobile computing',
    similarity: 0,
    lessonsLearned: [
      'User experience can overcome technical limitations',
      'Ecosystem lock-in creates sustainable advantage',
      'Adjacent market entry can redefine categories',
    ],
  },
  {
    id: 'echo-6',
    company: 'Blockbuster',
    year: 2000,
    situation: 'Netflix offered partnership/acquisition for $50M',
    decision: 'Declined, focused on retail stores',
    outcome: 'Bankruptcy in 2010, Netflix worth $150B+',
    similarity: 0,
    lessonsLearned: [
      'Dismissing small competitors is dangerous',
      'Business model innovation beats operational excellence',
      'Customer convenience always wins long-term',
    ],
  },
  {
    id: 'echo-7',
    company: 'Salesforce',
    year: 2020,
    situation: 'Considering major acquisition during pandemic',
    decision: 'Acquired Slack for $27.7B',
    outcome: 'Mixed results, integration challenges, but strategic positioning improved',
    similarity: 0,
    lessonsLearned: [
      'Platform plays require patience',
      'Acquisition during crisis can yield discounts',
      'Integration planning is as important as deal terms',
    ],
  },
  {
    id: 'echo-8',
    company: 'IBM',
    year: 2005,
    situation: 'Considering exit from PC business',
    decision: 'Sold PC division to Lenovo for $1.75B',
    outcome: 'Successful pivot to services, though missed cloud transition',
    similarity: 0,
    lessonsLearned: [
      'Exiting commoditized markets can free resources',
      'Services margins beat hardware margins',
      'Pivot timing is critical',
    ],
  },
];

// =============================================================================
// AGENT PERSPECTIVES FOR SIMULATION
// =============================================================================

const AGENT_PERSPECTIVES = [
  { code: 'chief', name: 'CEO', avatar: '👔', focus: 'strategic synthesis' },
  { code: 'cfo', name: 'CFO', avatar: '💰', focus: 'financial impact' },
  { code: 'coo', name: 'COO', avatar: '⚙️', focus: 'operational feasibility' },
  { code: 'ciso', name: 'CISO', avatar: '🛡️', focus: 'security & risk' },
  { code: 'risk', name: 'CRiskO', avatar: '⚠️', focus: 'enterprise risk' },
  { code: 'cmo', name: 'CMO', avatar: '📢', focus: 'market positioning' },
  { code: 'cdo', name: 'CDO', avatar: '📊', focus: 'data-driven insights' },
];

// =============================================================================
// UNIVERSE TEMPLATES
// =============================================================================

const UNIVERSE_TEMPLATES = [
  { name: 'Bold Move', color: '#10B981', icon: '🚀', bias: 'aggressive' },
  { name: 'Status Quo', color: '#6B7280', icon: '⏸️', bias: 'conservative' },
  { name: 'Measured Approach', color: '#3B82F6', icon: '⚖️', bias: 'balanced' },
  { name: 'Strategic Pivot', color: '#8B5CF6', icon: '🔄', bias: 'adaptive' },
  { name: 'Defensive Play', color: '#F59E0B', icon: '🛡️', bias: 'protective' },
];

// =============================================================================
// CENDIA HORIZON SERVICE (Merged Oracle + Cascade)
// =============================================================================

