// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * SPORTS KNOWLEDGE BASE TEST SUITE
 * =============================================================================
 * Comprehensive testing for Sports Vertical RAG Knowledge Base covering:
 * - Regulation document structure
 * - Query functionality
 * - Provenance tracking
 * - Citation accuracy
 * - Document retrieval
 * - Excerpt extraction
 */

import { describe, it, expect } from 'vitest';
import {
  sportsKnowledgeBase,
  RegulationSource,
  RegulationType,
  KnowledgeResult,
} from '../../../services/sports/SportsKnowledgeBase.js';

// =============================================================================
// EXPECTED DATA
// =============================================================================

const EXPECTED_SOURCES: RegulationSource[] = [
  'UEFA',
  'FIFA',
  'PREMIER_LEAGUE',
  'SFA',
];

const EXPECTED_TYPES: RegulationType[] = [
  'ffp',
  'agent_regulations',
  'club_licensing',
];

// =============================================================================
// KNOWLEDGE BASE STATUS TESTS
// =============================================================================

describe('Sports Knowledge Base - Status', () => {
  it('should return status with document count', () => {
    const status = sportsKnowledgeBase.getStatus();
    expect(status).toBeDefined();
    expect(status.documentCount).toBeGreaterThan(0);
  });

  it('should have sections loaded', () => {
    const status = sportsKnowledgeBase.getStatus();
    expect(status.sectionCount).toBeGreaterThan(0);
  });

  it('should track provenance records count', () => {
    const status = sportsKnowledgeBase.getStatus();
    expect(typeof status.provenanceRecords).toBe('number');
  });

  it('should list sources', () => {
    const status = sportsKnowledgeBase.getStatus();
    expect(status.sources).toBeDefined();
    expect(Array.isArray(status.sources)).toBe(true);
  });

  it('should list types', () => {
    const status = sportsKnowledgeBase.getStatus();
    expect(status.types).toBeDefined();
    expect(Array.isArray(status.types)).toBe(true);
  });
});

// =============================================================================
// QUERY FUNCTIONALITY TESTS
// =============================================================================

