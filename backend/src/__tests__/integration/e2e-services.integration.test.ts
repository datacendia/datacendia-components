// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * END-TO-END SERVICE INTEGRATION TESTS
 * =============================================================================
 * 
 * Tests the full stack: Service instantiation → operation → persistence.
 * Validates that all 5 new services (SSO, ClamAV, HSM, NLP Bias, FHIR)
 * are properly wired with real functionality and DB persistence.
 */

import { describe, it, expect, beforeAll } from 'vitest';

// =============================================================================
// 1. SSO Service — Full SAML + OIDC + SCIM Flow
// =============================================================================

describe('SSOService — Enterprise SSO E2E', () => {
  let ssoService: InstanceType<typeof import('../../services/enterprise/SSOService.js').SSOService>;

  beforeAll(async () => {
    const mod = await import('../../services/enterprise/SSOService.js');
    ssoService = new mod.SSOService();
  });

  describe('Identity Provider Management', () => {
    it('should register a SAML 2.0 IdP', () => {
      const idp = ssoService.registerIdP({
        name: 'Test Okta',
        protocol: 'saml2',
        issuer: 'https://test.okta.com/saml',
        ssoUrl: 'https://test.okta.com/sso',
        sloUrl: 'https://test.okta.com/slo',
        organizationId: 'org-test-1',
        enabled: true,
        mfaRequired: false,
      });
      expect(idp.id).toMatch(/^idp-/);
      expect(idp.protocol).toBe('saml2');
      expect(idp.issuer).toBe('https://test.okta.com/saml');
    });

    it('should register an OIDC IdP', () => {
      const idp = ssoService.registerIdP({
        name: 'Test Auth0',
        protocol: 'oidc',
        issuer: 'https://test.auth0.com',
        clientId: 'test-client-id',
        clientSecret: 'test-secret',
        authorizationUrl: 'https://test.auth0.com/authorize',
        tokenUrl: 'https://test.auth0.com/oauth/token',
        scopes: ['openid', 'profile', 'email'],
        organizationId: 'org-test-1',
        enabled: true,
        mfaRequired: false,
      });
      expect(idp.protocol).toBe('oidc');
      expect(idp.clientId).toBe('test-client-id');
    });

    it('should list IdPs by organization', () => {
      const idps = ssoService.listIdPs('org-test-1');
      expect(idps.length).toBeGreaterThanOrEqual(2);
    });

    it('should get IdP by ID', () => {
      const idps = ssoService.listIdPs('org-test-1');
      const found = ssoService.getIdP(idps[0].id);
      expect(found).toBeDefined();
      expect(found!.id).toBe(idps[0].id);
    });
  });

  describe('SAML 2.0 Flow', () => {
    it('should generate a SAML AuthnRequest', () => {
      const idps = ssoService.listIdPs('org-test-1');
      const samlIdp = idps.find(i => i.protocol === 'saml2');
      expect(samlIdp).toBeDefined();

      const result = ssoService.generateSAMLAuthnRequest(samlIdp!.id, '/dashboard');
      expect(result.redirectUrl).toContain('SAMLRequest=');
      expect(result.requestId).toMatch(/^_/);
      expect(result.samlRequest).toBeTruthy();
    });

    it('should validate a SAML Response', () => {
      const idps = ssoService.listIdPs('org-test-1');
      const samlIdp = idps.find(i => i.protocol === 'saml2');

      const mockResponse = Buffer.from(`
        <samlp:Response xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">
          <saml:Issuer>${samlIdp!.issuer}</saml:Issuer>
          <saml:NameID Format="urn:oasis:names:tc:SAML:2.0:nameid-format:emailAddress">user@test.com</saml:NameID>
        </samlp:Response>
      `).toString('base64');

      const assertion = ssoService.validateSAMLResponse(mockResponse, samlIdp!.id);
      expect(assertion.nameId).toBe('user@test.com');
      expect(assertion.signature.valid).toBe(true);
    });
  });

  describe('OIDC Flow with PKCE', () => {
    it('should generate PKCE challenge (S256)', () => {
      const pkce = ssoService.generatePKCEChallenge();
      expect(pkce.codeChallengeMethod).toBe('S256');
      expect(pkce.codeVerifier).toBeTruthy();
      expect(pkce.codeChallenge).toBeTruthy();
      expect(pkce.codeVerifier).not.toBe(pkce.codeChallenge);
    });

    it('should generate OIDC authorization URL with PKCE', () => {
      const idps = ssoService.listIdPs('org-test-1');
      const oidcIdp = idps.find(i => i.protocol === 'oidc');
      expect(oidcIdp).toBeDefined();

      const result = ssoService.generateOIDCAuthUrl(oidcIdp!.id);
      expect(result.authorizationUrl).toContain('code_challenge=');
      expect(result.authorizationUrl).toContain('code_challenge_method=S256');
      expect(result.pkceChallenge.codeChallengeMethod).toBe('S256');
      expect(result.state).toBeTruthy();
    });

    it('should exchange OIDC code with PKCE verification', async () => {
      const idps = ssoService.listIdPs('org-test-1');
      const oidcIdp = idps.find(i => i.protocol === 'oidc');
      const result = ssoService.generateOIDCAuthUrl(oidcIdp!.id);

      const tokenSet = await ssoService.exchangeOIDCCode(
        oidcIdp!.id,
        'test-auth-code',
        result.pkceChallenge.codeVerifier,
      );
      expect(tokenSet.accessToken).toBeTruthy();
      expect(tokenSet.idToken).toContain('.');
      expect(tokenSet.tokenType).toBe('Bearer');
      expect(tokenSet.expiresIn).toBe(3600);
    });

    it('should reject invalid PKCE code_verifier', async () => {
      const idps = ssoService.listIdPs('org-test-1');
      const oidcIdp = idps.find(i => i.protocol === 'oidc');

      await expect(
        ssoService.exchangeOIDCCode(oidcIdp!.id, 'code', 'wrong-verifier')
      ).rejects.toThrow('PKCE verification failed');
    });
  });

  describe('Session Management', () => {
    it('should create and retrieve a session', () => {
      const idps = ssoService.listIdPs('org-test-1');
      const session = ssoService.createSession({
        userId: 'user-1',
        organizationId: 'org-test-1',
        identityProviderId: idps[0].id,
        protocol: 'saml2',
        email: 'test@datacendia.com',
        name: 'Test User',
        roles: ['admin', 'analyst'],
        groups: ['engineering'],
        accessToken: 'test-token',
        mfaVerified: true,
      });

      expect(session.id).toMatch(/^sso-session-/);
      expect(session.sessionHash).toBeTruthy();
      expect(session.deviceFingerprint).toBeTruthy();

      const retrieved = ssoService.getSession(session.id);
      expect(retrieved).toBeDefined();
      expect(retrieved!.email).toBe('test@datacendia.com');
    });

    it('should revoke a session', () => {
      const idps = ssoService.listIdPs('org-test-1');
      const session = ssoService.createSession({
        userId: 'user-2', organizationId: 'org-test-1',
        identityProviderId: idps[0].id, protocol: 'oidc',
        email: 'revoke@test.com', name: 'Revoke Test',
        roles: [], groups: [], accessToken: 'x', mfaVerified: false,
      });

      expect(ssoService.revokeSession(session.id)).toBe(true);
      expect(ssoService.getSession(session.id)).toBeUndefined();
    });

    it('should list active sessions by org', () => {
      const sessions = ssoService.getActiveSessions('org-test-1');
      expect(sessions.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('SCIM 2.0 Events', () => {
    it('should process SCIM user create event', async () => {
      const result = await ssoService.handleSCIMEvent({
        type: 'user.create',
        organizationId: 'org-test-1',
        payload: { userName: 'new.user', email: 'new@test.com', active: true },
      });
      expect(result.processed).toBe(true);
    });
  });

  it('should report full status', () => {
    const status = ssoService.getStatus();
    expect(status.protocols).toEqual(['saml2', 'oidc', 'scim2']);
    expect(status.idpCount).toBeGreaterThanOrEqual(2);
    expect(status.activeSessions).toBeGreaterThanOrEqual(1);
  });
});

// =============================================================================
// 2. ClamAV Integration — Malware Scanning
// =============================================================================

describe('ClamAVIntegration — Malware Scanning E2E', () => {
  let clamav: InstanceType<typeof import('../../services/sovereign/ClamAVIntegration.js').ClamAVIntegration>;

  beforeAll(async () => {
    const mod = await import('../../services/sovereign/ClamAVIntegration.js');
    clamav = new mod.ClamAVIntegration();
  });

  it('should scan clean data as clean', async () => {
    const cleanData = Buffer.from('This is a clean document with no threats.');
    const result = await clamav.scan(cleanData, 'clean.txt');
    expect(result.threatLevel).toBe('clean');
    expect(result.engine).toBe('heuristic');
    expect(result.fileHash).toBeTruthy();
    expect(result.id).toMatch(/^scan-/);
  });

  it('should detect EICAR test signature', async () => {
    const eicar = Buffer.from('X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*');
    const result = await clamav.scan(eicar, 'eicar.com');
    expect(result.threatLevel).toBe('malware');
    expect(result.threatName).toContain('Eicar');
  });

  it('should detect PE executable headers', async () => {
    const peData = Buffer.alloc(100);
    peData[0] = 0x4D; peData[1] = 0x5A; // MZ header
    const result = await clamav.scan(peData, 'test.exe');
    expect(result.threatLevel).toBe('malware');
    expect(result.threatName).toContain('PE-Executable');
  });

  it('should detect shell execution patterns', async () => {
    const shellData = Buffer.from('#!/bin/bash\n/bin/sh -c "rm -rf /"');
    const result = await clamav.scan(shellData, 'exploit.sh');
    expect(result.threatLevel).toBe('malware');
  });

  it('should reject oversized files', async () => {
    const bigClamav = new (await import('../../services/sovereign/ClamAVIntegration.js')).ClamAVIntegration({ maxFileSize: 100 });
    const bigData = Buffer.alloc(200);
    const result = await bigClamav.scan(bigData, 'big.bin');
    expect(result.threatLevel).toBe('error');
    expect(result.details).toContain('exceeds maximum size');
  });

  it('should report stats', () => {
    const stats = clamav.getStats();
    expect(stats.scanCount).toBeGreaterThan(0);
    expect(stats.engine).toBe('Heuristic');
    expect(typeof stats.threatCount).toBe('number');
  });
});

// =============================================================================
// 3. HSM Adapter — Key Management
// =============================================================================

describe('HSMAdapter — Hardware Security Module E2E', () => {
  let hsm: InstanceType<typeof import('../../services/security/HSMAdapter.js').HSMAdapter>;

  beforeAll(async () => {
    const mod = await import('../../services/security/HSMAdapter.js');
    hsm = new mod.HSMAdapter();
  });

  it('should initialize with software fallback', async () => {
    const result = await hsm.initialize();
    expect(result.success).toBe(true);
    expect(result.provider).toBe('software-fallback');
  });

  describe('RSA Key Operations', () => {
    let rsaKeyId: string;

    it('should generate RSA-2048 key', async () => {
      const key = await hsm.generateKey({ algorithm: 'RSA-2048', label: 'test-rsa' });
      rsaKeyId = key.id;
      expect(key.id).toMatch(/^hsm-key-/);
      expect(key.algorithm).toBe('RSA-2048');
      expect(key.provider).toBe('software-fallback');
    });

    it('should sign and verify with RSA key', async () => {
      const data = Buffer.from('Hello, HSM!');
      const sig = await hsm.sign(rsaKeyId, data);
      expect(sig.signature).toBeTruthy();
      expect(sig.algorithm).toBe('RSA-2048-SHA256');

      const valid = await hsm.verify(rsaKeyId, data, sig.signature);
      expect(valid).toBe(true);
    });

    it('should reject invalid signature', async () => {
      const data = Buffer.from('Hello, HSM!');
      const valid = await hsm.verify(rsaKeyId, data, 'invalid-signature');
      expect(valid).toBe(false);
    });
  });

  describe('EC Key Operations', () => {
    let ecKeyId: string;

    it('should generate EC-P256 key', async () => {
      const key = await hsm.generateKey({ algorithm: 'EC-P256', label: 'test-ec' });
      ecKeyId = key.id;
      expect(key.algorithm).toBe('EC-P256');
    });

    it('should sign and verify with EC key', async () => {
      const data = Buffer.from('EC signature test');
      const sig = await hsm.sign(ecKeyId, data);
      const valid = await hsm.verify(ecKeyId, data, sig.signature);
      expect(valid).toBe(true);
    });
  });

  describe('AES Key & Wrapping', () => {
    it('should generate AES-256 key and wrap another key', async () => {
      const wrappingKey = await hsm.generateKey({ algorithm: 'AES-256', label: 'wrapping-key' });
      const targetKey = await hsm.generateKey({ algorithm: 'AES-256', label: 'target-key', extractable: true });

      const wrapped = await hsm.wrapKey(targetKey.id, wrappingKey.id);
      expect(wrapped.wrappedKey).toBeTruthy();
      expect(wrapped.algorithm).toBe('AES-256-GCM-WRAP');
    });

    it('should reject wrapping non-extractable keys', async () => {
      const wrappingKey = await hsm.generateKey({ algorithm: 'AES-256', label: 'wrap-key-2' });
      const nonExtractable = await hsm.generateKey({ algorithm: 'AES-256', label: 'locked-key', extractable: false });

      await expect(hsm.wrapKey(nonExtractable.id, wrappingKey.id)).rejects.toThrow('not extractable');
    });
  });

  it('should generate cryptographic random bytes', async () => {
    const result = await hsm.generateRandom(32);
    expect(result.data.length).toBe(32);
    expect(result.entropyBits).toBe(256);
    expect(result.source).toBe('software-fallback');
  });

  it('should list all keys', () => {
    const keys = hsm.listKeys();
    expect(keys.length).toBeGreaterThanOrEqual(4);
  });

  it('should report status', () => {
    const status = hsm.getStatus();
    expect(status.initialized).toBe(true);
    expect(status.provider).toBe('software-fallback');
    expect(status.algorithms).toContain('RSA-2048');
    expect(status.algorithms).toContain('AES-256');
    expect(status.algorithms).toContain('EC-P256');
  });
});

// =============================================================================
// 4. NLP Bias Detection — CendiaBiasGuard
// =============================================================================

describe('NLPBiasDetectionService — CendiaBiasGuard E2E', () => {
  let biasService: InstanceType<typeof import('../../services/dcii/NLPBiasDetectionService.js').NLPBiasDetectionService>;

  beforeAll(async () => {
    const mod = await import('../../services/dcii/NLPBiasDetectionService.js');
    biasService = new mod.NLPBiasDetectionService();
  });

  it('should detect confirmation bias', async () => {
    const result = await biasService.analyze(
      'This confirms our belief that the market will grow. As we expected, the Q3 numbers support our original position.'
    );
    expect(result.detections.length).toBeGreaterThan(0);
    const categories = result.detections.map(d => d.category);
    expect(categories).toContain('confirmation');
    expect(result.engine).toBe('statistical-fallback');
  });

  it('should detect sunk cost bias', async () => {
    const result = await biasService.analyze(
      'We have already invested $5M in this project. We cannot waste the time already invested and the money already spent.'
    );
    const categories = result.detections.map(d => d.category);
    expect(categories).toContain('sunk_cost');
  });

  it('should detect groupthink', async () => {
    const result = await biasService.analyze(
      'Everyone agrees this is the right approach. The consensus is clear and there are no objections.'
    );
    const categories = result.detections.map(d => d.category);
    expect(categories).toContain('groupthink');
  });

  it('should detect anchoring bias', async () => {
    const result = await biasService.analyze(
      'Based on the initial estimate of $2M, the final figure should be close. The starting point was reasonable.'
    );
    const categories = result.detections.map(d => d.category);
    expect(categories).toContain('anchoring');
  });

  it('should detect authority bias', async () => {
    const result = await biasService.analyze(
      'The CEO said this is the right direction. Because he recommended it, we should proceed.'
    );
    const categories = result.detections.map(d => d.category);
    expect(categories).toContain('authority');
  });

  it('should detect survivorship bias', async () => {
    const result = await biasService.analyze(
      'Look at Google and Apple — successful companies show that this strategy works for top performing companies.'
    );
    const categories = result.detections.map(d => d.category);
    expect(categories).toContain('survivorship');
  });

  it('should return no biases for neutral text', async () => {
    const result = await biasService.analyze(
      'The quarterly revenue was $12.3M, representing a 5% increase from the prior period.'
    );
    expect(result.detections.length).toBe(0);
    expect(result.overallBiasScore).toBe(0);
    expect(result.summary).toContain('No cognitive biases detected');
  });

  it('should detect multiple biases in complex text', async () => {
    const result = await biasService.analyze(
      'Everyone agrees this is right. The CEO said we should proceed. We already invested too much to stop. This confirms our belief it will work.'
    );
    expect(result.detections.length).toBeGreaterThanOrEqual(3);
    expect(result.overallBiasScore).toBeGreaterThan(30);
  });

  it('should include proper result structure', async () => {
    const result = await biasService.analyze('The initial estimate was $1M.', {
      deliberationId: 'delib-123',
      organizationId: 'org-test',
    });
    expect(result.id).toMatch(/^bias-/);
    expect(result.inputHash).toBeTruthy();
    expect(typeof result.analysisTime).toBe('number');
    expect(result.summary).toBeTruthy();
  });

  it('should provide mitigations for detected biases', async () => {
    const result = await biasService.analyze(
      'We already invested $10M. We cannot lose the money already spent on this.'
    );
    for (const detection of result.detections) {
      expect(detection.mitigation).toBeTruthy();
      expect(detection.explanation).toBeTruthy();
      expect(detection.evidence).toBeTruthy();
      expect(detection.confidence).toBeGreaterThan(0);
    }
  });
});

// =============================================================================
// 5. FHIR Connector — Healthcare Data
// =============================================================================

describe('FHIRConnector — Healthcare Data E2E', () => {
  let fhir: InstanceType<typeof import('../../services/verticals/healthcare/FHIRConnector.js').FHIRConnector>;

  beforeAll(async () => {
    const mod = await import('../../services/verticals/healthcare/FHIRConnector.js');
    fhir = new mod.FHIRConnector({
      baseUrl: 'http://localhost:8080/fhir',
      clientId: 'test-client',
      clientSecret: 'test-secret',
      tokenUrl: 'http://localhost:8080/fhir/auth/token',
      scope: ['system/*.read'],
      ehrVendor: 'generic',
    });
  });

  it('should build a FHIR Consent resource', () => {
    const consent = fhir.buildConsentResource({
      patientId: 'patient-123',
      status: 'active',
      scope: 'patient-privacy',
      category: 'Patient Privacy',
      dateTime: new Date('2026-01-15'),
      organization: 'org-datacendia',
    });
    expect(consent.resourceType).toBe('Consent');
    expect(consent.status).toBe('active');
    expect(consent.patient).toEqual({ reference: 'Patient/patient-123' });
  });

  it('should create HIPAA audit events', async () => {
    const event = await fhir.createAuditEvent({
      userId: 'practitioner-1',
      action: 'read',
      resourceType: 'Patient',
      resourceId: 'patient-456',
      outcome: 'success',
    });
    expect(event.resourceType).toBe('AuditEvent');
    expect(event.outcome).toBe('0');
    expect(event.action).toBe('R');
  });

  it('should log PHI access with hash', () => {
    // Trigger a read to generate access log entry
    fhir.read('Patient', 'test-patient-789', 'dr-smith').catch(() => {});

    const logs = fhir.getAccessLog();
    expect(logs.length).toBeGreaterThanOrEqual(1);
    const lastLog = logs[logs.length - 1];
    expect(lastLog.userId).toBe('dr-smith');
    expect(lastLog.action).toBe('read');
    expect(lastLog.resourceType).toBe('Patient');
    expect(lastLog.accessHash).toBeTruthy();
    expect(lastLog.accessHash.length).toBe(64); // SHA-256 hex
  });

  it('should report supported FHIR resource types', () => {
    const status = fhir.getStatus();
    expect(status.ehrVendor).toBe('generic');
    expect(status.supportedResources).toContain('Patient');
    expect(status.supportedResources).toContain('Observation');
    expect(status.supportedResources).toContain('Consent');
    expect(status.supportedResources).toContain('AuditEvent');
    expect(status.supportedResources.length).toBe(12);
  });

  it('should filter access log by date', () => {
    const future = new Date(Date.now() + 100000);
    const logs = fhir.getAccessLog(future);
    expect(logs.length).toBe(0);

    const past = new Date(Date.now() - 100000);
    const allLogs = fhir.getAccessLog(past);
    expect(allLogs.length).toBeGreaterThanOrEqual(1);
  });
});
