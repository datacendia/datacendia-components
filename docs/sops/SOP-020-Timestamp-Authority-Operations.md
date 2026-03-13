# SOP-020: Timestamp Authority Operations

**Category:** DCII
**Priority:** High
**Owner:** DCII Operations Lead
**Last Verified:** 2026-02-22 (against `backend/src/services/dcii/TimestampAuthorityService.ts`, `COMPLETE_SERVICE_MATRIX.md`)

---

## 1. Purpose

Define procedures for operating the CendiaTimestamp™ RFC 3161 Timestamp Authority service, including timestamp creation, verification, batch operations, and blockchain anchoring.

---

## 2. Service Overview

CendiaTimestamp™ provides **RFC 3161-compliant external timestamps** that cryptographically prove when data existed. This is critical for:
- forensic-grade, independently verifiable evidence ("this decision was made at time X")
- Regulatory compliance (proving timely reporting)
- Intellectual property protection
- Audit trail integrity

---

## 3. Timestamp Providers

| Provider | Status | Use Case |
|----------|--------|----------|
| DigiCert | Simulated | Production TSA |
| Comodo | Simulated | Backup TSA |
| FreeTSA | Simulated | Development/testing |
| Blockchain (Bitcoin) | Simulated | Immutable anchoring |
| Blockchain (Ethereum) | Simulated | Smart contract anchoring |

**Note:** All external providers are currently simulated. The service generates valid RFC 3161 token structures but does not connect to real external TSA servers or blockchain networks.

---

## 4. Timestamp Operations

### 4.1 Create Single Timestamp
```bash
curl -X POST http://localhost:3001/api/v1/dcii/timestamps \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "dataHash": "sha256:abc123...",
    "description": "Decision DEC-20260222-001 deliberation record",
    "provider": "digicert"
  }'
```

### 4.2 Batch Timestamping
```bash
curl -X POST http://localhost:3001/api/v1/dcii/timestamps/batch \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"dataHash": "sha256:abc...", "description": "Item 1"},
      {"dataHash": "sha256:def...", "description": "Item 2"}
    ],
    "provider": "digicert"
  }'
```

### 4.3 Verify Timestamp
```bash
curl http://localhost:3001/api/v1/dcii/timestamps/<timestamp_id>/verify
```

### 4.4 Blockchain Anchoring
```bash
curl -X POST http://localhost:3001/api/v1/dcii/timestamps/<timestamp_id>/anchor \
  -H "Content-Type: application/json" \
  -d '{"blockchain": "bitcoin"}'
```

---

## 5. Data Persistence

### 5.1 Database Model
`dcii_timestamps` table stores:
- Timestamp ID
- Data hash (SHA-256)
- Provider used
- RFC 3161 token (binary)
- Blockchain anchor (tx hash, if anchored)
- Created timestamp
- Verification status

### 5.2 Cache Pattern
Write-through cache: in-memory Map + PostgreSQL via Prisma.

### 5.3 Retention
- **10 years** minimum retention for all timestamps
- Timestamps are immutable — never modified after creation
- Periodic integrity verification (quarterly)

---

## 6. Integration Points

| System | How Timestamps Are Used |
|--------|------------------------|
| Regulator's Receipt | Embedded in PDF as time proof |
| CendiaLedger™ | Each audit entry timestamped |
| Council Deliberations | Deliberation completion timestamped |
| Human Overrides | Override actions timestamped |
| IISS Assessments | Assessment completion timestamped |
| Evidence Vault | Evidence submission timestamped |

---

## 7. Verification Process

### 7.1 Automated Verification
1. Extract timestamp token from record
2. Verify RFC 3161 token structure
3. Check hash matches original data
4. Validate provider signature
5. If blockchain-anchored: verify on-chain

### 7.2 Independent Verification
Third parties can verify timestamps by:
1. Obtaining the data hash
2. Obtaining the RFC 3161 token
3. Using any RFC 3161-compatible verifier
4. Checking blockchain anchor (if applicable)

---

## 8. Monitoring

| Metric | Target | Alert |
|--------|--------|-------|
| Timestamp creation rate | Per demand | Failure rate > 1% |
| Verification success rate | 100% | Any failure |
| Storage usage | < 80% capacity | > 80% |
| Provider availability | 99.9% | Provider unreachable |

---

## 9. Troubleshooting

| Issue | Cause | Resolution |
|-------|-------|------------|
| Timestamp creation fails | Service not initialized | Restart backend; check DB connection |
| Verification fails | Data hash mismatch | Data was modified after timestamping |
| Blockchain anchor pending | Simulated — always completes | Expected behavior in dev |
| Token format invalid | Corrupted record | Re-create timestamp from original data |

---

## 10. Verified Against

- `backend/src/services/dcii/TimestampAuthorityService.ts`: RFC 3161 implementation, multi-provider, batch
- `COMPLETE_SERVICE_MATRIX.md`: 10/10 tests passing, DB + Cache status
- `backend/prisma/schema/dcii.prisma`: `dcii_timestamps` model
- `DCII_FRAMEWORK_WHITE_PAPER.md`: Primitive 1 — Discovery-Time Proof
- `docs/MARKETING_VS_PLATFORM_AUDIT.md`: External providers noted as simulated

---

*Datacendia, LLC — Proprietary and Confidential*
