# Datacendia Service Catalog

> Last Updated: March 22, 2026
> Source: Service audit across `datacendia-core` and `datacendia-components`

This document catalogs every service in the Datacendia platform, organized by tier, with workflows describing how each service category operates end-to-end.

---

## How To Read This Document

- **Tier** — Which pricing tier includes this service (Community, Pilot, Foundation, Enterprise, Strategic)
- **Workflow** — The end-to-end data flow for each service category
- **Services** — Individual service files with size and description
- Services marked *(stub in Core)* exist in `datacendia-core` as tiny redirects to UpgradePage

---

## Community Tier (Free) — `datacendia-core`

### Gateway & AI Proxy

**Workflow:** Employee → CendiaGateway (reverse proxy) → PII scan → Policy check → DCII signing → AI Provider (OpenAI/Anthropic/etc.) → Response → Audit ledger

```
User Request
  → CendiaGatewayService (intercept)
    → PIIDetector (scan for PII, 10 regex types)
    → PolicyEngine (check org policies)
    → ModelRouter (route to correct AI provider)
    → AI Provider (OpenAI / Anthropic / Gemini / Ollama)
  → Response
    → PIIDetector (scan response)
    → RegulatorsReceiptService (generate signed receipt)
    → EvidenceVaultService (store in immutable ledger)
  → Return to user
```

| Service | Size | Description |
|---------|------|-------------|
| CendiaGatewayService.ts | 40.6 KB | Reverse proxy for cloud AI APIs |
| GatewayProxyServer.ts | 19.9 KB | HTTP proxy server |
| ModelRouter.ts | 11.8 KB | Route requests to AI providers |
| QueryRouter.ts | 10.5 KB | Query routing and load balancing |
| RateLimiter.ts | 10.7 KB | Rate limiting for API calls |
| OpenAIProvider.ts | 9.2 KB | OpenAI API integration |
| AnthropicProvider.ts | 7.7 KB | Anthropic/Claude API integration |
| GeminiProvider.ts | 9.0 KB | Google Gemini API integration |
| TogetherAIProvider.ts | 7.6 KB | Together AI integration |
| InferenceService.ts | 10.5 KB | Unified inference abstraction |
| InferenceProvider.ts | 4.3 KB | Provider interface |

### Council (Multi-Agent Deliberation)

**Workflow:** User submits decision → CouncilService assigns agents → Each agent deliberates (LLM inference) → Agents challenge each other → Consensus or dissent recorded → Decision packet generated → Signed and stored

```
Decision Submitted
  → CouncilService (orchestrate)
    → AgentsService (assign 3-8 agents based on decision type)
    → For each agent:
      → InferenceService → LLM (generate perspective)
      → ChainOfThought (build reasoning chain)
    → FlowService (orchestrate deliberation rounds)
      → Agents cross-examine each other's positions
      → CouncilWebSocket (stream to UI in real-time)
    → Consensus or dissent recorded
  → EvidenceVaultService (store full deliberation)
  → RegulatorsReceiptService (generate Regulator's Receipt)
  → MerkleForestService (anchor to Merkle tree)
```

| Service | Size | Description |
|---------|------|-------------|
| CouncilService.ts | 50.5 KB | Core Council orchestration — 50+ agents |
| CouncilWebSocket.ts | 8.5 KB | Real-time deliberation streaming |
| FlowService.ts | 31.2 KB | Decision flow orchestration |
| ChainOfThought.ts | 10.2 KB | Reasoning chain construction |
| AgentsService.ts | 12.3 KB | Agent management |

### PII Detection (Basic)

**Workflow:** Text input → Regex pattern matching → Match found? → Block (SSN, credit card) or Redact (email, phone) → Return sanitized text + PII report

| Service | Size | Description |
|---------|------|-------------|
| PIIDetector.ts | 9.5 KB | Regex-based PII detection (10 types) |
| PIIEvaluationMetrics.ts | 14.6 KB | PII detection quality metrics |

### Evidence & Audit (Basic)

**Workflow:** Decision completed → Evidence package assembled → Merkle hash computed → HMAC signed → Stored in vault → Exportable as PDF/JSON/HTML

```
Decision Complete
  → EvidenceVaultService (assemble evidence)
    → MerkleForestService (compute Merkle root)
    → ContentAddressedReceiptService (content-addressed hash)
    → SignedTestReportService (cryptographic signature)
  → EvidenceExportService (export to PDF/JSON/standalone HTML)
  → RegulatorsReceiptService (generate regulator-ready receipt)
  → LineageService (record decision lineage)
```

