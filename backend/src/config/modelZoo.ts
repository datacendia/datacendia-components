/**
 * Configuration — Model Zoo
 *
 * Application configuration and service initialization.
 *
 * @exports getModelConfig, getAgentMapping, getOptimalModelForAgent, getModelsForTask, getInferenceOptions, shouldUseChainOfThought, shouldUseEnsemble, buildSovereignSystemPrompt
 * @module config/modelZoo
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

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


// Data constants extracted to models/ subdirectory for maintainability
export { MODEL_REGISTRY } from './models/registry.js';
export { AGENT_MODEL_MAPPINGS } from './models/agent-mappings.js';
export { VERTICAL_AGENT_MAPPINGS } from './models/vertical-mappings.js';


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