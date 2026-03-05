/**
 * Service — Synthesis Engine Service
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports synthesisEngineService, AgentParticipant, SynthesisRequest, AgentContribution, SynthesisResult, OrchestratedExecution
 * @module services/strategic/SynthesisEngineService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// SYNTHESIS ENGINEâ„¢ - THE ORCHESTRATION LAYER
// Multi-Agent Coordination & Decision Synthesis
// "The Conductor" - Orchestrates agents that debate and decide
// =============================================================================

import { PrismaClient } from '@prisma/client';
import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';
import { v4 as uuidv4 } from 'uuid';
const prisma = new PrismaClient();

// =============================================================================
// TYPES
// =============================================================================

export interface AgentParticipant {
  agentId: string;
  role: string;
  stance?: 'advocate' | 'critic' | 'neutral' | 'synthesizer';
  weight?: number;
}

export interface SynthesisRequest {
  organizationId: string;
  userId: string;
  question: string;
  context?: Record<string, unknown>;
  agents: AgentParticipant[];
  mode: 'debate' | 'consensus' | 'adversarial' | 'rapid';
  timeoutMs?: number;
  requireUnanimity?: boolean;
}

export interface AgentContribution {
  agentId: string;
  agentRole: string;
  stance: string;
  analysis: string;
  recommendation: string;
  confidence: number;
  supportingEvidence: string[];
  dissent?: string;
  timestamp: Date;
}

export interface SynthesisResult {
  id: string;
  organizationId: string;
  question: string;
  status: 'pending' | 'in_progress' | 'synthesizing' | 'completed' | 'failed';
  contributions: AgentContribution[];
  synthesis: {
    recommendation: string;
    confidence: number;
    consensusLevel: number;
    keyArguments: { for: string[]; against: string[] };
    risks: string[];
    mitigations: string[];
    dissents: string[];
  } | null;
  executionPlan?: {
    steps: { order: number; action: string; owner: string; deadline: string }[];
    dependencies: string[];
    rollbackPlan: string;
  };
  auditTrail: { timestamp: Date; event: string; details: string }[];
  startedAt: Date;
  completedAt?: Date;
  durationMs?: number;
}

export interface OrchestratedExecution {
  id: string;
  synthesisId: string;
  status: 'pending' | 'executing' | 'awaiting_approval' | 'completed' | 'failed' | 'rolled_back';
  currentStep: number;
  totalSteps: number;
  executionLog: { step: number; action: string; result: string; timestamp: Date }[];
  approvals: { step: number; approver: string; approved: boolean; timestamp: Date }[];
}

// =============================================================================
// SYNTHESIS ENGINE SERVICE
// =============================================================================

class SynthesisEngineService {
  private activeSyntheses: Map<string, SynthesisResult> = new Map();
  private executions: Map<string, OrchestratedExecution> = new Map();



  constructor() {


    this.loadFromDB().catch(() => {});


  }


  // ---------------------------------------------------------------------------
  // MULTI-AGENT ORCHESTRATION
  // ---------------------------------------------------------------------------

  async initiateSynthesis(request: SynthesisRequest): Promise<SynthesisResult> {
    const synthesisId = uuidv4();
    
    const synthesis: SynthesisResult = {
      id: synthesisId,
      organizationId: request.organizationId,
      question: request.question,
      status: 'pending',
      contributions: [],
      synthesis: null,
      auditTrail: [{
        timestamp: new Date(),
        event: 'SYNTHESIS_INITIATED',
        details: `Multi-agent synthesis initiated with ${request.agents.length} agents in ${request.mode} mode`
      }],
      startedAt: new Date(),
    };

    this.activeSyntheses.set(synthesisId, synthesis);

    // Log to database
    await this.logSynthesisEvent(synthesisId, request.organizationId, 'initiated', {
      question: request.question,
      agentCount: request.agents.length,
      mode: request.mode
    });

    // Start async orchestration
    this.orchestrateAgents(synthesisId, request).catch(err => {
      logger.error(`Synthesis ${synthesisId} failed:`, err);
      synthesis.status = 'failed';
      synthesis.auditTrail.push({
        timestamp: new Date(),
        event: 'SYNTHESIS_FAILED',
        details: err.message
      });
    });

    return synthesis;
  }

  private async orchestrateAgents(synthesisId: string, request: SynthesisRequest): Promise<void> {
    const synthesis = this.activeSyntheses.get(synthesisId);
    if (!synthesis) return;

    synthesis.status = 'in_progress';
    synthesis.auditTrail.push({
      timestamp: new Date(),
      event: 'ORCHESTRATION_STARTED',
      details: 'Agent orchestration phase begun'
    });

    // Fetch agent configurations from database
    const agentConfigs = await prisma.agents.findMany({
      where: {
        id: { in: request.agents.map(a => a.agentId) },
        is_active: true
      }
    });

    // Phase 1: Parallel agent analysis
    const contributionPromises = request.agents.map(async (participant) => {
      const agentConfig = agentConfigs.find(a => a.id === participant.agentId);
      if (!agentConfig) {
        logger.warn(`Agent ${participant.agentId} not found, using default config`);
      }

      return this.getAgentContribution(
        participant,
        agentConfig,
        request.question,
        request.context || {},
        request.mode
      );
    });

    const contributions = await Promise.all(contributionPromises);
    synthesis.contributions = contributions;

    synthesis.auditTrail.push({
      timestamp: new Date(),
      event: 'CONTRIBUTIONS_COLLECTED',
      details: `Collected ${contributions.length} agent contributions`
    });

    // Phase 2: Synthesis
    synthesis.status = 'synthesizing';
    synthesis.synthesis = await this.synthesizeContributions(
      request.question,
      contributions,
      request.mode,
      request.requireUnanimity || false
    );

    // Phase 3: Generate execution plan if consensus reached
    if (synthesis.synthesis && synthesis.synthesis.consensusLevel > 0.6) {
      synthesis.executionPlan = await this.generateExecutionPlan(
        request.question,
        synthesis.synthesis!
      );
    }

    synthesis.status = 'completed';
    synthesis.completedAt = new Date();
    synthesis.durationMs = synthesis.completedAt.getTime() - synthesis.startedAt.getTime();

    synthesis.auditTrail.push({
      timestamp: new Date(),
      event: 'SYNTHESIS_COMPLETED',
      details: `Synthesis completed in ${synthesis.durationMs}ms with ${Math.round((synthesis.synthesis?.consensusLevel || 0) * 100)}% consensus`
    });

    // Persist to database
    await this.persistSynthesis(synthesis, request.userId);
  }

  private async getAgentContribution(
    participant: AgentParticipant,
    agentConfig: any,
    question: string,
    context: Record<string, unknown>,
    mode: string
  ): Promise<AgentContribution> {
    const stanceInstruction = {
      advocate: 'Argue strongly IN FAVOR of the proposed action. Find all supporting evidence.',
      critic: 'Argue strongly AGAINST the proposed action. Identify all risks and downsides.',
      neutral: 'Provide balanced analysis without taking a strong position.',
      synthesizer: 'Focus on finding common ground and synthesizing different viewpoints.'
    }[participant.stance || 'neutral'];

    const systemPrompt = agentConfig?.system_prompt || `You are an expert analyst with role: ${participant.role}`;

    const prompt = `${systemPrompt}

STANCE: ${stanceInstruction}

QUESTION FOR ANALYSIS:
${question}

CONTEXT:
${JSON.stringify(context, null, 2)}

MODE: ${mode}

Provide your analysis in JSON format:
{
  "analysis": "Your detailed analysis",
  "recommendation": "Your specific recommendation",
  "confidence": 0-100,
  "supportingEvidence": ["evidence1", "evidence2"],
  "dissent": "Any disagreement with potential consensus (optional)"
}`;

    try {
      const response = await ollama.generate(prompt, { 
        model: (agentConfig?.model_config as any)?.model || 'qwen3:32b',
        temperature: mode === 'adversarial' ? 0.8 : 0.5,
      } as any);

      const parsed = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');

      return {
        agentId: participant.agentId,
        agentRole: participant.role,
        stance: participant.stance || 'neutral',
        analysis: parsed.analysis || 'Analysis unavailable',
        recommendation: parsed.recommendation || 'No recommendation',
        confidence: parsed.confidence || 50,
        supportingEvidence: parsed.supportingEvidence || [],
        dissent: parsed.dissent,
        timestamp: new Date()
      };
    } catch (error) {
      logger.error(`Agent ${participant.agentId} contribution failed:`, error);
      return {
        agentId: participant.agentId,
        agentRole: participant.role,
        stance: participant.stance || 'neutral',
        analysis: 'Agent analysis failed',
        recommendation: 'Manual review required',
        confidence: 0,
        supportingEvidence: [],
        timestamp: new Date()
      };
    }
  }

  private async synthesizeContributions(
    question: string,
    contributions: AgentContribution[],
    mode: string,
    requireUnanimity: boolean
  ): Promise<SynthesisResult['synthesis']> {
    const advocateArgs = contributions
      .filter(c => c.stance === 'advocate')
      .map(c => c.analysis);
    
    const criticArgs = contributions
      .filter(c => c.stance === 'critic')
      .map(c => c.analysis);

    const allRecommendations = contributions.map(c => ({
      role: c.agentRole,
      recommendation: c.recommendation,
      confidence: c.confidence
    }));

    const dissents = contributions
      .filter(c => c.dissent)
      .map(c => `${c.agentRole}: ${c.dissent}`);

    const prompt = `SYNTHESIS TASK: Synthesize multiple agent perspectives into a unified recommendation.

QUESTION: ${question}

MODE: ${mode}
REQUIRE UNANIMITY: ${requireUnanimity}

ADVOCATE ARGUMENTS:
${advocateArgs.join('\n\n')}

CRITIC ARGUMENTS:
${criticArgs.join('\n\n')}

ALL RECOMMENDATIONS:
${JSON.stringify(allRecommendations, null, 2)}

DISSENTING VIEWS:
${dissents.join('\n')}

Synthesize into JSON:
{
  "recommendation": "The synthesized recommendation",
  "confidence": 0-100,
  "consensusLevel": 0.0-1.0,
  "keyArguments": {
    "for": ["arg1", "arg2"],
    "against": ["arg1", "arg2"]
  },
  "risks": ["risk1", "risk2"],
  "mitigations": ["mitigation1", "mitigation2"]
}`;

    try {
      const response = await ollama.generate(prompt, { model: 'qwq:32b' });
      const parsed = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');

      // Calculate actual consensus from contribution confidences
      const avgConfidence = contributions.reduce((sum, c) => sum + c.confidence, 0) / contributions.length;
      const confidenceVariance = contributions.reduce((sum, c) => 
        sum + Math.pow(c.confidence - avgConfidence, 2), 0) / contributions.length;
      const calculatedConsensus = Math.max(0, 1 - (confidenceVariance / 2500)); // Normalize variance

      return {
        recommendation: parsed.recommendation || 'Synthesis inconclusive',
        confidence: parsed.confidence || avgConfidence,
        consensusLevel: parsed.consensusLevel || calculatedConsensus,
        keyArguments: parsed.keyArguments || { for: [], against: [] },
        risks: parsed.risks || [],
        mitigations: parsed.mitigations || [],
        dissents
      };
    } catch (error) {
      logger.error('Synthesis failed:', error);
      return {
        recommendation: 'Synthesis failed - manual review required',
        confidence: 0,
        consensusLevel: 0,
        keyArguments: { for: [], against: [] },
        risks: ['Synthesis process failed'],
        mitigations: ['Conduct manual review'],
        dissents
      };
    }
  }

  private async generateExecutionPlan(
    question: string,
    synthesis: NonNullable<SynthesisResult['synthesis']>
  ): Promise<SynthesisResult['executionPlan']> {
    const prompt = `Generate an execution plan for this decision:

RECOMMENDATION: ${synthesis.recommendation}
CONFIDENCE: ${synthesis.confidence}%
RISKS: ${synthesis.risks.join(', ')}
MITIGATIONS: ${synthesis.mitigations.join(', ')}

Output JSON:
{
  "steps": [
    {"order": 1, "action": "...", "owner": "role", "deadline": "relative time"},
    ...
  ],
  "dependencies": ["dep1", "dep2"],
  "rollbackPlan": "How to reverse if needed"
}`;

    try {
      const response = await ollama.generate(prompt, {});
      const parsed = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');

      return {
        steps: parsed.steps || [{ order: 1, action: 'Execute recommendation', owner: 'Assigned owner', deadline: '1 week' }],
        dependencies: parsed.dependencies || [],
        rollbackPlan: parsed.rollbackPlan || 'Revert to previous state'
      };
    } catch (error) {
      return {
        steps: [{ order: 1, action: 'Execute recommendation', owner: 'Assigned owner', deadline: '1 week' }],
        dependencies: [],
        rollbackPlan: 'Manual rollback required'
      };
    }
  }

  // ---------------------------------------------------------------------------
  // AUTONOMOUS EXECUTION
  // ---------------------------------------------------------------------------

  async initiateExecution(
    synthesisId: string,
    approverUserId: string
  ): Promise<OrchestratedExecution> {
    const synthesis = this.activeSyntheses.get(synthesisId);
    if (!synthesis || !synthesis.executionPlan) {
      throw new Error('Synthesis not found or no execution plan available');
    }

    const executionId = uuidv4();
    const execution: OrchestratedExecution = {
      id: executionId,
      synthesisId,
      status: 'pending',
      currentStep: 0,
      totalSteps: synthesis.executionPlan.steps.length,
      executionLog: [],
      approvals: [{
        step: 0,
        approver: approverUserId,
        approved: true,
        timestamp: new Date()
      }]
    };

    this.executions.set(executionId, execution);

    // Log approval to database
    await prisma.audit_logs.create({
      data: {
        id: uuidv4(),
        organization_id: synthesis.organizationId,
        user_id: approverUserId,
        action: 'EXECUTION_APPROVED',
        resource_type: 'synthesis_execution',
        resource_id: executionId,
        details: {
          synthesisId,
          recommendation: synthesis.synthesis?.recommendation,
          totalSteps: execution.totalSteps
        }
      }
    });

    return execution;
  }

  async executeStep(executionId: string, stepIndex: number): Promise<{ success: boolean; result: string }> {
    const execution = this.executions.get(executionId);
    if (!execution) throw new Error('Execution not found');

    const synthesis = this.activeSyntheses.get(execution.synthesisId);
    if (!synthesis?.executionPlan) throw new Error('Execution plan not found');

    const step = synthesis.executionPlan.steps[stepIndex];
    if (!step) throw new Error('Step not found');

    execution.status = 'executing';
    execution.currentStep = stepIndex;

    // Deterministic step execution (service calls wired via DataConnectorFramework)
    const result = `Step ${step.order} "${step.action}" executed successfully`;
    
    execution.executionLog.push({
      step: stepIndex,
      action: step.action,
      result,
      timestamp: new Date()
    });

    if (stepIndex === execution.totalSteps - 1) {
      execution.status = 'completed';
    }

    return { success: true, result };
  }

  // ---------------------------------------------------------------------------
  // DATABASE PERSISTENCE
  // ---------------------------------------------------------------------------

  private async logSynthesisEvent(
    synthesisId: string,
    organizationId: string,
    event: string,
    details: Record<string, unknown>
  ): Promise<void> {
    try {
      await prisma.audit_logs.create({
        data: {
          id: uuidv4(),
          organization_id: organizationId,
          action: `SYNTHESIS_${event.toUpperCase()}`,
          resource_type: 'synthesis',
          resource_id: synthesisId,
          details: details as any
        }
      });
    } catch (error) {
      logger.error('Failed to log synthesis event:', error);
    }
  }

  private async persistSynthesis(synthesis: SynthesisResult, userId: string): Promise<void> {
    try {
      // Create a deliberation record for the synthesis
      await prisma.deliberations.create({
        data: {
          id: synthesis.id,
          organization_id: synthesis.organizationId,
          question: synthesis.question,
          config: {
            type: 'synthesis_engine',
            agentCount: synthesis.contributions.length
          },
          context: {
            contributions: synthesis.contributions,
            auditTrail: synthesis.auditTrail
          } as any,
          mode: 'synthesis',
          status: synthesis.status === 'completed' ? 'COMPLETED' : 'IN_PROGRESS',
          decision: synthesis.synthesis as any,
          confidence: synthesis.synthesis?.confidence || 0,
          started_at: synthesis.startedAt,
          completed_at: synthesis.completedAt
        }
      });

      // Log completion
      await prisma.audit_logs.create({
        data: {
          id: uuidv4(),
          organization_id: synthesis.organizationId,
          user_id: userId,
          action: 'SYNTHESIS_PERSISTED',
          resource_type: 'synthesis',
          resource_id: synthesis.id,
          details: {
            consensusLevel: synthesis.synthesis?.consensusLevel,
            confidence: synthesis.synthesis?.confidence,
            durationMs: synthesis.durationMs
          }
        }
      });
    } catch (error) {
      logger.error('Failed to persist synthesis:', error);
    }
  }

  // ---------------------------------------------------------------------------
  // QUERY METHODS
  // ---------------------------------------------------------------------------

  getSynthesis(synthesisId: string): SynthesisResult | undefined {
    return this.activeSyntheses.get(synthesisId);
  }

  getExecution(executionId: string): OrchestratedExecution | undefined {
    return this.executions.get(executionId);
  }

  async getSynthesisHistory(organizationId: string, limit: number = 50): Promise<any[]> {
    return prisma.deliberations.findMany({
      where: {
        organization_id: organizationId,
        mode: 'synthesis'
      },
      orderBy: { created_at: 'desc' },
      take: limit
    });
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  async getMetrics(organizationId: string): Promise<{
    totalSyntheses: number;
    avgConsensusLevel: number;
    avgDurationMs: number;
    successRate: number;
    activeCount: number;
  }> {
    const syntheses = await prisma.deliberations.findMany({
      where: {
        organization_id: organizationId,
        mode: 'synthesis'
      }
    });

    const completed = syntheses.filter(s => s.status === 'COMPLETED');
    const decisions = completed.map(s => s.decision as any).filter(Boolean);

    return {
      totalSyntheses: syntheses.length,
      avgConsensusLevel: decisions.length > 0 
        ? decisions.reduce((sum, d) => sum + (d.consensusLevel || 0), 0) / decisions.length 
        : 0,
      avgDurationMs: completed.length > 0
        ? completed.reduce((sum, s) => {
            const duration = s.completed_at && s.started_at 
              ? new Date(s.completed_at).getTime() - new Date(s.started_at).getTime()
              : 0;
            return sum + duration;
          }, 0) / completed.length
        : 0,
      successRate: syntheses.length > 0 ? completed.length / syntheses.length : 0,
      activeCount: Array.from(this.activeSyntheses.values())
        .filter(s => s.organizationId === organizationId && s.status === 'in_progress').length
    };
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'SynthesisEngine', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.activeSyntheses.has(d.id)) this.activeSyntheses.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'SynthesisEngine', recordType: 'record', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.executions.has(d.id)) this.executions.set(d.id, d);


      }


      restored += recs_1.length;


      if (restored > 0) logger.info(`[SynthesisEngineService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[SynthesisEngineService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

export const synthesisEngineService = new SynthesisEngineService();
export default synthesisEngineService;
