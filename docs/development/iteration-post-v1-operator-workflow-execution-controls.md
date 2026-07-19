# Post-v1 Iteration: Operator Workflow Execution Controls

## Status

Active post-v1 feature package.

## Purpose

Operator Workflow Execution Controls turns the visible operator workflow into a controlled action surface.
It does not introduce new workflow rules; it exposes the active control for the current blocked or ready scenario.

## Scope

- Dedicated execution controls inside the Operator Workflow panel
- Blocked-state form control for completing the pending Workflow Action
- Ready-state link control for using the Context Pack
- Component fixture for operator workflow execution controls
- Render, build, component, and test validation coverage

## Validation

- `apps/studio/src/app.mjs`
- `apps/studio/src/render-html.mjs`
- `fixtures/components/operator-workflow-execution-controls.json`
- `tests/studio/render-html.test.mjs`
- `scripts/check-components.mjs`
- `scripts/check-studio-render.mjs`
- `scripts/check-studio-build.mjs`
- `npm run check:components`
- `npm run check:studio-render`
- `npm test`

## Acceptance Criteria

- Studio renders execution controls inside the Operator Workflow panel.
- Blocked Studio state exposes a form control for completing the pending Workflow Action.
- Ready Studio state exposes a link control for using the Context Pack.
- Control label, command, status, and expected result are visible text.
- The component fixture captures the execution control contract.
- Quality gates cover blocked and ready execution controls.

## Next Step

Add release notes and closure evidence for Execution Controls before expanding Context Pack usage flow.
