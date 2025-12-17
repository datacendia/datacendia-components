# 🧠 Council Prompts: Industry Welcome Bonus Generation

**The exact prompts that generate each industry report.**

These prompts are designed to be run through The Council's multi-agent deliberation system. Each prompt activates relevant specialist agents and produces a structured analysis.

---

## Prompt Architecture

Each prompt follows this structure:

```
[CONTEXT BLOCK] - Company info, industry, known data
[AGENT ACTIVATION] - Which Council members to engage
[ANALYSIS DIRECTIVES] - What to analyze
[OUTPUT FORMAT] - How to structure the deliverable
[CONSTRAINTS] - What NOT to include, limitations
```

---

## Master Prompt Template

```
=== COUNCIL DIRECTIVE: WELCOME BONUS ANALYSIS ===

CLASSIFICATION: Complimentary Pre-Onboarding Analysis
CLIENT: {{COMPANY_NAME}}
INDUSTRY: {{INDUSTRY}}
PREPARED FOR: {{CONTACT_NAME}}, {{CONTACT_TITLE}}
ANALYSIS DATE: {{DATE}}

---

CONTEXT PACKAGE:
{{Insert all gathered public data about the company}}

---

ACTIVATED AGENTS:
- {{List relevant agents for this industry}}

---

ANALYSIS SCOPE:
{{Industry-specific analysis directives}}

---

OUTPUT REQUIREMENTS:
- Executive summary with 3 key metrics (headline numbers)
- One "critical insight" sentence that creates urgency
- 4 detailed analysis sections
- Quantified findings (specific numbers, not ranges where possible)
- Competitor comparisons (name competitors)
- Risk flags with estimated impact
- 4 recommendations (2 immediate, 2 short-term)

---

CONSTRAINTS:
- Use ONLY publicly available data
- Do NOT speculate on internal processes
- Do NOT make claims that require insider knowledge
- DO quantify everything possible
- DO name specific competitors, regulations, deadlines
- TONE: Authoritative but not alarmist

===
```

---

## Industry-Specific Prompts

---

### 1. 🏦 FINANCIAL SERVICES / BANKING

```
=== COUNCIL DIRECTIVE: REGULATORY EXPOSURE SNAPSHOT ===

CLASSIFICATION: Complimentary Pre-Onboarding Analysis
CLIENT: {{BANK_NAME}}
INDUSTRY: Financial Services / Banking
INSTITUTION TYPE: {{Commercial Bank | Regional Bank | Credit Union | Investment Bank}}
ASSET SIZE: {{Asset size if known}}
PRIMARY REGULATORS: {{OCC | Federal Reserve | FDIC | State | SEC}}

---

CONTEXT PACKAGE:
- Recent SEC filings (10-K, 10-Q, 8-K)
- Federal Reserve stress test results (if applicable)
- Recent enforcement actions or consent orders
- Public regulatory filings
- Recent press releases
- Peer institution data (3-5 comparable institutions)

{{Insert gathered data}}

---

ACTIVATED AGENTS:
- CISO Agent: Regulatory compliance patterns
- CFO Agent: Capital requirements and financial exposure
- Risk Agent: Regulatory risk assessment
- Strategy Agent: Peer comparison and competitive positioning
- Legal Agent: Enforcement trend analysis

---

ANALYSIS DIRECTIVES:

Section 1: REGULATORY TIMELINE
- Map all upcoming regulatory deadlines (next 12 months)
- Identify Basel III Endgame implications
- Flag state-level regulatory changes
- Assess CFPB exposure areas
- Calculate compliance timeline gaps

Section 2: PEER COMPARISON
- Compare to 3-5 similar institutions
- Benchmark compliance readiness scores
- Identify areas where peers are ahead
- Note recent peer enforcement actions
- Calculate relative risk positioning

Section 3: CAPITAL & FINANCIAL EXPOSURE
- Estimate capital requirement gaps
- Model stress scenario impacts
- Calculate potential penalty exposure
- Assess liquidity decision patterns
- Flag concentration risks

Section 4: DECISION VELOCITY ASSESSMENT
- Estimate regulatory response time vs. requirements
- Identify stuck compliance decisions
- Calculate cost of regulatory decision delays
- Flag approval bottlenecks

---

OUTPUT FORMAT:

EXECUTIVE SUMMARY METRICS:
1. Total Estimated Regulatory Exposure: ${{X}}M
2. Compliance Readiness Score: {{X}}% (vs. peer avg {{Y}}%)
3. Critical Deadlines (next 90 days): {{N}}

CRITICAL INSIGHT:
"[One sentence identifying their biggest regulatory vulnerability 
with quantified impact]"

---

COMPETITOR/PEER NAMING:
- Name specific peer institutions
- Reference specific regulatory actions
- Cite specific compliance frameworks

===
```

---

### 2. 🏥 HEALTHCARE / HEALTH SYSTEMS

