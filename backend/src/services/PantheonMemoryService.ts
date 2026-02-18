// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - PANTHEON MEMORY SERVICE
// Persistent agent memory, learning from decisions, and context accumulation
// Makes AI agents smarter over time by remembering past interactions
// =============================================================================

import { BaseService, ServiceHealth } from '../core/services/BaseService.js';
import { ollama } from './ollama.js';
import { deterministicFloat, deterministicInt, deterministicPercentage, deterministicPick } from '../utils/deterministic.js';

// =============================================================================
// TYPES
// =============================================================================

export type MemoryType = 
  | 'decision'           // A decision that was made
  | 'preference'         // User/org preference
  | 'context'            // Business context
  | 'insight'            // Learned insight
  | 'outcome'            // Decision outcome
  | 'correction'         // User correction to agent
  | 'entity'             // Key business entity
  | 'relationship';      // Entity relationship

export type MemoryImportance = 'low' | 'medium' | 'high' | 'critical';

export interface Memory {
  id: string;
  organizationId: string;
  userId?: string;
  agentId?: string;
  type: MemoryType;
  importance: MemoryImportance;
  content: string;
  summary: string;
  embedding?: number[];
  metadata: {
    source: string;
    sessionId?: string;
    decisionId?: string;
    tags: string[];
    entities: string[];
    sentiment?: 'positive' | 'negative' | 'neutral';
    confidence: number;
  };
  createdAt: Date;
  lastAccessedAt: Date;
  accessCount: number;
  expiresAt?: Date;
}

export interface MemoryQuery {
  query: string;
  organizationId: string;
  userId?: string;
  agentId?: string;
  types?: MemoryType[];
  minImportance?: MemoryImportance;
  tags?: string[];
  limit?: number;
  includeExpired?: boolean;
}

export interface MemorySearchResult {
  memory: Memory;
  relevance: number;
  matchedTerms: string[];
}

export interface AgentContext {
  recentMemories: Memory[];
  relevantDecisions: Memory[];
  userPreferences: Memory[];
  entityContext: Memory[];
  synthesizedContext: string;
}

export interface LearningEvent {
  id: string;
  organizationId: string;
  agentId: string;
  eventType: 'correction' | 'feedback' | 'outcome' | 'preference';
  input: string;
  expectedOutput?: string;
  actualOutput?: string;
  feedback?: 'positive' | 'negative' | 'neutral';
  lesson: string;
  appliedAt?: Date;
}

// =============================================================================
// PANTHEON MEMORY SERVICE
// =============================================================================

export class PantheonMemoryService extends BaseService {
  private memories: Map<string, Memory> = new Map();
  private memoriesByOrg: Map<string, string[]> = new Map();
  private memoriesByAgent: Map<string, string[]> = new Map();
  private learnings: Map<string, LearningEvent> = new Map();
  private embeddingCache: Map<string, number[]> = new Map();

  constructor() {
    super({
      name: 'PantheonMemoryService',
      version: '1.0.0',
      dependencies: [],
    });
  }

  async initialize(): Promise<void> {
    this.logger.info('[CendiaPantheon] Agent Memory ServiceÃ¢â€žÂ¢ initialized');
  }

  async shutdown(): Promise<void> {
    this.logger.info('PantheonMemory Service shutting down');
  }

  async healthCheck(): Promise<ServiceHealth> {
    return {
      status: 'healthy',
      lastCheck: new Date(),
      details: {
        totalMemories: this.memories.size,
        organizations: this.memoriesByOrg.size,
        learnings: this.learnings.size,
      },
    };
  }

  // ---------------------------------------------------------------------------
  // MEMORY STORAGE
  // ---------------------------------------------------------------------------

