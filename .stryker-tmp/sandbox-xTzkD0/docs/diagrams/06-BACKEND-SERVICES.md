# BACKEND SERVICES INTERACTION

## Service Dependency Graph

```
                         ┌───────────────┐
                         │    OLLAMA     │
                         │   SERVICE     │
                         └───────┬───────┘
                                 │
       ┌─────────────────────────┼─────────────────────────┐
       │                         │                         │
       ▼                         ▼                         ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│ DELIBERATION  │◄─────►│   ENHANCED    │◄─────►│   PANTHEON    │
│   SERVICE     │       │  LLM SERVICE  │       │    MEMORY     │
└───────┬───────┘       └───────────────┘       └───────────────┘
        │
        ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│   SENTRY      │◄─────►│   DECISION    │◄─────►│    AUDIT      │
│   SERVICE     │       │   SERVICE     │       │   SERVICE     │
└───────────────┘       └───────┬───────┘       └───────────────┘
                                │
                                ▼
                       ┌───────────────┐
                       │  NARRATIVES   │
                       │   SERVICE     │
                       └───────┬───────┘
                               │
                               ▼
                       ┌───────────────┐
                       │    EMAIL      │
                       │   SERVICE     │
                       └───────────────┘
```

## Request Processing Flow

```
                         ┌─────────────────────┐
                         │    API REQUEST      │
                         │   (Express Route)   │
                         └──────────┬──────────┘
                                    │
                                    ▼
               ┌────────────────────────────────────────┐
               │         DELIBERATION SERVICE           │
               ├────────────────────────────────────────┤
               │  • Orchestrates multi-agent queries    │
               │  • Manages cross-examination           │
               │  • Synthesizes final decisions         │
               └──────────────────┬─────────────────────┘
                                  │
      ┌───────────────────────────┼───────────────────────────┐
      │                           │                           │
      ▼                           ▼                           ▼
┌────────────────┐     ┌────────────────┐     ┌────────────────┐
│ OLLAMA SERVICE │     │PANTHEON MEMORY │     │ SENTRY SERVICE │
├────────────────┤     ├────────────────┤     ├────────────────┤
│Generate response│     │Fetch context   │     │Check guardrails│
│Stream tokens    │     │Store memories  │     │Filter content  │
│Multi-model      │     │Learn from past │     │Detect PII      │
└───────┬────────┘     └───────┬────────┘     └───────┬────────┘
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               │
                               ▼
               ┌────────────────────────────────────────┐
               │          DECISION SERVICE              │
               ├────────────────────────────────────────┤
               │  • Record decision                     │
               │  • Track lifecycle                     │
               │  • Link outcomes                       │
               └──────────────────┬─────────────────────┘
                                  │
      ┌───────────────────────────┼───────────────────────────┐
      │                           │                           │
      ▼                           ▼                           ▼
┌────────────────┐     ┌────────────────┐     ┌────────────────┐
│ AUDIT SERVICE  │     │NARRATIVES SRVCE│     │ EMAIL SERVICE  │
├────────────────┤     ├────────────────┤     ├────────────────┤
│Log event       │     │Generate summary│     │Send notification│
│Create hash     │     │Create report   │     │Alert stakeholder│
│Ensure compliance│     │Format output   │     │Deliver to inbox │
└────────────────┘     └────────────────┘     └────────────────┘
```

## Service Responsibilities

| Service | Responsibility | Dependencies |
|---------|---------------|--------------|
| **Ollama** | LLM inference, embeddings | None |
| **Deliberation** | Multi-agent orchestration | Ollama, Pantheon, Sentry |
| **Enhanced LLM** | Multi-model routing, optimization | Ollama |
| **Pantheon Memory** | Context retrieval, learning | Ollama |
| **Sentry** | Guardrails, PII detection, bias check | None |
| **Decision** | Decision lifecycle management | Audit, Narratives |
| **Audit** | Compliance logging, hash chains | None |
| **Narratives** | Report generation | Ollama |
| **Email** | Transactional email delivery | None |

## Data Flow Through Services

```
User Query
    │
    ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Pantheon   │────►│   Ollama    │────►│   Sentry    │
│  Context    │     │  Generate   │     │  Guardrails │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                    ┌──────────┴──────────┐
                                    │                     │
                                    ▼                     ▼
                             ┌───────────┐         ┌───────────┐
                             │  PASSED   │         │  BLOCKED  │
                             │  Deliver  │         │   Warn    │
                             └─────┬─────┘         └───────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
             ┌───────────┐  ┌───────────┐  ┌───────────┐
             │  Decision │  │   Audit   │  │ Pantheon  │
             │   Store   │  │    Log    │  │   Store   │
             └───────────┘  └───────────┘  └───────────┘
```
