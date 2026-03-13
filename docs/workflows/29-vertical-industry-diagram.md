# Datacendia Platform — Vertical / Industry Customization Diagrams

> **Directories:** `backend/src/services/verticals/`, `backend/src/services/sports/`, `backend/src/services/command/`
> **Purpose:** Industry-specific deployments with 6-layer completeness standard — data connectors, RAG knowledge base, compliance mapping, decision schemas, agent presets, and defensible outputs.

## Vertical Completion Matrix

```mermaid
flowchart TB
    subgraph "6-Layer Completeness Standard"
        L1["Layer 1: Authoritative Data Connectors"]
        L2["Layer 2: Vertical Knowledge Base (RAG)"]
        L3["Layer 3: Compliance & Liability Mapping"]
        L4["Layer 4: Decision Schemas"]
        L5["Layer 5: Agent Presets"]
        L6["Layer 6: Externally Defensible Outputs"]
    end

    subgraph "Completion Status"
        V1["Legal: 100% ✅"]
        V2["Financial: 100% ✅"]
        V3["Government: 80%"]
        V4["Healthcare: 75%"]
        V5["Insurance: 75%"]
        V6["Energy: 75%"]
        V7["Sports: 60%"]
        V8["Defense: 50%"]
        V9["Manufacturing: 30%"]
        V10["Others: 20-30%"]
    end

    L1 & L2 & L3 & L4 & L5 & L6 --> V1
    L1 & L2 & L3 & L4 & L5 & L6 --> V2

    style V1 fill:#10b981,color:#fff
    style V2 fill:#10b981,color:#fff
    style V3 fill:#3b82f6,color:#fff
    style V4 fill:#f59e0b,color:#fff
    style V5 fill:#f59e0b,color:#fff
    style V6 fill:#f59e0b,color:#fff
```

## Vertical Architecture Pattern

```mermaid
flowchart TD
    A["VerticalPattern (Core Abstract)"] --> B["Concrete Vertical Implementation"]

    B --> C1["Data Connectors"]
    C1 --> C1a["Systems of record for this industry"]
    C1 --> C1b["API adapters + sync schedules"]

    B --> C2["Knowledge Base (RAG)"]
    C2 --> C2a["Industry-specific corpus"]
    C2 --> C2b["Provenance enforcement"]
    C2 --> C2c["Citation tracking"]

    B --> C3["Compliance Mapping"]
    C3 --> C3a["Industry regulations"]
    C3 --> C3b["Machine-enforced rules"]
    C3 --> C3c["Auto-remediation"]

    B --> C4["Decision Schemas"]
    C4 --> C4a["Industry-specific objects"]
    C4 --> C4b["Validation rules"]
    C4 --> C4c["Workflow templates"]

    B --> C5["Agent Presets"]
    C5 --> C5a["Specialized AI personas"]
    C5 --> C5b["Tied to workflows, not personas"]
    C5 --> C5c["Council mode configurations"]

    B --> C6["Defensible Outputs"]
    C6 --> C6a["Regulator-ready"]
    C6 --> C6b["forensic-grade, independently verifiable"]
    C6 --> C6c["Auditor-verifiable"]

    style A fill:#6366f1,color:#fff
```

## Legal Vertical (100% Complete)

```mermaid
flowchart LR
    subgraph "Layer 1: Data Connectors"
        L1a["iManage, NetDocuments"]
        L1b["Westlaw, LexisNexis"]
        L1c["Clio, PracticePanther"]
        L1d["Relativity, Nuix"]
        L1e["Ironclad, DocuSign CLM"]
    end

    subgraph "Layer 2: Knowledge Base"
        L2a["CourtListener API (case law)"]
        L2b["eCFR (federal regs)"]
        L2c["Open States (state bills)"]
        L2d["45K+ offline cases backup"]
    end

    subgraph "Layer 3: Compliance"
        L3a["ABA Model Rules"]
        L3b["SRA UK"]
        L3c["EU AI Act"]
        L3d["GDPR"]
        L3e["Attorney-Client Privilege"]
    end

    subgraph "Layer 4: Decision Schemas"
        L4a["Matter (8 types)"]
        L4b["CaseLaw"]
        L4c["MatterDocument"]
    end

    subgraph "Layer 5: Agent Presets"
        L5a["Legal Strategist"]
        L5b["Contract Analyst"]
        L5c["Compliance Auditor"]
        L5d["Research Associate"]
        L5e["Ethics Counsel"]
    end

    subgraph "Layer 6: Outputs"
        L6a["Signed evidence packets"]
        L6b["Privilege-gated exports"]
        L6c["Regulator receipts"]
    end
```

