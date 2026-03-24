# Datacendia Platform - Folder Structure

## Overview

This document provides a comprehensive guide to the Datacendia codebase organization for developers, auditors, and technical stakeholders.

---

## Root Structure

```
datacendia-components/
├── backend/               # Node.js/Express API server
├── docs/                  # Documentation (you are here)
├── lib/                   # Shared utilities
├── prisma/                # Database schema & migrations
├── public/                # Static assets
├── src/                   # React frontend application
├── .env.example           # Environment variable template
├── package.json           # Frontend dependencies
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite build configuration
└── tailwind.config.js     # Tailwind CSS configuration
```

---

## Frontend (`/src`)

### Core Application

```
src/
├── App.tsx                # Root component
├── main.tsx               # Application entry point
├── routes.tsx             # Route definitions (eager)
├── routes.lazy.tsx        # Route definitions (lazy-loaded)
└── index.css              # Global styles
```

### Pages (`/src/pages`)

```
src/pages/
├── public/                # Public-facing pages (no auth required)
│   ├── HomePage.tsx                        # Landing page
│   ├── HonestyMatricesPage.tsx             # Transparency matrices
│   ├── SovereignEnterpriseIntelligencePage.tsx  # SEI category page
│   └── ...
│
├── marketing/             # Marketing & sales pages
│   ├── LandingPage.tsx                     # Marketing landing
│   └── PricingPage.tsx                     # Pricing information
│
├── auth/                  # Authentication pages
│   ├── LoginPage.tsx                       # Login form
│   ├── RegisterPage.tsx                    # Registration
│   └── ForgotPasswordPage.tsx              # Password reset
│
├── cortex/                # Main application (authenticated)
│   ├── DashboardPage.tsx                   # Main dashboard
│   ├── council/                            # The Council™
│   │   ├── CouncilPage.tsx                 # Multi-agent deliberation
│   │   └── DeliberationPage.tsx            # Individual deliberation view
│   ├── intelligence/                       # Decision Intelligence
│   │   ├── ChronosPage.tsx                 # CendiaChronos™ time machine
│   │   ├── CruciblePage.tsx                # Scenario simulation
│   │   └── WitnessPage.tsx                 # CendiaWitness™ audit
│   ├── graph/                              # Knowledge Graph
│   │   └── GraphExplorerPage.tsx           # Entity/relationship explorer
│   ├── enterprise/                         # Enterprise features
│   │   ├── ApotheosisPage.tsx              # Self-improvement engine
│   │   └── DissentPage.tsx                 # Formal dissent system
│   └── ...
│
├── sovereign/             # Sovereignty features
│   ├── CruciblePage.tsx                    # Stress testing
│   └── SentryPage.tsx                      # AI behavior monitoring
│
├── pillars/               # The 8 Pillars (feature categories)
│   ├── DecisionIntelligencePage.tsx
│   ├── DataUnificationPage.tsx
│   └── ...
│
├── admin/                 # Administration
│   ├── UsersPage.tsx                       # User management
│   ├── DataSourcesPage.tsx                 # Data connections
│   └── SettingsPage.tsx                    # System settings
│
└── legal/                 # Legal pages
    ├── PrivacyPolicyPage.tsx              # Privacy policy
    ├── TermsPage.tsx                      # Terms of service
    ├── SubprocessorsPage.tsx              # Subprocessor list
    ├── FAQPage.tsx                        # Customer FAQ
    └── AIDisclosurePage.tsx               # AI use disclosure
```

### Components (`/src/components`)

```
src/components/
├── layout/                # Layout components
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── Footer.tsx
│
├── common/                # Shared UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   ├── CookieConsent.tsx                  # GDPR cookie consent banner
│   └── ...
│
├── agents/                # AI Agent components
│   ├── AgentCard.tsx
│   ├── ModelSwitcher.tsx
│   └── ...
│
├── premium/               # Premium feature components
│   └── PremiumFeaturesModal.tsx
│
└── charts/                # Data visualization
    └── ...
```

### Libraries & Services (`/src/lib`)

```
src/lib/
├── api.ts                 # API client
├── utils.ts               # Utility functions
├── ollama/                # Ollama AI service integration
│   └── index.ts
├── agents/                # Agent configuration
│   └── modelSwitching.ts
└── ...
```

### State & Context (`/src/contexts`)

```
src/contexts/
├── AuthContext.tsx        # Authentication state
├── LanguageContext.tsx    # i18n/localization
└── ThemeContext.tsx       # Theme preferences
```

### Hooks (`/src/hooks`)

```
src/hooks/
├── useAuth.ts             # Authentication hook
├── usePremiumFeatures.ts  # Premium feature access
└── ...
```

### Data & Configuration (`/src/data`)

```
src/data/
├── councilModes.ts        # Council mode definitions
├── agents.ts              # Agent configurations
└── ...
```

