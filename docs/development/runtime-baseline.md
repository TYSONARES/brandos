# Runtime Baseline

## Purpose

Runtime baseline defines the first executable shape of BrandOS.

## Baseline

- Runtime: Node.js standard library.
- Module format: ECMAScript modules through `.mjs` files.
- External services: none.
- Required secrets: none.
- Persistence: in-memory examples only.
- Initial state: deterministic Product Core example objects.
- Initial use cases: Brand Profile overview and Context Pack readiness.

## Rules

- Runtime code must be deterministic by default.
- Smoke commands must not require network access.
- Runtime modules must expose named functions for future tests.
- In-memory stores must remain replaceable by future persistence adapters.
- Use cases must consume store interfaces instead of hard-coding fixture data.
- Console output should be concise and suitable for CI logs.

## Upgrade Path

Framework, database, hosting, and package manager changes require explicit decisions after v1.0 scaffolding is stable.
