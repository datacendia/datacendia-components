// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * GROTH16 ZERO-KNOWLEDGE PROOF SERVICE
 * =============================================================================
 *
 * IMPLEMENTATION STATUS: REAL Groth16 proofs via snarkjs
 *
 * This service provides real circuit-based zero-knowledge proofs using
 * the Groth16 proving system on the BN128 (alt_bn128) elliptic curve.
 *
 * WHAT IS REAL:
 * - Powers of Tau trusted setup ceremony (pre-generated)
 * - R1CS constraint system (multiplication gate circuit)
 * - Real Groth16 proving (creates pi_a, pi_b, pi_c elliptic curve points)
 * - Real Groth16 verification (pairing check on BN128)
 * - Pre-generated artifacts: circuit.r1cs, circuit_final.zkey, verification_key.json
 *
 * CIRCUIT: Commitment Proof (a * b == publicProduct)
 * - Prover demonstrates knowledge of private factors (a, b)
 *   whose product equals a public commitment value
 * - For compliance: a = witness_hash, b = blinding_factor,
 *   publicProduct = commitment posted on-chain or in audit log
 *
 * UPGRADE PATH:
 * - More complex circuits (SHA256 preimage, range proofs, Merkle membership)
 *   require the circom compiler to generate WASM witness calculators
 * - Current circuit uses hand-built R1CS + witness for the multiplication gate
 * =============================================================================
 */

import * as snarkjs from 'snarkjs';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { logger } from '../../../utils/logger.js';

// Resolve artifacts dir relative to project root (works in both ESM and CJS)
const ARTIFACTS_DIR = path.resolve(
  process.cwd(), 'src', 'services', 'security', 'groth16', 'artifacts'
);

// BN128 prime field order
const BN128_PRIME = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;

// ============================================================================
// TYPES
// ============================================================================

export interface Groth16Proof {
  id: string;
  protocol: 'groth16';
  curve: 'bn128';
  proof: {
    pi_a: string[];
    pi_b: string[][];
    pi_c: string[];
  };
  publicSignals: string[];
  commitment: string;
  createdAt: Date;
  proofHex: string;
}

export interface Groth16VerificationResult {
  valid: boolean;
  protocol: 'groth16';
  curve: 'bn128';
  publicSignals: string[];
  verifiedAt: Date;
  verificationTimeMs: number;
}

export interface CommitmentInput {
  witnessValue: bigint;
  blindingFactor: bigint;
}

// ============================================================================
// SERVICE
// ============================================================================

class Groth16ProofService {
  private verificationKey: any = null;
  private zkeyPath: string;
  private initialized = false;
  private proofs: Map<string, Groth16Proof> = new Map();

  constructor() {
    this.zkeyPath = path.join(ARTIFACTS_DIR, 'circuit_final.zkey');
    logger.info('[Groth16] Groth16 Proof Service initialized (snarkjs, BN128 curve)');
  }

  /**
   * Load verification key and validate artifacts exist.
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    const vkPath = path.join(ARTIFACTS_DIR, 'verification_key.json');
    if (!fs.existsSync(vkPath)) {
      throw new Error(
        'Groth16 artifacts not found. Run: node src/services/security/groth16/build-circuit.mjs'
      );
    }
    if (!fs.existsSync(this.zkeyPath)) {
      throw new Error('Groth16 zkey not found. Regenerate artifacts.');
    }

    this.verificationKey = JSON.parse(fs.readFileSync(vkPath, 'utf8'));
    this.initialized = true;
    logger.info('[Groth16] Artifacts loaded — verification key and proving key ready');
  }

  /**
   * Create a commitment from private witness data.
   * commitment = witnessValue * blindingFactor (mod BN128 prime)
   *
   * The prover will later prove they know (witnessValue, blindingFactor)
   * without revealing either value.
   */
  createCommitment(input: CommitmentInput): { commitment: bigint; commitmentHex: string } {
    const commitment = (input.witnessValue * input.blindingFactor) % BN128_PRIME;
    return {
      commitment,
      commitmentHex: commitment.toString(16).padStart(64, '0'),
    };
  }

  /**
   * Derive a field element from arbitrary data (e.g., decision hash, compliance claim).
   * Maps bytes to a BN128 field element via SHA-256 truncation.
   */
  deriveFieldElement(data: string | Buffer): bigint {
    const hash = crypto.createHash('sha256')
      .update(typeof data === 'string' ? data : data)
      .digest();

    // Read 31 bytes (248 bits) to stay safely within BN128 field
    let value = 0n;
    for (let i = 0; i < 31; i++) {
      value |= BigInt(hash[i]!) << BigInt(i * 8);
    }
    return value % BN128_PRIME;
  }

