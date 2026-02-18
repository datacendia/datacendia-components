// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIARAINMAKER™ - THE DEAL ARCHITECT
// Sales Operations & Deal Intelligence
// "The Closer" - AI that predicts and unblocks deals
// =============================================================================

import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';

// =============================================================================
// TYPES
// =============================================================================

export interface Deal {
  id: string;
  accountName: string;
  contactName: string;
  contactEmail: string;
  contactTitle: string;
  dealValue: number;
  currency: string;
  stage: 'prospecting' | 'discovery' | 'proposal' | 'negotiation' | 'closing' | 'won' | 'lost';
  probability: number; // 0-100
  expectedCloseDate: Date;
  daysInStage: number;
  nextAction: string;
  blockers: string[];
  competitors: string[];
  championName?: string;
  economicBuyer?: string;
  createdAt: Date;
  lastActivityAt: Date;
}

export interface CallAnalysis {
  dealId: string;
  callDate: Date;
  duration: number; // minutes
  participants: string[];
  transcript?: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  objections: { objection: string; response: string; resolved: boolean }[];
  nextSteps: string[];
  riskSignals: string[];
  whisperCoaching: string[];
}

export interface DealPrediction {
  dealId: string;
  willClose: boolean;
  confidence: number;
  predictedCloseDate: Date;
  slipRisk: number; // 0-100
  reasons: string[];
  interventions: string[];
}

export interface ExecutiveLetter {
  dealId: string;
  fromTitle: string;
  toName: string;
  toTitle: string;
  subject: string;
  body: string;
  purpose: 'unblock' | 'escalate' | 'close' | 'save';
  generatedAt: Date;
}

// =============================================================================
// CENDIARAINMAKER SERVICE
// =============================================================================

class CendiaRainmakerService {
  private deals: Map<string, Deal> = new Map();
  private callAnalyses: CallAnalysis[] = [];
  private predictions: Map<string, DealPrediction> = new Map();

  // ---------------------------------------------------------------------------
  // DEAL PREDICTION
  // ---------------------------------------------------------------------------

  async predictDealOutcome(dealId: string): Promise<DealPrediction> {
    const deal = this.deals.get(dealId);
    if (!deal) throw new Error('Deal not found');

    const recentCalls = this.callAnalyses
      .filter(c => c.dealId === dealId)
      .sort((a, b) => b.callDate.getTime() - a.callDate.getTime())
      .slice(0, 3);

    const prompt = `Predict the outcome of this enterprise sales deal:

Deal: ${deal.accountName}
Value: $${deal.dealValue.toLocaleString()}
Stage: ${deal.stage}
Days in Stage: ${deal.daysInStage}
Current Probability: ${deal.probability}%
Expected Close: ${deal.expectedCloseDate.toLocaleDateString()}
Blockers: ${deal.blockers.join(', ') || 'None identified'}
Competitors: ${deal.competitors.join(', ') || 'Unknown'}
Has Champion: ${deal.championName ? 'Yes' : 'No'}
Has Economic Buyer Access: ${deal.economicBuyer ? 'Yes' : 'No'}

Recent Call Sentiment: ${recentCalls.map(c => c.sentiment).join(', ') || 'No calls'}
Recent Objections: ${recentCalls.flatMap(c => c.objections.map(o => o.objection)).join(', ') || 'None'}
Risk Signals: ${recentCalls.flatMap(c => c.riskSignals).join(', ') || 'None'}

Output JSON:
{
  "willClose": true/false,
  "confidence": 0-100,
  "slipRisk": 0-100,
  "predictedCloseDate": "YYYY-MM-DD",
  "reasons": ["..."],
  "interventions": ["..."]
}`;

    try {
      const response = await ollama.generate(prompt, { model: 'qwq:32b' });
      const analysis = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');

      const prediction: DealPrediction = {
        dealId,
        willClose: analysis.willClose ?? deal.probability > 50,
        confidence: analysis.confidence || 60,
        predictedCloseDate: analysis.predictedCloseDate ? new Date(analysis.predictedCloseDate) : deal.expectedCloseDate,
        slipRisk: analysis.slipRisk || (deal.daysInStage > 30 ? 70 : 30),
        reasons: analysis.reasons || ['Analysis based on stage and activity'],
        interventions: analysis.interventions || ['Schedule follow-up call'],
      };

      this.predictions.set(dealId, prediction);
      return prediction;
    } catch (error) {
      logger.error('Deal prediction failed:', error);
      return {
        dealId,
        willClose: deal.probability > 50,
        confidence: 50,
        predictedCloseDate: deal.expectedCloseDate,
        slipRisk: deal.daysInStage > 30 ? 70 : 30,
        reasons: ['AI analysis unavailable'],
        interventions: ['Manual review required'],
      };
    }
  }

