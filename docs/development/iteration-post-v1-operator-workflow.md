# Post-v1 Iteration: Operator Workflow

## Status

Active post-v1 feature package.

## Purpose

Operator Workflow expands operator guidance from a single recommendation into a visible workflow path.
It keeps the same Product Core rules while showing the operator what has been checked, what is active,
and what comes next.

## Scope

- Dedicated operator workflow panel
- Workflow status, active stage, next action, and stage details
- Component fixture for the operator workflow panel
- Blocked and ready Studio scenario coverage
- Render, build, component, and test validation coverage

## Validation

- `apps/studio/src/app.mjs`
- `apps/studio/src/render-html.mjs`
- `fixtures/components/operator-workflow-panel.json`
- `tests/studio/render-html.test.mjs`
- `scripts/check-components.mjs`
- `scripts/check-studio-render.mjs`
- `scripts/check-studio-build.mjs`
- `npm run check:components`
- `npm run check:studio-render`
- `npm test`

## Acceptance Criteria

- Studio renders a dedicated operator workflow section.
- Blocked Studio state shows the active stage as resolving the pending action.
- Ready Studio state shows the active stage as using the Context Pack.
- Workflow status, active stage, next action, stage status, and stage detail are visible text.
- The component fixture captures the operator workflow panel contract.
- Quality gates cover rendered workflow fields in blocked and ready scenarios.

## Next Step

Add release notes and closure evidence for Operator Workflow before expanding workflow execution behavior.
