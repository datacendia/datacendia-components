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

