# ADR 0023: Operator Runtime v1.1 Start

- Status: accepted
- Date: 2026-07-20
- Owner: BrandOS maintainers

## Context

Development Ready v1.0 established the runnable Studio baseline. The first post-v1 feature implementation
cycle added workflow actions, durable state, diagnostics, audit, review resolution, Context Pack usage,
and operator handoff, then closed with aggregate and final closure documents.

BrandOS now needs a named implementation cycle that turns that surface into an operator runtime without
introducing production infrastructure or external integrations prematurely.

## Decision

Start Operator Runtime v1.1. This workstream will define deterministic operator run state, queue behavior,
runbook execution, and handoff acceptance inside the repository-backed BrandOS Studio baseline.

## Consequences

- The closed post-v1 feature implementation cycle remains stable and should not be extended.
- New operator runtime behavior must be scoped through v1.1 package documents.
- Runtime changes must remain dependency-free unless a later ADR explicitly approves a new dependency.
- Database, authentication, external workflow integration, and AI model execution remain out of scope.
