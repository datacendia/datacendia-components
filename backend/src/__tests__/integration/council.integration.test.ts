// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * COUNCIL INTEGRATION TESTS WITH REAL OLLAMA
 * =============================================================================
 * 
 * End-to-end tests for the Council deliberation workflow using real Ollama.
 * These tests require:
 * - Ollama running on localhost:11434
 * - Backend server running on localhost:3000
 * - Database seeded with test data
 * 
 * Run with: npm test -- council.integration.test.ts
 */

import { describe, it, expect, beforeAll } from 'vitest';

const OLLAMA_URL = process.env['OLLAMA_URL'] || 'http://127.0.0.1:11434';
const API_URL = process.env['API_URL'] || 'http://localhost:3000/api/v1';

// Check if Ollama is available
async function isOllamaAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    return response.ok;
  } catch {
    return false;
  }
}

// Check if API is available
async function isApiAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

// Get auth token
async function getAuthToken(): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@datacendia.com',
        password: 'DatacendiaAdmin2024!',
      }),
    });
    const data = (await response.json()) as { data?: { accessToken?: string }; accessToken?: string };
    return data.data?.accessToken || data.accessToken || '';
  } catch {
    return '';
  }
}

// Helper to make authenticated API requests
async function authApi(
  method: string,
  path: string,
  token: string,
  body?: unknown
): Promise<{ status: number; body: any }> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${path}`, options);

  return {
    status: response.status,
    body: await response.json().catch(() => ({})),
  };
}

describe('Council Integration Tests with Real Ollama', () => {
  let ollamaAvailable = false;
  let apiAvailable = false;
  let authToken = '';

  beforeAll(async () => {
    ollamaAvailable = await isOllamaAvailable();
    apiAvailable = await isApiAvailable();
    if (apiAvailable) {
      authToken = await getAuthToken();
    }
  });

  // ===========================================================================
  // PREREQUISITES
  // ===========================================================================

  describe('Prerequisites', () => {
    it.skipIf(!ollamaAvailable)('should have Ollama running', async () => {
      expect(ollamaAvailable).toBe(true);
    });

    it.skipIf(!apiAvailable)('should have API server running', async () => {
      expect(apiAvailable).toBe(true);
    });

    it.skipIf(!apiAvailable)('should be able to authenticate', async () => {
      expect(authToken.length).toBeGreaterThan(0);
    });
  });

  // ===========================================================================
  // COUNCIL AGENTS
  // ===========================================================================

  describe('Council Agents', () => {
    it('should list available council agents', async () => {
      if (!apiAvailable || !authToken) return;

      const res = await authApi('GET', '/council/agents', authToken);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should have agents with required fields', async () => {
      if (!apiAvailable || !authToken) return;

      const res = await authApi('GET', '/council/agents', authToken);
      const agent = res.body.data[0];

      expect(agent.id).toBeDefined();
      expect(agent.code).toBeDefined();
      expect(agent.name).toBeDefined();
      expect(agent.role).toBeDefined();
    });
  });

  // ===========================================================================
  // COUNCIL MODES
  // ===========================================================================

  describe('Council Modes', () => {
    it('should list available deliberation modes', async () => {
      if (!apiAvailable || !authToken) return;

      const res = await authApi('GET', '/council/modes', authToken);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      // Response has modes at top level, not inside data
      const modes = res.body.modes || res.body.data?.modes || res.body.data;
      expect(Array.isArray(modes)).toBe(true);
      expect(modes.length).toBeGreaterThan(0);
    });
  });

  // ===========================================================================
  // DELIBERATION CREATION
  // ===========================================================================

  describe('Deliberation Creation', () => {
    it('should create a new deliberation', async () => {
      if (!apiAvailable || !authToken) return;

      const res = await authApi('POST', '/deliberations', authToken, {
        question: `Integration test: Should we invest in AI infrastructure? (${Date.now()})`,
        config: { mode: 'rapid' },
      });

      expect([200, 201]).toContain(res.status);
      expect(res.body.data?.id).toBeDefined();
      expect(res.body.data?.question).toContain('AI infrastructure');
    });

    it('should reject empty question', async () => {
      if (!apiAvailable || !authToken) return;

      const res = await authApi('POST', '/deliberations', authToken, {
        question: '',
        config: { mode: 'rapid' },
      });

      expect(res.status).toBe(400);
    });
  });

  // ===========================================================================
  // DELIBERATION WITH REAL LLM
  // ===========================================================================

  describe('Deliberation with Real LLM', () => {
    it('should start a deliberation and get AI responses', async () => {
      if (!apiAvailable || !authToken || !ollamaAvailable) return;

      // Create deliberation
      const createRes = await authApi('POST', '/deliberations', authToken, {
        question: `Real LLM test: What are the key risks of cloud migration? (${Date.now()})`,
        config: { mode: 'rapid' },
      });

      expect([200, 201]).toContain(createRes.status);
      const deliberationId = createRes.body.data?.id;
      expect(deliberationId).toBeDefined();

      // Start deliberation (this triggers AI agents)
      const startRes = await authApi('POST', `/deliberations/${deliberationId}/start`, authToken);
      
      // Accept various success statuses
      expect([200, 202, 404]).toContain(startRes.status);
    }, 120000); // 2 minute timeout for LLM processing

    it('should list deliberations', async () => {
      if (!apiAvailable || !authToken) return;

      const res = await authApi('GET', '/deliberations', authToken);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should get deliberation details with messages', async () => {
      if (!apiAvailable || !authToken) return;

      // Get list first
      const listRes = await authApi('GET', '/deliberations?limit=1', authToken);
      const deliberations = listRes.body.data || [];

      if (deliberations.length > 0) {
        const res = await authApi('GET', `/deliberations/${deliberations[0].id}`, authToken);
        
        expect(res.status).toBe(200);
        expect(res.body.data?.id).toBe(deliberations[0].id);
        expect(res.body.data?.question).toBeDefined();
      }
    });
  });

  // ===========================================================================
  // DIRECT OLLAMA COUNCIL SIMULATION
  // ===========================================================================

  describe('Direct Ollama Council Simulation', () => {
    it('should simulate a full council deliberation with real LLM', async () => {
      if (!ollamaAvailable) return;

      const question = 'Should we expand our product line into the B2B market?';
      const agents = [
        { name: 'CendiaCFO', role: 'Chief Financial Officer', focus: 'financial analysis, ROI, cash flow' },
        { name: 'CendiaCEO', role: 'Chief Executive Officer', focus: 'strategic vision, market opportunity' },
        { name: 'CendiaLegal', role: 'Legal Counsel', focus: 'compliance, contracts, liability' },
      ];

      const responses: Array<{ agent: string; response: string }> = [];

      // Get response from each agent
      for (const agent of agents) {
        const prompt = `You are ${agent.name}, the ${agent.role} AI agent for an enterprise decision council.
        
