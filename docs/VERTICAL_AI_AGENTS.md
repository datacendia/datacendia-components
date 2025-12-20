# DATACENDIA VERTICAL AI AGENTS
## Industry-Specific AI Agent System - Enterprise Platinum Standard

**Version:** 1.0.0  
**Generated:** December 20, 2025  
**Total Agents:** 48+ across 12 verticals

---

# TABLE OF CONTENTS

1. [Overview](#1-overview)
2. [Architecture](#2-architecture)
3. [Backend Service](#3-backend-service)
4. [API Reference](#4-api-reference)
5. [Frontend Service](#5-frontend-service)
6. [Vertical Agent Catalog](#6-vertical-agent-catalog)
7. [Model Zoo Integration](#7-model-zoo-integration)
8. [Usage Examples](#8-usage-examples)

---

# 1. OVERVIEW

The Vertical AI Agents system provides **industry-specific AI intelligence** for 12 major verticals. Each vertical has 4 specialized agents tailored to that industry's unique needs, terminology, and workflows.

## Key Features

- **48+ Specialized Agents** across 12 industry verticals
- **Model-Optimized** - Each agent uses the most appropriate LLM model
- **Enterprise Platinum Standards** - Sovereignty, auditability, no black boxes
- **Full Stack Integration** - Backend service + REST API + Frontend hooks
- **Real-time Metrics** - Track agent decisions, success rates, latency

---

# 2. ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                    VERTICAL AGENTS ARCHITECTURE                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Financial   │  │  Healthcare  │  │ Manufacturing│   ...     │
│  │   Agents     │  │    Agents    │  │    Agents    │          │
│  │              │  │              │  │              │          │
│  │ • RiskSentin │  │ • CareCoordin│  │ • Production │          │
│  │ • AlphaHunter│  │ • ClinicalAdv│  │ • PredictMain│          │
│  │ • Compliance │  │ • CapacityOrc│  │ • QualityVis │          │
│  │ • MarketPulse│  │ • QualitySent│  │ • SupplySync │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│           │                │                │                   │
│           ▼                ▼                ▼                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              VerticalAgentsService (Backend)             │   │
│  │  • Agent Registry & Configuration                        │   │
│  │  • Metrics Collection & Aggregation                      │   │
│  │  • Activity Logging & Audit Trail                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              REST API (/api/v1/vertical-agents)          │   │
│  │  GET /verticals • GET /agents • POST /activity           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           Frontend Service + React Query Hooks           │   │
│  │  useVerticalAgents • useAgent • useAgentMetrics          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

# 3. BACKEND SERVICE

**File:** `backend/src/services/VerticalAgentsService.ts`

## Service Class

```typescript
import { VerticalAgentsService } from './services/VerticalAgentsService';

const service = new VerticalAgentsService();
await service.initialize();
```

## Core Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `getAllVerticals()` | List all vertical IDs | `string[]` |
| `getVerticalConfig(verticalId)` | Get vertical config with agents | `VerticalAgentConfig` |
| `getAgentsForVertical(verticalId)` | Get all agents for a vertical | `VerticalAgent[]` |
| `getAgent(agentId)` | Get specific agent by ID | `VerticalAgent` |
| `searchAgents(query)` | Search agents by name/capability | `VerticalAgent[]` |
| `getAgentMetrics(agentId)` | Get agent performance metrics | `AgentMetrics` |
| `getVerticalMetrics(verticalId)` | Get aggregated vertical metrics | `VerticalMetrics` |
| `getGlobalMetrics()` | Get platform-wide metrics | `GlobalMetrics` |
| `recordActivity(activity)` | Log agent activity | `AgentActivity` |
| `getRecentActivity(limit)` | Get recent activities | `AgentActivity[]` |

## Types

```typescript
interface VerticalAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  capabilities: string[];
  specializations: string[];
  icon: string;
  status: 'active' | 'processing' | 'idle' | 'maintenance';
  model: string;
  temperature: number;
  systemPrompt: string;
}

interface AgentMetrics {
  agentId: string;
  decisionsToday: number;
  avgResponseTime: number;
  successRate: number;
  lastActive: Date;
}
```

---

# 4. API REFERENCE

**Base URL:** `/api/v1/vertical-agents`

**File:** `backend/src/routes/vertical-agents.ts`

## Endpoints

### Verticals

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/verticals` | List all available verticals |
| GET | `/verticals/:verticalId` | Get vertical configuration |
| GET | `/verticals/:verticalId/agents` | Get agents for vertical |
| GET | `/verticals/:verticalId/metrics` | Get vertical metrics |

### Agents

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/agents` | Get all agents across verticals |
| GET | `/agents/search?q=` | Search agents by query |
| GET | `/agents/:agentId` | Get specific agent |
| GET | `/agents/:agentId/metrics` | Get agent metrics |
| GET | `/agents/:agentId/activity` | Get agent activity log |

### Global

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/metrics` | Get global metrics |
| GET | `/activity` | Get recent activity |
| POST | `/activity` | Record agent activity |
| GET | `/health` | Service health check |

## Example Requests

```bash
# Get all verticals
curl http://localhost:3001/api/v1/vertical-agents/verticals

# Get financial services agents
curl http://localhost:3001/api/v1/vertical-agents/verticals/financial/agents

# Search for risk-related agents
curl http://localhost:3001/api/v1/vertical-agents/agents/search?q=risk

# Record agent activity
curl -X POST http://localhost:3001/api/v1/vertical-agents/activity \
  -H "Content-Type: application/json" \
  -d '{"agentId": "fin-risk-sentinel", "verticalId": "financial", "action": "Analyzed portfolio risk", "success": true}'
```

---

# 5. FRONTEND SERVICE

**File:** `src/services/VerticalAgentsService.ts`

## API Service

```typescript
import { verticalAgentsApi } from '@/services/VerticalAgentsService';

// Get all verticals
const verticals = await verticalAgentsApi.getAllVerticals();

// Get agents for a vertical
const agents = await verticalAgentsApi.getAgentsForVertical('healthcare');

// Search agents
const results = await verticalAgentsApi.searchAgents('compliance');
```

## React Query Hooks

```typescript
import { 
  useVerticals,
  useVerticalAgents,
  useAgent,
  useAgentMetrics,
  useGlobalMetrics,
  useRecordActivity
} from '@/services/VerticalAgentsService';

// In a component
function MyComponent() {
  // Get all verticals
  const { data: verticals } = useVerticals();
  
  // Get agents for healthcare
  const { data: agents } = useVerticalAgents('healthcare');
  
  // Get specific agent
  const { data: agent } = useAgent('hc-clinical-advisor');
  
  // Get global metrics
  const { data: metrics } = useGlobalMetrics();
  
  // Record activity
  const { mutate: recordActivity } = useRecordActivity();
  
  const handleAction = () => {
    recordActivity({
      agentId: 'hc-clinical-advisor',
      verticalId: 'healthcare',
      action: 'Recommended treatment protocol',
      success: true
    });
  };
}
```

---

# 6. VERTICAL AGENT CATALOG

## Financial Services (`financial`)

| Agent ID | Name | Role | Model |
|----------|------|------|-------|
| `fin-risk-sentinel` | RiskSentinel | Chief Risk Officer AI | qwq:32b |
| `fin-alpha-hunter` | AlphaHunter | Investment Strategy AI | qwen2.5:7b |
| `fin-compliance-guardian` | ComplianceGuardian | Regulatory Compliance AI | qwen2.5:7b |
| `fin-market-pulse` | MarketPulse | Market Intelligence AI | llama3.2:3b |

## Healthcare (`healthcare`)

| Agent ID | Name | Role | Model |
|----------|------|------|-------|
| `hc-care-coordinator` | CareCoordinator | Patient Journey Optimizer | qwen2.5:7b |
| `hc-clinical-advisor` | ClinicalAdvisor | Clinical Decision Support AI | qwq:32b |
| `hc-capacity-oracle` | CapacityOracle | Hospital Operations AI | llama3.2:3b |
| `hc-quality-sentinel` | QualitySentinel | Quality & Safety AI | qwen2.5:7b |

## Manufacturing (`manufacturing`)

| Agent ID | Name | Role | Model |
|----------|------|------|-------|
| `mfg-production-master` | ProductionMaster | Production Optimization AI | qwen2.5:7b |
| `mfg-predict-maintain` | PredictMaintain | Predictive Maintenance AI | qwq:32b |
| `mfg-quality-vision` | QualityVision | Quality Inspection AI | llava:34b |
| `mfg-supply-sync` | SupplySync | Supply Chain AI | qwen2.5:7b |

## Technology (`technology`)

| Agent ID | Name | Role | Model |
|----------|------|------|-------|
| `tech-site-reliability` | SiteReliability | SRE Intelligence AI | qwen2.5-coder:32b |
| `tech-security-fortress` | SecurityFortress | Cybersecurity AI | qwq:32b |
| `tech-dev-velocity` | DevVelocity | Engineering Productivity AI | qwen2.5-coder:32b |
| `tech-data-architect` | DataArchitect | Data Platform AI | qwen2.5-coder:32b |

## Energy (`energy`)

| Agent ID | Name | Role | Model |
|----------|------|------|-------|
| `eng-grid-balancer` | GridBalancer | Grid Optimization AI | qwq:32b |
| `eng-renewable-optimizer` | RenewableOptimizer | Clean Energy AI | qwen2.5:7b |
| `eng-asset-guardian` | AssetGuardian | Infrastructure AI | qwen2.5:7b |
| `eng-demand-response` | DemandResponse | Load Management AI | llama3.2:3b |

## Government (`government`)

| Agent ID | Name | Role | Model |
|----------|------|------|-------|
| `gov-policy-advisor` | PolicyAdvisor | Policy Analysis AI | qwq:32b |
| `gov-citizen-engage` | CitizenEngage | Public Services AI | qwen2.5:7b |
| `gov-budget-optimizer` | BudgetOptimizer | Fiscal Management AI | qwen2.5:7b |
| `gov-transparency-engine` | TransparencyEngine | Open Government AI | qwen2.5:7b |

## Logistics (`logistics`)

| Agent ID | Name | Role | Model |
|----------|------|------|-------|
| `log-route-optimizer` | RouteOptimizer | Fleet Routing AI | qwen2.5:7b |
| `log-warehouse-brain` | WarehouseBrain | Warehouse Operations AI | qwen2.5:7b |
| `log-demand-predictor` | DemandPredictor | Demand Planning AI | qwq:32b |
| `log-carrier-manager` | CarrierManager | Transportation AI | qwen2.5:7b |

## Retail (`retail`)

| Agent ID | Name | Role | Model |
|----------|------|------|-------|
| `ret-merchandising-ai` | MerchandisingAI | Assortment Planning AI | qwen2.5:7b |
| `ret-pricing-engine` | PricingEngine | Dynamic Pricing AI | qwq:32b |
| `ret-customer-insight` | CustomerInsight | Customer Intelligence AI | qwen2.5:7b |
| `ret-omni-sync` | OmniSync | Omnichannel AI | llama3.2:3b |

## Education (`education`)

| Agent ID | Name | Role | Model |
|----------|------|------|-------|
| `edu-student-success` | StudentSuccess | Student Retention AI | qwen2.5:7b |
| `edu-learning-advisor` | LearningAdvisor | Adaptive Learning AI | qwen2.5:7b |
| `edu-enrollment-optimizer` | EnrollmentOptimizer | Enrollment Management AI | qwq:32b |
| `edu-workforce-connector` | WorkforceConnector | Career Services AI | qwen2.5:7b |

## Legal (`legal`)

| Agent ID | Name | Role | Model |
|----------|------|------|-------|
| `leg-case-strategist` | CaseStrategist | Litigation Strategy AI | qwq:32b |
| `leg-contract-analyzer` | ContractAnalyzer | Contract Intelligence AI | qwen2.5:7b |
| `leg-discovery-engine` | DiscoveryEngine | E-Discovery AI | qwen2.5:7b |
| `leg-compliance-tracker` | ComplianceTracker | Regulatory Compliance AI | qwen2.5:7b |

## Real Estate (`real-estate`)

| Agent ID | Name | Role | Model |
|----------|------|------|-------|
| `re-valuation-engine` | ValuationEngine | Property Valuation AI | qwq:32b |
| `re-lease-optimizer` | LeaseOptimizer | Lease Management AI | qwen2.5:7b |
| `re-property-manager` | PropertyManager | Property Operations AI | llama3.2:3b |
| `re-investment-analyst` | InvestmentAnalyst | Real Estate Investment AI | qwq:32b |

## Insurance (`insurance`)

| Agent ID | Name | Role | Model |
|----------|------|------|-------|
| `ins-underwriting-ai` | UnderwritingAI | Risk Assessment AI | qwq:32b |
| `ins-claims-processor` | ClaimsProcessor | Claims Management AI | qwen2.5:7b |
| `ins-fraud-detector` | FraudDetector | Fraud Detection AI | qwq:32b |
| `ins-actuarial-engine` | ActuarialEngine | Actuarial AI | qwq:32b |

---

# 7. MODEL ZOO INTEGRATION

All vertical agents are registered in the Model Zoo with optimized configurations.

**File:** `backend/src/config/modelZoo.ts`

```typescript
import { VERTICAL_AGENT_MAPPINGS, ALL_AGENT_MAPPINGS } from './modelZoo';

// Get agent configuration
const agentConfig = VERTICAL_AGENT_MAPPINGS.find(a => a.agentCode === 'fin-risk-sentinel');
// { primaryModel: 'qwq:32b', fallbackModels: ['qwen2.5:7b'], temperature: 0.3, ... }

// Combined with C-Suite agents
console.log(ALL_AGENT_MAPPINGS.length); // 60+ total agents
```

---

# 8. USAGE EXAMPLES

## Dashboard Widget Integration

```tsx
import { useVerticalAgents, useVerticalMetrics } from '@/services/VerticalAgentsService';

function VerticalAgentPanel({ verticalId }: { verticalId: string }) {
  const { data: agents, isLoading } = useVerticalAgents(verticalId);
  const { data: metrics } = useVerticalMetrics(verticalId);
  
  if (isLoading) return <Spinner />;
  
  return (
    <div>
      <h3>Agents ({agents?.length})</h3>
      <p>Decisions Today: {metrics?.totalDecisionsToday}</p>
      <p>Success Rate: {(metrics?.avgSuccessRate * 100).toFixed(1)}%</p>
      
      {agents?.map(agent => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
}
```

## Recording Agent Activity

```typescript
import { useRecordActivity } from '@/services/VerticalAgentsService';

function AgentActionButton({ agentId, verticalId }) {
  const { mutate: recordActivity, isLoading } = useRecordActivity();
  
  const handleClick = async () => {
    // Perform agent action...
    
    recordActivity({
      agentId,
      verticalId,
      action: 'Analyzed quarterly risk exposure',
      result: 'Low risk detected',
      duration: 1250,
      success: true
    });
  };
  
  return <button onClick={handleClick} disabled={isLoading}>Run Analysis</button>;
}
```

---

# CHANGELOG

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-12-20 | Initial release with 48 agents across 12 verticals |

---

*Datacendia™ — Vertical AI Agents for Every Industry*
