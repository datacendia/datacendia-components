// @ts-nocheck
// =============================================================================
// MODEL SWITCHING SYSTEM
// Easy model switching for all AI Agents and Services
// =============================================================================

// =============================================================================
// AVAILABLE MODELS
// =============================================================================
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
export interface OllamaModel {
  id: string;
  name: string;
  size: string;
  description: string;
  capabilities: ModelCapability[];
  contextLength: number;
  speed: 'fast' | 'medium' | 'slow';
  quality: 'basic' | 'good' | 'excellent' | 'flagship';
  useCase: string[];
  memoryRequired: string;
  default?: boolean;
}
export type ModelCapability = 'reasoning' | 'coding' | 'analysis' | 'creative' | 'summarization' | 'chat' | 'instruction-following' | 'multilingual' | 'math' | 'vision';

// =============================================================================
// MODEL REGISTRY - All Available Ollama Models
// =============================================================================

export const AVAILABLE_MODELS: OllamaModel[] = stryMutAct_9fa48("11932") ? [] : (stryCov_9fa48("11932"), [// =========================================================================
// LLAMA 3.3 FAMILY
// =========================================================================
stryMutAct_9fa48("11933") ? {} : (stryCov_9fa48("11933"), {
  id: 'qwen2.5:7b',
  name: 'Llama 3.3 70B',
  size: '70B',
  description: 'Meta\'s flagship model. Best overall performance for complex tasks.',
  capabilities: stryMutAct_9fa48("11938") ? [] : (stryCov_9fa48("11938"), ['reasoning', 'analysis', 'creative', 'summarization', 'chat', 'instruction-following', 'multilingual']),
  contextLength: 128000,
  speed: 'slow',
  quality: 'flagship',
  useCase: stryMutAct_9fa48("11948") ? [] : (stryCov_9fa48("11948"), ['Strategic analysis', 'Complex reasoning', 'Executive summaries', 'Multi-domain synthesis']),
  memoryRequired: '48GB+',
  default: stryMutAct_9fa48("11954") ? false : (stryCov_9fa48("11954"), true)
}), stryMutAct_9fa48("11955") ? {} : (stryCov_9fa48("11955"), {
  id: 'llama3.3:latest',
  name: 'Llama 3.3 (Default)',
  size: '70B',
  description: 'Latest Llama 3.3 with optimal quantization.',
  capabilities: stryMutAct_9fa48("11960") ? [] : (stryCov_9fa48("11960"), ['reasoning', 'analysis', 'creative', 'summarization', 'chat', 'instruction-following']),
  contextLength: 128000,
  speed: 'slow',
  quality: 'flagship',
  useCase: stryMutAct_9fa48("11969") ? [] : (stryCov_9fa48("11969"), ['General purpose flagship tasks']),
  memoryRequired: '48GB+'
}), // =========================================================================
// LLAMA 3.2 FAMILY
// =========================================================================
stryMutAct_9fa48("11972") ? {} : (stryCov_9fa48("11972"), {
  id: 'llama3.2:3b',
  name: 'Llama 3.2 3B',
  size: '3B',
  description: 'Fast, efficient model for simple tasks. Great for quick responses.',
  capabilities: stryMutAct_9fa48("11977") ? [] : (stryCov_9fa48("11977"), ['chat', 'summarization', 'instruction-following']),
  contextLength: 128000,
  speed: 'fast',
  quality: 'good',
  useCase: stryMutAct_9fa48("11983") ? [] : (stryCov_9fa48("11983"), ['Quick responses', 'Simple queries', 'High-volume tasks', 'Real-time chat']),
  memoryRequired: '4GB'
}), stryMutAct_9fa48("11989") ? {} : (stryCov_9fa48("11989"), {
  id: 'llama3.2:1b',
  name: 'Llama 3.2 1B',
  size: '1B',
  description: 'Ultra-fast, minimal resource model. Best for edge/embedded.',
  capabilities: stryMutAct_9fa48("11994") ? [] : (stryCov_9fa48("11994"), ['chat', 'instruction-following']),
  contextLength: 128000,
  speed: 'fast',
  quality: 'basic',
  useCase: stryMutAct_9fa48("11999") ? [] : (stryCov_9fa48("11999"), ['Edge deployment', 'Embedded systems', 'Ultra-low latency']),
  memoryRequired: '2GB'
}), stryMutAct_9fa48("12004") ? {} : (stryCov_9fa48("12004"), {
  id: 'llama3.2-vision:11b',
  name: 'Llama 3.2 Vision 11B',
  size: '11B',
  description: 'Multimodal model with vision capabilities.',
  capabilities: stryMutAct_9fa48("12009") ? [] : (stryCov_9fa48("12009"), ['vision', 'chat', 'analysis', 'instruction-following']),
  contextLength: 128000,
  speed: 'medium',
  quality: 'excellent',
  useCase: stryMutAct_9fa48("12016") ? [] : (stryCov_9fa48("12016"), ['Image analysis', 'Document OCR', 'Visual Q&A', 'Chart interpretation']),
  memoryRequired: '12GB'
}), // =========================================================================
// QWQ (Reasoning Specialist)
// =========================================================================
stryMutAct_9fa48("12022") ? {} : (stryCov_9fa48("12022"), {
  id: 'qwen2.5:7b',
  name: 'QwQ 32B',
  size: '32B',
  description: 'Alibaba\'s reasoning specialist. Exceptional for complex analysis.',
  capabilities: stryMutAct_9fa48("12027") ? [] : (stryCov_9fa48("12027"), ['reasoning', 'math', 'analysis', 'coding']),
  contextLength: 32768,
  speed: 'medium',
  quality: 'excellent',
  useCase: stryMutAct_9fa48("12034") ? [] : (stryCov_9fa48("12034"), ['Deep reasoning', 'Risk analysis', 'Legal review', 'Security assessment', 'Complex problem solving']),
  memoryRequired: '24GB'
}), stryMutAct_9fa48("12041") ? {} : (stryCov_9fa48("12041"), {
  id: 'qwq:latest',
  name: 'QwQ (Latest)',
  size: '32B',
  description: 'Latest QwQ with optimal settings.',
  capabilities: stryMutAct_9fa48("12046") ? [] : (stryCov_9fa48("12046"), ['reasoning', 'math', 'analysis', 'coding']),
  contextLength: 32768,
  speed: 'medium',
  quality: 'excellent',
  useCase: stryMutAct_9fa48("12053") ? [] : (stryCov_9fa48("12053"), ['Reasoning tasks', 'Analytical work']),
  memoryRequired: '24GB'
}), // =========================================================================
// QWEN 2.5 FAMILY
// =========================================================================
stryMutAct_9fa48("12057") ? {} : (stryCov_9fa48("12057"), {
  id: 'qwen2.5:72b',
  name: 'Qwen 2.5 72B',
  size: '72B',
  description: 'Alibaba\'s flagship general-purpose model.',
  capabilities: stryMutAct_9fa48("12062") ? [] : (stryCov_9fa48("12062"), ['reasoning', 'analysis', 'creative', 'multilingual', 'chat']),
  contextLength: 131072,
  speed: 'slow',
  quality: 'flagship',
  useCase: stryMutAct_9fa48("12070") ? [] : (stryCov_9fa48("12070"), ['General flagship tasks', 'Multilingual applications']),
  memoryRequired: '48GB+'
}), stryMutAct_9fa48("12074") ? {} : (stryCov_9fa48("12074"), {
  id: 'qwen2.5:7b',
  name: 'Qwen 2.5 32B',
  size: '32B',
  description: 'Balanced Qwen model for general use.',
  capabilities: stryMutAct_9fa48("12079") ? [] : (stryCov_9fa48("12079"), ['reasoning', 'analysis', 'chat', 'multilingual']),
  contextLength: 131072,
  speed: 'medium',
  quality: 'excellent',
  useCase: stryMutAct_9fa48("12086") ? [] : (stryCov_9fa48("12086"), ['General purpose', 'Multilingual tasks']),
  memoryRequired: '24GB'
}), stryMutAct_9fa48("12090") ? {} : (stryCov_9fa48("12090"), {
  id: 'qwen2.5:14b',
  name: 'Qwen 2.5 14B',
  size: '14B',
  description: 'Efficient Qwen model for moderate tasks.',
  capabilities: stryMutAct_9fa48("12095") ? [] : (stryCov_9fa48("12095"), ['chat', 'analysis', 'multilingual']),
  contextLength: 131072,
  speed: 'medium',
  quality: 'good',
  useCase: stryMutAct_9fa48("12101") ? [] : (stryCov_9fa48("12101"), ['Moderate complexity', 'Good balance of speed/quality']),
  memoryRequired: '12GB'
}), stryMutAct_9fa48("12105") ? {} : (stryCov_9fa48("12105"), {
  id: 'qwen2.5:7b',
  name: 'Qwen 2.5 7B',
  size: '7B',
  description: 'Fast Qwen model for quick tasks.',
  capabilities: stryMutAct_9fa48("12110") ? [] : (stryCov_9fa48("12110"), ['chat', 'instruction-following']),
  contextLength: 131072,
  speed: 'fast',
  quality: 'good',
  useCase: stryMutAct_9fa48("12115") ? [] : (stryCov_9fa48("12115"), ['Quick responses', 'High throughput']),
  memoryRequired: '8GB'
}), stryMutAct_9fa48("12119") ? {} : (stryCov_9fa48("12119"), {
  id: 'qwen2.5:7b',
  name: 'Qwen 2.5 Coder 32B',
  size: '32B',
  description: 'Specialized for code generation and analysis.',
  capabilities: stryMutAct_9fa48("12124") ? [] : (stryCov_9fa48("12124"), ['coding', 'reasoning', 'analysis']),
  contextLength: 131072,
  speed: 'medium',
  quality: 'excellent',
  useCase: stryMutAct_9fa48("12130") ? [] : (stryCov_9fa48("12130"), ['Code generation', 'Code review', 'Data operations', 'Technical analysis']),
  memoryRequired: '24GB'
}), stryMutAct_9fa48("12136") ? {} : (stryCov_9fa48("12136"), {
  id: 'qwen2.5-coder:14b',
  name: 'Qwen 2.5 Coder 14B',
  size: '14B',
  description: 'Efficient coding model.',
  capabilities: stryMutAct_9fa48("12141") ? [] : (stryCov_9fa48("12141"), ['coding', 'analysis']),
  contextLength: 131072,
  speed: 'medium',
  quality: 'good',
  useCase: stryMutAct_9fa48("12146") ? [] : (stryCov_9fa48("12146"), ['Code tasks', 'Quick coding help']),
  memoryRequired: '12GB'
}), stryMutAct_9fa48("12150") ? {} : (stryCov_9fa48("12150"), {
  id: 'qwen2.5-coder:7b',
  name: 'Qwen 2.5 Coder 7B',
  size: '7B',
  description: 'Fast coding assistant.',
  capabilities: stryMutAct_9fa48("12155") ? [] : (stryCov_9fa48("12155"), ['coding']),
  contextLength: 131072,
  speed: 'fast',
  quality: 'good',
  useCase: stryMutAct_9fa48("12159") ? [] : (stryCov_9fa48("12159"), ['Quick code completion', 'Simple coding tasks']),
  memoryRequired: '8GB'
}), // =========================================================================
// DEEPSEEK FAMILY
// =========================================================================
stryMutAct_9fa48("12163") ? {} : (stryCov_9fa48("12163"), {
  id: 'deepseek-r1:70b',
  name: 'DeepSeek R1 70B',
  size: '70B',
  description: 'DeepSeek\'s reasoning model with chain-of-thought.',
  capabilities: stryMutAct_9fa48("12168") ? [] : (stryCov_9fa48("12168"), ['reasoning', 'math', 'coding', 'analysis']),
  contextLength: 64000,
  speed: 'slow',
  quality: 'flagship',
  useCase: stryMutAct_9fa48("12175") ? [] : (stryCov_9fa48("12175"), ['Complex reasoning', 'Mathematical proofs', 'Deep analysis']),
  memoryRequired: '48GB+'
}), stryMutAct_9fa48("12180") ? {} : (stryCov_9fa48("12180"), {
  id: 'deepseek-r1:32b',
  name: 'DeepSeek R1 32B',
  size: '32B',
  description: 'Efficient DeepSeek reasoning model.',
  capabilities: stryMutAct_9fa48("12185") ? [] : (stryCov_9fa48("12185"), ['reasoning', 'math', 'coding']),
  contextLength: 64000,
  speed: 'medium',
  quality: 'excellent',
  useCase: stryMutAct_9fa48("12191") ? [] : (stryCov_9fa48("12191"), ['Reasoning tasks', 'Math problems']),
  memoryRequired: '24GB'
}), stryMutAct_9fa48("12195") ? {} : (stryCov_9fa48("12195"), {
  id: 'deepseek-r1:14b',
  name: 'DeepSeek R1 14B',
  size: '14B',
  description: 'Fast DeepSeek reasoning model.',
  capabilities: stryMutAct_9fa48("12200") ? [] : (stryCov_9fa48("12200"), ['reasoning', 'coding']),
  contextLength: 64000,
  speed: 'medium',
  quality: 'good',
  useCase: stryMutAct_9fa48("12205") ? [] : (stryCov_9fa48("12205"), ['Quick reasoning', 'Moderate complexity']),
  memoryRequired: '12GB'
}), stryMutAct_9fa48("12209") ? {} : (stryCov_9fa48("12209"), {
  id: 'deepseek-coder-v2:236b',
  name: 'DeepSeek Coder V2 236B',
  size: '236B',
  description: 'Massive coding model for complex development.',
  capabilities: stryMutAct_9fa48("12214") ? [] : (stryCov_9fa48("12214"), ['coding', 'reasoning', 'analysis']),
  contextLength: 128000,
  speed: 'slow',
  quality: 'flagship',
  useCase: stryMutAct_9fa48("12220") ? [] : (stryCov_9fa48("12220"), ['Enterprise code generation', 'Complex refactoring']),
  memoryRequired: '128GB+'
}), // =========================================================================
// MISTRAL FAMILY
// =========================================================================
stryMutAct_9fa48("12224") ? {} : (stryCov_9fa48("12224"), {
  id: 'mistral:7b',
  name: 'Mistral 7B',
  size: '7B',
  description: 'Efficient European model with strong performance.',
  capabilities: stryMutAct_9fa48("12229") ? [] : (stryCov_9fa48("12229"), ['chat', 'instruction-following', 'reasoning']),
  contextLength: 32768,
  speed: 'fast',
  quality: 'good',
  useCase: stryMutAct_9fa48("12235") ? [] : (stryCov_9fa48("12235"), ['General chat', 'Quick responses']),
  memoryRequired: '8GB'
}), stryMutAct_9fa48("12239") ? {} : (stryCov_9fa48("12239"), {
  id: 'mistral-large:123b',
  name: 'Mistral Large 123B',
  size: '123B',
  description: 'Mistral\'s flagship model.',
  capabilities: stryMutAct_9fa48("12244") ? [] : (stryCov_9fa48("12244"), ['reasoning', 'analysis', 'creative', 'multilingual']),
  contextLength: 128000,
  speed: 'slow',
  quality: 'flagship',
  useCase: stryMutAct_9fa48("12251") ? [] : (stryCov_9fa48("12251"), ['Enterprise applications', 'Complex analysis']),
  memoryRequired: '80GB+'
}), stryMutAct_9fa48("12255") ? {} : (stryCov_9fa48("12255"), {
  id: 'mixtral:8x7b',
  name: 'Mixtral 8x7B',
  size: '47B (MoE)',
  description: 'Mixture of Experts model - efficient and powerful.',
  capabilities: stryMutAct_9fa48("12260") ? [] : (stryCov_9fa48("12260"), ['reasoning', 'chat', 'coding', 'multilingual']),
  contextLength: 32768,
  speed: 'medium',
  quality: 'excellent',
  useCase: stryMutAct_9fa48("12267") ? [] : (stryCov_9fa48("12267"), ['Balanced workloads', 'Multilingual tasks']),
  memoryRequired: '32GB'
}), stryMutAct_9fa48("12271") ? {} : (stryCov_9fa48("12271"), {
  id: 'qwen2.5:7b',
  name: 'Mixtral 8x22B',
  size: '141B (MoE)',
  description: 'Large Mixture of Experts model.',
  capabilities: stryMutAct_9fa48("12276") ? [] : (stryCov_9fa48("12276"), ['reasoning', 'analysis', 'creative', 'coding']),
  contextLength: 65536,
  speed: 'slow',
  quality: 'flagship',
  useCase: stryMutAct_9fa48("12283") ? [] : (stryCov_9fa48("12283"), ['Complex enterprise tasks']),
  memoryRequired: '64GB+'
}), // =========================================================================
// GEMMA FAMILY (Google)
// =========================================================================
stryMutAct_9fa48("12286") ? {} : (stryCov_9fa48("12286"), {
  id: 'gemma2:27b',
  name: 'Gemma 2 27B',
  size: '27B',
  description: 'Google\'s open model with strong reasoning.',
  capabilities: stryMutAct_9fa48("12291") ? [] : (stryCov_9fa48("12291"), ['reasoning', 'chat', 'analysis', 'instruction-following']),
  contextLength: 8192,
  speed: 'medium',
  quality: 'excellent',
  useCase: stryMutAct_9fa48("12298") ? [] : (stryCov_9fa48("12298"), ['General purpose', 'Research applications']),
  memoryRequired: '20GB'
}), stryMutAct_9fa48("12302") ? {} : (stryCov_9fa48("12302"), {
  id: 'gemma2:9b',
  name: 'Gemma 2 9B',
  size: '9B',
  description: 'Efficient Google model.',
  capabilities: stryMutAct_9fa48("12307") ? [] : (stryCov_9fa48("12307"), ['chat', 'instruction-following']),
  contextLength: 8192,
  speed: 'fast',
  quality: 'good',
  useCase: stryMutAct_9fa48("12312") ? [] : (stryCov_9fa48("12312"), ['Quick tasks', 'Moderate complexity']),
  memoryRequired: '10GB'
}), stryMutAct_9fa48("12316") ? {} : (stryCov_9fa48("12316"), {
  id: 'gemma2:2b',
  name: 'Gemma 2 2B',
  size: '2B',
  description: 'Ultra-efficient Google model.',
  capabilities: stryMutAct_9fa48("12321") ? [] : (stryCov_9fa48("12321"), ['chat']),
  contextLength: 8192,
  speed: 'fast',
  quality: 'basic',
  useCase: stryMutAct_9fa48("12325") ? [] : (stryCov_9fa48("12325"), ['Edge deployment', 'Simple tasks']),
  memoryRequired: '4GB'
}), // =========================================================================
// PHI FAMILY (Microsoft)
// =========================================================================
stryMutAct_9fa48("12329") ? {} : (stryCov_9fa48("12329"), {
  id: 'phi3:14b',
  name: 'Phi-3 14B',
  size: '14B',
  description: 'Microsoft\'s efficient reasoning model.',
  capabilities: stryMutAct_9fa48("12334") ? [] : (stryCov_9fa48("12334"), ['reasoning', 'math', 'coding']),
  contextLength: 128000,
  speed: 'medium',
  quality: 'good',
  useCase: stryMutAct_9fa48("12340") ? [] : (stryCov_9fa48("12340"), ['Reasoning tasks', 'Educational applications']),
  memoryRequired: '12GB'
}), stryMutAct_9fa48("12344") ? {} : (stryCov_9fa48("12344"), {
  id: 'phi3:mini',
  name: 'Phi-3 Mini',
  size: '3.8B',
  description: 'Compact Microsoft model with good reasoning.',
  capabilities: stryMutAct_9fa48("12349") ? [] : (stryCov_9fa48("12349"), ['reasoning', 'chat']),
  contextLength: 128000,
  speed: 'fast',
  quality: 'good',
  useCase: stryMutAct_9fa48("12354") ? [] : (stryCov_9fa48("12354"), ['Quick reasoning', 'Mobile/edge']),
  memoryRequired: '4GB'
}), // =========================================================================
// COMMAND R FAMILY (Cohere)
// =========================================================================
stryMutAct_9fa48("12358") ? {} : (stryCov_9fa48("12358"), {
  id: 'command-r:35b',
  name: 'Command R 35B',
  size: '35B',
  description: 'Cohere\'s RAG-optimized model.',
  capabilities: stryMutAct_9fa48("12363") ? [] : (stryCov_9fa48("12363"), ['reasoning', 'analysis', 'summarization', 'chat']),
  contextLength: 128000,
  speed: 'medium',
  quality: 'excellent',
  useCase: stryMutAct_9fa48("12370") ? [] : (stryCov_9fa48("12370"), ['RAG applications', 'Document analysis', 'Enterprise search']),
  memoryRequired: '24GB'
}), stryMutAct_9fa48("12375") ? {} : (stryCov_9fa48("12375"), {
  id: 'command-r-plus:104b',
  name: 'Command R+ 104B',
  size: '104B',
  description: 'Cohere\'s flagship enterprise model.',
  capabilities: stryMutAct_9fa48("12380") ? [] : (stryCov_9fa48("12380"), ['reasoning', 'analysis', 'summarization', 'creative']),
  contextLength: 128000,
  speed: 'slow',
  quality: 'flagship',
  useCase: stryMutAct_9fa48("12387") ? [] : (stryCov_9fa48("12387"), ['Enterprise RAG', 'Complex document work']),
  memoryRequired: '64GB+'
}), // =========================================================================
// CODESTRAL (Mistral Coding)
// =========================================================================
stryMutAct_9fa48("12391") ? {} : (stryCov_9fa48("12391"), {
  id: 'codestral:22b',
  name: 'Codestral 22B',
  size: '22B',
  description: 'Mistral\'s dedicated coding model.',
  capabilities: stryMutAct_9fa48("12396") ? [] : (stryCov_9fa48("12396"), ['coding', 'reasoning']),
  contextLength: 32768,
  speed: 'medium',
  quality: 'excellent',
  useCase: stryMutAct_9fa48("12401") ? [] : (stryCov_9fa48("12401"), ['Code generation', 'Code review', 'Refactoring']),
  memoryRequired: '16GB'
}), // =========================================================================
// STARCODER FAMILY
// =========================================================================
stryMutAct_9fa48("12406") ? {} : (stryCov_9fa48("12406"), {
  id: 'starcoder2:15b',
  name: 'StarCoder 2 15B',
  size: '15B',
  description: 'Open-source coding model trained on The Stack.',
  capabilities: stryMutAct_9fa48("12411") ? [] : (stryCov_9fa48("12411"), ['coding']),
  contextLength: 16384,
  speed: 'medium',
  quality: 'good',
  useCase: stryMutAct_9fa48("12415") ? [] : (stryCov_9fa48("12415"), ['Code completion', 'Multi-language coding']),
  memoryRequired: '12GB'
}), stryMutAct_9fa48("12419") ? {} : (stryCov_9fa48("12419"), {
  id: 'starcoder2:7b',
  name: 'StarCoder 2 7B',
  size: '7B',
  description: 'Efficient StarCoder model.',
  capabilities: stryMutAct_9fa48("12424") ? [] : (stryCov_9fa48("12424"), ['coding']),
  contextLength: 16384,
  speed: 'fast',
  quality: 'good',
  useCase: stryMutAct_9fa48("12428") ? [] : (stryCov_9fa48("12428"), ['Quick code completion']),
  memoryRequired: '8GB'
}), // =========================================================================
// EMBEDDING MODELS
// =========================================================================
stryMutAct_9fa48("12431") ? {} : (stryCov_9fa48("12431"), {
  id: 'nomic-embed-text:latest',
  name: 'Nomic Embed Text',
  size: '137M',
  description: 'High-quality text embeddings.',
  capabilities: stryMutAct_9fa48("12436") ? [] : (stryCov_9fa48("12436"), ['analysis']),
  contextLength: 8192,
  speed: 'fast',
  quality: 'excellent',
  useCase: stryMutAct_9fa48("12440") ? [] : (stryCov_9fa48("12440"), ['Semantic search', 'RAG', 'Clustering']),
  memoryRequired: '1GB'
}), stryMutAct_9fa48("12445") ? {} : (stryCov_9fa48("12445"), {
  id: 'mxbai-embed-large:335m',
  name: 'MxBAI Embed Large',
  size: '335M',
  description: 'Large embedding model for semantic search.',
  capabilities: stryMutAct_9fa48("12450") ? [] : (stryCov_9fa48("12450"), ['analysis']),
  contextLength: 512,
  speed: 'fast',
  quality: 'excellent',
  useCase: stryMutAct_9fa48("12454") ? [] : (stryCov_9fa48("12454"), ['Semantic search', 'Document similarity']),
  memoryRequired: '2GB'
})]);

