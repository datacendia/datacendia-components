// =============================================================================
// VITEST CONFIGURATION - Frontend & Unit Tests
// =============================================================================

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: [
      'tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    // tests/ai-validation and tests/integration call a running API or model and
    // fail without one; they run with `npm run test:live` (vitest.live.config.ts).
    exclude: ['node_modules', 'dist', 'e2e', '**/tests/e2e/**', 'tests/ai-validation/**', 'tests/integration/**'],
    // Backend modules the vertical and backend tests import validate these at
    // load; same values as the backend CI job. Nothing here connects to them.
    env: {
      DATABASE_URL: 'postgresql://datacendia:datacendia_test@localhost:5432/datacendia_test',
      REDIS_URL: 'redis://localhost:6379',
      JWT_SECRET: 'test-secret-key-for-ci-minimum-32-chars',
      JWT_REFRESH_SECRET: 'test-refresh-secret-for-ci-minimum-32-chars',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'src/lib/**/*.{ts,tsx}',
        'src/hooks/**/*.{ts,tsx}',
        'src/stores/**/*.{ts,tsx}',
        'src/utils/**/*.{ts,tsx}',
        'src/components/**/*.{ts,tsx}',
        'src/contexts/**/*.{ts,tsx}',
        'src/services/**/*.{ts,tsx}',
        'src/config/**/*.{ts,tsx}',
        'src/pages/**/*.{ts,tsx}',
        'src/layouts/**/*.{ts,tsx}',
      ],
      exclude: [
        'node_modules/',
        'tests/',
        'backend/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/*.test.*',
        '**/*.spec.*',
      ],
    },
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
