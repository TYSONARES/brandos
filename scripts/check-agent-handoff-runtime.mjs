import { existsSync } from 'node:fs';
import {
  completeWorkflowAction,
  createAgentDraftExecution,
  createAgentHandoffContext,
  createAgentPromptPlan,
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
  'docs/decisions/0024-agent-handoff-runtime-start.md',
  'fixtures/components/agent-handoff-context-panel.json',
  'fixtures/components/agent-prompt-plan-panel.json',
  'fixtures/components/agent-draft-execution-panel.json',
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

console.log('Agent Handoff Runtime requirements passed.');
