// =============================================================================
// MARKETING DEMO DATA SEEDER
// Realistic enterprise data for multi-source connectivity demos
// =============================================================================

import { Pool } from 'pg';
import mysql from 'mysql2/promise';
import { createClient } from 'redis';

async function seedMarketingData() {
  console.log('\n🚀 SEEDING MARKETING DEMO DATA\n');

  // =========================================================================
  // 1. MYSQL - CRM DATA (Salesforce-like)
  // =========================================================================
  console.log('1. MYSQL - Seeding CRM Data...');
  try {
    const mysqlConn = await mysql.createConnection({
      host: 'localhost', port: 3306, user: 'root', password: 'cendia2025', database: 'clientdata'
    });

    // Drop and recreate tables
    await mysqlConn.execute('DROP TABLE IF EXISTS opportunities');
    await mysqlConn.execute('DROP TABLE IF EXISTS contacts');
    await mysqlConn.execute('DROP TABLE IF EXISTS accounts');

    // Accounts (Companies)
    await mysqlConn.execute(`
      CREATE TABLE accounts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        industry VARCHAR(50),
        annual_revenue DECIMAL(15,2),
        employees INT,
        region VARCHAR(50),
        tier VARCHAR(20),
        health_score INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Contacts
    await mysqlConn.execute(`
      CREATE TABLE contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        account_id INT,
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        title VARCHAR(100),
        email VARCHAR(100),
        phone VARCHAR(20),
        last_contacted DATE
      )
    `);

    // Opportunities (Deals)
    await mysqlConn.execute(`
      CREATE TABLE opportunities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        account_id INT,
        name VARCHAR(200),
        stage VARCHAR(50),
        amount DECIMAL(15,2),
        probability INT,
        close_date DATE,
        owner VARCHAR(100)
      )
    `);

    // Insert Accounts
    const accounts = [
      ['Meridian Healthcare Systems', 'Healthcare', 850000000, 4200, 'North America', 'Enterprise', 92],
      ['Nordic Financial Group', 'Financial Services', 2100000000, 8500, 'EMEA', 'Strategic', 88],
      ['Pacific Logistics Corp', 'Transportation', 420000000, 2100, 'APAC', 'Enterprise', 76],
      ['Sentinel Defense Technologies', 'Aerospace & Defense', 1800000000, 6200, 'North America', 'Strategic', 95],
      ['Atlas Manufacturing', 'Manufacturing', 680000000, 3400, 'North America', 'Enterprise', 81],
      ['Quantum Energy Partners', 'Energy', 1200000000, 4800, 'EMEA', 'Strategic', 89],
      ['Nexus Retail Group', 'Retail', 560000000, 12000, 'North America', 'Enterprise', 72],
      ['Horizon Pharmaceuticals', 'Life Sciences', 920000000, 3100, 'APAC', 'Enterprise', 85],
      ['Sterling Insurance Holdings', 'Insurance', 1500000000, 5600, 'North America', 'Strategic', 91],
      ['Vertex Technology Solutions', 'Technology', 380000000, 1800, 'EMEA', 'Growth', 78],
    ];

    for (const a of accounts) {
      await mysqlConn.execute(
        'INSERT INTO accounts (name, industry, annual_revenue, employees, region, tier, health_score) VALUES (?, ?, ?, ?, ?, ?, ?)',
        a
      );
    }

    // Insert Contacts
    const contacts = [
      [1, 'Sarah', 'Chen', 'Chief Strategy Officer', 'schen@meridianhealth.com', '+1-555-0101', '2024-12-15'],
      [1, 'Michael', 'Torres', 'VP of Operations', 'mtorres@meridianhealth.com', '+1-555-0102', '2024-12-18'],
      [2, 'Erik', 'Lindqvist', 'CFO', 'elindqvist@nordicfin.eu', '+46-8-555-1001', '2024-12-10'],
      [2, 'Anna', 'Bergström', 'Head of Digital Transformation', 'abergstrom@nordicfin.eu', '+46-8-555-1002', '2024-12-19'],
      [3, 'James', 'Wong', 'COO', 'jwong@pacificlogistics.com', '+852-555-2001', '2024-12-12'],
      [4, 'Robert', 'Hayes', 'CISO', 'rhayes@sentineldef.com', '+1-555-0301', '2024-12-20'],
      [4, 'Patricia', 'Morgan', 'VP Procurement', 'pmorgan@sentineldef.com', '+1-555-0302', '2024-12-17'],
      [5, 'David', 'Schmidt', 'Plant Manager', 'dschmidt@atlasmfg.com', '+1-555-0401', '2024-12-14'],
      [6, 'Hans', 'Mueller', 'CEO', 'hmueller@quantumenergy.eu', '+49-30-555-5001', '2024-12-11'],
      [7, 'Jennifer', 'Adams', 'CMO', 'jadams@nexusretail.com', '+1-555-0601', '2024-12-16'],
    ];

    for (const c of contacts) {
      await mysqlConn.execute(
        'INSERT INTO contacts (account_id, first_name, last_name, title, email, phone, last_contacted) VALUES (?, ?, ?, ?, ?, ?, ?)',
        c
      );
    }

    // Insert Opportunities
    const opportunities = [
      [1, 'Meridian - Enterprise Platform Expansion', 'Negotiation', 2400000, 75, '2025-01-31', 'Alex Johnson'],
      [1, 'Meridian - AI Council Pilot', 'Proposal', 850000, 60, '2025-02-15', 'Alex Johnson'],
      [2, 'Nordic - Sovereign Deployment', 'Closed Won', 4200000, 100, '2024-12-01', 'Maria Garcia'],
      [2, 'Nordic - GDPR Compliance Module', 'Negotiation', 680000, 80, '2025-01-15', 'Maria Garcia'],
      [3, 'Pacific - Supply Chain Intelligence', 'Discovery', 1200000, 30, '2025-03-31', 'Kevin Park'],
      [4, 'Sentinel - CendiaAegis Implementation', 'Proposal', 3800000, 65, '2025-02-28', 'Sarah Williams'],
      [5, 'Atlas - Predictive Maintenance Suite', 'Qualification', 920000, 40, '2025-04-15', 'David Chen'],
      [6, 'Quantum - Grid Optimization Platform', 'Negotiation', 1650000, 70, '2025-01-31', 'Emma Thompson'],
      [7, 'Nexus - Customer Analytics', 'Discovery', 780000, 25, '2025-05-01', 'James Wilson'],
      [8, 'Horizon - Clinical Trial Analytics', 'Proposal', 1100000, 55, '2025-03-15', 'Lisa Brown'],
      [9, 'Sterling - Risk Assessment Engine', 'Closed Won', 2900000, 100, '2024-11-15', 'Michael Lee'],
      [10, 'Vertex - Development Platform', 'Qualification', 450000, 35, '2025-04-30', 'Rachel Kim'],
    ];

    for (const o of opportunities) {
      await mysqlConn.execute(
        'INSERT INTO opportunities (account_id, name, stage, amount, probability, close_date, owner) VALUES (?, ?, ?, ?, ?, ?, ?)',
        o
      );
    }

    await mysqlConn.end();
    console.log('   ✓ CRM: 10 accounts, 10 contacts, 12 opportunities');
  } catch (e: any) {
    console.log(`   ✗ Error: ${e.message}`);
  }

  // =========================================================================
  // 2. MARIADB - ANALYTICS DATA (Data Warehouse)
  // =========================================================================
  console.log('\n2. MARIADB - Seeding Analytics Data...');
  try {
    const mariaConn = await mysql.createConnection({
      host: 'localhost', port: 3307, user: 'root', password: 'cendia2025', database: 'analytics'
    });

    await mariaConn.execute('DROP TABLE IF EXISTS quarterly_metrics');
    await mariaConn.execute('DROP TABLE IF EXISTS department_performance');
    await mariaConn.execute('DROP TABLE IF EXISTS product_analytics');

    // Quarterly Metrics
    await mariaConn.execute(`
      CREATE TABLE quarterly_metrics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        quarter VARCHAR(10),
        metric_name VARCHAR(100),
        value DECIMAL(15,2),
        target DECIMAL(15,2),
        yoy_change DECIMAL(5,2)
      )
    `);

    // Department Performance
    await mariaConn.execute(`
      CREATE TABLE department_performance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        department VARCHAR(50),
        metric VARCHAR(100),
        current_value DECIMAL(15,2),
        benchmark DECIMAL(15,2),
        trend VARCHAR(20)
      )
    `);

    // Product Analytics
    await mariaConn.execute(`
      CREATE TABLE product_analytics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_line VARCHAR(100),
        monthly_users INT,
        nps_score INT,
        adoption_rate DECIMAL(5,2),
        revenue DECIMAL(15,2)
      )
    `);

    // Quarterly Metrics Data
    const quarterlyMetrics = [
      ['Q4-2024', 'Total Revenue', 48500000, 45000000, 12.5],
      ['Q4-2024', 'ARR', 186000000, 175000000, 18.2],
      ['Q4-2024', 'New Customers', 47, 40, 25.0],
      ['Q4-2024', 'Net Retention', 118, 115, 3.5],
      ['Q4-2024', 'Gross Margin', 72.4, 70.0, 2.1],
      ['Q4-2024', 'CAC Payback', 14.2, 16.0, -8.5],
      ['Q4-2024', 'Pipeline Generated', 124000000, 100000000, 32.0],
      ['Q4-2024', 'Win Rate', 34.5, 30.0, 8.2],
      ['Q3-2024', 'Total Revenue', 44200000, 42000000, 10.8],
      ['Q3-2024', 'ARR', 172000000, 165000000, 15.4],
      ['Q3-2024', 'New Customers', 42, 38, 18.0],
      ['Q3-2024', 'Net Retention', 116, 115, 2.8],
    ];

    for (const m of quarterlyMetrics) {
      await mariaConn.execute(
        'INSERT INTO quarterly_metrics (quarter, metric_name, value, target, yoy_change) VALUES (?, ?, ?, ?, ?)',
        m
      );
    }

    // Department Performance
    const deptPerf = [
      ['Sales', 'Quota Attainment', 112.5, 100.0, 'up'],
      ['Sales', 'Average Deal Size', 1850000, 1500000, 'up'],
      ['Marketing', 'MQL to SQL', 28.4, 25.0, 'up'],
      ['Marketing', 'CAC', 42000, 50000, 'down'],
      ['Customer Success', 'NPS Score', 72, 65, 'up'],
      ['Customer Success', 'Churn Rate', 3.2, 5.0, 'down'],
      ['Engineering', 'Sprint Velocity', 94, 90, 'up'],
      ['Engineering', 'Bug Escape Rate', 2.1, 3.0, 'down'],
      ['Finance', 'Days Sales Outstanding', 38, 45, 'down'],
      ['Finance', 'Operating Margin', 18.5, 15.0, 'up'],
    ];

    for (const d of deptPerf) {
      await mariaConn.execute(
        'INSERT INTO department_performance (department, metric, current_value, benchmark, trend) VALUES (?, ?, ?, ?, ?)',
        d
      );
    }

    // Product Analytics
    const products = [
      ['CendiaCore™ Platform', 12400, 78, 94.2, 82000000],
      ['CendiaCouncil™ AI', 8200, 82, 68.5, 45000000],
      ['CendiaSentinel™ Monitoring', 6800, 75, 72.1, 28000000],
      ['CendiaChronos™ Timeline', 5400, 71, 58.4, 18000000],
      ['CendiaVault™ Storage', 9100, 76, 81.3, 12000000],
      ['CendiaAegis™ Defense', 1200, 88, 42.0, 8500000],
    ];

    for (const p of products) {
      await mariaConn.execute(
        'INSERT INTO product_analytics (product_line, monthly_users, nps_score, adoption_rate, revenue) VALUES (?, ?, ?, ?, ?)',
        p
      );
    }

    await mariaConn.end();
    console.log('   ✓ Analytics: 12 quarterly metrics, 10 dept metrics, 6 products');
  } catch (e: any) {
    console.log(`   ✗ Error: ${e.message}`);
  }

  // =========================================================================
  // 3. REDIS - REAL-TIME DATA
  // =========================================================================
  console.log('\n3. REDIS - Seeding Real-Time Data...');
  try {
    const redis = createClient({ url: 'redis://localhost:6380' });
    await redis.connect();

    // Active Sessions
    await redis.set('realtime:active_users', '847');
    await redis.set('realtime:active_councils', '23');
    await redis.set('realtime:decisions_today', '156');
    await redis.set('realtime:api_calls_hour', '45892');

    // Live Metrics
    await redis.set('live:cpu_usage', '42.3');
    await redis.set('live:memory_usage', '67.8');
    await redis.set('live:api_latency_p99', '128');
    await redis.set('live:error_rate', '0.02');

    // Recent Events
    const events = [
      { type: 'decision_approved', user: 'schen@meridianhealth.com', decision: 'APAC Expansion', timestamp: new Date().toISOString() },
      { type: 'council_completed', council: 'Q1 Budget Review', duration: '12m 34s', agents: 8, timestamp: new Date().toISOString() },
      { type: 'alert_triggered', severity: 'warning', message: 'Pipeline forecast variance detected', timestamp: new Date().toISOString() },
      { type: 'user_login', user: 'hmueller@quantumenergy.eu', region: 'EMEA', timestamp: new Date().toISOString() },
      { type: 'document_uploaded', file: 'Q4_Financial_Report.pdf', size: '2.4MB', timestamp: new Date().toISOString() },
    ];

    for (let i = 0; i < events.length; i++) {
      await redis.set(`event:recent:${i}`, JSON.stringify(events[i]));
    }

    // Feature Flags
    await redis.set('feature:ai_council_v2', 'true');
    await redis.set('feature:chronos_beta', 'true');
    await redis.set('feature:aegis_enabled', 'false');

    await redis.quit();
    console.log('   ✓ Redis: Real-time metrics, events, feature flags');
  } catch (e: any) {
    console.log(`   ✗ Error: ${e.message}`);
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ MARKETING DATA SEEDING COMPLETE');
  console.log('='.repeat(50) + '\n');
}

seedMarketingData().then(() => process.exit(0));
