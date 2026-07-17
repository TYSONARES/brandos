# Package Boundaries

## Purpose

Package boundaries keep the implementation aligned with the architecture release.

## Packages

### `packages/domain`

Owns product primitives that map to Product Core v0.2.

Initial runtime model metadata covers Brand Profile, Claim, Decision, Review, Workflow Run, and Context Pack.

Initial use cases cover Brand Profile overview and Context Pack readiness.

### `packages/contracts`

Owns implementation helpers for repository-backed contracts.

Initial contract helpers expose Product Core schema and fixture paths for runtime code.

### `packages/design-system`

Owns implementation access to design tokens and design-system primitives.

## Rules

- Packages expose small public entrypoints.
- Internal helpers stay inside their package until reuse is proven.
- Package names must map to architecture responsibilities.
- Cross-package coupling must remain explicit through imports.
