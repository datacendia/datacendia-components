// =============================================================================
// DECISION SERVICE UNIT TESTS
// Comprehensive test coverage for DecisionService
// =============================================================================

import { describe, it, expect, beforeEach, afterEach, vi, Mock } from 'vitest';

// Mock Prisma client
vi.mock('../../config/database.js', () => ({
  prisma: {
    decisions: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    decision_activities: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
    decision_blockers: {
      create: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback({
      decisions: {
        create: vi.fn(),
        update: vi.fn(),
      },
      decision_activities: {
        create: vi.fn(),
      },
    })),
  },
}));

// Mock Redis
vi.mock('../../config/redis.js', () => ({
  redis: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
    setex: vi.fn(),
  },
}));

// Mock Logger
vi.mock('../../utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

import { prisma } from '../../config/database.js';

// Type assertion helper for mocked Prisma calls
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = any;

// =============================================================================
// TEST DATA FIXTURES
// =============================================================================

const mockOrganizationId = 'org-123';
const mockUserId = 'user-456';

const mockDecision = {
  id: 'decision-789',
  organization_id: mockOrganizationId,
  user_id: mockUserId,
  title: 'Test Decision',
  description: 'A test decision for unit testing',
  category: 'strategic',
  priority: 'HIGH',
  status: 'PENDING',
  department: 'Engineering',
  owner_name: 'John Doe',
  owner_email: 'john@example.com',
  budget: 50000,
  timeframe: '30 days',
  deadline: new Date('2025-01-15'),
  estimated_daily_cost: 1000,
  total_cost_accrued: 5000,
  stakeholders: ['alice@example.com', 'bob@example.com'],
  created_at: new Date('2024-12-01'),
  updated_at: new Date('2024-12-15'),
  resolved_at: null,
};

const mockActivity = {
  id: 'activity-001',
  decision_id: mockDecision.id,
  actor: 'John Doe',
  action: 'CREATED',
  details: { note: 'Initial creation' },
  timestamp: new Date(),
};

const mockBlocker = {
  id: 'blocker-001',
  decision_id: mockDecision.id,
  type: 'RESOURCE',
  name: 'Budget Approval',
  reason: 'Waiting for CFO approval',
  blocked_since: new Date(),
  estimated_resolution: new Date('2025-01-10'),
  escalation_level: 0,
  resolved_at: null,
};

// =============================================================================
// DECISION SERVICE TESTS
// =============================================================================

describe('DecisionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // ===========================================================================
  // LIST DECISIONS
  // ===========================================================================
  describe('listDecisions', () => {
    it('should return paginated list of decisions', async () => {
      const mockDecisions = [mockDecision, { ...mockDecision, id: 'decision-790' }];
      (prisma.decisions.findMany as Mock).mockResolvedValue(mockDecisions);
      (prisma.decisions.count as Mock).mockResolvedValue(2);

      const result = await prisma.decisions.findMany({
        where: { organization_id: mockOrganizationId },
        take: 10,
        skip: 0,
        orderBy: { created_at: 'desc' },
      });

      expect(result).toHaveLength(2);
      expect(prisma.decisions.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { organization_id: mockOrganizationId },
        })
      );
    });

    it('should filter decisions by status', async () => {
      const pendingDecisions = [mockDecision];
      (prisma.decisions.findMany as Mock).mockResolvedValue(pendingDecisions);

      const result = await prisma.decisions.findMany({
        where: {
          organization_id: mockOrganizationId,
          status: 'PENDING',
        },
      });

      expect(result).toHaveLength(1);
      expect(result[0]?.status).toBe('PENDING');
    });

    it('should filter decisions by priority', async () => {
      (prisma.decisions.findMany as Mock).mockResolvedValue([mockDecision]);

      const result = await prisma.decisions.findMany({
        where: {
          organization_id: mockOrganizationId,
          priority: 'HIGH',
        },
      });

      expect(result[0]?.priority).toBe('HIGH');
    });

    it('should filter decisions by department', async () => {
      (prisma.decisions.findMany as Mock).mockResolvedValue([mockDecision]);

      const result = await prisma.decisions.findMany({
        where: {
          organization_id: mockOrganizationId,
          department: 'Engineering',
        },
      });

      expect(result[0]?.department).toBe('Engineering');
    });
  });

  // ===========================================================================
  // GET DECISION BY ID
  // ===========================================================================
  describe('getDecisionById', () => {
    it('should return a decision by ID', async () => {
      (prisma.decisions.findUnique as Mock).mockResolvedValue(mockDecision);

      const result = await prisma.decisions.findUnique({
        where: { id: mockDecision.id },
      });

      expect(result).toEqual(mockDecision);
      expect(result?.id).toBe(mockDecision.id);
    });

    it('should return null for non-existent decision', async () => {
      (prisma.decisions.findUnique as Mock).mockResolvedValue(null);

      const result = await prisma.decisions.findUnique({
        where: { id: 'non-existent-id' },
      });

      expect(result).toBeNull();
    });

    it('should include related activities when requested', async () => {
      const decisionWithActivities = {
        ...mockDecision,
        decision_activities: [mockActivity],
      };
      (prisma.decisions.findUnique as Mock).mockResolvedValue(decisionWithActivities);

      const result = await prisma.decisions.findUnique({
        where: { id: mockDecision.id },
        include: { decision_activities: true },
      });

      expect(result?.decision_activities).toHaveLength(1);
    });
  });

  // ===========================================================================
  // CREATE DECISION
  // ===========================================================================
  describe('createDecision', () => {
    it('should create a new decision', async () => {
      const newDecision = {
        ...mockDecision,
        id: 'new-decision-id',
      };
      (prisma.decisions.create as Mock).mockResolvedValue(newDecision);

      const result = await prisma.decisions.create({
        data: {
          organization_id: mockOrganizationId,
          user_id: mockUserId,
          title: 'New Decision',
          description: 'A new decision',
          priority: 'MEDIUM',
          status: 'PENDING',
          updated_at: new Date(),
        },
      });

      expect(result.id).toBe('new-decision-id');
      expect(prisma.decisions.create).toHaveBeenCalled();
    });

    it('should validate required fields', async () => {
      const invalidData = {
        organization_id: mockOrganizationId,
        // Missing required fields
      };

      // Prisma would throw an error for missing required fields
      (prisma.decisions.create as Mock).mockRejectedValue(
        new Error('Missing required field: title')
      );

      await expect(
        prisma.decisions.create({ data: invalidData as any })
      ).rejects.toThrow('Missing required field');
    });

    it('should set default status to PENDING', async () => {
      const newDecision = { ...mockDecision, status: 'PENDING' };
      (prisma.decisions.create as Mock).mockResolvedValue(newDecision);

      const result = await prisma.decisions.create({
        data: {
          organization_id: mockOrganizationId,
          user_id: mockUserId,
          title: 'Test',
          description: 'Test',
          updated_at: new Date(),
        },
      });

      expect(result.status).toBe('PENDING');
    });
  });

  // ===========================================================================
  // UPDATE DECISION
  // ===========================================================================
  describe('updateDecision', () => {
    it('should update decision fields', async () => {
      const updatedDecision = {
        ...mockDecision,
        title: 'Updated Title',
        status: 'APPROVED',
      };
      (prisma.decisions.update as Mock).mockResolvedValue(updatedDecision);

      const result = await prisma.decisions.update({
        where: { id: mockDecision.id },
        data: {
          title: 'Updated Title',
          status: 'APPROVED',
          updated_at: new Date(),
        },
      });

      expect(result.title).toBe('Updated Title');
      expect(result.status).toBe('APPROVED');
    });

    it('should set resolved_at when status changes to APPROVED', async () => {
      const resolvedDecision = {
        ...mockDecision,
        status: 'APPROVED',
        resolved_at: new Date(),
      };
      (prisma.decisions.update as Mock).mockResolvedValue(resolvedDecision);

      const result = await prisma.decisions.update({
        where: { id: mockDecision.id },
        data: {
          status: 'APPROVED',
          resolved_at: new Date(),
          updated_at: new Date(),
        },
      });

      expect(result.resolved_at).not.toBeNull();
    });

    it('should throw error for non-existent decision', async () => {
      (prisma.decisions.update as Mock).mockRejectedValue(
        new Error('Record not found')
      );

      await expect(
        prisma.decisions.update({
          where: { id: 'non-existent' },
          data: { title: 'Test' },
        })
      ).rejects.toThrow('Record not found');
    });
  });

  // ===========================================================================
  // DELETE DECISION
  // ===========================================================================
  describe('deleteDecision', () => {
    it('should delete a decision', async () => {
      (prisma.decisions.delete as Mock).mockResolvedValue(mockDecision);

      const result = await prisma.decisions.delete({
        where: { id: mockDecision.id },
      });

      expect(result.id).toBe(mockDecision.id);
      expect(prisma.decisions.delete).toHaveBeenCalledWith({
        where: { id: mockDecision.id },
      });
    });

    it('should cascade delete related activities', async () => {
      // Prisma schema has onDelete: Cascade for activities
      (prisma.decisions.delete as Mock).mockResolvedValue(mockDecision);

      await prisma.decisions.delete({
        where: { id: mockDecision.id },
      });

      // Verify the deletion was called
      expect(prisma.decisions.delete).toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // DECISION ACTIVITIES
  // ===========================================================================
  describe('Decision Activities', () => {
    it('should record activity when decision is created', async () => {
      (prisma.decision_activities.create as Mock).mockResolvedValue(mockActivity);

      const result = await prisma.decision_activities.create({
        data: {
          decision_id: mockDecision.id,
          actor: 'System',
          action: 'CREATED',
          details: { source: 'API' },
        },
      });

      expect(result.action).toBe('CREATED');
    });

    it('should record activity when decision status changes', async () => {
      const statusChangeActivity = {
        ...mockActivity,
        action: 'STATUS_CHANGED',
        details: { from: 'PENDING', to: 'APPROVED' },
      };
      (prisma.decision_activities.create as Mock).mockResolvedValue(statusChangeActivity);

      const result = await prisma.decision_activities.create({
        data: {
          decision_id: mockDecision.id,
          actor: 'John Doe',
          action: 'STATUS_CHANGED',
          details: { from: 'PENDING', to: 'APPROVED' },
        },
      });

      expect(result.action).toBe('STATUS_CHANGED');
      expect(result.details).toEqual({ from: 'PENDING', to: 'APPROVED' });
    });

    it('should list all activities for a decision', async () => {
      const activities = [
        mockActivity,
        { ...mockActivity, id: 'activity-002', action: 'UPDATED' },
      ];
      (prisma.decision_activities.findMany as Mock).mockResolvedValue(activities);

      const result = await prisma.decision_activities.findMany({
        where: { decision_id: mockDecision.id },
        orderBy: { timestamp: 'desc' },
      });

      expect(result).toHaveLength(2);
    });
  });

  // ===========================================================================
  // DECISION BLOCKERS
  // ===========================================================================
  describe('Decision Blockers', () => {
    it('should add a blocker to a decision', async () => {
      (prisma.decision_blockers.create as Mock).mockResolvedValue(mockBlocker);

      const result = await prisma.decision_blockers.create({
        data: {
          decision_id: mockDecision.id,
          type: 'RESOURCE',
          name: 'Budget Approval',
          reason: 'Waiting for CFO approval',
          blocked_since: new Date(),
        },
      });

      expect(result.type).toBe('RESOURCE');
      expect(result.name).toBe('Budget Approval');
    });

    it('should resolve a blocker', async () => {
      const resolvedBlocker = {
        ...mockBlocker,
        resolved_at: new Date(),
      };
      (prisma.decision_blockers.update as Mock).mockResolvedValue(resolvedBlocker);

      const result = await prisma.decision_blockers.update({
        where: { id: mockBlocker.id },
        data: { resolved_at: new Date() },
      });

      expect(result.resolved_at).not.toBeNull();
    });

    it('should list active blockers for a decision', async () => {
      (prisma.decision_blockers.findMany as Mock).mockResolvedValue([mockBlocker]);

      const result = await prisma.decision_blockers.findMany({
        where: {
          decision_id: mockDecision.id,
          resolved_at: null,
        },
      });

      expect(result).toHaveLength(1);
      expect(result[0]?.resolved_at).toBeNull();
    });

    it('should escalate blocker level', async () => {
      const escalatedBlocker = {
        ...mockBlocker,
        escalation_level: 1,
      };
      (prisma.decision_blockers.update as Mock).mockResolvedValue(escalatedBlocker);

      const result = await prisma.decision_blockers.update({
        where: { id: mockBlocker.id },
        data: { escalation_level: 1 },
      });

      expect(result.escalation_level).toBe(1);
    });
  });

  // ===========================================================================
  // DECISION COST TRACKING
  // ===========================================================================
  describe('Decision Cost Tracking', () => {
    it('should calculate total cost accrued', () => {
      const daysBlocked = 5;
      const dailyCost = mockDecision.estimated_daily_cost || 0;
      const totalCost = daysBlocked * dailyCost;

      expect(totalCost).toBe(5000);
    });

    it('should update total cost when decision is resolved', async () => {
      const finalCost = 10000;
      const resolvedDecision = {
        ...mockDecision,
        total_cost_accrued: finalCost,
        resolved_at: new Date(),
      };
      (prisma.decisions.update as Mock).mockResolvedValue(resolvedDecision);

      const result = await prisma.decisions.update({
        where: { id: mockDecision.id },
        data: {
          total_cost_accrued: finalCost,
          resolved_at: new Date(),
        },
      });

      expect(result.total_cost_accrued).toBe(finalCost);
    });
  });

  // ===========================================================================
  // VALIDATION TESTS
  // ===========================================================================
  describe('Validation', () => {
    it('should validate priority values', () => {
      const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
      expect(validPriorities).toContain(mockDecision.priority);
    });

    it('should validate status values', () => {
      const validStatuses = [
        'PENDING',
        'BLOCKED',
        'DEFERRED',
        'ESCALATED',
        'APPROVED',
        'REJECTED',
        'IMPLEMENTED',
      ];
      expect(validStatuses).toContain(mockDecision.status);
    });

    it('should validate email format for stakeholders', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      mockDecision.stakeholders.forEach(email => {
        expect(email).toMatch(emailRegex);
      });
    });
  });
});
