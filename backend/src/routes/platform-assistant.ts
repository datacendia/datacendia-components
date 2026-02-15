// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Platform AI Assistant API Routes
 * 
 * Conversational AI that guides users through platform workflows
 * Provides step-by-step instructions for any scenario
 */

import { Router, Request, Response } from 'express';
import ollamaService from '../services/ollama.js';

const router = Router();

/**
 * Platform knowledge base - maps user intents to workflows
 */
const PLATFORM_KNOWLEDGE = {
  routes: {
    council: '/cortex/council',
    deliberation: '/cortex/council',
    visualization: '/cortex/council/visualization',
    replayTheater: '/cortex/council/replay-theater',
    decisionPackets: '/cortex/governance/decision-packets',
    regulatorsReceipt: '/cortex/compliance/regulators-receipt',
    continuousCompliance: '/cortex/compliance/continuous-monitor',
    crossJurisdiction: '/cortex/compliance/cross-jurisdiction',
    postQuantumKMS: '/cortex/enterprise/post-quantum-kms',
    carbonAware: '/cortex/enterprise/carbon-aware',
    adversarialRedTeam: '/cortex/enterprise/adversarial-redteam',
    evidenceVault: '/cortex/enterprise/evidence-vault',
    marketingStudio: '/admin/marketing-studio',
    envConfig: '/admin/env-config',
  },
  
  workflows: {
    'make a decision': {
      service: 'The Council',
      route: '/cortex/council',
      steps: [
        {
          step: 1,
          title: 'Navigate to The Council',
          description: 'Open the multi-agent deliberation interface',
          service: 'The Council',
          route: '/cortex/council',
          whatToClick: 'Council in the sidebar',
          expectedResult: 'You see the Council interface with agent selection',
        },
        {
          step: 2,
          title: 'Enter your question',
          description: 'Type the decision you need to make in the question box',
          service: 'The Council',
          route: '/cortex/council',
          whatToSay: 'Your decision question (e.g., "Should we hire Sarah Chen as VP of Engineering?")',
          whatToClick: 'The large text input at the top',
          expectedResult: 'Your question appears in the input field',
        },
        {
          step: 3,
          title: 'Select agents',
          description: 'Choose which AI agents should deliberate on this decision',
          service: 'The Council',
          route: '/cortex/council',
          whatToClick: 'Agent cards to select them (CEO, CFO, Legal, Risk, etc.)',
          expectedResult: 'Selected agents show a checkmark',
        },
        {
          step: 4,
          title: 'Start deliberation',
          description: 'Initiate the multi-agent deliberation process',
          service: 'The Council',
          route: '/cortex/council',
          whatToClick: '"Ask The Council" button',
          expectedResult: 'Agents begin deliberating, responses stream in real-time',
        },
        {
          step: 5,
          title: 'Review recommendation',
          description: 'Read the synthesis and individual agent perspectives',
          service: 'The Council',
          route: '/cortex/council',
          expectedResult: 'You see the final recommendation with confidence score and reasoning',
        },
      ],
    },
    
    'check compliance': {
      service: 'Continuous Compliance Monitor',
      route: '/cortex/compliance/continuous-monitor',
      steps: [
        {
          step: 1,
          title: 'Open Compliance Monitor',
          description: 'Navigate to the real-time compliance monitoring dashboard',
          service: 'Continuous Compliance',
          route: '/cortex/compliance/continuous-monitor',
          whatToClick: 'Compliance → Continuous Monitor in navigation',
          expectedResult: 'Dashboard shows 10 compliance frameworks',
        },
        {
          step: 2,
          title: 'Select framework',
          description: 'Click on the framework you want to check (EU AI Act, GDPR, HIPAA, etc.)',
          service: 'Continuous Compliance',
          route: '/cortex/compliance/continuous-monitor',
          whatToClick: 'Framework card (e.g., "EU AI Act")',
          expectedResult: 'Framework details expand showing control status',
        },
        {
          step: 3,
          title: 'Review controls',
          description: 'See which controls are compliant, which need attention',
          service: 'Continuous Compliance',
          route: '/cortex/compliance/continuous-monitor',
          expectedResult: 'Green checkmarks for compliant, yellow/red for issues',
        },
        {
          step: 4,
          title: 'Run scan (optional)',
          description: 'Trigger a fresh compliance scan',
          service: 'Continuous Compliance',
          route: '/cortex/compliance/continuous-monitor',
          whatToClick: 'Refresh icon on framework card',
          expectedResult: 'Scan runs, status updates in real-time',
        },
      ],
    },
    
    'generate regulator receipt': {
      service: "Regulator's Receipt Generator",
      route: '/cortex/compliance/regulators-receipt',
      steps: [
        {
          step: 1,
          title: 'Open Receipt Generator',
          description: 'Navigate to the regulator-grade evidence export tool',
          service: "Regulator's Receipt",
          route: '/cortex/compliance/regulators-receipt',
          whatToClick: 'Compliance → Regulator\'s Receipt in navigation',
          expectedResult: 'Receipt generator interface opens',
        },
        {
          step: 2,
          title: 'Select decision',
          description: 'Choose which decision to generate a receipt for',
          service: "Regulator's Receipt",
          route: '/cortex/compliance/regulators-receipt',
          whatToClick: 'Decision from the list or search',
          expectedResult: 'Decision details load',
        },
        {
          step: 3,
          title: 'Generate receipt',
          description: 'Create the cryptographically signed evidence package',
          service: "Regulator's Receipt",
          route: '/cortex/compliance/regulators-receipt',
          whatToClick: '"Generate Receipt" button',
          expectedResult: 'PDF generates with Merkle tree, signatures, and evidence chain',
        },
        {
          step: 4,
          title: 'Download receipt',
          description: 'Save the court-admissible PDF',
          service: "Regulator's Receipt",
          route: '/cortex/compliance/regulators-receipt',
          whatToClick: '"Download PDF" button',
          expectedResult: 'PDF downloads with all evidence and cryptographic proofs',
        },
      ],
    },
    
    'create custom agent': {
      service: 'The Council',
      route: '/cortex/council',
      steps: [
        {
          step: 1,
          title: 'Open The Council',
          description: 'Navigate to the Council interface',
          service: 'The Council',
          route: '/cortex/council',
          whatToClick: 'Council in sidebar',
          expectedResult: 'Council interface opens',
        },
        {
          step: 2,
          title: 'Open agent creator',
          description: 'Access the custom agent creation tool',
          service: 'The Council',
          route: '/cortex/council',
          whatToClick: '"+ Create Custom Agent" button',
          expectedResult: 'Agent creation modal opens',
        },
        {
          step: 3,
          title: 'Define agent',
          description: 'Fill in agent name, role, description, and expertise',
          service: 'The Council',
          route: '/cortex/council',
          whatToSay: 'Agent name (e.g., "Supply Chain Expert"), role, description, expertise areas',
          expectedResult: 'Form fields populate',
        },
        {
          step: 4,
          title: 'Set system prompt',
          description: 'Define how the agent should think and respond',
          service: 'The Council',
          route: '/cortex/council',
          whatToSay: 'System prompt (e.g., "You are a supply chain optimization expert. Focus on cost reduction and delivery speed.")',
          expectedResult: 'System prompt saved',
        },
        {
          step: 5,
          title: 'Save agent',
          description: 'Create the custom agent',
          service: 'The Council',
          route: '/cortex/council',
          whatToClick: '"Create Agent" button',
          expectedResult: 'Agent appears in your custom agents section',
        },
      ],
    },
    
    'generate marketing content': {
      service: 'Marketing Studio',
      route: '/admin/marketing-studio',
      steps: [
        {
          step: 1,
          title: 'Open Marketing Studio',
          description: 'Navigate to the AI-powered marketing content generator',
          service: 'Marketing Studio',
          route: '/admin/marketing-studio',
          whatToClick: 'Admin → Marketing Studio',
          expectedResult: 'Marketing Studio opens with 4 tabs',
        },
        {
          step: 2,
          title: 'Choose content type',
          description: 'Select what you want to generate',
          service: 'Marketing Studio',
          route: '/admin/marketing-studio',
          whatToClick: 'Tab: Video Scripts, Image Prompts, Pitch Decks, or Marketing Copy',
          expectedResult: 'Selected tab becomes active',
        },
        {
          step: 3,
          title: 'Fill in details',
          description: 'Provide topic, audience, and preferences',
          service: 'Marketing Studio',
          route: '/admin/marketing-studio',
          whatToSay: 'Topic, target audience, duration/style/tone',
          expectedResult: 'Form fields populate',
        },
        {
          step: 4,
          title: 'Generate content',
          description: 'AI creates your marketing content',
          service: 'Marketing Studio',
          route: '/admin/marketing-studio',
          whatToClick: '"Generate" button',
          expectedResult: 'AI generates script/prompt/deck/copy in 5-15 seconds',
        },
        {
          step: 5,
          title: 'Copy or download',
          description: 'Use the generated content',
          service: 'Marketing Studio',
          route: '/admin/marketing-studio',
          whatToClick: 'Copy icon or Download icon',
          expectedResult: 'Content copied to clipboard or downloaded as file',
        },
      ],
    },
  },
};

