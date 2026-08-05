# Mainline Release Readiness v1.7 Iteration: Main Merge Plan

## Status

In progress.

## Purpose

Turn CI Evidence Summary readiness into an explicit, reversible plan for a main branch merge.

## Scope

- Add a domain use case that turns CI Evidence Summary into blocked or ready main merge plan state.
- Render Main Merge Plan as a dedicated Studio panel.
- Add a component fixture for the main merge plan panel.
- Extend validation gates so main merge planning is required by Mainline Release Readiness v1.7.
- Keep main branch mutation blocked until explicit operator approval outside automated checks.

## Acceptance Criteria

- Blocked main merge plan routes operators back to the active blocker workflow.
- Ready main merge plan routes operators to Release Tag Readiness.
- Main merge plan exposes scenario, state source, state status, completed action count, pull request title, source branch, target branch, review mode, merge policy, main branch status, merge window, CI command, CI status, CI provider, merge strategy, rollback plan, verification command, item counts, blockers, decision, summary, evidence, and next workflow.
- Studio renders main merge plan for blocked and ready scenarios.
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

After release and closure notes are added, continue with Release Tag Readiness.
