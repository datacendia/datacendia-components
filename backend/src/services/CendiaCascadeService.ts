// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * CENDIA CASCADE SERVICE (THE BUTTERFLY EFFECT)
 * =============================================================================
 * @deprecated This service has been MERGED into CendiaHorizonService.
 * Use `import { cendiaHorizonService, cascadeService } from './CendiaHorizonService.js'` instead.
 * 
 * The cascade functionality is now available via:
 * - cendiaHorizonService.analyzeChange(changeSpec)
 * - cendiaHorizonService.getCascadeReport(id)
 * - cendiaHorizonService.listCascadeReports()
 * - cendiaHorizonService.signCascadeReport(id, signerId)
 * - cendiaHorizonService.updateCascadeReportStatus(id, status)
 * 
 * CendiaOrbit remains the internal graph traversal engine.
 * =============================================================================
 * 
 * Second/Third-Order Consequence Engine
 * 
 * "Your competitors play chess thinking one move ahead. CendiaCascade™ 
 * simulates the board 5 moves deep. It prevents you from making profitable 
 * decisions that are actually fatal."
 * 
 * The Problem: "Fixes that Fail"
 * - A decision looks good on a spreadsheet but destroys value in reality
 * - Executives are good at 1st-order thinking ("If we fire 10%, costs go down")
 * - They're terrible at 2nd/3rd-order ("...morale drops, best engineer quits, 
 *   server crashes, biggest client lost")
 * 
 * The Solution:
 * - Trace decisions through your Knowledge Graph
 * - Find the distant nodes that will "vibrate"
 * - Visualize the cascade timeline (T+0, T+30, T+1Y)
 * - Generate mitigations and guardrails
 * 
 * This service orchestrates CendiaOrbit (the engine) into an enterprise-grade
 * consequence management workflow.
 */

import { EventEmitter } from 'events';
import crypto from 'crypto';
import {
  orbitService,
  CendiaOrbitService,
  OrbitRunResult,
  InfluenceResult,
  NodeType,
  OrbitNode,
  OrbitEdge,
  EdgeType,
} from './CendiaOrbitService.js';
import { persistServiceRecord, loadServiceRecords } from '../utils/servicePersistence.js';
import { logger } from '../utils/logger.js';

// =============================================================================
// TYPES
// =============================================================================

export enum ChangeType {
  POLICY = 'policy',
  PRICING = 'pricing',
  STAFFING = 'staffing',
  VENDOR = 'vendor',
  TECHNOLOGY = 'technology',
  PROCESS = 'process',
  PRODUCT = 'product',
  MARKET = 'market',
  REGULATORY = 'regulatory',
  SECURITY = 'security',
  DATA = 'data',
}

export enum ImpactCategory {
  FINANCIAL = 'financial',
  OPERATIONAL = 'operational',
  REPUTATIONAL = 'reputational',
  COMPLIANCE = 'compliance',
  SECURITY = 'security',
  HUMAN = 'human',
  STRATEGIC = 'strategic',
}

export enum Severity {
  MINIMAL = 'minimal',
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum Likelihood {
  RARE = 'rare',
  UNLIKELY = 'unlikely',
  POSSIBLE = 'possible',
  LIKELY = 'likely',
  ALMOST_CERTAIN = 'almost_certain',
}

export interface ChangeSpec {
  id?: string;
  type: ChangeType;
  title: string;
  description: string;
  affectedAssets: string[];       // Node IDs in the graph
  expectedBenefit: string;
  constraints?: {
    budgetCeiling?: number;
    timelineDays?: number;
    complianceRequirements?: string[];
    noGoLines?: string[];         // Ethical/safety boundaries
  };
  proposedBy?: string;
  proposedAt?: Date;
}

export interface ConsequenceAssessment {
  nodeId: string;
  nodeName: string;
  nodeType: NodeType;
  category: ImpactCategory;
  description: string;
  severity: Severity;
  likelihood: Likelihood;
  riskScore: number;              // severity * likelihood (0-25)
  latencyDays: number;
  order: number;                  // 1st, 2nd, 3rd order effect
  confidence: number;
  evidenceBasis: 'measured' | 'derived' | 'inferred' | 'assumed';
  pathDescription: string;
}

export interface Mitigation {
  id: string;
  targetConsequence: string;      // ConsequenceAssessment reference
  type: 'prevent' | 'detect' | 'respond' | 'transfer';
  description: string;
  implementation: string;
  cost?: number;
  effectivenessScore: number;     // 0-1
  owner?: string;
  deadline?: Date;
}

export interface Guardrail {
  id: string;
  type: 'canary' | 'tripwire' | 'circuit_breaker' | 'rollback_trigger';
  condition: string;
  action: string;
  threshold?: number;
  monitoringFrequency?: string;
}

export interface CascadeTimeline {
  tZero: {
    date: Date;
    event: string;
    directEffects: string[];
  };
  tShort: {                       // T+30 days
    date: Date;
    effects: ConsequenceAssessment[];
  };
  tMedium: {                      // T+90 days
    date: Date;
    effects: ConsequenceAssessment[];
  };
  tLong: {                        // T+1 year
    date: Date;
    effects: ConsequenceAssessment[];
  };
}

export interface CascadeReport {
  id: string;
  changeSpec: ChangeSpec;
  timestamp: Date;
  status: 'draft' | 'in_review' | 'approved' | 'rejected' | 'executed';
  
