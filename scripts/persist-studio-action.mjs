import {
  createWorkflowActionState,
  DEFAULT_REPOSITORY_WORKFLOW_STATE_PATH,
  writeWorkflowActionState
} from '../apps/studio/src/repository-state-adapter.mjs';

const completedWorkflowActionId = readArgValue(process.argv.slice(2), '--complete-workflow-action');
const completedAt = readArgValue(process.argv.slice(2), '--completed-at') ?? '2026-07-18';
const stateFile = readArgValue(process.argv.slice(2), '--state-file') ?? DEFAULT_REPOSITORY_WORKFLOW_STATE_PATH;

if (!completedWorkflowActionId) {
  console.error('Missing required --complete-workflow-action value.');
  process.exit(1);
}

writeWorkflowActionState(
  stateFile,
  createWorkflowActionState({
    completedWorkflowActionId,
    completedAt
  })
);

console.log(`Persisted Studio Workflow Action state to ${stateFile}`);

function readArgValue(args, name) {
  const inline = args.find((arg) => arg.startsWith(`${name}=`));
  if (inline) {
    return inline.slice(name.length + 1);
  }

  const index = args.indexOf(name);
  if (index >= 0) {
    return args[index + 1];
  }

  return null;
}
