# 🧠 Council Prompts: 6-Month Loyalty Bonus Generation

**The exact prompts that generate each loyalty package.**

---

## Prompt Architecture

Each prompt activates specific Council agents and produces a personalized deliverable based on 6 months of usage data.

```
[CONTEXT BLOCK] - Company info + 6 months of usage patterns
[AGENT ACTIVATION] - Which Council members to engage
[ANALYSIS DIRECTIVES] - What to analyze
[PERSONALIZATION LAYER] - How to customize based on their usage
[OUTPUT FORMAT] - Structure of deliverable
```

---

## Master Template

```
=== COUNCIL DIRECTIVE: 6-MONTH LOYALTY PACKAGE ===

CLASSIFICATION: Complimentary Loyalty Bonus
CLIENT: {{COMPANY_NAME}}
INDUSTRY: {{INDUSTRY}}
CONTACT: {{CONTACT_NAME}}, {{CONTACT_TITLE}}
CUSTOMER SINCE: {{START_DATE}}
ANALYSIS DATE: {{DATE}}

---

USAGE CONTEXT (6 Months):
- Total deliberations run: {{COUNT}}
- Most common decision types: {{LIST}}
- Agents most frequently engaged: {{LIST}}
- Decision categories with highest volume: {{LIST}}
- Peak usage patterns: {{DESCRIPTION}}
- Features most/least used: {{LIST}}

---

PERSONALIZATION SIGNALS:
- Decisions they struggle with most: {{FROM USAGE DATA}}
- Departments most engaged: {{FROM USAGE DATA}}
- Recurring themes in deliberations: {{FROM USAGE DATA}}
- Gaps in their decision coverage: {{IDENTIFIED}}

---

ACTIVATED AGENTS:
{{Industry-specific agent list}}

---

ANALYSIS SCOPE:
{{Package-specific directives}}

---

OUTPUT REQUIREMENTS:
- Personalized to THEIR specific situation
- Reference their actual usage patterns (anonymized)
- Include specific recommendations they can act on
- Quantify impact where possible
- Name competitors/peers where relevant
- Forward-looking (next 6-12 months)

===
```

---

# FINANCIAL SERVICES PROMPTS

---

## 1A. 🏦 The Regulatory Radar

```
=== COUNCIL DIRECTIVE: REGULATORY RADAR ===

CLIENT: {{BANK_NAME}}
PACKAGE: 12-Month Forward Regulatory Calendar
FOR: Chief Risk Officer / Head of Compliance

---

USAGE CONTEXT:
{{Insert 6 months of usage data}}

Specifically note:
- Regulatory-related deliberations run
- Compliance decisions made
- Risk topics most frequently analyzed
- Regulatory bodies mentioned in deliberations

---

ACTIVATED AGENTS:
- CISO Agent (Primary): Regulatory timeline mapping
- Legal Agent: Enforcement pattern analysis
- CFO Agent: Financial impact quantification
- Strategy Agent: Peer comparison
- Risk Agent: Probability assessment

---

ANALYSIS DIRECTIVES:

1. REGULATORY CALENDAR CONSTRUCTION
For each regulation affecting this institution type:
- Identify all deadlines (next 12 months)
- Map to THEIR specific business model
- Calculate decision deadlines (working backward from compliance dates)
- Flag decisions they've already deliberated on vs. gaps

2. IMPACT PERSONALIZATION
For each regulatory item:
- Estimate financial impact on THIS institution
- Identify specific business units affected
- Map to decisions they've already run (show continuity)
- Highlight decisions they HAVEN'T run but should

3. PEER BENCHMARKING
- Compare their regulatory decision velocity to peers
- Identify where peers are ahead in preparation
- Note peer enforcement actions as warnings

4. COUNCIL INTEGRATION
For each major regulation:
- Create pre-built deliberation template
- Identify which agents should lead
- Suggest key questions to answer

---

OUTPUT FORMAT:

SECTION 1: Executive Summary
- Total regulatory decisions needed: {{N}}
- Highest priority items (next 90 days): {{LIST}}
- Estimated exposure if decisions delayed: ${{X}}

SECTION 2: 12-Month Calendar (by quarter)
For each item:
- Regulation name and deadline
- YOUR IMPACT: Specific to their institution
- DECISION DEADLINE: When they must decide
- PEER STATUS: How competitors are positioned
- COUNCIL READY: Link to pre-built deliberation

SECTION 3: Decision Load Forecast
- Decisions per quarter
- Resource requirements
- Recommended prioritization

SECTION 4: Gap Analysis
- Regulations they haven't addressed yet
- Recommended immediate actions

---

PERSONALIZATION REQUIREMENTS:
- Reference specific deliberations they've run
- Note patterns in their regulatory decision-making
- Identify blind spots based on what they HAVEN'T deliberated on
- Make it feel like we've been paying attention to them specifically

===
```

---

## 1B. 🏦 The Board Intelligence Brief

```
=== COUNCIL DIRECTIVE: BOARD INTELLIGENCE BRIEF ===

CLIENT: {{BANK_NAME}}
PACKAGE: Board-Ready Decision Performance Analysis
FOR: CEO / CFO (to share with Board)

---

USAGE CONTEXT:
{{Insert 6 months of usage data}}

Specifically note:
- Strategic decisions deliberated
- Board-level topics addressed
- Decision outcomes tracked
- Time-to-decision patterns

---

ACTIVATED AGENTS:
- Strategy Agent (Primary): Competitive positioning
- CFO Agent: Financial performance correlation
- COO Agent: Operational efficiency
- Risk Agent: Decision quality assessment

---

ANALYSIS DIRECTIVES:

1. DECISION VELOCITY BENCHMARKING
- Calculate their decision velocity by category
- Compare to 5 peer institutions (named)
- Rank their performance
- Show improvement trajectory (Month 1 vs. Month 6)

2. DECISION QUALITY ANALYSIS
- Track outcomes of decisions made via Council
- Identify patterns in successful vs. challenged decisions
- Calculate decision "win rate"

3. BOARD-READY VISUALIZATION
- Create 3-5 slides showing decision intelligence ROI
- Include peer CEO quotes about decision-making (from earnings calls)
- Quantify time saved, risk avoided, outcomes improved

4. TALKING POINTS
- Generate suggested board talking points
- Anticipate board questions about AI/decision tools
- Provide data-backed responses

---

OUTPUT FORMAT:

SECTION 1: Executive Dashboard
- Decision velocity ranking vs. peers
- Key metrics (decisions made, time saved, outcomes)
- 6-month improvement trajectory

SECTION 2: Peer Comparison
- Named peer institutions
- Side-by-side decision metrics
- Areas of advantage and gap

SECTION 3: Board Slides (3-5)
- Designed for direct board presentation
- Clean, executive-friendly visuals
- Key messages highlighted

SECTION 4: Talking Points
- "What is Datacendia?" (30-second explanation)
- "What results have we seen?" (with data)
- "What's the ROI?" (quantified)
- "What's next?" (roadmap)

---

PERSONALIZATION REQUIREMENTS:
- Use THEIR actual decision metrics
- Reference THEIR specific improvements
- Make the board proud of their AI investment

===
```

---

# HEALTHCARE PROMPTS

---

## 2A. 🏥 Physician Alignment Diagnostic

