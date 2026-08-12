export function createBrandProfileOverview(store, brandProfileId) {
  const profile = requireRecord(store, 'brand-profile', brandProfileId);
  const claims = profile.claims.map((claimId) => requireRecord(store, 'claim', claimId));
  const decisions = profile.decisions.map((decisionId) => requireRecord(store, 'decision', decisionId));

  return {
    id: profile.id,
    name: profile.name,
    status: profile.status,
    workspaceId: profile.workspaceId,
    promise: profile.positioning.promise,
    primaryAudience: profile.audience.primary,
    claimCount: claims.length,
    supportedClaimCount: claims.filter((claim) => claim.status === 'supported' || claim.status === 'approved').length,
    decisionCount: decisions.length,
    acceptedDecisionCount: decisions.filter((decision) => decision.status === 'accepted').length,
    updatedAt: profile.updatedAt
  };
}

export function evaluateContextPackReadiness(store, contextPackId) {
  const contextPack = requireRecord(store, 'context-pack', contextPackId);
  const claims = contextPack.includedClaims.map((claimId) => requireRecord(store, 'claim', claimId));
  const decisions = contextPack.includedDecisions.map((decisionId) => requireRecord(store, 'decision', decisionId));
  const reviews = store
    .list('review')
    .filter((review) => review.targetObjectType === 'context-pack' && review.targetObjectId === contextPack.id);
  const workflowActions = store
    .list('workflow-action')
    .filter((action) => action.targetObjectId === contextPack.id || reviews.some((review) => review.id === action.targetObjectId));

  const blockingReasons = [
    ...claims
      .filter((claim) => claim.status !== 'supported' && claim.status !== 'approved')
      .map((claim) => `Claim is not supported or approved: ${claim.id}`),
    ...decisions
      .filter((decision) => decision.status !== 'accepted')
      .map((decision) => `Decision is not accepted: ${decision.id}`),
    ...reviews
      .filter((review) => review.status === 'changes-needed' || review.status === 'rejected')
      .map((review) => `Review is blocking release: ${review.id}`)
  ];
  const blockingActions = [
    ...claims
      .filter((claim) => claim.status !== 'supported' && claim.status !== 'approved')
      .map((claim) => ({
        id: null,
        type: 'claim-review',
        status: 'blocked',
        targetId: claim.id,
        label: `Verify or remove claim ${claim.id}`,
        owner: claim.owner
      })),
    ...decisions
      .filter((decision) => decision.status !== 'accepted')
      .map((decision) => ({
        id: null,
        type: 'decision-approval',
        status: 'blocked',
        targetId: decision.id,
        label: `Accept or remove decision ${decision.id}`,
        owner: decision.owner
      })),
    ...reviews
      .filter((review) => review.status === 'changes-needed' || review.status === 'rejected')
      .map((review) => {
        const action = workflowActions.find((item) => item.targetObjectId === review.id);
        return {
          id: action?.id || null,
          type: action?.type || 'review-resolution',
          status: action?.status || 'pending',
          targetId: review.id,
          label: action?.label || `Resolve review feedback for ${review.targetObjectId}`,
          owner: action?.owner || review.reviewer
        };
      })
  ];
  const nextActions = blockingActions.length
    ? blockingActions
    : [
      {
        id: null,
        type: 'context-pack-release',
        status: 'ready',
        targetId: contextPack.id,
        label: `Use context pack ${contextPack.id}`,
        owner: contextPack.owner
      }
    ];

  return {
    id: contextPack.id,
    name: contextPack.name,
    status: contextPack.status,
    includedClaimCount: claims.length,
    supportedClaimCount: claims.filter((claim) => claim.status === 'supported' || claim.status === 'approved').length,
    acceptedDecisionCount: decisions.filter((decision) => decision.status === 'accepted').length,
    reviewCount: reviews.length,
    actionCount: workflowActions.length,
    ready: blockingReasons.length === 0,
    blockingReasons,
    nextActions
  };
}

export function createContextPackUsageFlow(store, contextPackId) {
  const contextPack = requireRecord(store, 'context-pack', contextPackId);

  return {
    id: contextPack.id,
    title: 'Context Pack usage flow',
    status: contextPack.status,
    taskType: contextPack.taskType,
    intendedAudience: contextPack.intendedAudience,
    owner: contextPack.owner,
    expiresAt: contextPack.expiresAt,
    includedSections: contextPack.includedProfileSections,
    includedClaimCount: contextPack.includedClaims.length,
    includedDecisionCount: contextPack.includedDecisions.length,
    excludedTopics: contextPack.excludedTopics,
    agentInstructions: contextPack.agentInstructions,
    steps: [
      { label: 'Load approved context', detail: `Use Context Pack ${contextPack.id} as the source bundle.` },
      { label: 'Apply task boundary', detail: `Task type: ${contextPack.taskType}` },
      { label: 'Respect exclusions', detail: `Excluded topics: ${contextPack.excludedTopics.join(', ')}` },
      { label: 'Follow agent instructions', detail: `${contextPack.agentInstructions.length} instructions available` }
    ]
  };
}

export function createReviewResolutionWorkflow(store, reviewId) {
  const review = requireRecord(store, 'review', reviewId);
  const action = store
    .list('workflow-action')
    .find((item) => item.targetObjectId === review.id && item.type === 'review-resolution');
  const resolved = review.status === 'approved';

  return {
    id: review.id,
    title: 'Review resolution workflow',
    status: resolved ? 'resolved' : 'needs-resolution',
    targetObjectId: review.targetObjectId,
    targetObjectType: review.targetObjectType,
    reviewer: review.reviewer,
    notes: review.notes,
    actionId: action?.id ?? null,
    actionStatus: action?.status ?? 'missing',
    owner: action?.owner ?? review.reviewer,
    recommendedAction: resolved ? 'Use resolved review' : 'Resolve review feedback',
    resolutionResult: resolved ? 'Review approved' : 'Review blocks Context Pack readiness',
    steps: [
      { label: 'Confirm review target', status: 'complete', detail: `${review.targetObjectType} ${review.targetObjectId}` },
      { label: 'Read requested changes', status: 'complete', detail: review.notes },
      { label: 'Complete resolution action', status: resolved ? 'complete' : 'active', detail: action?.label ?? 'No resolution action found' },
      { label: 'Recheck readiness', status: resolved ? 'active' : 'blocked', detail: resolved ? 'Context Pack can be rechecked.' : 'Readiness waits for review resolution.' }
    ]
  };
}

export function createOperatorRunSummary(store, operatorRunId) {
  const operatorRun = requireRecord(store, 'operator-run', operatorRunId);
  const workflowRun = requireRecord(store, 'workflow-run', operatorRun.workflowRunId);
  const actions = operatorRun.actionIds.map((actionId) => requireRecord(store, 'workflow-action', actionId));
  const currentAction = actions.find((action) => action.id === operatorRun.currentActionId)
    ?? requireRecord(store, 'workflow-action', operatorRun.currentActionId);

  return {
    id: operatorRun.id,
    workspaceId: operatorRun.workspaceId,
    objective: operatorRun.objective,
    status: operatorRun.status,
    priority: operatorRun.priority,
    workflowRunId: workflowRun.id,
    workflow: workflowRun.workflow,
    owner: operatorRun.owner,
    actionCount: actions.length,
    completedActionCount: actions.filter((action) => action.status === 'complete').length,
    pendingActionCount: actions.filter((action) => action.status === 'pending' || action.status === 'blocked').length,
    currentActionId: currentAction.id,
    currentActionStatus: currentAction.status,
    nextActionLabel: currentAction.label,
    handoffId: operatorRun.handoffId,
    auditEventCount: operatorRun.auditEventIds.length,
    updatedAt: operatorRun.updatedAt
  };
}

export function createOperatorRunQueue(store) {
  const priorityRank = { high: 0, normal: 1, low: 2 };
  const statusRank = { active: 0, blocked: 1, queued: 2, ready: 3, complete: 4 };

  const items = store
    .list('operator-run')
    .map((operatorRun) => createOperatorRunSummary(store, operatorRun.id))
    .sort((a, b) => {
      const statusOrder = (statusRank[a.status] ?? 99) - (statusRank[b.status] ?? 99);
      if (statusOrder !== 0) {
        return statusOrder;
      }

      const priorityOrder = (priorityRank[a.priority] ?? 99) - (priorityRank[b.priority] ?? 99);
      if (priorityOrder !== 0) {
        return priorityOrder;
      }

      return a.updatedAt.localeCompare(b.updatedAt);
    });

  return {
    title: 'Operator Run Queue',
    runCount: items.length,
    blockedCount: items.filter((item) => item.status === 'blocked').length,
    readyCount: items.filter((item) => item.status === 'ready').length,
    activeRunId: items.find((item) => item.status !== 'complete')?.id ?? null,
    items
  };
}

export function createOperatorWorkflowMap(store, operatorRunId, options = {}) {
  const queue = createOperatorRunQueue(store);
  const runbook = createOperatorRunbookExecution(store, operatorRunId);
  const session = createWorkflowSessionSummary(store, operatorRunId, options);
  const finalClosure = createStudioWorkflowRuntimeFinalClosure(store, operatorRunId, options);
  const mapReady = finalClosure.closed;
  const workflowPaths = mapReady
    ? [
      { label: 'Confirm ready workflow', status: 'complete', detail: `${session.workflowName} is ${session.status}.` },
      { label: 'Use ready route', status: 'complete', detail: `Route ${session.nextRoute} is ready.` },
      { label: 'Close runtime evidence', status: 'complete', detail: finalClosure.closureDecision },
      { label: 'Select operator task', status: 'active', detail: 'Operator Workflow Map can move to Operator Task Selection.' }
    ]
    : [
      { label: 'Review active run', status: 'active', detail: `${runbook.runId} is ${runbook.status}.` },
      { label: 'Resolve workflow blocker', status: 'blocked', detail: session.blockers[0] ?? 'Workflow session is blocked.' },
      { label: 'Rebuild Studio workflow runtime', status: 'pending', detail: finalClosure.closureDecision },
      { label: 'Select operator task', status: 'pending', detail: 'Task selection waits for a ready workflow map.' }
    ];

  return {
    title: 'Operator Workflow Map',
    status: mapReady ? 'ready' : 'blocked',
    mapReady,
    operatorRunId,
    activeRunId: queue.activeRunId,
    workflowName: session.workflowName,
    scenario: session.scenario,
    stateSource: session.stateSource,
    stateStatus: session.stateStatus,
    completedActionCount: session.completedActionCount,
    activePath: mapReady ? 'Use Context Pack' : 'Review Resolution Workflow',
    pathCount: workflowPaths.length,
    readyPathCount: workflowPaths.filter((path) => path.status === 'complete' || path.status === 'active').length,
    blockedPathCount: workflowPaths.filter((path) => path.status === 'blocked').length,
    mapDecision: mapReady ? 'Use ready operator workflow map' : 'Resolve blockers before operator workflow selection',
    mapSummary: mapReady
      ? 'Operator workflow paths are ready for task selection.'
      : 'Operator workflow map waits for runtime closure and session readiness.',
    workflowPaths,
    requiredEvidence: finalClosure.closureEvidence,
    blockers: finalClosure.blockers,
    nextWorkflow: mapReady ? 'Operator Task Selection' : 'Review Resolution Workflow'
  };
}

export function createOperatorTaskSelection(store, operatorRunId, options = {}) {
  const workflowMap = createOperatorWorkflowMap(store, operatorRunId, options);
  const selectionReady = workflowMap.mapReady;
  const taskOptions = selectionReady
    ? [
      {
        label: 'Use Context Pack',
        workflow: 'Use Context Pack',
        status: 'selected',
        reason: 'Operator workflow map is ready and points to the ready Context Pack path.'
      },
      {
        label: 'Inspect ready route',
        workflow: 'Operator Workflow Map',
        status: 'available',
        reason: `${workflowMap.readyPathCount}/${workflowMap.pathCount} workflow paths are ready.`
      },
      {
        label: 'Prepare step detail',
        workflow: 'Operator Step Detail',
        status: 'next',
        reason: 'Selected task can move into inspectable operator step detail.'
      }
    ]
    : [
      {
        label: 'Resolve workflow blockers',
        workflow: 'Review Resolution Workflow',
        status: 'selected',
        reason: workflowMap.mapDecision
      },
      {
        label: 'Inspect workflow map',
        workflow: 'Operator Workflow Map',
        status: 'available',
        reason: `${workflowMap.blockedPathCount} blocked paths require review.`
      },
      {
        label: 'Select operator task',
        workflow: 'Operator Task Selection',
        status: 'blocked',
        reason: 'Task selection waits for a ready operator workflow map.'
      }
    ];
  const selectedTask = taskOptions.find((task) => task.status === 'selected');

  return {
    title: 'Operator Task Selection',
    status: selectionReady ? 'ready' : 'blocked',
    selectionReady,
    operatorRunId,
    workflowName: workflowMap.workflowName,
    scenario: workflowMap.scenario,
    stateSource: workflowMap.stateSource,
    stateStatus: workflowMap.stateStatus,
    completedActionCount: workflowMap.completedActionCount,
    selectedTask: selectedTask.label,
    selectedWorkflow: selectedTask.workflow,
    taskCount: taskOptions.length,
    availableTaskCount: taskOptions.filter((task) => task.status === 'selected' || task.status === 'available' || task.status === 'next').length,
    blockedTaskCount: taskOptions.filter((task) => task.status === 'blocked').length,
    selectionDecision: selectionReady ? 'Select ready Context Pack task' : 'Select blocker resolution task',
    selectionSummary: selectionReady
      ? 'Operator Task Selection can proceed with the ready Context Pack task.'
      : 'Operator Task Selection must resolve workflow blockers before task execution.',
    taskOptions,
    requiredEvidence: workflowMap.requiredEvidence,
    blockers: workflowMap.blockers,
    nextWorkflow: selectionReady ? 'Operator Step Detail' : 'Review Resolution Workflow'
  };
}

