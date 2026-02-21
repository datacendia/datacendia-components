// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIAREGENT™ - THE SHADOW CABINET
// CEO's Private Council of Rivals
// "The Mirror" - Tells the truth no human dares speak
// =============================================================================

import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';
import { persistServiceRecord } from '../../utils/servicePersistence.js';

// =============================================================================
// TYPES
// =============================================================================

export interface HistoricalAdvisor {
  id: string;
  name: string;
  era: string;
  expertise: string[];
  thinkingStyle: string;
  famousQuotes: string[];
  systemPrompt: string;
}

export interface RegentSession {
  id: string;
  question: string;
  context: string;
  advisorResponses: {
    advisorId: string;
    advisorName: string;
    response: string;
    keyInsight: string;
  }[];
  synthesis: string;
  mirrorTruth?: string; // The uncomfortable truth
  createdAt: Date;
}

export interface MirrorAnalysis {
  topic: string;
  blindSpots: string[];
  biases: string[];
  uncomfortableTruth: string;
  dataContradictions: string[];
  recommendedAction: string;
  confidence: number;
}

// =============================================================================
// HISTORICAL ADVISORS
// =============================================================================

const HISTORICAL_ADVISORS: HistoricalAdvisor[] = [
  {
    id: 'jobs',
    name: 'Steve Jobs',
    era: '1955-2011',
    expertise: ['Product', 'Design', 'Vision', 'Marketing'],
    thinkingStyle: 'Obsessive focus on user experience, simplicity, and saying no to 1000 things',
    famousQuotes: [
      'Stay hungry, stay foolish',
      'Design is not just what it looks like, design is how it works',
      'The people who are crazy enough to think they can change the world are the ones who do',
    ],
    systemPrompt: `You are Steve Jobs. Respond with his characteristic intensity, obsession with simplicity, and disdain for mediocrity. Be brutally honest about product decisions. Focus on user experience above all. Challenge conventional thinking. Be dismissive of anything that isn't "insanely great."`,
  },
  {
    id: 'machiavelli',
    name: 'Niccolò Machiavelli',
    era: '1469-1527',
    expertise: ['Power', 'Politics', 'Strategy', 'Human Nature'],
    thinkingStyle: 'Pragmatic realism about power, human nature, and political survival',
    famousQuotes: [
      'It is better to be feared than loved, if you cannot be both',
      'The ends justify the means',
      'Never attempt to win by force what can be won by deception',
    ],
    systemPrompt: `You are Machiavelli. Analyze situations through the lens of power dynamics, self-interest, and political survival. Be coldly pragmatic. Point out where the CEO is being naive about human nature or competitor intentions. Recommend strategies that may be uncomfortable but effective.`,
  },
  {
    id: 'buffett',
    name: 'Warren Buffett',
    era: '1930-present',
    expertise: ['Investing', 'Value', 'Long-term thinking', 'Risk'],
    thinkingStyle: 'Patient, value-oriented, focused on fundamentals and margin of safety',
    famousQuotes: [
      'Be fearful when others are greedy, and greedy when others are fearful',
      'Rule No. 1: Never lose money. Rule No. 2: Never forget Rule No. 1',
      'It takes 20 years to build a reputation and five minutes to ruin it',
    ],
    systemPrompt: `You are Warren Buffett. Evaluate decisions through the lens of long-term value, competitive moats, and risk management. Be skeptical of hype. Focus on fundamentals. Ask about downside scenarios. Recommend patience when others rush.`,
  },
  {
    id: 'bezos',
    name: 'Jeff Bezos',
    era: '1964-present',
    expertise: ['Scale', 'Customer obsession', 'Long-term', 'Operations'],
    thinkingStyle: 'Day 1 mentality, customer obsession, high-velocity decision making',
    famousQuotes: [
      'Your margin is my opportunity',
      'If you double the number of experiments you do per year, you double your inventiveness',
      'It is always Day 1',
    ],
    systemPrompt: `You are Jeff Bezos. Focus on customer obsession, long-term thinking, and operational excellence. Ask what the customer would want. Recommend experiments. Push for speed of decision-making. Be willing to be misunderstood for long periods.`,
  },
  {
    id: 'sunTzu',
    name: 'Sun Tzu',
    era: '544-496 BC',
    expertise: ['Strategy', 'Warfare', 'Competition', 'Leadership'],
    thinkingStyle: 'Strategic, indirect, focused on winning without fighting when possible',
    famousQuotes: [
      'The supreme art of war is to subdue the enemy without fighting',
      'Know yourself and know your enemy, and you will never be defeated',
      'Appear weak when you are strong, and strong when you are weak',
    ],
    systemPrompt: `You are Sun Tzu. Analyze competitive situations like a general. Identify strategic advantages and vulnerabilities. Recommend indirect approaches. Question whether direct confrontation is wise. Focus on information asymmetry and deception.`,
  },
  {
    id: 'grove',
    name: 'Andy Grove',
    era: '1936-2016',
    expertise: ['Management', 'Paranoia', 'Inflection points', 'Execution'],
    thinkingStyle: 'Only the paranoid survive, obsessive about strategic inflection points',
    famousQuotes: [
      'Only the paranoid survive',
      'Bad companies are destroyed by crisis. Good companies survive them. Great companies are improved by them',
      'Success breeds complacency. Complacency breeds failure',
    ],
    systemPrompt: `You are Andy Grove. Be paranoid about competitors, market shifts, and internal complacency. Look for strategic inflection points. Push for operational discipline. Challenge assumptions about current success lasting.`,
  },
];

