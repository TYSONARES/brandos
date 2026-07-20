import { existsSync } from 'node:fs';
import {
  completeWorkflowAction,
  createAgentDraftExecution,
  createAgentHandoffClosure,
  createAgentHandoffContext,
  createAgentHandoffRuntimeAggregateSummary,
  createAgentHandoffRuntimeFinalClosure,
  createAgentHandoffRuntimeSummary,
  createAgentPromptPlan,
  createDraftReview,
  createExampleProductCoreState,
  createInMemoryProductCoreStore
} from '../packages/domain/src/index.mjs';

const required = [
  'docs/development/v1.2-scope.md',
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
  'docs/decisions/0024-agent-handoff-runtime-start.md',
  'fixtures/components/agent-handoff-context-panel.json',
  'fixtures/components/agent-prompt-plan-panel.json',
  'fixtures/components/agent-draft-execution-panel.json',
  'fixtures/components/draft-review-panel.json',
  'fixtures/components/agent-handoff-closure-panel.json',
  'fixtures/components/agent-handoff-runtime-summary-panel.json',
  'fixtures/components/agent-handoff-runtime-aggregate-summary-panel.json',
  'fixtures/components/agent-handoff-runtime-final-closure-panel.json',
  'apps/studio/src/app.mjs',
  'apps/studio/src/render-html.mjs',
  'packages/domain/src/use-cases.mjs',
  'tests/domain/product-core-use-cases.test.mjs',
  'tests/studio/render-html.test.mjs'
];

const missing = required.filter((file) => !existsSync(file));

if (missing.length) {
  console.error(`Missing Agent Handoff Runtime requirements: ${missing.join(', ')}`);
  process.exit(1);
}

const store = createInMemoryProductCoreStore(createExampleProductCoreState());
const blockedContext = createAgentHandoffContext(store, 'operator_run_example_001');

if (blockedContext.status !== 'blocked' || blockedContext.readyForAgent !== false) {
  console.error('Agent Handoff Context did not expose the expected blocked state.');
  process.exit(1);
}
if (blockedContext.nextWorkflow !== 'Operator Runbook Execution' || blockedContext.nextAgent !== 'Operator') {
  console.error('Blocked Agent Handoff Context did not route work back to the operator.');
  process.exit(1);
}
if (!blockedContext.agentInstructions.includes('Wait for accepted handoff before agent work.')) {
  console.error('Blocked Agent Handoff Context did not expose the expected wait instruction.');
  process.exit(1);
}

const blockedPromptPlan = createAgentPromptPlan(store, 'operator_run_example_001');
if (blockedPromptPlan.status !== 'blocked' || blockedPromptPlan.promptAllowed !== false) {
  console.error('Agent Prompt Plan did not expose the expected blocked state.');
  process.exit(1);
}
if (blockedPromptPlan.nextWorkflow !== 'Operator Runbook Execution') {
  console.error('Blocked Agent Prompt Plan did not route work back to Operator Runbook Execution.');
  process.exit(1);
}

const blockedDraftExecution = createAgentDraftExecution(store, 'operator_run_example_001');
if (blockedDraftExecution.status !== 'blocked' || blockedDraftExecution.draftAllowed !== false) {
  console.error('Agent Draft Execution did not expose the expected blocked state.');
  process.exit(1);
}
if (blockedDraftExecution.draftBody !== '' || blockedDraftExecution.nextWorkflow !== 'Operator Runbook Execution') {
  console.error('Blocked Agent Draft Execution did not stop drafting and route back to Operator Runbook Execution.');
  process.exit(1);
}

const blockedDraftReview = createDraftReview(store, 'operator_run_example_001');
if (blockedDraftReview.status !== 'blocked' || blockedDraftReview.approved !== false) {
  console.error('Draft Review did not expose the expected blocked state.');
  process.exit(1);
}

const blockedClosure = createAgentHandoffClosure(store, 'operator_run_example_001');
if (blockedClosure.status !== 'blocked' || blockedClosure.closed !== false) {
  console.error('Agent Handoff Closure did not expose the expected blocked state.');
  process.exit(1);
}

const blockedSummary = createAgentHandoffRuntimeSummary(store, 'operator_run_example_001');
if (blockedSummary.status !== 'blocked' || blockedSummary.complete !== false || blockedSummary.blockedStageCount !== 5) {
  console.error('Agent Handoff Runtime Summary did not expose the expected blocked state.');
  process.exit(1);
}

const blockedAggregate = createAgentHandoffRuntimeAggregateSummary(store, 'operator_run_example_001');
if (blockedAggregate.status !== 'blocked' || blockedAggregate.complete !== false || blockedAggregate.blockedRuntimeCount !== 1) {
  console.error('Agent Handoff Runtime Aggregate Summary did not expose the expected blocked state.');
  process.exit(1);
}
if (blockedAggregate.nextWorkflow !== 'Operator Runbook Execution') {
  console.error('Blocked Agent Handoff Runtime Aggregate Summary did not route work back to Operator Runbook Execution.');
  process.exit(1);
}

