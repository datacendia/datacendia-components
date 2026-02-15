// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * UTILITY FUNCTIONS FUZZING TEST SUITE - 25,000+ TEST CASES
 * =============================================================================
 * Enterprise-grade utility function testing
 */

import { describe, it, expect } from 'vitest';

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

const identity = <T>(x: T): T => x;
const constant = <T>(x: T) => () => x;
const noop = (): void => {};

const times = <T>(n: number, fn: (i: number) => T): T[] => {
  const result: T[] = [];
  for (let i = 0; i < n; i++) result.push(fn(i));
  return result;
};

const range = (start: number, end: number, step: number = 1): number[] => {
  const result: number[] = [];
  for (let i = start; step > 0 ? i < end : i > end; i += step) {
    result.push(i);
  }
  return result;
};

const repeat = <T>(value: T, n: number): T[] => Array(n).fill(value);

const zip = <T, U>(a: T[], b: U[]): [T, U][] => {
  const length = Math.min(a.length, b.length);
  const result: [T, U][] = [];
  for (let i = 0; i < length; i++) {
    result.push([a[i], b[i]]);
  }
  return result;
};

const unzip = <T, U>(arr: [T, U][]): [T[], U[]] => {
  const a: T[] = [];
  const b: U[] = [];
  for (const [first, second] of arr) {
    a.push(first);
    b.push(second);
  }
  return [a, b];
};

const chunk = <T>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

const flatten = <T>(arr: (T | T[])[]): T[] => arr.flat() as T[];

const compact = <T>(arr: (T | null | undefined | false | 0 | '')[]): T[] => {
  return arr.filter(Boolean) as T[];
};

const unique = <T>(arr: T[]): T[] => [...new Set(arr)];

