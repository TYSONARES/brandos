# Repository Collaboration Workflow v1.6 Iteration: Review Evidence Summary

## Status

In progress.

## Purpose

Turn pull request readiness into deterministic review evidence before merge readiness.

## Scope

- Add a domain use case that maps Pull Request Readiness into blocked or ready review evidence.
- Render Review Evidence Summary as a dedicated Studio panel.
- Add a component fixture for the review evidence summary panel.
- Extend validation gates so review evidence is required by Repository Collaboration Workflow v1.6.
- Keep release notes, closure evidence, unresolved blockers, and next workflow visible without external services.

## Acceptance Criteria

- Blocked review evidence routes operators back to Review Resolution Workflow.
- Ready review evidence routes operators to Merge Readiness.
- Review evidence exposes scenario, state source, state status, completed action count, pull request title, source branch, target branch, review mode, merge policy, release notes status, closure evidence status, evidence counts, unresolved blocker count, decision, summary, evidence items, required evidence, blockers, and next workflow.
- Studio renders review evidence for blocked and ready scenarios.
- Validation covers domain behavior, render output, component fixture, development docs, release gates, Studio build, and full repository checks.

## Validation Commands

- `npm run check:repository-collaboration-workflow`
- `npm run check:components`
- `npm run check:development`
- `npm run check:development-release`
- `npm run check:studio-render`
- `npm run build:studio`
- `npm run check:studio-build`
- `npm test`
- `npm run check:all`

## Follow-Up

After release and closure notes are added, continue with Merge Readiness.
