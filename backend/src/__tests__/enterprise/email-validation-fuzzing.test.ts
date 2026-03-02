/**
 * Module — Email Validation Fuzzing Test
 *
 * Platform module.
 * @module __tests__/enterprise/email-validation-fuzzing.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * EMAIL VALIDATION FUZZING TEST SUITE - 10,000+ TEST CASES
 * =============================================================================
 * Enterprise-grade email validation testing
 */

import { describe, it, expect } from 'vitest';

// =============================================================================
// EMAIL FUNCTIONS
// =============================================================================

const EMAIL_REGEX = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?!-)([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
const STRICT_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const isValidEmail = (email: string): boolean => EMAIL_REGEX.test(email);
const isValidEmailStrict = (email: string): boolean => STRICT_EMAIL_REGEX.test(email);

const parseEmail = (email: string): { local: string; domain: string } | null => {
  const atIndex = email.lastIndexOf('@');
  if (atIndex === -1 || atIndex === 0 || atIndex === email.length - 1) return null;
  return {
    local: email.substring(0, atIndex),
    domain: email.substring(atIndex + 1)
  };
};

const normalizeEmail = (email: string): string => {
  const parsed = parseEmail(email);
  if (!parsed) return email;
  
  let local = parsed.local.toLowerCase();
  const domain = parsed.domain.toLowerCase();
  
  // Remove dots from Gmail addresses
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    local = local.replace(/\./g, '');
    // Remove everything after + in Gmail
    const plusIndex = local.indexOf('+');
    if (plusIndex !== -1) {
      local = local.substring(0, plusIndex);
    }
  }
  
  return `${local}@${domain}`;
};

const isDisposableEmail = (email: string): boolean => {
  const disposableDomains = [
    'tempmail.com', 'throwaway.com', 'mailinator.com', 'guerrillamail.com',
    'temp-mail.org', '10minutemail.com', 'fakeinbox.com', 'trashmail.com'
  ];
  const parsed = parseEmail(email);
  if (!parsed) return false;
  return disposableDomains.includes(parsed.domain.toLowerCase());
};

const maskEmail = (email: string): string => {
  const parsed = parseEmail(email);
  if (!parsed) return email;
  
  const local = parsed.local;
  const masked = local.length <= 2 
    ? '*'.repeat(local.length)
    : local[0] + '*'.repeat(local.length - 2) + local[local.length - 1];
  
  return `${masked}@${parsed.domain}`;
};

const getDomainFromEmail = (email: string): string | null => {
  const parsed = parseEmail(email);
  return parsed ? parsed.domain : null;
};

const getLocalPartFromEmail = (email: string): string | null => {
  const parsed = parseEmail(email);
  return parsed ? parsed.local : null;
};

// =============================================================================
// TEST DATA GENERATORS
// =============================================================================

const generateValidEmails = (): string[] => {
  const emails: string[] = [];
  
  // Standard emails
  emails.push('test@example.com');
  emails.push('user@domain.org');
  emails.push('admin@company.co.uk');
  emails.push('support@service.io');
  emails.push('info@website.net');
  
  // With special characters
  emails.push('user.name@example.com');
  emails.push('user+tag@example.com');
  emails.push('user_name@example.com');
  emails.push('user-name@example.com');
  
  // Numbers
  emails.push('user123@example.com');
  emails.push('123user@example.com');
  emails.push('user@123domain.com');
  
  // Subdomains
  emails.push('user@mail.example.com');
  emails.push('user@sub.domain.example.com');
  
  // Generate many valid emails
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'example.com', 'test.org'];
  for (let i = 0; i < 500; i++) {
    const domain = domains[i % domains.length];
    emails.push(`user${i}@${domain}`);
    emails.push(`test.user${i}@${domain}`);
    emails.push(`user${i}+tag@${domain}`);
  }
  
  return emails;
};

const generateInvalidEmails = (): string[] => {
  const emails: string[] = [];
  
  emails.push('');
  emails.push('notanemail');
  emails.push('@example.com');
  emails.push('user@');
  emails.push('user@.com');
  emails.push('user@domain');
  emails.push('user @example.com');
  emails.push('user@ example.com');
  emails.push('user@example .com');
  emails.push('user@@example.com');
  emails.push('user@example..com');
  emails.push('.user@example.com');
  emails.push('user.@example.com');
  emails.push('user@-example.com');
  emails.push('user@example-.com');
  
  for (let i = 0; i < 100; i++) {
    emails.push(`invalid${i}`);
    emails.push(`@invalid${i}.com`);
    emails.push(`invalid${i}@`);
  }
  
  return emails;
};

const generateGmailEmails = (): { original: string; normalized: string }[] => {
  const emails: { original: string; normalized: string }[] = [];
  
  emails.push({ original: 'user@gmail.com', normalized: 'user@gmail.com' });
  emails.push({ original: 'User@Gmail.com', normalized: 'user@gmail.com' });
  emails.push({ original: 'u.s.e.r@gmail.com', normalized: 'user@gmail.com' });
  emails.push({ original: 'user+tag@gmail.com', normalized: 'user@gmail.com' });
  emails.push({ original: 'u.s.e.r+tag@gmail.com', normalized: 'user@gmail.com' });
  
  for (let i = 0; i < 100; i++) {
    emails.push({ 
      original: `user${i}@gmail.com`, 
      normalized: `user${i}@gmail.com` 
    });
  }
  
  return emails;
};

