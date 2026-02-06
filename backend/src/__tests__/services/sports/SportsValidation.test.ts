/**
 * =============================================================================
 * SPORTS VALIDATION SCHEMA TEST SUITE
 * =============================================================================
 * Comprehensive testing for Sports Vertical validation schemas covering:
 * - Decision request validation
 * - Financial data validation
 * - Player data validation
 * - FFP assessment validation
 * - Transfer evaluation validation
 * - Edge cases and boundary conditions
 */

import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// =============================================================================
// VALIDATION SCHEMAS (Replicated for testing)
// =============================================================================

const DecisionTypeSchema = z.enum([
  'TRANSFER_IN',
  'TRANSFER_OUT',
  'LOAN_IN',
  'LOAN_OUT',
  'CONTRACT_NEW',
  'CONTRACT_RENEWAL',
  'CONTRACT_TERMINATION',
  'COMMERCIAL',
  'MANAGER',
  'YOUTH_PROMOTION',
]);

const PrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);

const StatusSchema = z.enum(['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'COMPLETED']);

const PlayerDataSchema = z.object({
  name: z.string().min(1).max(100),
  age: z.number().int().min(15).max(50),
  position: z.string().min(1).max(50),
  nationality: z.string().optional(),
  currentClub: z.string().optional(),
  contractExpiry: z.string().datetime().optional(),
  marketValue: z.number().positive().optional(),
});

const FinancialDataSchema = z.object({
  transferFee: z.number().nonnegative().max(500000000), // Max €500M
  wages: z.number().positive().max(2000000), // Max £2M/week
  agentFees: z.number().nonnegative().optional(),
  signingBonus: z.number().nonnegative().optional(),
  contractLength: z.number().int().min(1).max(7), // 1-7 years
  totalCost: z.number().positive().optional(),
});

const FFPAssessmentSchema = z.object({
  currentBreakEven: z.number(),
  projectedBreakEven: z.number(),
  squadCostRatio: z.number().min(0).max(100),
  transferBudgetRemaining: z.number(),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  complianceStatus: z.enum(['COMPLIANT', 'WARNING', 'BREACH']),
});

const CreateDecisionSchema = z.object({
  organizationId: z.string().uuid(),
  type: DecisionTypeSchema,
  title: z.string().min(5).max(200),
  description: z.string().max(5000).optional(),
  priority: PrioritySchema,
  deadline: z.string().datetime().optional(),
  player: PlayerDataSchema.optional(),
  financials: FinancialDataSchema.optional(),
  metadata: z.record(z.any()).optional(),
});

const TransferEvaluationSchema = z.object({
  decisionId: z.string().uuid(),
  player: PlayerDataSchema,
  financials: FinancialDataSchema,
  scouting: z.object({
    technicalRating: z.number().min(1).max(10),
    tacticalRating: z.number().min(1).max(10),
    physicalRating: z.number().min(1).max(10),
    mentalRating: z.number().min(1).max(10),
    overallRating: z.number().min(1).max(10),
    strengths: z.array(z.string()).min(1).max(10),
    weaknesses: z.array(z.string()).max(10),
    recommendation: z.enum(['STRONG_BUY', 'BUY', 'CONDITIONAL', 'PASS']),
  }),
  ffpImpact: FFPAssessmentSchema.optional(),
  riskAssessment: z.object({
    financialRisk: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    performanceRisk: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    injuryRisk: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    reputationalRisk: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    overallRisk: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  }).optional(),
});

// =============================================================================
// DECISION TYPE VALIDATION TESTS
// =============================================================================

describe('Sports Validation - Decision Types', () => {
  const validTypes = [
    'TRANSFER_IN',
    'TRANSFER_OUT',
    'LOAN_IN',
    'LOAN_OUT',
    'CONTRACT_NEW',
    'CONTRACT_RENEWAL',
    'CONTRACT_TERMINATION',
    'COMMERCIAL',
    'MANAGER',
    'YOUTH_PROMOTION',
  ];

  it.each(validTypes)('should accept valid type: %s', (type) => {
    const result = DecisionTypeSchema.safeParse(type);
    expect(result.success).toBe(true);
  });

  it('should reject invalid decision type', () => {
    const result = DecisionTypeSchema.safeParse('INVALID_TYPE');
    expect(result.success).toBe(false);
  });

  it('should reject empty string', () => {
    const result = DecisionTypeSchema.safeParse('');
    expect(result.success).toBe(false);
  });

  it('should reject lowercase variants', () => {
    const result = DecisionTypeSchema.safeParse('transfer_in');
    expect(result.success).toBe(false);
  });

  it('should reject null', () => {
    const result = DecisionTypeSchema.safeParse(null);
    expect(result.success).toBe(false);
  });
});

// =============================================================================
// PRIORITY VALIDATION TESTS
// =============================================================================

describe('Sports Validation - Priority', () => {
  const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

  it.each(validPriorities)('should accept valid priority: %s', (priority) => {
    const result = PrioritySchema.safeParse(priority);
    expect(result.success).toBe(true);
  });

  it('should reject invalid priority', () => {
    const result = PrioritySchema.safeParse('URGENT');
    expect(result.success).toBe(false);
  });

  it('should reject numeric priority', () => {
    const result = PrioritySchema.safeParse(1);
    expect(result.success).toBe(false);
  });
});

// =============================================================================
// STATUS VALIDATION TESTS
// =============================================================================

describe('Sports Validation - Status', () => {
  const validStatuses = ['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'];

  it.each(validStatuses)('should accept valid status: %s', (status) => {
    const result = StatusSchema.safeParse(status);
    expect(result.success).toBe(true);
  });

  it('should reject invalid status', () => {
    const result = StatusSchema.safeParse('IN_PROGRESS');
    expect(result.success).toBe(false);
  });
});

// =============================================================================
// PLAYER DATA VALIDATION TESTS
// =============================================================================

describe('Sports Validation - Player Data', () => {
  const validPlayer = {
    name: 'Test Player',
    age: 25,
    position: 'Midfielder',
  };

  it('should accept valid player data', () => {
    const result = PlayerDataSchema.safeParse(validPlayer);
    expect(result.success).toBe(true);
  });

  it('should accept player with all optional fields', () => {
    const fullPlayer = {
      ...validPlayer,
      nationality: 'Scotland',
      currentClub: 'Test FC',
      contractExpiry: '2026-06-30T00:00:00Z',
      marketValue: 5000000,
    };
    const result = PlayerDataSchema.safeParse(fullPlayer);
    expect(result.success).toBe(true);
  });

  describe('Name Validation', () => {
    it('should reject empty name', () => {
      const result = PlayerDataSchema.safeParse({ ...validPlayer, name: '' });
      expect(result.success).toBe(false);
    });

    it('should reject name over 100 characters', () => {
      const result = PlayerDataSchema.safeParse({ ...validPlayer, name: 'A'.repeat(101) });
      expect(result.success).toBe(false);
    });

    it('should accept name with special characters', () => {
      const result = PlayerDataSchema.safeParse({ ...validPlayer, name: "Timo O'Brien-Smith" });
      expect(result.success).toBe(true);
    });
  });

  describe('Age Validation', () => {
    it('should reject age below 15', () => {
      const result = PlayerDataSchema.safeParse({ ...validPlayer, age: 14 });
      expect(result.success).toBe(false);
    });

    it('should reject age above 50', () => {
      const result = PlayerDataSchema.safeParse({ ...validPlayer, age: 51 });
      expect(result.success).toBe(false);
    });

    it('should accept boundary age 15', () => {
      const result = PlayerDataSchema.safeParse({ ...validPlayer, age: 15 });
      expect(result.success).toBe(true);
    });

    it('should accept boundary age 50', () => {
      const result = PlayerDataSchema.safeParse({ ...validPlayer, age: 50 });
      expect(result.success).toBe(true);
    });

    it('should reject non-integer age', () => {
      const result = PlayerDataSchema.safeParse({ ...validPlayer, age: 25.5 });
      expect(result.success).toBe(false);
    });

    it('should reject negative age', () => {
      const result = PlayerDataSchema.safeParse({ ...validPlayer, age: -1 });
      expect(result.success).toBe(false);
    });
  });

  describe('Position Validation', () => {
    it('should reject empty position', () => {
      const result = PlayerDataSchema.safeParse({ ...validPlayer, position: '' });
      expect(result.success).toBe(false);
    });

    it('should accept common positions', () => {
      const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Centre-Back', 'Right Wing'];
      for (const position of positions) {
        const result = PlayerDataSchema.safeParse({ ...validPlayer, position });
        expect(result.success).toBe(true);
      }
    });
  });

  describe('Market Value Validation', () => {
    it('should reject negative market value', () => {
      const result = PlayerDataSchema.safeParse({ ...validPlayer, marketValue: -1000000 });
      expect(result.success).toBe(false);
    });

    it('should reject zero market value', () => {
      const result = PlayerDataSchema.safeParse({ ...validPlayer, marketValue: 0 });
      expect(result.success).toBe(false);
    });

    it('should accept positive market value', () => {
      const result = PlayerDataSchema.safeParse({ ...validPlayer, marketValue: 50000000 });
      expect(result.success).toBe(true);
    });
  });
});

// =============================================================================
// FINANCIAL DATA VALIDATION TESTS
// =============================================================================

describe('Sports Validation - Financial Data', () => {
  const validFinancials = {
    transferFee: 30000000,
    wages: 150000,
    contractLength: 5,
  };

  it('should accept valid financial data', () => {
    const result = FinancialDataSchema.safeParse(validFinancials);
    expect(result.success).toBe(true);
  });

  it('should accept financial data with all fields', () => {
    const fullFinancials = {
      ...validFinancials,
      agentFees: 3000000,
      signingBonus: 5000000,
      totalCost: 38000000,
    };
    const result = FinancialDataSchema.safeParse(fullFinancials);
    expect(result.success).toBe(true);
  });

  describe('Transfer Fee Validation', () => {
    it('should accept zero transfer fee (free transfer)', () => {
      const result = FinancialDataSchema.safeParse({ ...validFinancials, transferFee: 0 });
      expect(result.success).toBe(true);
    });

    it('should reject negative transfer fee', () => {
      const result = FinancialDataSchema.safeParse({ ...validFinancials, transferFee: -1000000 });
      expect(result.success).toBe(false);
    });

    it('should reject transfer fee over €500M', () => {
      const result = FinancialDataSchema.safeParse({ ...validFinancials, transferFee: 500000001 });
      expect(result.success).toBe(false);
    });

    it('should accept maximum transfer fee of €500M', () => {
      const result = FinancialDataSchema.safeParse({ ...validFinancials, transferFee: 500000000 });
      expect(result.success).toBe(true);
    });
  });

  describe('Wages Validation', () => {
    it('should reject zero wages', () => {
      const result = FinancialDataSchema.safeParse({ ...validFinancials, wages: 0 });
      expect(result.success).toBe(false);
    });

    it('should reject negative wages', () => {
      const result = FinancialDataSchema.safeParse({ ...validFinancials, wages: -50000 });
      expect(result.success).toBe(false);
    });

    it('should reject wages over £2M/week', () => {
      const result = FinancialDataSchema.safeParse({ ...validFinancials, wages: 2000001 });
      expect(result.success).toBe(false);
    });

    it('should accept maximum wages of £2M/week', () => {
      const result = FinancialDataSchema.safeParse({ ...validFinancials, wages: 2000000 });
      expect(result.success).toBe(true);
    });
  });

  describe('Contract Length Validation', () => {
    it('should reject contract length of 0', () => {
      const result = FinancialDataSchema.safeParse({ ...validFinancials, contractLength: 0 });
      expect(result.success).toBe(false);
    });

    it('should reject contract length over 7 years', () => {
      const result = FinancialDataSchema.safeParse({ ...validFinancials, contractLength: 8 });
      expect(result.success).toBe(false);
    });

    it('should accept minimum contract length of 1 year', () => {
      const result = FinancialDataSchema.safeParse({ ...validFinancials, contractLength: 1 });
      expect(result.success).toBe(true);
    });

    it('should accept maximum contract length of 7 years', () => {
      const result = FinancialDataSchema.safeParse({ ...validFinancials, contractLength: 7 });
      expect(result.success).toBe(true);
    });

    it('should reject non-integer contract length', () => {
      const result = FinancialDataSchema.safeParse({ ...validFinancials, contractLength: 3.5 });
      expect(result.success).toBe(false);
    });
  });

  describe('Agent Fees Validation', () => {
    it('should accept zero agent fees', () => {
      const result = FinancialDataSchema.safeParse({ ...validFinancials, agentFees: 0 });
      expect(result.success).toBe(true);
    });

    it('should reject negative agent fees', () => {
      const result = FinancialDataSchema.safeParse({ ...validFinancials, agentFees: -100000 });
      expect(result.success).toBe(false);
    });
  });
});

// =============================================================================
// FFP ASSESSMENT VALIDATION TESTS
// =============================================================================

describe('Sports Validation - FFP Assessment', () => {
  const validFFP = {
    currentBreakEven: 50000000,
    projectedBreakEven: 45000000,
    squadCostRatio: 65,
    transferBudgetRemaining: 30000000,
    riskLevel: 'MEDIUM',
    complianceStatus: 'COMPLIANT',
  };

  it('should accept valid FFP assessment', () => {
    const result = FFPAssessmentSchema.safeParse(validFFP);
    expect(result.success).toBe(true);
  });

  describe('Squad Cost Ratio Validation', () => {
    it('should accept 0% squad cost ratio', () => {
      const result = FFPAssessmentSchema.safeParse({ ...validFFP, squadCostRatio: 0 });
      expect(result.success).toBe(true);
    });

    it('should accept 100% squad cost ratio', () => {
      const result = FFPAssessmentSchema.safeParse({ ...validFFP, squadCostRatio: 100 });
      expect(result.success).toBe(true);
    });

    it('should reject negative squad cost ratio', () => {
      const result = FFPAssessmentSchema.safeParse({ ...validFFP, squadCostRatio: -1 });
      expect(result.success).toBe(false);
    });

    it('should reject squad cost ratio over 100%', () => {
      const result = FFPAssessmentSchema.safeParse({ ...validFFP, squadCostRatio: 101 });
      expect(result.success).toBe(false);
    });
  });

  describe('Risk Level Validation', () => {
    const validRiskLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

    it.each(validRiskLevels)('should accept risk level: %s', (riskLevel) => {
      const result = FFPAssessmentSchema.safeParse({ ...validFFP, riskLevel });
      expect(result.success).toBe(true);
    });

    it('should reject invalid risk level', () => {
      const result = FFPAssessmentSchema.safeParse({ ...validFFP, riskLevel: 'EXTREME' });
      expect(result.success).toBe(false);
    });
  });

  describe('Compliance Status Validation', () => {
    const validStatuses = ['COMPLIANT', 'WARNING', 'BREACH'];

    it.each(validStatuses)('should accept compliance status: %s', (complianceStatus) => {
      const result = FFPAssessmentSchema.safeParse({ ...validFFP, complianceStatus });
      expect(result.success).toBe(true);
    });

    it('should reject invalid compliance status', () => {
      const result = FFPAssessmentSchema.safeParse({ ...validFFP, complianceStatus: 'PENDING' });
      expect(result.success).toBe(false);
    });
  });
});

// =============================================================================
// CREATE DECISION VALIDATION TESTS
// =============================================================================

describe('Sports Validation - Create Decision', () => {
  const validDecision = {
    organizationId: '550e8400-e29b-41d4-a716-446655440000',
    type: 'TRANSFER_IN',
    title: 'Player Acquisition - Test Player',
    priority: 'HIGH',
  };

  it('should accept valid create decision request', () => {
    const result = CreateDecisionSchema.safeParse(validDecision);
    expect(result.success).toBe(true);
  });

  it('should accept decision with all optional fields', () => {
    const fullDecision = {
      ...validDecision,
      description: 'Detailed description of the transfer decision',
      deadline: '2024-06-30T23:59:59Z',
      player: {
        name: 'Test Player',
        age: 25,
        position: 'Midfielder',
      },
      financials: {
        transferFee: 30000000,
        wages: 150000,
        contractLength: 5,
      },
      metadata: {
        source: 'agent_referral',
        previousInterest: true,
      },
    };
    const result = CreateDecisionSchema.safeParse(fullDecision);
    expect(result.success).toBe(true);
  });

  describe('Organization ID Validation', () => {
    it('should reject invalid UUID format', () => {
      const result = CreateDecisionSchema.safeParse({ ...validDecision, organizationId: 'not-a-uuid' });
      expect(result.success).toBe(false);
    });

    it('should reject empty organization ID', () => {
      const result = CreateDecisionSchema.safeParse({ ...validDecision, organizationId: '' });
      expect(result.success).toBe(false);
    });
  });

  describe('Title Validation', () => {
    it('should reject title shorter than 5 characters', () => {
      const result = CreateDecisionSchema.safeParse({ ...validDecision, title: 'Test' });
      expect(result.success).toBe(false);
    });

    it('should reject title longer than 200 characters', () => {
      const result = CreateDecisionSchema.safeParse({ ...validDecision, title: 'A'.repeat(201) });
      expect(result.success).toBe(false);
    });

    it('should accept minimum title length of 5 characters', () => {
      const result = CreateDecisionSchema.safeParse({ ...validDecision, title: 'Test1' });
      expect(result.success).toBe(true);
    });
  });

  describe('Description Validation', () => {
    it('should reject description longer than 5000 characters', () => {
      const result = CreateDecisionSchema.safeParse({ ...validDecision, description: 'A'.repeat(5001) });
      expect(result.success).toBe(false);
    });

    it('should accept maximum description length', () => {
      const result = CreateDecisionSchema.safeParse({ ...validDecision, description: 'A'.repeat(5000) });
      expect(result.success).toBe(true);
    });
  });
});

// =============================================================================
// TRANSFER EVALUATION VALIDATION TESTS
// =============================================================================

describe('Sports Validation - Transfer Evaluation', () => {
  const validEvaluation = {
    decisionId: '550e8400-e29b-41d4-a716-446655440000',
    player: {
      name: 'Test Player',
      age: 25,
      position: 'Midfielder',
    },
    financials: {
      transferFee: 30000000,
      wages: 150000,
      contractLength: 5,
    },
    scouting: {
      technicalRating: 8,
      tacticalRating: 7,
      physicalRating: 8,
      mentalRating: 7,
      overallRating: 7.5,
      strengths: ['Passing', 'Vision', 'Work rate'],
      weaknesses: ['Aerial duels'],
      recommendation: 'BUY',
    },
  };

  it('should accept valid transfer evaluation', () => {
    const result = TransferEvaluationSchema.safeParse(validEvaluation);
    expect(result.success).toBe(true);
  });

  describe('Scouting Ratings Validation', () => {
    it('should reject rating below 1', () => {
      const result = TransferEvaluationSchema.safeParse({
        ...validEvaluation,
        scouting: { ...validEvaluation.scouting, technicalRating: 0 },
      });
      expect(result.success).toBe(false);
    });

    it('should reject rating above 10', () => {
      const result = TransferEvaluationSchema.safeParse({
        ...validEvaluation,
        scouting: { ...validEvaluation.scouting, technicalRating: 11 },
      });
      expect(result.success).toBe(false);
    });

    it('should accept boundary rating of 1', () => {
      const result = TransferEvaluationSchema.safeParse({
        ...validEvaluation,
        scouting: { ...validEvaluation.scouting, technicalRating: 1 },
      });
      expect(result.success).toBe(true);
    });

    it('should accept boundary rating of 10', () => {
      const result = TransferEvaluationSchema.safeParse({
        ...validEvaluation,
        scouting: { ...validEvaluation.scouting, technicalRating: 10 },
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Recommendation Validation', () => {
    const validRecommendations = ['STRONG_BUY', 'BUY', 'CONDITIONAL', 'PASS'];

    it.each(validRecommendations)('should accept recommendation: %s', (recommendation) => {
      const result = TransferEvaluationSchema.safeParse({
        ...validEvaluation,
        scouting: { ...validEvaluation.scouting, recommendation },
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid recommendation', () => {
      const result = TransferEvaluationSchema.safeParse({
        ...validEvaluation,
        scouting: { ...validEvaluation.scouting, recommendation: 'MAYBE' },
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Strengths/Weaknesses Validation', () => {
    it('should require at least one strength', () => {
      const result = TransferEvaluationSchema.safeParse({
        ...validEvaluation,
        scouting: { ...validEvaluation.scouting, strengths: [] },
      });
      expect(result.success).toBe(false);
    });

    it('should allow empty weaknesses', () => {
      const result = TransferEvaluationSchema.safeParse({
        ...validEvaluation,
        scouting: { ...validEvaluation.scouting, weaknesses: [] },
      });
      expect(result.success).toBe(true);
    });

    it('should reject more than 10 strengths', () => {
      const result = TransferEvaluationSchema.safeParse({
        ...validEvaluation,
        scouting: { ...validEvaluation.scouting, strengths: Array(11).fill('Strength') },
      });
      expect(result.success).toBe(false);
    });
  });
});

// =============================================================================
// EDGE CASE TESTS
// =============================================================================

describe('Sports Validation - Edge Cases', () => {
  it('should handle null values gracefully', () => {
    const result = CreateDecisionSchema.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should handle undefined values gracefully', () => {
    const result = CreateDecisionSchema.safeParse(undefined);
    expect(result.success).toBe(false);
  });

  it('should handle empty object', () => {
    const result = CreateDecisionSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle extra unknown fields', () => {
    const dataWithExtra = {
      organizationId: '550e8400-e29b-41d4-a716-446655440000',
      type: 'TRANSFER_IN',
      title: 'Test Decision',
      priority: 'HIGH',
      unknownField: 'should be stripped',
    };
    const result = CreateDecisionSchema.safeParse(dataWithExtra);
    expect(result.success).toBe(true);
  });

  it('should handle very large numbers', () => {
    const result = FinancialDataSchema.safeParse({
      transferFee: Number.MAX_SAFE_INTEGER,
      wages: 150000,
      contractLength: 5,
    });
    expect(result.success).toBe(false); // Exceeds max transfer fee
  });

  it('should handle decimal precision for financial values', () => {
    const result = FinancialDataSchema.safeParse({
      transferFee: 30000000.99,
      wages: 150000.50,
      contractLength: 5,
    });
    expect(result.success).toBe(true);
  });
});

// =============================================================================
// ERROR MESSAGE TESTS
// =============================================================================

describe('Sports Validation - Error Messages', () => {
  it('should provide clear error for invalid type', () => {
    const result = DecisionTypeSchema.safeParse('INVALID');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBeDefined();
    }
  });

  it('should provide clear error for missing required field', () => {
    const result = CreateDecisionSchema.safeParse({
      type: 'TRANSFER_IN',
      title: 'Test',
      priority: 'HIGH',
      // Missing organizationId
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const orgIdError = result.error.issues.find(i => i.path.includes('organizationId'));
      expect(orgIdError).toBeDefined();
    }
  });

  it('should provide path to nested errors', () => {
    const result = TransferEvaluationSchema.safeParse({
      decisionId: '550e8400-e29b-41d4-a716-446655440000',
      player: {
        name: '', // Invalid: empty
        age: 25,
        position: 'Midfielder',
      },
      financials: {
        transferFee: 30000000,
        wages: 150000,
        contractLength: 5,
      },
      scouting: {
        technicalRating: 8,
        tacticalRating: 7,
        physicalRating: 8,
        mentalRating: 7,
        overallRating: 7.5,
        strengths: ['Passing'],
        weaknesses: [],
        recommendation: 'BUY',
      },
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const nameError = result.error.issues.find(i => 
        i.path.includes('player') && i.path.includes('name')
      );
      expect(nameError).toBeDefined();
    }
  });
});
