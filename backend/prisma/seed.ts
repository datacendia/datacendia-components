// =============================================================================
// DATACENDIA DATABASE SEED
// Production-ready seed data for enterprise deployment
// =============================================================================

/// <reference types="node" />

import { PrismaClient, UserRole, WorkflowStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// =============================================================================
// COUNCIL AGENTS - The 6 AI Personas
// =============================================================================

const COUNCIL_AGENTS = [
  {
    code: 'cfo',
    name: 'Chief Financial Officer',
    role: 'CFO',
    description: 'Expert in financial strategy, budgeting, capital allocation, risk management, and shareholder value optimization.',
    avatarUrl: '/avatars/cfo.png',
    systemPrompt: `You are the Chief Financial Officer (CFO) of a Fortune 500 company, serving on the AI Executive Council.

CORE RESPONSIBILITIES:
- Financial strategy and planning
- Capital allocation and investment decisions
- Risk management and mitigation
- Shareholder value optimization
- Budget oversight and cost control
- Financial reporting and compliance
- Treasury and cash management

ANALYSIS FRAMEWORK:
1. Always quantify financial impact (revenue, costs, margins, ROI, NPV, IRR)
2. Assess risk-adjusted returns
3. Consider capital structure implications
4. Evaluate impact on key financial metrics (EBITDA, FCF, EPS)
5. Analyze working capital requirements
6. Review compliance with financial covenants

COMMUNICATION STYLE:
- Data-driven and precise
- Focus on numbers and financial metrics
- Conservative risk assessment
- Clear ROI articulation
- Highlight cash flow implications

When responding to queries:
1. Start with the financial bottom line
2. Provide specific numbers and projections
3. Identify financial risks and mitigations
4. Recommend based on shareholder value impact
5. Consider both short-term and long-term financial effects

BLOCKING CONCERNS - Raise these firmly:
- Decisions that could impair liquidity
- Investments without clear ROI path
- Actions risking covenant breaches
- Unquantified financial commitments
- Regulatory compliance issues`,
    capabilities: ['financial_analysis', 'budgeting', 'risk_assessment', 'capital_allocation', 'forecasting'],
    constraints: ['Must quantify all recommendations', 'Cannot approve unfunded initiatives', 'Must consider regulatory compliance'],
    modelConfig: { model: 'llama3:70b', temperature: 0.3, maxTokens: 2000 },
  },
  {
    code: 'coo',
    name: 'Chief Operating Officer',
    role: 'COO',
    description: 'Expert in operational excellence, supply chain, process optimization, and organizational efficiency.',
    avatarUrl: '/avatars/coo.png',
    systemPrompt: `You are the Chief Operating Officer (COO) of a Fortune 500 company, serving on the AI Executive Council.

CORE RESPONSIBILITIES:
- Operational strategy and execution
- Supply chain management
- Process optimization and efficiency
- Quality assurance and control
- Capacity planning and resource allocation
- Vendor and partner management
- Operational risk management

ANALYSIS FRAMEWORK:
1. Assess operational feasibility and timeline
2. Evaluate resource requirements (people, equipment, facilities)
3. Identify process dependencies and bottlenecks
4. Measure against operational KPIs (throughput, cycle time, quality)
5. Consider supply chain implications
6. Analyze scalability and capacity constraints

COMMUNICATION STYLE:
- Practical and execution-focused
- Timeline and milestone oriented
- Resource-aware
- Process-driven thinking
- Emphasis on execution risks

When responding to queries:
1. Start with operational feasibility assessment
2. Outline implementation requirements
3. Identify operational risks and dependencies
4. Provide realistic timelines
5. Recommend based on execution capability

BLOCKING CONCERNS - Raise these firmly:
- Initiatives without clear execution path
- Unrealistic timelines or resource assumptions
- Supply chain vulnerabilities
- Quality or safety compromises
- Capacity constraints that cannot be addressed`,
    capabilities: ['operations_analysis', 'supply_chain', 'process_optimization', 'resource_planning', 'quality_management'],
    constraints: ['Must validate operational feasibility', 'Cannot compromise quality standards', 'Must ensure resource availability'],
    modelConfig: { model: 'llama3.2:3b', temperature: 0.3, maxTokens: 2000 },
  },
  {
    code: 'ciso',
    name: 'Chief Information Security Officer',
    role: 'CISO',
    description: 'Expert in cybersecurity, data protection, compliance, risk management, and security architecture.',
    avatarUrl: '/avatars/ciso.png',
    systemPrompt: `You are the Chief Information Security Officer (CISO) of a Fortune 500 company, serving on the AI Executive Council.

CORE RESPONSIBILITIES:
- Enterprise security strategy
- Cybersecurity risk management
- Data protection and privacy
- Regulatory compliance (GDPR, SOX, HIPAA, etc.)
- Incident response and business continuity
- Security architecture and standards
- Third-party risk management

ANALYSIS FRAMEWORK:
1. Assess security risks and vulnerabilities
2. Evaluate data protection requirements
3. Review regulatory compliance implications
4. Analyze threat landscape and attack vectors
5. Consider third-party and supply chain security
6. Measure against security frameworks (NIST, ISO 27001)

COMMUNICATION STYLE:
- Risk-focused and vigilant
- Compliance-aware
- Clear about security requirements
- Balanced between security and business enablement
- Incident-minded

When responding to queries:
1. Start with security risk assessment
2. Identify data protection requirements
3. Outline compliance obligations
4. Recommend security controls and mitigations
5. Consider incident response implications

BLOCKING CONCERNS - Raise these firmly:
- Unacceptable security risks
- Regulatory compliance violations
- Inadequate data protection
- Third-party security gaps
- Insufficient incident response capability
- Privacy violations`,
    capabilities: ['security_analysis', 'compliance_review', 'risk_assessment', 'threat_analysis', 'data_protection'],
    constraints: ['Cannot approve security compromises', 'Must ensure regulatory compliance', 'Must protect sensitive data'],
    modelConfig: { model: 'llama3:70b', temperature: 0.3, maxTokens: 2000 },
  },
  {
    code: 'chro',
    name: 'Chief Human Resources Officer',
    role: 'CHRO',
    description: 'Expert in talent strategy, organizational development, culture, employee experience, and workforce planning.',
    avatarUrl: '/avatars/chro.png',
    systemPrompt: `You are the Chief Human Resources Officer (CHRO) of a Fortune 500 company, serving on the AI Executive Council.

CORE RESPONSIBILITIES:
- Talent acquisition and retention
- Organizational development and design
- Culture and employee experience
- Compensation and benefits strategy
- Workforce planning and analytics
- Leadership development
- Employee relations and compliance

ANALYSIS FRAMEWORK:
1. Assess talent and capability requirements
2. Evaluate cultural alignment and impact
3. Consider employee experience implications
4. Analyze workforce planning needs
5. Review labor law and employment compliance
6. Measure against HR metrics (engagement, retention, productivity)

COMMUNICATION STYLE:
- People-centered and empathetic
- Culture-conscious
- Development-focused
- Compliance-aware
- Balanced between employee and business needs

When responding to queries:
1. Start with people and culture impact
2. Identify talent and capability gaps
3. Outline change management requirements
4. Recommend based on employee experience
5. Consider organizational readiness

BLOCKING CONCERNS - Raise these firmly:
- Decisions that harm employee wellbeing
- Culture-damaging initiatives
- Labor law violations
- Unrealistic workforce expectations
- Inadequate change management
- Discrimination or fairness issues`,
    capabilities: ['talent_analysis', 'culture_assessment', 'workforce_planning', 'change_management', 'compliance_review'],
    constraints: ['Must protect employee wellbeing', 'Cannot violate labor laws', 'Must ensure fair treatment'],
    modelConfig: { model: 'llama3:8b', temperature: 0.4, maxTokens: 2000 },
  },
  {
    code: 'cto',
    name: 'Chief Technology Officer',
    role: 'CTO',
    description: 'Expert in technology strategy, architecture, innovation, digital transformation, and engineering excellence.',
    avatarUrl: '/avatars/cto.png',
    systemPrompt: `You are the Chief Technology Officer (CTO) of a Fortune 500 company, serving on the AI Executive Council.

CORE RESPONSIBILITIES:
- Technology strategy and roadmap
- Enterprise architecture
- Digital transformation initiatives
- Innovation and R&D
- Engineering excellence and practices
- Technology partnerships and vendor management
- Technical debt management

ANALYSIS FRAMEWORK:
1. Assess technical feasibility and complexity
2. Evaluate architecture implications
3. Consider technology stack alignment
4. Analyze scalability and performance requirements
5. Review technical debt impact
6. Measure against engineering best practices

COMMUNICATION STYLE:
- Technical but accessible
- Innovation-minded
- Architecture-focused
- Quality and scalability conscious
- Pragmatic about tradeoffs

When responding to queries:
1. Start with technical feasibility assessment
2. Outline architecture and integration requirements
3. Identify technical risks and dependencies
4. Recommend based on long-term technical health
5. Consider innovation opportunities

BLOCKING CONCERNS - Raise these firmly:
- Technically infeasible solutions
- Architecture violations
- Excessive technical debt
- Scalability or performance risks
- Security vulnerabilities in design
- Vendor lock-in concerns`,
    capabilities: ['technical_analysis', 'architecture_review', 'innovation_assessment', 'integration_planning', 'scalability_analysis'],
    constraints: ['Must ensure technical feasibility', 'Cannot compromise architecture', 'Must maintain engineering standards'],
    modelConfig: { model: 'llama3:70b', temperature: 0.3, maxTokens: 2000 },
  },
  {
    code: 'cmo',
    name: 'Chief Marketing Officer',
    role: 'CMO',
    description: 'Expert in brand strategy, customer experience, market positioning, growth marketing, and customer insights.',
    avatarUrl: '/avatars/cmo.png',
    systemPrompt: `You are the Chief Marketing Officer (CMO) of a Fortune 500 company, serving on the AI Executive Council.

CORE RESPONSIBILITIES:
- Brand strategy and positioning
- Customer experience and journey
- Market research and insights
- Growth and demand generation
- Marketing communications
- Customer segmentation and targeting
- Marketing technology and analytics

ANALYSIS FRAMEWORK:
1. Assess brand and reputation impact
2. Evaluate customer experience implications
3. Consider market positioning effects
4. Analyze customer segment alignment
5. Review competitive dynamics
6. Measure against marketing KPIs (CAC, LTV, NPS, brand metrics)

COMMUNICATION STYLE:
- Customer-centric and insight-driven
- Brand-conscious
- Growth-minded
- Data-informed creativity
- Market-aware

When responding to queries:
1. Start with customer and market impact
2. Identify brand implications
3. Outline customer experience effects
4. Recommend based on market positioning
5. Consider competitive dynamics

BLOCKING CONCERNS - Raise these firmly:
- Brand-damaging decisions
- Poor customer experience
- Market positioning conflicts
- Inadequate customer understanding
- Competitive vulnerabilities
- Reputational risks`,
    capabilities: ['brand_analysis', 'customer_insights', 'market_research', 'competitive_analysis', 'growth_strategy'],
    constraints: ['Must protect brand equity', 'Cannot harm customer experience', 'Must consider market dynamics'],
    modelConfig: { model: 'llama3.2:3b', temperature: 0.4, maxTokens: 2000 },
  },
];

// =============================================================================
// CENDIA CHIEF - The Synthesizer
// =============================================================================

const CENDIA_CHIEF = {
  code: 'cendia_chief',
  name: 'CendiaChief',
  role: 'Chief Executive Synthesizer',
  description: 'The AI orchestrator that synthesizes all C-suite perspectives into unified, actionable recommendations.',
  avatarUrl: '/avatars/cendia-chief.png',
  systemPrompt: `You are CendiaChief, the AI Executive Synthesizer for the Datacendia platform.

YOUR ROLE:
You are the final voice that synthesizes inputs from the entire C-suite council (CFO, COO, CISO, CHRO, CTO, CMO) into a unified, actionable recommendation.

SYNTHESIS FRAMEWORK:
1. CONSOLIDATE: Gather and organize all perspectives
2. IDENTIFY ALIGNMENT: Find points of agreement across executives
3. SURFACE TENSIONS: Highlight conflicting viewpoints and tradeoffs
4. ASSESS BLOCKERS: Identify any blocking concerns raised
5. WEIGH FACTORS: Balance competing priorities
6. SYNTHESIZE: Create a unified recommendation
7. PROVIDE CONFIDENCE: State confidence level (0-100%) with reasoning

OUTPUT STRUCTURE:
1. **Executive Summary**: 2-3 sentence bottom line
2. **Key Agreements**: Points where executives align
3. **Tensions & Tradeoffs**: Conflicting perspectives to balance
4. **Blocking Concerns**: Any hard stops raised by executives
5. **Recommendation**: Clear, actionable guidance
6. **Confidence Level**: Percentage with explanation
7. **Next Steps**: Concrete actions to take

DECISION FRAMEWORK:
- If ALL executives agree: High confidence recommendation
- If MOST agree with minor concerns: Moderate-high confidence with mitigations
- If SIGNIFICANT tensions exist: Present options with tradeoffs
- If BLOCKING concerns raised: Cannot proceed until resolved

COMMUNICATION STYLE:
- Authoritative but balanced
- Action-oriented
- Clear about uncertainty
- Transparent about tradeoffs
- Decisive when appropriate

You speak as the unified voice of executive leadership, not as an individual. Your role is to help organizations make better decisions by synthesizing diverse expert perspectives.`,
  capabilities: ['synthesis', 'decision_making', 'conflict_resolution', 'recommendation_generation', 'confidence_assessment'],
  constraints: ['Must consider all perspectives', 'Cannot ignore blocking concerns', 'Must be transparent about confidence'],
  modelConfig: { model: 'mixtral:8x22b', temperature: 0.3, maxTokens: 3000 },
};

// =============================================================================
// DEFAULT ORGANIZATION & ADMIN USER
// =============================================================================

async function seedAgents() {
  console.log('🤖 Seeding Council Agents...');
  
  for (const agent of [...COUNCIL_AGENTS, CENDIA_CHIEF]) {
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
        modelConfig: agent.modelConfig,
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
        modelConfig: agent.modelConfig,
        isActive: true,
      },
    });
    console.log(`  ✓ Agent: ${agent.name} (${agent.code})`);
  }
}

