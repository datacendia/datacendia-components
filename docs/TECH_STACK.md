# Datacendia Platform - Tech Stack

## 🎨 Frontend (Client)
- **Framework**: React 18
- **Language**: TypeScript 5.x
- **Build Tool**: Vite 5.x
- **Styling**: Tailwind CSS 3.3
  - *Theme*: Teal (Primary), Blue (Secondary), Orange (Accent), Deep Black (Neutral)
- **State Management**: React Context API
- **Real-time**: Socket.io Client
- **Visualization**: Cytoscape.js (Graph analysis)
- **Icons**: Lucide React
- **Routing**: React Router DOM 6

## ⚙️ Backend (Server)
- **Runtime**: Node.js (>=20.0.0)
- **Framework**: Express.js 4.18
- **Language**: TypeScript 5.3
- **API Style**: RESTful + Real-time Events
- **Validation**: Zod 3.x
- **Security**: Helmet, CORS, bcryptjs, JOSE (JWT)
- **Real-time**: Socket.io 4.7
- **Job Queue**: Bull 4.12
- **Logging**: Winston

## 💾 Data Persistence
- **Primary Database**: PostgreSQL (via Prisma ORM)
- **ORM**: Prisma 5.7
- **Caching & Queues**: Redis (via ioredis)
- **Vector/Graph**: Neo4j (Driver included)

## 🧠 Artificial Intelligence
- **LLM Engine**: Ollama (Local Inference)
- **Models**: Llama 3.2 (3B/1B optimized)
- **Features**:
  - Dynamic Translation (24 Languages)
  - Executive Summaries
  - Council Deliberations
  - Pre-Mortem Analysis
  - Meeting Minutes Generation

## 🛠️ DevOps & Quality
- **Testing**: Vitest
- **Linting**: ESLint
- **Containerization**: Docker
- **Documentation**: Markdown

## 🌍 Internationalization
- **System**: Custom Dynamic Translation Service
- **Coverage**: 24 Languages (EN, ES, FR, DE, IT, PT, NL, PL, RU, UK, ZH, JA, KO, AR, HE, etc.)
- **Method**: Hybrid (Static Base + AI Dynamic Fallback)
