# ADR 0021: Development Ready v1.0 Start

- Status: accepted
- Date: 2026-07-18
- Owner: BrandOS maintainers

## Context

BrandOS has completed repository-level product, design, AI, architecture, and infrastructure contracts.
The next step is to turn those contracts into an implementation-ready baseline without losing traceability.

## Decision

Development Ready v1.0 will establish the first runnable app shell, package boundaries, local setup rules,
runtime baseline, and quality gates. The implementation will stay minimal and dependency-light until
framework and provider decisions are explicitly recorded.

## Consequences

- v1.0 work can introduce source code for the first time.
- Runtime source must map back to approved repository contracts.
- External dependencies and services remain deferred until justified by implementation needs.
