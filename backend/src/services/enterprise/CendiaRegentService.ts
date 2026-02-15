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
}

export const cendiaRegentService = new CendiaRegentService();
export default cendiaRegentService;
