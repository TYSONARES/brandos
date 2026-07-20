# Iteration v1.2 Draft Review

## Status

Started.

## Purpose

Draft Review turns Agent Draft Execution output into a deterministic review decision.

## Scope

- Add a domain use case that derives review state from Agent Draft Execution.
- Block draft review until draft execution is allowed.
- Approve ready drafts only when draft body, repository citations, and quality checks pass.
- Render Draft Review in BrandOS Studio.
- Add component fixture and validation coverage for draft review states.

## Runtime Contract

Draft Review must expose:

- review status
- approved boolean
- operator run id
- handoff id
- context pack id
- draft title
- review decision
- review summary
- required evidence
- review checks
- blockers
- next workflow

## Source Rule

Draft Review may only use repository-backed Agent Draft Execution output. Blocked draft review must route back to the workflow that blocked draft execution.

## Studio Surface

BrandOS Studio must show blocked and approved Draft Review states with visible text for:

- status
- approval
- context pack
- draft title
- decision
- summary
- next workflow
- evidence
- checks
- blockers

## Validation

Required checks:

- `npm run check:agent-handoff-runtime`
- `npm run check:components`
- `npm run check:development`
- `npm test`
- `npm run check:studio-render`
- `npm run build:studio`
- `npm run check:studio-build`
- `npm run check:all`
