import { Pool } from 'pg';
import mysql from 'mysql2/promise';
import { createClient } from 'redis';

async function checkDatabases() {
  console.log('\n=== DATABASE DATA AUDIT FOR MARKETING ===\n');

  // 1. PostgreSQL
  console.log('1. POSTGRESQL (Primary Datacendia DB)');
  console.log('-'.repeat(50));
  try {
    const pg = new Pool({ connectionString: 'postgresql://datacendia:datacendia_secure_2024@localhost:5433/datacendia' });
    const decisions = await pg.query('SELECT title, status, budget, department FROM decisions LIMIT 5');
    const metrics = await pg.query(`
      SELECT md.name, md.category, mv.value, md.unit 
      FROM metric_definitions md 
      LEFT JOIN metric_values mv ON md.id = mv.metric_id 
      WHERE mv.timestamp = (SELECT MAX(timestamp) FROM metric_values WHERE metric_id = md.id)
      LIMIT 8
    `);
    const users = await pg.query('SELECT name, email, role FROM users LIMIT 3');
    
    console.log(`  Decisions: ${decisions.rowCount}`);
    decisions.rows.forEach((r: any) => console.log(`    - ${r.title} | ${r.status} | $${r.budget?.toLocaleString() || 'N/A'}`));
    console.log(`  Metrics: ${metrics.rowCount}`);
    metrics.rows.forEach((r: any) => console.log(`    - ${r.name}: ${r.value?.toFixed(2)} ${r.unit || ''} (${r.category})`));
    console.log(`  Users: ${users.rowCount}`);
    users.rows.forEach((r: any) => console.log(`    - ${r.name} <${r.email}> [${r.role}]`));
    await pg.end();
  } catch (e: any) {
    console.log(`  ERROR: ${e.message}`);
  }

  // 2. MySQL
  console.log('\n2. MYSQL (External CRM Simulation)');
  console.log('-'.repeat(50));
  try {
    const mysql_conn = await mysql.createConnection({
      host: 'localhost', port: 3306, user: 'root', password: 'cendia2025', database: 'clientdata'
    });
    const [tables] = await mysql_conn.execute('SHOW TABLES');
    const [customers] = await mysql_conn.execute('SELECT * FROM customers');
    console.log(`  Tables: ${(tables as any[]).length}`);
    console.log(`  Customers: ${(customers as any[]).length}`);
    (customers as any[]).forEach(c => console.log(`    - ${c.name}: $${c.revenue?.toLocaleString()} (${c.tier})`));
    await mysql_conn.end();
  } catch (e: any) {
    console.log(`  ERROR: ${e.message}`);
  }

  // 3. MariaDB
  console.log('\n3. MARIADB (Analytics Simulation)');
  console.log('-'.repeat(50));
  try {
    const maria_conn = await mysql.createConnection({
      host: 'localhost', port: 3307, user: 'root', password: 'cendia2025', database: 'analytics'
    });
    const [tables] = await maria_conn.execute('SHOW TABLES');
    const [metrics] = await maria_conn.execute('SELECT * FROM sales_metrics');
    console.log(`  Tables: ${(tables as any[]).length}`);
    console.log(`  Sales Metrics: ${(metrics as any[]).length}`);
    (metrics as any[]).forEach(m => console.log(`    - ${m.metric_name}: ${m.value?.toLocaleString()} (${m.period})`));
    await maria_conn.end();
  } catch (e: any) {
    console.log(`  ERROR: ${e.message}`);
  }

  // 4. Redis
  console.log('\n4. REDIS (Cache/Session Store)');
  console.log('-'.repeat(50));
  try {
    const redis = createClient({ url: 'redis://localhost:6380' });
    await redis.connect();
    const keys = await redis.keys('*');
    console.log(`  Total Keys: ${keys.length}`);
    const sampleKeys = keys.slice(0, 5);
    for (const key of sampleKeys) {
      const val = await redis.get(key);
      console.log(`    - ${key}: ${val?.substring(0, 60)}...`);
    }
    await redis.quit();
  } catch (e: any) {
    console.log(`  ERROR: ${e.message}`);
  }

  console.log('\n' + '='.repeat(50));
  console.log('MARKETING READINESS ASSESSMENT');
  console.log('='.repeat(50));
}

checkDatabases().then(() => process.exit(0));
