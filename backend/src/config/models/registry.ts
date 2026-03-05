import type { ModelConfig } from './modelZoo.js';

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

  'qwen3-coder:30b': {
    id: 'qwen3-coder:30b',
    name: 'Qwen3 Coder 30B',
    description: 'Purpose-built for agentic coding workflows, tool calling, and structured output.',
    contextWindow: 131072,
    temperature: 0.1,
    topP: 0.95,
    topK: 10,
    repeatPenalty: 1.05,
    numPredict: 8192,
    specializations: ['coding', 'sql', 'json', 'data-ops', 'automation', 'tool-calling'],
    ramRequired: '18GB+',
    priority: 'primary',
    vendor: 'Alibaba/Qwen',
    license: 'Apache 2.0',
    releaseDate: '2025-05',
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

  'qwen3-embedding:4b': {
    id: 'qwen3-embedding:4b',
    name: 'Qwen3 Embedding 4B',
    description: 'Multilingual embedding model for RAG - 2560 dimensions.',
    contextWindow: 32768,
    temperature: 0,
    topP: 1,
    topK: 1,
    repeatPenalty: 1,
    numPredict: 0,  // Embeddings only
    specializations: ['embedding', 'rag', 'similarity', 'multilingual'],
    ramRequired: '3GB+',
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
