import assert from 'node:assert/strict';
import test from 'node:test';

import { createBrandOSStudioShell } from '../../apps/studio/src/app.mjs';
import { renderStudioHtml } from '../../apps/studio/src/render-html.mjs';

test('Studio HTML render includes shell identity and Product Core summary', () => {
  const html = renderStudioHtml(createBrandOSStudioShell());

  assert.match(html, /<!doctype html>/);
  assert.match(html, /BrandOS Studio/);
  assert.match(html, /Brand overview/);
  assert.match(html, /Product Core objects/);
  assert.match(html, /Readiness blockers/);
});

test('Studio HTML render includes blocking Context Pack readiness reason', () => {
  const html = renderStudioHtml(createBrandOSStudioShell());

  assert.match(html, /Context readiness/);
  assert.match(html, /Context Pack workflow/);
  assert.match(html, /Current step: resolve-review/);
  assert.match(html, /Action status: pending/);
  assert.match(html, /action-status-badge action-status-pending/);
  assert.match(html, /workflow-action-row/);
  assert.match(html, /blocked/);
  assert.match(html, /Review is blocking release: review_example_001/);
  assert.match(html, /Resolve review feedback for context_pack_example_001/);
});