| Service | Size | Description |
|---------|------|-------------|
| EvidenceVaultService.ts | 39.3 KB | Immutable evidence storage |
| EvidenceExportService.ts | 40.0 KB | Export evidence to PDF/JSON |
| RegulatorsReceiptService.ts | 56.9 KB | Regulator-ready receipts |
| SignedTestReportService.ts | 29.5 KB | Cryptographically signed reports |
| MerkleForestService.ts | 8.3 KB | Merkle tree integrity verification |
| ContentAddressedReceiptService.ts | 7.1 KB | Content-addressed receipts |
| LineageService.ts | 26.1 KB | Decision lineage tracking |

### Compliance (Basic)

**Workflow:** Decision submitted → ComplianceService checks against active frameworks → ComplianceEnforcer applies rules → Dashboard updated → EU AI Act risk classification assigned

| Service | Size | Description |
|---------|------|-------------|
| ComplianceService.ts | 28.2 KB | Core compliance engine |
| ComplianceEnforcer.ts | 24.4 KB | Policy enforcement |
| ComplianceDashboardService.ts | 33.9 KB | Compliance dashboard |
| EUAIActEngine.ts | 45.2 KB | EU AI Act compliance mapping |
| frameworks.ts | 45.2 KB | Compliance framework definitions |

### Industry Verticals (Basic — 18+ industries)

**Workflow:** User selects vertical → Vertical-specific agents loaded → Compliance frameworks activated → Decision schemas applied → Industry-specific deliberation

| Service | Size | Description |
|---------|------|-------------|
| FinancialVertical.ts | 58.7 KB | Financial services |
| HealthcareVertical.ts | 53.2 KB | Healthcare |
| GovernmentVertical.ts | 33.4 KB | Government |
| InsuranceVertical.ts | 49.2 KB | Insurance |
| + 14 more | Various | Agriculture, Aerospace, Automotive, Construction, Education, Energy, Hospitality, Industrial, Manufacturing, Media, Nonprofit, Pharmaceutical, Retail, Telecom |

### DECIDE Tools

**Workflow:** User accesses DECIDE module → Chronos (timeline analysis) / PreMortem (failure prediction) / Ghost Board (AI board simulation) / Decision Debt (technical debt tracking)

### DCII Services

**Workflow:** Decision made → Truth (verify claims) → Notary (certify) → Witness (third-party attestation) → Timestamp (RFC 3161) → Similarity (precedent matching) → Memory (institutional memory)

---

## Pilot Tier ($50K/yr)

> Everything in Community, plus managed platform, full deliberation engine, basic analytics.

### Managed Platform & Support

**Workflow:** Customer signs → Datacendia provisions managed instance → Health monitoring activated → Notifications configured → SLA tracking begins → 4-hour support response

| Service | Size | Description |
|---------|------|-------------|
| NotificationService.ts | 19.1 KB | Full notifications (email, Slack, Teams, webhooks) |
| UserManagementService.ts | 19.4 KB | User/team management |
| SampleDataService.ts | 19.8 KB | Onboarding sample data |
| SystemHealthService.ts | 15.9 KB | System health dashboard |
| AdminSettingsService.ts | 8.6 KB | Admin configuration |
| webhook.service.ts | 8.9 KB | Webhook delivery |

### Full Deliberation Engine

**Workflow:** Same as Council, but with full deliberation orchestration (not stub), visualization timeline, and complete decision management

| Service | Size | Description |
|---------|------|-------------|
| DeliberationService.ts | 28.1 KB | Full deliberation orchestration |
| DecisionService.ts | 25.6 KB | Full decision management |
| DeliberationVisualizationService.ts | 18.8 KB | Visual deliberation timeline |

### Basic Analytics

**Workflow:** Decisions complete → ROI calculated → Executive summary auto-generated → Dashboard populated

| Service | Size | Description |
|---------|------|-------------|
| ROIMetricsService.ts | 11.9 KB | ROI tracking and reporting |
| ExecutiveSummaryService.ts | 16.1 KB | Executive summary generation |

---

## Foundation Tier ($150K–$500K/yr)

> Everything in Pilot, plus full compliance engines, ML PII, advanced evidence, translation, expanded verticals.