```
=== COUNCIL DIRECTIVE: PHYSICIAN ALIGNMENT DIAGNOSTIC ===

CLIENT: {{HEALTH_SYSTEM_NAME}}
PACKAGE: Physician Decision Engagement Analysis
FOR: Chief Medical Officer

---

USAGE CONTEXT:
{{Insert 6 months of usage data}}

Specifically note:
- Clinical/physician-related deliberations
- Service line decisions
- Medical staff governance decisions
- Physician participation patterns (if tracked)

---

ACTIVATED AGENTS:
- COO Agent (Primary): Operational patterns
- Strategy Agent: Service line analysis
- HR Agent: Engagement patterns
- CFO Agent: Financial impact
- Risk Agent: Quality/safety correlation

---

ANALYSIS DIRECTIVES:

1. PHYSICIAN ENGAGEMENT MAPPING
- Analyze decision participation by service line
- Identify high-engagement vs. low-engagement areas
- Correlate engagement with decision velocity
- Calculate "physician alignment score" by department

2. SERVICE LINE DECISION VELOCITY
- Map decision speed by service line
- Identify bottlenecks (physician-driven vs. admin-driven)
- Compare to high-performing health systems
- Quantify cost of misalignment

3. GOVERNANCE RECOMMENDATIONS
- Identify optimal physician decision structures
- Recommend governance improvements
- Create physician-inclusive decision templates

4. ENGAGEMENT IMPROVEMENT PLAN
- Specific interventions by service line
- Quick wins (30 days)
- Structural changes (90 days)
- Culture shifts (6+ months)

---

OUTPUT FORMAT:

SECTION 1: Alignment Score Dashboard
- Overall score with breakdown by service line
- Benchmark vs. top-quartile health systems
- Trend over 6 months

SECTION 2: Service Line Analysis
For each major service line:
- Engagement score
- Decision velocity
- Key physicians involved
- Improvement opportunities

SECTION 3: Recommendations
- Prioritized interventions
- Expected impact
- Implementation templates

SECTION 4: CMO Action Plan
- 30/60/90 day roadmap
- Quick wins to build momentum
- Metrics to track

===
```

---

## 2B. 🏥 Payer Strategy War Room

```
=== COUNCIL DIRECTIVE: PAYER STRATEGY WAR ROOM ===

CLIENT: {{HEALTH_SYSTEM_NAME}}
PACKAGE: Contract Decision Playbook
FOR: CFO (to share with Payer Contracting)

---

USAGE CONTEXT:
{{Insert 6 months of usage data}}

Specifically note:
- Financial/revenue cycle deliberations
- Payer-related decisions
- Contract negotiation topics
- Reimbursement decisions

---

ACTIVATED AGENTS:
- CFO Agent (Primary): Financial analysis
- Strategy Agent: Market positioning
- Legal Agent: Contract terms
- Risk Agent: Negotiation risk
- COO Agent: Operational impact

---

ANALYSIS DIRECTIVES:

1. CONTRACT CALENDAR MAPPING
For each major payer relationship:
- Contract expiration date
- Renewal decision deadline
- Revenue at stake
- Historical negotiation patterns

2. NEGOTIATION STRATEGY
For each upcoming renewal:
- Market position assessment
- Leverage points
- Risk factors
- Recommended strategy
- Walk-away thresholds

3. SCENARIO MODELING
For each major negotiation:
- Best case / expected / worst case outcomes
- Financial impact of each scenario
- Decision tree with recommendations

4. COUNCIL DELIBERATION PREP
For each negotiation:
- Pre-built deliberation template
- Key questions to resolve
- Data needed for negotiation

---

OUTPUT FORMAT:

SECTION 1: Contract Dashboard
- All contracts with decision deadlines
- Revenue at stake by payer
- Priority ranking

SECTION 2: Payer-by-Payer Playbooks
For each major payer:
- Relationship summary
- Leverage assessment
- Recommended strategy
- Scenario models
- Decision timeline

SECTION 3: Market Intelligence
- Regional payer dynamics
- Competitor health system positioning
- Market rate intelligence

SECTION 4: Negotiation Toolkit
- Deliberation templates ready to run
- Data requirements checklist
- Decision authority matrix

===
```

---

# PHARMACEUTICAL PROMPTS

---

## 3A. 💊 Portfolio Decision Optimizer

```
=== COUNCIL DIRECTIVE: PORTFOLIO DECISION OPTIMIZER ===

CLIENT: {{PHARMA_COMPANY}}
PACKAGE: Cross-Pipeline Decision Analysis
FOR: Chief Scientific Officer / R&D Head

---

USAGE CONTEXT:
{{Insert 6 months of usage data}}

Specifically note:
- Pipeline-related deliberations
- Stage-gate decisions
- Resource allocation decisions
- Asset-specific analyses

---

ACTIVATED AGENTS:
- Strategy Agent (Primary): Portfolio optimization
- CFO Agent: Capital allocation
- COO Agent: Resource constraints
- Risk Agent: Probability-weighted outcomes
- Legal Agent: IP and regulatory timing

---

ANALYSIS DIRECTIVES:

1. DEPENDENCY MAPPING
- Map all decision dependencies across pipeline
- Identify critical path decisions
- Calculate downstream impact of each pending decision
- Visualize decision network

2. RESOURCE CONFLICT ANALYSIS
- Identify resource contentions (CMC, regulatory, clinical ops)
- Map team allocation across assets
- Flag overcommitment risks
- Recommend reallocation

3. OPTIMAL SEQUENCING
- Recommend decision order based on:
  - Dependency chains
  - Resource availability
  - Market timing
  - Risk-adjusted value
- Show value of optimized sequence vs. current approach

4. STAGE-GATE TEMPLATES
For each asset approaching a gate:
- Pre-built deliberation template
- Key questions to resolve
- Data requirements
- Recommended participants

---

OUTPUT FORMAT:

SECTION 1: Decision Dependency Map
- Visual network of pipeline decisions
- Critical path highlighted
- Bottlenecks identified

SECTION 2: Resource Optimization
- Current allocation vs. optimal
- Conflict resolution recommendations
- Team capacity planning

SECTION 3: Decision Sequence Recommendation
- Prioritized decision list
- Rationale for each
- Value impact of sequencing

SECTION 4: Asset-by-Asset Templates
- Deliberation templates ready to run
- Gate-specific frameworks

===
```

---

## 3B. 💊 Regulatory Intelligence Dossier

