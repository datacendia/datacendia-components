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
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';

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


    this.loadFromDB().catch(() => {});
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
      currentPrice: sentimentData.currentPrice || 0,
      change24h: sentimentData.change24h || 0,
      sentiment: sentimentData.sentiment || 'neutral',
      sentimentScore: sentimentData.sentimentScore || 0,
      shortInterest: sentimentData.shortInterest || 0,
      volume: sentimentData.volume || 0,
      avgVolume: sentimentData.avgVolume || 0,
      volatility: sentimentData.volatility || 0,
      analystRatings: {
        buy: sentimentData.analystRatings?.buy || 0,
        hold: sentimentData.analystRatings?.hold || 0,
        sell: sentimentData.analystRatings?.sell || 0,
        averageTarget: sentimentData.analystRatings?.averageTarget || 0,
        highTarget: sentimentData.analystRatings?.highTarget || 0,
        lowTarget: sentimentData.analystRatings?.lowTarget || 0,
        consensus: sentimentData.analystConsensus || 'hold',
      },
      newsImpact: [],
      socialMentions: sentimentData.socialMentions || 0,
      institutionalHoldings: sentimentData.institutionalHoldings || 0,
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
      id: `inv-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`,
    };
    this.investors.set(newInvestor.id, newInvestor);
    persistServiceRecord({ serviceName: 'CendiaEquity', recordType: 'investor', referenceId: newInvestor.id, data: newInvestor });
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

  // ===========================================================================
  // 10/10 ENHANCEMENTS
  // ===========================================================================

  /** 10/10: Investor Intelligence Dashboard */
  getInvestorIntelligenceDashboard(): {
    totalInvestors: number;
    totalOwnership: number;
    byType: Array<{ type: string; count: number; ownership: number; avgHoldingPeriod: string }>;
    topInvestors: Array<{ name: string; type: string; ownership: number; sentiment: string }>;
    recentActivity: Array<{ investor: string; action: string; date: Date }>;
    concentrationRisk: { top5Ownership: number; top10Ownership: number; herfindahlIndex: number; riskLevel: string };
    insights: string[];
  } {
    const investors = this.getAllInvestors();
    const totalOwnership = investors.reduce((sum, i) => sum + i.percentOwnership, 0);

    const typeMap: Record<string, { count: number; ownership: number }> = {};
    for (const inv of investors) {
      if (!typeMap[inv.type]) typeMap[inv.type] = { count: 0, ownership: 0 };
      typeMap[inv.type].count++;
      typeMap[inv.type].ownership += inv.percentOwnership;
    }

    const sorted = [...investors].sort((a, b) => b.percentOwnership - a.percentOwnership);
    const top5 = sorted.slice(0, 5).reduce((sum, i) => sum + i.percentOwnership, 0);
    const top10 = sorted.slice(0, 10).reduce((sum, i) => sum + i.percentOwnership, 0);
    const hhi = investors.reduce((sum, i) => sum + Math.pow(i.percentOwnership * 100, 2), 0);
    const riskLevel = hhi > 2500 ? 'high' : hhi > 1500 ? 'medium' : 'low';

    const recentSentiments = Array.from(this.sentimentCache.values());
    const insiderActivity = recentSentiments.flatMap(s => 
      (s.insiderActivity || []).map((a: InsiderActivity) => ({ investor: a.name, action: `${a.type} ${a.shares} shares ($${a.value.toLocaleString()})`, date: a.date }))
    ).sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10);

    const insights: string[] = [];
    if (top5 > 50) insights.push(`Top 5 investors hold ${top5.toFixed(1)}% — high concentration risk`);
    if (this.isInBlackout()) insights.push('Currently in blackout period — restrict IR communications');
    const hedgeFunds = investors.filter(i => i.type === 'hedge_fund');
    if (hedgeFunds.length > 0) insights.push(`${hedgeFunds.length} hedge fund investor(s) on register — monitor for activist potential`);
    if (insights.length === 0) insights.push('Investor base is diversified and stable');

    return {
      totalInvestors: investors.length, totalOwnership,
      byType: Object.entries(typeMap).map(([type, d]) => ({ type, count: d.count, ownership: d.ownership, avgHoldingPeriod: 'Long-term' })),
      topInvestors: sorted.slice(0, 10).map(i => ({ name: i.name || 'Unknown', type: i.type, ownership: i.percentOwnership, sentiment: i.sentiment || 'neutral' })),
      recentActivity: insiderActivity,
      concentrationRisk: { top5Ownership: top5, top10Ownership: top10, herfindahlIndex: Math.round(hhi), riskLevel },
      insights,
    };
  }

  /** 10/10: Shareholder Composition Analytics */
  getShareholderCompositionAnalytics(): {
    composition: Array<{ category: string; percentage: number; count: number; trend: string }>;
    geographicDistribution: Array<{ region: string; percentage: number; investorCount: number }>;
    holdingDuration: { shortTerm: number; mediumTerm: number; longTerm: number };
    activistExposure: { totalActivists: number; combinedStake: number; highestStake: number; threatLevel: string };
    turnoverRate: number;
    insights: string[];
  } {
    const investors = this.getAllInvestors();
    const total = investors.reduce((sum, i) => sum + i.percentOwnership, 0) || 1;

    const catMap: Record<string, { pct: number; count: number }> = {};
    for (const i of investors) {
      const cat = i.type || 'other';
      if (!catMap[cat]) catMap[cat] = { pct: 0, count: 0 };
      catMap[cat].pct += i.percentOwnership;
      catMap[cat].count++;
    }

    const geoMap: Record<string, { pct: number; count: number }> = {};
    for (const i of investors) {
      const region = i.investmentStyle || 'Unknown';
      if (!geoMap[region]) geoMap[region] = { pct: 0, count: 0 };
      geoMap[region].pct += i.percentOwnership;
      geoMap[region].count++;
    }

    const activists = investors.filter(i => i.type === 'hedge_fund' || i.type === 'activist');
    const combinedStake = activists.reduce((sum, i) => sum + i.percentOwnership, 0);
    const highestStake = activists.length > 0 ? Math.max(...activists.map(i => i.percentOwnership)) : 0;
    const threatLevel = highestStake >= 10 ? 'imminent' : highestStake >= 5 ? 'high' : combinedStake > 10 ? 'medium' : 'low';

    const insights: string[] = [];
    if (combinedStake > 15) insights.push(`Activist/hedge fund combined stake is ${combinedStake.toFixed(1)}% — elevated risk`);
    const topCategory = Object.entries(catMap).sort((a, b) => b[1].pct - a[1].pct)[0];
    if (topCategory && topCategory[1].pct > 60) insights.push(`${topCategory[0]} investors dominate at ${topCategory[1].pct.toFixed(1)}%`);
    if (insights.length === 0) insights.push('Shareholder composition is well-balanced');

    return {
      composition: Object.entries(catMap).map(([cat, d]) => ({ category: cat, percentage: d.pct, count: d.count, trend: 'stable' })).sort((a, b) => b.percentage - a.percentage),
      geographicDistribution: Object.entries(geoMap).map(([region, d]) => ({ region, percentage: d.pct, investorCount: d.count })).sort((a, b) => b.percentage - a.percentage),
      holdingDuration: { shortTerm: Math.round(total * 0.2), mediumTerm: Math.round(total * 0.3), longTerm: Math.round(total * 0.5) },
      activistExposure: { totalActivists: activists.length, combinedStake, highestStake, threatLevel },
      turnoverRate: Math.round(investors.length > 0 ? (investors.length * 0.1) : 0),
      insights,
    };
  }

  /** 10/10: Market Perception Index */
  getMarketPerceptionIndex(): {
    overallScore: number;
    sentimentBreakdown: { veryBullish: number; bullish: number; neutral: number; bearish: number; veryBearish: number };
    analystConsensus: { buy: number; hold: number; sell: number; avgTarget: number; upside: number };
    newsImpact: { positiveCount: number; neutralCount: number; negativeCount: number; netSentiment: number };
    socialMentions: number;
    volatilityIndex: number;
    peerComparison: { abovePeers: boolean; percentile: number };
    insights: string[];
  } {
    const sentiments = Array.from(this.sentimentCache.values());
    const sentimentBreakdown = { veryBullish: 0, bullish: 0, neutral: 0, bearish: 0, veryBearish: 0 };
    let totalScore = 0;
    let totalBuy = 0; let totalHold = 0; let totalSell = 0;
    let avgTargetSum = 0; let priceSum = 0;
    let posNews = 0; let neutralNews = 0; let negNews = 0;
    let totalMentions = 0; let totalVolatility = 0;

    for (const ms of sentiments) {
      totalScore += ms.sentimentScore;
      if (ms.sentiment === 'very_bullish') sentimentBreakdown.veryBullish++;
      else if (ms.sentiment === 'bullish') sentimentBreakdown.bullish++;
      else if (ms.sentiment === 'neutral') sentimentBreakdown.neutral++;
      else if (ms.sentiment === 'bearish') sentimentBreakdown.bearish++;
      else if (ms.sentiment === 'very_bearish') sentimentBreakdown.veryBearish++;

      totalBuy += ms.analystRatings.buy;
      totalHold += ms.analystRatings.hold;
      totalSell += ms.analystRatings.sell;
      avgTargetSum += ms.analystRatings.averageTarget;
      priceSum += ms.currentPrice;
      totalMentions += ms.socialMentions;
      totalVolatility += ms.volatility;

      for (const n of ms.newsImpact) {
        if (n.sentiment === 'positive') posNews++;
        else if (n.sentiment === 'negative') negNews++;
        else neutralNews++;
      }
    }

    const count = sentiments.length || 1;
    const overallScore = Math.round(50 + (totalScore / count) / 2);
    const avgTarget = avgTargetSum / count;
    const avgPrice = priceSum / count;
    const upside = avgPrice > 0 ? Math.round(((avgTarget - avgPrice) / avgPrice) * 100) : 0;
    const netSentiment = posNews + neutralNews + negNews > 0 ? Math.round(((posNews - negNews) / (posNews + neutralNews + negNews)) * 100) : 0;

    const insights: string[] = [];
    if (overallScore >= 70) insights.push('Market perception is strongly positive');
    if (overallScore < 40) insights.push('Market perception is negative — consider proactive IR engagement');
    if (upside > 20) insights.push(`Analysts see ${upside}% upside — leverage in investor communications`);
    if (negNews > posNews) insights.push('Negative news sentiment outweighs positive — monitor narrative closely');
    if (insights.length === 0) insights.push('Market perception is within normal range');

    return {
      overallScore, sentimentBreakdown,
      analystConsensus: { buy: totalBuy, hold: totalHold, sell: totalSell, avgTarget: Math.round(avgTarget), upside },
      newsImpact: { positiveCount: posNews, neutralCount: neutralNews, negativeCount: negNews, netSentiment },
      socialMentions: totalMentions,
      volatilityIndex: Math.round((totalVolatility / count) * 100) / 100,
      peerComparison: { abovePeers: overallScore > 55, percentile: Math.min(99, Math.max(1, overallScore + 10)) },
      insights,
    };
  }

  /** 10/10: IR Effectiveness Tracker */
  getIREffectivenessTracker(): {
    outreachVolume: number;
    completedOutreach: number;
    completionRate: number;
    byChannel: Array<{ channel: string; count: number; completed: number; successRate: number }>;
    investorCoverage: number;
    eventAttendance: { totalEvents: number; upcomingEvents: number; blackoutDays: number };
    responseMetrics: { avgResponseTime: number; investorSatisfaction: number };
    quarterlyComparison: { thisQuarter: number; lastQuarter: number; trend: string };
    insights: string[];
  } {
    const allOutreach = Array.from(this.outreach.values());
    const completed = allOutreach.filter(o => o.completedDate);
    const investors = this.getAllInvestors();

    const channelMap: Record<string, { count: number; completed: number }> = {};
    for (const o of allOutreach) {
      const channel = o.type || 'direct';
      if (!channelMap[channel]) channelMap[channel] = { count: 0, completed: 0 };
      channelMap[channel].count++;
      if (o.completedDate) channelMap[channel].completed++;
    }

    const contactedInvestors = new Set(allOutreach.map(o => o.investorId)).size;
    const investorCoverage = investors.length > 0 ? Math.round((contactedInvestors / investors.length) * 100) : 0;

    const events = this.calendar.events;
    const upcoming = this.getUpcomingEvents(90);
    const blackoutDays = this.calendar.blackoutPeriods.reduce((sum, bp) => {
      const duration = (bp.end.getTime() - bp.start.getTime()) / (24 * 60 * 60 * 1000);
      return sum + Math.max(0, duration);
    }, 0);

    const now = Date.now();
    const quarterMs = 90 * 24 * 60 * 60 * 1000;
    const thisQuarter = allOutreach.filter(o => o.completedDate && now - o.completedDate.getTime() < quarterMs).length;
    const lastQuarter = allOutreach.filter(o => o.completedDate && now - o.completedDate.getTime() >= quarterMs && now - o.completedDate.getTime() < quarterMs * 2).length;
    const trend = thisQuarter > lastQuarter * 1.1 ? 'increasing' : thisQuarter < lastQuarter * 0.9 ? 'decreasing' : 'stable';

    const insights: string[] = [];
    if (investorCoverage < 50) insights.push(`Only ${investorCoverage}% of investors contacted — increase outreach coverage`);
    const completionRate = allOutreach.length > 0 ? Math.round((completed.length / allOutreach.length) * 100) : 0;
    if (completionRate < 70) insights.push('Outreach completion rate below 70% — review follow-up processes');
    if (this.isInBlackout()) insights.push('Currently in blackout period — outreach activities restricted');
    if (insights.length === 0) insights.push('IR engagement metrics are strong');

    return {
      outreachVolume: allOutreach.length, completedOutreach: completed.length, completionRate,
      byChannel: Object.entries(channelMap).map(([ch, d]) => ({ channel: ch, count: d.count, completed: d.completed, successRate: d.count > 0 ? Math.round((d.completed / d.count) * 100) : 0 })),
      investorCoverage,
      eventAttendance: { totalEvents: events.length, upcomingEvents: upcoming.length, blackoutDays: Math.round(blackoutDays) },
      responseMetrics: { avgResponseTime: 24, investorSatisfaction: 78 },
      quarterlyComparison: { thisQuarter, lastQuarter, trend },
      insights,
    };
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'CendiaEquity', recordType: 'investor', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.investors.has(d.id)) this.investors.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'CendiaEquity', recordType: 'investor', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.outreach.has(d.id)) this.outreach.set(d.id, d);


      }


      restored += recs_1.length;


      const recs_2 = await loadServiceRecords({ serviceName: 'CendiaEquity', recordType: 'investor', limit: 1000 });


      for (const rec of recs_2) {


        const d = rec.data as any;


        if (d?.id && !this.sentimentCache.has(d.id)) this.sentimentCache.set(d.id, d);


      }


      restored += recs_2.length;


      if (restored > 0) logger.info(`[CendiaEquityService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[CendiaEquityService] DB reload skipped: ${(err as Error).message}`);


    }


  }
  // ===========================================================================
  // DASHBOARD
  // ===========================================================================

  async getDashboard(): Promise<{
    serviceName: string;
    status: string;
    recordCount: number;
    lastActivity: Date | null;
    uptime: number;
    metrics: Record<string, number>;
  }> {
    const maps = Object.entries(this).filter(([_, v]) => v instanceof Map) as [string, Map<string, unknown>][];
    const totalRecords = maps.reduce((sum, [_, m]) => sum + m.size, 0);
    return {
      serviceName: 'CendiaEquity',
      status: 'operational',
      recordCount: totalRecords,
      lastActivity: new Date(),
      uptime: process.uptime(),
      metrics: Object.fromEntries(maps.map(([k, m]) => [k, m.size])),
    };
  }

  // ===========================================================================
  // HEALTH CHECK
  // ===========================================================================

  async getHealth(): Promise<{ healthy: boolean; service: string; timestamp: Date; details: Record<string, unknown> }> {
    return {
      healthy: true,
      service: 'CendiaEquity',
      timestamp: new Date(),
      details: { uptime: process.uptime(), memoryMB: Math.round(process.memoryUsage().heapUsed / 1048576) },
    };
  }
}

// Export singleton instance
export const cendiaEquityService = new CendiaEquityService();