### Full Compliance Suite

**Workflow:** Decision submitted → Basel3Engine/EUAIActEngine/CrossJurisdiction checks → Conflicts resolved → Continuous monitoring activated → Compliance export generated → Regulatory sandbox testing

```
Decision Submitted
  → ComplianceService (route to applicable engines)
    → Basel3Engine (if financial: capital requirements, risk-weighted assets)
    → EUAIActEngine (EU AI Act risk classification)
    → CrossJurisdictionEngineService (multi-jurisdiction mapping)
      → CrossJurisdictionConflictService (resolve conflicts)
    → ContinuousComplianceMonitorService (ongoing monitoring)
  → RegulatorySandboxService (test compliance posture)
  → ComplianceExportService (generate reports)
  → ComplianceGuard (real-time guardrails)
```

| Service | Size | Description |
|---------|------|-------------|
| Basel3Engine.ts | 38.9 KB | Basel III financial compliance |
| CrossJurisdictionEngineService.ts | 22.6 KB | Multi-jurisdiction mapping |
| CrossJurisdictionConflictService.ts | 40.4 KB | Jurisdiction conflict resolution |
| RegulatorySandboxService.ts | 22.5 KB | Regulatory sandbox testing |
| ContinuousComplianceMonitorService.ts | 22.0 KB | Continuous monitoring |
| ComplianceExportService.ts | 21.3 KB | Advanced compliance exports |
| ComplianceGuard.ts | 11.2 KB | Real-time compliance guardrails |

### Advanced Evidence & Audit

**Workflow:** Decision → Echo (automated outcome collection over time) → Gnosis (pattern discovery across decisions) → Full replay theater → Self-contained evidence packages → Cryptographic stamping

```
Decision Complete
  → echoService (schedule outcome collection at T+30d, T+90d, T+180d)
    → Automated follow-up: "What happened after this decision?"
    → Outcome linked back to original decision evidence
  → gnosisService (cross-decision knowledge graph)
    → Pattern detection across decisions
    → Precedent matching
  → DecisionReplayTheaterService (full visual replay)
  → SelfContainedEvidenceService (portable evidence package)
  → CendiaStampService (cryptographic seal with SVG badge)
```

| Service | Size | Description |
|---------|------|-------------|
| echoService.ts | 45.1 KB | Echo — outcome collection and time-travel |
| gnosisService.ts | 26.0 KB | Gnosis — cross-decision knowledge graph |
| TestEvidenceLedgerService.ts | 36.0 KB | Full evidence ledger |
| SelfContainedEvidenceService.ts | 20.1 KB | Portable evidence packages |
| DecisionReplayTheaterService.ts | 16.4 KB | Visual decision replay |
| CendiaStampService.ts | 11.4 KB | Cryptographic decision stamps |

### Enhanced AI & Translation

**Workflow:** Text → PresidioPIIService (ML detection, 40+ entity types) → EnhancedLLM (advanced orchestration) → OmniTranslate (26 languages) → RAG (retrieval-augmented generation with vector search)

| Service | Size | Description |
|---------|------|-------------|
| CendiaOmniTranslateService.ts | 50.1 KB | 26-language translation |
| TranslationService.ts | 27.8 KB | Translation infrastructure |
| EnhancedLLMService.ts | 31.4 KB | Enhanced LLM orchestration |
| PresidioPIIService.ts | 10.4 KB | ML-based PII (Presidio, 40+ types) |
| RAGService.ts | 10.5 KB | Retrieval-augmented generation |
| VectorDBService.ts | 23.2 KB | Vector database (Qdrant) |
| VectorService.ts | 13.2 KB | Vector embedding management |
| EmbeddingService.ts | 8.8 KB | Embedding generation |

### Analytics & Insights

**Workflow:** Platform events → CendiaSentryService (monitor) → AnomalySentinelService (detect anomalies) → PredictService (predict trends) → AnalyticsRouter (dashboard routing)

| Service | Size | Description |
|---------|------|-------------|
| CendiaSentryService.ts | 49.8 KB | Full platform monitoring |
| PredictService.ts | 16.6 KB | Predictive analytics |
| AnomalySentinelService.ts | 16.6 KB | Anomaly detection |
| AnalyticsRouter.ts | 12.9 KB | Analytics routing |

---

## Enterprise Tier ($500K–$1.5M/yr)

