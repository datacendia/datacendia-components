/**
 * SGAS - Synthetic Governance Agent System
 * Institutional Multi-Agent Decision Verification Architecture
 * 
 * Export all SGAS components for external use.
 */

// Core Types
export * from './types.js';

// Agent Services
export {
  DecisionAgentsService,
  decisionAgentsService,
  DECISION_AGENTS,
} from './DecisionAgentsService.js';

export {
  InstitutionalAgentsService,
  institutionalAgentsService,
  INSTITUTIONAL_AGENTS,
} from './InstitutionalAgentsService.js';

export {
  AdversarialAgentsService,
  adversarialAgentsService,
  ADVERSARIAL_AGENTS,
} from './AdversarialAgentsService.js';

export {
  ObserverAgentsService,
  observerAgentsService,
  OBSERVER_AGENTS,
} from './ObserverAgentsService.js';

export {
  MetaGovernanceAgentsService,
  metaGovernanceAgentsService,
  META_GOVERNANCE_AGENTS,
} from './MetaGovernanceAgentsService.js';

// Orchestrator
export {
  SGASOrchestrator,
  sgasOrchestrator,
  type SGASDeliberationResult,
  type DeliberationFinalStatus,
  type DeliberationSummary,
} from './SGASOrchestrator.js';

// Convenience re-exports for common types
export type {
  DecisionProposal,
  DecisionAgentOutput,
  InstitutionalAgentOutput,
  AdversarialAgentOutput,
  ObserverAgentOutput,
  MetaGovernanceAgentOutput,
  DeliberationGraph,
} from './types.js';
