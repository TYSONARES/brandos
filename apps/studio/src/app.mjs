import {
  createDomainSummary,
  createExampleProductCoreState,
  createInMemoryProductCoreStore,
  createBrandProfileOverview,
  completeWorkflowAction,
  evaluateContextPackReadiness,
  summarizeProductCoreState
} from '../../../packages/domain/src/index.mjs';
import { createContractSummary } from '../../../packages/contracts/src/index.mjs';
import { createDesignSystemSummary } from '../../../packages/design-system/src/index.mjs';
import {
  createStudioShellOptionsFromRepositoryState,
  DEFAULT_REPOSITORY_WORKFLOW_STATE_PATH
} from './repository-state-adapter.mjs';
import { renderStudioHtml } from './render-html.mjs';

export function createBrandOSStudioShell(options = {}) {
  const store = createInMemoryProductCoreStore(createExampleProductCoreState());
  const completedWorkflowActionId = options.completedWorkflowActionId || (options.completeWorkflowAction ? 'workflow_action_example_001' : null);
  const completedAt = options.completedAt || '2026-07-18';

  if (completedWorkflowActionId) {
    completeWorkflowAction(store, completedWorkflowActionId, completedAt);
  }
  const state = summarizeProductCoreState(store);
  const brandProfileOverview = createBrandProfileOverview(store, 'brand_profile_example_001');
  const contextPackReadiness = evaluateContextPackReadiness(store, 'context_pack_example_001');
  const contextPackWorkflow = {
    title: 'Context Pack workflow',
    currentStep: contextPackReadiness.ready ? 'ready-for-use' : 'resolve-review',
    actionStatus: contextPackReadiness.nextActions[0]?.status || 'ready',
    completedActionId: completedWorkflowActionId,
    owner: 'operator@example.local',
    nextActions: contextPackReadiness.nextActions
  };
  return {
    app: 'BrandOS Studio',
    release: 'v1.0 Development Ready',
    status: 'implementation scaffold',
    state,
    brandProfileOverview,
    contextPackReadiness,
    contextPackWorkflow,
    packages: [
      createDomainSummary(),
      createContractSummary(),
      createDesignSystemSummary()
    ]
  };
}

export function createStudioShellOptionsFromArgs(args) {
  const completedWorkflowActionId = readArgValue(args, '--complete-workflow-action');
  const completedAt = readArgValue(args, '--completed-at');
  const stateFile = readArgValue(args, '--state-file') ?? DEFAULT_REPOSITORY_WORKFLOW_STATE_PATH;
  const repositoryOptions = args.includes('--ignore-repository-state')
    ? {}
    : createStudioShellOptionsFromRepositoryState(stateFile);

  return {
    ...repositoryOptions,
    ...(completedWorkflowActionId ? { completedWorkflowActionId } : {}),
    ...(completedAt ? { completedAt } : {})
  };
}

export function renderSmokeSummary(shell = createBrandOSStudioShell()) {
  const packageNames = shell.packages.map((pkg) => pkg.name).join(', ');
  const domain = shell.packages.find((pkg) => pkg.name === 'domain');
  return `${shell.app} ${shell.release}: ${shell.status}. Packages: ${packageNames}. Domain models: ${domain.modelCount}. Objects: ${shell.state.objectCount}. Context ready: ${shell.contextPackReadiness.ready}.`;
}

if (process.argv.includes('--smoke')) {
  console.log(renderSmokeSummary());
}

if (process.argv.includes('--html')) {
  const options = createStudioShellOptionsFromArgs(process.argv.slice(2));
  const activeScenario = options.completedWorkflowActionId ? 'ready' : 'blocked';

  console.log(renderStudioHtml(createBrandOSStudioShell(options), { activeScenario }));
}

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
