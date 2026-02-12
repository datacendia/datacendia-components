/**
 * CENDIA DECISION SIMILARITY™ SERVICE
 * 
 * DCII Enhancement for Continuity Memory: Proactive historical decision matching.
 * 
 * Capabilities:
 * - Semantic similarity search across all historical Decision DNA records
 * - Automatic "similar decision" surfacing when new decisions are proposed
 * - Outcome-aware recommendations (what happened last time?)
 * - Cross-department pattern detection (same mistake in different silos)
 * - Dissenter accuracy tracking (were the dissenters right last time?)
 * - Temporal decay weighting (recent decisions weighted higher)
 * - Context-aware matching (industry, department, urgency, decision type)
 * 
 * The playbook's "chip design" example: When a new CTO proposes abandoning
 * a project, the system proactively warns "A similar decision was made in 2019
 * by former CTO X. The dissenters were proven correct. Here's what happened."
 */

import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../utils/logger.js';

// =============================================================================
// TYPES
// =============================================================================

export type MatchStrength = 'exact' | 'strong' | 'moderate' | 'weak' | 'tangential';

export type OutcomeStatus = 'successful' | 'partially_successful' | 'failed' | 'too_early' | 'unknown';

export interface DecisionRecord {
  id: string;
  organizationId: string;
  
  title: string;
  question: string;
  context: string;
  
  decisionType: string;
  department: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  
  outcome?: OutcomeStatus;
  outcomeDescription?: string;
  lessonsLearned?: string[];
  
  dissentersPrediction?: string;
  dissenterWasCorrect?: boolean;
  
  overrideOccurred: boolean;
  overrideSuccessful?: boolean;
  
  tags: string[];
  keywords: string[];
  embedding?: number[];
  
  decidedAt: Date;
  decidedBy: string;
  
  relatedDecisionIds: string[];
}

export interface SimilarityMatch {
  id: string;
  queryDecisionId?: string;
  matchedDecisionId: string;
  matchedDecision: DecisionRecord;
  
  overallSimilarity: number;
  matchStrength: MatchStrength;
  
  similarities: SimilarityDimension[];
  
  warnings: SimilarityWarning[];
  insights: SimilarityInsight[];
  
  relevanceScore: number;
  temporalDecay: number;
  
  matchedAt: Date;
}

export interface SimilarityDimension {
  dimension: 'semantic' | 'contextual' | 'structural' | 'outcome' | 'stakeholder' | 'temporal' | 'keyword';
  score: number;
  weight: number;
  details: string;
}

export interface SimilarityWarning {
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  precedentDecisionId: string;
  precedentOutcome?: OutcomeStatus;
}

export interface SimilarityInsight {
  type: 'outcome_pattern' | 'dissenter_accuracy' | 'override_history' | 'cross_department' | 'temporal_pattern' | 'risk_factor';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  recommendation?: string;
}

export interface SimilaritySearchRequest {
  organizationId: string;
  title: string;
  question: string;
  context: string;
  decisionType?: string;
  department?: string;
  urgency?: 'low' | 'medium' | 'high' | 'critical';
  tags?: string[];
  maxResults?: number;
  minSimilarity?: number;
  includeOutcomes?: boolean;
  includeCrossDepartment?: boolean;
}

export interface SimilaritySearchResult {
  id: string;
  query: SimilaritySearchRequest;
  matches: SimilarityMatch[];
  totalMatchesFound: number;
  
  aggregateInsights: AggregateInsight[];
  riskAssessment: SimilarityRiskAssessment;
  
  searchedAt: Date;
  searchDurationMs: number;
  
  integrity: {
    resultHash: string;
    algorithm: string;
  };
}

export interface AggregateInsight {
  type: string;
  title: string;
  description: string;
  supportingDecisions: string[];
  confidence: number;
}

export interface SimilarityRiskAssessment {
  overallRisk: 'critical' | 'high' | 'medium' | 'low' | 'unknown';
  historicalSuccessRate: number;
  dissenterAccuracyRate: number;
  overrideSuccessRate: number;
  factors: { factor: string; risk: string; details: string }[];
}

export interface DecisionPattern {
  id: string;
  organizationId: string;
  patternType: 'recurring_failure' | 'success_pattern' | 'override_pattern' | 'dissent_pattern' | 'cross_department';
  title: string;
  description: string;
  decisionIds: string[];
  frequency: number;
  lastOccurrence: Date;
  severity: 'critical' | 'high' | 'medium' | 'low';
  recommendation: string;
}

