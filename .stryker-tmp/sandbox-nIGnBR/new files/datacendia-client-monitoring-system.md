# 👁️ Datacendia Client Health Monitoring System

**See Everything. Respect Everything. Breach Nothing.**

A trust-first approach to understanding client health without accessing, viewing, or using their actual decision content.

---

## Core Principles

### What We Monitor
✅ **Behavioral signals** - How they use the platform
✅ **Engagement patterns** - Who uses it, how often
✅ **System metrics** - Performance, errors, load
✅ **Relationship signals** - Communication patterns, sentiment

### What We NEVER Access
❌ **Decision content** - What they're actually deciding
❌ **Deliberation details** - Agent recommendations, debates
❌ **Sensitive data** - Any data they input
❌ **Business intelligence** - Strategic information revealed

### The Trust Contract
```
"We can see THAT you're making decisions.
 We cannot see WHAT those decisions are.
 We can see HOW you use the Council.
 We cannot see WHAT the Council tells you."
```

---

## The Health Score Model

### Overview

Each customer gets a **Health Score (0-100)** calculated from behavioral signals only.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     CLIENT HEALTH SCORE MODEL                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  HEALTH SCORE = Weighted Average of:                                    │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  USAGE (35%)        │ Are they using the platform?               │  │
│  ├─────────────────────┼────────────────────────────────────────────┤  │
│  │  ENGAGEMENT (25%)   │ Are the right people engaged?              │  │
│  ├─────────────────────┼────────────────────────────────────────────┤  │
│  │  EXPANSION (20%)    │ Is usage growing or contracting?           │  │
│  ├─────────────────────┼────────────────────────────────────────────┤  │
│  │  RELATIONSHIP (20%) │ How is the human relationship?             │  │
│  └─────────────────────┴────────────────────────────────────────────┘  │
│                                                                         │
│  Score Interpretation:                                                  │
│  90-100: Champion (Expansion candidate)                                 │
│  75-89:  Healthy (Maintain engagement)                                  │
│  60-74:  Attention (Proactive outreach needed)                          │
│  40-59:  At Risk (Intervention required)                                │
│  0-39:   Critical (Executive escalation)                                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Metric Categories

### 1. USAGE METRICS (35% of score)

**What we measure:**

| Metric | How We Measure | Privacy Safe? |
|--------|---------------|---------------|
| Deliberation count | # of Council sessions initiated | ✅ Yes - count only |
| Session frequency | Days with at least 1 session | ✅ Yes - date only |
| Session duration | Time spent in platform | ✅ Yes - duration only |
| Feature breadth | # of different features used | ✅ Yes - feature flags |
| Agent diversity | # of different agents engaged | ✅ Yes - agent IDs only |
| Output actions | # of exports, shares, saves | ✅ Yes - action counts |

**What we DON'T measure:**

| Never Tracked | Why |
|---------------|-----|
| Deliberation topics | Content = confidential |
| Decision outcomes | Their business intelligence |
| Agent recommendations | Proprietary advice |
| Data inputs | Their sensitive information |
| Search queries | Reveals strategy |

**Scoring:**

```
USAGE SCORE CALCULATION:

Deliberation Velocity (40% of Usage)
├── 0-2 per week: 0-30 points
├── 3-5 per week: 31-60 points
├── 6-10 per week: 61-80 points
└── 11+ per week: 81-100 points

Session Frequency (30% of Usage)
├── <1 day/week active: 0-30 points
├── 1-2 days/week: 31-60 points
├── 3-4 days/week: 61-80 points
└── 5+ days/week: 81-100 points

Feature Breadth (30% of Usage)
├── 1-2 features used: 0-30 points
├── 3-4 features used: 31-60 points
├── 5-6 features used: 61-80 points
└── 7+ features used: 81-100 points
```

---

### 2. ENGAGEMENT METRICS (25% of score)

**What we measure:**

