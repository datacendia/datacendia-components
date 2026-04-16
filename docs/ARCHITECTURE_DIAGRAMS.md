# Datacendia Architecture Diagrams

## Deployment Options Overview

Datacendia supports three primary deployment architectures to meet diverse enterprise requirements:

| Deployment | Best For | Data Residency | Internet Required | Compliance |
|------------|----------|----------------|-------------------|------------|
| **Private Cloud** | Most enterprises | Customer's cloud tenant | Yes (outbound only) | SOC 2, GDPR, HIPAA |
| **On-Premises** | Regulated industries | Customer's data center | Optional | FedRAMP, ITAR, PCI-DSS |
| **Air-Gapped** | Defense, Intelligence | Isolated network | No | IL4/IL5, CJIS, Secret |

---

## 1. Private Cloud Deployment

**Target:** Enterprise customers using AWS, Azure, or GCP  
**Use Case:** Financial services, healthcare, SaaS companies

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CUSTOMER'S CLOUD TENANT (VPC)                        │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         KUBERNETES CLUSTER (EKS/AKS/GKE)              │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │                      INGRESS / LOAD BALANCER                    │  │  │
│  │  │                    (ALB / NGINX / Istio Gateway)                │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  │                                   │                                    │  │
│  │         ┌─────────────────────────┼─────────────────────────┐          │  │
│  │         ▼                         ▼                         ▼          │  │
│  │  ┌─────────────┐          ┌─────────────┐          ┌─────────────┐     │  │
│  │  │  FRONTEND   │          │   BACKEND   │          │  WEBSOCKET  │     │  │
│  │  │   (React)   │◄────────►│  (Node.js)  │◄────────►│   SERVER    │     │  │
│  │  │   3 pods    │          │   5 pods    │          │   3 pods    │     │  │
│  │  └─────────────┘          └──────┬──────┘          └─────────────┘     │  │
│  │                                  │                                      │  │
│  │         ┌────────────────────────┼────────────────────────┐            │  │
│  │         ▼                        ▼                        ▼            │  │
│  │  ┌─────────────┐          ┌─────────────┐          ┌─────────────┐     │  │
│  │  │   OLLAMA    │          │    REDIS    │          │   DRUID     │     │  │
│  │  │  LLM Pods   │          │   CLUSTER   │          │  (Chronos)  │     │  │
│  │  │  GPU nodes  │          │   3 nodes   │          │   3 nodes   │     │  │
│  │  └─────────────┘          └─────────────┘          └─────────────┘     │  │
│  │                                                                         │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                      │                                        │
│  ┌───────────────────────────────────┼───────────────────────────────────┐   │
│  │                    MANAGED DATA SERVICES                               │   │
│  │  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌───────────┐  │   │
│  │  │ POSTGRESQL  │   │    NEO4J    │   │    MINIO    │   │  SECRETS  │  │   │
│  │  │    (RDS)    │   │   (Graph)   │   │ (S3/Blob)   │   │  MANAGER  │  │   │
│  │  │  Multi-AZ   │   │  3 replicas │   │  encrypted  │   │(Vault/KMS)│  │   │
│  │  └─────────────┘   └─────────────┘   └─────────────┘   └───────────┘  │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │                         SECURITY & MONITORING                          │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │   │
│  │  │   WAF    │  │ CloudTrl │  │Prometheus│  │ Grafana  │  │  SIEM    │ │   │
│  │  │(Shield)  │  │ (Audit)  │  │ +Alertmgr│  │Dashboard │  │ Export   │ │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ TLS 1.3 Only
                                      ▼
                        ┌─────────────────────────┐
                        │     ENTERPRISE USERS    │
                        │   (SSO / SAML / OIDC)   │
                        └─────────────────────────┘
```

### Private Cloud Components

| Component | Service | Scaling | Purpose |
|-----------|---------|---------|---------|
| Frontend | React SPA | 3+ pods, HPA | User interface |
| Backend | Node.js API | 5+ pods, HPA | Business logic, API |
| Ollama | GPU pods | 2-10 pods | Local LLM inference |
| PostgreSQL | RDS/CloudSQL | Multi-AZ | Primary database |
| Neo4j | Managed/Self | 3 replicas | Knowledge graph |
| Redis | ElastiCache | Cluster mode | Caching, sessions |
| Druid | Self-managed | 3+ nodes | Time-series (Chronos) |
| MinIO/S3 | Object storage | Auto | Document storage |

### Network Requirements

```
OUTBOUND (Optional):
├── Ollama model downloads (ollama.com) - initial setup only
├── Telemetry (optional, can be disabled)
└── Software updates (can use private registry)

