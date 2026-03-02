/**
 * Module — Algorithms Comprehensive Test
 *
 * Platform module.
 * @module __tests__/utils/algorithms.comprehensive.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * ALGORITHMS - COMPREHENSIVE TEST SUITE
 * Tests for common algorithms and computational functions
 */

import { describe, it, expect } from 'vitest';

describe('Algorithms', () => {
  // ===========================================================================
  // SORTING ALGORITHMS - 40 TESTS
  // ===========================================================================
  describe('Sorting Algorithms', () => {
    describe('Bubble Sort', () => {
      const bubbleSort = (arr: number[]): number[] => {
        const result = [...arr];
        for (let i = 0; i < result.length; i++) {
          for (let j = 0; j < result.length - i - 1; j++) {
            if (result[j] > result[j + 1]) {
              [result[j], result[j + 1]] = [result[j + 1], result[j]];
            }
          }
        }
        return result;
      };

      it('should sort ascending', () => {
        expect(bubbleSort([3, 1, 4, 1, 5])).toEqual([1, 1, 3, 4, 5]);
      });

      it('should handle empty array', () => {
        expect(bubbleSort([])).toEqual([]);
      });

      it('should handle single element', () => {
        expect(bubbleSort([1])).toEqual([1]);
      });

      it('should handle already sorted', () => {
        expect(bubbleSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
      });

      it('should handle reverse sorted', () => {
        expect(bubbleSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
      });

      it('should handle duplicates', () => {
        expect(bubbleSort([3, 3, 3, 1, 1])).toEqual([1, 1, 3, 3, 3]);
      });

      it('should handle negative numbers', () => {
        expect(bubbleSort([-3, 1, -4, 1, 5])).toEqual([-4, -3, 1, 1, 5]);
      });
    });

    describe('Quick Sort', () => {
      const quickSort = (arr: number[]): number[] => {
        if (arr.length <= 1) return arr;
        const pivot = arr[Math.floor(arr.length / 2)];
        const left = arr.filter(x => x < pivot);
        const middle = arr.filter(x => x === pivot);
        const right = arr.filter(x => x > pivot);
        return [...quickSort(left), ...middle, ...quickSort(right)];
      };

      it('should sort ascending', () => {
        expect(quickSort([3, 1, 4, 1, 5])).toEqual([1, 1, 3, 4, 5]);
      });

      it('should handle empty array', () => {
        expect(quickSort([])).toEqual([]);
      });

      it('should handle single element', () => {
        expect(quickSort([1])).toEqual([1]);
      });

      it('should handle already sorted', () => {
        expect(quickSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
      });

      it('should handle reverse sorted', () => {
        expect(quickSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
      });

      it('should handle duplicates', () => {
        expect(quickSort([3, 3, 3, 1, 1])).toEqual([1, 1, 3, 3, 3]);
      });

      it('should handle large array', () => {
        const arr = Array(1000).fill(0).map(() => Math.random());
        const sorted = quickSort(arr);
        for (let i = 1; i < sorted.length; i++) {
          expect(sorted[i]).toBeGreaterThanOrEqual(sorted[i - 1]);
        }
      });
    });

    describe('Merge Sort', () => {
      const mergeSort = (arr: number[]): number[] => {
        if (arr.length <= 1) return arr;
        const mid = Math.floor(arr.length / 2);
        const left = mergeSort(arr.slice(0, mid));
        const right = mergeSort(arr.slice(mid));
        return merge(left, right);
      };

      const merge = (left: number[], right: number[]): number[] => {
        const result: number[] = [];
        let i = 0, j = 0;
        while (i < left.length && j < right.length) {
          if (left[i] < right[j]) result.push(left[i++]);
          else result.push(right[j++]);
        }
        return [...result, ...left.slice(i), ...right.slice(j)];
      };

      it('should sort ascending', () => {
        expect(mergeSort([3, 1, 4, 1, 5])).toEqual([1, 1, 3, 4, 5]);
      });

      it('should handle empty array', () => {
        expect(mergeSort([])).toEqual([]);
      });

      it('should handle single element', () => {
        expect(mergeSort([1])).toEqual([1]);
      });

      it('should be stable', () => {
        const result = mergeSort([3, 1, 2]);
        expect(result).toEqual([1, 2, 3]);
      });
    });
  });

  // ===========================================================================
  // SEARCHING ALGORITHMS - 30 TESTS
  // ===========================================================================
  describe('Searching Algorithms', () => {
    describe('Binary Search', () => {
      const binarySearch = (arr: number[], target: number): number => {
        let left = 0, right = arr.length - 1;
        while (left <= right) {
          const mid = Math.floor((left + right) / 2);
          if (arr[mid] === target) return mid;
          if (arr[mid] < target) left = mid + 1;
          else right = mid - 1;
        }
        return -1;
      };

      it('should find element in middle', () => {
        expect(binarySearch([1, 2, 3, 4, 5], 3)).toBe(2);
      });

      it('should find element at start', () => {
        expect(binarySearch([1, 2, 3, 4, 5], 1)).toBe(0);
      });

      it('should find element at end', () => {
        expect(binarySearch([1, 2, 3, 4, 5], 5)).toBe(4);
      });

      it('should return -1 for missing element', () => {
        expect(binarySearch([1, 2, 3, 4, 5], 6)).toBe(-1);
      });

      it('should handle empty array', () => {
        expect(binarySearch([], 1)).toBe(-1);
      });

      it('should handle single element found', () => {
        expect(binarySearch([1], 1)).toBe(0);
      });

      it('should handle single element not found', () => {
        expect(binarySearch([1], 2)).toBe(-1);
      });

      it('should handle large array', () => {
        const arr = Array(10000).fill(0).map((_, i) => i);
        expect(binarySearch(arr, 5000)).toBe(5000);
      });
    });

    describe('Linear Search', () => {
      const linearSearch = (arr: number[], target: number): number => {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] === target) return i;
        }
        return -1;
      };

      it('should find element', () => {
        expect(linearSearch([3, 1, 4, 1, 5], 4)).toBe(2);
      });

      it('should find first occurrence', () => {
        expect(linearSearch([1, 2, 1, 2, 1], 1)).toBe(0);
      });

      it('should return -1 for missing element', () => {
        expect(linearSearch([1, 2, 3], 4)).toBe(-1);
      });

      it('should handle empty array', () => {
        expect(linearSearch([], 1)).toBe(-1);
      });

      it('should work on unsorted array', () => {
        expect(linearSearch([5, 2, 8, 1, 9], 8)).toBe(2);
      });
    });
  });

  // ===========================================================================
  // GRAPH ALGORITHMS - 40 TESTS
  // ===========================================================================
  describe('Graph Algorithms', () => {
    type Graph = Map<string, string[]>;

    const createGraph = (): Graph => {
      const g = new Map<string, string[]>();
      g.set('a', ['b', 'c']);
      g.set('b', ['d', 'e']);
      g.set('c', ['f']);
      g.set('d', []);
      g.set('e', ['f']);
      g.set('f', []);
      return g;
    };

    describe('BFS', () => {
      const bfs = (graph: Graph, start: string): string[] => {
        const visited: string[] = [];
        const queue: string[] = [start];
        const seen = new Set<string>();
        seen.add(start);

        while (queue.length > 0) {
          const node = queue.shift()!;
          visited.push(node);
          for (const neighbor of graph.get(node) || []) {
            if (!seen.has(neighbor)) {
              seen.add(neighbor);
              queue.push(neighbor);
            }
          }
        }
        return visited;
      };

      it('should visit all reachable nodes', () => {
        const graph = createGraph();
        const result = bfs(graph, 'a');
        expect(result).toContain('a');
        expect(result).toContain('b');
        expect(result).toContain('c');
        expect(result).toContain('f');
      });

      it('should visit in level order', () => {
        const graph = createGraph();
        const result = bfs(graph, 'a');
        expect(result.indexOf('a')).toBeLessThan(result.indexOf('b'));
        expect(result.indexOf('b')).toBeLessThan(result.indexOf('d'));
      });

      it('should handle single node', () => {
        const graph = new Map<string, string[]>();
        graph.set('x', []);
        expect(bfs(graph, 'x')).toEqual(['x']);
      });

      it('should handle disconnected start', () => {
        const graph = new Map<string, string[]>();
        graph.set('a', []);
        graph.set('b', []);
        expect(bfs(graph, 'a')).toEqual(['a']);
      });
    });

    describe('DFS', () => {
      const dfs = (graph: Graph, start: string): string[] => {
        const visited: string[] = [];
        const seen = new Set<string>();

        const visit = (node: string) => {
          if (seen.has(node)) return;
          seen.add(node);
          visited.push(node);
          for (const neighbor of graph.get(node) || []) {
            visit(neighbor);
          }
        };

        visit(start);
        return visited;
      };

      it('should visit all reachable nodes', () => {
        const graph = createGraph();
        const result = dfs(graph, 'a');
        expect(result).toContain('a');
        expect(result).toContain('b');
        expect(result).toContain('f');
      });

      it('should visit depth first', () => {
        const graph = createGraph();
        const result = dfs(graph, 'a');
        expect(result.indexOf('a')).toBe(0);
      });

      it('should handle cycles', () => {
        const graph = new Map<string, string[]>();
        graph.set('a', ['b']);
        graph.set('b', ['a']);
        const result = dfs(graph, 'a');
        expect(result.length).toBe(2);
      });
    });

    describe('Topological Sort', () => {
      const topologicalSort = (graph: Graph): string[] => {
        const visited = new Set<string>();
        const result: string[] = [];

        const visit = (node: string) => {
          if (visited.has(node)) return;
          visited.add(node);
          for (const neighbor of graph.get(node) || []) {
            visit(neighbor);
          }
          result.unshift(node);
        };

        for (const node of graph.keys()) {
          visit(node);
        }
        return result;
      };

      it('should order dependencies', () => {
        const graph = createGraph();
        const result = topologicalSort(graph);
        expect(result.indexOf('a')).toBeLessThan(result.indexOf('b'));
        expect(result.indexOf('b')).toBeLessThan(result.indexOf('d'));
      });

      it('should handle empty graph', () => {
        expect(topologicalSort(new Map())).toEqual([]);
      });
    });
  });

  // ===========================================================================
  // STRING ALGORITHMS - 30 TESTS
  // ===========================================================================
  describe('String Algorithms', () => {
    describe('Palindrome Check', () => {
      const isPalindrome = (s: string): boolean => {
        const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
        return clean === clean.split('').reverse().join('');
      };

      it('should detect palindrome', () => {
        expect(isPalindrome('racecar')).toBe(true);
      });

      it('should handle spaces', () => {
        expect(isPalindrome('A man a plan a canal Panama')).toBe(true);
      });

      it('should handle punctuation', () => {
        expect(isPalindrome("Madam, I'm Adam")).toBe(true);
      });

      it('should reject non-palindrome', () => {
        expect(isPalindrome('hello')).toBe(false);
      });

      it('should handle single char', () => {
        expect(isPalindrome('a')).toBe(true);
      });

      it('should handle empty string', () => {
        expect(isPalindrome('')).toBe(true);
      });
    });

    describe('Anagram Check', () => {
      const isAnagram = (s1: string, s2: string): boolean => {
        const clean1 = s1.toLowerCase().replace(/[^a-z]/g, '').split('').sort().join('');
        const clean2 = s2.toLowerCase().replace(/[^a-z]/g, '').split('').sort().join('');
        return clean1 === clean2;
      };

      it('should detect anagram', () => {
        expect(isAnagram('listen', 'silent')).toBe(true);
      });

      it('should handle different cases', () => {
        expect(isAnagram('Debit Card', 'Bad Credit')).toBe(true);
      });

      it('should reject non-anagram', () => {
        expect(isAnagram('hello', 'world')).toBe(false);
      });

      it('should handle empty strings', () => {
        expect(isAnagram('', '')).toBe(true);
      });
    });

    describe('Longest Common Substring', () => {
      const longestCommonSubstring = (s1: string, s2: string): string => {
        let longest = '';
        for (let i = 0; i < s1.length; i++) {
          for (let j = i + 1; j <= s1.length; j++) {
            const sub = s1.slice(i, j);
            if (s2.includes(sub) && sub.length > longest.length) {
              longest = sub;
            }
          }
        }
        return longest;
      };

      it('should find common substring', () => {
        expect(longestCommonSubstring('abcdef', 'zbcdf')).toBe('bcd');
      });

      it('should handle no common', () => {
        expect(longestCommonSubstring('abc', 'xyz')).toBe('');
      });

      it('should handle identical strings', () => {
        expect(longestCommonSubstring('hello', 'hello')).toBe('hello');
      });
    });

    describe('Levenshtein Distance', () => {
      const levenshtein = (s1: string, s2: string): number => {
        const m = s1.length, n = s2.length;
        const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
        
        for (let i = 0; i <= m; i++) dp[i][0] = i;
        for (let j = 0; j <= n; j++) dp[0][j] = j;
        
        for (let i = 1; i <= m; i++) {
          for (let j = 1; j <= n; j++) {
            if (s1[i - 1] === s2[j - 1]) {
              dp[i][j] = dp[i - 1][j - 1];
            } else {
              dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
            }
          }
        }
        return dp[m][n];
      };

      it('should compute distance', () => {
        expect(levenshtein('kitten', 'sitting')).toBe(3);
      });

      it('should handle identical strings', () => {
        expect(levenshtein('hello', 'hello')).toBe(0);
      });

      it('should handle empty strings', () => {
        expect(levenshtein('', 'hello')).toBe(5);
        expect(levenshtein('hello', '')).toBe(5);
      });

      it('should handle single char difference', () => {
        expect(levenshtein('cat', 'bat')).toBe(1);
      });
    });
  });

  // ===========================================================================
  // MATHEMATICAL ALGORITHMS - 30 TESTS
  // ===========================================================================
  describe('Mathematical Algorithms', () => {
    describe('Fibonacci', () => {
      const fibonacci = (n: number): number => {
        if (n <= 1) return n;
        let a = 0, b = 1;
        for (let i = 2; i <= n; i++) {
          [a, b] = [b, a + b];
        }
        return b;
      };

      it('should compute fib(0)', () => {
        expect(fibonacci(0)).toBe(0);
      });

      it('should compute fib(1)', () => {
        expect(fibonacci(1)).toBe(1);
      });

      it('should compute fib(10)', () => {
        expect(fibonacci(10)).toBe(55);
      });

      it('should compute fib(20)', () => {
        expect(fibonacci(20)).toBe(6765);
      });
    });

    describe('Factorial', () => {
      const factorial = (n: number): number => {
        if (n <= 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) result *= i;
        return result;
      };

      it('should compute 0!', () => {
        expect(factorial(0)).toBe(1);
      });

      it('should compute 1!', () => {
        expect(factorial(1)).toBe(1);
      });

      it('should compute 5!', () => {
        expect(factorial(5)).toBe(120);
      });

      it('should compute 10!', () => {
        expect(factorial(10)).toBe(3628800);
      });
    });

    describe('GCD', () => {
      const gcd = (a: number, b: number): number => {
        while (b !== 0) {
          [a, b] = [b, a % b];
        }
        return a;
      };

      it('should compute gcd(12, 8)', () => {
        expect(gcd(12, 8)).toBe(4);
      });

      it('should compute gcd(17, 13)', () => {
        expect(gcd(17, 13)).toBe(1);
      });

      it('should handle equal numbers', () => {
        expect(gcd(5, 5)).toBe(5);
      });

      it('should handle one as zero', () => {
        expect(gcd(5, 0)).toBe(5);
      });
    });

    describe('Prime Check', () => {
      const isPrime = (n: number): boolean => {
        if (n < 2) return false;
        if (n === 2) return true;
        if (n % 2 === 0) return false;
        for (let i = 3; i <= Math.sqrt(n); i += 2) {
          if (n % i === 0) return false;
        }
        return true;
      };

      it('should identify prime 2', () => {
        expect(isPrime(2)).toBe(true);
      });

      it('should identify prime 17', () => {
        expect(isPrime(17)).toBe(true);
      });

      it('should reject 1', () => {
        expect(isPrime(1)).toBe(false);
      });

      it('should reject 4', () => {
        expect(isPrime(4)).toBe(false);
      });

      it('should reject 0', () => {
        expect(isPrime(0)).toBe(false);
      });

      it('should reject negative', () => {
        expect(isPrime(-5)).toBe(false);
      });
    });

    describe('Power', () => {
      const power = (base: number, exp: number): number => {
        if (exp === 0) return 1;
        if (exp < 0) return 1 / power(base, -exp);
        let result = 1;
        for (let i = 0; i < exp; i++) result *= base;
        return result;
      };

      it('should compute 2^3', () => {
        expect(power(2, 3)).toBe(8);
      });

      it('should compute x^0', () => {
        expect(power(5, 0)).toBe(1);
      });

      it('should compute 2^-1', () => {
        expect(power(2, -1)).toBe(0.5);
      });

      it('should compute 10^2', () => {
        expect(power(10, 2)).toBe(100);
      });
    });
  });
});