```
=== COUNCIL DIRECTIVE: REGULATORY INTELLIGENCE DOSSIER ===

CLIENT: {{PHARMA_COMPANY}}
PACKAGE: FDA Decision Pattern Analysis
FOR: Chief Regulatory Officer (to share with Regulatory Affairs)

---

USAGE CONTEXT:
{{Insert 6 months of usage data}}

Specifically note:
- Regulatory-related deliberations
- FDA interaction decisions
- Submission timing decisions
- Advisory committee discussions

---

ACTIVATED AGENTS:
- Legal Agent (Primary): Regulatory analysis
- Strategy Agent: Competitive positioning
- Risk Agent: Approval probability
- COO Agent: Submission operations

---

ANALYSIS DIRECTIVES:

1. FDA DIVISION ANALYSIS
For divisions relevant to their pipeline:
- Review time patterns
- Approval rates
- Common deficiency themes
- Reviewer tendencies (where discernible)

2. ASSET POSITIONING
For each of their assets:
- Approval probability estimate
- Key risk factors
- Decision points before submission
- Recommended mitigation actions

3. COMPETITIVE TIMELINE
- Map competitor regulatory timelines
- Identify market position implications
- Flag windows opening/closing
- Recommend timing decisions

4. DECISION STRATEGY
For each asset:
- Recommended regulatory path
- Key decisions needed
- Timeline with decision deadlines
- AdComm preparation (if applicable)

---

OUTPUT FORMAT:

SECTION 1: Division Intelligence
- Patterns by relevant FDA division
- Historical data visualization
- Implications for their assets

SECTION 2: Asset Regulatory Roadmaps
For each asset:
- Current status
- Probability assessment
- Key decisions needed
- Recommended actions

SECTION 3: Competitive Landscape
- Competitor timeline visualization
- Market position implications
- Window analysis

SECTION 4: Decision Calendar
- All regulatory decisions needed
- Deadlines and dependencies
- Resource requirements

===
```

---

# INSURANCE PROMPTS

---

## 4A. 🛡️ Claims Decision Accelerator

```
=== COUNCIL DIRECTIVE: CLAIMS DECISION ACCELERATOR ===

CLIENT: {{INSURANCE_COMPANY}}
PACKAGE: Claims Decision Optimization
FOR: Chief Claims Officer

---

USAGE CONTEXT:
{{Insert 6 months of usage data}}

Specifically note:
- Claims-related deliberations
- Loss ratio discussions
- Litigation decisions
- Adjuster patterns

---

ACTIVATED AGENTS:
- COO Agent (Primary): Operational analysis
- CFO Agent: Financial impact
- Legal Agent: Litigation exposure
- Risk Agent: Pattern detection
- HR Agent: Personnel performance

---

ANALYSIS DIRECTIVES:

1. DECISION VELOCITY ANALYSIS
- Calculate decision time by claim type
- Benchmark vs. industry
- Identify outliers (fast and slow)
- Correlate with outcomes

2. LITIGATION EXPOSURE
- Map claims in "danger zone" (>21 days)
- Calculate litigation probability by days pending
- Estimate exposure value
- Prioritize intervention

3. ADJUSTER BENCHMARKING
- Decision velocity by adjuster
- Quality outcomes by adjuster
- Identify top performers to model
- Flag training opportunities

4. AUTHORITY OPTIMIZATION
- Current authority thresholds
- Bottleneck analysis
- Recommended new thresholds
- Expected efficiency gain

---

OUTPUT FORMAT:

SECTION 1: Claims Decision Dashboard
- Overall metrics
- Trend over 6 months
- Benchmark comparison

SECTION 2: Risk Exposure Analysis
- Claims requiring immediate attention
- Litigation exposure quantification
- Prioritized action list

SECTION 3: Performance Analysis
- Adjuster benchmarking
- Best practices from top performers
- Training recommendations

SECTION 4: Authority Recommendations
- New threshold recommendations
- Expected impact
- Implementation plan

===
```

---

## 4B. 🛡️ Underwriting Decision Playbook

```
=== COUNCIL DIRECTIVE: UNDERWRITING DECISION PLAYBOOK ===

CLIENT: {{INSURANCE_COMPANY}}
PACKAGE: Underwriting Decision Optimization
FOR: Chief Underwriting Officer (to share with Underwriting)

---

USAGE CONTEXT:
{{Insert 6 months of usage data}}

Specifically note:
- Underwriting deliberations
- Risk appetite decisions
- Pricing decisions
- Competitive discussions

---

ACTIVATED AGENTS:
- Risk Agent (Primary): Risk analysis
- CFO Agent: Profitability analysis
- CRO Agent: Conversion analysis
- Strategy Agent: Competitive positioning
- COO Agent: Operational efficiency

---

ANALYSIS DIRECTIVES:

1. SPEED-CONVERSION ANALYSIS
- Decision time by risk tier
- Conversion rate by decision speed
- Revenue impact quantification
- Optimal speed targets

2. COMPETITIVE BENCHMARKING
- Competitor decision velocity
- Market positioning
- Win/loss patterns
- Speed-driven losses

3. AUTHORITY OPTIMIZATION
- Current decision authority matrix
- Bottleneck analysis
- Recommended adjustments
- Risk-adjusted speed targets

4. RISK-SPEED BALANCE
- Where to accelerate (low risk, high volume)
- Where to maintain rigor (high risk, complex)
- Automation opportunities
- Human-in-loop requirements

---

OUTPUT FORMAT:

SECTION 1: Decision-Conversion Analytics
- Speed vs. conversion visualization
- Revenue impact quantification
- Target setting

SECTION 2: Competitive Intelligence
- Speed benchmarking
- Market position
- Win-back opportunities

SECTION 3: Authority Matrix Recommendations
- New authority levels
- By risk tier
- By premium size
- Expected efficiency gain

SECTION 4: Implementation Playbook
- Quick wins (immediate)
- Process changes (30-60 days)
- System requirements (90+ days)

===
```

---

# MANUFACTURING PROMPTS

---

## 5A. 🏭 Capacity Decision Simulator

```
=== COUNCIL DIRECTIVE: CAPACITY DECISION SIMULATOR ===

CLIENT: {{MANUFACTURER}}
PACKAGE: Scenario-Based Capacity Planning
FOR: COO / VP Operations

---

USAGE CONTEXT:
{{Insert 6 months of usage data}}

Specifically note:
- Capacity-related deliberations
- Demand planning discussions
- Capital investment decisions
- Workforce decisions

---

ACTIVATED AGENTS:
- COO Agent (Primary): Operations analysis
- CFO Agent: Capital allocation
- Risk Agent: Scenario modeling
- Strategy Agent: Market assessment
- HR Agent: Workforce planning

---

ANALYSIS DIRECTIVES:

1. DEMAND SCENARIO MODELING
Build 3-5 scenarios based on:
- Historical patterns from their deliberations
- Market signals discussed
- Customer dynamics mentioned
- Economic factors

2. CAPACITY GAP ANALYSIS
For each scenario:
- When capacity constraints hit
- Which lines/facilities affected
- Decision deadline to respond
- Cost of delay

3. DECISION TREES
For each major capacity decision:
- Decision points and timing
- Options at each node
- Outcomes and probabilities
- Recommended path

4. RESOURCE PLANNING
- Workforce decisions by scenario
- Capital decisions by scenario
- Lead time requirements
- Decision calendar

---

OUTPUT FORMAT:

SECTION 1: Scenario Overview
- 3-5 demand scenarios
- Probability assessment
- Key drivers

SECTION 2: Capacity Analysis
For each scenario:
- Capacity timeline
- Gap identification
- Decision deadlines

SECTION 3: Decision Trees
- Visual decision frameworks
- Recommended paths
- Trigger points

SECTION 4: 12-Month Decision Calendar
- All capacity decisions
- By scenario triggers
- Resource requirements

===
```

---

## 5B. 🏭 Supplier Decision Intelligence

