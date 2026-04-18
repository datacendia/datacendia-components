/**
 * Service — Types
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports generateCollapseId, generateFailureConditionId, generateFailureEnvelopeId, hashFailureCondition, hashAgentOutput, calculateFailureScore, calculateCollapseRisk, calculateTrustDelta
 * @module services/collapse/types
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Policy Collapse Mode - Types and Schemas
 * 
 * Adversarial Policy Stress-Testing System
 * "Under what conditions would this decision fail, harm people, or collapse legitimacy?"
 * 
 * This is not commentary. This is executable policy risk.
 */

import { createHash } from 'crypto';

// ============================================================================
// ENUMS
// ============================================================================

export enum CollapseAgentType {
  // A. Legitimacy & Trust Collapse
  LEGITIMACY = 'LEGITIMACY_COLLAPSE',
  DEMOCRATIC_EROSION = 'DEMOCRATIC_PROCESS_EROSION',
  PROCEDURAL_JUSTICE = 'PROCEDURAL_JUSTICE',
  
  // B. Civil Liberties & Rights Collapse (Critical)
  FREE_SPEECH_CHILLING = 'FREE_SPEECH_CHILLING',      // NON-OVERRIDABLE in democratic jurisdictions
  DUE_PROCESS_VIOLATION = 'DUE_PROCESS_VIOLATION',
  FREEDOM_OF_ASSOCIATION = 'FREEDOM_OF_ASSOCIATION',
  
  // C. Minority, Equity & Protection
  MINORITY_HARM = 'MINORITY_HARM',                    // NON-OVERRIDABLE
  CULTURAL_ERASURE = 'CULTURAL_ERASURE',
  DISABILITY_IMPACT = 'DISABILITY_IMPACT',
  
  // D. Political & Narrative Weaponization
  POLITICAL_BACKLASH = 'POLITICAL_BACKLASH',
  NARRATIVE_WEAPONIZATION = 'NARRATIVE_WEAPONIZATION',
  FOREIGN_INFLUENCE = 'FOREIGN_INFLUENCE_AMPLIFICATION',
  
  // E. Economic & Systemic Risk
  ECONOMIC_INSTABILITY = 'ECONOMIC_INSTABILITY',
  MARKET_DISTORTION = 'MARKET_DISTORTION',
  SYSTEMIC_RISK = 'SYSTEMIC_RISK',
  
  // F. Temporal & Environmental
  TEMPORAL_DECAY = 'TEMPORAL_DECAY',
  ENVIRONMENTAL_EXTERNALITY = 'ENVIRONMENTAL_EXTERNALITY',
  
  // G. Abuse & Misuse
  ADVERSARIAL_ABUSE = 'ADVERSARIAL_ABUSE',
}

export enum FailureCategory {
  // Legitimacy & Trust
  TRUST_COLLAPSE = 'TRUST_COLLAPSE',
  DEMOCRATIC_HOLLOWING = 'DEMOCRATIC_HOLLOWING',
  PROCEDURAL_UNFAIRNESS = 'PROCEDURAL_UNFAIRNESS',
  
  // Civil Liberties
  SPEECH_SUPPRESSION = 'SPEECH_SUPPRESSION',
  DUE_PROCESS_DENIAL = 'DUE_PROCESS_DENIAL',
  ASSOCIATION_RESTRICTION = 'ASSOCIATION_RESTRICTION',
  
  // Minority & Equity
  MINORITY_DISPLACEMENT = 'MINORITY_DISPLACEMENT',
  CULTURAL_MARGINALIZATION = 'CULTURAL_MARGINALIZATION',
  ACCESSIBILITY_EXCLUSION = 'ACCESSIBILITY_EXCLUSION',
  
  // Political & Narrative
  POLITICAL_WEAPONIZATION = 'POLITICAL_WEAPONIZATION',
  NARRATIVE_CAPTURE = 'NARRATIVE_CAPTURE',
  SOVEREIGNTY_UNDERMINING = 'SOVEREIGNTY_UNDERMINING',
  
  // Economic & Systemic
  ECONOMIC_SHOCK = 'ECONOMIC_SHOCK',
  MARKET_FAILURE = 'MARKET_FAILURE',
  SYSTEMIC_CASCADE = 'SYSTEMIC_CASCADE',
  
