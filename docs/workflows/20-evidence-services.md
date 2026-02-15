# Evidence Services Suite Workflows

> **Directory:** `backend/src/services/evidence/`
> **Purpose:** Cryptographically sealed evidence management — decision packets, compliance bundles, regulator receipts, and signed test reports for court/audit readiness.

## Evidence Suite Overview

```mermaid
flowchart TB
    subgraph "Evidence Chain"
        EV["EvidenceVaultService<br/>Decision Packet Management"]
        EX["EvidenceExportService<br/>Regulator-Ready Exports"]
        CD["ComplianceDashboardService<br/>Real-Time Compliance View"]
        RR["RegulatorsReceiptService<br/>Proof of Delivery to Regulators"]
        ST["SignedTestReportService<br/>KMS-Signed Test Reports (PDF)"]
        TL["TestEvidenceLedgerService<br/>Immutable Test Record"]
    end

    EV -->|"Packets"| EX
    EV -->|"Status"| CD
    EX -->|"Receipt"| RR
    ST -->|"Report"| TL

    style EV fill:#6366f1,color:#fff
    style ST fill:#3b82f6,color:#fff
    style RR fill:#10b981,color:#fff
```

## EvidenceVaultService — Decision Packet Management

```mermaid
flowchart TD
    A["Decision Made"] --> B["Create DecisionPacket"]
    B --> C["Attach: dissents, vetoes, overrides,<br/>compliance frameworks, systems impacted"]
    C --> D["Generate integrityHash (SHA-256)"]

    D --> E{Workflow}
    E -->|Send for Review| F["Create ApprovalWorkflow"]
    F --> G["Route to: decision_owner → council_operator → approver"]
    G --> H{All Approved?}
    H -->|Yes| I["Status → APPROVED"]
    H -->|No| J["Status remains UNDER_REVIEW"]

    E -->|Attach Evidence| K["Upload Attachments"]
    K --> L["Hash each file"]
    L --> M["Category: evidence / supporting / reference / legal"]

    E -->|Lock Packet| N["Status → LOCKED"]
    N --> O["Set lockedAt timestamp"]
    O --> P["No further modifications allowed"]

    E -->|Break-Glass Export| Q["Require DUAL APPROVAL"]
    Q --> R["Two independent approvers must sign"]
    R --> S["Generate export with full audit trail"]
    S --> T["Record: who, when, why, approved by"]

    I --> U["accessLog tracks every view/download"]

    style A fill:#6366f1,color:#fff
    style I fill:#10b981,color:#fff
    style N fill:#f59e0b,color:#fff
    style Q fill:#ef4444,color:#fff
```

## SignedTestReportService — KMS-Signed PDF Reports

```mermaid
sequenceDiagram
    participant Test as Test Suite
    participant Report as SignedTestReportService
    participant PDF as PDFGeneratorService
    participant KMS as KeyManagementService
    participant Ledger as TestEvidenceLedger

    Test->>Report: generateReport(testResults)
    Report->>PDF: Generate PDF/A-3 document
    Note over PDF: Headers, tables, signature blocks,<br/>watermarks, compliance stamps
    PDF-->>Report: PDF binary

    Report->>Report: Hash PDF content (SHA-256)
    Report->>KMS: sign(pdfHash, signingKeyId)
    KMS-->>Report: Digital signature

    Report->>Report: Embed signature in PDF metadata
    Report->>Ledger: recordTestEvidence(report)
    Ledger->>Ledger: Append to immutable ledger
    Ledger->>Ledger: Update Merkle tree root

    Report-->>Test: Signed PDF + verification data
```

## RegulatorsReceiptService — Proof of Submission

```mermaid
flowchart TD
    A["Export Evidence for Regulator"] --> B["Package: decision packets + compliance data"]
    B --> C["Generate Merkle Tree of all included items"]
    C --> D["Sign package with KMS"]

    D --> E["Submit to Regulator"]
    E --> F["Record RegulatorsReceipt"]
    F --> G["Store: regulator name, submission ID,<br/>timestamp, package hash, receipt"]

    G --> H["Verification Endpoint"]
    H --> I["Any party can verify:<br/>1. Package hash matches<br/>2. Merkle root valid<br/>3. Signature valid<br/>4. Timestamp confirmed"]

    style A fill:#6366f1,color:#fff
    style D fill:#8b5cf6,color:#fff
    style I fill:#10b981,color:#fff
```

## Key Code References

| Service | File | Purpose |
|---------|------|---------|
| **EvidenceVault** | `EvidenceVaultService.ts` | RBAC packet management, approval workflows, break-glass export |
| **EvidenceExport** | `EvidenceExportService.ts` | Regulator-ready format exports |
| **ComplianceDashboard** | `ComplianceDashboardService.ts` | Real-time compliance status view |
| **RegulatorsReceipt** | `RegulatorsReceiptService.ts` | Proof of delivery with Merkle verification |
| **SignedTestReport** | `SignedTestReportService.ts` | KMS-signed PDF reports via PDFGeneratorService |
| **TestEvidenceLedger** | `TestEvidenceLedgerService.ts` | Immutable test record with Merkle tree |