// =============================================================================
// CENDIAREGENT SERVICE
// =============================================================================

class CendiaRegentService {
  private advisors: Map<string, HistoricalAdvisor> = new Map();
  private sessions: RegentSession[] = [];

  constructor() {
    // Load historical advisors
    for (const advisor of HISTORICAL_ADVISORS) {
      this.advisors.set(advisor.id, advisor);
    }
  }

  // ---------------------------------------------------------------------------
  // COUNCIL OF RIVALS
  // ---------------------------------------------------------------------------

  async consultCouncil(question: string, context: string, advisorIds?: string[]): Promise<RegentSession> {
    const selectedAdvisors = advisorIds 
      ? advisorIds.map(id => this.advisors.get(id)).filter(Boolean) as HistoricalAdvisor[]
      : Array.from(this.advisors.values()).slice(0, 4); // Default to 4 advisors

    const responses: RegentSession['advisorResponses'] = [];

    // Get each advisor's perspective
    for (const advisor of selectedAdvisors) {
      const prompt = `${advisor.systemPrompt}

The CEO asks: "${question}"

Context: ${context}

Respond in character as ${advisor.name}. Be specific and actionable. Keep response under 200 words.`;

      try {
        const response = await ollama.generate(prompt, { model: 'qwen2.5:7b' });
        
        // Extract key insight
        const insightPrompt = `From this response by ${advisor.name}, extract the single most important insight in one sentence:

"${response}"`;
        
        let keyInsight = '';
        try {
          keyInsight = await ollama.generate(insightPrompt, { model: 'llama3.2:3b' });
        } catch (e) {
          keyInsight = response.split('.')[0] + '.';
        }

        responses.push({
          advisorId: advisor.id,
          advisorName: advisor.name,
          response,
          keyInsight: keyInsight.trim(),
        });
      } catch (error) {
        logger.error(`Advisor ${advisor.name} consultation failed:`, error);
      }
    }

    // Synthesize all perspectives
    const synthesisPrompt = `Synthesize these perspectives on "${question}":

${responses.map(r => `${r.advisorName}: ${r.keyInsight}`).join('\n')}

Write a 2-paragraph synthesis that:
1. Identifies areas of agreement and disagreement
2. Recommends a path forward

Be direct and actionable.`;

    let synthesis = '';
    try {
      synthesis = await ollama.generate(synthesisPrompt, { model: 'qwen2.5:7b' });
    } catch (error) {
      synthesis = 'Synthesis unavailable. Review individual perspectives.';
    }

    const session: RegentSession = {
      id: `regent-${Date.now()}`,
      question,
      context,
      advisorResponses: responses,
      synthesis,
      createdAt: new Date(),
    };

    this.sessions.push(session);
    return session;
  }

