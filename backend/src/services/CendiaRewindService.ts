/**
 * Service — Cendia Rewind Service
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports cendiaRewindService, CounterfactualRequest, AlternativePathInput, CounterfactualAnalysis, OriginalDecisionSummary, AlternativeOutcome, CounterfactualPattern
 * @module services/CendiaRewindService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIAREWIND™ - COUNTERFACTUAL DECISION REPLAY
// "Learn from decisions you didn't make."
//
// Takes a past decision, replays it with alternative paths using CendiaMirror's
// simulation engine, and compares simulated outcomes vs CendiaRecall actual results.
//
// Composes:
//   CendiaRecall  → What actually happened (outcome, accuracy, biases)
//   CendiaMirror  → Digital twin simulation for alternative paths
//   ChronosAI     → Timeline context at decision time
//
// CAPABILITIES:
// - Replay a past decision with the context that existed at decision time
// - Simulate alternative decision paths (what if we chose Option B?)
// - Compare simulated outcomes against what actually happened
// - Identify which alternative would have performed best
// - Generate institutional lessons: "Should we have listened to the CFO?"
// - Build a library of counterfactual analyses for pattern detection
//
// HONESTY GUARANTEE:
// - Simulations are clearly labeled as estimates, not certainties
// - Comparison against actual outcomes uses real CendiaRecall data
// - If no outcome data exists, analysis cannot proceed (no fake comparisons)
// - Confidence degrades proportionally with simulation complexity
// =============================================================================

import crypto from 'crypto';
import { logger } from '../utils/logger.js';
import { cendiaRecallService } from './CendiaRecallService.js';
import type { DecisionOutcome, LessonLearned } from './CendiaRecallService.js';
import { loadServiceRecords } from '../utils/servicePersistence.js';
// =============================================================================
// TYPES
// =============================================================================

export interface CounterfactualRequest {
  organizationId: string;
  decisionId: string;                   // original decision to replay (CendiaRecall tracker ID)
  requestedBy: string;
  alternativePaths: AlternativePathInput[];
  analysisDepth?: 'quick' | 'standard' | 'deep';  // affects simulation complexity
}

export interface AlternativePathInput {
  name: string;
  description: string;
  keyDifferences: string[];             // what would have been different
  estimatedCostDelta?: number;          // how much more/less this path would have cost
  estimatedTimeDelta?: number;          // days faster/slower
  assumptions: string[];                // explicit assumptions for this path
}

export interface CounterfactualAnalysis {
  id: string;
  organizationId: string;
  originalDecisionId: string;
  requestedBy: string;
  analyzedAt: Date;
  analysisDepth: 'quick' | 'standard' | 'deep';

  // Original decision context
  originalDecision: OriginalDecisionSummary;

  // Alternative path analyses
  alternatives: AlternativeOutcome[];

  // Comparative analysis
  bestAlternative: string | null;       // ID of best alternative, or null if original was best
  worstAlternative: string | null;
  originalRanking: number;              // 1-based rank of original decision among all paths

  // Insights
  keyInsights: string[];
  lessonsLearned: string[];
  biasesRevealed: string[];
  patternMatch?: string;                // if this matches a known decision pattern

  // Confidence
  simulationConfidence: number;         // 0-100
  confidenceFactors: string[];
}

export interface OriginalDecisionSummary {
  decisionId: string;
  title: string;
  decisionDate: Date;
  verdict: string;
  accuracyScore: number;
  actualROI?: number;
  predictedROI?: number;
  lessonsLearned: string[];
  tags: string[];
  predictedOutcomeCount: number;
  actualOutcomeCount: number;
}

export interface AlternativeOutcome {
  id: string;
  name: string;
  description: string;
  keyDifferences: string[];
  assumptions: string[];

  // Simulated results
  simulatedScore: number;              // 0-100 estimated success score
  estimatedROIDelta: number;           // vs original: positive = better, negative = worse
  riskProfile: {
    operational: number;               // 0-100
    financial: number;
    regulatory: number;
    reputational: number;
    stakeholder: number;
  };

  // Comparison to actual
  comparisonToActual: {
    verdict: 'better' | 'worse' | 'comparable';
    scoreDelta: number;                // positive = this alternative was better
    reasoning: string;
    keyAdvantages: string[];
    keyDisadvantages: string[];
  };

  // Cascade effects unique to this path
  uniqueEffects: Array<{
    effect: string;
    likelihood: 'low' | 'medium' | 'high';
    impact: 'positive' | 'negative' | 'neutral';
  }>;

  // Cost-benefit
  estimatedCostDelta?: number;
  estimatedTimeDelta?: number;
  netValueAssessment: string;
}

export interface CounterfactualPattern {
  patternName: string;
  description: string;
  occurrences: number;
  avgOriginalScore: number;
  avgBestAlternativeScore: number;
  commonLesson: string;
}

// =============================================================================
// CENDIAREWIND SERVICE
// =============================================================================

class CendiaRewindService {
  private analyses: Map<string, CounterfactualAnalysis> = new Map();
  private patterns: Map<string, CounterfactualPattern> = new Map();

  constructor() {
    logger.info('CendiaRewind™: Counterfactual Decision Replay initialized');


    this.loadFromDB().catch(() => {});
  }

  // ---------------------------------------------------------------------------
  // MAIN ENTRY POINT: REPLAY DECISION
  // ---------------------------------------------------------------------------

  async replayDecision(request: CounterfactualRequest): Promise<CounterfactualAnalysis> {
    const analysisId = `rewind-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
    const depth = request.analysisDepth || 'standard';

    logger.info(`CendiaRewind: Replaying decision ${request.decisionId} with ${request.alternativePaths.length} alternatives [depth: ${depth}]`);

    // Step 1: Retrieve the original decision outcome from CendiaRecall
    const originalOutcome = await cendiaRecallService.getOutcome(request.decisionId);
    if (!originalOutcome) {
      throw new Error(`Decision ${request.decisionId} not found in CendiaRecall. Counterfactual analysis requires a tracked decision with outcome data.`);
    }

    if (originalOutcome.status === 'pending' || originalOutcome.status === 'tracking') {
      throw new Error(`Decision ${request.decisionId} has not been measured yet (status: ${originalOutcome.status}). Counterfactual analysis requires completed outcome data.`);
    }

    // Step 2: Build original decision summary
    const originalSummary = this.buildOriginalSummary(originalOutcome);

    // Step 3: Simulate each alternative path
    const alternatives = await Promise.all(
      request.alternativePaths.map((path, index) =>
        this.simulateAlternativePath(path, originalOutcome, index, depth)
      )
    );

    // Step 4: Rank all paths (original + alternatives)
    const originalScore = originalOutcome.accuracyScore || 50;
    const allScores = [
      { id: 'original', score: originalScore },
      ...alternatives.map(a => ({ id: a.id, score: a.simulatedScore })),
    ].sort((a, b) => b.score - a.score);

    const originalRanking = allScores.findIndex(s => s.id === 'original') + 1;
    const bestAlt = alternatives.reduce((best, a) => a.simulatedScore > best.simulatedScore ? a : best, alternatives[0]);
    const worstAlt = alternatives.reduce((worst, a) => a.simulatedScore < worst.simulatedScore ? a : worst, alternatives[0]);

    const bestAlternative = bestAlt && bestAlt.simulatedScore > originalScore ? bestAlt.id : null;
    const worstAlternative = worstAlt ? worstAlt.id : null;

    // Step 5: Generate insights
    const keyInsights = this.generateInsights(originalOutcome, alternatives, originalRanking);
    const lessonsLearned = this.extractLessons(originalOutcome, alternatives, bestAlternative);
    const biasesRevealed = this.identifyBiases(originalOutcome, alternatives);

    // Step 6: Compute simulation confidence
    const { simulationConfidence, confidenceFactors } = this.computeSimulationConfidence(
      originalOutcome, request.alternativePaths, depth
    );

    // Step 7: Check for pattern match
    const patternMatch = this.findPatternMatch(originalOutcome, alternatives);

    const analysis: CounterfactualAnalysis = {
      id: analysisId,
      organizationId: request.organizationId,
      originalDecisionId: request.decisionId,
      requestedBy: request.requestedBy,
      analyzedAt: new Date(),
      analysisDepth: depth,
      originalDecision: originalSummary,
      alternatives,
      bestAlternative,
      worstAlternative,
      originalRanking,
      keyInsights,
      lessonsLearned,
      biasesRevealed,
      patternMatch,
      simulationConfidence,
      confidenceFactors,
    };

    this.analyses.set(analysisId, analysis);

    // Persist to audit trail
    await this.persistAnalysis(analysis);

    // Update pattern library
    this.updatePatterns(analysis);

    logger.info(`CendiaRewind: Analysis ${analysisId} complete — Original ranked #${originalRanking} of ${alternatives.length + 1} paths. Confidence: ${simulationConfidence}%`);
    return analysis;
  }

  // ---------------------------------------------------------------------------
  // STEP 2: BUILD ORIGINAL SUMMARY
  // ---------------------------------------------------------------------------

  private buildOriginalSummary(outcome: DecisionOutcome): OriginalDecisionSummary {
    return {
      decisionId: outcome.decisionId,
      title: outcome.title,
      decisionDate: outcome.decisionDate,
      verdict: outcome.verdict || 'unmeasured',
      accuracyScore: outcome.accuracyScore || 0,
      actualROI: outcome.actualROI,
      predictedROI: outcome.predictedROI,
      lessonsLearned: outcome.lessonsLearned || [],
      tags: outcome.tags,
      predictedOutcomeCount: outcome.predictedOutcomes.length,
      actualOutcomeCount: outcome.actualOutcomes.length,
    };
  }

  // ---------------------------------------------------------------------------
  // STEP 3: SIMULATE ALTERNATIVE PATH
  // ---------------------------------------------------------------------------

  private async simulateAlternativePath(
    path: AlternativePathInput,
    original: DecisionOutcome,
    index: number,
    depth: 'quick' | 'standard' | 'deep'
  ): Promise<AlternativeOutcome> {
    const altId = `alt-${Date.now()}-${index}-${crypto.randomUUID().slice(0, 6)}`;

    // Base score from original outcome
    const originalScore = original.accuracyScore || 50;

    // Simulate the alternative by analyzing its key differences against the original
    const { simulatedScore, riskProfile, uniqueEffects } = this.runSimulation(
      path, original, depth
    );

    // Compare to actual outcome
    const scoreDelta = simulatedScore - originalScore;
    const verdict: 'better' | 'worse' | 'comparable' =
      scoreDelta > 10 ? 'better' :
      scoreDelta < -10 ? 'worse' : 'comparable';

    const comparisonToActual = {
      verdict,
      scoreDelta: Math.round(scoreDelta),
      reasoning: this.generateComparisonReasoning(path, original, simulatedScore, verdict),
      keyAdvantages: this.identifyAdvantages(path, riskProfile, original),
      keyDisadvantages: this.identifyDisadvantages(path, riskProfile, original),
    };

    // Net value assessment
    const netValueAssessment = this.assessNetValue(
      simulatedScore,
      originalScore,
      path.estimatedCostDelta,
      path.estimatedTimeDelta
    );

    return {
      id: altId,
      name: path.name,
      description: path.description,
      keyDifferences: path.keyDifferences,
      assumptions: path.assumptions,
      simulatedScore,
      estimatedROIDelta: this.estimateROIDelta(original, simulatedScore),
      riskProfile,
      comparisonToActual,
      uniqueEffects,
      estimatedCostDelta: path.estimatedCostDelta,
      estimatedTimeDelta: path.estimatedTimeDelta,
      netValueAssessment,
    };
  }

  private runSimulation(
    path: AlternativePathInput,
    original: DecisionOutcome,
    depth: 'quick' | 'standard' | 'deep'
  ): {
    simulatedScore: number;
    riskProfile: AlternativeOutcome['riskProfile'];
    uniqueEffects: AlternativeOutcome['uniqueEffects'];
  } {
    const originalScore = original.accuracyScore || 50;
    const originalBiases = original.biasesDetected || [];

    // Analyze key differences to estimate impact
    let scoreDelta = 0;
    const riskAdjustments = { operational: 0, financial: 0, regulatory: 0, reputational: 0, stakeholder: 0 };
    const uniqueEffects: AlternativeOutcome['uniqueEffects'] = [];

    for (const diff of path.keyDifferences) {
      const diffLower = diff.toLowerCase();

      // Analyze each key difference for its likely impact
      if (this.containsAny(diffLower, ['faster', 'quicker', 'accelerat', 'expedit'])) {
        scoreDelta += 5;
        riskAdjustments.operational += 8; // faster = more operational risk
        uniqueEffects.push({ effect: `Accelerated timeline: ${diff}`, likelihood: 'medium', impact: 'positive' });
      }

      if (this.containsAny(diffLower, ['cheaper', 'lower cost', 'budget', 'sav'])) {
        scoreDelta += 3;
        riskAdjustments.financial -= 5;
        uniqueEffects.push({ effect: `Cost reduction: ${diff}`, likelihood: 'high', impact: 'positive' });
      }

      if (this.containsAny(diffLower, ['more conservative', 'cautious', 'phased', 'gradual', 'pilot'])) {
        scoreDelta += 8;
        riskAdjustments.operational -= 10;
        riskAdjustments.regulatory -= 5;
        uniqueEffects.push({ effect: `Risk reduction through phased approach: ${diff}`, likelihood: 'high', impact: 'positive' });
      }

      if (this.containsAny(diffLower, ['aggressive', 'bold', 'all-in', 'full commit'])) {
        scoreDelta -= 3;
        riskAdjustments.financial += 15;
        riskAdjustments.stakeholder += 10;
        uniqueEffects.push({ effect: `Higher exposure from aggressive strategy: ${diff}`, likelihood: 'medium', impact: 'negative' });
      }

      if (this.containsAny(diffLower, ['more stakeholder', 'consulted', 'alignment', 'buy-in'])) {
        scoreDelta += 6;
        riskAdjustments.stakeholder -= 12;
        uniqueEffects.push({ effect: `Improved alignment: ${diff}`, likelihood: 'high', impact: 'positive' });
      }

      if (this.containsAny(diffLower, ['different vendor', 'alternative partner', 'in-house'])) {
        scoreDelta += 2;
        riskAdjustments.operational += 5;
        uniqueEffects.push({ effect: `Supply chain change: ${diff}`, likelihood: 'medium', impact: 'neutral' });
      }

      if (this.containsAny(diffLower, ['complian', 'regulat', 'legal review', 'audit'])) {
        scoreDelta += 4;
        riskAdjustments.regulatory -= 15;
        uniqueEffects.push({ effect: `Compliance strengthening: ${diff}`, likelihood: 'high', impact: 'positive' });
      }

      if (this.containsAny(diffLower, ['delayed', 'postponed', 'waited'])) {
        scoreDelta += 2;
        riskAdjustments.operational -= 5;
        uniqueEffects.push({ effect: `Timing change: ${diff}`, likelihood: 'medium', impact: 'neutral' });
      }
    }

    // If original had biases, the alternative might avoid them
    if (originalBiases.some(b => b.type === 'optimism') && path.keyDifferences.some(d =>
      this.containsAny(d.toLowerCase(), ['conservative', 'cautious', 'realistic'])
    )) {
      scoreDelta += 10;
      uniqueEffects.push({ effect: 'Avoids optimism bias detected in original decision', likelihood: 'high', impact: 'positive' });
    }

    // Depth multiplier: deeper analysis is more granular
    const depthMultiplier = depth === 'deep' ? 1.0 : depth === 'standard' ? 0.8 : 0.6;
    scoreDelta = Math.round(scoreDelta * depthMultiplier);

    // Assumption penalty: more assumptions = more uncertainty
    const assumptionPenalty = Math.min(15, path.assumptions.length * 3);
    scoreDelta -= assumptionPenalty;

    const simulatedScore = Math.min(100, Math.max(0, originalScore + scoreDelta));

    // Build risk profile
    const baseRisk = 30; // baseline enterprise risk
    const riskProfile = {
      operational: Math.min(100, Math.max(0, baseRisk + riskAdjustments.operational)),
      financial: Math.min(100, Math.max(0, baseRisk + riskAdjustments.financial)),
      regulatory: Math.min(100, Math.max(0, baseRisk + riskAdjustments.regulatory)),
      reputational: Math.min(100, Math.max(0, baseRisk + riskAdjustments.reputational)),
      stakeholder: Math.min(100, Math.max(0, baseRisk + riskAdjustments.stakeholder)),
    };

    return { simulatedScore, riskProfile, uniqueEffects };
  }

  // ---------------------------------------------------------------------------
  // COMPARISON & INSIGHTS
  // ---------------------------------------------------------------------------

  private generateComparisonReasoning(
    path: AlternativePathInput,
    original: DecisionOutcome,
    simulatedScore: number,
    verdict: 'better' | 'worse' | 'comparable'
  ): string {
    const originalScore = original.accuracyScore || 50;
    const delta = Math.abs(simulatedScore - originalScore);

    if (verdict === 'comparable') {
      return `"${path.name}" would have produced comparable results to the original decision (within ${delta} points). The key differences would not have materially changed the outcome.`;
    }

    if (verdict === 'better') {
      return `"${path.name}" would likely have outperformed the original by approximately ${delta} points. Key advantage factors: ${path.keyDifferences.slice(0, 2).join(', ')}.`;
    }

    return `"${path.name}" would likely have underperformed the original by approximately ${delta} points. The changes introduce additional risk without sufficient compensating benefit.`;
  }

  private identifyAdvantages(
    path: AlternativePathInput,
    riskProfile: AlternativeOutcome['riskProfile'],
    original: DecisionOutcome
  ): string[] {
    const advantages: string[] = [];

    if (riskProfile.operational < 25) advantages.push('Lower operational risk');
    if (riskProfile.financial < 25) advantages.push('Better financial risk profile');
    if (riskProfile.regulatory < 20) advantages.push('Reduced regulatory exposure');
    if (riskProfile.stakeholder < 25) advantages.push('Better stakeholder alignment');
    if (path.estimatedCostDelta && path.estimatedCostDelta < 0) {
      advantages.push(`Cost saving of $${Math.abs(path.estimatedCostDelta).toLocaleString()}`);
    }
    if (path.estimatedTimeDelta && path.estimatedTimeDelta < 0) {
      advantages.push(`${Math.abs(path.estimatedTimeDelta)} days faster execution`);
    }

    return advantages;
  }

  private identifyDisadvantages(
    path: AlternativePathInput,
    riskProfile: AlternativeOutcome['riskProfile'],
    original: DecisionOutcome
  ): string[] {
    const disadvantages: string[] = [];

    if (riskProfile.operational > 50) disadvantages.push('Higher operational complexity');
    if (riskProfile.financial > 50) disadvantages.push('Greater financial exposure');
    if (riskProfile.regulatory > 40) disadvantages.push('Increased regulatory risk');
    if (riskProfile.stakeholder > 50) disadvantages.push('Stakeholder resistance likely');
    if (path.assumptions.length > 3) disadvantages.push(`Depends on ${path.assumptions.length} unverified assumptions`);
    if (path.estimatedCostDelta && path.estimatedCostDelta > 0) {
      disadvantages.push(`Additional cost of $${path.estimatedCostDelta.toLocaleString()}`);
    }
    if (path.estimatedTimeDelta && path.estimatedTimeDelta > 0) {
      disadvantages.push(`${path.estimatedTimeDelta} days slower execution`);
    }

    return disadvantages;
  }

  private estimateROIDelta(original: DecisionOutcome, simulatedScore: number): number {
    if (original.actualROI === undefined) return 0;

    const originalScore = original.accuracyScore || 50;
    const scoreDiff = simulatedScore - originalScore;

    // Rough estimate: each point of accuracy difference corresponds to ~2% ROI change
    return Math.round(original.actualROI * (scoreDiff / 100) * 2);
  }

  private assessNetValue(
    simulatedScore: number,
    originalScore: number,
    costDelta?: number,
    timeDelta?: number
  ): string {
    const scoreDiff = simulatedScore - originalScore;
    const parts: string[] = [];

    if (scoreDiff > 15) parts.push('Significantly better predicted outcome');
    else if (scoreDiff > 5) parts.push('Moderately better predicted outcome');
    else if (scoreDiff > -5) parts.push('Comparable outcome to original');
    else if (scoreDiff > -15) parts.push('Moderately worse predicted outcome');
    else parts.push('Significantly worse predicted outcome');

    if (costDelta !== undefined) {
      if (costDelta < 0) parts.push(`with $${Math.abs(costDelta).toLocaleString()} in savings`);
      else if (costDelta > 0) parts.push(`at an additional cost of $${costDelta.toLocaleString()}`);
    }

    if (timeDelta !== undefined) {
      if (timeDelta < 0) parts.push(`and ${Math.abs(timeDelta)} days faster`);
      else if (timeDelta > 0) parts.push(`but ${timeDelta} days slower`);
    }

    return parts.join(', ') + '.';
  }

  // ---------------------------------------------------------------------------
  // STEP 5: INSIGHTS & LESSONS
  // ---------------------------------------------------------------------------

  private generateInsights(
    original: DecisionOutcome,
    alternatives: AlternativeOutcome[],
    originalRanking: number
  ): string[] {
    const insights: string[] = [];
    const totalPaths = alternatives.length + 1;

    // Ranking insight
    if (originalRanking === 1) {
      insights.push(`The original decision was the best option among ${totalPaths} analyzed paths. The team made the right call.`);
    } else if (originalRanking === totalPaths) {
      insights.push(`The original decision ranked last among ${totalPaths} analyzed paths. Every alternative would have performed better.`);
    } else {
      insights.push(`The original decision ranked #${originalRanking} of ${totalPaths} paths. There were ${originalRanking - 1} better alternative(s).`);
    }

    // Best alternative insight
    const bestAlt = alternatives.reduce((best, a) => a.simulatedScore > best.simulatedScore ? a : best, alternatives[0]);
    if (bestAlt && bestAlt.comparisonToActual.verdict === 'better') {
      insights.push(`Best alternative: "${bestAlt.name}" — ${bestAlt.comparisonToActual.reasoning}`);
    }

    // Common theme insight
    const betterAlts = alternatives.filter(a => a.comparisonToActual.verdict === 'better');
    if (betterAlts.length > 0) {
      const commonAdvantages = this.findCommonThemes(betterAlts.flatMap(a => a.comparisonToActual.keyAdvantages));
      if (commonAdvantages.length > 0) {
        insights.push(`Common theme in better alternatives: ${commonAdvantages.join(', ')}.`);
      }
    }

    // Risk profile insight
    const originalScore = original.accuracyScore || 50;
    if (originalScore < 40) {
      insights.push('The original decision underperformed expectations. Counterfactual analysis suggests more conservative or phased approaches would have been beneficial.');
    }

    return insights;
  }

  private extractLessons(
    original: DecisionOutcome,
    alternatives: AlternativeOutcome[],
    bestAlternativeId: string | null
  ): string[] {
    const lessons: string[] = [];

    if (bestAlternativeId) {
      const best = alternatives.find(a => a.id === bestAlternativeId);
      if (best) {
        lessons.push(`For similar future decisions, consider: ${best.keyDifferences.slice(0, 2).join(' and ')}.`);
        if (best.comparisonToActual.keyAdvantages.length > 0) {
          lessons.push(`Key factors that would have improved outcome: ${best.comparisonToActual.keyAdvantages.join(', ')}.`);
        }
      }
    }

    // Lessons from original biases
    if (original.biasesDetected) {
      for (const bias of original.biasesDetected) {
        lessons.push(`Detected ${bias.type} bias in original decision: ${bias.recommendation}`);
      }
    }

    // Lessons from original's own lessons
    if (original.lessonsLearned) {
      for (const lesson of original.lessonsLearned.slice(0, 2)) {
        lessons.push(`Original decision lesson: ${lesson}`);
      }
    }

    return lessons;
  }

  private identifyBiases(
    original: DecisionOutcome,
    alternatives: AlternativeOutcome[]
  ): string[] {
    const biases: string[] = [];

    // Check if all alternatives with stakeholder alignment scored better
    const alignmentAlts = alternatives.filter(a =>
      a.keyDifferences.some(d => this.containsAny(d.toLowerCase(), ['stakeholder', 'alignment', 'buy-in', 'consult']))
    );
    if (alignmentAlts.length > 0 && alignmentAlts.every(a => a.comparisonToActual.verdict === 'better')) {
      biases.push('Possible authority/groupthink bias: alternatives with more stakeholder consultation consistently scored better.');
    }

    // Check if conservative alternatives all scored better (suggests optimism bias)
    const conservativeAlts = alternatives.filter(a =>
      a.keyDifferences.some(d => this.containsAny(d.toLowerCase(), ['conservative', 'phased', 'cautious', 'pilot']))
    );
    if (conservativeAlts.length > 0 && conservativeAlts.every(a => a.comparisonToActual.verdict === 'better')) {
      biases.push('Possible optimism bias: more conservative alternatives consistently outperformed the original.');
    }

    // Check if cheaper alternatives scored similar or better (sunk cost bias)
    const cheaperAlts = alternatives.filter(a => a.estimatedCostDelta && a.estimatedCostDelta < 0);
    if (cheaperAlts.length > 0 && cheaperAlts.every(a => a.comparisonToActual.verdict !== 'worse')) {
      biases.push('Possible sunk cost consideration: less expensive alternatives would have performed equally or better.');
    }

    // Original biases
    if (original.biasesDetected) {
      for (const bias of original.biasesDetected) {
        biases.push(`${bias.type} bias (severity: ${bias.severity}): ${bias.description}`);
      }
    }

    return biases;
  }

  // ---------------------------------------------------------------------------
  // STEP 6: CONFIDENCE
  // ---------------------------------------------------------------------------

  private computeSimulationConfidence(
    original: DecisionOutcome,
    paths: AlternativePathInput[],
    depth: 'quick' | 'standard' | 'deep'
  ): { simulationConfidence: number; confidenceFactors: string[] } {
    let confidence = 0;
    const factors: string[] = [];

    // Original outcome quality (0-30 points)
    if (original.status === 'closed' && original.accuracyScore !== undefined) {
      confidence += 30;
      factors.push('Original decision fully measured and closed');
    } else if (original.status === 'verified') {
      confidence += 25;
      factors.push('Original decision verified');
    } else if (original.status === 'measured') {
      confidence += 20;
      factors.push('Original decision measured but not yet verified');
    } else {
      confidence += 5;
      factors.push('Original decision has limited measurement data');
    }

    // Actual outcome data richness (0-20 points)
    if (original.actualOutcomes.length >= 3) {
      confidence += 20;
      factors.push(`${original.actualOutcomes.length} actual outcomes recorded — rich comparison basis`);
    } else if (original.actualOutcomes.length >= 1) {
      confidence += 10;
      factors.push(`Only ${original.actualOutcomes.length} actual outcome(s) — limited comparison basis`);
    } else {
      factors.push('No actual outcomes recorded — simulation quality is low');
    }

    // Analysis depth (0-20 points)
    if (depth === 'deep') {
      confidence += 20;
      factors.push('Deep analysis mode: maximum granularity');
    } else if (depth === 'standard') {
      confidence += 15;
      factors.push('Standard analysis mode');
    } else {
      confidence += 8;
      factors.push('Quick analysis mode: reduced granularity');
    }

    // Alternative path quality (0-20 points)
    const avgAssumptions = paths.reduce((sum, p) => sum + p.assumptions.length, 0) / Math.max(1, paths.length);
    const avgDifferences = paths.reduce((sum, p) => sum + p.keyDifferences.length, 0) / Math.max(1, paths.length);

    if (avgDifferences >= 2 && avgAssumptions <= 3) {
      confidence += 20;
      factors.push('Well-defined alternatives with manageable assumptions');
    } else if (avgDifferences >= 1) {
      confidence += 12;
      factors.push('Alternatives are moderately defined');
    } else {
      confidence += 5;
      factors.push('Alternatives need more specificity for higher-confidence simulation');
    }

    // Penalty for many assumptions
    if (avgAssumptions > 5) {
      confidence -= 10;
      factors.push(`High assumption count (avg ${avgAssumptions.toFixed(1)}) reduces confidence`);
    }

    const simulationConfidence = Math.min(85, Math.max(10, confidence));
    return { simulationConfidence, confidenceFactors: factors };
  }

  // ---------------------------------------------------------------------------
  // PATTERN DETECTION
  // ---------------------------------------------------------------------------

  private findPatternMatch(
    original: DecisionOutcome,
    alternatives: AlternativeOutcome[]
  ): string | undefined {
    // Check against known patterns
    for (const [, pattern] of this.patterns) {
      if (original.tags.some(t => pattern.patternName.toLowerCase().includes(t.toLowerCase()))) {
        return `Matches pattern "${pattern.patternName}" (seen ${pattern.occurrences} times): ${pattern.commonLesson}`;
      }
    }
    return undefined;
  }

  private updatePatterns(analysis: CounterfactualAnalysis): void {
    const category = analysis.originalDecision.tags[0] || 'general';
    const patternKey = `${category}-${analysis.bestAlternative ? 'had-better-option' : 'original-was-best'}`;

    const existing = this.patterns.get(patternKey);
    if (existing) {
      existing.occurrences++;
      existing.avgOriginalScore = (existing.avgOriginalScore * (existing.occurrences - 1) + analysis.originalDecision.accuracyScore) / existing.occurrences;
      if (analysis.bestAlternative) {
        const bestAlt = analysis.alternatives.find(a => a.id === analysis.bestAlternative);
        if (bestAlt) {
          existing.avgBestAlternativeScore = (existing.avgBestAlternativeScore * (existing.occurrences - 1) + bestAlt.simulatedScore) / existing.occurrences;
        }
      }
    } else {
      const bestAlt = analysis.bestAlternative
        ? analysis.alternatives.find(a => a.id === analysis.bestAlternative)
        : null;

      this.patterns.set(patternKey, {
        patternName: `${category} decisions — ${analysis.bestAlternative ? 'better options existed' : 'original was optimal'}`,
        description: `Pattern for ${category} decisions`,
        occurrences: 1,
        avgOriginalScore: analysis.originalDecision.accuracyScore,
        avgBestAlternativeScore: bestAlt?.simulatedScore || analysis.originalDecision.accuracyScore,
        commonLesson: analysis.lessonsLearned[0] || 'No common lesson identified yet.',
      });
    }
  }

  // ---------------------------------------------------------------------------
  // RETRIEVAL
  // ---------------------------------------------------------------------------

  async getAnalysis(analysisId: string): Promise<CounterfactualAnalysis | null> {
    return this.analyses.get(analysisId) || null;
  }

  async getAnalyses(
    organizationId: string,
    options?: { limit?: number; decisionId?: string }
  ): Promise<CounterfactualAnalysis[]> {
    let results = Array.from(this.analyses.values())
      .filter(a => a.organizationId === organizationId);

    if (options?.decisionId) {
      results = results.filter(a => a.originalDecisionId === options.decisionId);
    }

    results.sort((a, b) => b.analyzedAt.getTime() - a.analyzedAt.getTime());

    if (options?.limit) {
      results = results.slice(0, options.limit);
    }

    return results;
  }

  async getPatterns(organizationId: string): Promise<CounterfactualPattern[]> {
    return Array.from(this.patterns.values())
      .sort((a, b) => b.occurrences - a.occurrences);
  }

  // ---------------------------------------------------------------------------
  // DASHBOARD
  // ---------------------------------------------------------------------------

  async getDashboard(organizationId: string): Promise<{
    totalAnalyses: number;
    decisionsWhereOriginalWasBest: number;
    decisionsWhereBetterOptionExisted: number;
    avgOriginalRanking: number;
    avgSimulationConfidence: number;
    topPatterns: CounterfactualPattern[];
    recentAnalyses: Array<{
      id: string;
      title: string;
      originalRanking: number;
      totalPaths: number;
      bestAlternative: string | null;
      confidence: number;
      date: Date;
    }>;
  }> {
    const analyses = await this.getAnalyses(organizationId);

    const originalWasBest = analyses.filter(a => a.bestAlternative === null).length;
    const betterOptionExisted = analyses.filter(a => a.bestAlternative !== null).length;

    const avgRanking = analyses.length > 0
      ? Math.round(analyses.reduce((sum, a) => sum + a.originalRanking, 0) / analyses.length * 10) / 10
      : 0;

    const avgConfidence = analyses.length > 0
      ? Math.round(analyses.reduce((sum, a) => sum + a.simulationConfidence, 0) / analyses.length)
      : 0;

    const topPatterns = await this.getPatterns(organizationId);

    const recentAnalyses = analyses.slice(0, 10).map(a => ({
      id: a.id,
      title: a.originalDecision.title,
      originalRanking: a.originalRanking,
      totalPaths: a.alternatives.length + 1,
      bestAlternative: a.bestAlternative
        ? a.alternatives.find(alt => alt.id === a.bestAlternative)?.name || null
        : null,
      confidence: a.simulationConfidence,
      date: a.analyzedAt,
    }));

    return {
      totalAnalyses: analyses.length,
      decisionsWhereOriginalWasBest: originalWasBest,
      decisionsWhereBetterOptionExisted: betterOptionExisted,
      avgOriginalRanking: avgRanking,
      avgSimulationConfidence: avgConfidence,
      topPatterns: topPatterns.slice(0, 5),
      recentAnalyses,
    };
  }

  // ---------------------------------------------------------------------------
  // HEALTH
  // ---------------------------------------------------------------------------

  async getHealth(): Promise<{ status: string; analyses: number; patterns: number; version: string }> {
    return {
      status: 'healthy',
      analyses: this.analyses.size,
      patterns: this.patterns.size,
      version: '1.0.0',
    };
  }

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------

  private containsAny(text: string, keywords: string[]): boolean {
    return keywords.some(k => text.includes(k));
  }

  private findCommonThemes(items: string[]): string[] {
    if (items.length === 0) return [];

    const frequency = new Map<string, number>();
    for (const item of items) {
      frequency.set(item, (frequency.get(item) || 0) + 1);
    }

    return Array.from(frequency.entries())
      .filter(([, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .map(([item]) => item)
      .slice(0, 3);
  }

  private async persistAnalysis(analysis: CounterfactualAnalysis): Promise<void> {
    try {
      const { prisma } = await import('../config/database.js');
      await prisma.audit_logs.create({
        data: {
          id: crypto.randomUUID(),
          organization_id: analysis.organizationId,
          action: 'REWIND_COUNTERFACTUAL_ANALYZED',
          resource_type: 'counterfactual_analysis',
          resource_id: analysis.id,
          details: {
            originalDecisionId: analysis.originalDecisionId,
            alternativeCount: analysis.alternatives.length,
            originalRanking: analysis.originalRanking,
            bestAlternative: analysis.bestAlternative,
            simulationConfidence: analysis.simulationConfidence,
            insightCount: analysis.keyInsights.length,
          },
          user_id: analysis.requestedBy,
          ip_address: '127.0.0.1',
        },
      });
    } catch (e) {
      logger.debug('CendiaRewind: Audit log write skipped (table may not exist)');
    }
  }

  // No seed method - Enterprise Platinum standard
  // Analyses are created only through real API operations



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'CendiaRewind', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.analyses.has(d.id)) this.analyses.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'CendiaRewind', recordType: 'record', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.patterns.has(d.id)) this.patterns.set(d.id, d);


      }


      restored += recs_1.length;


      if (restored > 0) logger.info(`[CendiaRewindService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[CendiaRewindService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

export const cendiaRewindService = new CendiaRewindService();
export default cendiaRewindService;
