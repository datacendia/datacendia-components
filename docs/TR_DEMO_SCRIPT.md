# Thomson Reuters Demo Script
## Complete Step-by-Step Walkthrough

**Duration:** 12 minutes core (+ optional deep-dives)  
**Login:** stuart@datacendia.com / DatacendiaOwner2024!  
**Base URL:** http://localhost:5173

> **Opening line:** "I'll show you the core in about 10 minutes, then we can go deeper anywhere you like."

> **TR Framing (15 seconds):** "Thomson Reuters already owns authoritative legal content. Datacendia is the layer that turns that content into verifiable inputs inside AI-assisted decisions — so when accountability arrives, the evidence already exists."

### Timing Overview
| Section | Time | Notes |
|---------|------|-------|
| Live Monitor | 2 min | Intent review, not logging |
| Council | 4 min | Structured challenge mechanism |
| Decision DNA | 3 min | Evidentiary proof |
| Regulator's Receipt | 2 min | One-click export |
| CendiaReplay | Optional | Only if asked |

---

## PRE-DEMO SETUP (5 minutes before)

### Checklist
- [ ] Docker Desktop running (check system tray)
- [ ] Backend running: `cd backend && npm run dev`
- [ ] Frontend running: `npm run dev` (root folder)
- [ ] Browser open to http://localhost:5173
- [ ] Logged in as Stuart Rainey
- [ ] Screen sharing ready

### Quick Verification
```
Backend health: http://localhost:3001/api/v1/health
Frontend: http://localhost:5173/cortex/monitor/live
```

---

## SECTION 1: CendiaPulse
**URL:** `/cortex/monitor/live`  
**Duration:** 2 minutes

### Navigation
1. Click **"Core Suite"** dropdown in header (🧠 icon)
2. Click **"The Council™"**
3. Click **"Live Monitor"** in the submenu

### What You See
- Real-time agent activity dashboard
- Active deliberations panel
- Agent status indicators (green = active, yellow = thinking, red = blocked)

### What to Say
> "This is our CendiaPulse. Every AI-assisted decision request appears here in real time — before execution — with who participated, what evidence was used, and what required human approvals are outstanding.
>
> Nothing executes without first passing governance. This is intent review before action, not logging after the fact."

### Actions to Demonstrate
1. **Point to** the active agents panel → "Each agent has a specific role - Legal Analyst, Risk Assessor, Compliance Officer"
2. **Point to** the decision badges (ALLOW/BLOCK/ESCALATE) → "Every action is evaluated in real-time"
3. **Click** the Pause button (top right) → "At any point, a human can pause the monitoring stream to review"

### Key Talking Points
- "This integrates directly with Westlaw for legal citations"
- "Every agent action creates an audit trail"
- "You can configure which agents participate in which decision types"
- "This runs in your environment (on-prem or private cloud). No training on customer data; no data leaves the boundary."

---

## SECTION 2: THE COUNCIL DELIBERATION
**URL:** `/cortex/council`  
**Duration:** 4 minutes

### Navigation
1. Click **"Core Suite"** dropdown in header
2. Click **"The Council™"**
3. Or direct URL: `/cortex/council`

### What You See
- Council deliberation interface
- Agent avatars in a "courtroom" layout
- Central deliberation area
- Voting/consensus panel

### What to Say
> "This is The Council - our multi-agent deliberation system. When a decision needs to be made, multiple AI agents with different expertise convene to deliberate.
>
> **This is not a virtual board replacing executives. It's a structured challenge mechanism that forces dissent to surface before humans decide. The default outcome is not approval — it's surfaced risk, recorded rationale, and required human sign-off.**
>
> Think of it as forcing every significant decision through Legal, Finance, Risk, and Compliance review - automatically, consistently, with full documentation."

### Actions to Demonstrate

#### Step 2.1: Start a New Deliberation
1. **Click** "New Deliberation" button (top right)
2. **Select** decision type: "Contract Review" (for TR demo)
3. **Enter** scenario:
   ```
   Should we proceed with the Thomson Reuters Westlaw + Practical Law integration
   under a 3-year $2.4M/year agreement, given data residency constraints,
   permitted use / training restrictions, and indemnity / limitation of liability terms?
   ```
