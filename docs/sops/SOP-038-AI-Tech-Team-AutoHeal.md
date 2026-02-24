# SOP-038: AI Tech Team Auto-Heal Operations

**Category:** AI Operations
**Priority:** Medium
**Owner:** Engineering Lead
**Last Verified:** 2026-02-22 (against `src/services/AutoHealService.ts`, `src/components/dev/TechTeamPanel.tsx`, `backend/src/routes/auto-heal.ts`)

---

## 1. Purpose

Define procedures for operating, configuring, and maintaining the AI Tech Team — the platform's self-monitoring and auto-healing system that detects errors, generates fixes, and assists developers in real-time.

---

## 2. System Overview

The AI Tech Team is a developer-facing system that:
- **Monitors** frontend and backend errors in real-time
- **Analyzes** error patterns and root causes
- **Generates** AI-powered fix suggestions using Ollama
- **Displays** a sidebar panel with 16 specialized agents

It consists of:
| Component | File | Purpose |
|-----------|------|---------|
| AutoHealService | `src/services/AutoHealService.ts` | Error detection, analysis, fix generation |
| TechTeamPanel | `src/components/dev/TechTeamPanel.tsx` | UI sidebar showing agents, errors, fixes |
| Auto-Heal API | `backend/src/routes/auto-heal.ts` | Backend proxy for Ollama fix generation |

---

## 3. Architecture

```
Browser Error → AutoHealService → Error Queue → Agent Assignment
                                                      ↓
                                              POST /api/v1/auto-heal/generate
                                                      ↓
                                              Backend → Ollama → Fix Response
                                                      ↓
                                              TechTeamPanel displays fix
```

**Important:** Fix generation routes through the backend API (`/api/v1/auto-heal/generate`) to avoid browser CORS issues with direct Ollama calls. The backend proxies the request to Ollama server-side.

---

## 4. Configuration

### 4.1 Default Configuration
| Setting | Default | Description |
|---------|---------|-------------|
| `enabled` | `true` | Enable auto-heal monitoring |
| `maxRetries` | `3` | Max fix generation attempts per error |
| `autoApply` | `false` | Auto-apply fixes (dangerous — disabled by default) |
| `notifyOnFix` | `true` | Show notification when fix is ready |
| `severityThreshold` | `warning` | Minimum severity to trigger fix generation |

### 4.2 Updating Configuration
Via TechTeamPanel UI:
- Toggle agents on/off
- Adjust severity threshold
- Enable/disable notifications
- Clear error queue

Via code:
```typescript
import { AutoHealService } from '@/services/AutoHealService';

AutoHealService.updateConfig({
  enabled: true,
  severityThreshold: 'error',
  notifyOnFix: true,
});
```

---

## 5. Agent Roster (16 Agents)

| # | Agent | Specialization |
|---|-------|---------------|
| 1 | Frontend Agent | React/TypeScript UI errors |
| 2 | Backend Agent | Express API errors |
| 3 | Database Agent | Prisma/PostgreSQL issues |
| 4 | Auth Agent | Authentication/JWT errors |
| 5 | API Agent | REST API integration issues |
| 6 | Performance Agent | Slow queries, memory leaks |
| 7 | Security Agent | Security vulnerabilities |
| 8 | CSS Agent | Styling and layout issues |
| 9 | Network Agent | CORS, connectivity, WebSocket |
| 10 | State Agent | React state management bugs |
| 11 | Build Agent | Vite/TypeScript build errors |
| 12 | Test Agent | Test failures and coverage |
| 13 | Docker Agent | Container and infrastructure issues |
| 14 | AI/ML Agent | Ollama, model, and AI pipeline errors |
| 15 | Data Agent | Data integrity and validation |
| 16 | DevOps Agent | CI/CD and deployment issues |

---

## 6. Operating Procedures

### 6.1 Viewing the Tech Team Panel
1. The TechTeamPanel appears in the Cortex sidebar
2. Shows badge count of active errors (e.g., "Tech Team 16")
3. Click to expand and see:
   - Active errors with severity
   - Agent assignments
   - Fix suggestions (if generated)
   - Loading state during fix generation

### 6.2 Requesting a Fix
1. Click "Generate Fix" on any error in the panel
2. Panel shows "Generating fix..." notification
3. Request routes: Frontend → `/api/v1/auto-heal/generate` → Backend → Ollama
4. On success: Fix suggestion displayed with code changes
5. On failure: Actual error message shown (e.g., "Ollama connection refused")

### 6.3 Checking Ollama Status
```bash
# Via backend API
curl http://localhost:3001/api/v1/auto-heal/status

# Returns:
{
  "success": true,
  "data": {
    "ollamaRunning": true,
    "modelCount": 7,
    "models": ["qwen3:32b", "llama3.2:3b", ...]
  }
}
```

---

## 7. Error Analysis Pipeline

### 7.1 Error Detection
AutoHealService captures errors from:
- `window.onerror` (global JS errors)
- `window.onunhandledrejection` (unhandled promises)
- React Error Boundaries
- Console error interception
- Manual `AutoHealService.reportError()` calls

### 7.2 Error Classification
Each error is analyzed for:
| Property | Values |
|----------|--------|
| Severity | `critical`, `error`, `warning`, `info` |
| Category | `runtime`, `network`, `type`, `syntax`, `logic` |
| File | Source file path |
| Stack trace | Full stack for root cause |

### 7.3 Agent Assignment
Errors are routed to the appropriate agent based on:
- Error category → specialized agent
- File path → frontend vs. backend agent
- Error message patterns → specific agent expertise

---

## 8. Fix Suggestion Format

### 8.1 Structured Fix (JSON)
```json
{
  "rootCause": "Description of the root cause",
  "fix": {
    "file": "src/pages/example.tsx",
    "oldCode": "problematic code",
    "newCode": "fixed code",
    "explanation": "Why this fix works"
  },
  "confidence": 0.85,
  "riskLevel": "safe"
}
```

### 8.2 Risk Levels
| Level | Meaning | Auto-Apply |
|-------|---------|-----------|
| `safe` | Minimal change, low risk | Possible (if enabled) |
| `moderate` | Requires review | Never auto-apply |
| `risky` | Significant change | Never auto-apply, requires manual review |

---

## 9. Troubleshooting

| Issue | Cause | Resolution |
|-------|-------|------------|
| "Failed to generate fix" | Ollama not running | Start `ollama serve` |
| "Network error reaching backend" | Backend not running | Start backend: `npm run dev:backend` |
| Fix quality is poor | Wrong model or insufficient context | Use reasoning model, provide more error context |
| Panel shows stale errors | Error queue not cleared | Click "Clear Queue" in panel |
| `lastGenerateError` shows CORS | Direct Ollama call (old code) | Verify using `/api/v1/auto-heal/generate` route |

---

## 10. Verified Against

- `src/services/AutoHealService.ts`: Error queue, agent assignment, fix generation via `/api/v1/auto-heal/generate`, `lastGenerateError` field
- `src/components/dev/TechTeamPanel.tsx`: UI panel, fix request with actual error display
- `backend/src/routes/auto-heal.ts`: Backend proxy with `POST /generate` and `GET /status`
- `backend/src/routes/domains/platform.domain.ts`: Route registered as `/auto-heal`
- `backend/src/services/ollama.ts`: OllamaService used by auto-heal route

---

*Datacendia, LLC — Proprietary and Confidential*
