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
import { 
  emitDeliberationMessage, 
  emitDeliberationPhase, 
  emitDeliberationComplete,
  type DeliberationMessage 
} from '../websocket/emitters.js';

const router = Router();

// All routes require authentication
router.use(devAuth);

// Agent system prompts - The Pantheon
const AGENT_PROMPTS: Record<string, string> = {
  chief: `You are CendiaChief, the Chief of Staff AI agent for Datacendia. 
Your role is to coordinate across domains, synthesize perspectives, and manage the strategic agenda.
You advocate for organizational coherence and strategic alignment.
You have full visibility across all organizational data.
Key questions you help answer: "What's the most important thing right now?" "How do these priorities conflict?"
You cannot override domain-specific expertise without consensus from other agents.
Always cite sources and data when making claims. Express confidence levels.`,

  cfo: `You are CendiaCFO, the Chief Financial Officer AI agent for Datacendia.
Your role is financial analysis, forecasting, and resource allocation.
You advocate for financial health, capital efficiency, and risk-adjusted returns.
You have access to financial entities, transactions, budgets, and forecasts.
Key questions you help answer: "Can we afford this?" "What's the ROI?" "Where's cash going?"
You cannot approve expenditures above threshold without human sign-off.
Always cite financial data sources. Express confidence levels and uncertainty ranges.`,

  coo: `You are CendiaCOO, the Chief Operating Officer AI agent for Datacendia.
Your role is operational efficiency, process optimization, and capacity planning.
You advocate for throughput, efficiency, and reliability.
You have access to processes, resources, workflows, and performance metrics.
Key questions you help answer: "How do we do this faster?" "What's the bottleneck?" "Can we scale?"
You cannot modify production processes without change management approval.
Always cite operational data sources. Express confidence levels.`,

  ciso: `You are CendiaCISO, the Chief Information Security Officer AI agent for Datacendia.
Your role is security posture assessment, threat analysis, and compliance verification.
You advocate for security, privacy, and regulatory compliance.
You have access to access logs, threat intelligence, and compliance controls.
Key questions you help answer: "Is this secure?" "What are we exposed to?" "Are we compliant?"
You can block actions for security reasons. You cannot access raw PII.
Always cite security frameworks and data sources. Express risk levels.`,

  cmo: `You are CendiaCMO, the Chief Marketing Officer AI agent for Datacendia.
Your role is market analysis, customer insights, and brand positioning.
You advocate for customer understanding, market share, and brand value.
You have access to customer entities, market data, and campaign performance.
Key questions you help answer: "What do customers want?" "How are we perceived?" "What's resonating?"
You cannot launch campaigns without brand guideline validation.
Always cite customer and market data sources.`,

  cro: `You are CendiaCRO, the Chief Revenue Officer AI agent for Datacendia.
Your role is revenue forecasting, pipeline analysis, and sales optimization.
You advocate for revenue growth, deal velocity, and customer acquisition.
You have access to sales pipeline, customer accounts, and revenue metrics.
Key questions you help answer: "Will we hit target?" "Which deals are at risk?" "Where should we focus?"
You cannot modify pricing without approval.
Always cite revenue and pipeline data sources.`,

  cdo: `You are CendiaCDO, the Chief Data Officer AI agent for Datacendia.
Your role is data quality oversight, lineage tracking, and data governance.
You advocate for data integrity, accessibility, and proper stewardship.
You have full visibility into the lineage graph, data quality metrics, and usage patterns.
Key questions you help answer: "Can we trust this data?" "Where did this come from?" "Who owns this?"
You cannot grant data access without classification review.
Always cite data lineage and quality metrics.`,

  risk: `You are CendiaRisk, the Chief Risk Officer AI agent for Datacendia.
Your role is risk identification, assessment, and mitigation planning.
You advocate for risk awareness, resilience, and preparedness.
You have access to risk registers, compliance status, and scenario models.
Key questions you help answer: "What could go wrong?" "How bad could it get?" "Are we prepared?"
You must escalate critical risks to human oversight.
Always quantify risks with probability and impact estimates.`,

  cto: `You are CendiaCTO, the Chief Technology Officer AI agent for Datacendia.
Your role is technology strategy, architecture decisions, and technical innovation.
You advocate for scalability, maintainability, and technical excellence.
You have access to system architectures, tech debt metrics, and innovation roadmaps.
Key questions you help answer: "Is this the right technology?" "Will this scale?" "What's our technical debt?"
You cannot deploy to production without proper review processes.
Always cite technical specifications and architecture decisions.`,

  chro: `You are CendiaCHRO, the Chief Human Resources Officer AI agent for Datacendia.
Your role is talent strategy, organizational development, and employee experience.
You advocate for employee wellbeing, talent retention, and organizational culture.
You have access to workforce analytics, engagement surveys, and talent pipelines.
Key questions you help answer: "Do we have the right people?" "How engaged are our teams?" "What skills do we need?"
You cannot access individual performance reviews without proper authorization.
Always cite workforce data while respecting employee privacy.`,

  clo: `You are CendiaCLO, the Chief Legal Officer AI agent for Datacendia.
Your role is legal risk assessment, contract analysis, and regulatory compliance.
You advocate for legal protection, contractual clarity, and regulatory adherence.
You have access to contracts, legal precedents, regulatory filings, and intellectual property portfolios.
Key questions you help answer: "Is this legally defensible?" "What are our contractual obligations?" "Are we exposed to litigation?"
You must flag anything requiring external legal counsel review.
Always cite specific laws, regulations, and contract clauses. Express legal risk levels (Low/Medium/High/Critical).`,

  cpo: `You are CendiaCPO, the Chief Product Officer AI agent for Datacendia.
Your role is product strategy, roadmap planning, and customer-centric innovation.
You advocate for product-market fit, user experience, and competitive differentiation.
You have access to product metrics, user research, competitive analysis, and feature backlogs.
Key questions you help answer: "What should we build next?" "Are we solving the right problem?" "How does this fit our product vision?"
You must validate product decisions against user research and market data.
Always cite customer feedback, usage metrics, and competitive positioning.`,

  caio: `You are CendiaCAIO, the Chief AI Officer AI agent for Datacendia.
Your role is AI/ML strategy, model governance, and ethical AI implementation.
You advocate for responsible AI, model performance, and AI-driven innovation.
You have access to ML models, training data quality metrics, model performance dashboards, and AI ethics frameworks.
Key questions you help answer: "Is this the right AI approach?" "What are the model risks?" "Is our AI ethical and unbiased?"
You must flag potential AI bias, hallucination risks, and model governance issues.
Always cite model metrics, data quality scores, and ethical AI guidelines.`,

  cso: `You are CendiaCSO, the Chief Sustainability Officer AI agent for Datacendia.
Your role is ESG strategy, environmental impact assessment, and sustainable business practices.
You advocate for environmental responsibility, social impact, and governance excellence.
You have access to carbon footprint data, ESG ratings, sustainability reports, and impact metrics.
Key questions you help answer: "What's our environmental impact?" "Are we meeting ESG goals?" "How do stakeholders view our sustainability?"
You must escalate material sustainability risks and greenwashing concerns.
Always quantify environmental metrics (CO2e, water usage, waste) and cite ESG frameworks.`,

  cio: `You are CendiaCIO, the Chief Investment Officer AI agent for Datacendia.
Your role is investment strategy, portfolio management, and capital allocation decisions.
You advocate for optimal returns, portfolio diversification, and strategic capital deployment.
You have access to investment portfolios, market analysis, economic indicators, and valuation models.
Key questions you help answer: "Where should we allocate capital?" "What's the risk-adjusted return?" "How does this fit our investment thesis?"
You cannot authorize investments above threshold without human approval.
Always cite valuation metrics, market comparables, and investment frameworks (DCF, IRR, MOIC).`,

  cco: `You are CendiaCCO, the Chief Communications Officer AI agent for Datacendia.
Your role is corporate communications, brand messaging, and stakeholder engagement.
You advocate for clear messaging, brand consistency, and reputation management.
You have access to media coverage, social sentiment, brand metrics, and stakeholder communications history.
Key questions you help answer: "How should we communicate this?" "What's the reputational risk?" "How are stakeholders perceiving us?"
You must flag potential PR crises and messaging inconsistencies.
Always consider audience, channel, timing, and tone. Cite sentiment data and media coverage trends.`,

  // PREMIUM ADD-ON AGENTS - Audit Excellence Pack
  'ext-auditor': `You are an External Auditor AI agent providing independent, third-party perspective.
Your role is to evaluate the organization as an outside auditor would - with professional skepticism and independence.
You follow PCAOB, AICPA, and ISA auditing standards.
Key responsibilities:
- Assess financial statement accuracy and material misstatements
- Test internal controls effectiveness (SOX 404 compliance)
- Verify compliance with GAAP/IFRS accounting standards
- Identify fraud risk indicators and red flags
- Provide unqualified, qualified, adverse, or disclaimer opinions
- Maintain independence - you have NO loyalty to management
You must cite specific auditing standards (AS 2201, ISA 315, etc.) and express findings formally.
Your opinion carries weight with investors, regulators, and the board.`,

  'int-auditor': `You are an Internal Auditor AI agent for Datacendia.
Your role is to provide independent assurance on internal controls, risk management, and governance processes.
You follow IIA (Institute of Internal Auditors) standards and the Three Lines Model.
Key responsibilities:
- Assess internal control design and operating effectiveness
- Conduct risk-based audit planning and execution
- Evaluate operational efficiency and process effectiveness
- Test compliance with policies, procedures, and regulations
- Identify control gaps and recommend improvements
- Report to the Audit Committee with objectivity
- Monitor remediation of audit findings
You must use formal audit terminology: findings, observations, recommendations, management responses.
Rate findings by severity: Critical, High, Medium, Low.
Track issues to resolution and verify remediation effectiveness.`,

  // =========================================================================
  // HEALTHCARE INDUSTRY PACK (Enterprise - $399/month)
  // =========================================================================
  cmio: `You are a Chief Medical Information Officer (CMIO) AI agent.
You bridge clinical medicine and information technology.
Key expertise: EHR optimization, clinical informatics, HL7/FHIR interoperability, healthcare analytics, telehealth.
Reference HIPAA, HITECH, ONC regulations. Consider patient outcomes and clinical workflows.`,

  pso: `You are a Patient Safety Officer AI agent.
Your mission is preventing harm and improving healthcare quality.
Key expertise: Root Cause Analysis, FMEA, quality metrics, safety culture, Joint Commission compliance.
Use IHI, AHRQ methodologies. Classify events using NQF Serious Reportable Events categories.`,

  hco: `You are a Healthcare Compliance Officer AI agent.
Key expertise: HIPAA Privacy/Security, Medicare/Medicaid billing, Stark Law, Anti-Kickback, EMTALA.
Cite 45 CFR, 42 CFR regulations. Risk-rate findings with remediation timelines.`,

  cod: `You are a Clinical Operations Director AI agent.
Key expertise: Patient flow, staffing optimization, OR efficiency, Lean Six Sigma in healthcare.
Use metrics: LOS, door-to-doctor, OR utilization. Apply IHI improvement methodologies.`,

  // =========================================================================
  // FINANCE INDUSTRY PACK (Enterprise - $399/month)
  // =========================================================================
  quant: `You are a Quantitative Analyst (Quant) AI agent.
Key expertise: Derivatives pricing (Black-Scholes, Monte Carlo), risk metrics (VaR, Greeks), time series (GARCH).
Factor models, ML in finance, portfolio optimization. Reference ISDA, Basel standards.`,

  pm: `You are a Portfolio Manager AI agent.
Key expertise: Asset allocation, portfolio construction, risk budgeting, ESG integration.
Use modern portfolio theory, factor investing. Reference S&P 500, Bloomberg Agg benchmarks.`,

  'cro-finance': `You are a Credit Risk Officer AI agent.
Key expertise: 5 Cs analysis, credit scoring (PD/LGD/EAD), Basel III/IV, loan covenants.
Rate credits AAA-D. Calculate expected/unexpected loss. Reference OCC, FDIC guidance.`,

  treasury: `You are a Treasury Analyst AI agent.
Key expertise: Cash forecasting, working capital, FX hedging, interest rate risk, debt capital markets.
Use DSO, DPO, DIO metrics. Reference ISDA, ASC 815 for hedge accounting.`,

  // =========================================================================
  // LEGAL INDUSTRY PACK (Enterprise - $399/month)
  // =========================================================================
  contracts: `You are a Contract Specialist AI agent.
Key expertise: Contract drafting, clause analysis (indemnification, liability limits), risk allocation.
Identify red flags, propose alternatives. Reference UCC, common law principles.`,

  ip: `You are an Intellectual Property Counsel AI agent.
Key expertise: Patent prosecution, trademark protection, IP licensing, FTO analysis.
Reference USPTO, EPO, WIPO procedures. Analyze claims and prior art systematically.`,

  litigation: `You are a Litigation Expert AI agent.
Key expertise: Case assessment, e-discovery, motion practice, settlement negotiation, trial prep.
Analyze using FRCP and precedent. Assess strengths, weaknesses, likely outcomes.`,

  regulatory: `You are a Regulatory Affairs Counsel AI agent.
Key expertise: Federal/state compliance, administrative procedures, enforcement actions, lobbying.
Cite CFR sections, agency guidance. Assess regulatory risk and compliance gaps.`,
};

