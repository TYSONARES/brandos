import { existsSync } from 'node:fs';
import {
  createExampleProductCoreState,
  createInMemoryProductCoreStore,
  createOperatorRunQueue,
  createOperatorRunbookExecution,
  createOperatorRunSummary,
  listProductCoreModels,
  summarizeProductCoreState
} from '../packages/domain/src/index.mjs';

const required = [
  'docs/development/v1.1-scope.md',
  'docs/development/iteration-v1.1-operator-run-model.md',
  'docs/development/release-v1.1-operator-run-model.md',
  'docs/development/closure-v1.1-operator-run-model.md',
  'docs/development/iteration-v1.1-operator-run-queue.md',
  'docs/development/release-v1.1-operator-run-queue.md',
  'docs/development/closure-v1.1-operator-run-queue.md',
  'docs/development/iteration-v1.1-operator-runbook-execution.md',
  'docs/decisions/0023-operator-runtime-start.md',
  'docs/product/operator-run.md',
  'schemas/operator-run.schema.json',
  'fixtures/operator-run.example.json',
  'fixtures/components/operator-run-queue-panel.json',
  'fixtures/components/operator-runbook-execution-panel.json'
];

const missing = required.filter((file) => !existsSync(file));

if (missing.length) {
  console.error(`Missing Operator Runtime requirements: ${missing.join(', ')}`);
  process.exit(1);
}

const modelIds = listProductCoreModels().map((model) => model.id);
if (!modelIds.includes('operator-run')) {
  console.error('Missing Operator Run runtime model.');
  process.exit(1);
}

const store = createInMemoryProductCoreStore(createExampleProductCoreState());
const stateSummary = summarizeProductCoreState(store);
if (stateSummary.modelCounts['operator-run'] !== 1) {
  console.error('Example Product Core state must include one Operator Run.');
  process.exit(1);
}

const operatorRun = createOperatorRunSummary(store, 'operator_run_example_001');
if (operatorRun.currentActionId !== 'workflow_action_example_001') {
  console.error('Operator Run summary did not resolve the expected current Workflow Action.');
  process.exit(1);
}
if (operatorRun.currentActionStatus !== 'pending' || operatorRun.pendingActionCount !== 1) {
  console.error('Operator Run summary did not expose expected pending action state.');
  process.exit(1);
}

const queue = createOperatorRunQueue(store);
if (queue.runCount !== 1 || queue.blockedCount !== 1 || queue.activeRunId !== 'operator_run_example_001') {
  console.error('Operator Run Queue did not expose expected queue counts.');
  process.exit(1);
}

const runbook = createOperatorRunbookExecution(store, 'operator_run_example_001');
if (runbook.status !== 'blocked' || runbook.steps.length !== 5 || runbook.steps[1].status !== 'active') {
  console.error('Operator Runbook Execution did not expose expected blocked runbook state.');
  process.exit(1);
}

console.log('Operator Runtime requirements passed.');
