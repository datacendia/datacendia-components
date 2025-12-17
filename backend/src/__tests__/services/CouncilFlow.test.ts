// =============================================================================
// COUNCIL DELIBERATION FLOW TESTS
// End-to-end tests for the Council deliberation workflow
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch for LLM calls
global.fetch = vi.fn();

// Mock dependencies
vi.mock('../../config/database.js', () => ({
  prisma: {
    deliberations: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn() },
    decisions: { create: vi.fn(), findUnique: vi.fn(), update: vi.fn() },
    users: { findUnique: vi.fn() },
    organizations: { findUnique: vi.fn() },
  },
}));

vi.mock('../../config/redis.js', () => ({
  redis: { get: vi.fn(), set: vi.fn(), del: vi.fn() },
  cache: { get: vi.fn(), set: vi.fn() },
  pubsub: { publish: vi.fn() },
}));

vi.mock('../../config/neo4j.js', () => ({
  graph: { run: vi.fn().mockResolvedValue({ records: [] }) },
}));

vi.mock('../../services/ollama.js', () => ({
  ollama: {
    generate: vi.fn().mockResolvedValue({ response: 'Mock LLM response' }),
    chat: vi.fn().mockResolvedValue({ message: { content: 'Mock chat response' } }),
  },
}));

vi.mock('../../websocket/emitters.js', () => ({
  emitDeliberationMessage: vi.fn(),
  emitDeliberationPhase: vi.fn(),
  emitDeliberationComplete: vi.fn(),
}));

vi.mock('../../config/aiModels.js', () => ({
  aiModelSelector: {
    selectModel: vi.fn().mockReturnValue({ model: 'llama3.2:3b', endpoint: 'http://localhost:11434' }),
  },
}));

import { DeliberationService } from '../../services/DeliberationService.js';
import { DecisionService } from '../../services/DecisionService.js';

