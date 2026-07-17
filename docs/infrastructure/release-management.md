# Release Management

## Purpose

Release operations define how BrandOS moves from workstream completion to versioned repository truth.

## Rules

- Release notes and completion ADRs are required.
- `npm run check:all` must pass.
- Changelog and version files must be aligned.

## Schema

The draft contract is defined in `schemas/release-operation.schema.json`.

## Fixture

See `fixtures/release-operation.example.json`.
