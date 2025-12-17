# ADR 001: Multi-Agent Council Architecture

## Status
Accepted

## Date
2024-12-01

## Context
The Datacendia platform requires a system for AI-assisted decision making that provides diverse perspectives, maintains audit trails, and supports enterprise governance requirements. We needed to decide between:

1. **Single LLM approach** - One model providing recommendations
2. **Chain-of-thought approach** - Sequential reasoning steps
3. **Multi-agent council approach** - Multiple specialized agents deliberating

## Decision
We chose the **Multi-Agent Council Architecture** with the following design:

### Agent Specialization
- Each agent has a distinct personality, expertise area, and reasoning style
- Agents include: Strategist, Analyst, Skeptic, Ethics Officer, Risk Manager, etc.
- Custom agents can be defined per organization

### Deliberation Process
1. Query is presented to selected agents
2. Each agent provides independent analysis
3. Agents can respond to each other's points
4. Consensus/dissent is synthesized
5. Final recommendation includes confidence scores

### Technical Implementation
- Ollama for local LLM inference (privacy-first)
- Agent personalities defined in configuration
- Structured output format with Zod validation
- Real-time streaming via WebSockets

## Consequences

### Positive
- **Diverse perspectives**: Multiple viewpoints reduce blind spots
- **Transparency**: Each agent's reasoning is visible
- **Auditability**: Complete deliberation trail stored
- **Customizable**: Organizations can tune agent mix
- **Bias detection**: Dissenting views surface concerns

### Negative
- **Latency**: Multiple LLM calls increase response time
- **Complexity**: More moving parts to maintain
- **Token cost**: Higher token usage per query
- **Consistency**: Same query may yield different results

### Mitigations
- Parallel agent execution where possible
- Caching for similar queries
- Deterministic replay mode for reproducibility
- Rate limiting and priority queues

## References
- [Council Service Implementation](../../backend/src/services/council/)
- [Agent Personality Configuration](../../src/data/councilModes.ts)
- [Deliberation API Routes](../../backend/src/routes/council.ts)
