# Agent Handoff Runtime v1.2 Release Notes: Agent Prompt Plan

## Status

Release candidate.

## Purpose

This package converts ready Agent Handoff Context into a deterministic prompt plan for agent work.

## Included Changes

- Added `createAgentPromptPlan` to the domain use-case layer.
- Added blocked and ready prompt plan states.
- Added Agent Prompt Plan to BrandOS Studio.
- Added an Agent Prompt Plan component fixture.
- Extended Agent Handoff Runtime validation to require prompt plan behavior.
- Added render, build, domain, and Studio tests for blocked and ready prompt planning.

## Runtime Result

Studio now shows whether prompt planning is allowed. Blocked previews prevent drafting and route back
to Operator Runbook Execution, while ready previews define the agent, objective, source policy, prompt
sections, guardrails, and next workflow for Agent Draft Execution.

## Validation

- `npm run check:agent-handoff-runtime`
- `npm run check:components`
- `npm run check:development`
- `npm run check:development-release`
- `npm run check:studio-render`
- `npm run check:studio-build`
- `npm test`
- `npm run check:all`

## Acceptance Checklist

- [x] Agent Prompt Plan use case exists.
- [x] Blocked prompt plans do not allow drafting.
- [x] Ready prompt plans route to Agent Draft Execution.
- [x] Studio panel exists.
- [x] Component fixture exists.
- [x] Runtime quality gate requires prompt plan behavior.
- [x] Full repository validation passed.

## Follow-Up

The next v1.2 package should add Agent Draft Execution.
