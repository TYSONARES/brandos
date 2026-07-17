import { existsSync, readFileSync } from 'node:fs';
import { listProductCoreContracts } from '../packages/contracts/src/index.mjs';
import { listProductCoreModels } from '../packages/domain/src/index.mjs';

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
  'packages/domain/src/product-core-models.mjs',
  'packages/contracts/README.md',
  'packages/contracts/src/index.mjs',
  'packages/contracts/src/product-core-contracts.mjs',
  'packages/design-system/README.md',
  'packages/design-system/src/index.mjs'
];

const missing = required.filter((file) => !existsSync(file));

if (missing.length) {
  console.error(`Missing development readiness requirements: ${missing.join(', ')}`);
  process.exit(1);
}

const expectedProductCoreModels = ['brand-profile', 'claim', 'decision', 'review', 'workflow-run', 'context-pack'];
const models = listProductCoreModels();
const modelIds = models.map((model) => model.id);

for (const expected of expectedProductCoreModels) {
  if (!modelIds.includes(expected)) {
    console.error(`Missing Product Core runtime model: ${expected}`);
    process.exit(1);
  }
}

for (const model of models) {
  if (!existsSync(model.schema)) {
    console.error(`Missing schema for Product Core runtime model ${model.id}: ${model.schema}`);
    process.exit(1);
  }
  if (!existsSync(model.fixture)) {
    console.error(`Missing fixture for Product Core runtime model ${model.id}: ${model.fixture}`);
    process.exit(1);
  }
  const schema = JSON.parse(readFileSync(model.schema, 'utf8'));
  const missingFields = model.requiredFields.filter((field) => !schema.required.includes(field));
  if (missingFields.length) {
    console.error(`${model.id} runtime model includes fields missing from schema.required: ${missingFields.join(', ')}`);
    process.exit(1);
  }
}

const contracts = listProductCoreContracts();
if (contracts.length !== expectedProductCoreModels.length) {
  console.error(`Expected ${expectedProductCoreModels.length} Product Core contracts, found ${contracts.length}`);
  process.exit(1);
}

console.log('Development readiness requirements passed.');