  // Analysis
  orbitRunId: string;
  timeline: CascadeTimeline;
  consequences: ConsequenceAssessment[];
  
  // Risk Summary
  totalRiskScore: number;
  highestRiskConsequence?: ConsequenceAssessment;
  butterflyEffect?: ConsequenceAssessment;  // The unexpected distant consequence
  feedbackLoops: string[][];
  
  // Mitigations
  mitigations: Mitigation[];
  guardrails: Guardrail[];
  
  // Alternatives
  alternatives?: {
    description: string;
    riskDelta: number;            // How much lower/higher risk
    tradeoffs: string[];
  }[];
  
  // Governance
  recommendation: 'proceed' | 'proceed_with_caution' | 'reconsider' | 'reject';
  rationale: string;
  requiredApprovals?: string[];
  
  // Evidence
  evidenceHash: string;
  signedBy?: string;
  signedAt?: Date;
}

export interface LensAnalysis {
  lens: string;
  findings: string[];
  riskFactors: string[];
  opportunities: string[];
  score: number;
}

// =============================================================================
// CASCADE SERVICE
// =============================================================================

export class CendiaCascadeService extends EventEmitter {
  private orbit: CendiaOrbitService;
  private reports: Map<string, CascadeReport> = new Map();

  constructor(orbitInstance?: CendiaOrbitService) {
    super();
    this.orbit = orbitInstance || orbitService;


    this.loadFromDB().catch(() => {});
  }

  // ---------------------------------------------------------------------------
  // MAIN WORKFLOW
  // ---------------------------------------------------------------------------

  /**
   * Analyze a proposed change and generate a full cascade report
   */
  async analyzeChange(changeSpec: ChangeSpec): Promise<CascadeReport> {
    const reportId = crypto.randomUUID();
    const timestamp = new Date();

    this.emit('analysis:started', { reportId, changeSpec });

    // Step 1: Run propagation for each affected asset
    const allConsequences: ConsequenceAssessment[] = [];
    let orbitRunId = '';

    for (const assetId of changeSpec.affectedAssets) {
      const orbitResult = await this.orbit.runPropagation(
        assetId,
        changeSpec.description,
        1.0,
        {
          maxDepth: 5,
          minProbability: 0.05,
          timeHorizonDays: 365,
        }
      );
      
      orbitRunId = orbitResult.runId;

      // Convert orbit results to consequence assessments
      const consequences = this.convertToConsequences(orbitResult, changeSpec);
      allConsequences.push(...consequences);
    }

    // Step 2: Deduplicate and merge consequences
    const mergedConsequences = this.mergeConsequences(allConsequences);

    // Step 3: Build timeline
    const timeline = this.buildTimeline(mergedConsequences, changeSpec);

    // Step 4: Find feedback loops
    const feedbackLoops = this.orbit.findFeedbackLoops(4);

    // Step 5: Identify the "Butterfly Effect" - the surprising distant consequence
    const butterflyEffect = this.findButterflyEffect(mergedConsequences);

    // Step 6: Generate mitigations
    const mitigations = this.generateMitigations(mergedConsequences, changeSpec);

    // Step 7: Generate guardrails
    const guardrails = this.generateGuardrails(mergedConsequences, changeSpec);

    // Step 8: Run multi-lens analysis
    const lensAnalyses = await this.runMultiLensAnalysis(mergedConsequences, changeSpec);

    // Step 9: Calculate total risk and generate recommendation
    const totalRiskScore = this.calculateTotalRisk(mergedConsequences);
    const recommendation = this.generateRecommendation(totalRiskScore, mergedConsequences, changeSpec);

    // Step 10: Generate alternatives
    const alternatives = this.generateAlternatives(changeSpec, mergedConsequences);

    // Build report
    const report: CascadeReport = {
      id: reportId,
      changeSpec: {
        ...changeSpec,
        id: changeSpec.id || crypto.randomUUID(),
        proposedAt: changeSpec.proposedAt || timestamp,
      },
      timestamp,
      status: 'draft',
      orbitRunId,
      timeline,
      consequences: mergedConsequences,
      totalRiskScore,
      highestRiskConsequence: mergedConsequences.length > 0 
        ? mergedConsequences.reduce((max, c) => c.riskScore > max.riskScore ? c : max)
        : undefined,
      butterflyEffect,
      feedbackLoops,
      mitigations,
      guardrails,
      alternatives,
      recommendation: recommendation.action,
      rationale: recommendation.rationale,
      requiredApprovals: recommendation.requiredApprovals,
      evidenceHash: this.hashReport(reportId, mergedConsequences),
    };

    this.reports.set(reportId, report);
    this.emit('analysis:complete', report);

    return report;
  }

