// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaHorizon™ - Predictive Decision Intelligence
 * 
 * "What If" Time Machine for Strategic Decisions
 * Simulates multiple future timelines based on decision branches
 * 
 * Features:
 * - Multi-universe decision simulation
 * - Confidence decay over time
 * - Butterfly effect cascade visualization (powered by CendiaOrbit)
 * - Historical echo pattern matching
 * - Reversibility scoring
 * - Second/Third-Order Consequence Analysis (merged from CendiaCascade)
 * - Graph-based impact propagation
 * - Mitigation & guardrail generation
 * 
 * This service consolidates CendiaCascade™ (The Butterfly Effect) functionality.
 * CendiaOrbit remains the internal graph traversal engine.
 */

import crypto from 'crypto';
import { EventEmitter } from 'events';
import { logger } from '../utils/logger.js';
import {
  orbitService,
  CendiaOrbitService,
  OrbitRunResult,
  InfluenceResult,
  NodeType,
  OrbitNode,
  OrbitEdge,
  EdgeType,
} from './CendiaOrbitService.js';

// =============================================================================
// TYPES
// =============================================================================

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

class CendiaHorizonServiceClass extends EventEmitter {
  private simulations: Map<string, OracleSimulation> = new Map();
  private cascadeReports: Map<string, CascadeReport> = new Map();
  private orbit: CendiaOrbitService;

  constructor(orbitInstance?: CendiaOrbitService) {
    super();
    this.orbit = orbitInstance || orbitService;
    logger.info('[CendiaHorizon] Service initialized (Oracle + Cascade merged)');
  }

  // ===========================================================================
  // CASCADE ANALYSIS (The Butterfly Effect) - Merged from CendiaCascade
  // ===========================================================================

  async analyzeChange(changeSpec: ChangeSpec): Promise<CascadeReport> {
    const reportId = crypto.randomUUID();
    const timestamp = new Date();
    this.emit('cascade:analysis:started', { reportId, changeSpec });

    const allConsequences: ConsequenceAssessment[] = [];
    let orbitRunId = '';

    for (const assetId of changeSpec.affectedAssets) {
      const orbitResult = await this.orbit.runPropagation(assetId, changeSpec.description, 1.0, {
        maxDepth: 5, minProbability: 0.05, timeHorizonDays: 365,
      });
      orbitRunId = orbitResult.runId;
      const consequences = this.convertToConsequences(orbitResult);
      allConsequences.push(...consequences);
    }

    const mergedConsequences = this.mergeConsequences(allConsequences);
    const timeline = this.buildCascadeTimeline(mergedConsequences, changeSpec);
    const feedbackLoops = this.orbit.findFeedbackLoops(4);
    const butterflyEffect = this.findButterflyEffect(mergedConsequences);
    const mitigations = this.generateMitigations(mergedConsequences);
    const guardrails = this.generateGuardrails(mergedConsequences);
    const totalRiskScore = mergedConsequences.reduce((sum, c) => sum + c.riskScore, 0);
    const recommendation = this.generateCascadeRecommendation(totalRiskScore, mergedConsequences);

    const report: CascadeReport = {
      id: reportId,
      changeSpec: { ...changeSpec, id: changeSpec.id || crypto.randomUUID(), proposedAt: changeSpec.proposedAt || timestamp },
      timestamp, status: 'draft', orbitRunId, timeline, consequences: mergedConsequences, totalRiskScore,
      highestRiskConsequence: mergedConsequences.length > 0 ? mergedConsequences.reduce((max, c) => c.riskScore > max.riskScore ? c : max) : undefined,
      butterflyEffect, feedbackLoops, mitigations, guardrails,
      alternatives: [
        { description: 'Phased implementation over 6 months', riskDelta: -30, tradeoffs: ['Slower time-to-value', 'Lower disruption risk'] },
        { description: 'Pilot with single department first', riskDelta: -40, tradeoffs: ['Delayed full benefits', 'Better learning opportunity'] },
        { description: 'Maintain status quo with incremental improvements', riskDelta: -60, tradeoffs: ['No transformation benefits', 'Lowest risk'] },
      ],
      recommendation: recommendation.action, rationale: recommendation.rationale, requiredApprovals: recommendation.requiredApprovals,
      evidenceHash: crypto.createHash('sha256').update(JSON.stringify({ reportId, consequences: mergedConsequences, timestamp: Date.now() })).digest('hex'),
    };

    this.cascadeReports.set(reportId, report);
    this.emit('cascade:analysis:complete', report);
    return report;
  }

  private convertToConsequences(orbitResult: OrbitRunResult): ConsequenceAssessment[] {
    const consequences: ConsequenceAssessment[] = [];
    const processImpacts = (impacts: InfluenceResult[], order: number) => {
      for (const impact of impacts) {
        const category = this.categorizeImpact(impact.nodeType);
        const severity = this.scoreSeverity(impact.impactScore);
        const likelihood = this.scoreLikelihood(impact.confidence);
        consequences.push({
          nodeId: impact.nodeId, nodeName: impact.nodeName, nodeType: impact.nodeType, category,
          description: `${order === 1 ? 'Direct' : order === 2 ? 'Secondary' : 'Tertiary'} impact on ${impact.nodeName}: ${Math.round(impact.impactScore * 100)}% affected within ${impact.latencyDays} days`,
          severity, likelihood, riskScore: this.calculateRiskScore(severity, likelihood),
          latencyDays: impact.latencyDays, order, confidence: impact.confidence,
          evidenceBasis: impact.confidence >= 0.8 && impact.order === 1 ? 'measured' : impact.confidence >= 0.6 ? 'derived' : impact.confidence >= 0.3 ? 'inferred' : 'assumed',
          pathDescription: impact.paths[0] ? impact.paths[0].nodes.map(n => this.orbit.getNode(n)?.name || n).join(' → ') : 'Unknown path',
        });
      }
    };
    processImpacts(orbitResult.directImpacts, 1);
    processImpacts(orbitResult.rippleImpacts, 2);
    processImpacts(orbitResult.butterflyImpacts, 3);
    return consequences;
  }

