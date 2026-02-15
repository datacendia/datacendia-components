# Datacendia Platform — File Upload & Document Processing Pipeline

> **Source:** `backend/src/services/CendiaIngestService.ts`, `backend/src/services/CendiaGnosisService.ts`, `backend/src/services/document/PDFGeneratorService.ts`
> **Tech:** Apache Tika (text extraction), pgvector (embeddings), MinIO (file storage), Ollama (entity extraction)

## End-to-End Document Processing

```mermaid
flowchart TD
    A["User uploads file<br/>(PDF, DOCX, CSV, XLSX, TXT)"] --> B["POST /api/v1/upload"]
    B --> C["Multer receives file<br/>(10MB limit)"]
    C --> D["Store raw file in MinIO<br/>(S3-compatible bucket)"]
    D --> E["Send to Apache Tika<br/>(Port 9998)"]
    E --> F["Extract plain text + metadata"]
    F --> G["CendiaIngest: Chunking"]

    G --> H["Split into chunks<br/>(1000 chars, 200 overlap)"]
    H --> I["For each chunk:"]
    I --> J["Generate embedding<br/>(nomic-embed-text, 768-dim)"]
    I --> K["Extract entities/relationships<br/>(LLM-powered)"]

    J --> L["Store in PostgreSQL<br/>(embeddings table + pgvector)"]
    K --> M["Store in Neo4j<br/>(Knowledge Graph)"]

    N["Document ready for RAG ✓"]

    L --> N
    M --> N

    style A fill:#6366f1,color:#fff
    style E fill:#f59e0b,color:#fff
    style J fill:#3b82f6,color:#fff
    style K fill:#8b5cf6,color:#fff
    style N fill:#10b981,color:#fff
```

## Chunking Strategy

```mermaid
flowchart TD
    A["Extracted text<br/>(from Tika)"] --> B["Calculate total length"]
    B --> C{Length > 1000 chars?}
    C -->|No| D["Single chunk"]
    C -->|Yes| E["Sliding window chunker"]

    E --> F["Window size: 1000 characters"]
    F --> G["Overlap: 200 characters"]
    G --> H["Sentence boundary alignment<br/>(avoid mid-sentence splits)"]

    H --> I["Chunk 1: chars 0-1000"]
    H --> J["Chunk 2: chars 800-1800"]
    H --> K["Chunk 3: chars 1600-2600"]
    H --> L["Chunk N: remaining"]

    I & J & K & L --> M["Each chunk gets:<br/>- content_hash (SHA-256)<br/>- embedding vector<br/>- source_type + source_id<br/>- metadata (page, position)"]

    style E fill:#6366f1,color:#fff
    style M fill:#10b981,color:#fff
```

## CendiaGnosis — Document Intelligence

```mermaid
flowchart TD
    A["Document uploaded"] --> B["CendiaGnosis analyzes"]
    B --> C["Text extraction via Tika"]
    C --> D["LLM classifies document type"]

    D --> E{Document Type}
    E -->|Contract| F["Extract: parties, terms,<br/>obligations, dates, penalties"]
    E -->|Legal Filing| G["Extract: case number, parties,<br/>claims, relief sought"]
    E -->|Financial Report| H["Extract: revenue, expenses,<br/>KPIs, forecasts, risks"]
    E -->|Policy Document| I["Extract: rules, exceptions,<br/>effective dates, scope"]
    E -->|General| J["Extract: topics, entities,<br/>key points, summary"]

    F & G & H & I & J --> K["Generate structured metadata"]
    K --> L["Store entities in Neo4j graph"]
    K --> M["Store embeddings in pgvector"]
    K --> N["Update document index"]

    style B fill:#6366f1,color:#fff
    style K fill:#10b981,color:#fff
```

## CendiaBridge — 13 DMS Connectors

```mermaid
flowchart TD
    A["CendiaBridge Service"] --> B{Connector Type}

    B -->|"Document Management"| C1["iManage"]
    B -->|"Document Management"| C2["NetDocuments"]
    B -->|"Document Management"| C3["SharePoint"]
    B -->|"Practice Management"| C4["Clio"]
    B -->|"Practice Management"| C5["PracticePanther"]
    B -->|"eDiscovery"| C6["Relativity"]
    B -->|"eDiscovery"| C7["Nuix"]
    B -->|"Contract Lifecycle"| C8["Ironclad"]
    B -->|"Contract Lifecycle"| C9["DocuSign CLM"]
    B -->|"Collaboration"| C10["Slack"]
    B -->|"Project Management"| C11["Jira"]
    B -->|"Service Management"| C12["ServiceNow"]
    B -->|"Cloud Storage"| C13["Google Drive"]

    C1 & C2 & C3 & C4 & C5 & C6 & C7 & C8 & C9 & C10 & C11 & C12 & C13 --> D["Normalize to common format"]
    D --> E["Feed into CendiaIngest pipeline"]

    style A fill:#6366f1,color:#fff
    style D fill:#10b981,color:#fff
```

