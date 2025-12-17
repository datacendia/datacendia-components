// @ts-nocheck
// =============================================================================
// DEMO DATA SEED - Simplified Version
// Seeds the new enterprise tables with demo data
// Run with: npx ts-node prisma/seed-demo-data.ts
// =============================================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const DEMO_ORG_ID = 'demo-acme-corp';

function randomDate(daysAgo: number): Date {
  return new Date(Date.now() - Math.random() * daysAgo * 24 * 60 * 60 * 1000);
}

async function seedMesh() {
  console.log('Seeding CendiaMesh™...');

  // Check if already seeded
  const existing = await prisma.mesh_network_stats.count();
  if (existing > 0) {
    console.log('  ↳ Mesh data already exists, skipping');
    return;
  }

  await prisma.mesh_network_stats.create({
    data: {
      total_participants: 2847,
      active_today: 1893,
      data_points_shared: BigInt(47823000),
      insights_generated: 12456,
      avg_response_ms: 45,
      privacy_score: 99.97,
      uptime_percent: 99.99
    }
  });

  // Participants
  const industries = ['technology', 'finance', 'healthcare', 'manufacturing', 'retail', 'energy'];
  const regions = ['North America', 'Europe', 'APAC', 'LATAM'];
  
  for (let i = 0; i < 50; i++) {
    await prisma.mesh_participants.create({
      data: {
        anonymous_id: `MESH-${String(i + 1).padStart(6, '0')}`,
        industry: industries[i % industries.length],
        region: regions[i % regions.length],
        employee_range: ['1-50', '51-200', '201-1000', '1001-5000', '5000+'][i % 5],
        revenue_range: ['<$1M', '$1M-$10M', '$10M-$100M', '$100M-$1B', '>$1B'][i % 5],
        contribution_score: 50 + Math.random() * 50,
        data_quality: 85 + Math.random() * 15
      }
    });
  }

  // Benchmarks
  const benchmarks = [
    { name: 'Revenue Growth Rate', category: 'Financial', unit: '%' },
    { name: 'Gross Margin', category: 'Financial', unit: '%' },
    { name: 'Employee Growth', category: 'HR', unit: '%' },
    { name: 'Customer Retention', category: 'Sales', unit: '%' },
    { name: 'NPS Score', category: 'Customer', unit: '' },
    { name: 'R&D Intensity', category: 'Operations', unit: '% Rev' },
  ];

  for (const b of benchmarks) {
    for (const ind of industries) {
      await prisma.mesh_benchmarks.create({
        data: {
          name: b.name,
          category: b.category,
          industry: ind,
          p25_value: 10 + Math.random() * 10,
          p50_value: 20 + Math.random() * 15,
          p75_value: 35 + Math.random() * 20,
          p90_value: 55 + Math.random() * 25,
          trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)],
          trend_percent: (Math.random() - 0.5) * 10,
          unit: b.unit,
          participants: 400 + Math.floor(Math.random() * 500)
        }
      });
    }
  }

  // Risk signals
  const signals = [
    { title: 'Supply Chain Disruption Alert', desc: 'Semiconductor shortages affecting multiple industries', severity: 'high', category: 'disruption' },
    { title: 'Cybersecurity Threat Escalation', desc: 'Coordinated ransomware campaign detected', severity: 'critical', category: 'risk' },
    { title: 'Payment Fraud Pattern', desc: 'Novel fraud vector detected across financial institutions', severity: 'high', category: 'fraud' },
    { title: 'Regulatory Change Impact', desc: 'New compliance requirements effective Q1', severity: 'medium', category: 'risk' },
  ];

  for (const s of signals) {
    await prisma.mesh_risk_signals.create({
      data: {
        title: s.title,
        description: s.desc,
        category: s.category,
        severity: s.severity,
        affected_industries: industries.slice(0, 3),
        affected_regions: regions.slice(0, 2),
        confidence: 75 + Math.random() * 20,
        sources: 50 + Math.floor(Math.random() * 100),
        recommendations: ['Monitor closely', 'Review exposure', 'Engage alternatives'],
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });
  }

  console.log('  ✓ CendiaMesh seeded');
}

