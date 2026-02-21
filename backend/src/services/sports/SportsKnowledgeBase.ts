// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA PLATFORM - SPORTS VERTICAL
 * RAG Knowledge Base for Sports Regulations
 * 
 * Provides retrieval-augmented generation for football/soccer regulatory knowledge
 * with provenance tracking and citation support.
 * 
 * Copyright (c) 2024-2026 Datacendia, Inc. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL
 */

import { EventEmitter } from 'events';
import crypto from 'crypto';
import { logger } from '../../utils/logger.js';
import { persistServiceRecord } from '../../utils/servicePersistence.js';

// =============================================================================
// TYPES
// =============================================================================

export type RegulationSource = 
  | 'UEFA'
  | 'FIFA'
  | 'FA'
  | 'PREMIER_LEAGUE'
  | 'EFL'
  | 'SFA'
  | 'SPFL'
  | 'CAS'
  | 'WADA';

export type RegulationType =
  | 'ffp'
  | 'club_licensing'
  | 'agent_regulations'
  | 'player_status'
  | 'transfer_matching'
  | 'salary_cap'
  | 'youth_development'
  | 'anti_doping'
  | 'disciplinary'
  | 'dispute_resolution';

export interface RegulationDocument {
  id: string;
  source: RegulationSource;
  type: RegulationType;
  title: string;
  version: string;
  effectiveDate: Date;
  expiryDate?: Date;
  url?: string;
  content: string;
  sections: RegulationSection[];
  hash: string;
  lastUpdated: Date;
}

export interface RegulationSection {
  id: string;
  articleNumber: string;
  title: string;
  content: string;
  subsections?: RegulationSection[];
  keywords: string[];
  embedding?: number[];
}

export interface KnowledgeQuery {
  query: string;
  sources?: RegulationSource[];
  types?: RegulationType[];
  maxResults?: number;
  minRelevance?: number;
}

export interface KnowledgeResult {
  section: RegulationSection;
  document: RegulationDocument;
  relevanceScore: number;
  citation: string;
  excerpt: string;
}

export interface ProvenanceRecord {
  documentId: string;
  sectionId: string;
  citation: string;
  accessedAt: Date;
  queryContext: string;
  hash: string;
}

// =============================================================================
// REGULATION KNOWLEDGE CORPUS
// =============================================================================

const UEFA_FFP_ARTICLES: RegulationSection[] = [
  {
    id: 'uefa-ffp-art-1',
    articleNumber: 'Article 1',
    title: 'Scope of Application',
    content: `These regulations apply to all clubs participating in UEFA club competitions. 
    The regulations establish requirements for club licensing and financial fair play.
    Clubs must demonstrate financial sustainability and break-even compliance.`,
    keywords: ['scope', 'application', 'club competitions', 'licensing', 'financial sustainability'],
  },
  {
    id: 'uefa-ffp-art-58',
    articleNumber: 'Article 58',
    title: 'Break-even Requirement',
    content: `A club must demonstrate that the aggregate break-even result for the two reporting 
    periods ending in the two years before the licence season (T-2 and T-1) is not a deficit. 
    If it is a deficit, the club must demonstrate that the aggregate break-even result for the 
    three reporting periods ending in T-2, T-1 and T is not a deficit.
    
    Acceptable deviation: €5 million deficit over three years (or higher if covered by 
    contributions from equity participants/related parties).`,
    keywords: ['break-even', 'deficit', 'reporting period', 'acceptable deviation', 'equity'],
  },
  {
    id: 'uefa-ffp-art-59',
    articleNumber: 'Article 59',
    title: 'Relevant Income and Expenses',
    content: `Relevant income includes: gate receipts, sponsorship/advertising, broadcasting rights,
    commercial activities, UEFA prize money, player trading profits, finance income.
    
    Relevant expenses include: cost of sales, employee benefits (players, coaching, admin),
    amortisation of player registrations, finance costs, impairment losses.
    
    Excluded: expenditure on youth development, women's football, community activities,
    non-cash items related to property revaluations.`,
    keywords: ['income', 'expenses', 'gate receipts', 'broadcasting', 'amortisation', 'youth development'],
  },
  {
    id: 'uefa-ffp-art-65',
    articleNumber: 'Article 65',
    title: 'Squad Cost Rule',
    content: `From 2025/26, the squad cost ratio must not exceed 70% of relevant revenue.
    Squad costs include: player wages, agent fees, amortisation of transfer fees.
    
    Transitional periods:
    - 2023/24: 90% threshold
    - 2024/25: 80% threshold  
    - 2025/26 onwards: 70% threshold
    
    Breaches may result in sporting sanctions including exclusion from competitions.`,
    keywords: ['squad cost', 'wages', 'agent fees', 'amortisation', '70%', 'threshold'],
  },
  {
    id: 'uefa-ffp-art-70',
    articleNumber: 'Article 70',
    title: 'Football Earnings Rule',
    content: `Net transfer spending is limited to €100 million per assessment period.
    This covers the aggregate of transfer fees paid minus transfer fees received.
    
    Clubs with positive break-even results may have higher allowances.
    New owners may benefit from transitional provisions for initial investments.`,
    keywords: ['transfer spending', 'net spending', '100 million', 'assessment period'],
  },
];