```
=== COUNCIL DIRECTIVE: PAYER MIX DECISION IMPACT REPORT ===

CLASSIFICATION: Complimentary Pre-Onboarding Analysis
CLIENT: {{HEALTH_SYSTEM_NAME}}
INDUSTRY: Healthcare
SYSTEM TYPE: {{Academic Medical Center | Community Health System | Specialty | Rural}}
BED COUNT: {{Beds if known}}
REGION: {{Geographic region}}

---

CONTEXT PACKAGE:
- CMS Hospital Compare data
- Medicare cost reports (public)
- State health department filings
- Recent press releases
- Bond rating reports (if available)
- Competitor announcements
- Regional market data

{{Insert gathered data}}

---

ACTIVATED AGENTS:
- CFO Agent: Payer mix financial analysis
- COO Agent: Operational decision patterns
- Strategy Agent: Competitive positioning
- Risk Agent: Reimbursement risk assessment
- HR Agent: Workforce decision patterns

---

ANALYSIS DIRECTIVES:

Section 1: PAYER MIX TRENDS
- Analyze Medicare Advantage growth trends
- Track commercial payer shifts
- Assess Medicaid exposure
- Model reimbursement trajectory
- Identify contract renewal decision points

Section 2: DECISION VELOCITY BENCHMARKS
- Estimate strategic decision cycle time
- Compare to top-quartile health systems
- Calculate cost of decision delays
- Identify visible pending decisions (from press/filings)
- Flag service line decisions in market

Section 3: COMPETITIVE LANDSCAPE
- Map competitor strategic moves (last 18 months)
- Identify service line threats
- Track M&A activity in region
- Assess physician group dynamics
- Note facility investments by competitors

Section 4: WORKFORCE DECISIONS
- Benchmark staffing ratios
- Estimate workforce decision patterns
- Calculate turnover cost impact
- Flag visible recruitment challenges
- Assess labor market competition

---

OUTPUT FORMAT:

EXECUTIVE SUMMARY METRICS:
1. Decision Velocity Gap: {{X}} days vs. benchmark {{Y}} days
2. Estimated Decision Delay Cost: ${{X}}K/month
3. Competitive Threat Level: {{HIGH | MEDIUM | LOW}}

CRITICAL INSIGHT:
"[One sentence about their most urgent decision gap or 
competitive vulnerability with quantified impact]"

---

SPECIFIC NAMING:
- Name competing health systems
- Reference specific service lines
- Cite specific CMS metrics

===
```

---

### 3. 💊 PHARMACEUTICAL / BIOTECH

```
=== COUNCIL DIRECTIVE: PIPELINE DECISION VELOCITY AUDIT ===

CLASSIFICATION: Complimentary Pre-Onboarding Analysis
CLIENT: {{PHARMA_COMPANY_NAME}}
INDUSTRY: Pharmaceutical / Biotech
COMPANY TYPE: {{Large Pharma | Mid-size Biotech | Early-stage}}
THERAPEUTIC FOCUS: {{Oncology | Rare Disease | CNS | Immunology | etc.}}
PUBLIC/PRIVATE: {{Public | Private}}

---

CONTEXT PACKAGE:
- SEC filings (10-K, 10-Q, S-1)
- ClinicalTrials.gov pipeline data
- FDA approval timelines
- Recent earnings calls / investor presentations
- Press releases (last 24 months)
- Competitor pipeline data
- Industry analyst reports (public)

{{Insert gathered data}}

---

ACTIVATED AGENTS:
- Strategy Agent: Pipeline competitive analysis
- CFO Agent: Burn rate and capital allocation
- Risk Agent: Regulatory pathway assessment
- COO Agent: Stage-gate decision patterns
- Legal Agent: IP and regulatory timing

---

ANALYSIS DIRECTIVES:

Section 1: PIPELINE DECISION MAPPING
- Map all public pipeline assets by stage
- Calculate time-in-stage vs. industry benchmarks
- Identify visible go/no-go decision points
- Estimate decision delays per asset
- Flag assets approaching critical windows

Section 2: DECISION COST ANALYSIS
- Calculate burn rate per asset
- Model cost of stage-gate delays
- Estimate market timing impact
- Assess capital allocation efficiency
- Flag opportunity cost of stuck decisions

Section 3: COMPETITIVE VELOCITY
- Compare pipeline velocity to 3-5 competitors
- Identify competitive assets in same space
- Track competitor stage-gate timing
- Note recent competitor approvals/failures
- Assess market window risks

Section 4: REGULATORY PATHWAY
- Map FDA/EMA submission timelines
- Identify designation opportunities (Breakthrough, Fast Track)
- Flag regulatory decision dependencies
- Assess PDUFA date implications
- Note advisory committee timing

---

OUTPUT FORMAT:

EXECUTIVE SUMMARY METRICS:
1. Pipeline Assets Analyzed: {{N}} across {{Phases}}
2. Estimated Decision Debt (Pipeline): ${{X}}M
3. Market Window Risk: {{HIGH | MEDIUM | LOW}}

CRITICAL INSIGHT:
"[One sentence about their highest-impact decision delay 
with quantified cost]"

---

SPECIFIC NAMING:
- Name pipeline assets by actual name
- Reference specific competitors and their assets
- Cite specific clinical trial IDs
- Name specific regulatory pathways

===
```

---