// =============================================================================
// MODEL CATEGORIES FOR UI
// =============================================================================

export interface ModelCategory {
  id: string;
  name: string;
  description: string;
  models: string[];
}
export const MODEL_CATEGORIES: ModelCategory[] = stryMutAct_9fa48("12458") ? [] : (stryCov_9fa48("12458"), [stryMutAct_9fa48("12459") ? {} : (stryCov_9fa48("12459"), {
  id: 'flagship',
  name: '🏆 Flagship Models',
  description: 'Best quality, highest resource usage',
  models: stryMutAct_9fa48("12463") ? [] : (stryCov_9fa48("12463"), ['qwen2.5:7b', 'qwen2.5:72b', 'deepseek-r1:70b', 'mistral-large:123b', 'command-r-plus:104b'])
}), stryMutAct_9fa48("12469") ? {} : (stryCov_9fa48("12469"), {
  id: 'reasoning',
  name: '🧠 Reasoning Specialists',
  description: 'Optimized for complex analysis and logic',
  models: stryMutAct_9fa48("12473") ? [] : (stryCov_9fa48("12473"), ['qwen2.5:7b', 'deepseek-r1:32b', 'phi3:14b', 'gemma2:27b'])
}), stryMutAct_9fa48("12478") ? {} : (stryCov_9fa48("12478"), {
  id: 'coding',
  name: '💻 Coding Models',
  description: 'Specialized for code generation and analysis',
  models: stryMutAct_9fa48("12482") ? [] : (stryCov_9fa48("12482"), ['qwen2.5:7b', 'deepseek-coder-v2:236b', 'codestral:22b', 'starcoder2:15b'])
}), stryMutAct_9fa48("12487") ? {} : (stryCov_9fa48("12487"), {
  id: 'balanced',
  name: '⚖️ Balanced Models',
  description: 'Good balance of speed and quality',
  models: stryMutAct_9fa48("12491") ? [] : (stryCov_9fa48("12491"), ['qwen2.5:7b', 'mixtral:8x7b', 'command-r:35b', 'gemma2:27b'])
}), stryMutAct_9fa48("12496") ? {} : (stryCov_9fa48("12496"), {
  id: 'fast',
  name: '⚡ Fast Models',
  description: 'Quick responses, lower resource usage',
  models: stryMutAct_9fa48("12500") ? [] : (stryCov_9fa48("12500"), ['llama3.2:3b', 'qwen2.5:7b', 'mistral:7b', 'gemma2:9b', 'phi3:mini'])
}), stryMutAct_9fa48("12506") ? {} : (stryCov_9fa48("12506"), {
  id: 'edge',
  name: '📱 Edge/Embedded',
  description: 'Minimal resource usage, mobile-friendly',
  models: stryMutAct_9fa48("12510") ? [] : (stryCov_9fa48("12510"), ['llama3.2:1b', 'gemma2:2b'])
}), stryMutAct_9fa48("12513") ? {} : (stryCov_9fa48("12513"), {
  id: 'vision',
  name: '👁️ Vision Models',
  description: 'Multimodal with image understanding',
  models: stryMutAct_9fa48("12517") ? [] : (stryCov_9fa48("12517"), ['llama3.2-vision:11b'])
}), stryMutAct_9fa48("12519") ? {} : (stryCov_9fa48("12519"), {
  id: 'embedding',
  name: '🔍 Embedding Models',
  description: 'For semantic search and RAG',
  models: stryMutAct_9fa48("12523") ? [] : (stryCov_9fa48("12523"), ['nomic-embed-text:latest', 'mxbai-embed-large:335m'])
})]);