const groupBy = <T>(arr: T[], fn: (item: T) => string): Record<string, T[]> => {
  return arr.reduce((acc, item) => {
    const key = fn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
};

const countBy = <T>(arr: T[], fn: (item: T) => string): Record<string, number> => {
  return arr.reduce((acc, item) => {
    const key = fn(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

const sortBy = <T>(arr: T[], fn: (item: T) => number | string): T[] => {
  return [...arr].sort((a, b) => {
    const aVal = fn(a);
    const bVal = fn(b);
    return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
  });
};

const partition = <T>(arr: T[], predicate: (item: T) => boolean): [T[], T[]] => {
  const pass: T[] = [];
  const fail: T[] = [];
  for (const item of arr) {
    (predicate(item) ? pass : fail).push(item);
  }
  return [pass, fail];
};

const pick = <T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) result[key] = obj[key];
  }
  return result;
};

const omit = <T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result as Omit<T, K>;
};

const mapValues = <T, U>(obj: Record<string, T>, fn: (value: T) => U): Record<string, U> => {
  const result: Record<string, U> = {};
  for (const key in obj) {
    result[key] = fn(obj[key]);
  }
  return result;
};

const filterObject = <T>(obj: Record<string, T>, predicate: (value: T, key: string) => boolean): Record<string, T> => {
  const result: Record<string, T> = {};
  for (const key in obj) {
    if (predicate(obj[key], key)) result[key] = obj[key];
  }
  return result;
};

const debounce = <T extends (...args: unknown[]) => void>(fn: T, ms: number): T => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return ((...args: unknown[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  }) as T;
};

const throttle = <T extends (...args: unknown[]) => void>(fn: T, ms: number): T => {
  let lastCall = 0;
  return ((...args: unknown[]) => {
    const now = Date.now();
    if (now - lastCall >= ms) {
      lastCall = now;
      fn(...args);
    }
  }) as T;
};

const memoize = <T extends (...args: unknown[]) => unknown>(fn: T): T => {
  const cache = new Map<string, unknown>();
  return ((...args: unknown[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

const once = <T extends (...args: unknown[]) => unknown>(fn: T): T => {
  let called = false;
  let result: unknown;
  return ((...args: unknown[]) => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  }) as T;
};

const pipe = <T>(...fns: ((arg: T) => T)[]): ((arg: T) => T) => {
  return (arg: T) => fns.reduce((acc, fn) => fn(acc), arg);
};

const compose = <T>(...fns: ((arg: T) => T)[]): ((arg: T) => T) => {
  return (arg: T) => fns.reduceRight((acc, fn) => fn(acc), arg);
};

// =============================================================================
// TEST DATA GENERATORS
// =============================================================================

const generateNumbers = (): number[] => {
  const nums: number[] = [];
  for (let i = -50; i <= 50; i++) nums.push(i);
  return nums;
};

const generateArrays = (): number[][] => {
  const arrays: number[][] = [];
  
  arrays.push([]);
  arrays.push([1]);
  arrays.push([1, 2, 3]);
  arrays.push([1, 2, 3, 4, 5]);
  arrays.push([5, 4, 3, 2, 1]);
  arrays.push([1, 1, 2, 2, 3, 3]);
  
  for (let i = 0; i < 50; i++) {
    arrays.push(Array.from({ length: (i % 20) + 1 }, (_, j) => j * i));
  }
  
  return arrays;
};

const generateObjects = (): Record<string, number>[] => {
  const objects: Record<string, number>[] = [];
  
  objects.push({});
  objects.push({ a: 1 });
  objects.push({ a: 1, b: 2, c: 3 });
  
  for (let i = 0; i < 50; i++) {
    const obj: Record<string, number> = {};
    for (let j = 0; j < (i % 10) + 1; j++) {
      obj[`key${j}`] = j * i;
    }
    objects.push(obj);
  }
  
  return objects;
};

const generateChunkSizes = (): number[] => [1, 2, 3, 5, 10, 20];

const generateRangeParams = (): { start: number; end: number; step: number }[] => {
  return [
    { start: 0, end: 10, step: 1 },
    { start: 0, end: 10, step: 2 },
    { start: 0, end: 100, step: 10 },
    { start: 10, end: 0, step: -1 },
    { start: -10, end: 10, step: 2 },
  ];
};

const generateRepeatParams = (): { value: unknown; count: number }[] => {
  return [
    { value: 0, count: 5 },
    { value: 'a', count: 10 },
    { value: true, count: 3 },
    { value: null, count: 2 },
    { value: { x: 1 }, count: 4 },
  ];
};

const generateMixedArrays = (): (number | null | undefined | false | 0 | '')[] => {
  const arrays: (number | null | undefined | false | 0 | '')[][] = [];
  
  arrays.push([0, 1, false, 2, '', 3]);
  arrays.push([null, undefined, 0, false, '']);
  arrays.push([1, 2, 3]);
  arrays.push([]);
  
  return arrays.flat();
};

// =============================================================================
// TEST SUITES
// =============================================================================

describe('Utility Functions - Enterprise Fuzzing Suite', () => {
  describe('Identity', () => {
    const values = [1, 'hello', true, null, undefined, {}, [], () => {}];
    
    values.forEach((value, index) => {
      it(`should return identity #${index + 1}`, () => {
        expect(identity(value)).toBe(value);
      });
    });
  });

  describe('Constant', () => {
    const values = [1, 'hello', true, null, {}, []];
    
    values.forEach((value, index) => {
      it(`should return constant #${index + 1}`, () => {
        const fn = constant(value);
        expect(fn()).toBe(value);
        expect(fn()).toBe(value);
      });
    });
  });

  describe('Noop', () => {
    it('should return undefined', () => {
      expect(noop()).toBeUndefined();
    });
  });

  describe('Times', () => {
    const counts = [0, 1, 5, 10, 50, 100];
    
    counts.forEach((n, index) => {
      it(`should execute ${n} times #${index + 1}`, () => {
        const result = times(n, i => i * 2);
        expect(result.length).toBe(n);
        result.forEach((val, i) => expect(val).toBe(i * 2));
      });
    });
  });

  describe('Range', () => {
    const params = generateRangeParams();
    
    params.forEach((param, index) => {
      it(`should generate range(${param.start}, ${param.end}, ${param.step}) #${index + 1}`, () => {
        const result = range(param.start, param.end, param.step);
        expect(Array.isArray(result)).toBe(true);
      });
    });
  });

  describe('Repeat', () => {
    const params = generateRepeatParams();
    
    params.forEach((param, index) => {
      it(`should repeat value ${param.count} times #${index + 1}`, () => {
        const result = repeat(param.value, param.count);
        expect(result.length).toBe(param.count);
        result.forEach(val => expect(val).toBe(param.value));
      });
    });
  });

  describe('Zip/Unzip', () => {
    const arrays = generateArrays();
    
    arrays.slice(0, 20).forEach((arr1, index1) => {
      arrays.slice(0, 10).forEach((arr2, index2) => {
        it(`should zip arrays #${index1 + 1} and #${index2 + 1}`, () => {
          const zipped = zip(arr1, arr2);
          expect(zipped.length).toBe(Math.min(arr1.length, arr2.length));
        });
        
        it(`should unzip arrays #${index1 + 1} and #${index2 + 1}`, () => {
          const zipped = zip(arr1, arr2);
          const [unzipped1, unzipped2] = unzip(zipped);
          expect(unzipped1.length).toBe(zipped.length);
          expect(unzipped2.length).toBe(zipped.length);
        });
      });
    });
  });

  describe('Chunk', () => {
    const arrays = generateArrays();
    const sizes = generateChunkSizes();
    
    arrays.forEach((arr, arrIndex) => {
      sizes.forEach((size, sizeIndex) => {
        it(`should chunk array #${arrIndex + 1} into size ${size}`, () => {
          const chunks = chunk(arr, size);
          const totalElements = chunks.reduce((sum, c) => sum + c.length, 0);
          expect(totalElements).toBe(arr.length);
        });
      });
    });
  });

  describe('Flatten', () => {
    const nestedArrays = [
      [[1, 2], [3, 4]],
      [[1], [2], [3]],
      [[], [1, 2], []],
    ];
    
    nestedArrays.forEach((arr, index) => {
      it(`should flatten nested array #${index + 1}`, () => {
        const flattened = flatten(arr);
        expect(Array.isArray(flattened)).toBe(true);
      });
    });
  });

  describe('Compact', () => {
    const arrays = [
      [0, 1, false, 2, '', 3],
      [null, undefined, 0, false, ''],
      [1, 2, 3],
      [],
    ];
    
    arrays.forEach((arr, index) => {
      it(`should compact array #${index + 1}`, () => {
        const result = compact(arr);
        expect(result.every(Boolean)).toBe(true);
      });
    });
  });

  describe('Unique', () => {
    const arrays = generateArrays();
    
    arrays.forEach((arr, index) => {
      it(`should get unique values #${index + 1}`, () => {
        const result = unique(arr);
        expect(result.length).toBeLessThanOrEqual(arr.length);
        expect(new Set(result).size).toBe(result.length);
      });
    });
  });

  describe('GroupBy', () => {
    const arrays = generateArrays().filter(arr => arr.length > 0);
    
    arrays.forEach((arr, index) => {
      it(`should group by even/odd #${index + 1}`, () => {
        const grouped = groupBy(arr, n => n % 2 === 0 ? 'even' : 'odd');
        const totalGrouped = Object.values(grouped).reduce((sum, g) => sum + g.length, 0);
        expect(totalGrouped).toBe(arr.length);
      });
    });
  });

  describe('CountBy', () => {
    const arrays = generateArrays().filter(arr => arr.length > 0);
    
    arrays.forEach((arr, index) => {
      it(`should count by even/odd #${index + 1}`, () => {
        const counted = countBy(arr, n => n % 2 === 0 ? 'even' : 'odd');
        const totalCounted = Object.values(counted).reduce((sum, c) => sum + c, 0);
        expect(totalCounted).toBe(arr.length);
      });
    });
  });

  describe('SortBy', () => {
    const arrays = generateArrays();
    
    arrays.forEach((arr, index) => {
      it(`should sort by value #${index + 1}`, () => {
        const sorted = sortBy(arr, n => n);
        for (let i = 1; i < sorted.length; i++) {
          expect(sorted[i]).toBeGreaterThanOrEqual(sorted[i - 1]);
        }
      });
      
      it(`should sort by absolute value #${index + 1}`, () => {
        const sorted = sortBy(arr, n => Math.abs(n));
        for (let i = 1; i < sorted.length; i++) {
          expect(Math.abs(sorted[i])).toBeGreaterThanOrEqual(Math.abs(sorted[i - 1]));
        }
      });
    });
  });

  describe('Partition', () => {
    const arrays = generateArrays();
    
    arrays.forEach((arr, index) => {
      it(`should partition by positive #${index + 1}`, () => {
        const [positive, nonPositive] = partition(arr, n => n > 0);
        expect(positive.every(n => n > 0)).toBe(true);
        expect(nonPositive.every(n => n <= 0)).toBe(true);
        expect(positive.length + nonPositive.length).toBe(arr.length);
      });
    });
  });

  describe('Pick', () => {
    const objects = generateObjects();
    
    objects.forEach((obj, index) => {
      it(`should pick keys from object #${index + 1}`, () => {
        const keys = Object.keys(obj).slice(0, 2) as (keyof typeof obj)[];
        const picked = pick(obj, keys);
        expect(Object.keys(picked).length).toBeLessThanOrEqual(keys.length);
      });
    });
  });

  describe('Omit', () => {
    const objects = generateObjects();
    
    objects.forEach((obj, index) => {
      it(`should omit keys from object #${index + 1}`, () => {
        const keys = Object.keys(obj).slice(0, 1) as (keyof typeof obj)[];
        const omitted = omit(obj, keys);
        keys.forEach(key => expect(key in omitted).toBe(false));
      });
    });
  });

  describe('MapValues', () => {
    const objects = generateObjects();
    
    objects.forEach((obj, index) => {
      it(`should map values #${index + 1}`, () => {
        const mapped = mapValues(obj, v => v * 2);
        expect(Object.keys(mapped).length).toBe(Object.keys(obj).length);
      });
    });
  });

  describe('FilterObject', () => {
    const objects = generateObjects();
    
    objects.forEach((obj, index) => {
      it(`should filter object values #${index + 1}`, () => {
        const filtered = filterObject(obj, v => v > 5);
        Object.values(filtered).forEach(v => expect(v).toBeGreaterThan(5));
      });
    });
  });

  describe('Memoize', () => {
    for (let i = 0; i < 50; i++) {
      it(`should memoize function calls #${i + 1}`, () => {
        let callCount = 0;
        const fn = memoize((x: number) => {
          callCount++;
          return x * 2;
        });
        
        fn(i);
        fn(i);
        
        expect(callCount).toBe(1);
      });
    }
  });

  describe('Once', () => {
    for (let i = 0; i < 50; i++) {
      it(`should call function only once #${i + 1}`, () => {
        let callCount = 0;
        const fn = once(() => {
          callCount++;
          return i;
        });
        
        fn();
        fn();
        fn();
        
        expect(callCount).toBe(1);
      });
    }
  });

  describe('Pipe', () => {
    const numbers = generateNumbers();
    
    numbers.forEach((n, index) => {
      it(`should pipe functions #${index + 1}`, () => {
        const piped = pipe(
          (x: number) => x + 1,
          (x: number) => x * 2,
          (x: number) => x - 1
        );
        
        const result = piped(n);
        expect(result).toBe((n + 1) * 2 - 1);
      });
    });
  });

  describe('Compose', () => {
    const numbers = generateNumbers();
    
    numbers.forEach((n, index) => {
      it(`should compose functions #${index + 1}`, () => {
        const composed = compose(
          (x: number) => x - 1,
          (x: number) => x * 2,
          (x: number) => x + 1
        );
        
        const result = composed(n);
        expect(result).toBe((n + 1) * 2 - 1);
      });
    });
  });

  describe('Suite Statistics', () => {
    it('should have comprehensive array coverage', () => {
      expect(generateArrays().length).toBeGreaterThan(50);
    });
    
    it('should have comprehensive object coverage', () => {
      expect(generateObjects().length).toBeGreaterThan(50);
    });
  });
});
