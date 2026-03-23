#!/usr/bin/env tsx
/**
 * CLI Tool — Generate Offline License Files
 *
 * Generates cryptographically signed .dcl license files for air-gapped deployments.
 * This tool is for Datacendia internal use only — run at HQ, never on customer machines.
 *
 * Usage:
 *   # First time: generate a keypair
 *   tsx scripts/generate-offline-license.ts --generate-keys
 *
 *   # Sign a license
 *   tsx scripts/generate-offline-license.ts \
 *     --org "org_abc123" \
 *     --name "ACME Defense Corp" \
 *     --tier enterprise \
 *     --seats 500 \
 *     --months 12 \
 *     --output ./acme-defense.dcl
 *
 *   # Sign a hardware-bound license
 *   tsx scripts/generate-offline-license.ts \
 *     --org "org_abc123" \
 *     --name "ACME Defense Corp" \
 *     --tier strategic \
 *     --seats 9999 \
 *     --months 12 \
 *     --hardware "a1b2c3d4e5f6g7h8" \
 *     --output ./acme-defense.dcl
 *
 *   # Verify an existing license file
 *   tsx scripts/generate-offline-license.ts --verify ./acme-defense.dcl
 *
 * @module scripts/generate-offline-license
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import * as jose from 'jose';

// =============================================================================
// CONFIGURATION
// =============================================================================

const KEYS_DIR = path.resolve(__dirname, '..', '.keys');
const PRIVATE_KEY_PATH = path.join(KEYS_DIR, 'license-signing.key');
const PUBLIC_KEY_PATH = path.join(KEYS_DIR, 'license-signing.pub');
const PUBLIC_KEY_SPKI_PATH = path.join(KEYS_DIR, 'license-signing.spki.b64');

// Tier → pillar mappings (must match licensing.service.ts)
const TIER_PILLARS: Record<string, string[]> = {
  pilot: ['council', 'decide', 'dcii'],
  foundation: ['council', 'decide', 'dcii'],
  enterprise: ['council', 'decide', 'dcii', 'stress_test', 'comply', 'govern', 'sovereign', 'operate'],
  strategic: ['council', 'decide', 'dcii', 'stress_test', 'comply', 'govern', 'sovereign', 'operate', 'collapse', 'sgas', 'verticals', 'frontier'],
  custom: ['council', 'decide', 'dcii', 'stress_test', 'comply', 'govern', 'sovereign', 'operate', 'collapse', 'sgas', 'verticals', 'frontier'],
};

// =============================================================================
// KEYPAIR GENERATION
// =============================================================================

async function generateKeys(): Promise<void> {
  console.log('Generating Ed25519 keypair for license signing...\n');

  // Create .keys directory (gitignored)
  if (!fs.existsSync(KEYS_DIR)) {
    fs.mkdirSync(KEYS_DIR, { recursive: true });
  }

  // Check if keys already exist
  if (fs.existsSync(PRIVATE_KEY_PATH)) {
    console.error(`ERROR: Private key already exists at ${PRIVATE_KEY_PATH}`);
    console.error('Delete it manually if you want to regenerate (this will invalidate ALL existing licenses).');
    process.exit(1);
  }

  const { privateKey, publicKey } = crypto.generateKeyPairSync('ed25519');

  const privateKeyPEM = privateKey.export({ type: 'pkcs8', format: 'pem' }) as string;
  const publicKeyPEM = publicKey.export({ type: 'spki', format: 'pem' }) as string;
  const publicKeySPKIBase64 = (publicKey.export({ type: 'spki', format: 'der' }) as Buffer).toString('base64');

  // Write files
  fs.writeFileSync(PRIVATE_KEY_PATH, privateKeyPEM, { mode: 0o600 });
  fs.writeFileSync(PUBLIC_KEY_PATH, publicKeyPEM);
  fs.writeFileSync(PUBLIC_KEY_SPKI_PATH, publicKeySPKIBase64);

  // Ensure .keys is gitignored
  const gitignorePath = path.join(KEYS_DIR, '.gitignore');
  fs.writeFileSync(gitignorePath, '# Never commit private keys\n*.key\n');

  console.log('Keys generated successfully:\n');
  console.log(`  Private key: ${PRIVATE_KEY_PATH}`);
  console.log(`  Public key:  ${PUBLIC_KEY_PATH}`);
  console.log(`  SPKI Base64: ${PUBLIC_KEY_SPKI_PATH}\n`);
  console.log('IMPORTANT:');
  console.log('  1. The private key MUST be kept secret. Never share it, never commit it.');
  console.log('  2. Back up the private key securely (hardware security module, vault, etc.).');
  console.log('  3. Set this environment variable on customer deployments:\n');
  console.log(`     DATACENDIA_LICENSE_PUBLIC_KEY=${publicKeySPKIBase64}\n`);
  console.log('  4. Or embed the public key directly in OfflineLicenseService.ts for compiled builds.\n');
}

// =============================================================================
// LICENSE SIGNING
// =============================================================================

async function signLicense(options: {
  org: string;
  name: string;
  tier: string;
  seats: number;
  months: number;
  hardware?: string;
  output: string;
  pillars?: string[];
}): Promise<void> {
  // Load private key
  if (!fs.existsSync(PRIVATE_KEY_PATH)) {
    console.error('ERROR: No private key found. Run with --generate-keys first.');
    process.exit(1);
  }

  const privateKeyPEM = fs.readFileSync(PRIVATE_KEY_PATH, 'utf-8');
  const privateKey = await jose.importPKCS8(privateKeyPEM, 'EdDSA');

  // Build payload
  const now = Math.floor(Date.now() / 1000);
  const exp = now + (options.months * 30 * 24 * 60 * 60);
  const tier = options.tier as keyof typeof TIER_PILLARS;
  const pillars = options.pillars || TIER_PILLARS[tier] || TIER_PILLARS['pilot'];
  const jti = `dcl_${crypto.randomUUID()}`;

  const claims: Record<string, unknown> = {
    sub: options.name,
    org: options.org,
    tier: options.tier,
    pillars,
    seats: options.seats,
    jti,
    ver: 1,
  };

  if (options.hardware) {
    claims['hw'] = options.hardware;
  }

  // Sign the JWT
  const jwt = await new jose.SignJWT(claims)
    .setProtectedHeader({ alg: 'EdDSA', typ: 'JWT' })
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .setIssuer('datacendia')
    .sign(privateKey);

  // Write the license file
  const outputPath = path.resolve(options.output);
  fs.writeFileSync(outputPath, jwt, 'utf-8');

  console.log('License file generated successfully:\n');
  console.log(`  File:         ${outputPath}`);
  console.log(`  License ID:   ${jti}`);
  console.log(`  Organization: ${options.name} (${options.org})`);
  console.log(`  Tier:         ${options.tier}`);
  console.log(`  Pillars:      ${pillars.join(', ')}`);
  console.log(`  Seats:        ${options.seats}`);
  console.log(`  Duration:     ${options.months} months`);
  console.log(`  Issued:       ${new Date(now * 1000).toISOString()}`);
  console.log(`  Expires:      ${new Date(exp * 1000).toISOString()}`);
  if (options.hardware) {
    console.log(`  Hardware:     ${options.hardware} (hardware-bound)`);
  }
  console.log(`\nDeliver this file to the customer via secure channel (USB, encrypted transfer).`);
  console.log(`Customer places it at: /etc/datacendia/license.dcl (or sets DATACENDIA_LICENSE_FILE env var)`);
}

// =============================================================================
// LICENSE VERIFICATION
// =============================================================================

async function verifyLicense(filePath: string): Promise<void> {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    console.error(`ERROR: License file not found: ${resolved}`);
    process.exit(1);
  }

  // Load public key
  let publicKeyPEM: string;
  if (fs.existsSync(PUBLIC_KEY_PATH)) {
    publicKeyPEM = fs.readFileSync(PUBLIC_KEY_PATH, 'utf-8');
  } else if (process.env['DATACENDIA_LICENSE_PUBLIC_KEY']) {
    const keyBuffer = Buffer.from(process.env['DATACENDIA_LICENSE_PUBLIC_KEY'], 'base64');
    const keyObj = crypto.createPublicKey({ key: keyBuffer, format: 'der', type: 'spki' });
    publicKeyPEM = keyObj.export({ type: 'spki', format: 'pem' }) as string;
  } else {
    console.error('ERROR: No public key found. Need .keys/license-signing.pub or DATACENDIA_LICENSE_PUBLIC_KEY env var.');
    process.exit(1);
  }

  const token = fs.readFileSync(resolved, 'utf-8').trim();
  const publicKey = await jose.importSPKI(publicKeyPEM, 'EdDSA');

  try {
    const { payload } = await jose.jwtVerify(token, publicKey, {
      issuer: 'datacendia',
      algorithms: ['EdDSA'],
    });

    const now = Math.floor(Date.now() / 1000);
    const exp = payload.exp as number;
    const daysRemaining = Math.ceil((exp - now) / 86400);

    console.log('License verification: VALID\n');
    console.log(`  License ID:   ${payload.jti}`);
    console.log(`  Organization: ${payload.sub} (${payload.org})`);
    console.log(`  Tier:         ${payload.tier}`);
    console.log(`  Pillars:      ${(payload.pillars as string[]).join(', ')}`);
    console.log(`  Seats:        ${payload.seats}`);
    console.log(`  Issued:       ${new Date((payload.iat as number) * 1000).toISOString()}`);
    console.log(`  Expires:      ${new Date(exp * 1000).toISOString()} (${daysRemaining} days remaining)`);
    console.log(`  Version:      ${payload.ver}`);
    if (payload.hw) {
      console.log(`  Hardware:     ${payload.hw} (hardware-bound)`);
    }

    if (daysRemaining <= 0) {
      console.log('\n  WARNING: This license has EXPIRED.');
    } else if (daysRemaining <= 30) {
      console.log(`\n  WARNING: This license expires in ${daysRemaining} days.`);
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`License verification: FAILED\n`);
    console.error(`  Error: ${msg}`);
    process.exit(1);
  }
}

// =============================================================================
// CLI PARSER
// =============================================================================

function printUsage(): void {
  console.log(`
Datacendia Offline License Generator

Usage:
  tsx scripts/generate-offline-license.ts --generate-keys
  tsx scripts/generate-offline-license.ts --sign [options]
  tsx scripts/generate-offline-license.ts --verify <file>

Commands:
  --generate-keys              Generate Ed25519 signing keypair
  --verify <file>              Verify an existing .dcl license file

Sign options:
  --org <id>                   Organization ID (required)
  --name <name>                Organization name (required)
  --tier <tier>                License tier: pilot|foundation|enterprise|strategic|custom (required)
  --seats <n>                  Maximum named seats (default: 50)
  --months <n>                 License duration in months (default: 12)
  --hardware <fingerprint>     Hardware-bind to this fingerprint (optional)
  --output <path>              Output .dcl file path (default: ./license.dcl)
  --pillars <p1,p2,...>        Override pillars (comma-separated, optional)
`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printUsage();
    process.exit(0);
  }

  if (args.includes('--generate-keys')) {
    await generateKeys();
    return;
  }

  if (args.includes('--verify')) {
    const idx = args.indexOf('--verify');
    const file = args[idx + 1];
    if (!file) {
      console.error('ERROR: --verify requires a file path');
      process.exit(1);
    }
    await verifyLicense(file);
    return;
  }

  // Default: sign a license
  function getArg(name: string): string | undefined {
    const idx = args.indexOf(name);
    return idx >= 0 ? args[idx + 1] : undefined;
  }

  const org = getArg('--org');
  const name = getArg('--name');
  const tier = getArg('--tier');

  if (!org || !name || !tier) {
    console.error('ERROR: --org, --name, and --tier are required for signing.');
    printUsage();
    process.exit(1);
  }

  const seats = parseInt(getArg('--seats') || '50', 10);
  const months = parseInt(getArg('--months') || '12', 10);
  const hardware = getArg('--hardware');
  const output = getArg('--output') || './license.dcl';
  const pillarsStr = getArg('--pillars');
  const pillars = pillarsStr ? pillarsStr.split(',').map(s => s.trim()) : undefined;

  await signLicense({ org, name, tier, seats, months, hardware, output, pillars });
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
