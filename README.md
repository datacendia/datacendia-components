# Datacendia Platform

[![CI/CD Pipeline](https://github.com/datacendia/datacendia-components/actions/workflows/ci.yml/badge.svg)](https://github.com/datacendia/datacendia-components/actions/workflows/ci.yml)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](#license)

> **The Enterprise AI Decision Intelligence Platform**
> 
> Transform complex business decisions with AI-powered councils, multi-agent deliberation, and comprehensive audit trails.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20.x or later
- **Docker** & Docker Compose
- **PostgreSQL** 16+
- **Redis** 7+
- **Neo4j** 5+ (for knowledge graph)
- **Ollama** (for local AI/LLM)

### Development Setup

```bash
# Clone the repository
git clone https://github.com/datacendia/datacendia-components.git
cd datacendia-components

# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env

# Install dependencies
npm install
cd backend && npm install && cd ..

# Start infrastructure (Postgres, Redis, Neo4j)
docker-compose -f docker-compose.dev.yml up -d

# Run database migrations
cd backend && npx prisma migrate dev && cd ..

# Seed demo data (optional)
cd backend && npx prisma db seed && cd ..

# Start development servers
npm run dev                 # Frontend (Vite) - http://localhost:5173
cd backend && npm run dev   # Backend - http://localhost:3000
```

### Using Docker (Full Stack)

```bash
# Build and start all services
docker-compose -f docker-compose.production.yml up --build

# Access the platform
# Frontend: http://localhost
# API: http://localhost:3000
```

## 📁 Project Structure

```
datacendia-components/
├── src/                    # React frontend (Vite + TypeScript + Tailwind)
│   ├── components/         # Reusable UI components
│   ├── pages/              # Page components (routes)
│   ├── lib/                # Utilities, API clients, hooks
│   └── services/           # Frontend services
├── backend/                # Node.js backend (Express + Prisma)
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Auth, logging, security
│   │   └── config/         # Database, Redis, Neo4j config
│   └── prisma/             # Database schema & migrations
├── tests/                  # Test suites (Vitest + Playwright)
├── docs/                   # Technical documentation
└── docker/                 # Docker configurations
```

## 🧪 Testing

```bash
# Frontend unit tests
npm run test

# Frontend tests with coverage
npm run test:coverage

# Backend tests
cd backend && npm run test

# E2E tests (Playwright)
npm run test:e2e

# Type checking
npm run typecheck
cd backend && npm run typecheck
```

## 🏗️ Building

```bash
# Build frontend
npm run build

# Build backend
cd backend && npm run build

# Build Docker images
docker build -f Dockerfile.frontend -t datacendia-frontend .
docker build -f backend/Dockerfile -t datacendia-backend ./backend
```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Technical Stack](docs/TECH_STACK.md) | Technology choices and architecture |
| [API Reference](docs/API_REFERENCE.md) | Backend API documentation |
| [Security Audit](docs/SECURITY-AUDIT.md) | Security review and compliance |
| [Product Bible](docs/DATACENDIA_PRODUCT_BIBLE.md) | Product vision and features |
| [Test Report](docs/TEST-REPORT.md) | Test coverage and results |

## 🔐 Environment Variables

See `.env.example` for required environment variables:

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/datacendia

# Redis
REDIS_URL=redis://localhost:6379

# Neo4j
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password

# AI/LLM
OLLAMA_BASE_URL=http://localhost:11434

# Auth
JWT_SECRET=your-secret-key
```

## 🛡️ Security

- See [SECURITY.md](SECURITY.md) for security policy and vulnerability reporting
- All secrets must be stored in environment variables
- Never commit `.env` files or API keys

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## 📄 License

**Proprietary** - Copyright © 2024-2025 Datacendia, Inc. All rights reserved.

This software is proprietary and confidential. Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited.

---

Built with ❤️ by the Datacendia team
