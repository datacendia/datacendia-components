# Datacendia Platform — Database Entity Relationship Diagram

> **Source:** `backend/prisma/schema/` — 4 schema files: `base.prisma`, `data.prisma`, `platform.prisma`, `sovereign.prisma`
> **Database:** PostgreSQL 16 + pgvector extension
> **ORM:** Prisma Client with `prismaSchemaFolder` preview feature

## Core Identity & Auth Domain

```mermaid
erDiagram
    organizations ||--o{ users : "has many"
    organizations ||--o{ teams : "has many"
    organizations ||--o{ audit_logs : "has many"
    organizations ||--o{ api_keys : "has many"
    organizations ||--o{ deliberations : "has many"
    organizations ||--o{ data_sources : "has many"
    organizations ||--o{ alerts : "has many"
    organizations ||--o{ metric_definitions : "has many"
    organizations ||--o{ workflows : "has many"

    users ||--o{ sessions : "has many"
    users ||--o{ api_keys : "has many"
    users ||--o{ audit_logs : "has many"
    users ||--o{ council_queries : "has many"
    users ||--o{ approvals : "has many"
    users ||--o{ team_members : "has many"

    teams ||--o{ team_members : "has many"
    team_members }o--|| users : "belongs to"
    team_members }o--|| teams : "belongs to"

    organizations {
        string id PK
        string name
        string slug UK
        string industry
        string company_size
        json settings
        datetime created_at
        datetime deleted_at
    }

    users {
        string id PK
        string organization_id FK
        string email UK
        string password_hash
        string name
        UserRole role
        UserStatus status
        boolean email_verified
        boolean mfa_enabled
        string mfa_secret
        json preferences
        json notification_preferences
        datetime last_login_at
    }

    sessions {
        string id PK
        string user_id FK
        string refresh_token_hash
        string user_agent
        string ip_address
        datetime expires_at
    }

    email_verifications {
        string id PK
        string user_id UK
        string token UK
        datetime expires_at
    }

    password_resets {
        string id PK
        string user_id
        string token UK
        datetime expires_at
        datetime used_at
    }
```

## Council & Deliberation Domain

```mermaid
erDiagram
    organizations ||--o{ deliberations : "has many"
    users ||--o{ council_queries : "has many"
    deliberations ||--o{ decision_packets : "has many"
    organizations ||--o{ decision_outcomes : "has many"
    organizations ||--o{ dissents : "has many"

    deliberations {
        string id PK
        string organization_id FK
        string query
        string mode
        string status
        json agents
        json result
        json citations
        int duration_ms
        datetime created_at
    }

    council_queries {
        string id PK
        string user_id FK
        string query
        string mode
        json response
        datetime created_at
    }

    decision_packets {
        string id PK
        string deliberation_id FK
        string run_id
        string merkle_root
        string signature
        json artifact_hashes
        json citations
        json agent_contributions
        json dissents
        json tool_calls
        json approvals
        json policy_gates
        json regulatory_frameworks
        datetime signed_at
        datetime exported_at
    }

    decision_outcomes {
        string id PK
        string organization_id FK
        string decision_id
        json predictions
        json actuals
        float financial_impact
        datetime collected_at
    }

    dissents {
        string id PK
        string organization_id FK
        string dissenter_id
        string decision_id
        string status
        string reason
        boolean retaliation_protected
        datetime created_at
    }
```

## Data & Analytics Domain

```mermaid
erDiagram
    organizations ||--o{ metric_definitions : "has many"
    metric_definitions ||--o{ metric_values : "has many"
    metric_definitions ||--o{ alerts : "has many"
    organizations ||--o{ data_sources : "has many"

    lineage_entities ||--o{ lineage_relationships : "source"
    lineage_entities ||--o{ lineage_relationships : "target"
    lineage_entities ||--o{ data_quality_reports : "has many"

    forecast_models ||--o{ predictions : "has many"
    forecast_models ||--o{ feature_importance : "has many"
    forecasts ||--o{ scenarios : "has many"

    metric_definitions {
        string id PK
        string organization_id FK
        string name
        string code UK
        json formula
        string unit
        json thresholds
    }

    metric_values {
        string id PK
        string metric_id FK
        float value
        json dimensions
        datetime timestamp
    }

    data_sources {
        string id PK
        string organization_id FK
        string name
        DataSourceType type
        json config
        json credentials
        DataSourceStatus status
        datetime last_sync_at
    }

    embeddings {
        string id PK
        string source_type
        string source_id
        string content
        string content_hash UK
        bytes embedding
        string embedding_model
        int dimensions
    }

    llm_cache {
        string id PK
        string query_hash UK
        string model
        string prompt
        string response
        int tokens_in
        int tokens_out
        int latency_ms
        int hit_count
        datetime expires_at
    }

    chronos_events {
        string id PK
        string organization_id
        string event_type
        string category
        string severity
        string title
        string actor
        string resource_type
        string resource_id
        string hash
        int magnitude
    }
```

## Platform & Admin Domain