  // ---------------------------------------------------------------------------
  // CONSEQUENCE ANALYSIS
  // ---------------------------------------------------------------------------

  private convertToConsequences(
    orbitResult: OrbitRunResult,
    changeSpec: ChangeSpec
  ): ConsequenceAssessment[] {
    const consequences: ConsequenceAssessment[] = [];

    const processImpacts = (impacts: InfluenceResult[], order: number) => {
      for (const impact of impacts) {
        const category = this.categorizeImpact(impact.nodeType);
        const severity = this.scoreSeverity(impact.impactScore);
        const likelihood = this.scoreLikelihood(impact.confidence);

        consequences.push({
          nodeId: impact.nodeId,
          nodeName: impact.nodeName,
          nodeType: impact.nodeType,
          category,
          description: this.describeConsequence(impact, changeSpec, order),
          severity,
          likelihood,
          riskScore: this.calculateRiskScore(severity, likelihood),
          latencyDays: impact.latencyDays,
          order,
          confidence: impact.confidence,
          evidenceBasis: this.determineEvidenceBasis(impact),
          pathDescription: this.describePath(impact.paths[0]),
        });
      }
    };

    processImpacts(orbitResult.directImpacts, 1);
    processImpacts(orbitResult.rippleImpacts, 2);
    processImpacts(orbitResult.butterflyImpacts, 3);

    return consequences;
  }

  private categorizeImpact(nodeType: NodeType): ImpactCategory {
    const mapping: Record<NodeType, ImpactCategory> = {
      [NodeType.METRIC]: ImpactCategory.FINANCIAL,
      [NodeType.PROCESS]: ImpactCategory.OPERATIONAL,
      [NodeType.CUSTOMER]: ImpactCategory.REPUTATIONAL,
      [NodeType.POLICY]: ImpactCategory.COMPLIANCE,
      [NodeType.CONTROL]: ImpactCategory.SECURITY,
      [NodeType.PERSON]: ImpactCategory.HUMAN,
      [NodeType.TEAM]: ImpactCategory.HUMAN,
      [NodeType.DEPARTMENT]: ImpactCategory.OPERATIONAL,
      [NodeType.SYSTEM]: ImpactCategory.OPERATIONAL,
      [NodeType.VENDOR]: ImpactCategory.OPERATIONAL,
      [NodeType.PRODUCT]: ImpactCategory.STRATEGIC,
      [NodeType.ASSET]: ImpactCategory.FINANCIAL,
      [NodeType.DECISION]: ImpactCategory.STRATEGIC,
      [NodeType.RISK]: ImpactCategory.COMPLIANCE,
    };
    return mapping[nodeType] || ImpactCategory.OPERATIONAL;
  }

