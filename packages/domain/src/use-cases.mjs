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
        type: 'claim-review',
        status: 'blocked',
        targetId: claim.id,
        label: `Verify or remove claim ${claim.id}`
      })),
    ...decisions
      .filter((decision) => decision.status !== 'accepted')
      .map((decision) => ({
        type: 'decision-approval',
        status: 'blocked',
        targetId: decision.id,
        label: `Accept or remove decision ${decision.id}`
      })),
    ...reviews
      .filter((review) => review.status === 'changes-needed' || review.status === 'rejected')
      .map((review) => ({
        type: 'review-resolution',
        status: 'pending',
        targetId: review.id,
        label: `Resolve review feedback for ${review.targetObjectId}`
      }))
  ];
  const nextActions = blockingActions.length
    ? blockingActions
    : [
        {
          type: 'context-pack-release',
          status: 'ready',
          targetId: contextPack.id,
          label: `Use context pack ${contextPack.id}`
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
    ready: blockingReasons.length === 0,
    blockingReasons,
    nextActions
  };
}

function requireRecord(store, modelId, id) {
  const record = store.get(modelId, id);
  if (!record) {
    throw new Error(`Missing ${modelId} record: ${id}`);
  }
  return record;
}
