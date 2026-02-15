# DCII — Decision Crisis Immunization Infrastructure Workflows

> **Directory:** `backend/src/services/dcii/`
> **Purpose:** The category-defining framework that proves an organization's governance is real — 9 primitives measured by the IISS score (0-1000), with insurance pricing impact, investor requirements, and competitive advantage.

## DCII Suite Overview

```mermaid
flowchart TB
    subgraph "9 DCII Primitives"
        P1["P1: Discovery-Time Proof<br/>(TimestampAuthority)"]
        P2["P2: Deliberation Capture<br/>(Council + Decision Packets)"]
        P3["P3: Override Accountability<br/>(Dissent + Veto + Audit)"]
        P4["P4: Continuity Memory<br/>(DecisionSimilarity)"]
        P5["P5: Drift Detection<br/>(Apotheosis + Echo)"]
        P6["P6: Cognitive Bias Mitigation<br/>(CognitiveBiasMitigation)"]
        P7["P7: Quantum-Resistant Integrity<br/>(KMS/HSM Signing)"]
        P8["P8: Synthetic Media Auth<br/>(SyntheticMediaAuth)"]
        P9["P9: Cross-Jurisdiction Compliance<br/>(CrossJurisdictionConflict)"]
    end

    P1 & P2 & P3 & P4 & P5 & P6 & P7 & P8 & P9 --> IISS["CendiaIISS™<br/>Institutional Immune System Score<br/>0 - 1000"]

    IISS --> B1["Insurance: 20-40% premium reduction (IISS > 800)"]
    IISS --> B2["Investors: ESG funds require IISS > 700"]
    IISS --> B3["Competitive: Win business with governance proof"]

    style IISS fill:#6366f1,color:#fff
    style B1 fill:#10b981,color:#fff
    style B2 fill:#3b82f6,color:#fff
    style B3 fill:#f59e0b,color:#fff
```

---

## IISSService — Institutional Immune System Score

```mermaid
flowchart TD
    A["assessOrganization(orgId)"] --> B["For Each of 9 Dimensions"]

    B --> C["Assess Controls per Dimension"]
    C --> D["Each Control: implemented / partial /<br/>not_implemented / not_applicable"]
    D --> E["Score = sum(control scores)"]
    E --> F["NormalizedScore = score / maxScore * 100"]

    F --> G["Apply Dimension Weights"]
    G --> H["weightedSum = Σ(normalizedScore × weight)"]

    subgraph "Dimension Weights"
        W1["discovery_time_proof: 0.15"]
        W2["deliberation_capture: 0.15"]
        W3["override_accountability: 0.12"]
        W4["continuity_memory: 0.10"]
        W5["drift_detection: 0.10"]
        W6["cognitive_bias_mitigation: 0.10"]
        W7["quantum_resistant_integrity: 0.10"]
        W8["synthetic_media_auth: 0.08"]
        W9["cross_jurisdiction_compliance: 0.10"]
    end

    H --> I["overallScore = round(weightedSum × 10)"]
    I --> J{Score Band?}
    J -->|0-200| K["CRITICAL"]
    J -->|201-400| L["VULNERABLE"]
    J -->|401-600| M["DEVELOPING"]
    J -->|601-800| N["RESILIENT"]
    J -->|801-1000| O["EXCEPTIONAL"]

    K & L & M & N & O --> P{Certification Level?}
    P -->|0-200| P1["None"]
    P -->|201-500| P2["Bronze"]
    P -->|501-700| P3["Silver"]
    P -->|701-850| P4["Gold"]
    P -->|851-1000| P5["Platinum"]

    P1 & P2 & P3 & P4 & P5 --> Q["Generate IISSScore + Findings"]
    Q --> R["Save to dcii_assessments Table"]

    style A fill:#6366f1,color:#fff
    style O fill:#10b981,color:#fff
    style K fill:#ef4444,color:#fff
    style P5 fill:#f59e0b,color:#fff
```

## CognitiveBiasMitigationService — Bias Detection