  private scoreSeverity(impactScore: number): Severity {
    if (impactScore >= 0.8) return Severity.CRITICAL;
    if (impactScore >= 0.6) return Severity.HIGH;
    if (impactScore >= 0.4) return Severity.MODERATE;
    if (impactScore >= 0.2) return Severity.LOW;
    return Severity.MINIMAL;
  }

  private scoreLikelihood(confidence: number): Likelihood {
    if (confidence >= 0.8) return Likelihood.ALMOST_CERTAIN;
    if (confidence >= 0.6) return Likelihood.LIKELY;
    if (confidence >= 0.4) return Likelihood.POSSIBLE;
    if (confidence >= 0.2) return Likelihood.UNLIKELY;
    return Likelihood.RARE;
  }

  private calculateRiskScore(severity: Severity, likelihood: Likelihood): number {
    const severityValues: Record<Severity, number> = {
      [Severity.MINIMAL]: 1,
      [Severity.LOW]: 2,
      [Severity.MODERATE]: 3,
      [Severity.HIGH]: 4,
      [Severity.CRITICAL]: 5,
    };
    const likelihoodValues: Record<Likelihood, number> = {
      [Likelihood.RARE]: 1,
      [Likelihood.UNLIKELY]: 2,
      [Likelihood.POSSIBLE]: 3,
      [Likelihood.LIKELY]: 4,
      [Likelihood.ALMOST_CERTAIN]: 5,
    };
    return severityValues[severity] * likelihoodValues[likelihood];
  }

  private determineEvidenceBasis(impact: InfluenceResult): 'measured' | 'derived' | 'inferred' | 'assumed' {
    if (impact.confidence >= 0.8 && impact.order === 1) return 'measured';
    if (impact.confidence >= 0.6) return 'derived';
    if (impact.confidence >= 0.3) return 'inferred';
    return 'assumed';
  }

  private describeConsequence(
    impact: InfluenceResult,
    changeSpec: ChangeSpec,
    order: number
  ): string {
    const orderLabel = order === 1 ? 'Direct' : order === 2 ? 'Secondary' : 'Tertiary';
    return `${orderLabel} impact on ${impact.nodeName} (${impact.nodeType}): ` +
           `${Math.round(impact.impactScore * 100)}% affected within ${impact.latencyDays} days`;
  }

  private describePath(path: { nodes: string[]; edges: string[] } | undefined): string {
    if (!path) return 'Unknown path';
    return path.nodes.map(nodeId => {
      const node = this.orbit.getNode(nodeId);
      return node?.name || nodeId;
    }).join(' → ');
  }

  private mergeConsequences(consequences: ConsequenceAssessment[]): ConsequenceAssessment[] {
    const merged = new Map<string, ConsequenceAssessment>();
    
    for (const c of consequences) {
      const existing = merged.get(c.nodeId);
      if (existing) {
        // Keep the higher risk assessment
        if (c.riskScore > existing.riskScore) {
          merged.set(c.nodeId, c);
        }
      } else {
        merged.set(c.nodeId, c);
      }
    }

    return Array.from(merged.values()).sort((a, b) => b.riskScore - a.riskScore);
  }

  private findButterflyEffect(consequences: ConsequenceAssessment[]): ConsequenceAssessment | undefined {
    // The butterfly effect is a HIGH impact consequence that is 3rd+ order
    // and appears "surprising" (low confidence but high risk)
    const butterflies = consequences.filter(c => 
      c.order >= 3 && 
      c.riskScore >= 12 && 
      c.confidence < 0.5
    );

    if (butterflies.length === 0) return undefined;

    // Return the one with highest risk and lowest confidence (most surprising)
    return butterflies.reduce((best, curr) => {
      const bestSurprise = best.riskScore / best.confidence;
      const currSurprise = curr.riskScore / curr.confidence;
      return currSurprise > bestSurprise ? curr : best;
    });
  }

  // ---------------------------------------------------------------------------
  // TIMELINE
  // ---------------------------------------------------------------------------

  private buildTimeline(
    consequences: ConsequenceAssessment[],
    changeSpec: ChangeSpec
  ): CascadeTimeline {
    const now = new Date();
    
    return {
      tZero: {
        date: now,
        event: changeSpec.title,
        directEffects: consequences
          .filter(c => c.order === 1)
          .map(c => c.description),
      },
      tShort: {
        date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        effects: consequences.filter(c => c.latencyDays <= 30),
      },
      tMedium: {
        date: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
        effects: consequences.filter(c => c.latencyDays > 30 && c.latencyDays <= 90),
      },
      tLong: {
        date: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000),
        effects: consequences.filter(c => c.latencyDays > 90),
      },
    };
  }

