# CendiaIngest Data Pipeline Workflow

> **Service:** `CendiaIngestService` (`backend/src/services/strategic/CendiaIngestService.ts`)
> **Purpose:** Document processing and knowledge extraction — the vectorization pipeline that onboards data into the knowledge graph.

## Ingest Job Lifecycle

```mermaid
stateDiagram-v2
    [*] --> queued: createIngestJob()
    queued --> processing: processIngestJob()
    processing --> extracting: Text extraction begins
    extracting --> vectorizing: Chunks created + embeddings
    vectorizing --> graphing: Entities & relationships extracted
    graphing --> completed: All documents processed
    processing --> failed: Unrecoverable error
    extracting --> failed: Extraction error
    vectorizing --> failed: Embedding error
    graphing --> failed: Graph error
```

## Full Processing Pipeline

```mermaid
flowchart TD
    A["createIngestJob(orgId, userId, source)"] --> B[Generate Job ID]
    B --> C["Log to audit_logs Table"]
    C --> D["Status: queued"]

    D --> E["processIngestJob(jobId)"]
    E --> F["Status → processing"]

    F --> G["Loop: For Each Document"]

    subgraph "Per Document Processing"
        G --> H["Step 1: Extract Text"]
        H --> I{Source Type?}
        I -->|file_upload| J[Read File Content]
        I -->|database| K[Query Source DB]
        I -->|api| L[Fetch from API]
        I -->|s3/sharepoint/confluence| M[Download from Source]

        J & K & L & M --> N["Step 2: Chunk Document"]
        N --> O["Split into chunks"]
        O --> P["CHUNK_SIZE=1000, OVERLAP=200"]

        P --> Q["Step 3: Generate Embeddings"]
        Q --> R["Ollama: nomic-embed-text per chunk"]
        R --> S["Status → vectorizing"]

        S --> T["Step 4: Extract Entities via LLM"]
        T --> U["LLM: Identify persons, orgs, contracts,<br/>products, locations, events, risks"]
        U --> V["Each: name, type, confidence, mentions"]

        V --> W["Step 5: Extract Relationships via LLM"]
        W --> X["LLM: Identify relationships between entities"]
        X --> Y["Each: source→target, type, confidence, evidence"]

        Y --> Z["Step 6: Generate Summary via LLM"]
        Z --> AA["LLM: Summarize document content"]

        AA --> AB["Step 7: Store in Knowledge Graph"]
        AB --> AC["CendiaGraphService.addEntity() per entity"]
        AC --> AD["CendiaGraphService.addRelationship() per relationship"]
        AD --> AE["Status → graphing"]
    end

    AE --> AF{More Documents?}
    AF -->|Yes| G
    AF -->|No| AG["Status → completed"]
    AG --> AH[Update Job Metrics]
    AH --> AI["Return: documentsProcessed, entitiesExtracted,<br/>relationshipsExtracted"]

    style A fill:#6366f1,color:#fff
    style H fill:#3b82f6,color:#fff
    style Q fill:#8b5cf6,color:#fff
    style T fill:#f59e0b,color:#fff
    style AB fill:#10b981,color:#fff
    style AG fill:#10b981,color:#fff
```

## Document Chunking Strategy

```mermaid
flowchart LR
    A["Full Document Text"] --> B["Chunk 1<br/>(chars 0-1000)"]
    A --> C["Chunk 2<br/>(chars 800-1800)"]
    A --> D["Chunk 3<br/>(chars 1600-2600)"]
    A --> E["..."]
    A --> F["Chunk N<br/>(final segment)"]

    B --> G["200 char overlap<br/>preserves context"]
    C --> G
    D --> G
    F --> G

    G --> H["Each chunk gets:<br/>- Embedding vector<br/>- startOffset / endOffset<br/>- Document metadata"]
```

## Entity & Relationship Extraction

```mermaid
sequenceDiagram
    participant Ingest as CendiaIngestService
    participant LLM as Ollama LLM
    participant Graph as CendiaGraphService

    Ingest->>LLM: Extract entities from text chunk
    Note over LLM: Entity Types:<br/>person, organization, contract,<br/>product, location, event,<br/>regulation, risk, decision, metric
    LLM-->>Ingest: ExtractedEntity[] with confidence scores

    Ingest->>LLM: Extract relationships between entities
    Note over LLM: Relationship Types:<br/>reports_to, owns, manages,<br/>depends_on, contracts_with,<br/>regulates, audits, approves
    LLM-->>Ingest: ExtractedRelationship[] with evidence

    loop For Each Entity
        Ingest->>Graph: addEntity(name, type, properties)
    end

    loop For Each Relationship
        Ingest->>Graph: addRelationship(source, target, type)
    end
```

## Key Code References

- **Job Creation:** `createIngestJob()` — creates job with audit log entry
- **Processing:** `processIngestJob()` — orchestrates the full pipeline
- **Chunking:** `CHUNK_SIZE=1000`, `CHUNK_OVERLAP=200` — sliding window
- **Embeddings:** Ollama `nomic-embed-text` model for vector generation
- **Entity Extraction:** LLM-powered NER with 15 entity types
- **Relationship Extraction:** LLM-powered relation detection with 19 relationship types
- **Graph Storage:** `CendiaGraphService.addEntity()` + `addRelationship()`
- **Source Types:** `file_upload`, `database`, `api`, `s3`, `sharepoint`, `confluence`
- **Metrics:** `getMetrics()` — totalJobs, completedJobs, avgProcessingTimeMs
