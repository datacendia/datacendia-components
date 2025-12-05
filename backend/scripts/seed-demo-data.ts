/**
 * DATACENDIA DEMO DATA SEEDER
 * Creates 2 realistic companies with 10,000+ rows of enterprise data
 * 
 * Run: npx ts-node scripts/seed-demo-data.ts
 */

import 'dotenv/config';
import { PrismaClient, UserRole, WorkflowStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ============================================================================
// CONFIGURATION
// ============================================================================

const COMPANIES = [
  {
    name: 'Nexus Financial Group',
    slug: 'nexus-financial',
    industry: 'Financial Services',
    companySize: '1000-5000',
    description: 'A leading financial services company specializing in wealth management, investment banking, and insurance products.',
  },
  {
    name: 'Velocity Manufacturing Corp',
    slug: 'velocity-manufacturing',
    industry: 'Manufacturing',
    companySize: '5000+',
    description: 'Global manufacturer of precision components for aerospace, automotive, and medical device industries.',
  },
];

// Helper functions
const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number, decimals = 2) => 
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
const randomChoice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomDate = (start: Date, end: Date) => 
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

// ============================================================================
// DATA GENERATORS
// ============================================================================

const DEPARTMENTS = ['Engineering', 'Sales', 'Marketing', 'Finance', 'Operations', 'HR', 'Legal', 'IT', 'Product', 'Customer Success'];
const JOB_TITLES = ['Manager', 'Director', 'VP', 'Analyst', 'Specialist', 'Coordinator', 'Lead', 'Senior', 'Junior', 'Associate'];
const FIRST_NAMES = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley', 'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'];

const METRIC_TYPES = [
  { code: 'revenue', name: 'Revenue', category: 'Financial', unit: 'USD' },
  { code: 'gross_margin', name: 'Gross Margin', category: 'Financial', unit: '%' },
  { code: 'operating_income', name: 'Operating Income', category: 'Financial', unit: 'USD' },
  { code: 'net_income', name: 'Net Income', category: 'Financial', unit: 'USD' },
  { code: 'customer_count', name: 'Customer Count', category: 'Customer', unit: 'count' },
  { code: 'churn_rate', name: 'Churn Rate', category: 'Customer', unit: '%' },
  { code: 'nps_score', name: 'NPS Score', category: 'Customer', unit: 'score' },
  { code: 'csat_score', name: 'CSAT Score', category: 'Customer', unit: '%' },
  { code: 'employee_count', name: 'Employee Count', category: 'People', unit: 'count' },
  { code: 'attrition_rate', name: 'Attrition Rate', category: 'People', unit: '%' },
  { code: 'engagement_score', name: 'Employee Engagement', category: 'People', unit: '%' },
  { code: 'system_uptime', name: 'System Uptime', category: 'Operations', unit: '%' },
  { code: 'incident_count', name: 'Incident Count', category: 'Operations', unit: 'count' },
  { code: 'lead_time', name: 'Lead Time', category: 'Operations', unit: 'days' },
  { code: 'security_score', name: 'Security Score', category: 'Security', unit: 'score' },
  { code: 'vulnerability_count', name: 'Open Vulnerabilities', category: 'Security', unit: 'count' },
];

const WORKFLOW_TEMPLATES = [
  { name: 'Capital Expenditure Approval', category: 'Finance', description: 'Automated CapEx request with AI analysis' },
  { name: 'Vendor Onboarding', category: 'Procurement', description: 'New vendor verification and setup' },
  { name: 'Employee Offboarding', category: 'HR', description: 'Exit process automation' },
  { name: 'Contract Review', category: 'Legal', description: 'AI-assisted contract analysis' },
  { name: 'Incident Response', category: 'Security', description: 'Security incident handling' },
  { name: 'Budget Reallocation', category: 'Finance', description: 'Cross-department budget transfers' },
  { name: 'Customer Escalation', category: 'Customer Success', description: 'Priority customer issue handling' },
  { name: 'Product Launch', category: 'Product', description: 'Go-to-market checklist automation' },
];

