/**
 * =============================================================================
 * DEMO SEED API ROUTES
 * =============================================================================
 * Endpoints for seeding the database with demo data for presentations.
 * 
 * Routes:
 * - POST /api/v1/demo/seed - Seed all demo data
 * - POST /api/v1/demo/seed/:scenario - Seed specific scenario
 * - DELETE /api/v1/demo/clear - Clear all demo data
 * - GET /api/v1/demo/status - Check demo data status
 */

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// =============================================================================
// DEMO DATA DEFINITIONS
// =============================================================================

const DEMO_ORGANIZATION = {
  id: 'demo-org-001',
  name: 'Apex Industries (Demo)',
  industry: 'Manufacturing',
  employees: 12000,
  isDemo: true
};

const DEMO_USERS = [
  { id: 'demo-user-001', email: 'demo.ceo@datacendia.com', name: 'Michael Torres', role: 'CEO', isDemo: true },
  { id: 'demo-user-002', email: 'demo.cfo@datacendia.com', name: 'Sarah Chen', role: 'CFO', isDemo: true },
  { id: 'demo-user-003', email: 'demo.cio@datacendia.com', name: 'James Liu', role: 'CIO', isDemo: true },
  { id: 'demo-user-004', email: 'demo.cro@datacendia.com', name: 'Patricia Williams', role: 'CRO', isDemo: true }
];

const DEMO_DELIBERATIONS = [
  {
    id: 'demo-dlb-001',
    question: 'Should Apex Industries enter the cyber insurance market with a $50M initial underwriting capacity?',
    context: 'Apex Insurance (regional P&C carrier, $2.1B GWP) is evaluating entry into the cyber insurance market.',
    status: 'COMPLETED',
    outcome: 'CONDITIONAL_APPROVAL',
    createdAt: new Date('2026-01-04T09:00:00Z'),
    completedAt: new Date('2026-01-04T09:47:22Z'),
    isDemo: true
  },
  {
    id: 'demo-dlb-002',
    question: 'Should we proceed with the TechFlow Solutions acquisition for $50M?',
    context: 'Strategic acquisition to expand digital capabilities and enter IoT market.',
    status: 'COMPLETED',
    outcome: 'APPROVED',
    createdAt: new Date('2026-01-03T14:00:00Z'),
    completedAt: new Date('2026-01-03T15:23:45Z'),
    isDemo: true
  },
  {
    id: 'demo-dlb-003',
    question: 'Should we close the Springfield manufacturing plant to consolidate operations?',
    context: 'Springfield plant operating at 47% capacity. Consolidation projected to save $12M annually.',
    status: 'COMPLETED',
    outcome: 'REJECTED',
    createdAt: new Date('2026-01-02T10:00:00Z'),
    completedAt: new Date('2026-01-02T11:45:00Z'),
    isDemo: true
  }
];

