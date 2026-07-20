# Iteration v1.2 Agent Handoff Runtime Summary

## Status

Started.

## Purpose

Agent Handoff Runtime Summary aggregates the v1.2 agent handoff pipeline into one auditable runtime status.

## Scope

- Add a domain use case that derives summary state from Agent Handoff Context, Agent Prompt Plan, Agent Draft Execution, Draft Review, and Agent Handoff Closure.
- Report blocked and complete pipeline states.
- Expose stage counts, stage statuses, final decision, final summary, evidence, blockers, and next workflow.
- Render Agent Handoff Runtime Summary in BrandOS Studio.
- Add component fixture and validation coverage for summary states.

## Runtime Contract

Agent Handoff Runtime Summary must expose:

- runtime status
- complete boolean
- operator run id
- handoff id
- context pack id
- stage count
- completed stage count
- blocked stage count
- final decision
- final summary
- stages
- evidence
- blockers
- next workflow

## Source Rule

The summary may only use repository-backed v1.2 runtime outputs. It must not infer stage completion from chat history.

## Studio Surface

BrandOS Studio must show blocked and complete Agent Handoff Runtime Summary states with visible text for:

- status
- completion
- context pack
- stage count
- blocked stage count
- decision
- summary
- next workflow
- stages
- evidence
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
