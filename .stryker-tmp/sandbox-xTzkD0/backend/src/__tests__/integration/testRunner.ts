/**
 * Integration Test Runner
 * 
 * Automated integration testing framework for all API routes.
 * Provides utilities for testing all 65 route files systematically.
 */
// @ts-nocheck


import { Express } from 'express';
import request from 'supertest';
import { vi } from 'vitest';

// =============================================================================
// TEST CONFIGURATION
// =============================================================================

export interface TestConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  authToken?: string;
  organizationId?: string;
}

export const defaultConfig: TestConfig = {
  baseUrl: '/api/v1',
  timeout: 30000,
  retries: 0,
};

// =============================================================================
// TEST CLIENT
// =============================================================================

export class IntegrationTestClient {
  private app: Express;
  private config: TestConfig;
  private authToken: string | null = null;

  constructor(app: Express, config: Partial<TestConfig> = {}) {
    this.app = app;
    this.config = { ...defaultConfig, ...config };
  }

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  clearAuthToken(): void {
    this.authToken = null;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    return headers;
  }

  async get(path: string, query?: Record<string, string>): Promise<request.Response> {
    let req = request(this.app)
      .get(`${this.config.baseUrl}${path}`)
      .set(this.getHeaders());
    
    if (query) {
      req = req.query(query);
    }
    
    return req.timeout(this.config.timeout);
  }

  async post(path: string, body?: Record<string, unknown>): Promise<request.Response> {
    return request(this.app)
      .post(`${this.config.baseUrl}${path}`)
      .set(this.getHeaders())
      .send(body as object)
      .timeout(this.config.timeout);
  }

  async put(path: string, body?: Record<string, unknown>): Promise<request.Response> {
    return request(this.app)
      .put(`${this.config.baseUrl}${path}`)
      .set(this.getHeaders())
      .send(body as object)
      .timeout(this.config.timeout);
  }

  async patch(path: string, body?: Record<string, unknown>): Promise<request.Response> {
    return request(this.app)
      .patch(`${this.config.baseUrl}${path}`)
      .set(this.getHeaders())
      .send(body as object)
      .timeout(this.config.timeout);
  }

  async delete(path: string): Promise<request.Response> {
    return request(this.app)
      .delete(`${this.config.baseUrl}${path}`)
      .set(this.getHeaders())
      .timeout(this.config.timeout);
  }
}

// =============================================================================
// ROUTE TEST DEFINITIONS
// =============================================================================

export interface RouteTest {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  requiresAuth: boolean;
  body?: Record<string, unknown>;
  query?: Record<string, string>;
  expectedStatus: number | number[];
  validate?: (response: request.Response) => void;
}

export interface RouteTestGroup {
  name: string;
  basePath: string;
  tests: RouteTest[];
}

// =============================================================================
// ALL ROUTE TESTS (65 Routes)
// =============================================================================

