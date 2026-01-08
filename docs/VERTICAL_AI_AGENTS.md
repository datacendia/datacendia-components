# DATACENDIA VERTICAL AI AGENTS
## Industry-Specific AI Agent System - Enterprise Platinum Standard

**Version:** 2.0.0  
**Generated:** January 7, 2026  
**Total Agents:** 200+ across 17 verticals  
**Total Council Modes:** 400+ specialized deliberation modes

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

The Vertical AI Agents system provides **industry-specific AI intelligence** for 17 major verticals. Each vertical has 8-25+ specialized agents tailored to that industry's unique needs, terminology, and workflows. Legal leads with 49 council modes and 14 agents.

## Key Features

- **200+ Specialized Agents** across 17 industry verticals
- **400+ Council Modes** - Specialized deliberation scenarios per vertical
- **Model-Optimized** - Each agent uses the most appropriate LLM model (qwq:32b, deepseek-r1:32b, qwen3:32b)
- **Enterprise Platinum Standards** - Sovereignty, auditability, no black boxes
- **Full Stack Integration** - Backend service + REST API + Frontend hooks
- **Real-time Metrics** - Track agent decisions, success rates, latency

## Vertical Coverage Summary

| Vertical | Council Modes | AI Agents | Status |
|----------|---------------|-----------|--------|
| Legal | 49 | 14 | ✅ GA |
| Healthcare | 27 | 8 | ✅ GA |
| Finance | 25 | 8 | ✅ GA |
| Government | 27 | 8 | ✅ GA |
| Insurance | 25 | 8 | ✅ GA |
| Pharmaceutical | 25 | 8 | ✅ GA |
| Manufacturing | 25 | 8 | ✅ GA |
| Energy & Utilities | 25 | 8 | ✅ GA |
| Technology / SaaS | 25 | 8 | ✅ GA |
| Retail & Hospitality | 25 | 22 | ✅ GA |
| Real Estate / Construction | 25 | 23 | ✅ GA |
| Transportation / Logistics | 25 | 19 | ✅ GA |
| Media & Entertainment | 25 | 22 | ✅ GA |
| Professional Services | 25 | 23 | ✅ GA |
| Higher Education | 25 | 21 | ✅ GA |
| Sports / Athletics | 25 | 24 | ✅ GA |
| Pharmaceutical | 25 | 8 | ✅ GA |

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

## Legal / Law Firms (`legal`) ⭐ **NEW - Enterprise Platinum**

**14 Specialized Agents** (8 Default + 6 Optional Specialists)

### Default Agents (8)

| Agent ID | Name | Role | Model |
|----------|------|------|-------|
| `leg-matter-lead` | MatterLead | Matter Management & Strategy AI | deepseek-r1:32b |
| `leg-research-counsel` | ResearchCounsel | Legal Research & Citation AI | qwq:32b |
| `leg-contract-counsel` | ContractCounsel | Contract Analysis & Drafting AI | qwen3:32b |
| `leg-litigation-strategist` | LitigationStrategist | Case Strategy & Trial Prep AI | deepseek-r1:32b |
| `leg-risk-counsel` | RiskCounsel | Risk Assessment & Mitigation AI | qwq:32b |
| `leg-opposing-counsel` | OpposingCounsel | Red Team / Adversarial Testing AI | deepseek-r1:32b |
| `leg-privilege-officer` | PrivilegeOfficer | Privilege Review & Protection AI | qwen3:32b |
| `leg-evidence-officer` | EvidenceOfficer | Evidence Management & Chain of Custody AI | qwen3:32b |

### Optional Specialist Agents (6)

| Agent ID | Name | Role | Model |
|----------|------|------|-------|
| `leg-ip-specialist` | IPSpecialist | Intellectual Property AI | qwq:32b |
| `leg-ma-specialist` | MASpecialist | M&A Due Diligence AI | deepseek-r1:32b |
| `leg-regulatory-specialist` | RegulatorySpecialist | Regulatory Compliance AI | qwen3:32b |
| `leg-employment-specialist` | EmploymentSpecialist | Employment Law AI | qwen3:32b |
| `leg-tax-specialist` | TaxSpecialist | Tax Law AI | qwq:32b |
| `leg-international-specialist` | InternationalSpecialist | Cross-Border & International Law AI | qwen3:32b |

### Legal-Specific Features

- **Case Law Ingestion**: Ingest prior cases, statutes, regulations, firm precedent
- **Citation Enforcement**: No-source-no-claim — every assertion must cite ingested authority
- **Privilege Gates**: Attorney-client privilege preservation with audit trail
- **Matter Management**: Full matter lifecycle tracking with billing integration
- **Compliance Frameworks**: ABA Model Rules, Rule 1.6, SRA (UK), GDPR

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
| `ins-claims-processor` | ClaimsProcessor | Claims Management AI | qwen3:32b |
| `ins-fraud-detector` | FraudDetector | Fraud Detection AI | qwq:32b |
| `ins-actuarial-engine` | ActuarialEngine | Actuarial AI | qwq:32b |

## Sports / Athletics (`sports`) ⭐ **NEW**

**24 Specialized Agents** for professional and collegiate sports organizations.

