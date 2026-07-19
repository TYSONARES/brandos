export function createExampleProductCoreState() {
  const workspaceId = 'workspace_example_001';

  const brandProfile = {
    id: 'brand_profile_example_001',
    workspaceId,
    name: 'Example Brand',
    status: 'draft',
    positioning: {
      category: 'Brand intelligence workspace',
      promise: 'Turns scattered brand knowledge into reusable operating context.',
      differentiators: [
        'Repository-first source of truth',
        'Evidence-linked claims',
        'AI-ready context packs'
      ]
    },
    audience: {
      primary: 'Teams building brand-led products with AI assistance',
      secondary: ['Brand strategists', 'Product teams', 'Design teams']
    },
    voice: {
      traits: ['clear', 'structured', 'confident'],
      avoid: ['unsupported claims', 'generic marketing language', 'chat-only assumptions']
    },
    proofPoints: [
      'Every approved claim links to evidence or a decision.',
      'Every context pack declares scope and expiry.'
    ],
    constraints: [
      'Do not treat draft claims as approved.',
      'Do not generate AI context without source links.'
    ],
    claims: ['claim_example_001'],
    decisions: ['decision_example_001'],
    owner: 'brand-owner@example.local',
    updatedAt: '2026-07-17'
  };

  const claim = {
    id: 'claim_example_001',
    workspaceId,
    statement: 'BrandOS turns scattered brand knowledge into reusable operating context.',
    status: 'supported',
    sourceIds: ['source_example_001'],
    decisionIds: ['decision_example_001'],
    owner: 'strategist@example.local',
    updatedAt: '2026-07-17'
  };

  const decision = {
    id: 'decision_example_001',
    workspaceId,
    title: 'Use repository-first brand truth',
    status: 'accepted',
    rationale: 'AI-assisted brand work needs shared source context that survives individual chat sessions.',
    consequences: [
      'Approved BrandOS objects must be represented in repository-backed product contracts.',
      'Context Packs should cite included Claims and Decisions.'
    ],
    affectedObjects: ['brand_profile_example_001', 'context_pack_example_001'],
    owner: 'brand-owner@example.local',
    decidedAt: '2026-07-17'
  };

  const contextPack = {
    id: 'context_pack_example_001',
    workspaceId,
    name: 'Example Brand Writing Context',
    status: 'draft',
    taskType: 'brand-writing',
    intendedAudience: 'AI agents drafting product and brand copy',
    includedProfileSections: ['positioning', 'audience', 'voice', 'constraints'],
    includedClaims: ['claim_example_001'],
    includedDecisions: ['decision_example_001'],
    excludedTopics: ['pricing', 'legal promises', 'unapproved customer claims'],
    agentInstructions: [
      'Use only included approved or explicitly scoped draft context.',
      'State uncertainty when a requested claim is not included.',
      'Do not invent proof points.'
    ],
    owner: 'operator@example.local',
    expiresAt: '2026-10-17'
  };

  const workflowRun = {
    id: 'workflow_run_example_001',
    workspaceId,
    workflow: 'generate-context-pack',
    status: 'complete',
    inputObjectIds: ['brand_profile_example_001', 'claim_example_001', 'decision_example_001'],
    outputObjectIds: ['context_pack_example_001'],
    owner: 'operator@example.local',
    startedAt: '2026-07-17',
    completedAt: '2026-07-17'
  };

  const review = {
    id: 'review_example_001',
    workspaceId,
    targetObjectId: 'context_pack_example_001',
    targetObjectType: 'context-pack',
    reviewer: 'brand-owner@example.local',
    status: 'changes-needed',
    notes: 'Add expiry date and exclude unapproved customer claims before approval.',
    reviewedAt: '2026-07-17'
  };

  const workflowAction = {
    id: 'workflow_action_example_001',
    workspaceId,
    workflowRunId: 'workflow_run_example_001',
    type: 'review-resolution',
    status: 'pending',
    targetObjectId: 'review_example_001',
    label: 'Resolve review feedback for context_pack_example_001',
    owner: 'operator@example.local',
    createdAt: '2026-07-18'
  };

  const operatorRun = {
    id: 'operator_run_example_001',
    workspaceId,
    workflowRunId: 'workflow_run_example_001',
    objective: 'Resolve Context Pack readiness and prepare handoff.',
    status: 'blocked',
    priority: 'normal',
    actionIds: ['workflow_action_example_001'],
    currentActionId: 'workflow_action_example_001',
    handoffId: 'operator_handoff_example_001',
    auditEventIds: ['audit_event_example_001'],
    owner: 'operator@example.local',
    startedAt: '2026-07-20',
    updatedAt: '2026-07-20'
  };

  return {
    'brand-profile': [brandProfile],
    claim: [claim],
    decision: [decision],
    review: [review],
    'workflow-run': [workflowRun],
    'workflow-action': [workflowAction],
    'operator-run': [operatorRun],
    'context-pack': [contextPack]
  };
}

export function summarizeProductCoreState(store) {
  const summary = store.summary();
  return {
    workspaceCount: new Set(store.list('brand-profile').map((profile) => profile.workspaceId)).size,
    modelCounts: summary,
    objectCount: Object.values(summary).reduce((total, count) => total + count, 0)
  };
}
