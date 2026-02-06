/**
 * SCGE - Synthetic Civic Governance Environment
 * Core Types and Interfaces
 * 
 * Enterprise/Government Platinum Standard
 * Decision verification infrastructure for complex institutions
 */

import crypto from 'crypto';

// =============================================================================
// CORE ENUMS
// =============================================================================

export enum PopulationSegment {
  LOW_ACCESS = 'low_access',
  MEDIUM_ACCESS = 'medium_access',
  HIGH_ACCESS = 'high_access',
}

export enum AccessVariance {
  UNIFORM = 'uniform',
  MODERATE = 'moderate',
  HIGH = 'high',
  EXTREME = 'extreme',
}

export enum InformationAsymmetry {
  MINIMAL = 'minimal',
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  SEVERE = 'severe',
}

export enum MobilityConstraint {
  NONE = 'none',
  LIMITED = 'limited',
  MODERATE = 'moderate',
  SEVERE = 'severe',
  IMMOBILE = 'immobile',
}

export enum ResourceScarcity {
  ABUNDANT = 'abundant',
  ADEQUATE = 'adequate',
  CONSTRAINED = 'constrained',
  SCARCE = 'scarce',
  CRITICAL = 'critical',
}

export enum ComplianceVariance {
  HIGH_COMPLIANCE = 'high_compliance',
  MODERATE_COMPLIANCE = 'moderate_compliance',
  LOW_COMPLIANCE = 'low_compliance',
  VARIABLE = 'variable',
}

export enum GovernanceAxis {
  CENTRALIZATION = 'centralization',
  REGULATION_INTENSITY = 'regulation_intensity',
  PRIVACY_PRIORITY = 'privacy_priority',
  SECURITY_PRIORITY = 'security_priority',
  TRANSPARENCY_EXPECTATION = 'transparency_expectation',
  INSTITUTIONAL_TRUST = 'institutional_trust',
  ENFORCEMENT_STRICTNESS = 'enforcement_strictness',
  DISCRETION_VS_AUTOMATION = 'discretion_vs_automation',
}

export enum StressorType {
  INFRASTRUCTURE_FAILURE = 'infrastructure_failure',
  DATA_INCOMPLETENESS = 'data_incompleteness',
  DEMAND_SPIKE = 'demand_spike',
  TRUST_COLLAPSE = 'trust_collapse',
  ADVERSARIAL_MANIPULATION = 'adversarial_manipulation',
  LEGAL_CONSTRAINT_CHANGE = 'legal_constraint_change',
  EMERGENCY_POWERS_ACTIVATION = 'emergency_powers_activation',
  CONFLICTING_MANDATES = 'conflicting_mandates',
  RESOURCE_EXHAUSTION = 'resource_exhaustion',
  COMMUNICATION_FAILURE = 'communication_failure',
}

export enum StressorIntensity {
  MINIMAL = 'minimal',
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  CRITICAL = 'critical',
  CATASTROPHIC = 'catastrophic',
}

export enum StressorOnset {
  GRADUAL = 'gradual',
  SUDDEN = 'sudden',
  OSCILLATING = 'oscillating',
  CASCADING = 'cascading',
}

export enum EventType {
  INFRASTRUCTURE = 'infrastructure',
  HEALTH = 'health',
  ECONOMIC = 'economic',
  SECURITY = 'security',
  CIVIC = 'civic',
  ENVIRONMENTAL = 'environmental',
  REGULATORY = 'regulatory',
  POLITICAL = 'political',
}

export enum EventSeverity {
  ROUTINE = 'routine',
  NOTABLE = 'notable',
  SIGNIFICANT = 'significant',
  MAJOR = 'major',
  CRITICAL = 'critical',
  CATASTROPHIC = 'catastrophic',
}

