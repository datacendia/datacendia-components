// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DELIBERATION SERVICE TESTS
// Tests for Council deliberation workflows
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch for Ollama calls
global.fetch = vi.fn();

// Mock the dependencies
vi.mock('../../config/aiModels.js', () => ({
  aiModelSelector: {
    selectModel: vi.fn().mockReturnValue({ model: 'llama3.2:3b', endpoint: 'http://localhost:11434' }),
  },
}));

// Mock prisma for database operations
const mockDeliberationsStore: Map<string, any> = new Map();

vi.mock('../../config/database.js', () => ({
  prisma: {
    deliberations: {
      findUnique: vi.fn().mockImplementation(({ where }) => {
        const found = mockDeliberationsStore.get(where.id);
        if (!found) return Promise.resolve(null);
        // Add agentResponses from context for generateExecutiveSummary compatibility
        const result = {
          ...found,
          agentResponses: found.context?.agentResponses || [],
          synthesis: found.decision || found.synthesis,
        };
        return Promise.resolve(result);
      }),
      findMany: vi.fn().mockImplementation(({ where, skip, take }: { where?: any; skip?: number; take?: number }) => {
        let results = Array.from(mockDeliberationsStore.values());
        
        // Filter by organization_id
        if (where?.organization_id) {
          results = results.filter(r => r.organization_id === where.organization_id);
        }
        
        // Filter by status
        if (where?.status) {
          results = results.filter(r => r.status === where.status);
        }
        
        // Sort by created_at desc
        results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        // Apply pagination
        if (skip) results = results.slice(skip);
        if (take) results = results.slice(0, take);
        
        return Promise.resolve(results);
      }),
      create: vi.fn().mockImplementation((data) => {
        // Store with the ID from the data
        const record = { 
          ...data.data, 
          deliberation_messages: [],
          // Map fields for getDeliberation compatibility
          question: data.data.question,
          status: data.data.status,
          mode: data.data.mode,
          context: data.data.context,
          decision: data.data.decision,
          confidence: data.data.confidence,
          created_at: data.data.created_at,
          // Store synthesis for generateExecutiveSummary
          synthesis: data.data.decision,
        };
        mockDeliberationsStore.set(data.data.id, record);
        return Promise.resolve(record);
      }),
      update: vi.fn().mockImplementation((data) => Promise.resolve(data)),
    },
    deliberation_messages: {
      findMany: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue({}),
    },
  },
}));

import { DeliberationService, AgentResponse } from '../../services/DeliberationService.js';

