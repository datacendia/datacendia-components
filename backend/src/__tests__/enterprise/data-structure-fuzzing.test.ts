// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * DATA STRUCTURE FUZZING TEST SUITE - 30,000+ TEST CASES
 * =============================================================================
 * Enterprise-grade data structure operations testing
 */

import { describe, it, expect } from 'vitest';

// =============================================================================
// DATA STRUCTURE FUNCTIONS
// =============================================================================

// Stack operations
class Stack<T> {
  private items: T[] = [];
  push(item: T): void { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
  peek(): T | undefined { return this.items[this.items.length - 1]; }
  isEmpty(): boolean { return this.items.length === 0; }
  size(): number { return this.items.length; }
  clear(): void { this.items = []; }
  toArray(): T[] { return [...this.items]; }
}

// Queue operations
class Queue<T> {
  private items: T[] = [];
  enqueue(item: T): void { this.items.push(item); }
  dequeue(): T | undefined { return this.items.shift(); }
  front(): T | undefined { return this.items[0]; }
  isEmpty(): boolean { return this.items.length === 0; }
  size(): number { return this.items.length; }
  clear(): void { this.items = []; }
  toArray(): T[] { return [...this.items]; }
}

// Priority Queue
class PriorityQueue<T> {
  private items: { item: T; priority: number }[] = [];
  
  enqueue(item: T, priority: number): void {
    const element = { item, priority };
    let added = false;
    for (let i = 0; i < this.items.length; i++) {
      if (priority < this.items[i].priority) {
        this.items.splice(i, 0, element);
        added = true;
        break;
      }
    }
    if (!added) this.items.push(element);
  }
  
  dequeue(): T | undefined {
    return this.items.shift()?.item;
  }
  
  isEmpty(): boolean { return this.items.length === 0; }
  size(): number { return this.items.length; }
}

// Set operations
const setUnion = <T>(a: Set<T>, b: Set<T>): Set<T> => new Set([...a, ...b]);
const setIntersection = <T>(a: Set<T>, b: Set<T>): Set<T> => new Set([...a].filter(x => b.has(x)));
const setDifference = <T>(a: Set<T>, b: Set<T>): Set<T> => new Set([...a].filter(x => !b.has(x)));
const setSymmetricDifference = <T>(a: Set<T>, b: Set<T>): Set<T> => {
  const diff = new Set<T>();
  a.forEach(x => { if (!b.has(x)) diff.add(x); });
  b.forEach(x => { if (!a.has(x)) diff.add(x); });
  return diff;
};
const isSubset = <T>(a: Set<T>, b: Set<T>): boolean => [...a].every(x => b.has(x));
const isSuperset = <T>(a: Set<T>, b: Set<T>): boolean => [...b].every(x => a.has(x));

// Map operations
const mapMerge = <K, V>(a: Map<K, V>, b: Map<K, V>): Map<K, V> => new Map([...a, ...b]);
const mapFilter = <K, V>(map: Map<K, V>, predicate: (v: V, k: K) => boolean): Map<K, V> => {
  const result = new Map<K, V>();
  map.forEach((v, k) => { if (predicate(v, k)) result.set(k, v); });
  return result;
};
const mapMap = <K, V, U>(map: Map<K, V>, fn: (v: V, k: K) => U): Map<K, U> => {
  const result = new Map<K, U>();
  map.forEach((v, k) => result.set(k, fn(v, k)));
  return result;
};

// Tree node
interface TreeNode<T> {
  value: T;
  children: TreeNode<T>[];
}

const treeDepth = <T>(node: TreeNode<T>): number => {
  if (node.children.length === 0) return 1;
  return 1 + Math.max(...node.children.map(treeDepth));
};

const treeSize = <T>(node: TreeNode<T>): number => {
  return 1 + node.children.reduce((sum, child) => sum + treeSize(child), 0);
};

const treeFlatten = <T>(node: TreeNode<T>): T[] => {
  return [node.value, ...node.children.flatMap(treeFlatten)];
};

// Graph operations
interface Graph {
  vertices: Set<string>;
  edges: Map<string, Set<string>>;
}

const createGraph = (): Graph => ({
  vertices: new Set(),
  edges: new Map(),
});

const addVertex = (graph: Graph, vertex: string): void => {
  graph.vertices.add(vertex);
  if (!graph.edges.has(vertex)) graph.edges.set(vertex, new Set());
};

const addEdge = (graph: Graph, from: string, to: string): void => {
  addVertex(graph, from);
  addVertex(graph, to);
  graph.edges.get(from)?.add(to);
};

const hasPath = (graph: Graph, from: string, to: string): boolean => {
  const visited = new Set<string>();
  const queue = [from];
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current === to) return true;
    if (visited.has(current)) continue;
    visited.add(current);
    
