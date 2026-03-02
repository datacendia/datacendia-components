/**
 * Service — Index
 *
 * Business logic service implementing platform capabilities.
 * @module services/index
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

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

// CendiaResponsibility™ - Human Accountability Layer
export { CendiaResponsibilityService } from './CendiaResponsibilityService.js';
export type {
  AccountabilityRecord,
  AccountabilityAction,
  FailureCategory,
  HumanAuthority,
  TPMSignature,
  AccountabilityChain,
  DelegationRecord,
  LiabilityReport,
} from './CendiaResponsibilityService.js';

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
