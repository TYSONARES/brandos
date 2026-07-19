import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  completeStudioWorkflowAction,
  createStudioShellOptionsFromStudioState,
  createStudioState,
  DEFAULT_STUDIO_STATE_PATH,
  describeStudioState,
  STUDIO_STATE_VERSION,
  writeStudioState
} from '../apps/studio/src/studio-state-adapter.mjs';

const stateFile = join(mkdtempSync(join(tmpdir(), 'brandos-studio-state-check-')), 'studio-state.json');
const state = completeStudioWorkflowAction(createStudioState({
  completedWorkflowActionId: 'workflow_action_example_001',
  completedAt: '2026-07-18'
}), {
  actionId: 'workflow_action_example_002',
  completedAt: '2026-07-19'
});

writeStudioState(stateFile, state);

const description = describeStudioState(stateFile);
if (
  description.exists !== true ||
  description.version !== STUDIO_STATE_VERSION ||
  description.completedWorkflowActionId !== 'workflow_action_example_002' ||
  description.completedAt !== '2026-07-19' ||
  description.completedWorkflowActionIds.length !== 2
) {
  console.error('Durable Studio state did not describe completed Workflow Action history.');
  process.exit(1);
}

const shellOptions = createStudioShellOptionsFromStudioState(stateFile);
if (
  shellOptions.completedWorkflowActionId !== 'workflow_action_example_002' ||
  shellOptions.completedAt !== '2026-07-19'
) {
  console.error('Durable Studio state did not produce expected Studio shell options.');
  process.exit(1);
}

if (
  description.completedWorkflowActionIds[0] !== 'workflow_action_example_001' ||
  description.completedWorkflowActionIds[1] !== 'workflow_action_example_002'
) {
  console.error('Durable Studio state did not preserve completed Workflow Action order.');
  process.exit(1);
}

if (DEFAULT_STUDIO_STATE_PATH !== '.tmp/studio-state.json') {
  console.error('Durable Studio state default path changed unexpectedly.');
  process.exit(1);
}

console.log('Durable Studio state requirements passed.');