// =============================================================================
// TF-IDF SIMPLE IMPLEMENTATION
// =============================================================================

function tokenize(text: string): string[] {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2)
    .filter(t => !STOP_WORDS.has(t));
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one',
  'our', 'out', 'has', 'have', 'been', 'from', 'this', 'that', 'with', 'they', 'will', 'each',
  'make', 'like', 'long', 'look', 'many', 'some', 'than', 'them', 'then', 'very', 'when',
  'what', 'which', 'would', 'about', 'could', 'other', 'their', 'there', 'these', 'those',
  'should', 'into', 'over', 'such', 'more', 'also', 'back', 'after', 'just', 'only',
]);

function cosineSimilarity(a: Map<string, number>, b: Map<string, number>): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  const allKeys = new Set(Array.from(a.keys()).concat(Array.from(b.keys())));
  for (const key of Array.from(allKeys)) {
    const va = a.get(key) || 0;
    const vb = b.get(key) || 0;
    dotProduct += va * vb;
    normA += va * va;
    normB += vb * vb;
  }
  
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

function textToTfIdf(text: string): Map<string, number> {
  const tokens = tokenize(text);
  const tf = new Map<string, number>();
  for (const t of tokens) {
    tf.set(t, (tf.get(t) || 0) + 1);
  }
  // Normalize
  for (const [k, v] of Array.from(tf.entries())) {
    tf.set(k, v / tokens.length);
  }
  return tf;
}

// =============================================================================
// SERVICE
// =============================================================================

class DecisionSimilarityService {
  private decisions: Map<string, DecisionRecord> = new Map();
  private searchResults: Map<string, SimilaritySearchResult> = new Map();
  private patterns: Map<string, DecisionPattern> = new Map();

  constructor() {
    logger.info('🔍 Decision Similarity Service initialized');
    this.seedDemoData();
  }

  // ---------------------------------------------------------------------------
  // RECORD MANAGEMENT
  // ---------------------------------------------------------------------------

  addDecisionRecord(record: Omit<DecisionRecord, 'id' | 'keywords' | 'embedding'>): DecisionRecord {
    const id = uuidv4();
    const fullText = `${record.title} ${record.question} ${record.context}`;
    const keywords = this.extractKeywords(fullText);
    
    const decision: DecisionRecord = {
      ...record,
      id,
      keywords,
      relatedDecisionIds: record.relatedDecisionIds || [],
    };

    this.decisions.set(id, decision);
    logger.info(`🔍 Decision recorded: ${record.title} (${id})`);
    return decision;
  }

  updateOutcome(
    decisionId: string,
    outcome: OutcomeStatus,
    outcomeDescription: string,
    lessonsLearned?: string[],
    dissenterWasCorrect?: boolean
  ): DecisionRecord | undefined {
    const decision = this.decisions.get(decisionId);
    if (!decision) return undefined;

    decision.outcome = outcome;
    decision.outcomeDescription = outcomeDescription;
    if (lessonsLearned) decision.lessonsLearned = lessonsLearned;
    if (dissenterWasCorrect !== undefined) decision.dissenterWasCorrect = dissenterWasCorrect;

    logger.info(`🔍 Outcome updated for ${decision.title}: ${outcome}`);
    return decision;
  }

  // ---------------------------------------------------------------------------
  // SIMILARITY SEARCH
  // ---------------------------------------------------------------------------

