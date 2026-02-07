/**
 * Marketing Studio API Routes
 * 
 * AI-powered marketing content generation:
 * - Video scripts
 * - Image prompts (DALL-E, Midjourney, Stable Diffusion)
 * - Pitch decks
 * - Marketing copy (email, social, blog, landing pages)
 */

import { Router, Request, Response } from 'express';
import ollamaService from '../services/ollama.js';

const router = Router();

/**
 * POST /api/v1/marketing-studio/video-script
 * Generate video script with timing and visual notes
 */
router.post('/video-script', async (req: Request, res: Response) => {
  try {
    const { topic, duration, targetAudience } = req.body;

    const prompt = `You are a professional video scriptwriter for enterprise software marketing.

Generate a ${duration}-second video script for: "${topic}"
Target audience: ${targetAudience}

Structure the script with precise timing:
1. HOOK (0-5s): Attention-grabbing opening
2. PROBLEM (5-20s): Pain point the audience faces
3. SOLUTION (20-40s): How Datacendia solves it
4. DEMO (40-55s): Concrete example or visual
5. CTA (55-${duration}s): Clear call to action

Include:
- Visual notes for each section
- Voiceover pacing notes
- B-roll suggestions

Output as JSON:
{
  "title": "...",
  "duration": "${duration}s",
  "targetAudience": "${targetAudience}",
  "script": {
    "hook": "...",
    "problem": "...",
    "solution": "...",
    "demo": "...",
    "cta": "..."
  },
  "visualNotes": ["...", "..."],
  "voiceoverNotes": "..."
}`;

    const response = await ollamaService.generate(prompt, {
      model: 'qwen2.5:7b',
      options: { temperature: 0.7, num_predict: 2000 },
      format: 'json',
    });

    const script = JSON.parse(response);
    script.id = `vs-${Date.now()}`;

    res.json({ success: true, data: script });
  } catch (error) {
    console.error('Error generating video script:', error);
    res.status(500).json({ success: false, error: 'Failed to generate video script' });
  }
});

/**
 * POST /api/v1/marketing-studio/image-prompt
 * Generate optimized image prompts for AI image generators
 */
router.post('/image-prompt', async (req: Request, res: Response) => {
  try {
    const { purpose, platform, style } = req.body;

    const platformGuidance = {
      'midjourney': 'Midjourney v6 format: descriptive, artistic, use --ar for aspect ratio, --style for variations',
      'dall-e': 'DALL-E 3 format: clear, detailed descriptions, natural language, specify style and mood',
      'stable-diffusion': 'Stable Diffusion format: detailed prompt + negative prompt, use quality tags, specify style',
    };

    const prompt = `You are an expert AI image prompt engineer for ${platform}.

Generate an optimized ${platform} prompt for: "${purpose}"
Style: ${style}

${platformGuidance[platform]}

Output as JSON:
{
  "purpose": "${purpose}",
  "platform": "${platform}",
  "prompt": "...",
  "negativePrompt": "..." (for Stable Diffusion only),
  "style": "${style}",
  "aspectRatio": "16:9" or "1:1" or "9:16"
}

Make the prompt highly detailed, specific, and optimized for ${platform}.`;

    const response = await ollamaService.generate(prompt, {
      model: 'qwen2.5:7b',
      options: { temperature: 0.6, num_predict: 1000 },
      format: 'json',
    });

    const imagePrompt = JSON.parse(response);
    imagePrompt.id = `ip-${Date.now()}`;

    res.json({ success: true, data: imagePrompt });
  } catch (error) {
    console.error('Error generating image prompt:', error);
    res.status(500).json({ success: false, error: 'Failed to generate image prompt' });
  }
});

/**
 * POST /api/v1/marketing-studio/pitch-deck
 * Generate complete pitch deck with slides, content, and speaker notes
 */
