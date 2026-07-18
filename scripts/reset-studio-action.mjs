import {
  DEFAULT_REPOSITORY_WORKFLOW_STATE_PATH,
  resetWorkflowActionState
} from '../apps/studio/src/repository-state-adapter.mjs';

const stateFile = readArgValue(process.argv.slice(2), '--state-file') ?? DEFAULT_REPOSITORY_WORKFLOW_STATE_PATH;
const removed = resetWorkflowActionState(stateFile);

console.log(removed ? `Reset Studio Workflow Action state at ${stateFile}` : `No Studio Workflow Action state found at ${stateFile}`);

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
