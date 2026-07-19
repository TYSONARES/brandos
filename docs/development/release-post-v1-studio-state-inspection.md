# Post-v1 Release Notes: Studio State Inspection

## Status

Release candidate.

## Purpose

This release package turns durable Studio state into a dedicated inspection surface in the rendered Studio shell.
The durable state file contract stays stable while users get a clearer view of source, status, version, and action history.

## User-Facing Changes

- Studio includes a dedicated state inspection section.
- The inspection panel shows state source, status, file path, version, latest completed action, latest timestamp, history count, and action ids.
- Repository-backed state renders with loaded status and completed action details.
- Default and command-driven states render readable empty or command-derived inspection values.

## Repository Changes

- Added Studio State Inspection iteration documentation.
- Added Studio State Inspection Panel component fixture.
- Added inspection state fields to the Studio shell model.
- Added inspection panel rendering and responsive layout styles.
- Added render, build, component, and test coverage for inspection fields.

## Commands

- `npm run render:studio`
- `npm run render:studio -- --complete-workflow-action=workflow_action_example_001`
- `npm run persist:studio-action -- --complete-workflow-action=workflow_action_example_001`
- `npm run check:components`
- `npm run check:studio-render`
- `npm test`
- `npm run check:all`

## Acceptance Checklist

- [x] Studio renders a dedicated state inspection section.
- [x] The inspection section shows state source, status, file, version, latest action, latest timestamp, history count, and action ids.
- [x] Default, command, and repository-backed states have readable inspection output.
- [x] The component fixture captures the inspection panel contract.
- [x] Render and build quality gates cover inspection fields.
- [x] Tests cover repository-backed inspection output.

## Follow-Up

The next package should start broader Studio diagnostics as a separate post-v1 package.
Closure status is tracked in `docs/development/closure-post-v1-studio-state-inspection.md`.