// =============================================================================
// RECOMMENDED MODELS BY AGENT ROLE
// =============================================================================

export const AGENT_MODEL_RECOMMENDATIONS: Record<string, string[]> = stryMutAct_9fa48("12526") ? {} : (stryCov_9fa48("12526"), {
  // Strategic / Executive
  chief: stryMutAct_9fa48("12527") ? [] : (stryCov_9fa48("12527"), ['qwen2.5:7b', 'qwen2.5:72b', 'command-r-plus:104b']),
  // Financial
  cfo: stryMutAct_9fa48("12531") ? [] : (stryCov_9fa48("12531"), ['qwen2.5:7b', 'qwen2.5:7b', 'deepseek-r1:70b']),
  cio: stryMutAct_9fa48("12535") ? [] : (stryCov_9fa48("12535"), ['qwen2.5:7b', 'qwen2.5:7b']),
  // Operations
  coo: stryMutAct_9fa48("12538") ? [] : (stryCov_9fa48("12538"), ['llama3.2:3b', 'qwen2.5:7b', 'mistral:7b']),
  // Security / Legal / Risk
  ciso: stryMutAct_9fa48("12542") ? [] : (stryCov_9fa48("12542"), ['qwen2.5:7b', 'deepseek-r1:32b', 'gemma2:27b']),
  clo: stryMutAct_9fa48("12546") ? [] : (stryCov_9fa48("12546"), ['qwen2.5:7b', 'command-r:35b']),
  risk: stryMutAct_9fa48("12549") ? [] : (stryCov_9fa48("12549"), ['qwen2.5:7b', 'deepseek-r1:32b']),
  // Marketing / Sales
  cmo: stryMutAct_9fa48("12552") ? [] : (stryCov_9fa48("12552"), ['qwen2.5:7b', 'qwen2.5:7b']),
  cro: stryMutAct_9fa48("12555") ? [] : (stryCov_9fa48("12555"), ['qwen2.5:7b', 'qwen2.5:7b']),
  cco: stryMutAct_9fa48("12558") ? [] : (stryCov_9fa48("12558"), ['llama3.2:3b', 'qwen2.5:7b']),
  // Data / Technical
  cdo: stryMutAct_9fa48("12561") ? [] : (stryCov_9fa48("12561"), ['qwen2.5:7b', 'deepseek-coder-v2:236b']),
  caio: stryMutAct_9fa48("12564") ? [] : (stryCov_9fa48("12564"), ['qwen2.5:7b', 'deepseek-r1:32b']),
  // Product / Innovation
  cpo: stryMutAct_9fa48("12567") ? [] : (stryCov_9fa48("12567"), ['qwen2.5:7b', 'qwen2.5:7b']),
  cso: stryMutAct_9fa48("12570") ? [] : (stryCov_9fa48("12570"), ['qwen2.5:7b', 'qwen2.5:7b']),
  // Premium Packs
  'ext-auditor': stryMutAct_9fa48("12573") ? [] : (stryCov_9fa48("12573"), ['qwen2.5:7b', 'command-r:35b']),
  'int-auditor': stryMutAct_9fa48("12576") ? [] : (stryCov_9fa48("12576"), ['qwen2.5:7b', 'qwen2.5:7b']),
  cmio: stryMutAct_9fa48("12579") ? [] : (stryCov_9fa48("12579"), ['qwen2.5:7b', 'qwen2.5:7b']),
  pso: stryMutAct_9fa48("12582") ? [] : (stryCov_9fa48("12582"), ['qwen2.5:7b', 'deepseek-r1:32b']),
  hco: stryMutAct_9fa48("12585") ? [] : (stryCov_9fa48("12585"), ['qwen2.5:7b', 'command-r:35b']),
  cod: stryMutAct_9fa48("12588") ? [] : (stryCov_9fa48("12588"), ['llama3.2:3b', 'qwen2.5:14b']),
  quant: stryMutAct_9fa48("12591") ? [] : (stryCov_9fa48("12591"), ['qwen2.5:7b', 'deepseek-r1:70b']),
  pm: stryMutAct_9fa48("12594") ? [] : (stryCov_9fa48("12594"), ['qwen2.5:7b', 'qwen2.5:7b']),
  'cro-finance': stryMutAct_9fa48("12597") ? [] : (stryCov_9fa48("12597"), ['qwen2.5:7b', 'deepseek-r1:32b']),
  treasury: stryMutAct_9fa48("12600") ? [] : (stryCov_9fa48("12600"), ['qwen2.5:7b', 'qwen2.5:7b']),
  contracts: stryMutAct_9fa48("12603") ? [] : (stryCov_9fa48("12603"), ['command-r:35b', 'qwen2.5:7b']),
  ip: stryMutAct_9fa48("12606") ? [] : (stryCov_9fa48("12606"), ['qwen2.5:7b', 'qwen2.5:7b']),
  litigation: stryMutAct_9fa48("12609") ? [] : (stryCov_9fa48("12609"), ['qwen2.5:7b', 'command-r-plus:104b']),
  regulatory: stryMutAct_9fa48("12612") ? [] : (stryCov_9fa48("12612"), ['qwen2.5:7b', 'command-r:35b'])
});

