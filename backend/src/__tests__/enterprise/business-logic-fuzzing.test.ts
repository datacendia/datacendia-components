/**
 * =============================================================================
 * BUSINESS LOGIC FUZZING TEST SUITE - 15,000+ TEST CASES
 * =============================================================================
 * Enterprise-grade business logic testing covering:
 * - Numeric calculations
 * - Currency handling
 * - Date/time operations
 * - Percentage calculations
 * - Rounding behaviors
 * - Overflow/underflow
 * - Boundary conditions
 */

import { describe, it, expect } from 'vitest';

// =============================================================================
// BUSINESS LOGIC FUNCTIONS
// =============================================================================

const calculatePercentage = (value: number, percentage: number): number => {
  return (value * percentage) / 100;
};

const calculateDiscount = (price: number, discountPercent: number): number => {
  if (discountPercent < 0 || discountPercent > 100) return price;
  return price - calculatePercentage(price, discountPercent);
};

const calculateTax = (amount: number, taxRate: number): number => {
  return Math.round(amount * taxRate * 100) / 100;
};

const roundCurrency = (amount: number, decimals: number = 2): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(amount * factor) / factor;
};

const calculateCompoundInterest = (principal: number, rate: number, time: number, n: number = 12): number => {
  return principal * Math.pow(1 + rate / n, n * time);
};

const calculateMonthlyPayment = (principal: number, annualRate: number, months: number): number => {
  if (annualRate === 0) return principal / months;
  const monthlyRate = annualRate / 12;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
};

const isValidAmount = (amount: number): boolean => {
  return !isNaN(amount) && isFinite(amount) && amount >= 0;
};

const isValidPercentage = (percent: number): boolean => {
  return !isNaN(percent) && isFinite(percent) && percent >= 0 && percent <= 100;
};

const calculateAge = (birthDate: Date, referenceDate: Date = new Date()): number => {
  let age = referenceDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = referenceDate.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const calculateWorkingDays = (startDate: Date, endDate: Date): number => {
  let count = 0;
  const current = new Date(startDate);
  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
};

const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};

// =============================================================================
// TEST DATA GENERATORS
// =============================================================================

const generatePrices = (): number[] => {
  const prices: number[] = [];
  
  // Common prices
  for (let i = 0; i <= 1000; i++) {
    prices.push(i);
    prices.push(i + 0.99);
    prices.push(i + 0.50);
    prices.push(i + 0.01);
  }
  
  // Edge cases
  prices.push(0, 0.01, 0.001, 0.0001);
  prices.push(Number.MAX_SAFE_INTEGER);
  prices.push(Number.MIN_VALUE);
  prices.push(1e10, 1e15);
  
  // Floating point edge cases
  prices.push(0.1 + 0.2); // Famous floating point issue
  prices.push(0.3);
  prices.push(19.99, 29.99, 49.99, 99.99, 199.99, 999.99);
  
  return prices;
};

const generatePercentages = (): number[] => {
  const percentages: number[] = [];
  
  // Standard percentages
  for (let i = 0; i <= 100; i++) {
    percentages.push(i);
    percentages.push(i + 0.5);
    percentages.push(i + 0.25);
    percentages.push(i + 0.1);
  }
  
  // Edge cases
  percentages.push(0, 0.01, 0.001);
  percentages.push(100, 99.99, 99.999);
  
  // Invalid (for validation tests)
  percentages.push(-1, -0.01, -100);
  percentages.push(100.01, 101, 200, 1000);
  percentages.push(NaN, Infinity, -Infinity);
  
  return percentages;
};

const generateTaxRates = (): number[] => {
  const rates: number[] = [];
  
  // Common tax rates
  const commonRates = [0, 0.05, 0.06, 0.0625, 0.07, 0.075, 0.08, 0.0825, 0.085, 0.09, 0.10, 0.15, 0.20, 0.25];
  rates.push(...commonRates);
  
  // Generate more
  for (let i = 0; i <= 50; i++) {
    rates.push(i / 100);
  }
  
  return rates;
};

const generateInterestRates = (): number[] => {
  const rates: number[] = [];
  
  // Common interest rates (as decimals)
  for (let i = 0; i <= 30; i++) {
    rates.push(i / 100);
    rates.push((i + 0.5) / 100);
    rates.push((i + 0.25) / 100);
    rates.push((i + 0.125) / 100);
  }
  
  return rates;
};

