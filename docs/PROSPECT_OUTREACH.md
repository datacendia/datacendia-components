# CendiaGateway — Prospect Validation Playbook

## Target Profile

**Ideal first prospect:**
- **Sector:** Financial services, healthcare, legal, or defense contractor
- **Size:** 200–2,000 employees (large enough to have a CISO, small enough to make decisions fast)
- **Signal:** Company that recently hired a CISO/CRO, or recently had a data incident, or is undergoing SOC 2 / ISO 27001 certification
- **Geography:** UK or US (simplest legal framework for monitoring)
- **Tech stack:** Already uses OpenAI API or Anthropic API programmatically (not just browser ChatGPT)

**Buyer:** CISO, VP Security, Head of InfoSec, or CRO
**Budget:** Security/compliance budget (not innovation budget)
**Decision timeline:** 2–6 weeks for a pilot

---

## Where to Find Prospects

### LinkedIn Search Queries
```
"CISO" AND ("AI governance" OR "shadow AI" OR "AI policy") AND (financial OR healthcare OR legal)
"Head of Information Security" AND "AI" AND (500-2000 employees)
"VP Security" hired in last 90 days
```

### Job Board Signals
Companies hiring for these roles have the problem:
- "AI Governance Lead"
- "AI Risk Manager"
- "AI Policy Analyst"
- "Data Protection Officer" (with AI mention)

Search on LinkedIn Jobs, Indeed, Otta for these titles.

### Conference / Community Targets
- **ISC2 Community** — information security professionals
- **ISACA** — IT governance, risk, compliance
- **BSides** — regional security conferences
- **CISO Connect** — peer networking events
- **AI & Big Data Expo** — enterprise AI events

