# TR Demo Walkthrough - Step-by-Step UI Instructions

## Prerequisites

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
npm run dev

# Open browser
http://localhost:5173
```

**Login:** `stuart@datacendia.com` / `DatacendiaOwner2024!`

---

# DEMO 1: Live Deliberation with Dissent Recording

**Duration:** 3-4 minutes  
**Goal:** Show multi-agent reasoning with formal dissent capture

## Step-by-Step

### 1. Navigate to The Council
- Click **Core Suite** dropdown (🧠 icon) in header
- Select **The Council™**
- Or go directly to: `http://localhost:5173/cortex/council`

### 2. Start a New Deliberation
- In the text input at bottom, type a legal question:
  ```
  Should we proceed with the acquisition of TechCorp given the pending 
  antitrust investigation? Consider regulatory risk, timeline impact, 
  and alternative deal structures.
  ```
- Select **Council Mode**: Choose "M&A Due Diligence" or "Risk Assessment"
- Click **Ask Council** or press Enter

### 3. Watch the Deliberation Unfold
**Talking points while agents respond:**
> "Watch the agents deliberate in real-time. Each has a specialized perspective - CFO focuses on financial risk, Legal Counsel on regulatory exposure, Strategy on competitive implications."

### 4. Point Out Dissent (If It Occurs)
- Look for agents with ⚠️ or different colored responses
- If an agent dissents, highlight it:
> "See that? The Legal Counsel agent just formally dissented. That dissent is now cryptographically recorded. If this decision is ever challenged, we can prove the concern was raised."

### 5. Show the Deliberation Summary
- After completion, scroll to see:
  - Confidence score
  - Agent contributions
  - Any dissent records
  - Final recommendation

**Key line:**
> "Every agent contribution, every dissent, every piece of reasoning is captured. This isn't a chat log - it's an evidence artifact."

---

# DEMO 2: Decision DNA Export + Verification

**Duration:** 3-4 minutes  
**Goal:** Show cryptographic audit trail generation

## Step-by-Step

### 1. Navigate to Decision DNA
- Click **Trust Layer** dropdown (🛡️ icon) in header
- Select **Decision DNA™** (🧬 icon)
- Or go directly to: `http://localhost:5173/cortex/intelligence/decision-dna`

### 2. Select a Completed Decision
- You'll see a list of decisions with status indicators
- Click on one marked **"Decided"** (green status)
- Sample: "Q2 Market Expansion Strategy"

### 3. View the Decision Timeline
**Talking points:**
> "This is the full lifecycle of a decision. Every event is timestamped and hashed."

Point out:
- 🎯 **Created** - When decision was initiated
- 📝 **Context Added** - Documents and research attached
- 💀 **Pre-Mortem Run** - Risk analysis performed
- 🏛️ **Council Session** - AI deliberation with agent contributions
- ✅ **Decision Made** - Final outcome recorded

### 4. Show the Audit Hash
- Scroll to bottom of decision detail
- Point to the **Audit Hash** field
> "This hash is a cryptographic fingerprint. If anyone changes a single character in this decision record, the hash breaks. Tamper-evident by design."

### 5. Export Decision DNA Bundle
- Click **Export DNA Bundle** button (or similar)
- Show the JSON output with:
  - `merkleRoot` - Integrity proof
  - `hashChain` - Linked hashes
  - `agentContributions` - Who said what
  - `dissents` - Formal disagreements
  - `signatures` - Approval records

**Key line:**
> "Hand this to opposing counsel, a regulator, or a court. They can verify it themselves without our servers. The math proves it wasn't tampered with."

### 6. Verify Integrity (API Demo - Optional)
If you want to show API verification:
```bash
# In terminal
curl -X POST http://localhost:3001/api/v1/sovereign-arch/dna/verify \
  -H "Content-Type: application/json" \
  -d @decision_dna.json
```

Show output:
```json
{
  "valid": true,
  "merkleRoot": "abc123...",
  "integrityCheck": "passed"
}
```

---

# DEMO 3: Bit-Perfect Replay

