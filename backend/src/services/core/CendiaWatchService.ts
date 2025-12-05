// =============================================================================
// CENDIAWATCH™ - THE SENTRY
// Competitor & Market Surveillance
// Real-time monitoring of competitors, market trends, and threats
// =============================================================================

import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';
import { aiModelSelector } from '../../config/aiModels.js';

// =============================================================================
// TYPES
// =============================================================================

export interface Competitor {
  id: string;
  name: string;
  website: string;
  category: 'direct' | 'adjacent' | 'potential';
  products: string[];
  pricing?: { tier: string; price: number }[];
  strengths: string[];
  weaknesses: string[];
  lastUpdated: Date;
}

export interface MarketSignal {
  id: string;
  type: 'news' | 'social' | 'patent' | 'job_posting' | 'funding' | 'product_launch' | 'regulation';
  source: string;
  title: string;
  content: string;
  url?: string;
  relevance: number; // 0-100
  sentiment: 'positive' | 'neutral' | 'negative' | 'threat' | 'opportunity';
  competitors: string[]; // Related competitor IDs
  keywords: string[];
  detectedAt: Date;
  processed: boolean;
}

export interface ThreatAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'competitive_launch' | 'market_shift' | 'regulatory' | 'funding_threat' | 'talent_drain';
  title: string;
  description: string;
  source: MarketSignal[];
  suggestedResponse: string;
  deadline?: Date;
  createdAt: Date;
  acknowledgedAt?: Date;
}

export interface IntelligenceReport {
  period: 'daily' | 'weekly' | 'monthly';
  generatedAt: Date;
  summary: string;
  topSignals: MarketSignal[];
  competitorUpdates: { competitor: string; update: string }[];
  threats: ThreatAlert[];
  opportunities: { description: string; urgency: string }[];
  recommendations: string[];
}

export interface WatchConfig {
  keywords: string[];
  competitors: string[];
  sources: string[];
  alertThreshold: number; // 0-100 relevance to trigger alert
}

// =============================================================================
// DEFAULT WATCH CONFIGURATION
// =============================================================================

const DEFAULT_CONFIG: WatchConfig = {
  keywords: [
    'Sovereign AI', 'AI Council', 'Enterprise AI', 'Decision Intelligence',
    'AI Governance', 'Corporate AI', 'Executive AI', 'AI C-Suite',
    'Palantir', 'AI Ethics', 'Autonomous Business', 'AI Strategy',
  ],
  competitors: [
    'Palantir', 'C3.ai', 'DataRobot', 'H2O.ai', 'Databricks',
    'Microsoft Copilot', 'Google Duet', 'Salesforce Einstein',
    'IBM Watson', 'Anthropic', 'OpenAI Enterprise',
  ],
  sources: [
    'techcrunch.com', 'reuters.com', 'bloomberg.com', 'wsj.com',
    'linkedin.com', 'twitter.com', 'patents.google.com', 'sec.gov',
  ],
  alertThreshold: 70,
};

// =============================================================================
// CENDIAWATCH SERVICE
// =============================================================================

class CendiaWatchService {
  private config: WatchConfig = DEFAULT_CONFIG;
  private competitors: Map<string, Competitor> = new Map();
  private signals: MarketSignal[] = [];
  private alerts: ThreatAlert[] = [];

  constructor() {
    // Initialize known competitors
    this.initializeCompetitors();
  }

  private initializeCompetitors(): void {
    const knownCompetitors: Competitor[] = [
      {
        id: 'palantir',
        name: 'Palantir Technologies',
        website: 'palantir.com',
        category: 'direct',
        products: ['Foundry', 'Gotham', 'Apollo', 'AIP'],
        pricing: [{ tier: 'Enterprise', price: 1000000 }],
        strengths: ['Government contracts', 'Data integration', 'Brand recognition'],
        weaknesses: ['Expensive', 'Complex implementation', 'Negative PR'],
        lastUpdated: new Date(),
      },
      {
        id: 'c3ai',
        name: 'C3.ai',
        website: 'c3.ai',
        category: 'direct',
        products: ['C3 AI Platform', 'C3 Generative AI'],
        pricing: [{ tier: 'Enterprise', price: 500000 }],
        strengths: ['AI/ML focus', 'Industry solutions'],
        weaknesses: ['Stock performance', 'Narrow use cases'],
        lastUpdated: new Date(),
      },
      {
        id: 'microsoft-copilot',
        name: 'Microsoft Copilot',
        website: 'microsoft.com',
        category: 'adjacent',
        products: ['Copilot for Microsoft 365', 'Copilot Studio'],
        pricing: [{ tier: 'Per User', price: 30 }],
        strengths: ['Distribution', 'Integration', 'Brand trust'],
        weaknesses: ['Generic', 'Not strategic', 'Privacy concerns'],
        lastUpdated: new Date(),
      },
      {
        id: 'salesforce-einstein',
        name: 'Salesforce Einstein',
        website: 'salesforce.com',
        category: 'adjacent',
        products: ['Einstein GPT', 'Einstein Analytics'],
        pricing: [{ tier: 'Enterprise', price: 150000 }],
        strengths: ['CRM integration', 'Existing customer base'],
        weaknesses: ['CRM-centric', 'Not for strategic decisions'],
        lastUpdated: new Date(),
      },
    ];

    for (const comp of knownCompetitors) {
      this.competitors.set(comp.id, comp);
    }
  }

