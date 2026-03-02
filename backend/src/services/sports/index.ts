/**
 * Service — Index
 *
 * Business logic service implementing platform capabilities.
 * @module services/sports/index
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA PLATFORM - SPORTS VERTICAL
 * Service Exports
 * 
 * Copyright (c) 2024-2026 Datacendia, Inc. All Rights Reserved.
 */

export { sportsDecisionService } from './SportsDecisionService.js';
export type { 
  Player, 
  Club, 
  Agent, 
  TransferDecision, 
  ContractDecision, 
  FFPImpactAssessment 
} from './SportsDecisionService.js';

export { sportsKnowledgeBase } from './SportsKnowledgeBase.js';
export type {
  RegulationSource,
  RegulationType,
  RegulationDocument,
  RegulationSection,
  KnowledgeQuery,
  KnowledgeResult,
  ProvenanceRecord,
} from './SportsKnowledgeBase.js';

export { sportsAgentService, SPORTS_AGENT_PRESETS } from './SportsAgents.js';
export type {
  SportsAgentRole,
  SportsWorkflow,
  SportsAgentPreset,
  AgentResponse,
  WorkflowContext,
} from './SportsAgents.js';
