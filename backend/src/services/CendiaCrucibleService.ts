/**
 * Service — Cendia Crucible Service
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports SCENARIO_TEMPLATES, cendiaCrucibleService, SimulationConfig, SimulationVariable, SimulationConstraint, VariableCorrelation, ScenarioDefinition, Shock
 * @module services/CendiaCrucibleService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaCrucibleÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ - Synthetic Multiverse Simulation Engine
 * 
 * "Synthetic Reality. Infinite Stress Testing. Failure Before It Happens."
 * 
 * High-fidelity mathematical twin of the enterprise that allows:
 * - Shock injection & black swan simulation
 * - Decision stress tests & strategy branching
 * - Monte Carlo outcome prediction
 * - Failure cascade propagation mapping
 * - Council deliberation replay
 */

import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { EnhancedLLMService } from './EnhancedLLMService.js';
import crypto from 'crypto';

// Re-export types from canonical module
export type {
  SimulationType, SimulationStatus, OutcomeSentiment, ImpactCategory, Severity,
  SimulationConfig, SimulationVariable, SimulationConstraint, VariableCorrelation,
  ScenarioDefinition, Shock, Trigger,
  SimulationResult, Universe, Impact, FailureCascade, CascadeNode,
  CouncilDeliberation, AgentResponse, ResultSummary, UniverseSummary,
  DigitalTwin, Department, System, KPI, EmployeeMetrics, FinancialSnapshot, Relationship,
} from './crucible/types.js';

import type {
  SimulationType, SimulationStatus, OutcomeSentiment, ImpactCategory, Severity,
  SimulationConfig, SimulationVariable, SimulationConstraint, VariableCorrelation,
  ScenarioDefinition, Shock,
  SimulationResult, Universe, Impact, FailureCascade, CascadeNode,
  CouncilDeliberation, AgentResponse, ResultSummary, UniverseSummary,
  DigitalTwin, Department, System, KPI, EmployeeMetrics, FinancialSnapshot, Relationship,
} from './crucible/types.js';

// Scenario Templates
export { SCENARIO_TEMPLATES } from './crucible/scenarioTemplates.js';

class CendiaCrucibleService {
  private llmService: EnhancedLLMService;

  constructor() {
    this.llmService = new EnhancedLLMService();
  }

  /**
   * Create a new simulation
   */
  async createSimulation(
    organizationId: string,
    userId: string,
    params: {
      name: string;
      description?: string;
      simulationType: SimulationType;
      config: SimulationConfig;
      scenarioDefinition: ScenarioDefinition;
    }
  ): Promise<any> {
    const id = crypto.randomUUID();
    
    // Capture current digital twin state
    const digitalTwin = await this.captureDigitalTwin(organizationId);
    
    const simulation = await prisma.crucible_simulations.create({
      data: {
        id,
        organization_id: organizationId,
        name: params.name,
        description: params.description,
        simulation_type: params.simulationType,
        status: 'DRAFT',
        config: params.config as any,
        digital_twin_snapshot: digitalTwin as any,
        scenario_definition: params.scenarioDefinition as any,
        monte_carlo_runs: params.config.monteCarloRuns,
        confidence_level: params.config.confidenceLevel,
        time_horizon_days: params.config.timeHorizonDays,
        created_by: userId,
        updated_at: new Date(),
      },
    });

    return simulation;
  }

  /**
   * Start simulation execution
   */
  async runSimulation(
    simulationId: string,
    options?: { mode?: 'express' | 'deliberative' }
  ): Promise<SimulationResult> {
    const mode = options?.mode || 'deliberative';

    // Update status to running
    await prisma.crucible_simulations.update({
      where: { id: simulationId },
      data: { 
        status: 'RUNNING',
        started_at: new Date(),
        updated_at: new Date(),
      },
    });

    try {
      const simulation = await prisma.crucible_simulations.findUnique({
        where: { id: simulationId },
      });

      if (!simulation) {
        throw new Error('Simulation not found');
      }

      const config = simulation.config as unknown as SimulationConfig;
      const scenario = simulation.scenario_definition as unknown as ScenarioDefinition;
      const digitalTwin = simulation.digital_twin_snapshot as unknown as DigitalTwin;

      // Run Monte Carlo simulation
      const universes = await this.runMonteCarloSimulation(
        simulationId,
        digitalTwin,
        scenario,
        config
      );

      // Calculate impacts
      const impacts = await this.calculateImpacts(
        simulationId,
        digitalTwin,
        universes
      );

      // Council deliberations: only in deliberative mode
      let deliberations: CouncilDeliberation[] = [];
      if (mode === 'deliberative') {
        deliberations = await this.generateCouncilDeliberations(
          simulationId,
          scenario,
          universes,
          impacts
        );
      }

      // Generate summary with AI-powered strategic analysis
      const summary = await this.generateResultSummary(
        universes, 
        impacts, 
        simulation.simulation_type as SimulationType
      );

      // Update simulation with results
      await prisma.crucible_simulations.update({
        where: { id: simulationId },
        data: {
          status: 'COMPLETED',
          completed_at: new Date(),
          results_summary: summary as any,
          updated_at: new Date(),
        },
      });

      return {
        simulationId,
        status: 'COMPLETED',
        universes,
        impacts,
        councilDeliberations: deliberations,
        summary,
      };
    } catch (error) {
      await prisma.crucible_simulations.update({
        where: { id: simulationId },
        data: { 
          status: 'FAILED',
          updated_at: new Date(),
        },
      });
      throw error;
    }
  }

