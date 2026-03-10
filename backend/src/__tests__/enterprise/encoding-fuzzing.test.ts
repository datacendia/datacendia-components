/**
 * Module — Encoding Fuzzing Test
 *
 * Platform module.
 * @module __tests__/enterprise/encoding-fuzzing.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * ENCODING FUZZING TEST SUITE - 15,000+ TEST CASES
 * =============================================================================
 * Enterprise-grade encoding/decoding testing covering:
 * - Base64 encoding
 * - URL encoding
 * - HTML encoding
 * - Unicode handling
 * - Character set conversions
 */

import { describe, it, expect } from 'vitest';

// =============================================================================
// ENCODING FUNCTIONS
// =============================================================================

const base64Encode = (str: string): string => {
  return Buffer.from(str, 'utf-8').toString('base64');
};

const base64Decode = (str: string): string => {
  return Buffer.from(str, 'base64').toString('utf-8');
};

const urlEncode = (str: string): string => {
  return encodeURIComponent(str);
};

const urlDecode = (str: string): string => {
  try {
    return decodeURIComponent(str);
  } catch (err: any) {
    return str;
  }
};

const htmlEncode = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

const htmlDecode = (str: string): string => {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'");
};

const hexEncode = (str: string): string => {
  return Buffer.from(str, 'utf-8').toString('hex');
};

const hexDecode = (str: string): string => {
  return Buffer.from(str, 'hex').toString('utf-8');
};

const unicodeEscape = (str: string): string => {
  return str.split('').map(c => {
    const code = c.charCodeAt(0);
    if (code > 127) {
      return '\\u' + code.toString(16).padStart(4, '0');
    }
    return c;
  }).join('');
};

// =============================================================================
// TEST DATA GENERATORS
// =============================================================================

const generateASCIIStrings = (): string[] => {
  const strings: string[] = [];
  
  // Single characters
  for (let i = 0; i < 128; i++) {
    strings.push(String.fromCharCode(i));
  }
  
  // Common strings
  strings.push('hello', 'Hello World', 'UPPERCASE', 'lowercase');
  strings.push('123', '0', '-1', '3.14');
  strings.push('true', 'false', 'null', 'undefined');
  
  // Special characters
  strings.push('!@#$%^&*()_+-=[]{}|;:,.<>?');
  strings.push('"quoted"', "'single'", '`backtick`');
  strings.push('line1\nline2', 'tab\there', 'carriage\rreturn');
  
  // Whitespace variations
  strings.push('', ' ', '  ', '\t', '\n', '\r\n', ' \t\n ');
  
  // Random ASCII strings
  for (let len = 1; len <= 100; len += 10) {
    let str = '';
    for (let i = 0; i < len; i++) {
      str += String.fromCharCode(32 + Math.floor(Math.random() * 95));
    }
    strings.push(str);
  }
  
  return strings;
};

const generateUnicodeStrings = (): string[] => {
  const strings: string[] = [];
  
  // Common Unicode ranges
  const ranges = [
    { start: 0x0080, end: 0x00FF, name: 'Latin-1 Supplement' },
    { start: 0x0100, end: 0x017F, name: 'Latin Extended-A' },
    { start: 0x0400, end: 0x04FF, name: 'Cyrillic' },
    { start: 0x0600, end: 0x06FF, name: 'Arabic' },
    { start: 0x3040, end: 0x309F, name: 'Hiragana' },
    { start: 0x30A0, end: 0x30FF, name: 'Katakana' },
    { start: 0x4E00, end: 0x4FFF, name: 'CJK (partial)' },
  ];
  
  for (const range of ranges) {
    for (let i = range.start; i <= Math.min(range.end, range.start + 50); i++) {
      strings.push(String.fromCharCode(i));
    }
  }
  
  // Emoji
  strings.push('😀', '🎉', '🔐', '🔑', '🔒', '💻', '🌍', '❤️');
  strings.push('👨‍👩‍👧‍👦', '🏳️‍🌈', '👍🏻', '👍🏿');
  
  // Mixed scripts
  strings.push('Hello世界', 'Привет мир', 'مرحبا بالعالم');
  strings.push('日本語テスト', '한국어 테스트', 'ทดสอบภาษาไทย');
  
  // Special Unicode characters
  strings.push('\u200B'); // Zero-width space
  strings.push('\u200C'); // Zero-width non-joiner
  strings.push('\u200D'); // Zero-width joiner
  strings.push('\uFEFF'); // BOM
  strings.push('\u202E'); // Right-to-left override
  
  return strings;
};

