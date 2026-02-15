# Datacendia Platform — LLM Model Selection & Routing

> **Source:** `backend/src/services/EnhancedLLMService.ts`, `backend/src/services/CendiaOmniTranslateService.ts`
> **Endpoint:** Ollama at `http://localhost:11434`
> **Models:** 5 models with tiered routing by task complexity

## Model Inventory & Selection

```mermaid
flowchart TD
    A["Incoming LLM Request"] --> B{Task Classification}

    B -->|"Simple Q&A, fast response"| C["qwen2.5:7b<br/>Fast · Low latency · Tier 1 translations"]
    B -->|"Complex reasoning, deliberation"| D["qwq:32b<br/>Deep reasoning · Council agents"]
    B -->|"Code generation, analysis"| E["qwen2.5-coder:32b<br/>Code-specific tasks"]
    B -->|"General purpose, balanced"| F["qwen2.5:14b<br/>Fallback · Tier 2 translations"]
    B -->|"Embeddings only"| G["nomic-embed-text<br/>768-dim vectors · Semantic search"]

    C --> H["Response"]
    D --> H
    E --> H
    F --> H
    G --> I["Vector stored in pgvector"]

    style C fill:#10b981,color:#fff
    style D fill:#6366f1,color:#fff
    style E fill:#8b5cf6,color:#fff
    style F fill:#3b82f6,color:#fff
    style G fill:#f59e0b,color:#fff
```

## EnhancedLLMService Pipeline

```mermaid
flowchart TD
    A["Service receives prompt + system prompt"] --> B["Check LLM Cache (Redis)"]
    B --> C{Cache Hit?}
    C -->|Yes| D["Return cached response<br/>(< 1ms, hit_count++)"]
    C -->|No| E["Select Model by Task"]

    E --> F["Build RAG Context"]
    F --> G["pgvector: cosine similarity search"]
    G --> H["Top-K chunks (k=5-20)"]
    H --> I["Inject context into prompt"]

    I --> J["Call Ollama API"]
    J --> K{Streaming?}
    K -->|Yes| L["Stream tokens via callback"]
    K -->|No| M["Wait for full response"]

    L & M --> N["Record Metrics"]
    N --> O["tokens_in, tokens_out, latency_ms"]
    O --> P["Cache Response in Redis"]
    P --> Q["Store in llm_cache table<br/>(query_hash, model, response)"]

    style B fill:#ef4444,color:#fff
    style J fill:#6366f1,color:#fff
    style D fill:#10b981,color:#fff
```

## Council Agent Model Assignment

```mermaid
flowchart TB
    subgraph "Council Modes"
        M1["Standard (3 agents)"]
        M2["Deep Dive (5 agents)"]
        M3["War Room (7 agents)"]
        M4["Legal Strategy (5 agents)"]
    end

    subgraph "Agent → Model Mapping"
        A1["Strategist → qwq:32b<br/>(Complex reasoning)"]
        A2["Analyst → qwq:32b<br/>(Data interpretation)"]
        A3["Devil's Advocate → qwq:32b<br/>(Adversarial reasoning)"]
        A4["Ethics → qwq:32b<br/>(Ethical reasoning)"]
        A5["Summarizer → qwen2.5:7b<br/>(Fast synthesis)"]
        A6["Code Agent → qwen2.5-coder:32b<br/>(Technical analysis)"]
        A7["Legal Agent → qwq:32b<br/>(Legal reasoning)"]
    end

    M1 --> A1 & A2 & A5
    M2 --> A1 & A2 & A3 & A4 & A5
    M3 --> A1 & A2 & A3 & A4 & A5 & A6 & A7

    style A1 fill:#6366f1,color:#fff
    style A5 fill:#10b981,color:#fff
    style A6 fill:#8b5cf6,color:#fff
```

## OmniTranslate Model Tiering

