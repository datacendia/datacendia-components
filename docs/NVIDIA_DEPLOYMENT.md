# NVIDIA GPU Deployment Guide

**Deploy Datacendia with GPU-accelerated inference, safety rails, and analytics.**

---

## Overview

The NVIDIA deployment profile adds GPU-accelerated services alongside the existing platform:

| Service | Image | GPU Required | What It Does |
|---|---|---|---|
| **Triton Inference Server** | `nvcr.io/nvidia/tritonserver:24.03-py3` | Yes (1 GPU) | Serves Council agent models with GPU acceleration. Replaces CPU inference — 5-10x faster deliberations. |
| **NeMo Guardrails** | `nvcr.io/nvidia/nemo-guardrails:24.03` | Yes (1 GPU) | 9 safety rails on Council deliberations: hallucination, toxicity, PII, policy violations. |
| **RAPIDS (cuGraph/cuDF)** | `nvcr.io/nvidia/rapidsai/notebooks:24.04` | Yes (1 GPU) | GPU-accelerated bias detection and graph analytics across millions of decisions. |
| **Ollama** | `ollama/ollama:latest` | Yes (1 GPU) | Local LLM inference on GPU (already in base compose, GPU allocation ensured). |

**Nothing changes in the application code.** The backend detects NVIDIA services via environment variables and routes requests through the GPU-accelerated providers automatically.

---

## Prerequisites

### Hardware
- **Minimum:** 1x NVIDIA GPU with 16GB VRAM (RTX 4090, A10G, L40S)
- **Recommended:** 4x NVIDIA GPUs (one per service) — A100 40GB or H100 80GB
- **Single-GPU mode:** All services share one GPU (reduced throughput, fine for demos)

### Software
- Docker Engine 24.0+
- NVIDIA Container Toolkit (`nvidia-ctk`)
- NVIDIA driver 535.129.03+

### Verify GPU Access

```bash
# Check NVIDIA driver
nvidia-smi

# Check Docker GPU support
docker run --rm --gpus all nvidia/cuda:12.4.1-base-ubuntu22.04 nvidia-smi
```

---

## Quick Start — Docker Compose

### Development (with GPU services)

```bash
# Start base services + NVIDIA GPU services
docker compose -f docker-compose.yml -f docker-compose.nvidia.yml up
```

### Production (with GPU services)

```bash
# Start production services + NVIDIA GPU services
docker compose -f docker-compose.production.yml -f docker-compose.nvidia.yml up -d
```

### What happens when you add the NVIDIA profile:

1. **Triton starts** on ports 8000/8001/8002 — Council Engine switches from Ollama to Triton for inference
2. **NeMo Guardrails starts** on port 8090 — every Council deliberation passes through 9 safety rails
3. **RAPIDS starts** on port 5555 — bias detection and analytics queries use GPU acceleration
4. **Backend detects NVIDIA services** via environment variables set in the override file:
   - `TRITON_URL=triton:8001` → `TritonProvider.ts` activates
   - `NEMO_GUARDRAILS_URL=http://nemo-guardrails:8090` → `NeMoGuardrailsEngine.ts` activates
   - `RAPIDS_URL=http://rapids:5555` → `RAPIDSService.ts` activates

---

## Quick Start — Kubernetes (Helm)

### Prerequisites
- NVIDIA GPU Operator installed on cluster
- Nodes with `nvidia.com/gpu` resource available

### Deploy

```bash
# Install with NVIDIA values overlay
helm install datacendia ./helm/datacendia \
  -f helm/datacendia/values.yaml \
  -f helm/datacendia/values-nvidia.yaml \
  -n datacendia --create-namespace

# Upgrade existing deployment to add GPU services
helm upgrade datacendia ./helm/datacendia \
  -f helm/datacendia/values.yaml \
  -f helm/datacendia/values-nvidia.yaml \
  -n datacendia
```

### Resource Requirements (Kubernetes)

| Service | GPU | CPU Request | Memory Request | CPU Limit | Memory Limit |
|---|---|---|---|---|---|
| Triton | 1x | 1 core | 4Gi | 4 cores | 16Gi |
| NeMo Guardrails | 1x | 500m | 2Gi | 2 cores | 8Gi |
| RAPIDS | 1x | 1 core | 4Gi | 4 cores | 16Gi |
| Ollama | 1x | 1 core | 4Gi | 4 cores | 12Gi |
| **Total (GPU nodes)** | **4x** | **3.5 cores** | **14Gi** | **14 cores** | **52Gi** |

---

## Configuration Reference

### Environment Variables (Backend)

These are set automatically by `docker-compose.nvidia.yml` or `values-nvidia.yaml`:

| Variable | Default (NVIDIA profile) | Description |
|---|---|---|
| `TRITON_URL` | `triton:8001` | Triton gRPC endpoint. Activates `TritonProvider.ts`. |
| `TRITON_HTTP_URL` | `http://triton:8000` | Triton HTTP endpoint for health checks and model management. |
| `TRITON_METRICS_URL` | `http://triton:8002` | Triton Prometheus metrics endpoint. |
| `INFERENCE_PROVIDER` | `triton` | Which inference provider to use. Options: `triton`, `ollama`, `openai`, `anthropic`, `nim`. |
| `NEMO_GUARDRAILS_URL` | `http://nemo-guardrails:8090` | NeMo Guardrails server endpoint. |
| `NEMO_GUARDRAILS_ENABLED` | `true` | Enable/disable NeMo safety rails on Council deliberations. |
| `RAPIDS_URL` | `http://rapids:5555` | RAPIDS analytics server endpoint. |
| `RAPIDS_ENABLED` | `true` | Enable/disable GPU-accelerated analytics. |
| `NIM_URL` | *(not set)* | NVIDIA NIM microservice URL (optional, for NIM-based inference). |
| `NIM_API_KEY` | *(not set)* | NVIDIA NIM API key (if using hosted NIM). |

