// =============================================================================
// DRUID SEEDER - Comprehensive Demo Data for CendiaChronos™ & CendiaWitness™
// =============================================================================
// Seeds Apache Druid with realistic enterprise data:
// - 5,000+ decision events (2 years of history)
// - 10,000+ audit events
// - 50,000+ agent metrics
// - 20,000+ system telemetry points
// =============================================================================

import axios from 'axios';

const DRUID_URL = process.env.DRUID_ROUTER_URL || 'http://localhost:8888';

// Datasource schemas
const DATASOURCES = {
  DECISION_HISTORY: 'cendia_decision_history',
  AUDIT_EVENTS: 'cendia_audit_events',
  AGENT_METRICS: 'cendia_agent_metrics',
  SYSTEM_TELEMETRY: 'cendia_system_telemetry',
  USER_ACTIVITY: 'cendia_user_activity',
  ALERTS: 'cendia_alerts',
};

// Sample data generators
const DEPARTMENTS = ['Engineering', 'Sales', 'Marketing', 'Finance', 'Operations', 'Legal', 'HR', 'Product', 'Customer Success', 'Security'];
const AGENTS = ['CendiaChief', 'CendiaCFO', 'CendiaCOO', 'CendiaCRO', 'CendiaRisk', 'CendiaLegal', 'CendiaHR', 'CendiaStrategy', 'CendiaCompliance', 'CendiaEthics'];
const USERS = ['alice@acme.com', 'bob@acme.com', 'carol@acme.com', 'david@acme.com', 'eve@acme.com', 'frank@acme.com', 'grace@acme.com', 'henry@acme.com'];
const RISK_LEVELS = ['low', 'medium', 'high', 'critical'];
const MODELS = ['llama3.1:70b', 'qwen2.5:32b', 'mistral:7b', 'codellama:34b'];

const DECISION_TEMPLATES = [
  { q: 'Should we expand into the European market?', dept: 'Strategy', risk: 'high' },
  { q: 'Approve Q{q} budget allocation of ${amount}M', dept: 'Finance', risk: 'medium' },
  { q: 'Hire {n} additional engineers for Project {p}', dept: 'Engineering', risk: 'low' },
  { q: 'Launch marketing campaign for {product}', dept: 'Marketing', risk: 'low' },
  { q: 'Negotiate vendor contract with {vendor}', dept: 'Operations', risk: 'medium' },
  { q: 'Implement new security protocol for {system}', dept: 'Security', risk: 'high' },
  { q: 'Approve partnership with {partner}', dept: 'Strategy', risk: 'high' },
  { q: 'Restructure {dept} department', dept: 'HR', risk: 'critical' },
  { q: 'Acquire {company} for ${amount}M', dept: 'Strategy', risk: 'critical' },
  { q: 'Release {product} v{version}', dept: 'Product', risk: 'medium' },
  { q: 'Settle legal dispute with {party}', dept: 'Legal', risk: 'high' },
  { q: 'Implement GDPR compliance measures', dept: 'Compliance', risk: 'high' },
  { q: 'Approve remote work policy changes', dept: 'HR', risk: 'low' },
  { q: 'Migrate to cloud provider {provider}', dept: 'Engineering', risk: 'high' },
  { q: 'Launch customer loyalty program', dept: 'Customer Success', risk: 'low' },
  { q: 'Approve Series {round} funding terms', dept: 'Finance', risk: 'critical' },
  { q: 'Open new office in {city}', dept: 'Operations', risk: 'medium' },
  { q: 'Discontinue {product} product line', dept: 'Product', risk: 'high' },
  { q: 'Implement AI-powered {feature}', dept: 'Engineering', risk: 'medium' },
  { q: 'Approve executive compensation package', dept: 'HR', risk: 'high' },
];

const AUDIT_ACTIONS = [
  { action: 'login', resource: 'auth', outcome: 'success' },
  { action: 'logout', resource: 'auth', outcome: 'success' },
  { action: 'view_decision', resource: 'decision', outcome: 'success' },
  { action: 'create_deliberation', resource: 'council', outcome: 'success' },
  { action: 'approve_decision', resource: 'decision', outcome: 'success' },
  { action: 'reject_decision', resource: 'decision', outcome: 'success' },
  { action: 'export_report', resource: 'report', outcome: 'success' },
  { action: 'modify_agent', resource: 'agent', outcome: 'success' },
  { action: 'access_denied', resource: 'admin', outcome: 'failure' },
  { action: 'api_call', resource: 'api', outcome: 'success' },
  { action: 'data_query', resource: 'graph', outcome: 'success' },
  { action: 'config_change', resource: 'settings', outcome: 'success' },
  { action: 'file_upload', resource: 'vault', outcome: 'success' },
  { action: 'permission_change', resource: 'rbac', outcome: 'success' },
  { action: 'mfa_challenge', resource: 'auth', outcome: 'success' },
];

