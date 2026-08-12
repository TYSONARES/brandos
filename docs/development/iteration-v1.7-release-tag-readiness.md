# Mainline Release Readiness v1.7 Iteration: Release Tag Readiness

## Status

In progress.

## Purpose

Turn Main Merge Plan readiness into deterministic release tag evidence without creating a tag.

## Scope

- Add a domain use case that turns Main Merge Plan into blocked or ready release tag readiness state.
- Render Release Tag Readiness as a dedicated Studio panel.
- Add a component fixture for the release tag readiness panel.
- Extend validation gates so release tag readiness is required by Mainline Release Readiness v1.7.
- Keep tag creation blocked until explicit post-merge operator approval outside automated checks.

## Acceptance Criteria

- Blocked release tag readiness routes operators back to the active blocker workflow.
- Ready release tag readiness routes operators to Mainline Aggregate Summary.
- Release tag readiness exposes scenario, state source, state status, completed action count, pull request title, source branch, target branch, review mode, merge policy, main branch status, merge window, CI command, CI status, CI provider, merge strategy, rollback plan, verification command, release version, tag policy, release notes, checklist, item counts, blockers, decision, summary, evidence, and next workflow.
- Studio renders release tag readiness for blocked and ready scenarios.
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

After release and closure notes are added, continue with Mainline Aggregate Summary.