```
=== COUNCIL DIRECTIVE: SUPPLIER DECISION INTELLIGENCE ===

CLIENT: {{MANUFACTURER}}
PACKAGE: Supplier Risk & Decision Brief
FOR: Chief Procurement Officer (to share with Supply Chain)

---

USAGE CONTEXT:
{{Insert 6 months of usage data}}

Specifically note:
- Supply chain deliberations
- Supplier-related decisions
- Risk discussions
- Sourcing decisions

---

ACTIVATED AGENTS:
- COO Agent (Primary): Supply chain analysis
- Risk Agent: Supplier risk assessment
- CFO Agent: Cost impact
- Strategy Agent: Alternative sourcing
- CISO Agent: Compliance/geopolitical

---

ANALYSIS DIRECTIVES:

1. SUPPLIER HEALTH ASSESSMENT
For top 20 critical suppliers:
- Financial health signals
- Operational reliability
- Geopolitical exposure
- Relationship quality

2. DECISION TRIGGERS
For each at-risk supplier:
- What would trigger action
- What action to take
- Lead time for alternatives
- Decision deadline

3. ALTERNATIVE READINESS
- Backup supplier status
- Qualification progress
- Activation timeline
- Cost implications

4. CONTRACT DECISIONS
- Renewal calendar
- Negotiation priorities
- Leverage assessment
- Recommended strategies

---

OUTPUT FORMAT:

SECTION 1: Supplier Health Dashboard
- Risk matrix visualization
- Trend indicators
- Priority alerts

SECTION 2: Supplier Playbooks
For each critical supplier:
- Health assessment
- Decision triggers
- Contingency plans
- Timeline

SECTION 3: Alternative Sourcing Status
- Backup readiness
- Qualification pipeline
- Gap analysis

SECTION 4: Contract Calendar
- Decision timeline
- Negotiation strategies
- Priority ranking

===
```

---

# RETAIL PROMPTS

---

## 6A. 🛒 Seasonal Decision Playbook

```
=== COUNCIL DIRECTIVE: SEASONAL DECISION PLAYBOOK ===

CLIENT: {{RETAILER}}
PACKAGE: 12-Month Seasonal Decision Calendar
FOR: Chief Merchandising Officer

---

USAGE CONTEXT:
{{Insert 6 months of usage data}}

Specifically note:
- Merchandising deliberations
- Seasonal planning decisions
- Inventory decisions
- Promotional decisions

---

ACTIVATED AGENTS:
- CRO Agent (Primary): Revenue optimization
- COO Agent: Operations planning
- CFO Agent: Inventory investment
- Strategy Agent: Competitive timing
- Risk Agent: Demand uncertainty

---

ANALYSIS DIRECTIVES:

1. SEASONAL CALENDAR MAPPING
For each major season/event:
- Decision categories needed
- Optimal decision timing
- Historical patterns (from their deliberations)
- Competitor timing benchmarks

2. DECISION VELOCITY ANALYSIS
- Current decision timing vs. optimal
- Gap quantification (days late)
- Revenue impact of late decisions
- Improvement trajectory

3. PLAYBOOK BY SEASON
For each season:
- Complete decision checklist
- Optimal timing for each decision
- Dependencies between decisions
- Risk factors

4. COMPETITOR INTELLIGENCE
- Competitor decision patterns observed
- Where competitors decide faster
- Implications for timing

---

OUTPUT FORMAT:

SECTION 1: Master Calendar
- Visual 12-month view
- All decision categories
- Timing benchmarks

SECTION 2: Season-by-Season Playbooks
For each major season:
- Decision checklist
- Timing guidance
- Dependencies
- Risk mitigation

SECTION 3: Performance Analysis
- Your decision timing vs. optimal
- Improvement areas
- Quick wins

SECTION 4: Competitor Timing Intelligence
- Where they beat you
- Where you lead
- Opportunities

===
```

---

## 6B. 🛒 Store Portfolio Decision Model

```
=== COUNCIL DIRECTIVE: STORE PORTFOLIO DECISION MODEL ===

CLIENT: {{RETAILER}}
PACKAGE: Store-by-Store Decision Analysis
FOR: Head of Real Estate (to share with Operations)

---

USAGE CONTEXT:
{{Insert 6 months of usage data}}

Specifically note:
- Store-related deliberations
- Real estate decisions
- Performance discussions
- Location decisions

---

ACTIVATED AGENTS:
- CFO Agent (Primary): Store economics
- Strategy Agent: Portfolio optimization
- COO Agent: Operations analysis
- Risk Agent: Market risk
- CRO Agent: Revenue potential

---

ANALYSIS DIRECTIVES:

1. STORE DECISION MATRIX
For each store:
- Performance metrics
- Decision category (invest/maintain/decide)
- Rationale
- Priority ranking

2. INVESTMENT DECISIONS
For high-potential stores:
- Investment recommendations
- Expected ROI
- Timeline
- Decision deadline

3. EXIT DECISIONS
For underperformers:
- Closure recommendations
- Lease alignment
- Transition plan
- Decision deadline

4. EXPANSION OPPORTUNITIES
- Market analysis
- Location recommendations
- Priority ranking
- Decision framework

---

OUTPUT FORMAT:

SECTION 1: Portfolio Dashboard
- Store categorization
- Performance visualization
- Decision urgency

SECTION 2: Store-Level Analysis
For each store requiring decision:
- Performance data
- Recommendation
- Action plan
- Timeline

SECTION 3: Lease Calendar
- Upcoming lease decisions
- Recommendations
- Negotiation strategies

SECTION 4: Expansion Roadmap
- Market opportunities
- Priority ranking
- Decision criteria

===
```

---

# ENERGY PROMPTS

---

## 7A. ⚡ Rate Case War Room

```
=== COUNCIL DIRECTIVE: RATE CASE WAR ROOM ===

CLIENT: {{UTILITY}}
PACKAGE: Rate Case Decision Strategy
FOR: VP Regulatory Affairs

---

USAGE CONTEXT:
{{Insert 6 months of usage data}}

Specifically note:
- Regulatory deliberations
- Rate case discussions
- Commission interactions
- Financial decisions

---

ACTIVATED AGENTS:
- Legal Agent (Primary): Regulatory strategy
- CFO Agent: Financial analysis
- Strategy Agent: Positioning
- Risk Agent: Outcome probabilities
- COO Agent: Operational support

---

ANALYSIS DIRECTIVES:

1. CASE TIMELINE MANAGEMENT
- All milestones and deadlines
- Decision points at each stage
- Resource requirements
- Risk factors

2. INTERVENOR ANALYSIS
For each intervenor:
- Position assessment
- Threat level
- Counter-strategy
- Settlement potential

3. SETTLEMENT STRATEGY
- Settlement decision framework
- Authority requirements
- Optimal settlement range
- Walk-away thresholds

4. COMMISSIONER ANALYSIS
- Decision patterns
- Key concerns
- Persuasion strategies
- Risk assessment

---

OUTPUT FORMAT:

SECTION 1: Case Dashboard
- Timeline visualization
- Current status
- Upcoming decisions

SECTION 2: Intervenor Playbooks
For each major intervenor:
- Position analysis
- Counter-strategy
- Settlement potential

SECTION 3: Settlement Decision Framework
- Range recommendations
- Authority matrix
- Scenario outcomes

SECTION 4: Commission Strategy
- Commissioner profiles
- Key messages
- Hearing preparation

===
```

