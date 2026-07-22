# Operator Workflow Design v1.5 Iteration: Operator Workflow Design Final Closure

## Status

In progress.

## Purpose

Convert Operator Workflow Design Aggregate Summary readiness into a deterministic v1.5 closure decision.

## Scope

- Add a domain use case that maps aggregate workflow design readiness into final closure.
- Add a Studio panel that exposes blocked and closed final closure states.
- Add component fixture coverage for the final closure panel.
- Extend Operator Workflow Design validation to require final closure behavior.
- Keep final closure artifacts, checks, evidence, blockers, and next workflow visible without external services.

## Acceptance Criteria

- Blocked aggregate summary produces blocked final closure that keeps v1.5 open.
- Ready aggregate summary produces closed final closure with release artifacts and checks.
- Final closure includes scenario, state source, state status, completed action count, selected task, selected workflow, handoff target, decision, summary, release artifacts, evidence, checks, blockers, and next workflow.
- Studio renders blocked and closed final closure states.
- Validation covers domain behavior, Studio rendering, component fixture, docs, release requirements, Studio build output, and the full repository check.

## Validation

- `npm run check:operator-workflow-design`
- `npm run check:components`
- `npm run check:development`
- `npm run check:development-release`
- `npm run check:studio-render`
- `npm run check:studio-build`
- `npm test`
- `npm run check:all`

## Follow-Up

After this package is released and closed, add Operator Workflow Design v1.5 aggregate release notes.