  // ---------------------------------------------------------------------------
  // MITIGATIONS & GUARDRAILS
  // ---------------------------------------------------------------------------

  private generateMitigations(
    consequences: ConsequenceAssessment[],
    changeSpec: ChangeSpec
  ): Mitigation[] {
    const mitigations: Mitigation[] = [];
    const highRiskConsequences = consequences.filter(c => c.riskScore >= 12);

    for (const consequence of highRiskConsequences) {
      // Generate prevention mitigation
      mitigations.push({
        id: crypto.randomUUID(),
        targetConsequence: consequence.nodeId,
        type: 'prevent',
        description: `Prevent ${consequence.severity} impact on ${consequence.nodeName}`,
        implementation: this.suggestPrevention(consequence, changeSpec),
        effectivenessScore: 0.7,
      });

      // Generate detection mitigation
      mitigations.push({
        id: crypto.randomUUID(),
        targetConsequence: consequence.nodeId,
        type: 'detect',
        description: `Monitor ${consequence.nodeName} for early warning signs`,
        implementation: `Set up alerts for ${consequence.nodeType} metrics with threshold at 80% of normal baseline`,
        effectivenessScore: 0.6,
      });

      // For critical consequences, add response plan
      if (consequence.severity === Severity.CRITICAL) {
        mitigations.push({
          id: crypto.randomUUID(),
          targetConsequence: consequence.nodeId,
          type: 'respond',
          description: `Response plan for ${consequence.nodeName} failure`,
          implementation: 'Activate incident response team, notify stakeholders, prepare rollback',
          effectivenessScore: 0.5,
        });
      }
    }

    return mitigations;
  }

  private suggestPrevention(consequence: ConsequenceAssessment, changeSpec: ChangeSpec): string {
    const suggestions: Record<ImpactCategory, string> = {
      [ImpactCategory.FINANCIAL]: 'Implement phased rollout with budget checkpoints',
      [ImpactCategory.OPERATIONAL]: 'Add redundancy and failover procedures',
      [ImpactCategory.REPUTATIONAL]: 'Prepare communications plan and customer notification',
      [ImpactCategory.COMPLIANCE]: 'Conduct compliance review before implementation',
      [ImpactCategory.SECURITY]: 'Perform security assessment and add access controls',
      [ImpactCategory.HUMAN]: 'Implement change management and training program',
      [ImpactCategory.STRATEGIC]: 'Establish governance checkpoints and executive review',
    };
    return suggestions[consequence.category] || 'Review and mitigate identified risks';
  }

  private generateGuardrails(
    consequences: ConsequenceAssessment[],
    changeSpec: ChangeSpec
  ): Guardrail[] {
    const guardrails: Guardrail[] = [];

    // Canary deployment
    guardrails.push({
      id: crypto.randomUUID(),
      type: 'canary',
      condition: 'Initial rollout to 5% of affected scope',
      action: 'Monitor for 7 days before expanding',
      threshold: 0.05,
      monitoringFrequency: 'hourly',
    });

    // Tripwires for high-risk consequences
    const criticalConsequences = consequences.filter(c => c.severity === Severity.CRITICAL);
    for (const c of criticalConsequences) {
      guardrails.push({
        id: crypto.randomUUID(),
        type: 'tripwire',
        condition: `${c.nodeName} deviation exceeds 20%`,
        action: 'Pause rollout and alert stakeholders',
        threshold: 0.2,
        monitoringFrequency: 'continuous',
      });
    }

    // Circuit breaker
    guardrails.push({
      id: crypto.randomUUID(),
      type: 'circuit_breaker',
      condition: 'Any critical metric drops below 50% baseline',
      action: 'Automatically halt all changes',
      threshold: 0.5,
    });

    // Rollback trigger
    guardrails.push({
      id: crypto.randomUUID(),
      type: 'rollback_trigger',
      condition: 'Combined risk score exceeds 80% of pre-approved limit',
      action: 'Initiate automatic rollback procedure',
      threshold: 0.8,
    });

    return guardrails;
  }

  // ---------------------------------------------------------------------------
  // MULTI-LENS ANALYSIS
  // ---------------------------------------------------------------------------