> Everything in Foundation, plus COLLAPSE, Shadow Council, sovereign deployment, advanced security, SIEM.

### COLLAPSE — AI Stress Testing Suite

**Workflow:** Select decision type → CendiaCrucible designs stress scenarios → 12 adversarial agents attack the decision from different vectors → Monte Carlo simulation runs 10,000 iterations → Failure modes cataloged → Risk report generated

```
Stress Test Initiated
  → CollapseOrchestrator (design test plan)
    → StressorLibraryService (select applicable stressors)
    → For each of 12 adversarial agents:
      → Agent attacks decision from unique vector
        (FreeSpeechChilling, LegitimacyCollapse, ForeignInfluence,
         NarrativeWeaponization, MarketDistortion, DemocraticErosion,
         AdversarialAbuse, DueProcessViolation, DisabilityImpact,
         CulturalErasure, EnvironmentalExternality, FreedomOfAssociation)
    → MonteCarloEngine (10,000 iterations)
  → CendiaCrucibleService (synthesize results)
  → EnterpriseRedTeamService (formal red team report)
  → EvidenceVaultService (store as evidence)
```

| Service | Size | Description |
|---------|------|-------------|
| CendiaCrucibleService.ts | 98.6 KB | AI failure mode analysis |
| CollapseOrchestrator.ts | 18.6 KB | Test orchestration |
| StressorLibraryService.ts | 12.0 KB | Stress scenario library |
| MonteCarloEngine.ts | 13.1 KB | Monte Carlo simulation |
| EnterpriseRedTeamService.ts | 48.7 KB | Enterprise red teaming |
| AdversarialRedTeamService.ts | 22.0 KB | Adversarial attacks |
| redteamService.ts | 25.2 KB | Red team orchestration |
| WarGamesService.ts | 26.1 KB | War games simulation |
| 12 adversarial agents | 6–10 KB each | Specialized attack vectors |

### Shadow Council & Dissent

**Workflow:** Primary Council deliberates → ShadowCouncil runs parallel deliberation with different parameters/agents → Results compared → Divergence flagged → Anonymous dissent channel for human override

```
Decision Submitted
  → CouncilService (primary deliberation)
  → ShadowCouncilService (parallel deliberation, different agents)
  → Compare results:
    → If aligned: High confidence signal
    → If divergent: Flag for human review with divergence report
  → CendiaDissentService (anonymous dissent channel)
    → Any council member (human or AI) can file anonymous dissent
    → Dissent recorded immutably but anonymously
```

| Service | Size | Description |
|---------|------|-------------|
| ShadowCouncilService.ts | 21.0 KB | Parallel deliberation |
| CendiaDissentService.ts | 47.8 KB | Anonymous dissent system |
| AnonymousDissentService.ts | 14.4 KB | Dissent infrastructure |

### Sovereign Online Toggle

**Workflow:** Admin sets `DATACENDIA_ONLINE_MODE=false` → SovereignModeService validates config at startup → Cloud AI providers blocked → External services disabled → Local providers only → Validation passes = audit artifact

```
Startup (DATACENDIA_ONLINE_MODE=false)
  → SovereignModeService.validate()
    → Check: Local LLM provider configured? (Ollama/NIM/Triton)
    → Check: INFERENCE_PROVIDER is local? (not openai/anthropic)
    → Check: CLOUD_AI_FALLBACK configured?
    → Check: Local provider reachable?
    → Check: SMTP is local or disabled?
  → If validation fails + production → REFUSE TO START
  → If validation passes → Log audit artifact
  
Runtime:
  → Cloud AI request → guardCloudAI()
    → FALLBACK=error → HTTP 503 CloudAIDisabledError
    → FALLBACK=local → Route to Ollama/NIM/Triton + log warning
  → External data request → guardExternalData() → Sample data fallback
  → External notification → guardExternalNotify() → Suppressed
```

| Service | Size | Description |
|---------|------|-------------|
| SovereignModeService.ts | 8.5 KB | Master online/offline toggle with startup validation |
| OllamaProvider.ts | 11.4 KB | Local LLM via Ollama |
| NIMProvider.ts | 10.7 KB | NVIDIA NIM local inference |
| TritonProvider.ts | 11.5 KB | NVIDIA Triton inference |

### Security & Cryptography

