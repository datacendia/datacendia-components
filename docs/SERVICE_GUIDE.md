# Datacendia Platform - Service Usage Guide

> **Platform Status**: Running at http://localhost:5173  
> **Backend API**: http://localhost:3001/api/v1  
> **Login**: stuart@datacendia.com / DatacendiaOwner2024!

---

## 🧠 THE CORE SUITE (Decision Tools)

### 1. The Council™
**Route**: `/cortex/council`  
**API**: `/api/v1/council/*`

Multi-agent AI deliberation system with 9 specialized agents (CFO, CTO, CISO, Legal, etc.)

**How to Use**:
1. Navigate to The Council from the sidebar
2. Enter a decision question (e.g., "Should we acquire CompanyX for $50M?")
3. Select which agents should participate
4. Click "Start Deliberation"
5. Watch agents analyze from their perspectives
6. Review consensus, dissents, and recommendations
7. Export decision packet for audit trail

**Key Features**:
- Real-time agent deliberation
- Weighted voting by expertise
- Dissent tracking & escalation
- Confidence scoring
- Cryptographically signed decision packets

---

### 2. CendiaChronos™ (Enterprise Time Machine)
**Route**: `/cortex/chronos`  
**API**: `/api/v1/chronos/*`

Temporal analysis and decision replay system.

**How to Use**:
1. Navigate to Chronos from sidebar
2. **Timeline View**: See all historical decisions
3. **Replay**: Click any past decision to see what was known at that time
4. **What-If**: Modify parameters and re-run analysis
5. **Pivotal Moments**: AI identifies key inflection points
6. **Future Scenarios**: Monte Carlo simulations for forecasting

**Key Features**:
- Time-travel through decision history
- Counterfactual analysis
- Pivotal moment detection
- Crisis simulation
- Department filtering

---

### 3. Ghost Board™
**Route**: `/cortex/ghost-board`  
**API**: `/api/v1/ghost-board/*`

Rehearse board meetings with AI personas before the real thing.

**How to Use**:
1. Navigate to Ghost Board
2. Create a new session with meeting agenda
3. Configure board member personas (skeptical investor, cautious CFO, etc.)
4. Present your proposal
5. AI personas ask tough questions
6. Refine your presentation based on feedback

---

### 4. CendiaPreMortem
**Route**: `/cortex/pre-mortem`  
**API**: `/api/v1/pre-mortem/*`

Assume failure and work backward to find risks.

**How to Use**:
1. Navigate to Pre-Mortem
2. Enter the decision or project
3. Click "Assume Failure"
4. AI generates failure scenarios ranked by probability × impact
5. Review mitigation strategies
6. Export risk register

---

### 5. Decision Debt™
**Route**: `/cortex/decision-debt`  
**API**: `/api/v1/decision-debt/*`

Track stuck decisions and their organizational cost.

**How to Use**:
1. Navigate to Decision Debt dashboard
2. View pending decisions by age and cost
3. See who's blocking what
4. Set escalation triggers
5. Calculate opportunity cost of delays

---

## 🛡️ THE TRUST LAYER (Compliance & Proof)

### 6. CendiaOversight™
**Route**: `/cortex/oversight`  
**API**: `/api/v1/oversight/*`

Unified governance, audit, and regulatory compliance.

**How to Use**:
1. Navigate to Oversight
2. **Dashboard**: Real-time compliance status
3. **Audit Log**: All system events with filters
4. **Policy Engine**: Configure approval workflows
5. **Regulatory Absorb**: Upload new regulations, AI maps to controls

---

### 7. Decision DNA™
**Route**: `/cortex/decision-dna`  
**API**: `/api/v1/decision-dna/*`

Immutable decision lineage with cryptographic proof.

**How to Use**:
1. Navigate to Decision DNA
2. Search any past decision by ID or keyword
3. View complete lineage: inputs → deliberation → outcome
4. Verify integrity with Merkle proof
5. Export evidence package for auditors

**API Endpoints**:
```bash
# Get decision packet
GET /api/v1/council-packets/:id

# Verify signature
POST /api/v1/council-packets/:id/verify

# Export for auditor
GET /api/v1/council-packets/:id/export
```

---

### 8. CendiaCrucible™
**Route**: `/cortex/crucible`  
**API**: `/api/v1/crucible/*`

Adversarial stress testing and red-teaming.

**How to Use**:
1. Navigate to Crucible
2. Select a decision or policy to test
3. Choose attack vectors (bias, edge cases, adversarial inputs)
4. Run stress test
5. Review vulnerabilities found
6. Apply patches or ban problematic patterns

---

## 🌐 ADDITIONAL SERVICES

### 9. CendiaOmniTranslate™
**Route**: `/cortex/omnitranslate`  
**API**: `/api/v1/omnitranslate/*`

100+ language enterprise translation.

**How to Use**:
1. Navigate to OmniTranslate
2. Enter text or upload document
3. Select source/target languages
4. Click Translate
5. Review and edit with glossary support

**API Endpoints**:
```bash
# Translate text
POST /api/v1/omnitranslate/translate
{
  "text": "Hello world",
  "sourceLang": "en",
  "targetLang": "es"
}

# Batch translate
POST /api/v1/omnitranslate/batch

# Manage glossary
GET/POST /api/v1/omnitranslate/glossary
```

