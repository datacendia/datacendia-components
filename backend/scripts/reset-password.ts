import pg from 'pg';
import bcrypt from 'bcryptjs';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://datacendia:datacendia_secure_2024@localhost:5433/datacendia',
});

async function main() {
  try {
    const ownerHash = await bcrypt.hash('DatacendiaOwner2024!', 12);
    const adminHash = await bcrypt.hash('DatacendiaAdmin2024!', 12);

    const r1 = await pool.query(
      `UPDATE users SET password_hash = $1 WHERE email = 'stuart.rainey@datacendia.com' RETURNING email`,
      [ownerHash]
    );
    console.log(`Updated stuart.rainey@datacendia.com: ${r1.rowCount} row(s)`);

    const r2 = await pool.query(
      `UPDATE users SET password_hash = $1 WHERE email = 'admin@datacendia.com' RETURNING email`,
      [adminHash]
    );
    console.log(`Updated admin@datacendia.com: ${r2.rowCount} row(s)`);

    // Verify
    const verify = await pool.query(`SELECT email, password_hash FROM users WHERE email IN ('stuart.rainey@datacendia.com', 'admin@datacendia.com')`);
    for (const u of verify.rows) {
      const match = await bcrypt.compare(
        u.email === 'stuart.rainey@datacendia.com' ? 'DatacendiaOwner2024!' : 'DatacendiaAdmin2024!',
        u.password_hash
      );
      console.log(`  ${u.email}: password match = ${match}`);
    }
  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

main();