  /**
   * Capture current state as digital twin - ALL REAL DATA
   */
  private async captureDigitalTwin(organizationId: string): Promise<DigitalTwin> {
    // Fetch ALL real data from database
    const [organization, metrics, dataSources, healthScores, users, workflows, alerts] = await Promise.all([
      prisma.organizations.findUnique({
        where: { id: organizationId },
      }),
      prisma.metric_definitions.findMany({
        where: { organization_id: organizationId },
        include: { metric_values: { take: 12, orderBy: { timestamp: 'desc' } } },
      }),
      prisma.data_sources.findMany({
        where: { organization_id: organizationId },
      }),
      prisma.health_scores.findMany({
        where: { organization_id: organizationId },
        take: 1,
        orderBy: { calculated_at: 'desc' },
      }),
      prisma.users.findMany({
        where: { organization_id: organizationId },
      }),
      prisma.workflows.findMany({
        where: { organization_id: organizationId },
      }),
      prisma.alerts.findMany({
        where: { organization_id: organizationId, status: 'ACTIVE' },
      }),
    ]);

    const latestHealth = healthScores[0];
    
    // Extract financial metrics from real metric data
    const financialMetrics = this.extractFinancialMetrics(metrics);
    
    // Extract employee metrics from real data
    const employeeMetrics = this.extractEmployeeMetrics(metrics, users, latestHealth);
    
    // Build departments from real users and workflows
    const departments = this.buildDepartmentsFromData(users, workflows, dataSources);
    
    // Build relationships from real data connections
    const relationships = this.buildRelationshipsFromData(dataSources, workflows, alerts);

    return {
      organizationId,
      snapshotTime: new Date(),
      organizationName: organization?.name || 'Unknown',
      industry: organization?.industry || 'Technology',
      departments,
      systems: this.mapDataSourcesToSystems(dataSources),
      kpis: this.mapMetricsToKPIs(metrics),
      employees: employeeMetrics,
      financials: financialMetrics,
      relationships,
      activeAlerts: alerts.length,
      activeWorkflows: workflows.filter(w => w.status === 'ACTIVE').length,
      dataSourceCount: dataSources.length,
      healthScore: latestHealth?.overall || 0,
    };
  }

  /**
   * Extract financial metrics from real metric definitions
   */
  private extractFinancialMetrics(metrics: any[]): DigitalTwin['financials'] {
    const getMetricValue = (code: string): number => {
      const metric = metrics.find(m => 
        m.code?.toLowerCase().includes(code.toLowerCase()) ||
        m.name?.toLowerCase().includes(code.toLowerCase())
      );
      if (metric?.metric_values?.[0]) {
        return metric.metric_values[0].value;
      }
      return 0;
    };

    const revenue = getMetricValue('revenue') || getMetricValue('arr') || getMetricValue('mrr') * 12;
    const costs = getMetricValue('cost') || getMetricValue('opex') || getMetricValue('expenses');
    const ebitda = revenue > 0 && costs > 0 ? revenue - costs : getMetricValue('ebitda') || getMetricValue('profit');
    const cashFlow = getMetricValue('cash') || getMetricValue('cashflow');
    const burnRate = getMetricValue('burn') || (costs > 0 ? costs / 12 : 0);
    const runway = burnRate > 0 && cashFlow > 0 ? Math.round(cashFlow / burnRate) : 0;

    return {
      revenue,
      ebitda,
      cashFlow,
      burnRate,
      runway,
      // Additional real metrics
      grossMargin: getMetricValue('margin') || (revenue > 0 ? ((revenue - costs) / revenue) * 100 : 0),
      customerAcquisitionCost: getMetricValue('cac'),
      lifetimeValue: getMetricValue('ltv') || getMetricValue('clv'),
      churnRate: getMetricValue('churn'),
    };
  }

  /**
   * Extract employee metrics from real data
   */
  private extractEmployeeMetrics(metrics: any[], users: any[], healthScore: any): DigitalTwin['employees'] {
    const getMetricValue = (code: string): number => {
      const metric = metrics.find(m => 
        m.code?.toLowerCase().includes(code.toLowerCase()) ||
        m.name?.toLowerCase().includes(code.toLowerCase())
      );
      return metric?.metric_values?.[0]?.value || 0;
    };

    const totalHeadcount = users.length || getMetricValue('headcount') || getMetricValue('employees');
    
    // Calculate average tenure from user created_at dates
    const now = new Date();
    const tenures = users.map(u => {
      const created = new Date(u.created_at);
      return (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24 * 365);
    });
    const averageTenure = tenures.length > 0 
      ? tenures.reduce((a, b) => a + b, 0) / tenures.length 
      : 0;

    return {
      totalHeadcount,
      averageTenure: Math.round(averageTenure * 10) / 10,
      turnoverRate: getMetricValue('turnover') || getMetricValue('attrition') || 0,
      engagementScore: healthScore?.people_score || getMetricValue('engagement') || 0,
      productivityIndex: getMetricValue('productivity') || (healthScore?.operations_score || 0) / 100,
      // Additional real metrics
      hiringRate: getMetricValue('hiring') || 0,
      trainingHours: getMetricValue('training') || 0,
      satisfactionScore: getMetricValue('satisfaction') || getMetricValue('enps') || 0,
    };
  }

  /**
   * Build departments from real user and workflow data
   */
  private buildDepartmentsFromData(users: any[], workflows: any[], dataSources: any[]): Department[] {
    // Group users by role to infer departments
    const roleGroups: Record<string, any[]> = {};
    users.forEach(user => {
      const dept = this.inferDepartmentFromRole(user.role);
      if (!roleGroups[dept]) roleGroups[dept] = [];
      roleGroups[dept].push(user);
    });

    // Map workflow categories to departments
    const workflowsByDept: Record<string, number> = {};
    workflows.forEach(wf => {
      const dept = wf.category || 'Operations';
      workflowsByDept[dept] = (workflowsByDept[dept] || 0) + 1;
    });

    // Map data sources to departments
    const dataSourcesByDept: Record<string, number> = {};
    dataSources.forEach(ds => {
      const dept = this.inferDepartmentFromDataSource(ds.type);
      dataSourcesByDept[dept] = (dataSourcesByDept[dept] || 0) + 1;
    });

    // Build department list from real data
    const allDepts = new Set([
      ...Object.keys(roleGroups),
      ...Object.keys(workflowsByDept),
      ...Object.keys(dataSourcesByDept),
    ]);

    return Array.from(allDepts).map(name => ({
      name,
      headcount: roleGroups[name]?.length || 0,
      workflows: workflowsByDept[name] || 0,
      dataSources: dataSourcesByDept[name] || 0,
      budget: 0, // Would need budget table
      riskLevel: this.calculateDeptRiskLevel(roleGroups[name]?.length || 0, workflowsByDept[name] || 0),
    }));
  }

