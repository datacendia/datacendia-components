// =============================================================================
// SEED ALL DEMO DATA - Comprehensive test data for all modules
// Run with: npx tsx scripts/seed-all-demo.ts
// =============================================================================

import { PrismaClient, AlertSeverity, AlertStatus, WorkflowStatus, DataSourceStatus, DataSourceType, ApprovalStatus, ApprovalType } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function seedAllDemoData() {
  console.log('🚀 Seeding all demo data...\n');

  // Get default organization
  const org = await prisma.organizations.findFirst();
  if (!org) {
    console.error('❌ No organization found. Please run main seed first.');
    process.exit(1);
  }

  // Get a user for ownership
  const user = await prisma.users.findFirst({ where: { organization_id: org.id } });
  if (!user) {
    console.error('❌ No user found. Please run main seed first.');
    process.exit(1);
  }

  console.log(`📍 Organization: ${org.name} (${org.id})`);
  console.log(`👤 User: ${user.name} (${user.id})\n`);

  // =========================================================================
  // METRICS
  // =========================================================================
  console.log('📊 Seeding metrics...');
  
  await prisma.metric_values.deleteMany({ where: { metric_definitions: { organization_id: org.id } } });
  await prisma.metric_definitions.deleteMany({ where: { organization_id: org.id } });

  const metricsData = [
    { code: 'mrr', name: 'Monthly Recurring Revenue', category: 'financial', unit: 'USD', value: 1240000, target: 1500000, change: 12.5 },
    { code: 'arr', name: 'Annual Recurring Revenue', category: 'financial', unit: 'USD', value: 14880000, target: 18000000, change: 8.2 },
    { code: 'cac', name: 'Customer Acquisition Cost', category: 'financial', unit: 'USD', value: 2450, target: 2000, change: -5.3 },
    { code: 'ltv', name: 'Customer Lifetime Value', category: 'financial', unit: 'USD', value: 45000, target: 50000, change: 3.2 },
    { code: 'nps', name: 'Net Promoter Score', category: 'customer', unit: 'score', value: 72, target: 80, change: 5 },
    { code: 'churn', name: 'Customer Churn Rate', category: 'customer', unit: 'percent', value: 2.1, target: 2, change: -0.3 },
    { code: 'dau', name: 'Active Users (DAU)', category: 'customer', unit: 'count', value: 8450, target: 10000, change: 15.2 },
    { code: 'uptime', name: 'API Uptime', category: 'operational', unit: 'percent', value: 99.98, target: 99.9, change: 0.02 },
    { code: 'latency', name: 'Avg Response Time', category: 'operational', unit: 'ms', value: 124, target: 200, change: -8.5 },
    { code: 'pipeline', name: 'Data Pipeline Health', category: 'operational', unit: 'percent', value: 94, target: 95, change: 2 },
  ];

  for (const m of metricsData) {
    const metricId = crypto.randomUUID();
    await prisma.metric_definitions.create({
      data: {
        id: metricId,
        organization_id: org.id,
        name: m.name,
        code: m.code,
        description: `Tracks ${m.name.toLowerCase()}`,
        category: m.category,
        unit: m.unit,
        formula: { type: 'simple', field: m.code },
        thresholds: { target: m.target, warning: m.target * 0.8, critical: m.target * 0.6 },
        owner_id: user.id,
        updated_at: new Date(),
      },
    });
    
    // Add current value
    await prisma.metric_values.create({
      data: {
        id: crypto.randomUUID(),
        metric_id: metricId,
        value: m.value,
        dimensions: { change: m.change, target: m.target },
        timestamp: new Date(),
      },
    });
    console.log(`  ✅ ${m.name}`);
  }

  // =========================================================================
  // WORKFLOWS
  // =========================================================================
  console.log('\n⚙️ Seeding workflows...');
  
  await prisma.workflow_executions.deleteMany({ where: { workflows: { organization_id: org.id } } });
  await prisma.workflows.deleteMany({ where: { organization_id: org.id } });

  const workflowsData = [
    { name: 'Monthly Financial Close', status: WorkflowStatus.ACTIVE, trigger: { type: 'schedule', cron: '0 0 1 * *' }, category: 'finance', steps: 12 },
    { name: 'Alert Escalation', status: WorkflowStatus.ACTIVE, trigger: { type: 'event', event: 'alert.critical' }, category: 'operations', steps: 5 },
    { name: 'Customer Onboarding', status: WorkflowStatus.ACTIVE, trigger: { type: 'manual' }, category: 'sales', steps: 8 },
    { name: 'Weekly Report Generation', status: WorkflowStatus.ACTIVE, trigger: { type: 'schedule', cron: '0 8 * * 1' }, category: 'reporting', steps: 6 },
    { name: 'Data Quality Check', status: WorkflowStatus.DRAFT, trigger: { type: 'schedule', cron: '0 */6 * * *' }, category: 'data', steps: 4 },
    { name: 'Compliance Audit', status: WorkflowStatus.PAUSED, trigger: { type: 'manual' }, category: 'compliance', steps: 15 },
  ];

  for (const w of workflowsData) {
    const workflowId = crypto.randomUUID();
    await prisma.workflows.create({
      data: {
        id: workflowId,
        organization_id: org.id,
        name: w.name,
        description: `Automated workflow for ${w.name.toLowerCase()}`,
        category: w.category,
        trigger: w.trigger,
        definition: { steps: Array(w.steps).fill(null).map((_, i) => ({ id: `step-${i+1}`, type: 'action', name: `Step ${i+1}` })) },
        status: w.status,
        updated_at: new Date(),
      },
    });

    // Add some executions for active workflows
    if (w.status === WorkflowStatus.ACTIVE) {
      const successCount = Math.floor(Math.random() * 50) + 20;
      const failCount = Math.floor(Math.random() * 5);
      
      for (let i = 0; i < Math.min(successCount, 5); i++) {
        await prisma.workflow_executions.create({
          data: {
            id: crypto.randomUUID(),
            workflow_id: workflowId,
            status: 'COMPLETED',
            started_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            completed_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            outputs: { success: true },
          },
        });
      }
      for (let i = 0; i < Math.min(failCount, 2); i++) {
        await prisma.workflow_executions.create({
          data: {
            id: crypto.randomUUID(),
            workflow_id: workflowId,
            status: 'FAILED',
            started_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            error: 'Execution failed due to timeout',
          },
        });
      }
    }
    console.log(`  ✅ ${w.name}`);
  }

  // =========================================================================
  // APPROVALS (requires valid reference_id - skipping complex FK for now)
  // =========================================================================
  console.log('\n✋ Approvals: Using mock data (complex FK requirements)');

  // =========================================================================
  // DATA SOURCES (Integrations)
  // =========================================================================
  console.log('\n🔌 Seeding data sources...');
  
  await prisma.data_sources.deleteMany({ where: { organization_id: org.id } });

  const dataSourcesData = [
    { name: 'Salesforce', type: DataSourceType.SALESFORCE, status: DataSourceStatus.CONNECTED, category: 'CRM' },
    { name: 'HubSpot', type: DataSourceType.HUBSPOT, status: DataSourceStatus.PENDING, category: 'CRM' },
    { name: 'PostgreSQL Production', type: DataSourceType.POSTGRESQL, status: DataSourceStatus.CONNECTED, category: 'Database' },
    { name: 'Snowflake DW', type: DataSourceType.SNOWFLAKE, status: DataSourceStatus.CONNECTED, category: 'Database' },
    { name: 'SAP ERP', type: DataSourceType.SAP, status: DataSourceStatus.SYNCING, category: 'ERP' },
    { name: 'Google Sheets', type: DataSourceType.GOOGLE_SHEETS, status: DataSourceStatus.CONNECTED, category: 'Spreadsheet' },
    { name: 'BigQuery Analytics', type: DataSourceType.BIGQUERY, status: DataSourceStatus.CONNECTED, category: 'Analytics' },
    { name: 'MongoDB Atlas', type: DataSourceType.MONGODB, status: DataSourceStatus.ERROR, category: 'Database' },
    { name: 'REST API - Weather', type: DataSourceType.REST_API, status: DataSourceStatus.CONNECTED, category: 'External API' },
    { name: 'Airtable', type: DataSourceType.AIRTABLE, status: DataSourceStatus.DISABLED, category: 'Spreadsheet' },
  ];

  for (const ds of dataSourcesData) {
    await prisma.data_sources.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: org.id,
        name: ds.name,
        type: ds.type,
        status: ds.status,
        config: { category: ds.category },
        credentials: {},
        metadata: {},
        last_sync_at: ds.status === DataSourceStatus.CONNECTED ? new Date(Date.now() - Math.random() * 60 * 60 * 1000) : null,
        updated_at: new Date(),
      },
    });
    console.log(`  ✅ ${ds.name}`);
  }

  // =========================================================================
  // ALERTS (refresh with new data)
  // =========================================================================
  console.log('\n🚨 Refreshing alerts...');
  
  await prisma.alerts.deleteMany({ where: { organization_id: org.id } });

  const alertsData = [
    { severity: AlertSeverity.CRITICAL, status: AlertStatus.ACTIVE, title: 'Database Connection Pool Exhausted', source: 'Database Monitor' },
    { severity: AlertSeverity.CRITICAL, status: AlertStatus.ACTIVE, title: 'Revenue Anomaly Detected', source: 'CendiaCFO' },
    { severity: AlertSeverity.CRITICAL, status: AlertStatus.ACKNOWLEDGED, title: 'Security Policy Violation', source: 'Security' },
    { severity: AlertSeverity.WARNING, status: AlertStatus.ACTIVE, title: 'ML Pipeline Latency High', source: 'ML Pipeline' },
    { severity: AlertSeverity.WARNING, status: AlertStatus.ACTIVE, title: 'Data Sync Delay', source: 'Integrations' },
    { severity: AlertSeverity.WARNING, status: AlertStatus.ACTIVE, title: 'License Limit Approaching', source: 'System' },
    { severity: AlertSeverity.WARNING, status: AlertStatus.ACKNOWLEDGED, title: 'Churn Risk Identified', source: 'CendiaCRO' },
    { severity: AlertSeverity.INFO, status: AlertStatus.ACTIVE, title: 'Scheduled Maintenance', source: 'System' },
    { severity: AlertSeverity.INFO, status: AlertStatus.RESOLVED, title: 'New Integration Available', source: 'Integrations' },
    { severity: AlertSeverity.INFO, status: AlertStatus.ACTIVE, title: 'API Rate Limit Warning', source: 'API Gateway' },
  ];

  for (const a of alertsData) {
    await prisma.alerts.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: org.id,
        severity: a.severity,
        status: a.status,
        title: a.title,
        message: `Alert: ${a.title}`,
        source: a.source,
        metadata: {},
        acknowledged_at: a.status === AlertStatus.ACKNOWLEDGED ? new Date() : null,
        resolved_at: a.status === AlertStatus.RESOLVED ? new Date() : null,
      },
    });
    console.log(`  ✅ ${a.title}`);
  }

  console.log('\n🎉 All demo data seeded successfully!');
}

seedAllDemoData()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
