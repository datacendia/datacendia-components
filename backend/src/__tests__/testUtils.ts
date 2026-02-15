// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Test Utilities - Shared testing infrastructure for backend services
 * 
 * Provides:
 * - Mock factories for common entities
 * - Test database utilities
 * - Service mocking helpers
 * - Assertion utilities
 */

import { PrismaClient } from '@prisma/client';
import { vi, expect } from 'vitest';
import { Result, ServiceError } from '../services/core/BaseService.js';

// =============================================================================
// MOCK PRISMA CLIENT
// =============================================================================

export function createMockPrismaClient() {
  return {
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $transaction: vi.fn((fn: (tx: unknown) => Promise<unknown>) => fn({})),
    
    // Add mock models as needed
    users: createMockModel(),
    organizations: createMockModel(),
    agents: createMockModel(),
    deliberations: createMockModel(),
    decisions: createMockModel(),
    alerts: createMockModel(),
    audit_logs: createMockModel(),
    data_sources: createMockModel(),
    workflows: createMockModel(),
    forecasts: createMockModel(),
  } as unknown as PrismaClient;
}

function createMockModel() {
  return {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    createMany: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
    upsert: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
    count: vi.fn(),
    aggregate: vi.fn(),
    groupBy: vi.fn(),
  };
}

// =============================================================================
// MOCK REDIS CLIENT
// =============================================================================

export function createMockRedisClient() {
  const store = new Map<string, string>();
  
  return {
    get: vi.fn((key: string) => Promise.resolve(store.get(key) ?? null)),
    set: vi.fn((key: string, value: string) => {
      store.set(key, value);
      return Promise.resolve('OK');
    }),
    setex: vi.fn((key: string, _ttl: number, value: string) => {
      store.set(key, value);
      return Promise.resolve('OK');
    }),
    del: vi.fn((key: string) => {
      store.delete(key);
      return Promise.resolve(1);
    }),
    exists: vi.fn((key: string) => Promise.resolve(store.has(key) ? 1 : 0)),
    expire: vi.fn(() => Promise.resolve(1)),
    ttl: vi.fn(() => Promise.resolve(-1)),
    keys: vi.fn((pattern: string) => {
      const regex = new RegExp(pattern.replace('*', '.*'));
      return Promise.resolve([...store.keys()].filter(k => regex.test(k)));
    }),
    hget: vi.fn(),
    hset: vi.fn(),
    hdel: vi.fn(),
    hgetall: vi.fn(() => Promise.resolve({})),
    ping: vi.fn(() => Promise.resolve('PONG')),
    quit: vi.fn(() => Promise.resolve()),
    
    // For testing
    _store: store,
    _clear: () => store.clear(),
  };
}

// =============================================================================
// MOCK LOGGER
// =============================================================================

export function createMockLogger() {
  return {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    verbose: vi.fn(),
    silly: vi.fn(),
  };
}

// =============================================================================
// ENTITY FACTORIES
// =============================================================================

