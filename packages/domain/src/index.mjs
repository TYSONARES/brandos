import { listProductCoreModels } from './product-core-models.mjs';

export { createExampleProductCoreState, summarizeProductCoreState } from './example-state.mjs';
export { createInMemoryProductCoreStore } from './in-memory-store.mjs';
export { assertKnownProductCoreModel, getProductCoreModel, listProductCoreModels } from './product-core-models.mjs';
export {
  completeWorkflowAction,
  createAgentDraftExecution,
  createAgentHandoffClosure,
  createAgentHandoffContext,
  createAgentHandoffRuntimeAggregateSummary,
  createAgentHandoffRuntimeFinalClosure,
  createAgentHandoffRuntimeSummary,
  createAgentPromptPlan,
  createBrandProfileOverview,
  createCiEvidenceSummary,
  createCommandResultSummary,
  createAgentContextReadiness,
  createContextPackHandoffAggregateSummary,
  createContextPackHandoffFinalClosure,
  createContextPackHandoffSourcePackage,
  createContextPackUsageFlow,
  createDraftReview,
  createHandoffAcceptance,
  createMainlineAggregateSummary,
  createMainlineFinalClosure,
  createMainMergePlan,
  createMergeReadiness,
  createOperatorHandoffReadiness,
  createOperatorDecisionState,
  createOperatorRunQueue,
  createOperatorStepDetail,
  createOperatorTaskSelection,
  createOperatorWorkflowMap,
  createOperatorWorkflowDesignAggregateSummary,
  createOperatorWorkflowDesignFinalClosure,
  createOperatorRunbookExecution,
  createOperatorRunSummary,
  createPullRequestReadiness,
  createPullRequestReviewPackage,
  createReadinessEvidenceModel,
  createRepositoryBranchStatus,
  createReviewEvidenceSummary,
  createReviewResolutionWorkflow,
  createRuntimeHealthSummary,
  createStudioHandoffDetail,
  createStudioReadinessDetail,
  createStudioWorkflowRuntimeAggregateSummary,
  createStudioWorkflowRuntimeFinalClosure,
  createStudioStateRecovery,
  createRuntimeValidationSignals,
  createOperatorRecoveryGuidance,
  createRepositoryCollaborationAggregateSummary,
  createRepositoryCollaborationFinalClosure,
  createReleaseTagReadiness,
  createWorkflowSessionSummary,
  createWorkflowTransitionPlan,
  evaluateContextPackReadiness
} from './use-cases.mjs';

export function createDomainSummary() {
  const models = listProductCoreModels();
  return {
    name: 'domain',
    source: 'Product Core v0.2',
    modelCount: models.length,
    owns: models.map((model) => model.id)
  };
}
