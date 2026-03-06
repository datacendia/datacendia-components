/**
 * Module — Setup
 *
 * Platform module.
 * @module __tests__/setup
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * TEST SETUP & CONFIGURATION
 * =============================================================================
 */

import { beforeAll, afterAll } from 'vitest';

// Set test environment - MUST be before any imports that use config
process.env['NODE_ENV'] = 'test';
// Fallback defaults — DO NOT overwrite CI-provided env vars (port 5432 in CI, 5433 locally)
process.env['DATABASE_URL'] = process.env['DATABASE_URL'] || 'postgresql://datacendia:datacendia_secure_2024@localhost:5433/datacendia';
process.env['REDIS_URL'] = process.env['REDIS_URL'] || 'redis://:datacendia_redis_2024@localhost:6380';
process.env['NEO4J_URI'] = process.env['NEO4J_URI'] || 'bolt://localhost:7687';
process.env['NEO4J_USER'] = process.env['NEO4J_USER'] || 'neo4j';
process.env['NEO4J_PASSWORD'] = process.env['NEO4J_PASSWORD'] || 'datacendia_graph_2024';
process.env['JWT_SECRET'] = process.env['JWT_SECRET'] || 'test-secret-key-minimum-32-characters-long';
process.env['JWT_REFRESH_SECRET'] = process.env['JWT_REFRESH_SECRET'] || 'test-refresh-secret-minimum-32-characters-long';
process.env['LOG_LEVEL'] = process.env['LOG_LEVEL'] || 'error'; // Suppress logs during tests

// Global test timeout
beforeAll(() => {
  // Setup code
});

afterAll(() => {
  // Cleanup code
});
