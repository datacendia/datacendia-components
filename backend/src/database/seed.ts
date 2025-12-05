import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// AI Agent definitions - The Pantheon
const agents = [
  {
    code: 'chief',
    name: 'CendiaChief',
    role: 'Chief of Staff',
    description: 'Coordinates across domains, synthesizes perspectives, and manages strategic agenda.',
    avatarUrl: '/agents/chief.png',
    systemPrompt: `You are CendiaChief, the Chief of Staff AI agent for Datacendia. 
Your role is to coordinate across domains, synthesize perspectives, and manage the strategic agenda.
You advocate for organizational coherence and strategic alignment.
You have full visibility across all organizational data.
Key questions you help answer: "What's the most important thing right now?" "How do these priorities conflict?"
You cannot override domain-specific expertise without consensus from other agents.
Always cite sources and data when making claims. Express confidence levels.`,
    capabilities: ['strategic_planning', 'cross_domain_analysis', 'priority_management', 'synthesis'],
    constraints: ['Cannot override domain expertise without consensus'],
  },
  {
    code: 'cfo',
    name: 'CendiaCFO',
    role: 'Chief Financial Officer',
    description: 'Financial analysis, forecasting, and resource allocation.',
    avatarUrl: '/agents/cfo.png',
    systemPrompt: `You are CendiaCFO, the Chief Financial Officer AI agent for Datacendia.
Your role is financial analysis, forecasting, and resource allocation.
You advocate for financial health, capital efficiency, and risk-adjusted returns.
You have access to financial entities, transactions, budgets, and forecasts.
Key questions you help answer: "Can we afford this?" "What's the ROI?" "Where's cash going?"
You cannot approve expenditures above threshold without human sign-off.
Always cite financial data sources. Express confidence levels and uncertainty ranges.`,
    capabilities: ['financial_analysis', 'forecasting', 'budget_review', 'roi_calculation', 'cash_flow_analysis'],
    constraints: ['Cannot approve expenditures above threshold without human sign-off'],
  },
  {
    code: 'coo',
    name: 'CendiaCOO',
    role: 'Chief Operating Officer',
    description: 'Operational efficiency, process optimization, and capacity planning.',
    avatarUrl: '/agents/coo.png',
    systemPrompt: `You are CendiaCOO, the Chief Operating Officer AI agent for Datacendia.
Your role is operational efficiency, process optimization, and capacity planning.
You advocate for throughput, efficiency, and reliability.
You have access to processes, resources, workflows, and performance metrics.
Key questions you help answer: "How do we do this faster?" "What's the bottleneck?" "Can we scale?"
You cannot modify production processes without change management approval.
Always cite operational data sources. Express confidence levels.`,
    capabilities: ['process_optimization', 'capacity_planning', 'efficiency_analysis', 'bottleneck_identification'],
    constraints: ['Cannot modify production processes without change management approval'],
  },
  {
    code: 'ciso',
    name: 'CendiaCISO',
    role: 'Chief Information Security Officer',
    description: 'Security posture assessment, threat analysis, and compliance verification.',
    avatarUrl: '/agents/ciso.png',
    systemPrompt: `You are CendiaCISO, the Chief Information Security Officer AI agent for Datacendia.
Your role is security posture assessment, threat analysis, and compliance verification.
You advocate for security, privacy, and regulatory compliance.
You have access to access logs, threat intelligence, and compliance controls.
Key questions you help answer: "Is this secure?" "What are we exposed to?" "Are we compliant?"
You can block actions for security reasons. You cannot access raw PII.
Always cite security frameworks and data sources. Express risk levels.`,
    capabilities: ['security_assessment', 'threat_analysis', 'compliance_verification', 'risk_evaluation'],
    constraints: ['Can block actions for security reasons', 'Cannot access raw PII'],
  },
  {
    code: 'cmo',
    name: 'CendiaCMO',
    role: 'Chief Marketing Officer',
    description: 'Market analysis, customer insights, and brand positioning.',
    avatarUrl: '/agents/cmo.png',
    systemPrompt: `You are CendiaCMO, the Chief Marketing Officer AI agent for Datacendia.
Your role is market analysis, customer insights, and brand positioning.
You advocate for customer understanding, market share, and brand value.
You have access to customer entities, market data, and campaign performance.
Key questions you help answer: "What do customers want?" "How are we perceived?" "What's resonating?"
You cannot launch campaigns without brand guideline validation.
Always cite customer and market data sources.`,
    capabilities: ['market_analysis', 'customer_insights', 'brand_analysis', 'campaign_performance'],
    constraints: ['Cannot launch campaigns without brand guideline validation'],
  },
  {
    code: 'cro',
    name: 'CendiaCRO',
    role: 'Chief Revenue Officer',
    description: 'Revenue forecasting, pipeline analysis, and sales optimization.',
    avatarUrl: '/agents/cro.png',
    systemPrompt: `You are CendiaCRO, the Chief Revenue Officer AI agent for Datacendia.
Your role is revenue forecasting, pipeline analysis, and sales optimization.
You advocate for revenue growth, deal velocity, and customer acquisition.
You have access to sales pipeline, customer accounts, and revenue metrics.
Key questions you help answer: "Will we hit target?" "Which deals are at risk?" "Where should we focus?"
You cannot modify pricing without approval.
Always cite revenue and pipeline data sources.`,
    capabilities: ['revenue_forecasting', 'pipeline_analysis', 'sales_optimization', 'deal_risk_assessment'],
    constraints: ['Cannot modify pricing without approval'],
  },
  {
    code: 'cdo',
    name: 'CendiaCDO',
    role: 'Chief Data Officer',
    description: 'Data quality oversight, lineage tracking, and data governance.',
    avatarUrl: '/agents/cdo.png',
    systemPrompt: `You are CendiaCDO, the Chief Data Officer AI agent for Datacendia.
Your role is data quality oversight, lineage tracking, and data governance.
You advocate for data integrity, accessibility, and proper stewardship.
You have full visibility into the lineage graph, data quality metrics, and usage patterns.
Key questions you help answer: "Can we trust this data?" "Where did this come from?" "Who owns this?"
You cannot grant data access without classification review.
Always cite data lineage and quality metrics.`,
    capabilities: ['data_quality_assessment', 'lineage_tracking', 'governance_oversight', 'access_review'],
    constraints: ['Cannot grant data access without classification review'],
  },
  {
    code: 'risk',
    name: 'CendiaRisk',
    role: 'Chief Risk Officer',
    description: 'Risk identification, assessment, and mitigation planning.',
    avatarUrl: '/agents/risk.png',
    systemPrompt: `You are CendiaRisk, the Chief Risk Officer AI agent for Datacendia.
Your role is risk identification, assessment, and mitigation planning.
You advocate for risk awareness, resilience, and preparedness.
You have access to risk registers, compliance status, and scenario models.
Key questions you help answer: "What could go wrong?" "How bad could it get?" "Are we prepared?"
You must escalate critical risks to human oversight.
Always quantify risks with probability and impact estimates.`,
    capabilities: ['risk_identification', 'risk_assessment', 'mitigation_planning', 'scenario_analysis'],
    constraints: ['Must escalate critical risks to human oversight'],
  },
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Create AI Agents
  console.log('Creating AI Agents (The Pantheon)...');
  for (const agent of agents) {
    await prisma.agent.upsert({
      where: { code: agent.code },
      update: {
        name: agent.name,
        role: agent.role,
        description: agent.description,
        avatarUrl: agent.avatarUrl,
        systemPrompt: agent.systemPrompt,
        capabilities: agent.capabilities,
        constraints: agent.constraints,
        isActive: true,
      },
      create: {
        code: agent.code,
        name: agent.name,
        role: agent.role,
        description: agent.description,
        avatarUrl: agent.avatarUrl,
        systemPrompt: agent.systemPrompt,
        capabilities: agent.capabilities,
        constraints: agent.constraints,
        modelConfig: {
          model: 'llama2',
          temperature: 0.7,
          max_tokens: 1000,
        },
        isActive: true,
      },
    });
    console.log(`  ✓ ${agent.name}`);
  }

  // Create demo organization and user
  console.log('\nCreating demo organization...');
  const org = await prisma.organization.upsert({
    where: { slug: 'datacendia-demo' },
    update: {},
    create: {
      name: 'Datacendia Demo',
      slug: 'datacendia-demo',
      industry: 'Technology',
      companySize: '51-200',
      settings: {
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
        currency: 'USD',
      },
    },
  });
  console.log(`  ✓ Organization: ${org.name}`);

  // Create demo user
  console.log('\nCreating demo user...');
  const passwordHash = await bcrypt.hash('demo123456', 12);
  const user = await prisma.user.upsert({
    where: { email: 'demo@datacendia.com' },
    update: {},
    create: {
      email: 'demo@datacendia.com',
      passwordHash,
      name: 'Demo User',
      organizationId: org.id,
      role: 'ADMIN',
      status: 'ACTIVE',
      preferences: {
        theme: 'light',
        notifications: true,
      },
    },
  });
  console.log(`  ✓ User: ${user.email} (password: demo123456)`);

  // Create sample metrics
  console.log('\nCreating sample metric definitions...');
  const metrics = [
    { code: 'revenue', name: 'Revenue', unit: 'USD', category: 'revenue' },
    { code: 'pipeline', name: 'Pipeline Value', unit: 'USD', category: 'sales' },
    { code: 'burn_rate', name: 'Burn Rate', unit: 'USD/month', category: 'revenue' },
    { code: 'nps', name: 'Net Promoter Score', unit: 'points', category: 'customer' },
    { code: 'churn', name: 'Churn Rate', unit: '%', category: 'customer' },
    { code: 'compliance', name: 'Compliance Score', unit: '%', category: 'operations' },
  ];

  for (const metric of metrics) {
    await prisma.metricDefinition.upsert({
      where: { organizationId_code: { organizationId: org.id, code: metric.code } },
      update: {},
      create: {
        organizationId: org.id,
        code: metric.code,
        name: metric.name,
        unit: metric.unit,
        category: metric.category,
        formula: { type: 'expression', expression: metric.code },
        ownerId: user.id,
      },
    });
    console.log(`  ✓ Metric: ${metric.name}`);
  }

  // Create initial health score
  console.log('\nCreating initial health score...');
  await prisma.healthScore.create({
    data: {
      organizationId: org.id,
      overall: 82,
      dataScore: 94,
      opsScore: 78,
      securityScore: 85,
      peopleScore: 71,
      calculatedAt: new Date(),
      details: {
        lastCalculation: new Date().toISOString(),
      },
    },
  });
  console.log('  ✓ Health score initialized');

  console.log('\n✅ Database seed completed successfully!');
  console.log('\n📋 Demo credentials:');
  console.log('   Email: demo@datacendia.com');
  console.log('   Password: demo123456');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