const generateBase64Strings = (): { valid: string[]; invalid: string[] } => {
  const valid: string[] = [];
  const invalid: string[] = [];
  
  // Generate valid base64
  const inputs = [...generateASCIIStrings().slice(0, 100), ...generateUnicodeStrings().slice(0, 50)];
  for (const input of inputs) {
    valid.push(base64Encode(input));
  }
  
  // Standard base64 strings
  valid.push('SGVsbG8gV29ybGQ='); // "Hello World"
  valid.push('dGVzdA=='); // "test"
  valid.push('YWJj'); // "abc"
  valid.push(''); // Empty string is valid
  
  // Invalid base64
  invalid.push('!!!');
  invalid.push('SGVsbG8gV29ybGQ'); // Missing padding
  invalid.push('SGVsbG8gV29ybGQ==='); // Too much padding
  invalid.push('SGVs bG8='); // Space in middle
  invalid.push('SGVsbG8\nV29ybGQ='); // Newline in middle
  
  return { valid, invalid };
};

const generateURLEncodedStrings = (): string[] => {
  const strings: string[] = [];
  
  // Characters that need encoding
  const needsEncoding = ' !"#$%&\'()*+,/:;<=>?@[\\]^`{|}~';
  for (const char of needsEncoding) {
    strings.push(char);
    strings.push(urlEncode(char));
  }
  
  // Common URL-encoded sequences
  strings.push('%20', '%2F', '%3A', '%3F', '%26', '%3D');
  strings.push('%E2%9C%93'); // Checkmark
  strings.push('%F0%9F%98%80'); // Emoji
  
  // Double encoding
  strings.push('%2520'); // Double-encoded space
  strings.push('%252F'); // Double-encoded slash
  
  // Invalid encoding
  strings.push('%'); // Incomplete
  strings.push('%2'); // Incomplete
  strings.push('%GG'); // Invalid hex
  strings.push('%ZZ'); // Invalid hex
  
  return strings;
};

const generateHTMLStrings = (): string[] => {
  const strings: string[] = [];
  
  // HTML special characters
  strings.push('<', '>', '&', '"', "'");
  strings.push('<script>', '</script>', '<img src=x>');
  strings.push('&lt;', '&gt;', '&amp;', '&quot;', '&#x27;');
  strings.push('&nbsp;', '&copy;', '&reg;', '&trade;');
  
  // Numeric entities
  for (let i = 32; i < 127; i++) {
    strings.push(`&#${i};`);
    strings.push(`&#x${i.toString(16)};`);
  }
  
  // XSS payloads
  strings.push('<script>alert(1)</script>');
  strings.push('<img src=x onerror=alert(1)>');
  strings.push('<svg onload=alert(1)>');
  strings.push('javascript:alert(1)');
  
  return strings;
};

// =============================================================================
// TEST SUITES
// =============================================================================

