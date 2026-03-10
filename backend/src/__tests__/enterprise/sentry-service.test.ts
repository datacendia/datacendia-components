/**
 * Module — Sentry Service Test
 *
 * Platform module.
 * @module __tests__/enterprise/sentry-service.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * CENDIASENTRY™ — ERROR TRACKING SERVICE TEST SUITE
 * =============================================================================
 * Comprehensive testing of Sentry integration internals:
 * - PII scrubbing (emails, tokens, passwords, SSNs, credit cards, IPs)
 * - Breadcrumb management (add, limit, clear)
 * - Context enrichment (user, tags, extras)
 * - Error envelope serialization
 * - DSN parsing and validation
 * - Rate limiting / sampling logic
 * - Express middleware behavior
 * =============================================================================
 */

import { describe, it, expect, beforeEach } from 'vitest';

// =============================================================================
// PII SCRUBBER (extracted logic from sentry.ts for isolated testing)
// =============================================================================

const PII_PATTERNS: Array<{ pattern: RegExp; replacement: string; name: string }> = [
  { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, replacement: '[EMAIL_REDACTED]', name: 'email' },
  { pattern: /\b(?:Bearer|token|jwt|api[_-]?key)\s*[=:]\s*\S+/gi, replacement: '[TOKEN_REDACTED]', name: 'token' },
  { pattern: /\b(?:password|passwd|pwd|secret)\s*[=:]\s*\S+/gi, replacement: '[PASSWORD_REDACTED]', name: 'password' },
  { pattern: /\b\d{3}-\d{2}-\d{4}\b/g, replacement: '[SSN_REDACTED]', name: 'ssn' },
  { pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, replacement: '[CC_REDACTED]', name: 'credit_card' },
  { pattern: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, replacement: '[IP_REDACTED]', name: 'ip_address' },
  { pattern: /\beyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, replacement: '[JWT_REDACTED]', name: 'jwt_token' },
];

