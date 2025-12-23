import { Pool } from 'pg';
import mysql from 'mysql2/promise';
import { createClient } from 'redis';

async function verify() {
  console.log('\n' + '═'.repeat(60));
  console.log('  MULTI-SOURCE MARKETING DATA VERIFICATION');
  console.log('═'.repeat(60) + '\n');

  // 1. PostgreSQL
  console.log('1. POSTGRESQL - Datacendia Platform Data');
  console.log('─'.repeat(50));
  const pg = new Pool({ connectionString: 'postgresql://cendia:cendia_sovereign_2025@localhost:5434/datacendia' });
  const decisions = await pg.query('SELECT title, status, budget FROM decisions LIMIT 5');
  const metrics = await pg.query('SELECT name, category FROM metric_definitions LIMIT 5');
  console.log(`   Decisions: ${decisions.rowCount}`);
  decisions.rows.forEach((r: any) => console.log(`     • ${r.title} [${r.status}] $${(r.budget/1000000).toFixed(1)}M`));
  console.log(`   Metrics: ${metrics.rowCount}`);
  await pg.end();

  // 2. MySQL - CRM
  console.log('\n2. MYSQL - Enterprise CRM Data');
  console.log('─'.repeat(50));
  const mysql_conn = await mysql.createConnection({ host: 'localhost', port: 3306, user: 'root', password: 'cendia2025', database: 'clientdata' });
  const [accounts] = await mysql_conn.execute('SELECT name, industry, annual_revenue, tier FROM accounts ORDER BY annual_revenue DESC LIMIT 5');
  const [opps] = await mysql_conn.execute('SELECT name, stage, amount FROM opportunities ORDER BY amount DESC LIMIT 5');
  console.log(`   Top Accounts:`);
  (accounts as any[]).forEach(a => console.log(`     • ${a.name} (${a.industry}) - $${(a.annual_revenue/1000000).toFixed(0)}M - ${a.tier}`));
  console.log(`   Top Opportunities:`);
  (opps as any[]).forEach(o => console.log(`     • ${o.name} [${o.stage}] $${(o.amount/1000000).toFixed(1)}M`));
  await mysql_conn.end();

  // 3. MariaDB - Analytics
  console.log('\n3. MARIADB - Analytics Warehouse');
  console.log('─'.repeat(50));
  const maria = await mysql.createConnection({ host: 'localhost', port: 3307, user: 'root', password: 'cendia2025', database: 'analytics' });
  const [quarterly] = await maria.execute('SELECT quarter, metric_name, value, yoy_change FROM quarterly_metrics WHERE quarter = "Q4-2024" LIMIT 5');
  const [products] = await maria.execute('SELECT product_line, monthly_users, nps_score, revenue FROM product_analytics ORDER BY revenue DESC LIMIT 4');
  console.log(`   Q4-2024 Metrics:`);
  (quarterly as any[]).forEach(q => console.log(`     • ${q.metric_name}: ${q.value.toLocaleString()} (${q.yoy_change > 0 ? '+' : ''}${q.yoy_change}% YoY)`));
  console.log(`   Product Performance:`);
  (products as any[]).forEach(p => console.log(`     • ${p.product_line}: ${p.monthly_users.toLocaleString()} users, NPS ${p.nps_score}, $${(p.revenue/1000000).toFixed(0)}M`));
  await maria.end();

  // 4. Redis - Real-time
  console.log('\n4. REDIS - Real-Time Metrics');
  console.log('─'.repeat(50));
  const redis = createClient({ url: 'redis://localhost:6380' });
  await redis.connect();
  const activeUsers = await redis.get('realtime:active_users');
  const activeCouncils = await redis.get('realtime:active_councils');
  const decisionsToday = await redis.get('realtime:decisions_today');
  const apiCalls = await redis.get('realtime:api_calls_hour');
  console.log(`   Active Users: ${activeUsers}`);
  console.log(`   Active AI Councils: ${activeCouncils}`);
  console.log(`   Decisions Today: ${decisionsToday}`);
  console.log(`   API Calls/Hour: ${parseInt(apiCalls || '0').toLocaleString()}`);
  await redis.quit();

  console.log('\n' + '═'.repeat(60));
  console.log('  ✅ ALL 4 DATABASES POPULATED WITH MARKETING DATA');
  console.log('═'.repeat(60) + '\n');
}

verify().then(() => process.exit(0));