  // Temporal & Environmental
  INSTITUTIONAL_DECAY = 'INSTITUTIONAL_DECAY',
  ECOLOGICAL_HARM = 'ECOLOGICAL_HARM',
  
  // Abuse
  EXPLOITATION = 'EXPLOITATION',
}

export enum Reversibility {
  REVERSIBLE = 0.5,
  PARTIALLY_REVERSIBLE = 1.0,
  IRREVERSIBLE = 1.5,
}

export enum DeploymentRecommendation {
  SAFE_TO_DEPLOY = 'SAFE_TO_DEPLOY',
  DEPLOY_WITH_GUARDRAILS = 'DEPLOY_WITH_GUARDRAILS',
  HIGH_RISK = 'HIGH_RISK',
  DO_NOT_DEPLOY = 'DO_NOT_DEPLOY',
}

export enum VisibilityType {
  IMMEDIATE = 'IMMEDIATE',
  DELAYED = 'DELAYED',
  GRADUAL = 'GRADUAL',
  HIDDEN = 'HIDDEN',
}

export enum ThreatActorType {
  CORRUPT_OFFICIAL = 'CORRUPT_OFFICIAL',
  CRIMINAL_ENTERPRISE = 'CRIMINAL_ENTERPRISE',
  FOREIGN_INFLUENCE = 'FOREIGN_INFLUENCE',
  CORPORATE_CAPTURE = 'CORPORATE_CAPTURE',
  POLITICAL_OPPORTUNIST = 'POLITICAL_OPPORTUNIST',
  RENT_SEEKER = 'RENT_SEEKER',
}

export enum EthicalPrinciple {
  NON_DISCRIMINATION = 'NON_DISCRIMINATION',
  PROPORTIONALITY = 'PROPORTIONALITY',
  TRANSPARENCY = 'TRANSPARENCY',
  ACCOUNTABILITY = 'ACCOUNTABILITY',
  DUE_PROCESS = 'DUE_PROCESS',
  HUMAN_DIGNITY = 'HUMAN_DIGNITY',
  PRIVACY = 'PRIVACY',
  FAIRNESS = 'FAIRNESS',
  FREE_EXPRESSION = 'FREE_EXPRESSION',
  DEMOCRATIC_PARTICIPATION = 'DEMOCRATIC_PARTICIPATION',
  CULTURAL_PRESERVATION = 'CULTURAL_PRESERVATION',
  ENVIRONMENTAL_STEWARDSHIP = 'ENVIRONMENTAL_STEWARDSHIP',
  ACCESSIBILITY = 'ACCESSIBILITY',
  SOVEREIGNTY = 'SOVEREIGNTY',
}

// ============================================================================
// CORE INTERFACES
// ============================================================================

export interface TriggerCondition {
  metric: string;
  operator: '<' | '>' | '==' | '<=' | '>=' | '!=';
  value: number | string;
  duration?: string; // e.g., "3 months"
  confidence: number;
}

export interface FailureEvent {
  type: string;
  description: string;
  cascadeRisk: number;
}

export interface AffectedGroup {
  name: string;
  populationShare: number;
  vulnerabilityScore: number;
  protectedClass: boolean;
}

export interface FailureCondition {
  id: string;
  agent: CollapseAgentType;
  category: FailureCategory;
  triggerCondition: TriggerCondition;
  failureEvent: FailureEvent;
  affectedGroups: AffectedGroup[];
  severity: number; // [0, 1]
  probability: number; // [0, 1]
  irreversibility: Reversibility;
  timeToManifestation: string;
  visibility: VisibilityType;
  mitigationPossible: boolean;
  mitigationCost: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  evidence: string[];
  reasoning: string;
  hash: string;
}

export interface EthicalRedLine {
  id: string;
  principle: EthicalPrinciple;
  violatedWhen: string;
  irreversible: boolean;
  agent: CollapseAgentType;
  severity: number;
  evidence: string[];
}

export interface SystemicRisk {
  id: string;
  primarySystem: string;
  affectedSystems: string[];
  cascadeChain: string[];
  probability: number;
  totalImpact: number;
  feedbackLoops: string[];
}

export interface TemporalDecay {
  initialEffectiveness: number;
  decayRate: number; // per year
  halfLife: string;
  maintenanceRequired: string[];
  institutionalMemoryRisk: number;
  staffTurnoverImpact: number;
}

