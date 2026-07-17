# Observability Signals

## Purpose

Observability signals define the operational evidence BrandOS needs for release confidence and incident response.

## Signal Files

- `fixtures/observability/release-validation.json`
- `fixtures/observability/error-rate.json`
- `fixtures/observability/audit-log.json`

## Rules

- Release validation must be auditable.
- Errors and failed workflows must be measurable.
- Approval, deployment, and access-sensitive actions require audit coverage.
