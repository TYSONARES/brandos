# Post-v1 Iteration: Context Pack Usage Flow

## Status

Active post-v1 feature package.

## Purpose

Context Pack Usage Flow makes the ready Context Pack usable as a visible operator and agent-facing flow.
It summarizes the task boundary, audience, source counts, exclusions, and usage steps from repository-backed Product Core data.

## Scope

- Domain use-case for Context Pack usage flow summary
- Dedicated Context Pack Usage Flow panel in Studio
- Component fixture for Context Pack Usage Flow
- Render, build, component, domain, and Studio test coverage
- Blocked and ready Studio scenario visibility

## Validation

- `packages/domain/src/use-cases.mjs`
- `packages/domain/src/index.mjs`
- `apps/studio/src/app.mjs`
- `apps/studio/src/render-html.mjs`
- `fixtures/components/context-pack-usage-flow.json`
- `tests/domain/product-core-use-cases.test.mjs`
- `tests/studio/render-html.test.mjs`
- `scripts/check-components.mjs`
- `scripts/check-studio-render.mjs`
- `scripts/check-studio-build.mjs`
- `npm run check:components`
- `npm run check:studio-render`
- `npm test`

## Acceptance Criteria

- Studio renders a dedicated Context Pack Usage Flow section.
- Usage flow exposes task type, intended audience, owner, expiry, source counts, sections, and exclusions.
- Usage flow exposes ordered usage steps as visible text.
- Domain tests cover usage flow summary data.
- The component fixture captures the usage flow panel contract.
- Quality gates cover usage flow fields in blocked and ready scenarios.

## Next Step

Add release notes and closure evidence for Context Pack Usage Flow before expanding multi-action workflow state.