const FIFA_AGENT_ARTICLES: RegulationSection[] = [
  {
    id: 'fifa-agent-art-1',
    articleNumber: 'Article 1',
    title: 'Definitions and Scope',
    content: `Football Agent: A natural person who, for a fee, represents players in negotiations 
    with clubs for employment contracts, or represents clubs in negotiations with other clubs 
    for transfer agreements.
    
    These regulations apply to all international transfers and domestic transfers where the 
    national association has adopted these regulations.`,
    keywords: ['football agent', 'representation', 'negotiations', 'transfer', 'employment'],
  },
  {
    id: 'fifa-agent-art-14',
    articleNumber: 'Article 14',
    title: 'Service Fee Caps',
    content: `Maximum service fees (from 2023):
    - When representing a player: 3% of the player's gross remuneration
    - When representing the engaging club: 3% of gross remuneration or transfer fee
    - When representing the releasing club: 3% of the transfer fee
    
    The 3% cap applies per transaction. If an agent represents multiple parties in the same 
    transaction, written disclosure and consent from all parties is required.
    
    For players earning below €200,000 per year, the 3% cap may be exceeded up to 6%.`,
    keywords: ['service fee', 'cap', '3%', 'remuneration', 'transfer fee', 'disclosure'],
  },
  {
    id: 'fifa-agent-art-15',
    articleNumber: 'Article 15',
    title: 'Multiple Representation',
    content: `An agent may represent more than one party to the same transaction only if:
    - All parties provide written consent
    - There is full disclosure of the multiple representation
    - Each party acknowledges potential conflicts of interest
    
    The agent must maintain confidentiality of each client's negotiating position.
    If a conflict of interest arises that cannot be managed, the agent must withdraw.`,
    keywords: ['multiple representation', 'conflict of interest', 'disclosure', 'consent'],
  },
  {
    id: 'fifa-agent-art-21',
    articleNumber: 'Article 21',
    title: 'Payment Disclosure',
    content: `All payments to agents must be disclosed through the FIFA Clearing House.
    Payments must be made directly by the principal engaging the agent's services.
    
    Third-party payments to agents are prohibited unless explicitly authorised.
    All agent contracts must be registered with FIFA within 10 days of signing.`,
    keywords: ['payment', 'disclosure', 'clearing house', 'registration', 'third-party'],
  },
];

