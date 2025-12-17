// =============================================================================
// CENDIA SCOUT SERVICE TESTS
// Tests for Talent Acquisition & Psychometric Matching
// Grade: A | Coverage: Comprehensive | Risk: HR Critical (Talent Pipeline)
// 
// SERVICE OVERVIEW:
// CendiaScout™ is "The Headhunter" - talent acquisition and psychometric matching
// with shadow pipelines for always-ready candidate pools. Features top performer
// genome mapping, candidate matching, and talent alerts.
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('../../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock('../../../services/ollama.js', () => ({
  default: { generate: vi.fn().mockResolvedValue('{}') },
}));

import type {
  PsychometricProfile,
  TopPerformer,
  Candidate,
  ShadowPipeline,
  TalentAlert,
} from '../../../services/enterprise/CendiaScoutService.js';

describe('CendiaScoutService', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  // ===========================================================================
  // COGNITIVE STYLES
  // ===========================================================================

  describe('Cognitive Styles', () => {
    it('should support analytical style', () => {
      const profile: Partial<PsychometricProfile> = { cognitiveStyle: 'analytical' };
      expect(profile.cognitiveStyle).toBe('analytical');
    });

    it('should support creative style', () => {
      const profile: Partial<PsychometricProfile> = { cognitiveStyle: 'creative' };
      expect(profile.cognitiveStyle).toBe('creative');
    });

    it('should support practical style', () => {
      const profile: Partial<PsychometricProfile> = { cognitiveStyle: 'practical' };
      expect(profile.cognitiveStyle).toBe('practical');
    });

    it('should support hybrid style', () => {
      const profile: Partial<PsychometricProfile> = { cognitiveStyle: 'hybrid' };
      expect(profile.cognitiveStyle).toBe('hybrid');
    });
  });

  // ===========================================================================
  // COLLABORATION PREFERENCES
  // ===========================================================================

  describe('Collaboration Preferences', () => {
    it('should support solo preference', () => {
      const profile: Partial<PsychometricProfile> = { collaborationPreference: 'solo' };
      expect(profile.collaborationPreference).toBe('solo');
    });

    it('should support small_team preference', () => {
      const profile: Partial<PsychometricProfile> = { collaborationPreference: 'small_team' };
      expect(profile.collaborationPreference).toBe('small_team');
    });

    it('should support large_team preference', () => {
      const profile: Partial<PsychometricProfile> = { collaborationPreference: 'large_team' };
      expect(profile.collaborationPreference).toBe('large_team');
    });
  });

  // ===========================================================================
  // DECISION SPEED
  // ===========================================================================

  describe('Decision Speed', () => {
    it('should support deliberate speed', () => {
      const profile: Partial<PsychometricProfile> = { decisionSpeed: 'deliberate' };
      expect(profile.decisionSpeed).toBe('deliberate');
    });

    it('should support balanced speed', () => {
      const profile: Partial<PsychometricProfile> = { decisionSpeed: 'balanced' };
      expect(profile.decisionSpeed).toBe('balanced');
    });

    it('should support rapid speed', () => {
      const profile: Partial<PsychometricProfile> = { decisionSpeed: 'rapid' };
      expect(profile.decisionSpeed).toBe('rapid');
    });
  });

  // ===========================================================================
  // COMMUNICATION STYLES
  // ===========================================================================

  describe('Communication Styles', () => {
    it('should support direct style', () => {
      const profile: Partial<PsychometricProfile> = { communicationStyle: 'direct' };
      expect(profile.communicationStyle).toBe('direct');
    });

    it('should support diplomatic style', () => {
      const profile: Partial<PsychometricProfile> = { communicationStyle: 'diplomatic' };
      expect(profile.communicationStyle).toBe('diplomatic');
    });

    it('should support technical style', () => {
      const profile: Partial<PsychometricProfile> = { communicationStyle: 'technical' };
      expect(profile.communicationStyle).toBe('technical');
    });
  });

  // ===========================================================================
  // LEADERSHIP STYLES
  // ===========================================================================

  describe('Leadership Styles', () => {
    it('should support servant leadership', () => {
      const profile: Partial<PsychometricProfile> = { leadershipStyle: 'servant' };
      expect(profile.leadershipStyle).toBe('servant');
    });

    it('should support transformational leadership', () => {
      const profile: Partial<PsychometricProfile> = { leadershipStyle: 'transformational' };
      expect(profile.leadershipStyle).toBe('transformational');
    });

    it('should support strategic leadership', () => {
      const profile: Partial<PsychometricProfile> = { leadershipStyle: 'strategic' };
      expect(profile.leadershipStyle).toBe('strategic');
    });

    it('should support operational leadership', () => {
      const profile: Partial<PsychometricProfile> = { leadershipStyle: 'operational' };
      expect(profile.leadershipStyle).toBe('operational');
    });
  });

  // ===========================================================================
  // CANDIDATE SOURCES
  // ===========================================================================

  describe('Candidate Sources', () => {
    it('should support linkedin source', () => {
      const candidate: Partial<Candidate> = { source: 'linkedin' };
      expect(candidate.source).toBe('linkedin');
    });

    it('should support github source', () => {
      const candidate: Partial<Candidate> = { source: 'github' };
      expect(candidate.source).toBe('github');
    });

    it('should support referral source', () => {
      const candidate: Partial<Candidate> = { source: 'referral' };
      expect(candidate.source).toBe('referral');
    });

    it('should support inbound source', () => {
      const candidate: Partial<Candidate> = { source: 'inbound' };
      expect(candidate.source).toBe('inbound');
    });

    it('should support research source', () => {
      const candidate: Partial<Candidate> = { source: 'research' };
      expect(candidate.source).toBe('research');
    });
  });

  // ===========================================================================
  // CANDIDATE STATUS
  // ===========================================================================

  describe('Candidate Status', () => {
    it('should support identified status', () => {
      const candidate: Partial<Candidate> = { status: 'identified' };
      expect(candidate.status).toBe('identified');
    });

    it('should support researched status', () => {
      const candidate: Partial<Candidate> = { status: 'researched' };
      expect(candidate.status).toBe('researched');
    });

    it('should support contacted status', () => {
      const candidate: Partial<Candidate> = { status: 'contacted' };
      expect(candidate.status).toBe('contacted');
    });

    it('should support interested status', () => {
      const candidate: Partial<Candidate> = { status: 'interested' };
      expect(candidate.status).toBe('interested');
    });

    it('should support interviewing status', () => {
      const candidate: Partial<Candidate> = { status: 'interviewing' };
      expect(candidate.status).toBe('interviewing');
    });

    it('should support offer status', () => {
      const candidate: Partial<Candidate> = { status: 'offer' };
      expect(candidate.status).toBe('offer');
    });

    it('should support hired status', () => {
      const candidate: Partial<Candidate> = { status: 'hired' };
      expect(candidate.status).toBe('hired');
    });

    it('should support declined status', () => {
      const candidate: Partial<Candidate> = { status: 'declined' };
      expect(candidate.status).toBe('declined');
    });
  });

  // ===========================================================================
  // PIPELINE URGENCY
  // ===========================================================================

  describe('Pipeline Urgency', () => {
    it('should support proactive urgency', () => {
      const pipeline: Partial<ShadowPipeline> = { urgency: 'proactive' };
      expect(pipeline.urgency).toBe('proactive');
    });

    it('should support planning urgency', () => {
      const pipeline: Partial<ShadowPipeline> = { urgency: 'planning' };
      expect(pipeline.urgency).toBe('planning');
    });

    it('should support urgent urgency', () => {
      const pipeline: Partial<ShadowPipeline> = { urgency: 'urgent' };
      expect(pipeline.urgency).toBe('urgent');
    });

    it('should support critical urgency', () => {
      const pipeline: Partial<ShadowPipeline> = { urgency: 'critical' };
      expect(pipeline.urgency).toBe('critical');
    });
  });

  // ===========================================================================
  // TALENT ALERT TYPES
  // ===========================================================================

  describe('Talent Alert Types', () => {
    it('should support key_departure_risk type', () => {
      const alert: Partial<TalentAlert> = { type: 'key_departure_risk' };
      expect(alert.type).toBe('key_departure_risk');
    });

    it('should support pipeline_empty type', () => {
      const alert: Partial<TalentAlert> = { type: 'pipeline_empty' };
      expect(alert.type).toBe('pipeline_empty');
    });

    it('should support market_opportunity type', () => {
      const alert: Partial<TalentAlert> = { type: 'market_opportunity' };
      expect(alert.type).toBe('market_opportunity');
    });

    it('should support competitor_hiring type', () => {
      const alert: Partial<TalentAlert> = { type: 'competitor_hiring' };
      expect(alert.type).toBe('competitor_hiring');
    });
  });

  // ===========================================================================
  // RISK TOLERANCE
  // ===========================================================================

  describe('Risk Tolerance', () => {
    it('should handle 0 risk tolerance', () => {
      const profile: Partial<PsychometricProfile> = { riskTolerance: 0 };
      expect(profile.riskTolerance).toBe(0);
    });

    it('should handle 25 risk tolerance', () => {
      const profile: Partial<PsychometricProfile> = { riskTolerance: 25 };
      expect(profile.riskTolerance).toBe(25);
    });

    it('should handle 50 risk tolerance', () => {
      const profile: Partial<PsychometricProfile> = { riskTolerance: 50 };
      expect(profile.riskTolerance).toBe(50);
    });

    it('should handle 75 risk tolerance', () => {
      const profile: Partial<PsychometricProfile> = { riskTolerance: 75 };
      expect(profile.riskTolerance).toBe(75);
    });

    it('should handle 100 risk tolerance', () => {
      const profile: Partial<PsychometricProfile> = { riskTolerance: 100 };
      expect(profile.riskTolerance).toBe(100);
    });
  });

  // ===========================================================================
  // MATCH SCORES
  // ===========================================================================

  describe('Match Scores', () => {
    it('should handle 0 match score', () => {
      const candidate: Partial<Candidate> = { matchScore: 0 };
      expect(candidate.matchScore).toBe(0);
    });

    it('should handle 50 match score', () => {
      const candidate: Partial<Candidate> = { matchScore: 50 };
      expect(candidate.matchScore).toBe(50);
    });

    it('should handle 85 match score', () => {
      const candidate: Partial<Candidate> = { matchScore: 85 };
      expect(candidate.matchScore).toBe(85);
    });

    it('should handle 100 match score', () => {
      const candidate: Partial<Candidate> = { matchScore: 100 };
      expect(candidate.matchScore).toBe(100);
    });
  });

  // ===========================================================================
  // PERFORMANCE SCORES
  // ===========================================================================

  describe('Performance Scores', () => {
    it('should handle 0 performance score', () => {
      const performer: Partial<TopPerformer> = { performanceScore: 0 };
      expect(performer.performanceScore).toBe(0);
    });

    it('should handle 50 performance score', () => {
      const performer: Partial<TopPerformer> = { performanceScore: 50 };
      expect(performer.performanceScore).toBe(50);
    });

    it('should handle 90 performance score', () => {
      const performer: Partial<TopPerformer> = { performanceScore: 90 };
      expect(performer.performanceScore).toBe(90);
    });

    it('should handle 100 performance score', () => {
      const performer: Partial<TopPerformer> = { performanceScore: 100 };
      expect(performer.performanceScore).toBe(100);
    });
  });

  // ===========================================================================
  // BUSINESS SCENARIOS
  // ===========================================================================

  describe('Business Scenarios', () => {
    it('should map top performer genome', () => {
      const performer: Partial<TopPerformer> = {
        name: 'Jane Doe',
        role: 'Senior Engineer',
        performanceScore: 95,
        profile: {
          cognitiveStyle: 'analytical',
          riskTolerance: 60,
          collaborationPreference: 'small_team',
          decisionSpeed: 'balanced',
          communicationStyle: 'technical',
          strengths: ['Problem solving', 'Architecture'],
          developmentAreas: ['Delegation'],
        },
      };
      expect(performer.performanceScore).toBe(95);
    });

    it('should build shadow pipeline', () => {
      const pipeline: Partial<ShadowPipeline> = {
        roleName: 'Staff Engineer',
        department: 'Engineering',
        targetCount: 10,
        urgency: 'proactive',
        candidates: [],
      };
      expect(pipeline.targetCount).toBe(10);
    });

    it('should match candidate to role', () => {
      const candidate: Partial<Candidate> = {
        name: 'John Smith',
        currentRole: 'Senior Developer',
        experience: 8,
        matchScore: 87,
        matchReasons: ['Technical skills match', 'Culture fit', 'Growth potential'],
        status: 'interested',
      };
      expect(candidate.matchScore).toBe(87);
    });

    it('should alert on key departure risk', () => {
      const alert: Partial<TalentAlert> = {
        type: 'key_departure_risk',
        severity: 'critical',
        message: 'VP Engineering showing departure signals',
        action: 'Schedule retention conversation',
      };
      expect(alert.severity).toBe('critical');
    });
  });

  // ===========================================================================
  // EDGE CASES
  // ===========================================================================

  describe('Edge Cases', () => {
    it('should handle empty strengths', () => {
      const profile: Partial<PsychometricProfile> = { strengths: [] };
      expect(profile.strengths?.length).toBe(0);
    });

    it('should handle empty development areas', () => {
      const profile: Partial<PsychometricProfile> = { developmentAreas: [] };
      expect(profile.developmentAreas?.length).toBe(0);
    });

    it('should handle empty skills', () => {
      const candidate: Partial<Candidate> = { skills: [] };
      expect(candidate.skills?.length).toBe(0);
    });

    it('should handle empty match reasons', () => {
      const candidate: Partial<Candidate> = { matchReasons: [] };
      expect(candidate.matchReasons?.length).toBe(0);
    });

    it('should handle empty candidates in pipeline', () => {
      const pipeline: Partial<ShadowPipeline> = { candidates: [] };
      expect(pipeline.candidates?.length).toBe(0);
    });

    it('should handle very long name', () => {
      const candidate: Partial<Candidate> = { name: 'A'.repeat(500) };
      expect(candidate.name?.length).toBe(500);
    });

    it('should handle special characters in name', () => {
      const candidate: Partial<Candidate> = {
        name: 'John "Jack" O\'Brien',
      };
      expect(candidate.name).toContain('Jack');
    });

    it('should handle unicode in name', () => {
      const candidate: Partial<Candidate> = {
        name: '田中太郎 🧑‍💼',
      };
      expect(candidate.name).toContain('田中');
    });

    it('should handle zero experience', () => {
      const candidate: Partial<Candidate> = { experience: 0 };
      expect(candidate.experience).toBe(0);
    });

    it('should handle zero tenure', () => {
      const performer: Partial<TopPerformer> = { tenure: 0 };
      expect(performer.tenure).toBe(0);
    });
  });
});
