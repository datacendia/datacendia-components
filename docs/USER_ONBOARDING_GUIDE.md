# DATACENDIA PLATFORM - USER ONBOARDING GUIDE
**Welcome to Datacendia!** This guide will help you get started with the Sovereign Intelligence Platform.

---

## GETTING STARTED (5 Minutes)

### Step 1: Log In
1. Navigate to `https://app.datacendia.com` (or your deployment URL)
2. Enter your credentials
3. Click "Sign In"

**First-time users:** You'll see a welcome screen with a quick tour option.

### Step 2: Understand the Layout
The platform has 4 main sections:

| Section | What It Does | Icon |
|---------|--------------|------|
| **Dashboard** | Overview of recent decisions, alerts, and metrics | 📊 |
| **The Council** | Multi-agent deliberation for decisions | 🏛️ |
| **Compliance** | Regulatory monitoring and evidence generation | ⚖️ |
| **Enterprise** | Advanced features (governance, evidence vault, etc.) | 🏢 |

### Step 3: Ask the AI Assistant
Click the **sparkle icon (✨)** in the bottom-right corner to open the Platform AI Assistant.

Try asking:
- "How do I make a decision?"
- "Show me how to check compliance"
- "I need to generate a regulator's receipt"

The AI will provide step-by-step instructions with exact buttons to click.

---

## YOUR FIRST DECISION (10 Minutes)

### Scenario: Should we hire a new VP of Engineering?

**Step 1: Navigate to The Council**
- Click **"Council"** in the sidebar
- You'll see the multi-agent deliberation interface

**Step 2: Enter Your Question**
- In the large text box at the top, type:
  ```
  Should we hire Sarah Chen as VP of Engineering? She has 15 years experience, 
  wants $250K salary, and would start in 30 days.
  ```

**Step 3: Select Agents**
- Click on these agent cards to select them:
  - **CEO Advisor** (strategic perspective)
  - **CFO Advisor** (financial analysis)
  - **Legal Counsel** (employment law)
  - **Risk Analyzer** (risk assessment)
  - **HR Specialist** (hiring expertise)

**Step 4: Start Deliberation**
- Click the **"Ask The Council"** button
- Agents will deliberate for 2-5 minutes
- You'll see responses stream in real-time

**Step 5: Review the Recommendation**
- Read the final synthesis at the top
- Review individual agent perspectives
- Check the confidence score
- Note any dissenting opinions

**Step 6: Make Your Decision**
- Click **"Approve"**, **"Reject"**, or **"Request Changes"**
- Add your notes
- The decision is cryptographically signed and stored

**Result:** You now have an immutable audit trail of:
- Who was consulted (which agents)
- What they said (full reasoning)
- Why you decided (your notes)
- When it happened (timestamp)
- Cryptographic proof (signature)

---

## COMMON TASKS

### Check Compliance Status
1. Navigate to **Compliance → Continuous Monitor**
2. See 10 frameworks monitored in real-time
3. Click any framework (e.g., "EU AI Act") to see control status
4. Green = compliant, Yellow = warning, Red = non-compliant
5. Click **refresh icon** to run a fresh scan

### Generate a Regulator's Receipt
1. Navigate to **Compliance → Regulator's Receipt**
2. Select a decision from your history
3. Click **"Generate Receipt"**
4. PDF generates with:
   - Complete decision record
   - Merkle tree proof
   - Cryptographic signatures
   - Evidence chain
5. Click **"Download PDF"** for forensic-grade, independently verifiable evidence

### Create Marketing Content
1. Navigate to **Admin → Marketing Studio**
2. Choose tab: Video Scripts, Image Prompts, Pitch Decks, or Marketing Copy
3. Fill in topic, audience, style
4. Click **"Generate"**
5. AI creates content in 5-15 seconds
6. Copy to clipboard or download

