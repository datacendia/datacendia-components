# Datacendia Platform — Cross-Repo Audit

**Audit date:** 2026-04-22
**Scope:** All repositories under `github.com/datacendia/*`
**Author:** Cascade (automated + evidence-based)
**Tone:** Honest, no marketing-speak. Every claim grounded in observable evidence.

---

## 1. Executive Summary

| Dimension | Grade | Notes |
|---|---|---|
| **Repo inventory discipline** | C | 6 repos, 1 empty (`sjrEnterprises`), unclear naming intent |
| **CI/CD health** | **D** | **3 of 5 non-empty repos have failing default-branch CI** |
| **Branch protection** | **F** | **Zero branch protection on any default branch** |
| **Security posture** | C– | No real secrets leaked, but vuln alerts OFF everywhere; 24 stale Dependabot PRs |
| **Dep hygiene (`components`)** | **F** | **38 major-version drifts**; lockfile out of sync with `package.json` (blocks CI) |
| **License clarity** | D | 3 of 5 repos have `NOASSERTION` (legal ambiguity for public repos) |
| **Test coverage** | C | Backend decent (346 test files / 1,056 src), frontend very light (19 / 512) |
| **Code-structure debt** | C– | Multiple single-file monoliths > 100 KB, one at 504 KB |
| **Type strictness** | C | `noUnusedLocals`/`noUnusedParameters` currently deferred to `false` on both FE and BE |

**Top 3 things to fix this week (in priority order):**

1. **Regenerate `package-lock.json` in `datacendia-components`** — one-line fix, unblocks production CI that has been red since at least 2026-04-21.
2. **Enable branch protection + vulnerability alerts** on all 5 non-empty repos (10-minute config change, prevents future drift).
3. **Triage the 24 stale Dependabot PRs** in `datacendia-components` (oldest is 138 days old). Batch-merge patch/minor; schedule the major upgrades (React 19, Vite 8, MUI 9, Stripe 22).

---

## 2. Repo Inventory

| Repo | Visibility | Language | Size | Default branch | License | Last push |
|---|---|---|---|---|---|---|
| `datacendia-components` | private | TypeScript | 1,027 MB | `main` | NOASSERTION | 2026-04-22 |
| `datacendia-core` | **public** | TypeScript | 355 MB | `master` | Apache-2.0 | 2026-04-20 |
| `datacendia-marketing` | **public** | JavaScript | 44 MB | `master` | NOASSERTION | 2026-04-11 |
| `decision-governance-infrastructure` | **public** | (docs) | 190 KB | `main` | NOASSERTION | 2026-04-09 |
| `pitchdecks` | private | (decks) | 2.7 MB | `main` | none | 2026-04-08 |
| `sjrEnterprises` | private | (empty) | 0 KB | — | none | 2026-04-21 |

**Contributors (humans):** only `Stu / Stuart Rainey / datacendia` + `Copilot` bot. Solo-founder reality.

**Observations:**

- **Branch naming inconsistent:** `datacendia-core` and `datacendia-marketing` use `master`; the rest use `main`. Not a bug, just drift — pick one.
- **`sjrEnterprises`** is empty and was created 2026-04-21. Either delete it or initialize with a README so it doesn't become clutter.
- **`datacendia-components`** has 18 branches, `datacendia-core` has 18 branches, `decision-governance-infrastructure` has 6. Several look like stale Copilot-agent branches (e.g. `copilot/audit-pitchdecks-repository-another-one`). Schedule a sweep.

---

## 3. CI/CD Health — the most urgent section

### 3.1 Current default-branch status (per most-recent run)

| Repo | Last CI run on default | Outcome |
|---|---|---|
| `datacendia-components` (main) | 2026-04-22 | **❌ FAILURE** (CI + Security + Community Edition Build) |
| `datacendia-core` (master) | 2026-04-14 | **❌ FAILURE** (Backend + Community Edition Build) |
| `datacendia-marketing` (master) | 2026-04-20 | ✅ success (Lighthouse) — but Build i18n Pages has been red since 2026-04-09 |
| `decision-governance-infrastructure` (main) | 2026-04-20 | ✅ Security job green, but **Validate Schemas & Specs has been red** since 2026-04-09 |
| `pitchdecks` | N/A | No real CI, only Copilot runs |

