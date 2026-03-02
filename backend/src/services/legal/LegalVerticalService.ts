/**
 * Service — Legal Vertical Service
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports LegalVerticalService, legalVerticalService, CaseLaw, KeyPassage, Matter, MatterDocument, PrivilegeReview, Citation
 * @module services/legal/LegalVerticalService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA LEGAL VERTICAL SERVICE
 * 
 * Enterprise Platinum Standard - Complete legal vertical implementation
 * Includes case law ingestion, matter management, privilege gates, and citation enforcement
 */

import { EventEmitter } from 'events';
import * as crypto from 'crypto';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';
import { logger } from '../../utils/logger.js';

// =============================================================================
// TYPES
// =============================================================================

export interface CaseLaw {
  id: string;
  citation: string;
  title: string;
  court: string;
  jurisdiction: string;
  dateDecided: Date;
  summary: string;
  fullText?: string;
  headnotes: string[];
  keyPassages: KeyPassage[];
  topics: string[];
  citedBy: string[];
  cites: string[];
  outcome: string;
  judges: string[];
  parties: { plaintiff: string; defendant: string };
  procedural_posture: string;
  holdings: string[];
  importedAt: Date;
  importedBy: string;
  sourceSystem: string;
  hash: string;
}

export interface KeyPassage {
  id: string;
  text: string;
  pageNumber?: number;
  relevanceScore: number;
  topics: string[];
}

export interface Matter {
  id: string;
  clientId: string;
  matterNumber: string;
  title: string;
  type: MatterType;
  status: MatterStatus;
  practiceArea: string;
  responsibleAttorney: string;
  team: string[];
  openedDate: Date;
  closedDate?: Date;
  description: string;
  conflictsCleared: boolean;
  conflictsClearedBy?: string;
  conflictsClearedAt?: Date;
  privilegeLevel: PrivilegeLevel;
  retentionPolicy: string;
  documents: MatterDocument[];
  deliberations: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type MatterType = 
  | 'litigation'
  | 'transactional'
  | 'regulatory'
  | 'advisory'
  | 'investigation'
  | 'ip'
  | 'employment'
  | 'real-estate';

export type MatterStatus = 
  | 'active'
  | 'pending'
  | 'on-hold'
  | 'closed'
  | 'archived';

export type PrivilegeLevel = 
  | 'attorney-client'
  | 'work-product'
  | 'common-interest'
  | 'confidential'
  | 'public';

export interface MatterDocument {
  id: string;
  matterId: string;
  filename: string;
  type: string;
  privilegeLevel: PrivilegeLevel;
  privilegeReviewedBy?: string;
  privilegeReviewedAt?: Date;
  hash: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface PrivilegeReview {
  id: string;
  documentId: string;
  matterId: string;
  reviewerId: string;
  reviewedAt: Date;
  determination: PrivilegeLevel;
  rationale: string;
  redactionsRequired: boolean;
  redactionNotes?: string;
  approvedForExport: boolean;
}

export interface Citation {
  id: string;
  caseId: string;
  citation: string;
  title: string;
  relevance: string;
  supportingText: string;
  verifiedAt: Date;
  verifiedBy: string;
  isValid: boolean;
}

export interface LegalResearchQuery {
  query: string;
  jurisdictions?: string[];
  courts?: string[];
  dateRange?: { start: Date; end: Date };
  topics?: string[];
  maxResults?: number;
  includeHeadnotes?: boolean;
  includeKeyPassages?: boolean;
}

export interface LegalResearchResult {
  cases: CaseLaw[];
  totalResults: number;
  queryTime: number;
  suggestedCitations: Citation[];
}

export interface AgentPreset {
  id: string;
  name: string;
  description: string;
  defaultAgents: string[];
  optionalAgents: string[];
  requiredApprovals: string[];
  maxDeliberationRounds: number;
}

// =============================================================================
// LEGAL VERTICAL SERVICE
// =============================================================================

export class LegalVerticalService extends EventEmitter {
  private caseLibrary: Map<string, CaseLaw> = new Map();
  private matters: Map<string, Matter> = new Map();
  private privilegeReviews: Map<string, PrivilegeReview> = new Map();
  // Citation cache for validation
  private citationCache: Map<string, Citation> = new Map();

