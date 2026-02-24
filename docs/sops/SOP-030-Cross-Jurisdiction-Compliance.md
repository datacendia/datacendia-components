# SOP-030: Cross-Jurisdiction Compliance

**Category:** Compliance
**Priority:** High
**Owner:** CLO / Compliance Lead
**Last Verified:** 2026-02-22 (against `backend/src/services/dcii/CrossJurisdictionConflictService.ts`, `COMPLETE_SERVICE_MATRIX.md`)

---

## 1. Purpose

Define procedures for using CendiaJurisdiction™ to detect, evaluate, and resolve compliance conflicts when an organization operates across multiple regulatory jurisdictions simultaneously.

---

## 2. Service Overview

CendiaJurisdiction™ performs **simultaneous multi-framework evaluation** to identify conflicts between regulatory regimes — for example, when GDPR's right-to-erasure conflicts with a US litigation hold requirement, or when EU AI Act transparency obligations conflict with trade secret protections.

**Pricing:** Part of DCII suite | **Tests:** 10/10 passing

---

## 3. Supported Jurisdictions

| # | Jurisdiction / Framework | Region | Key Focus |
|---|------------------------|--------|-----------|
| 1 | GDPR | EU/EEA | Data protection, privacy |
| 2 | CCPA/CPRA | California, US | Consumer privacy |
| 3 | HIPAA | US | Healthcare data |
| 4 | SOC 2 | US/Global | Security controls |
| 5 | ISO 27001 | Global | Information security |
| 6 | PCI-DSS | Global | Payment card data |
| 7 | DORA | EU | Digital operational resilience |
| 8 | EU AI Act | EU | Artificial intelligence |
| 9 | NIST AI RMF | US | AI risk management |
| 10 | PIPL | China | Personal information protection |
| 11 | LGPD | Brazil | Data protection |
| 12 | POPIA | South Africa | Data protection |
| 13 | PDPA | Singapore | Personal data protection |
| 14 | Privacy Act | Australia | Privacy |
| 15 | PIPEDA | Canada | Privacy |
| 16 | FDA 21 CFR Part 11 | US | Electronic records |
| 17 | SOX | US | Financial reporting |

**Total: 17 jurisdictions supported**

---

## 4. Conflict Detection Procedure

### 4.1 Run Jurisdiction Check
```bash
curl -X POST http://localhost:3001/api/v1/dcii/jurisdiction/check \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "organizationId": "org_123",
    "operatingJurisdictions": ["EU", "US-CA", "CN", "SG"],
    "dataTypes": ["personal_data", "health_data", "financial_data"],
    "processingActivities": ["collection", "storage", "transfer", "ai_processing"]
  }'
```

### 4.2 Review Conflicts
The service returns:
```json
{
  "conflicts": [
    {
      "framework1": "GDPR",
      "framework2": "PIPL",
      "conflictType": "data_transfer",
      "severity": "high",
      "description": "GDPR allows transfer with SCCs; PIPL requires security assessment for >1M records",
      "resolution": "Conduct PIPL security assessment AND implement SCCs for dual compliance"
    }
  ],
  "applicableFrameworks": ["GDPR", "CCPA", "PIPL", "PDPA"],
  "complianceScore": 0.82,
  "recommendations": [...]
}
```

### 4.3 Via DCII Dashboard
1. Navigate to `/cortex/enterprise/dcii`
2. Select **Jurisdiction** tab
3. Enter operating jurisdictions and data types
4. View conflict matrix and resolutions
5. Export compliance report

---

## 5. Conflict Resolution Strategy

### 5.1 Good-Faith Maximum Compliance
When frameworks conflict, the platform recommends the **strictest applicable standard** — "good-faith maximum compliance":

| Conflict Type | Resolution Approach |
|---------------|-------------------|
| Data retention vs. deletion | Apply shortest retention + document legal basis for longer |
| Transfer restrictions | Use strictest transfer mechanism accepted by all jurisdictions |
| Consent requirements | Obtain most explicit consent form |
| Transparency obligations | Provide maximum transparency |
| AI oversight requirements | Apply strictest human oversight standard |

### 5.2 Documentation
Every conflict resolution must be documented:
- Conflicting requirements identified
- Resolution chosen with justification
- Legal review sign-off
- CendiaLedger™ record created

---

## 6. Common Conflict Patterns

| Conflict | Frameworks | Resolution |
|----------|-----------|------------|
| Right to erasure vs. litigation hold | GDPR vs. US Federal | Document legal basis; defer erasure during hold |
| Data localization vs. cloud storage | PIPL vs. GDPR | Use in-region processing (CendiaSovereign™) |
| Consent vs. legitimate interest | GDPR vs. CCPA | Obtain explicit consent (strictest) |
| AI transparency vs. trade secrets | EU AI Act vs. IP law | Disclose AI use without revealing model architecture |
| Breach notification timing | GDPR (72h) vs. HIPAA (60d) | Notify within 72h (strictest) |

---

## 7. Ongoing Monitoring

| Activity | Frequency | Owner |
|----------|-----------|-------|
| Jurisdiction mapping review | Quarterly | CLO |
| Framework update monitoring | Monthly | Compliance Lead |
| Conflict resolution review | Per occurrence | CLO + DPO |
| Cross-jurisdiction audit | Annually | External counsel |

---

## 8. Integration with Other Services

| Service | Integration |
|---------|-------------|
| CendiaSovereign™ | Data residency enforcement per jurisdiction |
| CendiaLedger™ | Conflict resolution documentation |
| Regulator's Receipt | Multi-jurisdiction compliance proof |
| IISS Assessment | Compliance Readiness dimension scoring |
| CendiaRegulatoryAbsorb™ | Framework library and updates |

---

## 9. Verified Against

- `backend/src/services/dcii/CrossJurisdictionConflictService.ts`: Multi-framework evaluation, conflict detection
- `COMPLETE_SERVICE_MATRIX.md`: CendiaJurisdiction™ — 10/10 tests, DB + Cache, 17 jurisdictions
- `DCII_FRAMEWORK_WHITE_PAPER.md`: Primitive 9 — Cross-Jurisdiction Compliance
- `COMPLIANCE_DOCUMENTATION.md`: 10 frameworks listed
- `src/pages/cortex/enterprise/DCIIDashboardPage.tsx`: Jurisdiction tab in DCII dashboard

---

*Datacendia, LLC — Proprietary and Confidential*
