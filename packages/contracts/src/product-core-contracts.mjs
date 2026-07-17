import { listProductCoreModels } from '../../domain/src/product-core-models.mjs';

export function listProductCoreContracts() {
  return listProductCoreModels().map((model) => ({
    id: model.id,
    schema: model.schema,
    fixture: model.fixture,
    requiredFields: model.requiredFields
  }));
}

export function createProductCoreContractSummary() {
  const contracts = listProductCoreContracts();
  return {
    count: contracts.length,
    schemas: contracts.map((contract) => contract.schema),
    fixtures: contracts.map((contract) => contract.fixture)
  };
}
