# Release Process

This document outlines the release process for Datacendia.

## Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (X.0.0): Breaking changes, major features
- **MINOR** (0.X.0): New features, backwards compatible
- **PATCH** (0.0.X): Bug fixes, security patches

## Release Types

### Production Release

Full release to production environment.

```bash
# 1. Ensure main is up to date
git checkout main
git pull origin main

# 2. Run all checks
npm run lint:all
npm run typecheck:all
npm run test:all
npm run build:all

# 3. Create release branch
git checkout -b release/v1.2.0

# 4. Update version in package.json files
npm version 1.2.0 --no-git-tag-version
cd backend && npm version 1.2.0 --no-git-tag-version && cd ..

# 5. Update CHANGELOG.md
# Add release notes under new version heading

# 6. Commit and tag
git add .
git commit -m "chore(release): v1.2.0"
git tag -a v1.2.0 -m "Release v1.2.0"

# 7. Push release
git push origin release/v1.2.0
git push origin v1.2.0

# 8. Create PR to main
# 9. After merge, deploy via CI/CD
```

### Hotfix Release

Emergency fix for production.

```bash
# 1. Create hotfix branch from main
git checkout main
git checkout -b hotfix/v1.2.1

# 2. Make fix and test
# ... fix code ...
npm run test:all

# 3. Update version (patch)
npm version patch --no-git-tag-version
cd backend && npm version patch --no-git-tag-version && cd ..

# 4. Commit and tag
git add .
git commit -m "fix(hotfix): critical bug fix"
git tag -a v1.2.1 -m "Hotfix v1.2.1"

# 5. Push and create PR
git push origin hotfix/v1.2.1
git push origin v1.2.1
```

## Release Checklist

### Before Release

- [ ] All tests passing (`npm run test:all`)
- [ ] Linting clean (`npm run lint:all`)
- [ ] Type checking passes (`npm run typecheck:all`)
- [ ] Build succeeds (`npm run build:all`)
- [ ] No critical security vulnerabilities (`npm audit`)
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version numbers updated

### During Release

- [ ] Release branch created
- [ ] Version tagged
- [ ] PR created and reviewed
- [ ] CI/CD pipeline passes

### After Release

- [ ] Deployment verified
- [ ] Health checks passing
- [ ] Monitoring alerts reviewed
- [ ] Release notes published
- [ ] Team notified

## CHANGELOG Format

```markdown
# Changelog

## [1.2.0] - 2024-12-15

### Added
- New feature X
- Feature Y enhancement

### Changed
- Updated dependency Z
- Improved performance of ABC

### Fixed
- Bug in XYZ component
- Security issue CVE-XXXX

### Deprecated
- Old API endpoint /v1/old

### Removed
- Legacy feature ABC

### Security
- Patched vulnerability in package X
```

## Deployment Environments

| Environment | Branch | URL | Purpose |
|-------------|--------|-----|---------|
| Development | `develop` | dev.datacendia.com | Testing |
| Staging | `release/*` | staging.datacendia.com | Pre-production |
| Production | `main` | app.datacendia.com | Live |

## Rollback Procedure

If a release needs to be rolled back:

```bash
# 1. Identify last good version
git log --oneline --tags

# 2. Revert to previous tag
git checkout v1.1.0

# 3. Create rollback branch
git checkout -b rollback/v1.1.0

# 4. Push and deploy
git push origin rollback/v1.1.0

# 5. Trigger rollback deployment in CI/CD
```

## Docker Image Tags

- `latest` - Latest stable release
- `v1.2.0` - Specific version
- `main` - Latest from main branch
- `develop` - Development builds

## Contact

- **Release Manager**: platform-lead@datacendia.com
- **On-Call**: oncall@datacendia.com
- **Slack**: #releases