INBOUND:
├── HTTPS (443) - User access via load balancer
└── WSS (443) - WebSocket for real-time updates
```

---

## 2. On-Premises Deployment

**Target:** Banks, healthcare systems, government contractors  
**Use Case:** Strict data residency, regulatory compliance

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CUSTOMER DATA CENTER / COLO                            │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         DMZ / PERIMETER NETWORK                        │  │
│  │  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐             │  │
│  │  │   FIREWALL   │───►│  REVERSE     │───►│    WAF /     │             │  │
│  │  │  (Palo Alto) │    │  PROXY       │    │   IDS/IPS    │             │  │
│  │  └──────────────┘    │  (F5/HAProxy)│    │  (Snort)     │             │  │
│  │                      └──────────────┘    └──────────────┘             │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                    APPLICATION NETWORK (VLAN 100)                      │  │
│  │                                                                        │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │                 KUBERNETES CLUSTER (RKE2/OpenShift)              │  │  │
│  │  │                                                                   │  │  │
│  │  │   ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐    │  │  │
│  │  │   │  MASTER   │  │  MASTER   │  │  MASTER   │  │  WORKER   │    │  │  │
│  │  │   │  NODE 1   │  │  NODE 2   │  │  NODE 3   │  │  POOL     │    │  │  │
│  │  │   │           │  │           │  │           │  │ (10 nodes)│    │  │  │
│  │  │   └───────────┘  └───────────┘  └───────────┘  └───────────┘    │  │  │
│  │  │                                                                   │  │  │
│  │  │   ┌───────────────────────────────────────────────────────────┐  │  │  │
│  │  │   │                    GPU NODE POOL                          │  │  │  │
│  │  │   │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐      │  │  │  │
│  │  │   │  │ NVIDIA  │  │ NVIDIA  │  │ NVIDIA  │  │ NVIDIA  │      │  │  │  │
│  │  │   │  │ A100/H100│  │ A100/H100│  │ A100/H100│  │ A100/H100│      │  │  │  │
│  │  │   │  │ Ollama  │  │ Ollama  │  │ Ollama  │  │ Ollama  │      │  │  │  │
│  │  │   │  └─────────┘  └─────────┘  └─────────┘  └─────────┘      │  │  │  │
│  │  │   └───────────────────────────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                        │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                     DATABASE NETWORK (VLAN 200)                        │  │
│  │                                                                        │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │  │
│  │  │ POSTGRESQL  │  │    NEO4J    │  │   REDIS     │  │   DRUID     │   │  │
│  │  │  CLUSTER    │  │  CLUSTER    │  │  SENTINEL   │  │  CLUSTER    │   │  │
│  │  │             │  │             │  │             │  │             │   │  │
│  │  │ Primary +   │  │ 3 Core +    │  │ 3 Sentinel  │  │ Coordinator │   │  │
│  │  │ 2 Replicas  │  │ 2 Read      │  │ 3 Redis     │  │ + Brokers   │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │  │
│  │                                                                        │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                     STORAGE NETWORK (VLAN 300)                         │  │
│  │                                                                        │  │
│  │  ┌─────────────────────────────┐  ┌─────────────────────────────┐     │  │
│  │  │         SAN / NAS           │  │        BACKUP SYSTEM        │     │  │
│  │  │   (NetApp / Pure / Dell)    │  │      (Veeam / Commvault)    │     │  │
│  │  │                             │  │                             │     │  │
│  │  │  - PostgreSQL data          │  │  - Daily snapshots          │     │  │
│  │  │  - Neo4j data               │  │  - 30-day retention         │     │  │
│  │  │  - MinIO buckets            │  │  - Offsite replication      │     │  │
│  │  │  - Druid segments           │  │  - Encrypted backups        │     │  │
│  │  └─────────────────────────────┘  └─────────────────────────────┘     │  │
│  │                                                                        │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                    MANAGEMENT NETWORK (VLAN 400)                       │  │
│  │                                                                        │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│  │
│  │  │ Ansible  │  │ Vault    │  │Prometheus│  │ Grafana  │  │  SIEM    ││  │
│  │  │ Tower    │  │ (Secrets)│  │ +Thanos  │  │ Loki     │  │ (Splunk) ││  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘│  │
│  │                                                                        │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                         Enterprise Network (SSO/AD)
                                      │
                        ┌─────────────────────────┐
                        │   CORPORATE USERS       │
                        │  (Active Directory)     │
                        └─────────────────────────┘
```

### On-Premises Hardware Requirements