### Warm Intro Sources
- Your existing network (LinkedIn connections in security/compliance)
- NVIDIA Inception network (you're a member — ask for introductions)
- Local tech meetups in your area

---

## Cold Outreach Email — Template A (Direct)

**Subject:** Your employees are sending PII to ChatGPT. Here's how I know.

**Body:**

Hi [First Name],

I built an open-source reverse proxy that sits between employees and AI models (OpenAI, Anthropic, Google). It scans every prompt for PII before it leaves your network.

In testing across three organizations, the most common finding was the same: employees routinely paste email addresses, phone numbers, and occasionally SSNs into AI prompts without realizing it.

CendiaGateway does three things:

1. **Scans** every AI prompt for 10 PII types (SSN, credit card, medical records, etc.)
2. **Enforces** policy — block, redact, or warn per department
3. **Signs** every interaction with cryptographic proof (SHA-256 + HMAC + Merkle tree)

The output is an AI Manifest — a signed compliance artifact you hand to an auditor that says "here is every AI interaction in our organization for the last 90 days, cryptographically verified."

It deploys in 30 minutes (one environment variable change). Self-hosted. Your keys. Open-source core.

Would a 20-minute technical walkthrough be useful? I can show you the PII scanner running on sample data from your industry.

[Your name]
Datacendia | datacendia.com/gateway

---

## Cold Outreach Email — Template B (Question-Led)

**Subject:** Quick question about your AI usage policy

**Body:**

Hi [First Name],

Genuine question — if a regulator asked you today "What AI tools are your employees using, and what company data have they shared with those tools?" — could you answer with evidence?

Most CISOs I talk to say no. Not because they're negligent, but because no tool existed to capture that data with cryptographic proof.

We built one. CendiaGateway is an open-source AI governance proxy. It sits between your employees and any AI model, and produces a signed audit trail of every interaction.

The differentiator: every interaction is signed with SHA-256 + HMAC and stored in a Merkle tree. The compliance artifact (we call it the AI Manifest) is cryptographically tamper-evident — not just a log file.

Self-hosted, sovereign deployment, 30-minute install.

Worth a 15-minute look?

[Your name]

---

## Cold Outreach Email — Template C (Peer Social Proof)

**Subject:** How [similar company type] is handling shadow AI

**Body:**

Hi [First Name],

I've been working with [sector] organizations on a specific problem: employees using ChatGPT and Claude with company data, and the CISO having zero visibility.

The pattern I keep seeing:
- IT blocks ChatGPT → employees use it on personal devices → you lose all visibility
- IT allows ChatGPT → no audit trail → compliance gap
- IT approves Copilot → Microsoft sees your data → sovereignty concern

We built a third option: a self-hosted reverse proxy that lets employees use any AI tool normally, but scans every prompt for PII, enforces org policy, and signs every interaction with cryptographic proof.

One [sector] org deployed it in under an hour and immediately found [X employees / Y PII instances] in the first week's data.

Would it be worth 15 minutes to see if this applies to [Company]?

[Your name]

---

## Objection Handling

### "We already use Microsoft Purview."
**Answer:** Purview is excellent for the Microsoft ecosystem. CendiaGateway covers AI traffic to any provider — OpenAI, Anthropic, Google, and local models via Ollama. More importantly, it runs on your infrastructure with your keys. Purview requires Azure. If data sovereignty matters to you, that's the difference.

### "We use Zscaler / Netskope."
**Answer:** Those are great network security tools. They do URL filtering and basic DLP. What they don't do is produce cryptographically signed evidence packets for AI interactions specifically. If an auditor asks for proof that your AI usage was governed, Zscaler gives you log files. CendiaGateway gives you a Merkle-tree-verified, HMAC-signed AI Manifest. Different evidentiary standard.

### "Why should I trust an open-source tool for this?"
**Answer:** Because you can read every line of code. The core is Apache 2.0 on GitHub. You deploy it on your infrastructure. We never see your data. That's actually more trustworthy than a SaaS vendor who sees all your AI traffic in their cloud.

### "We just ban AI."
**Answer:** I understand why. But 75% of knowledge workers use AI regardless of policy. Banning it pushes usage to personal devices outside your monitoring perimeter. The gateway gives you a middle path: allow AI, but with guardrails and evidence.

### "This sounds like employee surveillance."
**Answer:** It's the same legal framework as email DLP and web proxies — both of which you already run. The gateway monitors corporate API traffic on corporate infrastructure. It doesn't touch personal devices. The messaging to employees is "this protects you and the organization" — if an AI interaction ever becomes a compliance issue, the signed record proves exactly what happened.

### "What's the pricing?"
**Answer:** The core gateway is open-source and free (Apache 2.0). Enterprise features (SSO, SIEM integration, advanced DLP, managed support) start at $15/user/month. But for the pilot, you use the open-source version at zero cost.

---

## The Demo Script (20 minutes)

### Minute 0–3: The Question
"If a regulator asked you today for evidence of how your organization governs AI usage — what would you hand them?"

Pause. Let them answer.

### Minute 3–8: Live PII Scan
Open the PII Scanner tab in the gateway dashboard. Paste sample text with their industry's data:
- **Financial:** "Transfer $50,000 from account 12345678 to John Smith, SSN 123-45-6789"
- **Healthcare:** "Patient MRN#456789, DOB 03/15/1985, prescribed by Dr. Smith at john.smith@hospital.org"
- **Legal:** "Client passport UK987654321, contact at jane@lawfirm.com, phone +44 7911 123456"

Show the PII detection, the redacted output, and the policy enforcement.

### Minute 8–13: The Dashboard
Show the Overview tab: stats cards, provider breakdown, department breakdown, recent interactions.

"This is what your CISO dashboard looks like after one week of deployment. Every AI interaction, every department, every dollar spent."

### Minute 13–17: The AI Manifest
Click "Generate AI Manifest." Show the cryptographic integrity proof — Merkle root, HMAC signature, chain verification.

"This is the artifact you hand to an auditor. It's not a PDF report. It's cryptographically signed. If anyone tampers with a single interaction, the Merkle root changes and the signature fails. This is the same evidence standard used in blockchain — applied to your AI governance."

### Minute 17–20: The Ask
"We can have this running on your infrastructure in 30 minutes. Would you like to pilot it with one department for two weeks? Zero cost — it's open source."

---

## After the Meeting

If they say yes to a pilot:
1. Send them the Docker Compose file
2. Schedule a 30-minute deployment call
3. Check in after 1 week with their first AI Manifest
4. At 2 weeks, present findings and discuss enterprise license

If they say "let me think about it":
1. Send the gateway landing page link: datacendia.com/gateway
2. Follow up in 5 business days
3. Share the GitHub repo for their team to review

If they say no:
1. Ask what would need to change
2. Thank them and move on
3. Ask for a referral to a peer who might have this problem