| Metric | How We Measure | Privacy Safe? |
|--------|---------------|---------------|
| Active users | # of unique logins | ✅ Yes - count only |
| User growth | New users month-over-month | ✅ Yes - count trend |
| Executive engagement | C-level user activity | ✅ Yes - role tag only |
| Team spread | # of departments using | ✅ Yes - dept tags only |
| Login recency | Days since last login per user | ✅ Yes - dates only |
| User retention | % of users active month-over-month | ✅ Yes - % calc |

**What we DON'T measure:**

| Never Tracked | Why |
|---------------|-----|
| Which specific decisions each user runs | Individual behavior = sensitive |
| User-level deliberation content | Personal work product |
| Who made what recommendation | Attribution = sensitive |
| Inter-user sharing content | Communication = private |

**Scoring:**

```
ENGAGEMENT SCORE CALCULATION:

Active User Ratio (35% of Engagement)
├── <25% of licensed users active: 0-30 points
├── 25-50% active: 31-60 points
├── 51-75% active: 61-80 points
└── >75% active: 81-100 points

Executive Engagement (35% of Engagement)
├── No C-level activity: 0-30 points
├── C-level login but no sessions: 31-50 points
├── C-level occasional sessions: 51-70 points
├── C-level regular sessions: 71-85 points
└── Multiple C-level active: 86-100 points

Team Spread (30% of Engagement)
├── 1 department: 0-40 points
├── 2 departments: 41-60 points
├── 3-4 departments: 61-80 points
└── 5+ departments: 81-100 points
```

---

### 3. EXPANSION METRICS (20% of score)

**What we measure:**

| Metric | How We Measure | Privacy Safe? |
|--------|---------------|---------------|
| Usage trend | Month-over-month deliberation count | ✅ Yes - trend only |
| User growth trend | Month-over-month user adds | ✅ Yes - count trend |
| Feature adoption | New features tried over time | ✅ Yes - feature flags |
| Seat utilization | % of licenses being used | ✅ Yes - utilization % |
| Upsell signals | Hitting usage limits | ✅ Yes - threshold flags |
| API growth | Integration usage trend | ✅ Yes - call counts |

**Scoring:**

```
EXPANSION SCORE CALCULATION:

Usage Trend (40% of Expansion)
├── Declining >20%: 0-20 points
├── Declining 1-20%: 21-40 points
├── Flat (±0%): 41-60 points
├── Growing 1-20%: 61-80 points
└── Growing >20%: 81-100 points

User Trend (30% of Expansion)
├── Losing users: 0-30 points
├── Flat: 31-50 points
├── Adding 1-2 users/month: 51-70 points
├── Adding 3-5 users/month: 71-85 points
└── Adding >5 users/month: 86-100 points

Seat Utilization (30% of Expansion)
├── <50% utilized: 0-40 points (may be at risk)
├── 50-75% utilized: 41-60 points
├── 76-90% utilized: 61-80 points
└── >90% utilized: 81-100 points (upsell signal)
```

---

### 4. RELATIONSHIP METRICS (20% of score)

**What we measure:**

| Metric | How We Measure | Privacy Safe? |
|--------|---------------|---------------|
| Response time | How fast they respond to us | ✅ Yes - timestamp diff |
| Meeting attendance | % of scheduled meetings attended | ✅ Yes - attendance |
| NPS score | Survey responses | ✅ Yes - explicit consent |
| Support sentiment | Tone of support interactions | ✅ Yes - our analysis |
| Communication frequency | How often we interact | ✅ Yes - our records |
| Escalation rate | Support ticket severity | ✅ Yes - our classification |

**What we DON'T analyze:**

| Never Analyzed | Why |
|----------------|-----|
| Content of their emails | Communication privacy |
| Internal discussions about us | Would require surveillance |
| Sentiment about decisions | Content = off limits |
| Reasons for decisions | Strategic = confidential |

**Scoring:**

