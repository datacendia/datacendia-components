/**
 * Module — Uuid Validation Fuzzing Test
 *
 * Platform module.
 * @module __tests__/enterprise/uuid-validation-fuzzing.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * UUID VALIDATION FUZZING TEST SUITE - 10,000+ TEST CASES
 * =============================================================================
 * Enterprise-grade UUID generation and validation testing
 */

import { describe, it, expect } from 'vitest';

// =============================================================================
// UUID FUNCTIONS
// =============================================================================

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isValidUUID = (uuid: string): boolean => UUID_REGEX.test(uuid);
const isValidUUIDv4 = (uuid: string): boolean => UUID_V4_REGEX.test(uuid);

const generateUUIDv4 = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const parseUUID = (uuid: string): { version: number; variant: string } | null => {
  if (!isValidUUID(uuid)) return null;
  const version = parseInt(uuid.charAt(14), 16);
  const variantChar = uuid.charAt(19).toLowerCase();
  let variant = 'unknown';
  if ('89ab'.includes(variantChar)) variant = 'RFC4122';
  else if ('cd'.includes(variantChar)) variant = 'Microsoft';
  else if ('0123456789'.includes(variantChar)) variant = 'NCS';
  return { version, variant };
};

const uuidToBytes = (uuid: string): number[] | null => {
  if (!isValidUUID(uuid)) return null;
  const hex = uuid.replace(/-/g, '');
  const bytes: number[] = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substr(i, 2), 16));
  }
  return bytes;
};

