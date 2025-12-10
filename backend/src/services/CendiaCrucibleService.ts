/**
 * CendiaCrucible™ - Synthetic Multiverse Simulation Engine
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

// Types
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
  correlation: number; // -1 to 1
}

export interface ScenarioDefinition {
  name: string;
  description: string;
  shocks: Shock[];
  triggers?: Trigger[];
}

export interface Shock {
  target: string; // KPI, department, system
  type: 'absolute' | 'percentage' | 'multiplier';
  value: number;
  timing: 'immediate' | 'gradual' | 'delayed';
  duration?: number; // days
}

export interface Trigger {
  condition: string;
  action: string;
  parameters: Record<string, any>;
}

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
  // Real-time status from database
  activeAlerts?: number;
  activeWorkflows?: number;
  dataSourceCount?: number;
  healthScore?: number;
}

interface Department {
  name: string;
  headcount: number;
  budget?: number;
  workflows?: number;
  dataSources?: number;
  efficiency?: number;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  dependencies?: string[];
}

interface System {
  id: string;
  name: string;
  type: string;
  status?: string;
  criticality?: number;
  uptime?: number;
  lastSync?: Date;
  dependencies?: string[];
}

interface KPI {
  code: string;
  name: string;
  value: number;
  target?: number;
  trend?: number;
  unit?: string;
  category?: string;
}

interface EmployeeMetrics {
  totalHeadcount: number;
  averageTenure: number;
  turnoverRate: number;
  engagementScore: number;
  productivityIndex: number;
  // Extended real metrics
  hiringRate?: number;
  trainingHours?: number;
  satisfactionScore?: number;
}

interface FinancialSnapshot {
  revenue: number;
  ebitda: number;
  cashFlow: number;
  burnRate: number;
  runway: number;
  // Extended real metrics
  grossMargin?: number;
  customerAcquisitionCost?: number;
  lifetimeValue?: number;
  churnRate?: number;
}

interface Relationship {
  type: string;
  source: string;
  target: string;
  strength: number;
  critical?: boolean;
}

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
  async runSimulation(simulationId: string): Promise<SimulationResult> {
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

      // Generate council deliberations
      const deliberations = await this.generateCouncilDeliberations(
        simulationId,
        scenario,
        universes,
        impacts
      );

      // Generate summary
      const summary = this.generateResultSummary(universes, impacts);

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
   * Generate summary of simulation results
   */
  private generateResultSummary(
    universes: Universe[],
    impacts: Impact[]
  ): ResultSummary {
    const sortedByOutcome = [...universes].sort((a, b) => {
      const sentimentOrder = { OPTIMAL: 4, POSITIVE: 3, NEUTRAL: 2, NEGATIVE: 1, CATASTROPHIC: 0 };
      return sentimentOrder[b.outcomeSentiment] - sentimentOrder[a.outcomeSentiment];
    });

    const bestCase = sortedByOutcome[0];
    const worstCase = sortedByOutcome[sortedByOutcome.length - 1];
    const mostLikely = universes.reduce((prev, curr) => 
      curr.probability > prev.probability ? curr : prev
    );

    const criticalImpacts = impacts.filter(i => i.severity === 'CRITICAL' || i.severity === 'HIGH');
    const keyRisks = criticalImpacts
      .filter(i => (i.changePercent || 0) < 0)
      .map(i => `${i.entityName}: ${Math.abs(i.changePercent || 0).toFixed(1)}% decline`);

    const opportunities = impacts
      .filter(i => (i.changePercent || 0) > 10)
      .map(i => `${i.entityName}: ${(i.changePercent || 0).toFixed(1)}% improvement potential`);

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
      keyRisks: keyRisks.slice(0, 5),
      keyOpportunities: opportunities.slice(0, 3),
      overallConfidence: this.calculateOverallConfidence(universes),
    };
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
    return options[Math.floor(Math.random() * options.length)];
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
    
    // Simple consensus check - in production, use more sophisticated NLP
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

    // Industry benchmark data (would come from aggregated data in production)
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
        continue; // Skip if score is good and recently simulated
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
}

const numUniverses = 100; // Used in probability calculation

export const cendiaCrucibleService = new CendiaCrucibleService();
export default cendiaCrucibleService;
