# CendiaDataDiode Sovereign Ingest Workflow

> **Service:** `DataDiodeService` (`backend/src/services/sovereign/DataDiodeService.ts`)
> **Purpose:** Unidirectional sovereign data ingest for air-gapped environments — data flows in, never out. Supports GRIB, CSV, JSON, XML, Parquet with signature verification and virus scanning.

## Ingest Event Lifecycle

```mermaid
stateDiagram-v2
    [*] --> detected: File appears in drop zone
    detected --> quarantined: Move to quarantine folder
    quarantined --> scanning: Virus/malware scan starts
    scanning --> signature_check: Scan passed (clean)
    scanning --> rejected: Scan failed (malicious)
    signature_check --> parsing: Signature valid
    signature_check --> rejected: Signature invalid
    parsing --> validating: Data extracted
    validating --> ingesting: Schema validation passed
    validating --> rejected: Schema validation failed
    ingesting --> completed: Written to internal systems
    ingesting --> failed: Write error
    parsing --> failed: Parse error

    rejected --> [*]: Moved to reject folder
    failed --> [*]: Moved to reject folder
    completed --> [*]: Moved to processed folder
```

## Full Processing Pipeline

```mermaid
flowchart TD
    A["File Detected in Watch Path"] --> B["Create IngestEvent"]
    B --> C["Calculate SHA-256 Hash"]
    C --> D["Status → detected"]

    D --> E["Move to Quarantine Folder"]
    E --> F["Status → quarantined"]
    F --> G["Wait quarantineDuration seconds"]

    G --> H["Status → scanning"]
    H --> I{Virus Scan Result?}
    I -->|clean| J["Status → signature_check"]
    I -->|suspicious| K["Log Warning, Continue"]
    I -->|malicious| L["Status → rejected"]
    K --> J

    J --> M{requireSignature?}
    M -->|Yes| N["Verify Digital Signature"]
    N --> O{Signature Valid?}
    O -->|Yes| P["signatureValid = true"]
    O -->|No| Q["Status → rejected"]
    M -->|No| P

    P --> R["Status → parsing"]
    R --> S{Data Format?}
    S -->|csv| T[CSV Parser]
    S -->|json/jsonl| U[JSON Parser]
    S -->|xml| V[XML Parser]
    S -->|grib2| W[GRIB Weather Parser]
    S -->|metar/taf| X[Aviation Weather Parser]
    S -->|parquet| Y[Columnar Parser]
    S -->|custom| Z[Custom Parser Module]

    T & U & V & W & X & Y & Z --> AA["Extract Records"]
    AA --> AB["Status → validating"]
    AB --> AC{Schema Defined?}
    AC -->|Yes| AD["Validate Against JSON Schema"]
    AD --> AE{Valid?}
    AE -->|Yes| AF["Status → ingesting"]
    AE -->|No| AG["Status → rejected"]
    AC -->|No| AF

    AF --> AH{Target System?}
    AH -->|predict| AI[Write to Prediction Engine]
    AH -->|gnosis| AJ[Write to Knowledge Base]
    AH -->|panopticon| AK[Write to Compliance Engine]
    AH -->|custom| AL[Write to Custom Target]

    AI & AJ & AK & AL --> AM["Status → completed"]
    AM --> AN["Move to Processed Folder"]
    AN --> AO["Update Statistics"]
    AO --> AP["Emit 'ingest:completed' Event"]

    L & Q & AG --> AR["Move to Reject Folder"]
    AR --> AS["Emit 'ingest:failed' Event"]

    style A fill:#6366f1,color:#fff
    style H fill:#f59e0b,color:#fff
    style N fill:#ef4444,color:#fff
    style R fill:#3b82f6,color:#fff
    style AF fill:#8b5cf6,color:#fff
    style AM fill:#10b981,color:#fff
    style AR fill:#ef4444,color:#fff
```

## Security Chain

```mermaid
sequenceDiagram
    participant DropZone as Drop Zone (Watch Path)
    participant Diode as DataDiodeService
    participant Quarantine as Quarantine Folder
    participant Scanner as Virus Scanner
    participant Crypto as Signature Verification

    DropZone->>Diode: File detected (poll or inotify)
    Diode->>Diode: Calculate SHA-256 file hash
    Diode->>Quarantine: Move file to quarantine
    
    Note over Diode: Wait quarantineDuration seconds

    Diode->>Scanner: Scan file for malware
    Scanner-->>Diode: {result: 'clean', engine: 'ClamAV'}

    alt Signature Required
        Diode->>Crypto: Verify with signaturePublicKey
        Crypto-->>Diode: {valid: true, signedBy: 'source-org'}
    end

    Diode->>Diode: Parse based on format (csv/json/grib2/etc.)
    Diode->>Diode: Validate against JSON schema (if defined)
    Diode->>Diode: Write to target system
    Diode->>Diode: Move to processed folder
    Diode-->>DropZone: Emit 'ingest:completed'
```

## Supported Data Formats

```mermaid
graph LR
    subgraph "Aviation/Weather"
        A[grib2 — NOAA GFS]
        B[metar — Weather Reports]
        C[taf — Aerodrome Forecasts]
    end

    subgraph "Structured Data"
        D[csv — Tabular]
        E[json — Structured]
        F[jsonl — Streaming JSON Lines]
        G[xml — Legacy Enterprise]
    end

    subgraph "Binary/Columnar"
        H[parquet — Columnar Analytics]
        I[avro — Schema-Rich Binary]
        J[protobuf — Protocol Buffers]
    end

    K[custom — User Parser Module]
```

## Key Code References

- **File Detection:** Poll-based or inotify watch on `IngestSource.watchPath`
- **Security Chain:** SHA-256 hash → quarantine → virus scan → signature verification
- **Parsers:** Format-specific parsers for 11 data formats
- **Validation:** JSON Schema validation when `IngestSource.schema` is defined
- **Target Systems:** `predict`, `gnosis`, `panopticon`, `custom`
- **Concurrency:** `maxConcurrent` per source, tracked via `processing` Set
- **Events:** EventEmitter — `ingest:completed`, `ingest:failed`
- **Error Handling:** `getErrorMessage()` + `getErrorStack()` for type-safe error capture
- **File Management:** detected → quarantine → processed/rejected folders
