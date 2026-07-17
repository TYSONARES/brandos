# ADR 0020: Infrastructure v0.6 Complete

- Status: accepted
- Date: 2026-07-18
- Owner: BrandOS maintainers

## Context

BrandOS needed repository-level infrastructure contracts before development readiness could depend on stable
environment, deployment, observability, secret, and operational expectations.

## Decision

Infrastructure v0.6 is complete at the repository definition level. The official infrastructure baseline
includes environment sets, deployment targets, observability signals, secret policies, backup expectations,
incident procedures, release operations, cost controls, and CI/CD validation contracts.

## Consequences

- v1.0 Development Ready can connect implementation scaffolding to stable infrastructure expectations.
- Future runtime and provider choices must map back to v0.6 infrastructure contracts.
- Production provisioning remains deferred until BrandOS has implementation code that requires it.