  /**
   * Generate a Groth16 proof that the prover knows private factors (a, b)
   * whose product equals the public commitment.
   *
   * This is a REAL zero-knowledge proof — the verifier learns nothing
   * about a or b, only that a*b == publicProduct.
   */
  async prove(input: CommitmentInput): Promise<Groth16Proof> {
    await this.initialize();

    const a = input.witnessValue % BN128_PRIME;
    const b = input.blindingFactor % BN128_PRIME;
    const publicProduct = (a * b) % BN128_PRIME;

    // Build witness binary (WTNS format)
    const wtnsBuffer = this.buildWitness(a, b, publicProduct);
    const tmpWtns = path.join(ARTIFACTS_DIR, `witness_${Date.now()}.wtns`);

    try {
      fs.writeFileSync(tmpWtns, wtnsBuffer);

      // Generate real Groth16 proof
      const startTime = performance.now();
      const { proof, publicSignals } = await snarkjs.groth16.prove(
        this.zkeyPath, tmpWtns
      );
      const proveTime = performance.now() - startTime;

      const proofId = `groth16-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
      const proofHex = Buffer.from(JSON.stringify(proof)).toString('hex');

      const groth16Proof: Groth16Proof = {
        id: proofId,
        protocol: 'groth16',
        curve: 'bn128',
        proof: {
          pi_a: proof.pi_a,
          pi_b: proof.pi_b,
          pi_c: proof.pi_c,
        },
        publicSignals,
        commitment: publicProduct.toString(),
        createdAt: new Date(),
        proofHex,
      };

      this.proofs.set(proofId, groth16Proof);

      logger.info(`[Groth16] Proof ${proofId} generated in ${proveTime.toFixed(1)}ms — publicSignals: [${publicSignals}]`);
      return groth16Proof;
    } finally {
      // Clean up temp witness file
      if (fs.existsSync(tmpWtns)) fs.unlinkSync(tmpWtns);
    }
  }

  /**
   * Verify a Groth16 proof using the pairing check on BN128.
   * This is a REAL cryptographic verification — e(pi_a, pi_b) == e(alpha, beta) * e(pub, gamma) * e(pi_c, delta)
   */
  async verify(proofId: string): Promise<Groth16VerificationResult>;
  async verify(proof: Groth16Proof): Promise<Groth16VerificationResult>;
  async verify(proofOrId: string | Groth16Proof): Promise<Groth16VerificationResult> {
    await this.initialize();

    const proof = typeof proofOrId === 'string' ? this.proofs.get(proofOrId) : proofOrId;
    if (!proof) {
      return {
        valid: false,
        protocol: 'groth16',
        curve: 'bn128',
        publicSignals: [],
        verifiedAt: new Date(),
        verificationTimeMs: 0,
      };
    }

    const startTime = performance.now();
    const snarkProof = {
      pi_a: proof.proof.pi_a,
      pi_b: proof.proof.pi_b,
      pi_c: proof.proof.pi_c,
      protocol: 'groth16',
      curve: 'bn128',
    };

    const valid = await snarkjs.groth16.verify(
      this.verificationKey,
      proof.publicSignals,
      snarkProof
    );
    const verifyTime = performance.now() - startTime;

    logger.info(`[Groth16] Proof ${proof.id} verification: ${valid ? 'VALID' : 'INVALID'} (${verifyTime.toFixed(1)}ms)`);

    return {
      valid,
      protocol: 'groth16',
      curve: 'bn128',
      publicSignals: proof.publicSignals,
      verifiedAt: new Date(),
      verificationTimeMs: verifyTime,
    };
  }

  /**
   * High-level: Prove a compliance claim without revealing private witness data.
   *
   * 1. Derives a field element from the claim string
   * 2. Generates a random blinding factor
   * 3. Creates commitment = claim_hash * blinding
   * 4. Generates Groth16 proof of knowledge of (claim_hash, blinding)
   *
   * The verifier sees only the commitment (public product) and the proof,
   * but learns nothing about the actual claim data.
   */
  async proveComplianceClaim(claim: string): Promise<{
    proof: Groth16Proof;
    commitment: string;
    blindingFactor: string;
  }> {
    const witnessValue = this.deriveFieldElement(claim);
    const blindingBytes = crypto.randomBytes(31);
    let blindingFactor = 0n;
    for (let i = 0; i < 31; i++) {
      blindingFactor |= BigInt(blindingBytes[i]!) << BigInt(i * 8);
    }
    blindingFactor = blindingFactor % BN128_PRIME;
    if (blindingFactor === 0n) blindingFactor = 1n;

    const proof = await this.prove({ witnessValue, blindingFactor });

    return {
      proof,
      commitment: proof.commitment,
      blindingFactor: blindingFactor.toString(16).padStart(64, '0'),
    };
  }

  /**
   * Get a proof by ID.
   */
  getProof(id: string): Groth16Proof | undefined {
    return this.proofs.get(id);
  }

  /**
   * Export a proof and its verification key as a self-contained JSON bundle
   * that any external verifier with snarkjs can independently verify.
   *
   * This is critical for regulator/auditor verification without access
   * to the Datacendia platform.
   */
  async exportProofForVerifier(proofId: string): Promise<{
    version: string;
    protocol: 'groth16';
    curve: 'bn128';
    proof: Groth16Proof['proof'];
    publicSignals: string[];
    verificationKey: any;
    exportedAt: string;
    verifyCommand: string;
    fipsCompliance: {
      nistStatus: string;
      curveStandard: string;
      pairingType: string;
    };
  } | null> {
    await this.initialize();
    const proof = this.proofs.get(proofId);
    if (!proof) return null;

    return {
      version: '1.0.0',
      protocol: 'groth16',
      curve: 'bn128',
      proof: proof.proof,
      publicSignals: proof.publicSignals,
      verificationKey: this.verificationKey,
      exportedAt: new Date().toISOString(),
      verifyCommand: 'npx snarkjs groth16 verify verification_key.json public.json proof.json',
      fipsCompliance: {
        nistStatus: 'BN128 is NOT NIST-approved; used for ZK proofs only, not for key exchange or signatures',
        curveStandard: 'alt_bn128 (EIP-196/197), widely used in Ethereum and ZK-rollup ecosystems',
        pairingType: 'Type III pairing (Ate pairing on BN curves)',
      },
    };
  }

  /**
   * Get service status.
   */
  async getStatus(): Promise<{
    initialized: boolean;
    artifactsPresent: boolean;
    protocol: string;
    curve: string;
    proofCount: number;
    fipsCompliance: {
      pqSignatures: string;
      zkProofs: string;
      classicalCrypto: string;
    };
  }> {
    const vkExists = fs.existsSync(path.join(ARTIFACTS_DIR, 'verification_key.json'));
    const zkeyExists = fs.existsSync(this.zkeyPath);

    return {
      initialized: this.initialized,
      artifactsPresent: vkExists && zkeyExists,
      protocol: 'groth16',
      curve: 'bn128',
      proofCount: this.proofs.size,
      fipsCompliance: {
        pqSignatures: 'ML-DSA (FIPS 204 draft) + SLH-DSA (FIPS 205 draft) via @noble/post-quantum',
        zkProofs: 'Groth16 on BN128 — industry standard for ZK circuits, not NIST-standardized',
        classicalCrypto: 'AES-256-GCM (FIPS 197), SHA-256 (FIPS 180-4), RSA-2048+ (FIPS 186-5)',
      },
    };
  }

  // ==========================================================================
  // PRIVATE: Witness Builder
  // ==========================================================================

  /**
   * Build WTNS (witness) binary for the multiplication circuit.
   * Wire layout: 0=ONE, 1=publicProduct, 2=a, 3=b
   */
  private buildWitness(a: bigint, b: bigint, publicProduct: bigint): Buffer {
    const parts: Buffer[] = [];

    const writeU32 = (v: number) => { const b = Buffer.alloc(4); b.writeUInt32LE(v); parts.push(b); };
    const writeU64 = (v: bigint) => { const b = Buffer.alloc(8); b.writeBigUInt64LE(v); parts.push(b); };
    const writeField = (v: bigint) => {
      const buf = Buffer.alloc(32);
      let val = v;
      for (let i = 0; i < 32; i++) { buf[i] = Number(val & 0xFFn); val >>= 8n; }
      parts.push(buf);
    };

    // Magic "wtns"
    parts.push(Buffer.from([0x77, 0x74, 0x6e, 0x73]));
    writeU32(2);  // version
    writeU32(2);  // nSections

    // Section 1: Header
    const hParts: Buffer[] = [];
    const hU32 = (v: number) => { const b = Buffer.alloc(4); b.writeUInt32LE(v); hParts.push(b); };
    const hField = (v: bigint) => {
      const buf = Buffer.alloc(32);
      let val = v;
      for (let i = 0; i < 32; i++) { buf[i] = Number(val & 0xFFn); val >>= 8n; }
      hParts.push(buf);
    };
    hU32(32);
    hField(BN128_PRIME);
    hU32(4);

    const hBuf = Buffer.concat(hParts);
    writeU32(1);
    writeU64(BigInt(hBuf.length));
    parts.push(hBuf);

    // Section 2: Witness values
    const wParts: Buffer[] = [];
    const wField = (v: bigint) => {
      const buf = Buffer.alloc(32);
      let val = v;
      for (let i = 0; i < 32; i++) { buf[i] = Number(val & 0xFFn); val >>= 8n; }
      wParts.push(buf);
    };
    wField(1n);              // wire 0 = ONE
    wField(publicProduct);   // wire 1 = public output
    wField(a);               // wire 2 = private a
    wField(b);               // wire 3 = private b

    const wBuf = Buffer.concat(wParts);
    writeU32(2);
    writeU64(BigInt(wBuf.length));
    parts.push(wBuf);

    return Buffer.concat(parts);
  }
}

export const groth16ProofService = new Groth16ProofService();
export default groth16ProofService;