export enum PolicyDomain {
  ZONING = 'zoning',
  HEALTHCARE = 'healthcare',
  BUDGET = 'budget',
  EMERGENCY = 'emergency',
  PROCUREMENT = 'procurement',
  INFRASTRUCTURE = 'infrastructure',
  EDUCATION = 'education',
  PUBLIC_SAFETY = 'public_safety',
  ENVIRONMENTAL = 'environmental',
  SOCIAL_SERVICES = 'social_services',
}

export enum PolicyStatus {
  DRAFT = 'draft',
  PROPOSED = 'proposed',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  DEPRECATED = 'deprecated',
  REVOKED = 'revoked',
}

export enum InstitutionType {
  CITY_COUNCIL = 'city_council',
  REGULATOR = 'regulator',
  OVERSIGHT_BODY = 'oversight_body',
  BUDGET_OFFICE = 'budget_office',
  EMERGENCY_AUTHORITY = 'emergency_authority',
  JUDICIAL = 'judicial',
  ETHICS_COMMITTEE = 'ethics_committee',
  PROCUREMENT_OFFICE = 'procurement_office',
}

export enum SimulationPhase {
  INITIALIZATION = 'initialization',
  POPULATION_GENERATION = 'population_generation',
  POLICY_INJECTION = 'policy_injection',
  EVENT_PROCESSING = 'event_processing',
  STRESSOR_APPLICATION = 'stressor_application',
  DECISION_EVALUATION = 'decision_evaluation',
  OUTCOME_MEASUREMENT = 'outcome_measurement',
  AUDIT_GENERATION = 'audit_generation',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum OutcomeMetricType {
  EQUITY = 'equity',
  EFFICIENCY = 'efficiency',
  TRUST = 'trust',
  COMPLIANCE = 'compliance',
  RESILIENCE = 'resilience',
  ACCESSIBILITY = 'accessibility',
  TRANSPARENCY = 'transparency',
  ACCOUNTABILITY = 'accountability',
}

// =============================================================================
// SYNTHETIC POPULATION TYPES
// =============================================================================

export interface PopulationDistribution {
  segment: PopulationSegment;
  percentage: number;
  accessVariance: AccessVariance;
  informationAsymmetry: InformationAsymmetry;
  mobilityConstraint: MobilityConstraint;
  resourceScarcity: ResourceScarcity;
  complianceVariance: ComplianceVariance;
}

export interface SyntheticPopulation {
  id: string;
  name: string;
  totalSize: number;
  distributions: PopulationDistribution[];
  generationSeed: number;
  generatedAt: Date;
  hash: string;
  metadata: PopulationMetadata;
}

export interface PopulationMetadata {
  version: number;
  description: string;
  assumptions: string[];
  limitations: string[];
  validityRange: {
    start: Date;
    end: Date;
  };
}

export interface PopulationParameters {
  size: number;
  accessVarianceLevel: AccessVariance;
  informationAsymmetryLevel: InformationAsymmetry;
  mobilityConstraintLevel: MobilityConstraint;
  resourceScarcityLevel: ResourceScarcity;
  complianceVarianceLevel: ComplianceVariance;
  seed?: number;
}

// =============================================================================
// GOVERNANCE PARAMETER TYPES
// =============================================================================

export interface GovernanceParameter {
  axis: GovernanceAxis;
  value: number; // 0.0 to 1.0
  label: string;
  description: string;
}

export interface GovernanceProfile {
  id: string;
  name: string;
  description: string;
  parameters: GovernanceParameter[];
  createdAt: Date;
  hash: string;
}

export interface GovernancePreset {
  id: string;
  name: string;
  description: string;
  parameters: Record<GovernanceAxis, number>;
}

// =============================================================================
// POLICY TYPES
// =============================================================================

export interface PolicyRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  priority: number;
  exceptions: string[];
  effectiveFrom: Date;
  effectiveUntil?: Date;
}

