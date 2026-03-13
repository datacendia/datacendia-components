# SOP-019: Regulator's Receipt Generation

**Category:** DCII
**Priority:** High
**Owner:** Compliance Lead
**Last Verified:** 2026-02-22 (against `src/pages/cortex/compliance/RegulatorsReceiptPage.tsx`, `COMPLETE_SERVICE_MATRIX.md`)

---

## 1. Purpose

Define the procedure for generating, verifying, and distributing Regulator's Receipts — forensic-grade, independently verifiable PDF documents that cryptographically prove an organization's decision-making process.

---

## 2. What Is a Regulator's Receipt?

A Regulator's Receipt is a **forensic-grade, independently verifiable PDF document** that bundles:
- Complete decision deliberation record
- All agent analyses and votes
- IISS score at time of decision
- Compliance requirements checked
- Merkle tree integrity proof
- Digital signature (non-repudiable)
- RFC 3161 timestamp
- Evidence chain with provenance

It serves as a "receipt" proving that proper governance was followed, suitable for regulatory audits, litigation defense, and compliance demonstrations.

---

## 3. Generation Procedure

### 3.1 Via UI
1. Navigate to `/cortex/compliance/regulators-receipt` (requires authentication)
2. Select the decision/deliberation to document
3. Configure receipt options:
   - Include IISS score: Yes/No
   - Include agent analyses: Full/Summary
   - Include evidence chain: Yes/No
   - Compliance frameworks to reference
4. Click "Generate Receipt"
5. PDF is generated with all cryptographic proofs
6. Download or share via secure link

### 3.2 Via Public Demo
- Navigate to `/cortex/trust/regulators-receipt` (no auth required)
- This is a demonstration version with sample data

### 3.3 Via API
```bash
curl -X POST http://localhost:3001/api/v1/compliance/regulators-receipt \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "deliberationId": "delib_123",
    "includeIISS": true,
    "includeEvidence": true,
    "frameworks": ["GDPR", "SOC2", "EU_AI_ACT"],
    "format": "pdf"
  }'
```

---

## 4. Receipt Contents

### 4.1 Sections
| Section | Contents |
|---------|----------|
| **Header** | Organization, date, receipt ID, classification |
| **Decision Summary** | Question, context, final decision |
| **Deliberation Record** | All agent analyses, votes, dissents |
| **IISS Score** | Current score, band, dimension breakdown |
| **Compliance Check** | Applicable frameworks, requirements met/unmet |
| **Evidence Chain** | Provenance of all data used in decision |
| **Integrity Proof** | Merkle tree root, hash chain |
| **Digital Signature** | Signer identity, timestamp, algorithm |
| **Verification Instructions** | How to independently verify the receipt |

### 4.2 Cryptographic Elements
| Element | Purpose | Implementation |
|---------|---------|---------------|
| Merkle Root | Tamper detection | SHA-256 hash tree of all receipt data |
| Digital Signature | Non-repudiation | RSA/ECDSA signing |
| RFC 3161 Timestamp | Time proof | External TSA (see SOP-020) |
| Content Hash | Integrity | SHA-256 of PDF content |

---

## 5. Verification

### 5.1 Online Verification
1. Visit receipt verification page
2. Upload receipt PDF or enter receipt ID
3. System verifies:
   - Merkle root matches content
   - Digital signature is valid
   - Timestamp is authentic
   - No content has been altered
4. Verification result displayed

### 5.2 Offline Verification
The receipt includes a verification section with:
- Merkle root hash (can be checked against blockchain anchor)
- Replay command (reproduce deliberation with same seed)
- Checksum for independent verification

---

## 6. Distribution

| Recipient | Method | Access Control |
|-----------|--------|---------------|
| Regulators | Secure download link | Time-limited, encrypted |
| Legal counsel | Direct PDF | Encrypted email |
| Board members | Platform access | Role-based view |
| Auditors | Audit export bundle | Read-only, watermarked |
| Archive | CendiaLedger™ | Immutable, 7-year retention |

---

## 7. Compliance Framework References

The receipt can reference any of the platform's supported compliance frameworks:

| Framework | Key Requirements Documented |
|-----------|---------------------------|
| GDPR | Data processing lawfulness, consent records |
| SOC 2 | Control activities, monitoring evidence |
| HIPAA | PHI safeguards, access controls |
| EU AI Act | Transparency, human oversight, risk assessment |
| ISO 27001 | Information security controls |
| NIST AI RMF | AI risk management practices |
| PCI-DSS | Cardholder data protection |
| DORA | Digital operational resilience |

---

## 8. Known Limitations

- External TSA providers are **simulated** in development (not connected to real DigiCert/Comodo)
- Blockchain anchoring is **simulated** (not connected to real Bitcoin/Ethereum)
- Hardware-backed attestation is **simulated**
- PDF generation uses client-side rendering

---

## 9. Verified Against

- `src/pages/cortex/compliance/RegulatorsReceiptPage.tsx`: Full receipt generation UI
- `src/pages/cortex/trust/RegulatorsReceiptPage.tsx`: Public demo version
- `src/routes/cortex/enterprise.routes.tsx`: Protected route at `compliance/regulators-receipt`
- `src/routes/public.routes.tsx`: Public route at `/cortex/trust/regulators-receipt`
- `COMPLETE_SERVICE_MATRIX.md`: DCII services with Merkle trees, timestamps
- `docs/MARKETING_VS_PLATFORM_AUDIT.md`: External services noted as simulated

---

*Datacendia, LLC — Proprietary and Confidential*