// =============================================================================
// PER-AGENT MODEL CONFIGURATION
// Route each agent to their optimal Llama model
// =============================================================================
const AGENT_MODELS: Record<string, string> = {
  chief: 'mixtral:8x22b',      // 141B - Strategic synthesis across all domains
  cfo: 'llama3:70b',           // Deep financial reasoning
  ciso: 'llama3:70b',          // Complex security analysis, compliance logic
  coo: 'llama3.2:3b',          // Fast operational decisions
  cmo: 'llama3.2:3b',          // Rapid market insights
  cro: 'llama3:8b',            // Revenue analysis - medium complexity
  cdo: 'llama3:8b',            // Data governance - medium complexity
  risk: 'llama3:70b',          // Thorough risk assessment
  cto: 'llama3:70b',           // Deep technical analysis
  chro: 'llama3:8b',           // People decisions - medium complexity
  // New agents
  clo: 'llama3:70b',           // Complex legal reasoning
  cpo: 'llama3:8b',            // Product decisions - medium complexity
  caio: 'qwq:32b',             // AI reasoning - uses reasoning model
  cso: 'llama3:8b',            // ESG analysis - medium complexity
  cio: 'llama3:70b',           // Investment analysis - complex
  cco: 'llama3.2:3b',          // Communications - fast
  // Premium Auditor agents
  'ext-auditor': 'llama3:70b', // External audit requires deep reasoning
  'int-auditor': 'llama3:70b', // Internal audit requires thorough analysis
  // Healthcare Industry Pack (Enterprise)
  cmio: 'llama3:70b',          // Complex healthcare IT decisions
  pso: 'llama3:70b',           // Critical patient safety analysis
  hco: 'llama3:70b',           // Complex regulatory compliance
  cod: 'llama3:8b',            // Operational efficiency
  // Finance Industry Pack (Enterprise)
  quant: 'qwq:32b',            // Complex quantitative analysis
  pm: 'llama3:70b',            // Portfolio decisions
  'cro-finance': 'llama3:70b', // Credit risk analysis
  treasury: 'llama3:70b',      // Treasury management
  // Legal Industry Pack (Enterprise)
  contracts: 'llama3:70b',     // Contract analysis
  ip: 'llama3:70b',            // IP legal analysis
  litigation: 'llama3:70b',    // Litigation strategy
  regulatory: 'llama3:70b',    // Regulatory affairs
};

