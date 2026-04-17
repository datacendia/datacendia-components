/**
 * List all users in the dev database with their role and organization.
 * Password hashes are NOT shown — you need to know the password, or reset it.
 *
 * Usage (from backend/ folder):
 *   npx tsx scripts/list-users.ts
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString =
  process.env['DATABASE_URL'] ||
  'postgresql://datacendia:datacendia_secure_2024@localhost:5433/datacendia';
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  const users = await prisma.users.findMany({
    select: {
      email: true,
      name: true,
      role: true,
      status: true,
      created_at: true,
      organizations: { select: { name: true } },
    },
    orderBy: { created_at: 'asc' },
  });

  console.log(`\nFound ${users.length} user account(s):\n`);
  for (const u of users) {
    const created = u.created_at.toISOString().slice(0, 10);
    const org = u.organizations?.name ?? '(no org)';
    console.log(`  ${u.email.padEnd(38)} ${(u.role ?? '').padEnd(10)} ${(u.status ?? '').padEnd(10)} ${created}  [${org}]  ${u.name ?? ''}`);
  }
  console.log('');
}

main()
  .catch((err) => { console.error('Failed:', err); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
