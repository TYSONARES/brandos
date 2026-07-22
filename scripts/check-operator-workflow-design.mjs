import { existsSync } from 'node:fs';
import {
  completeWorkflowAction,
  createExampleProductCoreState,
  createInMemoryProductCoreStore,
  createOperatorHandoffReadiness,
  createOperatorStepDetail,
  createOperatorTaskSelection,
  createOperatorWorkflowDesignAggregateSummary,
  createOperatorWorkflowDesignFinalClosure,
  createOperatorWorkflowMap
} from '../packages/domain/src/index.mjs';

const required = [
  'docs/development/v1.5-scope.md',
  'docs/development/iteration-v1.5-operator-workflow-map.md',
  'docs/development/iteration-v1.5-operator-task-selection.md',
  'docs/development/iteration-v1.5-operator-step-detail.md',
  'docs/development/iteration-v1.5-operator-handoff-readiness.md',
  'docs/development/iteration-v1.5-operator-workflow-design-aggregate-summary.md',
  'docs/development/release-v1.5-operator-workflow-design-aggregate-summary.md',
  'docs/development/closure-v1.5-operator-workflow-design-aggregate-summary.md',
  'docs/development/iteration-v1.5-operator-workflow-design-final-closure.md',
  'docs/decisions/0027-operator-workflow-design-start.md',
  'fixtures/components/operator-workflow-map-panel.json',
  'fixtures/components/operator-task-selection-panel.json',
  'fixtures/components/operator-step-detail-panel.json',
  'fixtures/components/operator-handoff-readiness-panel.json',
  'fixtures/components/operator-workflow-design-aggregate-summary-panel.json',
  'fixtures/components/operator-workflow-design-final-closure-panel.json',
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
const blockedDetail = createOperatorStepDetail(store, 'operator_run_example_001');
const blockedHandoff = createOperatorHandoffReadiness(store, 'operator_run_example_001');
const blockedAggregate = createOperatorWorkflowDesignAggregateSummary(store, 'operator_run_example_001');
const blockedFinalClosure = createOperatorWorkflowDesignFinalClosure(store, 'operator_run_example_001');

if (blocked.status !== 'blocked' || blocked.mapReady || blocked.nextWorkflow !== 'Review Resolution Workflow') {
  console.error('Operator Workflow Map blocked scenario did not route to Review Resolution Workflow.');
  process.exit(1);
}

if (blockedSelection.status !== 'blocked' || blockedSelection.selectedWorkflow !== 'Review Resolution Workflow') {
  console.error('Operator Task Selection blocked scenario did not select Review Resolution Workflow.');
  process.exit(1);
}

if (blockedDetail.status !== 'blocked' || blockedDetail.activeStep !== 'Inspect blocker detail') {
  console.error('Operator Step Detail blocked scenario did not expose the blocker detail step.');
  process.exit(1);
}

if (blockedHandoff.status !== 'blocked' || blockedHandoff.handoffTarget !== 'Operator') {
  console.error('Operator Handoff Readiness blocked scenario did not keep work with the operator.');
  process.exit(1);
}

if (blockedAggregate.status !== 'blocked' || blockedAggregate.nextWorkflow !== 'Review Resolution Workflow') {
  console.error('Operator Workflow Design Aggregate Summary blocked scenario did not route to Review Resolution Workflow.');
  process.exit(1);
}

if (blockedFinalClosure.status !== 'blocked' || blockedFinalClosure.nextWorkflow !== 'Review Resolution Workflow') {
  console.error('Operator Workflow Design Final Closure blocked scenario did not route to Review Resolution Workflow.');
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
const readyDetail = createOperatorStepDetail(store, 'operator_run_example_001', {
  stateSource: 'command',
  stateStatus: 'loaded',
  completedActionCount: 1,
  completedActionIds: ['workflow_action_example_001']
});
const readyHandoff = createOperatorHandoffReadiness(store, 'operator_run_example_001', {
  stateSource: 'command',
  stateStatus: 'loaded',
  completedActionCount: 1,
  completedActionIds: ['workflow_action_example_001']
});
const readyAggregate = createOperatorWorkflowDesignAggregateSummary(store, 'operator_run_example_001', {
  stateSource: 'command',
  stateStatus: 'loaded',
  completedActionCount: 1,
  completedActionIds: ['workflow_action_example_001']
});
const readyFinalClosure = createOperatorWorkflowDesignFinalClosure(store, 'operator_run_example_001', {
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

if (readyDetail.status !== 'ready' || readyDetail.nextWorkflow !== 'Operator Handoff Readiness') {
  console.error('Operator Step Detail ready scenario did not route to Operator Handoff Readiness.');
  process.exit(1);
}

if (readyHandoff.status !== 'ready' || readyHandoff.nextWorkflow !== 'Operator Workflow Design Aggregate Summary') {
  console.error('Operator Handoff Readiness ready scenario did not route to Operator Workflow Design Aggregate Summary.');
  process.exit(1);
}

if (readyAggregate.status !== 'ready' || readyAggregate.nextWorkflow !== 'Operator Workflow Design Final Closure') {
  console.error('Operator Workflow Design Aggregate Summary ready scenario did not route to Operator Workflow Design Final Closure.');
  process.exit(1);
}

if (readyFinalClosure.status !== 'closed' || readyFinalClosure.nextWorkflow !== 'Operator Workflow Design v1.5 Closed') {
  console.error('Operator Workflow Design Final Closure ready scenario did not route to v1.5 closed state.');
  process.exit(1);
}

console.log('Operator Workflow Design requirements passed.');