## DataDiode — Sovereign Document Ingest

```mermaid
flowchart TD
    A["External data arrives<br/>(GRIB, CSV, JSON, XML, binary)"] --> B["DataDiode receives<br/>(unidirectional: IN only)"]
    B --> C["Phase 1: Quarantine"]
    C --> D["Isolated storage zone"]
    D --> E["Phase 2: Security Scan"]
    E --> F["Virus/malware scan"]
    E --> G["File type validation"]
    E --> H["Size limit check"]

    F & G & H --> I{All checks pass?}
    I -->|No| J["Reject + alert admin"]
    I -->|Yes| K["Phase 3: Signature Verification"]
    K --> L{Signed?}
    L -->|Yes| M["Verify digital signature"]
    L -->|No| N["Accept unsigned (if policy allows)"]

    M & N --> O["Phase 4: Release to platform"]
    O --> P["Feed into CendiaIngest pipeline"]

    style B fill:#6366f1,color:#fff
    style J fill:#ef4444,color:#fff
    style P fill:#10b981,color:#fff
```

## PDF Generation — Output Pipeline

```mermaid
flowchart TD
    A["Generate report request"] --> B{Report Type}

    B -->|"Decision Report"| C["PDFGeneratorService.generateDecisionReport()"]
    B -->|"Test Report"| D["PDFGeneratorService.generateTestReport()"]
    B -->|"Audit Report"| E["PDFGeneratorService.generateAuditReport()"]
    B -->|"Compliance Bundle"| F["ComplianceService → PDF + JSON + CSV"]

    C & D & E & F --> G["pdfkit generates PDF/A-3"]
    G --> H["Features:"]
    H --> I["Headers + footers"]
    H --> J["Tables + lists"]
    H --> K["Signature blocks"]
    H --> L["Watermarks"]
    H --> M["Merkle root hash"]

    G --> N["KMS signs the PDF"]
    N --> O["Store in MinIO"]
    O --> P["Return download URL"]

    style G fill:#6366f1,color:#fff
    style N fill:#8b5cf6,color:#fff
    style P fill:#10b981,color:#fff
```

## RAG Query Pipeline (Retrieval)

```mermaid
flowchart TD
    A["User query (natural language)"] --> B["Generate query embedding<br/>(nomic-embed-text)"]
    B --> C["pgvector: cosine similarity search"]
    C --> D["SELECT * FROM embeddings<br/>ORDER BY embedding <=> query_vec<br/>LIMIT k"]

    D --> E["Top-K results (k=5-20)"]
    E --> F["Filter by organization_id"]
    F --> G["Filter by source_type (optional)"]
    G --> H["Rank by relevance score"]
    H --> I["Build context window"]
    I --> J["Inject into LLM prompt:<br/>'Based on the following context...'"]
    J --> K["LLM generates answer with citations"]

    style B fill:#3b82f6,color:#fff
    style C fill:#6366f1,color:#fff
    style K fill:#10b981,color:#fff
```

## File Storage Architecture

```mermaid
flowchart LR
    subgraph "MinIO (S3-Compatible)"
        B1["uploads/ — Raw user files"]
        B2["documents/ — Processed docs"]
        B3["exports/ — Generated PDFs"]
        B4["evidence/ — Signed packets"]
        B5["backups/ — System backups"]
    end

    subgraph "PostgreSQL"
        P1["embeddings — Vector chunks"]
        P2["llm_cache — Response cache"]
        P3["data_sources — Connection configs"]
    end

    subgraph "Neo4j"
        N1["Entities — People, orgs, concepts"]
        N2["Relationships — Links between entities"]
    end

    UPLOAD["File Upload"] --> B1
    B1 --> TIKA["Tika Extract"] --> P1 & N1
    PDF["PDF Generation"] --> B3
    EVIDENCE["Evidence Vault"] --> B4

    style B1 fill:#f59e0b,color:#fff
    style P1 fill:#3b82f6,color:#fff
    style N1 fill:#10b981,color:#fff
```
