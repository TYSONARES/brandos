# Post-v1 Iteration: Studio State Inspection

## Status

Active post-v1 feature package.

## Purpose

Studio State Inspection turns durable Studio state into a clearer Studio review surface. The durable state file
contract remains unchanged while the rendered Studio shell exposes the state summary in a dedicated panel.

## Scope

- Dedicated Studio state inspection panel
- State source, status, file, version, latest action, timestamp, history count, and action id fields
- Component fixture for the inspection panel
- Render, build, and component validation coverage

## Validation

- `apps/studio/src/app.mjs`
- `apps/studio/src/render-html.mjs`
- `fixtures/components/studio-state-inspection-panel.json`
- `tests/studio/render-html.test.mjs`
- `scripts/check-studio-render.mjs`
- `scripts/check-studio-build.mjs`
- `docs/development/release-post-v1-studio-state-inspection.md`
- `npm run check:components`

## Acceptance Criteria

- Studio renders a dedicated state inspection section.
- The inspection section shows durable state source, status, file, version, latest action, latest timestamp, history count, and completed action ids.
- The inspection section works for default, command, and repository-backed state.
- The design component fixture captures the inspection panel contract.
- Quality gates cover rendered Studio inspection fields.
- Studio State Inspection release notes summarize user-facing changes, repository changes, commands, and acceptance status.

## Next Step

Add closure evidence after the inspection panel release notes are stable.
