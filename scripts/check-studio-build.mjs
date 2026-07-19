import { existsSync, readFileSync } from 'node:fs';

const checks = [
  {
    path: 'dist/studio/index.html',
    snippets: [
      '<!doctype html>',
      'BrandOS Studio',
      'aria-label="Workflow scenarios"',
      'aria-current="page" href="index.html"',
      'href="ready.html"',
      'Product Core objects',
      'aria-label="Studio diagnostics"',
      'aria-label="Studio state inspection"',
      'Context readiness',
      'Action status: pending',
      'Saved action: <span data-local-completed-action>none</span>',
      'class="state-source-badge state-source-example"',
      'Workflow state source: <span class="state-source-badge state-source-example">example</span>',
      'Repository state file: .tmp/studio-state.json',
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
      'brandos.workflow.completedActionId',
      'window.localStorage.setItem',
      'name="actionId" value="workflow_action_example_001"',
      'Complete action',
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
      'Diagnostic check State status available: pass - not-loaded'
    ]
  },
  {
    path: 'dist/studio/ready.html',
    snippets: [
      '<!doctype html>',
      'BrandOS Studio',
      'aria-label="Workflow scenarios"',
      'href="index.html"',
      'aria-current="page" href="ready.html"',
      'Context readiness',
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
      'Owner: operator@example.local - Target: context_pack_example_001',
      'Use context pack',
      'Use context pack context_pack_example_001',
      'Readiness blockers: 0',
      'Diagnostic state source: command',
      'Diagnostic result: ready',
      'Diagnostic check Context readiness: pass - 0 blockers',
      'Diagnostic check State source available: pass - command'
    ]
  }
];

for (const check of checks) {
  if (!existsSync(check.path)) {
    console.error(`Missing Studio build output: ${check.path}`);
    process.exit(1);
  }

  const html = readFileSync(check.path, 'utf8');
  const missing = check.snippets.filter((snippet) => !html.includes(snippet));
  if (missing.length) {
    console.error(`${check.path} is missing required content: ${missing.join(', ')}`);
    process.exit(1);
  }
}

console.log('Studio build requirements passed.');