---

## 7B. ⚡ Grid Investment Optimizer

```
=== COUNCIL DIRECTIVE: GRID INVESTMENT OPTIMIZER ===

CLIENT: {{UTILITY}}
PACKAGE: Capital Decision Prioritization
FOR: VP Grid Operations (to share with Engineering)

---

USAGE CONTEXT:
{{Insert 6 months of usage data}}

Specifically note:
- Capital project deliberations
- Grid reliability discussions
- Investment decisions
- Resource allocation

---

ACTIVATED AGENTS:
- COO Agent (Primary): Operations analysis
- CFO Agent: Capital allocation
- Risk Agent: Reliability assessment
- Strategy Agent: Funding optimization
- CISO Agent: Regulatory compliance

---

ANALYSIS DIRECTIVES:

1. PROJECT PRIORITIZATION
For all capital projects:
- Priority ranking criteria
- Scoring methodology
- Tier assignments
- Rationale

2. FUNDING ALIGNMENT
- Federal funding opportunities
- Window analysis
- Application decisions
- Deadline mapping

3. RESOURCE OPTIMIZATION
- Engineering capacity
- Contractor availability
- Sequencing recommendations
- Conflict resolution

4. DECISION DEPENDENCIES
- Project interdependencies
- Critical path
- Unlock analysis
- Sequencing value

---

OUTPUT FORMAT:

SECTION 1: Priority Dashboard
- Project tier assignments
- Funding alignment
- Decision urgency

SECTION 2: Project Details
For each major project:
- Priority rationale
- Funding opportunities
- Resource requirements
- Timeline

SECTION 3: Resource Plan
- Capacity allocation
- Conflict resolution
- Sequencing recommendations

SECTION 4: Funding Roadmap
- Federal opportunities
- Application decisions
- Deadline calendar

===
```

---

# TECHNOLOGY PROMPTS

---

## 8A. 💻 Roadmap Decision Accelerator

```
=== COUNCIL DIRECTIVE: ROADMAP DECISION ACCELERATOR ===

CLIENT: {{TECH_COMPANY}}
PACKAGE: Product Decision Velocity Optimization
FOR: VP Product / CPO

---

USAGE CONTEXT:
{{Insert 6 months of usage data}}

Specifically note:
- Product deliberations
- Feature decisions
- Prioritization discussions
- Resource allocation

---

ACTIVATED AGENTS:
- Strategy Agent (Primary): Product strategy
- COO Agent: Delivery operations
- CRO Agent: Revenue impact
- HR Agent: Resource constraints
- Risk Agent: Market timing

---

ANALYSIS DIRECTIVES:

1. DECISION FUNNEL ANALYSIS
- Map feature decision stages
- Calculate time at each stage
- Identify bottlenecks
- Benchmark vs. competitors

2. BOTTLENECK DIAGNOSIS
For each bottleneck:
- Root cause analysis
- Decision authority gaps
- Process issues
- Recommendations

3. AUTHORITY OPTIMIZATION
- Current decision rights
- Recommended changes
- Expected velocity gain
- Implementation plan

4. COMPETITOR VELOCITY
- Release frequency comparison
- Decision speed implications
- Market timing risks
- Recommendations

---

OUTPUT FORMAT:

SECTION 1: Decision Funnel Dashboard
- Stage-by-stage metrics
- Bottleneck visualization
- Trend analysis

SECTION 2: Bottleneck Analysis
For each bottleneck:
- Root cause
- Solution
- Expected impact

SECTION 3: Authority Recommendations
- New decision rights
- By decision type
- Implementation plan

SECTION 4: Competitive Context
- Velocity benchmarks
- Market implications
- Strategic recommendations

===
```

---

## 8B. 💻 GTM Decision Alignment

```
=== COUNCIL DIRECTIVE: GTM DECISION ALIGNMENT ===

CLIENT: {{TECH_COMPANY}}
PACKAGE: Sales/Marketing Decision Optimization
FOR: CRO (to share with Sales & Marketing)

---

USAGE CONTEXT:
{{Insert 6 months of usage data}}

Specifically note:
- GTM deliberations
- Pricing decisions
- Territory discussions
- Campaign decisions

---

ACTIVATED AGENTS:
- CRO Agent (Primary): Revenue analysis
- Strategy Agent: Market positioning
- COO Agent: Operations efficiency
- CFO Agent: Financial impact
- HR Agent: Sales productivity

---

ANALYSIS DIRECTIVES:

1. ALIGNMENT ASSESSMENT
- Sales/Marketing decision alignment score
- Areas of friction
- Cost of misalignment
- Priority gaps

2. PRICING DECISIONS
- Decision velocity
- Escalation patterns
- Competitive response speed
- Recommendations

3. TERRITORY DECISIONS
- Current effectiveness
- Market coverage gaps
- Rebalancing recommendations
- Decision timeline

4. CAMPAIGN DECISIONS
- Approval velocity
- Market windows missed
- Template recommendations
- Authority optimization

---

OUTPUT FORMAT:

SECTION 1: Alignment Dashboard
- Score by dimension
- Trend over 6 months
- Priority gaps

SECTION 2: Decision Area Analysis
For each area:
- Current state
- Gap impact
- Recommendations

SECTION 3: Authority Optimization
- New decision rights
- By function
- Expected impact

SECTION 4: Implementation Roadmap
- Quick wins
- Process changes
- Metrics to track

===
```

---

# REAL ESTATE PROMPTS

---

## 9A. 🏗️ Deal Decision Dashboard

```
=== COUNCIL DIRECTIVE: DEAL DECISION DASHBOARD ===

CLIENT: {{DEVELOPER}}
PACKAGE: Deal Pipeline Decision Optimization
FOR: Chief Investment Officer

---

USAGE CONTEXT:
{{Insert 6 months of usage data}}

---

ACTIVATED AGENTS:
- CFO Agent (Primary): Financial analysis
- Strategy Agent: Market assessment
- Risk Agent: Deal risk
- Legal Agent: Transaction issues
- COO Agent: Development capacity

---

ANALYSIS DIRECTIVES:

1. PIPELINE STAGE ANALYSIS
- Decision velocity by stage
- Bottleneck identification
- Benchmark comparison
- Improvement opportunities

2. DEAL PRIORITIZATION
- Risk-adjusted returns
- Decision urgency
- Resource requirements
- Recommendations

3. RATE SCENARIO MODELING
- Interest rate sensitivity
- Deal viability thresholds
- Decision implications
- Hedging recommendations

4. COMPETITIVE INTELLIGENCE
- Competitor deal activity
- Market position
- Timing implications

---

OUTPUT FORMAT:

SECTION 1: Pipeline Dashboard
- Stage metrics
- Decision velocity
- Priority deals

SECTION 2: Deal Analysis
For priority deals:
- Status
- Decision needs
- Recommendations

SECTION 3: Rate Scenarios
- Sensitivity analysis
- Decision triggers
- Timing recommendations

SECTION 4: Market Context
- Competitor activity
- Window analysis
- Strategic implications

===
```

---

## 9B. 🏗️ Construction Decision Tracker

