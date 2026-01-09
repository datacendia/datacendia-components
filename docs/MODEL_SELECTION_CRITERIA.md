# DATACENDIA MODEL SELECTION CRITERIA
## AI Model Transparency & Selection Guidelines

**Version:** 1.0.0  
**Generated:** January 9, 2026  
**Source:** `docs/model_zoo.txt`, `backend/src/services/ollama.ts`

---

# OVERVIEW

Datacendia uses **local AI models via Ollama** for sovereign, air-gapped operation. No data leaves your infrastructure. This document explains how and why specific models are selected for different tasks.

---

# MODEL REGISTRY

## Primary Models

| Role | Model | Context Window | Temperature | Use Case |
|------|-------|----------------|-------------|----------|
| **Flagship** | `llama4:scout` | 128k | 0.7 | General intelligence, complex queries |
| **Strategist** | `llama3.3:70b` | 128k | 0.7 | High-quality analysis, synthesis |
| **Reasoning** | `deepseek-r1:32b` | 32k | 0.3 | Chain-of-thought, logic, risk analysis |
| **Thinker** | `qwq:32b` | 32k | 0.4 | Deep analysis, philosophical reasoning |
| **Polyglot** | `qwen3:32b` | 32k | 0.7 | Multilingual, general reasoning |
| **Coder** | `deepseek-coder-v2` | 32k | 0.2 | SQL, JSON, code generation |
| **Scientist** | `gemma3:27b` | 8k | 0.6 | Scientific analysis, research |
| **Fast** | `llama3.2:3b` | 8k | 0.5 | UI responses, quick operations |
| **Ensemble** | `mixtral:8x22b` | 64k | 0.7 | Diverse tasks, MoE efficiency |

---

# SELECTION CRITERIA

## 1. Task Complexity

| Complexity | Model Selection | Rationale |
|------------|-----------------|-----------|
| **Simple** (UI, quick answers) | `llama3.2:3b` | Speed over depth |
| **Standard** (general queries) | `llama4:scout` | Balanced performance |
| **Complex** (analysis, strategy) | `llama3.3:70b` | Maximum quality |
| **Reasoning** (logic, risk) | `deepseek-r1:32b` | Chain-of-thought |

## 2. Domain Specificity

| Domain | Model | Rationale |
|--------|-------|-----------|
| **Legal** | `qwq:32b` | Deep reasoning for case analysis |
| **Financial** | `deepseek-r1:32b` | Precise calculations, risk modeling |
| **Healthcare** | `llama3.3:70b` | Comprehensive medical knowledge |
| **Code/Technical** | `deepseek-coder-v2` | Specialized for code |
| **Multilingual** | `qwen3:32b` | Best multilingual support |

## 3. Temperature Selection

| Task Type | Temperature | Rationale |
|-----------|-------------|-----------|
| **Code generation** | 0.2 | Precision, determinism |
| **Risk analysis** | 0.3 | Logical consistency |
| **Deep analysis** | 0.4 | Balanced creativity/accuracy |
| **General tasks** | 0.7 | Natural language flow |
| **Creative/brainstorm** | 0.8-1.0 | Maximum creativity |

---

# AGENT-MODEL MAPPING

## Council Agents

| Agent Role | Default Model | Rationale |
|------------|---------------|-----------|
| **Chief** | `llama4:scout` | Broad perspective, leadership |
| **CFO** | `deepseek-r1:32b` | Financial reasoning |
| **CLO** | `qwq:32b` | Legal analysis |
| **CISO** | `deepseek-r1:32b` | Security risk assessment |
| **CTO** | `deepseek-coder-v2` | Technical decisions |
| **Risk Officer** | `deepseek-r1:32b` | Risk quantification |
| **Ethics Officer** | `qwq:32b` | Philosophical reasoning |
| **Red Team** | `llama3.3:70b` | Adversarial thinking |

## Vertical-Specific Agents

| Vertical | Primary Model | Rationale |
|----------|---------------|-----------|
| **Legal** | `qwq:32b` | Case law reasoning |
| **Healthcare** | `llama3.3:70b` | Medical knowledge |
| **Financial** | `deepseek-r1:32b` | Quantitative analysis |
| **Government** | `llama4:scout` | Policy breadth |
| **Manufacturing** | `deepseek-r1:32b` | Process optimization |

---

# FALLBACK STRATEGY

If primary model unavailable:

```
1. llama4:scout (primary)
   ↓ fallback
2. llama3.3:70b (high quality)
   ↓ fallback
3. qwen3:32b (reliable)
   ↓ fallback
4. llama3.2:3b (always available)
```

---

# HARDWARE REQUIREMENTS

| Model | VRAM Required | RAM Required |
|-------|---------------|--------------|
| `llama4:scout` | 24GB+ | 32GB |
| `llama3.3:70b` | 48GB+ | 64GB |
| `deepseek-r1:32b` | 24GB | 32GB |
| `qwq:32b` | 24GB | 32GB |
| `mixtral:8x22b` | 48GB+ | 64GB |
| `llama3.2:3b` | 4GB | 8GB |

**Recommended Workstation:** 128GB RAM, 2x RTX 4090 or A100

---

# CONFIGURATION

## Environment Variables

```bash
# Primary model selection
OLLAMA_DEFAULT_MODEL=llama4:scout
OLLAMA_REASONING_MODEL=deepseek-r1:32b
OLLAMA_FAST_MODEL=llama3.2:3b
OLLAMA_CODER_MODEL=deepseek-coder-v2

# Translation (CendiaOmniTranslate)
OMNITRANSLATE_MODEL=qwen2.5:32b
OMNITRANSLATE_FALLBACK_MODEL=qwen2.5:14b
OMNITRANSLATE_FAST_MODEL=qwen2.5:7b
```

## Runtime Override

Models can be overridden per-request:

```typescript
await council.deliberate({
  question: "...",
  modelOverride: "deepseek-r1:32b",
  temperatureOverride: 0.3
});
```

---

# WHY LOCAL MODELS?

1. **Sovereignty** - Data never leaves your infrastructure
2. **Compliance** - HIPAA, FedRAMP, GDPR compatible
3. **Cost** - No per-token API fees
4. **Latency** - No network round-trip
5. **Availability** - Works air-gapped

---

# FILES

- **Model Config:** `docs/model_zoo.txt`
- **Ollama Service:** `backend/src/services/ollama.ts`
- **Agent Configs:** `backend/src/config/agents/`

---

*Datacendia™ — Transparent AI, Local Control*
