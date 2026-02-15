# Legal Services Suite Workflows

> **Directory:** `backend/src/services/legal/`
> **Purpose:** Enterprise Platinum legal vertical — case law ingestion, matter management, privilege enforcement, compliance gates, and real legal research APIs. **100% complete vertical.**

## Legal Suite Overview

```mermaid
flowchart TB
    subgraph "Legal Intelligence Suite"
        LV["LegalVerticalService<br/>Case Law + Matter Management"]
        LR["LegalResearchService<br/>5 Live Legal APIs"]
        BG["CendiaBridgeService<br/>DMS + eDiscovery Integration"]
        GV["CendiaGovernService<br/>Policy Enforcement Engine"]
        VT["CendiaVetoService<br/>Approval Gates"]
        LA["LegalAgents<br/>Specialized AI Personas"]
        LCM["LegalCouncilModes<br/>Practice-Area Modes"]
        CI["CaseImportService<br/>Bulk Case Import"]
    end

    LR -->|"Case law + regulations"| LV
    BG -->|"Documents + matters"| LV
    GV -->|"Policy checks"| VT
    LA -->|"Agent personas"| CS["CouncilService"]
    LCM -->|"Council modes"| CS

    style LV fill:#6366f1,color:#fff
    style LR fill:#3b82f6,color:#fff
    style GV fill:#ef4444,color:#fff
    style VT fill:#f59e0b,color:#fff
```

---

## LegalVerticalService — Case Law & Matter Management

```mermaid
flowchart TD
    subgraph "Case Law Ingestion"
        A["Import Case Law"] --> B["Parse: citation, court, jurisdiction,<br/>date, parties, holdings"]
        B --> C["Extract Key Passages"]
        C --> D["Build Citation Graph (citedBy / cites)"]
        D --> E["Hash for Integrity"]
        E --> F["Store in Case Law Database"]
    end

    subgraph "Matter Management"
        G["Create Matter"] --> H["Assign: matterNumber, practiceArea,<br/>responsibleAttorney, team"]
        H --> I["Clear Conflicts"]
        I --> J["Set Privilege Level"]
        J --> K["attorney-client / work-product /<br/>common-interest / confidential / public"]
        K --> L["Track Documents + Deliberations"]
    end

    subgraph "Privilege Gate"
        M["Access Request"] --> N{Privilege Level?}
        N -->|attorney-client| O["Require: matter team member"]
        N -->|work-product| P["Require: authorized attorney"]
        N -->|common-interest| Q["Require: joint defense member"]
        N -->|confidential| R["Require: org member"]
        N -->|public| S["Allow all"]
        O & P & Q & R --> T["Log Access in Audit Trail"]
    end

    style A fill:#6366f1,color:#fff
    style G fill:#3b82f6,color:#fff
    style M fill:#f59e0b,color:#fff
```

## LegalResearchService — Live Legal API Integration

```mermaid
flowchart TD
    A["Legal Research Query"] --> B{Source Selection}

    B -->|Case Law| C["CourtListener API<br/>courtlistener.com/api/rest/v3"]
    B -->|Federal Regs| D["eCFR API<br/>ecfr.gov/api"]
    B -->|State Bills| E["Open States API<br/>v3.openstates.org"]
    B -->|Fed Register| F["Federal Register API<br/>federalregister.gov/api/v1"]
    B -->|SEC Filings| G["SEC EDGAR API<br/>data.sec.gov"]
    B -->|Premium| H["Westlaw API<br/>(if configured)"]

    C --> I["LegalSearchResult[]"]
    D --> I
    E --> I
    F --> I
    G --> I
    H --> I

    I --> J["Rank by relevanceScore"]
    J --> K["Attach citations + metadata"]
    K --> L["Return to Council Agent"]

    subgraph "Retry & Resilience"
        M["MAX_RETRIES: 3"]
        N["RETRY_DELAY: 1000ms"]
        O["TIMEOUT: 30000ms"]
        P["45K+ Offline Cases Backup"]
    end

    style C fill:#10b981,color:#fff
    style D fill:#10b981,color:#fff
    style E fill:#10b981,color:#fff
    style F fill:#10b981,color:#fff
    style G fill:#10b981,color:#fff
    style H fill:#8b5cf6,color:#fff
```

## CendiaBridgeService — Legal System Integration

```mermaid
flowchart TD
    subgraph "13 Connector Types"
        A1["iManage — DMS"]
        A2["NetDocuments — DMS"]
        A3["Westlaw — Case Law"]
        A4["LexisNexis — Case Law"]
        A5["Clio — Practice Management"]
        A6["PracticePanther — Practice Management"]
        A7["Relativity — eDiscovery"]
        A8["Nuix — eDiscovery"]
        A9["Ironclad — CLM"]
        A10["DocuSign CLM — Contracts"]
        A11["SharePoint — Documents"]
        A12["File System — Local"]
        A13["API — Custom"]
    end

    A1 & A2 & A3 & A4 & A5 & A6 & A7 & A8 & A9 & A10 & A11 & A12 & A13 --> B["CendiaBridge Connector"]
    B --> C["Create IngestJob"]
    C --> D["Process Items"]
    D --> E["Hash Each Item (SHA-256)"]
    E --> F["Store IngestedItem"]
    F --> G["Log to Audit Trail"]

    subgraph "8 Data Types"
        D1[document]
        D2[case_law]
        D3[matter]
        D4[client]
        D5[contract]
        D6[email]
        D7[production_set]
        D8[time_entry]
    end

    style B fill:#6366f1,color:#fff
```

