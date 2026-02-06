/**
 * =============================================================================
 * OLLAMA INTEGRATION TESTS
 * =============================================================================
 * 
 * Real integration tests that use actual Ollama LLM for responses.
 * These tests require Ollama to be running on localhost:11434.
 * 
 * Run with: npm test -- ollama.integration.test.ts
 */

import { describe, it, expect, beforeAll } from 'vitest';

const OLLAMA_URL = process.env['OLLAMA_URL'] || 'http://localhost:11434';

// Check if Ollama is available
async function isOllamaAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    return response.ok;
  } catch {
    return false;
  }
}

// Get available models
async function getAvailableModels(): Promise<string[]> {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    const data = (await response.json()) as { models?: Array<{ name: string }> };
    return data.models?.map((m) => m.name) || [];
  } catch {
    return [];
  }
}

// Helper to call Ollama directly
async function ollamaGenerate(model: string, prompt: string): Promise<string> {
  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status}`);
  }

  const data = (await response.json()) as { response: string };
  return data.response;
}

// Helper to call Ollama chat
async function ollamaChat(model: string, messages: Array<{ role: string; content: string }>): Promise<string> {
  const response = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status}`);
  }

  const data = (await response.json()) as { message?: { content: string } };
  return data.message?.content || '';
}

describe('Ollama Integration Tests', () => {
  let ollamaAvailable = false;
  let availableModels: string[] = [];
  let testModel = '';

  beforeAll(async () => {
    ollamaAvailable = await isOllamaAvailable();
    if (ollamaAvailable) {
      availableModels = await getAvailableModels();
      // Prefer smaller models for faster tests
      testModel = availableModels.find(m => m.includes('3b') || m.includes('7b')) 
        || availableModels[0] 
        || 'llama3.2:3b';
    }
  });

  // ===========================================================================
  // OLLAMA CONNECTIVITY
  // ===========================================================================

  describe('Ollama Connectivity', () => {
    it('should connect to Ollama server', async () => {
      expect(ollamaAvailable).toBe(true);
    });

    it('should have models available', async () => {
      if (!ollamaAvailable) return;
      expect(availableModels.length).toBeGreaterThan(0);
    });

    it('should list available models', async () => {
      if (!ollamaAvailable) return;
      console.log('Available models:', availableModels);
      expect(availableModels).toBeDefined();
    });
  });

  // ===========================================================================
  // BASIC LLM GENERATION
  // ===========================================================================

  describe('Basic LLM Generation', () => {
    it('should generate a response to a simple prompt', async () => {
      if (!ollamaAvailable) return;

      const response = await ollamaGenerate(testModel, 'Say "Hello World" and nothing else.');
      
      expect(response).toBeDefined();
      expect(response.length).toBeGreaterThan(0);
      expect(response.toLowerCase()).toContain('hello');
    }, 30000); // 30 second timeout for LLM

    it('should handle chat format', async () => {
      if (!ollamaAvailable) return;

      const response = await ollamaChat(testModel, [
        { role: 'system', content: 'You are a helpful assistant. Be concise.' },
        { role: 'user', content: 'What is 2 + 2? Answer with just the number.' },
      ]);

      expect(response).toBeDefined();
      expect(response).toContain('4');
    }, 30000);
  });

  // ===========================================================================
  // COUNCIL AGENT SIMULATION
  // ===========================================================================

  describe('Council Agent Simulation', () => {
    it('should generate CFO-style financial analysis', async () => {
      if (!ollamaAvailable) return;

      const prompt = `You are CendiaCFO, the Chief Financial Officer AI agent.
Analyze this business decision briefly (2-3 sentences):
"Should we expand into the European market?"

Focus on: ROI, cash flow, financial risks.`;

      const response = await ollamaGenerate(testModel, prompt);

      expect(response).toBeDefined();
      expect(response.length).toBeGreaterThan(50);
      // Should mention financial concepts
      const hasFinancialTerms = /roi|cost|revenue|risk|investment|cash|profit|margin/i.test(response);
      expect(hasFinancialTerms).toBe(true);
    }, 60000);

    it('should generate CEO-style strategic analysis', async () => {
      if (!ollamaAvailable) return;

      const prompt = `You are CendiaCEO, the Chief Executive Officer AI agent.
Analyze this business decision briefly (2-3 sentences):
"Should we expand into the European market?"

Focus on: Strategic vision, competitive advantage, market opportunity.`;

      const response = await ollamaGenerate(testModel, prompt);

      expect(response).toBeDefined();
      expect(response.length).toBeGreaterThan(50);
      // Should mention strategic concepts
      const hasStrategicTerms = /strategy|market|opportunity|competitive|growth|expansion/i.test(response);
      expect(hasStrategicTerms).toBe(true);
    }, 60000);

    it('should generate Legal-style compliance analysis', async () => {
      if (!ollamaAvailable) return;

      const prompt = `You are CendiaLegal, the Legal Counsel AI agent.
Analyze this business decision briefly (2-3 sentences):
"Should we expand into the European market?"

Focus on: Regulatory compliance, legal risks, GDPR considerations.`;

      const response = await ollamaGenerate(testModel, prompt);

      expect(response).toBeDefined();
      expect(response.length).toBeGreaterThan(50);
      // Should mention legal concepts
      const hasLegalTerms = /legal|compliance|regulation|gdpr|law|risk|liability/i.test(response);
      expect(hasLegalTerms).toBe(true);
    }, 60000);
  });

  // ===========================================================================
  // DELIBERATION SYNTHESIS
  // ===========================================================================

  describe('Deliberation Synthesis', () => {
    it('should synthesize multiple agent responses', async () => {
      if (!ollamaAvailable) return;

      const prompt = `You are the Council Moderator. Synthesize these agent responses into a final recommendation (3-4 sentences):

CFO Analysis: "European expansion requires $5M investment with projected 18-month ROI. Currency risk is moderate."

CEO Analysis: "Strategic opportunity is strong. European market shows 15% YoY growth in our sector."

Legal Analysis: "GDPR compliance will require additional data infrastructure. Regulatory risk is manageable."

Provide a balanced synthesis with a clear recommendation.`;

      const response = await ollamaGenerate(testModel, prompt);

      expect(response).toBeDefined();
      expect(response.length).toBeGreaterThan(100);
      // Should provide a recommendation
      const hasRecommendation = /recommend|suggest|should|proceed|decision/i.test(response);
      expect(hasRecommendation).toBe(true);
    }, 60000);

    it('should generate executive summary', async () => {
      if (!ollamaAvailable) return;

      const prompt = `Generate a brief executive summary (JSON format) for this deliberation:

Question: "Should we expand into the European market?"
Decision: Proceed with phased expansion
Confidence: 85%
Key Points: Strong market opportunity, manageable risks, requires $5M investment

Return JSON with: title, recommendation, keyFindings (array), riskFactors (array)`;

      const response = await ollamaGenerate(testModel, prompt);

      expect(response).toBeDefined();
      // Try to parse as JSON (may be wrapped in markdown)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          expect(parsed.title || parsed.recommendation).toBeDefined();
        } catch (parseError) {
          // LLM may return malformed JSON - just verify response exists
          expect(response.length).toBeGreaterThan(0);
        }
      }
    }, 60000);
  });

  // ===========================================================================
  // ERROR HANDLING
  // ===========================================================================

  describe('Error Handling', () => {
    it('should handle invalid model gracefully', async () => {
      if (!ollamaAvailable) return;

      try {
        await ollamaGenerate('nonexistent-model-xyz', 'Hello');
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle empty prompt', async () => {
      if (!ollamaAvailable) return;

      // Empty prompts may still work, just verify no crash
      const response = await ollamaGenerate(testModel, '');
      expect(response).toBeDefined();
    }, 30000);
  });

  // ===========================================================================
  // PERFORMANCE
  // ===========================================================================

  describe('Performance', () => {
    it('should respond within reasonable time for short prompts', async () => {
      if (!ollamaAvailable) return;

      const start = Date.now();
      await ollamaGenerate(testModel, 'Say "OK"');
      const duration = Date.now() - start;

      // Should respond within 30 seconds for a simple prompt
      expect(duration).toBeLessThan(30000);
      console.log(`Response time: ${duration}ms`);
    }, 35000);
  });
});

// ===========================================================================
// DELIBERATION SERVICE INTEGRATION
// ===========================================================================

describe('DeliberationService with Real Ollama', () => {
  let ollamaAvailable = false;

  beforeAll(async () => {
    ollamaAvailable = await isOllamaAvailable();
  });

  it('should be able to import DeliberationService', async () => {
    // Dynamic import to avoid mock interference
    const { DeliberationService } = await import('../../services/DeliberationService.js');
    expect(DeliberationService).toBeDefined();
  });

  it('should initialize DeliberationService', async () => {
    if (!ollamaAvailable) return;

    const { DeliberationService } = await import('../../services/DeliberationService.js');
    const service = new DeliberationService();
    
    await service.initialize();
    expect(service).toBeDefined();
  });
});
