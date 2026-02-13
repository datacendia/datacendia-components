# UI Access Guide: Sovereign Services for TR Demo

## Quick Reference

| Service | UI Route | Navigation Path |
|---------|----------|-----------------|
| **Decision DNA™** | `/cortex/intelligence/decision-dna` | Trust Layer → Decision DNA™ |
| **Deterministic Replay** | `/cortex/council/replay-theater` | Core Suite → CendiaReplay |
| **Chronos (includes Replay)** | `/cortex/intelligence/chronos` | Core Suite → CendiaChronos™ |
| **Portable Instance** | `/cortex/admin/vertical-config` | Admin → Vertical Config (sovereign services) |
| **Data Diode** | `/cortex/admin/vertical-config` | Admin → Vertical Config (sovereign services) |
| **TPM Attestation** | `/cortex/admin/vertical-config` | Admin → Vertical Config (sovereign services) |
| **Sovereign Stack** | `/admin/sovereign-stack` | Admin → Sovereign Stack |

---

## STEP-BY-STEP ACCESS INSTRUCTIONS

### Prerequisites
1. **Start the backend**: `npm run dev` in `/backend` folder
2. **Start the frontend**: `npm run dev` in root folder
3. **Login**: Use `stuart@datacendia.com` / `DatacendiaOwner2024!`

---

## 1. Decision DNA™

### What It Does
Generates cryptographically verifiable audit bundles from deliberations with Merkle roots, hash chains, and signatures.

### How to Access

**Method 1: Direct URL**
```
http://localhost:5173/cortex/intelligence/decision-dna
```

**Method 2: Navigation**
1. Login to Datacendia
2. Click **Trust Layer** dropdown in header (🛡️ icon)
3. Select **Decision DNA™** (🧬 icon)

### What You'll See
- List of decisions with timeline events
- Each decision shows:
  - Status (draft, analyzing, deliberating, decided, implemented, closed)
  - Priority level
  - Timeline of events (created, context added, council session, decision made, etc.)
  - Audit hash for verification

### Demo Actions
1. Select a completed deliberation
2. View the timeline of events
3. Click "Export DNA Bundle" to generate the cryptographic audit package
4. Show the Merkle root and hash chain in the export

---

## 2. Deterministic Replay / CendiaReplay

### What It Does
Replays past deliberations like a movie, showing exactly how AI agents reached their conclusions.

### How to Access

**Method 1: Direct URL**
```
http://localhost:5173/cortex/council/replay-theater
```

**Method 2: Navigation**
1. Login to Datacendia
2. Click **Core Suite** dropdown in header (🧠 icon)
3. Select **CendiaReplay** (🎬 icon)

### What You'll See
- List of past deliberations available for replay
- Playback controls (play, pause, speed adjustment)
- Frame-by-frame view of agent statements
- Dissent indicators when agents disagreed
- Final consensus visualization

### Demo Actions
1. Select a completed deliberation
2. Click "Play" to watch the replay
3. Pause at key moments to show agent reasoning
4. Point out dissent markers if any agents disagreed
5. Show the final decision frame

---

## 3. CendiaChronos™ (Enterprise Time Machine)

### What It Does
Time-travel through your organization's decision history. Includes replay capabilities, diff views, and what-if simulations.

### How to Access

**Method 1: Direct URL**
```
http://localhost:5173/cortex/intelligence/chronos
```

**Method 2: Navigation**
1. Login to Datacendia
2. Click **Core Suite** dropdown in header (🧠 icon)
3. Select **CendiaChronos™** (⏱️ icon)

### What You'll See
- Timeline slider to navigate through history
- State snapshots at different points in time
- Metrics comparison (revenue, employees, satisfaction, etc.)
- Pivotal moment detection
- Branch timeline comparison for what-if scenarios

### Demo Actions
1. Drag the timeline slider to different dates
2. Show how metrics changed over time
3. Click on a pivotal moment to see the decision that caused it
4. Use "Export Audit Package" to generate a signed snapshot

---

## 4. Portable Instance, Data Diode, TPM Attestation

### What They Do
- **Portable Instance**: Creates bootable USB images for air-gapped deployment
- **Data Diode**: One-way data ingestion (data flows in, never out)
- **TPM Attestation**: Hardware-signed decisions using Trusted Platform Module

### How to Access

**These are infrastructure services, not user-facing features.** They're configured via:

**Method 1: Vertical Config Page**
```
http://localhost:5173/cortex/admin/vertical-config
```

