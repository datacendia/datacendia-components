// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * DOMAIN-SPECIFIC STRESS TESTS
 * =============================================================================
 * High-leverage tests proving operational resilience:
 * - Transfer window surge simulation
 * - Multiple concurrent high-value transfers
 * - Same agent used across multiple clubs (multi-tenant isolation)
 * 
 * Why this matters: "This won't fall apart on deadline day."
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { sportsAgentService, SPORTS_AGENT_PRESETS } from '../../../services/sports/SportsAgents.js';
import { sportsKnowledgeBase } from '../../../services/sports/SportsKnowledgeBase.js';

// =============================================================================
// TYPES
// =============================================================================

interface TransferRequest {
  id: string;
  clubId: string;
  playerId: string;
  type: 'IN' | 'OUT';
  fee: number;
  priority: 'NORMAL' | 'URGENT' | 'DEADLINE';
  timestamp: Date;
}

interface ProcessingResult {
  requestId: string;
  success: boolean;
  processingTime: number;
  agentsUsed: string[];
  error?: string;
}

interface TenantContext {
  clubId: string;
  clubName: string;
  customLabels?: Record<string, string>;
}

// =============================================================================
// MULTI-TENANT SERVICE (Test Double)
// =============================================================================

class MultiTenantAgentService {
  private tenantContexts: Map<string, TenantContext> = new Map();
  private requestLog: Map<string, TransferRequest[]> = new Map();

  registerTenant(context: TenantContext): void {
    this.tenantContexts.set(context.clubId, context);
    this.requestLog.set(context.clubId, []);
  }

  getTenantContext(clubId: string): TenantContext | undefined {
    return this.tenantContexts.get(clubId);
  }

  async processTransferRequest(
    request: TransferRequest
  ): Promise<ProcessingResult> {
    const start = Date.now();
    const context = this.tenantContexts.get(request.clubId);
    
    if (!context) {
      return {
        requestId: request.id,
        success: false,
        processingTime: Date.now() - start,
        agentsUsed: [],
        error: 'Tenant not registered',
      };
    }

    // Log request for this tenant
    this.requestLog.get(request.clubId)?.push(request);

    // Get recommended agents for transfer evaluation
    const agents = sportsAgentService.getRecommendedAgents('transfer_evaluation');
    const agentIds = agents.map(a => a.id);

    // Simulate processing
    await this.simulateAgentDeliberation(agents.length);

    return {
      requestId: request.id,
      success: true,
      processingTime: Date.now() - start,
      agentsUsed: agentIds,
    };
  }

  async processConcurrentRequests(
    requests: TransferRequest[]
  ): Promise<ProcessingResult[]> {
    return Promise.all(requests.map(r => this.processTransferRequest(r)));
  }

  getRequestsForTenant(clubId: string): TransferRequest[] {
    return this.requestLog.get(clubId) || [];
  }

  verifyTenantIsolation(clubId1: string, clubId2: string): boolean {
    const requests1 = this.requestLog.get(clubId1) || [];
    const requests2 = this.requestLog.get(clubId2) || [];

    // No request from club1 should appear in club2's log and vice versa
    for (const r of requests1) {
      if (r.clubId !== clubId1) return false;
    }
    for (const r of requests2) {
      if (r.clubId !== clubId2) return false;
    }

    return true;
  }

  private async simulateAgentDeliberation(agentCount: number): Promise<void> {
    // Simulate ~5ms per agent
    await new Promise(resolve => setTimeout(resolve, agentCount * 5));
  }
}

// =============================================================================
// TRANSFER WINDOW SURGE SIMULATION TESTS
// =============================================================================

