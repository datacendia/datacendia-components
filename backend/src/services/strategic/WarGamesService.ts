// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// WARGAMES™ - CRISIS SIMULATION & OPERATOR CERTIFICATION
// Training Humans to Wield the System
// "The Super-Soldier Factory" - Turn analysts into strategists
// =============================================================================

import { PrismaClient } from '@prisma/client';
import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// =============================================================================
// TYPES
// =============================================================================

export interface Scenario {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'nightmare';
  category: ScenarioCategory;
  objectives: string[];
  timeLimit: number; // seconds
  events: ScenarioEvent[];
  scoringCriteria: ScoringCriterion[];
  prerequisites: string[];
}

export type ScenarioCategory = 
  | 'cyber_attack' | 'market_crash' | 'regulatory_inquiry' | 'supply_chain'
  | 'reputation_crisis' | 'insider_threat' | 'natural_disaster' | 'merger_crisis'
  | 'data_breach' | 'leadership_vacuum' | 'multi_vector';

export interface ScenarioEvent {
  id: string;
  triggerTime: number; // seconds from start
  triggerCondition?: string;
  type: 'information' | 'escalation' | 'decision_point' | 'curveball';
  title: string;
  description: string;
  options?: { id: string; text: string; consequences: string }[];
  adversarialMove?: string;
}

export interface ScoringCriterion {
  id: string;
  name: string;
  weight: number;
  evaluator: 'time' | 'decision_quality' | 'resource_efficiency' | 'stakeholder_impact' | 'ai_assessment';
}

export interface Simulation {
  id: string;
  organizationId: string;
  operatorId: string;
  scenarioId: string;
  status: 'preparing' | 'running' | 'paused' | 'completed' | 'failed';
  currentTime: number;
  decisions: SimulationDecision[];
  events: { eventId: string; occurredAt: number; response?: string }[];
  score: SimulationScore | null;
  startedAt?: Date;
  completedAt?: Date;
}

export interface SimulationDecision {
  id: string;
  eventId: string;
  optionId: string;
  reasoning: string;
  timestamp: number;
  responseTimeMs: number;
  aiAssessment?: {
    quality: number;
    feedback: string;
    alternatives: string[];
  };
}

export interface SimulationScore {
  overall: number;
  breakdown: { criterion: string; score: number; maxScore: number; feedback: string }[];
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  certificationEarned: boolean;
  strengths: string[];
  improvements: string[];
}

export interface OperatorCertification {
  id: string;
  operatorId: string;
  organizationId: string;
  level: CertificationLevel;
  scenariosCompleted: string[];
  totalScore: number;
  avgResponseTime: number;
  certifiedAt: Date;
  expiresAt: Date;
  badges: string[];
}

export type CertificationLevel = 
  | 'trainee' | 'operator' | 'senior_operator' | 'crisis_commander' | 'council_certified';

// =============================================================================
// WARGAMES SERVICE
// =============================================================================

class WarGamesService {
  private scenarios: Map<string, Scenario> = new Map();
  private simulations: Map<string, Simulation> = new Map();
  private certifications: Map<string, OperatorCertification> = new Map();

  constructor() {
    this.initializeScenarios();
  }

  // ---------------------------------------------------------------------------
  // SCENARIO LIBRARY
  // ---------------------------------------------------------------------------

