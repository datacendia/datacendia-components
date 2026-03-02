# Show HN Post — Draft

## Title

**Show HN: Defensible AI – Open-source multi-agent deliberation where every AI decision is court-admissible**

## Body

Hi HN,

I built Datacendia — an open-source AI decision intelligence platform where 15 AI agents argue with each other before giving you an answer.

The key difference from ChatGPT/Claude/Copilot: **every decision produces a cryptographically signed evidence packet** — Merkle trees, post-quantum signatures, timestamped audit trails. If a regulator asks "how did your AI make this decision?" in 3 years, you hand them a signed PDF. Your competitors using vanilla LLMs will have nothing.

**Why I built this:**

The EU AI Act is coming. DORA is live. Every boardroom is asking "can we prove our AI decisions were sound?" I couldn't find a platform that combined multi-agent deliberation with cryptographic proof, so I built one.

**What it does:**

- **The Council** — 15 C-Suite AI agents (CFO, CLO, CISO, CTO, etc.) with distinct mandates deliberate on your question. They argue, dissent, cross-examine, and challenge each other. The devil's advocate is built in.
- **Immutable Audit Trail** — Every deliberation is recorded in a Merkle tree. Signed with customer-owned keys. Court-admissible. Exportable as "Regulator's Receipt" PDFs.
- **DCII Framework** — Decision Crisis Immunization Infrastructure. 9 primitives that prove decisions were made correctly when challenged years later.
- **30 Industry Verticals** — Legal (49 council modes), Healthcare (HIPAA), Defense (JOPP), Financial (Basel III), Sports (FIFA/UEFA governance), and more.
- **Sovereign-First** — Runs on Ollama locally. Air-gap deployable. No cloud dependency required. Your data never leaves your infrastructure.

**Stack:** TypeScript, React 18, Express, PostgreSQL, Redis, Neo4j, Ollama, Docker. NVIDIA Inception member.

**Try it:**

- GitHub (open-source core): https://github.com/datacendia/datacendia-core
- DDGI Framework (vendor-neutral governance spec): https://github.com/datacendia/decision-governance-infrastructure
- Website: https://datacendia.com

```
git clone https://github.com/datacendia/datacendia-core.git
cd datacendia-core
docker compose -f docker-compose.demo.yml up -d
# Open http://localhost:5173
```

Community Edition is free forever (Apache 2.0). Paid tiers start at $499/month for the full 15-agent council with evidence infrastructure.

I'm a solo founder building this. Would love feedback on the architecture, the "Defensible AI" positioning, and whether the DCII framework resonates.

---

## Posting Notes

- **Best time to post:** Tuesday-Thursday, 8-9am EST (1-2pm UTC)
- **Subreddit crosspost:** r/artificial, r/MachineLearning, r/SideProject
- **LinkedIn version:** Shorter, focus on the EU AI Act angle and "Defensible AI" category
- **Twitter/X version:** Thread format, lead with the provocation: "ChatGPT gives you an answer. Datacendia gives you proof."