// Helper functions
function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(daysBack: number): Date {
  const now = new Date();
  const msBack = randomInt(0, daysBack * 24 * 60 * 60 * 1000);
  return new Date(now.getTime() - msBack);
}

function generateDecisionQuestion(): { question: string; dept: string; risk: string } {
  const template = randomChoice(DECISION_TEMPLATES);
  let q = template.q
    .replace('{q}', String(randomInt(1, 4)))
    .replace('{amount}', String(randomInt(1, 50)))
    .replace('{n}', String(randomInt(2, 20)))
    .replace('{p}', randomChoice(['Atlas', 'Phoenix', 'Titan', 'Nova', 'Apex']))
    .replace('{product}', randomChoice(['Cortex', 'Pulse', 'Lens', 'Bridge', 'Chronos']))
    .replace('{vendor}', randomChoice(['AWS', 'Azure', 'Snowflake', 'Databricks', 'Salesforce']))
    .replace('{system}', randomChoice(['API Gateway', 'Database', 'Auth Service', 'Payment System']))
    .replace('{partner}', randomChoice(['Microsoft', 'Google', 'IBM', 'Oracle', 'SAP']))
    .replace('{dept}', randomChoice(DEPARTMENTS))
    .replace('{company}', randomChoice(['TechStartup Inc', 'DataCorp', 'AI Solutions', 'CloudFirst']))
    .replace('{version}', `${randomInt(1, 5)}.${randomInt(0, 9)}`)
    .replace('{party}', randomChoice(['Former Employee', 'Competitor', 'Vendor', 'Customer']))
    .replace('{provider}', randomChoice(['AWS', 'GCP', 'Azure']))
    .replace('{round}', randomChoice(['A', 'B', 'C', 'D']))
    .replace('{city}', randomChoice(['London', 'Singapore', 'Tokyo', 'Berlin', 'Sydney']))
    .replace('{feature}', randomChoice(['analytics', 'recommendations', 'forecasting', 'automation']));
  
  return { question: q, dept: template.dept, risk: template.risk };
}

// Data generators
function generateDecisionEvents(count: number): any[] {
  const events = [];
  for (let i = 0; i < count; i++) {
    const { question, dept, risk } = generateDecisionQuestion();
    const timestamp = randomDate(730); // 2 years
    const agentCount = randomInt(3, 7);
    const agents = AGENTS.slice(0, agentCount);
    
    events.push({
      __time: timestamp.toISOString(),
      organization_id: 'org_demo_001',
      session_id: `session_${i}_${Date.now()}`,
      decision_id: `dec_${i}_${timestamp.getTime()}`,
      question,
      agents_involved: agents.join(','),
      consensus_reached: Math.random() > 0.15,
      final_recommendation: Math.random() > 0.3 ? 'approve' : Math.random() > 0.5 ? 'reject' : 'defer',
      confidence_score: randomInt(65, 98),
      risk_level: risk,
      deliberation_time_ms: randomInt(5000, 180000),
      user_accepted: Math.random() > 0.2,
      department: dept,
      tags: [dept.toLowerCase(), risk, 'q' + Math.ceil((timestamp.getMonth() + 1) / 3)].join(','),
    });
  }
  return events;
}

function generateAuditEvents(count: number): any[] {
  const events = [];
  for (let i = 0; i < count; i++) {
    const template = randomChoice(AUDIT_ACTIONS);
    const timestamp = randomDate(365);
    
    events.push({
      __time: timestamp.toISOString(),
      organization_id: 'org_demo_001',
      event_type: template.action,
      actor_id: randomChoice(USERS),
      actor_type: Math.random() > 0.1 ? 'user' : 'agent',
      resource_type: template.resource,
      resource_id: `${template.resource}_${randomInt(1, 1000)}`,
      action: template.action,
      outcome: template.outcome,
      risk_score: randomInt(0, 100),
      ip_address: `192.168.${randomInt(1, 255)}.${randomInt(1, 255)}`,
      user_agent: randomChoice(['Chrome/120', 'Firefox/121', 'Safari/17', 'Edge/120']),
      session_duration_ms: randomInt(1000, 3600000),
    });
  }
  return events;
}

