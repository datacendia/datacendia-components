# DEMO WALKTHROUGH — STEP BY STEP

**Exact navigation instructions for the flagship demo**

---

## PREREQUISITES

### Start the Platform

1. **Start Backend:**
   ```powershell
   cd C:\Users\Stu\Documents\datacendia-components\datacendia-components\backend
   npm run dev
   ```
   Wait for: `🚀 Server running on port 3001`

2. **Start Frontend:**
   ```powershell
   cd C:\Users\Stu\Documents\datacendia-components\datacendia-components
   npm run dev
   ```
   Wait for: `Local: http://localhost:5173`

3. **Open Browser:**
   Navigate to: `http://localhost:5173`

4. **Login:**
   - Click **"Login"** (top right) or go to `/login`
   - Email: `stuart@datacendia.com`
   - Password: `DatacendiaOwner2024!`
   - Click **"Sign In"**

---

## DEMO STEP 1: "Here is a credit decision regulators already inspect."

**Purpose:** Establish familiarity. This is their world.

### Navigation:
1. From Dashboard, click **"Council"** in left sidebar
   - URL: `/cortex/council`

2. Click **"New Deliberation"** button (top right)

3. In the deliberation form:
   - **Question:** "Should we approve a $10M working capital facility for Acme Manufacturing Corp?"
   - **Mode:** Select **"Credit Committee"** from dropdown
   - **Tags:** Add "credit", "commercial", "manufacturing"

4. Click **"Start Deliberation"**

### What to Say:
> "This is a $10M working capital facility for a manufacturing company. Your credit committee approved it six months ago. The OCC is now asking questions."

---

## DEMO STEP 2: "Here is how it fails today."

**Purpose:** Create discomfort. This is the pain they live with.

### Navigation:
**No navigation needed** — This is narrative only.

### What to Say:
> "When the examiner asks 'Why was this approved?', your team spends two weeks reconstructing the decision from emails, committee minutes, model outputs, and analyst notes."

> "The PD model has been updated twice since then. The analyst who wrote the memo left. The committee chair doesn't remember the discussion."

> "Examiners know this. They've seen it a hundred times."

---

## DEMO STEP 3: "Here is what Datacendia produces instead."

**Purpose:** Show the artifact. Let it speak for itself.

### Navigation:

#### Option A: From the Deliberation You Just Created
1. After deliberation completes, you'll see the **Deliberation View** page
   - URL: `/cortex/council/deliberation/{deliberationId}`

2. Click **"Export"** button (top right)

3. Select **"Regulator Packet"** from export options

4. Click **"Generate"**

#### Option B: From Decision Packets Page
1. Click **"Governance"** in left sidebar
2. Click **"Decision Packets"**
   - URL: `/cortex/governance/decision-packets`

3. Find the decision in the list

4. Click **"View Packet"** or **"Export"**

#### Option C: From Regulator's Receipt Generator
1. Click **"Compliance"** in left sidebar
2. Click **"Regulator's Receipt"**
   - URL: `/cortex/compliance/regulators-receipt`

3. Select the decision from dropdown

4. Select framework: **"Basel III"** or **"SR 11-7"**

5. Click **"Generate Receipt"**

### What to Show:
Walk through the packet sections:
- **Decision Summary** — Who, what, when
- **Risk Inputs** — All data with timestamps and model versions
- **Policy Constraints** — What was evaluated
- **Deliberation Record** — Who said what, why
- **Approval Chain** — Signatures
- **Compliance Mapping** — Basel III, SR 11-7 controls

### What to Say:
> "At the moment of decision, Datacendia captures everything: the inputs, the model outputs, the policy constraints, the deliberation, the approvals, the dissent if any, and a cryptographic hash that proves nothing has changed."

---

## DEMO STEP 4: "Here is how it replays, identically, six months later."

**Purpose:** This is the moment of realization. They've never seen this before.

### Navigation:
1. Click **"Council"** in left sidebar

2. Click **"Replay Theater"**
   - URL: `/cortex/council/replay-theater`

3. Select the decision from the dropdown or search

4. Click **"Load Decision"**

5. Click **"Replay"** button

### What to Show:
- The replay running step-by-step
- Same inputs, same model versions, same policies
- Identical output
- Hash verification showing match