async function seedPersona() {
  console.log('Seeding PersonaForge™...');

  const existing = await prisma.persona_twins.count();
  if (existing > 0) {
    console.log('  ↳ Persona data already exists, skipping');
    return;
  }

  const twins = [
    { name: 'CFO Advisor', role: 'Chief Financial Officer', dept: 'Finance' },
    { name: 'Sales Coach', role: 'VP of Sales', dept: 'Sales' },
    { name: 'Legal Counsel', role: 'General Counsel', dept: 'Legal' },
    { name: 'Tech Advisor', role: 'CTO', dept: 'Engineering' },
    { name: 'HR Partner', role: 'CHRO', dept: 'People' },
  ];

  for (const t of twins) {
    const twin = await prisma.persona_twins.create({
      data: {
        organization_id: DEMO_ORG_ID,
        name: t.name,
        role: t.role,
        department: t.dept,
        personality_config: { style: 'professional', verbosity: 'concise' },
        knowledge_domains: [t.dept, 'Strategy', 'Operations'],
        training_status: 'trained',
        accuracy_score: 85 + Math.random() * 10,
        interactions: 100 + Math.floor(Math.random() * 200)
      }
    });

    // Add conversations
    for (let i = 0; i < 3; i++) {
      await prisma.persona_conversations.create({
        data: {
          twin_id: twin.id,
          user_id: 'demo-user',
          messages: [
            { role: 'user', content: 'Can you help me with a strategic question?' },
            { role: 'assistant', content: 'Of course! What would you like to discuss?' }
          ],
          satisfaction: 4 + Math.random(),
          duration_ms: 30000 + Math.floor(Math.random() * 60000),
          created_at: randomDate(30)
        }
      });
    }
  }

  console.log('  ✓ PersonaForge seeded');
}

async function seedGovern() {
  console.log('Seeding CendiaGovern™...');

  const existing = await prisma.govern_policies.count();
  if (existing > 0) {
    console.log('  ↳ Govern data already exists, skipping');
    return;
  }

  const policies = [
    { name: 'Data Retention Policy', category: 'Data', status: 'active' },
    { name: 'Access Control Policy', category: 'Security', status: 'active' },
    { name: 'AI Ethics Guidelines', category: 'AI', status: 'active' },
    { name: 'Vendor Management Policy', category: 'Procurement', status: 'draft' },
  ];

  for (const p of policies) {
    const policy = await prisma.govern_policies.create({
      data: {
        organization_id: DEMO_ORG_ID,
        name: p.name,
        description: `${p.name} for the organization`,
        category: p.category,
        status: p.status,
        rules: [{ rule: 'Annual review required', enforced: true }],
        created_by: 'system'
      }
    });

    if (p.status === 'active') {
      await prisma.govern_audits.create({
        data: {
          organization_id: DEMO_ORG_ID,
          policy_id: policy.id,
          audit_type: 'compliance',
          status: 'completed',
          findings: [{ finding: 'All requirements met', severity: 'info' }],
          risk_score: 0.1 + Math.random() * 0.2
        }
      });
    }
  }

  console.log('  ✓ CendiaGovern seeded');
}

async function seedAutopilot() {
  console.log('Seeding CendiaAutopilot™...');

  const existing = await prisma.autopilot_rules.count();
  if (existing > 0) {
    console.log('  ↳ Autopilot data already exists, skipping');
    return;
  }

  const rules = [
    { name: 'Critical Alert Escalation', trigger: 'alert_critical', action: 'notify_oncall' },
    { name: 'Daily Health Report', trigger: 'schedule_daily', action: 'generate_report' },
    { name: 'Anomaly Response', trigger: 'anomaly_detected', action: 'create_incident' },
    { name: 'Backup Verification', trigger: 'schedule_weekly', action: 'verify_backups' },
  ];

  for (const r of rules) {
    const rule = await prisma.autopilot_rules.create({
      data: {
        organization_id: DEMO_ORG_ID,
        name: r.name,
        trigger_type: r.trigger,
        trigger_config: { threshold: 0.9 },
        action_type: r.action,
        action_config: { notify: true },
        enabled: true,
        trigger_count: 10 + Math.floor(Math.random() * 50)
      }
    });

    // Add executions
    for (let i = 0; i < 5; i++) {
      await prisma.autopilot_executions.create({
        data: {
          rule_id: rule.id,
          status: 'completed',
          duration_ms: 100 + Math.floor(Math.random() * 400),
          executed_at: randomDate(30)
        }
      });
    }
  }

  console.log('  ✓ CendiaAutopilot seeded');
}

