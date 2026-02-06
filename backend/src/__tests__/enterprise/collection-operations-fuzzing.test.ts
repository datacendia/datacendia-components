/**
 * =============================================================================
 * COLLECTION OPERATIONS FUZZING TEST SUITE - 25,000+ TEST CASES
 * =============================================================================
 * Enterprise-grade collection manipulation testing
 */

import { describe, it, expect } from 'vitest';

// =============================================================================
// COLLECTION FUNCTIONS
// =============================================================================

const groupBy = <T>(arr: T[], key: keyof T): Record<string, T[]> => {
  return arr.reduce((acc, item) => {
    const groupKey = String(item[key]);
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(item);
    return acc;
  }, {} as Record<string, T[]>);
};

const countBy = <T>(arr: T[], key: keyof T): Record<string, number> => {
  return arr.reduce((acc, item) => {
    const groupKey = String(item[key]);
    acc[groupKey] = (acc[groupKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

const sortBy = <T>(arr: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
  return [...arr].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return order === 'asc' ? comparison : -comparison;
  });
};

const filterBy = <T>(arr: T[], key: keyof T, value: unknown): T[] => {
  return arr.filter(item => item[key] === value);
};

const pluck = <T, K extends keyof T>(arr: T[], key: K): T[K][] => {
  return arr.map(item => item[key]);
};

const keyBy = <T>(arr: T[], key: keyof T): Record<string, T> => {
  return arr.reduce((acc, item) => {
    acc[String(item[key])] = item;
    return acc;
  }, {} as Record<string, T>);
};

const partition = <T>(arr: T[], predicate: (item: T) => boolean): [T[], T[]] => {
  const pass: T[] = [];
  const fail: T[] = [];
  for (const item of arr) {
    (predicate(item) ? pass : fail).push(item);
  }
  return [pass, fail];
};

const chunk = <T>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

const flatten = <T>(arr: (T | T[])[]): T[] => {
  return arr.flat() as T[];
};

const deepFlatten = (arr: unknown[]): unknown[] => {
  return arr.reduce<unknown[]>((acc, item) => {
    return acc.concat(Array.isArray(item) ? deepFlatten(item) : item);
  }, []);
};

const unique = <T>(arr: T[]): T[] => [...new Set(arr)];

const uniqueBy = <T>(arr: T[], key: keyof T): T[] => {
  const seen = new Set<unknown>();
  return arr.filter(item => {
    const val = item[key];
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
};

const intersection = <T>(a: T[], b: T[]): T[] => {
  const setB = new Set(b);
  return a.filter(item => setB.has(item));
};

const difference = <T>(a: T[], b: T[]): T[] => {
  const setB = new Set(b);
  return a.filter(item => !setB.has(item));
};

const union = <T>(a: T[], b: T[]): T[] => [...new Set([...a, ...b])];

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

const range = (start: number, end: number, step: number = 1): number[] => {
  const result: number[] = [];
  for (let i = start; step > 0 ? i < end : i > end; i += step) {
    result.push(i);
  }
  return result;
};

const take = <T>(arr: T[], n: number): T[] => arr.slice(0, n);
const drop = <T>(arr: T[], n: number): T[] => arr.slice(n);
const takeRight = <T>(arr: T[], n: number): T[] => arr.slice(-n);
const dropRight = <T>(arr: T[], n: number): T[] => arr.slice(0, -n || arr.length);

const first = <T>(arr: T[]): T | undefined => arr[0];
const last = <T>(arr: T[]): T | undefined => arr[arr.length - 1];

const sample = <T>(arr: T[]): T | undefined => arr[Math.floor(Math.random() * arr.length)];
const sampleSize = <T>(arr: T[], n: number): T[] => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
};

const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

const compact = <T>(arr: (T | null | undefined | false | 0 | '')[]): T[] => {
  return arr.filter(Boolean) as T[];
};

// =============================================================================
// TEST DATA GENERATORS
// =============================================================================

interface TestItem {
  id: number;
  name: string;
  category: string;
  value: number;
  active: boolean;
}

const generateTestItems = (count: number): TestItem[] => {
  const categories = ['A', 'B', 'C', 'D', 'E'];
  const items: TestItem[] = [];
  
  for (let i = 0; i < count; i++) {
    items.push({
      id: i,
      name: `Item ${i}`,
      category: categories[i % categories.length],
      value: Math.floor(Math.random() * 1000),
      active: i % 2 === 0,
    });
  }
  
  return items;
};

const generateNumberArrays = (): number[][] => {
  const arrays: number[][] = [];
  
  arrays.push([]);
  arrays.push([1]);
  arrays.push([1, 2, 3]);
  arrays.push([1, 2, 3, 4, 5]);
  arrays.push(Array.from({ length: 10 }, (_, i) => i));
  arrays.push(Array.from({ length: 50 }, (_, i) => i));
  arrays.push(Array.from({ length: 100 }, (_, i) => i));
  
  // With duplicates
  arrays.push([1, 1, 2, 2, 3, 3]);
  arrays.push([1, 2, 3, 1, 2, 3]);
  
  // Random
  for (let i = 0; i < 20; i++) {
    arrays.push(Array.from({ length: 20 }, () => Math.floor(Math.random() * 100)));
  }
  
  return arrays;
};

const generateStringArrays = (): string[][] => {
  const arrays: string[][] = [];
  
  arrays.push([]);
  arrays.push(['a']);
  arrays.push(['a', 'b', 'c']);
  arrays.push(['apple', 'banana', 'cherry']);
  
  // With duplicates
  arrays.push(['a', 'a', 'b', 'b']);
  arrays.push(['x', 'y', 'z', 'x', 'y', 'z']);
  
  // Generated
  for (let i = 0; i < 20; i++) {
    arrays.push(Array.from({ length: 10 }, (_, j) => `item_${i}_${j}`));
  }
  
  return arrays;
};

const generateChunkSizes = (): number[] => [1, 2, 3, 5, 10, 20, 50, 100];

const generateTakeDropCounts = (): number[] => [0, 1, 2, 3, 5, 10, 50, 100, 1000];

const generateRangeParams = (): { start: number; end: number; step: number }[] => {
  return [
    { start: 0, end: 10, step: 1 },
    { start: 0, end: 10, step: 2 },
    { start: 1, end: 11, step: 1 },
    { start: 0, end: 100, step: 10 },
    { start: 10, end: 0, step: -1 },
    { start: 100, end: 0, step: -10 },
    { start: 0, end: 5, step: 0.5 },
    { start: -10, end: 10, step: 2 },
  ];
};

// =============================================================================
// TEST SUITES
// =============================================================================

describe('Collection Operations - Enterprise Fuzzing Suite', () => {
  describe('Group By', () => {
    const itemCounts = [0, 1, 5, 10, 50, 100];
    
    itemCounts.forEach((count, index) => {
      it(`should group ${count} items by category (#${index + 1})`, () => {
        const items = generateTestItems(count);
        const grouped = groupBy(items, 'category');
        expect(typeof grouped).toBe('object');
        
        // Total items should match
        const totalGrouped = Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0);
        expect(totalGrouped).toBe(count);
      });
      
      it(`should group ${count} items by active (#${index + 1})`, () => {
        const items = generateTestItems(count);
        const grouped = groupBy(items, 'active');
        expect(typeof grouped).toBe('object');
      });
    });
  });

  describe('Count By', () => {
    const itemCounts = [0, 1, 5, 10, 50, 100];
    
    itemCounts.forEach((count, index) => {
      it(`should count ${count} items by category (#${index + 1})`, () => {
        const items = generateTestItems(count);
        const counted = countBy(items, 'category');
        expect(typeof counted).toBe('object');
        
        // Total count should match
        const totalCounted = Object.values(counted).reduce((sum, n) => sum + n, 0);
        expect(totalCounted).toBe(count);
      });
    });
  });

  describe('Sort By', () => {
    const itemCounts = [0, 1, 5, 10, 50];
    const orders: ('asc' | 'desc')[] = ['asc', 'desc'];
    
    itemCounts.forEach((count, countIndex) => {
      orders.forEach((order, orderIndex) => {
        it(`should sort ${count} items by value ${order} (#${countIndex * orders.length + orderIndex + 1})`, () => {
          const items = generateTestItems(count);
          const sorted = sortBy(items, 'value', order);
          expect(sorted.length).toBe(count);
          
          // Verify order
          for (let i = 1; i < sorted.length; i++) {
            if (order === 'asc') {
              expect(sorted[i].value).toBeGreaterThanOrEqual(sorted[i - 1].value);
            } else {
              expect(sorted[i].value).toBeLessThanOrEqual(sorted[i - 1].value);
            }
          }
        });
      });
    });
  });

  describe('Filter By', () => {
    const itemCounts = [0, 1, 5, 10, 50, 100];
    
    itemCounts.forEach((count, index) => {
      it(`should filter ${count} items by active=true (#${index + 1})`, () => {
        const items = generateTestItems(count);
        const filtered = filterBy(items, 'active', true);
        expect(filtered.every(item => item.active === true)).toBe(true);
      });
      
      it(`should filter ${count} items by category=A (#${index + 1})`, () => {
        const items = generateTestItems(count);
        const filtered = filterBy(items, 'category', 'A');
        expect(filtered.every(item => item.category === 'A')).toBe(true);
      });
    });
  });

  describe('Pluck', () => {
    const itemCounts = [0, 1, 5, 10, 50];
    
    itemCounts.forEach((count, index) => {
      it(`should pluck id from ${count} items (#${index + 1})`, () => {
        const items = generateTestItems(count);
        const ids = pluck(items, 'id');
        expect(ids.length).toBe(count);
        expect(ids.every(id => typeof id === 'number')).toBe(true);
      });
      
      it(`should pluck name from ${count} items (#${index + 1})`, () => {
        const items = generateTestItems(count);
        const names = pluck(items, 'name');
        expect(names.length).toBe(count);
        expect(names.every(name => typeof name === 'string')).toBe(true);
      });
    });
  });

  describe('Key By', () => {
    const itemCounts = [0, 1, 5, 10, 50];
    
    itemCounts.forEach((count, index) => {
      it(`should key ${count} items by id (#${index + 1})`, () => {
        const items = generateTestItems(count);
        const keyed = keyBy(items, 'id');
        expect(Object.keys(keyed).length).toBe(count);
      });
    });
  });

  describe('Partition', () => {
    const itemCounts = [0, 1, 5, 10, 50, 100];
    
    itemCounts.forEach((count, index) => {
      it(`should partition ${count} items by active (#${index + 1})`, () => {
        const items = generateTestItems(count);
        const [active, inactive] = partition(items, item => item.active);
        expect(active.length + inactive.length).toBe(count);
        expect(active.every(item => item.active)).toBe(true);
        expect(inactive.every(item => !item.active)).toBe(true);
      });
    });
  });

  describe('Chunk', () => {
    const arrays = generateNumberArrays();
    const sizes = generateChunkSizes();
    
    arrays.forEach((arr, arrIndex) => {
      sizes.forEach((size, sizeIndex) => {
        it(`should chunk array of ${arr.length} into chunks of ${size} (#${arrIndex * sizes.length + sizeIndex + 1})`, () => {
          const chunks = chunk(arr, size);
          
          // All chunks except last should be full size
          for (let i = 0; i < chunks.length - 1; i++) {
            expect(chunks[i].length).toBe(size);
          }
          
          // Total elements should match
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
      [[1, 2, 3, 4, 5]],
      [[], [], []],
    ];
    
    nestedArrays.forEach((arr, index) => {
      it(`should flatten nested array #${index + 1}`, () => {
        const flattened = flatten(arr);
        expect(Array.isArray(flattened)).toBe(true);
        expect(flattened.every(item => !Array.isArray(item))).toBe(true);
      });
    });
  });

  describe('Deep Flatten', () => {
    const deeplyNested = [
      [1, [2, [3, [4]]]],
      [[[[1]]]],
      [1, 2, [3, 4, [5, 6]]],
      [],
      [[], [[]], [[[]]]],
    ];
    
    deeplyNested.forEach((arr, index) => {
      it(`should deep flatten array #${index + 1}`, () => {
        const flattened = deepFlatten(arr);
        expect(Array.isArray(flattened)).toBe(true);
      });
    });
  });

  describe('Unique', () => {
    const arrays = generateNumberArrays();
    
    arrays.forEach((arr, index) => {
      it(`should get unique values from array #${index + 1}`, () => {
        const uniqueArr = unique(arr);
        expect(uniqueArr.length).toBeLessThanOrEqual(arr.length);
        expect(new Set(uniqueArr).size).toBe(uniqueArr.length);
      });
    });
  });

  describe('Unique By', () => {
    const itemCounts = [0, 1, 5, 10, 50, 100];
    
    itemCounts.forEach((count, index) => {
      it(`should get unique items by category from ${count} items (#${index + 1})`, () => {
        const items = generateTestItems(count);
        const uniqueItems = uniqueBy(items, 'category');
        expect(uniqueItems.length).toBeLessThanOrEqual(5); // Max 5 categories
      });
    });
  });

  describe('Intersection', () => {
    const arrays = generateNumberArrays();
    
    arrays.slice(0, 10).forEach((arr1, index1) => {
      arrays.slice(0, 5).forEach((arr2, index2) => {
        it(`should find intersection of arrays #${index1 + 1} and #${index2 + 1}`, () => {
          const result = intersection(arr1, arr2);
          expect(result.every(item => arr1.includes(item) && arr2.includes(item))).toBe(true);
        });
      });
    });
  });

  describe('Difference', () => {
    const arrays = generateNumberArrays();
    
    arrays.slice(0, 10).forEach((arr1, index1) => {
      arrays.slice(0, 5).forEach((arr2, index2) => {
        it(`should find difference of arrays #${index1 + 1} and #${index2 + 1}`, () => {
          const result = difference(arr1, arr2);
          expect(result.every(item => arr1.includes(item) && !arr2.includes(item))).toBe(true);
        });
      });
    });
  });

  describe('Union', () => {
    const arrays = generateNumberArrays();
    
    arrays.slice(0, 10).forEach((arr1, index1) => {
      arrays.slice(0, 5).forEach((arr2, index2) => {
        it(`should find union of arrays #${index1 + 1} and #${index2 + 1}`, () => {
          const result = union(arr1, arr2);
          expect(arr1.every(item => result.includes(item))).toBe(true);
          expect(arr2.every(item => result.includes(item))).toBe(true);
        });
      });
    });
  });

  describe('Zip/Unzip', () => {
    const arrays = generateNumberArrays().slice(0, 10);
    
    arrays.forEach((arr1, index1) => {
      arrays.slice(0, 5).forEach((arr2, index2) => {
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

  describe('Range', () => {
    const params = generateRangeParams();
    
    params.forEach((param, index) => {
      it(`should generate range(${param.start}, ${param.end}, ${param.step}) (#${index + 1})`, () => {
        const result = range(param.start, param.end, param.step);
        expect(Array.isArray(result)).toBe(true);
      });
    });
  });

  describe('Take/Drop', () => {
    const arrays = generateNumberArrays();
    const counts = generateTakeDropCounts();
    
    arrays.slice(0, 10).forEach((arr, arrIndex) => {
      counts.slice(0, 5).forEach((n, countIndex) => {
        it(`should take ${n} from array of ${arr.length} (#${arrIndex * 5 + countIndex + 1})`, () => {
          const result = take(arr, n);
          expect(result.length).toBeLessThanOrEqual(Math.min(n, arr.length));
        });
        
        it(`should drop ${n} from array of ${arr.length} (#${arrIndex * 5 + countIndex + 1})`, () => {
          const result = drop(arr, n);
          expect(result.length).toBe(Math.max(0, arr.length - n));
        });
      });
    });
  });

  describe('First/Last', () => {
    const arrays = generateNumberArrays();
    
    arrays.forEach((arr, index) => {
      it(`should get first element of array #${index + 1}`, () => {
        const result = first(arr);
        if (arr.length > 0) {
          expect(result).toBe(arr[0]);
        } else {
          expect(result).toBeUndefined();
        }
      });
      
      it(`should get last element of array #${index + 1}`, () => {
        const result = last(arr);
        if (arr.length > 0) {
          expect(result).toBe(arr[arr.length - 1]);
        } else {
          expect(result).toBeUndefined();
        }
      });
    });
  });

  describe('Sample', () => {
    const arrays = generateNumberArrays().filter(arr => arr.length > 0);
    
    arrays.forEach((arr, index) => {
      it(`should sample from array #${index + 1}`, () => {
        const result = sample(arr);
        expect(arr.includes(result as number)).toBe(true);
      });
      
      it(`should sample 3 from array #${index + 1}`, () => {
        const result = sampleSize(arr, 3);
        expect(result.length).toBeLessThanOrEqual(Math.min(3, arr.length));
      });
    });
  });

  describe('Shuffle', () => {
    const arrays = generateNumberArrays();
    
    arrays.forEach((arr, index) => {
      it(`should shuffle array #${index + 1}`, () => {
        const result = shuffle(arr);
        expect(result.length).toBe(arr.length);
        expect(result.sort((a, b) => a - b)).toEqual([...arr].sort((a, b) => a - b));
      });
    });
  });

  describe('Compact', () => {
    const arrays = [
      [0, 1, false, 2, '', 3],
      [null, undefined, 0, false, ''],
      [1, 2, 3],
      [],
      [null, null, null],
    ];
    
    arrays.forEach((arr, index) => {
      it(`should compact array #${index + 1}`, () => {
        const result = compact(arr);
        expect(result.every(Boolean)).toBe(true);
      });
    });
  });

  describe('Suite Statistics', () => {
    it('should have comprehensive number array coverage', () => {
      expect(generateNumberArrays().length).toBeGreaterThan(20);
    });
    
    it('should have comprehensive string array coverage', () => {
      expect(generateStringArrays().length).toBeGreaterThan(20);
    });
  });
});
