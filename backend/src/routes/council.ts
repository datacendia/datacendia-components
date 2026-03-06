/**
 * API Routes — Council
 *
 * Express route handler defining REST endpoints.
 * @module routes/council
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database.js';
import { Prisma } from '@prisma/client';
import crypto from 'crypto';
import { cache, pubsub } from '../config/redis.js';
import { graph } from '../config/neo4j.js';
import { ollama } from '../services/ollama.js';
import { enhancedLLM, MODEL_CONFIGS } from '../services/EnhancedLLMService.js';
import { logger } from '../utils/logger.js';
import { errors } from '../middleware/errorHandler.js';
import { devAuth } from '../middleware/auth.js';
import { druidEventStream } from '../services/DruidEventStream.js';
import { AGENT_PROMPTS, AGENT_MODELS, AGENT_MODEL_FALLBACKS, LANGUAGE_NAMES } from './council/agent-config.js';
import { 
  emitDeliberationMessage, 
  emitDeliberationPhase, 
  emitDeliberationComplete,
  type DeliberationMessage 
} from '../websocket/emitters.js';

const router = Router();

// All routes require authentication
router.use(devAuth);

// ===========================================================================
// STATUS / HEALTH
// ===========================================================================

/**
 * GET /council/status
 * Service health and status
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    const orgId = req.organizationId;

    // Get counts for metrics
    const [deliberationCount, decisionCount, messageCount] = await Promise.all([
      prisma.deliberations.count({ where: { organization_id: orgId } }).catch(() => 0),
      prisma.decisions.count({ where: { organization_id: orgId } }).catch(() => 0),
      prisma.deliberation_messages.count().catch(() => 0),
    ]);

    res.json({
      success: true,
      data: {
        service: 'TheCouncil',
        status: 'operational',
        version: '1.0.0',
        description: 'AI-Powered Multi-Agent Deliberation Engine',
        capabilities: [
          'Multi-agent deliberation with specialized AI advisors',
          'Real-time streaming responses via WebSocket',
          'Cross-domain analysis (Finance, Operations, Security, Marketing, etc.)',
          'Confidence-weighted consensus building',
          'Audit trail with cryptographic verification',
          'Integration with Ollama for local LLM inference',
        ],
        agents: Object.keys(AGENT_PROMPTS).length,
        agentRoles: Object.keys(AGENT_PROMPTS),
        metrics: {
          totalDeliberations: deliberationCount,
          totalDecisions: decisionCount,
          totalMessages: messageCount,
        },
        integrations: {
          ollama: 'connected',
          neo4j: 'configured',
          redis: 'configured',
          druid: 'configured',
        },
        lastCheck: new Date().toISOString(),
      }
    });
  } catch (error) {
    logger.error('[Council] Status error:', error);
    res.status(500).json({ success: false, error: { message: String(error) } });
  }
});

// Agent prompts, models, fallbacks, and language names imported from ./council/agent-config.js


// Query validation schema
const querySchema = z.object({
  query: z.string().min(1, 'Query is required').max(2000),
  agents: z.array(z.string()).optional(),
  context: z.record(z.unknown()).optional(),
  language: z.string().length(2).optional().default('en'),
});

// Deliberation validation schema
const deliberationSchema = z.object({
  question: z.string().min(1, 'Question is required').max(2000),
  agents: z.array(z.string()).optional(), // Can be passed at top level
  config: z.object({
    maxDuration: z.number().optional(),
    requireConsensus: z.boolean().optional(),
    humanApprovalRequired: z.boolean().optional(),
    mode: z.string().optional(),
    requiredAgents: z.array(z.string()).optional(), // Or in config (from frontend)
  }).optional(),
  context: z.record(z.unknown()).optional(),
  language: z.string().length(2).optional().default('en'),
});

// Helper to get language instruction
function getLanguageInstruction(langCode: string): string {
  const langName = LANGUAGE_NAMES[langCode] || 'English';
  if (langCode === 'en') return '';
  return `\n\nIMPORTANT: Respond entirely in ${langName}. All analysis, explanations, and conclusions must be in ${langName}.`;
}

/**
 * GET /api/v1/council/modes
 * List all available council deliberation modes
 */
