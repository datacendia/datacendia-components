# Datacendia Platform — WebSocket & Real-time Event Flow

> **Source:** `backend/src/websocket/index.ts`, `backend/src/config/redis.ts`
> **Tech:** Socket.IO + Redis Pub/Sub adapter
> **Port:** Same as API (3001), upgraded connection

## WebSocket Connection Lifecycle

```mermaid
sequenceDiagram
    participant Client as Browser Client
    participant SIO as Socket.IO Server
    participant Auth as JWT Verifier
    participant Redis as Redis Pub/Sub
    participant Room as Room Manager

    Client->>SIO: Connect (token in handshake.auth)
    SIO->>Auth: Verify JWT (jose.jwtVerify)
    Auth-->>SIO: {userId, organizationId}

    alt Valid Token
        SIO->>Room: Join org:{organizationId}
        SIO-->>Client: Connected ✓
    else Invalid Token
        SIO-->>Client: Error: "Invalid token"
    end

    Note over Client,Room: Subscription Phase
    Client->>SIO: subscribe:deliberation (deliberationId)
    SIO->>Room: Join deliberation:{id}
    SIO->>Redis: SUBSCRIBE deliberation:{id}

    Client->>SIO: subscribe:alerts
    SIO->>Room: Join alerts:{orgId}
    SIO->>Redis: SUBSCRIBE alerts:{orgId}

    Client->>SIO: subscribe:health
    SIO->>Room: Join health:{orgId}
    SIO->>Redis: SUBSCRIBE health:{orgId}

    Note over Redis,Client: Event Flow
    Redis-->>SIO: Message on deliberation:{id}
    SIO-->>Client: deliberation:update (data)

    Redis-->>SIO: Message on alerts:{orgId}
    SIO-->>Client: alert:update (data)

    Note over Client,SIO: Disconnection
    Client->>SIO: disconnect
    SIO->>Room: Leave all rooms
    SIO->>Redis: UNSUBSCRIBE channels
```

## Real-time Channel Architecture

```mermaid
flowchart TB
    subgraph "Client Subscriptions"
        C1["subscribe:deliberation"]
        C2["subscribe:workflow"]
        C3["subscribe:alerts"]
        C4["subscribe:health"]
    end

    subgraph "Socket.IO Rooms"
        R1["deliberation:{deliberationId}"]
        R2["workflow:{executionId}"]
        R3["alerts:{organizationId}"]
        R4["health:{organizationId}"]
        R5["org:{organizationId}"]
    end

    subgraph "Redis Pub/Sub Channels"
        P1["deliberation:{id}"]
        P2["workflow:{id}"]
        P3["alerts:{orgId}"]
        P4["health:{orgId}"]
    end

    subgraph "Event Publishers (Backend Services)"
        S1["CouncilService<br/>Agent tokens, consensus, citations"]
        S2["WorkflowEngine<br/>Node progress, completion"]
        S3["AlertService<br/>New alerts, status changes"]
        S4["SystemHealthService<br/>Component health updates"]
        S5["io.broadcastToOrg()<br/>Organization-wide events"]
    end

    C1 --> R1 --> P1
    C2 --> R2 --> P2
    C3 --> R3 --> P3
    C4 --> R4 --> P4

    S1 -->|"pubsub.publish()"| P1
    S2 -->|"pubsub.publish()"| P2
    S3 -->|"pubsub.publish()"| P3
    S4 -->|"pubsub.publish()"| P4
    S5 -->|"io.to(org:id).emit()"| R5

    style S1 fill:#6366f1,color:#fff
    style P1 fill:#ef4444,color:#fff
```

## Council Deliberation Streaming Detail

