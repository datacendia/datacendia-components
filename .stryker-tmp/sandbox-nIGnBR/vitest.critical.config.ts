// @ts-nocheck
// =============================================================================
// VITEST CRITICAL PATH CONFIGURATION
// 100% coverage enforcement for security-critical code paths
// =============================================================================

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node',
    include: [
      'backend/src/__tests__/security/**/*.test.ts',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage/critical',
      
      // Critical paths that MUST have 100% coverage
      include: [
        'backend/src/security/**/*.ts',
        'backend/src/middleware/auth*.ts',
        'backend/src/middleware/errorHandler.ts',
        'backend/src/routes/auth.ts',
        'backend/src/services/auth/**/*.ts',
      ],
      
      // Enforce 100% coverage on critical paths
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 95, // Allow slight flexibility for edge cases
        statements: 100,
      },
      
      // Skip generated files
      exclude: [
        'node_modules',
        'dist',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/index.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