function generateAgentMetrics(count: number): any[] {
  const events = [];
  const metricNames = ['response_time', 'token_usage', 'confidence', 'consensus_contribution', 'error_rate'];
  
  for (let i = 0; i < count; i++) {
    const timestamp = randomDate(90); // 3 months
    const agent = randomChoice(AGENTS);
    const metric = randomChoice(metricNames);
    
    events.push({
      __time: timestamp.toISOString(),
      organization_id: 'org_demo_001',
      agent_id: agent.toLowerCase().replace('cendia', ''),
      agent_role: agent,
      metric_name: metric,
      metric_value: metric === 'error_rate' ? Math.random() * 5 : randomInt(50, 500),
      model_used: randomChoice(MODELS),
      tokens_input: randomInt(100, 2000),
      tokens_output: randomInt(50, 1500),
      latency_ms: randomInt(200, 5000),
    });
  }
  return events;
}

function generateSystemTelemetry(count: number): any[] {
  const events = [];
  const services = ['api-gateway', 'council-service', 'graph-service', 'auth-service', 'analytics-service', 'ollama-proxy'];
  const hosts = ['node-1', 'node-2', 'node-3'];
  
  for (let i = 0; i < count; i++) {
    const timestamp = randomDate(30); // 1 month
    
    events.push({
      __time: timestamp.toISOString(),
      host: randomChoice(hosts),
      service: randomChoice(services),
      cpu_percent: randomInt(10, 85),
      memory_percent: randomInt(30, 90),
      disk_percent: randomInt(20, 70),
      request_count: randomInt(100, 10000),
      error_count: randomInt(0, 50),
      avg_latency_ms: randomInt(10, 500),
      active_connections: randomInt(10, 500),
      queue_depth: randomInt(0, 100),
    });
  }
  return events;
}

function generateAlerts(count: number): any[] {
  const events = [];
  const alertTypes = [
    { type: 'high_risk_decision', severity: 'warning' },
    { type: 'consensus_failure', severity: 'error' },
    { type: 'latency_spike', severity: 'warning' },
    { type: 'error_rate_high', severity: 'error' },
    { type: 'unusual_activity', severity: 'critical' },
    { type: 'compliance_violation', severity: 'critical' },
    { type: 'budget_threshold', severity: 'warning' },
    { type: 'agent_offline', severity: 'error' },
  ];
  
  for (let i = 0; i < count; i++) {
    const template = randomChoice(alertTypes);
    const timestamp = randomDate(60);
    
    events.push({
      __time: timestamp.toISOString(),
      organization_id: 'org_demo_001',
      alert_id: `alert_${i}_${timestamp.getTime()}`,
      alert_type: template.type,
      severity: template.severity,
      title: `${template.type.replace(/_/g, ' ').toUpperCase()} detected`,
      description: `Automated alert triggered by monitoring system`,
      source: randomChoice(['chronos', 'witness', 'pulse', 'council']),
      acknowledged: Math.random() > 0.3,
      resolved: Math.random() > 0.4,
      assigned_to: Math.random() > 0.5 ? randomChoice(USERS) : null,
    });
  }
  return events;
}

// Druid ingestion via SQL
async function createDatasource(name: string, columns: string[]): Promise<boolean> {
  console.log(`Creating datasource: ${name}`);
  
  // Druid auto-creates datasources on first insert
  // We'll use MSQ (Multi-Stage Query) for batch ingestion
  return true;
}

async function ingestBatch(datasource: string, events: any[]): Promise<{ success: number; failed: number }> {
  if (events.length === 0) return { success: 0, failed: 0 };
  
  const batchSize = 500;
  let success = 0;
  let failed = 0;
  
  for (let i = 0; i < events.length; i += batchSize) {
    const batch = events.slice(i, i + batchSize);
    const ndjson = batch.map(e => JSON.stringify(e)).join('\n');
    
    try {
      // Use Druid's SQL-based ingestion (MSQ)
      const response = await axios.post(`${DRUID_URL}/druid/v2/sql/task`, {
        query: `
          INSERT INTO "${datasource}"
          SELECT *
          FROM TABLE(
            EXTERN(
              '{"type":"inline","data":"${ndjson.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"}',
              '{"type":"json"}'
            )
          ) EXTEND (${getExtendClause(batch[0])})
          PARTITIONED BY DAY
        `,
        context: {
          maxNumTasks: 2,
          finalizeAggregations: false,
        },
      }, {
        timeout: 60000,
      });
      
      success += batch.length;
      process.stdout.write(`\r  Ingested ${success}/${events.length} events...`);
    } catch (error: any) {
      // If MSQ fails, try native batch ingestion
      try {
        await axios.post(`${DRUID_URL}/druid/indexer/v1/task`, {
          type: 'index_parallel',
          spec: {
            dataSchema: {
              dataSource: datasource,
              timestampSpec: { column: '__time', format: 'iso' },
              dimensionsSpec: { dimensions: Object.keys(batch[0]).filter(k => k !== '__time') },
              granularitySpec: { 
                type: 'uniform', 
                segmentGranularity: 'DAY',
                queryGranularity: 'HOUR',
              },
            },
            ioConfig: {
              type: 'index_parallel',
              inputSource: {
                type: 'inline',
                data: ndjson,
              },
              inputFormat: { type: 'json' },
            },
            tuningConfig: {
              type: 'index_parallel',
              maxRowsPerSegment: 5000000,
            },
          },
        }, { timeout: 60000 });
        
        success += batch.length;
        process.stdout.write(`\r  Ingested ${success}/${events.length} events (native)...`);
      } catch (nativeError: any) {
        failed += batch.length;
        console.error(`\n  Batch failed: ${nativeError.message}`);
      }
    }
  }
  
  console.log(''); // New line after progress
  return { success, failed };
}

