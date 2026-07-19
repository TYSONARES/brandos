# Operator Runtime v1.1 Release Notes: Operator Run Queue

## Status

Release candidate.

## Purpose

This package makes Operator Run state visible in Studio as a deterministic queue for the active operator
workflow.

## Included Changes

- Added `createOperatorRunQueue` to summarize Operator Runs as queue items.
- Added an Operator Run Queue panel to Studio.
- Added an Operator Run Queue component fixture.
- Added render and build checks for queue output.
- Added domain and Studio tests for queue behavior.
- Added Operator Runtime validation requirements for the queue package.

## Runtime Result

Studio now shows Operator Run count, blocked count, ready count, active run id, status, priority, owner,
workflow, current action, current action status, next action, handoff id, and audit event count.

## Validation

- `npm run check:components`
- `npm run check:development`
- `npm run check:development-release`
- `npm run check:operator-runtime`
- `npm run check:studio-render`
- `npm run check:studio-build`
- `npm test`
- `npm run check:all`

## Acceptance Checklist

- [x] Queue use case exists.
- [x] Studio panel exists.
- [x] Component fixture exists.
- [x] Render and build checks require queue output.
- [x] Tests cover queue behavior.
- [x] Full repository validation passed.

## Follow-Up

The next v1.1 package should add Operator Runbook Execution so queue items can expand into step-level
operator work.