  // Legal-specific agent presets
  private readonly agentPresets: AgentPreset[] = [
    {
      id: 'contract-review',
      name: 'Contract Review (Standard)',
      description: 'Standard contract review and redlining',
      defaultAgents: ['matter-lead', 'research-counsel', 'contract-counsel', 'risk-counsel', 'privilege-officer', 'evidence-officer'],
      optionalAgents: ['commercial-advisor'],
      requiredApprovals: ['privilege-officer'],
      maxDeliberationRounds: 5,
    },
    {
      id: 'high-stakes-negotiation',
      name: 'High-Stakes Negotiation',
      description: 'Major deal negotiations with adversarial testing',
      defaultAgents: ['matter-lead', 'research-counsel', 'contract-counsel', 'risk-counsel', 'opposing-counsel', 'commercial-advisor', 'privilege-officer', 'evidence-officer'],
      optionalAgents: ['tax-counsel', 'antitrust-counsel'],
      requiredApprovals: ['privilege-officer', 'matter-lead'],
      maxDeliberationRounds: 8,
    },
    {
      id: 'litigation-prep',
      name: 'Litigation Prep',
      description: 'Case strategy, depositions, trial prep',
      defaultAgents: ['matter-lead', 'research-counsel', 'litigation-strategist', 'opposing-counsel', 'risk-counsel', 'privilege-officer', 'evidence-officer'],
      optionalAgents: ['employment-counsel', 'ip-counsel'],
      requiredApprovals: ['privilege-officer'],
      maxDeliberationRounds: 10,
    },
    {
      id: 'regulatory-response',
      name: 'Regulatory Response / Audit',
      description: 'Regulatory inquiries, audits, compliance responses',
      defaultAgents: ['matter-lead', 'regulatory-counsel', 'research-counsel', 'privilege-officer', 'evidence-officer', 'risk-counsel'],
      optionalAgents: ['employment-counsel'],
      requiredApprovals: ['privilege-officer', 'regulatory-counsel'],
      maxDeliberationRounds: 6,
    },
    {
      id: 'ma-due-diligence',
      name: 'M&A Due Diligence',
      description: 'Comprehensive due diligence review',
      defaultAgents: ['matter-lead', 'contract-counsel', 'risk-counsel', 'research-counsel', 'privilege-officer', 'evidence-officer'],
      optionalAgents: ['tax-counsel', 'antitrust-counsel', 'ip-counsel', 'employment-counsel', 'regulatory-counsel'],
      requiredApprovals: ['privilege-officer', 'matter-lead'],
      maxDeliberationRounds: 12,
    },
    {
      id: 'ediscovery',
      name: 'eDiscovery Review',
      description: 'Document review and production',
      defaultAgents: ['matter-lead', 'privilege-officer', 'evidence-officer', 'litigation-strategist'],
      optionalAgents: ['research-counsel'],
      requiredApprovals: ['privilege-officer'],
      maxDeliberationRounds: 5,
    },
  ];

  constructor() {
    super();


    this.loadFromDB().catch(() => {});
  }

  // ===========================================================================
  // CASE LAW LIBRARY
  // ===========================================================================

  /**
   * Ingest case law into the library
   */
  async ingestCaseLaw(caseData: Omit<CaseLaw, 'id' | 'importedAt' | 'hash'>): Promise<CaseLaw> {
    const id = `case-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const hash = crypto.createHash('sha256')
      .update(JSON.stringify(caseData))
      .digest('hex');

    const caseLaw: CaseLaw = {
      ...caseData,
      id,
      importedAt: new Date(),
      hash,
    };

    this.caseLibrary.set(id, caseLaw);
    persistServiceRecord({ serviceName: 'LegalVertical', recordType: 'case_law', referenceId: id, data: caseLaw });
    this.emit('case-ingested', caseLaw);

    return caseLaw;
  }

  /**
   * Bulk ingest case law (e.g., from Westlaw/LexisNexis export)
   */
  async bulkIngestCaseLaw(
    cases: Omit<CaseLaw, 'id' | 'importedAt' | 'hash'>[],
    sourceSystem: string,
    importedBy: string
  ): Promise<{ imported: number; failed: number; errors: string[] }> {
    const results = { imported: 0, failed: 0, errors: [] as string[] };

    for (const caseData of cases) {
      try {
        await this.ingestCaseLaw({
          ...caseData,
          sourceSystem,
          importedBy,
        });
        results.imported++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Failed to import ${caseData.citation}: ${error}`);
      }
    }