## CendiaGovernService — Policy Enforcement

```mermaid
flowchart TD
    A["runComplianceCheck(frameworks, matter)"] --> B["Select Applicable Rules"]
    B --> C["For Each Rule"]

    subgraph "7 Compliance Frameworks"
        F1["ABA Model Rules<br/>1.1, 1.4, 1.6, 1.7, 1.15, 5.1, 5.3"]
        F2["SRA UK<br/>competence, confidentiality, conflicts, client money"]
        F3["EU AI Act<br/>transparency, human oversight, data governance, risk mgmt"]
        F4["GDPR<br/>lawful basis, minimization, purpose limitation, etc."]
        F5["State Bar Rules"]
        F6["Attorney-Client Privilege"]
        F7["Work Product Doctrine"]
    end

    C --> D["Execute Check Function"]
    D --> E{Violation?}
    E -->|Yes| F["Create PolicyViolation"]
    F --> G{autoEnforce?}
    G -->|Yes| H["Auto-Remediate"]
    G -->|No| I["Alert for Manual Review"]
    E -->|No| J["Rule Passed"]

    H & I & J --> K["ComplianceReport"]
    K --> L["overallStatus: compliant / non_compliant / partial"]
    L --> M["score: 0-100"]

    style A fill:#6366f1,color:#fff
    style F fill:#ef4444,color:#fff
    style H fill:#10b981,color:#fff
```

## CendiaVetoService — Approval Gates

```mermaid
flowchart TD
    A["Sensitive Action Requested"] --> B{Gate Type?}

    B -->|privilege_export| C["Require: privilege_officer"]
    B -->|client_communication| D["Require: matter_lead"]
    B -->|court_filing| E["Require: supervising_partner"]
    B -->|regulatory_submission| F["Require: general_counsel"]
    B -->|ai_output_release| G["Require: matter_lead + ethics_counsel"]
    B -->|conflict_waiver| H["Require: ethics_counsel + managing_partner"]

    C & D & E & F & G & H --> I["Create VetoGate"]
    I --> J["Set Expiration Timer"]
    J --> K["Notify Required Approvers"]

    K --> L{Approver Decision?}
    L -->|approve| M["Record Approval + Signature"]
    L -->|reject| N["Block Action + Record Rationale"]
    L -->|escalate| O["Escalate to Next Level"]
    L -->|timeout| P{autoEscalateOnTimeout?}
    P -->|Yes| O
    P -->|No| Q["Gate Expired"]

    M --> R{All Required Approvers?}
    R -->|Yes| S["Gate APPROVED — Action Proceeds"]
    R -->|No| T["Wait for Remaining Approvers"]

    N --> U["Gate REJECTED — Action Blocked"]

    subgraph "Audit Chain"
        V["Every action hashed"]
        W["previousHash links"]
        X["Tamper-proof trail"]
    end

    style A fill:#6366f1,color:#fff
    style S fill:#10b981,color:#fff
    style U fill:#ef4444,color:#fff
    style O fill:#f59e0b,color:#fff
```

## Legal Council Agents & Modes

```mermaid
graph TD
    subgraph "Legal AI Agents"
        AG1["Legal Strategist<br/>Litigation strategy + case assessment"]
        AG2["Contract Analyst<br/>Deal structure + risk identification"]
        AG3["Compliance Auditor<br/>Regulatory alignment + gap analysis"]
        AG4["Research Associate<br/>Case law + statutory research"]
        AG5["Ethics Counsel<br/>Professional responsibility + conflicts"]
    end

    subgraph "Legal Council Modes"
        M1["Litigation Strategy<br/>Case assessment + win probability"]
        M2["Contract Review<br/>Risk identification + negotiation leverage"]
        M3["Regulatory Analysis<br/>Compliance gap + remediation"]
        M4["Ethics Review<br/>Conflict check + privilege analysis"]
        M5["Due Diligence<br/>M&A risk assessment"]
    end

    AG1 & AG2 & AG3 & AG4 & AG5 --> CS["CouncilService"]
    M1 & M2 & M3 & M4 & M5 --> CS
```

## Key Code References

| Service | File | Purpose |
|---------|------|---------|
| **LegalVertical** | `LegalVerticalService.ts` | Case law DB, matter management, privilege gates, citation enforcement |
| **LegalResearch** | `LegalResearchService.ts` | Live APIs: CourtListener, eCFR, Open States, Fed Register, SEC EDGAR, Westlaw |
| **CendiaBridge** | `CendiaBridgeService.ts` | 13 connector types: iManage, Relativity, Clio, DocuSign CLM, etc. |
| **CendiaGovern** | `CendiaGovernService.ts` | 7 compliance frameworks, 23 rule IDs, auto-enforcement, scoring |
| **CendiaVeto** | `CendiaVetoService.ts` | 9 gate types, 6 approver roles, escalation chains, hash-chained audit |
| **LegalAgents** | `LegalAgents.ts` | 5 specialized AI personas for legal deliberation |
| **LegalCouncilModes** | `LegalCouncilModes.ts` | 5 practice-area council configurations |
| **CaseImport** | `CaseImportService.ts` | Bulk case law import and processing |
