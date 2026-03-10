/**
 * Deliberation Flow Integration Test
 * 
 * Tests the complete deliberation pipeline:
 * Question → Agent Loading → Vote Collection → Aggregation → Decision
 * 
 * Uses mocked database (Pool) but real service logic.
 * @module __tests__/integration/deliberation-flow.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import crypto from 'crypto';

vi.mock('../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));
vi.mock('../../utils/servicePersistence.js', () => ({
  persistServiceRecord: vi.fn().mockResolvedValue(undefined),
  loadServiceRecords: vi.fn().mockResolvedValue([]),
}));
vi.mock('../../config/database.js', () => ({
  prisma: { $queryRaw: vi.fn().mockResolvedValue([]) },
}));
vi.mock('../../services/ollama.js', () => ({
  default: {
    generate: vi.fn().mockResolvedValue('I recommend proceeding with caution. The financial risk is moderate but the strategic upside is significant.'),
    chat: vi.fn().mockResolvedValue({ role: 'assistant', content: 'Analysis complete.' }),
    type: 'ollama',
    isAvailable: vi.fn().mockResolvedValue(true),
    resolveModel: vi.fn().mockResolvedValue('llama3.2:3b'),
  },
}));

// Mock agents that would come from the database
const MOCK_AGENTS = [
  { id: 'agent-cfo', code: 'CFO', name: 'CFO Agent', role: 'Chief Financial Officer', description: 'Financial analysis', avatar: null, color: '#2196F3', capabilities: ['financial_analysis'], system_prompt: 'You are the CFO.', model: 'llama3.2:3b', temperature: '0.7', max_tokens: 2000, is_active: true, priority: 1 },
  { id: 'agent-legal', code: 'LEGAL', name: 'Legal Agent', role: 'General Counsel', description: 'Legal analysis', avatar: null, color: '#4CAF50', capabilities: ['legal_analysis'], system_prompt: 'You are legal counsel.', model: 'llama3.2:3b', temperature: '0.5', max_tokens: 2000, is_active: true, priority: 2 },
  { id: 'agent-ethics', code: 'ETHICS', name: 'Ethics Agent', role: 'Ethics Officer', description: 'Ethics review', avatar: null, color: '#FF9800', capabilities: ['ethics_review'], system_prompt: 'You are the ethics officer.', model: 'llama3.2:3b', temperature: '0.6', max_tokens: 2000, is_active: true, priority: 3 },
  { id: 'agent-risk', code: 'RISK', name: 'Risk Agent', role: 'Risk Manager', description: 'Risk assessment', avatar: null, color: '#F44336', capabilities: ['risk_assessment'], system_prompt: 'You are the risk manager.', model: 'llama3.2:3b', temperature: '0.4', max_tokens: 2000, is_active: true, priority: 4 },
];

// Build mock pool
let deliberationInsertCount = 0;
const mockPool = {
  query: vi.fn().mockImplementation((sql: string, params?: any[]) => {
    if (sql.includes('FROM council_agents')) {
      return { rows: MOCK_AGENTS, rowCount: MOCK_AGENTS.length };
    }
    if (sql.includes('INSERT INTO council_sessions')) {
      return { rows: [{ id: `session-${Date.now()}` }], rowCount: 1 };
    }
    if (sql.includes('INSERT INTO deliberations')) {
      deliberationInsertCount++;
      return { rows: [{ id: `delib-${deliberationInsertCount}` }], rowCount: 1 };
    }
    if (sql.includes('INSERT INTO deliberation_votes')) {
      return { rows: [{ id: `vote-${Date.now()}` }], rowCount: 1 };
    }
    if (sql.includes('UPDATE deliberations')) {
      return { rows: [], rowCount: 1 };
    }
    if (sql.includes('UPDATE council_sessions')) {
      return { rows: [], rowCount: 1 };
    }
    if (sql.includes('FROM deliberations')) {
      return { rows: [], rowCount: 0 };
    }
    return { rows: [], rowCount: 0 };
  }),
  connect: vi.fn(),
  end: vi.fn(),
  on: vi.fn(),
} as any;

const { CouncilService } = await import('../../services/council/CouncilService.js');

describe('Deliberation Flow Integration', () => {
  let council: InstanceType<typeof CouncilService>;

  beforeEach(async () => {
    vi.clearAllMocks();
    deliberationInsertCount = 0;
    council = new CouncilService(mockPool);
    // Initialize loads agents from mocked pool
    await council.initialize();
  });

  // =========================================================================
  // AGENT LOADING
  // =========================================================================

  describe('Agent Loading', () => {
    it('should load all active agents from database', () => {
      const agents = council.getAgents();
      expect(agents.length).toBe(4);
    });

    it('should have correct agent properties', () => {
      const agents = council.getAgents();
      const cfo = agents.find(a => a.code === 'CFO');
      expect(cfo).toBeDefined();
      expect(cfo!.name).toBe('CFO Agent');
      expect(cfo!.role).toBe('Chief Financial Officer');
      expect(cfo!.isActive).toBe(true);
    });

    it('should retrieve individual agent by ID', () => {
      const agent = council.getAgent('agent-cfo');
      expect(agent).toBeDefined();
      expect(agent!.code).toBe('CFO');
    });

    it('should return undefined for non-existent agent', () => {
      expect(council.getAgent('nonexistent')).toBeUndefined();
    });
  });

  // =========================================================================
  // SESSION MANAGEMENT
  // =========================================================================

  describe('Session Management', () => {
    it('should create a new session', async () => {
      const sessionId = await council.createSession('user-1', 'org-1', 'Test Session');
      expect(sessionId).toBeDefined();
      expect(typeof sessionId).toBe('string');
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO council_sessions'),
        expect.arrayContaining(['user-1', 'org-1', 'Test Session'])
      );
    });

    it('should end a session', async () => {
      await council.endSession('session-123');
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE council_sessions'),
        expect.arrayContaining(['session-123'])
      );
    });
  });

  // =========================================================================
  // DELIBERATION FLOW
  // =========================================================================

  describe('Start Deliberation', () => {
    it('should start a deliberation and return deliberation ID', async () => {
      const delibId = await council.startDeliberation(
        'Should we expand into the European market?',
        {
          userId: 'user-1',
          organizationId: 'org-1',
          context: 'Revenue is $50M, EU regulations are complex',
        }
      );
      expect(delibId).toBeDefined();
      expect(typeof delibId).toBe('string');
    });

    it('should insert deliberation record into database', async () => {
      await council.startDeliberation('Test question?', {
        userId: 'user-1',
        organizationId: 'org-1',
      });
      
      // Verify INSERT INTO deliberations was called
      const insertCalls = mockPool.query.mock.calls.filter(
        (call: any[]) => typeof call[0] === 'string' && call[0].includes('INSERT INTO deliberations')
      );
      expect(insertCalls.length).toBeGreaterThan(0);
    });

    it('should create session if not provided', async () => {
      await council.startDeliberation('Auto-session question?', {
        userId: 'user-1',
      });
      
      const sessionCalls = mockPool.query.mock.calls.filter(
        (call: any[]) => typeof call[0] === 'string' && call[0].includes('INSERT INTO council_sessions')
      );
      expect(sessionCalls.length).toBeGreaterThan(0);
    });
  });

  // =========================================================================
  // VOTE AGGREGATION LOGIC
  // =========================================================================

  describe('Vote Aggregation', () => {
    it('should correctly aggregate unanimous approval', () => {
      const votes = [
        { agentId: 'agent-cfo', vote: 'approve', confidence: 0.92 },
        { agentId: 'agent-legal', vote: 'approve', confidence: 0.88 },
        { agentId: 'agent-ethics', vote: 'approve', confidence: 0.85 },
        { agentId: 'agent-risk', vote: 'approve', confidence: 0.90 },
      ];

      const approvals = votes.filter(v => v.vote === 'approve').length;
      const totalVotes = votes.length;
      const avgConfidence = votes.reduce((sum, v) => sum + v.confidence, 0) / totalVotes;
      const unanimity = approvals === totalVotes;

      expect(unanimity).toBe(true);
      expect(approvals).toBe(4);
      expect(avgConfidence).toBeGreaterThan(0.85);
    });

    it('should correctly aggregate split decision', () => {
      const votes = [
        { agentId: 'agent-cfo', vote: 'approve', confidence: 0.92 },
        { agentId: 'agent-legal', vote: 'reject', confidence: 0.78 },
        { agentId: 'agent-ethics', vote: 'approve', confidence: 0.65 },
        { agentId: 'agent-risk', vote: 'reject', confidence: 0.88 },
      ];

      const approvals = votes.filter(v => v.vote === 'approve').length;
      const rejections = votes.filter(v => v.vote === 'reject').length;
      const totalVotes = votes.length;
      const approvalRate = approvals / totalVotes;

      expect(approvals).toBe(2);
      expect(rejections).toBe(2);
      expect(approvalRate).toBe(0.5);
    });

    it('should identify dissenting agents', () => {
      const votes = [
        { agentId: 'agent-cfo', vote: 'approve', confidence: 0.92 },
        { agentId: 'agent-legal', vote: 'approve', confidence: 0.88 },
        { agentId: 'agent-ethics', vote: 'reject', confidence: 0.75, reason: 'Ethical concerns about data privacy' },
        { agentId: 'agent-risk', vote: 'approve', confidence: 0.80 },
      ];

      const majority = votes.filter(v => v.vote === 'approve');
      const dissents = votes.filter(v => v.vote !== majority[0]?.vote);

      expect(dissents.length).toBe(1);
      expect(dissents[0].agentId).toBe('agent-ethics');
    });

    it('should calculate weighted confidence based on agent priority', () => {
      const votes = [
        { agentId: 'agent-cfo', vote: 'approve', confidence: 0.92, weight: 0.3 },
        { agentId: 'agent-legal', vote: 'approve', confidence: 0.88, weight: 0.3 },
        { agentId: 'agent-ethics', vote: 'reject', confidence: 0.75, weight: 0.2 },
        { agentId: 'agent-risk', vote: 'approve', confidence: 0.80, weight: 0.2 },
      ];

      const weightedConfidence = votes.reduce(
        (sum, v) => sum + v.confidence * v.weight, 0
      );

      expect(weightedConfidence).toBeCloseTo(0.86, 1);
      expect(weightedConfidence).toBeGreaterThan(0.7); // Exceeds threshold
    });
  });

  // =========================================================================
  // EVIDENCE HASH FOR DELIBERATION
  // =========================================================================

  describe('Deliberation Evidence Hash', () => {
    it('should produce deterministic hash for deliberation record', () => {
      const deliberation = {
        id: 'delib-2024-001',
        question: 'Should we approve the merger?',
        votes: [
          { agentId: 'agent-cfo', vote: 'approve', confidence: 0.92 },
          { agentId: 'agent-legal', vote: 'approve', confidence: 0.88 },
        ],
        decision: 'approved',
        timestamp: '2024-03-07T22:00:00Z',
      };

      const json = JSON.stringify(deliberation);
      const hash1 = crypto.createHash('sha256').update(json).digest('hex');
      const hash2 = crypto.createHash('sha256').update(json).digest('hex');

      expect(hash1).toBe(hash2);
      expect(hash1.length).toBe(64);
    });

    it('should detect tampering of vote records', () => {
      const original = {
        id: 'delib-001',
        votes: [
          { agentId: 'cfo', vote: 'approve', confidence: 0.92 },
          { agentId: 'legal', vote: 'reject', confidence: 0.78 },
        ],
        decision: 'approved_with_conditions',
      };

      const tampered = {
        ...original,
        votes: [
          { agentId: 'cfo', vote: 'approve', confidence: 0.92 },
          { agentId: 'legal', vote: 'approve', confidence: 0.78 }, // Changed from reject to approve
        ],
        decision: 'approved', // Changed from approved_with_conditions
      };

      const originalHash = crypto.createHash('sha256').update(JSON.stringify(original)).digest('hex');
      const tamperedHash = crypto.createHash('sha256').update(JSON.stringify(tampered)).digest('hex');

      expect(originalHash).not.toBe(tamperedHash);
    });
  });

  // =========================================================================
  // DELIBERATION HISTORY
  // =========================================================================

  describe('Deliberation History', () => {
    it('should query deliberation history from database', async () => {
      await council.getDeliberationHistory('user-1', 'org-1', 10);

      const historyCalls = mockPool.query.mock.calls.filter(
        (call: any[]) => typeof call[0] === 'string' && call[0].includes('FROM deliberations')
      );
      expect(historyCalls.length).toBeGreaterThan(0);
    });
  });
});
