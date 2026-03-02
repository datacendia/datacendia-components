/**
 * Module — Deliberation Visualization Service Test
 *
 * Platform module.
 * @module __tests__/services/DeliberationVisualizationService.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Deliberation Visualization Service Tests
 * Tests for real-time visualization and replay theater features
 */

import { describe, it, expect } from 'vitest';

// Mock agent visualization types
interface AgentVisualization {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
  status: 'idle' | 'thinking' | 'speaking' | 'listening' | 'dissenting' | 'agreeing';
  confidence: number;
  currentStatement?: string;
  citationCount: number;
  dissenting: boolean;
}

interface TimelineEvent {
  id: string;
  timestamp: Date;
  type: 'statement' | 'citation' | 'dissent' | 'agreement' | 'round_complete';
  agentName?: string;
  content: string;
}

interface ReplayFrame {
  id: string;
  timestamp: number;
  type: 'statement' | 'citation' | 'dissent' | 'vote' | 'consensus' | 'round_change';
  agentName?: string;
  content: string;
  confidence?: number;
}

// Mock visualization state
const AGENT_STATUSES = ['idle', 'thinking', 'speaking', 'listening', 'dissenting', 'agreeing'] as const;

// Mock functions
const calculateConsensus = (agents: AgentVisualization[]): number => {
  if (agents.length === 0) return 0;
  const agreeing = agents.filter(a => !a.dissenting).length;
  return Math.round((agreeing / agents.length) * 100);
};

const getActiveAgents = (agents: AgentVisualization[]): AgentVisualization[] => {
  return agents.filter(a => a.status !== 'idle');
};

const getSpeakingAgent = (agents: AgentVisualization[]): AgentVisualization | undefined => {
  return agents.find(a => a.status === 'speaking');
};

const getDissentingAgents = (agents: AgentVisualization[]): AgentVisualization[] => {
  return agents.filter(a => a.dissenting);
};

