# Mainline Release Readiness v1.7 Iteration: Mainline Aggregate Summary

## Status

In progress.

## Purpose

Roll Pull Request Review Package, CI Evidence Summary, Main Merge Plan, and Release Tag Readiness into one final-closure evidence surface.

## Scope

- Add a domain use case that turns Release Tag Readiness into blocked or ready mainline aggregate summary state.
- Render Mainline Aggregate Summary as a dedicated Studio panel.
- Add a component fixture for the mainline aggregate summary panel.
- Extend validation gates so aggregate evidence is required by Mainline Release Readiness v1.7.
- Keep final closure blocked until aggregate evidence is ready and explicit release owner approval is available.

## Acceptance Criteria

- Blocked mainline aggregate summary routes operators back to the active blocker workflow.
- Ready mainline aggregate summary routes operators to Mainline Final Closure.
- Mainline aggregate summary exposes scenario, state source, state status, completed action count, pull request title, source branch, target branch, review mode, merge policy, main branch status, merge window, CI command, CI status, CI provider, merge strategy, rollback plan, verification command, release version, tag policy, release notes, tag checklist, aggregate artifact, closure checklist, item counts, blockers, decision, summary, evidence, and next workflow.
- Studio renders mainline aggregate summary for blocked and ready scenarios.
- Validation covers domain behavior, render output, component fixture, development docs, release gates, Studio build, and full repository checks.

## Validation Commands

- `npm run check:mainline-release-readiness`
- `npm run check:components`
- `npm run check:development`
- `npm run check:development-release`
- `npm run check:studio-render`
- `npm run build:studio`
- `npm run check:studio-build`
- `npm test`
- `npm run check:all`

## Follow-Up

After release and closure notes are added, continue with Mainline Final Closure.