export interface NarrativeAttack {
  id: string;
  headline: string;
  soundbite: string;
  targetAudience: string;
  emotionalTrigger: string;
  virality: number;
  defenseStrategy: string;
}

export interface ExploitPath {
  id: string;
  threatActor: ThreatActorType;
  attackVector: string;
  exploitSteps: string[];
  detectionDifficulty: number;
  payoff: number;
  mitigation: string;
}

// ============================================================================
// AGENT OUTPUT INTERFACES
// ============================================================================

export interface CollapseAgentOutput {
  agentType: CollapseAgentType;
  agentId: string;
  timestamp: string;
  seed: number;
  failureConditions: FailureCondition[];
  riskScore: number;
  reasoning: string;
  evidence: string[];
  hash: string;
}

export interface LegitimacyCollapseOutput extends CollapseAgentOutput {
  legitimacyErosionCurve: { time: number; legitimacy: number }[];
  thresholdEvents: string[];
  recoveryThreshold: number;
  publicSentimentImpact: number;
}

export interface MinorityHarmOutput extends CollapseAgentOutput {
  disparityRatios: { group: string; ratio: number }[];
  concentrationIndex: number;
  moralHazardFlags: string[];
  delayedVisibilityRisk: number;
}

export interface EconomicInstabilityOutput extends CollapseAgentOutput {
  inflationFeedbackLoops: string[];
  laborDisplacementRisk: number;
  capitalFlightProbability: number;
  rentSeekingOpportunities: string[];
  marketDistortions: string[];
}

export interface PoliticalBacklashOutput extends CollapseAgentOutput {
  oppositionFramings: string[];
  mediaAngles: string[];
  electionCycleAmplification: number;
  populistExploitationRisk: number;
  polarizationIndex: number;
}

export interface SystemicRiskOutput extends CollapseAgentOutput {
  systemicRisks: SystemicRisk[];
  coupledSystemFailures: string[];
  secondOrderEffects: string[];
  dependencyGraph: { from: string; to: string; strength: number }[];
}

export interface AdversarialAbuseOutput extends CollapseAgentOutput {
  exploitPaths: ExploitPath[];
  abuseCostCurve: { effort: number; payoff: number }[];
  totalExploitRisk: number;
}

export interface TemporalDecayOutput extends CollapseAgentOutput {
  temporalDecay: TemporalDecay;
  policyDriftRisk: number;
  maintenanceNeglectProbability: number;
  institutionalMemoryLoss: number;
}

export interface NarrativeWeaponizationOutput extends CollapseAgentOutput {
  narrativeAttacks: NarrativeAttack[];
  soundbiteVulnerabilities: string[];
  socialMediaSlogans: string[];
  defenseNarratives: string[];
}

// ============================================================================
// TRUST DELTA CALCULATION
// ============================================================================

export interface ConsensusScore {
  confidence: number;
  evidenceWeight: number;
  reasoningDepth: number;
  agentAgreement: number;
  normalizedScore: number;
}

export interface CollapseRiskScore {
  rawRisk: number;
  weightedRisk: number;
  irreversibilityAdjusted: number;
  minorityHarmPenalty: number;
  finalScore: number;
}

export interface TrustDelta {
  consensusConfidence: number;
  collapseRisk: number;
  trustDelta: number;
  deploymentRecommendation: DeploymentRecommendation;
  riskFactors: string[];
  mitigationSuggestions: string[];
}

// ============================================================================
// FAILURE ENVELOPE - THE CORE ARTIFACT
// ============================================================================

export interface FailureEnvelope {
  id: string;
  decisionId: string;
  collapseMode: true;
  generatedAt: string;
  seed: number;
  
  // Summary
  summary: {
    totalFailureConditions: number;
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    affectedGroupsCount: number;
    ethicalViolationsCount: number;
  };
  
  // Core Analysis
  failureConditions: FailureCondition[];
  systemicRisks: SystemicRisk[];
  ethicalRedLines: EthicalRedLine[];
  temporalDecay: TemporalDecay;
  narrativeAttacks: NarrativeAttack[];
  exploitPaths: ExploitPath[];
  
  // Agent Outputs (for replay)
  agentOutputs: CollapseAgentOutput[];
  
  // Trust Delta
  trustDelta: TrustDelta;
  
  // Legitimacy Curve
  legitimacyCurve: { time: number; legitimacy: number }[];
  