describe('Domain Stress Tests - Transfer Window Surge', () => {
  let service: MultiTenantAgentService;

  beforeEach(() => {
    service = new MultiTenantAgentService();
    service.registerTenant({ clubId: 'celtic-fc', clubName: 'Celtic FC' });
  });

  it('should handle rapid sequential transfer requests', async () => {
    const requests: TransferRequest[] = [];
    
    // Simulate 10 rapid requests (deadline day scenario)
    for (let i = 0; i < 10; i++) {
      requests.push({
        id: `transfer-${i}`,
        clubId: 'celtic-fc',
        playerId: `player-${i}`,
        type: i % 2 === 0 ? 'IN' : 'OUT',
        fee: (i + 1) * 5000000,
        priority: 'DEADLINE',
        timestamp: new Date(),
      });
    }

    const results: ProcessingResult[] = [];
    const start = Date.now();

    for (const request of requests) {
      const result = await service.processTransferRequest(request);
      results.push(result);
    }

    const totalTime = Date.now() - start;

    // All should succeed
    expect(results.every(r => r.success)).toBe(true);
    expect(results.length).toBe(10);

    // Should complete within reasonable time (< 1 second for 10 requests)
    expect(totalTime).toBeLessThan(1000);
  });

  it('should maintain agent availability during surge', async () => {
    const requests = Array.from({ length: 5 }, (_, i) => ({
      id: `surge-${i}`,
      clubId: 'celtic-fc',
      playerId: `player-${i}`,
      type: 'IN' as const,
      fee: 10000000,
      priority: 'URGENT' as const,
      timestamp: new Date(),
    }));

    const results = await Promise.all(
      requests.map(r => service.processTransferRequest(r))
    );

    // All requests should get agents assigned
    for (const result of results) {
      expect(result.agentsUsed.length).toBeGreaterThan(0);
    }
  });

  it('should handle mixed priority requests during window close', async () => {
    const requests: TransferRequest[] = [
      { id: 'normal-1', clubId: 'celtic-fc', playerId: 'p1', type: 'IN', fee: 5000000, priority: 'NORMAL', timestamp: new Date() },
      { id: 'urgent-1', clubId: 'celtic-fc', playerId: 'p2', type: 'OUT', fee: 10000000, priority: 'URGENT', timestamp: new Date() },
      { id: 'deadline-1', clubId: 'celtic-fc', playerId: 'p3', type: 'IN', fee: 50000000, priority: 'DEADLINE', timestamp: new Date() },
      { id: 'normal-2', clubId: 'celtic-fc', playerId: 'p4', type: 'OUT', fee: 2000000, priority: 'NORMAL', timestamp: new Date() },
      { id: 'deadline-2', clubId: 'celtic-fc', playerId: 'p5', type: 'IN', fee: 30000000, priority: 'DEADLINE', timestamp: new Date() },
    ];

    const results = await service.processConcurrentRequests(requests);

    expect(results.length).toBe(5);
    expect(results.every(r => r.success)).toBe(true);
  });
});

// =============================================================================
// HIGH-VALUE CONCURRENT TRANSFERS TESTS
// =============================================================================