  /**
   * Build relationships from real data connections
   */
  private buildRelationshipsFromData(dataSources: any[], workflows: any[], alerts: any[]): Relationship[] {
    const relationships: Relationship[] = [];

    // Data source dependencies
    dataSources.forEach(ds => {
      if (ds.status === 'CONNECTED') {
        relationships.push({
          type: 'data_dependency',
          source: ds.name,
          target: 'Analytics',
          strength: ds.sync_frequency === 'real-time' ? 1.0 : 0.7,
          critical: ds.type === 'database' || ds.type === 'erp',
        });
      }
    });

    // Workflow connections
    workflows.forEach(wf => {
      const definition = wf.definition as any;
      if (definition?.nodes) {
        definition.nodes.forEach((node: any, idx: number) => {
          if (idx > 0) {
            relationships.push({
              type: 'workflow',
              source: definition.nodes[idx - 1].id || `step_${idx - 1}`,
              target: node.id || `step_${idx}`,
              strength: 0.9,
              critical: wf.status === 'ACTIVE',
            });
          }
        });
      }
    });

    // Alert correlations
    const alertsByType: Record<string, number> = {};
    alerts.forEach(alert => {
      alertsByType[alert.type] = (alertsByType[alert.type] || 0) + 1;
    });

    Object.entries(alertsByType).forEach(([type, count]) => {
      if (count > 1) {
        relationships.push({
          type: 'alert_correlation',
          source: type,
          target: 'Risk',
          strength: Math.min(count / 10, 1.0),
          critical: count >= 3,
        });
      }
    });

    return relationships;
  }

  /**
   * Infer department from user role
   */
  private inferDepartmentFromRole(role: string): string {
    const roleMap: Record<string, string> = {
      'SUPER_ADMIN': 'Executive',
      'ADMIN': 'IT',
      'ANALYST': 'Analytics',
      'VIEWER': 'Operations',
      'DEVELOPER': 'Engineering',
      'FINANCE': 'Finance',
      'HR': 'Human Resources',
      'SALES': 'Sales',
      'MARKETING': 'Marketing',
      'SUPPORT': 'Customer Success',
    };
    return roleMap[role] || 'Operations';
  }

  /**
   * Infer department from data source type
   */
  private inferDepartmentFromDataSource(type: string): string {
    const typeMap: Record<string, string> = {
      'database': 'Engineering',
      'api': 'Engineering',
      'file': 'Operations',
      'erp': 'Finance',
      'crm': 'Sales',
      'hris': 'Human Resources',
      'analytics': 'Analytics',
    };
    return typeMap[type?.toLowerCase()] || 'Operations';
  }

  /**
   * Calculate department risk level based on data
   */
  private calculateDeptRiskLevel(headcount: number, workflows: number): 'low' | 'medium' | 'high' | 'critical' {
    if (headcount === 0 && workflows > 0) return 'high'; // Understaffed
    if (headcount === 1 && workflows > 3) return 'high'; // Single point of failure
    if (workflows === 0) return 'medium'; // No automation
    return 'low';
  }

  /**
   * Run Monte Carlo simulation to generate parallel universes
   */
  private async runMonteCarloSimulation(
    simulationId: string,
    digitalTwin: DigitalTwin,
    scenario: ScenarioDefinition,
    config: SimulationConfig
  ): Promise<Universe[]> {
    const universes: Universe[] = [];
    const numUniverses = Math.min(config.monteCarloRuns, 12); // Cap at 12 for performance

    for (let i = 0; i < numUniverses; i++) {
      const universe = await this.generateUniverse(
        simulationId,
        i,
        digitalTwin,
        scenario,
        config
      );
      universes.push(universe);
    }

    // Sort by probability
    universes.sort((a, b) => b.probability - a.probability);

    return universes;
  }

  /**
   * Generate a single universe with probabilistic outcomes
   */
  private async generateUniverse(
    simulationId: string,
    universeNumber: number,
    digitalTwin: DigitalTwin,
    scenario: ScenarioDefinition,
    config: SimulationConfig
  ): Promise<Universe> {
    const id = crypto.randomUUID();
    
    // Apply shocks with random variation
    const kpiProjections: Record<string, number> = {};
    const riskScores: Record<string, number> = {};

    // Calculate base KPI changes from shocks
    for (const kpi of digitalTwin.kpis) {
      let projectedValue = kpi.value;
      
      // Apply relevant shocks
      for (const shock of scenario.shocks) {
        if (this.shockAffectsKPI(shock.target, kpi.code)) {
          projectedValue = this.applyShock(projectedValue, shock, config);
        }
      }

      // Add Monte Carlo randomness (normal distribution)
      const randomFactor = this.gaussianRandom(1, 0.15); // Mean 1, StdDev 15%
      projectedValue *= randomFactor;
      
      kpiProjections[kpi.code] = Math.max(0, projectedValue);
    }

    // Calculate risk scores
    const categories = ['financial', 'operational', 'security', 'compliance', 'cultural'];
    for (const category of categories) {
      riskScores[category] = this.calculateCategoryRisk(category, kpiProjections, scenario);
    }

    // Determine overall outcome
    const overallChange = this.calculateOverallChange(digitalTwin.kpis, kpiProjections);
    const sentiment = this.determineSentiment(overallChange, riskScores);
    const probability = this.calculateProbability(universeNumber, numUniverses);

    // Generate summary using fast template (no LLM for speed)
    const outcomeSummary = this.generateFastSummary(scenario, sentiment, overallChange, riskScores);

    // Save universe to database FIRST (before creating failure cascades)
    await prisma.crucible_universes.create({
      data: {
        id,
        simulation_id: simulationId,
        universe_number: universeNumber,
        probability,
        state_snapshot: { ...digitalTwin, kpis: kpiProjections } as any,
        kpi_projections: kpiProjections as any,
        risk_scores: riskScores as any,
        outcome_summary: outcomeSummary,
        outcome_sentiment: sentiment,
      },
    });

    // Create failure cascades AFTER universe exists (foreign key constraint)
    const failureCascades = sentiment === 'CATASTROPHIC' || sentiment === 'NEGATIVE'
      ? await this.generateFailureCascades(id, digitalTwin, scenario)
      : [];

    return {
      id,
      universeNumber,
      probability,
      kpiProjections,
      riskScores,
      outcomeSummary,
      outcomeSentiment: sentiment,
      failureCascades,
    };
  }

