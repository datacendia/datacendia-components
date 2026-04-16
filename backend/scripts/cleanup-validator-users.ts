/**
 * One-shot cleanup for orphaned test users created by earlier runs of
 * scripts/validate-wiring.ps1 (before it became idempotent).
 *
 * Matches:
 *   - validator-*@test.com      (legacy random-suffix pattern)
 *   - validator@test.com        (legacy first-run pattern)
 *
 * Does NOT match the new fixed-account pattern:
 *   - validator@datacendia-test.com  (current reusable validator)
 *
 * Usage (from backend/ folder):
 *   npx tsx scripts/cleanup-validator-users.ts
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
  // Find candidate users (orphaned from early validation script runs)
  const candidates = await prisma.users.findMany({
    where: {
      OR: [
        { email: { startsWith: 'validator-', endsWith: '@test.com' } },
        { email: 'validator@test.com' },
      ],
    },
    select: { id: true, email: true, organization_id: true, name: true },
  });

  if (candidates.length === 0) {
    console.log('No orphaned validator-* users found. Nothing to clean up.');
    return;
  }

  console.log(`Found ${candidates.length} orphaned validator users:`);
  for (const u of candidates) {
    console.log(`  - ${u.email} (id=${u.id}, org=${u.organization_id})`);
  }

  // Collect their organization IDs — these are disposable TestOrg-* orgs
  // created by early runs of the validation script (one org per user, since
  // registration creates a fresh org each time).
  const orgIds = [...new Set(candidates.map(c => c.organization_id))];
  const userIds = candidates.map(c => c.id);

  // Delete sessions, then users, then empty orgs. We order the deletes so
  // foreign key constraints are respected. For each step we tolerate missing
  // tables (some deployments may not have every relation).
  console.log('\nDeleting dependent rows and users…');

  const tryDelete = async (label: string, fn: () => Promise<unknown>) => {
    try {
      const res = await fn();
      console.log(`  ✓ ${label}: ${JSON.stringify(res)}`);
    } catch (err: unknown) {
      // Prisma throws if the relation doesn't exist in this deployment —
      // tolerate it and continue.
      console.log(`  — ${label}: skipped (${(err as Error).message.split('\n')[0]})`);
    }
  };

  await tryDelete('sessions', () =>
    prisma.sessions.deleteMany({ where: { user_id: { in: userIds } } }),
  );
  await tryDelete('password_resets', () =>
    prisma.password_resets.deleteMany({ where: { user_id: { in: userIds } } }),
  );
  await tryDelete('email_verifications', () =>
    prisma.email_verifications.deleteMany({ where: { user_id: { in: userIds } } }),
  );

  const userDel = await prisma.users.deleteMany({ where: { id: { in: userIds } } });
  console.log(`  ✓ users: ${userDel.count} deleted`);

  // Delete orgs that were created solely for these validators, only if they
  // are now empty (no remaining users).
  let orgDeleted = 0;
  for (const orgId of orgIds) {
    const remaining = await prisma.users.count({ where: { organization_id: orgId } });
    if (remaining === 0) {
      try {
        await prisma.organizations.delete({ where: { id: orgId } });
        orgDeleted++;
      } catch (err) {
        console.log(`  — org ${orgId}: could not delete (${(err as Error).message.split('\n')[0]})`);
      }
    }
  }
  console.log(`  ✓ organizations: ${orgDeleted} deleted (only those with no remaining users)`);

  console.log('\nCleanup complete.');
}

main()
  .catch((err) => {
    console.error('Cleanup failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
