// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA AI MODEL CONFIGURATION
// Intelligent model routing based on task complexity and type
// "Right Brain for the Right Job"
// =============================================================================

import { logger } from '../utils/logger.js';

// =============================================================================
// MODEL REGISTRY
// =============================================================================

export const AI_MODELS = {
  // THE CHIEF (General Intelligence King)
  // Llama 3.3 70B - Peak instruction following and synthesis
  // Use for: Complex analysis, strategic decisions, synthesis
  flagship: {
    id: 'qwen2.5:7b',
    contextWindow: 128000,
    temp: 0.7,
    description: 'Flagship model for complex synthesis and strategic analysis',
  },

  // THE PHILOSOPHER (Reasoning Engine)
  // QwQ 32B - Chain of Thought reasoning
  // Use for: Risk analysis, legal review, finding logical fallacies
  reasoning: {
    id: 'qwq:32b',
    contextWindow: 32768,
    temp: 0.6,
    description: 'Deep reasoning for risk, compliance, and logical analysis',
  },

  // THE ENGINEER (Coding Specialist)
  // Qwen 2.5 Coder 32B - Best at SQL, JSON, and Code
  // Use for: Data operations, workflow execution, schema work
  coder: {
    id: 'qwen2.5-coder:32b',
    contextWindow: 32768,
    temp: 0.2,
    description: 'Code generation, SQL, JSON, and technical operations',
  },

  // THE SPEEDSTER (UI & Quick Operations)
  // Llama 3.2 3B - Instant responses
  // Use for: Quick lookups, simple formatting, UI responses
  fast: {
    id: 'llama3.2:3b',
    contextWindow: 8192,
    temp: 0.5,
    description: 'Fast responses for simple tasks and UI interactions',
  },

  // THE EYES (Vision)
  // Qwen3-VL 30B - For seeing charts and PDFs
  // Use for: Image analysis, document OCR
  vision: {
    id: 'qwen3-vl:30b',
    contextWindow: 16384,
    temp: 0.5,
    description: 'Vision model for image and document analysis',
  },
} as const;

export type ModelType = keyof typeof AI_MODELS;

// =============================================================================
// TASK-BASED MODEL SELECTION
// =============================================================================

export type TaskType =
  // Complex Analysis Tasks → Flagship
  | 'strategic_analysis'
  | 'synthesis'
  | 'executive_summary'
  | 'market_analysis'
  | 'investor_relations'
  | 'communications'
  | 'patent_drafting'
  | 'deal_analysis'
  | 'culture_assessment'
  // Reasoning Tasks → Reasoning Model
  | 'risk_analysis'
  | 'legal_analysis'
  | 'compliance_check'
  | 'threat_detection'
  | 'audit'
  | 'litigation_analysis'
  | 'failure_prediction'
  // Technical Tasks → Coder Model
  | 'data_query'
  | 'json_generation'
  | 'workflow_automation'
  | 'code_generation'
  | 'schema_analysis'
  | 'metrics_calculation'
  // Quick Tasks → Fast Model
  | 'simple_lookup'
  | 'formatting'
  | 'categorization'
  | 'status_check'
  | 'basic_extraction'
  // Vision Tasks → Vision Model
  | 'image_analysis'
  | 'document_ocr'
  | 'chart_reading';

const TASK_MODEL_MAP: Record<TaskType, ModelType> = {
  // Complex Analysis → Flagship (qwen2.5:7b)
  strategic_analysis: 'flagship',
  synthesis: 'flagship',
  executive_summary: 'flagship',
  market_analysis: 'flagship',
  investor_relations: 'flagship',
  communications: 'flagship',
  patent_drafting: 'flagship',
  deal_analysis: 'flagship',
  culture_assessment: 'flagship',

  // Reasoning → Reasoning Model (qwq:32b)
  risk_analysis: 'reasoning',
  legal_analysis: 'reasoning',
  compliance_check: 'reasoning',
  threat_detection: 'reasoning',
  audit: 'reasoning',
  litigation_analysis: 'reasoning',
  failure_prediction: 'reasoning',

  // Technical → Coder Model (qwen2.5-coder:32b)
  data_query: 'coder',
  json_generation: 'coder',
  workflow_automation: 'coder',
  code_generation: 'coder',
  schema_analysis: 'coder',
  metrics_calculation: 'coder',

  // Quick → Fast Model (llama3.2:3b)
  simple_lookup: 'fast',
  formatting: 'fast',
  categorization: 'fast',
  status_check: 'fast',
  basic_extraction: 'fast',

  // Vision → Vision Model (qwen3-vl:30b)
  image_analysis: 'vision',
  document_ocr: 'vision',
  chart_reading: 'vision',
};

