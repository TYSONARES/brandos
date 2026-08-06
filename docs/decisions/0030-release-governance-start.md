# ADR 0030: Release Governance v1.8 Start

- Status: accepted
- Date: 2026-08-07
- Owner: BrandOS maintainers

## Context

Mainline Release Readiness v1.7 closed with deterministic review, CI evidence, merge plan, release tag,
aggregate, and final closure packages. BrandOS can now describe when mainline readiness is complete, but
it still needs a named cycle for release decision evidence, approval readiness, publication planning,
rollback readiness, and post-release audit closure.

## Decision

Start Release Governance v1.8. This workstream will keep release activity auditable by requiring
repository-backed release decision, approval, publication, rollback, audit, aggregate, and closure
packages before any release is treated as complete.

## Consequences

- Mainline Release Readiness v1.7 remains closed and should not be extended.
- Release governance work must be scoped through v1.8 package documents.
- Main branch changes and publication actions require explicit operator approval and repository evidence.
- Production deployment, automatic GitHub release creation, external release automation, database
  integration, authentication runtime, and live AI model execution remain out of scope.
- Runtime changes must stay dependency-free unless a later ADR explicitly approves a new dependency.