const DEMO_AGENT_CONTRIBUTIONS = [
  // Cyber Insurance Deliberation
  { deliberationId: 'demo-dlb-001', agentRole: 'Strategist', vote: 'SUPPORT_WITH_CONDITIONS', confidence: 0.78, reasoning: 'Cyber market growing 25% annually. Recommend phased entry starting with SMB segment.' },
  { deliberationId: 'demo-dlb-001', agentRole: 'CFO', vote: 'SUPPORT_WITH_CONDITIONS', confidence: 0.72, reasoning: 'Break-even in Year 3 under base case. Recommend starting with $25M capacity.' },
  { deliberationId: 'demo-dlb-001', agentRole: 'Risk', vote: 'OPPOSE', confidence: 0.81, reasoning: 'Aggregation risk too high. Single ransomware variant could hit 40% of book.' },
  { deliberationId: 'demo-dlb-001', agentRole: 'Legal', vote: 'SUPPORT_WITH_CONDITIONS', confidence: 0.85, reasoning: 'War exclusion language critical. External counsel review required.' },
  { deliberationId: 'demo-dlb-001', agentRole: 'Red Team', vote: 'SUPPORT_WITH_CONDITIONS', confidence: 0.68, reasoning: 'Worst case: $47M loss (2% probability). Recommend catastrophe reinsurance.' },
  { deliberationId: 'demo-dlb-001', agentRole: 'Arbiter', vote: 'SUPPORT_WITH_CONDITIONS', confidence: 0.76, reasoning: 'APPROVE with conditions: Start at $25M, require MGA partnership, secure reinsurance.' },
  
  // TechFlow Acquisition
  { deliberationId: 'demo-dlb-002', agentRole: 'Strategist', vote: 'SUPPORT', confidence: 0.85, reasoning: 'Strategic fit excellent. IoT market entry critical for long-term growth.' },
  { deliberationId: 'demo-dlb-002', agentRole: 'CFO', vote: 'SUPPORT', confidence: 0.79, reasoning: 'Valuation reasonable at 4x revenue. Synergies achievable within 18 months.' },
  { deliberationId: 'demo-dlb-002', agentRole: 'Risk', vote: 'SUPPORT_WITH_CONDITIONS', confidence: 0.71, reasoning: 'Integration risk manageable. Key person retention critical.' },
  { deliberationId: 'demo-dlb-002', agentRole: 'Legal', vote: 'SUPPORT', confidence: 0.88, reasoning: 'No regulatory concerns. Standard M&A documentation sufficient.' },
  { deliberationId: 'demo-dlb-002', agentRole: 'Arbiter', vote: 'SUPPORT', confidence: 0.82, reasoning: 'Recommend approval with retention packages for key employees.' },
  
  // Springfield Plant Closure
  { deliberationId: 'demo-dlb-003', agentRole: 'CFO', vote: 'SUPPORT', confidence: 0.75, reasoning: '$12M annual savings achievable. Payback in 2 years.' },
  { deliberationId: 'demo-dlb-003', agentRole: 'Risk', vote: 'OPPOSE', confidence: 0.82, reasoning: 'Hidden costs exceed savings. Customer attrition risk high.' },
  { deliberationId: 'demo-dlb-003', agentRole: 'HR', vote: 'OPPOSE', confidence: 0.79, reasoning: '340 employees affected. Morale impact on remaining workforce.' },
  { deliberationId: 'demo-dlb-003', agentRole: 'Operations', vote: 'OPPOSE', confidence: 0.77, reasoning: 'Capacity redistribution will strain other plants.' },
  { deliberationId: 'demo-dlb-003', agentRole: 'Arbiter', vote: 'OPPOSE', confidence: 0.80, reasoning: 'Hidden costs of $24M exceed $12M savings. Recommend lean initiative instead.' }
];

const DEMO_DISSENTS = [
  {
    id: 'demo-dissent-001',
    deliberationId: 'demo-dlb-001',
    agentRole: 'Risk',
    position: 'OPPOSE',
    reasoning: 'Aggregation risk and lack of actuarial history make this a speculative bet.',
    acknowledged: true,
    createdAt: new Date('2026-01-04T09:35:00Z')
  }
];

const DEMO_DECISION_EVENTS = [
  { id: 'demo-event-001', title: 'Epic EHR Implementation', date: new Date('2022-03-15'), department: 'IT', impact: 0.94, isPivotal: true },
  { id: 'demo-event-002', title: 'ASC Acquisition', date: new Date('2021-06-22'), department: 'Strategy', impact: 0.87, isPivotal: true },
  { id: 'demo-event-003', title: 'Nursing Retention Program', date: new Date('2023-09-08'), department: 'HR', impact: 0.82, isPivotal: true },
  { id: 'demo-event-004', title: 'Telehealth Platform Selection', date: new Date('2022-11-30'), department: 'Digital Health', impact: 0.71, isPivotal: true },
  { id: 'demo-event-005', title: 'Oncology Expansion', date: new Date('2024-02-14'), department: 'Clinical Ops', impact: 0.68, isPivotal: true }
];

// =============================================================================
// ROUTES
// =============================================================================

/**
 * POST /api/v1/demo/seed
 * Seed all demo data
 */
