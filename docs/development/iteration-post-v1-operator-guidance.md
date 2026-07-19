# Post-v1 Iteration: Operator Guidance

## Status

Active post-v1 feature package.

## Purpose

Operator Guidance turns Studio diagnostics into a clear next-step surface for the person using Studio. It
does not change workflow rules; it makes the current recommended action visible.

## Scope

- Dedicated operator guidance panel
- Recommended action, reason, command, and status fields
- Component fixture for the guidance panel
- Render, build, component, and test validation coverage

## Validation

- `apps/studio/src/app.mjs`
- `apps/studio/src/render-html.mjs`
- `fixtures/components/operator-guidance-panel.json`
- `tests/studio/render-html.test.mjs`
- `scripts/check-studio-render.mjs`
- `scripts/check-studio-build.mjs`
- `npm run check:components`

## Acceptance Criteria

- Studio renders a dedicated operator guidance section.
- Blocked Studio state recommends resolving readiness blockers.
- Ready Studio state recommends using the Context Pack.
- Guidance exposes reason, command, and status as readable text.
- The design component fixture captures the guidance panel contract.
- Quality gates cover rendered guidance fields.

## Next Step

Add release notes after the operator guidance panel is stable.
