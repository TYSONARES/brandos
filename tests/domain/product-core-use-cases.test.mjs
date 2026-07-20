import assert from 'node:assert/strict';
import test from 'node:test';

import {
  completeWorkflowAction,
  createAgentDraftExecution,
  createAgentHandoffContext,
  createAgentPromptPlan,
  createBrandProfileOverview,
  createContextPackUsageFlow,
  createExampleProductCoreState,
  createHandoffAcceptance,
  createInMemoryProductCoreStore,
  createOperatorRunQueue,
  createOperatorRunbookExecution,
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

test('Operator Run Queue summarizes active operator work', () => {
  const queue = createOperatorRunQueue(createExampleStore());

  assert.equal(queue.title, 'Operator Run Queue');
  assert.equal(queue.runCount, 1);
  assert.equal(queue.blockedCount, 1);
  assert.equal(queue.readyCount, 0);
  assert.equal(queue.activeRunId, 'operator_run_example_001');
  assert.deepEqual(queue.items.map((item) => item.id), ['operator_run_example_001']);
  assert.equal(queue.items[0].currentActionStatus, 'pending');
});

test('Operator Runbook Execution expands a run into operator steps', () => {
  const runbook = createOperatorRunbookExecution(createExampleStore(), 'operator_run_example_001');

  assert.equal(runbook.title, 'Operator Runbook Execution');
  assert.equal(runbook.runId, 'operator_run_example_001');
  assert.equal(runbook.status, 'blocked');
  assert.equal(runbook.currentActionId, 'workflow_action_example_001');
  assert.equal(runbook.currentActionStatus, 'pending');
  assert.equal(runbook.handoffId, 'operator_handoff_example_001');
  assert.deepEqual(runbook.steps.map((step) => step.label), [
    'Confirm operator objective',
    'Inspect current action',
    'Resolve current action',
    'Verify handoff context',
    'Close operator run'
  ]);
  assert.deepEqual(runbook.steps.map((step) => step.status), ['complete', 'active', 'blocked', 'blocked', 'blocked']);
});

test('Handoff Acceptance blocks until Operator Run actions are complete', () => {
  const store = createExampleStore();
  const blocked = createHandoffAcceptance(store, 'operator_run_example_001');

  assert.equal(blocked.status, 'blocked');
  assert.equal(blocked.accepted, false);
  assert.equal(blocked.nextWorkflow, 'Operator Runbook Execution');
  assert.equal(blocked.blockedReasons.length, 3);

  completeWorkflowAction(store, 'workflow_action_example_001', '2026-07-20');
  const accepted = createHandoffAcceptance(store, 'operator_run_example_001');

  assert.equal(accepted.status, 'accepted');
  assert.equal(accepted.accepted, true);
  assert.equal(accepted.nextWorkflow, 'Use Context Pack');
  assert.deepEqual(accepted.blockedReasons, []);
  assert.deepEqual(accepted.requiredEvidence, [
    'Current action workflow_action_example_001 is complete',
    'Runbook status is ready',
    'Handoff operator_handoff_example_001 is linked'
  ]);
});

test('Agent Handoff Context waits for accepted handoff before agent work', () => {
  const store = createExampleStore();
  const blocked = createAgentHandoffContext(store, 'operator_run_example_001');

  assert.equal(blocked.title, 'Agent Handoff Context');
  assert.equal(blocked.status, 'blocked');
  assert.equal(blocked.readyForAgent, false);
  assert.equal(blocked.accepted, false);
  assert.equal(blocked.contextPackId, 'context_pack_example_001');
  assert.equal(blocked.taskType, 'brand-writing');
  assert.equal(blocked.sourceCount, 2);
  assert.equal(blocked.nextWorkflow, 'Operator Runbook Execution');
  assert.equal(blocked.nextAgent, 'Operator');
  assert.deepEqual(blocked.contextSources, [
    'Handoff Acceptance',
    'Operator Runbook Execution',
    'Context Pack usage flow'
  ]);
  assert.equal(blocked.blockedReasons.length, 3);
  assert.deepEqual(blocked.agentInstructions, [
    'Wait for accepted handoff before agent work.',
    'Route blockers back to Operator Runbook Execution.',
    'Do not infer missing source context from chat history.'
  ]);

  completeWorkflowAction(store, 'workflow_action_example_001', '2026-07-20');
  const ready = createAgentHandoffContext(store, 'operator_run_example_001');

  assert.equal(ready.status, 'ready');
  assert.equal(ready.readyForAgent, true);
  assert.equal(ready.accepted, true);
  assert.equal(ready.nextWorkflow, 'Use Context Pack');
  assert.equal(ready.nextAgent, 'AI writing agent');
  assert.deepEqual(ready.blockedReasons, []);
  assert.deepEqual(ready.agentInstructions, [
    'Use accepted handoff context only.',
    'Load Context Pack context_pack_example_001 before drafting.',
    'Respect exclusions: pricing, legal promises, unapproved customer claims.'
  ]);
});

test('Agent Prompt Plan only opens after Agent Handoff Context is ready', () => {
  const store = createExampleStore();
  const blocked = createAgentPromptPlan(store, 'operator_run_example_001');

  assert.equal(blocked.title, 'Agent Prompt Plan');
  assert.equal(blocked.status, 'blocked');
  assert.equal(blocked.promptAllowed, false);
  assert.equal(blocked.agent, 'Operator');
  assert.equal(blocked.contextPackId, 'context_pack_example_001');
  assert.equal(blocked.nextWorkflow, 'Operator Runbook Execution');
  assert.equal(blocked.objective, 'Resolve accepted handoff before prompt planning.');
  assert.equal(blocked.sourcePolicy, 'Prompt plan is blocked; do not use chat history as fallback context.');
  assert.deepEqual(blocked.promptSections, [
    'Blocked state',
    'Required operator resolution',
    'Missing accepted handoff evidence'
  ]);
  assert.deepEqual(blocked.guardrails, [
    'Do not draft.',
    'Return blockers to Operator Runbook Execution.',
    'Wait for ready Agent Handoff Context.'
  ]);
  assert.equal(blocked.blockers.length, 3);

  completeWorkflowAction(store, 'workflow_action_example_001', '2026-07-20');
  const ready = createAgentPromptPlan(store, 'operator_run_example_001');

  assert.equal(ready.status, 'ready');
  assert.equal(ready.promptAllowed, true);
  assert.equal(ready.agent, 'AI writing agent');
  assert.equal(ready.nextWorkflow, 'Agent Draft Execution');
  assert.equal(ready.objective, 'Draft brand-writing output using context_pack_example_001.');
  assert.equal(ready.sourcePolicy, 'Repository context only: accepted handoff and Context Pack sources.');
  assert.deepEqual(ready.promptSections, [
    'Objective',
    'Accepted source context',
    'Task boundary',
    'Required evidence',
    'Agent instructions',
    'Output constraints'
  ]);
  assert.deepEqual(ready.guardrails, [
    'Use accepted handoff context only.',
    'Cite repository-backed claims and decisions when drafting.',
    'Respect Context Pack exclusions.'
  ]);
  assert.deepEqual(ready.blockers, []);
});

test('Agent Draft Execution only drafts from a ready prompt plan', () => {
  const store = createExampleStore();
  const blocked = createAgentDraftExecution(store, 'operator_run_example_001');

  assert.equal(blocked.title, 'Agent Draft Execution');
  assert.equal(blocked.status, 'blocked');
  assert.equal(blocked.draftAllowed, false);
  assert.equal(blocked.agent, 'Operator');
  assert.equal(blocked.contextPackId, 'context_pack_example_001');
  assert.equal(blocked.draftTitle, 'Draft blocked');
  assert.equal(blocked.draftBody, '');
  assert.deepEqual(blocked.evidenceCitations, []);
  assert.deepEqual(blocked.qualityChecks.map((check) => check.status), ['blocked', 'blocked', 'blocked']);
  assert.equal(blocked.nextWorkflow, 'Operator Runbook Execution');

  completeWorkflowAction(store, 'workflow_action_example_001', '2026-07-20');
  const ready = createAgentDraftExecution(store, 'operator_run_example_001');

  assert.equal(ready.status, 'ready');
  assert.equal(ready.draftAllowed, true);
  assert.equal(ready.agent, 'AI writing agent');
  assert.equal(ready.draftTitle, 'Example Brand brand-writing draft');
  assert.equal(
    ready.draftBody,
    'Example Brand helps Teams building brand-led products with AI assistance turns scattered brand knowledge into reusable operating context.'
  );
  assert.deepEqual(ready.evidenceCitations, [
    'Claim claim_example_001: BrandOS turns scattered brand knowledge into reusable operating context.',
    'Decision decision_example_001: Use repository-first brand truth',
    'Context Pack context_pack_example_001: Example Brand Writing Context'
  ]);
  assert.deepEqual(ready.qualityChecks.map((check) => check.status), ['pass', 'pass', 'pass']);
  assert.deepEqual(ready.blockers, []);
  assert.equal(ready.nextWorkflow, 'Draft Review');
});
