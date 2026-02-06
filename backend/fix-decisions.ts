import { Pool } from 'pg';
import { randomUUID } from 'crypto';

async function cleanAndSeed() {
  const pool = new Pool({ connectionString: 'postgresql://datacendia:datacendia_secure_2024@localhost:5433/datacendia' });
  
  // Get org ID and user ID
  const org = await pool.query('SELECT id FROM organizations LIMIT 1');
  const orgId = org.rows[0]?.id;
  const user = await pool.query('SELECT id FROM users LIMIT 1');
  const userId = user.rows[0]?.id;
  
  // Delete all decisions
  await pool.query('DELETE FROM decisions');
  
  // Insert clean marketing decisions with UUIDs
  const decisions = [
    ['Q1 2025 APAC Market Expansion', 'Strategic expansion into Singapore, Japan, and Australia markets with localized platform deployment.', 'APPROVED', 'STRATEGIC', 'expansion', 2500000],
    ['Enterprise AI Council Platform Launch', 'Full deployment of CendiaCouncil AI deliberation system for Fortune 500 clients.', 'APPROVED', 'STRATEGIC', 'product', 4200000],
    ['SOC 2 Type II Certification', 'Complete security audit and certification for enterprise compliance requirements.', 'APPROVED', 'COMPLIANCE', 'compliance', 850000],
    ['Nordic Financial Sovereign Deployment', 'Air-gapped deployment for Nordic Financial Group with GDPR compliance.', 'APPROVED', 'STRATEGIC', 'deployment', 3800000],
    ['Q2 Sales Team Expansion', 'Hire 12 enterprise account executives across NA and EMEA regions.', 'PENDING', 'OPERATIONAL', 'hiring', 1200000],
    ['CendiaAegis Defense Module', 'Development of classified-ready deployment option for defense sector.', 'PENDING', 'STRATEGIC', 'product', 2100000],
    ['Customer Success Platform Integration', 'Integration with Gainsight for proactive customer health monitoring.', 'DEFERRED', 'OPERATIONAL', 'integration', 320000],
    ['Series C Fundraise Preparation', 'Prepare materials and data room for potential Series C fundraise.', 'PENDING', 'STRATEGIC', 'finance', 150000],
  ];
  
  for (const d of decisions) {
    await pool.query(
      `INSERT INTO decisions (id, organization_id, user_id, title, description, status, category, department, budget, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
      [randomUUID(), orgId, userId, ...d]
    );
  }
  
  console.log('\n✓ Cleaned and inserted 8 unique marketing decisions\n');
  
  // Verify
  const result = await pool.query('SELECT title, status, budget FROM decisions ORDER BY budget DESC');
  result.rows.forEach((r: any) => console.log(`  • ${r.title} [${r.status}] $${(r.budget/1000000).toFixed(1)}M`));
  
  await pool.end();
}

cleanAndSeed();