const ALERT_TYPES = [
  { type: 'WARNING', message: 'Revenue growth slowing - 15% below target' },
  { type: 'CRITICAL', message: 'System latency exceeding SLA threshold' },
  { type: 'INFO', message: 'Quarterly report ready for review' },
  { type: 'WARNING', message: 'Customer churn rate increasing' },
  { type: 'CRITICAL', message: 'Security vulnerability detected in production' },
  { type: 'INFO', message: 'New compliance regulation published' },
  { type: 'WARNING', message: 'Employee satisfaction score declining' },
  { type: 'CRITICAL', message: 'Database approaching capacity limit' },
];

const DECISION_TOPICS = [
  'Should we expand into the European market in Q2?',
  'Evaluate acquisition of competitor TechStart Inc',
  'Should we increase R&D budget by 20%?',
  'Assess feasibility of remote-first policy',
  'Review proposal to outsource IT operations',
  'Evaluate launching a new product line',
  'Should we renegotiate vendor contracts?',
  'Assess impact of new regulatory requirements',
  'Review pricing strategy for enterprise tier',
  'Evaluate partnership with CloudScale Inc',
];

// ============================================================================
// SEEDING FUNCTIONS
// ============================================================================

async function seedOrganization(company: typeof COMPANIES[0]) {
  console.log(`\n🏢 Creating organization: ${company.name}`);
  
  const org = await prisma.organization.upsert({
    where: { slug: company.slug },
    update: {},
    create: {
      name: company.name,
      slug: company.slug,
      industry: company.industry,
      companySize: company.companySize,
      settings: {
        features: { council: true, graph: true, pulse: true, lens: true, bridge: true },
        theme: 'dark',
        language: 'en',
        notifications: { email: true, slack: false, inApp: true },
      },
    },
  });
  
  console.log(`  ✓ Organization created: ${org.id}`);
  return org;
}

async function seedUsers(orgId: string, orgSlug: string, count: number) {
  console.log(`  👥 Creating ${count} users...`);
  
  const users = [];
  const passwordHash = await bcrypt.hash('Demo2024!', 10);
  
  // Create admin user first
  const admin = await prisma.user.upsert({
    where: { email: `admin@${orgSlug}.com` },
    update: {},
    create: {
      email: `admin@${orgSlug}.com`,
      passwordHash,
      name: 'System Administrator',
      role: UserRole.SUPER_ADMIN,
      organizationId: orgId,
      status: 'ACTIVE',
      preferences: { theme: 'dark', notifications: true },
    },
  });
  users.push(admin);
  
  // Create regular users
  for (let i = 0; i < count - 1; i++) {
    const firstName = randomChoice(FIRST_NAMES);
    const lastName = randomChoice(LAST_NAMES);
    const department = randomChoice(DEPARTMENTS);
    const title = `${randomChoice(JOB_TITLES)} of ${department}`;
    
    const user = await prisma.user.upsert({
      where: { email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@${orgSlug}.com` },
      update: {},
      create: {
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@${orgSlug}.com`,
        passwordHash,
        name: `${firstName} ${lastName}`,
        role: i < 5 ? UserRole.ADMIN : UserRole.VIEWER,
        organizationId: orgId,
        status: 'ACTIVE',
        preferences: {
          theme: randomChoice(['dark', 'light']),
          notifications: Math.random() > 0.3,
          department,
          title,
        },
      },
    });
    users.push(user);
  }
  
  console.log(`    ✓ Created ${users.length} users`);
  return users;
}

async function seedMetrics(orgId: string, ownerId: string) {
  console.log(`  📊 Creating metrics and 24 months of data...`);
  
  let dataPointCount = 0;
  
  for (const metric of METRIC_TYPES) {
    const metricDef = await prisma.metricDefinition.upsert({
      where: { organizationId_code: { organizationId: orgId, code: metric.code } },
      update: {},
      create: {
        organizationId: orgId,
        code: metric.code,
        name: metric.name,
        category: metric.category,
        unit: metric.unit,
        formula: { type: 'direct', source: 'api' },
        thresholds: { warning: 80, critical: 60 },
        ownerId,
      },
    });
    
    // Generate 24 months of daily data (720 data points per metric)
    const dataPoints = [];
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 24);
    
    let baseValue = getBaseValueForMetric(metric.code);
    
    for (let day = 0; day < 720; day++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + day);
      
      // Add realistic variance and trend
      const trend = day * 0.001 * (Math.random() > 0.5 ? 1 : -1);
      const seasonality = Math.sin(day / 30 * Math.PI) * 0.05;
      const noise = (Math.random() - 0.5) * 0.1;
      
      const value = baseValue * (1 + trend + seasonality + noise);
      
      dataPoints.push({
        metricId: metricDef.id,
        value,
        timestamp: date,
        dimensions: { source: 'seed', generated: true },
      });
    }
    
    await prisma.metricValue.createMany({ data: dataPoints, skipDuplicates: true });
    dataPointCount += dataPoints.length;
  }
  
  console.log(`    ✓ Created ${METRIC_TYPES.length} metrics with ${dataPointCount} data points`);
  return dataPointCount;
}