  async getSlippingDeals(): Promise<DealPrediction[]> {
    const predictions: DealPrediction[] = [];
    
    for (const deal of this.deals.values()) {
      if (deal.stage !== 'won' && deal.stage !== 'lost') {
        const prediction = await this.predictDealOutcome(deal.id);
        if (prediction.slipRisk > 60) {
          predictions.push(prediction);
        }
      }
    }

    return predictions.sort((a, b) => b.slipRisk - a.slipRisk);
  }

  // ---------------------------------------------------------------------------
  // THE CLOSER - Executive Sponsor Letters
  // ---------------------------------------------------------------------------

  async generateExecutiveLetter(dealId: string, purpose: ExecutiveLetter['purpose']): Promise<ExecutiveLetter> {
    const deal = this.deals.get(dealId);
    if (!deal) throw new Error('Deal not found');

    const prediction = this.predictions.get(dealId) || await this.predictDealOutcome(dealId);

    const purposeContext = {
      unblock: 'The deal is stuck and needs executive attention to move forward.',
      escalate: 'There are concerns that need to be addressed at the executive level.',
      close: 'The deal is ready to close but needs final executive buy-in.',
      save: 'The deal is at risk of being lost and needs immediate intervention.',
    }[purpose];

    const prompt = `Write an executive sponsor letter from CEO to ${deal.economicBuyer || deal.contactName} at ${deal.accountName}.

Purpose: ${purposeContext}
Deal Value: $${deal.dealValue.toLocaleString()}
Current Stage: ${deal.stage}
Blockers: ${deal.blockers.join(', ') || 'Timing and prioritization'}
Risk Signals: ${prediction.reasons.join(', ')}

The letter should:
1. Be professional and executive-level tone
2. Reference our shared goals and partnership potential
3. ${purpose === 'save' ? 'Express concern about losing the opportunity' : 'Express enthusiasm about moving forward'}
4. Request a brief call or meeting
5. Be concise (under 200 words)

Output JSON:
{
  "subject": "...",
  "body": "..."
}`;

    try {
      const response = await ollama.generate(prompt, { model: 'qwen2.5:7b' });
      const letter = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');

      return {
        dealId,
        fromTitle: 'CEO',
        toName: deal.economicBuyer || deal.contactName,
        toTitle: deal.contactTitle,
        subject: letter.subject || `Partnership Opportunity - ${deal.accountName}`,
        body: letter.body || 'Letter generation failed. Please draft manually.',
        purpose,
        generatedAt: new Date(),
      };
    } catch (error) {
      logger.error('Executive letter generation failed:', error);
      throw error;
    }
  }

  // ---------------------------------------------------------------------------
  // CALL ANALYSIS & WHISPER COACHING
  // ---------------------------------------------------------------------------

  async analyzeCall(dealId: string, transcript: string, participants: string[]): Promise<CallAnalysis> {
    const deal = this.deals.get(dealId);
    
    const prompt = `Analyze this sales call transcript:

Account: ${deal?.accountName || 'Unknown'}
Participants: ${participants.join(', ')}

Transcript:
${transcript.substring(0, 3000)}

Output JSON:
{
  "sentiment": "positive|neutral|negative",
  "objections": [{ "objection": "...", "response": "...", "resolved": true/false }],
  "nextSteps": ["..."],
  "riskSignals": ["..."],
  "whisperCoaching": ["real-time tips for the rep"]
}`;

    try {
      const response = await ollama.generate(prompt, { model: 'qwen2.5:7b' });
      const analysis = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');

      const callAnalysis: CallAnalysis = {
        dealId,
        callDate: new Date(),
        duration: Math.round(transcript.split(' ').length / 150), // Rough estimate
        participants,
        transcript,
        sentiment: analysis.sentiment || 'neutral',
        objections: analysis.objections || [],
        nextSteps: analysis.nextSteps || [],
        riskSignals: analysis.riskSignals || [],
        whisperCoaching: analysis.whisperCoaching || [],
      };

      this.callAnalyses.push(callAnalysis);
      return callAnalysis;
    } catch (error) {
      logger.error('Call analysis failed:', error);
      throw error;
    }
  }

