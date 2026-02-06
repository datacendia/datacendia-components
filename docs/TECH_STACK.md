# Datacendia Platform - Tech Stack

## 🎨 Frontend (Client)
- **Framework**: React 18.2
- **Language**: TypeScript 5.2
- **Build Tool**: Vite 7.x
- **Styling**: Tailwind CSS 3.3
  - *Theme*: Teal (Primary), Blue (Secondary), Orange (Accent), Deep Black (Neutral)
- **State Management**: Zustand 5.x + React Context API
- **Real-time**: Socket.io Client 4.8
- **Visualization**: Cytoscape.js (Graph analysis)
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM 6
- **Internationalization**: i18next + react-i18next
- **UI Components**: Radix UI, MUI (Material UI), shadcn/ui

## ⚙️ Backend (Server)
- **Runtime**: Node.js (>=20.0.0)
- **Framework**: Express.js 4.18
- **Language**: TypeScript 5.3
- **API Style**: RESTful + GraphQL (Apollo Server 5) + Real-time Events
- **Validation**: Zod 3.x
- **Security**: Helmet, CORS, bcryptjs, JOSE (JWT)
- **Real-time**: Socket.io 4.8
- **Job Queue**: Bull 4.12 / BullMQ 5.x
- **Logging**: Winston
- **Telemetry**: OpenTelemetry, Prometheus (prom-client)

## 💾 Data Persistence
- **Primary Database**: PostgreSQL (via Prisma ORM)
- **ORM**: Prisma 5.7
- **Caching & Queues**: Redis (via ioredis 5.x)
- **Vector/Graph**: Neo4j 5.x (Driver included)
- **Additional**: MongoDB, MySQL, ClickHouse connectors available

## 🧠 Artificial Intelligence
- **LLM Engine**: Ollama (Local Inference)
- **Models**: Llama 3.2 (3B/1B optimized)
- **Features**:
  - Dynamic Translation (26 Languages)
  - Executive Summaries
  - Council Deliberations (89 modes)
  - Pre-Mortem Analysis
  - Meeting Minutes Generation

## 🛠️ DevOps & Quality
- **Unit Testing**: Vitest 4.x
- **E2E Testing**: Playwright
- **Mutation Testing**: Stryker
- **Linting**: ESLint
- **Formatting**: Prettier
- **Containerization**: Docker + Docker Compose
- **Documentation**: Markdown

## 🌍 Internationalization
- **System**: i18next + Custom Dynamic Translation Service (OmniTranslate)
- **Coverage**: 26 Languages (EN, ES, FR, DE, IT, PT, PT-BR, NL, PL, RU, UK, ZH, JA, KO, AR, HE, HI, BN, ID, SV, SW, TH, TL, TR, UR, VI)
- **Method**: Hybrid (Static i18n Base + AI Dynamic Fallback via Ollama)