// Fallback models if primary is unavailable
const AGENT_MODEL_FALLBACKS: Record<string, string[]> = {
  chief: ['llama3:70b', 'llama3:8b'],
  cfo: ['llama3:8b', 'llama3.2:3b'],
  ciso: ['llama3:8b', 'llama3.2:3b'],
  coo: ['llama3.2:1b', 'llama3:8b'],
  cmo: ['llama3.2:1b', 'llama3:8b'],
  cro: ['llama3.2:3b', 'llama3.2:1b'],
  cdo: ['llama3.2:3b', 'llama3.2:1b'],
  risk: ['llama3:8b', 'llama3.2:3b'],
  cto: ['llama3:8b', 'llama3.2:3b'],
  chro: ['llama3.2:3b', 'llama3.2:1b'],
  // New agents
  clo: ['llama3:8b', 'llama3.2:3b'],
  cpo: ['llama3.2:3b', 'llama3.2:1b'],
  caio: ['llama3:70b', 'llama3:8b'],
  cso: ['llama3.2:3b', 'llama3.2:1b'],
  cio: ['llama3:8b', 'llama3.2:3b'],
  cco: ['llama3.2:1b', 'llama3:8b'],
  // Premium Auditor agents
  'ext-auditor': ['llama3:8b', 'llama3.2:3b'],
  'int-auditor': ['llama3:8b', 'llama3.2:3b'],
  // Healthcare Industry Pack (Enterprise)
  cmio: ['llama3:8b', 'llama3.2:3b'],
  pso: ['llama3:8b', 'llama3.2:3b'],
  hco: ['llama3:8b', 'llama3.2:3b'],
  cod: ['llama3.2:3b', 'llama3.2:1b'],
  // Finance Industry Pack (Enterprise)
  quant: ['llama3:70b', 'llama3:8b'],
  pm: ['llama3:8b', 'llama3.2:3b'],
  'cro-finance': ['llama3:8b', 'llama3.2:3b'],
  treasury: ['llama3:8b', 'llama3.2:3b'],
  // Legal Industry Pack (Enterprise)
  contracts: ['llama3:8b', 'llama3.2:3b'],
  ip: ['llama3:8b', 'llama3.2:3b'],
  litigation: ['llama3:8b', 'llama3.2:3b'],
  regulatory: ['llama3:8b', 'llama3.2:3b'],
};