**Workflow:** Decision → ZK proof generated (prove compliance without data) → Keys managed via KMS → Confidential compute (TEE) → Time-lock for high-stakes decisions → OpenBao secrets management

| Service | Size | Description |
|---------|------|-------------|
| KeyManagementService.ts | 39.1 KB | Key management |
| ZeroKnowledgeProofService.ts | 14.7 KB | ZK proofs |
| Groth16ProofService.ts | 14.9 KB | Groth16 ZK-SNARK |
| ConfidentialComputeService.ts | 19.1 KB | TEE/SGX compute |
| OpenBaoService.ts | 22.9 KB | Secrets management |
| RuntimeSecurityService.ts | 16.7 KB | Runtime security |
| TimeLockService.ts | 22.6 KB | Time-locked crypto |

### Enterprise Monitoring & SIEM

**Workflow:** Platform event → CendiaPanopticon (observe) → SIEMIntegration (stream to Splunk/Sentinel/QRadar) → ShadowAIDetector (detect unauthorized AI) → Kafka (durable event stream) → ClickHouse/Druid (analytics)

| Service | Size | Description |
|---------|------|-------------|
| CendiaPanopticonService.ts | 49.7 KB | Full observability |
| SIEMIntegration.ts | 13.8 KB | SIEM (Splunk, Sentinel, QRadar, Elastic) |
| ShadowAIDetector.ts | 13.4 KB | Shadow AI detection |
| CendiaWatchService.ts | 76.2 KB | Platform monitoring |
| KafkaService.ts | 21.1 KB | Kafka event streaming |
| FlinkCEPService.ts | 15.3 KB | Complex event processing |
| ClickHouseService.ts | 12.3 KB | Analytics storage |

### SSO, Multi-Tenant & Licensing

**Workflow:** User → SSO (SAML/OIDC via Keycloak) → MFA challenge → TenantService (org isolation) → LicenseService (feature gating) → Authorized

| Service | Size | Description |
|---------|------|-------------|
| SSOService.ts | 17.3 KB | SSO (SAML, OIDC) |
| MFAService.ts | 12.8 KB | Multi-factor authentication |
| TenantService.ts | 17.8 KB | Multi-tenant isolation |
| LicenseService.ts | 16.7 KB | License validation |
| licensing.service.ts | 18.1 KB | License management |

---

## Strategic Tier ($1.5M+/yr)

> Everything in Enterprise, plus air-gapped, data diode, federated mesh, TPM, post-quantum, portable instances.

### Air-Gapped & Sovereign Deployment

**Workflow:** Offline install → TPM attests hardware → Data diode enforces one-way flow → QR bridge for evidence transfer → Portable instance for field deployment

```
Air-Gapped Install
  → TPMAttestationService (verify hardware identity)
  → PostQuantumKMSService (generate PQ keys: Dilithium, SPHINCS+)
  → SovereignModeService (validate: ONLINE_MODE=false, all local)
  → DataDiodeService (configure one-way data flow)
    → Evidence OUT only (via diode)
    → No data IN from external networks
  → PortableInstanceService (optional: create USB-deployable instance)
  → QRAirGapBridgeService (transfer evidence via QR codes across air gap)
```

| Service | Size | Description |
|---------|------|-------------|
| DataDiodeService.ts | 38.0 KB | Hardware data diode |
| QRAirGapBridgeService.ts | 25.1 KB | QR-code air-gap bridge |
| PortableInstanceService.ts | 25.0 KB | Portable offline instance |
| TPMAttestationService.ts | 24.0 KB | TPM hardware attestation |
| PostQuantumKMSService.ts | 19.6 KB | Post-quantum key management |

### Federated Mesh

**Workflow:** Central authority creates federation → Member orgs join with signed certificates → Shared policies pushed → Each member runs sovereign instance → Federated reports aggregated via secure transit

```
Federation Created
  → FederatedMeshService (create federation)
    → CendiaMeshService (mesh network topology)
    → GatewayFederationService (federated gateway)
  → Member Org Joins:
    → UnionService (union policies applied)
    → CendiaBridgeService (bridge to federation)
  → Operations:
    → CendiaTransitService (secure data transit between nodes)
    → Shared compliance reports aggregated
    → Each member retains sovereign control of their data
```

