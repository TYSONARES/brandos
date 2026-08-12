# Studio Workflow Runtime v1.4 Iteration: Studio Workflow Runtime Aggregate Summary

## Status

In progress.

## Purpose

Studio Workflow Runtime Aggregate Summary rolls command result output into release-oriented runtime evidence.

## Scope

- Add a domain use case that maps Command Result Summary into aggregate readiness.
- Render Studio Workflow Runtime Aggregate Summary in BrandOS Studio.
- Add a component fixture for the aggregate summary panel.
- Extend Studio Workflow Runtime validation to require aggregate behavior.
- Keep blocked and ready aggregate states visible without external services.

## Acceptance Criteria

- Blocked command result produces a blocked aggregate summary with blocked command count.
- Complete command result produces a ready aggregate summary with complete command count.
- Aggregate summary includes scenario, state source, state status, completed action count, command counts, decision, summary, command items, evidence, blockers, and next workflow.
- Studio renders blocked and ready aggregate states.
- Validation covers domain behavior, Studio rendering, component fixture, and build output.

## Validation

- `npm run check:studio-workflow-runtime`
- `npm run check:components`
- `npm run check:development`
- `npm run check:development-release`
- `npm run check:studio-render`
- `npm run check:studio-build`
- `npm test`
- `npm run check:all`

## Follow-Up

After this package is released and closed, add Studio Workflow Runtime Final Closure.