| Component | Minimum | Recommended | High Availability |
|-----------|---------|-------------|-------------------|
| **K8s Masters** | 3x (4 CPU, 16GB) | 3x (8 CPU, 32GB) | 5x across zones |
| **K8s Workers** | 5x (8 CPU, 32GB) | 10x (16 CPU, 64GB) | 15x across racks |
| **GPU Nodes** | 2x NVIDIA A100 | 4x NVIDIA A100 | 6x with failover |
| **PostgreSQL** | 3x (8 CPU, 64GB) | 3x (16 CPU, 128GB) | Patroni cluster |
| **Neo4j** | 3x (8 CPU, 64GB) | 5x (16 CPU, 128GB) | Causal cluster |
| **Storage** | 10TB SSD | 50TB NVMe | Replicated SAN |

### Network Segmentation

```
VLAN 100 - Application Tier
├── Kubernetes nodes
├── Load balancers
└── Application pods

VLAN 200 - Database Tier
├── PostgreSQL cluster
├── Neo4j cluster
├── Redis cluster
└── Druid cluster

VLAN 300 - Storage Tier
├── SAN/NAS systems
├── Backup infrastructure
└── Object storage (MinIO)

VLAN 400 - Management Tier
├── Monitoring (Prometheus/Grafana)
├── Secrets management (Vault)
├── Configuration management (Ansible)
└── Log aggregation (SIEM)
```

---

## 3. Air-Gapped Deployment

**Target:** Defense, intelligence agencies, classified environments  
**Use Case:** IL4/IL5, Secret/Top Secret, CJIS compliance

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     AIR-GAPPED SECURE FACILITY (SCIF)                       │
│                                                                             │
│  ══════════════════════════════════════════════════════════════════════════ │
│  ║                    PHYSICAL SECURITY BOUNDARY                          ║ │
│  ║                   (Faraday Cage / TEMPEST Shielded)                    ║ │
│  ══════════════════════════════════════════════════════════════════════════ │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                    DATA DIODE / UNIDIRECTIONAL GATEWAY                 │  │
│  │  ┌──────────────────────────────────────────────────────────────────┐ │  │
│  │  │  IMPORT ONLY (No data exfiltration possible)                     │ │  │
│  │  │  ┌────────────┐    ┌────────────┐    ┌────────────┐              │ │  │
│  │  │  │  MEDIA     │───►│  MALWARE   │───►│  CONTENT   │───►[IMPORT] │ │  │
│  │  │  │  SCANNER   │    │  ANALYSIS  │    │  FILTER    │              │ │  │
│  │  │  │ (Kiosk)    │    │ (Sandbox)  │    │ (DLP)      │              │ │  │
│  │  │  └────────────┘    └────────────┘    └────────────┘              │ │  │
│  │  └──────────────────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                       SECURE COMPUTE ENCLAVE                           │  │
│  │                                                                        │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │           HARDENED KUBERNETES (RKE2 FIPS / OpenShift)            │  │  │
│  │  │                                                                   │  │  │
│  │  │   ┌─────────────────────────────────────────────────────────┐    │  │  │
│  │  │   │              DATACENDIA APPLICATION STACK                │    │  │  │
│  │  │   │                                                          │    │  │  │
│  │  │   │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │    │  │  │
│  │  │   │  │ FRONTEND │  │ BACKEND  │  │ WEBSOCKET│  │  WORKER  │ │    │  │  │
│  │  │   │  │ (React)  │  │(Node.js) │  │  SERVER  │  │  QUEUE   │ │    │  │  │
│  │  │   │  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │    │  │  │
│  │  │   │                                                          │    │  │  │
│  │  │   │  ┌──────────────────────────────────────────────────┐   │    │  │  │
│  │  │   │  │              LOCAL LLM INFERENCE                  │   │    │  │  │
│  │  │   │  │  ┌────────────────────────────────────────────┐  │   │    │  │  │
│  │  │   │  │  │              OLLAMA CLUSTER                 │  │   │    │  │  │
│  │  │   │  │  │                                             │  │   │    │  │  │
│  │  │   │  │  │  ┌─────────┐  ┌─────────┐  ┌─────────┐     │  │   │    │  │  │
│  │  │   │  │  │  │ LLAMA   │  │ MISTRAL │  │ CUSTOM  │     │  │   │    │  │  │
│  │  │   │  │  │  │ 3.2 70B │  │ 7B      │  │ FINE-   │     │  │   │    │  │  │
│  │  │   │  │  │  │         │  │         │  │ TUNED   │     │  │   │    │  │  │
│  │  │   │  │  │  └─────────┘  └─────────┘  └─────────┘     │  │   │    │  │  │
│  │  │   │  │  │     ▲            ▲            ▲            │  │   │    │  │  │
│  │  │   │  │  │     └────────────┴────────────┘            │  │   │    │  │  │
│  │  │   │  │  │              NO EXTERNAL CALLS             │  │   │    │  │  │
│  │  │   │  │  │          (100% Local Inference)            │  │   │    │  │  │
│  │  │   │  │  └────────────────────────────────────────────┘  │   │    │  │  │
│  │  │   │  │                                                   │   │    │  │  │
│  │  │   │  │  GPU: NVIDIA A100/H100 (FIPS 140-2 validated)    │   │    │  │  │
│  │  │   │  └──────────────────────────────────────────────────┘   │    │  │  │
│  │  │   └──────────────────────────────────────────────────────────┘    │  │  │
│  │  │                                                                   │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                        │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │                    LOCAL DATA STORES                             │  │  │
│  │  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐    │  │  │
│  │  │  │PostgreSQL │  │   Neo4j   │  │   Redis   │  │   MinIO   │    │  │  │
│  │  │  │  (FIPS)   │  │(Encrypted)│  │ (In-mem)  │  │(Encrypted)│    │  │  │
│  │  │  │           │  │           │  │           │  │           │    │  │  │
│  │  │  │ AES-256   │  │ AES-256   │  │ TLS 1.3   │  │ AES-256   │    │  │  │
│  │  │  │ at-rest   │  │ at-rest   │  │ in-transit│  │ at-rest   │    │  │  │
│  │  │  └───────────┘  └───────────┘  └───────────┘  └───────────┘    │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                        │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                    SECURITY & COMPLIANCE                               │  │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐          │  │
│  │  │   HSM     │  │  STIG     │  │  AUDIT    │  │   LOCAL   │          │  │
│  │  │ (Key Mgmt)│  │ Hardened  │  │   LOGS    │  │   SIEM    │          │  │
│  │  │ FIPS 140-3│  │  Images   │  │ (Tamper-  │  │ (Offline) │          │  │
│  │  │           │  │           │  │  proof)   │  │           │          │  │
│  │  └───────────┘  └───────────┘  └───────────┘  └───────────┘          │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ══════════════════════════════════════════════════════════════════════════ │
│  ║                    NO NETWORK CONNECTIVITY                             ║ │
│  ║              (Physically isolated from all networks)                   ║ │
│  ══════════════════════════════════════════════════════════════════════════ │
│                                                                             │
│                        ┌─────────────────────────┐                          │
│                        │   CLASSIFIED USERS      │                          │
│                        │   (CAC/PIV Required)    │                          │
│                        │   (Need-to-Know Basis)  │                          │
│                        └─────────────────────────┘                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Air-Gapped Security Controls

