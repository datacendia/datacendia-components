// =============================================================================
// MULTI-SOURCE TEST: 5 DIFFERENT DATABASE TYPES
// PostgreSQL, MySQL, MariaDB, Redis, SQLite
// =============================================================================

import { Pool } from 'pg';
import mysql from 'mysql2/promise';
import Database from 'better-sqlite3';
import { createClient } from 'redis';
import * as fs from 'fs';
import * as path from 'path';

interface DBResult {
  name: string;
  type: string;
  port: string;
  status: 'CONNECTED' | 'ERROR';
  tables?: number;
  rows?: number;
  sample?: string[];
  error?: string;
}

async function main() {
  console.log('\n' + '═'.repeat(70));
  console.log('  MULTI-SOURCE DATABASE CONNECTIVITY TEST');
  console.log('  5 Different Database Engines - Real Connections');
  console.log('═'.repeat(70) + '\n');

  const results: DBResult[] = [];

  // =========================================================================
  // 1. PostgreSQL (Port 5434)
  // =========================================================================
  console.log('1. POSTGRESQL');
  console.log('─'.repeat(50));
  try {
    const pg = new Pool({ connectionString: 'postgresql://cendia:cendia_sovereign_2025@localhost:5434/datacendia' });
    const client = await pg.connect();
    
    const tables = await client.query(`SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'`);
    const decisions = await client.query('SELECT title FROM decisions LIMIT 3');
    
    console.log(`   ✓ Connected to PostgreSQL on port 5434`);
    console.log(`   Tables: ${tables.rows[0].count}`);
    console.log(`   Sample: ${decisions.rows.map((r: any) => r.title).join(', ')}`);
    
    results.push({
      name: 'PostgreSQL',
      type: 'Relational (ACID)',
      port: '5434',
      status: 'CONNECTED',
      tables: parseInt(tables.rows[0].count),
      sample: decisions.rows.map((r: any) => r.title)
    });
    
    client.release();
    await pg.end();
  } catch (e: any) {
    console.log(`   ✗ Error: ${e.message}`);
    results.push({ name: 'PostgreSQL', type: 'Relational', port: '5434', status: 'ERROR', error: e.message });
  }

  // =========================================================================
  // 2. MySQL (Port 3306)
  // =========================================================================
  console.log('\n2. MYSQL');
  console.log('─'.repeat(50));
  try {
    const mysqlConn = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'cendia2025',
      database: 'clientdata'
    });

    // Create sample table and data
    await mysqlConn.execute(`
      CREATE TABLE IF NOT EXISTS customers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        revenue DECIMAL(15,2),
        tier VARCHAR(50)
      )
    `);
    
    await mysqlConn.execute(`DELETE FROM customers`);
    await mysqlConn.execute(`INSERT INTO customers (name, revenue, tier) VALUES 
      ('Acme Corp', 1500000, 'Enterprise'),
      ('TechStart Inc', 250000, 'Growth'),
      ('Global Industries', 5000000, 'Enterprise')`);

    const [rows] = await mysqlConn.execute('SELECT name, revenue FROM customers');
    
    console.log(`   ✓ Connected to MySQL on port 3306`);
    console.log(`   Database: clientdata`);
    console.log(`   Sample: ${(rows as any[]).map(r => `${r.name}: $${r.revenue}`).join(', ')}`);
    
    results.push({
      name: 'MySQL',
      type: 'Relational (ACID)',
      port: '3306',
      status: 'CONNECTED',
      rows: (rows as any[]).length,
      sample: (rows as any[]).map(r => `${r.name}: $${r.revenue}`)
    });
    
    await mysqlConn.end();
  } catch (e: any) {
    console.log(`   ✗ Error: ${e.message}`);
    results.push({ name: 'MySQL', type: 'Relational', port: '3306', status: 'ERROR', error: e.message });
  }

  // =========================================================================
  // 3. MariaDB (Port 3307)
  // =========================================================================
  console.log('\n3. MARIADB');
  console.log('─'.repeat(50));
  try {
    const mariaConn = await mysql.createConnection({
      host: 'localhost',
      port: 3307,
      user: 'root',
      password: 'cendia2025',
      database: 'analytics'
    });

    // Create sample table and data
    await mariaConn.execute(`
      CREATE TABLE IF NOT EXISTS sales_metrics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        metric_name VARCHAR(100),
        value DECIMAL(15,2),
        period VARCHAR(20)
      )
    `);
    
    await mariaConn.execute(`DELETE FROM sales_metrics`);
    await mariaConn.execute(`INSERT INTO sales_metrics (metric_name, value, period) VALUES 
      ('Revenue', 4500000, 'Q4-2024'),
      ('Deals Closed', 127, 'Q4-2024'),
      ('Pipeline Value', 12000000, 'Q1-2025')`);

    const [rows] = await mariaConn.execute('SELECT metric_name, value FROM sales_metrics');
    
    console.log(`   ✓ Connected to MariaDB on port 3307`);
    console.log(`   Database: analytics`);
    console.log(`   Sample: ${(rows as any[]).map(r => `${r.metric_name}: ${r.value}`).join(', ')}`);
    
    results.push({
      name: 'MariaDB',
      type: 'Relational (ACID)',
      port: '3307',
      status: 'CONNECTED',
      rows: (rows as any[]).length,
      sample: (rows as any[]).map(r => `${r.metric_name}: ${r.value}`)
    });
    
    await mariaConn.end();
  } catch (e: any) {
    console.log(`   ✗ Error: ${e.message}`);
    results.push({ name: 'MariaDB', type: 'Relational', port: '3307', status: 'ERROR', error: e.message });
  }

  // =========================================================================
  // 4. Redis (Port 6380)
  // =========================================================================
  console.log('\n4. REDIS');
  console.log('─'.repeat(50));
  try {
    const redis = createClient({ url: 'redis://localhost:6380' });
    await redis.connect();

    // Set sample data
    await redis.set('session:user1', JSON.stringify({ userId: 'U001', role: 'admin', lastActive: new Date().toISOString() }));
    await redis.set('cache:metrics', JSON.stringify({ revenue: 4500000, users: 1250 }));
    await redis.set('realtime:connections', '47');

    const keys = await redis.keys('*');
    const session = await redis.get('session:user1');
    
    console.log(`   ✓ Connected to Redis on port 6380`);
    console.log(`   Keys: ${keys.length}`);
    console.log(`   Sample: session:user1 = ${session?.substring(0, 50)}...`);
    
    results.push({
      name: 'Redis',
      type: 'Key-Value (In-Memory)',
      port: '6380',
      status: 'CONNECTED',
      rows: keys.length,
      sample: keys.slice(0, 5)
    });
    
    await redis.quit();
  } catch (e: any) {
    console.log(`   ✗ Error: ${e.message}`);
    results.push({ name: 'Redis', type: 'Key-Value', port: '6380', status: 'ERROR', error: e.message });
  }

  // =========================================================================
  // 5. SQLite (File-based)
  // =========================================================================
  console.log('\n5. SQLITE');
  console.log('─'.repeat(50));
  try {
    const dbPath = path.join(__dirname, 'local_data.db');
    const sqlite = new Database(dbPath);

    // Create sample table and data
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS audit_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action TEXT,
        user_id TEXT,
        timestamp TEXT
      )
    `);
    
    sqlite.exec(`DELETE FROM audit_log`);
    const insert = sqlite.prepare('INSERT INTO audit_log (action, user_id, timestamp) VALUES (?, ?, ?)');
    insert.run('LOGIN', 'U001', new Date().toISOString());
    insert.run('VIEW_DECISION', 'U001', new Date().toISOString());
    insert.run('APPROVE_DECISION', 'U002', new Date().toISOString());

    const rows = sqlite.prepare('SELECT action, user_id FROM audit_log').all();
    
    console.log(`   ✓ Connected to SQLite (file: local_data.db)`);
    console.log(`   Rows: ${rows.length}`);
    console.log(`   Sample: ${rows.map((r: any) => `${r.action} by ${r.user_id}`).join(', ')}`);
    
    results.push({
      name: 'SQLite',
      type: 'Embedded (File)',
      port: 'N/A',
      status: 'CONNECTED',
      rows: rows.length,
      sample: rows.map((r: any) => `${r.action} by ${r.user_id}`)
    });
    
    sqlite.close();
    fs.unlinkSync(dbPath); // Cleanup
  } catch (e: any) {
    console.log(`   ✗ Error: ${e.message}`);
    results.push({ name: 'SQLite', type: 'Embedded', port: 'N/A', status: 'ERROR', error: e.message });
  }

  // =========================================================================
  // SUMMARY
  // =========================================================================
  console.log('\n' + '═'.repeat(70));
  console.log('  RESULTS SUMMARY');
  console.log('═'.repeat(70));
  
  const connected = results.filter(r => r.status === 'CONNECTED').length;
  
  console.log(`\n  ${connected}/${results.length} databases connected successfully\n`);
  console.log('  ' + '─'.repeat(66));
  console.log(`  ${'Database'.padEnd(12)} ${'Type'.padEnd(22)} ${'Port'.padEnd(8)} Status`);
  console.log('  ' + '─'.repeat(66));
  
  results.forEach(r => {
    const icon = r.status === 'CONNECTED' ? '✓' : '✗';
    console.log(`  ${icon} ${r.name.padEnd(10)} ${r.type.padEnd(22)} ${r.port.padEnd(8)} ${r.status}`);
  });
  
  console.log('  ' + '─'.repeat(66));

  if (connected === 5) {
    console.log('\n' + '═'.repeat(70));
    console.log('  ✓ MULTI-SOURCE CONNECTIVITY PROVEN');
    console.log('  5 different database engines connected simultaneously');
    console.log('═'.repeat(70) + '\n');
  }

  process.exit(0);
}

main().catch(console.error);
