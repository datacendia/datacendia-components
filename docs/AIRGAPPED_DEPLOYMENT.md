# 🔒 Datacendia - Air-Gapped (Offline) Deployment Guide

> For sovereign deployments on isolated networks with no internet access.
> **Tier:** Enterprise ($500K–$1.5M/yr) and Strategic ($1.5M+/yr)

---

## Overview

This guide covers deploying Datacendia on air-gapped infrastructure where:
- ❌ No internet access
- ❌ No cloud dependencies  
- ✅ All software runs on-premise
- ✅ Full data sovereignty

---

## Sovereign Online Toggle (Required)

Before deploying air-gapped, configure the **sovereign online toggle** in your `.env`:

```bash
# REQUIRED for air-gapped deployment
DATACENDIA_ONLINE_MODE=false

# Choose fallback behaviour when cloud AI is invoked:
#   error (default) — Hard HTTP 503. Auditor-safe. Forces explicit model mapping.
#   local           — Silent fallback to Ollama/NIM/Triton. Logs warning.
DATACENDIA_CLOUD_AI_FALLBACK=error

# These are automatically set to false when ONLINE_MODE=false:
# DATACENDIA_CLOUD_AI=false
# DATACENDIA_EXTERNAL_DATA=false
# DATACENDIA_EXTERNAL_NOTIFY=false
```

### Startup Validation

When `DATACENDIA_ONLINE_MODE=false`, the system validates at startup:

1. **At least one local LLM provider is configured** (Ollama, NIM, or Triton)
2. **INFERENCE_PROVIDER is set to a local provider** (not `openai` or `anthropic`)
3. **Local provider is reachable** (health check)
4. **SMTP is local or disabled** (not pointing to external relay)

If validation fails in production, the system **refuses to start** with a clear error listing what needs to be fixed. The passing validation log is an **audit artifact**.

### Verify Sovereign Mode

After deployment, verify sovereign mode is active:

```bash
curl http://localhost:3001/api/v1/health/sovereign
```

Expected response:
```json
{
  "success": true,
  "data": {
    "onlineMode": false,
    "cloudAI": false,
    "cloudAIFallback": "error",
    "externalData": false,
    "externalNotify": false,
    "validationErrors": [],
    "validatedAt": "2026-03-22T..."
  }
}
```

---

## 🎯 What You'll Deliver to the Client

A **deployment package** containing:

```
datacendia-deployment/
├── images/                    # Pre-built Docker images
│   ├── datacendia-frontend.tar
│   ├── datacendia-backend.tar
│   ├── postgres-16.tar
│   ├── redis-7.tar
│   ├── neo4j-5.tar
│   └── ollama-with-models.tar
├── config/                    # Configuration templates
│   ├── .env.template
│   ├── nginx.conf
│   └── docker-compose.yml
├── scripts/                   # Installation scripts
│   ├── install.sh
│   ├── load-images.sh
│   └── setup-ssl.sh
├── models/                    # Pre-downloaded LLM models
│   └── llama3.1-8b/
└── docs/
    └── INSTALLATION.md
```

---

## 📦 Step 1: Build Deployment Package (On Your Machine)

### 1.1 Build Docker Images

```bash
# Build frontend
docker build -t datacendia/frontend:1.0.0 .

# Build backend
docker build -t datacendia/backend:1.0.0 ./backend

# Tag standard images for offline use
docker pull postgres:16-alpine
docker tag postgres:16-alpine datacendia/postgres:16

docker pull redis:7-alpine
docker tag redis:7-alpine datacendia/redis:7

docker pull neo4j:5-community
docker tag neo4j:5-community datacendia/neo4j:5

docker pull ollama/ollama:latest
docker tag ollama/ollama:latest datacendia/ollama:latest
```

### 1.2 Pre-load LLM Models into Ollama

