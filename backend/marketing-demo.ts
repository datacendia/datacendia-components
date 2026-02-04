// =============================================================================
// DATACENDIA MARKETING DEMO - Multi-Source Data Walkthrough
// =============================================================================

import { Pool } from 'pg';
import mysql from 'mysql2/promise';
import { createClient } from 'redis';

const CYAN = '\x1b[36m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const MAGENTA = '\x1b[35m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

function header(title: string, color: string) {
  console.log(`\n${color}${BOLD}${'═'.repeat(70)}${RESET}`);
  console.log(`${color}${BOLD}  ${title}${RESET}`);
  console.log(`${color}${BOLD}${'═'.repeat(70)}${RESET}\n`);
}

function section(title: string) {
  console.log(`\n${BOLD}▶ ${title}${RESET}`);
  console.log('─'.repeat(50));
}

async function runDemo() {
  header('DATACENDIA MULTI-SOURCE INTELLIGENCE DEMO', CYAN);
  
  console.log(`${BOLD}Demo Scenario:${RESET} A Fortune 500 enterprise client wants to see how`);
  console.log(`Datacendia connects to their existing data infrastructure.\n`);
  console.log(`${BOLD}Data Sources Connected:${RESET}`);
  console.log(`  • PostgreSQL (Port 5433) - Datacendia Platform Database`);
  console.log(`  • MySQL (Port 3306)      - Client's Salesforce CRM Export`);
  console.log(`  • MariaDB (Port 3307)    - Client's Analytics Data Warehouse`);
  console.log(`  • Redis (Port 6380)      - Real-Time Operational Metrics`);
  
  // ==========================================================================
  // DEMO 1: EXECUTIVE DECISIONS (PostgreSQL)
  // ==========================================================================
  header('DEMO 1: Strategic Decision Intelligence', GREEN);
  console.log(`${YELLOW}📍 Data Source: PostgreSQL (Datacendia Platform)${RESET}`);
  console.log(`${YELLOW}   Connection: postgresql://localhost:5433/datacendia${RESET}\n`);
  
  const pg = new Pool({ connectionString: 'postgresql://datacendia:datacendia_secure_2024@localhost:5433/datacendia' });
  
  section('Active Strategic Decisions');
  const decisions = await pg.query(`
    SELECT title, status, budget, category, department 
    FROM decisions 
    ORDER BY budget DESC
  `);
  
  let totalBudget = 0;
  decisions.rows.forEach((d: any) => {
    const statusIcon = d.status === 'APPROVED' ? '✅' : d.status === 'PENDING' ? '⏳' : '⏸️';
    console.log(`  ${statusIcon} ${d.title}`);
    console.log(`     Budget: $${(d.budget/1000000).toFixed(1)}M | Category: ${d.category} | Dept: ${d.department}`);
    totalBudget += d.budget;
  });
  console.log(`\n  ${BOLD}Total Budget Under Management: $${(totalBudget/1000000).toFixed(1)}M${RESET}`);

  section('Key Performance Metrics');
  const metrics = await pg.query(`
    SELECT md.name, md.category, mv.value, md.unit 
    FROM metric_definitions md 
    LEFT JOIN metric_values mv ON md.id = mv.metric_id 
    WHERE mv.timestamp = (SELECT MAX(timestamp) FROM metric_values WHERE metric_id = md.id)
    ORDER BY md.category, md.name
    LIMIT 8
  `);
  
  metrics.rows.forEach((m: any) => {
    console.log(`  • ${m.name}: ${m.value?.toFixed(1)}${m.unit || ''} (${m.category})`);
  });
  
  await pg.end();

  // ==========================================================================
  // DEMO 2: CRM INTEGRATION (MySQL)
  // ==========================================================================
  header('DEMO 2: CRM Data Integration (Salesforce-style)', GREEN);
  console.log(`${YELLOW}📍 Data Source: MySQL (Client's CRM System)${RESET}`);
  console.log(`${YELLOW}   Connection: mysql://localhost:3306/clientdata${RESET}\n`);
  
  const mysqlConn = await mysql.createConnection({
    host: 'localhost', port: 3306, user: 'root', password: 'cendia2025', database: 'clientdata'
  });

  section('Enterprise Account Portfolio');
  const [accounts] = await mysqlConn.execute(`
    SELECT name, industry, annual_revenue, employees, region, tier, health_score 
    FROM accounts 
    ORDER BY annual_revenue DESC
  `);
  
  let totalARR = 0;
  (accounts as any[]).forEach(a => {
    const healthIcon = a.health_score >= 85 ? '🟢' : a.health_score >= 70 ? '🟡' : '🔴';
    console.log(`  ${healthIcon} ${a.name} (${a.tier})`);
    console.log(`     ${a.industry} | $${(a.annual_revenue/1000000).toFixed(0)}M Rev | ${a.employees.toLocaleString()} employees | ${a.region}`);
    totalARR += a.annual_revenue;
  });
  console.log(`\n  ${BOLD}Total Customer Revenue: $${(totalARR/1000000000).toFixed(1)}B${RESET}`);

  section('Sales Pipeline');
  const [opps] = await mysqlConn.execute(`
    SELECT o.name, o.stage, o.amount, o.probability, o.close_date, a.name as account_name
    FROM opportunities o
    JOIN accounts a ON o.account_id = a.id
    ORDER BY o.amount DESC
    LIMIT 8
  `);
  
  let pipelineTotal = 0;
  let weightedPipeline = 0;
  (opps as any[]).forEach(o => {
    const stageIcon = o.stage === 'Closed Won' ? '🏆' : o.stage === 'Negotiation' ? '🤝' : o.stage === 'Proposal' ? '📄' : '🔍';
    console.log(`  ${stageIcon} ${o.name}`);
    console.log(`     $${(o.amount/1000000).toFixed(1)}M | ${o.stage} (${o.probability}%) | Close: ${o.close_date}`);
    pipelineTotal += o.amount;
    weightedPipeline += o.amount * (o.probability / 100);
  });
  console.log(`\n  ${BOLD}Pipeline Total: $${(pipelineTotal/1000000).toFixed(1)}M | Weighted: $${(weightedPipeline/1000000).toFixed(1)}M${RESET}`);

  await mysqlConn.end();

  // ==========================================================================
  // DEMO 3: ANALYTICS WAREHOUSE (MariaDB)
  // ==========================================================================
  header('DEMO 3: Analytics Data Warehouse', GREEN);
  console.log(`${YELLOW}📍 Data Source: MariaDB (Client's Data Warehouse)${RESET}`);
  console.log(`${YELLOW}   Connection: mysql://localhost:3307/analytics${RESET}\n`);
  
  const mariaConn = await mysql.createConnection({
    host: 'localhost', port: 3307, user: 'root', password: 'cendia2025', database: 'analytics'
  });

  section('Q4-2024 Business Performance');
  const [quarterly] = await mariaConn.execute(`
    SELECT metric_name, value, target, yoy_change 
    FROM quarterly_metrics 
    WHERE quarter = 'Q4-2024'
    ORDER BY yoy_change DESC
  `);
  
  (quarterly as any[]).forEach(q => {
    const trend = q.yoy_change > 0 ? '📈' : '📉';
    const change = q.yoy_change > 0 ? `+${q.yoy_change}%` : `${q.yoy_change}%`;
    const vs = q.value >= q.target ? '✅' : '⚠️';
    console.log(`  ${trend} ${q.metric_name}: ${q.value.toLocaleString()} ${vs}`);
    console.log(`     Target: ${q.target.toLocaleString()} | YoY: ${change}`);
  });

  section('Product Line Performance');
  const [products] = await mariaConn.execute(`
    SELECT product_line, monthly_users, nps_score, adoption_rate, revenue 
    FROM product_analytics 
    ORDER BY revenue DESC
  `);
  
  (products as any[]).forEach(p => {
    console.log(`  🚀 ${p.product_line}`);
    console.log(`     Users: ${p.monthly_users.toLocaleString()} | NPS: ${p.nps_score} | Adoption: ${p.adoption_rate}% | Rev: $${(p.revenue/1000000).toFixed(0)}M`);
  });

  section('Department KPIs');
  const [depts] = await mariaConn.execute(`
    SELECT department, metric, current_value, benchmark, trend 
    FROM department_performance 
    ORDER BY department
  `);
  
  (depts as any[]).forEach(d => {
    const trendIcon = d.trend === 'up' ? '↗️' : '↘️';
    const vsTarget = d.current_value >= d.benchmark ? '✅' : '⚠️';
    console.log(`  ${trendIcon} ${d.department}: ${d.metric} = ${d.current_value} ${vsTarget} (benchmark: ${d.benchmark})`);
  });

  await mariaConn.end();

  // ==========================================================================
  // DEMO 4: REAL-TIME OPERATIONS (Redis)
  // ==========================================================================
  header('DEMO 4: Real-Time Operational Dashboard', GREEN);
  console.log(`${YELLOW}📍 Data Source: Redis (In-Memory Cache)${RESET}`);
  console.log(`${YELLOW}   Connection: redis://localhost:6380${RESET}\n`);
  
  const redis = createClient({ url: 'redis://localhost:6380' });
  await redis.connect();

  section('Live Platform Metrics');
  const activeUsers = await redis.get('realtime:active_users');
  const activeCouncils = await redis.get('realtime:active_councils');
  const decisionsToday = await redis.get('realtime:decisions_today');
  const apiCalls = await redis.get('realtime:api_calls_hour');
  
  console.log(`  👥 Active Users Right Now: ${activeUsers}`);
  console.log(`  🤖 AI Councils In Progress: ${activeCouncils}`);
  console.log(`  ✅ Decisions Made Today: ${decisionsToday}`);
  console.log(`  📡 API Calls (last hour): ${parseInt(apiCalls || '0').toLocaleString()}`);

  section('System Health');
  const cpu = await redis.get('live:cpu_usage');
  const memory = await redis.get('live:memory_usage');
  const latency = await redis.get('live:api_latency_p99');
  const errorRate = await redis.get('live:error_rate');
  
  console.log(`  💻 CPU Usage: ${cpu}%`);
  console.log(`  🧠 Memory Usage: ${memory}%`);
  console.log(`  ⚡ API Latency (p99): ${latency}ms`);
  console.log(`  ❌ Error Rate: ${errorRate}%`);

  section('Recent Activity Stream');
  for (let i = 0; i < 5; i++) {
    const event = await redis.get(`event:recent:${i}`);
    if (event) {
      const e = JSON.parse(event);
      const icon = e.type === 'decision_approved' ? '✅' : 
                   e.type === 'council_completed' ? '🤖' :
                   e.type === 'alert_triggered' ? '⚠️' :
                   e.type === 'user_login' ? '👤' : '📄';
      console.log(`  ${icon} ${e.type.replace(/_/g, ' ').toUpperCase()}`);
      if (e.user) console.log(`     User: ${e.user}`);
      if (e.decision) console.log(`     Decision: ${e.decision}`);
      if (e.council) console.log(`     Council: ${e.council} (${e.duration}, ${e.agents} agents)`);
      if (e.message) console.log(`     ${e.severity.toUpperCase()}: ${e.message}`);
    }
  }

  await redis.quit();

  // ==========================================================================
  // SUMMARY
  // ==========================================================================
  header('DEMO COMPLETE: Multi-Source Intelligence Summary', MAGENTA);
  
  console.log(`${BOLD}Data Sources Connected:${RESET}`);
  console.log(`  ✅ PostgreSQL - Strategic decisions & platform metrics`);
  console.log(`  ✅ MySQL      - CRM accounts, contacts & opportunities`);
  console.log(`  ✅ MariaDB    - Analytics warehouse & KPIs`);
  console.log(`  ✅ Redis      - Real-time operational data\n`);
  
  console.log(`${BOLD}Key Differentiators:${RESET}`);
  console.log(`  • Zero-copy architecture: Data stays in client's systems`);
  console.log(`  • Real-time sync: Changes reflected instantly`);
  console.log(`  • Sovereign deployment: All processing happens locally`);
  console.log(`  • 10 AI agents analyzing data from all sources simultaneously\n`);
  
  console.log(`${BOLD}Enterprise Value:${RESET}`);
  console.log(`  • Single pane of glass for all enterprise data`);
  console.log(`  • AI-powered insights across siloed systems`);
  console.log(`  • Compliance-ready: Full audit trail, no data exfiltration`);
  console.log(`  • Deployed in < 48 hours with existing infrastructure\n`);
}

runDemo().then(() => process.exit(0));