  /**
   * Calculate impacts across the organization
   */
  private async calculateImpacts(
    simulationId: string,
    digitalTwin: DigitalTwin,
    universes: Universe[]
  ): Promise<Impact[]> {
    const impacts: Impact[] = [];
    const categories: ImpactCategory[] = [
      'FINANCIAL', 'OPERATIONAL', 'SECURITY', 
      'COMPLIANCE', 'CULTURAL', 'REPUTATIONAL', 
      'STRATEGIC', 'TECHNOLOGICAL'
    ];

    // Aggregate across most likely universes
    const topUniverses = universes.slice(0, 10);

    for (const category of categories) {
      const categoryImpacts = this.calculateCategoryImpacts(
        category,
        digitalTwin,
        topUniverses
      );

      for (const impact of categoryImpacts) {
        const id = crypto.randomUUID();
        
        await prisma.crucible_impacts.create({
          data: {
            id,
            simulation_id: simulationId,
            impact_category: category,
            entity_type: impact.entityType,
            entity_name: impact.entityName,
            baseline_value: impact.baselineValue,
            projected_value: impact.projectedValue,
            change_percent: impact.changePercent,
            confidence: impact.confidence,
            severity: impact.severity,
            description: impact.description,
            propagation_path: impact.propagationPath as any,
          },
        });

        impacts.push({ ...impact, id, category });
      }
    }

    return impacts;
  }

  /**
   * Generate Council AI deliberations on the scenario
   */
  private async generateCouncilDeliberations(
    simulationId: string,
    scenario: ScenarioDefinition,
    universes: Universe[],
    impacts: Impact[]
  ): Promise<CouncilDeliberation[]> {
    const deliberations: CouncilDeliberation[] = [];

    // Generate deliberation for the overall scenario
    const scenarioContext = this.buildScenarioContext(scenario, universes, impacts);
    
    const agentResponses = await this.getCouncilResponses(scenarioContext);
    
    const consensusAnalysis = this.analyzeConsensus(agentResponses);

    const id = crypto.randomUUID();

    await prisma.crucible_council_deliberations.create({
      data: {
        id,
        simulation_id: simulationId,
        scenario_context: scenarioContext,
        agent_responses: agentResponses as any,
        consensus_reached: consensusAnalysis.consensusReached,
        final_recommendation: consensusAnalysis.recommendation,
        confidence_score: consensusAnalysis.confidence,
        deliberation_log: { responses: agentResponses } as any,
      },
    });

    deliberations.push({
      id,
      scenarioContext,
      agentResponses,
      consensusReached: consensusAnalysis.consensusReached,
      finalRecommendation: consensusAnalysis.recommendation,
      confidenceScore: consensusAnalysis.confidence,
    });

    return deliberations;
  }

  /**
   * Get responses from Council AI agents (reduced for speed)
   */
  private async getCouncilResponses(context: string): Promise<AgentResponse[]> {
    // Use only 2 key agents for speed, run in parallel
    const agents = [
      { role: 'CEO', focus: 'strategic vision and business impact' },
      { role: 'Risk Officer', focus: 'risk assessment and mitigation' },
    ];

    // Run agent analyses in parallel for speed
    const agentPromises = agents.map(async (agent) => {
      const prompt = `As ${agent.role}, analyze this scenario briefly:
${context}

Respond with: 1) Key finding, 2) Main recommendation, 3) Primary risk, 4) Confidence (0-100%)`;

      try {
        const response = await this.llmService.generate(prompt, {
          model: 'llama3.2:3b', // Fast 3B model for quick analysis
          systemPrompt: `You are ${agent.role}. Focus: ${agent.focus}. Be concise.`,
          temperature: 0.5,
          maxTokens: 200,
        });

        return {
          agentRole: agent.role,
          analysis: this.extractAnalysis(response),
          recommendation: this.extractRecommendation(response),
          riskAssessment: this.extractRiskAssessment(response),
          confidenceLevel: this.extractConfidenceLevel(response),
        };
      } catch (error) {
        logger.error(`Council AI ${agent.role} failed:`, error);
        return {
          agentRole: agent.role,
          analysis: `[LLM unavailable] ${agent.role} analysis for ${agent.focus} requires manual review.`,
          recommendation: 'Consult domain experts for detailed assessment',
          riskAssessment: `${agent.focus} - requires human evaluation`,
          confidenceLevel: 50,
        };
      }
    });

    const results = await Promise.all(agentPromises);
    return results;
  }

