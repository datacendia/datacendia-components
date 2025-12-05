// =============================================================================
// ENTERPRISE DATA SEED SCRIPT
// Seeds realistic data for all enterprise models
// Run with: npx ts-node prisma/seed-enterprise.ts
// =============================================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedMesh() {
  console.log('Seeding CendiaMesh™ data...');

  // Network Stats
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
        industry: industries[Math.floor(Math.random() * industries.length)],
        region: regions[Math.floor(Math.random() * regions.length)],
        employee_range: ['1-50', '51-200', '201-1000', '1001-5000', '5000+'][Math.floor(Math.random() * 5)],
        revenue_range: ['<$1M', '$1M-$10M', '$10M-$100M', '$100M-$1B', '>$1B'][Math.floor(Math.random() * 5)],
        contribution_score: Math.random() * 100,
        data_quality: 85 + Math.random() * 15
      }
    });
  }

  // Benchmarks
  const benchmarks = [
    { name: 'Revenue Growth Rate', category: 'Financial', unit: '%', p25: 8.2, p50: 12.4, p75: 19.8, p90: 32.1 },
    { name: 'Gross Margin', category: 'Financial', unit: '%', p25: 45.0, p50: 58.5, p75: 72.0, p90: 82.5 },
    { name: 'Employee Growth Rate', category: 'HR', unit: '%', p25: 3.5, p50: 8.2, p75: 15.0, p90: 25.0 },
    { name: 'Customer Retention', category: 'Sales', unit: '%', p25: 78.0, p50: 85.5, p75: 92.0, p90: 97.0 },
    { name: 'Net Promoter Score', category: 'Customer', unit: '', p25: 15, p50: 32, p75: 48, p90: 65 },
    { name: 'R&D Intensity', category: 'Operations', unit: '% of Rev', p25: 8.0, p50: 15.0, p75: 25.0, p90: 35.0 },
    { name: 'Time to Hire', category: 'HR', unit: 'days', p25: 55, p50: 42, p75: 28, p90: 18 },
    { name: 'Sales Efficiency', category: 'Sales', unit: 'x', p25: 0.6, p50: 0.9, p75: 1.3, p90: 1.8 }
  ];

  for (const b of benchmarks) {
    for (const ind of industries) {
      await prisma.mesh_benchmarks.create({
        data: {
          name: b.name,
          category: b.category,
          industry: ind,
          p25_value: b.p25 * (0.9 + Math.random() * 0.2),
          p50_value: b.p50 * (0.9 + Math.random() * 0.2),
          p75_value: b.p75 * (0.9 + Math.random() * 0.2),
          p90_value: b.p90 * (0.9 + Math.random() * 0.2),
          trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)],
          trend_percent: (Math.random() - 0.5) * 10,
          unit: b.unit,
          participants: 400 + Math.floor(Math.random() * 500)
        }
      });
    }
  }

  // Risk Signals
  const signals = [
    {
      title: 'Semiconductor Supply Chain Disruption',
      description: 'Multiple tier-2 suppliers in Taiwan reporting capacity constraints due to power grid issues. Expected 15-20% reduction in chip availability for Q1 2025.',
      category: 'disruption',
      severity: 'high',
      industries: ['technology', 'manufacturing'],
      regions: ['APAC', 'North America'],
      confidence: 87,
      sources: 145
    },
    {
      title: 'Healthcare Cybersecurity Threat Escalation',
      description: 'Coordinated ransomware campaign targeting healthcare organizations. 23 incidents reported in past 72 hours across network participants.',
      category: 'risk',
      severity: 'critical',
      industries: ['healthcare'],
      regions: ['North America', 'Europe'],
      confidence: 94,
      sources: 89
    },
    {
      title: 'Payment Fraud Pattern: New Vector',
      description: 'Novel fraud pattern detected across 47 financial institutions. Synthetic identity combined with instant payment rails. Average loss per incident: $47K.',
      category: 'fraud',
      severity: 'high',
      industries: ['finance'],
      regions: ['North America', 'Europe', 'APAC'],
      confidence: 89,
      sources: 67
    },
    {
      title: 'Rare Earth Supply Tightening',
      description: 'Export restrictions announced affecting neodymium and dysprosium. Impact on EV motors and wind turbines expected within 90 days.',
      category: 'disruption',
      severity: 'medium',
      industries: ['manufacturing', 'energy'],
      regions: ['APAC', 'North America'],
      confidence: 78,
      sources: 52
    }
  ];

  for (const s of signals) {
    await prisma.mesh_risk_signals.create({
      data: {
        title: s.title,
        description: s.description,
        category: s.category,
        severity: s.severity,
        affected_industries: s.industries,
        affected_regions: s.regions,
        confidence: s.confidence,
        sources: s.sources,
        recommendations: ['Review exposure', 'Engage alternatives', 'Monitor closely'],
        detected_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });
  }

  console.log('CendiaMesh™ seeding complete.');
}

