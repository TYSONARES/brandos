# Post-v1 Release Notes: Workflow Actions

## Status

Release candidate.

## Purpose

This release package turns Context Pack readiness into an actionable Studio workflow without adding external services.

## User-Facing Changes

- Studio shows Context Pack workflow status, owner, next action, and readiness blockers.
- Pending Workflow Actions expose a completion control.
- Blocked and ready Studio scenarios can be compared through static build output.
- Studio shows the active Workflow Action state source, browser state key, repository state file, and repository state status.
- Local Workflow Action state can be persisted, inspected, reset, and loaded during render.

## Repository Changes

- Added Workflow Action schema, fixture, runtime model, and product documentation.
- Added Action Status Badge, Workflow Action Row, and Workflow Action State Panel component fixtures.
- Added browser-backed and repository-backed Workflow Action state adapters.
- Added validation for Studio render semantics, static build output, and local state command output.

## Commands

- `npm run persist:studio-action -- --complete-workflow-action=workflow_action_example_001`
- `npm run inspect:studio-action`
- `npm run reset:studio-action`
- `npm run render:studio`
- `npm run render:studio -- --ignore-repository-state`
- `npm run check:studio-action-state`
- `npm run check:all`

## Acceptance Checklist

- [x] Workflow Action is represented across product docs, schema, fixture, runtime model, and design specs.
- [x] Studio renders blocked and ready Context Pack workflow states.
- [x] Completing the example review-resolution action clears Context Pack readiness.
- [x] Static Studio builds include blocked and ready scenarios.
- [x] Local Workflow Action state can be persisted, inspected, reset, and loaded during render.
- [x] Browser state and repository state are visibly distinguished in Studio output.
- [x] Quality gates cover render semantics, command output, component fixtures, and repository standards.

## Follow-Up

The next package should move from static/local Workflow Action state into a durable Studio state layer.
Closure status is tracked in `docs/development/closure-post-v1-workflow-actions.md`.
