# SOP-021: Sovereign Deployment (Air-Gapped)

**Category:** Enterprise
**Priority:** Critical
**Owner:** DevOps / Security Lead
**Last Verified:** 2026-02-22 (against `docs/AIRGAPPED_DEPLOYMENT.md`, `infrastructure/docker-compose.sovereign.yml`)

---

## 1. Purpose

Define procedures for deploying the Datacendia platform in sovereign (air-gapped) environments where no external network connectivity is permitted, as required by government, defense, and critical infrastructure clients.

---

## 2. Sovereign Deployment Requirements

| Requirement | Description |
|-------------|-------------|
| **No external network** | Zero outbound connections to internet |
| **Data residency** | All data remains within client jurisdiction |
| **Local AI models** | Ollama models pre-loaded locally |
| **Self-contained** | All dependencies bundled |
| **Encryption** | E2E encryption at rest and in transit |
| **Audit trail** | Complete logging with no external exfiltration |

---

## 3. Pre-Deployment Preparation

### 3.1 Bundle Creation (Online Machine)
```bash
# 1. Pull all Docker images
docker compose -f infrastructure/docker-compose.sovereign.yml pull

# 2. Save images to tarball
docker save $(docker compose -f infrastructure/docker-compose.sovereign.yml config --images) \
  | gzip > datacendia-sovereign-images.tar.gz

# 3. Pull Ollama models
ollama pull qwen3:32b
ollama pull llama3.2:3b
ollama pull qwen3-embedding:4b

# 4. Export Ollama models
# Copy from Ollama model directory (OS-dependent)

# 5. Bundle application code
tar czf datacendia-app.tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  datacendia-components/

# 6. Bundle npm dependencies
npm ci --production
tar czf datacendia-node-modules.tar.gz node_modules/
```

### 3.2 Transfer to Air-Gapped Environment
- Use approved removable media (encrypted USB, optical disc)
- Follow client's data transfer security procedures
- Verify checksums after transfer:
  ```bash
  sha256sum -c datacendia-checksums.txt
  ```

---

## 4. Air-Gapped Installation

### 4.1 Load Docker Images
```bash
docker load < datacendia-sovereign-images.tar.gz
```

### 4.2 Configure Environment
```bash
# Copy sovereign environment template
cp .env.sovereign backend/.env

# Key settings:
# REQUIRE_AUTH=true
# OLLAMA_BASE_URL=http://127.0.0.1:11434
# All external service URLs → localhost or internal
# No external API keys needed
```

### 4.3 Deploy Sovereign Stack
```bash
docker compose -f infrastructure/docker-compose.sovereign.yml up -d
```

### 4.4 Initialize Database
```bash
cd backend
npx prisma migrate deploy
npx prisma db seed
```

### 4.5 Load Ollama Models
```bash
# Copy model files to Ollama directory
# Start Ollama
ollama serve

# Verify models
ollama list
```

---

## 5. CendiaSovereign™ Features

| Feature | Description |
|---------|-------------|
| Data Residency Control | All data within client jurisdiction |
| Multi-Region Support | Configure data regions per tenant |
| E2E Encryption | AES-256 at rest, TLS 1.3 in transit |
| Data Classification | Automatic classification and tagging |
| Data Flow Visualization | Visual map of data movement |
| Key Management | Customer-owned encryption keys |

---

## 6. 11 Sovereign Architectural Patterns

| # | Pattern | Service | Description |
|---|---------|---------|-------------|
| 1 | CendiaBlackBox™ | `backend/src/services/sovereign/` | Sealed decision records |
| 2 | CendiaMirage™ | `backend/src/services/sovereign/` | Data obfuscation |
| 3 | CendiaGlass™ | `backend/src/services/sovereign/` | Transparent audit |
| 4 | CendiaKey™ | `backend/src/services/sovereign/` | Key management |
| 5 | CendiaLegacy™ | `backend/src/services/sovereign/` | Legacy system bridge |
| 6 | CendiaNotary™ | `backend/src/services/sovereign/` | Cryptographic signing |
| 7 | CendiaSeal™ | `backend/src/services/sovereign/` | Tamper-evident records |
| 8 | CendiaVault™ | `backend/src/services/sovereign/` | Secure evidence storage |
| 9 | CendiaWarden™ | `backend/src/services/sovereign/` | Access control enforcement |
| 10 | CendiaAnchor™ | `backend/src/services/sovereign/` | Blockchain anchoring |
| 11 | CendiaGhost™ | `backend/src/services/sovereign/` | Privacy-preserving compute |

---

## 7. Ongoing Maintenance (Air-Gapped)

### 7.1 Updates
1. Prepare update bundle on online machine
2. Test on staging environment
3. Transfer via approved media
4. Apply during maintenance window
5. Verify all services operational

### 7.2 Log Collection
- Logs remain on-premise
- Export via encrypted removable media if needed
- CendiaLedger™ maintains immutable audit trail locally

### 7.3 Model Updates
```bash
# On online machine: pull new model
ollama pull <model>

# Export and transfer to air-gapped environment
# Load into local Ollama
```

---

## 8. Verification

Post-deployment checklist:
- [ ] All Docker containers running
- [ ] Backend health check passes
- [ ] Database migrations applied
- [ ] Ollama models loaded and responding
- [ ] No outbound network connections (verify with `netstat`)
- [ ] Authentication working (JWT)
- [ ] DCII dashboard accessible
- [ ] Regulator's Receipt generation works
- [ ] Audit trail logging active

---

## 9. Verified Against

- `docs/AIRGAPPED_DEPLOYMENT.md`: Air-gapped deployment procedures
- `infrastructure/docker-compose.sovereign.yml`: Sovereign Docker stack
- `backend/src/services/sovereign/`: 11 sovereign service files
- `COMPLETE_SERVICE_MATRIX.md`: CendiaSovereign™ specification
- `docs/MARKETING_VS_PLATFORM_AUDIT.md`: Confirmed 11 sovereign patterns (corrected from overclaim of 21)
- `src/data/premiumFeatures.ts`: "11 Sovereign Architectural Patterns"

---

*Datacendia, LLC — Proprietary and Confidential*
