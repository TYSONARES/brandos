import {
  createDomainSummary,
  createExampleProductCoreState,
  createInMemoryProductCoreStore,
  createBrandProfileOverview,
  completeWorkflowAction,
  evaluateContextPackReadiness,
  summarizeProductCoreState
} from '../../../packages/domain/src/index.mjs';
import { createContractSummary } from '../../../packages/contracts/src/index.mjs';
import { createDesignSystemSummary } from '../../../packages/design-system/src/index.mjs';
import { renderStudioHtml } from './render-html.mjs';

export function createBrandOSStudioShell(options = {}) {
  const store = createInMemoryProductCoreStore(createExampleProductCoreState());
  if (options.completeWorkflowAction) {
    completeWorkflowAction(store, 'workflow_action_example_001', '2026-07-18');
  }
  const state = summarizeProductCoreState(store);
  const brandProfileOverview = createBrandProfileOverview(store, 'brand_profile_example_001');
  const contextPackReadiness = evaluateContextPackReadiness(store, 'context_pack_example_001');
  const contextPackWorkflow = {
    title: 'Context Pack workflow',
    currentStep: contextPackReadiness.ready ? 'ready-for-use' : 'resolve-review',
    actionStatus: contextPackReadiness.nextActions[0]?.status || 'ready',
    owner: 'operator@example.local',
    nextActions: contextPackReadiness.nextActions
  };
  return {
    app: 'BrandOS Studio',
    release: 'v1.0 Development Ready',
    status: 'implementation scaffold',
    state,
    brandProfileOverview,
    contextPackReadiness,
    contextPackWorkflow,
    packages: [
      createDomainSummary(),
      createContractSummary(),
      createDesignSystemSummary()
    ]
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
  console.log(renderStudioHtml(createBrandOSStudioShell()));
}