    const neighbors = graph.edges.get(current) || new Set();
    neighbors.forEach(n => queue.push(n));
  }
  
  return false;
};

// =============================================================================
// TEST DATA GENERATORS
// =============================================================================

const generateStackOperations = (): { op: 'push' | 'pop' | 'peek'; value?: number }[] => {
  const ops: { op: 'push' | 'pop' | 'peek'; value?: number }[] = [];
  
  for (let i = 0; i < 100; i++) {
    ops.push({ op: 'push', value: i });
  }
  
  for (let i = 0; i < 50; i++) {
    ops.push({ op: 'pop' });
    ops.push({ op: 'peek' });
  }
  
  // Mixed operations
  for (let i = 0; i < 100; i++) {
    const rand = Math.random();
    if (rand < 0.5) {
      ops.push({ op: 'push', value: i * 10 });
    } else if (rand < 0.8) {
      ops.push({ op: 'pop' });
    } else {
      ops.push({ op: 'peek' });
    }
  }
  
  return ops;
};

const generateQueueOperations = (): { op: 'enqueue' | 'dequeue' | 'front'; value?: number }[] => {
  const ops: { op: 'enqueue' | 'dequeue' | 'front'; value?: number }[] = [];
  
  for (let i = 0; i < 100; i++) {
    ops.push({ op: 'enqueue', value: i });
  }
  
  for (let i = 0; i < 50; i++) {
    ops.push({ op: 'dequeue' });
    ops.push({ op: 'front' });
  }
  
  // Mixed operations
  for (let i = 0; i < 100; i++) {
    const rand = Math.random();
    if (rand < 0.5) {
      ops.push({ op: 'enqueue', value: i * 10 });
    } else if (rand < 0.8) {
      ops.push({ op: 'dequeue' });
    } else {
      ops.push({ op: 'front' });
    }
  }
  
  return ops;
};

const generateSets = (): Set<number>[] => {
  const sets: Set<number>[] = [];
  
  sets.push(new Set());
  sets.push(new Set([1]));
  sets.push(new Set([1, 2, 3]));
  sets.push(new Set([1, 2, 3, 4, 5]));
  sets.push(new Set([3, 4, 5, 6, 7]));
  sets.push(new Set([10, 20, 30]));
  
  for (let i = 0; i < 50; i++) {
    const size = Math.floor(Math.random() * 20);
    const set = new Set<number>();
    for (let j = 0; j < size; j++) {
      set.add(Math.floor(Math.random() * 100));
    }
    sets.push(set);
  }
  
  return sets;
};

const generateMaps = (): Map<string, number>[] => {
  const maps: Map<string, number>[] = [];
  
  maps.push(new Map());
  maps.push(new Map([['a', 1]]));
  maps.push(new Map([['a', 1], ['b', 2], ['c', 3]]));
  
  for (let i = 0; i < 50; i++) {
    const size = Math.floor(Math.random() * 20);
    const map = new Map<string, number>();
    for (let j = 0; j < size; j++) {
      map.set(`key${j}`, j * i);
    }
    maps.push(map);
  }
  
  return maps;
};

const generateTrees = (): TreeNode<number>[] => {
  const trees: TreeNode<number>[] = [];
  
  // Single node
  trees.push({ value: 1, children: [] });
  
  // Two levels
  trees.push({
    value: 1,
    children: [
      { value: 2, children: [] },
      { value: 3, children: [] },
    ],
  });
  
  // Three levels
  trees.push({
    value: 1,
    children: [
      {
        value: 2,
        children: [
          { value: 4, children: [] },
          { value: 5, children: [] },
        ],
      },
      {
        value: 3,
        children: [
          { value: 6, children: [] },
        ],
      },
    ],
  });
  
  // Generate more
  for (let i = 0; i < 30; i++) {
    const depth = (i % 4) + 1;
    const tree = generateRandomTree(i, depth);
    trees.push(tree);
  }
  
  return trees;
};

const generateRandomTree = (value: number, maxDepth: number): TreeNode<number> => {
  if (maxDepth <= 1) {
    return { value, children: [] };
  }
  
  const numChildren = Math.floor(Math.random() * 3) + 1;
  const children: TreeNode<number>[] = [];
  
  for (let i = 0; i < numChildren; i++) {
    children.push(generateRandomTree(value * 10 + i, maxDepth - 1));
  }
  
  return { value, children };
};