### Internationalization (`/src/i18n`)

```
src/i18n/
├── index.ts               # i18n setup
└── locales/               # Translation files
    ├── en.ts              # English
    ├── es.ts              # Spanish
    ├── de.ts              # German
    ├── fr.ts              # French
    ├── ja.ts              # Japanese
    ├── zh.ts              # Chinese
    └── ... (20+ languages)
```

---

## Backend (`/backend`)

### Core Structure

```
backend/
├── src/
│   ├── index.ts           # Server entry point
│   ├── app.ts             # Express app configuration
│   └── ...
├── package.json           # Backend dependencies
├── tsconfig.json          # TypeScript config
└── Dockerfile             # Container build
```

### Routes (`/backend/src/routes`)

```
backend/src/routes/
├── auth.ts                # Authentication endpoints
├── council.ts             # Council/deliberation API
├── decision-intel.ts      # Decision intelligence API
├── chronos.ts             # Chronos time-travel API
├── graph.ts               # Knowledge graph API
├── apotheosis.ts          # Apotheosis self-improvement
├── dissent.ts             # Dissent filing system
├── omnitranslate.ts       # Translation service
├── models.ts              # Model management
└── ...
```

### Services (`/backend/src/services`)

```
backend/src/services/
├── ollama.ts              # Ollama AI integration
├── CendiaApotheosisService.ts    # Self-improvement engine
├── CendiaDissentService.ts       # Dissent management
├── CendiaOmniTranslateService.ts # Translation service
├── ChronosService.ts             # Time-travel logic
└── ...
```

### Configuration (`/backend/src/config`)

```
backend/src/config/
├── modelZoo.ts            # AI model configurations
├── aiModels.ts            # Model definitions
├── models.ts              # General model config
├── tenantDatabase.ts      # Multi-tenant DB config
└── ...
```

### Adapters (`/backend/src/adapters`)

```
backend/src/adapters/
├── DataAdapter.ts         # Base adapter interface
├── ClientHostedAdapter.ts # Client database connections
├── AdapterManager.ts      # Adapter routing
└── ...
```

### Middleware (`/backend/src/middleware`)

```
backend/src/middleware/
├── auth.ts                # Authentication middleware
├── rateLimiter.ts         # Rate limiting
├── audit.ts               # Audit logging
└── ...
```

---

## Database (`/prisma`)

```
prisma/
├── schema.prisma          # Database schema definition
├── migrations/            # Database migrations
│   └── ...
└── seed.ts                # Seed data
```

### Key Tables

| Table | Purpose |
|-------|---------|
| `users` | User accounts |
| `organizations` | Multi-tenant organizations |
| `deliberations` | Council deliberation records |
| `decisions` | Decision audit trail |
| `witnesses` | CendiaWitness evidence records |
| `dissents` | Formal dissent filings |
| `omnitranslate_*` | Translation memory & glossaries |

---

## Documentation (`/docs`)

```
docs/
├── INVESTOR_OVERVIEW.md   # Investor-safe summary
├── FOLDER_STRUCTURE.md    # This document
├── DATACENDIA_BIBLE.md    # Product philosophy
├── PRODUCTION_READINESS.md # Deployment checklist
├── ENTERPRISE_READINESS.md # Enterprise features
├── diagrams/              # Architecture diagrams
│   ├── 01-ARCHITECTURE.md
│   ├── 02-COUNCIL-DELIBERATION.md
│   └── ...
├── council/               # Council documentation
│   └── council-modes-*.md
└── sales/                 # Sales materials
    └── ...
```

---

## Key Patterns

### Lazy Loading

Large pages are lazy-loaded via `routes.lazy.tsx` to improve initial bundle size:

```typescript
const ChronosPage = lazy(() => import('./pages/cortex/intelligence/ChronosPage'));
```

### Multi-Tenant Architecture

- Organizations are isolated at the database level
- Tenant context flows through middleware
- Data adapters support client-hosted databases

### AI Model Selection

- Models are selected per-agent via `modelZoo.ts`
- Fallback chains ensure reliability
- Sovereignty meta-prompt is injected into all agent interactions

### Internationalization

- 20+ languages supported
- RTL support for Arabic, Hebrew, etc.
- Translation keys follow `section.subsection.key` pattern

---

## Environment Variables

Key environment variables (see `.env.example` for full list):

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection |
| `OLLAMA_HOST` | Ollama API endpoint |
| `JWT_SECRET` | Authentication secret |
| `OMNITRANSLATE_MODEL` | Translation model |

---

## Getting Started

```bash
# Install dependencies
npm install
cd backend && npm install

# Set up database
npx prisma migrate dev

# Start development
npm run dev              # Frontend (Vite)
cd backend && npm run dev # Backend (Express)
```

---

*Last updated: Document generated automatically*