export function createOperatorStepDetail(store, operatorRunId, options = {}) {
  const taskSelection = createOperatorTaskSelection(store, operatorRunId, options);
  const detailReady = taskSelection.selectionReady;
  const stepDetails = detailReady
    ? [
      {
        label: 'Confirm selected task',
        status: 'complete',
        detail: `${taskSelection.selectedTask} is selected for ${taskSelection.selectedWorkflow}.`
      },
      {
        label: 'Inspect ready evidence',
        status: 'complete',
        detail: taskSelection.requiredEvidence[0] ?? 'Ready task evidence is present.'
      },
      {
        label: 'Prepare operator handoff readiness',
        status: 'active',
        detail: 'Step detail is ready for Operator Handoff Readiness.'
      }
    ]
    : [
      {
        label: 'Confirm selected blocker task',
        status: 'complete',
        detail: `${taskSelection.selectedTask} is selected for ${taskSelection.selectedWorkflow}.`
      },
      {
        label: 'Inspect blocker detail',
        status: 'active',
        detail: taskSelection.selectionDecision
      },
      {
        label: 'Resolve selected blocker',
        status: 'blocked',
        detail: taskSelection.blockers[0] ?? 'Selected task has unresolved blockers.'
      }
    ];

  return {
    title: 'Operator Step Detail',
    status: detailReady ? 'ready' : 'blocked',
    detailReady,
    operatorRunId,
    workflowName: taskSelection.workflowName,
    scenario: taskSelection.scenario,
    stateSource: taskSelection.stateSource,
    stateStatus: taskSelection.stateStatus,
    completedActionCount: taskSelection.completedActionCount,
    selectedTask: taskSelection.selectedTask,
    selectedWorkflow: taskSelection.selectedWorkflow,
    activeStep: detailReady ? 'Prepare operator handoff readiness' : 'Inspect blocker detail',
    stepOwner: 'operator@example.local',
    stepCommand: detailReady ? 'Prepare handoff readiness evidence' : 'Resolve workflow blockers',
    stepOutcome: detailReady ? 'Operator step can move toward handoff readiness.' : 'Operator step waits for blocker resolution.',
    stepCount: stepDetails.length,
    readyStepCount: stepDetails.filter((step) => step.status === 'complete' || step.status === 'active').length,
    blockedStepCount: stepDetails.filter((step) => step.status === 'blocked').length,
    detailDecision: detailReady ? 'Inspect ready operator task step' : 'Inspect blocker resolution step',
    detailSummary: detailReady
      ? 'Operator Step Detail can inspect the ready task and prepare handoff readiness.'
      : 'Operator Step Detail keeps the blocker resolution task visible before execution.',
    stepDetails,
    requiredEvidence: taskSelection.requiredEvidence,
    blockers: taskSelection.blockers,
    nextWorkflow: detailReady ? 'Operator Handoff Readiness' : 'Review Resolution Workflow'
  };
}

export function createOperatorHandoffReadiness(store, operatorRunId, options = {}) {
  const stepDetail = createOperatorStepDetail(store, operatorRunId, options);
  const handoffReady = stepDetail.detailReady;
  const handoffChecks = handoffReady
    ? [
      { label: 'Selected task inspectable', status: 'pass', detail: stepDetail.selectedTask },
      { label: 'Step detail ready', status: 'pass', detail: stepDetail.activeStep },
      { label: 'Evidence available', status: 'pass', detail: `${stepDetail.requiredEvidence.length} evidence items` },
      { label: 'Blockers clear', status: 'pass', detail: 'No operator handoff blockers remain.' }
    ]
    : [
      { label: 'Selected task inspectable', status: 'pass', detail: stepDetail.selectedTask },
      { label: 'Step detail ready', status: 'blocked', detail: stepDetail.detailDecision },
      { label: 'Evidence available', status: 'blocked', detail: `${stepDetail.requiredEvidence.length} evidence items require blocker resolution` },
      { label: 'Blockers clear', status: 'blocked', detail: stepDetail.blockers[0] ?? 'Operator handoff readiness is blocked.' }
    ];

  return {
    title: 'Operator Handoff Readiness',
    status: handoffReady ? 'ready' : 'blocked',
    handoffReady,
    operatorRunId,
    workflowName: stepDetail.workflowName,
    scenario: stepDetail.scenario,
    stateSource: stepDetail.stateSource,
    stateStatus: stepDetail.stateStatus,
    completedActionCount: stepDetail.completedActionCount,
    selectedTask: stepDetail.selectedTask,
    selectedWorkflow: stepDetail.selectedWorkflow,
    activeStep: stepDetail.activeStep,
    handoffTarget: handoffReady ? 'AI writing agent' : 'Operator',
    handoffMode: handoffReady ? 'agent-ready' : 'operator-resolution',
    handoffCommand: handoffReady ? 'Prepare operator handoff package' : 'Resolve blockers before handoff',
    handoffOutcome: handoffReady ? 'Operator handoff readiness is ready for transfer.' : 'Operator handoff readiness waits for blocker resolution.',
    checkCount: handoffChecks.length,
    passedCheckCount: handoffChecks.filter((check) => check.status === 'pass').length,
    blockedCheckCount: handoffChecks.filter((check) => check.status === 'blocked').length,
    handoffDecision: handoffReady ? 'Prepare handoff readiness package' : 'Keep handoff readiness blocked',
    handoffSummary: handoffReady
      ? 'Operator Handoff Readiness can transfer the selected ready task with evidence.'
      : 'Operator Handoff Readiness keeps local work with the operator until blockers clear.',
    handoffChecks,
    requiredEvidence: stepDetail.requiredEvidence,
    blockers: stepDetail.blockers,
    nextWorkflow: handoffReady ? 'Operator Workflow Design Aggregate Summary' : 'Review Resolution Workflow'
  };
}

export function createOperatorWorkflowDesignAggregateSummary(store, operatorRunId, options = {}) {
  const workflowMap = createOperatorWorkflowMap(store, operatorRunId, options);
  const taskSelection = createOperatorTaskSelection(store, operatorRunId, options);
  const stepDetail = createOperatorStepDetail(store, operatorRunId, options);
  const handoffReadiness = createOperatorHandoffReadiness(store, operatorRunId, options);
  const aggregateReady = handoffReadiness.handoffReady;
  const workflowItems = [
    {
      label: workflowMap.title,
      status: workflowMap.status,
      ready: workflowMap.mapReady,
      detail: workflowMap.mapDecision
    },
    {
      label: taskSelection.title,
      status: taskSelection.status,
      ready: taskSelection.selectionReady,
      detail: taskSelection.selectionDecision
    },
    {
      label: stepDetail.title,
      status: stepDetail.status,
      ready: stepDetail.detailReady,
      detail: stepDetail.detailDecision
    },
    {
      label: handoffReadiness.title,
      status: handoffReadiness.status,
      ready: handoffReadiness.handoffReady,
      detail: handoffReadiness.handoffDecision
    }
  ];

  return {
    title: 'Operator Workflow Design Aggregate Summary',
    status: aggregateReady ? 'ready' : 'blocked',
    aggregateReady,
    operatorRunId,
    workflowName: handoffReadiness.workflowName,
    scenario: handoffReadiness.scenario,
    stateSource: handoffReadiness.stateSource,
    stateStatus: handoffReadiness.stateStatus,
    completedActionCount: handoffReadiness.completedActionCount,
    selectedTask: handoffReadiness.selectedTask,
    selectedWorkflow: handoffReadiness.selectedWorkflow,
    handoffTarget: handoffReadiness.handoffTarget,
    workflowCount: workflowItems.length,
    readyWorkflowCount: workflowItems.filter((item) => item.ready).length,
    blockedWorkflowCount: workflowItems.filter((item) => !item.ready).length,
    aggregateDecision: aggregateReady ? 'Aggregate operator workflow design evidence' : 'Keep operator workflow design aggregate blocked',
    aggregateSummary: aggregateReady
      ? 'Operator Workflow Design v1.5 has ready workflow map, task selection, step detail, and handoff readiness evidence.'
      : 'Operator Workflow Design v1.5 aggregate waits for operator workflow readiness.',
    workflowItems,
    requiredEvidence: aggregateReady
      ? [
        `Handoff readiness status: ${handoffReadiness.status}`,
        `Selected workflow: ${handoffReadiness.selectedWorkflow}`,
        `Handoff checks passed: ${handoffReadiness.passedCheckCount}/${handoffReadiness.checkCount}`
      ]
      : handoffReadiness.requiredEvidence,
    blockers: handoffReadiness.blockers,
    nextWorkflow: aggregateReady ? 'Operator Workflow Design Final Closure' : handoffReadiness.nextWorkflow
  };
}

export function createOperatorWorkflowDesignFinalClosure(store, operatorRunId, options = {}) {
  const aggregateSummary = createOperatorWorkflowDesignAggregateSummary(store, operatorRunId, options);
  const closed = aggregateSummary.aggregateReady;

  return {
    title: 'Operator Workflow Design Final Closure',
    status: closed ? 'closed' : 'blocked',
    closed,
    operatorRunId,
    workflowName: aggregateSummary.workflowName,
    scenario: aggregateSummary.scenario,
    stateSource: aggregateSummary.stateSource,
    stateStatus: aggregateSummary.stateStatus,
    completedActionCount: aggregateSummary.completedActionCount,
    selectedTask: aggregateSummary.selectedTask,
    selectedWorkflow: aggregateSummary.selectedWorkflow,
    handoffTarget: aggregateSummary.handoffTarget,
    closureDecision: closed ? 'Close Operator Workflow Design v1.5' : 'Keep Operator Workflow Design v1.5 open',
    closureSummary: closed
      ? 'Operator Workflow Design v1.5 is closed with aggregate workflow evidence and is ready for archive.'
      : 'Operator Workflow Design v1.5 final closure waits for aggregate readiness.',
    releaseArtifacts: closed
      ? [
        'Operator Workflow Map',
        'Operator Task Selection',
        'Operator Step Detail',
        'Operator Handoff Readiness',
        'Operator Workflow Design Aggregate Summary'
      ]
      : [],
    closureEvidence: closed
      ? [
        `Aggregate status: ${aggregateSummary.status}`,
        `Aggregate workflows ready: ${aggregateSummary.readyWorkflowCount}/${aggregateSummary.workflowCount}`,
        `Aggregate evidence count: ${aggregateSummary.requiredEvidence.length}`
      ]
      : aggregateSummary.requiredEvidence,
    closureChecks: [
      { label: 'Aggregate summary ready', status: aggregateSummary.aggregateReady ? 'pass' : 'blocked' },
      { label: 'Workflow evidence present', status: aggregateSummary.requiredEvidence.length > 0 ? 'pass' : 'blocked' },
      { label: 'Release artifacts assigned', status: closed ? 'pass' : 'blocked' }
    ],
    blockers: aggregateSummary.blockers,
    nextWorkflow: closed ? 'Operator Workflow Design v1.5 Closed' : aggregateSummary.nextWorkflow
  };
}

