/**
 * API Module Tests
 * Tests for compliance, cortex, pillars, websocket API clients
 * @module lib/api/__tests__/api-modules.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch globally
const mockFetch = vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({ success: true, data: {} }),
});
vi.stubGlobal('fetch', mockFetch);

// Mock socket.io-client
vi.mock('socket.io-client', () => ({
  io: vi.fn().mockReturnValue({
    connected: false,
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
    disconnect: vi.fn(),
    connect: vi.fn(),
  }),
}));

// Mock client module for compliance/cortex
vi.mock('../client', () => ({
  api: {
    get: vi.fn().mockResolvedValue({ success: true, data: {} }),
    post: vi.fn().mockResolvedValue({ success: true, data: {} }),
    put: vi.fn().mockResolvedValue({ success: true, data: {} }),
    patch: vi.fn().mockResolvedValue({ success: true, data: {} }),
    delete: vi.fn().mockResolvedValue({ success: true, data: {} }),
  },
  tokenManager: {
    getAccessToken: vi.fn().mockReturnValue('test-token'),
    isAuthenticated: vi.fn().mockReturnValue(true),
  },
}));

// ============================================================================
// Compliance API
// ============================================================================
import { complianceApi } from '../compliance';

describe('complianceApi', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should export complianceApi object', () => {
    expect(complianceApi).toBeDefined();
  });

  it('should have getFrameworks method', () => {
    expect(typeof complianceApi.getFrameworks).toBe('function');
  });

  it('should have getSummary method', () => {
    expect(typeof complianceApi.getSummary).toBe('function');
  });

  it('should have getAssessments method', () => {
    expect(typeof complianceApi.getAssessments).toBe('function');
  });

  it('should call getFrameworks', async () => {
    const result = await complianceApi.getFrameworks();
    expect(result).toBeDefined();
  });

  it('should call getSummary', async () => {
    const result = await complianceApi.getSummary('org-1');
    expect(result).toBeDefined();
  });
});

// ============================================================================
// Cortex API
// ============================================================================
import { cortexApi } from '../cortex';

describe('cortexApi', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should export cortexApi object', () => {
    expect(cortexApi).toBeDefined();
  });

  it('should have query method', () => {
    expect(typeof cortexApi.query).toBe('function');
  });

  it('should have analyze method', () => {
    expect(typeof cortexApi.analyze).toBe('function');
  });

  it('should have getStatus method', () => {
    expect(typeof cortexApi.getStatus).toBe('function');
  });

  it('should call query', async () => {
    const result = await cortexApi.query({
      intent: 'natural_language',
      query: 'test query',
    });
    expect(result).toBeDefined();
  });

  it('should call getStatus', async () => {
    const result = await cortexApi.getStatus();
    expect(result).toBeDefined();
  });
});

// ============================================================================
// Pillars API
// ============================================================================
import { helmApi, lineageApi, predictApi, flowApi, healthPillarApi, guardApi, ethicsApi, agentsApi } from '../pillars';

describe('Pillars API', () => {
  beforeEach(() => { 
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, data: {} }),
    });
  });

  describe('helmApi', () => {
    it('should have getDashboard method', () => {
      expect(typeof helmApi.getDashboard).toBe('function');
    });

    it('should have getMetrics method', () => {
      expect(typeof helmApi.getMetrics).toBe('function');
    });

    it('should have getAlerts method', () => {
      expect(typeof helmApi.getAlerts).toBe('function');
    });

    it('should call getDashboard', async () => {
      await helmApi.getDashboard('org-1');
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/helm/dashboard'));
    });

    it('should call getMetrics', async () => {
      await helmApi.getMetrics('org-1');
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/helm/metrics'));
    });

    it('should call getMetrics with category', async () => {
      await helmApi.getMetrics('org-1', 'financial');
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('category=financial'));
    });
  });

  describe('lineageApi', () => {
    it('should have getGraph method', () => {
      expect(typeof lineageApi.getGraph).toBe('function');
    });
  });

  describe('predictApi', () => {
    it('should have getModels method', () => {
      expect(typeof predictApi.getModels).toBe('function');
    });
  });

  describe('flowApi', () => {
    it('should have getStats method', () => {
      expect(typeof flowApi.getStats).toBe('function');
    });
  });

  describe('healthPillarApi', () => {
    it('should have getStatus method', () => {
      expect(typeof healthPillarApi.getStatus).toBe('function');
    });
  });

  describe('guardApi', () => {
    it('should have getPosture method', () => {
      expect(typeof guardApi.getPosture).toBe('function');
    });
  });

  describe('ethicsApi', () => {
    it('should have getStats method', () => {
      expect(typeof ethicsApi.getStats).toBe('function');
    });
  });

  describe('agentsApi', () => {
    it('should have getStats method', () => {
      expect(typeof agentsApi.getStats).toBe('function');
    });
  });
});

// ============================================================================
// WebSocket Client
// ============================================================================
import { wsClient } from '../websocket';

describe('WebSocket Client', () => {
  it('should export wsClient', () => {
    expect(wsClient).toBeDefined();
  });

  it('should have connect method', () => {
    expect(typeof wsClient.connect).toBe('function');
  });

  it('should have disconnect method', () => {
    expect(typeof wsClient.disconnect).toBe('function');
  });

  it('should have on method', () => {
    expect(typeof wsClient.on).toBe('function');
  });

  it('should have off method', () => {
    expect(typeof wsClient.off).toBe('function');
  });

  it('should have emit method', () => {
    expect(typeof wsClient.emit).toBe('function');
  });
});