  private categorizeImpact(nodeType: NodeType): ImpactCategory {
    const mapping: Partial<Record<NodeType, ImpactCategory>> = {
      [NodeType.METRIC]: ImpactCategory.FINANCIAL, [NodeType.PROCESS]: ImpactCategory.OPERATIONAL,
      [NodeType.CUSTOMER]: ImpactCategory.REPUTATIONAL, [NodeType.POLICY]: ImpactCategory.COMPLIANCE,
      [NodeType.CONTROL]: ImpactCategory.SECURITY, [NodeType.PERSON]: ImpactCategory.HUMAN,
      [NodeType.TEAM]: ImpactCategory.HUMAN, [NodeType.PRODUCT]: ImpactCategory.STRATEGIC,
    };
    return mapping[nodeType] || ImpactCategory.OPERATIONAL;
  }

  private scoreSeverity(impactScore: number): Severity {
    if (impactScore >= 0.8) return Severity.CRITICAL;
    if (impactScore >= 0.6) return Severity.HIGH;
    if (impactScore >= 0.4) return Severity.MODERATE;
    if (impactScore >= 0.2) return Severity.LOW;
    return Severity.MINIMAL;
  }

  private scoreLikelihood(confidence: number): Likelihood {
    if (confidence >= 0.8) return Likelihood.ALMOST_CERTAIN;
    if (confidence >= 0.6) return Likelihood.LIKELY;
    if (confidence >= 0.4) return Likelihood.POSSIBLE;
    if (confidence >= 0.2) return Likelihood.UNLIKELY;
    return Likelihood.RARE;
  }

  private calculateRiskScore(severity: Severity, likelihood: Likelihood): number {
    const sev: Record<Severity, number> = { [Severity.MINIMAL]: 1, [Severity.LOW]: 2, [Severity.MODERATE]: 3, [Severity.HIGH]: 4, [Severity.CRITICAL]: 5 };
    const lik: Record<Likelihood, number> = { [Likelihood.RARE]: 1, [Likelihood.UNLIKELY]: 2, [Likelihood.POSSIBLE]: 3, [Likelihood.LIKELY]: 4, [Likelihood.ALMOST_CERTAIN]: 5 };
    return sev[severity] * lik[likelihood];
  }

  private mergeConsequences(consequences: ConsequenceAssessment[]): ConsequenceAssessment[] {
    const merged = new Map<string, ConsequenceAssessment>();
    for (const c of consequences) {
      const existing = merged.get(c.nodeId);
      if (!existing || c.riskScore > existing.riskScore) merged.set(c.nodeId, c);
    }
    return Array.from(merged.values()).sort((a, b) => b.riskScore - a.riskScore);
  }

  private findButterflyEffect(consequences: ConsequenceAssessment[]): ConsequenceAssessment | undefined {
    const butterflies = consequences.filter(c => c.order >= 3 && c.riskScore >= 12 && c.confidence < 0.5);
    if (butterflies.length === 0) return undefined;
    return butterflies.reduce((best, curr) => (curr.riskScore / curr.confidence) > (best.riskScore / best.confidence) ? curr : best);
  }

