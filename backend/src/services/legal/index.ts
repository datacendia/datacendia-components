// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA LEGAL VERTICAL SERVICES
 * Enterprise Platinum Standard
 * 
 * Includes:
 * - LegalVerticalService: Case law library, matter management, privilege gates, citation enforcement
 * - LegalCouncilModes: 50+ specialized deliberation modes for legal practice areas
 * - LegalAgents: 14 specialized AI agents (8 default + 6 optional)
 * - CaseImportService: Parsers for CAP, CourtListener, CSV case law imports
 */

// Core Legal Vertical Service
export * from './LegalVerticalService';
export { legalVerticalService, default } from './LegalVerticalService';

// Legal Council Modes (50+)
export * from './LegalCouncilModes';
export { 
  ALL_LEGAL_MODES,
  LEGAL_MODE_MAP,
  MAJOR_LEGAL_MODES,
  CORE_PRACTICE_MODES,
  ROLE_BASED_MODES,
  TRADITIONAL_PRACTICE_MODES,
  SPECIALIZED_LEGAL_MODES,
  getLegalMode,
  getLegalModesByCategory,
  getCitationEnforcedModes,
  getPrivilegeGatedModes,
  getLegalModesByLeadAgent,
} from './LegalCouncilModes';

// Legal Agents (17: 8 default + 6 optional + 3 silent guards)
export * from './LegalAgents';
export {
  ALL_LEGAL_AGENTS,
  LEGAL_AGENT_MAP,
  DEFAULT_LEGAL_AGENTS,
  OPTIONAL_LEGAL_AGENTS,
  SILENT_GUARD_AGENTS,
  getLegalAgent,
  getDefaultLegalAgents,
  getOptionalLegalAgents,
  getSilentGuardAgents,
  getSilentAgents,
  getLegalAgentsByExpertise,
  getAdversarialAgents,
  getCitationRequiredAgents,
  buildLegalAgentTeam,
} from './LegalAgents';

// Case Import Service (CAP, CourtListener, CSV)
export * from './CaseImportService';
export { caseImportService } from './CaseImportService';

// Legal Research Service (API integrations for Council tools)
export * from './LegalResearchService';
export { legalResearchService } from './LegalResearchService';

// CendiaVeto Service (Approval gates for exports)
export * from './CendiaVetoService';
export { cendiaVetoService } from './CendiaVetoService';

// CendiaGovern Service (Policy enforcement - ABA, SRA, GDPR, EU AI Act)
export * from './CendiaGovernService';
export { cendiaGovernService } from './CendiaGovernService';

// CendiaBridge Service (Data integration - iManage, Westlaw, Clio, etc.)
export * from './CendiaBridgeService';
export { cendiaBridgeService } from './CendiaBridgeService';
