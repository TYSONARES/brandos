import { existsSync, readFileSync } from 'node:fs';
import { listProductCoreContracts } from '../packages/contracts/src/index.mjs';
import {
  createExampleProductCoreState,
  createBrandProfileOverview,
  completeWorkflowAction,
  createInMemoryProductCoreStore,
  evaluateContextPackReadiness,
  listProductCoreModels,
  summarizeProductCoreState
} from '../packages/domain/src/index.mjs';

const required = [
  'docs/development/README.md',
  'docs/development/v1.0-scope.md',
  'docs/development/local-setup.md',
  'docs/development/repository-layout.md',
  'docs/development/runtime-baseline.md',
  'docs/development/app-shell.md',
  'docs/development/iteration-post-v1-workflow-actions.md',
  'docs/development/release-post-v1-durable-studio-state.md',
  'docs/development/closure-post-v1-durable-studio-state.md',
  'docs/development/iteration-post-v1-studio-state-inspection.md',
  'docs/development/release-post-v1-studio-state-inspection.md',
  'docs/development/package-boundaries.md',
  'docs/development/quality-gates.md',
  'docs/decisions/0021-development-ready-start.md',
  'apps/studio/README.md',
  'apps/studio/src/app.mjs',
  'apps/studio/src/browser-state-adapter.mjs',
  'apps/studio/src/repository-state-adapter.mjs',
  'apps/studio/src/studio-state-adapter.mjs',
  'apps/studio/src/render-html.mjs',
  'scripts/build-studio.mjs',
  'scripts/check-studio-action-state.mjs',
  'scripts/check-studio-state.mjs',
  'scripts/inspect-studio-state.mjs',
  'scripts/reset-studio-state.mjs',
  'scripts/check-studio-build.mjs',
  'scripts/check-studio-render.mjs',
  'scripts/check-post-v1.mjs',
  'scripts/inspect-studio-action.mjs',
  'scripts/persist-studio-action.mjs',
  'scripts/reset-studio-action.mjs',
  'scripts/serve-studio.mjs',
  'packages/domain/README.md',
  'packages/domain/src/example-state.mjs',
  'packages/domain/src/in-memory-store.mjs',
  'packages/domain/src/index.mjs',
  'packages/domain/src/product-core-models.mjs',
  'packages/domain/src/use-cases.mjs',
  'packages/contracts/README.md',
  'packages/contracts/src/index.mjs',
  'packages/contracts/src/product-core-contracts.mjs',
  'packages/design-system/README.md',
  'packages/design-system/src/index.mjs',
  'tests/domain/product-core-use-cases.test.mjs',
  'tests/studio/render-html.test.mjs'
];

const missing = required.filter((file) => !existsSync(file));

if (missing.length) {
  console.error(`Missing development readiness requirements: ${missing.join(', ')}`);
  process.exit(1);
}

const expectedProductCoreModels = ['brand-profile', 'claim', 'decision', 'review', 'workflow-run', 'workflow-action', 'context-pack'];
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

const store = createInMemoryProductCoreStore(createExampleProductCoreState());
const summary = summarizeProductCoreState(store);
if (summary.objectCount !== expectedProductCoreModels.length) {
  console.error(`Expected ${expectedProductCoreModels.length} example Product Core objects, found ${summary.objectCount}`);
  process.exit(1);
}

const overview = createBrandProfileOverview(store, 'brand_profile_example_001');
if (overview.claimCount !== 1 || overview.acceptedDecisionCount !== 1) {
  console.error('Brand Profile overview did not resolve expected claim and decision counts.');
  process.exit(1);
}

const readiness = evaluateContextPackReadiness(store, 'context_pack_example_001');
if (readiness.ready !== false || readiness.blockingReasons.length !== 1 || readiness.nextActions.length !== 1) {
  console.error('Context Pack readiness did not detect the expected blocking review.');
  process.exit(1);
}
if (readiness.nextActions[0].status !== 'pending') {
  console.error('Context Pack readiness did not expose the expected pending action status.');
  process.exit(1);
}

completeWorkflowAction(store, 'workflow_action_example_001', '2026-07-18');
const completedReadiness = evaluateContextPackReadiness(store, 'context_pack_example_001');
if (completedReadiness.ready !== true || completedReadiness.nextActions[0].status !== 'ready') {
  console.error('Completing Workflow Action did not clear Context Pack readiness.');
  process.exit(1);
}

console.log('Development readiness requirements passed.');