```
RELATIONSHIP SCORE CALCULATION:

NPS / Sentiment (40% of Relationship)
├── Detractor (0-6): 0-30 points
├── Passive (7-8): 31-60 points
├── Promoter (9-10): 61-100 points
└── No survey: Use other signals

Communication Health (30% of Relationship)
├── Unresponsive (>7 days avg): 0-30 points
├── Slow (3-7 days avg): 31-50 points
├── Normal (1-3 days avg): 51-70 points
├── Responsive (<1 day avg): 71-85 points
└── Proactive (they reach out): 86-100 points

Support Health (30% of Relationship)
├── Frequent escalations: 0-30 points
├── Regular tickets, some frustration: 31-50 points
├── Normal ticket volume, neutral: 51-70 points
├── Low tickets, positive tone: 71-85 points
└── Minimal tickets, advocate behavior: 86-100 points
```

---

## Alert System

### Alert Tiers

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ALERT TIER SYSTEM                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  🟢 TIER 1: INFORMATIONAL                                               │
│     Notify: CSM only (daily digest)                                     │
│     Examples:                                                           │
│     • Usage dip >10% week-over-week                                     │
│     • New user added                                                    │
│     • Feature adoption milestone                                        │
│                                                                         │
│  🟡 TIER 2: ATTENTION                                                   │
│     Notify: CSM (immediate) + Manager (daily digest)                    │
│     Examples:                                                           │
│     • Usage dip >25% month-over-month                                   │
│     • Executive disengagement (no login 14+ days)                       │
│     • Support ticket with negative sentiment                            │
│     • No response to outreach in 7+ days                                │
│                                                                         │
│  🔴 TIER 3: URGENT                                                      │
│     Notify: CSM + Manager (immediate) + CS Leader (same day)            │
│     Examples:                                                           │
│     • Usage drop >50% month-over-month                                  │
│     • No logins in 14+ days (any user)                                  │
│     • Negative NPS submitted                                            │
│     • Escalation ticket opened                                          │
│     • Contact mentions "cancel" or "not renewing"                       │
│                                                                         │
│  ⚫ TIER 4: CRITICAL                                                    │
│     Notify: All above + Executive sponsor (immediate)                   │
│     Examples:                                                           │
│     • Zero usage for 30+ days                                           │
│     • Formal cancellation inquiry                                       │
│     • Executive complaint received                                      │
│     • Legal/security concern raised                                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Alert Triggers (Automated)

```python
# Pseudocode for alert triggers (privacy-safe)

USAGE_ALERTS = {
    'usage_dip_10': {
        'condition': week_over_week_change < -10%,
        'tier': 1,
        'message': 'Usage down {X}% this week'
    },
    'usage_dip_25': {
        'condition': month_over_month_change < -25%,
        'tier': 2,
        'message': 'Usage down {X}% this month - outreach recommended'
    },
    'usage_dip_50': {
        'condition': month_over_month_change < -50%,
        'tier': 3,
        'message': 'URGENT: Usage dropped {X}% - immediate action needed'
    },
    'zero_usage': {
        'condition': days_since_last_session > 30,
        'tier': 4,
        'message': 'CRITICAL: No usage in 30+ days'
    }
}

ENGAGEMENT_ALERTS = {
    'exec_disengaged': {
        'condition': c_level_days_since_login > 14,
        'tier': 2,
        'message': 'Executive user inactive 14+ days'
    },
    'user_churn': {
        'condition': monthly_active_users < previous_month * 0.8,
        'tier': 2,
        'message': 'Active users down 20%+'
    },
    'no_logins': {
        'condition': any_user_days_since_login > 14,
        'tier': 3,
        'message': 'No logins from any user in 14+ days'
    }
}

RELATIONSHIP_ALERTS = {
    'slow_response': {
        'condition': avg_response_time > 7 days,
        'tier': 2,
        'message': 'Customer response time slowing'
    },
    'negative_nps': {
        'condition': nps_score < 7,
        'tier': 3,
        'message': 'Negative NPS received: {score}'
    },
    'escalation': {
        'condition': ticket_severity == 'escalation',
        'tier': 3,
        'message': 'Support escalation opened'
    },
    'cancel_mention': {
        'condition': 'cancel' in recent_communications,
        'tier': 4,
        'message': 'CRITICAL: Cancellation mentioned'
    }
}
```

---

## Dashboard Views

### CSM Dashboard

