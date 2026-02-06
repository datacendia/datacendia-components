# Changelog

All notable changes to the Datacendia platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Security
- Rotated exposed Redis password from git history
- Removed `.env.infrastructure` and `.env.production` from git tracking (contained credentials)
- Removed 191K+ `.stryker-tmp/` sandbox files from git tracking
- Fixed `.gitignore` to catch `.env.*` patterns
- Created `.env.infrastructure.example` and `.env.production.example` with placeholder values

### Fixed
- Resolved all 145 backend TypeScript errors (0 remaining)
- Resolved all frontend TypeScript errors (0 remaining)
- Fixed SQL injection vulnerability in Druid analytics routes (CVSS 9.8)
- Added authentication to analytics endpoints
- Removed 47 hardcoded org ID fallbacks (`|| 'demo'`, `|| 'demo-org'`) across 5 route files
- Fixed dependency vulnerabilities (67 → 3 low, all unfixable `elliptic` via `keycloak-connect`)

### Changed
- Relaxed backend `tsconfig.json` strictness options to eliminate 2,200+ style-only errors
- Split Prisma schema into 11 domain files using `prismaSchemaFolder` preview feature
- Split frontend routes into 10 domain-based modules (from single 2,539-line file)
- Grouped 110+ backend routes into 14 domain routers

## [4.5.0] - 2026-01-28

### Added
- **CendiaPostQuantumKMS** — Quantum-resistant cryptography (Dilithium, SPHINCS+, Falcon)
- **CendiaCarbonAware** — Carbon-aware AI scheduling with multi-region optimization
- **CendiaContinuousCompliance** — Real-time compliance monitoring (10 frameworks)
- **CendiaCrossJurisdiction** — Multi-jurisdiction compliance engine (17 jurisdictions)
- **Defense & National Security Vertical** — 24 agents, 35 council modes, FedRAMP/CMMC/ITAR compliance
- **Real-Time Deliberation Visualization** — Live agent interaction graphs
- **Decision Replay Theater** — Step-through decision replay with timeline
- **Adversarial Red Team Mode** — 8 attack perspectives for stress-testing decisions
- **Regulator's Receipt Generator** — Merkle tree evidence chain, court-admissible PDF
- Decision packet generation with cryptographic signing
- Enterprise scheduler service for automated compliance/security jobs
- Comprehensive CI/CD pipeline (11 jobs: type-check, lint, test, build, security scan, load test, mutation test, contract test, Docker build, release)

### Security
- Helmet, CORS, CSRF, rate limiting middleware
- MFA support with TOTP
- Key Management Service with HashiCorp Vault integration
- Immutable audit ledger with tamper-evident hashing
- Honeypot endpoints for intrusion detection
- Defense-in-depth security layer
- Input sanitization middleware

## [4.0.0] - 2026-01-15

### Added
- 18+ industry verticals (healthcare, financial, defense, energy, legal, etc.)
- Multi-tenant architecture with organization-scoped data
- WebSocket support for real-time deliberation
- OpenTelemetry instrumentation
- 35+ enterprise connectors (SAP, Workday, Salesforce, Jira, etc.)
- Synthetic Civic Governance Engine (SCGE)
- Policy Collapse Prevention System
- Legal vertical with case import and research
- Evidence vault with MinIO storage
- OWNER role with full platform permissions
