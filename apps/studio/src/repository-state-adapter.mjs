import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

export const DEFAULT_REPOSITORY_WORKFLOW_STATE_PATH = '.tmp/studio-workflow-state.json';

export function createWorkflowActionState(options) {
  return {
    version: 1,
    source: 'studio-local',
    completedWorkflowActionId: options.completedWorkflowActionId,
    completedAt: options.completedAt ?? '2026-07-18'
  };
}

export function writeWorkflowActionState(filePath, state) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(state, null, 2)}\n`, 'utf8');

  return state;
}

export function readWorkflowActionState(filePath) {
  if (!existsSync(filePath)) {
    return null;
  }

  return JSON.parse(readFileSync(filePath, 'utf8'));
}

export function createStudioShellOptionsFromRepositoryState(filePath) {
  const state = readWorkflowActionState(filePath);
  if (!state?.completedWorkflowActionId) {
    return {};
  }

  return {
    completedWorkflowActionId: state.completedWorkflowActionId,
    completedAt: state.completedAt
  };
}