### 4. 🛡️ INSURANCE

```
=== COUNCIL DIRECTIVE: UNDERWRITING DECISION LEAKAGE REPORT ===

CLASSIFICATION: Complimentary Pre-Onboarding Analysis
CLIENT: {{INSURANCE_COMPANY_NAME}}
INDUSTRY: Insurance
COMPANY TYPE: {{P&C | Life | Health | Specialty | Reinsurance}}
LINES OF BUSINESS: {{List primary lines}}
OPERATING STATES: {{Key states}}

---

CONTEXT PACKAGE:
- Statutory filings (AM Best, state filings)
- SEC filings (if public)
- State insurance department data
- Loss ratio trends
- Recent press releases
- Competitor data
- Regulatory announcements by state

{{Insert gathered data}}

---

ACTIVATED AGENTS:
- CFO Agent: Loss ratio and profitability analysis
- Risk Agent: Underwriting risk assessment
- CISO Agent: Regulatory compliance by state
- COO Agent: Claims decision patterns
- Legal Agent: Litigation exposure analysis

---

ANALYSIS DIRECTIVES:

Section 1: UNDERWRITING DECISION VELOCITY
- Benchmark policy decision speed vs. industry
- Estimate quote abandonment impact
- Calculate revenue leakage from slow decisions
- Assess pricing decision frequency
- Flag competitive disadvantage areas

Section 2: CLAIMS DECISION ANALYSIS
- Estimate claims decision timing
- Identify "litigation trigger zone" claims
- Calculate litigation risk exposure
- Benchmark vs. industry claim resolution
- Flag claims decision bottlenecks

Section 3: STATE REGULATORY EXPOSURE
- Map regulatory requirements by state
- Identify upcoming rate filing deadlines
- Flag states with changing requirements
- Assess compliance decision timeline
- Calculate penalty exposure by state

Section 4: COMPETITIVE POSITIONING
- Benchmark loss ratios vs. peers
- Track competitor pricing moves
- Assess market share decision impacts
- Identify InsurTech disruption threats
- Note distribution decision patterns

---

OUTPUT FORMAT:

EXECUTIVE SUMMARY METRICS:
1. Estimated Decision Leakage: ${{X}}M/year
2. Claims in Litigation Risk Zone: {{N}} claims
3. State Regulatory Deadlines (90 days): {{N}}

CRITICAL INSIGHT:
"[One sentence about their highest-risk decision pattern 
with quantified exposure]"

---

SPECIFIC NAMING:
- Name specific competitor insurers
- Reference specific state regulators
- Cite specific line of business metrics

===
```

---

### 5. 🏭 MANUFACTURING

```
=== COUNCIL DIRECTIVE: SUPPLY CHAIN DECISION STRESS TEST ===

CLASSIFICATION: Complimentary Pre-Onboarding Analysis
CLIENT: {{MANUFACTURER_NAME}}
INDUSTRY: Manufacturing
SECTOR: {{Automotive | Industrial | Consumer | Aerospace | Electronics | etc.}}
SUPPLY CHAIN COMPLEXITY: {{Global | Regional | Domestic}}

---

CONTEXT PACKAGE:
- SEC filings (supply chain disclosures)
- Import/export records (public trade data)
- Supplier concentration data (from filings)
- Recent earnings calls
- Press releases
- Competitor facility announcements
- Trade policy developments

{{Insert gathered data}}

---

ACTIVATED AGENTS:
- COO Agent: Supply chain and operations analysis
- CFO Agent: Capital allocation and cost analysis
- Risk Agent: Geopolitical and concentration risk
- Strategy Agent: Competitive positioning
- CISO Agent: Compliance and tariff exposure

---

ANALYSIS DIRECTIVES:

Section 1: SUPPLIER CONCENTRATION RISK
- Map top supplier dependencies (from public data)
- Identify single-source components
- Calculate geographic concentration
- Flag country-specific risks
- Estimate disruption impact scenarios

Section 2: SCENARIO STRESS TESTING
- Model Taiwan/China disruption scenario
- Model tariff escalation scenario (+25%, +50%)
- Model logistics disruption scenario
- Calculate production impact per scenario
- Estimate financial exposure per scenario

Section 3: COMPETITIVE SUPPLY CHAIN MOVES
- Track competitor reshoring/nearshoring decisions
- Identify competitor supplier announcements
- Note facility investment decisions
- Assess automation investments
- Flag competitive repositioning

Section 4: CAPACITY DECISIONS PENDING
- Identify visible capacity decisions (from filings/press)
- Estimate decision delays
- Calculate cost of capacity decision delays
- Flag market window risks
- Assess workforce decision patterns

---

OUTPUT FORMAT:

EXECUTIVE SUMMARY METRICS:
1. Supplier Concentration (Top 3): {{X}}% of critical components
2. Single-Source Components: {{N}} identified
3. Scenario Exposure (Worst Case): ${{X}}M

CRITICAL INSIGHT:
"[One sentence about their highest-impact supply chain 
vulnerability with quantified risk]"

---

SPECIFIC NAMING:
- Name specific geographic dependencies
- Reference specific competitor moves
- Cite specific trade policy impacts

===
```

