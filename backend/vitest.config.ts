import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/__tests__/setup.ts'],
    include: [
      'tests/**/*.test.ts',
      'src/__tests__/**/*.test.ts'
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      // ImmutableAuditLedger: requires DB columns (entry_index, event_data, etc.)
      // not present in current schema; global vi.mock('crypto') leaks to other tests
      '**/ImmutableAuditLedger.test.ts',
      // Infrastructure tests run as a separate CI step (need external services)
      '**/infrastructure/**',
    ],
    testTimeout: 30000,
    hookTimeout: 30000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json', 'json-summary'],
      exclude: ['node_modules', 'dist', 'tests'],
      thresholds: {
        statements: 60,
        branches: 50,
        functions: 50,
        lines: 60,
      },
    },
  },
});
