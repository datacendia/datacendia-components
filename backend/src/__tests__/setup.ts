/**
 * =============================================================================
 * TEST SETUP & CONFIGURATION
 * =============================================================================
 */

import { beforeAll, afterAll } from 'vitest';

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-testing-only';
process.env.LOG_LEVEL = 'error'; // Suppress logs during tests

// Global test timeout
beforeAll(() => {
  // Setup code
});

afterAll(() => {
  // Cleanup code
});