### What to Say:
> "When the examiner asks 'Would you make the same decision today?', you don't guess. You replay it. Same inputs, same models, same policies. Bit-perfect reproduction."

> "This is not a summary. This is the actual decision, re-executed."

---

## DEMO STEP 5: "Here is the dissent that saved you in court."

**Purpose:** Show the long-term value. This is insurance they didn't know they could buy.

### Navigation:
1. Click **"Enterprise"** in left sidebar

2. Click **"Dissent"**
   - URL: `/cortex/enterprise/dissent`

3. Show the dissent dashboard with:
   - Active dissents
   - Response status
   - Accuracy tracking

4. Click on a specific dissent to show:
   - Original statement
   - Supporting evidence
   - Management response
   - Ledger hash (immutable)

### Alternative: Show Dissent in Decision Packet
1. Go back to the decision packet from Step 3

2. Scroll to **"Dissent Record"** section

3. Show how dissent is preserved with the decision

### What to Say:
> "Your adversarial reviewer flagged a concern about revenue concentration. The committee acknowledged it and added a covenant."

> "Three years later, when the borrower defaults and litigation begins, you have contemporaneous evidence that the risk was identified, discussed, and mitigated."

> "Not reconstructed. Recorded."

---

## QUICK REFERENCE — ALL URLS

| Demo Step | Page | URL |
|-----------|------|-----|
| Login | Login Page | `/login` |
| 1. Credit Decision | Council | `/cortex/council` |
| 1. New Deliberation | Council (modal) | `/cortex/council` → "New Deliberation" |
| 3. Decision Packets | Governance | `/cortex/governance/decision-packets` |
| 3. Regulator's Receipt | Compliance | `/cortex/compliance/regulators-receipt` |
| 4. Replay Theater | Council | `/cortex/council/replay-theater` |
| 5. Dissent | Enterprise | `/cortex/enterprise/dissent` |

---

## SIDEBAR NAVIGATION MAP

```
CORTEX (Main App)
├── Dashboard                    /cortex
├── Council                      /cortex/council
│   ├── Deliberations           /cortex/council
│   ├── Visualization           /cortex/council/visualization
│   └── Replay Theater          /cortex/council/replay-theater
├── Decisions                    /cortex/decisions
├── Governance
│   └── Decision Packets        /cortex/governance/decision-packets
├── Compliance
│   └── Regulator's Receipt     /cortex/compliance/regulators-receipt
├── Enterprise
│   ├── Financial               /cortex/enterprise/financial
│   ├── Dissent                 /cortex/enterprise/dissent
│   ├── Responsibility          /cortex/enterprise/responsibility
│   └── Evidence Vault          /cortex/enterprise/evidence-vault
├── Intelligence
│   ├── Decision DNA            /cortex/intelligence/decision-dna
│   └── Chronos                 /cortex/intelligence/chronos
└── Sovereign
    ├── Crucible                /cortex/sovereign/crucible
    └── Panopticon              /cortex/sovereign/panopticon
```

---

## BUTTONS TO CLICK (IN ORDER)

| Step | Button/Link | Location |
|------|-------------|----------|
| Login | "Sign In" | Login page |
| 1 | "Council" | Left sidebar |
| 1 | "New Deliberation" | Top right of Council page |
| 1 | "Start Deliberation" | Bottom of modal |
| 3 | "Export" | Top right of Deliberation view |
| 3 | "Regulator Packet" | Export dropdown |
| 3 | "Generate" | Export modal |
| 4 | "Replay Theater" | Council submenu |
| 4 | "Load Decision" | Replay Theater page |
| 4 | "Replay" | Replay controls |
| 5 | "Enterprise" | Left sidebar |
| 5 | "Dissent" | Enterprise submenu |

---

## CLOSING

After Step 5, return to the decision packet and say:

> "Datacendia doesn't make decisions for you. Your people, your models, your policies, your authority. We just make sure that when someone asks 'Why did you decide this?', you have an answer that holds up."

---

**Leave-behind:**
- Exhibit A (the redacted credit decision packet)
- One-page summary (CANONICAL_POSITIONING.md)

Nothing else. Let the artifact do the selling.
