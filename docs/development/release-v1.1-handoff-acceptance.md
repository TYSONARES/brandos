# Operator Runtime v1.1 Release Notes: Handoff Acceptance

## Status

Release candidate.

## Purpose

This package decides when repository-backed handoff context can be accepted as active work after an
Operator Run reaches a ready state.

## Included Changes

- Added `createHandoffAcceptance` to the domain use-case layer.
- Updated Workflow Action completion so related Operator Runs can move to ready.
- Added a Handoff Acceptance panel to Studio.
- Added a Handoff Acceptance component fixture.
- Added render and build checks for blocked and accepted handoff output.
- Added domain and Studio tests for blocked and accepted handoff behavior.

## Runtime Result

Studio now shows handoff acceptance status, decision, run id, next workflow, required evidence, and
blocked reasons. Blocked previews keep the handoff in Operator Runbook Execution, while ready previews
accept the handoff and move to Context Pack usage.

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

- [x] Handoff acceptance use case exists.
- [x] Operator Run readiness updates when actions complete.
- [x] Studio panel exists.
- [x] Component fixture exists.
- [x] Render and build checks require handoff acceptance output.
- [x] Tests cover blocked and accepted behavior.
- [x] Full repository validation passed.

## Follow-Up

The next v1.1 package should add the Operator Runtime Aggregate Summary.
