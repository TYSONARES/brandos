import assert from 'node:assert/strict';
import test from 'node:test';

import {
  completeWorkflowAction,
  createAgentDraftExecution,
  createAgentHandoffClosure,
  createAgentHandoffContext,
  createAgentHandoffRuntimeAggregateSummary,
  createAgentHandoffRuntimeFinalClosure,
  createAgentHandoffRuntimeSummary,
  createAgentPromptPlan,
  createBrandProfileOverview,
  createCommandResultSummary,
  createContextPackUsageFlow,
  createDraftReview,
  createExampleProductCoreState,
  createHandoffAcceptance,
  createInMemoryProductCoreStore,
  createOperatorHandoffReadiness,
  createOperatorRunQueue,
  createOperatorRunbookExecution,
  createOperatorRunSummary,
  createOperatorStepDetail,
  createOperatorTaskSelection,
  createOperatorWorkflowDesignAggregateSummary,
  createOperatorWorkflowDesignFinalClosure,
  createOperatorWorkflowMap,
  createRepositoryBranchStatus,
  createReviewResolutionWorkflow,
  createRuntimeHealthSummary,
  createStudioWorkflowRuntimeAggregateSummary,
  createStudioWorkflowRuntimeFinalClosure,
  createStudioStateRecovery,
  createRuntimeValidationSignals,
  createOperatorRecoveryGuidance,
  createWorkflowSessionSummary,
  createWorkflowTransitionPlan,
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

test('Draft Review approves only repository-cited ready drafts', () => {
  const store = createExampleStore();
  const blocked = createDraftReview(store, 'operator_run_example_001');

  assert.equal(blocked.title, 'Draft Review');
  assert.equal(blocked.status, 'blocked');
  assert.equal(blocked.approved, false);
  assert.equal(blocked.contextPackId, 'context_pack_example_001');
  assert.equal(blocked.draftTitle, 'Draft blocked');
  assert.equal(blocked.reviewDecision, 'Block draft until execution is ready');
  assert.equal(blocked.reviewSummary, 'Draft review waits for allowed draft execution.');
  assert.deepEqual(blocked.requiredEvidence, [
    'Draft body is not available.',
    'Repository citations are missing.',
    'Quality checks are blocked.'
  ]);
  assert.deepEqual(blocked.reviewChecks.map((check) => check.status), ['blocked', 'blocked', 'blocked']);
  assert.equal(blocked.nextWorkflow, 'Operator Runbook Execution');

  completeWorkflowAction(store, 'workflow_action_example_001', '2026-07-20');
  const approved = createDraftReview(store, 'operator_run_example_001');

  assert.equal(approved.status, 'approved');
  assert.equal(approved.approved, true);
  assert.equal(approved.draftTitle, 'Example Brand brand-writing draft');
  assert.equal(approved.reviewDecision, 'Approve draft for handoff closure');
  assert.equal(approved.reviewSummary, 'Draft includes repository citations and passes required quality checks.');
  assert.deepEqual(approved.requiredEvidence, [
    'Draft title: Example Brand brand-writing draft',
    'Citation count: 3',
    'Quality checks passed: 3'
  ]);
  assert.deepEqual(approved.reviewChecks.map((check) => check.status), ['pass', 'pass', 'pass']);
  assert.deepEqual(approved.blockers, []);
  assert.equal(approved.nextWorkflow, 'Agent Handoff Closure');
});

test('Agent Handoff Closure closes only approved Draft Review output', () => {
  const store = createExampleStore();
  const blocked = createAgentHandoffClosure(store, 'operator_run_example_001');

  assert.equal(blocked.title, 'Agent Handoff Closure');
  assert.equal(blocked.status, 'blocked');
  assert.equal(blocked.closed, false);
  assert.equal(blocked.contextPackId, 'context_pack_example_001');
  assert.equal(blocked.closureDecision, 'Keep agent handoff open');
  assert.equal(blocked.closureSummary, 'Agent handoff closure waits for approved Draft Review.');
  assert.deepEqual(blocked.closedArtifacts, []);
  assert.deepEqual(blocked.closureEvidence, [
    'Draft body is not available.',
    'Repository citations are missing.',
    'Quality checks are blocked.'
  ]);
  assert.deepEqual(blocked.closureChecks.map((check) => check.status), ['blocked', 'pass', 'pass']);
  assert.equal(blocked.nextWorkflow, 'Operator Runbook Execution');

  completeWorkflowAction(store, 'workflow_action_example_001', '2026-07-20');
  const closed = createAgentHandoffClosure(store, 'operator_run_example_001');

  assert.equal(closed.status, 'closed');
  assert.equal(closed.closed, true);
  assert.equal(closed.closureDecision, 'Close agent handoff');
  assert.equal(closed.closureSummary, 'Agent handoff is closed with approved draft review evidence.');
  assert.deepEqual(closed.closedArtifacts, [
    'Example Brand brand-writing draft',
    'Draft Review evidence',
    'Repository citation trail'
  ]);
  assert.deepEqual(closed.closureEvidence, [
    'Draft review status: approved',
    'Draft review decision: Approve draft for handoff closure',
    'Required evidence count: 3'
  ]);
  assert.deepEqual(closed.closureChecks.map((check) => check.status), ['pass', 'pass', 'pass']);
  assert.deepEqual(closed.blockers, []);
  assert.equal(closed.nextWorkflow, 'Agent Handoff Runtime Summary');
});

test('Agent Handoff Runtime Summary reflects blocked and complete pipeline state', () => {
  const store = createExampleStore();
  const blocked = createAgentHandoffRuntimeSummary(store, 'operator_run_example_001');

  assert.equal(blocked.title, 'Agent Handoff Runtime Summary');
  assert.equal(blocked.status, 'blocked');
  assert.equal(blocked.complete, false);
  assert.equal(blocked.stageCount, 5);
  assert.equal(blocked.completedStageCount, 0);
  assert.equal(blocked.blockedStageCount, 5);
  assert.equal(blocked.finalDecision, 'Agent handoff runtime blocked');
  assert.equal(blocked.finalSummary, 'Agent Handoff Runtime waits for upstream handoff readiness.');
  assert.equal(blocked.nextWorkflow, 'Operator Runbook Execution');
  assert.deepEqual(blocked.stages.map((stage) => stage.status), ['blocked', 'blocked', 'blocked', 'blocked', 'blocked']);

  completeWorkflowAction(store, 'workflow_action_example_001', '2026-07-20');
  const complete = createAgentHandoffRuntimeSummary(store, 'operator_run_example_001');

  assert.equal(complete.status, 'complete');
  assert.equal(complete.complete, true);
  assert.equal(complete.completedStageCount, 5);
  assert.equal(complete.blockedStageCount, 0);
  assert.equal(complete.finalDecision, 'Agent handoff runtime complete');
  assert.equal(complete.finalSummary, 'All Agent Handoff Runtime stages are closed with repository-backed evidence.');
  assert.deepEqual(complete.evidence, [
    'Closure status: closed',
    'Closed artifacts: 3',
    'Closure evidence count: 3'
  ]);
  assert.deepEqual(complete.blockers, []);
  assert.equal(complete.nextWorkflow, 'Agent Handoff Runtime Aggregate Summary');
});

test('Agent Handoff Runtime Aggregate Summary closes only complete runtime summaries', () => {
  const store = createExampleStore();
  const blocked = createAgentHandoffRuntimeAggregateSummary(store, 'operator_run_example_001');

  assert.equal(blocked.title, 'Agent Handoff Runtime Aggregate Summary');
  assert.equal(blocked.status, 'blocked');
  assert.equal(blocked.complete, false);
  assert.equal(blocked.runtimeCount, 1);
  assert.equal(blocked.completeRuntimeCount, 0);
  assert.equal(blocked.blockedRuntimeCount, 1);
  assert.equal(blocked.completedStageCount, 0);
  assert.equal(blocked.totalStageCount, 5);
  assert.equal(blocked.aggregateDecision, 'Keep Agent Handoff Runtime v1.2 aggregate open');
  assert.equal(blocked.aggregateSummary, 'Agent Handoff Runtime v1.2 aggregate waits for runtime summary completion.');
  assert.equal(blocked.nextWorkflow, 'Operator Runbook Execution');
  assert.deepEqual(blocked.runtimeItems, [
    {
      label: 'Agent Handoff Runtime Summary',
      status: 'blocked',
      completedStages: 0,
      totalStages: 5
    }
  ]);

  completeWorkflowAction(store, 'workflow_action_example_001', '2026-07-20');
  const complete = createAgentHandoffRuntimeAggregateSummary(store, 'operator_run_example_001');

  assert.equal(complete.status, 'complete');
  assert.equal(complete.complete, true);
  assert.equal(complete.completeRuntimeCount, 1);
  assert.equal(complete.blockedRuntimeCount, 0);
  assert.equal(complete.completedStageCount, 5);
  assert.equal(complete.totalStageCount, 5);
  assert.equal(complete.aggregateDecision, 'Close Agent Handoff Runtime v1.2 aggregate');
  assert.equal(complete.aggregateSummary, 'Agent Handoff Runtime v1.2 has a complete runtime summary and is ready for final closure.');
  assert.deepEqual(complete.evidence, [
    'Runtime summary status: complete',
    'Runtime stages complete: 5/5',
    'Runtime evidence count: 3'
  ]);
  assert.deepEqual(complete.blockers, []);
  assert.equal(complete.nextWorkflow, 'Agent Handoff Runtime Final Closure');
});

test('Agent Handoff Runtime Final Closure closes only complete aggregate summaries', () => {
  const store = createExampleStore();
  const blocked = createAgentHandoffRuntimeFinalClosure(store, 'operator_run_example_001');

  assert.equal(blocked.title, 'Agent Handoff Runtime Final Closure');
  assert.equal(blocked.status, 'blocked');
  assert.equal(blocked.closed, false);
  assert.equal(blocked.closureDecision, 'Keep Agent Handoff Runtime v1.2 open');
  assert.equal(blocked.closureSummary, 'Agent Handoff Runtime v1.2 final closure waits for aggregate completion.');
  assert.deepEqual(blocked.releaseArtifacts, []);
  assert.equal(blocked.nextWorkflow, 'Operator Runbook Execution');
  assert.deepEqual(blocked.closureChecks.map((check) => check.status), ['blocked', 'pass', 'blocked']);

  completeWorkflowAction(store, 'workflow_action_example_001', '2026-07-20');
  const closed = createAgentHandoffRuntimeFinalClosure(store, 'operator_run_example_001');

  assert.equal(closed.status, 'closed');
  assert.equal(closed.closed, true);
  assert.equal(closed.closureDecision, 'Close Agent Handoff Runtime v1.2');
  assert.equal(closed.closureSummary, 'Agent Handoff Runtime v1.2 is closed with aggregate evidence and is ready for archive.');
  assert.deepEqual(closed.releaseArtifacts, [
    'Agent Handoff Runtime Summary',
    'Agent Handoff Runtime Aggregate Summary',
    'Agent Handoff Runtime v1.2 closure evidence'
  ]);
  assert.deepEqual(closed.closureEvidence, [
    'Aggregate status: complete',
    'Aggregate runtimes complete: 1/1',
    'Aggregate stages complete: 5/5'
  ]);
  assert.deepEqual(closed.closureChecks.map((check) => check.status), ['pass', 'pass', 'pass']);
  assert.deepEqual(closed.blockers, []);
  assert.equal(closed.nextWorkflow, 'Agent Handoff Runtime v1.2 Closed');
});

test('Runtime Health Summary reports attention and healthy local runtime state', () => {
  const store = createExampleStore();
  const attention = createRuntimeHealthSummary(store, 'operator_run_example_001');

  assert.equal(attention.title, 'Runtime Health Summary');
  assert.equal(attention.status, 'attention');
  assert.equal(attention.healthy, false);
  assert.equal(attention.stateSource, 'example');
  assert.equal(attention.completedActionCount, 0);
  assert.equal(attention.readinessStatus, 'blocked');
  assert.equal(attention.runtimeClosureStatus, 'blocked');
  assert.equal(attention.healthDecision, 'Runtime needs operator attention before repeated local use');
  assert.equal(attention.nextWorkflow, 'Review Resolution Workflow');
  assert.ok(attention.blockers.includes('Workflow Action state is not durable for repeated local use.'));
  assert.deepEqual(attention.signals.map((signal) => signal.status), ['attention', 'attention', 'attention']);

  completeWorkflowAction(store, 'workflow_action_example_001', '2026-07-20');
  const healthy = createRuntimeHealthSummary(store, 'operator_run_example_001', {
    stateSource: 'command',
    stateStatus: 'loaded',
    completedActionCount: 1,
    completedActionIds: ['workflow_action_example_001']
  });

  assert.equal(healthy.status, 'healthy');
  assert.equal(healthy.healthy, true);
  assert.equal(healthy.readinessStatus, 'ready');
  assert.equal(healthy.runtimeClosureStatus, 'closed');
  assert.equal(healthy.healthDecision, 'Runtime is reliable for repeated local use');
  assert.equal(healthy.healthSummary, 'Studio state, workflow action history, and runtime closure are aligned.');
  assert.deepEqual(healthy.signals.map((signal) => signal.status), ['pass', 'pass', 'pass']);
  assert.deepEqual(healthy.recoveryActions, [
    'Keep current Studio state for repeated local runs.',
    'Use ready scenario as the reliability baseline.'
  ]);
  assert.deepEqual(healthy.blockers, []);
  assert.equal(healthy.nextWorkflow, 'Studio State Recovery');
});

test('Studio State Recovery maps runtime health into recovery steps', () => {
  const store = createExampleStore();
  const recovery = createStudioStateRecovery(store, 'operator_run_example_001');

  assert.equal(recovery.title, 'Studio State Recovery');
  assert.equal(recovery.status, 'needs-recovery');
  assert.equal(recovery.recoveryReady, false);
  assert.equal(recovery.recoveryDecision, 'Recover Studio state before repeated local use');
  assert.equal(recovery.recoverySummary, 'Studio state recovery must resolve runtime health attention signals.');
  assert.equal(recovery.nextWorkflow, 'Review Resolution Workflow');
  assert.deepEqual(recovery.recoverySteps.map((step) => step.status), ['active', 'pending', 'pending']);
  assert.ok(recovery.requiredEvidence.includes('Context readiness: attention - 1 blockers'));

  completeWorkflowAction(store, 'workflow_action_example_001', '2026-07-20');
  const ready = createStudioStateRecovery(store, 'operator_run_example_001', {
    stateSource: 'command',
    stateStatus: 'loaded',
    completedActionCount: 1,
    completedActionIds: ['workflow_action_example_001']
  });

  assert.equal(ready.status, 'ready');
  assert.equal(ready.recoveryReady, true);
  assert.equal(ready.recoveryDecision, 'Keep current Studio state');
  assert.equal(ready.recoverySummary, 'Studio state is reliable and can be reused as the local ready baseline.');
  assert.deepEqual(ready.recoverySteps.map((step) => step.status), ['complete', 'active']);
  assert.deepEqual(ready.requiredEvidence, [
    'Runtime health status: healthy',
    'Completed actions: 1',
    'Runtime closure: closed'
  ]);
  assert.deepEqual(ready.blockers, []);
  assert.equal(ready.nextWorkflow, 'Runtime Validation Signals');
});

test('Runtime Validation Signals maps recovery into repeatable validation state', () => {
  const store = createExampleStore();
  const blocked = createRuntimeValidationSignals(store, 'operator_run_example_001');

  assert.equal(blocked.title, 'Runtime Validation Signals');
  assert.equal(blocked.status, 'blocked');
  assert.equal(blocked.validationReady, false);
  assert.equal(blocked.validationDecision, 'Runtime validation waits for Studio state recovery');
  assert.equal(blocked.validationSummary, 'Runtime validation signals are blocked until recovery evidence is ready.');
  assert.equal(blocked.nextWorkflow, 'Review Resolution Workflow');
  assert.deepEqual(blocked.validationSignals.map((signal) => signal.status), ['attention', 'blocked', 'attention']);
  assert.deepEqual(blocked.validationCommands, [
    'npm run check:runtime-reliability',
    'npm run check:studio-render',
    'npm run check:studio-build',
    'npm run check:all'
  ]);
  assert.ok(blocked.requiredEvidence.includes('Context readiness: attention - 1 blockers'));

  completeWorkflowAction(store, 'workflow_action_example_001', '2026-07-20');
  const ready = createRuntimeValidationSignals(store, 'operator_run_example_001', {
    stateSource: 'command',
    stateStatus: 'loaded',
    completedActionCount: 1,
    completedActionIds: ['workflow_action_example_001']
  });

  assert.equal(ready.status, 'ready');
  assert.equal(ready.validationReady, true);
  assert.equal(ready.validationDecision, 'Runtime validation signals are ready');
  assert.equal(ready.validationSummary, 'Studio can use repeatable validation signals for local runtime confidence.');
  assert.deepEqual(ready.validationSignals.map((signal) => signal.status), ['pass', 'pass', 'pass']);
  assert.deepEqual(ready.requiredEvidence, [
    'Runtime health status: healthy',
    'Completed actions: 1',
    'Runtime closure: closed'
  ]);
  assert.deepEqual(ready.blockers, []);
  assert.equal(ready.nextWorkflow, 'Runtime Reliability Closure');
});

test('Operator Recovery Guidance maps validation signals into operator steps', () => {
  const store = createExampleStore();
  const blocked = createOperatorRecoveryGuidance(store, 'operator_run_example_001');

  assert.equal(blocked.title, 'Operator Recovery Guidance');
  assert.equal(blocked.status, 'action-required');
  assert.equal(blocked.guidanceReady, false);
  assert.equal(blocked.guidanceDecision, 'Follow recovery guidance before closure');
  assert.equal(blocked.guidanceSummary, 'Operator recovery guidance explains the manual steps needed before runtime closure.');
  assert.equal(blocked.nextWorkflow, 'Review Resolution Workflow');
  assert.deepEqual(blocked.guidanceSteps.map((step) => step.status), ['active', 'pending', 'pending']);
  assert.ok(blocked.requiredEvidence.includes('Context readiness: attention - 1 blockers'));

  completeWorkflowAction(store, 'workflow_action_example_001', '2026-07-20');
  const ready = createOperatorRecoveryGuidance(store, 'operator_run_example_001', {
    stateSource: 'command',
    stateStatus: 'loaded',
    completedActionCount: 1,
    completedActionIds: ['workflow_action_example_001']
  });

  assert.equal(ready.status, 'ready');
  assert.equal(ready.guidanceReady, true);
  assert.equal(ready.guidanceDecision, 'Continue with runtime reliability closure');
  assert.equal(ready.guidanceSummary, 'Operator recovery guidance confirms the local runtime baseline is reusable.');
  assert.deepEqual(ready.guidanceSteps.map((step) => step.status), ['complete', 'active']);
  assert.deepEqual(ready.recommendedCommands, [
    'npm run check:runtime-reliability',
    'npm run check:studio-render',
    'npm run check:studio-build',
    'npm run check:all'
  ]);
  assert.deepEqual(ready.blockers, []);
  assert.equal(ready.nextWorkflow, 'Runtime Reliability Aggregate Summary');
});

test('Workflow Session Summary maps Studio state into session route', () => {
  const store = createExampleStore();
  const blocked = createWorkflowSessionSummary(store, 'operator_run_example_001');

  assert.equal(blocked.title, 'Workflow Session Summary');
  assert.equal(blocked.status, 'blocked');
  assert.equal(blocked.sessionReady, false);
  assert.equal(blocked.workflowName, 'Context Pack workflow');
  assert.equal(blocked.scenario, 'blocked');
  assert.equal(blocked.currentStep, 'resolve-review');
  assert.equal(blocked.actionStatus, 'pending');
  assert.equal(blocked.sessionDecision, 'Resolve workflow session blockers');
  assert.equal(blocked.sessionSummary, 'Workflow session is blocked until readiness and recovery guidance are resolved.');
  assert.equal(blocked.nextRoute, 'index.html');
  assert.equal(blocked.nextWorkflow, 'Review Resolution Workflow');
  assert.deepEqual(blocked.sessionSignals.map((signal) => signal.status), ['blocked', 'attention', 'pass']);
  assert.ok(blocked.requiredEvidence.includes('Scenario: blocked'));

  completeWorkflowAction(store, 'workflow_action_example_001', '2026-07-20');
  const ready = createWorkflowSessionSummary(store, 'operator_run_example_001', {
    stateSource: 'command',
    stateStatus: 'loaded',
    completedActionCount: 1,
    completedActionIds: ['workflow_action_example_001']
  });

  assert.equal(ready.status, 'ready');
  assert.equal(ready.sessionReady, true);
  assert.equal(ready.scenario, 'ready');
  assert.equal(ready.currentStep, 'ready-for-use');
  assert.equal(ready.actionStatus, 'ready');
  assert.equal(ready.sessionDecision, 'Continue workflow session');
  assert.equal(ready.sessionSummary, 'Workflow session is ready with reusable state and clear next route.');
  assert.equal(ready.nextRoute, 'ready.html');
  assert.equal(ready.nextWorkflow, 'Workflow Transition Plan');
  assert.deepEqual(ready.sessionSignals.map((signal) => signal.status), ['pass', 'pass', 'pass']);
  assert.deepEqual(ready.blockers, []);
});

test('Workflow Transition Plan maps session route into transition steps', () => {
  const store = createExampleStore();
  const blocked = createWorkflowTransitionPlan(store, 'operator_run_example_001');

  assert.equal(blocked.title, 'Workflow Transition Plan');
  assert.equal(blocked.status, 'blocked');
  assert.equal(blocked.transitionReady, false);
  assert.equal(blocked.scenario, 'blocked');
  assert.equal(blocked.fromRoute, 'index.html');
  assert.equal(blocked.toRoute, 'index.html');
  assert.equal(blocked.transitionDecision, 'Stay on blocked workflow route');
  assert.equal(blocked.transitionSummary, 'Workflow transition waits for session blockers to clear.');
  assert.deepEqual(blocked.transitionSteps.map((step) => step.status), ['active', 'pending', 'pending']);
  assert.equal(blocked.nextWorkflow, 'Review Resolution Workflow');

  completeWorkflowAction(store, 'workflow_action_example_001', '2026-07-20');
  const ready = createWorkflowTransitionPlan(store, 'operator_run_example_001', {
    stateSource: 'command',
    stateStatus: 'loaded',
    completedActionCount: 1,
    completedActionIds: ['workflow_action_example_001']
  });

  assert.equal(ready.status, 'ready');
  assert.equal(ready.transitionReady, true);
  assert.equal(ready.scenario, 'ready');
  assert.equal(ready.fromRoute, 'index.html');
  assert.equal(ready.toRoute, 'ready.html');
  assert.equal(ready.transitionDecision, 'Proceed to ready workflow route');
  assert.equal(ready.transitionSummary, 'Workflow transition can continue because the session is ready.');
  assert.deepEqual(ready.transitionSteps.map((step) => step.status), ['complete', 'active']);
  assert.deepEqual(ready.blockers, []);
  assert.equal(ready.nextWorkflow, 'Command Result Summary');
});

test('Command Result Summary maps transition readiness into command outcome', () => {
  const store = createExampleStore();
  const blocked = createCommandResultSummary(store, 'operator_run_example_001');

  assert.equal(blocked.title, 'Command Result Summary');
  assert.equal(blocked.status, 'blocked');
  assert.equal(blocked.commandComplete, false);
  assert.equal(blocked.scenario, 'blocked');
  assert.equal(blocked.fromRoute, 'index.html');
  assert.equal(blocked.toRoute, 'index.html');
  assert.equal(blocked.commandDecision, 'Command result waits for transition readiness');
  assert.equal(blocked.commandSummary, 'Command result remains blocked until the workflow transition can proceed.');
  assert.deepEqual(blocked.commandResults.map((result) => result.status), ['blocked', 'active', 'pending']);
  assert.equal(blocked.nextWorkflow, 'Review Resolution Workflow');

  completeWorkflowAction(store, 'workflow_action_example_001', '2026-07-20');
  const ready = createCommandResultSummary(store, 'operator_run_example_001', {
    stateSource: 'command',
    stateStatus: 'loaded',
    completedActionCount: 1,
    completedActionIds: ['workflow_action_example_001']
  });

  assert.equal(ready.status, 'complete');
  assert.equal(ready.commandComplete, true);
  assert.equal(ready.scenario, 'ready');
  assert.equal(ready.fromRoute, 'index.html');
  assert.equal(ready.toRoute, 'ready.html');
  assert.equal(ready.commandDecision, 'Command result can be accepted');
  assert.equal(ready.commandSummary, 'Command result confirms the ready workflow route and reusable state evidence.');
  assert.deepEqual(ready.commandResults.map((result) => result.status), ['complete', 'complete', 'active']);
  assert.ok(ready.requiredEvidence.includes('Transition route: index.html -> ready.html'));
  assert.deepEqual(ready.blockers, []);
  assert.equal(ready.nextWorkflow, 'Studio Workflow Runtime Aggregate Summary');
});

test('Studio Workflow Runtime Aggregate Summary rolls command results into release evidence', () => {
  const store = createExampleStore();
  const blocked = createStudioWorkflowRuntimeAggregateSummary(store, 'operator_run_example_001');

  assert.equal(blocked.title, 'Studio Workflow Runtime Aggregate Summary');
  assert.equal(blocked.status, 'blocked');
  assert.equal(blocked.aggregateReady, false);
  assert.equal(blocked.scenario, 'blocked');
  assert.equal(blocked.commandCount, 1);
  assert.equal(blocked.completeCommandCount, 0);
  assert.equal(blocked.blockedCommandCount, 1);
  assert.equal(blocked.aggregateDecision, 'Keep Studio workflow runtime aggregate blocked');
  assert.equal(blocked.aggregateSummary, 'Studio Workflow Runtime v1.4 aggregate waits for command result completion.');
  assert.deepEqual(blocked.commandItems.map((item) => item.status), ['blocked']);
  assert.equal(blocked.nextWorkflow, 'Review Resolution Workflow');

  completeWorkflowAction(store, 'workflow_action_example_001', '2026-07-20');
  const ready = createStudioWorkflowRuntimeAggregateSummary(store, 'operator_run_example_001', {
    stateSource: 'command',
    stateStatus: 'loaded',
    completedActionCount: 1,
    completedActionIds: ['workflow_action_example_001']
  });

  assert.equal(ready.status, 'ready');
  assert.equal(ready.aggregateReady, true);
  assert.equal(ready.scenario, 'ready');
  assert.equal(ready.commandCount, 1);
  assert.equal(ready.completeCommandCount, 1);
  assert.equal(ready.blockedCommandCount, 0);
  assert.equal(ready.aggregateDecision, 'Aggregate Studio workflow runtime evidence');
  assert.equal(ready.aggregateSummary, 'Studio Workflow Runtime v1.4 has complete command result evidence and can move toward final closure.');
  assert.deepEqual(ready.commandItems.map((item) => item.status), ['complete']);
  assert.ok(ready.requiredEvidence.includes('Command route: index.html -> ready.html'));
  assert.deepEqual(ready.blockers, []);
  assert.equal(ready.nextWorkflow, 'Studio Workflow Runtime Final Closure');
});

test('Studio Workflow Runtime Final Closure closes only ready aggregate summaries', () => {
  const store = createExampleStore();
  const blocked = createStudioWorkflowRuntimeFinalClosure(store, 'operator_run_example_001');

  assert.equal(blocked.title, 'Studio Workflow Runtime Final Closure');
  assert.equal(blocked.status, 'blocked');
  assert.equal(blocked.closed, false);
  assert.equal(blocked.scenario, 'blocked');
  assert.equal(blocked.closureDecision, 'Keep Studio Workflow Runtime v1.4 open');
  assert.equal(blocked.closureSummary, 'Studio Workflow Runtime v1.4 final closure waits for aggregate readiness.');
  assert.deepEqual(blocked.releaseArtifacts, []);
  assert.deepEqual(blocked.closureChecks.map((check) => check.status), ['blocked', 'pass', 'blocked']);
  assert.equal(blocked.nextWorkflow, 'Review Resolution Workflow');

  completeWorkflowAction(store, 'workflow_action_example_001', '2026-07-20');
  const closed = createStudioWorkflowRuntimeFinalClosure(store, 'operator_run_example_001', {
    stateSource: 'command',
    stateStatus: 'loaded',
    completedActionCount: 1,
    completedActionIds: ['workflow_action_example_001']
  });

  assert.equal(closed.status, 'closed');
  assert.equal(closed.closed, true);
  assert.equal(closed.scenario, 'ready');
  assert.equal(closed.closureDecision, 'Close Studio Workflow Runtime v1.4');
  assert.equal(closed.closureSummary, 'Studio Workflow Runtime v1.4 is closed with aggregate command evidence and is ready for archive.');
  assert.deepEqual(closed.releaseArtifacts, [
    'Workflow Session Summary',
    'Workflow Transition Plan',
    'Command Result Summary',
    'Studio Workflow Runtime Aggregate Summary'
  ]);
  assert.deepEqual(closed.closureChecks.map((check) => check.status), ['pass', 'pass', 'pass']);
  assert.ok(closed.closureEvidence.includes('Aggregate commands complete: 1/1'));
  assert.deepEqual(closed.blockers, []);
  assert.equal(closed.nextWorkflow, 'Studio Workflow Runtime v1.4 Closed');
});

test('Operator Workflow Map exposes blocked and ready operator paths', () => {
  const store = createExampleStore();
  const blocked = createOperatorWorkflowMap(store, 'operator_run_example_001');

  assert.equal(blocked.title, 'Operator Workflow Map');
  assert.equal(blocked.status, 'blocked');
  assert.equal(blocked.mapReady, false);
  assert.equal(blocked.scenario, 'blocked');
  assert.equal(blocked.activePath, 'Review Resolution Workflow');
  assert.equal(blocked.pathCount, 4);
  assert.equal(blocked.blockedPathCount, 1);
  assert.equal(blocked.mapDecision, 'Resolve blockers before operator workflow selection');
  assert.equal(blocked.mapSummary, 'Operator workflow map waits for runtime closure and session readiness.');
  assert.deepEqual(blocked.workflowPaths.map((path) => path.status), ['active', 'blocked', 'pending', 'pending']);
  assert.equal(blocked.nextWorkflow, 'Review Resolution Workflow');

  completeWorkflowAction(store, 'workflow_action_example_001', '2026-07-20');
  const ready = createOperatorWorkflowMap(store, 'operator_run_example_001', {
    stateSource: 'command',
    stateStatus: 'loaded',
    completedActionCount: 1,
    completedActionIds: ['workflow_action_example_001']
  });

  assert.equal(ready.status, 'ready');
  assert.equal(ready.mapReady, true);
  assert.equal(ready.scenario, 'ready');
  assert.equal(ready.activePath, 'Use Context Pack');
  assert.equal(ready.pathCount, 4);
  assert.equal(ready.readyPathCount, 4);
  assert.equal(ready.blockedPathCount, 0);
  assert.equal(ready.mapDecision, 'Use ready operator workflow map');
  assert.equal(ready.mapSummary, 'Operator workflow paths are ready for task selection.');
  assert.deepEqual(ready.workflowPaths.map((path) => path.status), ['complete', 'complete', 'complete', 'active']);
  assert.deepEqual(ready.blockers, []);
  assert.equal(ready.nextWorkflow, 'Operator Task Selection');
});

test('Operator Task Selection selects blocker and ready tasks from the workflow map', () => {
  const store = createExampleStore();
  const blocked = createOperatorTaskSelection(store, 'operator_run_example_001');

  assert.equal(blocked.title, 'Operator Task Selection');
  assert.equal(blocked.status, 'blocked');
  assert.equal(blocked.selectionReady, false);
  assert.equal(blocked.scenario, 'blocked');
  assert.equal(blocked.selectedTask, 'Resolve workflow blockers');
  assert.equal(blocked.selectedWorkflow, 'Review Resolution Workflow');
  assert.equal(blocked.taskCount, 3);
  assert.equal(blocked.availableTaskCount, 2);
  assert.equal(blocked.blockedTaskCount, 1);
  assert.equal(blocked.selectionDecision, 'Select blocker resolution task');
  assert.equal(blocked.selectionSummary, 'Operator Task Selection must resolve workflow blockers before task execution.');
  assert.deepEqual(blocked.taskOptions.map((task) => task.status), ['selected', 'available', 'blocked']);
  assert.equal(blocked.nextWorkflow, 'Review Resolution Workflow');

  completeWorkflowAction(store, 'workflow_action_example_001', '2026-07-20');
  const ready = createOperatorTaskSelection(store, 'operator_run_example_001', {
    stateSource: 'command',
    stateStatus: 'loaded',
    completedActionCount: 1,
    completedActionIds: ['workflow_action_example_001']
  });

  assert.equal(ready.status, 'ready');
  assert.equal(ready.selectionReady, true);
  assert.equal(ready.scenario, 'ready');
  assert.equal(ready.selectedTask, 'Use Context Pack');
  assert.equal(ready.selectedWorkflow, 'Use Context Pack');
  assert.equal(ready.taskCount, 3);
  assert.equal(ready.availableTaskCount, 3);
  assert.equal(ready.blockedTaskCount, 0);
  assert.equal(ready.selectionDecision, 'Select ready Context Pack task');
  assert.equal(ready.selectionSummary, 'Operator Task Selection can proceed with the ready Context Pack task.');
  assert.deepEqual(ready.taskOptions.map((task) => task.status), ['selected', 'available', 'next']);
  assert.deepEqual(ready.blockers, []);
  assert.equal(ready.nextWorkflow, 'Operator Step Detail');
});

test('Operator Step Detail exposes blocked and ready active step detail', () => {
  const store = createExampleStore();
  const blocked = createOperatorStepDetail(store, 'operator_run_example_001');

  assert.equal(blocked.title, 'Operator Step Detail');
  assert.equal(blocked.status, 'blocked');
  assert.equal(blocked.detailReady, false);
  assert.equal(blocked.scenario, 'blocked');
  assert.equal(blocked.selectedTask, 'Resolve workflow blockers');
  assert.equal(blocked.selectedWorkflow, 'Review Resolution Workflow');
  assert.equal(blocked.activeStep, 'Inspect blocker detail');
  assert.equal(blocked.stepOwner, 'operator@example.local');
  assert.equal(blocked.stepCommand, 'Resolve workflow blockers');
  assert.equal(blocked.stepOutcome, 'Operator step waits for blocker resolution.');
  assert.equal(blocked.stepCount, 3);
  assert.equal(blocked.readyStepCount, 2);
  assert.equal(blocked.blockedStepCount, 1);
  assert.equal(blocked.detailDecision, 'Inspect blocker resolution step');
  assert.equal(blocked.detailSummary, 'Operator Step Detail keeps the blocker resolution task visible before execution.');
  assert.deepEqual(blocked.stepDetails.map((step) => step.status), ['complete', 'active', 'blocked']);
  assert.equal(blocked.nextWorkflow, 'Review Resolution Workflow');

  completeWorkflowAction(store, 'workflow_action_example_001', '2026-07-20');
  const ready = createOperatorStepDetail(store, 'operator_run_example_001', {
    stateSource: 'command',
    stateStatus: 'loaded',
    completedActionCount: 1,
    completedActionIds: ['workflow_action_example_001']
  });

  assert.equal(ready.status, 'ready');
  assert.equal(ready.detailReady, true);
  assert.equal(ready.scenario, 'ready');
  assert.equal(ready.selectedTask, 'Use Context Pack');
  assert.equal(ready.selectedWorkflow, 'Use Context Pack');
  assert.equal(ready.activeStep, 'Prepare operator handoff readiness');
  assert.equal(ready.stepCommand, 'Prepare handoff readiness evidence');
  assert.equal(ready.stepOutcome, 'Operator step can move toward handoff readiness.');
  assert.equal(ready.stepCount, 3);
  assert.equal(ready.readyStepCount, 3);
  assert.equal(ready.blockedStepCount, 0);
  assert.equal(ready.detailDecision, 'Inspect ready operator task step');
  assert.equal(ready.detailSummary, 'Operator Step Detail can inspect the ready task and prepare handoff readiness.');
  assert.deepEqual(ready.stepDetails.map((step) => step.status), ['complete', 'complete', 'active']);
  assert.deepEqual(ready.blockers, []);
  assert.equal(ready.nextWorkflow, 'Operator Handoff Readiness');
});

test('Operator Handoff Readiness exposes blocked and ready transfer checks', () => {
  const store = createExampleStore();
  const blocked = createOperatorHandoffReadiness(store, 'operator_run_example_001');

  assert.equal(blocked.title, 'Operator Handoff Readiness');
  assert.equal(blocked.status, 'blocked');
  assert.equal(blocked.handoffReady, false);
  assert.equal(blocked.scenario, 'blocked');
  assert.equal(blocked.selectedTask, 'Resolve workflow blockers');
  assert.equal(blocked.selectedWorkflow, 'Review Resolution Workflow');
  assert.equal(blocked.activeStep, 'Inspect blocker detail');
  assert.equal(blocked.handoffTarget, 'Operator');
  assert.equal(blocked.handoffMode, 'operator-resolution');
  assert.equal(blocked.handoffCommand, 'Resolve blockers before handoff');
  assert.equal(blocked.handoffOutcome, 'Operator handoff readiness waits for blocker resolution.');
  assert.equal(blocked.checkCount, 4);
  assert.equal(blocked.passedCheckCount, 1);
  assert.equal(blocked.blockedCheckCount, 3);
  assert.equal(blocked.handoffDecision, 'Keep handoff readiness blocked');
  assert.equal(blocked.handoffSummary, 'Operator Handoff Readiness keeps local work with the operator until blockers clear.');
  assert.deepEqual(blocked.handoffChecks.map((check) => check.status), ['pass', 'blocked', 'blocked', 'blocked']);
  assert.equal(blocked.nextWorkflow, 'Review Resolution Workflow');

  completeWorkflowAction(store, 'workflow_action_example_001', '2026-07-20');
  const ready = createOperatorHandoffReadiness(store, 'operator_run_example_001', {
    stateSource: 'command',
    stateStatus: 'loaded',
    completedActionCount: 1,
    completedActionIds: ['workflow_action_example_001']
  });

  assert.equal(ready.status, 'ready');
  assert.equal(ready.handoffReady, true);
  assert.equal(ready.scenario, 'ready');
  assert.equal(ready.selectedTask, 'Use Context Pack');
  assert.equal(ready.selectedWorkflow, 'Use Context Pack');
  assert.equal(ready.handoffTarget, 'AI writing agent');
  assert.equal(ready.handoffMode, 'agent-ready');
  assert.equal(ready.handoffCommand, 'Prepare operator handoff package');
  assert.equal(ready.handoffOutcome, 'Operator handoff readiness is ready for transfer.');
  assert.equal(ready.checkCount, 4);
  assert.equal(ready.passedCheckCount, 4);
  assert.equal(ready.blockedCheckCount, 0);
  assert.equal(ready.handoffDecision, 'Prepare handoff readiness package');
  assert.equal(ready.handoffSummary, 'Operator Handoff Readiness can transfer the selected ready task with evidence.');
  assert.deepEqual(ready.handoffChecks.map((check) => check.status), ['pass', 'pass', 'pass', 'pass']);
  assert.deepEqual(ready.blockers, []);
  assert.equal(ready.nextWorkflow, 'Operator Workflow Design Aggregate Summary');
});

test('Operator Workflow Design Aggregate Summary rolls workflow design packages into readiness evidence', () => {
  const store = createExampleStore();
  const blocked = createOperatorWorkflowDesignAggregateSummary(store, 'operator_run_example_001');

  assert.equal(blocked.title, 'Operator Workflow Design Aggregate Summary');
  assert.equal(blocked.status, 'blocked');
  assert.equal(blocked.aggregateReady, false);
  assert.equal(blocked.scenario, 'blocked');
  assert.equal(blocked.selectedTask, 'Resolve workflow blockers');
  assert.equal(blocked.selectedWorkflow, 'Review Resolution Workflow');
  assert.equal(blocked.handoffTarget, 'Operator');
  assert.equal(blocked.workflowCount, 4);
  assert.equal(blocked.readyWorkflowCount, 0);
  assert.equal(blocked.blockedWorkflowCount, 4);
  assert.equal(blocked.aggregateDecision, 'Keep operator workflow design aggregate blocked');
  assert.equal(blocked.aggregateSummary, 'Operator Workflow Design v1.5 aggregate waits for operator workflow readiness.');
  assert.deepEqual(blocked.workflowItems.map((item) => item.status), ['blocked', 'blocked', 'blocked', 'blocked']);
  assert.equal(blocked.nextWorkflow, 'Review Resolution Workflow');

  completeWorkflowAction(store, 'workflow_action_example_001', '2026-07-20');
  const ready = createOperatorWorkflowDesignAggregateSummary(store, 'operator_run_example_001', {
    stateSource: 'command',
    stateStatus: 'loaded',
    completedActionCount: 1,
    completedActionIds: ['workflow_action_example_001']
  });

  assert.equal(ready.status, 'ready');
  assert.equal(ready.aggregateReady, true);
  assert.equal(ready.scenario, 'ready');
  assert.equal(ready.selectedTask, 'Use Context Pack');
  assert.equal(ready.selectedWorkflow, 'Use Context Pack');
  assert.equal(ready.handoffTarget, 'AI writing agent');
  assert.equal(ready.workflowCount, 4);
  assert.equal(ready.readyWorkflowCount, 4);
  assert.equal(ready.blockedWorkflowCount, 0);
  assert.equal(ready.aggregateDecision, 'Aggregate operator workflow design evidence');
  assert.equal(ready.aggregateSummary, 'Operator Workflow Design v1.5 has ready workflow map, task selection, step detail, and handoff readiness evidence.');
  assert.deepEqual(ready.workflowItems.map((item) => item.status), ['ready', 'ready', 'ready', 'ready']);
  assert.ok(ready.requiredEvidence.includes('Handoff checks passed: 4/4'));
  assert.deepEqual(ready.blockers, []);
  assert.equal(ready.nextWorkflow, 'Operator Workflow Design Final Closure');
});

test('Operator Workflow Design Final Closure closes only ready aggregate summaries', () => {
  const store = createExampleStore();
  const blocked = createOperatorWorkflowDesignFinalClosure(store, 'operator_run_example_001');

  assert.equal(blocked.title, 'Operator Workflow Design Final Closure');
  assert.equal(blocked.status, 'blocked');
  assert.equal(blocked.closed, false);
  assert.equal(blocked.scenario, 'blocked');
  assert.equal(blocked.selectedTask, 'Resolve workflow blockers');
  assert.equal(blocked.selectedWorkflow, 'Review Resolution Workflow');
  assert.equal(blocked.handoffTarget, 'Operator');
  assert.equal(blocked.closureDecision, 'Keep Operator Workflow Design v1.5 open');
  assert.equal(blocked.closureSummary, 'Operator Workflow Design v1.5 final closure waits for aggregate readiness.');
  assert.deepEqual(blocked.releaseArtifacts, []);
  assert.deepEqual(blocked.closureChecks.map((check) => check.status), ['blocked', 'pass', 'blocked']);
  assert.equal(blocked.nextWorkflow, 'Review Resolution Workflow');

  completeWorkflowAction(store, 'workflow_action_example_001', '2026-07-20');
  const closed = createOperatorWorkflowDesignFinalClosure(store, 'operator_run_example_001', {
    stateSource: 'command',
    stateStatus: 'loaded',
    completedActionCount: 1,
    completedActionIds: ['workflow_action_example_001']
  });

  assert.equal(closed.status, 'closed');
  assert.equal(closed.closed, true);
  assert.equal(closed.scenario, 'ready');
  assert.equal(closed.selectedTask, 'Use Context Pack');
  assert.equal(closed.selectedWorkflow, 'Use Context Pack');
  assert.equal(closed.handoffTarget, 'AI writing agent');
  assert.equal(closed.closureDecision, 'Close Operator Workflow Design v1.5');
  assert.equal(closed.closureSummary, 'Operator Workflow Design v1.5 is closed with aggregate workflow evidence and is ready for archive.');
  assert.deepEqual(closed.releaseArtifacts, [
    'Operator Workflow Map',
    'Operator Task Selection',
    'Operator Step Detail',
    'Operator Handoff Readiness',
    'Operator Workflow Design Aggregate Summary'
  ]);
  assert.ok(closed.closureEvidence.includes('Aggregate workflows ready: 4/4'));
  assert.deepEqual(closed.closureChecks.map((check) => check.status), ['pass', 'pass', 'pass']);
  assert.deepEqual(closed.blockers, []);
  assert.equal(closed.nextWorkflow, 'Operator Workflow Design v1.5 Closed');
});

test('Repository Branch Status maps workflow closure into branch collaboration readiness', () => {
  const store = createExampleStore();
  const blocked = createRepositoryBranchStatus(store, 'operator_run_example_001');

  assert.equal(blocked.title, 'Repository Branch Status');
  assert.equal(blocked.status, 'blocked');
  assert.equal(blocked.branchReady, false);
  assert.equal(blocked.scenario, 'blocked');
  assert.equal(blocked.localBranch, 'codex/development-ready-v1.0');
  assert.equal(blocked.remoteBranch, 'origin/codex/development-ready-v1.0');
  assert.equal(blocked.mainBranch, 'main');
  assert.equal(blocked.syncStatus, 'waiting-for-cycle-closure');
  assert.equal(blocked.workingTreeStatus, 'blocked-preview');
  assert.equal(blocked.branchCount, 4);
  assert.equal(blocked.readyBranchCount, 1);
  assert.equal(blocked.blockedBranchCount, 3);
  assert.equal(blocked.branchDecision, 'Keep repository branch status blocked');
  assert.equal(blocked.branchSummary, 'Repository Branch Status waits for Operator Workflow Design v1.5 closure before collaboration.');
  assert.deepEqual(blocked.branchItems.map((item) => item.status), ['blocked', 'blocked', 'protected', 'blocked-preview']);
  assert.equal(blocked.nextWorkflow, 'Review Resolution Workflow');

  completeWorkflowAction(store, 'workflow_action_example_001', '2026-07-20');
  const ready = createRepositoryBranchStatus(store, 'operator_run_example_001', {
    stateSource: 'command',
    stateStatus: 'loaded',
    completedActionCount: 1,
    completedActionIds: ['workflow_action_example_001']
  });

  assert.equal(ready.status, 'ready');
  assert.equal(ready.branchReady, true);
  assert.equal(ready.scenario, 'ready');
  assert.equal(ready.syncStatus, 'synced');
  assert.equal(ready.workingTreeStatus, 'clean');
  assert.equal(ready.readyBranchCount, 4);
  assert.equal(ready.blockedBranchCount, 0);
  assert.equal(ready.branchDecision, 'Use repository collaboration branch');
  assert.equal(ready.branchSummary, 'Repository Branch Status can use the active collaboration branch with remote and main evidence.');
  assert.deepEqual(ready.branchItems.map((item) => item.status), ['active', 'synced', 'protected', 'clean']);
  assert.ok(ready.requiredEvidence.includes('Final closure status: closed'));
  assert.deepEqual(ready.blockers, []);
  assert.equal(ready.nextWorkflow, 'Pull Request Readiness');
});