function getBaseValueForMetric(code: string): number {
  const bases: Record<string, number> = {
    revenue: 50000000,
    gross_margin: 35,
    operating_income: 8000000,
    net_income: 5000000,
    customer_count: 2500,
    churn_rate: 5,
    nps_score: 45,
    csat_score: 85,
    employee_count: 1200,
    attrition_rate: 12,
    engagement_score: 72,
    system_uptime: 99.5,
    incident_count: 15,
    lead_time: 14,
    security_score: 85,
    vulnerability_count: 8,
  };
  return bases[code] || 100;
}

async function seedWorkflows(orgId: string) {
  console.log(`  ⚡ Creating workflows and executions...`);
  
  let executionCount = 0;
  
  for (const template of WORKFLOW_TEMPLATES) {
    const workflow = await prisma.workflow.create({
      data: {
        organizationId: orgId,
        name: template.name,
        description: template.description,
        category: template.category,
        status: randomChoice([WorkflowStatus.ACTIVE, WorkflowStatus.ACTIVE, WorkflowStatus.DRAFT]),
        trigger: { type: 'event', event: template.name.toLowerCase().replace(/ /g, '_') },
        definition: {
          nodes: [
            { id: 'start', type: 'trigger', label: 'Start' },
            { id: 'process', type: 'ai', label: 'AI Analysis' },
            { id: 'approve', type: 'human', label: 'Approval' },
            { id: 'end', type: 'action', label: 'Complete' },
          ],
          edges: [
            { from: 'start', to: 'process' },
            { from: 'process', to: 'approve' },
            { from: 'approve', to: 'end' },
          ],
        },
      },
    });
    
    // Create execution history (50-100 executions per workflow)
    const execCount = randomBetween(50, 100);
    for (let i = 0; i < execCount; i++) {
      const startedAt = randomDate(new Date('2024-01-01'), new Date());
      const duration = randomBetween(60, 3600) * 1000;
      
      await prisma.workflowExecution.create({
        data: {
          workflowId: workflow.id,
          status: randomChoice(['COMPLETED', 'COMPLETED', 'COMPLETED', 'FAILED', 'PENDING']) as any,
          parameters: { requestId: `REQ-${randomBetween(1000, 9999)}` },
          outputs: { result: 'processed', confidence: randomFloat(0.7, 0.99) },
          progress: 100,
          startedAt,
          completedAt: new Date(startedAt.getTime() + duration),
        },
      });
      executionCount++;
    }
  }
  
  console.log(`    ✓ Created ${WORKFLOW_TEMPLATES.length} workflows with ${executionCount} executions`);
  return executionCount;
}

async function seedAlerts(orgId: string, users: any[]) {
  console.log(`  🚨 Creating alerts...`);
  
  const alerts = [];
  
  for (let i = 0; i < 200; i++) {
    const template = randomChoice(ALERT_TYPES);
    const createdAt = randomDate(new Date('2024-06-01'), new Date());
    
    alerts.push({
      organizationId: orgId,
      title: `Alert #${i + 1}`,
      severity: (template.type === 'CRITICAL' ? 'CRITICAL' : template.type === 'WARNING' ? 'WARNING' : 'INFO') as any,
      message: template.message,
      source: randomChoice(['pulse', 'council', 'system', 'integration']),
      status: randomChoice(['ACTIVE', 'ACKNOWLEDGED', 'RESOLVED', 'RESOLVED']) as any,
      metadata: { generated: true, index: i },
      createdAt,
    });
  }
  
  await prisma.alert.createMany({ data: alerts });
  console.log(`    ✓ Created ${alerts.length} alerts`);
  return alerts.length;
}

