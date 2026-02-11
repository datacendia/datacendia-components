// =============================================================================
// DATACENDIA PLATFORM - DELIBERATION SERVICE
// Persistent storage, executive summaries, and minutes for Council deliberations
// =============================================================================

import { BaseService, ServiceConfig, ServiceHealth } from '../core/services/BaseService.js';
import { aiModelSelector } from '../config/aiModels.js';
import { druidEventStream } from './DruidEventStream.js';
import { prisma } from '../config/database.js';
import type { SocketServer } from '../websocket/SocketServer.js';
import { recordChronosEvent } from './ChronosEventBus.js';

// =============================================================================
// TYPES
// =============================================================================

export interface AgentResponse {
  agentId: string;
  agentName: string;
  agentRole: string;
  response: string;
  duration: number;
}

export interface CrossExamination {
  challengerId: string;
  challengerName: string;
  targetId: string;
  targetName: string;
  challenge: string;
  rebuttal: string;
}

export interface Deliberation {
  id: string;
  organizationId: string;
  userId: string;
  question: string;
  mode: string;
  councilMode: string;
  agentResponses: AgentResponse[];
  crossExaminations: CrossExamination[];
  synthesis: string;
  confidence: number;
  createdAt: Date;
  completedAt?: Date;
  status: 'in_progress' | 'completed' | 'cancelled';
  executiveSummary?: string;
  minutes?: string;
  tags?: string[];
}

export interface ExecutiveSummary {
  deliberationId: string;
  title: string;
  date: Date;
  question: string;
  recommendation: string;
  keyFindings: string[];
  riskFactors: string[];
  nextSteps: string[];
  confidence: number;
  dissent: string[];
  approvalStatus: 'pending' | 'approved' | 'rejected';
}

export interface DeliberationMinutes {
  deliberationId: string;
  title: string;
  date: Date;
  attendees: { name: string; role: string }[];
  agenda: string;
  proceedings: MinuteEntry[];
  resolutions: string[];
  actionItems: ActionItem[];
  nextMeeting?: string;
}

export interface MinuteEntry {
  timestamp: Date;
  speaker: string;
  speakerRole: string;
  content: string;
  type: 'statement' | 'question' | 'challenge' | 'response' | 'resolution';
}

export interface ActionItem {
  id: string;
  action: string;
  owner: string;
  deadline?: string;
  status: 'pending' | 'in_progress' | 'completed';
}

// =============================================================================
// DELIBERATION SERVICE
// =============================================================================

export class DeliberationService extends BaseService {
  private deliberationCache: Map<string, Deliberation[]> = new Map();
  private ollamaEndpoint: string;
  private socketServer: SocketServer | null = null;

  constructor(config?: Partial<ServiceConfig>, socketServer?: SocketServer | null) {
    super({
      name: 'deliberation-service',
      version: '1.0.0',
      dependencies: ['database'],
      ...config,
    });
    this.ollamaEndpoint = process.env['OLLAMA_HOST'] || 'http://localhost:11434';
    this.socketServer = socketServer || null;
  }

  async initialize(): Promise<void> {
    this.logger.info('Deliberation service initializing...');
  }

  async shutdown(): Promise<void> {
    this.logger.info('Deliberation service shutting down...');
    this.deliberationCache.clear();
  }

  async healthCheck(): Promise<ServiceHealth> {
    return {
      status: 'healthy',
      lastCheck: new Date(),
      details: { cachedDeliberations: this.getCachedCount() },
    };
  }

  private getCachedCount(): number {
    return Array.from(this.deliberationCache.values()).flat().length;
  }

  // ---------------------------------------------------------------------------
  // SAVE DELIBERATION
  // ---------------------------------------------------------------------------

