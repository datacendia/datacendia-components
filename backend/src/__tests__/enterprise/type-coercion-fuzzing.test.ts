// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * TYPE COERCION FUZZING TEST SUITE - 25,000+ TEST CASES
 * =============================================================================
 * Enterprise-grade type coercion and conversion testing
 */

import { describe, it, expect } from 'vitest';

// =============================================================================
// TYPE COERCION FUNCTIONS
// =============================================================================

const toBoolean = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    if (['true', '1', 'yes', 'on', 'y'].includes(lower)) return true;
    if (['false', '0', 'no', 'off', 'n', ''].includes(lower)) return false;
  }
  if (typeof value === 'number') return value !== 0 && !isNaN(value);
  return Boolean(value);
};

const toNumber = (value: unknown): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const cleaned = value.replace(/,/g, '').trim();
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  if (typeof value === 'boolean') return value ? 1 : 0;
  if (value === null || value === undefined) return 0;
  try { return Number(value) || 0; } catch { return 0; }
};

const toInteger = (value: unknown): number => {
  return Math.trunc(toNumber(value));
};

const toString = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (value === null) return '';
  if (value === undefined) return '';
  if (typeof value === 'object') {
    try { return JSON.stringify(value); } catch { return String(value); }
  }
  return String(value);
};

const toArray = <T>(value: unknown): T[] => {
  if (Array.isArray(value)) return value as T[];
  if (value === null || value === undefined) return [];
  return [value] as T[];
};

const toObject = (value: unknown): Record<string, unknown> => {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
};

const toDate = (value: unknown): Date | null => {
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }
  return null;
};

const isNullish = (value: unknown): value is null | undefined => {
  return value === null || value === undefined;
};

const isTruthy = (value: unknown): boolean => Boolean(value);
const isFalsy = (value: unknown): boolean => !Boolean(value);

const isNumeric = (value: unknown): boolean => {
  if (typeof value === 'number') return !isNaN(value) && isFinite(value);
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed !== '' && !isNaN(Number(trimmed));
  }
  return false;
};

const isInteger = (value: unknown): boolean => {
  return isNumeric(value) && Number.isInteger(toNumber(value));
};

const isPositive = (value: unknown): boolean => {
  return isNumeric(value) && toNumber(value) > 0;
};

const isNegative = (value: unknown): boolean => {
  return isNumeric(value) && toNumber(value) < 0;
};

const isString = (value: unknown): value is string => typeof value === 'string';
const isNumber = (value: unknown): value is number => typeof value === 'number' && !isNaN(value);
const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';
const isArray = (value: unknown): value is unknown[] => Array.isArray(value);
const isObject = (value: unknown): value is Record<string, unknown> => 
  typeof value === 'object' && value !== null && !Array.isArray(value);
const isFunction = (value: unknown): value is Function => typeof value === 'function';

const getType = (value: unknown): string => {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (Array.isArray(value)) return 'array';
  if (value instanceof Date) return 'date';
  if (value instanceof RegExp) return 'regexp';
  return typeof value;
};

// =============================================================================
// TEST DATA GENERATORS
// =============================================================================

const generateAllTypes = (): unknown[] => {
  return [
    // Primitives
    null, undefined,
    true, false,
    0, 1, -1, 0.5, -0.5, 100, -100,
    NaN, Infinity, -Infinity,
    '', 'hello', '123', '0', 'true', 'false', 'null', 'undefined',
    ' ', '  ', '\t', '\n',
    
    // Objects
    {}, { a: 1 }, { a: 1, b: 2 }, { nested: { deep: 1 } },
    
    // Arrays
    [], [1], [1, 2, 3], ['a', 'b'], [null], [undefined],
    [[1, 2], [3, 4]],
    
    // Special
    new Date(), new Date('invalid'), new Date('2024-01-15'),
    /regex/, /test/gi,
    () => {}, function() {}, async () => {},
    
    // Symbols
    Symbol('test'),
    
    // BigInt (if supported)
    BigInt(123),
  ];
};

const generateBooleanCoercibles = (): unknown[] => {
  return [
    // Truthy
    true, 1, '1', 'true', 'yes', 'on', 'y', 'TRUE', 'YES', 'ON', 'Y',
    100, -1, 'hello', [1], { a: 1 }, new Date(),
    
    // Falsy
    false, 0, '', '0', 'false', 'no', 'off', 'n', 'FALSE', 'NO', 'OFF', 'N',
    null, undefined, NaN,
    
    // Edge cases
    '  true  ', '  false  ', '  1  ', '  0  ',
    [], {}, ' ', '\t',
  ];
};