const blockedFinalClosure = createAgentHandoffRuntimeFinalClosure(store, 'operator_run_example_001');
if (blockedFinalClosure.status !== 'blocked' || blockedFinalClosure.closed !== false) {
  console.error('Agent Handoff Runtime Final Closure did not expose the expected blocked state.');
  process.exit(1);
}
if (blockedFinalClosure.nextWorkflow !== 'Operator Runbook Execution') {
  console.error('Blocked Agent Handoff Runtime Final Closure did not route work back to Operator Runbook Execution.');
  process.exit(1);
}

completeWorkflowAction(store, 'workflow_action_example_001', '2026-07-20');
const readyContext = createAgentHandoffContext(store, 'operator_run_example_001');

if (readyContext.status !== 'ready' || readyContext.readyForAgent !== true) {
  console.error('Agent Handoff Context did not expose the expected ready state.');
  process.exit(1);
}
if (readyContext.nextWorkflow !== 'Use Context Pack' || readyContext.nextAgent !== 'AI writing agent') {
  console.error('Ready Agent Handoff Context did not route work to the AI writing agent.');
  process.exit(1);
}
if (!readyContext.agentInstructions.includes('Use accepted handoff context only.')) {
  console.error('Ready Agent Handoff Context did not expose the expected source-of-truth instruction.');
  process.exit(1);
}

const readyPromptPlan = createAgentPromptPlan(store, 'operator_run_example_001');
if (readyPromptPlan.status !== 'ready' || readyPromptPlan.promptAllowed !== true) {
  console.error('Agent Prompt Plan did not expose the expected ready state.');
  process.exit(1);
}
if (readyPromptPlan.nextWorkflow !== 'Agent Draft Execution') {
  console.error('Ready Agent Prompt Plan did not route work to Agent Draft Execution.');
  process.exit(1);
}

const readyDraftExecution = createAgentDraftExecution(store, 'operator_run_example_001');
if (readyDraftExecution.status !== 'ready' || readyDraftExecution.draftAllowed !== true) {
  console.error('Agent Draft Execution did not expose the expected ready state.');
  process.exit(1);
}
if (readyDraftExecution.nextWorkflow !== 'Draft Review' || readyDraftExecution.evidenceCitations.length !== 3) {
  console.error('Ready Agent Draft Execution did not expose expected review routing and citations.');
  process.exit(1);
}

const approvedDraftReview = createDraftReview(store, 'operator_run_example_001');
if (approvedDraftReview.status !== 'approved' || approvedDraftReview.approved !== true) {
  console.error('Draft Review did not expose the expected approved state.');
  process.exit(1);
}
if (approvedDraftReview.nextWorkflow !== 'Agent Handoff Closure') {
  console.error('Approved Draft Review did not route work to Agent Handoff Closure.');
  process.exit(1);
}

const closedHandoff = createAgentHandoffClosure(store, 'operator_run_example_001');
if (closedHandoff.status !== 'closed' || closedHandoff.closed !== true) {
  console.error('Agent Handoff Closure did not expose the expected closed state.');
  process.exit(1);
}
if (closedHandoff.nextWorkflow !== 'Agent Handoff Runtime Summary') {
  console.error('Closed Agent Handoff Closure did not route work to Agent Handoff Runtime Summary.');
  process.exit(1);
}

const completeSummary = createAgentHandoffRuntimeSummary(store, 'operator_run_example_001');
if (completeSummary.status !== 'complete' || completeSummary.complete !== true || completeSummary.completedStageCount !== 5) {
  console.error('Agent Handoff Runtime Summary did not expose the expected complete state.');
  process.exit(1);
}
if (completeSummary.nextWorkflow !== 'Agent Handoff Runtime Aggregate Summary') {
  console.error('Complete Agent Handoff Runtime Summary did not route work to aggregate summary.');
  process.exit(1);
}

const completeAggregate = createAgentHandoffRuntimeAggregateSummary(store, 'operator_run_example_001');
if (completeAggregate.status !== 'complete' || completeAggregate.complete !== true || completeAggregate.completeRuntimeCount !== 1) {
  console.error('Agent Handoff Runtime Aggregate Summary did not expose the expected complete state.');
  process.exit(1);
}
if (completeAggregate.nextWorkflow !== 'Agent Handoff Runtime Final Closure') {
  console.error('Complete Agent Handoff Runtime Aggregate Summary did not route work to final closure.');
  process.exit(1);
}

const finalClosure = createAgentHandoffRuntimeFinalClosure(store, 'operator_run_example_001');
if (finalClosure.status !== 'closed' || finalClosure.closed !== true) {
  console.error('Agent Handoff Runtime Final Closure did not expose the expected closed state.');
  process.exit(1);
}
if (finalClosure.nextWorkflow !== 'Agent Handoff Runtime v1.2 Closed') {
  console.error('Closed Agent Handoff Runtime Final Closure did not expose the expected closed routing.');
  process.exit(1);
}

console.log('Agent Handoff Runtime requirements passed.');