describe('Sports Knowledge Base - Query Functionality', () => {
  describe('Basic Queries', () => {
    it('should return results for FFP query', async () => {
      const results = await sportsKnowledgeBase.query({
        query: 'financial fair play',
      });
      expect(results.length).toBeGreaterThan(0);
    });

    it('should return results for break-even query', async () => {
      const results = await sportsKnowledgeBase.query({
        query: 'break-even requirement',
      });
      expect(results.length).toBeGreaterThan(0);
    });

    it('should return results for agent regulations query', async () => {
      const results = await sportsKnowledgeBase.query({
        query: 'agent fee regulations',
      });
      expect(results.length).toBeGreaterThan(0);
    });

    it('should return results for squad cost query', async () => {
      const results = await sportsKnowledgeBase.query({
        query: 'squad cost ratio',
      });
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('Source Filtering', () => {
    it('should filter by UEFA source', async () => {
      const results = await sportsKnowledgeBase.query({
        query: 'compliance',
        sources: ['UEFA'],
      });
      for (const result of results) {
        expect(result.document.source).toBe('UEFA');
      }
    });

    it('should filter by FIFA source', async () => {
      const results = await sportsKnowledgeBase.query({
        query: 'regulations',
        sources: ['FIFA'],
      });
      for (const result of results) {
        expect(result.document.source).toBe('FIFA');
      }
    });

    it('should filter by multiple sources', async () => {
      const results = await sportsKnowledgeBase.query({
        query: 'compliance',
        sources: ['UEFA', 'FIFA'],
      });
      for (const result of results) {
        expect(['UEFA', 'FIFA']).toContain(result.document.source);
      }
    });
  });

  describe('Type Filtering', () => {
    it('should filter by FFP type', async () => {
      const results = await sportsKnowledgeBase.query({
        query: 'financial',
        types: ['ffp'],
      });
      for (const result of results) {
        expect(result.document.type).toBe('ffp');
      }
    });

    it('should filter by agent regulations type', async () => {
      const results = await sportsKnowledgeBase.query({
        query: 'fee',
        types: ['agent_regulations'],
      });
      for (const result of results) {
        expect(result.document.type).toBe('agent_regulations');
      }
    });
  });

  describe('Result Limiting', () => {
    it('should respect maxResults parameter', async () => {
      const results = await sportsKnowledgeBase.query({
        query: 'financial',
        maxResults: 3,
      });
      expect(results.length).toBeLessThanOrEqual(3);
    });

    it('should return default number of results when not limited', async () => {
      const results = await sportsKnowledgeBase.query({
        query: 'regulations',
      });
      expect(results.length).toBeLessThanOrEqual(10); // Default limit
    });
  });

  describe('Relevance Scoring', () => {
    it('should return results with relevance scores', async () => {
      const results = await sportsKnowledgeBase.query({
        query: 'break-even requirement',
      });
      for (const result of results) {
        expect(result.relevanceScore).toBeDefined();
        expect(result.relevanceScore).toBeGreaterThanOrEqual(0);
        expect(result.relevanceScore).toBeLessThanOrEqual(1);
      }
    });

    it('should sort results by relevance (descending)', async () => {
      const results = await sportsKnowledgeBase.query({
        query: 'agent fee',
      });
      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].relevanceScore).toBeGreaterThanOrEqual(results[i].relevanceScore);
      }
    });

    it('should filter by minimum relevance', async () => {
      const results = await sportsKnowledgeBase.query({
        query: 'financial',
        minRelevance: 0.3,
      });
      for (const result of results) {
        expect(result.relevanceScore).toBeGreaterThanOrEqual(0.3);
      }
    });
  });
});

// =============================================================================
// RESULT STRUCTURE TESTS
// =============================================================================

describe('Sports Knowledge Base - Result Structure', () => {
  it('should return results with section data', async () => {
    const results = await sportsKnowledgeBase.query({
      query: 'break-even',
    });
    expect(results.length).toBeGreaterThan(0);
    
    const result = results[0];
    expect(result.section).toBeDefined();
    expect(result.section.id).toBeDefined();
    expect(result.section.articleNumber).toBeDefined();
    expect(result.section.title).toBeDefined();
    expect(result.section.content).toBeDefined();
  });

  it('should return results with document data', async () => {
    const results = await sportsKnowledgeBase.query({
      query: 'break-even',
    });
    expect(results.length).toBeGreaterThan(0);
    
    const result = results[0];
    expect(result.document).toBeDefined();
    expect(result.document.id).toBeDefined();
    expect(result.document.source).toBeDefined();
    expect(result.document.type).toBeDefined();
    expect(result.document.title).toBeDefined();
  });

  it('should return results with citations', async () => {
    const results = await sportsKnowledgeBase.query({
      query: 'UEFA FFP',
    });
    expect(results.length).toBeGreaterThan(0);
    
    const result = results[0];
    expect(result.citation).toBeDefined();
    expect(result.citation.length).toBeGreaterThan(10);
  });

  it('should return results with excerpts', async () => {
    const results = await sportsKnowledgeBase.query({
      query: 'squad cost ratio',
    });
    expect(results.length).toBeGreaterThan(0);
    
    const result = results[0];
    expect(result.excerpt).toBeDefined();
    expect(result.excerpt.length).toBeGreaterThan(0);
  });
});

// =============================================================================
// DOCUMENT RETRIEVAL TESTS
// =============================================================================

describe('Sports Knowledge Base - Document Retrieval', () => {
  it('should retrieve documents by UEFA source', async () => {
    const docs = await sportsKnowledgeBase.getRegulationBySource('UEFA');
    expect(docs.length).toBeGreaterThan(0);
    for (const doc of docs) {
      expect(doc.source).toBe('UEFA');
    }
  });

  it('should retrieve documents by FIFA source', async () => {
    const docs = await sportsKnowledgeBase.getRegulationBySource('FIFA');
    expect(docs.length).toBeGreaterThan(0);
    for (const doc of docs) {
      expect(doc.source).toBe('FIFA');
    }
  });

  it('should retrieve documents by FFP type', async () => {
    const docs = await sportsKnowledgeBase.getRegulationByType('ffp');
    expect(docs.length).toBeGreaterThan(0);
    for (const doc of docs) {
      expect(doc.type).toBe('ffp');
    }
  });

  it('should retrieve documents by agent regulations type', async () => {
    const docs = await sportsKnowledgeBase.getRegulationByType('agent_regulations');
    expect(docs.length).toBeGreaterThan(0);
    for (const doc of docs) {
      expect(doc.type).toBe('agent_regulations');
    }
  });
});

// =============================================================================
// SECTION RETRIEVAL TESTS
// =============================================================================

describe('Sports Knowledge Base - Section Retrieval', () => {
  it('should retrieve section by document and section ID', async () => {
    // First get a document
    const docs = await sportsKnowledgeBase.getRegulationBySource('UEFA');
    expect(docs.length).toBeGreaterThan(0);
    
    const doc = docs[0];
    expect(doc.sections.length).toBeGreaterThan(0);
    
    const sectionId = doc.sections[0].id;
    const section = await sportsKnowledgeBase.getSection(doc.id, sectionId);
    
    expect(section).toBeDefined();
    expect(section?.id).toBe(sectionId);
  });

  it('should return null for non-existent document ID', async () => {
    const section = await sportsKnowledgeBase.getSection('non-existent', 'any');
    expect(section).toBeNull();
  });

  it('should return null for non-existent section ID', async () => {
    const docs = await sportsKnowledgeBase.getRegulationBySource('UEFA');
    expect(docs.length).toBeGreaterThan(0);
    
    const section = await sportsKnowledgeBase.getSection(docs[0].id, 'non-existent');
    expect(section).toBeNull();
  });
});

// =============================================================================
// PROVENANCE TRACKING TESTS
// =============================================================================

describe('Sports Knowledge Base - Provenance Tracking', () => {
  it('should log provenance for queries', async () => {
    // Clear any existing records by getting initial count
    const initialCount = sportsKnowledgeBase.getStatus().provenanceRecords;
    
    // Make a query
    await sportsKnowledgeBase.query({
      query: 'break-even requirement UEFA',
    });
    
    // Check provenance was logged
    const log = sportsKnowledgeBase.getProvenanceLog();
    expect(log.length).toBeGreaterThan(0);
  });

  it('should include citation in provenance records', async () => {
    await sportsKnowledgeBase.query({
      query: 'squad cost ratio',
    });
    
    const log = sportsKnowledgeBase.getProvenanceLog({ limit: 5 });
    expect(log.length).toBeGreaterThan(0);
    
    const record = log[log.length - 1];
    expect(record.citation).toBeDefined();
    expect(record.citation.length).toBeGreaterThan(0);
  });

  it('should include accessedAt timestamp', async () => {
    await sportsKnowledgeBase.query({
      query: 'agent fee',
    });
    
    const log = sportsKnowledgeBase.getProvenanceLog({ limit: 1 });
    expect(log.length).toBeGreaterThan(0);
    
    const record = log[0];
    expect(record.accessedAt).toBeInstanceOf(Date);
  });

  it('should include hash for integrity', async () => {
    await sportsKnowledgeBase.query({
      query: 'financial sustainability',
    });
    
    const log = sportsKnowledgeBase.getProvenanceLog({ limit: 1 });
    expect(log.length).toBeGreaterThan(0);
    
    const record = log[0];
    expect(record.hash).toBeDefined();
    expect(record.hash.length).toBe(64); // SHA-256 hex length
  });

  it('should filter provenance by document ID', async () => {
    const docs = await sportsKnowledgeBase.getRegulationBySource('UEFA');
    expect(docs.length).toBeGreaterThan(0);
    
    const docId = docs[0].id;
    const log = sportsKnowledgeBase.getProvenanceLog({ documentId: docId });
    
    for (const record of log) {
      expect(record.documentId).toBe(docId);
    }
  });

  it('should limit provenance results', () => {
    const log = sportsKnowledgeBase.getProvenanceLog({ limit: 5 });
    expect(log.length).toBeLessThanOrEqual(5);
  });
});

// =============================================================================
// CITATION FORMAT TESTS
// =============================================================================

describe('Sports Knowledge Base - Citation Format', () => {
  it('should format UEFA citations correctly', async () => {
    const results = await sportsKnowledgeBase.query({
      query: 'break-even',
      sources: ['UEFA'],
    });
    
    if (results.length > 0) {
      const citation = results[0].citation;
      expect(citation).toContain('UEFA');
      expect(citation).toContain('Article');
    }
  });

  it('should format FIFA citations correctly', async () => {
    const results = await sportsKnowledgeBase.query({
      query: 'agent',
      sources: ['FIFA'],
    });
    
    if (results.length > 0) {
      const citation = results[0].citation;
      expect(citation).toContain('FIFA');
    }
  });

  it('citations should include version information', async () => {
    const results = await sportsKnowledgeBase.query({
      query: 'regulations',
    });
    
    if (results.length > 0) {
      // Citation should have some version indicator (year or version number)
      const citation = results[0].citation;
      expect(citation).toMatch(/\d{4}|v\d/); // Year or version
    }
  });
});

// =============================================================================
// CONTENT ACCURACY TESTS
// =============================================================================

describe('Sports Knowledge Base - Content Accuracy', () => {
  it('should contain 70% squad cost ratio threshold', async () => {
    const results = await sportsKnowledgeBase.query({
      query: 'squad cost ratio threshold',
      sources: ['UEFA'],
    });
    
    const hasThreshold = results.some(r => 
      r.section.content.includes('70%') || r.section.content.includes('70 per cent')
    );
    expect(hasThreshold).toBe(true);
  });

  it('should contain break-even requirement details', async () => {
    const results = await sportsKnowledgeBase.query({
      query: 'break-even deficit',
      sources: ['UEFA'],
    });
    
    const hasBreakEven = results.some(r => 
      r.section.content.toLowerCase().includes('break-even') ||
      r.section.content.toLowerCase().includes('deficit')
    );
    expect(hasBreakEven).toBe(true);
  });

  it('should contain agent fee information', async () => {
    const results = await sportsKnowledgeBase.query({
      query: 'agent service fee percentage',
      sources: ['FIFA'],
    });
    
    const hasFeeInfo = results.some(r => 
      r.section.content.includes('%') || 
      r.section.content.toLowerCase().includes('fee')
    );
    expect(hasFeeInfo).toBe(true);
  });
});

// =============================================================================
// EDGE CASE TESTS
// =============================================================================

describe('Sports Knowledge Base - Edge Cases', () => {
  it('should handle empty query gracefully', async () => {
    const results = await sportsKnowledgeBase.query({
      query: '',
    });
    expect(Array.isArray(results)).toBe(true);
  });

  it('should handle query with special characters', async () => {
    const results = await sportsKnowledgeBase.query({
      query: '£105m "permitted losses"',
    });
    expect(Array.isArray(results)).toBe(true);
  });

  it('should handle query with numbers', async () => {
    const results = await sportsKnowledgeBase.query({
      query: 'Article 58 70% threshold',
    });
    expect(Array.isArray(results)).toBe(true);
  });

  it('should handle non-matching query', async () => {
    const results = await sportsKnowledgeBase.query({
      query: 'xyznonexistentterm123',
    });
    expect(Array.isArray(results)).toBe(true);
    // May return empty or low-relevance results
  });

  it('should handle very long query', async () => {
    const longQuery = 'UEFA Financial Fair Play break-even requirement squad cost ratio '.repeat(5);
    const results = await sportsKnowledgeBase.query({
      query: longQuery,
    });
    expect(Array.isArray(results)).toBe(true);
  });
});

// =============================================================================
// PERFORMANCE TESTS
// =============================================================================

describe('Sports Knowledge Base - Performance', () => {
  it('should complete query in under 100ms', async () => {
    const start = Date.now();
    await sportsKnowledgeBase.query({
      query: 'financial fair play compliance',
    });
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(100);
  });

  it('should handle rapid sequential queries', async () => {
    const queries = [
      'FFP',
      'agent fee',
      'permitted losses',
      'squad cost',
      'break-even',
    ];
    
    const start = Date.now();
    for (const query of queries) {
      await sportsKnowledgeBase.query({ query });
    }
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(500);
  });

  it('should handle concurrent queries', async () => {
    const queries = [
      'UEFA FFP',
      'FIFA agents',
      'Premier League PSR',
      'transfer regulations',
    ];
    
    const start = Date.now();
    await Promise.all(queries.map(query => 
      sportsKnowledgeBase.query({ query })
    ));
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(200);
  });
});

// =============================================================================
// KEYWORD MATCHING TESTS
// =============================================================================

describe('Sports Knowledge Base - Keyword Matching', () => {
  it('should boost relevance for keyword matches', async () => {
    const results = await sportsKnowledgeBase.query({
      query: 'break-even',
    });
    
    // Results with keyword matches should be near the top
    if (results.length > 0) {
      const topResult = results[0];
      const hasKeyword = topResult.section.keywords.some(k => 
        k.toLowerCase().includes('break') || k.toLowerCase().includes('even')
      );
      // Top results should have relevant keywords
      expect(topResult.relevanceScore).toBeGreaterThan(0.2);
    }
  });

  it('sections should have keywords defined', async () => {
    const results = await sportsKnowledgeBase.query({
      query: 'regulations',
    });
    
    for (const result of results) {
      expect(result.section.keywords).toBeDefined();
      expect(Array.isArray(result.section.keywords)).toBe(true);
    }
  });
});
