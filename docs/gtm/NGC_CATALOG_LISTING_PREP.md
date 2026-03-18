# NVIDIA NGC Catalog — Listing Preparation

**Purpose:** Package Datacendia/CendiaGateway for submission to the NVIDIA NGC (GPU Cloud) catalog, enabling enterprises to discover and deploy directly from NGC.

**Last Updated:** March 2026

---

## What is NGC?

NVIDIA NGC is a hub of GPU-optimized software for AI, HPC, and data science. Enterprises with NVIDIA infrastructure (DGX, HGX, cloud GPU instances) discover and deploy software from NGC. Being listed there means:

- **Passive inbound** — enterprises searching "AI governance" or "compliance" find Datacendia
- **NVIDIA endorsement** — NGC listings are reviewed by NVIDIA, acting as a quality signal
- **One-click deploy** — reduces friction from discovery to running instance
- **Enterprise procurement** — NGC integrations with enterprise purchasing workflows

---

## Listing Strategy

### What to List

| Listing | Description | Target Buyer |
|---|---|---|
| **CendiaGateway** | AI governance reverse proxy — audits every AI interaction, generates compliance evidence | CISOs, CROs, Compliance Officers at enterprises using NVIDIA AI infrastructure |
| **Datacendia Council Engine** | Multi-agent deliberation with GPU-accelerated inference via Triton | CTOs, CDOs evaluating AI decision-making infrastructure |

**Recommended first listing:** CendiaGateway — it's the simplest to deploy (reverse proxy, no integration required) and has the clearest value proposition for NGC browsers.

---

## NGC Container Requirements

NGC listings require a container image that meets NVIDIA's standards. Here's what's needed:

### Container Specifications

| Requirement | Datacendia Implementation |
|---|---|
| **Base image** | `nvcr.io/nvidia/pytorch:24.03-py3` or `nvcr.io/nvidia/tritonserver:24.03-py3` (for Triton integration) |
| **GPU support** | Optional — CendiaGateway runs on CPU; Council Engine benefits from GPU |
| **Health check** | HTTP endpoint at `/health` returning 200 |
| **Configuration** | Environment variables for all settings (no hardcoded values) |
| **Licensing** | Clear license declaration (Apache 2.0 for community, proprietary for enterprise features) |
| **Documentation** | README with quickstart, configuration reference, architecture overview |
| **Security** | No embedded credentials, no root user, minimal attack surface |
| **Size** | Minimize image layers, multi-stage build, < 5GB recommended |

---

## NGC Dockerfile — CendiaGateway

```dockerfile
# =============================================================================
# DATACENDIA CENDIAGATEWAY — NGC CATALOG IMAGE
# =============================================================================
# AI Governance Reverse Proxy for NVIDIA AI Infrastructure
# Audits every AI interaction, generates compliance evidence
#
# NGC Catalog: https://catalog.ngc.nvidia.com/
# NVIDIA Inception Member
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Build Backend
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./
RUN npm ci --omit=dev

# Copy backend source
COPY backend/ .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npx tsc -p tsconfig.docker.json || true

# -----------------------------------------------------------------------------
# Stage 2: Production Image
# -----------------------------------------------------------------------------
FROM node:20-alpine AS production

# Labels for NGC catalog
LABEL com.nvidia.volumes.needed="nvidia_driver"
LABEL maintainer="Datacendia, LLC <stuart.rainey@datacendia.com>"
LABEL com.nvidia.ngc.description="CendiaGateway - AI Governance Infrastructure for NVIDIA AI Stack"
LABEL com.nvidia.ngc.version="1.0.0"
LABEL com.nvidia.ngc.min-driver-version="535.129.03"

WORKDIR /app

# Install production dependencies only
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./

# Security: Create non-root user
RUN addgroup -g 1001 datacendia && \
    adduser -u 1001 -G datacendia -s /bin/sh -D datacendia && \
    chown -R datacendia:datacendia /app

USER datacendia

# Environment configuration (all configurable, no hardcoded values)
ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0
ENV LOG_LEVEL=info

# CendiaGateway-specific
ENV GATEWAY_MODE=proxy
ENV EVIDENCE_SIGNING=sha256
ENV PII_DETECTION=enabled
ENV SOVEREIGN_MODE=true

# NVIDIA integration (optional — set to enable GPU features)
# ENV TRITON_URL=localhost:8001
# ENV NEMO_GUARDRAILS_ENABLED=true
# ENV RAPIDS_ENABLED=true

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

CMD ["node", "dist/index.js"]
```

---

## NGC Metadata File

Create this as `ngc-metadata.yaml` for the NGC submission:

