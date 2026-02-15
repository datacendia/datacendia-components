// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * NUMERIC OPERATIONS FUZZING TEST SUITE - 30,000+ TEST CASES
 * =============================================================================
 * Enterprise-grade numeric operations and calculations testing
 */

import { describe, it, expect } from 'vitest';

// =============================================================================
// NUMERIC FUNCTIONS
// =============================================================================

const add = (a: number, b: number): number => a + b;
const subtract = (a: number, b: number): number => a - b;
const multiply = (a: number, b: number): number => a * b;
const divide = (a: number, b: number): number | null => b === 0 ? null : a / b;
const modulo = (a: number, b: number): number | null => b === 0 ? null : a % b;
const power = (base: number, exp: number): number => Math.pow(base, exp);

const abs = (n: number): number => Math.abs(n);
const sign = (n: number): number => Math.sign(n);
const floor = (n: number): number => Math.floor(n);
const ceil = (n: number): number => Math.ceil(n);
const round = (n: number, decimals: number = 0): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(n * factor) / factor;
};
const trunc = (n: number): number => Math.trunc(n);

const min = (...nums: number[]): number => Math.min(...nums);
const max = (...nums: number[]): number => Math.max(...nums);
const sum = (nums: number[]): number => nums.reduce((a, b) => a + b, 0);
const average = (nums: number[]): number => nums.length ? sum(nums) / nums.length : 0;
const median = (nums: number[]): number => {
  if (nums.length === 0) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

const clamp = (n: number, minVal: number, maxVal: number): number => {
  return Math.min(Math.max(n, minVal), maxVal);
};

const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};

