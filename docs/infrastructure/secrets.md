# Secrets

## Purpose

Secret policies prevent credentials and sensitive operational values from entering repository truth.

## Rules

- Never commit secret values.
- Document required secret names without values.
- Rotate secrets after exposure or role changes.
- Treat logs and fixtures as public unless classified otherwise.

## Schema

The draft contract is defined in `schemas/secret-policy.schema.json`.

## Fixture

See `fixtures/secret-policy.example.json`.
