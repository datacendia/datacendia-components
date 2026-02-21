/**
 * Groth16 Circuit Artifact Generator
 * 
 * Generates R1CS, trusted setup (Powers of Tau), proving key (zkey),
 * and verification key for a simple "commitment proof" circuit.
 * 
 * Circuit: Prove knowledge of (a, b) such that a * b == publicProduct
 * This is the simplest non-trivial Groth16 circuit — a multiplication gate.
 * 
 * For compliance use: the "product" is a commitment hash, and (a, b) are
 * the private witness components. Proving you know the factors without
 * revealing them is a genuine zero-knowledge proof.
 */

import * as snarkjs from 'snarkjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTIFACTS_DIR = path.join(__dirname, 'artifacts');

// BN128 prime (used by Groth16/snarkjs)
const BN128_PRIME = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;

/**
 * Build R1CS binary for circuit: publicProduct == a * b
 * 
 * Wires: 0=ONE, 1=publicProduct (public output), 2=a (private), 3=b (private)
 * Constraints: 1 constraint — a * b = publicProduct
 * R1CS: A={wire2: 1}, B={wire3: 1}, C={wire1: 1}
 */
function buildR1CS() {
  const parts = [];

  function writeUint32(val) {
    const buf = Buffer.alloc(4);
    buf.writeUInt32LE(val);
    parts.push(buf);
  }

  function writeUint64(val) {
    const buf = Buffer.alloc(8);
    buf.writeBigUInt64LE(BigInt(val));
    parts.push(buf);
  }

  function writeFieldElement(val) {
    const buf = Buffer.alloc(32);
    let v = BigInt(val);
    for (let i = 0; i < 32; i++) {
      buf[i] = Number(v & 0xFFn);
      v >>= 8n;
    }
    parts.push(buf);
  }

  // Magic "r1cs"
  parts.push(Buffer.from([0x72, 0x31, 0x63, 0x73]));
  // Version 1
  writeUint32(1);
  // Number of sections: 3
  writeUint32(3);

  // --- Section 1: Header ---
  const headerParts = [];
  function hWriteUint32(val) { const b = Buffer.alloc(4); b.writeUInt32LE(val); headerParts.push(b); }
  function hWriteUint64(val) { const b = Buffer.alloc(8); b.writeBigUInt64LE(BigInt(val)); headerParts.push(b); }
  function hWriteField(val) {
    const b = Buffer.alloc(32);
    let v = BigInt(val);
    for (let i = 0; i < 32; i++) { b[i] = Number(v & 0xFFn); v >>= 8n; }
    headerParts.push(b);
  }

  hWriteUint32(32);            // fieldSize
  hWriteField(BN128_PRIME);    // prime
  hWriteUint32(4);             // nWires (0=one, 1=out, 2=a, 3=b)
  hWriteUint32(1);             // nPubOut
  hWriteUint32(0);             // nPubIn
  hWriteUint32(2);             // nPrvIn
  hWriteUint64(4);             // nLabels
  hWriteUint32(1);             // nConstraints

  const headerBuf = Buffer.concat(headerParts);
  writeUint32(1);              // sectionType = 1 (header)
  writeUint64(headerBuf.length);
  parts.push(headerBuf);

  // --- Section 2: Constraints ---
  const constraintParts = [];
  function cWriteUint32(val) { const b = Buffer.alloc(4); b.writeUInt32LE(val); constraintParts.push(b); }
  function cWriteField(val) {
    const b = Buffer.alloc(32);
    let v = BigInt(val);
    for (let i = 0; i < 32; i++) { b[i] = Number(v & 0xFFn); v >>= 8n; }
    constraintParts.push(b);
  }

  // Constraint 0: A={wire2: 1} * B={wire3: 1} = C={wire1: 1}
  // A: 1 pair — (wireIdx=2, coeff=1)
  cWriteUint32(1);    // nPairs for A
  cWriteUint32(2);    // wireIdx = 2 (a)
  cWriteField(1);     // coefficient = 1

  // B: 1 pair — (wireIdx=3, coeff=1)
  cWriteUint32(1);    // nPairs for B
  cWriteUint32(3);    // wireIdx = 3 (b)
  cWriteField(1);     // coefficient = 1

  // C: 1 pair — (wireIdx=1, coeff=1)
  cWriteUint32(1);    // nPairs for C
  cWriteUint32(1);    // wireIdx = 1 (publicProduct)
  cWriteField(1);     // coefficient = 1

  const constraintBuf = Buffer.concat(constraintParts);
  writeUint32(2);              // sectionType = 2 (constraints)
  writeUint64(constraintBuf.length);
  parts.push(constraintBuf);

  // --- Section 3: Wire to label mapping ---
  const labelParts = [];
  function lWriteUint64(val) { const b = Buffer.alloc(8); b.writeBigUInt64LE(BigInt(val)); labelParts.push(b); }
  lWriteUint64(0); // wire 0 -> label 0
  lWriteUint64(1); // wire 1 -> label 1
  lWriteUint64(2); // wire 2 -> label 2
  lWriteUint64(3); // wire 3 -> label 3

  const labelBuf = Buffer.concat(labelParts);
  writeUint32(3);              // sectionType = 3 (wire2label)
  writeUint64(labelBuf.length);
  parts.push(labelBuf);

  return Buffer.concat(parts);
}

