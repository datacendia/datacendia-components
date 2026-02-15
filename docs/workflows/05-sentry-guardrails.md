# CendiaSentry AI Guardrails Workflow

> **Service:** `CendiaSentryService` (`backend/src/services/CendiaSentryService.ts`)
> **Purpose:** AI output monitoring, guardrails, bias detection, hallucination prevention — the enforcement mechanism for CendiaEthics.

## Content Check Pipeline

```mermaid
flowchart TD
    A["checkContent(input, output, agentId)"] --> B[Load Org Guardrail Config]
    B --> C{Config Exists?}
    C -->|Yes| D[Use Org Config]
    C -->|No| E[Use Default Config: 8 Guardrails]
    D & E --> F["Iterate Enabled Guardrails"]

    F --> G["runGuardrail() per Config"]

    G --> H[pii_detector]
    G --> I[toxicity_filter]
    G --> J[bias_detector]
    G --> K[hallucination_check]
    G --> L[financial_accuracy]
    G --> M[confidence_threshold]
    G --> N[scope_limiter]
    G --> O[content_filter]

    H --> P["Regex: Email, Phone, SSN,<br/>Credit Card, IP Address"]
    I --> Q["Regex + Keyword: hate, violence,<br/>harm, attack, destroy"]
    J --> R["Pattern: Gender, Age, Race bias<br/>in phrasing"]
    K --> S["Pattern: Uncited claims, absolutes,<br/>overconfident statements, unverified stats"]
    L --> T["Pattern: Dollar amounts, percentages,<br/>ROI claims without qualification"]
    M --> U["Ratio: Uncertainty words / total words<br/>Flag if > 5%"]
    N --> V["Overlap: Query keywords vs response keywords<br/>Flag if < 20% relevance"]

    P & Q & R & S & T & U & V --> W[Collect GuardrailResult per check]
    W --> X["Calculate overallScore = avg(scores)"]
    X --> Y{Any severity: 'block' Failed?}

    Y -->|Yes| Z["wasBlocked = true"]
    Z --> AA[Log to CendiaAuditService]

    Y -->|No| AB{PII Issues Found?}
    AB -->|Yes| AC["redactPII() → Replace with [REDACTED EMAIL] etc."]
    AC --> AD["wasModified = true"]
    AB -->|No| AE["wasModified = false"]

    AD & AE --> AF{Any Warnings?}
    AF -->|Yes| AG[Log to CendiaAuditService]
    AF -->|No| AH[Pass Clean]

    AA & AG & AH --> AI[Store SentryCheck in Memory]
    AI --> AJ[Increment Counters: sentry_checks, sentry_blocks]
    AJ --> AK["Return SentryCheck Result"]

    style A fill:#6366f1,color:#fff
    style H fill:#ef4444,color:#fff
    style I fill:#ef4444,color:#fff
    style J fill:#f59e0b,color:#fff
    style K fill:#f59e0b,color:#fff
    style L fill:#f59e0b,color:#fff
    style Z fill:#ef4444,color:#fff
    style AC fill:#f59e0b,color:#fff
    style AK fill:#10b981,color:#fff
```

## Guardrail Severity Levels

```mermaid
flowchart LR
    subgraph "Severity Actions"
        B["block"] -->|"Prevents output delivery"| B1["Content blocked entirely"]
        W["warn"] -->|"Allows with warning"| W1["Content passes + alert logged"]
        F["flag"] -->|"Marks for review"| F1["Content passes + flag for human review"]
        L["log"] -->|"Silent logging"| L1["Content passes + event logged"]
    end

    subgraph "Default Config"
        D1["content_filter → block (0.8)"]
        D2["toxicity_filter → block (0.9)"]
        D3["pii_detector → warn (0.9)"]
        D4["financial_accuracy → warn (0.8)"]
        D5["bias_detector → flag (0.7)"]
        D6["hallucination_check → flag (0.6)"]
        D7["scope_limiter → warn (0.7)"]
        D8["confidence_threshold → flag (0.5)"]
    end

    style B fill:#ef4444,color:#fff
    style W fill:#f59e0b,color:#fff
    style F fill:#3b82f6,color:#fff
    style L fill:#6b7280,color:#fff
```

## PII Detection & Redaction

```mermaid
sequenceDiagram
    participant Input as AI Output
    participant Sentry as CendiaSentryService
    participant Audit as CendiaAuditService

    Input->>Sentry: checkContent(output with PII)
    
    Sentry->>Sentry: checkPII() - Run 5 regex patterns
    Note over Sentry: Email: /[A-Za-z0-9._%+-]+@.../
    Note over Sentry: Phone: /\d{3}[-.]?\d{3}[-.]?\d{4}/
    Note over Sentry: SSN: /\d{3}[-]?\d{2}[-]?\d{4}/
    Note over Sentry: Credit Card: /(\d{4}[-\s]?){3}\d{4}/
    Note over Sentry: IP: /(\d{1,3}\.){3}\d{1,3}/
    
    Sentry->>Sentry: classifyPII(match) → type name
    Sentry->>Sentry: maskPII(match) → "jo****.com" (for logs)
    
    alt PII Found
        Sentry->>Sentry: redactPII() → "[REDACTED EMAIL]"
        Sentry->>Audit: logGuardrail(pii_detector, triggered)
        Sentry-->>Input: Modified output with redactions
    else No PII
        Sentry-->>Input: Original output unchanged
    end
```

## Key Code References

- **Main Entry:** `checkContent()` — runs all enabled guardrails, returns `SentryCheck`
- **Guardrail Dispatch:** `runGuardrail()` — switch/case routing to individual checkers
- **PII:** `checkPII()` → `classifyPII()` → `maskPII()` → `redactPII()`
- **Toxicity:** `checkToxicity()` — regex patterns + keyword heuristics with context awareness
- **Bias:** `checkBias()` — gender, age bias pattern detection
- **Hallucination:** `checkHallucination()` — uncited claims, absolute statements, unverified stats
- **Financial:** `checkFinancialAccuracy()` — unrealistic claims, unqualified figures
- **Confidence:** `checkConfidence()` — uncertainty word ratio analysis
- **Scope:** `checkScope()` — query/response keyword overlap relevance scoring
- **Audit Integration:** Logged to `CendiaAuditService.logGuardrail()` on block/warn
- **Statistics:** `getStatistics()` — passRate, blockRate, issuesByType, averageScore
