# ADR 0012: Product Core v0.2 Complete

- Status: accepted
- Date: 2026-07-17
- Owner: BrandOS maintainers

## Context

BrandOS needed a repository-level Product Core before design, AI agent, architecture, and infrastructure
work could proceed from stable source truth.

## Decision

Product Core v0.2 is complete at the repository definition level. The official Product Core includes
domains, objects, statuses, schemas, fixtures, workflows, roles, permissions, success metrics, and release
criteria documented under `docs/product/`, `schemas/`, and `fixtures/`.

## Consequences

- v0.3 Design System can depend on Product Core objects and workflows.
- v0.4 AI Agents can depend on Context Pack and repository context rules.
- v0.5 Architecture can map services, APIs, and data models to Product Core domains.
- Future changes to Product Core require a decision record or a new versioned product release note.
