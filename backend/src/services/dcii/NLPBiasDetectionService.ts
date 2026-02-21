// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaBiasGuard™ — NLP-Based Cognitive Bias Detection Service
 * 
 * Uses Ollama LLM for real natural language analysis to detect cognitive biases
 * in decision deliberations, council arguments, and evidence submissions.
 * 
 * Detected Bias Categories:
 * - Anchoring: over-reliance on first piece of information
 * - Confirmation: favoring information that confirms existing beliefs
 * - Availability: overweighting easily recalled examples
 * - Sunk Cost: continuing based on already invested resources
 * - Authority: uncritical acceptance of authority opinions
 * - Groupthink: desire for conformity suppressing dissent
 * - Recency: overweighting recent events
 * - Framing: being influenced by how information is presented
 * - Survivorship: focusing on successes while ignoring failures
 * - Dunning-Kruger: overestimating competence in unfamiliar domains
 * 
 * Fallback: Statistical keyword/pattern analysis when Ollama unavailable.
 */

import crypto from 'crypto';
import { logger } from '../../utils/logger.js';
import { persistServiceRecord } from '../../utils/servicePersistence.js';

// =============================================================================
// TYPES
// =============================================================================

export type BiasCategory =
  | 'anchoring'
  | 'confirmation'
  | 'availability'
  | 'sunk_cost'
  | 'authority'
  | 'groupthink'
  | 'recency'
  | 'framing'
  | 'survivorship'
  | 'dunning_kruger';

export interface BiasDetection {
  id: string;
  category: BiasCategory;
  confidence: number;       // 0-1
  severity: 'low' | 'medium' | 'high' | 'critical';
  evidence: string;         // The text that triggered the detection
  explanation: string;      // Why this is biased
  mitigation: string;       // Suggested countermeasure
  detectedAt: Date;
}

export interface BiasAnalysisResult {
  id: string;
  inputHash: string;
  detections: BiasDetection[];
  overallBiasScore: number; // 0-100
  engine: 'ollama-nlp' | 'statistical-fallback';
  modelUsed?: string;
  analysisTime: number;
  summary: string;
}

// =============================================================================
// STATISTICAL BIAS PATTERNS (Fallback)
// =============================================================================

interface BiasPattern {
  category: BiasCategory;
  patterns: RegExp[];
  severity: 'low' | 'medium' | 'high';
  explanation: string;
  mitigation: string;
}

