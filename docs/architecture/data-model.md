# Data Model

## Purpose

Data entity boundaries map Product Core objects to architectural ownership and retention expectations.

## Rules

- Data entities must name their owner service.
- Relationships must use Product Core language.
- Retention expectations must be explicit.
- Database engine selection is out of scope for v0.5.

## Schema

The draft contract is defined in `schemas/data-entity.schema.json`.

## Fixture

See `fixtures/data-entity.example.json`.
