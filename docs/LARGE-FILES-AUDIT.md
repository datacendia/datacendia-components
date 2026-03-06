# Large File Audit

> Generated 2026-03-06 by `scripts/audit-large-files.cjs`
> Threshold: 50 KB

## Summary: 30 files over 50 KB

| Size | Lines | File | Suggested Action |
|------|-------|------|-----------------|
| 99 KB | 2,689 | `services\CendiaCrucibleService.ts` | Split into sub-modules |
| 82 KB | 1,924 | `services\verticals\industrial-services\IndustrialServicesVertical.ts` | Split into sub-modules |
| 78 KB | 1,966 | `routes\council.ts` | Consider splitting |
| 76 KB | 2,025 | `services\CendiaApotheosisService.ts` | Consider splitting |
| 76 KB | 1,586 | `services\core\CendiaWatchService.ts` | Consider splitting |
| 72 KB | 1,928 | `services\CendiaHorizonService.ts` | Consider splitting |
| 62 KB | 251 | `config\models\vertical-mappings.ts` | Consider splitting |
| 62 KB | 1,613 | `services\document\PDFGeneratorService.ts` | Consider splitting |
| 60 KB | 1,708 | `services\CendiaAegisService.ts` | Monitor |
| 60 KB | 1,434 | `services\verticals\manufacturing\ManufacturingVertical.ts` | Monitor |
| 58 KB | 1,399 | `services\verticals\agriculture\AgricultureVertical.ts` | Monitor |
| 58 KB | 1,399 | `services\verticals\construction\ConstructionVertical.ts` | Monitor |
| 58 KB | 1,399 | `services\verticals\hospitality\HospitalityVertical.ts` | Monitor |
| 58 KB | 1,399 | `services\verticals\pharmaceutical\PharmaceuticalVertical.ts` | Monitor |
| 58 KB | 1,399 | `services\verticals\professional\ProfessionalVertical.ts` | Monitor |
| 58 KB | 1,399 | `services\verticals\transportation\TransportationVertical.ts` | Monitor |
| 57 KB | 1,646 | `services\enterprise\CendiaGuardianService.ts` | Monitor |
| 57 KB | 1,399 | `services\verticals\aerospace\AerospaceVertical.ts` | Monitor |
| 57 KB | 1,399 | `services\verticals\automotive\AutomotiveVertical.ts` | Monitor |
| 57 KB | 1,399 | `services\verticals\financial\FinancialVertical.ts` | Monitor |
| 57 KB | 1,399 | `services\verticals\media\MediaVertical.ts` | Monitor |
| 57 KB | 1,399 | `services\verticals\nonprofit\NonprofitVertical.ts` | Monitor |
| 57 KB | 1,399 | `services\verticals\retail\RetailVertical.ts` | Monitor |
| 57 KB | 1,399 | `services\verticals\telecom\TelecomVertical.ts` | Monitor |
| 56 KB | 1,463 | `services\evidence\RegulatorsReceiptService.ts` | Monitor |
| 53 KB | 1,753 | `services\compliance\frameworks.ts` | Monitor |
| 53 KB | 1,436 | `__tests__\integration\tier1-services.integration.test.ts` | Monitor |
| 52 KB | 1,376 | `adapters\ClientHostedAdapter.ts` | Monitor |
| 52 KB | 1,442 | `services\verticals\energy\EnergyVertical.ts` | Monitor |
| 52 KB | 1,408 | `services\verticals\healthcare\HealthcareVertical.ts` | Monitor |

## Splitting Guidelines

- Extract logical sub-modules (e.g., `CrucibleService.ts` → `CrucibleSimulation.ts` + `CrucibleScoring.ts`)
- Move type definitions to separate `types.ts` files
- Extract constants/config to dedicated files
- Keep the main service file as a facade that imports sub-modules

---
*Run quarterly to track file size trends.*
