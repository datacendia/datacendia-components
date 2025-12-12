# Datacendia Demo Scripts

## Overview

These scripts guide sales and demo teams through compelling product demonstrations. Each script is designed for a specific audience and time constraint.

---

## Demo 1: Executive Overview (10 minutes)

**Audience**: C-Suite, Board Members, Senior Leadership  
**Goal**: Establish category, demonstrate strategic value, spark curiosity

### Opening Hook (1 min)

> "Let me ask you a question: If a regulator walked in today and asked 'Show me exactly who approved your largest acquisition and what information they had at the time'—how long would it take you to answer?"
>
> "Most enterprises say 'days or weeks.' With Datacendia, it's 30 seconds."

### The Problem (2 min)

> "You're facing an impossible choice:
> 1. **Adopt AI** to stay competitive—but send your data to OpenAI, Microsoft, or Google
> 2. **Protect your data** by avoiding AI—but fall behind competitors who don't care about risk
>
> We believe there's a third path: **Sovereign Intelligence**."

### Live Demo: The Council (4 min)

1. **Show the Council Interface**
   > "This is The Council—your AI leadership team. Not one model, but eight specialized executives who debate your questions."

2. **Submit a Strategic Question**
   > "Let's ask: 'Should we open a European headquarters in 2025?'"

3. **Watch Agents Respond**
   > "Notice how the CFO focuses on costs, the CLO on GDPR implications, and the COO on operational complexity. They actually challenge each other."

4. **Show the Synthesis**
   > "The Chief synthesizes all perspectives into a recommendation with a confidence score. No black box—you see exactly how they reached this conclusion."

### The Sovereignty Difference (2 min)

> "Everything you just saw ran entirely on your infrastructure. Zero data left this building. Zero API calls to cloud providers. You own every byte."
>
> "And if you ever need to prove what happened—for regulators, auditors, or litigation—every decision has a court-admissible evidence chain."

### Close (1 min)

> "We're defining a new category: Sovereign Enterprise Intelligence. Would you like to see how this applies to [their specific industry/challenge]?"

---

## Demo 2: Technical Deep Dive (30 minutes)

**Audience**: CTO, CIO, IT Security, Enterprise Architects  
**Goal**: Address technical objections, prove enterprise-readiness

### Architecture Overview (5 min)

1. **Show the Deployment Model**
   > "Datacendia runs entirely on-premises. Here's how it integrates with your infrastructure..."
   - Docker/Kubernetes deployment
   - Database options (PostgreSQL, customer can bring their own)
   - Ollama for local inference

2. **Model Zoo**
   > "We use a 'Sovereign Model Zoo'—multiple specialized models running locally via Ollama."
   - Show `modelZoo.ts` configuration
   - Explain model selection per agent type
   - Demonstrate fallback chains

### Security & Compliance (8 min)

1. **Data Flow Diagram**
   > "Data never leaves your perimeter. Let me trace a query from submission to response..."

2. **Authentication**
   > "Enterprise SSO support: SAML 2.0, OIDC, Active Directory, Certificate-based auth."

3. **Audit Trail**
   - Show CendiaWitness
   - Demonstrate hash chain
   - Export audit log

4. **Compliance Features**
   > "SOC 2 Type II in progress. Built for HIPAA, GDPR, FedRAMP from day one."

### Live Demo: CendiaChronos (10 min)

1. **Navigate the Timeline**
   > "This is our organizational time machine. Let's go back to January..."
   - Scrub timeline
   - Show state snapshot at past date
   - Demonstrate event filtering

2. **Trace a Decision**
   > "Here's a decision made 6 months ago. Let's see exactly what led to it."
   - Open in Witness view
   - Show approvers
   - Show linked assets

3. **Replay Mode**
   > "Now let's replay this scenario with different assumptions..."
   - Enter replay mode
   - Modify variables
   - Show Monte Carlo projections

### Integration Demo (5 min)

1. **ERP Connectors**
   > "We connect to your existing systems—SAP, Oracle, NetSuite—without moving data."

2. **API Demonstration**
   > "Everything is API-first. Let me show you the council API..."
   - Curl request
   - Response structure
   - Webhook options

### Q&A Prep (2 min)

> "Before we open for questions—what's your current approach to AI governance? We find that's often the starting point for deeper discussions."

---

## Demo 3: Compliance/Legal Focus (20 minutes)

