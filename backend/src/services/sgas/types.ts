/**
 * Service — Types
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports generateSGASId, hashState, createDeliberationNode, createDeliberationEdge, SGAS_VERSION, DEFAULT_DELIBERATION_CONFIG, DEFAULT_REPLAY_CONFIG, AGENT_CLASS_EXECUTION_ORDER
 * @module services/sgas/types
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA SGAS - Synthetic Governance Agent System
 * Institutional Multi-Agent Decision Verification Architecture
 * 
 * Enterprise/Government Platinum Standard
 * 
 * Core Design Principles:
 * 1. No People, Only Institutions (rules, constraints, authorities, resources, processes, failure modes)
 * 2. Determinism by Default (seeds, inputs, ordering, state transitions logged; replay produces identical outcomes)
 * 3. Bounded Authority (every agent has defined scope; violations logged, not silently corrected)
 * 4. Adversarial by Design (assumes misuse; adversarial agents are first-class citizens)
 */

import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

// =============================================================================
// CORE ENUMS
// =============================================================================

export enum SGASAgentClass {
  DECISION = 'CLASS_I_DECISION',
  INSTITUTIONAL = 'CLASS_II_INSTITUTIONAL',
  ADVERSARIAL = 'CLASS_III_ADVERSARIAL',
  OBSERVER = 'CLASS_IV_OBSERVER',
  META_GOVERNANCE = 'CLASS_V_META_GOVERNANCE',
}

export enum DecisionRecommendation {
  APPROVE = 'approve',
  MODIFY = 'modify',
  REJECT = 'reject',
  ESCALATE = 'escalate',
}

export enum InstitutionalStatus {
  ALLOW = 'allow',
  BLOCK = 'block',
  ESCALATE = 'escalate',
  CONDITIONAL = 'conditional',
}

export enum RiskLevel {
  NEGLIGIBLE = 'negligible',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum SeverityLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
  CATASTROPHIC = 'catastrophic',
}

export enum DeliberationPhase {
  INITIALIZATION = 'initialization',
  DECISION_ANALYSIS = 'decision_analysis',
  INSTITUTIONAL_ENFORCEMENT = 'institutional_enforcement',
  ADVERSARIAL_STRESS = 'adversarial_stress',
  OBSERVATION_AUDIT = 'observation_audit',
  META_GOVERNANCE = 'meta_governance',
  FINALIZATION = 'finalization',
}

export enum ConstraintType {
  LEGAL = 'legal',
  REGULATORY = 'regulatory',
  BUDGETARY = 'budgetary',
  OPERATIONAL = 'operational',
  TEMPORAL = 'temporal',
  ETHICAL = 'ethical',
  PROCEDURAL = 'procedural',
  AUTHORITY = 'authority',
}

export enum ViolationType {
  SCOPE_EXCEEDED = 'scope_exceeded',
  AUTHORITY_BREACH = 'authority_breach',
  CONSTRAINT_VIOLATION = 'constraint_violation',
  PROCESS_BYPASS = 'process_bypass',
  RESOURCE_EXCEEDED = 'resource_exceeded',
  TEMPORAL_VIOLATION = 'temporal_violation',
}

// =============================================================================
// CORE INTERFACES - DECISION PROPOSALS
// =============================================================================

export interface DecisionProposal {
  id: string;
  timestamp: Date;
  proposer: string;
  title: string;
  description: string;
  type: DecisionType;
  context: DecisionContext;
  constraints: Constraint[];
  historicalBaseline?: HistoricalBaseline;
  metadata: ProposalMetadata;
}

export enum DecisionType {
  POLICY = 'policy',
  ALLOCATION = 'allocation',
  RESPONSE = 'response',
  PROCUREMENT = 'procurement',
  ENFORCEMENT = 'enforcement',
  EMERGENCY = 'emergency',
  STRATEGIC = 'strategic',
  OPERATIONAL = 'operational',
}

export interface DecisionContext {
  budget?: BudgetContext;
  timeframe: TimeframeContext;
  scope: ScopeContext;
  stakeholders: string[];
  dependencies: string[];
  riskTolerance: RiskLevel;
  institutionalState: InstitutionalState;
}

export interface BudgetContext {
  allocated: number;
  currency: string;
  fiscalYear: string;
  lineItems: BudgetLineItem[];
  flexibilityPercent: number;
}

export interface BudgetLineItem {
  category: string;
  amount: number;
  locked: boolean;
  justification: string;
}

export interface TimeframeContext {
  start: Date;
  end: Date;
  milestones: Milestone[];
  criticalPath: boolean;
  flexibilityDays: number;
}

export interface Milestone {
  id: string;
  name: string;
  date: Date;
  required: boolean;
  dependencies: string[];
}

