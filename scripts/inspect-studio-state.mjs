import {
  DEFAULT_STUDIO_STATE_PATH,
  describeStudioState
} from '../apps/studio/src/studio-state-adapter.mjs';

const stateFile = readArgValue(process.argv.slice(2), '--state-file') ?? DEFAULT_STUDIO_STATE_PATH;
const state = describeStudioState(stateFile);

console.log(JSON.stringify({
  ...state,
  summary: state.exists
    ? `Studio state v${state.version}: ${state.completedWorkflowActionIds.length} completed workflow actions.`
    : 'No Studio state found.'
}, null, 2));

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
