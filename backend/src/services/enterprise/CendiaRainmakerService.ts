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
}

export const cendiaRainmakerService = new CendiaRainmakerService();
export default cendiaRainmakerService;
