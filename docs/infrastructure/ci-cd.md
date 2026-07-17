# CI/CD

## Purpose

CI/CD standards define automated evidence required before release or deployment.

## Rules

- Checks must block release when source-truth validation fails.
- CI commands must be represented in repository scripts.
- Release evidence must be reproducible.

## Schema

The draft contract is defined in `schemas/ci-check.schema.json`.

## Fixture

See `fixtures/ci-check.example.json`.