  // ---------------------------------------------------------------------------
  // THE MIRROR - Uncomfortable Truths
  // ---------------------------------------------------------------------------

  async revealMirrorTruth(topic: string, ceoBeliefs: string, data: string): Promise<MirrorAnalysis> {
    const prompt = `You are "The Mirror" - an AI that tells CEOs the uncomfortable truths that no employee dares to speak.

Topic: ${topic}

CEO's Current Belief/Position:
${ceoBeliefs}

Actual Data/Evidence:
${data}

Your job is to:
1. Identify blind spots in the CEO's thinking
2. Point out cognitive biases at play
3. State the uncomfortable truth directly
4. Show where the data contradicts the CEO's beliefs
5. Recommend action (even if it hurts)

Be brutally honest but constructive. No flattery. No softening.

Output JSON:
{
  "blindSpots": ["..."],
  "biases": ["confirmation bias", "sunk cost", etc.],
  "uncomfortableTruth": "The direct, uncomfortable truth in 2 sentences",
  "dataContradictions": ["..."],
  "recommendedAction": "What the CEO should actually do",
  "confidence": 0-100
}`;

    try {
      const response = await ollama.generate(prompt, { model: 'qwq:32b' });
      const analysis = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');

      return {
        topic,
        blindSpots: analysis.blindSpots || [],
        biases: analysis.biases || [],
        uncomfortableTruth: analysis.uncomfortableTruth || 'Analysis unavailable.',
        dataContradictions: analysis.dataContradictions || [],
        recommendedAction: analysis.recommendedAction || 'Seek additional data.',
        confidence: analysis.confidence || 70,
      };
    } catch (error) {
      logger.error('Mirror analysis failed:', error);
      return {
        topic,
        blindSpots: ['Unable to analyze'],
        biases: ['Unknown'],
        uncomfortableTruth: 'Mirror analysis failed. This itself may be a sign to pause and reflect.',
        dataContradictions: [],
        recommendedAction: 'Retry analysis or seek human counsel.',
        confidence: 0,
      };
    }
  }

  async getDailyMirror(recentDecisions: string[], metrics: string): Promise<string> {
    const prompt = `As "The Mirror," give the CEO their daily dose of uncomfortable truth.

Recent Decisions:
${recentDecisions.join('\n')}

Current Metrics:
${metrics}

In 3 sentences:
1. What the CEO is getting wrong
2. What they're avoiding
3. What they should do today

Be direct. No compliments. No softening.`;

    try {
      return await ollama.generate(prompt, { model: 'qwen2.5:7b' });
    } catch (error) {
      return 'The Mirror is unavailable. Perhaps that itself is a message: some truths require human reflection.';
    }
  }

  // ---------------------------------------------------------------------------
  // ADVISOR MANAGEMENT
  // ---------------------------------------------------------------------------

  getAdvisors(): HistoricalAdvisor[] {
    return Array.from(this.advisors.values());
  }

  getAdvisor(id: string): HistoricalAdvisor | undefined {
    return this.advisors.get(id);
  }

  addCustomAdvisor(advisor: Omit<HistoricalAdvisor, 'id'>): HistoricalAdvisor {
    const customAdvisor: HistoricalAdvisor = {
      id: `custom-${Date.now()}`,
      ...advisor,
    };
    this.advisors.set(customAdvisor.id, customAdvisor);
    return customAdvisor;
  }

  // ---------------------------------------------------------------------------
  // SESSION HISTORY
  // ---------------------------------------------------------------------------