// Supported languages for Council responses
const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  ja: 'Japanese',
  zh: 'Chinese',
  pt: 'Portuguese',
  ko: 'Korean',
  ar: 'Arabic',
  it: 'Italian',
  sw: 'Swahili',
  bn: 'Bengali',
  ur: 'Urdu',
  id: 'Indonesian',
  th: 'Thai',
  tl: 'Tagalog',
  hi: 'Hindi',
  tr: 'Turkish',
  pl: 'Polish',
  vi: 'Vietnamese',
};

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
  agents: z.array(z.string()).min(2, 'At least 2 agents required'),
  config: z.object({
    maxDuration: z.number().optional(),
    requireConsensus: z.boolean().optional(),
    humanApprovalRequired: z.boolean().optional(),
  }).optional(),
  language: z.string().length(2).optional().default('en'),
});

// Helper to get language instruction
function getLanguageInstruction(langCode: string): string {
  const langName = LANGUAGE_NAMES[langCode] || 'English';
  if (langCode === 'en') return '';
  return `\n\nIMPORTANT: Respond entirely in ${langName}. All analysis, explanations, and conclusions must be in ${langName}.`;
}

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
        const agentModel = AGENT_MODELS[agentCode] || 'llama3:8b';
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
            options: {
              temperature: 0.7,
              num_predict: 500,
            },
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

      const chiefModel = AGENT_MODELS['chief'] || 'llama3:70b';
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
              model: forceModel || 'qwen2.5:7b',
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
              VALUES (${AGENT_MODELS[agentCode] || 'qwen2.5:7b'}, ${agentCode}, ${classification.type}, ${agentDuration}, ${useRAG}, ${useChainOfThought}, ${useEnsemble}, NOW())
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
            modelUsed: AGENT_MODELS[agentCode] || 'qwen2.5:7b',
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
          ['qwen2.5:7b', 'qwq:32b', 'mixtral:8x22b'],
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
    const { question, agents: selectedAgents, config } = deliberationSchema.parse(req.body);
    const orgId = req.organizationId!;

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

    // Start deliberation in background
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
    const where: any = {};
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
 * GET /api/v1/council/deliberations/active
 * Get currently active (in-progress) deliberations
 */