  async saveDeliberation(deliberation: Omit<Deliberation, 'id' | 'createdAt'>): Promise<Deliberation> {
    const id = `delib-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = new Date();
    
    // Save to database for persistence
    try {
      await prisma!.deliberations.create({
        data: {
          id,
          organization_id: deliberation.organizationId,
          question: deliberation.question,
          mode: (deliberation.mode?.toUpperCase() || 'STANDARD') as any,
          status: (deliberation.status?.toUpperCase() || 'COMPLETED') as any,
          confidence: deliberation.confidence,
          decision: deliberation.synthesis,
          context: {
            councilMode: deliberation.councilMode,
            userId: deliberation.userId,
            tags: deliberation.tags,
            agentResponses: JSON.parse(JSON.stringify(deliberation.agentResponses)),
            crossExaminations: JSON.parse(JSON.stringify(deliberation.crossExaminations || [])),
          } as any,
          created_at: createdAt,
        },
      });

      this.logger.info(`Saved deliberation ${id} to database`);
    } catch (error) {
      this.logger.warn(`Failed to save deliberation to database, using cache only: ${error}`);
    }

    const saved: Deliberation = {
      ...deliberation,
      id,
      createdAt,
    };

    // Also save to cache for fast access
    const orgDeliberations = this.deliberationCache.get(deliberation.organizationId) || [];
    orgDeliberations.unshift(saved);
    this.deliberationCache.set(deliberation.organizationId, orgDeliberations.slice(0, 100));

    this.logger.info(`Saved deliberation ${id} to cache`);

    // Stream to Druid for CendiaChronos™ analytics
    druidEventStream.logDecision({
      organizationId: deliberation.organizationId,
      sessionId: id,
      decisionId: id,
      question: deliberation.question,
      agentsInvolved: deliberation.agentResponses.map(r => r.agentName),
      consensusReached: deliberation.confidence > 70,
      finalRecommendation: deliberation.synthesis?.substring(0, 200) || 'No synthesis',
      confidenceScore: deliberation.confidence,
      riskLevel: deliberation.confidence < 50 ? 'high' : deliberation.confidence < 70 ? 'medium' : 'low',
      deliberationTimeMs: deliberation.agentResponses.reduce((sum, r) => sum + r.duration, 0),
      department: deliberation.tags?.[0] || 'General',
      tags: deliberation.tags || [],
    });

    // Record to Chronos universal timeline
    recordChronosEvent({
      organizationId: deliberation.organizationId,
      eventType: 'deliberation_completed',
      category: 'council',
      severity: deliberation.confidence < 50 ? 'high' : 'info',
      title: `Council: ${deliberation.question?.substring(0, 60) || 'Deliberation'}`,
      description: `Mode: ${deliberation.councilMode} | Confidence: ${deliberation.confidence}% | Agents: ${deliberation.agentResponses.length} | ${deliberation.confidence > 70 ? 'Consensus reached' : 'No consensus'}`,
      actor: deliberation.userId,
      actorType: 'user',
      resourceType: 'deliberation',
      resourceId: id,
      impact: deliberation.confidence > 70 ? 'positive' : 'neutral',
      magnitude: Math.min(10, Math.ceil(deliberation.confidence / 12)),
      metadata: {
        councilMode: deliberation.councilMode,
        confidence: deliberation.confidence,
        agentCount: deliberation.agentResponses.length,
        agents: deliberation.agentResponses.map(r => r.agentName),
        tags: deliberation.tags,
        consensusReached: deliberation.confidence > 70,
      },
    });

    this.incrementCounter('deliberations_saved', 1);
    return saved;
  }

  // ---------------------------------------------------------------------------
  // GET DELIBERATIONS
  // ---------------------------------------------------------------------------

  async getDeliberations(
    organizationId?: string,
    options?: { limit?: number; offset?: number; status?: string }
  ): Promise<any[]> {
    // Query database directly for reliability
    const where: any = {};
    if (organizationId) {
      where.organization_id = organizationId;
    }
    if (options?.status) {
      where.status = options.status.toUpperCase();
    }

    const dbResults = await prisma!.deliberations.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip: options?.offset || 0,
      take: options?.limit || 50,
      include: {
        deliberation_messages: {
          include: { agents: true },
          orderBy: { created_at: 'asc' },
        },
      },
    });

    // Handle undefined/null results
    if (!dbResults || !Array.isArray(dbResults)) {
      return [];
    }

    // Map to Deliberation format
    return dbResults.map(d => ({
      id: d.id,
      organizationId: d.organization_id,
      question: d.question || '',
      status: d.status as any,
      mode: (d.mode as any) || 'council',
      config: (d.config as any) || {},
      context: (d.context as any) || {},
      currentPhase: d.current_phase || undefined,
      progress: d.progress || 0,
      decision: d.decision || undefined,
      confidence: d.confidence || undefined,
      startedAt: d.started_at || undefined,
      completedAt: d.completed_at || undefined,
      createdAt: d.created_at,
      responses: d.deliberation_messages.map(m => ({
        agentId: m.agent_id,
        agentCode: m.agents?.code || 'unknown',
        agentName: m.agents?.name || 'Unknown Agent',
        content: m.content,
        timestamp: m.created_at,
        phase: m.phase || 'response',
      })),
      crossExaminations: [],
      synthesis: d.decision || undefined,
    }));
  }

  async getDeliberation(deliberationId: string): Promise<any | null> {
    // Query database directly for reliability
    const d = await prisma!.deliberations.findUnique({
      where: { id: deliberationId },
      include: {
        deliberation_messages: {
          include: { agents: true },
          orderBy: { created_at: 'asc' },
        },
      },
    });

    if (!d) return null;

    // First check if agentResponses are stored in context (from frontend save)
    const contextData = (d.context as any) || {};
    const contextAgentResponses = contextData.agentResponses || [];

    // Build responses from context.agentResponses (preferred) or deliberation_messages (fallback)
    let responses: any[];
    if (contextAgentResponses.length > 0) {
      // Use the rich agent data saved from frontend
      responses = contextAgentResponses.map((r: any) => ({
        agentId: r.agentId,
        agentCode: r.agentCode || r.agentId?.replace('agent-', '') || 'unknown',
        agentName: r.agentName || 'Unknown Agent',
        agentRole: r.agentRole || 'Council Member',
        agentAvatar: r.agentAvatar || '🤖',
        agentColor: r.agentColor || '#6366F1',
        content: r.response || r.content || '',
        response: r.response || r.content || '',
        duration: r.duration || 0,
        phase: 'response',
      }));
    } else {
      // Fallback to deliberation_messages
      responses = d.deliberation_messages.map(m => ({
        agentId: m.agent_id,
        agentCode: (m as any).agents?.code || 'unknown',
        agentName: (m as any).agents?.name || 'Unknown Agent',
        agentRole: (m as any).agents?.role || 'Council Member',
        content: m.content,
        response: m.content,
        timestamp: m.created_at,
        phase: m.phase || 'response',
        duration: 0,
      }));
    }

    // Extract synthesis from messages or decision field
    const synthesisMsg = d.deliberation_messages.find(m => m.phase === 'synthesis');
    const synthesis = synthesisMsg?.content || (d.decision as string) || 
      responses.map(r => `${r.agentName}: ${r.content?.substring(0, 200)}...`).join('\n\n');

    // Extract cross-examinations from context (preferred) or messages (fallback)
    const contextCrossExams = contextData.crossExaminations || [];
    let crossExaminations: any[];
    if (contextCrossExams.length > 0) {
      crossExaminations = contextCrossExams.map((ce: any) => ({
        challengerId: ce.challengerId,
        challengerName: ce.challengerName || 'Agent',
        challengerAvatar: ce.challengerAvatar,
        challengerColor: ce.challengerColor,
        targetId: ce.targetId,
        targetName: ce.targetName || 'Agent',
        challenge: ce.challenge,
        rebuttal: ce.rebuttal || '',
      }));
    } else {
      crossExaminations = d.deliberation_messages
        .filter(m => m.phase === 'cross_examination')
        .map(m => ({
          challengerId: m.agent_id,
          challengerName: (m as any).agents?.name || 'Agent',
          targetId: '',
          targetName: '',
          challenge: m.content,
          rebuttal: '',
        }));
    }

    return {
      id: d.id,
      organizationId: d.organization_id,
      question: d.question || '',
      status: d.status,
      mode: d.mode || 'council',
      config: d.config || {},
      context: d.context || {},
      currentPhase: d.current_phase || undefined,
      progress: d.progress || 0,
      decision: d.decision || undefined,
      confidence: d.confidence || 0.8,
      startedAt: d.started_at || undefined,
      completedAt: d.completed_at || undefined,
      createdAt: d.created_at,
      created_at: d.created_at,
      completed_at: d.completed_at,
      deliberation_messages: d.deliberation_messages,
      responses,
      agentResponses: responses, // Alias for compatibility
      crossExaminations,
      synthesis,
    };
  }

  // ---------------------------------------------------------------------------
  // GENERATE EXECUTIVE SUMMARY
  // ---------------------------------------------------------------------------

  async generateExecutiveSummary(deliberationId: string): Promise<ExecutiveSummary> {
    const deliberation = await this.getDeliberation(deliberationId);
    if (!deliberation) {
      throw new Error('Deliberation not found');
    }

    // Extract key findings, risks, and next steps from the synthesis
    const extractFromSynthesis = (synthesis: string) => {
      const sentences = synthesis.split(/[.!?]+/).filter(s => s.trim().length > 10);
      
      const keyFindings: string[] = [];
      const riskFactors: string[] = [];
      const nextSteps: string[] = [];
      
      for (const sentence of sentences) {
        const lower = sentence.toLowerCase();
        const trimmed = sentence.trim();
        
        // Risk indicators
        if (lower.includes('risk') || lower.includes('concern') || lower.includes('challenge') || 
            lower.includes('threat') || lower.includes('caution') || lower.includes('warning')) {
          if (riskFactors.length < 5) riskFactors.push(trimmed);
        }
        // Action indicators
        else if (lower.includes('should') || lower.includes('must') || lower.includes('need to') ||
                 lower.includes('recommend') || lower.includes('implement') || lower.includes('consider')) {
          if (nextSteps.length < 5) nextSteps.push(trimmed);
        }
        // Key findings (anything substantive)
        else if (trimmed.length > 30 && keyFindings.length < 5) {
          keyFindings.push(trimmed);
        }
      }
      
      return { keyFindings, riskFactors, nextSteps };
    };

    const prompt = `You are generating an executive summary for a business deliberation. Output ONLY valid JSON.

QUESTION: ${deliberation.question}

SYNTHESIS: ${deliberation.synthesis}

AGENTS CONSULTED: ${(deliberation.responses || deliberation.agentResponses || []).map((r: any) => r.agentName || r.agentCode || 'Agent').join(', ')}

Generate this exact JSON structure (fill in ALL arrays with at least 2-3 items each):
{
  "title": "A short professional title summarizing the topic",
  "recommendation": "The main recommendation in 1-2 sentences",
  "keyFindings": ["Finding 1 from analysis", "Finding 2", "Finding 3"],
  "riskFactors": ["Risk or concern 1", "Risk 2", "Risk 3"],
  "nextSteps": ["Recommended action 1", "Action 2", "Action 3"],
  "dissent": []
}

IMPORTANT: Every array MUST have at least 2 items. Return ONLY the JSON, no other text.`;

    try {
      const response = await fetch(`${this.ollamaEndpoint}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2:3b',
          prompt,
          stream: false,
          format: 'json',
          options: {
            temperature: 0.3,
            num_predict: 1000,
          },
        }),
      });

      const data = await response.json() as { response: string };
      this.logger.info(`Executive summary LLM response: ${data.response.substring(0, 200)}...`);
      
      let parsed: any = {};
      try {
        parsed = JSON.parse(data.response);
      } catch (parseErr) {
        this.logger.warn('Failed to parse LLM JSON, using extraction fallback');
      }

      // Use LLM results or fallback to extraction
      const extracted = extractFromSynthesis(deliberation.synthesis);
      
      const summary: ExecutiveSummary = {
        deliberationId,
        title: parsed.title || `Strategic Analysis: ${deliberation.question.substring(0, 50)}`,
        date: deliberation.createdAt,
        question: deliberation.question,
        recommendation: parsed.recommendation || deliberation.synthesis.substring(0, 500),
        keyFindings: (parsed.keyFindings?.length > 0) ? parsed.keyFindings : 
          (extracted.keyFindings.length > 0 ? extracted.keyFindings : 
            ['Analysis conducted by AI Council', 'Multiple perspectives considered', 'Recommendation provided based on synthesis']),
        riskFactors: (parsed.riskFactors?.length > 0) ? parsed.riskFactors :
          (extracted.riskFactors.length > 0 ? extracted.riskFactors :
            ['Further analysis may be required', 'Implementation timing considerations', 'Resource allocation needs review']),
        nextSteps: (parsed.nextSteps?.length > 0) ? parsed.nextSteps :
          (extracted.nextSteps.length > 0 ? extracted.nextSteps :
            ['Review detailed deliberation', 'Consult with relevant stakeholders', 'Develop implementation plan']),
        confidence: deliberation.confidence,
        dissent: parsed.dissent || [],
        approvalStatus: 'pending',
      };

      // Update deliberation with summary
      deliberation.executiveSummary = JSON.stringify(summary);
      
      return summary;
    } catch (error: unknown) {
      this.logger.error('Failed to generate executive summary:', error as Error);
      
      // Fallback with extraction
      const extracted = extractFromSynthesis(deliberation.synthesis);
      
      return {
        deliberationId,
        title: `Council Deliberation: ${deliberation.question.substring(0, 40)}...`,
        date: deliberation.createdAt,
        question: deliberation.question,
        recommendation: deliberation.synthesis,
        keyFindings: extracted.keyFindings.length > 0 ? extracted.keyFindings :
          ['Deliberation completed successfully', 'AI Council provided comprehensive analysis'],
        riskFactors: extracted.riskFactors.length > 0 ? extracted.riskFactors :
          ['Review recommendations carefully before implementation'],
        nextSteps: extracted.nextSteps.length > 0 ? extracted.nextSteps :
          ['Review full deliberation details', 'Discuss with team', 'Plan next actions'],
        confidence: deliberation.confidence,
        dissent: [],
        approvalStatus: 'pending',
      };
    }
  }

  // ---------------------------------------------------------------------------
  // GENERATE MINUTES
  // ---------------------------------------------------------------------------

  async generateMinutes(deliberationId: string): Promise<DeliberationMinutes> {
    const deliberation = await this.getDeliberation(deliberationId);
    if (!deliberation) {
      throw new Error('Deliberation not found');
    }

    // Build proceedings from agent responses and cross-examinations
    const proceedings: MinuteEntry[] = [];
    let timestamp = new Date(deliberation.createdAt);

    // Opening
    proceedings.push({
      timestamp,
      speaker: 'Chair',
      speakerRole: 'Council Chair',
      content: `Council convened to deliberate: "${deliberation.question}"`,
      type: 'statement',
    });

    // Agent responses - use responses or agentResponses
    const agentResps = deliberation.responses || deliberation.agentResponses || [];
    for (const response of agentResps) {
      timestamp = new Date(timestamp.getTime() + 60000); // +1 minute
      proceedings.push({
        timestamp,
        speaker: response.agentName || response.agentCode || 'Agent',
        speakerRole: response.agentRole || 'Council Member',
        content: response.response || response.content || '',
        type: 'statement',
      });
    }

    // Cross-examinations
    for (const ce of deliberation.crossExaminations) {
      timestamp = new Date(timestamp.getTime() + 30000);
      proceedings.push({
        timestamp,
        speaker: ce.challengerName,
        speakerRole: 'Council Member',
        content: ce.challenge,
        type: 'challenge',
      });

      if (ce.rebuttal) {
        timestamp = new Date(timestamp.getTime() + 30000);
        proceedings.push({
          timestamp,
          speaker: ce.targetName,
          speakerRole: 'Council Member',
          content: ce.rebuttal,
          type: 'response',
        });
      }
    }

    // Synthesis
    timestamp = new Date(timestamp.getTime() + 60000);
    proceedings.push({
      timestamp,
      speaker: 'Chief Strategy Officer',
      speakerRole: 'Synthesizer',
      content: deliberation.synthesis,
      type: 'resolution',
    });

    const minutes: DeliberationMinutes = {
      deliberationId,
      title: `Council Minutes - ${deliberation.question.substring(0, 50)}...`,
      date: deliberation.createdAt,
      attendees: agentResps.map((r: any) => ({
        name: r.agentName || r.agentCode || 'Agent',
        role: r.agentRole || 'Council Member',
      })),
      agenda: deliberation.question,
      proceedings,
      resolutions: [deliberation.synthesis],
      actionItems: this.extractActionItems(deliberation.synthesis),
    };

    // Update deliberation with minutes
    deliberation.minutes = JSON.stringify(minutes);

    return minutes;
  }

  private extractActionItems(synthesis: string): ActionItem[] {
    // Simple extraction - look for action-oriented sentences
    const items: ActionItem[] = [];
    const sentences = synthesis.split(/[.!?]+/);
    
    const actionWords = ['should', 'must', 'need to', 'recommend', 'suggest', 'consider', 'implement', 'review'];
    
    for (const sentence of sentences) {
      const lower = sentence.toLowerCase();
      if (actionWords.some(word => lower.includes(word))) {
        items.push({
          id: `action-${items.length + 1}`,
          action: sentence.trim(),
          owner: 'TBD',
          status: 'pending',
        });
      }
    }

    return items.slice(0, 5);
  }

  // ---------------------------------------------------------------------------
  // EXPORT FUNCTIONS
  // ---------------------------------------------------------------------------

  generatePDFReport(deliberation: Deliberation, summary: ExecutiveSummary): string {
    // In production, use a PDF library. For now, return HTML that can be printed as PDF
    const agentNames = deliberation.agentResponses?.map(r => r.agentName).join(', ') || 'Council Members';
    
    return `
<!DOCTYPE html>
<html>
<head>
  <title>${summary.title}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; }
    h1 { color: #1a1a1a; border-bottom: 2px solid #6366f1; padding-bottom: 10px; }
    h2 { color: #374151; margin-top: 30px; }
    .meta { color: #6b7280; margin-bottom: 20px; }
    .confidence { display: inline-block; padding: 4px 12px; border-radius: 20px; font-weight: bold; }
    .high { background: #dcfce7; color: #166534; }
    .medium { background: #fef9c3; color: #854d0e; }
    .low { background: #fee2e2; color: #991b1b; }
    ul { line-height: 1.8; }
    .synthesis { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .agents { background: #eff6ff; padding: 12px; border-radius: 6px; margin: 10px 0; }
  </style>
</head>
<body>
  <h1>${summary.title}</h1>
  <div class="meta">
    <strong>Date:</strong> ${summary.date.toLocaleDateString()}<br>
    <strong>Deliberation ID:</strong> ${deliberation.id}<br>
    <strong>Mode:</strong> ${deliberation.councilMode || deliberation.mode}<br>
    <strong>Confidence:</strong> 
    <span class="confidence ${summary.confidence >= 80 ? 'high' : summary.confidence >= 60 ? 'medium' : 'low'}">
      ${summary.confidence}%
    </span>
  </div>
  
  <div class="agents">
    <strong>Participating Agents:</strong> ${agentNames}
  </div>
  
  <h2>Question</h2>
  <p>${summary.question}</p>
  
  <h2>Recommendation</h2>
  <div class="synthesis">${summary.recommendation}</div>
  
  <h2>Key Findings</h2>
  <ul>${summary.keyFindings.map(f => `<li>${f}</li>`).join('')}</ul>
  
  <h2>Risk Factors</h2>
  <ul>${summary.riskFactors.map(r => `<li>${r}</li>`).join('')}</ul>
  
  <h2>Next Steps</h2>
  <ul>${summary.nextSteps.map(s => `<li>${s}</li>`).join('')}</ul>
  
  ${summary.dissent.length > 0 ? `
  <h2>Dissenting Views</h2>
  <ul>${summary.dissent.map(d => `<li>${d}</li>`).join('')}</ul>
  ` : ''}
  
  <hr style="margin-top: 40px;">
  <p style="color: #9ca3af; font-size: 12px;">
    Generated by Datacendia Council • Deliberation ${deliberation.id} • ${new Date().toISOString()}
  </p>
</body>
</html>`;
  }

  // ---------------------------------------------------------------------------
  // DASHBOARD METRICS
  // ---------------------------------------------------------------------------

  getDashboardMetrics(): {
    totalDeliberations: number;
    completedDeliberations: number;
    avgConfidence: number;
    avgDuration: number;
  } {
    const all = this.getAllDeliberations();
    const completed = all.filter(d => d.status === 'completed');
    
    const totalConfidence = completed.reduce((sum, d) => sum + d.confidence, 0);
    const avgConfidence = completed.length > 0 ? Math.round(totalConfidence / completed.length) : 0;

    // Calculate average duration from completed deliberations
    let totalDuration = 0;
    for (const d of completed) {
      if (d.completedAt && d.createdAt) {
        totalDuration += d.completedAt.getTime() - d.createdAt.getTime();
      }
    }
    const avgDuration = completed.length > 0 ? Math.round(totalDuration / completed.length / 1000) : 0; // seconds

    return {
      totalDeliberations: all.length,
      completedDeliberations: completed.length,
      avgConfidence,
      avgDuration,
    };
  }

  getAllDeliberations(): Deliberation[] {
    const all: Deliberation[] = [];
    for (const orgDelibs of this.deliberationCache.values()) {
      all.push(...orgDelibs);
    }
    return all;
  }

  getModelForTask(): string {
    return aiModelSelector.getModelForService('council');
  }
}

// Export singleton
export const deliberationService = new DeliberationService();