export function createRepositoryBranchStatus(store, operatorRunId, options = {}) {
  const finalClosure = createOperatorWorkflowDesignFinalClosure(store, operatorRunId, options);
  const branchReady = finalClosure.closed;
  const localBranch = options.localBranch || 'codex/development-ready-v1.0';
  const remoteName = options.remoteName || 'origin';
  const remoteBranch = options.remoteBranch || `${remoteName}/${localBranch}`;
  const mainBranch = options.mainBranch || 'main';
  const workingTreeStatus = branchReady ? 'clean' : 'blocked-preview';
  const syncStatus = branchReady ? 'synced' : 'waiting-for-cycle-closure';
  const branchItems = [
    {
      label: 'Local branch',
      status: branchReady ? 'active' : 'blocked',
      detail: localBranch
    },
    {
      label: 'Remote branch',
      status: branchReady ? 'synced' : 'blocked',
      detail: remoteBranch
    },
    {
      label: 'Main branch',
      status: 'protected',
      detail: mainBranch
    },
    {
      label: 'Working tree',
      status: workingTreeStatus,
      detail: branchReady ? 'No local collaboration blockers are present.' : 'Repository collaboration waits for v1.5 closure.'
    }
  ];

  return {
    title: 'Repository Branch Status',
    status: branchReady ? 'ready' : 'blocked',
    branchReady,
    operatorRunId,
    workflowName: 'Repository Collaboration Workflow',
    scenario: finalClosure.scenario,
    stateSource: finalClosure.stateSource,
    stateStatus: finalClosure.stateStatus,
    completedActionCount: finalClosure.completedActionCount,
    localBranch,
    remoteBranch,
    mainBranch,
    remoteName,
    syncStatus,
    workingTreeStatus,
    branchCount: branchItems.length,
    readyBranchCount: branchItems.filter((item) => item.status === 'active' || item.status === 'synced' || item.status === 'protected' || item.status === 'clean').length,
    blockedBranchCount: branchItems.filter((item) => item.status === 'blocked' || item.status === 'blocked-preview').length,
    branchDecision: branchReady ? 'Use repository collaboration branch' : 'Keep repository branch status blocked',
    branchSummary: branchReady
      ? 'Repository Branch Status can use the active collaboration branch with remote and main evidence.'
      : 'Repository Branch Status waits for Operator Workflow Design v1.5 closure before collaboration.',
    branchItems,
    requiredEvidence: branchReady
      ? [
        `Final closure status: ${finalClosure.status}`,
        `Local branch: ${localBranch}`,
        `Remote branch: ${remoteBranch}`,
        `Main branch: ${mainBranch}`
      ]
      : finalClosure.closureEvidence,
    blockers: finalClosure.blockers,
    nextWorkflow: branchReady ? 'Pull Request Readiness' : finalClosure.nextWorkflow
  };
}

export function createPullRequestReadiness(store, operatorRunId, options = {}) {
  const branchStatus = createRepositoryBranchStatus(store, operatorRunId, options);
  const prReady = branchStatus.branchReady;
  const pullRequestTitle = options.pullRequestTitle || 'Repository Collaboration Workflow v1.6';
  const pullRequestTarget = options.pullRequestTarget || branchStatus.mainBranch;
  const pullRequestSource = options.pullRequestSource || branchStatus.localBranch;
  const reviewMode = prReady ? 'ready-for-review' : 'blocked-preview';
  const mergePolicy = prReady ? 'review-before-main' : 'hold-before-review';
  const readinessChecks = [
    {
      label: 'Branch status ready',
      status: branchStatus.branchReady ? 'pass' : 'blocked',
      detail: branchStatus.branchDecision
    },
    {
      label: 'Remote branch available',
      status: branchStatus.syncStatus === 'synced' ? 'pass' : 'blocked',
      detail: branchStatus.remoteBranch
    },
    {
      label: 'Main branch protected',
      status: branchStatus.mainBranch ? 'pass' : 'blocked',
      detail: branchStatus.mainBranch
    },
    {
      label: 'Review required before merge',
      status: prReady ? 'pass' : 'blocked',
      detail: mergePolicy
    }
  ];

  return {
    title: 'Pull Request Readiness',
    status: prReady ? 'ready' : 'blocked',
    prReady,
    operatorRunId,
    workflowName: branchStatus.workflowName,
    scenario: branchStatus.scenario,
    stateSource: branchStatus.stateSource,
    stateStatus: branchStatus.stateStatus,
    completedActionCount: branchStatus.completedActionCount,
    pullRequestTitle,
    pullRequestSource,
    pullRequestTarget,
    localBranch: branchStatus.localBranch,
    remoteBranch: branchStatus.remoteBranch,
    mainBranch: branchStatus.mainBranch,
    reviewMode,
    mergePolicy,
    checkCount: readinessChecks.length,
    passedCheckCount: readinessChecks.filter((check) => check.status === 'pass').length,
    blockedCheckCount: readinessChecks.filter((check) => check.status === 'blocked').length,
    readinessDecision: prReady ? 'Prepare pull request review' : 'Keep pull request readiness blocked',
    readinessSummary: prReady
      ? 'Pull Request Readiness can open review from synced branch evidence.'
      : 'Pull Request Readiness waits for repository branch status before review.',
    readinessChecks,
    requiredEvidence: prReady
      ? [
        `Branch status: ${branchStatus.status}`,
        `Source branch: ${pullRequestSource}`,
        `Target branch: ${pullRequestTarget}`,
        `Review mode: ${reviewMode}`
      ]
      : branchStatus.requiredEvidence,
    blockers: branchStatus.blockers,
    nextWorkflow: prReady ? 'Review Evidence Summary' : branchStatus.nextWorkflow
  };
}

export function createReviewEvidenceSummary(store, operatorRunId, options = {}) {
  const pullRequest = createPullRequestReadiness(store, operatorRunId, options);
  const evidenceReady = pullRequest.prReady;
  const releaseNotesStatus = evidenceReady ? 'prepared' : 'blocked';
  const closureEvidenceStatus = evidenceReady ? 'complete' : 'blocked';
  const unresolvedBlockers = evidenceReady ? [] : pullRequest.blockers;
  const evidenceItems = [
    {
      label: 'Pull request readiness',
      status: pullRequest.status,
      detail: pullRequest.readinessDecision
    },
    {
      label: 'Release notes',
      status: releaseNotesStatus,
      detail: evidenceReady ? 'Release notes can cite pull request readiness evidence.' : 'Release notes wait for pull request readiness.'
    },
    {
      label: 'Closure evidence',
      status: closureEvidenceStatus,
      detail: evidenceReady ? 'Closure evidence can reference synced branch and review mode.' : 'Closure evidence waits for repository collaboration readiness.'
    },
    {
      label: 'Unresolved blockers',
      status: evidenceReady ? 'clear' : 'blocked',
      detail: evidenceReady ? 'No review evidence blockers remain.' : `${unresolvedBlockers.length} blockers remain.`
    }
  ];

  return {
    title: 'Review Evidence Summary',
    status: evidenceReady ? 'ready' : 'blocked',
    evidenceReady,
    operatorRunId,
    workflowName: pullRequest.workflowName,
    scenario: pullRequest.scenario,
    stateSource: pullRequest.stateSource,
    stateStatus: pullRequest.stateStatus,
    completedActionCount: pullRequest.completedActionCount,
    pullRequestTitle: pullRequest.pullRequestTitle,
    pullRequestSource: pullRequest.pullRequestSource,
    pullRequestTarget: pullRequest.pullRequestTarget,
    reviewMode: pullRequest.reviewMode,
    mergePolicy: pullRequest.mergePolicy,
    releaseNotesStatus,
    closureEvidenceStatus,
    unresolvedBlockerCount: unresolvedBlockers.length,
    evidenceCount: evidenceItems.length,
    readyEvidenceCount: evidenceItems.filter((item) => item.status === 'ready' || item.status === 'prepared' || item.status === 'complete' || item.status === 'clear').length,
    blockedEvidenceCount: evidenceItems.filter((item) => item.status === 'blocked').length,
    evidenceDecision: evidenceReady ? 'Summarize review evidence for merge readiness' : 'Keep review evidence blocked',
    evidenceSummary: evidenceReady
      ? 'Review Evidence Summary has pull request readiness, release notes, and closure evidence for merge readiness.'
      : 'Review Evidence Summary waits for pull request readiness before merge review.',
    evidenceItems,
    requiredEvidence: evidenceReady
      ? [
        `Pull request status: ${pullRequest.status}`,
        `Release notes status: ${releaseNotesStatus}`,
        `Closure evidence status: ${closureEvidenceStatus}`,
        `Merge policy: ${pullRequest.mergePolicy}`
      ]
      : pullRequest.requiredEvidence,
    blockers: unresolvedBlockers,
    nextWorkflow: evidenceReady ? 'Merge Readiness' : pullRequest.nextWorkflow
  };
}

export function createMergeReadiness(store, operatorRunId, options = {}) {
  const reviewEvidence = createReviewEvidenceSummary(store, operatorRunId, options);
  const mergeReady = reviewEvidence.evidenceReady;
  const mainBranchStatus = mergeReady ? 'protected' : 'blocked';
  const reviewEvidenceStatus = mergeReady ? 'complete' : 'blocked';
  const releaseEvidenceStatus = mergeReady ? 'prepared' : 'blocked';
  const mergeWindowStatus = mergeReady ? 'open' : 'blocked';
  const mergeChecks = [
    {
      label: 'Review evidence ready',
      status: reviewEvidence.status === 'ready' ? 'pass' : 'blocked',
      detail: reviewEvidence.evidenceDecision
    },
    {
      label: 'Main branch target',
      status: mergeReady ? 'pass' : 'blocked',
      detail: reviewEvidence.pullRequestTarget
    },
    {
      label: 'Release evidence prepared',
      status: releaseEvidenceStatus === 'prepared' ? 'pass' : 'blocked',
      detail: reviewEvidence.releaseNotesStatus
    },
    {
      label: 'Merge policy accepted',
      status: reviewEvidence.mergePolicy === 'review-before-main' ? 'pass' : 'blocked',
      detail: reviewEvidence.mergePolicy
    }
  ];

  return {
    title: 'Merge Readiness',
    status: mergeReady ? 'ready' : 'blocked',
    mergeReady,
    operatorRunId,
    workflowName: reviewEvidence.workflowName,
    scenario: reviewEvidence.scenario,
    stateSource: reviewEvidence.stateSource,
    stateStatus: reviewEvidence.stateStatus,
    completedActionCount: reviewEvidence.completedActionCount,
    pullRequestTitle: reviewEvidence.pullRequestTitle,
    pullRequestSource: reviewEvidence.pullRequestSource,
    pullRequestTarget: reviewEvidence.pullRequestTarget,
    reviewMode: reviewEvidence.reviewMode,
    mergePolicy: reviewEvidence.mergePolicy,
    mainBranchStatus,
    reviewEvidenceStatus,
    releaseEvidenceStatus,
    mergeWindowStatus,
    checkCount: mergeChecks.length,
    passedCheckCount: mergeChecks.filter((check) => check.status === 'pass').length,
    blockedCheckCount: mergeChecks.filter((check) => check.status === 'blocked').length,
    blockerCount: reviewEvidence.blockers.length,
    mergeDecision: mergeReady ? 'Prepare main branch merge review' : 'Keep merge readiness blocked',
    mergeSummary: mergeReady
      ? 'Merge Readiness can proceed with review evidence, protected main target, and release evidence.'
      : 'Merge Readiness waits for review evidence before any main branch action.',
    mergeChecks,
    requiredEvidence: mergeReady
      ? [
        `Review evidence status: ${reviewEvidence.status}`,
        `Main branch target: ${reviewEvidence.pullRequestTarget}`,
        `Merge policy: ${reviewEvidence.mergePolicy}`,
        `Release evidence status: ${releaseEvidenceStatus}`
      ]
      : reviewEvidence.requiredEvidence,
    blockers: reviewEvidence.blockers,
    nextWorkflow: mergeReady ? 'Repository Collaboration Aggregate Summary' : reviewEvidence.nextWorkflow
  };
}

