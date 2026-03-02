/**
 * CendiaGateway™ — PII Detection Engine
 * 
 * Detects personally identifiable information in AI prompts before
 * they reach external providers. Uses regex patterns for MVP;
 * production would add ML-based NER (Named Entity Recognition).
 */

export interface PIIDetection {
  type: PIIType;
  value: string;
  redacted: string;
  startIndex: number;
  endIndex: number;
  confidence: number;
}

export type PIIType = 
  | 'ssn'
  | 'credit_card'
  | 'email'
  | 'phone'
  | 'ip_address'
  | 'date_of_birth'
  | 'medical_record'
  | 'bank_account'
  | 'passport'
  | 'drivers_license'
  | 'address';

export interface PIIScanResult {
  hasPII: boolean;
  detections: PIIDetection[];
  types: PIIType[];
  originalText: string;
  redactedText: string;
  scanDurationMs: number;
}

// PII pattern definitions with named capture groups
const PII_PATTERNS: Array<{ type: PIIType; pattern: RegExp; redactWith: string; confidence: number }> = [
  {
    type: 'ssn',
    pattern: /\b(\d{3}[-.\s]?\d{2}[-.\s]?\d{4})\b/g,
    redactWith: '[SSN REDACTED]',
    confidence: 0.95,
  },
  {
    type: 'credit_card',
    pattern: /\b(\d{4}[-.\s]?\d{4}[-.\s]?\d{4}[-.\s]?\d{4})\b/g,
    redactWith: '[CREDIT CARD REDACTED]',
    confidence: 0.95,
  },
  {
    type: 'email',
    pattern: /\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/g,
    redactWith: '[EMAIL REDACTED]',
    confidence: 0.99,
  },
  {
    type: 'phone',
    pattern: /\b(\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})\b/g,
    redactWith: '[PHONE REDACTED]',
    confidence: 0.85,
  },
  {
    type: 'ip_address',
    pattern: /\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/g,
    redactWith: '[IP REDACTED]',
    confidence: 0.90,
  },
  {
    type: 'date_of_birth',
    pattern: /\b((?:DOB|date of birth|born|birthday)[:\s]+\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\b/gi,
    redactWith: '[DOB REDACTED]',
    confidence: 0.90,
  },
  {
    type: 'medical_record',
    pattern: /\b(MRN[:\s#]*\d{6,12}|patient\s*(?:id|number)[:\s#]*\d{4,12})\b/gi,
    redactWith: '[MEDICAL RECORD REDACTED]',
    confidence: 0.90,
  },
  {
    type: 'bank_account',
    pattern: /\b((?:account|acct|routing)[:\s#]*\d{8,17})\b/gi,
    redactWith: '[BANK ACCOUNT REDACTED]',
    confidence: 0.85,
  },
  {
    type: 'passport',
    pattern: /\b((?:passport)[:\s#]*[A-Z0-9]{6,12})\b/gi,
    redactWith: '[PASSPORT REDACTED]',
    confidence: 0.80,
  },
  {
    type: 'drivers_license',
    pattern: /\b((?:DL|driver'?s?\s*licen[sc]e)[:\s#]*[A-Z0-9]{5,15})\b/gi,
    redactWith: '[DL REDACTED]',
    confidence: 0.80,
  },
];

/**
 * Scans text for PII and optionally redacts it.
 */
export function scanForPII(text: string): PIIScanResult {
  const startTime = Date.now();
  const detections: PIIDetection[] = [];
  let redactedText = text;

  for (const { type, pattern, redactWith, confidence } of PII_PATTERNS) {
    // Reset regex state
    const regex = new RegExp(pattern.source, pattern.flags);
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      const value = match[1] || match[0];
      detections.push({
        type,
        value,
        redacted: redactWith,
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        confidence,
      });
    }
  }

  // Sort by position (reverse) and redact
  const sortedDetections = [...detections].sort((a, b) => b.startIndex - a.startIndex);
  for (const detection of sortedDetections) {
    redactedText =
      redactedText.slice(0, detection.startIndex) +
      detection.redacted +
      redactedText.slice(detection.endIndex);
  }

  const types = [...new Set(detections.map(d => d.type))];

  return {
    hasPII: detections.length > 0,
    detections,
    types,
    originalText: text,
    redactedText,
    scanDurationMs: Date.now() - startTime,
  };
}

/**
 * Quick check — returns true if any PII is detected (no redaction).
 */
export function containsPII(text: string): boolean {
  for (const { pattern } of PII_PATTERNS) {
    const regex = new RegExp(pattern.source, pattern.flags);
    if (regex.test(text)) return true;
  }
  return false;
}

/**
 * Check text against custom blocked keywords.
 */
export function scanForKeywords(text: string, keywords: string[]): string[] {
  const found: string[] = [];
  const lowerText = text.toLowerCase();
  for (const keyword of keywords) {
    if (lowerText.includes(keyword.toLowerCase())) {
      found.push(keyword);
    }
  }
  return found;
}
