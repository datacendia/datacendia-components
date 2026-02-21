// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Platform AI Assistant API Routes Tests
 */

import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';

// Mock ollamaService so tests don't hit real Ollama (which takes 30-60s per generation)
vi.mock('../../services/ollama.js', () => {
  return {
    default: {
      isAvailable: vi.fn().mockResolvedValue(false),
      generate: vi.fn().mockRejectedValue(new Error('mocked')),
      resolveModel: vi.fn().mockResolvedValue('qwen2.5:7b'),
    },
  };
});

import platformAssistantRoutes from '../../routes/platform-assistant.js';

const app = express();
app.use(express.json());
app.use('/api/v1/platform-assistant', platformAssistantRoutes);

describe('Platform AI Assistant API', () => {
  describe('POST /query', () => {
    it('should respond to user query with workflow', async () => {
      const response = await request(app)
        .post('/api/v1/platform-assistant/query')
        .send({
          query: 'How do I make a decision?',
          conversationHistory: [],
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('response');
      expect(response.body.data).toHaveProperty('workflow');
      expect(Array.isArray(response.body.data.workflow)).toBe(true);
    }, 30000);

    it('should provide step-by-step workflow with required fields', async () => {
      const response = await request(app)
        .post('/api/v1/platform-assistant/query')
        .send({
          query: 'How do I check compliance?',
          conversationHistory: [],
        });

      expect(response.status).toBe(200);
      
      if (response.body.data.workflow && response.body.data.workflow.length > 0) {
        const firstStep = response.body.data.workflow[0];
        expect(firstStep).toHaveProperty('step');
        expect(firstStep).toHaveProperty('title');
        expect(firstStep).toHaveProperty('description');
        expect(firstStep).toHaveProperty('service');
        expect(firstStep).toHaveProperty('route');
      }
    }, 30000);

    it('should handle conversation history', async () => {
      const response = await request(app)
        .post('/api/v1/platform-assistant/query')
        .send({
          query: 'What about compliance?',
          conversationHistory: [
            { role: 'user', content: 'How do I make a decision?' },
            { role: 'assistant', content: 'Use The Council...' },
          ],
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    }, 30000);

    it('should provide quick actions', async () => {
      const response = await request(app)
        .post('/api/v1/platform-assistant/query')
        .send({
          query: 'What can I do?',
          conversationHistory: [],
        });

      expect(response.status).toBe(200);
      
      if (response.body.data.quickActions) {
        expect(Array.isArray(response.body.data.quickActions)).toBe(true);
        
        if (response.body.data.quickActions.length > 0) {
          const action = response.body.data.quickActions[0];
          expect(action).toHaveProperty('label');
          expect(action).toHaveProperty('route');
          expect(action).toHaveProperty('icon');
        }
      }
    }, 30000);
  });

  describe('GET /suggestions', () => {
    it('should return contextual suggestions', async () => {
      const response = await request(app)
        .get('/api/v1/platform-assistant/suggestions')
        .query({ currentRoute: '/cortex/council' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should return default suggestions for unknown routes', async () => {
      const response = await request(app)
        .get('/api/v1/platform-assistant/suggestions')
        .query({ currentRoute: '/unknown/route' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});
