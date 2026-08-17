# Product Surface Inventory

## Status

Active for Productization Runtime v1.9.

## Purpose

This inventory identifies the BrandOS product surfaces that can move from repository-backed evidence to
usable runtime experience. A surface is productization-ready only when it maps to existing product,
design, AI, architecture, infrastructure, and development contracts.

## Surface Categories

### Operator-Facing Surfaces

These surfaces are immediately eligible for Studio productization because they support repository
operators working with BrandOS evidence.

| Surface | Primary User | Source Contracts | Productization Readiness | Next Package |
| --- | --- | --- | --- | --- |
| Brand Profile Overview | Operator | `docs/product/brand-profile.md`, `packages/domain/src/use-cases.mjs` | Ready for refinement | Product Workflow Prioritization |
| Context Pack Readiness | Operator | `docs/product/context-pack.md`, `docs/ai/context-loading.md` | Ready for refinement | Product Workflow Prioritization |
| Workflow Action State | Operator | `docs/product/workflow-action.md`, `docs/development/iteration-post-v1-workflow-actions.md` | Ready for refinement | Product Workflow Prioritization |
| Operator Run Summary | Operator | `docs/product/operator-run.md`, `docs/development/v1.1-scope.md` | Ready for refinement | Product Workflow Prioritization |
| Release Evidence Summary | Operator | `docs/development/v1.7-scope.md`, `docs/development/v1.8-scope.md` | Needs product grouping | Product Evidence Pack |

### Future Customer-Facing Surfaces

These surfaces are valuable product candidates but should not become customer-facing until Studio Product
Mode proves the operator workflow.

| Surface | Primary User | Source Contracts | Productization Readiness | Boundary |
| --- | --- | --- | --- | --- |
| Brand Workspace Home | Brand team | `docs/product/core-domains.md`, `docs/product/objects.md` | Needs information architecture | No hosted workspace yet |
| Evidence Library | Brand team | `docs/product/source-claim-decision.md` | Needs review workflow mapping | No database yet |
| Decision Review Queue | Brand lead | `docs/product/review-model.md`, `docs/product/workflows/run-review.md` | Needs workflow priority decision | No authentication yet |
| AI Context Pack Builder | Strategist | `docs/product/context-pack.md`, `docs/ai/prompt-contracts.md` | Needs AI execution boundary | No live AI model execution |

## Selection Rules

1. Prefer surfaces that can run from existing fixtures and in-memory Product Core state.
2. Prefer operator-facing surfaces before customer-facing surfaces.
3. Do not introduce production deployment, database, authentication, external integrations, or live AI
   execution in Productization Runtime v1.9.
4. Every selected surface must point back to repository contracts and validation evidence.

## Productization Candidate

The first productization candidate is Studio Product Mode for operator-facing Brand Profile Overview,
Context Pack Readiness, Workflow Action State, and Operator Run Summary.