// =============================================================================
// MODEL SWITCHING FUNCTIONS
// =============================================================================

/**
 * Get all available models
 */
export function getAvailableModels(): OllamaModel[] {
  return AVAILABLE_MODELS;
}

/**
 * Get a model by ID
 */
export function getModel(modelId: string): OllamaModel | undefined {
  return AVAILABLE_MODELS.find(stryMutAct_9fa48("12617") ? () => undefined : (stryCov_9fa48("12617"), m => stryMutAct_9fa48("12620") ? m.id !== modelId : stryMutAct_9fa48("12619") ? false : stryMutAct_9fa48("12618") ? true : (stryCov_9fa48("12618", "12619", "12620"), m.id === modelId)));
}

/**
 * Get models by capability
 */
export function getModelsByCapability(capability: ModelCapability): OllamaModel[] {
  return stryMutAct_9fa48("12622") ? AVAILABLE_MODELS : (stryCov_9fa48("12622"), AVAILABLE_MODELS.filter(stryMutAct_9fa48("12623") ? () => undefined : (stryCov_9fa48("12623"), m => m.capabilities.includes(capability))));
}

/**
 * Get models by quality tier
 */
export function getModelsByQuality(quality: OllamaModel['quality']): OllamaModel[] {
  return stryMutAct_9fa48("12625") ? AVAILABLE_MODELS : (stryCov_9fa48("12625"), AVAILABLE_MODELS.filter(stryMutAct_9fa48("12626") ? () => undefined : (stryCov_9fa48("12626"), m => stryMutAct_9fa48("12629") ? m.quality !== quality : stryMutAct_9fa48("12628") ? false : stryMutAct_9fa48("12627") ? true : (stryCov_9fa48("12627", "12628", "12629"), m.quality === quality))));
}