export function createRepositoryCollaborationAggregateSummary(store, operatorRunId, options = {}) {
  const mergeReadiness = createMergeReadiness(store, operatorRunId, options);
  const aggregateReady = mergeReadiness.mergeReady;
  const workflowItems = [
    {
      label: 'Repository Branch Status',
      status: aggregateReady ? 'ready' : 'blocked',
      ready: aggregateReady,
      detail: aggregateReady ? 'Branch, remote, and main evidence are ready.' : 'Repository branch status waits for workflow closure.'
    },
    {
      label: 'Pull Request Readiness',
      status: aggregateReady ? 'ready' : 'blocked',
      ready: aggregateReady,
      detail: aggregateReady ? 'Pull request readiness is available for review.' : 'Pull request readiness waits for branch status.'
    },
    {
      label: 'Review Evidence Summary',
      status: aggregateReady ? 'ready' : 'blocked',
      ready: aggregateReady,
      detail: aggregateReady ? 'Review evidence is ready for merge readiness.' : 'Review evidence waits for pull request readiness.'
    },
    {
      label: 'Merge Readiness',
      status: mergeReadiness.status,
      ready: mergeReadiness.mergeReady,
      detail: mergeReadiness.mergeDecision
    }
  ];

  return {
    title: 'Repository Collaboration Aggregate Summary',
    status: aggregateReady ? 'ready' : 'blocked',
    aggregateReady,
    operatorRunId,
    workflowName: mergeReadiness.workflowName,
    scenario: mergeReadiness.scenario,
    stateSource: mergeReadiness.stateSource,
    stateStatus: mergeReadiness.stateStatus,
    completedActionCount: mergeReadiness.completedActionCount,
    pullRequestTitle: mergeReadiness.pullRequestTitle,
    pullRequestSource: mergeReadiness.pullRequestSource,
    pullRequestTarget: mergeReadiness.pullRequestTarget,
    reviewMode: mergeReadiness.reviewMode,
    mergePolicy: mergeReadiness.mergePolicy,
    mainBranchStatus: mergeReadiness.mainBranchStatus,
    mergeWindowStatus: mergeReadiness.mergeWindowStatus,
    workflowCount: workflowItems.length,
    readyWorkflowCount: workflowItems.filter((item) => item.ready).length,
    blockedWorkflowCount: workflowItems.filter((item) => !item.ready).length,
    blockerCount: mergeReadiness.blockers.length,
    aggregateDecision: aggregateReady ? 'Aggregate repository collaboration evidence' : 'Keep repository collaboration aggregate blocked',
    aggregateSummary: aggregateReady
      ? 'Repository Collaboration v1.6 has branch, pull request, review evidence, and merge readiness evidence.'
      : 'Repository Collaboration v1.6 aggregate waits for merge readiness.',
    workflowItems,
    requiredEvidence: aggregateReady
      ? [
        `Merge readiness status: ${mergeReadiness.status}`,
        `Workflows ready: ${workflowItems.filter((item) => item.ready).length}/${workflowItems.length}`,
        `Main branch status: ${mergeReadiness.mainBranchStatus}`,
        `Merge window: ${mergeReadiness.mergeWindowStatus}`
      ]
      : mergeReadiness.requiredEvidence,
    blockers: mergeReadiness.blockers,
    nextWorkflow: aggregateReady ? 'Repository Collaboration Final Closure' : mergeReadiness.nextWorkflow
  };
}

export function createRepositoryCollaborationFinalClosure(store, operatorRunId, options = {}) {
  const aggregate = createRepositoryCollaborationAggregateSummary(store, operatorRunId, options);
  const closed = aggregate.aggregateReady;
  const releaseArtifact = options.releaseArtifact || 'Repository Collaboration Workflow v1.6 Release Notes';
  const closureChecklist = options.closureChecklist || 'Repository Collaboration Workflow v1.6 Closure Checklist';
  const closureChecks = [
    {
      label: 'Aggregate summary ready',
      status: aggregate.status === 'ready' ? 'pass' : 'blocked',
      detail: aggregate.aggregateDecision
    },
    {
      label: 'Release notes assigned',
      status: closed ? 'pass' : 'blocked',
      detail: releaseArtifact
    },
    {
      label: 'Closure checklist assigned',
      status: closed ? 'pass' : 'blocked',
      detail: closureChecklist
    },
    {
      label: 'Next cycle protected',
      status: closed ? 'pass' : 'blocked',
      detail: closed ? 'Repository Collaboration v1.6 can close before next package.' : 'Next cycle waits for aggregate readiness.'
    }
  ];

  return {
    title: 'Repository Collaboration Final Closure',
    status: closed ? 'closed' : 'blocked',
    closed,
    operatorRunId,
    workflowName: aggregate.workflowName,
    scenario: aggregate.scenario,
    stateSource: aggregate.stateSource,
    stateStatus: aggregate.stateStatus,
    completedActionCount: aggregate.completedActionCount,
    pullRequestTitle: aggregate.pullRequestTitle,
    pullRequestSource: aggregate.pullRequestSource,
    pullRequestTarget: aggregate.pullRequestTarget,
    reviewMode: aggregate.reviewMode,
    mergePolicy: aggregate.mergePolicy,
    mainBranchStatus: aggregate.mainBranchStatus,
    mergeWindowStatus: aggregate.mergeWindowStatus,
    releaseArtifact,
    closureChecklist,
    checkCount: closureChecks.length,
    passedCheckCount: closureChecks.filter((check) => check.status === 'pass').length,
    blockedCheckCount: closureChecks.filter((check) => check.status === 'blocked').length,
    blockerCount: aggregate.blockers.length,
    closureDecision: closed ? 'Close Repository Collaboration v1.6' : 'Keep Repository Collaboration v1.6 open',
    closureSummary: closed
      ? 'Repository Collaboration v1.6 is closed with aggregate evidence and is ready for archive.'
      : 'Repository Collaboration v1.6 final closure waits for aggregate readiness.',
    closureChecks,
    closureEvidence: closed
      ? [
        `Aggregate status: ${aggregate.status}`,
        `Release artifact: ${releaseArtifact}`,
        `Closure checklist: ${closureChecklist}`,
        `Next workflow: Repository Collaboration v1.6 Closed`
      ]
      : aggregate.requiredEvidence,
    blockers: aggregate.blockers,
    nextWorkflow: closed ? 'Repository Collaboration v1.6 Closed' : aggregate.nextWorkflow
  };
}

export function createPullRequestReviewPackage(store, operatorRunId, options = {}) {
  const finalClosure = createRepositoryCollaborationFinalClosure(store, operatorRunId, options);
  const reviewReady = finalClosure.closed;
  const reviewChecklist = options.reviewChecklist || 'Pull Request Review Package v1.7 Checklist';
  const reviewSummaryArtifact = options.reviewSummaryArtifact || 'Pull Request Review Package v1.7 Summary';
  const reviewItems = [
    {
      label: 'Repository collaboration closed',
      status: finalClosure.closed ? 'ready' : 'blocked',
      detail: finalClosure.closureDecision
    },
    {
      label: 'Review checklist assigned',
      status: reviewReady ? 'ready' : 'blocked',
      detail: reviewChecklist
    },
    {
      label: 'Review summary assigned',
      status: reviewReady ? 'ready' : 'blocked',
      detail: reviewSummaryArtifact
    },
    {
      label: 'Main branch action held',
      status: reviewReady ? 'ready' : 'blocked',
      detail: reviewReady ? 'Main branch action waits for explicit operator approval.' : 'Main branch action remains blocked before review package readiness.'
    }
  ];

  return {
    title: 'Pull Request Review Package',
    status: reviewReady ? 'ready' : 'blocked',
    reviewReady,
    operatorRunId,
    workflowName: 'Mainline Release Readiness',
    scenario: finalClosure.scenario,
    stateSource: finalClosure.stateSource,
    stateStatus: finalClosure.stateStatus,
    completedActionCount: finalClosure.completedActionCount,
    pullRequestTitle: finalClosure.pullRequestTitle,
    pullRequestSource: finalClosure.pullRequestSource,
    pullRequestTarget: finalClosure.pullRequestTarget,
    reviewMode: reviewReady ? 'operator-review' : finalClosure.reviewMode,
    mergePolicy: reviewReady ? 'no-main-before-review' : finalClosure.mergePolicy,
    mainBranchStatus: finalClosure.mainBranchStatus,
    mergeWindowStatus: finalClosure.mergeWindowStatus,
    reviewChecklist,
    reviewSummaryArtifact,
    reviewItemCount: reviewItems.length,
    readyReviewItemCount: reviewItems.filter((item) => item.status === 'ready').length,
    blockedReviewItemCount: reviewItems.filter((item) => item.status === 'blocked').length,
    blockerCount: finalClosure.blockers.length,
    reviewDecision: reviewReady ? 'Prepare pull request review package' : 'Keep pull request review package blocked',
    reviewSummary: reviewReady
      ? 'Pull Request Review Package can summarize closed v1.6 evidence before mainline review.'
      : 'Pull Request Review Package waits for Repository Collaboration v1.6 final closure.',
    reviewItems,
    reviewEvidence: reviewReady
      ? [
        `Repository collaboration final closure: ${finalClosure.status}`,
        `Pull request title: ${finalClosure.pullRequestTitle}`,
        `Source branch: ${finalClosure.pullRequestSource}`,
        `Target branch: ${finalClosure.pullRequestTarget}`,
        `Review checklist: ${reviewChecklist}`
      ]
      : finalClosure.closureEvidence,
    blockers: finalClosure.blockers,
    nextWorkflow: reviewReady ? 'CI Evidence Summary' : finalClosure.nextWorkflow
  };
}

export function createCiEvidenceSummary(store, operatorRunId, options = {}) {
  const reviewPackage = createPullRequestReviewPackage(store, operatorRunId, options);
  const ciReady = reviewPackage.reviewReady;
  const ciCommand = options.ciCommand || 'npm run check:all';
  const ciStatus = ciReady ? 'passed' : 'blocked';
  const ciProvider = options.ciProvider || 'local-repository-gates';
  const evidenceItems = [
    {
      label: 'Review package ready',
      status: reviewPackage.reviewReady ? 'ready' : 'blocked',
      detail: reviewPackage.reviewDecision
    },
    {
      label: 'CI command assigned',
      status: ciReady ? 'passed' : 'blocked',
      detail: ciCommand
    },
    {
      label: 'CI provider scoped',
      status: ciReady ? 'passed' : 'blocked',
      detail: ciProvider
    },
    {
      label: 'Main merge held',
      status: ciReady ? 'held' : 'blocked',
      detail: ciReady ? 'Main merge waits for explicit merge plan approval.' : 'Main merge remains blocked before CI evidence.'
    }
  ];

  return {
    title: 'CI Evidence Summary',
    status: ciReady ? 'ready' : 'blocked',
    ciReady,
    operatorRunId,
    workflowName: reviewPackage.workflowName,
    scenario: reviewPackage.scenario,
    stateSource: reviewPackage.stateSource,
    stateStatus: reviewPackage.stateStatus,
    completedActionCount: reviewPackage.completedActionCount,
    pullRequestTitle: reviewPackage.pullRequestTitle,
    pullRequestSource: reviewPackage.pullRequestSource,
    pullRequestTarget: reviewPackage.pullRequestTarget,
    reviewMode: reviewPackage.reviewMode,
    mergePolicy: reviewPackage.mergePolicy,
    mainBranchStatus: reviewPackage.mainBranchStatus,
    mergeWindowStatus: reviewPackage.mergeWindowStatus,
    ciCommand,
    ciStatus,
    ciProvider,
    evidenceItemCount: evidenceItems.length,
    readyEvidenceItemCount: evidenceItems.filter((item) => item.status === 'ready' || item.status === 'passed' || item.status === 'held').length,
    blockedEvidenceItemCount: evidenceItems.filter((item) => item.status === 'blocked').length,
    blockerCount: reviewPackage.blockers.length,
    ciDecision: ciReady ? 'Prepare CI evidence summary' : 'Keep CI evidence summary blocked',
    ciSummary: ciReady
      ? 'CI Evidence Summary can cite pull request review package readiness and local repository gates.'
      : 'CI Evidence Summary waits for Pull Request Review Package readiness.',
    evidenceItems,
    ciEvidence: ciReady
      ? [
        `Pull request review package: ${reviewPackage.status}`,
        `CI command: ${ciCommand}`,
        `CI status: ${ciStatus}`,
        `CI provider: ${ciProvider}`
      ]
      : reviewPackage.reviewEvidence,
    blockers: reviewPackage.blockers,
    nextWorkflow: ciReady ? 'Main Merge Plan' : reviewPackage.nextWorkflow
  };
}