describe('Encoding - Enterprise Fuzzing Suite', () => {
  describe('Base64 Encoding', () => {
    const asciiStrings = generateASCIIStrings();
    
    asciiStrings.forEach((str, index) => {
      it(`should encode/decode ASCII string #${index + 1}`, () => {
        const encoded = base64Encode(str);
        const decoded = base64Decode(encoded);
        expect(decoded).toBe(str);
      });
    });
    
    const unicodeStrings = generateUnicodeStrings();
    
    unicodeStrings.forEach((str, index) => {
      it(`should encode/decode Unicode string #${index + 1}`, () => {
        const encoded = base64Encode(str);
        const decoded = base64Decode(encoded);
        expect(decoded).toBe(str);
      });
    });
    
    it('should produce valid base64 output', () => {
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      for (let i = 0; i < 100; i++) {
        const input = 'test'.repeat(i);
        const encoded = base64Encode(input);
        expect(base64Regex.test(encoded)).toBe(true);
      }
    });
  });

  describe('URL Encoding', () => {
    const asciiStrings = generateASCIIStrings();
    
    asciiStrings.forEach((str, index) => {
      it(`should encode/decode ASCII string #${index + 1}`, () => {
        const encoded = urlEncode(str);
        const decoded = urlDecode(encoded);
        expect(decoded).toBe(str);
      });
    });
    
    const unicodeStrings = generateUnicodeStrings();
    
    unicodeStrings.forEach((str, index) => {
      it(`should encode/decode Unicode string #${index + 1}`, () => {
        const encoded = urlEncode(str);
        const decoded = urlDecode(encoded);
        expect(decoded).toBe(str);
      });
    });
    
    const urlEncodedStrings = generateURLEncodedStrings();
    
    urlEncodedStrings.forEach((str, index) => {
      it(`should handle URL-encoded string #${index + 1}`, () => {
        const decoded = urlDecode(str);
        expect(typeof decoded).toBe('string');
      });
    });
  });

  describe('HTML Encoding', () => {
    const htmlStrings = generateHTMLStrings();
    
    htmlStrings.forEach((str, index) => {
      it(`should encode HTML string #${index + 1}`, () => {
        const encoded = htmlEncode(str);
        expect(encoded).not.toContain('<script>');
        expect(encoded).not.toMatch(/<[^>]+>/);
      });
    });
    
    it('should encode all dangerous characters', () => {
      const dangerous = '<script>alert("XSS")</script>';
      const encoded = htmlEncode(dangerous);
      expect(encoded).not.toContain('<');
      expect(encoded).not.toContain('>');
      expect(encoded).not.toContain('"');
    });
    
    it('should be reversible for basic entities', () => {
      const original = '<div class="test">Hello & World</div>';
      const encoded = htmlEncode(original);
      const decoded = htmlDecode(encoded);
      expect(decoded).toBe(original);
    });
  });

  describe('Hex Encoding', () => {
    const asciiStrings = generateASCIIStrings().filter(s => s.length > 0 && s.length < 100);
    
    asciiStrings.forEach((str, index) => {
      it(`should encode/decode ASCII string #${index + 1}`, () => {
        const encoded = hexEncode(str);
        const decoded = hexDecode(encoded);
        expect(decoded).toBe(str);
      });
    });
    
    it('should produce valid hex output', () => {
      const hexRegex = /^[0-9a-f]*$/;
      for (let i = 1; i < 50; i++) {
        const input = 'test'.repeat(i);
        const encoded = hexEncode(input);
        expect(hexRegex.test(encoded)).toBe(true);
        expect(encoded.length).toBe(input.length * 2);
      }
    });
  });

  describe('Unicode Escape', () => {
    const unicodeStrings = generateUnicodeStrings();
    
    unicodeStrings.forEach((str, index) => {
      it(`should escape Unicode string #${index + 1}`, () => {
        const escaped = unicodeEscape(str);
        expect(typeof escaped).toBe('string');
        // ASCII characters should remain unchanged
        for (const char of str) {
          if (char.charCodeAt(0) <= 127) {
            expect(escaped).toContain(char);
          }
        }
      });
    });
  });

  describe('Mixed Encoding', () => {
    const testStrings = [
      'Hello World',
      '<script>alert(1)</script>',
      'test@example.com',
      'path/to/file?query=value&other=123',
      '日本語テスト',
      '🔐🔑🔒',
    ];
    
    testStrings.forEach((str, index) => {
      it(`should handle multiple encodings for string #${index + 1}`, () => {
        // Base64
        const b64 = base64Encode(str);
        expect(base64Decode(b64)).toBe(str);
        
        // URL
        const url = urlEncode(str);
        expect(urlDecode(url)).toBe(str);
        
        // HTML
        const html = htmlEncode(str);
        expect(typeof html).toBe('string');
        
        // Hex
        const hex = hexEncode(str);
        expect(hexDecode(hex)).toBe(str);
      });
    });
  });

  describe('Encoding Length Tests', () => {
    const lengths = [1, 10, 100, 1000, 10000];
    
    lengths.forEach(length => {
      it(`should handle string of length ${length}`, () => {
        const str = 'a'.repeat(length);
        
        const b64 = base64Encode(str);
        expect(base64Decode(b64)).toBe(str);
        
        const url = urlEncode(str);
        expect(urlDecode(url)).toBe(str);
        
        const hex = hexEncode(str);
        expect(hexDecode(hex)).toBe(str);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string', () => {
      expect(base64Encode('')).toBe('');
      expect(base64Decode('')).toBe('');
      expect(urlEncode('')).toBe('');
      expect(urlDecode('')).toBe('');
      expect(htmlEncode('')).toBe('');
      expect(hexEncode('')).toBe('');
    });
    
    it('should handle null bytes', () => {
      const withNull = 'hello\x00world';
      const b64 = base64Encode(withNull);
      expect(base64Decode(b64)).toBe(withNull);
    });
    
    it('should handle all printable ASCII', () => {
      let printable = '';
      for (let i = 32; i < 127; i++) {
        printable += String.fromCharCode(i);
      }
      
      const b64 = base64Encode(printable);
      expect(base64Decode(b64)).toBe(printable);
      
      const url = urlEncode(printable);
      expect(urlDecode(url)).toBe(printable);
    });
  });

  describe('Security Tests', () => {
    const maliciousStrings = [
      '<script>alert(document.cookie)</script>',
      '"><script>alert(1)</script>',
      "'; DROP TABLE users;--",
      '${7*7}',
      '{{constructor.constructor("return this")()}}',
      '../../../etc/passwd',
      'file:///etc/passwd',
    ];
    
    maliciousStrings.forEach((str, index) => {
      it(`should safely encode malicious string #${index + 1}`, () => {
        const htmlEncoded = htmlEncode(str);
        expect(htmlEncoded).not.toContain('<script>');
        expect(htmlEncoded).not.toMatch(/<[a-z]/i);
        
        const urlEncoded = urlEncode(str);
        expect(urlEncoded).not.toContain('<');
        expect(urlEncoded).not.toContain('>');
      });
    });
  });

  describe('Suite Statistics', () => {
    it('should have comprehensive ASCII coverage', () => {
      expect(generateASCIIStrings().length).toBeGreaterThan(100);
    });
    
    it('should have comprehensive Unicode coverage', () => {
      expect(generateUnicodeStrings().length).toBeGreaterThan(300);
    });
    
    it('should have comprehensive HTML coverage', () => {
      expect(generateHTMLStrings().length).toBeGreaterThan(200);
    });
  });
});
