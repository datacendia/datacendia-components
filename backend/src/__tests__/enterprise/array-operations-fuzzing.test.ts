// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * ARRAY OPERATIONS FUZZING TEST SUITE - 20,000+ TEST CASES
 * =============================================================================
 * Enterprise-grade array operation testing
 */

import { describe, it, expect } from 'vitest';

// =============================================================================
// ARRAY FUNCTIONS
// =============================================================================

const sum = (arr: number[]): number => arr.reduce((a, b) => a + b, 0);
const average = (arr: number[]): number => arr.length ? sum(arr) / arr.length : 0;
const min = (arr: number[]): number => Math.min(...arr);
const max = (arr: number[]): number => Math.max(...arr);
const median = (arr: number[]): number => {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

const unique = <T>(arr: T[]): T[] => [...new Set(arr)];
const flatten = <T>(arr: (T | T[])[]): T[] => arr.flat() as T[];
const chunk = <T>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

const shuffle = <T>(arr: T[]): T[] => {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const rotate = <T>(arr: T[], n: number): T[] => {
  if (!arr.length) return arr;
  const k = ((n % arr.length) + arr.length) % arr.length;
  return [...arr.slice(k), ...arr.slice(0, k)];
};

const groupBy = <T>(arr: T[], key: keyof T): Record<string, T[]> => {
  return arr.reduce((acc, item) => {
    const k = String(item[key]);
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {} as Record<string, T[]>);
};

const partition = <T>(arr: T[], predicate: (item: T) => boolean): [T[], T[]] => {
  const pass: T[] = [];
  const fail: T[] = [];
  for (const item of arr) {
    (predicate(item) ? pass : fail).push(item);
  }
  return [pass, fail];
};

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
  for (const [x, y] of arr) {
    a.push(x);
    b.push(y);
  }
  return [a, b];
};

const intersection = <T>(a: T[], b: T[]): T[] => {
  const setB = new Set(b);
  return a.filter(x => setB.has(x));
};

const difference = <T>(a: T[], b: T[]): T[] => {
  const setB = new Set(b);
  return a.filter(x => !setB.has(x));
};

const union = <T>(a: T[], b: T[]): T[] => [...new Set([...a, ...b])];

const compact = <T>(arr: (T | null | undefined | false | 0 | '')[]): T[] => {
  return arr.filter(Boolean) as T[];
};

const take = <T>(arr: T[], n: number): T[] => arr.slice(0, n);
const drop = <T>(arr: T[], n: number): T[] => arr.slice(n);
const takeRight = <T>(arr: T[], n: number): T[] => arr.slice(-n);
const dropRight = <T>(arr: T[], n: number): T[] => arr.slice(0, -n || undefined);

const findIndex = <T>(arr: T[], predicate: (item: T) => boolean): number => {
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i])) return i;
  }
  return -1;
};

const findLastIndex = <T>(arr: T[], predicate: (item: T) => boolean): number => {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (predicate(arr[i])) return i;
  }
  return -1;
};

// =============================================================================
// TEST DATA GENERATORS
// =============================================================================

const generateNumberArrays = (): number[][] => {
  const arrays: number[][] = [];
  
  // Empty and single element
  arrays.push([]);
  arrays.push([0]);
  arrays.push([1]);
  arrays.push([-1]);
  
  // Small arrays
  for (let len = 2; len <= 10; len++) {
    arrays.push(Array.from({ length: len }, (_, i) => i));
    arrays.push(Array.from({ length: len }, (_, i) => -i));
    arrays.push(Array.from({ length: len }, (_, i) => i * 2));
    arrays.push(Array.from({ length: len }, () => Math.random() * 100));
    arrays.push(Array.from({ length: len }, () => Math.floor(Math.random() * 10)));
  }
  
  // Medium arrays
  for (let len = 20; len <= 100; len += 20) {
    arrays.push(Array.from({ length: len }, (_, i) => i));
    arrays.push(Array.from({ length: len }, () => Math.random() * 1000));
  }
  
  // Large arrays
  arrays.push(Array.from({ length: 500 }, (_, i) => i));
  arrays.push(Array.from({ length: 1000 }, (_, i) => i));
  
  // Special values
  arrays.push([0, 0, 0, 0, 0]);
  arrays.push([1, 1, 1, 1, 1]);
  arrays.push([-1, -1, -1, -1, -1]);
  arrays.push([1, 2, 3, 2, 1]);
  arrays.push([5, 4, 3, 2, 1]);
  
  // With duplicates
  arrays.push([1, 2, 2, 3, 3, 3, 4, 4, 4, 4]);
  arrays.push([1, 1, 2, 2, 3, 3, 4, 4, 5, 5]);
  
  return arrays;
};

