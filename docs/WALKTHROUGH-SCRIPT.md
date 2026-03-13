# DATACEND!A Platform — Complete Demo Walkthrough Script

> **Purpose:** Structured walkthrough for high-stakes demos to Thomson Reuters, FIFA, UEFA, Celtic FC, LUX, VCs, investors, and enterprise prospects.
>
> **Core Pitch:** *"We don't help you analyze data. We make your most controversial decisions defensible under scrutiny."*
>
> **Do NOT showcase:** Fantasy AI predicting match winners, player performance analytics, generic "AI dashboard."
>
> **DO showcase:** Multi-agent deliberation, cryptographic audit trails, sovereign deployment, regulatory defensibility.

---

## Pre-Demo Checklist

- [ ] Platform running at `http://localhost:5173`
- [ ] Backend running with Council API active
- [ ] Demo user logged in (stuart@datacendia.com)
- [ ] Browser in fullscreen / presentation mode
- [ ] Close all unrelated tabs
- [ ] Pre-load key pages in separate tabs for fast switching

---

## Act 1: The Login Experience (2 min)

**URL:** `/login`

### Script

> "Before we get into the platform, notice the login screen. This isn't a SaaS login. Every deployment runs on YOUR infrastructure — on-premises, private cloud, or air-gapped. The SSO options you see — Active Directory, SAML, OIDC, Certificate Auth — these connect to YOUR identity provider. We never see your credentials."

**Key points to hit:**
- Enterprise SSO integration (not consumer OAuth)
- Air-gap ready deployment model
- Compliance footer: SOC 2, ISO 27001, HIPAA, NIST 800-53
- "Your decisions. Your infrastructure. Your proof."

**Action:** Log in → navigate to Dashboard.

---

## Act 2: The Dashboard (3 min)

**URL:** `/cortex/dashboard`

### Script

> "This is the Cortex dashboard — the central nervous system. Every decision flowing through your organization passes through here. What you're seeing is not analytics — it's a decision audit surface. Every card represents a live decision with full lineage tracking."

**Key points:**
- Decision volume and status at a glance
- Active deliberations in progress
- Risk scores and confidence levels
- Quick access to all platform capabilities via the navigation

**Transition:** "Let me show you what happens when a real decision needs to be made."

---

## Act 3: The Council™ — Multi-Agent Deliberation (8 min)

**URL:** `/cortex/council`

### Script

> "This is The Council. When you submit a question — not a query, a *decision* — we don't send it to one AI. We assemble a panel of specialized AI agents, each with a distinct perspective: a CFO advisor, a risk analyst, a legal counsel, a compliance officer. They deliberate. They disagree. They cite evidence. And every word is cryptographically recorded."

### Live Demo Flow

1. **Show existing deliberations** — point out completed ones with confidence scores
2. **Use the Quick-Start Scenario Templates** — when the textarea is empty, audience-specific buttons appear below it (Thomson Reuters, FIFA/UEFA, Celtic FC, Luxury/ESG, VC Investment, M&A Strategy). Click the relevant one to pre-load the question.
3. **Start the deliberation** — watch agents respond in real-time, highlight dissent when it occurs
4. **Show the final synthesis** — emphasize it captures disagreement, not just consensus

**Key points:**
- Agents have roles, not just names — roles ARE identity
- Dissent is a feature, not a bug — every dissenting opinion is preserved
- Confidence scores reflect genuine uncertainty
- Every response is individually hashed

**Transition:** "Now, what happens when an auditor or regulator asks you to prove this decision was sound?"

---

## Act 4: CendiaProvenance™ (6 min)

**URL:** `/cortex/intelligence/audit-provenance`

### Script

> "This is CendiaProvenance — the answer to 'prove it.' It combines two capabilities: Decision Lineage, which gives you the full lifecycle of every decision from inception through deliberation to outcome, and Evidence Export, which generates forensic-grade, independently verifiable documentation with cryptographic proof."

### Demo Flow — Decision Lineage Tab

1. **Select a completed decision** from the list
2. **Walk through the timeline** — creation → context added → pre-mortem → council session → ghost board → decision made
3. **Expand a council session** — show individual agent stances and confidence
4. **Point out the audit hash** at the bottom

### Demo Flow — Evidence Export Tab

1. **Switch to Evidence Export tab**
2. **Select a deliberation** and generate a receipt
3. **Walk through the tabs:**
   - **Overview** — Decision summary, participants, dissent markers
   - **Evidence Chain** — Merkle root, deliberation hash, citations hash
   - **Compliance** — Mapped frameworks (SOX, GDPR, Basel III, etc.)
   - **Cryptographic Proof** — Algorithm, receipt hash, signing key
