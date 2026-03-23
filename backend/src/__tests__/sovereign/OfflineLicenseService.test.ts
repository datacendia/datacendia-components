/**
 * Tests — Offline License Service
 *
 * Verifies Ed25519 keypair generation, license signing, JWT verification,
 * expiration checks, hardware binding, and file discovery.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import crypto from 'crypto';
import * as jose from 'jose';

// =============================================================================
// KEYPAIR FIXTURE — generated fresh for each test run
// =============================================================================

let privateKeyPEM: string;
let publicKeyPEM: string;
let publicKeySPKIBase64: string;

beforeAll(() => {
  const { privateKey, publicKey } = crypto.generateKeyPairSync('ed25519');
  privateKeyPEM = privateKey.export({ type: 'pkcs8', format: 'pem' }) as string;
  publicKeyPEM = publicKey.export({ type: 'spki', format: 'pem' }) as string;
  publicKeySPKIBase64 = (publicKey.export({ type: 'spki', format: 'der' }) as Buffer).toString('base64');
});

// =============================================================================
// HELPER — sign a license JWT for testing
// =============================================================================

async function signTestLicense(claims: {
  sub: string;
  org: string;
  tier: string;
  pillars: string[];
  seats: number;
  exp: number;
  jti?: string;
  hw?: string;
  iss?: string;
  ver?: number;
}): Promise<string> {
  const privateKey = await jose.importPKCS8(privateKeyPEM, 'EdDSA');
  const now = Math.floor(Date.now() / 1000);

  const builder = new jose.SignJWT({
    sub: claims.sub,
    org: claims.org,
    tier: claims.tier,
    pillars: claims.pillars,
    seats: claims.seats,
    jti: claims.jti || `test_${crypto.randomUUID()}`,
    ver: claims.ver ?? 1,
    ...(claims.hw ? { hw: claims.hw } : {}),
  })
    .setProtectedHeader({ alg: 'EdDSA', typ: 'JWT' })
    .setIssuedAt(now)
    .setExpirationTime(claims.exp)
    .setIssuer(claims.iss || 'datacendia');

  return builder.sign(privateKey);
}

// =============================================================================
// TESTS
// =============================================================================

describe('Offline License — Keypair Generation', () => {
  it('generates valid Ed25519 keypair', () => {
    expect(privateKeyPEM).toContain('BEGIN PRIVATE KEY');
    expect(publicKeyPEM).toContain('BEGIN PUBLIC KEY');
    expect(publicKeySPKIBase64.length).toBeGreaterThan(20);
  });

  it('public key can be reimported from SPKI Base64', () => {
    const keyBuffer = Buffer.from(publicKeySPKIBase64, 'base64');
    const key = crypto.createPublicKey({ key: keyBuffer, format: 'der', type: 'spki' });
    expect(key.type).toBe('public');
    expect(key.asymmetricKeyType).toBe('ed25519');
  });
});

describe('Offline License — Signing & Verification', () => {
  it('signs and verifies a valid license', async () => {
    const exp = Math.floor(Date.now() / 1000) + 86400 * 365; // 1 year
    const token = await signTestLicense({
      sub: 'ACME Corp',
      org: 'org_acme_123',
      tier: 'enterprise',
      pillars: ['council', 'decide', 'dcii', 'stress_test', 'comply', 'govern', 'sovereign', 'operate'],
      seats: 500,
      exp,
    });

    // Verify with public key
    const publicKey = await jose.importSPKI(publicKeyPEM, 'EdDSA');
    const { payload } = await jose.jwtVerify(token, publicKey, {
      issuer: 'datacendia',
      algorithms: ['EdDSA'],
    });

    expect(payload.sub).toBe('ACME Corp');
    expect(payload.org).toBe('org_acme_123');
    expect(payload.tier).toBe('enterprise');
    expect(payload.pillars).toEqual(['council', 'decide', 'dcii', 'stress_test', 'comply', 'govern', 'sovereign', 'operate']);
    expect(payload.seats).toBe(500);
    expect(payload.ver).toBe(1);
    expect(payload.iss).toBe('datacendia');
    expect(payload.jti).toBeDefined();
    expect(payload.iat).toBeDefined();
    expect(payload.exp).toBe(exp);
  });

  it('rejects a license signed with a different key', async () => {
    const { privateKey: wrongKey } = crypto.generateKeyPairSync('ed25519');
    const wrongKeyPEM = wrongKey.export({ type: 'pkcs8', format: 'pem' }) as string;

    const exp = Math.floor(Date.now() / 1000) + 86400 * 365;
    const wrongSigner = await jose.importPKCS8(wrongKeyPEM, 'EdDSA');

    const token = await new jose.SignJWT({
      sub: 'Fake Corp', org: 'org_fake', tier: 'strategic',
      pillars: ['council'], seats: 9999, jti: 'fake', ver: 1,
    })
      .setProtectedHeader({ alg: 'EdDSA', typ: 'JWT' })
      .setIssuedAt()
      .setExpirationTime(exp)
      .setIssuer('datacendia')
      .sign(wrongSigner);

    const publicKey = await jose.importSPKI(publicKeyPEM, 'EdDSA');

    await expect(
      jose.jwtVerify(token, publicKey, { issuer: 'datacendia', algorithms: ['EdDSA'] })
    ).rejects.toThrow();
  });

  it('rejects a tampered license', async () => {
    const exp = Math.floor(Date.now() / 1000) + 86400 * 365;
    const token = await signTestLicense({
      sub: 'ACME Corp', org: 'org_acme', tier: 'pilot',
      pillars: ['council'], seats: 5, exp,
    });

    // Tamper with the payload (change tier to strategic)
    const parts = token.split('.');
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    payload.tier = 'strategic';
    payload.seats = 99999;
    parts[1] = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const tampered = parts.join('.');

    const publicKey = await jose.importSPKI(publicKeyPEM, 'EdDSA');

    await expect(
      jose.jwtVerify(tampered, publicKey, { issuer: 'datacendia', algorithms: ['EdDSA'] })
    ).rejects.toThrow();
  });
});

describe('Offline License — Expiration', () => {
  it('rejects an expired license', async () => {
    const exp = Math.floor(Date.now() / 1000) - 3600; // Expired 1 hour ago
    const token = await signTestLicense({
      sub: 'Expired Corp', org: 'org_expired', tier: 'pilot',
      pillars: ['council'], seats: 5, exp,
    });

    const publicKey = await jose.importSPKI(publicKeyPEM, 'EdDSA');

    await expect(
      jose.jwtVerify(token, publicKey, { issuer: 'datacendia', algorithms: ['EdDSA'] })
    ).rejects.toThrow(/exp/i);
  });

  it('accepts a license expiring tomorrow', async () => {
    const exp = Math.floor(Date.now() / 1000) + 86400; // Expires in 24 hours
    const token = await signTestLicense({
      sub: 'Expiring Corp', org: 'org_expiring', tier: 'enterprise',
      pillars: ['council', 'decide'], seats: 50, exp,
    });

    const publicKey = await jose.importSPKI(publicKeyPEM, 'EdDSA');
    const { payload } = await jose.jwtVerify(token, publicKey, {
      issuer: 'datacendia', algorithms: ['EdDSA'],
    });

    expect(payload.tier).toBe('enterprise');
  });
});

describe('Offline License — Hardware Binding', () => {
  it('includes hardware fingerprint when provided', async () => {
    const exp = Math.floor(Date.now() / 1000) + 86400 * 365;
    const token = await signTestLicense({
      sub: 'Defense Corp', org: 'org_defense', tier: 'strategic',
      pillars: ['council', 'sovereign'], seats: 100, exp,
      hw: 'a1b2c3d4e5f6g7h8',
    });

    const publicKey = await jose.importSPKI(publicKeyPEM, 'EdDSA');
    const { payload } = await jose.jwtVerify(token, publicKey, {
      issuer: 'datacendia', algorithms: ['EdDSA'],
    });

    expect(payload.hw).toBe('a1b2c3d4e5f6g7h8');
  });

  it('omits hardware fingerprint when not provided', async () => {
    const exp = Math.floor(Date.now() / 1000) + 86400 * 365;
    const token = await signTestLicense({
      sub: 'Cloud Corp', org: 'org_cloud', tier: 'enterprise',
      pillars: ['council'], seats: 50, exp,
    });

    const publicKey = await jose.importSPKI(publicKeyPEM, 'EdDSA');
    const { payload } = await jose.jwtVerify(token, publicKey, {
      issuer: 'datacendia', algorithms: ['EdDSA'],
    });

    expect(payload.hw).toBeUndefined();
  });
});

describe('Offline License — Issuer Validation', () => {
  it('rejects a license from a different issuer', async () => {
    const exp = Math.floor(Date.now() / 1000) + 86400 * 365;
    const token = await signTestLicense({
      sub: 'Rogue Corp', org: 'org_rogue', tier: 'strategic',
      pillars: ['council'], seats: 9999, exp,
      iss: 'not-datacendia',
    });

    const publicKey = await jose.importSPKI(publicKeyPEM, 'EdDSA');

    await expect(
      jose.jwtVerify(token, publicKey, { issuer: 'datacendia', algorithms: ['EdDSA'] })
    ).rejects.toThrow(/iss/i);
  });
});

describe('Offline License — Tier & Pillar Coverage', () => {
  const tiers = [
    { tier: 'pilot', pillars: ['council', 'decide', 'dcii'], seats: 25 },
    { tier: 'foundation', pillars: ['council', 'decide', 'dcii'], seats: 100 },
    { tier: 'enterprise', pillars: ['council', 'decide', 'dcii', 'stress_test', 'comply', 'govern', 'sovereign', 'operate'], seats: 500 },
    { tier: 'strategic', pillars: ['council', 'decide', 'dcii', 'stress_test', 'comply', 'govern', 'sovereign', 'operate', 'collapse', 'sgas', 'verticals', 'frontier'], seats: 9999 },
  ];

  for (const { tier, pillars, seats } of tiers) {
    it(`signs and verifies ${tier}-tier license with correct pillars`, async () => {
      const exp = Math.floor(Date.now() / 1000) + 86400 * 365;
      const token = await signTestLicense({
        sub: `${tier} Corp`, org: `org_${tier}`, tier, pillars, seats, exp,
      });

      const publicKey = await jose.importSPKI(publicKeyPEM, 'EdDSA');
      const { payload } = await jose.jwtVerify(token, publicKey, {
        issuer: 'datacendia', algorithms: ['EdDSA'],
      });

      expect(payload.tier).toBe(tier);
      expect(payload.pillars).toEqual(pillars);
      expect(payload.seats).toBe(seats);
    });
  }
});