    this.emit('bulk-import-complete', results);
    return results;
  }

  /**
   * Search case law library
   */
  async searchCaseLaw(query: LegalResearchQuery): Promise<LegalResearchResult> {
    const startTime = Date.now();
    const results: CaseLaw[] = [];

    for (const caseLaw of Array.from(this.caseLibrary.values())) {
      let matches = false;

      // Text search
      if (query.query) {
        const searchText = `${caseLaw.title} ${caseLaw.summary} ${caseLaw.holdings.join(' ')}`.toLowerCase();
        matches = searchText.includes(query.query.toLowerCase());
      }

      // Jurisdiction filter
      if (query.jurisdictions?.length && !query.jurisdictions.includes(caseLaw.jurisdiction)) {
        matches = false;
      }

      // Court filter
      if (query.courts?.length && !query.courts.includes(caseLaw.court)) {
        matches = false;
      }

      // Date range filter
      if (query.dateRange) {
        const caseDate = new Date(caseLaw.dateDecided);
        if (caseDate < query.dateRange.start || caseDate > query.dateRange.end) {
          matches = false;
        }
      }

      // Topic filter
      if (query.topics?.length) {
        const hasMatchingTopic = query.topics.some(topic => 
          caseLaw.topics.includes(topic)
        );
        if (!hasMatchingTopic) matches = false;
      }

      if (matches) {
        results.push(caseLaw);
      }
    }

    // Limit results
    const limitedResults = results.slice(0, query.maxResults || 50);

    return {
      cases: limitedResults,
      totalResults: results.length,
      queryTime: Date.now() - startTime,
      suggestedCitations: limitedResults.map(c => ({
        id: `cit-${c.id}`,
        caseId: c.id,
        citation: c.citation,
        title: c.title,
        relevance: 'Matches search criteria',
        supportingText: c.summary.substring(0, 200),
        verifiedAt: new Date(),
        verifiedBy: 'system',
        isValid: true,
      })),
    };
  }

  /**
   * Get case by ID
   */
  getCaseById(caseId: string): CaseLaw | undefined {
    return this.caseLibrary.get(caseId);
  }

  /**
   * Get case by citation
   */
  getCaseByCitation(citation: string): CaseLaw | undefined {
    for (const caseLaw of Array.from(this.caseLibrary.values())) {
      if (caseLaw.citation === citation) {
        return caseLaw;
      }
    }
    return undefined;
  }

  /**
   * Verify citation exists in library
   */
  verifyCitation(citation: string): { valid: boolean; case?: CaseLaw; error?: string } {
    const caseLaw = this.getCaseByCitation(citation);
    if (caseLaw) {
      return { valid: true, case: caseLaw };
    }
    return { valid: false, error: `Citation not found in case library: ${citation}` };
  }

  /**
   * Get library statistics
   */
  getLibraryStats(): {
    totalCases: number;
    byJurisdiction: Record<string, number>;
    byCourt: Record<string, number>;
    byTopic: Record<string, number>;
    dateRange: { earliest: Date | null; latest: Date | null };
  } {
    const stats = {
      totalCases: this.caseLibrary.size,
      byJurisdiction: {} as Record<string, number>,
      byCourt: {} as Record<string, number>,
      byTopic: {} as Record<string, number>,
      dateRange: { earliest: null as Date | null, latest: null as Date | null },
    };

    for (const caseLaw of Array.from(this.caseLibrary.values())) {
      // Jurisdiction
      stats.byJurisdiction[caseLaw.jurisdiction] = 
        (stats.byJurisdiction[caseLaw.jurisdiction] || 0) + 1;

      // Court
      stats.byCourt[caseLaw.court] = 
        (stats.byCourt[caseLaw.court] || 0) + 1;

      // Topics
      for (const topic of caseLaw.topics) {
        stats.byTopic[topic] = (stats.byTopic[topic] || 0) + 1;
      }

      // Date range
      const caseDate = new Date(caseLaw.dateDecided);
      if (!stats.dateRange.earliest || caseDate < stats.dateRange.earliest) {
        stats.dateRange.earliest = caseDate;
      }
      if (!stats.dateRange.latest || caseDate > stats.dateRange.latest) {
        stats.dateRange.latest = caseDate;
      }
    }

    return stats;
  }

  // ===========================================================================
  // MATTER MANAGEMENT
  // ===========================================================================

  /**
   * Create a new matter
   */
  async createMatter(matterData: Omit<Matter, 'id' | 'createdAt' | 'updatedAt' | 'documents' | 'deliberations'>): Promise<Matter> {
    const id = `matter-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

    const matter: Matter = {
      ...matterData,
      id,
      documents: [],
      deliberations: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.matters.set(id, matter);
    persistServiceRecord({ serviceName: 'LegalVertical', recordType: 'matter', referenceId: id, data: matter });
    this.emit('matter-created', matter);

    return matter;
  }

  /**
   * Get matter by ID
   */
  getMatter(matterId: string): Matter | undefined {
    return this.matters.get(matterId);
  }

  /**
   * Update matter
   */
  async updateMatter(matterId: string, updates: Partial<Matter>): Promise<Matter | null> {
    const matter = this.matters.get(matterId);
    if (!matter) return null;

    const updated: Matter = {
      ...matter,
      ...updates,
      id: matter.id, // Prevent ID change
      updatedAt: new Date(),
    };

    this.matters.set(matterId, updated);
    this.emit('matter-updated', updated);

    return updated;
  }

  /**
   * List matters with filters
   */
  listMatters(filters?: {
    clientId?: string;
    status?: MatterStatus;
    type?: MatterType;
    practiceArea?: string;
    responsibleAttorney?: string;
  }): Matter[] {
    let results = Array.from(this.matters.values());

    if (filters?.clientId) {
      results = results.filter(m => m.clientId === filters.clientId);
    }
    if (filters?.status) {
      results = results.filter(m => m.status === filters.status);
    }
    if (filters?.type) {
      results = results.filter(m => m.type === filters.type);
    }
    if (filters?.practiceArea) {
      results = results.filter(m => m.practiceArea === filters.practiceArea);
    }
    if (filters?.responsibleAttorney) {
      results = results.filter(m => m.responsibleAttorney === filters.responsibleAttorney);
    }

    return results;
  }

  // ===========================================================================
  // PRIVILEGE MANAGEMENT
  // ===========================================================================

  /**
   * Submit privilege review
   */
  async submitPrivilegeReview(review: Omit<PrivilegeReview, 'id'>): Promise<PrivilegeReview> {
    const id = `priv-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

    const privilegeReview: PrivilegeReview = {
      ...review,
      id,
    };

    this.privilegeReviews.set(id, privilegeReview);
    this.emit('privilege-review-submitted', privilegeReview);

    return privilegeReview;
  }

  /**
   * Check if document can be exported (privilege gate)
   */
  canExportDocument(documentId: string): { 
    canExport: boolean; 
    reason: string; 
    review?: PrivilegeReview 
  } {
    // Find the most recent privilege review for this document
    let latestReview: PrivilegeReview | undefined;
    for (const review of Array.from(this.privilegeReviews.values())) {
      if (review.documentId === documentId) {
        if (!latestReview || review.reviewedAt > latestReview.reviewedAt) {
          latestReview = review;
        }
      }
    }

    if (!latestReview) {
      return {
        canExport: false,
        reason: 'Document has not been reviewed for privilege',
      };
    }

    if (!latestReview.approvedForExport) {
      return {
        canExport: false,
        reason: `Export not approved: ${latestReview.rationale}`,
        review: latestReview,
      };
    }

    return {
      canExport: true,
      reason: 'Privilege review approved for export',
      review: latestReview,
    };
  }

  /**
   * Get privilege reviews for a matter
   */
  getPrivilegeReviewsForMatter(matterId: string): PrivilegeReview[] {
    return Array.from(this.privilegeReviews.values())
      .filter(r => r.matterId === matterId);
  }

  // ===========================================================================
  // CITATION ENFORCEMENT
  // ===========================================================================

  /**
   * Validate all citations in a document/output
   */
  validateCitations(citations: string[]): {
    valid: Citation[];
    invalid: string[];
    warnings: string[];
  } {
    const result = {
      valid: [] as Citation[],
      invalid: [] as string[],
      warnings: [] as string[],
    };

    for (const citation of citations) {
      const verification = this.verifyCitation(citation);
      if (verification.valid && verification.case) {
        result.valid.push({
          id: `cit-${verification.case.id}`,
          caseId: verification.case.id,
          citation: verification.case.citation,
          title: verification.case.title,
          relevance: 'Verified in case library',
          supportingText: verification.case.summary.substring(0, 200),
          verifiedAt: new Date(),
          verifiedBy: 'system',
          isValid: true,
        });
      } else {
        result.invalid.push(citation);
        result.warnings.push(`Citation not found: ${citation}`);
      }
    }

    return result;
  }

  /**
   * Enforce citation requirement (no-source-no-claim)
   */
  enforceCitationRequirement(
    claims: { claim: string; citations: string[] }[]
  ): {
    approved: { claim: string; citations: Citation[] }[];
    rejected: { claim: string; reason: string }[];
  } {
    const result = {
      approved: [] as { claim: string; citations: Citation[] }[],
      rejected: [] as { claim: string; reason: string }[],
    };

    for (const item of claims) {
      if (item.citations.length === 0) {
        result.rejected.push({
          claim: item.claim,
          reason: 'No citations provided - claim cannot be made without supporting authority',
        });
        continue;
      }

      const validation = this.validateCitations(item.citations);
      if (validation.invalid.length > 0) {
        result.rejected.push({
          claim: item.claim,
          reason: `Invalid citations: ${validation.invalid.join(', ')}`,
        });
      } else {
        result.approved.push({
          claim: item.claim,
          citations: validation.valid,
        });
      }
    }

    return result;
  }

  // ===========================================================================
  // AGENT PRESETS
  // ===========================================================================

  /**
   * Get all agent presets
   */
  getAgentPresets(): AgentPreset[] {
    return this.agentPresets;
  }

  /**
   * Get agent preset by ID
   */
  getAgentPreset(presetId: string): AgentPreset | undefined {
    return this.agentPresets.find(p => p.id === presetId);
  }

  /**
   * Get recommended preset for matter type
   */
  getRecommendedPreset(matterType: MatterType): AgentPreset {
    const presetMap: Record<MatterType, string> = {
      'litigation': 'litigation-prep',
      'transactional': 'high-stakes-negotiation',
      'regulatory': 'regulatory-response',
      'advisory': 'contract-review',
      'investigation': 'ediscovery',
      'ip': 'litigation-prep',
      'employment': 'regulatory-response',
      'real-estate': 'contract-review',
    };

    const presetId = presetMap[matterType] || 'contract-review';
    const preset = this.agentPresets.find(p => p.id === presetId);
    if (!preset) {
      // Fallback to first preset if not found
      const fallback = this.agentPresets[0];
      if (!fallback) {
        throw new Error('No agent presets configured');
      }
      return fallback;
    }
    return preset;
  }

  // ===========================================================================
  // HEALTH CHECK
  // ===========================================================================

  getHealth(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    caseLibrarySize: number;
    mattersCount: number;
    privilegeReviewsCount: number;
    lastActivity: Date | null;
  } {
    return {
      status: 'healthy',
      caseLibrarySize: this.caseLibrary.size,
      mattersCount: this.matters.size,
      privilegeReviewsCount: this.privilegeReviews.size,
      lastActivity: new Date(),
    };
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'LegalVertical', recordType: 'case_law', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.caseLibrary.has(d.id)) this.caseLibrary.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'LegalVertical', recordType: 'matter', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.matters.has(d.id)) this.matters.set(d.id, d);


      }


      restored += recs_1.length;


      const recs_2 = await loadServiceRecords({ serviceName: 'LegalVertical', recordType: 'matter', limit: 1000 });


      for (const rec of recs_2) {


        const d = rec.data as any;


        if (d?.id && !this.privilegeReviews.has(d.id)) this.privilegeReviews.set(d.id, d);


      }


      restored += recs_2.length;


      const recs_3 = await loadServiceRecords({ serviceName: 'LegalVertical', recordType: 'matter', limit: 1000 });


      for (const rec of recs_3) {


        const d = rec.data as any;


        if (d?.id && !this.citationCache.has(d.id)) this.citationCache.set(d.id, d);


      }


      restored += recs_3.length;


      if (restored > 0) logger.info(`[LegalVerticalService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[LegalVerticalService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

// Singleton instance
export const legalVerticalService = new LegalVerticalService();
export default legalVerticalService;