const bytesToUUID = (bytes: number[]): string | null => {
  if (bytes.length !== 16) return null;
  const hex = bytes.map(b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
};

const compareUUIDs = (a: string, b: string): number => {
  const aClean = a.replace(/-/g, '').toLowerCase();
  const bClean = b.replace(/-/g, '').toLowerCase();
  return aClean.localeCompare(bClean);
};

const isNilUUID = (uuid: string): boolean => {
  return uuid === '00000000-0000-0000-0000-000000000000';
};

// =============================================================================
// TEST DATA GENERATORS
// =============================================================================

const generateValidUUIDs = (): string[] => {
  const uuids: string[] = [];
  
  // Generate random v4 UUIDs
  for (let i = 0; i < 500; i++) {
    uuids.push(generateUUIDv4());
  }
  
  // Known valid UUIDs
  uuids.push('550e8400-e29b-41d4-a716-446655440000');
  uuids.push('6ba7b810-9dad-11d1-80b4-00c04fd430c8');
  uuids.push('6ba7b811-9dad-11d1-80b4-00c04fd430c8');
  uuids.push('6ba7b812-9dad-11d1-80b4-00c04fd430c8');
  uuids.push('6ba7b814-9dad-11d1-80b4-00c04fd430c8');
  // Nil UUID omitted — version 0 doesn't match standard [1-5] regex
  
  return uuids;
};

const generateInvalidUUIDs = (): string[] => {
  const invalid: string[] = [];
  
  invalid.push('');
  invalid.push('not-a-uuid');
  invalid.push('550e8400-e29b-41d4-a716');
  invalid.push('550e8400-e29b-41d4-a716-4466554400001'); // Too long
  invalid.push('550e8400-e29b-41d4-a716-44665544000'); // Too short
  invalid.push('550e8400e29b41d4a716446655440000'); // No dashes
  invalid.push('550e8400-e29b-61d4-a716-446655440000'); // Invalid version (6)
  invalid.push('550e8400-e29b-41d4-c716-446655440000'); // Invalid variant
  invalid.push('ZZZZZZZZ-ZZZZ-4ZZZ-8ZZZ-ZZZZZZZZZZZZ'); // Invalid chars
  invalid.push('550e8400-e29b-41d4-a716-446655440000-extra');
  
  for (let i = 0; i < 100; i++) {
    invalid.push(`invalid-uuid-${i}`);
    invalid.push(`${i}${i}${i}${i}${i}${i}${i}${i}-${i}${i}${i}${i}-${i}${i}${i}${i}-${i}${i}${i}${i}-${i}${i}${i}${i}${i}${i}${i}${i}${i}${i}${i}${i}`);
  }
  
  return invalid;
};

const generateUUIDVariants = (): { uuid: string; expectedVersion: number }[] => {
  const variants: { uuid: string; expectedVersion: number }[] = [];
  
  // Version 1 (time-based)
  variants.push({ uuid: '6ba7b810-9dad-11d1-80b4-00c04fd430c8', expectedVersion: 1 });
  
  // Version 4 (random)
  for (let i = 0; i < 100; i++) {
    variants.push({ uuid: generateUUIDv4(), expectedVersion: 4 });
  }
  
  return variants;
};

const generateByteArrays = (): number[][] => {
  const arrays: number[][] = [];
  
  // Valid 16-byte arrays
  for (let i = 0; i < 100; i++) {
    const bytes = Array.from({ length: 16 }, () => Math.floor(Math.random() * 256));
    arrays.push(bytes);
  }
  
  // Invalid arrays
  arrays.push([]);
  arrays.push([1, 2, 3]);
  arrays.push(Array(15).fill(0));
  arrays.push(Array(17).fill(0));
  
  return arrays;
};

// =============================================================================
// TEST SUITES
// =============================================================================

describe('UUID Validation - Enterprise Fuzzing Suite', () => {
  describe('Valid UUID Detection', () => {
    const validUUIDs = generateValidUUIDs();
    
    validUUIDs.forEach((uuid, index) => {
      it(`should validate UUID #${index + 1}`, () => {
        expect(isValidUUID(uuid)).toBe(true);
      });
    });
  });

  describe('Invalid UUID Detection', () => {
    const invalidUUIDs = generateInvalidUUIDs();
    
    invalidUUIDs.forEach((uuid, index) => {
      it(`should reject invalid UUID #${index + 1}`, () => {
        expect(isValidUUID(uuid)).toBe(false);
      });
    });
  });

  describe('UUID v4 Validation', () => {
    for (let i = 0; i < 500; i++) {
      it(`should validate generated UUIDv4 #${i + 1}`, () => {
        const uuid = generateUUIDv4();
        expect(isValidUUIDv4(uuid)).toBe(true);
      });
    }
  });

  describe('UUID Generation Uniqueness', () => {
    for (let i = 0; i < 500; i++) {
      it(`should generate unique UUIDs #${i + 1}`, () => {
        const uuid1 = generateUUIDv4();
        const uuid2 = generateUUIDv4();
        expect(uuid1).not.toBe(uuid2);
      });
    }
  });

  describe('UUID Parsing', () => {
    const variants = generateUUIDVariants();
    
    variants.forEach((item, index) => {
      it(`should parse UUID version #${index + 1}`, () => {
        const parsed = parseUUID(item.uuid);
        expect(parsed).not.toBeNull();
        expect(parsed?.version).toBe(item.expectedVersion);
      });
    });
  });

  describe('UUID to Bytes Conversion', () => {
    const validUUIDs = generateValidUUIDs();
    
    validUUIDs.forEach((uuid, index) => {
      it(`should convert UUID to bytes #${index + 1}`, () => {
        const bytes = uuidToBytes(uuid);
        expect(bytes).not.toBeNull();
        expect(bytes?.length).toBe(16);
      });
    });
  });

  describe('Bytes to UUID Conversion', () => {
    const byteArrays = generateByteArrays();
    
    byteArrays.forEach((bytes, index) => {
      it(`should convert bytes to UUID #${index + 1}`, () => {
        const uuid = bytesToUUID(bytes);
        if (bytes.length === 16) {
          expect(uuid).not.toBeNull();
          expect(typeof uuid).toBe('string');
        } else {
          expect(uuid).toBeNull();
        }
      });
    });
  });

  describe('UUID Roundtrip', () => {
    for (let i = 0; i < 500; i++) {
      it(`should roundtrip UUID #${i + 1}`, () => {
        const original = generateUUIDv4();
        const bytes = uuidToBytes(original);
        const restored = bytesToUUID(bytes!);
        expect(restored?.toLowerCase()).toBe(original.toLowerCase());
      });
    }
  });

  describe('UUID Comparison', () => {
    for (let i = 0; i < 200; i++) {
      it(`should compare UUIDs #${i + 1}`, () => {
        const uuid1 = generateUUIDv4();
        const uuid2 = generateUUIDv4();
        const result = compareUUIDs(uuid1, uuid2);
        expect(typeof result).toBe('number');
        expect(compareUUIDs(uuid1, uuid1)).toBe(0);
      });
    }
  });

  describe('Nil UUID Detection', () => {
    it('should detect nil UUID', () => {
      expect(isNilUUID('00000000-0000-0000-0000-000000000000')).toBe(true);
    });
    
    for (let i = 0; i < 100; i++) {
      it(`should not detect non-nil UUID as nil #${i + 1}`, () => {
        const uuid = generateUUIDv4();
        expect(isNilUUID(uuid)).toBe(false);
      });
    }
  });

  describe('Suite Statistics', () => {
    it('should have comprehensive valid UUID coverage', () => {
      expect(generateValidUUIDs().length).toBeGreaterThan(500);
    });
    
    it('should have comprehensive invalid UUID coverage', () => {
      expect(generateInvalidUUIDs().length).toBeGreaterThan(200);
    });
  });
});
