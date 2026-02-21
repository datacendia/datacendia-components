// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Marketing Studio API Routes Tests
 */

import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
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

import marketingStudioRoutes from '../../routes/marketing-studio.js';

const app = express();
app.use(express.json());
app.use('/api/v1/marketing-studio', marketingStudioRoutes);

describe('Marketing Studio API', () => {
  describe('POST /video-script', () => {
    it('should generate video script with valid input', async () => {
      const response = await request(app)
        .post('/api/v1/marketing-studio/video-script')
        .send({
          topic: 'How Datacendia prevents AI hallucinations',
          duration: 60,
          targetAudience: 'enterprise-cto',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('title');
      expect(response.body.data).toHaveProperty('script');
      expect(response.body.data.script).toHaveProperty('hook');
      expect(response.body.data.script).toHaveProperty('problem');
      expect(response.body.data.script).toHaveProperty('solution');
      expect(response.body.data.script).toHaveProperty('demo');
      expect(response.body.data.script).toHaveProperty('cta');
      expect(response.body.data).toHaveProperty('visualNotes');
      expect(Array.isArray(response.body.data.visualNotes)).toBe(true);
    }, 30000);

    it('should handle different durations', async () => {
      const durations = [30, 60, 90, 120, 300];
      
      for (const duration of durations) {
        const response = await request(app)
          .post('/api/v1/marketing-studio/video-script')
          .send({
            topic: 'Test topic',
            duration,
            targetAudience: 'enterprise-cto',
          });

        expect(response.status).toBe(200);
        expect(response.body.data.duration).toContain(duration.toString());
      }
    }, 60000);

    it('should handle different target audiences', async () => {
      const audiences = ['enterprise-cto', 'enterprise-cfo', 'compliance-officer', 'legal-counsel'];
      
      for (const audience of audiences) {
        const response = await request(app)
          .post('/api/v1/marketing-studio/video-script')
          .send({
            topic: 'Test topic',
            duration: 60,
            targetAudience: audience,
          });

        expect(response.status).toBe(200);
        expect(response.body.data.targetAudience).toBe(audience);
      }
    }, 90000);
  });

  describe('POST /image-prompt', () => {
    it('should generate image prompt for Midjourney', async () => {
      const response = await request(app)
        .post('/api/v1/marketing-studio/image-prompt')
        .send({
          purpose: 'Hero image showing AI agents deliberating',
          platform: 'midjourney',
          style: 'professional-tech',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('prompt');
      expect(response.body.data.platform).toBe('midjourney');
      expect(response.body.data).toHaveProperty('aspectRatio');
    }, 20000);

    it('should generate different prompts for different platforms', async () => {
      const platforms = ['midjourney', 'dall-e', 'stable-diffusion'];
      
      for (const platform of platforms) {
        const response = await request(app)
          .post('/api/v1/marketing-studio/image-prompt')
          .send({
            purpose: 'Test image',
            platform,
            style: 'professional-tech',
          });

        expect(response.status).toBe(200);
        expect(response.body.data.platform).toBe(platform);
        
        if (platform === 'stable-diffusion') {
          expect(response.body.data).toHaveProperty('negativePrompt');
        }
      }
    }, 60000);
  });

  describe('POST /pitch-deck', () => {
    it('should generate pitch deck with slides', async () => {
      const response = await request(app)
        .post('/api/v1/marketing-studio/pitch-deck')
        .send({
          audience: 'Series A investors',
          focus: 'Healthcare vertical',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('slides');
      expect(Array.isArray(response.body.data.slides)).toBe(true);
      expect(response.body.data.slides.length).toBeGreaterThanOrEqual(10);
      
      const firstSlide = response.body.data.slides[0];
      expect(firstSlide).toHaveProperty('slideNumber');
      expect(firstSlide).toHaveProperty('title');
      expect(firstSlide).toHaveProperty('content');
      expect(firstSlide).toHaveProperty('visualSuggestion');
      expect(firstSlide).toHaveProperty('speakerNotes');
    }, 40000);
  });

  describe('POST /copy', () => {
    it('should generate marketing copy for email', async () => {
      const response = await request(app)
        .post('/api/v1/marketing-studio/copy')
        .send({
          type: 'email',
          topic: 'Launching Healthcare vertical',
          tone: 'professional',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('headline');
      expect(response.body.data).toHaveProperty('body');
      expect(response.body.data).toHaveProperty('cta');
      expect(response.body.data).toHaveProperty('variations');
      expect(Array.isArray(response.body.data.variations)).toBe(true);
      expect(response.body.data.variations.length).toBeGreaterThanOrEqual(3);
    }, 30000);

    it('should handle different copy types', async () => {
      const types = ['email', 'linkedin', 'twitter', 'blog', 'landing-page'];
      
      for (const type of types) {
        const response = await request(app)
          .post('/api/v1/marketing-studio/copy')
          .send({
            type,
            topic: 'Test topic',
            tone: 'professional',
          });

        expect(response.status).toBe(200);
        expect(response.body.data.type).toBe(type);
      }
    }, 90000);
  });

  describe('POST /social-media-calendar', () => {
    it('should generate 30-day content calendar', async () => {
      const response = await request(app)
        .post('/api/v1/marketing-studio/social-media-calendar')
        .send({
          themes: ['AI governance', 'Compliance', 'Trust'],
          platforms: ['LinkedIn', 'Twitter'],
          postsPerWeek: 5,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    }, 40000);
  });
});
