# Release Governance v1.8 Release Notes: Rollback Readiness

## Status

Release candidate.

## Purpose

This package adds rollback readiness requirements for Release Governance v1.8, keeping release recovery
defined before post-release audit closure.

## Added

- Rollback fields for owner, trigger conditions, risky changes, stable reference, recovery validation,
  communication owner, post-rollback audit requirement, and non-execution boundary.
- Ready criteria for moving from Publication Plan closure into Post-Release Audit Summary.
- Blocked criteria for missing owner, vague triggers, absent stable reference, missing validation, or
  accidental rollback and automation execution.
- Quality gate coverage through `check:release-governance`.

## Validation

- `npm run check:docs`
- `npm run check:development`
- `npm run check:development-release`
- `npm run check:release-governance`
- `npm run check:all`

## Acceptance Checklist

- [x] Rollback Readiness iteration document exists.
- [x] Rollback Readiness release notes exist.
- [x] Rollback Readiness closure checklist exists.
- [x] Development index includes the package documents.
- [x] Release Governance quality gate requires the package documents.
- [x] Changelog records the package.
