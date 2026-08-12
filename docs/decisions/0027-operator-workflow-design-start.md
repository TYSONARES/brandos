# ADR 0027: Operator Workflow Design v1.5 Start

- Status: accepted
- Date: 2026-07-22
- Owner: BrandOS maintainers

## Context

Studio Workflow Runtime v1.4 closed with deterministic workflow session, transition, command result,
aggregate, and closure surfaces. Studio can now explain runtime state, but the operator-facing design
of choosing and sequencing work still needs clearer maps, task selection, step detail, and handoff
readiness surfaces.

## Decision

Start Operator Workflow Design v1.5. This workstream will make Studio operator work easier to choose,
inspect, and hand off by adding workflow maps, task selection summaries, step detail, and handoff
readiness without adding external services or live AI model execution.

## Consequences

- Studio Workflow Runtime v1.4 remains closed and should not be extended.
- Operator workflow design work must be scoped through v1.5 package documents.
- AI model execution, external orchestration, database, authentication, and production deployment remain
  out of scope.
- Runtime changes must stay dependency-free unless a later ADR explicitly approves a new dependency.
