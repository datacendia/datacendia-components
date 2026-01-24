# DATACENDIA INDEPENDENT VERIFICATION KIT
## Cryptographically Self-Proving Decision Verification

**Version 1.0** | **January 23, 2026**  
**Classification:** Technical Specification

---

> *"Trust, but verify—without trusting us to verify."*

This document specifies how third parties can **independently verify** Datacendia decision outputs without requiring access to Datacendia systems, source code, or personnel.

---

## PROBLEM STATEMENT

Traditional AI audit approaches require:
1. Access to the vendor's code
2. Access to the vendor's environment
3. Trust in the vendor's explanations

This creates a dependency: **you can only verify what we let you verify.**

The Independent Verification Kit eliminates this dependency.

---

## VERIFICATION ARCHITECTURE

### What Gets Signed

Every Datacendia decision produces a **Decision Packet** containing:

```
┌─────────────────────────────────────────────────────────┐
│                    DECISION PACKET                       │
├─────────────────────────────────────────────────────────┤
│  run_id: "DC-20260123-143052-a7f3b2c1"                  │
│  merkle_root: "8f4a2b1c..."                             │
│  signature: "RSA-SHA256:9d8c7b6a..."                    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │ EVIDENCE LAYER (Merkle Tree)                    │    │
│  │  ├── Input Hash: "2a3b4c5d..."                  │    │
│  │  ├── Agent Contribution Hashes                  │    │
│  │  │    ├── chief: "1a2b3c..."                    │    │
│  │  │    ├── cfo: "4d5e6f..."                      │    │
│  │  │    ├── risk: "7g8h9i..."                     │    │
│  │  │    └── ...                                   │    │
│  │  ├── Dissent Hashes                             │    │
│  │  ├── Tool Call Hashes                           │    │
│  │  └── Final Recommendation Hash                  │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │ ACCOUNTABILITY LAYER                            │    │
│  │  ├── Human Authority: "Jane Smith, CFO"         │    │
│  │  ├── Action: "APPROVE"                          │    │
│  │  ├── Accepted Risks: ["ECONOMIC_INSTABILITY"]   │    │
│  │  └── Signature: "TPM:abc123..."                 │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### What You Can Verify

| Verification | What It Proves | Without Trusting |
|--------------|----------------|------------------|
| **Merkle Root** | Evidence hasn't been tampered with | Datacendia's storage |
| **Signature** | Packet was signed by our key | Datacendia's claims |
| **Replay** | Same inputs → same outputs | Datacendia's code |
| **Accountability** | A human took responsibility | Datacendia's logs |

---

## VERIFICATION KIT COMPONENTS

### 1. Dockerized Replay Verifier

```dockerfile
# datacendia/verifier:latest
# Runs deterministic replay in isolated container

FROM node:20-alpine
WORKDIR /verifier

# Contains only verification logic, no Datacendia secrets
COPY verifier-bundle/ .

ENTRYPOINT ["node", "verify.js"]
```

**Usage:**
```bash
docker run --rm \
  -v ./decision-packet.json:/input/packet.json \
  -v ./evidence-bundle/:/input/evidence/ \
  datacendia/verifier:latest \
  --verify-integrity \
  --verify-replay \
  --output /output/report.json
```

**What it checks:**
- Merkle root matches evidence hashes
- Signature validates against public key
- Deterministic replay produces same outputs
- All agent contributions are accounted for

### 2. Read-Only Audit Bundle

Every decision can be exported as a self-contained audit bundle:

```
decision-audit-bundle/
├── packet.json              # Signed decision packet
├── evidence/
│   ├── input.json           # Original decision request
│   ├── agent-outputs/       # Each agent's contribution
│   │   ├── chief.json
│   │   ├── cfo.json
│   │   ├── risk.json
│   │   └── ...
│   ├── dissents/            # Any filed dissents
│   ├── tool-calls/          # External tool invocations
│   └── final-recommendation.json
├── accountability/
│   ├── human-approval.json  # Who approved, when, why
│   └── delegation-chain.json # Authority delegation
├── verification/
│   ├── merkle-proof.json    # Full Merkle tree
│   ├── public-key.pem       # Verification key
│   └── checksums.sha256     # All file hashes
└── README.md                # How to verify this bundle
```

### 3. Hash Manifest

Every bundle includes `checksums.sha256`:

```
8f4a2b1c3d4e5f6a7b8c9d0e1f2a3b4c  packet.json
2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d  evidence/input.json
4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a  evidence/agent-outputs/chief.json
...
```

**Verification command:**
```bash
sha256sum -c checksums.sha256
```

### 4. One-Command Replay Check

```bash
# Full verification in one command
npx @datacendia/verify ./decision-audit-bundle/