const PREMIER_LEAGUE_PSR_ARTICLES: RegulationSection[] = [
  {
    id: 'pl-psr-e1',
    articleNumber: 'Rule E.1',
    title: 'Profitability and Sustainability',
    content: `Clubs must not record aggregate losses exceeding £105 million over a rolling 
    three-year assessment period.
    
    Permitted Losses:
    - £105 million if fully funded by equity contributions
    - £15 million without equity contributions
    
    Infrastructure investments may be excluded if approved by the Board.`,
    keywords: ['losses', '105 million', 'three-year', 'equity', 'infrastructure'],
  },
  {
    id: 'pl-psr-e2',
    articleNumber: 'Rule E.2',
    title: 'Anchoring to 2019/20',
    content: `The 2019/20 season's actual wage costs are used as an "anchor" for assessing 
    reasonable wage growth. Significant deviations from sector-wide trends may trigger 
    additional scrutiny.
    
    This prevents clubs from dramatically inflating wage bills without corresponding revenue growth.`,
    keywords: ['anchoring', '2019/20', 'wage costs', 'growth', 'scrutiny'],
  },
  {
    id: 'pl-psr-e10',
    articleNumber: 'Rule E.10',
    title: 'Associated Party Transactions',
    content: `All transactions with associated parties must be at Fair Market Value (FMV).
    
    The Board may require independent valuations for:
    - Sponsorship agreements above £10 million per year
    - Commercial arrangements with related parties
    - Loans or financing from owners/connected parties
    
    Non-arm's length transactions may be adjusted to FMV for PSR calculations.`,
    keywords: ['associated party', 'fair market value', 'sponsorship', 'independent valuation'],
  },
];

const SFA_CLUB_LICENSING_ARTICLES: RegulationSection[] = [
  {
    id: 'sfa-cl-s1',
    articleNumber: 'Section 1',
    title: 'Sporting Criteria',
    content: `Clubs must have:
    - A first team registered in the SPFL
    - Youth development programmes at specified age groups
    - Adequate number of qualified coaches (minimum UEFA B licence for first team)
    - Medical staff with appropriate qualifications`,
    keywords: ['sporting criteria', 'youth development', 'coaches', 'medical staff'],
  },
  {
    id: 'sfa-cl-s3',
    articleNumber: 'Section 3',
    title: 'Financial Criteria',
    content: `Clubs must submit:
    - Audited annual financial statements
    - Future financial information (budgets, cash flow projections)
    - Proof of no overdue payables to football clubs, employees, or tax authorities
    
    The licence may be refused if there is material uncertainty about going concern status.`,
    keywords: ['financial criteria', 'audited statements', 'overdue payables', 'going concern'],
  },
];

// =============================================================================
// KNOWLEDGE BASE SERVICE
// =============================================================================

class SportsKnowledgeBaseService extends EventEmitter {
  private static instance: SportsKnowledgeBaseService;
  private documents: Map<string, RegulationDocument> = new Map();
  private provenanceLog: ProvenanceRecord[] = [];
  
  private constructor() {
    super();
    this.initializeCorpus();
  }

  static getInstance(): SportsKnowledgeBaseService {
    if (!SportsKnowledgeBaseService.instance) {
      SportsKnowledgeBaseService.instance = new SportsKnowledgeBaseService();
    }
    return SportsKnowledgeBaseService.instance;
  }

