# Testing

## Purpose

Testing boundaries define how architecture contracts are validated before implementation.

## Required Checks

- Schema fixtures validate required fields and enums.
- API boundaries reference valid service ids.
- Data entities reference valid owner services.
- Architecture release checks are part of `check:all`.

## Schema

The draft contract is defined in `schemas/test-strategy.schema.json`.

## Fixture

See `fixtures/test-strategy.example.json`.