  /**
   * Generate summary of simulation results with AI-powered strategic analysis
   */
  private async generateResultSummary(
    universes: Universe[],
    impacts: Impact[],
    simulationType: SimulationType
  ): Promise<ResultSummary> {
    const sortedByOutcome = [...universes].sort((a, b) => {
      const sentimentOrder = { OPTIMAL: 4, POSITIVE: 3, NEUTRAL: 2, NEGATIVE: 1, CATASTROPHIC: 0 };
      return sentimentOrder[b.outcomeSentiment] - sentimentOrder[a.outcomeSentiment];
    });

    const bestCase = sortedByOutcome[0];
    const worstCase = sortedByOutcome[sortedByOutcome.length - 1];
    const mostLikely = universes.reduce((prev, curr) => 
      curr.probability > prev.probability ? curr : prev
    );

    // Generate AI-powered strategic risks and opportunities
    const { keyRisks, keyOpportunities } = await this.generateStrategicAnalysis(
      impacts,
      simulationType,
      mostLikely
    );

    return {
      totalUniverses: universes.length,
      bestCase: {
        universeId: bestCase.id,
        probability: bestCase.probability,
        sentiment: bestCase.outcomeSentiment,
        summary: bestCase.outcomeSummary,
      },
      worstCase: {
        universeId: worstCase.id,
        probability: worstCase.probability,
        sentiment: worstCase.outcomeSentiment,
        summary: worstCase.outcomeSummary,
      },
      mostLikely: {
        universeId: mostLikely.id,
        probability: mostLikely.probability,
        sentiment: mostLikely.outcomeSentiment,
        summary: mostLikely.outcomeSummary,
      },
      keyRisks,
      keyOpportunities,
      overallConfidence: this.calculateOverallConfidence(universes),
    };
  }

  /**
   * Generate strategic risk and opportunity analysis using AI
   */
  private async generateStrategicAnalysis(
    impacts: Impact[],
    simulationType: SimulationType,
    mostLikelyUniverse: Universe
  ): Promise<{ keyRisks: string[]; keyOpportunities: string[] }> {
    const criticalImpacts = impacts.filter(i => i.severity === 'CRITICAL' || i.severity === 'HIGH');
    const negativeImpacts = criticalImpacts.filter(i => (i.changePercent || 0) < 0);
    const positiveImpacts = impacts.filter(i => (i.changePercent || 0) > 5);

    // Build context for AI analysis
    const impactContext = negativeImpacts
      .map(i => `${i.entityName}: ${i.changePercent?.toFixed(1)}% (${i.severity})`)
      .join(', ');
    
    const opportunityContext = positiveImpacts
      .map(i => `${i.entityName}: +${i.changePercent?.toFixed(1)}%`)
      .join(', ');

    try {
      // Generate strategic risks using AI
      const riskPrompt = `You are a strategic risk analyst. Based on a ${simulationType.replace(/_/g, ' ')} scenario simulation with outcome "${mostLikelyUniverse.outcomeSentiment}", analyze these impacts and provide 4 strategic risks (not just restating percentages, but strategic implications):

CRITICAL IMPACTS: ${impactContext || 'No critical negative impacts'}
OUTCOME PROBABILITY: ${(mostLikelyUniverse.probability * 100).toFixed(1)}%

Provide exactly 4 strategic risk statements. Each should be actionable and specific. Format as a JSON array of strings.`;

      const opportunityPrompt = `You are a strategic opportunity analyst. Based on a ${simulationType.replace(/_/g, ' ')} scenario simulation, identify strategic opportunities from these potential improvements:

POSITIVE INDICATORS: ${opportunityContext || 'Limited positive indicators in this scenario'}
SCENARIO TYPE: ${simulationType.replace(/_/g, ' ')}

Provide exactly 3 strategic opportunity statements. Each should be actionable and specific. Format as a JSON array of strings.`;

      const [riskResponse, opportunityResponse] = await Promise.all([
        this.llmService.generate(riskPrompt, { maxTokens: 500, temperature: 0.3 }),
        this.llmService.generate(opportunityPrompt, { maxTokens: 400, temperature: 0.3 }),
      ]);

      // Parse AI responses
      const keyRisks = this.parseJsonArray(riskResponse) || this.getFallbackRisks(negativeImpacts);
      const keyOpportunities = this.parseJsonArray(opportunityResponse) || this.getFallbackOpportunities(positiveImpacts);

      return { keyRisks: keyRisks.slice(0, 5), keyOpportunities: keyOpportunities.slice(0, 4) };
    } catch (error) {
      logger.warn('[CendiaCrucible] AI analysis failed, using basic analysis', { error });
      // Fallback to basic analysis if AI fails
      return {
        keyRisks: this.getFallbackRisks(negativeImpacts),
        keyOpportunities: this.getFallbackOpportunities(positiveImpacts),
      };
    }
  }

  /**
   * Parse JSON array from AI response
   */
  private parseJsonArray(response: string): string[] | null {
    try {
      // Try to extract JSON array from response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
          return parsed;
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Fallback risk generation when AI is unavailable
   */
  private getFallbackRisks(negativeImpacts: Impact[]): string[] {
    return negativeImpacts.slice(0, 4).map(i => {
      const severity = i.severity === 'CRITICAL' ? 'Critical' : 'Significant';
      return `${severity} ${i.entityName.toLowerCase()} degradation may trigger cascading effects across dependent systems`;
    });
  }

  /**
   * Fallback opportunity generation when AI is unavailable
   */
  private getFallbackOpportunities(positiveImpacts: Impact[]): string[] {
    if (positiveImpacts.length === 0) {
      return ['Crisis response preparation strengthens organizational resilience'];
    }
    return positiveImpacts.slice(0, 3).map(i => 
      `Leverage ${i.entityName.toLowerCase()} improvement to accelerate strategic initiatives`
    );
  }

  /**
   * Get simulation by ID
   */
  async getSimulation(simulationId: string) {
    return prisma.crucible_simulations.findUnique({
      where: { id: simulationId },
      include: {
        universes: {
          orderBy: { probability: 'desc' },
          take: 20,
        },
        impacts: {
          orderBy: { severity: 'asc' },
        },
        council_deliberations: true,
      },
    });
  }

  /**
   * List simulations for organization
   */
  async listSimulations(organizationId: string, options?: {
    status?: SimulationStatus;
    type?: SimulationType;
    limit?: number;
    offset?: number;
  }) {
    const where: any = { organization_id: organizationId };
    if (options?.status) where.status = options.status;
    if (options?.type) where.simulation_type = options.type;

    return prisma.crucible_simulations.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take: options?.limit || 20,
      skip: options?.offset || 0,
      include: {
        users: { select: { id: true, name: true } },
      },
    });
  }

