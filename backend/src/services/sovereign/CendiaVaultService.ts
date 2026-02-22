// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIAVAULTâ„¢ - Unified Evidence Storage Service
// The secure vault for all decision artifacts, audit trails, and evidence bundles
// Consolidates: Decision Packets, Audit Ledger, Evidence Bundles, Signed Reports
// =============================================================================

import { logger } from '../../utils/logger.js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export type ArtifactType = 
  | 'decision-packet'
  | 'audit-entry'
  | 'evidence-bundle'
  | 'signed-report'
  | 'council-deliberation'
  | 'dissent-record'
  | 'approval-chain';

export type RetentionPolicy = 
  | 'standard'      // 7 years (regulatory default)
  | 'extended'      // 10 years (financial services)
  | 'permanent'     // Never delete (legal hold)
  | 'regulatory'    // Based on jurisdiction
  | 'custom';       // Custom retention period

export interface VaultArtifact {
  id: string;
  type: ArtifactType;
  title: string;
  description?: string;
  
  // Content
  contentHash: string;           // SHA-256 of content
  contentSize: number;           // Bytes
  mimeType: string;
  encryptedContent?: string;     // Base64 encoded if stored inline
  storageLocation?: string;      // File path if stored externally
  
  // Provenance
  createdAt: Date;
  createdBy: string;
  sourceService: string;         // Which service created this
  sourceId?: string;             // Original ID in source system
  
  // Cryptographic proof
  signature?: string;            // CendiaNotary signature
  signedAt?: Date;
  signedBy?: string;
  merkleRoot?: string;           // For bundles with multiple items
  
  // Relationships
  parentId?: string;             // Parent artifact (e.g., deliberation -> packet)
  relatedIds?: string[];         // Related artifacts
  
  // Retention
  retentionPolicy: RetentionPolicy;
  retentionUntil?: Date;
  legalHold: boolean;
  
  // Access control
  classification: 'public' | 'internal' | 'confidential' | 'restricted';
  accessLog: AccessLogEntry[];
  
  // Metadata
  tags: string[];
  metadata: Record<string, unknown>;
}

export interface AccessLogEntry {
  timestamp: Date;
  actor: string;
  action: 'view' | 'download' | 'export' | 'verify' | 'share';
  ipAddress?: string;
  userAgent?: string;
}

export interface VaultStats {
  totalArtifacts: number;
  byType: Record<ArtifactType, number>;
  totalSize: number;
  oldestArtifact?: Date;
  newestArtifact?: Date;
  legalHoldCount: number;
  pendingDeletion: number;
}

export interface VaultSearchQuery {
  type?: ArtifactType | ArtifactType[];
  createdAfter?: Date;
  createdBefore?: Date;
  createdBy?: string;
  tags?: string[];
  classification?: string;
  legalHold?: boolean;
  searchText?: string;
  limit?: number;
  offset?: number;
}

export interface VaultExportOptions {
  format: 'json' | 'pdf' | 'zip';
  includeContent: boolean;
  includeSignatures: boolean;
  includeAccessLog: boolean;
  password?: string;  // For encrypted exports
}

// =============================================================================
// CENDIAVAULT SERVICE
// =============================================================================

export class CendiaVaultService {
  private artifacts: Map<string, VaultArtifact> = new Map();
  private initialized: boolean = false;

  constructor() {
    logger.info('[CendiaVault] Service instantiated');


    this.loadFromDB().catch(() => {});
  }

  // ===========================================================================
  // INITIALIZATION
  // ===========================================================================

  async initialize(): Promise<void> {
    if (this.initialized) return;

    logger.info('[CendiaVault] Initializing unified evidence storage...');
    
    // ROADMAP: connect to:
    // - PostgreSQL for metadata
    // - Object storage (S3/MinIO) for content
    // - Integrate with existing services
    
    this.initialized = true;
    logger.info('[CendiaVault] Initialized successfully');
  }

  // ===========================================================================
  // ARTIFACT STORAGE
  // ===========================================================================

