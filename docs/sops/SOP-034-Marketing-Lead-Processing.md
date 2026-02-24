# SOP-034: Marketing Lead Processing

**Category:** Commercial
**Priority:** Medium
**Owner:** Marketing / Sales Lead
**Last Verified:** 2026-02-22 (against `backend/src/routes/marketing-leads.ts`, `src/pages/cortex/enterprise/MarketingStudioPage.tsx`)

---

## 1. Purpose

Define procedures for capturing, qualifying, tracking, and converting marketing leads generated through the Datacendia platform's marketing pages and contact forms.

---

## 2. Lead Sources

| Source | Entry Point | Capture Method |
|--------|------------|----------------|
| Contact form | `/contact` | Backend API (`/api/v1/contact`) |
| Demo request | `/pricing` → "Request Demo" | Lead form submission |
| Marketing landing | `/sovereign-landing`, `/manifesto` | CTA buttons |
| Marketing Studio | `/cortex/enterprise/marketing-studio` | Campaign-generated leads |
| Inbound API | External integrations | CendiaNexus™ connectors |

---

## 3. Lead Capture

### 3.1 Contact Form Submission
```bash
# Frontend submits to:
POST /api/v1/contact
{
  "name": "Jane Smith",
  "email": "jane@company.com",
  "company": "Acme Corp",
  "role": "CTO",
  "message": "Interested in Datacendia for our governance needs",
  "source": "contact_page"
}
```

### 3.2 Marketing Lead Submission
```bash
POST /api/v1/marketing-leads
{
  "email": "jane@company.com",
  "name": "Jane Smith",
  "company": "Acme Corp",
  "title": "CTO",
  "industry": "Financial Services",
  "companySize": "500-1000",
  "interest": ["DCII", "Collapse Mode", "Sovereign"],
  "source": "pricing_page",
  "campaign": "q1-2026-enterprise"
}
```

---

## 4. Lead Qualification

### 4.1 Automatic Scoring
| Signal | Points | Description |
|--------|--------|-------------|
| Company size > 500 | +20 | Enterprise potential |
| Industry: Finance/Healthcare/Government | +15 | Key verticals |
| Interest includes DCII or Sovereign | +15 | High-value services |
| C-level title | +10 | Decision-maker |
| Requested demo | +10 | Active interest |
| Visited pricing page | +5 | Purchase intent |
| Multiple page views | +5 | Engagement |

### 4.2 Lead Stages
| Stage | Score | Action |
|-------|-------|--------|
| **Cold** | 0–20 | Nurture via email |
| **Warm** | 21–50 | Personalized outreach |
| **Hot** | 51–75 | Schedule demo call |
| **Qualified** | 76+ | Sales engagement, pilot proposal |

---

## 5. Lead Processing Workflow

### 5.1 New Lead Received
1. Lead captured via API endpoint
2. Automatic deduplication (email-based)
3. Lead score calculated
4. Assigned to appropriate stage
5. Notification sent to sales team
6. CRM record created (if integrated)

### 5.2 Follow-Up Timeline
| Stage | Follow-Up | Method |
|-------|-----------|--------|
| Hot/Qualified | Within 4 hours | Phone/email |
| Warm | Within 24 hours | Personalized email |
| Cold | Within 48 hours | Template email |

### 5.3 Demo Scheduling
For qualified leads:
1. Send demo scheduling link
2. Pre-configure demo environment (see SOP-032)
3. Research client's industry and pain points
4. Customize demo flow for their vertical
5. Conduct demo
6. Follow up within 24 hours with pilot proposal

---

## 6. Marketing Studio Operations

CendiaMarketingStudio™ (`/cortex/enterprise/marketing-studio`) provides:

| Feature | Description |
|---------|-------------|
| Campaign creation | Multi-channel marketing campaigns |
| Lead tracking | Real-time lead pipeline view |
| Content generation | AI-assisted marketing content |
| Analytics | Campaign performance metrics |
| A/B testing | Landing page optimization |

---

## 7. Data Privacy

All lead processing must comply with:
- **GDPR** (if EU leads): Explicit consent required, right to erasure
- **CCPA** (if California leads): Do-not-sell option, privacy notice
- **CAN-SPAM**: Unsubscribe option in all marketing emails
- Lead data retention: 2 years maximum unless converted to customer
- See SOP-027 for full GDPR procedures

---

## 8. Reporting

### 8.1 Key Metrics
| Metric | Frequency | Target |
|--------|-----------|--------|
| Leads per month | Weekly | Growth trend |
| Lead-to-demo conversion | Monthly | > 30% |
| Demo-to-pilot conversion | Monthly | > 20% |
| Pilot-to-customer conversion | Quarterly | > 40% |
| Average lead score | Monthly | > 50 |
| Time to first contact | Weekly | < 4 hrs (hot), < 24 hrs (warm) |

---

## 9. Verified Against

- `backend/src/routes/marketing-leads.ts`: Marketing leads API endpoint
- `backend/src/routes/contact.ts`: Contact form API endpoint
- `backend/src/routes/domains/platform.domain.ts`: Routes registered
- `src/pages/cortex/enterprise/MarketingStudioPage.tsx`: Marketing Studio UI
- `src/pages/public/ContactPage.tsx`: Contact form frontend
- `src/pages/pricing/PricingPage.tsx`: Pricing page with CTA

---

*Datacendia, LLC — Proprietary and Confidential*
