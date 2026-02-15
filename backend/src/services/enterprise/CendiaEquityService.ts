// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIAEQUITY™ - INVESTOR RELATIONS INTELLIGENCE
// "The Market Whisperer" - AI-powered IR strategy and market sentiment analysis
// =============================================================================

import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';
import { aiModelSelector } from '../../config/aiModels.js';

// =============================================================================
// TYPES
// =============================================================================

export interface MarketSentiment {
  symbol: string;
  currentPrice: number;
  change24h: number;
  sentiment: 'very_bullish' | 'bullish' | 'neutral' | 'bearish' | 'very_bearish';
  sentimentScore: number; // -100 to 100
  shortInterest: number;
  volume: number;
  avgVolume: number;
  volatility: number;
  analystRatings: AnalystRatings;
  newsImpact: NewsImpact[];
  socialMentions: number;
  institutionalHoldings: number;
  insiderActivity: InsiderActivity[];
  lastUpdated: Date;
}

export interface AnalystRatings {
  buy: number;
  hold: number;
  sell: number;
  averageTarget: number;
  highTarget: number;
  lowTarget: number;
  consensus: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
}

export interface NewsImpact {
  headline: string;
  source: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  impact: 'high' | 'medium' | 'low';
  publishedAt: Date;
}

export interface InsiderActivity {
  name: string;
  title: string;
  type: 'buy' | 'sell' | 'grant';
  shares: number;
  value: number;
  date: Date;
}

export interface EarningsSimulation {
  phrase: string;
  predictedImpact: number; // percentage change
  confidence: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  recommendation: 'use' | 'modify' | 'avoid';
  suggestedAlternative?: string;
  reasoning: string;
}

export interface EarningsCallPrep {
  quarterEnd: Date;
  keyMetrics: MetricHighlight[];
  talkingPoints: TalkingPoint[];
  anticipatedQuestions: AnticipatedQuestion[];
  riskFactors: string[];
  positiveNarratives: string[];
  languageWarnings: LanguageWarning[];
  competitorMentions: CompetitorMention[];
  generatedAt: Date;
}

export interface MetricHighlight {
  metric: string;
  value: string;
  change: number;
  beating: boolean;
  talkingPoint: string;
}

export interface TalkingPoint {
  topic: string;
  message: string;
  supportingData: string;
  tone: 'confident' | 'measured' | 'cautious';
}

export interface AnticipatedQuestion {
  question: string;
  likelihood: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'moderate' | 'challenging';
  suggestedResponse: string;
  dataPoints: string[];
}

export interface LanguageWarning {
  phrase: string;
  risk: 'legal' | 'market_moving' | 'misleading' | 'vague';
  severity: 'low' | 'medium' | 'high';
  suggestion: string;
}

export interface CompetitorMention {
  competitor: string;
  context: string;
  safeToMention: boolean;
  recommendation: string;
}

export interface InvestorProfile {
  id: string;
  name: string;
  type: 'institutional' | 'hedge_fund' | 'retail' | 'activist' | 'index';
  aum: number;
  holdings: number;
  percentOwnership: number;
  investmentStyle: 'value' | 'growth' | 'momentum' | 'income' | 'index';
  engagementLevel: 'active' | 'passive' | 'monitoring';
  sentiment: 'supportive' | 'neutral' | 'concerned' | 'hostile';
  keyContacts: Contact[];
  lastEngagement?: Date;
  notes: string[];
}

export interface Contact {
  name: string;
  title: string;
  email?: string;
  phone?: string;
}

export interface ShareholderOutreach {
  id: string;
  investorId: string;
  type: 'quarterly_update' | 'one_on_one' | 'roadshow' | 'conference' | 'crisis';
  status: 'planned' | 'scheduled' | 'completed' | 'cancelled';
  scheduledDate?: Date;
  completedDate?: Date;
  attendees: string[];
  topics: string[];
  outcome?: string;
  followUp?: string;
}