  async findSimilarDecisions(request: SimilaritySearchRequest): Promise<SimilaritySearchResult> {
    const startTime = Date.now();
    const maxResults = request.maxResults || 10;
    const minSimilarity = request.minSimilarity || 0.15;

    const queryText = `${request.title} ${request.question} ${request.context}`;
    const queryTfIdf = textToTfIdf(queryText);
    const queryKeywords = this.extractKeywords(queryText);

    const candidates = Array.from(this.decisions.values())
      .filter(d => d.organizationId === request.organizationId || request.includeCrossDepartment);

    const matches: SimilarityMatch[] = [];

    for (const candidate of candidates) {
      const candidateText = `${candidate.title} ${candidate.question} ${candidate.context}`;
      const candidateTfIdf = textToTfIdf(candidateText);

      const semanticScore = cosineSimilarity(queryTfIdf, candidateTfIdf);
      const keywordScore = this.keywordOverlap(queryKeywords, candidate.keywords);
      const contextualScore = this.contextualSimilarity(request, candidate);
      const structuralScore = this.structuralSimilarity(request, candidate);

      const temporalDecay = this.calculateTemporalDecay(candidate.decidedAt);

      const dimensions: SimilarityDimension[] = [
        { dimension: 'semantic', score: semanticScore, weight: 0.35, details: `TF-IDF cosine similarity: ${(semanticScore * 100).toFixed(1)}%` },
        { dimension: 'keyword', score: keywordScore, weight: 0.20, details: `Keyword overlap: ${(keywordScore * 100).toFixed(1)}%` },
        { dimension: 'contextual', score: contextualScore, weight: 0.20, details: `Context factors: department, urgency, type match` },
        { dimension: 'structural', score: structuralScore, weight: 0.15, details: `Decision structure similarity` },
        { dimension: 'temporal', score: temporalDecay, weight: 0.10, details: `Temporal relevance (${this.daysSince(candidate.decidedAt)} days ago)` },
      ];

      const overallSimilarity = dimensions.reduce((sum, d) => sum + d.score * d.weight, 0);

      if (overallSimilarity >= minSimilarity) {
        const warnings = this.generateWarnings(candidate, overallSimilarity);
        const insights = this.generateInsights(candidate, request);

        matches.push({
          id: uuidv4(),
          queryDecisionId: undefined,
          matchedDecisionId: candidate.id,
          matchedDecision: candidate,
          overallSimilarity,
          matchStrength: this.getMatchStrength(overallSimilarity),
          similarities: dimensions,
          warnings,
          insights,
          relevanceScore: overallSimilarity * temporalDecay,
          temporalDecay,
          matchedAt: new Date(),
        });
      }
    }

    matches.sort((a, b) => b.relevanceScore - a.relevanceScore);
    const topMatches = matches.slice(0, maxResults);

    const aggregateInsights = this.generateAggregateInsights(topMatches, request);
    const riskAssessment = this.assessRisk(topMatches);

    const result: SimilaritySearchResult = {
      id: uuidv4(),
      query: request,
      matches: topMatches,
      totalMatchesFound: matches.length,
      aggregateInsights,
      riskAssessment,
      searchedAt: new Date(),
      searchDurationMs: Date.now() - startTime,
      integrity: { resultHash: '', algorithm: 'SHA-256' },
    };

    result.integrity.resultHash = crypto.createHash('sha256')
      .update(JSON.stringify({ id: result.id, matchCount: result.matches.length }))
      .digest('hex');

    this.searchResults.set(result.id, result);
    logger.info(`🔍 Similarity search: ${topMatches.length} matches found in ${result.searchDurationMs}ms`);
    return result;
  }

  // ---------------------------------------------------------------------------
  // SIMILARITY CALCULATIONS
  // ---------------------------------------------------------------------------

  private keywordOverlap(a: string[], b: string[]): number {
    const setA = new Set(a);
    const setB = new Set(b);
    const intersection = Array.from(setA).filter(k => setB.has(k)).length;
    const union = new Set(a.concat(b)).size;
    return union > 0 ? intersection / union : 0;
  }

  private contextualSimilarity(request: SimilaritySearchRequest, candidate: DecisionRecord): number {
    let score = 0;
    let factors = 0;

    if (request.department && candidate.department) {
      factors++;
      if (request.department.toLowerCase() === candidate.department.toLowerCase()) score += 1;
    }

    if (request.urgency && candidate.urgency) {
      factors++;
      if (request.urgency === candidate.urgency) score += 1;
      else if (Math.abs(['low', 'medium', 'high', 'critical'].indexOf(request.urgency) -
        ['low', 'medium', 'high', 'critical'].indexOf(candidate.urgency)) <= 1) score += 0.5;
    }

    if (request.decisionType && candidate.decisionType) {
      factors++;
      if (request.decisionType.toLowerCase() === candidate.decisionType.toLowerCase()) score += 1;
    }

    if (request.tags && candidate.tags) {
      const tagOverlap = this.keywordOverlap(request.tags, candidate.tags);
      factors++;
      score += tagOverlap;
    }

    return factors > 0 ? score / factors : 0.3;
  }

  private structuralSimilarity(request: SimilaritySearchRequest, candidate: DecisionRecord): number {
    let score = 0.3; // Base score
    if (request.title.length > 10 && candidate.title.length > 10) score += 0.2;
    if (request.context.length > 50 && candidate.context.length > 50) score += 0.2;
    if (candidate.outcome) score += 0.15;
    if (candidate.lessonsLearned && candidate.lessonsLearned.length > 0) score += 0.15;
    return Math.min(1, score);
  }