  /**
   * Store a new memory
   */
  async storeMemory(params: {
    organizationId: string;
    userId?: string;
    agentId?: string;
    type: MemoryType;
    content: string;
    importance?: MemoryImportance;
    source: string;
    sessionId?: string;
    decisionId?: string;
    tags?: string[];
    expiresInDays?: number;
  }): Promise<Memory> {
    const id = `mem-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`;
    
    // Generate summary and extract entities
    const { summary, entities, sentiment } = await this.analyzeContent(params.content);
    
    // Generate embedding for semantic search
    let embedding: number[] | undefined;
    try {
      embedding = await this.generateEmbedding(params.content);
    } catch (error) {
      this.logger.warn('Failed to generate embedding', { error });
    }
    
    const now = new Date();
    const memory: Memory = {
      id,
      organizationId: params.organizationId,
      userId: params.userId,
      agentId: params.agentId,
      type: params.type,
      importance: params.importance || this.inferImportance(params.type, params.content),
      content: params.content,
      summary,
      embedding,
      metadata: {
        source: params.source,
        sessionId: params.sessionId,
        decisionId: params.decisionId,
        tags: params.tags || [],
        entities,
        sentiment,
        confidence: 0.8,
      },
      createdAt: now,
      lastAccessedAt: now,
      accessCount: 0,
      expiresAt: params.expiresInDays 
        ? new Date(now.getTime() + params.expiresInDays * 24 * 60 * 60 * 1000) 
        : undefined,
    };
    
    // Store memory
    this.memories.set(id, memory);
    
    // Index by organization
    const orgMemories = this.memoriesByOrg.get(params.organizationId) || [];
    orgMemories.unshift(id);
    this.memoriesByOrg.set(params.organizationId, orgMemories.slice(0, 10000));
    
    // Index by agent if specified
    if (params.agentId) {
      const agentKey = `${params.organizationId}:${params.agentId}`;
      const agentMemories = this.memoriesByAgent.get(agentKey) || [];
      agentMemories.unshift(id);
      this.memoriesByAgent.set(agentKey, agentMemories.slice(0, 5000));
    }
    
    this.incrementCounter('memories_stored', 1);
    return memory;
  }

  /**
   * Store a decision for future reference
   */
  async rememberDecision(params: {
    organizationId: string;
    userId: string;
    decisionId: string;
    title: string;
    description: string;
    outcome?: string;
    reasoning: string;
    agents: string[];
    tags?: string[];
  }): Promise<Memory> {
    const content = `
Decision: ${params.title}
Description: ${params.description}
Reasoning: ${params.reasoning}
${params.outcome ? `Outcome: ${params.outcome}` : ''}
Agents Involved: ${params.agents.join(', ')}
`.trim();
    
    return this.storeMemory({
      organizationId: params.organizationId,
      userId: params.userId,
      type: 'decision',
      content,
      importance: 'high',
      source: 'decision_service',
      decisionId: params.decisionId,
      tags: params.tags,
    });
  }

  /**
   * Record a user preference
   */
  async rememberPreference(params: {
    organizationId: string;
    userId: string;
    category: string;
    preference: string;
    context?: string;
  }): Promise<Memory> {
    const content = `
User Preference - ${params.category}:
${params.preference}
${params.context ? `Context: ${params.context}` : ''}
`.trim();
    
    return this.storeMemory({
      organizationId: params.organizationId,
      userId: params.userId,
      type: 'preference',
      content,
      importance: 'medium',
      source: 'user_input',
      tags: [params.category, 'preference'],
    });
  }

  /**
   * Learn from a correction
   */
  async learnFromCorrection(params: {
    organizationId: string;
    userId: string;
    agentId: string;
    originalOutput: string;
    correctedOutput: string;
    explanation?: string;
  }): Promise<{ memory: Memory; learning: LearningEvent }> {
    const lesson = params.explanation || 
      await this.extractLesson(params.originalOutput, params.correctedOutput);
    
    const content = `
Correction Learning:
Original: ${params.originalOutput.slice(0, 500)}
Corrected: ${params.correctedOutput.slice(0, 500)}
Lesson: ${lesson}
`.trim();
    
    const memory = await this.storeMemory({
      organizationId: params.organizationId,
      userId: params.userId,
      agentId: params.agentId,
      type: 'correction',
      content,
      importance: 'high',
      source: 'user_correction',
      tags: ['learning', 'correction'],
    });
    
    const learning: LearningEvent = {
      id: `learn-${Date.now()}`,
      organizationId: params.organizationId,
      agentId: params.agentId,
      eventType: 'correction',
      input: params.originalOutput,
      expectedOutput: params.correctedOutput,
      actualOutput: params.originalOutput,
      feedback: 'negative',
      lesson,
    };
    
    this.learnings.set(learning.id, learning);
    
    return { memory, learning };
  }