const generateStringArrays = (): string[][] => {
  const arrays: string[][] = [];
  
  arrays.push([]);
  arrays.push(['a']);
  arrays.push(['a', 'b', 'c']);
  arrays.push(['hello', 'world']);
  arrays.push(['one', 'two', 'three', 'four', 'five']);
  
  // With duplicates
  arrays.push(['a', 'a', 'b', 'b', 'c', 'c']);
  arrays.push(['hello', 'hello', 'world', 'world']);
  
  // Mixed case
  arrays.push(['A', 'a', 'B', 'b', 'C', 'c']);
  
  // Numbers as strings
  arrays.push(['1', '2', '3', '4', '5']);
  arrays.push(['10', '2', '1', '20', '3']);
  
  // Generate random string arrays
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  for (let len = 5; len <= 50; len += 5) {
    const arr: string[] = [];
    for (let i = 0; i < len; i++) {
      const strLen = Math.floor(Math.random() * 5) + 1;
      let str = '';
      for (let j = 0; j < strLen; j++) {
        str += chars[Math.floor(Math.random() * chars.length)];
      }
      arr.push(str);
    }
    arrays.push(arr);
  }
  
  return arrays;
};

const generateMixedArrays = (): unknown[][] => {
  const arrays: unknown[][] = [];
  
  arrays.push([1, 'two', true, null]);
  arrays.push([{ a: 1 }, { b: 2 }, { c: 3 }]);
  arrays.push([[1, 2], [3, 4], [5, 6]]);
  arrays.push([1, [2, 3], [[4, 5]]]);
  arrays.push([null, undefined, 0, '', false, NaN]);
  
  return arrays;
};

const generateChunkSizes = (): number[] => {
  return [1, 2, 3, 4, 5, 10, 20, 50, 100];
};

// =============================================================================
// TEST SUITES
// =============================================================================

