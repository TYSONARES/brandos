import { existsSync } from 'node:fs';

const required = [
  'docs/development/v1.4-scope.md',
  'docs/decisions/0026-studio-workflow-runtime-start.md',
  'docs/development/README.md',
  'apps/studio/src/app.mjs',
  'apps/studio/src/render-html.mjs',
  'packages/domain/src/use-cases.mjs',
  'tests/domain/product-core-use-cases.test.mjs',
  'tests/studio/render-html.test.mjs'
];

const missing = required.filter((file) => !existsSync(file));

if (missing.length) {
  console.error(`Missing Studio Workflow Runtime requirements: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('Studio Workflow Runtime requirements passed.');
