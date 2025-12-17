# AI COUNCIL DELIBERATION WORKFLOW

## Overview
Multi-agent AI deliberation with cross-examination and synthesis.

## Flow Diagram

```
                              ┌─────────────┐
                              │ USER QUERY  │
                              └──────┬──────┘
                                     │
                                     ▼
                    ┌────────────────────────────┐
                    │    SELECT MODE             │
                    │ (War Room, Due Diligence,  │
                    │  Crisis, Innovation...)    │
                    └─────────────┬──────────────┘
                                  │
                                  ▼
                    ┌────────────────────────────┐
                    │    SELECT AGENTS           │
                    │ (Auto-select or Manual)    │
                    └─────────────┬──────────────┘
                                  │
═══════════════════════════════════════════════════════════
                    PHASE 1: INITIAL ANALYSIS
═══════════════════════════════════════════════════════════
                                  │
     ┌────────────────────────────┼────────────────────────────┐
     │              │             │             │              │
     ▼              ▼             ▼             ▼              ▼
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│ Chief👔 │   │ CFO 💰  │   │ COO ⚙️  │   │ CISO🔒  │   │ CMO 📢  │
└────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘
     │              │             │             │              │
     ▼              ▼             ▼             ▼              ▼
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│Strategic│   │Financial│   │Ops      │   │Security │   │Market   │
│Analysis │   │Analysis │   │Analysis │   │Analysis │   │Analysis │
└────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘
     │              │             │             │              │
     └──────────────┴─────────────┴─────────────┴──────────────┘
                                  │
═══════════════════════════════════════════════════════════
                    PHASE 2: CROSS-EXAMINATION
═══════════════════════════════════════════════════════════
                                  │
                                  ▼
     ┌────────────────────────────────────────────────────────┐
     │                                                         │
     │   CFO ────────► "I challenge COO's timeline"           │
     │        ◄─────── COO defends with data                  │
     │                                                         │
     │   CISO ───────► "Security risk in CMO proposal"        │
     │        ◄─────── CMO proposes mitigation                │
     │                                                         │
     │   Risk ───────► "CFO projections optimistic"           │
     │        ◄─────── CFO provides sensitivity analysis      │
     │                                                         │
     └────────────────────────────────────────────────────────┘
                                  │
═══════════════════════════════════════════════════════════
                    PHASE 3: SYNTHESIS
═══════════════════════════════════════════════════════════
                                  │
                                  ▼
                    ┌────────────────────────────┐
                    │     CHIEF STRATEGY 👔      │
                    │    Synthesizes all views   │
                    └─────────────┬──────────────┘
                                  │
                                  ▼
                    ┌────────────────────────────┐
                    │      FINAL DECISION        │
                    ├────────────────────────────┤
                    │ • Recommendation           │
                    │ • Confidence: 87%          │
                    │ • Key Risks                │
                    │ • Action Items             │
                    │ • Dissenting Views         │
                    └────────────────────────────┘
```

## Deliberation Modes

| Mode | Prime Directive | Lead Agent |
|------|-----------------|------------|
| **War Room** | Conflict before Consensus | Chief |
| **Due Diligence** | Verify everything twice | CFO |
| **Crisis** | Triage and Act | Chief |
| **Innovation Lab** | Yes, and... | CTO |
| **Compliance** | What could go wrong? | CISO |

## Agent Behaviors by Mode

### War Room Mode
- Security MUST attack Revenue's risky proposals
- Finance MUST challenge optimistic projections
- Operations MUST question unrealistic timelines
- Risk MUST quantify every threat mentioned

### Due Diligence Mode
- Every claim requires a source
- Confidence levels stated explicitly
- Red flags get dedicated analysis
- Unknown info flagged, not assumed