async function seedLedger() {
  console.log('Seeding CendiaLedger™...');

  const existing = await prisma.ledger_entries.count();
  if (existing > 0) {
    console.log('  ↳ Ledger data already exists, skipping');
    return;
  }

  const actions = [
    { type: 'decision.created', ref: 'Market Expansion', actor: 'Sarah Chen' },
    { type: 'deliberation.started', ref: 'Market Expansion', actor: 'Council' },
    { type: 'policy.approved', ref: 'Data Retention v2', actor: 'Emily Watson' },
    { type: 'automation.triggered', ref: 'Alert Escalation', actor: 'Autopilot' },
    { type: 'decision.approved', ref: 'Market Expansion', actor: 'Sarah Chen' },
  ];

  let prevHash = '';
  for (let i = 0; i < actions.length; i++) {
    const a = actions[i];
    const hash = require('crypto').createHash('sha256').update(JSON.stringify({ ...a, i })).digest('hex');
    
    await prisma.ledger_entries.create({
      data: {
        organization_id: DEMO_ORG_ID,
        entry_type: 'audit',
        reference_type: a.type.split('.')[0],
        reference_id: `ref-${i}`,
        actor_id: a.actor.toLowerCase().replace(' ', '-'),
        actor_name: a.actor,
        action: a.type,
        data_hash: hash,
        previous_hash: prevHash || null,
        metadata: { reference: a.ref },
        timestamp: new Date(Date.now() - (actions.length - i) * 3600000)
      }
    });
    prevHash = hash;
  }

  console.log('  ✓ CendiaLedger seeded');
}

async function seedVeto() {
  console.log('Seeding CendiaVeto™...');

  const existing = await prisma.veto_rules.count();
  if (existing > 0) {
    console.log('  ↳ Veto data already exists, skipping');
    return;
  }

  const rules = [
    { name: 'Large Transaction Block', desc: 'Blocks transactions >$100K without CFO approval', type: 'financial' },
    { name: 'Prod DB Access Control', desc: 'Requires security review for prod access', type: 'security' },
    { name: 'AI Decision Review', desc: 'Human review for AI decisions affecting employees', type: 'ethics' },
  ];

  for (const r of rules) {
    const rule = await prisma.veto_rules.create({
      data: {
        organization_id: DEMO_ORG_ID,
        name: r.name,
        description: r.desc,
        rule_type: r.type,
        conditions: [{ threshold: 100000 }],
        enabled: true,
        veto_count: Math.floor(Math.random() * 10)
      }
    });

    // Add veto events
    for (let i = 0; i < 2; i++) {
      await prisma.veto_events.create({
        data: {
          rule_id: rule.id,
          organization_id: DEMO_ORG_ID,
          target_type: 'transaction',
          target_id: `txn-${i}`,
          reason: `Triggered by ${r.name}`,
          severity: r.type === 'security' ? 'high' : 'medium',
          created_at: randomDate(30)
        }
      });
    }
  }

  console.log('  ✓ CendiaVeto seeded');
}

