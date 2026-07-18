import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

export const STUDIO_STATE_VERSION = 1;
export const DEFAULT_STUDIO_STATE_PATH = '.tmp/studio-state.json';

export function createEmptyStudioState(options = {}) {
  return {
    version: STUDIO_STATE_VERSION,
    source: 'studio-local',
    updatedAt: options.updatedAt ?? '2026-07-18',
    workflows: {
      completedActionIds: [],
      completedActions: {}
    }
  };
}

export function createStudioState(options = {}) {
  const state = createEmptyStudioState({ updatedAt: options.completedAt });

  if (!options.completedWorkflowActionId) {
    return state;
  }

  return completeStudioWorkflowAction(state, {
    actionId: options.completedWorkflowActionId,
    completedAt: options.completedAt ?? state.updatedAt
  });
}

export function completeStudioWorkflowAction(state, options) {
  const actionId = options.actionId;
  const completedAt = options.completedAt ?? '2026-07-18';
  const completedActionIds = state.workflows.completedActionIds.includes(actionId)
    ? state.workflows.completedActionIds
    : [...state.workflows.completedActionIds, actionId];

  return {
    ...state,
    updatedAt: completedAt,
    workflows: {
      ...state.workflows,
      completedActionIds,
      completedActions: {
        ...state.workflows.completedActions,
        [actionId]: {
          completedAt
        }
      }
    }
  };
}

export function writeStudioState(filePath, state) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(state, null, 2)}\n`, 'utf8');

  return state;
}

export function readStudioState(filePath) {
  if (!existsSync(filePath)) {
    return null;
  }

  return normalizeStudioState(JSON.parse(readFileSync(filePath, 'utf8')));
}

export function describeStudioState(filePath) {
  const state = readStudioState(filePath);
  if (!state) {
    return {
      exists: false,
      filePath,
      version: null,
      completedWorkflowActionId: null,
      completedAt: null,
      completedWorkflowActionIds: []
    };
  }

  const completedWorkflowActionId = findLatestCompletedWorkflowActionId(state);

  return {
    exists: true,
    filePath,
    version: state.version,
    completedWorkflowActionId,
    completedAt: completedWorkflowActionId ? state.workflows.completedActions[completedWorkflowActionId]?.completedAt ?? null : null,
    completedWorkflowActionIds: state.workflows.completedActionIds
  };
}

export function resetStudioState(filePath) {
  if (!existsSync(filePath)) {
    return false;
  }

  unlinkSync(filePath);
  return true;
}

export function createStudioShellOptionsFromStudioState(filePath) {
  const state = readStudioState(filePath);
  if (!state) {
    return {};
  }

  const completedWorkflowActionId = findLatestCompletedWorkflowActionId(state);
  if (!completedWorkflowActionId) {
    return {};
  }

  return {
    completedWorkflowActionId,
    completedAt: state.workflows.completedActions[completedWorkflowActionId]?.completedAt
  };
}

function normalizeStudioState(state) {
  if (state?.workflows?.completedActionIds && state?.workflows?.completedActions) {
    return state;
  }

  if (state?.completedWorkflowActionId) {
    return createStudioState({
      completedWorkflowActionId: state.completedWorkflowActionId,
      completedAt: state.completedAt
    });
  }

  return createEmptyStudioState({ updatedAt: state?.updatedAt });
}

function findLatestCompletedWorkflowActionId(state) {
  return state.workflows.completedActionIds.at(-1) ?? null;
}
