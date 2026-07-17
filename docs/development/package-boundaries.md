# Package Boundaries

## Purpose

Package boundaries keep the implementation aligned with the architecture release.

## Packages

### `packages/domain`

Owns product primitives that map to Product Core v0.2.

### `packages/contracts`

Owns implementation helpers for repository-backed contracts.

### `packages/design-system`

Owns implementation access to design tokens and design-system primitives.

## Rules

- Packages expose small public entrypoints.
- Internal helpers stay inside their package until reuse is proven.
- Package names must map to architecture responsibilities.
- Cross-package coupling must remain explicit through imports.
