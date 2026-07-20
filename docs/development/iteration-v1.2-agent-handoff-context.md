# Iteration v1.2 Agent Handoff Context

## Status

Started.

## Purpose

Agent Handoff Context turns accepted Operator Runtime handoff state into a deterministic agent work context.

## Scope

- Add a Product Core use case that derives agent handoff context from Handoff Acceptance.
- Keep blocked handoffs routed back to Operator Runbook Execution.
- Expose ready handoffs as Context Pack-backed work for the AI writing agent.
- Render Agent Handoff Context in BrandOS Studio.
- Add component fixture and validation coverage for the new panel.

## Runtime Contract

Agent Handoff Context must expose:

- operator run id
- handoff id
- context pack id
- ready-for-agent boolean
- accepted handoff status
- task type and intended audience
- source count
- required evidence
- blockers
- agent instructions
- next workflow
- next agent

## Source Rule

Agent Handoff Context may only use repository-backed Product Core state, Operator Runbook Execution, Handoff Acceptance, and Context Pack usage flow. It must not depend on chat history.

## Studio Surface

BrandOS Studio must show blocked and ready Agent Handoff Context states with visible text for:

- status
- readiness
- operator run
- context pack
- task type
- next workflow
- next agent
- sources
- evidence
- blockers
- instructions

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
