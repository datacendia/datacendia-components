# Contributing to Datacendia

Thank you for your interest in contributing to Datacendia! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Community vs Enterprise Boundary](#community-vs-enterprise-boundary)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)

## Code of Conduct

We are committed to providing a welcoming and inclusive experience for everyone. Please be respectful and professional in all interactions.

## Community vs Enterprise Boundary

Datacendia uses an **open-core model**. Before writing code, check [`COMMUNITY.md`](COMMUNITY.md) to understand which parts are open source and which require a commercial license.

**Quick rules:**
- **Community (PRs welcome):** Council Engine (`council/`), Decision Ledger, inference layer, basic Trust Layer, infrastructure integrations (Kafka, Temporal, OPA, etc.), frontend, vertical framework
- **Enterprise (do not extend):** `sovereign/`, `enterprise/`, premium `Cendia*Service.ts` products, `collapse/`, `sgas/`, `dcii/`

If your PR touches Enterprise code, it will be flagged during review. If you want to build something that *depends on* Enterprise code, consider building it as a plugin or extension instead — open an issue to discuss the approach first.

## Getting Started

### Prerequisites

1. **Node.js 20.x** or later
2. **Docker** and Docker Compose
3. **Git** with signed commits (recommended)

### Local Setup

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/datacendia-components.git
cd datacendia-components

# Add upstream remote
git remote add upstream https://github.com/datacendia/datacendia-components.git

# Install dependencies
npm install
cd backend && npm install && cd ..

# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env

# Start development infrastructure
docker-compose -f docker-compose.dev.yml up -d

# Run database migrations
cd backend && npx prisma migrate dev && cd ..

# Start development servers
npm run dev
```

## Development Workflow

### Branch Naming

Use descriptive branch names following this pattern:

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test additions/updates

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no code change)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(council): add multi-agent deliberation support
fix(auth): resolve JWT token refresh issue
docs(api): update endpoint documentation
test(chronos): add unit tests for time-travel feature
```

## Pull Request Process

### Before Submitting

1. **Sync with upstream:**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run all checks locally:**
   ```bash
   # Type checking
   npm run typecheck
   cd backend && npm run typecheck && cd ..
   
   # Linting
   npm run lint
   cd backend && npm run lint && cd ..
   
   # Tests
   npm run test
   cd backend && npm run test && cd ..
   
   # Build
   npm run build
   cd backend && npm run build && cd ..
   ```

3. **Ensure no secrets or sensitive data** are included

### PR Requirements

- [ ] Clear, descriptive title following conventional commits
- [ ] Description of changes and motivation
- [ ] Link to related issue(s) if applicable
- [ ] All CI checks passing
- [ ] Tests added/updated for new functionality
- [ ] Documentation updated if needed
- [ ] No merge conflicts with main
- [ ] Does not extend Enterprise-only code (see [COMMUNITY.md](COMMUNITY.md))

### Review Process

1. All PRs require at least one approval from a maintainer
2. CI must pass before merge
3. Resolve all review comments
4. Squash and merge preferred for feature branches

## Coding Standards

### TypeScript

- Use strict TypeScript (`strict: true`)
- Prefer `interface` over `type` for objects
- Use explicit return types for functions
- Avoid `any` - use `unknown` if type is truly unknown

### React

- Use functional components with hooks
- Prefer named exports
- Use proper prop typing
- Follow React best practices for performance

### Backend

- Follow Express.js patterns
- Use Prisma for database operations
- Implement proper error handling
- Add logging for debugging

### File Organization

```
feature/
├── index.ts          # Public exports
├── FeatureName.tsx   # Main component
├── types.ts          # Type definitions
├── hooks.ts          # Custom hooks
├── utils.ts          # Utility functions
└── __tests__/        # Tests
```

## Testing Requirements

### Unit Tests

- Use Vitest for frontend tests
- Test all utility functions
- Test custom hooks
- Aim for >80% coverage on new code

### Integration Tests

- Test API endpoints
- Test database operations
- Test service interactions

### E2E Tests

- Use Playwright for critical user flows
- Test authentication flows
- Test main feature paths

### Running Tests

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# E2E
npm run test:e2e
```

## Documentation

### Code Documentation

- Add JSDoc comments for public APIs
- Document complex logic inline
- Keep README files updated

### API Documentation

- Document all endpoints
- Include request/response examples
- Note authentication requirements

### Architecture Decisions

- Document significant decisions in ADRs
- Update architecture diagrams when needed

## Questions?

If you have questions, please:

1. Check existing documentation
2. Search closed issues/PRs
3. Open a discussion or issue

---

Thank you for contributing to Datacendia! 🙏
