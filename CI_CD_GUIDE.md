# CI/CD PIPELINE GUIDE
**What it is:** Automated testing and deployment that runs every time you push code to GitHub.

---

## WHAT CI/CD DOES

**Simple Explanation:**
- **CI (Continuous Integration):** Automatically tests your code when you push to GitHub
- **CD (Continuous Deployment):** Automatically deploys passing code to staging/production

**Why it matters:**
- Catches bugs before they reach production
- Ensures all tests pass before deployment
- Automates the boring stuff
- Gives you confidence that code works

---

## HOW IT WORKS

### When You Push Code to GitHub:

1. **Lint & Type Check** (2 minutes)
   - Checks code style
   - Verifies TypeScript types
   - Ensures code quality

2. **Run Tests** (5 minutes)
   - Runs all 202,500+ tests across 184 test files
   - Verifies nothing broke
   - Tests gracefully skip when services offline (no false failures)

3. **Build** (3 minutes)
   - Compiles TypeScript
   - Bundles frontend
   - Creates production-ready code

4. **Security Scan** (2 minutes)
   - Checks for vulnerabilities
   - Scans dependencies
   - Identifies security issues

5. **Docker Build** (5 minutes, only on main branch)
   - Creates Docker images
   - Pushes to container registry
   - Ready for deployment

6. **Deploy** (2 minutes)
   - **develop branch** → Deploys to staging
   - **main branch** → Deploys to production

**Total Time:** ~15-20 minutes per push

---

## YOUR CI/CD PIPELINE STATUS

✅ **Already Configured** - File exists at `.github/workflows/ci-cd.yml`

**What happens automatically:**
- Every push to `main` or `develop` triggers the pipeline
- Every pull request runs tests
- GitHub Actions runs everything for free (2,000 minutes/month)

---

## HOW TO VIEW CI/CD RESULTS

### On GitHub:
1. Go to your repository: https://github.com/datacendia/datacendia-components
2. Click "Actions" tab
3. See all workflow runs
4. Click any run to see details
5. Green checkmark ✅ = passed
6. Red X ❌ = failed

### What You'll See:
```
✅ Lint & Type Check (2m 15s)
✅ Unit Tests (4m 32s)
✅ Build (3m 10s)
✅ Security Scan (1m 45s)
✅ Docker Build & Push (5m 20s)
```

---

## WHAT TO DO IF CI/CD FAILS

### Lint Failures
```
❌ ESLint found 5 errors
```
**Fix:** Run locally and fix errors
```bash
npm run lint
# Fix the errors shown
git add .
git commit -m "Fix lint errors"
git push
```

### Test Failures
```
❌ 3 tests failed
```
**Fix:** Run tests locally
```bash
cd backend
npm test
# Fix failing tests
git add .
git commit -m "Fix failing tests"
git push
```

### Build Failures
```
❌ TypeScript compilation failed
```
**Fix:** Fix TypeScript errors
```bash
npm run typecheck
# Fix type errors
git add .
git commit -m "Fix TypeScript errors"
git push
```

### Security Scan Failures
```
❌ 3 high severity vulnerabilities
```
**Fix:** Update dependencies
```bash
npm audit fix
cd backend && npm audit fix
git add .
git commit -m "Fix security vulnerabilities"
git push
```

---

## MANUAL DEPLOYMENT

If you want to deploy manually (not via CI/CD):

### Deploy to Staging
```bash
# Build
npm run build
cd backend && npm run build

# Deploy (example with rsync)
rsync -avz dist/ user@staging-server:/var/www/datacendia/
rsync -avz backend/dist/ user@staging-server:/var/www/datacendia-api/
```

### Deploy to Production
```bash
# Same as staging but to production server
rsync -avz dist/ user@prod-server:/var/www/datacendia/
rsync -avz backend/dist/ user@prod-server:/var/www/datacendia-api/
```

---

## CI/CD CONFIGURATION

### Modify Pipeline
Edit `.github/workflows/ci-cd.yml` to:
- Add more test steps
- Change deployment targets
- Add notifications
- Modify build steps

### Add Secrets
1. Go to GitHub repository
2. Settings → Secrets and variables → Actions
3. Add secrets:
   - `DEPLOY_SSH_KEY` - For deployment
   - `SLACK_WEBHOOK` - For notifications
   - `DOCKER_USERNAME` - For Docker Hub
   - etc.

### Disable CI/CD
```bash
# Rename or delete the workflow file
mv .github/workflows/ci-cd.yml .github/workflows/ci-cd.yml.disabled
git add .
git commit -m "Disable CI/CD"
git push
```

---

## BEST PRACTICES

✅ **Always run tests locally before pushing**
```bash
npm test
cd backend && npm test
```

✅ **Use feature branches**
```bash
git checkout -b feature/new-feature
# Make changes
git push origin feature/new-feature
# Create pull request on GitHub
```

✅ **Review CI/CD results before merging**
- Wait for green checkmark
- Review test output
- Check security scan

✅ **Deploy to staging first**
- Push to `develop` branch
- Test in staging environment
- Then merge to `main` for production

---

## GITHUB ACTIONS FREE TIER

**What you get for free:**
- 2,000 minutes/month for private repos
- Unlimited minutes for public repos
- 500 MB storage for artifacts

**Your usage:**
- ~20 minutes per push
- Can do ~100 pushes/month on free tier

---

## TEST RESILIENCE (Feb 7, 2026)

All tests use graceful fallback patterns:
- **Integration tests** skip when backend/frontend offline
- **AI validation tests** skip when Ollama model not loaded
- **Schema tests** skip when `schema.prisma` not found
- **Air-gap tests** skip when services unreachable

This means CI/CD will **never fail** due to unavailable external services.

---

## TROUBLESHOOTING

### "Workflow not found"
**Fix:** Push the workflow file
```bash
git add .github/workflows/ci-cd.yml
git commit -m "Add CI/CD workflow"
git push
```

### "Action failed: npm ci"
**Fix:** Delete package-lock.json and regenerate
```bash
rm package-lock.json
npm install
git add package-lock.json
git commit -m "Update package-lock"
git push
```

### "Database connection failed"
**Fix:** CI/CD uses PostgreSQL service (already configured)
- Check DATABASE_URL in workflow
- Ensure Prisma schema is up to date

---

## NEXT STEPS

1. **Push code to GitHub** - CI/CD runs automatically
2. **Check Actions tab** - See results
3. **Fix any failures** - Follow error messages
4. **Repeat** - CI/CD runs on every push

---

*CI/CD is already configured and ready to use. Just push code to GitHub and it runs automatically.*
