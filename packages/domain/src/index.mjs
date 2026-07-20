import { listProductCoreModels } from './product-core-models.mjs';

export { createExampleProductCoreState, summarizeProductCoreState } from './example-state.mjs';
export { createInMemoryProductCoreStore } from './in-memory-store.mjs';
export { assertKnownProductCoreModel, getProductCoreModel, listProductCoreModels } from './product-core-models.mjs';
export {
  completeWorkflowAction,
  createAgentDraftExecution,
  createAgentHandoffContext,
  createAgentPromptPlan,
  createBrandProfileOverview,
  createContextPackUsageFlow,
  createHandoffAcceptance,
  createOperatorRunQueue,
  createOperatorRunbookExecution,
  createOperatorRunSummary,
  createReviewResolutionWorkflow,
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
