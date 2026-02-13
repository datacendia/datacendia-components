# Datacendia Demo Data Guide

**Version:** 1.0  
**Last Updated:** January 30, 2026  
**Purpose:** Showcase platform capabilities without real customer data

---

## 1. Demo Data Strategy

### 1.1 Approach Options

| Option | When to Use | Pros | Cons |
|--------|-------------|------|------|
| **Pre-seeded Scenarios** | Sales demos, investor meetings | Consistent, polished | Static, predictable |
| **Synthetic Data Gen** | Technical evaluations | Realistic variety | Requires setup |
| **Industry Templates** | Vertical-specific demos | Domain credibility | Needs customization |
| **Live Sandbox** | POC, hands-on trials | Interactive, real | Needs cleanup |

### 1.2 Existing Demo Infrastructure

You already have:

| Component | Location | Description |
|-----------|----------|-------------|
| **Demo Seed API** | `backend/src/routes/demo-seed.ts` | Seeds complete demo scenarios |
| **TR Demo Scenario** | Seeded via `/api/v1/demo/seed/tr` | $2.5M Petrov transfer scenario |
| **Sample Data Service** | `backend/src/services/SampleDataService.ts` | Generates sample data |
| **Demo Launcher Page** | `src/pages/cortex/demo/DemoLauncherPage.tsx` | UI for launching demos |

---

## 2. Pre-Built Demo Scenarios

### 2.1 Thomson Reuters Demo (Financial)

**Scenario:** $2.5M Fund Transfer to PEP through Cyprus Holding Company

```bash
# Seed the TR demo
curl -X POST http://localhost:3001/api/v1/demo/seed/tr

# What gets created:
# - Organization: Meridian Financial Services
# - Deliberation: Petrov Transfer decision
# - 4 agent messages (CFO, Risk, Legal, Compliance)
# - Formal dissent from Risk Analyzer
# - Decision packet with Merkle proof
# - Cryptographic signature
```

**Demo Flow:**
1. **CendiaPulse** → Watch Treasury Bot escalate
2. **Council Page** → See multi-agent deliberation
3. **Dissent Page** → View formal Risk Analyzer objection
4. **Decision DNA** → Show cryptographic proof

### 2.2 Healthcare Demo (HIPAA)

```typescript
// Create healthcare scenario
const healthcareDemo = {
  organization: {
    name: 'Memorial Health System',
    vertical: 'healthcare',
    compliance: ['HIPAA', 'HITECH'],
  },
  scenario: {
    type: 'clinical_decision_support',
    question: 'Should we recommend experimental treatment for terminal patient based on AI analysis of similar cases?',
    context: {
      patientId: 'DEMO-12345', // Synthetic
      diagnosis: 'Stage IV Glioblastoma',
      prognosis: '6-12 months',
      treatmentOption: 'CAR-T experimental therapy',
      successRate: '23% in similar cases',
      cost: '$450,000',
      insuranceCoverage: 'Denied',
    },
  },
  agents: [
    { id: 'oncologist_ai', role: 'Medical Expert' },
    { id: 'ethics_advisor', role: 'Ethics Committee' },
    { id: 'financial_advisor', role: 'Financial Review' },
    { id: 'patient_advocate', role: 'Patient Rights' },
  ],
};
```

### 2.3 Legal Demo (Contract Review)

```typescript
const legalDemo = {
  organization: {
    name: 'Sterling & Associates LLP',
    vertical: 'legal',
    compliance: ['ABA Model Rules', 'State Bar'],
  },
  scenario: {
    type: 'contract_analysis',
    question: 'Should we advise client to accept $45M acquisition offer given identified IP risks?',
    context: {
      dealValue: 45000000,
      client: 'TechStart Inc.',
      acquirer: 'MegaCorp Global',
      ipRisks: [
        'Patent 7,234,567 may have prior art',
        '3 pending infringement suits',
        'Key inventor departed without assignment',
      ],
      timeline: '48 hours to respond',
    },
  },
  agents: [
    { id: 'ip_counsel', role: 'IP Expert' },
    { id: 'ma_counsel', role: 'M&A Expert' },
    { id: 'litigation_counsel', role: 'Litigation Risk' },
    { id: 'client_advocate', role: 'Client Interest' },
  ],
};
```