4. **Click** "Begin Deliberation"

#### Step 2.2: Watch the Deliberation
> "Watch as each agent analyzes this from their perspective..."

**Point out each agent as they speak:**

| Agent | Role | What They Analyze |
|-------|------|-------------------|
| ⚖️ Legal Analyst | Contract terms, liability | "Legal is reviewing the indemnity clauses..." |
| 💰 Financial Advisor | ROI, budget impact | "Finance is calculating the 3-year TCO..." |
| ⚖️ Risk Assessor | Vendor risk, concentration risk | "Risk is evaluating vendor dependency..." |
| 📋 Compliance Officer | Regulatory requirements | "Compliance is verifying data residency requirements..." |

#### Step 2.3: Show Dissent Mechanism
> "Notice how agents can formally dissent. This isn't groupthink - if the Risk Assessor sees a problem, they register it, and that dissent becomes part of the permanent record."

1. **Point to** dissent indicators (if any appear)
2. **Click** on a dissent to show the reasoning

#### Step 2.4: Human Override
1. **Click** "Human Review Required" or "Pause Deliberation"
> "At any moment, I can inject human judgment. The AI recommends, but humans decide."

#### Step 2.5: Reach Consensus
1. Let deliberation complete OR **click** "Force Vote"
2. **Point to** the consensus indicator
> "The Council has reached a recommendation with a confidence score. Every agent's position is recorded."

### Key Talking Points
- "Westlaw citations are pulled in real-time during legal analysis"
- "Every deliberation creates a tamper-evident, versioned audit record"
- "Dissent is forced to surface - this prevents groupthink"

---

## SECTION 3: DECISION DNA
**URL:** `/cortex/intelligence/decision-dna`  
**Duration:** 3 minutes

### Navigation
1. Click **"Core Suite"** dropdown
2. Click **"Decision DNA™"** under Trust Layer
3. Or direct URL: `/cortex/intelligence/decision-dna`

### What You See
- Decision lineage visualization
- Merkle tree structure
- Input → Processing → Output chain
- Cryptographic hashes at each node

### What to Say
> "This is Decision DNA - the complete genetic code of every decision. You can trace exactly what data went in, how it was processed, which agents were involved, and what came out.
>
> This isn't just logging - it's a cryptographically verifiable record. If a regulator asks 'why did your AI make this decision?' - you hand them this.
>
> It's computationally impractical to alter without detection, because changing any node changes the root hash.
>
> We separate model output from authoritative sources — citations are provenance-tracked with hashes, so you can prove what came from Westlaw/Practical Law versus what was generated."

### Actions to Demonstrate

#### Step 3.1: Select a Decision
1. **Click** on a recent deliberation from the list
2. The DNA visualization loads

#### Step 3.2: Walk Through the Lineage
1. **Click** on "Input" node
> "Here's exactly what data was fed into the decision - the contract terms, the financial data, the risk factors."

2. **Click** on "Processing" nodes
> "Each agent's analysis is captured. You can see the Legal Analyst cited 3 Westlaw cases, the Financial model used a 5-year DCF."

3. **Click** on "Output" node
> "The final recommendation, the confidence score, and all supporting evidence."

#### Step 3.3: Show the Hash Chain
1. **Point to** the Merkle root hash
> "This hash is like DNA for the decision. If anyone tampers with any part of this record, the hash breaks."

2. **Click** "Verify Integrity"
> "We just verified this decision record hasn't been tampered with."

### Key Talking Points
- "This is designed to support SEC/FINRA recordkeeping expectations and defensible supervisory controls"
- "Designed to meet the evidentiary standards enterprise legal teams expect in litigation and regulatory review"
- "Integrates with your existing document management systems"

---

## SECTION 4: REGULATOR'S RECEIPT
**URL:** `/cortex/compliance/regulators-receipt`  
**Duration:** 2 minutes

