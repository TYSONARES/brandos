# Post-v1 Release Notes: Multi-Action Workflow State

## Status

Release candidate.

## Purpose

This release package exposes multi-action workflow state in BrandOS Studio. It makes completed action
history visible without changing the existing durable Studio state adapter.

## User-Facing Changes

- Studio includes a dedicated Multi-Action Workflow State section.
- Operators can see whether workflow state is empty, single-action, or multi-action.
- Operators can read state source, completed action count, latest completed action, completed action ids, and readiness impact.
- A multi-action scenario is covered by Studio render tests.

## Repository Changes

- Added Multi-Action Workflow State iteration documentation.
- Added Multi-Action Workflow State component fixture.
- Added multi-action state summary fields to the Studio shell model.
- Added multi-action panel rendering and responsive layout styles.
- Added render, build, component, and Studio test coverage.

## Commands

- `npm run check:components`
- `npm run check:studio-render`
- `npm test`
- `npm run check:all`

## Acceptance Checklist

- [x] Studio renders a dedicated Multi-Action Workflow State section.
- [x] Empty, single, and multiple state summaries are represented as readable text.
- [x] State source, completed count, latest action, action ids, and readiness impact are visible.
- [x] Studio render tests cover multiple completed action ids.
- [x] The component fixture captures the multi-action state panel contract.
- [x] Render and build quality gates cover multi-action fields.

## Follow-Up

The next package should expand review resolution workflow as a separate post-v1 package.
