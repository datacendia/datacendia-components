// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIARESONANCEâ„¢ - CORPORATE COMMUNICATIONS INTELLIGENCE
// "The Narrative Control" - AI-powered internal/external communications
// =============================================================================

import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';
import { aiModelSelector } from '../../config/aiModels.js';
import { deterministicFloat, deterministicInt, deterministicPercentage, deterministicPick } from '../../utils/deterministic.js';

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
    logger.info('CendiaResonanceâ„¢ initialized - Narrative Control is active');
  }

  // ---------------------------------------------------------------------------
  // CAMPAIGN MANAGEMENT
  // ---------------------------------------------------------------------------

  createCampaign(campaign: Omit<CommunicationCampaign, 'id' | 'status' | 'metrics' | 'createdAt'>): CommunicationCampaign {
    const newCampaign: CommunicationCampaign = {
      ...campaign,
      id: `camp-${Date.now()}-${deterministicFloat('resonance-1').toString(36).substr(2, 9)}`,
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

    const prompt = `You are CendiaResonanceâ„¢, a corporate communications AI.

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
    const prompt = `You are CendiaResonanceâ„¢, measuring organizational belief/sentiment.

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
    const prompt = `You are CendiaResonanceâ„¢, detecting potential information leaks.

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
      id: `leak-${Date.now()}-${deterministicFloat('resonance-2').toString(36).substr(2, 6)}`,
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

    const prompt = `You are CendiaResonanceâ„¢, generating a crisis holding statement.

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
    const prompt = `You are CendiaResonanceâ„¢, analyzing corporate narrative positioning.

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

  // ===========================================================================
  // 10/10 ENHANCEMENTS
  // ===========================================================================

  /** 10/10: Communications Intelligence Dashboard */
  getCommunicationsIntelligenceDashboard(): {
    overview: { totalCampaigns: number; activeCampaigns: number; completedCampaigns: number; totalMessages: number; publishedMessages: number; approvalRate: number };
    campaignsByType: Array<{ type: string; count: number; active: number }>;
    campaignsByStatus: Array<{ status: string; count: number }>;
    channelEffectiveness: Array<{ channel: string; campaignsUsing: number; avgReach: number; avgEngagement: number }>;
    audienceReach: { totalAudiences: number; totalReachableSize: number; avgSegmentsPerAudience: number };
    contentCalendarStatus: { totalCalendars: number; totalItems: number; planned: number; published: number; cancelled: number };
    crisisReadiness: { activeCrises: number; totalCrisesHandled: number; avgResolutionTime: number; holdingStatementsReady: number };
    leakDetection: { totalDetected: number; bySeverity: { low: number; medium: number; high: number; critical: number }; resolved: number; investigating: number };
    insights: string[];
  } {
    const campaigns = Array.from(this.campaigns.values());
    const crises = Array.from(this.crisisResponses.values());
    const leaks = Array.from(this.leakPatterns.values());
    const calendars = Array.from(this.calendars.values());

    const typeMap: Record<string, { count: number; active: number }> = {};
    const statusMap: Record<string, number> = {};
    const channelMap: Record<string, { count: number; reaches: number[]; engagements: number[] }> = {};
    let totalMsgs = 0; let publishedMsgs = 0; let approvedMsgs = 0;
    let totalAudienceSize = 0; let totalSegments = 0; let totalAudiences = 0;

    for (const c of campaigns) {
      if (!typeMap[c.type]) typeMap[c.type] = { count: 0, active: 0 };
      typeMap[c.type].count++;
      if (c.status === 'active') typeMap[c.type].active++;

      statusMap[c.status] = (statusMap[c.status] || 0) + 1;

      totalMsgs += c.messages.length;
      publishedMsgs += c.messages.filter(m => m.status === 'published').length;
      approvedMsgs += c.messages.filter(m => m.status === 'approved' || m.status === 'published').length;

      for (const ch of c.channels) {
        if (!channelMap[ch.name]) channelMap[ch.name] = { count: 0, reaches: [], engagements: [] };
        channelMap[ch.name].count++;
        channelMap[ch.name].reaches.push(ch.reach);
        channelMap[ch.name].engagements.push(ch.engagementRate);
      }

      for (const a of c.targetAudiences) {
        totalAudiences++;
        totalAudienceSize += a.size;
        totalSegments += a.segments.length;
      }
    }

    let totalCalItems = 0; let planned = 0; let published = 0; let cancelled = 0;
    for (const cal of calendars) {
      totalCalItems += cal.items.length;
      planned += cal.items.filter(i => i.status === 'planned').length;
      published += cal.items.filter(i => i.status === 'published').length;
      cancelled += cal.items.filter(i => i.status === 'cancelled').length;
    }

    const resolvedCrises = crises.filter(c => c.resolvedAt);
    const avgResolution = resolvedCrises.length > 0
      ? Math.round(resolvedCrises.reduce((s, c) => s + (c.resolvedAt!.getTime() - c.createdAt.getTime()) / (60 * 60 * 1000), 0) / resolvedCrises.length)
      : 0;

    const leakSeverity = { low: 0, medium: 0, high: 0, critical: 0 };
    let leaksResolved = 0; let leaksInvestigating = 0;
    for (const l of leaks) {
      leakSeverity[l.severity]++;
      if (l.status === 'resolved' || l.status === 'contained') leaksResolved++;
      if (l.status === 'investigating') leaksInvestigating++;
    }

    const insights: string[] = [];
    const activeCrises = crises.filter(c => c.status !== 'resolved' && c.status !== 'post_mortem');
    if (activeCrises.length > 0) insights.push(`${activeCrises.length} active crisis(es) â€” ensure all stakeholders are informed`);
    if (leakSeverity.critical > 0 || leakSeverity.high > 0) insights.push(`${leakSeverity.critical + leakSeverity.high} high/critical leak pattern(s) detected â€” immediate action required`);
    if (totalMsgs > 0 && publishedMsgs / totalMsgs < 0.3) insights.push(`Only ${Math.round((publishedMsgs / totalMsgs) * 100)}% of messages published â€” review approval pipeline`);
    const draftCampaigns = campaigns.filter(c => c.status === 'draft');
    if (draftCampaigns.length > 3) insights.push(`${draftCampaigns.length} draft campaigns â€” review and launch or archive`);
    if (insights.length === 0) insights.push('Communications operations are running smoothly');

    return {
      overview: {
        totalCampaigns: campaigns.length, activeCampaigns: campaigns.filter(c => c.status === 'active').length,
        completedCampaigns: campaigns.filter(c => c.status === 'completed').length,
        totalMessages: totalMsgs, publishedMessages: publishedMsgs,
        approvalRate: totalMsgs > 0 ? Math.round((approvedMsgs / totalMsgs) * 100) : 0,
      },
      campaignsByType: Object.entries(typeMap).map(([t, d]) => ({ type: t, count: d.count, active: d.active })),
      campaignsByStatus: Object.entries(statusMap).map(([s, c]) => ({ status: s, count: c })),
      channelEffectiveness: Object.entries(channelMap).map(([ch, d]) => ({
        channel: ch, campaignsUsing: d.count,
        avgReach: d.reaches.length > 0 ? Math.round(d.reaches.reduce((a, b) => a + b, 0) / d.reaches.length) : 0,
        avgEngagement: d.engagements.length > 0 ? Math.round(d.engagements.reduce((a, b) => a + b, 0) / d.engagements.length * 10) / 10 : 0,
      })).sort((a, b) => b.avgEngagement - a.avgEngagement),
      audienceReach: { totalAudiences, totalReachableSize: totalAudienceSize, avgSegmentsPerAudience: totalAudiences > 0 ? Math.round(totalSegments / totalAudiences * 10) / 10 : 0 },
      contentCalendarStatus: { totalCalendars: calendars.length, totalItems: totalCalItems, planned, published, cancelled },
      crisisReadiness: {
        activeCrises: activeCrises.length, totalCrisesHandled: crises.length,
        avgResolutionTime: avgResolution,
        holdingStatementsReady: crises.reduce((s, c) => s + c.holdingStatements.filter(h => h.approved).length, 0),
      },
      leakDetection: { totalDetected: leaks.length, bySeverity: leakSeverity, resolved: leaksResolved, investigating: leaksInvestigating },
      insights,
    };
  }

  /** 10/10: Campaign Performance Analytics */
  getCampaignPerformanceAnalytics(): {
    campaignPerformance: Array<{
      id: string; name: string; type: string; status: string;
      messageCount: number; publishedCount: number;
      metrics: CampaignMetrics; milestoneCompletion: number;
      durationDays: number | null; channelCount: number;
    }>;
    aggregateMetrics: { avgReach: number; avgEngagement: number; avgSentiment: number; avgAwareness: number; totalActionsTaken: number };
    messageAnalysis: { totalMessages: number; byTone: Array<{ tone: string; count: number }>; byStatus: Array<{ status: string; count: number }>; avgVersions: number };
    milestoneTracking: { total: number; completed: number; missed: number; pending: number; completionRate: number };
    topPerforming: Array<{ name: string; engagementScore: number }>;
    insights: string[];
  } {
    const campaigns = Array.from(this.campaigns.values());
    let totalReach = 0; let totalEngagement = 0; let totalSentiment = 0; let totalAwareness = 0; let totalActions = 0;
    let activeCampaignsWithMetrics = 0;
    const toneMap: Record<string, number> = {};
    const msgStatusMap: Record<string, number> = {};
    let totalMilestones = 0; let completedMs = 0; let missedMs = 0; let pendingMs = 0;
    let totalVersions = 0; let totalMsgCount = 0;

    const campaignPerformance = campaigns.map(c => {
      const published = c.messages.filter(m => m.status === 'published').length;
      const durationDays = c.startDate ? Math.floor((Date.now() - c.startDate.getTime()) / (24 * 60 * 60 * 1000)) : null;

      if (c.metrics.reach > 0 || c.metrics.engagement > 0) {
        activeCampaignsWithMetrics++;
        totalReach += c.metrics.reach;
        totalEngagement += c.metrics.engagement;
        totalSentiment += c.metrics.sentiment;
        totalAwareness += c.metrics.awareness;
        totalActions += c.metrics.actionsTaken;
      }

      for (const m of c.messages) {
        toneMap[m.tone] = (toneMap[m.tone] || 0) + 1;
        msgStatusMap[m.status] = (msgStatusMap[m.status] || 0) + 1;
        totalVersions += m.version;
        totalMsgCount++;
      }

      let msComplete = 0;
      for (const ms of c.timeline) {
        totalMilestones++;
        if (ms.status === 'completed') { completedMs++; msComplete++; }
        else if (ms.status === 'missed') missedMs++;
        else pendingMs++;
      }

      return {
        id: c.id, name: c.name, type: c.type, status: c.status,
        messageCount: c.messages.length, publishedCount: published,
        metrics: c.metrics,
        milestoneCompletion: c.timeline.length > 0 ? Math.round((msComplete / c.timeline.length) * 100) : 0,
        durationDays, channelCount: c.channels.length,
      };
    });

    const n = activeCampaignsWithMetrics || 1;
    const topPerforming = campaignPerformance
      .filter(c => c.metrics.engagement > 0)
      .map(c => ({ name: c.name, engagementScore: c.metrics.engagement }))
      .sort((a, b) => b.engagementScore - a.engagementScore)
      .slice(0, 5);

    const insights: string[] = [];
    if (missedMs > 0) insights.push(`${missedMs} milestone(s) missed across campaigns â€” review timelines`);
    const lowEngagement = campaignPerformance.filter(c => c.status === 'active' && c.metrics.engagement < 10 && c.metrics.reach > 0);
    if (lowEngagement.length > 0) insights.push(`${lowEngagement.length} active campaign(s) with low engagement despite reach â€” review messaging`);
    if (totalMsgCount > 0 && Object.keys(toneMap).length === 1) insights.push('All messages use the same tone â€” consider varying tone by audience and channel');
    if (insights.length === 0) insights.push('Campaign performance metrics are healthy');

    return {
      campaignPerformance,
      aggregateMetrics: {
        avgReach: Math.round(totalReach / n), avgEngagement: Math.round(totalEngagement / n),
        avgSentiment: Math.round(totalSentiment / n), avgAwareness: Math.round(totalAwareness / n),
        totalActionsTaken: totalActions,
      },
      messageAnalysis: {
        totalMessages: totalMsgCount,
        byTone: Object.entries(toneMap).map(([t, c]) => ({ tone: t, count: c })).sort((a, b) => b.count - a.count),
        byStatus: Object.entries(msgStatusMap).map(([s, c]) => ({ status: s, count: c })),
        avgVersions: totalMsgCount > 0 ? Math.round(totalVersions / totalMsgCount * 10) / 10 : 0,
      },
      milestoneTracking: { total: totalMilestones, completed: completedMs, missed: missedMs, pending: pendingMs, completionRate: totalMilestones > 0 ? Math.round((completedMs / totalMilestones) * 100) : 0 },
      topPerforming,
      insights,
    };
  }

  /** 10/10: Crisis Response Intelligence */
  getCrisisResponseIntelligence(): {
    overview: { totalCrises: number; activeCrises: number; resolvedCrises: number; avgResolutionHours: number };
    bySeverity: Array<{ severity: string; count: number; resolved: number; active: number }>;
    stakeholderCoverage: { totalStakeholders: number; contacted: number; satisfied: number; contactRate: number };
    mediaManagement: { totalInquiries: number; responded: number; pending: number; responseRate: number; favorableSentiment: number };
    holdingStatements: { total: number; approved: number; approvalRate: number };
    socialImpact: { avgMentions: number; avgSentiment: number; trendingCrises: number; misinformationDetected: number };
    internalReadiness: { briefedRate: number; faqDistributed: number; hotlineActive: number };
    crisisTimeline: Array<{ id: string; type: string; severity: string; status: string; eventCount: number; durationHours: number | null; createdAt: Date }>;
    insights: string[];
  } {
    const crises = Array.from(this.crisisResponses.values());
    const active = crises.filter(c => c.status !== 'resolved' && c.status !== 'post_mortem');
    const resolved = crises.filter(c => c.resolvedAt);

    const sevMap: Record<string, { count: number; resolved: number; active: number }> = {};
    let totalStakeholders = 0; let contacted = 0; let satisfied = 0;
    let totalInquiries = 0; let responded = 0; let pending = 0; let favorable = 0;
    let totalStatements = 0; let approvedStatements = 0;
    let totalMentions = 0; let totalSentiment = 0; let trending = 0; let misinfo = 0;
    let briefed = 0; let faqDist = 0; let hotlineAct = 0;

    for (const c of crises) {
      if (!sevMap[c.severity]) sevMap[c.severity] = { count: 0, resolved: 0, active: 0 };
      sevMap[c.severity].count++;
      if (c.resolvedAt) sevMap[c.severity].resolved++;
      if (c.status !== 'resolved' && c.status !== 'post_mortem') sevMap[c.severity].active++;

      for (const s of c.stakeholders) {
        totalStakeholders++;
        if (s.status !== 'not_contacted') contacted++;
        if (s.status === 'satisfied') satisfied++;
      }

      for (const m of c.mediaInquiries) {
        totalInquiries++;
        if (m.status === 'responded') responded++;
        if (m.status === 'pending') pending++;
        if (m.sentiment === 'favorable') favorable++;
      }

      totalStatements += c.holdingStatements.length;
      approvedStatements += c.holdingStatements.filter(h => h.approved).length;

      totalMentions += c.socialMonitoring.mentions;
      totalSentiment += c.socialMonitoring.sentiment;
      if (c.socialMonitoring.trending) trending++;
      misinfo += c.socialMonitoring.misinformation.length;

      if (c.internalComms.employeeBriefed || c.internalComms.managementBriefed) briefed++;
      if (c.internalComms.faqDistributed) faqDist++;
      if (c.internalComms.hotlineActive) hotlineAct++;
    }

    const n = crises.length || 1;
    const avgResolution = resolved.length > 0
      ? Math.round(resolved.reduce((s, c) => s + (c.resolvedAt!.getTime() - c.createdAt.getTime()) / (60 * 60 * 1000), 0) / resolved.length)
      : 0;

    const crisisTimeline = crises.map(c => ({
      id: c.id, type: c.crisisType, severity: c.severity, status: c.status,
      eventCount: c.timeline.length,
      durationHours: c.resolvedAt ? Math.round((c.resolvedAt.getTime() - c.createdAt.getTime()) / (60 * 60 * 1000)) : null,
      createdAt: c.createdAt,
    })).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const insights: string[] = [];
    if (active.length > 0) insights.push(`${active.length} active crisis(es) require attention`);
    if (totalStakeholders > 0 && contacted / totalStakeholders < 0.5) insights.push(`Only ${Math.round((contacted / totalStakeholders) * 100)}% of stakeholders contacted â€” accelerate outreach`);
    if (pending > 0) insights.push(`${pending} media inquiry(ies) pending response â€” address before deadline`);
    if (misinfo > 0) insights.push(`${misinfo} misinformation item(s) detected â€” prepare counter-narrative`);
    if (totalStatements > 0 && approvedStatements / totalStatements < 0.5) insights.push('Low holding statement approval rate â€” expedite review process');
    if (insights.length === 0) insights.push('Crisis management posture is strong');

    return {
      overview: { totalCrises: crises.length, activeCrises: active.length, resolvedCrises: resolved.length, avgResolutionHours: avgResolution },
      bySeverity: Object.entries(sevMap).map(([s, d]) => ({ severity: s, count: d.count, resolved: d.resolved, active: d.active })),
      stakeholderCoverage: { totalStakeholders, contacted, satisfied, contactRate: totalStakeholders > 0 ? Math.round((contacted / totalStakeholders) * 100) : 0 },
      mediaManagement: { totalInquiries, responded, pending, responseRate: totalInquiries > 0 ? Math.round((responded / totalInquiries) * 100) : 0, favorableSentiment: favorable },
      holdingStatements: { total: totalStatements, approved: approvedStatements, approvalRate: totalStatements > 0 ? Math.round((approvedStatements / totalStatements) * 100) : 0 },
      socialImpact: { avgMentions: Math.round(totalMentions / n), avgSentiment: Math.round(totalSentiment / n), trendingCrises: trending, misinformationDetected: misinfo },
      internalReadiness: { briefedRate: Math.round((briefed / n) * 100), faqDistributed: faqDist, hotlineActive: hotlineAct },
      crisisTimeline,
      insights,
    };
  }

  /** 10/10: Narrative & Belief Analytics */
  getNarrativeBeliefAnalytics(): {
    beliefOverview: { topicsTracked: number; avgBeliefScore: number; positiveTopics: number; negativeTopics: number; decliningTopics: number };
    beliefByTopic: Array<{ topic: string; measurements: number; latestScore: number; latestSentiment: string; trend: string; audiencesTracked: number }>;
    audienceInsights: Array<{ audience: string; topicsCovered: number; avgBeliefScore: number; avgSentiment: string }>;
    driverAnalysis: Array<{ factor: string; totalImpact: number; controllable: boolean; frequency: number }>;
    leakIntelligence: {
      totalPatterns: number; bySeverity: Record<string, number>; byType: Record<string, number>;
      resolutionRate: number; avgDetectionToResolution: number;
      recentPatterns: Array<{ id: string; type: string; severity: string; status: string; detectedAt: Date }>;
    };
    insights: string[];
  } {
    const allBeliefs = Array.from(this.beliefMetrics.entries());
    const leaks = Array.from(this.leakPatterns.values());

    let totalScore = 0; let totalMeasurements = 0;
    let positive = 0; let negative = 0; let declining = 0;
    const audienceMap: Record<string, { topics: number; scores: number[]; sentiments: string[] }> = {};
    const driverMap: Record<string, { totalImpact: number; controllable: boolean; count: number }> = {};

    const beliefByTopic = allBeliefs.map(([topic, measurements]) => {
      const latest = measurements[measurements.length - 1];
      totalMeasurements += measurements.length;

      const scores = measurements.map(m => m.beliefScore);
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      totalScore += avgScore;

      if (latest.sentiment === 'positive') positive++;
      if (latest.sentiment === 'negative') negative++;
      if (latest.trendDirection === 'down') declining++;

      const audiences = new Set(measurements.map(m => m.targetAudience));
      for (const aud of audiences) {
        if (!audienceMap[aud]) audienceMap[aud] = { topics: 0, scores: [], sentiments: [] };
        audienceMap[aud].topics++;
      }

      for (const m of measurements) {
        if (!audienceMap[m.targetAudience]) audienceMap[m.targetAudience] = { topics: 0, scores: [], sentiments: [] };
        audienceMap[m.targetAudience].scores.push(m.beliefScore);
        audienceMap[m.targetAudience].sentiments.push(m.sentiment);

        for (const d of m.drivers) {
          if (!driverMap[d.factor]) driverMap[d.factor] = { totalImpact: 0, controllable: d.controllable, count: 0 };
          driverMap[d.factor].totalImpact += d.impact;
          driverMap[d.factor].count++;
        }
      }

      return {
        topic, measurements: measurements.length,
        latestScore: latest.beliefScore, latestSentiment: latest.sentiment,
        trend: latest.trendDirection, audiencesTracked: audiences.size,
      };
    }).sort((a, b) => b.measurements - a.measurements);

    const leakSev: Record<string, number> = {};
    const leakType: Record<string, number> = {};
    let resolvedLeaks = 0;
    for (const l of leaks) {
      leakSev[l.severity] = (leakSev[l.severity] || 0) + 1;
      leakType[l.type] = (leakType[l.type] || 0) + 1;
      if (l.status === 'resolved' || l.status === 'contained') resolvedLeaks++;
    }

    const topicCount = allBeliefs.length || 1;

    const insights: string[] = [];
    if (declining > 0) insights.push(`${declining} topic(s) showing declining belief scores â€” investigate and address`);
    if (negative > positive && allBeliefs.length > 0) insights.push('More negative than positive belief topics â€” review communications strategy');
    const uncontrollableDrivers = Object.values(driverMap).filter(d => !d.controllable && d.totalImpact < -50);
    if (uncontrollableDrivers.length > 0) insights.push(`${uncontrollableDrivers.length} high-impact uncontrollable factor(s) â€” develop mitigation strategies`);
    if (leaks.length > 0 && resolvedLeaks / leaks.length < 0.5) insights.push(`Only ${Math.round((resolvedLeaks / leaks.length) * 100)}% of leak patterns resolved â€” prioritize containment`);
    if (insights.length === 0) insights.push('Narrative and belief metrics are healthy');

    return {
      beliefOverview: {
        topicsTracked: allBeliefs.length,
        avgBeliefScore: allBeliefs.length > 0 ? Math.round(totalScore / topicCount) : 0,
        positiveTopics: positive, negativeTopics: negative, decliningTopics: declining,
      },
      beliefByTopic,
      audienceInsights: Object.entries(audienceMap).map(([aud, d]) => ({
        audience: aud, topicsCovered: d.topics,
        avgBeliefScore: d.scores.length > 0 ? Math.round(d.scores.reduce((a, b) => a + b, 0) / d.scores.length) : 0,
        avgSentiment: d.sentiments.filter(s => s === 'positive').length > d.sentiments.filter(s => s === 'negative').length ? 'positive' : d.sentiments.filter(s => s === 'negative').length > d.sentiments.filter(s => s === 'positive').length ? 'negative' : 'neutral',
      })),
      driverAnalysis: Object.entries(driverMap).map(([f, d]) => ({ factor: f, totalImpact: d.totalImpact, controllable: d.controllable, frequency: d.count })).sort((a, b) => Math.abs(b.totalImpact) - Math.abs(a.totalImpact)).slice(0, 15),
      leakIntelligence: {
        totalPatterns: leaks.length, bySeverity: leakSev, byType: leakType,
        resolutionRate: leaks.length > 0 ? Math.round((resolvedLeaks / leaks.length) * 100) : 100,
        avgDetectionToResolution: 0,
        recentPatterns: [...leaks].sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime()).slice(0, 10).map(l => ({ id: l.id, type: l.type, severity: l.severity, status: l.status, detectedAt: l.detectedAt })),
      },
      insights,
    };
  }
}

// Export singleton instance
export const cendiaResonanceService = new CendiaResonanceService();
