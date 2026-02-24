# SOP-017: Multi-Model Architecture Management

**Category:** AI Infrastructure
**Priority:** High
**Owner:** AI/ML Lead
**Last Verified:** 2026-02-22 (against `backend/src/config/aiModels.ts`, `backend/src/services/ollama.ts`)

---

## 1. Purpose

Define procedures for managing the 8-slot multi-model AI architecture, including model selection, license-tier gating, performance monitoring, and failover.

---

## 2. Architecture Overview

The Datacendia platform uses **purpose-built models per task** rather than one generic LLM. Each slot serves a specific cognitive function.

| Slot # | Slot Name | Purpose | Default Model | GPU VRAM |
|--------|-----------|---------|---------------|----------|
| 1 | Default | General purpose reasoning | `qwen3:32b` | ~20 GB |
| 2 | Large | Complex multi-step reasoning | `llama3.3:70b` | ~40 GB |
| 3 | Reasoning | Deep logical analysis | `deepseek-r1:32b` | ~20 GB |
| 4 | Coder | Code generation and review | `qwen3-coder:30b` | ~18 GB |
| 5 | Fast | Quick responses, chat, triage | `llama3.2:3b` | ~2 GB |
| 6 | Vision | Image and document analysis | `qwen3-vl:30b` | ~18 GB |
| 7 | Embedding | Semantic search vectors (2560-dim) | `qwen3-embedding:4b` | ~2.5 GB |
| 8 | Agent-specific | Per-agent overrides | Varies | Varies |

---

## 3. License Tier Model Access

| License Tier | Available Slots | Models |
|-------------|----------------|--------|
| **Pilot** ($50K) | Fast + Default | `llama3.2:3b`, `qwen3:32b` |
| **Foundation** | + Large | + `llama3.3:70b` |
| **Enterprise** | + Reasoning + Coder | + `deepseek-r1:32b`, `qwen3-coder:30b` |
| **Platinum** | All 8 slots | + Vision, Embedding, Agent-specific |

### 3.1 Automatic Downgrade
When a user's license tier doesn't support a requested model:
1. System logs the downgrade attempt
2. Request is routed to the highest available model in the tier
3. Response includes metadata indicating model substitution
4. No user-facing error — transparent degradation

---

## 4. Model Selection Logic

### 4.1 Resolution Priority (per request)
1. **Explicit request** — API caller specifies model
2. **User preference** — Stored per-user model preferences
3. **Agent default** — Agent configuration model assignment
4. **Slot default** — Default model for the function slot
5. **Any available** — First available model (with warning log)

### 4.2 Backend Resolution (`OllamaService.resolveModel()`)
```
Requested model → Exact match? → Use it
                → Prefix match? → Use closest
                → Default model available? → Use default
                → Any model available? → Use with warning
                → No models? → Fail with clear error
```

Model availability is cached for **60 seconds** to avoid repeated API calls to Ollama.

---

## 5. Slot Assignment Per Feature

| Feature | Primary Slot | Fallback Slot |
|---------|-------------|---------------|
| Council Deliberation | Agent-specific → Default | Fast |
| DCII IISS Assessment | Reasoning | Default |
| Collapse Mode (Red-Team) | Reasoning | Default |
| CendiaChronos Analysis | Default | Fast |
| Ghost Board Simulation | Large | Default |
| Auto-Heal Fix Generation | Agent-specific | Fast |
| Embedding/Search | Embedding | — |
| Document Analysis | Vision | Default |
| Quick Chat/Triage | Fast | — |
| Code Review | Coder | Default |

---

## 6. Performance Monitoring

### 6.1 Key Metrics
| Metric | Target | Alert Threshold |
|--------|--------|----------------|
| Tokens/second | > 20 tok/s | < 5 tok/s |
| Time to first token | < 2s | > 10s |
| Total generation time | < 30s (fast), < 120s (large) | 2x target |
| Model load time | < 10s | > 30s |
| GPU utilization | 70–90% | > 95% sustained |
| Memory usage | Within VRAM | OOM events |

### 6.2 Monitoring Endpoints
```bash
# List installed models with sizes
curl http://localhost:3001/api/v1/models

# Check Ollama status
curl http://localhost:3001/api/v1/auto-heal/status

# Direct Ollama metrics
curl http://localhost:11434/api/tags
```

---

## 7. Model Update Procedure

### 7.1 Update a Model
```bash
# Pull latest version
ollama pull qwen3:32b

# Verify
ollama list
```

### 7.2 Rollback
```bash
# Ollama keeps previous versions; re-pull specific version
ollama pull qwen3:32b@sha256:<previous_digest>
```

### 7.3 Add New Model to Architecture
1. Pull model: `ollama pull <model>`
2. Update `backend/src/config/index.ts` default or env var
3. Update `backend/src/config/aiModels.ts` tier assignments
4. Test with deliberation
5. Deploy

---

## 8. Failover & Degradation

| Scenario | Behavior |
|----------|----------|
| Requested model not installed | Resolve to closest available |
| Ollama not running | Backend returns 502; frontend shows error |
| GPU out of memory | Ollama auto-unloads least-used model |
| All models unavailable | Service degrades to demo/cached data |
| Network partition (air-gapped) | Local Ollama only — no external calls |

---

## 9. Verified Against

- `backend/src/config/index.ts`: 6 Ollama model config variables
- `backend/src/config/aiModels.ts`: `aiModelSelector`, `LICENSE_TIERS`, tier-to-model mapping
- `backend/src/services/ollama.ts`: `resolveModel()`, 60s cache, `isAvailable()`, `listModels()`
- `backend/src/config/models.ts`: `MODEL_REGISTRY`, `AGENT_CONFIG`
- `COMPLETE_SERVICE_MATRIX.md`: Agent-to-model assignments

---

*Datacendia, LLC — Proprietary and Confidential*
