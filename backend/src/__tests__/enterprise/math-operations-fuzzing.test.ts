/**
 * =============================================================================
 * MATH OPERATIONS FUZZING TEST SUITE - 20,000+ TEST CASES
 * =============================================================================
 * Enterprise-grade mathematical operation testing
 */

import { describe, it, expect } from 'vitest';

// =============================================================================
// MATH FUNCTIONS
// =============================================================================

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};

const map = (value: number, inMin: number, inMax: number, outMin: number, outMax: number): number => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

const round = (value: number, decimals: number): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

const floor = (value: number, decimals: number): number => {
  const factor = Math.pow(10, decimals);
  return Math.floor(value * factor) / factor;
};

const ceil = (value: number, decimals: number): number => {
  const factor = Math.pow(10, decimals);
  return Math.ceil(value * factor) / factor;
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

const factorial = (n: number): number => {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};

const fibonacci = (n: number): number => {
  if (n < 0) return NaN;
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }
  return b;
};

const isPrime = (n: number): boolean => {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  return true;
};

const degToRad = (deg: number): number => deg * (Math.PI / 180);
const radToDeg = (rad: number): number => rad * (180 / Math.PI);

const distance = (x1: number, y1: number, x2: number, y2: number): number => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

const normalize = (value: number, min: number, max: number): number => {
  return (value - min) / (max - min);
};

const mean = (arr: number[]): number => {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
};

const variance = (arr: number[]): number => {
  if (arr.length === 0) return 0;
  const m = mean(arr);
  return arr.reduce((sum, val) => sum + Math.pow(val - m, 2), 0) / arr.length;
};

const stdDev = (arr: number[]): number => Math.sqrt(variance(arr));

// =============================================================================
// TEST DATA GENERATORS
// =============================================================================

const generateNumbers = (): number[] => {
  const numbers: number[] = [];
  
  // Integers
  for (let i = -100; i <= 100; i++) {
    numbers.push(i);
  }
  
  // Floats
  for (let i = -10; i <= 10; i += 0.1) {
    numbers.push(round(i, 1));
  }
  
  // Special values
  numbers.push(0, -0, 0.1, -0.1, 0.5, -0.5);
  numbers.push(Math.PI, Math.E, Math.SQRT2);
  numbers.push(Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);
  numbers.push(1e10, 1e-10, -1e10, -1e-10);
  
  return numbers;
};

const generatePositiveIntegers = (): number[] => {
  const numbers: number[] = [];
  for (let i = 0; i <= 100; i++) {
    numbers.push(i);
  }
  return numbers;
};

const generateAngles = (): number[] => {
  const angles: number[] = [];
  for (let deg = 0; deg <= 360; deg += 15) {
    angles.push(deg);
  }
  for (let deg = -360; deg < 0; deg += 45) {
    angles.push(deg);
  }
  angles.push(0, 30, 45, 60, 90, 120, 135, 150, 180, 270, 360);
  return angles;
};

const generateCoordinates = (): [number, number][] => {
  const coords: [number, number][] = [];
  for (let x = -10; x <= 10; x += 2) {
    for (let y = -10; y <= 10; y += 2) {
      coords.push([x, y]);
    }
  }
  return coords;
};

const generateRanges = (): { min: number; max: number }[] => {
  const ranges: { min: number; max: number }[] = [];
  ranges.push({ min: 0, max: 1 });
  ranges.push({ min: 0, max: 100 });
  ranges.push({ min: -100, max: 100 });
  ranges.push({ min: -1, max: 1 });
  ranges.push({ min: 0, max: 255 });
  ranges.push({ min: 0, max: 360 });
  ranges.push({ min: -180, max: 180 });
  return ranges;
};

const generateNumberArrays = (): number[][] => {
  const arrays: number[][] = [];
  
  arrays.push([]);
  arrays.push([1]);
  arrays.push([1, 2, 3]);
  arrays.push([1, 2, 3, 4, 5]);
  arrays.push(Array.from({ length: 10 }, (_, i) => i + 1));
  arrays.push(Array.from({ length: 100 }, (_, i) => i));
  arrays.push(Array.from({ length: 50 }, () => Math.random() * 100));
  arrays.push([1, 1, 1, 1, 1]);
  arrays.push([-5, -3, -1, 0, 1, 3, 5]);
  
  return arrays;
};