/**
 * Get models by speed
 */
export function getModelsBySpeed(speed: OllamaModel['speed']): OllamaModel[] {
  return stryMutAct_9fa48("12631") ? AVAILABLE_MODELS : (stryCov_9fa48("12631"), AVAILABLE_MODELS.filter(stryMutAct_9fa48("12632") ? () => undefined : (stryCov_9fa48("12632"), m => stryMutAct_9fa48("12635") ? m.speed !== speed : stryMutAct_9fa48("12634") ? false : stryMutAct_9fa48("12633") ? true : (stryCov_9fa48("12633", "12634", "12635"), m.speed === speed))));
}

/**
 * Get recommended models for an agent
 */
export function getRecommendedModels(agentCode: string): OllamaModel[] {
  const recommendations = stryMutAct_9fa48("12639") ? AGENT_MODEL_RECOMMENDATIONS[agentCode] && ['qwen2.5:7b'] : stryMutAct_9fa48("12638") ? false : stryMutAct_9fa48("12637") ? true : (stryCov_9fa48("12637", "12638", "12639"), AGENT_MODEL_RECOMMENDATIONS[agentCode] || (stryMutAct_9fa48("12640") ? [] : (stryCov_9fa48("12640"), ['qwen2.5:7b'])));
  return stryMutAct_9fa48("12642") ? recommendations.map(id => getModel(id)) : (stryCov_9fa48("12642"), recommendations.map(stryMutAct_9fa48("12643") ? () => undefined : (stryCov_9fa48("12643"), id => getModel(id))).filter(stryMutAct_9fa48("12644") ? () => undefined : (stryCov_9fa48("12644"), (m): m is OllamaModel => stryMutAct_9fa48("12647") ? m === undefined : stryMutAct_9fa48("12646") ? false : stryMutAct_9fa48("12645") ? true : (stryCov_9fa48("12645", "12646", "12647"), m !== undefined))));
}