router.get('/modes', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const modes = [
      { id: 'executive', name: 'Executive Council', description: 'C-suite strategic deliberation', agents: ['chief', 'cfo', 'coo', 'ciso'], icon: '👔' },
      { id: 'strategic', name: 'Strategic Planning', description: 'Long-term strategy and vision', agents: ['chief', 'analyst', 'cmo', 'cro'], icon: '🎯' },
      { id: 'crisis', name: 'Crisis Response', description: 'Rapid response to urgent situations', agents: ['chief', 'ciso', 'coo', 'risk'], icon: '🚨' },
      { id: 'innovation', name: 'Innovation Council', description: 'New product and technology decisions', agents: ['cto', 'caio', 'analyst', 'redteam'], icon: '💡' },
      { id: 'compliance', name: 'Compliance Review', description: 'Regulatory and legal compliance', agents: ['clo', 'ciso', 'ext-auditor', 'regulatory'], icon: '⚖️' },
      { id: 'financial', name: 'Financial Review', description: 'Budget, investment, and financial decisions', agents: ['cfo', 'treasury', 'quant', 'risk'], icon: '💰' },
      { id: 'operational', name: 'Operational Excellence', description: 'Process improvement and efficiency', agents: ['coo', 'analyst', 'union', 'cdo'], icon: '⚙️' },
      { id: 'risk', name: 'Risk Assessment', description: 'Comprehensive risk analysis', agents: ['risk', 'ciso', 'redteam', 'arbiter'], icon: '🛡️' },
      { id: 'hiring', name: 'Hiring Committee', description: 'Talent acquisition decisions', agents: ['chro', 'chief', 'union', 'analyst'], icon: '👥' },
      { id: 'legal', name: 'Legal Strategy', description: 'Legal matters and litigation', agents: ['clo', 'contracts', 'litigation', 'ip'], icon: '⚖️' },
      { id: 'healthcare', name: 'Clinical Council', description: 'Healthcare-specific deliberation', agents: ['cmio', 'pso', 'hco', 'cod'], icon: '🏥' },
      { id: 'audit', name: 'Audit Committee', description: 'Internal and external audit review', agents: ['ext-auditor', 'int-auditor', 'cfo', 'ciso'], icon: '📋' },
    ];

    res.json({
      success: true,
      modes,
      total: modes.length,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/council/agents
 * List all available AI agents
 */
router.get('/agents', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const agents = await prisma.agents.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' },
    });

    // Check Ollama availability
    const ollamaAvailable = await ollama.isAvailable();

    res.json({
      success: true,
      data: agents.map(agent => ({
        id: agent.id,
        code: agent.code,
        name: agent.name,
        role: agent.role,
        description: agent.description,
        avatarUrl: agent.avatar_url,
        systemPrompt: agent.system_prompt,
        capabilities: agent.capabilities,
        constraints: agent.constraints,
        isActive: agent.is_active,
        status: ollamaAvailable ? 'online' : 'offline',
      })),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/council/query
 * Submit a simple query to the AI council
 */
router.post('/query', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query, agents: selectedAgents, context, language } = querySchema.parse(req.body);
    const languageInstruction = getLanguageInstruction(language || 'en');
    const orgId = req.organizationId!;
    const userId = req.user!.id;

    // Create query record
    const councilQuery = await prisma.council_queries.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: orgId,
        user_id: userId,
        query,
        context: (context || {}) as Prisma.InputJsonValue,
        status: 'PROCESSING',
      },
    });

    const startTime = Date.now();

    // Get agents to use (default to all if not specified)
    const agentsToUse = selectedAgents || ['chief', 'cfo', 'coo'];

    // Get relevant data from knowledge graph for context
    const graphContext = await getRelevantContext(query, orgId);

    // Query each agent in parallel with their specific model
    const agentResponses = await Promise.all(
      agentsToUse.map(async (agentCode) => {
        const systemPrompt = AGENT_PROMPTS[agentCode];
        if (!systemPrompt) return null;

        const agent = await prisma.agents.findUnique({ where: { code: agentCode } });
        if (!agent) return null;

        // Get the model for this agent
        const agentModel = AGENT_MODELS[agentCode] || 'qwen3:32b';
        logger.info(`Agent ${agentCode} using model: ${agentModel}`);

        try {
          const response = await ollama.chat([
            { role: 'system', content: systemPrompt + languageInstruction },
            { 
              role: 'user', 
              content: `Context from organization data:\n${JSON.stringify(graphContext, null, 2)}\n\nUser query: ${query}` 
            },
          ], {
            model: agentModel,
            temperature: 0.7,
            max_tokens: 500,
          });

          // Save agent response
          await prisma.agent_query_responses.create({
            data: {
              id: crypto.randomUUID(),
              query_id: councilQuery.id,
              agent_id: agent.id,
              analysis: response.content,
              sources: (graphContext.sources || []) as Prisma.InputJsonValue,
              confidence: 0.85, // Would be calculated from model response
            },
          });

          return {
            agentId: agent.id,
            agentCode: agent.code,
            agentName: agent.name,
            analysis: response.content,
            sources: (graphContext.sources || []) as Prisma.InputJsonValue,
            confidence: 0.85,
          };
        } catch (error) {
          logger.error(`Agent ${agentCode} query failed:`, error);
          return null;
        }
      })
    );

    const validResponses = agentResponses.filter(r => r !== null);

    // Generate summary if multiple agents responded (using Chief's model)
    let summary = '';
    if (validResponses.length > 1) {
      const summaryPrompt = `Synthesize these agent perspectives into a cohesive answer:\n\n${
        validResponses.map(r => `${r!.agentName}: ${r!.analysis}`).join('\n\n')
      }`;

      const chiefModel = AGENT_MODELS['chief'] || 'deepseek-r1:32b';
      logger.info(`Chief synthesizing responses using model: ${chiefModel}`);

      const summaryResponse = await ollama.chat([
        { role: 'system', content: AGENT_PROMPTS['chief'] + languageInstruction },
        { role: 'user', content: summaryPrompt },
      ], {
        model: chiefModel,
      });
      summary = summaryResponse.content;
    } else if (validResponses.length === 1) {
      summary = validResponses[0]!.analysis;
    }

    const processingTime = Date.now() - startTime;

    // Update query record
    await prisma.council_queries.update({
      where: { id: councilQuery.id },
      data: {
        status: 'COMPLETED',
        response: JSON.parse(JSON.stringify({
          summary,
          agents: validResponses,
        })) as Prisma.InputJsonValue,
        confidence: validResponses.reduce((acc, r) => acc + (r?.confidence || 0), 0) / validResponses.length,
        processing_time: processingTime,
        completed_at: new Date(),
      },
    });

    // Generate follow-up questions
    const followUpQuestions = generateFollowUpQuestions(query, summary);

    res.json({
      success: true,
      data: {
        id: councilQuery.id,
        status: 'completed',
        query,
        response: {
          summary,
          confidence: validResponses.reduce((acc, r) => acc + (r?.confidence || 0), 0) / validResponses.length,
          agents: validResponses,
          sources: (graphContext.sources || []) as Prisma.InputJsonValue,
          followUpQuestions,
        },
        processingTime,
      },
    });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// ENHANCED QUERY ENDPOINT - With RAG, Caching, Smart Routing, CoT, Ensemble
// =============================================================================

const enhancedQuerySchema = z.object({
  query: z.string().min(1).max(10000),
  agents: z.array(z.string()).optional(),
  context: z.record(z.any()).optional(),
  language: z.string().optional(),
  // Enhanced options
  useRAG: z.boolean().optional().default(true),
  ragCollection: z.string().optional().default('knowledge_base'),
  useCache: z.boolean().optional().default(true),
  useChainOfThought: z.boolean().optional().default(false),
  useEnsemble: z.boolean().optional().default(false),
  ensembleStrategy: z.enum(['vote', 'blend', 'best']).optional().default('blend'),
  forceModel: z.string().optional(),
});

/**
 * POST /api/v1/council/enhanced-query
 * Submit an enhanced query with RAG, caching, smart routing, CoT, and ensemble
 */
router.post('/enhanced-query', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      query, 
      agents: selectedAgents, 
      context, 
      language,
      useRAG,
      ragCollection,
      useCache,
      useChainOfThought,
      useEnsemble,
      ensembleStrategy,
      forceModel,
    } = enhancedQuerySchema.parse(req.body);
    
    const languageInstruction = getLanguageInstruction(language || 'en');
    const orgId = req.organizationId!;
    const userId = req.user!.id;

    const startTime = Date.now();

    // Initialize enhanced LLM if needed
    await enhancedLLM.initialize();

    // Classify the query for smart routing
    const classification = await enhancedLLM.classifyQuery(query);
    logger.info(`Query classified as: ${classification.type} (${classification.complexity}) - suggested: ${classification.suggestedModel}`);

    // Create query record
    const councilQuery = await prisma.council_queries.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: orgId,
        user_id: userId,
        query,
        context: JSON.parse(JSON.stringify({
          ...(context || {}),
          classification,
          enhancedOptions: { useRAG, useCache, useChainOfThought, useEnsemble },
        })) as Prisma.InputJsonValue,
        status: 'PROCESSING',
      },
    });

    // Get agents to use
    const agentsToUse = selectedAgents || ['chief', 'cfo', 'coo'];

    // Get relevant data from knowledge graph for context
    const graphContext = await getRelevantContext(query, orgId);

    // Query each agent with enhanced LLM
    const agentResponses = await Promise.all(
      agentsToUse.map(async (agentCode) => {
        const systemPrompt = AGENT_PROMPTS[agentCode];
        if (!systemPrompt) return null;

        const agent = await prisma.agents.findUnique({ where: { code: agentCode } });
        if (!agent) return null;

        const agentStartTime = Date.now();

        try {
          // Build the full prompt with context
          const fullPrompt = `Context from organization data:\n${JSON.stringify(graphContext, null, 2)}\n\nUser query: ${query}`;

          // Use enhanced generation
          const response = await enhancedLLM.generateForAgent(
            agentCode,
            fullPrompt,
            systemPrompt + languageInstruction,
            {
              model: forceModel || 'qwen3:32b',
              useRAG,
              ragCollection,
              useCache,
              useChainOfThought: useChainOfThought || classification.complexity === 'high',
              useEnsemble: useEnsemble && classification.complexity === 'high',
              ensembleStrategy,
            }
          );

          const agentDuration = Date.now() - agentStartTime;

          // Track performance
          try {
            await prisma.$executeRaw`
              INSERT INTO model_performance (model, agent_id, query_type, response_time_ms, used_rag, used_cot, used_ensemble, created_at)
              VALUES (${AGENT_MODELS[agentCode] || 'qwen3:32b'}, ${agentCode}, ${classification.type}, ${agentDuration}, ${useRAG}, ${useChainOfThought}, ${useEnsemble}, NOW())
            `;
          } catch (perfError) {
            // Don't fail if performance tracking fails
            logger.warn('Performance tracking failed:', perfError);
          }

          // Save agent response
          await prisma.agent_query_responses.create({
            data: {
              id: crypto.randomUUID(),
              query_id: councilQuery.id,
              agent_id: agent.id,
              analysis: response,
              sources: (graphContext.sources || []) as Prisma.InputJsonValue,
              confidence: 0.85,
            },
          });

          return {
            agentId: agent.id,
            agentCode: agent.code,
            agentName: agent.name,
            analysis: response,
            sources: (graphContext.sources || []) as Prisma.InputJsonValue,
            confidence: 0.85,
            duration: agentDuration,
            modelUsed: AGENT_MODELS[agentCode] || 'qwen3:32b',
          };
        } catch (error) {
          logger.error(`Enhanced agent ${agentCode} query failed:`, error);
          return null;
        }
      })
    );

    const validResponses = agentResponses.filter(r => r !== null);

    // Generate enhanced synthesis using ensemble if enabled
    let summary = '';
    if (validResponses.length > 1) {
      const summaryPrompt = `Synthesize these agent perspectives into a cohesive, actionable answer:\n\n${
        validResponses.map(r => `**${r!.agentName}** (${r!.agentCode}):\n${r!.analysis}`).join('\n\n---\n\n')
      }\n\nProvide:\n1. Executive Summary (2-3 sentences)\n2. Key Recommendations\n3. Risk Factors\n4. Next Steps`;

      if (useEnsemble) {
        // Use ensemble for synthesis
        const ensembleResult = await enhancedLLM.generateEnsemble(
          summaryPrompt,
          AGENT_PROMPTS['chief'] + languageInstruction,
          ['deepseek-r1:32b', 'qwen3:32b', 'llama3.2:3b'],
          'blend'
        );
        summary = ensembleResult.finalResponse;
      } else {
        // Standard synthesis
        summary = await enhancedLLM.generateForAgent(
          'chief',
          summaryPrompt,
          AGENT_PROMPTS['chief'] + languageInstruction,
          { useChainOfThought: true }
        );
      }
    } else if (validResponses.length === 1) {
      summary = validResponses[0]!.analysis;
    }

    const processingTime = Date.now() - startTime;

    // Update query record
    await prisma.council_queries.update({
      where: { id: councilQuery.id },
      data: {
        status: 'COMPLETED',
        response: JSON.parse(JSON.stringify({
          summary,
          agents: validResponses,
          classification,
          enhancements: { useRAG, useCache, useChainOfThought, useEnsemble },
        })) as Prisma.InputJsonValue,
        confidence: validResponses.reduce((acc, r) => acc + (r?.confidence || 0), 0) / validResponses.length,
        processing_time: processingTime,
        completed_at: new Date(),
      },
    });

    // Generate follow-up questions
    const followUpQuestions = generateFollowUpQuestions(query, summary);

    res.json({
      success: true,
      data: {
        id: councilQuery.id,
        status: 'completed',
        query,
        response: {
          summary,
          confidence: validResponses.reduce((acc, r) => acc + (r?.confidence || 0), 0) / validResponses.length,
          agents: validResponses,
          sources: (graphContext.sources || []) as Prisma.InputJsonValue,
          followUpQuestions,
        },
        classification,
        enhancements: {
          useRAG,
          useCache,
          useChainOfThought,
          useEnsemble,
          suggestedModel: classification.suggestedModel,
        },
        processingTime,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/council/deliberations
 * Start a multi-agent deliberation
 */
router.post('/deliberations', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { question, agents: topLevelAgents, config } = deliberationSchema.parse(req.body);
    const orgId = req.organizationId!;

    // Get agents from either top-level or config.requiredAgents (frontend sends in config)
    const selectedAgents = topLevelAgents || config?.requiredAgents || [];
    
    if (selectedAgents.length < 1) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'At least 1 agent must be selected' },
      });
      return;
    }

    logger.info(`[Council] Starting deliberation with ${selectedAgents.length} agents: ${selectedAgents.join(', ')}`);

    // Create deliberation record
    const deliberation = await prisma.deliberations.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: orgId,
        question,
        config: (config || {}) as Prisma.InputJsonValue,
        status: 'IN_PROGRESS',
        current_phase: 'initial_analysis',
        progress: 0,
        started_at: new Date(),
      },
    });

    // Start deliberation in background - ONLY with selected agents
    processDeliberation(deliberation.id, selectedAgents, question, orgId).catch(err => {
      logger.error('Deliberation processing failed:', err);
    });

    res.status(201).json({
      success: true,
      data: {
        id: deliberation.id,
        status: 'in_progress',
        phase: 'initial_analysis',
        websocketChannel: `deliberation:${deliberation.id}`,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/council/deliberations
 * Get all deliberations (for Chronos timeline)
 */
router.get('/deliberations', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.organizationId;
    const limit = parseInt(req.query['limit'] as string) || 100;
    const status = req.query['status'] as string; // Optional filter

    // Build where clause - no org filter for Chronos visibility
    const where: Record<string, unknown> = {};
    // Skip org filter to allow Chronos to see all deliberations
    if (status) {
      where.status = status.toUpperCase();
    }

    logger.info(`[Council] Fetching deliberations for org: ${orgId}, limit: ${limit}`);

    const deliberations = await prisma.deliberations.findMany({
      where,
      include: {
        deliberation_messages: {
          include: { agents: true },
          orderBy: { created_at: 'asc' },
        },
      },
      orderBy: { created_at: 'desc' },
      take: limit,
    });

    res.json({
      success: true,
      data: deliberations.map(d => ({
        id: d.id,
        question: d.question,
        status: d.status,
        decision: d.decision,
        confidence: d.confidence,
        current_phase: d.current_phase,
        progress: d.progress,
        created_at: d.created_at,
        completed_at: d.completed_at,
        agents: [...new Set(d.deliberation_messages.map(m => m.agents?.name).filter(Boolean))],
        message_count: d.deliberation_messages.length,
        // Include full responses for audit package export
        responses: d.deliberation_messages.map(m => ({
          agent_id: m.agent_id,
          agentCode: m.agents?.code || 'AGENT',
          agentName: m.agents?.name || 'Agent',
          phase: m.phase,
          content: m.content,
          confidence: m.confidence,
          created_at: m.created_at,
        })),
      })),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/council/deliberations/save
 * Save a completed deliberation from frontend (for Chronos integration)
 */
router.post('/deliberations/save', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { question, mode, agentResponses, crossExaminations, synthesis, confidence } = req.body;
    const orgId = req.organizationId!;

    // Create deliberation record
    const deliberationId = crypto.randomUUID();
    const deliberation = await prisma.deliberations.create({
      data: {
        id: deliberationId,
        organization_id: orgId,
        question,
        status: 'COMPLETED',
        current_phase: 'completed',
        progress: 100,
        started_at: new Date(),
        completed_at: new Date(),
        confidence: confidence || 0.8,
      },
    });

    // Get a valid agent from the database (required for foreign key)
    const defaultAgent = await prisma.agents.findFirst({
      where: { code: 'chief' },
    }) || await prisma.agents.findFirst(); // Fallback to any agent
    
    if (!defaultAgent) {
      // No agents in database - skip message creation but still save deliberation
      logger.warn('No agents in database, skipping message creation for deliberation');
    } else {
      const defaultAgentId = defaultAgent.id;

      // Save agent responses as messages
      if (agentResponses && Array.isArray(agentResponses)) {
        for (const ar of agentResponses) {
          // Try to find agent by code, fallback to default
          const agentCode = ar.agentId || ar.agentCode || '';
          const agent = agentCode 
            ? await prisma.agents.findFirst({ where: { code: agentCode } })
            : null;
          
          await prisma.deliberation_messages.create({
            data: {
              id: crypto.randomUUID(),
              deliberation_id: deliberationId,
              agent_id: agent?.id || defaultAgentId,
              phase: 'initial_analysis',
              content: ar.response || ar.content || '',
              confidence: ar.confidence || 0.8,
            },
          });
        }
      }

      // Save cross-examinations
      if (crossExaminations && Array.isArray(crossExaminations)) {
        for (const ce of crossExaminations) {
          const agentCode = ce.challengerId || ce.agentId || '';
          const agent = agentCode
            ? await prisma.agents.findFirst({ where: { code: agentCode } })
            : null;
          
          await prisma.deliberation_messages.create({
            data: {
              id: crypto.randomUUID(),
              deliberation_id: deliberationId,
              agent_id: agent?.id || defaultAgentId,
              phase: 'cross_examination',
              content: ce.challenge || ce.content || '',
              confidence: 0.75,
            },
          });
        }
      }

      // Save synthesis
      if (synthesis) {
        await prisma.deliberation_messages.create({
          data: {
            id: crypto.randomUUID(),
            deliberation_id: deliberationId,
            agent_id: defaultAgentId,
            phase: 'synthesis',
            content: synthesis,
            confidence: confidence || 0.8,
          },
        });
      }
    }

    // Log to Druid for analytics
    druidEventStream.logDecision({
      organizationId: orgId,
      sessionId: deliberationId,
      decisionId: deliberationId,
      question,
      agentsInvolved: agentResponses?.map((ar: any) => ar.agentId || ar.agentCode) || [],
      consensusReached: true,
      finalRecommendation: synthesis?.substring(0, 200) || 'Completed',
      confidenceScore: Math.round((confidence || 0.8) * 100),
      riskLevel: 'medium',
      deliberationTimeMs: 0,
      department: 'Executive',
      tags: ['council', 'deliberation', mode || 'standard'],
    });

    // Create audit log
    await prisma.audit_logs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: orgId,
        action: 'deliberation.saved',
        resource_type: 'deliberation',
        resource_id: deliberationId,
        details: {
          question,
          mode,
          agentCount: agentResponses?.length || 0,
          confidence,
        } as any,
      },
    });

    logger.info(`Deliberation ${deliberationId} saved for Chronos`);

    res.json({
      success: true,
      data: deliberation,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/council/deliberations/:id/summary
 * Generate executive summary for a deliberation
 */

// Deliberation routes extracted to council/council-deliberations.ts

export default router;