# FEPCMAC Demo — 15-Minute Path

**Login:** jorge.mendoza@cmac-cusco.demo / demo-password-2024  
**Role:** Oficial de Cumplimiento, CMAC Cusco S.A.  
**Environment:** Railway (DATACENDIA_LICENSE_TIER=sovereign, INFERENCE_PROVIDER=openai)

---

## Minute 0–2: Login + Dashboard (2 min)

1. Open the app URL → Login page
2. Enter credentials for Jorge Mendoza (Oficial de Cumplimiento)
3. Land on **Dashboard** — point out:
   - Organization: **CMAC Cusco S.A.**
   - 10 decisions tracked, 7 deliberations, 75 audit log entries
   - 10 active alerts (SBS compliance, credit risk, etc.)
   - All in **Spanish** — the platform speaks the regulator's language

**Key message:** "This is what your compliance team sees every morning."

---

## Minute 2–7: Quinua Credit Deliberation (5 min)

1. Navigate to **Deliberations** → Click the quinua credit deliberation:
   > "¿Deberíamos aprobar el crédito agropecuario de S/ 180,000 a la Cooperativa Valle Sagrado considerando la volatilidad del precio de la quinua?"

2. Show the **decision detail**:
   - **Recommendation:** Aprobar con condiciones — desembolso en dos tramos
   - **Consensus:** MAJORITY (not unanimous — this is important)
   - **Dissent from Ethics Guardian:** Recommends adding technical agricultural assistance clause to prevent over-indebtedness in vulnerable rural communities
   - **Conditions:** Two-tranche disbursement, mandatory crop insurance, INIA agronomist accompaniment
   - **Regulatory citation:** SBS Resolution N° 11356-2008 Art. 17

3. **Point out the dissent:** "The system didn't just approve — it captured a minority opinion that the Ethics Guardian raised. This dissent is cryptographically signed and cannot be removed. If SBS asks 'did you consider the social impact?' — you have proof."

4. Show **voting breakdown:** 3 approve, 1 approve with conditions, 0 reject

**Key message:** "Every credit decision has a complete deliberation trail. Not just yes/no — the reasoning, the dissent, the conditions, the regulatory basis."

---

## Minute 7–10: Audit Log + Compliance (3 min)

1. Navigate to **Compliance** → Show the **frameworks list**
   - Filter by jurisdiction: **PE** (Peru)
   - Show DS N° 115-2025-PCM, Ley 31814, Ley 26702, SBS Gobierno Corporativo, Ley 29733
   - "These aren't marketing checkboxes — each framework is mapped clause-by-clause to the platform's controls"

2. Navigate to **CendiaOversight** (Panopticon) → Show the **regulatory radar**
   - 60+ frameworks tracked globally
   - Peru-specific frameworks highlighted
   - Show that SBS risk governance framework is mapped

3. Show the **audit log** for the quinua deliberation
   - Point out SHA-256 hashes on each entry
   - "Every entry is cryptographically signed. If someone changes a record, the hash chain breaks. This is the evidence the SBS wants."

**Key message:** "DS N° 115-2025-PCM requires evidence of AI governance. This is that evidence."

---

## Minute 10–13: Evidence Export (3 min)

1. Navigate to **CendiaGateway** dashboard → Show:
   - Interaction count, PII detection stats, policies applied
   - "Every AI interaction in the organization is captured here"

2. Show the **AI Manifest** for an interaction:
   - Cryptographic signature
   - Policies applied
   - PII detected (if any)
   - Model used, timestamp, input/output hash

3. **Export the evidence package** (or show the export button):
   - "This is what you hand to the SBS auditor. One click. DS N° 115-2025-PCM evidence package. Cryptographically signed. Clause-by-clause mapped to ISO/IEC 42001:2023."

**Key message:** "The regulator asks for evidence. You push one button. Done."

---

## Minute 13–15: Close + Next Steps (2 min)

1. **Sovereign deployment:** "Everything you just saw runs inside YOUR infrastructure. Your servers, your keys, your data. Datacendia never sees your data."

2. **The POC:** 
   - 60 days, 2 cajas piloto
   - Entregable: Paquete de evidencia DS N° 115-2025-PCM
   - USD $20,000 — acreditable al primer contrato anual

3. **Next step:** "I'll send you the formal POC proposal today. You designate 2 cajas, we schedule a 30-minute technical call, and we start."

---

## Backup Talking Points (if questions arise)

- **"Is this certified?"** → "We have a formal self-assessment against ISO/IEC 42001. We're pursuing INACAL certification. The platform generates the evidence — certification is the formal stamp on what the technology already does."

- **"What about the other 9 cajas?"** → "The POC is designed as federation infrastructure. Once validated with 2 cajas, the architecture scales to all 11 with the same deployment pattern."

- **"What if the SBS changes requirements?"** → "The platform tracks 60+ regulatory frameworks. When SBS publishes new guidance, we update the mapping. Your evidence package stays current."

- **"What about data privacy?"** → "We have a formal DPIA template aligned to Ley 29733. The sovereign deployment means no data leaves your perimeter. We never see your customer data."

---

## Pre-Demo Checklist

- [ ] Backend running on Railway with seed data loaded
- [ ] Login tested with jorge.mendoza@cmac-cusco.demo
- [ ] Quinua deliberation visible with dissent data
- [ ] Compliance frameworks showing Peru frameworks (DS 115, Ley 31814, etc.)
- [ ] Gateway dashboard showing interaction data
- [ ] Evidence export button functional
- [ ] Spanish language active in UI