  // Minority Harm Matrix
  minorityHarmMatrix: {
    group: string;
    severity: number;
    visibility: VisibilityType;
    reversibility: Reversibility;
  }[];
  
  // Cryptographic Proof
  merkleRoot: string;
  signatures: {
    platform: string;
    timestamp: string;
    algorithm: string;
  };
  
  // Replay Information
  replayable: boolean;
  replayCommand: string;
}

// ============================================================================
// DUAL-TRACK DELIBERATION
// ============================================================================

export interface ConsensusTrack {
  trackId: string;
  purpose: 'OPTIMIZE_APPROVAL';
  agents: string[];
  decision: string;
  confidence: number;
  reasoning: string[];
  evidence: string[];
  votingRecord: { agentId: string; vote: 'APPROVE' | 'REJECT' | 'ABSTAIN'; confidence: number }[];
}

export interface CollapseTrack {
  trackId: string;
  purpose: 'MAXIMIZE_FAILURE_DISCOVERY';
  agents: CollapseAgentType[];
  failureEnvelope: FailureEnvelope;
  totalRisk: number;
  criticalFindings: string[];
}

export interface PolicyContextData {
  decisionId: string;
  decisionText: string;
  policyDomain: string;
  targetPopulation: number;
  geographicScope: string;
  budgetImpact: number;
  timelineMonths: number;
  existingConditions: Record<string, number>;
  stakeholders: string[];
  historicalAnalogues?: string[];
}

export interface DualTrackDeliberation {
  id: string;
  decisionId: string;
  decisionText: string;
  context: PolicyContextData;
  
  consensusTrack: ConsensusTrack;
  collapseTrack: CollapseTrack;
  
  trustDelta: TrustDelta;
  
  startedAt: string;
  completedAt: string;
  seed: number;
  merkleRoot: string;
}

// ============================================================================
// COLLAPSE MODE CONFIGURATION
// ============================================================================

export interface CollapseAgentConfig {
  type: CollapseAgentType;
  enabled: boolean;
  weight: number;
  parameters: Record<string, unknown>;
}

export interface CollapseConfig {
  enabled: boolean;
  seed?: number;
  agents: CollapseAgentConfig[];
  
  // Thresholds
  minFailureConditions: number;
  trustDeltaThreshold: number;
  autoRejectOnEthicalViolation: boolean;
  
  // Simulation parameters
  simulationHorizonMonths: number;
  stressMultiplier: number;
  
  // Output options
  generateNarrativeAttacks: boolean;
  includeExploitPaths: boolean;
  detailedTemporalAnalysis: boolean;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function generateCollapseId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `COL-${timestamp}-${random}`.toUpperCase();
}

export function generateFailureConditionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `FC-${timestamp}-${random}`.toUpperCase();
}

export function generateFailureEnvelopeId(): string {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 100000);
  return `FE-${year}-${month}-${random}`;
}

export function hashFailureCondition(fc: Omit<FailureCondition, 'hash'>): string {
  const content = JSON.stringify({
    agent: fc.agent,
    category: fc.category,
    trigger: fc.triggerCondition,
    severity: fc.severity,
    probability: fc.probability,
  });
  return createHash('sha256').update(content).digest('hex').substring(0, 16);
}

export function hashAgentOutput(output: Omit<CollapseAgentOutput, 'hash'>): string {
  const content = JSON.stringify({
    agentType: output.agentType,
    seed: output.seed,
    failureConditions: output.failureConditions.map(fc => fc.hash),
    riskScore: output.riskScore,
  });
  return createHash('sha256').update(content).digest('hex').substring(0, 16);
}

export function calculateFailureScore(fc: FailureCondition): number {
  return fc.severity * fc.probability * fc.irreversibility;
}

export function calculateCollapseRisk(failureConditions: FailureCondition[]): number {
  if (failureConditions.length === 0) return 0;
  
  // Union of risks: 1 - Î (1 - FailureScore_j)
  const product = failureConditions.reduce((acc, fc) => {
    const score = calculateFailureScore(fc);
    return acc * (1 - Math.min(score, 0.99)); // Cap at 0.99 to avoid total certainty
  }, 1);
  
  return 1 - product;
}

