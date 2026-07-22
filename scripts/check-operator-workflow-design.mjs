import { existsSync } from 'node:fs';
import {
  completeWorkflowAction,
  createExampleProductCoreState,
  createInMemoryProductCoreStore,
  createOperatorTaskSelection,
  createOperatorWorkflowMap
} from '../packages/domain/src/index.mjs';

const required = [
  'docs/development/v1.5-scope.md',
  'docs/development/iteration-v1.5-operator-workflow-map.md',
  'docs/development/iteration-v1.5-operator-task-selection.md',
  'docs/decisions/0027-operator-workflow-design-start.md',
  'fixtures/components/operator-workflow-map-panel.json',
  'fixtures/components/operator-task-selection-panel.json',
  'apps/studio/src/app.mjs',
  'apps/studio/src/render-html.mjs',
  'packages/domain/src/use-cases.mjs',
  'packages/domain/src/index.mjs',
  'tests/domain/product-core-use-cases.test.mjs',
  'tests/studio/render-html.test.mjs',
  'docs/development/README.md',
  'scripts/check-operator-workflow-design.mjs'
];

const missing = required.filter((file) => !existsSync(file));

if (missing.length) {
  console.error(`Missing Operator Workflow Design requirements: ${missing.join(', ')}`);
  process.exit(1);
}

const store = createInMemoryProductCoreStore(createExampleProductCoreState());
const blocked = createOperatorWorkflowMap(store, 'operator_run_example_001');
const blockedSelection = createOperatorTaskSelection(store, 'operator_run_example_001');

if (blocked.status !== 'blocked' || blocked.mapReady || blocked.nextWorkflow !== 'Review Resolution Workflow') {
  console.error('Operator Workflow Map blocked scenario did not route to Review Resolution Workflow.');
  process.exit(1);
}

if (blockedSelection.status !== 'blocked' || blockedSelection.selectedWorkflow !== 'Review Resolution Workflow') {
  console.error('Operator Task Selection blocked scenario did not select Review Resolution Workflow.');
  process.exit(1);
}

completeWorkflowAction(store, 'workflow_action_example_001', '2026-07-20');
const ready = createOperatorWorkflowMap(store, 'operator_run_example_001', {
  stateSource: 'command',
  stateStatus: 'loaded',
  completedActionCount: 1,
  completedActionIds: ['workflow_action_example_001']
});
const readySelection = createOperatorTaskSelection(store, 'operator_run_example_001', {
  stateSource: 'command',
  stateStatus: 'loaded',
  completedActionCount: 1,
  completedActionIds: ['workflow_action_example_001']
});

if (ready.status !== 'ready' || !ready.mapReady || ready.nextWorkflow !== 'Operator Task Selection') {
  console.error('Operator Workflow Map ready scenario did not route to Operator Task Selection.');
  process.exit(1);
}

if (readySelection.status !== 'ready' || readySelection.selectedWorkflow !== 'Use Context Pack' || readySelection.nextWorkflow !== 'Operator Step Detail') {
  console.error('Operator Task Selection ready scenario did not select Use Context Pack and route to Operator Step Detail.');
  process.exit(1);
}

console.log('Operator Workflow Design requirements passed.');
