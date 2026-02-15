# CendiaGraph Knowledge Graph Workflow

> **Service:** `CendiaGraphService` (`backend/src/services/strategic/CendiaGraphService.ts`)
> **Purpose:** The Institutional Brain — turns messy documents into a queryable knowledge graph of entities and relationships with LLM-powered insight discovery.

## Entity & Relationship Management

```mermaid
flowchart TD
    A["Data Source (Ingest, Manual, API)"] --> B{Operation Type}

    B -->|Add Entity| C["addEntity(orgId, type, name, properties, sourceDoc)"]
    C --> D["Generate UUID"]
    D --> E["Save to graph_entities Table"]
    E --> F["Update entityIndex: type → entity IDs"]

    B -->|Add Relationship| G["addRelationship(orgId, source, target, type, props, weight)"]
    G --> H["Generate UUID"]
    H --> I["Save to graph_relationships Table"]

    B -->|Query| J["queryGraph(orgId, graphQuery)"]
    J --> K["Filter by entityTypes"]
    K --> L["Filter by relationshipTypes"]
    L --> M["Filter by minConfidence"]
    M --> N["Filter by timeRange"]
    N --> O["Traverse up to maxHops"]
    O --> P["Return GraphPath[]"]

    B -->|Search| Q["searchEntities(orgId, query, type?, limit)"]
    Q --> R["Case-insensitive name/property match"]
    R --> S["Return matching GraphEntity[]"]

    style A fill:#6366f1,color:#fff
    style C fill:#3b82f6,color:#fff
    style G fill:#10b981,color:#fff
    style J fill:#f59e0b,color:#fff
    style Q fill:#8b5cf6,color:#fff
```

## Graph Traversal (BFS)

```mermaid
flowchart TD
    A["queryGraph(startEntity, maxHops)"] --> B["Initialize BFS Queue"]
    B --> C["visited = Set()"]

    C --> D{Queue Non-Empty AND hops < maxHops?}
    D -->|Yes| E["Dequeue Entity"]
    E --> F["Find All Relationships WHERE<br/>sourceEntityId = entity OR targetEntityId = entity"]
    F --> G["Filter by relationshipTypes (if specified)"]
    G --> H["For Each Connected Entity"]
    H --> I{Already Visited?}
    I -->|No| J["Add to visited + queue"]
    J --> K["Record path: entity → relationship → target"]
    I -->|Yes| L["Skip"]
    K & L --> D

    D -->|No: Done| M["Build GraphPath[]"]
    M --> N["Calculate totalWeight = sum(relationship.weight)"]
    N --> O["Calculate pathConfidence = avg(entity.confidence)"]
    O --> P["Return Results"]

    style A fill:#6366f1,color:#fff
    style F fill:#3b82f6,color:#fff
    style P fill:#10b981,color:#fff
```

## Risk Discovery Pipeline

```mermaid
flowchart TD
    A["discoverRisks(orgId)"] --> B["Load All 'risk' Type Entities"]
    B --> C["For Each Risk Entity"]
    C --> D["queryGraph(riskEntity, maxHops=3)"]
    D --> E["Find Connected Entities"]

    E --> F["For Each Connection"]
    F --> G["Calculate riskScore"]
    G --> H["riskScore = risk.confidence × relationship.weight"]
    H --> I{"riskScore > threshold?"}
    I -->|Yes| J["Create RiskConnection"]
    J --> K["Store: sourceEntity, targetEntity, path, riskScore, riskType"]
    I -->|No| L["Skip"]

    K --> M["Sort by riskScore DESC"]
    M --> N["Return RiskConnection[]"]

    style A fill:#ef4444,color:#fff
    style J fill:#f59e0b,color:#fff
    style N fill:#10b981,color:#fff
```

## Insight Generation

```mermaid
sequenceDiagram
    participant App
    participant Graph as CendiaGraphService
    participant LLM as Ollama LLM

    App->>Graph: generateInsights(orgId)
    
    Graph->>Graph: Analyze entity clusters by type
    Graph->>Graph: Find high-weight relationship paths
    Graph->>Graph: Identify orphan entities (no connections)
    Graph->>Graph: Detect circular dependencies

    Graph->>LLM: Analyze graph patterns for insights
    Note over LLM: Insight Types:<br/>hidden_connection, risk_cluster,<br/>influence_pattern, dependency_chain
    LLM-->>Graph: KnowledgeInsight[]

    loop For Each Insight
        Graph->>Graph: Score significance (0-1)
        Graph->>Graph: Determine if actionable
        Graph->>Graph: Generate recommendations
    end

    Graph-->>App: KnowledgeInsight[] sorted by significance
```

## Entity Type Taxonomy

```mermaid
graph LR
    subgraph "15 Entity Types"
        P[person]
        O[organization]
        C[contract]
        PR[product]
        L[location]
        E[event]
        R[regulation]
        RI[risk]
        D[decision]
        M[metric]
        DE[department]
        PJ[project]
        A[asset]
        V[vendor]
        CU[customer]
    end

    subgraph "19 Relationship Types"
        R1[reports_to]
        R2[owns]
        R3[manages]
        R4[depends_on]
        R5[related_to]
        R6[contracts_with]
        R7[supplies_to]
        R8[competes_with]
        R9[partners_with]
        R10[regulates]
        R11[audits]
        R12[approves]
        R13[blocks]
        R14[influences]
        R15[member_of]
        R16[located_in]
        R17[occurred_at]
        R18[caused_by]
        R19[mitigates]
    end
```

## Key Code References

- **Entity CRUD:** `addEntity()`, `getEntity()`, `updateEntity()`, `deleteEntity()`
- **Relationship CRUD:** `addRelationship()`, `getRelationship()`
- **Search:** `searchEntities()` — case-insensitive name/property matching
- **Traversal:** `queryGraph()` — BFS with maxHops, type filters, confidence threshold
- **Risk Discovery:** `discoverRisks()` — finds risk entities and traces impact paths
- **Insights:** `generateInsights()` — LLM-powered pattern recognition across graph
- **Statistics:** `getGraphStatistics()` — entity/relationship counts by type, avg confidence
- **Indexing:** In-memory `entityIndex` map: `type → Set<entityId>` for fast type lookups
- **DB Tables:** `graph_entities`, `graph_relationships` (Prisma)