/**
 * POST /api/v1/platform-assistant/query
 * Answer user questions and provide step-by-step workflows
 */
router.post('/query', async (req: Request, res: Response) => {
  try {
    const { query, conversationHistory } = req.body;

    const systemPrompt = `You are the Datacendia Platform AI Assistant. Your job is to help users navigate the platform and complete tasks.

PLATFORM CAPABILITIES:
- The Council: Multi-agent deliberation for decisions
- Decision Packets: Cryptographically signed decision records
- Regulator's Receipt: Court-admissible evidence exports
- Compliance Monitoring: Real-time compliance across 10 frameworks (EU AI Act, GDPR, HIPAA, SOC 2, ISO 27001, NIST AI RMF, NIST 800-53, PCI-DSS, FedRAMP, CCPA)
- Cross-Jurisdiction: 17-jurisdiction compliance engine
- Evidence Vault: Immutable audit trail storage
- Marketing Studio: AI-powered content generation (videos, images, pitches, copy)
- Post-Quantum KMS: Quantum-resistant cryptography
- Carbon-Aware Scheduler: ESG-optimized AI workload scheduling
- Adversarial Red Team: Find failure modes before they happen
- CendiaReplay™: Watch past deliberations
- Environment Config: Edit .env file via UI
- 20 Industry Verticals: Healthcare, Finance, Legal, Defense, Government, Insurance, Energy, Manufacturing, Retail, Aerospace, Agriculture, Automotive, Construction, Hospitality, Media, Non-Profit, Pharmaceutical, Professional Services, Telecom, Transportation

When a user asks how to do something, provide:
1. A clear, conversational explanation
2. A structured workflow with step-by-step instructions
3. Specific routes, button names, and what to say/click
4. Expected results for each step

Output as JSON:
{
  "response": "Conversational explanation of how to do it",
  "workflow": [
    {
      "step": 1,
      "title": "Step title",
      "description": "What this step does",
      "service": "Service name",
      "route": "/cortex/...",
      "whatToSay": "Exact text to enter (if applicable)",
      "whatToClick": "Exact button/element to click",
      "expectedResult": "What should happen"
    }
  ],
  "quickActions": [
    {
      "label": "Action label",
      "route": "/cortex/...",
      "icon": "emoji"
    }
  ]
}

Be specific, actionable, and helpful. Use the exact route paths from the platform.`;

    const conversationContext = conversationHistory
      ? conversationHistory.map((m: any) => `${m.role}: ${m.content}`).join('\n')
      : '';

    const fullPrompt = `${systemPrompt}

${conversationContext ? `Previous conversation:\n${conversationContext}\n\n` : ''}User question: ${query}

Provide a helpful response with step-by-step workflow.`;

    const response = await ollamaService.generate(fullPrompt, {
      model: 'qwen2.5:7b',
      options: { temperature: 0.7, num_predict: 2000 },
      format: 'json',
    });

    const assistantResponse = JSON.parse(response);

    res.json({ success: true, data: assistantResponse });
  } catch (error) {
    console.error('Error in platform assistant:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process query',
      data: {
        response: "I'm having trouble right now. Try navigating directly using the sidebar menu, or rephrase your question.",
        workflow: [],
        quickActions: [],
      }
    });
  }
});

/**
 * GET /api/v1/platform-assistant/suggestions
 * Get contextual suggestions based on current page
 */
router.get('/suggestions', async (req: Request, res: Response) => {
  try {
    const { currentRoute } = req.query;

    const suggestions = {
      '/cortex/council': [
        'How do I select the right agents for my decision?',
        'What council modes are available?',
        'How do I create a custom agent?',
      ],
      '/cortex/compliance/continuous-monitor': [
        'How do I run a compliance scan?',
        'What frameworks are monitored?',
        'How do I fix a compliance issue?',
      ],
      '/admin/marketing-studio': [
        'How do I generate a video script?',
        'What image styles are available?',
        'How do I create a pitch deck?',
      ],
    };

    const routeSuggestions = (suggestions as Record<string, string[]>)[currentRoute as string] || [
      'How do I make a decision?',
      'How do I check compliance?',
      'How do I generate marketing content?',
    ];

    res.json({ success: true, data: routeSuggestions });
  } catch (error) {
    console.error('Error getting suggestions:', error);
    res.status(500).json({ success: false, error: 'Failed to get suggestions' });
  }
});

export default router;
