# Release Governance v1.8 Iteration: Release Decision Record

## Status

Ready for release.

## Purpose

The Release Decision Record package defines the minimum repository evidence required before a BrandOS
release can move from mainline readiness into release governance.

## Source Inputs

- `docs/development/v1.8-scope.md`
- `docs/development/release-v1.7-final-closure.md`
- `docs/development/closure-v1.7-final-closure.md`
- `docs/decisions/0030-release-governance-start.md`

## Decision Fields

- Release candidate identifier.
- Target branch and target tag.
- Scope summary.
- Required validation commands.
- Known exclusions.
- Approval owner.
- Publication recommendation.
- Rollback requirement.
- Post-release audit requirement.

## Ready Criteria

- The release candidate has a named scope.
- The release candidate cites repository evidence.
- `npm run check:all` has passed before approval.
- Out-of-scope runtime or infrastructure actions are explicitly excluded.
- Main branch or publication actions still require explicit operator approval.

## Blocked Criteria

- Validation evidence is missing.
- Scope is not tied to repository documents.
- Approval owner is unclear.
- Rollback or audit requirement is omitted.
- The package attempts to execute deployment, merge, or external release automation.

## Validation

- `npm run check:docs`
- `npm run check:development`
- `npm run check:development-release`
- `npm run check:release-governance`
- `npm run check:all`

## Outcome

Release Decision Record is ready when release governance can answer whether a candidate may proceed to
approval evidence without relying on chat history or private operator memory.