```
=== COUNCIL DIRECTIVE: CONSTRUCTION DECISION TRACKER ===

CLIENT: {{DEVELOPER}}
PACKAGE: Project Decision Optimization
FOR: VP Construction (to share with Project Managers)

---

USAGE CONTEXT:
{{Insert 6 months of usage data}}

---

ACTIVATED AGENTS:
- COO Agent (Primary): Project operations
- CFO Agent: Cost impact
- Risk Agent: Schedule risk
- Legal Agent: Contract issues
- HR Agent: Resource management

---

ANALYSIS DIRECTIVES:

1. PROJECT DECISION STATUS
- Decision backlog by project
- Velocity metrics
- Bottleneck analysis
- Priority ranking

2. CHANGE ORDER DECISIONS
- Processing time
- Cost impact
- Authority gaps
- Recommendations

3. RFI PATTERNS
- Response velocity
- Contractor comparison
- Schedule impact
- Improvement plan

4. RESOURCE DECISIONS
- Allocation efficiency
- Conflict identification
- Optimization recommendations

---

OUTPUT FORMAT:

SECTION 1: Project Dashboard
- Decision status by project
- Risk indicators
- Priority actions

SECTION 2: Decision Analysis
By decision type:
- Velocity metrics
- Impact quantification
- Recommendations

SECTION 3: Contractor Performance
- Decision metrics by contractor
- Benchmarking
- Management recommendations

SECTION 4: Process Improvements
- Authority recommendations
- Workflow changes
- Expected impact

===
```

---

# LOGISTICS PROMPTS

---

## 10A. 🚚 Network Decision Optimizer

```
=== COUNCIL DIRECTIVE: NETWORK DECISION OPTIMIZER ===

CLIENT: {{LOGISTICS_COMPANY}}
PACKAGE: Network Decision Analysis
FOR: VP Network Planning

---

USAGE CONTEXT:
{{Insert 6 months of usage data}}

---

ACTIVATED AGENTS:
- COO Agent (Primary): Network operations
- CFO Agent: Cost optimization
- Strategy Agent: Market positioning
- Risk Agent: Service risk
- HR Agent: Workforce implications

---

ANALYSIS DIRECTIVES:

1. ROUTE DECISION ANALYSIS
- Efficiency opportunities
- Cost savings potential
- Decision requirements
- Implementation timeline

2. HUB DECISIONS
- Capacity analysis
- Location optimization
- Investment needs
- Decision timeline

3. SEASONAL PLANNING
- Capacity decisions
- Timing requirements
- Resource implications
- Risk factors

4. COMPETITIVE POSITIONING
- Network comparison
- Service level implications
- Strategic decisions

---

OUTPUT FORMAT:

SECTION 1: Network Dashboard
- Efficiency metrics
- Opportunity identification
- Priority decisions

SECTION 2: Route Optimization
- Specific opportunities
- Savings quantification
- Implementation plan

SECTION 3: Hub Analysis
- Capacity status
- Decision recommendations
- Investment requirements

SECTION 4: Strategic Roadmap
- Priority decisions
- Timeline
- Expected impact

===
```

---

## 10B. 🚚 Driver Decision Playbook

```
=== COUNCIL DIRECTIVE: DRIVER DECISION PLAYBOOK ===

CLIENT: {{LOGISTICS_COMPANY}}
PACKAGE: Workforce Decision Optimization
FOR: VP Operations (to share with HR)

---

USAGE CONTEXT:
{{Insert 6 months of usage data}}

---

ACTIVATED AGENTS:
- HR Agent (Primary): Workforce analysis
- COO Agent: Operations impact
- CFO Agent: Cost analysis
- Risk Agent: Retention risk
- Strategy Agent: Market competitiveness

---

ANALYSIS DIRECTIVES:

1. RETENTION DECISIONS
- At-risk driver identification
- Intervention recommendations
- Cost-benefit analysis
- Decision priorities

2. HIRING DECISIONS
- Velocity analysis
- Process optimization
- Competitive positioning
- Recommendations

3. COMPENSATION DECISIONS
- Market benchmarking
- ROI analysis
- Decision framework
- Implementation plan

4. SCHEDULING DECISIONS
- Satisfaction correlation
- Optimization opportunities
- System requirements
- Expected impact

---

OUTPUT FORMAT:

SECTION 1: Workforce Dashboard
- Retention metrics
- Hiring velocity
- Satisfaction indicators

SECTION 2: Retention Analysis
- At-risk identification
- Intervention recommendations
- ROI projections

SECTION 3: Compensation Strategy
- Market positioning
- Recommended adjustments
- Financial impact

SECTION 4: Operational Improvements
- Scheduling optimization
- Process changes
- Expected outcomes

===
```

---

# MEDIA PROMPTS

---

## 11A. 📺 Content ROI Framework

```
=== COUNCIL DIRECTIVE: CONTENT ROI FRAMEWORK ===

CLIENT: {{MEDIA_COMPANY}}
PACKAGE: Content Decision Optimization
FOR: Chief Content Officer

---

USAGE CONTEXT:
{{Insert 6 months of usage data}}

---

ACTIVATED AGENTS:
- Strategy Agent (Primary): Content strategy
- CFO Agent: ROI analysis
- CRO Agent: Revenue optimization
- Risk Agent: Performance prediction
- COO Agent: Production operations

---

ANALYSIS DIRECTIVES:

1. INVESTMENT EFFICIENCY
- ROI by content type/genre
- Decision velocity correlation
- Optimization opportunities
- Recommendations

2. GREENLIGHT PATTERNS
- Success factor analysis
- Decision framework optimization
- Risk indicators
- Best practices

3. TALENT DECISIONS
- Deal effectiveness
- ROI by deal type
- Optimization recommendations
- Negotiation strategies

4. RENEWAL/CANCEL FRAMEWORK
- Decision criteria optimization
- Threshold calibration
- Process improvements
- Expected impact

---

OUTPUT FORMAT:

SECTION 1: ROI Dashboard
- Performance by category
- Decision velocity impact
- Trend analysis

SECTION 2: Investment Optimization
- Genre/type recommendations
- Decision framework
- Resource allocation

SECTION 3: Talent Strategy
- Deal analysis
- Recommendations
- Negotiation playbook

SECTION 4: Decision Framework
- Greenlight criteria
- Renewal thresholds
- Process improvements

===
```

---

## 11B. 📺 Audience Decision Intelligence

```
=== COUNCIL DIRECTIVE: AUDIENCE DECISION INTELLIGENCE ===

CLIENT: {{MEDIA_COMPANY}}
PACKAGE: Audience-Driven Decision Optimization
FOR: Chief Marketing Officer (to share with Marketing)

---

USAGE CONTEXT:
{{Insert 6 months of usage data}}

---

ACTIVATED AGENTS:
- CRO Agent (Primary): Revenue/audience analysis
- Strategy Agent: Market positioning
- COO Agent: Operations timing
- Risk Agent: Competitive risk

---

ANALYSIS DIRECTIVES:

1. AUDIENCE RESPONSE PATTERNS
- Decision timing impact
- Optimal windows
- Competitor comparison
- Recommendations

2. CAMPAIGN DECISIONS
- Velocity analysis
- Window capture
- Authority optimization
- Template recommendations

3. PLATFORM DECISIONS
- Mix optimization
- Audience alignment
- Resource allocation
- Transition strategy

4. COMPETITIVE TIMING
- Response velocity
- Market windows
- Strategic recommendations

---

OUTPUT FORMAT:

SECTION 1: Audience Response Dashboard
- Timing impact visualization
- Optimal windows
- Gap analysis

SECTION 2: Campaign Optimization
- Velocity improvements
- Authority recommendations
- Template library

SECTION 3: Platform Strategy
- Mix recommendations
- Transition plan
- Resource implications

SECTION 4: Competitive Positioning
- Speed benchmarks
- Window analysis
- Action plan

===
```

