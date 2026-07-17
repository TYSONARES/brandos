import { createProductCoreContractSummary } from './product-core-contracts.mjs';

export { createProductCoreContractSummary, listProductCoreContracts } from './product-core-contracts.mjs';

export function createContractSummary() {
  const productCore = createProductCoreContractSummary();
  return {
    name: 'contracts',
    source: 'schemas and fixtures',
    productCore,
    owns: ['schema references', 'fixture references', 'contract metadata']
  };
}
