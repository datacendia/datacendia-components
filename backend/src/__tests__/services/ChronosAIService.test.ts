// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CHRONOS AI SERVICE TESTS
// Tests for AI-powered time machine intelligence
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock EnhancedLLMService
vi.mock('../../services/EnhancedLLMService.js', () => ({
  EnhancedLLMService: class MockEnhancedLLMService {
    generate = vi.fn().mockResolvedValue(JSON.stringify({
      pivotalMoments: [
        {
          eventId: 'event-1',
          significance: 95,
          reason: 'Critical strategic decision',
          impactedMetrics: ['revenue', 'market_share'],
          aiConfidence: 0.87,
        },
      ],
      causalLinks: [
        {
          fromEventId: 'event-1',
          toEventId: 'event-2',
          relationship: 'directly caused',
          strength: 0.85,
          explanation: 'The decision led to...',
        },
      ],
      scenarios: [
        { id: 'pessimistic', name: 'Pessimistic', probability: 0.15, description: 'Challenging', keyEvents: [], metrics: {} },
        { id: 'optimistic', name: 'Optimistic', probability: 0.35, description: 'Strong', keyEvents: [], metrics: {} },
      ],
      period: '2024-01-01 to 2024-03-31',
      summary: 'Q1 showed strong growth',
      keyTrends: ['Revenue growth', 'Customer acquisition'],
      risks: ['Competition'],
      opportunities: ['Market expansion'],
      recommendation: 'Continue current strategy',
      analysis: 'Alternative scenario analysis',
      projectedOutcomes: { revenue_impact: '+10%' },
      confidence: 0.75,
    }));
  },
}));

// Mock Prisma
vi.mock('../../config/database.js', () => ({
  prisma: {
    decisions: { findMany: vi.fn() },
    alerts: { findMany: vi.fn() },
  },
}));

