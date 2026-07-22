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
  'docs/development/closure-post-v1-studio-state-inspection.md',
  'docs/development/iteration-post-v1-studio-diagnostics.md',
  'docs/development/release-post-v1-studio-diagnostics.md',
  'docs/development/closure-post-v1-studio-diagnostics.md',
  'docs/development/iteration-post-v1-operator-guidance.md',
  'docs/development/release-post-v1-operator-guidance.md',
  'docs/development/closure-post-v1-operator-guidance.md',
  'docs/development/iteration-post-v1-operator-workflow.md',
  'docs/development/release-post-v1-operator-workflow.md',
  'docs/development/closure-post-v1-operator-workflow.md',
  'docs/development/iteration-post-v1-operator-workflow-execution-controls.md',
  'docs/development/release-post-v1-operator-workflow-execution-controls.md',
  'docs/development/closure-post-v1-operator-workflow-execution-controls.md',
  'docs/development/iteration-post-v1-context-pack-usage-flow.md',
  'docs/development/release-post-v1-context-pack-usage-flow.md',
  'docs/development/closure-post-v1-context-pack-usage-flow.md',
  'docs/development/iteration-post-v1-multi-action-workflow-state.md',
  'docs/development/release-post-v1-multi-action-workflow-state.md',
  'docs/development/closure-post-v1-multi-action-workflow-state.md',
  'docs/development/iteration-post-v1-review-resolution-workflow.md',
  'docs/development/release-post-v1-review-resolution-workflow.md',
  'docs/development/closure-post-v1-review-resolution-workflow.md',
  'docs/development/iteration-post-v1-studio-workflow-audit-trail.md',
  'docs/development/release-post-v1-studio-workflow-audit-trail.md',
  'docs/development/closure-post-v1-studio-workflow-audit-trail.md',
  'docs/development/iteration-post-v1-operator-handoff.md',
  'docs/development/release-post-v1-operator-handoff.md',
  'docs/development/closure-post-v1-operator-handoff.md',
  'docs/development/release-post-v1-aggregate-summary.md',
  'docs/development/closure-post-v1-aggregate-summary.md',
  'docs/development/release-post-v1-final-closure.md',
  'docs/development/closure-post-v1-final-closure.md',
  'docs/development/package-boundaries.md',
  'docs/development/quality-gates.md',
  'docs/development/v1.1-scope.md',
  'docs/development/v1.2-scope.md',
  'docs/development/v1.3-scope.md',
  'docs/development/v1.4-scope.md',
  'docs/development/v1.5-scope.md',
  'docs/development/iteration-v1.5-operator-workflow-map.md',
  'docs/development/iteration-v1.5-operator-task-selection.md',
  'docs/development/iteration-v1.5-operator-step-detail.md',
  'docs/development/iteration-v1.4-workflow-session-summary.md',
  'docs/development/release-v1.4-workflow-session-summary.md',
  'docs/development/closure-v1.4-workflow-session-summary.md',
  'docs/development/iteration-v1.4-workflow-transition-plan.md',
  'docs/development/release-v1.4-workflow-transition-plan.md',
  'docs/development/closure-v1.4-workflow-transition-plan.md',
  'docs/development/iteration-v1.4-command-result-summary.md',
  'docs/development/release-v1.4-command-result-summary.md',
  'docs/development/closure-v1.4-command-result-summary.md',
  'docs/development/iteration-v1.4-studio-workflow-runtime-aggregate-summary.md',
  'docs/development/release-v1.4-studio-workflow-runtime-aggregate-summary.md',
  'docs/development/closure-v1.4-studio-workflow-runtime-aggregate-summary.md',
  'docs/development/iteration-v1.4-studio-workflow-runtime-final-closure.md',
  'docs/development/release-v1.4-studio-workflow-runtime-final-closure.md',
  'docs/development/closure-v1.4-studio-workflow-runtime-final-closure.md',
  'docs/development/release-v1.4-aggregate-summary.md',
  'docs/development/closure-v1.4-aggregate-summary.md',
  'docs/development/release-v1.4-final-closure.md',
  'docs/development/closure-v1.4-final-closure.md',
  'docs/development/iteration-v1.3-runtime-health-summary.md',
  'docs/development/release-v1.3-runtime-health-summary.md',
  'docs/development/closure-v1.3-runtime-health-summary.md',
  'docs/development/iteration-v1.3-studio-state-recovery.md',
  'docs/development/release-v1.3-studio-state-recovery.md',
  'docs/development/closure-v1.3-studio-state-recovery.md',
  'docs/development/iteration-v1.3-runtime-validation-signals.md',
  'docs/development/release-v1.3-runtime-validation-signals.md',
  'docs/development/closure-v1.3-runtime-validation-signals.md',
  'docs/development/iteration-v1.3-operator-recovery-guidance.md',
  'docs/development/release-v1.3-operator-recovery-guidance.md',
  'docs/development/closure-v1.3-operator-recovery-guidance.md',
  'docs/development/release-v1.3-aggregate-summary.md',
  'docs/development/closure-v1.3-aggregate-summary.md',
  'docs/development/release-v1.3-final-closure.md',
  'docs/development/closure-v1.3-final-closure.md',
  'docs/development/iteration-v1.2-agent-handoff-context.md',
  'docs/development/release-v1.2-agent-handoff-context.md',
  'docs/development/closure-v1.2-agent-handoff-context.md',
  'docs/development/iteration-v1.2-agent-prompt-plan.md',
  'docs/development/release-v1.2-agent-prompt-plan.md',
  'docs/development/closure-v1.2-agent-prompt-plan.md',
  'docs/development/iteration-v1.2-agent-draft-execution.md',
  'docs/development/release-v1.2-agent-draft-execution.md',
  'docs/development/closure-v1.2-agent-draft-execution.md',
  'docs/development/iteration-v1.2-draft-review.md',
  'docs/development/release-v1.2-draft-review.md',
  'docs/development/closure-v1.2-draft-review.md',
  'docs/development/iteration-v1.2-agent-handoff-closure.md',
  'docs/development/release-v1.2-agent-handoff-closure.md',
  'docs/development/closure-v1.2-agent-handoff-closure.md',
  'docs/development/iteration-v1.2-agent-handoff-runtime-summary.md',
  'docs/development/release-v1.2-agent-handoff-runtime-summary.md',
  'docs/development/closure-v1.2-agent-handoff-runtime-summary.md',
  'docs/development/iteration-v1.2-agent-handoff-runtime-aggregate-summary.md',
  'docs/development/release-v1.2-agent-handoff-runtime-aggregate-summary.md',
  'docs/development/closure-v1.2-agent-handoff-runtime-aggregate-summary.md',
  'docs/development/iteration-v1.2-agent-handoff-runtime-final-closure.md',
  'docs/development/release-v1.2-agent-handoff-runtime-final-closure.md',
  'docs/development/closure-v1.2-agent-handoff-runtime-final-closure.md',
  'docs/development/release-v1.2-aggregate-summary.md',
  'docs/development/closure-v1.2-aggregate-summary.md',
  'docs/development/release-v1.2-final-closure.md',
  'docs/development/closure-v1.2-final-closure.md',
  'docs/development/iteration-v1.1-operator-run-model.md',
  'docs/development/release-v1.1-operator-run-model.md',
  'docs/development/closure-v1.1-operator-run-model.md',
  'docs/development/iteration-v1.1-operator-run-queue.md',
  'docs/development/release-v1.1-operator-run-queue.md',
  'docs/development/closure-v1.1-operator-run-queue.md',
  'docs/development/iteration-v1.1-operator-runbook-execution.md',
  'docs/development/release-v1.1-operator-runbook-execution.md',
  'docs/development/closure-v1.1-operator-runbook-execution.md',
  'docs/development/iteration-v1.1-handoff-acceptance.md',
  'docs/development/release-v1.1-handoff-acceptance.md',
  'docs/development/closure-v1.1-handoff-acceptance.md',
  'docs/development/release-v1.1-aggregate-summary.md',
  'docs/development/closure-v1.1-aggregate-summary.md',
  'docs/development/release-v1.1-final-closure.md',
  'docs/development/closure-v1.1-final-closure.md',
  'docs/product/operator-run.md',
  'docs/decisions/0025-runtime-reliability-start.md',
  'docs/decisions/0026-studio-workflow-runtime-start.md',
  'docs/decisions/0027-operator-workflow-design-start.md',
  'docs/decisions/0024-agent-handoff-runtime-start.md',
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
  'scripts/check-operator-runtime.mjs',
  'scripts/check-agent-handoff-runtime.mjs',
  'scripts/check-runtime-reliability.mjs',
  'scripts/check-studio-workflow-runtime.mjs',
  'scripts/check-operator-workflow-design.mjs',
  'fixtures/components/handoff-acceptance-panel.json',
  'fixtures/components/runtime-health-summary-panel.json',
  'fixtures/components/studio-state-recovery-panel.json',
  'fixtures/components/runtime-validation-signals-panel.json',
  'fixtures/components/operator-recovery-guidance-panel.json',
  'fixtures/components/workflow-session-summary-panel.json',
  'fixtures/components/workflow-transition-plan-panel.json',
  'fixtures/components/command-result-summary-panel.json',
  'fixtures/components/studio-workflow-runtime-aggregate-summary-panel.json',
  'fixtures/components/studio-workflow-runtime-final-closure-panel.json',
  'fixtures/components/operator-workflow-map-panel.json',
  'fixtures/components/operator-task-selection-panel.json',
  'fixtures/components/operator-step-detail-panel.json',
  'fixtures/components/agent-handoff-context-panel.json',
  'fixtures/components/agent-prompt-plan-panel.json',
  'fixtures/components/agent-draft-execution-panel.json',
  'fixtures/components/draft-review-panel.json',
  'fixtures/components/agent-handoff-closure-panel.json',
  'fixtures/components/agent-handoff-runtime-summary-panel.json',
  'fixtures/components/agent-handoff-runtime-aggregate-summary-panel.json',
  'fixtures/components/agent-handoff-runtime-final-closure-panel.json',
  'fixtures/components/operator-run-queue-panel.json',
  'fixtures/components/operator-runbook-execution-panel.json',
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

const expectedProductCoreModels = ['brand-profile', 'claim', 'decision', 'review', 'workflow-run', 'workflow-action', 'operator-run', 'context-pack'];
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
