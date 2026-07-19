# Post-v1 Iteration: Multi-Action Workflow State

## Status

Active post-v1 feature package.

## Purpose

Multi-Action Workflow State makes durable workflow history visible in Studio. It exposes whether the current
state is empty, single-action, or multi-action, while preserving the existing Studio state adapter contract.

## Scope

- Dedicated Multi-Action Workflow State panel
- Status, state source, completed count, latest completed action, completed action ids, and readiness impact
- Component fixture for the multi-action state panel
- Render, build, component, and Studio test coverage
- Explicit test coverage for a multi-action repository-style scenario

## Validation

- `apps/studio/src/app.mjs`
- `apps/studio/src/render-html.mjs`
- `fixtures/components/multi-action-workflow-state-panel.json`
- `tests/studio/render-html.test.mjs`
- `scripts/check-components.mjs`
- `scripts/check-studio-render.mjs`
- `scripts/check-studio-build.mjs`
- `npm run check:components`
- `npm run check:studio-render`
- `npm test`

## Acceptance Criteria

- Studio renders a dedicated Multi-Action Workflow State section.
- Empty, single, and multiple state summaries are represented as readable text.
- The panel exposes state source, completed count, latest action, action ids, and readiness impact.
- A Studio render test covers multiple completed action ids.
- The component fixture captures the multi-action state panel contract.
- Quality gates cover blocked and ready state summaries.

## Next Step

Add release notes and closure evidence for Multi-Action Workflow State before expanding review resolution workflow.