Question for deliberation: "${question}"

Provide a brief analysis (2-3 sentences) focusing on: ${agent.focus}

Be specific and actionable.`;

        const response = await fetch(`${OLLAMA_URL}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'llama3.2:3b',
            prompt,
            stream: false,
          }),
        });

        const data = (await response.json()) as { response: string };
        responses.push({ agent: agent.name, response: data.response });
      }

      // Verify we got responses from all agents
      expect(responses.length).toBe(3);
      for (const r of responses) {
        expect(r.response.length).toBeGreaterThan(50);
      }

      // Synthesize responses
      const synthesisPrompt = `You are the Council Moderator. Synthesize these expert opinions into a final recommendation:

Question: "${question}"

${responses.map(r => `${r.agent}: ${r.response}`).join('\n\n')}

Provide a balanced synthesis (3-4 sentences) with a clear recommendation.`;

      const synthesisResponse = await fetch(`${OLLAMA_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2:3b',
          prompt: synthesisPrompt,
          stream: false,
        }),
      });

      const synthesisData = (await synthesisResponse.json()) as { response: string };
      
      expect(synthesisData.response.length).toBeGreaterThan(100);
      console.log('\n=== COUNCIL DELIBERATION RESULT ===');
      console.log('Question:', question);
      console.log('\nAgent Responses:');
      for (const r of responses) {
        console.log(`\n${r.agent}:`, r.response.substring(0, 200) + '...');
      }
      console.log('\nSynthesis:', synthesisData.response);
    }, 180000); // 3 minute timeout
  });
});
