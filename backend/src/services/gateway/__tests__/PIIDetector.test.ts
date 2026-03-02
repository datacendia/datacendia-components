/**
 * Unit tests for CendiaGateway™ PII Detection Engine
 * 
 * Tests both regex patterns (Pass 1) and heuristic NER (Pass 2).
 */

import { describe, it, expect } from 'vitest';
import { scanForPII, containsPII, scanForKeywords } from '../PIIDetector';

describe('PIIDetector', () => {
  // ===========================================================================
  // Pass 1: Regex Pattern Tests
  // ===========================================================================

  describe('SSN detection', () => {
    it('detects SSN with dashes', () => {
      const result = scanForPII('My SSN is 123-45-6789');
      expect(result.hasPII).toBe(true);
      expect(result.types).toContain('ssn');
      expect(result.redactedText).toContain('[SSN REDACTED]');
    });

    it('detects SSN with spaces', () => {
      const result = scanForPII('SSN: 123 45 6789');
      expect(result.hasPII).toBe(true);
      expect(result.types).toContain('ssn');
    });

    it('detects SSN without separators', () => {
      const result = scanForPII('SSN is 123456789');
      expect(result.hasPII).toBe(true);
    });
  });

  describe('credit card detection', () => {
    it('detects credit card with dashes', () => {
      const result = scanForPII('Card: 4111-1111-1111-1111');
      expect(result.hasPII).toBe(true);
      expect(result.types).toContain('credit_card');
      expect(result.redactedText).toContain('[CREDIT CARD REDACTED]');
    });

    it('detects credit card with spaces', () => {
      const result = scanForPII('Pay with 4111 1111 1111 1111');
      expect(result.hasPII).toBe(true);
      expect(result.types).toContain('credit_card');
    });
  });

  describe('email detection', () => {
    it('detects email addresses', () => {
      const result = scanForPII('Contact john.doe@company.com for details');
      expect(result.hasPII).toBe(true);
      expect(result.types).toContain('email');
      expect(result.redactedText).toContain('[EMAIL REDACTED]');
      expect(result.redactedText).not.toContain('john.doe@company.com');
    });

    it('detects multiple emails', () => {
      const result = scanForPII('Email alice@test.com and bob@test.com');
      expect(result.detections.filter(d => d.type === 'email')).toHaveLength(2);
    });
  });

  describe('phone detection', () => {
    it('detects US phone with parens', () => {
      const result = scanForPII('Call (555) 123-4567');
      expect(result.hasPII).toBe(true);
      expect(result.types).toContain('phone');
    });

    it('detects phone with dashes', () => {
      const result = scanForPII('Phone: 555-123-4567');
      expect(result.hasPII).toBe(true);
      expect(result.types).toContain('phone');
    });
  });

  describe('IP address detection', () => {
    it('detects IPv4 addresses', () => {
      const result = scanForPII('Server at 192.168.1.100');
      expect(result.hasPII).toBe(true);
      expect(result.types).toContain('ip_address');
    });
  });

  describe('medical record detection', () => {
    it('detects MRN numbers', () => {
      const result = scanForPII('Patient MRN: 12345678');
      expect(result.hasPII).toBe(true);
      expect(result.types).toContain('medical_record');
    });

    it('detects patient ID', () => {
      const result = scanForPII('patient number: 987654');
      expect(result.hasPII).toBe(true);
      expect(result.types).toContain('medical_record');
    });
  });

  describe('bank account detection', () => {
    it('detects account numbers', () => {
      const result = scanForPII('account: 12345678901');
      expect(result.hasPII).toBe(true);
      expect(result.types).toContain('bank_account');
    });

    it('detects routing numbers', () => {
      const result = scanForPII('routing# 123456789');
      expect(result.hasPII).toBe(true);
      expect(result.types).toContain('bank_account');
    });
  });

  describe('passport detection', () => {
    it('detects passport numbers', () => {
      const result = scanForPII('passport: AB1234567');
      expect(result.hasPII).toBe(true);
      expect(result.types).toContain('passport');
    });
  });

  describe('drivers license detection', () => {
    it('detects DL numbers', () => {
      const result = scanForPII('DL: D12345678');
      expect(result.hasPII).toBe(true);
      expect(result.types).toContain('drivers_license');
    });
  });

  // ===========================================================================
  // Pass 2: Heuristic NER Tests
  // ===========================================================================

  describe('person name detection (NER)', () => {
    it('detects titled names', () => {
      const result = scanForPII('Please contact Dr. John Smith for the results');
      expect(result.hasPII).toBe(true);
      expect(result.types).toContain('person_name');
      expect(result.redactedText).toContain('[NAME REDACTED]');
    });

    it('detects contextual names (patient)', () => {
      const result = scanForPII('The patient John Williams was admitted yesterday');
      expect(result.hasPII).toBe(true);
      expect(result.types).toContain('person_name');
    });

    it('detects contextual names (employee)', () => {
      const result = scanForPII('employee Sarah Johnson submitted the report');
      expect(result.hasPII).toBe(true);
      expect(result.types).toContain('person_name');
    });
  });

  describe('address detection (NER)', () => {
    it('detects US street addresses', () => {
      const result = scanForPII('She lives at 123 Main Street');
      expect(result.hasPII).toBe(true);
      expect(result.types).toContain('address');
    });

    it('detects addresses with apartment', () => {
      const result = scanForPII('Send to 456 Oak Avenue, Apt 12');
      expect(result.hasPII).toBe(true);
      expect(result.types).toContain('address');
    });
  });

  describe('financial ID detection (NER)', () => {
    it('detects tax IDs', () => {
      const result = scanForPII('Company EIN: 12-3456789');
      expect(result.hasPII).toBe(true);
      expect(result.types).toContain('financial_id');
    });

    it('detects VAT numbers', () => {
      const result = scanForPII('VAT: GB123456789');
      expect(result.hasPII).toBe(true);
      expect(result.types).toContain('financial_id');
    });
  });

  // ===========================================================================
  // Edge Cases
  // ===========================================================================

  describe('edge cases', () => {
    it('returns no PII for clean text', () => {
      const result = scanForPII('What is the weather like today?');
      expect(result.hasPII).toBe(false);
      expect(result.detections).toHaveLength(0);
      expect(result.redactedText).toBe('What is the weather like today?');
    });

    it('handles empty string', () => {
      const result = scanForPII('');
      expect(result.hasPII).toBe(false);
      expect(result.detections).toHaveLength(0);
    });

    it('detects multiple PII types in one text', () => {
      const result = scanForPII('Contact john@test.com or call 555-123-4567, SSN 123-45-6789');
      expect(result.types).toContain('email');
      expect(result.types).toContain('phone');
      expect(result.types).toContain('ssn');
      expect(result.detections.length).toBeGreaterThanOrEqual(3);
    });

    it('preserves original text', () => {
      const original = 'SSN: 123-45-6789';
      const result = scanForPII(original);
      expect(result.originalText).toBe(original);
    });

    it('reports scan duration', () => {
      const result = scanForPII('Test text with SSN 123-45-6789');
      expect(result.scanDurationMs).toBeGreaterThanOrEqual(0);
    });
  });

  // ===========================================================================
  // containsPII — Quick check
  // ===========================================================================

  describe('containsPII', () => {
    it('returns true for text with PII', () => {
      expect(containsPII('SSN: 123-45-6789')).toBe(true);
    });

    it('returns false for clean text', () => {
      expect(containsPII('Hello world')).toBe(false);
    });
  });

  // ===========================================================================
  // scanForKeywords
  // ===========================================================================

  describe('scanForKeywords', () => {
    it('finds matching keywords', () => {
      const found = scanForKeywords('Tell me about Project Titan acquisition plans', ['Project Titan', 'acquisition']);
      expect(found).toContain('Project Titan');
      expect(found).toContain('acquisition');
    });

    it('is case insensitive', () => {
      const found = scanForKeywords('CONFIDENTIAL merger details', ['confidential']);
      expect(found).toContain('confidential');
    });

    it('returns empty for no matches', () => {
      const found = scanForKeywords('Normal business request', ['secret', 'classified']);
      expect(found).toHaveLength(0);
    });
  });
});