async function seedDeliberations(orgId: string, users: any[]) {
  console.log(`  🤔 Creating council deliberations...`);
  
  let messageCount = 0;
  
  for (const topic of DECISION_TOPICS) {
    const createdAt = randomDate(new Date('2024-01-01'), new Date());
    
    const deliberation = await prisma.deliberation.create({
      data: {
        organizationId: orgId,
        question: topic,
        config: { mode: randomChoice(['war-room', 'due-diligence', 'innovation-lab', 'compliance', 'rapid']) },
        status: randomChoice(['COMPLETED', 'COMPLETED', 'IN_PROGRESS', 'PENDING']) as any,
        createdAt,
        confidence: randomFloat(0.6, 0.95),
        decision: {
          summary: `Deliberation on: ${topic}. The council analyzed multiple perspectives and provided recommendations.`,
          duration: randomBetween(300, 1800),
          participantCount: randomBetween(4, 7),
          consensusLevel: randomChoice(['high', 'medium', 'low']),
        },
      },
    });
    
    // Add council messages (8-15 per deliberation)
    const msgCount = randomBetween(8, 15);
    const agents = ['cfo', 'coo', 'ciso', 'chro', 'cto', 'cmo', 'cendia_chief'];
    
    for (let i = 0; i < msgCount; i++) {
      // Get agent ID from database
      const agent = await prisma.agent.findFirst({ where: { code: randomChoice(agents) } });
      if (agent) {
        await prisma.deliberationMessage.create({
          data: {
            deliberationId: deliberation.id,
            agentId: agent.id,
            phase: randomChoice(['analysis', 'debate', 'synthesis']),
            content: generateAgentResponse(topic, i),
            confidence: randomFloat(0.7, 0.95),
            sources: [{ type: 'internal', ref: `doc-${randomBetween(100, 999)}` }],
            createdAt: new Date(createdAt.getTime() + i * 60000),
          },
        });
      }
      messageCount++;
    }
  }
  
  console.log(`    ✓ Created ${DECISION_TOPICS.length} deliberations with ${messageCount} messages`);
  return messageCount;
}

function generateAgentResponse(topic: string, index: number): string {
  const responses = [
    `From a financial perspective, this initiative requires careful analysis of ROI and cash flow implications. Initial estimates suggest a 18-24 month payback period.`,
    `Operationally, we have the capacity to execute this. However, I recommend a phased approach to minimize disruption to current operations.`,
    `I have significant security concerns that must be addressed. We need to ensure compliance with SOC 2 and GDPR requirements before proceeding.`,
    `The people impact is considerable. We'll need change management support and clear communication to maintain employee engagement.`,
    `Technically feasible with our current stack. I recommend allocating 2 sprints for proof-of-concept before full commitment.`,
    `Market timing is favorable. Our competitors haven't moved in this space yet, giving us first-mover advantage.`,
    `Synthesizing the council's input: There's general alignment on moving forward with appropriate risk mitigations. Confidence level: 78%.`,
    `I challenge the revenue projections. Historical data suggests we should apply a 15% haircut to the optimistic scenario.`,
    `Building on CTO's point, we should consider the technical debt implications of this approach over a 3-year horizon.`,
    `The regulatory landscape is evolving. I recommend building in flexibility for compliance adjustments.`,
  ];
  return responses[index % responses.length];
}

async function seedHealthScores(orgId: string) {
  console.log(`  💊 Creating health score history...`);
  
  const scores = [];
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 12);
  
  for (let day = 0; day < 365; day++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + day);
    
    scores.push({
      organizationId: orgId,
      overall: randomBetween(85, 98),
      dataScore: randomBetween(88, 99),
      opsScore: randomBetween(82, 96),
      securityScore: randomBetween(90, 100),
      peopleScore: randomBetween(78, 95),
      calculatedAt: date,
      details: {
        dimensions: {
          data: { quality: randomBetween(90, 99), freshness: randomBetween(85, 98) },
          ops: { uptime: randomFloat(99.0, 99.99), latency: randomBetween(30, 80) },
          security: { vulnerabilities: randomBetween(0, 5), compliance: randomBetween(95, 100) },
          people: { engagement: randomBetween(70, 90), retention: randomBetween(85, 95) },
        },
      },
    });
  }
  
  await prisma.healthScore.createMany({ data: scores });
  console.log(`    ✓ Created ${scores.length} health score records`);
  return scores.length;
}