### Navigation
1. Click **"Core Suite"** dropdown
2. Click **"Regulator's Receipt™"** under Trust Layer
3. Or direct URL: `/cortex/compliance/regulators-receipt`

### What You See
- Receipt generation interface
- Compliance framework selector
- One-click export options

### What to Say
> "This is our Regulator's Receipt generator. With one click, you generate an evidence package designed for regulatory review, audit, and litigation response. It's called a 'receipt' because it's what you can hand to audit or legal when they say, 'show me what happened.'
>
> When the SEC, FINRA, or any regulator asks 'show me your AI governance' - you don't scramble. You click a button."

### Actions to Demonstrate

#### Step 4.1: Select a Deliberation
1. **Click** "Select Deliberation" dropdown
2. **Choose** the deliberation from Section 2

#### Step 4.2: Choose Compliance Frameworks
1. **Check** the frameworks relevant to TR:
   - ☑️ SEC Regulation
   - ☑️ FINRA Requirements
   - ☑️ SOC 2 Type II
   - ☑️ ISO 42001 (AI Governance)

#### Step 4.3: Generate the Receipt
1. **Click** "Generate Receipt"
2. Watch the progress indicator
> "It's compiling all evidence, citations, agent deliberations, and cryptographic proofs..."

#### Step 4.4: Review the Receipt
1. **Scroll through** the generated receipt preview
> "This includes:
> - Executive summary
> - Complete deliberation transcript
> - All data sources with provenance
> - Cryptographic integrity proof
> - Regulatory framework mapping"

#### Step 4.5: Download the Package
1. **Click** "Download PDF" → Downloads the human-readable report
2. **Click** "Download Evidence Bundle" → Downloads the complete package

> "The PDF is for humans - lawyers, regulators, board members. The Evidence Bundle is machine-verifiable - it contains the raw data and cryptographic proofs."

### What to Download (Show These)
| File | Purpose |
|------|---------|
| `RegulatorsReceipt_[ID].pdf` | Human-readable compliance document |
| `EvidenceBundle_[ID].zip` | Complete evidence package with hashes |
| `MerkleProof_[ID].json` | Cryptographic verification data |

### Key Talking Points
- "This takes minutes, not weeks of reconstruction."
- "The tamper-evident verification means no one - not even us - can alter this after generation without detection."
- "This output is designed for the formats regulators and audit teams expect — and it's portable across SEC/FINRA-style examinations and international equivalents."

---

## SECTION 5: DECISION CendiaReplay (OPTIONAL)
**URL:** `/cortex/council/replay-theater`  
**Duration:** Only if asked

> **Note:** Only show this section if Legal, Audit, or regulator-minded people are present. Otherwise skip to closing.

### Navigation
1. Click **"Core Suite"** dropdown
2. Click **"CendiaReplay"** under The Council
3. Or direct URL: `/cortex/council/replay-theater`

### What You See
- Cinematic replay interface
- Timeline scrubber
- Agent position reconstruction
- Decision point highlights

### What to Say
> "This is our Decision CendiaReplay. You can replay any historical decision exactly as it happened - who said what, when, and why.
>
> Perfect for training, auditing, or understanding why a decision went a certain way six months ago."

### Actions to Demonstrate

#### Step 5.1: Select a Historical Decision
1. **Click** "Select Replay" dropdown
2. **Choose** a decision (ideally the one from Section 2)

#### Step 5.2: Play the Replay
1. **Click** the Play button (▶️)
2. Watch the agents deliberate in sequence
> "Watch as each agent's contribution plays back. Notice the timestamps - this is exactly how it happened."

#### Step 5.3: Use the Timeline
1. **Drag** the timeline scrubber
> "I can jump to any point. Let's see when the Risk Assessor raised their concern..."

2. **Click** on a decision point marker
> "These markers show pivotal moments - when consensus shifted, when new evidence was introduced."

#### Step 5.4: Show Annotations
1. **Click** "Show Annotations" toggle
> "We can add annotations for training purposes. 'This is where the Legal Analyst should have cited the additional case law.'"

