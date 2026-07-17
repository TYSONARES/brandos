# Quality Gates

## Purpose

Quality gates define what must pass before development changes are considered ready.

## Required Gates

- `npm run check:all`
- `npm run check:development`
- `npm test`
- `npm run render:studio`
- `npm run smoke:app`

## Rules

- New runtime areas must add or update a check.
- Use-case behavior must be covered by Node tests before UI rendering is added.
- Render output must be deterministic and test-covered before a browser app framework is introduced.
- Smoke commands must be fast and deterministic.
- Failing checks must explain the missing file or invalid contract.
- Development readiness must not depend on unpublished chat context.