async function seedAuditLogs(orgId: string, users: any[]) {
  console.log(`  📝 Creating audit logs...`);
  
  const logs = [];
  const actions = [
    'user.login', 'user.logout', 'deliberation.create', 'deliberation.complete',
    'workflow.execute', 'workflow.update', 'settings.update', 'data_source.connect',
    'alert.acknowledge', 'alert.resolve', 'report.generate', 'export.data',
  ];
  const resources = ['user', 'deliberation', 'workflow', 'settings', 'data_source', 'alert', 'report'];
  
  for (let i = 0; i < 500; i++) {
    const action = randomChoice(actions);
    const createdAt = randomDate(new Date('2024-01-01'), new Date());
    
    logs.push({
      organizationId: orgId,
      userId: randomChoice(users).id,
      action,
      resourceType: randomChoice(resources),
      resourceId: `res-${randomBetween(1000, 9999)}`,
      details: { ip: `192.168.${randomBetween(1, 255)}.${randomBetween(1, 255)}`, userAgent: 'Mozilla/5.0' },
      createdAt,
    });
  }
  
  await prisma.auditLog.createMany({ data: logs });
  console.log(`    ✓ Created ${logs.length} audit logs`);
  return logs.length;
}

async function seedDataSources(orgId: string) {
  console.log(`  🔌 Creating data sources...`);
  
  const sources = [
    { name: 'Primary PostgreSQL', type: 'POSTGRESQL', status: 'CONNECTED' },
    { name: 'Analytics Warehouse', type: 'SNOWFLAKE', status: 'CONNECTED' },
    { name: 'CRM System', type: 'SALESFORCE', status: 'CONNECTED' },
    { name: 'HR Platform', type: 'SAP', status: 'CONNECTED' },
    { name: 'Marketing Cloud', type: 'REST_API', status: 'CONNECTED' },
    { name: 'Financial System', type: 'ORACLE', status: 'PENDING' },
    { name: 'Customer Events', type: 'GRAPHQL', status: 'CONNECTED' },
    { name: 'Redis Cache', type: 'REDIS', status: 'CONNECTED' },
  ];
  
  for (const source of sources) {
    await prisma.dataSource.create({
      data: {
        organizationId: orgId,
        name: source.name,
        type: source.type as any,
        status: source.status as any,
        config: { host: 'db.example.com', port: 5432 },
        credentials: {},
        lastSyncAt: source.status === 'CONNECTED' ? new Date() : null,
        metadata: { tables: randomBetween(10, 100), records: randomBetween(10000, 1000000) },
      },
    });
  }
  
  console.log(`    ✓ Created ${sources.length} data sources`);
  return sources.length;
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🌱 DATACENDIA DEMO DATA SEEDER');
  console.log('   Creating 2 companies with 10,000+ rows of enterprise data');
  console.log('═══════════════════════════════════════════════════════════════');
  
  let totalRows = 0;
  
  try {
    for (const company of COMPANIES) {
      const org = await seedOrganization(company);
      const users = await seedUsers(org.id, company.slug, 25);
      
      const metricsData = await seedMetrics(org.id, users[0].id);
      const executions = await seedWorkflows(org.id);
      const alerts = await seedAlerts(org.id, users);
      const messages = await seedDeliberations(org.id, users);
      const healthScores = await seedHealthScores(org.id);
      const auditLogs = await seedAuditLogs(org.id, users);
      const dataSources = await seedDataSources(org.id);
      
      const companyTotal = 1 + users.length + metricsData + executions + alerts + messages + healthScores + auditLogs + dataSources;
      totalRows += companyTotal;
      
      console.log(`\n  📊 ${company.name} subtotal: ${companyTotal.toLocaleString()} rows`);
    }
    
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log(`✅ SEEDING COMPLETE!`);
    console.log(`   Total rows created: ${totalRows.toLocaleString()}`);
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('\n📋 Demo Credentials:');
    console.log('   Nexus Financial:');
    console.log('     Email: admin@nexus-financial.com');
    console.log('     Password: Demo2024!');
    console.log('   Velocity Manufacturing:');
    console.log('     Email: admin@velocity-manufacturing.com');
    console.log('     Password: Demo2024!');
    console.log('═══════════════════════════════════════════════════════════════\n');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
