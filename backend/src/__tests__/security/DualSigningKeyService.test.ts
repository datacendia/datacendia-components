// =============================================================================
// DualSigningKeyService — key disclosure and signing correctness
// =============================================================================
// Three defects shipped together on main:
//
//   1. Both signing private keys and the master seed were written to the log at
//      WARN level on every boot that did not already have a persisted key. This
//      was not gated behind a log level -- warn is on by default nearly
//      everywhere -- and the original comment described it as a feature
//      ("Log the private keys for first-boot persistence").
//
//   2. ml_dsa65.sign() / verify() were called with their arguments reversed,
//      so the post-quantum half of "dual signing" threw rather than signing.
//
//   3. loadDilithiumKey() ran keygen() over a hash of the supplied secret key,
//      returning an unrelated key pair instead of loading the one provided.
//
// The log assertion is the one that matters most: a signing key written to a
// log stream is a signing key anyone with log access can forge with.
// =============================================================================

import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { ml_dsa65 } from '@noble/post-quantum/ml-dsa.js';

// Fixed seed; a test vector, not a secret.
const TEST_SEED = 'b'.repeat(128);

// Captured before anything is mutated so the whole set can be restored in
// afterAll(). Vitest isolates files by default, but that is a configuration
// choice rather than a guarantee -- under `isolate: false`, or any pool sharing
// a process, unrestored env mutations would leak into unrelated suites.
const MUTATED_ENV_KEYS = [
  'CENDIA_ED25519_PRIVATE_KEY',
  'CENDIA_DILITHIUM_PRIVATE_KEY',
  'CENDIA_MASTER_SEED',
] as const;

const ORIGINAL_ENV: Partial<Record<(typeof MUTATED_ENV_KEYS)[number], string | undefined>> = {};
for (const key of MUTATED_ENV_KEYS) {
  ORIGINAL_ENV[key] = process.env[key];
}

afterAll(() => {
  for (const key of MUTATED_ENV_KEYS) {
    const original = ORIGINAL_ENV[key];
    if (original === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = original;
    }
  }
  vi.restoreAllMocks();
});

describe('DualSigningKeyService — key disclosure', () => {
  let logged: string[];
  let svc: any;

  beforeAll(async () => {
    delete process.env.CENDIA_ED25519_PRIVATE_KEY;
    delete process.env.CENDIA_DILITHIUM_PRIVATE_KEY;
    process.env.CENDIA_MASTER_SEED = TEST_SEED;

    const { logger } = await import('../../utils/logger.js');
    logged = [];
    const capture = (...args: unknown[]) => { logged.push(args.map(String).join(' ')); };
    for (const level of ['debug', 'info', 'warn', 'error'] as const) {
      vi.spyOn(logger, level).mockImplementation(capture as never);
    }

    // The class in DualSigningKeyService.ts is named KeyManagementService.
    const { KeyManagementService } = await import('../../services/crypto/DualSigningKeyService.js');
    svc = KeyManagementService.getInstance();
    await svc.initialize();
  });

  it('captured log output at all (guards against a vacuous pass)', () => {
    expect(logged.length).toBeGreaterThan(0);
    expect(logged.join('\n')).toMatch(/Fingerprint/);
  });

  it('never writes private keys or the master seed to the log', () => {
    const all = logged.join('\n');
    expect(all).not.toMatch(/CENDIA_ED25519_PRIVATE_KEY=[0-9a-f]/i);
    expect(all).not.toMatch(/CENDIA_DILITHIUM_PRIVATE_KEY=[0-9a-f]/i);
    expect(all).not.toMatch(/CENDIA_MASTER_SEED=[0-9a-f]/i);
    expect(all).not.toContain(TEST_SEED);
  });

  it('dual-signs and rejects a tampered message', async () => {
    const msg = new TextEncoder().encode('components evidence receipt');
    const sig = await svc.sign(msg);

    const good = svc.verify(msg, sig);
    expect(good.dilithiumValid).toBe(true);
    expect(good.valid).toBe(true);

    const bad = svc.verify(new TextEncoder().encode('tampered'), sig);
    expect(bad.valid).toBe(false);
  });
});

describe('ML-DSA-65 contract and key round-trip', () => {
  it('uses sign(message, secretKey) and verify(signature, message, publicKey)', () => {
    const kp = ml_dsa65.keygen(new Uint8Array(32).fill(4));
    const msg = new TextEncoder().encode('x');
    const sig = ml_dsa65.sign(msg, kp.secretKey);

    expect(ml_dsa65.verify(sig, msg, kp.publicKey)).toBe(true);
    expect(() => ml_dsa65.sign(kp.secretKey as never, msg as never)).toThrow();
    expect(() => ml_dsa65.verify(kp.publicKey as never, msg, sig as never)).toThrow();
  });

  it('recovers the stored public key instead of deriving a new pair', () => {
    const kp = ml_dsa65.keygen(new Uint8Array(32).fill(4));
    expect(Buffer.from(ml_dsa65.getPublicKey(kp.secretKey))).toEqual(Buffer.from(kp.publicKey));
  });

  it('pins the FIPS 204 sizes', () => {
    const kp = ml_dsa65.keygen(new Uint8Array(32).fill(4));
    expect(kp.publicKey.length).toBe(1952);
    expect(kp.secretKey.length).toBe(4032);
    expect(ml_dsa65.sign(new TextEncoder().encode('x'), kp.secretKey).length).toBe(3309);
  });
});