---

# PROFESSIONAL SERVICES PROMPTS

---

## 12A. ⚖️ Client Development Engine

```
=== COUNCIL DIRECTIVE: CLIENT DEVELOPMENT ENGINE ===

CLIENT: {{FIRM}}
PACKAGE: Client Decision Optimization
FOR: Managing Partner

---

USAGE CONTEXT:
{{Insert 6 months of usage data}}

---

ACTIVATED AGENTS:
- CRO Agent (Primary): Revenue analysis
- Strategy Agent: Client strategy
- Risk Agent: Relationship risk
- HR Agent: Partner engagement
- CFO Agent: Profitability analysis

---

ANALYSIS DIRECTIVES:

1. CLIENT HEALTH ASSESSMENT
- Portfolio segmentation
- Growth opportunities
- Risk identification
- Priority actions

2. PITCH DECISIONS
- Velocity analysis
- Win rate correlation
- Process optimization
- Recommendations

3. CROSS-SELL DECISIONS
- Opportunity identification
- Decision requirements
- Priority ranking
- Action plans

4. RELATIONSHIP DECISIONS
- Partner touch requirements
- Risk mitigation
- Resource allocation
- Timeline

---

OUTPUT FORMAT:

SECTION 1: Client Health Dashboard
- Segmentation
- Risk indicators
- Opportunities

SECTION 2: Growth Opportunities
- Cross-sell pipeline
- Priority ranking
- Action plans

SECTION 3: At-Risk Clients
- Risk assessment
- Intervention recommendations
- Owner assignments

SECTION 4: Decision Velocity
- Pitch optimization
- Win rate improvement
- Process recommendations

===
```

---

## 12B. ⚖️ Talent Pipeline Tracker

```
=== COUNCIL DIRECTIVE: TALENT PIPELINE TRACKER ===

CLIENT: {{FIRM}}
PACKAGE: Talent Decision Optimization
FOR: Chief Talent Officer (to share with Practice Leaders)

---

USAGE CONTEXT:
{{Insert 6 months of usage data}}

---

ACTIVATED AGENTS:
- HR Agent (Primary): Talent analysis
- CFO Agent: Compensation analysis
- Risk Agent: Retention risk
- Strategy Agent: Market positioning
- COO Agent: Capacity planning

---

ANALYSIS DIRECTIVES:

1. RECRUITING DECISIONS
- Velocity analysis
- Competitive positioning
- Process optimization
- Recommendations

2. PROMOTION DECISIONS
- Timeline analysis
- Retention correlation
- Best practices
- Recommendations

3. RETENTION DECISIONS
- At-risk identification
- Intervention strategies
- Cost-benefit analysis
- Priority actions

4. SUCCESSION DECISIONS
- Gap identification
- Development requirements
- Timeline
- Action plans

---

OUTPUT FORMAT:

SECTION 1: Talent Dashboard
- Pipeline metrics
- Risk indicators
- Decision needs

SECTION 2: Recruiting Optimization
- Velocity improvements
- Competitive positioning
- Process changes

SECTION 3: Retention Strategy
- At-risk identification
- Intervention playbooks
- ROI analysis

SECTION 4: Succession Planning
- Gap analysis
- Development recommendations
- Timeline

===
```

---

# HIGHER EDUCATION PROMPTS

---

## 13A. 🎓 Enrollment Decision Optimizer

```
=== COUNCIL DIRECTIVE: ENROLLMENT DECISION OPTIMIZER ===

CLIENT: {{UNIVERSITY}}
PACKAGE: Enrollment Decision Optimization
FOR: VP Enrollment Management

---

USAGE CONTEXT:
{{Insert 6 months of usage data}}

---

ACTIVATED AGENTS:
- Strategy Agent (Primary): Enrollment strategy
- CFO Agent: Financial aid optimization
- CRO Agent: Yield optimization
- Risk Agent: Enrollment risk
- COO Agent: Operations efficiency

---

ANALYSIS DIRECTIVES:

1. DECISION FUNNEL ANALYSIS
- Stage-by-stage metrics
- Velocity benchmarking
- Yield correlation
- Improvement opportunities

2. TIMING OPTIMIZATION
- Decision speed impact
- Competitor comparison
- Revenue implications
- Recommendations

3. FINANCIAL AID DECISIONS
- Velocity analysis
- Yield impact
- Process optimization
- Authority recommendations

4. FORECASTING DECISIONS
- Accuracy analysis
- Adjustment recommendations
- Risk mitigation
- Planning improvements

---

OUTPUT FORMAT:

SECTION 1: Enrollment Dashboard
- Funnel metrics
- Velocity benchmarks
- Yield analysis

SECTION 2: Timing Optimization
- Decision speed recommendations
- Competitive positioning
- Revenue impact

SECTION 3: Financial Aid Strategy
- Process improvements
- Authority optimization
- Yield enhancement

SECTION 4: Forecasting Framework
- Accuracy improvements
- Risk mitigation
- Planning recommendations

===
```

---

## 13B. 🎓 Academic Portfolio Framework

```
=== COUNCIL DIRECTIVE: ACADEMIC PORTFOLIO FRAMEWORK ===

CLIENT: {{UNIVERSITY}}
PACKAGE: Program Decision Optimization
FOR: Provost (to share with Deans)

---

USAGE CONTEXT:
{{Insert 6 months of usage data}}

---

ACTIVATED AGENTS:
- Strategy Agent (Primary): Portfolio strategy
- CFO Agent: Program economics
- COO Agent: Resource allocation
- HR Agent: Faculty decisions
- Risk Agent: Market risk

---

ANALYSIS DIRECTIVES:

1. PORTFOLIO ANALYSIS
- Program categorization
- Performance metrics
- Resource alignment
- Recommendations

2. NEW PROGRAM DECISIONS
- Pipeline analysis
- Approval velocity
- Market timing
- Acceleration recommendations

3. SUNSET DECISIONS
- Candidate identification
- Process recommendations
- Resource reallocation
- Transition planning

4. RESOURCE OPTIMIZATION
- Faculty allocation
- Investment priorities
- Efficiency opportunities

---

OUTPUT FORMAT:

SECTION 1: Portfolio Dashboard
- Program categorization
- Performance visualization
- Decision priorities

SECTION 2: Program Analysis
By category:
- Metrics
- Recommendations
- Action plans

SECTION 3: Pipeline Acceleration
- New program priorities
- Process improvements
- Timeline optimization

SECTION 4: Resource Strategy
- Reallocation recommendations
- Investment priorities
- Efficiency gains

===
```

---

# GOVERNMENT PROMPTS

---

## 14A. 🏛️ Mission Delivery Dashboard

