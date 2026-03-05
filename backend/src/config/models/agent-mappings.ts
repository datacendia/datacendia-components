import type { AgentModelMapping } from '../modelZoo.js';

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
    primaryModel: 'qwen3-coder:30b',  // Best at data and SQL
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
    primaryModel: 'qwen3-coder:30b',
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
    primaryModel: 'qwen3-coder:30b',
    fallbackModels: ['qwen3:32b', 'llama3.2:3b'],
    systemPromptEnhancements: 'Focus on systems integration and information architecture.',
    optimalTemperature: 0.4,
    useChainOfThought: false,
    useEnsemble: false,
  },
  {
    agentCode: 'devils-advocate',
    agentName: 'CendiaDevil',
    primaryModel: 'deepseek-r1:32b',  // Deep reasoning for contrarian analysis
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
    primaryModel: 'qwen3-coder:30b',
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
    primaryModel: 'deepseek-r1:32b',  // Deep reasoning for ethical dilemmas
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
    primaryModel: 'deepseek-r1:32b',  // Deep reasoning for safety analysis
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
    primaryModel: 'deepseek-r1:32b',  // Complex quantitative analysis
    fallbackModels: ['qwen3-coder:30b', 'qwen3:32b'],
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
    primaryModel: 'deepseek-r1:32b',
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
    primaryModel: 'deepseek-r1:32b',
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