  /**
   * Record decision outcome for learning
   */
  async recordOutcome(params: {
    organizationId: string;
    decisionId: string;
    outcome: 'success' | 'failure' | 'partial' | 'pending';
    details: string;
    lessonsLearned?: string[];
  }): Promise<Memory> {
    const content = `
Decision Outcome:
Decision ID: ${params.decisionId}
Outcome: ${params.outcome}
Details: ${params.details}
${params.lessonsLearned ? `Lessons Learned:\n${params.lessonsLearned.map(l => `- ${l}`).join('\n')}` : ''}
`.trim();
    
    return this.storeMemory({
      organizationId: params.organizationId,
      type: 'outcome',
      content,
      importance: params.outcome === 'failure' ? 'critical' : 'high',
      source: 'outcome_tracking',
      decisionId: params.decisionId,
      tags: ['outcome', params.outcome],
    });
  }

  // ---------------------------------------------------------------------------
  // MEMORY RETRIEVAL
  // ---------------------------------------------------------------------------

  /**
   * Search memories with semantic matching
   */
  async searchMemories(query: MemoryQuery): Promise<MemorySearchResult[]> {
    const results: MemorySearchResult[] = [];
    const queryLower = query.query.toLowerCase();
    const queryTerms = queryLower.split(/\s+/).filter(t => t.length > 2);
    
    // Get candidate memories
    const orgMemoryIds = this.memoriesByOrg.get(query.organizationId) || [];
    
    for (const id of orgMemoryIds) {
      const memory = this.memories.get(id);
      if (!memory) continue;
      
      // Skip expired
      if (!query.includeExpired && memory.expiresAt && memory.expiresAt < new Date()) {
        continue;
      }
      
      // Type filter
      if (query.types && !query.types.includes(memory.type)) {
        continue;
      }
      
      // Importance filter
      if (query.minImportance) {
        const importanceOrder = { low: 0, medium: 1, high: 2, critical: 3 };
        if (importanceOrder[memory.importance] < importanceOrder[query.minImportance]) {
          continue;
        }
      }
      
      // Agent filter
      if (query.agentId && memory.agentId !== query.agentId) {
        continue;
      }
      
      // User filter
      if (query.userId && memory.userId !== query.userId) {
        continue;
      }
      
      // Tag filter
      if (query.tags && !query.tags.some(t => memory.metadata.tags.includes(t))) {
        continue;
      }
      
      // Calculate relevance
      const contentLower = memory.content.toLowerCase() + ' ' + memory.summary.toLowerCase();
      const matchedTerms: string[] = [];
      let relevance = 0;
      
      for (const term of queryTerms) {
        if (contentLower.includes(term)) {
          matchedTerms.push(term);
          relevance += 10;
        }
      }
      
      // Entity match bonus
      for (const entity of memory.metadata.entities) {
        if (queryLower.includes(entity.toLowerCase())) {
          relevance += 20;
          matchedTerms.push(entity);
        }
      }
      
      // Recency bonus
      const daysSinceCreation = (Date.now() - memory.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      relevance += Math.max(0, 10 - daysSinceCreation * 0.1);
      
      // Importance bonus
      const importanceBonus = { low: 0, medium: 5, high: 10, critical: 20 };
      relevance += importanceBonus[memory.importance];
      
      if (relevance > 0 || matchedTerms.length > 0) {
        results.push({ memory, relevance, matchedTerms });
      }
    }
    
    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance);
    
    // Update access tracking
    const limit = query.limit || 10;
    for (const result of results.slice(0, limit)) {
      result.memory.lastAccessedAt = new Date();
      result.memory.accessCount++;
    }
    
    return results.slice(0, limit);
  }