```
=== COUNCIL DIRECTIVE: MISSION DELIVERY DASHBOARD ===

CLIENT: {{AGENCY}}
PACKAGE: Mission Decision Optimization
FOR: Agency Head / COO

---

USAGE CONTEXT:
{{Insert 6 months of usage data}}

---

ACTIVATED AGENTS:
- COO Agent (Primary): Mission operations
- CFO Agent: Budget execution
- Risk Agent: Performance risk
- Strategy Agent: Stakeholder management
- Legal Agent: Compliance

---

ANALYSIS DIRECTIVES:

1. MISSION OUTCOME ANALYSIS
- Goal progress tracking
- Decision blockers
- Dependency mapping
- Priority actions

2. BUDGET DECISIONS
- Execution analysis
- Lapse risk
- Reallocation needs
- Timeline management

3. CROSS-AGENCY DECISIONS
- Dependency tracking
- Coordination improvements
- Escalation recommendations
- Resolution strategies

4. OVERSIGHT READINESS
- IG/GAO risk areas
- Decision requirements
- Documentation status
- Preparation plan

---

OUTPUT FORMAT:

SECTION 1: Mission Dashboard
- Goal progress
- Decision blockers
- Priority actions

SECTION 2: Budget Execution
- Status analysis
- Risk identification
- Reallocation recommendations

SECTION 3: Coordination Strategy
- Cross-agency issues
- Resolution approaches
- Escalation paths

SECTION 4: Oversight Preparation
- Risk areas
- Decision requirements
- Action plan

===
```

---

## 14B. 🏛️ Workforce Decision Optimizer

```
=== COUNCIL DIRECTIVE: WORKFORCE DECISION OPTIMIZER ===

CLIENT: {{AGENCY}}
PACKAGE: Federal Workforce Decision Optimization
FOR: CHCO (to share with HR)

---

USAGE CONTEXT:
{{Insert 6 months of usage data}}

---

ACTIVATED AGENTS:
- HR Agent (Primary): Workforce analysis
- COO Agent: Mission impact
- CFO Agent: Budget constraints
- Risk Agent: Capability risk
- Strategy Agent: Talent strategy

---

ANALYSIS DIRECTIVES:

1. HIRING DECISIONS
- Velocity analysis
- Bottleneck identification
- Process optimization
- Authority recommendations

2. RETENTION DECISIONS
- At-risk identification
- Intervention strategies
- Exit interview analysis
- Recommendations

3. SUCCESSION DECISIONS
- Gap identification
- Development needs
- Timeline requirements
- Action plans

4. WORKFORCE PLANNING
- Capability gaps
- Future needs
- Decision requirements
- Implementation plan

---

OUTPUT FORMAT:

SECTION 1: Workforce Dashboard
- Hiring velocity
- Retention metrics
- Succession status

SECTION 2: Hiring Optimization
- Process improvements
- Bottleneck resolution
- Expected impact

SECTION 3: Retention Strategy
- At-risk identification
- Intervention playbooks
- Implementation plan

SECTION 4: Succession Planning
- Gap analysis
- Development recommendations
- Timeline

===
```

---

# HOSPITALITY PROMPTS

---

## 15A. ✈️ Revenue Command Center

```
=== COUNCIL DIRECTIVE: REVENUE COMMAND CENTER ===

CLIENT: {{HOSPITALITY_COMPANY}}
PACKAGE: Revenue Decision Optimization
FOR: Chief Revenue Officer

---

USAGE CONTEXT:
{{Insert 6 months of usage data}}

---

ACTIVATED AGENTS:
- CRO Agent (Primary): Revenue analysis
- Strategy Agent: Competitive positioning
- COO Agent: Operations integration
- CFO Agent: Financial optimization
- Risk Agent: Demand risk

---

ANALYSIS DIRECTIVES:

1. PRICING DECISION VELOCITY
- Current speed analysis
- Competitor benchmarking
- Revenue impact quantification
- Acceleration recommendations

2. DEMAND RESPONSE DECISIONS
- Signal identification
- Response time analysis
- Process optimization
- Automation opportunities

3. CHANNEL DECISIONS
- Mix analysis
- Margin optimization
- Decision authority
- Recommendations

4. FORECASTING DECISIONS
- Accuracy analysis
- Adjustment processes
- Improvement recommendations

---

OUTPUT FORMAT:

SECTION 1: Revenue Dashboard
- Decision velocity metrics
- Competitive positioning
- Impact quantification

SECTION 2: Pricing Optimization
- Speed recommendations
- Process improvements
- Expected impact

SECTION 3: Channel Strategy
- Mix optimization
- Authority recommendations
- Implementation plan

SECTION 4: Forecast Framework
- Accuracy improvements
- Decision processes
- Action plan

===
```

---

## 15B. ✈️ Guest Experience Decision Map

```
=== COUNCIL DIRECTIVE: GUEST EXPERIENCE DECISION MAP ===

CLIENT: {{HOSPITALITY_COMPANY}}
PACKAGE: Guest-Impacting Decision Optimization
FOR: Chief Operating Officer (to share with Operations)

---

USAGE CONTEXT:
{{Insert 6 months of usage data}}

---

ACTIVATED AGENTS:
- COO Agent (Primary): Operations analysis
- HR Agent: Workforce decisions
- CRO Agent: Revenue impact
- Risk Agent: Satisfaction risk
- Strategy Agent: Competitive positioning

---

ANALYSIS DIRECTIVES:

1. SERVICE RECOVERY DECISIONS
- Resolution time analysis
- Authority gaps
- NPS correlation
- Recommendations

2. STAFFING DECISIONS
- Guest impact analysis
- Scheduling optimization
- Satisfaction correlation
- Recommendations

3. AMENITY DECISIONS
- Utilization analysis
- Dynamic opportunities
- Revenue potential
- Recommendations

4. LOYALTY DECISIONS
- Recognition consistency
- Decision protocols
- NPS impact
- Standardization recommendations

---

OUTPUT FORMAT:

SECTION 1: Guest Experience Dashboard
- Decision impact metrics
- Satisfaction correlation
- Priority areas

SECTION 2: Service Recovery
- Authority recommendations
- Process improvements
- Expected impact

SECTION 3: Staffing Optimization
- Guest impact analysis
- Scheduling recommendations
- Implementation plan

SECTION 4: Loyalty Strategy
- Consistency improvements
- Protocol standardization
- Expected NPS lift

===
```

---

# PROMPT USAGE INSTRUCTIONS

## For Council Operators

1. **Pull 6 months of usage data**
   - Total deliberations
   - Decision categories
   - Agent engagement
   - User patterns

2. **Identify personalization signals**
   - What do they deliberate on most?
   - What DON'T they deliberate on?
   - Who engages most?
   - What patterns emerge?

3. **Run the appropriate prompt**
   - Insert usage data
   - Ensure personalization fields are populated
   - Allow full agent deliberation

4. **Quality check output**
   - References their actual usage
   - Specific to their situation
   - Actionable recommendations
   - Quantified where possible

5. **Format for delivery**
   - Apply brand template
   - Executive summary up front
   - Visualizations where appropriate

---

**Document Version:** 1.0  
**Last Updated:** November 2025  
**Classification:** Council Operations - Internal
