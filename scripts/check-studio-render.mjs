import { createBrandOSStudioShell } from '../apps/studio/src/app.mjs';
import { renderStudioHtml } from '../apps/studio/src/render-html.mjs';

const html = renderStudioHtml(createBrandOSStudioShell());
const requiredSnippets = [
  '<main>',
  'aria-label="Studio metrics"',
  'aria-label="Brand overview"',
  'aria-label="Context Pack workflow"',
  'class="workflow-action-row"',
  'class="action-status-badge action-status-pending"',
  'Action status: pending',
  'Product Core objects',
  'Review is blocking release: review_example_001'
];

const missing = requiredSnippets.filter((snippet) => !html.includes(snippet));

if (missing.length) {
  console.error(`Studio render output is missing required content: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('Studio render requirements passed.');
