// @ts-nocheck
// =============================================================================
// SEED ALERTS - Add test alerts to the database
// Run with: npx tsx scripts/seed-alerts.ts
// =============================================================================

import { PrismaClient, AlertSeverity, AlertStatus } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

const TEST_ALERTS = [
  {
    severity: AlertSeverity.CRITICAL,
    status: AlertStatus.ACTIVE,
    title: 'Database Connection Pool Exhausted',
    message: 'Primary PostgreSQL connection pool at 100% capacity. Consider scaling or optimizing queries.',
    source: 'Database Monitor',
  },
  {
    severity: AlertSeverity.CRITICAL,
    status: AlertStatus.ACTIVE,
    title: 'Revenue Anomaly Detected',
    message: 'Q4 revenue tracking 25% below forecast. Requires immediate executive review.',
    source: 'CendiaCFO',
  },
  {
    severity: AlertSeverity.CRITICAL,
    status: AlertStatus.ACKNOWLEDGED,
    title: 'Security Policy Violation',
    message: 'Unauthorized data export attempt blocked from IP 192.168.1.45.',
    source: 'Security',
  },
  {
    severity: AlertSeverity.WARNING,
    status: AlertStatus.ACTIVE,
    title: 'ML Pipeline Latency High',
    message: 'Forecast model inference time exceeding 5s threshold. Consider model optimization.',
    source: 'ML Pipeline',
  },
  {
    severity: AlertSeverity.WARNING,
    status: AlertStatus.ACTIVE,
    title: 'Data Sync Delay',
    message: 'Salesforce integration sync delayed by 45 minutes. Last successful sync: 2 hours ago.',
    source: 'Integrations',
  },
  {
    severity: AlertSeverity.WARNING,
    status: AlertStatus.ACTIVE,
    title: 'License Limit Approaching',
    message: 'Currently using 45 of 50 available user licenses. Consider upgrading plan.',
    source: 'System',
  },
  {
    severity: AlertSeverity.WARNING,
    status: AlertStatus.ACKNOWLEDGED,
    title: 'Churn Risk Identified',
    message: 'Enterprise customer segment showing 15% increased churn indicators this quarter.',
    source: 'CendiaCRO',
  },
  {
    severity: AlertSeverity.INFO,
    status: AlertStatus.ACTIVE,
    title: 'Scheduled Maintenance',
    message: 'System maintenance scheduled for Sunday 2:00 AM EST. Expected downtime: 30 minutes.',
    source: 'System',
  },
  {
    severity: AlertSeverity.INFO,
    status: AlertStatus.RESOLVED,
    title: 'New Integration Available',
    message: 'Jira Cloud connector is now available. Enable in Settings > Integrations.',
    source: 'Integrations',
  },
  {
    severity: AlertSeverity.INFO,
    status: AlertStatus.ACTIVE,
    title: 'API Rate Limit Warning',
    message: 'External API usage at 80% of daily quota. Consider caching frequently accessed data.',
    source: 'API Gateway',
  },
];

async function seedAlerts() {
  console.log('🔧 Seeding alerts...\n');

  // Get default organization
  const org = await prisma.organizations.findFirst();

  if (!org) {
    console.error('❌ No active organization found. Please run main seed first.');
    process.exit(1);
  }

  console.log(`📍 Using organization: ${org.name} (${org.id})\n`);

  // Delete existing alerts for clean slate
  const deleted = await prisma.alerts.deleteMany({
    where: { organization_id: org.id },
  });
  console.log(`🗑️  Deleted ${deleted.count} existing alerts\n`);

  // Create test alerts
  const alerts = [];
  for (const alert of TEST_ALERTS) {
    const created = await prisma.alerts.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: org.id,
        severity: alert.severity,
        status: alert.status,
        title: alert.title,
        message: alert.message,
        source: alert.source,
        metadata: {},
        acknowledged_at: alert.status === AlertStatus.ACKNOWLEDGED ? new Date() : null,
        resolved_at: alert.status === AlertStatus.RESOLVED ? new Date() : null,
      },
    });
    alerts.push(created);
    console.log(`✅ Created: [${alert.severity}] ${alert.title}`);
  }

  console.log(`\n🎉 Successfully seeded ${alerts.length} alerts!`);
  console.log('\n📋 Alert IDs:');
  alerts.forEach(a => console.log(`   ${a.id} - ${a.title}`));
}

seedAlerts()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