  private initializeScenarios(): void {
    const scenarios: Scenario[] = [
      {
        id: 'cyber-001',
        name: 'Ransomware Attack',
        description: 'A sophisticated ransomware attack has encrypted critical systems. Time is running out.',
        difficulty: 'intermediate',
        category: 'cyber_attack',
        objectives: ['Contain the attack', 'Assess damage', 'Decide on ransom', 'Restore operations'],
        timeLimit: 1800,
        events: [
          { id: 'e1', triggerTime: 0, type: 'information', title: 'Initial Alert', description: 'SOC reports multiple systems showing encryption activity. 15% of servers affected.' },
          { id: 'e2', triggerTime: 120, type: 'escalation', title: 'Spread Detected', description: 'Ransomware spreading to backup systems. Now 35% affected.' },
          { id: 'e3', triggerTime: 300, type: 'decision_point', title: 'Ransom Demand', description: 'Attackers demand $5M in Bitcoin. 48-hour deadline.', options: [
            { id: 'pay', text: 'Pay the ransom', consequences: 'Fast recovery but funds criminals' },
            { id: 'refuse', text: 'Refuse and restore from backups', consequences: 'Longer recovery, potential data loss' },
            { id: 'negotiate', text: 'Engage negotiator', consequences: 'Buy time but uncertain outcome' }
          ]},
          { id: 'e4', triggerTime: 600, type: 'curveball', title: 'Media Leak', description: 'News outlet reports the attack. Stock dropping 8%.' },
          { id: 'e5', triggerTime: 900, type: 'decision_point', title: 'Board Pressure', description: 'Board demands immediate resolution. What do you tell them?', options: [
            { id: 'transparent', text: 'Full transparency on situation', consequences: 'Trust but panic risk' },
            { id: 'measured', text: 'Measured update with recovery plan', consequences: 'Balanced approach' },
            { id: 'minimize', text: 'Minimize severity', consequences: 'Short-term calm, long-term trust issues' }
          ]}
        ],
        scoringCriteria: [
          { id: 'time', name: 'Response Time', weight: 20, evaluator: 'time' },
          { id: 'quality', name: 'Decision Quality', weight: 40, evaluator: 'ai_assessment' },
          { id: 'stakeholder', name: 'Stakeholder Management', weight: 25, evaluator: 'stakeholder_impact' },
          { id: 'resource', name: 'Resource Efficiency', weight: 15, evaluator: 'resource_efficiency' }
        ],
        prerequisites: []
      },
      {
        id: 'market-001',
        name: 'Flash Crash Response',
        description: 'Markets are in freefall. Your portfolio is down 20% in 30 minutes. What do you do?',
        difficulty: 'advanced',
        category: 'market_crash',
        objectives: ['Assess exposure', 'Protect capital', 'Identify opportunities', 'Communicate to stakeholders'],
        timeLimit: 1200,
        events: [
          { id: 'e1', triggerTime: 0, type: 'information', title: 'Market Alert', description: 'S&P 500 down 15% in 20 minutes. Circuit breakers triggered.' },
          { id: 'e2', triggerTime: 60, type: 'decision_point', title: 'Position Review', description: 'Your equity positions are down $50M. Margin call imminent.', options: [
            { id: 'liquidate', text: 'Liquidate to meet margin', consequences: 'Lock in losses' },
            { id: 'add_capital', text: 'Add capital to hold', consequences: 'Risk more capital' },
            { id: 'hedge', text: 'Buy puts to hedge', consequences: 'Expensive but protective' }
          ]},
          { id: 'e3', triggerTime: 180, type: 'curveball', title: 'Counterparty Risk', description: 'Major counterparty rumored to be insolvent.' },
          { id: 'e4', triggerTime: 300, type: 'decision_point', title: 'Opportunity Knock', description: 'Quality stocks at 40% discount. Buy the dip?', options: [
            { id: 'aggressive', text: 'Aggressive buying', consequences: 'High risk, high reward' },
            { id: 'selective', text: 'Selective quality picks', consequences: 'Balanced approach' },
            { id: 'wait', text: 'Wait for stabilization', consequences: 'May miss bottom' }
          ]}
        ],
        scoringCriteria: [
          { id: 'time', name: 'Response Time', weight: 30, evaluator: 'time' },
          { id: 'quality', name: 'Decision Quality', weight: 35, evaluator: 'ai_assessment' },
          { id: 'resource', name: 'Capital Preservation', weight: 35, evaluator: 'resource_efficiency' }
        ],
        prerequisites: ['cyber-001']
      },
      {
        id: 'multi-001',
        name: 'Perfect Storm',
        description: 'Simultaneous cyber attack, market crash, and regulatory inquiry. The ultimate test.',
        difficulty: 'nightmare',
        category: 'multi_vector',
        objectives: ['Triage threats', 'Coordinate response', 'Maintain operations', 'Protect reputation'],
        timeLimit: 2400,
        events: [
          { id: 'e1', triggerTime: 0, type: 'information', title: 'Triple Threat', description: 'Three simultaneous crises detected: ransomware, market crash, SEC inquiry.' },
          { id: 'e2', triggerTime: 60, type: 'decision_point', title: 'Priority Call', description: 'Which crisis do you address first?', options: [
            { id: 'cyber', text: 'Cyber attack (operational)', consequences: 'Systems first' },
            { id: 'market', text: 'Market exposure (financial)', consequences: 'Capital first' },
            { id: 'regulatory', text: 'SEC inquiry (legal)', consequences: 'Compliance first' }
          ]},
          { id: 'e3', triggerTime: 180, type: 'escalation', title: 'Resource Conflict', description: 'Legal team needed for both SEC and ransomware. Who gets them?' },
          { id: 'e4', triggerTime: 360, type: 'curveball', title: 'Whistleblower', description: 'Anonymous tip suggests insider involvement in all three events.' },
          { id: 'e5', triggerTime: 600, type: 'decision_point', title: 'CEO Incapacitated', description: 'CEO hospitalized from stress. You are now acting CEO.', options: [
            { id: 'announce', text: 'Public announcement', consequences: 'Transparency' },
            { id: 'quiet', text: 'Quiet transition', consequences: 'Stability' },
            { id: 'board', text: 'Emergency board meeting', consequences: 'Governance' }
          ]},
          { id: 'e6', triggerTime: 900, type: 'curveball' as const, title: 'Adversary Escalation', description: 'Attackers release stolen data. Regulators expand inquiry.', adversarialMove: 'Double pressure on all fronts' }
        ],
        scoringCriteria: [
          { id: 'time', name: 'Response Time', weight: 15, evaluator: 'time' },
          { id: 'quality', name: 'Decision Quality', weight: 35, evaluator: 'ai_assessment' },
          { id: 'stakeholder', name: 'Stakeholder Management', weight: 25, evaluator: 'stakeholder_impact' },
          { id: 'resource', name: 'Resource Allocation', weight: 25, evaluator: 'resource_efficiency' }
        ],
        prerequisites: ['cyber-001', 'market-001']
      }
    ];

    for (const scenario of scenarios) {
      this.scenarios.set(scenario.id, scenario);
    }
  }

