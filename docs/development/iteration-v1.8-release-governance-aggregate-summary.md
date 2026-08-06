# Release Governance v1.8 Iteration: Release Governance Aggregate Summary

## Status

Ready for release.

## Purpose

The Release Governance Aggregate Summary package rolls every v1.8 governance package into one
repository-backed readiness summary before final closure.

## Included Packages

- Release Decision Record
- Release Approval Evidence
- Publication Plan
- Rollback Readiness
- Post-Release Audit Summary

## Aggregate Criteria

- Every included package has an iteration document.
- Every included package has release notes.
- Every included package has a closure checklist.
- `check:release-governance` requires every included package.
- `check:all` passes after aggregate summary is added.
- No package executes deployment, merge, tag, publication, rollback, or external release automation.

## Validation

- `npm run check:docs`
- `npm run check:development`
- `npm run check:development-release`
- `npm run check:release-governance`
- `npm run check:all`

## Outcome

Release Governance Aggregate Summary is ready when v1.8 can move to final closure with all planned
release governance packages documented, indexed, validated, and closed.