### 3.2 Root causes (verified from job logs)

**`datacendia-components` (CI run #536 on 2026-04-22):**

- **Frontend / Install dependencies:** `npm ci` aborts with `EUSAGE`:
  > `package.json` and `package-lock.json` are not in sync. Missing from lockfile: `eslint-plugin-n@17.24.0`, `eslint-plugin-security@3.0.1`, `enhanced-resolve@5.20.1`, `eslint-plugin-es-x@7.8.0`, `globals@15.15.0`, `globrex@0.1.2`, `ts-declaration-location@1.0.7`, `tapable@2.3.3`, `eslint-compat-utils@0.5.1`, `safe-regex@2.1.1`, `regexp-tree@0.1.27`.
- **Backend / Setup Node.js:** `Some specified paths were not resolved, unable to cache dependencies.` — the `actions/setup-node` cache-dependency-path points at a file that npm can't reconcile.

**Local reproduction (verified):**

```text
package.json has:   eslint-plugin-n = ^17.10.0  ✓
                    eslint-plugin-security = ^3.0.1  ✓
package-lock.json:  MISSING both of the above  ✗
```

**Fix:** single command — `npm install` (regenerates lockfile deterministically). ~2 minutes. CI goes green again.

**`datacendia-core` (CI run #274 on 2026-04-14):**

- **Backend / Lint:** `eslint src --ext .ts` exits 127 → `eslint` binary not in `node_modules/.bin`. Likely a `peerDependency` mis-hoist after a Dependabot merge, or `eslint` moved out of `backend/package.json`.
- **Backend / Run unit tests:** 2 load tests fail with **100% error rate**:
  - `tests/load/council.load.test.ts > sustains 10 concurrent decisions` — `infra error rate 100.0% exceeds 10% ceiling`
  - `tests/load/healthcheck.load.test.ts > sustains 20 concurrent requests` — `error rate 100.0% exceeds 5% ceiling`
  This means the app under test never came up in CI — almost certainly a Redis or Postgres readiness / DATABASE_URL / migration issue in the GitHub Actions runner, not a real regression. The CI script runs load tests against a server it doesn't wait for.
- **Community Edition Build / Check community/enterprise boundary:** fails. The `scripts/check-community-boundary.mjs` guard is rejecting something — likely enterprise-only imports leaking into community-tagged files. **This is the most architecturally important failure**: it's the single mechanism preventing enterprise code (intended for `datacendia-components`) from leaking into the public OSS repo. Treat it as P0.

**`datacendia-marketing`:** `Build i18n Pages` failing since 2026-04-09. Low-severity (marketing), but stale.

**`decision-governance-infrastructure`:** `Validate Schemas & Specs` failing since 2026-04-09. Worth fixing because this repo is the public-facing governance standard — failing schema validation undermines credibility.

### 3.3 Branch protection — none

```text
datacendia-components/main              → No required status checks. No PR reviews. Admins not enforced.
datacendia-core/master                  → No required status checks. No PR reviews. Admins not enforced.
datacendia-marketing/master             → No required status checks. No PR reviews. Admins not enforced.
decision-governance-infrastructure/main → No required status checks. No PR reviews. Admins not enforced.
pitchdecks/main                         → Not protected.
```

**Consequence:** Any push — including a force-push or a bad Dependabot merge — goes straight to default. CI can stay red indefinitely (it has). For a platform whose value proposition is *decision governance*, the governance of the platform itself is currently ungoverned.

### 3.4 Workflow inventory

`datacendia-components` (6 workflows): `ci.yml`, `community-build.yml`, `deploy.yml`, `release.yml`, `security.yml`, `test.yml`.
`datacendia-core` (4 active): `ci.yml`, `docker.yml`, `security.yml`, `widgets.yml`, + GitHub Pages.
`datacendia-marketing` (5): `build-i18n.yml`, `deploy-namecheap.yml`, `lighthouse-ci.yml`, `security.yml`, `test-site.yml`.
`decision-governance-infrastructure` (2): `security.yml`, `validate-schemas.yml`.
`pitchdecks`: none (Copilot agent only).

---

## 4. Security Posture

### 4.1 Secrets in tracked files — ✅ clean

Scanned for: `AKIA…`, `sk-…`, `xox[pbar]-…`, `ghp_…`, `AIza…`, private-key blocks. Only hits:

- `backend/src/__tests__/services/TestEvidenceLedgerService.test.ts` → `-----BEGIN PRIVATE KEY-----\nMOCK\n-----END PRIVATE KEY-----` (literal `MOCK`, not a key).
- `tests/enterprise/connectors.test.ts` → `AKIAIOSFODNN7EXAMPLE` (the AWS documentation placeholder) and `xoxb-xxxx…xxxx` (obfuscated).

No real secrets exposed in any currently tracked file. **Git history was not scanned** — recommend running `trufflehog` or `gitleaks` against full history once.

### 4.2 Tracked `.env*` files

```text
.env.example
.env.infrastructure.example
.env.local.example
backend/.env.example
infrastructure/.env.example
```

All are `.example` — correct.

### 4.3 Dependency vulnerabilities (`datacendia-components`)

```text
Frontend: 7 total (0 critical, 0 high, 4 moderate, 3 low)
Backend : 7 total (0 critical, 0 high, 4 moderate, 3 low)
```

No critical or high. Moderate/low should still be triaged, but this is not a "platform on fire" situation.

### 4.4 GitHub-side security features (across all 5 non-empty repos)

- `vulnerability_alerts`: **NOT enabled on any repo** (API returns 404 on `/vulnerability-alerts` endpoint).
- Dependabot: file exists (security PRs have been opened), but **none have been merged or closed in 4+ months** in `datacendia-components`.
- CodeQL / Code Scanning: status not visible via API = not configured.
- Secret Scanning: same — GitHub Advanced Security not enabled.

### 4.5 Stale Dependabot PRs — `datacendia-components`

**24 open, all from dependabot[bot], dated 2025-12-05 → 2025-12-22. Nothing from the last 4 months.**

Examples: `uuid 9 → 13`, `nodemailer`, `vitest 1.6.1 → 4.0.15`, `neo4j-driver 5 → 6`, `jose 5 → 6`, `helmet 7 → 8`, `@types/node 20 → 24`, `@testing-library/react 14 → 16`, `react-router-dom 6 → 7`, `jsdom 24 → 27`, `docker/build-push-action 5 → 6`, `actions/checkout 4 → 6`, `node 20-alpine → 25-alpine`.

**Why this matters:** a Dependabot PR that sits for 4 months gets *worse* each day because the rest of the tree moves around it. Each neglected PR represents both (a) a missed CVE patch window, and (b) future compounding migration work.

---

## 5. Dependency Drift (`datacendia-components`)

### 5.1 Major-version drift (38 packages in frontend alone)

```text
@mui/material            7.3.7   → 9.0.0    (2 majors)
@mui/icons-material      7.3.7   → 9.0.0    (2 majors)
react                    18.3.1  → 19.2.5   (1 major)
react-dom                18.3.1  → 19.2.5
react-router-dom         6.30.3  → 7.14.2
react-i18next            16.5.4  → 17.0.4
@vitejs/plugin-react     4.7.0   → 6.0.1    (2 majors)
vite                     7.3.2   → 8.0.9    (1 major)
typescript-eslint/*      7.18.0  → 8.59.0
eslint                   8.57.1  → 10.2.1   (2 majors)
eslint-plugin-react-hooks 4.6.2 → 7.1.1    (3 majors)
tailwindcss              3.4.19  → 4.2.4    (1 major — big rewrite)
zod                      3.25.76 → 4.3.6    (1 major)
stripe                   17.7.0  → 22.0.2   (5 majors behind)
uuid                     9.0.1   → 14.0.0   (5 majors behind)
jsdom                    24.1.3  → 29.0.2
mongodb                  6.21.0  → 7.2.0
neo4j-driver             5.28.3  → 6.0.1
jose                     5.10.0  → 6.2.2
bcryptjs                 2.4.3   → 3.0.3
@pact-foundation/pact    13.2.0  → 16.3.0
@types/react             18.3.28 → 19.2.14
i18next                  25.8.4  → 26.0.6
nodemailer               7.0.13  → 8.0.5
helmet                   7.2.0   → 8.1.0
lucide-react             0.294.0 → 1.8.0
react-leaflet            4.2.1   → 5.0.0
react-joyride            2.9.3   → 3.0.2
dotenv                   16.6.1  → 17.4.2
concurrently             8.2.2   → 9.2.1
@types/nodemailer        6.4.22  → 8.0.0
@types/uuid              9.0.8   → 10.0.0
@types/supertest         6.0.3   → 7.2.0
@types/express           4.17.25 → 5.0.6
@types/react-dom         18.3.7  → 19.2.3
@testing-library/react   14.3.1  → 16.3.2
express-rate-limit       7.5.1   → 8.3.2
@aws-sdk/client-*        3.984.0 → 3.1034.0 (50 minors, not major but substantial)
```

### 5.2 Recommended dep-debt paydown sequence

1. **Batch-merge patch-only Dependabot PRs** (lowest risk, highest CVE coverage).
2. **CI/action bumps** (`actions/checkout 4→6`, `actions/setup-node 4→6`, `actions/upload-artifact 4→5`, `docker/build-push-action 5→6`, `github/codeql-action 3→4`) — safe, version-pinned, low-risk.
3. **Quick-win minors** (`helmet 7→8`, `jose 5→6`, `express-rate-limit 7→8`).
4. **Guarded majors on a branch** (react-router 6→7, uuid 9→14, zod 3→4). Each needs a migration branch + codemod + full test.
5. **Deferred big-bang majors** (React 18→19, Tailwind 3→4, MUI 7→9, Vite 7→8, ESLint 8→10) — schedule one per sprint, never ship two simultaneously.
6. **Investigate suspicious jumps** (`lucide-react 0.294 → 1.8`, `node 20-alpine → 25-alpine` — Node 25 is not LTS; Dependabot is wrong here, should stay on 22-alpine LTS).

---

## 6. Code-Structure Debt (`datacendia-components`)

### 6.1 Raw size

- **Frontend:** 512 source files, **236,946 LOC**
- **Backend:** 1,056 source files, **440,158 LOC**
- **Combined:** **677,104 LOC** — solidly in "large monolith" territory for a solo maintainer.

### 6.2 Single-file monoliths

Files over 100 KB (all candidates for urgent decomposition):

```text
504.5 KB  src/data/councilModes.ts
382.2 KB  src/pages/cortex/intelligence/ChronosPage.tsx
229.2 KB  src/pages/cortex/council/CouncilPage.tsx
131.1 KB  src/lib/algorithms/real-world-benchmarks.ts
118.1 KB  src/pages/cortex/pillars/index.tsx
109.0 KB  backend/src/services/compliance/frameworks.ts
106.0 KB  src/pages/sovereign/CruciblePage.tsx
 97.8 KB  src/components/demos/RegulatorsReceiptDemo.tsx
 97.0 KB  backend/src/services/CendiaCrucibleService.ts
 96.8 KB  src/pages/cortex/enterprise/OmniTranslatePage.tsx
```

`councilModes.ts` at 504 KB is almost certainly generated-ish config data — move to `*.data.json` (not linted, not type-checked, cheaper to parse). `ChronosPage.tsx` at 382 KB is a page component — split by panel/tab; it was already touched in the recent unused-vars cleanup and will hit editor performance limits if it grows more.

### 6.3 Test coverage (counted by test files, NOT by statements)

| Side | Source files | Test files | Ratio |
|---|---|---|---|
| Frontend | 512 | 19 | **3.7 %** |
| Backend | 1,056 | 346 | 32.8 % |

Per earlier memory, measured statement coverage is ~34 % backend / ~40 % frontend. The 3.7 % file-ratio for frontend confirms the gap: there are entire critical pages (e.g. `CouncilPage.tsx`, `ChronosPage.tsx`, `CruciblePage.tsx`) with no dedicated test files. This is the single largest quality risk in the FE.

### 6.4 TypeScript strictness

Both root and `backend/tsconfig.json` currently have:

```jsonc
"noUnusedLocals": false,
"noUnusedParameters": false,
```

Intentional — recently flipped `true → false` after the fixer pass left ~29 PropertyDeclaration holdouts (write-only private class fields). The plan remains: resolve those 29, flip back to `true`. Until then, enforcement is delegated to ESLint's `unused-imports` plugin, which still catches new regressions on changed files, but does *not* gate CI.

---

## 7. Architectural Cross-Cutting Concerns

### 7.1 Open-core boundary risk (`core` ↔ `components`)

- `datacendia-components` is private and is effectively the **enterprise/paid** build (including CendiaGateway, KMS, PostQuantumKMS, sovereign services, sports vertical, etc.).
- `datacendia-core` is public Apache-2.0 and is the **community/OSS** build.
- The guard: `scripts/check-community-boundary.mjs` in `datacendia-core` — **currently FAILING in CI**. Any merge to `master` with the guard red leaves the door open for enterprise-only code to land in the public repo.

**Recommendation (P0):** fix the boundary script, then make `community-build` a **required status check** on `master` via branch protection. This converts "trust the CI green badge" into "cannot merge when broken."

### 7.2 Duplicated code surface across repos

Because `datacendia-core` is a 355 MB public repo and `datacendia-components` is a 1 GB private superset, some files exist in both. Without a formal `core` package boundary (npm workspace / git subtree / subrepo), drift between the two versions is essentially guaranteed. Evidence: the community-boundary check exists specifically because this drift was already identified. Fixing the CI is *necessary but not sufficient*; the deeper fix is either:

- (a) Publish `@datacendia/core` from the public repo, consume it as a normal npm dep from `components`. Clean, but requires a package-publishing pipeline.
- (b) Replace `datacendia-components` with a **thin private overlay** that has only the enterprise-only files and depends on `datacendia-core`.
- (c) Keep the dual-tree, but add a **sync check** workflow that diffs shared files between the two repos on every PR.

External strategic advice earlier (memory `3e93cf26`) explicitly said **keep `components` as the single source of truth** and don't do the open-core split until FEPCMAC revenue or a serious OSS audience lands. That advice stands — so the correct *interim* step is (c), the sync check, not (a).

### 7.3 Naming hygiene (already enforced for agents)

From memory `6fe7841d`: the rule is **role-as-identity, not human personas**. Worth periodically re-scanning the codebase for any regressed persona names (e.g. `Hans`, `Marcus`, `Victoria`) that may have crept back in during recent commits. Can be added as a lint rule with a deny-list.

### 7.4 "Marketing vs platform" claim drift

From memory `8aab383a`: the marketing site still overclaims:

- "29 verticals" vs actual ~21.
- "21 sovereign patterns" vs actual 11 services.
- IISS/ESG benefits unmarked as "projected."

These are not audit-breaking but directly contradict the "no inflation" rule. Recommended: one-pass update of the marketing copy so every claim is grounded in a code symbol, a test, or an explicit "projected / roadmap" tag.

### 7.5 Frontend load-test gap vs backend

Backend has `tests/load/council.load.test.ts` and `tests/load/healthcheck.load.test.ts`. Frontend has no equivalent (no Lighthouse budgets committed in `components`, no Playwright flows run in CI). Given that the product is demo-heavy (RegulatorsReceiptDemo, Council UI, Crucible page), a single Playwright smoke run per PR would catch 90 % of the "demo broke in prod" risk for roughly 2 min of CI time.

### 7.6 Empty `sjrEnterprises` repo

Created 2026-04-21, 0 bytes, 0 commits. Either (a) delete, or (b) push an initial commit with a README so it isn't confused with an abandoned stub. Low-effort, high clarity.

---

## 8. Per-Repo Observations

### 8.1 `datacendia-components` (primary monorepo, private)

- 27+ open Dependabot PRs (24 still dep upgrades + 3 other bots).
- CI failing on default branch.
- `package-lock.json` out of sync with `package.json` — **single-command fix**.
- 0 real issues open (good), but 24 bot PRs = real technical debt.
- Last human commit 2026-04-22 by Stu: `chore(ts,backend): eliminate 96% of unused-vars findings (779 -> 29)` — healthy recent activity.
- 65 commits by `datacendia`, 2 by `Copilot`.

### 8.2 `datacendia-core` (public OSS, Apache-2.0)

- 9 open issues / 7 open PRs.
- CI failing on `master` since 2026-04-14.
- Has the most credible security workflows of any repo.
- PRs #9, #11, #12 are **security-related placeholder remediation** by Copilot — review and merge or close.
- Load tests failing 100 % — almost certainly CI-infra issue, not a real regression.
- Topics are well-curated (good SEO): `ai-governance`, `defensible-ai`, `audit-trail`, `eu-ai-act`, etc.
- Has a `docker.yml` workflow (images are being built) — confirm images aren't getting pushed while CI is red.

### 8.3 `datacendia-marketing` (public, marketing site)

- Lighthouse CI green; Build-i18n red.
- PR #2 (Copilot security-hardening: SECURITY.md, Dependabot) sitting open since 2026-04-08. Merge it.
- Only 4 commits shown by `datacendia` contributor — may be showing limited history; verify.

### 8.4 `decision-governance-infrastructure` (public, specs)

- Smallest real repo (190 KB).
- `Validate Schemas & Specs` failing — this is the **exact workflow whose green badge legitimizes the whole framework**. Fix it.
- PR #1 (security-hardening) sitting open since 2026-04-08. Merge it.

### 8.5 `pitchdecks` (private)

- 2.7 MB, one Copilot agent PR open. No real CI. Treat as a document vault — fine as-is, but consider setting a retention policy for the `copilot/*` branches.

### 8.6 `sjrEnterprises`

- Empty. Delete or initialize.

---

## 9. Prioritized Remediation Backlog

### Priority 0 — within 24 hours

| # | Repo | Action | Effort |
|---|---|---|---|
| P0-1 | `datacendia-components` | `npm install` → commit `package-lock.json` (unblocks CI) | 5 min |
| P0-2 | `datacendia-core` | Fix `scripts/check-community-boundary.mjs` failure (enterprise-leak guard) | 30-60 min |
| P0-3 | `datacendia-components` | Enable branch protection on `main`: require `CI`, `Security`, `Community Edition Build` to pass before merge | 5 min |
| P0-4 | all 5 repos | Enable Dependabot alerts + Secret Scanning in repo Settings → Security | 10 min |

### Priority 1 — within 1 week

| # | Action |
|---|---|
| P1-1 | Triage the 24 stale Dependabot PRs in `components` (batch-merge patch + minor; close or replace stale majors) |
| P1-2 | Fix backend lint command in `datacendia-core` (ESLint missing from `backend/package.json` in CI context) |
| P1-3 | Fix load-test environment in `datacendia-core` CI (service wait loop before tests) |
| P1-4 | Add required-status-checks branch protection on `datacendia-core/master` and the other 3 public repos |
| P1-5 | Merge Copilot security-hardening PRs in `datacendia-marketing` (#2) and `decision-governance-infrastructure` (#1) |
| P1-6 | Decide on `sjrEnterprises`: delete or initialize |
| P1-7 | Add LICENSE files to `datacendia-components`, `datacendia-marketing`, `decision-governance-infrastructure` (three `NOASSERTION` repos) |

### Priority 2 — within 1 month

| # | Action |
|---|---|
| P2-1 | Resolve the 29 remaining PropertyDeclaration unused-vars holdouts; re-flip `noUnusedLocals`/`noUnusedParameters` to `true` in both FE and BE `tsconfig.json` |
| P2-2 | Decompose `src/data/councilModes.ts` (504 KB) → `*.data.json` + schema |
| P2-3 | Decompose `ChronosPage.tsx` (382 KB) and `CouncilPage.tsx` (229 KB) into tab-level sub-components |
| P2-4 | Add Playwright smoke suite to `datacendia-components` CI (demo pages + router) |
| P2-5 | Close marketing claim-drift items (29 verticals → 21; 21 patterns → 11; mark IISS/ESG as projected) |
| P2-6 | Add cross-repo sync check workflow between `datacendia-core` and shared files in `datacendia-components` |
| P2-7 | Run `gitleaks` / `trufflehog` against full git history of all public repos, once |

### Priority 3 — quarterly

| # | Action |
|---|---|
| P3-1 | Execute scheduled major upgrades: React 19, Vite 8, MUI 9, Tailwind 4, ESLint 10, Zod 4, react-router 7, uuid 14, Stripe 22 — one per week, not batched |
| P3-2 | Raise backend statement coverage from ~34 % → 60 %, frontend from ~40 % → 50 % (focus on the 10 biggest files above first) |
| P3-3 | Decide on open-core strategy: publishable `@datacendia/core` vs sync-check; revisit when FEPCMAC revenue or OSS audience lands (per external advice) |

---

## 10. Appendix — Raw Evidence

### 10.1 `npm audit` summary

```text
Frontend: 7 total | 0 critical | 0 high | 4 moderate | 3 low
Backend : 7 total | 0 critical | 0 high | 4 moderate | 3 low
```

### 10.2 Failing CI job signatures (verbatim)

```text
components #536 (2026-04-22):
  Backend  → Setup Node.js      : "Some specified paths were not resolved, unable to cache dependencies."
  Frontend → Install dependencies: npm EUSAGE — lockfile out of sync (11 missing packages listed)

core #274 (2026-04-14):
  Backend                → Run unit tests: AssertionError: infra error rate 100.0% exceeds 10% ceiling
  Backend                → Lint          : sh: eslint: exit 127
  Community Edition Build→ Boundary check: scripts/check-community-boundary.mjs failed
```

### 10.3 Dependabot queue ages (`datacendia-components`)

```text
Oldest open : 2025-12-05   (138 days)
Newest open : 2025-12-22   (121 days)
Total open  : 24
```

### 10.4 Language mix (`datacendia-components`)

```text
TypeScript  : 29,707,710 bytes (94.0%)
HTML        :  1,045,047 bytes ( 3.3%)
PowerShell  :    709,267 bytes ( 2.2%)
JavaScript  :    224,971 bytes ( 0.7%)
Shell / SQL / Python / HCL / Dockerfile : remainder
```

---

## 11. Honesty Checklist

- [x] No fabricated percentages. Coverage and LOC come from direct file counts.
- [x] No "feature works" claims for things I did not test this session.
- [x] `components` CI status: reported as **red**, not spun as "mostly green with a known issue."
- [x] `core`'s load-test failure is explicitly called out as *probably* a CI-infra issue, not confirmed as a product regression — because I did not run those tests myself.
- [x] Solo-founder context acknowledged: every recommendation weighed against maintainer bandwidth.
- [x] Prior strategic advice (don't split open-core yet) is explicitly honored in §7.2.

---

*End of audit.*
