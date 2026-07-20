# Iteration v1.2 Agent Prompt Plan

## Status

Started.

## Purpose

Agent Prompt Plan turns ready Agent Handoff Context into a deterministic prompt planning surface for agent work.

## Scope

- Add a domain use case that derives prompt planning state from Agent Handoff Context.
- Block prompt planning until accepted handoff context is ready.
- Route ready prompt plans to Agent Draft Execution.
- Render Agent Prompt Plan in BrandOS Studio.
- Add component fixture and validation coverage for prompt plan states.

## Runtime Contract

Agent Prompt Plan must expose:

- prompt status
- prompt allowed boolean
- operator run id
- handoff id
- context pack id
- target agent
- task type
- objective
- source policy
- prompt sections
- guardrails
- blockers
- next workflow

## Source Rule

Prompt plans may only use repository-backed Agent Handoff Context and Context Pack scope. Blocked plans must not fall back to chat history.

## Studio Surface

BrandOS Studio must show blocked and ready Agent Prompt Plan states with visible text for:

- status
- prompt permission
- agent
- context pack
- task type
- objective
- source policy
- next workflow
- sections
- guardrails
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
