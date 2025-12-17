# 📖 The Datacendia Prompting Bible

**The Complete Guide to Commanding The Council**

Version 2.0 | November 2025

---

## Table of Contents

1. [Philosophy of Council Prompting](#philosophy)
2. [The Anatomy of a Perfect Prompt](#anatomy)
3. [Agent-Specific Prompting](#agent-specific)
4. [Decision Type Templates](#decision-templates)
5. [Advanced Techniques](#advanced)
6. [Industry-Specific Prompting](#industry)
7. [Anti-Patterns (What NOT to Do)](#anti-patterns)
8. [The Prompt Library](#library)
9. [Troubleshooting](#troubleshooting)

---

<a name="philosophy"></a>
# Part 1: Philosophy of Council Prompting

## The Core Truth

> **The Council is not a search engine. It's not a chatbot. It's a boardroom.**

When you prompt the Council, you're not asking a question—you're convening a meeting of executives who each have:
- Their own perspective
- Their own concerns
- Their own agenda
- Their own blind spots

Your prompt sets the agenda for that meeting.

## The Three Laws of Council Prompting

### Law 1: Specificity Summons Expertise

```
❌ Vague: "Should we expand internationally?"

✅ Specific: "Should we expand to Germany in Q2 2025, 
   given our current $4M ARR, 23-person team, and 
   no existing EU presence?"
```

The more context you provide, the more precisely each agent can apply their expertise.

### Law 2: Constraints Create Creativity

```
❌ Open-ended: "How should we grow?"

✅ Constrained: "How should we grow revenue 40% in 12 months 
   without raising additional capital or hiring more than 
   5 people?"
```

Constraints force the Council to think harder and produce more actionable advice.

### Law 3: Tension Produces Truth

```
❌ Leading: "Why is this acquisition a good idea?"

✅ Balanced: "Evaluate this acquisition. What are the 
   strongest arguments for AND against proceeding?"
```

The Council's power comes from disagreement. Don't rob it of that by pre-deciding.

---

## The Prompting Mindset

### Think Like a CEO Briefing Their Team

When a CEO walks into a meeting, they don't say "What should we do?" They say:

- "Here's the situation..."
- "Here are the constraints..."
- "Here's what I'm considering..."
- "I need your perspectives on..."

Your prompts should follow this same structure.

### Think Like a Decision Architect

Every prompt should answer:
1. What decision am I actually making?
2. What does each agent need to know?
3. What output format would be most useful?
4. What do I want them to disagree about?

---

<a name="anatomy"></a>
# Part 2: The Anatomy of a Perfect Prompt

## The DECIDE Framework

Every high-quality Council prompt has six components:

```
D - Decision: What specific decision are you making?
E - Environment: What's the current situation?
C - Constraints: What are the non-negotiables?
I - Information: What data/context is relevant?
D - Deliverable: What output format do you want?
E - Emphasis: Which perspectives matter most?
```

### Full Example Using DECIDE

```
=== COUNCIL DELIBERATION REQUEST ===

DECISION:
Should we acquire TechStartup Inc. for $12M?

ENVIRONMENT:
- We are a $50M ARR B2B SaaS company
- TechStartup has $3M ARR, growing 80% YoY
- Their product fills a gap in our platform
- Deal is exclusive for 30 days
- We have $20M in cash, no debt

CONSTRAINTS:
- Cannot raise additional capital for this
- Must maintain 18-month runway minimum
- Integration must not disrupt Q1 product roadmap
- Key employees (CTO, 3 engineers) must be retained

INFORMATION:
- TechStartup's customer retention: 94%
- Product overlap with our roadmap: ~40%
- Cultural assessment score: 7/10
- Technical debt assessment: Moderate
- Competitive interest: 2 other potential buyers

DELIVERABLE:
Provide a recommendation with:
1. Go/No-Go verdict with confidence level
2. Top 3 risks if we proceed
3. Top 3 risks if we don't proceed
4. Suggested deal structure modifications
5. 90-day integration priorities

EMPHASIS:
Weight CFO and Strategy perspectives heavily. 
Flag any concerns from Legal regarding IP transfer.

===
```

---

## Component Deep Dives

### D - Decision Statement

**The Golden Rule:** If you can't state the decision as a yes/no or A/B/C choice, you're not ready to prompt.

#### Good Decision Statements:
```
✅ "Should we proceed with the Series B at $40M pre?"
✅ "Which vendor should we select: Salesforce, HubSpot, or build in-house?"
✅ "Should we terminate the partnership with DistributorCo?"
✅ "Do we launch in Q1 as planned or delay to Q2?"
```

#### Bad Decision Statements:
```
❌ "What should our strategy be?" (Too vague)
❌ "How do we fix sales?" (Not a decision)
❌ "Tell me about market trends" (Research, not decision)
❌ "What do you think about AI?" (Opinion, not decision)
```

### E - Environment

Paint the picture. The Council needs to understand:

```
ENVIRONMENT CHECKLIST:
□ Company stage and size
□ Industry and market position
□ Recent relevant events
□ Competitive landscape
□ Team composition
□ Financial position
□ Strategic priorities
□ Timeline pressures
```

**Example:**
```
ENVIRONMENT:
We are a Series B healthcare SaaS company ($18M ARR, 85 employees).
Just lost our biggest customer (12% of revenue) last month.
Currently fundraising Series C with 6 months runway remaining.
Main competitor just raised $100M and is pricing aggressively.
CEO is new (6 months in), inheriting decisions from predecessor.
```

### C - Constraints

Constraints are non-negotiable boundaries. They're different from preferences.

```
CONSTRAINTS (Hard limits - cannot violate):
- Budget ceiling: $500K
- Timeline: Must decide by Dec 15
- Headcount: Cannot exceed 50 FTEs
- Regulatory: Must maintain SOC 2 compliance

PREFERENCES (Soft limits - would like to honor):
- Prefer not to use contractors
- Would like to avoid weekend deployments
- Prefer vendors with existing relationships
```

### I - Information

Provide the data the Council needs. Be specific with numbers.

```
INFORMATION:

Financial Data:
- Current MRR: $1.2M
- Growth rate: 8% MoM
- CAC: $4,200
- LTV: $38,000
- Burn rate: $850K/month

Operational Data:
- Team size: 47
- Engineering capacity: 3 available sprints
- Customer support ticket volume: 340/week

Market Data:
- TAM: $4.2B
- Our market share: 2.3%
- Top competitor share: 18%

Qualitative Context:
- Team morale: Declining after recent layoffs
- Customer sentiment: NPS dropped from 45 to 38
- Board sentiment: Pushing for profitability path
```

### D - Deliverable

Tell the Council exactly what output you want.

```
DELIVERABLE OPTIONS:

For quick decisions:
"Provide a one-paragraph recommendation with confidence level (High/Medium/Low)"

For complex decisions:
"Provide:
1. Executive summary (3 sentences)
2. Recommendation with rationale
3. Risk matrix (likelihood x impact)
4. Dissenting opinions from any agent
5. Decision criteria for revisiting this in 90 days"

For exploratory analysis:
"Provide:
1. Three distinct strategic options
2. Pros/cons for each option
3. Resource requirements for each
4. Recommended path with contingencies"

For presentations:
"Provide:
1. Board-ready summary (5 bullets)
2. Supporting data points
3. Anticipated questions and responses
4. Recommended narrative arc"
```

### E - Emphasis

Guide which perspectives matter most for THIS decision.

```
EMPHASIS EXAMPLES:

For financial decisions:
"Weight CFO perspective heavily. Risk Agent should stress-test assumptions."

For people decisions:
"CHRO Agent should lead. Legal Agent should flag compliance issues."

For strategic decisions:
"Strategy Agent leads. Devil's Advocate should actively challenge assumptions."

For operational decisions:
"COO Agent leads. CFO Agent should validate cost assumptions."

For crisis decisions:
"All agents contribute equally. Seek maximum disagreement to surface blind spots."
```

---

<a name="agent-specific"></a>
# Part 3: Agent-Specific Prompting

## Understanding Each Agent's Lens

Each Council agent sees the world differently. Understanding their lens helps you prompt more effectively.

---

### 💰 CFO Agent

**Primary Lens:** Financial impact, ROI, cash flow, risk-adjusted returns

**What They Care About:**
- Unit economics
- Payback periods
- Cash runway impact
- Financial risk exposure
- Audit and compliance implications

**How to Activate Them:**

```
To get CFO perspective, include:
- Specific dollar amounts
- Timeline for returns
- Impact on key financial metrics
- Comparison to alternative uses of capital

Example trigger phrases:
- "What's the NPV of..."
- "How does this affect our runway..."
- "What's the payback period..."
- "Compare the ROI to..."
```

**CFO Agent Prompt Template:**
```
CFO FOCUS REQUEST:

Investment under consideration: [DESCRIPTION]
Capital required: $[AMOUNT]
Expected return: $[AMOUNT] over [TIMEFRAME]
Alternative uses of this capital: [OPTIONS]
Current cash position: $[AMOUNT]
Monthly burn: $[AMOUNT]

CFO Agent: Please analyze this investment through a financial lens.
Provide IRR, payback period, and impact on runway.
Flag any financial risks or accounting implications.
```

---

### ⚙️ COO Agent

**Primary Lens:** Execution feasibility, operational impact, resource allocation

**What They Care About:**
- Can we actually do this?
- What breaks if we try?
- Who does the work?
- What's the realistic timeline?
- What dependencies exist?

**How to Activate Them:**

```
To get COO perspective, include:
- Current operational capacity
- Team availability
- Existing commitments
- Process dependencies
- Realistic timelines

Example trigger phrases:
- "Is this operationally feasible..."
- "What resources would this require..."
- "What's the realistic timeline..."
- "What would we have to stop doing..."
```

**COO Agent Prompt Template:**
```
COO FOCUS REQUEST:

Initiative: [DESCRIPTION]
Proposed timeline: [DATES]
Current team capacity: [DESCRIPTION]
Existing commitments: [LIST]
Dependencies: [LIST]

COO Agent: Assess the operational feasibility of this initiative.
Identify resource requirements, bottlenecks, and realistic timelines.
What would we need to deprioritize to make this happen?
```

---

### 📈 CRO Agent

**Primary Lens:** Revenue impact, customer acquisition, market opportunity

**What They Care About:**
- Will this make us money?
- How does it affect sales velocity?
- What's the customer impact?
- What's the competitive angle?
- How do we position this?

**How to Activate Them:**

```
To get CRO perspective, include:
- Revenue targets and actuals
- Pipeline status
- Customer feedback
- Competitive positioning
- Market timing

Example trigger phrases:
- "What's the revenue impact..."
- "How will customers respond..."
- "What's the competitive advantage..."
- "How does this affect pipeline..."
```

**CRO Agent Prompt Template:**
```
CRO FOCUS REQUEST:

Decision context: [DESCRIPTION]
Current revenue: $[AMOUNT]
Revenue target: $[AMOUNT]
Pipeline status: [DESCRIPTION]
Customer sentiment: [DESCRIPTION]
Competitive landscape: [DESCRIPTION]

CRO Agent: Analyze the revenue implications of this decision.
How does this affect our ability to hit targets?
What's the customer and competitive impact?
```

---

### 🛡️ CISO Agent

**Primary Lens:** Security, compliance, regulatory risk, data protection

**What They Care About:**
- What could go wrong?
- Are we compliant?
- What's our exposure?
- Who has access?
- What are the regulatory implications?

**How to Activate Them:**

```
To get CISO perspective, include:
- Data involved and sensitivity
- Regulatory requirements
- Third-party access
- Security controls
- Compliance obligations

Example trigger phrases:
- "What are the security implications..."
- "Are we compliant with..."
- "What's our risk exposure..."
- "What could go wrong..."
```

**CISO Agent Prompt Template:**
```
CISO FOCUS REQUEST:

Initiative: [DESCRIPTION]
Data involved: [TYPES AND SENSITIVITY]
Third parties: [LIST]
Regulatory requirements: [LIST]
Current security posture: [DESCRIPTION]

CISO Agent: Assess security and compliance implications.
Identify risks, required controls, and regulatory concerns.
What's the worst-case scenario and how do we prevent it?
```

---

### 🎯 Strategy Agent

**Primary Lens:** Long-term positioning, competitive dynamics, market evolution

**What They Care About:**
- Where does this take us in 5 years?
- How do competitors respond?
- What doors does this open or close?
- Is this aligned with our vision?
- What's the second-order effect?

**How to Activate Them:**

```
To get Strategy perspective, include:
- Company vision and long-term goals
- Competitive landscape
- Market trends
- Strategic alternatives
- Opportunity costs

Example trigger phrases:
- "How does this affect our long-term position..."
- "What's the strategic rationale..."
- "How will competitors respond..."
- "What doors does this open or close..."
```

**Strategy Agent Prompt Template:**
```
STRATEGY FOCUS REQUEST:

Decision: [DESCRIPTION]
Company vision: [STATEMENT]
Current strategic priorities: [LIST]
Competitive landscape: [DESCRIPTION]
Market trends: [DESCRIPTION]

Strategy Agent: Evaluate the strategic implications.
How does this align with our long-term vision?
What's the competitive response? What are the second-order effects?
```

---

### 👥 CHRO Agent

**Primary Lens:** People impact, culture, talent, organizational health

**What They Care About:**
- How does this affect our people?
- What's the cultural impact?
- Can we attract/retain talent for this?
- What's the change management need?
- Are we being fair?

**How to Activate Them:**

```
To get CHRO perspective, include:
- Team composition and morale
- Cultural values
- Talent market conditions
- Change history
- Employee sentiment

Example trigger phrases:
- "How will the team react..."
- "What's the cultural impact..."
- "Can we hire for this..."
- "What change management is needed..."
```

**CHRO Agent Prompt Template:**
```
CHRO FOCUS REQUEST:

Decision: [DESCRIPTION]
Team affected: [SIZE AND COMPOSITION]
Current morale: [ASSESSMENT]
Recent changes: [LIST]
Cultural values: [LIST]

CHRO Agent: Assess the people impact of this decision.
How will employees react? What's the cultural implication?
What change management or communication is needed?
```

---

### ⚖️ Legal Agent

**Primary Lens:** Legal risk, contractual obligations, regulatory compliance

**What They Care About:**
- Is this legal?
- What are our contractual obligations?
- What's our liability exposure?
- What documentation do we need?
- What could we be sued for?

**How to Activate Them:**

```
To get Legal perspective, include:
- Relevant contracts
- Regulatory environment
- Jurisdictions involved
- Past legal issues
- Specific legal concerns

Example trigger phrases:
- "What are the legal risks..."
- "Are we contractually able to..."
- "What's our liability exposure..."
- "What documentation do we need..."
```

**Legal Agent Prompt Template:**
```
LEGAL FOCUS REQUEST:

Decision: [DESCRIPTION]
Relevant contracts: [LIST]
Jurisdictions: [LIST]
Regulatory requirements: [LIST]
Known legal concerns: [LIST]

Legal Agent: Identify legal risks and requirements.
What contracts or regulations apply?
What documentation or approvals are needed?
What's our liability exposure?
```

---

### 😈 Devil's Advocate Agent

**Primary Lens:** Contrarian view, assumption challenging, blind spot identification

**What They Care About:**
- What if we're wrong?
- What are we not seeing?
- What assumptions are we making?
- What's the bear case?
- What would make this fail?

**How to Activate Them:**

```
To get Devil's Advocate perspective, include:
- Your current assumptions
- Why you think this is right
- What you're most confident about
- What would change your mind

Example trigger phrases:
- "Challenge this assumption..."
- "What are we missing..."
- "Make the strongest case against..."
- "What would make this fail..."
```

**Devil's Advocate Prompt Template:**
```
DEVIL'S ADVOCATE REQUEST:

Proposed decision: [DESCRIPTION]
Current confidence level: [HIGH/MEDIUM/LOW]
Key assumptions: [LIST]
What we're most certain about: [LIST]

Devil's Advocate: Challenge this decision aggressively.
What assumptions are we making that might be wrong?
What's the strongest case against this?
What would have to be true for this to fail?
```

---

<a name="decision-templates"></a>
# Part 4: Decision Type Templates

## Template Library by Decision Category

### Strategic Decisions

#### Market Entry Decision
```
=== COUNCIL DELIBERATION: MARKET ENTRY ===

DECISION:
Should we enter [MARKET/GEOGRAPHY] within [TIMEFRAME]?

CONTEXT:
Current markets served: [LIST]
Revenue by market: [BREAKDOWN]
Why this market: [RATIONALE]
Market size: $[TAM]
Key competitors in market: [LIST]
Required investment: $[AMOUNT]
Expected time to break-even: [MONTHS]

CONSTRAINTS:
- Maximum investment: $[AMOUNT]
- Must achieve [METRIC] within [TIMEFRAME]
- Cannot cannibalize existing [MARKET/PRODUCT]
- Regulatory requirements: [LIST]

SPECIFIC QUESTIONS:
1. Is the market attractive enough?
2. Can we win against incumbent competitors?
3. Do we have the capabilities to execute?
4. What's the optimal entry strategy?
5. What are the key milestones and decision points?

DELIVERABLE:
Go/No-Go recommendation with:
- Entry strategy recommendation
- Investment phasing
- Risk mitigation plan
- Key success metrics
- 90-day action plan if Go

EMPHASIS:
Strategy Agent should lead. CFO Agent validates financials.
CRO Agent assesses revenue potential. CISO Agent flags regulatory risks.
```

---

#### M&A Decision
```
=== COUNCIL DELIBERATION: ACQUISITION ===

DECISION:
Should we acquire [COMPANY] for $[PRICE]?

TARGET PROFILE:
Company: [NAME]
Industry: [INDUSTRY]
Revenue: $[AMOUNT]
Growth rate: [%]
Employees: [NUMBER]
Key products: [LIST]
Key customers: [LIST]
Key technology: [DESCRIPTION]

STRATEGIC RATIONALE:
- [Reason 1]
- [Reason 2]
- [Reason 3]

FINANCIAL DETAILS:
Asking price: $[AMOUNT]
Our valuation: $[AMOUNT]
Revenue multiple: [X]x
Expected synergies: $[AMOUNT]
Integration costs: $[AMOUNT]
Financing: [CASH/DEBT/EQUITY]

DUE DILIGENCE FINDINGS:
Financial: [SUMMARY]
Legal: [SUMMARY]
Technical: [SUMMARY]
Cultural: [SUMMARY]
Customer: [SUMMARY]

CONSTRAINTS:
- Maximum price: $[AMOUNT]
- Must retain: [KEY PEOPLE/CUSTOMERS]
- Integration timeline: [MONTHS]
- Financing limits: [DESCRIPTION]

DELIVERABLE:
1. Acquire/Pass/Negotiate recommendation
2. Fair value assessment
3. Top 5 risks and mitigations
4. Integration priorities
5. Walk-away points

EMPHASIS:
CFO Agent on valuation. Strategy Agent on strategic fit.
Legal Agent on deal structure. CHRO Agent on cultural integration.
Devil's Advocate on what could go wrong.
```

---

### Operational Decisions

#### Vendor Selection
```
=== COUNCIL DELIBERATION: VENDOR SELECTION ===

DECISION:
Which vendor should we select for [NEED]?

OPTIONS:
Option A: [VENDOR NAME]
- Price: $[AMOUNT]
- Capabilities: [LIST]
- Pros: [LIST]
- Cons: [LIST]

Option B: [VENDOR NAME]
- Price: $[AMOUNT]
- Capabilities: [LIST]
- Pros: [LIST]
- Cons: [LIST]

Option C: Build In-House
- Estimated cost: $[AMOUNT]
- Timeline: [MONTHS]
- Pros: [LIST]
- Cons: [LIST]

REQUIREMENTS:
Must-haves: [LIST]
Nice-to-haves: [LIST]
Deal-breakers: [LIST]

CONTEXT:
Current solution: [DESCRIPTION]
Why changing: [REASONS]
Timeline: [DATES]
Budget: $[AMOUNT]
Stakeholders: [LIST]

DELIVERABLE:
1. Recommended vendor with rationale
2. Negotiation strategy
3. Implementation roadmap
4. Risk assessment
5. Success metrics

EMPHASIS:
COO Agent on operational fit. CFO Agent on total cost.
CISO Agent on security/compliance. Legal Agent on contract terms.
```

---

#### Pricing Decision
```
=== COUNCIL DELIBERATION: PRICING ===

DECISION:
Should we [CHANGE PRICING DESCRIPTION]?

CURRENT STATE:
Current pricing: [DESCRIPTION]
Revenue at current pricing: $[AMOUNT]
Margin at current pricing: [%]
Customer feedback on pricing: [SUMMARY]
Competitive pricing: [COMPARISON]

PROPOSED CHANGE:
New pricing: [DESCRIPTION]
Expected revenue impact: $[AMOUNT]
Expected margin impact: [%]
Expected customer reaction: [ASSESSMENT]

ANALYSIS:
Price elasticity data: [IF AVAILABLE]
Segment-by-segment impact: [BREAKDOWN]
Competitive response likely: [ASSESSMENT]
Implementation complexity: [ASSESSMENT]

CONSTRAINTS:
- Cannot lose more than [%] of customers
- Must maintain [MARGIN] minimum
- Must be implementable by [DATE]
- Must be explainable to [STAKEHOLDER]

DELIVERABLE:
1. Go/No-Go on pricing change
2. Recommended pricing structure
3. Implementation timing
4. Customer communication strategy
5. Metrics to monitor

EMPHASIS:
CFO Agent on financial impact. CRO Agent on customer/competitive response.
Strategy Agent on long-term positioning. COO Agent on implementation.
```

---

### People Decisions

#### Hiring Decision
```
=== COUNCIL DELIBERATION: KEY HIRE ===

DECISION:
Should we hire [CANDIDATE] as [ROLE]?

ROLE CONTEXT:
Position: [TITLE]
Reports to: [TITLE]
Team size: [NUMBER]
Why this role now: [RATIONALE]
Previous attempts to fill: [HISTORY]

CANDIDATE PROFILE:
Name: [NAME]
Current role: [TITLE at COMPANY]
Relevant experience: [SUMMARY]
Strengths: [LIST]
Concerns: [LIST]
Interview scores: [SUMMARY]
Reference check summary: [SUMMARY]
Compensation ask: $[AMOUNT]

ALTERNATIVES:
Other candidates: [LIST WITH BRIEF ASSESSMENT]
Promote internal: [OPTION IF APPLICABLE]
Delay hire: [IMPLICATIONS]

CONSTRAINTS:
- Budget for role: $[AMOUNT]
- Must start by: [DATE]
- Must have: [REQUIREMENTS]
- Cannot compromise on: [NON-NEGOTIABLES]

DELIVERABLE:
1. Hire/Pass/Continue Search recommendation
2. Compensation recommendation
3. Onboarding priorities
4. 90-day success criteria
5. Risk mitigation for concerns

EMPHASIS:
CHRO Agent on cultural fit and talent assessment.
COO Agent on role requirements. CFO Agent on compensation.
Strategy Agent on long-term leadership needs.
```

---

#### Reorganization Decision
```
=== COUNCIL DELIBERATION: REORGANIZATION ===

DECISION:
Should we reorganize [AREA] as proposed?

CURRENT STATE:
Current structure: [DESCRIPTION]
Current headcount: [NUMBER]
Current performance: [ASSESSMENT]
Current issues: [LIST]

PROPOSED CHANGE:
New structure: [DESCRIPTION]
New headcount: [NUMBER]
Roles eliminated: [LIST]
Roles created: [LIST]
Reporting changes: [LIST]

RATIONALE:
- [Reason 1]
- [Reason 2]
- [Reason 3]

IMPACT ASSESSMENT:
Affected employees: [NUMBER]
Severance costs: $[AMOUNT]
Productivity impact: [ASSESSMENT]
Timeline to full productivity: [MONTHS]
Customer impact: [ASSESSMENT]

CONSTRAINTS:
- Must complete by: [DATE]
- Budget for transition: $[AMOUNT]
- Must retain: [KEY PEOPLE]
- Must maintain: [KEY CAPABILITIES]

DELIVERABLE:
1. Proceed/Modify/Reject recommendation
2. Modified structure if applicable
3. Communication and change management plan
4. Timeline and milestones
5. Metrics to evaluate success

EMPHASIS:
CHRO Agent on people impact and change management.
COO Agent on operational continuity. Legal Agent on employment law.
CFO Agent on costs. Strategy Agent on long-term capability needs.
```

---

### Financial Decisions

#### Investment Decision
```
=== COUNCIL DELIBERATION: INVESTMENT ===

DECISION:
Should we invest $[AMOUNT] in [INITIATIVE]?

INVESTMENT DETAILS:
Initiative: [DESCRIPTION]
Total investment: $[AMOUNT]
Investment timeline: [MONTHS]
Expected return: $[AMOUNT] over [YEARS]
IRR: [%]
Payback period: [MONTHS]

STRATEGIC RATIONALE:
- [Reason 1]
- [Reason 2]
- [Reason 3]

ALTERNATIVES:
Alternative A: [DESCRIPTION AND RETURNS]
Alternative B: [DESCRIPTION AND RETURNS]
Do nothing: [IMPLICATIONS]

RISKS:
- [Risk 1]: [PROBABILITY] / [IMPACT]
- [Risk 2]: [PROBABILITY] / [IMPACT]
- [Risk 3]: [PROBABILITY] / [IMPACT]

CONSTRAINTS:
- Maximum investment: $[AMOUNT]
- Must achieve ROI by: [DATE]
- Cannot impact: [OTHER INITIATIVES]
- Requires: [APPROVALS/RESOURCES]

DELIVERABLE:
1. Invest/Defer/Reject recommendation
2. Investment sizing recommendation
3. Phasing and milestones
4. Risk mitigation plan
5. Exit criteria if underperforming

EMPHASIS:
CFO Agent on financial analysis. Strategy Agent on strategic fit.
COO Agent on execution feasibility. Risk Agent on downside scenarios.
```

---

<a name="advanced"></a>
# Part 5: Advanced Techniques

## Technique 1: The Pre-Mortem Prompt

Force the Council to imagine failure before it happens.

```
=== PRE-MORTEM ANALYSIS ===

DECISION MADE:
Assume we decided to [DECISION].
Assume it's now [DATE 12 MONTHS FROM NOW].
Assume the decision has FAILED spectacularly.

EACH AGENT:
1. Describe the most likely way this failed from your perspective
2. Identify the warning signs we should have seen
3. Explain what we could have done differently
4. Rate the likelihood of this failure mode (1-10)

SYNTHESIS:
After individual perspectives, provide:
- Top 3 failure modes by likelihood
- Combined early warning indicators
- Recommended preventive actions
- Go/No-Go recommendation based on failure analysis
```

---

## Technique 2: The Scenario Matrix

Test the decision against multiple futures.

```
=== SCENARIO MATRIX ANALYSIS ===

DECISION:
[DECISION DESCRIPTION]

TEST AGAINST THESE SCENARIOS:

Scenario A - Best Case:
[DESCRIPTION OF FAVORABLE CONDITIONS]

Scenario B - Base Case:
[DESCRIPTION OF EXPECTED CONDITIONS]

Scenario C - Worst Case:
[DESCRIPTION OF UNFAVORABLE CONDITIONS]

Scenario D - Black Swan:
[DESCRIPTION OF UNEXPECTED DISRUPTION]

FOR EACH SCENARIO:
1. How does the decision perform?
2. What adjustments would be needed?
3. What's the financial outcome?
4. What are the reversibility options?

DELIVERABLE:
- Scenario-weighted recommendation
- Contingency plans for each scenario
- Decision triggers (what would make us change course)
- Hedging strategies
```

---

## Technique 3: The Red Team / Blue Team

Create structured opposition within the Council.

```
=== RED TEAM / BLUE TEAM ANALYSIS ===

DECISION:
[DECISION DESCRIPTION]

BLUE TEAM (CFO, CRO, Strategy Agents):
Make the strongest possible case FOR this decision.
- Best arguments
- Supporting evidence
- Expected benefits
- Success factors

RED TEAM (CISO, Legal, Devil's Advocate Agents):
Make the strongest possible case AGAINST this decision.
- Best counterarguments
- Risks and concerns
- Potential downsides
- Failure modes

NEUTRAL JUDGES (COO, CHRO Agents):
After hearing both sides:
- Which arguments are strongest?
- What's the weight of evidence?
- What additional information would help?
- What's the verdict?

FINAL OUTPUT:
- Verdict with confidence level
- Key factors that swung the decision
- Conditions that would reverse the verdict
- Recommended safeguards regardless of decision
```

---

## Technique 4: The Stakeholder Simulation

Have the Council role-play key stakeholders.

```
=== STAKEHOLDER SIMULATION ===

DECISION:
[DECISION DESCRIPTION]

ROLE ASSIGNMENTS:
- CFO Agent → Play the role of: [BOARD MEMBER NAME]
- CRO Agent → Play the role of: [KEY CUSTOMER]
- CHRO Agent → Play the role of: [EMPLOYEE LEADER]
- Strategy Agent → Play the role of: [INVESTOR]
- Legal Agent → Play the role of: [REGULATOR]
- Devil's Advocate → Play the role of: [COMPETITOR]

EACH STAKEHOLDER PERSONA:
1. How do you react to this decision?
2. What questions do you have?
3. What would make you supportive?
4. What would make you opposed?
5. What do you wish they had considered?

SYNTHESIS:
- Stakeholder alignment map
- Key concerns to address
- Communication strategy by stakeholder
- Risk of stakeholder opposition
```

---

## Technique 5: The Time Machine

Evaluate from different time horizons.

```
=== TIME MACHINE ANALYSIS ===

DECISION:
[DECISION DESCRIPTION]

EVALUATE FROM THREE TIME PERSPECTIVES:

30-Day View:
- What are the immediate impacts?
- What needs to happen right away?
- What's the short-term risk?
- Quick wins and quick losses?

1-Year View:
- What does success look like at 12 months?
- What milestones should we hit?
- What's the medium-term risk?
- What course corrections might be needed?

5-Year View:
- How does this look in hindsight?
- What strategic position does this create?
- What options does this open or close?
- What would we regret?

TIME SYNTHESIS:
- Is short-term pain worth long-term gain?
- Are we sacrificing the future for today?
- Are we over-indexing on any time horizon?
- Recommended decision with time-weighted rationale
```

---

## Technique 6: The Decision Criteria Lock

Pre-commit to decision criteria before analysis.

```
=== DECISION CRITERIA LOCK ===

DECISION:
[DECISION DESCRIPTION]

BEFORE ANALYSIS, DEFINE:

Must-Have Criteria (Deal-breakers):
1. [CRITERION] - Threshold: [VALUE]
2. [CRITERION] - Threshold: [VALUE]
3. [CRITERION] - Threshold: [VALUE]

Weighted Scoring Criteria:
1. [CRITERION] - Weight: [%]
2. [CRITERION] - Weight: [%]
3. [CRITERION] - Weight: [%]
4. [CRITERION] - Weight: [%]
5. [CRITERION] - Weight: [%]

Lock these criteria before proceeding.

THEN ANALYZE:
Council: Evaluate the decision against locked criteria.
Do not adjust criteria based on findings.
Report pass/fail on must-haves and weighted score.

OUTPUT:
- Must-have assessment (all pass required)
- Weighted score calculation
- Clear recommendation based on pre-set criteria
- Note any criteria that should be revised for future decisions
```

---

<a name="industry"></a>
# Part 6: Industry-Specific Prompting

## Financial Services

### Key Context to Always Include:
```
FINANCIAL SERVICES CONTEXT:
- Regulatory environment: [OCC/FED/FDIC/STATE]
- Capital ratios: [CURRENT vs REQUIRED]
- Risk appetite statement: [SUMMARY]
- Exam cycle: [RECENT FINDINGS]
- BSA/AML status: [CURRENT STATE]
```

### Industry-Specific Trigger Phrases:
```
"Evaluate regulatory risk..."
"Consider UDAAP implications..."
"Assess fair lending impact..."
"Model stress test scenarios..."
"Review against our risk appetite..."
```

---

## Healthcare

### Key Context to Always Include:
```
HEALTHCARE CONTEXT:
- Patient population: [DESCRIPTION]
- Payer mix: [BREAKDOWN]
- Quality metrics: [CURRENT SCORES]
- Regulatory bodies: [JOINT COMMISSION, CMS, STATE]
- Value-based contracts: [STATUS]
```

### Industry-Specific Trigger Phrases:
```
"Consider patient safety implications..."
"Evaluate clinical workflow impact..."
"Assess quality metric effects..."
"Review HIPAA compliance..."
"Model payer response..."
```

---

## Technology / SaaS

### Key Context to Always Include:
```
TECHNOLOGY CONTEXT:
- Tech stack: [SUMMARY]
- Technical debt: [ASSESSMENT]
- Security posture: [SOC2, ISO, etc.]
- Data architecture: [SUMMARY]
- Integration landscape: [KEY SYSTEMS]
```

### Industry-Specific Trigger Phrases:
```
"Evaluate scalability implications..."
"Assess technical debt impact..."
"Consider platform dependencies..."
"Model user adoption scenarios..."
"Review data architecture fit..."
```

---

## Manufacturing

### Key Context to Always Include:
```
MANUFACTURING CONTEXT:
- Production capacity: [CURRENT/MAX]
- Supply chain: [KEY DEPENDENCIES]
- Quality metrics: [DEFECT RATES, etc.]
- Regulatory: [FDA, EPA, OSHA status]
- Labor relations: [UNION STATUS]
```

### Industry-Specific Trigger Phrases:
```
"Evaluate capacity constraints..."
"Assess supply chain risk..."
"Model production scenarios..."
"Consider quality implications..."
"Review safety compliance..."
```

---

<a name="anti-patterns"></a>
# Part 7: Anti-Patterns (What NOT to Do)

## The Seven Deadly Sins of Council Prompting

### Sin 1: The Vague Request
```
❌ "What should we do about sales?"
❌ "Help me with strategy"
❌ "Analyze our situation"

WHY IT FAILS:
No specific decision = no actionable advice
The Council needs a clear question to answer

FIX:
State a specific, binary decision you're facing
```

### Sin 2: The Leading Question
```
❌ "Explain why we should acquire this company"
❌ "Confirm that our strategy is correct"
❌ "Justify this investment"

WHY IT FAILS:
Pre-determines the answer
Robs the Council of its power to dissent

FIX:
Ask for balanced evaluation of options
Explicitly request counterarguments
```

### Sin 3: The Missing Context
```
❌ "Should we raise prices?" (No current pricing info)
❌ "Should we hire a VP Sales?" (No team context)
❌ "Is this acquisition good?" (No financial details)

WHY IT FAILS:
Garbage in, garbage out
The Council can't advise on what it doesn't know

FIX:
Use the DECIDE framework
Include all relevant data and context
```

### Sin 4: The Kitchen Sink
```
❌ "Analyze our strategy, operations, financials, 
    team structure, technology, market position, 
    competitive landscape, and tell me everything 
    we should do differently"

WHY IT FAILS:
Too broad = too shallow
No focus = no depth

FIX:
One decision per deliberation
Break complex topics into focused questions
```

### Sin 5: The Impatient Skipper
```
❌ "Just give me the answer"
❌ "Skip the analysis, what should we do?"
❌ "I don't need the reasoning"

WHY IT FAILS:
The reasoning IS the value
Without understanding why, you can't adapt

FIX:
Request structured output with rationale
Value the process, not just the conclusion
```

### Sin 6: The Confirmation Seeker
```
❌ "We've already decided to X, just validate it"
❌ "The CEO wants to do Y, what's the best argument for it?"
❌ "Don't give me reasons not to do this"

WHY IT FAILS:
You're paying for yes-men
Missing the entire point of diverse perspectives

FIX:
If decision is final, ask for implementation advice
If seeking validation, be honest about it
```

### Sin 7: The One-and-Done
```
❌ Running a single prompt for a major decision
❌ Never following up on initial analysis
❌ Ignoring new information

WHY IT FAILS:
Complex decisions require iteration
New information should update analysis

FIX:
Use multi-turn deliberation
Follow up on areas of disagreement
Re-run with new data as it becomes available
```

---

<a name="library"></a>
# Part 8: The Prompt Library

## Quick-Start Prompts

### The 60-Second Decision Check
```
QUICK CHECK:
Decision: [ONE SENTENCE]
Deadline: [DATE]
Stakes: [HIGH/MEDIUM/LOW]

Council: In 3 bullets each, give me:
- CFO: Financial perspective
- COO: Operational reality check
- Devil's Advocate: What could go wrong

Go/No-Go gut check with confidence level.
```

### The Pre-Meeting Prep
```
MEETING PREP:
I'm presenting [DECISION/PROPOSAL] to [AUDIENCE] on [DATE].

Council: Help me prepare by providing:
1. Three strongest arguments for
2. Three likely objections and responses
3. Data points I should have ready
4. Questions I should expect
5. One thing I might be overlooking
```

### The Decision Debrief
```
DECISION DEBRIEF:
We decided to [DECISION] on [DATE].
Outcome so far: [DESCRIPTION]
Surprises: [LIST]

Council: Analyze this decision in hindsight.
1. What did we get right?
2. What did we miss?
3. What should we have asked?
4. What should we do differently next time?
5. Are any course corrections needed now?
```

---

## Complex Decision Templates

### The Annual Planning Framework
```
=== ANNUAL PLANNING DELIBERATION ===

CONTEXT:
Current year results: [SUMMARY]
Market conditions: [ASSESSMENT]
Competitive dynamics: [CHANGES]
Resource availability: [CONSTRAINTS]

PROPOSED PLAN:
Key initiatives: [LIST WITH BRIEF DESCRIPTION]
Resource allocation: [BREAKDOWN]
Key metrics: [TARGETS]
Major assumptions: [LIST]

COUNCIL TASKS:
1. Stress-test the assumptions
2. Identify missing initiatives
3. Challenge resource allocation
4. Flag unrealistic targets
5. Propose risk mitigation

DELIVERABLE:
- Plan assessment (Ready/Needs Work/Rethink)
- Top 3 adjustments recommended
- Key risks to monitor
- Quarterly checkpoint recommendations
```

### The Crisis Decision Framework
```
=== CRISIS DELIBERATION ===

SITUATION:
What happened: [DESCRIPTION]
When: [TIMELINE]
Who's affected: [STAKEHOLDERS]
Current status: [ASSESSMENT]
Immediate risks: [LIST]

OPTIONS:
Option A: [DESCRIPTION]
Option B: [DESCRIPTION]
Option C: [DESCRIPTION]

CONSTRAINTS:
Time available: [HOURS/DAYS]
Resources available: [LIST]
Non-negotiables: [LIST]

COUNCIL MODE: RAPID RESPONSE
Each agent: 
- 2-sentence assessment
- Top recommendation
- Biggest risk

Synthesis:
- Recommended immediate action
- Stakeholder communication priority
- Next decision point
```

---

<a name="troubleshooting"></a>
# Part 9: Troubleshooting

## Common Issues and Fixes

### Issue: "The response is too generic"

**Cause:** Insufficient context or specificity

**Fix:**
```
Add more specific details:
- Actual numbers, not ranges
- Real constraints, not hypotheticals
- Specific timeline, not "soon"
- Named competitors, not "the market"
```

### Issue: "All agents agree—something's wrong"

**Cause:** Leading prompt or insufficient complexity

**Fix:**
```
Add this to your prompt:
"I expect disagreement on this. Each agent should 
identify at least one concern unique to their perspective.
If you all agree, explain why this decision is obvious
and what we might be missing."
```

### Issue: "The advice isn't actionable"

**Cause:** Missing deliverable specification

**Fix:**
```
Add explicit deliverable requirements:
"Provide specific, actionable recommendations with:
- Exact next steps
- Named owners
- Specific timelines
- Measurable success criteria"
```

### Issue: "Important perspectives are missing"

**Cause:** Not emphasizing relevant agents

**Fix:**
```
Add emphasis section:
"Ensure [AGENT] perspective is thoroughly represented.
This decision particularly impacts [AREA], so [AGENT]
should provide detailed analysis."
```

### Issue: "Response is too long/short"

**Cause:** No length guidance

**Fix:**
```
Specify output length:
"Provide a [concise/comprehensive] response.
Executive summary: [X sentences]
Detail per agent: [X bullets or paragraphs]
Total length: [approximate word count]"
```

---

## The Meta-Prompt

When you're not sure how to prompt, use this:

```
=== HELP ME PROMPT ===

I need help with a decision about [TOPIC].

Here's what I know:
[BRAIN DUMP EVERYTHING]

Here's what I'm trying to decide:
[YOUR BEST ATTEMPT AT THE QUESTION]

Council: Before answering, help me ask the right question.
1. What's the real decision here?
2. What context am I missing?
3. How should I frame this for best results?
4. What agents should I emphasize?
5. Provide a reformulated prompt I should use.
```

---

# Appendix: Cheat Sheet

## The DECIDE Framework
```
D - Decision (specific, binary)
E - Environment (current situation)
C - Constraints (non-negotiables)
I - Information (relevant data)
D - Deliverable (output format)
E - Emphasis (key perspectives)
```

## Agent Quick Reference
```
💰 CFO: Money, ROI, risk-adjusted returns
⚙️ COO: Execution, operations, feasibility
📈 CRO: Revenue, customers, competition
🛡️ CISO: Security, compliance, risk
🎯 Strategy: Long-term, competitive dynamics
👥 CHRO: People, culture, talent
⚖️ Legal: Contracts, liability, regulations
😈 Devil's Advocate: Assumptions, blind spots
```

## Quality Checklist
```
□ Specific decision stated
□ Relevant context included
□ Constraints defined
□ Data provided
□ Output format specified
□ Key perspectives emphasized
□ Not leading the answer
□ Room for disagreement
```

---

# Part 10: Industry Agent Prompting Guide (Premium)

## 🏥 Healthcare Industry Pack

The Healthcare Industry Pack brings specialized agents for healthcare organizations: CMIO (Chief Medical Information Officer), PSO (Patient Safety Officer), HCO (Healthcare Compliance Officer), and COD (Clinical Operations Director).

### Agent Quick Reference

```
🏥 CMIO: Health IT, EHR systems, clinical informatics, interoperability
🛡️ PSO: Patient safety, root cause analysis, quality improvement
📋 HCO: HIPAA, Stark Law, billing compliance, healthcare regulations
⚙️ COD: Patient flow, staffing, operational efficiency, Lean healthcare
```

### Healthcare Prompt Templates (10 Scenarios)

#### 1. EHR Implementation Decision
```
=== HEALTHCARE DELIBERATION: EHR SELECTION ===

DECISION:
Should we replace our legacy EHR with Epic, Cerner, or a cloud-native solution?

ENVIRONMENT:
- 450-bed regional hospital system
- Current EHR: 15-year-old MEDITECH
- IT budget: $45M over 3 years
- 2,200 clinical staff requiring training
- Current interoperability gaps affecting referral network

CLINICAL CONTEXT:
- Physician satisfaction with current EHR: 34%
- Average documentation time: 4.2 hours/day
- Clinical decision support utilization: 12%
- e-Prescribing error rate: 2.3%

CONSTRAINTS:
- Cannot disrupt OR scheduling system during transition
- Must maintain Meaningful Use attestation
- HIPAA compliance non-negotiable
- Go-live must avoid flu season (Oct-Feb)

EMPHASIS:
CMIO should lead on clinical workflow impact. HCO must verify regulatory compliance. 
COD should assess operational disruption. CFO must validate TCO projections.

DELIVERABLE:
1. Vendor recommendation with rationale
2. Implementation risk matrix
3. Physician adoption strategy
4. 5-year TCO comparison
5. Interoperability assessment
```

#### 2. Patient Safety Event Analysis
```
=== PATIENT SAFETY COUNCIL ===

INCIDENT:
[DESCRIPTION OF ADVERSE EVENT]

IMMEDIATE FACTS:
- Patient outcome: [STATUS]
- Staff involved: [ROLES]
- Time of event: [DATE/TIME]
- Location: [UNIT]
- Equipment/systems involved: [LIST]

PRELIMINARY FINDINGS:
- Contributing factors identified: [LIST]
- Similar past events: [COUNT AND DATES]
- Current protocol compliance: [ASSESSMENT]

PSO LEAD ANALYSIS:
Conduct Root Cause Analysis using:
1. 5 Whys methodology
2. Swiss Cheese Model
3. Human Factors analysis

COUNCIL TASKS:
- PSO: Lead RCA, recommend systemic fixes
- HCO: Assess reporting requirements (Joint Commission, state)
- COD: Evaluate workflow and staffing factors
- CMIO: Review clinical decision support gaps

DELIVERABLE:
1. Root cause identification
2. Immediate corrective actions
3. Long-term prevention strategy
4. Staff retraining requirements
5. Policy/procedure updates needed
```

#### 3. HIPAA Compliance Assessment
```
=== COMPLIANCE DELIBERATION ===

SITUATION:
Annual HIPAA risk assessment for [ORGANIZATION]

CURRENT STATE:
- Last OCR audit: [DATE, FINDINGS]
- Breach history: [SUMMARY]
- Business Associates: [COUNT]
- PHI access points: [COUNT]
- Encryption status: [PERCENTAGE]

CONCERNS:
- [SPECIFIC COMPLIANCE GAPS]

HCO LEAD ANALYSIS:
1. Privacy Rule compliance gaps
2. Security Rule technical safeguards
3. Breach notification readiness
4. BAA inventory and status
5. Workforce training compliance

SUPPORTING ANALYSIS:
- CISO: Technical security assessment
- CMIO: Clinical workflow PHI handling
- COD: Physical safeguards and access controls

DELIVERABLE:
1. Risk rating by HIPAA requirement
2. Prioritized remediation roadmap
3. Budget requirements
4. Timeline to compliance
5. Ongoing monitoring plan
```

#### 4. Clinical Operations Efficiency
```
=== OPERATIONAL EXCELLENCE ===

CHALLENGE:
ED throughput averaging 4.8 hours, target is 3.2 hours

CURRENT METRICS:
- Door-to-provider: 38 minutes
- Provider-to-disposition: 2.1 hours
- Disposition-to-departure: 1.9 hours
- Left without being seen: 4.2%
- Boarding hours: 890/month
- ED beds: 42, occupancy: 118%

STAFFING:
- Physicians: [COVERAGE MODEL]
- Nurses: [RATIO]
- Support staff: [COUNT]

COD LEAD ANALYSIS:
Apply Lean Six Sigma methodology:
1. Value stream mapping
2. Bottleneck identification
3. Waste elimination opportunities
4. Staffing optimization modeling

SUPPORTING PERSPECTIVES:
- CMIO: Technology solutions (tracking, alerts)
- PSO: Safety implications of boarding
- CFO: Resource investment requirements

DELIVERABLE:
1. Root causes of delay by category
2. Quick wins (< 30 days)
3. Medium-term initiatives (90 days)
4. Staffing model recommendations
5. Technology investments needed
```

#### 5. Telehealth Expansion Strategy
```
=== TELEHEALTH STRATEGY COUNCIL ===

PROPOSAL:
Expand telehealth from current 8% of visits to 35% within 18 months

CURRENT STATE:
- Telehealth platform: [NAME]
- Specialties enabled: [LIST]
- Patient adoption: [PERCENTAGE]
- Provider utilization: [PERCENTAGE]
- Technical issues per 100 visits: [COUNT]

REGULATORY LANDSCAPE:
- State telehealth parity law: [STATUS]
- Medicare reimbursement: [CURRENT POLICY]
- Cross-state licensure: [SITUATION]

CMIO LEAD ANALYSIS:
1. Clinical appropriateness by specialty
2. Technology platform assessment
3. Integration with EHR and clinical workflows
4. Remote monitoring opportunities

COUNCIL CONTRIBUTIONS:
- HCO: Regulatory compliance by state
- COD: Scheduling and capacity impact
- PSO: Quality and safety monitoring
- CFO: Revenue impact modeling

DELIVERABLE:
1. Specialty prioritization matrix
2. Technology gap analysis
3. Provider training curriculum
4. Patient engagement strategy
5. Success metrics and monitoring
```

#### 6. Medicare Billing Compliance Review
```
=== BILLING COMPLIANCE COUNCIL ===

TRIGGER:
RAC audit findings identified $2.3M in potential overpayments

FINDINGS:
- DRG upcoding concerns: [PERCENTAGE]
- Medical necessity documentation gaps
- Modifier usage patterns
- Same-day service bundling issues

HCO LEAD ANALYSIS:
1. Audit response strategy
2. Self-disclosure evaluation
3. Coding education gaps
4. Documentation improvement plan
5. Compliance program effectiveness

SUPPORTING PERSPECTIVES:
- CMIO: Clinical documentation improvement
- COD: Physician communication strategy
- CFO: Financial exposure assessment
- Legal: OIG self-disclosure protocol

DELIVERABLE:
1. Audit appeal/acceptance strategy
2. Overpayment calculation validation
3. Corrective action plan
4. Compliance monitoring enhancements
5. Staff education priorities
```

#### 7. Quality Measure Performance Improvement
```
=== QUALITY COUNCIL ===

SITUATION:
CMS Star Rating at 3 stars, target is 4 stars for MA contract renewal

CURRENT PERFORMANCE:
- HEDIS measures below benchmark: [LIST]
- Patient experience (CAHPS): [SCORES]
- Readmission rates: [PERCENTAGE]
- Mortality index: [SCORE]

FINANCIAL IMPACT:
- Value-based payment at risk: $[AMOUNT]
- Quality bonus potential: $[AMOUNT]

PSO LEAD ANALYSIS:
1. Measure gap analysis
2. Clinical intervention opportunities
3. Care coordination improvements
4. Patient engagement strategies

COUNCIL CONTRIBUTIONS:
- CMIO: Clinical decision support optimization
- COD: Care management resourcing
- HCO: Compliance with reporting requirements
- CFO: ROI of quality investments

DELIVERABLE:
1. Priority measures for intervention
2. Clinical program recommendations
3. Resource requirements
4. Timeline to improvement
5. Monitoring dashboard design
```

#### 8. Workforce Shortage Crisis Response
```
=== WORKFORCE CRISIS COUNCIL ===

SITUATION:
Nursing vacancy rate at 18%, turnover at 24%

CURRENT STATE:
- Open positions: [COUNT]
- Travel nurse dependency: [PERCENTAGE]
- Overtime costs: $[AMOUNT]/month
- Patient safety events trending: [UP/DOWN]
- Staff engagement score: [NUMBER]

COD LEAD ANALYSIS:
1. Root causes of turnover
2. Workload and scheduling assessment
3. Compensation competitiveness
4. Work environment factors
5. Staffing model alternatives

SUPPORTING PERSPECTIVES:
- PSO: Safety implications of understaffing
- CMIO: Technology to reduce burden
- HCO: Regulatory staffing requirements
- CHRO: Retention and recruitment strategy

DELIVERABLE:
1. Immediate stabilization actions
2. 90-day retention strategy
3. Alternative staffing models
4. Technology investments
5. Long-term workforce development
```

#### 9. Clinical Integration Network Development
```
=== NETWORK STRATEGY COUNCIL ===

PROPOSAL:
Form Clinically Integrated Network with 350 physicians across 12 practices

OBJECTIVES:
- Payer contracting leverage
- Quality improvement collaboration
- Care coordination infrastructure
- Shared savings participation

REGULATORY CONCERNS:
- Stark Law implications
- Anti-kickback considerations
- Antitrust review requirements

HCO LEAD ANALYSIS:
1. Legal structure recommendations
2. Safe harbor compliance
3. Fair market value arrangements
4. Governance requirements
5. Compliance program needs

SUPPORTING PERSPECTIVES:
- CFO: Financial model and investment
- CMIO: Technology platform requirements
- COD: Operational integration needs
- CRO: Payer contracting strategy

DELIVERABLE:
1. Recommended legal structure
2. Compliance framework
3. Governance charter
4. Technology roadmap
5. Launch timeline and milestones
```

#### 10. Healthcare AI Implementation
```
=== AI STRATEGY COUNCIL ===

PROPOSAL:
Implement AI-powered clinical decision support for sepsis detection

TECHNOLOGY:
- Vendor: [NAME]
- Integration method: EHR embedded
- Alert mechanism: Real-time
- Training data: [DESCRIPTION]

CLINICAL VALIDATION:
- Sensitivity: [PERCENTAGE]
- Specificity: [PERCENTAGE]
- False positive rate: [PERCENTAGE]
- Published studies: [CITATIONS]

CMIO LEAD ANALYSIS:
1. Clinical workflow integration
2. Alert fatigue mitigation
3. Provider adoption strategy
4. Outcome monitoring plan
5. Bias and equity assessment

SUPPORTING PERSPECTIVES:
- PSO: Patient safety monitoring
- HCO: Regulatory and liability considerations
- COD: Resource requirements for response
- CISO: Data security and privacy

DELIVERABLE:
1. Implementation recommendation
2. Clinical validation plan
3. Governance framework
4. Monitoring metrics
5. Rollout timeline
```

---

## 💰 Finance Industry Pack

The Finance Industry Pack brings specialized agents for financial services: Quant (Quantitative Analyst), PM (Portfolio Manager), CRO-Finance (Credit Risk Officer), and Treasury.

### Agent Quick Reference

```
📐 Quant: Derivatives pricing, risk metrics, quantitative modeling
📊 PM: Portfolio construction, asset allocation, investment strategy
💳 CRO-Finance: Credit analysis, loan underwriting, Basel compliance
🏦 Treasury: Cash management, FX hedging, liquidity planning
```

### Finance Prompt Templates (10 Scenarios)

#### 1. Portfolio Risk Assessment
```
=== INVESTMENT COUNCIL: PORTFOLIO RISK ===

PORTFOLIO:
- AUM: $[AMOUNT]
- Strategy: [DESCRIPTION]
- Benchmark: [INDEX]

CURRENT ALLOCATION:
- Equities: [%] (Domestic [%], International [%])
- Fixed Income: [%] (Duration: [YEARS])
- Alternatives: [%]
- Cash: [%]

RISK METRICS:
- VaR (95%, 1-day): $[AMOUNT]
- Beta to benchmark: [NUMBER]
- Sharpe Ratio: [NUMBER]
- Max Drawdown (12mo): [%]

MARKET CONCERNS:
- [SPECIFIC CONCERNS]

QUANT LEAD ANALYSIS:
1. Factor exposure decomposition
2. Stress scenario analysis
3. Correlation regime assessment
4. Tail risk quantification

PM PERSPECTIVE:
1. Benchmark deviation justification
2. Rebalancing recommendations
3. Hedge overlay assessment

DELIVERABLE:
1. Risk dashboard summary
2. Stress test results (5 scenarios)
3. Rebalancing recommendations
4. Hedge recommendations with costs
5. Monitoring thresholds
```

#### 2. Credit Underwriting Decision
```
=== CREDIT COUNCIL: LOAN APPROVAL ===

BORROWER:
- Company: [NAME]
- Industry: [SECTOR]
- Revenue: $[AMOUNT]
- EBITDA: $[AMOUNT]
- Requested facility: $[AMOUNT]

FINANCIAL ANALYSIS:
- Debt/EBITDA: [RATIO]
- Interest Coverage: [RATIO]
- Current Ratio: [RATIO]
- Revenue Growth (3yr CAGR): [%]

COLLATERAL:
- Type: [DESCRIPTION]
- Appraised Value: $[AMOUNT]
- LTV: [%]

CRO-FINANCE LEAD ANALYSIS:
1. 5 Cs assessment
2. PD/LGD estimation
3. Covenant structure recommendation
4. Risk rating assignment
5. Pricing adequacy

SUPPORTING PERSPECTIVES:
- Quant: Default probability modeling
- Treasury: Funding cost assessment
- Legal: Documentation requirements

DELIVERABLE:
1. Credit recommendation (Approve/Decline/Modify)
2. Risk rating with rationale
3. Recommended terms and covenants
4. Pricing recommendation
5. Monitoring requirements
```

#### 3. Derivatives Pricing and Hedging
```
=== QUANTITATIVE COUNCIL: DERIVATIVES ===

SITUATION:
Client seeks hedge for $500M floating rate exposure

CURRENT EXPOSURE:
- Notional: $[AMOUNT]
- Reference rate: [SOFR/etc.]
- Maturity profile: [SCHEDULE]
- Current mark-to-market: $[AMOUNT]

MARKET CONDITIONS:
- Yield curve shape: [DESCRIPTION]
- Implied volatility: [LEVEL]
- Credit spreads: [LEVEL]

HEDGING ALTERNATIVES:
1. Interest rate swap
2. Cap structure
3. Collar strategy
4. Swaption overlay

QUANT LEAD ANALYSIS:
1. Scenario pricing (parallel shift, steepener, flattener)
2. Greeks calculation for each alternative
3. Hedge effectiveness ratio
4. Accounting treatment (ASC 815)

TREASURY PERSPECTIVE:
1. Cash flow impact
2. Counterparty credit limits
3. Collateral requirements

DELIVERABLE:
1. Strategy recommendation
2. All-in cost comparison
3. Stress scenario outcomes
4. Implementation timeline
5. Ongoing monitoring requirements
```

#### 4. Treasury Liquidity Management
```
=== TREASURY COUNCIL: LIQUIDITY ===

SITUATION:
Quarterly liquidity planning for [COMPANY]

CURRENT POSITION:
- Cash on hand: $[AMOUNT]
- Available credit facilities: $[AMOUNT]
- Short-term investments: $[AMOUNT]

CASH FLOW FORECAST:
- Operating cash flow (next 90 days): $[AMOUNT]
- Capital expenditures: $[AMOUNT]
- Debt maturities: $[AMOUNT]
- Dividend/distributions: $[AMOUNT]

CONSTRAINTS:
- Minimum cash policy: $[AMOUNT]
- Credit agreement covenants: [LIST]
- Investment policy restrictions: [LIST]

TREASURY LEAD ANALYSIS:
1. Daily cash positioning forecast
2. Funding gap identification
3. Investment reallocation recommendations
4. Credit facility optimization

SUPPORTING PERSPECTIVES:
- CFO: Strategic cash deployment
- CRO-Finance: Counterparty exposure limits
- Quant: Interest rate sensitivity

DELIVERABLE:
1. 90-day liquidity forecast
2. Investment reallocation plan
3. Facility utilization strategy
4. Stress scenario contingencies
5. Board reporting summary
```

#### 5. M&A Financial Due Diligence
```
=== M&A COUNCIL: TARGET VALUATION ===

TARGET:
- Company: [NAME]
- Industry: [SECTOR]
- Asking price: $[AMOUNT]
- Structure: [CASH/STOCK/MIXED]

FINANCIALS:
- Revenue (TTM): $[AMOUNT]
- EBITDA (TTM): $[AMOUNT]
- Revenue growth: [%]
- EBITDA margin: [%]
- Working capital: $[AMOUNT]

SYNERGIES CLAIMED:
- Revenue synergies: $[AMOUNT]
- Cost synergies: $[AMOUNT]
- Timeline to realization: [MONTHS]

PM LEAD ANALYSIS (if PE/Investment):
1. Entry multiple assessment
2. Exit multiple assumptions
3. IRR sensitivity analysis
4. Comparable transactions

CRO-FINANCE PERSPECTIVE:
1. Pro forma leverage analysis
2. Debt capacity assessment
3. Credit rating impact
4. Financing structure options

QUANT PERSPECTIVE:
1. DCF valuation
2. Monte Carlo value range
3. Synergy probability-weighting

DELIVERABLE:
1. Fair value range
2. Bid price recommendation
3. Financing structure
4. Key negotiation points
5. Deal-breaker risks
```

#### 6. FX Hedging Strategy
```
=== TREASURY COUNCIL: FX EXPOSURE ===

EXPOSURE:
- Currencies: [LIST]
- Net exposure by currency: [AMOUNTS]
- Horizon: [MONTHS]
- Current hedge ratio: [%]

POLICY:
- Target hedge ratio: [%]
- Instruments permitted: [LIST]
- Hedge accounting: [YES/NO]

MARKET VIEW:
- USD outlook: [ASSESSMENT]
- Volatility environment: [LOW/NORMAL/HIGH]
- Forward points: [FAVORABLE/UNFAVORABLE]

TREASURY LEAD ANALYSIS:
1. Exposure mapping by entity
2. Natural hedge optimization
3. Instrument selection
4. Rollover strategy

QUANT PERSPECTIVE:
1. Options vs. forwards analysis
2. Collar structuring
3. VaR impact of hedging

DELIVERABLE:
1. Hedge recommendation by currency
2. Instrument mix optimization
3. Execution timeline
4. Accounting treatment
5. Effectiveness testing plan
```

#### 7. Algorithmic Trading Strategy Review
```
=== QUANT COUNCIL: ALGO PERFORMANCE ===

STRATEGY:
- Name: [STRATEGY NAME]
- Type: [MARKET MAKING/MOMENTUM/STAT ARB/etc.]
- Live since: [DATE]
- AUM deployed: $[AMOUNT]

PERFORMANCE:
- YTD return: [%]
- Sharpe Ratio: [NUMBER]
- Max Drawdown: [%]
- Win rate: [%]
- Average holding period: [TIME]

CONCERNS:
- Recent underperformance: [DESCRIPTION]
- Regime change indicators: [LIST]
- Capacity constraints: [ASSESSMENT]

QUANT LEAD ANALYSIS:
1. Factor attribution analysis
2. Regime detection assessment
3. Slippage and market impact analysis
4. Parameter stability testing
5. Capacity limit estimation

PM PERSPECTIVE:
1. Strategy allocation decision
2. Correlation to other strategies
3. Risk budget allocation

DELIVERABLE:
1. Continue/Modify/Retire recommendation
2. Parameter adjustment proposals
3. Capacity adjustment
4. Risk limit modifications
5. Monitoring enhancement
```

#### 8. Credit Portfolio Stress Testing
```
=== CREDIT RISK COUNCIL: STRESS TEST ===

PORTFOLIO:
- Total exposure: $[AMOUNT]
- Number of obligors: [COUNT]
- Sector concentration: [TOP 5]
- Rating distribution: [BREAKDOWN]

SCENARIOS:
1. Baseline
2. Mild recession
3. Severe recession
4. Sector-specific stress

CRO-FINANCE LEAD ANALYSIS:
1. Migration matrix application
2. PD/LGD stress factors
3. Concentration risk assessment
4. Expected loss projections
5. Capital adequacy impact

QUANT PERSPECTIVE:
1. Correlation stress
2. Recovery rate assumptions
3. Time-to-default modeling

TREASURY PERSPECTIVE:
1. Funding stress implications
2. Liquidity buffer adequacy

DELIVERABLE:
1. Stressed loss projections by scenario
2. Capital impact assessment
3. Concentration risk actions
4. Early warning indicators
5. Remediation priorities
```

#### 9. Fixed Income Portfolio Construction
```
=== INVESTMENT COUNCIL: FIXED INCOME ===

MANDATE:
- Benchmark: [INDEX]
- Duration target: [YEARS] (+/- [RANGE])
- Credit quality: [MINIMUM RATING]
- Tracking error budget: [BPS]

CURRENT POSITIONING:
- Duration: [YEARS]
- DTS: [NUMBER]
- Sector allocation: [BREAKDOWN]
- Curve positioning: [BULLET/BARBELL/LADDER]

MARKET OUTLOOK:
- Rate direction: [VIEW]
- Credit spreads: [VIEW]
- Curve shape: [VIEW]

PM LEAD ANALYSIS:
1. Duration positioning recommendation
2. Sector allocation changes
3. Security selection themes
4. Yield curve positioning

QUANT PERSPECTIVE:
1. Key rate duration analysis
2. Spread duration optimization
3. Scenario return projections

DELIVERABLE:
1. Recommended portfolio changes
2. Trade list with sizing
3. Expected tracking error
4. Risk/return tradeoff analysis
5. Implementation timeline
```

#### 10. Basel Capital Optimization
```
=== REGULATORY CAPITAL COUNCIL ===

SITUATION:
Basel III/IV capital planning and optimization

CURRENT POSITION:
- CET1 Ratio: [%]
- Tier 1 Ratio: [%]
- Total Capital Ratio: [%]
- RWA: $[AMOUNT]

RWA COMPOSITION:
- Credit Risk: [%]
- Market Risk: [%]
- Operational Risk: [%]

TARGETS:
- Regulatory minimum: [%]
- Management buffer: [%]
- Peer comparison: [%]

CRO-FINANCE LEAD ANALYSIS:
1. RWA optimization opportunities
2. Credit risk mitigation techniques
3. Internal ratings improvements
4. Securitization opportunities

TREASURY PERSPECTIVE:
1. Capital instrument optimization
2. AT1/T2 issuance planning
3. Dividend capacity

QUANT PERSPECTIVE:
1. IRB model enhancements
2. Correlation parameter review
3. Output floor impact

DELIVERABLE:
1. RWA reduction opportunities
2. Capital efficiency initiatives
3. Issuance recommendations
4. Timeline to target ratios
5. Regulatory engagement plan
```

---

## ⚖️ Legal Industry Pack

The Legal Industry Pack brings specialized agents: Contracts (Contract Specialist), IP (Intellectual Property Counsel), Litigation (Litigation Expert), and Regulatory (Regulatory Affairs Counsel).

### Agent Quick Reference

```
📝 Contracts: Commercial contracts, clause analysis, negotiation
💡 IP: Patents, trademarks, IP strategy, licensing
⚖️ Litigation: Dispute resolution, e-discovery, trial strategy
🏛️ Regulatory: Government affairs, compliance, agency proceedings
```

### Legal Prompt Templates (10 Scenarios)

#### 1. Major Contract Negotiation
```
=== CONTRACT COUNCIL: NEGOTIATION ===

AGREEMENT:
- Type: [MSA/SaaS/Licensing/Supply/etc.]
- Counterparty: [NAME]
- Value: $[AMOUNT]
- Term: [DURATION]

KEY TERMS PROPOSED:
- Payment terms: [DESCRIPTION]
- Liability cap: [AMOUNT/FORMULA]
- Indemnification: [SCOPE]
- IP ownership: [ALLOCATION]
- Termination: [CONDITIONS]

RED FLAGS IDENTIFIED:
- [LIST CONCERNING CLAUSES]

CONTRACTS LEAD ANALYSIS:
1. Risk assessment by clause
2. Market-standard comparison
3. Fallback position recommendations
4. Deal-breaker identification
5. Negotiation strategy

SUPPORTING PERSPECTIVES:
- IP: Technology and IP clause review
- Litigation: Dispute resolution analysis
- CFO: Financial term assessment

DELIVERABLE:
1. Risk-rated clause analysis
2. Redline recommendations
3. Negotiation talking points
4. Walk-away triggers
5. Alternative language proposals
```

#### 2. Patent Portfolio Strategy
```
=== IP COUNCIL: PATENT STRATEGY ===

SITUATION:
Annual patent portfolio review and strategy

PORTFOLIO:
- Issued patents: [COUNT]
- Pending applications: [COUNT]
- Geographic coverage: [COUNTRIES]
- Technology areas: [LIST]

BUSINESS CONTEXT:
- R&D investment: $[AMOUNT]
- Product roadmap: [SUMMARY]
- Competitive landscape: [ASSESSMENT]

IP LEAD ANALYSIS:
1. Freedom-to-operate assessment
2. White space identification
3. Defensive vs. offensive positioning
4. Maintenance cost optimization
5. Licensing opportunity assessment

SUPPORTING PERSPECTIVES:
- Contracts: Licensing agreement terms
- Litigation: Enforcement considerations
- CFO: IP valuation and investment

DELIVERABLE:
1. Portfolio strength assessment
2. Filing prioritization
3. Pruning recommendations
4. Licensing strategy
5. Competitive monitoring plan
```

#### 3. Litigation Risk Assessment
```
=== LITIGATION COUNCIL: CASE ASSESSMENT ===

MATTER:
- Case type: [CATEGORY]
- Opposing party: [NAME]
- Jurisdiction: [COURT]
- Stage: [PLEADING/DISCOVERY/TRIAL]

CLAIMS/DEFENSES:
- Plaintiff's claims: [SUMMARY]
- Our defenses: [SUMMARY]
- Counterclaims: [IF ANY]

KEY FACTS:
- Favorable: [LIST]
- Unfavorable: [LIST]
- Unknown/To be discovered: [LIST]

LITIGATION LEAD ANALYSIS:
1. Merits assessment (0-100%)
2. Damages exposure range
3. Discovery burden and risks
4. Settlement vs. trial analysis
5. Precedent implications

SUPPORTING PERSPECTIVES:
- Contracts: Agreement interpretation
- Regulatory: Regulatory implications
- CFO: Financial exposure and reserves

DELIVERABLE:
1. Case strength assessment
2. Exposure range (low/mid/high)
3. Strategy recommendation
4. Budget projection
5. Key decision milestones
```

#### 4. Regulatory Enforcement Response
```
=== REGULATORY COUNCIL: ENFORCEMENT ===

SITUATION:
[AGENCY] investigation/enforcement action

MATTER:
- Agency: [NAME]
- Investigation type: [SUBPOENA/CID/EXAMINATION]
- Subject matter: [DESCRIPTION]
- Timeline: [DATES]

DOCUMENT REQUESTS:
- Scope: [DESCRIPTION]
- Volume estimate: [DOCUMENTS]
- Privilege concerns: [AREAS]

REGULATORY LEAD ANALYSIS:
1. Exposure assessment
2. Response strategy
3. Privilege protocol
4. Proactive engagement approach
5. Settlement vs. contest analysis

SUPPORTING PERSPECTIVES:
- Litigation: Litigation preservation
- IP: Trade secret protection
- Contracts: Third-party obligations

DELIVERABLE:
1. Response strategy recommendation
2. Document collection protocol
3. Privilege log approach
4. Key personnel preparation
5. Timeline and milestones
```

#### 5. M&A Legal Due Diligence
```
=== M&A LEGAL COUNCIL ===

TRANSACTION:
- Target: [NAME]
- Deal type: [ASSET/STOCK]
- Timeline: [DATES]
- Materiality threshold: $[AMOUNT]

DUE DILIGENCE SCOPE:
- Corporate: [STATUS]
- Contracts: [STATUS]
- IP: [STATUS]
- Litigation: [STATUS]
- Regulatory: [STATUS]
- Employment: [STATUS]

FINDINGS SUMMARY:
- Material issues: [LIST]
- Disclosure schedule items: [COUNT]
- Indemnification candidates: [LIST]

MULTI-AGENT ANALYSIS:

CONTRACTS:
- Change of control provisions
- Assignment restrictions
- Key contract risks

IP:
- Ownership clarity
- Third-party claims
- Registration status

LITIGATION:
- Pending matters
- Threatened claims
- Historical patterns

REGULATORY:
- Permits and licenses
- Compliance status
- Pending proceedings

DELIVERABLE:
1. Risk summary by category
2. Deal structure implications
3. Rep and warranty recommendations
4. Indemnification requirements
5. Closing condition recommendations
```

#### 6. Trademark Clearance and Protection
```
=== IP COUNCIL: TRADEMARK ===

PROPOSAL:
New brand launch: [PROPOSED MARK]

SEARCH RESULTS:
- Identical marks: [FINDINGS]
- Similar marks: [FINDINGS]
- Common law usage: [FINDINGS]
- Domain availability: [STATUS]

INTENDED USE:
- Products/Services: [LIST]
- Geographic scope: [COUNTRIES]
- Channels: [DESCRIPTION]

IP LEAD ANALYSIS:
1. Clearance assessment (GREEN/YELLOW/RED)
2. Conflict resolution options
3. Filing strategy recommendation
4. Enforcement considerations
5. Portfolio integration

SUPPORTING PERSPECTIVES:
- Contracts: Coexistence agreements
- Litigation: Infringement risk
- Regulatory: Regulatory naming issues

DELIVERABLE:
1. Clearance recommendation
2. Risk mitigation steps
3. Filing strategy and timeline
4. Monitoring protocol
5. Budget estimate
```

#### 7. Class Action Defense Strategy
```
=== LITIGATION COUNCIL: CLASS ACTION ===

MATTER:
- Case: [NAME]
- Allegations: [SUMMARY]
- Class definition: [PROPOSED]
- Exposure: $[RANGE]

PROCEDURAL STATUS:
- Filed: [DATE]
- Class certification: [STATUS]
- Key deadlines: [LIST]

LITIGATION LEAD ANALYSIS:
1. Class certification vulnerabilities
2. Merits defenses
3. Settlement class considerations
4. MDL/coordination issues
5. Insurance coverage

SUPPORTING PERSPECTIVES:
- Regulatory: Regulatory overlay
- Contracts: Indemnification rights
- CFO: Reserve and disclosure

DELIVERABLE:
1. Defense strategy
2. Class certification opposition
3. Settlement framework
4. Communication strategy
5. Budget and timeline
```

#### 8. Privacy/Data Regulation Compliance
```
=== REGULATORY COUNCIL: PRIVACY ===

SCOPE:
Privacy compliance assessment

REGULATORY FRAMEWORK:
- GDPR applicability: [YES/NO]
- CCPA/CPRA: [YES/NO]
- Sector-specific: [LIST]
- International: [COUNTRIES]

CURRENT STATE:
- Privacy policy: [STATUS]
- Data mapping: [STATUS]
- Consent management: [STATUS]
- Data subject rights: [STATUS]
- Vendor management: [STATUS]

REGULATORY LEAD ANALYSIS:
1. Gap analysis by regulation
2. Enforcement risk assessment
3. Remediation prioritization
4. Cross-border considerations
5. Ongoing compliance program

SUPPORTING PERSPECTIVES:
- Contracts: DPA requirements
- IP: Trade secret intersection
- CISO: Technical controls

DELIVERABLE:
1. Compliance gap matrix
2. Remediation roadmap
3. Policy updates needed
4. Vendor assessment protocol
5. Training requirements
```

#### 9. Technology Licensing Negotiation
```
=== IP/CONTRACTS COUNCIL: LICENSING ===

TRANSACTION:
- Type: [INBOUND/OUTBOUND]
- Technology: [DESCRIPTION]
- Counterparty: [NAME]
- Value: $[AMOUNT]

PROPOSED TERMS:
- Grant scope: [EXCLUSIVE/NON-EXCLUSIVE]
- Field of use: [DESCRIPTION]
- Territory: [SCOPE]
- Term: [DURATION]
- Royalty: [STRUCTURE]

IP LEAD ANALYSIS:
1. IP scope clarity
2. Ownership vs. license distinction
3. Improvement clause assessment
4. Audit rights
5. Termination implications

CONTRACTS PERSPECTIVE:
1. Commercial term analysis
2. Liability allocation
3. Warranty scope
4. Change of control

DELIVERABLE:
1. Term sheet analysis
2. Negotiation priorities
3. Alternative structures
4. Risk allocation matrix
5. Precedent comparison
```

#### 10. Antitrust/Competition Review
```
=== REGULATORY COUNCIL: ANTITRUST ===

TRANSACTION/CONDUCT:
- Type: [MERGER/JV/AGREEMENT/CONDUCT]
- Parties: [NAMES]
- Markets affected: [DESCRIPTION]
- Market shares: [DATA]

JURISDICTIONS:
- US (HSR): [THRESHOLD ANALYSIS]
- EU: [THRESHOLD ANALYSIS]
- Other: [LIST]

TIMELINE:
- Signing: [DATE]
- Closing target: [DATE]
- Filing deadlines: [DATES]

REGULATORY LEAD ANALYSIS:
1. Substantive risk assessment
2. Filing requirements
3. Timeline analysis
4. Remedy considerations
5. Advocacy strategy

SUPPORTING PERSPECTIVES:
- Contracts: Closing conditions
- Litigation: Private plaintiff risk
- CFO: Regulatory cost/timing

DELIVERABLE:
1. Approval probability
2. Filing strategy
3. Remedy options
4. Timeline projection
5. Risk mitigation steps
```

---

# Part 11: Industry-Specific Council Modes (New)

## Healthcare Industry Modes

### Clinical Governance Mode
```
ID: clinical-governance
Emoji: 🏥
Prime Directive: "Patient Safety Above All"

AGENTS: CMIO (Lead), PSO, HCO, COD, Risk

BEHAVIORS:
- PSO must identify patient safety implications in every decision
- HCO must cite specific regulations (HIPAA, Joint Commission, CMS)
- CMIO must assess clinical workflow and technology impact
- COD must evaluate operational feasibility
- All agents must consider vulnerable patient populations

USE CASES:
- Clinical policy decisions
- Quality improvement initiatives
- Patient safety event response
- Care delivery model changes
- Technology implementation in clinical settings
```

### Compliance Audit Mode
```
ID: healthcare-compliance
Emoji: 📋
Prime Directive: "Document Everything, Assume Nothing"

AGENTS: HCO (Lead), PSO, CMIO, Legal, Risk

BEHAVIORS:
- HCO must cite specific CFR sections and guidance
- Every recommendation must include audit trail requirements
- Risk must quantify regulatory exposure in dollars
- Timeline must account for corrective action periods
- Include OIG, CMS, and state agency perspectives

USE CASES:
- HIPAA risk assessments
- Billing compliance reviews
- Accreditation preparation
- Audit response strategy
- Corporate integrity monitoring
```

---

## Finance Industry Modes

### Risk Committee Mode
```
ID: risk-committee
Emoji: 📊
Prime Directive: "Quantify, Stress, Prepare"

AGENTS: CRO-Finance (Lead), Quant, PM, Treasury, CFO

BEHAVIORS:
- Every risk must have a quantified metric (VaR, PD, LGD)
- Quant must run stress scenarios for major proposals
- Treasury must assess liquidity implications
- Include regulatory capital impact
- Reference Basel standards and Fed guidance

USE CASES:
- Credit decisions
- Portfolio risk reviews
- Stress testing
- Capital allocation
- Regulatory examinations
```

### Investment Committee Mode
```
ID: investment-committee
Emoji: 💰
Prime Directive: "Risk-Adjusted Returns"

AGENTS: PM (Lead), Quant, CRO-Finance, CFO, CIO

BEHAVIORS:
- PM must articulate investment thesis
- Quant must provide factor analysis
- CRO-Finance must assess credit/counterparty risk
- Include benchmark and peer comparison
- Model multiple exit scenarios

USE CASES:
- Portfolio allocation decisions
- New investment evaluation
- Performance attribution
- Strategy approval
- Fee and expense analysis
```

---

## Legal Industry Modes

### Deal Room Mode
```
ID: deal-room
Emoji: 📝
Prime Directive: "Protect the Principal, Enable the Deal"

AGENTS: Contracts (Lead), IP, Regulatory, CFO, CRO

BEHAVIORS:
- Contracts must risk-rate every material clause
- IP must verify all technology rights
- Regulatory must identify pre-closing requirements
- Include indemnification and escrow analysis
- Flag conditions precedent and closing risks

USE CASES:
- M&A transactions
- Major commercial agreements
- Joint ventures
- Licensing deals
- Strategic partnerships
```

### Litigation War Room Mode
```
ID: litigation-war-room
Emoji: ⚖️
Prime Directive: "Know the Weaknesses, Exploit the Strengths"

AGENTS: Litigation (Lead), IP, Regulatory, Contracts, Risk

BEHAVIORS:
- Litigation must provide candid case assessment
- Include best and worst case scenarios
- Analyze opponent's likely strategy
- Consider public relations implications
- Budget must include all phases through appeal

USE CASES:
- Major litigation strategy
- Class action response
- Regulatory enforcement
- IP disputes
- Settlement negotiations
```

---

# Part 12: Cross-Industry Prompt Templates

## The Industry Expert Roundtable
```
=== CROSS-INDUSTRY COUNCIL ===

DECISION: [SPECIFIC DECISION]

INDUSTRY CONTEXT: [HEALTHCARE/FINANCE/LEGAL]

Request perspectives from ALL industry agents:

HEALTHCARE PERSPECTIVE (if relevant):
- CMIO: Technology and workflow implications
- PSO: Safety and quality considerations
- HCO: Regulatory compliance
- COD: Operational efficiency

FINANCE PERSPECTIVE (if relevant):
- Quant: Quantitative risk assessment
- PM: Investment/portfolio impact
- CRO-Finance: Credit and counterparty risk
- Treasury: Liquidity and funding

LEGAL PERSPECTIVE (if relevant):
- Contracts: Contractual obligations/rights
- IP: Intellectual property implications
- Litigation: Dispute risk assessment
- Regulatory: Regulatory pathway

SYNTHESIS:
Weight perspectives based on decision type.
Identify cross-industry dependencies.
Flag areas requiring specialized external counsel.
```

## The Compliance Matrix
```
=== MULTI-REGULATORY COUNCIL ===

SITUATION: [DESCRIPTION]

REGULATORY LANDSCAPE:
□ Healthcare: HIPAA, HITECH, CMS, State DOH
□ Finance: SEC, OCC, FDIC, State regulators
□ Legal: Bar rules, judicial requirements
□ General: FTC, state AG, industry SROs

COUNCIL TASK:
Each regulatory agent identifies:
1. Applicable regulations
2. Current compliance status
3. Gap remediation priority
4. Timeline and cost estimate
5. Enforcement risk rating

DELIVERABLE:
Consolidated compliance matrix with:
- Regulation
- Requirement
- Current State
- Gap
- Priority
- Owner
- Timeline
- Budget
```

---

**Document Version:** 3.0  
**Last Updated:** November 2025  
**Classification:** Datacendia - Customer Success

*"The quality of your decisions is limited by the quality of your questions."*
