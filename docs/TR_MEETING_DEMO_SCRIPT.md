# Thomson Reuters Ventures Demo Script
## Decision DNA™ + Deterministic Replay

**Duration:** 10-15 minutes  
**Audience:** Karen (TR Ventures)  
**Goal:** Demonstrate verifiable, reproducible legal AI infrastructure

---

## SETUP (Before Meeting)

1. **Backend running:** `npm run dev` in `/backend`
2. **Have a deliberation ready** (or create one live)
3. **Terminal open** for API calls
4. **Browser open** to Datacendia UI

---

## PART 1: THE HOOK (2 minutes)

### Opening Statement
> "Thanks for taking this meeting. I know TR dominates cloud legal AI with CoCounsel and Casetext. I'm not here to compete with that.
>
> I'm here because there's a class of legal customers you structurally cannot serve: government legal offices, defense contractors, cross-border privilege work. They can't use cloud AI. Period.
>
> Datacendia was built for that deployment class. Let me show you what makes us different."

---

## PART 2: DECISION DNA™ DEMO (5 minutes)

### What You're Showing
A single AI-assisted legal analysis becomes a **cryptographically verifiable evidence artifact**.

### Live Demo Steps

**Step 1: Show a completed deliberation**
```
Navigate to: /cortex/council
Select any completed deliberation
```

**Step 2: Generate Decision DNA**
```bash
# API call to generate DNA
curl -X POST http://localhost:3001/api/v1/sovereign-arch/dna/generate/{deliberationId} \
  -H "Content-Type: application/json" \
  -d '{"format": "full", "outputFormat": "bundle", "includeRawData": true}'
```

**Step 3: Show the output**
Point out:
- **Merkle root** - cryptographic integrity
- **Hash chain** - tamper-evident audit trail
- **Agent contributions** - who said what
- **Dissent records** - formal disagreements
- **Signatures** - who approved

### Key Line to Say
> "This isn't a log file. This is an **evidence artifact designed to meet the evidentiary standards enterprise legal teams expect**. 
> If opposing counsel asks 'prove your AI didn't hallucinate this,' we hand them this bundle.
> They can verify it themselves. No trust required."

**Step 4: Verify integrity**
```bash
curl -X POST http://localhost:3001/api/v1/sovereign-arch/dna/verify \
  -H "Content-Type: application/json" \
  -d @decision_dna.json
```

Show output:
```json
{
  "valid": true,
  "errors": []
}
```

> "The verification is independent. You don't need our servers. You don't need our credentials. The math proves it."

---

## PART 3: DETERMINISTIC REPLAY (3 minutes)

### What You're Showing
Same inputs → same outputs → **forever**.

### Live Demo Steps

**Step 1: Show state capture**
```bash
# Start capture
curl -X POST http://localhost:3001/api/v1/sovereign-arch/replay/capture/start \
  -H "Content-Type: application/json" \
  -d '{"organizationId": "demo", "deliberationId": "test-123"}'

# Returns: { "stateId": "state-abc123" }
```

**Step 2: Explain what's captured**
> "We capture everything:
> - Random seeds (so randomness is reproducible)
> - Model parameters (temperature, top-p, etc.)
> - Input hashes
> - Output hashes
> - Timestamp pinning
>
> Years from now, if someone challenges this decision, we can replay it bit-for-bit."

**Step 3: Show verification**
```bash
curl -X GET http://localhost:3001/api/v1/sovereign-arch/replay/{stateId}/verify
```

### Key Line to Say
> "If challenged, we can replay the exact decision bit-for-bit. 
> That's the difference between **software** and **evidence**."

---

## PART 4: AIR-GAP CAPABILITY (2 minutes)

### What You're Showing
This runs where cloud AI cannot.

### Talking Points (No Demo Needed)

> "Everything I just showed you runs on-premise. Air-gapped. No internet required.
>
> We have:
> - **Data Diode** - one-way ingestion, data flows in but never out
> - **TPM Attestation** - hardware-signed decisions
> - **Portable Instance** - bootable USB deployment
>
> Your legal AI cannot enter a SCIF. Ours was built for it."

---

## PART 5: THE CLOSE (2 minutes)

### Positioning Statement
> "We're not trying to replace CoCounsel. We're trying to make it **extensible** into environments that cloud infrastructure structurally cannot reach.
>
> Government legal offices. Defense contractors. Cross-border privilege work. Classified investigations.
>
> These are some of the highest-value legal customers in the world. And right now, they have no AI option.
>
> We're the sovereign sidecar."

### The Ask
> "If TR is thinking about regulated or restricted deployments, I'd love to explore what a partnership could look like."

---

## OBJECTION HANDLING

### "How does this compare to Harvey?"
> "Harvey is excellent at cloud legal AI. But they're structurally locked out of air-gapped environments. We're not competing with Harvey — we're serving the customers Harvey cannot touch."

### "What about model quality?"
> "We use local LLMs (Ollama). Model quality is improving rapidly. But our value isn't the model — it's the **verification layer**. We can prove our AI didn't lie. Harvey can't."

### "Who are your customers?"
> "We're pre-revenue, focused on government and defense legal offices. The thesis is: cloud AI will never be allowed in certain environments. We built for those environments from day one."

### "Why wouldn't we just build this ourselves?"
> "You could. But it would require:
> - Rearchitecting for air-gap deployment
> - Building cryptographic audit infrastructure
> - Implementing deterministic replay
> - Changing your cloud-first culture
>
> We've already done this. We're a faster path to that market."

---

## LEAVE-BEHINDS

1. **Decision DNA bundle** (JSON + summary PDF)
2. **One-pager on sovereign deployment**
3. **This demo script** (shows we're organized)

---

## TECHNICAL BACKUP (If They Ask)

### API Endpoints Used
- `POST /api/v1/sovereign-arch/dna/generate/:deliberationId`
- `POST /api/v1/sovereign-arch/dna/verify`
- `POST /api/v1/sovereign-arch/replay/capture/start`
- `POST /api/v1/sovereign-arch/replay/:stateId`
- `GET /api/v1/sovereign-arch/replay/:stateId/verify`

### Key Files
- `backend/src/services/sovereign/DecisionDNAService.ts` (917 lines)
- `backend/src/services/sovereign/DeterministicReplayService.ts` (854 lines)
- `backend/src/routes/sovereign-arch.ts` (740 lines)

---

*Last updated: January 2026*
