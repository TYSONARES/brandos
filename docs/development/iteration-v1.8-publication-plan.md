# Release Governance v1.8 Iteration: Publication Plan

## Status

Ready for release.

## Purpose

The Publication Plan package defines the repository-backed plan for publishing a release candidate after
decision and approval evidence are closed. It describes operator steps and boundaries without executing
publication.

## Source Inputs

- `docs/development/v1.8-scope.md`
- `docs/development/closure-v1.8-release-decision-record.md`
- `docs/development/closure-v1.8-release-approval-evidence.md`
- `docs/decisions/0030-release-governance-start.md`

## Publication Plan Fields

- Release candidate identifier.
- Approved source branch.
- Target release tag.
- Publication owner.
- Required pre-publication validation.
- Release note source.
- Publication steps.
- Explicit non-execution boundary.
- Rollback handoff requirement.
- Audit handoff requirement.

## Ready Criteria

- Release Decision Record is closed.
- Release Approval Evidence is closed.
- Publication owner is explicit.
- Pre-publication validation commands are listed.
- Publication steps are documented without executing external automation.
- Rollback and audit handoffs are identified.

## Blocked Criteria

- Approval evidence is missing.
- Source branch or tag is unclear.
- Publication owner is missing.
- Publication plan attempts to execute deployment or external release automation.
- Rollback or audit handoff is missing.

## Validation

- `npm run check:docs`
- `npm run check:development`
- `npm run check:development-release`
- `npm run check:release-governance`
- `npm run check:all`

## Outcome

Publication Plan is ready when release governance can describe how publication would proceed, which
operator owns it, and where rollback and audit responsibilities begin.