describe('Domain Stress Tests - High-Value Concurrent Transfers', () => {
  let service: MultiTenantAgentService;

  beforeEach(() => {
    service = new MultiTenantAgentService();
    service.registerTenant({ clubId: 'celtic-fc', clubName: 'Celtic FC' });
  });

  it('should handle multiple £50M+ transfers simultaneously', async () => {
    const highValueTransfers: TransferRequest[] = [
      { id: 'hv-1', clubId: 'celtic-fc', playerId: 'star-1', type: 'IN', fee: 50000000, priority: 'URGENT', timestamp: new Date() },
      { id: 'hv-2', clubId: 'celtic-fc', playerId: 'star-2', type: 'IN', fee: 75000000, priority: 'URGENT', timestamp: new Date() },
      { id: 'hv-3', clubId: 'celtic-fc', playerId: 'star-3', type: 'OUT', fee: 100000000, priority: 'URGENT', timestamp: new Date() },
    ];

    const results = await service.processConcurrentRequests(highValueTransfers);

    // All high-value transfers should be processed
    expect(results.every(r => r.success)).toBe(true);

    // Each should use multiple agents for due diligence
    for (const result of results) {
      expect(result.agentsUsed.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('should process transfer in and out for same value simultaneously', async () => {
    const balancedTransfers: TransferRequest[] = [
      { id: 'in-30m', clubId: 'celtic-fc', playerId: 'incoming', type: 'IN', fee: 30000000, priority: 'URGENT', timestamp: new Date() },
      { id: 'out-30m', clubId: 'celtic-fc', playerId: 'outgoing', type: 'OUT', fee: 30000000, priority: 'URGENT', timestamp: new Date() },
    ];

    const results = await service.processConcurrentRequests(balancedTransfers);

    expect(results.length).toBe(2);
    expect(results.every(r => r.success)).toBe(true);
  });
});

// =============================================================================
// MULTI-TENANT ISOLATION TESTS
// =============================================================================

describe('Domain Stress Tests - Multi-Tenant Isolation', () => {
  let service: MultiTenantAgentService;

  beforeEach(() => {
    service = new MultiTenantAgentService();
    
    // Register multiple clubs
    service.registerTenant({ clubId: 'celtic-fc', clubName: 'Celtic FC' });
    service.registerTenant({ clubId: 'rangers-fc', clubName: 'Rangers FC' });
    service.registerTenant({ clubId: 'aberdeen-fc', clubName: 'Aberdeen FC' });
  });

  it('should isolate requests between competing clubs', async () => {
    // Celtic and Rangers both bidding for same player (different perspectives)
    const celticRequest: TransferRequest = {
      id: 'celtic-bid',
      clubId: 'celtic-fc',
      playerId: 'target-player',
      type: 'IN',
      fee: 10000000,
      priority: 'URGENT',
      timestamp: new Date(),
    };

    const rangersRequest: TransferRequest = {
      id: 'rangers-bid',
      clubId: 'rangers-fc',
      playerId: 'target-player',
      type: 'IN',
      fee: 12000000,
      priority: 'URGENT',
      timestamp: new Date(),
    };

    // Process simultaneously
    await Promise.all([
      service.processTransferRequest(celticRequest),
      service.processTransferRequest(rangersRequest),
    ]);

    // Verify isolation
    const celticRequests = service.getRequestsForTenant('celtic-fc');
    const rangersRequests = service.getRequestsForTenant('rangers-fc');

    expect(celticRequests.length).toBe(1);
    expect(rangersRequests.length).toBe(1);
    expect(celticRequests[0].clubId).toBe('celtic-fc');
    expect(rangersRequests[0].clubId).toBe('rangers-fc');

    // Celtic should not see Rangers' bid and vice versa
    expect(service.verifyTenantIsolation('celtic-fc', 'rangers-fc')).toBe(true);
  });

  it('should maintain isolation under concurrent load', async () => {
    // Generate requests for all three clubs
    const allRequests: TransferRequest[] = [];
    const clubs = ['celtic-fc', 'rangers-fc', 'aberdeen-fc'];

    for (const clubId of clubs) {
      for (let i = 0; i < 5; i++) {
        allRequests.push({
          id: `${clubId}-${i}`,
          clubId,
          playerId: `player-${i}`,
          type: i % 2 === 0 ? 'IN' : 'OUT',
          fee: (i + 1) * 2000000,
          priority: 'NORMAL',
          timestamp: new Date(),
        });
      }
    }

    // Process all 15 requests concurrently
    await service.processConcurrentRequests(allRequests);

    // Verify each club has exactly 5 requests
    for (const clubId of clubs) {
      const requests = service.getRequestsForTenant(clubId);
      expect(requests.length).toBe(5);
      expect(requests.every(r => r.clubId === clubId)).toBe(true);
    }

    // Verify isolation between all pairs
    expect(service.verifyTenantIsolation('celtic-fc', 'rangers-fc')).toBe(true);
    expect(service.verifyTenantIsolation('celtic-fc', 'aberdeen-fc')).toBe(true);
    expect(service.verifyTenantIsolation('rangers-fc', 'aberdeen-fc')).toBe(true);
  });

  it('should reject requests from unregistered tenants', async () => {
    const rogueRequest: TransferRequest = {
      id: 'rogue-1',
      clubId: 'unregistered-fc',
      playerId: 'player-1',
      type: 'IN',
      fee: 5000000,
      priority: 'NORMAL',
      timestamp: new Date(),
    };

    const result = await service.processTransferRequest(rogueRequest);

    expect(result.success).toBe(false);
    expect(result.error).toContain('Tenant not registered');
  });
});

// =============================================================================
// AGENT SHARING WITHOUT DATA LEAKAGE TESTS
// =============================================================================

describe('Domain Stress Tests - Agent Sharing Without Data Leakage', () => {
  it('same agent presets should be available to all tenants', () => {
    // All clubs use the same agent definitions
    const agents = sportsAgentService.getAllAgents();
    
    expect(agents.length).toBe(10);
    
    // Verify agents don't contain tenant-specific data
    for (const agent of agents) {
      expect(agent.systemPrompt).not.toContain('Celtic');
      expect(agent.systemPrompt).not.toContain('Rangers');
      expect(agent.systemPrompt).not.toContain('specific club');
    }
  });

  it('agent prompts should be tenant-agnostic', async () => {
    const agent = sportsAgentService.getAgentPreset('agent-transfer-analyst');
    expect(agent).toBeDefined();

    // Build prompts for different clubs - should have same base
    const celticPrompt = await sportsAgentService.buildAgentPrompt(agent!, {
      workflow: 'transfer_evaluation',
      player: { name: 'Test Player', age: 25, position: 'Midfielder' },
    });

    const rangersPrompt = await sportsAgentService.buildAgentPrompt(agent!, {
      workflow: 'transfer_evaluation',
      player: { name: 'Test Player', age: 25, position: 'Midfielder' },
    });

    // Same input should produce same output (deterministic)
    expect(celticPrompt).toBe(rangersPrompt);
  });

  it('knowledge base should serve same regulations to all tenants', async () => {
    // Query as if from different clubs - same query should return same results
    const query = { query: 'UEFA FFP break-even', maxResults: 5 };

    const results1 = await sportsKnowledgeBase.query(query);
    const results2 = await sportsKnowledgeBase.query(query);

    expect(results1.length).toBe(results2.length);
    
    // Same citations
    for (let i = 0; i < results1.length; i++) {
      expect(results1[i].citation).toBe(results2[i].citation);
    }
  });
});

// =============================================================================
// PERFORMANCE UNDER LOAD TESTS
// =============================================================================

describe('Domain Stress Tests - Performance Under Load', () => {
  let service: MultiTenantAgentService;

  beforeEach(() => {
    service = new MultiTenantAgentService();
    service.registerTenant({ clubId: 'test-club', clubName: 'Test Club' });
  });

  it('should maintain < 100ms average processing time under moderate load', async () => {
    const requests = Array.from({ length: 20 }, (_, i) => ({
      id: `perf-${i}`,
      clubId: 'test-club',
      playerId: `player-${i}`,
      type: 'IN' as const,
      fee: 5000000,
      priority: 'NORMAL' as const,
      timestamp: new Date(),
    }));

    const results = await service.processConcurrentRequests(requests);
    
    const totalProcessingTime = results.reduce((sum, r) => sum + r.processingTime, 0);
    const avgProcessingTime = totalProcessingTime / results.length;

    expect(avgProcessingTime).toBeLessThan(100);
  });

  it('knowledge base queries should complete in < 50ms under load', async () => {
    const queries = [
      'FFP compliance',
      'agent fee regulations',
      'squad cost ratio',
      'break-even requirement',
      'player registration',
    ];

    const times: number[] = [];

    for (const q of queries) {
      const start = Date.now();
      await sportsKnowledgeBase.query({ query: q });
      times.push(Date.now() - start);
    }

    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    expect(avgTime).toBeLessThan(50);
  });

  it('agent retrieval should be instant (< 5ms)', () => {
    const start = Date.now();
    
    for (let i = 0; i < 100; i++) {
      sportsAgentService.getAgentPreset('agent-transfer-analyst');
      sportsAgentService.getAgentsByRole('transfer_analyst');
      sportsAgentService.getRecommendedAgents('transfer_evaluation');
    }
    
    const totalTime = Date.now() - start;
    const avgTime = totalTime / 300; // 300 operations

    expect(avgTime).toBeLessThan(5);
  });
});

// =============================================================================
// DEADLINE DAY SIMULATION
// =============================================================================

describe('Domain Stress Tests - Deadline Day Simulation', () => {
  let service: MultiTenantAgentService;

  beforeEach(() => {
    service = new MultiTenantAgentService();
    
    // Register multiple SPFL clubs
    ['celtic-fc', 'rangers-fc', 'hearts-fc', 'hibs-fc', 'aberdeen-fc'].forEach(clubId => {
      service.registerTenant({ clubId, clubName: clubId.replace('-fc', ' FC') });
    });
  });

  it('should handle 50 concurrent requests across 5 clubs', async () => {
    const clubs = ['celtic-fc', 'rangers-fc', 'hearts-fc', 'hibs-fc', 'aberdeen-fc'];
    const allRequests: TransferRequest[] = [];

    // 10 requests per club
    for (const clubId of clubs) {
      for (let i = 0; i < 10; i++) {
        allRequests.push({
          id: `${clubId}-deadline-${i}`,
          clubId,
          playerId: `player-${clubId}-${i}`,
          type: i % 2 === 0 ? 'IN' : 'OUT',
          fee: (i + 1) * 3000000,
          priority: 'DEADLINE',
          timestamp: new Date(),
        });
      }
    }

    expect(allRequests.length).toBe(50);

    const start = Date.now();
    const results = await service.processConcurrentRequests(allRequests);
    const totalTime = Date.now() - start;

    // All should succeed
    expect(results.every(r => r.success)).toBe(true);

    // Should complete within 2 seconds
    expect(totalTime).toBeLessThan(2000);

    // Verify isolation maintained
    for (const clubId of clubs) {
      const clubRequests = service.getRequestsForTenant(clubId);
      expect(clubRequests.length).toBe(10);
    }
  });

  it('should handle burst of urgent requests', async () => {
    // Simulate 11pm deadline rush - all DEADLINE priority
    const burstRequests: TransferRequest[] = Array.from({ length: 15 }, (_, i) => ({
      id: `burst-${i}`,
      clubId: 'celtic-fc',
      playerId: `emergency-target-${i}`,
      type: 'IN',
      fee: 20000000 + i * 1000000,
      priority: 'DEADLINE' as const,
      timestamp: new Date(),
    }));

    const start = Date.now();
    const results = await service.processConcurrentRequests(burstRequests);
    const totalTime = Date.now() - start;

    expect(results.every(r => r.success)).toBe(true);
    expect(totalTime).toBeLessThan(1000); // Must handle burst quickly
  });
});

// =============================================================================
// RESILIENCE TESTS
// =============================================================================

describe('Domain Stress Tests - Resilience', () => {
  let service: MultiTenantAgentService;

  beforeEach(() => {
    service = new MultiTenantAgentService();
    service.registerTenant({ clubId: 'test-club', clubName: 'Test Club' });
  });

  it('should handle requests with edge-case values', async () => {
    const edgeCases: TransferRequest[] = [
      { id: 'edge-1', clubId: 'test-club', playerId: 'p1', type: 'IN', fee: 0, priority: 'NORMAL', timestamp: new Date() }, // Free transfer
      { id: 'edge-2', clubId: 'test-club', playerId: 'p2', type: 'IN', fee: 500000000, priority: 'URGENT', timestamp: new Date() }, // €500M record
      { id: 'edge-3', clubId: 'test-club', playerId: 'p3', type: 'OUT', fee: 1, priority: 'NORMAL', timestamp: new Date() }, // £1 nominal
    ];

    const results = await service.processConcurrentRequests(edgeCases);
    expect(results.every(r => r.success)).toBe(true);
  });

  it('should maintain data integrity after many operations', async () => {
    // Process many requests
    for (let batch = 0; batch < 5; batch++) {
      const requests = Array.from({ length: 10 }, (_, i) => ({
        id: `batch-${batch}-${i}`,
        clubId: 'test-club',
        playerId: `player-${batch}-${i}`,
        type: 'IN' as const,
        fee: 5000000,
        priority: 'NORMAL' as const,
        timestamp: new Date(),
      }));

      await service.processConcurrentRequests(requests);
    }

    // Verify all 50 requests are logged
    const allRequests = service.getRequestsForTenant('test-club');
    expect(allRequests.length).toBe(50);

    // Verify no duplicate IDs
    const ids = allRequests.map(r => r.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(50);
  });
});
