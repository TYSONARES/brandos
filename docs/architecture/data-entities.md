# Data Entities

## Purpose

Data entities map Product Core objects to architectural ownership and retention expectations.

## Entity Files

- `fixtures/entities/brand-profile.json`
- `fixtures/entities/claim.json`
- `fixtures/entities/context-pack.json`
- `fixtures/entities/review.json`
- `fixtures/entities/workflow-run.json`

## Rules

- Entities must name an owner service.
- Entity relationships must use Product Core language.
- Retention must be explicit.
- Entity specs are not database table definitions in v0.5.
