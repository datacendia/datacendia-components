# ADR 002: Sovereign Adapter Architecture

## Status
Accepted

## Date
2024-12-10

## Context
The platform initially planned 156 vendor-specific connectors for data sources (Bloomberg, Epic, SWIFT, etc.). Analysis revealed critical issues:

- **Licensing liability**: Bloomberg Terminal costs $24k/user/year, Refinitiv has redistribution restrictions
- **Compliance traps**: SWIFT CSP requirements, Epic BAA requirements
- **Hardware impossibilities**: ARINC 429, MIL-STD-1553 are physical avionics buses
- **Maintenance nightmare**: API changes across 156 endpoints

## Decision
Replace vendor-specific connectors with **5 Universal Adapters** plus **3 open protocols**:

### Universal Adapters
1. **FileWatcherAdapter** - For avionics/defense file exports (GRIB, CSV, JSON)
2. **WebhookIngestAdapter** - For SaaS/financial push events
3. **DatabaseAdapter** - For ERP/supply chain SQL polling
4. **ProtocolAdapters** - FHIR, FIX, MQTT only (open standards)
5. **SovereignAdapter** - Base class with risk tiers and evidence logging

### Risk Tier Classification
- **Tier 0 (PUBLIC)**: NOAA, Census, open data - no restrictions
- **Tier 1 (ENTERPRISE)**: Client-managed integrations
- **Tier 2 (REGULATED)**: Healthcare/Financial - BYO-keys required
- **Tier 3 (RESTRICTED)**: Defense, export-controlled - disabled by default

## Consequences

### Positive
- **Zero licensing exposure**: We don't redistribute proprietary data
- **Client responsibility**: "We provide the socket; client brings the plug"
- **Maintainable**: 5 adapters vs 156 connectors
- **Honest marketing**: "Compatible via standard adapters"

### Negative
- **More client work**: Customers configure their own connections
- **Less turnkey**: Not plug-and-play for specific vendors
- **Documentation burden**: Must explain adapter patterns

### Implementation
- Adapters live in `backend/src/adapters/sovereign/`
- Each adapter extends `SovereignAdapter` base class
- Evidence logging for audit trails
- Risk tier enforcement at runtime

## References
- [Sovereign Adapter Implementation](../../backend/src/adapters/sovereign/)
- [Adapter Routes](../../backend/src/routes/adapters.ts)