export function calculateTrustDelta(
  consensusConfidence: number,
  collapseRisk: number
): TrustDelta {
  const delta = consensusConfidence - collapseRisk;
  
  let recommendation: DeploymentRecommendation;
  let riskFactors: string[] = [];
  let mitigationSuggestions: string[] = [];
  
  if (delta > 0.3) {
    recommendation = DeploymentRecommendation.SAFE_TO_DEPLOY;
  } else if (delta > 0.1) {
    recommendation = DeploymentRecommendation.DEPLOY_WITH_GUARDRAILS;
    riskFactors.push('Moderate gap between confidence and collapse risk');
    mitigationSuggestions.push('Implement monitoring and early warning systems');
    mitigationSuggestions.push('Establish rollback procedures');
  } else if (delta > 0) {
    recommendation = DeploymentRecommendation.HIGH_RISK;
    riskFactors.push('Narrow margin between confidence and collapse risk');
    riskFactors.push('Failure scenarios have significant probability');
    mitigationSuggestions.push('Conduct additional stakeholder consultation');
    mitigationSuggestions.push('Implement phased rollout with checkpoints');
    mitigationSuggestions.push('Prepare contingency responses');
  } else {
    recommendation = DeploymentRecommendation.DO_NOT_DEPLOY;
    riskFactors.push('Collapse risk exceeds consensus confidence');
    riskFactors.push('Multiple critical failure paths identified');
    mitigationSuggestions.push('Fundamental policy redesign required');
    mitigationSuggestions.push('Address identified failure conditions before proceeding');
  }
  
  return {
    consensusConfidence,
    collapseRisk,
    trustDelta: delta,
    deploymentRecommendation: recommendation,
    riskFactors,
    mitigationSuggestions,
  };
}

export function calculateDisparityRatio(
  groupImpact: number,
  populationAverageImpact: number
): number {
  if (populationAverageImpact === 0) return groupImpact > 0 ? Infinity : 1;
  return groupImpact / populationAverageImpact;
}

export function calculateMinorityHarmIndex(
  disparityRatios: { group: string; ratio: number }[],
  visibilityDelay: number = 1.0
): number {
  if (disparityRatios.length === 0) return 0;
  const maxRatio = Math.max(...disparityRatios.map(d => d.ratio));
  return Math.min(maxRatio * visibilityDelay, 1);
}

export function calculateLegitimacyDecay(
  initialTrust: number,
  triggerEvents: number,
  sensitivityCoefficient: number = 0.15
): number {
  // Legitimacy(t) = InitialTrust Ã— e^(—ˆ’k Ã— TriggerEvents(t))
  return initialTrust * Math.exp(-sensitivityCoefficient * triggerEvents);
}

export function getSeverityLevel(severity: number): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' {
  if (severity >= 0.8) return 'CRITICAL';
  if (severity >= 0.6) return 'HIGH';
  if (severity >= 0.4) return 'MEDIUM';
  return 'LOW';
}

// ============================================================================
// DEFAULT CONFIGURATIONS
// ============================================================================