  async getWhisperCoaching(dealId: string, currentContext: string): Promise<string[]> {
    const deal = this.deals.get(dealId);
    if (!deal) return ['Focus on value, not price.'];

    const prompt = `Quick sales coaching for ${deal.accountName}:

Context: ${currentContext}
Stage: ${deal.stage}
Blockers: ${deal.blockers.join(', ')}

Provide 3 short, actionable tips for right now. Output JSON array of strings.`;

    try {
      const response = await ollama.generate(prompt, { model: 'llama3.2:3b' });
      const tips = JSON.parse(response.match(/\[[\s\S]*\]/)?.[0] || '[]');
      return tips.length > 0 ? tips : ['Ask about their timeline.', 'Identify the economic buyer.', 'Address concerns directly.'];
    } catch (error) {
      return ['Ask about their timeline.', 'Identify the economic buyer.', 'Address concerns directly.'];
    }
  }

  // ---------------------------------------------------------------------------
  // DEAL MANAGEMENT
  // ---------------------------------------------------------------------------

  addDeal(deal: Omit<Deal, 'id' | 'createdAt' | 'lastActivityAt'>): Deal {
    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      ...deal,
      createdAt: new Date(),
      lastActivityAt: new Date(),
    };
    this.deals.set(newDeal.id, newDeal);
    return newDeal;
  }

  updateDealStage(dealId: string, stage: Deal['stage']): void {
    const deal = this.deals.get(dealId);
    if (deal) {
      deal.stage = stage;
      deal.daysInStage = 0;
      deal.lastActivityAt = new Date();
    }
  }

  // ---------------------------------------------------------------------------
  // PIPELINE METRICS
  // ---------------------------------------------------------------------------

  getPipelineMetrics(): {
    totalValue: number;
    weightedValue: number;
    dealCount: number;
    avgDealSize: number;
    stageBreakdown: Record<string, { count: number; value: number }>;
    atRiskValue: number;
  } {
    const activeDeals = Array.from(this.deals.values())
      .filter(d => d.stage !== 'won' && d.stage !== 'lost');

    const totalValue = activeDeals.reduce((sum, d) => sum + d.dealValue, 0);
    const weightedValue = activeDeals.reduce((sum, d) => sum + d.dealValue * (d.probability / 100), 0);

    const stageBreakdown: Record<string, { count: number; value: number }> = {};
    for (const deal of activeDeals) {
      if (!stageBreakdown[deal.stage]) {
        stageBreakdown[deal.stage] = { count: 0, value: 0 };
      }
      stageBreakdown[deal.stage].count++;
      stageBreakdown[deal.stage].value += deal.dealValue;
    }

    const atRiskDeals = activeDeals.filter(d => {
      const prediction = this.predictions.get(d.id);
      return prediction && prediction.slipRisk > 60;
    });
    const atRiskValue = atRiskDeals.reduce((sum, d) => sum + d.dealValue, 0);

    return {
      totalValue,
      weightedValue,
      dealCount: activeDeals.length,
      avgDealSize: activeDeals.length > 0 ? totalValue / activeDeals.length : 0,
      stageBreakdown,
      atRiskValue,
    };
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getMetrics(): {
    totalDeals: number;
    pipelineValue: number;
    weightedPipeline: number;
    atRiskDeals: number;
    atRiskValue: number;
    avgWinRate: number;
  } {
    const allDeals = Array.from(this.deals.values());
    const activeDeals = allDeals.filter(d => d.stage !== 'won' && d.stage !== 'lost');
    const wonDeals = allDeals.filter(d => d.stage === 'won');
    const lostDeals = allDeals.filter(d => d.stage === 'lost');

    const pipelineValue = activeDeals.reduce((sum, d) => sum + d.dealValue, 0);
    const weightedPipeline = activeDeals.reduce((sum, d) => sum + d.dealValue * (d.probability / 100), 0);

    const atRiskDeals = activeDeals.filter(d => {
      const prediction = this.predictions.get(d.id);
      return (prediction && prediction.slipRisk > 60) || d.probability < 30;
    });
    const atRiskValue = atRiskDeals.reduce((sum, d) => sum + d.dealValue, 0);

    const closedCount = wonDeals.length + lostDeals.length;
    const avgWinRate = closedCount > 0 ? Math.round((wonDeals.length / closedCount) * 100) : 0;

    return {
      totalDeals: allDeals.length,
      pipelineValue,
      weightedPipeline,
      atRiskDeals: atRiskDeals.length,
      atRiskValue,
      avgWinRate,
    };
  }

  // ===========================================================================
  // 10/10 ENHANCEMENTS
  // ===========================================================================

  /** 10/10: Sales Intelligence Dashboard */
  getSalesIntelligenceDashboard(): {
    pipeline: { totalDeals: number; totalValue: number; weightedValue: number; avgDealSize: number; avgProbability: number };
    stageBreakdown: Array<{ stage: string; count: number; value: number; avgDaysInStage: number; avgProbability: number }>;
    velocity: { avgDaysToClose: number; avgDaysInCurrentStage: number; stuckDeals: number; fastMoving: number };
    winLoss: { won: number; lost: number; winRate: number; wonValue: number; lostValue: number; avgWonDealSize: number; avgLostDealSize: number };
    callActivity: { totalCalls: number; avgSentiment: string; totalObjections: number; resolvedObjections: number; objectionResolutionRate: number };
    topDeals: Array<{ account: string; value: number; stage: string; probability: number; daysInStage: number; hasChampion: boolean; hasBuyer: boolean }>;
    insights: string[];
  } {
    const allDeals = Array.from(this.deals.values());
    const active = allDeals.filter(d => d.stage !== 'won' && d.stage !== 'lost');
    const won = allDeals.filter(d => d.stage === 'won');
    const lost = allDeals.filter(d => d.stage === 'lost');

    const totalValue = active.reduce((s, d) => s + d.dealValue, 0);
    const weightedValue = active.reduce((s, d) => s + d.dealValue * (d.probability / 100), 0);
    const avgProb = active.length > 0 ? active.reduce((s, d) => s + d.probability, 0) / active.length : 0;

    const stageMap: Record<string, { count: number; value: number; days: number; prob: number }> = {};
    for (const d of active) {
      if (!stageMap[d.stage]) stageMap[d.stage] = { count: 0, value: 0, days: 0, prob: 0 };
      stageMap[d.stage].count++;
      stageMap[d.stage].value += d.dealValue;
      stageMap[d.stage].days += d.daysInStage;
      stageMap[d.stage].prob += d.probability;
    }

    const stuckDeals = active.filter(d => d.daysInStage > 30).length;
    const fastMoving = active.filter(d => d.daysInStage < 7 && d.probability > 50).length;

    let totalObj = 0; let resolvedObj = 0;
    const sentiments: Record<string, number> = { positive: 0, neutral: 0, negative: 0 };
    for (const c of this.callAnalyses) {
      sentiments[c.sentiment]++;
      totalObj += c.objections.length;
      resolvedObj += c.objections.filter(o => o.resolved).length;
    }
    const topSentiment = Object.entries(sentiments).sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';

    const closedCount = won.length + lost.length;

    const topDeals = [...active].sort((a, b) => b.dealValue - a.dealValue).slice(0, 10).map(d => ({
      account: d.accountName, value: d.dealValue, stage: d.stage, probability: d.probability,
      daysInStage: d.daysInStage, hasChampion: !!d.championName, hasBuyer: !!d.economicBuyer,
    }));

    const insights: string[] = [];
    if (stuckDeals > 0) insights.push(`${stuckDeals} deal(s) stuck in stage for 30+ days`);
    const noChampion = active.filter(d => !d.championName && d.dealValue > 50000).length;
    if (noChampion > 0) insights.push(`${noChampion} high-value deal(s) without an identified champion`);
    const noBuyer = active.filter(d => !d.economicBuyer && (d.stage === 'proposal' || d.stage === 'negotiation')).length;
    if (noBuyer > 0) insights.push(`${noBuyer} late-stage deal(s) without economic buyer access`);
    if (totalObj > 0) insights.push(`Objection resolution rate: ${totalObj > 0 ? Math.round((resolvedObj / totalObj) * 100) : 0}%`);
    if (insights.length === 0) insights.push('Sales pipeline is healthy');

    return {
      pipeline: { totalDeals: active.length, totalValue, weightedValue, avgDealSize: active.length > 0 ? Math.round(totalValue / active.length) : 0, avgProbability: Math.round(avgProb) },
      stageBreakdown: Object.entries(stageMap).map(([st, d]) => ({ stage: st, count: d.count, value: d.value, avgDaysInStage: Math.round(d.days / d.count), avgProbability: Math.round(d.prob / d.count) })),
      velocity: { avgDaysToClose: won.length > 0 ? Math.round(won.reduce((s, d) => s + Math.round((d.lastActivityAt.getTime() - d.createdAt.getTime()) / (24 * 60 * 60 * 1000)), 0) / won.length) : 0, avgDaysInCurrentStage: active.length > 0 ? Math.round(active.reduce((s, d) => s + d.daysInStage, 0) / active.length) : 0, stuckDeals, fastMoving },
      winLoss: { won: won.length, lost: lost.length, winRate: closedCount > 0 ? Math.round((won.length / closedCount) * 100) : 0, wonValue: won.reduce((s, d) => s + d.dealValue, 0), lostValue: lost.reduce((s, d) => s + d.dealValue, 0), avgWonDealSize: won.length > 0 ? Math.round(won.reduce((s, d) => s + d.dealValue, 0) / won.length) : 0, avgLostDealSize: lost.length > 0 ? Math.round(lost.reduce((s, d) => s + d.dealValue, 0) / lost.length) : 0 },
      callActivity: { totalCalls: this.callAnalyses.length, avgSentiment: topSentiment, totalObjections: totalObj, resolvedObjections: resolvedObj, objectionResolutionRate: totalObj > 0 ? Math.round((resolvedObj / totalObj) * 100) : 100 },
      topDeals,
      insights,
    };
  }

  /** 10/10: Deal Risk & Pipeline Analytics */
  getDealRiskAnalytics(): {
    atRiskDeals: Array<{ account: string; dealId: string; value: number; stage: string; riskFactors: string[]; riskScore: number; recommendedActions: string[] }>;
    riskDistribution: { low: number; medium: number; high: number; critical: number };
    totalAtRiskValue: number;
    competitorAnalysis: Array<{ competitor: string; dealsContested: number; totalContestValue: number }>;
    blockerAnalysis: Array<{ blocker: string; frequency: number; avgDealValue: number }>;
    staleDeals: Array<{ account: string; dealId: string; value: number; daysSinceActivity: number; stage: string }>;
    insights: string[];
  } {
    const active = Array.from(this.deals.values()).filter(d => d.stage !== 'won' && d.stage !== 'lost');
    const riskDist = { low: 0, medium: 0, high: 0, critical: 0 };
    const compMap: Record<string, { count: number; value: number }> = {};
    const blockerMap: Record<string, { count: number; totalValue: number }> = {};
    let totalAtRisk = 0;

    const atRiskDeals = active.map(d => {
      const riskFactors: string[] = [];
      let riskScore = 0;

      if (d.daysInStage > 45) { riskFactors.push('Stuck in stage 45+ days'); riskScore += 30; }
      else if (d.daysInStage > 30) { riskFactors.push('Slow stage progression'); riskScore += 15; }
      if (!d.championName) { riskFactors.push('No champion identified'); riskScore += 20; }
      if (!d.economicBuyer && d.stage !== 'prospecting' && d.stage !== 'discovery') { riskFactors.push('No economic buyer access'); riskScore += 20; }
      if (d.blockers.length > 0) { riskFactors.push(`${d.blockers.length} blocker(s)`); riskScore += d.blockers.length * 10; }
      if (d.competitors.length > 2) { riskFactors.push('Heavy competition'); riskScore += 15; }
      if (d.probability < 30) { riskFactors.push('Low probability'); riskScore += 20; }

      const prediction = this.predictions.get(d.id);
      if (prediction && prediction.slipRisk > 60) { riskFactors.push(`High slip risk (${prediction.slipRisk}%)`); riskScore += 15; }

      riskScore = Math.min(100, riskScore);
      const level = riskScore >= 70 ? 'critical' : riskScore >= 50 ? 'high' : riskScore >= 25 ? 'medium' : 'low';
      riskDist[level]++;
      if (riskScore >= 50) totalAtRisk += d.dealValue;

      for (const comp of d.competitors) {
        if (!compMap[comp]) compMap[comp] = { count: 0, value: 0 };
        compMap[comp].count++;
        compMap[comp].value += d.dealValue;
      }
      for (const b of d.blockers) {
        if (!blockerMap[b]) blockerMap[b] = { count: 0, totalValue: 0 };
        blockerMap[b].count++;
        blockerMap[b].totalValue += d.dealValue;
      }

      const actions: string[] = [];
      if (!d.championName) actions.push('Identify and cultivate internal champion');
      if (!d.economicBuyer) actions.push('Gain access to economic buyer');
      if (d.daysInStage > 30) actions.push('Schedule executive sponsor call');
      if (d.blockers.length > 0) actions.push('Address blockers with targeted action plan');

      return { account: d.accountName, dealId: d.id, value: d.dealValue, stage: d.stage, riskFactors, riskScore, recommendedActions: actions };
    }).filter(d => d.riskScore > 0).sort((a, b) => b.riskScore - a.riskScore);

    const now = Date.now();
    const staleDeals = active
      .map(d => ({ account: d.accountName, dealId: d.id, value: d.dealValue, daysSinceActivity: Math.floor((now - d.lastActivityAt.getTime()) / (24 * 60 * 60 * 1000)), stage: d.stage }))
      .filter(d => d.daysSinceActivity > 14)
      .sort((a, b) => b.daysSinceActivity - a.daysSinceActivity);

    const insights: string[] = [];
    if (riskDist.critical > 0) insights.push(`${riskDist.critical} deal(s) at critical risk — immediate intervention needed`);
    if (totalAtRisk > 0) insights.push(`$${Math.round(totalAtRisk).toLocaleString()} in pipeline value at high/critical risk`);
    if (staleDeals.length > 0) insights.push(`${staleDeals.length} deal(s) with no activity in 14+ days`);
    if (insights.length === 0) insights.push('Pipeline risk levels are acceptable');

    return {
      atRiskDeals: atRiskDeals.slice(0, 15),
      riskDistribution: riskDist,
      totalAtRiskValue: totalAtRisk,
      competitorAnalysis: Object.entries(compMap).map(([c, d]) => ({ competitor: c, dealsContested: d.count, totalContestValue: d.value })).sort((a, b) => b.totalContestValue - a.totalContestValue),
      blockerAnalysis: Object.entries(blockerMap).map(([b, d]) => ({ blocker: b, frequency: d.count, avgDealValue: Math.round(d.totalValue / d.count) })).sort((a, b) => b.frequency - a.frequency),
      staleDeals: staleDeals.slice(0, 10),
      insights,
    };
  }

  /** 10/10: Revenue Forecasting Engine */
  getRevenueForecast(): {
    currentQuarter: { committed: number; bestCase: number; pipeline: number; gap: number; target: number };
    byStage: Array<{ stage: string; dealCount: number; totalValue: number; weightedValue: number; avgCloseRate: number }>;
    byMonth: Array<{ month: string; expected: number; bestCase: number; committed: number }>;
    dealMovement: { advancing: number; stalled: number; regressing: number };
    forecastAccuracy: { predictedCloses: number; actualCloses: number; accuracyRate: number };
    quarterlyTrend: Array<{ period: string; won: number; lost: number; value: number }>;
    insights: string[];
  } {
    const allDeals = Array.from(this.deals.values());
    const active = allDeals.filter(d => d.stage !== 'won' && d.stage !== 'lost');
    const won = allDeals.filter(d => d.stage === 'won');

    const stageWeights: Record<string, number> = { prospecting: 10, discovery: 25, proposal: 50, negotiation: 75, closing: 90 };
    const historicalCloseRates: Record<string, number> = { prospecting: 5, discovery: 15, proposal: 40, negotiation: 65, closing: 85 };

    const committed = active.filter(d => d.probability >= 80).reduce((s, d) => s + d.dealValue, 0);
    const bestCase = active.filter(d => d.probability >= 50).reduce((s, d) => s + d.dealValue, 0);
    const pipeline = active.reduce((s, d) => s + d.dealValue * (d.probability / 100), 0);
    const target = won.reduce((s, d) => s + d.dealValue, 0) * 1.3; // 30% growth target
    const gap = Math.max(0, target - committed);

    const stageAnalysis = Object.entries(stageWeights).map(([stage]) => {
      const stageDeals = active.filter(d => d.stage === stage);
      const totalVal = stageDeals.reduce((s, d) => s + d.dealValue, 0);
      return { stage, dealCount: stageDeals.length, totalValue: totalVal, weightedValue: Math.round(totalVal * ((historicalCloseRates[stage] || 50) / 100)), avgCloseRate: historicalCloseRates[stage] || 50 };
    });

    const monthMap: Record<string, { expected: number; bestCase: number; committed: number }> = {};
    for (const d of active) {
      const monthKey = `${d.expectedCloseDate.getFullYear()}-${String(d.expectedCloseDate.getMonth() + 1).padStart(2, '0')}`;
      if (!monthMap[monthKey]) monthMap[monthKey] = { expected: 0, bestCase: 0, committed: 0 };
      monthMap[monthKey].expected += d.dealValue * (d.probability / 100);
      if (d.probability >= 50) monthMap[monthKey].bestCase += d.dealValue;
      if (d.probability >= 80) monthMap[monthKey].committed += d.dealValue;
    }

    const advancing = active.filter(d => d.daysInStage < 14 && d.probability > 40).length;
    const stalled = active.filter(d => d.daysInStage > 30).length;
    const regressing = active.filter(d => {
      const pred = this.predictions.get(d.id);
      return pred && !pred.willClose && pred.confidence > 60;
    }).length;

    const predictions = Array.from(this.predictions.values());
    const predictedCloses = predictions.filter(p => p.willClose).length;
    const actualCloses = won.length;

    const insights: string[] = [];
    if (gap > 0) insights.push(`$${Math.round(gap).toLocaleString()} gap to quarterly target from committed deals`);
    if (stalled > 0) insights.push(`${stalled} deal(s) stalled in current stage — need acceleration`);
    if (regressing > 0) insights.push(`${regressing} deal(s) predicted to not close — consider intervention or deprioritize`);
    const topOfFunnel = active.filter(d => d.stage === 'prospecting' || d.stage === 'discovery').length;
    if (topOfFunnel < 5) insights.push('Low top-of-funnel activity — increase prospecting efforts');
    if (insights.length === 0) insights.push('Revenue forecast is on track');

    return {
      currentQuarter: { committed, bestCase, pipeline: Math.round(pipeline), gap, target: Math.round(target) },
      byStage: stageAnalysis,
      byMonth: Object.entries(monthMap).sort(([a], [b]) => a.localeCompare(b)).map(([m, d]) => ({ month: m, expected: Math.round(d.expected), bestCase: Math.round(d.bestCase), committed: Math.round(d.committed) })),
      dealMovement: { advancing, stalled, regressing },
      forecastAccuracy: { predictedCloses, actualCloses, accuracyRate: predictedCloses > 0 ? Math.round((actualCloses / predictedCloses) * 100) : 0 },
      quarterlyTrend: [],
      insights,
    };
  }

  /** 10/10: Call Intelligence & Coaching Analytics */
  getCallIntelligenceAnalytics(): {
    summary: { totalCalls: number; avgDuration: number; sentimentBreakdown: { positive: number; neutral: number; negative: number } };
    objectionPatterns: Array<{ objection: string; frequency: number; resolutionRate: number }>;
    topRiskSignals: Array<{ signal: string; frequency: number }>;
    coachingThemes: Array<{ theme: string; frequency: number }>;
    callTrend: Array<{ dealAccount: string; callCount: number; avgSentiment: string; latestDate: Date }>;
    insights: string[];
  } {
    const calls = this.callAnalyses;
    const sentBreak = { positive: 0, neutral: 0, negative: 0 };
    const objMap: Record<string, { count: number; resolved: number }> = {};
    const riskMap: Record<string, number> = {};
    const coachMap: Record<string, number> = {};
    const dealCallMap: Record<string, { count: number; sentiments: string[]; latest: Date }> = {};

    for (const c of calls) {
      sentBreak[c.sentiment]++;

      for (const o of c.objections) {
        const key = o.objection.substring(0, 60);
        if (!objMap[key]) objMap[key] = { count: 0, resolved: 0 };
        objMap[key].count++;
        if (o.resolved) objMap[key].resolved++;
      }

      for (const r of c.riskSignals) {
        const key = r.substring(0, 60);
        riskMap[key] = (riskMap[key] || 0) + 1;
      }

      for (const w of c.whisperCoaching) {
        const key = w.substring(0, 60);
        coachMap[key] = (coachMap[key] || 0) + 1;
      }

      const deal = this.deals.get(c.dealId);
      const acct = deal?.accountName || c.dealId;
      if (!dealCallMap[acct]) dealCallMap[acct] = { count: 0, sentiments: [], latest: c.callDate };
      dealCallMap[acct].count++;
      dealCallMap[acct].sentiments.push(c.sentiment);
      if (c.callDate > dealCallMap[acct].latest) dealCallMap[acct].latest = c.callDate;
    }

    const avgDuration = calls.length > 0 ? Math.round(calls.reduce((s, c) => s + c.duration, 0) / calls.length) : 0;

    const insights: string[] = [];
    if (sentBreak.negative > sentBreak.positive) insights.push('More negative calls than positive — review sales approach');
    const lowRes = Object.values(objMap).filter(o => o.count > 1 && (o.resolved / o.count) < 0.5);
    if (lowRes.length > 0) insights.push(`${lowRes.length} recurring objection(s) with <50% resolution rate — develop battle cards`);
    if (calls.length === 0) insights.push('No calls analyzed yet — start logging call transcripts');
    if (insights.length === 0) insights.push('Call performance is strong');

    return {
      summary: { totalCalls: calls.length, avgDuration, sentimentBreakdown: sentBreak },
      objectionPatterns: Object.entries(objMap).map(([o, d]) => ({ objection: o, frequency: d.count, resolutionRate: d.count > 0 ? Math.round((d.resolved / d.count) * 100) : 0 })).sort((a, b) => b.frequency - a.frequency).slice(0, 10),
      topRiskSignals: Object.entries(riskMap).map(([s, c]) => ({ signal: s, frequency: c })).sort((a, b) => b.frequency - a.frequency).slice(0, 10),
      coachingThemes: Object.entries(coachMap).map(([t, c]) => ({ theme: t, frequency: c })).sort((a, b) => b.frequency - a.frequency).slice(0, 10),
      callTrend: Object.entries(dealCallMap).map(([acct, d]) => {
        const sents = d.sentiments;
        const avgSent = sents.filter(s => s === 'positive').length > sents.filter(s => s === 'negative').length ? 'positive' : sents.filter(s => s === 'negative').length > sents.filter(s => s === 'positive').length ? 'negative' : 'neutral';
        return { dealAccount: acct, callCount: d.count, avgSentiment: avgSent, latestDate: d.latest };
      }).sort((a, b) => b.callCount - a.callCount),
      insights,
    };
  }
}

export const cendiaRainmakerService = new CendiaRainmakerService();
export default cendiaRainmakerService;