  /**
   * Store a new artifact in the vault
   */
  async store(params: {
    type: ArtifactType;
    title: string;
    content: Buffer | string;
    mimeType: string;
    createdBy: string;
    sourceService: string;
    sourceId?: string;
    parentId?: string;
    relatedIds?: string[];
    retentionPolicy?: RetentionPolicy;
    classification?: VaultArtifact['classification'];
    tags?: string[];
    metadata?: Record<string, unknown>;
  }): Promise<VaultArtifact> {
    await this.initialize();

    const contentBuffer = typeof params.content === 'string' 
      ? Buffer.from(params.content) 
      : params.content;

    const contentHash = crypto
      .createHash('sha256')
      .update(contentBuffer)
      .digest('hex');

    const artifact: VaultArtifact = {
      id: uuidv4(),
      type: params.type,
      title: params.title,
      contentHash,
      contentSize: contentBuffer.length,
      mimeType: params.mimeType,
      encryptedContent: contentBuffer.toString('base64'),
      createdAt: new Date(),
      createdBy: params.createdBy,
      sourceService: params.sourceService,
      sourceId: params.sourceId,
      parentId: params.parentId,
      relatedIds: params.relatedIds,
      retentionPolicy: params.retentionPolicy || 'standard',
      retentionUntil: this.calculateRetentionDate(params.retentionPolicy || 'standard'),
      legalHold: false,
      classification: params.classification || 'internal',
      accessLog: [],
      tags: params.tags || [],
      metadata: params.metadata || {},
    };

    this.artifacts.set(artifact.id, artifact);

    logger.info(`[CendiaVault] Stored artifact: ${artifact.id} (${artifact.type})`);

    return artifact;
  }

  /**
   * Store a decision packet from CouncilDecisionPacketService
   */
  async storeDecisionPacket(params: {
    packetId: string;
    deliberationId: string;
    title: string;
    content: string | Buffer;
    signature?: string;
    merkleRoot?: string;
    createdBy: string;
    metadata?: Record<string, unknown>;
  }): Promise<VaultArtifact> {
    return this.store({
      type: 'decision-packet',
      title: params.title,
      content: params.content,
      mimeType: 'application/json',
      createdBy: params.createdBy,
      sourceService: 'CouncilDecisionPacketService',
      sourceId: params.packetId,
      relatedIds: [params.deliberationId],
      retentionPolicy: 'extended',
      classification: 'confidential',
      tags: ['decision', 'council', 'signed'],
      metadata: {
        ...params.metadata,
        signature: params.signature,
        merkleRoot: params.merkleRoot,
      },
    });
  }

  /**
   * Store an audit ledger entry from ImmutableAuditLedger
   */
  async storeAuditEntry(params: {
    entryId: string;
    action: string;
    actor: string;
    content: string | Buffer;
    previousHash?: string;
    metadata?: Record<string, unknown>;
  }): Promise<VaultArtifact> {
    return this.store({
      type: 'audit-entry',
      title: `Audit: ${params.action}`,
      content: params.content,
      mimeType: 'application/json',
      createdBy: params.actor,
      sourceService: 'ImmutableAuditLedger',
      sourceId: params.entryId,
      retentionPolicy: 'permanent',
      classification: 'internal',
      tags: ['audit', 'ledger', params.action],
      metadata: {
        ...params.metadata,
        previousHash: params.previousHash,
      },
    });
  }

  /**
   * Store an evidence bundle from EvidenceVaultService
   */
  async storeEvidenceBundle(params: {
    bundleId: string;
    title: string;
    content: Buffer;
    mimeType: string;
    createdBy: string;
    relatedDecisionId?: string;
    metadata?: Record<string, unknown>;
  }): Promise<VaultArtifact> {
    return this.store({
      type: 'evidence-bundle',
      title: params.title,
      content: params.content,
      mimeType: params.mimeType,
      createdBy: params.createdBy,
      sourceService: 'EvidenceVaultService',
      sourceId: params.bundleId,
      relatedIds: params.relatedDecisionId ? [params.relatedDecisionId] : undefined,
      retentionPolicy: 'extended',
      classification: 'confidential',
      tags: ['evidence', 'bundle', 'export'],
      metadata: params.metadata,
    });
  }

