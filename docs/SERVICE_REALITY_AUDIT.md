# Service Reality Audit — Deep Dive

**Date:** 2026-02-20
**Scope:** Every backend service assessed for client readiness
**Method:** Source code inspection for real vs simulated patterns
**Honesty Rule:** No inflation. "File exists" ≠ "Feature works."

---

## EXECUTIVE SUMMARY

| Metric | Count |
|--------|-------|
| **Total backend service files** | ~150+ (37 top-level + subdirectories) |
| **Service subdirectories** | 42 |
| **Route files** | 125 |
| **Services using Prisma (real DB)** | ~59 |
| **Services using ONLY in-memory Maps** | ~110 |
| **`Math.random()` instances** | 15 (most are legitimate Box-Muller transforms) |
| **"Production upgrade" / TODO markers** | 263 |
| **Services that are client-ready** | ~15-20 |

### Honest Assessment

**~15% of services are production-ready.** The core decision pipeline (Council → Deliberation → Evidence → PDF) works with real LLM calls and database persistence. Most other services are well-structured scaffolds with correct API shapes but use in-memory Maps (data lost on restart) and/or return constructed data instead of real computations.

---

## TIER 1: GENUINELY REAL — Client-Ready

These services use real algorithms, real database persistence, and real external integrations.

### 10/10 — Production-Ready

| Service | File | Evidence |
|---------|------|----------|
| **DeliberationService** | `DeliberationService.ts` | Real Ollama LLM calls, Prisma DB storage, WebSocket streaming, Chronos event recording |
| **OllamaService** | `ollama.ts` | Real HTTP calls to Ollama API (generate, chat, embed, stream) |
| **EnhancedLLMService** | `EnhancedLLMService.ts` | Real Ollama integration with model selection, Prisma logging |
| **PDFGeneratorService** | `document/PDFGeneratorService.ts` | Real pdfkit PDF generation (court-admissible format, headers, footers, tables) |
| **ChronosEventBus** | `ChronosEventBus.ts` | Real event bus with Prisma persistence, department filtering |

### 9/10 — Real with Minor Gaps

| Service | File | Evidence | Gap |
|---------|------|----------|-----|
| **KMS (Local)** | `security/KeyManagementService.ts` | Real RSA-4096 key generation, SHA-256 signing, file-based key storage | — |
| **KMS (Vault)** | Same file | Real HTTP API calls to HashiCorp Vault transit engine | Requires running Vault instance |
| **TimeLockService** | `sovereign/TimeLockService.ts` | Real AES-256-GCM encryption, proper IV/auth tags, file persistence | In-memory vault index |
| **FederatedMeshService** | `sovereign/FederatedMeshService.ts` | Real RSA signing, differential privacy (Box-Muller), file persistence | Math model is simplified |
| **CendiaCrucibleService** | `CendiaCrucibleService.ts` | Real Monte Carlo with Box-Muller Gaussian, Prisma persistence | Some risk scores use heuristics |
| **CendiaOmniTranslateService** | `CendiaOmniTranslateService.ts` | Real Ollama translation, Prisma glossary/memory, 100+ languages | Quality depends on model |
| **CouncilDecisionPacketService** | `council/CouncilDecisionPacketService.ts` | Real Merkle trees, KMS signing, tool call tracing | Needs `prisma db push` |
| **DataDiodeService** | `sovereign/DataDiodeService.ts` | Real file watching, quarantine, signature verification | 6 TODO markers |
| **DecisionService** | `DecisionService.ts` | Prisma CRUD, real DB operations | — |
| **SportsKnowledgeBase** | `sports/SportsKnowledgeBase.ts` | Real UEFA/FIFA/PSR regulation corpus with citations | In-memory index |

### 8/10 — Functional with Caveats

| Service | File | Evidence | Caveat |
|---------|------|----------|--------|
| **TPMAttestationService** | `sovereign/TPMAttestationService.ts` | Software TPM with real RSA signing | Not real hardware TPM (labeled honestly) |
| **CanaryTripwireService** | `sovereign/CanaryTripwireService.ts` | Real honeypot generation, hash-based detection | Prisma + in-memory hybrid |
| **DeterministicReplayService** | `sovereign/DeterministicReplayService.ts` | State capture with seed pinning | File-based, not DB |
| **ShadowCouncilService** | `sovereign/ShadowCouncilService.ts` | Sandbox deliberation mode | In-memory only |
| **QRAirGapBridgeService** | `sovereign/QRAirGapBridgeService.ts` | QR encoding logic | No real QR image generation lib |
| **CendiaDissentService** | `CendiaDissentService.ts` | Prisma persistence, real workflows | — |
| **RedTeamService** | `redteamService.ts` | 8 adversarial perspectives, Prisma storage | Perspectives are prompt-based |
| **CendiaPanopticonService** | `CendiaPanopticonService.ts` | Real compliance dashboard, Prisma | Large service (62.5K) |
| **RegulatorsReceiptService** | `evidence/RegulatorsReceiptService.ts` | Real PDF generation via PDFGeneratorService | Prisma + demo data seeding |

