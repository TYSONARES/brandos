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