  private async runMultiLensAnalysis(
    consequences: ConsequenceAssessment[],
    changeSpec: ChangeSpec
  ): Promise<LensAnalysis[]> {
    const lenses = [
      this.runCFOLens(consequences),
      this.runCOOLens(consequences),
      this.runCISOLens(consequences),
      this.runPeopleLens(consequences),
      this.runEthicsLens(consequences, changeSpec),
    ];

    return lenses;
  }

  private runCFOLens(consequences: ConsequenceAssessment[]): LensAnalysis {
    const financialImpacts = consequences.filter(c => c.category === ImpactCategory.FINANCIAL);
    return {
      lens: 'CFO',
      findings: financialImpacts.map(c => c.description),
      riskFactors: financialImpacts
        .filter(c => c.severity >= Severity.HIGH)
        .map(c => `${c.nodeName}: ${c.severity} risk`),
      opportunities: ['Cost optimization potential', 'Revenue protection'],
      score: this.calculateLensScore(financialImpacts),
    };
  }

  private runCOOLens(consequences: ConsequenceAssessment[]): LensAnalysis {
    const operationalImpacts = consequences.filter(c => c.category === ImpactCategory.OPERATIONAL);
    return {
      lens: 'COO',
      findings: operationalImpacts.map(c => c.description),
      riskFactors: operationalImpacts
        .filter(c => c.severity >= Severity.HIGH)
        .map(c => `${c.nodeName}: potential bottleneck`),
      opportunities: ['Process improvement', 'Efficiency gains'],
      score: this.calculateLensScore(operationalImpacts),
    };
  }

  private runCISOLens(consequences: ConsequenceAssessment[]): LensAnalysis {
    const securityImpacts = consequences.filter(c => c.category === ImpactCategory.SECURITY);
    return {
      lens: 'CISO',
      findings: securityImpacts.map(c => c.description),
      riskFactors: securityImpacts
        .filter(c => c.severity >= Severity.MODERATE)
        .map(c => `${c.nodeName}: security exposure`),
      opportunities: ['Security posture improvement'],
      score: this.calculateLensScore(securityImpacts),
    };
  }

  private runPeopleLens(consequences: ConsequenceAssessment[]): LensAnalysis {
    const humanImpacts = consequences.filter(c => c.category === ImpactCategory.HUMAN);
    return {
      lens: 'People',
      findings: humanImpacts.map(c => c.description),
      riskFactors: humanImpacts
        .filter(c => c.severity >= Severity.MODERATE)
        .map(c => `${c.nodeName}: workload/morale risk`),
      opportunities: ['Team development', 'Change adoption'],
      score: this.calculateLensScore(humanImpacts),
    };
  }

  private runEthicsLens(consequences: ConsequenceAssessment[], changeSpec: ChangeSpec): LensAnalysis {
    const ethicalConcerns: string[] = [];
    
    // Check for disparate impact
    const humanImpacts = consequences.filter(c => c.category === ImpactCategory.HUMAN);
    if (humanImpacts.some(c => c.severity >= Severity.HIGH)) {
      ethicalConcerns.push('Potential disparate impact on workforce');
    }

    // Check for no-go violations
    if (changeSpec.constraints?.noGoLines) {
      for (const noGo of changeSpec.constraints.noGoLines) {
        const violated = consequences.some(c => 
          c.description.toLowerCase().includes(noGo.toLowerCase())
        );
        if (violated) {
          ethicalConcerns.push(`Potential violation of boundary: ${noGo}`);
        }
      }
    }

    return {
      lens: 'Ethics',
      findings: ethicalConcerns,
      riskFactors: ethicalConcerns,
      opportunities: ['Ethical leadership demonstration'],
      score: ethicalConcerns.length === 0 ? 100 : Math.max(0, 100 - ethicalConcerns.length * 20),
    };
  }

  private calculateLensScore(impacts: ConsequenceAssessment[]): number {
    if (impacts.length === 0) return 100;
    const avgRisk = impacts.reduce((sum, c) => sum + c.riskScore, 0) / impacts.length;
    return Math.max(0, 100 - avgRisk * 4);
  }

  // ---------------------------------------------------------------------------
  // RECOMMENDATIONS
  // ---------------------------------------------------------------------------

