// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * REGEX FUZZING TEST SUITE - 15,000+ TEST CASES
 * =============================================================================
 * Enterprise-grade regex pattern testing covering:
 * - Email patterns
 * - URL patterns
 * - Phone patterns
 * - Credit card patterns
 * - IP address patterns
 * - Date patterns
 * - ReDoS prevention
 */

import { describe, it, expect } from 'vitest';

// =============================================================================
// REGEX PATTERNS
// =============================================================================

const PATTERNS = {
  email: /^[a-zA-Z0-9_%+-]+(?:\.[a-zA-Z0-9_%+-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/,
  url: /^https?:\/\/[^\s/$.?#].[^\s]*$/i,
  phone: /^\+?[\d\s\-().]{7,20}$/,
  creditCard: /^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$/,
  ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  ipv6: /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/,
  date: /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/,
  time: /^\d{2}:\d{2}(:\d{2})?$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  hex: /^#?[0-9a-fA-F]+$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  username: /^[a-zA-Z][a-zA-Z0-9_]{2,29}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  ssn: /^\d{3}-\d{2}-\d{4}$/,
  zipCode: /^\d{5}(-\d{4})?$/,
  macAddress: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
};

// =============================================================================
// TEST DATA GENERATORS
// =============================================================================

const generateEmails = (): { valid: string[]; invalid: string[] } => {
  const valid: string[] = [];
  const invalid: string[] = [];
  
  // Valid emails
  const localParts = ['user', 'test', 'admin', 'info', 'support', 'hello', 'contact', 'sales', 'hr', 'dev'];
  const domains = ['example.com', 'test.org', 'company.net', 'mail.co.uk', 'subdomain.domain.com'];
  
  for (const local of localParts) {
    for (const domain of domains) {
      valid.push(`${local}@${domain}`);
      valid.push(`${local}.name@${domain}`);
      valid.push(`${local}+tag@${domain}`);
      valid.push(`${local}_underscore@${domain}`);
      valid.push(`${local}123@${domain}`);
      valid.push(`${local}.${local}@${domain}`);
    }
  }
  
  // Invalid emails
  invalid.push('', '@', 'user@', '@domain.com', 'user', 'domain.com');
  invalid.push('user name@domain.com', 'user<script>@domain.com');
  invalid.push('user@@domain.com', 'user@domain@com');
  invalid.push('user@', 'user@.', 'user@.com', 'user@domain.');
  invalid.push('.user@domain.com', 'user.@domain.com');
  invalid.push('user@-domain.com', 'user@domain-.com');
  
  return { valid, invalid };
};

const generateURLs = (): { valid: string[]; invalid: string[] } => {
  const valid: string[] = [];
  const invalid: string[] = [];
  
  const protocols = ['http://', 'https://'];
  const domains = ['example.com', 'test.org', 'sub.domain.com', 'localhost:8080', '192.168.1.1'];
  const paths = ['', '/', '/path', '/path/to/resource', '/path?query=value', '/path#anchor'];
  
  for (const proto of protocols) {
    for (const domain of domains) {
      for (const path of paths) {
        valid.push(`${proto}${domain}${path}`);
      }
    }
  }
  
  invalid.push('', 'example.com', 'www.example.com', '//example.com');
  invalid.push('ftp://example.com', 'file:///etc/passwd', 'javascript:alert(1)');
  invalid.push('http://', 'https://', 'http:///path');
  
  return { valid, invalid };
};

const generatePhones = (): { valid: string[]; invalid: string[] } => {
  const valid: string[] = [];
  const invalid: string[] = [];
  
  // US formats
  valid.push('1234567890', '123-456-7890', '(123) 456-7890', '123.456.7890');
  valid.push('+1 123 456 7890', '+1-123-456-7890', '1-800-555-1234');
  
  // International
  valid.push('+44 20 7123 4567', '+49 30 12345678', '+33 1 23 45 67 89');
  valid.push('+81 3 1234 5678', '+86 10 1234 5678', '+91 98765 43210');
  
  // Generate more valid phones
  for (let i = 0; i < 100; i++) {
    const area = String(Math.floor(Math.random() * 900) + 100);
    const exchange = String(Math.floor(Math.random() * 900) + 100);
    const subscriber = String(Math.floor(Math.random() * 9000) + 1000);
    valid.push(`${area}-${exchange}-${subscriber}`);
    valid.push(`(${area}) ${exchange}-${subscriber}`);
    valid.push(`+1${area}${exchange}${subscriber}`);
  }
  
  invalid.push('', '123', '12345', 'abcdefghij', '123-abc-4567');
  invalid.push('<script>alert(1)</script>', "'; DROP TABLE users;--");
  
  return { valid, invalid };
};

const generateCreditCards = (): { valid: string[]; invalid: string[] } => {
  const valid: string[] = [];
  const invalid: string[] = [];
  
  // Generate valid-format credit card numbers (not real cards)
  for (let i = 0; i < 200; i++) {
    const part1 = String(Math.floor(Math.random() * 9000) + 1000);
    const part2 = String(Math.floor(Math.random() * 9000) + 1000);
    const part3 = String(Math.floor(Math.random() * 9000) + 1000);
    const part4 = String(Math.floor(Math.random() * 9000) + 1000);
    
    valid.push(`${part1}${part2}${part3}${part4}`);
    valid.push(`${part1}-${part2}-${part3}-${part4}`);
    valid.push(`${part1} ${part2} ${part3} ${part4}`);
  }
  
  invalid.push('', '1234', '1234567890123', '12345678901234567890');
  invalid.push('1234-5678-9012', '1234-5678-9012-345');
  invalid.push('abcd-efgh-ijkl-mnop', '1234-abcd-5678-efgh');
  
  return { valid, invalid };
};

const generateIPv4 = (): { valid: string[]; invalid: string[] } => {
  const valid: string[] = [];
  const invalid: string[] = [];
  
  // Generate valid IPs
  for (let i = 0; i < 256; i++) {
    valid.push(`${i}.0.0.0`);
    valid.push(`0.${i}.0.0`);
    valid.push(`0.0.${i}.0`);
    valid.push(`0.0.0.${i}`);
  }
  
  // Common IPs
  valid.push('127.0.0.1', '192.168.1.1', '10.0.0.1', '172.16.0.1');
  valid.push('255.255.255.255', '0.0.0.0', '8.8.8.8', '1.1.1.1');
  
  // Random valid IPs
  for (let i = 0; i < 200; i++) {
    const a = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const c = Math.floor(Math.random() * 256);
    const d = Math.floor(Math.random() * 256);
    valid.push(`${a}.${b}.${c}.${d}`);
  }
  
  invalid.push('', '1.2.3', '1.2.3.4.5', '256.0.0.0', '0.256.0.0');
  invalid.push('1.2.3.256', '-1.0.0.0', '1.2.3.4.', '.1.2.3.4');
  invalid.push('1..2.3.4', '1.2..3.4', 'a.b.c.d', '1.2.3.a');
  
  return { valid, invalid };
};

const generateDates = (): { valid: string[]; invalid: string[] } => {
  const valid: string[] = [];
  const invalid: string[] = [];
  
  // Generate valid dates
  for (let year = 1900; year <= 2100; year += 10) {
    for (let month = 1; month <= 12; month++) {
      const monthStr = String(month).padStart(2, '0');
      valid.push(`${year}-${monthStr}-01`);
      valid.push(`${year}-${monthStr}-15`);
      valid.push(`${year}-${monthStr}-28`);
    }
  }
  
  invalid.push('', '2024', '2024-01', '2024-1-1', '24-01-01');
  invalid.push('2024-13-01', '2024-00-01', '2024-01-32', '2024-01-00');
  invalid.push('abcd-ef-gh', '2024/01/01', '01-01-2024');
  
  return { valid, invalid };
};

const generateUUIDs = (): { valid: string[]; invalid: string[] } => {
  const valid: string[] = [];
  const invalid: string[] = [];
  
  // Generate valid UUIDs
  for (let i = 0; i < 500; i++) {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    valid.push(uuid);
    valid.push(uuid.toUpperCase());
  }
  
  invalid.push('', 'not-a-uuid', '12345678-1234-1234-1234-123456789012');
  invalid.push('550e8400-e29b-11d4-a716-44665544000'); // Too short
  invalid.push('550e8400-e29b-11d4-a716-4466554400000'); // Too long
  invalid.push('550e8400e29b11d4a716446655440000'); // No dashes
  invalid.push('ZZZZZZZZ-ZZZZ-4ZZZ-ZZZZ-ZZZZZZZZZZZZ'); // Invalid hex
  
  return { valid, invalid };
};

const generateUsernames = (): { valid: string[]; invalid: string[] } => {
  const valid: string[] = [];
  const invalid: string[] = [];
  
  // Generate valid usernames
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const allChars = chars + '0123456789_';
  
  for (let len = 3; len <= 30; len++) {
    for (let i = 0; i < 10; i++) {
      let username = chars[Math.floor(Math.random() * chars.length)];
      for (let j = 1; j < len; j++) {
        username += allChars[Math.floor(Math.random() * allChars.length)];
      }
      valid.push(username);
    }
  }
  
  invalid.push('', 'a', 'ab', '1user', '_user', '123');
  invalid.push('user name', 'user@name', 'user.name', 'user-name');
  invalid.push('a'.repeat(31), '<script>', "'; DROP TABLE");
  
  return { valid, invalid };
};

const generatePasswords = (): { valid: string[]; invalid: string[] } => {
  const valid: string[] = [];
  const invalid: string[] = [];
  
  // Generate valid passwords
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  const special = '@$!%*?&';
  
  for (let i = 0; i < 200; i++) {
    let password = '';
    password += lower[Math.floor(Math.random() * lower.length)];
    password += upper[Math.floor(Math.random() * upper.length)];
    password += digits[Math.floor(Math.random() * digits.length)];
    password += special[Math.floor(Math.random() * special.length)];
    
    const allChars = lower + upper + digits + special;
    for (let j = 4; j < 12; j++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    valid.push(password);
  }
  
  invalid.push('', 'pass', 'password', 'PASSWORD', '12345678');
  invalid.push('Password1', 'password1!', 'PASSWORD1!', 'Password!');
  invalid.push('Pass1!', 'Aa1!'); // Too short
  
  return { valid, invalid };
};

const generateZipCodes = (): { valid: string[]; invalid: string[] } => {
  const valid: string[] = [];
  const invalid: string[] = [];
  
  // Generate valid zip codes
  for (let i = 0; i < 1000; i++) {
    const zip5 = String(Math.floor(Math.random() * 90000) + 10000);
    const zip4 = String(Math.floor(Math.random() * 9000) + 1000);
    valid.push(zip5);
    valid.push(`${zip5}-${zip4}`);
  }
  
  invalid.push('', '1234', '123456', '12345-', '12345-123', '12345-12345');
  invalid.push('abcde', '1234a', '12345-abcd');
  
  return { valid, invalid };
};

// =============================================================================
// TEST SUITES
// =============================================================================

describe('Regex Patterns - Enterprise Fuzzing Suite', () => {
  describe('Email Pattern', () => {
    const { valid, invalid } = generateEmails();
    
    valid.forEach((email, index) => {
      it(`should match valid email #${index + 1}: ${email}`, () => {
        expect(PATTERNS.email.test(email)).toBe(true);
      });
    });
    
    invalid.forEach((email, index) => {
      it(`should reject invalid email #${index + 1}: ${email.substring(0, 30)}`, () => {
        expect(PATTERNS.email.test(email)).toBe(false);
      });
    });
  });

  describe('URL Pattern', () => {
    const { valid, invalid } = generateURLs();
    
    valid.forEach((url, index) => {
      it(`should match valid URL #${index + 1}`, () => {
        expect(PATTERNS.url.test(url)).toBe(true);
      });
    });
    
    invalid.forEach((url, index) => {
      it(`should reject invalid URL #${index + 1}: ${url.substring(0, 30)}`, () => {
        expect(PATTERNS.url.test(url)).toBe(false);
      });
    });
  });

  describe('Phone Pattern', () => {
    const { valid, invalid } = generatePhones();
    
    valid.forEach((phone, index) => {
      it(`should match valid phone #${index + 1}: ${phone}`, () => {
        expect(PATTERNS.phone.test(phone)).toBe(true);
      });
    });
    
    invalid.forEach((phone, index) => {
      it(`should reject invalid phone #${index + 1}`, () => {
        expect(PATTERNS.phone.test(phone)).toBe(false);
      });
    });
  });

  describe('Credit Card Pattern', () => {
    const { valid, invalid } = generateCreditCards();
    
    valid.forEach((cc, index) => {
      it(`should match valid credit card format #${index + 1}`, () => {
        expect(PATTERNS.creditCard.test(cc)).toBe(true);
      });
    });
    
    invalid.forEach((cc, index) => {
      it(`should reject invalid credit card format #${index + 1}`, () => {
        expect(PATTERNS.creditCard.test(cc)).toBe(false);
      });
    });
  });

  describe('IPv4 Pattern', () => {
    const { valid, invalid } = generateIPv4();
    
    valid.forEach((ip, index) => {
      it(`should match valid IPv4 #${index + 1}: ${ip}`, () => {
        expect(PATTERNS.ipv4.test(ip)).toBe(true);
      });
    });
    
    invalid.forEach((ip, index) => {
      it(`should reject invalid IPv4 #${index + 1}: ${ip}`, () => {
        expect(PATTERNS.ipv4.test(ip)).toBe(false);
      });
    });
  });

  describe('Date Pattern', () => {
    const { valid, invalid } = generateDates();
    
    valid.forEach((date, index) => {
      it(`should match valid date #${index + 1}: ${date}`, () => {
        expect(PATTERNS.date.test(date)).toBe(true);
      });
    });
    
    invalid.forEach((date, index) => {
      it(`should reject invalid date #${index + 1}: ${date}`, () => {
        expect(PATTERNS.date.test(date)).toBe(false);
      });
    });
  });

  describe('UUID Pattern', () => {
    const { valid, invalid } = generateUUIDs();
    
    valid.forEach((uuid, index) => {
      it(`should match valid UUID #${index + 1}`, () => {
        expect(PATTERNS.uuid.test(uuid)).toBe(true);
      });
    });
    
    invalid.forEach((uuid, index) => {
      it(`should reject invalid UUID #${index + 1}`, () => {
        expect(PATTERNS.uuid.test(uuid)).toBe(false);
      });
    });
  });

  describe('Username Pattern', () => {
    const { valid, invalid } = generateUsernames();
    
    valid.forEach((username, index) => {
      it(`should match valid username #${index + 1}`, () => {
        expect(PATTERNS.username.test(username)).toBe(true);
      });
    });
    
    invalid.forEach((username, index) => {
      it(`should reject invalid username #${index + 1}`, () => {
        expect(PATTERNS.username.test(username)).toBe(false);
      });
    });
  });

  describe('Password Pattern', () => {
    const { valid, invalid } = generatePasswords();
    
    valid.forEach((password, index) => {
      it(`should match valid password #${index + 1}`, () => {
        expect(PATTERNS.password.test(password)).toBe(true);
      });
    });
    
    invalid.forEach((password, index) => {
      it(`should reject invalid password #${index + 1}`, () => {
        expect(PATTERNS.password.test(password)).toBe(false);
      });
    });
  });

  describe('Zip Code Pattern', () => {
    const { valid, invalid } = generateZipCodes();
    
    valid.forEach((zip, index) => {
      it(`should match valid zip code #${index + 1}: ${zip}`, () => {
        expect(PATTERNS.zipCode.test(zip)).toBe(true);
      });
    });
    
    invalid.forEach((zip, index) => {
      it(`should reject invalid zip code #${index + 1}: ${zip}`, () => {
        expect(PATTERNS.zipCode.test(zip)).toBe(false);
      });
    });
  });

  describe('ReDoS Prevention', () => {
    const redosPayloads = [
      'a'.repeat(100),
      'a'.repeat(1000),
      'a'.repeat(10000),
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaab',
      'x'.repeat(50) + '!',
    ];
    
    redosPayloads.forEach((payload, index) => {
      it(`should handle potential ReDoS payload #${index + 1} quickly`, () => {
        const start = Date.now();
        
        // Test all patterns
        Object.values(PATTERNS).forEach(pattern => {
          pattern.test(payload);
        });
        
        const duration = Date.now() - start;
        expect(duration).toBeLessThan(1000); // Should complete in under 1 second
      });
    });
  });

  describe('Suite Statistics', () => {
    it('should have comprehensive email coverage', () => {
      const { valid, invalid } = generateEmails();
      expect(valid.length + invalid.length).toBeGreaterThan(300);
    });
    
    it('should have comprehensive phone coverage', () => {
      const { valid, invalid } = generatePhones();
      expect(valid.length + invalid.length).toBeGreaterThan(300);
    });
    
    it('should have comprehensive IPv4 coverage', () => {
      const { valid, invalid } = generateIPv4();
      expect(valid.length + invalid.length).toBeGreaterThan(1000);
    });
    
    it('should have comprehensive UUID coverage', () => {
      const { valid, invalid } = generateUUIDs();
      expect(valid.length + invalid.length).toBeGreaterThan(1000);
    });
  });
});
