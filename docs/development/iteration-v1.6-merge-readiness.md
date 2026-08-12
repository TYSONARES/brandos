# Repository Collaboration Workflow v1.6 Iteration: Merge Readiness

## Status

In progress.

## Purpose

Turn review evidence into deterministic merge readiness before repository collaboration aggregation.

## Scope

- Add a domain use case that maps Review Evidence Summary into blocked or ready merge readiness.
- Render Merge Readiness as a dedicated Studio panel.
- Add a component fixture for the merge readiness panel.
- Extend validation gates so merge readiness is required by Repository Collaboration Workflow v1.6.
- Keep main branch target, review evidence, release evidence, merge policy, blockers, and next workflow visible without external services.

## Acceptance Criteria

- Blocked merge readiness routes operators back to Review Resolution Workflow.
- Ready merge readiness routes operators to Repository Collaboration Aggregate Summary.
- Merge readiness exposes scenario, state source, state status, completed action count, pull request title, source branch, target branch, review mode, merge policy, main branch status, review evidence status, release evidence status, merge window status, check counts, blocker count, decision, summary, checks, required evidence, blockers, and next workflow.
- Studio renders merge readiness for blocked and ready scenarios.
- Validation covers domain behavior, render output, component fixture, development docs, release gates, Studio build, and full repository checks.

## Validation Commands

- `npm run check:repository-collaboration-workflow`
- `npm run check:components`
- `npm run check:development`
- `npm run check:development-release`
- `npm run check:studio-render`
- `npm run build:studio`
- `npm run check:studio-build`
- `npm test`
- `npm run check:all`

## Follow-Up

After release and closure notes are added, continue with Repository Collaboration Aggregate Summary.