export const DEFAULT_COLLAPSE_CONFIG: CollapseConfig = {
  enabled: true,
  agents: [
    // A. Legitimacy & Trust Collapse
    { type: CollapseAgentType.LEGITIMACY, enabled: true, weight: 1.0, parameters: {} },
    { type: CollapseAgentType.DEMOCRATIC_EROSION, enabled: true, weight: 0.9, parameters: {} },
    { type: CollapseAgentType.PROCEDURAL_JUSTICE, enabled: true, weight: 0.85, parameters: {} },
    // B. Civil Liberties (Critical - NON-OVERRIDABLE)
    { type: CollapseAgentType.FREE_SPEECH_CHILLING, enabled: true, weight: 1.3, parameters: { nonOverridable: true } },
    { type: CollapseAgentType.DUE_PROCESS_VIOLATION, enabled: true, weight: 1.2, parameters: {} },
    { type: CollapseAgentType.FREEDOM_OF_ASSOCIATION, enabled: true, weight: 1.1, parameters: {} },
    // C. Minority & Equity (NON-OVERRIDABLE for minority harm)
    { type: CollapseAgentType.MINORITY_HARM, enabled: true, weight: 1.3, parameters: { nonOverridable: true } },
    { type: CollapseAgentType.CULTURAL_ERASURE, enabled: true, weight: 0.9, parameters: {} },
    { type: CollapseAgentType.DISABILITY_IMPACT, enabled: true, weight: 1.0, parameters: {} },
    // D. Political & Narrative Weaponization
    { type: CollapseAgentType.POLITICAL_BACKLASH, enabled: true, weight: 0.9, parameters: {} },
    { type: CollapseAgentType.NARRATIVE_WEAPONIZATION, enabled: true, weight: 0.7, parameters: {} },
    { type: CollapseAgentType.FOREIGN_INFLUENCE, enabled: true, weight: 0.85, parameters: {} },
    // E. Economic & Systemic Risk
    { type: CollapseAgentType.ECONOMIC_INSTABILITY, enabled: true, weight: 1.0, parameters: {} },
    { type: CollapseAgentType.MARKET_DISTORTION, enabled: true, weight: 0.8, parameters: {} },
    { type: CollapseAgentType.SYSTEMIC_RISK, enabled: true, weight: 1.1, parameters: {} },
    // F. Temporal & Environmental
    { type: CollapseAgentType.TEMPORAL_DECAY, enabled: true, weight: 0.8, parameters: {} },
    { type: CollapseAgentType.ENVIRONMENTAL_EXTERNALITY, enabled: true, weight: 0.9, parameters: {} },
    // G. Abuse & Misuse
    { type: CollapseAgentType.ADVERSARIAL_ABUSE, enabled: true, weight: 1.0, parameters: {} },
  ],
  minFailureConditions: 1,
  trustDeltaThreshold: 0.1,
  autoRejectOnEthicalViolation: true,
  simulationHorizonMonths: 24,
  stressMultiplier: 1.5,
  generateNarrativeAttacks: true,
  includeExploitPaths: true,
  detailedTemporalAnalysis: true,
};

export const PROTECTED_GROUPS: AffectedGroup[] = [
  { name: 'Low-income households', populationShare: 0.20, vulnerabilityScore: 0.8, protectedClass: true },
  { name: 'Elderly population', populationShare: 0.18, vulnerabilityScore: 0.7, protectedClass: true },
  { name: 'Disabled residents', populationShare: 0.12, vulnerabilityScore: 0.85, protectedClass: true },
  { name: 'Racial minorities', populationShare: 0.30, vulnerabilityScore: 0.6, protectedClass: true },
  { name: 'Recent immigrants', populationShare: 0.08, vulnerabilityScore: 0.75, protectedClass: true },
  { name: 'Single-parent families', populationShare: 0.10, vulnerabilityScore: 0.65, protectedClass: true },
  { name: 'Young renters (18-30)', populationShare: 0.15, vulnerabilityScore: 0.5, protectedClass: false },
  { name: 'Small business owners', populationShare: 0.08, vulnerabilityScore: 0.45, protectedClass: false },
];

export const ETHICAL_PRINCIPLES_DESCRIPTIONS: Record<EthicalPrinciple, string> = {
  [EthicalPrinciple.NON_DISCRIMINATION]: 'Equal treatment regardless of protected characteristics',
  [EthicalPrinciple.PROPORTIONALITY]: 'Response proportional to the problem being addressed',
  [EthicalPrinciple.TRANSPARENCY]: 'Clear, accessible explanation of decisions and reasoning',
  [EthicalPrinciple.ACCOUNTABILITY]: 'Clear responsibility and recourse for affected parties',
  [EthicalPrinciple.DUE_PROCESS]: 'Fair procedures including notice and opportunity to be heard',
  [EthicalPrinciple.HUMAN_DIGNITY]: 'Respect for inherent worth of all individuals',
  [EthicalPrinciple.PRIVACY]: 'Protection of personal information and autonomy',
  [EthicalPrinciple.FAIRNESS]: 'Equitable distribution of benefits and burdens',
  [EthicalPrinciple.FREE_EXPRESSION]: 'Protection of lawful speech without chilling effects',
  [EthicalPrinciple.DEMOCRATIC_PARTICIPATION]: 'Preservation of meaningful citizen involvement in governance',
  [EthicalPrinciple.CULTURAL_PRESERVATION]: 'Respect for diverse languages, customs, and traditions',
  [EthicalPrinciple.ENVIRONMENTAL_STEWARDSHIP]: 'Long-term ecological sustainability and intergenerational equity',
  [EthicalPrinciple.ACCESSIBILITY]: 'Inclusion of persons with disabilities in all systems',
  [EthicalPrinciple.SOVEREIGNTY]: 'Protection against foreign interference in domestic affairs',
};
