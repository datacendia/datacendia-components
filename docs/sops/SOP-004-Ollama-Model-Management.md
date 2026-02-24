# SOP-004: Ollama Model Management

**Category:** AI Infrastructure
**Priority:** High
**Owner:** AI/ML Lead
**Last Verified:** 2026-02-22 (against `backend/src/services/ollama.ts`, `backend/src/config/aiModels.ts`)

---

## 1. Purpose

Define procedures for managing Ollama models that power the Datacendia 8-slot multi-model AI architecture, including installation, updates, health checks, and troubleshooting.

---

## 2. 8-Slot Model Architecture

| Slot | Purpose | Default Model | Config Key |
|------|---------|---------------|------------|
| Default | General purpose | `qwen3:32b` | `OLLAMA_MODEL` |
| Large | Complex reasoning | `llama3.3:70b` | `ollamaModelLarge` |
| Reasoning | Deep analysis, logic | `deepseek-r1:32b` | `ollamaModelReasoning` |
| Coder | Code generation/review | `qwen3-coder:30b` | `ollamaModelCoder` |
| Fast | Quick responses, chat | `llama3.2:3b` | `OLLAMA_MODEL_FAST` |
| Vision | Image/document analysis | `qwen3-vl:30b` | `ollamaModelVision` |
| Embedding | Semantic search vectors | `qwen3-embedding:4b` | Hardcoded in EmbeddingService |
| Agent-specific | Per-agent overrides | Varies | Agent config |

---

## 3. Model Installation

### 3.1 Install Required Models
```bash
# Core models (minimum for platform operation)
ollama pull qwen3:32b          # Default
ollama pull llama3.2:3b        # Fast

# Full model suite
ollama pull llama3.3:70b       # Large reasoning
ollama pull deepseek-r1:32b    # Deep reasoning
ollama pull qwen3-coder:30b    # Code generation
ollama pull qwen3-vl:30b       # Vision
ollama pull qwen3-embedding:4b # Embeddings (2560-dim multilingual)
```

### 3.2 Verify Installation
```bash
ollama list
```
Expected output should show all pulled models with sizes.

### 3.3 Storage Requirements
| Model | Size (approx) |
|-------|---------------|
| `qwen3:32b` | ~20 GB |
| `llama3.3:70b` | ~40 GB |
| `deepseek-r1:32b` | ~20 GB |
| `qwen3-coder:30b` | ~18 GB |
| `llama3.2:3b` | ~2 GB |
| `qwen3-vl:30b` | ~18 GB |
| `qwen3-embedding:4b` | ~2.5 GB |
| **Total** | **~120 GB** |

---

## 4. Model Resolution Logic

The backend `OllamaService` (`backend/src/services/ollama.ts`) uses intelligent model resolution:

1. **Exact match** — If requested model name matches an installed model
2. **Prefix match** — e.g., `qwen2.5:7b` matches `qwen2.5:7b-q4_0`
3. **Default model** — Falls back to configured default
4. **Any available** — Uses first available model with a warning
5. **Fail-through** — Returns requested name and lets API call fail with a clear error

Model cache refreshes every **60 seconds** (`getAvailableModelNames()`).

---

## 5. Health Checks

### 5.1 Backend Health Check
```bash
# Check if Ollama is reachable from backend
curl http://localhost:3001/api/v1/auto-heal/status
```

### 5.2 Direct Ollama Health Check
```bash
# List models (from server, not browser — avoids CORS)
curl http://localhost:11434/api/tags

# Test generation
curl http://localhost:11434/api/generate -d '{"model":"llama3.2:3b","prompt":"Hello","stream":false}'
```

### 5.3 Backend API Models Endpoint
```bash
curl http://localhost:3001/api/v1/models
```
Returns all registered models with installation status.

---

## 6. CORS Configuration

**Critical:** Ollama does NOT accept cross-origin requests from browsers by default. All AI requests from the frontend MUST route through the backend API, NOT directly to Ollama.

| Path | Correct | Incorrect |
|------|---------|-----------|
| Frontend → Ollama | ❌ CORS blocked | `fetch('http://localhost:11434/...')` |
| Frontend → Backend → Ollama | ✅ Works | `fetch('/api/v1/auto-heal/generate')` |

The `AutoHealService.ts` routes through `/api/v1/auto-heal/generate` which the backend proxies to Ollama.

If direct browser access is required, set:
```bash
# On Ollama host (NOT recommended for production)
OLLAMA_ORIGINS=* ollama serve
```

---

## 7. Agent-to-Model Mapping

Each AI Council agent can be assigned a specific model:

| Agent | Default Model | Reasoning |
|-------|---------------|-----------|
| Chief Strategy | `llama3.3:70b` | Complex strategic synthesis |
| CFO | `llama3.3:70b` | Financial analysis depth |
| CISO | `qwq:32b` | Security reasoning |
| Risk | `qwq:32b` | Risk analysis depth |
| COO | `llama3.2:3b` | Operational speed |
| CDO | `qwen2.5-coder:32b` | Data/code understanding |

---

## 8. Troubleshooting

| Issue | Cause | Resolution |
|-------|-------|------------|
| "check if Ollama is running" | CORS or connection error | Verify `ollama serve` is running; use backend proxy |
| Model not found | Not pulled | Run `ollama pull <model>` |
| Slow responses | Model too large for GPU | Use smaller quantization or `llama3.2:3b` for fast slot |
| Out of memory | Multiple large models | Ollama auto-unloads; increase system RAM |
| `OLLAMA_BASE_URL` not working | Wrong URL | Default is `http://127.0.0.1:11434` |

---

## 9. Verified Against

- `backend/src/services/ollama.ts`: OllamaService class, model resolution, health check
- `backend/src/config/index.ts`: 6 Ollama config variables with defaults
- `backend/src/config/aiModels.ts`: License tier model assignments
- `backend/src/routes/models.ts`: Models API endpoint
- `backend/src/routes/auto-heal.ts`: Backend proxy for frontend Ollama calls
- `src/services/AutoHealService.ts`: Frontend routes through `/api/v1/auto-heal/generate`

---

*Datacendia, LLC — Proprietary and Confidential*