  /**
   * Get scenario templates
   */
  getScenarioTemplates(): Record<SimulationType, ScenarioDefinition> {
    return SCENARIO_TEMPLATES;
  }

  // Helper methods for mapping database data to simulation structures
  private mapDataSourcesToSystems(dataSources: any[]): System[] {
    return dataSources.map(ds => ({
      id: ds.id,
      name: ds.name,
      type: ds.type,
      status: ds.status,
      criticality: ds.type === 'database' || ds.type === 'erp' ? 0.95 : 0.7,
      uptime: ds.status === 'CONNECTED' ? 99.9 : 0,
      lastSync: ds.last_sync_at,
      dependencies: [],
    }));
  }

  private mapMetricsToKPIs(metrics: any[]): KPI[] {
    return metrics.map(m => {
      // Calculate trend from historical values
      const values = m.metric_values || [];
      let trend = 0;
      if (values.length >= 2) {
        const current = values[0]?.value || 0;
        const previous = values[1]?.value || 0;
        trend = previous !== 0 ? ((current - previous) / previous) * 100 : 0;
      }

      return {
        code: m.code,
        name: m.name,
        value: values[0]?.value || 0,
        target: (m.thresholds as any)?.target || 100,
        trend: Math.round(trend * 10) / 10,
        unit: m.unit,
        category: m.category,
      };
    });
  }

  private shockAffectsKPI(shockTarget: string, kpiCode: string): boolean {
    const targetMap: Record<string, string[]> = {
      revenue: ['revenue_growth', 'revenue', 'sales'],
      operating_costs: ['operating_margin', 'ebitda', 'costs'],
      throughput: ['productivity', 'efficiency', 'system_uptime'],
      employee_engagement: ['employee_engagement', 'people_score', 'turnover'],
      security_score: ['security_score', 'compliance'],
      all_operations: ['*'],
    };

    const affectedKPIs = targetMap[shockTarget] || [];
    return affectedKPIs.includes('*') || affectedKPIs.some(k => kpiCode.includes(k));
  }

  private applyShock(value: number, shock: Shock, config: SimulationConfig): number {
    switch (shock.type) {
      case 'percentage':
        return value * (1 + shock.value / 100);
      case 'multiplier':
        return value * shock.value;
      case 'absolute':
        return shock.value;
      default:
        return value;
    }
  }

  private gaussianRandom(mean: number, stdDev: number): number {
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + z * stdDev;
  }

  private calculateCategoryRisk(
    category: string,
    kpiProjections: Record<string, number>,
    scenario: ScenarioDefinition
  ): number {
    // Base risk from scenario type
    let risk = 50;

    // Adjust based on KPI changes
    for (const [kpi, value] of Object.entries(kpiProjections)) {
      if (value < 70) risk += 10;
      if (value < 50) risk += 20;
    }

    return Math.min(100, Math.max(0, risk));
  }

  private calculateOverallChange(
    baseKPIs: KPI[],
    projections: Record<string, number>
  ): number {
    let totalChange = 0;
    let count = 0;

    for (const kpi of baseKPIs) {
      const projected = projections[kpi.code];
      if (projected !== undefined) {
        totalChange += (projected - kpi.value) / kpi.value * 100;
        count++;
      }
    }

    return count > 0 ? totalChange / count : 0;
  }

  private determineSentiment(
    overallChange: number,
    riskScores: Record<string, number>
  ): OutcomeSentiment {
    const avgRisk = Object.values(riskScores).reduce((a, b) => a + b, 0) / Object.keys(riskScores).length;

    if (overallChange < -50 || avgRisk > 85) return 'CATASTROPHIC';
    if (overallChange < -20 || avgRisk > 70) return 'NEGATIVE';
    if (overallChange > 20 && avgRisk < 40) return 'OPTIMAL';
    if (overallChange > 5 && avgRisk < 55) return 'POSITIVE';
    return 'NEUTRAL';
  }

  private calculateProbability(index: number, total: number): number {
    // Bell curve distribution
    const normalized = (index - total / 2) / (total / 4);
    return Math.exp(-0.5 * normalized * normalized) / Math.sqrt(2 * Math.PI);
  }

  /**
   * Fast template-based summary (no LLM call)
   */
  private generateFastSummary(
    scenario: ScenarioDefinition,
    sentiment: OutcomeSentiment,
    overallChange: number,
    riskScores: Record<string, number>
  ): string {
    const avgRisk = Object.values(riskScores).reduce((a, b) => a + b, 0) / Object.keys(riskScores).length;
    const changeDir = overallChange > 0 ? 'improvement' : 'decline';
    const riskLevel = avgRisk > 70 ? 'critical' : avgRisk > 50 ? 'elevated' : avgRisk > 30 ? 'moderate' : 'low';
    
    const templates: Record<OutcomeSentiment, string[]> = {
      CATASTROPHIC: [
        `Severe ${scenario.name} impact with ${Math.abs(overallChange).toFixed(1)}% ${changeDir}. ${riskLevel} risk across all domains.`,
        `Critical failure scenario: ${scenario.description}. Organization faces existential threat.`,
        `Worst-case outcome realized. Immediate intervention required to prevent collapse.`,
      ],
      NEGATIVE: [
        `${scenario.name} results in ${Math.abs(overallChange).toFixed(1)}% ${changeDir}. ${riskLevel} risk requires attention.`,
        `Adverse impact from ${scenario.description}. Key metrics degraded significantly.`,
        `Below baseline performance. Recovery plan needed for affected areas.`,
      ],
      NEUTRAL: [
        `${scenario.name} impact contained. ${Math.abs(overallChange).toFixed(1)}% variance with ${riskLevel} risk.`,
        `Mixed outcomes from ${scenario.description}. Some areas resilient, others stressed.`,
        `Baseline maintained despite stress. Monitoring recommended.`,
      ],
      POSITIVE: [
        `${scenario.name} handled well. ${Math.abs(overallChange).toFixed(1)}% ${changeDir} with ${riskLevel} risk.`,
        `Organization demonstrates resilience to ${scenario.description}.`,
        `Above-baseline performance. Contingency plans effective.`,
      ],
      OPTIMAL: [
        `Best-case outcome: ${Math.abs(overallChange).toFixed(1)}% improvement despite ${scenario.name}.`,
        `Exceptional resilience shown. ${scenario.description} converted to opportunity.`,
        `Organization thrives under stress. Strong competitive position maintained.`,
      ],
    };

    const options = templates[sentiment];
    return options[0];
  }

