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
 * CendiaCrucible—┚¬Å¾Ã"šÃ'¢ - Synthetic Multiverse Simulation Engine
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
export const SCENARIO_TEMPLATES: Record<SimulationType, ScenarioDefinition> = {
  FINANCIAL_STRESS: {
    name: 'Financial Stress Test',
    description: 'Simulate revenue decline, cost increases, or cash flow disruption',
    shocks: [
      { target: 'revenue', type: 'percentage', value: -30, timing: 'gradual', duration: 90 },
      { target: 'operating_costs', type: 'percentage', value: 15, timing: 'immediate' },
    ],
  },
  OPERATIONAL_SHOCK: {
    name: 'Operational Disruption',
    description: 'Simulate major operational failures or supply chain breaks',
    shocks: [
      { target: 'throughput', type: 'percentage', value: -50, timing: 'immediate' },
      { target: 'cycle_time', type: 'multiplier', value: 2.5, timing: 'immediate' },
    ],
  },
  CYBER_ATTACK: {
    name: 'Cybersecurity Incident',
    description: 'Simulate ransomware, data breach, or system compromise',
    shocks: [
      { target: 'system_availability', type: 'absolute', value: 0, timing: 'immediate' },
      { target: 'security_score', type: 'percentage', value: -80, timing: 'immediate' },
      { target: 'reputation', type: 'percentage', value: -40, timing: 'gradual', duration: 180 },
    ],
  },
  REGULATORY_CHANGE: {
    name: 'Regulatory Shock',
    description: 'Simulate new compliance requirements or enforcement actions',
    shocks: [
      { target: 'compliance_costs', type: 'percentage', value: 100, timing: 'delayed', duration: 365 },
      { target: 'operational_flexibility', type: 'percentage', value: -30, timing: 'gradual', duration: 180 },
    ],
  },
  CULTURAL_SHIFT: {
    name: 'Cultural Disruption',
    description: 'Simulate morale collapse, talent exodus, or leadership failure',
    shocks: [
      { target: 'employee_engagement', type: 'percentage', value: -40, timing: 'gradual', duration: 60 },
      { target: 'turnover_rate', type: 'multiplier', value: 3, timing: 'gradual', duration: 90 },
    ],
  },
  ESG_EVENT: {
    name: 'ESG Crisis',
    description: 'Simulate environmental, social, or governance failures',
    shocks: [
      { target: 'esg_score', type: 'percentage', value: -60, timing: 'immediate' },
      { target: 'investor_confidence', type: 'percentage', value: -35, timing: 'gradual', duration: 120 },
    ],
  },
  MA_SCENARIO: {
    name: 'M&A Event',
    description: 'Simulate acquisition, merger, or divestiture',
    shocks: [
      { target: 'integration_costs', type: 'absolute', value: 5000000, timing: 'immediate' },
      { target: 'productivity', type: 'percentage', value: -25, timing: 'gradual', duration: 180 },
    ],
  },
  MARKET_DISRUPTION: {
    name: 'Market Disruption',
    description: 'Simulate competitive threat, market shift, or demand collapse',
    shocks: [
      { target: 'market_share', type: 'percentage', value: -20, timing: 'gradual', duration: 365 },
      { target: 'pricing_power', type: 'percentage', value: -15, timing: 'gradual', duration: 180 },
    ],
  },
  SUPPLY_CHAIN: {
    name: 'Supply Chain Breakdown',
    description: 'Simulate supplier failure, logistics disruption, or material shortage',
    shocks: [
      { target: 'supply_availability', type: 'percentage', value: -70, timing: 'immediate' },
      { target: 'lead_times', type: 'multiplier', value: 4, timing: 'immediate' },
    ],
  },
  TALENT_EXODUS: {
    name: 'Talent Crisis',
    description: 'Simulate key person departures or mass resignation',
    shocks: [
      { target: 'key_talent_retention', type: 'percentage', value: -50, timing: 'immediate' },
      { target: 'institutional_knowledge', type: 'percentage', value: -40, timing: 'gradual', duration: 90 },
    ],
  },
  TECHNOLOGY_FAILURE: {
    name: 'Technology Failure',
    description: 'Simulate critical system outage or technology obsolescence',
    shocks: [
      { target: 'core_systems', type: 'absolute', value: 0, timing: 'immediate' },
      { target: 'recovery_time', type: 'absolute', value: 72, timing: 'immediate' },
    ],
  },
  BLACK_SWAN: {
    name: 'Black Swan Event',
    description: 'Simulate extreme, unpredictable events with massive impact',
    shocks: [
      { target: 'all_operations', type: 'percentage', value: -80, timing: 'immediate' },
      { target: 'external_environment', type: 'percentage', value: -60, timing: 'immediate' },
    ],
  },
  CUSTOM: {
    name: 'Custom Scenario',
    description: 'Define your own shocks and parameters',
    shocks: [],
  },
};

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
  async getResilienceScores(organizationId: string): Promise<{
    overall: number;
    dimensions: Array<{ dimension: string; score: number; trend: number }>;
    weakest: { dimension: string; score: number };
    strongest: { dimension: string; score: number };
    lastUpdated: Date;
  }> {
    // Fetch real organization data
    const [organization, healthScores, dataSources, alerts, simulations, metrics] = await Promise.all([
      prisma.organizations.findUnique({ where: { id: organizationId } }),
      prisma.health_scores.findMany({
        where: { organization_id: organizationId },
        take: 2,
        orderBy: { calculated_at: 'desc' },
      }),
      prisma.data_sources.findMany({ where: { organization_id: organizationId } }),
      prisma.alerts.findMany({ where: { organization_id: organizationId, status: 'ACTIVE' } }),
      prisma.crucible_simulations.findMany({
        where: { organization_id: organizationId, status: 'COMPLETED' },
        take: 10,
        orderBy: { created_at: 'desc' },
      }),
      prisma.metric_definitions.findMany({
        where: { organization_id: organizationId },
        include: { metric_values: { take: 2, orderBy: { timestamp: 'desc' } } },
      }),
    ]);

    const latestHealth = healthScores[0];
    const previousHealth = healthScores[1];

    // Calculate dimension scores from real data
    // Note: health_scores has: security_score, overall, data_score, ops_score, people_score
    const dimensions = [
      {
        dimension: 'Financial',
        score: latestHealth?.data_score || this.calculateFinancialResilience(metrics),
        trend: this.calculateTrend(latestHealth?.data_score, previousHealth?.data_score),
      },
      {
        dimension: 'Talent',
        score: latestHealth?.people_score || this.calculateTalentResilience(metrics),
        trend: this.calculateTrend(latestHealth?.people_score, previousHealth?.people_score),
      },
      {
        dimension: 'Operational',
        score: latestHealth?.ops_score || this.calculateOperationalResilience(dataSources, alerts),
        trend: this.calculateTrend(latestHealth?.ops_score, previousHealth?.ops_score),
      },
      {
        dimension: 'Cyber',
        score: latestHealth?.security_score || this.calculateCyberResilience(dataSources, alerts),
        trend: this.calculateTrend(latestHealth?.security_score, previousHealth?.security_score),
      },
      {
        dimension: 'Market',
        score: this.calculateMarketResilience(metrics),
        trend: 0,
      },
      {
        dimension: 'Supply Chain',
        score: this.calculateSupplyChainResilience(dataSources, simulations),
        trend: 0,
      },
      {
        dimension: 'Regulatory',
        score: latestHealth?.security_score ? Math.round(latestHealth.security_score * 0.9) : 70,
        trend: 0,
      },
    ];

    // Calculate overall score
    const overall = Math.round(dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length);
    
    // Find weakest and strongest
    const sorted = [...dimensions].sort((a, b) => a.score - b.score);
    const weakest = { dimension: sorted[0].dimension, score: sorted[0].score };
    const strongest = { dimension: sorted[sorted.length - 1].dimension, score: sorted[sorted.length - 1].score };

    return {
      overall,
      dimensions,
      weakest,
      strongest,
      lastUpdated: latestHealth?.calculated_at || new Date(),
    };
  }

  /**
   * Get industry benchmarks for comparison
   */
  async getIndustryBenchmarks(organizationId: string): Promise<{
    industry: string;
    benchmarks: Array<{ dimension: string; industryAvg: number; topQuartile: number; yourScore: number }>;
    overallComparison: { yourScore: number; industryAvg: number; percentile: number };
  }> {
    const org = await prisma.organizations.findUnique({ where: { id: organizationId } });
    const resilience = await this.getResilienceScores(organizationId);
    const industry = org?.industry || 'Technology';

    // Industry benchmark data (ROADMAP: source from aggregated data)
    const industryBenchmarks: Record<string, Record<string, { avg: number; topQuartile: number }>> = {
      'Technology': {
        Financial: { avg: 72, topQuartile: 85 },
        Talent: { avg: 68, topQuartile: 82 },
        Operational: { avg: 75, topQuartile: 88 },
        Cyber: { avg: 71, topQuartile: 86 },
        Market: { avg: 65, topQuartile: 80 },
        'Supply Chain': { avg: 62, topQuartile: 78 },
        Regulatory: { avg: 74, topQuartile: 88 },
      },
      'Healthcare': {
        Financial: { avg: 70, topQuartile: 83 },
        Talent: { avg: 65, topQuartile: 80 },
        Operational: { avg: 72, topQuartile: 85 },
        Cyber: { avg: 68, topQuartile: 82 },
        Market: { avg: 70, topQuartile: 84 },
        'Supply Chain': { avg: 64, topQuartile: 79 },
        Regulatory: { avg: 78, topQuartile: 92 },
      },
      'Financial Services': {
        Financial: { avg: 78, topQuartile: 90 },
        Talent: { avg: 70, topQuartile: 84 },
        Operational: { avg: 76, topQuartile: 89 },
        Cyber: { avg: 75, topQuartile: 88 },
        Market: { avg: 68, topQuartile: 82 },
        'Supply Chain': { avg: 60, topQuartile: 75 },
        Regulatory: { avg: 82, topQuartile: 94 },
      },
      'Manufacturing': {
        Financial: { avg: 68, topQuartile: 82 },
        Talent: { avg: 62, topQuartile: 76 },
        Operational: { avg: 74, topQuartile: 87 },
        Cyber: { avg: 58, topQuartile: 72 },
        Market: { avg: 66, topQuartile: 80 },
        'Supply Chain': { avg: 70, topQuartile: 84 },
        Regulatory: { avg: 72, topQuartile: 86 },
      },
    };

    const industryData = industryBenchmarks[industry] || industryBenchmarks['Technology'];
    
    const benchmarks = resilience.dimensions.map(d => ({
      dimension: d.dimension,
      industryAvg: industryData[d.dimension]?.avg || 70,
      topQuartile: industryData[d.dimension]?.topQuartile || 85,
      yourScore: d.score,
    }));

    const industryAvgOverall = Math.round(Object.values(industryData).reduce((sum, b) => sum + b.avg, 0) / Object.keys(industryData).length);
    const percentile = Math.min(99, Math.max(1, Math.round((resilience.overall / industryAvgOverall) * 50)));

    return {
      industry,
      benchmarks,
      overallComparison: {
        yourScore: resilience.overall,
        industryAvg: industryAvgOverall,
        percentile,
      },
    };
  }

  /**
   * Get scenario recommendations based on organization weaknesses
   */
  async getScenarioRecommendations(organizationId: string): Promise<Array<{
    scenarioType: SimulationType;
    priority: 'critical' | 'high' | 'medium';
    reason: string;
    relatedDimension: string;
    lastSimulated?: Date;
  }>> {
    const [resilience, simulations, org] = await Promise.all([
      this.getResilienceScores(organizationId),
      prisma.crucible_simulations.findMany({
        where: { organization_id: organizationId },
        orderBy: { created_at: 'desc' },
      }),
      prisma.organizations.findUnique({ where: { id: organizationId } }),
    ]);

    const recommendations: Array<{
      scenarioType: SimulationType;
      priority: 'critical' | 'high' | 'medium';
      reason: string;
      relatedDimension: string;
      lastSimulated?: Date;
    }> = [];

    // Map dimensions to scenario types
    const dimensionToScenario: Record<string, { type: SimulationType; name: string }> = {
      'Financial': { type: 'FINANCIAL_STRESS', name: 'Financial Stress Test' },
      'Talent': { type: 'TALENT_EXODUS', name: 'Talent Crisis' },
      'Operational': { type: 'OPERATIONAL_SHOCK', name: 'Operational Disruption' },
      'Cyber': { type: 'CYBER_ATTACK', name: 'Cybersecurity Incident' },
      'Market': { type: 'MARKET_DISRUPTION', name: 'Market Disruption' },
      'Supply Chain': { type: 'SUPPLY_CHAIN', name: 'Supply Chain Breakdown' },
      'Regulatory': { type: 'REGULATORY_CHANGE', name: 'Regulatory Shock' },
    };

    // Prioritize by weakness
    for (const dim of resilience.dimensions.sort((a, b) => a.score - b.score)) {
      const scenario = dimensionToScenario[dim.dimension];
      if (!scenario) continue;

      const lastSim = simulations.find(s => s.simulation_type === scenario.type);
      const daysSinceLastSim = lastSim 
        ? Math.floor((Date.now() - new Date(lastSim.created_at).getTime()) / (1000 * 60 * 60 * 24))
        : 999;

      let priority: 'critical' | 'high' | 'medium' = 'medium';
      let reason = '';

      if (dim.score < 50) {
        priority = 'critical';
        reason = `${dim.dimension} resilience is critically low at ${dim.score}/100`;
      } else if (dim.score < 65) {
        priority = 'high';
        reason = `${dim.dimension} resilience below industry average at ${dim.score}/100`;
      } else if (daysSinceLastSim > 30) {
        priority = 'medium';
        reason = `No ${scenario.name} simulation run in ${daysSinceLastSim} days`;
      } else {
        continue; // Skip if score is good and recently tested
      }

      recommendations.push({
        scenarioType: scenario.type,
        priority,
        reason,
        relatedDimension: dim.dimension,
        lastSimulated: lastSim?.created_at,
      });
    }

    // Add industry-specific recommendations
    const industry = org?.industry || 'Technology';
    const industryScenarios: Record<string, SimulationType[]> = {
      'Technology': ['CYBER_ATTACK', 'TALENT_EXODUS'],
      'Healthcare': ['REGULATORY_CHANGE', 'SUPPLY_CHAIN'],
      'Financial Services': ['REGULATORY_CHANGE', 'CYBER_ATTACK'],
      'Manufacturing': ['SUPPLY_CHAIN', 'OPERATIONAL_SHOCK'],
    };

    const priorityScenarios = industryScenarios[industry] || [];
    for (const scenarioType of priorityScenarios) {
      const existing = recommendations.find(r => r.scenarioType === scenarioType);
      if (!existing) {
        const lastSim = simulations.find(s => s.simulation_type === scenarioType);
        recommendations.push({
          scenarioType,
          priority: 'medium',
          reason: `Recommended for ${industry} industry`,
          relatedDimension: Object.entries(dimensionToScenario).find(([_, v]) => v.type === scenarioType)?.[0] || 'General',
          lastSimulated: lastSim?.created_at,
        });
      }
    }

    // Sort by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2 };
    return recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]).slice(0, 5);
  }

  /**
   * Get recent simulations with summary
   */
  async getRecentSimulations(organizationId: string, limit: number = 5): Promise<Array<{
    id: string;
    name: string;
    simulationType: string;
    status: string;
    createdAt: Date;
    createdBy: string;
    resilienceScore?: number;
    sentiment?: string;
  }>> {
    const simulations = await prisma.crucible_simulations.findMany({
      where: { organization_id: organizationId },
      orderBy: { created_at: 'desc' },
      take: limit,
      include: {
        users: { select: { name: true } },
        universes: { take: 1, orderBy: { probability: 'desc' } },
      },
    });

    return simulations.map(sim => ({
      id: sim.id,
      name: sim.name,
      simulationType: sim.simulation_type,
      status: sim.status,
      createdAt: sim.created_at,
      createdBy: sim.users?.name || 'Unknown',
      resilienceScore: (sim.results_summary as any)?.overallConfidence 
        ? Math.round((sim.results_summary as any).overallConfidence * 100)
        : undefined,
      sentiment: sim.universes[0]?.outcome_sentiment,
    }));
  }

  // Helper methods for resilience calculation
  private calculateFinancialResilience(metrics: any[]): number {
    const getMetricValue = (pattern: string) => {
      const metric = metrics.find(m => 
        m.code?.toLowerCase().includes(pattern) || m.name?.toLowerCase().includes(pattern)
      );
      return metric?.metric_values?.[0]?.value || 0;
    };

    const revenue = getMetricValue('revenue');
    const margin = getMetricValue('margin');
    const cashflow = getMetricValue('cash');
    
    // Calculate financial health score (0-100)
    let score = 70; // Base score
    if (revenue > 0) score += 10;
    if (margin > 20) score += 10;
    if (cashflow > 0) score += 10;
    
    return Math.min(100, Math.max(0, score));
  }

  private calculateTalentResilience(metrics: any[]): number {
    const getMetricValue = (pattern: string) => {
      const metric = metrics.find(m => 
        m.code?.toLowerCase().includes(pattern) || m.name?.toLowerCase().includes(pattern)
      );
      return metric?.metric_values?.[0]?.value || 0;
    };

    const engagement = getMetricValue('engagement');
    const turnover = getMetricValue('turnover');
    
    let score = 65;
    if (engagement > 70) score += 15;
    else if (engagement > 50) score += 5;
    if (turnover < 10) score += 15;
    else if (turnover < 20) score += 5;
    
    return Math.min(100, Math.max(0, score));
  }

  private calculateOperationalResilience(dataSources: any[], alerts: any[]): number {
    const connectedSources = dataSources.filter(ds => ds.status === 'CONNECTED').length;
    const totalSources = dataSources.length || 1;
    const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL').length;
    
    let score = 70;
    score += (connectedSources / totalSources) * 20;
    score -= criticalAlerts * 5;
    
    return Math.min(100, Math.max(0, Math.round(score)));
  }

  private calculateCyberResilience(dataSources: any[], alerts: any[]): number {
    const securityAlerts = alerts.filter(a => 
      a.type?.toLowerCase().includes('security') || a.type?.toLowerCase().includes('cyber')
    ).length;
    
    let score = 75;
    score -= securityAlerts * 10;
    
    // Bonus for having integrations
    if (dataSources.some(ds => ds.type === 'security')) score += 10;
    
    return Math.min(100, Math.max(0, score));
  }

  private calculateMarketResilience(metrics: any[]): number {
    const getMetricValue = (pattern: string) => {
      const metric = metrics.find(m => 
        m.code?.toLowerCase().includes(pattern) || m.name?.toLowerCase().includes(pattern)
      );
      return metric?.metric_values?.[0]?.value || 0;
    };

    const growth = getMetricValue('growth');
    const nps = getMetricValue('nps');
    
    let score = 65;
    if (growth > 20) score += 20;
    else if (growth > 10) score += 10;
    else if (growth > 0) score += 5;
    if (nps > 50) score += 10;
    
    return Math.min(100, Math.max(0, score));
  }

  private calculateSupplyChainResilience(dataSources: any[], simulations: any[]): number {
    // Check if supply chain has been tested
    const supplyChainSims = simulations.filter(s => s.simulation_type === 'SUPPLY_CHAIN');
    
    let score = 60;
    if (supplyChainSims.length > 0) score += 15;
    if (dataSources.some(ds => ds.type === 'erp')) score += 10;
    
    return Math.min(100, Math.max(0, score));
  }

  private calculateTrend(current?: number, previous?: number): number {
    if (!current || !previous || previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  // ===========================================================================
  // EXPRESS MODE - Standalone outputs WITHOUT Council
  // ===========================================================================

  /**
   * Express: Run quick scenario analysis directly (no Council needed)
   * Returns best/most-likely/worst case outcomes in one fast call.
   */
  async getQuickSimulation(
    organizationId: string,
    scenarioType: SimulationType,
    description?: string
  ): Promise<{
    bestCase: { outcome: string; probability: number; financialImpact?: string };
    mostLikely: { outcome: string; probability: number; financialImpact?: string };
    worstCase: { outcome: string; probability: number; financialImpact?: string };
    recommendation: string;
    riskScore: number;
    keyFactors: string[];
    mode: 'express';
    generatedAt: Date;
  }> {
    const startTime = Date.now();

    // Get org context for grounded analysis
    const [org, recentSims, metrics] = await Promise.all([
      prisma.organizations.findUnique({ where: { id: organizationId } }),
      prisma.crucible_simulations.findMany({
        where: { organization_id: organizationId, simulation_type: scenarioType },
        orderBy: { created_at: 'desc' },
        take: 3,
        select: { results_summary: true, simulation_type: true },
      }),
      prisma.metric_definitions.findMany({
        where: { organization_id: organizationId },
        include: { metric_values: { take: 1, orderBy: { timestamp: 'desc' } } },
        take: 10,
      }),
    ]);

    const template = SCENARIO_TEMPLATES[scenarioType];
    const scenarioName = template?.name || scenarioType;
    const scenarioDesc = description || template?.description || `${scenarioType} scenario analysis`;

    const metricsContext = metrics.map(m => {
      const val = m.metric_values?.[0]?.value;
      return `${m.name}: ${val ?? 'N/A'} ${m.unit || ''}`;
    }).join('\n');

    const prompt = `Analyze this scenario for ${org?.name || 'the organization'} (${org?.industry || 'Technology'}):

Scenario Type: ${scenarioName}
Description: ${scenarioDesc}

Current Metrics:
${metricsContext || 'No metrics available'}

${recentSims.length > 0 ? `Previous simulations of this type: ${recentSims.length} (most recent results available)` : ''}

Provide a quick 3-outcome analysis as JSON:
{
  "bestCase": {"outcome": "Description", "probability": 0.0-1.0, "financialImpact": "$X-$Y range"},
  "mostLikely": {"outcome": "Description", "probability": 0.0-1.0, "financialImpact": "$X-$Y range"},
  "worstCase": {"outcome": "Description", "probability": 0.0-1.0, "financialImpact": "$X-$Y range"},
  "recommendation": "1-2 sentence actionable recommendation",
  "riskScore": 0-100,
  "keyFactors": ["Factor 1", "Factor 2", "Factor 3"]
}`;

    try {
      const response = await this.llmService.generate(prompt, {
        model: 'llama3.2:3b',
        systemPrompt: 'You are a risk simulation analyst. Provide quantitative, realistic scenario analysis with specific probabilities and financial estimates.',
        temperature: 0.4,
        maxTokens: 600,
        format: 'json',
      });

      const parsed = JSON.parse(response);
      const durationMs = Date.now() - startTime;
      logger.info(`[Crucible Express] Quick simulation completed in ${durationMs}ms for ${scenarioType}`);

      return {
        bestCase: parsed.bestCase || { outcome: 'Favorable outcome', probability: 0.15 },
        mostLikely: parsed.mostLikely || { outcome: 'Expected outcome', probability: 0.60 },
        worstCase: parsed.worstCase || { outcome: 'Adverse outcome', probability: 0.10 },
        recommendation: parsed.recommendation || 'Proceed with caution — consider full simulation for detailed analysis.',
        riskScore: typeof parsed.riskScore === 'number' ? parsed.riskScore : 50,
        keyFactors: Array.isArray(parsed.keyFactors) ? parsed.keyFactors : [],
        mode: 'express',
        generatedAt: new Date(),
      };
    } catch (error) {
      logger.error('[Crucible Express] Quick simulation failed:', error);
      return {
        bestCase: { outcome: 'Analysis unavailable', probability: 0.15 },
        mostLikely: { outcome: 'Analysis unavailable — run full simulation', probability: 0.60 },
        worstCase: { outcome: 'Analysis unavailable', probability: 0.10 },
        recommendation: 'Express analysis failed. Run a full Crucible simulation for detailed results.',
        riskScore: 50,
        keyFactors: ['Express analysis unavailable'],
        mode: 'express',
        generatedAt: new Date(),
      };
    }
  }

  /**
   * Express: Get resilience score without running full simulation (no Council needed)
   */
  async getResilienceScore(organizationId: string): Promise<{
    overallScore: number;
    breakdown: Record<string, number>;
    vulnerabilities: string[];
    strengths: string[];
    mode: 'express';
  }> {
    // Get real data for grounded analysis
    const [simulations, dataSources, alerts, workflows] = await Promise.all([
      prisma.crucible_simulations.findMany({
        where: { organization_id: organizationId, status: 'COMPLETED' },
        orderBy: { completed_at: 'desc' },
        take: 10,
        select: { simulation_type: true, results_summary: true },
      }),
      prisma.data_sources.findMany({
        where: { organization_id: organizationId },
        select: { status: true, type: true },
      }),
      prisma.alerts.count({
        where: { organization_id: organizationId, status: 'ACTIVE' },
      }),
      prisma.workflows.count({
        where: { organization_id: organizationId, status: 'ACTIVE' },
      }),
    ]);

    const connectedSources = dataSources.filter(ds => ds.status === 'CONNECTED').length;
    const simulationCoverage = new Set(simulations.map(s => s.simulation_type)).size;

    // Calculate scores based on real data
    const dataResilience = Math.min(100, (connectedSources / Math.max(dataSources.length, 1)) * 100);
    const simulationReadiness = Math.min(100, simulationCoverage * 15);
    const operationalHealth = Math.max(0, 100 - alerts * 10);
    const automationScore = Math.min(100, workflows * 20);

    const overallScore = Math.round(
      dataResilience * 0.25 +
      simulationReadiness * 0.25 +
      operationalHealth * 0.30 +
      automationScore * 0.20
    );

    const vulnerabilities: string[] = [];
    const strengths: string[] = [];

    if (dataResilience < 50) vulnerabilities.push('Low data source connectivity — potential blind spots');
    else strengths.push('Strong data source connectivity');

    if (simulationReadiness < 30) vulnerabilities.push('Limited simulation coverage — many scenario types untested');
    else strengths.push('Good simulation coverage across scenario types');

    if (operationalHealth < 50) vulnerabilities.push('High alert volume — active operational issues');
    else strengths.push('Low alert volume — stable operations');

    if (automationScore < 30) vulnerabilities.push('Low workflow automation — manual processes at risk');
    else strengths.push('Healthy workflow automation');

    return {
      overallScore,
      breakdown: {
        dataResilience: Math.round(dataResilience),
        simulationReadiness: Math.round(simulationReadiness),
        operationalHealth: Math.round(operationalHealth),
        automationScore: Math.round(automationScore),
      },
      vulnerabilities,
      strengths,
      mode: 'express',
    };
  }
  // ===========================================================================
  // 10/10 ENHANCEMENTS - Advanced Simulation Intelligence
  // ===========================================================================

  /**
   * Sensitivity Analysis: Which input variables matter most?
   * Varies each variable ÂԚ±10% and measures outcome elasticity.
   */
  async runSensitivityAnalysis(
    simulationId: string
  ): Promise<{
    simulationId: string;
    variables: Array<{
      variable: string;
      elasticity: number;
      impactMagnitude: number;
      direction: 'positive' | 'negative' | 'neutral';
      rank: number;
    }>;
    mostSensitive: { variable: string; elasticity: number; insight: string };
    leastSensitive: { variable: string; elasticity: number; insight: string };
    recommendations: string[];
    generatedAt: Date;
  }> {
    const simulation = await prisma.crucible_simulations.findUnique({
      where: { id: simulationId },
    });

    if (!simulation) throw new Error(`Simulation ${simulationId} not found`);

    const config = simulation.config as any as SimulationConfig;
    const scenario = simulation.scenario_definition as any as ScenarioDefinition;
    const twin = simulation.digital_twin_snapshot as any as DigitalTwin;

    // Variables to test sensitivity on
    const testVariables = [
      { name: 'revenue', base: twin?.financials?.revenue || 1000000 },
      { name: 'operating_costs', base: (twin?.financials?.revenue || 1000000) * 0.7 },
      { name: 'headcount', base: twin?.employees?.totalHeadcount || 100 },
      { name: 'churn_rate', base: twin?.financials?.churnRate || 0.05 },
      { name: 'cash_flow', base: twin?.financials?.cashFlow || 200000 },
      { name: 'burn_rate', base: twin?.financials?.burnRate || 50000 },
      { name: 'engagement', base: twin?.employees?.engagementScore || 70 },
      { name: 'gross_margin', base: twin?.financials?.grossMargin || 0.6 },
    ].filter(v => v.base !== 0 && v.base != null);

    const variation = 0.10; // ÂԚ±10%
    const sensitivities: Array<{
      variable: string;
      elasticity: number;
      impactMagnitude: number;
      direction: 'positive' | 'negative' | 'neutral';
      rank: number;
    }> = [];

    // Calculate baseline risk score from shocks
    const baselineScore = this.calculateBaselineRiskScore(scenario.shocks, twin);

    for (const variable of testVariables) {
      // Apply +10% adjustment
      const upScore = this.calculateVariedRiskScore(scenario.shocks, twin, variable.name, variable.base * (1 + variation));
      // Apply -10% adjustment
      const downScore = this.calculateVariedRiskScore(scenario.shocks, twin, variable.name, variable.base * (1 - variation));

      const impactUp = upScore - baselineScore;
      const impactDown = downScore - baselineScore;
      const avgImpact = (Math.abs(impactUp) + Math.abs(impactDown)) / 2;
      const elasticity = avgImpact / (variation * 100);

      sensitivities.push({
        variable: variable.name,
        elasticity: Math.round(elasticity * 100) / 100,
        impactMagnitude: Math.round(avgImpact * 100) / 100,
        direction: impactDown > impactUp ? 'negative' : impactDown < impactUp ? 'positive' : 'neutral',
        rank: 0,
      });
    }

    // Sort by elasticity and assign ranks
    sensitivities.sort((a, b) => b.elasticity - a.elasticity);
    sensitivities.forEach((s, i) => { s.rank = i + 1; });

    const most = sensitivities[0];
    const least = sensitivities[sensitivities.length - 1];

    // Generate recommendations via LLM
    const recPrompt = `Given sensitivity analysis results for a ${simulation.simulation_type} scenario:
Most sensitive variable: ${most.variable} (elasticity: ${most.elasticity})
Least sensitive variable: ${least.variable} (elasticity: ${least.elasticity})
All variables ranked: ${sensitivities.map(s => `${s.variable}: ${s.elasticity}`).join(', ')}

Provide 3-5 actionable recommendations as a JSON array of strings.`;

    let recommendations: string[] = [];
    try {
      const resp = await this.llmService.generate(recPrompt, {
        model: 'llama3.2:3b',
        systemPrompt: 'You are a risk analyst. Provide actionable recommendations based on sensitivity analysis. Return a JSON array of strings.',
        temperature: 0.3,
        maxTokens: 300,
        format: 'json',
      });
      const parsed = JSON.parse(resp);
      recommendations = Array.isArray(parsed) ? parsed : parsed.recommendations || [];
    } catch {
      recommendations = [
        `Focus risk mitigation on ${most.variable} — it has ${most.elasticity.toFixed(1)}x impact per 10% change`,
        `${least.variable} has minimal sensitivity — deprioritize in stress testing`,
        `Monitor ${sensitivities.slice(0, 3).map(s => s.variable).join(', ')} as your top risk drivers`,
      ];
    }

    return {
      simulationId,
      variables: sensitivities,
      mostSensitive: {
        variable: most.variable,
        elasticity: most.elasticity,
        insight: `${most.variable} has ${most.elasticity.toFixed(1)}x impact — a 10% change here has disproportionate effect on outcomes`,
      },
      leastSensitive: {
        variable: least.variable,
        elasticity: least.elasticity,
        insight: `${least.variable} has minimal impact (${least.elasticity.toFixed(2)}x) — safe to deprioritize`,
      },
      recommendations,
      generatedAt: new Date(),
    };
  }

  /**
   * Calculate baseline risk score from shocks against the digital twin.
   */
  private calculateBaselineRiskScore(shocks: Shock[], twin: DigitalTwin | null): number {
    let score = 50; // Neutral baseline
    for (const shock of shocks) {
      const magnitude = Math.abs(shock.value);
      if (shock.type === 'percentage') score += magnitude * 0.3;
      else if (shock.type === 'multiplier') score += (shock.value - 1) * 20;
      else score += magnitude * 0.01;
    }
    // Adjust for org health
    if (twin?.healthScore) score -= (twin.healthScore - 50) * 0.2;
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate risk score with one variable varied.
   */
  private calculateVariedRiskScore(
    shocks: Shock[],
    twin: DigitalTwin | null,
    variableName: string,
    newValue: number
  ): number {
    let baseScore = this.calculateBaselineRiskScore(shocks, twin);

    // Apply the variable change effect
    const shockAffecting = shocks.find(s => s.target.toLowerCase().includes(variableName.replace('_', '')));
    if (shockAffecting) {
      const originalMagnitude = Math.abs(shockAffecting.value);
      const scaledMagnitude = originalMagnitude * (newValue > 0 ? 1.1 : 0.9);
      baseScore += (scaledMagnitude - originalMagnitude) * 0.5;
    }

    // Financial resilience effect
    if (['revenue', 'cash_flow', 'gross_margin'].includes(variableName)) {
      baseScore -= newValue * 0.00001; // Higher = more resilient
    } else if (['burn_rate', 'churn_rate', 'operating_costs'].includes(variableName)) {
      baseScore += newValue * 0.00001; // Higher = more risky
    }

    return Math.max(0, Math.min(100, baseScore));
  }

  /**
   * Historical Calibration: How accurate were past predictions?
   * Compares past simulation predictions against actual outcomes from Echo.
   */
  async calibrateModel(organizationId: string): Promise<{
    organizationId: string;
    calibrationData: Array<{
      simulationId: string;
      simulationType: string;
      simulationDate: Date;
      predictedOutcome: string;
      predictedSentiment: string;
      actualOutcome: string | null;
      actualStatus: string | null;
      errorMargin: number | null;
    }>;
    statistics: {
      totalSimulations: number;
      withActualOutcomes: number;
      meanError: number;
      medianError: number;
      bias: number;
      calibrationFactor: number;
      accuracy: string;
    };
    recommendation: string;
    generatedAt: Date;
  }> {
    // Get completed simulations
    const simulations = await prisma.crucible_simulations.findMany({
      where: { organization_id: organizationId, status: 'COMPLETED' },
      orderBy: { completed_at: 'desc' },
      take: 50,
      select: {
        id: true,
        simulation_type: true,
        created_at: true,
        completed_at: true,
        results_summary: true,
      },
    });

    // Get actual decision outcomes from Echo
    const outcomes = await prisma.decision_outcomes.findMany({
      where: { organization_id: organizationId },
      orderBy: { decision_date: 'desc' },
      take: 100,
    });

    const calibrationData: Array<{
      simulationId: string;
      simulationType: string;
      simulationDate: Date;
      predictedOutcome: string;
      predictedSentiment: string;
      actualOutcome: string | null;
      actualStatus: string | null;
      errorMargin: number | null;
    }> = [];

    const errors: number[] = [];

    for (const sim of simulations) {
      const summary = sim.results_summary as any;
      const predictedSentiment = summary?.worstCase?.sentiment || summary?.mostLikely?.sentiment || 'UNKNOWN';
      const predictedOutcome = summary?.mostLikely?.summary || 'No prediction available';

      // Find closest matching outcome (by date proximity)
      const simDate = sim.completed_at || sim.created_at;
      const matchingOutcome = outcomes.find(o => {
        const daysDiff = Math.abs((o.decision_date.getTime() - simDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff < 90; // Within 90 days
      });

      let errorMargin: number | null = null;
      if (matchingOutcome) {
        // Calculate prediction error
        const sentimentScores: Record<string, number> = {
          'CATASTROPHIC': 0, 'NEGATIVE': 25, 'NEUTRAL': 50, 'POSITIVE': 75, 'OPTIMAL': 100,
        };
        const statusScores: Record<string, number> = {
          'failure': 10, 'partial': 40, 'inconclusive': 50, 'pending': 50, 'success': 90,
        };
        const predicted = sentimentScores[predictedSentiment] ?? 50;
        const actual = statusScores[matchingOutcome.status] ?? 50;
        errorMargin = Math.abs(predicted - actual) / 100;
        errors.push(errorMargin);
      }

      calibrationData.push({
        simulationId: sim.id,
        simulationType: sim.simulation_type,
        simulationDate: simDate,
        predictedOutcome,
        predictedSentiment,
        actualOutcome: matchingOutcome?.decision_title || null,
        actualStatus: matchingOutcome?.status || null,
        errorMargin,
      });
    }

    // Calculate statistics
    const totalSimulations = simulations.length;
    const withActualOutcomes = errors.length;
    const meanError = errors.length > 0 ? errors.reduce((a, b) => a + b, 0) / errors.length : 0;
    const sortedErrors = [...errors].sort((a, b) => a - b);
    const medianError = errors.length > 0 ? sortedErrors[Math.floor(errors.length / 2)] : 0;

    // Bias: positive = optimistic, negative = pessimistic
    const biasValues = calibrationData
      .filter(d => d.errorMargin !== null)
      .map(d => {
        const sentScores: Record<string, number> = { 'CATASTROPHIC': 0, 'NEGATIVE': 25, 'NEUTRAL': 50, 'POSITIVE': 75, 'OPTIMAL': 100 };
        const statScores: Record<string, number> = { 'failure': 10, 'partial': 40, 'inconclusive': 50, 'pending': 50, 'success': 90 };
        return ((sentScores[d.predictedSentiment] ?? 50) - (statScores[d.actualStatus || 'pending'] ?? 50)) / 100;
      });
    const bias = biasValues.length > 0 ? biasValues.reduce((a, b) => a + b, 0) / biasValues.length : 0;
    const calibrationFactor = 1 - bias;

    let accuracy: string;
    let recommendation: string;
    if (withActualOutcomes < 5) {
      accuracy = 'Insufficient data';
      recommendation = `Only ${withActualOutcomes} simulations have matched outcomes. Run more simulations and link decision outcomes via Echo to build calibration data.`;
    } else if (meanError < 0.15) {
      accuracy = 'Excellent';
      recommendation = `Model accuracy: Excellent (${Math.round((1 - meanError) * 100)}%). Predictions are highly reliable. Continue current approach.`;
    } else if (meanError < 0.30) {
      accuracy = 'Good';
      recommendation = `Model accuracy: Good (${Math.round((1 - meanError) * 100)}%). ${bias > 0.1 ? 'Model tends to be optimistic — apply calibration factor of ' + calibrationFactor.toFixed(2) : bias < -0.1 ? 'Model tends to be pessimistic — adjust upward by ' + Math.abs(bias * 100).toFixed(0) + '%' : 'No systematic bias detected.'}`;
    } else {
      accuracy = 'Needs Improvement';
      recommendation = `Model accuracy: ${Math.round((1 - meanError) * 100)}%. Consider adjusting simulation parameters. ${bias > 0 ? 'Reduce optimism in scenario assumptions.' : 'Increase baseline resilience assumptions.'}`;
    }

    return {
      organizationId,
      calibrationData: calibrationData.slice(0, 20),
      statistics: {
        totalSimulations,
        withActualOutcomes,
        meanError: Math.round(meanError * 1000) / 1000,
        medianError: Math.round(medianError * 1000) / 1000,
        bias: Math.round(bias * 1000) / 1000,
        calibrationFactor: Math.round(calibrationFactor * 1000) / 1000,
        accuracy,
      },
      recommendation,
      generatedAt: new Date(),
    };
  }

  /**
   * Scenario Correlations: Which bad outcomes happen together?
   * Analyzes outcome co-occurrence across completed simulations.
   */
  async analyzeScenarioCorrelations(organizationId: string): Promise<{
    organizationId: string;
    correlations: Array<{
      pair: [string, string];
      correlation: number;
      coOccurrence: number;
      warning: string | null;
    }>;
    clusteredRisks: Array<{
      cluster: string[];
      probability: number;
      warning: string;
    }>;
    totalSimulationsAnalyzed: number;
    generatedAt: Date;
  }> {
    const simulations = await prisma.crucible_simulations.findMany({
      where: { organization_id: organizationId, status: 'COMPLETED' },
      select: {
        id: true,
        simulation_type: true,
        results_summary: true,
      },
    });

    // Build outcome vectors per simulation type
    const typeOutcomes = new Map<string, { negative: number; total: number }>();
    for (const sim of simulations) {
      const summary = sim.results_summary as any;
      const sentiment = summary?.mostLikely?.sentiment || summary?.worstCase?.sentiment || 'NEUTRAL';
      const isNegative = ['CATASTROPHIC', 'NEGATIVE'].includes(sentiment);

      const existing = typeOutcomes.get(sim.simulation_type) || { negative: 0, total: 0 };
      existing.total++;
      if (isNegative) existing.negative++;
      typeOutcomes.set(sim.simulation_type, existing);
    }

    // Calculate pairwise correlations
    const types = Array.from(typeOutcomes.keys());
    const correlations: Array<{
      pair: [string, string];
      correlation: number;
      coOccurrence: number;
      warning: string | null;
    }> = [];

    for (let i = 0; i < types.length; i++) {
      for (let j = i + 1; j < types.length; j++) {
        const a = typeOutcomes.get(types[i])!;
        const b = typeOutcomes.get(types[j])!;
        const pA = a.total > 0 ? a.negative / a.total : 0;
        const pB = b.total > 0 ? b.negative / b.total : 0;

        // Simple co-occurrence correlation
        const coOccurrence = pA * pB;
        const correlation = Math.min(1, (pA + pB) / 2 + (pA > 0.5 && pB > 0.5 ? 0.3 : 0));

        correlations.push({
          pair: [types[i], types[j]],
          correlation: Math.round(correlation * 100) / 100,
          coOccurrence: Math.round(coOccurrence * 100) / 100,
          warning: correlation > 0.7 ? `${types[i]} and ${types[j]} tend to cascade together — prepare for both simultaneously` : null,
        });
      }
    }

    correlations.sort((a, b) => b.correlation - a.correlation);

    // Identify risk clusters (groups of 3+ correlated scenarios)
    const clusteredRisks: Array<{ cluster: string[]; probability: number; warning: string }> = [];
    const highCorr = correlations.filter(c => c.correlation > 0.5);

    // Build adjacency for clustering
    const adjacency = new Map<string, Set<string>>();
    for (const c of highCorr) {
      if (!adjacency.has(c.pair[0])) adjacency.set(c.pair[0], new Set());
      if (!adjacency.has(c.pair[1])) adjacency.set(c.pair[1], new Set());
      adjacency.get(c.pair[0])!.add(c.pair[1]);
      adjacency.get(c.pair[1])!.add(c.pair[0]);
    }

    // Simple connected components
    const visited = new Set<string>();
    for (const node of adjacency.keys()) {
      if (visited.has(node)) continue;
      const cluster: string[] = [];
      const queue = [node];
      while (queue.length > 0) {
        const current = queue.shift()!;
        if (visited.has(current)) continue;
        visited.add(current);
        cluster.push(current);
        for (const neighbor of adjacency.get(current) || []) {
          if (!visited.has(neighbor)) queue.push(neighbor);
        }
      }
      if (cluster.length >= 2) {
        const clusterProb = cluster.reduce((sum, t) => {
          const data = typeOutcomes.get(t);
          return sum + (data ? data.negative / data.total : 0);
        }, 0) / cluster.length;

        clusteredRisks.push({
          cluster,
          probability: Math.round(clusterProb * 100) / 100,
          warning: `These ${cluster.length} scenario types cascade together — if one triggers, expect the others`,
        });
      }
    }

    return {
      organizationId,
      correlations: correlations.slice(0, 20),
      clusteredRisks,
      totalSimulationsAnalyzed: simulations.length,
      generatedAt: new Date(),
    };
  }

  /**
   * Scenario Library: Industry-specific + saved scenarios with recommendations.
   */
  async getScenarioLibrary(
    organizationId: string
  ): Promise<{
    industryScenarios: Array<{ type: SimulationType; name: string; description: string; relevance: string }>;
    savedScenarios: Array<{ id: string; name: string; type: string; usageCount: number; lastUsed: Date | null }>;
    recommended: Array<{ type: SimulationType; name: string; reason: string }>;
    untestedTypes: SimulationType[];
    generatedAt: Date;
  }> {
    const [org, simulations] = await Promise.all([
      prisma.organizations.findUnique({ where: { id: organizationId } }),
      prisma.crucible_simulations.findMany({
        where: { organization_id: organizationId },
        select: { id: true, name: true, simulation_type: true, created_at: true },
        orderBy: { created_at: 'desc' },
      }),
    ]);

    const industry = (org?.industry || 'technology').toLowerCase();

    // Industry-specific scenario recommendations
    const industryMap: Record<string, Array<{ type: SimulationType; relevance: string }>> = {
      'financial services': [
        { type: 'FINANCIAL_STRESS', relevance: 'Core risk — interest rate and credit exposure' },
        { type: 'REGULATORY_CHANGE', relevance: 'Basel/Dodd-Frank compliance shifts' },
        { type: 'CYBER_ATTACK', relevance: 'PCI-DSS and customer data protection' },
        { type: 'MARKET_DISRUPTION', relevance: 'Fintech competition and market volatility' },
        { type: 'ESG_EVENT', relevance: 'ESG reporting mandates and greenwashing risk' },
      ],
      'healthcare': [
        { type: 'REGULATORY_CHANGE', relevance: 'HIPAA/FDA compliance and reimbursement changes' },
        { type: 'TALENT_EXODUS', relevance: 'Clinical staff shortages and burnout' },
        { type: 'SUPPLY_CHAIN', relevance: 'Medical supply and pharmaceutical disruptions' },
        { type: 'CYBER_ATTACK', relevance: 'PHI breach and ransomware targeting' },
        { type: 'TECHNOLOGY_FAILURE', relevance: 'EHR system failures and patient safety' },
      ],
      'technology': [
        { type: 'CYBER_ATTACK', relevance: 'Core infrastructure and IP protection' },
        { type: 'TALENT_EXODUS', relevance: 'Key engineer retention in competitive market' },
        { type: 'MARKET_DISRUPTION', relevance: 'Competitive disruption and platform shifts' },
        { type: 'FINANCIAL_STRESS', relevance: 'Funding environment and burn rate management' },
        { type: 'TECHNOLOGY_FAILURE', relevance: 'System outages and SLA compliance' },
      ],
      'manufacturing': [
        { type: 'SUPPLY_CHAIN', relevance: 'Material sourcing and logistics resilience' },
        { type: 'OPERATIONAL_SHOCK', relevance: 'Production line failures and quality issues' },
        { type: 'TALENT_EXODUS', relevance: 'Skilled labor shortages' },
        { type: 'ESG_EVENT', relevance: 'Environmental compliance and emissions' },
        { type: 'MARKET_DISRUPTION', relevance: 'Demand shifts and competitor automation' },
      ],
      'energy': [
        { type: 'REGULATORY_CHANGE', relevance: 'NERC CIP and environmental regulations' },
        { type: 'ESG_EVENT', relevance: 'Energy transition and carbon mandates' },
        { type: 'SUPPLY_CHAIN', relevance: 'Fuel sourcing and grid dependencies' },
        { type: 'OPERATIONAL_SHOCK', relevance: 'Grid failures and safety incidents' },
        { type: 'BLACK_SWAN', relevance: 'Natural disasters and geopolitical disruption' },
      ],
    };

    // Find matching industry scenarios or default to technology
    const matchedIndustry = Object.keys(industryMap).find(k => industry.includes(k)) || 'technology';
    const industryScenarios = (industryMap[matchedIndustry] || industryMap['technology']).map(s => ({
      type: s.type,
      name: SCENARIO_TEMPLATES[s.type]?.name || s.type,
      description: SCENARIO_TEMPLATES[s.type]?.description || '',
      relevance: s.relevance,
    }));

    // Saved/used scenarios
    const usageCounts = new Map<string, { count: number; lastUsed: Date | null; name: string; type: string }>();
    for (const sim of simulations) {
      const key = sim.simulation_type;
      const existing = usageCounts.get(key) || { count: 0, lastUsed: null, name: sim.name, type: sim.simulation_type };
      existing.count++;
      if (!existing.lastUsed || sim.created_at > existing.lastUsed) existing.lastUsed = sim.created_at;
      usageCounts.set(key, existing);
    }
    const savedScenarios = Array.from(usageCounts.entries())
      .map(([key, data]) => ({
        id: key,
        name: data.name,
        type: data.type,
        usageCount: data.count,
        lastUsed: data.lastUsed,
      }))
      .sort((a, b) => b.usageCount - a.usageCount);

    // Find untested scenario types
    const testedTypes = new Set(simulations.map(s => s.simulation_type));
    const allTypes = Object.keys(SCENARIO_TEMPLATES) as SimulationType[];
    const untestedTypes = allTypes.filter(t => !testedTypes.has(t) && t !== 'CUSTOM');

    // Recommend scenarios
    const recommended: Array<{ type: SimulationType; name: string; reason: string }> = [];
    for (const untested of untestedTypes.slice(0, 3)) {
      recommended.push({
        type: untested,
        name: SCENARIO_TEMPLATES[untested]?.name || untested,
        reason: `Never tested — blind spot in resilience coverage`,
      });
    }
    // Add most-used scenario as re-run recommendation
    if (savedScenarios.length > 0 && savedScenarios[0].lastUsed) {
      const daysSinceLastRun = Math.floor((Date.now() - savedScenarios[0].lastUsed.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceLastRun > 30) {
        recommended.push({
          type: savedScenarios[0].type as SimulationType,
          name: SCENARIO_TEMPLATES[savedScenarios[0].type as SimulationType]?.name || savedScenarios[0].type,
          reason: `Last run ${daysSinceLastRun} days ago — re-test for current conditions`,
        });
      }
    }

    return {
      industryScenarios,
      savedScenarios,
      recommended,
      untestedTypes,
      generatedAt: new Date(),
    };
  }

  // ===========================================================================
  // DASHBOARD
  // ===========================================================================

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
