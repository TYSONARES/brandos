# Repository Layout

## Purpose

Repository layout defines where implementation files belong.

## Layout

- `apps/studio/`: first BrandOS user-facing app shell.
- `packages/domain/`: product domain primitives.
- `packages/contracts/`: shared repository-backed contracts.
- `packages/design-system/`: implementation-facing design token access.
- `scripts/`: repository validation and maintenance checks.
- `docs/`: source of truth for decisions and operating standards.
- `schemas/`: JSON schema contracts.
- `fixtures/`: validated example data.

## Rules

- Apps may depend on packages.
- Packages must not depend on apps.
- Runtime source must not duplicate schema definitions by hand.
- New top-level implementation folders require an ADR or an update to this file.
