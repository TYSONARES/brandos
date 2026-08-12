# Release Governance v1.8 Release Notes: Release Approval Evidence

## Status

Release candidate.

## Purpose

This package adds approval evidence requirements for Release Governance v1.8, making release approval
explicit, repository-cited, and separate from publication execution.

## Added

- Approval evidence fields for owner, timestamp, validation commands, decision reference, exclusions,
  publication boundary, rollback readiness, and post-release audit acknowledgment.
- Ready criteria for moving from Release Decision Record closure into Publication Plan.
- Blocked criteria for missing owner, stale validation, missing decision reference, unclear publication
  boundary, or missing rollback and audit acknowledgment.
- Quality gate coverage through `check:release-governance`.

## Validation

- `npm run check:docs`
- `npm run check:development`
- `npm run check:development-release`
- `npm run check:release-governance`
- `npm run check:all`

## Acceptance Checklist

- [x] Release Approval Evidence iteration document exists.
- [x] Release Approval Evidence release notes exist.
- [x] Release Approval Evidence closure checklist exists.
- [x] Development index includes the package documents.
- [x] Release Governance quality gate requires the package documents.
- [x] Changelog records the package.