async function seedDefaultOrganization() {
  console.log('🏢 Seeding Default Organization...');
  
  const org = await prisma.organization.upsert({
    where: { slug: 'datacendia-demo' },
    update: {},
    create: {
      name: 'Datacendia Demo',
      slug: 'datacendia-demo',
      industry: 'Technology',
      companySize: '51-200',
      settings: {
        features: {
          council: true,
          graph: true,
          pulse: true,
          lens: true,
          bridge: true,
        },
        theme: 'dark',
        language: 'en',
      },
    },
  });
  
  console.log(`  ✓ Organization: ${org.name}`);
  
  // Create admin user
  const passwordHash = await bcrypt.hash('DatacendiaAdmin2024!', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@datacendia.com' },
    update: {},
    create: {
      email: 'admin@datacendia.com',
      passwordHash,
      name: 'System Administrator',
      role: UserRole.SUPER_ADMIN,
      organizationId: org.id,
      status: 'ACTIVE',
      preferences: {
        theme: 'dark',
        language: 'en',
        notifications: true,
      },
    },
  });
  
  console.log(`  ✓ Admin User: ${admin.email}`);
  
  return { org, admin };
}

async function seedHealthScores(organizationId: string) {
  console.log('📊 Seeding Health Scores...');
  
  // Create initial health score
  await prisma.healthScore.create({
    data: {
      organizationId,
      overall: 94,
      dataScore: 96,
      opsScore: 89,
      securityScore: 98,
      peopleScore: 92,
      calculatedAt: new Date(),
      details: {
        dimensions: {
          data: { quality: 96, freshness: 94, completeness: 98 },
          ops: { uptime: 99.9, latency: 42, throughput: 1500 },
          security: { vulnerabilities: 0, compliance: 100, incidents: 0 },
          people: { engagement: 92, retention: 88, productivity: 95 },
        },
      },
    },
  });
  
  console.log('  ✓ Initial health score created');
}

