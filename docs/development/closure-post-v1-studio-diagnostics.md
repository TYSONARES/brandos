# Post-v1 Closure Checklist: Studio Diagnostics

## Status

Ready for closure.

## Scope Lock

- Studio renders a dedicated diagnostics section.
- Diagnostics show package count, product object count, readiness blockers, state source, state status, result, and check rows.
- Diagnostics work for blocked and ready Studio scenarios.
- The Studio Diagnostics Panel component fixture is present.
- Render, build, component, and test coverage validate diagnostics fields and checks.
- Release notes summarize user-facing changes, repository changes, commands, acceptance status, and follow-up.

## Validation Evidence

- `npm run check:docs`
- `npm run check:components`
- `npm run check:development`
- `npm run check:post-v1`
- `npm run check:studio-render`
- `npm test`
- `npm run check:all`

## Closure Criteria

- [x] Studio renders a dedicated diagnostics section.
- [x] Diagnostics expose runtime, product, readiness, and state signals.
- [x] Diagnostic check rows are visible in blocked and ready scenarios.
- [x] Static render and build checks cover diagnostics fields.
- [x] Component fixtures cover the Studio Diagnostics Panel contract.
- [x] Release notes summarize the completed package and define a narrow follow-up.

## Next Package

Begin broader operator guidance as a separate post-v1 package instead of expanding the diagnostics panel contract.
