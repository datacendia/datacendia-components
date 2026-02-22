// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaEternal™ - Ultra-Long Horizon Archive
 * 
 * "A memory designed to outlive us."
 * 
 * Capabilities:
 * - Strategic Curation: Documents, decisions, artifacts preserved
 * - Time Horizon: Decades to centuries
 * - Truth Validation: Veritas prevents drift or corruption
 * - Format Migration: Continuous update to accessible formats
 * - Continuity of Wisdom: Institutional memory across generations
 * 
 * Use Cases: Foundations, universities, governments, multi-generational enterprises
 */

import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { EnhancedLLMService } from './EnhancedLLMService.js';
import crypto from 'crypto';

// =============================================================================
// TYPES
// =============================================================================

export type ArtifactType = 
  | 'STRATEGIC_DECISION' | 'POLICY_DOCUMENT' | 'FINANCIAL_RECORD'
  | 'LEGAL_AGREEMENT' | 'INTELLECTUAL_PROPERTY' | 'HISTORICAL_RECORD'
  | 'CULTURAL_ARTIFACT' | 'LEADERSHIP_WISDOM' | 'CRISIS_RESPONSE' | 'LESSONS_LEARNED';

export type AccessLevel = 'PUBLIC' | 'ORGANIZATION' | 'LEADERSHIP' | 'BOARD' | 'FOUNDER' | 'SUCCESSION';

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'DRIFT_DETECTED' | 'CORRECTED' | 'QUARANTINED';

export interface Artifact {
  id: string;
  artifactType: ArtifactType;
  title: string;
  description: string;
  content: string;
  contentHash: string;
  metadata: Record<string, any>;
  tags: string[];
  importanceScore: number;
  retentionYears: number;
  accessLevel: AccessLevel;
  verificationStatus: VerificationStatus;
  createdAt: Date;
}

export interface ValidationResult {
  id: string;
  artifactId: string;
  integrityCheck: boolean;
  driftDetected: boolean;
  driftDetails?: any;
  validatedAt: Date;
}

export interface Successor {
  id: string;
  successorType: string;
  successorName: string;
  successorContact: string;
  verificationMethod: string;
  accessConditions: any;
  activated: boolean;
}

// =============================================================================
// SERVICE CLASS
// =============================================================================

export class CendiaEternalService {
  private llmService: EnhancedLLMService;

  constructor() {
    this.llmService = new EnhancedLLMService();
  }

  // ===========================================================================
  // ARTIFACT MANAGEMENT
  // ===========================================================================

  /**
   * Archive a new artifact
   */
  async archiveArtifact(
    organizationId: string,
    userId: string,
    artifactData: {
      artifactType: ArtifactType;
      title: string;
      description: string;
      content: string;
      metadata?: Record<string, any>;
      tags?: string[];
      retentionYears?: number;
      accessLevel?: AccessLevel;
    }
  ): Promise<Artifact> {
    // Calculate content hash for integrity
    const contentHash = this.calculateHash(artifactData.content);

    // Assess importance using LLM
    const importanceScore = await this.assessImportance(artifactData);

    const artifact = await prisma.eternal_artifacts.create({
      data: {
        organization_id: organizationId,
        artifact_type: artifactData.artifactType,
        title: artifactData.title,
        description: artifactData.description,
        content: artifactData.content,
        content_hash: contentHash,
        metadata: artifactData.metadata || {},
        tags: artifactData.tags || [],
        importance_score: importanceScore,
        retention_years: artifactData.retentionYears || 100,
        access_level: artifactData.accessLevel || 'ORGANIZATION',
        format_version: '1.0',
        verification_status: 'PENDING',
        created_by: userId,
      },
    });

    // Schedule initial verification
    await this.verifyArtifact(artifact.id, userId, 'SCHEDULED');

    logger.info(`Archived artifact: ${artifact.title} (${artifact.artifact_type})`);

    return this.mapArtifact(artifact);
  }

