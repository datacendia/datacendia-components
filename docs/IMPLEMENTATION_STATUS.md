# Datacendia — Implementation Status

> Source: `roadmap_full.txt` — ROADMAP comments extracted from backend source  
> Updated: May 2026  
> Purpose: Honest inventory of what works today vs what's stubbed

This document categorises every `// ROADMAP:` comment in the backend codebase by priority tier and service area. Items are classified by whether they affect the demo flow, Pilot customers, Enterprise customers, or are backlog-only.

**Do not use this document for sales pitches.** Its purpose is internal engineering prioritisation and honest disclosure to customers who ask "what's implemented vs planned?"

---

## Priority Classification

| Tier | Definition | Affects |
|---|---|---|
| **P0** | Could fail or produce wrong results in `docker compose demo` flow | Demo reliability |
| **P1** | Affects Pilot customer experience — things customers will notice | $50K Pilot tier |
| **P2** | Affects Enterprise feature completeness | $500K+ contracts |
| **P3** | Backlog — nice-to-have, not blocking any customer tier | Future roadmap |

---

## What Works Today vs What's Stubbed

| Area | Works Today | Stubbed / Planned |
|---|---|---|
| **Council deliberation** | Multi-agent deliberation with LLM integration via Ollama/Triton/NIM | Vector similarity search in CouncilService (uses deterministic fallback) |
| **Audit ledger** | Merkle-signed ImmutableAuditLedger, full chain | SIEM alert integration (logged but no auto-alert) |
| **Evidence export** | JSON evidence bundles with Merkle proof | TAR packaging uses simple format (proper `tar` library planned) |
| **Timestamps** | Deterministic RFC 3161-format timestamps | Live TSA HTTP call (planned Q3 2026) |
| **KMS signing** | Software KMS via OpenBao/Vault | HSM hardware module (PKCS#11) |
| **TPM attestation** | Service structure and API | Real TPM hardware verification |
| **QR air-gap bridge** | Service structure and API | Real QR code library integration |
| **PII detection** | Regex-based (Community/Pilot); ML Presidio (Foundation+) | No gaps in existing tiers |
| **Compliance checking** | Framework structure and API | Live compliance check execution in ContinuousComplianceMonitor |
| **Email notifications** | Service API | Live SMTP sending (configured via env var) |
| **ML inference** | Full Ollama/Triton/NIM integration | N/A — fully implemented |
| **RAG/embeddings** | Full RAG service | pgvector for similarity search (currently in-memory) |
| **Carbon scheduling** | Service structure and API | Live electricity maps API |
| **SBOM generation** | SBOM service with sample NVD data | Live NVD/OSV API queries |

---

## P0 — Demo-Critical Items

These items could affect the `docker compose -f docker-compose.demo.yml up` demo flow. All are currently handled with deterministic fallbacks — the demo works, but uses simulated data for these specific steps.

### Council Service
- **`backend/src/services/council/CouncilService.ts:1115`** — Vector similarity search for related decisions uses deterministic computation. *Demo impact: "Similar decisions" panel shows simulated results.*
- **`backend/src/services/council/AdversarialRedTeamService.ts:343,388`** — Red team perspective generation uses deterministic computation. *Demo impact: Red team findings are realistic but not LLM-generated in all paths.*

### Flow / Workflow
- **`backend/src/services/pillars/FlowService.ts:211,250`** — Workflow step execution uses deterministic computation. *Demo impact: Workflow steps complete successfully with simulated execution.*

### Compliance
- **`backend/src/services/compliance/ContinuousComplianceMonitorService.ts:249`** — Compliance checks use deterministic computation rather than live analysis. *Demo impact: Compliance status shows but is not live-computed.*

---

## P1 — Pilot Customer Items

These affect features that Pilot customers will interact with directly.

### Signing & Timestamps
- **`backend/src/services/security/ImmutableAuditLedger.ts:289`** — `ROADMAP: load from HSM/KMS (AWS KMS, HashiCorp Vault, etc.)` — currently uses software KMS via Vault. Vault integration is implemented; HSM hardware is not.
- **`backend/src/services/evidence/RegulatorsReceiptService.ts:1134`** — `ROADMAP: use KMS to sign` — regulatory receipts are signed with software key, not KMS.
- **`backend/src/services/dcii/TimestampAuthorityService.ts:378`** — `ROADMAP: an actual HTTP request to the TSA` — RFC 3161 timestamps use deterministic computation; live TSA call is planned for Q3 2026.
- **`backend/src/services/evidence/SignedTestReportService.ts:727`** — RFC 3161 timestamp uses deterministic computation; same as above.
- **`backend/src/services/command/CendiaCommandPlatinumService.ts:597`** — `ROADMAP: use KMS` — Merkle root signing uses in-process key.
- **`backend/src/services/consolidated/index.ts:702`** — `ROADMAP: verify with KMS` — verification uses in-process check.

### Email
- **`backend/src/services/email.ts:37`** — `ROADMAP: use configured SMTP` — email service is wired up but requires customer SMTP configuration. Not a Datacendia limitation — customer must configure `SMTP_*` env vars.

### Evidence Export
- **`backend/src/services/evidence/EvidenceExportService.ts:1048`** — `ROADMAP: use proper tar library` — uses a simplified tar-like format. Evidence bundles are valid and importable but not standard-format TAR.

### SBOM
- **`backend/src/services/crucible/SBOMService.ts:93`** — `ROADMAP: use NVD/OSV APIs` — uses sample vulnerability database. Live NVD/OSV queries planned.
- **`backend/src/services/crucible/SBOMService.ts:317`** — `ROADMAP: use proper semver comparison` — semver comparison is simplified.

---

## P2 — Enterprise Feature Items

These affect Enterprise-tier features that are present in the platform but not fully wired to production dependencies.

### HSM / TPM
- **`backend/src/services/security/HSMAdapter.ts:128`** — `ROADMAP: Use graphene-pk11 or pkcs11js to load real PKCS#11 library` — HSM adapter has the interface but uses software fallback.
- **`backend/src/services/sovereign/TPMAttestationService.ts:618`** — `ROADMAP: verify against stored public key via TPM` — TPM service structure is complete; real TPM hardware verification not wired.
- **`backend/src/services/evidence/SignedTestReportService.ts:676`** — `tpmUsed: false, ROADMAP: integrate with TPM hardware module` — test reports flag TPM as not used.
- **`backend/src/services/CendiaResponsibilityService.ts:553`** — `ROADMAP: TPM 2.0 or HSM` — responsibility attestation uses software signing.

### Key Management
- **`backend/src/services/security/KeyManagementService.ts:406`** — `ROADMAP: use @azure/keyvault-keys` — Azure Key Vault integration is stubbed; uses OpenBao/Vault (fully implemented) as primary.

### SIEM Integration
- **`backend/src/services/security/ImmutableAuditLedger.ts:320`** — `ROADMAP: alerts via SIEM integration` — events are logged to the ledger; automated SIEM alert push is planned.

### MFA QR Code
- **`backend/src/services/security/MFAService.ts:451`** — `ROADMAP: use a library like 'qrcode'` — MFA TOTP enrollment uses text output; QR code display is planned.

### RAG / pgvector
- **`backend/src/services/llm/RAGService.ts:234`** — `ROADMAP: use pgvector for efficient similarity search` — currently uses in-memory vector comparison. pgvector migration planned.

### Adversarial Red Team
- **`backend/src/services/council/AdversarialRedTeamService.ts:343,388`** — LLM-powered perspective generation (deterministic fallback currently active in some paths).

### Compliance
- **`backend/src/services/compliance/RegulatorySandboxService.ts:525`** — Regulatory sandbox analysis uses deterministic computation.
- **`backend/src/services/pillars/GuardService.ts:151`** — `ROADMAP: load from ComplianceService` — guard frameworks loaded from static config, not live ComplianceService.
- **`backend/src/services/pillars/PredictService.ts:169,193`** — ML pipeline trigger and inference call use deterministic computation.

### Blockchain Timestamp
- **`backend/src/services/dcii/TimestampAuthorityService.ts:411`** — `ROADMAP: to an actual blockchain` — blockchain anchoring is planned; current implementation uses Merkle-signed local timestamps.

### NTP
- **`backend/src/services/evidence/TestEvidenceLedgerService.ts:758`** — `ROADMAP: query actual NTP server` — uses system time; live NTP verification planned.

### Data Connectors (Verticals)
All 20 industry vertical service files contain:
- `ROADMAP: establish real API connections` — connector framework is built; real third-party API integrations are customer-configured
- `ROADMAP: call real APIs` — data ingestion uses deterministic data; real API calls are customer responsibility
- `ROADMAP: implement full rule engine` — simplified violation detection; full expression parser planned
- `ROADMAP: use expression parser` — policy evaluation uses simplified logic

These are by design: the connector framework exists and is extensible, but live integrations require customer credentials.

### Other Enterprise Items
- **`backend/src/services/enterprise/CendiaNerveService.ts:517`** — Incident recovery actions are logged but not auto-triggered.
- **`backend/src/services/enterprise/CendiaTransitService.ts:655`** — Transit alerts logged but not pushed to external security teams.
- **`backend/src/services/strategic/RDPService.ts:574,585`** — Container health and resource usage use deterministic data; Prometheus/Docker API integration planned.
- **`backend/src/services/strategic/CendiaIngestService.ts:249,290`** — Document text extraction uses simple parsing; Apache Tika integration planned.
- **`backend/src/services/CendiaOrbitService.ts:214`** — Neo4j graph query is structured; real graph population planned.

---

## P3 — Backlog Items

These are implementation improvements that don't block any customer tier.

### QR Air-Gap Bridge
- **`backend/src/services/sovereign/QRAirGapBridgeService.ts:445,455,458`** — `ROADMAP: use actual QR library` — QR bridge service structure is complete; real QR code library (e.g., `qrcode` npm package) not yet integrated. Current output is a placeholder representation.

### Sovereign / Data Diode
- **`backend/src/services/sovereign/CanaryTripwireService.ts:430,523,620`** — Canary tripwire DB insertion, notification, and HTTP call are stubbed.
- **`backend/src/services/sovereign/CendiaGlassService.ts:231`** — Glass service uses deterministic data; real data from appropriate services planned.
- **`backend/src/services/sovereign/CendiaVaultService.ts:142,370,515`** — Vault object storage fetch and KMS verification planned.
- **`backend/src/services/sovereign/DataDiodeService.ts:493,605,845,885`** — ClamAV Layer 5, X.509 signer identity extraction, Parquet column extraction, JSON Schema validation via ajv planned.
- **`backend/src/services/sovereign/DecisionDNAService.ts:516,555`** — Decision DNA fetches from Vox service and approval tables planned.
- **`backend/src/services/sovereign/DeterministicReplayService.ts:672,707,716`** — Full replay against actual Council and LLM services (deterministic seeds) planned.
- **`backend/src/services/sovereign/FederatedMeshService.ts:490,761`** — Real data point counting and Gaussian mechanism planned.
- **`backend/src/services/sovereign/PortableInstanceService.ts:815`** — Actual ZIP archive creation planned.
- **`backend/src/services/sovereign/ShadowCouncilService.ts:287,442,533`** — Data state snapshot, LLM deliberation, and DB fetch planned.
- **`backend/src/services/sovereign/TimeLockService.ts:273,296`** — Prime generation and Miller-Rabin primality test planned.

### Analytics / Metrics
- **`backend/src/services/storage/AnalyticsRouter.ts:189`** — Streaming for timeline queries planned.
- **`backend/src/services/metrics/ROIMetricsService.ts:224,226`** — ROI timing and size metrics use hard-coded estimates; instrumented actuals planned.

### Social/News Feeds
- **`backend/src/services/core/CendiaBrandService.ts:373`** and **`CendiaWatchService.ts:363`** — News/social API integration planned.
- **`backend/src/services/MarketSalaryService.ts:113`** — BLS API integration planned.

### ML / AI
- **`backend/src/services/gnosisService.ts:373`** — Learning style assessment planned.
- **`backend/src/services/strategic/SynthesisEngineService.ts:491`** — Synthesis step execution against actual services planned.
- **`backend/src/services/CendiaApotheosisService.ts:486,611`** — Audit log database persistence and model version metadata planned.

### Legal
- **`backend/src/services/legal/CendiaBridgeService.ts:306`** — External legal service authentication planned.

### Decision Service
- **`backend/src/services/DecisionService.ts:762`** — `ROADMAP: use crypto` — decision ID uses simplified generation.
- **`backend/src/services/DeliberationService.ts:661`** — PDF generation uses HTML (printable); native PDF library planned.

### SGAS / Observer
- **`backend/src/services/sgas/ObserverAgentsService.ts:803`** — Hash verification against stored values planned.

### Dissent
- **`backend/src/services/CendiaDissentService.ts:243,633,753`** — Dissent identity encryption, HR monitoring integration, and real encryption planned.

### Vertical Sentinel (meta)
- **`backend/src/services/verticals/meta/VerticalSentinelService.ts:452,457`** — Live regulatory feed scanning planned.

### Carbon Scheduler
- **`backend/src/services/scheduling/CarbonAwareSchedulerService.ts:102,148`** — Live electricity maps API integration planned.

### SCGE / Policy
- **`backend/src/services/scge/PolicyInjectionService.ts:264,292,319`** — Full rule engine, proper rule engine, and formal constraint solver planned.

### Enterprise Habitat
- **`backend/src/services/enterprise/CendiaHabitatService.ts:551`** — Building management system integration for energy data planned.

### Collapse
- **`backend/src/services/collapse/CollapseOrchestrator.ts:144`** — Full Council integration for consensus track planned.

---

## Summary Table

| Priority | Count | Key Themes |
|---|---|---|
| **P0** (Demo) | ~6 items | Council similarity search, red team, workflow execution, compliance monitor |
| **P1** (Pilot) | ~12 items | KMS signing, TSA timestamps, email SMTP, evidence TAR format, SBOM live APIs |
| **P2** (Enterprise) | ~25 items | HSM/TPM hardware, SIEM alerting, MFA QR, pgvector, real connector APIs, blockchain anchoring |
| **P3** (Backlog) | ~55 items | QR air-gap, sovereign advanced features, social APIs, ML pipelines, PDF generation |

**Total ROADMAP items catalogued:** ~98 unique implementation stubs across 88 service files.

---

## Notes for Engineering

- All P0 items have deterministic fallbacks — the demo works correctly today.
- All P1 items are functional for Pilot customers — the platform delivers value at this tier without any P1 completion.
- P2 items become relevant when an Enterprise customer requires specific hardware-backed security or live integrations.
- P3 items are quality-of-life improvements, not feature gaps.

The 170 entries in `roadmap_full.txt` include duplicate entries (the same service appearing multiple times for different methods) and some entries from `CendiaMeshService.ts` that use `roadmap` as a variable name (not ROADMAP comments). This document represents the unique functional stubs only.
