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
  
  // =========================================================================
  // 2025 FLAGSHIP MODELS
  // =========================================================================

  'llama4:scout': {
    id: 'llama4:scout',
    name: 'Llama 4 Scout',
    description: 'Meta\'s newest flagship - 128k context, multimodal, top-ranked open model.',
    contextWindow: 128000,
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    repeatPenalty: 1.1,
    numPredict: 4096,
    specializations: ['general', 'synthesis', 'creative', 'analysis', 'conversation', 'multimodal'],
    ramRequired: '40GB+',
    priority: 'primary',
    vendor: 'Meta',
    license: 'Llama 4 Community',
    releaseDate: '2025-01',
    sovereigntyScore: 10,
    jsonDiscipline: 'standard',
  },

  'llama3.3:70b': {
    id: 'llama3.3:70b',
    name: 'Llama 3.3 70B',
    description: 'Top-tier flagship - Excellent for synthesis, analysis, and strategic thinking.',
    contextWindow: 128000,
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    repeatPenalty: 1.1,
    numPredict: 4096,
    specializations: ['general', 'synthesis', 'analysis', 'strategic'],
    ramRequired: '42GB+',
    priority: 'primary',
    vendor: 'Meta',
    license: 'Llama Community',
    releaseDate: '2024-12',
    sovereigntyScore: 10,
    jsonDiscipline: 'standard',
  },

  'qwen3:32b': {
    id: 'qwen3:32b',
    name: 'Qwen 3 32B',
    description: 'Alibaba\'s latest - Best multilingual, strong reasoning, surpasses Qwen 2.5.',
    contextWindow: 32768,
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    repeatPenalty: 1.1,
    numPredict: 4096,
    specializations: ['general', 'multilingual', 'reasoning', 'analysis'],
    ramRequired: '20GB+',
    priority: 'primary',
    vendor: 'Alibaba/Qwen',
    license: 'Apache 2.0',
    releaseDate: '2025-01',
    sovereigntyScore: 10,
    jsonDiscipline: 'standard',
  },

  'deepseek-r1:32b': {
    id: 'deepseek-r1:32b',
    name: 'DeepSeek R1 32B',
    description: 'Chain-of-thought reasoning model - Competes with OpenAI o1.',
    contextWindow: 32768,
    temperature: 0.3,
    topP: 0.85,
    topK: 20,
    repeatPenalty: 1.15,
    numPredict: 8192,
    specializations: ['reasoning', 'math', 'logic', 'risk-analysis', 'audit', 'chain-of-thought'],
    ramRequired: '20GB+',
    priority: 'primary',
    vendor: 'DeepSeek',
    license: 'MIT',
    releaseDate: '2025-01',
    sovereigntyScore: 10,
    jsonDiscipline: 'strict',
  },

  'gemma3:27b': {
    id: 'gemma3:27b',
    name: 'Gemma 3 27B',
    description: 'Google\'s latest open model - Efficient, strong performance.',
    contextWindow: 8192,
    temperature: 0.6,
    topP: 0.9,
    topK: 40,
    repeatPenalty: 1.1,
    numPredict: 4096,
    specializations: ['general', 'analysis', 'efficient'],
    ramRequired: '17GB+',
    priority: 'primary',
    vendor: 'Google',
    license: 'Gemma License',
    releaseDate: '2025-01',
    sovereigntyScore: 10,
    jsonDiscipline: 'standard',
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

  'deepseek-coder-v2': {
    id: 'deepseek-coder-v2',
    name: 'DeepSeek Coder V2',
    description: 'Best coding model - 300+ languages, state-of-the-art on coding benchmarks.',
    contextWindow: 32768,
    temperature: 0.1,
    topP: 0.95,
    topK: 10,
    repeatPenalty: 1.05,
    numPredict: 8192,
    specializations: ['coding', 'sql', 'json', 'data-ops', 'automation', '300+ languages'],
    ramRequired: '10GB+',
    priority: 'primary',
    vendor: 'DeepSeek',
    license: 'DeepSeek License',
    releaseDate: '2024-12',
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
    primaryModel: 'llama4:scout',
    fallbackModels: ['llama3.3:70b', 'qwen3:32b'],
    systemPromptEnhancements: 'Synthesize all perspectives. Identify conflicts and trade-offs.',
    optimalTemperature: 0.7,
    useChainOfThought: false,
    useEnsemble: true,  // Chief benefits from ensemble synthesis
  },
  {
    agentCode: 'cfo',
    agentName: 'CendiaCFO',
    primaryModel: 'llama3.3:70b',
    fallbackModels: ['qwen3:32b', 'deepseek-r1:32b'],
    systemPromptEnhancements: 'Use financial frameworks. Quantify all recommendations.',
    optimalTemperature: 0.5,
    useChainOfThought: true,  // CFO benefits from step-by-step financial reasoning
    useEnsemble: false,
  },
  {
    agentCode: 'coo',
    agentName: 'CendiaCOO',
    primaryModel: 'llama3.2:3b',  // Speed for operations
    fallbackModels: ['llama3.2:3b', 'qwen3:32b'],
    systemPromptEnhancements: 'Focus on execution speed and feasibility.',
    optimalTemperature: 0.5,
    useChainOfThought: false,
    useEnsemble: false,
  },
  {
    agentCode: 'ciso',
    agentName: 'CendiaCISO',
    primaryModel: 'deepseek-r1:32b',  // Chain-of-thought for security analysis
    fallbackModels: ['qwq:32b', 'llama3.3:70b'],
    systemPromptEnhancements: 'Think step-by-step about attack vectors. Use NIST/ISO frameworks.',
    optimalTemperature: 0.3,
    useChainOfThought: true,  // Security needs careful reasoning
    useEnsemble: false,
  },
  {
    agentCode: 'cmo',
    agentName: 'CendiaCMO',
    primaryModel: 'qwen3:32b',
    fallbackModels: ['llama3.3:70b', 'gemma3:27b'],
    systemPromptEnhancements: 'Balance creativity with data-driven insights.',
    optimalTemperature: 0.8,  // Higher creativity
    useChainOfThought: false,
    useEnsemble: false,
  },
  {
    agentCode: 'cro',
    agentName: 'CendiaCRO',
    primaryModel: 'qwen3:32b',
    fallbackModels: ['llama3.3:70b', 'llama3.2:3b'],
    systemPromptEnhancements: 'Focus on revenue impact and pipeline metrics.',
    optimalTemperature: 0.6,
    useChainOfThought: false,
    useEnsemble: false,
  },
  {
    agentCode: 'cdo',
    agentName: 'CendiaCDO',
    primaryModel: 'deepseek-coder-v2',  // Best at data and SQL
    fallbackModels: ['qwen3:32b', 'llama3.2:3b'],
    systemPromptEnhancements: 'Validate data lineage. Output valid JSON/SQL when requested.',
    optimalTemperature: 0.2,
    useChainOfThought: false,
    useEnsemble: false,
  },
  {
    agentCode: 'risk',
    agentName: 'CendiaRisk',
    primaryModel: 'deepseek-r1:32b',  // Chain-of-thought for probability assessment
    fallbackModels: ['qwq:32b', 'llama3.3:70b'],
    systemPromptEnhancements: 'Quantify all risks with probability and impact. Be pessimistic.',
    optimalTemperature: 0.3,
    useChainOfThought: true,  // Risk analysis benefits from step-by-step
    useEnsemble: true,  // Multiple perspectives on risk
  },
  {
    agentCode: 'cto',
    agentName: 'CendiaCTO',
    primaryModel: 'deepseek-coder-v2',
    fallbackModels: ['qwen3:32b', 'llama3.3:70b'],
    systemPromptEnhancements: 'Evaluate technical trade-offs. Consider scalability and debt.',
    optimalTemperature: 0.4,
    useChainOfThought: true,
    useEnsemble: false,
  },
  {
    agentCode: 'chro',
    agentName: 'CendiaCHRO',
    primaryModel: 'qwen3:32b',
    fallbackModels: ['llama3.3:70b', 'mixtral:8x22b'],
    systemPromptEnhancements: 'Consider culture, morale, and legal implications.',
    optimalTemperature: 0.7,
    useChainOfThought: false,
    useEnsemble: false,
  },
  {
    agentCode: 'clo',
    agentName: 'CendiaCLO',
    primaryModel: 'qwen3:32b',
    fallbackModels: ['qwq:32b', 'llama3.3:70b'],
    systemPromptEnhancements: 'Cite relevant regulations. Assess liability and compliance.',
    optimalTemperature: 0.4,
    useChainOfThought: true,
    useEnsemble: false,
  },
  {
    agentCode: 'cio',
    agentName: 'CendiaCIO',
    primaryModel: 'deepseek-coder-v2',
    fallbackModels: ['qwen3:32b', 'llama3.2:3b'],
    systemPromptEnhancements: 'Focus on systems integration and information architecture.',
    optimalTemperature: 0.4,
    useChainOfThought: false,
    useEnsemble: false,
  },
  {
    agentCode: 'devils-advocate',
    agentName: 'CendiaDevil',
    primaryModel: 'qwq:32b',  // Deep reasoning for contrarian analysis
    fallbackModels: ['qwen3:32b', 'llama3.3:70b'],
    systemPromptEnhancements: 'Challenge assumptions. Argue opposing positions. Find blind spots.',
    optimalTemperature: 0.7,  // Higher creativity for contrarian thinking
    useChainOfThought: true,  // Step-by-step challenge reasoning
    useEnsemble: false,
  },

  // =========================================================================
  // PRO TIER AGENTS - Extended Executive Team
  // =========================================================================
  {
    agentCode: 'cto',
    agentName: 'CendiaCTO',
    primaryModel: 'deepseek-coder-v2',
    fallbackModels: ['qwen3:32b', 'llama3.3:70b'],
    systemPromptEnhancements: 'Evaluate architecture decisions. Consider scalability and technical debt.',
    optimalTemperature: 0.4,
    useChainOfThought: true,
    useEnsemble: false,
  },
  {
    agentCode: 'chro',
    agentName: 'CendiaCHRO',
    primaryModel: 'qwen3:32b',
    fallbackModels: ['llama3.3:70b', 'mixtral:8x22b'],
    systemPromptEnhancements: 'Consider culture, talent, and organizational dynamics.',
    optimalTemperature: 0.6,
    useChainOfThought: false,
    useEnsemble: false,
  },
  {
    agentCode: 'cxo',
    agentName: 'CendiaCXO',
    primaryModel: 'qwen3:32b',
    fallbackModels: ['llama3.3:70b', 'llama3.2:3b'],
    systemPromptEnhancements: 'Focus on customer journey and experience metrics.',
    optimalTemperature: 0.6,
    useChainOfThought: false,
    useEnsemble: false,
  },
  {
    agentCode: 'procurement',
    agentName: 'CendiaProcurement',
    primaryModel: 'qwen3:32b',
    fallbackModels: ['llama3.3:70b', 'llama3.2:3b'],
    systemPromptEnhancements: 'Apply Kraljic Matrix. Consider TCO and supplier risk.',
    optimalTemperature: 0.5,
    useChainOfThought: true,
    useEnsemble: false,
  },
  {
    agentCode: 'ma',
    agentName: 'CendiaMA',
    primaryModel: 'qwen3:32b',
    fallbackModels: ['qwq:32b', 'llama3.3:70b'],
    systemPromptEnhancements: 'Use DCF and comparable analysis. Consider integration risk.',
    optimalTemperature: 0.5,
    useChainOfThought: true,
    useEnsemble: false,
  },
  {
    agentCode: 'innovation',
    agentName: 'CendiaInnovation',
    primaryModel: 'qwen3:32b',
    fallbackModels: ['mixtral:8x22b', 'llama3.3:70b'],
    systemPromptEnhancements: 'Apply Three Horizons framework. Balance exploration and exploitation.',
    optimalTemperature: 0.8,  // Higher creativity
    useChainOfThought: false,
    useEnsemble: false,
  },
  {
    agentCode: 'ir',
    agentName: 'CendiaIR',
    primaryModel: 'qwen3:32b',
    fallbackModels: ['llama3.3:70b', 'llama3.2:3b'],
    systemPromptEnhancements: 'Consider Reg FD compliance. Balance transparency with sensitivity.',
    optimalTemperature: 0.5,
    useChainOfThought: false,
    useEnsemble: false,
  },
  {
    agentCode: 'ethics',
    agentName: 'CendiaEthics',
    primaryModel: 'qwq:32b',  // Deep reasoning for ethical dilemmas
    fallbackModels: ['qwen3:32b', 'llama3.3:70b'],
    systemPromptEnhancements: 'Apply ethical frameworks. Consider stakeholder impact.',
    optimalTemperature: 0.4,
    useChainOfThought: true,
    useEnsemble: false,
  },
  {
    agentCode: 'crisis',
    agentName: 'CendiaCrisis',
    primaryModel: 'llama3.2:3b',  // Fast for crisis response
    fallbackModels: ['qwen3:32b', 'llama3.2:3b'],
    systemPromptEnhancements: 'Act fast. Communicate early. Use ICS framework.',
    optimalTemperature: 0.4,
    useChainOfThought: false,
    useEnsemble: false,
  },
  {
    agentCode: 'gov-relations',
    agentName: 'CendiaGovRelations',
    primaryModel: 'qwen3:32b',
    fallbackModels: ['llama3.3:70b', 'llama3.2:3b'],
    systemPromptEnhancements: 'Consider federal and state regulatory landscapes.',
    optimalTemperature: 0.5,
    useChainOfThought: true,
    useEnsemble: false,
  },

  // =========================================================================
  // HEALTHCARE INDUSTRY AGENTS (Enterprise)
  // =========================================================================
  {
    agentCode: 'cmio',
    agentName: 'CMIO Agent',
    primaryModel: 'qwen3:32b',
    fallbackModels: ['llama3.3:70b', 'llama3.2:3b'],
    systemPromptEnhancements: 'Reference HL7/FHIR standards. Consider clinical workflows.',
    optimalTemperature: 0.5,
    useChainOfThought: true,
    useEnsemble: false,
  },
  {
    agentCode: 'pso',
    agentName: 'Patient Safety Officer',
    primaryModel: 'qwq:32b',  // Deep reasoning for safety analysis
    fallbackModels: ['qwen3:32b', 'llama3.3:70b'],
    systemPromptEnhancements: 'Use RCA methodologies. Reference IHI/AHRQ frameworks.',
    optimalTemperature: 0.3,
    useChainOfThought: true,  // Safety needs step-by-step
    useEnsemble: false,
  },
  {
    agentCode: 'hco',
    agentName: 'Healthcare Compliance Officer',
    primaryModel: 'qwen3:32b',
    fallbackModels: ['qwq:32b', 'llama3.3:70b'],
    systemPromptEnhancements: 'Cite 45 CFR, 42 CFR sections. Reference OIG guidance.',
    optimalTemperature: 0.4,
    useChainOfThought: true,
    useEnsemble: false,
  },
  {
    agentCode: 'cod',
    agentName: 'Clinical Operations Director',
    primaryModel: 'llama3.2:3b',  // Fast for operations
    fallbackModels: ['llama3.2:3b', 'qwen3:32b'],
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
    fallbackModels: ['deepseek-coder-v2', 'qwen3:32b'],
    systemPromptEnhancements: 'Use mathematical notation. Calculate VaR, Greeks, etc.',
    optimalTemperature: 0.2,
    useChainOfThought: true,  // Math needs step-by-step
    useEnsemble: false,
  },
  {
    agentCode: 'pm',
    agentName: 'Portfolio Manager',
    primaryModel: 'qwen3:32b',
    fallbackModels: ['qwq:32b', 'llama3.3:70b'],
    systemPromptEnhancements: 'Use modern portfolio theory. Consider factor exposures.',
    optimalTemperature: 0.5,
    useChainOfThought: true,
    useEnsemble: true,  // Portfolio decisions benefit from multiple views
  },
  {
    agentCode: 'cro-finance',
    agentName: 'Credit Risk Officer',
    primaryModel: 'qwq:32b',
    fallbackModels: ['qwen3:32b', 'llama3.3:70b'],
    systemPromptEnhancements: 'Apply 5 Cs framework. Calculate PD/LGD/EAD.',
    optimalTemperature: 0.3,
    useChainOfThought: true,
    useEnsemble: false,
  },
  {
    agentCode: 'treasury',
    agentName: 'Treasury Analyst',
    primaryModel: 'qwen3:32b',
    fallbackModels: ['qwq:32b', 'llama3.3:70b'],
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
    primaryModel: 'qwen3:32b',
    fallbackModels: ['qwq:32b', 'llama3.3:70b'],
    systemPromptEnhancements: 'Identify red flags. Reference UCC principles.',
    optimalTemperature: 0.4,
    useChainOfThought: true,
    useEnsemble: false,
  },
  {
    agentCode: 'ip',
    agentName: 'IP Counsel',
    primaryModel: 'qwen3:32b',
    fallbackModels: ['qwq:32b', 'llama3.3:70b'],
    systemPromptEnhancements: 'Reference USPTO/EPO procedures. Analyze claims systematically.',
    optimalTemperature: 0.4,
    useChainOfThought: true,
    useEnsemble: false,
  },
  {
    agentCode: 'litigation',
    agentName: 'Litigation Expert',
    primaryModel: 'qwq:32b',
    fallbackModels: ['qwen3:32b', 'llama3.3:70b'],
    systemPromptEnhancements: 'Analyze using FRCP. Assess strengths and weaknesses candidly.',
    optimalTemperature: 0.3,
    useChainOfThought: true,  // Litigation strategy needs reasoning
    useEnsemble: true,  // Multiple views on case assessment
  },
  {
    agentCode: 'regulatory',
    agentName: 'Regulatory Affairs',
    primaryModel: 'qwen3:32b',
    fallbackModels: ['qwq:32b', 'llama3.3:70b'],
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
  if (!mapping) return 'qwen3:32b';
  
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
  return 'llama3.2:3b';
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
  const config = MODEL_REGISTRY[modelId] ?? MODEL_REGISTRY['qwen3:32b'];
  
  // Default values if config is still undefined
  const defaults: ModelConfig = {
    id: 'default',
    name: 'Default',
    description: 'Default configuration',
    contextWindow: 8192,
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    repeatPenalty: 1.1,
    numPredict: 2048,
    specializations: [],
    ramRequired: '4GB+',
    priority: 'fallback',
  };
  
  const finalConfig = config ?? defaults;
  
  return {
    temperature: overrides?.temperature ?? finalConfig.temperature,
    top_p: overrides?.topP ?? finalConfig.topP,
    top_k: overrides?.topK ?? finalConfig.topK,
    repeat_penalty: overrides?.repeatPenalty ?? finalConfig.repeatPenalty,
    num_predict: overrides?.numPredict ?? finalConfig.numPredict,
    num_ctx: finalConfig.contextWindow,
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

// =============================================================================
// VERTICAL INDUSTRY AGENT MAPPINGS
// =============================================================================

export const VERTICAL_AGENT_MAPPINGS: AgentModelMapping[] = [
  // FINANCIAL SERVICES
  { agentCode: 'fin-risk-sentinel', agentName: 'RiskSentinel', primaryModel: 'qwq:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Quantify all risks with probability and impact. Reference VaR and stress testing.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'fin-alpha-hunter', agentName: 'AlphaHunter', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Identify alpha opportunities with clear risk/reward profiles.', optimalTemperature: 0.6, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'fin-compliance-guardian', agentName: 'ComplianceGuardian', primaryModel: 'qwen3:32b', fallbackModels: ['qwq:32b'], systemPromptEnhancements: 'Cite specific regulations. Flag potential violations.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'fin-market-pulse', agentName: 'MarketPulse', primaryModel: 'llama3.2:3b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Process market data in real-time. Provide actionable signals.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },

  // HEALTHCARE
  { agentCode: 'hc-care-coordinator', agentName: 'CareCoordinator', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Ensure continuity of care. Reference clinical protocols and HIPAA.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'hc-clinical-advisor', agentName: 'ClinicalAdvisor', primaryModel: 'qwq:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Base recommendations on evidence. Flag contraindications.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'hc-capacity-oracle', agentName: 'CapacityOracle', primaryModel: 'llama3.2:3b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Optimize resource utilization. Predict demand.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'hc-quality-sentinel', agentName: 'QualitySentinel', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Monitor safety events. Reference quality frameworks.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },

  // MANUFACTURING
  { agentCode: 'mfg-production-master', agentName: 'ProductionMaster', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Maximize OEE. Identify bottlenecks with ROI estimates.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'mfg-predict-maintain', agentName: 'PredictMaintain', primaryModel: 'qwq:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Analyze sensor data. Predict failures with confidence intervals.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'mfg-quality-vision', agentName: 'QualityVision', primaryModel: 'llava:34b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Detect defects with precision. Perform root cause analysis.', optimalTemperature: 0.2, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'mfg-supply-sync', agentName: 'SupplySync', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Optimize inventory levels. Predict disruptions.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },

  // TECHNOLOGY
  { agentCode: 'tech-site-reliability', agentName: 'SiteReliability', primaryModel: 'deepseek-coder-v2', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Monitor system health. Correlate incidents.', optimalTemperature: 0.3, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'tech-security-fortress', agentName: 'SecurityFortress', primaryModel: 'qwq:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Detect threats. Assess vulnerabilities using NIST/ISO frameworks.', optimalTemperature: 0.2, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'tech-dev-velocity', agentName: 'DevVelocity', primaryModel: 'deepseek-coder-v2', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Optimize development workflows. Reduce cycle time.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'tech-data-architect', agentName: 'DataArchitect', primaryModel: 'deepseek-coder-v2', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Design scalable data architectures. Optimize queries.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },

  // ENERGY
  { agentCode: 'eng-grid-balancer', agentName: 'GridBalancer', primaryModel: 'qwq:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Balance load and generation. Predict demand.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'eng-renewable-optimizer', agentName: 'RenewableOptimizer', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Maximize renewable output. Forecast weather impacts.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'eng-asset-guardian', agentName: 'AssetGuardian', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Monitor asset health. Predict failures.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'eng-demand-response', agentName: 'DemandResponse', primaryModel: 'llama3.2:3b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Coordinate demand response. Optimize programs.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },

  // GOVERNMENT
  { agentCode: 'gov-policy-advisor', agentName: 'PolicyAdvisor', primaryModel: 'qwq:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Analyze policy impacts. Provide evidence-based recommendations.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'gov-citizen-engage', agentName: 'CitizenEngage', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Improve citizen experience. Route services efficiently.', optimalTemperature: 0.6, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'gov-budget-optimizer', agentName: 'BudgetOptimizer', primaryModel: 'qwen3:32b', fallbackModels: ['qwq:32b'], systemPromptEnhancements: 'Optimize budget allocation. Track spending efficiency.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'gov-transparency-engine', agentName: 'TransparencyEngine', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Ensure transparency. Process records requests.', optimalTemperature: 0.3, useChainOfThought: false, useEnsemble: false },

  // LOGISTICS
  { agentCode: 'log-route-optimizer', agentName: 'RouteOptimizer', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Optimize routes dynamically. Consider traffic and time windows.', optimalTemperature: 0.3, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'log-warehouse-brain', agentName: 'WarehouseBrain', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Optimize warehouse operations. Improve pick efficiency.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'log-demand-predictor', agentName: 'DemandPredictor', primaryModel: 'qwq:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Forecast demand accurately. Consider seasonality.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'log-carrier-manager', agentName: 'CarrierManager', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Optimize carrier selection. Benchmark rates.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },

  // RETAIL
  { agentCode: 'ret-merchandising-ai', agentName: 'MerchandisingAI', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Optimize product mix. Maximize sales per square foot.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'ret-pricing-engine', agentName: 'PricingEngine', primaryModel: 'qwq:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Optimize prices dynamically. Consider elasticity and competition.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'ret-customer-insight', agentName: 'CustomerInsight', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Understand customer behavior. Predict churn.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'ret-omni-sync', agentName: 'OmniSync', primaryModel: 'llama3.2:3b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Synchronize channels. Optimize fulfillment.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },

  // EDUCATION
  { agentCode: 'edu-student-success', agentName: 'StudentSuccess', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Identify at-risk students early. Recommend interventions.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'edu-learning-advisor', agentName: 'LearningAdvisor', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Personalize learning paths. Recommend content.', optimalTemperature: 0.6, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'edu-enrollment-optimizer', agentName: 'EnrollmentOptimizer', primaryModel: 'qwq:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Optimize recruitment funnel. Predict yield.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'edu-workforce-connector', agentName: 'WorkforceConnector', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Match students to opportunities. Analyze skills gaps.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },

  // LEGAL
  { agentCode: 'leg-case-strategist', agentName: 'CaseStrategist', primaryModel: 'qwq:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Analyze precedents. Predict outcomes.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'leg-contract-analyzer', agentName: 'ContractAnalyzer', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Extract key clauses. Identify risks.', optimalTemperature: 0.3, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'leg-discovery-engine', agentName: 'DiscoveryEngine', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Classify documents efficiently. Identify privilege.', optimalTemperature: 0.2, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'leg-compliance-tracker', agentName: 'ComplianceTracker', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Monitor regulatory changes. Track obligations.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },

  // REAL ESTATE
  { agentCode: 're-valuation-engine', agentName: 'ValuationEngine', primaryModel: 'qwq:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Value properties accurately. Analyze comparables.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },
  { agentCode: 're-lease-optimizer', agentName: 'LeaseOptimizer', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Optimize rent. Abstract lease terms.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 're-property-manager', agentName: 'PropertyManager', primaryModel: 'llama3.2:3b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Manage work orders. Schedule maintenance.', optimalTemperature: 0.5, useChainOfThought: false, useEnsemble: false },
  { agentCode: 're-investment-analyst', agentName: 'InvestmentAnalyst', primaryModel: 'qwq:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Model DCF. Assess risks.', optimalTemperature: 0.4, useChainOfThought: true, useEnsemble: false },

  // INSURANCE
  { agentCode: 'ins-underwriting-ai', agentName: 'UnderwritingAI', primaryModel: 'qwq:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Score risks accurately. Calculate premiums.', optimalTemperature: 0.3, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'ins-claims-processor', agentName: 'ClaimsProcessor', primaryModel: 'qwen3:32b', fallbackModels: ['llama3.2:3b'], systemPromptEnhancements: 'Triage claims efficiently. Estimate reserves.', optimalTemperature: 0.4, useChainOfThought: false, useEnsemble: false },
  { agentCode: 'ins-fraud-detector', agentName: 'FraudDetector', primaryModel: 'qwq:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Identify suspicious patterns. Score fraud likelihood.', optimalTemperature: 0.2, useChainOfThought: true, useEnsemble: false },
  { agentCode: 'ins-actuarial-engine', agentName: 'ActuarialEngine', primaryModel: 'qwq:32b', fallbackModels: ['qwen3:32b'], systemPromptEnhancements: 'Develop loss triangles. Estimate IBNR.', optimalTemperature: 0.2, useChainOfThought: true, useEnsemble: false },
];

// Combined agent mappings (C-Suite + Vertical)
export const ALL_AGENT_MAPPINGS: AgentModelMapping[] = [
  ...AGENT_MODEL_MAPPINGS,
  ...VERTICAL_AGENT_MAPPINGS,
];

export const MODEL_ZOO_SUMMARY = {
  totalModels: Object.keys(MODEL_REGISTRY).length,
  primaryModels: Object.values(MODEL_REGISTRY).filter(m => m.priority === 'primary').length,
  agentMappings: ALL_AGENT_MAPPINGS.length,
  cSuiteAgents: AGENT_MODEL_MAPPINGS.length,
  verticalAgents: VERTICAL_AGENT_MAPPINGS.length,
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