export function createMainMergePlan(store, operatorRunId, options = {}) {
  const ciEvidence = createCiEvidenceSummary(store, operatorRunId, options);
  const mergePlanReady = ciEvidence.ciReady && ciEvidence.ciStatus === 'passed' && ciEvidence.mainBranchStatus === 'protected';
  const mergeStrategy = options.mergeStrategy || 'reviewed-squash-merge';
  const rollbackPlan = options.rollbackPlan || 'restore codex/development-ready-v1.0 as recovery branch';
  const verificationCommand = options.verificationCommand || ciEvidence.ciCommand;
  const planItems = [
    {
      label: 'CI evidence ready',
      status: ciEvidence.ciReady ? 'ready' : 'blocked',
      detail: ciEvidence.ciDecision
    },
    {
      label: 'Merge strategy assigned',
      status: mergePlanReady ? 'ready' : 'blocked',
      detail: mergeStrategy
    },
    {
      label: 'Rollback plan assigned',
      status: mergePlanReady ? 'ready' : 'blocked',
      detail: rollbackPlan
    },
    {
      label: 'Main branch protected',
      status: mergePlanReady ? 'held' : 'blocked',
      detail: mergePlanReady ? 'Main merge still requires explicit operator approval.' : 'Main branch action remains blocked before merge plan readiness.'
    }
  ];

  return {
    title: 'Main Merge Plan',
    status: mergePlanReady ? 'ready' : 'blocked',
    mergePlanReady,
    operatorRunId,
    workflowName: ciEvidence.workflowName,
    scenario: ciEvidence.scenario,
    stateSource: ciEvidence.stateSource,
    stateStatus: ciEvidence.stateStatus,
    completedActionCount: ciEvidence.completedActionCount,
    pullRequestTitle: ciEvidence.pullRequestTitle,
    pullRequestSource: ciEvidence.pullRequestSource,
    pullRequestTarget: ciEvidence.pullRequestTarget,
    reviewMode: ciEvidence.reviewMode,
    mergePolicy: ciEvidence.mergePolicy,
    mainBranchStatus: ciEvidence.mainBranchStatus,
    mergeWindowStatus: ciEvidence.mergeWindowStatus,
    ciCommand: ciEvidence.ciCommand,
    ciStatus: ciEvidence.ciStatus,
    ciProvider: ciEvidence.ciProvider,
    mergeStrategy,
    rollbackPlan,
    verificationCommand,
    planItemCount: planItems.length,
    readyPlanItemCount: planItems.filter((item) => item.status === 'ready' || item.status === 'held').length,
    blockedPlanItemCount: planItems.filter((item) => item.status === 'blocked').length,
    blockerCount: ciEvidence.blockers.length,
    mergeDecision: mergePlanReady ? 'Prepare main merge plan' : 'Keep main merge plan blocked',
    mergeSummary: mergePlanReady
      ? 'Main Merge Plan can proceed to explicit operator approval without mutating main.'
      : 'Main Merge Plan waits for CI Evidence Summary readiness.',
    planItems,
    mergeEvidence: mergePlanReady
      ? [
        `CI evidence summary: ${ciEvidence.status}`,
        `Source branch: ${ciEvidence.pullRequestSource}`,
        `Target branch: ${ciEvidence.pullRequestTarget}`,
        `Merge strategy: ${mergeStrategy}`,
        `Verification command: ${verificationCommand}`
      ]
      : ciEvidence.ciEvidence,
    blockers: ciEvidence.blockers,
    nextWorkflow: mergePlanReady ? 'Release Tag Readiness' : ciEvidence.nextWorkflow
  };
}

export function createReleaseTagReadiness(store, operatorRunId, options = {}) {
  const mergePlan = createMainMergePlan(store, operatorRunId, options);
  const tagReady = mergePlan.mergePlanReady && mergePlan.nextWorkflow === 'Release Tag Readiness';
  const releaseVersion = options.releaseVersion || 'v1.7.0';
  const tagPolicy = options.tagPolicy || 'annotated-tag-after-main-merge';
  const releaseNotes = options.releaseNotes || 'Mainline Release Readiness v1.7 Release Notes';
  const tagChecklist = options.tagChecklist || 'Release Tag Readiness v1.7 Checklist';
  const tagItems = [
    {
      label: 'Main merge plan ready',
      status: mergePlan.mergePlanReady ? 'ready' : 'blocked',
      detail: mergePlan.mergeDecision
    },
    {
      label: 'Release version assigned',
      status: tagReady ? 'ready' : 'blocked',
      detail: releaseVersion
    },
    {
      label: 'Tag policy assigned',
      status: tagReady ? 'ready' : 'blocked',
      detail: tagPolicy
    },
    {
      label: 'Tag creation held',
      status: tagReady ? 'held' : 'blocked',
      detail: tagReady ? 'Tag creation waits for explicit post-merge operator approval.' : 'Tag creation remains blocked before release tag readiness.'
    }
  ];

  return {
    title: 'Release Tag Readiness',
    status: tagReady ? 'ready' : 'blocked',
    tagReady,
    operatorRunId,
    workflowName: mergePlan.workflowName,
    scenario: mergePlan.scenario,
    stateSource: mergePlan.stateSource,
    stateStatus: mergePlan.stateStatus,
    completedActionCount: mergePlan.completedActionCount,
    pullRequestTitle: mergePlan.pullRequestTitle,
    pullRequestSource: mergePlan.pullRequestSource,
    pullRequestTarget: mergePlan.pullRequestTarget,
    reviewMode: mergePlan.reviewMode,
    mergePolicy: mergePlan.mergePolicy,
    mainBranchStatus: mergePlan.mainBranchStatus,
    mergeWindowStatus: mergePlan.mergeWindowStatus,
    ciCommand: mergePlan.ciCommand,
    ciStatus: mergePlan.ciStatus,
    ciProvider: mergePlan.ciProvider,
    mergeStrategy: mergePlan.mergeStrategy,
    rollbackPlan: mergePlan.rollbackPlan,
    verificationCommand: mergePlan.verificationCommand,
    releaseVersion,
    tagPolicy,
    releaseNotes,
    tagChecklist,
    tagItemCount: tagItems.length,
    readyTagItemCount: tagItems.filter((item) => item.status === 'ready' || item.status === 'held').length,
    blockedTagItemCount: tagItems.filter((item) => item.status === 'blocked').length,
    blockerCount: mergePlan.blockers.length,
    tagDecision: tagReady ? 'Prepare release tag readiness' : 'Keep release tag readiness blocked',
    tagSummary: tagReady
      ? 'Release Tag Readiness can prepare tag evidence after main merge approval without creating a tag.'
      : 'Release Tag Readiness waits for Main Merge Plan readiness.',
    tagItems,
    tagEvidence: tagReady
      ? [
        `Main merge plan: ${mergePlan.status}`,
        `Release version: ${releaseVersion}`,
        `Tag policy: ${tagPolicy}`,
        `Release notes: ${releaseNotes}`,
        `Checklist: ${tagChecklist}`
      ]
      : mergePlan.mergeEvidence,
    blockers: mergePlan.blockers,
    nextWorkflow: tagReady ? 'Mainline Aggregate Summary' : mergePlan.nextWorkflow
  };
}

export function createMainlineAggregateSummary(store, operatorRunId, options = {}) {
  const tagReadiness = createReleaseTagReadiness(store, operatorRunId, options);
  const aggregateReady = tagReadiness.tagReady && tagReadiness.nextWorkflow === 'Mainline Aggregate Summary';
  const aggregateArtifact = options.aggregateArtifact || 'Mainline Release Readiness v1.7 Aggregate Summary';
  const closureChecklist = options.closureChecklist || 'Mainline Final Closure v1.7 Checklist';
  const workflowItems = [
    {
      label: 'Release tag readiness ready',
      status: tagReadiness.tagReady ? 'ready' : 'blocked',
      detail: tagReadiness.tagDecision
    },
    {
      label: 'Aggregate artifact assigned',
      status: aggregateReady ? 'ready' : 'blocked',
      detail: aggregateArtifact
    },
    {
      label: 'Closure checklist assigned',
      status: aggregateReady ? 'ready' : 'blocked',
      detail: closureChecklist
    },
    {
      label: 'Mainline closure held',
      status: aggregateReady ? 'held' : 'blocked',
      detail: aggregateReady ? 'Final closure waits for explicit release owner approval.' : 'Final closure remains blocked before aggregate readiness.'
    }
  ];

  return {
    title: 'Mainline Aggregate Summary',
    status: aggregateReady ? 'ready' : 'blocked',
    aggregateReady,
    operatorRunId,
    workflowName: tagReadiness.workflowName,
    scenario: tagReadiness.scenario,
    stateSource: tagReadiness.stateSource,
    stateStatus: tagReadiness.stateStatus,
    completedActionCount: tagReadiness.completedActionCount,
    pullRequestTitle: tagReadiness.pullRequestTitle,
    pullRequestSource: tagReadiness.pullRequestSource,
    pullRequestTarget: tagReadiness.pullRequestTarget,
    reviewMode: tagReadiness.reviewMode,
    mergePolicy: tagReadiness.mergePolicy,
    mainBranchStatus: tagReadiness.mainBranchStatus,
    mergeWindowStatus: tagReadiness.mergeWindowStatus,
    ciCommand: tagReadiness.ciCommand,
    ciStatus: tagReadiness.ciStatus,
    ciProvider: tagReadiness.ciProvider,
    mergeStrategy: tagReadiness.mergeStrategy,
    rollbackPlan: tagReadiness.rollbackPlan,
    verificationCommand: tagReadiness.verificationCommand,
    releaseVersion: tagReadiness.releaseVersion,
    tagPolicy: tagReadiness.tagPolicy,
    releaseNotes: tagReadiness.releaseNotes,
    tagChecklist: tagReadiness.tagChecklist,
    aggregateArtifact,
    closureChecklist,
    workflowItemCount: workflowItems.length,
    readyWorkflowItemCount: workflowItems.filter((item) => item.status === 'ready' || item.status === 'held').length,
    blockedWorkflowItemCount: workflowItems.filter((item) => item.status === 'blocked').length,
    blockerCount: tagReadiness.blockers.length,
    aggregateDecision: aggregateReady ? 'Prepare mainline aggregate summary' : 'Keep mainline aggregate summary blocked',
    aggregateSummary: aggregateReady
      ? 'Mainline Aggregate Summary can roll v1.7 review, CI, merge, and tag readiness evidence into final closure.'
      : 'Mainline Aggregate Summary waits for Release Tag Readiness.',
    workflowItems,
    aggregateEvidence: aggregateReady
      ? [
        `Release tag readiness: ${tagReadiness.status}`,
        `Release version: ${tagReadiness.releaseVersion}`,
        `Aggregate artifact: ${aggregateArtifact}`,
        `Closure checklist: ${closureChecklist}`,
        `Next workflow: Mainline Final Closure`
      ]
      : tagReadiness.tagEvidence,
    blockers: tagReadiness.blockers,
    nextWorkflow: aggregateReady ? 'Mainline Final Closure' : tagReadiness.nextWorkflow
  };
}

export function createMainlineFinalClosure(store, operatorRunId, options = {}) {
  const aggregate = createMainlineAggregateSummary(store, operatorRunId, options);
  const closed = aggregate.aggregateReady && aggregate.nextWorkflow === 'Mainline Final Closure';
  const finalReleaseNotes = options.finalReleaseNotes || 'Mainline Release Readiness v1.7 Final Release Notes';
  const archiveChecklist = options.archiveChecklist || 'Mainline Release Readiness v1.7 Archive Checklist';
  const closureChecks = [
    {
      label: 'Aggregate summary ready',
      status: aggregate.aggregateReady ? 'pass' : 'blocked',
      detail: aggregate.aggregateDecision
    },
    {
      label: 'Final release notes assigned',
      status: closed ? 'pass' : 'blocked',
      detail: finalReleaseNotes
    },
    {
      label: 'Archive checklist assigned',
      status: closed ? 'pass' : 'blocked',
      detail: archiveChecklist
    },
    {
      label: 'Mainline workstream closed',
      status: closed ? 'pass' : 'blocked',
      detail: closed ? 'Mainline Release Readiness v1.7 can close before repository archive.' : 'Mainline Release Readiness v1.7 remains open before final closure.'
    }
  ];

  return {
    title: 'Mainline Final Closure',
    status: closed ? 'closed' : 'blocked',
    closed,
    operatorRunId,
    workflowName: aggregate.workflowName,
    scenario: aggregate.scenario,
    stateSource: aggregate.stateSource,
    stateStatus: aggregate.stateStatus,
    completedActionCount: aggregate.completedActionCount,
    pullRequestTitle: aggregate.pullRequestTitle,
    pullRequestSource: aggregate.pullRequestSource,
    pullRequestTarget: aggregate.pullRequestTarget,
    reviewMode: aggregate.reviewMode,
    mergePolicy: aggregate.mergePolicy,
    mainBranchStatus: aggregate.mainBranchStatus,
    mergeWindowStatus: aggregate.mergeWindowStatus,
    ciCommand: aggregate.ciCommand,
    ciStatus: aggregate.ciStatus,
    ciProvider: aggregate.ciProvider,
    mergeStrategy: aggregate.mergeStrategy,
    rollbackPlan: aggregate.rollbackPlan,
    verificationCommand: aggregate.verificationCommand,
    releaseVersion: aggregate.releaseVersion,
    tagPolicy: aggregate.tagPolicy,
    releaseNotes: aggregate.releaseNotes,
    tagChecklist: aggregate.tagChecklist,
    aggregateArtifact: aggregate.aggregateArtifact,
    closureChecklist: aggregate.closureChecklist,
    finalReleaseNotes,
    archiveChecklist,
    checkCount: closureChecks.length,
    passedCheckCount: closureChecks.filter((check) => check.status === 'pass').length,
    blockedCheckCount: closureChecks.filter((check) => check.status === 'blocked').length,
    blockerCount: aggregate.blockers.length,
    closureDecision: closed ? 'Close Mainline Release Readiness v1.7' : 'Keep Mainline Release Readiness v1.7 open',
    closureSummary: closed
      ? 'Mainline Release Readiness v1.7 is closed with aggregate evidence and is ready for archive.'
      : 'Mainline Final Closure waits for Mainline Aggregate Summary readiness.',
    closureChecks,
    closureEvidence: closed
      ? [
        `Aggregate summary: ${aggregate.status}`,
        `Final release notes: ${finalReleaseNotes}`,
        `Archive checklist: ${archiveChecklist}`,
        `Next workflow: Mainline Release Readiness v1.7 Closed`
      ]
      : aggregate.aggregateEvidence,
    blockers: aggregate.blockers,
    nextWorkflow: closed ? 'Mainline Release Readiness v1.7 Closed' : aggregate.nextWorkflow
  };
}

