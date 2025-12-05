// =============================================================================
// CENDIARESONANCE™ - CORPORATE COMMUNICATIONS INTELLIGENCE
// "The Narrative Control" - AI-powered internal/external communications
// =============================================================================

import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';
import { aiModelSelector } from '../../config/aiModels.js';

// =============================================================================
// TYPES
// =============================================================================

export interface CommunicationCampaign {
  id: string;
  name: string;
  type: 'internal' | 'external' | 'crisis' | 'product_launch' | 'corporate' | 'investor';
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
  objectives: string[];
  targetAudiences: Audience[];
  messages: CampaignMessage[];
  channels: CommunicationChannel[];
  timeline: CampaignMilestone[];
  metrics: CampaignMetrics;
  createdAt: Date;
  startDate?: Date;
  endDate?: Date;
}

export interface Audience {
  name: string;
  description: string;
  size: number;
  segments: string[];
  primaryChannel: string;
  preferences: string[];
}

export interface CampaignMessage {
  id: string;
  version: number;
  content: string;
  tone: 'formal' | 'professional' | 'casual' | 'urgent' | 'inspirational';
  audience: string;
  channel: string;
  status: 'draft' | 'approved' | 'published';
  sentiment?: MessageSentiment;
  approvedBy?: string;
  publishedAt?: Date;
}

export interface MessageSentiment {
  score: number; // -100 to 100
  tone: string;
  concerns: string[];
  suggestions: string[];
}

export interface CommunicationChannel {
  name: string;
  type: 'email' | 'intranet' | 'slack' | 'town_hall' | 'press_release' | 'social' | 'video';
  reach: number;
  engagementRate: number;
  bestTimes: string[];
  limitations: string[];
}

export interface CampaignMilestone {
  name: string;
  date: Date;
  status: 'pending' | 'completed' | 'missed';
  deliverables: string[];
}

export interface CampaignMetrics {
  reach: number;
  engagement: number;
  sentiment: number;
  awareness: number;
  messageRecall: number;
  actionsTaken: number;
}

export interface BeliefMetric {
  id: string;
  topic: string;
  targetAudience: string;
  beliefScore: number; // 0-100
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
  trendDirection: 'up' | 'stable' | 'down';
  sampleSize: number;
  drivers: BeliefDriver[];
  recommendations: string[];
  measuredAt: Date;
}

export interface BeliefDriver {
  factor: string;
  impact: number; // -100 to 100
  controllable: boolean;
  action?: string;
}

export interface LeakPattern {
  id: string;
  type: 'information' | 'document' | 'strategy' | 'personnel';
  severity: 'low' | 'medium' | 'high' | 'critical';
  signature: LeakSignature;
  potentialSources: string[];
  detectedAt: Date;
  status: 'detected' | 'investigating' | 'contained' | 'resolved';
  impact: string;
  remediation: string;
}

export interface LeakSignature {
  keywords: string[];
  timing: string;
  distribution: string;
  uniqueIdentifiers: string[];
}

export interface CrisisResponse {
  id: string;
  crisisType: string;
  severity: 'minor' | 'moderate' | 'major' | 'catastrophic';
  status: 'identified' | 'responding' | 'managed' | 'resolved' | 'post_mortem';
  stakeholders: CrisisStakeholder[];
  timeline: CrisisEvent[];
  holdingStatements: HoldingStatement[];
  mediaInquiries: MediaInquiry[];
  socialMonitoring: SocialMonitoring;
  internalComms: InternalCrisisComms;
  recommendations: string[];
  lessonsLearned?: string[];
  createdAt: Date;
  resolvedAt?: Date;
}

export interface CrisisStakeholder {
  group: string;
  priority: 'primary' | 'secondary' | 'tertiary';
  concerns: string[];
  communicationPlan: string;
  status: 'not_contacted' | 'informed' | 'engaged' | 'satisfied';
}

