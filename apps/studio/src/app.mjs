import {
  createDomainSummary,
  createAgentDraftExecution,
  createAgentHandoffClosure,
  createAgentHandoffContext,
  createAgentHandoffRuntimeAggregateSummary,
  createAgentHandoffRuntimeFinalClosure,
  createAgentHandoffRuntimeSummary,
  createAgentPromptPlan,
  createExampleProductCoreState,
  createInMemoryProductCoreStore,
  createBrandProfileOverview,
  createCiEvidenceSummary,
  createCommandResultSummary,
  createContextPackUsageFlow,
  createDraftReview,
  createHandoffAcceptance,
  createMainMergePlan,
  createMergeReadiness,
  createOperatorHandoffReadiness,
  createOperatorRunQueue,
  createOperatorStepDetail,
  createOperatorTaskSelection,
  createOperatorWorkflowMap,
  createOperatorWorkflowDesignAggregateSummary,
  createOperatorWorkflowDesignFinalClosure,
  createOperatorRunbookExecution,
  createPullRequestReadiness,
  createPullRequestReviewPackage,
  createRepositoryCollaborationAggregateSummary,
  createRepositoryCollaborationFinalClosure,
  createRepositoryBranchStatus,
  createReleaseTagReadiness,
  createReviewEvidenceSummary,
  createReviewResolutionWorkflow,
  createRuntimeHealthSummary,
  createStudioWorkflowRuntimeAggregateSummary,
  createStudioWorkflowRuntimeFinalClosure,
  createStudioStateRecovery,
  createRuntimeValidationSignals,
  createOperatorRecoveryGuidance,
  createWorkflowSessionSummary,
  createWorkflowTransitionPlan,
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
  const reviewResolutionWorkflow = createReviewResolutionWorkflow(store, 'review_example_001');
  const operatorRunQueue = createOperatorRunQueue(store);
  const operatorRunbookExecution = createOperatorRunbookExecution(store, operatorRunQueue.activeRunId || 'operator_run_example_001');
  const handoffAcceptance = createHandoffAcceptance(store, operatorRunbookExecution.runId);
  const agentHandoffContext = createAgentHandoffContext(store, operatorRunbookExecution.runId);
  const agentPromptPlan = createAgentPromptPlan(store, operatorRunbookExecution.runId);
  const agentDraftExecution = createAgentDraftExecution(store, operatorRunbookExecution.runId);
  const draftReview = createDraftReview(store, operatorRunbookExecution.runId);
  const agentHandoffClosure = createAgentHandoffClosure(store, operatorRunbookExecution.runId);
  const agentHandoffRuntimeSummary = createAgentHandoffRuntimeSummary(store, operatorRunbookExecution.runId);
  const agentHandoffRuntimeAggregateSummary = createAgentHandoffRuntimeAggregateSummary(store, operatorRunbookExecution.runId);
  const agentHandoffRuntimeFinalClosure = createAgentHandoffRuntimeFinalClosure(store, operatorRunbookExecution.runId);
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
  const multiActionWorkflowState = {
    title: 'Multi-action workflow state',
    status: contextPackWorkflow.completedActionCount > 1 ? 'multiple' : contextPackWorkflow.completedActionCount === 1 ? 'single' : 'empty',
    completedActionCount: contextPackWorkflow.completedActionCount,
    latestCompletedActionId: contextPackWorkflow.completedActionId,
    completedActionIds: contextPackWorkflow.completedActionIds,
    readinessImpact: contextPackReadiness.ready ? 'readiness resolved' : 'readiness blocked',
    stateSource: contextPackWorkflow.stateSource
  };
  const runtimeHealthSummary = createRuntimeHealthSummary(store, operatorRunbookExecution.runId, {
    stateSource: contextPackWorkflow.stateSource,
    stateStatus: contextPackWorkflow.repositoryStateStatus,
    completedActionCount: contextPackWorkflow.completedActionCount,
    completedActionIds: contextPackWorkflow.completedActionIds
  });
  const studioStateRecovery = createStudioStateRecovery(store, operatorRunbookExecution.runId, {
    stateSource: contextPackWorkflow.stateSource,
    stateStatus: contextPackWorkflow.repositoryStateStatus,
    completedActionCount: contextPackWorkflow.completedActionCount,
    completedActionIds: contextPackWorkflow.completedActionIds
  });
  const runtimeValidationSignals = createRuntimeValidationSignals(store, operatorRunbookExecution.runId, {
    stateSource: contextPackWorkflow.stateSource,
    stateStatus: contextPackWorkflow.repositoryStateStatus,
    completedActionCount: contextPackWorkflow.completedActionCount,
    completedActionIds: contextPackWorkflow.completedActionIds
  });
  const operatorRecoveryGuidance = createOperatorRecoveryGuidance(store, operatorRunbookExecution.runId, {
    stateSource: contextPackWorkflow.stateSource,
    stateStatus: contextPackWorkflow.repositoryStateStatus,
    completedActionCount: contextPackWorkflow.completedActionCount,
    completedActionIds: contextPackWorkflow.completedActionIds
  });
  const workflowSessionSummary = createWorkflowSessionSummary(store, operatorRunbookExecution.runId, {
    stateSource: contextPackWorkflow.stateSource,
    stateStatus: contextPackWorkflow.repositoryStateStatus,
    completedActionCount: contextPackWorkflow.completedActionCount,
    completedActionIds: contextPackWorkflow.completedActionIds
  });
  const workflowTransitionPlan = createWorkflowTransitionPlan(store, operatorRunbookExecution.runId, {
    stateSource: contextPackWorkflow.stateSource,
    stateStatus: contextPackWorkflow.repositoryStateStatus,
    completedActionCount: contextPackWorkflow.completedActionCount,
    completedActionIds: contextPackWorkflow.completedActionIds
  });
  const commandResultSummary = createCommandResultSummary(store, operatorRunbookExecution.runId, {
    stateSource: contextPackWorkflow.stateSource,
    stateStatus: contextPackWorkflow.repositoryStateStatus,
    completedActionCount: contextPackWorkflow.completedActionCount,
    completedActionIds: contextPackWorkflow.completedActionIds
  });
  const studioWorkflowRuntimeAggregateSummary = createStudioWorkflowRuntimeAggregateSummary(store, operatorRunbookExecution.runId, {
    stateSource: contextPackWorkflow.stateSource,
    stateStatus: contextPackWorkflow.repositoryStateStatus,
    completedActionCount: contextPackWorkflow.completedActionCount,
    completedActionIds: contextPackWorkflow.completedActionIds
  });
  const studioWorkflowRuntimeFinalClosure = createStudioWorkflowRuntimeFinalClosure(store, operatorRunbookExecution.runId, {
    stateSource: contextPackWorkflow.stateSource,
    stateStatus: contextPackWorkflow.repositoryStateStatus,
    completedActionCount: contextPackWorkflow.completedActionCount,
    completedActionIds: contextPackWorkflow.completedActionIds
  });
  const operatorWorkflowMap = createOperatorWorkflowMap(store, operatorRunbookExecution.runId, {
    stateSource: contextPackWorkflow.stateSource,
    stateStatus: contextPackWorkflow.repositoryStateStatus,
    completedActionCount: contextPackWorkflow.completedActionCount,
    completedActionIds: contextPackWorkflow.completedActionIds
  });
  const operatorTaskSelection = createOperatorTaskSelection(store, operatorRunbookExecution.runId, {
    stateSource: contextPackWorkflow.stateSource,
    stateStatus: contextPackWorkflow.repositoryStateStatus,
    completedActionCount: contextPackWorkflow.completedActionCount,
    completedActionIds: contextPackWorkflow.completedActionIds
  });
  const operatorStepDetail = createOperatorStepDetail(store, operatorRunbookExecution.runId, {
    stateSource: contextPackWorkflow.stateSource,
    stateStatus: contextPackWorkflow.repositoryStateStatus,
    completedActionCount: contextPackWorkflow.completedActionCount,
    completedActionIds: contextPackWorkflow.completedActionIds
  });
  const operatorHandoffReadiness = createOperatorHandoffReadiness(store, operatorRunbookExecution.runId, {
    stateSource: contextPackWorkflow.stateSource,
    stateStatus: contextPackWorkflow.repositoryStateStatus,
    completedActionCount: contextPackWorkflow.completedActionCount,
    completedActionIds: contextPackWorkflow.completedActionIds
  });
  const operatorWorkflowDesignAggregateSummary = createOperatorWorkflowDesignAggregateSummary(store, operatorRunbookExecution.runId, {
    stateSource: contextPackWorkflow.stateSource,
    stateStatus: contextPackWorkflow.repositoryStateStatus,
    completedActionCount: contextPackWorkflow.completedActionCount,
    completedActionIds: contextPackWorkflow.completedActionIds
  });
  const operatorWorkflowDesignFinalClosure = createOperatorWorkflowDesignFinalClosure(store, operatorRunbookExecution.runId, {
    stateSource: contextPackWorkflow.stateSource,
    stateStatus: contextPackWorkflow.repositoryStateStatus,
    completedActionCount: contextPackWorkflow.completedActionCount,
    completedActionIds: contextPackWorkflow.completedActionIds
  });
  const repositoryBranchStatus = createRepositoryBranchStatus(store, operatorRunbookExecution.runId, {
    stateSource: contextPackWorkflow.stateSource,
    stateStatus: contextPackWorkflow.repositoryStateStatus,
    completedActionCount: contextPackWorkflow.completedActionCount,
    completedActionIds: contextPackWorkflow.completedActionIds
  });
  const pullRequestReadiness = createPullRequestReadiness(store, operatorRunbookExecution.runId, {
    stateSource: contextPackWorkflow.stateSource,
    stateStatus: contextPackWorkflow.repositoryStateStatus,
    completedActionCount: contextPackWorkflow.completedActionCount,
    completedActionIds: contextPackWorkflow.completedActionIds
  });
  const reviewEvidenceSummary = createReviewEvidenceSummary(store, operatorRunbookExecution.runId, {
    stateSource: contextPackWorkflow.stateSource,
    stateStatus: contextPackWorkflow.repositoryStateStatus,
    completedActionCount: contextPackWorkflow.completedActionCount,
    completedActionIds: contextPackWorkflow.completedActionIds
  });
  const mergeReadiness = createMergeReadiness(store, operatorRunbookExecution.runId, {
    stateSource: contextPackWorkflow.stateSource,
    stateStatus: contextPackWorkflow.repositoryStateStatus,
    completedActionCount: contextPackWorkflow.completedActionCount,
    completedActionIds: contextPackWorkflow.completedActionIds
  });
  const repositoryCollaborationAggregateSummary = createRepositoryCollaborationAggregateSummary(store, operatorRunbookExecution.runId, {
    stateSource: contextPackWorkflow.stateSource,
    stateStatus: contextPackWorkflow.repositoryStateStatus,
    completedActionCount: contextPackWorkflow.completedActionCount,
    completedActionIds: contextPackWorkflow.completedActionIds
  });
  const repositoryCollaborationFinalClosure = createRepositoryCollaborationFinalClosure(store, operatorRunbookExecution.runId, {
    stateSource: contextPackWorkflow.stateSource,
    stateStatus: contextPackWorkflow.repositoryStateStatus,
    completedActionCount: contextPackWorkflow.completedActionCount,
    completedActionIds: contextPackWorkflow.completedActionIds
  });
  const pullRequestReviewPackage = createPullRequestReviewPackage(store, operatorRunbookExecution.runId, {
    stateSource: contextPackWorkflow.stateSource,
    stateStatus: contextPackWorkflow.repositoryStateStatus,
    completedActionCount: contextPackWorkflow.completedActionCount,
    completedActionIds: contextPackWorkflow.completedActionIds
  });
  const ciEvidenceSummary = createCiEvidenceSummary(store, operatorRunbookExecution.runId, {
    stateSource: contextPackWorkflow.stateSource,
    stateStatus: contextPackWorkflow.repositoryStateStatus,
    completedActionCount: contextPackWorkflow.completedActionCount,
    completedActionIds: contextPackWorkflow.completedActionIds
  });
  const mainMergePlan = createMainMergePlan(store, operatorRunbookExecution.runId, {
    stateSource: contextPackWorkflow.stateSource,
    stateStatus: contextPackWorkflow.repositoryStateStatus,
    completedActionCount: contextPackWorkflow.completedActionCount,
    completedActionIds: contextPackWorkflow.completedActionIds
  });
  const releaseTagReadiness = createReleaseTagReadiness(store, operatorRunbookExecution.runId, {
    stateSource: contextPackWorkflow.stateSource,
    stateStatus: contextPackWorkflow.repositoryStateStatus,
    completedActionCount: contextPackWorkflow.completedActionCount,
    completedActionIds: contextPackWorkflow.completedActionIds
  });
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
  const studioWorkflowAuditTrail = {
    title: 'Studio workflow audit trail',
    status: contextPackReadiness.ready ? 'resolved' : 'open',
    source: contextPackWorkflow.stateSource,
    latestEvent: contextPackReadiness.ready ? 'ready-state-rendered' : 'readiness-blocker-detected',
    events: [
      {
        label: 'Context readiness evaluated',
        status: contextPackReadiness.ready ? 'pass' : 'attention',
        detail: `${contextPackReadiness.blockingReasons.length} blockers`
      },
      {
        label: 'Review resolution checked',
        status: reviewResolutionWorkflow.status,
        detail: reviewResolutionWorkflow.resolutionResult
      },
      {
        label: 'Workflow state loaded',
        status: contextPackWorkflow.repositoryStateStatus,
        detail: `Source ${contextPackWorkflow.stateSource}`
      },
      {
        label: 'Completed action history counted',
        status: multiActionWorkflowState.status,
        detail: `${multiActionWorkflowState.completedActionCount} completed actions`
      },
      {
        label: 'Operator recommendation issued',
        status: operatorWorkflow.status,
        detail: operatorWorkflow.nextAction
      }
    ]
  };
  const operatorHandoff = {
    title: 'Operator handoff',
    status: contextPackReadiness.ready ? 'ready-for-agent' : 'needs-operator',
    objective: contextPackReadiness.ready ? 'Hand off ready Context Pack usage to an AI agent.' : 'Hand off readiness blocker resolution to an operator.',
    sourcesLoaded: [
      'Product Core example state',
      'Context Pack readiness',
      'Review resolution workflow',
      'Studio workflow audit trail'
    ],
    changesMade: contextPackReadiness.ready ? 'Workflow Action completed and review resolved.' : 'No repository state change in blocked preview.',
    assumptions: contextPackReadiness.ready ? 'Context Pack is ready because readiness blockers are clear.' : 'Review feedback must be resolved before Context Pack use.',
    missingContext: contextPackReadiness.ready ? 'No missing context for ready preview.' : 'Completed Workflow Action evidence is not present yet.',
    verificationPerformed: `Studio audit trail status: ${studioWorkflowAuditTrail.status}`,
    recommendedNextWorkflow: contextPackReadiness.ready ? 'Use Context Pack' : 'Review Resolution Workflow',
    nextAgent: contextPackReadiness.ready ? 'AI writing agent' : 'Operator'
  };
  return {
    app: 'BrandOS Studio',
    release: 'v1.0 Development Ready',
    status: 'implementation scaffold',
    state,
    brandProfileOverview,
    contextPackReadiness,
    contextPackUsageFlow,
    reviewResolutionWorkflow,
    operatorRunQueue,
    operatorRunbookExecution,
    handoffAcceptance,
    agentHandoffContext,
    agentPromptPlan,
    agentDraftExecution,
    draftReview,
    agentHandoffClosure,
    agentHandoffRuntimeSummary,
    agentHandoffRuntimeAggregateSummary,
    agentHandoffRuntimeFinalClosure,
    runtimeHealthSummary,
    studioStateRecovery,
    runtimeValidationSignals,
    operatorRecoveryGuidance,
    workflowSessionSummary,
    workflowTransitionPlan,
    commandResultSummary,
    studioWorkflowRuntimeAggregateSummary,
    studioWorkflowRuntimeFinalClosure,
    operatorWorkflowMap,
    operatorTaskSelection,
    operatorStepDetail,
    operatorHandoffReadiness,
    operatorWorkflowDesignAggregateSummary,
    operatorWorkflowDesignFinalClosure,
    repositoryBranchStatus,
    pullRequestReadiness,
    reviewEvidenceSummary,
    mergeReadiness,
    repositoryCollaborationAggregateSummary,
    repositoryCollaborationFinalClosure,
    pullRequestReviewPackage,
    ciEvidenceSummary,
    mainMergePlan,
    releaseTagReadiness,
    contextPackWorkflow,
    studioStateInspection,
    multiActionWorkflowState,
    studioWorkflowAuditTrail,
    operatorHandoff,
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