| Control | Implementation | Compliance |
|---------|----------------|------------|
| **Data Import** | Data diode, sneakernet with scanning | IL4/IL5 |
| **Encryption at Rest** | AES-256, FIPS 140-2/3 validated | CJIS, DoD |
| **Encryption in Transit** | TLS 1.3, mTLS between services | FedRAMP High |
| **Key Management** | HSM (Thales Luna, AWS CloudHSM GovCloud) | PCI-DSS |
| **Access Control** | CAC/PIV, MFA, RBAC | NIST 800-53 |
| **Audit Logging** | Tamper-proof, signed logs | SOX, FISMA |
| **LLM Inference** | 100% local, no API calls | Data sovereignty |

### Software Supply Chain

```
AIR-GAPPED SOFTWARE DELIVERY:

1. SECURE BUILD PIPELINE (Internet-connected, separate facility)
   ├── Source code review
   ├── SAST/DAST scanning
   ├── Container image building
   ├── SBOM generation
   └── Digital signing

2. SECURE TRANSFER
   ├── Burn to encrypted media (USB/DVD)
   ├── Two-person integrity check
   ├── Physical courier (cleared personnel)
   └── Chain of custody documentation

3. IMPORT PROCESS
   ├── Media scanning (malware, exfiltration)
   ├── Signature verification
   ├── SBOM validation
   └── Import to local registry

4. LOCAL REGISTRY
   ├── Harbor (air-gapped)
   ├── Signed images only
   └── Vulnerability scanning (offline DB)
```

---

## Deployment Comparison Matrix

| Feature | Private Cloud | On-Premises | Air-Gapped |
|---------|---------------|-------------|------------|
| **Setup Time** | 1-2 days | 2-4 weeks | 4-8 weeks |
| **Maintenance** | Managed | Customer IT | Customer IT + Cleared |
| **Updates** | Automatic | Scheduled | Manual import |
| **LLM Models** | Download on demand | Pre-loaded | Sneakernet |
| **Cost** | $$ | $$$ | $$$$ |
| **Compliance** | SOC 2, HIPAA | + PCI-DSS | + IL4/IL5, CJIS |
| **Internet** | Required | Optional | None |
| **GPU** | Cloud GPUs | On-prem GPUs | On-prem GPUs |

