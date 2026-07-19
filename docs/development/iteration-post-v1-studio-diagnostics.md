# Post-v1 Iteration: Studio Diagnostics

## Status

Active post-v1 feature package.

## Purpose

Studio Diagnostics gives the Studio shell a broader operational health surface. It summarizes runtime,
product, readiness, and state signals without changing Product Core behavior or the durable Studio state contract.

## Scope

- Dedicated Studio diagnostics panel
- Package, object, readiness blocker, state source, state status, and result fields
- Component fixture for the diagnostics panel
- Render, build, component, and test validation coverage

## Validation

- `apps/studio/src/app.mjs`
- `apps/studio/src/render-html.mjs`
- `fixtures/components/studio-diagnostics-panel.json`
- `tests/studio/render-html.test.mjs`
- `scripts/check-studio-render.mjs`
- `scripts/check-studio-build.mjs`
- `npm run check:components`

## Acceptance Criteria

- Studio renders a dedicated diagnostics section.
- Diagnostics summarize package count, object count, readiness blockers, state source, state status, and result.
- Diagnostics work for blocked and ready Studio scenarios.
- The design component fixture captures the diagnostics panel contract.
- Quality gates cover rendered Studio diagnostics fields.

## Next Step

Add release notes after the diagnostics panel is stable.
