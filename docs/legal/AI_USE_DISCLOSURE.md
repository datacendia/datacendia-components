# Datacendia Acceptable AI Use Disclosure

**Effective Date:** March 2026  
**Last Updated:** March 2026  
**Version:** 1.0

---

## 1. Purpose

This document describes how Datacendia uses artificial intelligence, what AI models power the platform, how Customer Data interacts with those models, and what controls are available to Customers.

This disclosure is provided in alignment with:
- EU AI Act (Article 13 — Transparency obligations)
- NIST AI Risk Management Framework
- ISO/IEC 42001 (AI Management System)
- Datacendia's commitment to defensible, auditable AI

---

## 2. AI Models Used

### 2.1 Cloud-Hosted Deployments

In Cloud-Hosted mode, Datacendia routes AI inference requests through CendiaGateway to the following model providers:

| Provider | Models | Data Region | Training on Customer Data |
|----------|--------|-------------|--------------------------|
| **OpenAI** | GPT-4, GPT-4o, GPT-4o-mini | US | ❌ Prohibited by DPA |
| **Anthropic** | Claude 3.5 Sonnet, Claude 3 Opus | US | ❌ Prohibited by DPA |
| **Google** | Gemini 1.5 Pro, Gemini 1.5 Flash | US | ❌ Prohibited by DPA |
| **Mistral AI** | Mistral Large, Mixtral 8x22B | EU | ❌ Prohibited by DPA |

All providers are contractually prohibited from using Customer Data for model training, fine-tuning, or improvement.

### 2.2 Self-Hosted and Sovereign Deployments

In Self-Hosted and Sovereign (Air-Gapped) modes, Customers provide their own model servers:

| Supported Backend | Examples |
|------------------|---------|
| **Ollama** | Llama 3, Mistral, Phi-3, CodeLlama, any GGUF model |
| **vLLM** | Any HuggingFace-compatible model |
| **NVIDIA NIM** | Optimized inference on NVIDIA GPUs (A100, H100, H200) |
| **NVIDIA Triton** | Multi-model serving with batching |

In these modes, **no Customer Data leaves the Customer's network**. Datacendia has zero access to inference inputs, outputs, or model weights.

---

## 3. How AI Is Used in the Platform

### 3.1 Council Deliberation

The core feature of Datacendia is the AI Council — multiple AI agents that analyze a decision from different perspectives (legal, financial, ethical, operational, strategic, regulatory, etc.).

- **Input:** A decision prompt provided by the user, plus relevant context documents
- **Processing:** Each agent receives only the minimum context required for its role
- **Output:** Individual agent analyses, a synthesized recommendation, confidence scores, and dissenting opinions
- **Audit:** Every deliberation produces a cryptographically signed Regulator's Receipt with a Merkle tree evidence chain

### 3.2 CendiaGateway — AI Governance Proxy

All AI requests (in Cloud-Hosted mode) pass through CendiaGateway, which:

- **Scans for PII** — 10 PII types detected before data reaches any model provider
- **Enforces policies** — Configurable rules for data classification, permitted topics, and output filtering
- **Logs interactions** — Every AI request/response is logged with latency, token counts, and policy decisions
- **Generates AI Manifest** — Tamper-evident record of all AI usage for compliance audits

### 3.3 NeMo Guardrails

NVIDIA NeMo Guardrails provides 9 safety rails:

1. Jailbreak detection
2. Harmful intent blocking
3. Topic boundary enforcement
4. Hallucination detection
5. PII leakage prevention
6. Bias and fairness checks
7. Financial disclaimer enforcement
8. Medical safety guardrails
9. Response grounding verification

### 3.4 Automated Processing

Datacendia does **not** make automated decisions that produce legal effects without human review. The Council provides recommendations — humans make the final decision.

---

## 4. Data Minimization

CendiaGateway enforces data minimization before sending any data to AI model providers:

- Only the decision prompt and explicitly included context are sent
- Full Customer databases, user profiles, and organizational data are **never** sent to model providers
- PII detected in prompts can be automatically redacted before inference
- Customers can configure per-policy what data classifications are permitted in AI requests

---

## 5. Customer Controls

### 5.1 Model Selection

Customers can configure which AI models are used:
- **Cloud-Hosted:** Choose from available providers per Council mode
- **Self-Hosted:** Use any model compatible with Ollama, vLLM, or NVIDIA NIM
- **Sovereign:** Full control over model selection, weights, and configuration

### 5.2 Gateway Policies

Customers can create CendiaGateway policies that:
- Block specific data classifications from AI requests
- Require PII redaction before inference
- Restrict which model providers are permitted
- Set rate limits per user, department, or organization
- Enable/disable specific guardrails

### 5.3 Opt-Out

- Customers may disable AI features entirely and use Datacendia as a decision documentation and governance platform only
- Individual users can be restricted from AI features via RBAC
- Specific data types can be excluded from AI processing via gateway policies

### 5.4 Audit and Transparency

- Every AI interaction is logged in CendiaGateway with full request/response metadata
- The AI Manifest provides a tamper-evident record of all AI usage
- Regulator's Receipts include which models were used, what data was sent, and what outputs were generated
- Customers can export full AI interaction logs at any time

---

## 6. AI Limitations and Disclaimers

### 6.1 No Guarantee of Accuracy

AI models may produce inaccurate, incomplete, or biased outputs. Datacendia's multi-agent Council architecture is designed to surface conflicting perspectives and reduce single-model bias, but **AI outputs are recommendations, not decisions**.

### 6.2 Human Oversight Required

Datacendia is designed as a decision-support tool, not a decision-making tool. All AI outputs should be reviewed by qualified humans before acting on them. This is especially critical for:

- Legal and regulatory compliance decisions
- Financial decisions with material impact
- Healthcare and patient safety decisions
- Defense and national security decisions

### 6.3 Model Provider Changes

AI model providers may update or discontinue models. Datacendia will:
- Provide advance notice of material model changes
- Maintain backward compatibility where possible
- Allow Customers to pin specific model versions (Enterprise/Sovereign tiers)

---

## 7. EU AI Act Classification

Under the EU AI Act, Datacendia's primary use cases fall under:

| Component | Risk Level | Rationale |
|-----------|-----------|-----------|
| Council Deliberation | Varies by use case | Risk level depends on the decision domain (e.g., HR decisions = high-risk under Annex III) |
| CendiaGateway | Minimal risk | Infrastructure/governance layer, not a standalone AI system |
| NeMo Guardrails | Minimal risk | Safety and compliance checking |
| DCII (Audit/Evidence) | Minimal risk | Documentation and transparency tooling |

Customers deploying Datacendia for high-risk use cases under EU AI Act Annex III are responsible for:
- Conducting a Fundamental Rights Impact Assessment (FRIA)
- Registering the AI system in the EU database
- Maintaining human oversight per Article 14
- Datacendia provides tooling (Regulator's Receipt, AI Manifest, audit logs) to support these obligations

---

## 8. Contact

For questions about Datacendia's use of AI:

- **Technical:** support@datacendia.com
- **Privacy:** privacy@datacendia.com
- **Compliance:** legal@datacendia.com

---

**⚠️ IMPORTANT DISCLAIMER:**  
This document is for informational purposes and should be reviewed by legal and compliance teams. AI regulations are evolving rapidly. Consult qualified counsel for your specific use case and jurisdiction.
