// =============================================================================
// DATACENDIA PLATFORM - ENHANCED LLM SERVICE
// Advanced LLM capabilities: RAG, Caching, Smart Routing, CoT, Ensemble
// =============================================================================

import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
import { cache, pubsub } from '../config/redis.js';
import { prisma } from '../config/database.js';
import crypto from 'crypto';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface ModelConfig {
  id: string;
  contextWindow: number;
  temperature: number;
  topP: number;
  topK: number;
  repeatPenalty: number;
  numPredict: number;
  specialization: ModelSpecialization[];
}

export type ModelSpecialization = 
  | 'general'
  | 'reasoning'
  | 'coding'
  | 'analysis'
  | 'creative'
  | 'fast'
  | 'vision'
  | 'math'
  | 'legal'
  | 'medical'
  | 'financial'
  | 'simple';

export interface EnhancedGenerateOptions {
  model?: string;
  temperature?: number;
  topP?: number;
  topK?: number;
  maxTokens?: number;
  systemPrompt?: string;
  useRAG?: boolean;
  ragCollection?: string;
  ragTopK?: number;
  useCache?: boolean;
  cacheTTL?: number;
  useChainOfThought?: boolean;
  useEnsemble?: boolean;
  ensembleModels?: string[];
  ensembleStrategy?: 'vote' | 'blend' | 'best';
  stream?: boolean;
  format?: 'json' | 'markdown' | 'plain';
  agentId?: string;
}

export interface RAGContext {
  content: string;
  source: string;
  similarity: number;
  metadata?: Record<string, unknown>;
}

export interface EnsembleResult {
  responses: Array<{
    model: string;
    response: string;
    confidence: number;
    duration: number;
  }>;
  finalResponse: string;
  strategy: string;
  agreement: number;
}

export interface QueryClassification {
  type: 'reasoning' | 'coding' | 'creative' | 'factual' | 'analysis' | 'simple';
  complexity: 'low' | 'medium' | 'high';
  domain: string[];
  suggestedModel: string;
  confidence: number;
}

// =============================================================================
// MODEL CONFIGURATIONS - Optimized Per-Model Parameters
// =============================================================================

export const MODEL_CONFIGS: Record<string, ModelConfig> = {
  // Flagship - General Intelligence
  'qwen2.5:7b': {
    id: 'qwen2.5:7b',
    contextWindow: 128000,
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    repeatPenalty: 1.1,
    numPredict: 4096,
    specialization: ['general', 'creative', 'analysis'],
  },
  
  // Reasoning Engine - Deep Logic
  'qwq:32b': {
    id: 'qwq:32b',
    contextWindow: 32768,
    temperature: 0.3,  // Lower for precise reasoning
    topP: 0.85,
    topK: 20,          // More focused sampling
    repeatPenalty: 1.15,
    numPredict: 8192,  // Allow longer reasoning chains
    specialization: ['reasoning', 'math', 'analysis'],
  },
  
  // Coding Specialist
  'qwen2.5-coder:32b': {
    id: 'qwen2.5-coder:32b',
    contextWindow: 32768,
    temperature: 0.1,  // Very low for code precision
    topP: 0.95,
    topK: 10,          // Most focused
    repeatPenalty: 1.05,
    numPredict: 8192,
    specialization: ['coding'],
  },
  
  // Speed Demon - Quick Responses
  'llama3.2:3b': {
    id: 'llama3.2:3b',
    contextWindow: 8192,
    temperature: 0.5,
    topP: 0.9,
    topK: 40,
    repeatPenalty: 1.1,
    numPredict: 1024,
    specialization: ['fast', 'simple'],
  },
  
  // Analysis Heavy
  'llama3:70b': {
    id: 'llama3:70b',
    contextWindow: 8192,
    temperature: 0.6,
    topP: 0.9,
    topK: 40,
    repeatPenalty: 1.1,
    numPredict: 4096,
    specialization: ['general', 'analysis'],
  },
  
  // Mixture of Experts
  'mixtral:8x22b': {
    id: 'mixtral:8x22b',
    contextWindow: 65536,
    temperature: 0.7,
    topP: 0.9,
    topK: 50,
    repeatPenalty: 1.1,
    numPredict: 4096,
    specialization: ['general', 'creative', 'analysis'],
  },
  
  // Vision Model
  'llava:34b': {
    id: 'llava:34b',
    contextWindow: 4096,
    temperature: 0.5,
    topP: 0.9,
    topK: 40,
    repeatPenalty: 1.1,
    numPredict: 2048,
    specialization: ['vision'],
  },
};