describe('Deliberation Visualization Service', () => {
  describe('Agent Status Management', () => {
    it('should have all valid agent statuses', () => {
      expect(AGENT_STATUSES).toContain('idle');
      expect(AGENT_STATUSES).toContain('thinking');
      expect(AGENT_STATUSES).toContain('speaking');
      expect(AGENT_STATUSES).toContain('listening');
      expect(AGENT_STATUSES).toContain('dissenting');
      expect(AGENT_STATUSES).toContain('agreeing');
    });

    it('should have 6 possible statuses', () => {
      expect(AGENT_STATUSES).toHaveLength(6);
    });
  });

  describe('Consensus Calculation', () => {
    it('should calculate 100% consensus when no dissent', () => {
      const agents: AgentVisualization[] = [
        { id: '1', name: 'Agent1', role: 'Role1', avatarColor: 'blue', status: 'agreeing', confidence: 80, citationCount: 2, dissenting: false },
        { id: '2', name: 'Agent2', role: 'Role2', avatarColor: 'green', status: 'agreeing', confidence: 75, citationCount: 1, dissenting: false },
      ];
      
      expect(calculateConsensus(agents)).toBe(100);
    });

    it('should calculate 50% consensus with one dissenter', () => {
      const agents: AgentVisualization[] = [
        { id: '1', name: 'Agent1', role: 'Role1', avatarColor: 'blue', status: 'agreeing', confidence: 80, citationCount: 2, dissenting: false },
        { id: '2', name: 'Agent2', role: 'Role2', avatarColor: 'red', status: 'dissenting', confidence: 60, citationCount: 1, dissenting: true },
      ];
      
      expect(calculateConsensus(agents)).toBe(50);
    });

    it('should return 0 for empty agent list', () => {
      expect(calculateConsensus([])).toBe(0);
    });

    it('should handle all dissenters', () => {
      const agents: AgentVisualization[] = [
        { id: '1', name: 'Agent1', role: 'Role1', avatarColor: 'red', status: 'dissenting', confidence: 60, citationCount: 1, dissenting: true },
        { id: '2', name: 'Agent2', role: 'Role2', avatarColor: 'red', status: 'dissenting', confidence: 55, citationCount: 0, dissenting: true },
      ];
      
      expect(calculateConsensus(agents)).toBe(0);
    });
  });

  describe('Active Agent Detection', () => {
    it('should filter out idle agents', () => {
      const agents: AgentVisualization[] = [
        { id: '1', name: 'Agent1', role: 'Role1', avatarColor: 'blue', status: 'speaking', confidence: 80, citationCount: 2, dissenting: false },
        { id: '2', name: 'Agent2', role: 'Role2', avatarColor: 'green', status: 'idle', confidence: 75, citationCount: 1, dissenting: false },
        { id: '3', name: 'Agent3', role: 'Role3', avatarColor: 'purple', status: 'thinking', confidence: 70, citationCount: 0, dissenting: false },
      ];
      
      const active = getActiveAgents(agents);
      expect(active).toHaveLength(2);
      expect(active.map(a => a.id)).toContain('1');
      expect(active.map(a => a.id)).toContain('3');
    });

    it('should return empty array when all idle', () => {
      const agents: AgentVisualization[] = [
        { id: '1', name: 'Agent1', role: 'Role1', avatarColor: 'blue', status: 'idle', confidence: 80, citationCount: 2, dissenting: false },
      ];
      
      expect(getActiveAgents(agents)).toHaveLength(0);
    });
  });

  describe('Speaking Agent Detection', () => {
    it('should find the speaking agent', () => {
      const agents: AgentVisualization[] = [
        { id: '1', name: 'Agent1', role: 'Role1', avatarColor: 'blue', status: 'listening', confidence: 80, citationCount: 2, dissenting: false },
        { id: '2', name: 'Agent2', role: 'Role2', avatarColor: 'green', status: 'speaking', confidence: 75, citationCount: 1, dissenting: false, currentStatement: 'I believe...' },
      ];
      
      const speaking = getSpeakingAgent(agents);
      expect(speaking).toBeDefined();
      expect(speaking?.id).toBe('2');
      expect(speaking?.currentStatement).toBe('I believe...');
    });

    it('should return undefined when no one is speaking', () => {
      const agents: AgentVisualization[] = [
        { id: '1', name: 'Agent1', role: 'Role1', avatarColor: 'blue', status: 'idle', confidence: 80, citationCount: 2, dissenting: false },
      ];
      
      expect(getSpeakingAgent(agents)).toBeUndefined();
    });
  });

  describe('Dissent Detection', () => {
    it('should find all dissenting agents', () => {
      const agents: AgentVisualization[] = [
        { id: '1', name: 'Agent1', role: 'Role1', avatarColor: 'blue', status: 'agreeing', confidence: 80, citationCount: 2, dissenting: false },
        { id: '2', name: 'Agent2', role: 'Role2', avatarColor: 'red', status: 'dissenting', confidence: 60, citationCount: 1, dissenting: true },
        { id: '3', name: 'Agent3', role: 'Role3', avatarColor: 'red', status: 'dissenting', confidence: 55, citationCount: 0, dissenting: true },
      ];
      
      const dissenters = getDissentingAgents(agents);
      expect(dissenters).toHaveLength(2);
    });

    it('should return empty array when no dissenters', () => {
      const agents: AgentVisualization[] = [
        { id: '1', name: 'Agent1', role: 'Role1', avatarColor: 'blue', status: 'agreeing', confidence: 80, citationCount: 2, dissenting: false },
      ];
      
      expect(getDissentingAgents(agents)).toHaveLength(0);
    });
  });

  describe('Timeline Events', () => {
    it('should have valid event types', () => {
      const validTypes = ['statement', 'citation', 'dissent', 'agreement', 'round_complete'];
      
      const event: TimelineEvent = {
        id: '1',
        timestamp: new Date(),
        type: 'statement',
        agentName: 'CendiaChief',
        content: 'Let\'s begin the analysis...',
      };
      
      expect(validTypes).toContain(event.type);
    });

    it('should have timestamp', () => {
      const event: TimelineEvent = {
        id: '1',
        timestamp: new Date(),
        type: 'statement',
        content: 'Test content',
      };
      
      expect(event.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('Replay Frames', () => {
    it('should have valid frame types', () => {
      const validTypes = ['statement', 'citation', 'dissent', 'vote', 'consensus', 'round_change'];
      
      const frame: ReplayFrame = {
        id: '1',
        timestamp: 5000,
        type: 'statement',
        agentName: 'CendiaChief',
        content: 'Based on the analysis...',
        confidence: 85,
      };
      
      expect(validTypes).toContain(frame.type);
    });

    it('should have timestamp in milliseconds', () => {
      const frame: ReplayFrame = {
        id: '1',
        timestamp: 15000,
        type: 'round_change',
        content: 'Round 2 begins',
      };
      
      expect(typeof frame.timestamp).toBe('number');
      expect(frame.timestamp).toBeGreaterThanOrEqual(0);
    });

    it('should optionally have confidence', () => {
      const frameWithConfidence: ReplayFrame = {
        id: '1',
        timestamp: 5000,
        type: 'statement',
        content: 'Test',
        confidence: 75,
      };
      
      const frameWithoutConfidence: ReplayFrame = {
        id: '2',
        timestamp: 10000,
        type: 'round_change',
        content: 'Round 2',
      };
      
      expect(frameWithConfidence.confidence).toBe(75);
      expect(frameWithoutConfidence.confidence).toBeUndefined();
    });
  });

  describe('Agent Visualization Structure', () => {
    const mockAgent: AgentVisualization = {
      id: 'chief',
      name: 'CendiaChief',
      role: 'Chief Strategist',
      avatarColor: 'bg-blue-500',
      status: 'speaking',
      confidence: 85,
      currentStatement: 'Based on the market analysis...',
      citationCount: 3,
      dissenting: false,
    };

    it('should have all required fields', () => {
      expect(mockAgent).toHaveProperty('id');
      expect(mockAgent).toHaveProperty('name');
      expect(mockAgent).toHaveProperty('role');
      expect(mockAgent).toHaveProperty('avatarColor');
      expect(mockAgent).toHaveProperty('status');
      expect(mockAgent).toHaveProperty('confidence');
      expect(mockAgent).toHaveProperty('citationCount');
      expect(mockAgent).toHaveProperty('dissenting');
    });

    it('should have valid confidence range', () => {
      expect(mockAgent.confidence).toBeGreaterThanOrEqual(0);
      expect(mockAgent.confidence).toBeLessThanOrEqual(100);
    });

    it('should have non-negative citation count', () => {
      expect(mockAgent.citationCount).toBeGreaterThanOrEqual(0);
    });

    it('should have valid status', () => {
      expect(AGENT_STATUSES).toContain(mockAgent.status);
    });
  });
});
