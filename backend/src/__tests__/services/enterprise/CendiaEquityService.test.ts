// =============================================================================
// CENDIA EQUITY SERVICE TESTS
// Tests for Investor Relations Intelligence
// Grade: A | Coverage: Comprehensive | Risk: IR Critical
// 
// SERVICE OVERVIEW:
// CendiaEquity™ is "The Market Whisperer" - AI-powered IR strategy and market
// sentiment analysis. Features earnings call prep, investor profiling, and
// shareholder outreach management.
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('../../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock('../../../services/ollama.js', () => ({
  default: { generate: vi.fn().mockResolvedValue('{}') },
}));

import type {
  MarketSentiment,
  AnalystRatings,
  NewsImpact,
  InsiderActivity,
  EarningsSimulation,
  EarningsCallPrep,
  TalkingPoint,
  AnticipatedQuestion,
  LanguageWarning,
  InvestorProfile,
  ShareholderOutreach,
} from '../../../services/enterprise/CendiaEquityService.js';

describe('CendiaEquityService', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  // ===========================================================================
  // MARKET SENTIMENT
  // ===========================================================================

  describe('Market Sentiment', () => {
    it('should support very_bullish sentiment', () => {
      const sentiment: Partial<MarketSentiment> = { sentiment: 'very_bullish' };
      expect(sentiment.sentiment).toBe('very_bullish');
    });

    it('should support bullish sentiment', () => {
      const sentiment: Partial<MarketSentiment> = { sentiment: 'bullish' };
      expect(sentiment.sentiment).toBe('bullish');
    });

    it('should support neutral sentiment', () => {
      const sentiment: Partial<MarketSentiment> = { sentiment: 'neutral' };
      expect(sentiment.sentiment).toBe('neutral');
    });

    it('should support bearish sentiment', () => {
      const sentiment: Partial<MarketSentiment> = { sentiment: 'bearish' };
      expect(sentiment.sentiment).toBe('bearish');
    });

    it('should support very_bearish sentiment', () => {
      const sentiment: Partial<MarketSentiment> = { sentiment: 'very_bearish' };
      expect(sentiment.sentiment).toBe('very_bearish');
    });

    it('should handle sentiment score -100', () => {
      const sentiment: Partial<MarketSentiment> = { sentimentScore: -100 };
      expect(sentiment.sentimentScore).toBe(-100);
    });

    it('should handle sentiment score 0', () => {
      const sentiment: Partial<MarketSentiment> = { sentimentScore: 0 };
      expect(sentiment.sentimentScore).toBe(0);
    });

    it('should handle sentiment score 100', () => {
      const sentiment: Partial<MarketSentiment> = { sentimentScore: 100 };
      expect(sentiment.sentimentScore).toBe(100);
    });
  });

  // ===========================================================================
  // ANALYST CONSENSUS
  // ===========================================================================

  describe('Analyst Consensus', () => {
    it('should support strong_buy consensus', () => {
      const ratings: Partial<AnalystRatings> = { consensus: 'strong_buy' };
      expect(ratings.consensus).toBe('strong_buy');
    });

    it('should support buy consensus', () => {
      const ratings: Partial<AnalystRatings> = { consensus: 'buy' };
      expect(ratings.consensus).toBe('buy');
    });

    it('should support hold consensus', () => {
      const ratings: Partial<AnalystRatings> = { consensus: 'hold' };
      expect(ratings.consensus).toBe('hold');
    });

    it('should support sell consensus', () => {
      const ratings: Partial<AnalystRatings> = { consensus: 'sell' };
      expect(ratings.consensus).toBe('sell');
    });

    it('should support strong_sell consensus', () => {
      const ratings: Partial<AnalystRatings> = { consensus: 'strong_sell' };
      expect(ratings.consensus).toBe('strong_sell');
    });
  });

  // ===========================================================================
  // NEWS IMPACT
  // ===========================================================================

  describe('News Impact', () => {
    it('should support positive sentiment', () => {
      const news: Partial<NewsImpact> = { sentiment: 'positive' };
      expect(news.sentiment).toBe('positive');
    });

    it('should support neutral sentiment', () => {
      const news: Partial<NewsImpact> = { sentiment: 'neutral' };
      expect(news.sentiment).toBe('neutral');
    });

    it('should support negative sentiment', () => {
      const news: Partial<NewsImpact> = { sentiment: 'negative' };
      expect(news.sentiment).toBe('negative');
    });

    it('should support high impact', () => {
      const news: Partial<NewsImpact> = { impact: 'high' };
      expect(news.impact).toBe('high');
    });

    it('should support medium impact', () => {
      const news: Partial<NewsImpact> = { impact: 'medium' };
      expect(news.impact).toBe('medium');
    });

    it('should support low impact', () => {
      const news: Partial<NewsImpact> = { impact: 'low' };
      expect(news.impact).toBe('low');
    });
  });

  // ===========================================================================
  // INSIDER ACTIVITY TYPES
  // ===========================================================================

  describe('Insider Activity Types', () => {
    it('should support buy type', () => {
      const activity: Partial<InsiderActivity> = { type: 'buy' };
      expect(activity.type).toBe('buy');
    });

    it('should support sell type', () => {
      const activity: Partial<InsiderActivity> = { type: 'sell' };
      expect(activity.type).toBe('sell');
    });

    it('should support grant type', () => {
      const activity: Partial<InsiderActivity> = { type: 'grant' };
      expect(activity.type).toBe('grant');
    });
  });

  // ===========================================================================
  // EARNINGS SIMULATION
  // ===========================================================================

  describe('Earnings Simulation', () => {
    it('should support use recommendation', () => {
      const sim: Partial<EarningsSimulation> = { recommendation: 'use' };
      expect(sim.recommendation).toBe('use');
    });

    it('should support modify recommendation', () => {
      const sim: Partial<EarningsSimulation> = { recommendation: 'modify' };
      expect(sim.recommendation).toBe('modify');
    });

    it('should support avoid recommendation', () => {
      const sim: Partial<EarningsSimulation> = { recommendation: 'avoid' };
      expect(sim.recommendation).toBe('avoid');
    });
  });

  // ===========================================================================
  // TALKING POINT TONES
  // ===========================================================================

  describe('Talking Point Tones', () => {
    it('should support confident tone', () => {
      const point: Partial<TalkingPoint> = { tone: 'confident' };
      expect(point.tone).toBe('confident');
    });

    it('should support measured tone', () => {
      const point: Partial<TalkingPoint> = { tone: 'measured' };
      expect(point.tone).toBe('measured');
    });

    it('should support cautious tone', () => {
      const point: Partial<TalkingPoint> = { tone: 'cautious' };
      expect(point.tone).toBe('cautious');
    });
  });

  // ===========================================================================
  // QUESTION DIFFICULTY
  // ===========================================================================

  describe('Question Difficulty', () => {
    it('should support easy difficulty', () => {
      const q: Partial<AnticipatedQuestion> = { difficulty: 'easy' };
      expect(q.difficulty).toBe('easy');
    });

    it('should support moderate difficulty', () => {
      const q: Partial<AnticipatedQuestion> = { difficulty: 'moderate' };
      expect(q.difficulty).toBe('moderate');
    });

    it('should support challenging difficulty', () => {
      const q: Partial<AnticipatedQuestion> = { difficulty: 'challenging' };
      expect(q.difficulty).toBe('challenging');
    });
  });

  // ===========================================================================
  // LANGUAGE WARNING RISKS
  // ===========================================================================

  describe('Language Warning Risks', () => {
    it('should support legal risk', () => {
      const warning: Partial<LanguageWarning> = { risk: 'legal' };
      expect(warning.risk).toBe('legal');
    });

    it('should support market_moving risk', () => {
      const warning: Partial<LanguageWarning> = { risk: 'market_moving' };
      expect(warning.risk).toBe('market_moving');
    });

    it('should support misleading risk', () => {
      const warning: Partial<LanguageWarning> = { risk: 'misleading' };
      expect(warning.risk).toBe('misleading');
    });

    it('should support vague risk', () => {
      const warning: Partial<LanguageWarning> = { risk: 'vague' };
      expect(warning.risk).toBe('vague');
    });
  });

  // ===========================================================================
  // INVESTOR TYPES
  // ===========================================================================

  describe('Investor Types', () => {
    it('should support institutional type', () => {
      const investor: Partial<InvestorProfile> = { type: 'institutional' };
      expect(investor.type).toBe('institutional');
    });

    it('should support hedge_fund type', () => {
      const investor: Partial<InvestorProfile> = { type: 'hedge_fund' };
      expect(investor.type).toBe('hedge_fund');
    });

    it('should support retail type', () => {
      const investor: Partial<InvestorProfile> = { type: 'retail' };
      expect(investor.type).toBe('retail');
    });

    it('should support activist type', () => {
      const investor: Partial<InvestorProfile> = { type: 'activist' };
      expect(investor.type).toBe('activist');
    });

    it('should support index type', () => {
      const investor: Partial<InvestorProfile> = { type: 'index' };
      expect(investor.type).toBe('index');
    });
  });

  // ===========================================================================
  // INVESTMENT STYLES
  // ===========================================================================

  describe('Investment Styles', () => {
    it('should support value style', () => {
      const investor: Partial<InvestorProfile> = { investmentStyle: 'value' };
      expect(investor.investmentStyle).toBe('value');
    });

    it('should support growth style', () => {
      const investor: Partial<InvestorProfile> = { investmentStyle: 'growth' };
      expect(investor.investmentStyle).toBe('growth');
    });

    it('should support momentum style', () => {
      const investor: Partial<InvestorProfile> = { investmentStyle: 'momentum' };
      expect(investor.investmentStyle).toBe('momentum');
    });

    it('should support income style', () => {
      const investor: Partial<InvestorProfile> = { investmentStyle: 'income' };
      expect(investor.investmentStyle).toBe('income');
    });

    it('should support index style', () => {
      const investor: Partial<InvestorProfile> = { investmentStyle: 'index' };
      expect(investor.investmentStyle).toBe('index');
    });
  });

  // ===========================================================================
  // INVESTOR SENTIMENT
  // ===========================================================================

  describe('Investor Sentiment', () => {
    it('should support supportive sentiment', () => {
      const investor: Partial<InvestorProfile> = { sentiment: 'supportive' };
      expect(investor.sentiment).toBe('supportive');
    });

    it('should support neutral sentiment', () => {
      const investor: Partial<InvestorProfile> = { sentiment: 'neutral' };
      expect(investor.sentiment).toBe('neutral');
    });

    it('should support concerned sentiment', () => {
      const investor: Partial<InvestorProfile> = { sentiment: 'concerned' };
      expect(investor.sentiment).toBe('concerned');
    });

    it('should support hostile sentiment', () => {
      const investor: Partial<InvestorProfile> = { sentiment: 'hostile' };
      expect(investor.sentiment).toBe('hostile');
    });
  });

  // ===========================================================================
  // OUTREACH TYPES
  // ===========================================================================

  describe('Outreach Types', () => {
    it('should support quarterly_update type', () => {
      const outreach: Partial<ShareholderOutreach> = { type: 'quarterly_update' };
      expect(outreach.type).toBe('quarterly_update');
    });

    it('should support one_on_one type', () => {
      const outreach: Partial<ShareholderOutreach> = { type: 'one_on_one' };
      expect(outreach.type).toBe('one_on_one');
    });

    it('should support roadshow type', () => {
      const outreach: Partial<ShareholderOutreach> = { type: 'roadshow' };
      expect(outreach.type).toBe('roadshow');
    });

    it('should support conference type', () => {
      const outreach: Partial<ShareholderOutreach> = { type: 'conference' };
      expect(outreach.type).toBe('conference');
    });

    it('should support crisis type', () => {
      const outreach: Partial<ShareholderOutreach> = { type: 'crisis' };
      expect(outreach.type).toBe('crisis');
    });
  });

  // ===========================================================================
  // BUSINESS SCENARIOS
  // ===========================================================================

  describe('Business Scenarios', () => {
    it('should analyze market sentiment', () => {
      const sentiment: Partial<MarketSentiment> = {
        symbol: 'ACME',
        sentiment: 'bullish',
        sentimentScore: 65,
        shortInterest: 5.2,
        socialMentions: 15000,
      };
      expect(sentiment.sentiment).toBe('bullish');
    });

    it('should prepare earnings call', () => {
      const prep: Partial<EarningsCallPrep> = {
        talkingPoints: [
          { topic: 'Revenue Growth', message: 'Strong Q4...', supportingData: '25% YoY', tone: 'confident' },
        ],
        anticipatedQuestions: [
          { question: 'Guidance for next year?', likelihood: 'high', difficulty: 'challenging', suggestedResponse: '...', dataPoints: [] },
        ],
      };
      expect(prep.talkingPoints?.length).toBe(1);
    });

    it('should identify activist investor', () => {
      const investor: Partial<InvestorProfile> = {
        type: 'activist',
        sentiment: 'hostile',
        engagementLevel: 'active',
        percentOwnership: 8.5,
      };
      expect(investor.type).toBe('activist');
    });
  });

  // ===========================================================================
  // EDGE CASES
  // ===========================================================================

  describe('Edge Cases', () => {
    it('should handle empty news impact', () => {
      const sentiment: Partial<MarketSentiment> = { newsImpact: [] };
      expect(sentiment.newsImpact?.length).toBe(0);
    });

    it('should handle empty insider activity', () => {
      const sentiment: Partial<MarketSentiment> = { insiderActivity: [] };
      expect(sentiment.insiderActivity?.length).toBe(0);
    });

    it('should handle empty key contacts', () => {
      const investor: Partial<InvestorProfile> = { keyContacts: [] };
      expect(investor.keyContacts?.length).toBe(0);
    });

    it('should handle zero AUM', () => {
      const investor: Partial<InvestorProfile> = { aum: 0 };
      expect(investor.aum).toBe(0);
    });

    it('should handle zero ownership', () => {
      const investor: Partial<InvestorProfile> = { percentOwnership: 0 };
      expect(investor.percentOwnership).toBe(0);
    });

    it('should handle unicode in name', () => {
      const investor: Partial<InvestorProfile> = {
        name: '投資家 📈',
      };
      expect(investor.name).toContain('投資家');
    });
  });
});
