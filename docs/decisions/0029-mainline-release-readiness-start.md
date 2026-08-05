# ADR 0029: Mainline Release Readiness v1.7 Start

- Status: accepted
- Date: 2026-08-05
- Owner: BrandOS maintainers

## Context

Repository Collaboration Workflow v1.6 closed with deterministic branch, pull request, review evidence,
merge readiness, aggregate, and final closure evidence. The development branch can now progress toward
main, but the repository still needs a named cycle for pull request review packaging, CI evidence,
merge planning, release tag readiness, and final mainline closure.

## Decision

Start Mainline Release Readiness v1.7. This workstream will keep the movement from development branch
to main branch auditable by adding repository-backed review, CI, merge, release tag, aggregate, and
closure packages before any main branch action is treated as complete.

## Consequences

- Repository Collaboration Workflow v1.6 remains closed and should not be extended.
- Mainline readiness work must be scoped through v1.7 package documents.
- Main branch changes require explicit operator approval and repository evidence.
- Production deployment, automatic merge, external release automation, database integration, authentication runtime, and live AI model execution remain out of scope.
- Runtime changes must stay dependency-free unless a later ADR explicitly approves a new dependency.