---

### 6. 🛒 RETAIL / E-COMMERCE

```
=== COUNCIL DIRECTIVE: PRICING & INVENTORY DECISION LAG REPORT ===

CLASSIFICATION: Complimentary Pre-Onboarding Analysis
CLIENT: {{RETAILER_NAME}}
INDUSTRY: Retail / E-Commerce
FORMAT: {{Big Box | Specialty | DTC | Marketplace | Grocery | etc.}}
CHANNELS: {{Online | Stores | Omnichannel}}

---

CONTEXT PACKAGE:
- SEC filings (inventory turns, margins)
- Competitive pricing data (public price tracking)
- Store location data
- Recent earnings calls
- Press releases
- Competitor announcements
- Industry benchmark data

{{Insert gathered data}}

---

ACTIVATED AGENTS:
- CFO Agent: Margin and inventory analysis
- COO Agent: Operations and supply chain
- CRO Agent: Revenue and pricing optimization
- Strategy Agent: Competitive positioning
- Risk Agent: Market share and threat assessment

---

ANALYSIS DIRECTIVES:

Section 1: PRICING DECISION VELOCITY
- Benchmark price change response time
- Compare to Amazon/key competitors
- Estimate margin leakage from slow pricing
- Assess promotional decision patterns
- Flag competitive pricing disadvantages

Section 2: INVENTORY DECISIONS
- Analyze inventory turn rates
- Estimate overstock decision timing
- Calculate stockout decision delays
- Assess working capital trapped in slow decisions
- Flag clearance decision patterns

Section 3: LOCATION DECISIONS
- Track store opening/closing decisions
- Compare to competitor expansion
- Identify market coverage gaps
- Assess fulfillment location decisions
- Flag pending location decisions (from filings)

Section 4: COMPETITIVE RESPONSE
- Benchmark vs. key competitors
- Track competitor pricing moves
- Assess market share trends
- Identify category threats
- Note disruptive competitor moves

---

OUTPUT FORMAT:

EXECUTIVE SUMMARY METRICS:
1. Pricing Response Gap: {{X}} hours vs. {{Competitor}} {{Y}} minutes
2. Estimated Margin Leakage: ${{X}}M/year
3. Inventory Decision Delay Cost: ${{X}}M working capital

CRITICAL INSIGHT:
"[One sentence about their highest-impact pricing or 
inventory decision gap with quantified cost]"

---

SPECIFIC NAMING:
- Name specific competitors (Amazon, Walmart, etc.)
- Reference specific categories
- Cite specific pricing examples

===
```

---

### 7. ⚡ ENERGY / UTILITIES

```
=== COUNCIL DIRECTIVE: GRID & GENERATION DECISION RISK MAP ===

CLASSIFICATION: Complimentary Pre-Onboarding Analysis
CLIENT: {{UTILITY_NAME}}
INDUSTRY: Energy / Utilities
TYPE: {{IOU | Municipal | Cooperative | Generator | T&D}}
SERVICE TERRITORY: {{State(s) / Region}}
REGULATOR: {{PUC / PSC name}}

---

CONTEXT PACKAGE:
- PUC/PSC filings and rate cases
- SEC filings (if public)
- EIA generation and capacity data
- IRP (Integrated Resource Plan) filings
- Recent press releases
- Competitor/peer utility data
- IRA/federal incentive guidance

{{Insert gathered data}}

---

ACTIVATED AGENTS:
- CFO Agent: Rate case and capital analysis
- COO Agent: Grid operations and reliability
- Strategy Agent: Resource planning and transition
- CISO Agent: Regulatory compliance
- Risk Agent: Regulatory and market risk

---

ANALYSIS DIRECTIVES:

Section 1: RATE CASE DECISIONS
- Map pending rate cases
- Estimate revenue impact
- Track regulatory decision timelines
- Identify intervention risks
- Calculate regulatory lag cost

Section 2: GENERATION DECISIONS
- Analyze generation mix trends
- Track renewable project decisions
- Assess IRA incentive capture
- Compare to peer utility decisions
- Flag stranded asset risks

Section 3: GRID INVESTMENT DECISIONS
- Map pending capital projects
- Estimate decision delays
- Calculate cost of deferred investment
- Assess reliability implications
- Flag federal funding windows

Section 4: REGULATORY TIMELINE RISKS
- Map all regulatory deadlines
- Identify IRA/federal incentive windows
- Flag decisions at risk of missing windows
- Assess compliance decision velocity
- Calculate penalty/opportunity exposure

---

OUTPUT FORMAT:

EXECUTIVE SUMMARY METRICS:
1. Pending Rate Cases: {{N}} (${{X}}M revenue impact)
2. IRA Incentive Capture: {{X}}% vs. peer avg {{Y}}%
3. Decisions at Risk of Missing Windows: {{N}}

CRITICAL INSIGHT:
"[One sentence about their highest-impact regulatory or 
investment decision risk with quantified exposure]"

---

SPECIFIC NAMING:
- Name specific regulators (PUC/PSC)
- Reference specific rate cases by docket
- Cite specific IRA provisions

===
```

