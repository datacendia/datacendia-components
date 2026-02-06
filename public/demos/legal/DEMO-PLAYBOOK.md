# Legal Vertical Demo Playbook
## Waymo v. Uber Trade Secret Case

**Duration:** 15-20 minutes  
**Audience:** Law firms, corporate legal departments, legal tech buyers

---

## Pre-Demo Setup

1. **Start the platform** with Legal vertical filter:
   ```
   http://localhost:5173/council?vertical=legal
   ```

2. **Have ready:**
   - `waymo-v-uber-brief.md` (in this folder)
   - Caselaw API token (optional, for live case lookup)

3. **Ensure Ollama is running** with at least `qwen2.5:14b` model

---

## Demo Script

### Opening (30 seconds)

> "Let me show you how Datacendia's AI Council can transform legal analysis. We're going to analyze a real case - Waymo versus Uber, the billion-dollar trade secret dispute - and I'll walk you through exactly how your team would use this."

---

### Step 1: Select the Mode (1 minute)

**Action:** Click "Modes Library" → Select "Litigation War Room"

**Say:**
> "First, we select the appropriate mode. For complex litigation like this, we use the Litigation War Room. Notice it automatically configures the Council for adversarial analysis - we get both prosecution and defense perspectives."

**Point out:**
- The mode's "Prime Directive" 
- Default agents that get selected
- The amber "Legal" badge showing this is a legal-specific mode

---

### Step 2: Configure Your Council (2 minutes)

**Action:** Add/remove agents to create this team:

| Agent | Why (explain to client) |
|-------|------------------------|
| **CLO** | "Overall strategy - should we settle or go to trial?" |
| **Litigation Strategist** | "Case theory and evidence strength" |
| **IP Specialist** | "Trade secret law expertise" |
| **Employment Specialist** | "Non-compete and duty of loyalty issues" |
| **Risk Counsel** | "Damages exposure and reputational risk" |
| **Opposing Counsel** | "This is key - we get Uber's likely arguments" |

**Say:**
> "What makes this powerful is we're not just getting one AI's opinion. We're getting a deliberation between specialists who each bring different expertise - and crucially, we include Opposing Counsel to stress-test our arguments."

---

### Step 3: Ingest the Case Brief (2 minutes)

**Action:** Drag and drop `waymo-v-uber-brief.md` into the chat

**Say:**
> "Now we give the Council the case materials. In practice, this would be your actual briefs, discovery documents, contracts - whatever you need analyzed. The system ingests and indexes everything."

**Point out:**
- Document appears in the context
- Agents now have access to the facts
- "In production, you'd connect this to your document management system"

---

### Step 4: Run the Deliberation (5-7 minutes)

**Action:** Enter this prompt:

```
Analyze this trade secret misappropriation case from Waymo's perspective. 

1. What are our strongest arguments for liability?
2. What defenses will Uber raise, and how do we counter them?
3. What is the likely damages range?
4. Should we pursue trial or settlement? At what valuation?

Each agent should provide their specialized perspective.
```

**While waiting, explain:**
> "Watch how each agent responds from their area of expertise. The IP Specialist focuses on trade secret elements. The Litigation Strategist evaluates evidence strength. And Opposing Counsel - this is where it gets interesting - actively argues against us."

**After responses come in:**
> "Notice how we get a multi-dimensional analysis. The CLO is synthesizing all perspectives into a strategic recommendation. This would take a team of associates days to produce."

---

### Step 5: Prior Case Comparison with Caselaw (3 minutes)

**Action:** Enter this follow-up prompt:

```
Search Caselaw for similar trade secret misappropriation cases involving:
1. Employee departure with downloaded files
2. Acquisition of company founded by former employee
3. California jurisdiction

Compare the outcomes and identify factors that strengthened or weakened the plaintiff's case.
```

**Say:**
> "Now we're pulling from Harvard's Caselaw Access Project - over 6 million cases. The Council finds precedents and compares them to our facts. This is the kind of research that would take a paralegal a full day."

**Point out:**
- Cases like *Silvaco v. Intel*, *Brocade v. A10*
- How the Council identifies distinguishing factors
- "All of this runs locally - your client data never leaves your network"

---

### Step 6: Strategic Recommendation (2 minutes)

**Action:** Ask for synthesis:

```
Based on all analysis, provide a final strategic recommendation:
- Recommended course of action
- Key risks to mitigate
- Settlement range if applicable
- Timeline considerations
```

**Say:**
> "The Council synthesizes everything into an actionable recommendation. Your partners can review this, challenge it, refine it - but they're starting from a sophisticated analysis, not a blank page."

---

## Closing (1 minute)

**Key points to emphasize:**

1. **Speed:** "What we just did in 15 minutes would take a team days"

2. **Depth:** "We got perspectives from 6 specialists, including adversarial analysis"

3. **Privacy:** "Everything runs locally - your client data stays on your network"

4. **Precedent:** "Integrated case law research, not just AI opinions"

5. **Customizable:** "You can add your own agents, train on your firm's work product"

---

## Handling Objections

**"How accurate is this?"**
> "The Council doesn't replace attorney judgment - it accelerates it. Think of it as a highly capable research team that works in minutes instead of days. You still make the decisions."

**"What about hallucinations?"**
> "We use local models with your actual documents as context. The Caselaw integration pulls real cases. And the multi-agent approach means errors get challenged - that's why we include Opposing Counsel."

**"Is this secure?"**
> "Completely local. The AI runs on your hardware. Documents never leave your network. The only external call is to Caselaw, which is public case law."

**"What about attorney-client privilege?"**
> "Because it's local, privilege is maintained. No cloud AI sees your work product."

---

## Alternative Demo Cases

If the client prefers a different scenario:

### Employment Termination
- Use "Employment Matter Council" mode
- Brief: Wrongful termination with discrimination claims
- Agents: Employment Specialist, Risk Counsel, HR Advisor, Opposing Counsel

### M&A Due Diligence
- Use "Deal Room" mode
- Brief: Target company with IP and contract issues
- Agents: M&A Counsel, IP Specialist, Contract Counsel, Risk Counsel

### Contract Negotiation
- Use "Contract Negotiation" mode
- Brief: Enterprise SaaS agreement with problematic terms
- Agents: Contract Counsel, Commercial Advisor, Risk Counsel, Opposing Counsel

---

## Files in This Demo Package

```
/demos/legal/
├── DEMO-PLAYBOOK.md          (this file)
├── waymo-v-uber-brief.md     (case brief for ingestion)
├── employment-brief.md       (alternative demo)
└── contract-brief.md         (alternative demo)
```
