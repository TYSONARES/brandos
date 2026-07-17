import { createDomainSummary } from '../../../packages/domain/src/index.mjs';
import { createContractSummary } from '../../../packages/contracts/src/index.mjs';
import { createDesignSystemSummary } from '../../../packages/design-system/src/index.mjs';

export function createBrandOSStudioShell() {
  return {
    app: 'BrandOS Studio',
    release: 'v1.0 Development Ready',
    status: 'implementation scaffold',
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
  return `${shell.app} ${shell.release}: ${shell.status}. Packages: ${packageNames}. Domain models: ${domain.modelCount}.`;
}

if (process.argv.includes('--smoke')) {
  console.log(renderSmokeSummary());
}
