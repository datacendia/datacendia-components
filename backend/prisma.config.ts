import 'dotenv/config';
import path from 'node:path';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  // Relative to this file. __dirname isn't defined when Prisma loads the
  // config as ESM, which broke every CLI command on Windows.
  schema: path.join('prisma', 'schema'),
  datasource: {
    // Optional here so `npm ci` (prisma generate) works on a fresh clone with no
    // database configured; migrate and db commands still require it.
    url: process.env['DATABASE_URL'] ?? '',
  },
});