```
┌─────────────────────────────────────────────────────────────────────────┐
│  MY PORTFOLIO HEALTH                                    [FILTER] [DATE] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  SUMMARY                                                                │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Total Accounts: 24    │  ARR: $2.4M    │  Avg Health: 76       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  BY HEALTH TIER                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  🟢 Champion (90+):    4 accounts ($890K ARR)                   │   │
│  │  🟢 Healthy (75-89):   12 accounts ($980K ARR)                  │   │
│  │  🟡 Attention (60-74): 5 accounts ($340K ARR)                   │   │
│  │  🔴 At Risk (40-59):   2 accounts ($145K ARR)                   │   │
│  │  ⚫ Critical (<40):    1 account ($45K ARR)                     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ALERTS REQUIRING ACTION                                                │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ⚫ Acme Corp: Zero usage 32 days - CALL TODAY                  │   │
│  │  🔴 TechStart: Usage down 55% - schedule check-in               │   │
│  │  🔴 MegaBank: Negative NPS (6) - review feedback                │   │
│  │  🟡 RetailCo: Exec inactive 18 days - outreach needed           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ACCOUNTS LIST                                                          │
│  ┌────────────────┬────────┬────────┬─────────┬──────────┬──────────┐  │
│  │ Account        │ Health │ Trend  │ ARR     │ Renewal  │ Action   │  │
│  ├────────────────┼────────┼────────┼─────────┼──────────┼──────────┤  │
│  │ BigCorp Inc    │ 94 🟢  │ ↑ +3   │ $240K   │ 8 months │ Expand   │  │
│  │ StartupXYZ     │ 87 🟢  │ ↔ 0    │ $85K    │ 4 months │ Maintain │  │
│  │ Acme Corp      │ 28 ⚫  │ ↓ -24  │ $45K    │ 2 months │ URGENT   │  │
│  │ [...]          │        │        │         │          │          │  │
│  └────────────────┴────────┴────────┴─────────┴──────────┴──────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Account Deep Dive

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ACME CORPORATION                                        Health: 28 ⚫  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  HEALTH BREAKDOWN                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Usage:        18/100  ████░░░░░░░░░░░░░░░░  (Critical)        │   │
│  │  Engagement:   35/100  ███████░░░░░░░░░░░░░  (At Risk)         │   │
│  │  Expansion:    22/100  ████░░░░░░░░░░░░░░░░  (Declining)       │   │
│  │  Relationship: 45/100  █████████░░░░░░░░░░░  (Attention)       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  USAGE TREND (12 weeks)                                                 │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Sessions │                                                      │   │
│  │    25 ┤    ████                                                 │   │
│  │    20 ┤    ████ ████                                            │   │
│  │    15 ┤    ████ ████ ████                                       │   │
│  │    10 ┤    ████ ████ ████ ████                                  │   │
│  │     5 ┤    ████ ████ ████ ████ ████                             │   │
│  │     0 ┤    ████ ████ ████ ████ ████ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░   │   │
│  │       └────W1───W2───W3───W4───W5───W6───W7───W8───W9───W10──   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  ⚠️ No sessions in 32 days                                              │
│                                                                         │
│  USER ENGAGEMENT                                                        │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Licensed: 15  │  Active (30d): 0  │  Utilization: 0%          │   │
│  │                                                                  │   │
│  │  Last Active Users:                                              │   │
│  │  • Sarah Chen (CFO): 34 days ago                                │   │
│  │  • Mike Johnson (COO): 38 days ago                              │   │
│  │  • Jennifer Wu (VP Ops): 32 days ago                            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  RELATIONSHIP HISTORY                                                   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Last CSM contact: 28 days ago                                   │   │
│  │  Last customer response: 21 days ago                             │   │
│  │  Outstanding outreach: 2 (unanswered)                           │   │
│  │  NPS (last): 6 (Detractor) - 45 days ago                        │   │
│  │  Support tickets: 0 open, 3 closed (last 90 days)               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ALERTS                                                                 │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ⚫ Nov 28: Zero usage 32 days                                   │   │
│  │  🔴 Nov 15: Usage dropped 75% month-over-month                  │   │
│  │  🔴 Nov 10: Executive inactive 14+ days                         │   │
│  │  🟡 Oct 28: Usage dip 30% week-over-week                        │   │
│  │  🟡 Oct 15: Negative NPS received (6)                           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  RECOMMENDED ACTIONS                                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  1. ☎️  Call Sarah Chen (CFO) TODAY - exec re-engagement        │   │
│  │  2. 📧 Send value reminder with recent industry insights        │   │
│  │  3. 📅 Propose in-person meeting (relationship repair)          │   │
│  │  4. 🎁 Consider early delivery of 6-month loyalty package       │   │
│  │  5. ⬆️  Escalate to CS Director if no response by Dec 1         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  CONTRACT DETAILS                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ARR: $45,000  │  Renewal: Feb 15, 2026 (79 days)               │   │
│  │  Tier: Professional  │  Seats: 15                                │   │
│  │  Contract length: 12 months  │  Discount: 10%                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Privacy Controls

### Data Collection Principles

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    PRIVACY-BY-DESIGN PRINCIPLES                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. AGGREGATION ONLY                                                    │
│     We collect counts, not content.                                     │
│     ✓ "12 deliberations this week"                                     │
│     ✗ "Deliberation about Q3 budget allocation"                        │
│                                                                         │
│  2. METADATA, NOT DATA                                                  │
│     We collect activity signals, not activity substance.               │
│     ✓ "Session lasted 23 minutes"                                      │
│     ✗ "Session discussed competitor acquisition"                       │
│                                                                         │
│  3. PATTERNS, NOT PARTICULARS                                          │
│     We identify trends, not specifics.                                 │
│     ✓ "CFO Agent most frequently engaged"                              │
│     ✗ "CFO Agent recommended against the merger"                       │
│                                                                         │
│  4. BEHAVIORAL, NOT SUBSTANTIVE                                        │
│     We track how they interact, not what they decide.                  │
│     ✓ "User exported 3 reports this week"                              │
│     ✗ "User exported report recommending layoffs"                      │
│                                                                         │
│  5. OUR DATA, NOT THEIRS                                               │
│     We analyze our relationship data, not their business data.         │
│     ✓ "Response time to our emails: 2.3 days avg"                      │
│     ✗ "Their email mentioned budget concerns"                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Technical Implementation

```
DATA COLLECTION LAYER:

