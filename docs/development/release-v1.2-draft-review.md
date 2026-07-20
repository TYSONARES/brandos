# Agent Handoff Runtime v1.2 Release Notes: Draft Review

## Status

Release candidate.

## Purpose

This package converts Agent Draft Execution output into a deterministic review decision.

## Included Changes

- Added `createDraftReview` to the domain use-case layer.
- Added blocked and approved review states.
- Added review evidence, checks, decision, summary, and next workflow.
- Added Draft Review to BrandOS Studio.
- Added a Draft Review component fixture.
- Extended Agent Handoff Runtime validation to require Draft Review behavior.
- Added render, build, domain, and Studio tests for blocked and approved draft review.

## Runtime Result

Studio now shows whether a draft can move to handoff closure. Blocked previews route back to the
workflow that blocked draft execution, while approved previews confirm the draft body, repository
citations, quality checks, and next workflow.

## Validation

- `npm run check:agent-handoff-runtime`
- `npm run check:components`
- `npm run check:development`
- `npm run check:development-release`
- `npm run check:studio-render`
- `npm run check:studio-build`
- `npm test`
- `npm run check:all`

## Acceptance Checklist

- [x] Draft Review use case exists.
- [x] Blocked review routes back to blocked draft workflow.
- [x] Approved review requires draft body, citations, and quality checks.
- [x] Studio panel exists.
- [x] Component fixture exists.
- [x] Runtime quality gate requires Draft Review behavior.
- [x] Full repository validation passed.

## Follow-Up

The next v1.2 package should add Agent Handoff Closure.