  // ---------------------------------------------------------------------------
  // SIMULATION MANAGEMENT
  // ---------------------------------------------------------------------------

  async startSimulation(
    organizationId: string,
    operatorId: string,
    scenarioId: string
  ): Promise<Simulation> {
    const scenario = this.scenarios.get(scenarioId);
    if (!scenario) throw new Error('Scenario not found');

    // Check prerequisites
    const cert = this.getOperatorCertification(operatorId);
    for (const prereq of scenario.prerequisites) {
      if (!cert?.scenariosCompleted.includes(prereq)) {
        throw new Error(`Prerequisite scenario ${prereq} not completed`);
      }
    }

    const simulationId = uuidv4();
    const simulation: Simulation = {
      id: simulationId,
      organizationId,
      operatorId,
      scenarioId,
      status: 'preparing',
      currentTime: 0,
      decisions: [],
      events: [],
      score: null,
      startedAt: new Date()
    };

    this.simulations.set(simulationId, simulation);

    // Log simulation start
    await prisma.audit_logs.create({
      data: {
        id: uuidv4(),
        organization_id: organizationId,
        user_id: operatorId,
        action: 'WARGAMES_SIMULATION_STARTED',
        resource_type: 'simulation',
        resource_id: simulationId,
        details: {
          scenarioId,
          scenarioName: scenario.name,
          difficulty: scenario.difficulty
        } as any
      }
    });

    simulation.status = 'running';
    return simulation;
  }