4. **Click Download PDF** (or Print)

### Script (closing)

> "When the auditor asks 'prove it,' you hand them this. Cryptographically signed, Merkle-tree verified, mapped to every applicable compliance framework. This isn't a report we generated after the fact — it's a tamper-evident record that was building from the moment the decision was initiated."

---

## Act 5: CendiaPreMortem (4 min)

**URL:** `/cortex/intelligence/pre-mortem`

### Script

> "Before any major decision is finalized, we run a Pre-Mortem. The system assumes the decision has already failed and works backwards to find out why. It identifies failure modes, assigns probability and cost impact, and categorizes risk."

**Demo Flow:**
1. Show a pre-mortem result with identified failure modes
2. Highlight the risk matrix — probability vs. impact
3. Point out actionable mitigations
4. "This isn't pessimism. This is preparation."

---

## Act 6: Ghost Board™ (3 min)

**URL:** `/cortex/intelligence/ghost-board`

### Script

> "Ghost Board simulates a board review before it happens. AI agents role-play as your board chair, lead investor, independent directors. They ask the hard questions you haven't prepared for. Your preparedness score tells you whether you're ready for the real meeting."

**Key points:**
- Questions categorized by difficulty
- Tracks which questions you can answer vs. can't
- Preparedness score is honest (don't inflate)
- "Better to sweat in training than bleed in battle"

---

## Act 7: Audience-Specific Scenarios

### 7A. Thomson Reuters Demo

**Focus:** Regulatory compliance, financial crime, AML/KYC

**Recommended Council Question:**
> "$2.5M PEP Transfer to Viktor Petrov (Cyprus) — Basel III Compliance Review"

**Demo Path:**
1. Council → Submit Petrov transfer question
2. Watch compliance agents deliberate (highlight Risk Analyzer dissent)
3. CendiaProvenance → Evidence Export → Generate Regulator's Receipt
4. Show compliance mapping: Basel III, SEC 17a-4, FINRA 3310
5. Pre-Mortem → Show regulatory exposure analysis

**Key talking points:**
- "Every financial decision has a cryptographic receipt"
- "Dissent from the Risk Analyzer is preserved — regulators see we considered the risk"
- "This deploys behind YOUR firewall — Thomson Reuters data never leaves your infrastructure"

---

### 7B. FIFA / UEFA Demo

**URL:** `/cortex/verticals/sports/fifa-scenarios`

**Focus:** Transfer governance, match integrity, regulatory defensibility

**Recommended Scenarios (pick 2):**
1. **The Controversial Transfer** — $85M transfer with third-party ownership concerns
2. **Match-Fixing Intelligence** — Suspicious betting pattern investigation
3. **Financial Fair Play Breach** — Club exceeding wage-to-revenue limits

**Demo Path:**
1. Sports Governance Dashboard → FIFA/UEFA Governance Scenarios
2. Walk through a scenario — show how The Council deliberates on governance
3. Show the Regulator's Receipt for the decision
4. "When CAS (Court of Arbitration for Sport) asks why this transfer was approved, here's the evidence packet"

**Key talking points:**
- "We don't predict who wins matches. We make governance decisions defensible."
- "Every transfer decision has a cryptographic audit trail"
- "When FIFA's compliance committee asks 'who approved this and why,' the answer is here"
- "Deploy in Zurich, on FIFA's infrastructure, air-gapped from the public internet"

---

### 7C. Celtic FC / Club-Level Demo

**URL:** `/cortex/verticals/sports`

**Focus:** Transfer committee decisions, contract negotiations, regulatory compliance

**Recommended Council Question:**
> "Should Celtic FC proceed with the £12M acquisition of [Player X] given current FFP constraints, squad depth requirements, and January transfer window timing?"

**Demo Path:**
1. Sports Governance Dashboard → Show club-level transfer governance
2. Council → Submit transfer decision
3. Show agents: Sporting Director AI, Financial Advisor, Legal Counsel, Scout Analyst
4. Pre-Mortem → "What if the player fails the medical?" / "What if the selling club raises the price?"
5. CendiaProvenance → Generate evidence packet for board review

**Key talking points:**
- "Your transfer committee gets AI-assisted deliberation, not AI-replaced decision making"
- "Every board member sees exactly why the recommendation was made, including dissent"
- "When UEFA asks for your FFP documentation, it's one click"

---

### 7D. LUX / Luxury & High-Value Demo

**Focus:** Supply chain governance, authentication, ESG compliance

**Recommended Council Question:**
> "Should LUX proceed with sourcing raw materials from Supplier X given recent human rights allegations in their supply chain?"

**Demo Path:**
1. Council → Submit supply chain governance question
2. Watch ESG/compliance agents deliberate
3. Pre-Mortem → Supply chain disruption risks
4. CendiaProvenance → Evidence packet for ESG reporting
5. "When your sustainability report is audited, every sourcing decision is documented"

**Key talking points:**
- "Luxury brands live and die by reputation. Every decision needs to be defensible."
- "ESG isn't just reporting — it's proving every decision in the supply chain was ethical"
- "Deploy on your infrastructure — your supply chain intelligence stays sovereign"

---

### 7E. VC / Investor Demo

**Focus:** Due diligence, portfolio governance, risk management

**Recommended Council Question:**
> "Should the fund proceed with a $15M Series B investment in [Company X] given current market conditions, competitive landscape, and founder concerns?"

**Demo Path:**
1. Council → Submit investment decision
2. Show multi-agent due diligence: Market Analyst, Financial Advisor, Legal, Risk
3. Ghost Board → Simulate LP advisory committee review
4. Pre-Mortem → "What if the market corrects 30% in 6 months?"
5. CendiaProvenance → Investment committee documentation

**Key talking points:**
- "Every investment decision your fund makes has a defensible audit trail"
- "When LPs ask why you invested in X, the entire deliberation is cryptographically preserved"
- "This isn't a spreadsheet. This is institutional-grade DDGI."
- "We're not another AI tool. We're the governance layer your fund is missing."

---

### 7F. General Enterprise / Corporate Demo

**Focus:** Strategic decisions, M&A, restructuring, compliance

**Recommended Council Question:**
> "Should we proceed with the acquisition of [Company Y] for $50M given regulatory approval risks, integration complexity, and current cash position?"

**Demo Path:**
1. Council → Submit strategic decision
2. Full deliberation with C-suite AI agents
3. Pre-Mortem → Integration risks, regulatory risks, culture clash
4. Ghost Board → Simulate board of directors review
5. CendiaProvenance → Full decision packet for legal/compliance

---

## Act 8: Platform Differentiators (2 min)

Close every demo with these points:

### Sovereign Deployment
> "Everything you've seen runs on YOUR infrastructure. On-premises, private cloud, air-gapped. We don't see your data. We don't host your decisions. We deploy the platform and you own everything."

### Cryptographic Integrity
> "Every decision, every agent response, every dissenting opinion — cryptographically hashed, Merkle-tree verified. No one can alter the record after the fact. Not even us."

### Regulatory Readiness
> "SOX, GDPR, Basel III, EU AI Act, HIPAA, NIST 800-53 — the platform maps every decision to applicable frameworks automatically. One-click evidence export for any auditor."

### The Council is Not Consensus
> "We don't optimize for agreement. We optimize for defensibility. Dissent is preserved. Uncertainty is quantified. The record shows what was considered, not just what was decided."

---

## Closing Script

> "Datacendia doesn't replace your decision makers. We give them the most rigorously documented, adversarially tested, cryptographically proven decision support system ever built. And it runs entirely on your infrastructure."

> "The question isn't whether you need AI for decisions. The question is: when the auditor, the regulator, or the board asks 'prove it' — can you?"

---

## Timing Guide

| Section | Duration | Cumulative |
|---------|----------|------------|
| Login | 2 min | 2 min |
| Dashboard | 3 min | 5 min |
| The Council | 8 min | 13 min |
| CendiaProvenance | 6 min | 19 min |
| Pre-Mortem | 4 min | 23 min |
| Ghost Board | 3 min | 26 min |
| Audience Scenario | 8 min | 34 min |
| Differentiators + Close | 4 min | 38 min |
| **Q&A Buffer** | **12 min** | **50 min** |

**Total: 50 minutes** (fits a 1-hour meeting with buffer)

---

## Quick Reference: Audience → Scenario Mapping

| Audience | Primary Scenario | Key URL |
|----------|-----------------|---------|
| Thomson Reuters | Petrov PEP Transfer | `/cortex/council` |
| FIFA | Match-fixing / Transfer governance | `/cortex/verticals/sports/fifa-scenarios` |
| UEFA | FFP breach / Club licensing | `/cortex/verticals/sports/fifa-scenarios` |
| Celtic FC | Transfer acquisition decision | `/cortex/verticals/sports` |
| LUX | Supply chain ESG governance | `/cortex/council` |
| VCs / Investors | Investment committee decision | `/cortex/council` |
| Enterprise | M&A / Strategic decision | `/cortex/council` |
| Sports Teams | Transfer + regulatory compliance | `/cortex/verticals/sports` |

---

*Document Version: 1.0 — Last Updated: June 2025*
*Prepared for: Datacendia Demo Team*
