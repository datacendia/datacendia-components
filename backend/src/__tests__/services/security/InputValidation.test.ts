// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Input Validation Tests
 * Tests for input sanitization, validation, and security
 */

import { describe, it, expect } from 'vitest';

// Validation utilities
const validators = {
  isEmail(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  isUUID(value: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  },

  isAlphanumeric(value: string): boolean {
    return /^[a-zA-Z0-9]+$/.test(value);
  },

  isSafeString(value: string): boolean {
    // Check for common injection patterns
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+=/i,
      /data:/i,
      /vbscript:/i,
    ];
    return !dangerousPatterns.some(pattern => pattern.test(value));
  },

  isValidLength(value: string, min: number, max: number): boolean {
    return value.length >= min && value.length <= max;
  },

  sanitizeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  },

  sanitizeSql(value: string): string {
    return value.replace(/'/g, "''").replace(/;/g, '');
  },

  isValidJson(value: string): boolean {
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  },

  isValidUrl(value: string): boolean {
    try {
      const url = new URL(value);
      return ['http:', 'https:'].includes(url.protocol);
    } catch {
      return false;
    }
  },

  isValidIpAddress(value: string): boolean {
    // IPv4
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipv4Regex.test(value)) {
      return value.split('.').every(octet => {
        const num = parseInt(octet, 10);
        return num >= 0 && num <= 255;
      });
    }
    // IPv6 (simplified)
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv6Regex.test(value);
  },

  containsSqlInjection(value: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE)\b)/i,
      /(--)|(\/\*)/,
      /(\bOR\b|\bAND\b)\s*\d+\s*=\s*\d+/i,
      /'\s*(OR|AND)\s*'?\d*'?\s*=\s*'?\d*/i,
    ];
    return sqlPatterns.some(pattern => pattern.test(value));
  },

  containsXss(value: string): boolean {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe/gi,
      /<object/gi,
      /<embed/gi,
    ];
    return xssPatterns.some(pattern => pattern.test(value));
  },

  containsPathTraversal(value: string): boolean {
    const traversalPatterns = [
      /\.\.\//,
      /\.\.\\/,
      /%2e%2e%2f/i,
      /%2e%2e\//i,
      /\.\.%2f/i,
    ];
    return traversalPatterns.some(pattern => pattern.test(value));
  },
};

