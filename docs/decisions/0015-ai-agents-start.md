# ADR 0015: AI Agents v0.4 Start

- Status: accepted
- Date: 2026-07-17
- Owner: BrandOS maintainers

## Context

BrandOS now has Product Core and Design System foundations. AI Agents v0.4 must define how agents load
repository truth, respect product and design boundaries, produce traceable outputs, and avoid chat-only assumptions.

## Decision

AI Agents v0.4 will define agent role cards, prompt contracts, context loading rules, memory policy,
evaluation checks, output formats, safety rules, and handoff behavior.

## Consequences

- Agent work must be grounded in repository files.
- Prompt contracts and agent cards must be represented as schemas and fixtures.
- Runtime agent implementation remains out of scope until later releases.
