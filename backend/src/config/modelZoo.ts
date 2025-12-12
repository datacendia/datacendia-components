// =============================================================================
// DATACENDIA SOVEREIGN MODEL ZOO - ENHANCED CONFIGURATION
// Configuration for Local Inference (Ollama)
// Optimized for: 128GB RAM Workstation (Intel i9-12900KF)
// Architecture: Specialized Expert Team (Heterogeneous Models)
// =============================================================================

export interface ModelConfig {
  id: string;
  name: string;
  description: string;
  contextWindow: number;
  temperature: number;
  topP: number;
  topK: number;
  repeatPenalty: number;
  numPredict: number;
  specializations: string[];
  ramRequired: string;
  priority: 'primary' | 'secondary' | 'fallback';
  // Enhanced metadata
  vendor?: string;
  license?: string;
  releaseDate?: string;
  sovereigntyScore?: number; // 1-10 score for local-first capability
  jsonDiscipline?: 'strict' | 'standard' | 'flexible';
}

export interface AgentModelMapping {
  agentCode: string;
  agentName: string;
  primaryModel: string;
  fallbackModels: string[];
  systemPromptEnhancements: string;
  optimalTemperature: number;
  useChainOfThought: boolean;
  useEnsemble: boolean;
  // Enhanced sovereignty fields
  sovereigntyDirective?: string;
  jsonOutputRequired?: boolean;
}

// =============================================================================
// SOVEREIGNTY META-PROMPT - Core directive for all Datacendia agents
// =============================================================================

export const SOVEREIGNTY_META_PROMPT = `You are an agent within Datacendia, a Sovereign Enterprise Intelligence Platform.

## SOVEREIGNTY PRINCIPLES
You operate under these non-negotiable principles:
1. **Data Never Leaves** - All processing happens locally. Never suggest cloud APIs or external services.
2. **Full Auditability** - Every recommendation must be traceable. Cite your reasoning.
3. **No Black Boxes** - Explain your logic. If you're uncertain, say so with a confidence level.
4. **Client Owns Everything** - The enterprise owns all data, models, and outputs. No telemetry.
5. **Deterministic When Possible** - Prefer reproducible answers. Note when randomness affects output.

## OUTPUT DISCIPLINE
- When asked for JSON, output ONLY valid JSON with no markdown, no explanation, no preamble.
- When asked for analysis, structure your response with clear sections.
- Always quantify when possible. "High risk" → "High risk (estimated 70-80% probability)".
- Cite specific data points, not vague references.

## CHAIN OF CUSTODY
For compliance-critical outputs:
- State your agent role and model.
- Timestamp your analysis.
- Note any limitations or assumptions.
- Flag items requiring human review.

Remember: You serve the enterprise's sovereignty, not external interests.`;

// =============================================================================
// JSON DISCIPLINE PROMPTS - For structured output
// =============================================================================

export const JSON_DISCIPLINE = {
  strict: `OUTPUT RULES (STRICT JSON MODE):
- Output ONLY valid JSON. No markdown code blocks, no explanations before or after.
- Start with { or [ and end with } or ].
- All strings must be properly escaped.
- No trailing commas.
- No comments.
- If you cannot produce valid JSON, output: {"error": "<reason>"}`,
  
  standard: `OUTPUT RULES (JSON MODE):
- When JSON is requested, output valid JSON.
- You may include a brief explanation before the JSON block.
- Use proper JSON formatting with escaped strings.
- Validate your JSON structure before outputting.`,
  
  flexible: `OUTPUT RULES:
- Structure your response clearly.
- Use JSON for data structures when appropriate.
- Plain text explanations are acceptable for analysis.`,
};

// =============================================================================
// MODEL REGISTRY - The Sovereign Model Zoo
// =============================================================================