---

## Data Flow Diagrams

### Deliberation Data Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DELIBERATION DATA FLOW                          │
└─────────────────────────────────────────────────────────────────────────┘

  USER                                                              STORAGE
    │                                                                  │
    │ 1. Submit Question                                               │
    ▼                                                                  │
┌─────────┐    2. Authenticate    ┌─────────┐    3. Log Request   ┌─────────┐
│ BROWSER │───────────────────────►│   API   │────────────────────►│  AUDIT  │
│         │◄───────────────────────│ GATEWAY │◄────────────────────│   LOG   │
└─────────┘    11. Stream Response └────┬────┘                     └─────────┘
                                        │
                    4. Route to Backend │
                                        ▼
                                  ┌───────────┐
                                  │  BACKEND  │
                                  │  SERVER   │
                                  └─────┬─────┘
                                        │
           ┌────────────────────────────┼────────────────────────────┐
           │                            │                            │
           ▼                            ▼                            ▼
     ┌───────────┐              ┌───────────┐              ┌───────────┐
     │   CACHE   │              │  QUEUE    │              │  GRAPH    │
     │  (Redis)  │              │ (Worker)  │              │  (Neo4j)  │
     │           │              │           │              │           │
     │ Check if  │              │ Enqueue   │              │ Fetch     │
     │ cached    │              │ AI work   │              │ context   │
     └───────────┘              └─────┬─────┘              └───────────┘
                                      │
                         5. Distribute to Agents
                                      │
           ┌──────────────────────────┼──────────────────────────┐
           ▼                          ▼                          ▼
     ┌───────────┐            ┌───────────┐            ┌───────────┐
     │  AGENT 1  │            │  AGENT 2  │            │  AGENT N  │
     │   (CFO)   │            │  (COO)    │            │  (CISO)   │
     └─────┬─────┘            └─────┬─────┘            └─────┬─────┘
           │                        │                        │
           │    6. LLM Inference    │                        │
           ▼                        ▼                        ▼
     ┌─────────────────────────────────────────────────────────────┐
     │                      OLLAMA CLUSTER                          │
     │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
     │  │   GPU 1     │  │   GPU 2     │  │   GPU N     │          │
     │  │  LLAMA 3.2  │  │  LLAMA 3.2  │  │  LLAMA 3.2  │          │
     │  └─────────────┘  └─────────────┘  └─────────────┘          │
     └─────────────────────────────────────────────────────────────┘
           │                        │                        │
           │    7. Agent Responses  │                        │
           ▼                        ▼                        ▼
     ┌─────────────────────────────────────────────────────────────┐
     │                   8. CROSS-EXAMINATION                       │
     │         Agents challenge each other's conclusions            │
     └─────────────────────────────────────────────────────────────┘
                                      │
                         9. Synthesis │
                                      ▼
                              ┌───────────┐
                              │ SYNTHESIS │
                              │  ENGINE   │
                              │           │
                              │ Aggregate │
                              │ + Score   │
                              └─────┬─────┘
                                    │
                    10. Store Result│
                                    ▼
                              ┌───────────┐
                              │PostgreSQL │
                              │           │
                              │ Decision  │
                              │ Record    │
                              └───────────┘
