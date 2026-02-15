# Enterprise Services Suite Workflows

> **Directory:** `backend/src/services/enterprise/`
> **Purpose:** 15 vertical enterprise intelligence modules — each a standalone AI-powered domain engine that plugs into the core platform.

## Enterprise Suite Overview

```mermaid
flowchart TB
    subgraph "Enterprise Intelligence Suite"
        direction TB
        subgraph "Revenue & Growth"
            RAIN["CendiaRainmaker™<br/>Sales & Deal Intelligence"]
            GUARD["CendiaGuardian™<br/>Customer Success & Retention"]
            EQUITY["CendiaEquity™<br/>Investor Relations"]
        end

        subgraph "Operations"
            FACTORY["CendiaFactory™<br/>Manufacturing & Production"]
            NERVE["CendiaNerve™<br/>IT Ops & Infrastructure"]
            PROCURE["CendiaProcure™<br/>Procurement & Sourcing"]
            TRANSIT["CendiaTransit™<br/>Travel & Executive Security"]
            HABITAT["CendiaHabitat™<br/>Facilities & Real Estate"]
        end

        subgraph "People & Culture"
            ACADEMY["CendiaAcademy™<br/>Learning & Development"]
            SCOUT["CendiaScout™<br/>Talent Acquisition"]
            MESH["CendiaMesh™<br/>M&A Culture Integration"]
        end

        subgraph "Strategy & IP"
            REGENT["CendiaRegent™<br/>CEO Shadow Cabinet"]
            INVENTUM["CendiaInventum™<br/>R&D / IP Management"]
            RESONANCE["CendiaResonance™<br/>Corporate Communications"]
            DOCKET["CendiaDocket™<br/>Legal Operations"]
        end
    end

    RAIN & GUARD & EQUITY & FACTORY & NERVE --> LLM["Ollama LLM"]
    PROCURE & TRANSIT & HABITAT & ACADEMY & SCOUT --> LLM
    MESH & REGENT & INVENTUM & RESONANCE & DOCKET --> LLM

    style RAIN fill:#10b981,color:#fff
    style GUARD fill:#10b981,color:#fff
    style FACTORY fill:#3b82f6,color:#fff
    style NERVE fill:#3b82f6,color:#fff
    style ACADEMY fill:#8b5cf6,color:#fff
    style REGENT fill:#f59e0b,color:#fff
    style DOCKET fill:#ef4444,color:#fff
```

---

## CendiaRainmaker™ — Sales & Deal Intelligence

```mermaid
flowchart TD
    A["Deal Entered / CRM Sync"] --> B["analyzeDeal()"]
    B --> C["LLM: Score probability, identify blockers"]
    C --> D{Deal At Risk?}
    D -->|Yes| E["generateInterventions()"]
    E --> F["LLM: Unblock strategy + coaching tips"]
    D -->|No| G["Track & Monitor"]

    H["Sales Call Recorded"] --> I["analyzeCall()"]
    I --> J["LLM: Extract objections, sentiment, next steps"]
    J --> K["whisperCoaching: real-time tips"]

    L["Deal Stalled"] --> M["generateExecutiveLetter()"]
    M --> N["LLM: Draft C-level letter to unblock"]
    N --> O["Purpose: unblock / escalate / close / save"]

    style A fill:#10b981,color:#fff
    style H fill:#3b82f6,color:#fff
    style L fill:#f59e0b,color:#fff
```

## CendiaGuardian™ — Customer Success & Retention

```mermaid
flowchart TD
    A["Customer Portfolio"] --> B["assessHealth(customerId)"]
    B --> C["Score Components: engagement, adoption, support,<br/>contract, champion, competitive"]
    C --> D["LLM: Generate risk factors + opportunities"]
    D --> E{Health Score < 70?}
    E -->|Yes| F["predictChurn()"]
    F --> G["LLM: Churn probability + prevention strategy"]
    G --> H["Generate interventionROI estimate"]
    E -->|No| I["identifyOpportunities()"]
    I --> J["Upsell / Expansion / Referral / Case Study"]

    K["Trigger: Contract Expiring"] --> L["generateRenewalPlaybook()"]
    L --> M["LLM: Personalized renewal strategy"]

    style E fill:#ef4444,color:#fff
    style I fill:#10b981,color:#fff
```

## CendiaFactory™ — Manufacturing & Production Intelligence

```mermaid
flowchart TD
    A["IoT Sensor Data Stream"] --> B["Monitor Production Lines"]
    B --> C["Equipment: vibration, temp, power, runtime"]

    C --> D["predictFailures()"]
    D --> E["LLM: Analyze sensor patterns"]
    E --> F{Failure Predicted?}
    F -->|Yes| G["Create PredictiveFailure Alert"]
    G --> H["recommendedAction + partToOrder"]
    H --> I["estimatedDowntime + estimatedCost"]
    F -->|No| J["Normal Operations"]

    K["Production Data"] --> L["optimizeYield()"]
    L --> M["LLM: Analyze current vs potential output"]
    M --> N["Recommendations: parameter changes, scheduling"]
    N --> O["costSavings + qualityImpact estimates"]

    style D fill:#f59e0b,color:#fff
    style L fill:#10b981,color:#fff
```

