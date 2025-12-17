# Datacendia Sovereign Infrastructure

> **Air-gapped, self-hosted enterprise infrastructure. Zero cloud dependencies.**

This directory contains Docker Compose configurations and setup scripts for the complete Datacendia Sovereign Stack.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DATACENDIA SOVEREIGN STACK                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  LAYER 3: INTELLIGENCE                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                      │
│  │   Ollama     │  │   Council    │  │   Agents     │                      │
│  │ (AI Models)  │  │  (Decision)  │  │ (Advisors)   │                      │
│  └──────────────┘  └──────────────┘  └──────────────┘                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  LAYER 2: ORCHESTRATION                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │    n8n       │  │   BullMQ     │  │   Unleash    │  │   Airbyte    │   │
│  │ (Workflows)  │  │  (Queues)    │  │  (Flags)     │  │ (Pipelines)  │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
├─────────────────────────────────────────────────────────────────────────────┤
│  LAYER 1: OBSERVABILITY & SECURITY                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Prometheus  │  │    Loki      │  │   Grafana    │  │   Wazuh      │   │
│  │  (Metrics)   │  │   (Logs)     │  │ (Dashboards) │  │   (XDR)      │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                      │
│  │  Infisical   │  │   Trivy      │  │   Keycloak   │                      │
│  │  (Secrets)   │  │  (Scanner)   │  │   (SSO)      │                      │
│  └──────────────┘  └──────────────┘  └──────────────┘                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  LAYER 0: DATA STORAGE                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  PostgreSQL  │  │ Apache Druid │  │    MinIO     │  │    Redis     │   │
│  │  + pgvector  │  │ (Analytics)  │  │  (Objects)   │  │  (Cache)     │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
│  ┌──────────────┐                                                          │
│  │ Meilisearch  │                                                          │
│  │  (Search)    │                                                          │
│  └──────────────┘                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- 128GB RAM recommended (minimum 64GB)
- 500GB+ SSD storage
- Intel i7/i9 or AMD Ryzen 7/9 processor

### 1. Start the Stack

```bash
cd infrastructure

# Start all services
docker-compose -f docker-compose.sovereign.yml up -d

# Or start specific profiles
docker-compose -f docker-compose.sovereign.yml --profile observability up -d
docker-compose -f docker-compose.sovereign.yml --profile security up -d
```

### 2. Verify Services

| Service | URL | Default Credentials |
|---------|-----|---------------------|
| Grafana | http://localhost:3001 | admin / cendia_sovereign_2025 |
| Prometheus | http://localhost:9090 | - |
| MinIO Console | http://localhost:9001 | cendia_admin / cendia_sovereign_2025 |
| Druid Console | http://localhost:8888 | - |
| n8n | http://localhost:5678 | admin / cendia_sovereign_2025 |
| Keycloak | http://localhost:8080 | admin / cendia_sovereign_2025 |
| Infisical | http://localhost:8090 | (setup required) |
| Meilisearch | http://localhost:7700 | cendia_sovereign_2025 |
| Unleash | http://localhost:4242 | (API token) |
| Airbyte | http://localhost:8000 | - |

### 3. Configure Environment

Create a `.env` file in the infrastructure directory:

```env
# Database
POSTGRES_USER=cendia
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=datacendia

# MinIO (Object Storage)
MINIO_ROOT_USER=cendia_admin
MINIO_ROOT_PASSWORD=your_secure_password

# Grafana
GRAFANA_USER=admin
GRAFANA_PASSWORD=your_secure_password

# n8n (Workflows)
N8N_USER=admin
N8N_PASSWORD=your_secure_password

# Keycloak (SSO)
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=your_secure_password

# Infisical (Secrets)
INFISICAL_ENCRYPTION_KEY=your-32-character-encryption-key
INFISICAL_JWT_SECRET=your-jwt-secret-here

# Meilisearch
MEILI_MASTER_KEY=your_secure_password

# Druid
DRUID_ROUTER_URL=http://localhost:8888
```

## 📦 Component Details

### PostgreSQL + pgvector
**Purpose:** Primary relational database with vector search capabilities.

**Cendia Features Powered:**
- User accounts, permissions, billing
- Vector embeddings for CendiaGnosis™ RAG
- Agent memory storage

**Key Tables:**
- `document_embeddings` - RAG document chunks
- `decision_embeddings` - Decision context memory
- `agent_memory` - Long-term agent context

### Apache Druid
**Purpose:** High-performance analytics for time-series data.