/**
 * Get the default model
 */
export function getDefaultModel(): OllamaModel {
  return stryMutAct_9fa48("12651") ? AVAILABLE_MODELS.find(m => m.default) && AVAILABLE_MODELS[0] : stryMutAct_9fa48("12650") ? false : stryMutAct_9fa48("12649") ? true : (stryCov_9fa48("12649", "12650", "12651"), AVAILABLE_MODELS.find(stryMutAct_9fa48("12652") ? () => undefined : (stryCov_9fa48("12652"), m => m.default)) || AVAILABLE_MODELS[0]);
}

/**
 * Get model categories for UI display
 */
export function getModelCategories(): ModelCategory[] {
  return MODEL_CATEGORIES;
}

/**
 * Estimate tokens per second for a model (rough estimate)
 */
export function estimateTokensPerSecond(modelId: string): number {
  const model = getModel(modelId);
  if (stryMutAct_9fa48("12657") ? false : stryMutAct_9fa48("12656") ? true : stryMutAct_9fa48("12655") ? model : (stryCov_9fa48("12655", "12656", "12657"), !model)) {
    return 20;
  }
  switch (model.speed) {
    case 'fast':
      if (stryMutAct_9fa48("12659")) {} else {
        stryCov_9fa48("12659");
        return 50;
      }
    case 'medium':
      if (stryMutAct_9fa48("12661")) {} else {
        stryCov_9fa48("12661");
        return 25;
      }
    case 'slow':
      if (stryMutAct_9fa48("12663")) {} else {
        stryCov_9fa48("12663");
        return 10;
      }
    default:
      if (stryMutAct_9fa48("12665")) {} else {
        stryCov_9fa48("12665");
        return 20;
      }
  }
}

