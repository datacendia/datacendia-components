# SOP-025: CendiaLedger Immutable Audit Trail

**Category:** Compliance
**Priority:** High
**Owner:** Compliance Lead
**Last Verified:** 2026-02-22 (against `COMPLETE_SERVICE_MATRIX.md`, `backend/src/services/`)

---

## 1. Purpose

Define procedures for operating CendiaLedger™ — the immutable audit trail system that provides blockchain-style decision logging, tamper-proof records, and compliance exports.

---

## 2. Service Overview

CendiaLedger™ records every significant platform action in a tamper-evident, append-only ledger. Records are cryptographically chained so that any modification or deletion is detectable.

**Pricing:** $299/mo | **Package:** Enterprise

---

## 3. What Gets Logged

| Event Category | Examples | Retention |
|----------------|---------|-----------|
| **Decisions** | Deliberation results, final decisions | 7 years |
| **Overrides** | Human overrides of AI recommendations | 7 years |
| **Authentication** | Login, logout, token refresh, failed attempts | 1 year |
| **Configuration** | Settings changes, model switches | 3 years |
| **DCII Events** | IISS assessments, timestamps, media auth | 7 years |
| **Compliance** | Framework checks, receipt generation | 7 years |
| **Access Control** | Role changes, permission grants/revokes | 3 years |
| **Data Operations** | Exports, imports, deletions | 7 years |

---

## 4. Ledger Architecture

### 4.1 Record Structure
```json
{
  "id": "ledger_20260222_001",
  "timestamp": "2026-02-22T20:30:00Z",
  "eventType": "DECISION_COMPLETED",
  "actor": "user_123",
  "subject": "DEC-20260222-001",
  "details": { ... },
  "previousHash": "sha256:abc...",
  "recordHash": "sha256:def...",
  "merkleRoot": "sha256:ghi..."
}
```

### 4.2 Integrity Chain
- Each record includes the hash of the previous record
- Merkle tree computed over groups of records
- Any modification breaks the hash chain — detectable
- Periodic blockchain anchoring for external verification (simulated)

---

## 5. Operating Procedures

### 5.1 Viewing Audit Trail
1. Navigate to `/cortex/enterprise/ledger` or Admin → Audit Logs
2. Filter by:
   - Date range
   - Event type
   - Actor (user)
   - Subject (decision, resource)
3. View individual record details
4. Verify chain integrity

### 5.2 Exporting Audit Records
```bash
# Export date range
curl -X POST http://localhost:3001/api/v1/ledger/export \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2025-01-01",
    "endDate": "2025-12-31",
    "eventTypes": ["DECISION_COMPLETED", "OVERRIDE_RECORDED"],
    "format": "json"
  }'
```

### 5.3 Verifying Integrity
```bash
# Verify hash chain for a date range
curl http://localhost:3001/api/v1/ledger/verify?start=2025-01-01&end=2025-12-31 \
  -H "Authorization: Bearer <token>"
```

Returns:
- Chain intact: ✅ All hashes valid
- Chain broken: ❌ Records with mismatched hashes identified

### 5.4 Compliance Export
```bash
# Generate SOC 2 / GDPR compliance export
curl -X POST http://localhost:3001/api/v1/ledger/compliance-export \
  -H "Authorization: Bearer <token>" \
  -d '{
    "framework": "SOC2",
    "period": "2025-Q4",
    "includeIntegrityProof": true
  }'
```

---

## 6. Retention & Archival

| Data Classification | Retention | Archive Location |
|-------------------|-----------|-----------------|
| Critical (decisions, overrides) | 7 years | PostgreSQL + CendiaEternal archive |
| Important (config, access) | 3 years | PostgreSQL |
| Standard (auth events) | 1 year | PostgreSQL with auto-purge |

### 6.1 Archival Process
1. Records older than retention period flagged for archival
2. Archived to long-term storage (encrypted, WORM)
3. Integrity proof maintained in Merkle tree
4. Original records can be purged after archival confirmed

---

## 7. Integration Points

| System | How Ledger Is Used |
|--------|-------------------|
| Council Deliberations | Records all deliberation events |
| CendiaCollapse™ | Logs red-team analyses and overrides |
| DCII Dashboard | IISS assessments logged |
| Regulator's Receipt | Receipt generation logged |
| Human Overrides | Override chain logged (non-suppressible) |
| Authentication | All auth events logged |

---

## 8. Compliance Framework Mapping

| Framework | Ledger Contribution |
|-----------|-------------------|
| SOC 2 CC6 | Logical access controls audit trail |
| SOC 2 CC7 | System operations logging |
| SOC 2 CC8 | Change management records |
| GDPR Art. 30 | Records of processing activities |
| HIPAA §164.312 | Audit controls and access logging |
| ISO 27001 A.12.4 | Logging and monitoring |

---

## 9. Troubleshooting

| Issue | Cause | Resolution |
|-------|-------|------------|
| Chain integrity failure | Database modification | Investigate; restore from backup |
| Missing records | Logging service down | Check backend health; review gap period |
| Export timeout | Large date range | Narrow export range or use async export |
| Hash mismatch | Schema migration side effect | Verify migration didn't alter existing records |

---

## 10. Verified Against

- `COMPLETE_SERVICE_MATRIX.md`: CendiaLedger™ — $299/mo, Enterprise package
- Pillar mapping: Guard, Lineage
- Agent mapping: All Agents (audit)
- `BACKUP_RECOVERY.md`: 7-year retention for critical data, CendiaEternal archive
- `COMPLIANCE_DOCUMENTATION.md`: SOC 2 CC6, CC7, CC8 mapping

---

*Datacendia, LLC — Proprietary and Confidential*