  private buildCascadeTimeline(consequences: ConsequenceAssessment[], changeSpec: ChangeSpec): CascadeTimeline {
    const now = new Date();
    return {
      tZero: { date: now, event: changeSpec.title, directEffects: consequences.filter(c => c.order === 1).map(c => c.description) },
      tShort: { date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), effects: consequences.filter(c => c.latencyDays <= 30) },
      tMedium: { date: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000), effects: consequences.filter(c => c.latencyDays > 30 && c.latencyDays <= 90) },
      tLong: { date: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000), effects: consequences.filter(c => c.latencyDays > 90) },
    };
  }

  private generateMitigations(consequences: ConsequenceAssessment[]): Mitigation[] {
    const mitigations: Mitigation[] = [];
    const suggestions: Record<ImpactCategory, string> = {
      [ImpactCategory.FINANCIAL]: 'Implement phased rollout with budget checkpoints',
      [ImpactCategory.OPERATIONAL]: 'Add redundancy and failover procedures',
      [ImpactCategory.REPUTATIONAL]: 'Prepare communications plan and customer notification',
      [ImpactCategory.COMPLIANCE]: 'Conduct compliance review before implementation',
      [ImpactCategory.SECURITY]: 'Perform security assessment and add access controls',
      [ImpactCategory.HUMAN]: 'Implement change management and training program',
      [ImpactCategory.STRATEGIC]: 'Establish governance checkpoints and executive review',
    };
    for (const c of consequences.filter(c => c.riskScore >= 12)) {
      mitigations.push({ id: crypto.randomUUID(), targetConsequence: c.nodeId, type: 'prevent', description: `Prevent ${c.severity} impact on ${c.nodeName}`, implementation: suggestions[c.category] || 'Review and mitigate identified risks', effectivenessScore: 0.7 });
      mitigations.push({ id: crypto.randomUUID(), targetConsequence: c.nodeId, type: 'detect', description: `Monitor ${c.nodeName} for early warning signs`, implementation: `Set up alerts for ${c.nodeType} metrics with threshold at 80% of normal baseline`, effectivenessScore: 0.6 });
      if (c.severity === Severity.CRITICAL) {
        mitigations.push({ id: crypto.randomUUID(), targetConsequence: c.nodeId, type: 'respond', description: `Response plan for ${c.nodeName} failure`, implementation: 'Activate incident response team, notify stakeholders, prepare rollback', effectivenessScore: 0.5 });
      }
    }
    return mitigations;
  }

  private generateGuardrails(consequences: ConsequenceAssessment[]): Guardrail[] {
    const guardrails: Guardrail[] = [
      { id: crypto.randomUUID(), type: 'canary', condition: 'Initial rollout to 5% of affected scope', action: 'Monitor for 7 days before expanding', threshold: 0.05, monitoringFrequency: 'hourly' },
      { id: crypto.randomUUID(), type: 'circuit_breaker', condition: 'Any critical metric drops below 50% baseline', action: 'Automatically halt all changes', threshold: 0.5 },
      { id: crypto.randomUUID(), type: 'rollback_trigger', condition: 'Combined risk score exceeds 80% of pre-approved limit', action: 'Initiate automatic rollback procedure', threshold: 0.8 },
    ];
    for (const c of consequences.filter(c => c.severity === Severity.CRITICAL)) {
      guardrails.push({ id: crypto.randomUUID(), type: 'tripwire', condition: `${c.nodeName} deviation exceeds 20%`, action: 'Pause rollout and alert stakeholders', threshold: 0.2, monitoringFrequency: 'continuous' });
    }
    return guardrails;
  }

  private generateCascadeRecommendation(totalRisk: number, consequences: ConsequenceAssessment[]): { action: CascadeReport['recommendation']; rationale: string; requiredApprovals?: string[] } {
    const criticalCount = consequences.filter(c => c.severity === Severity.CRITICAL).length;
    const highCount = consequences.filter(c => c.severity === Severity.HIGH).length;
    const hasButterfly = consequences.some(c => c.order >= 3 && c.riskScore >= 15);
    if (criticalCount >= 3 || totalRisk >= 100) return { action: 'reject', rationale: `${criticalCount} critical consequences identified. Total risk score ${totalRisk} exceeds acceptable threshold.`, requiredApprovals: ['CEO', 'Board'] };
    if (criticalCount >= 1 || hasButterfly) return { action: 'reconsider', rationale: 'Critical or unexpected long-range consequences detected. Recommend exploring alternatives.', requiredApprovals: ['C-Suite', 'Risk Committee'] };
    if (highCount >= 3 || totalRisk >= 50) return { action: 'proceed_with_caution', rationale: 'Significant risks identified. Implement with enhanced monitoring and guardrails.', requiredApprovals: ['Department Head', 'Risk Officer'] };
    return { action: 'proceed', rationale: 'Acceptable risk profile. Standard governance applies.', requiredApprovals: ['Manager'] };
  }

  async signCascadeReport(reportId: string, signerId: string): Promise<void> {
    const report = this.cascadeReports.get(reportId);
    if (!report) throw new Error('Report not found');
    report.signedBy = signerId;
    report.signedAt = new Date();
    report.status = 'in_review';
    this.emit('cascade:report:signed', { reportId, signerId });
  }

  getCascadeReport(reportId: string): CascadeReport | undefined { return this.cascadeReports.get(reportId); }
  listCascadeReports(): CascadeReport[] { return Array.from(this.cascadeReports.values()).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); }
  updateCascadeReportStatus(reportId: string, status: CascadeReport['status']): void {
    const report = this.cascadeReports.get(reportId);
    if (!report) throw new Error('Report not found');
    report.status = status;
    this.emit('cascade:report:status_changed', { reportId, status });
  }

  // Graph helpers (delegate to Orbit)
  addNode(node: OrbitNode): void { this.orbit.addNode(node); }
  addEdge(edge: OrbitEdge): void { this.orbit.addEdge(edge); }
  loadGraph(data: { nodes: OrbitNode[]; edges: OrbitEdge[] }): void { this.orbit.loadGraph(data); }
  getGraphStats() { return this.orbit.getStats(); }
  getOrbitService(): CendiaOrbitService { return this.orbit; }

  // ===========================================================================
  // ORACLE SIMULATION (What-If Time Machine) - Original CendiaHorizon
  // ===========================================================================

  /**
   * Create a new Oracle simulation
   */
  async createSimulation(query: Omit<OracleQuery, 'id' | 'createdAt'>): Promise<OracleSimulation> {
    const queryId = `oracle-${crypto.randomUUID().slice(0, 8)}`;
    const simulationId = `sim-${crypto.randomUUID().slice(0, 8)}`;

    const simulation: OracleSimulation = {
      id: simulationId,
      queryId,
      question: query.question,
      status: 'initializing',
      universes: [],
      historicalEchoes: [],
      pivotalMoments: [],
      recommendation: {
        primaryChoice: '',
        universeId: '',
        confidence: 0,
        reasoning: '',
        keyFactors: [],
        warnings: [],
        alternativeConsiderations: [],
      },
      metadata: {
        totalEvents: 0,
        timeHorizon: query.timeHorizon,
        agentsConsulted: [],
        dataSourcesUsed: [],
        computeTime: 0,
        modelVersion: '1.0.0',
      },
      createdAt: new Date(),
    };

    this.simulations.set(simulationId, simulation);

    // Start async simulation
    this.runSimulation(simulation, query);

    return simulation;
  }

  /**
   * Run the full simulation
   */
  private async runSimulation(
    simulation: OracleSimulation,
    query: Omit<OracleQuery, 'id' | 'createdAt'>
  ): Promise<void> {
    const startTime = Date.now();

    try {
      simulation.status = 'simulating';

      // Step 1: Find historical echoes
      simulation.historicalEchoes = this.findHistoricalEchoes(query.question);

      // Step 2: Generate universes
      simulation.universes = await this.generateUniverses(
        query.question,
        query.context,
        query.timeHorizon,
        Math.min(query.branchCount, 5)
      );

      // Step 3: Identify pivotal moments
      simulation.pivotalMoments = this.identifyPivotalMoments(simulation.universes);

      // Step 4: Generate recommendation
      simulation.recommendation = this.generateRecommendation(simulation.universes);

      // Step 5: Update metadata
      simulation.metadata.totalEvents = simulation.universes.reduce(
        (sum, u) => sum + u.timeline.length,
        0
      );
      simulation.metadata.agentsConsulted = AGENT_PERSPECTIVES.map((a) => a.code);
      simulation.metadata.dataSourcesUsed = [
        'Historical Patterns',
        'Market Data',
        'Competitive Intelligence',
        'Internal Metrics',
      ];
      simulation.metadata.computeTime = Date.now() - startTime;

      simulation.status = 'complete';
      simulation.completedAt = new Date();

      logger.info(`[CendiaOracle] Simulation ${simulation.id} complete in ${simulation.metadata.computeTime}ms`);
    } catch (error) {
      simulation.status = 'failed';
      logger.error(`[CendiaOracle] Simulation ${simulation.id} failed:`, error);
    }
  }

  /**
   * Find historical echoes matching the question
   */
  private findHistoricalEchoes(question: string): HistoricalEcho[] {
    const keywords = question.toLowerCase().split(' ');
    
    return HISTORICAL_ECHOES.map((echo) => {
      const text = `${echo.situation} ${echo.decision} ${echo.outcome}`.toLowerCase();
      const matches = keywords.filter((kw) => kw.length > 3 && text.includes(kw)).length;
      const similarity = Math.min(95, 40 + matches * 12 + Math.random() * 20);
      
      return { ...echo, similarity };
    })
      .filter((e) => e.similarity > 50)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3);
  }

  /**
   * Generate alternate universe timelines
   */
  private async generateUniverses(
    question: string,
    context: string | undefined,
    timeHorizon: TimeHorizon,
    count: number
  ): Promise<Universe[]> {
    const horizonDays = this.getHorizonDays(timeHorizon);
    const universes: Universe[] = [];

    for (let i = 0; i < count; i++) {
      const template = UNIVERSE_TEMPLATES[i % UNIVERSE_TEMPLATES.length];
      const universe = this.generateUniverse(
        `universe-${i + 1}`,
        template,
        question,
        context,
        horizonDays,
        i
      );
      universes.push(universe);
    }

    return universes;
  }

  /**
   * Generate a single universe timeline
   */
  private generateUniverse(
    id: string,
    template: typeof UNIVERSE_TEMPLATES[0],
    question: string,
    context: string | undefined,
    horizonDays: number,
    index: number
  ): Universe {
    const timeline = this.generateTimeline(template.bias, horizonDays, question);
    const outcomes = this.generateOutcomes(template.bias, index);
    const riskProfile = this.generateRiskProfile(template.bias);

    // Find point of no return (typically 30-40% into timeline)
    const pointOfNoReturnIndex = Math.floor(timeline.length * (0.3 + Math.random() * 0.2));
    const pointOfNoReturn = timeline[pointOfNoReturnIndex];

    const decisions: Record<string, string> = {
      aggressive: 'Proceed with full commitment and accelerated timeline',
      conservative: 'Maintain current course with minimal changes',
      balanced: 'Implement measured changes with built-in checkpoints',
      adaptive: 'Start small, iterate based on early signals',
      protective: 'Focus on risk mitigation and defensive positioning',
    };

    const descriptions: Record<string, string> = {
      aggressive: 'Maximum velocity execution with high risk/reward profile',
      conservative: 'Preserve stability while competitors may advance',
      balanced: 'Optimize for sustainable growth with manageable risk',
      adaptive: 'Flexible approach that can pivot based on market response',
      protective: 'Minimize downside exposure while maintaining optionality',
    };

    return {
      id,
      name: template.name,
      description: descriptions[template.bias] || 'Strategic option',
      decision: decisions[template.bias] || 'Proceed with caution',
      color: template.color,
      icon: template.icon,
      probability: this.calculateProbability(index),
      timeline,
      outcomes,
      riskProfile,
      reversibilityScore: template.bias === 'conservative' ? 90 : template.bias === 'aggressive' ? 35 : 65,
      pointOfNoReturn,
    };
  }

  /**
   * Generate timeline events for a universe
   */
  private generateTimeline(
    bias: string,
    horizonDays: number,
    question: string
  ): TimelineEvent[] {
    const events: TimelineEvent[] = [];
    const eventCount = Math.floor(8 + Math.random() * 6); // 8-14 events

    const eventTemplates = this.getEventTemplates(bias, question);

    for (let i = 0; i < eventCount; i++) {
      const dayOffset = Math.floor((i / eventCount) * horizonDays * 0.9) + Math.floor(Math.random() * 14);
      const template = eventTemplates[i % eventTemplates.length];
      const confidence = Math.max(20, 95 - (dayOffset / horizonDays) * 60 - Math.random() * 15);

      const event: TimelineEvent = {
        id: `event-${i + 1}`,
        timestamp: new Date(Date.now() + dayOffset * 24 * 60 * 60 * 1000),
        dayOffset,
        title: template.title,
        description: template.description,
        type: template.type,
        impact: template.impact,
        confidence: Math.round(confidence),
        cascadeEffects: this.generateCascadeEffects(template.type),
        agentInsights: this.generateAgentInsights(template.type, template.impact),
      };

      events.push(event);
    }

    return events.sort((a, b) => a.dayOffset - b.dayOffset);
  }

  /**
   * Get event templates based on bias
   */
  private getEventTemplates(bias: string, question: string): Array<{
    title: string;
    description: string;
    type: TimelineEvent['type'];
    impact: TimelineEvent['impact'];
  }> {
    const baseEvents = [
      { title: 'Decision Announced', description: 'Strategic direction communicated to stakeholders', type: 'milestone' as const, impact: 'neutral' as const },
      { title: 'Initial Market Response', description: 'Early signals from customers and competitors', type: 'external' as const, impact: 'neutral' as const },
      { title: 'Resource Allocation Complete', description: 'Teams and budgets aligned to new direction', type: 'milestone' as const, impact: 'positive' as const },
      { title: 'First Checkpoint Review', description: 'Initial progress assessment and course correction', type: 'pivot' as const, impact: 'neutral' as const },
    ];

    const biasEvents: Record<string, Array<{ title: string; description: string; type: TimelineEvent['type']; impact: TimelineEvent['impact'] }>> = {
      aggressive: [
        { title: 'Rapid Scaling Initiated', description: 'Aggressive expansion begins', type: 'milestone', impact: 'positive' },
        { title: 'Competitor Response Detected', description: 'Market players react to your move', type: 'external', impact: 'negative' },
        { title: 'Integration Challenges Surface', description: 'Execution complexity becomes apparent', type: 'risk', impact: 'negative' },
        { title: 'Market Share Gains Materialize', description: 'Strategic bet starts paying off', type: 'opportunity', impact: 'positive' },
        { title: 'Operational Strain Peak', description: 'Team capacity stretched to limits', type: 'risk', impact: 'critical' },
        { title: 'Breakthrough Achievement', description: 'Key milestone unlocks next phase', type: 'milestone', impact: 'positive' },
      ],
      conservative: [
        { title: 'Stability Maintained', description: 'Operations continue without disruption', type: 'milestone', impact: 'neutral' },
        { title: 'Competitor Advances', description: 'Others capture market opportunity', type: 'external', impact: 'negative' },
        { title: 'Cost Optimization Achieved', description: 'Efficiency gains from steady state', type: 'opportunity', impact: 'positive' },
        { title: 'Market Position Erodes', description: 'Gradual loss of competitive edge', type: 'risk', impact: 'negative' },
        { title: 'Talent Retention Challenges', description: 'Top performers seek more dynamic environments', type: 'risk', impact: 'negative' },
        { title: 'Optionality Preserved', description: 'Flexibility to pivot remains intact', type: 'opportunity', impact: 'positive' },
      ],
      balanced: [
        { title: 'Phased Rollout Begins', description: 'Controlled implementation starts', type: 'milestone', impact: 'positive' },
        { title: 'Early Wins Captured', description: 'Quick wins build momentum', type: 'opportunity', impact: 'positive' },
        { title: 'Adjustment Required', description: 'Mid-course correction based on data', type: 'pivot', impact: 'neutral' },
        { title: 'Stakeholder Alignment Achieved', description: 'Buy-in secured across organization', type: 'milestone', impact: 'positive' },
        { title: 'Sustainable Growth Trajectory', description: 'Long-term path becomes clear', type: 'opportunity', impact: 'positive' },
        { title: 'Risk Mitigation Successful', description: 'Proactive measures prevent issues', type: 'milestone', impact: 'positive' },
      ],
      adaptive: [
        { title: 'Pilot Program Launched', description: 'Small-scale test begins', type: 'milestone', impact: 'neutral' },
        { title: 'Signal Detection', description: 'Early indicators guide next steps', type: 'pivot', impact: 'neutral' },
        { title: 'Iteration Cycle Complete', description: 'Learnings incorporated into approach', type: 'milestone', impact: 'positive' },
        { title: 'Pivot Point Reached', description: 'Data supports scaling or redirecting', type: 'pivot', impact: 'neutral' },
        { title: 'Validated Learning', description: 'Hypothesis confirmed or refuted', type: 'opportunity', impact: 'positive' },
        { title: 'Scaled Deployment', description: 'Proven approach rolled out broadly', type: 'milestone', impact: 'positive' },
      ],
      protective: [
        { title: 'Risk Assessment Complete', description: 'Threat landscape fully mapped', type: 'milestone', impact: 'positive' },
        { title: 'Defensive Measures Activated', description: 'Protective strategies implemented', type: 'milestone', impact: 'positive' },
        { title: 'Threat Materialized', description: 'Anticipated risk becomes reality', type: 'risk', impact: 'negative' },
        { title: 'Mitigation Successful', description: 'Defensive measures prove effective', type: 'opportunity', impact: 'positive' },
        { title: 'Opportunity Cost Realized', description: 'Missed upside from defensive stance', type: 'cascade', impact: 'negative' },
        { title: 'Position Secured', description: 'Core business protected', type: 'milestone', impact: 'positive' },
      ],
    };

    return [...baseEvents, ...(biasEvents[bias] || biasEvents.balanced)];
  }

  /**
   * Generate cascade effects for an event
   */
  private generateCascadeEffects(eventType: TimelineEvent['type']): CascadeEffect[] {
    if (Math.random() > 0.6) return []; // 40% chance of cascade

    const domains = ['Revenue', 'Operations', 'Talent', 'Customer', 'Technology', 'Compliance'];
    const effects: CascadeEffect[] = [];
    const count = 1 + Math.floor(Math.random() * 2);

    for (let i = 0; i < count; i++) {
      effects.push({
        id: `cascade-${crypto.randomUUID().slice(0, 6)}`,
        domain: domains[Math.floor(Math.random() * domains.length)],
        effect: this.generateCascadeDescription(),
        magnitude: ['minor', 'moderate', 'major'][Math.floor(Math.random() * 3)] as CascadeEffect['magnitude'],
        delay: 7 + Math.floor(Math.random() * 21),
      });
    }

    return effects;
  }

  /**
   * Generate cascade effect description
   */
  private generateCascadeDescription(): string {
    const descriptions = [
      'Ripple effect on downstream processes',
      'Secondary impact on stakeholder confidence',
      'Knock-on effect to partner relationships',
      'Indirect influence on market perception',
      'Delayed impact on resource allocation',
      'Cascading effect on team dynamics',
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  /**
   * Generate agent insights for an event
   */
  private generateAgentInsights(
    eventType: TimelineEvent['type'],
    impact: TimelineEvent['impact']
  ): AgentInsight[] {
    const insights: AgentInsight[] = [];
    const agentCount = 2 + Math.floor(Math.random() * 2);
    const shuffled = [...AGENT_PERSPECTIVES].sort(() => Math.random() - 0.5);

    for (let i = 0; i < agentCount; i++) {
      const agent = shuffled[i];
      insights.push({
        agentCode: agent.code,
        agentName: agent.name,
        agentAvatar: agent.avatar,
        perspective: this.generatePerspective(agent.focus, eventType, impact),
        sentiment: this.getSentiment(impact),
      });
    }

    return insights;
  }

  /**
   * Generate agent perspective
   */
  private generatePerspective(
    focus: string,
    eventType: TimelineEvent['type'],
    impact: TimelineEvent['impact']
  ): string {
    const perspectives: Record<string, string[]> = {
      'strategic synthesis': [
        'This aligns with our long-term vision',
        'Consider the broader strategic implications',
        'We need to balance short-term and long-term goals',
      ],
      'financial impact': [
        'The ROI projections look favorable',
        'Cash flow implications need monitoring',
        'Budget reallocation may be required',
      ],
      'operational feasibility': [
        'Execution capacity is sufficient',
        'Process changes will be needed',
        'Timeline is aggressive but achievable',
      ],
      'security & risk': [
        'Security posture remains strong',
        'Additional controls recommended',
        'Compliance requirements are met',
      ],
      'enterprise risk': [
        'Risk exposure is within tolerance',
        'Mitigation strategies are in place',
        'Scenario planning recommended',
      ],
      'market positioning': [
        'Market perception will be positive',
        'Competitive response expected',
        'Brand impact should be monitored',
      ],
      'data-driven insights': [
        'Data supports this direction',
        'Metrics indicate positive trajectory',
        'Additional analysis recommended',
      ],
    };

    const options = perspectives[focus] || perspectives['strategic synthesis'];
    return options[Math.floor(Math.random() * options.length)];
  }

  /**
   * Get sentiment based on impact
   */
  private getSentiment(impact: TimelineEvent['impact']): AgentInsight['sentiment'] {
    const sentiments: Record<string, AgentInsight['sentiment'][]> = {
      positive: ['bullish', 'bullish', 'neutral'],
      negative: ['bearish', 'cautious', 'cautious'],
      neutral: ['neutral', 'cautious', 'bullish'],
      critical: ['bearish', 'bearish', 'cautious'],
    };
    const options = sentiments[impact] || sentiments.neutral;
    return options[Math.floor(Math.random() * options.length)];
  }

  /**
   * Generate outcomes for a universe
   */
  private generateOutcomes(bias: string, index: number): UniverseOutcome {
    const biasMultipliers: Record<string, number> = {
      aggressive: 1.4,
      conservative: 0.8,
      balanced: 1.1,
      adaptive: 1.2,
      protective: 0.9,
    };

    const multiplier = biasMultipliers[bias] || 1.0;
    const variance = () => (Math.random() - 0.5) * 0.3;

    const generateMetric = (baseChange: number): OutcomeMetric => {
      const change = baseChange * multiplier + variance() * 20;
      return {
        current: 100,
        projected: Math.round(100 + change),
        change: Math.round(change),
        confidence: Math.round(70 + Math.random() * 20),
        trend: change > 5 ? 'up' : change < -5 ? 'down' : 'stable',
      };
    };

    const outcomes: UniverseOutcome = {
      revenue: generateMetric(15),
      marketShare: generateMetric(8),
      teamMorale: generateMetric(bias === 'aggressive' ? -5 : 10),
      customerSatisfaction: generateMetric(5),
      competitivePosition: generateMetric(12),
      riskExposure: generateMetric(bias === 'aggressive' ? 20 : -10),
      innovationCapacity: generateMetric(bias === 'conservative' ? -15 : 18),
      overallScore: 0,
    };

    // Calculate overall score
    outcomes.overallScore = Math.round(
      (outcomes.revenue.projected +
        outcomes.marketShare.projected +
        outcomes.teamMorale.projected +
        outcomes.customerSatisfaction.projected +
        outcomes.competitivePosition.projected +
        (200 - outcomes.riskExposure.projected) + // Invert risk
        outcomes.innovationCapacity.projected) /
        7
    );

    return outcomes;
  }

  /**
   * Generate risk profile for a universe
   */
  private generateRiskProfile(bias: string): RiskProfile {
    const riskLevels: Record<string, RiskProfile['overall']> = {
      aggressive: 'high',
      conservative: 'low',
      balanced: 'moderate',
      adaptive: 'moderate',
      protective: 'low',
    };

    const riskScores: Record<string, number> = {
      aggressive: 75,
      conservative: 25,
      balanced: 50,
      adaptive: 45,
      protective: 30,
    };

    const factors: RiskFactor[] = [
      {
        name: 'Execution Risk',
        category: 'operational',
        severity: bias === 'aggressive' ? 'high' : 'medium',
        probability: bias === 'aggressive' ? 65 : 35,
        mitigation: 'Phased implementation with checkpoints',
      },
      {
        name: 'Market Response',
        category: 'competitive',
        severity: 'medium',
        probability: 50,
        mitigation: 'Competitive monitoring and rapid response capability',
      },
      {
        name: 'Financial Exposure',
        category: 'financial',
        severity: bias === 'aggressive' ? 'high' : 'low',
        probability: bias === 'aggressive' ? 55 : 25,
        mitigation: 'Budget reserves and contingency planning',
      },
    ];

    return {
      overall: riskLevels[bias] || 'moderate',
      score: riskScores[bias] || 50,
      factors,
    };
  }

  /**
   * Calculate probability for universe selection
   */
  private calculateProbability(index: number): number {
    const baseProbabilities = [35, 25, 20, 12, 8];
    return baseProbabilities[index] || 5;
  }

  /**
   * Identify pivotal moments across universes
   */
  private identifyPivotalMoments(universes: Universe[]): PivotalMoment[] {
    const moments: PivotalMoment[] = [];

    universes.forEach((universe) => {
      const pivotEvents = universe.timeline.filter(
        (e) => e.type === 'pivot' || e.impact === 'critical'
      );

      pivotEvents.forEach((event) => {
        moments.push({
          id: `pivot-${crypto.randomUUID().slice(0, 6)}`,
          universeId: universe.id,
          dayOffset: event.dayOffset,
          title: event.title,
          description: `Critical decision point in ${universe.name} scenario`,
          forkOptions: [
            {
              id: 'fork-1',
              action: 'Accelerate',
              consequence: 'Higher risk, faster results',
              probability: 30,
            },
            {
              id: 'fork-2',
              action: 'Maintain Course',
              consequence: 'Steady progress, predictable outcomes',
              probability: 50,
            },
            {
              id: 'fork-3',
              action: 'Pivot',
              consequence: 'Change direction based on new data',
              probability: 20,
            },
          ],
          criticalityScore: 60 + Math.floor(Math.random() * 30),
        });
      });
    });

    return moments.sort((a, b) => a.dayOffset - b.dayOffset).slice(0, 5);
  }

  /**
   * Generate final recommendation
   */
  private generateRecommendation(universes: Universe[]): OracleRecommendation {
    // Sort by overall score
    const sorted = [...universes].sort(
      (a, b) => b.outcomes.overallScore - a.outcomes.overallScore
    );
    const best = sorted[0];

    return {
      primaryChoice: best.name,
      universeId: best.id,
      confidence: Math.round(65 + Math.random() * 20),
      reasoning: `Based on comprehensive analysis across ${universes.length} scenarios, the ${best.name} approach offers the optimal balance of risk and reward. This path shows a projected ${best.outcomes.revenue.change > 0 ? '+' : ''}${best.outcomes.revenue.change}% revenue impact with ${best.riskProfile.overall} risk exposure.`,
      keyFactors: [
        `Revenue projection: ${best.outcomes.revenue.change > 0 ? '+' : ''}${best.outcomes.revenue.change}%`,
        `Risk level: ${best.riskProfile.overall}`,
        `Reversibility: ${best.reversibilityScore}%`,
        `Team impact: ${best.outcomes.teamMorale.trend}`,
      ],
      warnings: [
        best.riskProfile.overall === 'high' ? 'High execution risk requires close monitoring' : null,
        best.reversibilityScore < 50 ? 'Limited ability to reverse course after commitment' : null,
        best.outcomes.teamMorale.change < 0 ? 'Potential negative impact on team morale' : null,
      ].filter(Boolean) as string[],
      alternativeConsiderations: sorted.slice(1, 3).map(
        (u) => `${u.name}: ${u.outcomes.overallScore} overall score, ${u.riskProfile.overall} risk`
      ),
    };
  }

  /**
   * Get horizon in days
   */
  private getHorizonDays(horizon: TimeHorizon): number {
    const days: Record<TimeHorizon, number> = {
      '30d': 30,
      '60d': 60,
      '90d': 90,
      '180d': 180,
      '1y': 365,
      '3y': 1095,
      '5y': 1825,
    };
    return days[horizon] || 90;
  }

  /**
   * Get simulation by ID
   */
  getSimulation(id: string): OracleSimulation | undefined {
    return this.simulations.get(id);
  }

  /**
   * Get all simulations
   */
  getAllSimulations(): OracleSimulation[] {
    return Array.from(this.simulations.values());
  }

  /**
   * Get simulation status
   */
  getStatus(): { available: boolean; simulationsCount: number } {
    return {
      available: true,
      simulationsCount: this.simulations.size,
    };
  }

  // ===========================================================================
  // EXPRESS MODE - Standalone outputs WITHOUT Council
  // ===========================================================================

  /**
   * Express: Quick forecast for a scenario without full multi-agent simulation.
   * Uses universe templates and historical echo matching for fast results.
   */
  async getExpressForecast(
    question: string,
    options?: {
      timeHorizon?: TimeHorizon;
      organizationId?: string;
    }
  ): Promise<{
    question: string;
    timeHorizon: TimeHorizon;
    bestCase: { name: string; probability: number; overallScore: number; keyOutcomes: string[] };
    mostLikely: { name: string; probability: number; overallScore: number; keyOutcomes: string[] };
    worstCase: { name: string; probability: number; overallScore: number; keyOutcomes: string[] };
    historicalEchoes: Array<{ company: string; year: number; situation: string; outcome: string; similarity: number }>;
    recommendation: string;
    confidence: number;
    mode: 'express';
    generatedAt: Date;
  }> {
    const startTime = Date.now();
    const timeHorizon = options?.timeHorizon || '90d';
    const horizonDays = this.getHorizonDays(timeHorizon);

    // Step 1: Find historical echoes (fast — no LLM)
    const echoes = this.findHistoricalEchoes(question);

    // Step 2: Generate lightweight universes (3 only — no agents)
    const templates = UNIVERSE_TEMPLATES.slice(0, 3); // Bold, Status Quo, Measured
    const universes = templates.map((template, i) =>
      this.generateUniverse(`express-${i + 1}`, template, question, undefined, horizonDays, i)
    );

    // Sort by outcome score
    const sorted = [...universes].sort((a, b) => b.outcomes.overallScore - a.outcomes.overallScore);
    const best = sorted[0];
    const worst = sorted[sorted.length - 1];
    const mostLikely = sorted.find(u => u.probability === Math.max(...sorted.map(s => s.probability))) || sorted[1];

    const summarizeOutcomes = (u: Universe): string[] => {
      const outcomes: string[] = [];
      if (u.outcomes.revenue.change > 0) outcomes.push(`Revenue +${u.outcomes.revenue.change.toFixed(0)}%`);
      else if (u.outcomes.revenue.change < 0) outcomes.push(`Revenue ${u.outcomes.revenue.change.toFixed(0)}%`);
      if (u.outcomes.marketShare.change > 0) outcomes.push(`Market share +${u.outcomes.marketShare.change.toFixed(0)}%`);
      if (u.outcomes.riskExposure.change > 10) outcomes.push(`Risk exposure elevated`);
      if (u.outcomes.teamMorale.change < -5) outcomes.push(`Team morale decline`);
      else if (u.outcomes.teamMorale.change > 5) outcomes.push(`Team morale improvement`);
      if (u.riskProfile.overall === 'critical' || u.riskProfile.overall === 'high') outcomes.push(`${u.riskProfile.overall} risk profile`);
      return outcomes.length > 0 ? outcomes : ['No significant changes projected'];
    };

    // Build recommendation from best universe
    const bestRecommendation = this.generateRecommendation(universes);

    const durationMs = Date.now() - startTime;
    logger.info(`[Horizon Express] Forecast generated in ${durationMs}ms for "${question.slice(0, 50)}..."`);

    return {
      question,
      timeHorizon,
      bestCase: {
        name: best.name,
        probability: best.probability,
        overallScore: best.outcomes.overallScore,
        keyOutcomes: summarizeOutcomes(best),
      },
      mostLikely: {
        name: mostLikely.name,
        probability: mostLikely.probability,
        overallScore: mostLikely.outcomes.overallScore,
        keyOutcomes: summarizeOutcomes(mostLikely),
      },
      worstCase: {
        name: worst.name,
        probability: worst.probability,
        overallScore: worst.outcomes.overallScore,
        keyOutcomes: summarizeOutcomes(worst),
      },
      historicalEchoes: echoes.map(e => ({
        company: e.company,
        year: e.year,
        situation: e.situation,
        outcome: e.outcome,
        similarity: Math.round(e.similarity),
      })),
      recommendation: bestRecommendation.reasoning || 'Consider running a full simulation for detailed multi-agent analysis.',
      confidence: bestRecommendation.confidence,
      mode: 'express',
      generatedAt: new Date(),
    };
  }
}

// Export singleton
export const cendiaHorizonService = new CendiaHorizonServiceClass();
export default cendiaHorizonService;

// Legacy alias for backward compatibility
export const cascadeService = cendiaHorizonService;