export interface ScopeContext {
  boundaries: string[];
  exclusions: string[];
  authorities: AuthorityScope[];
  geographicScope: string[];
  organizationalUnits: string[];
}

export interface AuthorityScope {
  authority: string;
  level: AuthorityLevel;
  delegatable: boolean;
  expiresAt?: Date;
}

export enum AuthorityLevel {
  NONE = 'none',
  READ = 'read',
  RECOMMEND = 'recommend',
  APPROVE = 'approve',
  EXECUTE = 'execute',
  OVERRIDE = 'override',
}

export enum InstitutionalState {
  NORMAL = 'normal',
  ELEVATED = 'elevated',
  EMERGENCY = 'emergency',
  CRISIS = 'crisis',
  MARTIAL = 'martial',
}

export interface Constraint {
  id: string;
  type: ConstraintType;
  name: string;
  description: string;
  source: string;
  enforcementLevel: EnforcementLevel;
  parameters: Record<string, unknown>;
  exceptions: ConstraintException[];
  effectiveFrom: Date;
  effectiveUntil?: Date;
}

export enum EnforcementLevel {
  ADVISORY = 'advisory',
  SOFT = 'soft',
  HARD = 'hard',
  ABSOLUTE = 'absolute',
}

export interface ConstraintException {
  id: string;
  condition: string;
  authority: string;
  requiresJustification: boolean;
  auditRequired: boolean;
  expiresAt?: Date;
}

export interface HistoricalBaseline {
  referenceDecisions: string[];
  averageOutcome: number;
  varianceRange: [number, number];
  successRate: number;
  failureModes: FailureMode[];
}

export interface FailureMode {
  id: string;
  name: string;
  probability: number;
  impact: SeverityLevel;
  mitigations: string[];
  historicalOccurrences: number;
}

export interface ProposalMetadata {
  version: number;
  previousVersions: string[];
  classifications: string[];
  tags: string[];
  priority: number;
  urgency: UrgencyLevel;
  sensitivity: SensitivityLevel;
}

export enum UrgencyLevel {
  ROUTINE = 'routine',
  PRIORITY = 'priority',
  URGENT = 'urgent',
  IMMEDIATE = 'immediate',
  FLASH = 'flash',
}

export enum SensitivityLevel {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  CONFIDENTIAL = 'confidential',
  SECRET = 'secret',
  TOP_SECRET = 'top_secret',
}

// =============================================================================
// CLASS I - DECISION AGENT TYPES
// =============================================================================

export interface DecisionAgentConfig {
  id: string;
  name: string;
  class: SGASAgentClass.DECISION;
  objective: DecisionObjective;
  capabilities: DecisionCapability[];
  guardrails: AgentGuardrail[];
  deterministicSeed?: number;
  llmConfig?: BoundedLLMConfig;
}

export enum DecisionObjective {
  RISK_MINIMIZATION = 'risk_minimization',
  COST_EFFICIENCY = 'cost_efficiency',
  RESILIENCE = 'resilience',
  LEGAL_EXPOSURE = 'legal_exposure',
  OPERATIONAL_FEASIBILITY = 'operational_feasibility',
  STAKEHOLDER_IMPACT = 'stakeholder_impact',
  TIMELINE_OPTIMIZATION = 'timeline_optimization',
  RESOURCE_OPTIMIZATION = 'resource_optimization',
  COMPLIANCE_ASSURANCE = 'compliance_assurance',
  STRATEGIC_ALIGNMENT = 'strategic_alignment',
}

export interface DecisionCapability {
  id: string;
  name: string;
  description: string;
  inputTypes: string[];
  outputTypes: string[];
  computeIntensity: ComputeIntensity;
}

export enum ComputeIntensity {
  TRIVIAL = 'trivial',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  INTENSIVE = 'intensive',
}

export interface AgentGuardrail {
  id: string;
  name: string;
  type: GuardrailType;
  condition: string;
  action: GuardrailAction;
  logging: boolean;
}

export enum GuardrailType {
  INPUT_VALIDATION = 'input_validation',
  OUTPUT_VALIDATION = 'output_validation',
  SCOPE_ENFORCEMENT = 'scope_enforcement',
  AUTHORITY_CHECK = 'authority_check',
  RATE_LIMIT = 'rate_limit',
  RESOURCE_LIMIT = 'resource_limit',
}

export enum GuardrailAction {
  LOG = 'log',
  WARN = 'warn',
  BLOCK = 'block',
  ESCALATE = 'escalate',
  TERMINATE = 'terminate',
}

