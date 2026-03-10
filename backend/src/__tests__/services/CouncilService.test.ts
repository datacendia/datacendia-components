/**
 * CouncilService Tests
 * 
 * Tests for the multi-agent council deliberation engine
 * @module __tests__/services/CouncilService.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock('../../utils/servicePersistence.js', () => ({
  persistServiceRecord: vi.fn().mockResolvedValue(undefined),
  loadServiceRecords: vi.fn().mockResolvedValue([]),
}));

vi.mock('../../services/inference/InferenceProvider.js', () => ({
  inferenceProvider: {
    generate: vi.fn().mockResolvedValue({ response: 'Test response from agent', model: 'test' }),
    chat: vi.fn().mockResolvedValue({ message: { content: 'Test chat response' } }),
  },
}));

vi.mock('../../config/database.js', () => ({
  prisma: {
    $queryRaw: vi.fn().mockResolvedValue([]),
  },
}));

const mockPool = {
  query: vi.fn().mockResolvedValue({ rows: [{ id: 'mock-id-1' }], rowCount: 1 }),
  connect: vi.fn(),
  end: vi.fn(),
  on: vi.fn(),
} as any;

const { CouncilService } = await import('../../services/council/CouncilService.js');

describe('CouncilService', () => {
  let council: InstanceType<typeof CouncilService>;

  beforeEach(() => {
    vi.clearAllMocks();
    council = new CouncilService(mockPool);
  });

  // =========================================================================
  // INITIALIZATION
  // =========================================================================

  describe('initialization', () => {
    it('should be instantiable', () => {
      expect(council).toBeDefined();
    });

    it('should initialize without error', async () => {
      mockPool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });
      await expect(council.initialize()).resolves.not.toThrow();
    });
  });

  // =========================================================================
  // AGENTS
  // =========================================================================

  describe('getAgents()', () => {
    it('should return array of agents', () => {
      const agents = council.getAgents();
      expect(Array.isArray(agents)).toBe(true);
    });

    it('should return agents with required properties after loading', async () => {
      mockPool.query.mockResolvedValueOnce({
        rows: [{
          id: 'agent-1', code: 'strategist', name: 'Strategic Analyst', role: 'analyst',
          description: 'Strategic analysis', avatar: '🎯', color: '#3B82F6',
          capabilities: ['analysis'], system_prompt: 'You are...', model: 'test',
          temperature: '0.7', max_tokens: 4096, is_active: true, priority: 1,
        }],
        rowCount: 1,
      });
      await council.initialize();
      const agents = council.getAgents();
      for (const agent of agents) {
        expect(agent).toHaveProperty('id');
        expect(agent).toHaveProperty('name');
      }
    });
  });

  describe('getAgent()', () => {
    it('should return undefined for non-existent agent', () => {
      const agent = council.getAgent('non-existent-agent');
      expect(agent).toBeUndefined();
    });
  });

  // =========================================================================
  // SESSIONS
  // =========================================================================

  describe('createSession()', () => {
    it('should create a new council session', async () => {
      mockPool.query.mockResolvedValueOnce({ rows: [{ id: 'session-1' }] });
      const sessionId = await council.createSession('user-1', 'org-1', 'Test Session');
      expect(sessionId).toBeDefined();
      expect(typeof sessionId).toBe('string');
    });
  });

  describe('endSession()', () => {
    it('should end an existing session', async () => {
      mockPool.query.mockResolvedValueOnce({ rows: [{ id: 'session-1' }] });
      const sessionId = await council.createSession('user-1', 'org-1', 'Session to end');
      mockPool.query.mockResolvedValueOnce({ rows: [], rowCount: 1 });
      await expect(council.endSession(sessionId)).resolves.not.toThrow();
    });
  });

  // =========================================================================
  // DELIBERATIONS
  // =========================================================================

  describe('startDeliberation()', () => {
    it('should have startDeliberation method', () => {
      expect(typeof council.startDeliberation).toBe('function');
    });
  });

  describe('getDeliberation()', () => {
    it('should return null for non-existent deliberation', async () => {
      mockPool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });
      const result = await council.getDeliberation('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('getDeliberationHistory()', () => {
    it('should return array of deliberations', async () => {
      mockPool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });
      const history = await council.getDeliberationHistory();
      expect(Array.isArray(history)).toBe(true);
    });

    it('should accept limit parameter', async () => {
      mockPool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });
      const history = await council.getDeliberationHistory(undefined, undefined, 5);
      expect(Array.isArray(history)).toBe(true);
    });
  });

  // =========================================================================
  // AGENT MEMORIES
  // =========================================================================

  describe('getAgentMemories()', () => {
    it('should return memories for an agent', async () => {
      mockPool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });
      const memories = await council.getAgentMemories('test-agent');
      expect(Array.isArray(memories)).toBe(true);
    });

    it('should accept limit parameter', async () => {
      mockPool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });
      const memories = await council.getAgentMemories('test-agent', 10);
      expect(Array.isArray(memories)).toBe(true);
    });
  });

  // =========================================================================
  // LEGAL TOOLS
  // =========================================================================

  describe('getLegalToolsContext()', () => {
    it('should return legal context string', () => {
      const context = council.getLegalToolsContext();
      expect(typeof context).toBe('string');
      expect(context.length).toBeGreaterThan(0);
    });
  });

  describe('getLegalToolDefinitions()', () => {
    it('should return tool definitions', () => {
      const tools = council.getLegalToolDefinitions();
      expect(tools).toBeDefined();
    });
  });
});
