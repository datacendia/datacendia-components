/**
 * Cortex Core API Types
 * 
 * 3-Tier Architecture: Foundation → Enterprise → Strategic
 * 12 Pillars (IDs → Display Names):
 *   Foundation:  council (THE COUNCIL), decide (DECIDE), dcii (DCII)
 *   Enterprise:  stress_test (STRESS-TEST), comply (COMPLY), govern (GOVERN), sovereign (SOVEREIGN), operate (OPERATE)
 *   Strategic:   collapse (RESILIENCE), sgas (MODEL), verticals (DOMINATE), frontier (NATION)
 * 
 * Legacy pillar names (helm, lineage, predict, flow, health, guard, ethics, agents)
 * are retained for backward compatibility with existing Cortex query routing.
 */

// Legacy pillar names for backward-compatible Cortex query routing
export type LegacyPillarName = 'helm' | 'lineage' | 'predict' | 'flow' | 'health' | 'guard' | 'ethics' | 'agents';

// New 3-tier pillar names
export type PlatformPillarName =
  // Tier 1: Foundation
  | 'council' | 'decide' | 'dcii'
  // Tier 2: Enterprise
  | 'stress_test' | 'comply' | 'govern' | 'sovereign' | 'operate'
  // Tier 3: Strategic
  | 'collapse' | 'sgas' | 'verticals' | 'frontier';

// Union type — accepts both legacy and new pillar names
export type PillarName = LegacyPillarName | PlatformPillarName;

// Platform tier type
export type PlatformTier = 'foundation' | 'enterprise' | 'strategic';

export interface QueryContext {
  organizationId: string;
  userId?: string;
  timeRange?: { start: string; end: string };
}

export interface QuerySource {
  pillar: PillarName;
  entities: number;
  executionMs: number;
}

// Query Engine
export interface StructuredQuery {
  entity: string;
  fields?: string[];
  filter?: Record<string, any>;
  sort?: { field: string; order: 'asc' | 'desc' };
  limit?: number;
  offset?: number;
}

export interface QueryParams {
  intent: 'natural_language' | 'structured';
  query: string | StructuredQuery;
  pillars?: PillarName[];
  context: QueryContext;
}

export interface QueryResponse {
  success: boolean;
  data: any;
  sources: QuerySource[];
  confidence?: number;
  executionMs: number;
}

// Analyze Engine
export type AnalysisType = 'impact' | 'risk' | 'trend' | 'anomaly' | 'premortem' | 'cascade' | 'correlation';

export interface AnalyzeParams {
  type: AnalysisType;
  subject: { entityType: string; entityId?: string; data?: any };
  parameters?: { depth?: number; horizon?: string; scenarios?: any[]; threshold?: number };
  context: QueryContext;
}

export interface Finding {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  affectedEntities?: string[];
  evidence?: any;
}

export interface Recommendation {
  id: string;
  priority: number;
  action: string;
  rationale: string;
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
}

export interface AnalyzeResponse {
  success: boolean;
  analysis: { summary: string; findings: Finding[]; recommendations: Recommendation[]; visualizationData?: any; score?: number };
  pillarsConsulted: PillarName[];
  modelUsed?: string;
  executionMs: number;
}

// Simulate Engine
export type SimulationType = 'forecast' | 'scenario' | 'monte_carlo' | 'stress_test' | 'what_if';

export interface SimulateParams {
  type: SimulationType;
  baseline: { entityType: string; entityId?: string; currentState?: any };
  changes: Array<{ variable: string; newValue: any; confidence?: number }>;
  horizon: string;
  iterations?: number;
  context: QueryContext;
}

export interface Outcome {
  scenario: string;
  probability: number;
  impact: number;
  metrics: Record<string, number>;
  timeline?: Array<{ date: string; value: number }>;
}

export interface SimulateResponse {
  success: boolean;
  simulation: {
    outcomes: Outcome[];
    probabilityDistribution?: { mean: number; stdDev: number; percentiles: Record<string, number> };
    sensitivityAnalysis?: Array<{ variable: string; sensitivity: number }>;
    confidence: number;
    baselineValue?: number;
    projectedValue?: number;
  };
  pillarsConsulted: PillarName[];
  executionMs: number;
}

// Govern Engine
export type GovernAction = 'check' | 'approve' | 'reject' | 'escalate' | 'audit';
export type GovernanceType = 'compliance' | 'ethics' | 'policy' | 'access' | 'risk';

export interface GovernParams {
  action: GovernAction;
  subject: { entityType: string; entityId: string; data?: any };
  governanceType: GovernanceType;
  parameters?: { frameworks?: string[]; policies?: string[]; approvers?: string[]; threshold?: number };
  context: QueryContext;
  reason?: string;
}

export interface Violation {
  id: string;
  rule: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  remediation?: string;
}

export interface GovernResponse {
  success: boolean;
  result: {
    status: 'approved' | 'rejected' | 'pending' | 'escalated' | 'compliant' | 'non_compliant';
    violations: Violation[];
    requiredActions: Array<{ action: string; assignee?: string; deadline?: string }>;
    auditTrail: Array<{ timestamp: string; actor: string; action: string; details?: string }>;
    score?: number;
  };
  pillarsConsulted: PillarName[];
  executionMs: number;
}

// Context Engine
export interface ContextOptions {
  depth?: number;
  include?: PillarName[];
  exclude?: PillarName[];
}

export interface ContextResponse {
  success: boolean;
  entity: { id: string; type: string; name: string; attributes: Record<string, any> };
  context: {
    helm?: { metrics: any[]; health: number; trends: any[] };
    lineage?: { upstream: any[]; downstream: any[]; quality: number };
    predict?: { forecasts: any[]; confidence: number };
    flow?: { workflows: any[]; executions: any[] };
    health?: { status: string; alerts: any[]; score: number };
    guard?: { riskScore: number; compliance: any; threats: any[] };
    ethics?: { lastReview: any; score: number; principles: any[] };
    agents?: { relevant: any[]; recommendations: any[] };
  };
  relationships: Array<{ type: string; targetId: string; targetName: string }>;
  timeline: Array<{ timestamp: string; event: string; pillar: PillarName }>;
  executionMs: number;
}
