# Post-v1 Release Notes: Studio Diagnostics

## Status

Release candidate.

## Purpose

This release package gives the Studio shell a dedicated diagnostics surface for runtime, product, readiness,
and state signals. It does not change Product Core behavior or the durable Studio state contract.

## User-Facing Changes

- Studio includes a dedicated diagnostics section.
- Diagnostics show package count, product object count, readiness blockers, state source, state status, and result.
- Diagnostics include check rows for package loading, product objects, context readiness, state source, and state status.
- Blocked and ready Studio scenarios show different diagnostic results.

## Repository Changes

- Added Studio Diagnostics iteration documentation.
- Added Studio Diagnostics Panel component fixture.
- Added diagnostics fields to the Studio shell model.
- Added diagnostics panel rendering and responsive layout styles.
- Added render, build, component, and test coverage for diagnostics fields and checks.

## Commands

- `npm run render:studio`
- `npm run render:studio -- --complete-workflow-action=workflow_action_example_001`
- `npm run check:components`
- `npm run check:studio-render`
- `npm test`
- `npm run check:all`

## Acceptance Checklist

- [x] Studio renders a dedicated diagnostics section.
- [x] Diagnostics summarize package count, object count, readiness blockers, state source, state status, and result.
- [x] Diagnostics expose check rows for runtime, product, readiness, and state signals.
- [x] Diagnostics work for blocked and ready Studio scenarios.
- [x] The component fixture captures the diagnostics panel contract.
- [x] Render and build quality gates cover diagnostics fields.

## Follow-Up

The next package should start broader operator guidance as a separate post-v1 package.
Closure status is tracked in `docs/development/closure-post-v1-studio-diagnostics.md`.
