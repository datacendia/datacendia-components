# Admin, Pillars & Cortex Services Workflows

> **Directories:** `backend/src/services/admin/`, `backend/src/services/pillars/`, `backend/src/services/cortex/`
> **Purpose:** Platform administration (AI assistant, licensing, tenants, health), 8 foundational data pillars, and the Cortex query gateway.

## Admin Suite Overview

```mermaid
flowchart TB
    subgraph "Admin Services"
        AI["AdminAIService<br/>AI-Powered Admin Assistant"]
        AS["AdminSettingsService<br/>Platform Configuration"]
        FC["FeatureControlService<br/>Feature Flags & Visibility"]
        LS["LicenseService<br/>Licensing & Seats"]
        TN["TenantService<br/>Multi-Tenant Management"]
        SH["SystemHealthService<br/>Platform Monitoring"]
        UM["UserManagementService<br/>User CRUD + Roles"]
        RD["RDProjectService<br/>R&D Project Tracking"]
    end

    AI --> FC & TN & LS & SH
    SH --> AI

    style AI fill:#6366f1,color:#fff
    style LS fill:#3b82f6,color:#fff
    style SH fill:#10b981,color:#fff
```

## AdminAIService — AI-Powered Administration

```mermaid
flowchart TD
    A["Admin Types Natural Language Command"] --> B["AdminAI Processes"]
    B --> C{Command Type?}

    C -->|toggle_feature| D["Enable/disable service or agent"]
    C -->|set_visibility| E["public / authenticated / admin / hidden"]
    C -->|toggle_agent| F["Enable/disable AI agent"]
    C -->|update_agent_model| G["Change model + temperature"]
    C -->|update_pricing| H["Modify pricing tier"]
    C -->|toggle_suite| I["Enable/disable entire suite"]
    C -->|get_status| J["System status overview"]
    C -->|check_health| K["Full health report"]

    D & E & F & G & H & I --> L{Dangerous Operation?}
    L -->|Yes| M["Ask for Confirmation"]
    M --> N["Execute if confirmed"]
    L -->|No| O["Execute immediately"]

    J & K --> P["Return dashboard data"]

    style A fill:#6366f1,color:#fff
    style M fill:#f59e0b,color:#fff
```

## LicenseService — Enterprise Licensing

```mermaid
flowchart TD
    A["License Management"] --> B{Operation?}

    B -->|Create| C["Issue License"]
    C --> D["Type: pilot / trial / foundation /<br/>enterprise / strategic / custom"]
    D --> E["Features: pillars, agents, maxUsers,<br/>deliberationsPerMonth, SSO, API access"]

    B -->|Query| F["getLicenses() — Real Prisma queries"]
    B -->|Update| G["Extend / Modify / Suspend"]
    B -->|Audit| H["Revenue tracking per tenant"]

    E --> I["Store in licenses table (Prisma)"]
    F --> I
    G --> I

    subgraph "License Tiers"
        L1["Pilot — Limited features, time-bound"]
        L2["Foundation — Core pillars, standard agents"]
        L3["Enterprise — All pillars, SSO, API, priority support"]
        L4["Strategic — Custom integrations, dedicated success"]
    end

    style C fill:#6366f1,color:#fff
    style I fill:#10b981,color:#fff
```

## SystemHealthService — Platform Monitoring

```mermaid
flowchart TD
    A["getHealthDashboard()"] --> B["Check All Services"]
    B --> C["PostgreSQL ping"]
    B --> D["Redis ping"]
    B --> E["Ollama connectivity"]
    B --> F["ClickHouse availability"]
    B --> G["MinIO bucket access"]

    C & D & E & F & G --> H["Aggregate ServiceHealth[]"]
    H --> I["Collect SystemMetrics"]
    I --> J["CPU: usage + cores"]
    I --> K["Memory: total / used / free"]
    I --> L["Disk: total / used / free"]
    I --> M["Uptime + loadAverage"]

    J & K & L & M --> N["Collect ApiMetrics"]
    N --> O["totalRequests24h, avgLatency,<br/>p95Latency, errorRate"]

    O --> P["Aggregate HealthAlerts"]
    P --> Q{Overall Status?}
    Q -->|All healthy| R["HEALTHY"]
    Q -->|Some degraded| S["DEGRADED"]
    Q -->|Critical down| T["CRITICAL"]

    style A fill:#6366f1,color:#fff
    style R fill:#10b981,color:#fff
    style T fill:#ef4444,color:#fff
```

---

## 8 Foundational Data Pillars