  /**
   * Store a signed test report from SignedTestReportService
   */
  async storeSignedReport(params: {
    reportId: string;
    title: string;
    content: Buffer;
    mimeType: string;
    signature?: string;
    createdBy: string;
    metadata?: Record<string, unknown>;
  }): Promise<VaultArtifact> {
    return this.store({
      type: 'signed-report',
      title: params.title,
      content: params.content,
      mimeType: params.mimeType,
      createdBy: params.createdBy,
      sourceService: 'SignedTestReportService',
      sourceId: params.reportId,
      retentionPolicy: 'extended',
      classification: 'internal',
      tags: ['report', 'test', 'signed'],
      metadata: {
        ...params.metadata,
        signature: params.signature,
      },
    });
  }

  // ===========================================================================
  // RETRIEVAL
  // ===========================================================================

  /**
   * Get an artifact by ID
   */
  async get(id: string, actor?: string): Promise<VaultArtifact | null> {
    await this.initialize();

    const artifact = this.artifacts.get(id);
    if (!artifact) return null;

    // Log access
    if (actor) {
      artifact.accessLog.push({
        timestamp: new Date(),
        actor,
        action: 'view',
      });
    }

    return artifact;
  }

  /**
   * Get artifact content
   */
  async getContent(id: string, actor?: string): Promise<Buffer | null> {
    const artifact = await this.get(id, actor);
    if (!artifact) return null;

    if (artifact.encryptedContent) {
      return Buffer.from(artifact.encryptedContent, 'base64');
    }

    // ROADMAP: fetch from object storage
    return null;
  }

  /**
   * Search artifacts
   */
  async search(query: VaultSearchQuery): Promise<VaultArtifact[]> {
    await this.initialize();

    let results = Array.from(this.artifacts.values());

    // Filter by type
    if (query.type) {
      const types = Array.isArray(query.type) ? query.type : [query.type];
      results = results.filter(a => types.includes(a.type));
    }

    // Filter by date range
    if (query.createdAfter) {
      results = results.filter(a => a.createdAt >= query.createdAfter!);
    }
    if (query.createdBefore) {
      results = results.filter(a => a.createdAt <= query.createdBefore!);
    }

    // Filter by creator
    if (query.createdBy) {
      results = results.filter(a => a.createdBy === query.createdBy);
    }

    // Filter by tags
    if (query.tags && query.tags.length > 0) {
      results = results.filter(a => 
        query.tags!.some(tag => a.tags.includes(tag))
      );
    }

    // Filter by classification
    if (query.classification) {
      results = results.filter(a => a.classification === query.classification);
    }

    // Filter by legal hold
    if (query.legalHold !== undefined) {
      results = results.filter(a => a.legalHold === query.legalHold);
    }

    // Text search
    if (query.searchText) {
      const searchLower = query.searchText.toLowerCase();
      results = results.filter(a => 
        a.title.toLowerCase().includes(searchLower) ||
        a.description?.toLowerCase().includes(searchLower) ||
        a.tags.some(t => t.toLowerCase().includes(searchLower))
      );
    }

    // Sort by date (newest first)
    results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Pagination
    const offset = query.offset || 0;
    const limit = query.limit || 50;
    return results.slice(offset, offset + limit);
  }

  /**
   * Get artifacts by type
   */
  async getByType(type: ArtifactType, limit?: number): Promise<VaultArtifact[]> {
    return this.search({ type, limit });
  }

