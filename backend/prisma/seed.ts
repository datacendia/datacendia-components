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
    await prisma.agents.upsert({
      where: { code: agent.code },
      update: {
        name: agent.name,
        role: agent.role,
        description: agent.description,
        avatar_url: agent.avatarUrl,
        system_prompt: agent.systemPrompt,
        capabilities: agent.capabilities,
        constraints: agent.constraints,
        model_config: agent.modelConfig,
        is_active: true,
        updated_at: new Date(),
      },
      create: {
        id: crypto.randomUUID(),
        code: agent.code,
        name: agent.name,
        role: agent.role,
        description: agent.description,
        avatar_url: agent.avatarUrl,
        system_prompt: agent.systemPrompt,
        capabilities: agent.capabilities,
        constraints: agent.constraints,
        model_config: agent.modelConfig,
        is_active: true,
        updated_at: new Date(),
      },
    });
    console.log(`  ✓ Agent: ${agent.name} (${agent.code})`);
  }
}

async function seedDefaultOrganization() {
  console.log('🏢 Seeding Default Organization...');
  
  const org = await prisma.organizations.upsert({
    where: { slug: 'datacendia-demo' },
    update: {},
    create: {
      id: crypto.randomUUID(),
      name: 'Datacendia Demo',
      slug: 'datacendia-demo',
      industry: 'Technology',
      company_size: '51-200',
      updated_at: new Date(),
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
  
  // Create owner user (Stuart Rainey - Platform Owner)
  const ownerPasswordHash = await bcrypt.hash('DatacendiaOwner2024!', 12);
  
  const owner = await prisma.users.upsert({
    where: { email: 'stuart@datacendia.com' },
    update: {
      name: 'Stuart Rainey',
      role: UserRole.OWNER,
    },
    create: {
      id: crypto.randomUUID(),
      email: 'stuart@datacendia.com',
      password_hash: ownerPasswordHash,
      name: 'Stuart Rainey',
      role: UserRole.OWNER,
      organization_id: org.id,
      status: 'ACTIVE',
      updated_at: new Date(),
      preferences: {
        theme: 'dark',
        language: 'en',
        notifications: true,
      },
    },
  });
  
  console.log(`  ✓ Owner User: ${owner.email} (Stuart Rainey)`);

  // Create admin user
  const passwordHash = await bcrypt.hash('DatacendiaAdmin2024!', 12);
  
  const admin = await prisma.users.upsert({
    where: { email: 'admin@datacendia.com' },
    update: {},
    create: {
      id: crypto.randomUUID(),
      email: 'admin@datacendia.com',
      password_hash: passwordHash,
      name: 'System Administrator',
      role: UserRole.SUPER_ADMIN,
      organization_id: org.id,
      status: 'ACTIVE',
      updated_at: new Date(),
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
  await prisma.health_scores.create({
    data: {
      id: crypto.randomUUID(),
      organization_id: organizationId,
      overall: 94,
      data_score: 96,
      ops_score: 89,
      security_score: 98,
      people_score: 92,
      calculated_at: new Date(),
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
    { code: 'revenue_growth', name: 'Revenue Growth', category: 'Financial', unit: '%', target: 15, currentValue: 12.5 },
    { code: 'gross_margin', name: 'Gross Margin', category: 'Financial', unit: '%', target: 45, currentValue: 43.2 },
    { code: 'operating_expense', name: 'Operating Expense Ratio', category: 'Financial', unit: '%', target: 30, currentValue: 28.5 },
    { code: 'customer_satisfaction', name: 'Customer Satisfaction', category: 'Customer', unit: 'NPS', target: 80, currentValue: 78 },
    { code: 'customer_retention', name: 'Customer Retention', category: 'Customer', unit: '%', target: 95, currentValue: 92.3 },
    { code: 'churn_rate', name: 'Churn Rate', category: 'Customer', unit: '%', target: 5, currentValue: 4.2 },
    { code: 'employee_engagement', name: 'Employee Engagement', category: 'People', unit: '%', target: 85, currentValue: 82 },
    { code: 'employee_retention', name: 'Employee Retention', category: 'People', unit: '%', target: 90, currentValue: 88.5 },
    { code: 'training_completion', name: 'Training Completion', category: 'People', unit: '%', target: 100, currentValue: 94 },
    { code: 'system_uptime', name: 'System Uptime', category: 'Operations', unit: '%', target: 99.9, currentValue: 99.95 },
    { code: 'api_latency', name: 'API Latency', category: 'Operations', unit: 'ms', target: 100, currentValue: 42 },
    { code: 'incident_response', name: 'Incident Response Time', category: 'Operations', unit: 'min', target: 15, currentValue: 8 },
    { code: 'security_score', name: 'Security Score', category: 'Compliance', unit: 'score', target: 95, currentValue: 98 },
    { code: 'compliance_rate', name: 'Compliance Rate', category: 'Compliance', unit: '%', target: 100, currentValue: 99.2 },
    { code: 'audit_findings', name: 'Open Audit Findings', category: 'Compliance', unit: 'count', target: 0, currentValue: 2 },
    { code: 'market_share', name: 'Market Share', category: 'Strategic', unit: '%', target: 25, currentValue: 22.8 },
    { code: 'innovation_index', name: 'Innovation Index', category: 'Strategic', unit: 'score', target: 80, currentValue: 76 },
  ];
  
  for (const metric of metrics) {
    const metricId = crypto.randomUUID();
    await prisma.metric_definitions.upsert({
      where: { organization_id_code: { organization_id: organizationId, code: metric.code } },
      update: {},
      create: {
        id: metricId,
        organization_id: organizationId,
        code: metric.code,
        name: metric.name,
        category: metric.category,
        unit: metric.unit,
        formula: { type: 'direct', source: 'api' },
        thresholds: { warning: metric.target * 0.8, critical: metric.target * 0.6, target: metric.target },
        owner_id: ownerId,
        updated_at: new Date(),
      },
    });
    
    // Fetch the metric to get its actual ID (in case it already existed)
    const savedMetric = await prisma.metric_definitions.findFirst({
      where: { organization_id: organizationId, code: metric.code }
    });
    
    if (savedMetric) {
      // Add current and historical metric values
      const now = new Date();
      for (let i = 0; i < 7; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const variance = (Math.random() - 0.5) * 0.1 * metric.currentValue;
        await prisma.metric_values.create({
          data: {
            id: crypto.randomUUID(),
            metric_id: savedMetric.id,
            value: metric.currentValue + variance,
            dimensions: {},
            timestamp: date,
          },
        });
      }
    }
    
    console.log(`  ✓ Metric: ${metric.name} (${metric.currentValue}${metric.unit})`);
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
    await prisma.workflows.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: organizationId,
        updated_at: new Date(),
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
    await prisma.data_sources.upsert({
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
        organization_id: organizationId,
        name: ds.name,
        type: ds.type as any,
        status: ds.status as any,
        config: ds.config,
        credentials: (ds as any).credentials || {},
        last_sync_at: ds.lastSyncAt,
        sync_schedule: ds.syncSchedule,
        metadata: ds.metadata,
        updated_at: new Date(),
      },
    });
    console.log(`  ✓ Data Source: ${ds.name}`);
  }
}

// =============================================================================
// LINEAGE - Data Provenance
// =============================================================================

async function seedLineage(organizationId: string) {
  console.log('🔗 Seeding Lineage Data...');
  
  const entities = [
    { name: 'Customer Database', type: 'DATASET', source: 'PostgreSQL', quality: 95, records: 125000 },
    { name: 'Sales Transactions', type: 'TABLE', source: 'PostgreSQL', quality: 98, records: 890000 },
    { name: 'Marketing Events', type: 'TABLE', source: 'Snowflake', quality: 87, records: 456000 },
    { name: 'Financial Reports', type: 'REPORT', source: 'SAP', quality: 99, records: 2400 },
    { name: 'Revenue Forecast Model', type: 'MODEL', source: 'MLflow', quality: 92, records: null },
    { name: 'Customer 360 Pipeline', type: 'PIPELINE', source: 'Airflow', quality: 94, records: null },
    { name: 'Analytics API', type: 'API', source: 'REST', quality: 96, records: null },
    { name: 'User Behavior Data', type: 'DATASET', source: 'Segment', quality: 88, records: 2340000 },
  ];
  
  const createdEntities: { id: string; name: string }[] = [];
  
  for (const entity of entities) {
    const qualityLevel = entity.quality >= 95 ? 'EXCELLENT' : 
                        entity.quality >= 85 ? 'GOOD' : 
                        entity.quality >= 70 ? 'FAIR' : 'POOR';
    
    const created = await prisma.lineage_entities.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: organizationId,
        name: entity.name,
        entity_type: entity.type as any,
        description: `${entity.name} from ${entity.source}`,
        source: entity.source,
        quality_score: entity.quality,
        quality_level: qualityLevel as any,
        record_count: entity.records,
        metadata: { owner: 'Data Engineering', lastVerified: new Date().toISOString() },
      },
    });
    createdEntities.push({ id: created.id, name: entity.name });
    console.log(`  ✓ Entity: ${entity.name}`);
  }
  
  // Create relationships between entities
  const relationships = [
    { from: 'Customer Database', to: 'Sales Transactions', type: 'FEEDS' },
    { from: 'Sales Transactions', to: 'Financial Reports', type: 'TRANSFORMS_TO' },
    { from: 'Sales Transactions', to: 'Revenue Forecast Model', type: 'FEEDS' },
    { from: 'Marketing Events', to: 'Customer 360 Pipeline', type: 'FEEDS' },
    { from: 'User Behavior Data', to: 'Customer 360 Pipeline', type: 'FEEDS' },
    { from: 'Customer 360 Pipeline', to: 'Analytics API', type: 'TRANSFORMS_TO' },
    { from: 'Revenue Forecast Model', to: 'Financial Reports', type: 'DERIVES_FROM' },
  ];
  
  for (const rel of relationships) {
    const source = createdEntities.find(e => e.name === rel.from);
    const target = createdEntities.find(e => e.name === rel.to);
    if (source && target) {
      await prisma.lineage_relationships.create({
        data: {
          id: crypto.randomUUID(),
          source_id: source.id,
          target_id: target.id,
          relationship_type: rel.type as any,
          confidence: 0.95,
          transformations: [],
        },
      });
    }
  }
  console.log(`  ✓ Created ${relationships.length} lineage relationships`);
}

// =============================================================================
// PREDICT - Forecasting Models
// =============================================================================

async function seedPredictions(organizationId: string) {
  console.log('🔮 Seeding Prediction Models...');
  
  const models = [
    { name: 'Revenue Forecast Q4', type: 'TIME_SERIES', target: 'quarterly_revenue', accuracy: 94.2 },
    { name: 'Customer Churn Predictor', type: 'CLASSIFICATION', target: 'customer_churn', accuracy: 89.5 },
    { name: 'Demand Forecasting', type: 'TIME_SERIES', target: 'product_demand', accuracy: 91.8 },
    { name: 'Sales Pipeline Scorer', type: 'REGRESSION', target: 'deal_probability', accuracy: 87.3 },
    { name: 'Anomaly Detection System', type: 'ANOMALY_DETECTION', target: 'transaction_anomalies', accuracy: 96.1 },
  ];
  
  for (const model of models) {
    const modelId = crypto.randomUUID();
    await prisma.forecast_models.create({
      data: {
        id: modelId,
        organization_id: organizationId,
        name: model.name,
        model_type: model.type as any,
        description: `AI model for ${model.target} prediction`,
        target_metric: model.target,
        features: ['historical_data', 'seasonality', 'external_factors'],
        hyperparameters: { learning_rate: 0.01, epochs: 100, batch_size: 32 },
        accuracy: model.accuracy,
        mape: 100 - model.accuracy,
        training_status: 'TRAINED',
        last_trained_at: new Date(),
      },
    });
    
    // Add feature importance for each model
    const features = [
      { name: 'historical_trend', importance: 0.35 },
      { name: 'seasonality', importance: 0.25 },
      { name: 'market_conditions', importance: 0.20 },
      { name: 'customer_behavior', importance: 0.15 },
      { name: 'external_events', importance: 0.05 },
    ];
    
    for (const feature of features) {
      await prisma.feature_importance.create({
        data: {
          id: crypto.randomUUID(),
          model_id: modelId,
          feature_name: feature.name,
          importance: feature.importance,
          direction: feature.importance > 0.2 ? 'positive' : 'neutral',
        },
      });
    }
    
    // Add recent predictions
    const now = new Date();
    for (let i = 0; i < 10; i++) {
      const predDate = new Date(now);
      predDate.setDate(predDate.getDate() + i);
      await prisma.predictions.create({
        data: {
          id: crypto.randomUUID(),
          model_id: modelId,
          input_data: { date: predDate.toISOString(), context: 'quarterly_forecast' },
          predicted_value: 1000000 + Math.random() * 500000,
          confidence: 0.85 + Math.random() * 0.10,
          prediction_date: predDate,
        },
      });
    }
    
    console.log(`  ✓ Model: ${model.name} (${model.accuracy}% accuracy)`);
  }
}

// =============================================================================
// GUARD - Security Data
// =============================================================================

async function seedSecurityData(organizationId: string) {
  console.log('🛡️ Seeding Security Data...');
  
  // Security Policies
  const policies = [
    { name: 'Data Access Control', type: 'ACCESS_CONTROL', desc: 'Role-based access control for sensitive data' },
    { name: 'Encryption Standards', type: 'DATA_PROTECTION', desc: 'AES-256 encryption for data at rest and in transit' },
    { name: 'Network Segmentation', type: 'NETWORK_SECURITY', desc: 'Isolated network zones for production systems' },
    { name: 'SOX Compliance', type: 'COMPLIANCE', desc: 'Financial reporting compliance controls' },
    { name: 'GDPR Privacy', type: 'COMPLIANCE', desc: 'EU data privacy compliance requirements' },
    { name: 'Incident Response', type: 'OPERATIONAL', desc: 'Security incident handling procedures' },
  ];
  
  for (const policy of policies) {
    await prisma.security_policies.upsert({
      where: { organization_id_name: { organization_id: organizationId, name: policy.name } },
      update: {},
      create: {
        id: crypto.randomUUID(),
        organization_id: organizationId,
        name: policy.name,
        description: policy.desc,
        policy_type: policy.type as any,
        rules: [{ condition: 'always', action: 'enforce' }],
        enabled: true,
        enforcement: 'WARN',
      },
    });
    console.log(`  ✓ Policy: ${policy.name}`);
  }
  
  // Security Threats (some resolved, some active)
  const threats = [
    { type: 'PHISHING', severity: 'MEDIUM', title: 'Phishing attempt detected', status: 'RESOLVED', source: 'Email Gateway' },
    { type: 'POLICY_VIOLATION', severity: 'LOW', title: 'Unusual login location', status: 'RESOLVED', source: 'Auth Service' },
    { type: 'INTRUSION', severity: 'HIGH', title: 'Brute force attempt blocked', status: 'MITIGATED', source: 'Firewall' },
    { type: 'DATA_EXFILTRATION', severity: 'MEDIUM', title: 'Large data export flagged', status: 'INVESTIGATING', source: 'DLP System' },
  ];
  
  for (const threat of threats) {
    const detectedAt = new Date();
    detectedAt.setHours(detectedAt.getHours() - Math.floor(Math.random() * 72));
    
    await prisma.security_threats.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: organizationId,
        threat_type: threat.type as any,
        severity: threat.severity as any,
        status: threat.status as any,
        title: threat.title,
        description: `${threat.title} - Detected by ${threat.source}`,
        source: threat.source,
        target: 'Production Environment',
        indicators: ['ip_address', 'user_agent', 'timestamp'],
        mitigations: threat.status === 'RESOLVED' ? ['Blocked source', 'Updated rules'] : [],
        detected_at: detectedAt,
        resolved_at: threat.status === 'RESOLVED' ? new Date() : null,
      },
    });
    console.log(`  ✓ Threat: ${threat.title} (${threat.status})`);
  }
}

// =============================================================================
// ETHICS - AI Governance
// =============================================================================

async function seedEthicsData(organizationId: string) {
  console.log('⚖️ Seeding Ethics Data...');
  
  // Ethical Principles
  const principles = [
    { name: 'Fairness & Non-Discrimination', category: 'FAIRNESS', desc: 'AI systems must not discriminate based on protected characteristics' },
    { name: 'Transparency & Explainability', category: 'TRANSPARENCY', desc: 'AI decisions must be explainable to stakeholders' },
    { name: 'Privacy Protection', category: 'PRIVACY', desc: 'Personal data must be protected and minimized' },
    { name: 'Human Oversight', category: 'HUMAN_OVERSIGHT', desc: 'Critical AI decisions require human review' },
    { name: 'Safety & Security', category: 'SAFETY', desc: 'AI systems must be secure and fail safely' },
    { name: 'Accountability', category: 'ACCOUNTABILITY', desc: 'Clear ownership and responsibility for AI outcomes' },
  ];
  
  const createdPrinciples: { id: string; name: string }[] = [];
  
  for (const principle of principles) {
    const created = await prisma.ethics_principles.upsert({
      where: { organization_id_name: { organization_id: organizationId, name: principle.name } },
      update: {},
      create: {
        id: crypto.randomUUID(),
        organization_id: organizationId,
        name: principle.name,
        description: principle.desc,
        category: principle.category as any,
        weight: 1.0,
        status: 'ACTIVE',
        requirements: [{ check: 'automated', frequency: 'continuous' }],
      },
    });
    createdPrinciples.push({ id: created.id, name: principle.name });
    console.log(`  ✓ Principle: ${principle.name}`);
  }
  
  // Ethics Reviews (valid results: APPROVED, REJECTED, CONDITIONAL)
  const reviews = [
    { subject: 'Customer Churn Model', result: 'APPROVED', reviewer: 'Ethics Committee' },
    { subject: 'Pricing Algorithm', result: 'CONDITIONAL', reviewer: 'Data Ethics Lead' },
    { subject: 'Recommendation Engine', result: 'APPROVED', reviewer: 'AI Governance Board' },
    { subject: 'Credit Scoring Model', result: 'APPROVED', reviewer: 'Compliance Team' },
    { subject: 'Loan Risk Model', result: 'REJECTED', reviewer: 'Ethics Committee' },
  ];
  
  for (const review of reviews) {
    const submittedAt = new Date();
    submittedAt.setDate(submittedAt.getDate() - Math.floor(Math.random() * 30));
    
    await prisma.ethics_reviews.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: organizationId,
        principle_id: createdPrinciples[0]?.id,
        subject_type: 'MODEL',
        subject_id: crypto.randomUUID(),
        subject_name: review.subject,
        status: 'COMPLETED',
        result: review.result as any,
        reviewer: review.reviewer,
        notes: review.result === 'CONDITIONAL' ? 'Requires additional bias testing before full deployment' : 
               review.result === 'REJECTED' ? 'Failed fairness requirements - needs redesign' : 
               'Meets all ethical requirements',
        violations: review.result !== 'APPROVED' ? [{ principle: 'Fairness', severity: review.result === 'REJECTED' ? 'high' : 'medium' }] : [],
        submitted_at: submittedAt,
        completed_at: new Date(),
      },
    });
    console.log(`  ✓ Review: ${review.subject} (${review.result})`);
  }
  
  // Bias Checks
  const biasChecks = [
    { model: 'Customer Segmentation', score: 94, status: 'COMPLETED' },
    { model: 'Fraud Detection', score: 97, status: 'COMPLETED' },
    { model: 'Hiring Screener', score: 82, status: 'COMPLETED' },
  ];
  
  for (const check of biasChecks) {
    await prisma.bias_checks.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: organizationId,
        model_id: crypto.randomUUID(),
        model_name: check.model,
        status: check.status as any,
        overall_score: check.score,
        dimensions: {
          gender: check.score + Math.random() * 5 - 2.5,
          age: check.score + Math.random() * 5 - 2.5,
          geography: check.score + Math.random() * 5 - 2.5,
        },
        recommendations: check.score < 90 ? ['Review training data', 'Add fairness constraints'] : [],
        checked_at: new Date(),
      },
    });
    console.log(`  ✓ Bias Check: ${check.model} (${check.score}% fair)`);
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
    
    // Seed lineage data
    await seedLineage(org.id);
    console.log('');
    
    // Seed prediction models
    await seedPredictions(org.id);
    console.log('');
    
    // Seed security data
    await seedSecurityData(org.id);
    console.log('');
    
    // Seed ethics data
    await seedEthicsData(org.id);
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
