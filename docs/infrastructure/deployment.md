# Deployment

## Purpose

Deployment contracts define release targets and gates before production deployment exists.

## Rules

- Deployment targets must name an environment.
- Release gates must include validation evidence.
- Rollback expectations must be documented.

## Schema

The draft contract is defined in `schemas/deployment-target.schema.json`.

## Fixture

See `fixtures/deployment-target.example.json`.

## Deployment Target Set

The draft deployment target set lives in `fixtures/deployments/` and is documented in `docs/infrastructure/deployment-targets.md`.
