# Release Governance v1.8 Release Notes: Aggregate Summary

## Status

Release candidate.

## Purpose

This release package summarizes completed Release Governance v1.8 work before final closure.

## Completed Scope

- Release Decision Record
- Release Approval Evidence
- Publication Plan
- Rollback Readiness
- Post-Release Audit Summary

## Release Governance Result

- Release candidate decisions now require repository-backed decision fields.
- Release approval evidence now requires explicit owner, validation, and boundary acknowledgments.
- Publication planning now separates planned operator steps from execution.
- Rollback readiness now requires owner, triggers, stable reference, and recovery validation.
- Post-release audit now requires evidence references, follow-ups, documentation review, and closure
  recommendation.
- `check:release-governance` validates every v1.8 package added so far.

## Validation

- `npm run check:docs`
- `npm run check:development`
- `npm run check:development-release`
- `npm run check:release-governance`
- `npm run check:all`

## Acceptance Checklist

- [x] Release Decision Record is closed.
- [x] Release Approval Evidence is closed.
- [x] Publication Plan is closed.
- [x] Rollback Readiness is closed.
- [x] Post-Release Audit Summary is closed.
- [x] Aggregate summary iteration document exists.
- [x] Aggregate release notes exist.
- [x] Aggregate closure checklist exists.
- [x] Development index includes aggregate documents.
- [x] Release Governance quality gate requires aggregate documents.
- [x] Changelog records aggregate summary.
