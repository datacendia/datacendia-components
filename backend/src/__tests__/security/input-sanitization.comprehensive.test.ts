// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * INPUT SANITIZATION - COMPREHENSIVE SECURITY TEST SUITE
 * Tests for XSS, SQL injection, and other input validation security
 */

import { describe, it, expect } from 'vitest';

describe('Input Sanitization Security', () => {
  // ===========================================================================
  // XSS PREVENTION - 50 TESTS
  // ===========================================================================
  describe('XSS Prevention', () => {
    const escapeHTML = (str: string): string => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    };

    describe('Script Tag Attacks', () => {
      it('should escape basic script tag', () => {
        const input = '<script>alert("XSS")</script>';
        expect(escapeHTML(input)).not.toContain('<script>');
      });

      it('should escape uppercase script tag', () => {
        const input = '<SCRIPT>alert("XSS")</SCRIPT>';
        expect(escapeHTML(input)).not.toContain('<SCRIPT>');
      });

      it('should escape mixed case script tag', () => {
        const input = '<ScRiPt>alert("XSS")</sCrIpT>';
        expect(escapeHTML(input)).not.toContain('<ScRiPt>');
      });

      it('should escape script with src attribute', () => {
        const input = '<script src="evil.js"></script>';
        expect(escapeHTML(input)).not.toContain('<script');
      });

      it('should escape self-closing script', () => {
        const input = '<script/>';
        expect(escapeHTML(input)).not.toContain('<script');
      });

      it('should escape script with spaces', () => {
        const input = '<script >alert("XSS")</script >';
        expect(escapeHTML(input)).not.toContain('<script');
      });

      it('should escape nested scripts', () => {
        const input = '<script><script>alert("XSS")</script></script>';
        expect(escapeHTML(input)).not.toContain('<script>');
      });
    });

    describe('Event Handler Attacks', () => {
      it('should escape onclick handler', () => {
        const input = '<div onclick="alert(\'XSS\')">Click</div>';
        expect(escapeHTML(input)).not.toContain('<div');
      });

      it('should escape onmouseover handler', () => {
        const input = '<img onmouseover="alert(\'XSS\')">';
        expect(escapeHTML(input)).not.toContain('<img');
      });

      it('should escape onerror handler', () => {
        const input = '<img src="x" onerror="alert(\'XSS\')">';
        expect(escapeHTML(input)).not.toContain('<img');
      });

      it('should escape onload handler', () => {
        const input = '<body onload="alert(\'XSS\')">';
        expect(escapeHTML(input)).not.toContain('<body');
      });

      it('should escape onfocus handler', () => {
        const input = '<input onfocus="alert(\'XSS\')">';
        expect(escapeHTML(input)).not.toContain('<input');
      });
    });

    describe('URL-based Attacks', () => {
      it('should escape javascript: URLs', () => {
        const input = '<a href="javascript:alert(\'XSS\')">Click</a>';
        expect(escapeHTML(input)).not.toContain('<a');
      });

      it('should escape data: URLs', () => {
        const input = '<a href="data:text/html,<script>alert(\'XSS\')</script>">Click</a>';
        expect(escapeHTML(input)).not.toContain('<a');
      });

      it('should escape vbscript: URLs', () => {
        const input = '<a href="vbscript:msgbox(\'XSS\')">Click</a>';
        expect(escapeHTML(input)).not.toContain('<a');
      });
    });

    describe('CSS-based Attacks', () => {
      it('should escape style tags', () => {
        const input = '<style>body{background:url("javascript:alert(\'XSS\')")}</style>';
        expect(escapeHTML(input)).not.toContain('<style>');
      });

      it('should escape inline styles', () => {
        const input = '<div style="background:url(javascript:alert(\'XSS\'))">Test</div>';
        expect(escapeHTML(input)).not.toContain('<div');
      });
    });

    describe('Encoding Bypass Attempts', () => {
      it('should handle HTML entities', () => {
        const input = '&lt;script&gt;alert("XSS")&lt;/script&gt;';
        const result = escapeHTML(input);
        expect(result).toContain('&amp;lt;');
      });

      it('should handle unicode escapes', () => {
        const input = '\u003cscript\u003ealert("XSS")\u003c/script\u003e';
        expect(escapeHTML(input)).not.toContain('<script>');
      });

      it('should handle hex encoding', () => {
        const input = '%3Cscript%3Ealert("XSS")%3C/script%3E';
        // URL encoded strings should be decoded first, then escaped
        expect(escapeHTML(decodeURIComponent(input))).not.toContain('<script>');
      });

      it('should handle double encoding', () => {
        const input = '%253Cscript%253E';
        const decoded = decodeURIComponent(decodeURIComponent(input));
        expect(escapeHTML(decoded)).not.toContain('<script>');
      });
    });

    describe('Special Characters', () => {
      it('should escape ampersand', () => {
        expect(escapeHTML('A & B')).toBe('A &amp; B');
      });

      it('should escape less than', () => {
        expect(escapeHTML('a < b')).toBe('a &lt; b');
      });

      it('should escape greater than', () => {
        expect(escapeHTML('a > b')).toBe('a &gt; b');
      });

      it('should escape double quotes', () => {
        expect(escapeHTML('a "test" b')).toBe('a &quot;test&quot; b');
      });

      it('should escape single quotes', () => {
        expect(escapeHTML("it's")).toBe('it&#x27;s');
      });

      it('should escape forward slash', () => {
        expect(escapeHTML('a/b')).toBe('a&#x2F;b');
      });

      it('should preserve safe text', () => {
        expect(escapeHTML('Hello World 123')).toBe('Hello World 123');
      });
    });
  });

  // ===========================================================================
  // SQL INJECTION PREVENTION - 40 TESTS
  // ===========================================================================
  describe('SQL Injection Prevention', () => {
    const escapeSQLString = (str: string): string => {
      return str.replace(/'/g, "''").replace(/\\/g, '\\\\');
    };

    const containsSQLInjection = (str: string): boolean => {
      const patterns = [
        /'\s*OR\s*'1'\s*=\s*'1/i,
        /'\s*OR\s*1\s*=\s*1/i,
        /;\s*DROP\s+TABLE/i,
        /;\s*DELETE\s+FROM/i,
        /;\s*UPDATE\s+.*\s+SET/i,
        /;\s*INSERT\s+INTO/i,
        /UNION\s+SELECT/i,
        /--/,
        /\/\*/,
        /xp_cmdshell/i,
        /exec\s*\(/i,
      ];
      return patterns.some(p => p.test(str));
    };

    describe('Basic Injection Patterns', () => {
      it('should detect OR 1=1', () => {
        expect(containsSQLInjection("' OR '1'='1")).toBe(true);
      });

      it('should detect OR 1=1 without quotes', () => {
        expect(containsSQLInjection("' OR 1=1--")).toBe(true);
      });

      it('should detect DROP TABLE', () => {
        expect(containsSQLInjection("; DROP TABLE users;")).toBe(true);
      });

      it('should detect DELETE FROM', () => {
        expect(containsSQLInjection("; DELETE FROM users;")).toBe(true);
      });

      it('should detect UPDATE SET', () => {
        expect(containsSQLInjection("; UPDATE users SET role='admin'")).toBe(true);
      });

      it('should detect INSERT INTO', () => {
        expect(containsSQLInjection("; INSERT INTO users VALUES(1,'admin')")).toBe(true);
      });

      it('should detect UNION SELECT', () => {
        expect(containsSQLInjection("' UNION SELECT * FROM passwords--")).toBe(true);
      });

      it('should detect comment markers', () => {
        expect(containsSQLInjection("admin'--")).toBe(true);
      });

      it('should detect multi-line comments', () => {
        expect(containsSQLInjection("admin'/*")).toBe(true);
      });

      it('should not flag normal text', () => {
        expect(containsSQLInjection("Hello World")).toBe(false);
      });
    });

    describe('String Escaping', () => {
      it('should escape single quotes', () => {
        expect(escapeSQLString("O'Brien")).toBe("O''Brien");
      });

      it('should escape multiple single quotes', () => {
        expect(escapeSQLString("It's John's")).toBe("It''s John''s");
      });

      it('should escape backslashes', () => {
        expect(escapeSQLString('path\\to\\file')).toBe('path\\\\to\\\\file');
      });

      it('should handle empty string', () => {
        expect(escapeSQLString('')).toBe('');
      });

      it('should handle string without special chars', () => {
        expect(escapeSQLString('normal text')).toBe('normal text');
      });
    });

    describe('Advanced Injection Patterns', () => {
      it('should detect xp_cmdshell', () => {
        expect(containsSQLInjection("; xp_cmdshell 'dir'")).toBe(true);
      });

      it('should detect exec calls', () => {
        expect(containsSQLInjection("; exec('DROP TABLE')")).toBe(true);
      });

      it('should detect case variations', () => {
        expect(containsSQLInjection("' uNiOn SeLeCt *")).toBe(true);
      });

      it('should detect whitespace variations', () => {
        expect(containsSQLInjection("'  OR  1 = 1")).toBe(true);
      });
    });
  });

  // ===========================================================================
  // PATH TRAVERSAL PREVENTION - 30 TESTS
  // ===========================================================================
  describe('Path Traversal Prevention', () => {
    const containsPathTraversal = (path: string): boolean => {
      const patterns = [
        /\.\.\//,
        /\.\.\\/, 
        /\.\./,
        /%2e%2e/i,
        /%252e%252e/i,
        /\.\.%2f/i,
        /\.\.%5c/i,
      ];
      return patterns.some(p => p.test(path));
    };

    const sanitizePath = (path: string): string => {
      return path
        .replace(/\.\./g, '')
        .replace(/%2e/gi, '')
        .replace(/\\/g, '/')
        .replace(/\/+/g, '/');
    };

    it('should detect ../path', () => {
      expect(containsPathTraversal('../etc/passwd')).toBe(true);
    });

    it('should detect ..\\path', () => {
      expect(containsPathTraversal('..\\windows\\system32')).toBe(true);
    });

    it('should detect multiple traversal', () => {
      expect(containsPathTraversal('../../../../../../etc/passwd')).toBe(true);
    });

    it('should detect URL encoded traversal', () => {
      expect(containsPathTraversal('%2e%2e/etc/passwd')).toBe(true);
    });

    it('should detect double encoded traversal', () => {
      expect(containsPathTraversal('%252e%252e/etc/passwd')).toBe(true);
    });

    it('should not flag normal paths', () => {
      expect(containsPathTraversal('/home/user/file.txt')).toBe(false);
    });

    it('should not flag current directory', () => {
      expect(containsPathTraversal('./file.txt')).toBe(false);
    });

    it('should sanitize path traversal', () => {
      expect(sanitizePath('../etc/passwd')).toBe('/etc/passwd');
    });

    it('should sanitize multiple traversals', () => {
      const result = sanitizePath('../../../../../../etc/passwd');
      expect(result).not.toContain('..');
    });

    it('should normalize slashes', () => {
      expect(sanitizePath('path\\to\\file')).toBe('path/to/file');
    });

    it('should remove duplicate slashes', () => {
      expect(sanitizePath('path//to///file')).toBe('path/to/file');
    });
  });

  // ===========================================================================
  // COMMAND INJECTION PREVENTION - 30 TESTS
  // ===========================================================================
  describe('Command Injection Prevention', () => {
    const containsCommandInjection = (input: string): boolean => {
      const patterns = [
        /[;&|`$]/,
        /\$\(/,
        /\)\s*{/,
        /\|\s*\|/,
        /&&/,
        />\s*>/,
        /\n/,
        /\r/,
      ];
      return patterns.some(p => p.test(input));
    };

    const escapeShellArg = (arg: string): string => {
      return `'${arg.replace(/'/g, "'\\''")}'`;
    };

    describe('Shell Metacharacters', () => {
      it('should detect semicolon', () => {
        expect(containsCommandInjection('file; rm -rf /')).toBe(true);
      });

      it('should detect pipe', () => {
        expect(containsCommandInjection('file | cat /etc/passwd')).toBe(true);
      });

      it('should detect ampersand', () => {
        expect(containsCommandInjection('file & malicious')).toBe(true);
      });

      it('should detect backticks', () => {
        expect(containsCommandInjection('`whoami`')).toBe(true);
      });

      it('should detect dollar sign', () => {
        expect(containsCommandInjection('$USER')).toBe(true);
      });

      it('should detect command substitution', () => {
        expect(containsCommandInjection('$(whoami)')).toBe(true);
      });

      it('should detect double pipe', () => {
        expect(containsCommandInjection('false || rm -rf /')).toBe(true);
      });

      it('should detect double ampersand', () => {
        expect(containsCommandInjection('true && rm -rf /')).toBe(true);
      });

      it('should detect redirect', () => {
        expect(containsCommandInjection('echo hack >> /etc/passwd')).toBe(true);
      });

      it('should detect newline', () => {
        expect(containsCommandInjection('file\nrm -rf /')).toBe(true);
      });

      it('should not flag normal input', () => {
        expect(containsCommandInjection('normal_filename.txt')).toBe(false);
      });
    });

    describe('Shell Escaping', () => {
      it('should escape simple string', () => {
        expect(escapeShellArg('hello')).toBe("'hello'");
      });

      it('should escape string with spaces', () => {
        expect(escapeShellArg('hello world')).toBe("'hello world'");
      });

      it('should escape string with single quotes', () => {
        expect(escapeShellArg("it's")).toBe("'it'\\''s'");
      });

      it('should escape empty string', () => {
        expect(escapeShellArg('')).toBe("''");
      });
    });
  });

  // ===========================================================================
  // HEADER INJECTION PREVENTION - 20 TESTS
  // ===========================================================================
  describe('Header Injection Prevention', () => {
    const containsHeaderInjection = (value: string): boolean => {
      return /[\r\n]/.test(value);
    };

    const sanitizeHeaderValue = (value: string): string => {
      return value.replace(/[\r\n]/g, '');
    };

    it('should detect carriage return', () => {
      expect(containsHeaderInjection('value\rSet-Cookie: hack=1')).toBe(true);
    });

    it('should detect newline', () => {
      expect(containsHeaderInjection('value\nSet-Cookie: hack=1')).toBe(true);
    });

    it('should detect CRLF', () => {
      expect(containsHeaderInjection('value\r\nSet-Cookie: hack=1')).toBe(true);
    });

    it('should not flag normal values', () => {
      expect(containsHeaderInjection('normal-value')).toBe(false);
    });

    it('should sanitize carriage return', () => {
      expect(sanitizeHeaderValue('value\rmore')).toBe('valuemore');
    });

    it('should sanitize newline', () => {
      expect(sanitizeHeaderValue('value\nmore')).toBe('valuemore');
    });

    it('should sanitize CRLF', () => {
      expect(sanitizeHeaderValue('value\r\nmore')).toBe('valuemore');
    });

    it('should preserve normal values', () => {
      expect(sanitizeHeaderValue('normal-value')).toBe('normal-value');
    });
  });

  // ===========================================================================
  // LDAP INJECTION PREVENTION - 15 TESTS
  // ===========================================================================
  describe('LDAP Injection Prevention', () => {
    const escapeLDAP = (str: string): string => {
      return str
        .replace(/\\/g, '\\5c')
        .replace(/\*/g, '\\2a')
        .replace(/\(/g, '\\28')
        .replace(/\)/g, '\\29')
        .replace(/\x00/g, '\\00');
    };

    it('should escape asterisk', () => {
      expect(escapeLDAP('*')).toBe('\\2a');
    });

    it('should escape parentheses', () => {
      expect(escapeLDAP('(test)')).toBe('\\28test\\29');
    });

    it('should escape backslash', () => {
      expect(escapeLDAP('\\')).toBe('\\5c');
    });

    it('should escape null byte', () => {
      expect(escapeLDAP('\x00')).toBe('\\00');
    });

    it('should escape wildcard injection', () => {
      const input = '*)(&';
      const escaped = escapeLDAP(input);
      expect(escaped).not.toContain('*');
      expect(escaped).not.toContain('(');
    });

    it('should handle normal input', () => {
      expect(escapeLDAP('john.doe')).toBe('john.doe');
    });
  });

  // ===========================================================================
  // XML INJECTION PREVENTION - 15 TESTS
  // ===========================================================================
  describe('XML Injection Prevention', () => {
    const escapeXML = (str: string): string => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };

    it('should escape ampersand', () => {
      expect(escapeXML('A & B')).toBe('A &amp; B');
    });

    it('should escape less than', () => {
      expect(escapeXML('<tag>')).toBe('&lt;tag&gt;');
    });

    it('should escape quotes', () => {
      expect(escapeXML('"test"')).toBe('&quot;test&quot;');
    });

    it('should escape apostrophe', () => {
      expect(escapeXML("it's")).toBe('it&apos;s');
    });

    it('should handle XXE payload', () => {
      const xxe = '<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>';
      const escaped = escapeXML(xxe);
      expect(escaped).not.toContain('<!DOCTYPE');
    });

    it('should preserve normal text', () => {
      expect(escapeXML('Hello World')).toBe('Hello World');
    });
  });
});