```yaml
# NGC Catalog Metadata — CendiaGateway
schema: v2

name: cendiagateway
display_name: "CendiaGateway — AI Governance Infrastructure"
description: |
  CendiaGateway is an AI governance reverse proxy that audits every AI interaction,
  generates compliance evidence, and produces regulatory-ready evidence packages.
  
  Built by Datacendia (NVIDIA Inception Member), CendiaGateway integrates natively 
  with the NVIDIA AI stack:
  - NVIDIA Triton Inference Server (inference auditing)
  - NVIDIA NeMo Guardrails (9 integrated safety rails)
  - NVIDIA RAPIDS/cuGraph (GPU-accelerated bias detection)
  - NVIDIA Confidential Computing (hardware-secured governance evidence)
  
  Regulatory coverage: EU AI Act, DORA, Basel III, HIPAA, NIST AI RMF, 
  Peru DS N° 115-2025-PCM, and 10+ additional jurisdictions.

version: "1.0.0"
publisher: "Datacendia, LLC"
website: "https://datacendia.com"

categories:
  - "AI Governance"
  - "Compliance"
  - "Enterprise AI"
  - "Security"

tags:
  - "ai-governance"
  - "compliance"
  - "audit-trail"
  - "eu-ai-act"
  - "responsible-ai"
  - "mlops"
  - "inference-monitoring"
  - "triton"
  - "nemo-guardrails"

platforms:
  - "x86_64"
  - "arm64"

gpu_required: false
gpu_recommended: true
min_gpu_memory: "8GB"
recommended_gpu: "NVIDIA A100, H100, L40S, or RTX 4090"

dependencies:
  - name: "PostgreSQL"
    version: ">=14"
    required: true
  - name: "Redis"
    version: ">=7"
    required: false
    description: "Optional — enables caching and real-time features"
  - name: "NVIDIA Triton Inference Server"
    version: ">=24.03"
    required: false
    description: "Optional — enables GPU-accelerated model serving governance"

license: "Apache-2.0 (Community) / Proprietary (Enterprise)"

quickstart: |
  # Pull from NGC
  docker pull nvcr.io/datacendia/cendiagateway:1.0.0
  
  # Run with PostgreSQL connection
  docker run -d \
    -p 3001:3001 \
    -e DATABASE_URL="postgresql://user:pass@host:5432/datacendia" \
    -e JWT_SECRET="your-secret-here" \
    nvcr.io/datacendia/cendiagateway:1.0.0
  
  # With NVIDIA Triton integration
  docker run -d \
    -p 3001:3001 \
    -e DATABASE_URL="postgresql://user:pass@host:5432/datacendia" \
    -e TRITON_URL="localhost:8001" \
    -e NEMO_GUARDRAILS_ENABLED=true \
    nvcr.io/datacendia/cendiagateway:1.0.0
  
  # Access
  # Health: http://localhost:3001/health
  # API: http://localhost:3001/api/v1
  # Evidence: http://localhost:3001/api/v1/governance/evidence

support:
  email: "stuart.rainey@datacendia.com"
  documentation: "https://datacendia.com/docs"
```

---

## NGC Submission Checklist

| Step | Status | Notes |
|---|---|---|
| **1. NGC Developer account** | [ ] | Register at https://ngc.nvidia.com if not already done |
| **2. Build NGC container** | [ ] | Use Dockerfile above, test locally |
| **3. Tag for NGC registry** | [ ] | `docker tag cendiagateway:1.0.0 nvcr.io/datacendia/cendiagateway:1.0.0` |
| **4. Push to NGC registry** | [ ] | `docker push nvcr.io/datacendia/cendiagateway:1.0.0` |
| **5. Submit metadata** | [ ] | Upload `ngc-metadata.yaml` via NGC portal |
| **6. Add documentation** | [ ] | README, quickstart, configuration reference |
| **7. Add screenshots** | [ ] | Dashboard screenshots, evidence package examples |
| **8. Request review** | [ ] | NGC team reviews listing (typically 1-3 weeks) |
| **9. Inception fast-track** | [ ] | Mention Inception membership in submission — may expedite review |

---

## NGC Listing Description (Marketing Copy)

### Short Description (150 chars)
> AI governance infrastructure for the NVIDIA AI stack. Audit every AI decision. Generate compliance evidence automatically.

### Long Description

> **CendiaGateway** by Datacendia (NVIDIA Inception Member) is the governance layer for enterprise AI infrastructure.
>
> **The Problem:** Enterprises deploying AI on NVIDIA infrastructure face regulatory obligations (EU AI Act, Basel III, HIPAA, NIST AI RMF) that require provable governance — audit trails, bias monitoring, human oversight records, and compliance evidence. No native mechanism exists to generate this evidence.
>
> **The Solution:** CendiaGateway deploys as a reverse proxy in front of any AI system. It intercepts every AI interaction, applies configurable governance policies, detects PII, and cryptographically signs each record. The result: immutable, third-party verifiable compliance evidence generated automatically.
>
> **NVIDIA Integration:**
> - **Triton Inference Server** — Governance for every model served via Triton
> - **NeMo Guardrails** — 9 safety rails integrated into governance pipeline
> - **RAPIDS/cuGraph** — GPU-accelerated bias detection across millions of decisions
> - **Confidential Computing** — Governance evidence generated inside hardware-secured enclaves
>
> **Key Features:**
> - Zero-integration deployment (reverse proxy — no code changes required)
> - Sovereign mode — all data stays within your infrastructure
> - 30 industry vertical configurations (banking, healthcare, defense, pharma, etc.)
> - DS N° 115-2025-PCM / ISO 42001 / EU AI Act / Basel III evidence packages
> - 205,000+ automated tests validating compliance logic
>
> **Deployment Options:** Cloud GPU instances, DGX, HGX, air-gapped on-premises

---

## Timeline to NGC Listing

| Week | Activity |
|---|---|
| **1** | Register NGC developer account, build and test NGC container locally |
| **2** | Push container to NGC registry, submit metadata and documentation |
| **3** | NGC review process begins (mention Inception membership for fast-track) |
| **4-6** | Address any review feedback, iterate on listing |
| **6-8** | Listing goes live on NGC catalog |

---

**Contact:** Stuart Rainey — stuart.rainey@datacendia.com  
**NVIDIA Inception Member**
