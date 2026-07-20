import { existsSync } from 'node:fs';
import {
  completeWorkflowAction,
  createExampleProductCoreState,
  createInMemoryProductCoreStore,
  createRuntimeHealthSummary,
  createStudioStateRecovery,
  createRuntimeValidationSignals
} from '../packages/domain/src/index.mjs';

const required = [
  'docs/development/v1.3-scope.md',
  'docs/development/iteration-v1.3-runtime-health-summary.md',
  'docs/development/release-v1.3-runtime-health-summary.md',
  'docs/development/closure-v1.3-runtime-health-summary.md',
  'docs/development/iteration-v1.3-studio-state-recovery.md',
  'docs/development/release-v1.3-studio-state-recovery.md',
  'docs/development/closure-v1.3-studio-state-recovery.md',
  'docs/development/iteration-v1.3-runtime-validation-signals.md',
  'docs/development/release-v1.3-runtime-validation-signals.md',
  'docs/development/closure-v1.3-runtime-validation-signals.md',
  'docs/decisions/0025-runtime-reliability-start.md',
  'fixtures/components/runtime-health-summary-panel.json',
  'fixtures/components/studio-state-recovery-panel.json',
  'fixtures/components/runtime-validation-signals-panel.json',
  'apps/studio/src/app.mjs',
  'apps/studio/src/render-html.mjs',
  'packages/domain/src/use-cases.mjs',
  'tests/domain/product-core-use-cases.test.mjs',
  'tests/studio/render-html.test.mjs'
];

const missing = required.filter((file) => !existsSync(file));

if (missing.length) {
  console.error(`Missing Runtime Reliability requirements: ${missing.join(', ')}`);
  process.exit(1);
}

const store = createInMemoryProductCoreStore(createExampleProductCoreState());
const attention = createRuntimeHealthSummary(store, 'operator_run_example_001');

if (attention.status !== 'attention' || attention.healthy !== false) {
  console.error('Runtime Health Summary did not expose the expected attention state.');
  process.exit(1);
}
if (attention.nextWorkflow !== 'Review Resolution Workflow') {
  console.error('Attention Runtime Health Summary did not route work to Review Resolution Workflow.');
  process.exit(1);
}

const recovery = createStudioStateRecovery(store, 'operator_run_example_001');
if (recovery.status !== 'needs-recovery' || recovery.recoveryReady !== false) {
  console.error('Studio State Recovery did not expose the expected needs-recovery state.');
  process.exit(1);
}
if (recovery.nextWorkflow !== 'Review Resolution Workflow') {
  console.error('Needs-recovery Studio State Recovery did not route work to Review Resolution Workflow.');
  process.exit(1);
}

const validation = createRuntimeValidationSignals(store, 'operator_run_example_001');
if (validation.status !== 'blocked' || validation.validationReady !== false) {
  console.error('Runtime Validation Signals did not expose the expected blocked state.');
  process.exit(1);
}
if (validation.nextWorkflow !== 'Review Resolution Workflow') {
  console.error('Blocked Runtime Validation Signals did not route work to Review Resolution Workflow.');
  process.exit(1);
}

completeWorkflowAction(store, 'workflow_action_example_001', '2026-07-20');
const healthy = createRuntimeHealthSummary(store, 'operator_run_example_001', {
  stateSource: 'command',
  stateStatus: 'loaded',
  completedActionCount: 1,
  completedActionIds: ['workflow_action_example_001']
});

if (healthy.status !== 'healthy' || healthy.healthy !== true) {
  console.error('Runtime Health Summary did not expose the expected healthy state.');
  process.exit(1);
}
if (healthy.nextWorkflow !== 'Studio State Recovery') {
  console.error('Healthy Runtime Health Summary did not route work to Studio State Recovery.');
  process.exit(1);
}

const readyRecovery = createStudioStateRecovery(store, 'operator_run_example_001', {
  stateSource: 'command',
  stateStatus: 'loaded',
  completedActionCount: 1,
  completedActionIds: ['workflow_action_example_001']
});
if (readyRecovery.status !== 'ready' || readyRecovery.recoveryReady !== true) {
  console.error('Studio State Recovery did not expose the expected ready state.');
  process.exit(1);
}
if (readyRecovery.nextWorkflow !== 'Runtime Validation Signals') {
  console.error('Ready Studio State Recovery did not route work to Runtime Validation Signals.');
  process.exit(1);
}

const readyValidation = createRuntimeValidationSignals(store, 'operator_run_example_001', {
  stateSource: 'command',
  stateStatus: 'loaded',
  completedActionCount: 1,
  completedActionIds: ['workflow_action_example_001']
});
if (readyValidation.status !== 'ready' || readyValidation.validationReady !== true) {
  console.error('Runtime Validation Signals did not expose the expected ready state.');
  process.exit(1);
}
if (readyValidation.nextWorkflow !== 'Runtime Reliability Closure') {
  console.error('Ready Runtime Validation Signals did not route work to Runtime Reliability Closure.');
  process.exit(1);
}

console.log('Runtime Reliability requirements passed.');
