// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * SGAS CLASS V - META-GOVERNANCE AGENTS SERVICE
 * 
 * Meta-Governance Agents evaluate how the governance system itself behaves over time.
 * They detect:
 * - Overuse of emergency powers
 * - Gradual erosion of safeguards
 * - Automation creep
 * - Human override decay
 * 
 * They answer: "Is the system becoming dangerous?"
 * This moves from decision verification to governance design validation.
 */

import { EventEmitter } from 'events';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import {
  SGASAgentClass,
  MetaGovernanceAgentConfig,
  MetaGovernanceAgentOutput,
  DriftType,
  Granularity,
  RiskLevel,
  TrendDirection,
  SeverityLevel,
  DifficultyLevel,
  RecommendationCategory,
  InterventionType,
  HealthStatus,
  InstitutionType,
  DecisionType,
  TimeRange,
  DriftWarning,
  DriftEvidence,
  GovernanceRiskReport,
  GovernanceRiskCategory,
  RiskFactor,
  RiskComparison,
  StructuralRecommendation,
  SystemHealthScore,
  HealthComponent,
  Intervention,
  generateSGASId,
  hashState,
} from './types.js';

// =============================================================================
// META-GOVERNANCE AGENT DEFINITIONS
// =============================================================================

export const META_GOVERNANCE_AGENTS: MetaGovernanceAgentConfig[] = [
  {
    id: 'mga_emergency_monitor',
    name: 'Emergency Power Usage Monitor',
    class: SGASAgentClass.META_GOVERNANCE,
    monitoringScope: {
      timeRange: {
        lookbackDays: 90,
        granularity: Granularity.DAY,
        aggregationWindow: 7,
      },
      agentClasses: [SGASAgentClass.INSTITUTIONAL],
      institutionalTypes: [InstitutionType.EMERGENCY_MANAGEMENT],
      decisionTypes: [DecisionType.EMERGENCY, DecisionType.RESPONSE],
    },
    detectionPatterns: [
      {
        id: 'pat_emergency_frequency',
        name: 'Emergency Declaration Frequency',
        type: DriftType.EMERGENCY_POWER_OVERUSE,
        threshold: 0.1, // More than 10% of decisions use emergency powers
        windowSize: 30,
        sensitivity: 0.8,
      },
      {
        id: 'pat_emergency_duration',
        name: 'Emergency Duration Creep',
        type: DriftType.EMERGENCY_POWER_OVERUSE,
        threshold: 72, // Hours - average emergency duration
        windowSize: 90,
        sensitivity: 0.7,
      },
    ],
    governanceMetrics: [
      {
        id: 'gm_emergency_ratio',
        name: 'Emergency Decision Ratio',
        description: 'Ratio of decisions made under emergency powers',
        calculation: 'emergency_decisions / total_decisions',
        healthyRange: [0, 0.05],
        criticalThreshold: 0.15,
      },
    ],
    interventionAuthority: {
      canAlert: true,
      canRecommend: true,
      canBlock: false,
      canEscalate: true,
      escalationTargets: ['governance_committee', 'board'],
    },
  },
  {
    id: 'mga_safeguard_erosion',
    name: 'Safeguard Erosion Detector',
    class: SGASAgentClass.META_GOVERNANCE,
    monitoringScope: {
      timeRange: {
        lookbackDays: 180,
        granularity: Granularity.WEEK,
        aggregationWindow: 4,
      },
      agentClasses: [SGASAgentClass.INSTITUTIONAL, SGASAgentClass.ADVERSARIAL],
      institutionalTypes: [
        InstitutionType.REGULATORY_BODY,
        InstitutionType.AUDIT_AUTHORITY,
        InstitutionType.ETHICS_BOARD,
      ],
      decisionTypes: [DecisionType.POLICY, DecisionType.OPERATIONAL],
    },
    detectionPatterns: [
      {
        id: 'pat_constraint_relaxation',
        name: 'Constraint Relaxation Rate',
        type: DriftType.SAFEGUARD_EROSION,
        threshold: 0.05, // 5% relaxation per period
        windowSize: 30,
        sensitivity: 0.9,
      },
      {
        id: 'pat_override_normalization',
        name: 'Override Normalization',
        type: DriftType.PROCESS_BYPASS_NORMALIZATION,
        threshold: 0.1, // Override rate
        windowSize: 60,
        sensitivity: 0.85,
      },
    ],
    governanceMetrics: [
      {
        id: 'gm_safeguard_strength',
        name: 'Safeguard Strength Index',
        description: 'Composite measure of safeguard effectiveness',
        calculation: 'weighted_avg(constraint_adherence, audit_coverage, review_thoroughness)',
        healthyRange: [0.8, 1.0],
        criticalThreshold: 0.6,
      },
    ],
    interventionAuthority: {
      canAlert: true,
      canRecommend: true,
      canBlock: true,
      canEscalate: true,
      escalationTargets: ['risk_committee', 'cro'],
    },
  },
  {
    id: 'mga_automation_creep',
    name: 'Automation Creep Monitor',
    class: SGASAgentClass.META_GOVERNANCE,
    monitoringScope: {
      timeRange: {
        lookbackDays: 365,
        granularity: Granularity.MONTH,
        aggregationWindow: 3,
      },
      agentClasses: [SGASAgentClass.DECISION, SGASAgentClass.OBSERVER],
      institutionalTypes: [],
      decisionTypes: [DecisionType.OPERATIONAL, DecisionType.ALLOCATION],
    },
    detectionPatterns: [
      {
        id: 'pat_auto_decision_rate',
        name: 'Automated Decision Rate',
        type: DriftType.AUTOMATION_CREEP,
        threshold: 0.7, // More than 70% automated
        windowSize: 90,
        sensitivity: 0.75,
      },
      {
        id: 'pat_human_review_decline',
        name: 'Human Review Rate Decline',
        type: DriftType.HUMAN_OVERRIDE_DECAY,
        threshold: -0.1, // 10% decline per period
        windowSize: 180,
        sensitivity: 0.8,
      },
    ],
    governanceMetrics: [
      {
        id: 'gm_human_oversight',
        name: 'Human Oversight Index',
        description: 'Measure of human involvement in decision process',
        calculation: 'human_reviewed_decisions / total_decisions',
        healthyRange: [0.3, 1.0],
        criticalThreshold: 0.15,
      },
    ],
    interventionAuthority: {
      canAlert: true,
      canRecommend: true,
      canBlock: false,
      canEscalate: true,
      escalationTargets: ['technology_governance', 'ethics_board'],
    },
  },
  {
    id: 'mga_authority_concentration',
    name: 'Authority Concentration Monitor',
    class: SGASAgentClass.META_GOVERNANCE,
    monitoringScope: {
      timeRange: {
        lookbackDays: 180,
        granularity: Granularity.WEEK,
        aggregationWindow: 4,
      },
      agentClasses: [SGASAgentClass.INSTITUTIONAL],
      institutionalTypes: [
        InstitutionType.EXECUTIVE_AUTHORITY,
        InstitutionType.BUDGET_AUTHORITY,
        InstitutionType.PROCUREMENT_OFFICE,
      ],
      decisionTypes: [DecisionType.STRATEGIC, DecisionType.PROCUREMENT],
    },
    detectionPatterns: [
      {
        id: 'pat_approval_concentration',
        name: 'Approval Authority Concentration',
        type: DriftType.AUTHORITY_CONCENTRATION,
        threshold: 0.4, // One approver > 40% of decisions
        windowSize: 30,
        sensitivity: 0.85,
      },
      {
        id: 'pat_delegation_chain',
        name: 'Delegation Chain Length',
        type: DriftType.AUTHORITY_CONCENTRATION,
        threshold: 3, // Average delegation depth
        windowSize: 90,
        sensitivity: 0.7,
      },
    ],
    governanceMetrics: [
      {
        id: 'gm_authority_distribution',
        name: 'Authority Distribution Index',
        description: 'Gini coefficient of authority distribution',
        calculation: '1 - gini(approval_counts_by_authority)',
        healthyRange: [0.6, 1.0],
        criticalThreshold: 0.4,
      },
    ],
    interventionAuthority: {
      canAlert: true,
      canRecommend: true,
      canBlock: false,
      canEscalate: true,
      escalationTargets: ['governance_committee', 'audit_committee'],
    },
  },
];

