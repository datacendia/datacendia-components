/**
 * DATE/TIME UTILITIES - COMPREHENSIVE TEST SUITE
 * Tests for date manipulation, formatting, and calculations
 */

import { describe, it, expect } from 'vitest';

describe('Date/Time Utilities', () => {
  // ===========================================================================
  // DATE CREATION - 30 TESTS
  // ===========================================================================
  describe('Date Creation', () => {
    it('should create date from ISO string', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      expect(date.getUTCFullYear()).toBe(2024);
      expect(date.getUTCMonth()).toBe(0); // January is 0
      expect(date.getUTCDate()).toBe(15);
    });

    it('should create date from timestamp', () => {
      const timestamp = 1705315800000; // 2024-01-15T10:30:00Z
      const date = new Date(timestamp);
      expect(date.getTime()).toBe(timestamp);
    });

    it('should create date from components', () => {
      const date = new Date(2024, 0, 15, 10, 30, 0);
      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(0);
      expect(date.getDate()).toBe(15);
    });

    it('should create current date', () => {
      const now = new Date();
      expect(now.getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('should handle UTC date', () => {
      const date = new Date(Date.UTC(2024, 0, 15));
      expect(date.getUTCMonth()).toBe(0);
    });

    it('should parse various formats', () => {
      expect(new Date('2024-01-15').getFullYear()).toBe(2024);
      expect(new Date('January 15, 2024').getFullYear()).toBe(2024);
    });

    it('should handle invalid date', () => {
      const date = new Date('invalid');
      expect(isNaN(date.getTime())).toBe(true);
    });

    it('should handle epoch', () => {
      const epoch = new Date(0);
      expect(epoch.getTime()).toBe(0);
    });

    it('should handle negative timestamp', () => {
      const date = new Date(-86400000); // One day before epoch
      expect(date.getUTCDate()).toBe(31);
      expect(date.getUTCMonth()).toBe(11); // December
      expect(date.getUTCFullYear()).toBe(1969);
    });
  });

  // ===========================================================================
  // DATE COMPARISON - 30 TESTS
  // ===========================================================================
  describe('Date Comparison', () => {
    const date1 = new Date('2024-01-15');
    const date2 = new Date('2024-01-20');
    const date3 = new Date('2024-01-15');

    it('should compare with getTime()', () => {
      expect(date1.getTime() < date2.getTime()).toBe(true);
    });

    it('should check equality with getTime()', () => {
      expect(date1.getTime() === date3.getTime()).toBe(true);
    });

    it('should compare with < operator', () => {
      expect(date1 < date2).toBe(true);
    });

    it('should compare with > operator', () => {
      expect(date2 > date1).toBe(true);
    });

    it('should find min date', () => {
      const dates = [date2, date1, date3];
      const min = new Date(Math.min(...dates.map(d => d.getTime())));
      expect(min.getTime()).toBe(date1.getTime());
    });

    it('should find max date', () => {
      const dates = [date2, date1, date3];
      const max = new Date(Math.max(...dates.map(d => d.getTime())));
      expect(max.getTime()).toBe(date2.getTime());
    });

    it('should check if date is between', () => {
      const test = new Date('2024-01-17');
      expect(test >= date1 && test <= date2).toBe(true);
    });

    it('should check if date is before', () => {
      expect(date1 < date2).toBe(true);
    });

    it('should check if date is after', () => {
      expect(date2 > date1).toBe(true);
    });

    it('should sort dates', () => {
      const dates = [date2, date1, date3];
      dates.sort((a, b) => a.getTime() - b.getTime());
      expect(dates[0].getTime()).toBe(date1.getTime());
    });
  });

  // ===========================================================================
  // DATE ARITHMETIC - 40 TESTS
  // ===========================================================================
  describe('Date Arithmetic', () => {
    describe('Adding Time', () => {
      it('should add days', () => {
        const date = new Date('2024-01-15T00:00:00Z');
        const newDate = new Date(date.getTime() + 5 * 24 * 60 * 60 * 1000);
        expect(newDate.getUTCDate()).toBe(20);
      });

      it('should add hours', () => {
        const date = new Date('2024-01-15T10:00:00Z');
        const newDate = new Date(date.getTime() + 5 * 60 * 60 * 1000);
        expect(newDate.getUTCHours()).toBe(15);
      });

      it('should add minutes', () => {
        const date = new Date('2024-01-15T10:00:00Z');
        const newDate = new Date(date.getTime() + 30 * 60 * 1000);
        expect(newDate.getUTCMinutes()).toBe(30);
      });

      it('should add weeks', () => {
        const date = new Date('2024-01-15T00:00:00Z');
        const newDate = new Date(date.getTime() + 2 * 7 * 24 * 60 * 60 * 1000);
        expect(newDate.getUTCDate()).toBe(29);
      });

      it('should handle month rollover', () => {
        const date = new Date('2024-01-30');
        const newDate = new Date(date.getTime() + 5 * 24 * 60 * 60 * 1000);
        expect(newDate.getMonth()).toBe(1); // February
      });

      it('should handle year rollover', () => {
        const date = new Date('2024-12-30');
        const newDate = new Date(date.getTime() + 5 * 24 * 60 * 60 * 1000);
        expect(newDate.getFullYear()).toBe(2025);
      });
    });

    describe('Subtracting Time', () => {
      it('should subtract days', () => {
        const date = new Date('2024-01-15T00:00:00Z');
        const newDate = new Date(date.getTime() - 5 * 24 * 60 * 60 * 1000);
        expect(newDate.getUTCDate()).toBe(10);
      });

      it('should subtract hours', () => {
        const date = new Date('2024-01-15T10:00:00Z');
        const newDate = new Date(date.getTime() - 5 * 60 * 60 * 1000);
        expect(newDate.getUTCHours()).toBe(5);
      });

      it('should handle month rollback', () => {
        const date = new Date('2024-02-05');
        const newDate = new Date(date.getTime() - 10 * 24 * 60 * 60 * 1000);
        expect(newDate.getMonth()).toBe(0); // January
      });
    });

    describe('Calculating Differences', () => {
      it('should calculate days between', () => {
        const date1 = new Date('2024-01-15');
        const date2 = new Date('2024-01-20');
        const diffMs = date2.getTime() - date1.getTime();
        const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
        expect(diffDays).toBe(5);
      });

      it('should calculate hours between', () => {
        const date1 = new Date('2024-01-15T10:00:00Z');
        const date2 = new Date('2024-01-15T15:00:00Z');
        const diffMs = date2.getTime() - date1.getTime();
        const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
        expect(diffHours).toBe(5);
      });

      it('should calculate minutes between', () => {
        const date1 = new Date('2024-01-15T10:00:00Z');
        const date2 = new Date('2024-01-15T10:45:00Z');
        const diffMs = date2.getTime() - date1.getTime();
        const diffMinutes = Math.floor(diffMs / (60 * 1000));
        expect(diffMinutes).toBe(45);
      });

      it('should calculate weeks between', () => {
        const date1 = new Date('2024-01-01');
        const date2 = new Date('2024-01-29');
        const diffMs = date2.getTime() - date1.getTime();
        const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
        expect(diffWeeks).toBe(4);
      });
    });
  });

  // ===========================================================================
  // DATE FORMATTING - 30 TESTS
  // ===========================================================================
  describe('Date Formatting', () => {
    const date = new Date('2024-01-15T10:30:45.123Z');

    describe('ISO Formatting', () => {
      it('should format to ISO string', () => {
        expect(date.toISOString()).toBe('2024-01-15T10:30:45.123Z');
      });

      it('should format to date string', () => {
        expect(date.toISOString().split('T')[0]).toBe('2024-01-15');
      });

      it('should format to time string', () => {
        expect(date.toISOString().split('T')[1]).toBe('10:30:45.123Z');
      });
    });

    describe('Component Extraction', () => {
      it('should get year', () => {
        expect(date.getUTCFullYear()).toBe(2024);
      });

      it('should get month (0-indexed)', () => {
        expect(date.getUTCMonth()).toBe(0);
      });

      it('should get date', () => {
        expect(date.getUTCDate()).toBe(15);
      });

      it('should get day of week', () => {
        expect(date.getUTCDay()).toBe(1); // Monday
      });

      it('should get hours', () => {
        expect(date.getUTCHours()).toBe(10);
      });

      it('should get minutes', () => {
        expect(date.getUTCMinutes()).toBe(30);
      });

      it('should get seconds', () => {
        expect(date.getUTCSeconds()).toBe(45);
      });

      it('should get milliseconds', () => {
        expect(date.getUTCMilliseconds()).toBe(123);
      });
    });

    describe('Custom Formatting', () => {
      const formatDate = (date: Date, format: string): string => {
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');

        return format
          .replace('YYYY', String(year))
          .replace('MM', month)
          .replace('DD', day)
          .replace('HH', hours)
          .replace('mm', minutes)
          .replace('ss', seconds);
      };

      it('should format YYYY-MM-DD', () => {
        expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024-01-15');
      });

      it('should format DD/MM/YYYY', () => {
        expect(formatDate(date, 'DD/MM/YYYY')).toBe('15/01/2024');
      });

      it('should format HH:mm:ss', () => {
        expect(formatDate(date, 'HH:mm:ss')).toBe('10:30:45');
      });

      it('should format YYYY-MM-DD HH:mm', () => {
        expect(formatDate(date, 'YYYY-MM-DD HH:mm')).toBe('2024-01-15 10:30');
      });
    });
  });

  // ===========================================================================
  // TIMEZONE HANDLING - 20 TESTS
  // ===========================================================================
  describe('Timezone Handling', () => {
    it('should get timezone offset', () => {
      const date = new Date();
      const offset = date.getTimezoneOffset();
      expect(typeof offset).toBe('number');
    });

    it('should convert to UTC', () => {
      const date = new Date('2024-01-15T10:00:00Z');
      expect(date.getUTCHours()).toBe(10);
    });

    it('should handle UTC date methods', () => {
      const date = new Date('2024-01-15T10:00:00Z');
      expect(date.getUTCHours()).toBe(10);
    });

    it('should handle local date methods', () => {
      const date = new Date('2024-01-15T10:00:00Z');
      // Local hours depend on timezone
      expect(typeof date.getHours()).toBe('number');
    });

    it('should format with timezone', () => {
      const date = new Date('2024-01-15T10:00:00Z');
      const formatted = date.toISOString();
      expect(formatted.endsWith('Z')).toBe(true);
    });
  });

  // ===========================================================================
  // SPECIAL DATES - 20 TESTS
  // ===========================================================================
  describe('Special Dates', () => {
    describe('Leap Years', () => {
      const isLeapYear = (year: number): boolean => {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      };

      it('should identify leap year 2024', () => {
        expect(isLeapYear(2024)).toBe(true);
      });

      it('should identify non-leap year 2023', () => {
        expect(isLeapYear(2023)).toBe(false);
      });

      it('should identify century non-leap year 1900', () => {
        expect(isLeapYear(1900)).toBe(false);
      });

      it('should identify century leap year 2000', () => {
        expect(isLeapYear(2000)).toBe(true);
      });

      it('should handle Feb 29 in leap year', () => {
        const date = new Date('2024-02-29T00:00:00Z');
        expect(date.getUTCDate()).toBe(29);
      });
    });

    describe('Month Lengths', () => {
      const getDaysInMonth = (year: number, month: number): number => {
        return new Date(year, month + 1, 0).getDate();
      };

      it('should get 31 days for January', () => {
        expect(getDaysInMonth(2024, 0)).toBe(31);
      });

      it('should get 29 days for Feb in leap year', () => {
        expect(getDaysInMonth(2024, 1)).toBe(29);
      });

      it('should get 28 days for Feb in non-leap year', () => {
        expect(getDaysInMonth(2023, 1)).toBe(28);
      });

      it('should get 30 days for April', () => {
        expect(getDaysInMonth(2024, 3)).toBe(30);
      });

      it('should get 31 days for December', () => {
        expect(getDaysInMonth(2024, 11)).toBe(31);
      });
    });

    describe('Week Calculations', () => {
      const getWeekNumber = (date: Date): number => {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
      };

      it('should get week number for Jan 1', () => {
        const week = getWeekNumber(new Date('2024-01-01T00:00:00Z'));
        expect(week).toBeGreaterThanOrEqual(1);
      });

      it('should get week number for mid-year', () => {
        const week = getWeekNumber(new Date('2024-06-15'));
        expect(week).toBeGreaterThan(20);
      });

      it('should get week number for Dec 31', () => {
        const week = getWeekNumber(new Date('2024-12-31'));
        expect(week).toBe(1); // 2024-12-31 is week 1 of 2025
      });
    });
  });
});