### 2.4 Defense Demo (FedRAMP)

```typescript
const defenseDemo = {
  organization: {
    name: 'Sentinel Defense Systems',
    vertical: 'defense',
    compliance: ['FedRAMP High', 'CMMC Level 3', 'ITAR'],
  },
  scenario: {
    type: 'procurement_decision',
    question: 'Should we award $120M contract to Vendor B despite lower technical score?',
    context: {
      vendors: [
        { name: 'Vendor A', technical: 92, cost: 135000000, past: 'Excellent' },
        { name: 'Vendor B', technical: 78, cost: 120000000, past: 'Satisfactory' },
      ],
      constraints: ['Budget cap: $125M', 'Delivery: 18 months', 'ITAR required'],
      reviewBoard: ['Contracting Officer', 'Technical Eval', 'Legal', 'Security'],
    },
  },
};
```

---

## 3. Synthetic Data Generation

### 3.1 Using the Sample Data Service

```typescript
import { SampleDataService } from '@/services/SampleDataService';

// Generate realistic synthetic data
const sampleService = new SampleDataService();

// Generate a complete organization with data
const orgData = await sampleService.generateOrganization({
  vertical: 'financial',
  size: 'enterprise',
  decisions: 50,      // Number of past decisions
  deliberations: 10,  // Active deliberations
  users: 25,          // Team members
});

// Generate specific data types
const decisions = await sampleService.generateDecisions({
  count: 100,
  vertical: 'healthcare',
  dateRange: { start: '2025-01-01', end: '2026-01-30' },
  includeOutcomes: true,
});
```

### 3.2 Realistic Data Patterns

```typescript
// Names that look real but are synthetic
const syntheticNames = {
  companies: [
    'Meridian Financial Services',
    'Apex Healthcare Partners',
    'Constellation Energy Holdings',
    'Sterling & Associates LLP',
    'Quantum Defense Systems',
  ],
  people: [
    'Sarah Chen', 'Marcus Williams', 'Elena Petrova',
    'James Morrison', 'Aisha Patel', 'Robert Tanaka',
  ],
  locations: [
    'New York, NY', 'San Francisco, CA', 'Chicago, IL',
    'Boston, MA', 'Austin, TX', 'Seattle, WA',
  ],
};

// Financial amounts that look realistic
const generateAmount = (min: number, max: number) => {
  const base = Math.random() * (max - min) + min;
  // Round to look like real business numbers
  if (base > 1000000) return Math.round(base / 100000) * 100000;
  if (base > 100000) return Math.round(base / 10000) * 10000;
  return Math.round(base / 1000) * 1000;
};
```

---

## 4. Industry-Specific Demo Templates

### 4.1 Template Structure

Each vertical has a demo template in `backend/src/data/demo-templates/`:

```
demo-templates/
├── financial/
│   ├── scenarios.json       # Pre-built scenarios
│   ├── agents.json          # Industry-specific agents
│   ├── compliance.json      # Regulatory frameworks
│   └── sample-decisions.json
├── healthcare/
│   ├── scenarios.json
│   ├── agents.json
│   ├── compliance.json
│   └── sample-decisions.json
├── legal/
├── defense/
├── energy/
└── insurance/
```

### 4.2 Loading Templates

```typescript
// Load industry-specific demo
import { loadDemoTemplate } from '@/data/demo-templates';

const financialDemo = await loadDemoTemplate('financial', 'basel-compliance');
const healthcareDemo = await loadDemoTemplate('healthcare', 'clinical-trial');
const legalDemo = await loadDemoTemplate('legal', 'merger-review');
```

