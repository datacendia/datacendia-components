# CENDIA COUNCIL VIDEO SIMULATION
## Multi-Agent Video Deliberation with Human-Like Avatars

**Version:** 1.0.0  
**Generated:** December 20, 2025  
**Component:** `CouncilVideoSimulation`

---

# TABLE OF CONTENTS

1. [Overview](#1-overview)
2. [Features](#2-features)
3. [Architecture](#3-architecture)
4. [Council Members](#4-council-members)
5. [API Reference](#5-api-reference)
6. [Usage Examples](#6-usage-examples)
7. [Customization](#7-customization)

---

# 1. OVERVIEW

The Council Video Simulation provides a **realistic, animated visualization** of the AI Council deliberation process. It presents 10 C-Suite AI executives as human-like avatars in a video conference format, complete with:

- Real-time speech animations
- Confidence indicators
- Voting visualizations
- Consensus tracking

This component transforms abstract AI deliberations into an intuitive, human-relatable experience.

---

# 2. FEATURES

## Visual Features

| Feature | Description |
|---------|-------------|
| **Human-Like Avatars** | 10 unique personas via DiceBear Personas API |
| **Video Conference Layout** | Grid layout similar to Zoom/Teams |
| **Speaking Indicators** | Animated sound wave bars when speaking |
| **Thinking Animation** | Bouncing dots during processing |
| **Speech Bubbles** | Real-time statement display |
| **Confidence Meters** | Per-agent confidence percentage |

## Deliberation Features

| Feature | Description |
|---------|-------------|
| **Topic Presentation** | Display decision topic with urgency level |
| **Sequential Speaking** | Agents speak in logical order |
| **Role-Specific Statements** | Each agent has domain-appropriate responses |
| **Consensus Tracking** | Real-time alignment progress bar |
| **Voting Phase** | Approve/Reject/Abstain with visual indicators |
| **Decision Conclusion** | Final result with vote breakdown |

## Interactive Features

| Feature | Description |
|---------|-------------|
| **Start/Pause Controls** | Control simulation playback |
| **Live Timer** | Shows elapsed deliberation time |
| **Phase Indicators** | Intro → Deliberating → Voting → Concluded |
| **Participant Count** | Shows number of council members |

---

# 3. ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                 COUNCIL VIDEO SIMULATION                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │                    HEADER BAR                          │     │
│  │  [Council Icon] Council Deliberation 🔴 LIVE           │     │
│  │  Topic: Q1 Market Expansion Strategy                   │     │
│  │                          Timer: 2:45    Consensus: 78%  │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │                    VIDEO GRID (5x2)                    │     │
│  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐              │     │
│  │  │ CEO │ │ CFO │ │ COO │ │CISO │ │ CMO │              │     │
│  │  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘              │     │
│  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐              │     │
│  │  │ CLO │ │CHRO │ │RISK │ │ETHIC│ │DEVIL│              │     │
│  │  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘              │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │              CURRENT SPEAKER HIGHLIGHT                  │     │
│  │  [Avatar] Marcus Williams - CFO                        │     │
│  │  "The financial projections look solid, but we need    │     │
│  │   to stress-test the assumptions."           ✨ 89%    │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │                    CONTROLS                             │     │
│  │  [Pause Simulation]  [🎥]  [🎤]    10 Participants     │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

# 4. COUNCIL MEMBERS

| ID | Name | Title | Role | Avatar |
|----|------|-------|------|--------|
| `chief` | Alexandra Chen | Chief Executive Officer | Strategic synthesis | Professional female |
| `cfo` | Marcus Williams | Chief Financial Officer | Financial analysis | Professional male |
| `coo` | Sarah Mitchell | Chief Operating Officer | Operations | Professional female |
| `ciso` | David Park | Chief Information Security Officer | Security | Professional male |
| `cmo` | Jennifer Lopez | Chief Marketing Officer | Market insights | Professional female |
| `clo` | Robert Thompson | Chief Legal Officer | Legal/compliance | Professional male |
| `chro` | Michelle Obama | Chief Human Resources Officer | HR/people | Professional female |
| `risk` | James Anderson | Chief Risk Officer | Risk assessment | Professional male |
| `ethics` | Dr. Emily Watson | Ethics & Compliance Officer | Ethics review | Professional female |
| `devils-advocate` | Victor Reyes | Devil's Advocate | Challenge assumptions | Professional male |

---

# 5. API REFERENCE

## Component Props

```typescript
interface CouncilVideoSimulationProps {
  topic?: DeliberationTopic;    // Custom topic (optional)
  autoStart?: boolean;          // Auto-start simulation (default: true)
  className?: string;           // Additional CSS classes
  onComplete?: (result: {       // Callback when deliberation completes
    approved: boolean;
    consensus: number;
  }) => void;
}

interface DeliberationTopic {
  id: string;
  title: string;
  description: string;
  category: 'strategic' | 'operational' | 'financial' | 'risk' | 'compliance';
  urgency: 'low' | 'medium' | 'high' | 'critical';
}
```

## State Management

```typescript
interface CouncilMember {
  id: string;
  name: string;
  title: string;
  role: string;
  avatarSeed: string;
  status: 'idle' | 'speaking' | 'thinking' | 'voting' | 'agreed' | 'disagreed';
  vote?: 'approve' | 'reject' | 'abstain';
  confidence?: number;
  currentStatement?: string;
}

interface SimulationState {
  phase: 'intro' | 'presenting' | 'deliberating' | 'voting' | 'concluded';
  currentSpeaker?: string;
  elapsedTime: number;
  consensusLevel: number;
}
```

---

# 6. USAGE EXAMPLES

## Basic Usage

```tsx
import { CouncilVideoSimulation } from '@/components/council';

function DeliberationPage() {
  return (
    <CouncilVideoSimulation className="min-h-[600px]" />
  );
}
```

## Custom Topic

```tsx
import { CouncilVideoSimulation } from '@/components/council';

function DeliberationPage() {
  const topic = {
    id: 'acquisition-2025',
    title: 'Proposed Acquisition of TechCorp',
    description: 'Evaluate $50M acquisition opportunity in AI sector',
    category: 'strategic',
    urgency: 'critical'
  };

  const handleComplete = (result) => {
    console.log(`Decision: ${result.approved ? 'APPROVED' : 'REJECTED'}`);
    console.log(`Consensus: ${result.consensus}%`);
  };

  return (
    <CouncilVideoSimulation 
      topic={topic}
      autoStart={false}
      onComplete={handleComplete}
      className="min-h-[700px]"
    />
  );
}
```

## Embedded in Dashboard

```tsx
import { CouncilVideoSimulation } from '@/components/council';

function ExecutiveDashboard() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="col-span-2">
        <h2>Live Council Session</h2>
        <CouncilVideoSimulation className="rounded-xl" />
      </div>
      <MetricsPanel />
      <ActivityFeed />
    </div>
  );
}
```

---

# 7. CUSTOMIZATION

## Custom Avatar Provider

The component uses DiceBear Personas API by default. To customize:

```tsx
// In RealisticAvatar component
const avatarUrl = `https://api.dicebear.com/7.x/personas/svg?seed=${member.avatarSeed}`;

// Alternative providers:
// - https://api.dicebear.com/7.x/avataaars/svg
// - https://api.dicebear.com/7.x/lorelei/svg
// - https://ui-avatars.com/api/?name=${member.name}
```

## Custom Deliberation Statements

Edit `DELIBERATION_STATEMENTS` in the component:

```typescript
const DELIBERATION_STATEMENTS: Record<string, string[]> = {
  chief: [
    "I've reviewed the proposal and see significant strategic value here.",
    "Let's ensure we have alignment across all departments before proceeding.",
    // Add more statements...
  ],
  cfo: [
    "The financial projections look solid.",
    // Add more statements...
  ],
  // ... other roles
};
```

## Timing Configuration

```typescript
// In useEffect simulation loop
const SPEAKING_DURATION = 4000;  // 4 seconds per speaker
const VOTING_DELAY = 3000;       // 3 seconds for voting phase
const ROUNDS_BEFORE_VOTE = 10;   // 10 speaking rounds before voting
```

---

# INTEGRATION POINTS

| Integration | Description |
|-------------|-------------|
| **Council API** | Connect to real deliberation backend |
| **WebSocket** | Real-time updates from live sessions |
| **Recording** | Export deliberation transcript |
| **Analytics** | Track engagement metrics |

---

*Datacendia™ — Making AI Deliberation Human*
