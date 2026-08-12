# Studio Workflow Runtime v1.4 Iteration: Workflow Session Summary

## Status

In implementation.

## Purpose

Workflow Session Summary identifies the current Studio workflow, scenario, state source, and next route.

## Scope

- Add a domain use case that summarizes blocked and ready Studio workflow sessions.
- Report session status, workflow name, scenario, current step, action status, state source, state status, completed action count, decision, summary, next route, next workflow, signals, evidence, and blockers.
- Render Workflow Session Summary in BrandOS Studio.
- Add a component fixture for the Workflow Session Summary panel.
- Extend Studio Workflow Runtime validation to require session summary behavior.

## Acceptance Criteria

- Blocked Studio workflow state produces a blocked session with review resolution route.
- Ready Studio workflow state produces a ready session with Workflow Transition Plan route.
- Studio renders session signals, evidence, blockers, next route, and next workflow as visible text.
- Studio Workflow Runtime quality gate requires the package files and behavior.
- Full repository validation passes.

## Validation

- `npm run check:studio-workflow-runtime`
- `npm run check:components`
- `npm run check:development`
- `npm run check:development-release`
- `npm run check:studio-render`
- `npm run check:studio-build`
- `npm test`
- `npm run check:all`

## Follow-Up

After this package is released and closed, add Workflow Transition Plan.