export interface CrisisEvent {
  timestamp: Date;
  event: string;
  response: string;
  outcome: string;
  actor: string;
}

export interface HoldingStatement {
  audience: string;
  version: number;
  content: string;
  approved: boolean;
  approvedBy?: string;
  usedAt?: Date;
}

export interface MediaInquiry {
  id: string;
  outlet: string;
  journalist: string;
  query: string;
  deadline: Date;
  status: 'pending' | 'responded' | 'declined';
  response?: string;
  sentiment?: 'favorable' | 'neutral' | 'unfavorable';
}

export interface SocialMonitoring {
  mentions: number;
  sentiment: number;
  trending: boolean;
  topInfluencers: string[];
  keyNarratives: string[];
  misinformation: string[];
}

export interface InternalCrisisComms {
  employeeBriefed: boolean;
  managementBriefed: boolean;
  faqDistributed: boolean;
  hotlineActive: boolean;
  sentiment: number;
}

export interface NarrativeAnalysis {
  topic: string;
  currentNarrative: string;
  desiredNarrative: string;
  gap: number;
  influencers: string[];
  competingNarratives: string[];
  recommendations: NarrativeRecommendation[];
  generatedAt: Date;
}

export interface NarrativeRecommendation {
  action: string;
  channel: string;
  priority: 'low' | 'medium' | 'high';
  expectedImpact: number;
  timeline: string;
}

export interface ContentCalendar {
  id: string;
  period: string;
  items: CalendarItem[];
  themes: string[];
  blackoutDates: Date[];
}

export interface CalendarItem {
  id: string;
  date: Date;
  title: string;
  type: 'announcement' | 'event' | 'campaign' | 'report' | 'social';
  channel: string;
  status: 'planned' | 'in_progress' | 'published' | 'cancelled';
  owner: string;
  content?: string;
}

// =============================================================================
// SERVICE
// =============================================================================

class CendiaResonanceService {
  private campaigns: Map<string, CommunicationCampaign> = new Map();
  private beliefMetrics: Map<string, BeliefMetric[]> = new Map();
  private leakPatterns: Map<string, LeakPattern> = new Map();
  private crisisResponses: Map<string, CrisisResponse> = new Map();
  private calendars: Map<string, ContentCalendar> = new Map();

  constructor() {
    logger.info('CendiaResonance™ initialized - Narrative Control is active');
  }

  // ---------------------------------------------------------------------------
  // CAMPAIGN MANAGEMENT
  // ---------------------------------------------------------------------------