export interface PolicyBundle {
  id: string;
  name: string;
  domain: PolicyDomain;
  version: number;
  status: PolicyStatus;
  rules: PolicyRule[];
  constraints: PolicyConstraint[];
  metadata: PolicyMetadata;
  hash: string;
  previousVersionHash?: string;
  createdAt: Date;
  activatedAt?: Date;
}

export interface PolicyConstraint {
  id: string;
  type: 'hard' | 'soft' | 'advisory';
  description: string;
  enforcementLevel: number; // 0.0 to 1.0
  overrideAuthority?: InstitutionType;
}

export interface PolicyMetadata {
  author: string;
  reviewers: string[];
  approvalDate?: Date;
  expiryDate?: Date;
  tags: string[];
  references: string[];
}

// =============================================================================
// EVENT TYPES
// =============================================================================

export interface SimulationEvent {
  id: string;
  type: EventType;
  name: string;
  description: string;
  severity: EventSeverity;
  timestamp: Date;
  duration: number; // in simulation time units
  affectedSystems: string[];
  parameters: Record<string, unknown>;
  causalPredecessors: string[]; // event IDs
  hash: string;
}

export interface EventSequence {
  id: string;
  name: string;
  events: SimulationEvent[];
  totalDuration: number;
  startTime: Date;
  seed: number;
  hash: string;
}

export interface EventInjectionConfig {
  sequence: EventSequence;
  startOffset: number;
  timeScale: number; // simulation time multiplier
  randomVariation: number; // 0.0 to 1.0
}

// =============================================================================
// STRESSOR TYPES
// =============================================================================

export interface Stressor {
  id: string;
  type: StressorType;
  name: string;
  description: string;
  intensity: StressorIntensity;
  onset: StressorOnset;
  duration: number;
  affectedSystems: string[];
  parameters: StressorParameters;
  mitigationOptions: MitigationOption[];
}

export interface StressorParameters {
  impactRadius: number; // 0.0 to 1.0
  recoveryRate: number; // 0.0 to 1.0
  cascadeProbability: number; // 0.0 to 1.0
  detectionDifficulty: number; // 0.0 to 1.0
  customParameters: Record<string, unknown>;
}

export interface MitigationOption {
  id: string;
  name: string;
  effectiveness: number; // 0.0 to 1.0
  cost: number;
  timeToImplement: number;
  sideEffects: string[];
}

export interface StressorSchedule {
  id: string;
  stressors: ScheduledStressor[];
  seed: number;
  hash: string;
}

export interface ScheduledStressor {
  stressor: Stressor;
  activationTime: number;
  deactivationTime?: number;
  layeredWith: string[]; // other stressor IDs
}

// =============================================================================
// INSTITUTION TYPES
// =============================================================================

export interface Institution {
  id: string;
  type: InstitutionType;
  name: string;
  jurisdiction: string[];
  authority: InstitutionAuthority;
  constraints: InstitutionConstraint[];
  decisionHistory: string[]; // decision packet IDs
}

export interface InstitutionAuthority {
  canBlock: boolean;
  canEscalate: boolean;
  canOverride: boolean;
  overrideConditions: string[];
  budgetAuthority: number;
  emergencyPowers: boolean;
}

export interface InstitutionConstraint {
  id: string;
  type: 'legal' | 'procedural' | 'budgetary' | 'temporal';
  description: string;
  binding: boolean;
}

// =============================================================================
// OUTCOME TYPES
// =============================================================================

export interface OutcomeMetric {
  type: OutcomeMetricType;
  value: number;
  baseline: number;
  delta: number;
  variance: number;
  confidenceInterval: [number, number];
}

export interface OutcomeAnalysis {
  id: string;
  simulationId: string;
  metrics: OutcomeMetric[];
  outcomeVariance: number;
  equityScore: number;
  trustDelta: number;
  biasIndicators: BiasIndicator[];
  timestamp: Date;
  hash: string;
}