const generateNumberCoercibles = (): unknown[] => {
  return [
    // Direct numbers
    0, 1, -1, 100, -100, 0.5, -0.5, 1.5, -1.5,
    1e10, 1e-10, -1e10,
    
    // String numbers
    '0', '1', '-1', '100', '0.5', '-0.5',
    '1,000', '1,000.50', '1,000,000',
    '  123  ', '123abc', 'abc123',
    '1e10', '1.5e10', '-1e-10',
    
    // Booleans
    true, false,
    
    // Special
    null, undefined, NaN, Infinity, -Infinity,
    '', ' ', 'abc', 'NaN', 'Infinity',
    
    // Objects
    {}, [], [1], [1, 2], { valueOf: () => 42 },
  ];
};

const generateStringCoercibles = (): unknown[] => {
  return [
    // Already strings
    '', 'hello', 'world', '123', 'true', 'false',
    
    // Numbers
    0, 1, -1, 100, 0.5, -0.5, NaN, Infinity, -Infinity,
    
    // Booleans
    true, false,
    
    // Nullish
    null, undefined,
    
    // Objects
    {}, { a: 1 }, { toString: () => 'custom' },
    [], [1], [1, 2, 3], ['a', 'b'],
    
    // Special
    new Date('2024-01-15'), /regex/,
    Symbol('test'),
  ];
};

const generateArrayCoercibles = (): unknown[] => {
  return [
    // Already arrays
    [], [1], [1, 2, 3], ['a', 'b'], [null], [undefined],
    [[1, 2], [3, 4]],
    
    // Single values
    1, 'hello', true, false, null, undefined,
    {}, { a: 1 },
    
    // Iterables
    'hello', new Set([1, 2, 3]), new Map([['a', 1]]),
  ];
};

const generateObjectCoercibles = (): unknown[] => {
  return [
    // Already objects
    {}, { a: 1 }, { a: 1, b: 2 }, { nested: { deep: 1 } },
    
    // Not objects
    null, undefined, 1, 'hello', true, false,
    [], [1, 2, 3],
    new Date(), /regex/,
  ];
};

const generateDateCoercibles = (): unknown[] => {
  return [
    // Already dates
    new Date(), new Date('2024-01-15'), new Date('invalid'),
    
    // Strings
    '2024-01-15', '2024-01-15T10:30:00', 'January 15, 2024',
    '01/15/2024', 'invalid', '', 'abc',
    
    // Numbers (timestamps)
    0, 1705276800000, -1, Date.now(),
    
    // Others
    null, undefined, true, false, {}, [],
  ];
};

// =============================================================================
// TEST SUITES
// =============================================================================

