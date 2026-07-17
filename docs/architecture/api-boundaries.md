# API Boundaries

## Purpose

API boundaries define how services expose BrandOS objects to humans, AI agents, and future application surfaces.

## API Files

- `fixtures/apis/brand-profile-api.json`
- `fixtures/apis/context-pack-api.json`
- `fixtures/apis/review-api.json`
- `fixtures/apis/workflow-run-api.json`
- `fixtures/apis/design-reference-api.json`

## Rules

- APIs must map to a service boundary by `serviceId`.
- APIs must name consumers and constraints.
- APIs must preserve traceability and status integrity.
- API boundaries are contracts, not implementation routes, in v0.5.