```bash
# Start Ollama locally
docker run -d -v ollama_models:/root/.ollama -p 11434:11434 ollama/ollama

# Download models you want to include
docker exec -it $(docker ps -q -f ancestor=ollama/ollama) ollama pull llama3.1:8b
docker exec -it $(docker ps -q -f ancestor=ollama/ollama) ollama pull codellama:13b

# Stop Ollama
docker stop $(docker ps -q -f ancestor=ollama/ollama)
```

### 1.3 Export Images to Files

```bash
mkdir -p deployment-package/images

# Export all images
docker save datacendia/frontend:1.0.0 | gzip > deployment-package/images/frontend.tar.gz
docker save datacendia/backend:1.0.0 | gzip > deployment-package/images/backend.tar.gz
docker save datacendia/postgres:16 | gzip > deployment-package/images/postgres.tar.gz
docker save datacendia/redis:7 | gzip > deployment-package/images/redis.tar.gz
docker save datacendia/neo4j:5 | gzip > deployment-package/images/neo4j.tar.gz
docker save datacendia/ollama:latest | gzip > deployment-package/images/ollama.tar.gz

# Export Ollama models volume
docker run --rm -v ollama_models:/data -v $(pwd)/deployment-package:/backup alpine tar czf /backup/ollama-models.tar.gz -C /data .
```

### 1.4 Create Configuration Files

```bash
# Copy config templates
mkdir -p deployment-package/config
cp docker-compose.production.yml deployment-package/config/docker-compose.yml
cp .env.example deployment-package/config/.env.template
cp docker/nginx.conf deployment-package/config/
```

---

## 💾 Step 2: Transfer to Client Environment

### Option A: Physical Media (Most Secure)
```bash
# Create deployment archive
cd deployment-package
tar czf datacendia-v1.0.0-airgapped.tar.gz *

# Copy to USB/external drive
# Total size: ~15-25 GB depending on LLM models included
```

### Option B: Secure File Transfer
```bash
# If secure network path exists
scp -r deployment-package/ user@client-server:/opt/datacendia/
```

---

## 🚀 Step 3: Install at Client Site

### 3.1 Load Docker Images

Create this script at `deployment-package/scripts/load-images.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 Loading Datacendia Docker images..."

# Load all images
for image in ../images/*.tar.gz; do
    echo "Loading $image..."
    gunzip -c "$image" | docker load
done

# Restore Ollama models
echo "Restoring LLM models..."
docker volume create ollama_models
docker run --rm -v ollama_models:/data -v $(pwd)/..:/backup alpine tar xzf /backup/ollama-models.tar.gz -C /data

echo "✅ All images loaded successfully!"
docker images | grep datacendia
```

### 3.2 Configure Environment

```bash
cd /opt/datacendia/config

# Copy and edit environment
cp .env.template .env
nano .env
```

**Required environment variables:**
```env
# === DATABASE ===
DB_PASSWORD=<generate-strong-password>
NEO4J_PASSWORD=<generate-strong-password>

# === SECURITY ===
JWT_SECRET=<generate-64-char-secret>
JWT_REFRESH_SECRET=<generate-64-char-secret>

# === SSL (if using) ===
SSL_CERT_PATH=/etc/ssl/datacendia/cert.pem
SSL_KEY_PATH=/etc/ssl/datacendia/key.pem

# === IDENTITY PROVIDER (choose one) ===
# Active Directory
LDAP_URL=ldap://domain-controller.local:389
LDAP_BASE_DN=dc=company,dc=local
LDAP_BIND_DN=cn=service-account,ou=service,dc=company,dc=local
LDAP_BIND_PASSWORD=<ldap-password>

# OR SAML
SAML_ENTRY_POINT=https://idp.company.local/sso/saml
SAML_ISSUER=datacendia
SAML_CERT_PATH=/etc/ssl/saml/idp-cert.pem

# OR OIDC
OIDC_ISSUER=https://keycloak.company.local/realms/datacendia
OIDC_CLIENT_ID=datacendia
OIDC_CLIENT_SECRET=<client-secret>
```

### 3.3 Start Services

```bash
cd /opt/datacendia/config

# Start all services
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f
```

---

