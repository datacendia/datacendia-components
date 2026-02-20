import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://datacendia:datacendia_secure_2024@localhost:5433/datacendia',
});

async function main() {
  try {
    // First: what columns exist on deliberations?
    const cols = await pool.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'deliberations' ORDER BY ordinal_position`
    );
    console.log('Deliberation columns:', cols.rows.map((r: any) => r.column_name).join(', '));

    // All deliberations
    const allResult = await pool.query(`SELECT COUNT(*) as cnt FROM deliberations`);
    console.log(`\nTotal deliberations: ${allResult.rows[0].cnt}`);

    // Completed ones
    const completedResult = await pool.query(
      `SELECT * FROM deliberations WHERE status = 'COMPLETED' ORDER BY created_at DESC LIMIT 5`
    );
    console.log(`Completed deliberations: ${completedResult.rows.length}\n`);
    for (const row of completedResult.rows) {
      console.log(`  ID: ${row.id}`);
      console.log(`  Q:  ${(row.question || '').substring(0, 100)}`);
      console.log(`  Status: ${row.status}`);
      console.log(`  Created: ${row.created_at}`);
      console.log('');
    }

    // If none completed, show all statuses
    if (completedResult.rows.length === 0) {
      const statusResult = await pool.query(`SELECT status, COUNT(*) as cnt FROM deliberations GROUP BY status`);
      console.log('Deliberation statuses:', JSON.stringify(statusResult.rows));
    }

    // Check what related tables exist
    const tables = await pool.query(
      `SELECT table_name FROM information_schema.tables 
       WHERE table_schema = 'public' 
       AND (table_name LIKE '%agent%' OR table_name LIKE '%response%' OR table_name LIKE '%deliberation%' OR table_name LIKE '%message%' OR table_name LIKE '%council%')
       ORDER BY table_name`
    );
    console.log('Related tables:', tables.rows.map((r: any) => r.table_name).join(', '));

    // Check the full deliberation data
    const fullDel = await pool.query(`SELECT * FROM deliberations WHERE status = 'COMPLETED' LIMIT 1`);
    if (fullDel.rows.length > 0) {
      const d = fullDel.rows[0];
      console.log('\nFull deliberation data:');
      console.log('  decision:', JSON.stringify(d.decision)?.substring(0, 200));
      console.log('  confidence:', d.confidence);
      console.log('  config:', JSON.stringify(d.config)?.substring(0, 200));
      console.log('  mode:', d.mode);
      console.log('  progress:', d.progress);
      console.log('  completed_at:', d.completed_at);
    }
    // Schema for deliberation_messages
    const msgCols = await pool.query(
      `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'deliberation_messages' ORDER BY ordinal_position`
    );
    console.log('\ndeliberation_messages columns:');
    for (const c of msgCols.rows) console.log(`  ${c.column_name} (${c.data_type})`);

    // Sample 3 messages
    const msgs = await pool.query(
      `SELECT * FROM deliberation_messages WHERE deliberation_id = '4f555f21-64c2-45ac-b26d-8b9933e87575' ORDER BY created_at LIMIT 3`
    );
    console.log(`\nSample messages (${msgs.rows.length}):`);
    for (const m of msgs.rows) {
      console.log(JSON.stringify(m, null, 2));
    }

    // Schema for dissents table
    const dissentCols = await pool.query(
      `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'dissents' ORDER BY ordinal_position`
    );
    console.log('\ndissents columns:');
    for (const c of dissentCols.rows) console.log(`  ${c.column_name} (${c.data_type})`);

    // Check agents table
    const agentCols = await pool.query(
      `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'agents' ORDER BY ordinal_position`
    );
    console.log('\nagents columns:');
    for (const c of agentCols.rows) console.log(`  ${c.column_name} (${c.data_type})`);

    // Count agents
    const agentCount = await pool.query(`SELECT COUNT(*) as cnt FROM agents`);
    console.log(`Total agents in DB: ${agentCount.rows[0].cnt}`);
  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

main();
