export const productCoreModels = [
  {
    id: 'brand-profile',
    name: 'Brand Profile',
    schema: 'schemas/brand-profile.schema.json',
    fixture: 'fixtures/brand-profile.example.json',
    requiredFields: [
      'id',
      'workspaceId',
      'name',
      'status',
      'positioning',
      'audience',
      'voice',
      'proofPoints',
      'constraints',
      'claims',
      'decisions',
      'owner',
      'updatedAt'
    ],
    statuses: ['draft', 'approved', 'deprecated']
  },
  {
    id: 'claim',
    name: 'Claim',
    schema: 'schemas/claim.schema.json',
    fixture: 'fixtures/claim.example.json',
    requiredFields: ['id', 'workspaceId', 'statement', 'status', 'sourceIds', 'decisionIds', 'owner', 'updatedAt'],
    statuses: ['draft', 'supported', 'disputed', 'approved']
  },
  {
    id: 'decision',
    name: 'Decision',
    schema: 'schemas/decision.schema.json',
    fixture: 'fixtures/decision.example.json',
    requiredFields: [
      'id',
      'workspaceId',
      'title',
      'status',
      'rationale',
      'consequences',
      'affectedObjects',
      'owner',
      'decidedAt'
    ],
    statuses: ['proposed', 'accepted', 'deprecated', 'rejected']
  },
  {
    id: 'review',
    name: 'Review',
    schema: 'schemas/review.schema.json',
    fixture: 'fixtures/review.example.json',
    requiredFields: ['id', 'workspaceId', 'targetObjectId', 'targetObjectType', 'reviewer', 'status', 'notes', 'reviewedAt'],
    statuses: ['requested', 'changes-needed', 'approved', 'rejected']
  },
  {
    id: 'workflow-run',
    name: 'Workflow Run',
    schema: 'schemas/workflow-run.schema.json',
    fixture: 'fixtures/workflow-run.example.json',
    requiredFields: ['id', 'workspaceId', 'workflow', 'status', 'inputObjectIds', 'outputObjectIds', 'owner', 'startedAt'],
    statuses: ['queued', 'active', 'blocked', 'complete']
  },
  {
    id: 'context-pack',
    name: 'Context Pack',
    schema: 'schemas/context-pack.schema.json',
    fixture: 'fixtures/context-pack.example.json',
    requiredFields: [
      'id',
      'workspaceId',
      'name',
      'status',
      'taskType',
      'intendedAudience',
      'includedProfileSections',
      'includedClaims',
      'includedDecisions',
      'excludedTopics',
      'agentInstructions',
      'owner',
      'expiresAt'
    ],
    statuses: ['draft', 'approved', 'expired']
  }
];

export function listProductCoreModels() {
  return productCoreModels.map((model) => ({ ...model }));
}

export function getProductCoreModel(id) {
  return productCoreModels.find((model) => model.id === id);
}

export function assertKnownProductCoreModel(id) {
  const model = getProductCoreModel(id);
  if (!model) {
    throw new Error(`Unknown Product Core model: ${id}`);
  }
  return model;
}