function getExtendClause(sample: any): string {
  return Object.entries(sample)
    .map(([key, value]) => {
      if (key === '__time') return `"__time" VARCHAR`;
      if (typeof value === 'number') return `"${key}" DOUBLE`;
      if (typeof value === 'boolean') return `"${key}" VARCHAR`;
      return `"${key}" VARCHAR`;
    })
    .join(', ');
}

async function checkDruidHealth(): Promise<boolean> {
  try {
    const response = await axios.get(`${DRUID_URL}/status`, { timeout: 5000 });
    return response.status === 200;
  } catch {
    return false;
  }
}

async function main() {
  console.log('='.repeat(70));
  console.log('DRUID SEEDER - Comprehensive Demo Data');
  console.log('='.repeat(70));
  
  // Check Druid health
  console.log('\n[1/6] Checking Druid availability...');
  const healthy = await checkDruidHealth();
  if (!healthy) {
    console.error('ERROR: Druid is not available at', DRUID_URL);
    console.error('Please ensure Druid services are running:');
    console.error('  docker-compose -f infrastructure/docker-compose.sovereign.yml up -d');
    process.exit(1);
  }
  console.log('  ✓ Druid is healthy');
  
  // Generate and ingest decision history
  console.log('\n[2/6] Generating decision history (5,000 events)...');
  const decisions = generateDecisionEvents(5000);
  const decResult = await ingestBatch(DATASOURCES.DECISION_HISTORY, decisions);
  console.log(`  ✓ Decisions: ${decResult.success} success, ${decResult.failed} failed`);
  
  // Generate and ingest audit events
  console.log('\n[3/6] Generating audit events (10,000 events)...');
  const audits = generateAuditEvents(10000);
  const auditResult = await ingestBatch(DATASOURCES.AUDIT_EVENTS, audits);
  console.log(`  ✓ Audits: ${auditResult.success} success, ${auditResult.failed} failed`);
  
  // Generate and ingest agent metrics
  console.log('\n[4/6] Generating agent metrics (50,000 events)...');
  const metrics = generateAgentMetrics(50000);
  const metricResult = await ingestBatch(DATASOURCES.AGENT_METRICS, metrics);
  console.log(`  ✓ Metrics: ${metricResult.success} success, ${metricResult.failed} failed`);
  
  // Generate and ingest system telemetry
  console.log('\n[5/6] Generating system telemetry (20,000 events)...');
  const telemetry = generateSystemTelemetry(20000);
  const telemetryResult = await ingestBatch(DATASOURCES.SYSTEM_TELEMETRY, telemetry);
  console.log(`  ✓ Telemetry: ${telemetryResult.success} success, ${telemetryResult.failed} failed`);
  
  // Generate and ingest alerts
  console.log('\n[6/6] Generating alerts (1,000 events)...');
  const alerts = generateAlerts(1000);
  const alertResult = await ingestBatch(DATASOURCES.ALERTS, alerts);
  console.log(`  ✓ Alerts: ${alertResult.success} success, ${alertResult.failed} failed`);
  
  // Summary
  const totalSuccess = decResult.success + auditResult.success + metricResult.success + telemetryResult.success + alertResult.success;
  const totalFailed = decResult.failed + auditResult.failed + metricResult.failed + telemetryResult.failed + alertResult.failed;
  
  console.log('\n' + '='.repeat(70));
  console.log('SEEDING COMPLETE');
  console.log('='.repeat(70));
  console.log(`Total events ingested: ${totalSuccess.toLocaleString()}`);
  console.log(`Total failures: ${totalFailed.toLocaleString()}`);
  console.log('\nDatasources created:');
  Object.values(DATASOURCES).forEach(ds => console.log(`  - ${ds}`));
  console.log('\nYou can now use CendiaChronos™ with real data!');
  console.log('Visit: http://localhost:5173/cortex/intelligence/chronos');
}

main().catch(console.error);