// Agent to optimal model mapping
const AGENT_MODEL_PREFERENCES: Record<string, string[]> = {
  chief: ['qwen2.5:7b', 'llama3:70b', 'mixtral:8x22b'],
  cfo: ['qwen2.5:7b', 'qwq:32b', 'llama3:70b'],
  coo: ['llama3.2:3b', 'qwen2.5:7b'],
  ciso: ['qwq:32b', 'qwen2.5:7b'],
  cmo: ['qwen2.5:7b', 'mixtral:8x22b'],
  cro: ['qwen2.5:7b', 'llama3:70b'],
  cdo: ['qwen2.5-coder:32b', 'qwen2.5:7b'],
  risk: ['qwq:32b', 'qwen2.5:7b'],
  cto: ['qwen2.5-coder:32b', 'qwen2.5:7b'],
  chro: ['qwen2.5:7b', 'llama3:70b'],
  clo: ['qwen2.5:7b', 'qwq:32b'],
  cio: ['qwen2.5-coder:32b', 'qwen2.5:7b'],
  // Industry agents
  quant: ['qwq:32b', 'qwen2.5-coder:32b'],
  pm: ['qwen2.5:7b', 'qwq:32b'],
  'cro-finance': ['qwq:32b', 'qwen2.5:7b'],
  treasury: ['qwen2.5:7b', 'qwq:32b'],
  cmio: ['qwen2.5:7b', 'llama3:70b'],
  pso: ['qwq:32b', 'qwen2.5:7b'],
  hco: ['qwen2.5:7b', 'qwq:32b'],
  cod: ['llama3.2:3b', 'qwen2.5:7b'],
  contracts: ['qwen2.5:7b', 'qwq:32b'],
  ip: ['qwen2.5:7b', 'qwq:32b'],
  litigation: ['qwq:32b', 'qwen2.5:7b'],
  regulatory: ['qwen2.5:7b', 'qwq:32b'],
};

// =============================================================================
// CHAIN OF THOUGHT TEMPLATES
// =============================================================================

const COT_TEMPLATES: Record<string, string> = {
  reasoning: `Think through this step-by-step:

1. **Understanding**: First, let me understand what's being asked...
2. **Analysis**: Breaking this down into components...
3. **Evidence**: The relevant facts and data are...
4. **Reasoning**: Applying logic to these facts...
5. **Conclusion**: Therefore, my conclusion is...

Now applying this framework:`,

  financial: `Let me analyze this financial question systematically:

1. **Key Metrics**: Identifying relevant financial indicators...
2. **Historical Context**: Looking at trends and patterns...
3. **Risk Assessment**: Evaluating potential downsides...
4. **Opportunity Analysis**: Considering upsides...
5. **Recommendation**: Based on this analysis...

Proceeding with analysis:`,

  technical: `Let me work through this technical problem:

1. **Requirements**: What exactly needs to be solved...
2. **Constraints**: Technical limitations to consider...
3. **Options**: Possible approaches...
4. **Trade-offs**: Pros and cons of each option...
5. **Solution**: The recommended approach is...

Beginning analysis:`,

  risk: `Conducting systematic risk analysis:

1. **Risk Identification**: What could go wrong...
2. **Probability Assessment**: Likelihood of each risk (0-100%)...
3. **Impact Analysis**: Severity if risk materializes...
4. **Mitigation Options**: How to reduce risk...
5. **Residual Risk**: Remaining exposure after mitigation...

Starting risk assessment:`,

  legal: `Analyzing this legal matter:

1. **Issue Spotting**: Identifying legal issues at play...
2. **Applicable Law**: Relevant statutes, regulations, precedent...
3. **Analysis**: Applying law to facts...
4. **Risks**: Legal exposure and likelihood...
5. **Recommendation**: Suggested course of action...

Beginning legal analysis:`,
};

