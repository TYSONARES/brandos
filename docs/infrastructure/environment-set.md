# Environment Set

## Purpose

The v0.6 environment set defines where BrandOS work can be validated or run.

## Environment Files

- `fixtures/environments/local.json`
- `fixtures/environments/preview.json`
- `fixtures/environments/staging.json`
- `fixtures/environments/production.json`

## Rules

- Environments must define data policy and constraints.
- Production requires release approval, observability, incident response, and rollback coverage.
- Local and preview environments must not use production secrets or customer data.
