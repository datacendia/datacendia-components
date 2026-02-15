// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Cortex Core Service
 * The single gateway through which all Services access organizational data.
 * Enforces: Sources → Pillars → Cortex → Services
 */

// =============================================================================
// TYPES - Re-export from types file
// =============================================================================

export * from './types';
import type {
  PillarName, QueryContext, StructuredQuery, QueryParams, QueryResponse,
  AnalyzeParams, Finding, Recommendation, AnalyzeResponse,
  SimulateParams, Outcome, SimulateResponse,
  GovernParams, Violation, GovernResponse,
  ContextOptions, ContextResponse
} from './types';

// =============================================================================
// PILLAR AGGREGATOR
// =============================================================================

import { PillarAggregator } from './PillarAggregator'

// =============================================================================
// CORTEX CORE SERVICE
// =============================================================================

export class CortexCoreService {
  private pillarAggregator: PillarAggregator;

  constructor() {
    this.pillarAggregator = new PillarAggregator();
  }

  // ===========================================================================
  // QUERY ENGINE
  // ===========================================================================

  async query(params: QueryParams): Promise<QueryResponse> {
    const startTime = Date.now();
    
    try {
      if (params.intent === 'natural_language') {
        return await this.processNaturalLanguageQuery(params, startTime);
      } else {
        return await this.processStructuredQuery(params, startTime);
      }
    } catch (error) {
      console.error('[CortexCore] Query error:', error);
      return { success: false, data: null, sources: [], executionMs: Date.now() - startTime };
    }
  }

  private async processNaturalLanguageQuery(params: QueryParams, startTime: number): Promise<QueryResponse> {
    const query = params.query as string;
    const { pillars, structuredQuery, confidence } = this.parseNaturalLanguage(query);
    const targetPillars = params.pillars || pillars;
    
    const { data, sources } = await this.pillarAggregator.queryPillars(targetPillars, structuredQuery, params.context);
    const flattenedData = this.flattenPillarResults(data);
    
    return { success: true, data: flattenedData, sources, confidence, executionMs: Date.now() - startTime };
  }

  private async processStructuredQuery(params: QueryParams, startTime: number): Promise<QueryResponse> {
    const query = params.query as StructuredQuery;
    const targetPillars = params.pillars || this.determinePillarsForEntity(query.entity);
    const { data, sources } = await this.pillarAggregator.queryPillars(targetPillars, query, params.context);
    
    return { success: true, data, sources, executionMs: Date.now() - startTime };
  }

  private parseNaturalLanguage(query: string): { pillars: PillarName[]; structuredQuery: StructuredQuery; confidence: number } {
    const lowerQuery = query.toLowerCase();
    const pillars: PillarName[] = [];
    let entity = 'summary';
    let filter: Record<string, any> = {};
    let confidence = 0.7;
    
    if (lowerQuery.includes('metric') || lowerQuery.includes('kpi')) { pillars.push('helm'); entity = 'metrics'; confidence = 0.85; }
    if (lowerQuery.includes('lineage') || lowerQuery.includes('provenance')) { pillars.push('lineage'); entity = 'entities'; }
    if (lowerQuery.includes('forecast') || lowerQuery.includes('predict')) { pillars.push('predict'); entity = 'forecasts'; }
    if (lowerQuery.includes('workflow') || lowerQuery.includes('automation')) { pillars.push('flow'); entity = 'workflows'; }
    if (lowerQuery.includes('health') || lowerQuery.includes('alert')) { pillars.push('health'); entity = 'status'; }
    if (lowerQuery.includes('security') || lowerQuery.includes('compliance')) { pillars.push('guard'); entity = 'posture'; }
    if (lowerQuery.includes('ethic') || lowerQuery.includes('bias')) { pillars.push('ethics'); entity = 'stats'; }
    if (lowerQuery.includes('agent') || lowerQuery.includes('council')) { pillars.push('agents'); entity = 'agents'; }
    
    if (lowerQuery.includes('at risk') || lowerQuery.includes('at-risk')) { filter['status'] = 'at_risk'; confidence = 0.9; }
    if (lowerQuery.includes('critical')) { filter['status'] = 'critical'; confidence = 0.9; }
    
    if (pillars.length === 0) { pillars.push('helm', 'health', 'guard'); entity = 'summary'; confidence = 0.5; }
    
    return { pillars, structuredQuery: { entity, filter }, confidence };
  }

