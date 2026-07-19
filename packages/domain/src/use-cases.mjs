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

  return completedAction;
}

function requireRecord(store, modelId, id) {
  const record = store.get(modelId, id);
  if (!record) {
    throw new Error(`Missing ${modelId} record: ${id}`);
  }
  return record;
}
