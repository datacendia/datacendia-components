/**
 * CendiaCrucible™ - Type Definitions
 * 
 * Shared types for the Crucible simulation engine
 */

// =============================================================================
// SIMULATION TYPES
// =============================================================================

export type SimulationType = 
  | 'FINANCIAL_STRESS'
  | 'OPERATIONAL_SHOCK'
  | 'CYBER_ATTACK'
  | 'REGULATORY_CHANGE'
  | 'CULTURAL_SHIFT'
  | 'ESG_EVENT'
  | 'MA_SCENARIO'
  | 'MARKET_DISRUPTION'
  | 'SUPPLY_CHAIN'
  | 'TALENT_EXODUS'
  | 'TECHNOLOGY_FAILURE'
  | 'BLACK_SWAN'
  | 'CUSTOM';

export type SimulationStatus = 
  | 'DRAFT'
  | 'CONFIGURING'
  | 'RUNNING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export type OutcomeSentiment = 
  | 'CATASTROPHIC'
  | 'NEGATIVE'
  | 'NEUTRAL'
  | 'POSITIVE'
  | 'OPTIMAL';

export type ImpactCategory = 
  | 'FINANCIAL'
  | 'OPERATIONAL'
  | 'SECURITY'
  | 'COMPLIANCE'
  | 'CULTURAL'
  | 'REPUTATIONAL'
  | 'STRATEGIC'
  | 'TECHNOLOGICAL';

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'MINIMAL';

// =============================================================================
// CONFIGURATION TYPES
// =============================================================================

export interface SimulationConfig {
  monteCarloRuns: number;
  confidenceLevel: number;
  timeHorizonDays: number;
  variables: SimulationVariable[];
  constraints: SimulationConstraint[];
  correlations?: VariableCorrelation[];
}

export interface SimulationVariable {
  name: string;
  type: 'numeric' | 'percentage' | 'categorical' | 'boolean';
  baseValue: number | string | boolean;
  distribution?: 'normal' | 'uniform' | 'triangular' | 'lognormal' | 'beta';
  min?: number;
  max?: number;
  mean?: number;
  stdDev?: number;
}

export interface SimulationConstraint {
  variable: string;
  operator: 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'neq';
  value: number | string;
}

export interface VariableCorrelation {
  variable1: string;
  variable2: string;
  correlation: number;
}

// =============================================================================
// SCENARIO TYPES
// =============================================================================

export interface ScenarioDefinition {
  name: string;
  description: string;
  shocks: Shock[];
  triggers?: Trigger[];
}

export interface Shock {
  target: string;
  type: 'absolute' | 'percentage' | 'multiplier';
  value: number;
  timing: 'immediate' | 'gradual' | 'delayed';
  duration?: number;
}

export interface Trigger {
  condition: string;
  action: string;
  parameters: Record<string, unknown>;
}

// =============================================================================
// RESULT TYPES
// =============================================================================

export interface SimulationResult {
  simulationId: string;
  status: SimulationStatus;
  universes: Universe[];
  impacts: Impact[];
  councilDeliberations: CouncilDeliberation[];
  summary: ResultSummary;
}

export interface Universe {
  id: string;
  universeNumber: number;
  probability: number;
  parentUniverse?: string;
  branchPoint?: string;
  kpiProjections: Record<string, number>;
  riskScores: Record<string, number>;
  outcomeSummary: string;
  outcomeSentiment: OutcomeSentiment;
  failureCascades?: FailureCascade[];
}

export interface Impact {
  id: string;
  category: ImpactCategory;
  entityType: string;
  entityName: string;
  baselineValue?: number;
  projectedValue?: number;
  changePercent?: number;
  confidence: number;
  severity: Severity;
  description?: string;
  propagationPath?: string[];
}

export interface FailureCascade {
  id: string;
  triggerEvent: string;
  cascadeDepth: number;
  affectedNodes: CascadeNode[];
  propagationTime?: number;
  totalImpact?: number;
}

export interface CascadeNode {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  impactLevel: number;
  timeToImpact: number;
  dependencies: string[];
}

export interface CouncilDeliberation {
  id: string;
  scenarioContext: string;
  agentResponses: AgentResponse[];
  consensusReached: boolean;
  finalRecommendation?: string;
  confidenceScore?: number;
}

export interface AgentResponse {
  agentRole: string;
  analysis: string;
  recommendation: string;
  riskAssessment: string;
  confidenceLevel: number;
}

export interface ResultSummary {
  totalUniverses: number;
  bestCase: UniverseSummary;
  worstCase: UniverseSummary;
  mostLikely: UniverseSummary;
  keyRisks: string[];
  keyOpportunities: string[];
  overallConfidence: number;
}

export interface UniverseSummary {
  universeId: string;
  probability: number;
  sentiment: OutcomeSentiment;
  summary: string;
}

// =============================================================================
// DIGITAL TWIN TYPES
// =============================================================================

export interface DigitalTwin {
  organizationId: string;
  organizationName?: string;
  industry?: string;
  snapshotTime: Date;
  departments: Department[];
  systems: System[];
  kpis: KPI[];
  employees: EmployeeMetrics;
  financials: FinancialSnapshot;
  relationships: Relationship[];
  activeAlerts?: number;
  activeWorkflows?: number;
  dataSourceCount?: number;
  healthScore?: number;
}

export interface Department {
  name: string;
  headcount: number;
  budget?: number;
  workflows?: number;
  dataSources?: number;
  efficiency?: number;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  dependencies?: string[];
}

export interface System {
  id: string;
  name: string;
  type: string;
  status?: string;
  criticality?: number;
  uptime?: number;
  lastSync?: Date;
  dependencies?: string[];
}

export interface KPI {
  code: string;
  name: string;
  value: number;
  target?: number;
  trend?: number;
  unit?: string;
  category?: string;
}

export interface EmployeeMetrics {
  totalHeadcount: number;
  averageTenure: number;
  turnoverRate: number;
  engagementScore: number;
  productivityIndex: number;
  hiringRate?: number;
  trainingHours?: number;
  satisfactionScore?: number;
}

export interface FinancialSnapshot {
  revenue: number;
  ebitda: number;
  cashFlow: number;
  burnRate: number;
  runway: number;
  grossMargin?: number;
  customerAcquisitionCost?: number;
  lifetimeValue?: number;
  churnRate?: number;
}

export interface Relationship {
  type: string;
  source: string;
  target: string;
  strength: number;
  critical?: boolean;
}

// =============================================================================
// CREATE SIMULATION PARAMS
// =============================================================================

export interface CreateSimulationParams {
  name: string;
  description?: string;
  simulationType: SimulationType;
  config: SimulationConfig;
  scenarioDefinition: ScenarioDefinition;
}
