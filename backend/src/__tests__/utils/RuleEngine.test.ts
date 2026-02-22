// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
import { describe, it, expect } from 'vitest';
import { RuleEngine, ExpressionParser, parseConditionString } from '../../utils/RuleEngine.js';
import type { Rule, RuleCondition } from '../../utils/RuleEngine.js';

// =============================================================================
// RULE ENGINE TESTS
// =============================================================================

describe('RuleEngine', () => {
  describe('basic evaluation', () => {
    it('should evaluate a simple equality rule', () => {
      const engine = new RuleEngine([{
        id: 'r1', name: 'Status Check', priority: 1, enabled: true,
        condition: { field: 'status', operator: 'eq', value: 'blocked' },
        action: { type: 'deny', message: 'Blocked status', severity: 'high' },
      }]);

      const result = engine.evaluate({ status: 'blocked' });
      expect(result.triggered).toHaveLength(1);
      expect(result.denied).toHaveLength(1);
      expect(result.allPassed).toBe(false);
    });

    it('should pass when condition is not met', () => {
      const engine = new RuleEngine([{
        id: 'r1', name: 'Status Check', priority: 1, enabled: true,
        condition: { field: 'status', operator: 'eq', value: 'blocked' },
        action: { type: 'deny', message: 'Blocked status', severity: 'high' },
      }]);

      const result = engine.evaluate({ status: 'active' });
      expect(result.triggered).toHaveLength(0);
      expect(result.allPassed).toBe(true);
    });
  });

  describe('numeric comparisons', () => {
    it('should evaluate gt/lt/gte/lte', () => {
      const engine = new RuleEngine([
        { id: 'r1', name: 'Score Too Low', priority: 1, enabled: true,
          condition: { field: 'creditScore', operator: 'lt', value: 500 },
          action: { type: 'deny', message: 'Credit score too low', severity: 'critical' } },
        { id: 'r2', name: 'DTI High', priority: 2, enabled: true,
          condition: { field: 'debtToIncomeRatio', operator: 'gt', value: 0.5 },
          action: { type: 'warn', message: 'High DTI', severity: 'medium' } },
      ]);

      const result = engine.evaluate({ creditScore: 450, debtToIncomeRatio: 0.6 });
      expect(result.denied).toHaveLength(1);
      expect(result.warnings).toHaveLength(1);
      expect(result.allPassed).toBe(false);
    });

    it('should evaluate between operator', () => {
      const engine = new RuleEngine([{
        id: 'r1', name: 'In Range', priority: 1, enabled: true,
        condition: { field: 'amount', operator: 'between', value: [1000, 5000] },
        action: { type: 'log', message: 'Amount in range' },
      }]);

      expect(engine.evaluate({ amount: 3000 }).triggered).toHaveLength(1);
      expect(engine.evaluate({ amount: 500 }).triggered).toHaveLength(0);
      expect(engine.evaluate({ amount: 6000 }).triggered).toHaveLength(0);
    });
  });

  describe('string operators', () => {
    it('should evaluate contains/startsWith/endsWith', () => {
      const engine = new RuleEngine([
        { id: 'r1', name: 'Contains Check', priority: 1, enabled: true,
          condition: { field: 'email', operator: 'contains', value: '@datacendia' },
          action: { type: 'allow', message: 'Internal email' } },
        { id: 'r2', name: 'Starts With', priority: 2, enabled: true,
          condition: { field: 'name', operator: 'startsWith', value: 'admin' },
          action: { type: 'escalate', message: 'Admin user', severity: 'high' } },
      ]);

      const result = engine.evaluate({ email: 'user@datacendia.com', name: 'admin_user' });
      expect(result.triggered).toHaveLength(2);
    });

    it('should evaluate in/notIn', () => {
      const engine = new RuleEngine([{
        id: 'r1', name: 'Role Check', priority: 1, enabled: true,
        condition: { field: 'role', operator: 'in', value: ['admin', 'owner'] },
        action: { type: 'allow', message: 'Has permission' },
      }]);

      expect(engine.evaluate({ role: 'admin' }).triggered).toHaveLength(1);
      expect(engine.evaluate({ role: 'viewer' }).triggered).toHaveLength(0);
    });
  });

  describe('logical operators', () => {
    it('should evaluate AND conditions', () => {
      const engine = new RuleEngine([{
        id: 'r1', name: 'Complex Check', priority: 1, enabled: true,
        condition: {
          operator: 'and',
          conditions: [
            { field: 'amount', operator: 'gt', value: 10000 },
            { field: 'approved', operator: 'eq', value: false },
          ],
        },
        action: { type: 'deny', message: 'Large unapproved', severity: 'critical' },
      }]);

      expect(engine.evaluate({ amount: 15000, approved: false }).denied).toHaveLength(1);
      expect(engine.evaluate({ amount: 15000, approved: true }).denied).toHaveLength(0);
      expect(engine.evaluate({ amount: 5000, approved: false }).denied).toHaveLength(0);
    });

    it('should evaluate OR conditions', () => {
      const engine = new RuleEngine([{
        id: 'r1', name: 'Either Condition', priority: 1, enabled: true,
        condition: {
          operator: 'or',
          conditions: [
            { field: 'priority', operator: 'eq', value: 'critical' },
            { field: 'escalated', operator: 'eq', value: true },
          ],
        },
        action: { type: 'escalate', message: 'Needs attention', severity: 'high' },
      }]);

      expect(engine.evaluate({ priority: 'critical', escalated: false }).triggered).toHaveLength(1);
      expect(engine.evaluate({ priority: 'low', escalated: true }).triggered).toHaveLength(1);
      expect(engine.evaluate({ priority: 'low', escalated: false }).triggered).toHaveLength(0);
    });

    it('should evaluate NOT conditions', () => {
      const engine = new RuleEngine([{
        id: 'r1', name: 'Not Approved', priority: 1, enabled: true,
        condition: {
          operator: 'not',
          conditions: [{ field: 'approved', operator: 'eq', value: true }],
        },
        action: { type: 'warn', message: 'Not approved' },
      }]);

      expect(engine.evaluate({ approved: false }).triggered).toHaveLength(1);
      expect(engine.evaluate({ approved: true }).triggered).toHaveLength(0);
    });
  });

  describe('nested field access', () => {
    it('should resolve nested fields', () => {
      const engine = new RuleEngine([{
        id: 'r1', name: 'Nested Check', priority: 1, enabled: true,
        condition: { field: 'user.profile.role', operator: 'eq', value: 'admin' },
        action: { type: 'allow', message: 'Is admin' },
      }]);

      expect(engine.evaluate({ user: { profile: { role: 'admin' } } }).triggered).toHaveLength(1);
      expect(engine.evaluate({ user: { profile: { role: 'viewer' } } }).triggered).toHaveLength(0);
    });
  });

  describe('exists/notExists', () => {
    it('should check field existence', () => {
      const engine = new RuleEngine([
        { id: 'r1', name: 'Has Email', priority: 1, enabled: true,
          condition: { field: 'email', operator: 'exists' },
          action: { type: 'log', message: 'Email present' } },
        { id: 'r2', name: 'No Phone', priority: 2, enabled: true,
          condition: { field: 'phone', operator: 'notExists' },
          action: { type: 'warn', message: 'Phone missing' } },
      ]);

      const result = engine.evaluate({ email: 'test@test.com' });
      expect(result.triggered).toHaveLength(2);
    });
  });

  describe('disabled rules', () => {
    it('should skip disabled rules', () => {
      const engine = new RuleEngine([{
        id: 'r1', name: 'Disabled', priority: 1, enabled: false,
        condition: { field: 'x', operator: 'eq', value: 1 },
        action: { type: 'deny', message: 'Should not trigger' },
      }]);

      expect(engine.evaluate({ x: 1 }).triggered).toHaveLength(0);
    });
  });

  describe('rule management', () => {
    it('should add, get, list, and remove rules', () => {
      const engine = new RuleEngine();
      engine.addRule({ id: 'r1', name: 'Rule 1', priority: 2, enabled: true,
        condition: { field: 'x', operator: 'eq', value: 1 }, action: { type: 'log' } });
      engine.addRule({ id: 'r2', name: 'Rule 2', priority: 1, enabled: true,
        condition: { field: 'y', operator: 'eq', value: 2 }, action: { type: 'log' } });

      expect(engine.getRule('r1')?.name).toBe('Rule 1');
      expect(engine.listRules()[0].id).toBe('r2'); // Lower priority number = first
      expect(engine.removeRule('r1')).toBe(true);
      expect(engine.listRules()).toHaveLength(1);
    });
  });
});