  // ---------------------------------------------------------------------------
  // SIGNAL INGESTION
  // ---------------------------------------------------------------------------

  async ingestSignal(signal: Omit<MarketSignal, 'id' | 'relevance' | 'sentiment' | 'competitors' | 'keywords' | 'detectedAt' | 'processed'>): Promise<MarketSignal> {
    const prompt = `Analyze this market signal for Datacendia (AI Executive Council platform):

Type: ${signal.type}
Source: ${signal.source}
Title: ${signal.title}
Content: ${signal.content}

Our competitors: ${this.config.competitors.join(', ')}
Our keywords: ${this.config.keywords.join(', ')}

Output JSON:
{
  "relevance": 0-100,
  "sentiment": "positive|neutral|negative|threat|opportunity",
  "competitors": ["names of any mentioned competitors"],
  "keywords": ["relevant keywords found"],
  "summary": "1-sentence summary for founder"
}`;

    try {
      const response = await ollama.generate(prompt, { model: 'llama3.2:3b' });
      const analysis = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');

      const processedSignal: MarketSignal = {
        id: `sig-${Date.now()}`,
        ...signal,
        relevance: analysis.relevance || 50,
        sentiment: analysis.sentiment || 'neutral',
        competitors: analysis.competitors || [],
        keywords: analysis.keywords || [],
        detectedAt: new Date(),
        processed: true,
      };

      this.signals.push(processedSignal);

      // Check if we should generate an alert
      if (processedSignal.relevance >= this.config.alertThreshold) {
        await this.generateAlert(processedSignal);
      }

      logger.info(`CendiaWatch: Ingested signal ${processedSignal.id} (relevance: ${processedSignal.relevance})`);
      return processedSignal;
    } catch (error) {
      logger.error('Signal analysis failed:', error);
      const fallbackSignal: MarketSignal = {
        id: `sig-${Date.now()}`,
        ...signal,
        relevance: 50,
        sentiment: 'neutral',
        competitors: [],
        keywords: [],
        detectedAt: new Date(),
        processed: false,
      };
      this.signals.push(fallbackSignal);
      return fallbackSignal;
    }
  }

  // ---------------------------------------------------------------------------
  // ALERT GENERATION
  // ---------------------------------------------------------------------------

  private async generateAlert(signal: MarketSignal): Promise<void> {
    let severity: ThreatAlert['severity'] = 'low';
    let type: ThreatAlert['type'] = 'market_shift';

    // Determine severity and type
    if (signal.sentiment === 'threat') {
      severity = signal.relevance > 90 ? 'critical' : 'high';
    } else if (signal.sentiment === 'negative') {
      severity = 'medium';
    }

    if (signal.type === 'product_launch' && signal.competitors.length > 0) {
      type = 'competitive_launch';
      severity = 'high';
    } else if (signal.type === 'funding') {
      type = 'funding_threat';
    } else if (signal.type === 'regulation') {
      type = 'regulatory';
    }

    const prompt = `Generate a strategic response for this competitive alert:

Signal: ${signal.title}
Type: ${type}
Competitors: ${signal.competitors.join(', ')}

What should Datacendia do? Be specific and actionable.`;

    let suggestedResponse = 'Monitor situation and prepare response.';
    try {
      suggestedResponse = await ollama.generate(prompt, { model: 'llama3.2:3b' });
    } catch (error) {
      // Use default response
    }

    const alert: ThreatAlert = {
      id: `alert-${Date.now()}`,
      severity,
      type,
      title: signal.title,
      description: signal.content,
      source: [signal],
      suggestedResponse,
      createdAt: new Date(),
    };

    this.alerts.push(alert);
    logger.warn(`CendiaWatch: Generated ${severity} alert - ${alert.title}`);
  }

  // ---------------------------------------------------------------------------
  // INTELLIGENCE REPORTS
  // ---------------------------------------------------------------------------