**Navigation:**
1. Login to Datacendia
2. Click **Admin** dropdown in header (⚙️ icon)
3. Select **Vertical Config**
4. Scroll to "Sovereign Services" section

**What You'll See:**
- List of all sovereign services with toggle switches
- Services include:
  - 💾 Portable Instance - USB-bootable deployment
  - ➡️ Data Diode - Unidirectional secure data ingest
  - 🔐 TPM Attestation - Hardware-signed decisions
  - ⏰ Time-Lock - Cryptographic decision embargo
  - 🌐 Federated Mesh - Multi-org learning
  - 🐤 Canary Tripwire - Exfiltration detection

**Method 2: Sovereign Stack Page (Admin)**
```
http://localhost:5173/admin/sovereign-stack
```

**Navigation:**
1. Login to Datacendia
2. Go to Admin section
3. Select "Sovereign Stack"

**What You'll See:**
- Real-time status of all infrastructure services
- CPU/memory metrics
- Service health indicators (online, degraded, offline)

---

## 5. API-Only Access (For Technical Demo)

If you want to show the raw API capabilities:

### Decision DNA API
```bash
# Generate DNA for a deliberation
curl -X POST http://localhost:3001/api/v1/sovereign-arch/dna/generate/{deliberationId} \
  -H "Content-Type: application/json" \
  -d '{"format": "full", "outputFormat": "bundle"}'

# Verify DNA integrity
curl -X POST http://localhost:3001/api/v1/sovereign-arch/dna/verify \
  -H "Content-Type: application/json" \
  -d @decision_dna.json
```

### Deterministic Replay API
```bash
# Start state capture
curl -X POST http://localhost:3001/api/v1/sovereign-arch/replay/capture/start \
  -H "Content-Type: application/json" \
  -d '{"organizationId": "demo", "deliberationId": "test-123"}'

# Verify captured state
curl -X GET http://localhost:3001/api/v1/sovereign-arch/replay/{stateId}/verify
```

### TPM Attestation API
```bash
# Initialize TPM
curl -X POST http://localhost:3001/api/v1/sovereign-arch/tpm/initialize

# Sign a decision
curl -X POST http://localhost:3001/api/v1/sovereign-arch/tpm/sign \
  -H "Content-Type: application/json" \
  -d '{"decisionId": "dec-123", "payload": {...}}'

# Verify signature
curl -X GET http://localhost:3001/api/v1/sovereign-arch/tpm/verify/{signedId}
```

### Data Diode API
```bash
# Register a data source
curl -X POST http://localhost:3001/api/v1/sovereign-arch/diode/sources \
  -H "Content-Type: application/json" \
  -d '{"name": "Legal DB", "watchPath": "/ingest", "format": "json"}'

# Get statistics
curl -X GET http://localhost:3001/api/v1/sovereign-arch/diode/statistics
```

### Portable Instance API
```bash
# Create a portable instance config
curl -X POST http://localhost:3001/api/v1/sovereign-arch/portable/configs \
  -H "Content-Type: application/json" \
  -d '{"name": "Demo Instance", "imageType": "demo", "baseOS": "alpine"}'

# Build the image
curl -X POST http://localhost:3001/api/v1/sovereign-arch/portable/build/{configId}
```

---

## Demo Flow Recommendation

### For TR Meeting (10 minutes)

1. **Start at Council** (`/cortex/council`)
   - Show a completed deliberation
   - Point out the agent contributions and any dissents

2. **Go to Decision DNA** (`/cortex/intelligence/decision-dna`)
   - Select the same deliberation
   - Show the timeline of events
   - Export the DNA bundle
   - Highlight the Merkle root and hash chain

3. **Go to CendiaReplay** (`/cortex/council/replay-theater`)
   - Replay the deliberation
   - Pause at key moments
   - Show how you can verify the exact reasoning

4. **Mention Air-Gap Capabilities** (no demo needed)
   - "All of this runs on-premise, air-gapped"
   - "Data Diode ensures data flows in but never out"
   - "TPM Attestation provides hardware-signed proof"
   - "Portable Instance lets you boot from USB"

---

## Troubleshooting

### "Page not found"
- Make sure both backend and frontend are running
- Check you're logged in as an admin/owner user

### "No deliberations available"
- Run the demo seed: `curl -X POST http://localhost:3001/api/v1/demo-seed/all`
- Or create a new deliberation in The Council

### "API errors"
- Check backend logs: `npm run dev` in `/backend`
- Verify database is running: `docker-compose up -d`

---

*Last updated: January 2026*
