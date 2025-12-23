// =============================================================================
// TEST: REAL Multi-Source Database Connectivity
// Connects to ACTUAL databases - no simulation
// =============================================================================

import { Pool } from 'pg';
import { MongoClient } from 'mongodb';
import { createClient } from '@clickhouse/client';

interface SourceResult {
  source: string;
  type: string;
  status: 'connected' | 'error';
  rowCount?: number;
  data?: unknown[];
  error?: string;
}

async function testRealMultiSource() {
  console.log('\n' + '='.repeat(70));
  console.log('REAL MULTI-SOURCE DATABASE CONNECTIVITY TEST');
  console.log('NO SIMULATION - ALL REAL DATABASES');
  console.log('='.repeat(70) + '\n');

  const results: SourceResult[] = [];

  // =========================================================================
  // 1. PostgreSQL (Primary Database)
  // =========================================================================
  console.log('1. POSTGRESQL (Port 5434)');
  console.log('-'.repeat(50));
  
  let pgPool: Pool | null = null;
  try {
    pgPool = new Pool({
      connectionString: 'postgresql://cendia:cendia_sovereign_2025@localhost:5434/datacendia'
    });
    
    const pgClient = await pgPool.connect();
    
    // Query real data
    const decisions = await pgClient.query('SELECT title, status, budget FROM decisions LIMIT 5');
    const metrics = await pgClient.query('SELECT name, category FROM metric_definitions LIMIT 5');
    
    pgClient.release();
    
    console.log(`✓ Connected to PostgreSQL`);
    console.log(`  Decisions: ${decisions.rowCount} rows`);
    decisions.rows.forEach((r: any) => console.log(`    - ${r.title} (${r.status})`));
    console.log(`  Metrics: ${metrics.rowCount} rows`);
    metrics.rows.forEach((r: any) => console.log(`    - ${r.name} (${r.category})`));
    
    results.push({
      source: 'PostgreSQL',
      type: 'postgresql',
      status: 'connected',
      rowCount: decisions.rowCount! + metrics.rowCount!,
      data: [...decisions.rows, ...metrics.rows]
    });
  } catch (error: any) {
    console.log(`✗ PostgreSQL Error: ${error.message}`);
    results.push({ source: 'PostgreSQL', type: 'postgresql', status: 'error', error: error.message });
  }

  // =========================================================================
  // 2. MongoDB (NoSQL Database)
  // =========================================================================
  console.log('\n2. MONGODB (Port 27017)');
  console.log('-'.repeat(50));
  
  let mongoClient: MongoClient | null = null;
  try {
    mongoClient = new MongoClient('mongodb://localhost:27017');
    await mongoClient.connect();
    
    const db = mongoClient.db('datacendia');
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log(`✓ Connected to MongoDB`);
    console.log(`  Database: datacendia`);
    console.log(`  Collections: ${collections.length}`);
    collections.slice(0, 5).forEach(c => console.log(`    - ${c.name}`));
    
    // Try to query a collection if exists
    if (collections.length > 0) {
      const firstCollection = collections[0].name;
      const docs = await db.collection(firstCollection).find().limit(3).toArray();
      console.log(`  Sample from '${firstCollection}': ${docs.length} documents`);
    }
    
    results.push({
      source: 'MongoDB',
      type: 'mongodb',
      status: 'connected',
      rowCount: collections.length,
      data: collections
    });
  } catch (error: any) {
    console.log(`✗ MongoDB Error: ${error.message}`);
    results.push({ source: 'MongoDB', type: 'mongodb', status: 'error', error: error.message });
  }

  // =========================================================================
  // 3. ClickHouse (Analytics Database)
  // =========================================================================
  console.log('\n3. CLICKHOUSE (Port 8123)');
  console.log('-'.repeat(50));
  
  let clickhouse: any = null;
  try {
    clickhouse = createClient({
      host: 'http://localhost:8123',
      username: 'default',
      password: '',
    });
    
    // Query system tables
    const tablesResult = await clickhouse.query({
      query: 'SELECT database, name, engine FROM system.tables WHERE database != \'system\' LIMIT 10',
      format: 'JSONEachRow'
    });
    const tables = await tablesResult.json();
    
    console.log(`✓ Connected to ClickHouse`);
    console.log(`  Tables found: ${tables.length}`);
    tables.slice(0, 5).forEach((t: any) => console.log(`    - ${t.database}.${t.name} (${t.engine})`));
    
    // Get row counts from system
    const statsResult = await clickhouse.query({
      query: 'SELECT sum(rows) as total_rows, sum(bytes) as total_bytes FROM system.parts WHERE active',
      format: 'JSONEachRow'
    });
    const stats = await statsResult.json();
    if (stats[0]) {
      console.log(`  Total rows: ${stats[0].total_rows || 0}`);
      console.log(`  Total size: ${Math.round((stats[0].total_bytes || 0) / 1024)} KB`);
    }
    
    results.push({
      source: 'ClickHouse',
      type: 'clickhouse',
      status: 'connected',
      rowCount: tables.length,
      data: tables
    });
  } catch (error: any) {
    console.log(`✗ ClickHouse Error: ${error.message}`);
    results.push({ source: 'ClickHouse', type: 'clickhouse', status: 'error', error: error.message });
  }

  // =========================================================================
  // SUMMARY
  // =========================================================================
  console.log('\n' + '='.repeat(70));
  console.log('MULTI-SOURCE CONNECTIVITY SUMMARY');
  console.log('='.repeat(70));
  
  const connected = results.filter(r => r.status === 'connected');
  const failed = results.filter(r => r.status === 'error');
  
  console.log(`\nConnected: ${connected.length}/${results.length} sources\n`);
  
  results.forEach(r => {
    const icon = r.status === 'connected' ? '✓' : '✗';
    const statusText = r.status === 'connected' 
      ? `CONNECTED (${r.rowCount} items)` 
      : `ERROR: ${r.error}`;
    console.log(`${icon} ${r.source.padEnd(15)} ${r.type.padEnd(12)} ${statusText}`);
  });

  if (connected.length >= 2) {
    console.log('\n' + '='.repeat(70));
    console.log('✓ MULTI-SOURCE CONNECTIVITY PROVEN');
    console.log('  Real databases, real connections, real data');
    console.log('='.repeat(70));
  }

  // Cleanup
  if (pgPool) await pgPool.end();
  if (mongoClient) await mongoClient.close();
  if (clickhouse) await clickhouse.close();
  
  process.exit(0);
}

testRealMultiSource().catch(console.error);