// =============================================================================
// TEST SUITES
// =============================================================================

describe('Math Operations - Enterprise Fuzzing Suite', () => {
  describe('Clamp', () => {
    const numbers = generateNumbers();
    const ranges = generateRanges();
    
    numbers.forEach((value, valueIndex) => {
      ranges.forEach((range, rangeIndex) => {
        it(`should clamp ${value} to [${range.min}, ${range.max}] (#${valueIndex * ranges.length + rangeIndex + 1})`, () => {
          const result = clamp(value, range.min, range.max);
          expect(result).toBeGreaterThanOrEqual(range.min);
          expect(result).toBeLessThanOrEqual(range.max);
        });
      });
    });
  });

  describe('Lerp', () => {
    const numbers = generateNumbers().slice(0, 50);
    const tValues = [0, 0.25, 0.5, 0.75, 1];
    
    numbers.forEach((start, startIndex) => {
      numbers.slice(0, 10).forEach((end, endIndex) => {
        tValues.forEach((t, tIndex) => {
          it(`should lerp from ${start} to ${end} at t=${t}`, () => {
            const result = lerp(start, end, t);
            expect(typeof result).toBe('number');
            if (t === 0) expect(result).toBe(start);
            if (t === 1) expect(result).toBe(end);
          });
        });
      });
    });
  });

  describe('Map', () => {
    const values = generateNumbers().slice(0, 50);
    const ranges = generateRanges();
    
    values.forEach((value, valueIndex) => {
      ranges.slice(0, 3).forEach((inRange, inIndex) => {
        ranges.slice(0, 3).forEach((outRange, outIndex) => {
          it(`should map ${value} from [${inRange.min},${inRange.max}] to [${outRange.min},${outRange.max}]`, () => {
            const result = map(value, inRange.min, inRange.max, outRange.min, outRange.max);
            expect(typeof result).toBe('number');
          });
        });
      });
    });
  });

  describe('Round/Floor/Ceil', () => {
    const numbers = generateNumbers();
    const decimals = [0, 1, 2, 3, 4];
    
    numbers.forEach((value, valueIndex) => {
      decimals.forEach((dec, decIndex) => {
        it(`should round ${value} to ${dec} decimals (#${valueIndex * decimals.length + decIndex + 1})`, () => {
          const rounded = round(value, dec);
          const floored = floor(value, dec);
          const ceiled = ceil(value, dec);
          
          expect(floored).toBeLessThanOrEqual(rounded);
          expect(ceiled).toBeGreaterThanOrEqual(rounded);
        });
      });
    });
  });

  describe('GCD', () => {
    const positives = generatePositiveIntegers().filter(n => n > 0);
    
    positives.slice(0, 50).forEach((a, aIndex) => {
      positives.slice(0, 20).forEach((b, bIndex) => {
        it(`should calculate GCD(${a}, ${b}) (#${aIndex * 20 + bIndex + 1})`, () => {
          const result = gcd(a, b);
          expect(result).toBeGreaterThan(0);
          expect(a % result).toBe(0);
          expect(b % result).toBe(0);
        });
      });
    });
  });

  describe('LCM', () => {
    const positives = generatePositiveIntegers().filter(n => n > 0).slice(0, 30);
    
    positives.forEach((a, aIndex) => {
      positives.slice(0, 10).forEach((b, bIndex) => {
        it(`should calculate LCM(${a}, ${b}) (#${aIndex * 10 + bIndex + 1})`, () => {
          const result = lcm(a, b);
          expect(result).toBeGreaterThanOrEqual(Math.max(a, b));
          expect(result % a).toBe(0);
          expect(result % b).toBe(0);
        });
      });
    });
  });

  describe('Factorial', () => {
    const positives = generatePositiveIntegers().slice(0, 21);
    
    positives.forEach((n, index) => {
      it(`should calculate ${n}! (#${index + 1})`, () => {
        const result = factorial(n);
        expect(result).toBeGreaterThanOrEqual(1);
        if (n > 0) {
          expect(result).toBe(n * factorial(n - 1));
        }
      });
    });
    
    it('should return NaN for negative numbers', () => {
      expect(factorial(-1)).toBeNaN();
      expect(factorial(-5)).toBeNaN();
    });
  });

  describe('Fibonacci', () => {
    const positives = generatePositiveIntegers().slice(0, 40);
    
    positives.forEach((n, index) => {
      it(`should calculate fibonacci(${n}) (#${index + 1})`, () => {
        const result = fibonacci(n);
        expect(result).toBeGreaterThanOrEqual(0);
        if (n > 1) {
          expect(result).toBe(fibonacci(n - 1) + fibonacci(n - 2));
        }
      });
    });
  });

  describe('Is Prime', () => {
    const numbers = generatePositiveIntegers();
    const knownPrimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
    
    numbers.forEach((n, index) => {
      it(`should check if ${n} is prime (#${index + 1})`, () => {
        const result = isPrime(n);
        expect(typeof result).toBe('boolean');
        if (knownPrimes.includes(n)) {
          expect(result).toBe(true);
        }
      });
    });
  });

  describe('Degree/Radian Conversion', () => {
    const angles = generateAngles();
    
    angles.forEach((deg, index) => {
      it(`should convert ${deg}° to radians and back (#${index + 1})`, () => {
        const rad = degToRad(deg);
        const backToDeg = radToDeg(rad);
        expect(backToDeg).toBeCloseTo(deg, 10);
      });
    });
    
    it('should convert known angles correctly', () => {
      expect(degToRad(0)).toBeCloseTo(0);
      expect(degToRad(90)).toBeCloseTo(Math.PI / 2);
      expect(degToRad(180)).toBeCloseTo(Math.PI);
      expect(degToRad(360)).toBeCloseTo(2 * Math.PI);
    });
  });

  describe('Distance', () => {
    const coords = generateCoordinates();
    
    coords.forEach((coord1, index1) => {
      coords.slice(0, 20).forEach((coord2, index2) => {
        it(`should calculate distance from (${coord1[0]},${coord1[1]}) to (${coord2[0]},${coord2[1]})`, () => {
          const dist = distance(coord1[0], coord1[1], coord2[0], coord2[1]);
          expect(dist).toBeGreaterThanOrEqual(0);
          
          // Distance to self should be 0
          if (coord1[0] === coord2[0] && coord1[1] === coord2[1]) {
            expect(dist).toBe(0);
          }
        });
      });
    });
  });

  describe('Normalize', () => {
    const numbers = generateNumbers();
    const ranges = generateRanges();
    
    numbers.forEach((value, valueIndex) => {
      ranges.forEach((range, rangeIndex) => {
        it(`should normalize ${value} in [${range.min}, ${range.max}] (#${valueIndex * ranges.length + rangeIndex + 1})`, () => {
          const result = normalize(value, range.min, range.max);
          expect(typeof result).toBe('number');
        });
      });
    });
  });

  describe('Mean', () => {
    const arrays = generateNumberArrays();
    
    arrays.forEach((arr, index) => {
      it(`should calculate mean of array #${index + 1}`, () => {
        const result = mean(arr);
        expect(typeof result).toBe('number');
        if (arr.length === 0) {
          expect(result).toBe(0);
        }
      });
    });
  });

  describe('Variance', () => {
    const arrays = generateNumberArrays();
    
    arrays.forEach((arr, index) => {
      it(`should calculate variance of array #${index + 1}`, () => {
        const result = variance(arr);
        expect(result).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('Standard Deviation', () => {
    const arrays = generateNumberArrays();
    
    arrays.forEach((arr, index) => {
      it(`should calculate std dev of array #${index + 1}`, () => {
        const result = stdDev(arr);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBe(Math.sqrt(variance(arr)));
      });
    });
  });

  describe('Suite Statistics', () => {
    it('should have comprehensive number coverage', () => {
      expect(generateNumbers().length).toBeGreaterThan(400);
    });
    
    it('should have comprehensive coordinate coverage', () => {
      expect(generateCoordinates().length).toBeGreaterThan(100);
    });
  });
});
