# Legal Vertical Client Demo Showcase

## Pre-Demo Checklist

### 1. Start the Backend
```powershell
cd c:\Users\Stu\Documents\datacendia-components\datacendia-components\backend
npm run dev
```
**Backend runs on port 3000** (not 3001 - that's Grafana)

### 2. Start the Frontend
```powershell
cd c:\Users\Stu\Documents\datacendia-components\datacendia-components
npm run dev
```
Frontend typically runs on port 5173 or 3000

### 3. Verify Services
Open browser: `http://localhost:5173` (or your frontend port)
Login as: `stuart@datacendia.com` / `DatacendiaOwner2024!`

---

## Demo Script: "Trade Secret Misappropriation Case Analysis"

### Scene Setting (30 seconds)
> "Today I'll show you how Datacendia's Legal vertical transforms how law firms handle complex litigation. We're going to analyze a trade secret misappropriation case - one of the most document-intensive areas of law."

---

## Act 1: The Council Deliberation (5 minutes)

### Step 1: Navigate to The Council
1. Click **The Council** in the sidebar
2. Select **Legal** vertical from the dropdown

### Step 2: Submit the Legal Question
Enter this prompt:
```
Our client, a semiconductor company, suspects a former senior engineer took proprietary chip designs to a competitor. The engineer signed an NDA and non-compete. We need to:

1. Assess the strength of our trade secret misappropriation claim
2. Identify relevant case precedents
3. Determine if the non-compete is enforceable in California
4. Recommend immediate protective measures

What's our legal strategy?
```

### Step 3: Watch the Council Deliberate
**Point out to client:**
- Multiple AI agents analyzing simultaneously
- Each agent has a specialized legal role
- Real-time streaming of analysis
- Confidence scores for each recommendation

### Step 4: Highlight the Legal Tools in Action
The Council will automatically:
- Search case law for trade secret precedents
- Check California non-compete enforceability
- Review relevant CFR regulations
- Cite specific cases and statutes

---

## Act 2: Legal Research Deep Dive (3 minutes)

### Step 1: Show the Legal Research API
Open a new browser tab to demonstrate the API:

**Status Check:**
```
http://localhost:3000/api/v1/legal-research/status
```

**Show the client:**
- 5 integrated legal data sources
- Real-time API availability
- 45,591 offline cases available

### Step 2: Live Regulation Search
Demonstrate eCFR search (works without API key):
```
POST http://localhost:3000/api/v1/legal-research/regulations
Body: {"query": "trade secret protection", "limit": 5}
```

### Step 3: SEC Filing Search
Show corporate intelligence capability:
```
POST http://localhost:3000/api/v1/legal-research/sec
Body: {"cik": "320193", "form": "10-K", "limit": 3}
```
> "We can pull any public company's filings to understand their IP disclosures, material contracts, and risk factors."

---

## Act 3: Decision Packet & Audit Trail (2 minutes)

### Step 1: Show the Decision Packet
After deliberation completes:
1. Click **Export Decision Packet**
2. Show the cryptographically signed output

**Point out:**
- Merkle tree integrity verification
- Every agent contribution tracked
- All tool calls logged with timestamps
- Citations with source links

### Step 2: Demonstrate Compliance
> "Every decision is audit-ready. If a regulator or opposing counsel asks 'how did you reach this conclusion?', you have a complete, tamper-proof record."

---

## Act 4: Offline Capability (1 minute)

### Demonstrate Air-Gap Readiness
> "For sensitive matters - M&A, government contracts, national security - we can run completely offline with:"

- **45,591 case law decisions** (1.9 GB)
- **47 CFR titles** (527 MB)
- **Supreme Court landmark cases** database
- **No external API calls required**

---

## Key Talking Points

### For Law Firm Partners
- "Reduce associate research time by 70%"
- "Every recommendation backed by cited precedent"
- "Malpractice protection through audit trails"

### For General Counsel
- "Consistent legal analysis across your organization"
- "Institutional knowledge capture"
- "Regulatory compliance built-in"

### For Litigation Teams
- "Real-time case law updates"
- "Multi-jurisdictional analysis"
- "Opposition research on SEC filings"

---

## Handling Objections

### "Is this replacing lawyers?"
> "No - it's augmenting them. The Council provides research and analysis, but attorneys make the final decisions. Think of it as having a team of paralegals who never sleep and have read every case."

### "What about confidentiality?"
> "Datacendia can run entirely on-premise or air-gapped. Your data never leaves your infrastructure. We're SOC 2 Type II compliant."

### "How current is the case law?"
> "We integrate with live APIs for real-time updates, plus maintain offline databases that are refreshed regularly. You can also ingest your firm's own case database."

---

## Demo URLs Quick Reference

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |
| Legal Research Status | http://localhost:3000/api/v1/legal-research/status |
| API Docs (Swagger) | http://localhost:3000/api/docs |

---

## Post-Demo Follow-Up

1. **Send the Decision Packet** - Export and email the actual analysis
2. **Offer a Pilot** - "Let's run this on one of your active matters"
3. **Schedule Technical Deep-Dive** - For their IT/Security team
4. **Provide Pricing** - Based on user count and deployment model

---

## Emergency Troubleshooting

### Backend not responding?
```powershell
# Check if running
netstat -ano | findstr :3000

# Restart
cd backend
npm run dev
```

### Frontend not loading?
```powershell
cd c:\Users\Stu\Documents\datacendia-components\datacendia-components
npm run dev
```

### Database connection issues?
```powershell
# Check Docker containers
docker ps
```

---

*Demo created: January 2026*
*Version: Enterprise Platinum*