export function createOperatorRunbookExecution(store, operatorRunId) {
  const run = createOperatorRunSummary(store, operatorRunId);
  const currentActionDone = run.currentActionStatus === 'complete' || run.currentActionStatus === 'ready';
  const runReady = run.status === 'ready' || run.status === 'complete';

  return {
    title: 'Operator Runbook Execution',
    runId: run.id,
    status: runReady ? 'ready' : 'blocked',
    objective: run.objective,
    owner: run.owner,
    currentActionId: run.currentActionId,
    currentActionStatus: run.currentActionStatus,
    handoffId: run.handoffId,
    steps: [
      {
        label: 'Confirm operator objective',
        status: 'complete',
        detail: run.objective
      },
      {
        label: 'Inspect current action',
        status: currentActionDone ? 'complete' : 'active',
        detail: `${run.currentActionId} is ${run.currentActionStatus}`
      },
      {
        label: 'Resolve current action',
        status: currentActionDone ? 'complete' : 'blocked',
        detail: run.nextActionLabel
      },
      {
        label: 'Verify handoff context',
        status: runReady ? 'active' : 'blocked',
        detail: `Handoff ${run.handoffId} waits for ${run.auditEventCount} audit events`
      },
      {
        label: 'Close operator run',
        status: run.status === 'complete' ? 'complete' : 'blocked',
        detail: `Run status is ${run.status}`
      }
    ]
  };
}

export function createHandoffAcceptance(store, operatorRunId) {
  const runbook = createOperatorRunbookExecution(store, operatorRunId);
  const accepted = runbook.status === 'ready';

  return {
    title: 'Handoff Acceptance',
    runId: runbook.runId,
    handoffId: runbook.handoffId,
    status: accepted ? 'accepted' : 'blocked',
    decision: accepted ? 'Accept handoff context' : 'Resolve runbook blockers before acceptance',
    accepted,
    requiredEvidence: [
      `Current action ${runbook.currentActionId} is ${runbook.currentActionStatus}`,
      `Runbook status is ${runbook.status}`,
      `Handoff ${runbook.handoffId} is linked`
    ],
    blockedReasons: accepted
      ? []
      : runbook.steps
        .filter((step) => step.status === 'blocked')
        .map((step) => `${step.label}: ${step.detail}`),
    nextWorkflow: accepted ? 'Use Context Pack' : 'Operator Runbook Execution'
  };
}

export function createAgentHandoffContext(store, operatorRunId, contextPackId = 'context_pack_example_001') {
  const handoff = createHandoffAcceptance(store, operatorRunId);
  const contextPack = createContextPackUsageFlow(store, contextPackId);
  const readyForAgent = handoff.accepted;

  return {
    title: 'Agent Handoff Context',
    operatorRunId: handoff.runId,
    handoffId: handoff.handoffId,
    status: readyForAgent ? 'ready' : 'blocked',
    readyForAgent,
    accepted: handoff.accepted,
    contextPackId: contextPack.id,
    contextPackStatus: contextPack.status,
    taskType: contextPack.taskType,
    intendedAudience: contextPack.intendedAudience,
    sourceCount: contextPack.includedClaimCount + contextPack.includedDecisionCount,
    contextSources: [
      'Handoff Acceptance',
      'Operator Runbook Execution',
      'Context Pack usage flow'
    ],
    taskBoundary: readyForAgent
      ? `Use ${contextPack.id} for ${contextPack.taskType}.`
      : 'Do not start agent work until handoff acceptance is ready.',
    requiredEvidence: handoff.requiredEvidence,
    blockedReasons: handoff.blockedReasons,
    agentInstructions: readyForAgent
      ? [
        'Use accepted handoff context only.',
        `Load Context Pack ${contextPack.id} before drafting.`,
        `Respect exclusions: ${contextPack.excludedTopics.join(', ')}.`
      ]
      : [
        'Wait for accepted handoff before agent work.',
        'Route blockers back to Operator Runbook Execution.',
        'Do not infer missing source context from chat history.'
      ],
    nextWorkflow: handoff.nextWorkflow,
    nextAgent: readyForAgent ? 'AI writing agent' : 'Operator'
  };
}

export function createAgentPromptPlan(store, operatorRunId, contextPackId = 'context_pack_example_001') {
  const context = createAgentHandoffContext(store, operatorRunId, contextPackId);
  const promptAllowed = context.readyForAgent;

  return {
    title: 'Agent Prompt Plan',
    status: promptAllowed ? 'ready' : 'blocked',
    promptAllowed,
    operatorRunId: context.operatorRunId,
    handoffId: context.handoffId,
    contextPackId: context.contextPackId,
    agent: context.nextAgent,
    taskType: context.taskType,
    objective: promptAllowed
      ? `Draft ${context.taskType} output using ${context.contextPackId}.`
      : 'Resolve accepted handoff before prompt planning.',
    sourcePolicy: promptAllowed
      ? 'Repository context only: accepted handoff and Context Pack sources.'
      : 'Prompt plan is blocked; do not use chat history as fallback context.',
    promptSections: promptAllowed
      ? [
        'Objective',
        'Accepted source context',
        'Task boundary',
        'Required evidence',
        'Agent instructions',
        'Output constraints'
      ]
      : [
        'Blocked state',
        'Required operator resolution',
        'Missing accepted handoff evidence'
      ],
    guardrails: promptAllowed
      ? [
        'Use accepted handoff context only.',
        'Cite repository-backed claims and decisions when drafting.',
        'Respect Context Pack exclusions.'
      ]
      : [
        'Do not draft.',
        'Return blockers to Operator Runbook Execution.',
        'Wait for ready Agent Handoff Context.'
      ],
    blockers: context.blockedReasons,
    nextWorkflow: promptAllowed ? 'Agent Draft Execution' : context.nextWorkflow
  };
}

export function createAgentDraftExecution(store, operatorRunId, contextPackId = 'context_pack_example_001') {
  const promptPlan = createAgentPromptPlan(store, operatorRunId, contextPackId);
  const contextPack = requireRecord(store, 'context-pack', contextPackId);
  const brandProfile = store.list('brand-profile').find((profile) => profile.workspaceId === contextPack.workspaceId);
  const claims = contextPack.includedClaims.map((claimId) => requireRecord(store, 'claim', claimId));
  const decisions = contextPack.includedDecisions.map((decisionId) => requireRecord(store, 'decision', decisionId));
  const draftAllowed = promptPlan.promptAllowed;
  const primaryClaim = claims[0]?.statement ?? brandProfile?.positioning.promise ?? 'No approved claim available.';
  const primaryDecision = decisions[0]?.title ?? 'No accepted decision available.';

  return {
    title: 'Agent Draft Execution',
    status: draftAllowed ? 'ready' : 'blocked',
    draftAllowed,
    agent: promptPlan.agent,
    operatorRunId: promptPlan.operatorRunId,
    handoffId: promptPlan.handoffId,
    contextPackId: promptPlan.contextPackId,
    taskType: promptPlan.taskType,
    sourcePolicy: promptPlan.sourcePolicy,
    draftTitle: draftAllowed ? `${brandProfile?.name ?? 'Brand'} ${promptPlan.taskType} draft` : 'Draft blocked',
    draftBody: draftAllowed
      ? `${brandProfile?.name ?? 'Brand'} helps ${brandProfile?.audience.primary ?? 'approved audiences'} ${brandProfile?.positioning.promise.toLowerCase() ?? primaryClaim.toLowerCase()}`
      : '',
    evidenceCitations: draftAllowed
      ? [
        `Claim ${claims[0]?.id ?? 'none'}: ${primaryClaim}`,
        `Decision ${decisions[0]?.id ?? 'none'}: ${primaryDecision}`,
        `Context Pack ${contextPack.id}: ${contextPack.name}`
      ]
      : [],
    qualityChecks: draftAllowed
      ? [
        { label: 'Accepted handoff present', status: 'pass' },
        { label: 'Prompt plan allowed', status: 'pass' },
        { label: 'Repository citations attached', status: 'pass' }
      ]
      : [
        { label: 'Accepted handoff present', status: 'blocked' },
        { label: 'Prompt plan allowed', status: 'blocked' },
        { label: 'Repository citations attached', status: 'blocked' }
      ],
    blockers: promptPlan.blockers,
    nextWorkflow: draftAllowed ? 'Draft Review' : promptPlan.nextWorkflow
  };
}

export function createDraftReview(store, operatorRunId, contextPackId = 'context_pack_example_001') {
  const draftExecution = createAgentDraftExecution(store, operatorRunId, contextPackId);
  const citationChecksPassed = draftExecution.evidenceCitations.length >= 3;
  const qualityChecksPassed = draftExecution.qualityChecks.every((check) => check.status === 'pass');
  const approved = draftExecution.draftAllowed && citationChecksPassed && qualityChecksPassed;

  return {
    title: 'Draft Review',
    status: approved ? 'approved' : 'blocked',
    approved,
    operatorRunId: draftExecution.operatorRunId,
    handoffId: draftExecution.handoffId,
    contextPackId: draftExecution.contextPackId,
    draftTitle: draftExecution.draftTitle,
    reviewDecision: approved ? 'Approve draft for handoff closure' : 'Block draft until execution is ready',
    reviewSummary: approved
      ? 'Draft includes repository citations and passes required quality checks.'
      : 'Draft review waits for allowed draft execution.',
    requiredEvidence: approved
      ? [
        `Draft title: ${draftExecution.draftTitle}`,
        `Citation count: ${draftExecution.evidenceCitations.length}`,
        `Quality checks passed: ${draftExecution.qualityChecks.length}`
      ]
      : [
        'Draft body is not available.',
        'Repository citations are missing.',
        'Quality checks are blocked.'
      ],
    reviewChecks: [
      { label: 'Draft body present', status: draftExecution.draftBody ? 'pass' : 'blocked' },
      { label: 'Repository citations present', status: citationChecksPassed ? 'pass' : 'blocked' },
      { label: 'Quality checks passed', status: qualityChecksPassed ? 'pass' : 'blocked' }
    ],
    blockers: draftExecution.blockers,
    nextWorkflow: approved ? 'Agent Handoff Closure' : draftExecution.nextWorkflow
  };
}

export function createAgentHandoffClosure(store, operatorRunId, contextPackId = 'context_pack_example_001') {
  const draftReview = createDraftReview(store, operatorRunId, contextPackId);
  const closed = draftReview.approved;

  return {
    title: 'Agent Handoff Closure',
    status: closed ? 'closed' : 'blocked',
    closed,
    operatorRunId: draftReview.operatorRunId,
    handoffId: draftReview.handoffId,
    contextPackId: draftReview.contextPackId,
    closureDecision: closed ? 'Close agent handoff' : 'Keep agent handoff open',
    closureSummary: closed
      ? 'Agent handoff is closed with approved draft review evidence.'
      : 'Agent handoff closure waits for approved Draft Review.',
    closedArtifacts: closed
      ? [
        draftReview.draftTitle,
        'Draft Review evidence',
        'Repository citation trail'
      ]
      : [],
    closureEvidence: closed
      ? [
        `Draft review status: ${draftReview.status}`,
        `Draft review decision: ${draftReview.reviewDecision}`,
        `Required evidence count: ${draftReview.requiredEvidence.length}`
      ]
      : draftReview.requiredEvidence,
    closureChecks: [
      { label: 'Draft review approved', status: draftReview.approved ? 'pass' : 'blocked' },
      { label: 'Required evidence present', status: draftReview.requiredEvidence.length > 0 ? 'pass' : 'blocked' },
      { label: 'Next workflow assigned', status: draftReview.nextWorkflow ? 'pass' : 'blocked' }
    ],
    blockers: draftReview.blockers,
    nextWorkflow: closed ? 'Agent Handoff Runtime Summary' : draftReview.nextWorkflow
  };
}