---

### 8. 💻 TECHNOLOGY / SAAS

```
=== COUNCIL DIRECTIVE: PRODUCT & GTM DECISION VELOCITY SCORECARD ===

CLASSIFICATION: Complimentary Pre-Onboarding Analysis
CLIENT: {{TECH_COMPANY_NAME}}
INDUSTRY: Technology / SaaS
SEGMENT: {{Enterprise | SMB | Consumer | Platform}}
STAGE: {{Startup | Growth | Mature | Public}}

---

CONTEXT PACKAGE:
- SEC filings (if public)
- Product changelog / release notes
- Pricing page history (archive.org)
- Press releases
- Job postings (hiring patterns)
- Competitor announcements
- Industry analyst reports (public)

{{Insert gathered data}}

---

ACTIVATED AGENTS:
- Strategy Agent: Product and competitive analysis
- CRO Agent: GTM and pricing analysis
- CFO Agent: Financial efficiency
- COO Agent: Operational decision patterns
- HR Agent: Hiring and organizational decisions

---

ANALYSIS DIRECTIVES:

Section 1: PRODUCT RELEASE VELOCITY
- Count major releases (last 12-24 months)
- Compare to key competitors
- Identify release cadence patterns
- Estimate feature decision bottlenecks
- Flag visible product gaps

Section 2: PRICING DECISIONS
- Track pricing changes over time
- Compare to competitor pricing evolution
- Estimate revenue left on table
- Assess packaging decision patterns
- Flag pricing competitive gaps

Section 3: GTM DECISIONS
- Analyze territory/segment decisions
- Track partnership announcements
- Assess channel decision patterns
- Compare to competitor GTM moves
- Flag visible expansion decisions

Section 4: M&A & PARTNERSHIP VELOCITY
- Track M&A announcements
- Analyze partnership decision timing
- Compare to competitor deal activity
- Estimate integration decision patterns
- Flag market consolidation dynamics

---

OUTPUT FORMAT:

EXECUTIVE SUMMARY METRICS:
1. Release Velocity: {{X}} vs. competitor {{Y}} (last 12 mo)
2. Pricing Decision Gap: {{X}} months since last change
3. Partnership Decisions Visible: {{N}} pending

CRITICAL INSIGHT:
"[One sentence about their highest-impact product or GTM 
decision gap with competitive implications]"

---

SPECIFIC NAMING:
- Name specific competitors
- Reference specific product features
- Cite specific pricing data points

===
```

---

### 9. 🏗️ REAL ESTATE / CONSTRUCTION

```
=== COUNCIL DIRECTIVE: DEVELOPMENT DECISION PIPELINE REPORT ===

CLASSIFICATION: Complimentary Pre-Onboarding Analysis
CLIENT: {{DEVELOPER_NAME}}
INDUSTRY: Real Estate / Construction
FOCUS: {{Multifamily | Commercial | Industrial | Mixed-Use | Residential}}
MARKETS: {{Primary markets}}

---

CONTEXT PACKAGE:
- SEC filings (if REIT/public)
- Permit records (public)
- CoStar/market data (public portions)
- Recent press releases
- Competitor announcements
- Interest rate/financing data
- Zoning and entitlement records

{{Insert gathered data}}

---

ACTIVATED AGENTS:
- CFO Agent: Capital allocation and financing
- COO Agent: Development operations
- Strategy Agent: Market and competitive analysis
- Risk Agent: Interest rate and market risk
- Legal Agent: Entitlement and regulatory

---

ANALYSIS DIRECTIVES:

Section 1: PERMITTING DECISIONS
- Map projects in permitting
- Calculate average permit timeline
- Compare to jurisdiction benchmarks
- Identify expedite opportunities
- Flag high-risk jurisdictions

Section 2: CAPITAL ALLOCATION
- Track capital committee decisions (from filings)
- Estimate decision delays
- Calculate interest rate exposure
- Assess financing decision patterns
- Flag rate-lock deadlines

Section 3: COMPETITIVE LAND DECISIONS
- Map competitor acquisitions
- Track competitor project announcements
- Identify market share implications
- Assess submarket competition
- Flag closing market windows

Section 4: RATE SCENARIO MODELING
- Model +50 bps impact on pending projects
- Model +100 bps scenario
- Identify projects that become marginal
- Calculate restructuring needs
- Flag time-sensitive decisions

---

OUTPUT FORMAT:

EXECUTIVE SUMMARY METRICS:
1. Projects in Permitting: {{N}} (${{X}}M total value)
2. Avg Permit Decision Time: {{X}} months
3. Rate Scenario Risk: {{N}} projects marginal at +100 bps

CRITICAL INSIGHT:
"[One sentence about their highest-impact development 
decision risk with quantified exposure]"

---

SPECIFIC NAMING:
- Name specific markets/submarkets
- Reference specific competitor developers
- Cite specific project details (if public)

===
```

---

### 10. 🚚 TRANSPORTATION / LOGISTICS

