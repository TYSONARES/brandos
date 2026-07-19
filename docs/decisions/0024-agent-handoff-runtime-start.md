# ADR 0024: Agent Handoff Runtime v1.2 Start

- Status: accepted
- Date: 2026-07-20
- Owner: BrandOS maintainers

## Context

Operator Runtime v1.1 closed with a deterministic Studio surface for Operator Runs, queue state, runbook
execution, and handoff acceptance. Accepted handoff context now needs a named implementation cycle that
turns operator-ready work into agent-ready work while preserving repository-first traceability.

## Decision

Start Agent Handoff Runtime v1.2. This workstream will define deterministic agent handoff context,
agent task packets, inspection behavior, and traceability checks without adding live AI model execution
or external agent orchestration.

## Consequences

- Operator Runtime v1.1 remains closed and should not be extended.
- Agent handoff behavior must be scoped through v1.2 package documents.
- AI model execution, external orchestration, database, authentication, and production deployment remain
  out of scope.
- Runtime changes must stay dependency-free unless a later ADR explicitly approves a new dependency.
