import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://datacendia:datacendia_secure_2024@localhost:5433/datacendia',
});

async function main() {
  try {
    // First check columns
    const cols = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'users' ORDER BY ordinal_position`);
    console.log('User columns:', cols.rows.map((r: any) => r.column_name).join(', '));

    const result = await pool.query(
      `SELECT * FROM users WHERE email LIKE '%stuart%' OR email LIKE '%admin%' LIMIT 10`
    );
    console.log(`\nMatching users: ${result.rows.length}`);
    for (const u of result.rows) {
      console.log(`  Email: ${u.email}`);
      console.log(`  Role: ${u.role}`);
      console.log(`  Hash prefix: ${u.password_hash?.substring(0, 30)}...`);
      console.log('');
    }

    // All users
    const allUsers = await pool.query(`SELECT email, role FROM users ORDER BY created_at LIMIT 20`);
    console.log('All users:');
    for (const u of allUsers.rows) {
      console.log(`  ${u.email} | ${u.role}`);
    }
  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

main();