# Output:
# ✓ Merkle root valid
# ✓ Signature valid (key: DC-PROD-2026-01)
# ✓ All evidence hashes match
# ✓ Deterministic replay: PASS
# ✓ Human accountability record present
# 
# VERIFICATION RESULT: VALID
# Report saved to: verification-report.json
```

---

## CRYPTOGRAPHIC SPECIFICATIONS

### Hashing
- **Algorithm:** SHA-256
- **Encoding:** Hexadecimal, lowercase
- **Canonicalization:** JSON keys sorted alphabetically, no whitespace

### Signatures
- **Algorithm:** RSA-SHA256 (2048-bit minimum) or Ed25519
- **Format:** Base64-encoded
- **Key Management:** AWS KMS, HashiCorp Vault, Azure Key Vault, or TPM 2.0

### Merkle Tree
- **Structure:** Binary tree with SHA-256 nodes
- **Leaf ordering:** Deterministic by content hash
- **Proof format:** Array of sibling hashes with left/right indicators

---

## PUBLIC KEY DISTRIBUTION

Datacendia's verification public keys are published at:

1. **HTTPS:** `https://keys.datacendia.com/verification/current.pem`
2. **DNS TXT:** `_datacendia-verify.datacendia.com`
3. **Keybase:** `keybase.io/datacendia/verification`
4. **GitHub:** `github.com/datacendia/public-keys`

Key rotation is announced 90 days in advance. Previous keys remain valid for verification of historical decisions.

---

## VERIFICATION SCENARIOS

### Scenario 1: Regulatory Audit

A regulator wants to verify a decision made 2 years ago.

```bash
# 1. Export the audit bundle
curl -H "Authorization: Bearer $TOKEN" \
  https://api.datacendia.com/v1/decisions/DC-20240523-091234/export \
  -o audit-bundle.zip

# 2. Verify without Datacendia access
unzip audit-bundle.zip
npx @datacendia/verify ./audit-bundle/

# 3. Regulator has cryptographic proof of:
#    - What inputs were provided
#    - What each AI agent said
#    - What the final recommendation was
#    - Who approved it and accepted which risks
```

### Scenario 2: Legal Discovery

A court subpoenas decision records.

```bash
# 1. Export with legal hold
datacendia export --decision-id DC-20250101-143052 \
  --format legal-discovery \
  --include-accountability \
  --output ./legal-bundle/

# 2. Opposing counsel can verify independently
docker run datacendia/verifier ./legal-bundle/

# 3. Court has chain-of-custody proof without trusting Datacendia
```

### Scenario 3: Internal Audit

An organization's internal audit team reviews AI decisions.

```bash
# 1. Bulk export for time period
datacendia export --from 2025-01-01 --to 2025-12-31 \
  --organization org_abc123 \
  --output ./annual-audit/

# 2. Verify all decisions
for bundle in ./annual-audit/*/; do
  npx @datacendia/verify "$bundle" >> audit-results.txt
done

# 3. Generate audit report
cat audit-results.txt | datacendia-audit-summary
```

---

## WHAT THIS DOES NOT VERIFY

To be transparent about limitations:

| Cannot Verify | Why | Mitigation |
|---------------|-----|------------|
| AI model correctness | Models are probabilistic | Deterministic replay shows consistency |
| Data accuracy | Garbage in, garbage out | Input provenance is logged |
| Human judgment quality | Humans can be wrong | Accountability record shows who decided |
| Future outcomes | Predictions aren't guarantees | Pre-mortem analysis surfaces risks |

---

## INTEGRATION WITH CENDIARESPONSIBILITY™

The verification kit integrates with human accountability:

```json
{
  "verification": {
    "merkle_root_valid": true,
    "signature_valid": true,
    "replay_match": true
  },
  "accountability": {
    "human_authority": {
      "name": "Jane Smith",
      "role": "Chief Financial Officer",
      "jurisdiction": "United States"
    },
    "action": "APPROVE",
    "accepted_risks": ["ECONOMIC_INSTABILITY", "MARKET_DISTORTION"],
    "justification": "Risk-adjusted ROI exceeds threshold...",
    "signature": {
      "type": "TPM_2.0",
      "valid": true,
      "timestamp": "2026-01-23T14:30:52Z"
    }
  }
}
```

**Result:** Cryptographic proof of both AI reasoning AND human accountability.

---

## AVAILABILITY

| Component | Availability | License |
|-----------|--------------|---------|
| Verifier Docker Image | Public | Apache 2.0 |
| NPM Package | Public | Apache 2.0 |
| Audit Bundle Format | Open Specification | CC BY 4.0 |
| Public Keys | Always Available | N/A |

---

## COMMITMENT

Datacendia commits to:

1. **Never requiring Datacendia access for verification**
2. **Publishing verification tools as open source**
3. **Maintaining public key availability indefinitely**
4. **Supporting historical verification for all retained decisions**

This is not a feature—it is an **architectural guarantee**.

---

*"If you have to trust us to verify us, you cannot trust us."*

**Datacendia Independent Verification Kit v1.0**