  /**
   * Get context for an agent query
   */
  async getAgentContext(params: {
    organizationId: string;
    agentId: string;
    userId?: string;
    query: string;
    maxMemories?: number;
  }): Promise<AgentContext> {
    const maxMemories = params.maxMemories || 10;
    
    // Get recent memories for this agent
    const agentKey = `${params.organizationId}:${params.agentId}`;
    const agentMemoryIds = this.memoriesByAgent.get(agentKey) || [];
    const recentMemories = agentMemoryIds
      .slice(0, 5)
      .map(id => this.memories.get(id))
      .filter((m): m is Memory => m !== undefined);
    
    // Search for relevant memories
    const searchResults = await this.searchMemories({
      query: params.query,
      organizationId: params.organizationId,
      agentId: params.agentId,
      limit: maxMemories,
    });
    
    // Get relevant decisions
    const decisionResults = await this.searchMemories({
      query: params.query,
      organizationId: params.organizationId,
      types: ['decision', 'outcome'],
      limit: 5,
    });
    
    // Get user preferences if user specified
    let userPreferences: Memory[] = [];
    if (params.userId) {
      const prefResults = await this.searchMemories({
        query: '',
        organizationId: params.organizationId,
        userId: params.userId,
        types: ['preference'],
        limit: 5,
      });
      userPreferences = prefResults.map(r => r.memory);
    }
    
    // Get entity context
    const entityResults = await this.searchMemories({
      query: params.query,
      organizationId: params.organizationId,
      types: ['entity', 'context'],
      limit: 5,
    });
    
    // Synthesize context for agent prompt
    const synthesizedContext = this.synthesizeContext({
      recentMemories,
      searchResults: searchResults.map(r => r.memory),
      decisions: decisionResults.map(r => r.memory),
      preferences: userPreferences,
      entities: entityResults.map(r => r.memory),
    });
    
    return {
      recentMemories,
      relevantDecisions: decisionResults.map(r => r.memory),
      userPreferences,
      entityContext: entityResults.map(r => r.memory),
      synthesizedContext,
    };
  }

