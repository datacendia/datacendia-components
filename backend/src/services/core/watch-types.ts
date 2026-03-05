// CendiaWatch Types - extracted for maintainability

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