export interface BoundedLLMConfig {
  enabled: boolean;
  model: string;
  maxTokens: number;
  temperature: number;
  topP: number;
  seed: number;
  systemPrompt: string;
  responseFormat: 'json' | 'text';
  loggingLevel: 'none' | 'summary' | 'full';
}

export interface DecisionAgentOutput {
  agentId: string;
  timestamp: Date;
  proposalId: string;
  recommendation: DecisionRecommendation;
  riskLevel: RiskLevel;
  confidence: number;
  primaryRisks: RiskVector[];
  assumptions: Assumption[];
  knownUnknowns: KnownUnknown[];
  reasoning: ReasoningChain;
  executionMetadata: ExecutionMetadata;
}

export interface RiskVector {
  id: string;
  name: string;
  category: string;
  probability: number;
  impact: SeverityLevel;
  timeframe: string;
  mitigations: string[];
  residualRisk: number;
}

export interface Assumption {
  id: string;
  statement: string;
  confidence: number;
  source: string;
  validationMethod?: string;
  invalidationTrigger?: string;
}

export interface KnownUnknown {
  id: string;
  description: string;
  potentialImpact: SeverityLevel;
  investigationCost: number;
  decisionRelevance: number;
}

export interface ReasoningChain {
  steps: ReasoningStep[];
  finalConclusion: string;
  alternativesConsidered: string[];
  rejectedPaths: RejectedPath[];
}

export interface ReasoningStep {
  order: number;
  type: ReasoningType;
  input: string;
  output: string;
  confidence: number;
  duration: number;
}

export enum ReasoningType {
  RULE_BASED = 'rule_based',
  INFERENCE = 'inference',
  BOUNDED_LLM = 'bounded_llm',
  LOOKUP = 'lookup',
  CALCULATION = 'calculation',
}

export interface RejectedPath {
  description: string;
  reason: string;
  riskLevel: RiskLevel;
}

export interface ExecutionMetadata {
  startTime: Date;
  endTime: Date;
  durationMs: number;
  seed: number;
  inputHash: string;
  outputHash: string;
  resourcesUsed: ResourceUsage;
  deterministic: boolean;
}

export interface ResourceUsage {
  cpuMs: number;
  memoryMb: number;
  llmTokens?: number;
  externalCalls: number;
}

// =============================================================================
// CLASS II - INSTITUTIONAL AGENT TYPES
// =============================================================================

export interface InstitutionalAgentConfig {
  id: string;
  name: string;
  class: SGASAgentClass.INSTITUTIONAL;
  institutionType: InstitutionType;
  jurisdiction: Jurisdiction;
  authorities: InstitutionalAuthority[];
  constraints: InstitutionalConstraint[];
  escalationPaths: EscalationPath[];
}

export enum InstitutionType {
  REGULATORY_BODY = 'regulatory_body',
  BUDGET_AUTHORITY = 'budget_authority',
  LEGAL_AUTHORITY = 'legal_authority',
  ETHICS_BOARD = 'ethics_board',
  PROCUREMENT_OFFICE = 'procurement_office',
  EMERGENCY_MANAGEMENT = 'emergency_management',
  AUDIT_AUTHORITY = 'audit_authority',
  EXECUTIVE_AUTHORITY = 'executive_authority',
}

export interface Jurisdiction {
  geographic: string[];
  organizational: string[];
  temporal: TimeframeContext;
  functional: string[];
}

export interface InstitutionalAuthority {
  id: string;
  name: string;
  type: AuthorityType;
  scope: string[];
  limitations: string[];
  delegationRules: DelegationRule[];
}

export enum AuthorityType {
  APPROVE = 'approve',
  BLOCK = 'block',
  ESCALATE = 'escalate',
  OVERRIDE = 'override',
  AUDIT = 'audit',
  CERTIFY = 'certify',
}

export interface DelegationRule {
  delegateTo: string;
  conditions: string[];
  maxAmount?: number;
  requiresNotification: boolean;
  expiresAt?: Date;
}

export interface InstitutionalConstraint {
  id: string;
  name: string;
  type: ConstraintType;
  rule: string;
  enforcement: EnforcementLevel;
  overrideAuthority?: string;
  auditRequirement: AuditRequirement;
}

export enum AuditRequirement {
  NONE = 'none',
  PERIODIC = 'periodic',
  ON_EXCEPTION = 'on_exception',
  CONTINUOUS = 'continuous',
  MANDATORY = 'mandatory',
}

export interface EscalationPath {
  id: string;
  trigger: string;
  destination: string;
  timeLimit: number;
  autoEscalate: boolean;
  notificationList: string[];
}

