// @ts-nocheck
// =============================================================================
// DATACENDIA - SEED DECISIONS FOR DECISION DNA
// Run: npx tsx scripts/seed-decisions.ts
// =============================================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDecisions() {
  console.log('🧬 Seeding Decision DNA data...');

  // Ensure demo org exists - skip if already there
  const existingOrg = await prisma.organizations.findUnique({ where: { id: 'demo-org-id' } });
  if (!existingOrg) {
    console.log('  ⚠ Demo org not found - run seed-all-demo.ts first');
    return;
  }
  console.log('  ✓ Demo organization ready');

  // Decision 1: Q2 Market Expansion
  await seedDecision1();
  
  // Decision 2: Series B Funding
  await seedDecision2();
  
  // Decision 3: AI Infrastructure
  await seedDecision3();

  console.log('✅ Decision DNA seeding complete!');
}

async function seedDecision1() {
  const id = 'dec-sample-001';
  await prisma.decisions.upsert({
    where: { id },
    update: { updated_at: new Date() },
    create: {
      id,
      organization_id: 'demo-org-id',
      user_id: 'demo-user',
      title: 'Q2 Market Expansion Strategy',
      description: 'Evaluate expanding into EU markets (UK, Germany) for enterprise clients.',
      category: 'strategy',
      priority: 'HIGH',
      status: 'APPROVED',
      department: 'Executive',
      owner_name: 'Jane Doe',
      owner_email: 'jane.doe@acme.com',
      budget: 500000,
      timeframe: 'Q2 2025',
      stakeholders: ['CEO', 'CFO', 'CRO', 'Legal'],
      updated_at: new Date(),
    }
  });
  
  // Add timeline activities
  const activities = [
    { id: 'act-001', action: 'created', actor: 'Jane Doe', details: { type: 'created', title: 'Decision Created' } },
    { id: 'act-002', action: 'context_added', actor: 'Analytics', details: { type: 'context_added', documents: 3 } },
    { id: 'act-003', action: 'premortem_run', actor: 'Crucible', details: { type: 'premortem_run', riskScore: 42 } },
    { id: 'act-004', action: 'council_session', actor: 'Council', details: { type: 'council_session', confidence: 0.85 } },
    { id: 'act-005', action: 'ghost_board', actor: 'Ghost Board', details: { type: 'ghost_board', score: 78 } },
    { id: 'act-006', action: 'decision_made', actor: 'Jane Doe', details: { type: 'decision_made', approved: true } },
  ];
  
  for (const act of activities) {
    await prisma.decision_activities.upsert({
      where: { id: act.id },
      update: {},
      create: { ...act, decision_id: id, timestamp: new Date() }
    });
  }
  console.log('  ✓ Decision 1: Q2 Market Expansion');
}

async function seedDecision2() {
  const id = 'dec-sample-002';
  await prisma.decisions.upsert({
    where: { id },
    update: { updated_at: new Date() },
    create: {
      id,
      organization_id: 'demo-org-id',
      user_id: 'demo-user',
      title: 'Series B Funding Round',
      description: 'Decide on timing, valuation, and lead investor strategy for Series B.',
      category: 'financial',
      priority: 'CRITICAL',
      status: 'PENDING',
      department: 'Finance',
      owner_name: 'John Smith',
      budget: 0,
      timeframe: 'Q3 2025',
      stakeholders: ['CEO', 'CFO', 'Board'],
      updated_at: new Date(),
    }
  });
  console.log('  ✓ Decision 2: Series B Funding');
}

async function seedDecision3() {
  const id = 'dec-sample-003';
  await prisma.decisions.upsert({
    where: { id },
    update: { updated_at: new Date() },
    create: {
      id,
      organization_id: 'demo-org-id',
      user_id: 'demo-user',
      title: 'AI Infrastructure Migration',
      description: 'Migrate from cloud GPUs to on-premise AI cluster for cost optimization.',
      category: 'technology',
      priority: 'HIGH',
      status: 'BLOCKED',
      department: 'Engineering',
      owner_name: 'Sarah Chen',
      budget: 2500000,
      timeframe: 'H2 2025',
      stakeholders: ['CTO', 'CFO', 'Engineering'],
      updated_at: new Date(),
    }
  });
  console.log('  ✓ Decision 3: AI Infrastructure');
}

seedDecisions()
  .catch(console.error)
  .finally(() => prisma.$disconnect());