// =============================================================================
// META-GOVERNANCE AGENTS SERVICE
// =============================================================================

export class MetaGovernanceAgentsService extends EventEmitter {
  private agents: Map<string, MetaGovernanceAgentConfig> = new Map();
  private executionHistory: Map<string, MetaGovernanceAgentOutput[]> = new Map();
  private historicalData: Map<string, number[]> = new Map();
  private interventionLog: Intervention[] = [];

  constructor() {
    super();
    this.initializeAgents();
    this.initializeHistoricalData();
  }

  private initializeAgents(): void {
    for (const agent of META_GOVERNANCE_AGENTS) {
      this.agents.set(agent.id, agent);
    }
  }

  private initializeHistoricalData(): void {
    // Initialize with empty arrays — real data populated by system events
    this.historicalData.set('emergency_ratio', []);
    this.historicalData.set('safeguard_strength', []);
    this.historicalData.set('human_oversight', []);
    this.historicalData.set('authority_distribution', []);
  }

  /**
   * Get all meta-governance agents
   */
  getAgents(): MetaGovernanceAgentConfig[] {
    return Array.from(this.agents.values());
  }

  /**
   * Get agent by ID
   */
  getAgent(agentId: string): MetaGovernanceAgentConfig | undefined {
    return this.agents.get(agentId);
  }

