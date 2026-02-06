# DATACENDIA DEMO FLOW

**Purpose:** Institutional sales demonstration  
**Audience:** CRO, Model Risk, Internal Audit, Regulators, Tier-1 VCs  
**Duration:** 15-20 minutes

---

## Core Principle

**Institutions buy relief, not capability.**

Do not show features. Show the problem they have, then show it solved.

---

## Demo Sequence (Non-Negotiable)

### 1. "Here is a credit decision regulators already inspect."

**Show:** A standard commercial credit approval scenario.

> "This is a $10M working capital facility for a manufacturing company. Your credit committee approved it six months ago. The OCC is now asking questions."

**Purpose:** Establish familiarity. This is their world.

---

### 2. "Here is how it fails today."

**Show:** The current state of decision documentation.

> "When the examiner asks 'Why was this approved?', your team spends two weeks reconstructing the decision from emails, committee minutes, model outputs, and analyst notes. The PD model has been updated twice since then. The analyst who wrote the memo left. The committee chair doesn't remember the discussion."

**Key points:**
- Post-hoc reconstruction is expensive
- Model versions change
- People leave
- Memory is unreliable
- Examiners know this

**Purpose:** Create discomfort. This is the pain they live with.

---

### 3. "Here is what Datacendia produces instead."

**Show:** Exhibit A — The Regulator-Grade Credit Decision Packet

> "At the moment of decision, Datacendia captures everything: the inputs, the model outputs, the policy constraints, the deliberation, the approvals, the dissent if any, and a cryptographic hash that proves nothing has changed."

**Walk through:**
- Decision summary
- Risk inputs with timestamps and model versions
- Policy constraints evaluated
- Deliberation record (who said what, why)
- Approval chain with signatures
- Compliance mapping (Basel III, SR 11-7)

**Purpose:** Show the artifact. Let it speak for itself.

---

### 4. "Here is how it replays, identically, six months later."

**Show:** Deterministic replay capability

> "When the examiner asks 'Would you make the same decision today?', you don't guess. You replay it. Same inputs, same models, same policies. Bit-perfect reproduction."

**Demonstrate:**
- Click "Replay Decision"
- Show identical output
- Show hash verification

> "This is not a summary. This is the actual decision, re-executed."

**Purpose:** This is the moment of realization. They've never seen this before.

---

### 5. "Here is the dissent that saved you in court."

**Show:** Dissent capture and preservation

> "Your adversarial reviewer flagged a concern about revenue concentration. The committee acknowledged it and added a covenant. Three years later, when the borrower defaults and litigation begins, you have contemporaneous evidence that the risk was identified, discussed, and mitigated. Not reconstructed. Recorded."

**Key points:**
- Dissent is preserved, not buried
- Management response is documented
- This is discoverable evidence in your favor

**Purpose:** Show the long-term value. This is insurance they didn't know they could buy.

---

## What NOT to Show

- ❌ Dashboards (they have dashboards)
- ❌ Agent architecture (they don't care)
- ❌ Technical diagrams (save for implementation)
- ❌ Feature lists (save for RFP response)
- ❌ Other verticals (stay focused)
- ❌ AI capabilities (invites skepticism)

---

## Closing Statement

> "Datacendia doesn't make decisions for you. Your people, your models, your policies, your authority. We just make sure that when someone asks 'Why did you decide this?', you have an answer that holds up."

---

## Objection Handling

### "We already document our decisions."

> "You document decisions after they're made. We capture them as they're made. The difference is the examiner's confidence in what they're reading."

### "Our models are already validated under SR 11-7."

> "SR 11-7 validates models. It doesn't validate decisions. A validated model can still produce a bad decision if the inputs were wrong, the policy was misapplied, or the override wasn't documented. We close that gap."

### "This seems like a lot of overhead."

> "The overhead is invisible. Datacendia runs alongside your existing workflow. Your credit officers don't change how they work. They just get better evidence at the end."

### "What about AI risk? Are you making decisions for us?"

> "No. We are explicitly not a decision-maker. We are a verification layer. Your people decide. We prove they decided correctly."

---

## Leave-Behind

After the demo, leave them with:

1. **Exhibit A** — The redacted credit decision packet
2. **One-page summary** — What Datacendia does (from CANONICAL_POSITIONING.md)

Nothing else. No feature sheets. No architecture diagrams.

Let the artifact do the selling.

---

**Document Owner:** Stuart  
**Last Updated:** January 26, 2026  
**Status:** APPROVED FOR USE
