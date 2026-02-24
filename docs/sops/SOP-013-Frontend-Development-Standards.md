# SOP-013: Frontend Development Standards

**Category:** Development
**Priority:** Medium
**Owner:** Frontend Lead
**Last Verified:** 2026-02-22 (against `vite.config.ts`, `tsconfig.json`, `src/` structure)

---

## 1. Purpose

Define frontend development standards, conventions, and tooling for the Datacendia Cortex React/TypeScript application.

---

## 2. Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18+ | UI framework |
| TypeScript | 5+ | Type safety |
| Vite | 5+ | Build tool and dev server |
| React Router | 6+ | Client-side routing |
| Tailwind CSS | 3+ | Utility-first styling |
| Lucide React | Latest | Icon library |
| Radix UI | Latest | Accessible component primitives |
| Recharts / D3 | Latest | Data visualization |
| i18next | Latest | Internationalization (26 languages) |
| Socket.IO | Latest | Real-time WebSocket communication |

---

## 3. Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── auth/          # ProtectedRoute, login forms
│   ├── brand/         # Logo, brand elements
│   ├── cortex/        # Cortex-specific components
│   ├── council/       # AI Council UI
│   ├── dashboard/     # Dashboard widgets
│   ├── demo/          # Demo mode components
│   ├── dev/           # Developer tools (TechTeamPanel)
│   ├── navigation/    # Breadcrumbs, loaders
│   ├── notifications/ # NotificationBell
│   └── ui/            # Base UI primitives (buttons, inputs, tooltips)
├── contexts/          # React contexts (Auth, DemoMode, Language, VerticalConfig)
├── data/              # Static data files
├── layouts/           # Page layouts (CortexLayout, MarketingLayout)
├── lib/               # Utilities, API client, i18n
├── pages/             # Page components organized by domain
│   ├── admin/
│   ├── auth/
│   ├── cortex/        # Main application pages
│   │   ├── compliance/
│   │   ├── council/
│   │   ├── dcii/
│   │   ├── enterprise/
│   │   ├── sovereign/
│   │   └── ...
│   ├── marketing/     # Landing, Manifesto, Sovereign Landing
│   ├── pricing/
│   └── public/        # Product, About, Contact, etc.
├── routes/            # Route definitions (domain-based)
│   ├── public.routes.tsx
│   ├── auth.routes.tsx
│   ├── cortex/        # Core, intelligence, enterprise, sovereign, platform routes
│   └── admin.routes.tsx
├── services/          # Frontend services (AutoHealService)
├── stores/            # State stores
└── routes.lazy.tsx    # Main router composition
```

---

## 4. Coding Standards

### 4.1 TypeScript
- **Zero errors required:** `npx tsc --noEmit` must pass before any commit
- Use strict TypeScript — no `any` unless absolutely necessary (document why)
- Define interfaces for all API response types
- Use `type` for unions/intersections, `interface` for object shapes

### 4.2 React Components
- Functional components only (no class components)
- Use `React.FC` type annotation
- Use hooks for state and effects
- Lazy-load page components: `const Page = lazy(() => import('./Page'))`
- Wrap lazy components in `SuspenseWrapper`

### 4.3 Styling
- Tailwind CSS utility classes (primary)
- `cn()` utility for conditional classes (from `lib/utils`)
- CSS variables for brand colors (`--color-gold: #C9A227`)
- Dark mode support via Tailwind `dark:` prefix
- Sovereign theme: dark backgrounds with gold accents

### 4.4 Routing
- Routes organized by domain in `src/routes/` (9 route files)
- Public routes: no auth required, `MarketingLayout` or none
- Cortex routes: inside `CortexLayout`, auth required
- Admin routes: admin role required
- Always use `lazy()` for page components

### 4.5 Internationalization
- All user-facing text should use `t()` translation function
- Translation keys in `src/lib/i18n/`
- 26 languages supported
- `LanguageProvider` and `useLanguage()` hook

---

## 5. Code Quality Checklist

- [ ] TypeScript compiles with 0 errors
- [ ] No unused imports
- [ ] No `console.log` in production code (use structured logging)
- [ ] Components are properly typed
- [ ] API calls use the centralized `client.ts`
- [ ] Error states are handled (loading, error, empty)
- [ ] Accessible (keyboard navigation, ARIA labels)
- [ ] Responsive design (mobile-friendly)
- [ ] Optional chaining (`?.`) on API response data to prevent crashes

---

## 6. Build & Bundle

### 6.1 Development
```bash
npm run dev  # Vite dev server on port 5173
```

### 6.2 Production Build
```bash
npm run build
```

### 6.3 Code Splitting
Vite config (`vite.config.ts`) splits chunks:
| Chunk | Contents |
|-------|----------|
| `react-vendor` | React, React DOM, React Router |
| `cytoscape` | Graph visualization |
| `lucide` | Icon library |
| `mui-vendor` | MUI components |
| `radix-vendor` | Radix UI primitives |
| `chart-vendor` | Recharts, D3 |
| `socket-vendor` | Socket.IO |
| `i18n-vendor` | i18next |
| `markdown-vendor` | React Markdown, PrismJS |

---

## 7. Verified Against

- `vite.config.ts`: Proxy, chunk splitting, build config
- `src/routes.lazy.tsx`: Router composition from 9 domain modules
- `src/App.tsx`: Provider hierarchy (ErrorBoundary → I18n → Auth → VerticalConfig → DemoMode → Toast)
- `src/layouts/CortexLayout.tsx`: 1730-line authenticated layout
- `src/layouts/MarketingLayout.tsx`: Marketing/public layout

---

*Datacendia, LLC — Proprietary and Confidential*
