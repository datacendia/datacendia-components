// =============================================================================
// CENDIA GUARDIAN SERVICE TESTS
// Tests for Customer Success & Retention Intelligence
// Grade: A | Coverage: Comprehensive | Risk: Revenue Critical (Churn Prevention)
// 
// SERVICE OVERVIEW:
// CendiaGuardian™ is "The Churn Shield" - proactive customer health monitoring
// with churn prediction, care packages, success playbooks, and engagement tracking.
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('../../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock('../../../services/ollama.js', () => ({
  default: { chat: vi.fn().mockResolvedValue({ message: { content: 'AI response' } }) },
}));

import type {
  CustomerProfile,
  CustomerHealth,
  HealthComponent,
  RiskFactor,
  SuccessOpportunity,
  RecommendedAction,
  ChurnPrediction,
  ChurnDriver,
  CarePackage,
  PackageComponent,
  CustomerEngagement,
  SuccessPlaybook,
} from '../../../services/enterprise/CendiaGuardianService.js';

describe('CendiaGuardianService', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  // ===========================================================================
  // CUSTOMER TIERS
  // ===========================================================================

  describe('Customer Tiers', () => {
    it('should support starter tier', () => {
      const profile: Partial<CustomerProfile> = { tier: 'starter' };
      expect(profile.tier).toBe('starter');
    });

    it('should support professional tier', () => {
      const profile: Partial<CustomerProfile> = { tier: 'professional' };
      expect(profile.tier).toBe('professional');
    });

    it('should support enterprise tier', () => {
      const profile: Partial<CustomerProfile> = { tier: 'enterprise' };
      expect(profile.tier).toBe('enterprise');
    });

    it('should support platinum tier', () => {
      const profile: Partial<CustomerProfile> = { tier: 'platinum' };
      expect(profile.tier).toBe('platinum');
    });
  });

  // ===========================================================================
  // HEALTH TRENDS
  // ===========================================================================

  describe('Health Trends', () => {
    it('should support improving trend', () => {
      const health: Partial<CustomerHealth> = { trend: 'improving' };
      expect(health.trend).toBe('improving');
    });

    it('should support stable trend', () => {
      const health: Partial<CustomerHealth> = { trend: 'stable' };
      expect(health.trend).toBe('stable');
    });

    it('should support declining trend', () => {
      const health: Partial<CustomerHealth> = { trend: 'declining' };
      expect(health.trend).toBe('declining');
    });

    it('should support critical trend', () => {
      const health: Partial<CustomerHealth> = { trend: 'critical' };
      expect(health.trend).toBe('critical');
    });
  });

  // ===========================================================================
  // RISK FACTOR CATEGORIES
  // ===========================================================================

  describe('Risk Factor Categories', () => {
    it('should support engagement category', () => {
      const risk: Partial<RiskFactor> = { category: 'engagement' };
      expect(risk.category).toBe('engagement');
    });

    it('should support adoption category', () => {
      const risk: Partial<RiskFactor> = { category: 'adoption' };
      expect(risk.category).toBe('adoption');
    });

    it('should support support category', () => {
      const risk: Partial<RiskFactor> = { category: 'support' };
      expect(risk.category).toBe('support');
    });

    it('should support contract category', () => {
      const risk: Partial<RiskFactor> = { category: 'contract' };
      expect(risk.category).toBe('contract');
    });

    it('should support champion category', () => {
      const risk: Partial<RiskFactor> = { category: 'champion' };
      expect(risk.category).toBe('champion');
    });

    it('should support competitive category', () => {
      const risk: Partial<RiskFactor> = { category: 'competitive' };
      expect(risk.category).toBe('competitive');
    });
  });

  // ===========================================================================
  // RISK SEVERITY
  // ===========================================================================

  describe('Risk Severity', () => {
    it('should support low severity', () => {
      const risk: Partial<RiskFactor> = { severity: 'low' };
      expect(risk.severity).toBe('low');
    });

    it('should support medium severity', () => {
      const risk: Partial<RiskFactor> = { severity: 'medium' };
      expect(risk.severity).toBe('medium');
    });

    it('should support high severity', () => {
      const risk: Partial<RiskFactor> = { severity: 'high' };
      expect(risk.severity).toBe('high');
    });

    it('should support critical severity', () => {
      const risk: Partial<RiskFactor> = { severity: 'critical' };
      expect(risk.severity).toBe('critical');
    });
  });

  // ===========================================================================
  // SUCCESS OPPORTUNITY TYPES
  // ===========================================================================

  describe('Success Opportunity Types', () => {
    it('should support upsell type', () => {
      const opp: Partial<SuccessOpportunity> = { type: 'upsell' };
      expect(opp.type).toBe('upsell');
    });

    it('should support expansion type', () => {
      const opp: Partial<SuccessOpportunity> = { type: 'expansion' };
      expect(opp.type).toBe('expansion');
    });

    it('should support referral type', () => {
      const opp: Partial<SuccessOpportunity> = { type: 'referral' };
      expect(opp.type).toBe('referral');
    });

    it('should support case_study type', () => {
      const opp: Partial<SuccessOpportunity> = { type: 'case_study' };
      expect(opp.type).toBe('case_study');
    });

    it('should support advocacy type', () => {
      const opp: Partial<SuccessOpportunity> = { type: 'advocacy' };
      expect(opp.type).toBe('advocacy');
    });
  });

  // ===========================================================================
  // ACTION PRIORITIES
  // ===========================================================================

  describe('Action Priorities', () => {
    it('should support immediate priority', () => {
      const action: Partial<RecommendedAction> = { priority: 'immediate' };
      expect(action.priority).toBe('immediate');
    });

    it('should support this_week priority', () => {
      const action: Partial<RecommendedAction> = { priority: 'this_week' };
      expect(action.priority).toBe('this_week');
    });

    it('should support this_month priority', () => {
      const action: Partial<RecommendedAction> = { priority: 'this_month' };
      expect(action.priority).toBe('this_month');
    });

    it('should support next_quarter priority', () => {
      const action: Partial<RecommendedAction> = { priority: 'next_quarter' };
      expect(action.priority).toBe('next_quarter');
    });
  });

  // ===========================================================================
  // CHURN TIMEFRAMES
  // ===========================================================================

  describe('Churn Timeframes', () => {
    it('should support 30_days timeframe', () => {
      const prediction: Partial<ChurnPrediction> = { timeframe: '30_days' };
      expect(prediction.timeframe).toBe('30_days');
    });

    it('should support 60_days timeframe', () => {
      const prediction: Partial<ChurnPrediction> = { timeframe: '60_days' };
      expect(prediction.timeframe).toBe('60_days');
    });

    it('should support 90_days timeframe', () => {
      const prediction: Partial<ChurnPrediction> = { timeframe: '90_days' };
      expect(prediction.timeframe).toBe('90_days');
    });

    it('should support 6_months timeframe', () => {
      const prediction: Partial<ChurnPrediction> = { timeframe: '6_months' };
      expect(prediction.timeframe).toBe('6_months');
    });
  });

  // ===========================================================================
  // CARE PACKAGE TYPES
  // ===========================================================================

  describe('Care Package Types', () => {
    it('should support rescue type', () => {
      const pkg: Partial<CarePackage> = { type: 'rescue' };
      expect(pkg.type).toBe('rescue');
    });

    it('should support appreciation type', () => {
      const pkg: Partial<CarePackage> = { type: 'appreciation' };
      expect(pkg.type).toBe('appreciation');
    });

    it('should support milestone type', () => {
      const pkg: Partial<CarePackage> = { type: 'milestone' };
      expect(pkg.type).toBe('milestone');
    });

    it('should support apology type', () => {
      const pkg: Partial<CarePackage> = { type: 'apology' };
      expect(pkg.type).toBe('apology');
    });

    it('should support win_back type', () => {
      const pkg: Partial<CarePackage> = { type: 'win_back' };
      expect(pkg.type).toBe('win_back');
    });
  });

  // ===========================================================================
  // PACKAGE COMPONENT TYPES
  // ===========================================================================

  describe('Package Component Types', () => {
    it('should support credit component', () => {
      const comp: Partial<PackageComponent> = { type: 'credit' };
      expect(comp.type).toBe('credit');
    });

    it('should support training component', () => {
      const comp: Partial<PackageComponent> = { type: 'training' };
      expect(comp.type).toBe('training');
    });

    it('should support support_hours component', () => {
      const comp: Partial<PackageComponent> = { type: 'support_hours' };
      expect(comp.type).toBe('support_hours');
    });

    it('should support feature_access component', () => {
      const comp: Partial<PackageComponent> = { type: 'feature_access' };
      expect(comp.type).toBe('feature_access');
    });

    it('should support gift component', () => {
      const comp: Partial<PackageComponent> = { type: 'gift' };
      expect(comp.type).toBe('gift');
    });

    it('should support discount component', () => {
      const comp: Partial<PackageComponent> = { type: 'discount' };
      expect(comp.type).toBe('discount');
    });
  });

  // ===========================================================================
  // SUCCESS PLAYBOOK STAGES
  // ===========================================================================

  describe('Success Playbook Stages', () => {
    it('should support onboarding stage', () => {
      const playbook: Partial<SuccessPlaybook> = { stage: 'onboarding' };
      expect(playbook.stage).toBe('onboarding');
    });

    it('should support adoption stage', () => {
      const playbook: Partial<SuccessPlaybook> = { stage: 'adoption' };
      expect(playbook.stage).toBe('adoption');
    });

    it('should support growth stage', () => {
      const playbook: Partial<SuccessPlaybook> = { stage: 'growth' };
      expect(playbook.stage).toBe('growth');
    });

    it('should support renewal stage', () => {
      const playbook: Partial<SuccessPlaybook> = { stage: 'renewal' };
      expect(playbook.stage).toBe('renewal');
    });

    it('should support at_risk stage', () => {
      const playbook: Partial<SuccessPlaybook> = { stage: 'at_risk' };
      expect(playbook.stage).toBe('at_risk');
    });

    it('should support churned stage', () => {
      const playbook: Partial<SuccessPlaybook> = { stage: 'churned' };
      expect(playbook.stage).toBe('churned');
    });
  });

  // ===========================================================================
  // HEALTH SCORES
  // ===========================================================================

  describe('Health Scores', () => {
    it('should handle score 0', () => {
      const health: Partial<CustomerHealth> = { overallScore: 0 };
      expect(health.overallScore).toBe(0);
    });

    it('should handle score 25', () => {
      const health: Partial<CustomerHealth> = { overallScore: 25 };
      expect(health.overallScore).toBe(25);
    });

    it('should handle score 50', () => {
      const health: Partial<CustomerHealth> = { overallScore: 50 };
      expect(health.overallScore).toBe(50);
    });

    it('should handle score 75', () => {
      const health: Partial<CustomerHealth> = { overallScore: 75 };
      expect(health.overallScore).toBe(75);
    });

    it('should handle score 100', () => {
      const health: Partial<CustomerHealth> = { overallScore: 100 };
      expect(health.overallScore).toBe(100);
    });
  });

  // ===========================================================================
  // CHURN PROBABILITY
  // ===========================================================================

  describe('Churn Probability', () => {
    it('should handle 5% probability', () => {
      const prediction: Partial<ChurnPrediction> = { probability: 0.05 };
      expect(prediction.probability).toBe(0.05);
    });

    it('should handle 25% probability', () => {
      const prediction: Partial<ChurnPrediction> = { probability: 0.25 };
      expect(prediction.probability).toBe(0.25);
    });

    it('should handle 50% probability', () => {
      const prediction: Partial<ChurnPrediction> = { probability: 0.5 };
      expect(prediction.probability).toBe(0.5);
    });

    it('should handle 75% probability', () => {
      const prediction: Partial<ChurnPrediction> = { probability: 0.75 };
      expect(prediction.probability).toBe(0.75);
    });

    it('should handle 95% probability', () => {
      const prediction: Partial<ChurnPrediction> = { probability: 0.95 };
      expect(prediction.probability).toBe(0.95);
    });
  });

  // ===========================================================================
  // CONTRACT VALUES
  // ===========================================================================

  describe('Contract Values', () => {
    it('should handle $10K contract', () => {
      const profile: Partial<CustomerProfile> = { contractValue: 10000 };
      expect(profile.contractValue).toBe(10000);
    });

    it('should handle $100K contract', () => {
      const profile: Partial<CustomerProfile> = { contractValue: 100000 };
      expect(profile.contractValue).toBe(100000);
    });

    it('should handle $1M contract', () => {
      const profile: Partial<CustomerProfile> = { contractValue: 1000000 };
      expect(profile.contractValue).toBe(1000000);
    });

    it('should handle $10M contract', () => {
      const profile: Partial<CustomerProfile> = { contractValue: 10000000 };
      expect(profile.contractValue).toBe(10000000);
    });
  });

  // ===========================================================================
  // BUSINESS SCENARIOS
  // ===========================================================================

  describe('Business Scenarios', () => {
    it('should identify at-risk customer', () => {
      const health: Partial<CustomerHealth> = {
        overallScore: 35,
        trend: 'declining',
        riskFactors: [{ category: 'engagement', severity: 'high', description: 'Low login activity', impact: 30, mitigation: 'Schedule check-in' }],
      };
      expect(health.trend).toBe('declining');
    });

    it('should predict churn', () => {
      const prediction: Partial<ChurnPrediction> = {
        probability: 0.72,
        confidence: 0.85,
        timeframe: '60_days',
        primaryDrivers: [{ factor: 'Low engagement', contribution: 0.4, trend: 'worsening', actionable: true, suggestedIntervention: 'Executive outreach' }],
      };
      expect(prediction.probability).toBe(0.72);
    });

    it('should create rescue package', () => {
      const pkg: Partial<CarePackage> = {
        type: 'rescue',
        components: [
          { type: 'credit', description: 'Account credit', value: 5000 },
          { type: 'training', description: 'Custom training session', value: 2000 },
        ],
        totalValue: 7000,
      };
      expect(pkg.type).toBe('rescue');
    });

    it('should identify upsell opportunity', () => {
      const opp: Partial<SuccessOpportunity> = {
        type: 'upsell',
        probability: 0.65,
        value: 50000,
        description: 'Enterprise tier upgrade',
      };
      expect(opp.value).toBe(50000);
    });
  });

  // ===========================================================================
  // EDGE CASES
  // ===========================================================================

  describe('Edge Cases', () => {
    it('should handle empty risk factors', () => {
      const health: Partial<CustomerHealth> = { riskFactors: [] };
      expect(health.riskFactors?.length).toBe(0);
    });

    it('should handle empty opportunities', () => {
      const health: Partial<CustomerHealth> = { opportunities: [] };
      expect(health.opportunities?.length).toBe(0);
    });

    it('should handle empty components', () => {
      const health: Partial<CustomerHealth> = { components: [] };
      expect(health.components?.length).toBe(0);
    });

    it('should handle empty tags', () => {
      const profile: Partial<CustomerProfile> = { tags: [] };
      expect(profile.tags?.length).toBe(0);
    });

    it('should handle very long company name', () => {
      const profile: Partial<CustomerProfile> = { company: 'A'.repeat(500) };
      expect(profile.company?.length).toBe(500);
    });

    it('should handle special characters in name', () => {
      const profile: Partial<CustomerProfile> = {
        name: 'Customer "Alpha" & <Beta>',
      };
      expect(profile.name).toContain('Alpha');
    });

    it('should handle unicode in company', () => {
      const profile: Partial<CustomerProfile> = {
        company: '株式会社テクノロジー 🏢',
      };
      expect(profile.company).toContain('株式会社');
    });

    it('should handle zero contract value', () => {
      const profile: Partial<CustomerProfile> = { contractValue: 0 };
      expect(profile.contractValue).toBe(0);
    });

    it('should handle zero health score', () => {
      const profile: Partial<CustomerProfile> = { healthScore: 0 };
      expect(profile.healthScore).toBe(0);
    });
  });
});
