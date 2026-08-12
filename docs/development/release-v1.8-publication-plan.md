# Release Governance v1.8 Release Notes: Publication Plan

## Status

Release candidate.

## Purpose

This package adds the Release Governance v1.8 publication plan, making release publication steps
auditable without performing deployment, merge, tag creation, or external automation.

## Added

- Publication fields for candidate, source branch, target tag, owner, validation, release note source,
  planned steps, non-execution boundary, rollback handoff, and audit handoff.
- Ready criteria for moving from approval evidence to rollback readiness.
- Blocked criteria for missing approval evidence, unclear source or tag, missing owner, accidental
  execution, or missing handoffs.
- Quality gate coverage through `check:release-governance`.

## Validation

- `npm run check:docs`
- `npm run check:development`
- `npm run check:development-release`
- `npm run check:release-governance`
- `npm run check:all`

## Acceptance Checklist

- [x] Publication Plan iteration document exists.
- [x] Publication Plan release notes exist.
- [x] Publication Plan closure checklist exists.
- [x] Development index includes the package documents.
- [x] Release Governance quality gate requires the package documents.
- [x] Changelog records the package.