router.post('/seed', async (req: Request, res: Response) => {
  try {
    const results = {
      deliberations: 0,
      contributions: 0,
      dissents: 0,
      events: 0
    };

    // Seed deliberations
    for (const dlb of DEMO_DELIBERATIONS) {
      try {
        await prisma.deliberation.upsert({
          where: { id: dlb.id },
          update: dlb,
          create: dlb as any
        });
        results.deliberations++;
      } catch (e) {
        console.log(`Skipping deliberation ${dlb.id}: table may not exist`);
      }
    }

    // Seed agent contributions
    for (const contrib of DEMO_AGENT_CONTRIBUTIONS) {
      try {
        await prisma.agentContribution.create({
          data: {
            ...contrib,
            id: `demo-contrib-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          } as any
        });
        results.contributions++;
      } catch (e) {
        console.log(`Skipping contribution: table may not exist`);
      }
    }

    // Seed dissents
    for (const dissent of DEMO_DISSENTS) {
      try {
        await prisma.dissent.upsert({
          where: { id: dissent.id },
          update: dissent,
          create: dissent as any
        });
        results.dissents++;
      } catch (e) {
        console.log(`Skipping dissent: table may not exist`);
      }
    }

    // Seed decision events
    for (const event of DEMO_DECISION_EVENTS) {
      try {
        await prisma.decisionEvent.upsert({
          where: { id: event.id },
          update: event,
          create: event as any
        });
        results.events++;
      } catch (e) {
        console.log(`Skipping event: table may not exist`);
      }
    }

    res.json({
      success: true,
      message: 'Demo data seeded successfully',
      results
    });
  } catch (error) {
    console.error('Error seeding demo data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to seed demo data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/v1/demo/seed/:scenario
 * Seed specific scenario
 */
router.post('/seed/:scenario', async (req: Request, res: Response) => {
  const { scenario } = req.params;
  
  const scenarios: Record<string, any[]> = {
    'council': [DEMO_DELIBERATIONS[0]],
    'acquisition': [DEMO_DELIBERATIONS[1]],
    'cascade': [DEMO_DELIBERATIONS[2]],
    'chronos': DEMO_DECISION_EVENTS
  };

  if (!scenarios[scenario]) {
    return res.status(400).json({
      success: false,
      error: `Unknown scenario: ${scenario}`,
      availableScenarios: Object.keys(scenarios)
    });
  }

  try {
    const data = scenarios[scenario];
    let seeded = 0;

    for (const item of data) {
      try {
        if (scenario === 'chronos') {
          await prisma.decisionEvent.upsert({
            where: { id: item.id },
            update: item,
            create: item as any
          });
        } else {
          await prisma.deliberation.upsert({
            where: { id: item.id },
            update: item,
            create: item as any
          });
        }
        seeded++;
      } catch (e) {
        console.log(`Skipping item: table may not exist`);
      }
    }

    res.json({
      success: true,
      message: `Scenario "${scenario}" seeded successfully`,
      itemsSeeded: seeded
    });
  } catch (error) {
    console.error(`Error seeding scenario ${scenario}:`, error);
    res.status(500).json({
      success: false,
      error: `Failed to seed scenario: ${scenario}`
    });
  }
});

/**
 * DELETE /api/v1/demo/clear
 * Clear all demo data
 */
router.delete('/clear', async (req: Request, res: Response) => {
  try {
    const results = {
      deliberations: 0,
      contributions: 0,
      dissents: 0,
      events: 0
    };

    // Clear demo deliberations
    try {
      const dlbResult = await prisma.deliberation.deleteMany({
        where: { id: { startsWith: 'demo-' } }
      });
      results.deliberations = dlbResult.count;
    } catch (e) {
      console.log('Deliberation table may not exist');
    }

    // Clear demo contributions
    try {
      const contribResult = await prisma.agentContribution.deleteMany({
        where: { deliberationId: { startsWith: 'demo-' } }
      });
      results.contributions = contribResult.count;
    } catch (e) {
      console.log('AgentContribution table may not exist');
    }

    // Clear demo dissents
    try {
      const dissentResult = await prisma.dissent.deleteMany({
        where: { id: { startsWith: 'demo-' } }
      });
      results.dissents = dissentResult.count;
    } catch (e) {
      console.log('Dissent table may not exist');
    }

    // Clear demo events
    try {
      const eventResult = await prisma.decisionEvent.deleteMany({
        where: { id: { startsWith: 'demo-' } }
      });
      results.events = eventResult.count;
    } catch (e) {
      console.log('DecisionEvent table may not exist');
    }

    res.json({
      success: true,
      message: 'Demo data cleared successfully',
      results
    });
  } catch (error) {
    console.error('Error clearing demo data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear demo data'
    });
  }
});

/**
 * GET /api/v1/demo/status
 * Check demo data status
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    const status = {
      deliberations: 0,
      contributions: 0,
      dissents: 0,
      events: 0,
      isSeeded: false
    };

    try {
      status.deliberations = await prisma.deliberation.count({
        where: { id: { startsWith: 'demo-' } }
      });
    } catch (e) {}

    try {
      status.contributions = await prisma.agentContribution.count({
        where: { deliberationId: { startsWith: 'demo-' } }
      });
    } catch (e) {}

    try {
      status.dissents = await prisma.dissent.count({
        where: { id: { startsWith: 'demo-' } }
      });
    } catch (e) {}

    try {
      status.events = await prisma.decisionEvent.count({
        where: { id: { startsWith: 'demo-' } }
      });
    } catch (e) {}

    status.isSeeded = status.deliberations > 0 || status.events > 0;

    res.json({
      success: true,
      status
    });
  } catch (error) {
    console.error('Error checking demo status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check demo status'
    });
  }
});

/**
 * GET /api/v1/demo/scenarios
 * List available demo scenarios
 */
router.get('/scenarios', (req: Request, res: Response) => {
  res.json({
    success: true,
    scenarios: [
      {
        id: 'council',
        name: 'Cyber Insurance Market Entry',
        description: 'Council deliberation on entering the cyber insurance market',
        service: 'The Council'
      },
      {
        id: 'acquisition',
        name: 'TechFlow Acquisition',
        description: '$50M strategic acquisition decision',
        service: 'The Council'
      },
      {
        id: 'cascade',
        name: 'Springfield Plant Closure',
        description: 'Ripple effect analysis for facility closure',
        service: 'CendiaCascade'
      },
      {
        id: 'chronos',
        name: 'Hospital Timeline Analysis',
        description: '5-year pivotal moment detection',
        service: 'CendiaChronos'
      },
      {
        id: 'oversight',
        name: 'HIPAA Audit Response',
        description: 'Compliance posture and evidence generation',
        service: 'CendiaOversight'
      },
      {
        id: 'crucible',
        name: 'AI Loan System Testing',
        description: 'Adversarial testing of loan approval AI',
        service: 'CendiaCrucible'
      },
      {
        id: 'guard',
        name: 'Real-Time AI Safety',
        description: 'Content filtering and threat detection',
        service: 'CendiaGuard'
      },
      {
        id: 'gnosis',
        name: 'M&A Due Diligence',
        description: 'Document intelligence for legal review',
        service: 'CendiaGnosis'
      },
      {
        id: 'omnitranslate',
        name: 'Drug Safety Alert',
        description: 'Urgent translation to 15 languages',
        service: 'CendiaOmniTranslate'
      },
      {
        id: 'apotheosis',
        name: 'Nightly Red Team',
        description: 'Self-improvement loop results',
        service: 'CendiaApotheosis'
      },
      {
        id: 'dissent',
        name: 'Vendor Contract Dissent',
        description: 'Protected disagreement validation',
        service: 'CendiaDissent'
      },
      {
        id: 'witness',
        name: 'FDA Audit Response',
        description: 'Regulatory evidence retrieval',
        service: 'CendiaWitness'
      }
    ]
  });
});

export default router;