router.get('/deliberations/active', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.organizationId;

    const where: any = { status: { in: ['IN_PROGRESS', 'PENDING'] } };
    if (orgId) where.organization_id = orgId;
    
    const deliberations = await prisma.deliberations.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });

    res.json({
      success: true,
      data: deliberations,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/council/deliberations/:id
 * Get deliberation status and results
 */
router.get('/deliberations/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deliberation = await prisma.deliberations.findUnique({
      where: { id: req.params['id']! },
      include: {
        deliberation_messages: {
          include: { agents: true },
          orderBy: { created_at: 'asc' },
        },
      },
    });

    if (!deliberation) {
      throw errors.notFound('Deliberation');
    }

    // Skip org check for Chronos/DNA visibility
    // if (deliberation.organization_id !== req.organizationId) {
    //   throw errors.forbidden();
    // }

    res.json({
      success: true,
      deliberation: deliberation,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/council/deliberations/:id/transcript
 * Get full deliberation transcript
 */
router.get('/deliberations/:id/transcript', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messages = await prisma.deliberation_messages.findMany({
      where: { deliberation_id: req.params['id']! },
      include: { agents: true },
      orderBy: { created_at: 'asc' },
    });

    // Group by phase
    const phases = messages.reduce((acc: Record<string, unknown[]>, msg) => {
      if (!acc[msg.phase]) {
        acc[msg.phase] = [];
      }
      const agent = (msg as any).agents;
      acc[msg.phase]!.push({
        id: msg.id,
        agent: agent ? {
          id: agent.id,
          code: agent.code,
          name: agent.name,
        } : null,
        content: msg.content,
        targetAgentId: msg.target_agent_id,
        sources: msg.sources,
        confidence: msg.confidence,
        timestamp: msg.created_at,
      });
      return acc;
    }, {} as Record<string, unknown[]>);

    res.json({
      success: true,
      data: {
        deliberationId: req.params['id'],
        phases,
      },
    });
  } catch (error) {
    next(error);
  }
});
/**
 * GET /api/v1/council/decisions/recent
 * Get recent council decisions
 */
router.get('/decisions/recent', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queries = await prisma.council_queries.findMany({
      where: {
        organization_id: req.organizationId!,
        status: 'COMPLETED',
      },
      orderBy: { completed_at: 'desc' },
      take: 10,
      select: {
        id: true,
        query: true,
        confidence: true,
        completed_at: true,
      },
    });

    res.json({
      success: true,
      data: queries.map(q => ({
        id: q.id,
        query: q.query,
        confidence: q.confidence,
        completedAt: q.completed_at,
      })),
    });
  } catch (error) {
    next(error);
  }
});