export interface InstitutionalAgentOutput {
  agentId: string;
  timestamp: Date;
  proposalId: string;
  decisionAgentOutputs: string[];
  status: InstitutionalStatus;
  reason: string;
  constraintMatches: ConstraintMatch[];
  overrideAvailable: boolean;
  overrideAuthority?: string;
  overrideConditions?: string[];
  requiredActions: RequiredAction[];
  violationReports: ViolationReport[];
  auditFlags: AuditFlag[];
  executionMetadata: ExecutionMetadata;
}

export interface ConstraintMatch {
  constraintId: string;
  matched: boolean;
  matchType: MatchType;
  parameters: Record<string, unknown>;
  severity: SeverityLevel;
}

export enum MatchType {
  EXACT = 'exact',
  PARTIAL = 'partial',
  EDGE_CASE = 'edge_case',
  CONFLICT = 'conflict',
}

export interface RequiredAction {
  id: string;
  action: string;
  responsible: string;
  deadline: Date;
  mandatory: boolean;
  verificationMethod: string;
}

export interface ViolationReport {
  id: string;
  type: ViolationType;
  description: string;
  severity: SeverityLevel;
  evidence: string[];
  remediation: string[];
  reportedTo: string[];
}

export interface AuditFlag {
  id: string;
  type: AuditFlagType;
  description: string;
  priority: number;
  autoResolve: boolean;
  resolution?: string;
}

export enum AuditFlagType {
  COMPLIANCE = 'compliance',
  PROCESS = 'process',
  AUTHORITY = 'authority',
  CONFLICT = 'conflict',
  TIMING = 'timing',
  DOCUMENTATION = 'documentation',
}

// =============================================================================
// CLASS III - ADVERSARIAL AGENT TYPES
// =============================================================================

export interface AdversarialAgentConfig {
  id: string;
  name: string;
  class: SGASAgentClass.ADVERSARIAL;
  attackProfile: AttackProfile;
  techniques: AdversarialTechnique[];
  constraints: AdversarialConstraint[];
  targetObjectives: TargetObjective[];
}

export interface AttackProfile {
  type: AttackType;
  sophistication: SophisticationLevel;
  resources: ResourceLevel;
  motivation: Motivation;
  persistence: PersistenceLevel;
}

export enum AttackType {
  LOOPHOLE_EXPLOITATION = 'loophole_exploitation',
  EDGE_CASE_PROBE = 'edge_case_probe',
  FRAGILITY_TEST = 'fragility_test',
  CASCADE_TRIGGER = 'cascade_trigger',
  INCENTIVE_MISALIGNMENT = 'incentive_misalignment',
  TIMING_ATTACK = 'timing_attack',
  RESOURCE_EXHAUSTION = 'resource_exhaustion',
  AUTHORITY_ARBITRAGE = 'authority_arbitrage',
}

export enum SophisticationLevel {
  BASIC = 'basic',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
  NATION_STATE = 'nation_state',
}

export enum ResourceLevel {
  MINIMAL = 'minimal',
  LIMITED = 'limited',
  MODERATE = 'moderate',
  SUBSTANTIAL = 'substantial',
  UNLIMITED = 'unlimited',
}

export enum Motivation {
  TESTING = 'testing',
  PROFIT = 'profit',
  DISRUPTION = 'disruption',
  IDEOLOGY = 'ideology',
  STRATEGIC = 'strategic',
}

export enum PersistenceLevel {
  OPPORTUNISTIC = 'opportunistic',
  CASUAL = 'casual',
  DETERMINED = 'determined',
  PERSISTENT = 'persistent',
  RELENTLESS = 'relentless',
}

export interface AdversarialTechnique {
  id: string;
  name: string;
  type: TechniqueType;
  description: string;
  inputs: string[];
  outputs: string[];
  successCriteria: string;
}

export enum TechniqueType {
  PARAMETER_PERTURBATION = 'parameter_perturbation',
  SEQUENCE_MANIPULATION = 'sequence_manipulation',
  TIMING_SHIFT = 'timing_shift',
  CONSTRAINT_EDGE_PROBE = 'constraint_edge_probe',
  DATA_DEGRADATION = 'data_degradation',
  AUTHORITY_ESCALATION = 'authority_escalation',
  PROCESS_BYPASS = 'process_bypass',
  RESOURCE_STARVATION = 'resource_starvation',
}

export interface AdversarialConstraint {
  id: string;
  type: AdversarialConstraintType;
  description: string;
  enforcement: EnforcementLevel;
}

export enum AdversarialConstraintType {
  LEGAL_BOUNDARY = 'legal_boundary',
  ETHICAL_BOUNDARY = 'ethical_boundary',
  SAFETY_BOUNDARY = 'safety_boundary',
  SCOPE_BOUNDARY = 'scope_boundary',
}

export interface TargetObjective {
  id: string;
  name: string;
  description: string;
  successMetric: string;
  impactCategory: ImpactCategory;
}