async function seedUnion() {
  console.log('Seeding CendiaUnion™...');

  const existing = await prisma.union_metrics.count();
  if (existing > 0) {
    console.log('  ↳ Union data already exists, skipping');
    return;
  }

  const metrics = [
    { name: 'Employee Satisfaction', value: 78 },
    { name: 'Engagement Score', value: 82 },
    { name: 'Turnover Rate', value: 12 },
    { name: 'Training Hours', value: 24 },
  ];

  const departments = ['Engineering', 'Sales', 'Marketing', 'Operations', 'Finance'];

  // Company-wide
  for (const m of metrics) {
    await prisma.union_metrics.create({
      data: {
        organization_id: DEMO_ORG_ID,
        metric_name: m.name,
        metric_value: m.value * (0.9 + Math.random() * 0.2),
        department: null,
        period_start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        period_end: new Date(),
        trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)]
      }
    });
  }

  // Per department
  for (const dept of departments) {
    for (const m of metrics) {
      await prisma.union_metrics.create({
        data: {
          organization_id: DEMO_ORG_ID,
          metric_name: m.name,
          metric_value: m.value * (0.8 + Math.random() * 0.4),
          department: dept,
          period_start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          period_end: new Date(),
          trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)]
        }
      });
    }
  }

  console.log('  ✓ CendiaUnion seeded');
}

async function seedDecisionIntel() {
  console.log('Seeding Decision Intelligence...');

  // Chronos
  const chronosExists = await prisma.chronos_snapshots.count();
  if (chronosExists === 0) {
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      await prisma.chronos_snapshots.create({
        data: {
          organization_id: DEMO_ORG_ID,
          snapshot_type: 'monthly',
          name: `Monthly - ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
          data: { revenue: 35000000 + i * 2000000, employees: 2500 - i * 50 },
          metrics: { health_score: 75 + Math.random() * 15 },
          created_by: 'system',
          created_at: date
        }
      });
    }
  }

  // Ghost Board
  const ghostExists = await prisma.ghost_board_sessions.count();
  if (ghostExists === 0) {
    const sessions = [
      { title: 'Series C Pitch Rehearsal', scenario: 'Present $100M Series C to board' },
      { title: 'Crisis Management Drill', scenario: 'Major data breach response' },
    ];
    for (const s of sessions) {
      await prisma.ghost_board_sessions.create({
        data: {
          organization_id: DEMO_ORG_ID,
          title: s.title,
          scenario: s.scenario,
          board_composition: [{ name: 'CEO', role: 'Presenter' }, { name: 'AI Director', role: 'Challenger' }],
          discussion: [],
          insights: [],
          status: 'completed',
          created_by: 'system'
        }
      });
    }
  }

  // Pre-Mortem
  const pmExists = await prisma.pre_mortem_analyses.count();
  if (pmExists === 0) {
    await prisma.pre_mortem_analyses.create({
      data: {
        organization_id: DEMO_ORG_ID,
        title: 'European Expansion Risk Analysis',
        failure_modes: [{ mode: 'Regulatory delays', probability: 0.4 }],
        risk_factors: [{ factor: 'Market timing', weight: 0.3 }],
        mitigations: [{ action: 'Phased rollout', effectiveness: 0.7 }],
        overall_risk: 0.35,
        status: 'completed',
        created_by: 'system'
      }
    });
  }

  // Regulatory
  const regExists = await prisma.regulatory_items.count();
  if (regExists === 0) {
    const regs = [
      { title: 'GDPR Compliance', jurisdiction: 'EU', category: 'Privacy', status: 'compliant' },
      { title: 'SOC 2 Type II', jurisdiction: 'US', category: 'Security', status: 'compliant' },
      { title: 'EU AI Act', jurisdiction: 'EU', category: 'AI', status: 'pending' },
    ];
    for (const r of regs) {
      await prisma.regulatory_items.create({
        data: {
          organization_id: DEMO_ORG_ID,
          regulation_id: `REG-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          title: r.title,
          description: `${r.title} compliance requirements`,
          jurisdiction: r.jurisdiction,
          category: r.category,
          compliance_status: r.status,
          impact_level: 'high',
          required_actions: [{ action: 'Gap analysis', status: 'completed' }]
        }
      });
    }
  }

  console.log('  ✓ Decision Intelligence seeded');
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║              DATACENDIA DEMO DATA SEED                      ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  try {
    await seedMesh();
    await seedPersona();
    await seedGovern();
    await seedAutopilot();
    await seedLedger();
    await seedVeto();
    await seedUnion();
    await seedDecisionIntel();

    console.log('\n✅ Demo data seeded successfully!\n');
  } catch (error) {
    console.error('Seed error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