/**
 * Check if a model is suitable for a capability
 */
export function isModelSuitable(modelId: string, capability: ModelCapability): boolean {
  const model = getModel(modelId);
  return stryMutAct_9fa48("12669") ? model?.capabilities.includes(capability) && false : stryMutAct_9fa48("12668") ? false : stryMutAct_9fa48("12667") ? true : (stryCov_9fa48("12667", "12668", "12669"), (stryMutAct_9fa48("12670") ? model.capabilities.includes(capability) : (stryCov_9fa48("12670"), model?.capabilities.includes(capability))) || (stryMutAct_9fa48("12671") ? true : (stryCov_9fa48("12671"), false)));
}

// =============================================================================
// MODEL CONFIGURATION STORAGE
// =============================================================================

export interface AgentModelConfig {
  agentId: string;
  currentModel: string;
  fallbackModel?: string;
  customSettings?: {
    temperature?: number;
    topP?: number;
    maxTokens?: number;
  };
}

// Default agent model configurations
export const DEFAULT_AGENT_MODELS: Record<string, string> = stryMutAct_9fa48("12672") ? {} : (stryCov_9fa48("12672"), {
  chief: 'qwen2.5:7b',
  cfo: 'qwen2.5:7b',
  coo: 'llama3.2:3b',
  ciso: 'qwen2.5:7b',
  cmo: 'qwen2.5:7b',
  cro: 'qwen2.5:7b',
  cdo: 'qwen2.5:7b',
  risk: 'qwen2.5:7b',
  clo: 'qwen2.5:7b',
  cpo: 'qwen2.5:7b',
  caio: 'qwen2.5:7b',
  cso: 'qwen2.5:7b',
  cio: 'qwen2.5:7b',
  cco: 'llama3.2:3b'
});

// Total model count
export const TOTAL_MODEL_COUNT = AVAILABLE_MODELS.length;