export enum ImpactCategory {
  FINANCIAL = 'financial',
  OPERATIONAL = 'operational',
  REPUTATIONAL = 'reputational',
  LEGAL = 'legal',
  SAFETY = 'safety',
  STRATEGIC = 'strategic',
}

export interface AdversarialAgentOutput {
  agentId: string;
  timestamp: Date;
  proposalId: string;
  approvedDecisionId: string;
  failureScenarios: FailureScenario[];
  exploitPaths: ExploitPath[];
  severityAssessment: SeverityAssessment;
  mitigationSuggestions: MitigationSuggestion[];
  residualRisks: ResidualRisk[];
  executionMetadata: ExecutionMetadata;
}

export interface FailureScenario {
  id: string;
  name: string;
  description: string;
  trigger: string;
  probability: number;
  impact: SeverityLevel;
  cascadeEffects: CascadeEffect[];
  detectionDifficulty: DifficultyLevel;
  recoveryDifficulty: DifficultyLevel;
}

export interface CascadeEffect {
  order: number;
  effect: string;
  affectedSystems: string[];
  amplificationFactor: number;
}

export enum DifficultyLevel {
  TRIVIAL = 'trivial',
  EASY = 'easy',
  MODERATE = 'moderate',
  DIFFICULT = 'difficult',
  EXTREMELY_DIFFICULT = 'extremely_difficult',
}

export interface ExploitPath {
  id: string;
  name: string;
  technique: TechniqueType;
  steps: ExploitStep[];
  prerequisites: string[];
  successProbability: number;
  detectability: DifficultyLevel;
  impact: SeverityLevel;
}

export interface ExploitStep {
  order: number;
  action: string;
  target: string;
  expectedOutcome: string;
  alternatives: string[];
}

export interface SeverityAssessment {
  overall: SeverityLevel;
  financial: SeverityLevel;
  operational: SeverityLevel;
  reputational: SeverityLevel;
  legal: SeverityLevel;
  safety: SeverityLevel;
  confidence: number;
}

export interface MitigationSuggestion {
  id: string;
  targetFailure: string;
  suggestion: string;
  effectiveness: number;
  implementationCost: CostLevel;
  implementationTime: string;
  sideEffects: string[];
}

export enum CostLevel {
  NEGLIGIBLE = 'negligible',
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  PROHIBITIVE = 'prohibitive',
}

export interface ResidualRisk {
  id: string;
  description: string;
  probability: number;
  impact: SeverityLevel;
  acceptanceRationale?: string;
  monitoringRequirement: string;
}

// =============================================================================
// CLASS IV - OBSERVER AGENT TYPES
// =============================================================================

export interface ObserverAgentConfig {
  id: string;
  name: string;
  class: SGASAgentClass.OBSERVER;
  observationType: ObservationType;
  metrics: MetricDefinition[];
  triggers: ObserverTrigger[];
  outputFormats: OutputFormat[];
}

export enum ObservationType {
  OUTCOME_VARIANCE = 'outcome_variance',
  TRUST_IMPACT = 'trust_impact',
  BIAS_DETECTION = 'bias_detection',
  DETERMINISM_VERIFICATION = 'determinism_verification',
  REPLAY_FIDELITY = 'replay_fidelity',
  PROCESS_COMPLIANCE = 'process_compliance',
  PERFORMANCE_MONITORING = 'performance_monitoring',
}

export interface MetricDefinition {
  id: string;
  name: string;
  type: MetricType;
  calculation: string;
  unit: string;
  thresholds: MetricThreshold[];
  aggregation: AggregationType;
}

export enum MetricType {
  COUNTER = 'counter',
  GAUGE = 'gauge',
  HISTOGRAM = 'histogram',
  SUMMARY = 'summary',
  DELTA = 'delta',
}

export interface MetricThreshold {
  level: ThresholdLevel;
  value: number;
  action: GuardrailAction;
}

export enum ThresholdLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

export enum AggregationType {
  SUM = 'sum',
  AVERAGE = 'average',
  MIN = 'min',
  MAX = 'max',
  PERCENTILE = 'percentile',
  COUNT = 'count',
}

export interface ObserverTrigger {
  id: string;
  condition: string;
  action: string;
  cooldown: number;
  maxTriggers: number;
}

export enum OutputFormat {
  JSON = 'json',
  MERKLE_TREE = 'merkle_tree',
  AUDIT_LOG = 'audit_log',
  REPORT = 'report',
  ALERT = 'alert',
}

