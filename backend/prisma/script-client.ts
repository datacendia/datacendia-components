// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
/**
 * Prisma client for standalone scripts: seeds and maintenance tasks.
 *
 * Prisma 7 connects only through a driver adapter and no longer reads .env on
 * its own, so a PrismaClient built without an adapter throws at the first
 * query. This mirrors src/config/database.ts, except that the adapter owns its
 * pool, so `$disconnect()` closes it and the script can exit.
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

export function createScriptClient(): PrismaClient {
  const connectionString =
    process.env['DATABASE_URL'] ||
    'postgresql://datacendia:datacendia_secure_2024@localhost:5433/datacendia';
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}
