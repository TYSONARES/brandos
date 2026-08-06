# Release Governance v1.8 Iteration: Rollback Readiness

## Status

Ready for release.

## Purpose

The Rollback Readiness package defines the repository evidence required before a release candidate can
be considered recoverable after publication.

## Source Inputs

- `docs/development/v1.8-scope.md`
- `docs/development/closure-v1.8-release-approval-evidence.md`
- `docs/development/closure-v1.8-publication-plan.md`
- `docs/decisions/0030-release-governance-start.md`

## Rollback Readiness Fields

- Release candidate identifier.
- Rollback owner.
- Rollback trigger conditions.
- Known risky changes.
- Last known stable reference.
- Recovery validation commands.
- Communication owner.
- Post-rollback audit requirement.
- Explicit non-execution boundary.

## Ready Criteria

- Publication Plan is closed.
- Rollback owner is explicit.
- Trigger conditions are documented.
- Last known stable reference is identified.
- Recovery validation commands are listed.
- Communication and audit ownership are clear.

## Blocked Criteria

- Rollback owner is missing.
- Trigger conditions are vague.
- Stable reference is absent.
- Recovery validation is missing.
- The package attempts to execute rollback, deployment, or external automation.

## Validation

- `npm run check:docs`
- `npm run check:development`
- `npm run check:development-release`
- `npm run check:release-governance`
- `npm run check:all`

## Outcome

Rollback Readiness is ready when release governance can prove that publication has a defined recovery
path before the post-release audit package begins.
