# Operator Workflow Design v1.5 Iteration: Operator Workflow Map

## Status

In progress.

## Purpose

Map the current Studio/operator runtime state into deterministic operator workflow paths before task selection.

## Scope

- Add a domain use case that turns Studio workflow runtime final closure into a blocked or ready operator workflow map.
- Render the Operator Workflow Map as a dedicated Studio panel.
- Add a component fixture for the map panel.
- Extend validation gates so the map is required by Operator Workflow Design v1.5.
- Keep blocked and ready outcomes visible without external services.

## Acceptance Criteria

- Blocked maps route operators to Review Resolution Workflow.
- Ready maps route operators to Operator Task Selection.
- The map exposes scenario, state source, state status, completed action count, path counts, decision, summary, path details, required evidence, blockers, and next workflow.
- Studio renders the map for blocked and ready scenarios.
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

After release and closure notes are added, continue with Operator Task Selection.
