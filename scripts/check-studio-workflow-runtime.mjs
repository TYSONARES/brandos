import { existsSync } from 'node:fs';
import {
  completeWorkflowAction,
  createCommandResultSummary,
  createExampleProductCoreState,
  createInMemoryProductCoreStore,
  createStudioWorkflowRuntimeAggregateSummary,
  createStudioWorkflowRuntimeFinalClosure,
  createWorkflowSessionSummary,
  createWorkflowTransitionPlan
} from '../packages/domain/src/index.mjs';

const required = [
  'docs/development/v1.4-scope.md',
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
  'docs/decisions/0026-studio-workflow-runtime-start.md',
  'fixtures/components/workflow-session-summary-panel.json',
  'fixtures/components/workflow-transition-plan-panel.json',
  'fixtures/components/command-result-summary-panel.json',
  'fixtures/components/studio-workflow-runtime-aggregate-summary-panel.json',
  'fixtures/components/studio-workflow-runtime-final-closure-panel.json',
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

const blockedTransition = createWorkflowTransitionPlan(store, 'operator_run_example_001');
if (blockedTransition.status !== 'blocked' || blockedTransition.transitionReady !== false) {
  console.error('Workflow Transition Plan did not expose the expected blocked state.');
  process.exit(1);
}
if (blockedTransition.nextWorkflow !== 'Review Resolution Workflow') {
  console.error('Blocked Workflow Transition Plan did not route work to Review Resolution Workflow.');
  process.exit(1);
}
const blockedCommandResult = createCommandResultSummary(store, 'operator_run_example_001');
if (blockedCommandResult.status !== 'blocked' || blockedCommandResult.commandComplete !== false) {
  console.error('Command Result Summary did not expose the expected blocked state.');
  process.exit(1);
}
if (blockedCommandResult.nextWorkflow !== 'Review Resolution Workflow') {
  console.error('Blocked Command Result Summary did not route work to Review Resolution Workflow.');
  process.exit(1);
}
const blockedAggregate = createStudioWorkflowRuntimeAggregateSummary(store, 'operator_run_example_001');
if (blockedAggregate.status !== 'blocked' || blockedAggregate.aggregateReady !== false) {
  console.error('Studio Workflow Runtime Aggregate Summary did not expose the expected blocked state.');
  process.exit(1);
}
if (blockedAggregate.nextWorkflow !== 'Review Resolution Workflow') {
  console.error('Blocked Studio Workflow Runtime Aggregate Summary did not route work to Review Resolution Workflow.');
  process.exit(1);
}
const blockedFinalClosure = createStudioWorkflowRuntimeFinalClosure(store, 'operator_run_example_001');
if (blockedFinalClosure.status !== 'blocked' || blockedFinalClosure.closed !== false) {
  console.error('Studio Workflow Runtime Final Closure did not expose the expected blocked state.');
  process.exit(1);
}
if (blockedFinalClosure.nextWorkflow !== 'Review Resolution Workflow') {
  console.error('Blocked Studio Workflow Runtime Final Closure did not route work to Review Resolution Workflow.');
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

const readyTransition = createWorkflowTransitionPlan(store, 'operator_run_example_001', {
  stateSource: 'command',
  stateStatus: 'loaded',
  completedActionCount: 1,
  completedActionIds: ['workflow_action_example_001']
});
if (readyTransition.status !== 'ready' || readyTransition.transitionReady !== true) {
  console.error('Workflow Transition Plan did not expose the expected ready state.');
  process.exit(1);
}
if (readyTransition.nextWorkflow !== 'Command Result Summary') {
  console.error('Ready Workflow Transition Plan did not route work to Command Result Summary.');
  process.exit(1);
}
const readyCommandResult = createCommandResultSummary(store, 'operator_run_example_001', {
  stateSource: 'command',
  stateStatus: 'loaded',
  completedActionCount: 1,
  completedActionIds: ['workflow_action_example_001']
});
if (readyCommandResult.status !== 'complete' || readyCommandResult.commandComplete !== true) {
  console.error('Command Result Summary did not expose the expected complete state.');
  process.exit(1);
}
if (readyCommandResult.nextWorkflow !== 'Studio Workflow Runtime Aggregate Summary') {
  console.error('Complete Command Result Summary did not route work to Studio Workflow Runtime Aggregate Summary.');
  process.exit(1);
}
const readyAggregate = createStudioWorkflowRuntimeAggregateSummary(store, 'operator_run_example_001', {
  stateSource: 'command',
  stateStatus: 'loaded',
  completedActionCount: 1,
  completedActionIds: ['workflow_action_example_001']
});
if (readyAggregate.status !== 'ready' || readyAggregate.aggregateReady !== true) {
  console.error('Studio Workflow Runtime Aggregate Summary did not expose the expected ready state.');
  process.exit(1);
}
if (readyAggregate.nextWorkflow !== 'Studio Workflow Runtime Final Closure') {
  console.error('Ready Studio Workflow Runtime Aggregate Summary did not route work to Studio Workflow Runtime Final Closure.');
  process.exit(1);
}
const readyFinalClosure = createStudioWorkflowRuntimeFinalClosure(store, 'operator_run_example_001', {
  stateSource: 'command',
  stateStatus: 'loaded',
  completedActionCount: 1,
  completedActionIds: ['workflow_action_example_001']
});
if (readyFinalClosure.status !== 'closed' || readyFinalClosure.closed !== true) {
  console.error('Studio Workflow Runtime Final Closure did not expose the expected closed state.');
  process.exit(1);
}
if (readyFinalClosure.nextWorkflow !== 'Studio Workflow Runtime v1.4 Closed') {
  console.error('Closed Studio Workflow Runtime Final Closure did not route work to v1.4 closed state.');
  process.exit(1);
}

console.log('Studio Workflow Runtime requirements passed.');
