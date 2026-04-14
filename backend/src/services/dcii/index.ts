/**
 * Service — Index
 *
 * Business logic service implementing platform capabilities.
 * @module services/dcii/index
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DCII - DECISION CRISIS IMMUNIZATION INFRASTRUCTURE™
// Barrel Export for all DCII services
// =============================================================================

export { iissService } from './IISSService.js';
export { syntheticMediaAuthService } from './SyntheticMediaAuthService.js';
export { crossJurisdictionConflictService } from './CrossJurisdictionConflictService.js';
export { timestampAuthorityService } from './TimestampAuthorityService.js';
export { decisionSimilarityService } from './DecisionSimilarityService.js';
export { cognitiveBiasMitigationService } from './CognitiveBiasMitigationService.js';

// Re-export types
export type {
  IISSScore,
  IISSDimension,
  IISSControl,
  IISSFinding,
  IISSBand,
  IISSAssessment,
  IISSHistoryEntry,
  IISSBenchmark,
  IISSRecommendation,
  InsuranceImpact,
  RegulatoryReadiness,
  CertificationLevel,
} from './IISSService.js';

export type {
  MediaAsset,
  AuthenticityAssessment,
  AuthenticityVerdict,
  ProvenanceRecord,
  CustodyEntry,
  VerificationReport,
  MediaType,
} from './SyntheticMediaAuthService.js';

export type {
  RegulatoryConflict,
  CrossJurisdictionAssessment,
  JurisdictionEvidencePacket,
  GoodFaithDocument,
  Jurisdiction,
  RegulatoryFramework,
  ConflictSeverity,
  JurisdictionProfile,
} from './CrossJurisdictionConflictService.js';

export type {
  TimestampToken,
  TimestampVerification,
  BlockchainAnchor,
  BatchTimestampRequest,
  TSAProviderConfig,
} from './TimestampAuthorityService.js';

import type {
  DecisionRecord,
  PrecedentMatch,
  PrecedentSearchResult,
} from './DecisionSimilarityService.js';

export type {
  DecisionRecord,
  PrecedentMatch,
  PrecedentSearchResult,
} from './DecisionSimilarityService.js';

// Re-export with stub types for compatibility
export type SimilarityMatch = PrecedentMatch;
export type SimilaritySearchResult = PrecedentSearchResult;
export type SimilaritySearchRequest = any;
export type DecisionPattern = any;
export type SimilarityRiskAssessment = any;
export type MatchStrength = any;
export type OutcomeStatus = any;

export type {
  BiasType,
  BiasRisk,
  MitigationStatus,
  BiasDetection,
  BiasAnalysis,
  BiasReport,
} from './CognitiveBiasMitigationService.js';