  private calculateTemporalDecay(decidedAt: Date): number {
    const daysSince = this.daysSince(decidedAt);
    // Half-life of 365 days
    return Math.exp(-0.693 * daysSince / 365);
  }

  private daysSince(date: Date): number {
    return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  }

  private getMatchStrength(similarity: number): MatchStrength {
    if (similarity >= 0.8) return 'exact';
    if (similarity >= 0.6) return 'strong';
    if (similarity >= 0.4) return 'moderate';
    if (similarity >= 0.2) return 'weak';
    return 'tangential';
  }

  private extractKeywords(text: string): string[] {
    const tokens = tokenize(text);
    const freq = new Map<string, number>();
    for (const t of tokens) {
      freq.set(t, (freq.get(t) || 0) + 1);
    }
    return Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word]) => word);
  }

  // ---------------------------------------------------------------------------
  // WARNINGS & INSIGHTS
  // ---------------------------------------------------------------------------

  private generateWarnings(candidate: DecisionRecord, similarity: number): SimilarityWarning[] {
    const warnings: SimilarityWarning[] = [];

    if (candidate.outcome === 'failed' && similarity > 0.4) {
      warnings.push({
        severity: 'critical',
        title: 'Similar decision previously failed',
        description: `A decision with ${(similarity * 100).toFixed(0)}% similarity ("${candidate.title}") was made on ${candidate.decidedAt.toLocaleDateString()} and resulted in failure. ${candidate.outcomeDescription || ''}`,
        precedentDecisionId: candidate.id,
        precedentOutcome: candidate.outcome,
      });
    }

    if (candidate.dissenterWasCorrect && similarity > 0.3) {
      warnings.push({
        severity: 'high',
        title: 'Dissenters were correct in similar past decision',
        description: `In a similar decision ("${candidate.title}"), those who dissented were proven correct. Their prediction: "${candidate.dissentersPrediction || 'N/A'}"`,
        precedentDecisionId: candidate.id,
        precedentOutcome: candidate.outcome,
      });
    }

    if (candidate.overrideOccurred && candidate.overrideSuccessful === false && similarity > 0.3) {
      warnings.push({
        severity: 'high',
        title: 'Override in similar decision was unsuccessful',
        description: `A similar decision ("${candidate.title}") involved an override that was ultimately unsuccessful.`,
        precedentDecisionId: candidate.id,
        precedentOutcome: candidate.outcome,
      });
    }

    return warnings;
  }

  private generateInsights(candidate: DecisionRecord, request: SimilaritySearchRequest): SimilarityInsight[] {
    const insights: SimilarityInsight[] = [];

    if (candidate.outcome) {
      insights.push({
        type: 'outcome_pattern',
        title: `Previous outcome: ${candidate.outcome}`,
        description: candidate.outcomeDescription || `The similar decision resulted in: ${candidate.outcome}`,
        confidence: 0.7,
        actionable: candidate.outcome === 'failed',
        recommendation: candidate.outcome === 'failed' ? 'Review lessons learned from this precedent before proceeding.' : undefined,
      });
    }

    if (candidate.lessonsLearned && candidate.lessonsLearned.length > 0) {
      insights.push({
        type: 'outcome_pattern',
        title: 'Lessons learned available',
        description: `${candidate.lessonsLearned.length} lessons learned from similar decision: ${candidate.lessonsLearned[0]}`,
        confidence: 0.8,
        actionable: true,
        recommendation: 'Apply lessons learned from the precedent decision to inform current deliberation.',
      });
    }

    if (candidate.department !== request.department) {
      insights.push({
        type: 'cross_department',
        title: 'Cross-department precedent',
        description: `Similar decision found in ${candidate.department} department — indicates this type of decision occurs across organizational silos.`,
        confidence: 0.6,
        actionable: true,
        recommendation: `Consider consulting ${candidate.department} for their experience with this type of decision.`,
      });
    }

    return insights;
  }

  private generateAggregateInsights(matches: SimilarityMatch[], request: SimilaritySearchRequest): AggregateInsight[] {
    const insights: AggregateInsight[] = [];

    const withOutcomes = matches.filter(m => m.matchedDecision.outcome);
    if (withOutcomes.length > 0) {
      const successRate = withOutcomes.filter(m => m.matchedDecision.outcome === 'successful' || m.matchedDecision.outcome === 'partially_successful').length / withOutcomes.length;
      insights.push({
        type: 'historical_success_rate',
        title: `Historical success rate: ${(successRate * 100).toFixed(0)}%`,
        description: `Of ${withOutcomes.length} similar past decisions with tracked outcomes, ${(successRate * 100).toFixed(0)}% were successful or partially successful.`,
        supportingDecisions: withOutcomes.map(m => m.matchedDecisionId),
        confidence: withOutcomes.length >= 3 ? 0.8 : 0.5,
      });
    }

    const failedMatches = matches.filter(m => m.matchedDecision.outcome === 'failed');
    if (failedMatches.length > 0) {
      insights.push({
        type: 'failure_pattern',
        title: `${failedMatches.length} similar decisions previously failed`,
        description: `Multiple precedent decisions with similarity to the current proposal resulted in failure. Careful review recommended.`,
        supportingDecisions: failedMatches.map(m => m.matchedDecisionId),
        confidence: 0.75,
      });
    }

    const withCorrectDissenters = matches.filter(m => m.matchedDecision.dissenterWasCorrect);
    if (withCorrectDissenters.length > 0) {
      insights.push({
        type: 'dissenter_pattern',
        title: `Dissenters were correct in ${withCorrectDissenters.length} similar decisions`,
        description: 'Historical data shows dissenting opinions were validated by outcomes in similar past decisions. Pay extra attention to any dissent on this decision.',
        supportingDecisions: withCorrectDissenters.map(m => m.matchedDecisionId),
        confidence: 0.85,
      });
    }

    return insights;
  }

  private assessRisk(matches: SimilarityMatch[]): SimilarityRiskAssessment {
    const withOutcomes = matches.filter(m => m.matchedDecision.outcome);
    const successful = withOutcomes.filter(m => m.matchedDecision.outcome === 'successful' || m.matchedDecision.outcome === 'partially_successful');
    const withDissenters = matches.filter(m => m.matchedDecision.dissenterWasCorrect !== undefined);
    const correctDissenters = withDissenters.filter(m => m.matchedDecision.dissenterWasCorrect);
    const withOverrides = matches.filter(m => m.matchedDecision.overrideOccurred);
    const successfulOverrides = withOverrides.filter(m => m.matchedDecision.overrideSuccessful);

    const historicalSuccessRate = withOutcomes.length > 0 ? successful.length / withOutcomes.length : 0.5;
    const dissenterAccuracyRate = withDissenters.length > 0 ? correctDissenters.length / withDissenters.length : 0;
    const overrideSuccessRate = withOverrides.length > 0 ? successfulOverrides.length / withOverrides.length : 0.5;

    const factors: { factor: string; risk: string; details: string }[] = [];
    
    if (historicalSuccessRate < 0.5) {
      factors.push({ factor: 'Low historical success rate', risk: 'high', details: `Only ${(historicalSuccessRate * 100).toFixed(0)}% of similar decisions succeeded` });
    }
    if (dissenterAccuracyRate > 0.5) {
      factors.push({ factor: 'Dissenters frequently correct', risk: 'high', details: `Dissenters were correct ${(dissenterAccuracyRate * 100).toFixed(0)}% of the time in similar decisions` });
    }
    if (matches.some(m => m.warnings.some(w => w.severity === 'critical'))) {
      factors.push({ factor: 'Critical warnings from precedents', risk: 'critical', details: 'One or more similar decisions have critical warning signals' });
    }

    const overallRisk = factors.some(f => f.risk === 'critical') ? 'critical' as const :
                        factors.filter(f => f.risk === 'high').length >= 2 ? 'high' as const :
                        factors.length > 0 ? 'medium' as const :
                        matches.length === 0 ? 'unknown' as const : 'low' as const;

    return {
      overallRisk,
      historicalSuccessRate,
      dissenterAccuracyRate,
      overrideSuccessRate,
      factors,
    };
  }

  // ---------------------------------------------------------------------------
  // PATTERN DETECTION
  // ---------------------------------------------------------------------------

  async detectPatterns(organizationId: string): Promise<DecisionPattern[]> {
    const orgDecisions = Array.from(this.decisions.values()).filter(d => d.organizationId === organizationId);
    const detectedPatterns: DecisionPattern[] = [];

    // Recurring failure pattern
    const failedDecisions = orgDecisions.filter(d => d.outcome === 'failed');
    if (failedDecisions.length >= 2) {
      for (let i = 0; i < failedDecisions.length; i++) {
        for (let j = i + 1; j < failedDecisions.length; j++) {
          const similarity = this.quickSimilarity(failedDecisions[i], failedDecisions[j]);
          if (similarity > 0.3) {
            detectedPatterns.push({
              id: uuidv4(),
              organizationId,
              patternType: 'recurring_failure',
              title: `Recurring failure pattern: ${failedDecisions[i].decisionType}`,
              description: `Similar decisions "${failedDecisions[i].title}" and "${failedDecisions[j].title}" both resulted in failure. This may indicate a systemic issue.`,
              decisionIds: [failedDecisions[i].id, failedDecisions[j].id],
              frequency: 2,
              lastOccurrence: new Date(Math.max(failedDecisions[i].decidedAt.getTime(), failedDecisions[j].decidedAt.getTime())),
              severity: 'high',
              recommendation: 'Investigate root cause of repeated failures in similar decisions. Consider structural changes to the decision process.',
            });
          }
        }
      }
    }

    // Override pattern
    const overrideDecisions = orgDecisions.filter(d => d.overrideOccurred);
    if (overrideDecisions.length >= 3) {
      detectedPatterns.push({
        id: uuidv4(),
        organizationId,
        patternType: 'override_pattern',
        title: `Frequent overrides detected`,
        description: `${overrideDecisions.length} decisions involved overrides. Success rate: ${(overrideDecisions.filter(d => d.overrideSuccessful).length / overrideDecisions.length * 100).toFixed(0)}%`,
        decisionIds: overrideDecisions.map(d => d.id),
        frequency: overrideDecisions.length,
        lastOccurrence: new Date(Math.max(...overrideDecisions.map(d => d.decidedAt.getTime()))),
        severity: overrideDecisions.filter(d => d.overrideSuccessful === false).length > overrideDecisions.length / 2 ? 'critical' : 'medium',
        recommendation: 'Review override authorization processes. Consider whether recommendations are adequately informed.',
      });
    }

    // Dissent accuracy pattern
    const withDissenters = orgDecisions.filter(d => d.dissenterWasCorrect !== undefined);
    const correctDissenters = withDissenters.filter(d => d.dissenterWasCorrect);
    if (correctDissenters.length >= 2 && correctDissenters.length / withDissenters.length > 0.5) {
      detectedPatterns.push({
        id: uuidv4(),
        organizationId,
        patternType: 'dissent_pattern',
        title: 'Dissenters frequently correct',
        description: `Dissenters were correct in ${correctDissenters.length}/${withDissenters.length} decisions (${(correctDissenters.length / withDissenters.length * 100).toFixed(0)}%). Dissenting voices deserve more weight.`,
        decisionIds: correctDissenters.map(d => d.id),
        frequency: correctDissenters.length,
        lastOccurrence: new Date(Math.max(...correctDissenters.map(d => d.decidedAt.getTime()))),
        severity: 'high',
        recommendation: 'Institutionalize formal dissent review. Consider giving dissenting views more weight in future deliberations.',
      });
    }

    for (const p of detectedPatterns) {
      this.patterns.set(p.id, p);
    }

    logger.info(`🔍 Pattern detection for ${organizationId}: ${detectedPatterns.length} patterns found`);
    return detectedPatterns;
  }

  private quickSimilarity(a: DecisionRecord, b: DecisionRecord): number {
    const textA = `${a.title} ${a.question}`;
    const textB = `${b.title} ${b.question}`;
    return cosineSimilarity(textToTfIdf(textA), textToTfIdf(textB));
  }

  // ---------------------------------------------------------------------------
  // GETTERS
  // ---------------------------------------------------------------------------

  getDecision(decisionId: string): DecisionRecord | undefined {
    return this.decisions.get(decisionId);
  }

  getDecisionsByOrganization(organizationId: string): DecisionRecord[] {
    return Array.from(this.decisions.values()).filter(d => d.organizationId === organizationId);
  }

  getSearchResult(resultId: string): SimilaritySearchResult | undefined {
    return this.searchResults.get(resultId);
  }

  getPatternsByOrganization(organizationId: string): DecisionPattern[] {
    return Array.from(this.patterns.values()).filter(p => p.organizationId === organizationId);
  }

  getAllDecisions(): DecisionRecord[] {
    return Array.from(this.decisions.values());
  }

  getStats(organizationId: string) {
    const decisions = this.getDecisionsByOrganization(organizationId);
    const withOutcomes = decisions.filter(d => d.outcome);
    const successful = withOutcomes.filter(d => d.outcome === 'successful' || d.outcome === 'partially_successful');
    const withDissenters = decisions.filter(d => d.dissenterWasCorrect !== undefined);
    const correctDissenters = withDissenters.filter(d => d.dissenterWasCorrect);

    return {
      totalDecisions: decisions.length,
      withOutcomes: withOutcomes.length,
      successRate: withOutcomes.length > 0 ? (successful.length / withOutcomes.length) : null,
      overrideCount: decisions.filter(d => d.overrideOccurred).length,
      dissenterAccuracy: withDissenters.length > 0 ? (correctDissenters.length / withDissenters.length) : null,
      patternsDetected: Array.from(this.patterns.values()).filter(p => p.organizationId === organizationId).length,
    };
  }

  // ---------------------------------------------------------------------------
  // DEMO DATA
  // ---------------------------------------------------------------------------

  private seedDemoData(): void {
    const demoDecisions: Omit<DecisionRecord, 'id' | 'keywords' | 'embedding'>[] = [
      {
        organizationId: 'org-datacendia',
        title: 'Migrate core database from PostgreSQL to CockroachDB',
        question: 'Should we migrate our primary database to CockroachDB for horizontal scaling?',
        context: 'Current PostgreSQL is hitting performance limits at 10M rows. Team recommends CockroachDB for distributed SQL. Budget: $200K. Timeline: 6 months.',
        decisionType: 'technology',
        department: 'Engineering',
        urgency: 'high',
        outcome: 'partially_successful',
        outcomeDescription: 'Migration completed but took 9 months instead of 6. Some query performance regressions in analytics workloads.',
        lessonsLearned: ['Underestimated migration complexity', 'Should have run parallel systems longer', 'Analytics queries need different optimization'],
        dissentersPrediction: 'CTO argued we should optimize PostgreSQL first with partitioning',
        dissenterWasCorrect: true,
        overrideOccurred: true,
        overrideSuccessful: false,
        tags: ['database', 'migration', 'infrastructure', 'scaling'],
        decidedAt: new Date('2025-03-15'),
        decidedBy: 'VP Engineering',
        relatedDecisionIds: [],
      },
      {
        organizationId: 'org-datacendia',
        title: 'Expand to APAC market with Singapore office',
        question: 'Should we open a Singapore office to serve APAC customers?',
        context: 'Growing demand from APAC. Singapore has favorable regulatory environment. Initial investment: $500K. Expected revenue: $2M in Year 1.',
        decisionType: 'strategic',
        department: 'Executive',
        urgency: 'medium',
        outcome: 'successful',
        outcomeDescription: 'Singapore office opened on schedule. Revenue exceeded forecast at $2.8M in Year 1.',
        lessonsLearned: ['Local partnership accelerated market entry', 'Regulatory compliance was easier than expected'],
        overrideOccurred: false,
        tags: ['expansion', 'apac', 'market-entry', 'office'],
        decidedAt: new Date('2025-01-20'),
        decidedBy: 'CEO',
        relatedDecisionIds: [],
      },
      {
        organizationId: 'org-datacendia',
        title: 'Replace legacy monitoring with Datadog',
        question: 'Should we replace our custom monitoring stack with Datadog?',
        context: 'Current monitoring is unreliable. False positive rate: 40%. On-call team burned out. Datadog quote: $150K/year.',
        decisionType: 'technology',
        department: 'Engineering',
        urgency: 'high',
        outcome: 'failed',
        outcomeDescription: 'Datadog costs exceeded budget by 3x due to log volume. Reverted to self-hosted solution after 6 months.',
        lessonsLearned: ['Estimate actual log/metric volume before committing', 'Negotiate volume-based pricing upfront', 'POC with production data, not samples'],
        dissentersPrediction: 'Senior SRE warned that our log volume would make Datadog prohibitively expensive',
        dissenterWasCorrect: true,
        overrideOccurred: true,
        overrideSuccessful: false,
        tags: ['monitoring', 'saas', 'infrastructure', 'cost'],
        decidedAt: new Date('2025-06-10'),
        decidedBy: 'VP Engineering',
        relatedDecisionIds: [],
      },
      {
        organizationId: 'org-meridian',
        title: 'Implement AI-driven fraud detection for credit card transactions',
        question: 'Should we deploy ML-based fraud detection to replace rule-based system?',
        context: 'Current rule-based system has 2% false positive rate (costing $5M/year in blocked legitimate transactions). ML model in testing shows 0.5% false positive rate.',
        decisionType: 'technology',
        department: 'Risk Management',
        urgency: 'high',
        outcome: 'successful',
        outcomeDescription: 'ML fraud detection deployed. False positive rate reduced to 0.4%. Saved $4.2M in Year 1.',
        lessonsLearned: ['Gradual rollout (shadow mode then production) was key', 'Model monitoring critical — drift detected within 3 months'],
        overrideOccurred: false,
        tags: ['fraud', 'ai', 'ml', 'credit-card', 'risk'],
        decidedAt: new Date('2025-04-22'),
        decidedBy: 'CRO',
        relatedDecisionIds: [],
      },
      {
        organizationId: 'org-meridian',
        title: 'Outsource customer service to offshore provider',
        question: 'Should we outsource 60% of customer service calls to reduce costs?',
        context: 'Customer service costs $12M/year. Offshore provider quotes $4M for equivalent volume. CSAT currently at 4.2/5.',
        decisionType: 'operational',
        department: 'Operations',
        urgency: 'medium',
        outcome: 'failed',
        outcomeDescription: 'CSAT dropped to 3.1/5 within 3 months. Customer churn increased 15%. Brought operations back in-house after 8 months.',
        lessonsLearned: ['Cost savings destroyed by customer churn', 'Quality cannot be maintained with cheapest provider', 'Pilot with 10% volume first'],
        dissentersPrediction: 'Head of Customer Success predicted quality issues would increase churn',
        dissenterWasCorrect: true,
        overrideOccurred: true,
        overrideSuccessful: false,
        tags: ['outsourcing', 'customer-service', 'cost-reduction'],
        decidedAt: new Date('2024-11-05'),
        decidedBy: 'COO',
        relatedDecisionIds: [],
      },
      {
        organizationId: 'org-celtic',
        title: 'Sign striker from Brazilian Serie A for £8M',
        question: 'Should Celtic sign 22-year-old striker from Santos FC at £8M transfer fee?',
        context: 'Current striker aging. Santos player scored 18 goals last season. Agent demands £45K/week wages. Celtic budget allows £10M total.',
        decisionType: 'acquisition',
        department: 'Football Operations',
        urgency: 'high',
        outcome: 'successful',
        outcomeDescription: 'Player signed at £7.5M. Scored 22 goals in first season. Valued at £25M after 18 months.',
        lessonsLearned: ['South American league data was reliable predictor', 'Pre-signing medical saved potential injury issue'],
        overrideOccurred: false,
        tags: ['transfer', 'striker', 'brazil', 'acquisition'],
        decidedAt: new Date('2025-07-15'),
        decidedBy: 'Director of Football',
        relatedDecisionIds: [],
      },
      {
        organizationId: 'org-celtic',
        title: 'Replace head of academy with external hire',
        question: 'Should we replace the long-serving academy director with an external candidate from Ajax?',
        context: 'Academy producing fewer first-team players. Ajax candidate has track record. Internal candidate also available.',
        decisionType: 'personnel',
        department: 'Football Operations',
        urgency: 'medium',
        outcome: 'partially_successful',
        outcomeDescription: 'Ajax hire improved methodology but alienated existing staff. Two key coaches left. Results improving after 18-month transition.',
        lessonsLearned: ['Change management plan needed before leadership changes', 'Retain institutional knowledge during transitions'],
        dissentersPrediction: 'Youth coach warned external hire would cause staff exodus',
        dissenterWasCorrect: true,
        overrideOccurred: false,
        tags: ['academy', 'personnel', 'leadership-change'],
        decidedAt: new Date('2025-02-28'),
        decidedBy: 'CEO',
        relatedDecisionIds: [],
      },
    ];

    for (const dec of demoDecisions) {
      this.addDecisionRecord(dec);
    }

    // Detect patterns for demo orgs
    this.detectPatterns('org-datacendia').catch(err => logger.error('Pattern detection failed:', err));
    this.detectPatterns('org-meridian').catch(err => logger.error('Pattern detection failed:', err));
    this.detectPatterns('org-celtic').catch(err => logger.error('Pattern detection failed:', err));
  }
}

// =============================================================================
// SINGLETON
// =============================================================================

export const decisionSimilarityService = new DecisionSimilarityService();
export default decisionSimilarityService;