// =============================================================================
// ENHANCED LLM SERVICE
// =============================================================================

export class EnhancedLLMService {
  private baseUrl: string;
  private defaultModel: string;
  private availableModels: Set<string> = new Set();
  private modelLoadTimes: Map<string, number> = new Map();
  
  constructor() {
    this.baseUrl = config.ollamaBaseUrl || 'http://localhost:11434';
    this.defaultModel = config.ollamaModel || 'qwen2.5:7b';
  }

  // ===========================================================================
  // INITIALIZATION
  // ===========================================================================

  async initialize(): Promise<void> {
    try {
      const models = await this.listAvailableModels();
      this.availableModels = new Set(models.map(m => m.name));
      logger.info(`EnhancedLLM initialized with ${this.availableModels.size} models`);
    } catch (error) {
      logger.error('Failed to initialize EnhancedLLM:', error);
    }
  }

  async listAvailableModels(): Promise<Array<{ name: string; size: number }>> {
    const response = await fetch(`${this.baseUrl}/api/tags`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json() as { models: Array<{ name: string; size: number }> };
    return data.models;
  }

  // ===========================================================================
  // SMART MODEL ROUTING
  // ===========================================================================

  /**
   * Classify a query to determine optimal model and approach
   */
  async classifyQuery(query: string): Promise<QueryClassification> {
    // Quick heuristics for common patterns
    const lowerQuery = query.toLowerCase();
    
    // Coding detection
    if (this.containsCodePatterns(lowerQuery)) {
      return {
        type: 'coding',
        complexity: this.estimateComplexity(query),
        domain: ['technology'],
        suggestedModel: 'qwen2.5-coder:32b',
        confidence: 0.9,
      };
    }
    
    // Math/reasoning detection
    if (this.containsMathPatterns(lowerQuery)) {
      return {
        type: 'reasoning',
        complexity: 'high',
        domain: ['mathematics', 'analysis'],
        suggestedModel: 'qwq:32b',
        confidence: 0.85,
      };
    }
    
    // Financial analysis
    if (this.containsFinancialPatterns(lowerQuery)) {
      return {
        type: 'analysis',
        complexity: 'high',
        domain: ['finance'],
        suggestedModel: 'qwq:32b',
        confidence: 0.85,
      };
    }
    
    // Legal/compliance
    if (this.containsLegalPatterns(lowerQuery)) {
      return {
        type: 'reasoning',
        complexity: 'high',
        domain: ['legal'],
        suggestedModel: 'qwen2.5:7b',
        confidence: 0.8,
      };
    }
    
    // Simple/quick queries
    if (query.length < 100 && !query.includes('\n')) {
      return {
        type: 'simple',
        complexity: 'low',
        domain: ['general'],
        suggestedModel: 'llama3.2:3b',
        confidence: 0.7,
      };
    }
    
    // Default to flagship
    return {
      type: 'factual',
      complexity: this.estimateComplexity(query),
      domain: ['general'],
      suggestedModel: 'qwen2.5:7b',
      confidence: 0.6,
    };
  }

  private containsCodePatterns(query: string): boolean {
    const patterns = [
      'code', 'function', 'class', 'sql', 'query', 'api', 'json',
      'javascript', 'typescript', 'python', 'java', 'const ', 'let ',
      'select ', 'insert ', 'update ', 'delete ', 'create table',
      'implement', 'debug', 'error', 'exception', 'bug', 'syntax',
    ];
    return patterns.some(p => query.includes(p));
  }

  private containsMathPatterns(query: string): boolean {
    const patterns = [
      'calculate', 'compute', 'formula', 'equation', 'probability',
      'statistics', 'regression', 'derivative', 'integral', 'matrix',
      'var ', 'standard deviation', 'correlation', 'percentage',
    ];
    return patterns.some(p => query.includes(p));
  }

  private containsFinancialPatterns(query: string): boolean {
    const patterns = [
      'roi', 'revenue', 'profit', 'margin', 'ebitda', 'cashflow',
      'valuation', 'dcf', 'npv', 'irr', 'investment', 'portfolio',
      'risk-adjusted', 'sharpe', 'hedge', 'derivative', 'option',
    ];
    return patterns.some(p => query.includes(p));
  }

  private containsLegalPatterns(query: string): boolean {
    const patterns = [
      'contract', 'clause', 'liability', 'compliance', 'regulation',
      'hipaa', 'gdpr', 'sec', 'patent', 'trademark', 'lawsuit',
      'litigation', 'indemnif', 'warranty', 'jurisdiction',
    ];
    return patterns.some(p => query.includes(p));
  }

  private estimateComplexity(query: string): 'low' | 'medium' | 'high' {
    const words = query.split(/\s+/).length;
    const sentences = query.split(/[.!?]+/).length;
    const hasLists = query.includes('\n') || query.includes('•') || query.includes('-');
    
    if (words > 200 || sentences > 5 || hasLists) return 'high';
    if (words > 50 || sentences > 2) return 'medium';
    return 'low';
  }

  /**
   * Select optimal model based on query and agent
   */
  selectOptimalModel(query: string, agentId?: string, classification?: QueryClassification): string {
    // If agent specified, use agent preferences
    if (agentId && AGENT_MODEL_PREFERENCES[agentId]) {
      const preferred = AGENT_MODEL_PREFERENCES[agentId];
      for (const model of preferred) {
        if (this.availableModels.has(model)) {
          return model;
        }
      }
    }
    
    // Use classification if available
    if (classification?.suggestedModel && this.availableModels.has(classification.suggestedModel)) {
      return classification.suggestedModel;
    }
    
    // Fallback to default
    return this.defaultModel;
  }

  // ===========================================================================
  // RAG - RETRIEVAL AUGMENTED GENERATION
  // ===========================================================================

  /**
   * Generate embeddings using Ollama
   */
  async generateEmbedding(text: string, model: string = 'nomic-embed-text'): Promise<number[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/embeddings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, prompt: text }),
      });
      
      if (!response.ok) {
        throw new Error(`Embedding failed: HTTP ${response.status}`);
      }
      
      const data = await response.json() as { embedding: number[] };
      return data.embedding;
    } catch (error) {
      logger.error('Embedding generation failed:', error);
      throw error;
    }
  }

  /**
   * Retrieve relevant context from pgvector
   */
  async retrieveContext(
    query: string,
    collection: string = 'documents',
    topK: number = 5,
    minSimilarity: number = 0.7
  ): Promise<RAGContext[]> {
    try {
      // Generate query embedding
      const queryEmbedding = await this.generateEmbedding(query);
      
      // Search pgvector using raw SQL (Prisma + pgvector)
      const results = await prisma.$queryRaw<Array<{
        content: string;
        source: string;
        metadata: string;
        similarity: number;
      }>>`
        SELECT 
          content,
          source,
          metadata::text,
          1 - (embedding <=> ${queryEmbedding}::vector) as similarity
        FROM embeddings
        WHERE collection = ${collection}
          AND 1 - (embedding <=> ${queryEmbedding}::vector) > ${minSimilarity}
        ORDER BY embedding <=> ${queryEmbedding}::vector
        LIMIT ${topK}
      `;
      
      return results.map(r => ({
        content: r.content,
        source: r.source,
        similarity: r.similarity,
        metadata: r.metadata ? JSON.parse(r.metadata) : undefined,
      }));
    } catch (error) {
      logger.warn('RAG retrieval failed, continuing without context:', error);
      return [];
    }
  }

  /**
   * Store document with embedding for RAG
   */
  async storeDocument(
    content: string,
    source: string,
    collection: string = 'documents',
    metadata?: Record<string, unknown>
  ): Promise<void> {
    try {
      const embedding = await this.generateEmbedding(content);
      
      await prisma.$executeRaw`
        INSERT INTO embeddings (content, source, collection, embedding, metadata, created_at)
        VALUES (
          ${content},
          ${source},
          ${collection},
          ${embedding}::vector,
          ${JSON.stringify(metadata || {})}::jsonb,
          NOW()
        )
      `;
      
      logger.info(`Stored document: ${source} in collection ${collection}`);
    } catch (error) {
      logger.error('Failed to store document:', error);
      throw error;
    }
  }

  // ===========================================================================
  // CACHING
  // ===========================================================================

  /**
   * Generate cache key for a query
   */
  private generateCacheKey(prompt: string, options: EnhancedGenerateOptions): string {
    const hash = crypto.createHash('sha256');
    hash.update(prompt);
    hash.update(JSON.stringify({
      model: options.model,
      temperature: options.temperature,
      agentId: options.agentId,
    }));
    return `llm:response:${hash.digest('hex').substring(0, 16)}`;
  }

  /**
   * Get cached response
   */
  async getCachedResponse(key: string): Promise<string | null> {
    try {
      return await cache.get(key);
    } catch {
      return null;
    }
  }

  /**
   * Cache a response
   */
  async cacheResponse(key: string, response: string, ttl: number = 3600): Promise<void> {
    try {
      await cache.set(key, response);
      await cache.expire(key, ttl);
    } catch (error) {
      logger.warn('Failed to cache response:', error);
    }
  }

  // ===========================================================================
  // CHAIN OF THOUGHT
  // ===========================================================================

  /**
   * Wrap prompt with Chain of Thought template
   */
  wrapWithChainOfThought(prompt: string, domain?: string): string {
    const template = domain && COT_TEMPLATES[domain] 
      ? COT_TEMPLATES[domain]
      : COT_TEMPLATES.reasoning;
    
    return `${template}

**Question/Task:**
${prompt}

**Step-by-Step Analysis:**`;
  }

  // ===========================================================================
  // ENSEMBLE GENERATION
  // ===========================================================================

  /**
   * Generate responses from multiple models and combine
   */
  async generateEnsemble(
    prompt: string,
    systemPrompt: string,
    models: string[],
    strategy: 'vote' | 'blend' | 'best' = 'blend'
  ): Promise<EnsembleResult> {
    const startTime = Date.now();
    
    // Generate from all models in parallel
    const responses = await Promise.all(
      models.filter(m => this.availableModels.has(m)).map(async (model) => {
        const modelStart = Date.now();
        try {
          const response = await this.generateRaw(prompt, {
            model,
            systemPrompt,
            temperature: MODEL_CONFIGS[model]?.temperature || 0.7,
          });
          return {
            model,
            response,
            confidence: this.estimateResponseConfidence(response),
            duration: Date.now() - modelStart,
          };
        } catch (error) {
          logger.error(`Ensemble model ${model} failed:`, error);
          return {
            model,
            response: '',
            confidence: 0,
            duration: Date.now() - modelStart,
          };
        }
      })
    );
    
    // Filter out failed responses
    const validResponses = responses.filter(r => r.response.length > 0);
    
    if (validResponses.length === 0) {
      throw new Error('All ensemble models failed');
    }
    
    // Combine based on strategy
    let finalResponse: string;
    let agreement = 1;
    
    switch (strategy) {
      case 'vote':
        // Find most common key points
        finalResponse = this.combineByVoting(validResponses);
        agreement = this.calculateAgreement(validResponses);
        break;
        
      case 'best':
        // Pick highest confidence response
        const best = validResponses.reduce((a, b) => a.confidence > b.confidence ? a : b);
        finalResponse = best.response;
        agreement = best.confidence;
        break;
        
      case 'blend':
      default:
        // Synthesize all responses
        finalResponse = await this.synthesizeResponses(validResponses, prompt);
        agreement = this.calculateAgreement(validResponses);
        break;
    }
    
    return {
      responses: validResponses,
      finalResponse,
      strategy,
      agreement,
    };
  }

  private estimateResponseConfidence(response: string): number {
    // Heuristic confidence based on response quality indicators
    let confidence = 0.5;
    
    // Length bonus (not too short, not too long)
    const words = response.split(/\s+/).length;
    if (words > 50 && words < 500) confidence += 0.1;
    if (words > 100 && words < 300) confidence += 0.1;
    
    // Structure bonus
    if (response.includes('\n')) confidence += 0.05;
    if (response.includes('1.') || response.includes('•')) confidence += 0.05;
    
    // Hedging penalty
    const hedges = ['might', 'maybe', 'perhaps', 'possibly', 'uncertain'];
    hedges.forEach(h => {
      if (response.toLowerCase().includes(h)) confidence -= 0.02;
    });
    
    // Confidence indicators
    const confident = ['clearly', 'definitely', 'certainly', 'specifically'];
    confident.forEach(c => {
      if (response.toLowerCase().includes(c)) confidence += 0.02;
    });
    
    return Math.max(0, Math.min(1, confidence));
  }

  private combineByVoting(responses: Array<{ response: string; confidence: number }>): string {
    // For voting, just pick the one with highest confidence
    // More sophisticated voting would extract key points
    return responses.reduce((a, b) => a.confidence > b.confidence ? a : b).response;
  }

  private calculateAgreement(responses: Array<{ response: string }>): number {
    if (responses.length < 2) return 1;
    
    // Simple word overlap as agreement metric
    const wordSets = responses.map(r => 
      new Set(r.response.toLowerCase().split(/\s+/).filter(w => w.length > 4))
    );
    
    let totalOverlap = 0;
    let comparisons = 0;
    
    for (let i = 0; i < wordSets.length; i++) {
      for (let j = i + 1; j < wordSets.length; j++) {
        const intersection = [...wordSets[i]].filter(w => wordSets[j].has(w)).length;
        const union = new Set([...wordSets[i], ...wordSets[j]]).size;
        totalOverlap += intersection / union;
        comparisons++;
      }
    }
    
    return comparisons > 0 ? totalOverlap / comparisons : 1;
  }

  private async synthesizeResponses(
    responses: Array<{ model: string; response: string; confidence: number }>,
    originalPrompt: string
  ): Promise<string> {
    const synthesisPrompt = `You are synthesizing multiple expert responses into one coherent answer.

**Original Question:** ${originalPrompt}

**Expert Responses:**
${responses.map((r, i) => `
---
**Expert ${i + 1} (${r.model}, confidence: ${(r.confidence * 100).toFixed(0)}%):**
${r.response}
`).join('\n')}

**Your Task:**
Synthesize these responses into a single, comprehensive answer that:
1. Incorporates the strongest points from each expert
2. Resolves any contradictions by noting them
3. Provides a unified recommendation
4. Notes areas of agreement and disagreement

**Synthesized Response:**`;

    return this.generateRaw(synthesisPrompt, {
      model: 'qwen2.5:7b',
      temperature: 0.5,
    });
  }

  // ===========================================================================
  // CORE GENERATION
  // ===========================================================================

  /**
   * Raw generation without enhancements
   */
  async generateRaw(
    prompt: string,
    options: {
      model?: string;
      systemPrompt?: string;
      temperature?: number;
      maxTokens?: number;
      format?: 'json';
    } = {}
  ): Promise<string> {
    const model = options.model || this.defaultModel;
    const modelConfig = MODEL_CONFIGS[model] || MODEL_CONFIGS[this.defaultModel];
    
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [
          ...(options.systemPrompt ? [{ role: 'system', content: options.systemPrompt }] : []),
          { role: 'user', content: prompt },
        ],
        stream: false,
        format: options.format,
        options: {
          temperature: options.temperature ?? modelConfig.temperature,
          top_p: modelConfig.topP,
          top_k: modelConfig.topK,
          repeat_penalty: modelConfig.repeatPenalty,
          num_predict: options.maxTokens ?? modelConfig.numPredict,
        },
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Ollama API error: HTTP ${response.status}`);
    }
    
    const data = await response.json() as { message: { content: string } };
    return data.message.content;
  }

  /**
   * Enhanced generation with all features
   */
  async generate(prompt: string, options: EnhancedGenerateOptions = {}): Promise<string> {
    const startTime = Date.now();
    
    // 1. Check cache if enabled
    if (options.useCache !== false) {
      const cacheKey = this.generateCacheKey(prompt, options);
      const cached = await this.getCachedResponse(cacheKey);
      if (cached) {
        logger.debug('Cache hit for LLM query');
        return cached;
      }
    }
    
    // 2. Classify query for smart routing
    const classification = await this.classifyQuery(prompt);
    
    // 3. Select optimal model
    const model = options.model || this.selectOptimalModel(prompt, options.agentId, classification);
    
    // 4. Retrieve RAG context if enabled
    let ragContext: RAGContext[] = [];
    if (options.useRAG) {
      ragContext = await this.retrieveContext(
        prompt,
        options.ragCollection,
        options.ragTopK || 5
      );
    }
    
    // 5. Build enhanced prompt
    let enhancedPrompt = prompt;
    
    // Add RAG context
    if (ragContext.length > 0) {
      const contextStr = ragContext.map(c => 
        `[Source: ${c.source}]\n${c.content}`
      ).join('\n\n---\n\n');
      
      enhancedPrompt = `**Relevant Context:**
${contextStr}

**Question:**
${prompt}

Use the context above to inform your response, but also apply your own knowledge and reasoning.`;
    }
    
    // Add Chain of Thought if enabled
    if (options.useChainOfThought) {
      const domain = classification.domain[0] || 'reasoning';
      enhancedPrompt = this.wrapWithChainOfThought(enhancedPrompt, domain);
    }
    
    // 6. Generate response (ensemble or single)
    let response: string;
    
    if (options.useEnsemble && options.ensembleModels?.length) {
      const ensembleResult = await this.generateEnsemble(
        enhancedPrompt,
        options.systemPrompt || '',
        options.ensembleModels,
        options.ensembleStrategy || 'blend'
      );
      response = ensembleResult.finalResponse;
    } else {
      response = await this.generateRaw(enhancedPrompt, {
        model,
        systemPrompt: options.systemPrompt,
        temperature: options.temperature,
        maxTokens: options.maxTokens,
        format: options.format === 'json' ? 'json' : undefined,
      });
    }
    
    // 7. Cache response if enabled
    if (options.useCache !== false) {
      const cacheKey = this.generateCacheKey(prompt, options);
      await this.cacheResponse(cacheKey, response, options.cacheTTL || 3600);
    }
    
    const duration = Date.now() - startTime;
    logger.debug(`Enhanced LLM generation completed in ${duration}ms using ${model}`);
    
    return response;
  }

  /**
   * Generate for a specific agent with optimal settings
   */
  async generateForAgent(
    agentId: string,
    prompt: string,
    systemPrompt: string,
    options: Partial<EnhancedGenerateOptions> = {}
  ): Promise<string> {
    const classification = await this.classifyQuery(prompt);
    
    // Determine if this needs chain of thought
    const needsCoT = classification.complexity === 'high' || 
                     ['reasoning', 'analysis'].includes(classification.type);
    
    // Determine if ensemble would help
    const useEnsemble = classification.complexity === 'high' && 
                        options.useEnsemble !== false;
    
    return this.generate(prompt, {
      agentId,
      systemPrompt,
      useCache: true,
      useRAG: options.useRAG,
      useChainOfThought: needsCoT,
      useEnsemble,
      ensembleModels: useEnsemble ? AGENT_MODEL_PREFERENCES[agentId] : undefined,
      ensembleStrategy: 'blend',
      ...options,
    });
  }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

export const enhancedLLM = new EnhancedLLMService();