  createCampaign(campaign: Omit<CommunicationCampaign, 'id' | 'status' | 'metrics' | 'createdAt'>): CommunicationCampaign {
    const newCampaign: CommunicationCampaign = {
      ...campaign,
      id: `camp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'draft',
      metrics: {
        reach: 0,
        engagement: 0,
        sentiment: 0,
        awareness: 0,
        messageRecall: 0,
        actionsTaken: 0,
      },
      createdAt: new Date(),
    };
    this.campaigns.set(newCampaign.id, newCampaign);
    logger.info(`CendiaResonance: Campaign created - ${newCampaign.name}`);
    return newCampaign;
  }

  async generateCampaignMessage(
    campaignId: string, 
    audience: string, 
    channel: string, 
    keyPoints: string[]
  ): Promise<CampaignMessage> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) throw new Error('Campaign not found');

    const prompt = `You are CendiaResonance™, a corporate communications AI.

Generate a ${campaign.type} communication message.

CAMPAIGN: ${campaign.name}
OBJECTIVES: ${campaign.objectives.join(', ')}
TARGET AUDIENCE: ${audience}
CHANNEL: ${channel}
KEY POINTS TO INCLUDE:
${keyPoints.map(p => `- ${p}`).join('\n')}

Generate appropriate messaging in JSON:
{
  "content": "the message content",
  "tone": "formal|professional|casual|urgent|inspirational",
  "sentiment": {
    "score": -100 to 100,
    "tone": "description",
    "concerns": ["concern if any"],
    "suggestions": ["improvement suggestion"]
  }
}`;

    let messageData: any = {};

    try {
      const isAvailable = await ollama.isAvailable();
      if (isAvailable) {
        const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForService('communications') });
        messageData = this.parseJsonFromResponse(response) || {};
      }
    } catch (error) {
      logger.warn('CendiaResonance: AI message generation unavailable');
    }

    const message: CampaignMessage = {
      id: `msg-${Date.now()}`,
      version: 1,
      content: messageData.content || `Message for ${audience} regarding ${campaign.name}`,
      tone: messageData.tone || 'professional',
      audience,
      channel,
      status: 'draft',
      sentiment: messageData.sentiment,
    };

    campaign.messages.push(message);
    logger.info(`CendiaResonance: Message generated for campaign ${campaignId}`);
    return message;
  }

  approveMessage(campaignId: string, messageId: string, approver: string): CampaignMessage | null {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return null;

    const message = campaign.messages.find(m => m.id === messageId);
    if (!message) return null;

    message.status = 'approved';
    message.approvedBy = approver;

    logger.info(`CendiaResonance: Message ${messageId} approved by ${approver}`);
    return message;
  }

  launchCampaign(campaignId: string): CommunicationCampaign | null {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return null;

    campaign.status = 'active';
    campaign.startDate = new Date();

    logger.info(`CendiaResonance: Campaign launched - ${campaign.name}`);
    return campaign;
  }

  updateCampaignMetrics(campaignId: string, metrics: Partial<CampaignMetrics>): CommunicationCampaign | null {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return null;

    Object.assign(campaign.metrics, metrics);
    return campaign;
  }

  getCampaign(campaignId: string): CommunicationCampaign | null {
    return this.campaigns.get(campaignId) || null;
  }

  getActiveCampaigns(): CommunicationCampaign[] {
    return Array.from(this.campaigns.values()).filter(c => c.status === 'active');
  }

  // ---------------------------------------------------------------------------
  // BELIEF MEASUREMENT
  // ---------------------------------------------------------------------------

  async measureBelief(topic: string, targetAudience: string, sampleData?: any): Promise<BeliefMetric> {
    const prompt = `You are CendiaResonance™, measuring organizational belief/sentiment.

TOPIC: ${topic}
TARGET AUDIENCE: ${targetAudience}
${sampleData ? `SAMPLE DATA: ${JSON.stringify(sampleData).substring(0, 1000)}` : ''}

Analyze and provide belief metrics in JSON:
{
  "beliefScore": 0-100,
  "sentiment": "positive|neutral|negative",
  "confidence": 0-100,
  "trendDirection": "up|stable|down",
  "drivers": [
    {
      "factor": "driving factor",
      "impact": -100 to 100,
      "controllable": boolean,
      "action": "recommended action if controllable"
    }
  ],
  "recommendations": ["recommendation 1", "recommendation 2"]
}`;

    let beliefData: any = {};

    try {
      const isAvailable = await ollama.isAvailable();
      if (isAvailable) {
        const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForService('communications') });
        beliefData = this.parseJsonFromResponse(response) || {};
      }
    } catch (error) {
      logger.warn('CendiaResonance: AI belief measurement unavailable');
    }

    const metric: BeliefMetric = {
      id: `belief-${Date.now()}`,
      topic,
      targetAudience,
      beliefScore: beliefData.beliefScore || 65,
      sentiment: beliefData.sentiment || 'neutral',
      confidence: beliefData.confidence || 70,
      trendDirection: beliefData.trendDirection || 'stable',
      sampleSize: sampleData ? Object.keys(sampleData).length : 100,
      drivers: beliefData.drivers || [],
      recommendations: beliefData.recommendations || ['Continue monitoring'],
      measuredAt: new Date(),
    };

    const topicMetrics = this.beliefMetrics.get(topic) || [];
    topicMetrics.push(metric);
    this.beliefMetrics.set(topic, topicMetrics);

    logger.info(`CendiaResonance: Belief measured for "${topic}": ${metric.beliefScore}% (${metric.sentiment})`);
    return metric;
  }

  getBeliefHistory(topic: string): BeliefMetric[] {
    return this.beliefMetrics.get(topic) || [];
  }

  // ---------------------------------------------------------------------------
  // LEAK DETECTION
  // ---------------------------------------------------------------------------

  async detectLeakPatterns(content: string, metadata?: any): Promise<LeakPattern[]> {
    const prompt = `You are CendiaResonance™, detecting potential information leaks.

CONTENT TO ANALYZE:
${content.substring(0, 2000)}

${metadata ? `METADATA: ${JSON.stringify(metadata)}` : ''}

Analyze for leak patterns and respond in JSON:
{
  "patterns": [
    {
      "type": "information|document|strategy|personnel",
      "severity": "low|medium|high|critical",
      "signature": {
        "keywords": ["keyword 1"],
        "timing": "timing pattern",
        "distribution": "distribution pattern",
        "uniqueIdentifiers": ["identifier"]
      },
      "potentialSources": ["potential source"],
      "impact": "impact description",
      "remediation": "recommended action"
    }
  ]
}`;

    let leakData: any = { patterns: [] };

    try {
      const isAvailable = await ollama.isAvailable();
      if (isAvailable) {
        const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForService('communications') });
        leakData = this.parseJsonFromResponse(response) || { patterns: [] };
      }
    } catch (error) {
      logger.warn('CendiaResonance: AI leak detection unavailable');
    }

    const patterns: LeakPattern[] = (leakData.patterns || []).map((p: any) => ({
      ...p,
      id: `leak-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      detectedAt: new Date(),
      status: 'detected',
    }));

    // Store detected patterns
    patterns.forEach(p => this.leakPatterns.set(p.id, p));

    if (patterns.some(p => p.severity === 'critical' || p.severity === 'high')) {
      logger.warn(`CendiaResonance: High-severity leak pattern detected!`);
    }

    return patterns;
  }

  updateLeakStatus(leakId: string, status: LeakPattern['status']): LeakPattern | null {
    const leak = this.leakPatterns.get(leakId);
    if (!leak) return null;

    leak.status = status;
    logger.info(`CendiaResonance: Leak ${leakId} status updated to ${status}`);
    return leak;
  }

  // ---------------------------------------------------------------------------
  // CRISIS COMMUNICATION
  // ---------------------------------------------------------------------------

  initiateCrisisResponse(crisisType: string, severity: CrisisResponse['severity'], description: string): CrisisResponse {
    const crisis: CrisisResponse = {
      id: `crisis-${Date.now()}`,
      crisisType,
      severity,
      status: 'identified',
      stakeholders: [
        { group: 'Employees', priority: 'primary', concerns: [], communicationPlan: 'All-hands meeting', status: 'not_contacted' },
        { group: 'Customers', priority: 'primary', concerns: [], communicationPlan: 'Direct email', status: 'not_contacted' },
        { group: 'Media', priority: 'secondary', concerns: [], communicationPlan: 'Press statement', status: 'not_contacted' },
        { group: 'Regulators', priority: 'secondary', concerns: [], communicationPlan: 'Formal notification', status: 'not_contacted' },
      ],
      timeline: [{
        timestamp: new Date(),
        event: 'Crisis identified',
        response: 'Crisis team activated',
        outcome: 'Response initiated',
        actor: 'System',
      }],
      holdingStatements: [],
      mediaInquiries: [],
      socialMonitoring: {
        mentions: 0,
        sentiment: 0,
        trending: false,
        topInfluencers: [],
        keyNarratives: [],
        misinformation: [],
      },
      internalComms: {
        employeeBriefed: false,
        managementBriefed: false,
        faqDistributed: false,
        hotlineActive: false,
        sentiment: 0,
      },
      recommendations: [
        'Activate crisis communication team',
        'Prepare holding statement',
        'Monitor social media',
        'Brief leadership',
      ],
      createdAt: new Date(),
    };

    this.crisisResponses.set(crisis.id, crisis);
    logger.error(`CendiaResonance: CRISIS INITIATED - ${crisisType} (${severity})`);
    return crisis;
  }

  async generateHoldingStatement(crisisId: string, audience: string): Promise<HoldingStatement> {
    const crisis = this.crisisResponses.get(crisisId);
    if (!crisis) throw new Error('Crisis not found');

    const prompt = `You are CendiaResonance™, generating a crisis holding statement.

CRISIS TYPE: ${crisis.crisisType}
SEVERITY: ${crisis.severity}
AUDIENCE: ${audience}

Generate an appropriate holding statement that:
- Acknowledges the situation
- Shows empathy and concern
- Commits to transparency
- Does NOT speculate or admit fault
- Provides next steps

Respond in JSON:
{
  "content": "the holding statement"
}`;

    let statementData: any = {};

    try {
      const isAvailable = await ollama.isAvailable();
      if (isAvailable) {
        const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForService('communications') });
        statementData = this.parseJsonFromResponse(response) || {};
      }
    } catch (error) {
      logger.warn('CendiaResonance: AI statement generation unavailable');
    }

    const statement: HoldingStatement = {
      audience,
      version: crisis.holdingStatements.filter(s => s.audience === audience).length + 1,
      content: statementData.content || `We are aware of the situation and are actively investigating. The safety and trust of our stakeholders is our top priority. We will provide updates as more information becomes available.`,
      approved: false,
    };

    crisis.holdingStatements.push(statement);
    logger.info(`CendiaResonance: Holding statement generated for ${audience}`);
    return statement;
  }

  approveHoldingStatement(crisisId: string, audience: string, version: number, approver: string): HoldingStatement | null {
    const crisis = this.crisisResponses.get(crisisId);
    if (!crisis) return null;

    const statement = crisis.holdingStatements.find(s => s.audience === audience && s.version === version);
    if (!statement) return null;

    statement.approved = true;
    statement.approvedBy = approver;

    logger.info(`CendiaResonance: Holding statement approved for ${audience} by ${approver}`);
    return statement;
  }

  recordMediaInquiry(crisisId: string, inquiry: Omit<MediaInquiry, 'id' | 'status'>): MediaInquiry {
    const crisis = this.crisisResponses.get(crisisId);
    if (!crisis) throw new Error('Crisis not found');

    const mediaInquiry: MediaInquiry = {
      ...inquiry,
      id: `media-${Date.now()}`,
      status: 'pending',
    };

    crisis.mediaInquiries.push(mediaInquiry);
    logger.info(`CendiaResonance: Media inquiry recorded from ${inquiry.outlet}`);
    return mediaInquiry;
  }

  updateCrisisStatus(crisisId: string, status: CrisisResponse['status'], event: string, response: string): CrisisResponse | null {
    const crisis = this.crisisResponses.get(crisisId);
    if (!crisis) return null;

    crisis.status = status;
    crisis.timeline.push({
      timestamp: new Date(),
      event,
      response,
      outcome: `Status: ${status}`,
      actor: 'Crisis Team',
    });

    if (status === 'resolved') {
      crisis.resolvedAt = new Date();
    }

    logger.info(`CendiaResonance: Crisis ${crisisId} status updated to ${status}`);
    return crisis;
  }

  getCrisis(crisisId: string): CrisisResponse | null {
    return this.crisisResponses.get(crisisId) || null;
  }

  getActiveCrises(): CrisisResponse[] {
    return Array.from(this.crisisResponses.values()).filter(c => c.status !== 'resolved' && c.status !== 'post_mortem');
  }

  // ---------------------------------------------------------------------------
  // NARRATIVE ANALYSIS
  // ---------------------------------------------------------------------------

  async analyzeNarrative(topic: string, desiredNarrative: string): Promise<NarrativeAnalysis> {
    const prompt = `You are CendiaResonance™, analyzing corporate narrative positioning.

TOPIC: ${topic}
DESIRED NARRATIVE: ${desiredNarrative}

Analyze the narrative landscape and provide in JSON:
{
  "currentNarrative": "description of current perception",
  "gap": 0-100,
  "influencers": ["key influencer/source"],
  "competingNarratives": ["competing narrative"],
  "recommendations": [
    {
      "action": "specific action",
      "channel": "communication channel",
      "priority": "low|medium|high",
      "expectedImpact": 0-100,
      "timeline": "timeframe"
    }
  ]
}`;

    let narrativeData: any = {};

    try {
      const isAvailable = await ollama.isAvailable();
      if (isAvailable) {
        const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForService('communications') });
        narrativeData = this.parseJsonFromResponse(response) || {};
      }
    } catch (error) {
      logger.warn('CendiaResonance: AI narrative analysis unavailable');
    }

    const analysis: NarrativeAnalysis = {
      topic,
      currentNarrative: narrativeData.currentNarrative || 'Analysis pending',
      desiredNarrative,
      gap: narrativeData.gap || 50,
      influencers: narrativeData.influencers || [],
      competingNarratives: narrativeData.competingNarratives || [],
      recommendations: narrativeData.recommendations || [{
        action: 'Develop thought leadership content',
        channel: 'Multiple channels',
        priority: 'high',
        expectedImpact: 60,
        timeline: '3-6 months',
      }],
      generatedAt: new Date(),
    };

    logger.info(`CendiaResonance: Narrative analysis complete for "${topic}" - ${analysis.gap}% gap`);
    return analysis;
  }

  // ---------------------------------------------------------------------------
  // CONTENT CALENDAR
  // ---------------------------------------------------------------------------

  createCalendar(period: string, themes: string[]): ContentCalendar {
    const calendar: ContentCalendar = {
      id: `cal-${Date.now()}`,
      period,
      items: [],
      themes,
      blackoutDates: [],
    };
    this.calendars.set(calendar.id, calendar);
    logger.info(`CendiaResonance: Content calendar created for ${period}`);
    return calendar;
  }

  addCalendarItem(calendarId: string, item: Omit<CalendarItem, 'id' | 'status'>): CalendarItem {
    const calendar = this.calendars.get(calendarId);
    if (!calendar) throw new Error('Calendar not found');

    const newItem: CalendarItem = {
      ...item,
      id: `cal-item-${Date.now()}`,
      status: 'planned',
    };

    calendar.items.push(newItem);
    return newItem;
  }

  getCalendar(calendarId: string): ContentCalendar | null {
    return this.calendars.get(calendarId) || null;
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
      logger.warn('CendiaResonance: Failed to parse AI response as JSON');
    }
    return null;
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getMetrics(): {
    activeCampaigns: number;
    activeCrises: number;
    averageSentiment: number;
    leaksDetected: number;
    messagesPublished: number;
  } {
    const campaigns = this.getActiveCampaigns();
    const crises = this.getActiveCrises();
    const allBeliefs = Array.from(this.beliefMetrics.values()).flat();
    
    const avgSentiment = allBeliefs.length > 0
      ? allBeliefs.reduce((sum, b) => sum + b.beliefScore, 0) / allBeliefs.length
      : 50;

    const publishedMessages = campaigns.reduce((sum, c) => 
      sum + c.messages.filter(m => m.status === 'published').length, 0);

    return {
      activeCampaigns: campaigns.length,
      activeCrises: crises.length,
      averageSentiment: Math.round(avgSentiment),
      leaksDetected: this.leakPatterns.size,
      messagesPublished: publishedMessages,
    };
  }
}

// Export singleton instance
export const cendiaResonanceService = new CendiaResonanceService();
