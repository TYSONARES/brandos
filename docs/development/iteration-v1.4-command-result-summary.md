# Studio Workflow Runtime v1.4 Iteration: Command Result Summary

## Status

In progress.

## Purpose

Command Result Summary turns Workflow Transition Plan output into a deterministic command outcome.

## Scope

- Add a domain use case that maps blocked and ready transition plans into command result summaries.
- Render Command Result Summary in BrandOS Studio.
- Add a component fixture for the Command Result Summary panel.
- Extend Studio Workflow Runtime validation to require command result behavior.
- Keep blocked and complete states visible without external services.

## Acceptance Criteria

- Blocked transition produces a blocked command result that stays on the current route.
- Ready transition produces a complete command result that accepts the ready route.
- Command result includes scenario, from route, to route, state source, state status, completed action count, decision, summary, results, signals, evidence, blockers, and next workflow.
- Studio renders blocked and complete command result states.
- Validation covers domain behavior, Studio rendering, component fixture, and build output.

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

After this package is released and closed, add Studio Workflow Runtime Aggregate Summary.