```
=== COUNCIL DIRECTIVE: FLEET & ROUTE DECISION EFFICIENCY AUDIT ===

CLASSIFICATION: Complimentary Pre-Onboarding Analysis
CLIENT: {{LOGISTICS_COMPANY_NAME}}
INDUSTRY: Transportation / Logistics
TYPE: {{Trucking | Rail | Air | Maritime | 3PL | Last-Mile}}
FLEET SIZE: {{Approximate if known}}

---

CONTEXT PACKAGE:
- DOT/FMCSA filings
- SEC filings (if public)
- Fleet age data (from filings)
- Fuel cost exposure
- Recent press releases
- Competitor announcements
- Industry benchmark data

{{Insert gathered data}}

---

ACTIVATED AGENTS:
- COO Agent: Fleet and route operations
- CFO Agent: Cost and capital analysis
- Risk Agent: Fuel and regulatory risk
- HR Agent: Driver and workforce decisions
- Strategy Agent: Competitive positioning

---

ANALYSIS DIRECTIVES:

Section 1: FLEET DECISIONS
- Analyze fleet age distribution
- Benchmark vs. industry optimal
- Calculate excess maintenance costs
- Estimate replacement decision delays
- Flag EV transition decision status

Section 2: ROUTE EFFICIENCY
- Assess route review frequency
- Benchmark vs. industry best practices
- Estimate efficiency loss
- Flag optimization opportunities
- Calculate fuel/labor impact

Section 3: CAPACITY DECISIONS
- Track driver hiring patterns
- Estimate time-to-fill benchmarks
- Calculate revenue impact of unfilled capacity
- Assess seasonal decision patterns
- Flag workforce decision bottlenecks

Section 4: FUEL & COST DECISIONS
- Analyze hedging position (from filings)
- Identify hedging decision gaps
- Calculate unhedged exposure
- Assess surcharge decision timing
- Flag cost management opportunities

---

OUTPUT FORMAT:

EXECUTIVE SUMMARY METRICS:
1. Fleet Age: {{X}} years vs. optimal {{Y}} years
2. Excess Maintenance Cost: ${{X}}M/year
3. Capacity Decisions Pending: {{N}} positions

CRITICAL INSIGHT:
"[One sentence about their highest-impact fleet or 
operations decision gap with quantified cost]"

---

SPECIFIC NAMING:
- Name specific competitors
- Reference specific routes/markets
- Cite specific DOT/regulatory metrics

===
```

---

### 11. 📺 MEDIA / ENTERTAINMENT

```
=== COUNCIL DIRECTIVE: CONTENT & DISTRIBUTION DECISION TIMING REPORT ===

CLASSIFICATION: Complimentary Pre-Onboarding Analysis  
CLIENT: {{MEDIA_COMPANY_NAME}}
INDUSTRY: Media / Entertainment
TYPE: {{Studio | Network | Streamer | Publisher | Gaming}}
CONTENT FOCUS: {{Film | TV | News | Sports | Music | Gaming}}

---

CONTEXT PACKAGE:
- SEC filings (if public)
- Content announcements
- Distribution deal news
- Trade publication coverage
- Competitor announcements
- Advertising/upfront data
- Audience measurement data (public)

{{Insert gathered data}}

---

ACTIVATED AGENTS:
- Strategy Agent: Content and competitive analysis
- CFO Agent: Content investment and ROI
- CRO Agent: Advertising and monetization
- COO Agent: Production and distribution operations
- Risk Agent: Talent and market risk

---

ANALYSIS DIRECTIVES:

Section 1: CONTENT INVESTMENT DECISIONS
- Track greenlight announcements
- Estimate decision velocity
- Compare to streaming competitors
- Flag projects at talent risk
- Assess content budget efficiency

Section 2: DISTRIBUTION DECISIONS
- Map platform deal renewals
- Track negotiation timelines
- Assess competitor distribution moves
- Flag window strategy decisions
- Calculate distribution gap exposure

Section 3: ADVERTISING DECISIONS
- Benchmark ad rate decision timing
- Compare to programmatic leaders
- Estimate revenue optimization gap
- Assess upfront commitment patterns
- Flag monetization decision lags

Section 4: AUDIENCE DATA UTILIZATION
- Assess data-to-decision speed
- Benchmark vs. industry leaders
- Estimate targeting efficiency gap
- Flag measurement decision patterns
- Calculate missed opportunity cost

---

OUTPUT FORMAT:

EXECUTIVE SUMMARY METRICS:
1. Greenlight Decision Time: {{X}} months vs. Netflix {{Y}} months
2. Projects at Window Risk: {{N}} (${{X}}M investment)
3. Ad Revenue Optimization Gap: Est. ${{X}}M/year

CRITICAL INSIGHT:
"[One sentence about their highest-impact content or 
monetization decision gap with quantified cost]"

---

SPECIFIC NAMING:
- Name specific competitors (Netflix, etc.)
- Reference specific content deals
- Cite specific advertising metrics

===
```

---

### 12. ⚖️ PROFESSIONAL SERVICES

