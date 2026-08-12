# Runtime Reliability v1.3 Iteration: Runtime Validation Signals

## Status

In implementation.

## Purpose

Runtime Validation Signals turns Studio State Recovery output into deterministic validation signals for repeated local runs.

## Scope

- Add a domain use case that maps recovery ready and needs-recovery states into validation signals.
- Report validation status, state source, state status, completed action count, decision, summary, signals, commands, evidence, blockers, and next workflow.
- Render Runtime Validation Signals in BrandOS Studio.
- Add a component fixture for the Runtime Validation Signals panel.
- Extend Runtime Reliability validation to require validation signal behavior.

## Acceptance Criteria

- Needs-recovery Studio state produces blocked runtime validation signals.
- Ready Studio state produces ready runtime validation signals with repeatable validation commands.
- Studio renders validation signals, commands, evidence, blockers, and next workflow as visible text.
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
