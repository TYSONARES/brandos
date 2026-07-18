import { createBrandOSStudioShell } from '../apps/studio/src/app.mjs';
import { renderStudioHtml } from '../apps/studio/src/render-html.mjs';

const blockedHtml = renderStudioHtml(createBrandOSStudioShell());
const readyHtml = renderStudioHtml(createBrandOSStudioShell({ completeWorkflowAction: true }), {
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
  'class="workflow-action-row"',
  'class="action-status-badge action-status-pending"',
  'Action status: pending',
  'Product Core objects',
  'Review is blocking release: review_example_001'
];
const requiredReadySnippets = [
  'aria-current="page" href="ready.html"',
  'href="index.html"',
  'Current step: ready-for-use',
  'Action status: ready',
  'class="action-status-badge action-status-ready"',
  'Use context pack context_pack_example_001'
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