export function createAgentHandoffRuntimeSummary(store, operatorRunId, contextPackId = 'context_pack_example_001') {
  const handoffContext = createAgentHandoffContext(store, operatorRunId, contextPackId);
  const promptPlan = createAgentPromptPlan(store, operatorRunId, contextPackId);
  const draftExecution = createAgentDraftExecution(store, operatorRunId, contextPackId);
  const draftReview = createDraftReview(store, operatorRunId, contextPackId);
  const handoffClosure = createAgentHandoffClosure(store, operatorRunId, contextPackId);
  const stages = [
    { label: 'Agent Handoff Context', status: handoffContext.status },
    { label: 'Agent Prompt Plan', status: promptPlan.status },
    { label: 'Agent Draft Execution', status: draftExecution.status },
    { label: 'Draft Review', status: draftReview.status },
    { label: 'Agent Handoff Closure', status: handoffClosure.status }
  ];
  const closed = handoffClosure.closed;

  return {
    title: 'Agent Handoff Runtime Summary',
    status: closed ? 'complete' : 'blocked',
    complete: closed,
    operatorRunId,
    handoffId: handoffClosure.handoffId,
    contextPackId,
    stageCount: stages.length,
    completedStageCount: stages.filter((stage) => ['ready', 'approved', 'closed'].includes(stage.status)).length,
    blockedStageCount: stages.filter((stage) => stage.status === 'blocked').length,
    finalDecision: closed ? 'Agent handoff runtime complete' : 'Agent handoff runtime blocked',
    finalSummary: closed
      ? 'All Agent Handoff Runtime stages are closed with repository-backed evidence.'
      : 'Agent Handoff Runtime waits for upstream handoff readiness.',
    stages,
    evidence: closed
      ? [
        `Closure status: ${handoffClosure.status}`,
        `Closed artifacts: ${handoffClosure.closedArtifacts.length}`,
        `Closure evidence count: ${handoffClosure.closureEvidence.length}`
      ]
      : handoffClosure.closureEvidence,
    blockers: handoffClosure.blockers,
    nextWorkflow: closed ? 'Agent Handoff Runtime Aggregate Summary' : handoffClosure.nextWorkflow
  };
}

export function createAgentHandoffRuntimeAggregateSummary(store, operatorRunId, contextPackId = 'context_pack_example_001') {
  const runtimeSummary = createAgentHandoffRuntimeSummary(store, operatorRunId, contextPackId);
  const complete = runtimeSummary.complete;
  const runtimeItems = [
    {
      label: runtimeSummary.title,
      status: runtimeSummary.status,
      completedStages: runtimeSummary.completedStageCount,
      totalStages: runtimeSummary.stageCount
    }
  ];

  return {
    title: 'Agent Handoff Runtime Aggregate Summary',
    status: complete ? 'complete' : 'blocked',
    complete,
    operatorRunId,
    handoffId: runtimeSummary.handoffId,
    contextPackId,
    runtimeCount: runtimeItems.length,
    completeRuntimeCount: runtimeItems.filter((item) => item.status === 'complete').length,
    blockedRuntimeCount: runtimeItems.filter((item) => item.status === 'blocked').length,
    completedStageCount: runtimeItems.reduce((total, item) => total + item.completedStages, 0),
    totalStageCount: runtimeItems.reduce((total, item) => total + item.totalStages, 0),
    aggregateDecision: complete ? 'Close Agent Handoff Runtime v1.2 aggregate' : 'Keep Agent Handoff Runtime v1.2 aggregate open',
    aggregateSummary: complete
      ? 'Agent Handoff Runtime v1.2 has a complete runtime summary and is ready for final closure.'
      : 'Agent Handoff Runtime v1.2 aggregate waits for runtime summary completion.',
    runtimeItems,
    evidence: complete
      ? [
        `Runtime summary status: ${runtimeSummary.status}`,
        `Runtime stages complete: ${runtimeSummary.completedStageCount}/${runtimeSummary.stageCount}`,
        `Runtime evidence count: ${runtimeSummary.evidence.length}`
      ]
      : runtimeSummary.evidence,
    blockers: runtimeSummary.blockers,
    nextWorkflow: complete ? 'Agent Handoff Runtime Final Closure' : runtimeSummary.nextWorkflow
  };
}

export function createAgentHandoffRuntimeFinalClosure(store, operatorRunId, contextPackId = 'context_pack_example_001') {
  const aggregateSummary = createAgentHandoffRuntimeAggregateSummary(store, operatorRunId, contextPackId);
  const closed = aggregateSummary.complete;

  return {
    title: 'Agent Handoff Runtime Final Closure',
    status: closed ? 'closed' : 'blocked',
    closed,
    operatorRunId,
    handoffId: aggregateSummary.handoffId,
    contextPackId,
    closureDecision: closed ? 'Close Agent Handoff Runtime v1.2' : 'Keep Agent Handoff Runtime v1.2 open',
    closureSummary: closed
      ? 'Agent Handoff Runtime v1.2 is closed with aggregate evidence and is ready for archive.'
      : 'Agent Handoff Runtime v1.2 final closure waits for aggregate completion.',
    releaseArtifacts: closed
      ? [
        'Agent Handoff Runtime Summary',
        'Agent Handoff Runtime Aggregate Summary',
        'Agent Handoff Runtime v1.2 closure evidence'
      ]
      : [],
    closureEvidence: closed
      ? [
        `Aggregate status: ${aggregateSummary.status}`,
        `Aggregate runtimes complete: ${aggregateSummary.completeRuntimeCount}/${aggregateSummary.runtimeCount}`,
        `Aggregate stages complete: ${aggregateSummary.completedStageCount}/${aggregateSummary.totalStageCount}`
      ]
      : aggregateSummary.evidence,
    closureChecks: [
      { label: 'Aggregate summary complete', status: aggregateSummary.complete ? 'pass' : 'blocked' },
      { label: 'Runtime evidence present', status: aggregateSummary.evidence.length > 0 ? 'pass' : 'blocked' },
      { label: 'Release artifacts assigned', status: closed ? 'pass' : 'blocked' }
    ],
    blockers: aggregateSummary.blockers,
    nextWorkflow: closed ? 'Agent Handoff Runtime v1.2 Closed' : aggregateSummary.nextWorkflow
  };
}

export function createRuntimeHealthSummary(store, operatorRunId, options = {}) {
  const contextPackId = options.contextPackId ?? 'context_pack_example_001';
  const readiness = evaluateContextPackReadiness(store, contextPackId);
  const finalClosure = createAgentHandoffRuntimeFinalClosure(store, operatorRunId, contextPackId);
  const stateSource = options.stateSource ?? 'example';
  const stateStatus = options.stateStatus ?? 'not-loaded';
  const completedActionCount = options.completedActionCount ?? 0;
  const completedActionIds = options.completedActionIds ?? [];
  const stateReliable = stateSource !== 'example' && completedActionCount > 0;
  const runtimeClosed = finalClosure.closed;
  const healthy = readiness.ready && runtimeClosed && stateReliable;

  return {
    title: 'Runtime Health Summary',
    status: healthy ? 'healthy' : 'attention',
    healthy,
    operatorRunId,
    contextPackId,
    stateSource,
    stateStatus,
    completedActionCount,
    completedActionIds,
    readinessStatus: readiness.ready ? 'ready' : 'blocked',
    readinessBlockerCount: readiness.blockingReasons.length,
    runtimeClosureStatus: finalClosure.status,
    runtimeClosed,
    healthDecision: healthy ? 'Runtime is reliable for repeated local use' : 'Runtime needs operator attention before repeated local use',
    healthSummary: healthy
      ? 'Studio state, workflow action history, and runtime closure are aligned.'
      : 'Runtime health waits for ready context, closed runtime evidence, or durable workflow action state.',
    signals: [
      { label: 'Context readiness', status: readiness.ready ? 'pass' : 'attention', detail: `${readiness.blockingReasons.length} blockers` },
      { label: 'Runtime final closure', status: runtimeClosed ? 'pass' : 'attention', detail: finalClosure.status },
      { label: 'Workflow action state', status: stateReliable ? 'pass' : 'attention', detail: `${stateSource} with ${completedActionCount} completed actions` }
    ],
    recoveryActions: healthy
      ? [
        'Keep current Studio state for repeated local runs.',
        'Use ready scenario as the reliability baseline.'
      ]
      : [
        'Resolve readiness blockers before relying on runtime output.',
        'Complete or reload Workflow Action state.',
        'Re-run full validation after state changes.'
      ],
    blockers: [
      ...readiness.blockingReasons,
      ...finalClosure.blockers,
      ...(stateReliable ? [] : ['Workflow Action state is not durable for repeated local use.'])
    ],
    nextWorkflow: healthy ? 'Studio State Recovery' : readiness.ready ? finalClosure.nextWorkflow : 'Review Resolution Workflow'
  };
}

export function createStudioStateRecovery(store, operatorRunId, options = {}) {
  const runtimeHealth = createRuntimeHealthSummary(store, operatorRunId, options);
  const recoveryReady = runtimeHealth.healthy;
  const recoverySteps = recoveryReady
    ? [
      { label: 'Preserve current Studio state', status: 'complete', detail: 'Current state is reliable for repeated local runs.' },
      { label: 'Use ready scenario baseline', status: 'active', detail: 'Ready scenario can remain the local reliability baseline.' }
    ]
    : runtimeHealth.recoveryActions.map((action, index) => ({
      label: `Recovery action ${index + 1}`,
      status: index === 0 ? 'active' : 'pending',
      detail: action
    }));

  return {
    title: 'Studio State Recovery',
    status: recoveryReady ? 'ready' : 'needs-recovery',
    recoveryReady,
    operatorRunId,
    contextPackId: runtimeHealth.contextPackId,
    stateSource: runtimeHealth.stateSource,
    stateStatus: runtimeHealth.stateStatus,
    completedActionCount: runtimeHealth.completedActionCount,
    recoveryDecision: recoveryReady ? 'Keep current Studio state' : 'Recover Studio state before repeated local use',
    recoverySummary: recoveryReady
      ? 'Studio state is reliable and can be reused as the local ready baseline.'
      : 'Studio state recovery must resolve runtime health attention signals.',
    recoverySteps,
    requiredEvidence: recoveryReady
      ? [
        `Runtime health status: ${runtimeHealth.status}`,
        `Completed actions: ${runtimeHealth.completedActionCount}`,
        `Runtime closure: ${runtimeHealth.runtimeClosureStatus}`
      ]
      : runtimeHealth.signals.map((signal) => `${signal.label}: ${signal.status} - ${signal.detail}`),
    blockers: runtimeHealth.blockers,
    nextWorkflow: recoveryReady ? 'Runtime Validation Signals' : runtimeHealth.nextWorkflow
  };
}

export function createRuntimeValidationSignals(store, operatorRunId, options = {}) {
  const recovery = createStudioStateRecovery(store, operatorRunId, options);
  const validationReady = recovery.recoveryReady;
  const validationSignals = validationReady
    ? [
      { label: 'Studio state recovery', status: 'pass', detail: recovery.status },
      { label: 'Reusable state baseline', status: 'pass', detail: recovery.recoveryDecision },
      { label: 'Validation evidence', status: 'pass', detail: `${recovery.requiredEvidence.length} evidence items` }
    ]
    : [
      { label: 'Studio state recovery', status: 'attention', detail: recovery.status },
      { label: 'Reusable state baseline', status: 'blocked', detail: recovery.recoveryDecision },
      { label: 'Validation evidence', status: 'attention', detail: `${recovery.requiredEvidence.length} evidence items` }
    ];

  return {
    title: 'Runtime Validation Signals',
    status: validationReady ? 'ready' : 'blocked',
    validationReady,
    operatorRunId,
    contextPackId: recovery.contextPackId,
    stateSource: recovery.stateSource,
    stateStatus: recovery.stateStatus,
    completedActionCount: recovery.completedActionCount,
    validationDecision: validationReady ? 'Runtime validation signals are ready' : 'Runtime validation waits for Studio state recovery',
    validationSummary: validationReady
      ? 'Studio can use repeatable validation signals for local runtime confidence.'
      : 'Runtime validation signals are blocked until recovery evidence is ready.',
    validationSignals,
    validationCommands: [
      'npm run check:runtime-reliability',
      'npm run check:studio-render',
      'npm run check:studio-build',
      'npm run check:all'
    ],
    requiredEvidence: recovery.requiredEvidence,
    blockers: recovery.blockers,
    nextWorkflow: validationReady ? 'Runtime Reliability Closure' : recovery.nextWorkflow
  };
}