/**
 * Build a witness for input {a, b} -> output {publicProduct = a*b}
 * 
 * Witness format (wtns): magic + version + sections
 * Section 1: header (fieldSize, prime, nWitness)
 * Section 2: witness values (wire 0=1, wire 1=a*b, wire 2=a, wire 3=b)
 */
function buildWitness(a, b) {
  const product = (BigInt(a) * BigInt(b)) % BN128_PRIME;
  const parts = [];

  function writeUint32(val) { const buf = Buffer.alloc(4); buf.writeUInt32LE(val); parts.push(buf); }
  function writeUint64(val) { const buf = Buffer.alloc(8); buf.writeBigUInt64LE(BigInt(val)); parts.push(buf); }
  function writeField(val) {
    const buf = Buffer.alloc(32);
    let v = BigInt(val);
    for (let i = 0; i < 32; i++) { buf[i] = Number(v & 0xFFn); v >>= 8n; }
    parts.push(buf);
  }

  // Magic "wtns"
  parts.push(Buffer.from([0x77, 0x74, 0x6e, 0x73]));
  writeUint32(2);  // version
  writeUint32(2);  // nSections

  // Section 1: Header
  const headerParts = [];
  function hWrite32(v) { const b = Buffer.alloc(4); b.writeUInt32LE(v); headerParts.push(b); }
  function hWriteF(v) {
    const b = Buffer.alloc(32);
    let val = BigInt(v);
    for (let i = 0; i < 32; i++) { b[i] = Number(val & 0xFFn); val >>= 8n; }
    headerParts.push(b);
  }
  hWrite32(32);           // fieldSize
  hWriteF(BN128_PRIME);   // prime
  hWrite32(4);            // nWitness

  const hBuf = Buffer.concat(headerParts);
  writeUint32(1);
  writeUint64(hBuf.length);
  parts.push(hBuf);

  // Section 2: Witness values
  const wParts = [];
  function wWriteF(v) {
    const b = Buffer.alloc(32);
    let val = BigInt(v);
    for (let i = 0; i < 32; i++) { b[i] = Number(val & 0xFFn); val >>= 8n; }
    wParts.push(b);
  }
  wWriteF(1n);       // wire 0 = ONE
  wWriteF(product);  // wire 1 = publicProduct (a*b)
  wWriteF(BigInt(a)); // wire 2 = a
  wWriteF(BigInt(b)); // wire 3 = b

  const wBuf = Buffer.concat(wParts);
  writeUint32(2);
  writeUint64(wBuf.length);
  parts.push(wBuf);

  return Buffer.concat(parts);
}