┌─────────────────────┐
│   User Activity     │
│   (Raw Events)      │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│   Privacy Filter    │ ← Strips all content
│   (Real-time)       │ ← Keeps only metadata
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│   Aggregation       │ ← Counts events
│   Service           │ ← Calculates metrics
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│   Health Score      │ ← Weighted calculation
│   Engine            │ ← Alert generation
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│   CSM Dashboard     │ ← Visual display
│                     │ ← Action recommendations
└─────────────────────┘

PRIVACY FILTER RULES:

PASS THROUGH:
- Event type (login, session_start, session_end, export, etc.)
- Timestamp
- User ID (hashed)
- User role tag (C-level, VP, Manager, etc.)
- Department tag (Finance, Ops, etc.)
- Feature ID used
- Agent ID engaged (not what agent said)
- Duration (seconds)
- Action counts

STRIP/BLOCK:
- Session content
- Deliberation text
- Agent responses
- User inputs
- Export content
- Search queries
- Decision names
- Any free text
```

### Customer Communication

**What customers are told:**

```
PRIVACY NOTICE (Platform Settings)

"Datacendia monitors platform usage to ensure you're getting 
value from your subscription. We track:

• How often you use the platform
• Which features you engage with
• General usage patterns and trends

We DO NOT access:
• The content of your decisions
• What the Council recommends to you
• Any data you input into the system
• The substance of your deliberations

Your decision-making is confidential. We only see that 
you're making decisions, not what those decisions are.

Questions? Contact privacy@datacendia.com"
```

---

## Intervention Playbooks

### By Health Score Tier

#### Champion (90-100): Expansion Play

```
GOAL: Turn success into growth

SIGNALS:
• High usage, growing trend
• Multiple departments engaged
• Executive active
• Positive NPS
• Proactive communication

