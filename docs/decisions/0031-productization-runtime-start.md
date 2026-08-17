# ADR 0031: Productization Runtime v1.9 Start

- Status: accepted
- Date: 2026-08-17
- Owner: BrandOS maintainers

## Context

BrandOS v1.0.0 has been merged to `main`, tagged, and published as the first repository-backed
Development Ready baseline. Release Governance v1.8 closed the release decision, approval, publication,
rollback, and post-release audit evidence. BrandOS now needs a named productization cycle that turns the
released baseline into usable product-facing runtime packages while preserving repository truth.

## Decision

Start Productization Runtime v1.9. This workstream will define productization scope, inventory product
surfaces, prioritize product workflows, introduce Studio Product Mode, and gather product evidence packs
before aggregate and final closure.

## Consequences

- Release Governance v1.8 remains closed and should not be extended.
- Productization work must be scoped through v1.9 package documents.
- Runtime changes must map back to approved product, design, AI, architecture, infrastructure, or
  development contracts.
- Production deployment, database integration, authentication runtime, external integrations, hosted
  infrastructure, automatic GitHub release publication, and live AI model execution remain out of scope.
- New dependencies require a separate ADR before implementation.