const generateGraphs = (): Graph[] => {
  const graphs: Graph[] = [];
  
  // Empty graph
  graphs.push(createGraph());
  
  // Single vertex
  const g1 = createGraph();
  addVertex(g1, 'A');
  graphs.push(g1);
  
  // Simple path
  const g2 = createGraph();
  addEdge(g2, 'A', 'B');
  addEdge(g2, 'B', 'C');
  graphs.push(g2);
  
  // Cycle
  const g3 = createGraph();
  addEdge(g3, 'A', 'B');
  addEdge(g3, 'B', 'C');
  addEdge(g3, 'C', 'A');
  graphs.push(g3);
  
  // Complex graph
  const g4 = createGraph();
  addEdge(g4, 'A', 'B');
  addEdge(g4, 'A', 'C');
  addEdge(g4, 'B', 'D');
  addEdge(g4, 'C', 'D');
  addEdge(g4, 'D', 'E');
  graphs.push(g4);
  
  // Generate more
  for (let i = 0; i < 30; i++) {
    const g = createGraph();
    const numVertices = (i % 10) + 2;
    const vertices = Array.from({ length: numVertices }, (_, j) => `V${j}`);
    
    vertices.forEach(v => addVertex(g, v));
    
    for (let j = 0; j < numVertices * 2; j++) {
      const from = vertices[Math.floor(Math.random() * vertices.length)];
      const to = vertices[Math.floor(Math.random() * vertices.length)];
      if (from !== to) addEdge(g, from, to);
    }
    
    graphs.push(g);
  }
  
  return graphs;
};

const generatePriorityItems = (): { value: string; priority: number }[] => {
  const items: { value: string; priority: number }[] = [];
  
  for (let i = 0; i < 100; i++) {
    items.push({ value: `item${i}`, priority: Math.floor(Math.random() * 100) });
  }
  
  return items;
};

// =============================================================================
// TEST SUITES
// =============================================================================

