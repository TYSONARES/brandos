import {
  createDomainSummary,
  createExampleProductCoreState,
  createInMemoryProductCoreStore,
  summarizeProductCoreState
} from '../../../packages/domain/src/index.mjs';
import { createContractSummary } from '../../../packages/contracts/src/index.mjs';
import { createDesignSystemSummary } from '../../../packages/design-system/src/index.mjs';

export function createBrandOSStudioShell() {
  const store = createInMemoryProductCoreStore(createExampleProductCoreState());
  const state = summarizeProductCoreState(store);
  return {
    app: 'BrandOS Studio',
    release: 'v1.0 Development Ready',
    status: 'implementation scaffold',
    state,
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
  return `${shell.app} ${shell.release}: ${shell.status}. Packages: ${packageNames}. Domain models: ${domain.modelCount}. Objects: ${shell.state.objectCount}.`;
}

if (process.argv.includes('--smoke')) {
  console.log(renderSmokeSummary());
}