export interface ObserverAgentOutput {
  agentId: string;
  timestamp: Date;
  proposalId: string;
  deliberationGraphId: string;
  metrics: MetricResult[];
  trustDelta: TrustDelta;
  integrityVerification: IntegrityVerification;
  replayVerification?: ReplayVerification;
  auditArtifacts: AuditArtifact[];
  anomalies: Anomaly[];
  executionMetadata: ExecutionMetadata;
}

export interface MetricResult {
  metricId: string;
  name: string;
  value: number;
  unit: string;
  threshold: ThresholdLevel;
  trend: TrendDirection;
  historicalComparison: HistoricalComparison;
}

export enum TrendDirection {
  IMPROVING = 'improving',
  STABLE = 'stable',
  DEGRADING = 'degrading',
  VOLATILE = 'volatile',
}

export interface HistoricalComparison {
  baseline: number;
  percentChange: number;
  standardDeviations: number;
  withinNormalRange: boolean;
}

export interface TrustDelta {
  overall: number;
  components: TrustComponent[];
  explanation: string;
  confidence: number;
}

export interface TrustComponent {
  name: string;
  previousValue: number;
  currentValue: number;
  delta: number;
  weight: number;
}

export interface IntegrityVerification {
  verified: boolean;
  merkleRoot: string;
  nodeCount: number;
  hashAlgorithm: string;
  verificationTimestamp: Date;
  discrepancies: Discrepancy[];
}

export interface Discrepancy {
  location: string;
  expected: string;
  actual: string;
  severity: SeverityLevel;
}

export interface ReplayVerification {
  originalRunId: string;
  replayRunId: string;
  identical: boolean;
  differences: ReplayDifference[];
  seed: number;
  deterministicComponents: number;
  nonDeterministicComponents: number;
}

export interface ReplayDifference {
  component: string;
  originalValue: string;
  replayValue: string;
  cause: string;
}

export interface AuditArtifact {
  id: string;
  type: AuditArtifactType;
  name: string;
  hash: string;
  size: number;
  createdAt: Date;
  retentionUntil: Date;
  classification: SensitivityLevel;
}

export enum AuditArtifactType {
  INPUT_SNAPSHOT = 'input_snapshot',
  OUTPUT_SNAPSHOT = 'output_snapshot',
  STATE_TRANSITION = 'state_transition',
  DECISION_RECORD = 'decision_record',
  VIOLATION_RECORD = 'violation_record',
  INTEGRITY_PROOF = 'integrity_proof',
}

export interface Anomaly {
  id: string;
  type: AnomalyType;
  description: string;
  severity: SeverityLevel;
  detectedAt: Date;
  affectedComponents: string[];
  possibleCauses: string[];
  recommendedActions: string[];
}

export enum AnomalyType {
  STATISTICAL = 'statistical',
  BEHAVIORAL = 'behavioral',
  TEMPORAL = 'temporal',
  STRUCTURAL = 'structural',
  INTEGRITY = 'integrity',
}

// =============================================================================
// CLASS V - META-GOVERNANCE AGENT TYPES
// =============================================================================

export interface MetaGovernanceAgentConfig {
  id: string;
  name: string;
  class: SGASAgentClass.META_GOVERNANCE;
  monitoringScope: MonitoringScope;
  detectionPatterns: DetectionPattern[];
  governanceMetrics: GovernanceMetric[];
  interventionAuthority: InterventionAuthority;
}

export interface MonitoringScope {
  timeRange: TimeRange;
  agentClasses: SGASAgentClass[];
  institutionalTypes: InstitutionType[];
  decisionTypes: DecisionType[];
}

export interface TimeRange {
  lookbackDays: number;
  granularity: Granularity;
  aggregationWindow: number;
}

