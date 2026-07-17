# Deployment Targets

## Purpose

Deployment targets define where release artifacts may be previewed, validated, or promoted.

## Deployment Files

- `fixtures/deployments/docs-preview.json`
- `fixtures/deployments/staging-release-candidate.json`
- `fixtures/deployments/production-release.json`

## Rules

- Deployment targets must reference a valid environment.
- Release gates must be explicit.
- Rollback expectations must be documented before promotion.