router.post('/pitch-deck', async (req: Request, res: Response) => {
  try {
    const { audience, focus } = req.body;

    const prompt = `You are a professional pitch deck consultant for enterprise software.

Generate a pitch deck for Datacendia's Sovereign Intelligence Platform.
Audience: ${audience}
Focus area: ${focus}

Create 10-12 slides with:
- Slide title
- 3-5 bullet points per slide
- Visual suggestion (what to show)
- Speaker notes (what to say)

Output as JSON:
{
  "audience": "${audience}",
  "slides": [
    {
      "slideNumber": 1,
      "title": "...",
      "content": ["...", "...", "..."],
      "visualSuggestion": "...",
      "speakerNotes": "..."
    }
  ]
}

Focus on:
- Problem/solution clarity
- Concrete metrics and examples
- Differentiation from competitors
- Clear ROI and value proposition
- Credible, non-hype language`;

    const response = await ollamaService.generate(prompt, {
      model: 'qwen2.5:7b',
      options: { temperature: 0.7, num_predict: 4000 },
      format: 'json',
    });

    const deck = JSON.parse(response);
    deck.id = `pd-${Date.now()}`;

    res.json({ success: true, data: deck });
  } catch (error) {
    console.error('Error generating pitch deck:', error);
    res.status(500).json({ success: false, error: 'Failed to generate pitch deck' });
  }
});

/**
 * POST /api/v1/marketing-studio/copy
 * Generate marketing copy for various channels
 */
router.post('/copy', async (req: Request, res: Response) => {
  try {
    const { type, topic, tone } = req.body;

    const typeGuidance = {
      'email': 'Email campaign: Subject line + preview text + body (300-500 words) + CTA',
      'linkedin': 'LinkedIn post: Hook + value + CTA (max 1300 chars, use line breaks)',
      'twitter': 'Twitter thread: 5-7 tweets, each under 280 chars, numbered',
      'blog': 'Blog post: Title + intro + 3-4 sections + conclusion (800-1200 words)',
      'landing-page': 'Landing page: Hero headline + subheadline + 3 benefits + CTA',
    };

    const prompt = `You are a professional B2B marketing copywriter for enterprise software.

Generate ${type} copy for Datacendia.
Topic: ${topic}
Tone: ${tone}

${typeGuidance[type]}

Output as JSON:
{
  "type": "${type}",
  "headline": "...",
  "body": "...",
  "cta": "...",
  "variations": ["alternative headline 1", "alternative headline 2", "alternative headline 3"]
}

Guidelines:
- No hype or marketing fluff
- Concrete, specific claims
- Focus on business outcomes
- Use "Radical Transparency" positioning
- Avoid buzzwords like "revolutionary", "game-changing"`;

    const response = await ollamaService.generate(prompt, {
      model: 'qwen2.5:7b',
      options: { temperature: 0.7, num_predict: 3000 },
      format: 'json',
    });

    const copy = JSON.parse(response);
    copy.id = `mc-${Date.now()}`;

    res.json({ success: true, data: copy });
  } catch (error) {
    console.error('Error generating marketing copy:', error);
    res.status(500).json({ success: false, error: 'Failed to generate marketing copy' });
  }
});

/**
 * POST /api/v1/marketing-studio/social-media-calendar
 * Generate 30-day social media content calendar
 */
router.post('/social-media-calendar', async (req: Request, res: Response) => {
  try {
    const { themes, platforms, postsPerWeek } = req.body;

    const prompt = `Generate a 30-day social media content calendar for Datacendia.

Themes: ${themes.join(', ')}
Platforms: ${platforms.join(', ')}
Posts per week: ${postsPerWeek}

For each post, provide:
- Date
- Platform
- Post type (educational, product, case study, thought leadership)
- Content (platform-optimized)
- Hashtags
- Visual suggestion

Output as JSON array of posts.`;

    const response = await ollamaService.generate(prompt, {
      model: 'qwen2.5:7b',
      options: { temperature: 0.7, num_predict: 4000 },
      format: 'json',
    });

    const calendar = JSON.parse(response);

    res.json({ success: true, data: calendar });
  } catch (error) {
    console.error('Error generating social media calendar:', error);
    res.status(500).json({ success: false, error: 'Failed to generate calendar' });
  }
});

export default router;
