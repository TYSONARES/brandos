# ADR 0019: Infrastructure v0.6 Start

- Status: accepted
- Date: 2026-07-17
- Owner: BrandOS maintainers

## Context

BrandOS now has architecture boundaries. Infrastructure v0.6 must define environment, deployment,
observability, secrets, backup, incident, and release operations without choosing vendors prematurely.

## Decision

Infrastructure v0.6 will define repository-level infrastructure contracts and operational requirements.

## Consequences

- Infrastructure choices must map back to Architecture v0.5.
- Secrets and production data must not enter repository fixtures.
- Vendor and cloud choices require explicit decision records.
