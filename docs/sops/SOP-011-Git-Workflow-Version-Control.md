# SOP-011: Git Workflow & Version Control

**Category:** Development
**Priority:** High
**Owner:** Engineering Lead
**Last Verified:** 2026-02-22 (against repository structure, `DEPLOYMENT_GUIDE.md`)

---

## 1. Purpose

Define the standard Git workflow, branching strategy, commit conventions, and release procedures for the Datacendia platform codebase.

---

## 2. Branch Strategy

| Branch | Purpose | Auth Mode | Deploys To | Protected |
|--------|---------|-----------|------------|-----------|
| `main` | Active development | devAuth bypass | Local dev | Yes — PR required |
| `demo` | Client demonstrations | Real JWT | Demo server | Yes |
| `pilot` | Pilot customer deployments | Real JWT | Pilot infra | Yes |
| `production` | Live production | JWT + Keycloak | Production | Yes — 2 approvals |

### 2.1 Feature Branch Convention
```
feature/<ticket>-<short-description>
fix/<ticket>-<short-description>
hotfix/<description>
refactor/<area>
docs/<topic>
```

Examples:
```
feature/DC-142-collapse-mode-ui
fix/DC-289-ollama-cors-issue
hotfix/jwt-rotation-regression
docs/sop-creation
```

---

## 3. Commit Message Convention

### 3.1 Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### 3.2 Types
| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Formatting, no code change |
| `refactor` | Code restructuring |
| `test` | Adding/updating tests |
| `chore` | Build, CI, dependency updates |
| `perf` | Performance improvement |
| `security` | Security fix or improvement |

### 3.3 Scopes
| Scope | Area |
|-------|------|
| `frontend` | React/TypeScript UI |
| `backend` | Express API |
| `dcii` | DCII services |
| `council` | AI Council |
| `sovereign` | Sovereign services |
| `infra` | Docker, CI/CD, deployment |
| `deps` | Dependencies |

### 3.4 Examples
```
feat(dcii): add IISS score history tracking

fix(backend): resolve CORS issue with Ollama proxy
- Route auto-heal requests through backend API
- Add /api/v1/auto-heal/generate endpoint

security(backend): rotate JWT secrets and update minimum length
```

---

## 4. Development Workflow

### 4.1 Starting New Work
```bash
git checkout main
git pull origin main
git checkout -b feature/DC-XXX-description
```

### 4.2 During Development
```bash
# Stage changes
git add <files>

# Commit with conventional message
git commit -m "feat(scope): description"

# Keep branch up to date
git fetch origin main
git rebase origin/main
```

### 4.3 Submitting Changes
```bash
# Push feature branch
git push origin feature/DC-XXX-description

# Create Pull Request via GitHub
# Assign reviewers
# Wait for CI checks
```

### 4.4 After Merge
```bash
git checkout main
git pull origin main
git branch -d feature/DC-XXX-description
```

---

## 5. Code Review Checklist

- [ ] TypeScript compiles with zero errors (`npx tsc --noEmit`)
- [ ] All existing tests pass
- [ ] New features have corresponding tests
- [ ] No secrets or credentials in code
- [ ] No `console.log` left in production code (use `logger`)
- [ ] API changes documented
- [ ] Breaking changes noted in commit message footer

---

## 6. Release Procedure

### 6.1 Demo Release
```bash
git checkout demo
git merge main
git push origin demo
```

### 6.2 Pilot Release
```bash
git checkout pilot
git merge main --no-ff
# Update pilot-specific configs
git push origin pilot
```

### 6.3 Production Release
```bash
git checkout production
git merge main --no-ff
git tag -a v<X.Y.Z> -m "Release v<X.Y.Z>"
git push origin production --tags
```

---

## 7. Pre-Commit Verification

```bash
# Frontend TypeScript check
npx tsc --noEmit

# Backend TypeScript check
cd backend && npx tsc --noEmit

# Run tests
npm test

# Lint check
npm run lint
```

---

## 8. Emergency Hotfix Procedure

```bash
# Branch from production
git checkout production
git checkout -b hotfix/critical-fix

# Make fix, test, commit
git commit -m "hotfix: description of critical fix"

# Merge to production AND main
git checkout production && git merge hotfix/critical-fix
git checkout main && git merge hotfix/critical-fix

# Deploy immediately
git push origin production main
```

---

## 9. Verified Against

- Repository structure: `main` branch active, `.git/` present
- `DEPLOYMENT_GUIDE.md`: Branch → environment mapping (main, demo, pilot, production)
- GitHub remote: `github.com:datacendia/datacendia-components.git`
- Recent commits follow conventional format (verified Feb 22, 2026)

---

*Datacendia, LLC — Proprietary and Confidential*
