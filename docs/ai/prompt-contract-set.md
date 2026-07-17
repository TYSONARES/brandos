# Prompt Contract Set

## Purpose

The v0.4 prompt contract set defines how agents load context, bound tasks, format outputs, and refuse unsafe work.

## Prompt Files

- `fixtures/prompts/context-loading.json`
- `fixtures/prompts/product-spec.json`
- `fixtures/prompts/design-system.json`
- `fixtures/prompts/review-qa.json`
- `fixtures/prompts/repository-maintenance.json`

## Rules

- Prompt contracts must name required context first.
- Prompt contracts must define a clear task boundary.
- Prompt contracts must include refusal rules.
- Prompt contracts must map to an agent card by `agentId`.