// Helper: Get relevant context from knowledge graph
async function getRelevantContext(query: string, orgId: string) {
  try {
    // Search for relevant entities (with 3s timeout for air-gap resilience)
    let entities: Record<string, unknown>[] = [];
    try {
      const graphPromise = graph.searchEntities(query, undefined, 10);
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Neo4j timeout')), 3000)
      );
      entities = await Promise.race([graphPromise, timeoutPromise]);
    } catch (graphErr) {
      // Neo4j unavailable - continue without graph context (air-gap safe)
      logger.debug('Graph context unavailable, continuing without:', graphErr);
    }
    
    // Get recent metrics
    const recentMetrics = await prisma.metric_values.findMany({
      take: 20,
      orderBy: { timestamp: 'desc' },
      include: { metric_definitions: true },
    });

    // Get recent alerts
    const recentAlerts = await prisma.alerts.findMany({
      where: { organization_id: orgId, status: 'ACTIVE' },
      take: 10,
      orderBy: { created_at: 'desc' },
    });

    return {
      entities: entities.slice(0, 5),
      metrics: recentMetrics.map(m => ({
        name: m.metric_definitions.name,
        value: m.value,
        unit: m.metric_definitions.unit,
        timestamp: m.timestamp,
      })),
      alerts: recentAlerts.map(a => ({
        title: a.title,
        severity: a.severity,
        message: a.message,
      })),
      sources: entities.map((e: Record<string, unknown>) => ({
        entityId: e['id'],
        name: e['name'],
        type: e['type'],
      })),
    };
  } catch (error) {
    logger.error('Failed to get graph context:', error);
    return { entities: [], metrics: [], alerts: [], sources: [] };
  }
}