  private initializeCorpus(): void {
    // UEFA FFP Regulations
    this.addDocument({
      id: 'uefa-ffp-2024',
      source: 'UEFA',
      type: 'ffp',
      title: 'UEFA Club Licensing and Financial Sustainability Regulations',
      version: 'Edition 2024',
      effectiveDate: new Date('2024-06-01'),
      url: 'https://documents.uefa.com/r/UEFA-Club-Licensing-and-Financial-Sustainability-Regulations-Edition-2024',
      content: 'Full UEFA FFP regulations establishing break-even requirements, squad cost ratios, and financial sustainability measures for clubs participating in UEFA competitions.',
      sections: UEFA_FFP_ARTICLES,
    });

    // FIFA Agent Regulations
    this.addDocument({
      id: 'fifa-agent-2023',
      source: 'FIFA',
      type: 'agent_regulations',
      title: 'FIFA Football Agent Regulations',
      version: 'Edition 2023',
      effectiveDate: new Date('2023-01-01'),
      url: 'https://digitalhub.fifa.com/m/1f1ae61c0cbe8c92/original/FIFA-Football-Agent-Regulations.pdf',
      content: 'FIFA regulations governing the activity of football agents, including licensing requirements, service fee caps, and disclosure obligations.',
      sections: FIFA_AGENT_ARTICLES,
    });

    // Premier League PSR
    this.addDocument({
      id: 'pl-psr-2024',
      source: 'PREMIER_LEAGUE',
      type: 'ffp',
      title: 'Premier League Profitability and Sustainability Rules',
      version: '2024/25',
      effectiveDate: new Date('2024-07-01'),
      url: 'https://www.premierleague.com/publications',
      content: 'Premier League rules on profitability and sustainability, including permitted losses thresholds and assessment methodology.',
      sections: PREMIER_LEAGUE_PSR_ARTICLES,
    });

    // SFA Club Licensing
    this.addDocument({
      id: 'sfa-licensing-2024',
      source: 'SFA',
      type: 'club_licensing',
      title: 'SFA Club Licensing Regulations',
      version: '2024/25',
      effectiveDate: new Date('2024-06-01'),
      content: 'Scottish Football Association club licensing requirements for participation in UEFA competitions.',
      sections: SFA_CLUB_LICENSING_ARTICLES,
    });

    logger.info(`Sports Knowledge Base initialized with ${this.documents.size} regulation documents`);
  }

  private addDocument(doc: Omit<RegulationDocument, 'hash' | 'lastUpdated'>): void {
    const hash = crypto.createHash('sha256')
      .update(JSON.stringify(doc))
      .digest('hex');
    
    this.documents.set(doc.id, {
      ...doc,
      hash,
      lastUpdated: new Date(),
    });
  }

  // ---------------------------------------------------------------------------
  // QUERY METHODS
  // ---------------------------------------------------------------------------

  async query(params: KnowledgeQuery): Promise<KnowledgeResult[]> {
    const results: KnowledgeResult[] = [];
    const queryTerms = this.tokenize(params.query.toLowerCase());
    
    for (const doc of this.documents.values()) {
      // Filter by source if specified
      if (params.sources && !params.sources.includes(doc.source)) {
        continue;
      }
      
      // Filter by type if specified
      if (params.types && !params.types.includes(doc.type)) {
        continue;
      }
      
      for (const section of doc.sections) {
        const relevance = this.calculateRelevance(queryTerms, section);
        
        if (relevance >= (params.minRelevance || 0.1)) {
          results.push({
            section,
            document: doc,
            relevanceScore: relevance,
            citation: this.formatCitation(doc, section),
            excerpt: this.extractExcerpt(section.content, queryTerms),
          });
          
          // Log provenance
          this.logProvenance(doc.id, section.id, params.query);
        }
      }
    }
    
    // Sort by relevance and limit results
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    return results.slice(0, params.maxResults || 10);
  }

  async getRegulationBySource(source: RegulationSource): Promise<RegulationDocument[]> {
    const docs: RegulationDocument[] = [];
    for (const doc of this.documents.values()) {
      if (doc.source === source) {
        docs.push(doc);
      }
    }
    return docs;
  }

  async getRegulationByType(type: RegulationType): Promise<RegulationDocument[]> {
    const docs: RegulationDocument[] = [];
    for (const doc of this.documents.values()) {
      if (doc.type === type) {
        docs.push(doc);
      }
    }
    return docs;
  }

  async getSection(documentId: string, sectionId: string): Promise<RegulationSection | null> {
    const doc = this.documents.get(documentId);
    if (!doc) return null;
    
    return doc.sections.find(s => s.id === sectionId) || null;
  }

  // ---------------------------------------------------------------------------
  // PROVENANCE TRACKING
  // ---------------------------------------------------------------------------

