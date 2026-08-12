# Studio Workflow Runtime v1.4 Release Notes: Workflow Session Summary

## Status

Release candidate.

## Purpose

This package adds a deterministic workflow session summary for repeated local Studio workflow runs.

## Included Changes

- Added `createWorkflowSessionSummary` to the domain use-case layer.
- Added blocked and ready session states based on Context Pack readiness and Operator Recovery Guidance.
- Added workflow name, scenario, current step, action status, state source, state status, completed action count, decision, summary, next route, next workflow, signals, evidence, and blockers.
- Added Workflow Session Summary to BrandOS Studio.
- Added a Workflow Session Summary component fixture.
- Added domain, render, build, and Studio Workflow Runtime checks for blocked and ready session states.

## Runtime Result

Studio now shows which workflow session is active, which scenario is being rendered, what state source
is in use, and where the operator should route next. Blocked previews route back to review resolution,
while ready previews route forward to Workflow Transition Plan.

## Validation

- `npm run check:studio-workflow-runtime`
- `npm run check:components`
- `npm run check:development`
- `npm run check:development-release`
- `npm run check:studio-render`
- `npm run check:studio-build`
- `npm test`
- `npm run check:all`

## Acceptance Checklist

- [x] Workflow Session Summary use case exists.
- [x] Blocked state reports scenario, state source, blockers, and review resolution route.
- [x] Ready state reports reusable session state and Workflow Transition Plan route.
- [x] Studio panel exists.
- [x] Component fixture exists.
- [x] Studio Workflow Runtime quality gate requires package behavior.
- [x] Full repository validation passed.

## Follow-Up

The next v1.4 package should add Workflow Transition Plan.