  private async generateOutcomeSummary(
    scenario: ScenarioDefinition,
    kpiProjections: Record<string, number>,
    riskScores: Record<string, number>,
    sentiment: OutcomeSentiment
  ): Promise<string> {
    const prompt = `Summarize this simulation outcome in 2-3 sentences:
Scenario: ${scenario.name}
Sentiment: ${sentiment}
Key KPI changes: ${JSON.stringify(kpiProjections)}
Risk levels: ${JSON.stringify(riskScores)}`;

    try {
      const response = await this.llmService.generate(prompt, {
        systemPrompt: 'You are a business analyst summarizing simulation results concisely.',
        maxTokens: 150,
      });
      return response;
    } catch {
      return `${sentiment} outcome projected. ${scenario.description}. Key metrics show significant variance from baseline.`;
    }
  }

  private async generateFailureCascades(
    universeId: string,
    digitalTwin: DigitalTwin,
    scenario: ScenarioDefinition
  ): Promise<FailureCascade[]> {
    const cascades: FailureCascade[] = [];

    for (const shock of scenario.shocks) {
      const id = crypto.randomUUID();
      const affectedNodes = this.propagateFailure(shock.target, digitalTwin);

      await prisma.crucible_failure_cascades.create({
        data: {
          id,
          universe_id: universeId,
          trigger_event: `${shock.target} shock: ${shock.value}${shock.type === 'percentage' ? '%' : ''}`,
          cascade_depth: affectedNodes.length,
          affected_nodes: affectedNodes as any,
          propagation_time: shock.duration || 24,
          total_impact: affectedNodes.reduce((sum, n) => sum + n.impactLevel, 0),
        },
      });

      cascades.push({
        id,
        triggerEvent: shock.target,
        cascadeDepth: affectedNodes.length,
        affectedNodes,
        propagationTime: shock.duration,
        totalImpact: affectedNodes.reduce((sum, n) => sum + n.impactLevel, 0),
      });
    }

    return cascades;
  }

  private propagateFailure(triggerTarget: string, digitalTwin: DigitalTwin): CascadeNode[] {
    const nodes: CascadeNode[] = [];
    const visited = new Set<string>();

    const propagate = (nodeId: string, depth: number, impactMultiplier: number) => {
      if (visited.has(nodeId) || depth > 5) return;
      visited.add(nodeId);

      const dept = digitalTwin.departments.find(d => d.name === nodeId);
      if (dept) {
        nodes.push({
          nodeId: dept.name,
          nodeName: dept.name,
          nodeType: 'department',
          impactLevel: impactMultiplier * 100 / (depth + 1),
          timeToImpact: depth * 24,
          dependencies: dept.dependencies || [],
        });

        for (const depName of (dept.dependencies || [])) {
          propagate(depName, depth + 1, impactMultiplier * 0.7);
        }
      }
    };

    // Start propagation from affected area
    for (const dept of digitalTwin.departments) {
      if (dept.name.toLowerCase().includes(triggerTarget.toLowerCase())) {
        propagate(dept.name, 0, 1);
      }
    }

    return nodes;
  }

  private calculateCategoryImpacts(
    category: ImpactCategory,
    digitalTwin: DigitalTwin,
    universes: Universe[]
  ): Omit<Impact, 'id' | 'category'>[] {
    const impacts: Omit<Impact, 'id' | 'category'>[] = [];

    // Aggregate projections across universes
    const entities = this.getEntitiesForCategory(category, digitalTwin);

    for (const entity of entities) {
      const projections = universes.map(u => u.kpiProjections[entity.id] || entity.baseline);
      const avgProjection = projections.reduce((a, b) => a + b, 0) / projections.length;
      const changePercent = ((avgProjection - entity.baseline) / entity.baseline) * 100;

      impacts.push({
        entityType: entity.type,
        entityName: entity.name,
        baselineValue: entity.baseline,
        projectedValue: avgProjection,
        changePercent,
        confidence: 0.85,
        severity: this.determineSeverity(changePercent),
        description: `Projected ${changePercent > 0 ? 'increase' : 'decrease'} of ${Math.abs(changePercent).toFixed(1)}%`,
        propagationPath: entity.dependencies,
      });
    }

    return impacts;
  }