```

---

## Service Architecture Diagrams

> **Last updated:** April 15, 2026 — full codebase audit

### Complete Platform Architecture

```mermaid
graph TB
    subgraph Client["Client Layer"]
        WEB["React SPA"]
        API["API Clients"]
        WS["WebSocket"]
    end

    subgraph Gateway["Gateway Layer"]
        GW["CendiaGateway™<br/>AI Governance Proxy"]
        PII["PII Detection"]
        RL["Rate Limiter"]
        AUTH["JWT Auth + MFA"]
    end

    subgraph Core["Core Services"]
        COUNCIL["AI Council<br/>14 Agents"]
        DELIB["Deliberation<br/>Engine"]
        DEC["Decision<br/>Service"]
        SYNTH["Synthesis<br/>Engine"]
    end

    subgraph Intel["Decision Intelligence"]
        CHRONO["CendiaChronos™"]
        PREMORT["PreMortem™"]
        GHOST["Ghost Board™"]
        CASCADE["CendiaCascade™"]
    end

    subgraph Security["Security Layer"]
        CE["CredentialEvidence™"]
        HSM["HSM Adapter"]
        KMS["Key Management"]
        PQ["Post-Quantum KMS"]
        ZKP["Zero-Knowledge Proofs"]
        MFA["MFA Service"]
    end

    subgraph Compliance["Compliance Layer (25 Services)"]
        COMP["ComplianceEnforcer<br/>73+ Frameworks"]
        SOC2["SOC 2"]
        HIPAA["HIPAA"]
        GDPR["GDPR"]
        PLAT["11 Platinum Services"]
    end

    subgraph Sovereign["Sovereign Layer (24 Services)"]
        DIODE["Data Diode"]
        TPM["TPM Attestation"]
        MESH["Federated Mesh"]
        QRA["QR Air-Gap"]
        SOVARCH["11 Architectural Patterns"]
    end

    subgraph Evidence["Evidence & Audit"]
        VAULT["Evidence Vault"]
        RECEIPT["Regulator's Receipt™"]
        LEDGER["Immutable Ledger"]
    end

    subgraph DCII["DCII Infrastructure"]
        IISS["IISS Score"]
        MEDIA["Media Auth"]
        JURIS["Jurisdiction"]
        TSA["Timestamp Authority"]
    end

    subgraph Data["Data Layer"]
        PG["PostgreSQL"]
        REDIS["Redis Cluster"]
        NEO["Neo4j Graph"]
        QDRANT["Qdrant Vectors"]
    end

    subgraph AI["AI Layer"]
        OLLAMA["Ollama Cluster<br/>8 Model Slots"]
        EMBED["Embeddings<br/>qwen3-embedding:4b"]
        RAG["RAG Service"]
    end

    WEB --> AUTH
    API --> GW
    GW --> PII --> COUNCIL
    AUTH --> MFA
    COUNCIL --> DELIB
    DELIB --> SYNTH
    SYNTH --> DEC
    DEC --> VAULT
    VAULT --> RECEIPT
    CE --> LEDGER
    HSM --> CE
    KMS --> HSM
    COMP --> SOC2
    COMP --> PLAT
    SOVEREIGN --> DIODE
    COUNCIL --> OLLAMA
    DELIB --> REDIS
    DEC --> PG
    RAG --> QDRANT

    classDef client fill:#4299e1,stroke:#2b6cb0,color:#fff
    classDef gw fill:#38b2ac,stroke:#285e61,color:#fff
    classDef core fill:#ed8936,stroke:#c05621,color:#fff
    classDef sec fill:#e53e3e,stroke:#9b2c2c,color:#fff
    classDef comp fill:#38a169,stroke:#276749,color:#fff
    classDef sov fill:#805ad5,stroke:#553c9a,color:#fff
    classDef data fill:#4a5568,stroke:#2d3748,color:#fff
    classDef ai fill:#d69e2e,stroke:#975a16,color:#fff

    class WEB,API,WS client
    class GW,PII,RL,AUTH gw
    class COUNCIL,DELIB,DEC,SYNTH core
    class CE,HSM,KMS,PQ,ZKP,MFA sec
    class COMP,SOC2,HIPAA,GDPR,PLAT comp
    class DIODE,TPM,MESH,QRA,SOVARCH sov
    class PG,REDIS,NEO,QDRANT data
    class OLLAMA,EMBED,RAG ai
```

### AI Model Routing Architecture

```mermaid
graph LR
    subgraph Slots["8 Model Slots"]
        LARGE["large<br/>llama3.3:70b"]
        FLAG["flagship<br/>qwen3:32b"]
        REASON["reasoning<br/>deepseek-r1:32b"]
        CODER["coder<br/>qwen3-coder:30b"]
        FAST["fast<br/>llama3.2:3b"]
        VISION["vision<br/>qwen3-vl:30b"]
        TRANS["translator<br/>qwen2.5:32b"]
        EMBD["embed<br/>qwen3-embedding:4b"]
    end

    subgraph Agents["Agent Routing"]
        CHIEF["Chief/CRO/CMIO"]
        CFO["CFO/CISO/Risk/CLO"]
        CDO["CDO/CTO/CIO"]
        COD["COD (Fast)"]
    end

    subgraph Router["Query Router"]
        QR["QueryRouter<br/>Classification"]
        MS["AIModelSelector<br/>Tier Gating"]
    end

    CHIEF --> LARGE
    CFO --> REASON
    CDO --> CODER
    COD --> FAST
    QR --> MS
    MS --> Slots

    classDef slot fill:#d69e2e,stroke:#975a16,color:#fff
    classDef agent fill:#4299e1,stroke:#2b6cb0,color:#fff
    classDef router fill:#ed8936,stroke:#c05621,color:#fff
    class LARGE,FLAG,REASON,CODER,FAST,VISION,TRANS,EMBD slot
    class CHIEF,CFO,CDO,COD agent
    class QR,MS router