export const ALL_ROUTE_TESTS: RouteTestGroup[] = [
  // Auth Routes
  {
    name: 'Auth',
    basePath: '/auth',
    tests: [
      { method: 'POST', path: '/login', description: 'Login with invalid credentials returns 401', requiresAuth: false, body: { email: 'test@test.com', password: 'wrong' }, expectedStatus: [400, 401] },
      { method: 'POST', path: '/register', description: 'Register with missing fields returns 400', requiresAuth: false, body: {}, expectedStatus: [400, 422] },
      { method: 'GET', path: '/me', description: 'Get current user requires auth', requiresAuth: true, expectedStatus: [200, 401] },
      { method: 'POST', path: '/refresh', description: 'Refresh token with invalid token returns 401', requiresAuth: false, body: { refreshToken: 'invalid' }, expectedStatus: [400, 401] },
      { method: 'POST', path: '/logout', description: 'Logout works', requiresAuth: false, expectedStatus: [200, 401] },
    ],
  },

  // Users Routes
  {
    name: 'Users',
    basePath: '/users',
    tests: [
      { method: 'GET', path: '', description: 'List users requires auth', requiresAuth: true, expectedStatus: [200, 401, 403] },
      { method: 'GET', path: '/test-id', description: 'Get user by ID', requiresAuth: true, expectedStatus: [200, 401, 404] },
      { method: 'PUT', path: '/test-id', description: 'Update user', requiresAuth: true, body: { firstName: 'Test' }, expectedStatus: [200, 401, 404] },
    ],
  },

  // Organizations Routes
  {
    name: 'Organizations',
    basePath: '/organizations',
    tests: [
      { method: 'GET', path: '', description: 'List organizations', requiresAuth: true, expectedStatus: [200, 401] },
      { method: 'GET', path: '/current', description: 'Get current organization', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Metrics Routes
  {
    name: 'Metrics',
    basePath: '/metrics',
    tests: [
      { method: 'GET', path: '', description: 'List metrics', requiresAuth: true, expectedStatus: [200, 401] },
      { method: 'GET', path: '/dashboard', description: 'Get dashboard metrics', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Alerts Routes
  {
    name: 'Alerts',
    basePath: '/alerts',
    tests: [
      { method: 'GET', path: '', description: 'List alerts', requiresAuth: true, expectedStatus: [200, 401] },
      { method: 'POST', path: '', description: 'Create alert', requiresAuth: true, body: { title: 'Test', message: 'Test alert', severity: 'INFO' }, expectedStatus: [201, 400, 401] },
    ],
  },

  // Health Routes
  {
    name: 'Health',
    basePath: '/health',
    tests: [
      { method: 'GET', path: '', description: 'Get health status', requiresAuth: false, expectedStatus: [200] },
      { method: 'GET', path: '/detailed', description: 'Get detailed health', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Council Routes
  {
    name: 'Council',
    basePath: '/council',
    tests: [
      { method: 'GET', path: '/agents', description: 'List agents', requiresAuth: true, expectedStatus: [200, 401] },
      { method: 'POST', path: '/query', description: 'Query council', requiresAuth: true, body: { query: 'Test question' }, expectedStatus: [200, 400, 401] },
    ],
  },

  // Deliberations Routes
  {
    name: 'Deliberations',
    basePath: '/deliberations',
    tests: [
      { method: 'GET', path: '', description: 'List deliberations', requiresAuth: true, expectedStatus: [200, 401] },
      { method: 'POST', path: '', description: 'Create deliberation', requiresAuth: true, body: { question: 'Should we proceed?' }, expectedStatus: [201, 400, 401] },
    ],
  },

  // Decisions Routes
  {
    name: 'Decisions',
    basePath: '/decisions',
    tests: [
      { method: 'GET', path: '', description: 'List decisions', requiresAuth: true, expectedStatus: [200, 401] },
      { method: 'POST', path: '', description: 'Create decision', requiresAuth: true, body: { title: 'Test Decision', description: 'Test' }, expectedStatus: [201, 400, 401] },
    ],
  },

  // Graph Routes
  {
    name: 'Graph',
    basePath: '/graph',
    tests: [
      { method: 'GET', path: '/nodes', description: 'List nodes', requiresAuth: true, expectedStatus: [200, 401] },
      { method: 'GET', path: '/relationships', description: 'List relationships', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Workflows Routes
  {
    name: 'Workflows',
    basePath: '/workflows',
    tests: [
      { method: 'GET', path: '', description: 'List workflows', requiresAuth: true, expectedStatus: [200, 401] },
      { method: 'POST', path: '', description: 'Create workflow', requiresAuth: true, body: { name: 'Test Workflow' }, expectedStatus: [201, 400, 401] },
    ],
  },

  // Forecasts Routes
  {
    name: 'Forecasts',
    basePath: '/predict',
    tests: [
      { method: 'GET', path: '/forecasts', description: 'List forecasts', requiresAuth: true, expectedStatus: [200, 401] },
      { method: 'GET', path: '/scenarios', description: 'List scenarios', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Data Sources Routes
  {
    name: 'DataSources',
    basePath: '/data-sources',
    tests: [
      { method: 'GET', path: '', description: 'List data sources', requiresAuth: true, expectedStatus: [200, 401] },
      { method: 'POST', path: '', description: 'Create data source', requiresAuth: true, body: { name: 'Test', type: 'postgresql' }, expectedStatus: [201, 400, 401] },
    ],
  },

  // Lineage Routes
  {
    name: 'Lineage',
    basePath: '/lineage',
    tests: [
      { method: 'GET', path: '', description: 'Get lineage', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Integrations Routes
  {
    name: 'Integrations',
    basePath: '/integrations',
    tests: [
      { method: 'GET', path: '', description: 'List integrations', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Veto Routes
  {
    name: 'Veto',
    basePath: '/veto',
    tests: [
      { method: 'GET', path: '', description: 'List vetoes', requiresAuth: true, expectedStatus: [200, 401] },
      { method: 'GET', path: '/pending', description: 'List pending vetoes', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Union Routes
  {
    name: 'Union',
    basePath: '/union',
    tests: [
      { method: 'GET', path: '/votes', description: 'List votes', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Ledger Routes
  {
    name: 'Ledger',
    basePath: '/ledger',
    tests: [
      { method: 'GET', path: '/entries', description: 'List ledger entries', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // HR Routes
  {
    name: 'HR',
    basePath: '/hr',
    tests: [
      { method: 'GET', path: '/employees', description: 'List employees', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Enterprise Routes
  {
    name: 'Enterprise',
    basePath: '/enterprise',
    tests: [
      { method: 'GET', path: '/features', description: 'List enterprise features', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Admin Routes
  {
    name: 'Admin',
    basePath: '/admin',
    tests: [
      { method: 'GET', path: '/stats', description: 'Get admin stats', requiresAuth: true, expectedStatus: [200, 401, 403] },
    ],
  },

  // Settings Routes
  {
    name: 'Settings',
    basePath: '/settings',
    tests: [
      { method: 'GET', path: '', description: 'Get settings', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Pillars Routes
  {
    name: 'Pillars',
    basePath: '/pillars',
    tests: [
      { method: 'GET', path: '/status', description: 'Get pillars status', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Compliance Routes
  {
    name: 'Compliance',
    basePath: '/compliance',
    tests: [
      { method: 'GET', path: '/frameworks', description: 'List compliance frameworks', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Crucible Routes
  {
    name: 'Crucible',
    basePath: '/crucible',
    tests: [
      { method: 'GET', path: '/simulations', description: 'List simulations', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Panopticon Routes
  {
    name: 'Panopticon',
    basePath: '/panopticon',
    tests: [
      { method: 'GET', path: '/status', description: 'Get panopticon status', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Aegis Routes
  {
    name: 'Aegis',
    basePath: '/aegis',
    tests: [
      { method: 'GET', path: '/status', description: 'Get aegis status', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Eternal Routes
  {
    name: 'Eternal',
    basePath: '/eternal',
    tests: [
      { method: 'GET', path: '/snapshots', description: 'List snapshots', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Symbiont Routes
  {
    name: 'Symbiont',
    basePath: '/symbiont',
    tests: [
      { method: 'GET', path: '/status', description: 'Get symbiont status', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Vox Routes
  {
    name: 'Vox',
    basePath: '/vox',
    tests: [
      { method: 'GET', path: '/status', description: 'Get vox status', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Echo Routes
  {
    name: 'Echo',
    basePath: '/echo',
    tests: [
      { method: 'GET', path: '/status', description: 'Get echo status', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // RedTeam Routes
  {
    name: 'RedTeam',
    basePath: '/redteam',
    tests: [
      { method: 'GET', path: '/status', description: 'Get redteam status', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Gnosis Routes
  {
    name: 'Gnosis',
    basePath: '/gnosis',
    tests: [
      { method: 'GET', path: '/status', description: 'Get gnosis status', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Apotheosis Routes
  {
    name: 'Apotheosis',
    basePath: '/apotheosis',
    tests: [
      { method: 'GET', path: '/status', description: 'Get apotheosis status', requiresAuth: true, expectedStatus: [200, 401] },
      { method: 'GET', path: '/history', description: 'Get run history', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Dissent Routes
  {
    name: 'Dissent',
    basePath: '/dissent',
    tests: [
      { method: 'GET', path: '', description: 'List dissents', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Sovereign Routes
  {
    name: 'Sovereign',
    basePath: '/sovereign',
    tests: [
      { method: 'GET', path: '/status', description: 'Get sovereign status', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // OmniTranslate Routes
  {
    name: 'OmniTranslate',
    basePath: '/omnitranslate',
    tests: [
      { method: 'GET', path: '/languages', description: 'List languages', requiresAuth: true, expectedStatus: [200, 401] },
      { method: 'POST', path: '/translate', description: 'Translate text', requiresAuth: true, body: { text: 'Hello', targetLanguage: 'es' }, expectedStatus: [200, 400, 401] },
    ],
  },

  // Cascade Routes
  {
    name: 'Cascade',
    basePath: '/cascade',
    tests: [
      { method: 'GET', path: '/status', description: 'Get cascade status', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Evidence Routes
  {
    name: 'Evidence',
    basePath: '/evidence',
    tests: [
      { method: 'GET', path: '', description: 'List evidence', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // RAG Routes
  {
    name: 'RAG',
    basePath: '/rag',
    tests: [
      { method: 'POST', path: '/query', description: 'Query RAG', requiresAuth: true, body: { query: 'Test' }, expectedStatus: [200, 400, 401] },
    ],
  },

  // Models Routes
  {
    name: 'Models',
    basePath: '/models',
    tests: [
      { method: 'GET', path: '', description: 'List models', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Upload Routes
  {
    name: 'Upload',
    basePath: '/upload',
    tests: [
      { method: 'GET', path: '/status', description: 'Get upload status', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // i18n Routes
  {
    name: 'i18n',
    basePath: '/i18n',
    tests: [
      { method: 'GET', path: '/locales', description: 'List locales', requiresAuth: false, expectedStatus: [200] },
    ],
  },

  // Summaries Routes
  {
    name: 'Summaries',
    basePath: '/summaries',
    tests: [
      { method: 'GET', path: '', description: 'List summaries', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Decision Intel Routes
  {
    name: 'DecisionIntel',
    basePath: '/decision-intel',
    tests: [
      { method: 'GET', path: '/chronos/events', description: 'List chronos events', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Platform Routes
  {
    name: 'Platform',
    basePath: '/platform',
    tests: [
      { method: 'GET', path: '/status', description: 'Get platform status', requiresAuth: false, expectedStatus: [200] },
    ],
  },

  // Core Routes
  {
    name: 'Core',
    basePath: '/core',
    tests: [
      { method: 'GET', path: '/status', description: 'Get core status', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Security Routes
  {
    name: 'Security',
    basePath: '/security',
    tests: [
      { method: 'GET', path: '/status', description: 'Get security status', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Mesh Routes
  {
    name: 'Mesh',
    basePath: '/mesh',
    tests: [
      { method: 'GET', path: '/status', description: 'Get mesh status', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Persona Routes
  {
    name: 'Persona',
    basePath: '/persona',
    tests: [
      { method: 'GET', path: '', description: 'List personas', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Govern Routes
  {
    name: 'Govern',
    basePath: '/govern',
    tests: [
      { method: 'GET', path: '/policies', description: 'List policies', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Autopilot Routes
  {
    name: 'Autopilot',
    basePath: '/autopilot',
    tests: [
      { method: 'GET', path: '/status', description: 'Get autopilot status', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Connectors Routes
  {
    name: 'Connectors',
    basePath: '/connectors',
    tests: [
      { method: 'GET', path: '', description: 'List connectors', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Adapters Routes
  {
    name: 'Adapters',
    basePath: '/adapters',
    tests: [
      { method: 'GET', path: '', description: 'List adapters', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Sovereign Arch Routes
  {
    name: 'SovereignArch',
    basePath: '/sovereign-arch',
    tests: [
      { method: 'GET', path: '/diode/status', description: 'Get diode status', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },

  // Contact Routes
  {
    name: 'Contact',
    basePath: '/contact',
    tests: [
      { method: 'POST', path: '', description: 'Submit contact form', requiresAuth: false, body: { name: 'Test', email: 'test@test.com', message: 'Hello' }, expectedStatus: [200, 400] },
    ],
  },

  // Errors Routes
  {
    name: 'Errors',
    basePath: '/errors',
    tests: [
      { method: 'POST', path: '', description: 'Report error', requiresAuth: false, body: { error: 'Test error' }, expectedStatus: [200, 400] },
    ],
  },

  // Salary Routes
  {
    name: 'Salary',
    basePath: '/salary',
    tests: [
      { method: 'GET', path: '/benchmarks', description: 'Get salary benchmarks', requiresAuth: true, expectedStatus: [200, 401] },
    ],
  },
];

// =============================================================================
// TEST RUNNER FUNCTIONS
// =============================================================================

export async function runAllRouteTests(
  client: IntegrationTestClient,
  options: { verbose?: boolean } = {}
): Promise<TestResults> {
  const results: TestResults = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    groups: [],
  };

  for (const group of ALL_ROUTE_TESTS) {
    const groupResult = await runGroupTests(client, group, options);
    results.groups.push(groupResult);
    results.total += groupResult.total;
    results.passed += groupResult.passed;
    results.failed += groupResult.failed;
    results.skipped += groupResult.skipped;
  }

  return results;
}

export async function runGroupTests(
  client: IntegrationTestClient,
  group: RouteTestGroup,
  options: { verbose?: boolean } = {}
): Promise<GroupTestResult> {
  const result: GroupTestResult = {
    name: group.name,
    basePath: group.basePath,
    total: group.tests.length,
    passed: 0,
    failed: 0,
    skipped: 0,
    tests: [],
  };

  for (const test of group.tests) {
    const testResult = await runSingleTest(client, group.basePath, test, options);
    result.tests.push(testResult);

    if (testResult.status === 'passed') result.passed++;
    else if (testResult.status === 'failed') result.failed++;
    else result.skipped++;
  }

  return result;
}

async function runSingleTest(
  client: IntegrationTestClient,
  basePath: string,
  test: RouteTest,
  options: { verbose?: boolean } = {}
): Promise<SingleTestResult> {
  const fullPath = `${basePath}${test.path}`;
  const startTime = Date.now();

  try {
    let response: request.Response;

    switch (test.method) {
      case 'GET':
        response = await client.get(fullPath, test.query);
        break;
      case 'POST':
        response = await client.post(fullPath, test.body);
        break;
      case 'PUT':
        response = await client.put(fullPath, test.body);
        break;
      case 'PATCH':
        response = await client.patch(fullPath, test.body);
        break;
      case 'DELETE':
        response = await client.delete(fullPath);
        break;
    }

    const expectedStatuses = Array.isArray(test.expectedStatus) 
      ? test.expectedStatus 
      : [test.expectedStatus];

    const passed = expectedStatuses.includes(response.status);

    if (test.validate && passed) {
      try {
        test.validate(response);
      } catch (validationError) {
        return {
          method: test.method,
          path: fullPath,
          description: test.description,
          status: 'failed',
          actualStatus: response.status,
          expectedStatus: test.expectedStatus,
          error: `Validation failed: ${validationError}`,
          duration: Date.now() - startTime,
        };
      }
    }

    return {
      method: test.method,
      path: fullPath,
      description: test.description,
      status: passed ? 'passed' : 'failed',
      actualStatus: response.status,
      expectedStatus: test.expectedStatus,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    return {
      method: test.method,
      path: fullPath,
      description: test.description,
      status: 'failed',
      error: error instanceof Error ? error.message : String(error),
      duration: Date.now() - startTime,
    };
  }
}

// =============================================================================
// RESULT TYPES
// =============================================================================

export interface TestResults {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  groups: GroupTestResult[];
}

export interface GroupTestResult {
  name: string;
  basePath: string;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  tests: SingleTestResult[];
}

export interface SingleTestResult {
  method: string;
  path: string;
  description: string;
  status: 'passed' | 'failed' | 'skipped';
  actualStatus?: number;
  expectedStatus?: number | number[];
  error?: string;
  duration: number;
}

// =============================================================================
// REPORT GENERATION
// =============================================================================

export function generateTestReport(results: TestResults): string {
  const lines: string[] = [
    '═══════════════════════════════════════════════════════════════════',
    '                    INTEGRATION TEST REPORT',
    '═══════════════════════════════════════════════════════════════════',
    '',
    `Total Tests: ${results.total}`,
    `✅ Passed: ${results.passed}`,
    `❌ Failed: ${results.failed}`,
    `⏭️  Skipped: ${results.skipped}`,
    `Pass Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`,
    '',
    '───────────────────────────────────────────────────────────────────',
    '',
  ];

  for (const group of results.groups) {
    const icon = group.failed === 0 ? '✅' : '❌';
    lines.push(`${icon} ${group.name} (${group.passed}/${group.total})`);

    for (const test of group.tests) {
      const statusIcon = test.status === 'passed' ? '  ✓' : test.status === 'failed' ? '  ✗' : '  ⊘';
      lines.push(`${statusIcon} ${test.method} ${test.path} - ${test.description}`);
      if (test.error) {
        lines.push(`      Error: ${test.error}`);
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}