### Key Talking Points
- "Perfect for regulatory examinations - show exactly what happened"
- "Training tool for improving decision quality"
- "Identifies patterns in decision-making over time"

---

## SECTION 6: CLOSING & WESTLAW INTEGRATION
**Duration:** 3 minutes

### What to Say
> "Let me bring this back to Thomson Reuters specifically.
>
> Every legal citation you saw in this demo came from Westlaw. When our Legal Analyst agent needs case law, it queries Westlaw in real-time. When it needs regulatory guidance, it pulls from Practical Law.
>
> What we're offering is:
> 1. **A governance layer** that makes Westlaw citations part of auditable AI decisions
> 2. **Compliance infrastructure** that proves AI decisions were legally informed
> 3. **A distribution and retention lever:** every governed enterprise workflow becomes a higher-value Westlaw/Practical Law integration with measurable ROI and defensibility
>
> **This same infrastructure can be used internally at Thomson Reuters to govern AI-assisted editorial workflows, regulatory analysis, and client-facing AI features.**
>
> The question isn't whether enterprises will use AI for decisions. They will. The question is whether those decisions will be legally defensible. That's where Thomson Reuters and Datacendia together become essential infrastructure."

### The Tier-1 Positioning Statement
> "Datacendia is not an AI product. It's the missing evidentiary layer that makes AI-assisted decisions legally survivable — and it turns authoritative content like Westlaw into verifiable inputs, not just references."

### Final Actions
1. **Navigate back** to the Council page
2. **Show** the Westlaw integration indicator in the agent panel
3. **Click** on any legal citation → Shows Westlaw source

---

## APPENDIX A: TROUBLESHOOTING

### If Backend Not Responding
```powershell
cd backend
npm run dev
```

### If Frontend Not Loading
```powershell
npm run dev
```

### If Redis Connection Error
1. Open Docker Desktop
2. Wait 30 seconds for containers to start
3. Restart backend

### If Agents Not Deliberating
- Check Ollama is running: `ollama list`
- Verify model loaded: Should show `llama3.2:3b`

---

## APPENDIX B: QUICK REFERENCE

### URLs
| Page | URL |
|------|-----|
| Live Monitor | `/cortex/monitor/live` |
| Council | `/cortex/council` |
| Decision DNA | `/cortex/intelligence/decision-dna` |
| Regulator's Receipt | `/cortex/compliance/regulators-receipt` |
| CendiaReplay | `/cortex/council/replay-theater` |

### Key Phrases to Use
- "Cryptographically verifiable record"
- "Evidence, not logs"
- "Human-in-the-loop governance"
- "Westlaw-powered legal intelligence"
- "One-click regulatory compliance"
- "Intent review before action"
- "Structured challenge mechanism"

### Phrases to Use Only If Asked
- "ISO 42001 compliant" (only if they ask about standards)
- "Court-admissible" (only if they ask about litigation)

### Phrases to Avoid
- "AI makes the decision" → Say "AI recommends, humans decide"
- "Automatic" → Say "Automated with human oversight"
- "Black box" → Say "Fully transparent and auditable"

---

## APPENDIX C: SAMPLE DELIBERATION SCENARIOS

### Scenario 1: Contract Review (Recommended for TR)
```
Should we proceed with the Thomson Reuters Westlaw + Practical Law integration
under a 3-year $2.4M/year agreement, given data residency constraints,
permitted use / training restrictions, and indemnity / limitation of liability terms?
```

### Scenario 2: M&A Due Diligence
```
Should we proceed with the acquisition of LegalTech Corp at 
the proposed $45M valuation given their pending litigation 
and regulatory compliance gaps?
```

### Scenario 3: Regulatory Response
```
How should we respond to the SEC inquiry regarding our AI 
trading algorithms and what documentation should we provide?
```

---

**Document Version:** 1.1 (TR-Optimized)  
**Last Updated:** February 3, 2026  
**Author:** Datacendia Platform Team