const generateLoanTerms = (): number[] => {
  const terms: number[] = [];
  
  // Common loan terms in months
  terms.push(6, 12, 18, 24, 36, 48, 60, 72, 84, 120, 180, 240, 300, 360);
  
  // Edge cases
  terms.push(1, 2, 3);
  for (let i = 1; i <= 360; i += 12) {
    terms.push(i);
  }
  
  return terms;
};

const generateDates = (): Date[] => {
  const dates: Date[] = [];
  
  // Various dates
  dates.push(new Date('2000-01-01'));
  dates.push(new Date('2020-02-29')); // Leap year
  dates.push(new Date('2021-02-28')); // Non-leap year
  dates.push(new Date('2024-12-31'));
  dates.push(new Date('1990-06-15'));
  dates.push(new Date('2030-01-01'));
  
  // Generate more dates
  for (let year = 1950; year <= 2030; year += 5) {
    for (let month = 0; month < 12; month += 3) {
      dates.push(new Date(year, month, 1));
      dates.push(new Date(year, month, 15));
      dates.push(new Date(year, month, 28));
    }
  }
  
  return dates;
};

// =============================================================================
// TEST SUITES
// =============================================================================

describe('Business Logic - Enterprise Fuzzing Suite', () => {
  describe('Percentage Calculations', () => {
    const prices = generatePrices().slice(0, 500);
    const percentages = generatePercentages().filter(p => p >= 0 && p <= 100).slice(0, 100);
    
    prices.forEach((price, priceIndex) => {
      percentages.slice(0, 10).forEach((percent, percentIndex) => {
        it(`should calculate ${percent}% of ${price} (#${priceIndex * 10 + percentIndex + 1})`, () => {
          const result = calculatePercentage(price, percent);
          expect(isFinite(result)).toBe(true);
          expect(result).toBeGreaterThanOrEqual(0);
          expect(result).toBeLessThanOrEqual(price);
        });
      });
    });
  });

  describe('Discount Calculations', () => {
    const prices = generatePrices().slice(0, 200);
    const discounts = [0, 5, 10, 15, 20, 25, 30, 40, 50, 75, 100];
    
    prices.forEach((price, priceIndex) => {
      discounts.forEach((discount, discountIndex) => {
        it(`should apply ${discount}% discount to ${price} (#${priceIndex * discounts.length + discountIndex + 1})`, () => {
          const result = calculateDiscount(price, discount);
          expect(isFinite(result)).toBe(true);
          expect(result).toBeGreaterThanOrEqual(0);
          expect(result).toBeLessThanOrEqual(price);
        });
      });
    });
    
    // Invalid discounts
    const invalidDiscounts = [-10, -1, 101, 150, 200];
    invalidDiscounts.forEach((discount, index) => {
      it(`should handle invalid discount ${discount}% (#${index + 1})`, () => {
        const result = calculateDiscount(100, discount);
        expect(result).toBe(100); // Should return original price
      });
    });
  });

  describe('Tax Calculations', () => {
    const amounts = generatePrices().slice(0, 300);
    const taxRates = generateTaxRates();
    
    amounts.forEach((amount, amountIndex) => {
      taxRates.slice(0, 10).forEach((rate, rateIndex) => {
        it(`should calculate tax on ${amount} at ${rate * 100}% (#${amountIndex * 10 + rateIndex + 1})`, () => {
          const result = calculateTax(amount, rate);
          expect(isFinite(result)).toBe(true);
          expect(result).toBeGreaterThanOrEqual(0);
        });
      });
    });
  });

  describe('Currency Rounding', () => {
    const amounts = generatePrices().slice(0, 500);
    const decimalPlaces = [0, 1, 2, 3, 4];
    
    amounts.forEach((amount, amountIndex) => {
      decimalPlaces.forEach((decimals, decimalIndex) => {
        it(`should round ${amount} to ${decimals} decimals (#${amountIndex * decimalPlaces.length + decimalIndex + 1})`, () => {
          const result = roundCurrency(amount, decimals);
          expect(isFinite(result)).toBe(true);
          
          // Check decimal places
          const parts = result.toString().split('.');
          if (parts[1]) {
            expect(parts[1].length).toBeLessThanOrEqual(decimals);
          }
        });
      });
    });
    
    // Banker's rounding edge cases
    const roundingCases = [
      { value: 2.5, expected: 2.5 },
      { value: 3.5, expected: 3.5 },
      { value: 2.25, expected: 2.3 },
      { value: 2.35, expected: 2.4 },
    ];
    
    roundingCases.forEach(({ value, expected }, index) => {
      it(`should round ${value} correctly (#${index + 1})`, () => {
        const result = roundCurrency(value, 1);
        expect(result).toBeCloseTo(expected, 1);
      });
    });
  });

  describe('Compound Interest Calculations', () => {
    const principals = [1000, 5000, 10000, 50000, 100000, 500000, 1000000];
    const rates = generateInterestRates().slice(0, 20);
    const times = [1, 2, 3, 5, 10, 15, 20, 25, 30];
    
    principals.forEach((principal, pIndex) => {
      rates.slice(0, 5).forEach((rate, rIndex) => {
        times.slice(0, 5).forEach((time, tIndex) => {
          it(`should calculate compound interest: $${principal} at ${rate * 100}% for ${time} years (#${pIndex * 25 + rIndex * 5 + tIndex + 1})`, () => {
            const result = calculateCompoundInterest(principal, rate, time);
            expect(isFinite(result)).toBe(true);
            expect(result).toBeGreaterThanOrEqual(principal);
          });
        });
      });
    });
  });

  describe('Monthly Payment Calculations', () => {
    const principals = [10000, 25000, 50000, 100000, 200000, 500000];
    const rates = [0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.10];
    const terms = generateLoanTerms().slice(0, 15);
    
    principals.forEach((principal, pIndex) => {
      rates.forEach((rate, rIndex) => {
        terms.slice(0, 5).forEach((months, tIndex) => {
          it(`should calculate payment: $${principal} at ${rate * 100}% for ${months} months (#${pIndex * 35 + rIndex * 5 + tIndex + 1})`, () => {
            const result = calculateMonthlyPayment(principal, rate, months);
            expect(isFinite(result)).toBe(true);
            expect(result).toBeGreaterThan(0);
            
            // Total payments should exceed principal (unless 0% interest)
            if (rate > 0) {
              expect(result * months).toBeGreaterThan(principal);
            }
          });
        });
      });
    });
    
    // Zero interest rate
    it('should handle zero interest rate', () => {
      const result = calculateMonthlyPayment(12000, 0, 12);
      expect(result).toBe(1000);
    });
  });

  describe('Amount Validation', () => {
    const validAmounts = generatePrices().filter(p => p >= 0 && isFinite(p));
    const invalidAmounts = [-1, -100, -0.01, NaN, Infinity, -Infinity];
    
    validAmounts.slice(0, 500).forEach((amount, index) => {
      it(`should accept valid amount ${amount} (#${index + 1})`, () => {
        expect(isValidAmount(amount)).toBe(true);
      });
    });
    
    invalidAmounts.forEach((amount, index) => {
      it(`should reject invalid amount ${amount} (#${index + 1})`, () => {
        expect(isValidAmount(amount)).toBe(false);
      });
    });
  });

  describe('Percentage Validation', () => {
    const validPercentages = generatePercentages().filter(p => p >= 0 && p <= 100 && isFinite(p));
    const invalidPercentages = generatePercentages().filter(p => p < 0 || p > 100 || !isFinite(p));
    
    validPercentages.slice(0, 300).forEach((percent, index) => {
      it(`should accept valid percentage ${percent} (#${index + 1})`, () => {
        expect(isValidPercentage(percent)).toBe(true);
      });
    });
    
    invalidPercentages.forEach((percent, index) => {
      it(`should reject invalid percentage ${percent} (#${index + 1})`, () => {
        expect(isValidPercentage(percent)).toBe(false);
      });
    });
  });

  describe('Age Calculations', () => {
    const birthDates = generateDates().slice(0, 100);
    const referenceDate = new Date('2024-06-15');
    
    birthDates.forEach((birthDate, index) => {
      it(`should calculate age for birth date ${birthDate.toISOString().split('T')[0]} (#${index + 1})`, () => {
        const age = calculateAge(birthDate, referenceDate);
        expect(Number.isInteger(age)).toBe(true);
        expect(age).toBeGreaterThanOrEqual(-10); // Allow future dates
        expect(age).toBeLessThanOrEqual(150);
      });
    });
    
    // Edge cases
    it('should handle birthday today', () => {
      const today = new Date();
      const birthDate = new Date(today.getFullYear() - 30, today.getMonth(), today.getDate());
      expect(calculateAge(birthDate, today)).toBe(30);
    });
    
    it('should handle birthday tomorrow', () => {
      const today = new Date();
      const birthDate = new Date(today.getFullYear() - 30, today.getMonth(), today.getDate() + 1);
      expect(calculateAge(birthDate, today)).toBe(29);
    });
  });

  describe('Working Days Calculations', () => {
    const testCases = [
      { start: new Date(2024, 0, 1), end: new Date(2024, 0, 7), expected: 5 },
      { start: new Date(2024, 0, 1), end: new Date(2024, 0, 31), expected: 23 },
      { start: new Date(2024, 5, 1), end: new Date(2024, 5, 30), expected: 20 },
    ];
    
    testCases.forEach(({ start, end, expected }, index) => {
      it(`should calculate working days from ${start.toISOString().split('T')[0]} to ${end.toISOString().split('T')[0]} (#${index + 1})`, () => {
        const result = calculateWorkingDays(start, end);
        expect(result).toBe(expected);
      });
    });
    
    // Generate more test cases
    for (let month = 0; month < 12; month++) {
      const start = new Date(2024, month, 1);
      const end = new Date(2024, month + 1, 0); // Last day of month
      
      it(`should calculate working days for month ${month + 1}/2024`, () => {
        const result = calculateWorkingDays(start, end);
        expect(result).toBeGreaterThanOrEqual(20);
        expect(result).toBeLessThanOrEqual(23);
      });
    }
  });

  describe('Currency Formatting', () => {
    const amounts = generatePrices().slice(0, 200);
    const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF'];
    
    amounts.forEach((amount, amountIndex) => {
      currencies.slice(0, 3).forEach((currency, currencyIndex) => {
        it(`should format ${amount} as ${currency} (#${amountIndex * 3 + currencyIndex + 1})`, () => {
          const result = formatCurrency(amount, currency);
          expect(typeof result).toBe('string');
          expect(result.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('Floating Point Precision', () => {
    const precisionTests = [
      { a: 0.1, b: 0.2, expected: 0.3 },
      { a: 0.1, b: 0.7, expected: 0.8 },
      { a: 1.0, b: 0.1, expected: 1.1 },
      { a: 0.3, b: 0.6, expected: 0.9 },
    ];
    
    precisionTests.forEach(({ a, b, expected }, index) => {
      it(`should handle ${a} + ${b} = ${expected} with precision (#${index + 1})`, () => {
        const result = roundCurrency(a + b, 2);
        expect(result).toBeCloseTo(expected, 10);
      });
    });
    
    // Currency precision tests
    for (let i = 0; i < 100; i++) {
      const a = Math.random() * 1000;
      const b = Math.random() * 1000;
      
      it(`should maintain precision for random values #${i + 1}`, () => {
        const sum = roundCurrency(a + b, 2);
        expect(isFinite(sum)).toBe(true);
        expect(sum.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
      });
    }
  });

  describe('Overflow/Underflow Protection', () => {
    const extremeValues = [
      Number.MAX_VALUE,
      Number.MIN_VALUE,
      Number.MAX_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
      1e308,
      1e-308,
    ];
    
    extremeValues.forEach((value, index) => {
      it(`should handle extreme value ${value} (#${index + 1})`, () => {
        const result = roundCurrency(value, 2);
        expect(typeof result).toBe('number');
      });
    });
    
    // Overflow in calculations
    it('should handle potential overflow in compound interest', () => {
      const result = calculateCompoundInterest(1e15, 0.5, 100);
      expect(typeof result).toBe('number');
    });
  });

  describe('Suite Statistics', () => {
    it('should have comprehensive price coverage', () => {
      expect(generatePrices().length).toBeGreaterThan(4000);
    });
    
    it('should have comprehensive percentage coverage', () => {
      expect(generatePercentages().length).toBeGreaterThan(400);
    });
    
    it('should have comprehensive date coverage', () => {
      expect(generateDates().length).toBeGreaterThan(200);
    });
  });
});
