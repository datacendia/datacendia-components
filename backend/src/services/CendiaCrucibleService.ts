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
  snapshotTime: Date;
  departments: Department[];
  systems: System[];
  kpis: KPI[];
  employees: EmployeeMetrics;
  financials: FinancialSnapshot;
  relationships: Relationship[];
}

interface Department {
  id: string;
  name: string;
  headcount: number;
  budget: number;
  efficiency: number;
  dependencies: string[];
}

interface System {
  id: string;
  name: string;
  type: string;
  criticality: number;
  uptime: number;
  dependencies: string[];
}

interface KPI {
  code: string;
  name: string;
  value: number;
  target: number;
  trend: number;
}

interface EmployeeMetrics {
  totalHeadcount: number;
  averageTenure: number;
  turnoverRate: number;
  engagementScore: number;
  productivityIndex: number;
}

interface FinancialSnapshot {
  revenue: number;
  ebitda: number;
  cashFlow: number;
  burnRate: number;
  runway: number;
}

interface Relationship {
  fromId: string;
  toId: string;
  type: string;
  strength: number;
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
   * Capture current state as digital twin
   */
  private async captureDigitalTwin(organizationId: string): Promise<DigitalTwin> {
    // Fetch real data from various sources
    const [metrics, dataSources, healthScores] = await Promise.all([
      prisma.metric_definitions.findMany({
        where: { organization_id: organizationId },
        include: { metric_values: { take: 1, orderBy: { timestamp: 'desc' } } },
      }),
      prisma.data_sources.findMany({
        where: { organization_id: organizationId },
      }),
      prisma.health_scores.findMany({
        where: { organization_id: organizationId },
        take: 1,
        orderBy: { calculated_at: 'desc' },
      }),
    ]);

    const latestHealth = healthScores[0];

    return {
      organizationId,
      snapshotTime: new Date(),
      departments: this.generateDepartments(),
      systems: this.mapDataSourcesToSystems(dataSources),
      kpis: this.mapMetricsToKPIs(metrics),
      employees: {
        totalHeadcount: 150,
        averageTenure: 3.2,
        turnoverRate: 0.12,
        engagementScore: latestHealth?.people_score || 75,
        productivityIndex: 0.85,
      },
      financials: {
        revenue: 15000000,
        ebitda: 2500000,
        cashFlow: 1200000,
        burnRate: 800000,
        runway: 18,
      },
      relationships: this.generateRelationships(),
    };
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

  // Helper methods
  private generateDepartments(): Department[] {
    return [
      { id: 'eng', name: 'Engineering', headcount: 50, budget: 5000000, efficiency: 0.85, dependencies: ['it', 'product'] },
      { id: 'sales', name: 'Sales', headcount: 30, budget: 3000000, efficiency: 0.78, dependencies: ['marketing', 'product'] },
      { id: 'marketing', name: 'Marketing', headcount: 15, budget: 2000000, efficiency: 0.82, dependencies: ['sales', 'product'] },
      { id: 'ops', name: 'Operations', headcount: 25, budget: 2500000, efficiency: 0.88, dependencies: ['it', 'finance'] },
      { id: 'finance', name: 'Finance', headcount: 10, budget: 1000000, efficiency: 0.92, dependencies: [] },
      { id: 'hr', name: 'Human Resources', headcount: 8, budget: 800000, efficiency: 0.85, dependencies: [] },
      { id: 'it', name: 'IT', headcount: 12, budget: 1500000, efficiency: 0.80, dependencies: ['eng'] },
    ];
  }

  private mapDataSourcesToSystems(dataSources: any[]): System[] {
    return dataSources.map(ds => ({
      id: ds.id,
      name: ds.name,
      type: ds.type,
      criticality: ds.type === 'POSTGRESQL' ? 0.95 : 0.7,
      uptime: ds.status === 'CONNECTED' ? 99.9 : 0,
      dependencies: [],
    }));
  }

  private mapMetricsToKPIs(metrics: any[]): KPI[] {
    return metrics.map(m => ({
      code: m.code,
      name: m.name,
      value: m.metric_values?.[0]?.value || 100,
      target: 100,
      trend: 0,
    }));
  }

  private generateRelationships(): Relationship[] {
    return [
      { fromId: 'eng', toId: 'it', type: 'depends_on', strength: 0.9 },
      { fromId: 'sales', toId: 'marketing', type: 'collaborates', strength: 0.85 },
      { fromId: 'ops', toId: 'it', type: 'depends_on', strength: 0.8 },
      { fromId: 'finance', toId: 'ops', type: 'monitors', strength: 0.7 },
    ];
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

      const dept = digitalTwin.departments.find(d => d.id === nodeId);
      if (dept) {
        nodes.push({
          nodeId: dept.id,
          nodeName: dept.name,
          nodeType: 'department',
          impactLevel: impactMultiplier * 100 / (depth + 1),
          timeToImpact: depth * 24,
          dependencies: dept.dependencies,
        });

        for (const depId of dept.dependencies) {
          propagate(depId, depth + 1, impactMultiplier * 0.7);
        }
      }
    };

    // Start propagation from affected area
    for (const dept of digitalTwin.departments) {
      if (dept.name.toLowerCase().includes(triggerTarget.toLowerCase())) {
        propagate(dept.id, 0, 1);
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
            id: dept.id,
            name: dept.name,
            type: 'department',
            baseline: dept.efficiency * 100,
            dependencies: dept.dependencies,
          });
        }
        break;
      case 'SECURITY':
        for (const sys of digitalTwin.systems) {
          entities.push({
            id: sys.id,
            name: sys.name,
            type: 'system',
            baseline: sys.uptime,
            dependencies: sys.dependencies,
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
}

const numUniverses = 100; // Used in probability calculation

export const cendiaCrucibleService = new CendiaCrucibleService();
export default cendiaCrucibleService;