```

### Credential Evidence Flow

```mermaid
sequenceDiagram
    participant Gen as Credential Generator
    participant CE as CredentialEvidenceService
    participant FP as SHA-256 Fingerprint
    participant ENT as Entropy Analyzer
    participant POL as Policy Engine
    participant ENV as Environment Capture
    participant HC as Hash Chain
    participant SIG as HMAC Signer
    participant DB as Persistence

    Gen->>CE: recordEvidence(credentialValue, type, userId)
    CE->>FP: computeFingerprint(value)
    FP-->>CE: 64-char hex hash
    CE->>ENT: measureEntropy(value)
    ENT-->>CE: Shannon bits + source
    CE->>POL: getPolicy(type)
    POL-->>CE: Frozen policy snapshot
    CE->>ENV: captureEnvironment()
    ENV-->>CE: Node, OpenSSL, FIPS, hostname, PID
    CE->>HC: linkToPrevious(lastHash)
    HC-->>CE: previousEvidenceHash
    CE->>SIG: sign(record)
    SIG-->>CE: HMAC-SHA256 signature
    CE->>DB: persistServiceRecord(evidence)
    CE-->>Gen: CredentialEvidenceRecord
```

### Compliance Framework Coverage

```mermaid
graph TB
    subgraph Frameworks["73+ Compliance Frameworks"]
        subgraph US["United States"]
            SOC2["SOC 2<br/>CC1-CC9"]
            HIPAA2["HIPAA<br/>HITECH"]
            FEDR["FedRAMP<br/>FISMA"]
            CCPA["CCPA/CPRA"]
            SOX["SOX"]
            CMMC["CMMC"]
            ITAR["ITAR/EAR"]
            PCI["PCI-DSS"]
            FDA["FDA 21 CFR"]
        end

        subgraph EU["European Union"]
            GDPR2["GDPR"]
            EUAI["EU AI Act"]
            DMA["DMA"]
            DSA["DSA"]
            NIS2["NIS2"]
            DORA2["DORA"]
            CSRD["CSRD"]
        end

        subgraph INTL["International"]
            ISO27["ISO 27001/27017/27018"]
            LGPD["LGPD (Brazil)"]
            PIPL["PIPL (China)"]
            PIPA["PIPA (Korea)"]
            PDPA["PDPA (Singapore)"]
            APPI["APPI (Japan)"]
        end
    end

    subgraph Services["25 Compliance Services"]
        CORE["Core Compliance"]
        PLAT2["8 Platinum"]
        EXT["11 Extended"]
        MON["3 Monitoring"]
    end

    CORE --> US
    PLAT2 --> EU
    EXT --> INTL
    MON --> Frameworks
```

### Sovereign Architecture — Air-Gap Deployment

```mermaid
graph TB
    subgraph External["External Network"]
        SRC["Data Source"]
    end

    subgraph AirGap["Air Gap Boundary"]
        DD["Data Diode<br/>Unidirectional"]
        QR2["QR Bridge<br/>Animated Sequence"]
        SCAN["ClamAV<br/>Antivirus"]
    end

    subgraph Sovereign2["Sovereign Enclave"]
        CORE2["Datacendia Core"]
        OLLAMA2["Ollama (Local)"]
        PG2["PostgreSQL"]
        RLHF["Local RLHF"]
        TPM2["TPM Attestation"]
        CANARY["Canary Tripwires"]
        REPLAY["Deterministic Replay"]
        TIMELOCK["Time-Lock Crypto"]
        MESH2["Federated Mesh"]
        PORT["Portable Instance"]
        LICENSE["Offline License"]
    end

    SRC -->|one-way| DD
    SRC -->|QR codes| QR2
    DD --> SCAN --> CORE2
    QR2 --> CORE2
    CORE2 --> OLLAMA2
    CORE2 --> PG2
    CORE2 --> RLHF
    TPM2 --> CORE2
    CANARY --> CORE2
    REPLAY --> CORE2
    MESH2 -->|sneakernet| CORE2

    classDef ext fill:#e53e3e,stroke:#9b2c2c,color:#fff
    classDef gap fill:#d69e2e,stroke:#975a16,color:#fff
    classDef sov2 fill:#805ad5,stroke:#553c9a,color:#fff
    class SRC ext
    class DD,QR2,SCAN gap
    class CORE2,OLLAMA2,PG2,RLHF,TPM2,CANARY,REPLAY,TIMELOCK,MESH2,PORT,LICENSE sov2
