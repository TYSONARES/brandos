export function createDomainSummary() {
  return {
    name: 'domain',
    source: 'Product Core v0.2',
    owns: ['brand profiles', 'claims', 'decisions', 'reviews', 'workflow runs', 'context packs']
  };
}
