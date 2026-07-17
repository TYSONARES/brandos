# ADR 0017: Architecture v0.5 Start

- Status: accepted
- Date: 2026-07-17
- Owner: BrandOS maintainers

## Context

BrandOS now has Product Core, Design System, and AI Agent contracts. Architecture v0.5 must define system
boundaries and data/API contracts without prematurely selecting runtime infrastructure.

## Decision

Architecture v0.5 will define service boundaries, API boundaries, data entities, event boundaries, auth and
permission expectations, testing boundaries, and integration constraints.

## Consequences

- Architecture must map back to Product Core domains and AI agent contracts.
- Runtime framework and deployment choices remain out of scope until Infrastructure and Development Ready releases.
- New architectural boundaries must be represented through docs, schemas, fixtures, or decision records.