const BIAS_PATTERNS: BiasPattern[] = [
  {
    category: 'anchoring',
    patterns: [
      /initial (estimate|assessment|valuation|price|figure)/i,
      /first (impression|thought|analysis)/i,
      /originally (proposed|suggested|estimated)/i,
      /starting (point|position|number)/i,
      /based on the initial/i,
    ],
    severity: 'medium',
    explanation: 'Decision may be anchored to an initial reference point rather than evaluated independently.',
    mitigation: 'Consider generating multiple independent estimates before discussing. Use structured analytical techniques.',
  },
  {
    category: 'confirmation',
    patterns: [
      /confirms? (our|my|the) (belief|assumption|hypothesis|expectation)/i,
      /as (we|I) expected/i,
      /consistent with (our|my) (view|position|theory)/i,
      /supports? (our|the) (original|existing|current) (position|view)/i,
      /ignore.*contradicting/i,
      /disregard.*opposing/i,
    ],
    severity: 'high',
    explanation: 'Arguments may selectively focus on evidence supporting a predetermined conclusion.',
    mitigation: 'Actively seek disconfirming evidence. Assign a devil\'s advocate role. List reasons the preferred option could fail.',
  },
  {
    category: 'availability',
    patterns: [
      /recently (saw|heard|read|experienced)/i,
      /last (week|month|quarter).*similar/i,
      /remember when/i,
      /just (happened|occurred|saw)/i,
      /vivid (example|case|instance)/i,
      /high-profile (case|incident|failure)/i,
    ],
    severity: 'medium',
    explanation: 'Decision may be over-influenced by easily recalled or recent examples rather than base rates.',
    mitigation: 'Request base-rate statistics. Consider the full historical dataset, not just memorable examples.',
  },
  {
    category: 'sunk_cost',
    patterns: [
      /already (invested|spent|committed|poured)/i,
      /too (much|far) to (stop|turn back|quit)/i,
      /can't (waste|lose|abandon) (the|our|what)/i,
      /money already spent/i,
      /time already invested/i,
      /previous investment/i,
    ],
    severity: 'high',
    explanation: 'Decision may be influenced by past investments (time/money) that cannot be recovered.',
    mitigation: 'Evaluate options based solely on future costs and benefits. Ask: "If starting fresh today, would we choose this?"',
  },
  {
    category: 'authority',
    patterns: [
      /(CEO|director|executive|boss|leader|expert) (said|thinks|believes|recommends)/i,
      /because (they|he|she) (said|recommended|decided)/i,
      /senior (leadership|management) (wants|prefers)/i,
      /the expert opinion/i,
      /defer to.*authority/i,
    ],
    severity: 'medium',
    explanation: 'Arguments may defer to authority rather than evaluating evidence on its merits.',
    mitigation: 'Evaluate the argument independently of who made it. Request supporting evidence beyond the authority\'s opinion.',
  },
  {
    category: 'groupthink',
    patterns: [
      /everyone agrees/i,
      /consensus (is|seems) (clear|obvious)/i,
      /no (objections|disagreements|concerns)/i,
      /we all (think|agree|believe)/i,
      /unanimous/i,
      /let's not (rock the boat|create conflict)/i,
    ],
    severity: 'high',
    explanation: 'Apparent unanimity may suppress genuine dissent and alternative viewpoints.',
    mitigation: 'Explicitly solicit opposing views. Use anonymous voting. Assign pre-mortem exercise: "Assume this failed — why?"',
  },
  {
    category: 'recency',
    patterns: [
      /most recent (data|quarter|results)/i,
      /latest (trend|numbers|report)/i,
      /this (quarter|month|week)'s (numbers|data)/i,
      /current momentum/i,
      /trending (up|down|positively)/i,
    ],
    severity: 'low',
    explanation: 'Analysis may overweight recent data at the expense of longer-term trends.',
    mitigation: 'Include multi-year trend analysis. Weight recent data appropriately but compare against 3-5 year baselines.',
  },
  {
    category: 'framing',
    patterns: [
      /(\d+)% (chance of success|survival|upside)/i,
      /only (\d+)% (risk|chance of failure|downside)/i,
      /glass (half full|half empty)/i,
      /opportunity (rather than|not) (risk|threat)/i,
      /reframe.*positive/i,
    ],
    severity: 'medium',
    explanation: 'The way information is presented (positive vs negative framing) may be influencing the decision.',
    mitigation: 'Present the same data in both positive and negative frames. A "90% success rate" is also a "10% failure rate."',
  },
  {
    category: 'survivorship',
    patterns: [
      /successful (companies|leaders|examples) (show|demonstrate|prove)/i,
      /look at (Google|Apple|Amazon|Tesla)/i,
      /companies that (succeeded|thrived|grew)/i,
      /best practices from (top|leading|successful)/i,
      /winners.*did/i,
    ],
    severity: 'medium',
    explanation: 'Analysis focuses on successes while ignoring the many failures with similar approaches.',
    mitigation: 'Also study failures. Ask: "How many companies tried this exact approach and failed?" Include base-rate data.',
  },
  {
    category: 'dunning_kruger',
    patterns: [
      /simple (solution|fix|answer)/i,
      /obviously.*just/i,
      /easy.*implement/i,
      /no (real|significant) (challenge|difficulty|risk)/i,
      /straightforward/i,
      /how hard can it be/i,
    ],
    severity: 'medium',
    explanation: 'The assessment may underestimate complexity due to insufficient domain expertise.',
    mitigation: 'Consult domain experts. Create a detailed implementation plan with risk register before committing.',
  },
];

// =============================================================================
// NLP BIAS DETECTION SERVICE
// =============================================================================

export class NLPBiasDetectionService {
  private ollamaUrl: string;
  private model: string;
  private ollamaAvailable: boolean = false;

  constructor(config?: { ollamaUrl?: string; model?: string }) {
    this.ollamaUrl = config?.ollamaUrl || process.env.OLLAMA_URL || 'http://localhost:11434';
    this.model = config?.model || process.env.BIAS_MODEL || 'llama3.2';
    logger.info(`[BiasGuard] NLP Bias Detection initialized — Ollama: ${this.ollamaUrl}, model: ${this.model}`);
  }

  /**
   * Check if Ollama is available for NLP analysis.
   */
  async checkOllama(): Promise<boolean> {
    try {
      const res = await fetch(`${this.ollamaUrl}/api/tags`);
      this.ollamaAvailable = res.ok;
      return this.ollamaAvailable;
    } catch {
      this.ollamaAvailable = false;
      return false;
    }
  }

  /**
   * Analyze text for cognitive biases using NLP (Ollama) or statistical fallback.
   */
  async analyze(text: string, context?: { deliberationId?: string; organizationId?: string }): Promise<BiasAnalysisResult> {
    const startTime = Date.now();
    const inputHash = crypto.createHash('sha256').update(text).digest('hex').slice(0, 16);
    const id = `bias-${crypto.randomUUID()}`;

    let detections: BiasDetection[];
    let engine: 'ollama-nlp' | 'statistical-fallback';
    let modelUsed: string | undefined;

    // Try Ollama NLP first
    if (this.ollamaAvailable || await this.checkOllama()) {
      try {
        detections = await this.analyzeWithOllama(text);
        engine = 'ollama-nlp';
        modelUsed = this.model;
      } catch (err) {
        logger.warn(`[BiasGuard] Ollama analysis failed, using statistical fallback: ${(err as Error).message}`);
        detections = this.analyzeStatistical(text);
        engine = 'statistical-fallback';
      }
    } else {
      detections = this.analyzeStatistical(text);
      engine = 'statistical-fallback';
    }

    const overallBiasScore = this.calculateOverallScore(detections);
    const summary = this.generateSummary(detections, overallBiasScore);

    const result: BiasAnalysisResult = {
      id,
      inputHash,
      detections,
      overallBiasScore,
      engine,
      modelUsed,
      analysisTime: Date.now() - startTime,
      summary,
    };

    persistServiceRecord({
      serviceName: 'NLPBiasDetection',
      recordType: 'bias_analysis',
      organizationId: context?.organizationId,
      referenceId: context?.deliberationId || id,
      data: {
        id,
        inputHash,
        biasCount: detections.length,
        overallBiasScore,
        engine,
        categories: detections.map(d => d.category),
      },
    });

    logger.info(`[BiasGuard] Analysis complete: ${detections.length} biases detected (score: ${overallBiasScore}/100, engine: ${engine})`);
    return result;
  }