  /**
   * Calculate SHA-256 hash of content
   */
  private calculateHash(content: string): string {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Assess artifact importance using LLM
   */
  private async assessImportance(artifactData: any): Promise<number> {
    const prompt = `Assess the archival importance of this artifact:

Type: ${artifactData.artifactType}
Title: ${artifactData.title}
Description: ${artifactData.description}

Consider:
1. Historical significance
2. Decision-making relevance
3. Institutional memory value
4. Future reference potential
5. Legal/compliance importance

Rate 0-100 and respond with just the number.`;

    try {
      const response = await this.llmService.generate(prompt, {
        model: 'llama3.2:3b',
        systemPrompt: 'You are an archivist assessing document importance for long-term preservation.',
        temperature: 0.2,
        maxTokens: 10,
      });

      const score = parseInt(response.trim());
      return isNaN(score) ? 50 : Math.min(100, Math.max(0, score));
    } catch {
      return 50;
    }
  }

  /**
   * Get archived artifacts
   */
  async getArtifacts(
    organizationId: string,
    filters?: {
      artifactType?: ArtifactType;
      accessLevel?: AccessLevel;
      minImportance?: number;
      searchQuery?: string;
    }
  ): Promise<Artifact[]> {
    const artifacts = await prisma.eternal_artifacts.findMany({
      where: {
        organization_id: organizationId,
        ...(filters?.artifactType && { artifact_type: filters.artifactType }),
        ...(filters?.accessLevel && { access_level: filters.accessLevel }),
        ...(filters?.minImportance && { importance_score: { gte: filters.minImportance } }),
        ...(filters?.searchQuery && {
          OR: [
            { title: { contains: filters.searchQuery, mode: 'insensitive' } },
            { description: { contains: filters.searchQuery, mode: 'insensitive' } },
          ],
        }),
      },
      orderBy: [{ importance_score: 'desc' }, { created_at: 'desc' }],
    });

    return artifacts.map(a => this.mapArtifact(a));
  }

  /**
   * Get artifact by ID
   */
  async getArtifact(artifactId: string): Promise<Artifact | null> {
    const artifact = await prisma.eternal_artifacts.findUnique({
      where: { id: artifactId },
    });

    return artifact ? this.mapArtifact(artifact) : null;
  }

  /**
   * Map database artifact to API type
   */
  private mapArtifact(artifact: any): Artifact {
    return {
      id: artifact.id,
      artifactType: artifact.artifact_type,
      title: artifact.title,
      description: artifact.description,
      content: artifact.content,
      contentHash: artifact.content_hash,
      metadata: artifact.metadata as Record<string, any>,
      tags: artifact.tags as string[],
      importanceScore: artifact.importance_score,
      retentionYears: artifact.retention_years,
      accessLevel: artifact.access_level,
      verificationStatus: artifact.verification_status,
      createdAt: artifact.created_at,
    };
  }

  // ===========================================================================
  // TRUTH VALIDATION (VERITAS)
  // ===========================================================================

  /**
   * Verify artifact integrity
   */
  async verifyArtifact(
    artifactId: string,
    validatorId: string,
    validationType: 'SCHEDULED' | 'MANUAL' | 'TRIGGERED' | 'MIGRATION' = 'MANUAL'
  ): Promise<ValidationResult> {
    const artifact = await prisma.eternal_artifacts.findUnique({
      where: { id: artifactId },
    });

    if (!artifact) {
      throw new Error('Artifact not found');
    }

    // Calculate current hash
    const currentHash = this.calculateHash(artifact.content);
    const integrityCheck = currentHash === artifact.content_hash;
    const driftDetected = !integrityCheck;

    let driftDetails = null;
    if (driftDetected) {
      driftDetails = await this.analyzeDrift(artifact);
    }

    // Create validation record
    const validation = await prisma.eternal_validations.create({
      data: {
        artifact_id: artifactId,
        validation_type: validationType,
        validator: validatorId,
        previous_hash: artifact.content_hash,
        current_hash: currentHash,
        integrity_check: integrityCheck,
        drift_detected: driftDetected,
        drift_details: driftDetails,
      },
    });

    // Update artifact status
    await prisma.eternal_artifacts.update({
      where: { id: artifactId },
      data: {
        verification_status: driftDetected ? 'DRIFT_DETECTED' : 'VERIFIED',
        last_verified_at: new Date(),
      },
    });

    logger.info(`Verified artifact ${artifactId}: ${integrityCheck ? 'OK' : 'DRIFT DETECTED'}`);

    return {
      id: validation.id,
      artifactId: validation.artifact_id,
      integrityCheck: validation.integrity_check,
      driftDetected: validation.drift_detected,
      driftDetails: validation.drift_details,
      validatedAt: validation.validated_at,
    };
  }

  /**
   * Analyze content drift using LLM
   */
  private async analyzeDrift(artifact: any): Promise<any> {
    const prompt = `A document in our long-term archive has potential integrity issues.

Title: ${artifact.title}
Type: ${artifact.artifact_type}
Original Hash: ${artifact.content_hash}

The content hash has changed. Analyze potential causes:
1. Accidental modification
2. Format conversion issues
3. Encoding changes
4. Malicious tampering

Provide analysis as JSON: {"cause": "likely cause", "severity": "HIGH|MEDIUM|LOW", "recommendation": "what to do"}`;

    try {
      const response = await this.llmService.generate(prompt, {
        model: 'llama3.2:3b',
        systemPrompt: 'You are a digital archivist investigating document integrity.',
        temperature: 0.3,
        maxTokens: 200,
        format: 'json',
      });

      return JSON.parse(response);
    } catch {
      return { cause: 'Unknown', severity: 'MEDIUM', recommendation: 'Manual review required' };
    }
  }

  /**
   * Get validation history for artifact
   */
  async getValidationHistory(artifactId: string): Promise<ValidationResult[]> {
    const validations = await prisma.eternal_validations.findMany({
      where: { artifact_id: artifactId },
      orderBy: { validated_at: 'desc' },
    });

    return validations.map(v => ({
      id: v.id,
      artifactId: v.artifact_id,
      integrityCheck: v.integrity_check,
      driftDetected: v.drift_detected,
      driftDetails: v.drift_details,
      validatedAt: v.validated_at,
    }));
  }

  /**
   * Correct drifted artifact
   */
  async correctArtifact(
    artifactId: string,
    correctedContent: string,
    correctorId: string
  ): Promise<Artifact> {
    const newHash = this.calculateHash(correctedContent);

    const artifact = await prisma.eternal_artifacts.update({
      where: { id: artifactId },
      data: {
        content: correctedContent,
        content_hash: newHash,
        verification_status: 'CORRECTED',
        last_verified_at: new Date(),
      },
    });

    // Record correction validation
    await prisma.eternal_validations.create({
      data: {
        artifact_id: artifactId,
        validation_type: 'MANUAL',
        validator: correctorId,
        previous_hash: artifact.content_hash,
        current_hash: newHash,
        integrity_check: true,
        drift_detected: false,
        correction_applied: true,
      },
    });

    return this.mapArtifact(artifact);
  }

  // ===========================================================================
  // FORMAT MIGRATION
  // ===========================================================================

  /**
   * Start format migration
   */
  async startMigration(
    organizationId: string,
    sourceFormat: string,
    targetFormat: string
  ): Promise<any> {
    // Count affected artifacts
    const affectedCount = await prisma.eternal_artifacts.count({
      where: {
        organization_id: organizationId,
        original_format: sourceFormat,
      },
    });

    const migration = await prisma.eternal_migrations.create({
      data: {
        organization_id: organizationId,
        migration_type: 'FORMAT_UPGRADE',
        source_format: sourceFormat,
        target_format: targetFormat,
        artifacts_affected: affectedCount,
        status: 'PENDING',
      },
    });

    logger.info(`Started migration ${migration.id}: ${sourceFormat} -> ${targetFormat}`);

    return migration;
  }

  /**
   * Get migration status
   */
  async getMigrations(organizationId: string): Promise<any[]> {
    return prisma.eternal_migrations.findMany({
      where: { organization_id: organizationId },
      orderBy: { created_at: 'desc' },
    });
  }

  // ===========================================================================
  // SUCCESSION PLANNING
  // ===========================================================================

  /**
   * Define successor access
   */
  async defineSuccessor(
    organizationId: string,
    successorData: {
      successorType: 'INDIVIDUAL' | 'ORGANIZATION' | 'FOUNDATION' | 'GOVERNMENT' | 'TRUST';
      successorName: string;
      successorContact: string;
      verificationMethod: string;
      accessConditions: any;
      artifactsScope?: string[];
    }
  ): Promise<Successor> {
    const successor = await prisma.eternal_succession.create({
      data: {
        organization_id: organizationId,
        successor_type: successorData.successorType,
        successor_name: successorData.successorName,
        successor_contact: successorData.successorContact,
        verification_method: successorData.verificationMethod,
        access_conditions: successorData.accessConditions,
        artifacts_scope: successorData.artifactsScope || [],
        activated: false,
      },
    });

    return {
      id: successor.id,
      successorType: successor.successor_type,
      successorName: successor.successor_name,
      successorContact: successor.successor_contact,
      verificationMethod: successor.verification_method,
      accessConditions: successor.access_conditions,
      activated: successor.activated,
    };
  }

  /**
   * Get successors
   */
  async getSuccessors(organizationId: string): Promise<Successor[]> {
    const successors = await prisma.eternal_succession.findMany({
      where: { organization_id: organizationId },
      orderBy: { created_at: 'asc' },
    });

    return successors.map(s => ({
      id: s.id,
      successorType: s.successor_type,
      successorName: s.successor_name,
      successorContact: s.successor_contact,
      verificationMethod: s.verification_method,
      accessConditions: s.access_conditions,
      activated: s.activated,
    }));
  }

  /**
   * Activate successor access
   */
  async activateSuccessor(successorId: string): Promise<Successor> {
    const successor = await prisma.eternal_succession.update({
      where: { id: successorId },
      data: {
        activated: true,
        activated_at: new Date(),
      },
    });

    logger.info(`Activated successor: ${successor.successor_name}`);

    return {
      id: successor.id,
      successorType: successor.successor_type,
      successorName: successor.successor_name,
      successorContact: successor.successor_contact,
      verificationMethod: successor.verification_method,
      accessConditions: successor.access_conditions,
      activated: successor.activated,
    };
  }

  // ===========================================================================
  // DASHBOARD
  // ===========================================================================

  /**
   * Get archive dashboard
   */
  async getDashboard(organizationId: string): Promise<any> {
    const [
      totalArtifacts,
      verifiedArtifacts,
      driftedArtifacts,
      byType,
      avgRetention,
      successors,
    ] = await Promise.all([
      prisma.eternal_artifacts.count({
        where: { organization_id: organizationId },
      }),
      prisma.eternal_artifacts.count({
        where: { organization_id: organizationId, verification_status: 'VERIFIED' },
      }),
      prisma.eternal_artifacts.count({
        where: { organization_id: organizationId, verification_status: 'DRIFT_DETECTED' },
      }),
      prisma.eternal_artifacts.groupBy({
        by: ['artifact_type'],
        where: { organization_id: organizationId },
        _count: true,
      }),
      prisma.eternal_artifacts.aggregate({
        where: { organization_id: organizationId },
        _avg: { retention_years: true, importance_score: true },
      }),
      prisma.eternal_succession.count({
        where: { organization_id: organizationId },
      }),
    ]);

    return {
      totalArtifacts,
      verifiedArtifacts,
      driftedArtifacts,
      integrityRate: totalArtifacts > 0 
        ? Math.round((verifiedArtifacts / totalArtifacts) * 100) 
        : 100,
      artifactsByType: byType.reduce((acc, b) => {
        acc[b.artifact_type] = b._count;
        return acc;
      }, {} as Record<string, number>),
      avgRetentionYears: Math.round(avgRetention._avg.retention_years || 100),
      avgImportanceScore: Math.round(avgRetention._avg.importance_score || 50),
      definedSuccessors: successors,
    };
  }

  // ===========================================================================
  // 10/10 ENHANCEMENTS
  // ===========================================================================

  /**
   * 10/10: Knowledge Decay Detection
   * Identifies artifacts that are becoming stale, outdated, or losing relevance.
   * Critical for multi-generational archives.
   */
  async detectKnowledgeDecay(organizationId: string): Promise<{
    decayingArtifacts: Array<{
      id: string;
      title: string;
      artifactType: string;
      lastVerified: Date | null;
      daysSinceVerification: number;
      importanceScore: number;
      decayRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      recommendation: string;
    }>;
    overallDecayRate: number;
    urgentActions: string[];
  }> {
    const artifacts = await prisma.eternal_artifacts.findMany({
      where: { organization_id: organizationId },
      orderBy: { last_verified_at: 'asc' },
    });

    const now = Date.now();
    const decayingArtifacts = artifacts.map(a => {
      const lastVerified = a.last_verified_at ? new Date(a.last_verified_at) : null;
      const daysSinceVerification = lastVerified
        ? Math.floor((now - lastVerified.getTime()) / (1000 * 60 * 60 * 24))
        : 9999;

      // Decay risk based on time since verification and importance
      const importance = a.importance_score || 50;
      const verificationThreshold = importance >= 80 ? 90 : importance >= 50 ? 180 : 365;
      const decayRatio = daysSinceVerification / verificationThreshold;

      const decayRisk = decayRatio >= 3 ? 'CRITICAL' as const
        : decayRatio >= 2 ? 'HIGH' as const
        : decayRatio >= 1 ? 'MEDIUM' as const
        : 'LOW' as const;

      const recommendation = decayRisk === 'CRITICAL'
        ? `URGENT: Re-verify immediately — ${daysSinceVerification} days since last check (importance: ${importance})`
        : decayRisk === 'HIGH'
          ? `Schedule re-verification within 30 days — overdue by ${Math.round((decayRatio - 1) * verificationThreshold)} days`
          : decayRisk === 'MEDIUM'
            ? `Due for verification — approaching ${verificationThreshold}-day threshold`
            : 'On schedule — no action needed';

      return {
        id: a.id,
        title: a.title,
        artifactType: a.artifact_type,
        lastVerified,
        daysSinceVerification,
        importanceScore: importance,
        decayRisk,
        recommendation,
      };
    }).filter(a => a.decayRisk !== 'LOW');

    const overallDecayRate = artifacts.length > 0
      ? Math.round((decayingArtifacts.length / artifacts.length) * 100)
      : 0;

    const urgentActions: string[] = [];
    const criticalCount = decayingArtifacts.filter(a => a.decayRisk === 'CRITICAL').length;
    const highCount = decayingArtifacts.filter(a => a.decayRisk === 'HIGH').length;
    if (criticalCount > 0) urgentActions.push(`${criticalCount} artifacts require immediate re-verification`);
    if (highCount > 0) urgentActions.push(`${highCount} artifacts overdue for scheduled verification`);
    if (overallDecayRate > 50) urgentActions.push('ALERT: Over 50% of archive is decaying — systemic verification failure');

    return { decayingArtifacts, overallDecayRate, urgentActions };
  }

  /**
   * 10/10: Succession Risk Scoring
   * Evaluates the organization's succession readiness and identifies gaps.
   */
  async assessSuccessionRisk(organizationId: string): Promise<{
    riskScore: number;
    readinessLevel: 'PREPARED' | 'PARTIALLY_READY' | 'AT_RISK' | 'CRITICAL';
    gaps: Array<{
      area: string;
      severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      description: string;
      recommendation: string;
    }>;
    successorCoverage: number;
    artifactAccessibility: number;
  }> {
    const [successors, artifacts, driftedCount] = await Promise.all([
      prisma.eternal_succession.findMany({
        where: { organization_id: organizationId },
      }),
      prisma.eternal_artifacts.findMany({
        where: { organization_id: organizationId },
      }),
      prisma.eternal_artifacts.count({
        where: { organization_id: organizationId, verification_status: 'DRIFT_DETECTED' },
      }),
    ]);

    const gaps: Array<{ area: string; severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'; description: string; recommendation: string }> = [];

    // Check successor coverage
    const activatedSuccessors = successors.filter(s => s.activated);
    const pendingSuccessors = successors.filter(s => !s.activated);

    if (successors.length === 0) {
      gaps.push({
        area: 'Succession Planning',
        severity: 'CRITICAL',
        description: 'No successors defined — complete loss of institutional access if key personnel depart',
        recommendation: 'Define at least 2 successors immediately',
      });
    } else if (pendingSuccessors.length < 2) {
      gaps.push({
        area: 'Successor Redundancy',
        severity: 'HIGH',
        description: `Only ${pendingSuccessors.length} pending successor(s) — insufficient redundancy`,
        recommendation: 'Add at least one additional successor for redundancy',
      });
    }

    // Check artifact integrity
    if (artifacts.length > 0 && driftedCount / artifacts.length > 0.1) {
      gaps.push({
        area: 'Archive Integrity',
        severity: 'HIGH',
        description: `${driftedCount} artifacts have detected drift — data may be corrupted`,
        recommendation: 'Run full integrity verification and repair drifted artifacts',
      });
    }

    // Check high-importance artifact coverage
    const highImportance = artifacts.filter(a => (a.importance_score || 0) >= 80);
    const highVerified = highImportance.filter(a => a.verification_status === 'VERIFIED');
    if (highImportance.length > 0 && highVerified.length / highImportance.length < 0.9) {
      gaps.push({
        area: 'Critical Artifact Verification',
        severity: 'HIGH',
        description: `Only ${Math.round((highVerified.length / highImportance.length) * 100)}% of high-importance artifacts are verified`,
        recommendation: 'Prioritize verification of high-importance artifacts',
      });
    }

    // Check format migration
    const oldArtifacts = artifacts.filter(a => {
      const created = new Date(a.created_at);
      return (Date.now() - created.getTime()) > 5 * 365 * 24 * 60 * 60 * 1000; // 5+ years old
    });
    if (oldArtifacts.length > 10) {
      gaps.push({
        area: 'Format Migration',
        severity: 'MEDIUM',
        description: `${oldArtifacts.length} artifacts are 5+ years old — format accessibility may degrade`,
        recommendation: 'Schedule format migration review for aging artifacts',
      });
    }

    const successorCoverage = successors.length > 0 ? Math.min(100, successors.length * 33) : 0;
    const artifactAccessibility = artifacts.length > 0
      ? Math.round(((artifacts.length - driftedCount) / artifacts.length) * 100)
      : 100;

    const riskScore = Math.max(0, Math.min(100,
      100 - successorCoverage * 0.4 - artifactAccessibility * 0.4 - (gaps.length === 0 ? 20 : 0)
    ));

    const readinessLevel = riskScore <= 20 ? 'PREPARED' as const
      : riskScore <= 50 ? 'PARTIALLY_READY' as const
      : riskScore <= 75 ? 'AT_RISK' as const
      : 'CRITICAL' as const;

    return { riskScore, readinessLevel, gaps, successorCoverage, artifactAccessibility };
  }

  /**
   * 10/10: Archive Integrity Deep Scan
   * Comprehensive integrity analysis with trend data.
   */
  async deepScanIntegrity(organizationId: string): Promise<{
    totalScanned: number;
    verified: number;
    drifted: number;
    unverified: number;
    integrityScore: number;
    verificationByType: Record<string, { total: number; verified: number; rate: number }>;
    oldestUnverified: Array<{ id: string; title: string; daysSinceCreation: number }>;
    recommendation: string;
  }> {
    const artifacts = await prisma.eternal_artifacts.findMany({
      where: { organization_id: organizationId },
    });

    const now = Date.now();
    const verified = artifacts.filter(a => a.verification_status === 'VERIFIED').length;
    const drifted = artifacts.filter(a => a.verification_status === 'DRIFT_DETECTED').length;
    const unverified = artifacts.length - verified - drifted;

    const verificationByType: Record<string, { total: number; verified: number; rate: number }> = {};
    for (const a of artifacts) {
      if (!verificationByType[a.artifact_type]) {
        verificationByType[a.artifact_type] = { total: 0, verified: 0, rate: 0 };
      }
      verificationByType[a.artifact_type].total++;
      if (a.verification_status === 'VERIFIED') verificationByType[a.artifact_type].verified++;
    }
    for (const type of Object.keys(verificationByType)) {
      verificationByType[type].rate = Math.round(
        (verificationByType[type].verified / verificationByType[type].total) * 100
      );
    }

    const oldestUnverified = artifacts
      .filter(a => a.verification_status !== 'VERIFIED')
      .map(a => ({
        id: a.id,
        title: a.title,
        daysSinceCreation: Math.floor((now - new Date(a.created_at).getTime()) / (1000 * 60 * 60 * 24)),
      }))
      .sort((a, b) => b.daysSinceCreation - a.daysSinceCreation)
      .slice(0, 10);

    const integrityScore = artifacts.length > 0
      ? Math.round((verified / artifacts.length) * 100)
      : 100;

    const recommendation = integrityScore >= 95 ? 'Archive integrity is excellent — maintain current verification schedule'
      : integrityScore >= 80 ? 'Good integrity — focus on verifying remaining unverified artifacts'
      : integrityScore >= 60 ? 'Below target — accelerate verification cadence'
      : 'CRITICAL — launch emergency verification campaign immediately';

    return {
      totalScanned: artifacts.length,
      verified,
      drifted,
      unverified,
      integrityScore,
      verificationByType,
      oldestUnverified,
      recommendation,
    };
  }

  /**
   * 10/10: Knowledge Continuity Analysis
   * Uses LLM to assess whether the archive covers all critical institutional knowledge.
   */
  async analyzeKnowledgeContinuity(organizationId: string): Promise<{
    coverageScore: number;
    coveredDomains: string[];
    gaps: string[];
    recommendations: string[];
  }> {
    const artifacts = await prisma.eternal_artifacts.findMany({
      where: { organization_id: organizationId },
      take: 100,
      orderBy: { importance_score: 'desc' },
    });

    const artifactSummary = artifacts.map(a => ({
      type: a.artifact_type,
      title: a.title,
      importance: a.importance_score,
      tags: a.tags,
    }));

    try {
      const raw = await this.llmService.generate(
        `Analyze this organizational archive for knowledge continuity gaps.

ARCHIVED ARTIFACTS (${artifacts.length} total, sorted by importance):
${JSON.stringify(artifactSummary, null, 2)}

Assess whether the archive adequately covers all critical institutional knowledge domains:
- Strategic decisions and rationale
- Financial records and projections
- Legal and compliance documentation
- Operational procedures and playbooks
- Personnel knowledge and expertise
- Technology architecture and decisions
- Stakeholder relationships and agreements
- Risk assessments and mitigation strategies

Return JSON ONLY:
{
  "coverageScore": 0-100,
  "coveredDomains": ["domain1", "domain2"],
  "gaps": ["missing area 1", "missing area 2"],
  "recommendations": ["action to close gap 1"]
}`,
        {
          model: 'qwq:32b',
          systemPrompt: 'You are an institutional knowledge preservation analyst. Be thorough in identifying gaps. Return valid JSON only.',
        }
      );

      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch (error) {
      logger.warn('LLM knowledge continuity analysis failed, using heuristic fallback', { error });

      const types = new Set(artifacts.map(a => a.artifact_type as string));
      const expectedTypes = [
        'STRATEGIC_DECISION', 'POLICY_DOCUMENT', 'FINANCIAL_RECORD',
        'LEGAL_DOCUMENT', 'OPERATIONAL_PROCEDURE', 'PERSONNEL_RECORD',
        'TECHNOLOGY_DECISION', 'RISK_ASSESSMENT',
      ];
      const covered = expectedTypes.filter(t => types.has(t));
      const missing = expectedTypes.filter(t => !types.has(t));

      return {
        coverageScore: Math.round((covered.length / expectedTypes.length) * 100),
        coveredDomains: covered,
        gaps: missing.map(t => `No ${t.replace(/_/g, ' ').toLowerCase()} artifacts in archive`),
        recommendations: missing.map(t => `Archive critical ${t.replace(/_/g, ' ').toLowerCase()} documents`),
      };
    }
  }
  // ===========================================================================
  // HEALTH CHECK
  // ===========================================================================

  async getHealth(): Promise<{ healthy: boolean; service: string; timestamp: Date; details: Record<string, unknown> }> {
    return {
      healthy: true,
      service: 'CendiaEternal',
      timestamp: new Date(),
      details: { uptime: process.uptime(), memoryMB: Math.round(process.memoryUsage().heapUsed / 1048576) },
    };
  }
}

// Export singleton instance
export const cendiaEternalService = new CendiaEternalService();
