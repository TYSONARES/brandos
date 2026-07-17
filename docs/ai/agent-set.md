# Agent Set

## Purpose

The v0.4 agent set defines the first BrandOS agent roles before runtime implementation.

## Agent Files

- `fixtures/agents/brand-context-steward.json`
- `fixtures/agents/product-spec-assistant.json`
- `fixtures/agents/design-system-assistant.json`
- `fixtures/agents/review-qa-assistant.json`
- `fixtures/agents/repository-maintenance-assistant.json`

## Rules

- Agents must declare required repository context.
- Agents must name task boundaries.
- Agents must produce traceable outputs.
- Agents must include guardrails that prevent chat-only source truth.

## First Set

- Brand Context Steward
- Product Spec Assistant
- Design System Assistant
- Review and QA Assistant
- Repository Maintenance Assistant
