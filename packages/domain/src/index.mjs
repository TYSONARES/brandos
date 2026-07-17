import { listProductCoreModels } from './product-core-models.mjs';

export { assertKnownProductCoreModel, getProductCoreModel, listProductCoreModels } from './product-core-models.mjs';

export function createDomainSummary() {
  const models = listProductCoreModels();
  return {
    name: 'domain',
    source: 'Product Core v0.2',
    modelCount: models.length,
    owns: models.map((model) => model.id)
  };
}
