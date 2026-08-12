# Repository Collaboration Workflow v1.6 Iteration: Repository Collaboration Aggregate Summary

## Status

In progress.

## Purpose

Aggregate branch, pull request, review evidence, and merge readiness into one repository collaboration summary before final closure.

## Scope

- Add a domain use case that maps Merge Readiness into blocked or ready repository collaboration aggregation.
- Render Repository Collaboration Aggregate Summary as a dedicated Studio panel.
- Add a component fixture for the aggregate summary panel.
- Extend validation gates so aggregate summary is required by Repository Collaboration Workflow v1.6.
- Keep workflow counts, blockers, evidence, decision, summary, and next workflow visible without external services.

## Acceptance Criteria

- Blocked aggregate summary routes operators back to Review Resolution Workflow.
- Ready aggregate summary routes operators to Repository Collaboration Final Closure.
- Aggregate summary exposes scenario, state source, state status, completed action count, pull request title, source branch, target branch, review mode, merge policy, main branch status, merge window status, workflow counts, blocker count, decision, summary, workflow items, required evidence, blockers, and next workflow.
- Studio renders aggregate summary for blocked and ready scenarios.
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

After release and closure notes are added, continue with Repository Collaboration Final Closure.