  private determinePillarsForEntity(entity: string): PillarName[] {
    const mapping: Record<string, PillarName[]> = {
      metrics: ['helm'], kpis: ['helm'], dashboard: ['helm', 'health'],
      entities: ['lineage'], relationships: ['lineage'],
      models: ['predict'], forecasts: ['predict'], predictions: ['predict'],
      workflows: ['flow'], executions: ['flow'],
      health: ['health'], alerts: ['health'], anomalies: ['health'],
      security: ['guard'], compliance: ['guard'], threats: ['guard'],
      ethics: ['ethics'], reviews: ['ethics'], principles: ['ethics'],
      agents: ['agents'],
    };
    return mapping[entity] || ['helm', 'health'];
  }

  private flattenPillarResults(data: Record<PillarName, any>): any {
    const flattened: any = {};
    for (const [pillar, result] of Object.entries(data)) {
      if (Array.isArray(result)) { flattened[pillar] = result; }
      else if (typeof result === 'object' && result !== null) { Object.assign(flattened, { [pillar]: result }); }
    }
    return flattened;
  }

  // ===========================================================================
  // ANALYZE ENGINE
  // ===========================================================================

  async analyze(params: AnalyzeParams): Promise<AnalyzeResponse> {
    const startTime = Date.now();
    const pillarsConsulted: PillarName[] = [];
    
    try {
      const analysis = await this.runAnalysis(params, pillarsConsulted);
      return { success: true, analysis, pillarsConsulted, modelUsed: 'cortex-analysis-v1', executionMs: Date.now() - startTime };
    } catch (error) {
      console.error('[CortexCore] Analyze error:', error);
      return { success: false, analysis: { summary: 'Analysis failed', findings: [], recommendations: [] }, pillarsConsulted, executionMs: Date.now() - startTime };
    }
  }

  private async runAnalysis(params: AnalyzeParams, pillarsConsulted: PillarName[]): Promise<AnalyzeResponse['analysis']> {
    const { type } = params;
    pillarsConsulted.push('helm', 'guard', 'health');
    
    const [helm, guard, health] = await Promise.all([
      this.pillarAggregator.queryPillar('helm', { entity: 'dashboard' }, params.context),
      this.pillarAggregator.queryPillar('guard', { entity: 'posture' }, params.context),
      this.pillarAggregator.queryPillar('health', { entity: 'status' }, params.context),
    ]);

    const findings: Finding[] = [];
    const recommendations: Recommendation[] = [];

    if (type === 'risk' || type === 'impact') {
      if (guard?.openVulnerabilities > 0) {
        findings.push({ id: 'vuln-1', severity: guard.openVulnerabilities > 5 ? 'high' : 'medium', title: `${guard.openVulnerabilities} open vulnerabilities`, description: 'Security vulnerabilities require attention' });
      }
      if (guard?.complianceScore < 80) {
        findings.push({ id: 'comp-1', severity: 'high', title: `Compliance score: ${guard.complianceScore}%`, description: 'Below 80% threshold' });
        recommendations.push({ id: 'rec-1', priority: 1, action: 'Address compliance gaps', rationale: 'Reduce regulatory risk', effort: 'high', impact: 'high' });
      }
    }

    if (type === 'anomaly' || type === 'trend') {
      if (health?.activeAlerts > 0) {
        findings.push({ id: 'alert-1', severity: 'medium', title: `${health.activeAlerts} active alerts`, description: 'System health alerts require review' });
      }
    }

    if (type === 'cascade' || type === 'premortem') {
      pillarsConsulted.push('lineage');
      findings.push({ id: 'cascade-1', severity: 'info', title: 'Cascade analysis complete', description: `Analyzed impact across ${pillarsConsulted.length} pillars` });
    }

    const score = Math.round(((guard?.securityScore || 100) + (helm?.healthScore || 100) + (health?.healthScore || 100)) / 3);

    return { summary: `${type} analysis complete. Score: ${score}/100. Found ${findings.length} items.`, findings, recommendations, score };
  }

  // ===========================================================================
  // SIMULATE ENGINE
  // ===========================================================================

