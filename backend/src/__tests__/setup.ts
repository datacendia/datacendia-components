/**
 * =============================================================================
 * TEST SETUP & CONFIGURATION
 * =============================================================================
 */

import { beforeAll, afterAll } from 'vitest';

// Set test environment - MUST be before any imports that use config
process.env['NODE_ENV'] = 'test';
// Use port 5434 to match .env (cendia-postgres-5434 container)
process.env['DATABASE_URL'] = 'postgresql://cendia:cendia_sovereign_2025@localhost:5434/datacendia';
process.env['REDIS_URL'] = process.env['REDIS_URL'] || 'redis://localhost:6379';
process.env['NEO4J_URI'] = process.env['NEO4J_URI'] || 'bolt://localhost:7687';
process.env['NEO4J_USER'] = process.env['NEO4J_USER'] || 'neo4j';
process.env['NEO4J_PASSWORD'] = process.env['NEO4J_PASSWORD'] || 'password';
process.env['JWT_SECRET'] = process.env['JWT_SECRET'] || 'test-secret-key-minimum-32-characters-long';
process.env['LOG_LEVEL'] = 'error'; // Suppress logs during tests

// Global test timeout
beforeAll(() => {
  // Setup code
});

afterAll(() => {
  // Cleanup code
});