  /**
   * Get related artifacts
   */
  async getRelated(id: string): Promise<VaultArtifact[]> {
    await this.initialize();

    const artifact = this.artifacts.get(id);
    if (!artifact) return [];

    const related: VaultArtifact[] = [];

    // Get children (artifacts with this as parent)
    for (const a of this.artifacts.values()) {
      if (a.parentId === id) {
        related.push(a);
      }
    }

    // Get explicitly related
    if (artifact.relatedIds) {
      for (const relatedId of artifact.relatedIds) {
        const relatedArtifact = this.artifacts.get(relatedId);
        if (relatedArtifact) {
          related.push(relatedArtifact);
        }
      }
    }

    return related;
  }

  // ===========================================================================
  // VERIFICATION
  // ===========================================================================

  /**
   * Verify artifact integrity
   */
  async verify(id: string): Promise<{
    valid: boolean;
    contentIntegrity: boolean;
    signatureValid?: boolean;
    issues: string[];
  }> {
    await this.initialize();

    const artifact = this.artifacts.get(id);
    if (!artifact) {
      return { valid: false, contentIntegrity: false, issues: ['Artifact not found'] };
    }

    const issues: string[] = [];

    // Verify content hash
    let contentIntegrity = false;
    if (artifact.encryptedContent) {
      const content = Buffer.from(artifact.encryptedContent, 'base64');
      const computedHash = crypto
        .createHash('sha256')
        .update(content)
        .digest('hex');
      
      contentIntegrity = computedHash === artifact.contentHash;
      if (!contentIntegrity) {
        issues.push('Content hash mismatch - possible tampering');
      }
    }

    // Verify signature (would call CendiaNotary)
    let signatureValid: boolean | undefined;
    if (artifact.signature) {
      // ROADMAP: verify with KeyManagementService
      signatureValid = true; // Placeholder
    }

    return {
      valid: contentIntegrity && (signatureValid !== false),
      contentIntegrity,
      signatureValid,
      issues,
    };
  }

  // ===========================================================================
  // LEGAL HOLD & RETENTION
  // ===========================================================================

  /**
   * Place artifact on legal hold
   */
  async setLegalHold(id: string, hold: boolean, reason?: string): Promise<boolean> {
    await this.initialize();

    const artifact = this.artifacts.get(id);
    if (!artifact) return false;

    artifact.legalHold = hold;
    if (hold) {
      artifact.retentionUntil = undefined; // Indefinite retention
      artifact.metadata['legalHoldReason'] = reason;
      artifact.metadata['legalHoldDate'] = new Date().toISOString();
    }

    logger.info(`[CendiaVault] Legal hold ${hold ? 'set' : 'released'} on ${id}`);
    return true;
  }

  /**
   * Calculate retention date based on policy
   */
  private calculateRetentionDate(policy: RetentionPolicy): Date | undefined {
    const now = new Date();
    
    switch (policy) {
      case 'standard':
        return new Date(now.setFullYear(now.getFullYear() + 7));
      case 'extended':
        return new Date(now.setFullYear(now.getFullYear() + 10));
      case 'permanent':
        return undefined; // Never delete
      case 'regulatory':
        return new Date(now.setFullYear(now.getFullYear() + 7)); // Default regulatory
      default:
        return new Date(now.setFullYear(now.getFullYear() + 7));
    }
  }

  // ===========================================================================
  // EXPORT
  // ===========================================================================

  /**
   * Export artifact(s) for external use
   */
  async export(ids: string[], options: VaultExportOptions, actor: string): Promise<{
    success: boolean;
    content?: Buffer;
    filename?: string;
    mimeType?: string;
    error?: string;
  }> {
    await this.initialize();

    const artifacts: VaultArtifact[] = [];
    for (const id of ids) {
      const artifact = await this.get(id, actor);
      if (artifact) {
        artifact.accessLog.push({
          timestamp: new Date(),
          actor,
          action: 'export',
        });
        artifacts.push(artifact);
      }
    }

    if (artifacts.length === 0) {
      return { success: false, error: 'No artifacts found' };
    }

    // Build export based on format
    if (options.format === 'json') {
      const exportData = artifacts.map(a => ({
        id: a.id,
        type: a.type,
        title: a.title,
        contentHash: a.contentHash,
        createdAt: a.createdAt,
        createdBy: a.createdBy,
        signature: options.includeSignatures ? a.signature : undefined,
        content: options.includeContent ? a.encryptedContent : undefined,
        accessLog: options.includeAccessLog ? a.accessLog : undefined,
        metadata: a.metadata,
      }));

      return {
        success: true,
        content: Buffer.from(JSON.stringify(exportData, null, 2)),
        filename: `vault-export-${Date.now()}.json`,
        mimeType: 'application/json',
      };
    }

    // For PDF and ZIP, would use appropriate generators
    return { success: false, error: 'Format not yet implemented' };
  }