---

## TIER 2: STRUCTURED SCAFFOLDS — In-Memory Only

These services have correct API shapes, proper TypeScript interfaces, and logical business rules, but store everything in `new Map()` — **all data is lost on server restart**.

### DCII Services (all in `services/dcii/`)

| Service | Reality Level | Key Issue |
|---------|-------------|-----------|
| **IISSService** | 6/10 | Hardcoded control scores in `evaluateControl()` — not dynamically assessed from platform telemetry. Does have Prisma persistence for scores. |
| **SyntheticMediaAuthService** | 5/10 | Hash-based "analysis" — no real deepfake detection. 5 TODO markers. |
| **CrossJurisdictionConflictService** | 6/10 | Real conflict detection logic with jurisdiction database, Prisma persistence |
| **DecisionSimilarityService** | 5/10 | Uses string similarity heuristics, Prisma storage |
| **TimestampAuthorityService** | 5/10 | Uses `crypto` for hashing but has `Math.random()` for RFC 3161 nonce. In-memory + Prisma hybrid. |
| **CognitiveBiasMitigationService** | 5/10 | Bias detection via keyword matching, not real cognitive science models |

### Sovereign Services (in `services/sovereign/`)

| Service | Reality Level | Key Issue |
|---------|-------------|-----------|
| **CendiaBlackBoxService** | 4/10 | In-memory Maps, optional Prisma injection but defaults to none |
| **CendiaGlassService** | 3/10 | In-memory only, 5 Maps, no DB |
| **CendiaKeyService** | 3/10 | In-memory only, 5 Maps, no DB |
| **CendiaLegacyService** | 3/10 | In-memory only, 5 Maps, no DB |
| **CendiaMeshService** | 3/10 | In-memory only, 5 Maps, no DB |
| **CendiaMirageService** | 3/10 | In-memory only, 4 Maps, no DB |
| **CendiaMirrorService** | 4/10 | Has `Math.random()`, in-memory Maps |
| **CendiaOracleService** | 3/10 | In-memory only, 4 Maps |
| **CendiaVaultService** | 4/10 | In-memory, 5 TODO markers |
| **CendiaWitnessService** | 3/10 | In-memory only, 4 Maps |
| **LocalRLHFService** | 5/10 | Feedback collection logic exists, file-based, no real LoRA training |
| **PortableInstanceService** | 5/10 | Config generator, file-based output |
| **DecisionDNAService** | 6/10 | Export logic with Merkle trees, Prisma integration |

### Enterprise Services

| Service | Reality Level | Key Issue |
|---------|-------------|-----------|
| **EvidenceVaultService** | 5/10 | Explicitly states "Uses in-memory storage with realistic sample data" |
| **AIConstitutionalCourtService** | 4/10 | In-memory Maps, no Prisma |
| **AIInsuranceService** | 4/10 | In-memory Maps, no Prisma |
| **RegulatorySandboxService** | 5/10 | In-memory, but has real compliance framework data |
| **CendiaCommandService** | 5/10 | In-memory Maps, 15 vertical configs |
| **CendiaCommandPlatinumService** | 5/10 | 6-layer execution model, in-memory |
| **CendiaHorizonService** | 6/10 | Graph-based simulation via CendiaOrbit, in-memory |
| **CendiaSentryService** | 5/10 | Runtime guardrails logic, in-memory |
| **WarGamesService** | 5/10 | Simulation framework, Prisma hybrid |

---

## TIER 3: FAKE/SIMULATED — Must Be Fixed or Removed

These services claim to implement specific algorithms but actually use placeholder implementations.

| Service | Claim | Reality | Action Required |
|---------|-------|---------|-----------------|
| **PostQuantumKMSService** | Dilithium/SPHINCS+/Falcon signatures | Uses `crypto.randomBytes()` for "keys" and `HMAC-SHA512` for "signatures" — NOT real PQ cryptography | Replace with `liboqs` or remove PQ claims |
| **ZeroKnowledgeProofService** | zk-SNARKs/zk-STARKs proofs | Uses hash-based "proofs" — NOT real zero-knowledge proofs. Comments say "use snarkjs/circom" | Replace with `snarkjs` or remove ZKP claims |
| **SyntheticMediaAuthService** | Deepfake detection, C2PA provenance | Hash comparison only — no real deepfake detection ML model | Remove detection claims or integrate real model |

---

## TIER 4: VERTICALS — Template-Based

15+ vertical services follow an identical pattern with 6 TODO markers each:

| Vertical | File | Reality |
|----------|------|---------|
| Financial | `FinancialVertical.ts` | Template scaffold, 6 TODOs |
| Healthcare | `HealthcareVertical.ts` | Template + in-memory Maps |
| Hospitality | `HospitalityVertical.ts` | Template scaffold, 6 TODOs |
| Manufacturing | `ManufacturingVertical.ts` | Template scaffold, 6 TODOs |
| Construction | `ConstructionVertical.ts` | Template scaffold, 6 TODOs |
| Aerospace | `AerospaceVertical.ts` | Template scaffold, 6 TODOs |
| Automotive | `AutomotiveVertical.ts` | Template scaffold, 6 TODOs |
| Agriculture | `AgricultureVertical.ts` | Template scaffold, 6 TODOs |
| Media | `MediaVertical.ts` | Template scaffold, 6 TODOs |
| Professional | `ProfessionalVertical.ts` | Template scaffold, 6 TODOs |
| Transportation | `TransportationVertical.ts` | Template scaffold, 6 TODOs |
| Retail | `RetailVertical.ts` | Template scaffold, 6 TODOs |
| Nonprofit | `NonprofitVertical.ts` | Template scaffold, 6 TODOs |
| Telecom | `TelecomVertical.ts` | Template scaffold, 6 TODOs |
| Pharmaceutical | `PharmaceuticalVertical.ts` | Template scaffold, 6 TODOs |

**Exception:** Sports vertical (`SportsAgents.ts`, `SportsKnowledgeBase.ts`, `SportsDecisionService.ts`) is significantly more complete with real regulation corpus, 10 agents, and Prisma models.

---

## CRYPTO REALITY CHECK

| Claim | Implementation | Real? |
|-------|---------------|-------|
| **RSA-4096 signing** | `crypto.generateKeyPairSync('rsa', { modulusLength: 4096 })` | ✅ REAL |
| **SHA-256 hashing** | `crypto.createHash('sha256')` | ✅ REAL |
| **AES-256-GCM encryption** | `crypto.createCipheriv('aes-256-gcm')` | ✅ REAL |
| **RSA-SHA256 signatures** | `crypto.createSign('RSA-SHA256')` | ✅ REAL |
| **Merkle trees** | Custom implementation with SHA-256 leaves | ✅ REAL (simple but correct) |
| **HMAC-SHA512** | `crypto.createHmac('sha512')` | ✅ REAL (but used as fake PQ sig) |
| **HashiCorp Vault transit** | Real HTTP API calls to Vault | ✅ REAL (requires Vault) |
| **AWS KMS** | Structured but falls back to local | ⚠️ FALLBACK (needs @aws-sdk/client-kms) |
| **Azure Key Vault** | Structured but falls back to local | ⚠️ FALLBACK (needs @azure/keyvault-keys) |
| **Dilithium/SPHINCS+/Falcon** | `crypto.randomBytes()` + HMAC | ❌ FAKE |
| **zk-SNARKs/zk-STARKs** | Hash-based "proofs" | ❌ FAKE |
| **Deepfake detection** | Hash comparison | ❌ FAKE |
| **RFC 3161 timestamps** | Partial — uses `Math.random()` for nonce | ⚠️ PARTIAL |

---

## DATABASE REALITY CHECK

| Category | Prisma Models | In-Memory Maps | Assessment |
|----------|--------------|----------------|------------|
| **Deliberations** | `deliberations`, `deliberation_messages`, `agents` | Cache only | ✅ Real DB |
| **Decisions** | `decisions`, `decision_messages` | — | ✅ Real DB |
| **DCII Scores** | `dcii_iiss_scores`, `dcii_iiss_assessments`, `dcii_iiss_history` | Hybrid | ⚠️ DB + hardcoded scores |
| **Translation** | `omnitranslate_glossaries`, `omnitranslate_glossary`, `omnitranslate_memory` | — | ✅ Real DB |
| **Decision Packets** | `decision_packets` | — | ✅ Real DB (needs db push) |
| **Sports** | Transfer/contract decisions, approvals, evidence, FFP | Knowledge base | ✅ Real DB |
| **Evidence Vault** | NONE | 5+ Maps | ❌ In-memory only |
| **Sovereign services** | Varies (most NONE) | 3-5 Maps each | ❌ Mostly in-memory |
| **Insurance** | NONE | Maps | ❌ In-memory only |
| **Constitutional Court** | NONE | Maps | ❌ In-memory only |
| **ZKP** | NONE | Maps | ❌ In-memory only |
| **All Verticals** | NONE (except Sports) | Maps | ❌ In-memory only |

---

## WHAT "CLIENT-READY" ACTUALLY MEANS

For a service to be client-ready, it must have:

