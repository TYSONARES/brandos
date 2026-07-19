# Post-v1 Iteration: Durable Studio State

## Status

Active post-v1 feature package.

## Purpose

Durable Studio State moves local Studio state from a single Workflow Action result into a versioned Studio
state envelope. This keeps the current Workflow Action workflow intact while giving later Studio features a
shared place to store local state.

## Scope

- Versioned Studio state adapter
- Durable Studio state default file path
- Workflow Action state compatibility layer
- Multi-action completed workflow history
- Studio shell option loading from durable state
- Studio state version and history inspection surface
- Durable Studio state inspect command
- Durable Studio state reset command
- Dedicated durable state quality gate

## Validation

- `apps/studio/src/studio-state-adapter.mjs`
- `apps/studio/src/repository-state-adapter.mjs`
- `tests/studio/render-html.test.mjs`
- `fixtures/components/workflow-action-state-panel.json`
- `scripts/inspect-studio-state.mjs`
- `scripts/reset-studio-state.mjs`
- `docs/development/release-post-v1-durable-studio-state.md`
- `docs/development/closure-post-v1-durable-studio-state.md`
- `scripts/check-studio-state.mjs`
- `npm run check:studio-state`

## Acceptance Criteria

- Studio state has an explicit version.
- Studio state stores Workflow Action completions under a `workflows` namespace.
- Existing Workflow Action state commands continue to work.
- Studio render commands can still load completed Workflow Action state.
- Multiple completed Workflow Actions can be represented without changing the shell command surface.
- Studio output shows durable state version and completed action history count.
- Durable Studio state can be inspected through a dedicated command.
- Durable Studio state can be reset through a dedicated command.
- The default repository-backed local state path is `.tmp/studio-state.json`.
- Durable Studio State release notes summarize user-facing changes, repository changes, commands, and acceptance status.
- Durable Studio State closure checklist summarizes final scope lock and validation evidence.

## Next Step

Add richer Studio state inspection views after the compact state source panel is stable.
