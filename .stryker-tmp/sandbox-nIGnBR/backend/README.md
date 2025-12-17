# Datacendia Backend API

Production-grade backend API for the Datacendia platform.

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js with TypeScript
- **Databases**: 
  - PostgreSQL (primary data)
  - Redis (caching, sessions, pub/sub)
  - Neo4j (knowledge graph)
- **AI/LLM**: Ollama (local LLM for AI agents)
- **Authentication**: JWT with refresh tokens
- **Validation**: Zod
- **ORM**: Prisma

## Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- Ollama (optional, for AI features)

### Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Setup environment**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. **Start databases with Docker**
   ```bash
   # From project root
   docker-compose up -d postgres redis neo4j
   ```

4. **Run database migrations**
   ```bash
   npm run db:push
   npm run db:generate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user & organization
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Get current user

### Users
- `GET /api/v1/users` - List users (admin)
- `GET /api/v1/users/me` - Get current user
- `PUT /api/v1/users/me` - Update current user
- `POST /api/v1/users/invite` - Invite user (admin)

### Organizations
- `GET /api/v1/organizations/current` - Get organization
- `PUT /api/v1/organizations/current` - Update organization
- `GET /api/v1/organizations/current/teams` - List teams
- `GET /api/v1/organizations/current/activity` - Activity log

### Graph (Knowledge Graph)
- `GET /api/v1/graph/entities` - List entities
- `GET /api/v1/graph/entities/:id` - Get entity
- `POST /api/v1/graph/entities` - Create entity
- `GET /api/v1/graph/entities/:id/neighbors` - Get neighbors
- `POST /api/v1/graph/relationships` - Create relationship
- `POST /api/v1/graph/query` - Execute Cypher query
- `GET /api/v1/graph/search` - Search entities

### Council (AI Agents)
- `GET /api/v1/council/agents` - List AI agents
- `POST /api/v1/council/query` - Query agents
- `POST /api/v1/council/deliberations` - Start deliberation
- `GET /api/v1/council/deliberations/:id` - Get deliberation
- `GET /api/v1/council/deliberations/:id/transcript` - Get transcript
- `GET /api/v1/council/decisions/recent` - Recent decisions

### Metrics
- `GET /api/v1/metrics` - List metrics
- `GET /api/v1/metrics/key` - Key dashboard metrics
- `GET /api/v1/metrics/:id` - Get metric
- `POST /api/v1/metrics` - Create metric
- `GET /api/v1/metrics/:id/calculate` - Calculate values
- `GET /api/v1/metrics/:id/history` - Get history

### Health & Alerts
- `GET /api/v1/health/score` - Overall health score
- `GET /api/v1/health/dimensions` - Dimension breakdown
- `GET /api/v1/health/trend` - Health trend
- `GET /api/v1/health/systems/status` - System status
- `GET /api/v1/alerts` - List alerts
- `GET /api/v1/alerts/summary` - Alert summary
- `POST /api/v1/alerts/:id/acknowledge` - Acknowledge alert
- `POST /api/v1/alerts/:id/resolve` - Resolve alert

### Workflows
- `GET /api/v1/workflows` - List workflows
- `POST /api/v1/workflows` - Create workflow
- `POST /api/v1/workflows/:id/execute` - Execute workflow
- `GET /api/v1/workflows/executions/:id` - Execution status

### Forecasting
- `GET /api/v1/predict/forecasts` - List forecasts
- `POST /api/v1/predict/forecasts` - Create forecast
- `GET /api/v1/predict/scenarios` - List scenarios
- `POST /api/v1/predict/scenarios` - Create scenario
- `POST /api/v1/predict/scenarios/compare` - Compare scenarios

### Data Sources
- `GET /api/v1/data-sources` - List data sources
- `POST /api/v1/data-sources` - Create data source
- `POST /api/v1/data-sources/:id/test` - Test connection
- `POST /api/v1/data-sources/:id/sync` - Trigger sync

### Demo Requests (Public)
- `POST /api/v1/leads/demo-request` - Submit demo request

## WebSocket Events

Connect to `ws://localhost:3001` with JWT in auth header.

### Channels
- `deliberation:{id}` - Real-time deliberation updates
- `workflow:{id}` - Workflow execution updates
- `alerts:{orgId}` - Organization alerts
- `health:{orgId}` - Health score updates

## Environment Variables

See `.env.example` for all required variables.

## Testing

```bash
npm run test
npm run test:coverage
```

## Production Build

```bash
npm run build
npm start
```

## Docker

```bash
# Build and run all services
docker-compose up -d

# View logs
docker-compose logs -f api
```