| Service | Size | Description |
|---------|------|-------------|
| FederatedMeshService.ts | 42.6 KB | Federated mesh governance |
| CendiaMeshService.ts | 43.7 KB | Mesh network orchestration |
| GatewayFederationService.ts | 20.4 KB | Gateway federation |
| CendiaTransitService.ts | 48.4 KB | Secure transit |
| CendiaBridgeService.ts | 23.3 KB | Bridge between environments |
| UnionService.ts | 24.6 KB | Policy union |

### Advanced Platform Services

**Workflow:** CendiaGuardian (security orchestration) → CendiaAegis (defense-grade protection) → CendiaCommand (operations center) → CendiaRegent (governance delegation) → CendiaVeto (emergency override)

| Service | Size | Description |
|---------|------|-------------|
| CendiaGuardianService.ts | 56.6 KB | Security orchestration |
| CendiaAegisService.ts | 60.0 KB | Defense-grade protection |
| CendiaCommandService.ts | 40.6 KB | Operations center |
| CendiaRegentService.ts | 34.1 KB | Governance delegation |
| CendiaGovernService.ts | 31.5 KB | Policy orchestration |
| CendiaVetoService.ts | 19.9 KB | Emergency override |

### Intelligence & Knowledge

**Workflow:** CendiaScout (threat intelligence) → CendiaInventum (discovery) → CendiaResonance (cross-decision patterns) → CendiaNexus (knowledge nexus) → CendiaOracle (predictions) → PantheonMemory (institutional memory)

| Service | Size | Description |
|---------|------|-------------|
| CendiaInventumService.ts | 48.3 KB | Discovery engine |
| CendiaScoutService.ts | 41.1 KB | Threat intelligence |
| CendiaResonanceService.ts | 46.5 KB | Pattern amplification |
| CendiaNexusService.ts | 34.5 KB | Knowledge nexus |
| CendiaOracleService.ts | 25.2 KB | Predictive intelligence |
| CendiaGraphService.ts | 29.6 KB | Relationship intelligence |
| PantheonMemoryService.ts | 23.7 KB | Institutional memory |

### Advanced Operations

**Workflow:** CendiaFactory (automated deployment) → CendiaHabitat (environment management) → CendiaNerve (real-time event system) → CendiaEternal (long-term preservation) → CendiaRewind (system time-travel)

| Service | Size | Description |
|---------|------|-------------|
| CendiaFactoryService.ts | 42.2 KB | Automated deployment |
| CendiaHabitatService.ts | 45.4 KB | Environment management |
| CendiaNerveService.ts | 44.4 KB | Real-time event system |
| CendiaEternalService.ts | 30.6 KB | Long-term preservation |
| CendiaRewindService.ts | 37.5 KB | System time-travel |
| CendiaRecallService.ts | 25.2 KB | Decision retrieval |
| DatabaseBackupService.ts | 20.8 KB | Enterprise backup |
| EnterpriseSchedulerService.ts | 31.4 KB | Job scheduling |

---

## Service Count Summary

| Tier | Unique Services | Cumulative | Key Additions |
|------|----------------|-----------|---------------|
| **Community** | ~180 | 180 | Gateway, Council, PII, Evidence, 18 Verticals |
| **Pilot** | +15 | 195 | Managed platform, full deliberation, analytics |
| **Foundation** | +40 | 235 | Compliance engines, ML PII, Echo/Gnosis, OmniTranslate |
| **Enterprise** | +70 | 305 | COLLAPSE, Shadow Council, SSO, SIEM, ZK, sovereign toggle |
| **Strategic** | +66 | 371 | Air-gapped, data diode, federated mesh, post-quantum |

---

## Sovereign Mode Quick Reference

| Environment Variable | Values | Default | Effect |
|---------------------|--------|---------|--------|
| `DATACENDIA_ONLINE_MODE` | `true` / `false` | `true` | Master toggle — `false` overrides all below |
| `DATACENDIA_CLOUD_AI` | `true` / `false` | `true` | Cloud AI providers (OpenAI, Anthropic) |
| `DATACENDIA_CLOUD_AI_FALLBACK` | `error` / `local` | `error` | What happens when cloud AI is invoked while disabled |
| `DATACENDIA_EXTERNAL_DATA` | `true` / `false` | `true` | External data feeds (FRED, etc.) |
| `DATACENDIA_EXTERNAL_NOTIFY` | `true` / `false` | `true` | External notifications (email, webhook, SIEM) |

**API:** `GET /api/v1/health/sovereign` — Returns current sovereign mode status.