async function main() {
  console.log('=== Groth16 Circuit Artifact Generator ===\n');

  // Create artifacts directory
  if (!fs.existsSync(ARTIFACTS_DIR)) {
    fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
  }

  // Step 1: Generate R1CS
  console.log('1. Generating R1CS for multiplication circuit...');
  const r1cs = buildR1CS();
  const r1csPath = path.join(ARTIFACTS_DIR, 'circuit.r1cs');
  fs.writeFileSync(r1csPath, r1cs);
  console.log(`   R1CS written: ${r1cs.length} bytes`);

  // Verify R1CS
  const r1csInfo = await snarkjs.r1cs.info(r1csPath);

  // Step 2: Powers of Tau ceremony (BN128, 2^8 = 256 constraints max)
  console.log('\n2. Running Powers of Tau ceremony (BN128, 2^8)...');
  const ptauPath = path.join(ARTIFACTS_DIR, 'pot8.ptau');
  const ptauFinalPath = path.join(ARTIFACTS_DIR, 'pot8_final.ptau');

  const curve = await snarkjs.curves.getCurveFromName('bn128');
  await snarkjs.powersOfTau.newAccumulator(
    curve, 8, ptauPath
  );
  console.log('   Accumulator created');

  // Contribute randomness
  await snarkjs.powersOfTau.contribute(
    ptauPath, ptauPath, 'datacendia-ceremony-1',
    'datacendia-groth16-entropy-' + Date.now()
  );
  console.log('   Contribution added');

  // Prepare Phase 2
  await snarkjs.powersOfTau.preparePhase2(ptauPath, ptauFinalPath);
  console.log('   Phase 2 prepared');

  // Step 3: Generate zkey (proving key)
  console.log('\n3. Generating proving key (zkey)...');
  const zkeyPath = path.join(ARTIFACTS_DIR, 'circuit.zkey');

  await snarkjs.zKey.newZKey(r1csPath, ptauFinalPath, zkeyPath);
  console.log('   Initial zkey created');

  // Contribute to zkey
  const zkeyFinalPath = path.join(ARTIFACTS_DIR, 'circuit_final.zkey');
  await snarkjs.zKey.contribute(
    zkeyPath, zkeyFinalPath, 'datacendia-zkey-1',
    'datacendia-zkey-entropy-' + Date.now()
  );
  console.log('   zkey contribution added');

  // Step 4: Export verification key
  console.log('\n4. Exporting verification key...');
  const vKey = await snarkjs.zKey.exportVerificationKey(zkeyFinalPath);
  const vKeyPath = path.join(ARTIFACTS_DIR, 'verification_key.json');
  fs.writeFileSync(vKeyPath, JSON.stringify(vKey, null, 2));
  console.log(`   Verification key exported: ${JSON.stringify(vKey).length} bytes`);

  // Step 5: Test prove + verify
  console.log('\n5. Testing Groth16 prove + verify...');
  
  // Create witness for a=3, b=7 -> product=21
  const wtns = buildWitness(3, 7);
  const wtnsPath = path.join(ARTIFACTS_DIR, 'test_witness.wtns');
  fs.writeFileSync(wtnsPath, wtns);
  console.log('   Witness created for a=3, b=7 -> product=21');

  // Prove
  const { proof, publicSignals } = await snarkjs.groth16.prove(
    zkeyFinalPath, wtnsPath
  );
  console.log(`   Proof generated! Public signals: [${publicSignals}]`);
  console.log(`   Proof components: pi_a(${proof.pi_a.length}), pi_b(${proof.pi_b.length}), pi_c(${proof.pi_c.length})`);

  // Verify
  const valid = await snarkjs.groth16.verify(vKey, publicSignals, proof);
  console.log(`   Verification: ${valid ? 'VALID ✓' : 'INVALID ✗'}`);

  // Test with wrong public signal
  const invalid = await snarkjs.groth16.verify(vKey, ['999'], proof);
  console.log(`   Wrong signal rejected: ${!invalid ? 'YES ✓' : 'NO ✗'}`);

  // Save test proof for reference
  fs.writeFileSync(
    path.join(ARTIFACTS_DIR, 'test_proof.json'),
    JSON.stringify({ proof, publicSignals }, null, 2)
  );

  // Clean up intermediate files
  fs.unlinkSync(ptauPath);
  fs.unlinkSync(zkeyPath);
  fs.unlinkSync(wtnsPath);

  console.log('\n=== All artifacts generated successfully ===');
  console.log(`Artifacts directory: ${ARTIFACTS_DIR}`);
  console.log('Files:');
  for (const f of fs.readdirSync(ARTIFACTS_DIR)) {
    const size = fs.statSync(path.join(ARTIFACTS_DIR, f)).size;
    console.log(`  ${f}: ${(size / 1024).toFixed(1)} KB`);
  }
}

main().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