```

### Evidence & Audit Pipeline

```mermaid
graph LR
    subgraph Generation["Credential Generation"]
        AT["Access Token"]
        RT["Refresh Token"]
        MFA2["MFA Secret"]
        BC["Backup Codes"]
        HSM2["HSM Key"]
        EVT["Email Verification"]
        PRT["Password Reset"]
    end

    subgraph Evidence2["Evidence Layer"]
        CE2["CredentialEvidence™<br/>15 Credential Types"]
        IAL["Immutable Audit Ledger"]
        MF["Merkle Forest"]
    end

    subgraph Compliance2["Compliance Proof"]
        EV2["Evidence Vault"]
        RR["Regulator's Receipt™"]
        EXP["Audit Export"]
        TSA2["RFC 3161 Timestamp"]
    end

    AT --> CE2
    RT --> CE2
    MFA2 --> CE2
    BC --> CE2
    HSM2 --> CE2
    EVT --> CE2
    PRT --> CE2

    CE2 --> IAL
    IAL --> MF
    MF --> EV2
    EV2 --> RR
    EV2 --> EXP
    EXP --> TSA2

    classDef gen fill:#4299e1,stroke:#2b6cb0,color:#fff
    classDef ev fill:#9f7aea,stroke:#6b46c1,color:#fff
    classDef comp2 fill:#38a169,stroke:#276749,color:#fff
    class AT,RT,MFA2,BC,HSM2,EVT,PRT gen
    class CE2,IAL,MF ev
    class EV2,RR,EXP,TSA2 comp2
```

### Gateway Data Flow

```mermaid
graph LR
    subgraph Input["Incoming Request"]
        REQ["API Request<br/>OpenAI/Anthropic format"]
    end

    subgraph Gateway2["CendiaGateway™"]
        RL2["Rate Limiter"]
        PII2["PII Detector<br/>10 PII types"]
        POL2["Policy Engine<br/>block/redact/warn/allow"]
        MR["Model Router<br/>4 providers"]
        SIGN["DCII Signing"]
        AUDIT["Audit Ledger"]
        SIEM2["SIEM Forward"]
    end

    subgraph Providers["AI Providers"]
        OL["Ollama (Local)"]
        OAI["OpenAI"]
        ANT["Anthropic"]
        GGL["Google"]
    end

    subgraph Output["Response"]
        RES["Filtered Response<br/>+ Governance Receipt"]
    end

    REQ --> RL2 --> PII2 --> POL2
    POL2 --> MR
    MR --> OL
    MR --> OAI
    MR --> ANT
    MR --> GGL
    POL2 --> SIGN --> AUDIT
    AUDIT --> SIEM2
    MR --> RES

    classDef in fill:#4299e1,stroke:#2b6cb0,color:#fff
    classDef gw2 fill:#38b2ac,stroke:#285e61,color:#fff
    classDef prov fill:#d69e2e,stroke:#975a16,color:#fff
    classDef out fill:#38a169,stroke:#276749,color:#fff
    class REQ in
    class RL2,PII2,POL2,MR,SIGN,AUDIT,SIEM2 gw2
    class OL,OAI,ANT,GGL prov
    class RES out
```

### Domain Router Architecture

```mermaid
graph TB
    subgraph Router["API v1 Router"]
        AUTH2["auth.domain"]
        COUNCIL2["council.domain"]
        DATA["data.domain"]
        DEMO["demo.domain"]
        ENT["enterprise.domain"]
        GOV2["governance.domain"]
        INTEL["intelligence.domain"]
        LEGAL2["legal.domain"]
        PLAT3["platform.domain"]
        SEC["security.domain"]
        SIM["simulation.domain"]
        SOV2["sovereign.domain"]
        VERT["verticals.domain"]
        WORK["workflows.domain"]
    end

    AUTH2 --> A1["auth, sso"]
    COUNCIL2 --> C1["council, deliberations, decisions"]
    SEC --> S1["mfa, hsm, kms, zkp, post-quantum,<br/>credential-evidence, sentry,<br/>adversarial-redteam, redteam,<br/>security-services"]
    SOV2 --> SV1["sovereign, sovereign-arch,<br/>sovereign-security, sovereign-organs"]
    GOV2 --> G1["compliance, compliance-monitor,<br/>compliance-platinum, constitutional-court,<br/>cross-jurisdiction, regulatory-sandbox"]
    ENT --> E1["enterprise, apotheosis, dissent,<br/>cascade, echo, gnosis, collapse"]
    VERT --> V1["verticals, sports, defense,<br/>vertical-agents, vertical-config"]
    PLAT3 --> P1["health, metrics, settings,<br/>notifications, uploads, scheduler"]
```

---

## Next Steps

For detailed implementation guides, see:
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Step-by-step deployment instructions
- [docker-compose.smb.yml](../deploy/docker-compose.smb.yml) - SMB Docker bundle
- [terraform/aws/main.tf](../infrastructure/terraform/aws/main.tf) - AWS Terraform
- [helm/datacendia/values.yaml](../helm/datacendia/values.yaml) - Kubernetes Helm chart

---

*Updated April 15, 2026 — Audit-verified against codebase*
