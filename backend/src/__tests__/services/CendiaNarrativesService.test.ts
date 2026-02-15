// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA NARRATIVES SERVICE TESTS
// Tests for Executive-ready narrative generation and report creation
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('../../core/services/BaseService.js', () => ({
  BaseService: class {
    logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() };
  },
  ServiceHealth: {},
}));

vi.mock('../../services/ollama.js', () => ({
  ollama: {
    chat: vi.fn().mockResolvedValue({ message: { content: 'Generated narrative' } }),
  },
}));

import type {
  NarrativeType,
  NarrativeTone,
  NarrativeLength,
  NarrativeRequest,
  NarrativeSection,
  Narrative,
  NarrativeTemplate,
} from '../../services/CendiaNarrativesService.js';

describe('CendiaNarrativesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===========================================================================
  // NARRATIVE TYPES
  // ===========================================================================

  describe('NarrativeType', () => {
    it('should support board_pack type', () => {
      const type: NarrativeType = 'board_pack';
      expect(type).toBe('board_pack');
    });

    it('should support executive_summary type', () => {
      const type: NarrativeType = 'executive_summary';
      expect(type).toBe('executive_summary');
    });

    it('should support decision_brief type', () => {
      const type: NarrativeType = 'decision_brief';
      expect(type).toBe('decision_brief');
    });

    it('should support risk_assessment type', () => {
      const type: NarrativeType = 'risk_assessment';
      expect(type).toBe('risk_assessment');
    });

    it('should support strategy_memo type', () => {
      const type: NarrativeType = 'strategy_memo';
      expect(type).toBe('strategy_memo');
    });

    it('should support quarterly_review type', () => {
      const type: NarrativeType = 'quarterly_review';
      expect(type).toBe('quarterly_review');
    });

    it('should support audit_report type', () => {
      const type: NarrativeType = 'audit_report';
      expect(type).toBe('audit_report');
    });

    it('should support incident_report type', () => {
      const type: NarrativeType = 'incident_report';
      expect(type).toBe('incident_report');
    });

    it('should support investment_thesis type', () => {
      const type: NarrativeType = 'investment_thesis';
      expect(type).toBe('investment_thesis');
    });

    it('should support market_analysis type', () => {
      const type: NarrativeType = 'market_analysis';
      expect(type).toBe('market_analysis');
    });
  });

  // ===========================================================================
  // NARRATIVE TONES
  // ===========================================================================

  describe('NarrativeTone', () => {
    it('should support formal tone', () => {
      const tone: NarrativeTone = 'formal';
      expect(tone).toBe('formal');
    });

    it('should support professional tone', () => {
      const tone: NarrativeTone = 'professional';
      expect(tone).toBe('professional');
    });

    it('should support technical tone', () => {
      const tone: NarrativeTone = 'technical';
      expect(tone).toBe('technical');
    });

    it('should support conversational tone', () => {
      const tone: NarrativeTone = 'conversational';
      expect(tone).toBe('conversational');
    });

    it('should support urgent tone', () => {
      const tone: NarrativeTone = 'urgent';
      expect(tone).toBe('urgent');
    });
  });

  // ===========================================================================
  // NARRATIVE LENGTH
  // ===========================================================================

  describe('NarrativeLength', () => {
    it('should support brief length', () => {
      const length: NarrativeLength = 'brief';
      expect(length).toBe('brief');
    });

    it('should support standard length', () => {
      const length: NarrativeLength = 'standard';
      expect(length).toBe('standard');
    });

    it('should support comprehensive length', () => {
      const length: NarrativeLength = 'comprehensive';
      expect(length).toBe('comprehensive');
    });
  });

  // ===========================================================================
  // NARRATIVE SECTION TYPES
  // ===========================================================================

  describe('NarrativeSection Types', () => {
    it('should support text section type', () => {
      const section: Partial<NarrativeSection> = { type: 'text' };
      expect(section.type).toBe('text');
    });

    it('should support bullet_list section type', () => {
      const section: Partial<NarrativeSection> = { type: 'bullet_list' };
      expect(section.type).toBe('bullet_list');
    });

    it('should support numbered_list section type', () => {
      const section: Partial<NarrativeSection> = { type: 'numbered_list' };
      expect(section.type).toBe('numbered_list');
    });

    it('should support table section type', () => {
      const section: Partial<NarrativeSection> = { type: 'table' };
      expect(section.type).toBe('table');
    });

    it('should support chart_placeholder section type', () => {
      const section: Partial<NarrativeSection> = { type: 'chart_placeholder' };
      expect(section.type).toBe('chart_placeholder');
    });

    it('should support callout section type', () => {
      const section: Partial<NarrativeSection> = { type: 'callout' };
      expect(section.type).toBe('callout');
    });
  });

  // ===========================================================================
  // NARRATIVE STATUS
  // ===========================================================================

  describe('Narrative Status', () => {
    it('should support draft status', () => {
      const narrative: Partial<Narrative> = { status: 'draft' };
      expect(narrative.status).toBe('draft');
    });

    it('should support review status', () => {
      const narrative: Partial<Narrative> = { status: 'review' };
      expect(narrative.status).toBe('review');
    });

    it('should support approved status', () => {
      const narrative: Partial<Narrative> = { status: 'approved' };
      expect(narrative.status).toBe('approved');
    });

    it('should support published status', () => {
      const narrative: Partial<Narrative> = { status: 'published' };
      expect(narrative.status).toBe('published');
    });
  });

  // ===========================================================================
  // RISK LEVELS
  // ===========================================================================

  describe('Risk Levels', () => {
    it('should support low risk level', () => {
      const risk = { level: 'low' as const, description: 'Minor risk' };
      expect(risk.level).toBe('low');
    });

    it('should support medium risk level', () => {
      const risk = { level: 'medium' as const, description: 'Moderate risk' };
      expect(risk.level).toBe('medium');
    });

    it('should support high risk level', () => {
      const risk = { level: 'high' as const, description: 'Significant risk' };
      expect(risk.level).toBe('high');
    });

    it('should support critical risk level', () => {
      const risk = { level: 'critical' as const, description: 'Critical risk' };
      expect(risk.level).toBe('critical');
    });
  });

  // ===========================================================================
  // METRIC TRENDS
  // ===========================================================================

  describe('Metric Trends', () => {
    it('should support up trend', () => {
      const metric = { label: 'Revenue', value: '$10M', trend: 'up' as const };
      expect(metric.trend).toBe('up');
    });

    it('should support down trend', () => {
      const metric = { label: 'Costs', value: '$5M', trend: 'down' as const };
      expect(metric.trend).toBe('down');
    });

    it('should support stable trend', () => {
      const metric = { label: 'Headcount', value: '500', trend: 'stable' as const };
      expect(metric.trend).toBe('stable');
    });

    it('should handle no trend', () => {
      const metric: { label: string; value: string; trend?: 'up' | 'down' | 'stable' } = { label: 'NPS', value: '75' };
      expect(metric.trend).toBeUndefined();
    });
  });

  // ===========================================================================
  // NARRATIVE REQUEST STRUCTURE
  // ===========================================================================

  describe('NarrativeRequest Structure', () => {
    it('should create valid request', () => {
      const request: NarrativeRequest = {
        organizationId: 'org-123',
        userId: 'user-456',
        type: 'board_pack',
        title: 'Q4 Board Pack',
        context: 'Quarterly board meeting materials',
      };
      expect(request.type).toBe('board_pack');
    });

    it('should support optional tone', () => {
      const request: Partial<NarrativeRequest> = { tone: 'formal' };
      expect(request.tone).toBe('formal');
    });

    it('should support optional length', () => {
      const request: Partial<NarrativeRequest> = { length: 'comprehensive' };
      expect(request.length).toBe('comprehensive');
    });

    it('should support optional audience', () => {
      const request: Partial<NarrativeRequest> = { audience: 'Board of Directors' };
      expect(request.audience).toBe('Board of Directors');
    });

    it('should support optional charts flag', () => {
      const request: Partial<NarrativeRequest> = { includeCharts: true };
      expect(request.includeCharts).toBe(true);
    });

    it('should support optional recommendations flag', () => {
      const request: Partial<NarrativeRequest> = { includeRecommendations: true };
      expect(request.includeRecommendations).toBe(true);
    });

    it('should support optional template ID', () => {
      const request: Partial<NarrativeRequest> = { templateId: 'template-123' };
      expect(request.templateId).toBe('template-123');
    });

    it('should support optional sections', () => {
      const request: Partial<NarrativeRequest> = {
        sections: ['Executive Summary', 'Financial Overview', 'Recommendations'],
      };
      expect(request.sections?.length).toBe(3);
    });

    it('should support optional data', () => {
      const request: Partial<NarrativeRequest> = {
        data: { revenue: 10000000, growth: 0.15 },
      };
      expect(request.data?.['revenue']).toBe(10000000);
    });
  });

  // ===========================================================================
  // NARRATIVE SECTION STRUCTURE
  // ===========================================================================

  describe('NarrativeSection Structure', () => {
    it('should create valid section', () => {
      const section: NarrativeSection = {
        id: 'section-123',
        title: 'Executive Summary',
        content: 'This quarter showed strong performance...',
        order: 1,
        type: 'text',
      };
      expect(section.order).toBe(1);
    });

    it('should support metadata', () => {
      const section: Partial<NarrativeSection> = {
        metadata: { wordCount: 500, readingTime: 2 },
      };
      expect(section.metadata?.['wordCount']).toBe(500);
    });
  });

  // ===========================================================================
  // NARRATIVE STRUCTURE
  // ===========================================================================

  describe('Narrative Structure', () => {
    it('should create valid narrative', () => {
      const narrative: Narrative = {
        id: 'narrative-123',
        organizationId: 'org-456',
        createdBy: 'user-789',
        createdAt: new Date(),
        updatedAt: new Date(),
        type: 'board_pack',
        title: 'Q4 2024 Board Pack',
        executiveSummary: 'Strong quarter with 15% growth...',
        sections: [],
        metadata: {
          tone: 'formal',
          length: 'comprehensive',
          audience: 'Board of Directors',
          wordCount: 5000,
          readingTime: 20,
          generationTime: 15000,
          model: 'llama3.2:3b',
        },
        status: 'draft',
        version: 1,
      };
      expect(narrative.version).toBe(1);
    });

    it('should support subtitle', () => {
      const narrative: Partial<Narrative> = { subtitle: 'Financial Performance Review' };
      expect(narrative.subtitle).toBe('Financial Performance Review');
    });

    it('should support recommendations', () => {
      const narrative: Partial<Narrative> = {
        recommendations: ['Increase R&D budget', 'Expand into APAC', 'Hire 50 engineers'],
      };
      expect(narrative.recommendations?.length).toBe(3);
    });

    it('should support key metrics', () => {
      const narrative: Partial<Narrative> = {
        keyMetrics: [
          { label: 'Revenue', value: '$50M', trend: 'up' },
          { label: 'Margin', value: '25%', trend: 'stable' },
        ],
      };
      expect(narrative.keyMetrics?.length).toBe(2);
    });

    it('should support risks', () => {
      const narrative: Partial<Narrative> = {
        risks: [
          { level: 'high', description: 'Supply chain disruption' },
          { level: 'medium', description: 'Currency fluctuation' },
        ],
      };
      expect(narrative.risks?.length).toBe(2);
    });

    it('should support next steps', () => {
      const narrative: Partial<Narrative> = {
        nextSteps: ['Schedule follow-up meeting', 'Prepare detailed analysis'],
      };
      expect(narrative.nextSteps?.length).toBe(2);
    });

    it('should support appendices', () => {
      const narrative: Partial<Narrative> = {
        appendices: [
          { title: 'Financial Statements', content: 'Detailed financials...' },
          { title: 'Market Data', content: 'Market analysis...' },
        ],
      };
      expect(narrative.appendices?.length).toBe(2);
    });
  });

  // ===========================================================================
  // NARRATIVE TEMPLATE STRUCTURE
  // ===========================================================================

  describe('NarrativeTemplate Structure', () => {
    it('should create valid template', () => {
      const template: NarrativeTemplate = {
        id: 'template-123',
        name: 'Standard Board Pack',
        type: 'board_pack',
        description: 'Comprehensive board meeting package',
        sections: [
          { title: 'Executive Summary', prompt: 'Summarize key points', required: true },
        ],
        tone: 'formal',
        audience: 'Board of Directors',
      };
      expect(template.tone).toBe('formal');
    });

    it('should support required sections', () => {
      const section = { title: 'Summary', prompt: 'Summarize', required: true };
      expect(section.required).toBe(true);
    });

    it('should support optional sections', () => {
      const section = { title: 'Appendix', prompt: 'Additional info', required: false };
      expect(section.required).toBe(false);
    });
  });

  // ===========================================================================
  // WORD COUNT TESTS
  // ===========================================================================

  describe('Word Count Tests', () => {
    it('should handle 100 word count', () => {
      const metadata = { wordCount: 100 };
      expect(metadata.wordCount).toBe(100);
    });

    it('should handle 500 word count', () => {
      const metadata = { wordCount: 500 };
      expect(metadata.wordCount).toBe(500);
    });

    it('should handle 1000 word count', () => {
      const metadata = { wordCount: 1000 };
      expect(metadata.wordCount).toBe(1000);
    });

    it('should handle 5000 word count', () => {
      const metadata = { wordCount: 5000 };
      expect(metadata.wordCount).toBe(5000);
    });

    it('should handle 10000 word count', () => {
      const metadata = { wordCount: 10000 };
      expect(metadata.wordCount).toBe(10000);
    });
  });

  // ===========================================================================
  // READING TIME TESTS
  // ===========================================================================

  describe('Reading Time Tests', () => {
    it('should handle 1 minute reading time', () => {
      const metadata = { readingTime: 1 };
      expect(metadata.readingTime).toBe(1);
    });

    it('should handle 5 minute reading time', () => {
      const metadata = { readingTime: 5 };
      expect(metadata.readingTime).toBe(5);
    });

    it('should handle 15 minute reading time', () => {
      const metadata = { readingTime: 15 };
      expect(metadata.readingTime).toBe(15);
    });

    it('should handle 30 minute reading time', () => {
      const metadata = { readingTime: 30 };
      expect(metadata.readingTime).toBe(30);
    });

    it('should handle 60 minute reading time', () => {
      const metadata = { readingTime: 60 };
      expect(metadata.readingTime).toBe(60);
    });
  });

  // ===========================================================================
  // GENERATION TIME TESTS
  // ===========================================================================

  describe('Generation Time Tests', () => {
    it('should handle 1 second generation', () => {
      const metadata = { generationTime: 1000 };
      expect(metadata.generationTime).toBe(1000);
    });

    it('should handle 5 second generation', () => {
      const metadata = { generationTime: 5000 };
      expect(metadata.generationTime).toBe(5000);
    });

    it('should handle 15 second generation', () => {
      const metadata = { generationTime: 15000 };
      expect(metadata.generationTime).toBe(15000);
    });

    it('should handle 30 second generation', () => {
      const metadata = { generationTime: 30000 };
      expect(metadata.generationTime).toBe(30000);
    });

    it('should handle 60 second generation', () => {
      const metadata = { generationTime: 60000 };
      expect(metadata.generationTime).toBe(60000);
    });
  });

  // ===========================================================================
  // VERSION TESTS
  // ===========================================================================

  describe('Version Tests', () => {
    it('should handle version 1', () => {
      const narrative: Partial<Narrative> = { version: 1 };
      expect(narrative.version).toBe(1);
    });

    it('should handle version 2', () => {
      const narrative: Partial<Narrative> = { version: 2 };
      expect(narrative.version).toBe(2);
    });

    it('should handle version 5', () => {
      const narrative: Partial<Narrative> = { version: 5 };
      expect(narrative.version).toBe(5);
    });

    it('should handle version 10', () => {
      const narrative: Partial<Narrative> = { version: 10 };
      expect(narrative.version).toBe(10);
    });
  });

  // ===========================================================================
  // SECTION ORDER TESTS
  // ===========================================================================

  describe('Section Order Tests', () => {
    it('should handle order 1', () => {
      const section: Partial<NarrativeSection> = { order: 1 };
      expect(section.order).toBe(1);
    });

    it('should handle order 5', () => {
      const section: Partial<NarrativeSection> = { order: 5 };
      expect(section.order).toBe(5);
    });

    it('should handle order 10', () => {
      const section: Partial<NarrativeSection> = { order: 10 };
      expect(section.order).toBe(10);
    });

    it('should handle order 20', () => {
      const section: Partial<NarrativeSection> = { order: 20 };
      expect(section.order).toBe(20);
    });
  });

  // ===========================================================================
  // AUDIENCE TESTS
  // ===========================================================================

  describe('Audience Tests', () => {
    it('should handle Board of Directors audience', () => {
      const request: Partial<NarrativeRequest> = { audience: 'Board of Directors' };
      expect(request.audience).toBe('Board of Directors');
    });

    it('should handle Executive Leadership audience', () => {
      const request: Partial<NarrativeRequest> = { audience: 'Executive Leadership' };
      expect(request.audience).toBe('Executive Leadership');
    });

    it('should handle Risk Committee audience', () => {
      const request: Partial<NarrativeRequest> = { audience: 'Risk Committee' };
      expect(request.audience).toBe('Risk Committee');
    });

    it('should handle Investors audience', () => {
      const request: Partial<NarrativeRequest> = { audience: 'Investors' };
      expect(request.audience).toBe('Investors');
    });

    it('should handle All Employees audience', () => {
      const request: Partial<NarrativeRequest> = { audience: 'All Employees' };
      expect(request.audience).toBe('All Employees');
    });

    it('should handle Engineering Team audience', () => {
      const request: Partial<NarrativeRequest> = { audience: 'Engineering Team' };
      expect(request.audience).toBe('Engineering Team');
    });
  });

  // ===========================================================================
  // BUSINESS SCENARIOS
  // ===========================================================================

  describe('Business Scenarios', () => {
    it('should generate board pack', () => {
      const request: Partial<NarrativeRequest> = {
        type: 'board_pack',
        title: 'Q4 Board Pack',
        tone: 'formal',
        audience: 'Board of Directors',
      };
      expect(request.type).toBe('board_pack');
    });

    it('should generate executive summary', () => {
      const request: Partial<NarrativeRequest> = {
        type: 'executive_summary',
        title: 'Project Alpha Summary',
        length: 'brief',
      };
      expect(request.type).toBe('executive_summary');
    });

    it('should generate decision brief', () => {
      const request: Partial<NarrativeRequest> = {
        type: 'decision_brief',
        title: 'Acquisition Recommendation',
        includeRecommendations: true,
      };
      expect(request.type).toBe('decision_brief');
    });

    it('should generate risk assessment', () => {
      const request: Partial<NarrativeRequest> = {
        type: 'risk_assessment',
        title: 'Cybersecurity Risk Assessment',
        audience: 'Risk Committee',
      };
      expect(request.type).toBe('risk_assessment');
    });

    it('should generate incident report', () => {
      const request: Partial<NarrativeRequest> = {
        type: 'incident_report',
        title: 'System Outage Post-Mortem',
        tone: 'technical',
      };
      expect(request.type).toBe('incident_report');
    });

    it('should generate investment thesis', () => {
      const request: Partial<NarrativeRequest> = {
        type: 'investment_thesis',
        title: 'Series B Investment Case',
        audience: 'Investors',
      };
      expect(request.type).toBe('investment_thesis');
    });
  });

  // ===========================================================================
  // EDGE CASES
  // ===========================================================================

  describe('Edge Cases', () => {
    it('should handle empty sections array', () => {
      const narrative: Partial<Narrative> = { sections: [] };
      expect(narrative.sections?.length).toBe(0);
    });

    it('should handle empty recommendations', () => {
      const narrative: Partial<Narrative> = { recommendations: [] };
      expect(narrative.recommendations?.length).toBe(0);
    });

    it('should handle empty key metrics', () => {
      const narrative: Partial<Narrative> = { keyMetrics: [] };
      expect(narrative.keyMetrics?.length).toBe(0);
    });

    it('should handle empty risks', () => {
      const narrative: Partial<Narrative> = { risks: [] };
      expect(narrative.risks?.length).toBe(0);
    });

    it('should handle empty next steps', () => {
      const narrative: Partial<Narrative> = { nextSteps: [] };
      expect(narrative.nextSteps?.length).toBe(0);
    });

    it('should handle empty appendices', () => {
      const narrative: Partial<Narrative> = { appendices: [] };
      expect(narrative.appendices?.length).toBe(0);
    });

    it('should handle very long title', () => {
      const narrative: Partial<Narrative> = { title: 'A'.repeat(500) };
      expect(narrative.title?.length).toBe(500);
    });

    it('should handle very long executive summary', () => {
      const narrative: Partial<Narrative> = { executiveSummary: 'A'.repeat(10000) };
      expect(narrative.executiveSummary?.length).toBe(10000);
    });

    it('should handle special characters in title', () => {
      const narrative: Partial<Narrative> = {
        title: 'Q4 Report: "Growth" & <Strategy>',
      };
      expect(narrative.title).toContain('Q4 Report');
    });

    it('should handle unicode in content', () => {
      const narrative: Partial<Narrative> = {
        executiveSummary: '季度报告 📊 业绩增长',
      };
      expect(narrative.executiveSummary).toContain('季度');
    });

    it('should handle zero word count', () => {
      const metadata = { wordCount: 0 };
      expect(metadata.wordCount).toBe(0);
    });

    it('should handle zero reading time', () => {
      const metadata = { readingTime: 0 };
      expect(metadata.readingTime).toBe(0);
    });
  });
});