```mermaid
flowchart TD
    A["Translation Request<br/>(source → target language)"] --> B{Target Language Tier?}

    B -->|"Tier 1: en, es, fr, de, it, pt,<br/>nl, ru, zh, ja, ko, ar"| C["qwen2.5:7b (Fast)<br/>Sub-second response"]

    B -->|"Tier 2: pl, uk, th, vi, id, ms,<br/>tl, hi, bn, tr, he, fa, sv, da..."| D["qwen2.5:32b (Primary)<br/>Higher accuracy"]

    B -->|"Tier 3: Low-resource languages<br/>(Amharic, Yoruba, Swahili...)"| E["qwen2.5:32b + Enhanced Prompting<br/>Extra context + examples"]

    C & D & E --> F["Check Translation Memory"]
    F --> G{Match in omnitranslate_memory?}
    G -->|Yes| H["Return cached translation<br/>(usage_count++)"]
    G -->|No| I["LLM generates translation"]
    I --> J["Apply Glossary Terms<br/>(omnitranslate_glossary)"]
    J --> K["Store in Translation Memory"]
    K --> L["Return translation"]

    style C fill:#10b981,color:#fff
    style D fill:#6366f1,color:#fff
    style E fill:#8b5cf6,color:#fff
```

## Fallback & Error Handling

```mermaid
flowchart TD
    A["Primary Model Request"] --> B{Ollama Available?}
    B -->|No| C["Health Check Failed"]
    C --> D["Return error with degraded status"]

    B -->|Yes| E["Send to primary model"]
    E --> F{Response within timeout?}
    F -->|No| G["Timeout: Try fallback model"]
    G --> H["qwen2.5:14b (smaller, faster)"]
    H --> I{Fallback succeeds?}
    I -->|Yes| J["Return with fallback flag"]
    I -->|No| K["Try qwen2.5:7b (fast model)"]
    K --> L{Last resort succeeds?}
    L -->|Yes| M["Return with degraded flag"]
    L -->|No| N["503: All models unavailable"]

    F -->|Yes| O["Apply CendiaSentry guardrails"]
    O --> P{Passed?}
    P -->|Yes| Q["Return response ✓"]
    P -->|No| R["Redact/filter + return with warning"]

    style E fill:#6366f1,color:#fff
    style G fill:#f59e0b,color:#fff
    style N fill:#ef4444,color:#fff
    style Q fill:#10b981,color:#fff
```

## Caching Strategy

```mermaid
flowchart LR
    subgraph "Layer 1: Redis API Cache"
        L1["GET request cache<br/>TTL: 60-300s<br/>Vary by org<br/>Auto-invalidate on mutations"]
    end

    subgraph "Layer 2: LLM Response Cache"
        L2["Query hash → cached response<br/>Table: llm_cache<br/>Tracks: hit_count, tokens, latency<br/>Expires based on TTL"]
    end

    subgraph "Layer 3: Translation Memory"
        L3["Source+target → cached translation<br/>Table: omnitranslate_memory<br/>Quality scoring (0-1)<br/>Usage tracking"]
    end

    subgraph "Layer 4: Embedding Cache"
        L4["Content hash → embedding vector<br/>Table: embeddings<br/>Model: nomic-embed-text<br/>768 dimensions"]
    end

    L1 -->|"Miss"| L2
    L2 -->|"Miss"| L3
    L3 -->|"Miss"| L4
    L4 -->|"Miss"| O["Ollama Inference"]

    style L1 fill:#10b981,color:#fff
    style O fill:#6366f1,color:#fff
```

## Key Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama API endpoint |
| `LLM_MODEL` | `qwq:32b` | Primary reasoning model |
| `LLM_FAST_MODEL` | `qwen2.5:7b` | Fast response model |
| `LLM_CODE_MODEL` | `qwen2.5-coder:32b` | Code analysis model |
| `LLM_EMBED_MODEL` | `nomic-embed-text` | Embedding model |
| `OMNITRANSLATE_MODEL` | `qwen2.5:32b` | Translation primary |
| `OMNITRANSLATE_FALLBACK_MODEL` | `qwen2.5:14b` | Translation fallback |
| `OMNITRANSLATE_FAST_MODEL` | `qwen2.5:7b` | Translation fast (Tier 1) |
