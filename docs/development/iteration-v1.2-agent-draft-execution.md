# Iteration v1.2 Agent Draft Execution

## Status

Started.

## Purpose

Agent Draft Execution turns a ready Agent Prompt Plan into repository-cited draft output.

## Scope

- Add a domain use case that derives draft execution state from Agent Prompt Plan.
- Block drafting until prompt planning is allowed.
- Generate deterministic example draft text from repository-backed Brand Profile and Context Pack sources.
- Attach citations and quality checks to ready drafts.
- Render Agent Draft Execution in BrandOS Studio.
- Add component fixture and validation coverage for draft execution states.

## Runtime Contract

Agent Draft Execution must expose:

- draft status
- draft allowed boolean
- target agent
- context pack id
- task type
- draft title
- draft body
- source policy
- evidence citations
- quality checks
- blockers
- next workflow

## Source Rule

Draft execution may only use repository-backed Product Core state, Agent Prompt Plan, and Context Pack sources. Blocked drafts must produce no draft body.

## Studio Surface

BrandOS Studio must show blocked and ready Agent Draft Execution states with visible text for:

- status
- draft permission
- agent
- context pack
- task type
- title
- body
- source policy
- next workflow
- citations
- quality checks
- blockers

## Validation

Required checks:

- `npm run check:agent-handoff-runtime`
- `npm run check:components`
- `npm run check:development`
- `npm test`
- `npm run check:studio-render`
- `npm run build:studio`
- `npm run check:studio-build`
- `npm run check:all`