**Cendia Features Powered:**
- CendiaChronos™ (Time Travel) - Sub-second queries on decision history
- CendiaWitness™ (Audit Trail) - Billions of audit events
- CendiaPulse™ (Monitoring) - Real-time metrics dashboards

**Data Sources:**
- `cendia_audit_events` - Audit logs
- `cendia_decision_history` - Decision timeline
- `cendia_agent_metrics` - Agent performance
- `cendia_system_telemetry` - System health

### MinIO
**Purpose:** S3-compatible object storage.

**Cendia Features Powered:**
- CendiaGnosis™ - PDF/document storage
- CendiaVault™ - Secure file storage
- Backups and exports

**Buckets:**
- `cendia-documents` - PDFs for RAG
- `cendia-exports` - Court exports
- `cendia-backups` - Database backups

### Redis + BullMQ
**Purpose:** Caching and job queue management.

**Cendia Features Powered:**
- Agent deliberation queue (prevents GPU crashes)
- Session management
- Real-time notifications

**Queues:**
- `agent-deliberation` - AI thinking jobs
- `council-session` - Council meetings
- `document-processing` - PDF ingestion
- `embedding-generation` - Vector creation

### Prometheus + Loki + Grafana (PLG Stack)
**Purpose:** Full observability.

**Cendia Features Powered:**
- CendiaPulse™ dashboards
- Log aggregation
- Alerting

### n8n
**Purpose:** Visual workflow automation.

**Cendia Features Powered:**
- CendiaFlow™ - No-code workflow builder
- Integration automations
- Trigger-based agent activation

### Keycloak
**Purpose:** Enterprise identity management.

**Cendia Features Powered:**
- CendiaKey™ - SSO
- RBAC permissions
- SAML/OIDC federation

### Infisical
**Purpose:** Secret management.

**Cendia Features Powered:**
- CendiaGuard™ - Credential vault
- API key rotation
- Environment injection

### Meilisearch
**Purpose:** Lightning-fast full-text search.

**Cendia Features Powered:**
- CendiaGnosis™ - Document search
- Decision search
- Entity lookup

### Unleash
**Purpose:** Feature flag management.

**Cendia Features Powered:**
- CendiaControl™ - Dynamic toggles
- War Room mode switching
- Gradual rollouts

## 🔧 Backend Integration

### Install Dependencies

```bash
cd backend
npm install bullmq minio axios @prisma/client
npm install -D @types/minio
```

### Service Initialization

```typescript
// backend/src/index.ts
import { agentQueueService } from './services/queue/AgentQueueService';
import { druidService } from './services/storage/DruidService';
import { minioService } from './services/storage/MinioService';
import { vectorService } from './services/storage/VectorService';

async function initializeServices() {
  // Initialize job queues
  await agentQueueService.initialize();
  
  // Initialize object storage
  await minioService.initialize();
  
  // Initialize vector search
  await vectorService.initialize();
  
  // Druid auto-checks availability
  await druidService.checkAvailability();
  
  console.log('[Datacendia] All sovereign services initialized');
}
```

## 🛡️ Security Hardening

### 1. Run Trivy Scanner

```bash
# Scan Docker images
trivy image pgvector/pgvector:pg16
trivy image apache/druid:29.0.1
trivy image minio/minio:latest

# Scan filesystem
trivy fs --security-checks vuln,config .
```

### 2. Deploy Wazuh Agent

```bash
# Add Wazuh container to the stack
docker-compose -f docker-compose.wazuh.yml up -d
```

### 3. Rotate Secrets

Use Infisical CLI to rotate all secrets:

```bash
infisical secrets rotate --env=production
```

## 📊 Resource Allocation

For a 128GB RAM machine:

| Service | RAM | CPU | Notes |
|---------|-----|-----|-------|
| PostgreSQL | 16GB | 4 cores | pgvector needs memory |
| Apache Druid | 32GB | 8 cores | Split across nodes |
| Ollama | 48GB | GPU | For AI models |
| Redis | 4GB | 2 cores | |
| MinIO | 4GB | 2 cores | |
| Grafana/Prometheus/Loki | 8GB | 4 cores | |
| n8n/Keycloak/Other | 8GB | 4 cores | |
| System Reserve | 8GB | 2 cores | |

## 🔄 Backup & Recovery

### Automated Backups

```bash
# Database backup to MinIO
./scripts/backup-postgres.sh

# Druid segments backup
./scripts/backup-druid.sh
```

### Disaster Recovery

1. Stop all services
2. Restore PostgreSQL from MinIO backup
3. Restore Druid deep storage
4. Restart services

## 📝 License

Datacendia Sovereign Stack - Enterprise Self-Hosted Edition