export interface BiasIndicator {
  type: string;
  detected: boolean;
  severity: number; // 0.0 to 1.0
  affectedSegments: PopulationSegment[];
  evidence: string[];
  mitigationSuggestions: string[];
}

// =============================================================================
// SIMULATION TYPES
// =============================================================================

export interface SimulationConfig {
  id: string;
  name: string;
  description: string;
  population: PopulationParameters;
  governance: GovernanceProfile;
  policies: PolicyBundle[];
  events: EventInjectionConfig;
  stressors: StressorSchedule;
  institutions: Institution[];
  seed: number;
  timeScale: number;
  maxDuration: number;
  auditLevel: 'minimal' | 'standard' | 'comprehensive' | 'exhaustive';
}

export interface SimulationState {
  id: string;
  configId: string;
  phase: SimulationPhase;
  currentTime: number;
  population: SyntheticPopulation;
  activePolicies: PolicyBundle[];
  activeStressors: Stressor[];
  pendingEvents: SimulationEvent[];
  processedEvents: SimulationEvent[];
  decisions: DecisionRecord[];
  outcomes: OutcomeAnalysis[];
  auditLog: AuditEntry[];
  stateHash: string;
  lastUpdated: Date;
}

export interface DecisionRecord {
  id: string;
  timestamp: Date;
  policyId: string;
  eventId?: string;
  institutionId: string;
  decision: string;
  rationale: string;
  constraints: string[];
  alternatives: string[];
  outcomeProjection: OutcomeMetric[];
  hash: string;
}

export interface AuditEntry {
  id: string;
  timestamp: Date;
  phase: SimulationPhase;
  action: string;
  actor: string;
  details: Record<string, unknown>;
  stateHashBefore: string;
  stateHashAfter: string;
}

// =============================================================================
// SIMULATION RESULT TYPES
// =============================================================================

export interface SimulationResult {
  id: string;
  configId: string;
  startTime: Date;
  endTime: Date;
  finalState: SimulationState;
  summary: SimulationSummary;
  outcomes: OutcomeAnalysis;
  auditPacket: AuditPacket;
  replayBundle: ReplayBundle;
}

export interface SimulationSummary {
  totalEvents: number;
  totalDecisions: number;
  stressorsApplied: number;
  policiesEvaluated: number;
  outcomeVariance: number;
  trustDelta: number;
  equityScore: number;
  resilienceScore: number;
  complianceScore: number;
  criticalFindings: string[];
  recommendations: string[];
}

export interface AuditPacket {
  id: string;
  simulationId: string;
  generatedAt: Date;
  entries: AuditEntry[];
  merkleRoot: string;
  signatures: string[];
  integrityHash: string;
}

