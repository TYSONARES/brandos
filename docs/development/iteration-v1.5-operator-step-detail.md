# Operator Workflow Design v1.5 Iteration: Operator Step Detail

## Status

In progress.

## Purpose

Make the selected operator task inspectable at the active-step level before handoff readiness.

## Scope

- Add a domain use case that turns Operator Task Selection into deterministic step detail.
- Render Operator Step Detail as a dedicated Studio panel.
- Add a component fixture for the step detail panel.
- Extend validation gates so step detail is required by Operator Workflow Design v1.5.
- Keep blocked and ready step details visible without external services.

## Acceptance Criteria

- Blocked step detail keeps the selected Review Resolution Workflow blocker visible.
- Ready step detail prepares Operator Handoff Readiness for the selected Use Context Pack task.
- The detail exposes scenario, state source, state status, completed action count, selected task, selected workflow, active step, owner, command, outcome, step counts, decision, summary, step details, required evidence, blockers, and next workflow.
- Studio renders step detail for blocked and ready scenarios.
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

After release and closure notes are added, continue with Operator Handoff Readiness.