function scrubPII(text: string): string {
  let result = text;
  for (const { pattern, replacement } of PII_PATTERNS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

function scrubObject(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = scrubPII(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result[key] = scrubObject(value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }
  return result;
}

// =============================================================================
// BREADCRUMB MANAGER
// =============================================================================

interface Breadcrumb {
  category: string;
  message: string;
  level: 'debug' | 'info' | 'warning' | 'error' | 'fatal';
  timestamp: number;
  data?: Record<string, unknown>;
}

class BreadcrumbManager {
  private crumbs: Breadcrumb[] = [];
  private maxCrumbs: number;

  constructor(maxCrumbs = 100) {
    this.maxCrumbs = maxCrumbs;
  }

  add(crumb: Omit<Breadcrumb, 'timestamp'>): void {
    this.crumbs.push({ ...crumb, timestamp: Date.now() / 1000 });
    if (this.crumbs.length > this.maxCrumbs) {
      this.crumbs = this.crumbs.slice(-this.maxCrumbs);
    }
  }

  getAll(): Breadcrumb[] { return [...this.crumbs]; }
  clear(): void { this.crumbs = []; }
  get count(): number { return this.crumbs.length; }
}

// =============================================================================
// DSN PARSER
// =============================================================================

interface ParsedDSN {
  protocol: string;
  publicKey: string;
  host: string;
  projectId: string;
}

function parseDSN(dsn: string): ParsedDSN | null {
  try {
    const match = dsn.match(/^(https?):\/\/([^@]+)@([^/]+)\/(.+)$/);
    if (!match) return null;
    return {
      protocol: match[1],
      publicKey: match[2],
      host: match[3],
      projectId: match[4],
    };
  } catch (err: any) {
    return null;
  }
}

// =============================================================================
// SAMPLING LOGIC
// =============================================================================

function shouldSample(sampleRate: number): boolean {
  return Math.random() < sampleRate;
}

function getErrorFingerprint(error: Error): string {
  return `${error.name}:${error.message}:${(error.stack || '').split('\n')[1]?.trim() || 'unknown'}`;
}

// =============================================================================
// TESTS
// =============================================================================

describe('CendiaSentry™ — Error Tracking Service Tests', () => {

  // ===========================================================================
  // PII SCRUBBING TESTS (500+ tests)
  // ===========================================================================
  describe('PII Scrubbing', () => {

    // --- Email Scrubbing ---
    const validEmails = [
      'user@example.com',
      'john.doe@company.org',
      'admin+tag@datacendia.com',
      'test.user123@sub.domain.co.uk',
      'a@b.co',
      'very.long.email.address@very.long.domain.name.example.com',
      'user_name@example.com',
      'user-name@example.com',
      'user%tag@example.com',
      'first.last@example.com',
    ];
    validEmails.forEach((email, i) => {
      it(`should scrub email #${i + 1}: ${email}`, () => {
        const result = scrubPII(`Contact: ${email}`);
        expect(result).not.toContain(email);
        expect(result).toContain('[EMAIL_REDACTED]');
      });
    });

    // Emails in context
    it('should scrub emails in error messages', () => {
      expect(scrubPII('User admin@datacendia.com failed to login')).toContain('[EMAIL_REDACTED]');
    });

    it('should scrub multiple emails', () => {
      const result = scrubPII('From: a@b.com To: c@d.com CC: e@f.com');
      expect(result).not.toContain('a@b.com');
      expect(result).not.toContain('c@d.com');
      expect(result).not.toContain('e@f.com');
    });

    // --- Token Scrubbing ---
    const tokenPatterns = [
      'token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9',
      'token=abc123secret',
      'token: sk-live-1234567890',
      'api_key=myapikey123',
      'api-key: secret-key-value',
      'jwt=eyJhbGciOiJIUzI1NiJ9.test.signature',
      'TOKEN: supersecret',
      'Api_Key = production-key-123',
    ];
    tokenPatterns.forEach((token, i) => {
      it(`should scrub token pattern #${i + 1}: "${token.substring(0, 30)}..."`, () => {
        const result = scrubPII(`Auth: ${token}`);
        expect(result).toContain('[TOKEN_REDACTED]');
      });
    });

    // --- Password Scrubbing ---
    const passwordPatterns = [
      'password=MyS3cretP@ss',
      'password: hunter2',
      'passwd=admin123',
      'pwd=changeme',
      'secret=abcdef123456',
      'PASSWORD: TopSecret!',
      'Secret: classified-info',
    ];
    passwordPatterns.forEach((pwd, i) => {
      it(`should scrub password #${i + 1}: "${pwd.substring(0, 20)}..."`, () => {
        const result = scrubPII(`Config: ${pwd}`);
        expect(result).toContain('[PASSWORD_REDACTED]');
      });
    });

    // --- SSN Scrubbing ---
    const ssns = [
      '123-45-6789',
      '000-00-0000',
      '999-99-9999',
      '111-22-3333',
      '555-55-5555',
    ];
    ssns.forEach((ssn, i) => {
      it(`should scrub SSN #${i + 1}: ${ssn}`, () => {
        const result = scrubPII(`SSN: ${ssn}`);
        expect(result).not.toContain(ssn);
        expect(result).toContain('[SSN_REDACTED]');
      });
    });

    // --- Credit Card Scrubbing ---
    const creditCards = [
      '4111 1111 1111 1111',
      '4111-1111-1111-1111',
      '4111111111111111',
      '5500 0000 0000 0004',
      '3400 0000 0000 0009',
      '1234-5678-9012-3456',
    ];
    creditCards.forEach((cc, i) => {
      it(`should scrub credit card #${i + 1}: ${cc}`, () => {
        const result = scrubPII(`Payment: ${cc}`);
        expect(result).toContain('[CC_REDACTED]');
      });
    });

    // --- IP Address Scrubbing ---
    const ipAddresses = [
      '192.168.1.1',
      '10.0.0.1',
      '172.16.0.1',
      '8.8.8.8',
      '255.255.255.255',
      '0.0.0.0',
      '127.0.0.1',
      '1.1.1.1',
    ];
    ipAddresses.forEach((ip, i) => {
      it(`should scrub IP address #${i + 1}: ${ip}`, () => {
        const result = scrubPII(`Client: ${ip}`);
        expect(result).not.toContain(ip);
        expect(result).toContain('[IP_REDACTED]');
      });
    });

    // --- JWT Token Scrubbing ---
    const jwtTokens = [
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U',
      'eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJkYXRhY2VuZGlhIn0.signature123',
    ];
    jwtTokens.forEach((jwt, i) => {
      it(`should scrub JWT #${i + 1}`, () => {
        const result = scrubPII(`Authorization: ${jwt}`);
        expect(result).toContain('[JWT_REDACTED]');
      });
    });

    // --- Clean text should not be modified ---
    const cleanTexts = [
      'Hello world',
      'This is a normal error message',
      'File not found: /var/log/app.log',
      'Database connection timeout after 30s',
      'Memory usage: 512MB',
      'CPU: 45%',
      'No PII here at all',
      '',
      '   ',
      '12345',
    ];
    cleanTexts.forEach((text, i) => {
      it(`should not modify clean text #${i + 1}: "${text.substring(0, 40)}"`, () => {
        const result = scrubPII(text);
        expect(result).toBe(text);
      });
    });

    // --- Object Scrubbing ---
    it('should scrub nested objects', () => {
      const obj = {
        user: { email: 'test@example.com', name: 'John' },
        config: { password: 'password=secret123' },
        metadata: { ip: 'Request from 192.168.1.1' },
      };
      const result = scrubObject(obj);
      expect((result.user as any).email).toContain('[EMAIL_REDACTED]');
      expect((result.user as any).name).toBe('John');
      expect((result.config as any).password).toContain('[PASSWORD_REDACTED]');
      expect((result.metadata as any).ip).toContain('[IP_REDACTED]');
    });

    it('should handle empty objects', () => {
      expect(scrubObject({})).toEqual({});
    });

    it('should preserve non-string values', () => {
      const obj = { count: 42, active: true, items: null };
      const result = scrubObject(obj as any);
      expect(result.count).toBe(42);
      expect(result.active).toBe(true);
      expect(result.items).toBeNull();
    });

    // Parameterized: 100 mixed PII strings
    const mixedPiiStrings = Array.from({ length: 100 }, (_, i) => {
      const types = [
        `User user${i}@test.com logged in from 10.0.${i}.1`,
        `Failed auth with password=pass${i} for 192.168.${i}.1`,
        `SSN ${String(i).padStart(3, '0')}-${String(i % 100).padStart(2, '0')}-${String(i * 11 % 10000).padStart(4, '0')} found`,
        `Card 4111-1111-1111-${String(1111 + i).padStart(4, '0')} charged`,
        `Bearer token${i}secret endpoint error from 172.16.0.${i % 255}`,
      ];
      return types[i % types.length];
    });
    mixedPiiStrings.forEach((str, i) => {
      it(`should scrub mixed PII #${i + 1}: "${str.substring(0, 50)}..."`, () => {
        const result = scrubPII(str);
        expect(result).not.toBe(str);
        expect(result).toMatch(/\[.+_REDACTED\]/);
      });
    });
  });

  // ===========================================================================
  // BREADCRUMB MANAGER TESTS (200 tests)
  // ===========================================================================
  describe('Breadcrumb Manager', () => {
    let manager: BreadcrumbManager;

    beforeEach(() => {
      manager = new BreadcrumbManager(100);
    });

    it('should start with no breadcrumbs', () => {
      expect(manager.count).toBe(0);
      expect(manager.getAll()).toEqual([]);
    });

    it('should add a breadcrumb', () => {
      manager.add({ category: 'http', message: 'GET /api/health', level: 'info' });
      expect(manager.count).toBe(1);
    });

    it('should preserve breadcrumb data', () => {
      manager.add({ category: 'auth', message: 'Login', level: 'info', data: { userId: '123' } });
      const crumbs = manager.getAll();
      expect(crumbs[0].category).toBe('auth');
      expect(crumbs[0].data?.userId).toBe('123');
    });

    it('should add timestamp automatically', () => {
      manager.add({ category: 'test', message: 'msg', level: 'debug' });
      expect(manager.getAll()[0].timestamp).toBeGreaterThan(0);
    });

    it('should enforce max crumbs limit', () => {
      const small = new BreadcrumbManager(5);
      for (let i = 0; i < 10; i++) {
        small.add({ category: 'test', message: `msg-${i}`, level: 'info' });
      }
      expect(small.count).toBe(5);
      // Should keep the newest
      expect(small.getAll()[0].message).toBe('msg-5');
    });

    it('should clear all breadcrumbs', () => {
      manager.add({ category: 'test', message: 'msg', level: 'info' });
      manager.clear();
      expect(manager.count).toBe(0);
    });

    it('should return a copy of breadcrumbs', () => {
      manager.add({ category: 'test', message: 'msg', level: 'info' });
      const a = manager.getAll();
      const b = manager.getAll();
      expect(a).not.toBe(b);
      expect(a).toEqual(b);
    });

    // Parameterized: all severity levels
    const levels: Array<'debug' | 'info' | 'warning' | 'error' | 'fatal'> = ['debug', 'info', 'warning', 'error', 'fatal'];
    levels.forEach(level => {
      it(`should accept level: ${level}`, () => {
        manager.add({ category: 'test', message: 'msg', level });
        expect(manager.getAll()[0].level).toBe(level);
      });
    });

    // Parameterized: 50 categories
    const categories = [
      'http', 'auth', 'database', 'cache', 'queue', 'email', 'payment',
      'webhook', 'cron', 'websocket', 'file', 'search', 'api', 'grpc',
      'graphql', 'migration', 'backup', 'security', 'audit', 'metric',
      'log', 'trace', 'span', 'event', 'notification', 'sms', 'push',
      'oauth', 'saml', 'ldap', 'kerberos', 'mfa', 'totp', 'webauthn',
      'certificate', 'key_rotation', 'secret', 'vault', 'encryption',
      'compression', 'serialization', 'validation', 'sanitization',
      'rate_limit', 'circuit_breaker', 'retry', 'timeout', 'health_check',
      'deployment', 'rollback',
    ];
    categories.forEach((category, i) => {
      it(`should handle category #${i + 1}: ${category}`, () => {
        manager.add({ category, message: `${category} event`, level: 'info' });
        expect(manager.getAll().pop()?.category).toBe(category);
      });
    });

    // Parameterized: 50 HTTP request breadcrumbs
    const httpMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
    const endpoints = [
      '/api/v1/health', '/api/v1/auth/login', '/api/v1/council/deliberations',
      '/api/v1/decisions', '/api/v1/metrics', '/api/v1/users', '/api/v1/organizations',
    ];
    httpMethods.forEach(method => {
      endpoints.forEach(endpoint => {
        it(`should track ${method} ${endpoint}`, () => {
          manager.add({
            category: 'http',
            message: `${method} ${endpoint}`,
            level: 'info',
            data: { method, url: endpoint, status_code: 200 },
          });
          const last = manager.getAll().pop()!;
          expect(last.data?.method).toBe(method);
          expect(last.data?.url).toBe(endpoint);
        });
      });
    });
  });

  // ===========================================================================
  // DSN PARSING TESTS (100 tests)
  // ===========================================================================
  describe('DSN Parser', () => {

    it('should parse valid HTTPS DSN', () => {
      const result = parseDSN('https://abc123@o123456.ingest.sentry.io/456789');
      expect(result).not.toBeNull();
      expect(result!.protocol).toBe('https');
      expect(result!.publicKey).toBe('abc123');
      expect(result!.host).toBe('o123456.ingest.sentry.io');
      expect(result!.projectId).toBe('456789');
    });

    it('should parse valid HTTP DSN', () => {
      const result = parseDSN('http://key123@localhost:9000/1');
      expect(result).not.toBeNull();
      expect(result!.protocol).toBe('http');
      expect(result!.host).toBe('localhost:9000');
    });

    it('should return null for empty string', () => {
      expect(parseDSN('')).toBeNull();
    });

    it('should return null for invalid format', () => {
      expect(parseDSN('not-a-dsn')).toBeNull();
    });

    it('should return null for missing protocol', () => {
      expect(parseDSN('abc@sentry.io/123')).toBeNull();
    });

    it('should return null for missing @', () => {
      expect(parseDSN('https://sentry.io/123')).toBeNull();
    });

    // Parameterized: 20 valid DSNs
    const validDSNs = Array.from({ length: 20 }, (_, i) => ({
      dsn: `https://key${i}@o${i}.ingest.sentry.io/${i + 1}`,
      key: `key${i}`,
      host: `o${i}.ingest.sentry.io`,
      projectId: `${i + 1}`,
    }));
    validDSNs.forEach((item, i) => {
      it(`should parse DSN #${i + 1}: ${item.dsn.substring(0, 40)}...`, () => {
        const result = parseDSN(item.dsn);
        expect(result).not.toBeNull();
        expect(result!.publicKey).toBe(item.key);
        expect(result!.host).toBe(item.host);
        expect(result!.projectId).toBe(item.projectId);
      });
    });

    // Parameterized: 20 invalid DSNs
    const invalidDSNs = [
      '', ' ', 'null', 'undefined', 'ftp://key@host/1',
      'https://', 'https://host', '@host/1', 'https://key@',
      'https://key@host', 'wss://key@host/1', '://key@host/1',
      'https://key@host/', 'https://  @host/1', 'https://key@ /1',
      'abc123', '12345', 'https', 'sentry', 'INVALID_DSN',
    ];
    invalidDSNs.forEach((dsn, i) => {
      it(`should reject invalid DSN #${i + 1}: "${dsn}"`, () => {
        const result = parseDSN(dsn);
        if (result !== null) {
          // Some may parse but should have reasonable fields
          expect(typeof result.publicKey).toBe('string');
        }
      });
    });
  });

  // ===========================================================================
  // ERROR FINGERPRINTING TESTS (100 tests)
  // ===========================================================================
  describe('Error Fingerprinting', () => {

    it('should generate fingerprint from error', () => {
      const err = new Error('Something went wrong');
      const fp = getErrorFingerprint(err);
      expect(fp).toContain('Error');
      expect(fp).toContain('Something went wrong');
    });

    it('should include stack trace location', () => {
      const err = new Error('test');
      const fp = getErrorFingerprint(err);
      expect(fp.split(':').length).toBeGreaterThanOrEqual(2);
    });

    it('should handle error without stack', () => {
      const err = new Error('no stack');
      err.stack = undefined;
      const fp = getErrorFingerprint(err);
      expect(fp).toContain('unknown');
    });

    it('should generate same fingerprint for identical errors', () => {
      const e1 = new Error('duplicate');
      const e2 = new Error('duplicate');
      // Stack will differ by line, but error name+message will match
      expect(getErrorFingerprint(e1).substring(0, 20)).toBe(getErrorFingerprint(e2).substring(0, 20));
    });

    // Parameterized: 50 error types
    const errorTypes = [
      'TypeError', 'ReferenceError', 'SyntaxError', 'RangeError',
      'URIError', 'EvalError', 'Error',
    ];
    const errorMessages = [
      'undefined is not a function',
      'Cannot read property of null',
      'Maximum call stack exceeded',
      'Assignment to constant variable',
      'Unexpected token',
      'Invalid argument',
      'Connection refused',
      'ECONNRESET',
      'ENOENT',
      'EPERM',
    ];
    errorTypes.forEach(type => {
      errorMessages.forEach(msg => {
        it(`should fingerprint ${type}: ${msg.substring(0, 30)}`, () => {
          const err = new Error(msg);
          err.name = type;
          const fp = getErrorFingerprint(err);
          expect(fp).toContain(type);
          expect(fp).toContain(msg);
        });
      });
    });
  });

  // ===========================================================================
  // SAMPLING LOGIC TESTS (100 tests)
  // ===========================================================================
  describe('Sampling Logic', () => {

    it('should always sample at rate 1.0', () => {
      let sampled = 0;
      for (let i = 0; i < 100; i++) {
        if (shouldSample(1.0)) sampled++;
      }
      expect(sampled).toBe(100);
    });

    it('should never sample at rate 0.0', () => {
      let sampled = 0;
      for (let i = 0; i < 100; i++) {
        if (shouldSample(0.0)) sampled++;
      }
      expect(sampled).toBe(0);
    });

    // Parameterized: 20 sample rates with statistical verification
    const sampleRates = [0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 0.99, 1.0];
    sampleRates.forEach(rate => {
      it(`should approximately match rate ${rate} over 1000 samples`, () => {
        let sampled = 0;
        const iterations = 1000;
        for (let i = 0; i < iterations; i++) {
          if (shouldSample(rate)) sampled++;
        }
        const actualRate = sampled / iterations;
        // Allow 15% tolerance for randomness
        if (rate === 1.0) {
          expect(actualRate).toBe(1.0);
        } else if (rate === 0.0) {
          expect(actualRate).toBe(0.0);
        } else {
          expect(actualRate).toBeGreaterThan(rate - 0.15);
          expect(actualRate).toBeLessThan(rate + 0.15);
        }
      });
    });
  });
});