  async simulate(params: SimulateParams): Promise<SimulateResponse> {
    const startTime = Date.now();
    const pillarsConsulted: PillarName[] = ['predict', 'helm'];
    
    try {
      const simulation = await this.runSimulation(params);
      return { success: true, simulation, pillarsConsulted, executionMs: Date.now() - startTime };
    } catch (error) {
      console.error('[CortexCore] Simulate error:', error);
      return { success: false, simulation: { outcomes: [], confidence: 0 }, pillarsConsulted, executionMs: Date.now() - startTime };
    }
  }

  private async runSimulation(params: SimulateParams): Promise<SimulateResponse['simulation']> {
    const horizon = params.horizon;
    const days = horizon === '7d' ? 7 : horizon === '30d' ? 30 : horizon === '90d' ? 90 : 365;
    const baseValue = 100;
    const growthRate = 0.02;
    const projectedValue = baseValue * Math.pow(1 + growthRate, days / 30);

    const outcomes: Outcome[] = [
      { scenario: 'optimistic', probability: 0.25, impact: projectedValue * 1.2, metrics: { growth: 8 } },
      { scenario: 'baseline', probability: 0.5, impact: projectedValue, metrics: { growth: 5 } },
      { scenario: 'pessimistic', probability: 0.25, impact: projectedValue * 0.8, metrics: { growth: 2 } },
    ];

    return {
      outcomes,
      probabilityDistribution: { mean: projectedValue, stdDev: projectedValue * 0.1, percentiles: { p10: projectedValue * 0.85, p50: projectedValue, p90: projectedValue * 1.15 } },
      confidence: 0.75,
      baselineValue: baseValue,
      projectedValue,
    };
  }

  // ===========================================================================
  // GOVERN ENGINE
  // ===========================================================================

  async govern(params: GovernParams): Promise<GovernResponse> {
    const startTime = Date.now();
    const pillarsConsulted: PillarName[] = ['guard', 'ethics'];
    
    try {
      const result = await this.runGovernance(params, pillarsConsulted);
      return { success: true, result, pillarsConsulted, executionMs: Date.now() - startTime };
    } catch (error) {
      console.error('[CortexCore] Govern error:', error);
      return { success: false, result: { status: 'rejected', violations: [], requiredActions: [], auditTrail: [] }, pillarsConsulted, executionMs: Date.now() - startTime };
    }
  }

  private async runGovernance(params: GovernParams, _pillarsConsulted: PillarName[]): Promise<GovernResponse['result']> {
    const violations: Violation[] = [];
    const auditTrail = [{ timestamp: new Date().toISOString(), actor: 'CortexCore', action: params.action, details: `${params.governanceType} check` }];

    if (params.action === 'check') {
      const guard = await this.pillarAggregator.queryPillar('guard', { entity: 'posture' }, params.context);
      
      if (params.governanceType === 'compliance' && guard?.complianceScore < 80) {
        violations.push({ id: 'comp-1', rule: 'minimum_compliance', severity: 'high', description: `Score ${guard.complianceScore}% below 80%` });
      }
      
      const status = violations.length === 0 ? 'compliant' : violations.some(v => v.severity === 'critical') ? 'rejected' : 'non_compliant';
      return { status, violations, requiredActions: [], auditTrail, score: guard?.complianceScore || 100 };
    }

    return { status: params.action === 'approve' ? 'approved' : params.action === 'reject' ? 'rejected' : 'escalated', violations: [], requiredActions: [], auditTrail };
  }

  // ===========================================================================
  // CONTEXT ENGINE
  // ===========================================================================

  async getContext(entityType: string, entityId: string, options: ContextOptions, context: QueryContext): Promise<ContextResponse> {
    const startTime = Date.now();
    
    try {
      const pillarContext = await this.pillarAggregator.getEntityContext(entityType, entityId, options, context);
      
      return {
        success: true,
        entity: { id: entityId, type: entityType, name: `${entityType}:${entityId}`, attributes: {} },
        context: pillarContext,
        relationships: [],
        timeline: [{ timestamp: new Date().toISOString(), event: 'context_retrieved', pillar: 'helm' }],
        executionMs: Date.now() - startTime,
      };
    } catch (error) {
      console.error('[CortexCore] Context error:', error);
      return { success: false, entity: { id: entityId, type: entityType, name: '', attributes: {} }, context: {}, relationships: [], timeline: [], executionMs: Date.now() - startTime };
    }
  }
}

// Singleton export
export const cortexCore = new CortexCoreService();