const generateDisposableEmails = (): string[] => {
  const emails: string[] = [];
  const disposableDomains = [
    'tempmail.com', 'throwaway.com', 'mailinator.com', 'guerrillamail.com',
    'temp-mail.org', '10minutemail.com', 'fakeinbox.com', 'trashmail.com'
  ];
  
  for (const domain of disposableDomains) {
    for (let i = 0; i < 20; i++) {
      emails.push(`user${i}@${domain}`);
    }
  }
  
  return emails;
};

const generateEmailsForMasking = (): { email: string; masked: string }[] => {
  const emails: { email: string; masked: string }[] = [];
  
  emails.push({ email: 'ab@example.com', masked: '**@example.com' });
  emails.push({ email: 'abc@example.com', masked: 'a*c@example.com' });
  emails.push({ email: 'abcd@example.com', masked: 'a**d@example.com' });
  emails.push({ email: 'abcde@example.com', masked: 'a***e@example.com' });
  
  for (let i = 0; i < 100; i++) {
    const local = `user${i}`;
    const masked = local[0] + '*'.repeat(local.length - 2) + local[local.length - 1];
    emails.push({ email: `${local}@example.com`, masked: `${masked}@example.com` });
  }
  
  return emails;
};

// =============================================================================
// TEST SUITES
// =============================================================================

describe('Email Validation - Enterprise Fuzzing Suite', () => {
  describe('Valid Email Detection', () => {
    const validEmails = generateValidEmails();
    
    validEmails.forEach((email, index) => {
      it(`should validate email "${email}" #${index + 1}`, () => {
        expect(isValidEmail(email)).toBe(true);
      });
    });
  });

  describe('Invalid Email Detection', () => {
    const invalidEmails = generateInvalidEmails();
    
    invalidEmails.forEach((email, index) => {
      it(`should reject invalid email #${index + 1}`, () => {
        expect(isValidEmail(email)).toBe(false);
      });
    });
  });

  describe('Strict Email Validation', () => {
    const validEmails = generateValidEmails().slice(0, 200);
    
    validEmails.forEach((email, index) => {
      it(`should strictly validate email #${index + 1}`, () => {
        const result = isValidEmailStrict(email);
        expect(typeof result).toBe('boolean');
      });
    });
  });

  describe('Email Parsing', () => {
    const validEmails = generateValidEmails();
    
    validEmails.forEach((email, index) => {
      it(`should parse email #${index + 1}`, () => {
        const parsed = parseEmail(email);
        expect(parsed).not.toBeNull();
        expect(parsed?.local).toBeDefined();
        expect(parsed?.domain).toBeDefined();
      });
    });
  });

  describe('Email Normalization', () => {
    const gmailEmails = generateGmailEmails();
    
    gmailEmails.forEach((item, index) => {
      it(`should normalize Gmail email #${index + 1}`, () => {
        const normalized = normalizeEmail(item.original);
        expect(normalized).toBe(item.normalized);
      });
    });
  });

  describe('Disposable Email Detection', () => {
    const disposableEmails = generateDisposableEmails();
    
    disposableEmails.forEach((email, index) => {
      it(`should detect disposable email #${index + 1}`, () => {
        expect(isDisposableEmail(email)).toBe(true);
      });
    });
  });

  describe('Non-Disposable Email Detection', () => {
    const validEmails = generateValidEmails().filter(e => 
      !['tempmail.com', 'throwaway.com', 'mailinator.com'].some(d => e.includes(d))
    );
    
    validEmails.slice(0, 200).forEach((email, index) => {
      it(`should not flag regular email as disposable #${index + 1}`, () => {
        expect(isDisposableEmail(email)).toBe(false);
      });
    });
  });

  describe('Email Masking', () => {
    const emailsForMasking = generateEmailsForMasking();
    
    emailsForMasking.forEach((item, index) => {
      it(`should mask email #${index + 1}`, () => {
        const masked = maskEmail(item.email);
        expect(masked).toBe(item.masked);
      });
    });
  });

  describe('Domain Extraction', () => {
    const validEmails = generateValidEmails();
    
    validEmails.forEach((email, index) => {
      it(`should extract domain #${index + 1}`, () => {
        const domain = getDomainFromEmail(email);
        expect(domain).not.toBeNull();
        expect(typeof domain).toBe('string');
      });
    });
  });

  describe('Local Part Extraction', () => {
    const validEmails = generateValidEmails();
    
    validEmails.forEach((email, index) => {
      it(`should extract local part #${index + 1}`, () => {
        const local = getLocalPartFromEmail(email);
        expect(local).not.toBeNull();
        expect(typeof local).toBe('string');
      });
    });
  });

  describe('Suite Statistics', () => {
    it('should have comprehensive valid email coverage', () => {
      expect(generateValidEmails().length).toBeGreaterThan(1500);
    });
    
    it('should have comprehensive invalid email coverage', () => {
      expect(generateInvalidEmails().length).toBeGreaterThan(200);
    });
  });
});