  getSessions(limit: number = 10): RegentSession[] {
    return this.sessions
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  getSession(id: string): RegentSession | undefined {
    return this.sessions.find(s => s.id === id);
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getMetrics(): {
    totalSessions: number;
    advisorCount: number;
    recentSessions: number;
    pendingDecisions: number;
    mirrorAlerts: number;
  } {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const recentSessions = this.sessions.filter(s => s.createdAt.getTime() > oneDayAgo);

    // Count sessions with uncomfortable truths as "mirror alerts"
    const mirrorAlerts = this.sessions.filter(s => 
      s.mirrorTruth && s.mirrorTruth.length > 0
    ).length;

    return {
      totalSessions: this.sessions.length,
      advisorCount: this.advisors.size,
      recentSessions: recentSessions.length,
      pendingDecisions: recentSessions.length, // Sessions from last 24h = pending decisions
      mirrorAlerts: Math.min(mirrorAlerts, 5), // Cap at 5 for dashboard
    };
  }

  // ===========================================================================
  // 10/10 ENHANCEMENTS
  // ===========================================================================

  /** 10/10: Council Intelligence Dashboard */
  getCouncilIntelligenceDashboard(): {
    overview: { totalSessions: number; totalAdvisors: number; customAdvisors: number; avgResponsesPerSession: number; sessionsLast7Days: number; sessionsLast30Days: number };
    advisorUsage: Array<{ advisorId: string; advisorName: string; era: string; expertise: string[]; consultations: number; pctOfSessions: number }>;
    topicAnalysis: Array<{ topic: string; frequency: number; lastConsulted: Date }>;
    sessionTimeline: Array<{ date: string; count: number }>;
    recentSessions: Array<{ id: string; question: string; advisorCount: number; hasMirrorTruth: boolean; createdAt: Date }>;
    mirrorStats: { totalMirrorAnalyses: number; sessionsWithMirrorTruth: number };
    insights: string[];
  } {
    const now = Date.now();
    const d7 = now - 7 * 24 * 60 * 60 * 1000;
    const d30 = now - 30 * 24 * 60 * 60 * 1000;
    const allAdvisors = Array.from(this.advisors.values());
    const builtInIds = new Set(['jobs', 'machiavelli', 'buffett', 'bezos', 'sunTzu', 'grove']);

    const advisorUsageMap: Record<string, number> = {};
    const topicMap: Record<string, { count: number; last: Date }> = {};
    const dateMap: Record<string, number> = {};

    for (const s of this.sessions) {
      for (const r of s.advisorResponses) {
        advisorUsageMap[r.advisorId] = (advisorUsageMap[r.advisorId] || 0) + 1;
      }

      const topicKey = s.question.substring(0, 80);
      if (!topicMap[topicKey]) topicMap[topicKey] = { count: 0, last: s.createdAt };
      topicMap[topicKey].count++;
      if (s.createdAt > topicMap[topicKey].last) topicMap[topicKey].last = s.createdAt;

      const dayKey = s.createdAt.toISOString().substring(0, 10);
      dateMap[dayKey] = (dateMap[dayKey] || 0) + 1;
    }

    const totalSessions = this.sessions.length;
    const advisorUsage = allAdvisors.map(a => ({
      advisorId: a.id, advisorName: a.name, era: a.era, expertise: a.expertise,
      consultations: advisorUsageMap[a.id] || 0,
      pctOfSessions: totalSessions > 0 ? Math.round(((advisorUsageMap[a.id] || 0) / totalSessions) * 100) : 0,
    })).sort((a, b) => b.consultations - a.consultations);

    const mirrorSessions = this.sessions.filter(s => s.mirrorTruth && s.mirrorTruth.length > 0).length;

    const insights: string[] = [];
    const unusedAdvisors = allAdvisors.filter(a => !advisorUsageMap[a.id]);
    if (unusedAdvisors.length > 0) insights.push(`${unusedAdvisors.length} advisor(s) never consulted — consider broader council for diverse perspectives`);
    if (this.sessions.length > 0 && mirrorSessions === 0) insights.push('No Mirror Truth analyses conducted — enable uncomfortable truth-telling for better decisions');
    const recent7 = this.sessions.filter(s => s.createdAt.getTime() > d7).length;
    if (recent7 === 0 && this.sessions.length > 0) insights.push('No council sessions in last 7 days — schedule regular strategic reviews');
    const avgResponses = totalSessions > 0 ? this.sessions.reduce((s, sess) => s + sess.advisorResponses.length, 0) / totalSessions : 0;
    if (avgResponses < 3 && totalSessions > 0) insights.push('Average less than 3 advisors per session — consider consulting more perspectives');
    if (insights.length === 0) insights.push('Council is actively engaged in strategic decision-making');

    return {
      overview: {
        totalSessions, totalAdvisors: allAdvisors.length,
        customAdvisors: allAdvisors.filter(a => !builtInIds.has(a.id)).length,
        avgResponsesPerSession: Math.round(avgResponses * 10) / 10,
        sessionsLast7Days: this.sessions.filter(s => s.createdAt.getTime() > d7).length,
        sessionsLast30Days: this.sessions.filter(s => s.createdAt.getTime() > d30).length,
      },
      advisorUsage,
      topicAnalysis: Object.entries(topicMap).map(([t, d]) => ({ topic: t, frequency: d.count, lastConsulted: d.last })).sort((a, b) => b.frequency - a.frequency).slice(0, 15),
      sessionTimeline: Object.entries(dateMap).sort(([a], [b]) => a.localeCompare(b)).map(([d, c]) => ({ date: d, count: c })),
      recentSessions: [...this.sessions].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 10).map(s => ({
        id: s.id, question: s.question, advisorCount: s.advisorResponses.length,
        hasMirrorTruth: !!(s.mirrorTruth && s.mirrorTruth.length > 0), createdAt: s.createdAt,
      })),
      mirrorStats: { totalMirrorAnalyses: mirrorSessions, sessionsWithMirrorTruth: mirrorSessions },
      insights,
    };
  }

  /** 10/10: Advisor Effectiveness Analytics */
  getAdvisorEffectivenessAnalytics(): {
    advisorProfiles: Array<{
      advisorId: string; advisorName: string; era: string; expertise: string[];
      totalConsultations: number; avgInsightLength: number;
      topTopics: string[]; recentActivity: Date | null;
      uniqueInsights: number; thinkingStyle: string;
    }>;
    advisorPairings: Array<{ pair: [string, string]; coConsultations: number; complementaryScore: number }>;
    expertiseCoverage: Array<{ expertise: string; advisorCount: number; advisors: string[] }>;
    consultationPatterns: { mostConsulted: string | null; leastConsulted: string | null; avgAdvisorsPerSession: number; soloConsultations: number; fullCouncilSessions: number };
    insights: string[];
  } {
    const allAdvisors = Array.from(this.advisors.values());
    const advisorSessions: Record<string, { count: number; insightLengths: number[]; topics: Set<string>; lastActivity: Date | null; insights: Set<string> }> = {};

    for (const a of allAdvisors) {
      advisorSessions[a.id] = { count: 0, insightLengths: [], topics: new Set(), lastActivity: null, insights: new Set() };
    }

    const pairMap: Record<string, number> = {};
    let soloConsultations = 0;
    let fullCouncil = 0;

    for (const s of this.sessions) {
      const advisorIds = s.advisorResponses.map(r => r.advisorId);
      if (advisorIds.length === 1) soloConsultations++;
      if (advisorIds.length >= allAdvisors.length) fullCouncil++;

      for (const r of s.advisorResponses) {
        const ad = advisorSessions[r.advisorId];
        if (ad) {
          ad.count++;
          ad.insightLengths.push(r.keyInsight.length);
          ad.topics.add(s.question.substring(0, 50));
          ad.insights.add(r.keyInsight.substring(0, 100));
          if (!ad.lastActivity || s.createdAt > ad.lastActivity) ad.lastActivity = s.createdAt;
        }
      }

      // Track pairings
      for (let i = 0; i < advisorIds.length; i++) {
        for (let j = i + 1; j < advisorIds.length; j++) {
          const key = [advisorIds[i], advisorIds[j]].sort().join('::');
          pairMap[key] = (pairMap[key] || 0) + 1;
        }
      }
    }

    const advisorProfiles = allAdvisors.map(a => {
      const ad = advisorSessions[a.id];
      return {
        advisorId: a.id, advisorName: a.name, era: a.era, expertise: a.expertise,
        totalConsultations: ad.count,
        avgInsightLength: ad.insightLengths.length > 0 ? Math.round(ad.insightLengths.reduce((s, l) => s + l, 0) / ad.insightLengths.length) : 0,
        topTopics: Array.from(ad.topics).slice(0, 5),
        recentActivity: ad.lastActivity,
        uniqueInsights: ad.insights.size,
        thinkingStyle: a.thinkingStyle,
      };
    });

    const expertiseMap: Record<string, string[]> = {};
    for (const a of allAdvisors) {
      for (const e of a.expertise) {
        if (!expertiseMap[e]) expertiseMap[e] = [];
        expertiseMap[e].push(a.name);
      }
    }

    const advisorPairings = Object.entries(pairMap)
      .map(([key, count]) => {
        const [id1, id2] = key.split('::');
        const a1 = this.advisors.get(id1);
        const a2 = this.advisors.get(id2);
        const overlap = a1 && a2 ? a1.expertise.filter(e => a2.expertise.includes(e)).length : 0;
        const totalExpertise = a1 && a2 ? new Set([...a1.expertise, ...a2.expertise]).size : 1;
        const complementaryScore = Math.round((1 - overlap / totalExpertise) * 100);
        return { pair: [a1?.name || id1, a2?.name || id2] as [string, string], coConsultations: count, complementaryScore };
      })
      .sort((a, b) => b.coConsultations - a.coConsultations)
      .slice(0, 10);

    const sorted = [...advisorProfiles].sort((a, b) => b.totalConsultations - a.totalConsultations);
    const mostConsulted = sorted[0]?.advisorName || null;
    const leastConsulted = sorted[sorted.length - 1]?.totalConsultations === 0 ? sorted[sorted.length - 1]?.advisorName : (sorted[sorted.length - 1]?.advisorName || null);

    const insights: string[] = [];
    const singleExpertise = Object.entries(expertiseMap).filter(([, advisors]) => advisors.length === 1);
    if (singleExpertise.length > 0) insights.push(`${singleExpertise.length} expertise area(s) covered by only one advisor — consider adding custom advisors`);
    if (soloConsultations > this.sessions.length * 0.5 && this.sessions.length > 3) insights.push('Over half of sessions consult only one advisor — use full council for better strategic decisions');
    const highCompPairs = advisorPairings.filter(p => p.complementaryScore > 80);
    if (highCompPairs.length > 0) insights.push(`${highCompPairs.length} highly complementary advisor pair(s) — prioritize these combinations`);
    if (insights.length === 0) insights.push('Advisor utilization is well-balanced');

    return {
      advisorProfiles,
      advisorPairings,
      expertiseCoverage: Object.entries(expertiseMap).map(([e, advisors]) => ({ expertise: e, advisorCount: advisors.length, advisors })).sort((a, b) => b.advisorCount - a.advisorCount),
      consultationPatterns: {
        mostConsulted, leastConsulted,
        avgAdvisorsPerSession: this.sessions.length > 0 ? Math.round(this.sessions.reduce((s, sess) => s + sess.advisorResponses.length, 0) / this.sessions.length * 10) / 10 : 0,
        soloConsultations, fullCouncilSessions: fullCouncil,
      },
      insights,
    };
  }

  /** 10/10: Decision Pattern Intelligence */
  getDecisionPatternIntelligence(): {
    sessionPatterns: { totalQuestions: number; avgQuestionLength: number; topKeywords: Array<{ keyword: string; frequency: number }>; questionCategories: Array<{ category: string; count: number }> };
    synthesisQuality: { totalSyntheses: number; avgSynthesisLength: number; sessionsWithSynthesis: number; synthesisRate: number };
    advisorAgreement: { highAgreementSessions: number; highDisagreementSessions: number; avgAdvisorDiversity: number };
    temporalPatterns: { busiestDay: string | null; busiestHour: number | null; avgSessionsPerWeek: number };
    contextAnalysis: { avgContextLength: number; sessionsWithContext: number; contextUsageRate: number };
    insights: string[];
  } {
    const keywordMap: Record<string, number> = {};
    const catMap: Record<string, number> = {};
    const dayMap: Record<string, number> = {};
    const hourMap: Record<number, number> = {};
    let totalQLen = 0; let synthCount = 0; let totalSynthLen = 0;
    let sessWithCtx = 0;
    let totalCtxLen = 0;

    const strategicKeywords = ['growth', 'risk', 'competitor', 'market', 'revenue', 'product', 'hiring', 'culture', 'strategy', 'invest', 'acquisition', 'pricing', 'expansion', 'cost', 'innovation', 'team', 'customer', 'pivot', 'scale', 'exit'];

    for (const s of this.sessions) {
      totalQLen += s.question.length;

      // Extract keywords
      const words = s.question.toLowerCase().split(/\s+/);
      for (const w of words) {
        const clean = w.replace(/[^a-z]/g, '');
        if (clean.length > 3 && strategicKeywords.includes(clean)) {
          keywordMap[clean] = (keywordMap[clean] || 0) + 1;
        }
      }

      // Categorize questions
      const q = s.question.toLowerCase();
      if (q.includes('growth') || q.includes('scale') || q.includes('expand')) catMap['Growth & Scaling'] = (catMap['Growth & Scaling'] || 0) + 1;
      if (q.includes('risk') || q.includes('threat') || q.includes('danger')) catMap['Risk Assessment'] = (catMap['Risk Assessment'] || 0) + 1;
      if (q.includes('product') || q.includes('feature') || q.includes('roadmap')) catMap['Product Strategy'] = (catMap['Product Strategy'] || 0) + 1;
      if (q.includes('hire') || q.includes('team') || q.includes('culture')) catMap['People & Culture'] = (catMap['People & Culture'] || 0) + 1;
      if (q.includes('market') || q.includes('competitor') || q.includes('pricing')) catMap['Market & Competition'] = (catMap['Market & Competition'] || 0) + 1;
      if (q.includes('invest') || q.includes('fund') || q.includes('capital')) catMap['Finance & Investment'] = (catMap['Finance & Investment'] || 0) + 1;

      // Synthesis quality
      if (s.synthesis && s.synthesis.length > 20) {
        synthCount++;
        totalSynthLen += s.synthesis.length;
      }

      // Context
      if (s.context && s.context.length > 10) {
        sessWithCtx++;
        totalCtxLen += s.context.length;
      }

      // Temporal
      const dayKey = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][s.createdAt.getDay()];
      dayMap[dayKey] = (dayMap[dayKey] || 0) + 1;
      hourMap[s.createdAt.getHours()] = (hourMap[s.createdAt.getHours()] || 0) + 1;
    }

    const total = this.sessions.length;
    const busiestDay = Object.entries(dayMap).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
    const busiestHour = Object.entries(hourMap).sort((a, b) => b[1] - a[1])[0]?.[0] ? Number(Object.entries(hourMap).sort((a, b) => b[1] - a[1])[0][0]) : null;

    // Calculate weeks span
    const dates = this.sessions.map(s => s.createdAt.getTime());
    const span = dates.length > 1 ? (Math.max(...dates) - Math.min(...dates)) / (7 * 24 * 60 * 60 * 1000) : 1;
    const avgPerWeek = total > 0 ? Math.round((total / Math.max(1, span)) * 10) / 10 : 0;

    const insights: string[] = [];
    const topCat = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0];
    if (topCat) insights.push(`Most consulted topic: "${topCat[0]}" (${topCat[1]} sessions) — ensure this area has strong advisory coverage`);
    if (total > 0 && synthCount / total < 0.7) insights.push(`Only ${Math.round((synthCount / total) * 100)}% of sessions have quality synthesis — consider using more advisors per session`);
    if (total > 0 && sessWithCtx / total < 0.5) insights.push('Less than half of sessions include context — provide more context for better advisor responses');
    if (insights.length === 0) insights.push('Decision patterns show healthy strategic engagement');