export enum Granularity {
  MINUTE = 'minute',
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

export interface DetectionPattern {
  id: string;
  name: string;
  type: DriftType;
  threshold: number;
  windowSize: number;
  sensitivity: number;
}

export enum DriftType {
  EMERGENCY_POWER_OVERUSE = 'emergency_power_overuse',
  SAFEGUARD_EROSION = 'safeguard_erosion',
  AUTOMATION_CREEP = 'automation_creep',
  HUMAN_OVERRIDE_DECAY = 'human_override_decay',
  AUTHORITY_CONCENTRATION = 'authority_concentration',
  PROCESS_BYPASS_NORMALIZATION = 'process_bypass_normalization',
  CONSTRAINT_RELAXATION = 'constraint_relaxation',
}

export interface GovernanceMetric {
  id: string;
  name: string;
  description: string;
  calculation: string;
  healthyRange: [number, number];
  criticalThreshold: number;
}

export interface InterventionAuthority {
  canAlert: boolean;
  canRecommend: boolean;
  canBlock: boolean;
  canEscalate: boolean;
  escalationTargets: string[];
}

export interface MetaGovernanceAgentOutput {
  agentId: string;
  timestamp: Date;
  analysisWindow: TimeRange;
  driftWarnings: DriftWarning[];
  governanceRiskReport: GovernanceRiskReport;
  structuralRecommendations: StructuralRecommendation[];
  systemHealthScore: SystemHealthScore;
  interventionsTaken: Intervention[];
  executionMetadata: ExecutionMetadata;
}

export interface DriftWarning {
  id: string;
  type: DriftType;
  severity: SeverityLevel;
  description: string;
  evidence: DriftEvidence[];
  trend: TrendDirection;
  projectedImpact: string;
  timeToThreshold?: number;
}

export interface DriftEvidence {
  metric: string;
  baseline: number;
  current: number;
  drift: number;
  startDate: Date;
  measurements: number;
}

export interface GovernanceRiskReport {
  overallRiskLevel: RiskLevel;
  riskCategories: GovernanceRiskCategory[];
  comparisonToPrevious: RiskComparison;
  keyFindings: string[];
  urgentIssues: string[];
}

export interface GovernanceRiskCategory {
  category: string;
  riskLevel: RiskLevel;
  score: number;
  maxScore: number;
  factors: RiskFactor[];
}

export interface RiskFactor {
  name: string;
  weight: number;
  score: number;
  direction: TrendDirection;
}

export interface RiskComparison {
  previousPeriodScore: number;
  currentPeriodScore: number;
  change: number;
  changeDirection: TrendDirection;
}

export interface StructuralRecommendation {
  id: string;
  priority: number;
  category: RecommendationCategory;
  recommendation: string;
  rationale: string;
  expectedImpact: string;
  implementationComplexity: DifficultyLevel;
  timeframe: string;
  dependencies: string[];
}

export enum RecommendationCategory {
  PROCESS = 'process',
  AUTHORITY = 'authority',
  CONSTRAINT = 'constraint',
  MONITORING = 'monitoring',
  ESCALATION = 'escalation',
  AUTOMATION = 'automation',
}

export interface SystemHealthScore {
  overall: number;
  components: HealthComponent[];
  trend: TrendDirection;
  lastUpdated: Date;
}

export interface HealthComponent {
  name: string;
  score: number;
  weight: number;
  status: HealthStatus;
}

export enum HealthStatus {
  HEALTHY = 'healthy',
  DEGRADED = 'degraded',
  UNHEALTHY = 'unhealthy',
  CRITICAL = 'critical',
  UNKNOWN = 'unknown',
}

export interface Intervention {
  id: string;
  type: InterventionType;
  reason: string;
  target: string;
  timestamp: Date;
  outcome: string;
  reversible: boolean;
}

export enum InterventionType {
  ALERT = 'alert',
  RECOMMENDATION = 'recommendation',
  BLOCK = 'block',
  ESCALATION = 'escalation',
  PAUSE = 'pause',
  AUDIT_TRIGGER = 'audit_trigger',
}

// =============================================================================
// DELIBERATION GRAPH TYPES
// =============================================================================

export interface DeliberationGraph {
  id: string;
  proposalId: string;
  createdAt: Date;
  completedAt?: Date;
  status: DeliberationStatus;
  phase: DeliberationPhase;
  nodes: DeliberationNode[];
  edges: DeliberationEdge[];
  executionOrder: string[];
  seed: number;
  deterministicHash: string;
  metadata: DeliberationMetadata;
}

export enum DeliberationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export interface DeliberationNode {
  id: string;
  agentId: string;
  agentClass: SGASAgentClass;
  phase: DeliberationPhase;
  order: number;
  status: NodeStatus;
  input: unknown;
  output: unknown;
  startedAt?: Date;
  completedAt?: Date;
  durationMs?: number;
  inputHash: string;
  outputHash: string;
}

export enum NodeStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  SKIPPED = 'skipped',
  BLOCKED = 'blocked',
}

export interface DeliberationEdge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  type: EdgeType;
  condition?: string;
  dataFlow: DataFlowType;
  weight: number;
}

export enum EdgeType {
  SEQUENTIAL = 'sequential',
  CONDITIONAL = 'conditional',
  PARALLEL = 'parallel',
  FEEDBACK = 'feedback',
  ESCALATION = 'escalation',
}

export enum DataFlowType {
  FULL_OUTPUT = 'full_output',
  SUMMARY = 'summary',
  FILTERED = 'filtered',
  AGGREGATED = 'aggregated',
}

export interface DeliberationMetadata {
  version: string;
  configuration: DeliberationConfiguration;
  totalDurationMs: number;
  totalAgentsInvoked: number;
  violationsDetected: number;
  escalationsTriggered: number;
  humanInterventions: number;
}