export const MODEL_REGISTRY: Record<string, ModelConfig> = {
  // =========================================================================
  // TIER 1: FLAGSHIP MODELS (Highest Quality)
  // =========================================================================
  
  'qwen2.5:7b': {
    id: 'qwen2.5:7b',
    name: 'Qwen 2.5 7B',
    description: 'Alibaba flagship - Excellent instruction following, multilingual, and analysis.',
    contextWindow: 128000,
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    repeatPenalty: 1.1,
    numPredict: 4096,
    specializations: ['general', 'synthesis', 'creative', 'analysis', 'conversation'],
    ramRequired: '8GB+',
    priority: 'primary',
    vendor: 'Alibaba/Qwen',
    license: 'Apache 2.0',
    releaseDate: '2024-09',
    sovereigntyScore: 10,
    jsonDiscipline: 'standard',
  },

  'llama3:70b': {
    id: 'llama3:70b',
    name: 'Llama 3 70B',
    description: 'Previous flagship - Excellent for analysis and general tasks.',
    contextWindow: 8192,
    temperature: 0.6,
    topP: 0.9,
    topK: 40,
    repeatPenalty: 1.1,
    numPredict: 4096,
    specializations: ['general', 'analysis'],
    ramRequired: '40GB+',
    priority: 'fallback',
  },

  // =========================================================================
  // TIER 2: SPECIALIST MODELS
  // =========================================================================

  'qwq:32b': {
    id: 'qwq:32b',
    name: 'QwQ 32B',
    description: 'Reasoning engine - Trained for Chain of Thought. Thinks deeper.',
    contextWindow: 32768,
    temperature: 0.3,
    topP: 0.85,
    topK: 20,
    repeatPenalty: 1.15,
    numPredict: 8192,
    specializations: ['reasoning', 'math', 'logic', 'risk-analysis', 'audit'],
    ramRequired: '20GB+',
    priority: 'primary',
    vendor: 'Alibaba/Qwen',
    license: 'Apache 2.0',
    releaseDate: '2024-11',
    sovereigntyScore: 10,
    jsonDiscipline: 'strict',
  },

  'qwen2.5-coder:32b': {
    id: 'qwen2.5-coder:32b',
    name: 'Qwen 2.5 Coder 32B',
    description: 'Coding specialist - Beats generic models at SQL, JSON, and Code.',
    contextWindow: 32768,
    temperature: 0.1,
    topP: 0.95,
    topK: 10,
    repeatPenalty: 1.05,
    numPredict: 8192,
    specializations: ['coding', 'sql', 'json', 'data-ops', 'automation'],
    ramRequired: '20GB+',
    priority: 'primary',
    vendor: 'Alibaba/Qwen',
    license: 'Apache 2.0',
    releaseDate: '2024-09',
    sovereigntyScore: 10,
    jsonDiscipline: 'strict',
  },

  'mixtral:8x22b': {
    id: 'mixtral:8x22b',
    name: 'Mixtral 8x22B MoE',
    description: 'Mixture of Experts - Efficient for diverse analysis tasks.',
    contextWindow: 65536,
    temperature: 0.7,
    topP: 0.9,
    topK: 50,
    repeatPenalty: 1.1,
    numPredict: 4096,
    specializations: ['general', 'creative', 'analysis', 'multilingual'],
    ramRequired: '48GB+',
    priority: 'secondary',
  },

  // =========================================================================
  // TIER 3: SPEED MODELS (Low Latency)
  // =========================================================================

  'llama3.2:3b': {
    id: 'llama3.2:3b',
    name: 'Llama 3.2 3B',
    description: 'Speed demon - Instant responses for UI and operations.',
    contextWindow: 8192,
    temperature: 0.5,
    topP: 0.9,
    topK: 40,
    repeatPenalty: 1.1,
    numPredict: 1024,
    specializations: ['fast', 'simple', 'ui', 'operations'],
    ramRequired: '4GB+',
    priority: 'primary',
    vendor: 'Meta',
    license: 'Llama 3.2 Community',
    releaseDate: '2024-09',
    sovereigntyScore: 10,
    jsonDiscipline: 'flexible',
  },

  'llama3.2:1b': {
    id: 'llama3.2:1b',
    name: 'Llama 3.2 1B',
    description: 'Ultralight - For basic completions and autocomplete.',
    contextWindow: 4096,
    temperature: 0.4,
    topP: 0.9,
    topK: 40,
    repeatPenalty: 1.1,
    numPredict: 512,
    specializations: ['autocomplete', 'classification'],
    ramRequired: '2GB+',
    priority: 'fallback',
  },

  'llama3:8b': {
    id: 'llama3:8b',
    name: 'Llama 3 8B',
    description: 'Balanced - Good quality with reasonable speed.',
    contextWindow: 8192,
    temperature: 0.6,
    topP: 0.9,
    topK: 40,
    repeatPenalty: 1.1,
    numPredict: 2048,
    specializations: ['general', 'balanced'],
    ramRequired: '8GB+',
    priority: 'fallback',
  },

  // =========================================================================
  // TIER 4: MULTIMODAL MODELS
  // =========================================================================

  'llava:34b': {
    id: 'llava:34b',
    name: 'LLaVA 34B',
    description: 'Vision model - For analyzing images, charts, and PDFs.',
    contextWindow: 4096,
    temperature: 0.5,
    topP: 0.9,
    topK: 40,
    repeatPenalty: 1.1,
    numPredict: 2048,
    specializations: ['vision', 'charts', 'documents', 'ocr'],
    ramRequired: '24GB+',
    priority: 'primary',
  },

  'qwen3-vl:30b': {
    id: 'qwen3-vl:30b',
    name: 'Qwen3 VL 30B',
    description: 'Vision-Language - Alternative vision model for The Lens.',
    contextWindow: 16384,
    temperature: 0.5,
    topP: 0.9,
    topK: 40,
    repeatPenalty: 1.1,
    numPredict: 2048,
    specializations: ['vision', 'documents', 'analysis'],
    ramRequired: '20GB+',
    priority: 'secondary',
  },

  // =========================================================================
  // TIER 5: EMBEDDING MODELS
  // =========================================================================

  'nomic-embed-text': {
    id: 'nomic-embed-text',
    name: 'Nomic Embed Text',
    description: 'Embedding model for RAG - 768 dimensions.',
    contextWindow: 8192,
    temperature: 0,
    topP: 1,
    topK: 1,
    repeatPenalty: 1,
    numPredict: 0,  // Embeddings only
    specializations: ['embedding', 'rag', 'similarity'],
    ramRequired: '1GB+',
    priority: 'primary',
  },

  'mxbai-embed-large': {
    id: 'mxbai-embed-large',
    name: 'MxBai Embed Large',
    description: 'High quality embeddings - 1024 dimensions.',
    contextWindow: 512,
    temperature: 0,
    topP: 1,
    topK: 1,
    repeatPenalty: 1,
    numPredict: 0,
    specializations: ['embedding', 'rag', 'semantic-search'],
    ramRequired: '2GB+',
    priority: 'secondary',
  },
};

