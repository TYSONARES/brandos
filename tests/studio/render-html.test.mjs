import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { createBrandOSStudioShell, createStudioShellOptionsFromArgs } from '../../apps/studio/src/app.mjs';
import {
  createBrowserWorkflowStateAdapterScript,
  DEFAULT_WORKFLOW_ACTION_STATE_KEY
} from '../../apps/studio/src/browser-state-adapter.mjs';
import {
  createStudioShellOptionsFromRepositoryState,
  createWorkflowActionState,
  readWorkflowActionState,
  writeWorkflowActionState
} from '../../apps/studio/src/repository-state-adapter.mjs';
import { renderStudioHtml } from '../../apps/studio/src/render-html.mjs';

test('Studio HTML render includes shell identity and Product Core summary', () => {
  const html = renderStudioHtml(createBrandOSStudioShell());

  assert.match(html, /<!doctype html>/);
  assert.match(html, /BrandOS Studio/);
  assert.match(html, /Workflow scenarios/);
  assert.match(html, /aria-current="page" href="index.html"/);
  assert.match(html, /href="ready.html"/);
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
  assert.match(html, /Owner: operator@example.local - Target: review_example_001/);
  assert.match(html, /Saved action: <span data-local-completed-action>none<\/span>/);
  assert.match(html, /data-clear-workflow-state/);
  assert.match(html, /brandos.workflow.completedActionId/);
  assert.match(html, /action="ready.html"/);
  assert.match(html, /name="actionId" value="workflow_action_example_001"/);
  assert.match(html, /Complete action/);
  assert.match(html, /blocked/);
  assert.match(html, /Review is blocking release: review_example_001/);
  assert.match(html, /Resolve review feedback for context_pack_example_001/);
});

test('Studio HTML render includes ready Context Pack workflow state', () => {
  const html = renderStudioHtml(createBrandOSStudioShell({ completedWorkflowActionId: 'workflow_action_example_001' }), {
    activeScenario: 'ready'
  });

  assert.match(html, /Context readiness/);
  assert.match(html, /aria-current="page" href="ready.html"/);
  assert.match(html, /href="index.html"/);
  assert.match(html, /ready/);
  assert.match(html, /Current step: ready-for-use/);
  assert.match(html, /Action status: ready/);
  assert.match(html, /Completed action: workflow_action_example_001/);
  assert.match(html, /Saved action: <span data-local-completed-action>workflow_action_example_001<\/span>/);
  assert.match(html, /action-status-badge action-status-ready/);
  assert.match(html, /Owner: operator@example.local - Target: context_pack_example_001/);
  assert.match(html, /Use context pack/);
  assert.match(html, /Use context pack context_pack_example_001/);
});

test('Studio shell options parse completed Workflow Action command args', () => {
  assert.deepEqual(
    createStudioShellOptionsFromArgs([
      '--html',
      '--complete-workflow-action=workflow_action_example_001',
      '--completed-at',
      '2026-07-19'
    ]),
    {
      completedWorkflowActionId: 'workflow_action_example_001',
      completedAt: '2026-07-19'
    }
  );
});

test('Browser Workflow Action state adapter script exposes storage contract', () => {
  const script = createBrowserWorkflowStateAdapterScript();

  assert.match(script, new RegExp(DEFAULT_WORKFLOW_ACTION_STATE_KEY));
  assert.match(script, /URLSearchParams/);
  assert.match(script, /params.get\('actionId'\)/);
  assert.match(script, /window.localStorage.setItem/);
  assert.match(script, /data-local-completed-action/);
  assert.match(script, /data-clear-workflow-state/);
});

test('Repository Workflow Action state adapter stores shell options', () => {
  const statePath = join(mkdtempSync(join(tmpdir(), 'brandos-studio-state-')), 'workflow-state.json');
  const state = createWorkflowActionState({
    completedWorkflowActionId: 'workflow_action_example_001',
    completedAt: '2026-07-19'
  });

  writeWorkflowActionState(statePath, state);

  assert.deepEqual(readWorkflowActionState(statePath), {
    version: 1,
    source: 'studio-local',
    completedWorkflowActionId: 'workflow_action_example_001',
    completedAt: '2026-07-19'
  });
  assert.deepEqual(createStudioShellOptionsFromRepositoryState(statePath), {
    completedWorkflowActionId: 'workflow_action_example_001',
    completedAt: '2026-07-19'
  });
});