  // ===========================================================================
  // STATISTICS
  // ===========================================================================

  /**
   * Get vault statistics
   */
  async getStats(): Promise<VaultStats> {
    await this.initialize();

    const artifacts = Array.from(this.artifacts.values());
    
    const byType: Record<ArtifactType, number> = {
      'decision-packet': 0,
      'audit-entry': 0,
      'evidence-bundle': 0,
      'signed-report': 0,
      'council-deliberation': 0,
      'dissent-record': 0,
      'approval-chain': 0,
    };

    let totalSize = 0;
    let oldestDate: Date | undefined;
    let newestDate: Date | undefined;
    let legalHoldCount = 0;
    let pendingDeletion = 0;

    const now = new Date();

    for (const artifact of artifacts) {
      byType[artifact.type]++;
      totalSize += artifact.contentSize;

      if (!oldestDate || artifact.createdAt < oldestDate) {
        oldestDate = artifact.createdAt;
      }
      if (!newestDate || artifact.createdAt > newestDate) {
        newestDate = artifact.createdAt;
      }

      if (artifact.legalHold) {
        legalHoldCount++;
      }

      if (artifact.retentionUntil && artifact.retentionUntil < now && !artifact.legalHold) {
        pendingDeletion++;
      }
    }

    return {
      totalArtifacts: artifacts.length,
      byType,
      totalSize,
      oldestArtifact: oldestDate,
      newestArtifact: newestDate,
      legalHoldCount,
      pendingDeletion,
    };
  }

  /**
   * Get service status
   */
  getStatus(): { initialized: boolean; artifactCount: number } {
    return {
      initialized: this.initialized,
      artifactCount: this.artifacts.size,
    };
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'CendiaVault', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.artifacts.has(d.id)) this.artifacts.set(d.id, d);


      }


      restored += recs.length;


      if (restored > 0) logger.info(`[CendiaVaultService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[CendiaVaultService] DB reload skipped: ${(err as Error).message}`);


    }


  }

  // ===========================================================================
  // DASHBOARD
  // ===========================================================================

  async getDashboard(): Promise<{
    serviceName: string;
    status: string;
    recordCount: number;
    lastActivity: Date | null;
    uptime: number;
    metrics: Record<string, number>;
  }> {
    const maps = Object.entries(this).filter(([_, v]) => v instanceof Map) as [string, Map<string, unknown>][];
    const totalRecords = maps.reduce((sum, [_, m]) => sum + m.size, 0);
    return {
      serviceName: 'CendiaVault',
      status: 'operational',
      recordCount: totalRecords,
      lastActivity: new Date(),
      uptime: process.uptime(),
      metrics: Object.fromEntries(maps.map(([k, m]) => [k, m.size])),
    };
  }

  // ===========================================================================
  // HEALTH CHECK
  // ===========================================================================

  async getHealth(): Promise<{ healthy: boolean; service: string; timestamp: Date; details: Record<string, unknown> }> {
    return {
      healthy: true,
      service: 'CendiaVault',
      timestamp: new Date(),
      details: { uptime: process.uptime(), memoryMB: Math.round(process.memoryUsage().heapUsed / 1048576) },
    };
  }
}

// Singleton instance
export const cendiaVaultService = new CendiaVaultService();