1. ✅ **Real database persistence** (Prisma, not Maps)
2. ✅ **Real algorithms** (not Math.random() for business logic, not HMAC pretending to be PQ crypto)
3. ✅ **Real external integrations** (actual API calls, not TODO comments)
4. ✅ **Error handling** (graceful failures, not crashes)
5. ✅ **No "Production upgrade" comments** in code paths clients will use
6. ✅ **Data survives restart**

### Services meeting ALL criteria: ~15-20 out of ~150+

---

## PRIORITY REMEDIATION PLAN

### P0 — CRITICAL (Dishonesty Risk)

1. ~~**Remove or fix PostQuantumKMS claims**~~ ✅ FIXED — Honestly labeled as "classical crypto with PQ-ready API shape." Comments say HMAC-SHA512, not Dilithium.
2. ~~**Remove or fix ZKP claims**~~ ✅ FIXED — Honestly labeled as "hash-based commitment scheme, not real ZK proofs."
3. ~~**Fix SyntheticMediaAuth**~~ ✅ FIXED — All 5 hardcoded analysis methods labeled `HARDCODED`. Provenance/chain-of-custody (real SHA-256) distinguished from deepfake detection (fake).

### P1 — HIGH (Data Loss Risk)

4. ~~**Migrate Evidence Vault to Prisma**~~ ✅ FIXED — `evidence_vault_packets` table created, service loads from DB on init, persists on every write. Data survives restart.
5. ~~**Migrate IISS to dynamic assessment**~~ ✅ FIXED — `evaluateControl()` now uses dynamic scoring: 40% service exists, 30% DB persistence, 30% no known gaps. Each control has honest annotations.
6. **Add Prisma to sovereign services** — At least BlackBox, Witness, Oracle (REMAINING)
7. **Install `@aws-sdk/client-kms`** — AWS KMS falls back to local signing silently (REMAINING)

### P1.5 — FIXED (Crypto Hygiene)

8. ~~**TimestampAuthority Math.random() nonce**~~ ✅ FIXED — Replaced with `crypto.randomBytes(4).toString('hex')`

### P2 — MEDIUM (Completeness)

9. **Add Prisma to Constitutional Court, Insurance, Regulatory Sandbox**
10. **Convert vertical templates to real implementations** (start with Financial, Healthcare)

### P3 — LOW (Polish)

11. **Reduce 263 TODO markers** — Each is a potential audit finding
12. **Add integration tests** for all Tier 1 services
13. **Remove `CendiaRewindService.ts`** — 26 TODO markers, likely not functional

---

## FINAL HONEST SCORE

| Dimension | Score | Notes |
|-----------|-------|-------|
| **Core Decision Pipeline** | 9/10 | Council → Deliberation → Decision → Evidence → PDF is real |
| **Cryptography (Classical)** | 8/10 | RSA, AES-256-GCM, SHA-256, Merkle trees are all real |
| **Cryptography (Post-Quantum)** | 2/10 | HMAC-based, but now HONESTLY LABELED as classical crypto with PQ API shape |
| **Database Persistence** | 4.5/10 | ~60 services use Prisma (Evidence Vault migrated), ~109 use only Maps |
| **DCII Framework** | 6/10 | IISS now uses dynamic scoring based on actual platform state |
| **Sovereign Architecture** | 5/10 | 11 patterns exist, ~4 are genuinely functional |
| **Verticals** | 3/10 | 15 templates with 6 TODOs each; only Sports is real |
| **Enterprise Features** | 4/10 | Crucible/RedTeam real; Insurance/Court/ZKP simulated |
| **Overall Client Readiness** | **4.5/10** | Core pipeline excellent; P0 honesty fixes done; Evidence Vault now persistent |

**Bottom line:** The platform has a genuinely excellent core (Council + Deliberation + LLM + Evidence + PDF), solid classical cryptography, and a comprehensive architectural vision. The 3 previously-fake crypto services (PQ, ZKP, MediaAuth) have been honestly relabeled — no longer dishonest, but still need real algorithm integration for full claims. Evidence Vault now persists to PostgreSQL. IISS scoring is now dynamic. ~75% of services remain scaffolds needing significant work.

---

*Generated by honest deep-dive source code audit — Feb 20, 2026*
*Updated same day with P0+P1 fixes applied*
*Methodology: Pattern search (Math.random, new Map, prisma, TODO/STUB) + manual code review of 30+ service files*

### Commits from this audit session:
1. `f6768700a` — docs: add SERVICE_REALITY_AUDIT.md
2. `a9d6d7bc5` — fix: P0+P1 honesty fixes (PostQuantumKMS, ZKP, SyntheticMediaAuth, IISS dynamic scoring, Timestamp crypto nonce)
3. `b3f6a3f4f` — feat: migrate Evidence Vault to Prisma persistence
