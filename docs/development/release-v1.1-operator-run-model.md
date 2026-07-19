# Operator Runtime v1.1 Release Notes: Operator Run Model

## Status

Release candidate.

## Purpose

This package adds the first Operator Runtime v1.1 product model so BrandOS can represent a unit of
operator work independently from a raw Workflow Run.

## Included Changes

- Added the Operator Run product contract.
- Added `schemas/operator-run.schema.json`.
- Added `fixtures/operator-run.example.json`.
- Registered Operator Run as a Product Core runtime model.
- Added deterministic example state for one Operator Run.
- Added `createOperatorRunSummary` to resolve linked Workflow Run and Workflow Action state.
- Added Operator Runtime validation through `npm run check:operator-runtime`.
- Added test coverage for Operator Run summary behavior.

## Runtime Result

The in-memory Product Core baseline now contains eight runtime models and eight deterministic example
objects. Operator Run summary output includes status, priority, linked workflow, action counts, current
action state, handoff id, audit event count, and owner.

## Validation

- `npm run check:fixtures`
- `npm run check:development`
- `npm run check:operator-runtime`
- `npm run check:studio-render`
- `npm test`
- `npm run check:all`

## Acceptance Checklist

- [x] Product documentation exists.
- [x] Schema and fixture exist.
- [x] Runtime model registration exists.
- [x] Example state includes one Operator Run.
- [x] Domain summary use case resolves linked state.
- [x] Operator Runtime quality gate exists.
- [x] Full repository validation passed.

## Follow-Up

The next v1.1 package should add an Operator Run Queue surface to Studio.