describe('DeliberationService', () => {
  let service: DeliberationService;

  beforeEach(() => {
    vi.clearAllMocks();
    mockDeliberationsStore.clear();
    service = new DeliberationService();
  });

  // ===========================================================================
  // INITIALIZATION
  // ===========================================================================

  describe('Initialization', () => {
    it('should initialize successfully', async () => {
      await expect(service.initialize()).resolves.not.toThrow();
    });

    it('should shutdown gracefully', async () => {
      await service.initialize();
      await expect(service.shutdown()).resolves.not.toThrow();
    });

    it('should report healthy status', async () => {
      await service.initialize();
      const health = await service.healthCheck();
      expect(health.status).toBe('healthy');
      expect(health.details).toHaveProperty('cachedDeliberations');
    });
  });

  // ===========================================================================
  // SAVE DELIBERATION
  // ===========================================================================

  describe('saveDeliberation', () => {
    const mockDeliberation = {
      organizationId: 'org-123',
      userId: 'user-456',
      question: 'Should we expand into the European market?',
      mode: 'standard',
      councilMode: 'executive',
      agentResponses: [
        {
          agentId: 'cfo',
          agentName: 'CendiaCFO',
          agentRole: 'Chief Financial Officer',
          response: 'From a financial perspective, expansion requires significant capital...',
          duration: 1500,
        },
        {
          agentId: 'cmo',
          agentName: 'CendiaCMO',
          agentRole: 'Chief Marketing Officer',
          response: 'The European market shows strong demand for our products...',
          duration: 1200,
        },
      ] as AgentResponse[],
      crossExaminations: [],
      synthesis: 'Based on the analysis, European expansion is recommended with phased approach.',
      confidence: 0.85,
      status: 'completed' as const,
    };

    it('should save a deliberation and return with ID', async () => {
      await service.initialize();
      const saved = await service.saveDeliberation(mockDeliberation);

      expect(saved.id).toBeDefined();
      expect(saved.id).toMatch(/^delib-/);
      expect(saved.createdAt).toBeInstanceOf(Date);
      expect(saved.question).toBe(mockDeliberation.question);
      expect(saved.organizationId).toBe(mockDeliberation.organizationId);
    });

    it('should store deliberation in cache', async () => {
      await service.initialize();
      const saved = await service.saveDeliberation(mockDeliberation);

      const retrieved = await service.getDeliberation(saved.id);
      expect(retrieved).not.toBeNull();
      expect(retrieved?.id).toBe(saved.id);
    });

    it('should handle multiple deliberations for same organization', async () => {
      await service.initialize();

      const saved1 = await service.saveDeliberation(mockDeliberation);
      // Small delay to ensure different timestamps for ordering
      await new Promise(resolve => setTimeout(resolve, 5));
      const saved2 = await service.saveDeliberation({
        ...mockDeliberation,
        question: 'Should we acquire CompetitorX?',
      });

      const deliberations = await service.getDeliberations('org-123');
      expect(deliberations.length).toBe(2);
      // Both deliberations should be returned (order depends on timestamp)
      const ids = deliberations.map(d => d.id);
      expect(ids).toContain(saved1.id);
      expect(ids).toContain(saved2.id);
    });
  });

  // ===========================================================================
  // GET DELIBERATIONS
  // ===========================================================================

  describe('getDeliberations', () => {
    it('should return empty array for organization with no deliberations', async () => {
      await service.initialize();
      const deliberations = await service.getDeliberations('org-nonexistent');
      expect(deliberations).toEqual([]);
    });

    it('should filter by status', async () => {
      await service.initialize();

      await service.saveDeliberation({
        organizationId: 'org-123',
        userId: 'user-456',
        question: 'Question 1',
        mode: 'standard',
        councilMode: 'executive',
        agentResponses: [],
        crossExaminations: [],
        synthesis: 'Synthesis 1',
        confidence: 0.8,
        status: 'completed',
      });

      await service.saveDeliberation({
        organizationId: 'org-123',
        userId: 'user-456',
        question: 'Question 2',
        mode: 'standard',
        councilMode: 'executive',
        agentResponses: [],
        crossExaminations: [],
        synthesis: 'Synthesis 2',
        confidence: 0.7,
        status: 'in_progress',
      });

      const completed = await service.getDeliberations('org-123', { status: 'completed' });
      expect(completed.length).toBe(1);
      // Status is stored as uppercase in database
      expect(completed[0]?.status?.toUpperCase()).toBe('COMPLETED');

      const inProgress = await service.getDeliberations('org-123', { status: 'in_progress' });
      expect(inProgress.length).toBe(1);
      // Status is stored as uppercase in database
      expect(inProgress[0]?.status?.toUpperCase()).toBe('IN_PROGRESS');
    });

    it('should respect limit and offset', async () => {
      await service.initialize();

      // Create 5 deliberations
      for (let i = 0; i < 5; i++) {
        await service.saveDeliberation({
          organizationId: 'org-123',
          userId: 'user-456',
          question: `Question ${i}`,
          mode: 'standard',
          councilMode: 'executive',
          agentResponses: [],
          crossExaminations: [],
          synthesis: `Synthesis ${i}`,
          confidence: 0.8,
          status: 'completed',
        });
      }

      const page1 = await service.getDeliberations('org-123', { limit: 2, offset: 0 });
      expect(page1.length).toBe(2);

      const page2 = await service.getDeliberations('org-123', { limit: 2, offset: 2 });
      expect(page2.length).toBe(2);

      const page3 = await service.getDeliberations('org-123', { limit: 2, offset: 4 });
      expect(page3.length).toBe(1);
    });
  });

  // ===========================================================================
  // GET SINGLE DELIBERATION
  // ===========================================================================

  describe('getDeliberation', () => {
    it('should return null for non-existent deliberation', async () => {
      await service.initialize();
      const result = await service.getDeliberation('delib-nonexistent');
      expect(result).toBeNull();
    });

    it('should find deliberation across organizations', async () => {
      await service.initialize();

      const saved = await service.saveDeliberation({
        organizationId: 'org-999',
        userId: 'user-456',
        question: 'Test question',
        mode: 'standard',
        councilMode: 'executive',
        agentResponses: [],
        crossExaminations: [],
        synthesis: 'Test synthesis',
        confidence: 0.8,
        status: 'completed',
      });

      const found = await service.getDeliberation(saved.id);
      expect(found).not.toBeNull();
      expect(found?.organizationId).toBe('org-999');
    });
  });

  // ===========================================================================
  // EXECUTIVE SUMMARY GENERATION
  // ===========================================================================

  describe('generateExecutiveSummary', () => {
    it('should throw error for non-existent deliberation', async () => {
      await service.initialize();
      await expect(service.generateExecutiveSummary('delib-nonexistent')).rejects.toThrow('Deliberation not found');
    });

    // Note: saveDeliberation now writes to both prisma AND cache for consistency

    it('should generate summary with LLM response', async () => {
      await service.initialize();

      const saved = await service.saveDeliberation({
        organizationId: 'org-123',
        userId: 'user-456',
        question: 'Should we expand into Europe?',
        mode: 'standard',
        councilMode: 'executive',
        agentResponses: [
          {
            agentId: 'cfo',
            agentName: 'CendiaCFO',
            agentRole: 'CFO',
            response: 'Financial analysis shows positive ROI.',
            duration: 1000,
          },
        ],
        crossExaminations: [],
        synthesis: 'The expansion should proceed with caution. Key risks include regulatory compliance. We recommend a phased approach.',
        confidence: 0.85,
        status: 'completed',
      });

      // Mock successful LLM response
      vi.mocked(global.fetch).mockResolvedValueOnce({
        json: () => Promise.resolve({
          response: JSON.stringify({
            title: 'European Market Expansion Analysis',
            recommendation: 'Proceed with phased expansion',
            keyFindings: ['Positive ROI projected', 'Strong market demand'],
            riskFactors: ['Regulatory compliance', 'Currency fluctuation'],
            nextSteps: ['Conduct detailed market research', 'Establish local partnerships'],
            dissent: [],
          }),
        }),
      } as Response);

      const summary = await service.generateExecutiveSummary(saved.id);

      expect(summary.deliberationId).toBe(saved.id);
      expect(summary.title).toBeDefined();
      expect(summary.recommendation).toBeDefined();
      expect(summary.keyFindings).toBeInstanceOf(Array);
      expect(summary.riskFactors).toBeInstanceOf(Array);
      expect(summary.nextSteps).toBeInstanceOf(Array);
      expect(summary.approvalStatus).toBe('pending');
    });

    it('should use fallback extraction when LLM fails', async () => {
      await service.initialize();

      const saved = await service.saveDeliberation({
        organizationId: 'org-123',
        userId: 'user-456',
        question: 'Should we expand into Europe?',
        mode: 'standard',
        councilMode: 'executive',
        agentResponses: [],
        crossExaminations: [],
        synthesis: 'The expansion poses significant risk due to regulatory challenges. We should consider a phased approach. The market shows strong potential for growth.',
        confidence: 0.75,
        status: 'completed',
      });

      // Mock LLM returning invalid JSON
      vi.mocked(global.fetch).mockResolvedValueOnce({
        json: () => Promise.resolve({
          response: 'This is not valid JSON',
        }),
      } as Response);

      const summary = await service.generateExecutiveSummary(saved.id);

      expect(summary.deliberationId).toBe(saved.id);
      expect(summary.keyFindings.length).toBeGreaterThan(0);
      expect(summary.riskFactors.length).toBeGreaterThan(0);
    });
  });
});