## Financial Vertical (100% Complete)

```mermaid
flowchart LR
    subgraph "Layer 1: Data Connectors"
        F1a["Market data feeds"]
        F1b["SEC EDGAR"]
        F1c["Bloomberg (optional)"]
        F1d["Client portfolio systems"]
    end

    subgraph "Layer 2: Knowledge Base"
        F2a["Financial regulations corpus"]
        F2b["Market analysis data"]
        F2c["Historical filings"]
    end

    subgraph "Layer 3: Compliance"
        F3a["SOX"]
        F3b["Dodd-Frank"]
        F3c["GLBA"]
        F3d["Basel III"]
        F3e["MiFID II"]
        F3f["PCI-DSS"]
    end

    subgraph "Layer 4: Decision Schemas"
        F4a["Investment Decision"]
        F4b["Risk Assessment"]
        F4c["Compliance Filing"]
        F4d["Portfolio Rebalance"]
    end

    subgraph "Layer 5: Agent Presets"
        F5a["Risk Analyst"]
        F5b["Compliance Officer"]
        F5c["Portfolio Manager"]
        F5d["Regulatory Specialist"]
    end

    subgraph "Layer 6: Outputs"
        F6a["SEC-ready filings"]
        F6b["Audit-grade reports"]
        F6c["Signed risk assessments"]
    end
```

## Healthcare Vertical (75% Complete)

```mermaid
flowchart TD
    subgraph "Implemented ✓"
        H1["SaMD (Software as Medical Device) boundaries"]
        H2["HIPAA compliance framework"]
        H3["Consent ledger for patient data"]
        H4["Clinical decision schemas"]
        H5["Healthcare AI agents"]
    end

    subgraph "Roadmap"
        H6["HL7 FHIR data connectors"]
        H7["EHR system integration"]
        H8["FDA 21 CFR Part 11"]
    end

    style H6 fill:#f59e0b,color:#fff
    style H7 fill:#f59e0b,color:#fff
    style H8 fill:#f59e0b,color:#fff
```

## Energy Vertical (75% Complete)

```mermaid
flowchart TD
    subgraph "Implemented ✓"
        E1["NERC CIP compliance framework"]
        E2["Safety-first decision framework"]
        E3["DataDiode integration (sovereign ingest)"]
        E4["Energy-specific decision schemas"]
        E5["Energy AI agents"]
    end

    subgraph "Roadmap"
        E6["SCADA system connectors"]
        E7["Grid monitoring integration"]
        E8["Environmental impact scoring"]
    end

    style E6 fill:#f59e0b,color:#fff
    style E7 fill:#f59e0b,color:#fff
    style E8 fill:#f59e0b,color:#fff
```

## Sports Vertical — Crisis Immunization Framework