```mermaid
flowchart TD
    A["analyzeDeliberation(deliberationId)"] --> B["Load Deliberation + Responses"]
    B --> C["Test for 12 Cognitive Biases"]

    subgraph "12 Bias Tests"
        T1["Anchoring — fixating on first data point"]
        T2["Confirmation — seeking only supporting evidence"]
        T3["Groupthink — unanimous without debate"]
        T4["Availability — overweighting recent events"]
        T5["Sunk Cost — continuing due to past investment"]
        T6["Overconfidence — excessive certainty"]
        T7["Bandwagon — following majority without analysis"]
        T8["Framing — conclusions differ by presentation"]
        T9["Status Quo — preferring current state"]
        T10["Recency — overweighting recent vs historical"]
        T11["Authority — deferring without scrutiny"]
        T12["Survivorship — conclusions from successes only"]
    end

    C --> D["For Each Bias: confidence (0-1) + risk level"]
    D --> E["Rubber-Stamp Detection"]
    E --> F{Duration < minimumExpected?}
    F -->|Yes| G["rubberStampDetected = true"]
    F -->|No| H["Check Groupthink Indicators"]

    H --> I["unanimousVote? dissentCount?<br/>devilsAdvocatePresent? challengeCount?"]
    I --> J["Generate BiasAnalysis"]
    J --> K["Hash analysis for integrity"]
    K --> L["Return: biasesDetected, overallRisk,<br/>recommendations"]

    style A fill:#6366f1,color:#fff
    style G fill:#ef4444,color:#fff
    style T3 fill:#f59e0b,color:#fff
```

## TimestampAuthorityService — RFC 3161 Cryptographic Timestamps

```mermaid
flowchart TD
    A["timestampData(dataHash, dataType)"] --> B["Step 1: Internal Timestamp"]
    B --> C["Server clock + NTP sync check"]
    C --> D["Sign with internal key"]

    D --> E["Step 2: External RFC 3161 Timestamp"]
    E --> F{TSA Provider?}
    F -->|DigiCert| G["POST to DigiCert TSA"]
    F -->|Comodo| H["POST to Comodo TSA"]
    F -->|FreeTSA| I["POST to FreeTSA"]
    F -->|Internal| J["Use internal CA"]

    G & H & I & J --> K["Receive Timestamp Token"]
    K --> L["Verify certificate chain"]
    L --> M["Extract: serialNumber, generationTime, policyId"]

    M --> N{Blockchain Anchor Requested?}
    N -->|Yes| O["Step 3: Blockchain Anchor"]
    O --> P{Network?}
    P -->|Bitcoin| Q["Anchor to Bitcoin"]
    P -->|Ethereum| R["Anchor to Ethereum"]
    P -->|Polygon| S["Anchor to Polygon"]
    Q & R & S --> T["Store txHash + blockNumber"]
    N -->|No| U["Skip Blockchain"]

    T & U --> V["Save TimestampToken to DB"]
    V --> W["Dual timestamp: internal + external"]

    style A fill:#6366f1,color:#fff
    style E fill:#3b82f6,color:#fff
    style O fill:#8b5cf6,color:#fff
    style W fill:#10b981,color:#fff
```

## DecisionSimilarityService — Historical Decision Matching

```mermaid
flowchart TD
    A["findSimilar(newDecision)"] --> B["Generate Embedding via Ollama"]
    B --> C["pgvector: Cosine Similarity Search"]
    C --> D["Filter by: org, department, type"]

    D --> E["For Each Match"]
    E --> F["Calculate Similarity Dimensions"]
    F --> G["contextual + semantic + structural +<br/>temporal + outcome similarities"]

    G --> H["matchStrength: exact / strong /<br/>moderate / weak / tangential"]
    H --> I{Past Outcome Known?}
    I -->|Yes| J["Generate Warning"]
    J --> K["'Similar decision in 2019 by former CTO.<br/>Dissenters were proven correct.'"]
    I -->|No| L["No outcome data yet"]

    K & L --> M["Generate Insights"]
    M --> N["Cross-department pattern detection"]
    N --> O["Dissenter accuracy tracking"]
    O --> P["Return SimilarityMatch[] sorted by relevance"]

    style A fill:#6366f1,color:#fff
    style K fill:#ef4444,color:#fff
    style P fill:#10b981,color:#fff
```

