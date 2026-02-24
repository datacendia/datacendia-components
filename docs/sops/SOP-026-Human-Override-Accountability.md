# SOP-026: Human Override & Accountability

**Category:** Governance
**Priority:** Critical
**Owner:** Governance Lead / CEO
**Last Verified:** 2026-02-22 (against `src/pages/cortex/sovereign/CollapsePage.tsx`, `COMPLETE_SERVICE_MATRIX.md`)

---

## 1. Purpose

Define procedures for human overrides of AI recommendations, ensuring non-repudiable accountability, explicit liability transfer, and complete audit trail via CendiaResponsibility™.

---

## 2. Core Principle

**"AI recommends. Humans decide. Accountability is non-negotiable."**

When a human overrides an AI recommendation (especially one flagged as high-risk), the platform:
1. Records the override with full context
2. Captures the human authority's identity and justification
3. Documents accepted risks explicitly
4. Creates a non-suppressible, non-deletable record
5. Optionally signs with TPM-backed hardware attestation (simulated)
6. Timestamps via RFC 3161 (see SOP-020)

---

## 3. Override Triggers

An override is required when:
| Scenario | Override Type |
|----------|-------------|
| Deploying despite negative Trust Delta (Collapse Mode) | **Collapse Override** |
| Overriding AI Council consensus recommendation | **Council Override** |
| Bypassing compliance framework requirement | **Compliance Override** |
| Dismissing non-overridable agent findings (FREE_SPEECH, MINORITY_HARM) | **Protected Override** (requires executive + legal) |
| Manual decision without AI consultation | **Unilateral Decision** |

---

## 4. Override Procedure

### 4.1 Via Collapse Mode UI
1. After a Collapse analysis with negative Trust Delta
2. Click "Override Decision" button
3. Fill in **Human Authority** details:
   - Full name
   - Title/position
   - Email (institutional)
   - Department
4. Select **Action Taken** (deploy, modify, defer with conditions)
5. Write **Justification** — why the AI recommendation is being overridden
6. Check each **Accepted Risk** individually (acknowledge specific risks)
7. Read and accept **Risk Acknowledgment Statement**:
   > "I acknowledge that I am overriding the AI system's recommendation. I accept personal and institutional responsibility for the consequences of this decision. I understand that this override will be permanently recorded."
8. Click "Sign & Record Override"
9. Record is created in CendiaResponsibility™ and CendiaLedger™

### 4.2 Override Record Structure
```typescript
interface OverrideRecord {
  id: string;
  deliberationId: string;
  decisionId: string;
  timestamp: string;                    // RFC 3161 timestamped
  humanAuthority: {
    name: string;
    title: string;
    email: string;
    department: string;
  };
  aiRecommendation: string;            // What AI recommended
  trustDeltaAtOverride: number;        // Trust Delta at time of override
  actionTaken: string;                 // What human decided instead
  justification: string;              // Why
  acceptedRisks: string[];            // Specific risks acknowledged
  riskAcknowledgment: string;         // Full acknowledgment text
  signature: string;                  // Digital signature
  signedAt: string;                   // Signature timestamp
}
```

---

## 5. Non-Overridable Findings

Certain agent findings **cannot be silently dismissed**:

| Agent | Domain | Override Requires |
|-------|--------|-----------------|
| `FREE_SPEECH_AGENT` | Constitutional rights | Executive + Legal counsel sign-off |
| `MINORITY_HARM_AGENT` | Vulnerable population harm | Executive + Ethics board review |

These are marked with a **NON-OVERRIDABLE** badge in the UI. Overriding them triggers enhanced documentation requirements.

---

## 6. Accountability Chain

### 6.1 DCII Primitive 3: Override Accountability
This SOP implements DCII Primitive #3 — "Non-suppressible tracking of recommendation overrides":
- Override records cannot be deleted
- Override records cannot be modified after creation
- All overrides are included in compliance exports
- Override history is visible in IISS assessments

### 6.2 Delegation
If the override authority delegates the decision:
1. Both delegator and delegate are recorded
2. Delegation chain is preserved
3. Original authority retains accountability

---

## 7. Post-Override Monitoring

After an override:
1. Decision is flagged for enhanced monitoring
2. Outcome tracking activated (did the override lead to harm?)
3. Quarterly review of all overrides by governance committee
4. Override patterns analyzed for systemic issues
5. IISS score dimension "Override Accountability" updated

---

## 8. Reporting

### 8.1 Override Dashboard
- Total overrides by period
- Override rate (% of AI recommendations overridden)
- Outcome correlation (overrides that led to negative outcomes)
- Authority distribution (who overrides most)

### 8.2 Compliance Reporting
Override records are automatically included in:
- SOC 2 audit packages
- GDPR processing records
- EU AI Act transparency reports
- Board governance reports

---

## 9. Verified Against

- `src/pages/cortex/sovereign/CollapsePage.tsx`: Override modal (lines 115-137), `OverrideRecord` interface, risk acknowledgment flow
- `COMPLETE_SERVICE_MATRIX.md`: CendiaResponsibility™ — $249/mo, Enterprise package
- `DCII_FRAMEWORK_WHITE_PAPER.md`: Primitive 3 — Override Accountability
- `COMPLETE_SERVICE_MATRIX.md`: DCII Primitive 3 — "Non-suppressible tracking of recommendation overrides" — Implemented
- Non-overridable agents: `FREE_SPEECH_AGENT`, `MINORITY_HARM_AGENT` in CollapsePage UI

---

*Datacendia, LLC — Proprietary and Confidential*