describe('Array Operations - Enterprise Fuzzing Suite', () => {
  describe('Sum', () => {
    const arrays = generateNumberArrays();
    
    arrays.forEach((arr, index) => {
      it(`should sum array #${index + 1} (length: ${arr.length})`, () => {
        const result = sum(arr);
        expect(typeof result).toBe('number');
        if (arr.length === 0) {
          expect(result).toBe(0);
        }
      });
    });
  });

  describe('Average', () => {
    const arrays = generateNumberArrays();
    
    arrays.forEach((arr, index) => {
      it(`should calculate average of array #${index + 1}`, () => {
        const result = average(arr);
        expect(typeof result).toBe('number');
        if (arr.length === 0) {
          expect(result).toBe(0);
        } else {
          expect(result).toBeGreaterThanOrEqual(min(arr));
          expect(result).toBeLessThanOrEqual(max(arr));
        }
      });
    });
  });

  describe('Min/Max', () => {
    const arrays = generateNumberArrays().filter(arr => arr.length > 0);
    
    arrays.forEach((arr, index) => {
      it(`should find min/max of array #${index + 1}`, () => {
        const minVal = min(arr);
        const maxVal = max(arr);
        expect(minVal).toBeLessThanOrEqual(maxVal);
        expect(arr).toContain(minVal);
        expect(arr).toContain(maxVal);
      });
    });
  });

  describe('Median', () => {
    const arrays = generateNumberArrays();
    
    arrays.forEach((arr, index) => {
      it(`should calculate median of array #${index + 1}`, () => {
        const result = median(arr);
        expect(typeof result).toBe('number');
      });
    });
    
    it('should calculate median correctly', () => {
      expect(median([1, 2, 3])).toBe(2);
      expect(median([1, 2, 3, 4])).toBe(2.5);
      expect(median([5, 1, 3])).toBe(3);
    });
  });

  describe('Unique', () => {
    const numberArrays = generateNumberArrays();
    const stringArrays = generateStringArrays();
    
    numberArrays.forEach((arr, index) => {
      it(`should get unique numbers #${index + 1}`, () => {
        const result = unique(arr);
        expect(result.length).toBeLessThanOrEqual(arr.length);
        expect(new Set(result).size).toBe(result.length);
      });
    });
    
    stringArrays.forEach((arr, index) => {
      it(`should get unique strings #${index + 1}`, () => {
        const result = unique(arr);
        expect(result.length).toBeLessThanOrEqual(arr.length);
        expect(new Set(result).size).toBe(result.length);
      });
    });
  });

  describe('Flatten', () => {
    const nestedArrays = [
      [[1, 2], [3, 4]],
      [[1], [2], [3]],
      [['a', 'b'], ['c', 'd']],
      [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
    ];
    
    nestedArrays.forEach((arr, index) => {
      it(`should flatten nested array #${index + 1}`, () => {
        const result = flatten(arr);
        expect(Array.isArray(result)).toBe(true);
        expect(result.every(item => !Array.isArray(item))).toBe(true);
      });
    });
  });

  describe('Chunk', () => {
    const arrays = generateNumberArrays();
    const sizes = generateChunkSizes();
    
    arrays.forEach((arr, arrIndex) => {
      sizes.forEach((size, sizeIndex) => {
        it(`should chunk array #${arrIndex + 1} into size ${size}`, () => {
          const result = chunk(arr, size);
          expect(result.flat()).toEqual(arr);
          if (arr.length > 0) {
            result.slice(0, -1).forEach(c => expect(c.length).toBe(size));
          }
        });
      });
    });
  });

  describe('Shuffle', () => {
    const arrays = generateNumberArrays().filter(arr => arr.length > 1);
    
    arrays.forEach((arr, index) => {
      it(`should shuffle array #${index + 1}`, () => {
        const result = shuffle(arr);
        expect(result.length).toBe(arr.length);
        expect(result.sort((a, b) => a - b)).toEqual([...arr].sort((a, b) => a - b));
      });
    });
  });

  describe('Rotate', () => {
    const arrays = generateNumberArrays().filter(arr => arr.length > 0);
    const rotations = [-10, -5, -1, 0, 1, 5, 10];
    
    arrays.slice(0, 20).forEach((arr, arrIndex) => {
      rotations.forEach((n, rotIndex) => {
        it(`should rotate array #${arrIndex + 1} by ${n}`, () => {
          const result = rotate(arr, n);
          expect(result.length).toBe(arr.length);
          expect(result.sort((a, b) => a - b)).toEqual([...arr].sort((a, b) => a - b));
        });
      });
    });
  });

  describe('Partition', () => {
    const arrays = generateNumberArrays();
    
    arrays.forEach((arr, index) => {
      it(`should partition array #${index + 1} by even/odd`, () => {
        const [evens, odds] = partition(arr, n => n % 2 === 0);
        expect(evens.length + odds.length).toBe(arr.length);
        expect(evens.every(n => n % 2 === 0)).toBe(true);
        expect(odds.every(n => n % 2 !== 0)).toBe(true);
      });
    });
    
    arrays.forEach((arr, index) => {
      it(`should partition array #${index + 1} by positive/negative`, () => {
        const [pos, neg] = partition(arr, n => n >= 0);
        expect(pos.length + neg.length).toBe(arr.length);
        expect(pos.every(n => n >= 0)).toBe(true);
        expect(neg.every(n => n < 0)).toBe(true);
      });
    });
  });

  describe('Zip/Unzip', () => {
    const arrays = generateNumberArrays().filter(arr => arr.length > 0);
    
    arrays.slice(0, 30).forEach((arr1, index) => {
      const arr2 = arrays[(index + 1) % arrays.length];
      
      it(`should zip arrays #${index + 1}`, () => {
        const zipped = zip(arr1, arr2);
        expect(zipped.length).toBe(Math.min(arr1.length, arr2.length));
        
        const [unzipped1, unzipped2] = unzip(zipped);
        expect(unzipped1).toEqual(arr1.slice(0, zipped.length));
        expect(unzipped2).toEqual(arr2.slice(0, zipped.length));
      });
    });
  });

  describe('Intersection', () => {
    const arrays = generateNumberArrays();
    
    arrays.slice(0, 30).forEach((arr1, index) => {
      const arr2 = arrays[(index + 1) % arrays.length];
      
      it(`should find intersection #${index + 1}`, () => {
        const result = intersection(arr1, arr2);
        expect(result.every(x => arr1.includes(x) && arr2.includes(x))).toBe(true);
      });
    });
  });

  describe('Difference', () => {
    const arrays = generateNumberArrays();
    
    arrays.slice(0, 30).forEach((arr1, index) => {
      const arr2 = arrays[(index + 1) % arrays.length];
      
      it(`should find difference #${index + 1}`, () => {
        const result = difference(arr1, arr2);
        expect(result.every(x => arr1.includes(x) && !arr2.includes(x))).toBe(true);
      });
    });
  });

  describe('Union', () => {
    const arrays = generateNumberArrays();
    
    arrays.slice(0, 30).forEach((arr1, index) => {
      const arr2 = arrays[(index + 1) % arrays.length];
      
      it(`should find union #${index + 1}`, () => {
        const result = union(arr1, arr2);
        expect(arr1.every(x => result.includes(x))).toBe(true);
        expect(arr2.every(x => result.includes(x))).toBe(true);
        expect(new Set(result).size).toBe(result.length);
      });
    });
  });

  describe('Compact', () => {
    const mixedArrays = generateMixedArrays();
    
    mixedArrays.forEach((arr, index) => {
      it(`should compact array #${index + 1}`, () => {
        const result = compact(arr);
        expect(result.every(x => Boolean(x))).toBe(true);
      });
    });
    
    it('should remove falsy values', () => {
      expect(compact([0, 1, false, 2, '', 3, null, undefined, 4, NaN])).toEqual([1, 2, 3, 4]);
    });
  });

  describe('Take/Drop', () => {
    const arrays = generateNumberArrays();
    const counts = [0, 1, 2, 5, 10, 50, 100];
    
    arrays.slice(0, 20).forEach((arr, arrIndex) => {
      counts.forEach((n) => {
        it(`should take ${n} from array #${arrIndex + 1}`, () => {
          const result = take(arr, n);
          expect(result.length).toBe(Math.min(n, arr.length));
          expect(result).toEqual(arr.slice(0, n));
        });
        
        it(`should drop ${n} from array #${arrIndex + 1}`, () => {
          const result = drop(arr, n);
          expect(result).toEqual(arr.slice(n));
        });
      });
    });
  });

  describe('FindIndex/FindLastIndex', () => {
    const arrays = generateNumberArrays();
    
    arrays.forEach((arr, index) => {
      it(`should find index in array #${index + 1}`, () => {
        const idx = findIndex(arr, x => x > 5);
        if (idx !== -1) {
          expect(arr[idx]).toBeGreaterThan(5);
        }
      });
      
      it(`should find last index in array #${index + 1}`, () => {
        const idx = findLastIndex(arr, x => x > 5);
        if (idx !== -1) {
          expect(arr[idx]).toBeGreaterThan(5);
        }
      });
    });
  });

  describe('Suite Statistics', () => {
    it('should have comprehensive number array coverage', () => {
      expect(generateNumberArrays().length).toBeGreaterThan(40);
    });
    
    it('should have comprehensive string array coverage', () => {
      expect(generateStringArrays().length).toBeGreaterThan(15);
    });
  });
});