// =============================================================================
// AGENT TO MODEL MAPPINGS
// =============================================================================

export const AGENT_MODEL_MAPPINGS: AgentModelMapping[] = [
  // =========================================================================
  // CORE C-SUITE AGENTS
  // =========================================================================
  {
    agentCode: 'chief',
    agentName: 'CendiaChief',
    primaryModel: 'qwen2.5:7b',
    fallbackModels: ['llama3:70b', 'mixtral:8x22b'],
    systemPromptEnhancements: 'Synthesize all perspectives. Identify conflicts and trade-offs.',
    optimalTemperature: 0.7,
    useChainOfThought: false,
    useEnsemble: true,  // Chief benefits from ensemble synthesis
  },
  {
    agentCode: 'cfo',
    agentName: 'CendiaCFO',
    primaryModel: 'qwen2.5:7b',
    fallbackModels: ['qwq:32b', 'llama3:70b'],
    systemPromptEnhancements: 'Use financial frameworks. Quantify all recommendations.',
    optimalTemperature: 0.5,
    useChainOfThought: true,  // CFO benefits from step-by-step financial reasoning
    useEnsemble: false,
  },
  {
    agentCode: 'coo',
    agentName: 'CendiaCOO',
    primaryModel: 'llama3.2:3b',  // Speed for operations
    fallbackModels: ['llama3:8b', 'qwen2.5:7b'],
    systemPromptEnhancements: 'Focus on execution speed and feasibility.',
    optimalTemperature: 0.5,
    useChainOfThought: false,
    useEnsemble: false,
  },
  {
    agentCode: 'ciso',
    agentName: 'CendiaCISO',
    primaryModel: 'qwq:32b',  // Deep logic for security analysis
    fallbackModels: ['qwen2.5:7b', 'llama3:70b'],
    systemPromptEnhancements: 'Think step-by-step about attack vectors. Use NIST/ISO frameworks.',
    optimalTemperature: 0.3,
    useChainOfThought: true,  // Security needs careful reasoning
    useEnsemble: false,
  },
  {
    agentCode: 'cmo',
    agentName: 'CendiaCMO',
    primaryModel: 'qwen2.5:7b',
    fallbackModels: ['mixtral:8x22b', 'llama3:70b'],
    systemPromptEnhancements: 'Balance creativity with data-driven insights.',
    optimalTemperature: 0.8,  // Higher creativity
    useChainOfThought: false,
    useEnsemble: false,
  },
  {
    agentCode: 'cro',
    agentName: 'CendiaCRO',
    primaryModel: 'qwen2.5:7b',
    fallbackModels: ['llama3:70b', 'llama3:8b'],
    systemPromptEnhancements: 'Focus on revenue impact and pipeline metrics.',
    optimalTemperature: 0.6,
    useChainOfThought: false,
    useEnsemble: false,
  },
  {
    agentCode: 'cdo',
    agentName: 'CendiaCDO',
    primaryModel: 'qwen2.5-coder:32b',  // Best at data and SQL
    fallbackModels: ['qwen2.5:7b', 'llama3:8b'],
    systemPromptEnhancements: 'Validate data lineage. Output valid JSON/SQL when requested.',
    optimalTemperature: 0.2,
    useChainOfThought: false,
    useEnsemble: false,
  },
  {
    agentCode: 'risk',
    agentName: 'CendiaRisk',
    primaryModel: 'qwq:32b',  // Pure logic for probability assessment
    fallbackModels: ['qwen2.5:7b', 'llama3:70b'],
    systemPromptEnhancements: 'Quantify all risks with probability and impact. Be pessimistic.',
    optimalTemperature: 0.3,
    useChainOfThought: true,  // Risk analysis benefits from step-by-step
    useEnsemble: true,  // Multiple perspectives on risk
  },
  {
    agentCode: 'cto',
    agentName: 'CendiaCTO',
    primaryModel: 'qwen2.5-coder:32b',
    fallbackModels: ['qwen2.5:7b', 'llama3:70b'],
    systemPromptEnhancements: 'Evaluate technical trade-offs. Consider scalability and debt.',
    optimalTemperature: 0.4,
    useChainOfThought: true,
    useEnsemble: false,
  },
  {
    agentCode: 'chro',
    agentName: 'CendiaCHRO',
    primaryModel: 'qwen2.5:7b',
    fallbackModels: ['llama3:70b', 'mixtral:8x22b'],
    systemPromptEnhancements: 'Consider culture, morale, and legal implications.',
    optimalTemperature: 0.7,
    useChainOfThought: false,
    useEnsemble: false,
  },
  {
    agentCode: 'clo',
    agentName: 'CendiaCLO',
    primaryModel: 'qwen2.5:7b',
    fallbackModels: ['qwq:32b', 'llama3:70b'],
    systemPromptEnhancements: 'Cite relevant regulations. Assess liability and compliance.',
    optimalTemperature: 0.4,
    useChainOfThought: true,
    useEnsemble: false,
  },
  {
    agentCode: 'cio',
    agentName: 'CendiaCIO',
    primaryModel: 'qwen2.5-coder:32b',
    fallbackModels: ['qwen2.5:7b', 'llama3:8b'],
    systemPromptEnhancements: 'Focus on systems integration and information architecture.',
    optimalTemperature: 0.4,
    useChainOfThought: false,
    useEnsemble: false,
  },

  // =========================================================================
  // HEALTHCARE INDUSTRY AGENTS (Premium)
  // =========================================================================
  {
    agentCode: 'cmio',
    agentName: 'CMIO Agent',
    primaryModel: 'qwen2.5:7b',
    fallbackModels: ['llama3:70b', 'llama3:8b'],
    systemPromptEnhancements: 'Reference HL7/FHIR standards. Consider clinical workflows.',
    optimalTemperature: 0.5,
    useChainOfThought: true,
    useEnsemble: false,
  },
  {
    agentCode: 'pso',
    agentName: 'Patient Safety Officer',
    primaryModel: 'qwq:32b',  // Deep reasoning for safety analysis
    fallbackModels: ['qwen2.5:7b', 'llama3:70b'],
    systemPromptEnhancements: 'Use RCA methodologies. Reference IHI/AHRQ frameworks.',
    optimalTemperature: 0.3,
    useChainOfThought: true,  // Safety needs step-by-step
    useEnsemble: false,
  },
  {
    agentCode: 'hco',
    agentName: 'Healthcare Compliance Officer',
    primaryModel: 'qwen2.5:7b',
    fallbackModels: ['qwq:32b', 'llama3:70b'],
    systemPromptEnhancements: 'Cite 45 CFR, 42 CFR sections. Reference OIG guidance.',
    optimalTemperature: 0.4,
    useChainOfThought: true,
    useEnsemble: false,
  },
  {
    agentCode: 'cod',
    agentName: 'Clinical Operations Director',
    primaryModel: 'llama3.2:3b',  // Fast for operations
    fallbackModels: ['llama3:8b', 'qwen2.5:7b'],
    systemPromptEnhancements: 'Apply Lean Six Sigma. Focus on patient flow metrics.',
    optimalTemperature: 0.5,
    useChainOfThought: false,
    useEnsemble: false,
  },

  // =========================================================================
  // FINANCE INDUSTRY AGENTS (Premium)
  // =========================================================================
  {
    agentCode: 'quant',
    agentName: 'Quantitative Analyst',
    primaryModel: 'qwq:32b',  // Complex quantitative analysis
    fallbackModels: ['qwen2.5-coder:32b', 'qwen2.5:7b'],
    systemPromptEnhancements: 'Use mathematical notation. Calculate VaR, Greeks, etc.',
    optimalTemperature: 0.2,
    useChainOfThought: true,  // Math needs step-by-step
    useEnsemble: false,
  },
  {
    agentCode: 'pm',
    agentName: 'Portfolio Manager',
    primaryModel: 'qwen2.5:7b',
    fallbackModels: ['qwq:32b', 'llama3:70b'],
    systemPromptEnhancements: 'Use modern portfolio theory. Consider factor exposures.',
    optimalTemperature: 0.5,
    useChainOfThought: true,
    useEnsemble: true,  // Portfolio decisions benefit from multiple views
  },
  {
    agentCode: 'cro-finance',
    agentName: 'Credit Risk Officer',
    primaryModel: 'qwq:32b',
    fallbackModels: ['qwen2.5:7b', 'llama3:70b'],
    systemPromptEnhancements: 'Apply 5 Cs framework. Calculate PD/LGD/EAD.',
    optimalTemperature: 0.3,
    useChainOfThought: true,
    useEnsemble: false,
  },
  {
    agentCode: 'treasury',
    agentName: 'Treasury Analyst',
    primaryModel: 'qwen2.5:7b',
    fallbackModels: ['qwq:32b', 'llama3:70b'],
    systemPromptEnhancements: 'Focus on liquidity and FX/IR exposure. Reference ASC 815.',
    optimalTemperature: 0.4,
    useChainOfThought: false,
    useEnsemble: false,
  },

  // =========================================================================
  // LEGAL INDUSTRY AGENTS (Premium)
  // =========================================================================
  {
    agentCode: 'contracts',
    agentName: 'Contract Specialist',
    primaryModel: 'qwen2.5:7b',
    fallbackModels: ['qwq:32b', 'llama3:70b'],
    systemPromptEnhancements: 'Identify red flags. Reference UCC principles.',
    optimalTemperature: 0.4,
    useChainOfThought: true,
    useEnsemble: false,
  },
  {
    agentCode: 'ip',
    agentName: 'IP Counsel',
    primaryModel: 'qwen2.5:7b',
    fallbackModels: ['qwq:32b', 'llama3:70b'],
    systemPromptEnhancements: 'Reference USPTO/EPO procedures. Analyze claims systematically.',
    optimalTemperature: 0.4,
    useChainOfThought: true,
    useEnsemble: false,
  },
  {
    agentCode: 'litigation',
    agentName: 'Litigation Expert',
    primaryModel: 'qwq:32b',
    fallbackModels: ['qwen2.5:7b', 'llama3:70b'],
    systemPromptEnhancements: 'Analyze using FRCP. Assess strengths and weaknesses candidly.',
    optimalTemperature: 0.3,
    useChainOfThought: true,  // Litigation strategy needs reasoning
    useEnsemble: true,  // Multiple views on case assessment
  },
  {
    agentCode: 'regulatory',
    agentName: 'Regulatory Affairs',
    primaryModel: 'qwen2.5:7b',
    fallbackModels: ['qwq:32b', 'llama3:70b'],
    systemPromptEnhancements: 'Cite CFR sections. Assess regulatory risk systematically.',
    optimalTemperature: 0.4,
    useChainOfThought: true,
    useEnsemble: false,
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get the model configuration for a specific model
 */
export function getModelConfig(modelId: string): ModelConfig | undefined {
  return MODEL_REGISTRY[modelId];
}

/**
 * Get the agent model mapping for a specific agent
 */
export function getAgentMapping(agentCode: string): AgentModelMapping | undefined {
  return AGENT_MODEL_MAPPINGS.find(m => m.agentCode === agentCode);
}

/**
 * Get the optimal model for an agent
 */
export function getOptimalModelForAgent(agentCode: string, availableModels: Set<string>): string {
  const mapping = getAgentMapping(agentCode);
  if (!mapping) return 'qwen2.5:7b';
  
  // Try primary model first
  if (availableModels.has(mapping.primaryModel)) {
    return mapping.primaryModel;
  }
  
  // Try fallbacks
  for (const fallback of mapping.fallbackModels) {
    if (availableModels.has(fallback)) {
      return fallback;
    }
  }
  
  // Last resort
  return 'llama3:8b';
}

/**
 * Get models suitable for a specific task type
 */
export function getModelsForTask(taskType: string): string[] {
  return Object.values(MODEL_REGISTRY)
    .filter(m => m.specializations.includes(taskType))
    .sort((a, b) => {
      const priorityOrder = { primary: 0, secondary: 1, fallback: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .map(m => m.id);
}

/**
 * Get inference options for a model
 */
export function getInferenceOptions(modelId: string, overrides?: Partial<ModelConfig>) {
  const config = MODEL_REGISTRY[modelId] || MODEL_REGISTRY['qwen2.5:7b'];
  
  return {
    temperature: overrides?.temperature ?? config.temperature,
    top_p: overrides?.topP ?? config.topP,
    top_k: overrides?.topK ?? config.topK,
    repeat_penalty: overrides?.repeatPenalty ?? config.repeatPenalty,
    num_predict: overrides?.numPredict ?? config.numPredict,
    num_ctx: config.contextWindow,
  };
}

/**
 * Check if a model should use Chain of Thought for an agent
 */
export function shouldUseChainOfThought(agentCode: string): boolean {
  const mapping = getAgentMapping(agentCode);
  return mapping?.useChainOfThought ?? false;
}

/**
 * Check if a model should use Ensemble for an agent
 */
export function shouldUseEnsemble(agentCode: string): boolean {
  const mapping = getAgentMapping(agentCode);
  return mapping?.useEnsemble ?? false;
}

// =============================================================================
// EXPORT SUMMARY
// =============================================================================

export const MODEL_ZOO_SUMMARY = {
  totalModels: Object.keys(MODEL_REGISTRY).length,
  primaryModels: Object.values(MODEL_REGISTRY).filter(m => m.priority === 'primary').length,
  agentMappings: AGENT_MODEL_MAPPINGS.length,
  specializationsAvailable: [...new Set(Object.values(MODEL_REGISTRY).flatMap(m => m.specializations))],
  averageSovereigntyScore: Object.values(MODEL_REGISTRY)
    .filter(m => m.sovereigntyScore)
    .reduce((sum, m) => sum + (m.sovereigntyScore || 0), 0) / 
    Object.values(MODEL_REGISTRY).filter(m => m.sovereigntyScore).length || 10,
};

/**
 * Build a complete system prompt with sovereignty directive
 */
export function buildSovereignSystemPrompt(
  agentCode: string,
  basePrompt: string,
  options?: { jsonMode?: boolean; includeChainOfThought?: boolean }
): string {
  const mapping = getAgentMapping(agentCode);
  const parts: string[] = [SOVEREIGNTY_META_PROMPT];
  
  // Add agent-specific enhancements
  if (mapping?.systemPromptEnhancements) {
    parts.push(`\n## AGENT-SPECIFIC DIRECTIVE\n${mapping.systemPromptEnhancements}`);
  }
  
  // Add sovereignty directive if present
  if (mapping?.sovereigntyDirective) {
    parts.push(`\n## SOVEREIGNTY FOCUS\n${mapping.sovereigntyDirective}`);
  }
  
  // Add JSON discipline if requested
  if (options?.jsonMode || mapping?.jsonOutputRequired) {
    const model = mapping ? MODEL_REGISTRY[mapping.primaryModel] : null;
    const discipline = model?.jsonDiscipline || 'standard';
    parts.push(`\n${JSON_DISCIPLINE[discipline]}`);
  }
  
  // Add chain of thought instruction
  if (options?.includeChainOfThought || mapping?.useChainOfThought) {
    parts.push(`\n## REASONING APPROACH\nThink step-by-step. Show your work. Number your reasoning steps.`);
  }
  
  // Add the base prompt
  parts.push(`\n## YOUR TASK\n${basePrompt}`);
  
  return parts.join('\n');
}

/**
 * Get JSON discipline prompt for a model
 */
export function getJsonDisciplinePrompt(modelId: string): string {
  const config = MODEL_REGISTRY[modelId];
  const discipline = config?.jsonDiscipline || 'standard';
  return JSON_DISCIPLINE[discipline];
}