## CendiaNerve™ — IT Operations & Infrastructure

```mermaid
flowchart TD
    A["System Monitoring"] --> B["Service Health Checks"]
    B --> C{Service Degraded/Down?}
    C -->|Yes| D["Create Incident"]
    D --> E["analyzeIncident()"]
    E --> F["LLM: Root cause analysis"]
    F --> G["Generate resolution steps"]

    C -->|No| H["Continuous Monitoring"]

    I["Security Event"] --> J["detectThreat()"]
    J --> K["LLM: Classify threat type"]
    K --> L{Severity Critical?}
    L -->|Yes| M["activateLazarusProtocol()"]
    M --> N["Isolate → Backup → Rebuild"]
    N --> O["Step-by-step auto-recovery"]
    L -->|No| P["Standard containment"]

    Q["generatePostmortem()"] --> R["LLM: Timeline + lessons + action items"]

    style D fill:#ef4444,color:#fff
    style M fill:#ef4444,color:#fff
    style Q fill:#3b82f6,color:#fff
```

## CendiaRegent™ — CEO Shadow Cabinet

```mermaid
flowchart TD
    A["CEO Submits Strategic Question"] --> B["consultAdvisors()"]
    B --> C["Summon Historical Advisors"]

    subgraph "Shadow Cabinet"
        D["Steve Jobs<br/>Product & Design"]
        E["Machiavelli<br/>Power & Strategy"]
        F["Sun Tzu<br/>Military Strategy"]
        G["Warren Buffett<br/>Investment"]
        H["Catherine the Great<br/>Institutional Building"]
    end

    C --> D & E & F & G & H
    D --> I["Each: LLM with advisor persona"]
    E --> I
    F --> I
    G --> I
    H --> I
    I --> J["Collect All Perspectives"]
    J --> K["generateSynthesis()"]
    K --> L["Combined strategic recommendation"]

    M["mirrorAnalysis()"] --> N["LLM: Find CEO blind spots + biases"]
    N --> O["uncomfortableTruth: what no one else will say"]
    O --> P["dataContradictions + recommended action"]

    style A fill:#6366f1,color:#fff
    style M fill:#ef4444,color:#fff
    style O fill:#f59e0b,color:#fff
```

## CendiaScout™ — Talent Acquisition

```mermaid
flowchart TD
    A["Define Role Requirements"] --> B["profileTopPerformers()"]
    B --> C["LLM: Build ideal PsychometricProfile"]
    C --> D["cognitiveStyle, riskTolerance,<br/>collaborationPreference, communicationStyle"]

    D --> E["buildShadowPipeline()"]
    E --> F["Always-ready candidate pools per role"]
    F --> G["Source: LinkedIn, GitHub, Referral, Inbound"]

    H["Candidate Enters Pipeline"] --> I["assessCandidate()"]
    I --> J["LLM: Match against ideal profile"]
    J --> K["matchScore (0-100) + matchReasons"]

    L["Monitor"] --> M["generateTalentAlerts()"]
    M --> N["key_departure_risk / pipeline_empty /<br/>market_opportunity / competitor_hiring"]

    style A fill:#6366f1,color:#fff
    style E fill:#3b82f6,color:#fff
    style I fill:#10b981,color:#fff
    style M fill:#f59e0b,color:#fff
```

## CendiaMesh™ — M&A Culture Integration

```mermaid
flowchart TD
    A["M&A Target Identified"] --> B["buildCultureProfile(company)"]
    B --> C["LLM: Assess values, decision-making,<br/>communication, work style, leadership"]

    D["compareCultures(acquirer, target)"] --> E["LLM: Score compatibility 0-100"]
    E --> F["Identify alignments + conflicts"]
    F --> G["riskAreas + synergies"]

    G --> H{Compatibility < 50?}
    H -->|Yes| I["HIGH RISK: Major integration challenges"]
    H -->|No| J["generateIntegrationPlan()"]
    J --> K["LLM: Phase-by-phase integration roadmap"]
    K --> L["Cultural bridge strategies per conflict area"]

    style D fill:#6366f1,color:#fff
    style I fill:#ef4444,color:#fff
    style J fill:#10b981,color:#fff
```

## CendiaProcure™ — Procurement & Sourcing

