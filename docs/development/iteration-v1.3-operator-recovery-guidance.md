# Runtime Reliability v1.3 Iteration: Operator Recovery Guidance

## Status

In implementation.

## Purpose

Operator Recovery Guidance turns Runtime Validation Signals into operator-facing recovery instructions.

## Scope

- Add a domain use case that maps validation blocked and ready states into operator guidance.
- Report guidance status, state source, state status, completed action count, decision, summary, steps, signals, commands, evidence, blockers, and next workflow.
- Render Operator Recovery Guidance in BrandOS Studio.
- Add a component fixture for the Operator Recovery Guidance panel.
- Extend Runtime Reliability validation to require operator guidance behavior.

## Acceptance Criteria

- Blocked runtime validation produces action-required operator recovery guidance.
- Ready runtime validation produces guidance that moves toward Runtime Reliability aggregate summary.
- Studio renders recovery steps, validation signals, commands, evidence, blockers, and next workflow as visible text.
- Runtime Reliability quality gate requires the package files and behavior.
- Full repository validation passes.

## Validation

- `npm run check:runtime-reliability`
- `npm run check:components`
- `npm run check:development`
- `npm run check:development-release`
- `npm run check:studio-render`
- `npm run check:studio-build`
- `npm test`
- `npm run check:all`

## Follow-Up

After this package is released and closed, add Runtime Reliability aggregate release notes and closure checklist.