  private getEntitiesForCategory(category: ImpactCategory, digitalTwin: DigitalTwin) {
    const entities: { id: string; name: string; type: string; baseline: number; dependencies: string[] }[] = [];

    switch (category) {
      case 'FINANCIAL':
        entities.push(
          { id: 'revenue', name: 'Revenue', type: 'metric', baseline: digitalTwin.financials.revenue, dependencies: ['sales', 'marketing'] },
          { id: 'ebitda', name: 'EBITDA', type: 'metric', baseline: digitalTwin.financials.ebitda, dependencies: ['revenue', 'costs'] },
        );
        break;
      case 'OPERATIONAL':
        for (const dept of digitalTwin.departments) {
          entities.push({
            id: dept.name, // Use name as id
            name: dept.name,
            type: 'department',
            baseline: (dept.efficiency || 0.75) * 100,
            dependencies: dept.dependencies || [],
          });
        }
        break;
      case 'SECURITY':
        for (const sys of digitalTwin.systems) {
          entities.push({
            id: sys.id,
            name: sys.name,
            type: 'system',
            baseline: sys.uptime || 99,
            dependencies: sys.dependencies || [],
          });
        }
        break;
      case 'CULTURAL':
        entities.push(
          { id: 'engagement', name: 'Employee Engagement', type: 'metric', baseline: digitalTwin.employees.engagementScore, dependencies: [] },
          { id: 'turnover', name: 'Turnover Rate', type: 'metric', baseline: (1 - digitalTwin.employees.turnoverRate) * 100, dependencies: [] },
        );
        break;
      default:
        // Generic entities for other categories
        entities.push({
          id: category.toLowerCase(),
          name: `${category} Index`,
          type: 'index',
          baseline: 75,
          dependencies: [],
        });
    }

    return entities;
  }

  private determineSeverity(changePercent: number): Severity {
    const absChange = Math.abs(changePercent);
    if (absChange > 50) return 'CRITICAL';
    if (absChange > 30) return 'HIGH';
    if (absChange > 15) return 'MEDIUM';
    if (absChange > 5) return 'LOW';
    return 'MINIMAL';
  }

  private buildScenarioContext(
    scenario: ScenarioDefinition,
    universes: Universe[],
    impacts: Impact[]
  ): string {
    const topUniverse = universes[0];
    const criticalImpacts = impacts.filter(i => i.severity === 'CRITICAL' || i.severity === 'HIGH');

    return `
SCENARIO: ${scenario.name}
${scenario.description}

SIMULATION RESULTS:
- Total universes analyzed: ${universes.length}
- Most likely outcome: ${topUniverse.outcomeSentiment}
- Probability: ${(topUniverse.probability * 100).toFixed(1)}%

KEY IMPACTS:
${criticalImpacts.map(i => `- ${i.entityName}: ${i.changePercent?.toFixed(1)}% change (${i.severity})`).join('\n')}

PROJECTED KPIs:
${Object.entries(topUniverse.kpiProjections).map(([k, v]) => `- ${k}: ${typeof v === 'number' ? v.toFixed(1) : v}`).join('\n')}
`;
  }

  private analyzeConsensus(responses: AgentResponse[]): {
    consensusReached: boolean;
    recommendation: string;
    confidence: number;
  } {
    const avgConfidence = responses.reduce((sum, r) => sum + r.confidenceLevel, 0) / responses.length;
    const recommendations = responses.map(r => r.recommendation);
    
    // Simple consensus check - ROADMAP: use more sophisticated NLP
    const consensusReached = avgConfidence > 70;

    return {
      consensusReached,
      recommendation: recommendations[0] || 'Proceed with caution and establish monitoring protocols',
      confidence: avgConfidence,
    };
  }

  private calculateOverallConfidence(universes: Universe[]): number {
    // Confidence based on consistency of outcomes
    const sentiments = universes.map(u => u.outcomeSentiment);
    const mostCommon = this.mode(sentiments);
    const consistency = sentiments.filter(s => s === mostCommon).length / sentiments.length;
    return consistency * 100;
  }

  private mode<T>(arr: T[]): T {
    const counts = new Map<T, number>();
    for (const item of arr) {
      counts.set(item, (counts.get(item) || 0) + 1);
    }
    let maxCount = 0;
    let maxItem = arr[0];
    for (const [item, count] of counts) {
      if (count > maxCount) {
        maxCount = count;
        maxItem = item;
      }
    }
    return maxItem;
  }

  private extractAnalysis(content: string): string {
    const match = content.match(/analysis[:\s]*(.*?)(?=recommendation|risk|confidence|$)/is);
    return match ? match[1].trim() : content.substring(0, 200);
  }

  private extractRecommendation(content: string): string {
    const match = content.match(/recommendation[:\s]*(.*?)(?=risk|confidence|$)/is);
    return match ? match[1].trim() : 'Monitor situation and reassess';
  }

  private extractRiskAssessment(content: string): string {
    const match = content.match(/risk[:\s]*(.*?)(?=confidence|$)/is);
    return match ? match[1].trim() : 'Elevated risk identified';
  }

  private extractConfidenceLevel(content: string): number {
    const match = content.match(/confidence[:\s]*(\d+)/i);
    return match ? parseInt(match[1]) : 75;
  }

  /**
   * Get real-time resilience scores from organization data
   */
    // Analytics methods extracted to crucible/analytics.ts
  async getDashboard(): Promise<{
    serviceName: string;
    status: string;
    recordCount: number;
    lastActivity: Date | null;
    uptime: number;
    metrics: Record<string, number>;
  }> {
    const maps = Object.entries(this).filter(([_, v]) => v instanceof Map) as [string, Map<string, unknown>][];
    const totalRecords = maps.reduce((sum, [_, m]) => sum + m.size, 0);
    return {
      serviceName: 'CendiaCrucible',
      status: 'operational',
      recordCount: totalRecords,
      lastActivity: new Date(),
      uptime: process.uptime(),
      metrics: Object.fromEntries(maps.map(([k, m]) => [k, m.size])),
    };
  }

  // ===========================================================================
  // HEALTH CHECK
  // ===========================================================================

  async getHealth(): Promise<{ healthy: boolean; service: string; timestamp: Date; details: Record<string, unknown> }> {
    return {
      healthy: true,
      service: 'CendiaCrucible',
      timestamp: new Date(),
      details: { uptime: process.uptime(), memoryMB: Math.round(process.memoryUsage().heapUsed / 1048576) },
    };
  }
}

const numUniverses = 100; // Used in probability calculation

export const cendiaCrucibleService = new CendiaCrucibleService();
export default cendiaCrucibleService;