export function createOperatorRecoveryGuidance(store, operatorRunId, options = {}) {
  const validation = createRuntimeValidationSignals(store, operatorRunId, options);
  const guidanceReady = validation.validationReady;
  const guidanceSteps = guidanceReady
    ? [
      { label: 'Keep runtime baseline', status: 'complete', detail: 'Validation signals are ready for repeated local runs.' },
      { label: 'Prepare reliability closure', status: 'active', detail: 'Runtime Reliability v1.3 can move toward aggregate release evidence.' }
    ]
    : [
      { label: 'Review validation blockers', status: 'active', detail: validation.blockers[0] ?? 'Runtime validation is blocked.' },
      { label: 'Run recovery commands', status: 'pending', detail: validation.validationCommands.join(', ') },
      { label: 'Recheck validation signals', status: 'pending', detail: 'Repeat validation after state recovery is complete.' }
    ];

  return {
    title: 'Operator Recovery Guidance',
    status: guidanceReady ? 'ready' : 'action-required',
    guidanceReady,
    operatorRunId,
    contextPackId: validation.contextPackId,
    stateSource: validation.stateSource,
    stateStatus: validation.stateStatus,
    completedActionCount: validation.completedActionCount,
    guidanceDecision: guidanceReady ? 'Continue with runtime reliability closure' : 'Follow recovery guidance before closure',
    guidanceSummary: guidanceReady
      ? 'Operator recovery guidance confirms the local runtime baseline is reusable.'
      : 'Operator recovery guidance explains the manual steps needed before runtime closure.',
    guidanceSteps,
    validationSignals: validation.validationSignals,
    recommendedCommands: validation.validationCommands,
    requiredEvidence: validation.requiredEvidence,
    blockers: validation.blockers,
    nextWorkflow: guidanceReady ? 'Runtime Reliability Aggregate Summary' : validation.nextWorkflow
  };
}

export function createWorkflowSessionSummary(store, operatorRunId, options = {}) {
  const contextPackId = options.contextPackId ?? 'context_pack_example_001';
  const readiness = evaluateContextPackReadiness(store, contextPackId);
  const guidance = createOperatorRecoveryGuidance(store, operatorRunId, options);
  const scenario = readiness.ready ? 'ready' : 'blocked';
  const currentStep = readiness.ready ? 'ready-for-use' : 'resolve-review';
  const nextRoute = readiness.ready ? 'ready.html' : 'index.html';
  const sessionReady = readiness.ready && guidance.guidanceReady;

  return {
    title: 'Workflow Session Summary',
    status: sessionReady ? 'ready' : 'blocked',
    sessionReady,
    operatorRunId,
    contextPackId,
    workflowName: 'Context Pack workflow',
    scenario,
    currentStep,
    actionStatus: readiness.nextActions[0]?.status ?? 'ready',
    stateSource: guidance.stateSource,
    stateStatus: guidance.stateStatus,
    completedActionCount: guidance.completedActionCount,
    sessionDecision: sessionReady ? 'Continue workflow session' : 'Resolve workflow session blockers',
    sessionSummary: sessionReady
      ? 'Workflow session is ready with reusable state and clear next route.'
      : 'Workflow session is blocked until readiness and recovery guidance are resolved.',
    nextRoute,
    nextWorkflow: sessionReady ? 'Workflow Transition Plan' : guidance.nextWorkflow,
    sessionSignals: [
      { label: 'Context readiness', status: readiness.ready ? 'pass' : 'blocked', detail: `${readiness.blockingReasons.length} blockers` },
      { label: 'Operator recovery guidance', status: guidance.guidanceReady ? 'pass' : 'attention', detail: guidance.status },
      { label: 'Workflow route', status: nextRoute ? 'pass' : 'blocked', detail: nextRoute }
    ],
    requiredEvidence: [
      `Scenario: ${scenario}`,
      `State source: ${guidance.stateSource}`,
      `Completed actions: ${guidance.completedActionCount}`
    ],
    blockers: [
      ...readiness.blockingReasons,
      ...guidance.blockers
    ]
  };
}

export function createWorkflowTransitionPlan(store, operatorRunId, options = {}) {
  const session = createWorkflowSessionSummary(store, operatorRunId, options);
  const transitionReady = session.sessionReady;
  const transitionSteps = transitionReady
    ? [
      { label: 'Confirm ready route', status: 'complete', detail: `Route ${session.nextRoute} is ready.` },
      { label: 'Open next workflow', status: 'active', detail: 'Workflow Transition Plan can move to Command Result Summary.' }
    ]
    : [
      { label: 'Hold blocked route', status: 'active', detail: `Stay on ${session.nextRoute} until blockers are resolved.` },
      { label: 'Resolve session blockers', status: 'pending', detail: session.blockers[0] ?? 'Workflow session is blocked.' },
      { label: 'Rebuild transition plan', status: 'pending', detail: 'Repeat transition planning after session readiness changes.' }
    ];

  return {
    title: 'Workflow Transition Plan',
    status: transitionReady ? 'ready' : 'blocked',
    transitionReady,
    operatorRunId,
    contextPackId: session.contextPackId,
    workflowName: session.workflowName,
    scenario: session.scenario,
    currentStep: session.currentStep,
    fromRoute: session.scenario === 'ready' ? 'index.html' : session.nextRoute,
    toRoute: session.nextRoute,
    stateSource: session.stateSource,
    stateStatus: session.stateStatus,
    completedActionCount: session.completedActionCount,
    transitionDecision: transitionReady ? 'Proceed to ready workflow route' : 'Stay on blocked workflow route',
    transitionSummary: transitionReady
      ? 'Workflow transition can continue because the session is ready.'
      : 'Workflow transition waits for session blockers to clear.',
    transitionSteps,
    transitionSignals: session.sessionSignals,
    requiredEvidence: session.requiredEvidence,
    blockers: session.blockers,
    nextWorkflow: transitionReady ? 'Command Result Summary' : session.nextWorkflow
  };
}

export function createCommandResultSummary(store, operatorRunId, options = {}) {
  const transition = createWorkflowTransitionPlan(store, operatorRunId, options);
  const commandComplete = transition.transitionReady;
  const commandResults = commandComplete
    ? [
      { label: 'Workflow route command', status: 'complete', detail: `${transition.fromRoute} -> ${transition.toRoute}` },
      { label: 'Reusable state command', status: 'complete', detail: `${transition.stateSource} state is ${transition.stateStatus}.` },
      { label: 'Operator next command', status: 'active', detail: 'Open Command Result Summary closure evidence.' }
    ]
    : [
      { label: 'Workflow route command', status: 'blocked', detail: `Route remains ${transition.toRoute}.` },
      { label: 'Session blocker command', status: 'active', detail: transition.blockers[0] ?? 'Workflow transition is blocked.' },
      { label: 'Retry command result', status: 'pending', detail: 'Repeat the command after transition blockers are resolved.' }
    ];

  return {
    title: 'Command Result Summary',
    status: commandComplete ? 'complete' : 'blocked',
    commandComplete,
    operatorRunId,
    contextPackId: transition.contextPackId,
    workflowName: transition.workflowName,
    scenario: transition.scenario,
    fromRoute: transition.fromRoute,
    toRoute: transition.toRoute,
    stateSource: transition.stateSource,
    stateStatus: transition.stateStatus,
    completedActionCount: transition.completedActionCount,
    commandDecision: commandComplete ? 'Command result can be accepted' : 'Command result waits for transition readiness',
    commandSummary: commandComplete
      ? 'Command result confirms the ready workflow route and reusable state evidence.'
      : 'Command result remains blocked until the workflow transition can proceed.',
    commandResults,
    transitionSignals: transition.transitionSignals,
    requiredEvidence: [
      ...transition.requiredEvidence,
      `Transition decision: ${transition.transitionDecision}`,
      `Transition route: ${transition.fromRoute} -> ${transition.toRoute}`
    ],
    blockers: transition.blockers,
    nextWorkflow: commandComplete ? 'Studio Workflow Runtime Aggregate Summary' : transition.nextWorkflow
  };
}

export function createStudioWorkflowRuntimeAggregateSummary(store, operatorRunId, options = {}) {
  const commandResult = createCommandResultSummary(store, operatorRunId, options);
  const aggregateReady = commandResult.commandComplete;
  const commandItems = [
    {
      label: commandResult.title,
      status: commandResult.status,
      scenario: commandResult.scenario,
      route: `${commandResult.fromRoute} -> ${commandResult.toRoute}`,
      resultCount: commandResult.commandResults.length
    }
  ];

  return {
    title: 'Studio Workflow Runtime Aggregate Summary',
    status: aggregateReady ? 'ready' : 'blocked',
    aggregateReady,
    operatorRunId,
    contextPackId: commandResult.contextPackId,
    workflowName: commandResult.workflowName,
    scenario: commandResult.scenario,
    stateSource: commandResult.stateSource,
    stateStatus: commandResult.stateStatus,
    completedActionCount: commandResult.completedActionCount,
    commandCount: commandItems.length,
    completeCommandCount: commandItems.filter((item) => item.status === 'complete').length,
    blockedCommandCount: commandItems.filter((item) => item.status === 'blocked').length,
    aggregateDecision: aggregateReady ? 'Aggregate Studio workflow runtime evidence' : 'Keep Studio workflow runtime aggregate blocked',
    aggregateSummary: aggregateReady
      ? 'Studio Workflow Runtime v1.4 has complete command result evidence and can move toward final closure.'
      : 'Studio Workflow Runtime v1.4 aggregate waits for command result completion.',
    commandItems,
    requiredEvidence: aggregateReady
      ? [
        `Command result status: ${commandResult.status}`,
        `Command route: ${commandResult.fromRoute} -> ${commandResult.toRoute}`,
        `Command evidence count: ${commandResult.requiredEvidence.length}`
      ]
      : commandResult.requiredEvidence,
    blockers: commandResult.blockers,
    nextWorkflow: aggregateReady ? 'Studio Workflow Runtime Final Closure' : commandResult.nextWorkflow
  };
}

export function createStudioWorkflowRuntimeFinalClosure(store, operatorRunId, options = {}) {
  const aggregateSummary = createStudioWorkflowRuntimeAggregateSummary(store, operatorRunId, options);
  const closed = aggregateSummary.aggregateReady;

  return {
    title: 'Studio Workflow Runtime Final Closure',
    status: closed ? 'closed' : 'blocked',
    closed,
    operatorRunId,
    contextPackId: aggregateSummary.contextPackId,
    workflowName: aggregateSummary.workflowName,
    scenario: aggregateSummary.scenario,
    stateSource: aggregateSummary.stateSource,
    stateStatus: aggregateSummary.stateStatus,
    completedActionCount: aggregateSummary.completedActionCount,
    closureDecision: closed ? 'Close Studio Workflow Runtime v1.4' : 'Keep Studio Workflow Runtime v1.4 open',
    closureSummary: closed
      ? 'Studio Workflow Runtime v1.4 is closed with aggregate command evidence and is ready for archive.'
      : 'Studio Workflow Runtime v1.4 final closure waits for aggregate readiness.',
    releaseArtifacts: closed
      ? [
        'Workflow Session Summary',
        'Workflow Transition Plan',
        'Command Result Summary',
        'Studio Workflow Runtime Aggregate Summary'
      ]
      : [],
    closureEvidence: closed
      ? [
        `Aggregate status: ${aggregateSummary.status}`,
        `Aggregate commands complete: ${aggregateSummary.completeCommandCount}/${aggregateSummary.commandCount}`,
        `Aggregate evidence count: ${aggregateSummary.requiredEvidence.length}`
      ]
      : aggregateSummary.requiredEvidence,
    closureChecks: [
      { label: 'Aggregate summary ready', status: aggregateSummary.aggregateReady ? 'pass' : 'blocked' },
      { label: 'Command evidence present', status: aggregateSummary.requiredEvidence.length > 0 ? 'pass' : 'blocked' },
      { label: 'Release artifacts assigned', status: closed ? 'pass' : 'blocked' }
    ],
    blockers: aggregateSummary.blockers,
    nextWorkflow: closed ? 'Studio Workflow Runtime v1.4 Closed' : aggregateSummary.nextWorkflow
  };
}

export function completeWorkflowAction(store, actionId, completedAt) {
  const action = requireRecord(store, 'workflow-action', actionId);
  const completedAction = store.save('workflow-action', {
    ...action,
    status: 'complete',
    completedAt
  });

  if (action.type === 'review-resolution') {
    const review = requireRecord(store, 'review', action.targetObjectId);
    store.save('review', {
      ...review,
      status: 'approved',
      notes: `${review.notes} Resolution completed by ${action.id}.`
    });
  }

  for (const operatorRun of store.list('operator-run').filter((run) => run.actionIds.includes(actionId))) {
    const actions = operatorRun.actionIds.map((item) => store.get('workflow-action', item));
    const allActionsComplete = actions.every((item) => item?.status === 'complete');
    if (allActionsComplete) {
      store.save('operator-run', {
        ...operatorRun,
        status: 'ready',
        updatedAt: completedAt
      });
    }
  }

  return completedAction;
}

function requireRecord(store, modelId, id) {
  const record = store.get(modelId, id);
  if (!record) {
    throw new Error(`Missing ${modelId} record: ${id}`);
  }
  return record;
}