export const factories = {
  user: (overrides: Partial<UserMock> = {}): UserMock => ({
    id: `user-${Date.now()}`,
    email: `test-${Date.now()}@example.com`,
    firstName: 'Test',
    lastName: 'User',
    role: 'analyst',
    organizationId: 'org-test-123',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),

  organization: (overrides: Partial<OrganizationMock> = {}): OrganizationMock => ({
    id: `org-${Date.now()}`,
    name: 'Test Organization',
    slug: `test-org-${Date.now()}`,
    plan: 'enterprise',
    settings: {},
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),

  agent: (overrides: Partial<AgentMock> = {}): AgentMock => ({
    id: `agent-${Date.now()}`,
    code: `AGENT_${Date.now()}`,
    name: 'Test Agent',
    role: 'analyst',
    description: 'A test agent',
    systemPrompt: 'You are a test agent.',
    capabilities: [],
    constraints: [],
    modelConfig: { model: 'llama3.2:3b' },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),

  deliberation: (overrides: Partial<DeliberationMock> = {}): DeliberationMock => ({
    id: `delib-${Date.now()}`,
    organizationId: 'org-test-123',
    question: 'Should we proceed with the initiative?',
    config: { mode: 'consensus' },
    context: {},
    status: 'pending',
    progress: 0,
    createdAt: new Date(),
    ...overrides,
  }),

  decision: (overrides: Partial<DecisionMock> = {}): DecisionMock => ({
    id: `dec-${Date.now()}`,
    organizationId: 'org-test-123',
    userId: 'user-test-123',
    title: 'Test Decision',
    description: 'A test decision',
    priority: 'medium',
    status: 'pending',
    stakeholders: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),

  alert: (overrides: Partial<AlertMock> = {}): AlertMock => ({
    id: `alert-${Date.now()}`,
    organizationId: 'org-test-123',
    severity: 'medium',
    status: 'active',
    title: 'Test Alert',
    message: 'This is a test alert',
    source: 'test',
    metadata: {},
    createdAt: new Date(),
    ...overrides,
  }),

  dataSource: (overrides: Partial<DataSourceMock> = {}): DataSourceMock => ({
    id: `ds-${Date.now()}`,
    organizationId: 'org-test-123',
    name: 'Test Database',
    type: 'postgresql',
    config: {},
    credentials: {},
    status: 'pending',
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),
};

// =============================================================================
// MOCK TYPES
// =============================================================================

interface UserMock {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  organizationId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface OrganizationMock {
  id: string;
  name: string;
  slug: string;
  plan: string;
  settings: Record<string, unknown>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface AgentMock {
  id: string;
  code: string;
  name: string;
  role: string;
  description: string;
  systemPrompt: string;
  capabilities: unknown[];
  constraints: unknown[];
  modelConfig: Record<string, unknown>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface DeliberationMock {
  id: string;
  organizationId: string;
  question: string;
  config: Record<string, unknown>;
  context: Record<string, unknown>;
  status: string;
  progress: number;
  createdAt: Date;
}

interface DecisionMock {
  id: string;
  organizationId: string;
  userId: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  stakeholders: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface AlertMock {
  id: string;
  organizationId: string;
  severity: string;
  status: string;
  title: string;
  message: string;
  source: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

interface DataSourceMock {
  id: string;
  organizationId: string;
  name: string;
  type: string;
  config: Record<string, unknown>;
  credentials: Record<string, unknown>;
  status: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// RESULT ASSERTIONS
// =============================================================================

export function expectSuccess<T>(result: Result<T>): asserts result is { success: true; data: T } {
  expect(result.success).toBe(true);
  if (!result.success) {
    throw new Error(`Expected success but got failure: ${result.error.message}`);
  }
}

export function expectFailure<T>(
  result: Result<T>,
  expectedCode?: string
): asserts result is { success: false; error: ServiceError } {
  expect(result.success).toBe(false);
  if (result.success) {
    throw new Error('Expected failure but got success');
  }
  if (expectedCode) {
    expect(result.error.code).toBe(expectedCode);
  }
}

export function expectResultData<T>(result: Result<T>): T {
  expectSuccess(result);
  return result.data;
}

// =============================================================================
// ASYNC TEST HELPERS
// =============================================================================

export async function waitFor(
  condition: () => boolean | Promise<boolean>,
  timeout = 5000,
  interval = 100
): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await condition()) return;
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  throw new Error(`Condition not met within ${timeout}ms`);
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// =============================================================================
// REQUEST MOCK HELPERS
// =============================================================================

export function createMockRequest(overrides: Partial<MockRequest> = {}): MockRequest {
  return {
    params: {},
    query: {},
    body: {},
    headers: {},
    user: factories.user(),
    organizationId: 'org-test-123',
    ...overrides,
  };
}

export function createMockResponse(): MockResponse {
  const res: MockResponse = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
    setHeader: vi.fn().mockReturnThis(),
    end: vi.fn().mockReturnThis(),
    _getData: () => res.json.mock.calls[0]?.[0],
    _getStatus: () => res.status.mock.calls[0]?.[0] ?? 200,
  };
  return res;
}

interface MockRequest {
  params: Record<string, string>;
  query: Record<string, string>;
  body: Record<string, unknown>;
  headers: Record<string, string>;
  user: UserMock;
  organizationId: string;
}

interface MockResponse {
  status: ReturnType<typeof vi.fn>;
  json: ReturnType<typeof vi.fn>;
  send: ReturnType<typeof vi.fn>;
  setHeader: ReturnType<typeof vi.fn>;
  end: ReturnType<typeof vi.fn>;
  _getData: () => unknown;
  _getStatus: () => number;
}

// =============================================================================
// LLM MOCK HELPERS
// =============================================================================

export function createMockOllamaClient() {
  return {
    generate: vi.fn().mockResolvedValue({
      response: 'Mock LLM response',
      done: true,
    }),
    chat: vi.fn().mockResolvedValue({
      message: { content: 'Mock chat response' },
      done: true,
    }),
    embed: vi.fn().mockResolvedValue({
      embedding: new Array(768).fill(0.1),
    }),
    list: vi.fn().mockResolvedValue({
      models: [{ name: 'llama3.2:3b' }],
    }),
  };
}

// =============================================================================
// CLEANUP HELPERS
// =============================================================================

export function setupTestEnvironment() {
  const mocks = {
    prisma: createMockPrismaClient(),
    redis: createMockRedisClient(),
    logger: createMockLogger(),
    ollama: createMockOllamaClient(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.redis._clear();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  return mocks;
}
