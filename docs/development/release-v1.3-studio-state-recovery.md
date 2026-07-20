# Runtime Reliability v1.3 Release Notes: Studio State Recovery

## Status

Release candidate.

## Purpose

This package adds a deterministic Studio state recovery decision for repeated local Studio runs.

## Included Changes

- Added `createStudioStateRecovery` to the domain use-case layer.
- Added ready and needs-recovery state outputs based on Runtime Health Summary.
- Added state source, state status, completed action count, recovery readiness, recovery decision, recovery summary, recovery steps, required evidence, blockers, and next workflow.
- Added Studio State Recovery to BrandOS Studio.
- Added a Studio State Recovery component fixture.
- Added domain, render, build, and runtime reliability checks for needs-recovery and ready states.

## Runtime Result

Studio now explains whether the current local state can be preserved or must be recovered before
repeated local use. Blocked previews turn runtime health attention signals into recovery steps,
while ready previews confirm that the current Studio state can remain the local reliability baseline.

## Validation

- `npm run check:runtime-reliability`
- `npm run check:components`
- `npm run check:development`
- `npm run check:development-release`
- `npm run check:studio-render`
- `npm run check:studio-build`
- `npm test`
- `npm run check:all`

## Acceptance Checklist

- [x] Studio State Recovery use case exists.
- [x] Needs-recovery state maps runtime health attention signals into recovery steps.
- [x] Ready state preserves current Studio state as the local reliability baseline.
- [x] Studio panel exists.
- [x] Component fixture exists.
- [x] Runtime Reliability quality gate requires package behavior.
- [x] Full repository validation passed.

## Follow-Up

The next v1.3 package should add Runtime Validation Signals.