  /**
   * Execute meta-governance analysis
   */
  async executeAgent(
    agentId: string,
    seed?: number
  ): Promise<MetaGovernanceAgentOutput> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Meta-governance agent not found: ${agentId}`);
    }

    const executionSeed = seed ?? Date.now();
    const startTime = new Date();
    const rng = this.createSeededRandom(executionSeed);

    this.emit('agent:start', { agentId });

    try {
      // Detect drift warnings
      const driftWarnings = this.detectDrift(agent, rng);

      // Generate governance risk report
      const riskReport = this.generateRiskReport(agent, driftWarnings, rng);

      // Generate structural recommendations
      const recommendations = this.generateRecommendations(agent, driftWarnings, riskReport, rng);

      // Calculate system health score
      const healthScore = this.calculateHealthScore(agent, driftWarnings, riskReport);

      // Determine and execute interventions
      const interventions = this.executeInterventions(agent, driftWarnings, riskReport);

      const endTime = new Date();
      const inputHash = hashState({ agentId, seed: executionSeed });
      const outputHash = hashState({ driftWarnings, riskReport, recommendations });

      const output: MetaGovernanceAgentOutput = {
        agentId: agent.id,
        timestamp: startTime,
        analysisWindow: agent.monitoringScope.timeRange,
        driftWarnings,
        governanceRiskReport: riskReport,
        structuralRecommendations: recommendations,
        systemHealthScore: healthScore,
        interventionsTaken: interventions,
        executionMetadata: {
          startTime,
          endTime,
          durationMs: endTime.getTime() - startTime.getTime(),
          seed: executionSeed,
          inputHash,
          outputHash,
          resourcesUsed: {
            cpuMs: endTime.getTime() - startTime.getTime(),
            memoryMb: process.memoryUsage().heapUsed / 1024 / 1024,
            externalCalls: 0,
          },
          deterministic: true,
        },
      };

      // Store in history
      const history = this.executionHistory.get(agentId) || [];
      history.push(output);
      this.executionHistory.set(agentId, history);

      // Persist to DB
      try {
        await prisma.meta_governance_reports.create({
          data: {
            agent_id: agent.id,
            agent_name: agent.name,
            drift_warnings: JSON.parse(JSON.stringify(driftWarnings)),
            risk_report: JSON.parse(JSON.stringify(riskReport)),
            recommendations: JSON.parse(JSON.stringify(recommendations)),
            health_score: JSON.parse(JSON.stringify(healthScore)),
            interventions: JSON.parse(JSON.stringify(interventions)),
            analysis_window: JSON.parse(JSON.stringify(agent.monitoringScope.timeRange)),
            execution_seed: executionSeed,
            execution_ms: endTime.getTime() - startTime.getTime(),
          },
        });
      } catch (err) {
        // Non-critical — table may not exist yet
      }

      this.emit('agent:complete', { agentId, output });

      return output;
    } catch (error) {
      this.emit('agent:error', { agentId, error });
      throw error;
    }
  }

  /**
   * Execute all meta-governance agents
   */
  async executeAllAgents(seed?: number): Promise<MetaGovernanceAgentOutput[]> {
    const outputs: MetaGovernanceAgentOutput[] = [];
    const baseSeed = seed ?? Date.now();

    for (let i = 0; i < META_GOVERNANCE_AGENTS.length; i++) {
      const agent = META_GOVERNANCE_AGENTS[i];
      const agentSeed = baseSeed + i + 400;
      const output = await this.executeAgent(agent.id, agentSeed);
      outputs.push(output);
    }

    return outputs;
  }

  /**
   * Detect drift patterns
   */
  private detectDrift(agent: MetaGovernanceAgentConfig, rng: () => number): DriftWarning[] {
    const warnings: DriftWarning[] = [];

    for (const pattern of agent.detectionPatterns) {
      const evidence = this.gatherDriftEvidence(pattern, agent.monitoringScope.timeRange, rng);
      const isDrifting = this.isDriftDetected(evidence, pattern.threshold);

      if (isDrifting) {
        warnings.push({
          id: generateSGASId('drift'),
          type: pattern.type,
          severity: this.calculateDriftSeverity(evidence, pattern.threshold),
          description: this.generateDriftDescription(pattern.type, evidence),
          evidence,
          trend: this.calculateTrend(evidence),
          projectedImpact: this.projectImpact(pattern.type, evidence),
          timeToThreshold: this.estimateTimeToThreshold(evidence, pattern.threshold),
        });
      }
    }

    return warnings;
  }

  /**
   * Gather evidence for drift detection
   */
  private gatherDriftEvidence(
    pattern: MetaGovernanceAgentConfig['detectionPatterns'][0],
    timeRange: TimeRange,
    rng: () => number
  ): DriftEvidence[] {
    const evidence: DriftEvidence[] = [];

    // Get historical data based on pattern type
    let metricKey: string;
    switch (pattern.type) {
      case DriftType.EMERGENCY_POWER_OVERUSE:
        metricKey = 'emergency_ratio';
        break;
      case DriftType.SAFEGUARD_EROSION:
      case DriftType.PROCESS_BYPASS_NORMALIZATION:
        metricKey = 'safeguard_strength';
        break;
      case DriftType.AUTOMATION_CREEP:
      case DriftType.HUMAN_OVERRIDE_DECAY:
        metricKey = 'human_oversight';
        break;
      case DriftType.AUTHORITY_CONCENTRATION:
        metricKey = 'authority_distribution';
        break;
      default:
        metricKey = 'safeguard_strength';
    }

    const data = this.historicalData.get(metricKey) || [];
    const windowData = data.slice(-pattern.windowSize);

    if (windowData.length > 0) {
      const baseline = windowData.slice(0, Math.floor(windowData.length / 2))
        .reduce((a, b) => a + b, 0) / Math.floor(windowData.length / 2);
      const current = windowData.slice(-Math.floor(windowData.length / 4))
        .reduce((a, b) => a + b, 0) / Math.floor(windowData.length / 4);
      const drift = current - baseline;

      evidence.push({
        metric: pattern.name,
        baseline,
        current,
        drift,
        startDate: new Date(Date.now() - pattern.windowSize * 24 * 60 * 60 * 1000),
        measurements: windowData.length,
      });
    }

    return evidence;
  }

  /**
   * Check if drift is detected
   */
  private isDriftDetected(evidence: DriftEvidence[], threshold: number): boolean {
    if (evidence.length === 0) return false;
    
    return evidence.some(e => Math.abs(e.drift) > threshold * 0.5 || e.current > threshold);
  }

  /**
   * Calculate drift severity
   */
  private calculateDriftSeverity(evidence: DriftEvidence[], threshold: number): SeverityLevel {
    if (evidence.length === 0) return SeverityLevel.INFO;

    const maxDrift = Math.max(...evidence.map(e => Math.abs(e.drift)));
    const maxCurrent = Math.max(...evidence.map(e => e.current));

    if (maxCurrent > threshold * 1.5 || maxDrift > threshold) return SeverityLevel.CRITICAL;
    if (maxCurrent > threshold * 1.2 || maxDrift > threshold * 0.8) return SeverityLevel.ERROR;
    if (maxCurrent > threshold || maxDrift > threshold * 0.5) return SeverityLevel.WARNING;
    return SeverityLevel.INFO;
  }

  /**
   * Generate drift description
   */
  private generateDriftDescription(type: DriftType, evidence: DriftEvidence[]): string {
    const descriptions: Record<DriftType, string> = {
      [DriftType.EMERGENCY_POWER_OVERUSE]: 'Emergency powers being invoked more frequently than baseline',
      [DriftType.SAFEGUARD_EROSION]: 'Safeguards showing gradual weakening over time',
      [DriftType.AUTOMATION_CREEP]: 'Automated decision-making expanding beyond intended scope',
      [DriftType.HUMAN_OVERRIDE_DECAY]: 'Human oversight declining in frequency and thoroughness',
      [DriftType.AUTHORITY_CONCENTRATION]: 'Decision authority concentrating in fewer entities',
      [DriftType.PROCESS_BYPASS_NORMALIZATION]: 'Process bypasses becoming normalized behavior',
      [DriftType.CONSTRAINT_RELAXATION]: 'Constraints being gradually relaxed',
    };

    const base = descriptions[type] || 'Governance drift detected';
    if (evidence.length > 0) {
      const e = evidence[0];
      return `${base}. Current: ${(e.current * 100).toFixed(1)}% (baseline: ${(e.baseline * 100).toFixed(1)}%)`;
    }
    return base;
  }

  /**
   * Calculate trend from evidence
   */
  private calculateTrend(evidence: DriftEvidence[]): TrendDirection {
    if (evidence.length === 0) return TrendDirection.STABLE;

    const avgDrift = evidence.reduce((sum, e) => sum + e.drift, 0) / evidence.length;
    
    if (avgDrift > 0.05) return TrendDirection.DEGRADING;
    if (avgDrift < -0.05) return TrendDirection.IMPROVING;
    if (Math.abs(avgDrift) > 0.02) return TrendDirection.VOLATILE;
    return TrendDirection.STABLE;
  }

  /**
   * Project impact
   */
  private projectImpact(type: DriftType, evidence: DriftEvidence[]): string {
    const impacts: Record<DriftType, string> = {
      [DriftType.EMERGENCY_POWER_OVERUSE]: 'Risk of normalized emergency state undermining normal governance',
      [DriftType.SAFEGUARD_EROSION]: 'Increased vulnerability to undetected policy violations',
      [DriftType.AUTOMATION_CREEP]: 'Reduced human accountability and oversight capability',
      [DriftType.HUMAN_OVERRIDE_DECAY]: 'Loss of human judgment in critical decisions',
      [DriftType.AUTHORITY_CONCENTRATION]: 'Single point of failure and potential abuse risk',
      [DriftType.PROCESS_BYPASS_NORMALIZATION]: 'Systematic circumvention of governance controls',
      [DriftType.CONSTRAINT_RELAXATION]: 'Gradual loss of operational boundaries',
    };

    return impacts[type] || 'Potential governance integrity compromise';
  }

  /**
   * Estimate time to critical threshold
   */
  private estimateTimeToThreshold(evidence: DriftEvidence[], threshold: number): number | undefined {
    if (evidence.length === 0) return undefined;

    const e = evidence[0];
    if (e.drift <= 0) return undefined; // Not trending toward threshold

    const remaining = threshold - e.current;
    if (remaining <= 0) return 0; // Already exceeded

    // Days to threshold based on current drift rate per measurement period
    const daysPerMeasurement = 7; // Assume weekly measurements
    const measurementsToThreshold = remaining / (e.drift / e.measurements);
    
    return Math.ceil(measurementsToThreshold * daysPerMeasurement);
  }

  /**
   * Generate governance risk report
   */
  private generateRiskReport(
    agent: MetaGovernanceAgentConfig,
    warnings: DriftWarning[],
    rng: () => number
  ): GovernanceRiskReport {
    const riskCategories: GovernanceRiskCategory[] = [
      {
        category: 'Emergency Power Usage',
        riskLevel: this.categoryRiskLevel(warnings, DriftType.EMERGENCY_POWER_OVERUSE),
        score: 0.7 + rng() * 0.2,
        maxScore: 1.0,
        factors: [
          { name: 'Declaration Frequency', weight: 0.4, score: 0.6 + rng() * 0.3, direction: TrendDirection.STABLE },
          { name: 'Duration Compliance', weight: 0.3, score: 0.7 + rng() * 0.2, direction: TrendDirection.STABLE },
          { name: 'Justification Quality', weight: 0.3, score: 0.8 + rng() * 0.15, direction: TrendDirection.STABLE },
        ],
      },
      {
        category: 'Safeguard Integrity',
        riskLevel: this.categoryRiskLevel(warnings, DriftType.SAFEGUARD_EROSION),
        score: 0.75 + rng() * 0.15,
        maxScore: 1.0,
        factors: [
          { name: 'Constraint Adherence', weight: 0.35, score: 0.8 + rng() * 0.15, direction: TrendDirection.STABLE },
          { name: 'Audit Coverage', weight: 0.35, score: 0.7 + rng() * 0.2, direction: TrendDirection.STABLE },
          { name: 'Review Thoroughness', weight: 0.3, score: 0.75 + rng() * 0.2, direction: TrendDirection.STABLE },
        ],
      },
      {
        category: 'Human Oversight',
        riskLevel: this.categoryRiskLevel(warnings, DriftType.HUMAN_OVERRIDE_DECAY),
        score: 0.65 + rng() * 0.25,
        maxScore: 1.0,
        factors: [
          { name: 'Review Rate', weight: 0.4, score: 0.6 + rng() * 0.25, direction: TrendDirection.DEGRADING },
          { name: 'Override Usage', weight: 0.3, score: 0.7 + rng() * 0.2, direction: TrendDirection.STABLE },
          { name: 'Escalation Frequency', weight: 0.3, score: 0.75 + rng() * 0.2, direction: TrendDirection.STABLE },
        ],
      },
      {
        category: 'Authority Distribution',
        riskLevel: this.categoryRiskLevel(warnings, DriftType.AUTHORITY_CONCENTRATION),
        score: 0.8 + rng() * 0.15,
        maxScore: 1.0,
        factors: [
          { name: 'Approval Distribution', weight: 0.4, score: 0.8 + rng() * 0.15, direction: TrendDirection.STABLE },
          { name: 'Delegation Compliance', weight: 0.3, score: 0.85 + rng() * 0.1, direction: TrendDirection.STABLE },
          { name: 'Separation of Duties', weight: 0.3, score: 0.75 + rng() * 0.2, direction: TrendDirection.STABLE },
        ],
      },
    ];

    const overallScore = riskCategories.reduce(
      (sum, c) => sum + c.score,
      0
    ) / riskCategories.length;

    const previousScore = overallScore * (0.95 + rng() * 0.1);

    return {
      overallRiskLevel: this.scoreToRiskLevel(overallScore),
      riskCategories,
      comparisonToPrevious: {
        previousPeriodScore: previousScore,
        currentPeriodScore: overallScore,
        change: overallScore - previousScore,
        changeDirection: overallScore >= previousScore ? TrendDirection.IMPROVING : TrendDirection.DEGRADING,
      },
      keyFindings: this.generateKeyFindings(warnings, riskCategories),
      urgentIssues: warnings
        .filter(w => w.severity === SeverityLevel.CRITICAL)
        .map(w => w.description),
    };
  }

  /**
   * Determine risk level for a category based on warnings
   */
  private categoryRiskLevel(warnings: DriftWarning[], type: DriftType): RiskLevel {
    const relevantWarnings = warnings.filter(w => w.type === type);
    if (relevantWarnings.length === 0) return RiskLevel.LOW;

    const maxSeverity = Math.max(
      ...relevantWarnings.map(w => this.severityToNumber(w.severity))
    );

    if (maxSeverity >= 0.8) return RiskLevel.CRITICAL;
    if (maxSeverity >= 0.6) return RiskLevel.HIGH;
    if (maxSeverity >= 0.4) return RiskLevel.MEDIUM;
    return RiskLevel.LOW;
  }

  /**
   * Convert score to risk level
   */
  private scoreToRiskLevel(score: number): RiskLevel {
    if (score >= 0.9) return RiskLevel.NEGLIGIBLE;
    if (score >= 0.7) return RiskLevel.LOW;
    if (score >= 0.5) return RiskLevel.MEDIUM;
    if (score >= 0.3) return RiskLevel.HIGH;
    return RiskLevel.CRITICAL;
  }

  /**
   * Generate key findings
   */
  private generateKeyFindings(
    warnings: DriftWarning[],
    categories: GovernanceRiskCategory[]
  ): string[] {
    const findings: string[] = [];

    // Add warning-based findings
    for (const warning of warnings.slice(0, 3)) {
      findings.push(warning.description);
    }

    // Add category-based findings
    const lowCategories = categories.filter(c => c.score < 0.7);
    for (const cat of lowCategories) {
      findings.push(`${cat.category} below target threshold (${(cat.score * 100).toFixed(0)}%)`);
    }

    if (findings.length === 0) {
      findings.push('Governance metrics within acceptable ranges');
    }

    return findings.slice(0, 5);
  }

  /**
   * Generate structural recommendations
   */
  private generateRecommendations(
    agent: MetaGovernanceAgentConfig,
    warnings: DriftWarning[],
    report: GovernanceRiskReport,
    rng: () => number
  ): StructuralRecommendation[] {
    const recommendations: StructuralRecommendation[] = [];
    let priority = 1;

    // Recommendations based on drift warnings
    for (const warning of warnings) {
      recommendations.push(this.generateRecommendationForDrift(warning, priority++, rng));
    }

    // Recommendations based on low-scoring categories
    for (const category of report.riskCategories) {
      if (category.score < 0.7) {
        recommendations.push({
          id: generateSGASId('rec'),
          priority: priority++,
          category: RecommendationCategory.MONITORING,
          recommendation: `Enhance monitoring for ${category.category}`,
          rationale: `Current score (${(category.score * 100).toFixed(0)}%) below healthy threshold`,
          expectedImpact: 'Improved early detection and response capability',
          implementationComplexity: DifficultyLevel.MODERATE,
          timeframe: '4-6 weeks',
          dependencies: [],
        });
      }
    }

    // Add general recommendations if few specific ones
    if (recommendations.length < 3) {
      recommendations.push({
        id: generateSGASId('rec'),
        priority: priority++,
        category: RecommendationCategory.MONITORING,
        recommendation: 'Implement quarterly governance review cycle',
        rationale: 'Regular review prevents drift accumulation',
        expectedImpact: 'Proactive identification of governance issues',
        implementationComplexity: DifficultyLevel.EASY,
        timeframe: '2-4 weeks',
        dependencies: [],
      });
    }

    return recommendations.slice(0, 10);
  }

  /**
   * Generate recommendation for specific drift type
   */
  private generateRecommendationForDrift(
    warning: DriftWarning,
    priority: number,
    rng: () => number
  ): StructuralRecommendation {
    const recommendationsByType: Record<DriftType, { category: RecommendationCategory; text: string }> = {
      [DriftType.EMERGENCY_POWER_OVERUSE]: {
        category: RecommendationCategory.PROCESS,
        text: 'Implement stricter emergency declaration criteria and mandatory cooling-off periods',
      },
      [DriftType.SAFEGUARD_EROSION]: {
        category: RecommendationCategory.CONSTRAINT,
        text: 'Restore original constraint levels and implement drift detection alerts',
      },
      [DriftType.AUTOMATION_CREEP]: {
        category: RecommendationCategory.AUTOMATION,
        text: 'Establish clear automation boundaries and mandatory human checkpoints',
      },
      [DriftType.HUMAN_OVERRIDE_DECAY]: {
        category: RecommendationCategory.PROCESS,
        text: 'Mandate periodic human review of automated decisions',
      },
      [DriftType.AUTHORITY_CONCENTRATION]: {
        category: RecommendationCategory.AUTHORITY,
        text: 'Implement rotation policies and multi-party approval requirements',
      },
      [DriftType.PROCESS_BYPASS_NORMALIZATION]: {
        category: RecommendationCategory.PROCESS,
        text: 'Reset process requirements and implement bypass tracking',
      },
      [DriftType.CONSTRAINT_RELAXATION]: {
        category: RecommendationCategory.CONSTRAINT,
        text: 'Require formal approval for any constraint modifications',
      },
    };

    const rec = recommendationsByType[warning.type];

    return {
      id: generateSGASId('rec'),
      priority,
      category: rec.category,
      recommendation: rec.text,
      rationale: warning.description,
      expectedImpact: warning.projectedImpact,
      implementationComplexity: warning.severity === SeverityLevel.CRITICAL
        ? DifficultyLevel.DIFFICULT
        : DifficultyLevel.MODERATE,
      timeframe: warning.severity === SeverityLevel.CRITICAL
        ? '1-2 weeks'
        : '4-8 weeks',
      dependencies: [],
    };
  }

  /**
   * Calculate system health score
   */
  private calculateHealthScore(
    agent: MetaGovernanceAgentConfig,
    warnings: DriftWarning[],
    report: GovernanceRiskReport
  ): SystemHealthScore {
    const components: HealthComponent[] = [
      {
        name: 'Governance Integrity',
        score: report.riskCategories.reduce((s, c) => s + c.score, 0) / report.riskCategories.length,
        weight: 0.3,
        status: this.scoreToHealthStatus(report.riskCategories[1]?.score || 0.5),
      },
      {
        name: 'Human Oversight',
        score: report.riskCategories[2]?.score || 0.5,
        weight: 0.25,
        status: this.scoreToHealthStatus(report.riskCategories[2]?.score || 0.5),
      },
      {
        name: 'Authority Balance',
        score: report.riskCategories[3]?.score || 0.5,
        weight: 0.25,
        status: this.scoreToHealthStatus(report.riskCategories[3]?.score || 0.5),
      },
      {
        name: 'Drift Resistance',
        score: warnings.length === 0 ? 0.9 : Math.max(0.3, 0.9 - warnings.length * 0.15),
        weight: 0.2,
        status: warnings.length === 0 ? HealthStatus.HEALTHY : 
          warnings.length <= 2 ? HealthStatus.DEGRADED : HealthStatus.UNHEALTHY,
      },
    ];

    const overall = components.reduce(
      (sum, c) => sum + c.score * c.weight,
      0
    );

    const trend = warnings.some(w => w.trend === TrendDirection.DEGRADING)
      ? TrendDirection.DEGRADING
      : TrendDirection.STABLE;

    return {
      overall,
      components,
      trend,
      lastUpdated: new Date(),
    };
  }

  /**
   * Convert score to health status
   */
  private scoreToHealthStatus(score: number): HealthStatus {
    if (score >= 0.85) return HealthStatus.HEALTHY;
    if (score >= 0.7) return HealthStatus.DEGRADED;
    if (score >= 0.5) return HealthStatus.UNHEALTHY;
    return HealthStatus.CRITICAL;
  }

  /**
   * Execute interventions based on analysis
   */
  private executeInterventions(
    agent: MetaGovernanceAgentConfig,
    warnings: DriftWarning[],
    report: GovernanceRiskReport
  ): Intervention[] {
    const interventions: Intervention[] = [];

    // Alert for any warnings
    if (warnings.length > 0 && agent.interventionAuthority.canAlert) {
      interventions.push({
        id: generateSGASId('int'),
        type: InterventionType.ALERT,
        reason: `${warnings.length} drift warning(s) detected`,
        target: 'governance_monitoring',
        timestamp: new Date(),
        outcome: 'Alert logged and notification queued',
        reversible: false,
      });
    }

    // Escalate critical issues
    const criticalWarnings = warnings.filter(w => w.severity === SeverityLevel.CRITICAL);
    if (criticalWarnings.length > 0 && agent.interventionAuthority.canEscalate) {
      interventions.push({
        id: generateSGASId('int'),
        type: InterventionType.ESCALATION,
        reason: `Critical governance drift: ${criticalWarnings[0].description}`,
        target: agent.interventionAuthority.escalationTargets.join(', '),
        timestamp: new Date(),
        outcome: 'Escalation initiated',
        reversible: false,
      });
    }

    // Trigger audit for high risk
    if (report.overallRiskLevel === RiskLevel.HIGH || report.overallRiskLevel === RiskLevel.CRITICAL) {
      interventions.push({
        id: generateSGASId('int'),
        type: InterventionType.AUDIT_TRIGGER,
        reason: 'Governance risk level exceeds threshold',
        target: 'audit_committee',
        timestamp: new Date(),
        outcome: 'Audit cycle initiated',
        reversible: false,
      });
    }

    // Log interventions
    this.interventionLog.push(...interventions);

    return interventions;
  }

  /**
   * Convert severity to number
   */
  private severityToNumber(severity: SeverityLevel): number {
    const mapping: Record<SeverityLevel, number> = {
      [SeverityLevel.INFO]: 0.1,
      [SeverityLevel.WARNING]: 0.4,
      [SeverityLevel.ERROR]: 0.6,
      [SeverityLevel.CRITICAL]: 0.8,
      [SeverityLevel.CATASTROPHIC]: 1.0,
    };
    return mapping[severity];
  }

  /**
   * Create seeded random number generator
   */
  private createSeededRandom(seed: number): () => number {
    let state = seed;
    return () => {
      state = (state * 1103515245 + 12345) & 0x7fffffff;
      return state / 0x7fffffff;
    };
  }

  /**
   * Get intervention log
   */
  getInterventionLog(): Intervention[] {
    return [...this.interventionLog];
  }

  /**
   * Get execution history
   */
  getExecutionHistory(agentId: string): MetaGovernanceAgentOutput[] {
    return this.executionHistory.get(agentId) || [];
  }

  /**
   * Aggregate meta-governance outputs
   */
  aggregateOutputs(outputs: MetaGovernanceAgentOutput[]): {
    systemWideHealthScore: number;
    allDriftWarnings: DriftWarning[];
    criticalIssues: string[];
    prioritizedRecommendations: StructuralRecommendation[];
    interventionSummary: { type: InterventionType; count: number }[];
  } {
    const allWarnings = outputs.flatMap(o => o.driftWarnings);
    const allRecommendations = outputs.flatMap(o => o.structuralRecommendations);
    const allInterventions = outputs.flatMap(o => o.interventionsTaken);

    const healthScores = outputs.map(o => o.systemHealthScore.overall);
    const systemWideHealthScore = healthScores.length > 0
      ? healthScores.reduce((a, b) => a + b, 0) / healthScores.length
      : 0;

    const criticalIssues = allWarnings
      .filter(w => w.severity === SeverityLevel.CRITICAL)
      .map(w => w.description);

    const prioritizedRecommendations = [...allRecommendations]
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 10);

    // Count interventions by type
    const interventionCounts = new Map<InterventionType, number>();
    for (const intervention of allInterventions) {
      const count = interventionCounts.get(intervention.type) || 0;
      interventionCounts.set(intervention.type, count + 1);
    }

    const interventionSummary = Array.from(interventionCounts.entries()).map(
      ([type, count]) => ({ type, count })
    );

    return {
      systemWideHealthScore,
      allDriftWarnings: allWarnings,
      criticalIssues,
      prioritizedRecommendations,
      interventionSummary,
    };
  }
}

// Export singleton instance
export const metaGovernanceAgentsService = new MetaGovernanceAgentsService();
export default metaGovernanceAgentsService;
