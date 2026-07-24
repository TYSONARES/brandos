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
  createCommandResultSummary,
  createContextPackUsageFlow,
  createDraftReview,
  createHandoffAcceptance,
  createMergeReadiness,
  createOperatorHandoffReadiness,
  createOperatorRunQueue,
  createOperatorStepDetail,
  createOperatorTaskSelection,
  createOperatorWorkflowMap,
  createOperatorWorkflowDesignAggregateSummary,
  createOperatorWorkflowDesignFinalClosure,
  createOperatorRunbookExecution,
  createOperatorRunSummary,
  createPullRequestReadiness,
  createRepositoryBranchStatus,
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
