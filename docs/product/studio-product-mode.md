# Studio Product Mode

## Status

Active for Productization Runtime v1.9.

## Purpose

Studio Product Mode turns the selected product workflow into a product-facing Studio surface. The first
mode is Context Pack Readiness because it connects Product Core state, source evidence, review blockers,
AI context boundaries, and operator next actions.

## Current Mode

- Mode: `context-pack-readiness`
- Selected workflow: Context Pack Readiness
- Primary surface: Context Pack Readiness
- Runtime source: `apps/studio/src/app.mjs`
- Render surface: `apps/studio/src/render-html.mjs`
- Test surface: `tests/studio/render-html.test.mjs`

## Product Behavior

- Show the selected product workflow.
- Show the primary product surface.
- Show a product decision for blocked and ready states.
- Show repository evidence used by the mode.
- Show readiness blockers or `none`.
- Show next actions from Context Pack readiness.

## Boundary

Studio Product Mode remains local, deterministic, and repository-backed. It does not add production
deployment, database integration, authentication runtime, external integrations, hosted services, or live
AI model execution.