```
=== COUNCIL DIRECTIVE: CLIENT & TALENT DECISION HEALTH CHECK ===

CLASSIFICATION: Complimentary Pre-Onboarding Analysis
CLIENT: {{FIRM_NAME}}
INDUSTRY: Professional Services
TYPE: {{Law Firm | Consulting | Accounting | Advisory}}
SIZE: {{Am Law 100 | Big 4 | Boutique | Regional}}

---

CONTEXT PACKAGE:
- Am Law / Vault / industry rankings
- Public announcements
- Partner promotion news
- Lateral hire announcements
- Client win announcements
- Competitor moves
- Industry benchmark data

{{Insert gathered data}}

---

ACTIVATED AGENTS:
- HR Agent: Talent and promotion decisions
- CRO Agent: Client acquisition and pricing
- CFO Agent: Financial performance
- Strategy Agent: Competitive positioning
- Risk Agent: Retention and market risk

---

ANALYSIS DIRECTIVES:

Section 1: PARTNER DECISIONS
- Track promotion timing patterns
- Benchmark vs. competitor firms
- Identify visible retention risks
- Assess lateral decision velocity
- Flag partner pipeline health

Section 2: CLIENT DECISIONS
- Analyze engagement decision speed
- Track pitch-to-close patterns
- Assess win rate trends
- Benchmark vs. competitors
- Flag client concentration risks

Section 3: PRICING DECISIONS
- Track rate increase patterns
- Compare to market rate trends
- Estimate rate gap vs. market
- Assess alternative fee decisions
- Flag pricing decision delays

Section 4: TALENT DECISIONS
- Benchmark offer decision speed
- Track acceptance rate trends
- Assess recruiting competitiveness
- Compare to peer firm velocity
- Flag talent loss patterns

---

OUTPUT FORMAT:

EXECUTIVE SUMMARY METRICS:
1. Partner Decision Timeline: {{X}} months vs. peer {{Y}} months
2. Offer-to-Decision Time: {{X}} days vs. top firms {{Y}} days
3. Rate Gap vs. Market: Est. {{X}}%

CRITICAL INSIGHT:
"[One sentence about their highest-impact talent or 
client decision gap with competitive implications]"

---

SPECIFIC NAMING:
- Name specific peer firms
- Reference industry rankings
- Cite specific market data

===
```

---

### 13. 🎓 HIGHER EDUCATION

```
=== COUNCIL DIRECTIVE: ENROLLMENT & PROGRAM DECISION VELOCITY REPORT ===

CLASSIFICATION: Complimentary Pre-Onboarding Analysis
CLIENT: {{UNIVERSITY_NAME}}
INDUSTRY: Higher Education
TYPE: {{R1 Research | Regional | Liberal Arts | Community College}}
ENROLLMENT: {{Approximate enrollment}}

---

CONTEXT PACKAGE:
- IPEDS data
- Common Data Set
- Accreditation records
- Recent press releases
- Competitor announcements
- State funding data
- Ranking data (public)

{{Insert gathered data}}

---

ACTIVATED AGENTS:
- Strategy Agent: Enrollment and competitive analysis
- CFO Agent: Tuition and financial aid decisions
- COO Agent: Academic program operations
- HR Agent: Faculty recruitment decisions
- Risk Agent: Enrollment and demographic risk

---

ANALYSIS DIRECTIVES:

Section 1: ADMISSIONS DECISIONS
- Benchmark admit decision timing
- Compare to competitor institutions
- Estimate yield impact
- Calculate applicants lost to speed
- Flag enrollment decision patterns

Section 2: PROGRAM DECISIONS
- Track program approval timeline
- Compare to competitor launches
- Estimate market opportunity cost
- Assess curriculum decision velocity
- Flag programs competitors launched

Section 3: TUITION DECISIONS
- Analyze tuition decision timing
- Benchmark financial aid decisions
- Compare to competitor response
- Estimate net tuition optimization
- Flag pricing decision gaps

Section 4: FACULTY DECISIONS
- Track search timeline
- Benchmark time-to-offer
- Calculate candidates lost
- Compare to peer institutions
- Flag recruitment competitiveness

---

OUTPUT FORMAT:

EXECUTIVE SUMMARY METRICS:
1. Admit Decision Time: {{X}} weeks vs. competitors {{Y}} weeks
2. Program Approval Time: {{X}} months
3. Faculty Offers Lost (Est.): {{N}} top candidates

CRITICAL INSIGHT:
"[One sentence about their highest-impact enrollment or 
academic decision gap with quantified impact]"

---

SPECIFIC NAMING:
- Name specific competitor institutions
- Reference specific programs
- Cite specific IPEDS metrics

===
```

---

### 14. 🏛️ GOVERNMENT / PUBLIC SECTOR

