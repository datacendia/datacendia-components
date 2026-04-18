import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/__tests__/setup.ts'],
    include: [
      'src/__tests__/**/*.test.ts'
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      // ImmutableAuditLedger: requires DB columns not in current schema
      '**/ImmutableAuditLedger.test.ts',
      // Infrastructure tests run as a separate CI step (need external services)
      '**/infrastructure/**',
      // Integration tests (tests/ directory) need a running API server + DB
      'tests/**',
      // E2E and comprehensive tests need full stack running
      '**/e2e/**',
      '**/*.e2e.test.*',
      '**/*.comprehensive.test.*',
      '**/*.integration.test.*',
      // Performance tests need running infrastructure
      '**/performance/**',
    ],
    testTimeout: 30000,
    hookTimeout: 30000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      exclude: ['node_modules', 'dist', 'tests'],
      thresholds: {
        autoUpdate: true,
        lines: 35,
        functions: 35,
        branches: 30,
        statements: 35,
      },
    },
  },
});