```mermaid
flowchart TD
    A["Vendor Contracts Loaded"] --> B["analyzeContract()"]
    B --> C["Calculate: usage vs capacity,<br/>market benchmark comparison"]
    C --> D["targetReduction = min(25%, usage + market adj)"]
    D --> E["Generate Leverage Points"]
    E --> F["LLM: Draft negotiation script"]
    F --> G["LLM: Draft email to vendor"]
    G --> H["Priority based on daysUntilRenewal"]
    H --> I["executeNegotiation()"]
    I --> J["Track: originalPrice → negotiatedPrice"]
    J --> K["Record savingsAchieved + savingsPercent"]

    style A fill:#6366f1,color:#fff
    style F fill:#3b82f6,color:#fff
    style K fill:#10b981,color:#fff
```

## Remaining Enterprise Services (Summary)

```mermaid
graph TD
    subgraph "CendiaAcademy™"
        AC1["Employee Skill Profiles"]
        AC2["LLM: Personalized Learning Paths"]
        AC3["Adaptive Assessments"]
        AC4["Gap Analysis + Certification Tracking"]
    end

    subgraph "CendiaEquity™"
        EQ1["Market Sentiment Analysis"]
        EQ2["LLM: Earnings Call Prep"]
        EQ3["Language Impact Simulation"]
        EQ4["Analyst Rating Tracking"]
    end

    subgraph "CendiaHabitat™"
        HA1["IoT Zone Sensors (temp, CO2, light, noise)"]
        HA2["LLM: BioSync Recommendations"]
        HA3["Space Utilization Analytics"]
        HA4["Break + Wellness Scheduling"]
    end

    subgraph "CendiaTransit™"
        TR1["Travel Risk Assessment per Country"]
        TR2["LLM: Security Plans for VIPs"]
        TR3["7 Risk Categories (political→natural disaster)"]
        TR4["Lazarus Emergency Protocols"]
    end

    subgraph "CendiaResonance™"
        RE1["Communication Campaigns"]
        RE2["LLM: Message Sentiment Analysis"]
        RE3["Multi-channel Distribution"]
        RE4["Stakeholder Impact Scoring"]
    end

    subgraph "CendiaDocket™"
        DO1["Legal Matter Management"]
        DO2["LLM: Litigation Win Probability"]
        DO3["Discovery + Document Analysis"]
        DO4["Settlement Recommendations"]
    end

    subgraph "CendiaInventum™"
        IN1["Idea Capture from 6 Sources"]
        IN2["LLM: Novelty + Feasibility Scoring"]
        IN3["Patent Lifecycle Management"]
        IN4["IP Monetization Analysis"]
    end
```

## Key Code References

| Service | File | Key Function | LLM-Powered |
|---------|------|-------------|-------------|
| **Rainmaker** | `CendiaRainmakerService.ts` | `predictDeal()`, `analyzeCall()`, `generateExecutiveLetter()` | ✅ |
| **Guardian** | `CendiaGuardianService.ts` | `assessHealth()`, `predictChurn()`, `generateRenewalPlaybook()` | ✅ |
| **Factory** | `CendiaFactoryService.ts` | `predictFailures()`, `optimizeYield()` | ✅ |
| **Nerve** | `CendiaNerveService.ts` | `analyzeIncident()`, `detectThreat()`, `activateLazarusProtocol()` | ✅ |
| **Regent** | `CendiaRegentService.ts` | `consultAdvisors()`, `mirrorAnalysis()` | ✅ |
| **Scout** | `CendiaScoutService.ts` | `profileTopPerformers()`, `assessCandidate()`, `buildShadowPipeline()` | ✅ |
| **Mesh** | `CendiaMeshService.ts` | `buildCultureProfile()`, `compareCultures()`, `generateIntegrationPlan()` | ✅ |
| **Procure** | `CendiaProcureService.ts` | `analyzeContract()`, `executeNegotiation()` | ✅ |
| **Academy** | `CendiaAcademyService.ts` | `assessSkills()`, `generateLearningPath()`, `identifyGaps()` | ✅ |
| **Equity** | `CendiaEquityService.ts` | `analyzeSentiment()`, `prepEarningsCall()`, `simulateLanguageImpact()` | ✅ |
| **Habitat** | `CendiaHabitatService.ts` | `monitorZones()`, `generateBioSync()`, `analyzeUtilization()` | ✅ |
| **Transit** | `CendiaTransitService.ts` | `assessTravelRisk()`, `generateSecurityPlan()` | ✅ |
| **Resonance** | `CendiaResonanceService.ts` | `createCampaign()`, `analyzeSentiment()`, `optimizeMessage()` | ✅ |
| **Docket** | `CendiaDocketService.ts` | `analyzeLitigation()`, `calculateWinProbability()` | ✅ |
| **Inventum** | `CendiaInventumService.ts` | `captureIdea()`, `analyzeNovelty()`, `managePatent()` | ✅ |
