# DATACENDIA VERTICAL DASHBOARDS
## Industry-Specific Interactive Visualizations

**Version:** 1.0.0  
**Generated:** December 20, 2025  
**Total Dashboards:** 15 across 12+ verticals

---

# TABLE OF CONTENTS

1. [Overview](#1-overview)
2. [Dashboard Catalog](#2-dashboard-catalog)
3. [Component Reference](#3-component-reference)
4. [Integration Guide](#4-integration-guide)
5. [Widget Configuration](#5-widget-configuration)

---

# 1. OVERVIEW

Vertical Dashboards provide **industry-specific, interactive visualizations** for each supported vertical. Each dashboard includes:

- **Real-time data simulation** with live updates
- **Industry-specific metrics** and KPIs
- **AI Agent panels** showing agent activities
- **Interactive elements** for user engagement
- **Consistent styling** with sovereign theme

---

# 2. DASHBOARD CATALOG

## Core Verticals (Included in Platform)

| Vertical | Component | Key Features |
|----------|-----------|--------------|
| **🚚 Logistics** | `FleetTrackingMap` | Vehicle positions, routes, delivery status |
| **💹 Financial** | `MarketPulse` | Ticker tape, portfolio chart, trading signals |
| **🏥 Healthcare** | `HospitalFloorMap` | Bed occupancy, patient flow, department status |
| **🏭 Manufacturing** | `ProductionLineStatus` | Machine status, OEE, production metrics |
| **💻 Technology** | `SystemHealthMatrix` | Service status, uptime, incident tracking |
| **🏛️ Government** | `CivicSimulation` | Hierarchical simulation, policy impact |
| **⚡ Energy** | `PowerGridVisualization` | Generation, transmission, demand/supply |

## Extended Verticals

| Vertical | Component | Key Features |
|----------|-----------|--------------|
| **🛒 Retail** | `RetailStoreDashboard` | Store heatmap, sales by category, foot traffic |
| **🎓 Education** | `StudentSuccessDashboard` | At-risk students, cohorts, interventions |
| **🏢 Real Estate** | `PropertyPortfolio` | Property map, occupancy, NOI, valuations |
| **⚖️ Legal** | `LegalCaseManagement` | Matter tracking, deadlines, risk scoring |
| **🛡️ Insurance** | `InsuranceClaimsDashboard` | Claims processing, fraud detection, reserves |
| **📡 Telecom** | `TelecomNetworkDashboard` | Cell sites, 5G coverage, subscriber metrics |
| **🏨 Hospitality** | `HospitalityDashboard` | RevPAR, occupancy, booking channels |
| **🌾 Agriculture** | `AgricultureDashboard` | Crop health, weather, yield forecasting |

---

# 3. COMPONENT REFERENCE

## Core Widgets

### FleetTrackingMap (Logistics)
```tsx
import { FleetTrackingMap } from '@/components/dashboard/widgets';

<FleetTrackingMap className="h-[400px]" />
```

**Features:**
- Live vehicle positions with route lines
- Delivery status indicators (on-time, delayed, delivered)
- Driver information and ETA
- AI agents: RouteOptimizer, WarehouseBrain, DemandPredictor

### MarketPulse (Financial)
```tsx
import { MarketPulse } from '@/components/dashboard/widgets';

<MarketPulse className="h-[400px]" />
```

**Features:**
- Live ticker tape with price movements
- Portfolio performance chart
- Market sentiment indicators
- AI agents: RiskSentinel, AlphaHunter, MarketPulse

### HospitalFloorMap (Healthcare)
```tsx
import { HospitalFloorMap } from '@/components/dashboard/widgets';

<HospitalFloorMap className="h-[400px]" />
```

**Features:**
- Interactive floor plan with bed status
- Department occupancy rates
- Patient flow visualization
- AI agents: CareCoordinator, ClinicalAdvisor, CapacityOracle

### ProductionLineStatus (Manufacturing)
```tsx
import { ProductionLineStatus } from '@/components/dashboard/widgets';

<ProductionLineStatus className="h-[400px]" />
```

**Features:**
- Machine status indicators (running, idle, maintenance)
- OEE metrics per line
- Quality metrics and defect rates
- AI agents: ProductionMaster, PredictMaintain, QualityVision

### SystemHealthMatrix (Technology)
```tsx
import { SystemHealthMatrix } from '@/components/dashboard/widgets';

<SystemHealthMatrix className="h-[400px]" />
```

**Features:**
- Service health grid with status indicators
- Uptime percentages and SLA tracking
- Incident timeline
- AI agents: SiteReliability, SecurityFortress, DevVelocity

### CivicSimulation (Government)
```tsx
import { CivicSimulation } from '@/components/dashboard/widgets';

<CivicSimulation className="h-[400px]" />
```

**Features:**
- Hierarchical government structure visualization
- Policy impact simulation
- Budget allocation tracking
- AI agents: PolicyAdvisor, CitizenEngage, BudgetOptimizer

### PowerGridVisualization (Energy)
```tsx
import { PowerGridVisualization } from '@/components/dashboard/widgets';

<PowerGridVisualization className="h-[400px]" />
```

**Features:**
- Grid topology with power flow
- Generation by source (solar, wind, gas, nuclear)
- Demand vs supply balance
- AI agents: GridBalancer, RenewableOptimizer, AssetGuardian

---

## Extended Widgets

### RetailStoreDashboard
```tsx
import { RetailStoreDashboard } from '@/components/dashboard/widgets';

<RetailStoreDashboard className="h-[400px]" />
```

**Features:**
- Store layout heatmap
- Sales by category/department
- Foot traffic patterns
- AI agents: MerchandisingAI, PricingEngine, CustomerInsight

### StudentSuccessDashboard
```tsx
import { StudentSuccessDashboard } from '@/components/dashboard/widgets';

<StudentSuccessDashboard className="h-[400px]" />
```

**Features:**
- At-risk student identification
- Cohort performance tracking
- Intervention recommendations
- AI agents: StudentSuccess, LearningAdvisor, EnrollmentOptimizer

### PropertyPortfolio
```tsx
import { PropertyPortfolio } from '@/components/dashboard/widgets';

<PropertyPortfolio className="h-[400px]" />
```

**Features:**
- Property map with valuations
- Occupancy rates by property
- NOI and cap rate metrics
- AI agents: ValuationEngine, LeaseOptimizer, InvestmentAnalyst

### LegalCaseManagement
```tsx
import { LegalCaseManagement } from '@/components/dashboard/widgets';

<LegalCaseManagement className="h-[400px]" />
```

**Features:**
- Active matters with status
- Deadline calendar
- Risk scoring per case
- AI agents: CaseStrategist, ContractAnalyzer, DiscoveryEngine

### InsuranceClaimsDashboard
```tsx
import { InsuranceClaimsDashboard } from '@/components/dashboard/widgets';

<InsuranceClaimsDashboard className="h-[400px]" />
```

**Features:**
- Claims pipeline visualization
- Fraud detection alerts
- Reserve estimation
- AI agents: UnderwritingAI, ClaimsProcessor, FraudDetector

### TelecomNetworkDashboard
```tsx
import { TelecomNetworkDashboard } from '@/components/dashboard/widgets';

<TelecomNetworkDashboard className="h-[400px]" />
```

**Features:**
- Cell site status map
- 5G/4G coverage visualization
- Subscriber metrics
- AI agents: NetworkOptimizer, ChurnPredictor, CapacityPlanner

### HospitalityDashboard
```tsx
import { HospitalityDashboard } from '@/components/dashboard/widgets';

<HospitalityDashboard className="h-[400px]" />
```

**Features:**
- Property performance cards
- RevPAR and occupancy tracking
- Booking channel distribution
- AI agents: RevenueOptimizer, GuestExperience, DemandForecaster

### AgricultureDashboard
```tsx
import { AgricultureDashboard } from '@/components/dashboard/widgets';

<AgricultureDashboard className="h-[400px]" />
```

**Features:**
- Field status with crop health
- Weather integration
- Yield forecasting
- AI agents: CropDoctor, IrrigationOptimizer, YieldPredictor

---

# 4. INTEGRATION GUIDE

## Using VerticalDashboard Component

The `VerticalDashboard` component automatically renders the appropriate widget based on vertical ID:

```tsx
import { VerticalDashboard } from '@/components/dashboard/VerticalDashboard';

function IndustryPage({ verticalId }: { verticalId: string }) {
  return (
    <VerticalDashboard verticalId={verticalId} />
  );
}
```

## Direct Widget Import

```tsx
import { 
  FleetTrackingMap,
  MarketPulse,
  HospitalFloorMap,
  // ... other widgets
} from '@/components/dashboard/widgets';
```

## Widget File Index

All widgets are exported from:
```typescript
// src/components/dashboard/widgets/index.ts
export { FleetTrackingMap } from './FleetTrackingMap';
export { MarketPulse } from './MarketPulse';
export { HospitalFloorMap } from './HospitalFloorMap';
// ... etc
```

---

# 5. WIDGET CONFIGURATION

## Dashboard Config Structure

Each vertical's widget configuration is defined in:
- `src/config/verticalDashboards.ts` - Core verticals
- `src/config/verticalDashboardsExtended.ts` - Extended verticals

```typescript
interface DashboardWidget {
  id: string;           // Unique widget ID
  type: 'custom' | 'map' | 'chart' | 'list' | 'sankey' | 'treemap' | 'heatmap';
  title: string;
  icon: string;
  size: 'small' | 'medium' | 'large';
}
```

## Widget ID Mapping

| Vertical | Widget ID | Component |
|----------|-----------|-----------|
| logistics | `fleet-tracking` | FleetTrackingMap |
| financial | `market-pulse` | MarketPulse |
| healthcare | `patient-flow` | HospitalFloorMap |
| manufacturing | `production` | ProductionLineStatus |
| technology | `health` | SystemHealthMatrix |
| government | `civic-simulation` | CivicSimulation |
| energy | `grid` | PowerGridVisualization |
| retail | `store-performance` | RetailStoreDashboard |
| education | `student-success` | StudentSuccessDashboard |
| real-estate | `portfolio` | PropertyPortfolio |
| legal | `matters` | LegalCaseManagement |
| insurance | `claims` | InsuranceClaimsDashboard |
| telecom | `network` | TelecomNetworkDashboard |
| hospitality | `property` | HospitalityDashboard |
| agriculture | `field` | AgricultureDashboard |

---

# STYLING

All widgets use the sovereign theme classes:
- `bg-sovereign-base` - Background
- `border-sovereign-border` - Borders
- `text-white` / `text-gray-400` - Text
- Gradient accents per vertical

---

*Datacendia™ — Industry Intelligence, Visualized*
