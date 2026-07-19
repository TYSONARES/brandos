import { existsSync } from 'node:fs';

const required = [
  'docs/development/release-v1.0.0.md',
  'docs/decisions/0021-development-ready-start.md',
  'docs/decisions/0022-development-ready-v1.0-complete.md',
  'docs/development/README.md',
  'docs/development/v1.0-scope.md',
  'docs/development/local-setup.md',
  'docs/development/repository-layout.md',
  'docs/development/runtime-baseline.md',
  'docs/development/app-shell.md',
  'docs/development/package-boundaries.md',
  'docs/development/quality-gates.md',
  'docs/development/v1.1-scope.md',
  'docs/development/iteration-v1.1-operator-run-model.md',
  'docs/development/release-v1.1-operator-run-model.md',
  'docs/development/closure-v1.1-operator-run-model.md',
  'docs/development/iteration-v1.1-operator-run-queue.md',
  'docs/development/release-v1.1-operator-run-queue.md',
  'docs/development/closure-v1.1-operator-run-queue.md',
  'docs/development/iteration-v1.1-operator-runbook-execution.md',
  'docs/product/operator-run.md',
  'docs/decisions/0023-operator-runtime-start.md',
  'apps/studio/src/app.mjs',
  'apps/studio/src/render-html.mjs',
  'packages/domain/src/product-core-models.mjs',
  'packages/domain/src/in-memory-store.mjs',
  'packages/domain/src/example-state.mjs',
  'packages/domain/src/use-cases.mjs',
  'packages/contracts/src/product-core-contracts.mjs',
  'scripts/check-development.mjs',
  'scripts/build-studio.mjs',
  'scripts/check-studio-build.mjs',
  'scripts/serve-studio.mjs',
  'tests/domain/product-core-use-cases.test.mjs',
  'tests/studio/render-html.test.mjs'
];

const missing = required.filter((file) => !existsSync(file));

if (missing.length) {
  console.error(`Missing development release requirements: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('Development release requirements passed.');