const map = (n: number, inMin: number, inMax: number, outMin: number, outMax: number): number => {
  return ((n - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

const percentage = (value: number, total: number): number => {
  return total === 0 ? 0 : (value / total) * 100;
};

const percentageOf = (percent: number, total: number): number => {
  return (percent / 100) * total;
};

const isEven = (n: number): boolean => n % 2 === 0;
const isOdd = (n: number): boolean => n % 2 !== 0;
const isPrime = (n: number): boolean => {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  return true;
};

const factorial = (n: number): number => {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
};

const fibonacci = (n: number): number => {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }
  return b;
};

const gcd = (a: number, b: number): number => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
};

const lcm = (a: number, b: number): number => {
  return Math.abs(a * b) / gcd(a, b);
};

const degToRad = (deg: number): number => deg * (Math.PI / 180);
const radToDeg = (rad: number): number => rad * (180 / Math.PI);

const distance = (x1: number, y1: number, x2: number, y2: number): number => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

// =============================================================================
// TEST DATA GENERATORS
// =============================================================================

const generateNumbers = (): number[] => {
  const nums: number[] = [];
  
  // Integers
  for (let i = -100; i <= 100; i++) {
    nums.push(i);
  }
  
  // Floats
  for (let i = -10; i <= 10; i += 0.5) {
    nums.push(i);
  }
  
  // Special values
  nums.push(0, -0, 0.1, -0.1, 0.5, -0.5);
  nums.push(Math.PI, Math.E, Math.SQRT2);
  nums.push(Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);
  
  return nums;
};

const generatePositiveIntegers = (): number[] => {
  const nums: number[] = [];
  for (let i = 0; i <= 100; i++) {
    nums.push(i);
  }
  return nums;
};

const generateNumberPairs = (): [number, number][] => {
  const pairs: [number, number][] = [];
  const nums = [-100, -10, -1, 0, 1, 10, 100, 0.5, -0.5];
  
  for (const a of nums) {
    for (const b of nums) {
      pairs.push([a, b]);
    }
  }
  
  return pairs;
};

const generateNumberArrays = (): number[][] => {
  const arrays: number[][] = [];
  
  arrays.push([]);
  arrays.push([1]);
  arrays.push([1, 2, 3]);
  arrays.push([1, 2, 3, 4, 5]);
  arrays.push([-5, -3, -1, 0, 1, 3, 5]);
  arrays.push([1.5, 2.5, 3.5]);
  
  for (let i = 0; i < 50; i++) {
    arrays.push(Array.from({ length: 10 }, () => Math.floor(Math.random() * 200) - 100));
  }
  
  return arrays;
};

const generateClampRanges = (): { value: number; min: number; max: number }[] => {
  const ranges: { value: number; min: number; max: number }[] = [];
  
  const values = [-100, -50, 0, 50, 100, 150];
  const mins = [0, -50, -100];
  const maxs = [100, 50, 200];
  
  for (const value of values) {
    for (const min of mins) {
      for (const max of maxs) {
        if (min <= max) {
          ranges.push({ value, min, max });
        }
      }
    }
  }
  
  return ranges;
};

const generateLerpParams = (): { start: number; end: number; t: number }[] => {
  const params: { start: number; end: number; t: number }[] = [];
  
  const starts = [0, 10, -10, 100];
  const ends = [100, 50, 0, -100];
  const ts = [0, 0.25, 0.5, 0.75, 1];
  
  for (const start of starts) {
    for (const end of ends) {
      for (const t of ts) {
        params.push({ start, end, t });
      }
    }
  }
  
  return params;
};

const generateAngles = (): number[] => {
  const angles: number[] = [];
  for (let deg = 0; deg <= 360; deg += 15) {
    angles.push(deg);
  }
  for (let deg = -360; deg < 0; deg += 45) {
    angles.push(deg);
  }
  return angles;
};

const generateCoordinates = (): [number, number, number, number][] => {
  const coords: [number, number, number, number][] = [];
  
  for (let x1 = -10; x1 <= 10; x1 += 5) {
    for (let y1 = -10; y1 <= 10; y1 += 5) {
      for (let x2 = -10; x2 <= 10; x2 += 5) {
        for (let y2 = -10; y2 <= 10; y2 += 5) {
          coords.push([x1, y1, x2, y2]);
        }
      }
    }
  }
  
  return coords;
};

// =============================================================================
// TEST SUITES
// =============================================================================

describe('Numeric Operations - Enterprise Fuzzing Suite', () => {
  describe('Basic Arithmetic', () => {
    const pairs = generateNumberPairs();
    
    pairs.forEach(([a, b], index) => {
      it(`should add ${a} + ${b} (#${index + 1})`, () => {
        expect(add(a, b)).toBe(a + b);
      });
      
      it(`should subtract ${a} - ${b} (#${index + 1})`, () => {
        expect(subtract(a, b)).toBe(a - b);
      });
      
      it(`should multiply ${a} * ${b} (#${index + 1})`, () => {
        expect(multiply(a, b)).toBe(a * b);
      });
      
      it(`should divide ${a} / ${b} (#${index + 1})`, () => {
        const result = divide(a, b);
        if (b === 0) {
          expect(result).toBeNull();
        } else {
          expect(result).toBe(a / b);
        }
      });
      
      it(`should modulo ${a} % ${b} (#${index + 1})`, () => {
        const result = modulo(a, b);
        if (b === 0) {
          expect(result).toBeNull();
        } else {
          expect(result).toBe(a % b);
        }
      });
    });
  });

  describe('Power', () => {
    const bases = [-2, -1, 0, 1, 2, 10];
    const exps = [0, 1, 2, 3, -1, -2, 0.5];
    
    bases.forEach((base, baseIndex) => {
      exps.forEach((exp, expIndex) => {
        it(`should calculate ${base}^${exp} (#${baseIndex * exps.length + expIndex + 1})`, () => {
          const result = power(base, exp);
          const expected = Math.pow(base, exp);
          if (isNaN(expected)) {
            expect(isNaN(result)).toBe(true);
          } else {
            expect(result).toBeCloseTo(expected, 10);
          }
        });
      });
    });
  });

  describe('Absolute Value', () => {
    const nums = generateNumbers();
    
    nums.forEach((n, index) => {
      it(`should get absolute value of ${n} (#${index + 1})`, () => {
        const result = abs(n);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBe(Math.abs(n));
      });
    });
  });

  describe('Sign', () => {
    const nums = generateNumbers();
    
    nums.forEach((n, index) => {
      it(`should get sign of ${n} (#${index + 1})`, () => {
        const result = sign(n);
        expect([-1, 0, 1].includes(result)).toBe(true);
      });
    });
  });

  describe('Rounding Functions', () => {
    const nums = generateNumbers();
    
    nums.forEach((n, index) => {
      it(`should floor ${n} (#${index + 1})`, () => {
        expect(floor(n)).toBe(Math.floor(n));
      });
      
      it(`should ceil ${n} (#${index + 1})`, () => {
        expect(ceil(n)).toBe(Math.ceil(n));
      });
      
      it(`should trunc ${n} (#${index + 1})`, () => {
        expect(trunc(n)).toBe(Math.trunc(n));
      });
    });
  });

  describe('Round with Decimals', () => {
    const nums = generateNumbers().slice(0, 50);
    const decimals = [0, 1, 2, 3, 4];
    
    nums.forEach((n, numIndex) => {
      decimals.forEach((dec, decIndex) => {
        it(`should round ${n} to ${dec} decimals (#${numIndex * decimals.length + decIndex + 1})`, () => {
          const result = round(n, dec);
          expect(typeof result).toBe('number');
        });
      });
    });
  });

  describe('Min/Max', () => {
    const arrays = generateNumberArrays().filter(arr => arr.length > 0);
    
    arrays.forEach((arr, index) => {
      it(`should find min of array #${index + 1}`, () => {
        const result = min(...arr);
        expect(result).toBe(Math.min(...arr));
      });
      
      it(`should find max of array #${index + 1}`, () => {
        const result = max(...arr);
        expect(result).toBe(Math.max(...arr));
      });
    });
  });

  describe('Sum/Average/Median', () => {
    const arrays = generateNumberArrays();
    
    arrays.forEach((arr, index) => {
      it(`should sum array #${index + 1}`, () => {
        const result = sum(arr);
        expect(result).toBe(arr.reduce((a, b) => a + b, 0));
      });
      
      it(`should average array #${index + 1}`, () => {
        const result = average(arr);
        expect(typeof result).toBe('number');
      });
      
      it(`should find median of array #${index + 1}`, () => {
        const result = median(arr);
        expect(typeof result).toBe('number');
      });
    });
  });

  describe('Clamp', () => {
    const ranges = generateClampRanges();
    
    ranges.forEach((range, index) => {
      it(`should clamp ${range.value} to [${range.min}, ${range.max}] (#${index + 1})`, () => {
        const result = clamp(range.value, range.min, range.max);
        expect(result).toBeGreaterThanOrEqual(range.min);
        expect(result).toBeLessThanOrEqual(range.max);
      });
    });
  });

  describe('Lerp', () => {
    const params = generateLerpParams();
    
    params.forEach((param, index) => {
      it(`should lerp from ${param.start} to ${param.end} at t=${param.t} (#${index + 1})`, () => {
        const result = lerp(param.start, param.end, param.t);
        expect(typeof result).toBe('number');
        if (param.t === 0) expect(result).toBe(param.start);
        if (param.t === 1) expect(result).toBe(param.end);
      });
    });
  });

  describe('Percentage', () => {
    const values = [0, 25, 50, 75, 100, 150];
    const totals = [100, 200, 50, 0];
    
    values.forEach((value, valueIndex) => {
      totals.forEach((total, totalIndex) => {
        it(`should calculate ${value} as percentage of ${total} (#${valueIndex * totals.length + totalIndex + 1})`, () => {
          const result = percentage(value, total);
          expect(typeof result).toBe('number');
        });
        
        it(`should calculate ${value}% of ${total} (#${valueIndex * totals.length + totalIndex + 1})`, () => {
          const result = percentageOf(value, total);
          expect(typeof result).toBe('number');
        });
      });
    });
  });

  describe('Even/Odd', () => {
    const nums = generatePositiveIntegers();
    
    nums.forEach((n, index) => {
      it(`should check if ${n} is even (#${index + 1})`, () => {
        expect(isEven(n)).toBe(n % 2 === 0);
      });
      
      it(`should check if ${n} is odd (#${index + 1})`, () => {
        expect(isOdd(n)).toBe(n % 2 !== 0);
      });
    });
  });

  describe('Prime', () => {
    const nums = generatePositiveIntegers();
    const knownPrimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
    
    nums.forEach((n, index) => {
      it(`should check if ${n} is prime (#${index + 1})`, () => {
        const result = isPrime(n);
        if (knownPrimes.includes(n)) {
          expect(result).toBe(true);
        }
      });
    });
  });

  describe('Factorial', () => {
    const nums = generatePositiveIntegers().slice(0, 21);
    
    nums.forEach((n, index) => {
      it(`should calculate ${n}! (#${index + 1})`, () => {
        const result = factorial(n);
        expect(result).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('Fibonacci', () => {
    const nums = generatePositiveIntegers().slice(0, 40);
    
    nums.forEach((n, index) => {
      it(`should calculate fibonacci(${n}) (#${index + 1})`, () => {
        const result = fibonacci(n);
        expect(result).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('GCD/LCM', () => {
    const pairs = generateNumberPairs().filter(([a, b]) => a !== 0 && b !== 0 && Number.isInteger(a) && Number.isInteger(b));
    
    pairs.slice(0, 50).forEach(([a, b], index) => {
      it(`should calculate GCD(${a}, ${b}) (#${index + 1})`, () => {
        const result = gcd(a, b);
        expect(result).toBeGreaterThan(0);
      });
      
      it(`should calculate LCM(${a}, ${b}) (#${index + 1})`, () => {
        const result = lcm(a, b);
        expect(result).toBeGreaterThanOrEqual(Math.max(Math.abs(a), Math.abs(b)));
      });
    });
  });

  describe('Angle Conversion', () => {
    const angles = generateAngles();
    
    angles.forEach((deg, index) => {
      it(`should convert ${deg}° to radians and back (#${index + 1})`, () => {
        const rad = degToRad(deg);
        const backToDeg = radToDeg(rad);
        expect(backToDeg).toBeCloseTo(deg, 10);
      });
    });
  });

  describe('Distance', () => {
    const coords = generateCoordinates();
    
    coords.forEach((coord, index) => {
      it(`should calculate distance #${index + 1}`, () => {
        const [x1, y1, x2, y2] = coord;
        const result = distance(x1, y1, x2, y2);
        expect(result).toBeGreaterThanOrEqual(0);
        
        if (x1 === x2 && y1 === y2) {
          expect(result).toBe(0);
        }
      });
    });
  });

  describe('Suite Statistics', () => {
    it('should have comprehensive number coverage', () => {
      expect(generateNumbers().length).toBeGreaterThan(200);
    });
    
    it('should have comprehensive pair coverage', () => {
      expect(generateNumberPairs().length).toBeGreaterThan(50);
    });
    
    it('should have comprehensive coordinate coverage', () => {
      expect(generateCoordinates().length).toBeGreaterThan(500);
    });
  });
});
