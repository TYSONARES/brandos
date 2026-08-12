# Release Governance v1.8 Release Notes: Release Decision Record

## Status

Release candidate.

## Purpose

This package adds the first Release Governance v1.8 package: a repository-backed Release Decision
Record that defines release candidate evidence before approval, publication, rollback, or audit work.

## Added

- Release decision fields for candidate identity, branch, tag, scope, validation, exclusions, owner,
  publication recommendation, rollback requirement, and audit requirement.
- Ready criteria for moving from mainline readiness to approval evidence.
- Blocked criteria for missing validation, unclear ownership, missing rollback or audit requirements,
  and accidental deployment or external automation execution.
- Quality gate coverage through `check:release-governance`.

## Validation

- `npm run check:docs`
- `npm run check:development`
- `npm run check:development-release`
- `npm run check:release-governance`
- `npm run check:all`

## Acceptance Checklist

- [x] Release Decision Record iteration document exists.
- [x] Release Decision Record release notes exist.
- [x] Release Decision Record closure checklist exists.
- [x] Development index includes the package documents.
- [x] Release Governance quality gate requires the package documents.
- [x] Changelog records the package.