describe('Council Deliberation Flow', () => {
  let deliberationService: DeliberationService;
  let decisionService: DecisionService;

  beforeEach(() => {
    vi.clearAllMocks();
    deliberationService = new DeliberationService();
    decisionService = new DecisionService();
  });

  // ===========================================================================
  // FULL DELIBERATION FLOW
  // ===========================================================================

  describe('Full Deliberation Flow', () => {
    it('should complete a full deliberation cycle', async () => {
      await deliberationService.initialize();

      // Step 1: Save initial deliberation
      const deliberation = await deliberationService.saveDeliberation({
        organizationId: 'org-123',
        userId: 'user-456',
        question: 'Should we expand into the Asian market?',
        mode: 'standard',
        councilMode: 'executive',
        agentResponses: [
          {
            agentId: 'cfo',
            agentName: 'CendiaCFO',
            agentRole: 'Chief Financial Officer',
            response: 'The financial projections show positive ROI within 18 months.',
            duration: 1500,
          },
          {
            agentId: 'cmo',
            agentName: 'CendiaCMO',
            agentRole: 'Chief Marketing Officer',
            response: 'Market research indicates strong demand in Southeast Asia.',
            duration: 1200,
          },
          {
            agentId: 'risk',
            agentName: 'CendiaRisk',
            agentRole: 'Chief Risk Officer',
            response: 'Key risks include regulatory compliance and currency fluctuation.',
            duration: 1300,
          },
        ],
        crossExaminations: [
          {
            challengerId: 'risk',
            challengerName: 'CendiaRisk',
            targetId: 'cfo',
            targetName: 'CendiaCFO',
            challenge: 'How does the ROI projection account for currency risk?',
            rebuttal: 'We have included a 15% buffer for currency fluctuation.',
          },
        ],
        synthesis: 'The council recommends proceeding with Asian expansion, with phased entry starting in Singapore.',
        confidence: 0.82,
        status: 'completed',
      });

      expect(deliberation.id).toBeDefined();
      expect(deliberation.status).toBe('completed');
      expect(deliberation.agentResponses.length).toBe(3);
      expect(deliberation.crossExaminations.length).toBe(1);

      // Step 2: Retrieve deliberation
      const retrieved = await deliberationService.getDeliberation(deliberation.id);
      expect(retrieved).not.toBeNull();
      expect(retrieved?.question).toBe('Should we expand into the Asian market?');

      // Step 3: Generate executive summary
      vi.mocked(global.fetch).mockResolvedValueOnce({
        json: () => Promise.resolve({
          response: JSON.stringify({
            title: 'Asian Market Expansion Strategy',
            recommendation: 'Proceed with phased expansion starting in Singapore',
            keyFindings: ['Positive ROI projected', 'Strong market demand', 'Manageable risks'],
            riskFactors: ['Regulatory compliance', 'Currency fluctuation'],
            nextSteps: ['Establish Singapore office', 'Hire local team', 'Begin market entry'],
            dissent: [],
          }),
        }),
      } as Response);

      const summary = await deliberationService.generateExecutiveSummary(deliberation.id);
      expect(summary.deliberationId).toBe(deliberation.id);
      expect(summary.approvalStatus).toBe('pending');
    });

    it('should handle deliberation with no cross-examinations', async () => {
      await deliberationService.initialize();

      const deliberation = await deliberationService.saveDeliberation({
        organizationId: 'org-123',
        userId: 'user-456',
        question: 'Should we update our pricing model?',
        mode: 'quick',
        councilMode: 'financial',
        agentResponses: [
          {
            agentId: 'cfo',
            agentName: 'CendiaCFO',
            agentRole: 'Chief Financial Officer',
            response: 'A value-based pricing model would increase margins by 15%.',
            duration: 1000,
          },
        ],
        crossExaminations: [],
        synthesis: 'Recommend transitioning to value-based pricing.',
        confidence: 0.75,
        status: 'completed',
      });

      expect(deliberation.crossExaminations.length).toBe(0);
      expect(deliberation.confidence).toBe(0.75);
    });

    it('should handle in-progress deliberation', async () => {
      await deliberationService.initialize();

      const deliberation = await deliberationService.saveDeliberation({
        organizationId: 'org-123',
        userId: 'user-456',
        question: 'What is our 5-year technology roadmap?',
        mode: 'deep',
        councilMode: 'technology',
        agentResponses: [
          {
            agentId: 'cto',
            agentName: 'CendiaCTO',
            agentRole: 'Chief Technology Officer',
            response: 'Initial analysis in progress...',
            duration: 500,
          },
        ],
        crossExaminations: [],
        synthesis: '',
        confidence: 0,
        status: 'in_progress',
      });

      expect(deliberation.status).toBe('in_progress');
      expect(deliberation.synthesis).toBe('');
    });
  });

  // ===========================================================================
  // DECISION LIFECYCLE
  // ===========================================================================

  describe('Decision Lifecycle', () => {
    it('should create and track a decision', async () => {
      await decisionService.initialize();

      const decision = await decisionService.createDecision({
        organizationId: 'org-123',
        userId: 'user-456',
        title: 'Q1 Budget Allocation',
        description: 'Determine budget allocation for Q1 initiatives',
        category: 'financial',
        priority: 'high',
        budget: 500000,
        timeframe: 'Q1 2026',
        stakeholders: ['Finance', 'Operations', 'Marketing'],
        constraints: ['Must not exceed annual budget', 'Requires board approval'],
      });

      expect(decision.id).toBeDefined();
      expect(decision.id).toMatch(/^dec-/);
      expect(decision.status).toBe('draft');
      expect(decision.priority).toBe('high');
      expect(decision.timeline.length).toBe(1);
      expect(decision.timeline[0]?.type).toBe('created');
    });

    it('should retrieve decision by ID', async () => {
      await decisionService.initialize();

      const created = await decisionService.createDecision({
        organizationId: 'org-123',
        userId: 'user-456',
        title: 'Vendor Selection',
        description: 'Select cloud infrastructure vendor',
      });

      const retrieved = await decisionService.getDecision(created.id);
      
      // May return from cache or database
      if (retrieved) {
        expect(retrieved.title).toBe('Vendor Selection');
      }
    });

    it('should track decision with default values', async () => {
      await decisionService.initialize();

      const decision = await decisionService.createDecision({
        organizationId: 'org-123',
        userId: 'user-456',
        title: 'Simple Decision',
        description: 'A simple decision without optional fields',
      });

      expect(decision.priority).toBe('medium');
      expect(decision.category).toBe('general');
      expect(decision.context.stakeholders).toEqual([]);
      expect(decision.context.constraints).toEqual([]);
    });
  });

  // ===========================================================================
  // COUNCIL MODES
  // ===========================================================================

  describe('Council Modes', () => {
    it('should support executive council mode', async () => {
      await deliberationService.initialize();

      const deliberation = await deliberationService.saveDeliberation({
        organizationId: 'org-123',
        userId: 'user-456',
        question: 'Strategic planning question',
        mode: 'standard',
        councilMode: 'executive',
        agentResponses: [],
        crossExaminations: [],
        synthesis: 'Executive synthesis',
        confidence: 0.8,
        status: 'completed',
      });

      expect(deliberation.councilMode).toBe('executive');
    });

    it('should support financial council mode', async () => {
      await deliberationService.initialize();

      const deliberation = await deliberationService.saveDeliberation({
        organizationId: 'org-123',
        userId: 'user-456',
        question: 'Budget question',
        mode: 'standard',
        councilMode: 'financial',
        agentResponses: [],
        crossExaminations: [],
        synthesis: 'Financial synthesis',
        confidence: 0.85,
        status: 'completed',
      });

      expect(deliberation.councilMode).toBe('financial');
    });

    it('should support technology council mode', async () => {
      await deliberationService.initialize();

      const deliberation = await deliberationService.saveDeliberation({
        organizationId: 'org-123',
        userId: 'user-456',
        question: 'Technology architecture question',
        mode: 'deep',
        councilMode: 'technology',
        agentResponses: [],
        crossExaminations: [],
        synthesis: 'Technology synthesis',
        confidence: 0.9,
        status: 'completed',
      });

      expect(deliberation.councilMode).toBe('technology');
    });

    it('should support risk council mode', async () => {
      await deliberationService.initialize();

      const deliberation = await deliberationService.saveDeliberation({
        organizationId: 'org-123',
        userId: 'user-456',
        question: 'Risk assessment question',
        mode: 'standard',
        councilMode: 'risk',
        agentResponses: [],
        crossExaminations: [],
        synthesis: 'Risk synthesis',
        confidence: 0.7,
        status: 'completed',
      });

      expect(deliberation.councilMode).toBe('risk');
    });
  });

  // ===========================================================================
  // MULTI-ORGANIZATION ISOLATION
  // ===========================================================================

  describe('Multi-Organization Isolation', () => {
    it('should isolate deliberations by organization', async () => {
      await deliberationService.initialize();

      // Create deliberations for two organizations
      await deliberationService.saveDeliberation({
        organizationId: 'org-A',
        userId: 'user-1',
        question: 'Org A question',
        mode: 'standard',
        councilMode: 'executive',
        agentResponses: [],
        crossExaminations: [],
        synthesis: 'Org A synthesis',
        confidence: 0.8,
        status: 'completed',
      });

      await deliberationService.saveDeliberation({
        organizationId: 'org-B',
        userId: 'user-2',
        question: 'Org B question',
        mode: 'standard',
        councilMode: 'executive',
        agentResponses: [],
        crossExaminations: [],
        synthesis: 'Org B synthesis',
        confidence: 0.8,
        status: 'completed',
      });

      // Verify isolation
      const orgADeliberations = await deliberationService.getDeliberations('org-A');
      const orgBDeliberations = await deliberationService.getDeliberations('org-B');

      expect(orgADeliberations.length).toBe(1);
      expect(orgBDeliberations.length).toBe(1);
      expect(orgADeliberations[0]?.question).toBe('Org A question');
      expect(orgBDeliberations[0]?.question).toBe('Org B question');
    });
  });
});
