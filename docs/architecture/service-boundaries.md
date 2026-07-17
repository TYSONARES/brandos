# Service Boundaries

## Purpose

Service boundaries define ownership before implementation. They are not deployment units yet.

## Boundary Files

- `fixtures/services/brand-knowledge-service.json`
- `fixtures/services/workflow-service.json`
- `fixtures/services/agent-context-service.json`
- `fixtures/services/review-service.json`
- `fixtures/services/design-reference-service.json`

## Initial Boundaries

- Brand Knowledge Service
- Workflow Service
- Agent Context Service
- Review Service
- Design Reference Service

## Rules

- A service boundary must own clear domains.
- A service boundary must name what it does not own.
- Boundaries must map back to Product Core, Design System, or AI Agent contracts.
- Boundaries do not imply process, deployment, or database separation in v0.5.
