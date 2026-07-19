import {
  createDomainSummary,
  createExampleProductCoreState,
  createInMemoryProductCoreStore,
  createBrandProfileOverview,
  createContextPackUsageFlow,
  completeWorkflowAction,
  evaluateContextPackReadiness,
  summarizeProductCoreState
} from '../../../packages/domain/src/index.mjs';
import { createContractSummary } from '../../../packages/contracts/src/index.mjs';
import { createDesignSystemSummary } from '../../../packages/design-system/src/index.mjs';
import {
  createStudioShellOptionsFromRepositoryState,
  describeWorkflowActionState,
  DEFAULT_REPOSITORY_WORKFLOW_STATE_PATH
} from './repository-state-adapter.mjs';
import { renderStudioHtml } from './render-html.mjs';

export function createBrandOSStudioShell(options = {}) {
  const store = createInMemoryProductCoreStore(createExampleProductCoreState());
  const completedWorkflowActionId = options.completedWorkflowActionId || (options.completeWorkflowAction ? 'workflow_action_example_001' : null);
  const completedAt = options.completedAt || '2026-07-18';
  const workflowStateSource = options.workflowStateSource || (completedWorkflowActionId ? 'command' : 'example');

  if (completedWorkflowActionId) {
    completeWorkflowAction(store, completedWorkflowActionId, completedAt);
  }
  const state = summarizeProductCoreState(store);
  const brandProfileOverview = createBrandProfileOverview(store, 'brand_profile_example_001');
  const contextPackReadiness = evaluateContextPackReadiness(store, 'context_pack_example_001');
  const contextPackUsageFlow = createContextPackUsageFlow(store, 'context_pack_example_001');
  const contextPackWorkflow = {
    title: 'Context Pack workflow',
    currentStep: contextPackReadiness.ready ? 'ready-for-use' : 'resolve-review',
    actionStatus: contextPackReadiness.nextActions[0]?.status || 'ready',
    completedActionId: completedWorkflowActionId,
    stateSource: workflowStateSource,
    browserStateKey: 'brandos.workflow.completedActionId',
    repositoryStateFile: options.repositoryStateFile || DEFAULT_REPOSITORY_WORKFLOW_STATE_PATH,
    repositoryStateStatus: options.repositoryStateStatus || 'not-loaded',
    repositoryStateVersion: options.repositoryStateVersion ?? null,
    completedActionCount: options.completedActionCount ?? (completedWorkflowActionId ? 1 : 0),
    completedActionIds: options.completedActionIds ?? (completedWorkflowActionId ? [completedWorkflowActionId] : []),
    owner: 'operator@example.local',
    nextActions: contextPackReadiness.nextActions
  };
  const studioStateInspection = {
    title: 'Studio state inspection',
    source: contextPackWorkflow.stateSource,
    status: contextPackWorkflow.repositoryStateStatus,
    file: contextPackWorkflow.repositoryStateFile,
    version: contextPackWorkflow.repositoryStateVersion,
    latestCompletedActionId: contextPackWorkflow.completedActionId,
    latestCompletedAt: completedWorkflowActionId ? completedAt : null,
    completedActionCount: contextPackWorkflow.completedActionCount,
    completedActionIds: contextPackWorkflow.completedActionIds
  };
  const diagnostics = {
    title: 'Studio diagnostics',
    packageCount: 3,
    objectCount: state.objectCount,
    readinessBlockerCount: contextPackReadiness.blockingReasons.length,
    stateSource: contextPackWorkflow.stateSource,
    stateStatus: contextPackWorkflow.repositoryStateStatus,
    result: contextPackReadiness.ready ? 'ready' : 'attention',
    checks: [
      { label: 'Packages loaded', status: 'pass', detail: '3 packages available' },
      { label: 'Product objects loaded', status: state.objectCount > 0 ? 'pass' : 'fail', detail: `${state.objectCount} objects available` },
      {
        label: 'Context readiness',
        status: contextPackReadiness.ready ? 'pass' : 'attention',
        detail: `${contextPackReadiness.blockingReasons.length} blockers`
      },
      { label: 'State source available', status: contextPackWorkflow.stateSource ? 'pass' : 'fail', detail: contextPackWorkflow.stateSource },
      { label: 'State status available', status: contextPackWorkflow.repositoryStateStatus ? 'pass' : 'fail', detail: contextPackWorkflow.repositoryStateStatus }
    ]
  };
  const operatorGuidance = contextPackReadiness.ready ? {
    title: 'Operator guidance',
    status: 'ready',
    recommendation: 'Use Context Pack',
    reason: 'Context Pack has no readiness blockers.',
    command: 'Open ready scenario'
  } : {
    title: 'Operator guidance',
    status: 'attention',
    recommendation: 'Resolve readiness blocker',
    reason: contextPackReadiness.blockingReasons[0] ?? 'Context Pack is not ready.',
    command: 'Complete pending Workflow Action'
  };
  const operatorWorkflow = contextPackReadiness.ready ? {
    title: 'Operator workflow',
    status: 'ready',
    activeStage: 'Use Context Pack',
    nextAction: 'Use context pack context_pack_example_001',
    executionControls: [
      {
        label: 'Use Context Pack',
        controlType: 'link',
        status: 'enabled',
        command: 'Open Context Pack workflow',
        target: 'ready.html',
        result: 'Continue with ready Context Pack'
      }
    ],
    stages: [
      { label: 'Review readiness', status: 'complete', detail: 'Context Pack readiness has no blockers.' },
      { label: 'Resolve action', status: 'complete', detail: 'Required Workflow Action is complete.' },
      { label: 'Use Context Pack', status: 'active', detail: 'Context Pack is ready for operator use.' }
    ]
  } : {
    title: 'Operator workflow',
    status: 'attention',
    activeStage: 'Resolve action',
    nextAction: 'Complete workflow_action_example_001',
    executionControls: [
      {
        label: 'Complete Workflow Action',
        controlType: 'form',
        status: 'enabled',
        command: 'Complete workflow_action_example_001',
        target: 'ready.html',
        result: 'Preview ready scenario'
      }
    ],
    stages: [
      { label: 'Review readiness', status: 'complete', detail: 'Context Pack readiness was evaluated.' },
      { label: 'Resolve action', status: 'active', detail: contextPackReadiness.blockingReasons[0] ?? 'Resolve the current readiness blocker.' },
      { label: 'Use Context Pack', status: 'blocked', detail: 'Context Pack use waits for the pending Workflow Action.' }
    ]
  };
  return {
    app: 'BrandOS Studio',
    release: 'v1.0 Development Ready',
    status: 'implementation scaffold',
    state,
    brandProfileOverview,
    contextPackReadiness,
    contextPackUsageFlow,
    contextPackWorkflow,
    studioStateInspection,
    diagnostics,
    operatorGuidance,
    operatorWorkflow,
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
  const repositoryStateIgnored = args.includes('--ignore-repository-state');
  const repositoryState = repositoryStateIgnored ? { exists: false } : describeWorkflowActionState(stateFile);
  const repositoryOptions = repositoryState.exists ? createStudioShellOptionsFromRepositoryState(stateFile) : {};
  const workflowStateSource = completedWorkflowActionId ? 'command' : repositoryState.exists ? 'repository' : 'example';

  return {
    ...repositoryOptions,
    ...(completedWorkflowActionId ? { completedWorkflowActionId } : {}),
    ...(completedAt ? { completedAt } : {}),
    workflowStateSource,
    repositoryStateFile: stateFile,
    repositoryStateStatus: repositoryStateIgnored ? 'ignored' : repositoryState.exists ? 'loaded' : 'not-found',
    repositoryStateVersion: repositoryState.version ?? null,
    completedActionCount: repositoryState.completedWorkflowActionIds?.length ?? 0,
    completedActionIds: repositoryState.completedWorkflowActionIds ?? []
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