  async advanceSimulation(simulationId: string, deltaSeconds: number): Promise<{
    events: ScenarioEvent[];
    simulation: Simulation;
  }> {
    const simulation = this.simulations.get(simulationId);
    if (!simulation) throw new Error('Simulation not found');
    if (simulation.status !== 'running') throw new Error('Simulation not running');

    const scenario = this.scenarios.get(simulation.scenarioId);
    if (!scenario) throw new Error('Scenario not found');

    const previousTime = simulation.currentTime;
    simulation.currentTime += deltaSeconds;

    // Find triggered events
    const triggeredEvents = scenario.events.filter(e => 
      e.triggerTime > previousTime && e.triggerTime <= simulation.currentTime
    );

    for (const event of triggeredEvents) {
      simulation.events.push({
        eventId: event.id,
        occurredAt: simulation.currentTime
      });
    }

    // Check if simulation complete
    if (simulation.currentTime >= scenario.timeLimit) {
      await this.completeSimulation(simulationId);
    }

    return { events: triggeredEvents, simulation };
  }

  async submitDecision(
    simulationId: string,
    eventId: string,
    optionId: string,
    reasoning: string
  ): Promise<SimulationDecision> {
    const simulation = this.simulations.get(simulationId);
    if (!simulation) throw new Error('Simulation not found');

    const scenario = this.scenarios.get(simulation.scenarioId);
    const event = scenario?.events.find(e => e.id === eventId);
    if (!event?.options) throw new Error('Event not found or has no options');

    const eventRecord = simulation.events.find(e => e.eventId === eventId);
    const responseTimeMs = eventRecord 
      ? (simulation.currentTime - eventRecord.occurredAt) * 1000 
      : 0;

    // AI assessment of decision
    const aiAssessment = await this.assessDecision(event, optionId, reasoning, scenario!);

    const decision: SimulationDecision = {
      id: uuidv4(),
      eventId,
      optionId,
      reasoning,
      timestamp: simulation.currentTime,
      responseTimeMs,
      aiAssessment
    };

    simulation.decisions.push(decision);

    return decision;
  }

  private async assessDecision(
    event: ScenarioEvent,
    optionId: string,
    reasoning: string,
    scenario: Scenario
  ): Promise<SimulationDecision['aiAssessment']> {
    const selectedOption = event.options?.find(o => o.id === optionId);
    const otherOptions = event.options?.filter(o => o.id !== optionId) || [];

    const prompt = `Assess this crisis decision:

SCENARIO: ${scenario.name}
EVENT: ${event.title}
DESCRIPTION: ${event.description}

DECISION MADE: ${selectedOption?.text}
REASONING: ${reasoning}

OTHER OPTIONS:
${otherOptions.map(o => `- ${o.text}: ${o.consequences}`).join('\n')}

Evaluate the decision quality (0-100) and provide feedback.
Output JSON:
{
  "quality": 0-100,
  "feedback": "Assessment of the decision",
  "alternatives": ["What else could have been considered"]
}`;

    try {
      const response = await ollama.generate(prompt, { model: 'qwen2.5:7b' });
      const parsed = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');
      return {
        quality: parsed.quality || 50,
        feedback: parsed.feedback || 'Assessment unavailable',
        alternatives: parsed.alternatives || []
      };
    } catch {
      return { quality: 50, feedback: 'AI assessment unavailable', alternatives: [] };
    }
  }

