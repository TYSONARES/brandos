import { existsSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const stateFile = join(mkdtempSync(join(tmpdir(), 'brandos-studio-action-check-')), 'workflow-state.json');

execFileSync(process.execPath, [
  'scripts/persist-studio-action.mjs',
  '--complete-workflow-action=workflow_action_example_001',
  '--completed-at=2026-07-18',
  `--state-file=${stateFile}`
]);

const persisted = JSON.parse(
  execFileSync(process.execPath, ['scripts/inspect-studio-action.mjs', `--state-file=${stateFile}`], {
    encoding: 'utf8'
  })
);

if (
  persisted.exists !== true ||
  persisted.completedWorkflowActionId !== 'workflow_action_example_001' ||
  persisted.completedAt !== '2026-07-18'
) {
  console.error('Studio Workflow Action inspect output did not report persisted state.');
  process.exit(1);
}

execFileSync(process.execPath, ['scripts/reset-studio-action.mjs', `--state-file=${stateFile}`]);

const reset = JSON.parse(
  execFileSync(process.execPath, ['scripts/inspect-studio-action.mjs', `--state-file=${stateFile}`], {
    encoding: 'utf8'
  })
);

if (reset.exists !== false || reset.completedWorkflowActionId !== null || reset.completedAt !== null || existsSync(stateFile)) {
  console.error('Studio Workflow Action reset output did not clear persisted state.');
  process.exit(1);
}

console.log('Studio Workflow Action state command requirements passed.');