  private logProvenance(documentId: string, sectionId: string, queryContext: string): void {
    const record: ProvenanceRecord = {
      documentId,
      sectionId,
      citation: this.formatCitationById(documentId, sectionId),
      accessedAt: new Date(),
      queryContext,
      hash: crypto.createHash('sha256')
        .update(`${documentId}:${sectionId}:${Date.now()}`)
        .digest('hex'),
    };
    
    this.provenanceLog.push(record);
    this.emit('provenance_logged', record);
  }

  getProvenanceLog(options?: {
    documentId?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): ProvenanceRecord[] {
    let records = [...this.provenanceLog];
    
    if (options?.documentId) {
      records = records.filter(r => r.documentId === options.documentId);
    }
    if (options?.startDate) {
      records = records.filter(r => r.accessedAt >= options.startDate!);
    }
    if (options?.endDate) {
      records = records.filter(r => r.accessedAt <= options.endDate!);
    }
    
    return records.slice(-(options?.limit || 100));
  }

  // ---------------------------------------------------------------------------
  // HELPER METHODS
  // ---------------------------------------------------------------------------

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 2);
  }

  private calculateRelevance(queryTerms: string[], section: RegulationSection): number {
    const sectionText = `${section.title} ${section.content} ${section.keywords.join(' ')}`.toLowerCase();
    const sectionTerms = this.tokenize(sectionText);
    
    let matches = 0;
    let keywordBonus = 0;
    
    for (const term of queryTerms) {
      if (sectionTerms.includes(term)) {
        matches++;
      }
      if (section.keywords.some(k => k.toLowerCase().includes(term))) {
        keywordBonus += 0.2;
      }
    }
    
    const baseScore = queryTerms.length > 0 ? matches / queryTerms.length : 0;
    return Math.min(1, baseScore + keywordBonus);
  }

  private formatCitation(doc: RegulationDocument, section: RegulationSection): string {
    return `${doc.source}, "${doc.title}" (${doc.version}), ${section.articleNumber}: ${section.title}`;
  }

  private formatCitationById(documentId: string, sectionId: string): string {
    const doc = this.documents.get(documentId);
    if (!doc) return `[Unknown: ${documentId}/${sectionId}]`;
    
    const section = doc.sections.find(s => s.id === sectionId);
    if (!section) return `[Unknown section: ${sectionId}]`;
    
    return this.formatCitation(doc, section);
  }

  private extractExcerpt(content: string, queryTerms: string[], maxLength: number = 200): string {
    // Find the best matching segment
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length === 0) {
      return content.substring(0, maxLength);
    }
    
    let bestSentence = sentences[0] || content.substring(0, maxLength);
    let bestScore = 0;
    
    for (const sentence of sentences) {
      const score = queryTerms.filter(t => sentence.toLowerCase().includes(t)).length;
      if (score > bestScore) {
        bestScore = score;
        bestSentence = sentence;
      }
    }
    
    if (bestSentence.length > maxLength) {
      return bestSentence.substring(0, maxLength - 3) + '...';
    }
    return bestSentence.trim();
  }

  // ---------------------------------------------------------------------------
  // STATUS & HEALTH
  // ---------------------------------------------------------------------------

  getStatus(): {
    documentCount: number;
    sectionCount: number;
    sources: RegulationSource[];
    types: RegulationType[];
    provenanceRecords: number;
  } {
    const sources = new Set<RegulationSource>();
    const types = new Set<RegulationType>();
    let sectionCount = 0;
    
    for (const doc of this.documents.values()) {
      sources.add(doc.source);
      types.add(doc.type);
      sectionCount += doc.sections.length;
    }
    
    return {
      documentCount: this.documents.size,
      sectionCount,
      sources: Array.from(sources),
      types: Array.from(types),
      provenanceRecords: this.provenanceLog.length,
    };
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export const sportsKnowledgeBase = SportsKnowledgeBaseService.getInstance();

export default SportsKnowledgeBaseService;