// =============================================================================
// EXPRESSION PARSER TESTS
// =============================================================================

describe('ExpressionParser', () => {
  const parser = new ExpressionParser();

  describe('literals', () => {
    it('should evaluate number literals', () => {
      expect(parser.evaluate('42', {})).toBe(42);
      expect(parser.evaluateNumber('-5', {})).toBe(-5);
      expect(parser.evaluate('3.14', {})).toBe(3.14);
    });

    it('should evaluate string literals', () => {
      expect(parser.evaluate("'hello'", {})).toBe('hello');
    });

    it('should evaluate boolean/null literals', () => {
      expect(parser.evaluate('true', {})).toBe(true);
      expect(parser.evaluate('false', {})).toBe(false);
      expect(parser.evaluate('null', {})).toBe(null);
    });
  });

  describe('field references', () => {
    it('should resolve simple fields', () => {
      expect(parser.evaluate('name', { name: 'Alice' })).toBe('Alice');
      expect(parser.evaluate('age', { age: 30 })).toBe(30);
    });

    it('should resolve nested fields', () => {
      expect(parser.evaluate('user.name', { user: { name: 'Bob' } })).toBe('Bob');
      expect(parser.evaluate('a.b.c', { a: { b: { c: 42 } } })).toBe(42);
    });

    it('should return undefined for missing fields', () => {
      expect(parser.evaluate('missing', {})).toBeUndefined();
    });
  });

  describe('comparisons', () => {
    it('should evaluate ==', () => {
      expect(parser.evaluateBoolean("status == 'active'", { status: 'active' })).toBe(true);
      expect(parser.evaluateBoolean("status == 'active'", { status: 'inactive' })).toBe(false);
    });

    it('should evaluate !=', () => {
      expect(parser.evaluateBoolean("role != 'admin'", { role: 'viewer' })).toBe(true);
    });

    it('should evaluate >, >=, <, <=', () => {
      expect(parser.evaluateBoolean('score > 80', { score: 90 })).toBe(true);
      expect(parser.evaluateBoolean('score > 80', { score: 70 })).toBe(false);
      expect(parser.evaluateBoolean('score >= 80', { score: 80 })).toBe(true);
      expect(parser.evaluateBoolean('score < 50', { score: 30 })).toBe(true);
      expect(parser.evaluateBoolean('score <= 50', { score: 50 })).toBe(true);
    });
  });

  describe('logical operators', () => {
    it('should evaluate && (and)', () => {
      expect(parser.evaluateBoolean("score > 80 && status == 'active'", { score: 90, status: 'active' })).toBe(true);
      expect(parser.evaluateBoolean("score > 80 && status == 'active'", { score: 90, status: 'inactive' })).toBe(false);
    });

    it('should evaluate || (or)', () => {
      expect(parser.evaluateBoolean("role == 'admin' || role == 'owner'", { role: 'owner' })).toBe(true);
      expect(parser.evaluateBoolean("role == 'admin' || role == 'owner'", { role: 'viewer' })).toBe(false);
    });

    it('should evaluate ! (not)', () => {
      expect(parser.evaluateBoolean('!active', { active: false })).toBe(true);
      expect(parser.evaluateBoolean('!active', { active: true })).toBe(false);
    });
  });

  describe('built-in functions', () => {
    it('should evaluate abs()', () => {
      expect(parser.evaluateNumber('abs(value)', { value: -42 })).toBe(42);
    });

    it('should evaluate min/max', () => {
      expect(parser.evaluateNumber('min(a, b)', { a: 3, b: 7 })).toBe(3);
      expect(parser.evaluateNumber('max(a, b)', { a: 3, b: 7 })).toBe(7);
    });

    it('should evaluate len()', () => {
      expect(parser.evaluateNumber('len(items)', { items: [1, 2, 3] })).toBe(3);
      expect(parser.evaluateNumber('len(name)', { name: 'hello' })).toBe(5);
    });

    it('should evaluate lower/upper', () => {
      expect(parser.evaluate('lower(name)', { name: 'ALICE' })).toBe('alice');
      expect(parser.evaluate('upper(name)', { name: 'bob' })).toBe('BOB');
    });

    it('should evaluate floor/ceil/round', () => {
      expect(parser.evaluateNumber('floor(value)', { value: 3.7 })).toBe(3);
      expect(parser.evaluateNumber('ceil(value)', { value: 3.2 })).toBe(4);
      expect(parser.evaluateNumber('round(value)', { value: 3.5 })).toBe(4);
    });
  });

  describe('complex expressions', () => {
    it('should handle parenthesized expressions', () => {
      expect(parser.evaluateBoolean("(a > 5) && (b < 10)", { a: 7, b: 3 })).toBe(true);
    });

    it('should handle function in comparison', () => {
      expect(parser.evaluateBoolean('len(items) > 2', { items: [1, 2, 3] })).toBe(true);
      expect(parser.evaluateBoolean('len(items) > 2', { items: [1] })).toBe(false);
    });

    it('should handle financial guardrail expressions', () => {
      const ctx = { creditScore: 450, debtToIncomeRatio: 0.6, amount: 50000 };
      expect(parser.evaluateBoolean('creditScore < 500', ctx)).toBe(true);
      expect(parser.evaluateBoolean('debtToIncomeRatio > 0.5', ctx)).toBe(true);
      expect(parser.evaluateBoolean('amount > 100000', ctx)).toBe(false);
    });
  });
});

// =============================================================================
// parseConditionString TESTS
// =============================================================================

describe('parseConditionString', () => {
  it('should parse simple comparisons', () => {
    const cond = parseConditionString('score > 80');
    expect(cond.field).toBe('score');
    expect(cond.operator).toBe('gt');
    expect(cond.value).toBe(80);
  });

  it('should parse equality with string value', () => {
    const cond = parseConditionString("status == 'active'");
    expect(cond.field).toBe('status');
    expect(cond.operator).toBe('eq');
    expect(cond.value).toBe('active');
  });

  it('should parse AND conditions', () => {
    const cond = parseConditionString('score > 80 && status == active');
    expect(cond.operator).toBe('and');
    expect(cond.conditions).toHaveLength(2);
  });

  it('should parse OR conditions', () => {
    const cond = parseConditionString('role == admin || role == owner');
    expect(cond.operator).toBe('or');
    expect(cond.conditions).toHaveLength(2);
  });

  it('should parse boolean values', () => {
    const cond = parseConditionString('approved == true');
    expect(cond.value).toBe(true);
  });
});