export interface DeliberationConfiguration {
  maxDurationMs: number;
  maxAgentsPerPhase: number;
  parallelExecution: boolean;
  failFast: boolean;
  includeMetaGovernance: boolean;
  auditLevel: AuditLevel;
}

export enum AuditLevel {
  MINIMAL = 'minimal',
  STANDARD = 'standard',
  COMPREHENSIVE = 'comprehensive',
  FORENSIC = 'forensic',
}

// =============================================================================
// REPLAY ENGINE TYPES
// =============================================================================

export interface ReplaySession {
  id: string;
  originalDeliberationId: string;
  startedAt: Date;
  completedAt?: Date;
  status: ReplayStatus;
  seed: number;
  configuration: ReplayConfiguration;
  results: ReplayResults;
}

export enum ReplayStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  DIVERGED = 'diverged',
}

export interface ReplayConfiguration {
  strictDeterminism: boolean;
  allowedDivergence: number;
  captureAllStates: boolean;
  verifyIntermediateHashes: boolean;
  stopOnDivergence: boolean;
}

export interface ReplayResults {
  identical: boolean;
  divergencePoint?: string;
  divergenceReason?: string;
  stateComparisons: StateComparison[];
  hashVerifications: HashVerification[];
  performanceComparison: PerformanceComparison;
}

export interface StateComparison {
  nodeId: string;
  originalState: string;
  replayState: string;
  identical: boolean;
  difference?: string;
}

export interface HashVerification {
  component: string;
  originalHash: string;
  replayHash: string;
  verified: boolean;
}

export interface PerformanceComparison {
  originalDurationMs: number;
  replayDurationMs: number;
  variance: number;
  withinTolerance: boolean;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export function generateSGASId(prefix: string): string {
  return `${prefix}_${uuidv4().replace(/-/g, '')}`;
}

export function hashState(state: unknown): string {
  const serialized = JSON.stringify(state, Object.keys(state as object).sort());
  return crypto.createHash('sha256').update(serialized).digest('hex');
}

export function createDeliberationNode(
  agentId: string,
  agentClass: SGASAgentClass,
  phase: DeliberationPhase,
  order: number
): DeliberationNode {
  return {
    id: generateSGASId('node'),
    agentId,
    agentClass,
    phase,
    order,
    status: NodeStatus.PENDING,
    input: null,
    output: null,
    inputHash: '',
    outputHash: '',
  };
}

export function createDeliberationEdge(
  fromNodeId: string,
  toNodeId: string,
  type: EdgeType = EdgeType.SEQUENTIAL,
  dataFlow: DataFlowType = DataFlowType.FULL_OUTPUT
): DeliberationEdge {
  return {
    id: generateSGASId('edge'),
    fromNodeId,
    toNodeId,
    type,
    dataFlow,
    weight: 1.0,
  };
}

// =============================================================================
// CONSTANTS
// =============================================================================

export const SGAS_VERSION = '1.0.0';

export const DEFAULT_DELIBERATION_CONFIG: DeliberationConfiguration = {
  maxDurationMs: 300000, // 5 minutes
  maxAgentsPerPhase: 10,
  parallelExecution: false,
  failFast: false,
  includeMetaGovernance: true,
  auditLevel: AuditLevel.COMPREHENSIVE,
};

export const DEFAULT_REPLAY_CONFIG: ReplayConfiguration = {
  strictDeterminism: true,
  allowedDivergence: 0,
  captureAllStates: true,
  verifyIntermediateHashes: true,
  stopOnDivergence: true,
};

export const AGENT_CLASS_EXECUTION_ORDER: SGASAgentClass[] = [
  SGASAgentClass.DECISION,
  SGASAgentClass.INSTITUTIONAL,
  SGASAgentClass.ADVERSARIAL,
  SGASAgentClass.OBSERVER,
  SGASAgentClass.META_GOVERNANCE,
];

export const PHASE_TO_AGENT_CLASS: Record<DeliberationPhase, SGASAgentClass | null> = {
  [DeliberationPhase.INITIALIZATION]: null,
  [DeliberationPhase.DECISION_ANALYSIS]: SGASAgentClass.DECISION,
  [DeliberationPhase.INSTITUTIONAL_ENFORCEMENT]: SGASAgentClass.INSTITUTIONAL,
  [DeliberationPhase.ADVERSARIAL_STRESS]: SGASAgentClass.ADVERSARIAL,
  [DeliberationPhase.OBSERVATION_AUDIT]: SGASAgentClass.OBSERVER,
  [DeliberationPhase.META_GOVERNANCE]: SGASAgentClass.META_GOVERNANCE,
  [DeliberationPhase.FINALIZATION]: null,
};