```mermaid
flowchart TB
    subgraph "8 Pillars (Data Layers)"
        P1["Helm<br/>Executive Metrics & KPIs"]
        P2["Lineage<br/>Data Provenance & Audit Trail"]
        P3["Predict<br/>Forecasting & Trend Analysis"]
        P4["Flow<br/>Process & Workflow Data"]
        P5["Health<br/>Organizational Health Metrics"]
        P6["Guard<br/>Security & Risk Data"]
        P7["Ethics<br/>Ethics & Compliance Scoring"]
        P8["Agents<br/>AI Agent Performance Data"]
    end

    P1 & P2 & P3 & P4 & P5 & P6 & P7 & P8 --> CX["CortexCoreService<br/>The Single Data Gateway"]

    CX --> S["All Services Access Data<br/>Through Cortex Only"]

    style CX fill:#6366f1,color:#fff
```

## CortexCoreService — The Data Gateway

```mermaid
flowchart TD
    A["Service Needs Data"] --> B["CortexCoreService.query()"]
    B --> C{Query Intent?}

    C -->|natural_language| D["parseNaturalLanguage()"]
    D --> E["Determine target pillars from query"]
    D --> F["Build StructuredQuery"]
    D --> G["Confidence score"]

    C -->|structured| H["Use StructuredQuery directly"]
    H --> I["determinePillarsForEntity()"]

    E & F & G & I --> J["PillarAggregator.queryPillars()"]
    J --> K["Query each target pillar"]
    K --> L["Aggregate + flatten results"]
    L --> M["Return QueryResponse"]
    M --> N["data + sources + confidence + executionMs"]

    O["CortexCoreService.analyze()"] --> P["Finding discovery + recommendations"]
    Q["CortexCoreService.simulate()"] --> R["Outcome simulation"]
    S2["CortexCoreService.govern()"] --> T["Violation detection"]

    style B fill:#6366f1,color:#fff
    style J fill:#3b82f6,color:#fff
    style M fill:#10b981,color:#fff
```

## Architecture: Sources → Pillars → Cortex → Services

```mermaid
flowchart LR
    subgraph "Data Sources"
        DS1["PostgreSQL"]
        DS2["ClickHouse"]
        DS3["Druid"]
        DS4["Redis"]
        DS5["MinIO"]
        DS6["Neo4j"]
        DS7["Client DBs"]
    end

    subgraph "Pillars"
        P1["Helm"]
        P2["Lineage"]
        P3["Predict"]
        P4["Flow"]
        P5["Health"]
        P6["Guard"]
        P7["Ethics"]
        P8["Agents"]
    end

    subgraph "Gateway"
        CX["CortexCoreService"]
        PA["PillarAggregator"]
    end

    subgraph "Consumers"
        C1["CouncilService"]
        C2["EnterpriseModules"]
        C3["ComplianceEngine"]
        C4["DashboardAPIs"]
    end

    DS1 & DS2 & DS3 & DS4 & DS5 & DS6 & DS7 --> P1 & P2 & P3 & P4 & P5 & P6 & P7 & P8
    P1 & P2 & P3 & P4 & P5 & P6 & P7 & P8 --> PA
    PA --> CX
    CX --> C1 & C2 & C3 & C4

    style CX fill:#6366f1,color:#fff
    style PA fill:#3b82f6,color:#fff
```

## Key Code References

| Service | File | Purpose |
|---------|------|---------|
| **AdminAI** | `admin/AdminAIService.ts` | Natural language admin commands, 10 command types |
| **AdminSettings** | `admin/AdminSettingsService.ts` | Platform configuration management |
| **FeatureControl** | `admin/FeatureControlService.ts` | Feature flags, visibility levels, suite toggles |
| **License** | `admin/LicenseService.ts` | Real Prisma licensing: pilot→strategic tiers, seat management |
| **Tenant** | `admin/TenantService.ts` | Multi-tenant management |
| **SystemHealth** | `admin/SystemHealthService.ts` | Real health checks: CPU, memory, disk, service pings, alerts |
| **UserManagement** | `admin/UserManagementService.ts` | User CRUD + role assignment |
| **RDProject** | `admin/RDProjectService.ts` | R&D project tracking |
| **Pillars** | `pillars/index.ts` | 8 pillar services: Helm, Lineage, Predict, Flow, Health, Guard, Ethics, Agents |
| **CortexCore** | `cortex/CortexCoreService.ts` | Single data gateway, NL + structured query, pillar aggregation |
| **PillarAggregator** | `cortex/PillarAggregator.ts` | Cross-pillar data fusion |