```mermaid
flowchart TD
    subgraph "5 DCII Primitives for Sports"
        P1["Discovery-Time Proof<br/>RFC 3161 timestamps on transfer decisions"]
        P2["Deliberation Capture<br/>Full council transcript with agent positions"]
        P3["Override Accountability<br/>If board overrides agents, it's on record"]
        P4["Continuity Memory<br/>New sporting director inherits all decisions"]
        P5["Drift Detection<br/>Alert when transfer strategy deviates from policy"]
    end

    subgraph "Sports-Specific Features"
        S1["Transfer DDGI"]
        S2["FIFA TMS Compliance"]
        S3["UEFA FFP Compliance"]
        S4["Player/Club/Agent tracking"]
        S5["Financial structure analysis"]
    end

    subgraph "Go-to-Market Targets"
        T1["FIFA (Lydie Specque)"]
        T2["UEFA (Andrea Traverso)"]
        T3["Celtic FC (Michael Nicholson)"]
        T4["Barcelona, Man United, Chelsea"]
    end

    P1 & P2 & P3 & P4 & P5 --> IISS["Club IISS Score"]
    S1 & S2 & S3 & S4 & S5 --> IISS

    style IISS fill:#6366f1,color:#fff
```

## CendiaCommand — Vertical Command Interface

```mermaid
flowchart TD
    A["Natural Language Input"] --> B{Which Vertical?}

    B -->|financial| C["Quick Actions:<br/>Run portfolio stress test<br/>Check SOX compliance<br/>Generate risk report"]
    B -->|legal| D["Quick Actions:<br/>Search case law<br/>Run conflict check<br/>Draft privilege review"]
    B -->|healthcare| E["Quick Actions:<br/>Check HIPAA compliance<br/>Review consent status<br/>Generate clinical summary"]
    B -->|government| F["Quick Actions:<br/>Run policy impact analysis<br/>Check FedRAMP status<br/>Generate citizen impact report"]
    B -->|energy| G["Quick Actions:<br/>Check NERC CIP status<br/>Run grid risk assessment<br/>Safety incident analysis"]
    B -->|sports| H["Quick Actions:<br/>Evaluate transfer target<br/>Check FFP compliance<br/>Squad balance analysis"]

    C & D & E & F & G & H --> I["Route to Council with<br/>vertical-specific agents +<br/>compliance frameworks"]

    style A fill:#6366f1,color:#fff
    style I fill:#10b981,color:#fff
```

## Vertical Sentinel Service — Cross-Vertical Monitoring

```mermaid
flowchart TD
    A["VerticalSentinelService"] --> B["Monitor All Active Verticals"]
    B --> C["For Each Vertical"]
    C --> D["Check: Data freshness"]
    C --> E["Check: Compliance status"]
    C --> F["Check: Agent health"]
    C --> G["Check: Knowledge base coverage"]

    D & E & F & G --> H{Issues Found?}
    H -->|Yes| I["Generate Alert"]
    I --> J["Notify vertical admin"]
    I --> K["Auto-trigger re-assessment if compliance"]
    H -->|No| L["Vertical healthy ✓"]

    style A fill:#6366f1,color:#fff
    style I fill:#ef4444,color:#fff
    style L fill:#10b981,color:#fff
```

## Key Code References

| Component | File | Purpose |
|-----------|------|---------|
| **VerticalPattern** | `verticals/core/VerticalPattern.ts` | Abstract 6-layer pattern |
| **FinancialVertical** | `verticals/financial/FinancialVertical.ts` | 100% complete: 4 schemas, 6 frameworks, 4 agents |
| **HealthcareVertical** | `verticals/healthcare/HealthcareVertical.ts` | 75%: SaMD, consent, clinical schemas |
| **InsuranceVertical** | `verticals/insurance/InsuranceVertical.ts` | 75%: ACORD schemas, bias engine |
| **EnergyVertical** | `verticals/energy/EnergyVertical.ts` | 75%: NERC CIP, data diode |
| **VerticalAgents** | `VerticalAgentsService.ts` | AI agents for all verticals |
| **VerticalSentinel** | `verticals/meta/VerticalSentinelService.ts` | Cross-vertical monitoring |
| **SportsDecision** | `sports/SportsDecisionService.ts` | Transfer governance, FIFA/UEFA compliance |
| **CendiaCommand** | `command/CendiaCommandService.ts` | 15 vertical command interfaces |
| **Spec** | `docs/VERTICAL_COMPLETION_SPEC.md` | v1.1 completion standard |