| Agent ID | Name | Role | Model |
|----------|------|------|-------|
| `sports-gm` | GeneralManager | Roster & Salary Cap AI | deepseek-r1:32b |
| `sports-analytics` | SportsAnalytics | Performance Analytics AI | qwq:32b |
| `sports-coaching` | CoachingStrategy | Game Strategy AI | deepseek-r1:32b |
| `sports-medical` | SportsMedicine | Athlete Health AI | qwen3:32b |
| `sports-business` | BusinessOperations | Revenue Optimization AI | qwen3:32b |
| `sports-scouting` | ScoutingDirector | Talent Evaluation AI | qwq:32b |
| `sports-fan-experience` | FanExperience | Fan Engagement AI | qwen3:32b |
| `sports-venue` | VenueOperations | Stadium Operations AI | qwen3:32b |
| `sports-contracts` | ContractNegotiator | Contract Strategy AI | qwen3:32b |
| `sports-marketing` | SportsMarketing | Brand & Marketing AI | qwen3:32b |
| `sports-player-dev` | PlayerDevelopment | Talent Pipeline AI | qwen3:32b |
| `sports-cfo` | SportsFinance | Team Finance AI | qwq:32b |

## Media & Entertainment (`media`) ⭐ **NEW**

**22 Specialized Agents** for studios, streaming, and content companies.

| Agent ID | Name | Role | Model |
|----------|------|------|-------|
| `media-content` | ContentStrategy | Programming AI | qwen3:32b |
| `media-streaming` | StreamingStrategy | Subscriber Growth AI | qwq:32b |
| `media-analytics` | AudienceAnalytics | Viewership AI | qwq:32b |
| `media-rights` | RightsManagement | IP & Licensing AI | qwen3:32b |
| `media-ad-ops` | AdOperations | Advertising Revenue AI | qwen3:32b |
| `media-production` | ProductionManager | Content Delivery AI | qwen3:32b |
| `media-talent` | TalentManagement | Creative Talent AI | qwen3:32b |
| `media-social` | SocialMedia | Social Engagement AI | qwen3:32b |

## Professional Services (`professional-services`) ⭐ **NEW**

**23 Specialized Agents** for consulting, accounting, and advisory firms.

| Agent ID | Name | Role | Model |
|----------|------|------|-------|
| `ps-engagement` | EngagementManager | Project Delivery AI | qwen3:32b |
| `ps-quality-risk` | QualityRisk | Quality & Independence AI | qwq:32b |
| `ps-practice` | PracticeDevelopment | Business Development AI | qwen3:32b |
| `ps-talent` | TalentManager | Professional Development AI | qwen3:32b |
| `ps-audit` | AuditAssurance | Audit & Assurance AI | qwq:32b |
| `ps-tax` | TaxAdvisory | Tax Strategy AI | qwq:32b |
| `ps-transaction` | TransactionAdvisory | M&A Due Diligence AI | deepseek-r1:32b |
| `ps-methodology` | Methodology | Consulting Frameworks AI | qwen3:32b |

## Transportation / Logistics (`transportation`) ⭐ **NEW**

**19 Specialized Agents** for freight, fleet, and supply chain operations.

| Agent ID | Name | Role | Model |
|----------|------|------|-------|
| `trans-fleet` | FleetManager | Fleet Optimization AI | qwen3:32b |
| `trans-routing` | RouteOptimizer | Route Planning AI | qwq:32b |
| `trans-supply-chain` | SupplyChainStrategy | Network Optimization AI | qwq:32b |
| `trans-safety` | TransSafety | Safety & Compliance AI | qwen3:32b |
| `trans-freight` | FreightManager | Carrier Management AI | qwen3:32b |
| `trans-international` | InternationalLogistics | Global Trade AI | qwen3:32b |
| `trans-last-mile` | LastMile | Delivery Excellence AI | qwen3:32b |
| `trans-analytics` | TransAnalytics | Logistics Analytics AI | qwq:32b |

## Pharmaceutical (`pharmaceutical`) ⭐ **EXPANDED**

**8 Specialized Agents** for drug discovery through commercialization.

| Agent ID | Name | Role | Model |
|----------|------|------|-------|
| `pharma-discovery` | DrugDiscovery | Drug Discovery AI | qwq:32b |
| `pharma-clinical` | ClinicalDevelopment | Clinical Trials AI | qwq:32b |
| `pharma-regulatory` | RegulatoryAffairs | FDA/EMA Submissions AI | qwen3:32b |
| `pharma-commercial` | CommercialPharma | Launch Strategy AI | qwen3:32b |
| `pharma-medical` | MedicalAffairs | Medical Science AI | qwen3:32b |
| `pharma-safety` | Pharmacovigilance | Drug Safety AI | qwen3:32b |
| `pharma-supply` | PharmaSupplyChain | Pharma Supply Chain AI | qwen3:32b |
| `pharma-market-access` | MarketAccess | Payer Strategy AI | qwq:32b |

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
| 2.0.0 | 2026-01-07 | **Major Expansion:** 200+ agents across 17 verticals, 400+ council modes. Added Sports (24 agents), Media (22), Professional Services (23), Transportation (19), Pharmaceutical (8). Expanded Retail (22), Real Estate (23), Education (21). All verticals now have 25+ council modes. |
| 1.1.0 | 2026-01-07 | Legal vertical expanded to 14 agents (8 default + 6 specialists), added case law ingestion, privilege gates, citation enforcement |
| 1.0.0 | 2025-12-20 | Initial release with 48 agents across 12 verticals |

---

*Datacendia™ — Vertical AI Agents for Every Industry*