---

## 5. Demo Best Practices

### 5.1 What Makes a Compelling Demo

| Element | Good | Bad |
|---------|------|-----|
| **Scenario** | Time-sensitive, high-stakes | Generic, low-impact |
| **Amounts** | $2.5M, $45M, $120M | $1,000, $10,000 |
| **Urgency** | "45 minutes to market close" | "Sometime next quarter" |
| **Conflict** | Dissent between agents | All agents agree |
| **Compliance** | Basel III, HIPAA, FedRAMP | Generic "rules" |
| **Outcome** | Conditional approval with audit trail | Simple yes/no |

### 5.2 Demo Script Template

```markdown
## Demo: [Scenario Name]

### Setup (2 min)
- Open CendiaPulse
- Ensure demo data is seeded
- Have Decision DNA page ready in another tab

### Hook (1 min)
"Imagine it's 3:15pm. Market closes in 45 minutes. Your Treasury Bot 
just flagged a $2.5M transfer to a PEP through a Cyprus holding company..."

### Demonstration (10 min)
1. Show the escalation in real-time
2. Walk through agent deliberation
3. Highlight the dissent and why it matters
4. Show the cryptographic proof
5. Export the audit package

### Close (2 min)
"This decision is now provable, auditable, and defensible. The entire 
process took 25 minutes and generated court-ready evidence."
```

### 5.3 Common Demo Pitfalls

| Pitfall | Solution |
|---------|----------|
| Data looks obviously fake | Use realistic names, amounts, dates |
| Too many features at once | Focus on 3-4 key capabilities |
| No conflict/tension | Include agent dissent in every demo |
| Technical deep-dive too early | Start with business value |
| Demo environment breaks | Always have backup screenshots/video |

---

## 6. Quick Commands

### 6.1 Seed Demo Data

```bash
# Seed TR demo (Financial)
npm run demo:seed:tr

# Seed all demo scenarios
npm run demo:seed:all

# Reset demo environment
npm run demo:reset

# Generate 100 synthetic decisions
npm run demo:generate -- --count=100 --vertical=financial
```

### 6.2 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/demo/seed/tr` | POST | Seed TR demo scenario |
| `/api/v1/demo/seed/:vertical` | POST | Seed vertical-specific demo |
| `/api/v1/demo/reset` | POST | Clear all demo data |
| `/api/v1/demo/generate` | POST | Generate synthetic data |
| `/api/v1/demo/status` | GET | Check demo data status |

---

## 7. Video/Screenshot Backup

For critical demos, maintain backup assets:

```
/demo-assets/
├── videos/
│   ├── tr-demo-full.mp4          # 12-minute complete walkthrough
│   ├── council-deliberation.mp4   # 3-minute council focus
│   └── decision-dna-proof.mp4     # 2-minute cryptographic proof
├── screenshots/
│   ├── live-monitor-escalation.png
│   ├── council-page-dissent.png
│   ├── decision-dna-merkle.png
│   └── audit-package-export.png
└── slide-decks/
    ├── investor-deck.pdf
    ├── sales-deck.pdf
    └── technical-deck.pdf
```

---

## 8. Summary: Answering "We Have No Real Customer Data"

**Your response:**

> "We use realistic synthetic data designed by industry experts. Each demo 
> scenario includes authentic compliance requirements, realistic business 
> decisions, and genuine regulatory frameworks. The synthetic data allows 
> us to demonstrate the full platform capability without exposing any real 
> customer information - which is actually a security feature our enterprise 
> customers appreciate."

**Key points:**
1. Synthetic data is **intentional**, not a limitation
2. Demo scenarios are **based on real industry patterns**
3. Compliance frameworks are **authentic** (Basel III, HIPAA, etc.)
4. Platform works identically with **real data when deployed**

---

*Document Owner: Product Team*  
*Review Cycle: Monthly*