// =============================================================================
// SERVICE-BASED MODEL DEFAULTS
// =============================================================================

export type ServiceDomain =
  | 'procurement'
  | 'talent'
  | 'facilities'
  | 'sales'
  | 'customer_success'
  | 'it_ops'
  | 'legal'
  | 'investor_relations'
  | 'ma_integration'
  | 'manufacturing'
  | 'travel_security'
  | 'learning'
  | 'communications'
  | 'innovation'
  | 'executive'
  | 'brand'
  | 'revenue'
  | 'support'
  | 'monitoring'
  | 'council'
  | 'decision';

const SERVICE_MODEL_MAP: Record<ServiceDomain, ModelType> = {
  // Enterprise Services
  procurement: 'flagship',        // Negotiations need nuance
  talent: 'flagship',             // People decisions are complex
  facilities: 'fast',             // Mostly operational
  sales: 'flagship',              // Deal analysis is strategic
  customer_success: 'flagship',   // Churn prediction needs depth
  it_ops: 'reasoning',            // Threat detection needs logic
  legal: 'reasoning',             // Legal analysis needs precision
  investor_relations: 'flagship', // Market sentiment is complex
  ma_integration: 'flagship',     // Culture is nuanced
  manufacturing: 'reasoning',     // Failure prediction needs logic
  travel_security: 'reasoning',   // Risk assessment needs logic
  learning: 'flagship',           // Content generation needs quality
  communications: 'flagship',     // Messaging needs nuance
  innovation: 'flagship',         // Patent drafting needs depth
  executive: 'flagship',          // CEO decisions are strategic

  // Core Services
  brand: 'flagship',              // Content creation needs quality
  revenue: 'coder',               // Financial calculations
  support: 'fast',                // Quick responses
  monitoring: 'fast',             // Status checks

  // Decision Intelligence
  council: 'flagship',            // Deliberation needs depth
  decision: 'flagship',           // Decision analysis is strategic
};

// =============================================================================
// MODEL SELECTOR CLASS
// =============================================================================

class AIModelSelector {
  /**
   * Get the optimal model for a specific task type
   */
  getModelForTask(task: TaskType): string {
    const modelType = TASK_MODEL_MAP[task];
    const model = AI_MODELS[modelType];
    logger.debug(`AIModelSelector: Task "${task}" → ${model.id}`);
    return model.id;
  }

  /**
   * Get the default model for a service domain
   */
  getModelForService(service: ServiceDomain): string {
    const modelType = SERVICE_MODEL_MAP[service];
    const model = AI_MODELS[modelType];
    logger.debug(`AIModelSelector: Service "${service}" → ${model.id}`);
    return model.id;
  }

  /**
   * Get model by type directly
   */
  getModel(type: ModelType): string {
    return AI_MODELS[type].id;
  }

  /**
   * Get model configuration
   */
  getModelConfig(type: ModelType): typeof AI_MODELS[ModelType] {
    return AI_MODELS[type];
  }

  /**
   * Get recommended temperature for a task
   */
  getTemperatureForTask(task: TaskType): number {
    const modelType = TASK_MODEL_MAP[task];
    return AI_MODELS[modelType].temp;
  }

  /**
   * Get all available models
   */
  getAllModels(): typeof AI_MODELS {
    return AI_MODELS;
  }

  /**
   * Check if a model is available (by checking Ollama)
   */
  async isModelAvailable(modelId: string): Promise<boolean> {
    try {
      const response = await fetch('http://127.0.0.1:11434/api/tags');
      if (!response.ok) return false;
      const data = await response.json() as { models: { name: string }[] };
      return data.models.some(m => m.name === modelId || m.name.startsWith(modelId.split(':')[0]));
    } catch {
      return false;
    }
  }

  /**
   * Get fallback model if primary is unavailable
   */
  getFallbackModel(): string {
    return AI_MODELS.fast.id; // Always fallback to fast model
  }
}

// Export singleton
export const aiModelSelector = new AIModelSelector();
export default aiModelSelector;
