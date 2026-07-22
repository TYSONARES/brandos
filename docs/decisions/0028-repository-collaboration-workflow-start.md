# ADR 0028: Repository Collaboration Workflow v1.6 Start

- Status: accepted
- Date: 2026-07-22
- Owner: BrandOS maintainers

## Context

Operator Workflow Design v1.5 closed with deterministic operator workflow map, task selection, step
detail, handoff readiness, aggregate, and final closure surfaces. BrandOS now has a growing local
repository and GitHub remote workflow, but collaboration state such as branch status, pull request
readiness, review evidence, and merge readiness still needs to be represented as repository-backed
truth instead of chat-only instructions.

## Decision

Start Repository Collaboration Workflow v1.6. This workstream will make repository collaboration easier
to inspect and govern by adding branch status, pull request readiness, review evidence, and merge
readiness surfaces without adding external services, production deployment, or live AI model execution.

## Consequences

- Operator Workflow Design v1.5 remains closed and should not be extended.
- Repository collaboration work must be scoped through v1.6 package documents.
- Main branch changes must stay deliberate and auditable through repository evidence.
- External GitHub API automation, authentication runtime, database integration, and production deployment remain out of scope.
- Runtime changes must stay dependency-free unless a later ADR explicitly approves a new dependency.
