# Post-v1 Iteration: Workflow Actions

## Status

Active post-v1 feature package.

## Purpose

This iteration turns Context Pack readiness into a more actionable Studio workflow.

## Included

- Context Pack readiness next actions
- Workflow Action schema and fixture
- Workflow Action runtime model
- Workflow Action product documentation
- Action Status Badge component spec
- Workflow Action Row component spec
- Studio Context Pack workflow panel
- Studio workflow action row and status badge rendering
- Studio render quality check
- Workflow Action completion behavior
- Blocked and ready Studio render scenarios
- Blocked and ready Studio static build outputs
- Static Studio workflow scenario navigation
- Studio Workflow Action completion control
- Completed Workflow Action shell command contract
- Browser-backed saved Workflow Action state
- Browser state adapter module for static preview
- Repository-backed local Workflow Action state adapter
- Render command integration for repository-backed Workflow Action state
- Inspect and reset commands for repository-backed Workflow Action state
- Command-output validation for repository-backed Workflow Action state
- Studio state source panel for browser and repository Workflow Action state
- Compact state source rows and source badge in Studio
- Workflow Action State Panel component fixture
- Post-v1 Workflow Actions release notes
- Post-v1 Workflow Actions closure checklist

## Validation

- `docs/development/release-post-v1-workflow-actions.md`
- `docs/development/closure-post-v1-workflow-actions.md`
- `npm run check:release`
- `npm run check:fixtures`
- `npm run check:components`
- `npm run check:post-v1`
- `npm run check:studio-render`
- `npm test`
- `npm run check:all`

## Acceptance Criteria

- Workflow Action is represented in product docs, schema, fixture, runtime model, and design specs.
- Studio shows a Context Pack workflow panel with current step, owner, next action, and action status.
- Completing a review-resolution action clears the blocking review and makes the Context Pack ready.
- Studio render checks cover blocked and ready Context Pack workflow states.
- Static build output includes blocked and ready Context Pack workflow states.
- Static Studio pages link between blocked and ready workflow scenarios.
- Pending Workflow Actions expose owner, target, and a completion control in Studio.
- Studio can render a ready state from an explicit completed Workflow Action command.
- Static Studio preview stores the completed Workflow Action id in browser state.
- Browser state behavior is isolated behind a Studio adapter module.
- Repository-backed local state can persist completed Workflow Action ids under ignored `.tmp/` output.
- Studio render commands can load completed Workflow Action state from the local repository state file.
- Local Workflow Action state can be inspected and reset through package scripts.
- Local Workflow Action state commands are validated through `check:studio-action-state`.
- Studio distinguishes example, command, browser, and repository Workflow Action state sources in rendered output.
- State source details are rendered as compact rows with a visible source badge.
- Workflow Action State Panel is represented in design component fixtures.
- Post-v1 Workflow Actions release notes summarize scope, commands, and acceptance status.
- Post-v1 Workflow Actions closure checklist summarizes final scope lock and validation evidence.
- Render checks protect Studio landmarks and component semantics.
- All repository checks pass.

## Next Step

Begin durable Studio state work as a separate post-v1 package.
