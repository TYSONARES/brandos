import { existsSync } from 'node:fs';

const required = [
  'docs/development/README.md',
  'docs/development/v1.0-scope.md',
  'docs/development/local-setup.md',
  'docs/development/repository-layout.md',
  'docs/development/runtime-baseline.md',
  'docs/development/app-shell.md',
  'docs/development/package-boundaries.md',
  'docs/development/quality-gates.md',
  'docs/decisions/0021-development-ready-start.md',
  'apps/studio/README.md',
  'apps/studio/src/app.mjs',
  'packages/domain/README.md',
  'packages/domain/src/index.mjs',
  'packages/contracts/README.md',
  'packages/contracts/src/index.mjs',
  'packages/design-system/README.md',
  'packages/design-system/src/index.mjs'
];

const missing = required.filter((file) => !existsSync(file));

if (missing.length) {
  console.error(`Missing development readiness requirements: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('Development readiness requirements passed.');
