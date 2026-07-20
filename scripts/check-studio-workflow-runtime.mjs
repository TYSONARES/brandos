import { existsSync } from 'node:fs';
import {
  completeWorkflowAction,
  createExampleProductCoreState,
  createInMemoryProductCoreStore,
  createWorkflowSessionSummary
} from '../packages/domain/src/index.mjs';

const required = [
  'docs/development/v1.4-scope.md',
  'docs/development/iteration-v1.4-workflow-session-summary.md',
  'docs/development/release-v1.4-workflow-session-summary.md',
  'docs/development/closure-v1.4-workflow-session-summary.md',
  'docs/decisions/0026-studio-workflow-runtime-start.md',
  'fixtures/components/workflow-session-summary-panel.json',
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

const store = createInMemoryProductCoreStore(createExampleProductCoreState());
const blocked = createWorkflowSessionSummary(store, 'operator_run_example_001');

if (blocked.status !== 'blocked' || blocked.sessionReady !== false) {
  console.error('Workflow Session Summary did not expose the expected blocked state.');
  process.exit(1);
}
if (blocked.nextWorkflow !== 'Review Resolution Workflow') {
  console.error('Blocked Workflow Session Summary did not route work to Review Resolution Workflow.');
  process.exit(1);
}

completeWorkflowAction(store, 'workflow_action_example_001', '2026-07-20');
const ready = createWorkflowSessionSummary(store, 'operator_run_example_001', {
  stateSource: 'command',
  stateStatus: 'loaded',
  completedActionCount: 1,
  completedActionIds: ['workflow_action_example_001']
});

if (ready.status !== 'ready' || ready.sessionReady !== true) {
  console.error('Workflow Session Summary did not expose the expected ready state.');
  process.exit(1);
}
if (ready.nextWorkflow !== 'Workflow Transition Plan') {
  console.error('Ready Workflow Session Summary did not route work to Workflow Transition Plan.');
  process.exit(1);
}

console.log('Studio Workflow Runtime requirements passed.');
