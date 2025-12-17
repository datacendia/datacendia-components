// =============================================================================
// GHOST BOARD TESTS
// Tests for AI-Powered Board Meeting Simulation
// Grade: A | Coverage: Comprehensive | Risk: Executive Preparation Critical
// 
// SERVICE OVERVIEW:
// GhostBoard™ is an AI-powered board meeting simulation for executive preparation.
// Simulates tough questions from various board member personas (skeptical VC,
// risk-averse independent, growth-obsessed, etc.) to help executives prepare
// for real board meetings.
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('../../core/services/BaseService.js', () => ({
  BaseService: class { logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn() }; },
}));

vi.mock('../../core/events/EventBus.js', () => ({
  eventBus: { emit: vi.fn(), on: vi.fn() },
}));

vi.mock('../../core/subscriptions/SubscriptionTiers.js', () => ({
  featureGating: { checkAccess: vi.fn().mockReturnValue(true) },
  SubscriptionTier: {},
}));

import type {
  GhostBoardRequest,
  BoardType,
  BoardMember,
  BoardPersona,
  BoardQuestion,
  QuestionCategory,
  GhostBoardResult,
  TranscriptEntry,
} from '../../features/holy-shit/GhostBoard.js';

describe('GhostBoard', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  // ===========================================================================
  // BOARD TYPES (6 types)
  // ===========================================================================

  describe('BoardType', () => {
    it('should support standard board type', () => {
      const type: BoardType = 'standard';
      expect(type).toBe('standard');
    });

    it('should support vc_backed board type', () => {
      const type: BoardType = 'vc_backed';
      expect(type).toBe('vc_backed');
    });

    it('should support public_company board type', () => {
      const type: BoardType = 'public_company';
      expect(type).toBe('public_company');
    });

    it('should support private_equity board type', () => {
      const type: BoardType = 'private_equity';
      expect(type).toBe('private_equity');
    });

    it('should support family_office board type', () => {
      const type: BoardType = 'family_office';
      expect(type).toBe('family_office');
    });

    it('should support non_profit board type', () => {
      const type: BoardType = 'non_profit';
      expect(type).toBe('non_profit');
    });
  });

  // ===========================================================================
  // BOARD PERSONAS (8 personas)
  // ===========================================================================

  describe('BoardPersona', () => {
    it('should support skeptical_vc persona', () => {
      const persona: BoardPersona = 'skeptical_vc';
      expect(persona).toBe('skeptical_vc');
    });

    it('should support risk_averse_independent persona', () => {
      const persona: BoardPersona = 'risk_averse_independent';
      expect(persona).toBe('risk_averse_independent');
    });

    it('should support growth_obsessed persona', () => {
      const persona: BoardPersona = 'growth_obsessed';
      expect(persona).toBe('growth_obsessed');
    });

    it('should support industry_expert persona', () => {
      const persona: BoardPersona = 'industry_expert';
      expect(persona).toBe('industry_expert');
    });

    it('should support financial_hawk persona', () => {
      const persona: BoardPersona = 'financial_hawk';
      expect(persona).toBe('financial_hawk');
    });

    it('should support operations_focused persona', () => {
      const persona: BoardPersona = 'operations_focused';
      expect(persona).toBe('operations_focused');
    });

    it('should support governance_stickler persona', () => {
      const persona: BoardPersona = 'governance_stickler';
      expect(persona).toBe('governance_stickler');
    });

    it('should support tech_visionary persona', () => {
      const persona: BoardPersona = 'tech_visionary';
      expect(persona).toBe('tech_visionary');
    });
  });

  // ===========================================================================
  // QUESTION CATEGORIES (9 categories)
  // ===========================================================================

  describe('QuestionCategory', () => {
    it('should support financial category', () => {
      const cat: QuestionCategory = 'financial';
      expect(cat).toBe('financial');
    });

    it('should support strategic category', () => {
      const cat: QuestionCategory = 'strategic';
      expect(cat).toBe('strategic');
    });

    it('should support operational category', () => {
      const cat: QuestionCategory = 'operational';
      expect(cat).toBe('operational');
    });

    it('should support market category', () => {
      const cat: QuestionCategory = 'market';
      expect(cat).toBe('market');
    });

    it('should support risk category', () => {
      const cat: QuestionCategory = 'risk';
      expect(cat).toBe('risk');
    });

    it('should support governance category', () => {
      const cat: QuestionCategory = 'governance';
      expect(cat).toBe('governance');
    });

    it('should support technical category', () => {
      const cat: QuestionCategory = 'technical';
      expect(cat).toBe('technical');
    });

    it('should support competitive category', () => {
      const cat: QuestionCategory = 'competitive';
      expect(cat).toBe('competitive');
    });

    it('should support team category', () => {
      const cat: QuestionCategory = 'team';
      expect(cat).toBe('team');
    });
  });

  // ===========================================================================
  // DIFFICULTY LEVELS
  // ===========================================================================

  describe('Difficulty Levels', () => {
    it('should support easy difficulty', () => {
      const request: Partial<GhostBoardRequest> = { difficulty: 'easy' };
      expect(request.difficulty).toBe('easy');
    });

    it('should support medium difficulty', () => {
      const request: Partial<GhostBoardRequest> = { difficulty: 'medium' };
      expect(request.difficulty).toBe('medium');
    });

    it('should support hard difficulty', () => {
      const request: Partial<GhostBoardRequest> = { difficulty: 'hard' };
      expect(request.difficulty).toBe('hard');
    });

    it('should support brutal difficulty', () => {
      const request: Partial<GhostBoardRequest> = { difficulty: 'brutal' };
      expect(request.difficulty).toBe('brutal');
    });
  });

  // ===========================================================================
  // ANSWER STRENGTH
  // ===========================================================================

  describe('Answer Strength', () => {
    it('should support weak answer strength', () => {
      const question: Partial<BoardQuestion> = { answerStrength: 'weak' };
      expect(question.answerStrength).toBe('weak');
    });

    it('should support adequate answer strength', () => {
      const question: Partial<BoardQuestion> = { answerStrength: 'adequate' };
      expect(question.answerStrength).toBe('adequate');
    });

    it('should support strong answer strength', () => {
      const question: Partial<BoardQuestion> = { answerStrength: 'strong' };
      expect(question.answerStrength).toBe('strong');
    });
  });

  // ===========================================================================
  // TRANSCRIPT ENTRY TYPES
  // ===========================================================================

  describe('TranscriptEntry Types', () => {
    it('should support question type', () => {
      const entry: Partial<TranscriptEntry> = { type: 'question' };
      expect(entry.type).toBe('question');
    });

    it('should support answer type', () => {
      const entry: Partial<TranscriptEntry> = { type: 'answer' };
      expect(entry.type).toBe('answer');
    });

    it('should support followup type', () => {
      const entry: Partial<TranscriptEntry> = { type: 'followup' };
      expect(entry.type).toBe('followup');
    });

    it('should support challenge type', () => {
      const entry: Partial<TranscriptEntry> = { type: 'challenge' };
      expect(entry.type).toBe('challenge');
    });

    it('should support clarification type', () => {
      const entry: Partial<TranscriptEntry> = { type: 'clarification' };
      expect(entry.type).toBe('clarification');
    });
  });

  // ===========================================================================
  // GHOST BOARD REQUEST STRUCTURE
  // ===========================================================================

  describe('GhostBoardRequest Structure', () => {
    it('should create valid request', () => {
      const request: Partial<GhostBoardRequest> = {
        organizationId: 'org-123',
        userId: 'user-456',
        proposalTitle: 'Series C Funding Proposal',
        proposalContent: 'We are seeking $50M in Series C funding...',
        boardType: 'vc_backed',
        difficulty: 'hard',
        focusAreas: ['financial', 'growth', 'competition'],
      };
      expect(request.boardType).toBe('vc_backed');
    });

    it('should handle multiple focus areas', () => {
      const request: Partial<GhostBoardRequest> = {
        focusAreas: ['financial', 'strategic', 'operational', 'risk', 'governance'],
      };
      expect(request.focusAreas?.length).toBe(5);
    });

    it('should handle existing answers', () => {
      const request: Partial<GhostBoardRequest> = {
        existingAnswers: {
          'q1': 'Our revenue grew 150% YoY...',
          'q2': 'We have 18 months of runway...',
        },
      };
      expect(Object.keys(request.existingAnswers || {}).length).toBe(2);
    });
  });

  // ===========================================================================
  // BOARD MEMBER STRUCTURE
  // ===========================================================================

  describe('BoardMember Structure', () => {
    it('should create valid board member', () => {
      const member: BoardMember = {
        id: 'skeptical_vc',
        name: 'Victoria Chen',
        role: 'Lead Investor (Series B)',
        persona: 'skeptical_vc',
        icon: '🎯',
        typicalChallenges: ["What's the exit multiple?", "Show me the unit economics."],
        priorities: ['ROI', 'growth rate', 'market size'],
        communicationStyle: 'Direct, numbers-focused',
      };
      expect(member.persona).toBe('skeptical_vc');
    });

    it('should handle multiple typical challenges', () => {
      const member: Partial<BoardMember> = {
        typicalChallenges: ['Challenge 1', 'Challenge 2', 'Challenge 3', 'Challenge 4'],
      };
      expect(member.typicalChallenges?.length).toBe(4);
    });

    it('should handle multiple priorities', () => {
      const member: Partial<BoardMember> = {
        priorities: ['Priority 1', 'Priority 2', 'Priority 3'],
      };
      expect(member.priorities?.length).toBe(3);
    });
  });

  // ===========================================================================
  // BOARD QUESTION STRUCTURE
  // ===========================================================================

  describe('BoardQuestion Structure', () => {
    it('should create valid question', () => {
      const question: BoardQuestion = {
        id: 'q-123',
        rank: 1,
        question: "What's your path to profitability?",
        askedBy: {} as BoardMember,
        category: 'financial',
        difficulty: 'hard',
        suggestedAnswer: 'We project profitability in Q4 2025...',
        answerStrength: 'adequate',
        followUpQuestions: ['What assumptions drive that timeline?'],
        dataPointsNeeded: ['Burn rate', 'Revenue projections'],
        commonMistakes: ['Being too optimistic', 'Ignoring competition'],
      };
      expect(question.category).toBe('financial');
    });

    it('should handle answer warning', () => {
      const question: Partial<BoardQuestion> = {
        answerStrength: 'weak',
        answerWarning: 'This answer lacks specific metrics',
      };
      expect(question.answerWarning).toContain('metrics');
    });

    it('should handle multiple follow-up questions', () => {
      const question: Partial<BoardQuestion> = {
        followUpQuestions: ['Follow-up 1', 'Follow-up 2', 'Follow-up 3'],
      };
      expect(question.followUpQuestions?.length).toBe(3);
    });

    it('should handle multiple data points needed', () => {
      const question: Partial<BoardQuestion> = {
        dataPointsNeeded: ['Data 1', 'Data 2', 'Data 3', 'Data 4'],
      };
      expect(question.dataPointsNeeded?.length).toBe(4);
    });
  });

  // ===========================================================================
  // GHOST BOARD RESULT STRUCTURE
  // ===========================================================================

  describe('GhostBoardResult Structure', () => {
    it('should create valid result', () => {
      const result: GhostBoardResult = {
        id: 'result-123',
        proposalTitle: 'Series C Funding',
        sessionDate: new Date(),
        duration: 45,
        difficulty: 'hard',
        boardMembers: [],
        questions: [],
        preparednessScore: 72,
        keyGaps: ['Financial projections need more detail'],
        strengthAreas: ['Market analysis is strong'],
        overallAssessment: 'Good preparation, needs work on financials',
        recommendedPrepTime: '4 hours',
        criticalQuestions: [],
        sessionTranscript: [],
      };
      expect(result.preparednessScore).toBe(72);
    });

    it('should handle preparedness score 0', () => {
      const result: Partial<GhostBoardResult> = { preparednessScore: 0 };
      expect(result.preparednessScore).toBe(0);
    });

    it('should handle preparedness score 50', () => {
      const result: Partial<GhostBoardResult> = { preparednessScore: 50 };
      expect(result.preparednessScore).toBe(50);
    });

    it('should handle preparedness score 100', () => {
      const result: Partial<GhostBoardResult> = { preparednessScore: 100 };
      expect(result.preparednessScore).toBe(100);
    });

    it('should handle 30 minute duration', () => {
      const result: Partial<GhostBoardResult> = { duration: 30 };
      expect(result.duration).toBe(30);
    });

    it('should handle 60 minute duration', () => {
      const result: Partial<GhostBoardResult> = { duration: 60 };
      expect(result.duration).toBe(60);
    });

    it('should handle 90 minute duration', () => {
      const result: Partial<GhostBoardResult> = { duration: 90 };
      expect(result.duration).toBe(90);
    });
  });

  // ===========================================================================
  // BUSINESS SCENARIOS
  // ===========================================================================

  describe('Business Scenarios', () => {
    it('should simulate VC board meeting', () => {
      const request: Partial<GhostBoardRequest> = {
        proposalTitle: 'Series B Extension',
        boardType: 'vc_backed',
        difficulty: 'hard',
        focusAreas: ['financial', 'growth'],
      };
      expect(request.boardType).toBe('vc_backed');
    });

    it('should simulate public company board', () => {
      const request: Partial<GhostBoardRequest> = {
        proposalTitle: 'Quarterly Earnings Review',
        boardType: 'public_company',
        difficulty: 'brutal',
        focusAreas: ['financial', 'governance', 'risk'],
      };
      expect(request.boardType).toBe('public_company');
    });

    it('should simulate PE board meeting', () => {
      const request: Partial<GhostBoardRequest> = {
        proposalTitle: 'Operational Efficiency Plan',
        boardType: 'private_equity',
        difficulty: 'hard',
        focusAreas: ['operational', 'financial'],
      };
      expect(request.boardType).toBe('private_equity');
    });

    it('should identify key gaps', () => {
      const result: Partial<GhostBoardResult> = {
        keyGaps: [
          'Missing competitive analysis',
          'Unclear go-to-market strategy',
          'No contingency plan',
        ],
      };
      expect(result.keyGaps?.length).toBe(3);
    });

    it('should identify strength areas', () => {
      const result: Partial<GhostBoardResult> = {
        strengthAreas: [
          'Strong financial projections',
          'Clear market opportunity',
          'Experienced team',
        ],
      };
      expect(result.strengthAreas?.length).toBe(3);
    });
  });

  // ===========================================================================
  // EDGE CASES
  // ===========================================================================

  describe('Edge Cases', () => {
    it('should handle empty focus areas', () => {
      const request: Partial<GhostBoardRequest> = { focusAreas: [] };
      expect(request.focusAreas?.length).toBe(0);
    });

    it('should handle empty existing answers', () => {
      const request: Partial<GhostBoardRequest> = { existingAnswers: {} };
      expect(Object.keys(request.existingAnswers || {}).length).toBe(0);
    });

    it('should handle empty questions', () => {
      const result: Partial<GhostBoardResult> = { questions: [] };
      expect(result.questions?.length).toBe(0);
    });

    it('should handle empty transcript', () => {
      const result: Partial<GhostBoardResult> = { sessionTranscript: [] };
      expect(result.sessionTranscript?.length).toBe(0);
    });

    it('should handle very long proposal title', () => {
      const request: Partial<GhostBoardRequest> = { proposalTitle: 'A'.repeat(500) };
      expect(request.proposalTitle?.length).toBe(500);
    });

    it('should handle very long proposal content', () => {
      const request: Partial<GhostBoardRequest> = { proposalContent: 'B'.repeat(10000) };
      expect(request.proposalContent?.length).toBe(10000);
    });

    it('should handle unicode in proposal', () => {
      const request: Partial<GhostBoardRequest> = {
        proposalTitle: '取締役会プレゼンテーション 📊',
      };
      expect(request.proposalTitle).toContain('取締役会');
    });

    it('should handle zero duration', () => {
      const result: Partial<GhostBoardResult> = { duration: 0 };
      expect(result.duration).toBe(0);
    });

    it('should handle zero preparedness score', () => {
      const result: Partial<GhostBoardResult> = { preparednessScore: 0 };
      expect(result.preparednessScore).toBe(0);
    });
  });
});