  private calculateTotalRisk(consequences: ConsequenceAssessment[]): number {
    return consequences.reduce((sum, c) => sum + c.riskScore, 0);
  }

  private generateRecommendation(
    totalRisk: number,
    consequences: ConsequenceAssessment[],
    changeSpec: ChangeSpec
  ): { action: CascadeReport['recommendation']; rationale: string; requiredApprovals?: string[] } {
    const criticalCount = consequences.filter(c => c.severity === Severity.CRITICAL).length;
    const highCount = consequences.filter(c => c.severity === Severity.HIGH).length;
    const hasButterfly = consequences.some(c => c.order >= 3 && c.riskScore >= 15);

    if (criticalCount >= 3 || totalRisk >= 100) {
      return {
        action: 'reject',
        rationale: `${criticalCount} critical consequences identified. Total risk score ${totalRisk} exceeds acceptable threshold.`,
        requiredApprovals: ['CEO', 'Board'],
      };
    }

    if (criticalCount >= 1 || hasButterfly) {
      return {
        action: 'reconsider',
        rationale: `Critical or unexpected long-range consequences detected. Recommend exploring alternatives.`,
        requiredApprovals: ['C-Suite', 'Risk Committee'],
      };
    }

    if (highCount >= 3 || totalRisk >= 50) {
      return {
        action: 'proceed_with_caution',
        rationale: `Significant risks identified. Implement with enhanced monitoring and guardrails.`,
        requiredApprovals: ['Department Head', 'Risk Officer'],
      };
    }

    return {
      action: 'proceed',
      rationale: `Acceptable risk profile. Standard governance applies.`,
      requiredApprovals: ['Manager'],
    };
  }

  private generateAlternatives(
    changeSpec: ChangeSpec,
    consequences: ConsequenceAssessment[]
  ): CascadeReport['alternatives'] {
    return [
      {
        description: 'Phased implementation over 6 months instead of immediate rollout',
        riskDelta: -30,
        tradeoffs: ['Slower time-to-value', 'Lower disruption risk'],
      },
      {
        description: 'Pilot with single department before organization-wide',
        riskDelta: -40,
        tradeoffs: ['Delayed full benefits', 'Better learning opportunity'],
      },
      {
        description: 'Maintain status quo with incremental improvements',
        riskDelta: -60,
        tradeoffs: ['No transformation benefits', 'Lowest risk'],
      },
    ];
  }

  // ---------------------------------------------------------------------------
  // EVIDENCE & SIGNING
  // ---------------------------------------------------------------------------

  private hashReport(reportId: string, consequences: ConsequenceAssessment[]): string {
    const data = JSON.stringify({ reportId, consequences, timestamp: Date.now() });
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  async signReport(reportId: string, signerId: string): Promise<void> {
    const report = this.reports.get(reportId);
    if (!report) throw new Error('Report not found');

    report.signedBy = signerId;
    report.signedAt = new Date();
    report.status = 'in_review';

    this.emit('report:signed', { reportId, signerId });
  }

  // ---------------------------------------------------------------------------
  // REPORT MANAGEMENT
  // ---------------------------------------------------------------------------

  getReport(reportId: string): CascadeReport | undefined {
    return this.reports.get(reportId);
  }

  listReports(): CascadeReport[] {
    return Array.from(this.reports.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  updateReportStatus(reportId: string, status: CascadeReport['status']): void {
    const report = this.reports.get(reportId);
    if (!report) throw new Error('Report not found');
    report.status = status;
    this.emit('report:status_changed', { reportId, status });
  }

  // ---------------------------------------------------------------------------
  // GRAPH HELPERS (Delegate to Orbit)
  // ---------------------------------------------------------------------------

  addNode(node: OrbitNode): void {
    this.orbit.addNode(node);
  }

  addEdge(edge: OrbitEdge): void {
    this.orbit.addEdge(edge);
  }

  loadGraph(data: { nodes: OrbitNode[]; edges: OrbitEdge[] }): void {
    this.orbit.loadGraph(data);
  }

  getGraphStats() {
    return this.orbit.getStats();
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'CendiaCascade', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.reports.has(d.id)) this.reports.set(d.id, d);


      }


      restored += recs.length;


      if (restored > 0) logger.info(`[CendiaCascadeService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[CendiaCascadeService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

export const cascadeService = new CendiaCascadeService();
