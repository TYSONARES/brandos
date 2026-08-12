# Repository Collaboration Workflow v1.6 Iteration: Pull Request Readiness

## Status

In progress.

## Purpose

Map repository branch status into deterministic pull request readiness before review evidence.

## Scope

- Add a domain use case that turns Repository Branch Status into blocked or ready pull request readiness.
- Render Pull Request Readiness as a dedicated Studio panel.
- Add a component fixture for the pull request readiness panel.
- Extend validation gates so pull request readiness is required by Repository Collaboration Workflow v1.6.
- Keep blocked and ready pull request outcomes visible without external services.

## Acceptance Criteria

- Blocked pull request readiness routes operators back to Review Resolution Workflow.
- Ready pull request readiness routes operators to Review Evidence Summary.
- Pull request readiness exposes scenario, state source, state status, completed action count, title, source branch, target branch, remote branch, review mode, merge policy, check counts, decision, summary, checks, required evidence, blockers, and next workflow.
- Studio renders pull request readiness for blocked and ready scenarios.
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

After release and closure notes are added, continue with Review Evidence Summary.