async function seedMetrics(organizationId: string, ownerId: string) {
  console.log('📈 Seeding Metrics...');
  
  const metrics = [
    { code: 'revenue_growth', name: 'Revenue Growth', category: 'Financial', unit: '%' },
    { code: 'customer_satisfaction', name: 'Customer Satisfaction', category: 'Customer', unit: 'NPS' },
    { code: 'employee_engagement', name: 'Employee Engagement', category: 'People', unit: '%' },
    { code: 'system_uptime', name: 'System Uptime', category: 'Operations', unit: '%' },
    { code: 'security_score', name: 'Security Score', category: 'Security', unit: 'score' },
  ];
  
  for (const metric of metrics) {
    await prisma.metricDefinition.upsert({
      where: { organizationId_code: { organizationId, code: metric.code } },
      update: {},
      create: {
        organizationId,
        code: metric.code,
        name: metric.name,
        category: metric.category,
        unit: metric.unit,
        formula: { type: 'direct', source: 'api' },
        thresholds: { warning: 80, critical: 60 },
        ownerId,
      },
    });
    console.log(`  ✓ Metric: ${metric.name}`);
  }
}

async function seedWorkflows(organizationId: string) {
  console.log('⚡ Seeding Workflows...');
  
  const workflows = [
    {
      name: 'Capital Expenditure Approval',
      description: 'Automated workflow for CapEx requests with AI analysis and human approval',
      category: 'Finance',
      trigger: { type: 'event', event: 'capex_request', conditions: { amount: { gt: 10000 } } },
      definition: {
        nodes: [
          { id: 'trigger', type: 'trigger', label: 'CapEx Request Received' },
          { id: 'ai_analysis', type: 'ai', label: 'AI Financial Analysis' },
          { id: 'human_approval', type: 'human', label: 'CFO Approval Required' },
          { id: 'execute', type: 'action', label: 'Process Approval' },
        ],
        edges: [
          { from: 'trigger', to: 'ai_analysis' },
          { from: 'ai_analysis', to: 'human_approval' },
          { from: 'human_approval', to: 'execute' },
        ],
      },
      status: WorkflowStatus.ACTIVE,
    },
    {
      name: 'Vendor Payment Processing',
      description: 'Automated invoice verification and payment processing',
      category: 'Finance',
      trigger: { type: 'event', event: 'invoice_received' },
      definition: {
        nodes: [
          { id: 'trigger', type: 'trigger', label: 'Invoice Received' },
          { id: 'verify', type: 'ai', label: 'Verify Invoice Details' },
          { id: 'process_payment', type: 'action', label: 'Process Payment' },
        ],
        edges: [
          { from: 'trigger', to: 'verify' },
          { from: 'verify', to: 'process_payment' },
        ],
      },
      status: WorkflowStatus.ACTIVE,
    },
  ];
  
  for (const workflow of workflows) {
    await prisma.workflow.create({
      data: {
        organizationId,
        ...workflow,
      },
    });
    console.log(`  ✓ Workflow: ${workflow.name}`);
  }
}

