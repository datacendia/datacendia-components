// Copyright (c) 2024-2026 Datacendia, Inc. All Rights Reserved.
// See LICENSE file for details.

/**
 * =============================================================================
 * CENDIA GATEWAY — K6 LOAD TEST BASELINES
 * =============================================================================
 * Establishes performance baselines for the CendiaGateway AI Governance Proxy.
 * 
 * Endpoints tested:
 *   - GET  /api/v1/gateway/health     — Health check
 *   - GET  /api/v1/gateway/stats      — Dashboard statistics
 *   - POST /api/v1/gateway/test-pii   — PII detection scanner
 *   - POST /api/v1/gateway/v1/chat/completions — OpenAI-compatible proxy
 * 
 * Baselines (must pass for enterprise readiness):
 *   - p95 response time < 200ms for health/stats
 *   - p95 response time < 500ms for PII detection
 *   - Error rate < 1%
 * 
 * How to run:
 *   k6 run tests/load/k6-gateway-load-test.js
 *   k6 run --env API_URL=https://app.datacendia.com tests/load/k6-gateway-load-test.js
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const gatewayErrors = new Rate('gateway_errors');
const healthDuration = new Trend('health_duration');
const statsDuration = new Trend('stats_duration');
const piiDuration = new Trend('pii_scan_duration');
const proxyDuration = new Trend('proxy_duration');

export const options = {
  stages: [
    { duration: '30s', target: 20 },   // Warm up
    { duration: '2m', target: 50 },    // Steady state — 50 concurrent users
    { duration: '1m', target: 100 },   // Spike — 100 concurrent users
    { duration: '2m', target: 100 },   // Hold spike
    { duration: '30s', target: 0 },    // Cool down
  ],
  thresholds: {
    'health_duration': ['p(95)<200'],      // Health check: 95% under 200ms
    'stats_duration': ['p(95)<200'],       // Stats: 95% under 200ms
    'pii_scan_duration': ['p(95)<500'],    // PII detection: 95% under 500ms
    'http_req_failed': ['rate<0.01'],      // Less than 1% HTTP errors
    'gateway_errors': ['rate<0.05'],       // Less than 5% application errors
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3001';
const HEADERS = { 'Content-Type': 'application/json' };

// Sample prompts with varying PII content for realistic testing
const PROMPTS = [
  'Analyze the Q4 revenue projections for the EMEA region',
  'Please review John Smith\'s account. His SSN is 123-45-6789',
  'Send the report to jane@acme.com and cc finance@acme.com',
  'Transfer $50,000 from account 12345678 to the vendor',
  'The patient MRN#456789 needs a follow-up appointment',
  'Summarize the competitive landscape for AI governance tools',
  'Draft a response to the regulator regarding our AI usage policy',
  'Call the client at +1-555-123-4567 to discuss the proposal',
  'What are the implications of the EU AI Act Article 26 for deployers?',
  'Passport UK987654321 needs to be verified before onboarding',
];

export default function () {
  // ------------------------------------------------------------------
  // 1. Health Check (lightweight — should be <50ms)
  // ------------------------------------------------------------------
  group('Gateway Health', () => {
    const res = http.get(`${BASE_URL}/api/v1/gateway/health`);
    healthDuration.add(res.timings.duration);
    const ok = check(res, {
      'health: status 200': (r) => r.status === 200,
      'health: body has status': (r) => r.json('status') === 'healthy',
    });
    if (!ok) gatewayErrors.add(1);
    else gatewayErrors.add(0);
  });

  sleep(0.5);

  // ------------------------------------------------------------------
  // 2. Dashboard Statistics (read-heavy — should use pre-computed counters)
  // ------------------------------------------------------------------
  group('Gateway Stats', () => {
    const res = http.get(`${BASE_URL}/api/v1/gateway/stats`);
    statsDuration.add(res.timings.duration);
    const ok = check(res, {
      'stats: status 200': (r) => r.status === 200,
      'stats: has totalInteractions': (r) => r.json('totalInteractions') !== undefined,
    });
    if (!ok) gatewayErrors.add(1);
    else gatewayErrors.add(0);
  });

  sleep(0.5);

  // ------------------------------------------------------------------
  // 3. PII Detection Scanner (CPU-bound regex — the bottleneck test)
  // ------------------------------------------------------------------
  group('PII Scanner', () => {
    const prompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    const res = http.post(
      `${BASE_URL}/api/v1/gateway/test-pii`,
      JSON.stringify({ text: prompt }),
      { headers: HEADERS }
    );
    piiDuration.add(res.timings.duration);
    const ok = check(res, {
      'pii: status 200': (r) => r.status === 200,
      'pii: has hasPII field': (r) => r.json('hasPII') !== undefined,
      'pii: has scanDurationMs': (r) => r.json('scanDurationMs') !== undefined,
    });
    if (!ok) gatewayErrors.add(1);
    else gatewayErrors.add(0);
  });

  sleep(0.5);

  // ------------------------------------------------------------------
  // 4. Proxy Endpoint (will return 502 without real API key — that's OK,
  //    we're testing gateway overhead, not provider latency)
  // ------------------------------------------------------------------
  group('Proxy Overhead', () => {
    const res = http.post(
      `${BASE_URL}/api/v1/gateway/v1/chat/completions`,
      JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: PROMPTS[Math.floor(Math.random() * PROMPTS.length)] }],
      }),
      {
        headers: {
          ...HEADERS,
          'X-Gateway-User-Id': `load-test-user-${__VU}`,
          'X-Gateway-User-Email': `loadtest${__VU}@datacendia.com`,
          'X-Gateway-Department': 'engineering',
          'X-Gateway-Org-Id': 'load-test-org',
        },
      }
    );
    proxyDuration.add(res.timings.duration);
    // 403 = policy block (PII detected), 502 = no API key — both are expected
    const ok = check(res, {
      'proxy: responds (any status)': (r) => r.status > 0,
      'proxy: not 500': (r) => r.status !== 500,
    });
    if (!ok) gatewayErrors.add(1);
    else gatewayErrors.add(0);
  });

  sleep(1);
}