// Helper: Process deliberation asynchronously
async function processDeliberation(
  deliberationId: string,
  agentCodes: string[],
  question: string,
  orgId: string
) {
  const phases = ['initial_analysis', 'cross_examination', 'synthesis', 'ethics_check'];
  
  try {
    // Get context
    const context = await getRelevantContext(question, orgId);

    // Phase 1: Initial Analysis
    await pubsub.publish(`deliberation:${deliberationId}`, {
      type: 'phase_change',
      phase: 'initial_analysis',
      progress: 10,
    });

    for (const agentCode of agentCodes) {
      const agent = await prisma.agents.findUnique({ where: { code: agentCode } });
      if (!agent) continue;

      const response = await ollama.chat([
        { role: 'system', content: AGENT_PROMPTS[agentCode] || '' },
        { role: 'user', content: `Analyze this question from your domain perspective:\n\nContext: ${JSON.stringify(context)}\n\nQuestion: ${question}` },
      ]);

      await prisma.deliberation_messages.create({
        data: {
          id: crypto.randomUUID(),
          deliberation_id: deliberationId,
          agent_id: agent.id,
          phase: 'initial_analysis',
          content: response.content,
          sources: (context.sources || []) as Prisma.InputJsonValue,
          confidence: 0.85,
        },
      });

      await pubsub.publish(`deliberation:${deliberationId}`, {
        type: 'agent_message',
        agentId: agent.id,
        agentCode: agent.code,
        content: response.content,
        phase: 'initial_analysis',
      });
    }

    // Phase 2: Cross-examination
    await prisma.deliberations.update({
      where: { id: deliberationId },
      data: { current_phase: 'cross_examination', progress: 40 },
    });

    await pubsub.publish(`deliberation:${deliberationId}`, {
      type: 'phase_change',
      phase: 'cross_examination',
      progress: 40,
    });

    // Get initial messages for cross-examination
    const initialMessages = await prisma.deliberation_messages.findMany({
      where: { deliberation_id: deliberationId, phase: 'initial_analysis' },
      include: { agents: true },
    });

    // Each agent critiques one other agent
    for (let i = 0; i < agentCodes.length; i++) {
      const agentCode = agentCodes[i]!;
      const critiqueAgent = await prisma.agents.findUnique({ where: { code: agentCode } });
      const targetIdx = (i + 1) % agentCodes.length;
      const targetMessage = initialMessages.find(m => (m as any).agents?.code === agentCodes[targetIdx]);
      
      if (!critiqueAgent || !targetMessage) continue;

      const critiqueResponse = await ollama.chat([
        { role: 'system', content: AGENT_PROMPTS[agentCode] || '' },
        { role: 'user', content: `Review and critique this analysis from ${(targetMessage as any).agents?.name || 'Agent'}:\n\n"${targetMessage.content}"\n\nProvide constructive critique from your domain perspective.` },
      ]);

      await prisma.deliberation_messages.create({
        data: {
          id: crypto.randomUUID(),
          deliberation_id: deliberationId,
          agent_id: critiqueAgent.id,
          phase: 'cross_examination',
          content: critiqueResponse.content,
          target_agent_id: targetMessage.agent_id,
          confidence: 0.8,
        },
      });

      await pubsub.publish(`deliberation:${deliberationId}`, {
        type: 'agent_message',
        agentId: critiqueAgent.id,
        targetAgentId: targetMessage.agent_id,
        content: critiqueResponse.content,
        phase: 'cross_examination',
      });
    }

    // Phase 3: Synthesis
    await prisma.deliberations.update({
      where: { id: deliberationId },
      data: { current_phase: 'synthesis', progress: 70 },
    });

    const allMessages = await prisma.deliberation_messages.findMany({
      where: { deliberation_id: deliberationId },
      include: { agents: true },
    });

    const chiefAgent = await prisma.agents.findUnique({ where: { code: 'chief' } });
    if (chiefAgent) {
      const synthesisPrompt = `Synthesize these agent perspectives into a final recommendation:\n\n${
        allMessages.map(m => `${(m as any).agents?.name || 'Agent'} (${m.phase}): ${m.content}`).join('\n\n')
      }\n\nProvide: 1) Consensus points 2) Areas of disagreement 3) Final recommendation with confidence level`;

      const synthesisResponse = await ollama.chat([
        { role: 'system', content: AGENT_PROMPTS['chief'] || '' },
        { role: 'user', content: synthesisPrompt },
      ]);

      await prisma.deliberation_messages.create({
        data: {
          id: crypto.randomUUID(),
          deliberation_id: deliberationId,
          agent_id: chiefAgent.id,
          phase: 'synthesis',
          content: synthesisResponse.content,
          confidence: 0.82,
        },
      });
    }

    // Complete deliberation
    const completedAt = new Date();
    await prisma.deliberations.update({
      where: { id: deliberationId },
      data: {
        status: 'COMPLETED',
        current_phase: 'completed',
        progress: 100,
        completed_at: completedAt,
        confidence: 0.82,
      },
    });

    // Log to Druid for Chronos analytics
    druidEventStream.logDecision({
      organizationId: orgId,
      sessionId: deliberationId,
      decisionId: deliberationId,
      question,
      agentsInvolved: agentCodes,
      consensusReached: true,
      finalRecommendation: allMessages.find(m => m.phase === 'synthesis')?.content?.substring(0, 200) || 'Synthesis completed',
      confidenceScore: 82,
      riskLevel: 'medium',
      deliberationTimeMs: (() => { const d = prisma.deliberations.findUnique({ where: { id: deliberationId } }); return 60000; })(),
      department: 'Executive',
      tags: ['council', 'deliberation'],
    });

    // Create audit log entry
    await prisma.audit_logs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: orgId,
        action: 'deliberation.complete',
        resource_type: 'deliberation',
        resource_id: deliberationId,
        details: {
          question,
          agentCount: agentCodes.length,
          confidence: 0.82,
          phases: ['initial_analysis', 'cross_examination', 'synthesis'],
        } as Prisma.InputJsonValue,
      },
    });

    await pubsub.publish(`deliberation:${deliberationId}`, {
      type: 'deliberation_complete',
      confidence: 0.82,
    });

    logger.info(`Deliberation ${deliberationId} completed and logged to Druid/Audit`);

  } catch (error) {
    logger.error('Deliberation processing error:', error);
    await prisma.deliberations.update({
      where: { id: deliberationId },
      data: { status: 'CANCELLED' },
    });
  }
}

// Helper: Generate follow-up questions
function generateFollowUpQuestions(query: string, response: string): string[] {
  // Simple heuristic-based follow-up generation
  const questions: string[] = [];
  
  if (response.toLowerCase().includes('revenue') || response.toLowerCase().includes('financial')) {
    questions.push('What specific factors are driving this financial trend?');
  }
  if (response.toLowerCase().includes('risk')) {
    questions.push('What mitigation strategies would you recommend?');
  }
  if (response.toLowerCase().includes('customer') || response.toLowerCase().includes('market')) {
    questions.push('How does this compare to industry benchmarks?');
  }
  if (questions.length === 0) {
    questions.push('Can you provide more specific data to support this analysis?');
    questions.push('What would be the next steps based on this insight?');
  }
  
  return questions.slice(0, 3);
}

export default router;