ACTIONS:
1. Schedule Quarterly Business Review
2. Identify expansion opportunities
3. Request case study / reference
4. Introduce new features
5. Connect with executive sponsor

TIMELINE: Standard cadence (monthly touch)
```

#### Healthy (75-89): Maintain Play

```
GOAL: Sustain engagement, look for growth

SIGNALS:
• Consistent usage
• Stable engagement
• Neutral-positive sentiment
• Regular communication

ACTIONS:
1. Maintain regular check-ins
2. Share relevant industry insights
3. Introduce new capabilities
4. Monitor for expansion signals
5. Ensure renewal prep starts 90 days out

TIMELINE: Standard cadence (monthly touch)
```

#### Attention (60-74): Proactive Play

```
GOAL: Re-engage before it becomes a problem

SIGNALS:
• Usage dipping
• Engagement narrowing
• Communication slowing
• Missed meetings

ACTIONS:
1. Immediate outreach (personal, not templated)
2. Offer value-add session
3. Identify obstacles to usage
4. Propose success planning call
5. Consider early loyalty package delivery

TIMELINE: Weekly touch until stabilized
```

#### At Risk (40-59): Intervention Play

```
GOAL: Prevent churn, address root causes

SIGNALS:
• Significant usage decline
• Key users disengaged
• Slow/no communication
• Negative sentiment signals

ACTIONS:
1. CSM + Manager joint outreach
2. Executive-to-executive connection
3. On-site visit offer
4. Value realization review
5. Contract flexibility discussion (if needed)

TIMELINE: Multiple touches per week
ESCALATION: CS Director if no improvement in 2 weeks
```

#### Critical (<40): Save Play

```
GOAL: Immediate action to prevent loss

SIGNALS:
• Near-zero usage
• No communication
• Negative NPS
• Cancellation signals

ACTIONS:
1. Same-day executive escalation
2. Emergency customer meeting request
3. Executive sponsor direct outreach
4. Full account review
5. Retention offer preparation

TIMELINE: Daily action until resolved
ESCALATION: VP/CRO involvement within 48 hours
```

---

## Reporting

### Weekly Health Report

```
CUSTOMER HEALTH WEEKLY REPORT
Week of: [DATE]

PORTFOLIO SUMMARY
────────────────────────────────────
Total Accounts: XXX | ARR: $X.XM
Avg Health Score: XX | Trend: [↑/↓/↔]

HEALTH DISTRIBUTION
────────────────────────────────────
Champion (90+):    XX accounts (XX%)
Healthy (75-89):   XX accounts (XX%)
Attention (60-74): XX accounts (XX%)
At Risk (40-59):   XX accounts (XX%)
Critical (<40):    XX accounts (XX%)

WEEK-OVER-WEEK CHANGES
────────────────────────────────────
Improved 5+ points:  XX accounts
Declined 5+ points:  XX accounts
New alerts:          XX
Resolved alerts:     XX

ACCOUNTS REQUIRING ACTION
────────────────────────────────────
[List critical/at-risk accounts with owner and action]

WINS
────────────────────────────────────
[List accounts that improved significantly or showed positive signals]
```

### Monthly Executive Report

```
CUSTOMER HEALTH EXECUTIVE SUMMARY
Month: [MONTH YEAR]

KEY METRICS
────────────────────────────────────
Portfolio Health Score: XX (↑X from last month)
Accounts at Risk: XX ($XXK ARR)
Net Health Movement: +/-XX accounts improved/declined
Predicted Churn Risk: $XXK (XX accounts)

RENEWALS THIS QUARTER
────────────────────────────────────
Coming Due: XX accounts ($X.XM ARR)
Confident: XX accounts ($XXK)
Needs Work: XX accounts ($XXK)
At Risk: XX accounts ($XXK)

ACTION SUMMARY
────────────────────────────────────
Interventions Launched: XX
Escalations: XX
Saves: XX
Losses: XX

TRENDS
────────────────────────────────────
[Key observations about health patterns, common issues, opportunities]
```

---

**Document Version:** 1.0  
**Last Updated:** November 2025  
**Classification:** Customer Success - Internal