  async generateReport(period: 'daily' | 'weekly' | 'monthly'): Promise<IntelligenceReport> {
    const periodMs = {
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
      monthly: 30 * 24 * 60 * 60 * 1000,
    }[period];

    const cutoff = new Date(Date.now() - periodMs);
    const recentSignals = this.signals.filter(s => s.detectedAt > cutoff);
    const recentAlerts = this.alerts.filter(a => a.createdAt > cutoff);

    // Generate summary
    const prompt = `Summarize these market signals for an AI Enterprise founder:

${recentSignals.slice(0, 10).map(s => `- ${s.title} (${s.sentiment})`).join('\n')}

Alerts: ${recentAlerts.length}

Write a 2-paragraph executive summary.`;

    let summary = 'Market conditions stable. No critical threats detected.';
    try {
      summary = await ollama.generate(prompt, { model: 'llama3.3:70b' });
    } catch (error) {
      // Use default summary
    }

    // Competitor updates
    const competitorUpdates = this.config.competitors
      .map(comp => {
        const compSignals = recentSignals.filter(s => 
          s.competitors.some(c => c.toLowerCase().includes(comp.toLowerCase()))
        );
        if (compSignals.length === 0) return null;
        return {
          competitor: comp,
          update: compSignals.map(s => s.title).join('; '),
        };
      })
      .filter(Boolean) as { competitor: string; update: string }[];

    // Opportunities
    const opportunities = recentSignals
      .filter(s => s.sentiment === 'opportunity')
      .map(s => ({
        description: s.title,
        urgency: s.relevance > 80 ? 'high' : 'medium',
      }));

    return {
      period,
      generatedAt: new Date(),
      summary,
      topSignals: recentSignals.sort((a, b) => b.relevance - a.relevance).slice(0, 5),
      competitorUpdates,
      threats: recentAlerts.filter(a => a.severity === 'high' || a.severity === 'critical'),
      opportunities,
      recommendations: [
        'Continue monitoring competitor product launches',
        'Track regulatory developments in AI governance',
      ],
    };
  }

  // ---------------------------------------------------------------------------
  // RADAR - Real-time Scanning
  // ---------------------------------------------------------------------------

  async scanForKeyword(keyword: string): Promise<MarketSignal[]> {
    // In production, this would scrape news/social APIs
    // For now, return cached signals matching the keyword
    return this.signals.filter(s => 
      s.keywords.some(k => k.toLowerCase().includes(keyword.toLowerCase())) ||
      s.title.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  async scanCompetitor(competitorName: string): Promise<{
    competitor: Competitor | undefined;
    recentSignals: MarketSignal[];
    threatLevel: 'low' | 'medium' | 'high';
  }> {
    const competitor = Array.from(this.competitors.values())
      .find(c => c.name.toLowerCase().includes(competitorName.toLowerCase()));

    const recentSignals = this.signals.filter(s =>
      s.competitors.some(c => c.toLowerCase().includes(competitorName.toLowerCase()))
    );

    const threatSignals = recentSignals.filter(s => s.sentiment === 'threat');
    let threatLevel: 'low' | 'medium' | 'high' = 'low';
    if (threatSignals.length > 3) threatLevel = 'high';
    else if (threatSignals.length > 0) threatLevel = 'medium';

    return { competitor, recentSignals, threatLevel };
  }

  // ---------------------------------------------------------------------------
  // COMPETITOR MANAGEMENT
  // ---------------------------------------------------------------------------

  addCompetitor(competitor: Omit<Competitor, 'id' | 'lastUpdated'>): Competitor {
    const comp: Competitor = {
      id: `comp-${Date.now()}`,
      ...competitor,
      lastUpdated: new Date(),
    };
    this.competitors.set(comp.id, comp);
    this.config.competitors.push(comp.name);
    return comp;
  }

  getCompetitors(): Competitor[] {
    return Array.from(this.competitors.values());
  }

  // ---------------------------------------------------------------------------
  // ALERTS MANAGEMENT
  // ---------------------------------------------------------------------------

  getAlerts(acknowledged?: boolean): ThreatAlert[] {
    let alerts = this.alerts;
    if (acknowledged !== undefined) {
      alerts = alerts.filter(a => (a.acknowledgedAt !== undefined) === acknowledged);
    }
    return alerts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  acknowledgeAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledgedAt = new Date();
      logger.info(`CendiaWatch: Acknowledged alert ${alertId}`);
    }
  }

  // ---------------------------------------------------------------------------
  // QUICK ALERTS FOR DASHBOARD
  // ---------------------------------------------------------------------------

  getCriticalAlert(): string | null {
    const critical = this.alerts.find(a => 
      a.severity === 'critical' && !a.acknowledgedAt
    );

    if (critical) {
      return `🚨 WATCH ALERT: ${critical.title}. ${critical.suggestedResponse}`;
    }

    const high = this.alerts.filter(a => 
      a.severity === 'high' && !a.acknowledgedAt
    );

    if (high.length > 0) {
      return `⚠️ WATCH: ${high.length} high-priority alerts require attention.`;
    }

    return null;
  }

  // ---------------------------------------------------------------------------
  // CONFIG
  // ---------------------------------------------------------------------------

  updateConfig(config: Partial<WatchConfig>): void {
    this.config = { ...this.config, ...config };
    logger.info('CendiaWatch: Configuration updated');
  }

  getConfig(): WatchConfig {
    return { ...this.config };
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getMetrics(): {
    competitorsTracked: number;
    activeAlerts: number;
    criticalAlerts: number;
    signalsProcessed: number;
    totalSignals: number;
  } {
    const alerts = this.getAlerts(false);
    const critical = alerts.filter(a => a.severity === 'critical' && !a.acknowledgedAt);

    return {
      competitorsTracked: this.competitors.size,
      activeAlerts: alerts.filter(a => !a.acknowledgedAt).length,
      criticalAlerts: critical.length,
      signalsProcessed: this.signals.filter(s => s.processed).length,
      totalSignals: this.signals.length,
    };
  }
}

export const cendiaWatchService = new CendiaWatchService();
export default cendiaWatchService;
