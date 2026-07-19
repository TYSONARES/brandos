import assert from 'node:assert/strict';
import test from 'node:test';

import {
  completeWorkflowAction,
  createBrandProfileOverview,
  createContextPackUsageFlow,
  createExampleProductCoreState,
  createInMemoryProductCoreStore,
  createOperatorRunSummary,
  createReviewResolutionWorkflow,
  evaluateContextPackReadiness,
  summarizeProductCoreState
} from '../../packages/domain/src/index.mjs';

function createExampleStore() {
  return createInMemoryProductCoreStore(createExampleProductCoreState());
}

test('example Product Core state contains one object for each runtime model', () => {
  const store = createExampleStore();
  const summary = summarizeProductCoreState(store);

  assert.equal(summary.workspaceCount, 1);
  assert.equal(summary.objectCount, 8);
  assert.equal(summary.modelCounts['brand-profile'], 1);
  assert.equal(summary.modelCounts.claim, 1);
  assert.equal(summary.modelCounts.decision, 1);
  assert.equal(summary.modelCounts.review, 1);
  assert.equal(summary.modelCounts['workflow-run'], 1);
  assert.equal(summary.modelCounts['workflow-action'], 1);
  assert.equal(summary.modelCounts['operator-run'], 1);
  assert.equal(summary.modelCounts['context-pack'], 1);
});

test('completing a review-resolution Workflow Action clears Context Pack readiness', () => {
  const store = createExampleStore();
  const completedAction = completeWorkflowAction(store, 'workflow_action_example_001', '2026-07-18');
  const readiness = evaluateContextPackReadiness(store, 'context_pack_example_001');
  const review = store.get('review', 'review_example_001');

  assert.equal(completedAction.status, 'complete');
  assert.equal(completedAction.completedAt, '2026-07-18');
  assert.equal(review.status, 'approved');
  assert.equal(readiness.ready, true);
  assert.deepEqual(readiness.blockingReasons, []);
  assert.deepEqual(readiness.nextActions, [
    {
      id: null,
      type: 'context-pack-release',
      status: 'ready',
      targetId: 'context_pack_example_001',
      label: 'Use context pack context_pack_example_001',
      owner: 'operator@example.local'
    }
  ]);
});

test('Brand Profile overview resolves linked claims and decisions', () => {
  const overview = createBrandProfileOverview(createExampleStore(), 'brand_profile_example_001');

  assert.equal(overview.name, 'Example Brand');
  assert.equal(overview.claimCount, 1);
  assert.equal(overview.supportedClaimCount, 1);
  assert.equal(overview.decisionCount, 1);
  assert.equal(overview.acceptedDecisionCount, 1);
});

test('Context Pack readiness reports blocking review state', () => {
  const readiness = evaluateContextPackReadiness(createExampleStore(), 'context_pack_example_001');

  assert.equal(readiness.ready, false);
  assert.equal(readiness.actionCount, 1);
  assert.deepEqual(readiness.blockingReasons, ['Review is blocking release: review_example_001']);
  assert.deepEqual(readiness.nextActions, [
    {
      id: 'workflow_action_example_001',
      type: 'review-resolution',
      status: 'pending',
      targetId: 'review_example_001',
      label: 'Resolve review feedback for context_pack_example_001',
      owner: 'operator@example.local'
    }
  ]);
});

test('Context Pack readiness passes when claims, decisions, and reviews are clear', () => {
  const state = createExampleProductCoreState();
  state.review = [
    {
      ...state.review[0],
      status: 'approved',
      notes: 'Ready for use.'
    }
  ];
  const readiness = evaluateContextPackReadiness(createInMemoryProductCoreStore(state), 'context_pack_example_001');

  assert.equal(readiness.ready, true);
  assert.deepEqual(readiness.blockingReasons, []);
  assert.deepEqual(readiness.nextActions, [
    {
      id: null,
      type: 'context-pack-release',
      status: 'ready',
      targetId: 'context_pack_example_001',
      label: 'Use context pack context_pack_example_001',
      owner: 'operator@example.local'
    }
  ]);
});

test('Context Pack usage flow summarizes task boundary and source scope', () => {
  const usageFlow = createContextPackUsageFlow(createExampleStore(), 'context_pack_example_001');

  assert.equal(usageFlow.title, 'Context Pack usage flow');
  assert.equal(usageFlow.taskType, 'brand-writing');
  assert.equal(usageFlow.intendedAudience, 'AI agents drafting product and brand copy');
  assert.equal(usageFlow.includedClaimCount, 1);
  assert.equal(usageFlow.includedDecisionCount, 1);
  assert.deepEqual(usageFlow.includedSections, ['positioning', 'audience', 'voice', 'constraints']);
  assert.deepEqual(usageFlow.excludedTopics, ['pricing', 'legal promises', 'unapproved customer claims']);
  assert.deepEqual(usageFlow.steps.map((step) => step.label), [
    'Load approved context',
    'Apply task boundary',
    'Respect exclusions',
    'Follow agent instructions'
  ]);
});

test('Review resolution workflow summarizes pending and resolved review state', () => {
  const store = createExampleStore();
  const pending = createReviewResolutionWorkflow(store, 'review_example_001');

  assert.equal(pending.status, 'needs-resolution');
  assert.equal(pending.targetObjectId, 'context_pack_example_001');
  assert.equal(pending.actionId, 'workflow_action_example_001');
  assert.equal(pending.actionStatus, 'pending');
  assert.equal(pending.recommendedAction, 'Resolve review feedback');
  assert.equal(pending.resolutionResult, 'Review blocks Context Pack readiness');
  assert.deepEqual(pending.steps.map((step) => step.status), ['complete', 'complete', 'active', 'blocked']);

  completeWorkflowAction(store, 'workflow_action_example_001', '2026-07-18');
  const resolved = createReviewResolutionWorkflow(store, 'review_example_001');

  assert.equal(resolved.status, 'resolved');
  assert.equal(resolved.actionStatus, 'complete');
  assert.equal(resolved.recommendedAction, 'Use resolved review');
  assert.equal(resolved.resolutionResult, 'Review approved');
  assert.deepEqual(resolved.steps.map((step) => step.status), ['complete', 'complete', 'complete', 'active']);
});

test('Operator Run summary resolves workflow and current action state', () => {
  const summary = createOperatorRunSummary(createExampleStore(), 'operator_run_example_001');

  assert.equal(summary.objective, 'Resolve Context Pack readiness and prepare handoff.');
  assert.equal(summary.status, 'blocked');
  assert.equal(summary.priority, 'normal');
  assert.equal(summary.workflowRunId, 'workflow_run_example_001');
  assert.equal(summary.workflow, 'generate-context-pack');
  assert.equal(summary.actionCount, 1);
  assert.equal(summary.completedActionCount, 0);
  assert.equal(summary.pendingActionCount, 1);
  assert.equal(summary.currentActionId, 'workflow_action_example_001');
  assert.equal(summary.currentActionStatus, 'pending');
  assert.equal(summary.nextActionLabel, 'Resolve review feedback for context_pack_example_001');
  assert.equal(summary.handoffId, 'operator_handoff_example_001');
  assert.equal(summary.auditEventCount, 1);
});
