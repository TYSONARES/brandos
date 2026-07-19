# Post-v1 Release Notes: Durable Studio State

## Status

Release candidate.

## Purpose

This release package moves Studio from action-specific local state into a versioned durable state envelope.
The Workflow Action workflow remains compatible while future Studio features gain a shared state contract.

## User-Facing Changes

- Studio shows durable repository state version and completed action history count.
- Local Studio state can be inspected through a dedicated durable state command.
- Local Studio state can be reset through a dedicated durable state command.
- Workflow Action state commands continue to work against the durable state file.

## Repository Changes

- Added versioned Studio state adapter with a `workflows` namespace.
- Updated the repository Workflow Action adapter to delegate to durable Studio state.
- Added durable state inspect and reset commands.
- Added validation for durable state history, shell option loading, inspect output, reset output, and default path.
- Updated Studio render and build checks for durable state summary fields.

## Commands

- `npm run inspect:studio-state`
- `npm run reset:studio-state`
- `npm run persist:studio-action -- --complete-workflow-action=workflow_action_example_001`
- `npm run render:studio`
- `npm run check:studio-state`
- `npm run check:all`

## Acceptance Checklist

- [x] Studio state has an explicit version.
- [x] Studio state stores Workflow Action completions under a `workflows` namespace.
- [x] Existing Workflow Action state commands continue to work.
- [x] Studio render commands can load completed Workflow Action state from durable state.
- [x] Multiple completed Workflow Actions can be represented in state history.
- [x] Studio output shows durable state version and completed action history count.
- [x] Durable Studio state can be inspected and reset through dedicated commands.
- [x] Quality gates cover durable state adapter, command output, render output, and repository standards.

## Follow-Up

The next package should add richer Studio state inspection views without expanding the durable state file contract.
