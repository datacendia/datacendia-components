# SOP-024: Ghost Board Simulation

**Category:** Enterprise
**Priority:** Medium
**Owner:** Product Lead
**Last Verified:** 2026-02-22 (against `src/pages/cortex/intelligence/GhostBoardPage.tsx`, `COMPLETE_SERVICE_MATRIX.md`)

---

## 1. Purpose

Define procedures for conducting Ghost Board™ simulations — AI-powered virtual board meetings that prepare executives for tough questions, strategic challenges, and stakeholder scrutiny.

---

## 2. Service Overview

Ghost Board™ simulates a boardroom environment where AI agents role-play as virtual board members, asking probing questions and challenging assumptions before real board meetings.

**Pricing:** $299/mo | **Package:** Decision Intelligence

---

## 3. Core Capabilities

| Feature | Description |
|---------|-------------|
| **Virtual Board Members** | AI agents adopt board member personas |
| **Tough Question Prep** | Generates adversarial questions executives will face |
| **Transcript Export** | Full meeting transcript for preparation |
| **Scenario Testing** | Test presentations against skeptical audiences |
| **Multi-Perspective** | Financial, legal, operational, ethical viewpoints |

---

## 4. Operating Procedures

### 4.1 Setting Up a Ghost Board Session
1. Navigate to `/cortex/intelligence/ghost-board`
2. Define the meeting context:
   - Meeting type (Board, Investor, Regulatory, Internal)
   - Topic / presentation to test
   - Key metrics and data to present
   - Known concerns or sensitivities
3. Select board composition:
   - Default: CFO, CLO, Risk, CIO, Chief
   - Custom: Add/remove specific agent personas
4. Click "Begin Session"

### 4.2 During the Session
1. AI board members ask sequential questions
2. Each question targets a different weakness or assumption
3. User can respond to questions (optional)
4. Board members follow up based on responses
5. Session generates a difficulty score and preparation summary

### 4.3 Post-Session
1. Review full transcript
2. Download preparation report (PDF)
3. Identify top vulnerability areas
4. Practice responses to hardest questions
5. Archive session in CendiaLedger™

### 4.4 Via API
```bash
curl -X POST http://localhost:3001/api/v1/ghost-board/session \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "meetingType": "board",
    "topic": "Q3 APAC Expansion Proposal",
    "context": {
      "investmentAmount": 5000000,
      "expectedROI": "18% over 3 years",
      "risks": ["Currency volatility", "Regulatory uncertainty"],
      "stakeholders": ["Board of Directors", "Investors"]
    },
    "boardComposition": ["cfo", "clo", "risk", "cio", "chief"]
  }'
```

---

## 5. Board Member Personas

| Agent | Board Role | Question Focus |
|-------|-----------|----------------|
| Chief | Board Chair | Strategic alignment, vision |
| CFO | Finance Committee | ROI, cash flow, financial risk |
| CLO | Legal/Governance | Legal exposure, regulatory risk |
| Risk | Risk Committee | Enterprise risk, worst-case scenarios |
| CIO | Investment Committee | Capital allocation, market timing |

---

## 6. Session Types

| Type | Description | Typical Duration |
|------|-------------|-----------------|
| **Board Meeting** | Full board simulation | 15–30 min |
| **Investor Pitch** | Investor due diligence | 10–20 min |
| **Regulatory Review** | Regulatory scrutiny simulation | 10–20 min |
| **Internal Strategy** | Leadership team challenge | 10–15 min |

---

## 7. Pillar Dependencies

| Pillar | Role |
|--------|------|
| **Agents** | Board member AI personas |
| **Ethics** | Ethical challenge questions |
| **Predict** | Data-driven question generation |

---

## 8. Troubleshooting

| Issue | Cause | Resolution |
|-------|-------|------------|
| Questions too generic | Insufficient context | Provide more specific topic details |
| Session hangs | Large model loading | Wait for model load; use fast model for initial pass |
| Low difficulty score | Easy topic | Add known risks and sensitivities to context |
| No transcript generated | Session interrupted | Re-run session |

---

## 9. Verified Against

- `src/pages/cortex/intelligence/GhostBoardPage.tsx`: UI implementation
- `src/routes/cortex/intelligence.routes.tsx`: Route at `intelligence/ghost-board`
- `COMPLETE_SERVICE_MATRIX.md`: Ghost Board™ — $299/mo, Decision Intel, agents: Chief, CFO, CLO, Risk, CIO
- Pillar mapping: Agents, Ethics, Predict

---

*Datacendia, LLC — Proprietary and Confidential*