### Graceful Fallback

If any NVIDIA service is unavailable, the platform falls back to CPU-based alternatives:

| NVIDIA Service | Fallback | Impact |
|---|---|---|
| Triton unavailable | Ollama (local) or OpenAI/Anthropic (cloud) | Slower inference, same functionality |
| NeMo Guardrails unavailable | Built-in safety checks (rule-based) | Reduced safety coverage, no GPU-accelerated NLP |
| RAPIDS unavailable | CPU-based analytics (native Node.js) | Slower bias detection on large datasets |

**The platform never fails because a GPU service is down.** All NVIDIA integrations use dynamic `import()` with try/catch fallbacks.

---

## Loading Models into Triton

Triton needs model files in its model repository. To load models:

```bash
# Create model directory structure
mkdir -p deploy/nvidia/triton-models/council_llm/1

# Example: Copy an ONNX model
cp your-model.onnx deploy/nvidia/triton-models/council_llm/1/model.onnx

# Create config.pbtxt for Triton
cat > deploy/nvidia/triton-models/council_llm/config.pbtxt << 'EOF'
name: "council_llm"
platform: "onnxruntime_onnx"
max_batch_size: 8
input [
  {
    name: "input_ids"
    data_type: TYPE_INT64
    dims: [-1]
  }
]
output [
  {
    name: "logits"
    data_type: TYPE_FP32
    dims: [-1, -1]
  }
]
instance_group [
  {
    count: 1
    kind: KIND_GPU
  }
]
EOF

# Restart Triton to load models
docker compose -f docker-compose.yml -f docker-compose.nvidia.yml restart triton
```

---

## Configuring NeMo Guardrails

Create guardrails configuration in `deploy/nvidia/guardrails-config/`:

```bash
mkdir -p deploy/nvidia/guardrails-config

cat > deploy/nvidia/guardrails-config/config.yml << 'EOF'
models:
  - type: main
    engine: nvidia_ai_endpoints
    model: meta/llama3-70b-instruct

rails:
  input:
    flows:
      - check pii
      - check toxicity
      - check jailbreak
  output:
    flows:
      - check hallucination
      - check factual accuracy
      - check policy compliance

  config:
    pii:
      enabled: true
      entities: [PERSON, EMAIL, PHONE, SSN, CREDIT_CARD, ADDRESS, DATE_OF_BIRTH]
    toxicity:
      enabled: true
      threshold: 0.7
    hallucination:
      enabled: true
      fact_checking: true
EOF
```

---

## Monitoring GPU Services

### Triton Metrics

```bash
# Prometheus metrics
curl http://localhost:8002/metrics

# Key metrics:
# nv_inference_request_success    — successful inference count
# nv_inference_request_duration   — latency histogram
# nv_gpu_utilization              — GPU utilization %
# nv_gpu_memory_used_bytes        — GPU memory usage
```

### Grafana Dashboard

The existing Grafana setup (`grafana/`) can be extended with NVIDIA GPU dashboards:

```bash
# Import NVIDIA Triton dashboard (Grafana ID: 16547)
# Import NVIDIA DCGM dashboard (Grafana ID: 12239)
```

---

## Single-GPU Mode

If you only have one GPU, all services can share it. Reduce memory limits:

```bash
# Create a single-GPU override
# docker compose -f docker-compose.yml -f docker-compose.nvidia.yml \
#   -f docker-compose.nvidia-single-gpu.yml up
```

Or set `count: all` instead of `count: 1` in each service's deploy section and let Docker/NVIDIA manage GPU sharing. Throughput will be lower but all services will function.

---

## Performance Comparison

| Operation | CPU (Ollama) | GPU (Triton) | Speedup |
|---|---|---|---|
| Single agent inference | ~2-5s | ~200-500ms | **5-10x** |
| 4-agent Council deliberation | ~10-30s | ~1-3s | **10x** |
| 12-agent full Council | ~30-90s | ~3-8s | **10x** |
| Bias scan (1M decisions) | ~minutes | ~seconds | **100x+** |
| NeMo safety rail check | N/A (rule-based) | ~50ms per request | GPU-native |

*Performance varies by model size, GPU type, and batch size. Numbers are approximate for A100 40GB.*

---

## Files Reference

| File | Purpose |
|---|---|
| `docker-compose.nvidia.yml` | Docker Compose overlay — adds Triton, NeMo, RAPIDS services |
| `helm/datacendia/values-nvidia.yaml` | Helm values overlay — Kubernetes GPU deployment |
| `deploy/nvidia/triton-config/` | Triton server configuration (create as needed) |
| `deploy/nvidia/guardrails-config/` | NeMo Guardrails configuration |
| `deploy/nvidia/rapids-workers/` | RAPIDS server scripts |
| `backend/src/services/inference/TritonProvider.ts` | Triton inference provider (already built) |
| `backend/src/services/guardrails/NeMoGuardrailsEngine.ts` | NeMo Guardrails engine (already built) |
| `backend/src/services/gpu/RAPIDSService.ts` | RAPIDS GPU service (already built) |
| `backend/src/services/inference/NIMProvider.ts` | NVIDIA NIM provider (already built) |

---

**Contact:** Stuart Rainey — stuart.rainey@datacendia.com  
**NVIDIA Inception Member**