  /**
   * Get memories related to a specific decision
   */
  async getDecisionContext(decisionId: string): Promise<Memory[]> {
    return Array.from(this.memories.values())
      .filter(m => m.metadata.decisionId === decisionId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  // ---------------------------------------------------------------------------
  // LEARNING
  // ---------------------------------------------------------------------------

  /**
   * Get learnings for an agent
   */
  async getAgentLearnings(organizationId: string, agentId: string): Promise<LearningEvent[]> {
    return Array.from(this.learnings.values())
      .filter(l => l.organizationId === organizationId && l.agentId === agentId)
      .sort((a, b) => b.id.localeCompare(a.id));
  }

  /**
   * Apply a learning to future responses
   */
  async applyLearning(learningId: string): Promise<void> {
    const learning = this.learnings.get(learningId);
    if (learning) {
      learning.appliedAt = new Date();
    }
  }

  // ---------------------------------------------------------------------------
  // HELPER METHODS
  // ---------------------------------------------------------------------------

  private async analyzeContent(content: string): Promise<{
    summary: string;
    entities: string[];
    sentiment: 'positive' | 'negative' | 'neutral';
  }> {
    // Generate summary
    const summary = content.length > 200 
      ? content.slice(0, 197) + '...'
      : content;
    
    // Extract entities (simple keyword extraction)
    const entityPatterns = [
      /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g, // Proper nouns
      /\$[\d,]+(?:\.\d{2})?(?:\s*(?:million|billion|M|B))?/g, // Money
      /\b(?:Q[1-4]|FY)\s*\d{2,4}\b/g, // Quarters/fiscal years
    ];
    
    const entities: Set<string> = new Set();
    for (const pattern of entityPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(m => entities.add(m));
      }
    }
    
    // Simple sentiment analysis
    const positiveWords = ['success', 'growth', 'profit', 'improvement', 'achieved', 'exceeded'];
    const negativeWords = ['failure', 'loss', 'decline', 'risk', 'issue', 'problem'];
    
    const lowerContent = content.toLowerCase();
    const positiveCount = positiveWords.filter(w => lowerContent.includes(w)).length;
    const negativeCount = negativeWords.filter(w => lowerContent.includes(w)).length;
    
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (positiveCount > negativeCount + 1) sentiment = 'positive';
    else if (negativeCount > positiveCount + 1) sentiment = 'negative';
    
    return {
      summary,
      entities: Array.from(entities).slice(0, 10),
      sentiment,
    };
  }

  private inferImportance(type: MemoryType, content: string): MemoryImportance {
    if (type === 'correction' || type === 'outcome') return 'high';
    if (type === 'decision') return 'high';
    if (content.length > 1000) return 'medium';
    return 'low';
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    // Check cache
    const cacheKey = text.slice(0, 100);
    const cached = this.embeddingCache.get(cacheKey);
    if (cached) return cached;
    
    try {
      const embedding = await ollama.embed(text, 'nomic-embed-text');
      this.embeddingCache.set(cacheKey, embedding);
      return embedding;
    } catch (error) {
      // Return empty array if embedding fails
      return [];
    }
  }

  private async extractLesson(original: string, corrected: string): Promise<string> {
    const prompt = `Compare these two outputs and extract the key lesson:

ORIGINAL: ${original.slice(0, 500)}

CORRECTED: ${corrected.slice(0, 500)}

What is the key difference and lesson learned? Be concise (1-2 sentences).`;

    try {
      return await ollama.generate(prompt, {
        model: 'llama3.2',
        options: { temperature: 0.3, num_predict: 100 },
      });
    } catch {
      return 'User preferred a different approach. Review both outputs for context.';
    }
  }

  private synthesizeContext(params: {
    recentMemories: Memory[];
    searchResults: Memory[];
    decisions: Memory[];
    preferences: Memory[];
    entities: Memory[];
  }): string {
    const parts: string[] = [];
    
    if (params.preferences.length > 0) {
      parts.push(`USER PREFERENCES:\n${params.preferences.map(p => `- ${p.summary}`).join('\n')}`);
    }
    
    if (params.decisions.length > 0) {
      parts.push(`RELEVANT PAST DECISIONS:\n${params.decisions.map(d => `- ${d.summary}`).join('\n')}`);
    }
    
    if (params.entities.length > 0) {
      parts.push(`CONTEXT:\n${params.entities.map(e => `- ${e.summary}`).join('\n')}`);
    }
    
    if (params.searchResults.length > 0) {
      parts.push(`RELATED MEMORIES:\n${params.searchResults.slice(0, 3).map(m => `- ${m.summary}`).join('\n')}`);
    }
    
    return parts.join('\n\n');
  }

  // ---------------------------------------------------------------------------
  // MAINTENANCE
  // ---------------------------------------------------------------------------

  /**
   * Clean up expired memories
   */
  async cleanupExpired(): Promise<number> {
    const now = new Date();
    let cleaned = 0;
    
    for (const [id, memory] of this.memories.entries()) {
      if (memory.expiresAt && memory.expiresAt < now) {
        this.memories.delete(id);
        cleaned++;
      }
    }
    
    this.logger.info(`Cleaned up ${cleaned} expired memories`);
    return cleaned;
  }

  /**
   * Get memory statistics
   */
  async getStatistics(organizationId: string): Promise<{
    totalMemories: number;
    byType: Record<string, number>;
    byImportance: Record<string, number>;
    learnings: number;
    avgAccessCount: number;
  }> {
    const orgMemories = Array.from(this.memories.values())
      .filter(m => m.organizationId === organizationId);
    
    const byType: Record<string, number> = {};
    const byImportance: Record<string, number> = {};
    let totalAccess = 0;
    
    for (const memory of orgMemories) {
      byType[memory.type] = (byType[memory.type] || 0) + 1;
      byImportance[memory.importance] = (byImportance[memory.importance] || 0) + 1;
      totalAccess += memory.accessCount;
    }
    
    const orgLearnings = Array.from(this.learnings.values())
      .filter(l => l.organizationId === organizationId);
    
    return {
      totalMemories: orgMemories.length,
      byType,
      byImportance,
      learnings: orgLearnings.length,
      avgAccessCount: orgMemories.length > 0 ? totalAccess / orgMemories.length : 0,
    };
  }
}

// Export singleton
export const pantheonMemoryService = new PantheonMemoryService();
