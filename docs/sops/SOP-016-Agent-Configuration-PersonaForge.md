# SOP-016: Agent Configuration & PersonaForge

**Category:** AI Operations
**Priority:** Medium
**Owner:** AI/ML Lead
**Last Verified:** 2026-02-22 (against `backend/src/config/models.ts`, `COMPLETE_SERVICE_MATRIX.md`)

---

## 1. Purpose

Define procedures for configuring AI Council agents, creating custom personas via CendiaPersonaForge™, and managing agent behavior and model assignments.

---

## 2. Agent Configuration Architecture

### 2.1 Configuration Layers
| Layer | Scope | Override Priority |
|-------|-------|-------------------|
| System defaults | All agents | Lowest |
| Model registry | Per-model settings | Medium |
| Agent config | Per-agent behavior | High |
| User preferences | Per-user overrides | Highest |

### 2.2 Agent Configuration Properties
| Property | Description | Example |
|----------|-------------|---------|
| `code` | Unique agent identifier | `chief`, `cfo`, `ciso` |
| `name` | Display name | "Chief Strategy Agent" |
| `model` | Assigned Ollama model | `llama3.3:70b` |
| `systemPrompt` | Behavior instructions | Domain-specific prompt |
| `temperature` | Response creativity (0–1) | 0.7 (default), 0.3 (analytical) |
| `maxTokens` | Maximum response length | 2000–4000 |
| `requiredRole` | Minimum user role | `ANALYST`, `ADMIN` |

---

## 3. CendiaPersonaForge™

### 3.1 Overview
PersonaForge enables creation of custom AI personas with a **60-trait personality system** for specialized decision support.

### 3.2 Persona Creation Process
1. Navigate to `/cortex/enterprise/persona-forge`
2. Define persona basics:
   - Name and role description
   - Industry specialization
   - Primary function (advisory, analytical, operational)
3. Configure personality traits (60-trait system):
   - Risk tolerance (conservative ↔ aggressive)
   - Communication style (formal ↔ casual)
   - Analysis depth (summary ↔ comprehensive)
   - Decision speed (deliberate ↔ rapid)
   - Domain expertise weighting
4. Assign model from available slots
5. Test persona with sample deliberation
6. Deploy to Council

### 3.3 Via API
```bash
curl -X POST http://localhost:3001/api/v1/personas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Healthcare Compliance Specialist",
    "description": "Expert in HIPAA, Joint Commission, FDA regulations",
    "model": "qwq:32b",
    "traits": {
      "riskTolerance": 0.2,
      "analysisDpth": 0.9,
      "communicationFormality": 0.8,
      "domainFocus": ["healthcare", "compliance", "regulatory"]
    },
    "systemPrompt": "You are a healthcare compliance specialist..."
  }'
```

---

## 4. Model Assignment

### 4.1 Default Agent-to-Model Mapping
See SOP-004 Section 7 for the full agent-to-model table.

### 4.2 Changing Agent Model
```bash
# Set user-level model preference
curl -X PUT http://localhost:3001/api/v1/models/preferences \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "agentCode": "cfo",
    "preferredModel": "deepseek-r1:32b"
  }'
```

### 4.3 Model Resolution
The backend resolves models in order:
1. User preference for this agent
2. Agent's configured default
3. Global default model
4. Any available model (with warning)

---

## 5. License Tier Gating

| Tier | Available Agents | Model Access |
|------|-----------------|-------------|
| **Pilot** ($50K) | 14 core agents | Fast + Default models |
| **Foundation** | 14 core + 1 pack | + Large model |
| **Enterprise** | All agents | + Reasoning + Coder |
| **Platinum** | All + custom personas | All 8 model slots |

Agents and models are automatically downgraded if the license tier doesn't support them.

---

## 6. System Prompt Management

### 6.1 Prompt Structure
```
[Role Definition]
You are the {agent_name}, specialized in {domain}.

[Behavioral Guidelines]
- Always consider {framework} when analyzing
- Prioritize {objective} in recommendations
- Flag risks above {threshold}

[Output Format]
Provide your analysis in the following structure:
1. Summary
2. Key Findings
3. Risk Assessment
4. Recommendation
5. Confidence Score (0-1)
```

### 6.2 Prompt Testing
Before deploying prompt changes:
1. Test with 3 diverse decision scenarios
2. Verify output format compliance
3. Check confidence calibration
4. Compare against previous prompt version

---

## 7. Monitoring

| Metric | Description | Target |
|--------|-------------|--------|
| Response time | Time per agent response | < 30s (fast), < 120s (large) |
| Confidence calibration | Accuracy of confidence scores | > 80% correlation |
| Dissent rate | Frequency of disagreement | 15–30% (healthy) |
| Error rate | Failed agent responses | < 2% |

---

## 8. Verified Against

- `COMPLETE_SERVICE_MATRIX.md`: 14 core agents, PersonaForge 60-trait system
- `backend/src/config/models.ts`: MODEL_REGISTRY, AGENT_CONFIG, getUserModelPreferences
- `backend/src/config/aiModels.ts`: License tier model gating
- `src/pages/cortex/enterprise/PersonaForgePage.tsx`: UI exists at route
- `src/routes/cortex/enterprise.routes.tsx`: `enterprise/persona-forge` route

---

*Datacendia, LLC — Proprietary and Confidential*
