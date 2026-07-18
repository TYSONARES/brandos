# App Shell

## Purpose

The app shell proves that BrandOS can run from repository-defined contracts.

## Baseline App

The first app is `apps/studio`. It exposes a minimal BrandOS Studio shell with:

- app identity
- release readiness status
- enabled package list
- Product Core model count
- Product Core object count from deterministic example state
- Context Pack readiness from the first domain use-case layer
- next actions for blocked Context Pack readiness
- separated Brand overview and Context Pack workflow panels
- action status for Context Pack workflow next actions
- Action Status Badge and Workflow Action Row render semantics
- HTML rendering for the initial Studio overview
- static HTML build output under `dist/studio/index.html`
- smoke output for CI

## Rules

- The shell must not invent product behavior beyond approved docs.
- The shell must import domain, contract, and design-system package boundaries.
- User-facing implementation details will be added only after v1.0 quality gates are stable.
