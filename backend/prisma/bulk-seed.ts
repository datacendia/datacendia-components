// =============================================================================
// BULK SEED - Add 10,000+ rows of realistic data
// =============================================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting bulk data generation (100,000+ rows)...\n');
  
  // Get the organization
  const org = await prisma.organizations.findFirst({ where: { slug: 'datacendia-demo' } });
  if (!org) {
    throw new Error('Organization not found. Run npm run db:seed first.');
  }
  const orgId = org.id;
  
  let totalRows = 0;

  // ==========================================================================
  // 1. METRIC VALUES - 4000 rows (historical time series for all metrics)
  // ==========================================================================
  console.log('📈 Generating metric values...');
  const metrics = await prisma.metric_definitions.findMany({ where: { organization_id: orgId } });
  const metricValues: any[] = [];
  
  for (const metric of metrics) {
    // Generate 200+ days of historical data per metric
    const baseValue = Math.random() * 100;
    for (let day = 0; day < 2350; day++) {
      const date = new Date();
      date.setDate(date.getDate() - day);
      const variance = (Math.random() - 0.5) * baseValue * 0.2;
      metricValues.push({
        id: crypto.randomUUID(),
        metric_id: metric.id,
        value: Math.max(0, baseValue + variance + (day * 0.1)), // slight trend
        dimensions: { source: 'bulk_seed', day },
        timestamp: date,
      });
    }
  }
  
  await prisma.metric_values.createMany({ data: metricValues, skipDuplicates: true });
  totalRows += metricValues.length;
  console.log(`  ✓ Created ${metricValues.length} metric values`);

  // ==========================================================================
  // 2. PREDICTIONS - 2500 rows (forecasts for each model)
  // ==========================================================================
  console.log('🔮 Generating predictions...');
  const models = await prisma.forecast_models.findMany({ where: { organization_id: orgId } });
  const predictions: any[] = [];
  
  for (const model of models) {
    // 5000 predictions per model (past and future)
    for (let i = 0; i < 5000; i++) {
      const date = new Date();
      date.setDate(date.getDate() + (i - 250)); // 250 days back, 250 days forward
      predictions.push({
        id: crypto.randomUUID(),
        model_id: model.id,
        input_data: { timestamp: date.toISOString(), features: { trend: i * 0.01, seasonality: Math.sin(i / 30) } },
        predicted_value: 1000000 + Math.random() * 500000 + (i * 1000),
        confidence: 0.7 + Math.random() * 0.25,
        prediction_date: date,
        actual_value: i < 250 ? 1000000 + Math.random() * 500000 + (i * 1000) * (0.9 + Math.random() * 0.2) : null,
      });
    }
  }
  
  await prisma.predictions.createMany({ data: predictions, skipDuplicates: true });
  totalRows += predictions.length;
  console.log(`  ✓ Created ${predictions.length} predictions`);

  // ==========================================================================
  // 3. LINEAGE ENTITIES - 500 rows
  // ==========================================================================
  console.log('🔗 Generating lineage entities...');
  const entityTypes = ['DATASET', 'TABLE', 'COLUMN', 'REPORT', 'METRIC', 'MODEL', 'PIPELINE', 'API'];
  const sources = ['PostgreSQL', 'Snowflake', 'BigQuery', 'S3', 'Kafka', 'Airflow', 'dbt', 'Looker', 'Tableau'];
  const lineageEntities: any[] = [];
  
  for (let i = 0; i < 5000; i++) {
    const entityType = entityTypes[Math.floor(Math.random() * entityTypes.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const quality = 70 + Math.random() * 30;
    lineageEntities.push({
      id: crypto.randomUUID(),
      organization_id: orgId,
      name: `${entityType.toLowerCase()}_${source.toLowerCase()}_${i}`,
      entity_type: entityType as any,
      description: `Auto-generated ${entityType} from ${source}`,
      source,
      quality_score: quality,
      quality_level: quality >= 95 ? 'EXCELLENT' : quality >= 85 ? 'GOOD' : quality >= 70 ? 'FAIR' : 'POOR',
      record_count: Math.floor(Math.random() * 10000000),
      metadata: { generated: true, index: i },
    });
  }
  
  await prisma.lineage_entities.createMany({ data: lineageEntities, skipDuplicates: true });
  totalRows += lineageEntities.length;
  console.log(`  ✓ Created ${lineageEntities.length} lineage entities`);

  // ==========================================================================
  // 4. LINEAGE RELATIONSHIPS - 1000 rows
  // ==========================================================================
  console.log('🔗 Generating lineage relationships...');
  const allEntities = await prisma.lineage_entities.findMany({ where: { organization_id: orgId } });
  const relationshipTypes = ['DERIVES_FROM', 'TRANSFORMS_TO', 'DEPENDS_ON', 'FEEDS', 'USES'];
  const lineageRelationships: any[] = [];
  const existingPairs = new Set<string>();
  
  for (let i = 0; i < 10000; i++) {
    const source = allEntities[Math.floor(Math.random() * allEntities.length)];
    const target = allEntities[Math.floor(Math.random() * allEntities.length)];
    const relType = relationshipTypes[Math.floor(Math.random() * relationshipTypes.length)];
    const pairKey = `${source.id}-${target.id}-${relType}`;
    
    if (source.id !== target.id && !existingPairs.has(pairKey)) {
      existingPairs.add(pairKey);
      lineageRelationships.push({
        id: crypto.randomUUID(),
        source_id: source.id,
        target_id: target.id,
        relationship_type: relType as any,
        confidence: 0.8 + Math.random() * 0.2,
        transformations: [],
      });
    }
  }
  
  await prisma.lineage_relationships.createMany({ data: lineageRelationships, skipDuplicates: true });
  totalRows += lineageRelationships.length;
  console.log(`  ✓ Created ${lineageRelationships.length} lineage relationships`);

  // ==========================================================================
  // 5. SECURITY THREATS - 500 rows (historical threat data)
  // ==========================================================================
  console.log('🛡️ Generating security threats...');
  const threatTypes = ['INTRUSION', 'MALWARE', 'PHISHING', 'DATA_EXFILTRATION', 'PRIVILEGE_ESCALATION', 'DENIAL_OF_SERVICE', 'INSIDER_THREAT', 'POLICY_VIOLATION'];
  const severities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'];
  const statuses = ['ACTIVE', 'INVESTIGATING', 'CONTAINED', 'MITIGATED', 'RESOLVED', 'FALSE_POSITIVE'];
  const threatSources = ['Firewall', 'IDS', 'SIEM', 'EDR', 'Email Gateway', 'WAF', 'DLP', 'Auth Service'];
  const threats: any[] = [];
  
  for (let i = 0; i < 5000; i++) {
    const detectedAt = new Date();
    detectedAt.setDate(detectedAt.getDate() - Math.floor(Math.random() * 365));
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    threats.push({
      id: crypto.randomUUID(),
      organization_id: orgId,
      threat_type: threatTypes[Math.floor(Math.random() * threatTypes.length)] as any,
      severity: severities[Math.floor(Math.random() * severities.length)] as any,
      status: status as any,
      title: `Security Event #${i + 1}`,
      description: `Automated security event detected by monitoring system`,
      source: threatSources[Math.floor(Math.random() * threatSources.length)],
      target: `system-${Math.floor(Math.random() * 100)}`,
      indicators: ['ip_address', 'user_agent', 'timestamp'],
      mitigations: status === 'RESOLVED' ? ['Blocked', 'Patched'] : [],
      detected_at: detectedAt,
      resolved_at: status === 'RESOLVED' ? new Date() : null,
    });
  }
  
  await prisma.security_threats.createMany({ data: threats, skipDuplicates: true });
  totalRows += threats.length;
  console.log(`  ✓ Created ${threats.length} security threats`);

  // ==========================================================================
  // 6. ETHICS REVIEWS - 500 rows
  // ==========================================================================
  console.log('⚖️ Generating ethics reviews...');
  const principles = await prisma.ethics_principles.findMany({ where: { organization_id: orgId } });
  const reviewResults = ['APPROVED', 'REJECTED', 'CONDITIONAL'];
  const reviewers = ['Ethics Committee', 'AI Governance Board', 'Compliance Team', 'Data Ethics Lead', 'Legal Review'];
  const modelNames = ['Recommendation Engine', 'Pricing Model', 'Risk Scorer', 'Churn Predictor', 'Fraud Detector', 'Credit Model', 'Hiring Algorithm', 'Marketing Optimizer'];
  const ethicsReviews: any[] = [];
  
  for (let i = 0; i < 5000; i++) {
    const submittedAt = new Date();
    submittedAt.setDate(submittedAt.getDate() - Math.floor(Math.random() * 180));
    const result = reviewResults[Math.floor(Math.random() * reviewResults.length)];
    
    ethicsReviews.push({
      id: crypto.randomUUID(),
      organization_id: orgId,
      principle_id: principles.length > 0 ? principles[Math.floor(Math.random() * principles.length)].id : null,
      subject_type: 'MODEL',
      subject_id: crypto.randomUUID(),
      subject_name: `${modelNames[Math.floor(Math.random() * modelNames.length)]} v${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 10)}`,
      status: 'COMPLETED',
      result: result as any,
      reviewer: reviewers[Math.floor(Math.random() * reviewers.length)],
      notes: result === 'APPROVED' ? 'Meets all requirements' : result === 'CONDITIONAL' ? 'Requires monitoring' : 'Failed bias testing',
      violations: result !== 'APPROVED' ? [{ type: 'bias', severity: result === 'REJECTED' ? 'high' : 'medium' }] : [],
      submitted_at: submittedAt,
      completed_at: new Date(),
    });
  }
  
  await prisma.ethics_reviews.createMany({ data: ethicsReviews, skipDuplicates: true });
  totalRows += ethicsReviews.length;
  console.log(`  ✓ Created ${ethicsReviews.length} ethics reviews`);

  // ==========================================================================
  // 7. BIAS CHECKS - 300 rows
  // ==========================================================================
  console.log('⚖️ Generating bias checks...');
  const biasChecks: any[] = [];
  
  for (let i = 0; i < 3000; i++) {
    const score = 70 + Math.random() * 30;
    biasChecks.push({
      id: crypto.randomUUID(),
      organization_id: orgId,
      model_id: crypto.randomUUID(),
      model_name: `${modelNames[Math.floor(Math.random() * modelNames.length)]} v${Math.floor(Math.random() * 10) + 1}`,
      status: 'COMPLETED',
      overall_score: score,
      dimensions: {
        gender: score + (Math.random() - 0.5) * 10,
        age: score + (Math.random() - 0.5) * 10,
        geography: score + (Math.random() - 0.5) * 10,
        income: score + (Math.random() - 0.5) * 10,
      },
      recommendations: score < 85 ? ['Review training data', 'Add fairness constraints'] : [],
      checked_at: new Date(),
    });
  }
  
  await prisma.bias_checks.createMany({ data: biasChecks, skipDuplicates: true });
  totalRows += biasChecks.length;
  console.log(`  ✓ Created ${biasChecks.length} bias checks`);

  // ==========================================================================
  // 8. HEALTH INCIDENTS - 200 rows
  // ==========================================================================
  console.log('🏥 Generating health incidents...');
  const incidentSeverities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  const incidentStatuses = ['OPEN', 'INVESTIGATING', 'IDENTIFIED', 'MONITORING', 'RESOLVED'];
  const components = ['API Gateway', 'Database', 'Cache', 'Queue', 'Auth Service', 'ML Pipeline', 'Data Warehouse'];
  const healthIncidents: any[] = [];
  
  for (let i = 0; i < 2000; i++) {
    const startedAt = new Date();
    startedAt.setDate(startedAt.getDate() - Math.floor(Math.random() * 90));
    const status = incidentStatuses[Math.floor(Math.random() * incidentStatuses.length)];
    
    healthIncidents.push({
      id: crypto.randomUUID(),
      organization_id: orgId,
      title: `Incident #${i + 1000}`,
      description: `System alert detected in production environment`,
      severity: incidentSeverities[Math.floor(Math.random() * incidentSeverities.length)] as any,
      status: status as any,
      affected_components: [components[Math.floor(Math.random() * components.length)]],
      started_at: startedAt,
      resolved_at: status === 'RESOLVED' ? new Date() : null,
    });
  }
  
  await prisma.health_incidents.createMany({ data: healthIncidents, skipDuplicates: true });
  totalRows += healthIncidents.length;
  console.log(`  ✓ Created ${healthIncidents.length} health incidents`);

  // ==========================================================================
  // 9. AUDIT LOGS - 500 rows
  // ==========================================================================
  console.log('📋 Generating audit logs...');
  const actions = ['CREATE', 'UPDATE', 'DELETE', 'READ', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT', 'APPROVE', 'REJECT'];
  const resourceTypes = ['metric', 'workflow', 'user', 'policy', 'model', 'report', 'dashboard', 'agent'];
  const auditLogs: any[] = [];
  
  for (let i = 0; i < 5000; i++) {
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30));
    
    auditLogs.push({
      id: crypto.randomUUID(),
      organization_id: orgId,
      user_id: null,
      action: actions[Math.floor(Math.random() * actions.length)],
      resource_type: resourceTypes[Math.floor(Math.random() * resourceTypes.length)],
      resource_id: crypto.randomUUID(),
      details: { automated: true, index: i },
      ip_address: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      user_agent: 'DatacendiaBulkSeed/1.0',
      created_at: createdAt,
    });
  }
  
  await prisma.audit_logs.createMany({ data: auditLogs, skipDuplicates: true });
  totalRows += auditLogs.length;
  console.log(`  ✓ Created ${auditLogs.length} audit logs`);

  // ==========================================================================
  // SUMMARY
  // ==========================================================================
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Bulk seed completed! Added ${totalRows.toLocaleString()} rows`);
  console.log('='.repeat(50) + '\n');

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('❌ Bulk seed failed:', e);
  process.exit(1);
});