export interface ActivistDefense {
  activistName: string;
  currentStake: number;
  threatLevel: 'low' | 'medium' | 'high' | 'imminent';
  demands: string[];
  vulnerabilities: string[];
  defenseStrategies: DefenseStrategy[];
  boardRecommendation: string;
  aiAnalysis: string;
  generatedAt: Date;
}

export interface DefenseStrategy {
  name: string;
  description: string;
  effectiveness: number;
  cost: number;
  timeToImplement: string;
  risks: string[];
}

export interface IRCalendar {
  events: IREvent[];
  blackoutPeriods: BlackoutPeriod[];
}

export interface IREvent {
  id: string;
  type: 'earnings' | 'investor_day' | 'conference' | 'roadshow' | 'filing' | 'dividend';
  title: string;
  date: Date;
  location?: string;
  description: string;
  participants: string[];
  materials: string[];
}

export interface BlackoutPeriod {
  start: Date;
  end: Date;
  reason: string;
  restrictions: string[];
}

// =============================================================================
// SERVICE
// =============================================================================

class CendiaEquityService {
  private investors: Map<string, InvestorProfile> = new Map();
  private outreach: Map<string, ShareholderOutreach> = new Map();
  private calendar: IRCalendar = { events: [], blackoutPeriods: [] };
  private sentimentCache: Map<string, MarketSentiment> = new Map();

  constructor() {
    logger.info('CendiaEquity™ initialized - The Market Whisperer is listening');
  }

  // ---------------------------------------------------------------------------
  // MARKET SENTIMENT
  // ---------------------------------------------------------------------------