```mermaid
erDiagram
    tenants ||--o{ licenses : "has many"
    tenants ||--o{ tenant_usage : "has many"
    tenants ||--o{ tenant_feature_flags : "has many"
    feature_flags ||--o{ tenant_feature_flags : "overrides"

    workflows ||--o{ workflow_executions : "has many"
    workflow_executions ||--o{ execution_nodes : "has many"
    workflow_executions ||--o{ approvals : "has many"

    tenants {
        string id PK
        string name
        string slug UK
        TenantPlan plan
        TenantStatus status
        int user_count
        int user_limit
        decimal mrr
        string industry
        datetime trial_ends_at
    }

    licenses {
        string id PK
        string tenant_id FK
        string license_key UK
        LicenseType type
        LicenseStatus status
        int seats
        int seats_used
        json features
        BillingCycle billing_cycle
        decimal revenue
        datetime expires_at
    }

    workflows {
        string id PK
        string organization_id FK
        string name
        json trigger
        json definition
        WorkflowStatus status
    }

    ledger_entries {
        string id PK
        string organization_id
        string entry_type
        string reference_id
        string actor_id
        string action
        string data_hash
        string previous_hash
    }

    audit_logs {
        string id PK
        string organization_id FK
        string user_id FK
        string action
        string resource_type
        string resource_id
        json details
        string ip_address
    }

    admin_settings {
        string id PK
        string organization_id
        string key
        string value
        boolean encrypted
        string category
    }
```

## Sovereign & Governance Domain

```mermaid
erDiagram
    organizations ||--o{ eternal_artifacts : "has many"
    organizations ||--o{ eternal_migrations : "has many"
    organizations ||--o{ eternal_succession : "has many"
    eternal_artifacts ||--o{ eternal_validations : "has many"
    users ||--o{ eternal_artifacts : "created"

    organizations ||--o{ symbiont_entities : "has many"
    organizations ||--o{ symbiont_opportunities : "has many"
    organizations ||--o{ symbiont_relationships : "has many"
    symbiont_entities ||--o{ symbiont_opportunities : "has many"
    symbiont_entities ||--o{ symbiont_relationships : "entity"
    symbiont_entities ||--o{ symbiont_relationships : "related"
    symbiont_opportunities ||--o{ symbiont_simulations : "has many"

    organizations ||--o{ vox_stakeholders : "has many"
    vox_stakeholders ||--o{ vox_signals : "has many"
    vox_stakeholders ||--o{ vox_impacts : "has many"
    vox_stakeholders ||--o{ vox_votes : "has many"
    organizations ||--o{ vox_assemblies : "has many"

    digital_twins ||--o{ twin_snapshots : "has many"
    witness_records ||--o{ custody_events : "has many"
    truth_claims ||--o{ claim_evidence : "has many"
    truth_claims ||--o{ claim_votes : "has many"
    knowledge_articles ||--o{ article_versions : "has many"

    eternal_artifacts {
        string id PK
        string organization_id FK
        EternalArtifactType artifact_type
        string title
        text content
        string content_hash
        float importance_score
        int retention_years
        EternalAccessLevel access_level
        EternalVerificationStatus verification_status
    }

    vox_stakeholders {
        string id PK
        string organization_id FK
        VoxStakeholderType stakeholder_type
        string name
        int population_size
        float voice_weight
        json veto_rights
        json ai_proxy_config
    }

    digital_twins {
        string id PK
        string organization_id
        TwinEntityType entity_type
        string entity_name
        json current_state
        float health_score
        int sync_frequency
    }

    witness_records {
        string id PK
        string organization_id
        WitnessEventType event_type
        string content_hash
        json attestations
        LegalRelevance legal_relevance
    }
```

## Model Count Summary

| Schema File | Models | Enums | Key Domain |
|-------------|--------|-------|------------|
| **base.prisma** | 7 | 2 | Users, orgs, auth, teams |
| **data.prisma** | 14 | 16 | Metrics, alerts, forecasts, lineage, embeddings, health, chronos |
| **platform.prisma** | 15 | 8 | Workflows, tenants, licenses, feature flags, ledger, translations |
| **sovereign.prisma** | 20 | 38 | Eternal, Symbiont, Vox, Digital Twins, Witness, Truth Claims, Knowledge |
| **TOTAL** | **~56 models** | **~64 enums** | Full platform |

## Key Relationships

```mermaid
flowchart TD
    ORG["organizations<br/>(Root Entity)"] --> U["users"]
    ORG --> T["teams"]
    ORG --> DS["data_sources"]
    ORG --> D["deliberations"]
    ORG --> W["workflows"]
    ORG --> M["metric_definitions"]

    U --> S["sessions"]
    U --> AK["api_keys"]
    U --> AL["audit_logs"]
    U --> CQ["council_queries"]

    D --> DP["decision_packets"]
    DP --> DO["decision_outcomes"]

    DS --> SM["schema_mappings"]
    M --> MV["metric_values"]
    M --> A["alerts"]

    W --> WE["workflow_executions"]
    WE --> EN["execution_nodes"]
    WE --> AP["approvals"]

    ORG --> EA["eternal_artifacts"]
    ORG --> SE["symbiont_entities"]
    ORG --> VS["vox_stakeholders"]
    ORG --> DT["digital_twins"]

    style ORG fill:#6366f1,color:#fff
    style D fill:#10b981,color:#fff
    style DP fill:#8b5cf6,color:#fff
```