```
=== COUNCIL DIRECTIVE: PROCUREMENT & POLICY DECISION BOTTLENECK ANALYSIS ===

CLASSIFICATION: Complimentary Pre-Onboarding Analysis
CLIENT: {{AGENCY_NAME}}
INDUSTRY: Government / Public Sector
LEVEL: {{Federal | State | Local | Special District}}
JURISDICTION: {{Jurisdiction name}}

---

CONTEXT PACKAGE:
- USAspending / procurement data
- Budget documents (public)
- FOIA-released data
- GAO/IG reports
- Press releases
- Policy announcements
- Regulatory filings

{{Insert gathered data}}

---

ACTIVATED AGENTS:
- COO Agent: Procurement and operations
- CFO Agent: Budget and financial management
- Legal Agent: Policy and regulatory compliance
- HR Agent: Staffing decisions
- Risk Agent: Compliance and audit risk

---

ANALYSIS DIRECTIVES:

Section 1: PROCUREMENT DECISIONS
- Analyze award decision timelines
- Benchmark vs. mandates/targets
- Calculate compliance rates
- Identify budget at risk of lapse
- Flag procurement bottlenecks

Section 2: POLICY DECISIONS
- Track policy approval timelines
- Identify inter-agency delays
- Assess public comment patterns
- Calculate implementation delays
- Flag stuck policy decisions

Section 3: BUDGET DECISIONS
- Analyze allocation patterns
- Track reallocation request timing
- Calculate lapse risk
- Benchmark vs. peer agencies
- Flag use-it-or-lose-it exposure

Section 4: STAFFING DECISIONS
- Track time-to-fill patterns
- Benchmark vs. private sector
- Calculate vacancy cost
- Assess hiring decision bottlenecks
- Flag critical position gaps

---

OUTPUT FORMAT:

EXECUTIVE SUMMARY METRICS:
1. Procurement Compliance Rate: {{X}}% vs. {{Y}}% mandate
2. Budget at Lapse Risk: ${{X}}M
3. Avg Time-to-Fill: {{X}} days vs. target {{Y}} days

CRITICAL INSIGHT:
"[One sentence about their highest-impact procurement or 
policy decision bottleneck with quantified exposure]"

---

SPECIFIC NAMING:
- Reference specific mandates/laws
- Cite specific GAO/IG findings
- Name specific peer agencies

===
```

---

### 15. ✈️ HOSPITALITY / TRAVEL

```
=== COUNCIL DIRECTIVE: REVENUE & EXPERIENCE DECISION AGILITY REPORT ===

CLASSIFICATION: Complimentary Pre-Onboarding Analysis
CLIENT: {{HOSPITALITY_COMPANY_NAME}}
INDUSTRY: Hospitality / Travel
TYPE: {{Hotel | Airline | Cruise | Restaurant | OTA}}
SCALE: {{Global | National | Regional | Boutique}}

---

CONTEXT PACKAGE:
- SEC filings (if public)
- STR data (public portions)
- Brand announcements
- Loyalty program data
- Recent press releases
- Competitor announcements
- Industry benchmark data

{{Insert gathered data}}

---

ACTIVATED AGENTS:
- CRO Agent: Revenue management and pricing
- COO Agent: Property and operations
- Strategy Agent: Loyalty and competitive analysis
- HR Agent: Workforce and scheduling
- Risk Agent: Market and demand risk

---

ANALYSIS DIRECTIVES:

Section 1: PRICING DECISIONS
- Benchmark rate change frequency
- Compare to major competitors
- Estimate RevPAR/revenue gap
- Assess dynamic pricing velocity
- Flag pricing decision lags

Section 2: PROPERTY DECISIONS
- Track renovation decision timing
- Analyze NPS/satisfaction impact
- Assess competitive displacement
- Calculate deferred renovation cost
- Flag properties at risk

Section 3: LOYALTY DECISIONS
- Track program decision velocity
- Compare to competitor moves
- Assess member satisfaction trends
- Calculate loyalty decision gaps
- Flag competitive threats

Section 4: LABOR DECISIONS
- Benchmark scheduling lead time
- Calculate overtime cost impact
- Assess turnover correlation
- Compare to best-in-class
- Flag workforce decision patterns

---

OUTPUT FORMAT:

EXECUTIVE SUMMARY METRICS:
1. Pricing Velocity: {{X}} vs. {{Competitor}} {{Y}}
2. RevPAR Gap (Est.): ${{X}}/night
3. Properties at Competitive Risk: {{N}}

CRITICAL INSIGHT:
"[One sentence about their highest-impact revenue or 
experience decision gap with quantified cost]"

---

SPECIFIC NAMING:
- Name specific competitors (Marriott, Hilton, etc.)
- Reference specific properties/markets
- Cite specific STR/industry metrics

===
```

---

## Prompt Usage Instructions

### For Council Operators

1. **Gather Public Data First**
   - Collect all public sources listed in "Context Package"
   - Insert into the {{}} placeholder
   - Ensure data is current (within 30 days)

2. **Activate Relevant Agents**
   - All listed agents should participate
   - Primary agents lead analysis sections
   - Supporting agents provide cross-functional input

3. **Run Full Deliberation**
   - Allow agents to debate findings
   - Resolve conflicting data points
   - Synthesize into unified output

4. **Quality Check Output**
   - All numbers specific (not ranges)
   - Competitors named
   - At least one "holy shit" insight
   - Recommendations actionable

### Output Formatting

- Export as PDF
- Apply brand template
- Insert client logo
- Senior review before delivery

---

**Document Version:** 1.0  
**Last Updated:** November 2025  
**Classification:** Internal - Council Operations
