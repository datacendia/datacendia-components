# CENDIAAUDIT™ & CENDIASENTRY™ FLOWS

## CendiaAudit™ - Compliance Workflow

```
                         ┌─────────────────┐
                         │   ANY ACTION    │
                         │   IN SYSTEM     │
                         └────────┬────────┘
                                  │
                                  ▼
               ┌────────────────────────────────────┐
               │          EVENT CAPTURE             │
               ├────────────────────────────────────┤
               │  • Timestamp                       │
               │  • User ID                         │
               │  • Action Type                     │
               │  • Resource Affected               │
               │  • Before/After State              │
               │  • IP Address                      │
               │  • Session ID                      │
               └──────────────────┬─────────────────┘
                                  │
                                  ▼
               ┌────────────────────────────────────┐
               │      CLASSIFY SENSITIVITY          │
               └──────────────────┬─────────────────┘
                                  │
       ┌──────────────────────────┼──────────────────────────┐
       │                          │                          │
       ▼                          ▼                          ▼
┌────────────────┐       ┌────────────────┐       ┌────────────────┐
│    PUBLIC      │       │   INTERNAL     │       │ CONFIDENTIAL   │
│  (7 years)     │       │  (7 years)     │       │  (Permanent)   │
└───────┬────────┘       └───────┬────────┘       └───────┬────────┘
        │                        │                        │
        └────────────────────────┼────────────────────────┘
                                 │
                                 ▼
               ┌────────────────────────────────────┐
               │      HASH CHAIN CREATION           │
               ├────────────────────────────────────┤
               │                                    │
               │   Previous Hash ────┐              │
               │                     ├───► SHA-256  │
               │   Event Data ───────┤      │       │
               │                     │      │       │
               │   Timestamp ────────┘      ▼       │
               │                     Current Hash   │
               └──────────────────┬─────────────────┘
                                  │
                                  ▼
               ┌────────────────────────────────────┐
               │        COMPLIANCE TAGGING          │
               ├────────────────────────────────────┤
               │  ☑ GDPR (if EU data)               │
               │  ☑ SOX (if financial)              │
               │  ☑ HIPAA (if health)               │
               │  ☑ PCI-DSS (if payment)            │
               └──────────────────┬─────────────────┘
                                  │
                                  ▼
               ┌────────────────────────────────────┐
               │       IMMUTABLE STORAGE            │
               │       (PostgreSQL + S3)            │
               └────────────────────────────────────┘
```

## Hash Chain Integrity

```
Event 1           Event 2           Event 3           Event 4
┌──────┐          ┌──────┐          ┌──────┐          ┌──────┐
│ Data │          │ Data │          │ Data │          │ Data │
│Hash:A│─────────►│Hash:B│─────────►│Hash:C│─────────►│Hash:D│
│Prev:0│          │Prev:A│          │Prev:B│          │Prev:C│
└──────┘          └──────┘          └──────┘          └──────┘

                     TAMPER ATTEMPT:
                         │
                         ▼
              ┌─────────────────────┐
              │  HASH MISMATCH!     │
              │  Chain Broken ❌     │
              │  Alert Security 🚨   │
              └─────────────────────┘
```

---

## CendiaSentry™ - Guardrails Workflow

```
               ┌────────────────────────────────────┐
               │        AI AGENT OUTPUT             │
               │     (Response from Ollama)         │
               └──────────────────┬─────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      GUARDRAIL PIPELINE                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ CONTENT  │  │   PII    │  │   BIAS   │  │HALLUCIN- │            │
│  │  FILTER  │─►│ DETECTOR │─►│ DETECTOR │─►│ATION CHK │            │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │
│       │             │             │             │                   │
│       ▼             ▼             ▼             ▼                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │COMPLIANCE│  │ ETHICAL  │  │ TOXICITY │  │CONFIDENCE│            │
│  │  CHECK   │─►│  REVIEW  │─►│  FILTER  │─►│THRESHOLD │            │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │
│                                                                      │
└─────────────────────────────────┬────────────────────────────────────┘
                                  │
                 ┌────────────────┴────────────────┐
                 │                                 │
                 ▼                                 ▼
        ┌───────────────┐                 ┌───────────────┐
        │    PASSED     │                 │    FAILED     │
        │  All Guards   │                 │  Violation    │
        └───────┬───────┘                 └───────┬───────┘
                │                                 │
                ▼                                 ▼
        ┌───────────────┐         ┌─────────────────────────┐
        │    DELIVER    │         │    SEVERITY ACTION      │
        │   RESPONSE    │         ├─────────────────────────┤
        └───────────────┘         │ BLOCK: ❌ Reject        │
                                  │ WARN:  ⚠️ Add warning   │
                                  │ FLAG:  🏷️ Tag review    │
                                  └─────────────────────────┘
```

## PII Detection & Redaction

```
ORIGINAL:
┌─────────────────────────────────────────────────────────────┐
│ "Contact John Smith at john.smith@company.com              │
│  or call 555-123-4567. SSN: 123-45-6789"                   │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   PATTERN MATCHING    │
                    ├───────────────────────┤
                    │ 📧 Email detected     │
                    │ 📱 Phone detected     │
                    │ 🔢 SSN detected       │
                    │ 👤 Name detected      │
                    └───────────┬───────────┘
                                │
                                ▼
REDACTED:
┌─────────────────────────────────────────────────────────────┐
│ "Contact [REDACTED_NAME] at [REDACTED_EMAIL]               │
│  or call [REDACTED_PHONE]. SSN: [REDACTED_SSN]"            │
└─────────────────────────────────────────────────────────────┘
```

## Bias Detection Categories

```
┌─────────────────────────────────────────────────────────────┐
│                    BIAS DETECTION                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   GENDER    │  │    RACE     │  │    AGE      │         │
│  │    Bias     │  │    Bias     │  │    Bias     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  RELIGION   │  │  POLITICAL  │  │ DISABILITY  │         │
│  │    Bias     │  │    Bias     │  │    Bias     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                              │
│  Each detected phrase receives:                              │
│  • Severity rating (Low/Medium/High)                        │
│  • Alternative suggestion                                    │
│  • Context explanation                                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```
