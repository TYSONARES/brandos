import { createBrandOSStudioShell } from '../apps/studio/src/app.mjs';
import { renderStudioHtml } from '../apps/studio/src/render-html.mjs';

const blockedHtml = renderStudioHtml(createBrandOSStudioShell());
const readyHtml = renderStudioHtml(createBrandOSStudioShell({ completedWorkflowActionId: 'workflow_action_example_001' }), {
  activeScenario: 'ready'
});
const requiredSnippets = [
  '<main>',
  'aria-label="Workflow scenarios"',
  'href="ready.html"',
  'Blocked',
  'aria-label="Studio metrics"',
  'aria-label="Brand overview"',
  'aria-label="Context Pack workflow"',
  'aria-label="Studio diagnostics"',
  'aria-label="Operator guidance"',
  'aria-label="Studio state inspection"',
  'class="workflow-action-row"',
  'class="action-status-badge action-status-pending"',
  'Owner: operator@example.local - Target: review_example_001',
  'Saved action: <span data-local-completed-action>none</span>',
  'aria-label="State sources"',
  'class="state-source-row"',
  'class="state-source-badge state-source-example"',
  'Workflow state source: <span class="state-source-badge state-source-example">example</span>',
  'Browser state key: brandos.workflow.completedActionId',
  'Repository state file: .tmp/studio-state.json',
  'Repository state status: not-loaded',
  'Repository state version: none',
  'Completed action history: 0',
  'State source: example',
  'State status: not-loaded',
  'State file: .tmp/studio-state.json',
  'State version: none',
  'Latest completed action: none',
  'Latest completed at: none',
  'Completed action count: 0',
  'Completed action ids: none',
  'data-clear-workflow-state',
  'brandos.workflow.completedActionId',
  'window.localStorage.setItem',
  'action="ready.html"',
  'name="actionId" value="workflow_action_example_001"',
  'Complete action',
  'Action status: pending',
  'Product Core objects',
  'Review is blocking release: review_example_001',
  'Package count: 3',
  'Product object count: 7',
  'Readiness blockers: 1',
  'Diagnostic state source: example',
  'Diagnostic state status: not-loaded',
  'Diagnostic result: attention',
  'Diagnostic check Packages loaded: pass - 3 packages available',
  'Diagnostic check Product objects loaded: pass - 7 objects available',
  'Diagnostic check Context readiness: attention - 1 blockers',
  'Diagnostic check State source available: pass - example',
  'Diagnostic check State status available: pass - not-loaded',
  'Guidance status: attention',
  'Recommended action: Resolve readiness blocker',
  'Guidance reason: Review is blocking release: review_example_001',
  'Guidance command: Complete pending Workflow Action'
];
const requiredReadySnippets = [
  'aria-current="page" href="ready.html"',
  'href="index.html"',
  'Current step: ready-for-use',
  'Action status: ready',
  'Completed action: workflow_action_example_001',
  'Workflow state source: <span class="state-source-badge state-source-command">command</span>',
  'Saved action: <span data-local-completed-action>workflow_action_example_001</span>',
  'State source: command',
  'Latest completed action: workflow_action_example_001',
  'Latest completed at: 2026-07-18',
  'Completed action count: 1',
  'Completed action ids: workflow_action_example_001',
  'class="action-status-badge action-status-ready"',
  'Owner: operator@example.local - Target: context_pack_example_001',
  'Use context pack',
  'Use context pack context_pack_example_001',
  'Readiness blockers: 0',
  'Diagnostic state source: command',
  'Diagnostic result: ready',
  'Diagnostic check Context readiness: pass - 0 blockers',
  'Diagnostic check State source available: pass - command',
  'Guidance status: ready',
  'Recommended action: Use Context Pack',
  'Guidance reason: Context Pack has no readiness blockers.',
  'Guidance command: Open ready scenario'
];

const missing = [
  ...requiredSnippets.filter((snippet) => !blockedHtml.includes(snippet)),
  ...requiredReadySnippets.filter((snippet) => !readyHtml.includes(snippet))
];

if (missing.length) {
  console.error(`Studio render output is missing required content: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('Studio render requirements passed.');