async function seedDecisionIntel() {
  console.log('Seeding Decision Intelligence data...');
  const orgId = 'default-org';
  const userId = 'system';

  // Chronos Snapshots
  const snapshotTypes = ['quarterly', 'monthly', 'milestone', 'crisis'];
  for (let i = 0; i < 10; i++) {
    await prisma.chronos_snapshots.create({
      data: {
        organization_id: orgId,
        snapshot_type: snapshotTypes[Math.floor(Math.random() * snapshotTypes.length)],
        name: `Snapshot ${new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`,
        data: { revenue: 1000000 + Math.random() * 500000, employees: 50 + Math.floor(Math.random() * 100) },
        metrics: { health_score: 70 + Math.random() * 25, growth_rate: Math.random() * 20 },
        created_by: userId,
        created_at: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000)
      }
    });
  }

  // Ghost Board Sessions
  const scenarios = [
    { title: 'Series B Fundraise', scenario: 'Present $50M Series B to board with aggressive growth targets' },
    { title: 'Market Expansion', scenario: 'Propose European market entry strategy and associated risks' },
    { title: 'Acquisition Offer', scenario: 'Evaluate $200M acquisition offer from strategic buyer' },
    { title: 'Crisis Response', scenario: 'Major data breach - communicate remediation plan to board' }
  ];

  for (const s of scenarios) {
    await prisma.ghost_board_sessions.create({
      data: {
        organization_id: orgId,
        title: s.title,
        scenario: s.scenario,
        board_composition: [
          { name: 'Sarah Chen', role: 'CEO' },
          { name: 'Michael Torres', role: 'CFO' },
          { name: 'Emily Watson', role: 'Lead Independent Director' },
          { name: 'James Liu', role: 'Investor Director' }
        ],
        discussion: [],
        insights: [],
        status: ['draft', 'completed', 'in_progress'][Math.floor(Math.random() * 3)],
        created_by: userId
      }
    });
  }

  // Pre-Mortem Analyses
  const preMortems = [
    { title: 'Product Launch Failure Analysis', risk: 0.35 },
    { title: 'M&A Integration Risks', risk: 0.45 },
    { title: 'Market Entry Obstacles', risk: 0.28 },
    { title: 'Technology Migration Risks', risk: 0.52 }
  ];

  for (const pm of preMortems) {
    await prisma.pre_mortem_analyses.create({
      data: {
        organization_id: orgId,
        title: pm.title,
        failure_modes: [
          { mode: 'Timeline slip', probability: 0.6, impact: 'high' },
          { mode: 'Budget overrun', probability: 0.4, impact: 'medium' },
          { mode: 'Talent gap', probability: 0.3, impact: 'high' }
        ],
        risk_factors: [
          { factor: 'Market conditions', weight: 0.3 },
          { factor: 'Execution capability', weight: 0.4 },
          { factor: 'Competition', weight: 0.3 }
        ],
        mitigations: [
          { action: 'Phase rollout', effectiveness: 0.7 },
          { action: 'Contingency budget', effectiveness: 0.5 }
        ],
        overall_risk: pm.risk,
        status: 'completed',
        created_by: userId
      }
    });
  }

  // Regulatory Items
  const regulations = [
    { title: 'GDPR Article 30 Compliance', jurisdiction: 'EU', category: 'Privacy', impact: 'high' },
    { title: 'SOC 2 Type II Certification', jurisdiction: 'US', category: 'Security', impact: 'high' },
    { title: 'California Consumer Privacy Act', jurisdiction: 'US-CA', category: 'Privacy', impact: 'medium' },
    { title: 'PCI DSS v4.0 Requirements', jurisdiction: 'Global', category: 'Security', impact: 'high' },
    { title: 'AI Act Compliance', jurisdiction: 'EU', category: 'AI', impact: 'medium' }
  ];

  for (const r of regulations) {
    await prisma.regulatory_items.create({
      data: {
        organization_id: orgId,
        regulation_id: `REG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        title: r.title,
        description: `Compliance requirements for ${r.title}`,
        jurisdiction: r.jurisdiction,
        category: r.category,
        compliance_status: ['compliant', 'partial', 'pending'][Math.floor(Math.random() * 3)],
        impact_level: r.impact,
        required_actions: [
          { action: 'Gap analysis', status: 'completed' },
          { action: 'Implementation', status: 'in_progress' },
          { action: 'Audit', status: 'pending' }
        ]
      }
    });
  }

  console.log('Decision Intelligence seeding complete.');
}

async function seedEnterprise() {
  console.log('Seeding Enterprise Suite data...');
  const orgId = 'default-org';
  const userId = 'system';

  // Persona Twins
  const personas = [
    { name: 'CFO Advisor', role: 'Chief Financial Officer', dept: 'Finance' },
    { name: 'Sales Coach', role: 'VP of Sales', dept: 'Sales' },
    { name: 'Legal Counsel', role: 'General Counsel', dept: 'Legal' },
    { name: 'Tech Advisor', role: 'CTO', dept: 'Engineering' }
  ];

  for (const p of personas) {
    await prisma.persona_twins.create({
      data: {
        organization_id: orgId,
        name: p.name,
        role: p.role,
        department: p.dept,
        personality_config: { style: 'professional', verbosity: 'concise' },
        knowledge_domains: [p.dept, 'Strategy', 'Operations'],
        training_status: 'trained',
        accuracy_score: 85 + Math.random() * 10,
        interactions: Math.floor(Math.random() * 500)
      }
    });
  }

  // Governance Policies
  const policies = [
    { name: 'Data Retention Policy', category: 'Data', status: 'active' },
    { name: 'Access Control Policy', category: 'Security', status: 'active' },
    { name: 'AI Usage Guidelines', category: 'AI', status: 'draft' },
    { name: 'Vendor Management Policy', category: 'Procurement', status: 'active' }
  ];

  for (const p of policies) {
    await prisma.govern_policies.create({
      data: {
        organization_id: orgId,
        name: p.name,
        description: `${p.name} - organizational policy document`,
        category: p.category,
        status: p.status,
        rules: [
          { rule: 'Annual review required', enforced: true },
          { rule: 'Exception approval workflow', enforced: true }
        ],
        created_by: userId
      }
    });
  }

  // Autopilot Rules
  const automations = [
    { name: 'Alert Escalation', trigger: 'alert_critical', action: 'notify_oncall' },
    { name: 'Daily Health Check', trigger: 'schedule_daily', action: 'run_health_check' },
    { name: 'Anomaly Response', trigger: 'anomaly_detected', action: 'create_incident' },
    { name: 'Backup Verification', trigger: 'schedule_weekly', action: 'verify_backups' }
  ];

  for (const a of automations) {
    await prisma.autopilot_rules.create({
      data: {
        organization_id: orgId,
        name: a.name,
        trigger_type: a.trigger,
        trigger_config: { threshold: 0.9 },
        action_type: a.action,
        action_config: { notify: true, log: true },
        enabled: true,
        trigger_count: Math.floor(Math.random() * 100)
      }
    });
  }

  // Ledger Entries
  for (let i = 0; i < 20; i++) {
    const actions = ['decision.created', 'policy.approved', 'workflow.completed', 'alert.resolved'];
    await prisma.ledger_entries.create({
      data: {
        organization_id: orgId,
        entry_type: 'audit',
        reference_type: ['decision', 'policy', 'workflow', 'alert'][Math.floor(Math.random() * 4)],
        reference_id: `ref-${i}`,
        actor_id: userId,
        actor_name: 'System Admin',
        action: actions[Math.floor(Math.random() * actions.length)],
        data_hash: `sha256:${Math.random().toString(36).substr(2, 64)}`,
        previous_hash: i > 0 ? `sha256:${Math.random().toString(36).substr(2, 64)}` : null,
        metadata: { ip: '192.168.1.1', user_agent: 'Datacendia/1.0' },
        timestamp: new Date(Date.now() - i * 60 * 60 * 1000)
      }
    });
  }

  // Union Metrics
  const unionMetrics = [
    { name: 'Employee Satisfaction', value: 78 },
    { name: 'Turnover Rate', value: 12 },
    { name: 'Engagement Score', value: 82 },
    { name: 'Training Hours', value: 24 },
    { name: 'Promotion Rate', value: 8 }
  ];

  for (const m of unionMetrics) {
    await prisma.union_metrics.create({
      data: {
        organization_id: orgId,
        metric_name: m.name,
        metric_value: m.value * (0.9 + Math.random() * 0.2),
        department: null,
        period_start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        period_end: new Date(),
        trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)]
      }
    });
  }

  // Veto Rules
  const vetoRules = [
    { name: 'Budget Override Protection', type: 'financial', desc: 'Prevents budget overrides above $100K without CFO approval' },
    { name: 'Data Export Restriction', type: 'security', desc: 'Blocks bulk data exports without security review' },
    { name: 'AI Decision Override', type: 'ethics', desc: 'Requires human review for AI-driven decisions affecting employees' }
  ];

  for (const v of vetoRules) {
    await prisma.veto_rules.create({
      data: {
        organization_id: orgId,
        name: v.name,
        description: v.desc,
        rule_type: v.type,
        conditions: [{ field: 'amount', operator: '>', value: 100000 }],
        enabled: true,
        veto_count: Math.floor(Math.random() * 10)
      }
    });
  }

  console.log('Enterprise Suite seeding complete.');
}

async function main() {
  console.log('Starting enterprise data seed...');
  
  try {
    await seedMesh();
    await seedDecisionIntel();
    await seedEnterprise();
    
    console.log('\n✅ All enterprise data seeded successfully!');
  } catch (error) {
    console.error('Seed error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