  /**
   * Analyze using Ollama LLM for deep NLP bias detection.
   */
  private async analyzeWithOllama(text: string): Promise<BiasDetection[]> {
    const prompt = `You are a cognitive bias detection expert. Analyze the following text for cognitive biases.

For each bias found, respond with a JSON array of objects with these fields:
- category: one of [anchoring, confirmation, availability, sunk_cost, authority, groupthink, recency, framing, survivorship, dunning_kruger]
- confidence: 0-1 float
- severity: low/medium/high/critical
- evidence: the exact text snippet that shows the bias
- explanation: why this is biased
- mitigation: specific countermeasure

Text to analyze:
"""
${text.slice(0, 4000)}
"""

Respond ONLY with a valid JSON array. If no biases detected, respond with [].`;

    const res = await fetch(`${this.ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: this.model, prompt, stream: false, format: 'json' }),
    });

    if (!res.ok) throw new Error(`Ollama returned ${res.status}`);
    const data = await res.json() as { response: string };

    try {
      const parsed = JSON.parse(data.response);
      const biases = Array.isArray(parsed) ? parsed : (parsed.biases || []);
      return biases.map((b: any) => ({
        id: `det-${crypto.randomUUID()}`,
        category: b.category || 'confirmation',
        confidence: Math.min(1, Math.max(0, b.confidence || 0.5)),
        severity: b.severity || 'medium',
        evidence: (b.evidence || '').slice(0, 500),
        explanation: b.explanation || 'Potential bias detected by NLP analysis',
        mitigation: b.mitigation || 'Review with diverse perspectives',
        detectedAt: new Date(),
      }));
    } catch {
      logger.warn('[BiasGuard] Failed to parse Ollama response, falling back to statistical');
      return this.analyzeStatistical(text);
    }
  }

  /**
   * Statistical pattern-based bias detection (fallback).
   */
  analyzeStatistical(text: string): BiasDetection[] {
    const detections: BiasDetection[] = [];
    const lowerText = text.toLowerCase();

    for (const pattern of BIAS_PATTERNS) {
      for (const regex of pattern.patterns) {
        const match = text.match(regex);
        if (match) {
          // Extract surrounding context (up to 100 chars each side)
          const matchIndex = text.indexOf(match[0]);
          const start = Math.max(0, matchIndex - 100);
          const end = Math.min(text.length, matchIndex + match[0].length + 100);
          const evidence = text.slice(start, end).trim();

          detections.push({
            id: `det-${crypto.randomUUID()}`,
            category: pattern.category,
            confidence: 0.6 + (pattern.severity === 'high' ? 0.2 : pattern.severity === 'medium' ? 0.1 : 0),
            severity: pattern.severity,
            evidence,
            explanation: pattern.explanation,
            mitigation: pattern.mitigation,
            detectedAt: new Date(),
          });
          break; // One detection per category
        }
      }
    }

    return detections;
  }

  private calculateOverallScore(detections: BiasDetection[]): number {
    if (detections.length === 0) return 0;

    const severityWeights = { low: 5, medium: 15, high: 25, critical: 40 };
    let total = 0;

    for (const d of detections) {
      total += severityWeights[d.severity] * d.confidence;
    }

    return Math.min(100, Math.round(total));
  }

  private generateSummary(detections: BiasDetection[], score: number): string {
    if (detections.length === 0) {
      return 'No cognitive biases detected in the analyzed text.';
    }

    const categories = [...new Set(detections.map(d => d.category))];
    const highSeverity = detections.filter(d => d.severity === 'high' || d.severity === 'critical');

    let summary = `Detected ${detections.length} potential cognitive bias(es) across ${categories.length} category(ies). Overall bias score: ${score}/100.`;

    if (highSeverity.length > 0) {
      summary += ` HIGH PRIORITY: ${highSeverity.map(d => d.category.replace('_', ' ')).join(', ')}.`;
    }

    summary += ` Categories: ${categories.map(c => c.replace('_', ' ')).join(', ')}.`;
    return summary;
  }
}

export const nlpBiasDetectionService = new NLPBiasDetectionService();
