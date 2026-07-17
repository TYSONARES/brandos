# Auth

## Purpose

Auth boundaries define subject, object, and decision expectations before identity provider selection.

## Rules

- Human roles and AI agents must be distinguishable subjects.
- Approval actions require authorized human roles.
- AI agents can only access explicitly granted context.
- Identity provider selection is out of scope for v0.5.

## Schema

The draft contract is defined in `schemas/auth-boundary.schema.json`.

## Fixture

See `fixtures/auth-boundary.example.json`.