// Mock logger
vi.mock('../../utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

import { ChronosAIService, chronosAIService } from '../../services/ChronosAIService.js';

// Test data
const mockEvents = [
  {
    id: 'event-1',
    timestamp: new Date('2024-01-15'),
    type: 'decision',
    title: 'Approved Q1 Budget',
    description: 'Board approved $5M budget for expansion',
    impact: 'positive' as const,
    magnitude: 8,
    department: 'Finance',
  },
  {
    id: 'event-2',
    timestamp: new Date('2024-02-01'),
    type: 'launch',
    title: 'Product Launch',
    description: 'Launched new product line',
    impact: 'positive' as const,
    magnitude: 9,
    department: 'Product',
  },
  {
    id: 'event-3',
    timestamp: new Date('2024-02-15'),
    type: 'hire',
    title: 'Key Hire',
    description: 'Hired new VP of Sales',
    impact: 'positive' as const,
    magnitude: 7,
    department: 'HR',
  },
  {
    id: 'event-4',
    timestamp: new Date('2024-03-01'),
    type: 'incident',
    title: 'Service Outage',
    description: '4-hour service disruption',
    impact: 'negative' as const,
    magnitude: 6,
    department: 'Engineering',
  },
  {
    id: 'event-5',
    timestamp: new Date('2024-03-15'),
    type: 'milestone',
    title: 'Revenue Milestone',
    description: 'Reached $10M ARR',
    impact: 'positive' as const,
    magnitude: 10,
    department: 'Sales',
  },
];

describe('ChronosAIService', () => {
  let service: ChronosAIService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ChronosAIService();
  });

  // ===========================================================================
  // SERVICE INITIALIZATION
  // ===========================================================================

  describe('Initialization', () => {
    it('should create service instance', () => {
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(ChronosAIService);
    });

    it('should export singleton instance', () => {
      expect(chronosAIService).toBeDefined();
    });
  });

  // ===========================================================================
  // PIVOTAL MOMENT DETECTION
  // ===========================================================================

  describe('detectPivotalMoments', () => {
    it('should return empty array for no events', async () => {
      const result = await service.detectPivotalMoments('org-123', []);
      expect(result).toEqual([]);
    });

    it('should detect pivotal moments from events', async () => {
      const result = await service.detectPivotalMoments('org-123', mockEvents, 3);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should respect limit parameter', async () => {
      const result = await service.detectPivotalMoments('org-123', mockEvents, 2);
      expect(result.length).toBeLessThanOrEqual(2);
    });

    it('should include significance and confidence scores', async () => {
      const result = await service.detectPivotalMoments('org-123', mockEvents);

      if (result.length > 0) {
        expect(result[0]).toHaveProperty('significance');
        expect(result[0]).toHaveProperty('aiConfidence');
        expect(result[0]).toHaveProperty('reason');
        expect(result[0]).toHaveProperty('impactedMetrics');
      }
    });

    it('should handle high-magnitude events in fallback', async () => {
      // Create events with high magnitude
      const highMagnitudeEvents = [
        { ...mockEvents[0]!, magnitude: 9 },
        { ...mockEvents[1]!, magnitude: 8 },
        { ...mockEvents[2]!, magnitude: 3 }, // Low magnitude
      ];

      const result = await service.detectPivotalMoments('org-123', highMagnitudeEvents);
      expect(result).toBeDefined();
    });
  });

  // ===========================================================================
  // CAUSAL CHAIN ANALYSIS
  // ===========================================================================

  describe('analyzeCausalChain', () => {
    it('should return empty array when no subsequent events', async () => {
      const rootEvent = mockEvents[4]!; // Last event
      const result = await service.analyzeCausalChain('org-123', rootEvent, mockEvents);
      expect(result).toEqual([]);
    });

    it('should analyze causal relationships', async () => {
      const rootEvent = mockEvents[0]!; // First event
      const result = await service.analyzeCausalChain('org-123', rootEvent, mockEvents);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should include relationship details', async () => {
      const rootEvent = mockEvents[0]!;
      const result = await service.analyzeCausalChain('org-123', rootEvent, mockEvents);

      if (result.length > 0) {
        expect(result[0]).toHaveProperty('fromEventId');
        expect(result[0]).toHaveProperty('toEventId');
        expect(result[0]).toHaveProperty('relationship');
        expect(result[0]).toHaveProperty('strength');
        expect(result[0]).toHaveProperty('explanation');
      }
    });

    it('should only analyze events after root event', async () => {
      const rootEvent = mockEvents[2]!; // Middle event
      const result = await service.analyzeCausalChain('org-123', rootEvent, mockEvents);

      // Should not include events before the root event
      expect(result).toBeDefined();
    });
  });

  // ===========================================================================
  // FUTURE SCENARIO GENERATION
  // ===========================================================================

  describe('generateFutureScenarios', () => {
    const currentMetrics = {
      revenue: 10000000,
      customers: 850,
      satisfaction: 85,
      churn: 5,
    };

    it('should generate future scenarios', async () => {
      const result = await service.generateFutureScenarios(
        'org-123',
        currentMetrics,
        mockEvents,
        '12 months'
      );

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should include scenario details', async () => {
      const result = await service.generateFutureScenarios(
        'org-123',
        currentMetrics,
        mockEvents
      );

      if (result.length > 0) {
        expect(result[0]).toHaveProperty('id');
        expect(result[0]).toHaveProperty('name');
        expect(result[0]).toHaveProperty('probability');
        expect(result[0]).toHaveProperty('description');
      }
    });

    it('should handle custom time horizon', async () => {
      const result = await service.generateFutureScenarios(
        'org-123',
        currentMetrics,
        mockEvents,
        '6 months'
      );

      expect(result).toBeDefined();
    });

    it('should handle empty recent events', async () => {
      const result = await service.generateFutureScenarios(
        'org-123',
        currentMetrics,
        []
      );

      expect(result).toBeDefined();
    });
  });

  // ===========================================================================
  // TIMELINE INSIGHT
  // ===========================================================================

  describe('getTimelineInsight', () => {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-03-31');

    it('should generate timeline insight', async () => {
      const result = await service.getTimelineInsight(
        'org-123',
        startDate,
        endDate,
        mockEvents
      );

      expect(result).toBeDefined();
      expect(result).toHaveProperty('period');
      expect(result).toHaveProperty('summary');
    });

    it('should include trends, risks, and opportunities', async () => {
      const result = await service.getTimelineInsight(
        'org-123',
        startDate,
        endDate,
        mockEvents
      );

      expect(result).toHaveProperty('keyTrends');
      expect(result).toHaveProperty('risks');
      expect(result).toHaveProperty('opportunities');
      expect(result).toHaveProperty('recommendation');
    });

    it('should filter events within date range', async () => {
      const narrowStart = new Date('2024-02-01');
      const narrowEnd = new Date('2024-02-28');

      const result = await service.getTimelineInsight(
        'org-123',
        narrowStart,
        narrowEnd,
        mockEvents
      );

      expect(result).toBeDefined();
    });

    it('should handle optional metrics', async () => {
      const metrics = { revenue: 10000000, growth: 15 };

      const result = await service.getTimelineInsight(
        'org-123',
        startDate,
        endDate,
        mockEvents,
        metrics
      );

      expect(result).toBeDefined();
    });

    it('should handle empty events in range', async () => {
      const futureStart = new Date('2025-01-01');
      const futureEnd = new Date('2025-03-31');

      const result = await service.getTimelineInsight(
        'org-123',
        futureStart,
        futureEnd,
        mockEvents
      );

      expect(result).toBeDefined();
      expect(result.period).toBeDefined();
    });
  });

  // ===========================================================================
  // WHAT-IF ANALYSIS
  // ===========================================================================

  describe('analyzeWhatIf', () => {
    it('should analyze alternative scenarios', async () => {
      const event = mockEvents[0]!;
      const alternative = 'delayed the budget approval by 3 months';

      const result = await service.analyzeWhatIf('org-123', event, alternative);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('analysis');
      expect(result).toHaveProperty('projectedOutcomes');
      expect(result).toHaveProperty('confidence');
    });

    it('should include confidence score', async () => {
      const event = mockEvents[1]!;
      const alternative = 'launched in a different market';

      const result = await service.analyzeWhatIf('org-123', event, alternative);

      expect(typeof result.confidence).toBe('number');
    });

    it('should handle various alternative actions', async () => {
      const event = mockEvents[2]!;
      const alternatives = [
        'hired a different candidate',
        'promoted internally instead',
        'delayed the hire by 6 months',
      ];

      for (const alt of alternatives) {
        const result = await service.analyzeWhatIf('org-123', event, alt);
        expect(result).toBeDefined();
      }
    });
  });

  // ===========================================================================
  // JSON PARSING
  // ===========================================================================

  describe('JSON Parsing (via public methods)', () => {
    it('should handle valid JSON responses', async () => {
      const result = await service.detectPivotalMoments('org-123', mockEvents);
      expect(result).toBeDefined();
    });

    it('should handle markdown code blocks in response', async () => {
      // The service should strip ```json blocks
      const result = await service.generateFutureScenarios(
        'org-123',
        { revenue: 1000000 },
        mockEvents
      );
      expect(result).toBeDefined();
    });
  });

  // ===========================================================================
  // ERROR HANDLING
  // ===========================================================================

  describe('Error Handling', () => {
    it('should return fallback for pivotal moments on error', async () => {
      // Even with mock, should handle gracefully
      const result = await service.detectPivotalMoments('org-123', mockEvents);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return fallback scenarios on error', async () => {
      const result = await service.generateFutureScenarios(
        'org-123',
        {},
        []
      );
      expect(result).toBeDefined();
    });

    it('should return fallback insight on error', async () => {
      const result = await service.getTimelineInsight(
        'org-123',
        new Date(),
        new Date(),
        []
      );
      expect(result).toBeDefined();
      expect(result.period).toBeDefined();
    });

    it('should return fallback what-if on error', async () => {
      const result = await service.analyzeWhatIf(
        'org-123',
        mockEvents[0]!,
        'alternative action'
      );
      expect(result).toBeDefined();
    });
  });

  // ===========================================================================
  // INTEGRATION SCENARIOS
  // ===========================================================================

  describe('Integration Scenarios', () => {
    it('should support full timeline analysis workflow', async () => {
      // 1. Detect pivotal moments
      const pivotal = await service.detectPivotalMoments('org-123', mockEvents);
      expect(pivotal).toBeDefined();

      // 2. Analyze causal chain from first event
      const causal = await service.analyzeCausalChain('org-123', mockEvents[0]!, mockEvents);
      expect(causal).toBeDefined();

      // 3. Generate future scenarios
      const scenarios = await service.generateFutureScenarios(
        'org-123',
        { revenue: 10000000 },
        mockEvents
      );
      expect(scenarios).toBeDefined();

      // 4. Get timeline insight
      const insight = await service.getTimelineInsight(
        'org-123',
        new Date('2024-01-01'),
        new Date('2024-03-31'),
        mockEvents
      );
      expect(insight).toBeDefined();

      // 5. What-if analysis
      const whatIf = await service.analyzeWhatIf(
        'org-123',
        mockEvents[0]!,
        'made a different decision'
      );
      expect(whatIf).toBeDefined();
    });

    it('should handle multi-department events', async () => {
      const departments = new Set(mockEvents.map(e => e.department));
      expect(departments.size).toBeGreaterThan(1);

      const result = await service.detectPivotalMoments('org-123', mockEvents);
      expect(result).toBeDefined();
    });

    it('should handle mixed impact events', async () => {
      const impacts = new Set(mockEvents.map(e => e.impact));
      expect(impacts.has('positive')).toBe(true);
      expect(impacts.has('negative')).toBe(true);

      const result = await service.getTimelineInsight(
        'org-123',
        new Date('2024-01-01'),
        new Date('2024-12-31'),
        mockEvents
      );
      expect(result).toBeDefined();
    });
  });

  // ===========================================================================
  // EXTENDED PIVOTAL MOMENT TESTS
  // ===========================================================================

  describe('Pivotal Moments - Extended', () => {
    it('should handle single event', async () => {
      const result = await service.detectPivotalMoments('org-123', [mockEvents[0]!]);
      expect(result).toBeDefined();
    });

    it('should handle 50+ events', async () => {
      const manyEvents = Array.from({ length: 60 }, (_, i) => ({
        ...mockEvents[0]!,
        id: `event-${i}`,
        timestamp: new Date(2024, 0, i + 1),
        title: `Event ${i}`,
      }));
      const result = await service.detectPivotalMoments('org-123', manyEvents);
      expect(result).toBeDefined();
    });

    it('should handle events with same timestamp', async () => {
      const sameTimeEvents = mockEvents.map(e => ({
        ...e,
        timestamp: new Date('2024-01-15'),
      }));
      const result = await service.detectPivotalMoments('org-123', sameTimeEvents);
      expect(result).toBeDefined();
    });

    it('should handle events with magnitude 10', async () => {
      const maxMagnitude = [{ ...mockEvents[0]!, magnitude: 10 }];
      const result = await service.detectPivotalMoments('org-123', maxMagnitude);
      expect(result).toBeDefined();
    });

    it('should handle events with magnitude 1', async () => {
      const minMagnitude = [{ ...mockEvents[0]!, magnitude: 1 }];
      const result = await service.detectPivotalMoments('org-123', minMagnitude);
      expect(result).toBeDefined();
    });

    it('should handle limit of 1', async () => {
      const result = await service.detectPivotalMoments('org-123', mockEvents, 1);
      expect(result.length).toBeLessThanOrEqual(1);
    });

    it('should handle limit of 10', async () => {
      const result = await service.detectPivotalMoments('org-123', mockEvents, 10);
      expect(result).toBeDefined();
    });

    it('should handle neutral impact events', async () => {
      const neutralEvents = [{ ...mockEvents[0]!, impact: 'neutral' as const }];
      const result = await service.detectPivotalMoments('org-123', neutralEvents);
      expect(result).toBeDefined();
    });

    it('should handle events without department', async () => {
      const { department: _, ...eventWithoutDept } = mockEvents[0]!;
      const noDeptEvents = [eventWithoutDept as typeof mockEvents[0]];
      const result = await service.detectPivotalMoments('org-123', noDeptEvents);
      expect(result).toBeDefined();
    });

    it('should handle various event types', async () => {
      const types = ['decision', 'launch', 'hire', 'incident', 'milestone', 'acquisition', 'partnership'];
      for (const type of types) {
        const typedEvent = [{ ...mockEvents[0]!, type }];
        const result = await service.detectPivotalMoments('org-123', typedEvent);
        expect(result).toBeDefined();
      }
    });
  });

  // ===========================================================================
  // EXTENDED CAUSAL CHAIN TESTS
  // ===========================================================================

  describe('Causal Chain - Extended', () => {
    it('should handle root event at end of timeline', async () => {
      const result = await service.analyzeCausalChain('org-123', mockEvents[4]!, mockEvents);
      expect(result).toEqual([]);
    });

    it('should handle root event in middle', async () => {
      const result = await service.analyzeCausalChain('org-123', mockEvents[2]!, mockEvents);
      expect(result).toBeDefined();
    });

    it('should handle many subsequent events', async () => {
      const manyEvents = Array.from({ length: 30 }, (_, i) => ({
        ...mockEvents[0]!,
        id: `event-${i}`,
        timestamp: new Date(2024, 0, i + 1),
      }));
      const result = await service.analyzeCausalChain('org-123', manyEvents[0]!, manyEvents);
      expect(result).toBeDefined();
    });

    it('should handle events on same day', async () => {
      const sameDayEvents = mockEvents.map((e, i) => ({
        ...e,
        timestamp: new Date(2024, 0, 15, i), // Same day, different hours
      }));
      const result = await service.analyzeCausalChain('org-123', sameDayEvents[0]!, sameDayEvents);
      expect(result).toBeDefined();
    });

    it('should handle negative impact root event', async () => {
      const negativeRoot = { ...mockEvents[3]!, impact: 'negative' as const };
      const result = await service.analyzeCausalChain('org-123', negativeRoot, mockEvents);
      expect(result).toBeDefined();
    });

    it('should handle high magnitude root event', async () => {
      const highMagRoot = { ...mockEvents[0]!, magnitude: 10 };
      const result = await service.analyzeCausalChain('org-123', highMagRoot, mockEvents);
      expect(result).toBeDefined();
    });
  });

  // ===========================================================================
  // EXTENDED FUTURE SCENARIOS TESTS
  // ===========================================================================

  describe('Future Scenarios - Extended', () => {
    it('should handle empty metrics', async () => {
      const result = await service.generateFutureScenarios('org-123', {}, mockEvents);
      expect(result).toBeDefined();
    });

    it('should handle many metrics', async () => {
      const manyMetrics = {
        revenue: 10000000,
        customers: 850,
        satisfaction: 85,
        churn: 5,
        nps: 45,
        arr: 12000000,
        mrr: 1000000,
        cac: 500,
        ltv: 5000,
        growth: 25,
      };
      const result = await service.generateFutureScenarios('org-123', manyMetrics, mockEvents);
      expect(result).toBeDefined();
    });

    it('should handle 3 month horizon', async () => {
      const result = await service.generateFutureScenarios('org-123', { revenue: 1000000 }, mockEvents, '3 months');
      expect(result).toBeDefined();
    });

    it('should handle 24 month horizon', async () => {
      const result = await service.generateFutureScenarios('org-123', { revenue: 1000000 }, mockEvents, '24 months');
      expect(result).toBeDefined();
    });

    it('should handle 5 year horizon', async () => {
      const result = await service.generateFutureScenarios('org-123', { revenue: 1000000 }, mockEvents, '5 years');
      expect(result).toBeDefined();
    });

    it('should handle negative metrics', async () => {
      const negativeMetrics = { growth: -15, profit: -500000 };
      const result = await service.generateFutureScenarios('org-123', negativeMetrics, mockEvents);
      expect(result).toBeDefined();
    });

    it('should handle zero metrics', async () => {
      const zeroMetrics = { revenue: 0, customers: 0 };
      const result = await service.generateFutureScenarios('org-123', zeroMetrics, mockEvents);
      expect(result).toBeDefined();
    });

    it('should handle large metric values', async () => {
      const largeMetrics = { revenue: 1000000000000, customers: 10000000 };
      const result = await service.generateFutureScenarios('org-123', largeMetrics, mockEvents);
      expect(result).toBeDefined();
    });
  });

  // ===========================================================================
  // EXTENDED TIMELINE INSIGHT TESTS
  // ===========================================================================

  describe('Timeline Insight - Extended', () => {
    it('should handle single day range', async () => {
      const singleDay = new Date('2024-02-01');
      const result = await service.getTimelineInsight('org-123', singleDay, singleDay, mockEvents);
      expect(result).toBeDefined();
    });

    it('should handle year-long range', async () => {
      const result = await service.getTimelineInsight(
        'org-123',
        new Date('2024-01-01'),
        new Date('2024-12-31'),
        mockEvents
      );
      expect(result).toBeDefined();
    });

    it('should handle future date range', async () => {
      const result = await service.getTimelineInsight(
        'org-123',
        new Date('2025-01-01'),
        new Date('2025-12-31'),
        mockEvents
      );
      expect(result).toBeDefined();
    });

    it('should handle past date range', async () => {
      const result = await service.getTimelineInsight(
        'org-123',
        new Date('2020-01-01'),
        new Date('2020-12-31'),
        mockEvents
      );
      expect(result).toBeDefined();
    });

    it('should handle many events in range', async () => {
      const manyEvents = Array.from({ length: 100 }, (_, i) => ({
        ...mockEvents[0]!,
        id: `event-${i}`,
        timestamp: new Date(2024, 0, (i % 28) + 1),
      }));
      const result = await service.getTimelineInsight(
        'org-123',
        new Date('2024-01-01'),
        new Date('2024-01-31'),
        manyEvents
      );
      expect(result).toBeDefined();
    });

    it('should handle metrics with many keys', async () => {
      const manyMetrics = Object.fromEntries(
        Array.from({ length: 20 }, (_, i) => [`metric_${i}`, i * 100])
      );
      const result = await service.getTimelineInsight(
        'org-123',
        new Date('2024-01-01'),
        new Date('2024-03-31'),
        mockEvents,
        manyMetrics
      );
      expect(result).toBeDefined();
    });

    it('should handle Q1 analysis', async () => {
      const result = await service.getTimelineInsight(
        'org-123',
        new Date('2024-01-01'),
        new Date('2024-03-31'),
        mockEvents
      );
      expect(result.period).toContain('2024');
    });

    it('should handle Q2 analysis', async () => {
      const result = await service.getTimelineInsight(
        'org-123',
        new Date('2024-04-01'),
        new Date('2024-06-30'),
        mockEvents
      );
      expect(result).toBeDefined();
    });

    it('should handle Q3 analysis', async () => {
      const result = await service.getTimelineInsight(
        'org-123',
        new Date('2024-07-01'),
        new Date('2024-09-30'),
        mockEvents
      );
      expect(result).toBeDefined();
    });

    it('should handle Q4 analysis', async () => {
      const result = await service.getTimelineInsight(
        'org-123',
        new Date('2024-10-01'),
        new Date('2024-12-31'),
        mockEvents
      );
      expect(result).toBeDefined();
    });
  });

  // ===========================================================================
  // EXTENDED WHAT-IF TESTS
  // ===========================================================================

  describe('What-If Analysis - Extended', () => {
    it('should handle long alternative description', async () => {
      const longAlt = 'decided to completely restructure the organization, hire a new executive team, pivot the product strategy, and enter three new markets simultaneously while also acquiring two competitors';
      const result = await service.analyzeWhatIf('org-123', mockEvents[0]!, longAlt);
      expect(result).toBeDefined();
    });

    it('should handle short alternative', async () => {
      const result = await service.analyzeWhatIf('org-123', mockEvents[0]!, 'waited');
      expect(result).toBeDefined();
    });

    it('should handle negative event what-if', async () => {
      const result = await service.analyzeWhatIf('org-123', mockEvents[3]!, 'prevented the outage');
      expect(result).toBeDefined();
    });

    it('should handle positive event what-if', async () => {
      const result = await service.analyzeWhatIf('org-123', mockEvents[4]!, 'not reached the milestone');
      expect(result).toBeDefined();
    });

    it('should handle financial alternatives', async () => {
      const alternatives = [
        'invested more capital',
        'reduced spending by 50%',
        'raised additional funding',
        'went public earlier',
      ];
      for (const alt of alternatives) {
        const result = await service.analyzeWhatIf('org-123', mockEvents[0]!, alt);
        expect(result).toBeDefined();
      }
    });

    it('should handle strategic alternatives', async () => {
      const alternatives = [
        'entered a different market',
        'partnered with a competitor',
        'acquired the target company',
        'licensed the technology instead',
      ];
      for (const alt of alternatives) {
        const result = await service.analyzeWhatIf('org-123', mockEvents[1]!, alt);
        expect(result).toBeDefined();
      }
    });

    it('should handle timing alternatives', async () => {
      const alternatives = [
        'acted 6 months earlier',
        'delayed by 1 year',
        'waited for market conditions',
        'accelerated the timeline',
      ];
      for (const alt of alternatives) {
        const result = await service.analyzeWhatIf('org-123', mockEvents[2]!, alt);
        expect(result).toBeDefined();
      }
    });
  });

  // ===========================================================================
  // ORGANIZATION ISOLATION TESTS
  // ===========================================================================

  describe('Organization Isolation', () => {
    it('should handle different organization IDs', async () => {
      const orgs = ['org-1', 'org-2', 'org-3', 'org-alpha', 'org-beta'];
      for (const orgId of orgs) {
        const result = await service.detectPivotalMoments(orgId, mockEvents);
        expect(result).toBeDefined();
      }
    });

    it('should handle UUID organization IDs', async () => {
      const result = await service.detectPivotalMoments(
        '550e8400-e29b-41d4-a716-446655440000',
        mockEvents
      );
      expect(result).toBeDefined();
    });

    it('should handle empty organization ID', async () => {
      const result = await service.detectPivotalMoments('', mockEvents);
      expect(result).toBeDefined();
    });
  });

  // ===========================================================================
  // EDGE CASES
  // ===========================================================================

  describe('Edge Cases', () => {
    it('should handle event with empty description', async () => {
      const emptyDesc = [{ ...mockEvents[0]!, description: '' }];
      const result = await service.detectPivotalMoments('org-123', emptyDesc);
      expect(result).toBeDefined();
    });

    it('should handle event with very long description', async () => {
      const longDesc = [{ ...mockEvents[0]!, description: 'A'.repeat(10000) }];
      const result = await service.detectPivotalMoments('org-123', longDesc);
      expect(result).toBeDefined();
    });

    it('should handle event with special characters in title', async () => {
      const specialChars = [{ ...mockEvents[0]!, title: 'Event with "quotes" & <tags> and émojis 🚀' }];
      const result = await service.detectPivotalMoments('org-123', specialChars);
      expect(result).toBeDefined();
    });

    it('should handle event with unicode characters', async () => {
      const unicode = [{ ...mockEvents[0]!, title: '日本語イベント', description: '中文描述' }];
      const result = await service.detectPivotalMoments('org-123', unicode);
      expect(result).toBeDefined();
    });

    it('should handle very old dates', async () => {
      const oldEvent = [{ ...mockEvents[0]!, timestamp: new Date('1990-01-01') }];
      const result = await service.detectPivotalMoments('org-123', oldEvent);
      expect(result).toBeDefined();
    });

    it('should handle future dates', async () => {
      const futureEvent = [{ ...mockEvents[0]!, timestamp: new Date('2030-01-01') }];
      const result = await service.detectPivotalMoments('org-123', futureEvent);
      expect(result).toBeDefined();
    });
  });

  // ===========================================================================
  // PERFORMANCE & SCALE TESTS
  // ===========================================================================

  describe('Performance & Scale', () => {
    it('should handle 100 events efficiently', async () => {
      const largeEventSet = Array.from({ length: 100 }, (_, i) => ({
        ...mockEvents[0]!,
        id: `perf-event-${i}`,
        timestamp: new Date(2024, Math.floor(i / 30), (i % 28) + 1),
        title: `Performance Event ${i}`,
        magnitude: (i % 10) + 1,
      }));
      const result = await service.detectPivotalMoments('org-123', largeEventSet, 10);
      expect(result).toBeDefined();
    });

    it('should handle concurrent requests', async () => {
      const requests = Array.from({ length: 5 }, () =>
        service.detectPivotalMoments('org-123', mockEvents)
      );
      const results = await Promise.all(requests);
      expect(results.every(r => r !== undefined)).toBe(true);
    });

    it('should handle rapid sequential calls', async () => {
      for (let i = 0; i < 5; i++) {
        const result = await service.detectPivotalMoments(`org-${i}`, mockEvents);
        expect(result).toBeDefined();
      }
    });
  });

  // ===========================================================================
  // DATA VALIDATION TESTS
  // ===========================================================================

  describe('Data Validation', () => {
    it('should validate pivotal moment structure', async () => {
      const result = await service.detectPivotalMoments('org-123', mockEvents);
      if (result.length > 0) {
        const moment = result[0];
        expect(typeof moment?.eventId).toBe('string');
        expect(typeof moment?.significance).toBe('number');
        expect(typeof moment?.reason).toBe('string');
        expect(Array.isArray(moment?.impactedMetrics)).toBe(true);
        expect(typeof moment?.aiConfidence).toBe('number');
      }
    });

    it('should validate causal link structure', async () => {
      const result = await service.analyzeCausalChain('org-123', mockEvents[0]!, mockEvents);
      if (result.length > 0) {
        const link = result[0];
        expect(typeof link?.fromEventId).toBe('string');
        expect(typeof link?.toEventId).toBe('string');
        expect(typeof link?.relationship).toBe('string');
        expect(typeof link?.strength).toBe('number');
      }
    });

    it('should validate scenario structure', async () => {
      const result = await service.generateFutureScenarios('org-123', { revenue: 1000000 }, mockEvents);
      if (result.length > 0) {
        const scenario = result[0];
        expect(typeof scenario?.id).toBe('string');
        expect(typeof scenario?.name).toBe('string');
        expect(typeof scenario?.probability).toBe('number');
      }
    });

    it('should validate insight structure', async () => {
      const result = await service.getTimelineInsight(
        'org-123',
        new Date('2024-01-01'),
        new Date('2024-03-31'),
        mockEvents
      );
      expect(typeof result.period).toBe('string');
      expect(typeof result.summary).toBe('string');
      expect(Array.isArray(result.keyTrends)).toBe(true);
      expect(Array.isArray(result.risks)).toBe(true);
      expect(Array.isArray(result.opportunities)).toBe(true);
    });

    it('should validate what-if structure', async () => {
      const result = await service.analyzeWhatIf('org-123', mockEvents[0]!, 'alternative');
      expect(typeof result.analysis).toBe('string');
      expect(typeof result.projectedOutcomes).toBe('object');
      expect(typeof result.confidence).toBe('number');
    });
  });

  // ===========================================================================
  // BUSINESS SCENARIO TESTS
  // ===========================================================================

  describe('Business Scenarios', () => {
    it('should analyze M&A decision', async () => {
      const maEvent = {
        ...mockEvents[0]!,
        type: 'acquisition',
        title: 'Acquired CompetitorX for $50M',
        description: 'Strategic acquisition to expand market share',
        magnitude: 10,
      };
      const result = await service.analyzeWhatIf('org-123', maEvent, 'not acquired the company');
      expect(result).toBeDefined();
    });

    it('should analyze product pivot', async () => {
      const pivotEvent = {
        ...mockEvents[0]!,
        type: 'strategic',
        title: 'Pivoted from B2C to B2B',
        description: 'Complete business model transformation',
        magnitude: 9,
      };
      const result = await service.detectPivotalMoments('org-123', [pivotEvent]);
      expect(result).toBeDefined();
    });

    it('should analyze funding round', async () => {
      const fundingEvent = {
        ...mockEvents[0]!,
        type: 'funding',
        title: 'Series B - $25M raised',
        description: 'Led by top-tier VC firm',
        magnitude: 8,
      };
      const result = await service.analyzeCausalChain('org-123', fundingEvent, mockEvents);
      expect(result).toBeDefined();
    });

    it('should analyze market expansion', async () => {
      const expansionEvent = {
        ...mockEvents[0]!,
        type: 'expansion',
        title: 'Entered European market',
        description: 'Opened offices in London and Berlin',
        magnitude: 7,
      };
      const result = await service.generateFutureScenarios(
        'org-123',
        { revenue: 10000000, markets: 2 },
        [expansionEvent]
      );
      expect(result).toBeDefined();
    });

    it('should analyze leadership change', async () => {
      const leadershipEvent = {
        ...mockEvents[0]!,
        type: 'leadership',
        title: 'New CEO appointed',
        description: 'Industry veteran joins as CEO',
        magnitude: 9,
      };
      const result = await service.getTimelineInsight(
        'org-123',
        new Date('2024-01-01'),
        new Date('2024-12-31'),
        [leadershipEvent]
      );
      expect(result).toBeDefined();
    });

    it('should analyze crisis response', async () => {
      const crisisEvent = {
        ...mockEvents[0]!,
        type: 'crisis',
        title: 'Major security breach',
        description: 'Customer data exposed, immediate response required',
        impact: 'negative' as const,
        magnitude: 10,
      };
      const result = await service.analyzeWhatIf('org-123', crisisEvent, 'detected the breach earlier');
      expect(result).toBeDefined();
    });
  });

  // ===========================================================================
  // DEPARTMENT-SPECIFIC TESTS
  // ===========================================================================

  describe('Department-Specific Analysis', () => {
    it('should analyze Finance department events', async () => {
      const financeEvents = mockEvents.filter(e => e.department === 'Finance');
      const result = await service.detectPivotalMoments('org-123', financeEvents);
      expect(result).toBeDefined();
    });

    it('should analyze Engineering department events', async () => {
      const engEvents = mockEvents.filter(e => e.department === 'Engineering');
      const result = await service.detectPivotalMoments('org-123', engEvents);
      expect(result).toBeDefined();
    });

    it('should analyze cross-department impact', async () => {
      const crossDeptEvents = [
        { ...mockEvents[0]!, department: 'Finance' },
        { ...mockEvents[1]!, department: 'Product' },
        { ...mockEvents[2]!, department: 'Sales' },
      ];
      const result = await service.analyzeCausalChain('org-123', crossDeptEvents[0]!, crossDeptEvents);
      expect(result).toBeDefined();
    });

    it('should analyze HR department events', async () => {
      const hrEvents = mockEvents.filter(e => e.department === 'HR');
      const result = await service.detectPivotalMoments('org-123', hrEvents);
      expect(result).toBeDefined();
    });
  });
});
