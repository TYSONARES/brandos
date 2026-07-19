# Post-v1 Release Notes: Context Pack Usage Flow

## Status

Release candidate.

## Purpose

This release package adds a visible Context Pack usage flow to BrandOS Studio. It turns the Context Pack
from a readiness target into a readable task boundary and usage sequence for operators and AI agents.

## User-Facing Changes

- Studio includes a dedicated Context Pack Usage Flow section.
- Operators can see task type, intended audience, owner, expiry, source counts, sections, and exclusions.
- Operators can read ordered usage steps for loading context, applying task boundaries, respecting exclusions, and following agent instructions.
- Blocked and ready scenarios both expose the usage flow so the target state stays visible.

## Repository Changes

- Added Context Pack Usage Flow iteration documentation.
- Added Context Pack Usage Flow component fixture.
- Added a domain use-case for Context Pack usage summaries.
- Added Studio shell and render support for the usage flow.
- Added render, build, component, domain, and Studio test coverage.

## Commands

- `npm run check:components`
- `npm run check:studio-render`
- `npm test`
- `npm run check:all`

## Acceptance Checklist

- [x] Studio renders a dedicated Context Pack Usage Flow section.
- [x] Usage flow exposes task type, audience, owner, expiry, source counts, sections, and exclusions.
- [x] Usage flow exposes ordered usage steps as visible text.
- [x] Domain tests cover the usage flow summary.
- [x] The component fixture captures the usage flow panel contract.
- [x] Render and build quality gates cover usage flow fields.

## Follow-Up

The next package should expand multi-action workflow state as a separate post-v1 package.
