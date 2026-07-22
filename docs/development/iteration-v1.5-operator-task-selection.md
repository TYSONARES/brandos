# Operator Workflow Design v1.5 Iteration: Operator Task Selection

## Status

In progress.

## Purpose

Select the next operator task from the workflow map and explain why that task should be handled next.

## Scope

- Add a domain use case that turns Operator Workflow Map readiness into deterministic task selection.
- Render the Operator Task Selection as a dedicated Studio panel.
- Add a component fixture for the task selection panel.
- Extend validation gates so task selection is required by Operator Workflow Design v1.5.
- Keep blocked and ready task decisions visible without external services.

## Acceptance Criteria

- Blocked selections choose the Review Resolution Workflow blocker resolution task.
- Ready selections choose the Use Context Pack task and move toward Operator Step Detail.
- The selection exposes scenario, state source, state status, completed action count, selected task, selected workflow, task counts, decision, summary, options, required evidence, blockers, and next workflow.
- Studio renders task selection for blocked and ready scenarios.
- Validation covers domain behavior, render output, component fixture, development docs, release gates, Studio build, and full repository checks.

## Validation Commands

- `npm run check:operator-workflow-design`
- `npm run check:components`
- `npm run check:development`
- `npm run check:development-release`
- `npm run check:studio-render`
- `npm run build:studio`
- `npm run check:studio-build`
- `npm test`
- `npm run check:all`

## Follow-Up

After release and closure notes are added, continue with Operator Step Detail.