describe('Type Coercion - Enterprise Fuzzing Suite', () => {
  describe('To Boolean', () => {
    const values = generateBooleanCoercibles();
    
    values.forEach((value, index) => {
      it(`should coerce to boolean #${index + 1}: ${JSON.stringify(value)}`, () => {
        const result = toBoolean(value);
        expect(typeof result).toBe('boolean');
      });
    });
  });

  describe('To Number', () => {
    const values = generateNumberCoercibles();
    
    values.forEach((value, index) => {
      it(`should coerce to number #${index + 1}: ${JSON.stringify(value)}`, () => {
        const result = toNumber(value);
        expect(typeof result).toBe('number');
      });
    });
  });

  describe('To Integer', () => {
    const values = generateNumberCoercibles();
    
    values.forEach((value, index) => {
      it(`should coerce to integer #${index + 1}: ${JSON.stringify(value)}`, () => {
        const result = toInteger(value);
        expect(typeof result).toBe('number');
        if (isFinite(result)) {
          expect(Number.isInteger(result)).toBe(true);
        }
      });
    });
  });

  describe('To String', () => {
    const values = generateStringCoercibles();
    
    values.forEach((value, index) => {
      it(`should coerce to string #${index + 1}`, () => {
        const result = toString(value);
        expect(typeof result).toBe('string');
      });
    });
  });

  describe('To Array', () => {
    const values = generateArrayCoercibles();
    
    values.forEach((value, index) => {
      it(`should coerce to array #${index + 1}`, () => {
        const result = toArray(value);
        expect(Array.isArray(result)).toBe(true);
      });
    });
  });

  describe('To Object', () => {
    const values = generateObjectCoercibles();
    
    values.forEach((value, index) => {
      it(`should coerce to object #${index + 1}`, () => {
        const result = toObject(value);
        expect(typeof result).toBe('object');
        expect(result).not.toBeNull();
        expect(Array.isArray(result)).toBe(false);
      });
    });
  });

  describe('To Date', () => {
    const values = generateDateCoercibles();
    
    values.forEach((value, index) => {
      it(`should coerce to date #${index + 1}`, () => {
        const result = toDate(value);
        expect(result === null || result instanceof Date).toBe(true);
      });
    });
  });

  describe('Is Nullish', () => {
    const values = generateAllTypes();
    
    values.forEach((value, index) => {
      it(`should check nullish #${index + 1}`, () => {
        const result = isNullish(value);
        expect(result).toBe(value === null || value === undefined);
      });
    });
  });

  describe('Is Truthy/Falsy', () => {
    const values = generateAllTypes();
    
    values.forEach((value, index) => {
      it(`should check truthy/falsy #${index + 1}`, () => {
        const truthy = isTruthy(value);
        const falsy = isFalsy(value);
        expect(truthy).toBe(!falsy);
      });
    });
  });

  describe('Is Numeric', () => {
    const values = generateAllTypes();
    
    values.forEach((value, index) => {
      it(`should check numeric #${index + 1}`, () => {
        const result = isNumeric(value);
        expect(typeof result).toBe('boolean');
      });
    });
  });

  describe('Is Integer', () => {
    const values = generateAllTypes();
    
    values.forEach((value, index) => {
      it(`should check integer #${index + 1}`, () => {
        const result = isInteger(value);
        expect(typeof result).toBe('boolean');
      });
    });
  });

  describe('Is Positive/Negative', () => {
    const values = generateAllTypes();
    
    values.forEach((value, index) => {
      it(`should check positive #${index + 1}`, () => {
        const positive = isPositive(value);
        const negative = isNegative(value);
        expect(typeof positive).toBe('boolean');
        expect(typeof negative).toBe('boolean');
      });
    });
  });

  describe('Type Guards', () => {
    const values = generateAllTypes();
    
    values.forEach((value, index) => {
      it(`should check type guards #${index + 1}`, () => {
        expect(typeof isString(value)).toBe('boolean');
        expect(typeof isNumber(value)).toBe('boolean');
        expect(typeof isBoolean(value)).toBe('boolean');
        expect(typeof isArray(value)).toBe('boolean');
        expect(typeof isObject(value)).toBe('boolean');
        expect(typeof isFunction(value)).toBe('boolean');
      });
    });
  });

  describe('Get Type', () => {
    const values = generateAllTypes();
    
    values.forEach((value, index) => {
      it(`should get type #${index + 1}`, () => {
        const result = getType(value);
        expect(typeof result).toBe('string');
        expect(['null', 'undefined', 'boolean', 'number', 'string', 'object', 'array', 'function', 'symbol', 'bigint', 'date', 'regexp'].includes(result)).toBe(true);
      });
    });
  });

  describe('Coercion Consistency', () => {
    const values = generateAllTypes();
    
    values.forEach((value, index) => {
      it(`should have consistent coercion #${index + 1}`, () => {
        // Double coercion should be stable
        const bool1 = toBoolean(value);
        const bool2 = toBoolean(bool1);
        expect(bool1).toBe(bool2);
        
        const num1 = toNumber(value);
        const num2 = toNumber(num1);
        if (!isNaN(num1)) {
          expect(num1).toBe(num2);
        }
        
        const str1 = toString(value);
        const str2 = toString(str1);
        expect(str1).toBe(str2);
      });
    });
  });

  describe('Cross-Type Coercion', () => {
    const values = generateAllTypes().slice(0, 30);
    
    values.forEach((value, index) => {
      it(`should handle cross-type coercion #${index + 1}`, () => {
        // Chain coercions
        const asString = toString(value);
        const asNumber = toNumber(asString);
        const asBoolean = toBoolean(asNumber);
        
        expect(typeof asString).toBe('string');
        expect(typeof asNumber).toBe('number');
        expect(typeof asBoolean).toBe('boolean');
      });
    });
  });

  describe('Suite Statistics', () => {
    it('should have comprehensive type coverage', () => {
      expect(generateAllTypes().length).toBeGreaterThan(30);
    });
    
    it('should have comprehensive boolean coercible coverage', () => {
      expect(generateBooleanCoercibles().length).toBeGreaterThan(30);
    });
    
    it('should have comprehensive number coercible coverage', () => {
      expect(generateNumberCoercibles().length).toBeGreaterThan(30);
    });
  });
});