### Configure Environment
1. Navigate to **Admin → Environment Config**
2. See all .env variables organized by category
3. Edit any value (Database URLs, AI API keys, feature flags)
4. Click **"Save Configuration"**
5. Restart server to apply changes

---

## ADVANCED FEATURES

### Post-Quantum Cryptography
**Path:** Enterprise → Post-Quantum KMS

Generate quantum-resistant signatures:
1. Select algorithm (Dilithium2 recommended)
2. Choose key strength (Standard, High, Paranoid)
3. Click **"Generate Key Pair"**
4. Enter data to sign
5. Click **"Sign Data"**
6. Get quantum-resistant signature

### Carbon-Aware Scheduling
**Path:** Enterprise → Carbon-Aware Scheduler

Schedule AI workloads during low-carbon windows:
1. Enter workload name
2. Set duration and energy estimate
3. Choose priority (Critical, High, Normal, Low, Deferrable)
4. Select preferred region
5. Click **"Schedule Workload"**
6. System optimizes for lowest carbon footprint

### Cross-Jurisdiction Compliance
**Path:** Compliance → Cross-Jurisdiction

Assess cross-border data transfers:
1. Select data type (Personal Data, Health Data, Financial Data, etc.)
2. Choose source jurisdiction (e.g., US Federal)
3. Choose target jurisdiction (e.g., EU)
4. Click **"Assess Transfer"**
5. See compliance status, conflicts, and required controls

---

## KEYBOARD SHORTCUTS

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Open command palette |
| `Ctrl+/` | Open AI Assistant |
| `Ctrl+N` | New deliberation |
| `Esc` | Close modals |

---

## TIPS & BEST PRACTICES

### For Better Deliberations:
- **Be specific** — More context = better agent responses
- **Select relevant agents** — Don't use all 62 agents for every decision
- **Use council modes** — Pre-configured agent teams for common scenarios
- **Review dissents** — Dissenting opinions often reveal important risks

### For Compliance:
- **Run scans regularly** — Weekly scans catch drift early
- **Address warnings immediately** — Yellow warnings become red violations
- **Generate receipts proactively** — Don't wait for auditor requests
- **Document everything** — The platform does this automatically

### For Performance:
- **Use quick mode** for simple questions (1-2 agents, faster)
- **Use deliberation mode** for complex decisions (full Council, thorough)
- **Enable Redis caching** for faster API responses
- **Apply database indexes** for faster queries

---

## TROUBLESHOOTING

### "Network Error" or "API Unreachable"
- Check that backend is running: `cd backend && npm run dev`
- Verify API_URL in .env: `VITE_API_URL=http://localhost:3001/api/v1`
- Check browser console for errors

### Deliberation Hangs or Takes Too Long
- Check Ollama is running: `ollama list`
- Verify models are downloaded: `ollama pull qwen2.5:7b`
- Check backend logs for errors

### Agents Give Generic Responses
- Ensure you're using the right council mode
- Provide more context in your question
- Select agents with relevant expertise

### Can't See Certain Features
- Check your user role (some features are admin-only)
- Verify feature flags in .env: `ENABLE_OLLAMA=true`
- Check service tier (some features are Enterprise Platinum)

---

## GETTING HELP

### Built-In AI Assistant
Click the **sparkle icon (✨)** and ask any question. The AI will guide you step-by-step.

### Documentation
- **This guide:** User onboarding
- **API docs:** `/docs/API_DOCUMENTATION.md`
- **Admin guide:** `/docs/ADMIN_GUIDE.md`

### Support
- **Email:** support@datacendia.com
- **Security issues:** security@datacendia.com

---

## NEXT STEPS

After completing this guide, try:

1. **Make 3 decisions** using The Council
2. **Run a compliance scan** on one framework
3. **Generate a regulator's receipt** for one decision
4. **Create marketing content** in Marketing Studio
5. **Explore your industry vertical** (Healthcare, Finance, Legal, etc.)

**Welcome to Datacendia. Make better decisions.**