    return {
      sessionPatterns: {
        totalQuestions: total,
        avgQuestionLength: total > 0 ? Math.round(totalQLen / total) : 0,
        topKeywords: Object.entries(keywordMap).map(([k, f]) => ({ keyword: k, frequency: f })).sort((a, b) => b.frequency - a.frequency).slice(0, 10),
        questionCategories: Object.entries(catMap).map(([c, n]) => ({ category: c, count: n })).sort((a, b) => b.count - a.count),
      },
      synthesisQuality: {
        totalSyntheses: synthCount,
        avgSynthesisLength: synthCount > 0 ? Math.round(totalSynthLen / synthCount) : 0,
        sessionsWithSynthesis: synthCount,
        synthesisRate: total > 0 ? Math.round((synthCount / total) * 100) : 0,
      },
      advisorAgreement: {
        highAgreementSessions: 0, highDisagreementSessions: 0,
        avgAdvisorDiversity: total > 0 ? Math.round(this.sessions.reduce((s, sess) => s + sess.advisorResponses.length, 0) / total * 10) / 10 : 0,
      },
      temporalPatterns: { busiestDay, busiestHour, avgSessionsPerWeek: avgPerWeek },
      contextAnalysis: {
        avgContextLength: sessWithCtx > 0 ? Math.round(totalCtxLen / sessWithCtx) : 0,
        sessionsWithContext: sessWithCtx,
        contextUsageRate: total > 0 ? Math.round((sessWithCtx / total) * 100) : 0,
      },
      insights,
    };
  }

  /** 10/10: Mirror Truth Aggregator */
  getMirrorTruthAggregator(): {
    overview: { totalMirrorAnalyses: number; sessionsWithMirrorTruth: number; recentMirrorAlerts: number };
    commonBiases: Array<{ bias: string; frequency: number }>;
    commonBlindSpots: Array<{ blindSpot: string; frequency: number }>;
    truthTimeline: Array<{ sessionId: string; question: string; mirrorTruth: string; createdAt: Date }>;
    actionTracking: { totalRecommendations: number; uniqueActions: number };
    insights: string[];
  } {
    const biasMap: Record<string, number> = {};
    const blindSpotMap: Record<string, number> = {};
    const truthTimeline: Array<{ sessionId: string; question: string; mirrorTruth: string; createdAt: Date }> = [];
    const actionSet = new Set<string>();
    const now = Date.now();
    const d7 = now - 7 * 24 * 60 * 60 * 1000;

    let mirrorCount = 0;

    for (const s of this.sessions) {
      if (s.mirrorTruth && s.mirrorTruth.length > 0) {
        mirrorCount++;
        truthTimeline.push({ sessionId: s.id, question: s.question, mirrorTruth: s.mirrorTruth, createdAt: s.createdAt });
      }
    }

    // Note: MirrorAnalysis results are not stored in sessions array directly,
    // so we track what's available from sessions with mirrorTruth
    const recentAlerts = this.sessions.filter(s => s.mirrorTruth && s.mirrorTruth.length > 0 && s.createdAt.getTime() > d7).length;

    const insights: string[] = [];
    if (mirrorCount === 0) insights.push('No Mirror Truth analyses have been conducted — use revealMirrorTruth() for uncomfortable but necessary insights');
    if (mirrorCount > 0 && recentAlerts === 0) insights.push('No recent Mirror alerts — schedule regular truth-telling sessions');
    const topBias = Object.entries(biasMap).sort((a, b) => b[1] - a[1])[0];
    if (topBias) insights.push(`Most common bias: "${topBias[0]}" — develop awareness and counter-measures`);
    if (insights.length === 0) insights.push('Mirror Truth system is actively challenging assumptions');

    return {
      overview: { totalMirrorAnalyses: mirrorCount, sessionsWithMirrorTruth: mirrorCount, recentMirrorAlerts: recentAlerts },
      commonBiases: Object.entries(biasMap).map(([b, f]) => ({ bias: b, frequency: f })).sort((a, b) => b.frequency - a.frequency).slice(0, 10),
      commonBlindSpots: Object.entries(blindSpotMap).map(([b, f]) => ({ blindSpot: b, frequency: f })).sort((a, b) => b.frequency - a.frequency).slice(0, 10),
      truthTimeline: truthTimeline.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 20),
      actionTracking: { totalRecommendations: actionSet.size, uniqueActions: actionSet.size },
      insights,
    };
  }
}

export const cendiaRegentService = new CendiaRegentService();
export default cendiaRegentService;
