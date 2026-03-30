# Grupo Figer — Live Demo Walkthrough Script

**URL:** `/sandbox/figer` (or `/sandbox/grupo-figer`)
**Access Key:** `FIGER-26`
**Languages:** English · Spanish · Portuguese (toggle in top-right)
**Duration:** 20-30 minutes (full) · 10-15 minutes (highlights)

---

## Before the Meeting

1. Open `https://[your-domain]/sandbox/figer` in Chrome/Edge
2. Enter access key `FIGER-26`
3. Verify all 10 scenarios load — click through the scenario selector
4. Set language to **Portuguese** (the client's primary language)
5. Have English ready as fallback if needed

---

## Opening (2 minutes)

> "This sandbox demonstrates how Datacendia's multi-agent AI platform handles the real regulatory challenges Grupo Figer faces every day — across FIFA, CBF, CAS, LaLiga, HMRC, and Receita Federal. Every scenario uses your actual regulatory framework. Nothing is generic."

**Key talking point:** Datacendia built this demo specifically for Figer — 10 scenarios, trilingual, based on the 200+ governance scenarios we mapped to Figer's operations.

---

## Recommended Demo Order

### Highlight Path (10-15 min) — Pick 3-4 scenarios

For a shorter meeting, lead with the scenarios that hit closest to Figer's daily pain:

| Priority | Scenario | Why Lead With This |
|---|---|---|
| 1 | **S1: Dual Representation Transfer** | Every Figer agent deals with this daily — FIFA fee caps, dual consent, conflict disclosure |
| 2 | **S10: Lei Pelé vs FIFA RSTP** | Uniquely Brazilian, highest emotional resonance — every Brazilian agent has lived this |
| 3 | **S6: Multi-Jurisdiction Image Rights** | Shows global complexity across Brazil/Spain/UK/Saudi — Figer's exact footprint |
| 4 | **S8: Solidarity & Training Compensation** | The escolinha trail is a nightmare Figer knows intimately |

### Full Path (20-30 min) — All 10 in order

| # | Scenario | Theme | Time |
|---|---|---|---|
| S1 | Dual Representation Transfer | Core business — FIFA compliance | 3 min |
| S2 | Minor Player Protection (Art 19) | Youth safety — emotional weight | 2 min |
| S3 | CAS Arbitration Evidence | Dispute readiness | 2 min |
| S4 | TPO Detection | Brazilian investment structures | 2 min |
| S5 | Brazilian Tax & AML | Receita Federal + COAF | 3 min |
| S6 | Multi-Jurisdiction Image Rights | 4 tax regimes, CRS consistency | 3 min |
| S7 | FIFA Agent Licensing | 11 federations, insurance gap | 2 min |
| S8 | Solidarity & Training Compensation | Escolinha trail, dissolved clubs | 3 min |
| S9 | LaLiga Salary Cap | LCFP hard cap, contract structuring | 2 min |
| S10 | Lei Pelé vs FIFA RSTP | Jurisdictional conflict, negotiation | 3 min |

---

## Per-Scenario Talking Points

### S1: Dual Representation Transfer
**Setup:** "Figer represents both the player and the buying club in the same transfer. FIFA Agent Regulations 2023 cap the combined fee at 6% and require written consent from both parties."

**Watch for in the demo:**
- The compliance agent catches the dual representation conflict immediately
- The financial agent calculates the 6% cap in real-time
- A **dissent** is logged by the legal agent — arguing the conflict disclosure is insufficient
- The dissent is resolved with enhanced disclosure documentation
- Everything is sealed with a cryptographic receipt

**Key line:** "Without this, a club could challenge the fee 2 years later and Figer loses everything. With Datacendia, the evidence is immutable from day one."

---

### S2: Minor Player Protection (FIFA Article 19)
**Setup:** "A 16-year-old Brazilian talent is being scouted by a European club. FIFA Article 19 restricts international transfers of minors — violations carry multi-year transfer bans for clubs."

**Watch for:**
- Youth protection agent flags the minor's age immediately
- The 5 Article 19 exceptions are evaluated one by one
- Legal agent raises a dissent about the education plan
- The system won't proceed without parental consent documentation

**Key line:** "This is the scenario that ends careers and bans clubs. Datacendia makes it impossible to skip a step."

---

### S3: CAS Arbitration Evidence Preparation
**Setup:** "A €12M fee dispute goes to CAS. Figer needs to prove the mandate was valid, the fee was within FIFA caps, and the work was performed."

**Watch for:**
- The CAS arbitration agent structures the evidence bundle in CAS-admissible format
- Every document is cryptographically timestamped — proving it existed at the time of the transaction, not created for litigation
- RFC 3161 timestamps and ML-DSA-65 signatures

**Key line:** "CAS rejects reconstructed evidence. Datacendia seals evidence at the moment of the decision — before anyone knows there will be a dispute."

---

### S4: TPO Detection
**Setup:** "A transfer from a Brazilian Série A club reveals a hidden investment structure. FIFA banned third-party ownership in 2015 — but South American structures still surface."

**Watch for:**
- Integrity agent flags a suspicious ownership layer
- Financial agent traces the economic rights chain
- The system identifies a prohibited TPO arrangement
- Hard-stop — the transfer cannot proceed until the TPO is resolved

**Key line:** "This protects Figer from being associated with a TPO violation. The reputational damage alone would cost more than any single deal."

---

### S5: Brazilian Tax & AML (Receita Federal + COAF)
**Setup:** "Figer receives a large transfer fee from abroad. COAF requires suspicious transaction reporting. Receita Federal is auditing the image rights PJ. LGPD governs the data disclosure."

**Watch for:**
- Financial agent files COAF STR within 24 hours
- Legal agent raises a dissent about LGPD data minimisation
- The system calculates IRPJ/CSLL/PIS/COFINS/ISS simultaneously
- LGPD-compliant data disclosure prepared

**Key line:** "This is the scenario where most agents get caught — tax authorities in one country see what you declared in another. Datacendia ensures consistency."

---

### S6: Multi-Jurisdiction Image Rights ⭐
**Setup:** "A Figer client plays in Spain but has image rights in Brazil, the UK, and Saudi Arabia. Four different tax regimes, four different rules. The OECD's CRS automatically shares financial data between jurisdictions."

**Watch for:**
- Financial agent maps all 4 jurisdictions simultaneously
- Data protection agent raises a dissent about cross-border data flows
- FIFA compliance agent flags the agent disclosure obligation
- The **CRS consistency check** — ensuring all 4 structures tell the same story
- UK HMRC voluntary disclosure recommendation

**Key line:** "Most agents handle each country separately and hope nobody compares notes. CRS automatic exchange means someone WILL compare notes within 18 months. Datacendia catches the contradictions before the tax authorities do."

---

### S7: FIFA Agent Licensing
**Setup:** "Figer operates across 11 jurisdictions. Each requires a separate agent licence. The demo discovers that the Saudi insurance policy doesn't cover Middle East operations — a critical gap."

**Watch for:**
- The insurance gap detection — SAFF licence technically suspended
- Transfer agent's dissent: "We have 3 active Saudi deals, do we disclose now or finish first?"
- Integrity agent's response: "FIFA suspended 14 agents for this in 2025"
- Emergency insurance binder recommendation
- Automated 11-federation renewal calendar

**Key line:** "The question isn't IF a gap will be found — it's whether Figer finds it first or FIFA does."

---

### S8: Solidarity & Training Compensation ⭐
**Setup:** "An €18M transfer triggers solidarity payments to every club that trained the player since age 12. The player passed through 3 escolinhas — one dissolved, one merged. Who gets paid?"

**Watch for:**
- CBF BID records are fragmented — the system traces 6 clubs
- Financial agent calculates exact solidarity percentages by FIFA category
- Legal agent dissents: "The dissolved escolinha creates a legal vacuum"
- Escrow arrangement proposed to allow TMS registration to proceed
- Junta Comercial de São Paulo records search

**Key line:** "This is uniquely Brazilian. Most agents outside Brazil have never dealt with a dissolved escolinha. Figer has — and Datacendia turns that experience into a systematic process."

---

### S9: LaLiga Salary Cap (LCFP)
**Setup:** "Figer is placing a Brazilian international at a LaLiga club. The player wants €8M/year. The club has only €6M of salary cap headroom. LaLiga's LCFP is a hard cap — not a suggestion."

**Watch for:**
- Contract structure modelling: fixed salary + image rights + performance bonuses
- The 15% image rights exclusion — and LaLiga's aggressive scrutiny of it
- Legal agent dissents: "LaLiga challenged 12 image rights structures in 2025"
- CBF ITC timeline risk — 14 days to registration deadline
- Simultaneous departure/arrival cap modelling

**Key line:** "In LaLiga, a brilliant transfer negotiation means nothing if the numbers don't fit the LCFP. Datacendia models the entire cap picture before Figer makes the first call."

---

### S10: Lei Pelé vs FIFA RSTP ⭐
**Setup:** "A Figer client wants to leave his Brazilian club for the Bundesliga. Under Lei Pelé, he can terminate for R$25M. Under FIFA RSTP Article 17, the club demands €6M. Which law applies?"

**Watch for:**
- CAS jurisdictional analysis — the most litigated issue in South American football
- Transfer agent dissents: "The Bundesliga club won't sign if there's an open dispute"
- Financial agent models the negotiation space: €4.2M floor, €6M ceiling, €5M target
- The solidarity counterclaim lever against the Brazilian club
- Commercial resolution strategy instead of litigation

**Key line:** "This is the scenario that separates elite Brazilian agents from everyone else. Figer lives this every transfer window. Datacendia turns 18 months of CAS litigation into a 2-week negotiation."

---

## Closing (2 minutes)

> "What you just saw is 10 scenarios — but we mapped 200 for Figer specifically. Every one produces a cryptographic evidence receipt that is immutable, timestamped, and admissible at FIFA DRC and CAS. This isn't a compliance checkbox — it's Figer's competitive advantage."

**Leave-behind points:**
- **10 live scenarios** in Portuguese, Spanish, and English
- **200 mapped scenarios** covering Figer's complete regulatory surface
- **11 jurisdictions** covered: Brazil, Spain, UK, Germany, France, Italy, Saudi Arabia, UAE, Qatar, USA, Japan
- **Cryptographic evidence** sealed with RFC 3161 timestamps and ML-DSA-65 post-quantum signatures
- **Trilingual** — the only governance platform that works natively in Portuguese

---

## Objection Handling

| Objection | Response |
|---|---|
| "We already have lawyers for this" | "Lawyers reconstruct evidence after the dispute. Datacendia seals it before anyone knows there will be one. CAS rejects reconstructed evidence." |
| "This seems like a lot of process" | "It runs in the background. Your agents work normally — Datacendia captures and seals automatically. Zero workflow change." |
| "How is this different from a CRM?" | "A CRM stores what you type in. Datacendia runs 4-6 AI agents that debate, dissent, flag risks, and produce cryptographic evidence. It thinks, not just stores." |
| "What about data security / LGPD?" | "Sovereign deployment — your data never leaves your infrastructure. LGPD-compliant by architecture, not by policy." |
| "We operate in 11 countries" | "So does the platform. Every scenario you just saw handles multi-jurisdiction compliance natively — that's why we built the trilingual demo." |

---

## Technical Requirements

- Modern browser (Chrome, Edge, Firefox)
- Internet connection (or sovereign deployment for production)
- No installation required — pure web application
- Access key: `FIGER-26`