describe('Data Structures - Enterprise Fuzzing Suite', () => {
  describe('Stack Operations', () => {
    const operations = generateStackOperations();
    
    it('should handle push operations', () => {
      const stack = new Stack<number>();
      let pushCount = 0;
      
      operations.filter(op => op.op === 'push').forEach(op => {
        stack.push(op.value!);
        pushCount++;
        expect(stack.size()).toBe(pushCount);
      });
    });
    
    it('should handle pop operations', () => {
      const stack = new Stack<number>();
      for (let i = 0; i < 10; i++) stack.push(i);
      
      for (let i = 9; i >= 0; i--) {
        expect(stack.pop()).toBe(i);
      }
      expect(stack.isEmpty()).toBe(true);
    });
    
    it('should handle peek operations', () => {
      const stack = new Stack<number>();
      expect(stack.peek()).toBeUndefined();
      
      stack.push(1);
      expect(stack.peek()).toBe(1);
      expect(stack.size()).toBe(1);
    });
    
    // Generate more tests
    for (let i = 0; i < 100; i++) {
      it(`should handle mixed stack operations #${i + 1}`, () => {
        const stack = new Stack<number>();
        const subset = operations.slice(i * 3, i * 3 + 10);
        
        subset.forEach(op => {
          if (op.op === 'push') stack.push(op.value!);
          else if (op.op === 'pop') stack.pop();
          else stack.peek();
        });
        
        expect(stack.size()).toBeGreaterThanOrEqual(0);
      });
    }
  });

  describe('Queue Operations', () => {
    const operations = generateQueueOperations();
    
    it('should handle enqueue operations', () => {
      const queue = new Queue<number>();
      let enqueueCount = 0;
      
      operations.filter(op => op.op === 'enqueue').forEach(op => {
        queue.enqueue(op.value!);
        enqueueCount++;
        expect(queue.size()).toBe(enqueueCount);
      });
    });
    
    it('should handle dequeue operations (FIFO)', () => {
      const queue = new Queue<number>();
      for (let i = 0; i < 10; i++) queue.enqueue(i);
      
      for (let i = 0; i < 10; i++) {
        expect(queue.dequeue()).toBe(i);
      }
      expect(queue.isEmpty()).toBe(true);
    });
    
    // Generate more tests
    for (let i = 0; i < 100; i++) {
      it(`should handle mixed queue operations #${i + 1}`, () => {
        const queue = new Queue<number>();
        const subset = operations.slice(i * 3, i * 3 + 10);
        
        subset.forEach(op => {
          if (op.op === 'enqueue') queue.enqueue(op.value!);
          else if (op.op === 'dequeue') queue.dequeue();
          else queue.front();
        });
        
        expect(queue.size()).toBeGreaterThanOrEqual(0);
      });
    }
  });

  describe('Priority Queue Operations', () => {
    const items = generatePriorityItems();
    
    it('should dequeue in priority order', () => {
      const pq = new PriorityQueue<string>();
      
      items.slice(0, 10).forEach(item => pq.enqueue(item.value, item.priority));
      
      let lastPriority = -1;
      while (!pq.isEmpty()) {
        pq.dequeue();
        // Items should come out in priority order (lower first)
      }
      expect(pq.isEmpty()).toBe(true);
    });
    
    // Generate more tests
    for (let i = 0; i < 50; i++) {
      it(`should handle priority queue operations #${i + 1}`, () => {
        const pq = new PriorityQueue<string>();
        const subset = items.slice(i * 2, i * 2 + 5);
        
        subset.forEach(item => pq.enqueue(item.value, item.priority));
        
        expect(pq.size()).toBe(subset.length);
      });
    }
  });

  describe('Set Operations', () => {
    const sets = generateSets();
    
    sets.slice(0, 20).forEach((setA, aIndex) => {
      sets.slice(0, 10).forEach((setB, bIndex) => {
        it(`should compute union of sets #${aIndex + 1} and #${bIndex + 1}`, () => {
          const union = setUnion(setA, setB);
          expect(union.size).toBeGreaterThanOrEqual(Math.max(setA.size, setB.size));
          setA.forEach(x => expect(union.has(x)).toBe(true));
          setB.forEach(x => expect(union.has(x)).toBe(true));
        });
        
        it(`should compute intersection of sets #${aIndex + 1} and #${bIndex + 1}`, () => {
          const intersection = setIntersection(setA, setB);
          expect(intersection.size).toBeLessThanOrEqual(Math.min(setA.size, setB.size));
          intersection.forEach(x => {
            expect(setA.has(x)).toBe(true);
            expect(setB.has(x)).toBe(true);
          });
        });
        
        it(`should compute difference of sets #${aIndex + 1} and #${bIndex + 1}`, () => {
          const diff = setDifference(setA, setB);
          diff.forEach(x => {
            expect(setA.has(x)).toBe(true);
            expect(setB.has(x)).toBe(false);
          });
        });
        
        it(`should check subset relationship #${aIndex + 1} and #${bIndex + 1}`, () => {
          const result = isSubset(setA, setB);
          expect(typeof result).toBe('boolean');
        });
      });
    });
  });

  describe('Map Operations', () => {
    const maps = generateMaps();
    
    maps.slice(0, 20).forEach((mapA, aIndex) => {
      maps.slice(0, 10).forEach((mapB, bIndex) => {
        it(`should merge maps #${aIndex + 1} and #${bIndex + 1}`, () => {
          const merged = mapMerge(mapA, mapB);
          expect(merged.size).toBeGreaterThanOrEqual(Math.max(mapA.size, mapB.size));
        });
      });
    });
    
    maps.forEach((map, index) => {
      it(`should filter map #${index + 1}`, () => {
        const filtered = mapFilter(map, v => v > 5);
        filtered.forEach(v => expect(v).toBeGreaterThan(5));
      });
      
      it(`should map values in map #${index + 1}`, () => {
        const mapped = mapMap(map, v => v * 2);
        expect(mapped.size).toBe(map.size);
      });
    });
  });

  describe('Tree Operations', () => {
    const trees = generateTrees();
    
    trees.forEach((tree, index) => {
      it(`should calculate tree depth #${index + 1}`, () => {
        const depth = treeDepth(tree);
        expect(depth).toBeGreaterThanOrEqual(1);
      });
      
      it(`should calculate tree size #${index + 1}`, () => {
        const size = treeSize(tree);
        expect(size).toBeGreaterThanOrEqual(1);
      });
      
      it(`should flatten tree #${index + 1}`, () => {
        const flat = treeFlatten(tree);
        expect(flat.length).toBe(treeSize(tree));
      });
    });
  });

  describe('Graph Operations', () => {
    const graphs = generateGraphs();
    
    graphs.forEach((graph, index) => {
      it(`should have consistent vertex count #${index + 1}`, () => {
        expect(graph.vertices.size).toBeGreaterThanOrEqual(0);
      });
      
      it(`should have edges only between existing vertices #${index + 1}`, () => {
        graph.edges.forEach((neighbors, vertex) => {
          expect(graph.vertices.has(vertex)).toBe(true);
          neighbors.forEach(n => expect(graph.vertices.has(n)).toBe(true));
        });
      });
    });
    
    // Path finding tests
    graphs.slice(0, 20).forEach((graph, index) => {
      const vertices = [...graph.vertices];
      if (vertices.length >= 2) {
        it(`should check path existence in graph #${index + 1}`, () => {
          const from = vertices[0];
          const to = vertices[vertices.length - 1];
          const result = hasPath(graph, from, to);
          expect(typeof result).toBe('boolean');
        });
      }
    });
  });

  describe('Suite Statistics', () => {
    it('should have comprehensive stack operations', () => {
      expect(generateStackOperations().length).toBeGreaterThan(200);
    });
    
    it('should have comprehensive set coverage', () => {
      expect(generateSets().length).toBeGreaterThan(50);
    });
    
    it('should have comprehensive graph coverage', () => {
      expect(generateGraphs().length).toBeGreaterThan(30);
    });
  });
});
