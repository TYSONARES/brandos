# Iteration v1.2 Agent Handoff Closure

## Status

Started.

## Purpose

Agent Handoff Closure turns approved Draft Review state into an auditable handoff closure summary.

## Scope

- Add a domain use case that derives closure state from Draft Review.
- Block closure until Draft Review is approved.
- Close agent handoff with closure decision, summary, artifacts, evidence, and checks.
- Render Agent Handoff Closure in BrandOS Studio.
- Add component fixture and validation coverage for closure states.

## Runtime Contract

Agent Handoff Closure must expose:

- closure status
- closed boolean
- operator run id
- handoff id
- context pack id
- closure decision
- closure summary
- closed artifacts
- closure evidence
- closure checks
- blockers
- next workflow

## Source Rule

Agent Handoff Closure may only use repository-backed Draft Review output. Blocked closure must keep the handoff open and preserve upstream blockers.

## Studio Surface

BrandOS Studio must show blocked and closed Agent Handoff Closure states with visible text for:

- status
- closed state
- context pack
- decision
- summary
- next workflow
- artifacts
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
