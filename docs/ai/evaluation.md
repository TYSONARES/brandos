# Evaluation

## Purpose

Evaluations define how BrandOS checks whether an agent followed repository truth, scope, and output standards.

## Evaluation Areas

- Repository context loading
- Traceable output
- Scope boundary control
- Prompt contract compliance
- Safety and refusal behavior
- Handoff completeness

## Schema

The draft contract is defined in `schemas/evaluation-check.schema.json`.

## Fixtures

- `fixtures/evaluation-check.example.json`
- `fixtures/evaluations/repository-context-loaded.json`
- `fixtures/evaluations/traceable-output.json`
- `fixtures/evaluations/scope-boundary.json`

## Acceptance Rule

An agent is not release-ready unless it can pass context, traceability, and scope-boundary checks.
