# DATACENDIA
## Complete Platform Specification

---

# Table of Contents

1. [Information Architecture](#part-1-information-architecture)
2. [Page Specifications](#part-2-page-specifications)
3. [API Specifications](#part-3-api-specifications)
4. [Database Schemas](#part-4-database-schemas)
5. [Connectors](#part-5-connectors)
6. [Internationalization](#part-6-internationalization)
7. [Platform Downloads](#part-7-platform-downloads)
8. [Licensing System](#part-8-licensing-system)
9. [Component Library](#part-9-component-library)

---

# Part 1: Information Architecture

## Site Map

```
DATACENDIA PLATFORM
│
├── PUBLIC SITE (marketing)
│   ├── Home
│   ├── Product
│   │   ├── Overview
│   │   ├── Pillars
│   │   ├── The Cortex
│   │   ├── Pantheon (AI Agents)
│   │   └── Reference Implementations
│   ├── Solutions
│   │   ├── By Industry
│   │   │   ├── Financial Services
│   │   │   ├── Healthcare
│   │   │   ├── Manufacturing
│   │   │   ├── Public Sector
│   │   │   └── Energy & Utilities
│   │   └── By Role
│   │       ├── CFO
│   │       ├── COO
│   │       ├── CISO
│   │       └── CIO
│   ├── Pricing
│   ├── Resources
│   │   ├── Documentation
│   │   ├── API Reference
│   │   ├── Blog
│   │   ├── Case Studies
│   │   └── Downloads
│   ├── Company
│   │   ├── About
│   │   ├── Manifesto
│   │   ├── Careers
│   │   └── Contact
│   ├── Login
│   └── Request Demo
│
├── THE CORTEX (application)
│   ├── Dashboard (Home)
│   ├── The Graph
│   │   ├── Explorer
│   │   ├── Lineage View
│   │   ├── Entity Details
│   │   └── Impact Analysis
│   ├── The Council
│   │   ├── Ask Question
│   │   ├── Active Deliberations
│   │   ├── Decision History
│   │   └── Agent Profiles
│   ├── The Pulse
│   │   ├── Health Overview
│   │   ├── Metrics Dashboard
│   │   ├── Alerts
│   │   └── Scorecards
│   ├── The Lens
│   │   ├── Forecasts
│   │   ├── Scenarios
│   │   ├── What-If Analysis
│   │   └── Comparisons
│   ├── The Bridge
│   │   ├── Workflows
│   │   ├── Workflow Builder
│   │   ├── Executions
│   │   ├── Approvals
│   │   └── Integrations
│   ├── Data
│   │   ├── Sources
│   │   ├── Catalog
│   │   ├── Quality
│   │   └── Import/Export
│   ├── Security
│   │   ├── Access Control
│   │   ├── Policies
│   │   ├── Audit Log
│   │   └── Threats
│   ├── Settings
│   │   ├── Organization
│   │   ├── Users & Teams
│   │   ├── Billing
│   │   ├── API Keys
│   │   ├── Integrations
│   │   └── Preferences
│   └── Help
│       ├── Documentation
│       ├── Tutorials
│       ├── Support
│       └── Keyboard Shortcuts
│
└── ADMIN CONSOLE (internal)
    ├── Tenants
    ├── Licenses
    ├── Usage Analytics
    ├── System Health
    └── Feature Flags
```

---

## Navigation Structure

### Primary Navigation (The Cortex)

```
┌─────────────────────────────────────────────────────────────────────┐
│  🏛️ DATACENDIA          [Search...]        🔔  ⚙️  👤 User ▼      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │  🏠      │  │  🕸️      │  │  👥      │  │  💓      │            │
│  │ Dashboard│  │  Graph   │  │ Council  │  │  Pulse   │            │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │  🔮      │  │  🌉      │  │  📊      │  │  🔒      │            │
│  │   Lens   │  │  Bridge  │  │   Data   │  │ Security │            │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

# Part 2: Page Specifications

## 2.1 PUBLIC SITE

### 2.1.1 Home Page

**URL**: `/`

**Purpose**: Convert visitors to demo requests

**Layout**:
```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER                                                             │
│  Logo    Product ▼   Solutions ▼   Pricing   Resources ▼   [Login] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    HERO SECTION                                     │
│                                                                     │
│         "Your organization's intelligence,                          │
│              sovereign and whole."                                  │
│                                                                     │
│    Datacendia gives your organization its mind back.                │
│    See what you have. Understand what it means.                     │
│    Know what's coming. Act with confidence.                         │
│                                                                     │
│         [Request Demo]      [Watch Video ▶]                         │
│                                                                     │
│    ┌─────────────────────────────────────────────────────────┐     │
│    │           ANIMATED CORTEX PREVIEW                       │     │
│    │    (Interactive graph visualization)                    │     │
│    └─────────────────────────────────────────────────────────┘     │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    THE PROBLEM                                      │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │ Data Chaos  │  │ Tool Sprawl │  │ No Foresight│                 │
│  │             │  │             │  │             │                 │
│  │ Your data   │  │ 15+ tools,  │  │ Decisions   │                 │
│  │ lives in    │  │ none talk   │  │ based on    │                 │
│  │ silos you   │  │ to each     │  │ hindsight,  │                 │
│  │ can't trace │  │ other       │  │ not insight │                 │
│  └─────────────┘  └─────────────┘  └─────────────┘                 │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    THE SOLUTION                                     │
│                                                                     │
│              Introducing The Cortex                                 │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │
│  │ THE GRAPH   │  │ THE COUNCIL │  │  THE PULSE  │  │  THE LENS  │ │
│  │             │  │             │  │             │  │            │ │
│  │ See every   │  │ AI advisors │  │ Feel your   │  │ See        │ │
│  │ connection  │  │ that debate │  │ org's       │  │ possible   │ │
│  │             │  │ and explain │  │ heartbeat   │  │ futures    │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘ │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    THE 8 PILLARS                                    │
│                                                                     │
│    Eight foundational capabilities that give your                   │
│    organization memory, security, voice, and foresight.             │
│                                                                     │
│    [Interactive pillar diagram - hover to reveal]                   │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    TRUSTED BY                                       │
│                                                                     │
│    [Logo]  [Logo]  [Logo]  [Logo]  [Logo]  [Logo]                  │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    CTA SECTION                                      │
│                                                                     │
│         Ready to reclaim your organization's mind?                  │
│                                                                     │
│                    [Request Demo]                                   │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  FOOTER                                                             │
│  Logo   Product  Solutions  Company  Resources  Legal              │
│         Links... Links...   Links... Links...   Links...           │
│                                                                     │
│  © 2025 Datacendia    [Social Icons]    [Language Selector 🌐]     │
└─────────────────────────────────────────────────────────────────────┘
```

**Components**:
- `<HeroSection />`
- `<ProblemStatement />`
- `<SolutionOverview />`
- `<PillarDiagram interactive={true} />`
- `<TrustLogos />`
- `<CTASection />`

**API Calls**: None (static page, possibly CMS-driven)

---

### 2.1.2 Pricing Page

**URL**: `/pricing`

**Purpose**: Show packages, enable self-serve evaluation

**Layout**:
```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER                                                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    PRICING                                          │
│                                                                     │
│     Choose the package that fits your organization                  │
│                                                                     │
│  [Monthly ○ ● Annual (Save 20%)]                                   │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │
│  │ FOUNDATION  │ │ INTELLIGENCE│ │ GOVERNANCE  │ │  SOVEREIGN  │  │
│  │             │ │             │ │             │ │  ⭐ Popular │  │
│  │   $5,000    │ │   $10,000   │ │   $15,000   │ │   $25,000   │  │
│  │   /month    │ │   /month    │ │   /month    │ │   /month    │  │
│  │             │ │             │ │             │ │             │  │
│  │ ✓ Lineage   │ │ ✓ Found. +  │ │ ✓ Intel. + │ │ ✓ All 8     │  │
│  │ ✓ Metrics   │ │ ✓ Helm      │ │ ✓ Guard    │ │   Pillars   │  │
│  │ ✓ Basic Helm│ │ ✓ Health    │ │ ✓ Ethics   │ │ ✓ All       │  │
│  │             │ │ ✓ Predict   │ │            │ │   Services  │  │
│  │ 5 Users     │ │ 20 Users    │ │ 50 Users   │ │ Unlimited   │  │
│  │             │ │             │ │            │ │ ✓ 3 Agents  │  │
│  │             │ │             │ │            │ │ ✓ Pantheon  │  │
│  │             │ │             │ │            │ │             │  │
│  │ [Start      │ │ [Start      │ │ [Start     │ │ [Contact    │  │
│  │  Trial]     │ │  Trial]     │ │  Trial]    │ │  Sales]     │  │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘  │
│                                                                     │
│                         [Enterprise? Contact Us]                    │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    FEATURE COMPARISON                               │
│                                                                     │
│  ┌──────────────────┬─────┬─────┬─────┬─────┐                      │
│  │ Feature          │Found│Intel│Gov  │Sov  │                      │
│  ├──────────────────┼─────┼─────┼─────┼─────┤                      │
│  │ Knowledge Graph  │  ✓  │  ✓  │  ✓  │  ✓  │                      │
│  │ Data Lineage     │  ✓  │  ✓  │  ✓  │  ✓  │                      │
│  │ Natural Query    │ 100 │ 1K  │ 5K  │ ∞   │                      │
│  │ Forecasting      │  -  │  ✓  │  ✓  │  ✓  │                      │
│  │ Scenarios        │  -  │  5  │  20 │  ∞  │                      │
│  │ Access Control   │Basic│Basic│Adv  │Adv  │                      │
│  │ Audit Trail      │ 30d │ 90d │  1y │  ∞  │                      │
│  │ AI Agents        │  -  │  -  │  1  │  3  │                      │
│  │ Pantheon Council │  -  │  -  │  -  │  ✓  │                      │
│  │ Workflows        │  5  │  20 │  50 │  ∞  │                      │
│  │ Integrations     │  2  │  5  │  10 │  ∞  │                      │
│  │ API Access       │  -  │  ✓  │  ✓  │  ✓  │                      │
│  │ SSO              │  -  │  -  │  ✓  │  ✓  │                      │
│  │ Support          │Email│Email│Prior│Dedic│                      │
│  └──────────────────┴─────┴─────┴─────┴─────┘                      │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    ADD-ONS                                          │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ Additional AI Agent        │ $3,000/mo  │ [Add]              │ │
│  │ Custom AI Agent            │ $6,000/mo  │ [Contact]          │ │
│  │ Reference Implementation   │ $5,000/mo  │ [Add]              │ │
│  │ Air-Gapped Deployment      │ +50%       │ [Contact]          │ │
│  │ Premium Support (24/7)     │ $4,000/mo  │ [Add]              │ │
│  │ Professional Services      │ $250/hr    │ [Contact]          │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    FAQ                                              │
│                                                                     │
│  [Accordion: Common pricing questions]                              │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  FOOTER                                                             │
└─────────────────────────────────────────────────────────────────────┘
```

**Components**:
- `<PricingToggle />` (monthly/annual)
- `<PricingCard package={} />`
- `<FeatureComparison />`
- `<AddOnsList />`
- `<PricingFAQ />`

---

### 2.1.3 Request Demo Page

**URL**: `/demo`

**Purpose**: Capture qualified leads

**Layout**:
```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER (minimal)                                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────┐  ┌─────────────────────────────────┐  │
│  │                         │  │                                 │  │
│  │   See Datacendia        │  │   REQUEST YOUR DEMO             │  │
│  │   in Action             │  │                                 │  │
│  │                         │  │   First Name *                  │  │
│  │   In 30 minutes,        │  │   [________________]            │  │
│  │   you'll see:           │  │                                 │  │
│  │                         │  │   Last Name *                   │  │
│  │   ✓ Your data traced    │  │   [________________]            │  │
│  │     from source to      │  │                                 │  │
│  │     insight             │  │   Work Email *                  │  │
│  │                         │  │   [________________]            │  │
│  │   ✓ AI agents that      │  │                                 │  │
│  │     reason and explain  │  │   Company *                     │  │
│  │                         │  │   [________________]            │  │
│  │   ✓ Scenarios that      │  │                                 │  │
│  │     predict your future │  │   Job Title *                   │  │
│  │                         │  │   [________________]            │  │
│  │   ✓ Governance that     │  │                                 │  │
│  │     proves compliance   │  │   Company Size *                │  │
│  │                         │  │   [Select...          ▼]        │  │
│  │                         │  │                                 │  │
│  │   "This changed how     │  │   Industry *                    │  │
│  │   we think about our    │  │   [Select...          ▼]        │  │
│  │   data."                │  │                                 │  │
│  │   - CIO, Fortune 500    │  │   What's your primary interest? │  │
│  │                         │  │   [Select...          ▼]        │  │
│  │                         │  │                                 │  │
│  │                         │  │   Anything else we should know? │  │
│  │                         │  │   [________________________]    │  │
│  │                         │  │   [________________________]    │  │
│  │                         │  │                                 │  │
│  │                         │  │   [    Request Demo    ]        │  │
│  │                         │  │                                 │  │
│  │                         │  │   By submitting, you agree to   │  │
│  │                         │  │   our Privacy Policy            │  │
│  │                         │  │                                 │  │
│  └─────────────────────────┘  └─────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Form Fields**:
```typescript
interface DemoRequest {
  firstName: string;
  lastName: string;
  email: string;  // Work email validation
  company: string;
  jobTitle: string;
  companySize: '1-50' | '51-200' | '201-1000' | '1001-5000' | '5000+';
  industry: Industry;
  primaryInterest: 
    | 'data-lineage'
    | 'ai-agents'
    | 'forecasting'
    | 'compliance'
    | 'automation'
    | 'other';
  additionalNotes?: string;
  marketingConsent: boolean;
}
```

**API Call**:
```
POST /api/v1/leads/demo-request
```

---

## 2.2 THE CORTEX (Application)

### 2.2.1 Login Page

**URL**: `/login`

**Layout**:
```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                         🏛️ DATACENDIA                              │
│                                                                     │
│                    ┌─────────────────────────┐                      │
│                    │                         │                      │
│                    │   Welcome back          │                      │
│                    │                         │                      │
│                    │   Email                 │                      │
│                    │   [___________________] │                      │
│                    │                         │                      │
│                    │   Password              │                      │
│                    │   [___________________] │                      │
│                    │                         │                      │
│                    │   [ ] Remember me       │                      │
│                    │                         │                      │
│                    │   [      Sign In      ] │                      │
│                    │                         │                      │
│                    │   ─────── or ────────   │                      │
│                    │                         │                      │
│                    │   [G] Continue with     │                      │
│                    │       Google            │                      │
│                    │                         │                      │
│                    │   [M] Continue with     │                      │
│                    │       Microsoft         │                      │
│                    │                         │                      │
│                    │   [SAML] SSO Login      │                      │
│                    │                         │                      │
│                    │   ───────────────────   │                      │
│                    │                         │                      │
│                    │   Forgot password?      │                      │
│                    │                         │                      │
│                    │   Don't have an         │                      │
│                    │   account? Request Demo │                      │
│                    │                         │                      │
│                    └─────────────────────────┘                      │
│                                                                     │
│                    [Language: English ▼]                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Authentication Methods**:
1. Email/Password
2. Google OAuth
3. Microsoft OAuth
4. SAML SSO (Enterprise)

**API Calls**:
```
POST /api/v1/auth/login
POST /api/v1/auth/oauth/google
POST /api/v1/auth/oauth/microsoft
POST /api/v1/auth/saml/init
```

---

### 2.2.2 Dashboard (Home)

**URL**: `/cortex` or `/cortex/dashboard`

**Purpose**: Overview of organizational health, quick actions, recent activity

**Layout**:
```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER                                                             │
│  🏛️ DATACENDIA     [🔍 Search anything...]    🔔 3  ⚙️  👤 John ▼  │
├────────────────┬────────────────────────────────────────────────────┤
│                │                                                    │
│  SIDEBAR       │   Good morning, John                               │
│                │   Here's how Acme Corp is doing today              │
│  ┌──────────┐  │                                                    │
│  │ 🏠 Home  │◀ │   ┌─────────────────────────────────────────────┐  │
│  └──────────┘  │   │            HEALTH SCORE                     │  │
│  ┌──────────┐  │   │                                             │  │
│  │ 🕸️ Graph │  │   │      ████████████████░░░░  82/100          │  │
│  └──────────┘  │   │                                             │  │
│  ┌──────────┐  │   │   Data: 94  │  Ops: 78  │  Risk: 75        │  │
│  │ 👥Council│  │   └─────────────────────────────────────────────┘  │
│  └──────────┘  │                                                    │
│  ┌──────────┐  │   ┌──────────────────┐  ┌──────────────────────┐  │
│  │ 💓 Pulse │  │   │  ACTIVE ALERTS   │  │   PENDING APPROVALS  │  │
│  └──────────┘  │   │                  │  │                      │  │
│  ┌──────────┐  │   │  🔴 3 Critical   │  │   📋 5 Workflows     │  │
│  │ 🔮 Lens  │  │   │  🟡 7 Warning    │  │   👤 2 Access Req    │  │
│  └──────────┘  │   │  🔵 12 Info      │  │   💰 1 Budget Req    │  │
│  ┌──────────┐  │   │                  │  │                      │  │
│  │ 🌉 Bridge│  │   │  [View All →]    │  │   [View All →]       │  │
│  └──────────┘  │   └──────────────────┘  └──────────────────────┘  │
│  ┌──────────┐  │                                                    │
│  │ 📊 Data  │  │   ┌─────────────────────────────────────────────┐  │
│  └──────────┘  │   │            KEY METRICS                      │  │
│  ┌──────────┐  │   │                                             │  │
│  │ 🔒Security│  │   │  Revenue      Pipeline     Burn Rate       │  │
│  └──────────┘  │   │  $12.4M       $48.2M       $1.2M/mo        │  │
│                │   │  ▲ 12%        ▲ 8%         ▼ 3%            │  │
│  ───────────   │   │                                             │  │
│                │   │  NPS          Churn        Compliance       │  │
│  ┌──────────┐  │   │  72           2.1%         94%              │  │
│  │ ⚙️Settings│  │   │  ▲ 5pts       ▼ 0.3%      ▲ 2%            │  │
│  └──────────┘  │   └─────────────────────────────────────────────┘  │
│  ┌──────────┐  │                                                    │
│  │ ❓ Help  │  │   ┌─────────────────────────────────────────────┐  │
│  └──────────┘  │   │         ASK THE COUNCIL                     │  │
│                │   │                                             │  │
│                │   │  [What would you like to know?          🎤] │  │
│                │   │                                             │  │
│                │   │  Recent: "Why did churn increase?"          │  │
│                │   │          "Forecast Q4 revenue"              │  │
│                │   │          "What's our biggest risk?"         │  │
│                │   └─────────────────────────────────────────────┘  │
│                │                                                    │
│                │   ┌─────────────────────────────────────────────┐  │
│                │   │         RECENT ACTIVITY                     │  │
│                │   │                                             │  │
│                │   │  🟢 10:32  Workflow "Monthly Close" done    │  │
│                │   │  🔵 10:15  Sarah queried revenue forecast   │  │
│                │   │  🟡 09:45  Alert: Supplier delay detected   │  │
│                │   │  🟢 09:30  New data source connected        │  │
│                │   │  🔴 09:12  Access violation blocked         │  │
│                │   │                                             │  │
│                │   │  [View Full Activity Log →]                 │  │
│                │   └─────────────────────────────────────────────┘  │
│                │                                                    │
└────────────────┴────────────────────────────────────────────────────┘
```

**Components**:
- `<HealthScore />`
- `<AlertsSummary />`
- `<PendingApprovals />`
- `<KeyMetrics />`
- `<QuickQuery />`
- `<ActivityFeed />`

**API Calls**:
```
GET /api/v1/dashboard/health-score
GET /api/v1/alerts/summary
GET /api/v1/approvals/pending
GET /api/v1/metrics/key
GET /api/v1/activity/recent
```

---

### 2.2.3 The Graph - Explorer

**URL**: `/cortex/graph`

**Purpose**: Navigate and explore the knowledge graph

**Layout**:
```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER                                                             │
├────────────────┬────────────────────────────────────────────────────┤
│                │                                                    │
│  SIDEBAR       │  THE GRAPH                                         │
│                │                                                    │
│                │  ┌─────────────────────────────────────────────┐   │
│                │  │ [🔍 Search entities...]  [Filters ▼] [+ Add]│   │
│                │  └─────────────────────────────────────────────┘   │
│                │                                                    │
│                │  ┌─────────────────────────────────────────────┐   │
│                │  │                                             │   │
│                │  │                    ┌───┐                    │   │
│                │  │              ┌─────│ A │─────┐              │   │
│                │  │              │     └───┘     │              │   │
│                │  │              │               │              │   │
│                │  │         ┌───┴───┐       ┌───┴───┐          │   │
│                │  │         │   B   │       │   C   │          │   │
│                │  │         └───┬───┘       └───┬───┘          │   │
│                │  │             │               │              │   │
│                │  │      ┌──────┼──────┐   ┌───┴───┐          │   │
│                │  │      │      │      │   │       │          │   │
│                │  │    ┌─┴─┐  ┌─┴─┐  ┌─┴─┐ │   E   │          │   │
│                │  │    │ D │  │ E │  │ F │ └───────┘          │   │
│                │  │    └───┘  └───┘  └───┘                    │   │
│                │  │                                             │   │
│                │  │                                             │   │
│                │  │  [─] [+] [◎] [⟲]              [Fullscreen] │   │
│                │  └─────────────────────────────────────────────┘   │
│                │                                                    │
│                │  ┌─────────────────────────────────────────────┐   │
│                │  │  ENTITY DETAILS                   [✕ Close] │   │
│                │  │                                             │   │
│                │  │  📊 Revenue (Metric)                        │   │
│                │  │                                             │   │
│                │  │  Type: Metric                               │   │
│                │  │  Owner: Finance Team                        │   │
│                │  │  Formula: SUM(sales.amount)                 │   │
│                │  │  Last Updated: 2 hours ago                  │   │
│                │  │                                             │   │
│                │  │  Connections: 12 incoming, 5 outgoing       │   │
│                │  │                                             │   │
│                │  │  [View Lineage] [Impact Analysis] [Edit]    │   │
│                │  └─────────────────────────────────────────────┘   │
│                │                                                    │
│                │  ┌─────────────────────────────────────────────┐   │
│                │  │  LEGEND                                     │   │
│                │  │  ● Dataset  ● Metric  ● Process  ● Entity  │   │
│                │  │  ─ derives  ─ impacts ─ owns               │   │
│                │  └─────────────────────────────────────────────┘   │
│                │                                                    │
└────────────────┴────────────────────────────────────────────────────┘
```

**Graph Controls**:
- Zoom in/out
- Fit to screen
- Reset view
- Fullscreen mode
- Filter by entity type
- Filter by relationship type
- Search and focus

**Components**:
- `<GraphCanvas />` (using Cytoscape.js)
- `<EntitySearch />`
- `<GraphFilters />`
- `<EntityDetailPanel />`
- `<GraphLegend />`
- `<GraphControls />`

**API Calls**:
```
GET /api/v1/graph/entities
GET /api/v1/graph/entities/{id}
GET /api/v1/graph/entities/{id}/neighbors
GET /api/v1/graph/search?q={query}
POST /api/v1/graph/query (Cypher)
```

---

### 2.2.4 The Graph - Lineage View

**URL**: `/cortex/graph/lineage/{entityId}`

**Purpose**: Trace data from source to destination

**Layout**:
```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER                                                             │
├────────────────┬────────────────────────────────────────────────────┤
│                │                                                    │
│  SIDEBAR       │  LINEAGE: Revenue Metric                           │
│                │                                                    │
│                │  [← Back to Graph]   [Upstream ▼] [3 Levels ▼]    │
│                │                                                    │
│                │  ┌─────────────────────────────────────────────┐   │
│                │  │                                             │   │
│                │  │  SOURCES           TRANSFORMS      TARGET   │   │
│                │  │                                             │   │
│                │  │  ┌─────────┐                               │   │
│                │  │  │ Salesforce│                              │   │
│                │  │  │   CRM    │──┐                           │   │
│                │  │  └─────────┘  │     ┌──────────┐          │   │
│                │  │               ├────▶│  ETL     │          │   │
│                │  │  ┌─────────┐  │     │  Sales   │          │   │
│                │  │  │  Stripe  │──┤     │ Pipeline │          │   │
│                │  │  │ Payments │  │     └────┬─────┘          │   │
│                │  │  └─────────┘  │          │                │   │
│                │  │               │          ▼                │   │
│                │  │  ┌─────────┐  │     ┌──────────┐   ┌─────┐│   │
│                │  │  │  SAP     │──┘     │  Sales   │──▶│REVENU││  │
│                │  │  │  ERP    │────────▶│  Mart   │   │METRIC││  │
│                │  │  └─────────┘        └──────────┘   └─────┘│   │
│                │  │                                             │   │
│                │  │                                             │   │
│                │  └─────────────────────────────────────────────┘   │
│                │                                                    │
│                │  ┌─────────────────────────────────────────────┐   │
│                │  │  LINEAGE DETAILS                            │   │
│                │  │                                             │   │
│                │  │  Total Path Length: 4 hops                  │   │
│                │  │  Data Freshness: 2 hours                    │   │
│                │  │  Last Full Refresh: Yesterday 02:00 UTC     │   │
│                │  │                                             │   │
│                │  │  Transformations Applied:                   │   │
│                │  │  1. Currency conversion (USD)               │   │
│                │  │  2. Deduplication by transaction_id         │   │
│                │  │  3. Aggregation by month                    │   │
│                │  │                                             │   │
│                │  │  [View Transformation SQL]                  │   │
│                │  └─────────────────────────────────────────────┘   │
│                │                                                    │
│                │  ┌─────────────────────────────────────────────┐   │
│                │  │  DATA QUALITY                               │   │
│                │  │                                             │   │
│                │  │  Completeness: ████████████████░░ 92%       │   │
│                │  │  Accuracy:     █████████████████░ 96%       │   │
│                │  │  Timeliness:   ██████████████░░░░ 78%       │   │
│                │  │                                             │   │
│                │  │  ⚠️ 3 quality issues detected [View →]      │   │
│                │  └─────────────────────────────────────────────┘   │
│                │                                                    │
└────────────────┴────────────────────────────────────────────────────┘
```

**Components**:
- `<LineageGraph />` (horizontal flow diagram)
- `<LineageControls />` (direction, depth)
- `<LineageDetails />`
- `<DataQualityScore />`
- `<TransformationList />`

**API Calls**:
```
GET /api/v1/lineage/{entityId}?direction=upstream&depth=3
GET /api/v1/lineage/{entityId}/transformations
GET /api/v1/lineage/{entityId}/quality
```

---

### 2.2.5 The Council - Main View

**URL**: `/cortex/council`

**Purpose**: Interact with AI agents, view deliberations

**Layout**:
```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER                                                             │
├────────────────┬────────────────────────────────────────────────────┤
│                │                                                    │
│  SIDEBAR       │  THE COUNCIL                                       │
│                │                                                    │
│                │  ┌─────────────────────────────────────────────┐   │
│                │  │                                             │   │
│                │  │   ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐         │   │
│                │  │   │ 👔  │ │ 💰  │ │ ⚙️  │ │ 🔒  │         │   │
│                │  │   │Chief│ │ CFO │ │ COO │ │CISO │         │   │
│                │  │   │ ●   │ │ ●   │ │ ●   │ │ ●   │         │   │
│                │  │   └─────┘ └─────┘ └─────┘ └─────┘         │   │
│                │  │                                             │   │
│                │  │   ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐         │   │
│                │  │   │ 📢  │ │ 📈  │ │ 📊  │ │ ⚠️  │         │   │
│                │  │   │ CMO │ │ CRO │ │ CDO │ │Risk │         │   │
│                │  │   │ ○   │ │ ●   │ │ ●   │ │ ●   │         │   │
│                │  │   └─────┘ └─────┘ └─────┘ └─────┘         │   │
│                │  │                                             │   │
│                │  │   ● Online  ○ Offline                       │   │
│                │  │                                             │   │
│                │  └─────────────────────────────────────────────┘   │
│                │                                                    │
│                │  ┌─────────────────────────────────────────────┐   │
│                │  │  ASK THE COUNCIL                            │   │
│                │  │                                             │   │
│                │  │  ┌─────────────────────────────────────┐   │   │
│                │  │  │ What would you like to know?      🎤│   │   │
│                │  │  └─────────────────────────────────────┘   │   │
│                │  │                                             │   │
│                │  │  Select agents to consult:                  │   │
│                │  │  [✓] All  [ ] CFO  [ ] COO  [ ] CISO  ...  │   │
│                │  │                                             │   │
│                │  │  [Ask Question]  [Start Deliberation]       │   │
│                │  └─────────────────────────────────────────────┘   │
│                │                                                    │
│                │  ┌─────────────────────────────────────────────┐   │
│                │  │  ACTIVE DELIBERATIONS                       │   │
│                │  │                                             │   │
│                │  │  🔄 "Should we expand into EU market?"      │   │
│                │  │     Started 15 min ago │ 5 agents │ Phase 2 │   │
│                │  │     [View →]                                │   │
│                │  │                                             │   │
│                │  │  🔄 "Q4 budget allocation review"           │   │
│                │  │     Started 2 hrs ago │ 3 agents │ Phase 3  │   │
│                │  │     [View →]                                │   │
│                │  │                                             │   │
│                │  └─────────────────────────────────────────────┘   │
│                │                                                    │
│                │  ┌─────────────────────────────────────────────┐   │
│                │  │  RECENT DECISIONS                           │   │
│                │  │                                             │   │
│                │  │  ✓ "Why did churn increase last month?"     │   │
│                │  │    Answered 3 hours ago │ Confidence: 89%   │   │
│                │  │                                             │   │
│                │  │  ✓ "Forecast cash flow for Q4"              │   │
│                │  │    Answered yesterday │ Confidence: 94%     │   │
│                │  │                                             │   │
│                │  │  [View All History →]                       │   │
│                │  └─────────────────────────────────────────────┘   │
│                │                                                    │
└────────────────┴────────────────────────────────────────────────────┘
```

**Components**:
- `<AgentGrid />` (shows all agents with status)
- `<QueryInput />` (with voice input option)
- `<AgentSelector />`
- `<ActiveDeliberations />`
- `<DecisionHistory />`

**API Calls**:
```
GET /api/v1/agents
GET /api/v1/agents/{id}/status
POST /api/v1/council/query
POST /api/v1/council/deliberation
GET /api/v1/council/deliberations/active
GET /api/v1/council/decisions/recent
```

---

### 2.2.6 The Council - Deliberation View

**URL**: `/cortex/council/deliberation/{id}`

**Purpose**: Watch and interact with a multi-agent deliberation

**Layout**:
```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER                                                             │
├────────────────┬────────────────────────────────────────────────────┤
│                │                                                    │
│  SIDEBAR       │  DELIBERATION                                      │
│                │  "Should we expand into the European market?"      │
│                │                                                    │
│                │  ┌──────────────────────────────────────────────┐  │
│                │  │ PHASE: 2 of 4 - Cross-Examination            │  │
│                │  │ ████████████░░░░░░░░░░░░░░░░░░  45%          │  │
│                │  └──────────────────────────────────────────────┘  │
│                │                                                    │
│                │  ┌──────────────────────────────────────────────┐  │
│                │  │ PARTICIPATING AGENTS                         │  │
│                │  │                                              │  │
│                │  │  💰 CFO      ⚙️ COO      🔒 CISO    📈 CRO   │  │
│                │  │  Analyzing  Responded  Analyzing  Waiting   │  │
│                │  └──────────────────────────────────────────────┘  │
│                │                                                    │
│                │  ┌──────────────────────────────────────────────┐  │
│                │  │ DELIBERATION TRANSCRIPT                      │  │
│                │  │                                              │  │
│                │  │ ┌─ PHASE 1: INITIAL ANALYSIS ────────────┐  │  │
│                │  │ │                                         │  │  │
│                │  │ │ 💰 CFO                          10:15   │  │  │
│                │  │ │ European expansion would require €5M    │  │  │
│                │  │ │ initial investment. Based on our        │  │  │
│                │  │ │ current cash position ($12M) and burn   │  │  │
│                │  │ │ rate ($1.2M/mo), this is feasible but   │  │  │
│                │  │ │ would reduce runway to 6 months.        │  │  │
│                │  │ │                                         │  │  │
│                │  │ │ Sources: [Cash Flow Report] [Budget]    │  │  │
│                │  │ │ Confidence: 87%                         │  │  │
│                │  │ │                                         │  │  │
│                │  │ │ ⚙️ COO                          10:17   │  │  │
│                │  │ │ We have capacity to support EU ops.     │  │  │
│                │  │ │ Current team utilization is 72%. We     │  │  │
│                │  │ │ would need 3 additional hires: 1 sales, │  │  │
│                │  │ │ 1 support, 1 legal/compliance.          │  │  │
│                │  │ │                                         │  │  │
│                │  │ │ Sources: [Capacity Plan] [Org Chart]    │  │  │
│                │  │ │ Confidence: 91%                         │  │  │
│                │  │ │                                         │  │  │
│                │  │ │ 🔒 CISO                         10:19   │  │  │
│                │  │ │ GDPR compliance is mandatory. Current   │  │  │
│                │  │ │ gap analysis shows 12 controls need     │  │  │
│                │  │ │ implementation. Estimated 3-4 months    │  │  │
│                │  │ │ and €200K for full compliance.          │  │  │
│                │  │ │                                         │  │  │
│                │  │ │ Sources: [GDPR Gap Analysis] [Controls] │  │  │
│                │  │ │ Confidence: 94%                         │  │  │
│                │  │ └─────────────────────────────────────────┘  │  │
│                │  │                                              │  │
│                │  │ ┌─ PHASE 2: CROSS-EXAMINATION ───────────┐  │  │
│                │  │ │                                         │  │  │
│                │  │ │ 💰 CFO → 🔒 CISO                10:22   │  │  │
│                │  │ │ Your €200K compliance estimate seems    │  │  │
│                │  │ │ low. Industry benchmarks suggest        │  │  │
│                │  │ │ €300-400K for companies our size.       │  │  │
│                │  │ │ Can you justify the lower figure?       │  │  │
│                │  │ │                                         │  │  │
│                │  │ │ 🔒 CISO → 💰 CFO                10:24   │  │  │
│                │  │ │ Fair point. I assumed we could reuse    │  │  │
│                │  │ │ 60% of existing SOC 2 controls. If we   │  │  │
│                │  │ │ can't, revised estimate is €350K.       │  │  │
│                │  │ │                                         │  │  │
│                │  │ │ ⏳ Analysis in progress...              │  │  │
│                │  │ └─────────────────────────────────────────┘  │  │
│                │  │                                              │  │
│                │  └──────────────────────────────────────────────┘  │
│                │                                                    │
│                │  ┌──────────────────────────────────────────────┐  │
│                │  │ [Add Question to Agents]  [Request Summary]  │  │
│                │  │                                              │  │
│                │  │ [Pause]  [Skip to Synthesis]  [Cancel]       │  │
│                │  └──────────────────────────────────────────────┘  │
│                │                                                    │
└────────────────┴────────────────────────────────────────────────────┘
```

**Components**:
- `<DeliberationProgress />`
- `<ParticipatingAgents />`
- `<DeliberationTranscript />`
- `<AgentMessage />`
- `<SourceCitation />`
- `<DeliberationControls />`

**API Calls**:
```
GET /api/v1/council/deliberations/{id}
GET /api/v1/council/deliberations/{id}/transcript
POST /api/v1/council/deliberations/{id}/inject-question
POST /api/v1/council/deliberations/{id}/control (pause/resume/skip)
WS  /api/v1/council/deliberations/{id}/stream (WebSocket for live updates)
```

---

### 2.2.7 The Pulse - Health Overview

**URL**: `/cortex/pulse`

**Purpose**: Real-time organizational health monitoring

**Layout**:
```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER                                                             │
├────────────────┬────────────────────────────────────────────────────┤
│                │                                                    │
│  SIDEBAR       │  THE PULSE                           [Live ●]     │
│                │                                                    │
│                │  ┌──────────────────────────────────────────────┐  │
│                │  │              OVERALL HEALTH                  │  │
│                │  │                                              │  │
│                │  │                   82                         │  │
│                │  │              ╭─────────╮                     │  │
│                │  │            ╱           ╲                     │  │
│                │  │           ╱    GOOD     ╲                    │  │
│                │  │          │               │                   │  │
│                │  │          │               │                   │  │
│                │  │           ╲             ╱                    │  │
│                │  │            ╲           ╱                     │  │
│                │  │              ╰─────────╯                     │  │
│                │  │                                              │  │
│                │  │   ▲ +3 from last week                        │  │
│                │  └──────────────────────────────────────────────┘  │
│                │                                                    │
│                │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐     │
│                │  │  DATA  │ │  OPS   │ │SECURITY│ │ PEOPLE │     │
│                │  │   94   │ │   78   │ │   85   │ │   71   │     │
│                │  │   ▲2   │ │   ▼5   │ │   ▲1   │ │   ─    │     │
│                │  └────────┘ └────────┘ └────────┘ └────────┘     │
│                │                                                    │
│                │  ┌──────────────────────────────────────────────┐  │
│                │  │              ACTIVE ALERTS                   │  │
│                │  │                                              │  │
│                │  │  🔴 CRITICAL (3)                             │  │
│                │  │  ├─ Database CPU > 90% for 15 min           │  │
│                │  │  ├─ Payment processing latency spike         │  │
│                │  │  └─ Supplier API unresponsive                │  │
│                │  │                                              │  │
│                │  │  🟡 WARNING (7)                              │  │
│                │  │  ├─ Disk usage at 78% on prod-db-01         │  │
│                │  │  ├─ 3 failed login attempts (user: admin)   │  │
│                │  │  └─ +5 more...                               │  │
│                │  │                                              │  │
│                │  │  [View All Alerts →]                         │  │
│                │  └──────────────────────────────────────────────┘  │
│                │                                                    │
│                │  ┌──────────────────────────────────────────────┐  │
│                │  │              SYSTEM STATUS                   │  │
│                │  │                                              │  │
│                │  │  Service          Status      Latency        │  │
│                │  │  ─────────────────────────────────────       │  │
│                │  │  API Gateway      ● Online    23ms           │  │
│                │  │  Graph Database   ● Online    45ms           │  │
│                │  │  ML Pipeline      ● Online    --             │  │
│                │  │  Workflow Engine  ◐ Degraded  890ms          │  │
│                │  │  Auth Service     ● Online    12ms           │  │
│                │  │                                              │  │
│                │  │  [View Infrastructure →]                     │  │
│                │  └──────────────────────────────────────────────┘  │
│                │                                                    │
│                │  ┌──────────────────────────────────────────────┐  │
│                │  │              TREND (7 DAYS)                  │  │
│                │  │                                              │  │
│                │  │  100│                                        │  │
│                │  │     │      ╭──╮    ╭─╮                       │  │
│                │  │   80│  ╭───╯  ╰────╯ ╰──●                    │  │
│                │  │     │──╯                                     │  │
│                │  │   60│                                        │  │
│                │  │     └────────────────────────                │  │
│                │  │      Mon Tue Wed Thu Fri Sat Sun             │  │
│                │  │                                              │  │
│                │  └──────────────────────────────────────────────┘  │
│                │                                                    │
└────────────────┴────────────────────────────────────────────────────┘
```

**Components**:
- `<HealthGauge />`
- `<HealthDimensions />`
- `<AlertList />`
- `<SystemStatus />`
- `<HealthTrendChart />`

**API Calls**:
```
GET /api/v1/health/score
GET /api/v1/health/dimensions
GET /api/v1/alerts/active
GET /api/v1/health/systems/status
GET /api/v1/health/trend?days=7
WS  /api/v1/health/stream (WebSocket for live updates)
```

---

### 2.2.8 The Lens - Scenarios

**URL**: `/cortex/lens/scenarios`

**Purpose**: Create and compare what-if scenarios

**Layout**:
```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER                                                             │
├────────────────┬────────────────────────────────────────────────────┤
│                │                                                    │
│  SIDEBAR       │  THE LENS > SCENARIOS                              │
│                │                                                    │
│                │  [+ New Scenario]                    [Compare]     │
│                │                                                    │
│                │  ┌──────────────────────────────────────────────┐  │
│                │  │  SCENARIO: Product Launch Delay              │  │
│                │  │                                              │  │
│                │  │  ┌─ ASSUMPTIONS ──────────────────────────┐  │  │
│                │  │  │                                        │  │  │
│                │  │  │  Launch Date:     [Q1 2026 ▼] → Q2     │  │  │
│                │  │  │  Marketing Spend: [$2M     ] (no chg)  │  │  │
│                │  │  │  Competitor Entry: [Yes ▼]             │  │  │
│                │  │  │  Market Growth:   [5%  ▼]              │  │  │
│                │  │  │                                        │  │  │
│                │  │  │  [+ Add Assumption]                    │  │  │
│                │  │  └────────────────────────────────────────┘  │  │
│                │  │                                              │  │
│                │  │  ┌─ PROJECTED IMPACT ─────────────────────┐  │  │
│                │  │  │                                        │  │  │
│                │  │  │  Metric           Base    Scenario  Δ  │  │  │
│                │  │  │  ──────────────────────────────────────│  │  │
│                │  │  │  Revenue (Y1)     $15M    $12M     -20%│  │  │
│                │  │  │  Market Share     18%     14%      -4% │  │  │
│                │  │  │  Cash Position    $8M     $6M      -25%│  │  │
│                │  │  │  Customer Acq.    1,200   900      -25%│  │  │
│                │  │  │                                        │  │  │
│                │  │  │  Confidence: 78%                       │  │  │
│                │  │  └────────────────────────────────────────┘  │  │
│                │  │                                              │  │
│                │  │  ┌─ VISUALIZATION ────────────────────────┐  │  │
│                │  │  │                                        │  │  │
│                │  │  │   $20M│                                │  │  │
│                │  │  │       │           ╭──── Base           │  │  │
│                │  │  │   $15M│       ╭───╯                    │  │  │
│                │  │  │       │   ╭───╯                        │  │  │
│                │  │  │   $10M│───╯   ╭──── Scenario           │  │  │
│                │  │  │       │   ╭───╯                        │  │  │
│                │  │  │    $5M│───╯                            │  │  │
│                │  │  │       └────────────────────────        │  │  │
│                │  │  │        Q1   Q2   Q3   Q4   Q1   Q2     │  │  │
│                │  │  │                                        │  │  │
│                │  │  └────────────────────────────────────────┘  │  │
│                │  │                                              │  │
│                │  │  ┌─ AI ANALYSIS ──────────────────────────┐  │  │
│                │  │  │                                        │  │  │
│                │  │  │  "A 3-month delay significantly        │  │  │
│                │  │  │  impacts market share due to           │  │  │
│                │  │  │  competitor entry. Consider:           │  │  │
│                │  │  │                                        │  │  │
│                │  │  │  1. Accelerating MVP scope             │  │  │
│                │  │  │  2. Increasing marketing pre-launch    │  │  │
│                │  │  │  3. Targeting different segment first" │  │  │
│                │  │  │                                        │  │  │
│                │  │  │  [Ask Follow-up] [Generate Report]     │  │  │
│                │  │  └────────────────────────────────────────┘  │  │
│                │  │                                              │  │
│                │  │  [Save Scenario] [Share] [Export]            │  │
│                │  └──────────────────────────────────────────────┘  │
│                │                                                    │
└────────────────┴────────────────────────────────────────────────────┘
```

**Components**:
- `<ScenarioBuilder />`
- `<AssumptionEditor />`
- `<ImpactTable />`
- `<ScenarioChart />`
- `<AIAnalysis />`

**API Calls**:
```
GET /api/v1/scenarios
POST /api/v1/scenarios
GET /api/v1/scenarios/{id}
PUT /api/v1/scenarios/{id}
POST /api/v1/scenarios/{id}/run
GET /api/v1/scenarios/{id}/results
POST /api/v1/scenarios/compare
```

---

### 2.2.9 The Bridge - Workflows

**URL**: `/cortex/bridge/workflows`

**Purpose**: View and manage automated workflows

**Layout**:
```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER                                                             │
├────────────────┬────────────────────────────────────────────────────┤
│                │                                                    │
│  SIDEBAR       │  THE BRIDGE > WORKFLOWS                            │
│                │                                                    │
│                │  [+ New Workflow]  [Import]     [🔍 Search...]    │
│                │                                                    │
│                │  ┌──────────────────────────────────────────────┐  │
│                │  │  WORKFLOW CATEGORIES                         │  │
│                │  │                                              │  │
│                │  │  [All] [Finance] [Operations] [IT] [HR]      │  │
│                │  └──────────────────────────────────────────────┘  │
│                │                                                    │
│                │  ┌──────────────────────────────────────────────┐  │
│                │  │                                              │  │
│                │  │  NAME                    STATUS    LAST RUN  │  │
│                │  │  ─────────────────────────────────────────── │  │
│                │  │                                              │  │
│                │  │  📊 Monthly Close        ● Active  2h ago    │  │
│                │  │     Finance │ Scheduled │ 45 steps           │  │
│                │  │     [View] [Edit] [Run] [···]               │  │
│                │  │                                              │  │
│                │  │  🔔 Alert Escalation     ● Active  5m ago    │  │
│                │  │     IT │ Event-driven │ 12 steps             │  │
│                │  │     [View] [Edit] [Disable] [···]           │  │
│                │  │                                              │  │
│                │  │  📋 Vendor Onboarding    ○ Draft   Never     │  │
│                │  │     Operations │ Manual │ 23 steps           │  │
│                │  │     [View] [Edit] [Activate] [···]          │  │
│                │  │                                              │  │
│                │  │  💰 Budget Approval      ● Active  1d ago    │  │
│                │  │     Finance │ Event-driven │ 8 steps         │  │
│                │  │     [View] [Edit] [Run] [···]               │  │
│                │  │                                              │  │
│                │  │  👤 Employee Offboard    ◐ Paused  3d ago    │  │
│                │  │     HR │ Manual │ 31 steps                   │  │
│                │  │     [View] [Edit] [Resume] [···]            │  │
│                │  │                                              │  │
│                │  │                                              │  │
│                │  │  ─────────────────────────────────────────── │  │
│                │  │  Showing 5 of 23 workflows   [Load More]     │  │
│                │  │                                              │  │
│                │  └──────────────────────────────────────────────┘  │
│                │                                                    │
│                │  ┌──────────────────────────────────────────────┐  │
│                │  │  RECENT EXECUTIONS                           │  │
│                │  │                                              │  │
│                │  │  ✓ Monthly Close      Completed   2h ago     │  │
│                │  │  ✓ Alert Escalation   Completed   5m ago     │  │
│                │  │  ✗ Data Sync          Failed      1h ago     │  │
│                │  │  ⏳ Report Generation  Running     Now        │  │
│                │  │                                              │  │
│                │  │  [View All Executions →]                     │  │
│                │  └──────────────────────────────────────────────┘  │
│                │                                                    │
└────────────────┴────────────────────────────────────────────────────┘
```

**Components**:
- `<WorkflowList />`
- `<WorkflowCard />`
- `<WorkflowFilters />`
- `<ExecutionHistory />`

**API Calls**:
```
GET /api/v1/workflows
GET /api/v1/workflows/{id}
POST /api/v1/workflows
PUT /api/v1/workflows/{id}
DELETE /api/v1/workflows/{id}
POST /api/v1/workflows/{id}/execute
GET /api/v1/workflows/executions
GET /api/v1/workflows/executions/{id}
```

---

### 2.2.10 The Bridge - Workflow Builder

**URL**: `/cortex/bridge/workflows/builder/{id?}`

**Purpose**: Visual workflow creation and editing

**Layout**:
```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER                                                             │
├────────────────┬────────────────────────────────────────────────────┤
│                │                                                    │
│  SIDEBAR       │  WORKFLOW BUILDER                                  │
│  (collapsible) │                                                    │
│                │  ┌──────────────────────────────────────────────┐  │
│  ┌──────────┐  │  │ Name: [Monthly Financial Close           ]  │  │
│  │ TRIGGERS │  │  │ Desc: [Automated month-end process...    ]  │  │
│  ├──────────┤  │  │                                              │  │
│  │ ⏰ Schedule│  │  │ [Save Draft] [Test] [Publish]              │  │
│  │ 📨 Event  │  │  └──────────────────────────────────────────────┘  │
│  │ 🔗 Webhook│  │                                                    │
│  │ 👤 Manual │  │  ┌──────────────────────────────────────────────┐  │
│  └──────────┘  │  │                                              │  │
│                │  │                                              │  │
│  ┌──────────┐  │  │  ┌─────────┐                                │  │
│  │ ACTIONS  │  │  │  │ TRIGGER │                                │  │
│  ├──────────┤  │  │  │Schedule │                                │  │
│  │ 📊 Query │  │  │  │1st of mo│                                │  │
│  │ 🔄 Transform│ │  │  └────┬────┘                                │  │
│  │ 📧 Email │  │  │       │                                     │  │
│  │ 💬 Slack │  │  │       ▼                                     │  │
│  │ 🔌 API   │  │  │  ┌─────────┐      ┌─────────┐              │  │
│  │ 📝 Create│  │  │  │  Query  │─────▶│Transform│              │  │
│  │ ✏️ Update │  │  │  │ Sales   │      │  Sum    │              │  │
│  └──────────┘  │  │  │  Data   │      │ by Acct │              │  │
│                │  │  └─────────┘      └────┬────┘              │  │
│  ┌──────────┐  │  │                        │                   │  │
│  │ LOGIC    │  │  │                        ▼                   │  │
│  ├──────────┤  │  │                   ┌─────────┐              │  │
│  │ ◇ If/Else│  │  │                   │   If    │              │  │
│  │ ⟳ Loop  │  │  │                   │Variance │              │  │
│  │ ⏸ Wait  │  │  │                   │  > 10%  │              │  │
│  │ ✓ Approve│  │  │                   └────┬────┘              │  │
│  │ ∥ Parallel│ │  │              ┌─────────┴─────────┐        │  │
│  └──────────┘  │  │              │                   │        │  │
│                │  │              ▼                   ▼        │  │
│  ┌──────────┐  │  │         ┌─────────┐       ┌─────────┐    │  │
│  │INTEGRATE │  │  │         │ Request │       │  Send   │    │  │
│  ├──────────┤  │  │         │Approval │       │ Report  │    │  │
│  │ Salesforce│  │  │         │  CFO    │       │  Email  │    │  │
│  │ SAP      │  │  │         └────┬────┘       └─────────┘    │  │
│  │ Slack    │  │  │              │                           │  │
│  │ Snowflake│  │  │              ▼                           │  │
│  │ + More   │  │  │         ┌─────────┐                      │  │
│  └──────────┘  │  │         │  Update │                      │  │
│                │  │         │  Ledger │                      │  │
│                │  │         └─────────┘                      │  │
│                │  │                                              │  │
│                │  └──────────────────────────────────────────────┘  │
│                │                                                    │
│                │  ┌──────────────────────────────────────────────┐  │
│                │  │  STEP CONFIG: "Query Sales Data"             │  │
│                │  │                                              │  │
│                │  │  Source: [Sales Mart         ▼]              │  │
│                │  │  Query:  [SELECT * FROM sales WHERE...]      │  │
│                │  │  Output: {{sales_data}}                      │  │
│                │  │                                              │  │
│                │  │  [Test Step]  [Delete]                       │  │
│                │  └──────────────────────────────────────────────┘  │
│                │                                                    │
└────────────────┴────────────────────────────────────────────────────┘
```

**Components**:
- `<WorkflowCanvas />` (drag-and-drop)
- `<NodePalette />`
- `<WorkflowNode />`
- `<NodeConfigPanel />`
- `<WorkflowToolbar />`

**API Calls**:
```
GET /api/v1/workflows/{id}/definition
PUT /api/v1/workflows/{id}/definition
POST /api/v1/workflows/{id}/validate
POST /api/v1/workflows/{id}/test
POST /api/v1/workflows/{id}/publish
```

---

### 2.2.11 Settings - Organization

**URL**: `/cortex/settings/organization`

**Purpose**: Manage organization settings, branding, preferences

**Layout**:
```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER                                                             │
├────────────────┬────────────────────────────────────────────────────┤
│                │                                                    │
│  SIDEBAR       │  SETTINGS                                          │
│                │                                                    │
│  ┌──────────┐  │  ┌────────────────────────────────────────────┐   │
│  │Organization│◀│  │  NAVIGATION                               │   │
│  └──────────┘  │  │  [General] [Branding] [Preferences] [Data] │   │
│  ┌──────────┐  │  └────────────────────────────────────────────┘   │
│  │Users     │  │                                                    │
│  └──────────┘  │  ┌────────────────────────────────────────────┐   │
│  ┌──────────┐  │  │  ORGANIZATION PROFILE                      │   │
│  │Billing   │  │  │                                            │   │
│  └──────────┘  │  │  Organization Name                         │   │
│  ┌──────────┐  │  │  [Acme Corporation                      ]  │   │
│  │API Keys  │  │  │                                            │   │
│  └──────────┘  │  │  Organization ID                           │   │
│  ┌──────────┐  │  │  org_7f8a9b2c3d4e (read-only)              │   │
│  │Integrations│ │  │                                            │   │
│  └──────────┘  │  │  Industry                                  │   │
│  ┌──────────┐  │  │  [Financial Services          ▼]           │   │
│  │Security  │  │  │                                            │   │
│  └──────────┘  │  │  Company Size                              │   │
│  ┌──────────┐  │  │  [1,001 - 5,000 employees     ▼]           │   │
│  │Preferences│ │  │                                            │   │
│  └──────────┘  │  │  Primary Contact                           │   │
│                │  │  [john.smith@acme.com                   ]  │   │
│                │  │                                            │   │
│                │  │  [Save Changes]                            │   │
│                │  └────────────────────────────────────────────┘   │
│                │                                                    │
│                │  ┌────────────────────────────────────────────┐   │
│                │  │  REGIONAL SETTINGS                         │   │
│                │  │                                            │   │
│                │  │  Timezone                                  │   │
│                │  │  [America/New_York (UTC-5)     ▼]          │   │
│                │  │                                            │   │
│                │  │  Date Format                               │   │
│                │  │  [MM/DD/YYYY                   ▼]          │   │
│                │  │                                            │   │
│                │  │  Currency                                  │   │
│                │  │  [USD ($)                      ▼]          │   │
│                │  │                                            │   │
│                │  │  Number Format                             │   │
│                │  │  [1,234.56                     ▼]          │   │
│                │  │                                            │   │
│                │  │  [Save Changes]                            │   │
│                │  └────────────────────────────────────────────┘   │
│                │                                                    │
│                │  ┌────────────────────────────────────────────┐   │
│                │  │  DANGER ZONE                               │   │
│                │  │                                            │   │
│                │  │  Export All Data                           │   │
│                │  │  Download all organization data            │   │
│                │  │  [Request Export]                          │   │
│                │  │                                            │   │
│                │  │  Delete Organization                       │   │
│                │  │  Permanently delete this organization      │   │
│                │  │  [Delete Organization]                     │   │
│                │  └────────────────────────────────────────────┘   │
│                │                                                    │
└────────────────┴────────────────────────────────────────────────────┘
```

**API Calls**:
```
GET /api/v1/organizations/current
PUT /api/v1/organizations/current
POST /api/v1/organizations/current/export
DELETE /api/v1/organizations/current
```

---

### 2.2.12 Settings - Users & Teams

**URL**: `/cortex/settings/users`

**Purpose**: Manage users, roles, teams, permissions

**Layout**:
```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER                                                             │
├────────────────┬────────────────────────────────────────────────────┤
│                │                                                    │
│  SIDEBAR       │  USERS & TEAMS                                     │
│                │                                                    │
│  (Settings     │  [Users] [Teams] [Roles]        [+ Invite User]   │
│   navigation)  │                                                    │
│                │  ┌────────────────────────────────────────────┐   │
│                │  │  [🔍 Search users...]                      │   │
│                │  │                                            │   │
│                │  │  NAME          EMAIL           ROLE   STATUS│  │
│                │  │  ──────────────────────────────────────────│   │
│                │  │                                            │   │
│                │  │  👤 John Smith                              │   │
│                │  │     john@acme.com     Admin    ● Active    │   │
│                │  │     Last login: 2 hours ago                │   │
│                │  │     [Edit] [Disable] [···]                 │   │
│                │  │                                            │   │
│                │  │  👤 Sarah Chen                              │   │
│                │  │     sarah@acme.com    Analyst  ● Active    │   │
│                │  │     Last login: 5 min ago                  │   │
│                │  │     [Edit] [Disable] [···]                 │   │
│                │  │                                            │   │
│                │  │  👤 Mike Johnson                            │   │
│                │  │     mike@acme.com     Viewer   ○ Invited   │   │
│                │  │     Invitation sent: Yesterday             │   │
│                │  │     [Resend] [Revoke] [···]                │   │
│                │  │                                            │   │
│                │  │  👤 Emily Davis                             │   │
│                │  │     emily@acme.com    Editor   ◐ Disabled  │   │
│                │  │     Disabled: 2 weeks ago                  │   │
│                │  │     [Enable] [Delete] [···]                │   │
│                │  │                                            │   │
│                │  │  ──────────────────────────────────────────│   │
│                │  │  Showing 4 of 47 users    [1] [2] [3] [→]  │   │
│                │  └────────────────────────────────────────────┘   │
│                │                                                    │
│                │  ┌────────────────────────────────────────────┐   │
│                │  │  LICENSE USAGE                             │   │
│                │  │                                            │   │
│                │  │  Active Users:  32 / 50 (64%)              │   │
│                │  │  ████████████████████████░░░░░░░░░░        │   │
│                │  │                                            │   │
│                │  │  [Upgrade Plan]                            │   │
│                │  └────────────────────────────────────────────┘   │
│                │                                                    │
└────────────────┴────────────────────────────────────────────────────┘
```

**API Calls**:
```
GET /api/v1/users
GET /api/v1/users/{id}
POST /api/v1/users/invite
PUT /api/v1/users/{id}
DELETE /api/v1/users/{id}
POST /api/v1/users/{id}/disable
POST /api/v1/users/{id}/enable
GET /api/v1/teams
POST /api/v1/teams
GET /api/v1/roles
```

---

This concludes Part 1 and Part 2 of the specification. Continue to the next file for Parts 3-9 covering APIs, Database Schemas, Connectors, Internationalization, Downloads, Licensing, and Component Library.
