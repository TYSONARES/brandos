import { assertKnownProductCoreModel, listProductCoreModels } from './product-core-models.mjs';

export function createInMemoryProductCoreStore(seed = {}) {
  const collections = new Map(listProductCoreModels().map((model) => [model.id, new Map()]));

  for (const [modelId, records] of Object.entries(seed)) {
    const collection = getCollection(collections, modelId);
    for (const record of records) {
      collection.set(record.id, { ...record });
    }
  }

  return {
    list(modelId) {
      return Array.from(getCollection(collections, modelId).values()).map((record) => ({ ...record }));
    },
    get(modelId, id) {
      const record = getCollection(collections, modelId).get(id);
      return record ? { ...record } : undefined;
    },
    save(modelId, record) {
      assertKnownProductCoreModel(modelId);
      if (!record?.id) {
        throw new Error(`Cannot save ${modelId} without an id`);
      }
      getCollection(collections, modelId).set(record.id, { ...record });
      return { ...record };
    },
    summary() {
      return Object.fromEntries(
        Array.from(collections.entries()).map(([modelId, collection]) => [modelId, collection.size])
      );
    }
  };
}

function getCollection(collections, modelId) {
  assertKnownProductCoreModel(modelId);
  return collections.get(modelId);
}