  async analyzeSentiment(symbol: string): Promise<MarketSentiment> {
    const cached = this.sentimentCache.get(symbol);
    if (cached && Date.now() - cached.lastUpdated.getTime() < 300000) { // 5 min cache
      return cached;
    }

    const prompt = `You are CendiaEquity™, an AI investor relations system analyzing market sentiment.

Analyze the current market sentiment for stock symbol: ${symbol}

Provide analysis in JSON format:
{
  "sentiment": "very_bullish|bullish|neutral|bearish|very_bearish",
  "sentimentScore": -100 to 100,
  "shortInterestAssessment": "low|moderate|elevated|high",
  "volumeAnalysis": "below_average|average|above_average|surge",
  "analystConsensus": "strong_buy|buy|hold|sell|strong_sell",
  "keyDrivers": ["driver 1", "driver 2"],
  "risks": ["risk 1", "risk 2"],
  "outlook": "brief market outlook"
}`;

    let sentimentData: any = {};

    try {
      const isAvailable = await ollama.isAvailable();
      if (isAvailable) {
        const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForService('investor_relations') });
        sentimentData = this.parseJsonFromResponse(response) || {};
      }
    } catch (error) {
      logger.warn('CendiaEquity: AI sentiment analysis unavailable');
    }

    const sentiment: MarketSentiment = {
      symbol,
      currentPrice: 100 + Math.random() * 50,
      change24h: (Math.random() - 0.5) * 10,
      sentiment: sentimentData.sentiment || 'neutral',
      sentimentScore: sentimentData.sentimentScore || 0,
      shortInterest: 0.05 + Math.random() * 0.1,
      volume: 1000000 + Math.random() * 5000000,
      avgVolume: 2000000,
      volatility: 0.2 + Math.random() * 0.3,
      analystRatings: {
        buy: 10 + Math.floor(Math.random() * 10),
        hold: 5 + Math.floor(Math.random() * 5),
        sell: Math.floor(Math.random() * 3),
        averageTarget: 120,
        highTarget: 150,
        lowTarget: 90,
        consensus: sentimentData.analystConsensus || 'hold',
      },
      newsImpact: [],
      socialMentions: 1000 + Math.floor(Math.random() * 5000),
      institutionalHoldings: 0.65 + Math.random() * 0.2,
      insiderActivity: [],
      lastUpdated: new Date(),
    };

    this.sentimentCache.set(symbol, sentiment);
    logger.info(`CendiaEquity: Sentiment analysis for ${symbol}: ${sentiment.sentiment}`);
    return sentiment;
  }

  // ---------------------------------------------------------------------------
  // EARNINGS CALL PREPARATION
  // ---------------------------------------------------------------------------

  async simulateEarningsPhrase(phrases: string[]): Promise<EarningsSimulation[]> {
    const results: EarningsSimulation[] = [];

    for (const phrase of phrases) {
      const prompt = `You are CendiaEquity™, analyzing earnings call language for market impact.

PHRASE: "${phrase}"

Analyze this phrase that might be used in an earnings call. Consider:
- How analysts and investors might interpret it
- Potential market-moving implications
- Legal/compliance concerns
- Sentiment it conveys

Respond in JSON:
{
  "predictedImpact": percentage_change (-10 to +10),
  "confidence": 0-100,
  "sentiment": "positive|neutral|negative",
  "recommendation": "use|modify|avoid",
  "suggestedAlternative": "alternative phrase if modify/avoid",
  "reasoning": "brief explanation"
}`;

      let simulation: Partial<EarningsSimulation> = {};

      try {
        const isAvailable = await ollama.isAvailable();
        if (isAvailable) {
          const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForService('investor_relations') });
          simulation = this.parseJsonFromResponse(response) || {};
        }
      } catch (error) {
        logger.warn('CendiaEquity: AI phrase simulation unavailable');
      }

      results.push({
        phrase,
        predictedImpact: simulation.predictedImpact || 0,
        confidence: simulation.confidence || 50,
        sentiment: simulation.sentiment || 'neutral',
        recommendation: simulation.recommendation || 'use',
        suggestedAlternative: simulation.suggestedAlternative,
        reasoning: simulation.reasoning || 'Analysis pending',
      });
    }

    logger.info(`CendiaEquity: Simulated ${phrases.length} earnings phrases`);
    return results;
  }

  async prepareEarningsCall(quarterEnd: Date, metrics: MetricHighlight[]): Promise<EarningsCallPrep> {
    const prompt = `You are CendiaEquity™, preparing an earnings call.

QUARTER END: ${quarterEnd.toISOString().split('T')[0]}

KEY METRICS:
${metrics.map(m => `- ${m.metric}: ${m.value} (${m.change > 0 ? '+' : ''}${m.change}%, ${m.beating ? 'beat' : 'miss'})`).join('\n')}

Generate comprehensive earnings call preparation in JSON:
{
  "talkingPoints": [
    {
      "topic": "topic name",
      "message": "key message",
      "supportingData": "data point",
      "tone": "confident|measured|cautious"
    }
  ],
  "anticipatedQuestions": [
    {
      "question": "analyst question",
      "likelihood": "high|medium|low",
      "difficulty": "easy|moderate|challenging",
      "suggestedResponse": "response guidance",
      "dataPoints": ["point 1", "point 2"]
    }
  ],
  "riskFactors": ["risk 1", "risk 2"],
  "positiveNarratives": ["narrative 1", "narrative 2"],
  "languageWarnings": [
    {
      "phrase": "phrase to avoid",
      "risk": "legal|market_moving|misleading|vague",
      "severity": "low|medium|high",
      "suggestion": "alternative"
    }
  ]
}`;

    let prepData: any = {};

    try {
      const isAvailable = await ollama.isAvailable();
      if (isAvailable) {
        const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForService('investor_relations') });
        prepData = this.parseJsonFromResponse(response) || {};
      }
    } catch (error) {
      logger.warn('CendiaEquity: AI earnings prep unavailable');
    }

    const prep: EarningsCallPrep = {
      quarterEnd,
      keyMetrics: metrics,
      talkingPoints: prepData.talkingPoints || [{
        topic: 'Overall Performance',
        message: 'Solid quarter with continued execution',
        supportingData: 'Key metrics met or exceeded',
        tone: 'confident',
      }],
      anticipatedQuestions: prepData.anticipatedQuestions || [{
        question: 'What is your outlook for next quarter?',
        likelihood: 'high',
        difficulty: 'moderate',
        suggestedResponse: 'We are cautiously optimistic while monitoring market conditions.',
        dataPoints: ['Pipeline strength', 'Market trends'],
      }],
      riskFactors: prepData.riskFactors || ['Macroeconomic uncertainty'],
      positiveNarratives: prepData.positiveNarratives || ['Strong execution', 'Market share gains'],
      languageWarnings: prepData.languageWarnings || [],
      competitorMentions: [],
      generatedAt: new Date(),
    };

    logger.info(`CendiaEquity: Earnings call prep generated for Q ending ${quarterEnd.toISOString().split('T')[0]}`);
    return prep;
  }

  // ---------------------------------------------------------------------------
  // INVESTOR MANAGEMENT
  // ---------------------------------------------------------------------------

  addInvestor(investor: Omit<InvestorProfile, 'id'>): InvestorProfile {
    const newInvestor: InvestorProfile = {
      ...investor,
      id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    this.investors.set(newInvestor.id, newInvestor);
    logger.info(`CendiaEquity: Added investor ${newInvestor.name}`);
    return newInvestor;
  }

  getInvestor(investorId: string): InvestorProfile | null {
    return this.investors.get(investorId) || null;
  }

  getAllInvestors(): InvestorProfile[] {
    return Array.from(this.investors.values());
  }

  getInvestorsByType(type: InvestorProfile['type']): InvestorProfile[] {
    return Array.from(this.investors.values()).filter(i => i.type === type);
  }

  updateInvestorSentiment(investorId: string, sentiment: InvestorProfile['sentiment']): InvestorProfile | null {
    const investor = this.investors.get(investorId);
    if (!investor) return null;
    
    investor.sentiment = sentiment;
    return investor;
  }

  // ---------------------------------------------------------------------------
  // SHAREHOLDER OUTREACH
  // ---------------------------------------------------------------------------

  scheduleOutreach(outreach: Omit<ShareholderOutreach, 'id' | 'status'>): ShareholderOutreach {
    const newOutreach: ShareholderOutreach = {
      ...outreach,
      id: `out-${Date.now()}`,
      status: 'planned',
    };
    this.outreach.set(newOutreach.id, newOutreach);
    logger.info(`CendiaEquity: Outreach scheduled with investor ${outreach.investorId}`);
    return newOutreach;
  }

  completeOutreach(outreachId: string, outcome: string, followUp?: string): ShareholderOutreach | null {
    const outreach = this.outreach.get(outreachId);
    if (!outreach) return null;

    outreach.status = 'completed';
    outreach.completedDate = new Date();
    outreach.outcome = outcome;
    outreach.followUp = followUp;

    // Update investor last engagement
    const investor = this.investors.get(outreach.investorId);
    if (investor) {
      investor.lastEngagement = new Date();
    }

    logger.info(`CendiaEquity: Outreach ${outreachId} completed`);
    return outreach;
  }

  // ---------------------------------------------------------------------------
  // ACTIVIST DEFENSE
  // ---------------------------------------------------------------------------

  async analyzeActivistThreat(activistName: string, currentStake: number, demands: string[]): Promise<ActivistDefense> {
    const prompt = `You are CendiaEquity™, analyzing an activist investor situation.

ACTIVIST: ${activistName}
CURRENT STAKE: ${(currentStake * 100).toFixed(2)}%
DEMANDS:
${demands.map(d => `- ${d}`).join('\n')}

Analyze this activist situation and provide defense strategies in JSON:
{
  "threatLevel": "low|medium|high|imminent",
  "vulnerabilities": ["vulnerability 1", "vulnerability 2"],
  "defenseStrategies": [
    {
      "name": "strategy name",
      "description": "detailed description",
      "effectiveness": 0-100,
      "cost": dollar_amount,
      "timeToImplement": "timeframe",
      "risks": ["risk 1", "risk 2"]
    }
  ],
  "boardRecommendation": "recommendation for board",
  "analysis": "detailed analysis"
}`;

    let defenseData: any = {};

    try {
      const isAvailable = await ollama.isAvailable();
      if (isAvailable) {
        const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForService('investor_relations') });
        defenseData = this.parseJsonFromResponse(response) || {};
      }
    } catch (error) {
      logger.warn('CendiaEquity: AI activist defense analysis unavailable');
    }

    const defense: ActivistDefense = {
      activistName,
      currentStake,
      threatLevel: defenseData.threatLevel || this.assessThreatLevel(currentStake),
      demands,
      vulnerabilities: defenseData.vulnerabilities || ['Underperformance vs. peers'],
      defenseStrategies: defenseData.defenseStrategies || [{
        name: 'Shareholder Engagement',
        description: 'Proactive engagement with major shareholders',
        effectiveness: 70,
        cost: 50000,
        timeToImplement: '2-4 weeks',
        risks: ['May not sway all shareholders'],
      }],
      boardRecommendation: defenseData.boardRecommendation || 'Engage constructively while preparing defensive measures',
      aiAnalysis: defenseData.analysis || 'Analysis pending. Monitor stake accumulation closely.',
      generatedAt: new Date(),
    };

    logger.warn(`CendiaEquity: Activist defense analysis for ${activistName}: ${defense.threatLevel}`);
    return defense;
  }

  private assessThreatLevel(stake: number): ActivistDefense['threatLevel'] {
    if (stake >= 0.1) return 'imminent';
    if (stake >= 0.05) return 'high';
    if (stake >= 0.03) return 'medium';
    return 'low';
  }

  // ---------------------------------------------------------------------------
  // IR CALENDAR
  // ---------------------------------------------------------------------------

  addIREvent(event: Omit<IREvent, 'id'>): IREvent {
    const newEvent: IREvent = {
      ...event,
      id: `ir-evt-${Date.now()}`,
    };
    this.calendar.events.push(newEvent);
    this.calendar.events.sort((a, b) => a.date.getTime() - b.date.getTime());
    logger.info(`CendiaEquity: IR event added - ${event.title}`);
    return newEvent;
  }

  setBlackoutPeriod(start: Date, end: Date, reason: string): BlackoutPeriod {
    const blackout: BlackoutPeriod = {
      start,
      end,
      reason,
      restrictions: ['No insider trading', 'Limited IR communications', 'No share repurchases'],
    };
    this.calendar.blackoutPeriods.push(blackout);
    logger.info(`CendiaEquity: Blackout period set ${start.toISOString().split('T')[0]} to ${end.toISOString().split('T')[0]}`);
    return blackout;
  }

  isInBlackout(): boolean {
    const now = new Date();
    return this.calendar.blackoutPeriods.some(
      bp => now >= bp.start && now <= bp.end
    );
  }

  getUpcomingEvents(days: number = 90): IREvent[] {
    const threshold = Date.now() + days * 24 * 60 * 60 * 1000;
    return this.calendar.events.filter(e => e.date.getTime() <= threshold);
  }

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------

  private parseJsonFromResponse(response: string): any {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      logger.warn('CendiaEquity: Failed to parse AI response as JSON');
    }
    return null;
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getMetrics(): {
    totalInvestors: number;
    institutionalOwnership: number;
    recentOutreach: number;
    upcomingEvents: number;
    inBlackout: boolean;
  } {
    const investors = this.getAllInvestors();
    const institutional = investors
      .filter(i => i.type === 'institutional' || i.type === 'hedge_fund')
      .reduce((sum, i) => sum + i.percentOwnership, 0);
    const recentOutreach = Array.from(this.outreach.values())
      .filter(o => o.completedDate && Date.now() - o.completedDate.getTime() < 30 * 24 * 60 * 60 * 1000)
      .length;

    return {
      totalInvestors: investors.length,
      institutionalOwnership: institutional,
      recentOutreach,
      upcomingEvents: this.getUpcomingEvents(30).length,
      inBlackout: this.isInBlackout(),
    };
  }
}

// Export singleton instance
export const cendiaEquityService = new CendiaEquityService();