**Audience**: CLO, GC, Compliance Officers, Risk Managers  
**Goal**: Demonstrate audit trail, address liability concerns

### The Compliance Challenge (3 min)

> "When regulators ask 'prove your AI didn't discriminate' or 'show how this decision was made'—can you answer?"
>
> "Most AI systems are black boxes. Datacendia is a glass box with a notary."

### CendiaWitness Deep Dive (10 min)

1. **Evidence Chain Demo**
   - Create a decision
   - Show immediate hash creation
   - Demonstrate immutability

2. **Audit Export**
   > "One click to export a court-ready evidence package."
   - Show export format
   - Explain what's included

3. **Zero-Knowledge Audit**
   > "For sensitive information, we can prove facts without revealing underlying data."

4. **Regulator Mode**
   > "Give auditors read-only access to specific timeframes without exposing your entire history."

### Dissent System (5 min)

> "What happens when an employee disagrees with an AI recommendation? CendiaDissent provides a formal channel with retaliation protection."

1. **File a Dissent**
2. **Show tracking**
3. **Demonstrate outcome verification**

### Risk Assessment (2 min)

> "We publish what we call 'Honesty Matrices'—transparent disclosures of where the platform has limitations. This is unprecedented in the industry."

- Show Honesty Matrices page
- Highlight "What Breaks at 3 AM"

---

## Demo 4: Industry-Specific (Healthcare) (15 minutes)

**Audience**: Healthcare executives, CMIO, Compliance  
**Goal**: Show industry fit, specialized agents

### Healthcare Context (2 min)

> "PHI can never leave your walls. HIPAA isn't optional. Yet you need AI to remain competitive in care coordination, revenue cycle, and clinical decisions."

### Specialized Agents (5 min)

1. **CMIO Agent**
   > "Trained on HL7/FHIR standards, clinical workflow optimization."

2. **Patient Safety Officer**
   > "Uses RCA methodologies, references IHI/AHRQ frameworks."

3. **Healthcare Compliance Officer**
   > "Cites 45 CFR, 42 CFR sections, OIG guidance."

### Use Case: Capacity Planning (6 min)

> "Let's ask The Council: 'How should we handle the projected 15% increase in ER volume next quarter?'"

1. Submit query in War Room mode
2. Watch specialized agents respond
3. Show synthesis with clinical and compliance perspectives

### PHI Protection (2 min)

> "Notice the query used aggregate data. But even with specific patient references, that data never leaves your network."

---

## Demo 5: Quick Teaser (3 minutes)

**Audience**: Conference booth, casual conversation  
**Goal**: Generate interest, book follow-up

### The Hook (30 sec)

> "Imagine having a board meeting in your pocket—eight AI executives who debate any question, run entirely on your hardware, and leave no data trail."

### The Demo (2 min)

1. Pull up Council on tablet/laptop
2. Ask simple question: "What's our biggest risk this quarter?"
3. Show agents responding in real-time
4. Point out confidence score

### The Close (30 sec)

> "Everything you just saw runs 100% locally. No cloud. No data leakage. That's Sovereign Enterprise Intelligence. Can I get your card for a full demo?"

---

## Objection Handling

### "Why not just use ChatGPT/Copilot?"

> "Those require sending your data to external servers. Every query is logged by Microsoft or OpenAI. For many enterprises, that's a non-starter for strategic decisions."

### "We're building this internally."

> "How far along are you? Most internal projects we've seen take 18+ months and require ongoing ML team investment. We can be deployed in weeks."

### "Is the AI accurate?"

> "We never claim 100% accuracy—that would be dishonest. What we provide is transparency. Every recommendation shows its reasoning, confidence level, and the data it used. Humans always make final decisions."

### "What about hallucinations?"

> "Multi-agent deliberation naturally reduces hallucinations. When the CFO 'hallucinates' a number, the CLO or Risk agent will challenge it. Cross-examination is built into the process."

### "What models do you use?"

> "We use open-source models from Llama, Qwen, and Mistral families running via Ollama. You can also bring your own fine-tuned models. No vendor lock-in."

---

## Environment Checklist

Before any demo:

- [ ] Ollama running with required models loaded
- [ ] Fresh demo organization with realistic sample data
- [ ] Council agents all showing "online"
- [ ] Chronos timeline populated with demo events
- [ ] Network isolated (for sovereignty demonstration)
- [ ] Screen recording ready (for post-demo follow-up)

---

*Last updated: Document generated automatically*