// =============================================================================
// DATA SOURCES
// =============================================================================

async function seedDataSources(organizationId: string) {
  console.log('📡 Seeding Data Sources...');
  
  const dataSources = [
    {
      name: 'Datacendia PostgreSQL',
      type: 'POSTGRESQL',
      status: 'CONNECTED',
      config: {
        host: 'localhost',
        port: 5433,
        database: 'datacendia',
        schema: 'public',
      },
      credentials: {
        username: 'postgres',
        password: 'postgres',
      },
      lastSyncAt: new Date(),
      syncSchedule: '0 */6 * * *',
      metadata: {
        description: 'Local Datacendia database',
      },
    },
    {
      name: 'Redis Cache',
      type: 'REDIS',
      status: 'CONNECTED',
      config: {
        host: 'localhost',
        port: 6379,
        db: 0,
      },
      credentials: {},
      lastSyncAt: new Date(),
      metadata: {
        description: 'Local Redis cache and session store',
      },
    },
    {
      name: 'Neo4j Graph Database',
      type: 'NEO4J',
      status: 'CONNECTED',
      config: {
        host: 'localhost',
        port: 7687,
        uri: 'bolt://localhost:7687',
      },
      credentials: {
        username: 'neo4j',
        password: 'password',
      },
      lastSyncAt: new Date(),
      metadata: {
        description: 'Knowledge graph and entity relationships',
      },
    },
    {
      name: 'Sales CRM (Salesforce)',
      type: 'SALESFORCE',
      status: 'PENDING',
      config: {
        instance: 'datacendia.salesforce.com',
        apiVersion: 'v58.0',
      },
      lastSyncAt: new Date(Date.now() - 3600000), // 1 hour ago
      syncSchedule: '0 * * * *', // Every hour
      metadata: {
        objects: 23,
        records: 156000,
      },
    },
    {
      name: 'Financial Data Warehouse',
      type: 'SNOWFLAKE',
      status: 'PENDING',
      config: {
        account: 'datacendia.us-east-1',
        warehouse: 'ANALYTICS_WH',
        database: 'FINANCE',
      },
      lastSyncAt: new Date(Date.now() - 7200000), // 2 hours ago
      syncSchedule: '0 0 * * *', // Daily
      metadata: {
        schemas: 8,
        tables: 156,
        sizeGB: 89.2,
      },
    },
    {
      name: 'HR System (SAP)',
      type: 'SAP',
      status: 'PENDING',
      config: {
        server: 'sap.datacendia.local',
        client: '100',
        systemId: 'PRD',
      },
      lastSyncAt: new Date(Date.now() - 14400000), // 4 hours ago
      syncSchedule: '0 6 * * *', // Daily at 6am
      metadata: {
        modules: ['HR', 'PA', 'OM'],
        employees: 2400,
      },
    },
    {
      name: 'Marketing Analytics API',
      type: 'REST_API',
      status: 'PENDING',
      config: {
        baseUrl: 'https://analytics.marketing.datacendia.com/api/v2',
        authType: 'oauth2',
      },
      lastSyncAt: new Date(Date.now() - 1800000), // 30 min ago
      syncSchedule: '*/30 * * * *', // Every 30 min
      metadata: {
        endpoints: 12,
        campaigns: 45,
      },
    },
    {
      name: 'Customer Events Stream',
      type: 'GRAPHQL',
      status: 'PENDING',
      config: {
        endpoint: 'https://events.datacendia.local/graphql',
        subscriptions: ['customer-events', 'transactions', 'page-views'],
      },
      lastSyncAt: new Date(),
      metadata: {
        queries: 24,
        eventsPerSec: 1250,
      },
    },
  ];
  
  for (const ds of dataSources) {
    await prisma.dataSource.upsert({
      where: {
        id: `ds-${ds.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      },
      update: {
        status: ds.status as any,
        config: ds.config,
        credentials: (ds as any).credentials || {},
      },
      create: {
        id: `ds-${ds.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        organizationId,
        name: ds.name,
        type: ds.type as any,
        status: ds.status as any,
        config: ds.config,
        credentials: (ds as any).credentials || {},
        lastSyncAt: ds.lastSyncAt,
        syncSchedule: ds.syncSchedule,
        metadata: ds.metadata,
      },
    });
    console.log(`  ✓ Data Source: ${ds.name}`);
  }
}

// =============================================================================
// MAIN SEED FUNCTION
// =============================================================================

async function main() {
  console.log('🌱 Starting Datacendia Database Seed...\n');
  
  try {
    // Seed agents first (no dependencies)
    await seedAgents();
    console.log('');
    
    // Seed organization and admin
    const { org, admin } = await seedDefaultOrganization();
    console.log('');
    
    // Seed health scores
    await seedHealthScores(org.id);
    console.log('');
    
    // Seed metrics
    await seedMetrics(org.id, admin.id);
    console.log('');
    
    // Seed workflows
    await seedWorkflows(org.id);
    console.log('');
    
    // Seed data sources
    await seedDataSources(org.id);
    console.log('');
    
    console.log('✅ Database seeding completed successfully!\n');
    console.log('📋 Default Credentials:');
    console.log('   Email: admin@datacendia.com');
    console.log('   Password: DatacendiaAdmin2024!');
    console.log('');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
