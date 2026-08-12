# Release Governance v1.8 Iteration: Release Approval Evidence

## Status

Ready for release.

## Purpose

The Release Approval Evidence package defines the repository evidence required before a release
candidate can move from decision record readiness into publication planning.

## Source Inputs

- `docs/development/v1.8-scope.md`
- `docs/development/iteration-v1.8-release-decision-record.md`
- `docs/development/closure-v1.8-release-decision-record.md`
- `docs/decisions/0030-release-governance-start.md`

## Approval Evidence Fields

- Release candidate identifier.
- Approval owner.
- Approval timestamp.
- Approved validation commands.
- Decision record reference.
- Exclusion acknowledgment.
- Publication boundary acknowledgment.
- Rollback readiness acknowledgment.
- Post-release audit acknowledgment.

## Ready Criteria

- The release decision record is closed.
- The approval owner is explicit.
- Validation commands are cited as passed.
- Out-of-scope actions are acknowledged as excluded.
- Publication, rollback, and post-release audit responsibilities are acknowledged.

## Blocked Criteria

- Approval owner is missing.
- Validation evidence is stale or absent.
- Decision record reference is missing.
- Publication boundary is unclear.
- Rollback or audit acknowledgment is missing.

## Validation

- `npm run check:docs`
- `npm run check:development`
- `npm run check:development-release`
- `npm run check:release-governance`
- `npm run check:all`

## Outcome

Release Approval Evidence is ready when a release candidate can move to publication planning with
clear approval ownership and repository-cited validation evidence.