---

### 10. CendiaDissent™
**Route**: `/cortex/enterprise/dissent`  
**API**: `/api/v1/dissent/*`

Protected whistleblower and formal dissent filing.

**How to Use**:
1. Navigate to Dissent
2. Click "File New Dissent"
3. Select the decision you're dissenting from
4. Provide reasoning and evidence
5. Submit (with retaliation protection)
6. Track outcome verification

---

### 11. CendiaApotheosis™
**Route**: `/cortex/enterprise/apotheosis`  
**API**: `/api/v1/apotheosis/*`

Nightly red-teaming and auto-improvement.

**How to Use**:
1. Navigate to Apotheosis
2. View nightly red-team results
3. Review auto-patched issues
4. See banned patterns
5. Monitor agent upskilling progress

---

## 🏭 VERTICAL PACKS

### 12. CendiaGenomics™ (Healthcare)
**Route**: `/cortex/verticals/genomics`

Healthcare-specific decision support with HIPAA compliance.

### 13. CendiaDefense™ (Government)
**Route**: `/cortex/verticals/defense`

Government/defense decision support with FedRAMP controls.

### 14. CendiaFinancial™ (Banking)
**Route**: `/cortex/verticals/financial`

Financial services with SOX and PCI DSS compliance.

---

## 🔐 SECURITY SERVICES

### Key Management Service (KMS)
**API**: `/api/v1/kms/*`

```bash
# Check status
GET /api/v1/kms/status

# Sign data
POST /api/v1/kms/sign
{ "data": "base64-encoded-data", "keyId": "default" }

# Verify signature
POST /api/v1/kms/verify
{ "data": "...", "signature": "...", "keyId": "default" }

# Create new key
POST /api/v1/kms/keys
{ "keyId": "my-key", "algorithm": "RSA-2048" }
```

### Immutable Audit Ledger
**API**: `/api/v1/security/audit-ledger/*`

```bash
# Get entries with proof
GET /api/v1/security/audit-ledger/entries?organizationId=org-123

# Verify integrity
GET /api/v1/security/audit-ledger/verify

# Export with proof
POST /api/v1/security/audit-ledger/export
```

### SIEM Integration
**API**: `/api/v1/security/siem/*`

```bash
# Configure SIEM endpoint
POST /api/v1/security/siem/configure
{
  "provider": "splunk",
  "endpoint": "https://splunk.example.com:8088",
  "token": "your-hec-token"
}

# Test connection
POST /api/v1/security/siem/test
```

### Compliance Export
**API**: `/api/v1/security/compliance/*`

```bash
# Generate compliance report
POST /api/v1/security/compliance/export
{
  "framework": "soc2",  // soc2, hipaa, gdpr, iso27001, nist, pci
  "organizationId": "org-123",
  "startDate": "2025-01-01",
  "endDate": "2025-12-31"
}
```

### SBOM Generation
**API**: `/api/v1/security/sbom/*`

```bash
# Generate SBOM
POST /api/v1/security/sbom/generate
{
  "format": "cyclonedx",  // cyclonedx or spdx
  "projectPath": "/path/to/project"
}
```

---

## 🔌 ADAPTERS (Data Integration)

### Universal Adapters
**API**: `/api/v1/adapters/*`

```bash
# List configured adapters
GET /api/v1/adapters

# Create file watcher adapter
POST /api/v1/adapters/file-watcher
{
  "name": "SAP Export Watcher",
  "watchPath": "/data/sap-exports",
  "filePattern": "*.csv"
}

# Create webhook adapter
POST /api/v1/adapters/webhook
{
  "name": "Salesforce Events",
  "secret": "webhook-secret"
}

# Create database adapter
POST /api/v1/adapters/database
{
  "name": "ERP Database",
  "connectionString": "postgresql://...",
  "pollIntervalMs": 60000
}
```

---

## 🔧 ADMIN FUNCTIONS

### Vertical Configuration
**Route**: `/cortex/admin/verticals`

Configure which vertical packs are enabled for your organization.

### User Management
**Route**: `/cortex/admin/users`

Manage users, roles, and permissions.

### System Health
**Route**: `/cortex/admin/health`

Monitor system status, service health, and performance metrics.

---

## 📊 QUICK START WORKFLOW

1. **Login** at http://localhost:5173 with `stuart@datacendia.com`
2. **Navigate** to The Council
3. **Ask a question**: "Should we expand into the European market?"
4. **Watch** the 9 AI agents deliberate
5. **Review** the consensus and any dissents
6. **Export** the decision packet
7. **Verify** the cryptographic signature in Decision DNA

---

## 🛠️ ENVIRONMENT VARIABLES

```env
# Database
DATABASE_URL=postgresql://...

# AI/LLM
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:32b

# KMS (optional - defaults to local)
KMS_PROVIDER=local  # aws-kms | hashicorp-vault | azure-keyvault | local

# SIEM (optional)
SIEM_PROVIDER=none  # splunk | sentinel | qradar | elastic

# Translation
OMNITRANSLATE_MODEL=qwen2.5:32b
```

---

*Last updated: January 3, 2026*
