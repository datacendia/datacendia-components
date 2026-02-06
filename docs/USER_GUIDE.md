# DATACENDIA USER GUIDE
**Getting Started with Decision Verification Infrastructure**

---

## WHAT IS DATACENDIA?

Datacendia helps you verify and document institutional decisions by:
- Analyzing decisions through multiple specialized perspectives
- Recording every decision with full audit trails
- Connecting to your existing business tools
- Ensuring compliance with regulations

**Think of it as:** Decision verification infrastructure that produces regulator-grade evidence for every determination.

---

## GETTING STARTED

### 1. Login
1. Go to: http://localhost:5173 (or your Datacendia URL)
2. Enter your email and password
3. Click "Sign In"

**Credentials:** Obtain from your system administrator.

### 2. Your First Analysis Session

**What is an analysis session?** It's when multiple analysis components evaluate a question and produce a verification record.

**Steps:**
1. Click "The Council" in the sidebar
2. Click "New Session"
3. Enter your question (e.g., "Evaluate the risk profile of hiring 5 new engineers")
4. Select which analysis components to include (Financial, Operations, Risk, etc.)
5. Choose a mode:
   - **Standard** - Balanced analysis
   - **War Room** - Expedited analysis
   - **Deep Dive** - Comprehensive analysis
6. Click "Start Analysis"
7. Review the analysis as it progresses
8. Review the final analysis output

*All system outputs are non-binding analytical artifacts. Final determinations are made by designated human decision-makers in accordance with institutional governance.*

---

## KEY FEATURES

### The Analysis Panel
**What it does:** Multiple analysis components evaluate your question from different perspectives

**Available Analysis Components:**
- **Financial Analysis** - Financial impact assessment
- **Operations Analysis** - Operational considerations
- **Risk Analysis** - Risk assessment
- **Security Analysis** - Security considerations
- **Marketing Analysis** - Market impact
- **Legal Analysis** - Compliance review
- **Ethics Analysis** - Ethical considerations

**How to use:**
1. Go to "The Council" page
2. Click "New Session"
3. Select 3-7 components (more = longer but more thorough)
4. Enter your question
5. Review analysis outputs and summary

### Decisions
**What it does:** Records important decisions with full audit trails

**How to use:**
1. Go to "Decisions" page
2. Click "New Decision"
3. Fill in:
   - Decision title
   - Context/background
   - Options considered
   - Final choice
4. Add approvers
5. Sign the decision
6. Export for auditors/regulators

### Enterprise Connectors
**What it does:** Connects Datacendia to your existing tools (Salesforce, Slack, Jira, etc.)

**How to use:**
1. Go to "Integrations" page
2. Click on a connector (e.g., "Salesforce")
3. Click "Connect"
4. Authorize Datacendia to access your account
5. Data will sync automatically

**Available Connectors:**
- Salesforce (CRM)
- Slack (messaging)
- Jira (project management)
- GitHub (code repositories)
- Microsoft Teams
- ServiceNow (IT service management)
- HubSpot (CRM)
- SAP (ERP)
- Oracle (ERP)
- Workday (HR)

### OmniTranslate
**What it does:** Translates decisions and deliberations into 100+ languages

**How to use:**
1. Go to any decision or deliberation
2. Click the language dropdown (top right)
3. Select your language
4. Content translates instantly

**Supported Languages:** 100+ including English, Spanish, French, German, Chinese, Japanese, Arabic, and more

### Collapse Mode
**What it does:** Stress-tests governance policies with 18 adversarial analysis components

**How to use:**
1. Go to "Collapse" page
2. Upload or enter a policy
3. Click "Run Collapse Analysis"
4. Review failure scenarios
5. Implement recommended safeguards

---

## COMMON TASKS

### Task 1: Get Analysis on a Decision
1. Click "The Council"
2. Click "New Session"
3. Enter question: "Evaluate [your decision scenario]"
4. Select components: Financial, Operations, Risk
5. Click "Start"
6. Wait 30-60 seconds
7. Review analysis output

### Task 2: Record an Important Decision
1. Click "Decisions"
2. Click "New Decision"
3. Fill in all fields
4. Add approvers
5. Click "Create"
6. Share decision ID with stakeholders

### Task 3: Connect Salesforce
1. Click "Integrations"
2. Find "Salesforce"
3. Click "Connect"
4. Login to Salesforce
5. Click "Allow"
6. Data syncs automatically

### Task 4: Export for Auditors
1. Go to a decision
2. Click "Export"
3. Choose format: PDF or JSON
4. Download file
5. Send to auditors

### Task 5: Translate Content
1. Open any decision/deliberation
2. Click language dropdown (🌐)
3. Select language
4. Content translates instantly

---

## TIPS & BEST PRACTICES

### For Best Analysis Results:
- ✅ Ask specific questions
- ✅ Provide context and constraints
- ✅ Include 3-5 analysis components (not too many)
- ✅ Use "War Room" mode for expedited analysis
- ✅ Use "Deep Dive" for comprehensive analysis

### For Compliance:
- ✅ Always record major decisions
- ✅ Get multiple approvers
- ✅ Document dissenting opinions
- ✅ Export decisions quarterly for auditors
- ✅ Keep decision records for 7 years

### For Performance:
- ✅ Use filters when viewing lists
- ✅ Limit deliberations to 5 agents max
- ✅ Archive old decisions
- ✅ Enable caching (ask admin)

---

## TROUBLESHOOTING

### "Unauthorized" Error
**Problem:** Your session expired  
**Fix:** Logout and login again

### Analysis Takes Too Long
**Problem:** Too many components or complex question  
**Fix:** Use fewer components (3-4) or simplify question

### Can't Connect to Salesforce
**Problem:** OAuth authorization failed  
**Fix:** 
1. Check Salesforce credentials
2. Ensure you're a Salesforce admin
3. Try disconnecting and reconnecting

### Page Won't Load
**Problem:** Backend server might be down  
**Fix:** Contact your system administrator

---

## KEYBOARD SHORTCUTS

| Shortcut | Action |
|----------|--------|
| `Ctrl + K` | Quick search |
| `Ctrl + N` | New analysis session |
| `Ctrl + D` | New decision |
| `Esc` | Close modal |

---

## SUPPORT

**Documentation:** http://localhost:3001/api/docs  
**Health Check:** http://localhost:3001/health  
**System Admin:** Contact your IT department

---

*For technical API details, see API_DOCUMENTATION.md*
