# Mainline Release Readiness v1.7 Iteration: Pull Request Review Package

## Status

In progress.

## Purpose

Map closed Repository Collaboration Workflow v1.6 evidence into a deterministic pull request review
package before CI evidence, merge planning, or release tagging.

## Scope

- Add a domain use case that turns Repository Collaboration Final Closure into blocked or ready pull request review package state.
- Render Pull Request Review Package as a dedicated Studio panel.
- Add a component fixture for the pull request review package panel.
- Extend validation gates so pull request review packaging is required by Mainline Release Readiness v1.7.
- Keep main branch action held until the review package is ready and the operator explicitly approves later mainline steps.

## Acceptance Criteria

- Blocked pull request review package routes operators back to the active blocker workflow.
- Ready pull request review package routes operators to CI Evidence Summary.
- Pull request review package exposes scenario, state source, state status, completed action count, title, source branch, target branch, review mode, merge policy, main branch status, merge window, checklist, summary artifact, item counts, blockers, decision, summary, evidence, and next workflow.
- Studio renders pull request review package for blocked and ready scenarios.
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

After release and closure notes are added, continue with CI Evidence Summary.