export interface ReplayBundle {
  id: string;
  simulationId: string;
  config: SimulationConfig;
  seed: number;
  expectedHash: string;
  instructions: string;
  createdAt: Date;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export function generateSCGEId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, '')}`;
}

export function hashSCGEState(state: unknown): string {
  const serialized = JSON.stringify(state, Object.keys(state as object).sort());
  return crypto.createHash('sha256').update(serialized).digest('hex');
}

export function createMerkleRoot(hashes: string[]): string {
  if (hashes.length === 0) return hashSCGEState({});
  if (hashes.length === 1) return hashes[0]!;
  
  const pairs: string[] = [];
  for (let i = 0; i < hashes.length; i += 2) {
    const left = hashes[i]!;
    const right = hashes[i + 1] || left;
    pairs.push(hashSCGEState(left + right));
  }
  
  return createMerkleRoot(pairs);
}

// =============================================================================
// DEFAULT CONFIGURATIONS
// =============================================================================

export const DEFAULT_GOVERNANCE_PRESETS: GovernancePreset[] = [
  {
    id: 'preset_high_trust',
    name: 'High Trust Environment',
    description: 'Decentralized, high institutional trust, moderate regulation',
    parameters: {
      [GovernanceAxis.CENTRALIZATION]: 0.3,
      [GovernanceAxis.REGULATION_INTENSITY]: 0.5,
      [GovernanceAxis.PRIVACY_PRIORITY]: 0.6,
      [GovernanceAxis.SECURITY_PRIORITY]: 0.5,
      [GovernanceAxis.TRANSPARENCY_EXPECTATION]: 0.7,
      [GovernanceAxis.INSTITUTIONAL_TRUST]: 0.8,
      [GovernanceAxis.ENFORCEMENT_STRICTNESS]: 0.5,
      [GovernanceAxis.DISCRETION_VS_AUTOMATION]: 0.6,
    },
  },
  {
    id: 'preset_crisis_mode',
    name: 'Crisis Mode',
    description: 'Centralized, high security, emergency powers active',
    parameters: {
      [GovernanceAxis.CENTRALIZATION]: 0.9,
      [GovernanceAxis.REGULATION_INTENSITY]: 0.8,
      [GovernanceAxis.PRIVACY_PRIORITY]: 0.2,
      [GovernanceAxis.SECURITY_PRIORITY]: 0.95,
      [GovernanceAxis.TRANSPARENCY_EXPECTATION]: 0.4,
      [GovernanceAxis.INSTITUTIONAL_TRUST]: 0.5,
      [GovernanceAxis.ENFORCEMENT_STRICTNESS]: 0.9,
      [GovernanceAxis.DISCRETION_VS_AUTOMATION]: 0.3,
    },
  },
  {
    id: 'preset_fragmented',
    name: 'Fragmented Governance',
    description: 'Low trust, inconsistent enforcement, high discretion',
    parameters: {
      [GovernanceAxis.CENTRALIZATION]: 0.2,
      [GovernanceAxis.REGULATION_INTENSITY]: 0.4,
      [GovernanceAxis.PRIVACY_PRIORITY]: 0.5,
      [GovernanceAxis.SECURITY_PRIORITY]: 0.4,
      [GovernanceAxis.TRANSPARENCY_EXPECTATION]: 0.3,
      [GovernanceAxis.INSTITUTIONAL_TRUST]: 0.25,
      [GovernanceAxis.ENFORCEMENT_STRICTNESS]: 0.3,
      [GovernanceAxis.DISCRETION_VS_AUTOMATION]: 0.8,
    },
  },
  {
    id: 'preset_automated',
    name: 'Highly Automated',
    description: 'Rule-based, low discretion, high transparency',
    parameters: {
      [GovernanceAxis.CENTRALIZATION]: 0.6,
      [GovernanceAxis.REGULATION_INTENSITY]: 0.7,
      [GovernanceAxis.PRIVACY_PRIORITY]: 0.4,
      [GovernanceAxis.SECURITY_PRIORITY]: 0.6,
      [GovernanceAxis.TRANSPARENCY_EXPECTATION]: 0.85,
      [GovernanceAxis.INSTITUTIONAL_TRUST]: 0.6,
      [GovernanceAxis.ENFORCEMENT_STRICTNESS]: 0.8,
      [GovernanceAxis.DISCRETION_VS_AUTOMATION]: 0.15,
    },
  },
];

export const DEFAULT_STRESSOR_LIBRARY: Stressor[] = [
  {
    id: 'stressor_infra_partial',
    type: StressorType.INFRASTRUCTURE_FAILURE,
    name: 'Partial Infrastructure Failure',
    description: 'Critical infrastructure operates at reduced capacity',
    intensity: StressorIntensity.MODERATE,
    onset: StressorOnset.SUDDEN,
    duration: 72,
    affectedSystems: ['power', 'communications', 'transportation'],
    parameters: {
      impactRadius: 0.4,
      recoveryRate: 0.1,
      cascadeProbability: 0.3,
      detectionDifficulty: 0.2,
      customParameters: { capacityReduction: 0.5 },
    },
    mitigationOptions: [
      {
        id: 'mit_backup_power',
        name: 'Activate Backup Systems',
        effectiveness: 0.7,
        cost: 50000,
        timeToImplement: 2,
        sideEffects: ['Increased fuel consumption'],
      },
    ],
  },
  {
    id: 'stressor_trust_collapse',
    type: StressorType.TRUST_COLLAPSE,
    name: 'Institutional Trust Collapse',
    description: 'Public confidence in institutions drops sharply',
    intensity: StressorIntensity.HIGH,
    onset: StressorOnset.CASCADING,
    duration: 168,
    affectedSystems: ['governance', 'compliance', 'public_services'],
    parameters: {
      impactRadius: 0.8,
      recoveryRate: 0.02,
      cascadeProbability: 0.6,
      detectionDifficulty: 0.5,
      customParameters: { trustDropPercent: 0.45 },
    },
    mitigationOptions: [
      {
        id: 'mit_transparency',
        name: 'Emergency Transparency Measures',
        effectiveness: 0.4,
        cost: 10000,
        timeToImplement: 24,
        sideEffects: ['Temporary operational slowdown'],
      },
    ],
  },
  {
    id: 'stressor_demand_spike',
    type: StressorType.DEMAND_SPIKE,
    name: 'Service Demand Surge',
    description: 'Sudden 300% increase in service requests',
    intensity: StressorIntensity.HIGH,
    onset: StressorOnset.SUDDEN,
    duration: 48,
    affectedSystems: ['public_services', 'healthcare', 'emergency_response'],
    parameters: {
      impactRadius: 0.6,
      recoveryRate: 0.15,
      cascadeProbability: 0.4,
      detectionDifficulty: 0.1,
      customParameters: { demandMultiplier: 3.0 },
    },
    mitigationOptions: [
      {
        id: 'mit_surge_capacity',
        name: 'Activate Surge Capacity',
        effectiveness: 0.6,
        cost: 100000,
        timeToImplement: 4,
        sideEffects: ['Staff fatigue', 'Quality reduction'],
      },
    ],
  },
  {
    id: 'stressor_data_loss',
    type: StressorType.DATA_INCOMPLETENESS,
    name: 'Critical Data Loss',
    description: '40% of decision-relevant data becomes unavailable',
    intensity: StressorIntensity.MODERATE,
    onset: StressorOnset.SUDDEN,
    duration: 96,
    affectedSystems: ['decision_systems', 'compliance', 'reporting'],
    parameters: {
      impactRadius: 0.5,
      recoveryRate: 0.08,
      cascadeProbability: 0.25,
      detectionDifficulty: 0.3,
      customParameters: { dataLossPercent: 0.4 },
    },
    mitigationOptions: [
      {
        id: 'mit_backup_data',
        name: 'Restore from Backup',
        effectiveness: 0.8,
        cost: 25000,
        timeToImplement: 12,
        sideEffects: ['Data may be 24h stale'],
      },
    ],
  },
  {
    id: 'stressor_legal_change',
    type: StressorType.LEGAL_CONSTRAINT_CHANGE,
    name: 'Emergency Regulatory Change',
    description: 'New regulations impose additional constraints mid-operation',
    intensity: StressorIntensity.MODERATE,
    onset: StressorOnset.SUDDEN,
    duration: 720,
    affectedSystems: ['compliance', 'procurement', 'operations'],
    parameters: {
      impactRadius: 0.7,
      recoveryRate: 0.05,
      cascadeProbability: 0.2,
      detectionDifficulty: 0.1,
      customParameters: { constraintsAdded: 5 },
    },
    mitigationOptions: [
      {
        id: 'mit_legal_review',
        name: 'Expedited Legal Review',
        effectiveness: 0.5,
        cost: 50000,
        timeToImplement: 48,
        sideEffects: ['Temporary operations pause'],
      },
    ],
  },
];
