/**
 * SSOService Tests
 * @module __tests__/services/SSOService.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi } from 'vitest';

vi.mock('../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));
vi.mock('../../utils/servicePersistence.js', () => ({
  persistServiceRecord: vi.fn().mockResolvedValue(undefined),
  loadServiceRecords: vi.fn().mockResolvedValue([]),
}));

const mod = await import('../../services/enterprise/SSOService.js');
const SSOService = (mod as any).SSOService;
const service = (mod as any).ssoService || new SSOService();

describe('SSOService', () => {
  it('should export SSOService class', () => {
    expect(SSOService).toBeDefined();
  });

  it('should be instantiable', () => {
    expect(service).toBeDefined();
  });

  describe('registerIdP()', () => {
    it('should register an identity provider', () => {
      const idp = service.registerIdP({
        name: 'Test IdP',
        organizationId: 'org-1',
        protocol: 'saml',
        entityId: 'https://idp.example.com',
        ssoUrl: 'https://idp.example.com/sso',
        certificate: 'MIIC...',
        enabled: true,
      } as any);
      expect(idp).toBeDefined();
      expect(idp.id).toBeDefined();
    });
  });

  describe('getIdP()', () => {
    it('should return undefined for non-existent IdP', () => {
      expect(service.getIdP('not-found')).toBeUndefined();
    });
  });

  describe('listIdPs()', () => {
    it('should return IdPs for organization', () => {
      const idps = service.listIdPs('org-1');
      expect(Array.isArray(idps)).toBe(true);
    });
  });

  describe('generateSAMLAuthnRequest()', () => {
    it('should generate SAML AuthnRequest', () => {
      const idp = service.registerIdP({
        name: 'SAML IdP',
        organizationId: 'org-1',
        protocol: 'saml2',
        entityId: 'https://saml.example.com',
        ssoUrl: 'https://saml.example.com/sso',
        certificate: 'MIIC...',
        enabled: true,
      } as any);
      const request = service.generateSAMLAuthnRequest(idp.id);
      expect(request).toBeDefined();
      expect(request).toHaveProperty('samlRequest');
    });
  });

  describe('generatePKCEChallenge()', () => {
    it('should generate PKCE challenge', () => {
      const challenge = service.generatePKCEChallenge();
      expect(challenge).toBeDefined();
      expect(challenge).toHaveProperty('codeVerifier');
      expect(challenge).toHaveProperty('codeChallenge');
      expect(challenge).toHaveProperty('codeChallengeMethod');
    });
  });

  describe('createSession()', () => {
    it('should create an SSO session', () => {
      const session = service.createSession({
        userId: 'user-1',
        organizationId: 'org-1',
        idpId: 'idp-1',
        email: 'user@example.com',
        expiresIn: 3600,
      } as any);
      expect(session).toBeDefined();
      expect(session).toHaveProperty('id');
    });
  });

  describe('getSession()', () => {
    it('should return undefined for non-existent session', () => {
      expect(service.getSession('not-found')).toBeUndefined();
    });
  });

  describe('revokeSession()', () => {
    it('should return false for non-existent session', () => {
      expect(service.revokeSession('not-found')).toBe(false);
    });
  });
});
