/**
 * Service — Types
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports RegulationFramework, Obligation, ComplianceGap, AlignmentAssessment, ViolationAlert, ViolationCheck, RegulatoryForecast, RegulatoryRadarEvent
 * @module services/panopticon/types
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaPanopticon™ - Type Definitions
 * 
 * Global regulation engine types
 */

// =============================================================================
// FRAMEWORK TYPES
// =============================================================================

export type FrameworkCategory = 
  | 'Privacy'
  | 'Healthcare'
  | 'Financial'
  | 'Banking'
  | 'Payments'
  | 'Cybersecurity'
  | 'Audit'
  | 'AI'
  | 'Energy'
  | 'Education'
  | 'Government'
  | 'ESG'
  | 'AML';

export interface RegulationFramework {
  code: string;
  name: string;
  jurisdiction: string;
  category: FrameworkCategory | string;
  description: string;
  effectiveDate?: Date;
  requirements: number;
  lastVerified?: string;
}

// =============================================================================
// OBLIGATION TYPES
// =============================================================================

export type RequirementType = 'MANDATORY' | 'RECOMMENDED' | 'OPTIONAL' | 'CONDITIONAL';
export type ObligationPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type AutomationStatus = 'MANUAL' | 'PARTIAL' | 'AUTOMATED';

export interface Obligation {
  id: string;
  code: string;
  title: string;
  description: string;
  requirementType: RequirementType;
  priority: ObligationPriority;
  controls: string[];
  evidenceRequired: string[];
  automationStatus?: AutomationStatus;
}

// =============================================================================
// COMPLIANCE TYPES
// =============================================================================

export interface ComplianceGap {
  obligationId: string;
  obligationTitle: string;
  entityType: string;
  entityName: string;
  alignmentScore: number;
  gaps: string[];
  remediationSteps: string[];
}

export interface AlignmentAssessment {
  score: number;
  gaps: string[];
  remediation: string[];
}

// =============================================================================
// VIOLATION TYPES
// =============================================================================

export type ViolationSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type ViolationStatus = 'OPEN' | 'INVESTIGATING' | 'REMEDIATION' | 'RESOLVED' | 'DISMISSED';
export type ViolationType = 
  | 'PROCESS_VIOLATION'
  | 'DATA_VIOLATION'
  | 'DOCUMENTATION_GAP'
  | 'TIMELINE_BREACH'
  | 'CONTROL_FAILURE';

export interface ViolationAlert {
  id: string;
  regulationCode: string;
  obligationCode?: string;
  title: string;
  description: string;
  severity: ViolationSeverity;
  affectedEntities: string[];
  detectedAt: Date;
}

export interface ViolationCheck {
  violated: boolean;
  type?: ViolationType;
  severity?: ViolationSeverity;
  title?: string;
  description?: string;
  affectedEntities?: string[];
  evidence?: Record<string, unknown>;
}

// =============================================================================
// FORECAST TYPES
// =============================================================================

export type ForecastType = 
  | 'NEW_REGULATION'
  | 'AMENDMENT'
  | 'ENFORCEMENT_ACTION'
  | 'INDUSTRY_TREND'
  | 'GEOPOLITICAL';

export interface RegulatoryForecast {
  id: string;
  title: string;
  description: string;
  forecastType: ForecastType | string;
  probability: number;
  impactScore: number;
  horizonDays: number;
  affectedFrameworks: string[];
  recommendedActions: string[];
}

// =============================================================================
// RADAR TYPES
// =============================================================================

export type RadarWindow = 'now' | '30' | '60' | '90';
export type RadarImpact = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface RegulatoryRadarEvent {
  id: string;
  title: string;
  framework: string;
  jurisdiction: string;
  window: RadarWindow;
  impact: RadarImpact;
  effectiveDate: string;
  description: string;
}

export interface RegulatoryRadarResponse {
  events: RegulatoryRadarEvent[];
  summary: string;
  actions: string[];
}

export interface RadarOptions {
  perspective?: 'board' | 'operator';
}

// =============================================================================
// DASHBOARD TYPES
// =============================================================================

export interface ViolationCounts {
  critical: number;
  high: number;
  medium: number;
  low: number;
  total: number;
}

export interface ComplianceDashboard {
  totalFrameworks: number;
  overallComplianceScore: number;
  openViolations: ViolationCounts;
  upcomingRegulations: number;
  jurisdictions: number;
}

// =============================================================================
// REGULATION MANAGEMENT TYPES
// =============================================================================

export interface ParsedRegulationContent {
  complianceAreas: string[];
  criticalRequirements: string[];
  challenges: string[];
  integrations: string[];
}

export interface IngestRegulationParams {
  organizationId: string;
  frameworkCode: string;
  version?: string;
  sourceUrl?: string;
}

// =============================================================================
// PROCESS DATA TYPES (for violation detection)
// =============================================================================

export interface ProcessData {
  processId?: string;
  processName?: string;
  department?: string;
  dataTypes?: string[];
  accessControls?: string[];
  retentionPeriod?: number;
  crossBorderTransfers?: boolean;
  thirdParties?: string[];
  lastAudit?: Date;
  [key: string]: unknown;
}