describe('Input Validation', () => {
  describe('Email Validation', () => {
    it('should validate correct email formats', () => {
      expect(validators.isEmail('test@example.com')).toBe(true);
      expect(validators.isEmail('user.name@domain.org')).toBe(true);
      expect(validators.isEmail('user+tag@example.co.uk')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(validators.isEmail('notanemail')).toBe(false);
      expect(validators.isEmail('missing@domain')).toBe(false);
      expect(validators.isEmail('@nodomain.com')).toBe(false);
      expect(validators.isEmail('spaces in@email.com')).toBe(false);
    });
  });

  describe('UUID Validation', () => {
    it('should validate correct UUID formats', () => {
      expect(validators.isUUID('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
      expect(validators.isUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    });

    it('should reject invalid UUID formats', () => {
      expect(validators.isUUID('not-a-uuid')).toBe(false);
      expect(validators.isUUID('123e4567-e89b-12d3-a456')).toBe(false);
      expect(validators.isUUID('123e4567e89b12d3a456426614174000')).toBe(false);
    });
  });

  describe('Alphanumeric Validation', () => {
    it('should validate alphanumeric strings', () => {
      expect(validators.isAlphanumeric('abc123')).toBe(true);
      expect(validators.isAlphanumeric('TestUser2024')).toBe(true);
    });

    it('should reject non-alphanumeric strings', () => {
      expect(validators.isAlphanumeric('has spaces')).toBe(false);
      expect(validators.isAlphanumeric('special@chars!')).toBe(false);
      expect(validators.isAlphanumeric('')).toBe(false);
    });
  });

  describe('Safe String Validation', () => {
    it('should accept safe strings', () => {
      expect(validators.isSafeString('Hello World')).toBe(true);
      expect(validators.isSafeString('Normal text with numbers 123')).toBe(true);
    });

    it('should reject strings with script tags', () => {
      expect(validators.isSafeString('<script>alert("xss")</script>')).toBe(false);
      expect(validators.isSafeString('<SCRIPT>malicious</SCRIPT>')).toBe(false);
    });

    it('should reject strings with javascript protocol', () => {
      expect(validators.isSafeString('javascript:alert(1)')).toBe(false);
    });

    it('should reject strings with event handlers', () => {
      expect(validators.isSafeString('onclick=alert(1)')).toBe(false);
      expect(validators.isSafeString('onmouseover=evil()')).toBe(false);
    });
  });

  describe('Length Validation', () => {
    it('should validate strings within length bounds', () => {
      expect(validators.isValidLength('hello', 1, 10)).toBe(true);
      expect(validators.isValidLength('a', 1, 1)).toBe(true);
    });

    it('should reject strings outside length bounds', () => {
      expect(validators.isValidLength('', 1, 10)).toBe(false);
      expect(validators.isValidLength('too long string', 1, 5)).toBe(false);
    });
  });

  describe('HTML Sanitization', () => {
    it('should escape HTML special characters', () => {
      expect(validators.sanitizeHtml('<script>')).toBe('&lt;script&gt;');
      expect(validators.sanitizeHtml('"quoted"')).toBe('&quot;quoted&quot;');
      expect(validators.sanitizeHtml("it's")).toBe('it&#x27;s');
      expect(validators.sanitizeHtml('a & b')).toBe('a &amp; b');
    });

    it('should preserve safe content', () => {
      expect(validators.sanitizeHtml('Hello World')).toBe('Hello World');
      expect(validators.sanitizeHtml('123')).toBe('123');
    });
  });

  describe('SQL Sanitization', () => {
    it('should escape single quotes', () => {
      expect(validators.sanitizeSql("O'Brien")).toBe("O''Brien");
    });

    it('should remove semicolons', () => {
      expect(validators.sanitizeSql('value; DROP TABLE')).toBe('value DROP TABLE');
    });
  });

  describe('JSON Validation', () => {
    it('should validate correct JSON', () => {
      expect(validators.isValidJson('{"key": "value"}')).toBe(true);
      expect(validators.isValidJson('[1, 2, 3]')).toBe(true);
      expect(validators.isValidJson('"string"')).toBe(true);
      expect(validators.isValidJson('null')).toBe(true);
    });

    it('should reject invalid JSON', () => {
      expect(validators.isValidJson('not json')).toBe(false);
      expect(validators.isValidJson('{key: value}')).toBe(false);
      expect(validators.isValidJson('')).toBe(false);
    });
  });

  describe('URL Validation', () => {
    it('should validate HTTP/HTTPS URLs', () => {
      expect(validators.isValidUrl('https://example.com')).toBe(true);
      expect(validators.isValidUrl('http://localhost:3000')).toBe(true);
      expect(validators.isValidUrl('https://sub.domain.co.uk/path?query=1')).toBe(true);
    });

    it('should reject non-HTTP URLs', () => {
      expect(validators.isValidUrl('ftp://example.com')).toBe(false);
      expect(validators.isValidUrl('javascript:alert(1)')).toBe(false);
      expect(validators.isValidUrl('file:///etc/passwd')).toBe(false);
    });

    it('should reject invalid URLs', () => {
      expect(validators.isValidUrl('not a url')).toBe(false);
      expect(validators.isValidUrl('')).toBe(false);
    });
  });

  describe('IP Address Validation', () => {
    it('should validate IPv4 addresses', () => {
      expect(validators.isValidIpAddress('192.168.1.1')).toBe(true);
      expect(validators.isValidIpAddress('10.0.0.1')).toBe(true);
      expect(validators.isValidIpAddress('255.255.255.255')).toBe(true);
    });

    it('should reject invalid IPv4 addresses', () => {
      expect(validators.isValidIpAddress('256.1.1.1')).toBe(false);
      expect(validators.isValidIpAddress('192.168.1')).toBe(false);
      expect(validators.isValidIpAddress('not.an.ip.address')).toBe(false);
    });
  });

  describe('SQL Injection Detection', () => {
    it('should detect SQL keywords', () => {
      expect(validators.containsSqlInjection("'; DROP TABLE users; --")).toBe(true);
      expect(validators.containsSqlInjection("1; SELECT * FROM passwords")).toBe(true);
      expect(validators.containsSqlInjection("1 UNION SELECT * FROM users")).toBe(true);
    });

    it('should detect SQL comments', () => {
      expect(validators.containsSqlInjection("admin'--")).toBe(true);
      expect(validators.containsSqlInjection("/* comment */")).toBe(true);
    });

    it('should detect OR/AND injection', () => {
      expect(validators.containsSqlInjection("' OR 1=1")).toBe(true);
      expect(validators.containsSqlInjection("' AND 1=1")).toBe(true);
    });

    it('should not flag normal text', () => {
      expect(validators.containsSqlInjection('Normal user input')).toBe(false);
      expect(validators.containsSqlInjection('John Doe')).toBe(false);
    });
  });

  describe('XSS Detection', () => {
    it('should detect script tags', () => {
      expect(validators.containsXss('<script>alert("xss")</script>')).toBe(true);
      expect(validators.containsXss('<SCRIPT>alert(1)</SCRIPT>')).toBe(true);
    });

    it('should detect javascript protocol', () => {
      expect(validators.containsXss('javascript:alert(1)')).toBe(true);
    });

    it('should detect event handlers', () => {
      expect(validators.containsXss('<img onerror=alert(1)>')).toBe(true);
      expect(validators.containsXss('<div onclick = "evil()">')).toBe(true);
    });

    it('should detect dangerous elements', () => {
      expect(validators.containsXss('<iframe src="evil.com">')).toBe(true);
      expect(validators.containsXss('<object data="bad.swf">')).toBe(true);
      expect(validators.containsXss('<embed src="malware">')).toBe(true);
    });

    it('should not flag normal text', () => {
      expect(validators.containsXss('Hello World')).toBe(false);
      expect(validators.containsXss('2 < 3 and 5 > 4')).toBe(false);
    });
  });

  describe('Path Traversal Detection', () => {
    it('should detect ../ patterns', () => {
      expect(validators.containsPathTraversal('../etc/passwd')).toBe(true);
      expect(validators.containsPathTraversal('..\\windows\\system32')).toBe(true);
    });

    it('should detect URL-encoded patterns', () => {
      expect(validators.containsPathTraversal('%2e%2e%2fetc/passwd')).toBe(true);
      expect(validators.containsPathTraversal('..%2fpasswd')).toBe(true);
    });

    it('should not flag normal paths', () => {
      expect(validators.containsPathTraversal('/home/user/file.txt')).toBe(false);
      expect(validators.containsPathTraversal('documents/report.pdf')).toBe(false);
    });
  });
});