## 🏢 Enterprise Identity Integration

### Active Directory / LDAP

```yaml
# In docker-compose.yml, add to backend environment:
environment:
  - AUTH_METHOD=ldap
  - LDAP_URL=ldap://dc.company.local:389
  - LDAP_BASE_DN=dc=company,dc=local
  - LDAP_BIND_DN=cn=datacendia-svc,ou=services,dc=company,dc=local
  - LDAP_USER_FILTER=(sAMAccountName={{username}})
  - LDAP_GROUP_FILTER=(member={{dn}})
```

### SAML 2.0 (ADFS, Ping, etc.)

```yaml
environment:
  - AUTH_METHOD=saml
  - SAML_ENTRY_POINT=https://adfs.company.local/adfs/ls
  - SAML_ISSUER=urn:datacendia:production
  - SAML_CALLBACK_URL=https://datacendia.company.local/api/auth/saml/callback
  - SAML_CERT=/run/secrets/saml_cert
```

### OIDC (Keycloak, Dex)

```yaml
environment:
  - AUTH_METHOD=oidc
  - OIDC_ISSUER=https://keycloak.company.local/realms/datacendia
  - OIDC_CLIENT_ID=datacendia-client
  - OIDC_REDIRECT_URI=https://datacendia.company.local/api/auth/oidc/callback
```

---

## 🛡️ Security Hardening

### Firewall Rules

Only these ports need to be accessible:

| Port | Service | Access |
|------|---------|--------|
| 443 | HTTPS Frontend | Users |
| 80 | HTTP (redirect) | Users |
| 3001 | API (internal) | Frontend only |
| 5432 | PostgreSQL | Internal only |
| 7687 | Neo4j Bolt | Internal only |

```bash
# Example firewall (iptables)
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -j DROP
```

### SSL/TLS Setup

```bash
# Using internal CA
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/datacendia/key.pem \
  -out /etc/ssl/datacendia/cert.pem \
  -subj "/CN=datacendia.company.local"

# Or import from enterprise PKI
cp /path/to/enterprise/cert.pem /etc/ssl/datacendia/
cp /path/to/enterprise/key.pem /etc/ssl/datacendia/
```

---

## 📊 Hardware Requirements

| Tier | Users | CPU | RAM | Storage | GPU |
|------|-------|-----|-----|---------|-----|
| Small | 1-50 | 8 cores | 32GB | 500GB SSD | Optional |
| Medium | 50-200 | 16 cores | 64GB | 1TB NVMe | RTX 3090 |
| Large | 200-1000 | 32 cores | 128GB | 2TB NVMe | A100 40GB |

### Recommended Server Specs

**Single Node (Small/Medium):**
- Dell PowerEdge R750 or HP ProLiant DL380
- 2x Intel Xeon Gold 6330 (or AMD EPYC)
- 128GB ECC DDR4
- 2TB NVMe RAID 1
- NVIDIA A30 GPU (for local LLM)

**High Availability:**
- 3 nodes minimum
- Load balancer (HAProxy/Nginx)
- Shared storage (NFS/Ceph)
- PostgreSQL with streaming replication

---

## 🔄 Updates (Air-Gapped)

1. Build new images on internet-connected machine
2. Export to tar files
3. Transfer via secure media
4. Load new images
5. Restart services

```bash
# On client site
docker compose down
./load-images.sh  # Load new images
docker compose up -d
docker compose exec backend npx prisma migrate deploy
```

---

## ✅ Deployment Checklist

- [ ] Docker images loaded
- [ ] Environment configured
- [ ] SSL certificates installed
- [ ] Identity provider integrated
- [ ] Firewall rules configured
- [ ] Services started and healthy
- [ ] Admin user created
- [ ] Backup schedule configured
- [ ] Monitoring alerts setup

---

## 📞 On-Site Support

For deployment assistance, our team provides:
- On-site installation (1-2 days)
- Identity provider integration
- Security hardening review
- Admin training
- Ongoing support contract

Contact: enterprise@datacendia.com
