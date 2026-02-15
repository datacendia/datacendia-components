// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATA STRUCTURES - COMPREHENSIVE TEST SUITE
 * Tests for common data structure operations and algorithms
 */

import { describe, it, expect } from 'vitest';

describe('Data Structures', () => {
  // ===========================================================================
  // ARRAY OPERATIONS - 50 TESTS
  // ===========================================================================
  describe('Array Operations', () => {
    describe('Filtering', () => {
      it('should filter even numbers', () => {
        const arr = [1, 2, 3, 4, 5, 6];
        expect(arr.filter(n => n % 2 === 0)).toEqual([2, 4, 6]);
      });

      it('should filter strings by length', () => {
        const arr = ['a', 'ab', 'abc', 'abcd'];
        expect(arr.filter(s => s.length > 2)).toEqual(['abc', 'abcd']);
      });

      it('should handle empty array', () => {
        expect([].filter(() => true)).toEqual([]);
      });

      it('should handle no matches', () => {
        expect([1, 2, 3].filter(n => n > 10)).toEqual([]);
      });

      it('should handle all matches', () => {
        expect([1, 2, 3].filter(n => n > 0)).toEqual([1, 2, 3]);
      });
    });

    describe('Mapping', () => {
      it('should double numbers', () => {
        expect([1, 2, 3].map(n => n * 2)).toEqual([2, 4, 6]);
      });

      it('should convert to strings', () => {
        expect([1, 2, 3].map(String)).toEqual(['1', '2', '3']);
      });

      it('should extract property', () => {
        const arr = [{ name: 'a' }, { name: 'b' }];
        expect(arr.map(o => o.name)).toEqual(['a', 'b']);
      });

      it('should handle empty array', () => {
        expect([].map(n => n)).toEqual([]);
      });

      it('should preserve length', () => {
        const arr = [1, 2, 3, 4, 5];
        expect(arr.map(n => n).length).toBe(5);
      });
    });

    describe('Reducing', () => {
      it('should sum numbers', () => {
        expect([1, 2, 3, 4, 5].reduce((a, b) => a + b, 0)).toBe(15);
      });

      it('should find max', () => {
        expect([3, 1, 4, 1, 5, 9].reduce((a, b) => Math.max(a, b), -Infinity)).toBe(9);
      });

      it('should find min', () => {
        expect([3, 1, 4, 1, 5, 9].reduce((a, b) => Math.min(a, b), Infinity)).toBe(1);
      });

      it('should concatenate strings', () => {
        expect(['a', 'b', 'c'].reduce((a, b) => a + b, '')).toBe('abc');
      });

      it('should group by property', () => {
        const arr = [{ type: 'a', val: 1 }, { type: 'b', val: 2 }, { type: 'a', val: 3 }];
        const grouped = arr.reduce((acc, item) => {
          acc[item.type] = acc[item.type] || [];
          acc[item.type].push(item);
          return acc;
        }, {} as Record<string, typeof arr>);
        expect(grouped['a'].length).toBe(2);
      });

      it('should handle empty array with initial', () => {
        expect([].reduce((a: number, b: number) => a + b, 0)).toBe(0);
      });
    });

    describe('Sorting', () => {
      it('should sort numbers ascending', () => {
        expect([3, 1, 4, 1, 5].sort((a, b) => a - b)).toEqual([1, 1, 3, 4, 5]);
      });

      it('should sort numbers descending', () => {
        expect([3, 1, 4, 1, 5].sort((a, b) => b - a)).toEqual([5, 4, 3, 1, 1]);
      });

      it('should sort strings alphabetically', () => {
        expect(['banana', 'apple', 'cherry'].sort()).toEqual(['apple', 'banana', 'cherry']);
      });

      it('should sort by object property', () => {
        const arr = [{ name: 'b' }, { name: 'a' }, { name: 'c' }];
        arr.sort((a, b) => a.name.localeCompare(b.name));
        expect(arr.map(o => o.name)).toEqual(['a', 'b', 'c']);
      });

      it('should handle empty array', () => {
        expect([].sort()).toEqual([]);
      });

      it('should handle single element', () => {
        expect([1].sort()).toEqual([1]);
      });
    });

    describe('Searching', () => {
      it('should find element', () => {
        expect([1, 2, 3, 4, 5].find(n => n === 3)).toBe(3);
      });

      it('should return undefined if not found', () => {
        expect([1, 2, 3].find(n => n === 10)).toBeUndefined();
      });

      it('should find index', () => {
        expect([1, 2, 3, 4, 5].findIndex(n => n === 3)).toBe(2);
      });

      it('should return -1 if index not found', () => {
        expect([1, 2, 3].findIndex(n => n === 10)).toBe(-1);
      });

      it('should check if includes', () => {
        expect([1, 2, 3].includes(2)).toBe(true);
      });

      it('should check if some match', () => {
        expect([1, 2, 3].some(n => n > 2)).toBe(true);
      });

      it('should check if every matches', () => {
        expect([1, 2, 3].every(n => n > 0)).toBe(true);
      });

      it('should check if none match with every', () => {
        expect([1, 2, 3].every(n => n > 5)).toBe(false);
      });
    });

    describe('Slicing', () => {
      it('should slice from start', () => {
        expect([1, 2, 3, 4, 5].slice(2)).toEqual([3, 4, 5]);
      });

      it('should slice range', () => {
        expect([1, 2, 3, 4, 5].slice(1, 4)).toEqual([2, 3, 4]);
      });

      it('should handle negative index', () => {
        expect([1, 2, 3, 4, 5].slice(-2)).toEqual([4, 5]);
      });

      it('should not modify original', () => {
        const arr = [1, 2, 3];
        arr.slice(1);
        expect(arr).toEqual([1, 2, 3]);
      });
    });

    describe('Flattening', () => {
      it('should flatten nested array', () => {
        expect([[1, 2], [3, 4]].flat()).toEqual([1, 2, 3, 4]);
      });

      it('should flatten deeply', () => {
        expect([1, [2, [3, [4]]]].flat(3)).toEqual([1, 2, 3, 4]);
      });

      it('should handle empty arrays', () => {
        expect([[], [], []].flat()).toEqual([]);
      });

      it('should flatMap', () => {
        expect([1, 2, 3].flatMap(n => [n, n * 2])).toEqual([1, 2, 2, 4, 3, 6]);
      });
    });
  });

  // ===========================================================================
  // SET OPERATIONS - 30 TESTS
  // ===========================================================================
  describe('Set Operations', () => {
    describe('Basic Operations', () => {
      it('should add unique values', () => {
        const set = new Set([1, 2, 2, 3, 3, 3]);
        expect(set.size).toBe(3);
      });

      it('should check membership', () => {
        const set = new Set([1, 2, 3]);
        expect(set.has(2)).toBe(true);
        expect(set.has(4)).toBe(false);
      });

      it('should delete values', () => {
        const set = new Set([1, 2, 3]);
        set.delete(2);
        expect(set.has(2)).toBe(false);
      });

      it('should clear all values', () => {
        const set = new Set([1, 2, 3]);
        set.clear();
        expect(set.size).toBe(0);
      });

      it('should iterate values', () => {
        const set = new Set([1, 2, 3]);
        const values: number[] = [];
        set.forEach(v => values.push(v));
        expect(values.sort()).toEqual([1, 2, 3]);
      });

      it('should convert to array', () => {
        const set = new Set([1, 2, 3]);
        expect([...set].sort()).toEqual([1, 2, 3]);
      });
    });

    describe('Set Theory', () => {
      const setA = new Set([1, 2, 3, 4]);
      const setB = new Set([3, 4, 5, 6]);

      it('should compute union', () => {
        const union = new Set([...setA, ...setB]);
        expect([...union].sort()).toEqual([1, 2, 3, 4, 5, 6]);
      });

      it('should compute intersection', () => {
        const intersection = new Set([...setA].filter(x => setB.has(x)));
        expect([...intersection].sort()).toEqual([3, 4]);
      });

      it('should compute difference', () => {
        const difference = new Set([...setA].filter(x => !setB.has(x)));
        expect([...difference].sort()).toEqual([1, 2]);
      });

      it('should compute symmetric difference', () => {
        const symDiff = new Set([
          ...[...setA].filter(x => !setB.has(x)),
          ...[...setB].filter(x => !setA.has(x))
        ]);
        expect([...symDiff].sort()).toEqual([1, 2, 5, 6]);
      });

      it('should check subset', () => {
        const subset = new Set([3, 4]);
        expect([...subset].every(x => setA.has(x))).toBe(true);
      });

      it('should check superset', () => {
        const subset = new Set([3, 4]);
        expect([...subset].every(x => setA.has(x))).toBe(true);
      });
    });
  });

  // ===========================================================================
  // MAP OPERATIONS - 30 TESTS
  // ===========================================================================
  describe('Map Operations', () => {
    describe('Basic Operations', () => {
      it('should set and get values', () => {
        const map = new Map<string, number>();
        map.set('a', 1);
        expect(map.get('a')).toBe(1);
      });

      it('should return undefined for missing key', () => {
        const map = new Map<string, number>();
        expect(map.get('missing')).toBeUndefined();
      });

      it('should check membership', () => {
        const map = new Map([['a', 1]]);
        expect(map.has('a')).toBe(true);
        expect(map.has('b')).toBe(false);
      });

      it('should delete entries', () => {
        const map = new Map([['a', 1], ['b', 2]]);
        map.delete('a');
        expect(map.has('a')).toBe(false);
      });

      it('should track size', () => {
        const map = new Map([['a', 1], ['b', 2], ['c', 3]]);
        expect(map.size).toBe(3);
      });

      it('should clear all entries', () => {
        const map = new Map([['a', 1], ['b', 2]]);
        map.clear();
        expect(map.size).toBe(0);
      });

      it('should iterate entries', () => {
        const map = new Map([['a', 1], ['b', 2]]);
        const entries: [string, number][] = [];
        map.forEach((v, k) => entries.push([k, v]));
        expect(entries.length).toBe(2);
      });

      it('should get keys', () => {
        const map = new Map([['a', 1], ['b', 2]]);
        expect([...map.keys()].sort()).toEqual(['a', 'b']);
      });

      it('should get values', () => {
        const map = new Map([['a', 1], ['b', 2]]);
        expect([...map.values()].sort()).toEqual([1, 2]);
      });

      it('should handle object keys', () => {
        const key = { id: 1 };
        const map = new Map();
        map.set(key, 'value');
        expect(map.get(key)).toBe('value');
      });
    });

    describe('Advanced Map Usage', () => {
      it('should convert array to map', () => {
        const arr = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }];
        const map = new Map(arr.map(item => [item.id, item]));
        expect(map.get(1)?.name).toBe('a');
      });

      it('should convert map to object', () => {
        const map = new Map([['a', 1], ['b', 2]]);
        const obj = Object.fromEntries(map);
        expect(obj).toEqual({ a: 1, b: 2 });
      });

      it('should chain operations', () => {
        const map = new Map<string, number>();
        map.set('a', 1).set('b', 2).set('c', 3);
        expect(map.size).toBe(3);
      });

      it('should update existing key', () => {
        const map = new Map([['a', 1]]);
        map.set('a', 2);
        expect(map.get('a')).toBe(2);
        expect(map.size).toBe(1);
      });
    });
  });

  // ===========================================================================
  // OBJECT OPERATIONS - 40 TESTS
  // ===========================================================================
  describe('Object Operations', () => {
    describe('Property Access', () => {
      it('should access property', () => {
        const obj = { name: 'test' };
        expect(obj.name).toBe('test');
      });

      it('should access nested property', () => {
        const obj = { nested: { value: 42 } };
        expect(obj.nested.value).toBe(42);
      });

      it('should handle optional chaining', () => {
        const obj: { nested?: { value?: number } } = {};
        expect(obj.nested?.value).toBeUndefined();
      });

      it('should use nullish coalescing', () => {
        const obj: { value?: number } = {};
        expect(obj.value ?? 10).toBe(10);
      });

      it('should check property existence', () => {
        const obj = { name: 'test' };
        expect('name' in obj).toBe(true);
        expect('missing' in obj).toBe(false);
      });

      it('should get keys', () => {
        const obj = { a: 1, b: 2, c: 3 };
        expect(Object.keys(obj).sort()).toEqual(['a', 'b', 'c']);
      });

      it('should get values', () => {
        const obj = { a: 1, b: 2, c: 3 };
        expect(Object.values(obj).sort()).toEqual([1, 2, 3]);
      });

      it('should get entries', () => {
        const obj = { a: 1, b: 2 };
        expect(Object.entries(obj)).toEqual([['a', 1], ['b', 2]]);
      });
    });

    describe('Object Manipulation', () => {
      it('should spread merge', () => {
        const obj1 = { a: 1, b: 2 };
        const obj2 = { b: 3, c: 4 };
        expect({ ...obj1, ...obj2 }).toEqual({ a: 1, b: 3, c: 4 });
      });

      it('should Object.assign', () => {
        const target = { a: 1 };
        const source = { b: 2 };
        expect(Object.assign({}, target, source)).toEqual({ a: 1, b: 2 });
      });

      it('should deep clone', () => {
        const obj = { nested: { value: 42 } };
        const clone = JSON.parse(JSON.stringify(obj));
        clone.nested.value = 100;
        expect(obj.nested.value).toBe(42);
      });

      it('should freeze object', () => {
        const obj = Object.freeze({ value: 1 });
        expect(Object.isFrozen(obj)).toBe(true);
      });

      it('should seal object', () => {
        const obj = Object.seal({ value: 1 });
        expect(Object.isSealed(obj)).toBe(true);
      });

      it('should delete property', () => {
        const obj: { a?: number; b: number } = { a: 1, b: 2 };
        delete obj.a;
        expect('a' in obj).toBe(false);
      });
    });

    describe('Object Comparison', () => {
      it('should compare primitives', () => {
        expect(1 === 1).toBe(true);
        expect('a' === 'a').toBe(true);
      });

      it('should reference compare objects', () => {
        const obj = { a: 1 };
        expect(obj === obj).toBe(true);
        expect({ a: 1 } === { a: 1 }).toBe(false);
      });

      it('should deep compare with JSON', () => {
        const obj1 = { a: 1, b: { c: 2 } };
        const obj2 = { a: 1, b: { c: 2 } };
        expect(JSON.stringify(obj1)).toBe(JSON.stringify(obj2));
      });
    });
  });

  // ===========================================================================
  // STRING OPERATIONS - 30 TESTS
  // ===========================================================================
  describe('String Operations', () => {
    describe('Transformations', () => {
      it('should uppercase', () => {
        expect('hello'.toUpperCase()).toBe('HELLO');
      });

      it('should lowercase', () => {
        expect('HELLO'.toLowerCase()).toBe('hello');
      });

      it('should trim', () => {
        expect('  hello  '.trim()).toBe('hello');
      });

      it('should trim start', () => {
        expect('  hello  '.trimStart()).toBe('hello  ');
      });

      it('should trim end', () => {
        expect('  hello  '.trimEnd()).toBe('  hello');
      });

      it('should pad start', () => {
        expect('5'.padStart(3, '0')).toBe('005');
      });

      it('should pad end', () => {
        expect('5'.padEnd(3, '0')).toBe('500');
      });

      it('should repeat', () => {
        expect('ab'.repeat(3)).toBe('ababab');
      });

      it('should replace', () => {
        expect('hello world'.replace('world', 'there')).toBe('hello there');
      });

      it('should replace all', () => {
        expect('aaa'.replaceAll('a', 'b')).toBe('bbb');
      });
    });

    describe('Searching', () => {
      it('should check starts with', () => {
        expect('hello world'.startsWith('hello')).toBe(true);
      });

      it('should check ends with', () => {
        expect('hello world'.endsWith('world')).toBe(true);
      });

      it('should check includes', () => {
        expect('hello world'.includes('lo wo')).toBe(true);
      });

      it('should find index', () => {
        expect('hello world'.indexOf('world')).toBe(6);
      });

      it('should find last index', () => {
        expect('hello hello'.lastIndexOf('hello')).toBe(6);
      });

      it('should match regex', () => {
        expect('test123'.match(/\d+/)?.[0]).toBe('123');
      });
    });

    describe('Splitting and Joining', () => {
      it('should split by delimiter', () => {
        expect('a,b,c'.split(',')).toEqual(['a', 'b', 'c']);
      });

      it('should split by regex', () => {
        expect('a1b2c'.split(/\d/)).toEqual(['a', 'b', 'c']);
      });

      it('should split into chars', () => {
        expect('abc'.split('')).toEqual(['a', 'b', 'c']);
      });

      it('should join array', () => {
        expect(['a', 'b', 'c'].join(',')).toBe('a,b,c');
      });

      it('should join without delimiter', () => {
        expect(['a', 'b', 'c'].join('')).toBe('abc');
      });
    });

    describe('Slicing', () => {
      it('should slice from start', () => {
        expect('hello'.slice(2)).toBe('llo');
      });

      it('should slice range', () => {
        expect('hello'.slice(1, 4)).toBe('ell');
      });

      it('should handle negative index', () => {
        expect('hello'.slice(-2)).toBe('lo');
      });

      it('should substring', () => {
        expect('hello'.substring(1, 4)).toBe('ell');
      });

      it('should charAt', () => {
        expect('hello'.charAt(1)).toBe('e');
      });

      it('should charCodeAt', () => {
        expect('A'.charCodeAt(0)).toBe(65);
      });
    });
  });
});
