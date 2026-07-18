import {
  createStudioShellOptionsFromStudioState,
  createStudioState,
  DEFAULT_STUDIO_STATE_PATH,
  describeStudioState,
  readStudioState,
  resetStudioState,
  writeStudioState
} from './studio-state-adapter.mjs';

export const DEFAULT_REPOSITORY_WORKFLOW_STATE_PATH = DEFAULT_STUDIO_STATE_PATH;

export function createWorkflowActionState(options) {
  return createStudioState(options);
}

export function writeWorkflowActionState(filePath, state) {
  return writeStudioState(filePath, state);
}

export function readWorkflowActionState(filePath) {
  return readStudioState(filePath);
}

export function describeWorkflowActionState(filePath) {
  return describeStudioState(filePath);
}

export function resetWorkflowActionState(filePath) {
  return resetStudioState(filePath);
}

export function createStudioShellOptionsFromRepositoryState(filePath) {
  return createStudioShellOptionsFromStudioState(filePath);
}
