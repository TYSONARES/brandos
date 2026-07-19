import {
  DEFAULT_STUDIO_STATE_PATH,
  resetStudioState
} from '../apps/studio/src/studio-state-adapter.mjs';

const stateFile = readArgValue(process.argv.slice(2), '--state-file') ?? DEFAULT_STUDIO_STATE_PATH;
const removed = resetStudioState(stateFile);

console.log(removed ? `Reset durable Studio state at ${stateFile}` : `No durable Studio state found at ${stateFile}`);

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