```mermaid
sequenceDiagram
    participant User
    participant WS as WebSocket
    participant Council as CouncilService
    participant LLM as Ollama LLM
    participant Redis as Redis Pub/Sub

    User->>WS: subscribe:deliberation (id)

    Council->>LLM: Generate Agent 1 response (stream)
    loop Token by Token
        LLM-->>Council: Token chunk
        Council->>Redis: PUBLISH deliberation:{id}
        Redis-->>WS: deliberation:update
        WS-->>User: {type: "token", agent: "Strategist", content: "..."}
    end

    Council->>Redis: PUBLISH deliberation:{id}
    Redis-->>WS: deliberation:update
    WS-->>User: {type: "agent_complete", agent: "Strategist"}

    Note over Council,LLM: Repeat for each agent (3-7 agents)

    Council->>Redis: PUBLISH deliberation:{id}
    Redis-->>WS: deliberation:update
    WS-->>User: {type: "consensus", recommendation: "..."}

    Council->>Redis: PUBLISH deliberation:{id}
    Redis-->>WS: deliberation:update
    WS-->>User: {type: "complete", packet: {...}}
```

## Event Types & Payloads

```mermaid
flowchart LR
    subgraph "deliberation:update Events"
        D1["type: token<br/>agent, content, round"]
        D2["type: agent_complete<br/>agent, position, citations"]
        D3["type: round_change<br/>round, agents_remaining"]
        D4["type: guardrail_trigger<br/>guardrail, action, details"]
        D5["type: consensus<br/>recommendation, confidence"]
        D6["type: complete<br/>deliberationId, packetId"]
    end

    subgraph "workflow:update Events"
        W1["type: node_started<br/>nodeId, nodeName"]
        W2["type: node_completed<br/>nodeId, output"]
        W3["type: approval_required<br/>nodeId, approver"]
        W4["type: workflow_complete<br/>executionId, outputs"]
    end

    subgraph "alert:update Events"
        A1["type: new_alert<br/>severity, title, source"]
        A2["type: alert_acknowledged<br/>alertId, by"]
        A3["type: alert_resolved<br/>alertId, resolution"]
    end

    subgraph "health:update Events"
        H1["type: component_status<br/>component, status, latency"]
        H2["type: health_score<br/>overall, breakdown"]
        H3["type: incident_opened<br/>severity, affected"]
    end
```

## Authentication Flow

```mermaid
flowchart TD
    A["Client connects with JWT token"] --> B["Socket.IO middleware intercepts"]
    B --> C["Extract token from:<br/>handshake.auth.token OR<br/>headers.authorization"]
    C --> D{Token present?}
    D -->|No| E["Error: Authentication required"]
    D -->|Yes| F["jose.jwtVerify(token, JWT_SECRET)"]
    F --> G{Valid?}
    G -->|No| H["Error: Invalid token"]
    G -->|Yes| I["Extract: userId, organizationId"]
    I --> J["Attach to socket object"]
    J --> K["Auto-join org:{organizationId} room"]
    K --> L["Connection established ✓"]

    style F fill:#6366f1,color:#fff
    style E fill:#ef4444,color:#fff
    style L fill:#10b981,color:#fff
```

## Scaling Architecture

```mermaid
flowchart TB
    subgraph "Multi-Instance Scaling"
        I1["API Instance 1<br/>(Socket.IO)"]
        I2["API Instance 2<br/>(Socket.IO)"]
        I3["API Instance N<br/>(Socket.IO)"]
    end

    subgraph "Redis Adapter"
        R["Redis 7<br/>Pub/Sub + Adapter"]
    end

    subgraph "Clients"
        C1["Browser 1"]
        C2["Browser 2"]
        C3["Browser N"]
    end

    C1 --> I1
    C2 --> I2
    C3 --> I3

    I1 <-->|"Redis Adapter"| R
    I2 <-->|"Redis Adapter"| R
    I3 <-->|"Redis Adapter"| R

    style R fill:#ef4444,color:#fff
```

## Key Code References

| Component | File | Purpose |
|-----------|------|---------|
| **WebSocket Setup** | `websocket/index.ts` | Auth middleware, room management, Redis subscriptions |
| **Redis Config** | `config/redis.ts` | `pubsub.subscribe()` / `pubsub.publish()` helpers |
| **Socket.IO Init** | `index.ts:97-105` | Server creation with CORS, ping config |
| **broadcastToOrg** | `websocket/index.ts:135` | Organization-wide broadcast utility |
