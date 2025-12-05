// =============================================================================
// DATACENDIA PLATFORM - SERVICES INDEX
// All backend services exported from a single location
// =============================================================================

// Core Services
export { ollama } from './ollama.js';
export { emailService } from './email.js';

// Decision & Deliberation
export { decisionService } from './DecisionService.js';
export { deliberationService } from './DeliberationService.js';

// Council Services
export * from './council/CouncilService.js';
export * from './council/CouncilWebSocket.js';

// Premium Intelligence Services
export { cendiaAuditService, CendiaAuditService } from './CendiaAuditService.js';
export { cendiaSentryService, CendiaSentryService } from './CendiaSentryService.js';
export { cendiaNarrativesService, CendiaNarrativesService } from './CendiaNarrativesService.js';
export { pantheonMemoryService, PantheonMemoryService } from './PantheonMemoryService.js';

// Re-export types
export type {
  AuditEvent,
  AuditEventType,
  AuditQuery,
  AuditReport,
  ComplianceStatus,
} from './CendiaAuditService.js';

export type {
  GuardrailConfig,
  GuardrailResult,
  SentryCheck,
  PIIMatch,
  BiasIndicator,
} from './CendiaSentryService.js';

export type {
  Narrative,
  NarrativeRequest,
  NarrativeType,
  NarrativeTemplate,
} from './CendiaNarrativesService.js';

export type {
  Memory,
  MemoryType,
  MemoryQuery,
  AgentContext,
  LearningEvent,
} from './PantheonMemoryService.js';