  async completeSimulation(simulationId: string): Promise<SimulationScore> {
    const simulation = this.simulations.get(simulationId);
    if (!simulation) throw new Error('Simulation not found');

    const scenario = this.scenarios.get(simulation.scenarioId);
    if (!scenario) throw new Error('Scenario not found');

    simulation.status = 'completed';
    simulation.completedAt = new Date();

    // Calculate score
    const score = await this.calculateScore(simulation, scenario);
    simulation.score = score;

    // Update certification
    await this.updateCertification(simulation, score);

    // Log completion
    await prisma.audit_logs.create({
      data: {
        id: uuidv4(),
        organization_id: simulation.organizationId,
        user_id: simulation.operatorId,
        action: 'WARGAMES_SIMULATION_COMPLETED',
        resource_type: 'simulation',
        resource_id: simulationId,
        details: {
          scenarioId: simulation.scenarioId,
          score: score.overall,
          grade: score.grade,
          certificationEarned: score.certificationEarned
        } as any
      }
    });

    return score;
  }

  private async calculateScore(simulation: Simulation, scenario: Scenario): Promise<SimulationScore> {
    const breakdown: SimulationScore['breakdown'] = [];
    let totalWeightedScore = 0;
    let totalWeight = 0;

    for (const criterion of scenario.scoringCriteria) {
      let score = 0;
      let feedback = '';

      switch (criterion.evaluator) {
        case 'time':
          const avgResponseTime = simulation.decisions.length > 0
            ? simulation.decisions.reduce((sum, d) => sum + d.responseTimeMs, 0) / simulation.decisions.length
            : 60000;
          score = Math.max(0, 100 - (avgResponseTime / 1000)); // Faster = better
          feedback = `Average response time: ${(avgResponseTime / 1000).toFixed(1)}s`;
          break;

        case 'ai_assessment':
          const avgQuality = simulation.decisions.length > 0
            ? simulation.decisions.reduce((sum, d) => sum + (d.aiAssessment?.quality || 50), 0) / simulation.decisions.length
            : 50;
          score = avgQuality;
          feedback = `AI-assessed decision quality: ${avgQuality.toFixed(0)}%`;
          break;

        case 'stakeholder_impact':
          // Assess based on communication decisions
          const commDecisions = simulation.decisions.filter(d => 
            d.optionId.includes('transparent') || d.optionId.includes('measured')
          );
          score = (commDecisions.length / Math.max(1, simulation.decisions.length)) * 100;
          feedback = `Stakeholder-conscious decisions: ${commDecisions.length}`;
          break;

        case 'resource_efficiency':
          // Assess based on resource-aware decisions
          score = 70 + Math.random() * 30; // Simplified
          feedback = 'Resource allocation assessed';
          break;
      }

      breakdown.push({
        criterion: criterion.name,
        score,
        maxScore: 100,
        feedback
      });

      totalWeightedScore += score * criterion.weight;
      totalWeight += criterion.weight;
    }

    const overall = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
    const grade = this.calculateGrade(overall);

    // Generate AI feedback
    const { strengths, improvements } = await this.generateFeedback(simulation, scenario, overall);

    return {
      overall,
      breakdown,
      grade,
      certificationEarned: overall >= 70 && grade !== 'F' && grade !== 'D',
      strengths,
      improvements
    };
  }

  private calculateGrade(score: number): SimulationScore['grade'] {
    if (score >= 95) return 'S';
    if (score >= 85) return 'A';
    if (score >= 75) return 'B';
    if (score >= 65) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  }

  private async generateFeedback(
    simulation: Simulation,
    scenario: Scenario,
    overallScore: number
  ): Promise<{ strengths: string[]; improvements: string[] }> {
    const prompt = `Generate feedback for this crisis simulation performance:

SCENARIO: ${scenario.name} (${scenario.difficulty})
OVERALL SCORE: ${overallScore.toFixed(0)}%
DECISIONS MADE: ${simulation.decisions.length}
TIME TAKEN: ${simulation.currentTime}s of ${scenario.timeLimit}s

DECISION SUMMARY:
${simulation.decisions.map(d => `- ${d.optionId}: ${d.reasoning.substring(0, 100)}`).join('\n')}

Output JSON:
{
  "strengths": ["strength1", "strength2"],
  "improvements": ["area1", "area2"]
}`;

    try {
      const response = await ollama.generate(prompt, { model: 'llama3.2:3b' });
      const parsed = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');
      return {
        strengths: parsed.strengths || ['Completed simulation'],
        improvements: parsed.improvements || ['Continue practicing']
      };
    } catch {
      return {
        strengths: ['Completed the simulation'],
        improvements: ['Review decision-making speed', 'Consider alternative approaches']
      };
    }
  }