**Duration:** 2-3 minutes  
**Goal:** Show deterministic reproducibility

## Step-by-Step

### 1. Navigate to CendiaReplay
- Click **Core Suite** dropdown (🧠 icon) in header
- Select **CendiaReplay** (🎬 icon)
- Or go directly to: `http://localhost:5173/cortex/council/replay-theater`

### 2. Select a Past Deliberation
- You'll see a list of completed deliberations
- Look for one with:
  - Multiple agents (6-10)
  - Good duration (10+ minutes)
  - Interesting outcome
- Click to select it

### 3. Start Playback
- Click the **Play** button (▶️)
- Watch the deliberation replay frame-by-frame

**Talking points:**
> "This isn't a recording. We're replaying the actual deliberation with the exact same inputs, random seeds, and model state. The output is bit-for-bit identical to the original."

### 4. Use Playback Controls
- **Pause** at key moments
- **Speed up** (2x, 4x) to show progression
- **Skip** to specific frames
- **Rewind** to show a key statement again

### 5. Point Out Key Moments
- **Agent statements** - Show reasoning
- **Dissent markers** - Highlight disagreements
- **Consensus formation** - Show how agreement emerged
- **Final decision** - The outcome

### 6. Explain the Litigation Value
**Key line:**
> "If this decision goes to litigation in 5 years, we can replay it exactly. Same inputs, same outputs, forever. No other legal AI can do this. Harvey can't. CoCounsel can't."

### 7. Export Options (Optional)
- Show export options:
  - **JSON** - Raw data
  - **Video Script** - For presentations
  - **PDF Report** - For compliance

---

# DEMO 4: Regulator's Receipt (Bonus)

**Duration:** 1-2 minutes  
**Goal:** Show one-click compliance documentation

## Step-by-Step

### 1. Navigate to Regulator's Receipt
- Click **Trust Layer** dropdown (🛡️ icon)
- Select **Regulator's Receipt** (📜 icon)
- Or go directly to: `http://localhost:5173/cortex/compliance/regulators-receipt`

### 2. Select a Deliberation
- Choose a completed deliberation from the list

### 3. Generate Receipt
- Click **Generate Receipt** button
- Watch the system compile:
  - Merkle tree evidence chain
  - All agent contributions
  - Dissent records
  - Cryptographic signatures
  - Policy compliance mapping

### 4. Show the Output
**Key line:**
> "One click. Evidence package designed for regulatory review. This is what you hand to the SEC, the DOJ, or a congressional oversight committee."

---

# Quick Reference: Navigation Paths

| Feature | Header Dropdown | Direct URL |
|---------|-----------------|------------|
| The Council | Core Suite → The Council™ | `/cortex/council` |
| Decision DNA | Trust Layer → Decision DNA™ | `/cortex/intelligence/decision-dna` |
| CendiaReplay | Core Suite → CendiaReplay | `/cortex/council/replay-theater` |
| Regulator's Receipt | Trust Layer → Regulator's Receipt | `/cortex/compliance/regulators-receipt` |
| Chronos | Core Suite → CendiaChronos™ | `/cortex/intelligence/chronos` |

---

# Troubleshooting

### "No deliberations available"
- Run demo seed: `curl -X POST http://localhost:3001/api/v1/demo-seed/all`
- Or create a new deliberation in The Council

### "Backend not responding"
- Check terminal running `npm run dev` in `/backend`
- Verify port 3001 is not in use

### "Agents not responding"
- Check Ollama is running: `ollama list`
- Verify model is available: `ollama pull llama3.2`

### "Login fails"
- Use: `stuart@datacendia.com` / `DatacendiaOwner2024!`
- Check database is seeded

---

# Recommended Demo Order

1. **The Council** (2 min) - Show live deliberation
2. **Decision DNA** (3 min) - Show audit trail + verification
3. **CendiaReplay** (2 min) - Show reproducibility
4. **Mention Air-Gap** (30 sec) - "All of this runs offline"

**Total: 7-8 minutes** - leaves time for questions

---

*Last updated: January 2026*