## CrossJurisdictionConflictService — Regulatory Conflict Resolution

```mermaid
flowchart TD
    A["detectConflicts(orgId, jurisdictions)"] --> B["Load Active Frameworks per Jurisdiction"]
    B --> C["22 Jurisdictions × 35 Frameworks"]

    C --> D["Compare Requirements Pairwise"]
    D --> E{Conflict Detected?}
    E -->|Yes| F["Create RegulatoryConflict"]
    F --> G["conflictType: data_transfer / consent /<br/>retention / deletion / breach_reporting / etc."]
    G --> H["severity: irreconcilable → theoretical"]

    H --> I["proposeResolution()"]
    I --> J{Strategy?}
    J -->|highest_standard| K["Apply strictest requirement"]
    J -->|jurisdiction_priority| L["Rank by enforcement risk"]
    J -->|data_localization| M["Keep data in each jurisdiction"]
    J -->|good_faith_maximum| N["Document maximum compliance effort"]
    J -->|regulatory_sandbox| O["Apply for exemption"]

    K & L & M & N & O --> P["Generate Resolution Documentation"]
    P --> Q["Jurisdiction-specific evidence packets"]

    style A fill:#6366f1,color:#fff
    style F fill:#ef4444,color:#fff
    style N fill:#f59e0b,color:#fff
```

## SyntheticMediaAuthService — Deepfake & Evidence Authentication

```mermaid
flowchart TD
    A["registerMediaAsset(file)"] --> B["Hash Content (SHA-256/384/512)"]
    B --> C["Record Provenance"]
    C --> D["source: camera / scanner / upload / api"]
    D --> E["C2PA Manifest (if available)"]

    F["verifyAuthenticity(assetId)"] --> G["Multi-Layer Analysis"]
    G --> H["Metadata Consistency Check"]
    G --> I["Pixel/Audio Artifact Detection"]
    G --> J["C2PA Signature Verification"]
    G --> K["Hardware Attestation Check"]

    H & I & J & K --> L["Combine Scores"]
    L --> M{Verdict?}
    M -->|authentic| N["✓ Authentic"]
    M -->|likely_authentic| O["Probably Authentic"]
    M -->|inconclusive| P["Cannot Determine"]
    M -->|likely_synthetic| Q["⚠ Likely Synthetic"]
    M -->|synthetic| R["✗ Synthetic/Deepfake"]
    M -->|tampered| S["✗ Tampered"]

    T["trackCustody(assetId, action)"] --> U["Append to Chain of Custody"]
    U --> V["Actions: created, edited, signed,<br/>exported, transmitted, stored,<br/>verified, accessed, copied, redacted"]

    style A fill:#6366f1,color:#fff
    style F fill:#3b82f6,color:#fff
    style R fill:#ef4444,color:#fff
    style N fill:#10b981,color:#fff
```

## Key Code References

| Service | File | Purpose |
|---------|------|---------|
| **IISSService** | `IISSService.ts` | 9-dimension scoring, 0-1000 scale, certification levels, weighted assessment |
| **CognitiveBiasMitigation** | `CognitiveBiasMitigationService.ts` | 12 bias tests, rubber-stamp detection, groupthink indicators |
| **TimestampAuthority** | `TimestampAuthorityService.ts` | RFC 3161, 6 TSA providers, blockchain anchoring (BTC/ETH/Polygon) |
| **DecisionSimilarity** | `DecisionSimilarityService.ts` | Vector similarity search, outcome-aware warnings, dissenter tracking |
| **CrossJurisdictionConflict** | `CrossJurisdictionConflictService.ts` | 22 jurisdictions, 35 frameworks, 9 resolution strategies |
| **SyntheticMediaAuth** | `SyntheticMediaAuthService.ts` | C2PA compliance, deepfake detection, chain of custody, hardware attestation |
| **DB Tables:** | Prisma | `dcii_assessments`, `dcii_timestamp_tokens`, `dcii_media_assets` |