  // ---------------------------------------------------------------------------
  // CERTIFICATION
  // ---------------------------------------------------------------------------

  private async updateCertification(simulation: Simulation, score: SimulationScore): Promise<void> {
    let cert = this.certifications.get(simulation.operatorId);

    if (!cert) {
      cert = {
        id: uuidv4(),
        operatorId: simulation.operatorId,
        organizationId: simulation.organizationId,
        level: 'trainee',
        scenariosCompleted: [],
        totalScore: 0,
        avgResponseTime: 0,
        certifiedAt: new Date(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        badges: []
      };
    }

    if (score.certificationEarned && !cert.scenariosCompleted.includes(simulation.scenarioId)) {
      cert.scenariosCompleted.push(simulation.scenarioId);
      cert.totalScore = (cert.totalScore * (cert.scenariosCompleted.length - 1) + score.overall) / cert.scenariosCompleted.length;

      // Update level based on completions
      const completions = cert.scenariosCompleted.length;
      if (completions >= 10 && cert.totalScore >= 85) {
        cert.level = 'council_certified';
        cert.badges.push('council_certified');
      } else if (completions >= 7 && cert.totalScore >= 80) {
        cert.level = 'crisis_commander';
      } else if (completions >= 4 && cert.totalScore >= 75) {
        cert.level = 'senior_operator';
      } else if (completions >= 2 && cert.totalScore >= 70) {
        cert.level = 'operator';
      }

      // Award badges
      if (score.grade === 'S' && !cert.badges.includes('perfect_score')) {
        cert.badges.push('perfect_score');
      }
      if (simulation.decisions.every(d => (d.aiAssessment?.quality || 0) >= 80) && !cert.badges.includes('consistent_excellence')) {
        cert.badges.push('consistent_excellence');
      }
    }

    this.certifications.set(simulation.operatorId, cert);
  }

  getOperatorCertification(operatorId: string): OperatorCertification | undefined {
    return this.certifications.get(operatorId);
  }

  // ---------------------------------------------------------------------------
  // QUERY METHODS
  // ---------------------------------------------------------------------------

  getScenario(scenarioId: string): Scenario | undefined {
    return this.scenarios.get(scenarioId);
  }

  getAllScenarios(): Scenario[] {
    return [...this.scenarios.values()];
  }

  getSimulation(simulationId: string): Simulation | undefined {
    return this.simulations.get(simulationId);
  }

  async getOperatorHistory(operatorId: string): Promise<any[]> {
    return prisma.audit_logs.findMany({
      where: {
        user_id: operatorId,
        action: { startsWith: 'WARGAMES_' }
      },
      orderBy: { created_at: 'desc' },
      take: 50
    });
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getMetrics(): {
    totalScenarios: number;
    totalSimulations: number;
    completedSimulations: number;
    avgScore: number;
    certifiedOperators: number;
  } {
    const simulations = [...this.simulations.values()];
    const completed = simulations.filter(s => s.status === 'completed');
    const certified = [...this.certifications.values()].filter(c => c.level !== 'trainee');

    return {
      totalScenarios: this.scenarios.size,
      totalSimulations: simulations.length,
      completedSimulations: completed.length,
      avgScore: completed.length > 0
        ? completed.reduce((sum, s) => sum + (s.score?.overall || 0), 0) / completed.length
        : 0,
      certifiedOperators: certified.length
    };
  }
}

export const warGamesService = new WarGamesService();
export default warGamesService;
